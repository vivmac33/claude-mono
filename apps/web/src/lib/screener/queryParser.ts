// ═══════════════════════════════════════════════════════════════════════════
// MONOMORPH SCREENER ENGINE
// Advanced query parsing and execution for stock screening
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type Operator = '>' | '<' | '>=' | '<=' | '=' | '!=' | 'between' | 'in' | 'not_in' | 'contains';

export type SortOrder = 'asc' | 'desc';

export type FieldType = 'number' | 'string' | 'boolean' | 'date';

export interface FilterCondition {
  field: string;
  operator: Operator;
  value: number | string | boolean | number[] | string[];
  valueEnd?: number; // For 'between' operator
}

export interface SortCondition {
  field: string;
  order: SortOrder;
}

export interface ScreenerQuery {
  filters: FilterCondition[];
  sort?: SortCondition;
  limit?: number;
  offset?: number;
  exclude?: {
    sectors?: string[];
    symbols?: string[];
  };
  include?: {
    sectors?: string[];
    symbols?: string[];
  };
}

export interface ParsedQuery {
  type: 'screener' | 'single_stock' | 'comparison' | 'watchlist' | 'alert' | 'unknown';
  query?: ScreenerQuery;
  symbols?: string[];
  intent?: string;
  timeframe?: string;
  action?: 'create' | 'modify' | 'delete' | 'view';
  refinement?: boolean; // Is this a +1, +2 follow-up?
  raw: string;
}

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  mcap: number;
  price: number;
  change: number;
  changePct: number;
  pe: number;
  pb: number;
  ps: number;
  roe: number;
  roa: number;
  roce: number;
  debtToEquity: number;
  currentRatio: number;
  dividendYield: number;
  eps: number;
  revenue: number;
  revenueGrowth: number;
  profitGrowth: number;
  volume: number;
  avgVolume20d: number;
  volumeChange5d: number; // % change in avg volume over 5 days
  high52w: number;
  low52w: number;
  return1d: number;
  return1w: number;
  return1m: number;
  return3m: number;
  return6m: number;
  return1y: number;
  return3y: number;
  cagr3y: number;
  beta: number;
  rsi: number;
  // Delivery data (unique to Indian markets)
  deliveryPct: number;
  deliveryPctAvg: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// FIELD DEFINITIONS - What can be queried
// ─────────────────────────────────────────────────────────────────────────────

export const QUERYABLE_FIELDS: Record<string, { 
  type: FieldType; 
  aliases: string[]; 
  description: string;
  unit?: string;
}> = {
  // Identification
  symbol: { type: 'string', aliases: ['ticker', 'stock'], description: 'Stock symbol' },
  name: { type: 'string', aliases: ['company', 'company_name'], description: 'Company name' },
  sector: { type: 'string', aliases: ['sect'], description: 'Business sector' },
  industry: { type: 'string', aliases: ['ind'], description: 'Industry classification' },
  
  // Valuation
  mcap: { type: 'number', aliases: ['market_cap', 'marketcap', 'market cap', 'cap'], description: 'Market capitalization', unit: '$' },
  pe: { type: 'number', aliases: ['p/e', 'pe_ratio', 'pe ratio', 'price to earnings'], description: 'Price to Earnings ratio' },
  pb: { type: 'number', aliases: ['p/b', 'pb_ratio', 'pb ratio', 'price to book'], description: 'Price to Book ratio' },
  ps: { type: 'number', aliases: ['p/s', 'ps_ratio', 'ps ratio', 'price to sales'], description: 'Price to Sales ratio' },
  
  // Profitability
  roe: { type: 'number', aliases: ['return on equity'], description: 'Return on Equity', unit: '%' },
  roa: { type: 'number', aliases: ['return on assets'], description: 'Return on Assets', unit: '%' },
  roce: { type: 'number', aliases: ['return on capital'], description: 'Return on Capital Employed', unit: '%' },
  eps: { type: 'number', aliases: ['earnings per share'], description: 'Earnings Per Share', unit: '$' },
  
  // Financial Health
  debtToEquity: { type: 'number', aliases: ['d/e', 'de', 'debt_to_equity', 'debt to equity', 'debt/equity'], description: 'Debt to Equity ratio' },
  currentRatio: { type: 'number', aliases: ['current_ratio', 'current ratio', 'cr'], description: 'Current Ratio' },
  
  // Dividends
  dividendYield: { type: 'number', aliases: ['div_yield', 'dividend yield', 'yield', 'div yield', 'dy'], description: 'Dividend Yield', unit: '%' },
  
  // Growth
  revenue: { type: 'number', aliases: ['sales', 'rev'], description: 'Total Revenue', unit: '$' },
  revenueGrowth: { type: 'number', aliases: ['revenue_growth', 'revenue growth', 'sales growth', 'rev growth'], description: 'Revenue Growth YoY', unit: '%' },
  profitGrowth: { type: 'number', aliases: ['profit_growth', 'profit growth', 'earnings growth', 'np growth'], description: 'Profit Growth YoY', unit: '%' },
  
  // Price & Volume
  price: { type: 'number', aliases: ['current_price', 'cmp', 'ltp'], description: 'Current Price', unit: '$' },
  change: { type: 'number', aliases: ['price_change'], description: 'Price Change', unit: '$' },
  changePct: { type: 'number', aliases: ['change_pct', 'change %', 'change_percent', 'pct change'], description: 'Price Change %', unit: '%' },
  volume: { type: 'number', aliases: ['vol', 'today_volume'], description: 'Trading Volume' },
  avgVolume20d: { type: 'number', aliases: ['avg_volume', 'average volume', 'avg vol'], description: '20-day Average Volume' },
  volumeChange5d: { type: 'number', aliases: ['volume_change', 'vol change', 'volume trend'], description: '5-day Volume Change', unit: '%' },
  
  // 52-Week Range
  high52w: { type: 'number', aliases: ['52w_high', '52 week high', 'yearly high', '52wh'], description: '52-Week High', unit: '$' },
  low52w: { type: 'number', aliases: ['52w_low', '52 week low', 'yearly low', '52wl'], description: '52-Week Low', unit: '$' },
  
  // Returns
  return1d: { type: 'number', aliases: ['daily return', '1d return', 'today return'], description: '1-Day Return', unit: '%' },
  return1w: { type: 'number', aliases: ['weekly return', '1w return', 'week return'], description: '1-Week Return', unit: '%' },
  return1m: { type: 'number', aliases: ['monthly return', '1m return', 'month return'], description: '1-Month Return', unit: '%' },
  return3m: { type: 'number', aliases: ['3m return', 'quarterly return'], description: '3-Month Return', unit: '%' },
  return6m: { type: 'number', aliases: ['6m return', 'half year return'], description: '6-Month Return', unit: '%' },
  return1y: { type: 'number', aliases: ['yearly return', '1y return', 'annual return', '1 year return'], description: '1-Year Return', unit: '%' },
  return3y: { type: 'number', aliases: ['3y return', '3 year return'], description: '3-Year Total Return', unit: '%' },
  cagr3y: { type: 'number', aliases: ['3y cagr', '3 year cagr', 'cagr'], description: '3-Year CAGR', unit: '%' },
  
  // Technical
  beta: { type: 'number', aliases: [], description: 'Beta (volatility vs market)' },
  rsi: { type: 'number', aliases: ['rsi14', 'relative strength'], description: 'RSI (14-day)' },
  
  // Delivery (Indian market specific)
  deliveryPct: { type: 'number', aliases: ['delivery', 'delivery %', 'delivery_pct', 'del pct'], description: 'Delivery Percentage', unit: '%' },
  deliveryPctAvg: { type: 'number', aliases: ['avg delivery', 'delivery avg'], description: 'Average Delivery Percentage', unit: '%' },
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTOR DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export const SECTORS = [
  'Technology', 'Financials', 'Healthcare', 'Consumer Discretionary', 
  'Consumer Staples', 'Energy', 'Industrials', 'Materials', 'Real Estate',
  'Communication Services', 'Utilities', 'Pharma', 'Biotech', 'Auto',
  'Banking', 'NBFC', 'IT', 'FMCG', 'Metals', 'Oil & Gas', 'Power',
  'Telecom', 'Media', 'Chemicals', 'Cement', 'Infrastructure'
];

export const SECTOR_ALIASES: Record<string, string[]> = {
  'Technology': ['tech', 'it', 'software', 'information technology'],
  'Financials': ['finance', 'financial', 'banking', 'banks', 'nbfc'],
  'Healthcare': ['health', 'hospital', 'hospitals'],
  'Pharma': ['pharmaceutical', 'pharmaceuticals', 'drug', 'drugs'],
  'Biotech': ['biotechnology', 'bio'],
  'Energy': ['oil', 'gas', 'oil & gas', 'petroleum', 'power'],
  'Auto': ['automobile', 'automotive', 'car', 'cars', 'ev', 'electric vehicle'],
  'Consumer Discretionary': ['consumer', 'retail', 'discretionary'],
  'Consumer Staples': ['staples', 'fmcg', 'food'],
  'Industrials': ['industrial', 'manufacturing'],
  'Materials': ['material', 'metals', 'mining', 'steel', 'cement', 'chemicals'],
  'Real Estate': ['realty', 'property', 'housing'],
  'Utilities': ['utility', 'power', 'electricity'],
};

// ─────────────────────────────────────────────────────────────────────────────
// VALUE PARSERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse human-readable numbers like "5B", "100M", "1.5T", "$5B"
 */
export function parseHumanNumber(input: string): number | null {
  const cleaned = input.replace(/[$,\s]/g, '').toUpperCase();
  const match = cleaned.match(/^(-?[\d.]+)\s*([KMBT])?$/);
  
  if (!match) return null;
  
  const num = parseFloat(match[1]);
  const suffix = match[2];
  
  const multipliers: Record<string, number> = {
    'K': 1e3,
    'M': 1e6,
    'B': 1e9,
    'T': 1e12,
  };
  
  return suffix ? num * multipliers[suffix] : num;
}

/**
 * Parse percentage values like "6%", "6 percent", "6"
 */
export function parsePercentage(input: string): number | null {
  const cleaned = input.replace(/%|percent/gi, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Parse time period like "3 years", "5 days", "1 month"
 */
export function parseTimePeriod(input: string): { value: number; unit: string } | null {
  const match = input.match(/(\d+)\s*(year|yr|y|month|mo|m|week|wk|w|day|d)s?/i);
  if (!match) return null;
  
  const value = parseInt(match[1]);
  const unitMap: Record<string, string> = {
    'year': 'year', 'yr': 'year', 'y': 'year',
    'month': 'month', 'mo': 'month', 'm': 'month',
    'week': 'week', 'wk': 'week', 'w': 'week',
    'day': 'day', 'd': 'day',
  };
  
  return { value, unit: unitMap[match[2].toLowerCase()] || match[2] };
}

// ─────────────────────────────────────────────────────────────────────────────
// FIELD RESOLVER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve field name from aliases
 */
export function resolveFieldName(input: string): string | null {
  const normalized = input.toLowerCase().trim();
  
  // Direct match
  if (QUERYABLE_FIELDS[normalized]) return normalized;
  
  // Alias match
  for (const [field, config] of Object.entries(QUERYABLE_FIELDS)) {
    if (config.aliases.some(alias => alias.toLowerCase() === normalized)) {
      return field;
    }
  }
  
  // Fuzzy match (remove spaces, underscores)
  const fuzzyInput = normalized.replace(/[\s_-]/g, '');
  for (const [field, config] of Object.entries(QUERYABLE_FIELDS)) {
    const fuzzyField = field.toLowerCase().replace(/[\s_-]/g, '');
    if (fuzzyField === fuzzyInput) return field;
    
    for (const alias of config.aliases) {
      const fuzzyAlias = alias.toLowerCase().replace(/[\s_-]/g, '');
      if (fuzzyAlias === fuzzyInput) return field;
    }
  }
  
  return null;
}

/**
 * Resolve sector name from aliases
 */
export function resolveSectorName(input: string): string | null {
  const normalized = input.toLowerCase().trim();
  
  // Direct match
  const directMatch = SECTORS.find(s => s.toLowerCase() === normalized);
  if (directMatch) return directMatch;
  
  // Alias match
  for (const [sector, aliases] of Object.entries(SECTOR_ALIASES)) {
    if (aliases.some(alias => alias.toLowerCase() === normalized)) {
      return sector;
    }
  }
  
  // Partial match
  const partialMatch = SECTORS.find(s => 
    s.toLowerCase().includes(normalized) || normalized.includes(s.toLowerCase())
  );
  
  return partialMatch || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// QUERY PARSER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Main query parser - converts natural language to structured query
 */
export function parseNaturalQuery(input: string, context?: ParsedQuery): ParsedQuery {
  const normalized = input.trim();
  
  // Check for refinement queries (+1, +2, etc.)
  if (/^\+\d/.test(normalized)) {
    return parseRefinementQuery(normalized, context);
  }
  
  // Detect query type
  const queryType = detectQueryType(normalized);
  
  switch (queryType) {
    case 'screener':
      return parseScreenerQuery(normalized);
    case 'single_stock':
      return parseSingleStockQuery(normalized);
    case 'comparison':
      return parseComparisonQuery(normalized);
    case 'watchlist':
      return parseWatchlistQuery(normalized);
    case 'alert':
      return parseAlertQuery(normalized);
    default:
      return { type: 'unknown', raw: input };
  }
}

/**
 * Detect the type of query
 */
function detectQueryType(input: string): ParsedQuery['type'] {
  const lower = input.toLowerCase();
  
  // Watchlist indicators
  if (lower.includes('watchlist') || lower.includes('watch list') || lower.includes('add to')) {
    return 'watchlist';
  }
  
  // Alert indicators
  if (lower.includes('alert') || lower.includes('notify') || lower.includes('set an alert')) {
    return 'alert';
  }
  
  // Comparison indicators
  if (lower.includes('compare') || lower.includes('vs') || lower.includes('versus') || lower.includes('comparison')) {
    return 'comparison';
  }
  
  // Single stock (has a specific symbol mentioned without filter words)
  const symbolMatch = input.match(/\b([A-Z]{1,12})\b/);
  const hasFilters = /(?:>|<|=|greater|less|above|below|between|more than|at least)/i.test(lower);
  const hasListWords = /(stocks|companies|list|all|give me|show me|find|screen|filter)/i.test(lower);
  
  if (symbolMatch && !hasFilters && !hasListWords) {
    return 'single_stock';
  }
  
  // Default to screener for filter-like queries
  if (hasFilters || hasListWords) {
    return 'screener';
  }
  
  return 'unknown';
}

/**
 * Parse screener query with filters
 */
function parseScreenerQuery(input: string): ParsedQuery {
  const filters: FilterCondition[] = [];
  const lower = input.toLowerCase();
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN: Field Operator Value (e.g., "PE < 12", "Mcap > $5B")
  // ═══════════════════════════════════════════════════════════════════════════
  
  const conditionPatterns = [
    // "PE < 12", "Mcap > 5B", "ROE >= 15%"
    /(\w+(?:\s+\w+)?)\s*(>=|<=|>|<|=|!=)\s*(\$?[\d.]+\s*[KMBT%]?)/gi,
    // "PE less than 12", "Mcap greater than 5B"
    /(\w+(?:\s+\w+)?)\s+(less than|greater than|more than|at least|at most|equal to|not equal to)\s*(\$?[\d.]+\s*[KMBT%]?)/gi,
    // "PE below 12", "Mcap above 5B"  
    /(\w+(?:\s+\w+)?)\s+(below|above|under|over)\s*(\$?[\d.]+\s*[KMBT%]?)/gi,
    // "with PE of 12", "having Mcap of 5B"
    /(?:with|having)\s+(\w+(?:\s+\w+)?)\s+(?:of|at)\s*(\$?[\d.]+\s*[KMBT%]?)/gi,
  ];
  
  for (const pattern of conditionPatterns) {
    let match;
    while ((match = pattern.exec(input)) !== null) {
      const fieldRaw = match[1];
      const operatorRaw = match[2];
      const valueRaw = match[3] || match[2]; // Handle different capture groups
      
      const field = resolveFieldName(fieldRaw);
      if (!field) continue;
      
      const operator = normalizeOperator(operatorRaw);
      const value = parseValue(valueRaw, field);
      
      if (value !== null) {
        filters.push({ field, operator, value });
      }
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN: Return/CAGR queries (e.g., "6% return in 3 years")
  // ═══════════════════════════════════════════════════════════════════════════
  
  const returnMatch = lower.match(/([\d.]+)\s*%?\s*(?:avg|average)?\s*(?:return|cagr|growth)\s*(?:in|over|for)?\s*(?:last|past)?\s*(\d+)\s*(year|yr|month|mo)/i);
  if (returnMatch) {
    const returnValue = parseFloat(returnMatch[1]);
    const period = parseInt(returnMatch[2]);
    const unit = returnMatch[3].toLowerCase();
    
    if (unit.startsWith('year') || unit === 'yr') {
      if (period === 3) {
        filters.push({ field: 'cagr3y', operator: '>=', value: returnValue });
      } else if (period === 1) {
        filters.push({ field: 'return1y', operator: '>=', value: returnValue });
      }
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN: Sector filters (e.g., "in energy sector", "tech stocks")
  // ═══════════════════════════════════════════════════════════════════════════
  
  let includeSectors: string[] = [];
  let excludeSectors: string[] = [];
  
  // Include sectors: "in energy sector", "energy stocks", "from tech"
  const includeSectorMatch = lower.match(/(?:in|from|of)\s+(?:the\s+)?(\w+)\s+(?:sector|industry|space)/i);
  if (includeSectorMatch) {
    const sector = resolveSectorName(includeSectorMatch[1]);
    if (sector) includeSectors.push(sector);
  }
  
  // Also check for "energy stocks", "tech companies"
  for (const [sector, aliases] of Object.entries(SECTOR_ALIASES)) {
    for (const alias of [...aliases, sector.toLowerCase()]) {
      if (lower.includes(`${alias} stocks`) || lower.includes(`${alias} companies`)) {
        includeSectors.push(sector);
      }
    }
  }
  
  // Exclude sectors: "exclude energy", "not pharma", "except healthcare"
  const excludeMatch = lower.match(/(?:exclude|except|not|excluding|without|omit)\s+([^,]+(?:,\s*[^,]+)*)/i);
  if (excludeMatch) {
    const exclusions = excludeMatch[1].split(/,|and/).map(s => s.trim());
    for (const exc of exclusions) {
      const sector = resolveSectorName(exc);
      if (sector) excludeSectors.push(sector);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN: Volume trends (e.g., "descending volume", "volume dropping")
  // ═══════════════════════════════════════════════════════════════════════════
  
  if (lower.includes('descending volume') || lower.includes('volume dropping') || 
      lower.includes('volume falling') || lower.includes('decreasing volume')) {
    filters.push({ field: 'volumeChange5d', operator: '<', value: 0 });
  }
  
  if (lower.includes('ascending volume') || lower.includes('volume rising') || 
      lower.includes('volume increasing') || lower.includes('increasing volume')) {
    filters.push({ field: 'volumeChange5d', operator: '>', value: 0 });
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN: Sort order (e.g., "top 20", "biggest", "lowest")
  // ═══════════════════════════════════════════════════════════════════════════
  
  let sort: SortCondition | undefined;
  let limit = 20; // Default limit
  
  // Extract limit
  const limitMatch = lower.match(/(?:top|first|show|list)\s*(\d+)/i);
  if (limitMatch) {
    limit = parseInt(limitMatch[1]);
  }
  
  // Detect sort field and direction
  if (lower.includes('biggest') || lower.includes('largest') || lower.includes('highest')) {
    // Find what to sort by
    if (lower.includes('volume drop') || lower.includes('volume fall')) {
      sort = { field: 'volumeChange5d', order: 'asc' }; // Most negative first
    } else if (lower.includes('mcap') || lower.includes('market cap')) {
      sort = { field: 'mcap', order: 'desc' };
    } else if (lower.includes('return')) {
      sort = { field: 'return1y', order: 'desc' };
    }
  }
  
  if (lower.includes('descending volume') || lower.includes('volume drop')) {
    sort = { field: 'volumeChange5d', order: 'asc' };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // BUILD QUERY
  // ═══════════════════════════════════════════════════════════════════════════
  
  const query: ScreenerQuery = {
    filters,
    sort,
    limit,
  };
  
  if (excludeSectors.length > 0) {
    query.exclude = { sectors: excludeSectors };
  }
  
  if (includeSectors.length > 0) {
    query.include = { sectors: includeSectors };
  }
  
  return {
    type: 'screener',
    query,
    raw: input,
  };
}

/**
 * Parse refinement query (+1, +2, etc.)
 */
function parseRefinementQuery(input: string, context?: ParsedQuery): ParsedQuery {
  const lower = input.toLowerCase();
  
  // Start with previous query or empty
  const baseQuery = context?.query || { filters: [], limit: 20 };
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN: Exclude sectors (+1 exclude energy, pharma)
  // ═══════════════════════════════════════════════════════════════════════════
  
  const excludeMatch = lower.match(/(?:exclude|except|not|without|omit|remove)\s+([^,]+(?:,\s*[^,]+)*)/i);
  if (excludeMatch) {
    const exclusions = excludeMatch[1].split(/,|\s+and\s+/).map(s => s.trim());
    const sectors: string[] = [];
    
    for (const exc of exclusions) {
      const sector = resolveSectorName(exc);
      if (sector) sectors.push(sector);
    }
    
    if (sectors.length > 0) {
      baseQuery.exclude = {
        ...baseQuery.exclude,
        sectors: [...(baseQuery.exclude?.sectors || []), ...sectors],
      };
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN: New limit (+2 top 5, +2 show 10)
  // ═══════════════════════════════════════════════════════════════════════════
  
  const limitMatch = lower.match(/(?:top|first|show|list|make it)\s*(\d+)/i);
  if (limitMatch) {
    baseQuery.limit = parseInt(limitMatch[1]);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN: Additional filters
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Parse any new conditions in the refinement
  const refinementFilters = parseScreenerQuery(input.replace(/^\+\d+\s*/, '')).query?.filters || [];
  if (refinementFilters.length > 0) {
    baseQuery.filters = [...baseQuery.filters, ...refinementFilters];
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PATTERN: Sort modification (+2 biggest volume drop)
  // ═══════════════════════════════════════════════════════════════════════════
  
  if (lower.includes('biggest') && lower.includes('volume drop')) {
    baseQuery.sort = { field: 'volumeChange5d', order: 'asc' };
  }
  
  return {
    type: 'screener',
    query: baseQuery,
    refinement: true,
    raw: input,
  };
}

/**
 * Parse single stock query
 */
function parseSingleStockQuery(input: string): ParsedQuery {
  const symbolMatch = input.match(/\b([A-Z]{1,12})\b/);
  return {
    type: 'single_stock',
    symbols: symbolMatch ? [symbolMatch[1]] : [],
    raw: input,
  };
}

/**
 * Parse comparison query
 */
function parseComparisonQuery(input: string): ParsedQuery {
  const symbols = input.match(/\b([A-Z]{1,12})\b/g) || [];
  
  // Detect if comparing a sector
  const sectorMatch = input.toLowerCase().match(/(?:all|compare)\s+(\w+)\s+(?:stocks|companies)/i);
  let sectors: string[] = [];
  
  if (sectorMatch) {
    const sector = resolveSectorName(sectorMatch[1]);
    if (sector) sectors.push(sector);
  }
  
  // Check for exclusions like "not EV", "non-EV"
  let excludeTerms: string[] = [];
  const excludeMatch = input.toLowerCase().match(/(?:not|non-?|except|excluding)\s+(\w+)/gi);
  if (excludeMatch) {
    excludeTerms = excludeMatch.map(m => m.replace(/not|non-?|except|excluding/i, '').trim());
  }
  
  return {
    type: 'comparison',
    symbols: symbols.filter(s => s.length >= 2),
    query: {
      filters: [],
      include: sectors.length > 0 ? { sectors } : undefined,
    },
    raw: input,
  };
}

/**
 * Parse watchlist query
 */
function parseWatchlistQuery(input: string): ParsedQuery {
  const lower = input.toLowerCase();
  
  // Detect action
  let action: 'create' | 'modify' | 'view' = 'create';
  if (lower.includes('view') || lower.includes('show') || lower.includes('list')) {
    action = 'view';
  }
  
  // Parse the underlying filter query
  const screenerQuery = parseScreenerQuery(input);
  
  return {
    type: 'watchlist',
    query: screenerQuery.query,
    action,
    raw: input,
  };
}

/**
 * Parse alert query
 */
function parseAlertQuery(input: string): ParsedQuery {
  const screenerQuery = parseScreenerQuery(input);
  
  return {
    type: 'alert',
    query: screenerQuery.query,
    action: 'create',
    raw: input,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function normalizeOperator(op: string): Operator {
  const opLower = op.toLowerCase().trim();
  
  const opMap: Record<string, Operator> = {
    '>': '>', 
    '<': '<', 
    '>=': '>=', 
    '<=': '<=', 
    '=': '=', 
    '==': '=',
    '!=': '!=',
    '<>': '!=',
    'greater than': '>',
    'more than': '>',
    'above': '>',
    'over': '>',
    'less than': '<',
    'below': '<',
    'under': '<',
    'at least': '>=',
    'at most': '<=',
    'equal to': '=',
    'not equal to': '!=',
  };
  
  return opMap[opLower] || '=';
}

function parseValue(valueStr: string, field: string): number | string | null {
  const fieldConfig = QUERYABLE_FIELDS[field];
  if (!fieldConfig) return null;
  
  if (fieldConfig.type === 'number') {
    // Try parsing as human number (5B, 100M, etc.)
    const humanNum = parseHumanNumber(valueStr);
    if (humanNum !== null) return humanNum;
    
    // Try parsing as percentage
    const pct = parsePercentage(valueStr);
    if (pct !== null) return pct;
    
    // Try plain number
    const plain = parseFloat(valueStr.replace(/[$,]/g, ''));
    return isNaN(plain) ? null : plain;
  }
  
  if (fieldConfig.type === 'string') {
    return valueStr.trim();
  }
  
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default {
  parseNaturalQuery,
  parseScreenerQuery,
  resolveFieldName,
  resolveSectorName,
  parseHumanNumber,
  QUERYABLE_FIELDS,
  SECTORS,
};
