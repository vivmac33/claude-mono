// ═══════════════════════════════════════════════════════════════════════════
// MONOMORPH FINANCIAL PHRASE BANK V3
// Complete NLP layer for search, screener, and workflow builder
// Features: Indian market terms, operators, aliases, fuzzy matching
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface PhraseMapping {
  phrases: string[];
  cards: string[];
  intent: string;
  priority: number;
}

export interface ScreenerOperator {
  symbol: string;
  aliases: string[];
  description: string;
}

export interface MetricDefinition {
  id: string;
  displayName: string;
  aliases: string[];
  category: string;
  defaultOperator: string;
  unit?: string;
  higherIsBetter?: boolean;
}

export interface ParsedQuery {
  originalQuery: string;
  correctedQuery: string;
  corrections: Array<{ original: string; corrected: string; confidence: number }>;
  matches: Array<{ category: string; mapping: PhraseMapping; score: number }>;
  suggestedCards: string[];
  primaryIntent: string;
  screenerFilters: ScreenerFilter[];
  contextModifiers: ContextModifier[];
  sentiment: 'bullish' | 'bearish' | 'neutral' | null;
  symbols: string[];
  timeframe: string | null;
}

export interface ScreenerFilter {
  metric: string;
  operator: string;
  value: number | string;
  raw: string;
}

export interface ContextModifier {
  type: 'time' | 'comparison' | 'sentiment';
  value: string;
  raw: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// OPERATORS WITH ALIASES
// ═══════════════════════════════════════════════════════════════════════════

export const OPERATORS: Record<string, ScreenerOperator> = {
  ">": {
    symbol: ">",
    aliases: ["greater than", "more than", "above", "over", "exceeds", "higher than", "gt", ">"],
    description: "Greater than"
  },
  "<": {
    symbol: "<",
    aliases: ["less than", "below", "under", "lower than", "lt", "<", "smaller than"],
    description: "Less than"
  },
  ">=": {
    symbol: ">=",
    aliases: ["greater than or equal", "at least", "minimum", "min", ">=", "gte", "not less than"],
    description: "Greater than or equal to"
  },
  "<=": {
    symbol: "<=",
    aliases: ["less than or equal", "at most", "maximum", "max", "<=", "lte", "not more than", "upto", "up to"],
    description: "Less than or equal to"
  },
  "=": {
    symbol: "=",
    aliases: ["equal", "equals", "equal to", "exactly", "is", "=", "=="],
    description: "Equal to"
  },
  "!=": {
    symbol: "!=",
    aliases: ["not equal", "not", "exclude", "excluding", "except", "without", "!=", "<>", "not equal to"],
    description: "Not equal to"
  },
  "between": {
    symbol: "between",
    aliases: ["between", "in range", "from to", "range"],
    description: "Between two values"
  },
  "in": {
    symbol: "in",
    aliases: ["in", "include", "including", "with", "has", "contains", "among"],
    description: "In list of values"
  },
  "top": {
    symbol: "top",
    aliases: ["top", "best", "highest", "leading", "first"],
    description: "Top N by metric"
  },
  "bottom": {
    symbol: "bottom",
    aliases: ["bottom", "worst", "lowest", "last"],
    description: "Bottom N by metric"
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// METRIC DEFINITIONS WITH ALIASES
// ═══════════════════════════════════════════════════════════════════════════

export const METRICS: MetricDefinition[] = [
  // Valuation
  { id: "pe_ratio", displayName: "P/E Ratio", aliases: ["pe", "p/e", "price to earnings", "price to earning", "price earning", "price-to-earnings", "pe ratio", "per"], category: "valuation", defaultOperator: "<", higherIsBetter: false },
  { id: "pb_ratio", displayName: "P/B Ratio", aliases: ["pb", "p/b", "price to book", "price book", "price-to-book", "pb ratio", "pbr"], category: "valuation", defaultOperator: "<", higherIsBetter: false },
  { id: "ps_ratio", displayName: "P/S Ratio", aliases: ["ps", "p/s", "price to sales", "price sales", "price-to-sales", "ps ratio", "psr"], category: "valuation", defaultOperator: "<", higherIsBetter: false },
  { id: "ev_ebitda", displayName: "EV/EBITDA", aliases: ["ev/ebitda", "ev to ebitda", "enterprise value to ebitda", "ev ebitda"], category: "valuation", defaultOperator: "<", higherIsBetter: false },
  { id: "ev_ebit", displayName: "EV/EBIT", aliases: ["ev/ebit", "ev to ebit", "enterprise value to ebit", "ev ebit"], category: "valuation", defaultOperator: "<", higherIsBetter: false },
  { id: "peg_ratio", displayName: "PEG Ratio", aliases: ["peg", "price earnings growth", "pe to growth", "peg ratio"], category: "valuation", defaultOperator: "<", higherIsBetter: false },
  { id: "dividend_yield", displayName: "Dividend Yield", aliases: ["dividend yield", "yield", "div yield", "dy", "dividend %"], category: "valuation", defaultOperator: ">", unit: "%", higherIsBetter: true },
  { id: "market_cap", displayName: "Market Cap", aliases: ["market cap", "mcap", "market capitalization", "m cap", "marketcap"], category: "valuation", defaultOperator: ">", unit: "Cr" },
  
  // Profitability
  { id: "roe", displayName: "ROE", aliases: ["roe", "return on equity", "return on equities"], category: "profitability", defaultOperator: ">", unit: "%", higherIsBetter: true },
  { id: "roa", displayName: "ROA", aliases: ["roa", "return on assets", "return on asset"], category: "profitability", defaultOperator: ">", unit: "%", higherIsBetter: true },
  { id: "roce", displayName: "ROCE", aliases: ["roce", "return on capital employed", "return on capital"], category: "profitability", defaultOperator: ">", unit: "%", higherIsBetter: true },
  { id: "roic", displayName: "ROIC", aliases: ["roic", "return on invested capital"], category: "profitability", defaultOperator: ">", unit: "%", higherIsBetter: true },
  { id: "net_margin", displayName: "Net Profit Margin", aliases: ["net margin", "net profit margin", "npm", "pat margin", "profit margin"], category: "profitability", defaultOperator: ">", unit: "%", higherIsBetter: true },
  { id: "operating_margin", displayName: "Operating Margin", aliases: ["operating margin", "opm", "ebit margin", "operating profit margin"], category: "profitability", defaultOperator: ">", unit: "%", higherIsBetter: true },
  { id: "gross_margin", displayName: "Gross Margin", aliases: ["gross margin", "gpm", "gross profit margin"], category: "profitability", defaultOperator: ">", unit: "%", higherIsBetter: true },
  { id: "ebitda_margin", displayName: "EBITDA Margin", aliases: ["ebitda margin", "ebitda %"], category: "profitability", defaultOperator: ">", unit: "%", higherIsBetter: true },
  
  // Growth
  { id: "revenue_growth", displayName: "Revenue Growth", aliases: ["revenue growth", "sales growth", "topline growth", "top line growth", "revenue cagr"], category: "growth", defaultOperator: ">", unit: "%", higherIsBetter: true },
  { id: "eps_growth", displayName: "EPS Growth", aliases: ["eps growth", "earnings growth", "profit growth", "earnings per share growth"], category: "growth", defaultOperator: ">", unit: "%", higherIsBetter: true },
  { id: "pat_growth", displayName: "PAT Growth", aliases: ["pat growth", "net profit growth", "profit after tax growth", "bottomline growth"], category: "growth", defaultOperator: ">", unit: "%", higherIsBetter: true },
  { id: "cagr_3y", displayName: "3Y CAGR", aliases: ["3y cagr", "3 year cagr", "three year cagr", "3yr cagr"], category: "growth", defaultOperator: ">", unit: "%", higherIsBetter: true },
  { id: "cagr_5y", displayName: "5Y CAGR", aliases: ["5y cagr", "5 year cagr", "five year cagr", "5yr cagr"], category: "growth", defaultOperator: ">", unit: "%", higherIsBetter: true },
  
  // Risk & Leverage
  { id: "debt_to_equity", displayName: "Debt to Equity", aliases: ["debt to equity", "d/e", "de ratio", "debt equity", "d-e", "leverage ratio", "de"], category: "leverage", defaultOperator: "<", higherIsBetter: false },
  { id: "debt_to_assets", displayName: "Debt to Assets", aliases: ["debt to assets", "d/a", "debt assets"], category: "leverage", defaultOperator: "<", higherIsBetter: false },
  { id: "interest_coverage", displayName: "Interest Coverage", aliases: ["interest coverage", "icr", "interest coverage ratio", "times interest earned"], category: "leverage", defaultOperator: ">", higherIsBetter: true },
  { id: "current_ratio", displayName: "Current Ratio", aliases: ["current ratio", "cr", "working capital ratio"], category: "liquidity", defaultOperator: ">", higherIsBetter: true },
  { id: "quick_ratio", displayName: "Quick Ratio", aliases: ["quick ratio", "acid test", "acid test ratio"], category: "liquidity", defaultOperator: ">", higherIsBetter: true },
  { id: "beta", displayName: "Beta", aliases: ["beta", "market beta", "stock beta"], category: "risk", defaultOperator: "<", higherIsBetter: false },
  { id: "volatility", displayName: "Volatility", aliases: ["volatility", "vol", "standard deviation", "std dev"], category: "risk", defaultOperator: "<", unit: "%", higherIsBetter: false },
  
  // Technical
  { id: "rsi", displayName: "RSI", aliases: ["rsi", "relative strength index", "relative strength"], category: "technical", defaultOperator: "between" },
  { id: "macd", displayName: "MACD", aliases: ["macd", "moving average convergence divergence"], category: "technical", defaultOperator: ">" },
  { id: "adx", displayName: "ADX", aliases: ["adx", "average directional index", "trend strength"], category: "technical", defaultOperator: ">" },
  { id: "52w_high", displayName: "52W High", aliases: ["52 week high", "52w high", "52wh", "yearly high", "1 year high"], category: "technical", defaultOperator: "<", unit: "%" },
  { id: "52w_low", displayName: "52W Low", aliases: ["52 week low", "52w low", "52wl", "yearly low", "1 year low"], category: "technical", defaultOperator: ">", unit: "%" },
  
  // Ownership
  { id: "promoter_holding", displayName: "Promoter Holding", aliases: ["promoter holding", "promoter stake", "promoter %", "promoter ownership"], category: "ownership", defaultOperator: ">", unit: "%", higherIsBetter: true },
  { id: "fii_holding", displayName: "FII Holding", aliases: ["fii holding", "fii stake", "fii %", "foreign holding", "fpi holding"], category: "ownership", defaultOperator: ">", unit: "%" },
  { id: "dii_holding", displayName: "DII Holding", aliases: ["dii holding", "dii stake", "dii %", "domestic holding", "mf holding"], category: "ownership", defaultOperator: ">", unit: "%" },
  { id: "pledge", displayName: "Promoter Pledge", aliases: ["pledge", "promoter pledge", "pledged shares", "pledge %", "pledged"], category: "ownership", defaultOperator: "<", unit: "%", higherIsBetter: false },
  
  // Quality Scores
  { id: "piotroski_score", displayName: "Piotroski Score", aliases: ["piotroski", "f score", "f-score", "piotroski score", "fscore"], category: "quality", defaultOperator: ">=", higherIsBetter: true },
  { id: "altman_z", displayName: "Altman Z-Score", aliases: ["altman z", "z score", "z-score", "altman score", "altman"], category: "quality", defaultOperator: ">", higherIsBetter: true },
  
  // Cashflow
  { id: "fcf_yield", displayName: "FCF Yield", aliases: ["fcf yield", "free cash flow yield", "fcf %"], category: "cashflow", defaultOperator: ">", unit: "%", higherIsBetter: true },
  { id: "ocf", displayName: "Operating Cash Flow", aliases: ["ocf", "operating cash flow", "cfo", "cash from operations"], category: "cashflow", defaultOperator: ">", unit: "Cr", higherIsBetter: true },
  
  // Dividend
  { id: "payout_ratio", displayName: "Payout Ratio", aliases: ["payout ratio", "dividend payout", "payout %", "dividend payout ratio"], category: "dividend", defaultOperator: "<", unit: "%", higherIsBetter: false },
  { id: "dividend_cagr", displayName: "Dividend CAGR", aliases: ["dividend cagr", "dividend growth", "dps growth", "dividend per share growth"], category: "dividend", defaultOperator: ">", unit: "%", higherIsBetter: true },
];

// ═══════════════════════════════════════════════════════════════════════════
// INDIAN MARKET SPECIFIC TERMS
// ═══════════════════════════════════════════════════════════════════════════

export const INDIAN_MARKET_TERMS: Record<string, PhraseMapping> = {
  "indices": {
    phrases: [
      // NSE Indices
      "nifty", "nifty 50", "nifty50", "nifty fifty", "nse",
      "bank nifty", "banknifty", "nifty bank",
      "nifty it", "nifty pharma", "nifty auto", "nifty metal", "nifty fmcg", "nifty realty",
      "nifty midcap", "nifty smallcap", "nifty next 50", "nifty 100", "nifty 200", "nifty 500",
      "india vix", "vix", "volatility index",
      // BSE Indices
      "sensex", "bse", "bse 30", "bse sensex",
      "bse midcap", "bse smallcap", "bse 100", "bse 200", "bse 500",
      // Comparisons
      "vs nifty", "vs sensex", "beat nifty", "beat sensex", "outperform nifty", "outperform sensex",
      "underperform nifty", "underperform sensex", "relative to nifty", "relative to sensex"
    ],
    cards: ["peer-comparison", "portfolio-leaderboard"],
    intent: "benchmark",
    priority: 8
  },

  "fno_specific": {
    phrases: [
      // F&O Terms
      "f&o", "fno", "f and o", "futures and options",
      "fno ban", "ban list", "f&o ban", "security in ban", "ban period",
      "lot size", "contract size", "market lot",
      "rollover", "roll over", "expiry rollover", "monthly rollover", "weekly rollover",
      "oi spurts", "oi spurt", "open interest spurt",
      "long build up", "short build up", "long unwinding", "short covering",
      "fno stocks", "f&o stocks", "derivative stocks",
      // Expiry
      "weekly expiry", "monthly expiry", "expiry day", "expiry week",
      "thursday expiry", "last thursday"
    ],
    cards: ["options-interest", "fno-risk-advisor", "options-strategy"],
    intent: "derivatives",
    priority: 12
  },

  "regulatory": {
    phrases: [
      // SEBI
      "sebi", "securities and exchange board", "regulator",
      "sebi guidelines", "sebi norms", "sebi circular", "sebi regulation",
      // Corporate Actions
      "buyback", "buy back", "share buyback", "tender offer",
      "esop", "employee stock option", "stock options", "esop grant",
      "bonus", "bonus issue", "bonus shares", "stock bonus",
      "split", "stock split", "share split", "face value split",
      "rights issue", "rights", "rights offer",
      "ofs", "offer for sale",
      "ipo", "initial public offering", "new listing", "listing",
      "fpo", "follow on public offer",
      // Pledge
      "promoter pledge", "pledge", "pledged shares", "pledge ratio", "unpledge",
      "pledge release", "pledge creation",
      // Other
      "bulk deal", "block deal", "insider trade", "sast", "takeover",
      "delisting", "delist", "relisting",
      "circuit", "circuit breaker", "upper circuit", "lower circuit", "circuit limit",
      "trading halt", "asm", "gsm", "surveillance"
    ],
    cards: ["insider-trades", "shareholding-pattern", "institutional-flows"],
    intent: "regulatory",
    priority: 10
  },

  "indian_sectors": {
    phrases: [
      // Sectors
      "it sector", "software sector", "tech sector", "information technology",
      "banking sector", "bank stocks", "psu banks", "private banks", "nbfc",
      "pharma sector", "pharmaceutical", "healthcare",
      "auto sector", "automobile", "ev stocks", "electric vehicle",
      "fmcg sector", "consumer goods", "fmcg stocks",
      "metal sector", "steel stocks", "mining",
      "oil and gas", "energy sector", "power sector", "utilities",
      "realty sector", "real estate", "property",
      "infra sector", "infrastructure", "construction",
      "cement sector", "building materials",
      "chemical sector", "specialty chemicals",
      "textile sector", "apparel"
    ],
    cards: ["peer-comparison", "narrative-theme"],
    intent: "sector",
    priority: 8
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// TIME MODIFIERS
// ═══════════════════════════════════════════════════════════════════════════

export const TIME_MODIFIERS: Record<string, string[]> = {
  "today": ["today", "today's", "todays", "intraday", "live", "current", "now", "right now"],
  "yesterday": ["yesterday", "yesterday's", "yesterdays", "previous day", "last trading day"],
  "this_week": ["this week", "current week", "weekly", "week"],
  "last_week": ["last week", "previous week", "past week"],
  "this_month": ["this month", "current month", "monthly", "month", "mtd", "month to date"],
  "last_month": ["last month", "previous month", "past month"],
  "this_quarter": ["this quarter", "current quarter", "quarterly", "qtd", "quarter to date", "q1", "q2", "q3", "q4"],
  "last_quarter": ["last quarter", "previous quarter", "past quarter"],
  "ytd": ["ytd", "year to date", "this year", "current year", "cy"],
  "1_year": ["1 year", "one year", "12 months", "12m", "1y", "past year", "last year", "trailing year", "ttm"],
  "3_year": ["3 year", "three year", "3y", "36 months", "3 years"],
  "5_year": ["5 year", "five year", "5y", "60 months", "5 years"],
  "10_year": ["10 year", "ten year", "10y", "decade", "10 years"],
  "52_week": ["52 week", "52w", "52-week", "yearly", "annual"],
  "all_time": ["all time", "alltime", "since inception", "historical", "lifetime"]
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPARISON MODIFIERS
// ═══════════════════════════════════════════════════════════════════════════

export const COMPARISON_MODIFIERS: Record<string, string[]> = {
  "vs_nifty": ["vs nifty", "versus nifty", "compared to nifty", "relative to nifty", "against nifty"],
  "vs_sensex": ["vs sensex", "versus sensex", "compared to sensex", "relative to sensex", "against sensex"],
  "vs_sector": ["vs sector", "versus sector", "compared to sector", "relative to sector", "against sector", "sector comparison"],
  "vs_peers": ["vs peers", "versus peers", "compared to peers", "relative to peers", "against peers", "peer comparison"],
  "vs_industry": ["vs industry", "versus industry", "compared to industry", "relative to industry", "against industry"],
  "yoy": ["yoy", "y-o-y", "year over year", "year on year", "vs last year", "compared to last year"],
  "qoq": ["qoq", "q-o-q", "quarter over quarter", "quarter on quarter", "vs last quarter"],
  "mom": ["mom", "m-o-m", "month over month", "month on month", "vs last month"]
};

// ═══════════════════════════════════════════════════════════════════════════
// SENTIMENT PHRASES
// ═══════════════════════════════════════════════════════════════════════════

export const SENTIMENT_PHRASES: Record<string, string[]> = {
  "bullish": [
    "bullish", "bullish on", "positive", "positive on", "optimistic", "buy",
    "accumulate", "add", "going up", "upside", "uptrend", "breakout",
    "strong buy", "outperform", "overweight", "conviction buy",
    "long", "go long", "buying opportunity", "attractive", "undervalued"
  ],
  "bearish": [
    "bearish", "bearish on", "negative", "negative on", "pessimistic", "sell",
    "avoid", "exit", "going down", "downside", "downtrend", "breakdown",
    "strong sell", "underperform", "underweight", "reduce",
    "short", "go short", "overvalued", "expensive", "risky"
  ],
  "neutral": [
    "neutral", "neutral on", "hold", "wait", "sideways", "range bound",
    "no view", "on sidelines", "watch", "monitoring", "fair valued"
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// SCREENER QUERY PATTERNS
// ═══════════════════════════════════════════════════════════════════════════

export const SCREENER_PATTERNS = {
  // Pattern: "stocks with PE < 15"
  metric_operator_value: /(?:stocks?|companies?|shares?)?\s*(?:with|having|where)?\s*([a-zA-Z\/\s]+)\s*(>|<|>=|<=|=|==|!=|<>|greater than|less than|above|below|over|under|at least|at most|minimum|maximum|not)\s*(\d+(?:\.\d+)?)/gi,
  
  // Pattern: "high dividend yield stocks"
  quality_metric: /\b(high|low|good|bad|strong|weak|positive|negative|top|best|worst)\s+([a-zA-Z\/\s]+)\s*(?:stocks?|companies?|shares?)?/gi,
  
  // Pattern: "top 10 by ROE"
  top_bottom: /\b(top|bottom|best|worst|highest|lowest)\s*(\d+)?\s*(?:by|stocks?|companies?)?\s*(?:by)?\s*([a-zA-Z\/\s]+)/gi,
  
  // Pattern: "PE between 10 and 20"
  between_values: /([a-zA-Z\/\s]+)\s*(?:between|from|in range)\s*(\d+(?:\.\d+)?)\s*(?:and|to|-)\s*(\d+(?:\.\d+)?)/gi,
  
  // Pattern: "exclude IT sector"
  exclude_include: /\b(exclude|excluding|except|without|not|include|including|with|only)\s+(.+?)(?:\s+(?:stocks?|companies?|sector|industry))?/gi
};

// ═══════════════════════════════════════════════════════════════════════════
// COMMON TYPOS AND CORRECTIONS
// ═══════════════════════════════════════════════════════════════════════════

export const COMMON_TYPOS: Record<string, string> = {
  // Metrics
  "pe ration": "pe ratio",
  "pb ration": "pb ratio",
  "divident": "dividend",
  "divdend": "dividend",
  "yeild": "yield",
  "yiled": "yield",
  "retrun": "return",
  "retruns": "returns",
  "grwoth": "growth",
  "growht": "growth",
  "margni": "margin",
  "marign": "margin",
  "volatiltiy": "volatility",
  "voaltility": "volatility",
  "intrest": "interest",
  "interset": "interest",
  
  // Terms
  "bullsih": "bullish",
  "bearsih": "bearish",
  "buyllish": "bullish",
  "bearisch": "bearish",
  "techncial": "technical",
  "techincal": "technical",
  "fundamnetal": "fundamental",
  "fundamentla": "fundamental",
  "analyiss": "analysis",
  "analsyis": "analysis",
  "valuaiton": "valuation",
  "valuatoin": "valuation",
  "shareholdign": "shareholding",
  "shareholidng": "shareholding",
  "promtoer": "promoter",
  "pormter": "promoter",
  
  // Indian terms
  "sensxe": "sensex",
  "snesex": "sensex",
  "nifyt": "nifty",
  "nifity": "nifty",
  "sebi": "sebi",
  "buyabck": "buyback",
  "buybakc": "buyback",
  
  // Common words
  "sotcks": "stocks",
  "stocka": "stocks",
  "comapnies": "companies",
  "compaines": "companies",
  "sectoer": "sector",
  "sectro": "sector"
};

// ═══════════════════════════════════════════════════════════════════════════
// FUZZY MATCHING - LEVENSHTEIN DISTANCE
// ═══════════════════════════════════════════════════════════════════════════

function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

function findClosestMatch(word: string, dictionary: string[], maxDistance: number = 2): string | null {
  let bestMatch: string | null = null;
  let bestDistance = maxDistance + 1;

  for (const term of dictionary) {
    const distance = levenshteinDistance(word.toLowerCase(), term.toLowerCase());
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = term;
    }
  }

  return bestDistance <= maxDistance ? bestMatch : null;
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD VOCABULARY FOR FUZZY MATCHING
// ═══════════════════════════════════════════════════════════════════════════

function buildVocabulary(): string[] {
  const vocab = new Set<string>();
  
  // Add metric aliases
  for (const metric of METRICS) {
    vocab.add(metric.displayName.toLowerCase());
    metric.aliases.forEach(a => vocab.add(a.toLowerCase()));
  }
  
  // Add operator aliases
  for (const op of Object.values(OPERATORS)) {
    op.aliases.forEach(a => vocab.add(a.toLowerCase()));
  }
  
  // Add all phrase bank terms
  for (const mapping of Object.values(PHRASE_BANK)) {
    mapping.phrases.forEach(p => {
      p.toLowerCase().split(/\s+/).forEach(word => {
        if (word.length > 2) vocab.add(word);
      });
    });
  }
  
  // Add Indian market terms
  for (const mapping of Object.values(INDIAN_MARKET_TERMS)) {
    mapping.phrases.forEach(p => {
      p.toLowerCase().split(/\s+/).forEach(word => {
        if (word.length > 2) vocab.add(word);
      });
    });
  }
  
  // Add time modifiers
  for (const terms of Object.values(TIME_MODIFIERS)) {
    terms.forEach(t => vocab.add(t.toLowerCase()));
  }
  
  // Add sentiment phrases
  for (const terms of Object.values(SENTIMENT_PHRASES)) {
    terms.forEach(t => vocab.add(t.toLowerCase()));
  }
  
  return Array.from(vocab);
}

const VOCABULARY = buildVocabulary();

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PHRASE BANK (Extended with all categories)
// ═══════════════════════════════════════════════════════════════════════════

export const PHRASE_BANK: Record<string, PhraseMapping> = {
  // ─────────────────────────────────────────────────────────────────────────
  // VALUATION
  // ─────────────────────────────────────────────────────────────────────────
  "valuation_basic": {
    phrases: [
      "valuation", "valuation summary", "PE", "P/E", "price to earnings", "price to earning",
      "PB", "P/B", "price to book", "PS", "P/S", "price to sales",
      "EV", "enterprise value", "EV/EBITDA", "EV to EBITDA", "EV/EBIT", "EV to EBIT", "EV/Sales",
      "PEG", "PEG ratio", "price earnings growth",
      "dividend yield", "yield", "dividends",
      "is it overvalued", "is it undervalued", "is it cheap", "is it expensive",
      "fair value", "what is it worth", "how much should it cost",
      "valuation grade", "valuation trends", "historical valuation",
      "relative valuation", "peer valuation", "sector valuation",
      "cheaper than peers", "expensive vs sector", "premium valuation", "discount valuation",
      "valuation percentile", "valuation rank"
    ],
    cards: ["valuation-summary", "peer-comparison"],
    intent: "valuation",
    priority: 10
  },

  "dcf_valuation": {
    phrases: [
      "DCF", "discounted cash flow", "intrinsic value", "fair value calculation",
      "WACC", "weighted average cost of capital", "discount rate",
      "terminal value", "perpetuity growth", "terminal growth rate",
      "margin of safety", "upside potential", "downside risk",
      "FCF projections", "cash flow forecast", "value model",
      "what should the price be", "calculate fair value", "run DCF"
    ],
    cards: ["dcf-valuation", "intrinsic-value-range", "fair-value-forecaster"],
    intent: "valuation_deep",
    priority: 15
  },

  "piotroski_quality": {
    phrases: [
      "Piotroski", "F-score", "F score", "Piotroski score", "fundamental score",
      "quality score", "financial strength", "balance sheet strength",
      "profitability score", "leverage score", "efficiency score",
      "9 point checklist", "fundamental checklist",
      "is it a quality stock", "is it financially strong", "good fundamentals"
    ],
    cards: ["piotroski-score", "financial-health-dna", "altman-graham"],
    intent: "quality",
    priority: 15
  },

  // ─────────────────────────────────────────────────────────────────────────
  // GROWTH
  // ─────────────────────────────────────────────────────────────────────────
  "growth_summary": {
    phrases: [
      "growth", "growth summary", "revenue growth", "sales growth", "top line growth",
      "EPS growth", "earnings growth", "profit growth", "bottom line growth",
      "CAGR", "compound growth", "3 year growth", "5 year growth", "10 year growth",
      "YoY growth", "year over year", "QoQ growth", "quarter over quarter",
      "forward growth", "expected growth", "projected growth", "NTM growth",
      "growth rate", "growth trend", "historical growth", "growth trajectory",
      "is it growing", "how fast is it growing", "growth prospects"
    ],
    cards: ["growth-summary", "earnings-stability"],
    intent: "growth",
    priority: 10
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RISK
  // ─────────────────────────────────────────────────────────────────────────
  "risk_overview": {
    phrases: [
      "risk", "risks", "risk assessment", "risk analysis", "risk score",
      "how risky", "is it risky", "what are the risks", "risk factors",
      "red flags", "warning signs", "concerns", "issues",
      "risk health", "risk dashboard", "risk summary"
    ],
    cards: ["risk-health-dashboard", "warning-sentinel", "financial-stress-radar"],
    intent: "risk",
    priority: 10
  },

  "leverage_debt": {
    phrases: [
      "leverage", "debt", "debt to equity", "D/E", "debt ratio",
      "borrowings", "loans", "interest coverage", "debt service",
      "gearing", "financial leverage", "debt levels", "debt burden",
      "how much debt", "is debt too high", "debt history", "leverage trend",
      "net debt", "gross debt", "total debt", "low debt", "high debt", "zero debt"
    ],
    cards: ["leverage-history", "financial-health-dna", "risk-health-dashboard"],
    intent: "leverage",
    priority: 12
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TECHNICAL
  // ─────────────────────────────────────────────────────────────────────────
  "technical_basic": {
    phrases: [
      "technical", "technical analysis", "chart", "charts", "price chart",
      "bullish", "bearish", "neutral", "sideways",
      "trend", "uptrend", "downtrend", "trending",
      "technical indicators", "indicators", "signals",
      "what does the chart say", "technical view", "chart pattern"
    ],
    cards: ["candlestick-hero", "technical-indicators", "trend-strength"],
    intent: "technical",
    priority: 10
  },

  // ─────────────────────────────────────────────────────────────────────────
  // OWNERSHIP & MACRO
  // ─────────────────────────────────────────────────────────────────────────
  "shareholding": {
    phrases: [
      "shareholding", "ownership", "who owns", "shareholders",
      "promoter", "promoter holding", "promoter stake", "promoter pledge",
      "FII", "FII holding", "foreign institutional", "FPI",
      "DII", "DII holding", "domestic institutional",
      "mutual fund holding", "MF holding", "insurance holding",
      "retail", "public holding", "NII", "non-institutional",
      "ownership change", "stake increase", "stake decrease"
    ],
    cards: ["shareholding-pattern", "institutional-flows"],
    intent: "ownership",
    priority: 10
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PORTFOLIO & COMPARISON
  // ─────────────────────────────────────────────────────────────────────────
  "peer_comparison": {
    phrases: [
      "compare", "comparison", "vs", "versus", "compare to",
      "peer", "peers", "competitors", "competition", "sector peers",
      "how does it compare", "better than peers", "worse than peers",
      "relative performance", "peer ranking", "sector ranking",
      "INFY vs TCS", "compare stocks"
    ],
    cards: ["peer-comparison", "portfolio-leaderboard"],
    intent: "compare",
    priority: 10
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DERIVATIVES
  // ─────────────────────────────────────────────────────────────────────────
  "options_basic": {
    phrases: [
      "options", "option", "call option", "put option", "calls", "puts",
      "strike", "strike price", "expiry", "expiry date", "expiration",
      "premium", "option premium", "option price",
      "ITM", "in the money", "ATM", "at the money", "OTM", "out of the money",
      "option chain", "options data", "IV", "implied volatility"
    ],
    cards: ["options-interest", "options-strategy", "fno-risk-advisor"],
    intent: "derivatives",
    priority: 10
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MUTUAL FUNDS & ETF
  // ─────────────────────────────────────────────────────────────────────────
  "mutual_funds": {
    phrases: [
      "mutual fund", "MF", "fund", "scheme",
      "NAV", "net asset value", "AUM", "assets under management",
      "expense ratio", "TER", "total expense ratio",
      "fund manager", "AMC", "fund house",
      "SIP", "systematic investment", "lumpsum",
      "which fund", "best fund", "fund comparison", "fund vs fund"
    ],
    cards: ["mf-analyzer", "mf-explorer", "mf-portfolio-optimizer"],
    intent: "mutual_funds",
    priority: 10
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DIVIDENDS & INCOME
  // ─────────────────────────────────────────────────────────────────────────
  "dividends": {
    phrases: [
      "dividend", "dividends", "dividend yield", "DPS", "dividend per share",
      "payout ratio", "dividend payout", "dividend growth",
      "dividend history", "dividend track record", "dividend consistency",
      "income stock", "dividend stock", "yield stock", "high dividend"
    ],
    cards: ["dividend-crystal-ball", "income-stability", "dividend-sip-tracker"],
    intent: "income",
    priority: 10
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CASHFLOW
  // ─────────────────────────────────────────────────────────────────────────
  "cashflow": {
    phrases: [
      "cash flow", "cashflow", "cash flows", "FCF", "free cash flow",
      "operating cash flow", "OCF", "CFO", "cash from operations",
      "cash generation", "cash burn", "cash positive", "cash negative"
    ],
    cards: ["fcf-health", "cash-conversion-earnings", "cashflow-stability-index"],
    intent: "cashflow",
    priority: 10
  },

  // Add all Indian market terms
  ...INDIAN_MARKET_TERMS
};

// ═══════════════════════════════════════════════════════════════════════════
// QUERY PARSER
// ═══════════════════════════════════════════════════════════════════════════

export function parseQuery(query: string): ParsedQuery {
  const originalQuery = query;
  let correctedQuery = query.toLowerCase();
  const corrections: Array<{ original: string; corrected: string; confidence: number }> = [];

  // Step 1: Apply known typo corrections
  for (const [typo, correction] of Object.entries(COMMON_TYPOS)) {
    if (correctedQuery.includes(typo)) {
      correctedQuery = correctedQuery.replace(new RegExp(typo, 'g'), correction);
      corrections.push({ original: typo, corrected: correction, confidence: 1.0 });
    }
  }

  // Step 2: Fuzzy match unknown words
  const words = correctedQuery.split(/\s+/);
  const correctedWords: string[] = [];
  
  for (const word of words) {
    if (word.length > 3 && !VOCABULARY.includes(word.toLowerCase())) {
      const match = findClosestMatch(word, VOCABULARY, 2);
      if (match && match !== word) {
        correctedWords.push(match);
        corrections.push({ 
          original: word, 
          corrected: match, 
          confidence: 1 - (levenshteinDistance(word, match) / Math.max(word.length, match.length))
        });
      } else {
        correctedWords.push(word);
      }
    } else {
      correctedWords.push(word);
    }
  }
  correctedQuery = correctedWords.join(' ');

  // Step 3: Extract sentiment
  let sentiment: 'bullish' | 'bearish' | 'neutral' | null = null;
  for (const [sent, phrases] of Object.entries(SENTIMENT_PHRASES)) {
    for (const phrase of phrases) {
      if (correctedQuery.includes(phrase.toLowerCase())) {
        sentiment = sent as 'bullish' | 'bearish' | 'neutral';
        break;
      }
    }
    if (sentiment) break;
  }

  // Step 4: Extract time modifiers
  let timeframe: string | null = null;
  const contextModifiers: ContextModifier[] = [];
  
  for (const [period, phrases] of Object.entries(TIME_MODIFIERS)) {
    for (const phrase of phrases) {
      if (correctedQuery.includes(phrase.toLowerCase())) {
        timeframe = period;
        contextModifiers.push({ type: 'time', value: period, raw: phrase });
        break;
      }
    }
    if (timeframe) break;
  }

  // Step 5: Extract comparison modifiers
  for (const [comp, phrases] of Object.entries(COMPARISON_MODIFIERS)) {
    for (const phrase of phrases) {
      if (correctedQuery.includes(phrase.toLowerCase())) {
        contextModifiers.push({ type: 'comparison', value: comp, raw: phrase });
        break;
      }
    }
  }

  // Step 6: Parse screener filters
  const screenerFilters: ScreenerFilter[] = [];
  
  // Pattern: metric operator value (e.g., "PE < 15", "ROE greater than 20")
  const metricPattern = /([a-zA-Z\/\s]+?)\s*(>|<|>=|<=|=|!=|greater than|less than|more than|above|below|over|under|at least|at most|minimum|maximum)\s*(\d+(?:\.\d+)?)/gi;
  
  let match;
  while ((match = metricPattern.exec(correctedQuery)) !== null) {
    const [raw, metricRaw, operatorRaw, valueRaw] = match;
    
    // Find metric
    const metricLower = metricRaw.trim().toLowerCase();
    const metric = METRICS.find(m => 
      m.id === metricLower || 
      m.displayName.toLowerCase() === metricLower ||
      m.aliases.some(a => a.toLowerCase() === metricLower)
    );
    
    if (metric) {
      // Normalize operator
      let operator = operatorRaw.toLowerCase();
      for (const [op, def] of Object.entries(OPERATORS)) {
        if (def.aliases.includes(operator)) {
          operator = op;
          break;
        }
      }
      
      screenerFilters.push({
        metric: metric.id,
        operator,
        value: parseFloat(valueRaw),
        raw
      });
    }
  }

  // Pattern: "high/low metric stocks" (e.g., "high dividend yield stocks")
  const qualityPattern = /\b(high|low|good|strong|weak)\s+([a-zA-Z\/\s]+?)(?:\s+(?:stocks?|companies?))?/gi;
  
  while ((match = qualityPattern.exec(correctedQuery)) !== null) {
    const [raw, quality, metricRaw] = match;
    const metricLower = metricRaw.trim().toLowerCase();
    
    const metric = METRICS.find(m => 
      m.displayName.toLowerCase().includes(metricLower) ||
      m.aliases.some(a => a.toLowerCase().includes(metricLower))
    );
    
    if (metric) {
      const isHighGood = metric.higherIsBetter !== false;
      const wantsHigh = ['high', 'good', 'strong'].includes(quality.toLowerCase());
      
      screenerFilters.push({
        metric: metric.id,
        operator: (wantsHigh === isHighGood) ? '>=' : '<=',
        value: wantsHigh ? 'high' : 'low',  // Will be resolved to percentile
        raw
      });
    }
  }

  // Step 7: Match phrases to cards
  const matches: Array<{ category: string; mapping: PhraseMapping; score: number }> = [];
  
  for (const [category, mapping] of Object.entries(PHRASE_BANK)) {
    let score = 0;
    let matchCount = 0;
    
    for (const phrase of mapping.phrases) {
      const phraseLower = phrase.toLowerCase();
      if (correctedQuery.includes(phraseLower)) {
        score += mapping.priority * (phraseLower.split(' ').length); // Longer phrases score higher
        matchCount++;
      }
    }
    
    if (score > 0) {
      matches.push({ category, mapping, score: score * (1 + matchCount * 0.1) });
    }
  }
  
  matches.sort((a, b) => b.score - a.score);

  // Step 8: Get suggested cards
  const suggestedCards: string[] = [];
  const seenCards = new Set<string>();
  
  for (const match of matches.slice(0, 5)) {
    for (const card of match.mapping.cards) {
      if (!seenCards.has(card)) {
        seenCards.add(card);
        suggestedCards.push(card);
      }
    }
  }

  // Step 9: Extract stock symbols (basic pattern)
  const symbols: string[] = [];
  const symbolPattern = /\b([A-Z]{2,10})\b/g;
  const upperQuery = query.toUpperCase();
  
  while ((match = symbolPattern.exec(upperQuery)) !== null) {
    const symbol = match[1];
    // Filter out common words that look like symbols
    const excludeWords = ['PE', 'PB', 'PS', 'EV', 'ROE', 'ROA', 'FCF', 'EPS', 'YOY', 'QOQ', 'MOM', 'SIP', 'NAV', 'AUM', 'THE', 'AND', 'FOR', 'NOT', 'WITH'];
    if (!excludeWords.includes(symbol)) {
      symbols.push(symbol);
    }
  }

  return {
    originalQuery,
    correctedQuery,
    corrections,
    matches: matches.slice(0, 10),
    suggestedCards: suggestedCards.slice(0, 5),
    primaryIntent: matches.length > 0 ? matches[0].mapping.intent : 'analyze',
    screenerFilters,
    contextModifiers,
    sentiment,
    symbols,
    timeframe
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SCREENER QUERY BUILDER
// ═══════════════════════════════════════════════════════════════════════════

export function buildScreenerQuery(filters: ScreenerFilter[]): string {
  const conditions: string[] = [];
  
  for (const filter of filters) {
    const metric = METRICS.find(m => m.id === filter.metric);
    if (!metric) continue;
    
    let condition = `${metric.displayName} ${filter.operator} ${filter.value}`;
    if (metric.unit) {
      condition += metric.unit;
    }
    conditions.push(condition);
  }
  
  return conditions.join(' AND ');
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT STATS
// ═══════════════════════════════════════════════════════════════════════════

export function getPhraseBankStats() {
  let totalPhrases = 0;
  let totalWords = 0;
  const allCards = new Set<string>();
  const allIntents = new Set<string>();
  
  for (const mapping of Object.values(PHRASE_BANK)) {
    totalPhrases += mapping.phrases.length;
    totalWords += mapping.phrases.reduce((acc, p) => acc + p.split(/\s+/).length, 0);
    mapping.cards.forEach(c => allCards.add(c));
    allIntents.add(mapping.intent);
  }
  
  return {
    categories: Object.keys(PHRASE_BANK).length,
    phrases: totalPhrases,
    words: totalWords,
    metrics: METRICS.length,
    metricAliases: METRICS.reduce((acc, m) => acc + m.aliases.length, 0),
    operators: Object.keys(OPERATORS).length,
    operatorAliases: Object.values(OPERATORS).reduce((acc, o) => acc + o.aliases.length, 0),
    cardsLinked: allCards.size,
    intents: allIntents.size,
    typoCorrections: Object.keys(COMMON_TYPOS).length,
    vocabularySize: VOCABULARY.length,
    timeModifiers: Object.values(TIME_MODIFIERS).flat().length,
    comparisonModifiers: Object.values(COMPARISON_MODIFIERS).flat().length,
    sentimentPhrases: Object.values(SENTIMENT_PHRASES).flat().length
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════

export const TEST_QUERIES = [
  // Typo tests
  "show me sotcks with pe ration less than 15",
  "bullsih stocks with high divident yeild",
  "techncial analyiss of nifyt",
  
  // Screener tests
  "stocks with PE < 15 and ROE > 20",
  "high dividend yield stocks",
  "low debt companies with good growth",
  "top 10 by market cap",
  "exclude IT sector",
  
  // Indian market tests
  "FII buying in bank nifty stocks",
  "promoter pledge less than 5%",
  "stocks near upper circuit",
  "SEBI buyback announcement",
  
  // Time modifier tests
  "YTD returns vs nifty",
  "last quarter earnings growth",
  "52 week high stocks",
  
  // Sentiment tests
  "bullish on RELIANCE",
  "should I avoid ADANI stocks",
  "accumulate TCS or INFY",
  
  // Complex queries
  "undervalued IT stocks with PE below 20 and ROE above 15 vs sector",
  "high quality low debt pharma companies with consistent dividend"
];

// Run stats
console.log("Phrase Bank V3 Stats:", getPhraseBankStats());
