export type ToolKind = 'card' | 'mini';

export interface ToolDescriptor {
  id: string;
  label: string;
  kind: ToolKind;
  endpoint: string;
  componentId: string;
  description: string;
  default?: boolean;
}

export const toolsRegistry: ToolDescriptor[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // OVERVIEW (1)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'stock-snapshot',
    label: 'Stock Snapshot',
    kind: 'card',
    endpoint: '/api/analytics/stock-snapshot',
    componentId: 'StockSnapshotCard',
    description: 'Primary entry point showing company info, price, day stats, key levels, and mini chart.',
    default: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VALUE (7)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'fair-value-forecaster',
    label: 'Fair Value Forecaster',
    kind: 'card',
    endpoint: '/api/analytics/fair-value-forecaster',
    componentId: 'FairValueForecaster',
    description: 'Projects future fair value using DCF with probability fan charts and sensitivity analysis.',
    default: true,
  },
  {
    id: 'valuation-summary',
    label: 'Valuation Summary',
    kind: 'card',
    endpoint: '/api/analytics/valuation-summary',
    componentId: 'ValuationSummaryCard',
    description: 'Comprehensive multi-metric valuation dashboard with radar visualization and peer comparisons.',
  },
  {
    id: 'dcf-valuation',
    label: 'DCF Valuation',
    kind: 'card',
    endpoint: '/api/analytics/dcf-valuation',
    componentId: 'DCFValuationCard',
    description: 'Full discounted cash flow model with projections and WACC/growth sensitivity matrix.',
  },
  {
    id: 'intrinsic-value-range',
    label: 'Intrinsic Value Range',
    kind: 'card',
    endpoint: '/api/analytics/intrinsic-value-range',
    componentId: 'IntrinsicValueRangeCard',
    description: 'Multi-model intrinsic value range with composite fair value calculation.',
  },
  {
    id: 'piotroski-score',
    label: 'Piotroski F-Score',
    kind: 'card',
    endpoint: '/api/analytics/piotroski-score',
    componentId: 'PiotroskiScoreCard',
    description: '9-point financial strength score across profitability, leverage, and efficiency.',
  },
  {
    id: 'dupont-analysis',
    label: 'DuPont Analysis',
    kind: 'card',
    endpoint: '/api/analytics/dupont-analysis',
    componentId: 'DupontAnalysisCard',
    description: 'ROE decomposition into profit margin, asset turnover, and leverage.',
  },
  {
    id: 'multi-factor-scorecard',
    label: 'Multi-Factor Scorecard',
    kind: 'card',
    endpoint: '/api/analytics/multi-factor-scorecard',
    componentId: 'MultiFactorScorecardCard',
    description: 'Factor-based quality scoring with radar visualization and rankings.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROWTH (8)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'growth-summary',
    label: 'Growth Summary',
    kind: 'card',
    endpoint: '/api/analytics/growth-summary',
    componentId: 'GrowthSummaryCard',
    description: 'Historical and forward growth metrics with tier classification.',
    default: true,
  },
  {
    id: 'efficiency-dashboard',
    label: 'Efficiency Dashboard',
    kind: 'card',
    endpoint: '/api/analytics/efficiency-dashboard',
    componentId: 'EfficiencyDashboardCard',
    description: 'Operating efficiency metrics including margins and asset utilization.',
  },
  {
    id: 'earnings-stability',
    label: 'Earnings Stability',
    kind: 'card',
    endpoint: '/api/analytics/earnings-stability',
    componentId: 'EarningsStabilityCard',
    description: 'Earnings consistency and predictability analysis.',
  },
  {
    id: 'earnings-quality',
    label: 'Earnings Quality',
    kind: 'card',
    endpoint: '/api/analytics/earnings-quality',
    componentId: 'EarningsQualityCard',
    description: 'Quality metrics including accruals, cash conversion, and Beneish M-Score.',
  },
  {
    id: 'management-quality',
    label: 'Management Quality',
    kind: 'card',
    endpoint: '/api/analytics/management-quality',
    componentId: 'ManagementQualityCard',
    description: 'Management effectiveness scoring with insider activity.',
  },
  {
    id: 'capital-allocation',
    label: 'Capital Allocation',
    kind: 'card',
    endpoint: '/api/analytics/capital-allocation',
    componentId: 'CapitalAllocationCard',
    description: 'Capital deployment analysis across reinvestment, buybacks, dividends, and M&A.',
  },
  {
    id: 'sales-profit-cash',
    label: 'Sales-Profit-Cash Alignment',
    kind: 'card',
    endpoint: '/api/analytics/sales-profit-cash',
    componentId: 'SalesProfitCashCard',
    description: 'Revenue to profit to cash flow conversion analysis.',
  },
  {
    id: 'profit-vs-cash-divergence',
    label: 'Profit vs Cash Divergence',
    kind: 'card',
    endpoint: '/api/analytics/profit-cash-divergence',
    componentId: 'ProfitCashDivergenceCard',
    description: 'Identifies divergences between reported profits and cash generation.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RISK (8)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'risk-health-dashboard',
    label: 'Risk Health Dashboard',
    kind: 'card',
    endpoint: '/api/analytics/risk-health-dashboard',
    componentId: 'RiskHealthDashboardCard',
    description: 'Comprehensive risk assessment across financial, operational, and market risks.',
  },
  {
    id: 'drawdown-var',
    label: 'Drawdown & VaR',
    kind: 'card',
    endpoint: '/api/analytics/drawdown-var',
    componentId: 'DrawdownVaRCard',
    description: 'Maximum drawdown tracking, VaR calculations, and stress scenarios.',
  },
  {
    id: 'financial-stress-radar',
    label: 'Financial Stress Radar',
    kind: 'card',
    endpoint: '/api/analytics/financial-stress',
    componentId: 'FinancialStressRadarCard',
    description: 'Early warning indicators for financial distress.',
  },
  {
    id: 'bankruptcy-health',
    label: 'Bankruptcy Health',
    kind: 'card',
    endpoint: '/api/analytics/bankruptcy-health',
    componentId: 'BankruptcyHealthCard',
    description: 'Altman Z-Score and bankruptcy probability analysis.',
  },
  {
    id: 'working-capital-health',
    label: 'Working Capital Health',
    kind: 'card',
    endpoint: '/api/analytics/working-capital',
    componentId: 'WorkingCapitalHealthCard',
    description: 'Working capital cycle and liquidity position monitoring.',
  },
  {
    id: 'leverage-history',
    label: 'Leverage History',
    kind: 'card',
    endpoint: '/api/analytics/leverage-history',
    componentId: 'LeverageHistoryCard',
    description: 'Historical leverage trends and debt covenant analysis.',
  },
  {
    id: 'fno-risk-advisor',
    label: 'F&O Risk Advisor',
    kind: 'card',
    endpoint: '/api/analytics/fno-risk-advisor',
    componentId: 'FnORiskAdvisorCard',
    description: 'SEBI-safe leverage calculator with position sizing, drawdown probability, and risk zone warnings.',
  },
  {
    id: 'trade-expectancy',
    label: 'Trade Expectancy Simulator',
    kind: 'card',
    endpoint: '/api/analytics/trade-expectancy',
    componentId: 'TradeExpectancyCard',
    description: 'Calculates realistic P&L expectancy including Indian fee structure (STT, GST, stamp duty).',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CASHFLOW (4)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'cashflow-stability-index',
    label: 'Cashflow Stability Index',
    kind: 'card',
    endpoint: '/api/analytics/cashflow-stability',
    componentId: 'CashflowStabilityIndexCard',
    description: 'Cash flow volatility and stability scoring.',
  },
  {
    id: 'fcf-health',
    label: 'FCF Health',
    kind: 'card',
    endpoint: '/api/analytics/fcf-health',
    componentId: 'FCFHealthCard',
    description: 'Free cash flow generation and sustainability analysis.',
  },
  {
    id: 'cash-conversion-cycle',
    label: 'Cash Conversion Cycle',
    kind: 'card',
    endpoint: '/api/analytics/cash-conversion-cycle',
    componentId: 'CashConversionCycleCard',
    description: 'Days inventory, receivables, payables, and net cash cycle.',
  },
  {
    id: 'cash-conversion-earnings',
    label: 'Cash Conversion of Earnings',
    kind: 'card',
    endpoint: '/api/analytics/cash-conversion-earnings',
    componentId: 'CashConversionEarningsCard',
    description: 'Earnings to operating cash flow conversion quality.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INCOME (3)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'dividend-crystal-ball',
    label: 'Dividend Crystal Ball',
    kind: 'card',
    endpoint: '/api/analytics/dividend-crystal-ball',
    componentId: 'DividendCrystalBall',
    description: 'Dividend growth projection with yield on cost forecasts.',
    default: true,
  },
  {
    id: 'dividend-sip-tracker',
    label: 'Dividend SIP Tracker',
    kind: 'card',
    endpoint: '/api/analytics/dividend-sip-tracker',
    componentId: 'DividendSIPTrackerCard',
    description: 'Systematic investment tracking with dividend reinvestment analysis.',
  },
  {
    id: 'income-stability',
    label: 'Income Stability',
    kind: 'card',
    endpoint: '/api/analytics/income-stability',
    componentId: 'IncomeStabilityCard',
    description: 'Dividend safety and payout sustainability scoring.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MACRO (6)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'shareholding-pattern',
    label: 'Shareholding Pattern',
    kind: 'card',
    endpoint: '/api/analytics/shareholding-pattern',
    componentId: 'ShareholdingPatternCard',
    description: 'Ownership breakdown and changes in institutional/retail holdings.',
  },
  {
    id: 'institutional-flows',
    label: 'Institutional Flows',
    kind: 'card',
    endpoint: '/api/analytics/institutional-flows',
    componentId: 'InstitutionalFlowsCard',
    description: 'FII/DII flow tracking and institutional sentiment.',
  },
  {
    id: 'insider-trades',
    label: 'Insider Trades',
    kind: 'card',
    endpoint: '/api/analytics/insider-trades',
    componentId: 'InsiderTradesCard',
    description: 'Insider buying/selling activity and patterns.',
  },
  {
    id: 'macro-calendar',
    label: 'Macro Calendar',
    kind: 'card',
    endpoint: '/api/analytics/macro-calendar',
    componentId: 'MacroCalendarCard',
    description: 'Upcoming economic events and central bank decisions.',
  },
  {
    id: 'macro-pulse',
    label: 'Macro Pulse',
    kind: 'card',
    endpoint: '/api/analytics/macro-pulse',
    componentId: 'MacroPulseCard',
    description: 'Real-time macro indicator dashboard.',
  },
  {
    id: 'narrative-theme',
    label: 'Narrative Theme Tracker',
    kind: 'card',
    endpoint: '/api/analytics/narrative-theme',
    componentId: 'NarrativeThemeCard',
    description: 'Market themes (PSU banks, Defence, Railway, etc.) with leaders, laggards, catalysts.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EARNINGS (2)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'earnings-calendar',
    label: 'Earnings Calendar',
    kind: 'card',
    endpoint: '/api/analytics/earnings-calendar',
    componentId: 'EarningsCalendarCard',
    description: 'Upcoming earnings dates and consensus estimates.',
  },
  {
    id: 'earnings-surprise',
    label: 'Earnings Surprise',
    kind: 'card',
    endpoint: '/api/analytics/earnings-surprise',
    componentId: 'EarningsSurpriseCard',
    description: 'Historical earnings beats/misses and price reactions.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TECHNICAL (16)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'candlestick-hero',
    label: 'Candlestick Hero',
    kind: 'card',
    endpoint: '/api/analytics/candlestick-hero',
    componentId: 'CandlestickHero',
    description: 'Interactive candlestick chart with overlays and indicators.',
  },
  {
    id: 'pattern-matcher',
    label: 'Pattern Matcher',
    kind: 'card',
    endpoint: '/api/analytics/pattern-matcher',
    componentId: 'PatternMatcherCard',
    description: 'Historical pattern matching with outcome statistics.',
  },
  {
    id: 'technical-indicators',
    label: 'Technical Indicators',
    kind: 'card',
    endpoint: '/api/analytics/technical-indicators',
    componentId: 'TechnicalIndicatorsCard',
    description: 'Comprehensive technical indicator dashboard.',
  },
  {
    id: 'volume-profile',
    label: 'Volume Profile',
    kind: 'card',
    endpoint: '/api/analytics/volume-profile',
    componentId: 'VolumeProfileCard',
    description: 'POC, VAH/VAL, and volume nodes for price level analysis.',
  },
  {
    id: 'vwap-analysis',
    label: 'VWAP Analysis',
    kind: 'card',
    endpoint: '/api/analytics/vwap-analysis',
    componentId: 'VWAPAnalysisCard',
    description: 'Session VWAP with bands and anchored VWAP levels.',
  },
  {
    id: 'orb-analysis',
    label: 'ORB Analysis',
    kind: 'card',
    endpoint: '/api/analytics/orb-analysis',
    componentId: 'ORBAnalysisCard',
    description: 'Opening Range Breakout analysis with gap classification.',
  },
  {
    id: 'fibonacci-levels',
    label: 'Fibonacci Levels',
    kind: 'card',
    endpoint: '/api/analytics/fibonacci-levels',
    componentId: 'FibonacciLevelsCard',
    description: 'Fibonacci retracements and extensions with golden pocket.',
  },
  {
    id: 'tax-calculator',
    label: 'Tax Calculator',
    kind: 'card',
    endpoint: '/api/analytics/tax-calculator',
    componentId: 'TaxCalculatorCard',
    description: 'LTCG/STCG calculation with tax-loss harvesting opportunities.',
  },

  // Minis
  {
    id: 'crash-warning-mini',
    label: 'Crash Warning',
    kind: 'mini',
    endpoint: '/api/minis/crash-warning',
    componentId: 'CrashWarningMini',
    description: 'Traffic light crash risk indicator using momentum, volatility, and drawdown.',
  },
];

export function getToolById(id: string): ToolDescriptor | undefined {
  return toolsRegistry.find((t) => t.id === id);
}