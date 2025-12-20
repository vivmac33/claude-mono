// ═══════════════════════════════════════════════════════════════════════════
// TRADING CONCEPTS DATABASE
// Comprehensive definitions, formulas, and examples for all trading concepts
// ═══════════════════════════════════════════════════════════════════════════

export type ConceptCategory = 
  | 'fundamentals'
  | 'technical'
  | 'derivatives'
  | 'risk'
  | 'psychology'
  | 'market_structure'
  | 'portfolio';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Formula {
  name: string;
  expression: string;        // LaTeX or plain text formula
  variables: Record<string, string>;  // Variable explanations
}

export interface Example {
  title: string;
  scenario: string;
  data?: Record<string, number | string>;
  calculation?: string;
  result: string;
  insight: string;
}

export interface Concept {
  id: string;
  name: string;
  category: ConceptCategory;
  difficulty: DifficultyLevel;
  shortDefinition: string;           // One-liner for tooltips
  fullExplanation: string;           // Detailed explanation
  formulas?: Formula[];
  examples?: Example[];
  keyPoints?: string[];
  commonMistakes?: string[];
  relatedConcepts: string[];         // IDs of related concepts
  relatedTools: string[];            // IDs of tools that use this concept
  indianContext?: string;            // India-specific notes
  visualType?: 'chart' | 'diagram' | 'table' | 'none';
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNDAMENTAL ANALYSIS CONCEPTS
// ─────────────────────────────────────────────────────────────────────────────

export const FUNDAMENTAL_CONCEPTS: Concept[] = [
  {
    id: 'pe-ratio',
    name: 'Price-to-Earnings Ratio (P/E)',
    category: 'fundamentals',
    difficulty: 'beginner',
    shortDefinition: 'How much investors pay for each rupee of earnings. Lower P/E may indicate undervaluation.',
    fullExplanation: `The Price-to-Earnings ratio is one of the most widely used valuation metrics. It tells you how much the market is willing to pay for a company's earnings. 

A P/E of 20 means investors are paying ₹20 for every ₹1 of annual earnings. This can be interpreted as "it would take 20 years of current earnings to pay back the investment" (ignoring growth).

There are two types:
- **Trailing P/E**: Uses past 12 months earnings (TTM)
- **Forward P/E**: Uses estimated future earnings

Context matters: A "high" P/E for a utility company might be 15, while a "low" P/E for a tech company might be 25.`,
    formulas: [
      {
        name: 'P/E Ratio',
        expression: 'P/E = Market Price per Share / Earnings per Share (EPS)',
        variables: {
          'Market Price': 'Current stock price',
          'EPS': 'Net Income / Total Shares Outstanding'
        }
      }
    ],
    examples: [
      {
        title: 'Comparing Two IT Companies',
        scenario: 'Infosys trades at ₹1,500 with EPS of ₹60. TCS trades at ₹3,500 with EPS of ₹120.',
        data: { 'Infosys Price': 1500, 'Infosys EPS': 60, 'TCS Price': 3500, 'TCS EPS': 120 },
        calculation: 'Infosys P/E = 1500/60 = 25x. TCS P/E = 3500/120 = 29.2x',
        result: 'Infosys has a lower P/E (25x) compared to TCS (29.2x)',
        insight: 'Infosys appears relatively cheaper, but TCS might justify higher P/E with better growth prospects. Always compare with growth rates.'
      }
    ],
    keyPoints: [
      'Compare P/E within the same industry, not across sectors',
      'High-growth companies typically have higher P/E ratios',
      'Negative earnings make P/E meaningless - use P/S ratio instead',
      'Cyclical companies may have misleadingly low P/E at peak earnings'
    ],
    commonMistakes: [
      'Comparing P/E across different sectors (IT vs Banking)',
      'Ignoring one-time gains/losses that distort EPS',
      'Not considering the growth rate (use PEG ratio instead)'
    ],
    relatedConcepts: ['eps', 'peg-ratio', 'forward-pe', 'earnings-yield'],
    relatedTools: ['valuation-summary', 'peer-comparison', 'fair-value-forecaster'],
    indianContext: 'Nifty 50 historical average P/E is around 20-22x. Above 25x is generally considered expensive, below 18x is considered cheap.',
    visualType: 'chart'
  },
  {
    id: 'eps',
    name: 'Earnings Per Share (EPS)',
    category: 'fundamentals',
    difficulty: 'beginner',
    shortDefinition: 'Net profit divided by number of shares. Shows how much profit each share generates.',
    fullExplanation: `Earnings Per Share represents the portion of a company's profit allocated to each outstanding share. It's the foundation for many valuation metrics.

**Basic EPS** uses the current number of shares.
**Diluted EPS** accounts for potential shares from options, convertible bonds, etc. - always lower than basic EPS.

EPS growth is one of the key drivers of stock price appreciation. Consistent EPS growth of 15%+ annually is considered strong.`,
    formulas: [
      {
        name: 'Basic EPS',
        expression: 'EPS = (Net Income - Preferred Dividends) / Weighted Average Shares Outstanding',
        variables: {
          'Net Income': 'Total profit after all expenses and taxes',
          'Preferred Dividends': 'Dividends paid to preferred shareholders',
          'Weighted Average Shares': 'Average shares during the period'
        }
      }
    ],
    examples: [
      {
        title: 'Calculating EPS for Reliance',
        scenario: 'Reliance reports Net Income of ₹60,000 Cr with 676 Cr shares outstanding.',
        data: { 'Net Income (Cr)': 60000, 'Shares (Cr)': 676 },
        calculation: 'EPS = 60,000 / 676 = ₹88.76',
        result: 'EPS is ₹88.76 per share',
        insight: 'With stock at ₹2,400, P/E = 2400/88.76 = 27x'
      }
    ],
    keyPoints: [
      'Look for consistent EPS growth over 3-5 years',
      'Compare quarter-over-quarter (QoQ) and year-over-year (YoY) growth',
      'Diluted EPS is more conservative and realistic'
    ],
    commonMistakes: [
      'Ignoring share buybacks that artificially inflate EPS',
      'Not adjusting for stock splits',
      'Focusing on single quarter instead of trends'
    ],
    relatedConcepts: ['pe-ratio', 'net-income', 'diluted-eps'],
    relatedTools: ['growth-summary', 'earnings-quality', 'valuation-summary'],
    visualType: 'chart'
  },
  {
    id: 'roe',
    name: 'Return on Equity (ROE)',
    category: 'fundamentals',
    difficulty: 'beginner',
    shortDefinition: 'How efficiently a company uses shareholder money to generate profits. Higher is better.',
    fullExplanation: `Return on Equity measures how much profit a company generates with the money shareholders have invested. It's a key indicator of management efficiency.

An ROE of 20% means the company generates ₹20 of profit for every ₹100 of shareholder equity.

**Warning**: Very high ROE (>40%) might indicate:
- High debt (low equity denominator)
- Unsustainable profits
- Accounting manipulation

Use DuPont Analysis to break down ROE into its components.`,
    formulas: [
      {
        name: 'ROE',
        expression: 'ROE = Net Income / Shareholders Equity × 100',
        variables: {
          'Net Income': 'Annual net profit',
          'Shareholders Equity': 'Total Assets - Total Liabilities'
        }
      },
      {
        name: 'DuPont Formula',
        expression: 'ROE = Profit Margin × Asset Turnover × Financial Leverage',
        variables: {
          'Profit Margin': 'Net Income / Revenue',
          'Asset Turnover': 'Revenue / Total Assets',
          'Financial Leverage': 'Total Assets / Equity'
        }
      }
    ],
    examples: [
      {
        title: 'HDFC Bank ROE Analysis',
        scenario: 'HDFC Bank has Net Income of ₹45,000 Cr and Equity of ₹2,50,000 Cr.',
        data: { 'Net Income (Cr)': 45000, 'Equity (Cr)': 250000 },
        calculation: 'ROE = (45,000 / 2,50,000) × 100 = 18%',
        result: 'ROE is 18%',
        insight: 'For a bank, 18% ROE is excellent. Compare with peers like ICICI Bank and Kotak.'
      }
    ],
    keyPoints: [
      'ROE > 15% is generally good for Indian companies',
      'Compare ROE with industry peers, not across sectors',
      'Consistent ROE over 5 years is more valuable than one high year',
      'Use DuPont analysis to understand WHY ROE is high/low'
    ],
    commonMistakes: [
      'Ignoring high debt that inflates ROE artificially',
      'Not comparing with cost of equity',
      'Overlooking one-time items that boost ROE temporarily'
    ],
    relatedConcepts: ['roce', 'dupont-analysis', 'profit-margin', 'asset-turnover'],
    relatedTools: ['dupont-analysis', 'financial-health-dna', 'piotroski-score'],
    indianContext: 'Indian banks typically have ROE of 12-18%. IT companies often have ROE > 25% due to low capital requirements.',
    visualType: 'chart'
  },
  {
    id: 'roce',
    name: 'Return on Capital Employed (ROCE)',
    category: 'fundamentals',
    difficulty: 'intermediate',
    shortDefinition: 'Profit generated from all capital (equity + debt). Better than ROE for comparing across capital structures.',
    fullExplanation: `ROCE measures how efficiently a company uses ALL its capital - both equity and debt - to generate profits. It's particularly useful for comparing companies with different debt levels.

Unlike ROE which can be inflated by high debt, ROCE gives a cleaner picture of operational efficiency.

**Rule of thumb**: ROCE should be higher than the company's cost of capital (WACC). If ROCE > WACC, the company is creating value.`,
    formulas: [
      {
        name: 'ROCE',
        expression: 'ROCE = EBIT / Capital Employed × 100',
        variables: {
          'EBIT': 'Earnings Before Interest and Tax',
          'Capital Employed': 'Total Assets - Current Liabilities (or Equity + Long-term Debt)'
        }
      }
    ],
    examples: [
      {
        title: 'Comparing Two Manufacturing Companies',
        scenario: 'Company A uses mostly equity (low debt). Company B uses high debt.',
        data: { 'A - ROE': '15%', 'A - ROCE': '16%', 'B - ROE': '25%', 'B - ROCE': '14%' },
        calculation: 'Company B has higher ROE due to leverage, but lower ROCE shows less efficient operations',
        result: 'Company A is operationally more efficient despite lower ROE',
        insight: 'ROCE reveals the true operational efficiency hidden by leverage effects on ROE'
      }
    ],
    keyPoints: [
      'ROCE > 15% is considered good for capital-intensive businesses',
      'Compare ROCE with company\'s WACC (cost of capital)',
      'Improving ROCE over time indicates better capital allocation',
      'More reliable than ROE for companies with varying debt levels'
    ],
    relatedConcepts: ['roe', 'wacc', 'ebit', 'capital-employed'],
    relatedTools: ['dupont-analysis', 'capital-allocation', 'efficiency-dashboard'],
    indianContext: 'Asset-heavy sectors (Steel, Cement, Power) typically have ROCE of 8-15%. Asset-light sectors (IT, FMCG) can have ROCE > 30%.',
    visualType: 'chart'
  },
  {
    id: 'dcf',
    name: 'Discounted Cash Flow (DCF)',
    category: 'fundamentals',
    difficulty: 'advanced',
    shortDefinition: 'Valuation method that calculates present value of expected future cash flows.',
    fullExplanation: `DCF is the most theoretically sound valuation method. It values a company based on the cash it will generate in the future, discounted back to today's value.

The core principle: ₹100 today is worth more than ₹100 next year (time value of money).

**Key Inputs**:
1. Free Cash Flow projections (usually 5-10 years)
2. Terminal Value (value beyond projection period)
3. Discount Rate (usually WACC)

**Sensitivity**: Small changes in growth rate or discount rate can dramatically change the valuation. Always do sensitivity analysis.`,
    formulas: [
      {
        name: 'DCF Formula',
        expression: 'DCF Value = Σ [FCFt / (1+r)^t] + Terminal Value / (1+r)^n',
        variables: {
          'FCFt': 'Free Cash Flow in year t',
          'r': 'Discount rate (WACC)',
          't': 'Year number',
          'n': 'Final projection year'
        }
      },
      {
        name: 'Terminal Value (Gordon Growth)',
        expression: 'TV = FCFn × (1+g) / (r - g)',
        variables: {
          'FCFn': 'Free Cash Flow in final year',
          'g': 'Perpetual growth rate (usually 2-4%)',
          'r': 'Discount rate'
        }
      }
    ],
    examples: [
      {
        title: 'Simple DCF for TCS',
        scenario: 'TCS current FCF is ₹40,000 Cr. Expected to grow 12% for 5 years, then 4% perpetually. WACC is 10%.',
        calculation: 'Year 1-5 FCF discounted + Terminal Value discounted',
        result: 'Intrinsic value approximately ₹12,00,000 Cr market cap',
        insight: 'With current market cap of ₹13,00,000 Cr, stock might be slightly overvalued by DCF'
      }
    ],
    keyPoints: [
      'DCF is only as good as your assumptions',
      'Terminal value often accounts for 60-80% of total value',
      'Use conservative growth estimates',
      'Always run sensitivity analysis on key inputs'
    ],
    commonMistakes: [
      'Using unrealistic growth rates (>15% for large companies)',
      'Ignoring cyclicality in cash flows',
      'Using wrong discount rate',
      'Not doing sensitivity analysis'
    ],
    relatedConcepts: ['free-cash-flow', 'wacc', 'terminal-value', 'present-value'],
    relatedTools: ['dcf-valuation', 'fair-value-forecaster', 'intrinsic-value-range'],
    visualType: 'table'
  },
  {
    id: 'free-cash-flow',
    name: 'Free Cash Flow (FCF)',
    category: 'fundamentals',
    difficulty: 'intermediate',
    shortDefinition: 'Cash available after operating expenses and capital investments. The real money left for shareholders.',
    fullExplanation: `Free Cash Flow is the cash a company generates after accounting for cash outflows to support operations and maintain capital assets. It's the money truly available for dividends, buybacks, debt repayment, or growth.

**Why FCF > Net Income**:
- Net Income includes non-cash items (depreciation, amortization)
- Net Income doesn't account for capital expenditures
- FCF shows actual cash generation ability

**Negative FCF** isn't always bad - growth companies invest heavily in capex.`,
    formulas: [
      {
        name: 'Free Cash Flow',
        expression: 'FCF = Operating Cash Flow - Capital Expenditures',
        variables: {
          'Operating Cash Flow': 'Cash from operations (from cash flow statement)',
          'Capital Expenditures': 'Money spent on fixed assets (property, equipment)'
        }
      },
      {
        name: 'Alternative Formula',
        expression: 'FCF = EBIT(1-Tax) + Depreciation - ΔWorking Capital - Capex',
        variables: {
          'EBIT': 'Earnings before interest and tax',
          'ΔWorking Capital': 'Change in working capital'
        }
      }
    ],
    examples: [
      {
        title: 'Infosys FCF Calculation',
        scenario: 'Infosys has Operating CF of ₹22,000 Cr and Capex of ₹3,000 Cr.',
        data: { 'Operating CF (Cr)': 22000, 'Capex (Cr)': 3000 },
        calculation: 'FCF = 22,000 - 3,000 = ₹19,000 Cr',
        result: 'Free Cash Flow is ₹19,000 Cr',
        insight: 'High FCF allows Infosys to pay consistent dividends and do buybacks'
      }
    ],
    keyPoints: [
      'Consistent positive FCF is a sign of financial health',
      'FCF Yield (FCF/Market Cap) is useful for valuation',
      'Compare FCF with Net Income - should be similar over time',
      'Growing companies may have negative FCF due to heavy investment'
    ],
    relatedConcepts: ['operating-cash-flow', 'capex', 'dcf', 'fcf-yield'],
    relatedTools: ['sales-profit-cash', 'profit-vs-cash-divergence', 'dcf-valuation'],
    visualType: 'chart'
  },
  {
    id: 'dividend-yield',
    name: 'Dividend Yield',
    category: 'fundamentals',
    difficulty: 'beginner',
    shortDefinition: 'Annual dividend as a percentage of stock price. Shows income return on investment.',
    fullExplanation: `Dividend Yield shows how much a company pays out in dividends relative to its stock price. It's the income component of total returns.

**High Yield Warning**: Very high yields (>8%) may indicate:
- Stock price has fallen sharply (distress)
- Dividend may be cut
- One-time special dividend

**Dividend Growth** is often more important than current yield for long-term investors.`,
    formulas: [
      {
        name: 'Dividend Yield',
        expression: 'Dividend Yield = Annual Dividend per Share / Current Stock Price × 100',
        variables: {
          'Annual Dividend': 'Total dividends paid in a year',
          'Stock Price': 'Current market price'
        }
      }
    ],
    examples: [
      {
        title: 'Coal India Dividend Analysis',
        scenario: 'Coal India pays ₹24 annual dividend. Stock trades at ₹400.',
        data: { 'Dividend': 24, 'Price': 400 },
        calculation: 'Yield = (24/400) × 100 = 6%',
        result: 'Dividend yield is 6%',
        insight: 'Higher than FD rates, but check if dividend is sustainable from profits'
      }
    ],
    keyPoints: [
      'Compare yield with risk-free rate (FD/G-Sec)',
      'Check payout ratio - very high payout (>80%) may not be sustainable',
      'Dividend growth rate matters for long-term compounding',
      'Tax on dividends is as per income slab in India'
    ],
    relatedConcepts: ['payout-ratio', 'dividend-growth', 'total-return'],
    relatedTools: ['dividend-crystal-ball'],
    indianContext: 'PSU companies often have high dividend yields (4-8%). Private companies typically yield 1-3%. Dividends are taxable as income.',
    visualType: 'chart'
  },
  {
    id: 'book-value',
    name: 'Book Value & P/B Ratio',
    category: 'fundamentals',
    difficulty: 'beginner',
    shortDefinition: 'Net asset value per share. P/B below 1 means stock trades below liquidation value.',
    fullExplanation: `Book Value represents the net asset value of a company - what shareholders would theoretically receive if the company liquidated all assets and paid all debts.

**Price-to-Book (P/B) Ratio** compares market price to book value:
- P/B < 1: Trading below asset value (potential value trap or opportunity)
- P/B > 3: Market expects significant growth/intangibles

**Limitations**: Book value doesn't capture intangible assets like brand value, patents, or human capital well.`,
    formulas: [
      {
        name: 'Book Value per Share',
        expression: 'BVPS = (Total Assets - Total Liabilities) / Shares Outstanding',
        variables: {
          'Total Assets': 'All assets on balance sheet',
          'Total Liabilities': 'All debts and obligations'
        }
      },
      {
        name: 'P/B Ratio',
        expression: 'P/B = Market Price per Share / Book Value per Share',
        variables: {}
      }
    ],
    examples: [
      {
        title: 'PSU Bank P/B Analysis',
        scenario: 'SBI has Book Value of ₹350 per share. Stock trades at ₹600.',
        data: { 'Book Value': 350, 'Price': 600 },
        calculation: 'P/B = 600/350 = 1.7x',
        result: 'P/B is 1.7x',
        insight: 'For banks, P/B is crucial. Well-run private banks trade at 2-4x P/B, PSU banks at 0.8-1.5x'
      }
    ],
    keyPoints: [
      'Most useful for asset-heavy industries (Banks, Real Estate, Infrastructure)',
      'Less useful for asset-light businesses (IT, Consulting)',
      'For banks, P/B is the primary valuation metric',
      'Check if assets are fairly valued on books'
    ],
    relatedConcepts: ['pe-ratio', 'tangible-book-value', 'nav'],
    relatedTools: ['valuation-summary', 'fair-value-forecaster'],
    indianContext: 'PSU Banks often trade below book value. Private banks like HDFC Bank trade at 3-4x book value.',
    visualType: 'table'
  },
  {
    id: 'piotroski-f-score',
    name: 'Piotroski F-Score',
    category: 'fundamentals',
    difficulty: 'intermediate',
    shortDefinition: 'A 0-9 score measuring financial strength. Higher score = stronger fundamentals.',
    fullExplanation: `The Piotroski F-Score is a comprehensive scoring system that evaluates a company's financial health across 9 criteria. Each criterion scores 0 or 1 point.

**Scoring Categories**:
1. **Profitability (4 points)**: ROA, Operating CF, ROA change, Accruals
2. **Leverage/Liquidity (3 points)**: Debt ratio, Current ratio, Shares outstanding
3. **Operating Efficiency (2 points)**: Gross margin, Asset turnover

**Interpretation**:
- 8-9: Strong financial health
- 5-7: Average
- 0-4: Weak fundamentals`,
    formulas: [
      {
        name: 'Piotroski Score Components',
        expression: 'F-Score = Σ (9 binary criteria)',
        variables: {
          'ROA > 0': '+1 if positive Return on Assets',
          'OCF > 0': '+1 if positive Operating Cash Flow',
          'ΔROA > 0': '+1 if ROA improved from last year',
          'OCF > Net Income': '+1 if quality earnings',
          'ΔLeverage < 0': '+1 if debt ratio decreased',
          'ΔCurrent Ratio > 0': '+1 if liquidity improved',
          'No Dilution': '+1 if shares outstanding not increased',
          'ΔGross Margin > 0': '+1 if margins improved',
          'ΔAsset Turnover > 0': '+1 if efficiency improved'
        }
      }
    ],
    keyPoints: [
      'Developed by Joseph Piotroski for value stock screening',
      'Works best for low P/B (value) stocks',
      'High score + low valuation = potential opportunity',
      'Look for improving scores over time'
    ],
    relatedConcepts: ['roe', 'current-ratio', 'debt-ratio', 'earnings-quality'],
    relatedTools: ['piotroski-score', 'financial-health-dna'],
    visualType: 'table'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// TECHNICAL ANALYSIS CONCEPTS
// ─────────────────────────────────────────────────────────────────────────────

export const TECHNICAL_CONCEPTS: Concept[] = [
  {
    id: 'support-resistance',
    name: 'Support & Resistance',
    category: 'technical',
    difficulty: 'beginner',
    shortDefinition: 'Price levels where buying (support) or selling (resistance) pressure historically emerges.',
    fullExplanation: `Support and resistance are fundamental concepts in technical analysis representing price levels where supply and demand forces converge.

**Support**: A price level where buying interest is strong enough to overcome selling pressure. Price tends to "bounce" from support.

**Resistance**: A price level where selling pressure overcomes buying interest. Price tends to "reject" from resistance.

**Role Reversal**: When support breaks, it often becomes resistance (and vice versa).

**Types**:
- Horizontal S/R: Fixed price levels
- Trendline S/R: Diagonal lines
- Dynamic S/R: Moving averages
- Psychological S/R: Round numbers (₹1000, ₹500)`,
    examples: [
      {
        title: 'Nifty Support Levels',
        scenario: 'Nifty repeatedly bounces from 22,000 level over 3 weeks.',
        calculation: 'Each touch strengthens the support level',
        result: '22,000 is established as strong support',
        insight: 'More touches = stronger level. But too many touches may eventually break'
      }
    ],
    keyPoints: [
      'The more times a level is tested, the stronger it becomes',
      'High volume at S/R levels confirms their significance',
      'Round numbers often act as psychological S/R',
      'Broken support becomes resistance, broken resistance becomes support'
    ],
    commonMistakes: [
      'Treating S/R as exact prices instead of zones',
      'Ignoring volume confirmation',
      'Not waiting for candle close above/below level'
    ],
    relatedConcepts: ['pivot-points', 'trendlines', 'breakout', 'breakdown'],
    relatedTools: ['price-structure', 'pattern-matcher'],
    indianContext: 'Nifty often respects round numbers (22000, 22500) and Fibonacci levels. Bank Nifty levels are typically at 500-point intervals.',
    visualType: 'chart'
  },
  {
    id: 'candlestick-patterns',
    name: 'Candlestick Patterns',
    category: 'technical',
    difficulty: 'beginner',
    shortDefinition: 'Visual patterns formed by price candles that signal potential reversals or continuations.',
    fullExplanation: `Candlestick patterns originated in 18th century Japan for rice trading. Each candle shows Open, High, Low, Close (OHLC) for a time period.

**Anatomy**:
- Body: Open to Close range
- Wick/Shadow: High and Low extremes
- Green/White: Close > Open (bullish)
- Red/Black: Close < Open (bearish)

**Pattern Types**:
1. **Single Candle**: Doji, Hammer, Shooting Star, Marubozu
2. **Two Candle**: Engulfing, Harami, Piercing Line
3. **Three Candle**: Morning Star, Evening Star, Three White Soldiers`,
    examples: [
      {
        title: 'Bullish Engulfing at Support',
        scenario: 'After a downtrend, a large green candle completely engulfs the previous red candle at a support level.',
        result: 'Strong bullish reversal signal',
        insight: 'Combine with volume surge and support level for high-probability trade'
      }
    ],
    keyPoints: [
      'Context matters - patterns at S/R levels are more significant',
      'Volume confirms the pattern strength',
      'Higher timeframes = more reliable signals',
      'Never trade patterns in isolation'
    ],
    relatedConcepts: ['support-resistance', 'volume-analysis', 'trend-analysis'],
    relatedTools: ['candlestick-hero', 'pattern-matcher'],
    visualType: 'diagram'
  },
  {
    id: 'rsi',
    name: 'Relative Strength Index (RSI)',
    category: 'technical',
    difficulty: 'beginner',
    shortDefinition: 'Momentum oscillator (0-100) showing overbought (>70) and oversold (<30) conditions.',
    fullExplanation: `RSI measures the speed and magnitude of recent price changes to evaluate whether a stock is overbought or oversold.

**Interpretation**:
- RSI > 70: Overbought (potential reversal down)
- RSI < 30: Oversold (potential reversal up)
- RSI = 50: Neutral

**Advanced Usage**:
- **Divergence**: Price makes new high but RSI doesn't = bearish divergence
- **Failure Swings**: RSI breaks its own S/R levels
- **Range Shifts**: In strong trends, RSI stays in upper/lower zones

**Settings**: Default is 14 periods. Use 7 for more sensitivity, 21 for smoothing.`,
    formulas: [
      {
        name: 'RSI Formula',
        expression: 'RSI = 100 - [100 / (1 + RS)]',
        variables: {
          'RS': 'Average Gain / Average Loss over N periods',
          'N': 'Lookback period (default 14)'
        }
      }
    ],
    examples: [
      {
        title: 'RSI Divergence Trade',
        scenario: 'Stock makes a higher high at ₹500 (from ₹480), but RSI makes a lower high (65 from 72).',
        result: 'Bearish divergence - momentum weakening despite higher price',
        insight: 'Wait for price confirmation (break below recent low) before shorting'
      }
    ],
    keyPoints: [
      'RSI can stay overbought/oversold for extended periods in trends',
      'Divergences are powerful but need confirmation',
      'Use with other indicators, not in isolation',
      'Adjust periods based on your timeframe'
    ],
    commonMistakes: [
      'Shorting just because RSI is overbought in uptrend',
      'Not waiting for divergence confirmation',
      'Using default settings for all timeframes'
    ],
    relatedConcepts: ['macd', 'stochastic', 'momentum', 'divergence'],
    relatedTools: ['technical-indicators', 'momentum-heatmap'],
    visualType: 'chart'
  },
  {
    id: 'macd',
    name: 'MACD (Moving Average Convergence Divergence)',
    category: 'technical',
    difficulty: 'intermediate',
    shortDefinition: 'Trend-following momentum indicator showing relationship between two moving averages.',
    fullExplanation: `MACD shows the relationship between two exponential moving averages (EMAs) of price. It helps identify trend direction, momentum, and potential reversals.

**Components**:
1. **MACD Line**: 12-period EMA - 26-period EMA
2. **Signal Line**: 9-period EMA of MACD Line
3. **Histogram**: MACD Line - Signal Line

**Signals**:
- MACD crosses above Signal = Bullish
- MACD crosses below Signal = Bearish
- Histogram growing = Momentum increasing
- Zero line crossover = Trend change`,
    formulas: [
      {
        name: 'MACD Components',
        expression: 'MACD Line = EMA(12) - EMA(26)',
        variables: {
          'EMA(12)': '12-period Exponential Moving Average',
          'EMA(26)': '26-period Exponential Moving Average',
          'Signal Line': '9-period EMA of MACD Line'
        }
      }
    ],
    examples: [
      {
        title: 'MACD Bullish Crossover',
        scenario: 'MACD line crosses above signal line while both are below zero.',
        result: 'Bullish signal with potential for significant upside',
        insight: 'Crossovers below zero often precede larger moves than those above zero'
      }
    ],
    keyPoints: [
      'Works best in trending markets, not sideways',
      'Zero line crossovers are significant trend signals',
      'Histogram shows acceleration/deceleration of momentum',
      'Divergences work similar to RSI divergences'
    ],
    relatedConcepts: ['ema', 'rsi', 'momentum', 'trend-following'],
    relatedTools: ['technical-indicators', 'trend-strength'],
    visualType: 'chart'
  },
  {
    id: 'moving-averages',
    name: 'Moving Averages (SMA & EMA)',
    category: 'technical',
    difficulty: 'beginner',
    shortDefinition: 'Smoothed price lines that show trend direction and act as dynamic support/resistance.',
    fullExplanation: `Moving averages smooth out price data to show the underlying trend. They're among the most widely used technical indicators.

**Types**:
1. **SMA (Simple)**: Equal weight to all prices in period
2. **EMA (Exponential)**: More weight to recent prices (faster reaction)

**Common Periods**:
- Short-term: 9, 20 (trend trading)
- Medium-term: 50, 100 (swing trading)
- Long-term: 200 (investment trend)

**Key Signals**:
- Golden Cross: 50 MA crosses above 200 MA (bullish)
- Death Cross: 50 MA crosses below 200 MA (bearish)`,
    formulas: [
      {
        name: 'Simple Moving Average',
        expression: 'SMA = (P1 + P2 + ... + Pn) / n',
        variables: {
          'P': 'Price at each period',
          'n': 'Number of periods'
        }
      },
      {
        name: 'Exponential Moving Average',
        expression: 'EMA = Price(t) × k + EMA(y) × (1-k)',
        variables: {
          'k': 'Smoothing factor = 2/(n+1)',
          'EMA(y)': 'Previous EMA value'
        }
      }
    ],
    examples: [
      {
        title: '200 DMA as Support',
        scenario: 'Nifty falls 5% but finds buyers exactly at 200-day moving average.',
        result: '200 DMA acts as dynamic support',
        insight: 'Institutional investors often use 200 DMA as key reference for bull/bear market'
      }
    ],
    keyPoints: [
      '200 DMA is watched by institutions globally',
      'EMA reacts faster, SMA is smoother',
      'Slope of MA shows trend strength',
      'Multiple MAs can create "ribbons" for trend visualization'
    ],
    relatedConcepts: ['trend-following', 'golden-cross', 'death-cross'],
    relatedTools: ['technical-indicators', 'trend-strength', 'market-regime-radar'],
    indianContext: 'Nifty above 200 DMA is generally bullish. Traders watch 20 EMA for short-term and 50 EMA for medium-term trends.',
    visualType: 'chart'
  },
  {
    id: 'volume-analysis',
    name: 'Volume Analysis',
    category: 'technical',
    difficulty: 'beginner',
    shortDefinition: 'Study of trading volume to confirm price moves and identify institutional activity.',
    fullExplanation: `Volume represents the number of shares traded. It's the fuel that drives price movement and confirms the validity of trends.

**Core Principles**:
- Volume confirms price: Price move + high volume = genuine
- Volume precedes price: Accumulation before breakout
- Volume divergence: Price up + volume down = weak move

**Key Metrics**:
- **Relative Volume (RVOL)**: Today's volume / Average volume
- **OBV**: Cumulative volume based on price direction
- **VWAP**: Volume-weighted average price`,
    examples: [
      {
        title: 'Breakout with Volume Surge',
        scenario: 'Stock breaks resistance at ₹500 with 5x average volume.',
        result: 'High-conviction breakout',
        insight: 'Volume surge indicates institutional participation - breakout more likely to sustain'
      }
    ],
    keyPoints: [
      'High volume at key levels = significant decision points',
      'Volume should expand in trend direction',
      'Low volume breakouts often fail (fakeouts)',
      'Delivery percentage shows conviction in India'
    ],
    relatedConcepts: ['delivery-percentage', 'vwap', 'obv', 'accumulation'],
    relatedTools: ['delivery-analysis', 'trade-flow-intel'],
    indianContext: 'Delivery percentage above 50% indicates genuine buying. Cash market volume is more reliable than F&O volume for stock analysis.',
    visualType: 'chart'
  },
  {
    id: 'vwap',
    name: 'VWAP (Volume Weighted Average Price)',
    category: 'technical',
    difficulty: 'intermediate',
    shortDefinition: 'Average price weighted by volume. Institutional benchmark for fair intraday price.',
    fullExplanation: `VWAP represents the average price a stock has traded at throughout the day, weighted by volume. It's the benchmark used by institutional traders.

**Why VWAP Matters**:
- Institutions aim to buy below VWAP, sell above VWAP
- Price above VWAP = bullish intraday bias
- Price below VWAP = bearish intraday bias

**Trading Applications**:
- Mean reversion: Price tends to return to VWAP
- Trend confirmation: Strong trends stay on one side of VWAP
- Support/Resistance: VWAP acts as dynamic level`,
    formulas: [
      {
        name: 'VWAP Formula',
        expression: 'VWAP = Σ(Price × Volume) / Σ(Volume)',
        variables: {
          'Price': 'Typical price = (High + Low + Close) / 3',
          'Volume': 'Volume at each bar'
        }
      }
    ],
    examples: [
      {
        title: 'VWAP Bounce Trade',
        scenario: 'Bank Nifty pulls back to VWAP in an uptrending day and bounces.',
        result: 'VWAP acts as support in uptrend',
        insight: 'Institutional buyers often step in at VWAP - good long entry'
      }
    ],
    keyPoints: [
      'VWAP resets each day - only valid for intraday',
      'Price consistently above VWAP = buyers in control',
      'Standard deviation bands around VWAP show extremes',
      'Anchored VWAP can be drawn from any starting point'
    ],
    relatedConcepts: ['volume-analysis', 'mean-reversion', 'institutional-trading'],
    relatedTools: ['trade-flow-intel'],
    visualType: 'chart'
  },
  {
    id: 'pivot-points',
    name: 'Pivot Points & CPR',
    category: 'technical',
    difficulty: 'intermediate',
    shortDefinition: 'Calculated support/resistance levels based on previous day\'s high, low, close.',
    fullExplanation: `Pivot points are mathematical levels calculated from the previous period's price action. They provide objective support and resistance levels.

**Standard Pivot Levels**:
- Pivot Point (PP): (High + Low + Close) / 3
- R1, R2, R3: Resistance levels above pivot
- S1, S2, S3: Support levels below pivot

**CPR (Central Pivot Range)** - Popular in India:
- TC (Top Central): (Pivot - BC) + Pivot
- Pivot: (High + Low + Close) / 3
- BC (Bottom Central): (High + Low) / 2

**CPR Width** indicates expected volatility:
- Narrow CPR: Trending day expected
- Wide CPR: Range-bound day expected`,
    formulas: [
      {
        name: 'Floor Pivot Points',
        expression: 'PP = (H + L + C) / 3',
        variables: {
          'R1': '(2 × PP) - Low',
          'S1': '(2 × PP) - High',
          'R2': 'PP + (High - Low)',
          'S2': 'PP - (High - Low)'
        }
      },
      {
        name: 'CPR Formula',
        expression: 'Pivot = (H + L + C) / 3, BC = (H + L) / 2, TC = (Pivot - BC) + Pivot',
        variables: {
          'H': 'Previous day High',
          'L': 'Previous day Low',
          'C': 'Previous day Close'
        }
      }
    ],
    examples: [
      {
        title: 'Narrow CPR Breakout',
        scenario: 'Bank Nifty CPR is only 50 points wide (normally 150+). Price opens above CPR.',
        result: 'Expect trending day in the direction of open',
        insight: 'Narrow CPR = compressed range = potential explosive move'
      }
    ],
    keyPoints: [
      'CPR is calculated from daily data for next day\'s levels',
      'Virgin CPR (untested) is stronger support/resistance',
      'Price position relative to CPR sets initial bias',
      'Use with other confluences for higher probability'
    ],
    relatedConcepts: ['support-resistance', 'atr', 'opening-range'],
    relatedTools: ['price-structure', 'playbook-builder'],
    indianContext: 'CPR is extremely popular among Indian intraday traders. Many trading systems are built around CPR and pivot levels.',
    visualType: 'diagram'
  },
  {
    id: 'open-interest',
    name: 'Open Interest (OI)',
    category: 'derivatives',
    difficulty: 'intermediate',
    shortDefinition: 'Total number of outstanding derivative contracts. Shows money flow and market positioning.',
    fullExplanation: `Open Interest represents the total number of outstanding (open) derivative contracts that have not been settled. Unlike volume, OI shows ongoing commitments.

**OI + Price Interpretation**:
| Price | OI | Interpretation |
|-------|-----|----------------|
| ↑ | ↑ | Long Buildup (Bullish) |
| ↑ | ↓ | Short Covering (Weak Bullish) |
| ↓ | ↑ | Short Buildup (Bearish) |
| ↓ | ↓ | Long Unwinding (Weak Bearish) |

**OI Analysis for Options**:
- High OI at strike = Key level / Max Pain
- OI buildup in Calls = Resistance
- OI buildup in Puts = Support`,
    examples: [
      {
        title: 'Long Buildup in Nifty Futures',
        scenario: 'Nifty rises 200 points with futures OI increasing by 5 lakh contracts.',
        result: 'Fresh longs are being created - bullish confirmation',
        insight: 'This is stronger than same price rise with decreasing OI (just short covering)'
      }
    ],
    keyPoints: [
      'OI shows conviction behind price moves',
      'Max Pain theory: Price gravitates to strike with highest OI',
      'Sudden OI spikes indicate institutional activity',
      'Compare OI changes across strikes for positioning'
    ],
    relatedConcepts: ['long-buildup', 'short-covering', 'max-pain', 'pcr'],
    relatedTools: ['options-strategy', 'fno-risk-advisor'],
    indianContext: 'Watch Ban Nifty and individual stock F&O ban when OI exceeds MWPL (Market Wide Position Limit).',
    visualType: 'table'
  },
  {
    id: 'option-greeks',
    name: 'Option Greeks (Delta, Gamma, Theta, Vega)',
    category: 'derivatives',
    difficulty: 'advanced',
    shortDefinition: 'Measures of option price sensitivity to various factors like price, time, and volatility.',
    fullExplanation: `Option Greeks quantify how option prices change with respect to various factors. Understanding Greeks is essential for options trading.

**Delta (Δ)**: Sensitivity to underlying price change
- Call Delta: 0 to 1 (ATM ≈ 0.5)
- Put Delta: -1 to 0 (ATM ≈ -0.5)
- Also approximates probability of expiring ITM

**Gamma (Γ)**: Rate of change of Delta
- Highest for ATM options near expiry
- Shows how Delta will change as price moves

**Theta (Θ)**: Time decay (always negative for buyers)
- Options lose value each day
- Accelerates as expiry approaches

**Vega (ν)**: Sensitivity to implied volatility
- Higher IV = higher option prices
- ATM options have highest Vega`,
    formulas: [
      {
        name: 'Greek Definitions',
        expression: 'Delta = ∂V/∂S, Gamma = ∂²V/∂S², Theta = ∂V/∂t, Vega = ∂V/∂σ',
        variables: {
          'V': 'Option value',
          'S': 'Underlying price',
          't': 'Time to expiry',
          'σ': 'Implied volatility'
        }
      }
    ],
    examples: [
      {
        title: 'Understanding Delta for Position Sizing',
        scenario: 'You buy Nifty 22500 CE with Delta of 0.45. Nifty moves up 100 points.',
        calculation: 'Expected option price change = 100 × 0.45 = ₹45',
        result: 'Option should gain approximately ₹45',
        insight: 'Delta helps estimate P&L and determine hedge ratios'
      }
    ],
    keyPoints: [
      'Delta-neutral strategies reduce directional risk',
      'Gamma risk is highest near expiry for ATM options',
      'Theta decay accelerates in final week',
      'High IV before events, IV crush after events'
    ],
    relatedConcepts: ['implied-volatility', 'time-decay', 'option-pricing'],
    relatedTools: ['options-strategy', 'fno-risk-advisor'],
    indianContext: 'Weekly expiries have extreme Theta decay on Thursday. Bank Nifty options have higher IV than Nifty options.',
    visualType: 'table'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// RISK MANAGEMENT CONCEPTS
// ─────────────────────────────────────────────────────────────────────────────

export const RISK_CONCEPTS: Concept[] = [
  {
    id: 'position-sizing',
    name: 'Position Sizing',
    category: 'risk',
    difficulty: 'beginner',
    shortDefinition: 'Determining how much capital to allocate to each trade based on risk tolerance.',
    fullExplanation: `Position sizing is arguably the most important aspect of risk management. It determines how much of your capital you risk on each trade.

**The 1-2% Rule**: Never risk more than 1-2% of your capital on a single trade.

**Fixed Fractional Method**:
Position Size = (Account × Risk%) / (Entry - Stop Loss)

**Why This Matters**:
- 10 consecutive losses at 2% risk = 18% drawdown (recoverable)
- 10 consecutive losses at 10% risk = 65% drawdown (devastating)`,
    formulas: [
      {
        name: 'Position Size Calculator',
        expression: 'Quantity = (Capital × Risk%) / (Entry Price - Stop Loss)',
        variables: {
          'Capital': 'Total trading capital',
          'Risk%': 'Maximum risk per trade (1-2%)',
          'Entry Price': 'Your entry price',
          'Stop Loss': 'Your stop loss price'
        }
      },
      {
        name: 'For F&O',
        expression: 'Lots = (Capital × Risk%) / (Points at Risk × Lot Size × Price per Point)',
        variables: {
          'Points at Risk': 'Entry - Stop Loss in points',
          'Lot Size': 'Contract lot size (e.g., Nifty = 50)',
          'Price per Point': '₹1 for Nifty, ₹1 for Bank Nifty'
        }
      }
    ],
    examples: [
      {
        title: 'F&O Position Sizing',
        scenario: 'Capital: ₹5,00,000. Risk: 1%. Nifty entry at 22500, SL at 22400 (100 points). Lot size: 50.',
        data: { 'Capital': 500000, 'Risk%': 1, 'Entry': 22500, 'SL': 22400, 'Lot Size': 50 },
        calculation: 'Max Loss = 5,00,000 × 1% = ₹5,000. Loss per lot = 100 × 50 = ₹5,000. Lots = 5000/5000 = 1',
        result: 'Trade only 1 lot of Nifty Futures',
        insight: 'Even though you can afford margin for more lots, risk management limits you to 1'
      }
    ],
    keyPoints: [
      'Position size BEFORE entry, not after',
      'Smaller position = wider stop loss possible',
      'Scale down after losses, scale up after wins',
      'Account for slippage in calculations'
    ],
    commonMistakes: [
      'Sizing based on margin available, not risk',
      'Increasing size to recover losses (revenge trading)',
      'Not adjusting for volatility'
    ],
    relatedConcepts: ['stop-loss', 'risk-reward', 'drawdown', 'kelly-criterion'],
    relatedTools: ['fno-risk-advisor', 'trade-expectancy'],
    indianContext: 'F&O lot sizes are fixed by exchanges. Adjust number of lots, not lot size. Always account for STT, brokerage in calculations.',
    visualType: 'table'
  },
  {
    id: 'risk-reward-ratio',
    name: 'Risk-Reward Ratio',
    category: 'risk',
    difficulty: 'beginner',
    shortDefinition: 'Comparison of potential profit vs potential loss. Minimum 1:2 recommended.',
    fullExplanation: `Risk-Reward Ratio (RRR) compares how much you stand to lose vs how much you stand to gain on a trade.

**Calculation**:
RRR = (Target - Entry) / (Entry - Stop Loss)

**Relationship with Win Rate**:
| RRR | Min Win Rate for Breakeven |
|-----|---------------------------|
| 1:1 | 50% |
| 1:2 | 33% |
| 1:3 | 25% |

**Expectancy**: Win Rate × Avg Win - Loss Rate × Avg Loss

A 1:3 RRR means you can be wrong 70% of the time and still be profitable!`,
    formulas: [
      {
        name: 'Risk-Reward Ratio',
        expression: 'RRR = (Target Price - Entry Price) / (Entry Price - Stop Loss Price)',
        variables: {
          'Target': 'Take profit level',
          'Entry': 'Entry price',
          'Stop Loss': 'Stop loss price'
        }
      },
      {
        name: 'Expectancy',
        expression: 'E = (Win% × Avg Win) - (Loss% × Avg Loss)',
        variables: {
          'Win%': 'Win rate as decimal',
          'Avg Win': 'Average winning trade',
          'Loss%': 'Loss rate (1 - Win%)',
          'Avg Loss': 'Average losing trade'
        }
      }
    ],
    examples: [
      {
        title: 'Why RRR Matters More Than Win Rate',
        scenario: 'Trader A: 70% win rate, 1:1 RRR. Trader B: 40% win rate, 1:3 RRR. Both trade ₹1000 risk.',
        calculation: 'A: (0.7 × 1000) - (0.3 × 1000) = ₹400. B: (0.4 × 3000) - (0.6 × 1000) = ₹600',
        result: 'Trader B makes more despite lower win rate',
        insight: 'Focus on RRR, not on being right. Let winners run, cut losers quickly.'
      }
    ],
    keyPoints: [
      'Never take trades below 1:1.5 RRR',
      'Higher RRR allows lower win rate',
      'Set targets at logical S/R levels, not arbitrary ratios',
      'Actual RRR may differ from planned (slippage, early exit)'
    ],
    relatedConcepts: ['position-sizing', 'win-rate', 'expectancy', 'stop-loss'],
    relatedTools: ['trade-expectancy', 'trade-journal', 'playbook-builder'],
    visualType: 'table'
  },
  {
    id: 'stop-loss',
    name: 'Stop Loss Strategies',
    category: 'risk',
    difficulty: 'beginner',
    shortDefinition: 'Pre-determined exit price to limit losses. Essential for capital preservation.',
    fullExplanation: `A stop loss is an order to exit a position when it reaches a specified price, limiting potential losses. It's your insurance policy.

**Types of Stop Loss**:
1. **Fixed/Static**: Set at a price and don't move it
2. **Trailing**: Moves with price to lock in profits
3. **ATR-Based**: Based on volatility (e.g., 2× ATR)
4. **Structure-Based**: Below support / above resistance

**Placement Tips**:
- Below swing low for longs
- Above swing high for shorts
- Account for normal volatility (don't get stopped by noise)
- Consider time-based stops for options`,
    formulas: [
      {
        name: 'ATR-Based Stop',
        expression: 'Stop Loss = Entry Price - (ATR × Multiplier)',
        variables: {
          'ATR': 'Average True Range (typically 14-period)',
          'Multiplier': 'Usually 1.5 to 3 depending on style'
        }
      },
      {
        name: 'Percentage Stop',
        expression: 'Stop Loss = Entry Price × (1 - Stop%)',
        variables: {
          'Stop%': 'Fixed percentage (e.g., 2% for intraday, 5% for swing)'
        }
      }
    ],
    examples: [
      {
        title: 'ATR-Based Stop for Volatile Stock',
        scenario: 'Buying stock at ₹500. 14-day ATR is ₹15. Using 2× ATR stop.',
        calculation: 'Stop Loss = 500 - (15 × 2) = ₹470',
        result: 'Stop loss at ₹470 (6% away)',
        insight: 'ATR adjusts for volatility - wider stop for volatile stocks'
      }
    ],
    keyPoints: [
      'Always set stop loss BEFORE entering trade',
      'Never move stop loss further away',
      'Use mental stops only if you have iron discipline',
      'Account for gaps - stop may execute at worse price'
    ],
    commonMistakes: [
      'Setting stops at obvious levels where others place them',
      'Moving stop further to "give it room"',
      'Not having a stop at all',
      'Stop too tight for the timeframe/volatility'
    ],
    relatedConcepts: ['position-sizing', 'atr', 'trailing-stop', 'drawdown'],
    relatedTools: ['fno-risk-advisor', 'risk-health-dashboard', 'volatility-regime'],
    indianContext: 'In F&O, stop loss orders become market orders when triggered - slippage can be significant in volatile conditions.',
    visualType: 'diagram'
  },
  {
    id: 'drawdown',
    name: 'Drawdown',
    category: 'risk',
    difficulty: 'intermediate',
    shortDefinition: 'Peak-to-trough decline in account equity. Measures worst-case loss from highest point.',
    fullExplanation: `Drawdown measures the decline from a peak in account value to a subsequent trough. It's the most important metric for understanding real-world pain.

**Types**:
- **Maximum Drawdown (MDD)**: Largest peak-to-trough decline ever
- **Current Drawdown**: Distance from most recent peak
- **Drawdown Duration**: Time spent in drawdown

**Recovery Math** (why drawdowns are devastating):
| Drawdown | Recovery Needed |
|----------|-----------------|
| 10% | 11% |
| 25% | 33% |
| 50% | 100% |
| 75% | 300% |`,
    formulas: [
      {
        name: 'Drawdown',
        expression: 'Drawdown = (Peak Value - Current Value) / Peak Value × 100',
        variables: {
          'Peak Value': 'Highest equity point',
          'Current Value': 'Current account value'
        }
      }
    ],
    examples: [
      {
        title: 'Understanding Drawdown Impact',
        scenario: 'Account grows from ₹10L to ₹15L, then falls to ₹10L again.',
        calculation: 'Drawdown = (15L - 10L) / 15L = 33%',
        result: '33% drawdown from peak',
        insight: 'Even though you\'re at breakeven from start, you\'ve experienced 33% drawdown - psychologically tough'
      }
    ],
    keyPoints: [
      'Max drawdown is more important than returns for risk assessment',
      'Professional traders aim for MDD < 20%',
      'Drawdown duration can be as damaging as depth',
      'Always have a "uncle point" - max acceptable drawdown'
    ],
    relatedConcepts: ['position-sizing', 'risk-management', 'sharpe-ratio'],
    relatedTools: ['drawdown-var', 'trade-expectancy', 'risk-health-dashboard'],
    visualType: 'chart'
  },
  {
    id: 'sharpe-ratio',
    name: 'Sharpe Ratio',
    category: 'risk',
    difficulty: 'intermediate',
    shortDefinition: 'Risk-adjusted return metric. Higher Sharpe = better return per unit of risk.',
    fullExplanation: `The Sharpe Ratio measures excess return (above risk-free rate) per unit of volatility. It answers: "Am I being compensated enough for the risk I'm taking?"

**Interpretation**:
- < 0: Losing money or earning less than risk-free
- 0-1: Subpar risk-adjusted returns
- 1-2: Good
- 2-3: Very good
- > 3: Excellent (or possibly too good - check for errors)

**Limitation**: Sharpe assumes normal distribution of returns, which isn't true for strategies with tail risks.`,
    formulas: [
      {
        name: 'Sharpe Ratio',
        expression: 'Sharpe = (Rp - Rf) / σp',
        variables: {
          'Rp': 'Portfolio return (annualized)',
          'Rf': 'Risk-free rate (e.g., G-Sec yield)',
          'σp': 'Standard deviation of portfolio returns'
        }
      }
    ],
    examples: [
      {
        title: 'Comparing Two Strategies',
        scenario: 'Strategy A: 25% return, 20% volatility. Strategy B: 18% return, 8% volatility. Risk-free rate: 6%.',
        calculation: 'A: (25-6)/20 = 0.95. B: (18-6)/8 = 1.5',
        result: 'Strategy B has higher Sharpe (1.5 vs 0.95)',
        insight: 'B is better risk-adjusted despite lower raw returns'
      }
    ],
    keyPoints: [
      'Always compare Sharpe over same time periods',
      'Higher Sharpe allows for higher leverage if desired',
      'Sortino Ratio is better for strategies with asymmetric returns',
      'Historical Sharpe may not predict future Sharpe'
    ],
    relatedConcepts: ['sortino-ratio', 'volatility', 'risk-adjusted-return'],
    relatedTools: ['trade-expectancy', 'drawdown-var'],
    indianContext: 'Use G-Sec 10-year yield as risk-free rate for India (currently ~7%). Good Indian equity funds have Sharpe around 0.8-1.2.',
    visualType: 'chart'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// TRADING PSYCHOLOGY CONCEPTS
// ─────────────────────────────────────────────────────────────────────────────

export const PSYCHOLOGY_CONCEPTS: Concept[] = [
  {
    id: 'fomo',
    name: 'FOMO (Fear of Missing Out)',
    category: 'psychology',
    difficulty: 'beginner',
    shortDefinition: 'Anxiety that causes traders to chase trades they missed, often at the worst prices.',
    fullExplanation: `FOMO is the emotional response to seeing others profit from a move you didn't take. It leads to impulsive entries, usually at extended prices.

**Signs of FOMO Trading**:
- Entering after a big move has already happened
- Ignoring your trading plan because "this one is different"
- Buying at all-time highs after a rally
- Increasing position size to "make up for missed gains"

**The FOMO Cycle**:
1. Miss a move → Feel regret
2. Chase the move → Enter late
3. Price reverses → Take loss
4. Miss next move (too scared) → Repeat`,
    examples: [
      {
        title: 'Classic FOMO Scenario',
        scenario: 'You watch a stock go from ₹100 to ₹150 in 3 days. You finally buy at ₹148. It drops to ₹130.',
        result: '12% loss while original move was 50% gain',
        insight: 'The best trades feel scary to enter, the worst trades feel "obvious" and easy'
      }
    ],
    keyPoints: [
      'If you missed a move, the opportunity is gone - accept it',
      'There will always be another trade',
      'Wait for pullbacks instead of chasing',
      'Keep a "missed trades" journal to see patterns'
    ],
    relatedConcepts: ['revenge-trading', 'discipline', 'trading-plan'],
    relatedTools: ['trade-journal', 'playbook-builder'],
    visualType: 'none'
  },
  {
    id: 'revenge-trading',
    name: 'Revenge Trading',
    category: 'psychology',
    difficulty: 'beginner',
    shortDefinition: 'Impulsive trading to recover losses, usually making things worse.',
    fullExplanation: `Revenge trading happens when a trader tries to immediately recover a loss by taking another trade, often without proper analysis or risk management.

**Characteristics**:
- Larger than normal position size
- Lower quality setup (or no setup)
- Ignoring stop losses
- Trading outside your plan

**The Psychology**:
- Loss creates pain
- Brain wants to eliminate pain immediately
- Taking action feels better than sitting with loss
- But impulsive action leads to more losses`,
    examples: [
      {
        title: 'Revenge Trading Spiral',
        scenario: 'Trader loses ₹5,000 on a failed trade. Immediately doubles position on next trade to recover. Loses another ₹8,000.',
        result: 'Total loss: ₹13,000 instead of ₹5,000',
        insight: 'Walking away after a loss is one of the hardest but most valuable skills'
      }
    ],
    keyPoints: [
      'Set a daily loss limit and stop trading when hit',
      'Take a break after significant losses',
      'Size down, not up, after losing streaks',
      'Treat each trade independently'
    ],
    relatedConcepts: ['fomo', 'discipline', 'risk-management'],
    relatedTools: ['trade-journal', 'risk-health-dashboard'],
    visualType: 'none'
  },
  {
    id: 'overtrading',
    name: 'Overtrading',
    category: 'psychology',
    difficulty: 'beginner',
    shortDefinition: 'Taking too many trades, often due to boredom, greed, or need for action.',
    fullExplanation: `Overtrading is one of the most common reasons traders fail. It can manifest as:

**Types of Overtrading**:
1. **Frequency**: Too many trades in a day/week
2. **Size**: Position sizes too large for account
3. **Time**: Trading in unfavorable market conditions

**Root Causes**:
- Boredom (need for action)
- Greed (wanting to maximize every move)
- Addiction (dopamine from trading)
- Fear (of missing opportunities)

**Cost of Overtrading**:
- Transaction costs eat into profits
- Lower quality setups
- Mental exhaustion leading to mistakes`,
    examples: [
      {
        title: 'Transaction Cost Impact',
        scenario: 'Trader takes 50 intraday trades/day in F&O. Brokerage + STT + other charges ≈ ₹100/trade.',
        calculation: '50 trades × ₹100 × 22 trading days = ₹1,10,000/month',
        result: 'Must make ₹1.1L just to break even before making any profit',
        insight: 'Even with 50% win rate, transaction costs can make you a net loser'
      }
    ],
    keyPoints: [
      'Quality over quantity - wait for A+ setups',
      'Set a maximum trades per day limit',
      'Journal each trade - you\'ll spot the unnecessary ones',
      'It\'s okay to have days with zero trades'
    ],
    relatedConcepts: ['trading-plan', 'discipline', 'transaction-costs'],
    relatedTools: ['trade-journal', 'trade-expectancy'],
    indianContext: 'STT on F&O sell-side makes frequent trading expensive. Intraday equity has lower STT but still adds up.',
    visualType: 'none'
  },
  {
    id: 'confirmation-bias',
    name: 'Confirmation Bias',
    category: 'psychology',
    difficulty: 'intermediate',
    shortDefinition: 'Tendency to seek information that confirms your existing belief about a trade.',
    fullExplanation: `Confirmation bias is the tendency to search for, interpret, and remember information that confirms your pre-existing beliefs.

**In Trading**:
- You're bullish on a stock, so you only read bullish analysis
- You ignore bearish signals on your long positions
- You remember wins that confirmed your thesis, forget losses

**Dangerous Because**:
- Prevents objective analysis
- Leads to staying in losing trades too long
- Creates false confidence`,
    examples: [
      {
        title: 'Bias in Stock Analysis',
        scenario: 'You own Adani stocks. You read 10 articles - 7 negative, 3 positive. You focus on and share the 3 positive ones.',
        result: 'Incomplete picture, increased risk',
        insight: 'Always seek the bear case for your bull thesis (and vice versa)'
      }
    ],
    keyPoints: [
      'Actively seek opposing viewpoints',
      'Write down reasons your trade could fail',
      'Have a trading buddy who can challenge your views',
      'Let price action override your thesis'
    ],
    relatedConcepts: ['loss-aversion', 'ego', 'trading-psychology'],
    relatedTools: ['trade-journal'],
    visualType: 'none'
  },
  {
    id: 'loss-aversion',
    name: 'Loss Aversion',
    category: 'psychology',
    difficulty: 'intermediate',
    shortDefinition: 'The pain of losing is psychologically twice as powerful as the pleasure of gaining.',
    fullExplanation: `Loss aversion, discovered by Kahneman and Tversky, shows that humans feel losses about twice as intensely as equivalent gains.

**Impact on Trading**:
- Holding losers too long (hoping to avoid realizing loss)
- Cutting winners too early (fear of giving back gains)
- Not taking valid trades (fear of loss)
- Risking too little (leaving money on table)

**The Math Problem**:
If you cut winners at 1R and let losers run to 3R, even 75% win rate loses money:
(0.75 × 1) - (0.25 × 3) = 0 breakeven`,
    examples: [
      {
        title: 'Asymmetric Exit Behavior',
        scenario: 'Trader has two positions. One is up 10%, one is down 10%.',
        result: 'Most traders sell the winner and hold the loser',
        insight: 'This is exactly backwards. Should cut loser and let winner run.'
      }
    ],
    keyPoints: [
      'Recognize that losses hurt more - it\'s normal',
      'Use systematic rules to override emotions',
      'Focus on process, not individual trade outcomes',
      'A loss is just the cost of doing business'
    ],
    relatedConcepts: ['confirmation-bias', 'sunk-cost-fallacy', 'prospect-theory'],
    relatedTools: ['trade-journal', 'playbook-builder'],
    visualType: 'none'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// COMBINE ALL CONCEPTS
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_CONCEPTS: Concept[] = [
  ...FUNDAMENTAL_CONCEPTS,
  ...TECHNICAL_CONCEPTS,
  ...RISK_CONCEPTS,
  ...PSYCHOLOGY_CONCEPTS,
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export function getConceptById(id: string): Concept | undefined {
  return ALL_CONCEPTS.find(c => c.id === id);
}

export function getConceptsByCategory(category: ConceptCategory): Concept[] {
  return ALL_CONCEPTS.filter(c => c.category === category);
}

export function getConceptsByDifficulty(difficulty: DifficultyLevel): Concept[] {
  return ALL_CONCEPTS.filter(c => c.difficulty === difficulty);
}

export function getConceptsForTool(toolId: string): Concept[] {
  return ALL_CONCEPTS.filter(c => c.relatedTools.includes(toolId));
}

export function getRelatedConcepts(conceptId: string): Concept[] {
  const concept = getConceptById(conceptId);
  if (!concept) return [];
  return concept.relatedConcepts
    .map(id => getConceptById(id))
    .filter((c): c is Concept => c !== undefined);
}

export function searchConcepts(query: string): Concept[] {
  const lower = query.toLowerCase();
  return ALL_CONCEPTS.filter(c => 
    c.name.toLowerCase().includes(lower) ||
    c.shortDefinition.toLowerCase().includes(lower) ||
    c.id.includes(lower)
  );
}
