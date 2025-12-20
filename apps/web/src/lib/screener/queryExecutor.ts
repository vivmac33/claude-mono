// ═══════════════════════════════════════════════════════════════════════════
// MONOMORPH SCREENER EXECUTION ENGINE
// Executes parsed queries against stock database
// ═══════════════════════════════════════════════════════════════════════════

import { 
  ScreenerQuery, 
  FilterCondition, 
  Stock, 
  Operator,
  ParsedQuery,
} from './queryParser';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ScreenerResult {
  success: boolean;
  data: Stock[];
  total: number;
  query: ScreenerQuery;
  executionTime: number;
  message?: string;
}

export interface ConversationState {
  lastQuery: ParsedQuery | null;
  lastResults: Stock[];
  history: ParsedQuery[];
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER EVALUATORS
// ─────────────────────────────────────────────────────────────────────────────

type FilterEvaluator = (stockValue: any, filterValue: any, filterValueEnd?: any) => boolean;

const evaluators: Record<Operator, FilterEvaluator> = {
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
  '>=': (a, b) => a >= b,
  '<=': (a, b) => a <= b,
  '=': (a, b) => a === b,
  '!=': (a, b) => a !== b,
  'between': (a, b, c) => a >= b && a <= c,
  'in': (a, b) => Array.isArray(b) && b.includes(a),
  'not_in': (a, b) => Array.isArray(b) && !b.includes(a),
  'contains': (a, b) => typeof a === 'string' && typeof b === 'string' && a.toLowerCase().includes(b.toLowerCase()),
};

/**
 * Evaluate a single filter condition against a stock
 */
function evaluateFilter(stock: Stock, filter: FilterCondition): boolean {
  const stockValue = (stock as any)[filter.field];
  
  if (stockValue === undefined || stockValue === null) {
    return false;
  }
  
  const evaluator = evaluators[filter.operator];
  if (!evaluator) {
    // Unknown operator - pass through (don't filter)
    return true;
  }
  
  return evaluator(stockValue, filter.value, filter.valueEnd);
}

/**
 * Evaluate all filters against a stock
 */
function evaluateAllFilters(stock: Stock, filters: FilterCondition[]): boolean {
  return filters.every(filter => evaluateFilter(stock, filter));
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTOR FILTERING
// ─────────────────────────────────────────────────────────────────────────────

function matchesSectorFilter(stock: Stock, include?: string[], exclude?: string[]): boolean {
  // Check exclusions first
  if (exclude && exclude.length > 0) {
    const stockSectorLower = stock.sector.toLowerCase();
    for (const excludedSector of exclude) {
      if (stockSectorLower.includes(excludedSector.toLowerCase()) ||
          excludedSector.toLowerCase().includes(stockSectorLower)) {
        return false;
      }
    }
  }
  
  // Check inclusions
  if (include && include.length > 0) {
    const stockSectorLower = stock.sector.toLowerCase();
    return include.some(includedSector => 
      stockSectorLower.includes(includedSector.toLowerCase()) ||
      includedSector.toLowerCase().includes(stockSectorLower)
    );
  }
  
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// SORTING
// ─────────────────────────────────────────────────────────────────────────────

function sortStocks(stocks: Stock[], sort?: ScreenerQuery['sort']): Stock[] {
  if (!sort) return stocks;
  
  return [...stocks].sort((a, b) => {
    const aVal = (a as any)[sort.field];
    const bVal = (b as any)[sort.field];
    
    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    
    const comparison = aVal < bVal ? -1 : 1;
    return sort.order === 'asc' ? comparison : -comparison;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXECUTOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Execute a screener query against a stock database
 */
export function executeScreenerQuery(
  query: ScreenerQuery, 
  stocks: Stock[]
): ScreenerResult {
  const startTime = performance.now();
  
  try {
    // Step 1: Apply filters
    let results = stocks.filter(stock => evaluateAllFilters(stock, query.filters));
    
    // Step 2: Apply sector filtering
    results = results.filter(stock => 
      matchesSectorFilter(
        stock, 
        query.include?.sectors, 
        query.exclude?.sectors
      )
    );
    
    // Step 3: Apply symbol exclusions
    if (query.exclude?.symbols && query.exclude.symbols.length > 0) {
      const excludeSet = new Set(query.exclude.symbols.map(s => s.toUpperCase()));
      results = results.filter(stock => !excludeSet.has(stock.symbol.toUpperCase()));
    }
    
    // Step 4: Sort
    results = sortStocks(results, query.sort);
    
    // Step 5: Apply limit and offset
    const total = results.length;
    const offset = query.offset || 0;
    const limit = query.limit || 20;
    results = results.slice(offset, offset + limit);
    
    const executionTime = performance.now() - startTime;
    
    return {
      success: true,
      data: results,
      total,
      query,
      executionTime,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      total: 0,
      query,
      executionTime: performance.now() - startTime,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSATION CONTEXT MANAGER
// ─────────────────────────────────────────────────────────────────────────────

export class ConversationContext {
  private state: ConversationState = {
    lastQuery: null,
    lastResults: [],
    history: [],
  };
  
  /**
   * Process a query with context awareness
   */
  processQuery(
    parsedQuery: ParsedQuery, 
    stocks: Stock[]
  ): ScreenerResult & { interpretation: string } {
    // For refinement queries, merge with previous context
    if (parsedQuery.refinement && parsedQuery.query) {
      // Apply refinement to last results instead of full database
      const baseStocks = this.state.lastResults.length > 0 
        ? this.state.lastResults 
        : stocks;
      
      const result = executeScreenerQuery(parsedQuery.query, baseStocks);
      
      // Update state
      this.state.lastQuery = parsedQuery;
      this.state.lastResults = result.data;
      this.state.history.push(parsedQuery);
      
      return {
        ...result,
        interpretation: this.generateInterpretation(parsedQuery, result),
      };
    }
    
    // Fresh query
    if (parsedQuery.query) {
      const result = executeScreenerQuery(parsedQuery.query, stocks);
      
      // Update state
      this.state.lastQuery = parsedQuery;
      this.state.lastResults = result.data;
      this.state.history.push(parsedQuery);
      
      return {
        ...result,
        interpretation: this.generateInterpretation(parsedQuery, result),
      };
    }
    
    return {
      success: false,
      data: [],
      total: 0,
      query: { filters: [] },
      executionTime: 0,
      message: 'Could not parse query',
      interpretation: 'I could not understand this query. Try something like "stocks with PE < 15 and ROE > 20%"',
    };
  }
  
  /**
   * Generate human-readable interpretation
   */
  private generateInterpretation(query: ParsedQuery, result: ScreenerResult): string {
    const parts: string[] = [];
    
    if (query.refinement) {
      parts.push('Refining previous results:');
    }
    
    if (query.query?.filters && query.query.filters.length > 0) {
      const filterDescriptions = query.query.filters.map(f => {
        const opMap: Record<string, string> = {
          '>': 'greater than',
          '<': 'less than',
          '>=': 'at least',
          '<=': 'at most',
          '=': 'equal to',
          '!=': 'not equal to',
          'between': 'between',
          'contains': 'contains',
          'in': 'in',
          'not_in': 'not in',
        };
        const opText = opMap[f.operator] || f.operator;
        
        return `${f.field} ${opText} ${f.value}`;
      });
      parts.push(`Filters: ${filterDescriptions.join(', ')}`);
    }
    
    if (query.query?.include?.sectors) {
      parts.push(`Including sectors: ${query.query.include.sectors.join(', ')}`);
    }
    
    if (query.query?.exclude?.sectors) {
      parts.push(`Excluding sectors: ${query.query.exclude.sectors.join(', ')}`);
    }
    
    if (query.query?.sort) {
      parts.push(`Sorted by: ${query.query.sort.field} (${query.query.sort.order})`);
    }
    
    parts.push(`Found ${result.total} stocks, showing ${result.data.length}`);
    
    return parts.join('. ');
  }
  
  /**
   * Get last results for chaining
   */
  getLastResults(): Stock[] {
    return this.state.lastResults;
  }
  
  /**
   * Get last query
   */
  getLastQuery(): ParsedQuery | null {
    return this.state.lastQuery;
  }
  
  /**
   * Clear context
   */
  clear(): void {
    this.state = {
      lastQuery: null,
      lastResults: [],
      history: [],
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default {
  executeScreenerQuery,
  ConversationContext,
};
