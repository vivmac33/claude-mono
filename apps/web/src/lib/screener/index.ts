// ═══════════════════════════════════════════════════════════════════════════
// MONOMORPH SCREENER - MAIN INTERFACE
// Unified interface for natural language stock screening
// ═══════════════════════════════════════════════════════════════════════════

import { 
  parseNaturalQuery, 
  ParsedQuery, 
  Stock, 
  ScreenerQuery,
  QUERYABLE_FIELDS,
  SECTORS,
} from './queryParser';

import { 
  executeScreenerQuery, 
  ConversationContext, 
  ScreenerResult,
} from './queryExecutor';

import { getStockDatabase } from './mockDatabase';

// Re-export numeric engine
export * from './numericEngine';

// Re-export intent analyzer
export * from './intentAnalyzer';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ScreenerResponse {
  success: boolean;
  type: 'screener' | 'single_stock' | 'comparison' | 'watchlist' | 'alert' | 'unknown' | 'help';
  data: Stock[];
  total: number;
  interpretation: string;
  suggestions?: string[];
  columns?: string[]; // Which columns to show in results
  executionTime: number;
  error?: string;
}

export interface ScreenerConfig {
  defaultLimit?: number;
  stockDatabase?: Stock[];
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREENER CLASS
// ─────────────────────────────────────────────────────────────────────────────

export class Screener {
  private context: ConversationContext;
  private stocks: Stock[];
  private config: ScreenerConfig;
  
  constructor(config: ScreenerConfig = {}) {
    this.context = new ConversationContext();
    this.stocks = config.stockDatabase || getStockDatabase();
    this.config = {
      defaultLimit: 20,
      ...config,
    };
  }
  
  /**
   * Main query interface - process natural language queries
   */
  query(input: string): ScreenerResponse {
    const startTime = performance.now();
    
    try {
      // Handle help/syntax queries
      if (this.isHelpQuery(input)) {
        return this.generateHelpResponse();
      }
      
      // Parse the natural language query
      const parsedQuery = parseNaturalQuery(input, this.context.getLastQuery() || undefined);
      
      // Execute based on query type
      switch (parsedQuery.type) {
        case 'screener':
          return this.handleScreenerQuery(parsedQuery, startTime);
        
        case 'single_stock':
          return this.handleSingleStockQuery(parsedQuery, startTime);
        
        case 'comparison':
          return this.handleComparisonQuery(parsedQuery, startTime);
        
        case 'watchlist':
          return this.handleWatchlistQuery(parsedQuery, startTime);
        
        case 'alert':
          return this.handleAlertQuery(parsedQuery, startTime);
        
        default:
          return this.handleUnknownQuery(input, startTime);
      }
    } catch (error) {
      return {
        success: false,
        type: 'unknown',
        data: [],
        total: 0,
        interpretation: 'An error occurred while processing your query.',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: performance.now() - startTime,
      };
    }
  }
  
  /**
   * Handle screener queries with filters
   */
  private handleScreenerQuery(parsed: ParsedQuery, startTime: number): ScreenerResponse {
    if (!parsed.query) {
      return {
        success: false,
        type: 'screener',
        data: [],
        total: 0,
        interpretation: 'Could not parse filter conditions.',
        suggestions: [
          'Try: "stocks with PE < 15"',
          'Try: "Mcap > $5B and ROE > 15%"',
          'Try: "energy stocks with PE < 12"',
        ],
        executionTime: performance.now() - startTime,
      };
    }
    
    const result = this.context.processQuery(parsed, this.stocks);
    
    // Determine which columns to show based on query
    const columns = this.determineColumns(parsed.query);
    
    return {
      success: result.success,
      type: 'screener',
      data: result.data,
      total: result.total,
      interpretation: result.interpretation,
      columns,
      executionTime: performance.now() - startTime,
      suggestions: result.data.length === 0 ? [
        'Try relaxing your filters',
        'Check sector spelling',
        'Use "help" to see available fields',
      ] : undefined,
    };
  }
  
  /**
   * Handle single stock queries
   */
  private handleSingleStockQuery(parsed: ParsedQuery, startTime: number): ScreenerResponse {
    const symbol = parsed.symbols?.[0];
    if (!symbol) {
      return {
        success: false,
        type: 'single_stock',
        data: [],
        total: 0,
        interpretation: 'Could not identify the stock symbol.',
        executionTime: performance.now() - startTime,
      };
    }
    
    const stock = this.stocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
    
    if (!stock) {
      return {
        success: false,
        type: 'single_stock',
        data: [],
        total: 0,
        interpretation: `Stock "${symbol}" not found in database.`,
        suggestions: [
          `Did you mean one of: ${this.findSimilarSymbols(symbol).join(', ')}?`,
        ],
        executionTime: performance.now() - startTime,
      };
    }
    
    return {
      success: true,
      type: 'single_stock',
      data: [stock],
      total: 1,
      interpretation: `Showing data for ${stock.name} (${stock.symbol})`,
      columns: Object.keys(QUERYABLE_FIELDS).slice(0, 15), // Show main fields
      executionTime: performance.now() - startTime,
    };
  }
  
  /**
   * Handle comparison queries
   */
  private handleComparisonQuery(parsed: ParsedQuery, startTime: number): ScreenerResponse {
    let stocksToCompare: Stock[] = [];
    
    // If specific symbols mentioned
    if (parsed.symbols && parsed.symbols.length > 0) {
      for (const symbol of parsed.symbols) {
        const stock = this.stocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
        if (stock) stocksToCompare.push(stock);
      }
    }
    
    // If sector comparison
    if (parsed.query?.include?.sectors) {
      const sectorStocks = this.stocks.filter(s => 
        parsed.query!.include!.sectors!.some(sector =>
          s.sector.toLowerCase().includes(sector.toLowerCase())
        )
      );
      stocksToCompare = [...stocksToCompare, ...sectorStocks];
    }
    
    // Remove duplicates
    stocksToCompare = [...new Map(stocksToCompare.map(s => [s.symbol, s])).values()];
    
    // Limit
    stocksToCompare = stocksToCompare.slice(0, 20);
    
    return {
      success: stocksToCompare.length > 0,
      type: 'comparison',
      data: stocksToCompare,
      total: stocksToCompare.length,
      interpretation: `Comparing ${stocksToCompare.length} stocks`,
      columns: ['symbol', 'name', 'sector', 'mcap', 'pe', 'pb', 'roe', 'roa', 'debtToEquity', 'dividendYield', 'return1y'],
      executionTime: performance.now() - startTime,
    };
  }
  
  /**
   * Handle watchlist queries
   */
  private handleWatchlistQuery(parsed: ParsedQuery, startTime: number): ScreenerResponse {
    // For now, treat like screener but mark as watchlist
    const screenerResult = this.handleScreenerQuery(parsed, startTime);
    
    return {
      ...screenerResult,
      type: 'watchlist',
      interpretation: `Watchlist: ${screenerResult.interpretation}. (Note: User profiles not yet implemented - results shown but not saved)`,
    };
  }
  
  /**
   * Handle alert queries
   */
  private handleAlertQuery(parsed: ParsedQuery, startTime: number): ScreenerResponse {
    const screenerResult = this.handleScreenerQuery(parsed, startTime);
    
    return {
      ...screenerResult,
      type: 'alert',
      interpretation: `Alert criteria: ${screenerResult.interpretation}. (Note: Alert system not yet implemented - showing matching stocks)`,
    };
  }
  
  /**
   * Handle unknown/unparseable queries
   */
  private handleUnknownQuery(input: string, startTime: number): ScreenerResponse {
    return {
      success: false,
      type: 'unknown',
      data: [],
      total: 0,
      interpretation: `I couldn't understand "${input}". Try rephrasing or use "help" for syntax guide.`,
      suggestions: [
        'Try: "stocks with PE < 15 and ROE > 20%"',
        'Try: "top 20 by market cap in technology"',
        'Try: "energy stocks with low PE"',
        'Type "help" for full syntax guide',
      ],
      executionTime: performance.now() - startTime,
    };
  }
  
  /**
   * Generate help response
   */
  private generateHelpResponse(): ScreenerResponse {
    const fieldList = Object.entries(QUERYABLE_FIELDS)
      .slice(0, 20)
      .map(([field, config]) => `  ${field}: ${config.description}`)
      .join('\n');
    
    const interpretation = `
**Screener Query Syntax**

**Basic Filters:**
• PE < 15
• Mcap > $5B (or 5000000000)
• ROE >= 20%
• dividendYield > 3%

**Sector Filters:**
• "in energy sector"
• "tech stocks"
• "exclude pharma, healthcare"

**Sorting:**
• "top 20 by market cap"
• "biggest volume drop"
• "descending volume"

**Returns:**
• "6% average return in 3 years"
• "CAGR > 15%"

**Follow-ups:**
• "+1 exclude energy"
• "+2 top 5 only"

**Available Fields (sample):**
${fieldList}

**Available Sectors:**
${SECTORS.slice(0, 10).join(', ')}...
    `.trim();
    
    return {
      success: true,
      type: 'help',
      data: [],
      total: 0,
      interpretation,
      executionTime: 0,
    };
  }
  
  /**
   * Check if query is asking for help
   */
  private isHelpQuery(input: string): boolean {
    const lower = input.toLowerCase().trim();
    return lower === 'help' || lower === '?' || lower === 'syntax' || 
           lower.includes('how do i') || lower.includes('how to');
  }
  
  /**
   * Determine which columns to show based on query
   */
  private determineColumns(query: ScreenerQuery): string[] {
    const baseColumns = ['symbol', 'name', 'sector', 'price', 'changePct', 'mcap'];
    const filterFields = query.filters.map(f => f.field);
    const sortField = query.sort?.field;
    
    const extraColumns = new Set<string>();
    
    // Add filter fields
    filterFields.forEach(f => extraColumns.add(f));
    
    // Add sort field
    if (sortField) extraColumns.add(sortField);
    
    // Add related fields
    if (filterFields.includes('pe') || filterFields.includes('pb')) {
      extraColumns.add('pe');
      extraColumns.add('pb');
      extraColumns.add('ps');
    }
    
    if (filterFields.includes('roe') || filterFields.includes('roa')) {
      extraColumns.add('roe');
      extraColumns.add('roa');
      extraColumns.add('roce');
    }
    
    if (filterFields.some(f => f.includes('return') || f.includes('cagr'))) {
      extraColumns.add('return1y');
      extraColumns.add('return3y');
      extraColumns.add('cagr3y');
    }
    
    if (filterFields.some(f => f.includes('volume'))) {
      extraColumns.add('volume');
      extraColumns.add('avgVolume20d');
      extraColumns.add('volumeChange5d');
    }
    
    // Combine and dedupe
    const allColumns = [...baseColumns, ...extraColumns].filter((v, i, a) => a.indexOf(v) === i);
    
    return allColumns.slice(0, 12); // Limit columns
  }
  
  /**
   * Find similar symbols for suggestions
   */
  private findSimilarSymbols(input: string): string[] {
    const inputUpper = input.toUpperCase();
    return this.stocks
      .filter(s => 
        s.symbol.includes(inputUpper) || 
        inputUpper.includes(s.symbol) ||
        s.name.toLowerCase().includes(input.toLowerCase())
      )
      .slice(0, 5)
      .map(s => s.symbol);
  }
  
  /**
   * Clear conversation context
   */
  clearContext(): void {
    this.context.clear();
  }
  
  /**
   * Get last results (for chaining)
   */
  getLastResults(): Stock[] {
    return this.context.getLastResults();
  }
  
  /**
   * Update stock database
   */
  setStockDatabase(stocks: Stock[]): void {
    this.stocks = stocks;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SINGLETON INSTANCE
// ─────────────────────────────────────────────────────────────────────────────

let screenerInstance: Screener | null = null;

export function getScreener(): Screener {
  if (!screenerInstance) {
    screenerInstance = new Screener();
  }
  return screenerInstance;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export { 
  parseNaturalQuery, 
  QUERYABLE_FIELDS,
  SECTORS,
  resolveFieldName,
  resolveSectorName,
} from './queryParser';

export { executeScreenerQuery, ConversationContext } from './queryExecutor';
export { getStockDatabase, getStockBySymbol } from './mockDatabase';
export type { Stock, ParsedQuery, ScreenerQuery, FilterCondition, SortCondition } from './queryParser';
export type { ScreenerResult } from './queryExecutor';
