// Master Card Registry - All cards with metadata and component mapping

export type CardCategory = 
  | "value" 
  | "growth" 
  | "risk" 
  | "cashflow" 
  | "income" 
  | "macro" 
  | "technical" 
  | "portfolio" 
  | "overview"
  | "mini"
  | "derivatives"
  | "mutual-funds"
  | "commodities";

export type CardKind = "card" | "mini";

// NEW: User segment targeting
export type UserSegment = "scalper" | "intraday" | "swing" | "positional" | "investor";

// NEW: Complexity level
export type ComplexityLevel = "beginner" | "intermediate" | "advanced";

export interface CardDescriptor {
  id: string;
  label: string;
  category: CardCategory;
  kind: CardKind;
  endpoint: string;
  componentPath: string;
  description: string;
  tags: string[];
  dataSources: string[];
  default?: boolean;
  // NEW: Enrichment metadata
  segments?: UserSegment[];           // Which trader types benefit most
  complexity?: ComplexityLevel;       // Skill level required
  hasEdgeMetric?: boolean;            // Contains win-rate, R-multiple, etc.
  hasRiskSizing?: boolean;            // Contains position size helper
  hasBehavioralTip?: boolean;         // Contains coaching insight
}

export const cardRegistry: CardDescriptor[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // OVERVIEW CARDS (1)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "stock-snapshot",
    label: "Stock Snapshot",
    category: "overview",
    kind: "card",
    endpoint: "/api/analytics/stock-snapshot",
    componentPath: "overview/stock-snapshot",
    description: "Primary entry point showing company info, price, day stats, key levels, and mini chart when user types just a ticker.",
    tags: [
      "stock", "ticker", "price", "quote", "overview", "snapshot",
      "market cap", "mcap", "52 week", "volume", "open", "close",
      "day high", "day low", "supply", "demand", "support", "resistance"
    ],
    dataSources: ["LivePrice", "Fundamentals"],
    default: true,
    segments: ["scalper", "intraday", "swing", "positional", "investor"],
    complexity: "beginner",
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // VALUE CARDS (7)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "fair-value-forecaster",
    label: "Fair Value Forecaster",
    category: "value",
    kind: "card",
    endpoint: "/api/analytics/fair-value-forecaster",
    componentPath: "value/fair-value-forecaster",
    description: "Projects future fair value using DCF with probability fan charts and sensitivity analysis.",
    tags: [
      // Core
      "valuation", "dcf", "intrinsic value", "margin of safety", "fair value",
      // Fundamental vocabulary
      "book value", "enterprise value", "EV", "price target",
      // Indian context
      "undervalued", "overvalued", "value investing", "long-term investing"
    ],
    dataSources: ["Fundamentals", "Estimates"],
    default: true,
    segments: ["positional", "investor"],
    complexity: "intermediate",
  },
  {
    id: "valuation-summary",
    label: "Valuation Summary",
    category: "value",
    kind: "card",
    endpoint: "/api/analytics/valuation-summary",
    componentPath: "value/valuation-summary",
    description: "Comprehensive multi-metric valuation dashboard with radar visualization and peer comparisons.",
    tags: [
      // Core multiples
      "valuation", "multiples", "pe", "pb", "ps", "P/E ratio", "price-to-earnings",
      "P/B ratio", "price to book", "forward P/E", "trailing P/E",
      // Comparisons
      "peer comparison", "sector average", "benchmark", "relative valuation",
      // Quality
      "quality factor", "value factor"
    ],
    dataSources: ["Fundamentals", "PeerData"],
    segments: ["swing", "positional", "investor"],
    complexity: "beginner",
  },
  {
    id: "dcf-valuation",
    label: "DCF Valuation",
    category: "value",
    kind: "card",
    endpoint: "/api/analytics/dcf-valuation",
    componentPath: "value/dcf-valuation",
    description: "Full discounted cash flow model with projections and WACC/growth sensitivity matrix.",
    tags: [
      // DCF specific
      "dcf", "discounted cash flow", "intrinsic value", "wacc", "fcf",
      "free cash flow", "FCF", "terminal value", "discount rate",
      // Growth
      "growth rate", "CAGR", "perpetuity", "projection",
      // Sensitivity
      "sensitivity analysis", "scenario", "bull case", "bear case"
    ],
    dataSources: ["Fundamentals", "Estimates"],
    segments: ["investor"],
    complexity: "advanced",
  },
  {
    id: "intrinsic-value-range",
    label: "Intrinsic Value Range",
    category: "value",
    kind: "card",
    endpoint: "/api/analytics/intrinsic-value-range",
    componentPath: "value/intrinsic-value-range",
    description: "Multi-model intrinsic value range with composite fair value calculation.",
    tags: [
      "intrinsic value", "valuation range", "fair value", "price target",
      "margin of safety", "upside potential", "downside risk",
      "Graham number", "book value", "liquidation value"
    ],
    dataSources: ["Fundamentals"],
    segments: ["positional", "investor"],
    complexity: "intermediate",
  },
  {
    id: "piotroski-score",
    label: "Piotroski F-Score",
    category: "value",
    kind: "card",
    endpoint: "/api/analytics/piotroski-score",
    componentPath: "value/piotroski-score",
    description: "9-point financial strength score across profitability, leverage, and efficiency.",
    tags: [
      // Score specific
      "piotroski", "f-score", "financial health", "value investing",
      // Components
      "ROA", "return on assets", "operating cash flow", "accruals",
      "leverage", "debt", "liquidity", "current ratio",
      "gross margin", "asset turnover", "shares outstanding",
      // Quality
      "quality score", "financial strength", "fundamental score"
    ],
    dataSources: ["FinancialStatements"],
    segments: ["positional", "investor"],
    complexity: "intermediate",
    hasEdgeMetric: true,
  },
  {
    id: "dupont-analysis",
    label: "DuPont Analysis",
    category: "value",
    kind: "card",
    endpoint: "/api/analytics/dupont-analysis",
    componentPath: "value/dupont-analysis",
    description: "ROE decomposition into profit margin, asset turnover, and leverage.",
    tags: [
      // DuPont specific
      "dupont", "roe", "ROE", "return on equity",
      // Components
      "profit margin", "net margin", "operating margin", "gross margin",
      "asset turnover", "efficiency", "leverage", "financial leverage",
      // Decomposition
      "ROE breakdown", "profitability", "efficiency ratio"
    ],
    dataSources: ["FinancialStatements"],
    segments: ["positional", "investor"],
    complexity: "intermediate",
  },
  {
    id: "multi-factor-scorecard",
    label: "Multi-Factor Scorecard",
    category: "value",
    kind: "card",
    endpoint: "/api/analytics/multi-factor-scorecard",
    componentPath: "value/multi-factor-scorecard",
    description: "Factor-based quality scoring with radar visualization and rankings.",
    tags: [
      // Factor investing vocabulary
      "factors", "quality", "scoring", "ranking", "composite score",
      "value factor", "momentum factor", "quality factor", "size factor", "low volatility factor",
      // Signals
      "signal", "confidence score", "edge score", "filter", "confluence",
      // Portfolio
      "factor allocation", "factor tilt", "alpha", "beta"
    ],
    dataSources: ["Fundamentals", "FactorData"],
    segments: ["positional", "investor"],
    complexity: "intermediate",
    hasEdgeMetric: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROWTH CARDS (8)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "growth-summary",
    label: "Growth Summary",
    category: "growth",
    kind: "card",
    endpoint: "/api/analytics/growth-summary",
    componentPath: "growth/growth-summary",
    description: "Historical and forward growth metrics with tier classification.",
    tags: [
      // Core growth
      "growth", "revenue", "earnings", "cagr", "CAGR",
      // Fundamental vocabulary
      "revenue growth", "sales", "top line", "bottom line", "net income", "net profit",
      "EPS", "earnings per share", "profit growth",
      // Forward looking
      "forward growth", "estimates", "guidance", "projection"
    ],
    dataSources: ["Fundamentals", "Estimates"],
    default: true,
    segments: ["swing", "positional", "investor"],
    complexity: "beginner",
  },
  {
    id: "efficiency-dashboard",
    label: "Efficiency Dashboard",
    category: "growth",
    kind: "card",
    endpoint: "/api/analytics/efficiency-dashboard",
    componentPath: "growth/efficiency-dashboard",
    description: "Operating efficiency metrics including margins and asset utilization.",
    tags: [
      "efficiency", "margins", "operating leverage",
      // Margin vocabulary
      "operating margin", "net margin", "gross margin", "EBITDA", "EBIT",
      // Efficiency ratios
      "asset turnover", "inventory turnover", "receivables turnover",
      "working capital", "operating efficiency"
    ],
    dataSources: ["FinancialStatements"],
    segments: ["positional", "investor"],
    complexity: "intermediate",
  },
  {
    id: "earnings-stability",
    label: "Earnings Stability",
    category: "growth",
    kind: "card",
    endpoint: "/api/analytics/earnings-stability",
    componentPath: "growth/earnings-stability",
    description: "Earnings consistency and predictability analysis.",
    tags: [
      "earnings", "stability", "predictability",
      // Consistency vocabulary
      "earnings consistency", "EPS stability", "volatility",
      "coefficient of variation", "standard deviation",
      // Quality
      "earnings quality", "reliable earnings"
    ],
    dataSources: ["FinancialStatements"],
    segments: ["positional", "investor"],
    complexity: "intermediate",
  },
  {
    id: "earnings-quality",
    label: "Earnings Quality",
    category: "growth",
    kind: "card",
    endpoint: "/api/analytics/earnings-quality",
    componentPath: "growth/earnings-quality",
    description: "Quality metrics including accruals, cash conversion, and Beneish M-Score.",
    tags: [
      "earnings quality", "accruals", "manipulation risk",
      // Quality indicators
      "Beneish M-Score", "cash conversion", "OCF to net income",
      "receivables quality", "inventory quality",
      // Red flags
      "accounting quality", "aggressive accounting", "red flags"
    ],
    dataSources: ["FinancialStatements"],
    segments: ["positional", "investor"],
    complexity: "advanced",
    hasEdgeMetric: true,
  },
  {
    id: "management-quality",
    label: "Management Quality",
    category: "growth",
    kind: "card",
    endpoint: "/api/analytics/management-quality",
    componentPath: "growth/management-quality",
    description: "Management effectiveness scoring with insider activity.",
    tags: [
      "management", "governance", "insider trades",
      // Indian context
      "promoter holding", "promoter pledge", "pledge release",
      "insider trade", "bulk deal", "block deal",
      // Governance
      "corporate governance", "board quality", "management quality"
    ],
    dataSources: ["Fundamentals", "InsiderData"],
    segments: ["positional", "investor"],
    complexity: "intermediate",
  },
  {
    id: "capital-allocation",
    label: "Capital Allocation",
    category: "growth",
    kind: "card",
    endpoint: "/api/analytics/capital-allocation",
    componentPath: "growth/capital-allocation",
    description: "Capital deployment analysis across reinvestment, buybacks, dividends, and M&A.",
    tags: [
      "capital allocation", "buybacks", "reinvestment",
      // Allocation vocabulary
      "dividend", "dividend payout", "share buyback",
      "capex", "capital expenditure", "M&A", "acquisition",
      // Returns
      "ROIC", "return on invested capital", "reinvestment rate"
    ],
    dataSources: ["FinancialStatements"],
    segments: ["positional", "investor"],
    complexity: "intermediate",
  },
  {
    id: "sales-profit-cash",
    label: "Sales-Profit-Cash Alignment",
    category: "growth",
    kind: "card",
    endpoint: "/api/analytics/sales-profit-cash",
    componentPath: "growth/sales-profit-cash",
    description: "Revenue to profit to cash flow conversion analysis.",
    tags: [
      "sales", "profit", "cash flow", "conversion",
      // Flow vocabulary
      "free cash flow", "FCF", "operating cash flow", "cash conversion",
      "revenue to profit", "profit to cash",
      // Quality
      "cash quality", "earnings to cash"
    ],
    dataSources: ["FinancialStatements"],
    segments: ["positional", "investor"],
    complexity: "intermediate",
  },
  {
    id: "profit-vs-cash-divergence",
    label: "Profit vs Cash Divergence",
    category: "growth",
    kind: "card",
    endpoint: "/api/analytics/profit-cash-divergence",
    componentPath: "growth/profit-vs-cash-divergence",
    description: "Identifies divergences between reported profits and cash generation.",
    tags: [
      "profit", "cash flow", "divergence", "red flags",
      // Warning signs
      "cash divergence", "accrual divergence", "working capital buildup",
      "receivables buildup", "inventory buildup",
      // Quality indicators
      "earnings manipulation", "cash burn"
    ],
    dataSources: ["FinancialStatements"],
    segments: ["positional", "investor"],
    complexity: "advanced",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RISK CARDS (7 + 3 NEW)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "risk-health-dashboard",
    label: "Risk Health Dashboard",
    category: "risk",
    kind: "card",
    endpoint: "/api/analytics/risk-health-dashboard",
    componentPath: "risk/risk-health-dashboard",
    description: "Comprehensive risk assessment across financial, operational, and market risks.",
    tags: [
      "risk", "health", "assessment",
      // Risk management vocabulary
      "risk per trade", "portfolio risk", "capital at risk",
      "stop loss", "stop", "SL", "protective stop", "trailing stop", "trailing SL",
      // Position sizing
      "position size", "position sizing", "bet size", "exposure",
      // Indian F&O
      "margin", "margin utilization", "leverage",
      // Metrics
      "risk-adjusted return", "Sharpe ratio", "Sortino ratio"
    ],
    dataSources: ["Fundamentals", "PriceHistory"],
    default: true,
    segments: ["intraday", "swing", "positional"],
    complexity: "intermediate",
    hasRiskSizing: true,
  },
  {
    id: "drawdown-var",
    label: "Drawdown & VaR",
    category: "risk",
    kind: "card",
    endpoint: "/api/analytics/drawdown-var",
    componentPath: "risk/drawdown-var",
    description: "Maximum drawdown tracking, VaR calculations, and stress scenarios.",
    tags: [
      "drawdown", "var", "volatility", "stress test",
      // Drawdown vocabulary
      "max drawdown", "maximum drawdown", "equity high", "equity low", "underwater curve",
      // VaR
      "value at risk", "VaR", "expected shortfall", "tail risk",
      // Risk limits
      "daily loss limit", "weekly loss limit", "risk cap", "max risk",
      // Stress
      "stress scenario", "worst case", "historical drawdown"
    ],
    dataSources: ["PriceHistory"],
    segments: ["swing", "positional", "investor"],
    complexity: "intermediate",
    hasEdgeMetric: true,
  },
  {
    id: "financial-stress-radar",
    label: "Financial Stress Radar",
    category: "risk",
    kind: "card",
    endpoint: "/api/analytics/financial-stress",
    componentPath: "risk/financial-stress-radar",
    description: "Early warning indicators for financial distress.",
    tags: [
      "stress", "distress", "early warning",
      // Warning signs
      "red flags", "warning sentinel", "deterioration",
      "cash burn", "liquidity crisis", "covenant breach",
      // Fundamental stress
      "interest coverage", "debt service", "working capital stress"
    ],
    dataSources: ["FinancialStatements"],
    segments: ["positional", "investor"],
    complexity: "advanced",
  },
  {
    id: "bankruptcy-health",
    label: "Bankruptcy Health",
    category: "risk",
    kind: "card",
    endpoint: "/api/analytics/bankruptcy-health",
    componentPath: "risk/bankruptcy-health",
    description: "Altman Z-Score and bankruptcy probability analysis.",
    tags: [
      "bankruptcy", "altman z-score", "default risk",
      // Scoring
      "Z-Score", "Altman", "distress score", "default probability",
      // Risk categories
      "safe zone", "grey zone", "distress zone",
      // Related
      "financial health", "solvency", "going concern"
    ],
    dataSources: ["FinancialStatements"],
    segments: ["positional", "investor"],
    complexity: "intermediate",
  },
  {
    id: "working-capital-health",
    label: "Working Capital Health",
    category: "risk",
    kind: "card",
    endpoint: "/api/analytics/working-capital",
    componentPath: "risk/working-capital-health",
    description: "Working capital cycle and liquidity position monitoring.",
    tags: [
      "working capital", "liquidity", "current ratio",
      // Working capital components
      "receivables", "inventory", "payables", "cash conversion cycle",
      // Ratios
      "quick ratio", "acid test", "cash ratio",
      // Health indicators
      "liquidity position", "short-term solvency"
    ],
    dataSources: ["FinancialStatements"],
    segments: ["positional", "investor"],
    complexity: "intermediate",
  },
  {
    id: "leverage-history",
    label: "Leverage History",
    category: "risk",
    kind: "card",
    endpoint: "/api/analytics/leverage-history",
    componentPath: "risk/leverage-history",
    description: "Historical leverage trends and debt covenant analysis.",
    tags: [
      "leverage", "debt", "interest coverage",
      // Debt vocabulary
      "debt-to-equity", "D/E", "net debt", "gross debt",
      "interest coverage ratio", "DSCR", "debt service coverage",
      // Leverage analysis
      "financial leverage", "gearing", "leverage ratio",
      // Covenants
      "debt covenant", "covenant breach"
    ],
    dataSources: ["FinancialStatements"],
    segments: ["positional", "investor"],
    complexity: "intermediate",
  },
  {
    id: "cashflow-stability-index",
    label: "Cashflow Stability Index",
    category: "risk",
    kind: "card",
    endpoint: "/api/analytics/cashflow-stability",
    componentPath: "risk/cashflow-stability-index",
    description: "Cash flow volatility and stability scoring.",
    tags: ["cash flow", "stability", "volatility"],
    dataSources: ["FinancialStatements"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CASHFLOW CARDS (3)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "fcf-health",
    label: "FCF Health",
    category: "cashflow",
    kind: "card",
    endpoint: "/api/analytics/fcf-health",
    componentPath: "cashflow/fcf-health",
    description: "Free cash flow generation and sustainability analysis.",
    tags: ["fcf", "free cash flow", "cash generation"],
    dataSources: ["FinancialStatements"],
  },
  {
    id: "cash-conversion-cycle",
    label: "Cash Conversion Cycle",
    category: "cashflow",
    kind: "card",
    endpoint: "/api/analytics/cash-conversion-cycle",
    componentPath: "cashflow/cash-conversion-cycle",
    description: "Days inventory, receivables, payables, and net cash cycle.",
    tags: ["ccc", "inventory", "receivables", "payables"],
    dataSources: ["FinancialStatements"],
  },
  {
    id: "cash-conversion-earnings",
    label: "Cash Conversion of Earnings",
    category: "cashflow",
    kind: "card",
    endpoint: "/api/analytics/cash-conversion-earnings",
    componentPath: "cashflow/cash-conversion-earnings",
    description: "Earnings to operating cash flow conversion quality.",
    tags: ["cash conversion", "earnings quality", "ocf"],
    dataSources: ["FinancialStatements"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INCOME CARDS (3)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "dividend-crystal-ball",
    label: "Dividend Crystal Ball",
    category: "income",
    kind: "card",
    endpoint: "/api/analytics/dividend-crystal-ball",
    componentPath: "income/dividend-crystal-ball",
    description: "Dividend growth projection with yield on cost forecasts.",
    tags: ["dividends", "yield", "income", "projection"],
    dataSources: ["Fundamentals", "DividendHistory"],
    default: true,
  },
  {
    id: "dividend-sip-tracker",
    label: "Dividend SIP Tracker",
    category: "income",
    kind: "card",
    endpoint: "/api/analytics/dividend-sip-tracker",
    componentPath: "income/dividend-sip-tracker",
    description: "Systematic investment tracking with dividend reinvestment analysis.",
    tags: ["sip", "drip", "dividend reinvestment"],
    dataSources: ["DividendHistory", "PriceHistory"],
  },
  {
    id: "income-stability",
    label: "Income Stability",
    category: "income",
    kind: "card",
    endpoint: "/api/analytics/income-stability",
    componentPath: "income/income-stability",
    description: "Dividend safety and payout sustainability scoring.",
    tags: ["dividend safety", "payout ratio", "stability"],
    dataSources: ["FinancialStatements", "DividendHistory"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MACRO CARDS (7)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "shareholding-pattern",
    label: "Shareholding Pattern",
    category: "macro",
    kind: "card",
    endpoint: "/api/analytics/shareholding-pattern",
    componentPath: "macro/shareholding-pattern",
    description: "Ownership breakdown and changes in institutional/retail holdings.",
    tags: ["shareholding", "ownership", "institutional"],
    dataSources: ["OwnershipData"],
  },
  {
    id: "institutional-flows",
    label: "Institutional Flows",
    category: "macro",
    kind: "card",
    endpoint: "/api/analytics/institutional-flows",
    componentPath: "macro/institutional-flows",
    description: "FII/DII flow tracking and institutional sentiment.",
    tags: ["fii", "dii", "institutional flows"],
    dataSources: ["FlowData"],
  },
  {
    id: "insider-trades",
    label: "Insider Trades",
    category: "macro",
    kind: "card",
    endpoint: "/api/analytics/insider-trades",
    componentPath: "macro/insider-trades",
    description: "Insider buying/selling activity and patterns.",
    tags: ["insider", "trades", "buying", "selling"],
    dataSources: ["InsiderData"],
  },
  {
    id: "macro-calendar",
    label: "Macro Calendar",
    category: "macro",
    kind: "card",
    endpoint: "/api/analytics/macro-calendar",
    componentPath: "macro/macro-calendar",
    description: "Upcoming economic events and central bank decisions.",
    tags: ["macro", "calendar", "events", "fed"],
    dataSources: ["EconomicCalendar"],
  },
  {
    id: "macro-pulse",
    label: "Macro Pulse",
    category: "macro",
    kind: "card",
    endpoint: "/api/analytics/macro-pulse",
    componentPath: "macro/macro-pulse",
    description: "Real-time macro indicator dashboard.",
    tags: ["macro", "indicators", "gdp", "inflation"],
    dataSources: ["MacroData"],
  },
  {
    id: "earnings-calendar",
    label: "Earnings Calendar",
    category: "macro",
    kind: "card",
    endpoint: "/api/analytics/earnings-calendar",
    componentPath: "macro/earnings-calendar",
    description: "Upcoming earnings dates and consensus estimates.",
    tags: ["earnings", "calendar", "estimates"],
    dataSources: ["Estimates"],
  },
  {
    id: "earnings-surprise",
    label: "Earnings Surprise",
    category: "macro",
    kind: "card",
    endpoint: "/api/analytics/earnings-surprise",
    componentPath: "macro/earnings-surprise",
    description: "Historical earnings beats/misses and price reactions.",
    tags: ["earnings", "surprise", "beat", "miss"],
    dataSources: ["Estimates", "PriceHistory"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TECHNICAL CARDS (9 + 4 NEW = 13)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "candlestick-hero",
    label: "Candlestick Hero",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/candlestick-hero",
    componentPath: "technical/candlestick-hero",
    description: "Interactive candlestick chart with overlays and indicators.",
    tags: [
      // Core chart
      "candlestick", "chart", "technical", "indicators",
      // OHLC vocabulary
      "OHLC", "OHLCV", "bar", "candle", "Heikin-Ashi",
      "open", "high", "low", "close", "price", "LTP",
      // Candlestick patterns
      "doji", "hammer", "inverted hammer", "hanging man", "shooting star",
      "engulfing", "bullish engulfing", "bearish engulfing",
      "harami", "morning star", "evening star",
      "marubozu", "spinning top", "pin-bar",
      // Overlays
      "moving average", "MA", "EMA", "SMA", "VWAP"
    ],
    dataSources: ["OHLCV"],
    default: true,
    segments: ["scalper", "intraday", "swing"],
    complexity: "beginner",
  },
  {
    id: "pattern-matcher",
    label: "Pattern Matcher",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/pattern-matcher",
    componentPath: "technical/pattern-matcher",
    description: "Historical pattern matching with outcome statistics.",
    tags: [
      // Core
      "pattern", "matching", "historical", "similarity",
      // Chart patterns
      "head and shoulders", "double top", "double bottom", "triple top",
      "cup and handle", "flag", "bull flag", "bear flag", "pennant",
      "wedge", "rising wedge", "falling wedge",
      "triangle", "ascending triangle", "descending triangle", "symmetrical triangle",
      "channel", "rectangle", "consolidation",
      // Outcomes
      "breakout", "breakdown", "fakeout", "false breakout",
      "win-rate", "hit rate", "expectancy", "R multiple",
      // Regime
      "regime tag", "confidence score"
    ],
    dataSources: ["OHLCV"],
    segments: ["scalper", "intraday", "swing"],
    complexity: "intermediate",
    hasEdgeMetric: true,
  },
  {
    id: "technical-indicators",
    label: "Technical Indicators",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/technical-indicators",
    componentPath: "technical/technical-indicators",
    description: "Comprehensive technical indicator dashboard.",
    tags: [
      // Core
      "rsi", "macd", "bollinger", "indicators",
      // RSI
      "RSI", "relative strength index", "overbought", "oversold",
      // MACD
      "MACD", "moving average convergence divergence", "MACD histogram", "signal line",
      // Stochastic
      "stochastic", "stochastic oscillator", "slow stochastic", "fast stochastic",
      // Bollinger
      "Bollinger Bands", "band squeeze", "band expansion",
      // Other oscillators
      "CCI", "commodity channel index", "ROC", "rate of change", "momentum", "Williams %R",
      // Divergence
      "divergence", "bullish divergence", "bearish divergence", "hidden divergence"
    ],
    dataSources: ["OHLCV"],
    segments: ["scalper", "intraday", "swing"],
    complexity: "intermediate",
  },
  {
    id: "trend-strength",
    label: "Trend Strength",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/trend-strength",
    componentPath: "technical/trend-strength",
    description: "ADX-based trend strength and direction analysis.",
    tags: [
      // Core
      "trend", "adx", "strength", "direction",
      // ADX vocabulary
      "ADX", "average directional index", "+DI", "-DI", "trend strength", "trend intensity",
      // Trend vocabulary
      "uptrend", "downtrend", "sideways", "range", "consolidation",
      "bullish trend", "bearish trend", "trend reversal", "trend continuation",
      // Moving average trends
      "golden cross", "death cross", "moving average crossover",
      // Trend tools
      "Supertrend", "trend filter", "trend bias"
    ],
    dataSources: ["OHLCV"],
    segments: ["intraday", "swing", "positional"],
    complexity: "beginner",
  },
  {
    id: "momentum-heatmap",
    label: "Momentum Heatmap",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/momentum-heatmap",
    componentPath: "technical/momentum-heatmap",
    description: "Multi-timeframe momentum visualization.",
    tags: [
      // Core
      "momentum", "heatmap", "timeframes",
      // Multi-timeframe
      "multi-timeframe", "multi TF", "MTF",
      "1-minute", "5-minute", "15-minute", "hourly", "daily", "weekly",
      // Momentum indicators
      "RSI momentum", "MACD momentum", "rate of change",
      // Sector momentum
      "sector momentum", "relative strength", "RS",
      // Trading styles
      "intraday", "scalping", "swing trading"
    ],
    dataSources: ["OHLCV"],
    segments: ["scalper", "intraday", "swing"],
    complexity: "intermediate",
  },
  {
    id: "volatility-regime",
    label: "Volatility Regime",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/volatility-regime",
    componentPath: "technical/volatility-regime",
    description: "Volatility regime detection and breakout alerts.",
    tags: [
      // Core
      "volatility", "regime", "breakout", "atr",
      // Volatility vocabulary
      "ATR", "average true range", "volatility stop", "ATR stop", "Chandelier exit",
      "realized volatility", "historical volatility", "volatility spike", "volatility crush",
      // Regimes
      "low volatility", "high volatility", "volatility cluster",
      "volatility compression", "volatility expansion",
      // Breakout
      "volatility breakout", "range breakout", "squeeze", "band squeeze"
    ],
    dataSources: ["OHLCV"],
    segments: ["scalper", "intraday", "swing"],
    complexity: "intermediate",
  },
  {
    id: "seasonality-pattern",
    label: "Seasonality Pattern",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/seasonality-pattern",
    componentPath: "technical/seasonality-pattern",
    description: "Monthly and day-of-week seasonality analysis.",
    tags: [
      "seasonality", "monthly", "patterns",
      // Time patterns
      "day-of-week", "weekly pattern", "monthly pattern",
      "January effect", "sell in May",
      // Sessions
      "pre-market", "opening session", "closing session",
      "opening hour", "closing hour", "lunch session"
    ],
    dataSources: ["OHLCV"],
    segments: ["swing", "positional"],
    complexity: "intermediate",
  },
  {
    id: "market-regime-radar",
    label: "Market Regime Radar",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/market-regime",
    componentPath: "technical/market-regime-radar",
    description: "Multi-factor market regime classification.",
    tags: [
      // Core
      "regime", "market", "bull", "bear",
      // Regime vocabulary
      "bull market", "bear market", "sideways market", "range-bound", "choppy", "trending",
      "volatility regime", "risk-on", "risk-off",
      // Context
      "macro regime", "market context", "rotation", "sector rotation",
      // Filters
      "regime filter", "trend filter", "volatility filter"
    ],
    dataSources: ["OHLCV", "MacroData"],
    segments: ["swing", "positional", "investor"],
    complexity: "intermediate",
    hasEdgeMetric: true,
  },
  {
    id: "price-structure",
    label: "Price Structure",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/price-structure",
    componentPath: "technical/price-structure",
    description: "Support/resistance levels and price structure analysis.",
    tags: [
      // Core
      "support", "resistance", "structure", "levels",
      // Price structure vocabulary
      "support level", "resistance level", "demand zone", "supply zone",
      "key level", "price floor", "price ceiling", "level retest",
      // Swing points
      "higher high", "higher low", "lower high", "lower low",
      "swing high", "swing low", "pivot high", "pivot low",
      // Pivots
      "pivot point", "floor pivots", "Woodie pivots", "Camarilla pivots",
      "CPR", "central pivot range", "CPR width", "narrow CPR", "wide CPR",
      "R1", "R2", "R3", "S1", "S2", "S3",
      // Daily levels
      "previous day high", "previous day low", "PDH", "PDL", "PDC",
      "day high", "day low", "opening range", "ORB"
    ],
    dataSources: ["OHLCV"],
    segments: ["scalper", "intraday", "swing"],
    complexity: "beginner",
  },

  // NEW TECHNICAL TOOLS - Added for Learning Path Coverage
  {
    id: "volume-profile",
    label: "Volume Profile",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/volume-profile",
    componentPath: "technical/volume-profile",
    description: "Volume-at-price analysis showing POC, Value Area (VAH/VAL), HVN/LVN zones, and volume delta for order flow reading.",
    tags: [
      // Core
      "volume profile", "POC", "point of control", "value area", "VAH", "VAL",
      // Volume nodes
      "HVN", "LVN", "high volume node", "low volume node", "volume cluster",
      // Order flow
      "order flow", "volume delta", "buy volume", "sell volume", "footprint",
      // Trading
      "market profile", "auction", "fair value", "acceptance", "rejection",
      // Levels
      "volume support", "volume resistance", "naked POC", "composite profile"
    ],
    dataSources: ["OHLCV", "VolumeData"],
    segments: ["scalper", "intraday"],
    complexity: "advanced",
    hasEdgeMetric: true,
  },
  {
    id: "vwap-analysis",
    label: "VWAP Analysis",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/vwap-analysis",
    componentPath: "technical/vwap-analysis",
    description: "Session VWAP with standard deviation bands, anchored VWAPs, and mean reversion signals for intraday trading.",
    tags: [
      // Core
      "VWAP", "volume weighted average price", "session VWAP", "intraday",
      // Bands
      "VWAP bands", "standard deviation", "upper band", "lower band",
      "overbought", "oversold", "extended", "mean reversion",
      // Anchored
      "anchored VWAP", "AVWAP", "event VWAP", "earnings VWAP",
      // Trading
      "institutional price", "fair price", "VWAP magnet", "VWAP bounce",
      "VWAP support", "VWAP resistance", "VWAP reclaim"
    ],
    dataSources: ["OHLCV", "VolumeData"],
    segments: ["scalper", "intraday"],
    complexity: "intermediate",
    hasEdgeMetric: true,
  },
  {
    id: "orb-analysis",
    label: "Opening Range Breakout",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/orb-analysis",
    componentPath: "technical/orb-analysis",
    description: "Opening Range Breakout analysis with 5/15/30 min ranges, gap classification, breakout signals, and false breakout detection.",
    tags: [
      // Core
      "ORB", "opening range", "opening range breakout", "first hour",
      // Timeframes
      "5 minute ORB", "15 minute ORB", "30 minute ORB", "IB", "initial balance",
      // Breakout
      "breakout", "breakdown", "false breakout", "fakeout", "trap",
      "breakout confirmation", "breakout strength",
      // Gap
      "gap up", "gap down", "gap fill", "gap fade", "full gap", "partial gap",
      // Levels
      "ORB high", "ORB low", "ORB midpoint", "target", "extension",
      // Sessions
      "opening bell", "first candle", "morning session", "opening drive"
    ],
    dataSources: ["OHLCV"],
    segments: ["scalper", "intraday"],
    complexity: "intermediate",
    hasEdgeMetric: true,
    hasRiskSizing: true,
  },
  {
    id: "fibonacci-levels",
    label: "Fibonacci Levels",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/fibonacci-levels",
    componentPath: "technical/fibonacci-levels",
    description: "Auto-detected Fibonacci retracement and extension levels with golden pocket zone, confluence detection, and historical reaction analysis.",
    tags: [
      // Core
      "fibonacci", "fib", "retracement", "extension", "pullback",
      // Levels
      "23.6%", "38.2%", "50%", "61.8%", "78.6%", "golden ratio", "golden pocket",
      "127.2%", "161.8%", "261.8%", "fib extension",
      // Trading
      "fib support", "fib resistance", "fib confluence", "fib reaction",
      "healthy pullback", "deep pullback", "shallow pullback",
      // Swing
      "swing high", "swing low", "auto swing", "trend retracement",
      // Entry
      "entry zone", "target zone", "stop loss zone"
    ],
    dataSources: ["OHLCV"],
    segments: ["swing", "positional"],
    complexity: "intermediate",
    hasRiskSizing: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PORTFOLIO CARDS (6 + 1 NEW)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "peer-comparison",
    label: "Peer Comparison",
    category: "portfolio",
    kind: "card",
    endpoint: "/api/analytics/peer-comparison",
    componentPath: "portfolio/peer-comparison",
    description: "Side-by-side comparison with industry peers.",
    tags: ["peers", "comparison", "benchmarking"],
    dataSources: ["Fundamentals", "PeerData"],
  },
  {
    id: "portfolio-correlation",
    label: "Portfolio Correlation",
    category: "portfolio",
    kind: "card",
    endpoint: "/api/analytics/portfolio-correlation",
    componentPath: "portfolio/portfolio-correlation",
    description: "Correlation matrix and diversification analysis.",
    tags: ["correlation", "diversification", "matrix"],
    dataSources: ["PriceHistory"],
  },
  {
    id: "rebalance-optimizer",
    label: "Rebalance Optimizer",
    category: "portfolio",
    kind: "card",
    endpoint: "/api/analytics/rebalance-optimizer",
    componentPath: "portfolio/rebalance-optimizer",
    description: "Portfolio rebalancing recommendations with trade generation.",
    tags: ["rebalance", "optimization", "allocation"],
    dataSources: ["Portfolio", "PriceHistory"],
    default: true,
  },
  {
    id: "etf-comparator",
    label: "ETF Comparator",
    category: "portfolio",
    kind: "card",
    endpoint: "/api/analytics/etf-comparator",
    componentPath: "portfolio/etf-comparator",
    description: "ETF comparison with holdings overlap analysis.",
    tags: ["etf", "comparison", "overlap", "holdings"],
    dataSources: ["ETFData"],
  },
  {
    id: "portfolio-leaderboard",
    label: "Portfolio Leaderboard",
    category: "portfolio",
    kind: "card",
    endpoint: "/api/analytics/portfolio-leaderboard",
    componentPath: "portfolio/portfolio-leaderboard",
    description: "Portfolio performance ranking and attribution.",
    tags: ["leaderboard", "performance", "ranking"],
    dataSources: ["Portfolio", "PriceHistory"],
  },
  {
    id: "options-interest",
    label: "Options Interest Dashboard",
    category: "portfolio",
    kind: "card",
    endpoint: "/api/analytics/options-interest",
    componentPath: "portfolio/options-interest",
    description: "Put/call ratios, open interest, and options flow.",
    tags: ["options", "put/call", "open interest", "flow"],
    dataSources: ["OptionsData"],
  },
  {
    id: "tax-calculator",
    label: "Tax Calculator",
    category: "portfolio",
    kind: "card",
    endpoint: "/api/analytics/tax-calculator",
    componentPath: "portfolio/tax-calculator",
    description: "LTCG/STCG tax computation with ₹1.25L exemption, tax-loss harvesting suggestions, dividend tax impact, and holding period analysis.",
    tags: [
      // Core
      "tax", "capital gains", "LTCG", "STCG", "tax calculator",
      // Tax types
      "long term capital gains", "short term capital gains", "12.5%", "20%",
      "dividend tax", "TDS", "tax deducted at source",
      // Exemptions
      "tax exemption", "₹1.25 lakh", "₹125000", "grandfathering",
      // Tax planning
      "tax loss harvesting", "tax saving", "set off", "carry forward",
      "wash sale", "holding period",
      // Financial year
      "FY", "financial year", "ITR", "income tax",
      // Indian specific
      "Section 112A", "Section 111A", "budget 2024"
    ],
    dataSources: ["Portfolio", "TransactionData"],
    segments: ["positional", "investor"],
    complexity: "intermediate",
    hasBehavioralTip: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MUTUAL FUNDS CARDS (3)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mf-explorer",
    label: "Mutual Fund Explorer",
    category: "mutual-funds",
    kind: "card",
    endpoint: "/api/analytics/mf-explorer",
    componentPath: "mutual-funds/mf-explorer",
    description: "Discover and filter mutual funds across equity, debt, and hybrid categories with comprehensive metrics.",
    tags: [
      "mutual funds", "mf", "sip", "nav", "aum", "expense ratio",
      "equity funds", "debt funds", "hybrid funds", "elss", "tax saving",
      "large cap", "mid cap", "small cap", "flexi cap", "index funds",
      "liquid funds", "gilt funds", "balanced funds", "arbitrage",
      "fund explorer", "fund screener", "fund search"
    ],
    dataSources: ["MFData", "NAVHistory"],
    default: true,
    segments: ["investor"],
    complexity: "beginner",
  },
  {
    id: "mf-analyzer",
    label: "Mutual Fund Analyzer",
    category: "mutual-funds",
    kind: "card",
    endpoint: "/api/analytics/mf-analyzer",
    componentPath: "mutual-funds/mf-analyzer",
    description: "Deep analysis and side-by-side comparison of mutual funds with risk metrics, portfolio composition, and rolling returns.",
    tags: [
      "mutual fund comparison", "fund analysis", "sharpe ratio", "sortino ratio",
      "alpha", "beta", "standard deviation", "max drawdown", "rolling returns",
      "portfolio overlap", "sector allocation", "market cap allocation",
      "fund performance", "risk metrics", "fund comparison"
    ],
    dataSources: ["MFData", "NAVHistory", "Holdings"],
    segments: ["investor"],
    complexity: "intermediate",
  },
  {
    id: "mf-portfolio-optimizer",
    label: "MF Portfolio Optimizer",
    category: "mutual-funds",
    kind: "card",
    endpoint: "/api/analytics/mf-portfolio-optimizer",
    componentPath: "mutual-funds/mf-portfolio-optimizer",
    description: "Optimize mutual fund allocation using efficient frontier analysis, correlation matrices, and risk-adjusted optimization strategies.",
    tags: [
      "portfolio optimization", "efficient frontier", "asset allocation",
      "risk parity", "max sharpe", "min volatility", "correlation matrix",
      "diversification", "rebalancing", "weight optimization",
      "mpt", "modern portfolio theory", "fund allocation"
    ],
    dataSources: ["MFData", "NAVHistory", "Holdings"],
    segments: ["investor"],
    complexity: "advanced",
    hasRiskSizing: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMMODITIES (1)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mcx-commodity-dashboard",
    label: "MCX Commodity Dashboard",
    category: "commodities",
    kind: "card",
    endpoint: "/api/analytics/mcx-commodity-dashboard",
    componentPath: "commodities/mcx-commodity-dashboard",
    description: "Comprehensive MCX futures dashboard for bullion, base metals, and energy with live prices, margin calculator, contract chain, spread analysis, and P&L calculator.",
    tags: [
      "mcx", "commodity", "commodities", "futures",
      "gold", "silver", "bullion", "precious metals",
      "copper", "aluminium", "zinc", "lead", "nickel", "base metals", "industrial metals",
      "crude oil", "natural gas", "energy", "brent", "wti",
      "margin calculator", "lot size", "contract chain", "spread trading",
      "calendar spread", "gold silver ratio", "open interest", "volume",
      "contango", "backwardation", "roll cost",
      "comex", "lme", "nymex", "global parity",
      "hedging", "speculation", "commodity trading"
    ],
    dataSources: ["MCXData", "GlobalBenchmarks"],
    segments: ["intraday", "swing", "positional"],
    complexity: "intermediate",
    hasRiskSizing: true,
    default: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MINI CARDS (4)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "sentiment-zscore-mini",
    label: "Sentiment Z-Score",
    category: "mini",
    kind: "mini",
    endpoint: "/api/minis/sentiment-zscore",
    componentPath: "mini/sentiment-zscore",
    description: "Return and volume z-scores as compact gauges.",
    tags: ["sentiment", "zscore", "momentum"],
    dataSources: ["PriceHistory"],
    default: true,
  },
  {
    id: "factor-tilt-mini",
    label: "Factor Tilt",
    category: "mini",
    kind: "mini",
    endpoint: "/api/minis/factor-tilt",
    componentPath: "mini/factor-tilt",
    description: "Value, growth, momentum factor exposures.",
    tags: ["factors", "tilt", "exposure"],
    dataSources: ["FactorData"],
    default: true,
  },
  {
    id: "warning-sentinel-mini",
    label: "Warning Sentinel",
    category: "mini",
    kind: "mini",
    endpoint: "/api/minis/warning-sentinel",
    componentPath: "mini/warning-sentinel",
    description: "Risk alerts and warnings condensed view.",
    tags: ["warnings", "alerts", "risk"],
    dataSources: ["Fundamentals", "PriceHistory"],
    default: true,
  },
  {
    id: "crash-warning-mini",
    label: "Crash Warning",
    category: "mini",
    kind: "mini",
    endpoint: "/api/minis/crash-warning",
    componentPath: "mini/crash-warning",
    description: "Traffic light crash risk indicator using rule-based analysis of momentum, volatility, and drawdown.",
    tags: ["crash", "risk", "volatility", "drawdown", "warning"],
    dataSources: ["PriceHistory", "Volatility"],
    default: true,
  },
  {
    id: "altman-graham-mini",
    label: "Altman & Graham",
    category: "mini",
    kind: "mini",
    endpoint: "/api/minis/altman-graham",
    componentPath: "mini/altman-graham",
    description: "Altman Z-score and Graham number quick view.",
    tags: ["altman", "graham", "value"],
    dataSources: ["FinancialStatements"],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NEW COMPETITIVE ADVANTAGE CARDS (3+)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "delivery-analysis",
    label: "Delivery Analysis Pro",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/delivery-analysis",
    componentPath: "technical/delivery-analysis",
    description: "Smart money flow detection using delivery percentage, accumulation/distribution scoring, and divergence alerts.",
    tags: [
      // Core
      "delivery", "smart money", "accumulation", "distribution", "institutional",
      // Volume vocabulary
      "volume", "volume bar", "relative volume", "RVOL", "volume spike", "volume surge",
      "on-balance volume", "OBV", "accumulation/distribution", "A/D line",
      "volume profile", "market profile", "value area", "point of control", "POC",
      // Volume divergence
      "volume divergence", "volume confirmation", "volume exhaustion",
      // Smart money
      "smart money footprint", "institutional buying", "institutional selling",
      // Indian specific
      "delivery percentage", "delivery volume", "bulk deal", "block deal"
    ],
    dataSources: ["OHLCV", "DeliveryData"],
    default: true,
    segments: ["swing", "positional"],
    complexity: "intermediate",
    hasEdgeMetric: true,
  },
  {
    id: "trade-flow-intel",
    label: "Trade Flow Intelligence",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/trade-flow-intel",
    componentPath: "technical/trade-flow-intel",
    description: "Institutional activity detection through trade size analysis, flow estimation, and unusual activity alerts.",
    tags: [
      // Core
      "trade flow", "institutional", "retail", "volume", "unusual activity",
      // Order flow vocabulary
      "order flow", "tape reading", "time and sales", "prints",
      "block trade", "bulk trade", "iceberg order",
      // VWAP
      "VWAP", "volume weighted average price", "anchored VWAP", "intraday VWAP", "VWAP band",
      // Depth
      "liquidity", "depth", "market depth", "order book", "bid size", "ask size", "DOM",
      // Activity
      "buy volume", "sell volume", "up-volume", "down-volume",
      "volume Z-score", "unusual volume", "volume anomaly"
    ],
    dataSources: ["OHLCV", "TradeData"],
    segments: ["scalper", "intraday", "swing"],
    complexity: "intermediate",
  },
  {
    id: "financial-health-dna",
    label: "Financial Health DNA",
    category: "value",
    kind: "card",
    endpoint: "/api/analytics/financial-health-dna",
    componentPath: "value/financial-health-dna",
    description: "Comprehensive health analysis combining Piotroski F-Score, Altman Z-Score, cash quality, and leverage metrics.",
    tags: [
      // Core
      "piotroski", "altman", "health", "bankruptcy", "quality",
      // Scores
      "F-Score", "Z-Score", "composite score", "quality score", "financial strength",
      // Health indicators
      "financial health", "solvency", "liquidity", "leverage",
      "debt-to-equity", "interest coverage", "current ratio"
    ],
    dataSources: ["FinancialStatements", "CashFlow"],
    default: true,
    segments: ["positional", "investor"],
    complexity: "intermediate",
    hasEdgeMetric: true,
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // NEW TOOLS - India F&O Focused (6)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "fno-risk-advisor",
    label: "F&O Risk Advisor",
    category: "risk",
    kind: "card",
    endpoint: "/api/analytics/fno-risk-advisor",
    componentPath: "risk/fno-risk-advisor",
    description: "SEBI-safe leverage calculator with position sizing, drawdown probability, and risk zone warnings based on actual loss statistics.",
    tags: [
      // Core risk
      "fno", "risk", "position sizing", "sebi", "leverage", "drawdown", "india",
      // Position sizing vocabulary
      "position size", "bet size", "exposure", "notional exposure",
      "risk per trade", "portfolio risk", "capital at risk",
      // Leverage
      "leverage", "leverage factor", "gross exposure", "net exposure",
      // Stops
      "stop loss", "stop", "SL", "protective stop", "ATR stop",
      // Indian F&O
      "futures", "index future", "stock future", "lot", "lot size", "contract", "contract value",
      "margin", "SPAN margin", "exposure margin", "margin utilization",
      // SEBI
      "SEBI study", "retail loss", "F&O loss"
    ],
    dataSources: ["UserInput", "MarketData"],
    default: true,
    segments: ["scalper", "intraday", "swing"],
    complexity: "beginner",
    hasRiskSizing: true,
    hasBehavioralTip: true,
  },
  {
    id: "trade-expectancy",
    label: "Trade Expectancy Simulator",
    category: "risk",
    kind: "card",
    endpoint: "/api/analytics/trade-expectancy",
    componentPath: "risk/trade-expectancy",
    description: "Calculates realistic P&L expectancy including Indian fee structure (STT, GST, stamp duty). Shows break-even win rate and drawdown probability.",
    tags: [
      // Core expectancy
      "expectancy", "fees", "stt", "gst", "kelly", "break-even", "india",
      // Trade statistics vocabulary
      "win-rate", "hit rate", "strike rate", "success rate",
      "average win", "average loss", "profit factor", "expectancy",
      "R multiple", "R:R", "reward-to-risk", "risk-to-reward",
      // Fees vocabulary
      "STT", "securities transaction tax", "stamp duty", "GST",
      "brokerage", "exchange fees", "transaction cost", "impact cost", "slippage",
      // Performance
      "P&L", "profit and loss", "realized P&L", "net P&L",
      "equity curve", "CAGR", "Sharpe ratio"
    ],
    dataSources: ["UserInput"],
    default: true,
    segments: ["scalper", "intraday", "swing"],
    complexity: "intermediate",
    hasEdgeMetric: true,
    hasRiskSizing: true,
  },
  {
    id: "trade-journal",
    label: "Trade Journal Analytics",
    category: "portfolio",
    kind: "card",
    endpoint: "/api/analytics/trade-journal",
    componentPath: "portfolio/trade-journal",
    description: "Behavioral feedback from trade history. P&L by session, day, instrument. Identifies patterned mistakes and what-if scenarios.",
    tags: [
      // Core journal
      "journal", "behavioral", "analytics", "discipline", "psychology", "patterns",
      // Journaling vocabulary
      "trading journal", "log", "trade log", "trade notes", "tagging",
      "plan adherence", "discipline score", "rule violation",
      // Psychology vocabulary
      "overtrading", "revenge trading", "FOMO", "fear of missing out", "tilt", "chasing", "impulse trade",
      "bias", "confirmation bias", "loss aversion", "disposition effect",
      // Performance by time
      "P&L by session", "P&L by day", "performance by time",
      "opening session", "closing session", "lunch session",
      // What-if
      "what-if", "simulation", "backtest"
    ],
    dataSources: ["TradeHistory"],
    default: false,
    segments: ["scalper", "intraday", "swing", "positional"],
    complexity: "intermediate",
    hasEdgeMetric: true,
    hasBehavioralTip: true,
  },
  {
    id: "playbook-builder",
    label: "Playbook Builder",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/playbook-builder",
    componentPath: "technical/playbook-builder",
    description: "Auto-generates trading playbooks based on style (scalper, intraday, swing, positional, investor). Includes timeframes, indicators, and rules.",
    tags: [
      // Core playbook
      "playbook", "strategy", "rules", "timeframes", "scalper", "swing", "intraday",
      // Strategy vocabulary
      "trend following", "trend-following system", "breakout system",
      "mean reversion", "pullback strategy", "dip buying", "reversal strategy",
      "momentum strategy", "swing strategy", "intraday breakout", "ORB strategy",
      "scalping", "range trading", "volatility breakout",
      // Timeframes
      "timeframe", "multi-timeframe", "multi TF",
      "tick chart", "1-minute", "5-minute", "15-minute", "hourly", "daily", "weekly",
      // Styles
      "day trading", "scalper", "swing trader", "positional", "long-term investing",
      // Rules
      "entry rules", "exit rules", "stop rules", "target rules"
    ],
    dataSources: ["Static"],
    default: false,
    segments: ["scalper", "intraday", "swing", "positional", "investor"],
    complexity: "beginner",
    hasBehavioralTip: true,
  },
  {
    id: "narrative-theme",
    label: "Narrative Theme Tracker",
    category: "macro",
    kind: "card",
    endpoint: "/api/analytics/narrative-theme",
    componentPath: "macro/narrative-theme",
    description: "Systematizes market themes (PSU banks, Defence, Railway, etc.) with leaders, laggards, catalysts, and pullback zones for swing entries.",
    tags: [
      // Core themes
      "themes", "narratives", "psu", "defence", "railway", "sectors", "india",
      // Indian market vocabulary
      "Nifty 50", "Nifty Bank", "Bank Nifty", "Sensex",
      "sector indices", "PSU index", "IT index", "Pharma index",
      "NSE", "BSE", "cash market", "equity cash",
      // Sector rotation
      "sector rotation", "rotation", "thematic", "theme investing",
      // Leaders/laggards
      "leader", "laggard", "relative strength", "outperformer", "underperformer",
      // Flows
      "FII", "DII", "institutional flows", "MF flows", "mutual fund",
      // Pullback
      "pullback zone", "entry zone", "swing entry", "accumulation zone"
    ],
    dataSources: ["SectorFlows", "MFData", "FIIData"],
    default: false,
    segments: ["swing", "positional", "investor"],
    complexity: "intermediate",
    hasEdgeMetric: true,
  },
  {
    id: "options-strategy",
    label: "Options Strategy Explainer",
    category: "derivatives",
    kind: "card",
    endpoint: "/api/analytics/options-strategy",
    componentPath: "derivatives/options-strategy",
    description: "Pre-trade risk explanation for common options strategies. Shows max profit/loss, margin, IV edge, and break-even probabilities.",
    tags: [
      // Core options
      "options", "strategy", "straddle", "strangle", "spread", "iron condor", "iv",
      // Options vocabulary
      "call option", "put option", "European option", "American option",
      "strike", "strike price", "expiry", "weekly expiry", "monthly expiry", "series",
      // Greeks
      "Greeks", "delta", "gamma", "theta", "vega", "rho",
      // OI
      "open interest", "OI change", "OI buildup",
      "long buildup", "short buildup", "long unwinding", "short covering",
      // IV
      "implied volatility", "IV", "IV percentile", "IV rank", "IV crush", "IV spike",
      // Strategies
      "straddle", "strangle", "covered call", "covered put",
      "credit spread", "debit spread", "iron condor", "butterfly",
      "bull call spread", "bear put spread", "ratio spread", "calendar spread",
      // Chain
      "option chain", "chain data", "max pain", "put-call ratio", "PCR",
      "skew", "volatility smile", "volatility surface",
      // Margin
      "margin", "SPAN margin", "margin requirement", "premium",
      // Indian specific
      "Nifty options", "Bank Nifty options", "weekly options", "F&O ban"
    ],
    dataSources: ["OptionsChain", "Volatility"],
    default: true,
    segments: ["scalper", "intraday", "swing"],
    complexity: "advanced",
    hasEdgeMetric: true,
    hasRiskSizing: true,
  },
  {
    id: "nse-currency-dashboard",
    label: "NSE Currency Dashboard",
    category: "derivatives",
    kind: "card",
    endpoint: "/api/analytics/nse-currency-dashboard",
    componentPath: "derivatives/nse-currency-dashboard",
    description: "Comprehensive NSE currency derivatives dashboard for INR pairs (USD/EUR/GBP/JPY) and cross-currency pairs (EUR/USD, GBP/USD, USD/JPY) with live quotes, margin calculator, options chain, and P&L tracking.",
    tags: [
      "currency", "forex", "fx", "derivatives", "nse cds",
      "usdinr", "eurinr", "gbpinr", "jpyinr",
      "eurusd", "gbpusd", "usdjpy", "cross currency",
      "rbi", "reference rate", "fbil",
      "dollar", "rupee", "euro", "pound", "yen",
      "margin calculator", "options chain", "futures",
      "currency futures", "currency options",
      "hedging", "currency trading", "forex trading",
      "weekly expiry", "monthly expiry",
      "spot rate", "forward premium", "carry trade"
    ],
    dataSources: ["NSECurrency", "RBIRates"],
    default: true,
    segments: ["intraday", "swing", "positional"],
    complexity: "intermediate",
    hasRiskSizing: true,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // NEW ENHANCED CARDS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "sector-rotation-tracker",
    label: "Sector Rotation Tracker",
    category: "macro",
    kind: "card",
    endpoint: "/api/analytics/sector-rotation-tracker",
    componentPath: "macro/sector-rotation-tracker",
    description: "Tracks sector leadership shifts and intra-sector rotation with relative strength rankings, sub-sector breakdowns, and rotation signals.",
    tags: [
      "sector rotation", "relative strength", "leadership", "momentum",
      "intra-sector", "sub-sector", "rs ranking", "sector momentum",
      "market phase", "risk on", "risk off", "rotation signals"
    ],
    dataSources: ["SectorData", "RelativeStrength"],
    segments: ["swing", "positional", "investor"],
    complexity: "intermediate",
    hasBehavioralTip: true,
  },
  {
    id: "sentiment-contradiction",
    label: "Sentiment Contradiction Detector",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/sentiment-contradiction",
    componentPath: "technical/sentiment-contradiction",
    description: "Flags conflicting signals across different data sources (price, volume, options, positioning) for contrarian opportunities. Shows historical pattern resolution.",
    tags: [
      "sentiment", "contradiction", "divergence", "contrarian",
      "put call ratio", "options flow", "volume", "positioning",
      "cross signal", "conflicting signals", "smart money"
    ],
    dataSources: ["Sentiment", "OptionsFlow", "PositioningData"],
    segments: ["swing", "positional"],
    complexity: "advanced",
    hasEdgeMetric: true,
    hasBehavioralTip: true,
  },
  {
    id: "portfolio-drift-monitor",
    label: "Portfolio Drift Monitor",
    category: "portfolio",
    kind: "card",
    endpoint: "/api/analytics/portfolio-drift-monitor",
    componentPath: "portfolio/portfolio-drift-monitor",
    description: "Tracks deviation from original investment thesis with entry vs current metrics comparison, drift scoring, and rebalancing alerts. Includes thesis storage and review reminders.",
    tags: [
      "portfolio drift", "thesis tracking", "rebalancing", "discipline",
      "entry thesis", "deviation alert", "holding review", "position management",
      "thesis decay", "metric tracking", "investment thesis"
    ],
    dataSources: ["Portfolio", "Fundamentals"],
    segments: ["positional", "investor"],
    complexity: "intermediate",
    hasBehavioralTip: true,
  },
  {
    id: "footprint-analysis",
    label: "Footprint Analysis",
    category: "technical",
    kind: "card",
    endpoint: "/api/analytics/footprint-analysis",
    componentPath: "technical/footprint-analysis",
    description: "Order flow analysis showing bid/ask volume at each price level per 15-min candle. Detects imbalances, stacked imbalances, absorption, and cumulative delta for institutional activity patterns.",
    tags: [
      "footprint", "order flow", "delta", "cumulative delta",
      "bid ask", "imbalance", "stacked imbalance", "absorption",
      "institutional", "smart money", "buy sell pressure"
    ],
    dataSources: ["OHLCV", "VolumeByPrice"],
    segments: ["intraday", "swing"],
    complexity: "advanced",
    hasEdgeMetric: true,
  },
];

// Helper functions
export function getCardById(id: string): CardDescriptor | undefined {
  return cardRegistry.find((c) => c.id === id);
}

export function getCardsByCategory(category: CardCategory): CardDescriptor[] {
  return cardRegistry.filter((c) => c.category === category);
}

export function getDefaultCards(): CardDescriptor[] {
  return cardRegistry.filter((c) => c.default);
}

export function searchCards(query: string): CardDescriptor[] {
  const q = query.toLowerCase();
  return cardRegistry.filter(
    (c) =>
      c.label.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
  );
}

// NEW: Filter by user segment
export function getCardsBySegment(segment: UserSegment): CardDescriptor[] {
  return cardRegistry.filter((c) => c.segments?.includes(segment));
}

// NEW: Filter by complexity
export function getCardsByComplexity(complexity: ComplexityLevel): CardDescriptor[] {
  return cardRegistry.filter((c) => c.complexity === complexity);
}

// NEW: Get cards with edge metrics
export function getCardsWithEdgeMetrics(): CardDescriptor[] {
  return cardRegistry.filter((c) => c.hasEdgeMetric);
}

// NEW: Get cards with risk sizing
export function getCardsWithRiskSizing(): CardDescriptor[] {
  return cardRegistry.filter((c) => c.hasRiskSizing);
}

// NEW: Get cards with behavioral tips
export function getCardsWithBehavioralTips(): CardDescriptor[] {
  return cardRegistry.filter((c) => c.hasBehavioralTip);
}

// NEW: Get recommended cards for a trading style
export function getRecommendedCards(segment: UserSegment, complexity?: ComplexityLevel): CardDescriptor[] {
  return cardRegistry.filter((c) => {
    const segmentMatch = !c.segments || c.segments.includes(segment);
    const complexityMatch = !complexity || !c.complexity || c.complexity === complexity;
    return segmentMatch && complexityMatch;
  });
}

export const CATEGORIES: { id: CardCategory; label: string; color: string }[] = [
  { id: "overview", label: "Overview", color: "#6366f1" },
  { id: "value", label: "Value", color: "#3b82f6" },
  { id: "growth", label: "Growth", color: "#10b981" },
  { id: "risk", label: "Risk", color: "#ef4444" },
  { id: "derivatives", label: "Derivatives", color: "#f97316" },
  { id: "cashflow", label: "Cash Flow", color: "#06b6d4" },
  { id: "income", label: "Income", color: "#8b5cf6" },
  { id: "macro", label: "Macro", color: "#f59e0b" },
  { id: "technical", label: "Technical", color: "#ec4899" },
  { id: "portfolio", label: "Portfolio", color: "#84cc16" },
  { id: "mutual-funds", label: "Mutual Funds", color: "#14b8a6" },
  { id: "commodities", label: "Commodities", color: "#ca8a04" },
  { id: "mini", label: "Minis", color: "#94a3b8" },
];

export default cardRegistry;
