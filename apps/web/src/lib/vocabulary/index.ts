// ═══════════════════════════════════════════════════════════════════════════
// VOCABULARY SYSTEM
// Comprehensive NLP support for Indian trader queries
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 1. SYNONYM MAPS - Normalize variations to canonical terms
// ─────────────────────────────────────────────────────────────────────────────

export const SYNONYM_MAP: Record<string, string> = {
  // Price terms
  "ltp": "last_price",
  "last traded price": "last_price",
  "closing price": "last_price",
  "cmp": "last_price",
  "current market price": "last_price",
  
  // Stop loss variations
  "sl": "stop_loss",
  "stoploss": "stop_loss",
  "stop": "stop_loss",
  "protective stop": "stop_loss",
  "hard stop": "stop_loss",
  "trailing sl": "trailing_stop",
  "tsl": "trailing_stop",
  "trailing stoploss": "trailing_stop",
  
  // Target variations
  "tp": "target",
  "take profit": "target",
  "tgt": "target",
  "profit target": "target",
  
  // Position sizing
  "qty": "quantity",
  "lot": "lot_size",
  "lots": "lot_size",
  "position size": "position_sizing",
  "bet size": "position_sizing",
  
  // Indicators - RSI
  "rsi": "relative_strength_index",
  "relative strength": "relative_strength_index",
  
  // Indicators - MACD
  "macd": "macd",
  "moving average convergence divergence": "macd",
  
  // Indicators - Bollinger
  "bb": "bollinger_bands",
  "bollinger": "bollinger_bands",
  "boll bands": "bollinger_bands",
  
  // Moving averages
  "ma": "moving_average",
  "sma": "simple_moving_average",
  "ema": "exponential_moving_average",
  "dma": "daily_moving_average",
  "wma": "weighted_moving_average",
  "20 ema": "ema_20",
  "50 ema": "ema_50",
  "200 ema": "ema_200",
  "20 sma": "sma_20",
  "50 sma": "sma_50",
  "200 sma": "sma_200",
  "200 dma": "sma_200",
  
  // VWAP
  "vwap": "volume_weighted_average_price",
  "anchored vwap": "anchored_vwap",
  
  // Pivot points
  "cpr": "central_pivot_range",
  "pivot": "pivot_point",
  "floor pivot": "floor_pivots",
  "camarilla": "camarilla_pivots",
  "woodie": "woodie_pivots",
  
  // Support/Resistance
  "support": "support_level",
  "resistance": "resistance_level",
  "s/r": "support_resistance",
  "sr": "support_resistance",
  "demand zone": "support_level",
  "supply zone": "resistance_level",
  
  // Previous day levels
  "pdh": "previous_day_high",
  "pdl": "previous_day_low",
  "pdc": "previous_day_close",
  "previous high": "previous_day_high",
  "previous low": "previous_day_low",
  "yesterday high": "previous_day_high",
  "yesterday low": "previous_day_low",
  
  // Opening range
  "orb": "opening_range_breakout",
  "opening range": "opening_range",
  
  // Candlestick patterns
  "engulfing": "engulfing_pattern",
  "bullish engulfing": "bullish_engulfing",
  "bearish engulfing": "bearish_engulfing",
  "doji": "doji_pattern",
  "hammer": "hammer_pattern",
  "shooting star": "shooting_star_pattern",
  "morning star": "morning_star_pattern",
  "evening star": "evening_star_pattern",
  "harami": "harami_pattern",
  "marubozu": "marubozu_pattern",
  "pin bar": "pin_bar_pattern",
  "pinbar": "pin_bar_pattern",
  
  // Chart patterns
  "h&s": "head_and_shoulders",
  "head shoulders": "head_and_shoulders",
  "double top": "double_top_pattern",
  "double bottom": "double_bottom_pattern",
  "cup handle": "cup_and_handle",
  "cup and handle": "cup_and_handle",
  "flag": "flag_pattern",
  "bull flag": "bullish_flag",
  "bear flag": "bearish_flag",
  "pennant": "pennant_pattern",
  "wedge": "wedge_pattern",
  "rising wedge": "rising_wedge",
  "falling wedge": "falling_wedge",
  "triangle": "triangle_pattern",
  "ascending triangle": "ascending_triangle",
  "descending triangle": "descending_triangle",
  "symmetrical triangle": "symmetrical_triangle",
  
  // Trend terms
  "uptrend": "bullish_trend",
  "downtrend": "bearish_trend",
  "sideways": "range_bound",
  "ranging": "range_bound",
  "consolidation": "range_bound",
  "breakout": "breakout",
  "breakdown": "breakdown",
  "pullback": "pullback",
  "retracement": "pullback",
  "correction": "pullback",
  
  // Volume terms
  "vol": "volume",
  "rvol": "relative_volume",
  "relative volume": "relative_volume",
  "volume spike": "volume_surge",
  "obv": "on_balance_volume",
  "a/d": "accumulation_distribution",
  "accumulation": "accumulation_distribution",
  "distribution": "accumulation_distribution",
  
  // Divergence
  "div": "divergence",
  "bullish div": "bullish_divergence",
  "bearish div": "bearish_divergence",
  "hidden div": "hidden_divergence",
  
  // Options terms
  "ce": "call_option",
  "pe": "put_option",
  "call": "call_option",
  "put": "put_option",
  "atm": "at_the_money",
  "itm": "in_the_money",
  "otm": "out_of_the_money",
  "oi": "open_interest",
  "open interest": "open_interest",
  "iv": "implied_volatility",
  "implied vol": "implied_volatility",
  "pcr": "put_call_ratio",
  "put call ratio": "put_call_ratio",
  "max pain": "max_pain",
  "greeks": "option_greeks",
  
  // OI analysis
  "long buildup": "long_buildup",
  "short buildup": "short_buildup",
  "long unwinding": "long_unwinding",
  "short covering": "short_covering",
  "oi change": "open_interest_change",
  
  // Options strategies
  "straddle": "straddle_strategy",
  "strangle": "strangle_strategy",
  "iron condor": "iron_condor_strategy",
  "butterfly": "butterfly_strategy",
  "credit spread": "credit_spread",
  "debit spread": "debit_spread",
  "bull call spread": "bull_call_spread",
  "bear put spread": "bear_put_spread",
  "covered call": "covered_call",
  
  // Indian indices
  "nifty": "nifty_50",
  "nifty50": "nifty_50",
  "nifty 50": "nifty_50",
  "banknifty": "bank_nifty",
  "bank nifty": "bank_nifty",
  "bnf": "bank_nifty",
  "sensex": "sensex",
  "finnifty": "fin_nifty",
  "fin nifty": "fin_nifty",
  "midcap nifty": "nifty_midcap",
  
  // Indian market terms
  "fii": "foreign_institutional_investor",
  "dii": "domestic_institutional_investor",
  "mf": "mutual_fund",
  "retail": "retail_investor",
  "promoter": "promoter_holding",
  "pledge": "promoter_pledge",
  
  // Order types (Indian brokers)
  "mis": "margin_intraday_square_off",
  "cnc": "cash_and_carry",
  "nrml": "normal_carry_forward",
  "bo": "bracket_order",
  "co": "cover_order",
  "amo": "after_market_order",
  "gtt": "good_till_triggered",
  
  // Fees
  "stt": "securities_transaction_tax",
  "stamp duty": "stamp_duty",
  "gst": "goods_services_tax",
  "brokerage": "brokerage_fee",
  "dp charges": "depository_charges",
  
  // Trading styles
  "scalping": "scalper",
  "scalp": "scalper",
  "intraday": "intraday_trader",
  "day trading": "intraday_trader",
  "swing": "swing_trader",
  "swing trading": "swing_trader",
  "positional": "positional_trader",
  "btst": "buy_today_sell_tomorrow",
  "stbt": "sell_today_buy_tomorrow",
  
  // Risk terms
  "dd": "drawdown",
  "mdd": "max_drawdown",
  "max dd": "max_drawdown",
  "var": "value_at_risk",
  "sharpe": "sharpe_ratio",
  "sortino": "sortino_ratio",
  "r multiple": "r_multiple",
  "r:r": "risk_reward_ratio",
  "rr": "risk_reward_ratio",
  "risk reward": "risk_reward_ratio",
  
  // Performance terms
  "win rate": "win_rate",
  "winrate": "win_rate",
  "hit rate": "win_rate",
  "strike rate": "win_rate",
  "profit factor": "profit_factor",
  "pf": "profit_factor",
  "expectancy": "trade_expectancy",
  "edge": "trading_edge",
  "pnl": "profit_and_loss",
  "p&l": "profit_and_loss",
  "p/l": "profit_and_loss",
  "realized pnl": "realized_pnl",
  "unrealized pnl": "unrealized_pnl",
  "mtm": "mark_to_market",
  
  // Psychology terms
  "fomo": "fear_of_missing_out",
  "overtrading": "overtrading",
  "revenge trading": "revenge_trading",
  "tilt": "emotional_tilt",
  
  // Timeframes
  "1m": "1_minute",
  "5m": "5_minute",
  "15m": "15_minute",
  "1h": "1_hour",
  "4h": "4_hour",
  "1d": "daily",
  "1w": "weekly",
  "1M": "monthly",
  "htf": "higher_timeframe",
  "ltf": "lower_timeframe",
  "mtf": "multi_timeframe",
  
  // Colloquial Hindi-English (Indian retail)
  "maal": "accumulation",
  "circuit": "circuit_limit",
  "upper circuit": "upper_circuit",
  "lower circuit": "lower_circuit",
  "uc": "upper_circuit",
  "lc": "lower_circuit",
  "operator": "market_manipulation",
  "pump": "pump_and_dump",
  "dump": "pump_and_dump",
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. INTENT CLUSTERS - Group related concepts for smart routing
// ─────────────────────────────────────────────────────────────────────────────

export const INTENT_CLUSTERS: Record<string, {
  terms: string[];
  tools: string[];
  priority: number;
}> = {
  // Risk Management
  risk_sizing: {
    terms: [
      "position size", "position sizing", "bet size", "lot size", "quantity",
      "risk per trade", "capital at risk", "exposure", "leverage",
      "stop loss", "trailing stop", "atr stop", "risk management",
      "max loss", "daily loss limit", "drawdown"
    ],
    tools: ["fno-risk-advisor", "risk-health-dashboard", "trade-expectancy"],
    priority: 1,
  },
  
  // F&O / Derivatives
  options_trading: {
    terms: [
      "options", "call", "put", "ce", "pe", "strike", "expiry",
      "weekly expiry", "monthly expiry", "oi", "open interest",
      "iv", "implied volatility", "pcr", "max pain", "greeks",
      "delta", "gamma", "theta", "vega", "straddle", "strangle",
      "iron condor", "spread", "long buildup", "short covering"
    ],
    tools: ["options-strategy", "fno-risk-advisor"],
    priority: 1,
  },
  
  // Technical Analysis - Patterns
  chart_patterns: {
    terms: [
      "pattern", "head and shoulders", "double top", "double bottom",
      "cup and handle", "flag", "pennant", "wedge", "triangle",
      "breakout", "breakdown", "fakeout", "support", "resistance",
      "trendline", "channel"
    ],
    tools: ["pattern-matcher", "price-structure", "candlestick-hero"],
    priority: 2,
  },
  
  // Technical Analysis - Candlesticks
  candlestick_patterns: {
    terms: [
      "candlestick", "candle", "doji", "hammer", "engulfing",
      "harami", "morning star", "evening star", "shooting star",
      "marubozu", "pin bar", "inside bar", "outside bar"
    ],
    tools: ["candlestick-hero", "pattern-matcher"],
    priority: 2,
  },
  
  // Technical Analysis - Indicators
  technical_indicators: {
    terms: [
      "rsi", "macd", "stochastic", "bollinger", "atr",
      "adx", "cci", "williams", "momentum", "oscillator",
      "overbought", "oversold", "divergence"
    ],
    tools: ["technical-indicators", "momentum-heatmap", "volatility-regime"],
    priority: 2,
  },
  
  // Moving Averages & Trend
  trend_analysis: {
    terms: [
      "moving average", "ema", "sma", "golden cross", "death cross",
      "trend", "uptrend", "downtrend", "trend strength", "adx",
      "supertrend", "trend following"
    ],
    tools: ["trend-strength", "technical-indicators", "market-regime-radar"],
    priority: 2,
  },
  
  // Volume Analysis
  volume_analysis: {
    terms: [
      "volume", "vwap", "volume profile", "obv", "accumulation",
      "distribution", "delivery", "smart money", "institutional",
      "bulk deal", "block deal", "volume spike"
    ],
    tools: ["delivery-analysis", "trade-flow-intel"],
    priority: 2,
  },
  
  // Pivot & Intraday Levels
  intraday_levels: {
    terms: [
      "pivot", "cpr", "floor pivot", "camarilla", "pdh", "pdl",
      "previous day high", "previous day low", "opening range", "orb",
      "day high", "day low", "support", "resistance"
    ],
    tools: ["price-structure", "playbook-builder"],
    priority: 2,
  },
  
  // Market Regime & Context
  market_regime: {
    terms: [
      "regime", "bull market", "bear market", "sideways",
      "volatility regime", "risk on", "risk off", "sector rotation",
      "market condition", "choppy", "trending"
    ],
    tools: ["market-regime-radar", "volatility-regime"],
    priority: 3,
  },
  
  // Trade Performance & Statistics
  trade_statistics: {
    terms: [
      "win rate", "profit factor", "expectancy", "r multiple",
      "sharpe ratio", "sortino", "drawdown", "pnl", "performance",
      "backtest", "equity curve", "cagr"
    ],
    tools: ["trade-expectancy", "trade-journal", "drawdown-var"],
    priority: 2,
  },
  
  // Trading Psychology & Behavior
  trading_psychology: {
    terms: [
      "journal", "discipline", "overtrading", "revenge trading",
      "fomo", "psychology", "behavior", "bias", "emotion",
      "plan adherence", "rule violation"
    ],
    tools: ["trade-journal", "playbook-builder"],
    priority: 3,
  },
  
  // Indian Market Specific
  indian_market: {
    terms: [
      "nifty", "bank nifty", "sensex", "fii", "dii",
      "stt", "stamp duty", "gst", "brokerage",
      "mis", "cnc", "nrml", "demat", "sebi"
    ],
    tools: ["fno-risk-advisor", "trade-expectancy", "narrative-theme"],
    priority: 1,
  },
  
  // Sector & Theme Analysis
  sector_themes: {
    terms: [
      "sector", "theme", "psu", "defence", "railway", "it",
      "pharma", "bank", "auto", "fmcg", "metal", "realty",
      "rotation", "leader", "laggard"
    ],
    tools: ["narrative-theme"],
    priority: 3,
  },
  
  // Fundamental Analysis
  fundamental_analysis: {
    terms: [
      "pe", "pb", "eps", "roe", "roce", "margin", "growth",
      "revenue", "profit", "dividend", "valuation", "dcf",
      "intrinsic value", "fair value", "piotroski", "altman"
    ],
    tools: ["valuation-summary", "fair-value-forecaster", "piotroski-score", "dupont-analysis", "financial-health-dna"],
    priority: 3,
  },
  
  // Dividend & Income
  income_investing: {
    terms: [
      "dividend", "yield", "payout", "dividend growth",
      "income", "passive income", "drip", "sip"
    ],
    tools: ["dividend-crystal-ball"],
    priority: 3,
  },
  
  // Strategy Building
  strategy_building: {
    terms: [
      "strategy", "playbook", "rules", "entry", "exit",
      "setup", "system", "plan", "checklist", "template"
    ],
    tools: ["playbook-builder"],
    priority: 2,
  },
  
  // Fees & Costs
  trading_costs: {
    terms: [
      "fees", "stt", "gst", "stamp duty", "brokerage",
      "transaction cost", "slippage", "impact cost", "charges"
    ],
    tools: ["trade-expectancy"],
    priority: 2,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. QUERY PATTERNS - Regex patterns for common query structures
// ─────────────────────────────────────────────────────────────────────────────

export const QUERY_PATTERNS: Array<{
  pattern: RegExp;
  intent: string;
  tools: string[];
}> = [
  // "How many lots can I trade with X capital"
  {
    pattern: /how many (lots?|qty|quantity).*?(capital|money|account)/i,
    intent: "position_sizing",
    tools: ["fno-risk-advisor"],
  },
  // "Calculate position size for X"
  {
    pattern: /(calculate|compute|find|what).*(position size|lot size|quantity)/i,
    intent: "position_sizing",
    tools: ["fno-risk-advisor"],
  },
  // "Show RSI divergence"
  {
    pattern: /(show|find|detect).*(divergence|div)/i,
    intent: "divergence_analysis",
    tools: ["technical-indicators", "pattern-matcher"],
  },
  // "What's the support/resistance"
  {
    pattern: /(what|where|show|find).*(support|resistance|level|zone)/i,
    intent: "level_analysis",
    tools: ["price-structure"],
  },
  // "OI analysis for Nifty"
  {
    pattern: /(oi|open interest).*(analysis|buildup|change)/i,
    intent: "oi_analysis",
    tools: ["options-strategy"],
  },
  // "Best strategy for intraday/swing"
  {
    pattern: /(best|good|recommend).*(strategy|setup|system).*(intraday|swing|scalp)/i,
    intent: "strategy_recommendation",
    tools: ["playbook-builder"],
  },
  // "Why am I losing money"
  {
    pattern: /(why|how).*(losing|loss|not profitable)/i,
    intent: "performance_analysis",
    tools: ["trade-journal", "trade-expectancy"],
  },
  // "FII/DII data"
  {
    pattern: /(fii|dii|institutional).*(data|flow|buying|selling)/i,
    intent: "institutional_flow",
    tools: ["narrative-theme"],
  },
  // "Breakout stocks"
  {
    pattern: /(breakout|breakdown|breaking).*(stock|share|scrip)/i,
    intent: "breakout_scan",
    tools: ["pattern-matcher", "price-structure"],
  },
  // "Calculate fees/charges"
  {
    pattern: /(calculate|compute|what).*(fees?|charges?|stt|brokerage|cost)/i,
    intent: "fee_calculation",
    tools: ["trade-expectancy"],
  },
  // "Is X overvalued/undervalued"
  {
    pattern: /(is|check).*(overvalued|undervalued|cheap|expensive|fairly valued)/i,
    intent: "valuation_check",
    tools: ["valuation-summary", "fair-value-forecaster"],
  },
  // "Entry/Exit rules"
  {
    pattern: /(entry|exit|when to buy|when to sell).*(rules?|criteria|conditions?)/i,
    intent: "trading_rules",
    tools: ["playbook-builder"],
  },
  // "Trailing stop for X"
  {
    pattern: /(trailing|dynamic).*(stop|sl)/i,
    intent: "stop_management",
    tools: ["risk-health-dashboard", "fno-risk-advisor"],
  },
  // "Compare with peers"
  {
    pattern: /(compare|vs|versus|peer).*(company|stock|peer)/i,
    intent: "peer_comparison",
    tools: ["peer-comparison"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. QUERY NORMALIZER - Clean and standardize user input
// ─────────────────────────────────────────────────────────────────────────────

export function normalizeQuery(query: string): string {
  let normalized = query.toLowerCase().trim();
  
  // Remove extra spaces
  normalized = normalized.replace(/\s+/g, ' ');
  
  // Replace synonyms with canonical terms
  for (const [synonym, canonical] of Object.entries(SYNONYM_MAP)) {
    const regex = new RegExp(`\\b${escapeRegex(synonym)}\\b`, 'gi');
    normalized = normalized.replace(regex, canonical);
  }
  
  return normalized;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. INTENT DETECTOR - Identify user intent from query
// ─────────────────────────────────────────────────────────────────────────────

export interface DetectedIntent {
  cluster: string;
  confidence: number;
  tools: string[];
  matchedTerms: string[];
}

export function detectIntent(query: string): DetectedIntent[] {
  const normalizedQuery = normalizeQuery(query);
  const results: DetectedIntent[] = [];
  
  // Check query patterns first (highest priority)
  for (const pattern of QUERY_PATTERNS) {
    if (pattern.pattern.test(query)) {
      results.push({
        cluster: pattern.intent,
        confidence: 0.95,
        tools: pattern.tools,
        matchedTerms: [pattern.pattern.source],
      });
    }
  }
  
  // Check intent clusters
  for (const [clusterName, cluster] of Object.entries(INTENT_CLUSTERS)) {
    const matchedTerms: string[] = [];
    
    for (const term of cluster.terms) {
      if (normalizedQuery.includes(term.toLowerCase())) {
        matchedTerms.push(term);
      }
    }
    
    if (matchedTerms.length > 0) {
      // Calculate confidence based on matches and priority
      const termMatchRatio = matchedTerms.length / cluster.terms.length;
      const priorityBoost = (4 - cluster.priority) * 0.1; // Priority 1 = +0.3, Priority 3 = +0.1
      const confidence = Math.min(0.9, termMatchRatio * 2 + priorityBoost);
      
      results.push({
        cluster: clusterName,
        confidence,
        tools: cluster.tools,
        matchedTerms,
      });
    }
  }
  
  // Sort by confidence
  results.sort((a, b) => b.confidence - a.confidence);
  
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. TOOL RECOMMENDER - Get best tools for a query
// ─────────────────────────────────────────────────────────────────────────────

export interface ToolRecommendation {
  toolId: string;
  score: number;
  reasons: string[];
}

export function recommendTools(query: string, maxResults: number = 5): ToolRecommendation[] {
  const intents = detectIntent(query);
  const toolScores: Record<string, { score: number; reasons: string[] }> = {};
  
  for (const intent of intents) {
    for (const tool of intent.tools) {
      if (!toolScores[tool]) {
        toolScores[tool] = { score: 0, reasons: [] };
      }
      
      toolScores[tool].score += intent.confidence;
      toolScores[tool].reasons.push(
        `Matched ${intent.cluster} (${intent.matchedTerms.slice(0, 3).join(', ')})`
      );
    }
  }
  
  // Convert to array and sort
  const recommendations = Object.entries(toolScores)
    .map(([toolId, data]) => ({
      toolId,
      score: Math.min(1, data.score), // Cap at 1
      reasons: data.reasons,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
  
  return recommendations;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. AUTOCOMPLETE SUGGESTIONS - For command bar
// ─────────────────────────────────────────────────────────────────────────────

export const AUTOCOMPLETE_SUGGESTIONS: Array<{
  trigger: string;
  suggestions: string[];
  category: string;
}> = [
  {
    trigger: "show",
    suggestions: [
      "show RSI divergence",
      "show support resistance levels",
      "show OI buildup",
      "show delivery analysis",
      "show candlestick patterns",
    ],
    category: "analysis",
  },
  {
    trigger: "calculate",
    suggestions: [
      "calculate position size for 2L capital",
      "calculate trading fees for intraday",
      "calculate break-even win rate",
      "calculate lot size for 1% risk",
    ],
    category: "calculation",
  },
  {
    trigger: "find",
    suggestions: [
      "find breakout stocks",
      "find undervalued stocks",
      "find high dividend yield stocks",
      "find stocks near support",
    ],
    category: "screening",
  },
  {
    trigger: "what",
    suggestions: [
      "what is my win rate",
      "what are the support levels",
      "what is the fair value",
      "what strategy suits me",
    ],
    category: "query",
  },
  {
    trigger: "why",
    suggestions: [
      "why am I losing money",
      "why is OI increasing",
    ],
    category: "analysis",
  },
  {
    trigger: "how",
    suggestions: [
      "how many lots can I trade",
      "how to set trailing stop",
      "how to improve win rate",
    ],
    category: "guidance",
  },
];

export function getAutocompleteSuggestions(input: string): string[] {
  const lowercaseInput = input.toLowerCase().trim();
  
  // Find matching trigger
  for (const item of AUTOCOMPLETE_SUGGESTIONS) {
    if (lowercaseInput.startsWith(item.trigger)) {
      return item.suggestions.filter(s => 
        s.toLowerCase().startsWith(lowercaseInput) ||
        s.toLowerCase().includes(lowercaseInput)
      );
    }
  }
  
  // Return all suggestions if input is short
  if (lowercaseInput.length < 3) {
    return AUTOCOMPLETE_SUGGESTIONS.flatMap(item => item.suggestions).slice(0, 5);
  }
  
  // Search across all suggestions
  return AUTOCOMPLETE_SUGGESTIONS
    .flatMap(item => item.suggestions)
    .filter(s => s.toLowerCase().includes(lowercaseInput))
    .slice(0, 5);
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CONTEXTUAL HELP - Provide explanations for trading terms
// ─────────────────────────────────────────────────────────────────────────────

export const TERM_EXPLANATIONS: Record<string, {
  definition: string;
  example?: string;
  related: string[];
}> = {
  cpr: {
    definition: "Central Pivot Range - A set of three price levels calculated from previous day's high, low, and close. Used for intraday trading to identify support/resistance.",
    example: "If price opens above CPR, it's bullish. Below CPR is bearish.",
    related: ["pivot", "pdh", "pdl", "floor_pivots"],
  },
  vwap: {
    definition: "Volume Weighted Average Price - The average price weighted by volume. Institutional benchmark for fair value during the day.",
    example: "Price above VWAP = bullish, below VWAP = bearish for intraday.",
    related: ["anchored_vwap", "volume", "institutional"],
  },
  oi_buildup: {
    definition: "Open Interest Buildup - When both price and OI increase together, it indicates new positions being created in the direction of price movement.",
    example: "Price up + OI up = Long buildup (bullish). Price down + OI up = Short buildup (bearish).",
    related: ["open_interest", "long_buildup", "short_buildup", "short_covering"],
  },
  pcr: {
    definition: "Put-Call Ratio - Ratio of put option OI to call option OI. High PCR (>1.2) indicates bearish sentiment, low PCR (<0.8) indicates bullish sentiment.",
    example: "PCR of 1.5 means more puts than calls, indicating hedging or bearish bets.",
    related: ["put_call_ratio", "open_interest", "max_pain"],
  },
  r_multiple: {
    definition: "R-Multiple - Profit or loss expressed as a multiple of initial risk. If you risked ₹1000 and made ₹2000 profit, that's 2R.",
    example: "A 3R trade means you made 3x your initial risk. Aim for avg R > 1.5",
    related: ["risk_reward_ratio", "expectancy", "position_sizing"],
  },
  max_pain: {
    definition: "Max Pain - The strike price at which option buyers would lose the maximum amount. Markets often gravitate toward max pain at expiry.",
    example: "If max pain is 22500 and Nifty is at 22700, there may be selling pressure toward 22500.",
    related: ["open_interest", "expiry", "options"],
  },
  fii_dii: {
    definition: "FII (Foreign Institutional Investors) and DII (Domestic Institutional Investors) - Large players whose buying/selling impacts market direction.",
    example: "FII buying = bullish for markets. Consistent DII buying during FII selling = support.",
    related: ["institutional_flow", "smart_money"],
  },
  delivery_percentage: {
    definition: "Delivery Percentage - Percentage of traded volume that results in actual ownership transfer (not squared off). High delivery = conviction.",
    example: "Delivery > 50% with price up = strong accumulation. < 30% = mostly speculative.",
    related: ["volume", "accumulation", "smart_money"],
  },
};

export function explainTerm(term: string): typeof TERM_EXPLANATIONS[string] | null {
  const normalized = term.toLowerCase().replace(/\s+/g, '_');
  return TERM_EXPLANATIONS[normalized] || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. ERROR MESSAGES - User-friendly error messages for common issues
// ─────────────────────────────────────────────────────────────────────────────

export const ERROR_SUGGESTIONS: Record<string, {
  message: string;
  suggestions: string[];
}> = {
  no_results: {
    message: "No matching tools found for your query.",
    suggestions: [
      "Try using more specific terms like 'RSI divergence' or 'position sizing'",
      "Check if you meant: support resistance, open interest, or technical indicators",
      "Browse all tools in the Tool Explorer",
    ],
  },
  ambiguous_query: {
    message: "Your query matches multiple categories.",
    suggestions: [
      "Add more context: Are you looking for analysis, calculation, or screening?",
      "Specify the asset: stock, index, or F&O",
      "Mention your trading style: intraday, swing, or positional",
    ],
  },
  invalid_symbol: {
    message: "Could not find the specified stock/index.",
    suggestions: [
      "Check the spelling of the symbol",
      "Use NSE symbols (e.g., RELIANCE, TCS, INFY)",
      "For indices, use: NIFTY, BANKNIFTY, SENSEX",
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default {
  SYNONYM_MAP,
  INTENT_CLUSTERS,
  QUERY_PATTERNS,
  normalizeQuery,
  detectIntent,
  recommendTools,
  getAutocompleteSuggestions,
  explainTerm,
  TERM_EXPLANATIONS,
  ERROR_SUGGESTIONS,
};
