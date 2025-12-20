// ═══════════════════════════════════════════════════════════════════════════
// INTERMEDIATE CURRICULUM - Modules 16-33
// Full LearningModule structure
// ═══════════════════════════════════════════════════════════════════════════

import { LearningModule } from './modules';
import { CurriculumFlashcard } from './curriculum-beginner';

export const CURRICULUM_INTERMEDIATE: LearningModule[] = [
  {
    id: 'cur-16-pe-pb-ratios', title: '16. Valuation Fundamentals: P/E & P/B Ratios',
    description: 'Master the most important valuation ratios for stock analysis.',
    category: 'analysis', difficulty: 'intermediate', durationMinutes: 15,
    rating: 4.8, totalRatings: 1850, icon: 'Calculator',
    concepts: ['pe-ratio', 'pb-ratio', 'valuation'], tools: ['valuation-summary', 'peer-comparison'],
    sections: [
      { title: 'Understanding Valuation Ratios', content: `Valuation ratios compare a company's market price with its financial fundamentals.\n\n**P/E (Price to Earnings) = Share Price ÷ EPS**\n- Shows how much you pay for ₹1 of profit\n- High P/E = high growth expectations OR overvaluation\n- Low P/E = undervaluation OR poor prospects\n\n**P/B (Price to Book) = Share Price ÷ Book Value per Share**\n- Compares market value to accounting value\n- Useful for banks and asset-heavy businesses` },
      { title: 'India Example', content: `**TCS vs PSU IT:** TCS trades at higher P/E (25-30x) due to stable earnings. PSU IT trades at lower P/E (8-15x) due to growth concerns.\n\n**Banking:** HDFC Bank P/B ~3-4x (premium). PSU Banks P/B ~0.8-1.5x (discount for NPAs).` }
    ],
    quiz: { questions: [
      { question: 'P/E ratio compares price with?', options: ['Revenue', 'Book value', 'Earnings', 'Cash flow'], correctIndex: 2, explanation: 'P/E = Price / Earnings (EPS).' },
      { question: 'P/B ratio is most useful for?', options: ['IT companies', 'FMCG', 'Banks & NBFCs', 'Startups'], correctIndex: 2, explanation: 'P/B is useful for asset-heavy companies like banks.' },
      { question: 'Low P/E always means cheap stock?', options: ['Yes', 'No', 'Guaranteed return', 'Risk-free'], correctIndex: 1, explanation: 'Low P/E could indicate problems (value trap).' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-17-balance-sheet', title: '17. Balance Sheet 101',
    description: 'Learn to read and interpret a company balance sheet.',
    category: 'analysis', difficulty: 'intermediate', durationMinutes: 15,
    rating: 4.7, totalRatings: 1650, icon: 'FileSpreadsheet',
    concepts: ['balance-sheet', 'assets', 'liabilities', 'equity'], tools: ['financial-health-dna', 'working-capital-health'],
    sections: [
      { title: 'Balance Sheet Fundamentals', content: `**Assets = Liabilities + Equity**\n\n**Assets:** What company owns (cash, receivables, property)\n**Liabilities:** What company owes (payables, debt)\n**Equity:** Owners' capital\n\n**Working Capital = Current Assets − Current Liabilities**` },
      { title: 'India Example', content: `**HDFC Bank:** Assets = loans, Liabilities = deposits, Equity = capital + reserves.\n\n**Red Flag:** Rising receivables faster than sales.` }
    ],
    quiz: { questions: [
      { question: 'Balance sheet shows?', options: ['Profitability', 'Financial position', 'Cash only', 'Revenue growth'], correctIndex: 1, explanation: 'Shows financial position at a point in time.' },
      { question: 'Working capital equals?', options: ['Assets − Equity', 'Revenue − expenses', 'Current assets − current liabilities', 'Cash − debt'], correctIndex: 2, explanation: 'Working Capital = CA - CL.' },
      { question: 'Deposits in banks are?', options: ['Assets', 'Equity', 'Liabilities', 'Income'], correctIndex: 2, explanation: 'Deposits are money owed to depositors.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-18-income-statement', title: '18. Income Statement Mastery',
    description: 'Understand P&L statements and profitability metrics.',
    category: 'analysis', difficulty: 'intermediate', durationMinutes: 15,
    rating: 4.8, totalRatings: 1750, icon: 'TrendingUp',
    concepts: ['income-statement', 'margins', 'profitability'], tools: ['efficiency-dashboard', 'sales-profit-cash'],
    sections: [
      { title: 'Income Statement Flow', content: `Revenue → Gross Profit → Operating Profit (EBIT) → Net Profit\n\n**Key Margins:**\n- Gross Margin = Gross Profit / Revenue\n- Operating Margin = EBIT / Revenue\n- Net Margin = Net Profit / Revenue` },
      { title: 'India Example', content: `IT companies: 20-25% operating margins (low asset needs). Manufacturing: 10-15% (raw material costs).` }
    ],
    quiz: { questions: [
      { question: 'Net profit comes after?', options: ['Revenue', 'Operating profit', 'Taxes & interest', 'Depreciation only'], correctIndex: 2, explanation: 'Net profit is after all expenses including taxes.' },
      { question: 'Operating margin measures?', options: ['Pricing power & cost control', 'Cash balance', 'Debt level', 'Asset quality'], correctIndex: 0, explanation: 'Shows efficiency in converting revenue to profit.' },
      { question: 'Revenue growth but falling profits indicates?', options: ['Efficiency', 'Rising costs', 'Strong cash flow', 'Low competition'], correctIndex: 1, explanation: 'Costs rising faster than revenue.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-19-cash-flow', title: '19. Cash Flow: The Real Profit Story',
    description: 'Why cash flow matters more than reported profits.',
    category: 'analysis', difficulty: 'intermediate', durationMinutes: 15,
    rating: 4.9, totalRatings: 1900, icon: 'Banknote',
    concepts: ['cash-flow', 'ocf', 'fcf'], tools: ['fcf-health', 'cash-conversion-earnings', 'profit-vs-cash-divergence'],
    sections: [
      { title: 'Understanding Cash Flow', content: `**Three Types:**\n1. Operating Cash Flow (OCF): Cash from core business\n2. Investing Cash Flow: Capex, acquisitions\n3. Financing Cash Flow: Debt, equity, dividends\n\n**Why Cash ≠ Profit:** Accrual accounting, depreciation, inventory.` },
      { title: 'India Example', content: `Real estate: Shows profit but negative OCF (unsold inventory). IT: Strong OCF (quick cash conversion).` }
    ],
    quiz: { questions: [
      { question: 'Most important cash flow?', options: ['Investing', 'Financing', 'Operating', 'Dividend'], correctIndex: 2, explanation: 'OCF shows if core business generates cash.' },
      { question: 'Profit ≠ cash because of?', options: ['Accrual accounting', 'Taxes only', 'Dividends', 'Equity dilution'], correctIndex: 0, explanation: 'Accrual records when earned, not when cash received.' },
      { question: 'Negative OCF repeatedly signals?', options: ['Growth', 'Red flag', 'Stability', 'High dividends'], correctIndex: 1, explanation: 'Business not generating real cash.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-20-eps-growth', title: '20. EPS & Earnings Growth',
    description: 'Master earnings per share and growth metrics.',
    category: 'analysis', difficulty: 'intermediate', durationMinutes: 12,
    rating: 4.7, totalRatings: 1600, icon: 'BarChart2',
    concepts: ['eps', 'diluted-eps', 'peg-ratio'], tools: ['earnings-stability', 'earnings-quality'],
    sections: [
      { title: 'Understanding EPS', content: `**EPS = Net Profit ÷ Outstanding Shares**\n\n**Diluted EPS:** Accounts for potential shares (options, convertibles)\n\n**PEG = P/E ÷ Growth Rate**\n- PEG < 1: Undervalued\n- PEG > 2: Overvalued` },
      { title: 'India Example', content: `Asian Paints: Consistent 15-20% EPS growth justifies premium P/E. Tata Steel: Cyclical EPS, use EV/EBITDA instead.` }
    ],
    quiz: { questions: [
      { question: 'EPS measures?', options: ['Total profit', 'Profit per share', 'Revenue per share', 'Cash per share'], correctIndex: 1, explanation: 'Earnings per share.' },
      { question: 'Diluted EPS is usually?', options: ['Higher', 'Same', 'Lower or equal', 'Zero'], correctIndex: 2, explanation: 'Assumes conversion of all convertibles.' },
      { question: 'PEG ratio compares?', options: ['Price to growth-adjusted earnings', 'Debt to equity', 'Cash to revenue', 'Assets to profits'], correctIndex: 0, explanation: 'P/E adjusted for growth rate.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-21-debt-leverage', title: '21. Debt & Leverage',
    description: 'How debt affects companies and investments.',
    category: 'analysis', difficulty: 'intermediate', durationMinutes: 12,
    rating: 4.8, totalRatings: 1700, icon: 'Scale',
    concepts: ['debt-equity', 'interest-coverage', 'leverage'], tools: ['leverage-history', 'financial-stress-radar'],
    sections: [
      { title: 'Understanding Leverage', content: `**Debt-to-Equity = Total Debt / Equity**\n- < 1: Conservative\n- > 2: Aggressive\n\n**Interest Coverage = EBIT / Interest**\n- > 3: Comfortable\n- < 1: Danger!` },
      { title: 'India Example', content: `IL&FS Crisis: D/E > 10x, refinancing failed → collapse. High debt dangerous during recession.` }
    ],
    quiz: { questions: [
      { question: 'Interest coverage below 1 means?', options: ['Safe', 'Cannot pay interest from earnings', 'Profitable', 'Cash-rich'], correctIndex: 1, explanation: 'Can\'t pay interest from operating earnings.' },
      { question: 'High debt is dangerous during?', options: ['Expansion', 'Boom', 'Recession', 'Low interest rates'], correctIndex: 2, explanation: 'Revenue falls but debt payments remain.' },
      { question: 'Debt-to-equity shows?', options: ['Liquidity', 'Leverage level', 'Profitability', 'Growth'], correctIndex: 1, explanation: 'How much debt vs equity.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-22-roe', title: '22. Return on Equity (ROE)',
    description: 'Most important profitability metric for shareholders.',
    category: 'analysis', difficulty: 'intermediate', durationMinutes: 12,
    rating: 4.9, totalRatings: 1850, icon: 'Percent',
    concepts: ['roe', 'dupont-analysis', 'profitability'], tools: ['dupont-analysis', 'management-quality'],
    sections: [
      { title: 'Understanding ROE', content: `**ROE = Net Profit / Equity**\n\n**DuPont:** ROE = Margin × Turnover × Leverage\n\n**Good ROE:** > 15%\n**Great ROE:** > 20%\n\n**Warning:** High ROE from leverage is risky.` },
      { title: 'India Example', content: `HDFC Bank ROE: 16-18%. PSU Banks: 8-12%. Difference: Asset quality, margins, efficiency.` }
    ],
    quiz: { questions: [
      { question: 'ROE measures?', options: ['Revenue growth', 'Shareholder return efficiency', 'Debt repayment', 'Cash flow'], correctIndex: 1, explanation: 'Profit generated from shareholder equity.' },
      { question: 'High ROE can be misleading due to?', options: ['Cash reserves', 'High leverage', 'Low taxes', 'High sales'], correctIndex: 1, explanation: 'Leverage inflates ROE but adds risk.' },
      { question: 'DuPont helps identify?', options: ['Valuation', 'Risk', 'ROE drivers', 'Dividends'], correctIndex: 2, explanation: 'Breaks ROE into components.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-23-growth-vs-value', title: '23. Growth vs Value Investing',
    description: 'Two fundamental approaches to stock selection.',
    category: 'strategies', difficulty: 'intermediate', durationMinutes: 12,
    rating: 4.8, totalRatings: 1950, icon: 'GitBranch',
    concepts: ['growth-investing', 'value-investing'], tools: ['multi-factor-scorecard'],
    sections: [
      { title: 'Investment Philosophies', content: `**Growth:** High earnings growth, high P/E, reinvesting companies.\n**Value:** Low valuation, mature businesses, stable cash flows.\n\nBoth outperform in different cycles.` },
      { title: 'India Example', content: `Growth: IT sector (TCS, Infosys). Value: PSU banks during turnaround. Blend depending on market cycle.` }
    ],
    quiz: { questions: [
      { question: 'Growth stocks usually have?', options: ['Low P/E', 'High dividends', 'High P/E', 'Low volatility'], correctIndex: 2, explanation: 'Premium for expected growth.' },
      { question: 'Value investing focuses on?', options: ['Future stories', 'Cheap valuation', 'Momentum', 'IPOs'], correctIndex: 1, explanation: 'Buying below intrinsic value.' },
      { question: 'Best approach?', options: ['Only growth', 'Only value', 'Blend depending on cycle', 'Random picks'], correctIndex: 2, explanation: 'Adapt to market conditions.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-24-technical-foundations', title: '24. Technical Analysis Foundations',
    description: 'Introduction to price and volume analysis.',
    category: 'analysis', difficulty: 'intermediate', durationMinutes: 15,
    rating: 4.8, totalRatings: 2100, icon: 'LineChart',
    concepts: ['technical-analysis', 'support-resistance', 'trends'], tools: ['price-structure', 'trend-strength'],
    sections: [
      { title: 'Technical Basics', content: `**Trends:** Uptrend (higher highs/lows), Downtrend (lower highs/lows), Sideways.\n\n**Support:** Buying zone (price bounces).\n**Resistance:** Selling zone (price reverses).` },
      { title: 'India Example', content: `Nifty 18,000 = strong support. Breakout with volume = real move. False breakout = traps traders.` }
    ],
    quiz: { questions: [
      { question: 'Support means?', options: ['Selling pressure', 'Buying interest zone', 'Resistance', 'Stop loss'], correctIndex: 1, explanation: 'Where buying prevents decline.' },
      { question: 'Breakout occurs when?', options: ['Price falls', 'Volume decreases', 'Price crosses resistance with volume', 'Market closes'], correctIndex: 2, explanation: 'Price moves through level with confirmation.' },
      { question: 'Trends exist because of?', options: ['Randomness', 'Human behavior', 'SEBI rules', 'Algorithms only'], correctIndex: 1, explanation: 'Fear, greed, herd mentality.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-25-moving-averages', title: '25. Moving Averages & Crossovers',
    description: 'Using moving averages to identify trends.',
    category: 'analysis', difficulty: 'intermediate', durationMinutes: 12,
    rating: 4.7, totalRatings: 1800, icon: 'Activity',
    concepts: ['sma', 'ema', 'moving-average-crossover'], tools: ['technical-indicators', 'trend-strength'],
    sections: [
      { title: 'MA Types', content: `**SMA:** Simple average, slower.\n**EMA:** More weight to recent, faster.\n\n**Golden Cross:** 50 MA above 200 MA = bullish.\n**Death Cross:** 50 MA below 200 MA = bearish.` },
      { title: 'India Example', content: `Nifty Golden Cross April 2020: Signaled end of COVID crash, massive rally followed.` }
    ],
    quiz: { questions: [
      { question: 'EMA reacts faster than SMA because?', options: ['Less data', 'More recent weight', 'Fixed formula', 'Higher volume'], correctIndex: 1, explanation: 'EMA weights recent prices more.' },
      { question: 'Golden cross is?', options: ['Bearish', 'Neutral', 'Bullish', 'Reversal down'], correctIndex: 2, explanation: '50 MA crossing above 200 MA.' },
      { question: 'Moving averages are?', options: ['Leading', 'Lagging indicators', 'Random', 'Oscillators'], correctIndex: 1, explanation: 'Confirm trends, don\'t predict.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-26-momentum-indicators', title: '26. Momentum Indicators',
    description: 'RSI, MACD, and momentum tools.',
    category: 'analysis', difficulty: 'intermediate', durationMinutes: 15,
    rating: 4.8, totalRatings: 1950, icon: 'Gauge',
    concepts: ['rsi', 'macd', 'stochastic'], tools: ['technical-indicators', 'momentum-heatmap'],
    sections: [
      { title: 'Momentum Indicators', content: `**RSI:** 0-100. >70 overbought, <30 oversold.\n**MACD:** 12 EMA - 26 EMA. Crossovers signal momentum change.\n**Stochastic:** Price vs range, faster than RSI.` },
      { title: 'Usage', content: `Oscillators work best in sideways markets. In strong trends, stay overbought/oversold.` }
    ],
    quiz: { questions: [
      { question: 'RSI overbought level?', options: ['30', '50', '70', '100'], correctIndex: 2, explanation: 'Above 70 = overbought.' },
      { question: 'MACD crossover indicates?', options: ['Volume', 'Momentum change', 'Valuation', 'Support'], correctIndex: 1, explanation: 'Signals momentum shift.' },
      { question: 'Oscillators work best in?', options: ['Strong trends', 'Sideways markets', 'IPOs', 'Low volume'], correctIndex: 1, explanation: 'Overbought/oversold meaningful in ranges.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-27-volume-analysis', title: '27. Volume & Price Relationships',
    description: 'How volume confirms price movements.',
    category: 'analysis', difficulty: 'intermediate', durationMinutes: 12,
    rating: 4.8, totalRatings: 1700, icon: 'BarChart3',
    concepts: ['volume-analysis', 'accumulation', 'distribution'], tools: ['delivery-analysis', 'volume-profile'],
    sections: [
      { title: 'Volume Principles', content: `**Strong:** Rising price + rising volume. Falling price + rising volume.\n**Weak:** Rising price + falling volume.\n\n**Accumulation:** Smart money buying quietly.\n**Distribution:** Smart money selling quietly.` },
      { title: 'India Example', content: `Adani breakouts: Massive volume = strong conviction. High delivery % = real buying.` }
    ],
    quiz: { questions: [
      { question: 'Volume confirms?', options: ['News', 'Sentiment', 'Price movement', 'Valuation'], correctIndex: 2, explanation: 'Validates price moves.' },
      { question: 'High volume breakout means?', options: ['Fake move', 'Strong conviction', 'Low interest', 'Manipulation'], correctIndex: 1, explanation: 'Increases continuation probability.' },
      { question: 'Accumulation means?', options: ['Selling', 'Buying quietly', 'Panic', 'Distribution'], correctIndex: 1, explanation: 'Smart money buying before move.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-28-candlestick-patterns', title: '28. Candlestick Patterns',
    description: 'Reading market psychology through candlesticks.',
    category: 'analysis', difficulty: 'intermediate', durationMinutes: 15,
    rating: 4.8, totalRatings: 2050, icon: 'CandlestickChart',
    concepts: ['candlestick-patterns', 'reversal-patterns'], tools: ['candlestick-hero', 'pattern-matcher'],
    sections: [
      { title: 'Key Patterns', content: `**Hammer:** Long lower wick after downtrend = reversal.\n**Engulfing:** Current covers previous = trend change.\n**Doji:** Open = Close = indecision.` },
      { title: 'Usage', content: `Patterns need context (support/resistance) + confirmation (next candle) + volume.` }
    ],
    quiz: { questions: [
      { question: 'Doji indicates?', options: ['Strong trend', 'Indecision', 'Panic', 'Breakout'], correctIndex: 1, explanation: 'Neither buyers nor sellers in control.' },
      { question: 'Hammer forms after?', options: ['Uptrend', 'Downtrend', 'Sideways', 'Gap'], correctIndex: 1, explanation: 'Bullish reversal after decline.' },
      { question: 'Candlesticks alone are?', options: ['Enough', 'Weak without context', 'Perfect', 'Random'], correctIndex: 1, explanation: 'Need S/R, confirmation, volume.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-29-sector-analysis', title: '29. Sector & Industry Analysis',
    description: 'Understanding sector cycles and rotation.',
    category: 'analysis', difficulty: 'intermediate', durationMinutes: 12,
    rating: 4.7, totalRatings: 1600, icon: 'Building2',
    concepts: ['sector-rotation', 'cyclical-stocks', 'defensive-stocks'], tools: ['sector-rotation-tracker'],
    sections: [
      { title: 'Sector Types', content: `**Cyclical:** Auto, Metals, Banks - perform in expansion.\n**Defensive:** FMCG, Pharma - stable in slowdowns.\n**Growth:** IT - global factors, decouple from domestic.` },
      { title: 'India', content: `IT benefits from weak rupee. Banking benefits from rate cuts. FMCG defensive in crisis.` }
    ],
    quiz: { questions: [
      { question: 'Defensive sector example?', options: ['Auto', 'Metals', 'FMCG', 'Realty'], correctIndex: 2, explanation: 'Essential goods, stable demand.' },
      { question: 'Sector rotation driven by?', options: ['Charts only', 'Economic cycle', 'Luck', 'SEBI'], correctIndex: 1, explanation: 'Different sectors lead at different stages.' },
      { question: 'Cyclical stocks perform best during?', options: ['Recession', 'Expansion', 'Crisis', 'Panic'], correctIndex: 1, explanation: 'Demand rises in economic growth.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-30-diversification', title: '30. Portfolio Diversification',
    description: 'Building a well-diversified portfolio.',
    category: 'strategies', difficulty: 'intermediate', durationMinutes: 12,
    rating: 4.8, totalRatings: 1850, icon: 'PieChart',
    concepts: ['diversification', 'correlation', 'asset-allocation'], tools: ['portfolio-correlation', 'rebalance-optimizer'],
    sections: [
      { title: 'Principles', content: `**Correlation:** +1 = move together, -1 = opposite, 0 = unrelated.\n\nDiversification reduces company-specific risk, NOT market risk. 15-25 stocks usually enough.` },
      { title: 'India Example', content: `60% Equity + 20% Debt + 10% Gold + 10% International. Equity + Gold correlation = -0.3 (reduces volatility).` }
    ],
    quiz: { questions: [
      { question: 'Perfect diversification correlation?', options: ['+1', '0', '−1', '+0.5'], correctIndex: 2, explanation: 'Moving opposite provides best diversification.' },
      { question: 'Diversification reduces?', options: ['Systematic risk', 'Company-specific risk', 'Inflation', 'Taxes'], correctIndex: 1, explanation: 'Unsystematic risk, not market risk.' },
      { question: 'Over-diversification causes?', options: ['Risk', 'Index-like returns', 'High volatility', 'Bankruptcy'], correctIndex: 1, explanation: 'Dilutes returns to index level.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-31-options-101', title: '31. Options 101',
    description: 'Introduction to options trading.',
    category: 'strategies', difficulty: 'intermediate', durationMinutes: 15,
    rating: 4.7, totalRatings: 2200, icon: 'Target',
    concepts: ['call-options', 'put-options', 'options-basics'], tools: ['options-interest', 'options-strategy'],
    sections: [
      { title: 'Options Basics', content: `**Call:** Right to BUY at strike. Profits when price rises.\n**Put:** Right to SELL at strike. Profits when price falls.\n\n**Max Loss for Buyer = Premium Paid**` },
      { title: 'India Market', content: `Traded on NSE F&O. Nifty/Bank Nifty index options. Use puts to hedge portfolio.` }
    ],
    quiz: { questions: [
      { question: 'Call option benefits when price?', options: ['Falls', 'Rises', 'Stays same', 'Volatile'], correctIndex: 1, explanation: 'Call buyer profits from price increase.' },
      { question: 'Option buyer\'s maximum loss?', options: ['Unlimited', 'Margin', 'Premium paid', 'Strike price'], correctIndex: 2, explanation: 'Can only lose premium paid.' },
      { question: 'Options are traded in India on?', options: ['BSE only', 'NSE F&O', 'RBI', 'Banks'], correctIndex: 1, explanation: 'NSE Futures & Options segment.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-32-position-sizing', title: '32. Position Sizing',
    description: 'Most important risk management skill.',
    category: 'strategies', difficulty: 'intermediate', durationMinutes: 10,
    rating: 4.9, totalRatings: 1750, icon: 'Scale',
    concepts: ['position-sizing', 'risk-management', 'stop-loss'], tools: ['trade-expectancy', 'fno-risk-advisor'],
    sections: [
      { title: 'Position Sizing Rules', content: `**1-2% Rule:** Risk only 1-2% of capital per trade.\n\n**Formula:** Position Size = (Capital × Risk%) / (Entry - Stop Loss)\n\n10 losses at 1% = 10% drawdown (recoverable). 10 losses at 10% = 65% drawdown (devastating).` },
      { title: 'India Example', content: `₹5 lakh capital, 1% risk = ₹5,000 max loss per trade. Stop loss determines position size.` }
    ],
    quiz: { questions: [
      { question: 'Position sizing controls?', options: ['Returns', 'Risk', 'Timing', 'Brokerage'], correctIndex: 1, explanation: 'Controls how much you can lose.' },
      { question: '1% rule means?', options: ['Invest 1%', 'Risk 1% capital per trade', 'Earn 1%', 'Brokerage'], correctIndex: 1, explanation: 'Max 1% of capital at risk per trade.' },
      { question: 'Stop loss helps determine?', options: ['Entry', 'Exit', 'Position size', 'Valuation'], correctIndex: 2, explanation: 'Stop distance determines how many shares.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-33-mutual-fund-types', title: '33. Mutual Fund Types',
    description: 'Understanding MF categories in India.',
    category: 'concepts', difficulty: 'intermediate', durationMinutes: 12,
    rating: 4.7, totalRatings: 1650, icon: 'Layers',
    concepts: ['mutual-funds', 'fund-categories', 'expense-ratio'], tools: ['mf-explorer', 'mf-analyzer'],
    sections: [
      { title: 'MF Categories', content: `**Equity:** Large/Mid/Small Cap, Sectoral.\n**Debt:** Liquid, Short Duration, Gilt.\n**Hybrid:** Balanced, Aggressive, Conservative.\n\n**Direct vs Regular:** Direct saves ~1% expense annually.` },
      { title: 'India Example', content: `Axis Bluechip: Regular 1.7%, Direct 0.5%. Over 20 years, 1.2% compounds to massive difference.` }
    ],
    quiz: { questions: [
      { question: 'Direct plan advantage?', options: ['Higher risk', 'Lower expense ratio', 'Guaranteed returns', 'Tax free'], correctIndex: 1, explanation: 'No distributor commission.' },
      { question: 'Sectoral funds are?', options: ['Diversified', 'Concentrated & risky', 'Debt funds', 'Guaranteed'], correctIndex: 1, explanation: 'Single sector = high concentration risk.' },
      { question: 'Debt funds invest mainly in?', options: ['Stocks', 'Bonds & money market instruments', 'Gold', 'Real estate'], correctIndex: 1, explanation: 'Fixed income securities.' }
    ], passingScore: 67 }
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// INTERMEDIATE FLASHCARDS - 25 cards
// ═══════════════════════════════════════════════════════════════════════════

export const INTERMEDIATE_FLASHCARDS: CurriculumFlashcard[] = [
  { id: 'if-01', front: 'P/E ratio formula', back: 'Price ÷ EPS' },
  { id: 'if-02', front: 'P/B useful for', back: 'Banks, NBFCs, asset-heavy companies' },
  { id: 'if-03', front: 'Balance sheet equation', back: 'Assets = Liabilities + Equity' },
  { id: 'if-04', front: 'Working capital', back: 'Current Assets − Current Liabilities' },
  { id: 'if-05', front: 'Operating margin shows', back: 'Core business efficiency' },
  { id: 'if-06', front: 'Cash flow hardest to manipulate', back: 'Operating cash flow' },
  { id: 'if-07', front: 'EPS means', back: 'Earnings (profit) per share' },
  { id: 'if-08', front: 'Diluted EPS accounts for', back: 'Potential future shares (options, convertibles)' },
  { id: 'if-09', front: 'Debt-to-equity measures', back: 'Leverage level' },
  { id: 'if-10', front: 'Interest coverage <1', back: 'Red flag - cannot pay interest from earnings' },
  { id: 'if-11', front: 'ROE measures', back: 'Shareholder return efficiency' },
  { id: 'if-12', front: 'DuPont breaks ROE into', back: 'Margin × Turnover × Leverage' },
  { id: 'if-13', front: 'Growth stocks', back: 'High P/E, high growth expectations' },
  { id: 'if-14', front: 'Value stocks', back: 'Low valuation, mature businesses' },
  { id: 'if-15', front: 'Support zone', back: 'Buying interest area' },
  { id: 'if-16', front: 'Resistance zone', back: 'Selling pressure area' },
  { id: 'if-17', front: 'EMA vs SMA', back: 'EMA reacts faster (more weight to recent)' },
  { id: 'if-18', front: 'RSI overbought', back: 'Above 70' },
  { id: 'if-19', front: 'Volume confirms', back: 'Price movement validity' },
  { id: 'if-20', front: 'Hammer candle', back: 'Potential bullish reversal after downtrend' },
  { id: 'if-21', front: 'Defensive sector', back: 'FMCG, Pharma - stable in slowdowns' },
  { id: 'if-22', front: 'Correlation −1 means', back: 'Move in opposite directions' },
  { id: 'if-23', front: 'Call option', back: 'Right to buy at strike price' },
  { id: 'if-24', front: 'Put option', back: 'Right to sell at strike price' },
  { id: 'if-25', front: 'Position sizing controls', back: 'Risk per trade, not returns' }
];
