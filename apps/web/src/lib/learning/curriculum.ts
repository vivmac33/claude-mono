/**
 * MONOMORPH LEARNING CURRICULUM
 * Complete guide to all 72 tools, their metrics, and interpretation
 * 
 * Structure:
 * - Module: Category-level grouping
 * - Lesson: Individual tool deep-dive
 * - Metric: Each metric with formula, interpretation, and thresholds
 */

export interface MetricDefinition {
  id: string;
  name: string;
  formula?: string;
  description: string;
  interpretation: {
    excellent?: string;
    good?: string;
    fair?: string;
    poor?: string;
    dangerous?: string;
  };
  thresholds?: {
    excellent?: number;
    good?: number;
    fair?: number;
    poor?: number;
  };
  indianContext?: string; // India-specific interpretation
  relatedMetrics?: string[];
  commonMistakes?: string[];
}

export interface LessonDefinition {
  toolId: string;
  toolName: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string; // e.g., "5 min"
  summary: string;
  whatYouLearn: string[];
  whyItMatters: string;
  metrics: MetricDefinition[];
  practicalExample?: string;
  actionableInsights: string[];
  commonQuestions: Array<{ q: string; a: string }>;
  nextTools: string[]; // Related tools to explore next
}

export interface ModuleDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  lessons: LessonDefinition[];
  prerequisites?: string[];
  learningOutcomes: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 1: VALUE INVESTING FUNDAMENTALS
// ═══════════════════════════════════════════════════════════════════════════

export const valueModule: ModuleDefinition = {
  id: 'value',
  name: 'Value Investing',
  icon: '💎',
  description: 'Master the art of finding undervalued stocks using fundamental analysis, intrinsic value calculations, and quality screening.',
  prerequisites: [],
  learningOutcomes: [
    'Calculate intrinsic value using DCF and relative methods',
    'Identify quality stocks using Piotroski and multi-factor scores',
    'Understand margin of safety and when to buy/sell',
    'Decompose ROE using DuPont analysis'
  ],
  lessons: [
    // ─────────────────────────────────────────────────────────────────────
    // LESSON: Valuation Summary
    // ─────────────────────────────────────────────────────────────────────
    {
      toolId: 'valuation-summary',
      toolName: 'Valuation Summary',
      category: 'value',
      difficulty: 'beginner',
      duration: '8 min',
      summary: 'Your first stop for understanding if a stock is cheap or expensive. Combines multiple valuation ratios into one view.',
      whatYouLearn: [
        'How to read P/E, P/B, P/S, EV/EBITDA ratios',
        'Comparing current valuation to historical averages',
        'Understanding sector-relative valuation'
      ],
      whyItMatters: 'Overpaying for even great companies destroys returns. This tool helps you avoid buying at peaks.',
      metrics: [
        {
          id: 'pe_ratio',
          name: 'Price-to-Earnings (P/E)',
          formula: 'Market Price / Earnings Per Share',
          description: 'How many years of current earnings you pay for the stock. Lower generally means cheaper.',
          interpretation: {
            excellent: 'P/E < 15: Potentially undervalued, good entry point',
            good: 'P/E 15-20: Fairly valued for quality companies',
            fair: 'P/E 20-30: Growth premium, needs high growth to justify',
            poor: 'P/E > 30: Expensive, better have exceptional growth',
            dangerous: 'P/E > 50 or negative: Speculative territory'
          },
          thresholds: { excellent: 15, good: 20, fair: 30, poor: 50 },
          indianContext: 'Nifty 50 average P/E is ~22. IT sector trades at 25-30x, PSU banks at 8-12x.',
          relatedMetrics: ['peg_ratio', 'forward_pe'],
          commonMistakes: [
            'Comparing P/E across different sectors',
            'Ignoring cyclicality - P/E looks low at cycle peaks',
            'Not checking if earnings are sustainable'
          ]
        },
        {
          id: 'pb_ratio',
          name: 'Price-to-Book (P/B)',
          formula: 'Market Price / Book Value Per Share',
          description: 'Compares market value to accounting book value. Useful for asset-heavy industries.',
          interpretation: {
            excellent: 'P/B < 1: Trading below liquidation value (rare for quality)',
            good: 'P/B 1-2: Reasonable for banks, industrials',
            fair: 'P/B 2-4: Normal for quality companies',
            poor: 'P/B > 5: High expectations baked in'
          },
          thresholds: { excellent: 1, good: 2, fair: 4, poor: 5 },
          indianContext: 'Banks: P/B 1-3x normal. IT companies: P/B 5-15x due to intangibles not on books.',
          relatedMetrics: ['roe', 'tangible_book'],
          commonMistakes: [
            'Using P/B for asset-light businesses (IT, pharma)',
            'Ignoring hidden assets/liabilities not on balance sheet'
          ]
        },
        {
          id: 'ps_ratio',
          name: 'Price-to-Sales (P/S)',
          formula: 'Market Cap / Annual Revenue',
          description: 'Useful when earnings are negative or volatile. Shows what you pay per rupee of sales.',
          interpretation: {
            excellent: 'P/S < 1: Very cheap, check why',
            good: 'P/S 1-3: Reasonable for most sectors',
            fair: 'P/S 3-6: Growth company premium',
            poor: 'P/S > 6: Very high expectations'
          },
          thresholds: { excellent: 1, good: 3, fair: 6, poor: 10 },
          indianContext: 'FMCG trades at P/S 5-10x, commodity companies at 0.5-2x.',
          relatedMetrics: ['revenue_growth', 'net_margin'],
          commonMistakes: [
            'P/S ignores profitability - unprofitable company can have low P/S',
            'Compare P/S only within same industry'
          ]
        },
        {
          id: 'ev_ebitda',
          name: 'EV/EBITDA',
          formula: '(Market Cap + Debt - Cash) / EBITDA',
          description: 'Enterprise value relative to operating profit. Accounts for debt, better for acquisitions.',
          interpretation: {
            excellent: 'EV/EBITDA < 8: Attractive, especially if low debt',
            good: 'EV/EBITDA 8-12: Fair value range',
            fair: 'EV/EBITDA 12-16: Premium valuation',
            poor: 'EV/EBITDA > 16: Expensive'
          },
          thresholds: { excellent: 8, good: 12, fair: 16, poor: 20 },
          indianContext: 'Infra/capital goods: 8-12x. Consumer: 15-25x. Pharma: 12-18x.',
          relatedMetrics: ['debt_to_ebitda', 'interest_coverage'],
          commonMistakes: [
            'Ignoring capex requirements - high capex companies need lower EV/EBITDA',
            'Not adjusting for one-time items in EBITDA'
          ]
        },
        {
          id: 'peg_ratio',
          name: 'PEG Ratio',
          formula: 'P/E Ratio / EPS Growth Rate (%)',
          description: 'Adjusts P/E for growth. Helps compare fast and slow growers.',
          interpretation: {
            excellent: 'PEG < 0.5: Growth not priced in, potential opportunity',
            good: 'PEG 0.5-1: Fair value for growth',
            fair: 'PEG 1-2: Paying premium for growth',
            poor: 'PEG > 2: Overvalued relative to growth'
          },
          thresholds: { excellent: 0.5, good: 1, fair: 2, poor: 3 },
          indianContext: 'High-growth companies (20%+ growth) can justify PEG up to 1.5.',
          relatedMetrics: ['pe_ratio', 'eps_growth'],
          commonMistakes: [
            'Using unreliable growth estimates',
            'PEG doesnt work for cyclicals or turnarounds'
          ]
        },
        {
          id: 'valuation_percentile',
          name: 'Historical Percentile',
          formula: 'Current P/E rank vs last 5 years',
          description: 'Shows if current valuation is high or low vs own history.',
          interpretation: {
            excellent: '< 20th percentile: Near historical lows',
            good: '20-40th: Below average, potentially attractive',
            fair: '40-60th: Near historical average',
            poor: '60-80th: Above average, less margin of safety',
            dangerous: '> 80th: Near historical highs, caution'
          },
          indianContext: 'Check if low percentile is due to genuine cheapness or deteriorating fundamentals.',
          relatedMetrics: ['pe_ratio', 'pb_ratio']
        }
      ],
      practicalExample: `TCS at P/E 28, P/B 12, EV/EBITDA 20:
- P/E 28 is above Nifty average (22) but normal for IT sector
- P/B 12 looks high but IT has intangible value (brand, talent)
- Compare to INFY (P/E 24) and WIPRO (P/E 20) for relative view
- If at 80th percentile of own history, wait for better entry`,
      actionableInsights: [
        'Never buy at > 80th percentile unless strong catalyst',
        'Check at least 3 valuation metrics before concluding',
        'Compare to sector peers, not broad market',
        'Historical percentile < 30% often signals opportunity'
      ],
      commonQuestions: [
        { q: 'Which ratio is most important?', a: 'Depends on sector. P/E for stable earners, P/B for banks, EV/EBITDA for debt-heavy, P/S for high-growth.' },
        { q: 'Why is TCS P/E so high?', a: 'IT sector premium for dollar earnings, high ROE, and asset-light model. Compare within IT, not with banks.' },
        { q: 'Stock is cheap but keeps falling?', a: 'Cheap can get cheaper. Check if fundamentals are deteriorating. Use with quality scores.' }
      ],
      nextTools: ['piotroski-score', 'intrinsic-value-range', 'peer-comparison']
    },

    // ─────────────────────────────────────────────────────────────────────
    // LESSON: Piotroski F-Score
    // ─────────────────────────────────────────────────────────────────────
    {
      toolId: 'piotroski-score',
      toolName: 'Piotroski F-Score',
      category: 'value',
      difficulty: 'beginner',
      duration: '6 min',
      summary: 'A 9-point checklist that separates quality value stocks from value traps. Each point tests a different aspect of financial health.',
      whatYouLearn: [
        'The 9 factors that indicate improving fundamentals',
        'How to avoid value traps',
        'Using F-Score with other valuation metrics'
      ],
      whyItMatters: 'Low P/E alone doesnt work - you need quality. Piotroski proved high F-Score + low P/B beats market by 7.5% annually.',
      metrics: [
        {
          id: 'f_score_total',
          name: 'Total F-Score',
          formula: 'Sum of 9 binary (0/1) tests',
          description: 'Overall fundamental strength. Higher = stronger financials improving.',
          interpretation: {
            excellent: '8-9: Strong fundamentals, improving. Strong buy signal.',
            good: '6-7: Healthy company, minor concerns',
            fair: '4-5: Average, needs deeper analysis',
            poor: '2-3: Weak fundamentals, potential value trap',
            dangerous: '0-1: Serious issues, avoid'
          },
          thresholds: { excellent: 8, good: 6, fair: 4, poor: 2 },
          indianContext: 'Only ~10% of Nifty 500 stocks score 8+. These tend to outperform.',
          relatedMetrics: ['roa', 'ocf', 'debt_ratio']
        },
        {
          id: 'f_profitability',
          name: 'Profitability (4 points)',
          description: 'Tests if company is profitable and generating real cash.',
          interpretation: {
            excellent: '4/4: Profitable with strong cash generation',
            good: '3/4: Profitable but one concern',
            fair: '2/4: Mixed signals',
            poor: '0-1/4: Profitability issues'
          },
          indianContext: 'Check: (1) ROA > 0, (2) OCF > 0, (3) ROA improving, (4) OCF > Net Income (quality)',
          commonMistakes: ['Ignoring OCF vs Net Income gap - accounting profits may not be real cash']
        },
        {
          id: 'f_leverage',
          name: 'Leverage & Liquidity (3 points)',
          description: 'Tests if debt is decreasing and liquidity improving.',
          interpretation: {
            excellent: '3/3: Deleveraging, improving liquidity',
            good: '2/3: Mostly stable',
            fair: '1/3: Some concerns',
            poor: '0/3: Rising debt and/or falling liquidity'
          },
          indianContext: 'Check: (1) LT Debt/Assets down, (2) Current Ratio up, (3) No equity dilution',
          commonMistakes: ['Dilution includes preferential allotments and QIPs common in India']
        },
        {
          id: 'f_efficiency',
          name: 'Operating Efficiency (2 points)',
          description: 'Tests if margins and asset turnover are improving.',
          interpretation: {
            excellent: '2/2: Getting more efficient',
            good: '1/2: Mixed efficiency trend',
            poor: '0/2: Declining efficiency'
          },
          indianContext: 'Check: (1) Gross Margin up YoY, (2) Asset Turnover up YoY',
          commonMistakes: ['Commodity companies have volatile margins - use 3-year average']
        }
      ],
      practicalExample: `Stock XYZ: P/B 0.8 (looks cheap!), F-Score = 3
- Profitability: 2/4 (positive ROA but OCF < Net Income)
- Leverage: 0/3 (debt rising, equity diluted)
- Efficiency: 1/2 (margins flat)
VERDICT: Value trap! Low P/B is justified by weak fundamentals.

Stock ABC: P/B 1.5, F-Score = 8
- All profitability tests pass
- Deleveraging, no dilution
- Margins expanding
VERDICT: Quality value stock, consider buying.`,
      actionableInsights: [
        'F-Score 8-9 + P/B < 1.5 = High conviction buy',
        'Never buy F-Score < 4 regardless of how cheap',
        'Improving F-Score (vs last year) is bullish signal',
        'Combine with Altman Z to avoid bankruptcies'
      ],
      commonQuestions: [
        { q: 'Can high-growth stocks have low F-Score?', a: 'Yes, if theyre burning cash. Growth ≠ quality. Use F-Score to filter.' },
        { q: 'F-Score 9 but stock still falling?', a: 'F-Score measures fundamentals, not sentiment. Be patient or check macro factors.' },
        { q: 'How often to check F-Score?', a: 'Quarterly after results. Annual data works but quarterly catches changes faster.' }
      ],
      nextTools: ['financial-health-dna', 'bankruptcy-health', 'valuation-summary']
    },

    // ─────────────────────────────────────────────────────────────────────
    // LESSON: DCF Valuation
    // ─────────────────────────────────────────────────────────────────────
    {
      toolId: 'dcf-valuation',
      toolName: 'DCF Valuation',
      category: 'value',
      difficulty: 'advanced',
      duration: '12 min',
      summary: 'Calculate what a stock is truly worth by projecting future cash flows and discounting them to today. The gold standard of intrinsic value.',
      whatYouLearn: [
        'How to build a DCF model conceptually',
        'Key assumptions: growth rate, discount rate, terminal value',
        'Sensitivity analysis - what if assumptions change?'
      ],
      whyItMatters: 'Unlike ratios, DCF forces you to think about the future. Its not about precision, but understanding what youre really paying for.',
      metrics: [
        {
          id: 'intrinsic_value',
          name: 'Intrinsic Value',
          formula: 'Sum of discounted future FCFs + Terminal Value',
          description: 'The calculated fair value of the stock based on projected cash flows.',
          interpretation: {
            excellent: 'Stock price < 70% of intrinsic value: Strong margin of safety',
            good: 'Stock price 70-90% of intrinsic: Some upside',
            fair: 'Stock price 90-110% of intrinsic: Fairly valued',
            poor: 'Stock price > 110% of intrinsic: Overvalued'
          },
          indianContext: 'Add 2-3% to discount rate for India risk premium vs developed markets.',
          relatedMetrics: ['fcf', 'wacc', 'growth_rate']
        },
        {
          id: 'discount_rate',
          name: 'Discount Rate (WACC)',
          formula: '(E/V × Re) + (D/V × Rd × (1-T))',
          description: 'The required return that makes investing worthwhile. Higher = more risk = lower valuation.',
          interpretation: {
            excellent: 'WACC 10-12%: Low risk, stable business',
            good: 'WACC 12-14%: Average risk',
            fair: 'WACC 14-16%: Higher risk',
            poor: 'WACC > 16%: Very risky business'
          },
          thresholds: { excellent: 12, good: 14, fair: 16, poor: 18 },
          indianContext: 'Risk-free rate in India ~7% (10Y G-Sec). Equity risk premium 5-6%. Small-cap premium +2-3%.',
          commonMistakes: [
            'Using too low discount rate makes everything look cheap',
            'Ignoring company-specific risk factors'
          ]
        },
        {
          id: 'growth_rate',
          name: 'Growth Rate Assumption',
          description: 'Projected FCF growth rate. Most sensitive input in DCF.',
          interpretation: {
            excellent: '> 15% sustained: Only for exceptional businesses',
            good: '10-15%: Good growth company',
            fair: '5-10%: Mature, stable business',
            poor: '< 5%: Low/no growth, value play'
          },
          indianContext: 'India GDP grows 6-7%. Company growing slower than GDP is losing market share.',
          commonMistakes: [
            'Projecting recent high growth forever (mean reversion)',
            'Growth > 20% for more than 5 years is unrealistic for most'
          ]
        },
        {
          id: 'terminal_value',
          name: 'Terminal Value',
          formula: 'FCF × (1 + g) / (WACC - g)',
          description: 'Value of all cash flows beyond projection period. Often 60-80% of total DCF value.',
          interpretation: {
            excellent: 'Terminal value < 50% of total: Robust valuation',
            fair: 'Terminal value 50-70%: Normal',
            poor: 'Terminal value > 80%: Speculative, depends too much on far future'
          },
          indianContext: 'Use terminal growth 4-5% (nominal GDP growth) for India.',
          commonMistakes: [
            'Terminal growth > WACC makes value infinite (nonsense)',
            'Terminal growth > GDP is unrealistic long-term'
          ]
        },
        {
          id: 'margin_of_safety',
          name: 'Margin of Safety',
          formula: '(Intrinsic Value - Current Price) / Intrinsic Value × 100',
          description: 'Buffer against errors in assumptions. Higher = safer investment.',
          interpretation: {
            excellent: '> 40%: Strong margin, low risk',
            good: '25-40%: Adequate margin',
            fair: '10-25%: Thin margin, be careful',
            poor: '< 10%: Almost no margin, high risk'
          },
          indianContext: 'Buffett suggests 25-30% minimum. For small-caps, demand 40%+.',
          relatedMetrics: ['intrinsic_value', 'current_price']
        }
      ],
      practicalExample: `TCS DCF Example:
- Current FCF: ₹45,000 Cr
- Growth assumption: 12% for 5 years, then 5% terminal
- WACC: 11% (low risk, no debt, strong brand)
- Terminal Value: ₹6,50,000 Cr
- Total Intrinsic Value: ₹8,50,000 Cr
- Per share: ₹2,350
- Current price: ₹3,500
- Margin of Safety: -33% (OVERVALUED)

The DCF suggests TCS is expensive at current prices. Youd need 15%+ growth to justify ₹3,500.`,
      actionableInsights: [
        'Run DCF with bull, base, and bear cases',
        'If stock is cheap in all 3 scenarios, high conviction',
        'Pay attention to sensitivity - small WACC change = big value change',
        'DCF works best for stable, cash-generating businesses'
      ],
      commonQuestions: [
        { q: 'Why do different analysts get different DCF values?', a: 'Different assumptions. Always check growth rate, discount rate, and terminal growth they used.' },
        { q: 'Can I use DCF for loss-making companies?', a: 'Difficult. Use revenue multiple or wait until profitable. DCF needs positive FCF.' },
        { q: 'How accurate is DCF?', a: 'Not precise, but useful for thinking. +/- 20% is normal. Focus on range, not point estimate.' }
      ],
      nextTools: ['intrinsic-value-range', 'fair-value-forecaster', 'fcf-health']
    },

    // ─────────────────────────────────────────────────────────────────────
    // LESSON: DuPont Analysis
    // ─────────────────────────────────────────────────────────────────────
    {
      toolId: 'dupont-analysis',
      toolName: 'DuPont Analysis',
      category: 'value',
      difficulty: 'intermediate',
      duration: '7 min',
      summary: 'Breaks down ROE into three components to understand WHERE returns come from - profit margins, asset efficiency, or leverage.',
      whatYouLearn: [
        'The three drivers of ROE',
        'Why two companies with same ROE can be very different',
        'Spotting unsustainable ROE driven by debt'
      ],
      whyItMatters: 'ROE of 20% from margins is sustainable. ROE of 20% from 5x leverage is risky. DuPont tells you which.',
      metrics: [
        {
          id: 'roe',
          name: 'Return on Equity (ROE)',
          formula: 'Net Income / Shareholders Equity',
          description: 'Overall return generated on shareholder investment.',
          interpretation: {
            excellent: '> 20%: Excellent capital efficiency',
            good: '15-20%: Good returns',
            fair: '10-15%: Average',
            poor: '< 10%: Below cost of equity'
          },
          thresholds: { excellent: 20, good: 15, fair: 10, poor: 5 },
          indianContext: 'Nifty 50 average ROE ~14%. Top companies like TCS, HDFC Bank > 20%.',
          relatedMetrics: ['net_margin', 'asset_turnover', 'equity_multiplier']
        },
        {
          id: 'net_margin',
          name: 'Net Profit Margin',
          formula: 'Net Income / Revenue × 100',
          description: 'How much profit from each rupee of sales. Pricing power indicator.',
          interpretation: {
            excellent: '> 20%: Strong pricing power, moat',
            good: '10-20%: Healthy margins',
            fair: '5-10%: Competitive industry',
            poor: '< 5%: Low margin business'
          },
          thresholds: { excellent: 20, good: 10, fair: 5, poor: 2 },
          indianContext: 'IT: 15-25%. FMCG: 12-18%. Auto: 5-10%. Retail: 2-5%.',
          commonMistakes: ['Low margin ≠ bad business. See D-Mart with 4% margin but high turnover.']
        },
        {
          id: 'asset_turnover',
          name: 'Asset Turnover',
          formula: 'Revenue / Total Assets',
          description: 'How efficiently assets generate revenue. Higher = more efficient.',
          interpretation: {
            excellent: '> 1.5x: Very efficient asset use',
            good: '1-1.5x: Good efficiency',
            fair: '0.5-1x: Capital intensive',
            poor: '< 0.5x: Heavy assets, low turnover'
          },
          thresholds: { excellent: 1.5, good: 1, fair: 0.5, poor: 0.3 },
          indianContext: 'Retail/FMCG: 1.5-3x. IT services: 1-2x. Power/Infra: 0.2-0.5x.',
          commonMistakes: ['Comparing asset turnover across industries is meaningless']
        },
        {
          id: 'equity_multiplier',
          name: 'Equity Multiplier (Leverage)',
          formula: 'Total Assets / Shareholders Equity',
          description: 'How much leverage (debt) boosts returns. Higher = more debt risk.',
          interpretation: {
            excellent: '< 1.5x: Conservative, low debt',
            good: '1.5-2x: Moderate leverage',
            fair: '2-3x: Significant leverage',
            poor: '> 3x: High leverage, risky'
          },
          thresholds: { excellent: 1.5, good: 2, fair: 3, poor: 4 },
          indianContext: 'Banks naturally have high leverage (8-12x). For non-banks, < 2x is healthy.',
          commonMistakes: ['High leverage amplifies both gains AND losses. Fine in good times, deadly in bad.']
        }
      ],
      practicalExample: `Company A vs Company B (both ROE = 20%):

Company A (IT Services):
- Net Margin: 22%
- Asset Turnover: 1.5x
- Leverage: 1.2x
- ROE = 22% × 1.5 × 1.2 = 40% (calculated higher)
- VERDICT: Quality ROE from margins + efficiency

Company B (Real Estate):
- Net Margin: 8%
- Asset Turnover: 0.4x
- Leverage: 6x
- ROE = 8% × 0.4 × 6 = 19.2%
- VERDICT: Risky ROE from leverage. One bad year = big losses.

Same ROE, very different quality!`,
      actionableInsights: [
        'Prefer ROE driven by margins over leverage',
        'Improving margin + stable leverage = best scenario',
        'Watch for ROE increasing ONLY due to rising debt',
        'Asset-light businesses naturally have higher ROE'
      ],
      commonQuestions: [
        { q: 'Is high leverage always bad?', a: 'Not always. Banks need leverage. But for non-financials, prefer < 2x.' },
        { q: 'Why does IT have such high ROE?', a: 'High margins (20%+), good turnover, low assets (people, not factories), minimal debt.' },
        { q: 'ROE declining but margins stable - why?', a: 'Check asset turnover. Maybe company is investing in capacity (temporarily lower turnover).' }
      ],
      nextTools: ['capital-allocation', 'efficiency-dashboard', 'leverage-history']
    },

    // Additional value lessons...
    {
      toolId: 'intrinsic-value-range',
      toolName: 'Intrinsic Value Range',
      category: 'value',
      difficulty: 'intermediate',
      duration: '8 min',
      summary: 'Shows fair value using multiple methods (DCF, Graham, earnings power) with bull/bear scenarios.',
      whatYouLearn: [
        'Why single-point estimates are dangerous',
        'How to triangulate value from multiple methods',
        'Understanding valuation ranges'
      ],
      whyItMatters: 'No single valuation method is perfect. Seeing a range from multiple methods gives you conviction.',
      metrics: [
        {
          id: 'dcf_value',
          name: 'DCF Value',
          description: 'Intrinsic value from discounted cash flow model.',
          interpretation: {
            excellent: 'Price < DCF bear case: Very cheap',
            good: 'Price between bear and base: Attractive',
            fair: 'Price at base case: Fair',
            poor: 'Price above bull case: Expensive'
          }
        },
        {
          id: 'graham_number',
          name: 'Graham Number',
          formula: '√(22.5 × EPS × BVPS)',
          description: 'Benjamin Grahams formula for maximum price to pay for value stocks.',
          interpretation: {
            excellent: 'Price < Graham Number: Classic value buy',
            fair: 'Price near Graham: Fairly valued',
            poor: 'Price > 1.5x Graham: Not a value stock'
          },
          indianContext: 'Works well for PSU banks, commodity companies. Less useful for growth stocks.',
          commonMistakes: ['Graham Number was designed for 1970s. Use as one input, not gospel.']
        },
        {
          id: 'earnings_power_value',
          name: 'Earnings Power Value (EPV)',
          formula: 'Normalized EBIT × (1 - Tax) / WACC',
          description: 'Value assuming zero growth. Floor value for mature businesses.',
          interpretation: {
            excellent: 'Price < EPV: Paying nothing for growth',
            good: 'Price = EPV: Getting growth free',
            fair: 'Price > EPV: Paying for growth',
            poor: 'Price >> EPV: Speculative growth premium'
          }
        },
        {
          id: 'relative_value',
          name: 'Relative Valuation',
          description: 'Fair value based on sector average multiples.',
          interpretation: {
            excellent: 'Trading at 30%+ discount to peers',
            good: '10-30% discount',
            fair: 'In line with peers',
            poor: 'Premium to peers without justification'
          }
        }
      ],
      practicalExample: `Stock XYZ Analysis:
- DCF Base: ₹450, Bear: ₹350, Bull: ₹600
- Graham Number: ₹380
- EPV: ₹320
- Peer Average implies: ₹420
- Current Price: ₹300

Multiple methods suggest ₹350-450 fair value. At ₹300, youre getting 15-35% margin of safety. Strong buy!`,
      actionableInsights: [
        'Buy when price is below LOWEST estimate (max safety)',
        'If methods disagree wildly, understand why before investing',
        'EPV is your floor - if price < EPV, growth is free'
      ],
      commonQuestions: [
        { q: 'Which valuation method is best?', a: 'DCF for growth, Graham for value, EPV for mature. Use all three.' },
        { q: 'What if all methods say its cheap but stock keeps falling?', a: 'Check if fundamentals are deteriorating. Cheap can get cheaper.' }
      ],
      nextTools: ['dcf-valuation', 'fair-value-forecaster', 'piotroski-score']
    },

    {
      toolId: 'fair-value-forecaster',
      toolName: 'Fair Value Forecaster',
      category: 'value',
      difficulty: 'intermediate',
      duration: '6 min',
      summary: 'Projects fair value 1-3 years ahead based on expected earnings growth and target multiples.',
      whatYouLearn: [
        'Forward-looking valuation vs historical',
        'How analyst estimates affect fair value',
        'Price target calculation'
      ],
      whyItMatters: 'Markets price the future, not the past. This tool helps you see what youre really betting on.',
      metrics: [
        {
          id: 'forward_pe',
          name: 'Forward P/E',
          formula: 'Current Price / Next Year EPS Estimate',
          description: 'Valuation based on future earnings, not trailing.',
          interpretation: {
            excellent: 'Forward P/E < 12: Cheap on future earnings',
            good: 'Forward P/E 12-18: Reasonable',
            fair: 'Forward P/E 18-25: Growth premium',
            poor: 'Forward P/E > 25: High expectations'
          },
          indianContext: 'Nifty 50 forward P/E typically 16-20x.',
          commonMistakes: ['Analyst estimates are often wrong. Check estimate revision trends.']
        },
        {
          id: 'estimated_fair_value',
          name: 'Estimated Fair Value',
          formula: 'Target P/E × Forward EPS',
          description: 'Projected price based on expected earnings and multiple.',
          interpretation: {
            excellent: '> 50% upside to fair value',
            good: '20-50% upside',
            fair: '0-20% upside',
            poor: 'Downside to fair value'
          }
        },
        {
          id: 'estimate_revisions',
          name: 'Estimate Revisions',
          description: 'Are analysts raising or lowering estimates?',
          interpretation: {
            excellent: 'Estimates rising: Positive momentum',
            fair: 'Estimates stable: In line',
            poor: 'Estimates falling: Negative surprises ahead'
          },
          indianContext: 'Post-quarterly results, watch for estimate changes. Upgrades often precede price moves.',
          commonMistakes: ['Dont buy just because estimates rose. Check if price already reflects it.']
        }
      ],
      actionableInsights: [
        'Rising estimates + falling price = potential opportunity',
        'Forward P/E < trailing P/E means growth expected',
        'Check analyst track record before trusting estimates'
      ],
      commonQuestions: [
        { q: 'How reliable are analyst estimates?', a: 'On average, off by 10-20%. Use as directional guide, not precise target.' },
        { q: 'Forward P/E lower than trailing - good sign?', a: 'Yes, implies earnings growth expected. But verify the growth assumption.' }
      ],
      nextTools: ['earnings-calendar', 'earnings-surprise', 'growth-summary']
    },

    {
      toolId: 'financial-health-dna',
      toolName: 'Financial Health DNA',
      category: 'value',
      difficulty: 'intermediate',
      duration: '8 min',
      summary: 'Comprehensive financial health scoring across profitability, solvency, liquidity, and efficiency.',
      whatYouLearn: [
        'Multi-dimensional health assessment',
        'Early warning signs of financial stress',
        'Balance sheet quality indicators'
      ],
      whyItMatters: 'A company can look profitable but be financially fragile. DNA analysis catches hidden problems.',
      metrics: [
        {
          id: 'health_score',
          name: 'Overall Health Score',
          description: 'Composite score across all dimensions.',
          interpretation: {
            excellent: '80-100: Excellent health, fortress balance sheet',
            good: '60-80: Good health, minor concerns',
            fair: '40-60: Average, needs monitoring',
            poor: '20-40: Weak health, significant risks',
            dangerous: '< 20: Distressed, avoid'
          }
        },
        {
          id: 'interest_coverage',
          name: 'Interest Coverage Ratio',
          formula: 'EBIT / Interest Expense',
          description: 'How many times earnings cover interest payments.',
          interpretation: {
            excellent: '> 8x: Very comfortable',
            good: '4-8x: Healthy coverage',
            fair: '2-4x: Adequate but tight',
            poor: '1-2x: Risky, barely covering',
            dangerous: '< 1x: Cannot cover interest from operations'
          },
          thresholds: { excellent: 8, good: 4, fair: 2, poor: 1 },
          indianContext: 'Infrastructure companies often have 1.5-2.5x. IT companies often dont have interest expense.',
          commonMistakes: ['Check if interest is capitalized (hidden in balance sheet, not P&L).']
        },
        {
          id: 'current_ratio',
          name: 'Current Ratio',
          formula: 'Current Assets / Current Liabilities',
          description: 'Short-term liquidity. Can the company pay bills?',
          interpretation: {
            excellent: '> 2.0: Very liquid',
            good: '1.5-2.0: Comfortable',
            fair: '1.0-1.5: Adequate',
            poor: '< 1.0: Liquidity stress'
          },
          thresholds: { excellent: 2, good: 1.5, fair: 1, poor: 0.8 },
          indianContext: 'Working capital intensive sectors (auto, textile) need higher ratios.',
          relatedMetrics: ['quick_ratio', 'cash_ratio']
        },
        {
          id: 'debt_to_equity',
          name: 'Debt-to-Equity Ratio',
          formula: 'Total Debt / Shareholders Equity',
          description: 'Financial leverage. How much debt vs owner capital.',
          interpretation: {
            excellent: '< 0.3: Very conservative',
            good: '0.3-0.7: Moderate leverage',
            fair: '0.7-1.5: Significant leverage',
            poor: '> 1.5: High leverage, risky'
          },
          thresholds: { excellent: 0.3, good: 0.7, fair: 1.5, poor: 2 },
          indianContext: 'Exclude banks/NBFCs. For them, use CAR (Capital Adequacy Ratio) instead.',
          commonMistakes: ['Lease liabilities now count as debt under Ind-AS 116. Check for off-balance sheet leases.']
        }
      ],
      actionableInsights: [
        'Health Score < 40 = automatic avoid regardless of valuation',
        'Interest coverage falling quarter-over-quarter = red flag',
        'Current ratio < 1 for 2+ quarters = liquidity crisis brewing'
      ],
      commonQuestions: [
        { q: 'Can a profitable company have poor health score?', a: 'Yes! High debt, poor cash conversion, or liquidity issues can hurt health despite profits.' },
        { q: 'My stock has D/E 1.5 - should I sell?', a: 'Depends on industry. Infra/power often has high D/E. Check interest coverage more importantly.' }
      ],
      nextTools: ['bankruptcy-health', 'leverage-history', 'working-capital-health']
    },

    {
      toolId: 'multi-factor-scorecard',
      toolName: 'Multi-Factor Scorecard',
      category: 'value',
      difficulty: 'advanced',
      duration: '10 min',
      summary: 'Combines value, quality, momentum, and growth factors into one composite score for systematic stock selection.',
      whatYouLearn: [
        'Factor investing fundamentals',
        'How different factors work in different markets',
        'Building a multi-factor strategy'
      ],
      whyItMatters: 'Single factors go in and out of favor. Combining them smooths returns and reduces risk.',
      metrics: [
        {
          id: 'value_factor',
          name: 'Value Factor Score',
          description: 'Composite of P/E, P/B, EV/EBITDA relative to peers.',
          interpretation: {
            excellent: '> 80: Deep value',
            good: '60-80: Attractive value',
            fair: '40-60: Fair value',
            poor: '< 40: Expensive'
          }
        },
        {
          id: 'quality_factor',
          name: 'Quality Factor Score',
          description: 'ROE, margin stability, earnings quality, low leverage.',
          interpretation: {
            excellent: '> 80: High quality business',
            good: '60-80: Good quality',
            fair: '40-60: Average',
            poor: '< 40: Low quality'
          }
        },
        {
          id: 'momentum_factor',
          name: 'Momentum Factor Score',
          description: '6-12 month price momentum relative to market.',
          interpretation: {
            excellent: '> 80: Strong momentum',
            good: '60-80: Positive momentum',
            fair: '40-60: Neutral',
            poor: '< 40: Negative momentum'
          }
        },
        {
          id: 'growth_factor',
          name: 'Growth Factor Score',
          description: 'Revenue, earnings, FCF growth rates.',
          interpretation: {
            excellent: '> 80: High growth',
            good: '60-80: Good growth',
            fair: '40-60: Moderate',
            poor: '< 40: Low/negative growth'
          }
        },
        {
          id: 'composite_score',
          name: 'Composite Score',
          description: 'Weighted average of all factors.',
          interpretation: {
            excellent: '> 75: Top quartile, strong candidate',
            good: '60-75: Above average',
            fair: '40-60: Average',
            poor: '< 40: Below average, avoid'
          }
        }
      ],
      actionableInsights: [
        'Composite > 70 in all factors = rare, high conviction',
        'Value + Quality = "Quality at Reasonable Price" strategy',
        'Avoid stocks with < 40 in any single factor'
      ],
      commonQuestions: [
        { q: 'Which factor is most important?', a: 'Quality over long term, Momentum short term, Value in bear markets.' },
        { q: 'Can I have high value and high momentum?', a: 'Rare but possible - usually after a quality company has a temporary setback.' }
      ],
      nextTools: ['factor-tilt-mini', 'peer-comparison', 'growth-summary']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 2: GROWTH & QUALITY ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

export const growthModule: ModuleDefinition = {
  id: 'growth',
  name: 'Growth & Quality',
  icon: '📈',
  description: 'Evaluate earnings quality, management effectiveness, capital allocation, and sustainable growth.',
  prerequisites: ['value'],
  learningOutcomes: [
    'Identify high-quality growth stocks',
    'Detect earnings manipulation red flags',
    'Evaluate management quality and governance',
    'Understand capital allocation decisions'
  ],
  lessons: [
    {
      toolId: 'growth-summary',
      toolName: 'Growth Summary',
      category: 'growth',
      difficulty: 'beginner',
      duration: '6 min',
      summary: 'Quick view of revenue, earnings, and cash flow growth across multiple timeframes.',
      whatYouLearn: [
        'Reading CAGR (compound annual growth rate)',
        'Comparing historical vs forward growth',
        'Growth consistency metrics'
      ],
      whyItMatters: 'Growth is the primary driver of stock returns. But sustainable growth matters more than flashy numbers.',
      metrics: [
        {
          id: 'revenue_cagr_3y',
          name: 'Revenue CAGR (3Y)',
          formula: '((Revenue_current / Revenue_3yr_ago)^(1/3) - 1) × 100',
          description: 'Annualized revenue growth over 3 years.',
          interpretation: {
            excellent: '> 20%: High growth',
            good: '10-20%: Good growth',
            fair: '5-10%: Moderate',
            poor: '< 5%: Slow growth'
          },
          thresholds: { excellent: 20, good: 10, fair: 5, poor: 0 },
          indianContext: 'India GDP nominal growth ~10-12%. Growing slower than this = losing market share.',
          relatedMetrics: ['eps_cagr', 'fcf_cagr']
        },
        {
          id: 'eps_cagr_3y',
          name: 'EPS CAGR (3Y)',
          formula: '((EPS_current / EPS_3yr_ago)^(1/3) - 1) × 100',
          description: 'Annualized earnings per share growth.',
          interpretation: {
            excellent: '> 25%: Exceptional',
            good: '15-25%: Strong',
            fair: '5-15%: Moderate',
            poor: '< 5%: Weak'
          },
          indianContext: 'EPS growth > revenue growth suggests margin expansion (good sign).',
          commonMistakes: ['EPS can be boosted by buybacks. Check revenue growth too.']
        },
        {
          id: 'fcf_cagr_3y',
          name: 'FCF CAGR (3Y)',
          description: 'Free cash flow growth. The real test of growth quality.',
          interpretation: {
            excellent: '> 20%: Healthy cash generation',
            good: '10-20%: Good',
            fair: '0-10%: Moderate',
            poor: '< 0%: Cash burning'
          },
          indianContext: 'If EPS grows but FCF doesnt, earnings quality is suspect.',
          relatedMetrics: ['ocf_growth', 'capex_to_revenue']
        },
        {
          id: 'growth_score',
          name: 'Growth Score',
          description: 'Composite growth rating.',
          interpretation: {
            excellent: '> 75: High growth star',
            good: '50-75: Good grower',
            fair: '25-50: Moderate',
            poor: '< 25: Low growth'
          }
        }
      ],
      actionableInsights: [
        'EPS growth > Revenue growth = margin expansion, bullish',
        'FCF growth lagging EPS growth = quality concern',
        'Forward estimates higher than historical = optimistic, verify'
      ],
      commonQuestions: [
        { q: 'Revenue flat but EPS growing - is that good?', a: 'Short-term yes (cost cuts). Long-term no - need revenue growth for sustainable EPS growth.' },
        { q: 'High growth but negative FCF?', a: 'Common for young companies investing heavily. Check if investments generate returns.' }
      ],
      nextTools: ['earnings-stability', 'earnings-quality', 'capital-allocation']
    },

    {
      toolId: 'earnings-quality',
      toolName: 'Earnings Quality',
      category: 'growth',
      difficulty: 'intermediate',
      duration: '8 min',
      summary: 'Detect if reported earnings are real and sustainable or inflated through accounting tricks.',
      whatYouLearn: [
        'Accruals-based earnings manipulation detection',
        'Cash flow vs reported earnings comparison',
        'Beneish M-Score for fraud detection'
      ],
      whyItMatters: 'Companies can manipulate earnings for years before getting caught. This tool is your fraud detector.',
      metrics: [
        {
          id: 'quality_score',
          name: 'Quality Score',
          description: 'Overall earnings quality rating.',
          interpretation: {
            excellent: '> 80: High quality, trustworthy earnings',
            good: '60-80: Good quality',
            fair: '40-60: Average, some concerns',
            poor: '< 40: Low quality, manipulation risk'
          }
        },
        {
          id: 'accruals_ratio',
          name: 'Accruals Ratio',
          formula: '(Net Income - Operating Cash Flow) / Total Assets',
          description: 'Measures how much of earnings is real cash vs accounting adjustments.',
          interpretation: {
            excellent: '< 5%: Earnings backed by cash',
            good: '5-10%: Normal accruals',
            fair: '10-20%: Elevated, investigate',
            poor: '> 20%: High accruals, red flag'
          },
          thresholds: { excellent: 0.05, good: 0.1, fair: 0.2, poor: 0.3 },
          indianContext: 'Real estate, construction often have high accruals (project-based recognition).',
          commonMistakes: ['Not all accruals are bad. Rapid growth creates legitimate accruals.']
        },
        {
          id: 'cash_conversion',
          name: 'Cash Earnings Ratio',
          formula: 'Operating Cash Flow / Net Income × 100',
          description: 'How much of reported earnings converts to actual cash.',
          interpretation: {
            excellent: '> 120%: More cash than earnings, excellent',
            good: '80-120%: Healthy conversion',
            fair: '50-80%: Below par',
            poor: '< 50%: Poor conversion, investigate'
          },
          thresholds: { excellent: 1.2, good: 0.8, fair: 0.5, poor: 0.3 },
          indianContext: 'Consistently < 70% is warning sign. Check receivables and inventory.',
          relatedMetrics: ['receivable_days', 'inventory_days']
        },
        {
          id: 'beneish_m_score',
          name: 'Beneish M-Score',
          description: 'Academic model detecting earnings manipulation. Uses 8 financial ratios.',
          interpretation: {
            excellent: 'M < -2.5: Low manipulation probability',
            good: 'M -2.5 to -2.0: Some concern',
            fair: 'M -2.0 to -1.5: Elevated risk',
            dangerous: 'M > -1.5: High manipulation probability'
          },
          indianContext: 'Satyam scandal had M-Score > -1.5 years before collapse.',
          commonMistakes: ['M-Score has false positives. Use as screening, not conviction.']
        },
        {
          id: 'revenue_recognition',
          name: 'Revenue Recognition Risk',
          description: 'Are revenues being recognized prematurely?',
          interpretation: {
            excellent: 'Deferred revenue growing: Conservative',
            fair: 'Receivables growth < Revenue growth: Normal',
            poor: 'Receivables >> Revenue growth: Stuffing channels'
          },
          indianContext: 'Software companies should have growing deferred revenue. Absence is concern.'
        }
      ],
      practicalExample: `Company Red Flags Analysis:
- Net Income: ₹500 Cr
- Operating Cash Flow: ₹200 Cr
- Cash Conversion: 40% (Poor!)
- Receivables jumped 60% while revenue grew 15%
- Beneish M-Score: -1.3 (Danger zone)

VERDICT: High manipulation risk. Earnings likely inflated by premature revenue recognition. Avoid!`,
      actionableInsights: [
        'OCF/Net Income < 70% for 3+ years = serious quality issue',
        'Beneish M > -1.78 flagged 76% of frauds in studies',
        'Rising receivables + falling cash flow = classic manipulation',
        'Compare with peers - outlier quality metrics are suspect'
      ],
      commonQuestions: [
        { q: 'Why would a company manipulate earnings?', a: 'Meet analyst expectations, boost stock price, management bonuses, hide problems.' },
        { q: 'Can audited financials still be manipulated?', a: 'Yes. Auditors often miss fraud. Satyam, Enron, Wirecard were all audited.' },
        { q: 'Low quality score but stock doing well?', a: 'Manipulation can work for years. Eventually truth emerges. Dont be the last holder.' }
      ],
      nextTools: ['profit-vs-cash-divergence', 'sales-profit-cash', 'fcf-health']
    },

    {
      toolId: 'earnings-stability',
      toolName: 'Earnings Stability',
      category: 'growth',
      difficulty: 'intermediate',
      duration: '6 min',
      summary: 'Measures how predictable and consistent earnings are over time.',
      whatYouLearn: [
        'Earnings volatility and predictability',
        'Beat/miss patterns',
        'Why consistency matters for valuation'
      ],
      whyItMatters: 'Stable earners deserve premium valuations. Volatile earners are riskier and harder to value.',
      metrics: [
        {
          id: 'stability_score',
          name: 'Stability Score',
          description: 'Overall earnings consistency rating.',
          interpretation: {
            excellent: '> 80: Very stable, predictable',
            good: '60-80: Reasonably stable',
            fair: '40-60: Moderate volatility',
            poor: '< 40: Highly volatile, cyclical'
          }
        },
        {
          id: 'eps_volatility',
          name: 'EPS Volatility',
          description: 'Standard deviation of EPS growth rates.',
          interpretation: {
            excellent: '< 10%: Very stable',
            good: '10-20%: Normal volatility',
            fair: '20-35%: Above average',
            poor: '> 35%: Highly volatile'
          },
          indianContext: 'FMCG: 5-15%. IT: 10-20%. Metals: 40-60%.'
        },
        {
          id: 'beat_rate',
          name: 'Analyst Beat Rate',
          formula: 'Quarters beating estimates / Total quarters × 100',
          description: 'How often company beats analyst expectations.',
          interpretation: {
            excellent: '> 80%: Consistent beater',
            good: '60-80%: Usually beats',
            fair: '40-60%: In line',
            poor: '< 40%: Frequent misses'
          },
          indianContext: 'Quality managements guide conservatively and beat. Watch for sandbagging.'
        },
        {
          id: 'growth_streak',
          name: 'Consecutive Growth Years',
          description: 'Years of uninterrupted EPS growth.',
          interpretation: {
            excellent: '> 10 years: Rare consistency',
            good: '5-10 years: Solid track record',
            fair: '3-5 years: Moderate',
            poor: '< 3 years: Limited history'
          },
          indianContext: 'Asian Paints, Pidilite have 15+ year streaks. Very rare in India.'
        }
      ],
      actionableInsights: [
        'Stability Score > 75 deserves 10-20% P/E premium',
        'Breaking a long growth streak is major negative signal',
        'Volatile earners: wait to buy at cycle trough',
        'High beat rate + low estimates = sandbagging (often positive)'
      ],
      commonQuestions: [
        { q: 'Is volatility always bad?', a: 'Not always. Cyclicals like Tata Steel are volatile but can be great buys at cycle bottom.' },
        { q: 'Stock missed estimates but went up - why?', a: 'Quality of miss matters. Slight miss with strong guidance beats modest beat with weak guidance.' }
      ],
      nextTools: ['earnings-surprise', 'earnings-quality', 'growth-summary']
    },

    {
      toolId: 'management-quality',
      toolName: 'Management Quality',
      category: 'growth',
      difficulty: 'intermediate',
      duration: '8 min',
      summary: 'Evaluate promoter holding, insider activity, governance standards, and capital allocation track record.',
      whatYouLearn: [
        'Reading promoter holding and pledging patterns',
        'Insider buying/selling signals',
        'Red flags in governance'
      ],
      whyItMatters: 'Great business + bad management = bad investment. Management quality separates multibaggers from value traps.',
      metrics: [
        {
          id: 'promoter_holding',
          name: 'Promoter Holding %',
          description: 'Percentage of company owned by promoters/founders.',
          interpretation: {
            excellent: '> 60%: High skin in game',
            good: '50-60%: Good alignment',
            fair: '40-50%: Moderate',
            poor: '< 40%: Low alignment'
          },
          thresholds: { excellent: 60, good: 50, fair: 40, poor: 30 },
          indianContext: 'MNCs often have 50-75%. Promoter-driven companies 45-75%. Low holding can mean dispersed ownership (not always bad).',
          commonMistakes: ['Low holding in widely held companies (HDFC Bank) is fine. Context matters.']
        },
        {
          id: 'promoter_pledge',
          name: 'Promoter Pledge %',
          description: 'Percentage of promoter shares pledged as collateral for loans.',
          interpretation: {
            excellent: '0%: No pledge, clean',
            good: '< 10%: Minimal pledge',
            fair: '10-30%: Elevated, monitor',
            poor: '> 30%: High risk, avoid',
            dangerous: '> 50%: Serious stress, likely value trap'
          },
          thresholds: { excellent: 0, good: 10, fair: 30, poor: 50 },
          indianContext: 'Promoters pledge to raise personal loans. Stock fall can trigger forced selling (death spiral).',
          relatedMetrics: ['promoter_holding'],
          commonMistakes: ['Even small pledge can spiral. Zee, Yes Bank, DHFL were destroyed by pledge cycles.']
        },
        {
          id: 'insider_sentiment',
          name: 'Insider Activity',
          description: 'Net buying or selling by insiders (promoters, directors, executives).',
          interpretation: {
            excellent: 'Net buying > 1% of salary: Strong bullish signal',
            good: 'Net buying > 0: Positive',
            fair: 'Neutral: No signal',
            poor: 'Net selling: Could be concerning'
          },
          indianContext: 'Promoter buying at market prices is very bullish. Selling for personal reasons is often benign.',
          commonMistakes: ['ESOP exercises look like selling but arent bearish. Check actual open market sales.']
        },
        {
          id: 'board_independence',
          name: 'Board Independence %',
          description: 'Percentage of independent directors on board.',
          interpretation: {
            excellent: '> 60%: Strong governance',
            good: '50-60%: Meets requirements',
            fair: '33-50%: Minimum compliance',
            poor: '< 33%: Governance concern'
          },
          indianContext: 'SEBI requires 50% for top companies. Quality boards have diverse, independent oversight.'
        },
        {
          id: 'related_party_transactions',
          name: 'Related Party Transactions',
          description: 'Deals between company and promoter-linked entities.',
          interpretation: {
            excellent: 'Minimal RPTs, arms length',
            good: 'Moderate RPTs, disclosed',
            fair: 'High RPTs, questionable',
            dangerous: 'Material RPTs with unclear terms'
          },
          indianContext: 'RPTs can be used to siphon money. Check if pricing is market-rate. Large RPTs = red flag.'
        }
      ],
      practicalExample: `Company Analysis:
- Promoter Holding: 55% ✓ Good
- Promoter Pledge: 35% ✗ Warning
- Board Independence: 45% ~ Okay
- Related Party: ₹200 Cr (5% of revenue) to promoter company
- Insider Activity: CFO sold ₹5 Cr last quarter

VERDICT: Mixed. High pledge is concerning. RPT needs scrutiny. CFO selling is minor but watch for more.`,
      actionableInsights: [
        'Pledge > 30% = automatic avoid regardless of other factors',
        'Promoter buying on open market is strongest bullish signal',
        'High RPT + weak board = recipe for minority shareholder exploitation',
        'Watch for pledge CHANGES, not just levels'
      ],
      commonQuestions: [
        { q: 'Why do promoters pledge shares?', a: 'To raise loans without selling (maintain control). But creates margin call risk.' },
        { q: 'Insider sold - should I sell?', a: 'Context matters. Selling for personal needs (house, charity) is fine. Selling before bad news is concerning.' },
        { q: 'Promoter holding falling - is that bad?', a: 'Depends why. Private equity exit is fine. Pledge invocation is terrible. Check reason.' }
      ],
      nextTools: ['shareholding-pattern', 'insider-trades', 'capital-allocation']
    },

    {
      toolId: 'capital-allocation',
      toolName: 'Capital Allocation',
      category: 'growth',
      difficulty: 'advanced',
      duration: '10 min',
      summary: 'Evaluate how effectively management deploys capital - the key differentiator of great companies.',
      whatYouLearn: [
        'ROIC vs WACC framework',
        'Reinvestment rate and growth potential',
        'Capital allocation decisions: dividends, buybacks, M&A'
      ],
      whyItMatters: 'Generating returns above cost of capital is the only way to create value. ROIC is the ultimate measure.',
      metrics: [
        {
          id: 'roic',
          name: 'Return on Invested Capital (ROIC)',
          formula: 'NOPAT / (Equity + Debt - Cash)',
          description: 'Return generated on all capital invested in the business.',
          interpretation: {
            excellent: '> 20%: Exceptional, competitive moat',
            good: '15-20%: Strong returns',
            fair: '10-15%: Above cost of capital',
            poor: '< 10%: Destroying value'
          },
          thresholds: { excellent: 20, good: 15, fair: 10, poor: 8 },
          indianContext: 'Cost of capital in India ~12%. ROIC must exceed this to create value.',
          relatedMetrics: ['wacc', 'roe', 'roce'],
          commonMistakes: ['High ROE from leverage ≠ high ROIC. ROIC captures true operational efficiency.']
        },
        {
          id: 'roic_wacc_spread',
          name: 'ROIC-WACC Spread',
          formula: 'ROIC - WACC',
          description: 'Excess return over cost of capital. Positive = value creation.',
          interpretation: {
            excellent: '> 10%: Significant value creation',
            good: '5-10%: Healthy spread',
            fair: '0-5%: Marginal value creation',
            poor: '< 0%: Value destruction'
          },
          indianContext: 'Positive spread compounds over time. TCS with ROIC 50%+ vs WACC 11% is why its valued highly.'
        },
        {
          id: 'reinvestment_rate',
          name: 'Reinvestment Rate',
          formula: '(CapEx + Working Capital Change - Depreciation) / NOPAT',
          description: 'Percentage of earnings reinvested for growth.',
          interpretation: {
            excellent: '30-70%: Balanced growth + returns',
            good: '70-100%: Growth focused',
            fair: '< 30%: Mature, high dividends',
            poor: '> 100%: Diluting shareholders'
          },
          indianContext: 'Growth companies reinvest 50-80%. Mature companies 20-40%.'
        },
        {
          id: 'acquisition_returns',
          name: 'M&A Track Record',
          description: 'Historical success of acquisitions.',
          interpretation: {
            excellent: 'Accretive acquisitions, integrated well',
            good: 'Mixed record, some wins',
            fair: 'Neutral impact',
            poor: 'Value-destroying acquisitions'
          },
          indianContext: 'Tata Steel-Corus was disaster. TCS acquisitions have been successful. Track record matters.'
        }
      ],
      actionableInsights: [
        'ROIC > 15% for 5+ years indicates durable moat',
        'ROIC declining = moat erosion, investigate',
        'High reinvestment + high ROIC = compounding machine',
        'Buybacks at high valuations destroy value'
      ],
      commonQuestions: [
        { q: 'ROIC vs ROE - which is better?', a: 'ROIC. ROE can be inflated by debt. ROIC measures true operational returns.' },
        { q: 'Why do some companies with low ROIC still do well?', a: 'ROIC can improve. Turnarounds that expand ROIC see massive rerating.' },
        { q: 'High ROIC but low growth - good investment?', a: 'Can be. Generates lots of cash for dividends/buybacks. Value stock, not growth.' }
      ],
      nextTools: ['dupont-analysis', 'efficiency-dashboard', 'fcf-health']
    },

    {
      toolId: 'efficiency-dashboard',
      toolName: 'Efficiency Dashboard',
      category: 'growth',
      difficulty: 'intermediate',
      duration: '7 min',
      summary: 'Track operating margins, asset turnover, and working capital efficiency.',
      whatYouLearn: [
        'Operating vs net margin trends',
        'Working capital cycle management',
        'Asset efficiency metrics'
      ],
      whyItMatters: 'Efficiency improvements drop straight to bottom line. Small efficiency gains compound into massive value.',
      metrics: [
        {
          id: 'operating_margin',
          name: 'Operating Margin',
          formula: 'Operating Profit / Revenue × 100',
          description: 'Profitability from core operations before interest and taxes.',
          interpretation: {
            excellent: '> 25%: Exceptional pricing power',
            good: '15-25%: Strong margins',
            fair: '8-15%: Average',
            poor: '< 8%: Thin margins'
          },
          indianContext: 'IT: 20-30%. FMCG: 18-25%. Auto: 8-15%. Retail: 4-8%.'
        },
        {
          id: 'gross_margin',
          name: 'Gross Margin',
          formula: '(Revenue - COGS) / Revenue × 100',
          description: 'Direct profitability before operating expenses.',
          interpretation: {
            excellent: '> 50%: High value-add business',
            good: '30-50%: Decent margin',
            fair: '15-30%: Competitive',
            poor: '< 15%: Commodity business'
          }
        },
        {
          id: 'working_capital_days',
          name: 'Working Capital Days',
          formula: 'Receivable Days + Inventory Days - Payable Days',
          description: 'Cash locked in operations. Lower = more efficient.',
          interpretation: {
            excellent: '< 30 days: Very efficient',
            good: '30-60 days: Good',
            fair: '60-90 days: Average',
            poor: '> 90 days: Capital intensive'
          },
          indianContext: 'D-Mart has negative WC days (gets paid before paying suppliers). Rare and valuable.'
        },
        {
          id: 'fixed_asset_turnover',
          name: 'Fixed Asset Turnover',
          formula: 'Revenue / Net Fixed Assets',
          description: 'How efficiently fixed assets generate revenue.',
          interpretation: {
            excellent: '> 3x: Asset-light',
            good: '2-3x: Efficient',
            fair: '1-2x: Capital intensive',
            poor: '< 1x: Heavy assets'
          }
        }
      ],
      actionableInsights: [
        'Margin expansion + revenue growth = double boost to earnings',
        'Working capital spike often precedes cash flow problems',
        'Compare efficiency to closest peers, not broad market'
      ],
      commonQuestions: [
        { q: 'Gross margin stable but OPM falling - why?', a: 'Operating expenses (employee costs, marketing) rising faster than revenue. Cost control issue.' },
        { q: 'Working capital days increasing - bad?', a: 'Usually yes. Could mean receivables stuck or inventory building. Investigate.' }
      ],
      nextTools: ['cash-conversion-cycle', 'working-capital-health', 'profit-vs-cash-divergence']
    },

    {
      toolId: 'profit-vs-cash-divergence',
      toolName: 'Profit vs Cash Divergence',
      category: 'growth',
      difficulty: 'intermediate',
      duration: '6 min',
      summary: 'Detect when reported profits dont match actual cash generation - a key red flag.',
      whatYouLearn: [
        'Why profits and cash can diverge',
        'Warning signs of aggressive accounting',
        'Cash flow quality assessment'
      ],
      whyItMatters: 'Profits are an opinion, cash is a fact. Divergence often precedes negative surprises.',
      metrics: [
        {
          id: 'divergence_score',
          name: 'Divergence Score',
          description: 'Gap between accounting profit and operating cash flow.',
          interpretation: {
            excellent: 'OCF > PAT consistently: Strong quality',
            good: 'OCF ≈ PAT: Normal',
            fair: 'OCF < PAT occasionally: Investigate',
            poor: 'OCF << PAT consistently: Red flag'
          }
        },
        {
          id: 'cumulative_gap',
          name: 'Cumulative Profit-Cash Gap',
          formula: '3Y Net Income - 3Y Operating Cash Flow',
          description: 'Total gap over 3 years. Accumulation is concerning.',
          interpretation: {
            excellent: 'Negative gap: Cash > Profit',
            fair: 'Gap < 20% of profit: Normal',
            poor: 'Gap > 20% of profit: Quality issue',
            dangerous: 'Gap > 50% of profit: Major red flag'
          },
          indianContext: 'Consistent gaps in Indian companies often relate to receivables/inventory.'
        }
      ],
      actionableInsights: [
        'Persistent gap > 3 quarters = avoid the stock',
        'Sudden gap spike often precedes earnings miss',
        'Check receivables and inventory for gap causes'
      ],
      commonQuestions: [
        { q: 'Profit up but cash down - explain?', a: 'Revenue recognized but not collected (receivables up), or inventory building, or capex heavy.' },
        { q: 'Is negative divergence always good?', a: 'Mostly yes (more cash than profit). But check if its from delaying payments (unsustainable).' }
      ],
      nextTools: ['earnings-quality', 'cash-conversion-earnings', 'fcf-health']
    },

    {
      toolId: 'sales-profit-cash',
      toolName: 'Sales-Profit-Cash Alignment',
      category: 'growth',
      difficulty: 'advanced',
      duration: '8 min',
      summary: 'Track the flow from revenue to profit to cash - identifying where value leaks.',
      whatYouLearn: [
        'Revenue to profit conversion',
        'Profit to cash conversion',
        'Finding efficiency bottlenecks'
      ],
      whyItMatters: 'High sales mean nothing if profit leaks away. High profit means nothing if cash doesnt follow.',
      metrics: [
        {
          id: 'profit_conversion',
          name: 'Profit Conversion %',
          formula: 'PAT / Revenue × 100',
          description: 'What percentage of sales becomes profit.',
          interpretation: {
            excellent: '> 20%: Exceptional conversion',
            good: '10-20%: Good',
            fair: '5-10%: Average',
            poor: '< 5%: Low conversion'
          }
        },
        {
          id: 'cash_conversion_efficiency',
          name: 'Cash Conversion Efficiency',
          formula: 'OCF / PAT × 100',
          description: 'How much profit turns into cash.',
          interpretation: {
            excellent: '> 100%: More cash than profit',
            good: '80-100%: Healthy',
            fair: '60-80%: Below par',
            poor: '< 60%: Poor conversion'
          }
        },
        {
          id: 'alignment_score',
          name: 'S-P-C Alignment Score',
          description: 'Composite score of sales-profit-cash alignment.',
          interpretation: {
            excellent: '> 80: All three growing aligned',
            good: '60-80: Mostly aligned',
            fair: '40-60: Some misalignment',
            poor: '< 40: Significant disconnect'
          }
        }
      ],
      actionableInsights: [
        'Sales up, profit flat = cost problem',
        'Profit up, cash flat = working capital problem',
        'All three aligned = high quality business'
      ],
      commonQuestions: [
        { q: 'Sales growing faster than profit - okay?', a: 'Short-term yes (investment phase). Long-term need profit growth to follow.' }
      ],
      nextTools: ['efficiency-dashboard', 'cash-conversion-cycle', 'earnings-quality']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 3: RISK MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

export const riskModule: ModuleDefinition = {
  id: 'risk',
  name: 'Risk Management',
  icon: '🛡️',
  description: 'Identify financial risks, stress signals, leverage concerns, and portfolio drawdown management.',
  prerequisites: ['value'],
  learningOutcomes: [
    'Identify financially distressed companies early',
    'Understand leverage and bankruptcy risk',
    'Manage portfolio drawdowns and risk',
    'Size F&O positions appropriately'
  ],
  lessons: [
    {
      toolId: 'bankruptcy-health',
      toolName: 'Bankruptcy Health',
      category: 'risk',
      difficulty: 'intermediate',
      duration: '7 min',
      summary: 'Uses Altman Z-Score and other models to predict bankruptcy probability.',
      whatYouLearn: [
        'Altman Z-Score calculation and interpretation',
        'Early warning signals of distress',
        'Comparing Z-Score across sectors'
      ],
      whyItMatters: 'Avoiding bankruptcies is more important than finding winners. One zero wipes out many gains.',
      metrics: [
        {
          id: 'altman_z',
          name: 'Altman Z-Score',
          formula: '1.2×WC/TA + 1.4×RE/TA + 3.3×EBIT/TA + 0.6×MV/TL + 1.0×S/TA',
          description: 'Academic model predicting bankruptcy probability within 2 years.',
          interpretation: {
            excellent: 'Z > 3.0: Safe zone, low risk',
            good: 'Z 2.6-3.0: Relatively safe',
            fair: 'Z 1.8-2.6: Grey zone, needs monitoring',
            poor: 'Z < 1.8: Distress zone, high risk',
            dangerous: 'Z < 1.0: Imminent risk'
          },
          thresholds: { excellent: 3, good: 2.6, fair: 1.8, poor: 1 },
          indianContext: 'IL&FS had Z < 1.5 before collapse. Yes Bank was in grey zone for years.',
          commonMistakes: [
            'Z-Score designed for manufacturing. Use modified version for services/financials.',
            'Low Z from high growth (negative retained earnings) can be false alarm.'
          ]
        },
        {
          id: 'bankruptcy_probability',
          name: 'Bankruptcy Probability',
          description: 'Estimated probability of default.',
          interpretation: {
            excellent: '< 5%: Very low risk',
            good: '5-15%: Manageable',
            fair: '15-30%: Elevated',
            poor: '> 30%: High risk'
          }
        },
        {
          id: 'distress_signals',
          name: 'Distress Signals',
          description: 'Count of active warning indicators.',
          interpretation: {
            excellent: '0: No warnings',
            good: '1-2: Minor concerns',
            fair: '3-4: Significant concerns',
            dangerous: '> 4: Multiple red flags'
          }
        }
      ],
      actionableInsights: [
        'Z < 1.8 = avoid regardless of how cheap the stock looks',
        'Falling Z-Score is more concerning than low absolute level',
        'Combine with interest coverage for complete picture',
        'Check debt maturity - near-term maturities increase risk'
      ],
      commonQuestions: [
        { q: 'Stock is cheap with low Z-Score - value trap?', a: 'Likely yes. Cheap + distressed often gets cheaper. Wait for Z to improve.' },
        { q: 'Can a company recover from low Z?', a: 'Yes, through asset sales, equity raise, or turnaround. But risky bet.' }
      ],
      nextTools: ['financial-stress-radar', 'leverage-history', 'working-capital-health']
    },

    {
      toolId: 'financial-stress-radar',
      toolName: 'Financial Stress Radar',
      category: 'risk',
      difficulty: 'intermediate',
      duration: '6 min',
      summary: 'Multi-factor stress detection across liquidity, solvency, profitability, and cash flow.',
      whatYouLearn: [
        'Different types of financial stress',
        'Early warning indicator tracking',
        'Stress score interpretation'
      ],
      whyItMatters: 'Companies dont go bankrupt overnight. Stress builds over quarters. This tool tracks the buildup.',
      metrics: [
        {
          id: 'stress_score',
          name: 'Overall Stress Score',
          description: 'Composite measure of financial stress (higher = more stress).',
          interpretation: {
            excellent: '< 20: Healthy, no stress',
            good: '20-40: Minor concerns',
            fair: '40-60: Moderate stress',
            poor: '60-80: Significant stress',
            dangerous: '> 80: Severe stress'
          }
        },
        {
          id: 'liquidity_stress',
          name: 'Liquidity Stress',
          description: 'Short-term payment ability concerns.',
          interpretation: {
            excellent: 'Current ratio > 1.5, positive OCF',
            fair: 'Current ratio 1-1.5, tight cash',
            poor: 'Current ratio < 1, negative OCF'
          }
        },
        {
          id: 'solvency_stress',
          name: 'Solvency Stress',
          description: 'Long-term debt sustainability concerns.',
          interpretation: {
            excellent: 'D/E < 0.5, interest coverage > 5x',
            fair: 'D/E 0.5-1.5, coverage 2-5x',
            poor: 'D/E > 1.5, coverage < 2x'
          }
        }
      ],
      actionableInsights: [
        'Rising stress score over 3 quarters = exit signal',
        'Liquidity stress can kill faster than solvency stress',
        'Compare stress to industry peers - some sectors naturally more stressed'
      ],
      nextTools: ['bankruptcy-health', 'leverage-history', 'risk-health-dashboard']
    },

    {
      toolId: 'leverage-history',
      toolName: 'Leverage History',
      category: 'risk',
      difficulty: 'intermediate',
      duration: '7 min',
      summary: 'Track debt levels, coverage ratios, and leverage trends over time.',
      whatYouLearn: [
        'Understanding different debt metrics',
        'Debt covenant monitoring',
        'Leverage lifecycle patterns'
      ],
      whyItMatters: 'Leverage amplifies both returns and losses. Understanding debt dynamics is crucial for risk assessment.',
      metrics: [
        {
          id: 'debt_to_equity',
          name: 'Debt-to-Equity Trend',
          description: 'How leverage is changing over time.',
          interpretation: {
            excellent: 'Declining D/E: Deleveraging',
            fair: 'Stable D/E: Maintaining',
            poor: 'Rising D/E: Taking on more risk'
          }
        },
        {
          id: 'interest_coverage_trend',
          name: 'Interest Coverage Trend',
          description: 'Ability to service debt from earnings.',
          interpretation: {
            excellent: 'Coverage improving: Getting safer',
            fair: 'Coverage stable: Maintaining',
            poor: 'Coverage declining: Increasing risk'
          }
        },
        {
          id: 'debt_maturity',
          name: 'Debt Maturity Profile',
          description: 'When debt comes due.',
          interpretation: {
            excellent: 'Well-laddered, no near-term cliff',
            fair: 'Some concentration, manageable',
            poor: 'Large near-term maturities'
          },
          indianContext: 'Check short-term vs long-term debt split. High short-term = refinancing risk.'
        },
        {
          id: 'covenant_headroom',
          name: 'Covenant Headroom',
          description: 'Buffer before breaching loan covenants.',
          interpretation: {
            excellent: '> 30% headroom: Safe',
            fair: '10-30%: Tight',
            poor: '< 10%: Risk of breach'
          }
        }
      ],
      actionableInsights: [
        'D/E rising + coverage falling = danger signal',
        'Large debt maturity in 1-2 years needs refinancing plan',
        'Covenant breach often triggers lender actions'
      ],
      nextTools: ['financial-stress-radar', 'working-capital-health', 'risk-health-dashboard']
    },

    {
      toolId: 'drawdown-var',
      toolName: 'Drawdown & VaR',
      category: 'risk',
      difficulty: 'advanced',
      duration: '8 min',
      summary: 'Analyze historical drawdowns and estimate potential losses using Value at Risk.',
      whatYouLearn: [
        'Maximum drawdown analysis',
        'Value at Risk (VaR) interpretation',
        'Recovery time patterns'
      ],
      whyItMatters: 'Knowing worst-case scenarios helps you size positions and set stops appropriately.',
      metrics: [
        {
          id: 'max_drawdown',
          name: 'Maximum Drawdown',
          formula: '(Peak - Trough) / Peak × 100',
          description: 'Largest peak-to-trough decline in history.',
          interpretation: {
            excellent: '< 20%: Low volatility stock',
            good: '20-40%: Normal equity volatility',
            fair: '40-60%: High volatility',
            poor: '> 60%: Extreme volatility'
          },
          indianContext: 'Nifty max drawdown was 60% in 2008. Individual stocks can be much worse.'
        },
        {
          id: 'var_95',
          name: '95% VaR (Daily)',
          description: 'Maximum expected loss on 95% of days.',
          interpretation: {
            excellent: '< 2%: Low daily risk',
            good: '2-4%: Moderate risk',
            fair: '4-6%: Higher risk',
            poor: '> 6%: Very high risk'
          }
        },
        {
          id: 'recovery_time',
          name: 'Average Recovery Time',
          description: 'Days to recover from drawdowns.',
          interpretation: {
            excellent: '< 30 days: Quick recovery',
            good: '30-90 days: Reasonable',
            fair: '90-180 days: Extended',
            poor: '> 180 days: Long recovery'
          }
        }
      ],
      actionableInsights: [
        'Size positions so max drawdown is tolerable',
        'Diversification reduces portfolio max drawdown',
        'VaR underestimates tail risks - actual losses can exceed'
      ],
      nextTools: ['volatility-regime', 'risk-health-dashboard', 'trade-expectancy']
    },

    {
      toolId: 'fno-risk-advisor',
      toolName: 'F&O Risk Advisor',
      category: 'risk',
      difficulty: 'advanced',
      duration: '10 min',
      summary: 'Position sizing calculator for futures and options based on account risk parameters.',
      whatYouLearn: [
        'Risk-based position sizing',
        'Lot size calculations',
        'Margin requirements'
      ],
      whyItMatters: 'SEBI data shows 90% of F&O traders lose money. Proper position sizing is the difference between survival and ruin.',
      metrics: [
        {
          id: 'recommended_lots',
          name: 'Recommended Lots',
          description: 'Maximum position size based on risk parameters.',
          interpretation: {
            excellent: 'Following recommendation: Disciplined',
            poor: 'Exceeding recommendation: Overleveraged'
          }
        },
        {
          id: 'max_loss_per_trade',
          name: 'Max Loss Per Trade',
          formula: 'Account Size × Risk % Per Trade',
          description: 'Maximum rupees to risk on a single trade.',
          interpretation: {
            excellent: '1-2% of account: Professional',
            good: '2-3%: Moderate risk',
            poor: '> 5%: Too aggressive'
          },
          indianContext: 'Most retail traders risk 10-20% per trade. This is why they lose.'
        },
        {
          id: 'margin_utilization',
          name: 'Margin Utilization',
          description: 'Percentage of available margin used.',
          interpretation: {
            excellent: '< 50%: Conservative',
            good: '50-70%: Moderate',
            fair: '70-90%: Aggressive',
            poor: '> 90%: Dangerous'
          }
        }
      ],
      actionableInsights: [
        'Risk max 2% per trade - allows 50 losing trades to survive',
        'Never use more than 70% margin - leave buffer for adverse moves',
        'SEBI loss data is real - respect position sizing rules'
      ],
      nextTools: ['trade-expectancy', 'options-interest', 'options-strategy']
    },

    {
      toolId: 'trade-expectancy',
      toolName: 'Trade Expectancy Simulator',
      category: 'risk',
      difficulty: 'advanced',
      duration: '8 min',
      summary: 'Calculate expected value of your trading strategy based on win rate and risk-reward.',
      whatYouLearn: [
        'Expectancy formula and calculation',
        'Why risk-reward matters more than win rate',
        'Position sizing from expectancy'
      ],
      whyItMatters: 'A trading strategy with positive expectancy makes money over time. Without it, youre gambling.',
      metrics: [
        {
          id: 'expectancy',
          name: 'Trade Expectancy',
          formula: '(Win% × Avg Win) - (Loss% × Avg Loss)',
          description: 'Expected profit per rupee risked.',
          interpretation: {
            excellent: '> 0.5R: Excellent edge',
            good: '0.2-0.5R: Good edge',
            fair: '0-0.2R: Marginal edge',
            poor: '< 0R: Negative expectancy, losing system'
          }
        },
        {
          id: 'win_rate',
          name: 'Win Rate',
          formula: 'Winning Trades / Total Trades × 100',
          description: 'Percentage of trades that are profitable.',
          interpretation: {
            excellent: '> 60%: High win rate',
            good: '45-60%: Good',
            fair: '35-45%: Needs higher R:R',
            poor: '< 35%: Low win rate'
          },
          indianContext: 'Win rate alone is meaningless. 30% win rate with 3:1 R:R beats 60% with 1:1.'
        },
        {
          id: 'risk_reward',
          name: 'Risk-Reward Ratio',
          formula: 'Average Win / Average Loss',
          description: 'How much you win vs how much you lose per trade.',
          interpretation: {
            excellent: '> 3:1: Excellent R:R',
            good: '2-3:1: Good R:R',
            fair: '1-2:1: Needs high win rate',
            poor: '< 1:1: Losing proposition'
          }
        },
        {
          id: 'profit_factor',
          name: 'Profit Factor',
          formula: 'Gross Profits / Gross Losses',
          description: 'Ratio of total wins to total losses.',
          interpretation: {
            excellent: '> 2.0: Very profitable',
            good: '1.5-2.0: Profitable',
            fair: '1.0-1.5: Marginal',
            poor: '< 1.0: Losing money'
          }
        }
      ],
      practicalExample: `Strategy Analysis:
- Win Rate: 40%
- Average Win: ₹5,000 (2R)
- Average Loss: ₹2,500 (1R)
- R:R = 2:1

Expectancy = (0.40 × 5000) - (0.60 × 2500)
           = 2000 - 1500 = ₹500 per trade

Positive expectancy! Over 100 trades, expect ₹50,000 profit.`,
      actionableInsights: [
        'Expectancy > 0 is minimum requirement for any strategy',
        'Improve R:R by better entries and holding winners longer',
        'Track expectancy in trading journal religiously'
      ],
      nextTools: ['trade-journal', 'fno-risk-advisor', 'drawdown-var']
    },

    {
      toolId: 'risk-health-dashboard',
      toolName: 'Risk Health Dashboard',
      category: 'risk',
      difficulty: 'beginner',
      duration: '5 min',
      summary: 'One-stop overview of all risk metrics for quick assessment.',
      whatYouLearn: [
        'Quick risk assessment framework',
        'Traffic light risk indicators',
        'Priority-based risk monitoring'
      ],
      whyItMatters: 'Quick risk check before any investment decision. Red flags here = deeper investigation needed.',
      metrics: [
        {
          id: 'overall_risk_score',
          name: 'Overall Risk Score',
          description: 'Composite risk rating.',
          interpretation: {
            excellent: '> 80: Low risk',
            good: '60-80: Moderate risk',
            fair: '40-60: Elevated risk',
            poor: '< 40: High risk'
          }
        },
        {
          id: 'risk_flags',
          name: 'Active Risk Flags',
          description: 'Number of risk indicators triggered.',
          interpretation: {
            excellent: '0: All clear',
            good: '1-2: Minor concerns',
            fair: '3-4: Needs attention',
            poor: '> 4: Multiple red flags'
          }
        }
      ],
      actionableInsights: [
        'Any red flag = investigate before investing',
        'Use dashboard for quick screening, then deep dive',
        'Monitor existing holdings monthly'
      ],
      nextTools: ['bankruptcy-health', 'financial-stress-radar', 'leverage-history']
    },

    {
      toolId: 'working-capital-health',
      toolName: 'Working Capital Health',
      category: 'risk',
      difficulty: 'intermediate',
      duration: '6 min',
      summary: 'Monitor receivables, inventory, and payables for liquidity stress signals.',
      whatYouLearn: [
        'Working capital components',
        'Cash conversion cycle',
        'Early warning of liquidity problems'
      ],
      whyItMatters: 'Working capital problems cause more corporate deaths than profitability problems. Cash is king.',
      metrics: [
        {
          id: 'receivable_days',
          name: 'Receivable Days (DSO)',
          formula: '(Receivables / Revenue) × 365',
          description: 'Days to collect payment from customers.',
          interpretation: {
            excellent: '< 30 days: Quick collection',
            good: '30-60 days: Normal',
            fair: '60-90 days: Slow',
            poor: '> 90 days: Collection issues'
          },
          indianContext: 'Government contracts often have 90+ days DSO. Not always red flag but needs higher margins.'
        },
        {
          id: 'inventory_days',
          name: 'Inventory Days (DIO)',
          formula: '(Inventory / COGS) × 365',
          description: 'Days of inventory on hand.',
          interpretation: {
            excellent: '< 45 days: Lean inventory',
            good: '45-90 days: Normal',
            fair: '90-120 days: High',
            poor: '> 120 days: Potential obsolescence'
          }
        },
        {
          id: 'payable_days',
          name: 'Payable Days (DPO)',
          formula: '(Payables / COGS) × 365',
          description: 'Days to pay suppliers.',
          interpretation: {
            excellent: '> 60 days: Good bargaining power',
            good: '45-60 days: Normal',
            fair: '30-45 days: Quick payment',
            poor: '< 30 days: Weak supplier terms'
          }
        }
      ],
      actionableInsights: [
        'Rising DSO = customers not paying, potential write-offs ahead',
        'Rising DIO = products not selling, potential markdowns',
        'Falling DPO = suppliers tightening terms, stress signal'
      ],
      nextTools: ['cash-conversion-cycle', 'financial-stress-radar', 'profit-vs-cash-divergence']
    },

    {
      toolId: 'cashflow-stability-index',
      toolName: 'Cashflow Stability Index',
      category: 'risk',
      difficulty: 'intermediate',
      duration: '6 min',
      summary: 'Measures consistency and predictability of operating cash flows.',
      whatYouLearn: [
        'OCF volatility assessment',
        'Cash flow quality indicators',
        'Seasonal adjustment factors'
      ],
      whyItMatters: 'Volatile cash flows make planning difficult and increase financial risk.',
      metrics: [
        {
          id: 'ocf_stability',
          name: 'OCF Stability Score',
          description: 'Consistency of operating cash flows.',
          interpretation: {
            excellent: '> 80: Very stable',
            good: '60-80: Reasonably stable',
            fair: '40-60: Moderate volatility',
            poor: '< 40: Highly volatile'
          }
        },
        {
          id: 'ocf_margin_stability',
          name: 'OCF Margin Stability',
          description: 'How consistent is OCF as % of revenue.',
          interpretation: {
            excellent: 'Stable within 3%: Predictable',
            fair: 'Varies 3-8%: Some volatility',
            poor: 'Varies > 8%: Unpredictable'
          }
        }
      ],
      actionableInsights: [
        'Stable OCF = safer for dividend, debt service',
        'Volatile OCF = needs higher cash buffer',
        'Seasonality is normal, erratic is not'
      ],
      nextTools: ['fcf-health', 'working-capital-health', 'earnings-stability']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 4: TECHNICAL ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

export const technicalModule: ModuleDefinition = {
  id: 'technical',
  name: 'Technical Analysis',
  icon: '📊',
  description: 'Price action, momentum, patterns, and market microstructure analysis.',
  prerequisites: [],
  learningOutcomes: [
    'Read and interpret technical indicators',
    'Identify chart patterns and their implications',
    'Understand volume and delivery analysis',
    'Time entries and exits better'
  ],
  lessons: [
    {
      toolId: 'technical-indicators',
      toolName: 'Technical Indicators',
      category: 'technical',
      difficulty: 'beginner',
      duration: '10 min',
      summary: 'Core technical indicators - RSI, MACD, moving averages, Bollinger Bands.',
      whatYouLearn: [
        'How to read RSI and overbought/oversold signals',
        'MACD crossovers and divergences',
        'Moving average strategies'
      ],
      whyItMatters: 'Technical indicators help time entries and exits in fundamentally sound stocks.',
      metrics: [
        {
          id: 'rsi',
          name: 'RSI (Relative Strength Index)',
          formula: '100 - (100 / (1 + RS))',
          description: 'Momentum oscillator measuring overbought/oversold conditions.',
          interpretation: {
            excellent: '30-50: Oversold, potential buy zone',
            good: '50-60: Neutral to bullish',
            fair: '60-70: Bullish momentum',
            poor: '> 70: Overbought, caution',
            dangerous: '< 30 or > 80: Extreme, watch for reversal'
          },
          thresholds: { excellent: 30, good: 50, fair: 70, poor: 80 },
          indianContext: 'In strong bull markets (like 2020-21), RSI can stay overbought for weeks. Use with trend.',
          commonMistakes: [
            'Selling just because RSI > 70 in strong uptrend',
            'Buying just because RSI < 30 in downtrend'
          ]
        },
        {
          id: 'macd',
          name: 'MACD',
          formula: '12-day EMA - 26-day EMA',
          description: 'Trend-following momentum indicator.',
          interpretation: {
            excellent: 'MACD crosses above signal line: Bullish',
            good: 'MACD above zero: Uptrend',
            fair: 'MACD below zero: Downtrend',
            poor: 'MACD crosses below signal: Bearish'
          },
          indianContext: 'MACD divergence (price up, MACD down) often precedes corrections.',
          commonMistakes: ['MACD lags - use for confirmation, not prediction']
        },
        {
          id: 'moving_averages',
          name: 'Moving Averages (20/50/200)',
          description: 'Smoothed price trends over different timeframes.',
          interpretation: {
            excellent: 'Price > 20 > 50 > 200 MA: Strong uptrend',
            good: 'Price > 50 MA: Medium-term bullish',
            fair: 'Price between MAs: Consolidation',
            poor: 'Price < 200 MA: Long-term bearish'
          },
          indianContext: '200 DMA is key support for Nifty. Breaks below often trigger selling.',
          relatedMetrics: ['golden_cross', 'death_cross']
        },
        {
          id: 'bollinger_bands',
          name: 'Bollinger Bands',
          formula: 'Middle: 20 SMA, Upper/Lower: Middle ± 2 std dev',
          description: 'Volatility bands around moving average.',
          interpretation: {
            excellent: 'Price at lower band in uptrend: Buy zone',
            fair: 'Price at middle: Neutral',
            poor: 'Price at upper band in downtrend: Sell zone'
          },
          indianContext: 'Squeeze (narrow bands) often precedes big moves. Watch for breakout direction.'
        }
      ],
      actionableInsights: [
        'Use multiple indicators for confirmation',
        'RSI oversold + price at support = high probability buy',
        'MACD crossover with volume = stronger signal',
        'Respect 200 DMA as major trend indicator'
      ],
      commonQuestions: [
        { q: 'Which indicator is best?', a: 'None alone. RSI for overbought/oversold, MACD for trend, MAs for levels.' },
        { q: 'Indicators conflicting - what do I do?', a: 'Wait for alignment or go with the trend (MAs).' }
      ],
      nextTools: ['momentum-heatmap', 'trend-strength', 'price-structure']
    },

    {
      toolId: 'candlestick-hero',
      toolName: 'Candlestick Hero',
      category: 'technical',
      difficulty: 'intermediate',
      duration: '8 min',
      summary: 'Identify and interpret Japanese candlestick patterns.',
      whatYouLearn: [
        'Single candle patterns (doji, hammer, shooting star)',
        'Multi-candle patterns (engulfing, morning star)',
        'Pattern context and reliability'
      ],
      whyItMatters: 'Candlestick patterns reveal buyer/seller psychology at key moments.',
      metrics: [
        {
          id: 'pattern_detected',
          name: 'Pattern Detection',
          description: 'Active candlestick pattern identified.',
          interpretation: {
            excellent: 'Bullish pattern at support: High probability',
            good: 'Bearish pattern at resistance: High probability',
            fair: 'Pattern without context: Lower reliability',
            poor: 'Conflicting patterns: Wait for clarity'
          }
        },
        {
          id: 'pattern_reliability',
          name: 'Pattern Reliability Score',
          description: 'Historical success rate of the pattern.',
          interpretation: {
            excellent: '> 65%: High reliability',
            good: '55-65%: Moderate',
            fair: '45-55%: Coin flip',
            poor: '< 45%: Low reliability'
          }
        }
      ],
      actionableInsights: [
        'Patterns at key support/resistance are more reliable',
        'Volume confirmation increases pattern reliability',
        'Wait for next candle to confirm pattern'
      ],
      nextTools: ['pattern-matcher', 'price-structure', 'technical-indicators']
    },

    {
      toolId: 'trend-strength',
      toolName: 'Trend Strength',
      category: 'technical',
      difficulty: 'intermediate',
      duration: '6 min',
      summary: 'Measure the strength of current price trend using ADX and related metrics.',
      whatYouLearn: [
        'ADX interpretation for trend strength',
        'Trending vs ranging market identification',
        'Trend quality assessment'
      ],
      whyItMatters: 'Trading with strong trends is easier. ADX tells you when trends are worth trading.',
      metrics: [
        {
          id: 'adx',
          name: 'ADX (Average Directional Index)',
          formula: 'Smoothed average of DX',
          description: 'Measures trend strength, not direction.',
          interpretation: {
            excellent: '> 40: Strong trend, trade with it',
            good: '25-40: Moderate trend',
            fair: '15-25: Weak trend, range-bound',
            poor: '< 15: No trend, avoid trend strategies'
          },
          thresholds: { excellent: 40, good: 25, fair: 15, poor: 10 },
          indianContext: 'Nifty ADX > 30 signals strong trending phases.',
          commonMistakes: ['ADX doesnt tell direction - only strength. Check +DI/-DI for direction.']
        },
        {
          id: 'di_plus_minus',
          name: '+DI / -DI',
          description: 'Directional indicators showing bullish/bearish pressure.',
          interpretation: {
            excellent: '+DI > -DI with ADX rising: Strong uptrend',
            good: '+DI > -DI: Bullish',
            fair: '+DI ≈ -DI: Ranging',
            poor: '-DI > +DI: Bearish'
          }
        },
        {
          id: 'trend_quality',
          name: 'Trend Quality Score',
          description: 'Composite measure of trend tradability.',
          interpretation: {
            excellent: '> 75: Strong, clean trend',
            good: '50-75: Tradable trend',
            fair: '25-50: Choppy, difficult',
            poor: '< 25: No trend'
          }
        }
      ],
      actionableInsights: [
        'High ADX = use trend-following strategies',
        'Low ADX = use range-bound strategies or wait',
        'ADX falling from high level = trend ending soon'
      ],
      nextTools: ['market-regime-radar', 'momentum-heatmap', 'technical-indicators']
    },

    {
      toolId: 'momentum-heatmap',
      toolName: 'Momentum Heatmap',
      category: 'technical',
      difficulty: 'intermediate',
      duration: '6 min',
      summary: 'Multi-timeframe momentum analysis showing strength across periods.',
      whatYouLearn: [
        'Comparing momentum across timeframes',
        'Identifying aligned momentum setups',
        'Timeframe confluence'
      ],
      whyItMatters: 'Strongest moves happen when multiple timeframes align in direction.',
      metrics: [
        {
          id: 'tf_momentum',
          name: 'Timeframe Momentum',
          description: 'Momentum status per timeframe (daily, weekly, monthly).',
          interpretation: {
            excellent: 'All green: All timeframes bullish',
            good: '2/3 green: Mostly bullish',
            fair: 'Mixed: No clear direction',
            poor: 'All red: All timeframes bearish'
          }
        },
        {
          id: 'momentum_score',
          name: 'Overall Momentum Score',
          description: 'Weighted average of momentum across timeframes.',
          interpretation: {
            excellent: '> 80: Strong bullish momentum',
            good: '60-80: Positive momentum',
            fair: '40-60: Neutral',
            poor: '< 40: Bearish momentum'
          }
        }
      ],
      actionableInsights: [
        'Buy when daily turns bullish with weekly already bullish',
        'Avoid fighting monthly trend direction',
        'Strongest setups have all timeframes aligned'
      ],
      nextTools: ['trend-strength', 'market-regime-radar', 'technical-indicators']
    },

    {
      toolId: 'price-structure',
      toolName: 'Price Structure',
      category: 'technical',
      difficulty: 'intermediate',
      duration: '7 min',
      summary: 'Identify key support and resistance levels for entry/exit planning.',
      whatYouLearn: [
        'How support/resistance forms',
        'Level strength assessment',
        'Using levels for trade planning'
      ],
      whyItMatters: 'Knowing where prices are likely to pause or reverse improves trade entries significantly.',
      metrics: [
        {
          id: 'support_levels',
          name: 'Support Levels',
          description: 'Prices where buying pressure likely emerges.',
          interpretation: {
            excellent: 'Multiple tests held: Strong support',
            good: 'Recent support: Relevant',
            fair: 'Old support: May be weaker',
            poor: 'Broken support: Becomes resistance'
          }
        },
        {
          id: 'resistance_levels',
          name: 'Resistance Levels',
          description: 'Prices where selling pressure likely emerges.',
          interpretation: {
            excellent: 'Multiple rejections: Strong resistance',
            good: 'Recent resistance: Relevant',
            fair: 'Old resistance: May be weaker'
          }
        },
        {
          id: 'range_position',
          name: 'Range Position',
          description: 'Where price is within its trading range.',
          interpretation: {
            excellent: 'Near support in uptrend: Good entry',
            fair: 'Mid-range: Wait for better level',
            poor: 'Near resistance in downtrend: Avoid'
          }
        }
      ],
      actionableInsights: [
        'Buy near support with stop just below',
        'Sell/short near resistance with stop just above',
        'More touches = stronger level',
        'Round numbers (100, 500, 1000) are psychological levels'
      ],
      nextTools: ['pattern-matcher', 'volatility-regime', 'technical-indicators']
    },

    {
      toolId: 'pattern-matcher',
      toolName: 'Pattern Matcher',
      category: 'technical',
      difficulty: 'intermediate',
      duration: '8 min',
      summary: 'Identify chart patterns like head & shoulders, triangles, and channels.',
      whatYouLearn: [
        'Classic chart pattern recognition',
        'Pattern targets and stop placement',
        'Pattern failure handling'
      ],
      whyItMatters: 'Chart patterns represent crowd psychology and often repeat with measurable outcomes.',
      metrics: [
        {
          id: 'pattern_type',
          name: 'Pattern Detected',
          description: 'Type of chart pattern identified.',
          interpretation: {
            excellent: 'Clear pattern with volume confirmation',
            good: 'Pattern forming, watch for completion',
            fair: 'Ambiguous pattern',
            poor: 'No clear pattern'
          }
        },
        {
          id: 'pattern_target',
          name: 'Pattern Price Target',
          description: 'Measured move target from pattern.',
          interpretation: {
            excellent: 'Target > 20% from breakout: Significant',
            good: 'Target 10-20%: Decent',
            fair: 'Target < 10%: Small'
          }
        },
        {
          id: 'win_rate',
          name: 'Historical Win Rate',
          description: 'Pattern success rate from historical data.',
          interpretation: {
            excellent: '> 65%: High probability pattern',
            good: '55-65%: Moderate',
            fair: '45-55%: Low edge'
          }
        }
      ],
      actionableInsights: [
        'Wait for pattern completion before trading',
        'Volume should confirm breakout',
        'Set stop at pattern invalidation level',
        'Take partial profits at measured move target'
      ],
      nextTools: ['candlestick-hero', 'price-structure', 'technical-indicators']
    },

    {
      toolId: 'volatility-regime',
      toolName: 'Volatility Regime',
      category: 'technical',
      difficulty: 'intermediate',
      duration: '6 min',
      summary: 'Classify current volatility environment and adjust strategy accordingly.',
      whatYouLearn: [
        'ATR-based volatility measurement',
        'Bollinger Band squeeze detection',
        'Strategy adjustment for volatility'
      ],
      whyItMatters: 'Different strategies work in different volatility environments. Know the regime before trading.',
      metrics: [
        {
          id: 'volatility_regime',
          name: 'Current Regime',
          description: 'Low, normal, high, or extreme volatility.',
          interpretation: {
            excellent: 'Low volatility squeeze: Expect big move soon',
            good: 'Normal volatility: Standard strategies work',
            fair: 'High volatility: Wider stops needed',
            poor: 'Extreme volatility: Reduce size or wait'
          }
        },
        {
          id: 'atr_percentile',
          name: 'ATR Percentile',
          description: 'Current ATR vs historical range.',
          interpretation: {
            excellent: '< 20th percentile: Low vol, squeeze setup',
            good: '20-80th: Normal',
            poor: '> 80th percentile: Extreme volatility'
          }
        },
        {
          id: 'bb_width',
          name: 'Bollinger Band Width',
          description: 'Width of Bollinger Bands as % of price.',
          interpretation: {
            excellent: '< 5%: Tight squeeze, expansion coming',
            good: '5-15%: Normal',
            poor: '> 15%: Wide bands, high volatility'
          }
        }
      ],
      actionableInsights: [
        'Low volatility → position for breakout',
        'High volatility → reduce position size, widen stops',
        'Volatility mean reverts - expect regime change'
      ],
      nextTools: ['technical-indicators', 'drawdown-var', 'trend-strength']
    },

    {
      toolId: 'delivery-analysis',
      toolName: 'Delivery Analysis Pro',
      category: 'technical',
      difficulty: 'advanced',
      duration: '8 min',
      summary: 'Analyze delivery percentage to identify institutional vs retail activity.',
      whatYouLearn: [
        'What delivery percentage indicates',
        'Smart money accumulation/distribution',
        'Volume-delivery divergence signals'
      ],
      whyItMatters: 'High delivery = real buying for holding. Low delivery = speculation. Follow the smart money.',
      metrics: [
        {
          id: 'delivery_pct',
          name: 'Delivery Percentage',
          formula: 'Shares Delivered / Shares Traded × 100',
          description: 'Percentage of traded volume actually settled for delivery.',
          interpretation: {
            excellent: '> 70%: Strong accumulation',
            good: '50-70%: Healthy delivery',
            fair: '30-50%: Average',
            poor: '< 30%: Speculative trading'
          },
          thresholds: { excellent: 70, good: 50, fair: 30, poor: 20 },
          indianContext: 'Index stocks typically have 30-50% delivery. High delivery in small-caps is bullish.',
          commonMistakes: ['Low delivery on high volume = day traders, not institutions']
        },
        {
          id: 'delivery_trend',
          name: 'Delivery Trend',
          description: 'How delivery % is changing.',
          interpretation: {
            excellent: 'Rising delivery + rising price: Accumulation',
            good: 'Rising delivery + falling price: Bargain hunting',
            fair: 'Falling delivery + rising price: Speculative rally',
            poor: 'Falling delivery + falling price: Distribution done'
          }
        },
        {
          id: 'smart_money_signal',
          name: 'Smart Money Signal',
          description: 'Derived signal from delivery patterns.',
          interpretation: {
            excellent: 'Strong accumulation detected',
            good: 'Mild accumulation',
            fair: 'Neutral',
            poor: 'Distribution detected'
          }
        }
      ],
      actionableInsights: [
        'Rising price + rising delivery = real buying, go long',
        'Rising price + falling delivery = suspect rally, be cautious',
        'High delivery at support = institutions buying dips',
        'Compare to stock\'s own average delivery, not absolute'
      ],
      nextTools: ['trade-flow-intel', 'institutional-flows', 'technical-indicators']
    },

    {
      toolId: 'market-regime-radar',
      toolName: 'Market Regime Radar',
      category: 'technical',
      difficulty: 'intermediate',
      duration: '6 min',
      summary: 'Classify current market regime as bull, bear, or sideways.',
      whatYouLearn: [
        'Regime identification methodology',
        'Strategy selection by regime',
        'Regime transition signals'
      ],
      whyItMatters: 'Wrong strategy for regime = losses. Bull market strategies fail in bear markets.',
      metrics: [
        {
          id: 'regime',
          name: 'Current Regime',
          description: 'Bull, bear, or sideways classification.',
          interpretation: {
            excellent: 'Bull regime: Long bias, buy dips',
            fair: 'Sideways: Range trading, neutral',
            poor: 'Bear regime: Short bias, sell rallies'
          }
        },
        {
          id: 'regime_confidence',
          name: 'Regime Confidence',
          description: 'How certain is the regime classification.',
          interpretation: {
            excellent: '> 80%: High confidence',
            good: '60-80%: Moderate',
            fair: '40-60%: Uncertain, possible transition',
            poor: '< 40%: Unclear'
          }
        }
      ],
      actionableInsights: [
        'In bull regime: Focus on longs, avoid shorts',
        'In bear regime: Cash is king, selective shorts',
        'In sideways: Avoid trend-following, use mean reversion'
      ],
      nextTools: ['trend-strength', 'momentum-heatmap', 'technical-indicators']
    },

    {
      toolId: 'seasonality-pattern',
      toolName: 'Seasonality Pattern',
      category: 'technical',
      difficulty: 'intermediate',
      duration: '5 min',
      summary: 'Historical monthly and daily return patterns.',
      whatYouLearn: [
        'Monthly seasonality effects',
        'Day-of-week patterns',
        'Using seasonality in timing'
      ],
      whyItMatters: 'Some months and days consistently outperform. Minor edge but useful for timing.',
      metrics: [
        {
          id: 'monthly_pattern',
          name: 'Monthly Returns',
          description: 'Average return by month historically.',
          interpretation: {
            excellent: 'Strong positive months: Nov-Dec (year-end rally)',
            good: 'Moderately positive: Jan, Apr',
            fair: 'Flat months: Jun-Aug',
            poor: 'Weak months: Sep-Oct historically'
          },
          indianContext: 'Samvat (Diwali) rally, budget month volatility, FII outflows in Mar.'
        },
        {
          id: 'day_pattern',
          name: 'Day-of-Week Returns',
          description: 'Average return by day of week.',
          interpretation: {
            excellent: 'Historically strong: Wed, Fri',
            fair: 'Mixed: Mon, Thu',
            poor: 'Weak: Weekend effect spillover'
          }
        }
      ],
      actionableInsights: [
        'Dont use seasonality alone - minor factor',
        'Combine with other analysis for timing',
        'Sell in May doesnt always work in India'
      ],
      nextTools: ['technical-indicators', 'earnings-calendar', 'macro-calendar']
    },

    {
      toolId: 'trade-flow-intel',
      toolName: 'Trade Flow Intelligence',
      category: 'technical',
      difficulty: 'advanced',
      duration: '8 min',
      summary: 'Analyze trade size distribution and order flow patterns.',
      whatYouLearn: [
        'Institutional vs retail trade patterns',
        'Block deal identification',
        'Order flow analysis basics'
      ],
      whyItMatters: 'Understanding who is trading and how gives insight into future price direction.',
      metrics: [
        {
          id: 'trade_size_dist',
          name: 'Trade Size Distribution',
          description: 'Breakdown of trades by size.',
          interpretation: {
            excellent: 'Large trades dominant: Institutional activity',
            good: 'Mixed sizes: Normal',
            poor: 'Small trades dominant: Retail speculation'
          }
        },
        {
          id: 'block_deals',
          name: 'Block Deal Activity',
          description: 'Large negotiated trades (> ₹10 Cr)',
          interpretation: {
            excellent: 'Block buys at premium: Very bullish',
            good: 'Block deals neutral: Repositioning',
            poor: 'Block sells at discount: Bearish'
          }
        },
        {
          id: 'flow_bias',
          name: 'Order Flow Bias',
          description: 'Net buying vs selling pressure.',
          interpretation: {
            excellent: 'Strong buy flow: Bullish',
            fair: 'Neutral flow: Balanced',
            poor: 'Strong sell flow: Bearish'
          }
        }
      ],
      actionableInsights: [
        'Institutional buying with rising price = trend continuation',
        'Retail chasing + institutional selling = top warning',
        'Block deals at premium = informed buying'
      ],
      nextTools: ['delivery-analysis', 'institutional-flows', 'options-interest']
    },

    {
      toolId: 'playbook-builder',
      toolName: 'Playbook Builder',
      category: 'technical',
      difficulty: 'advanced',
      duration: '10 min',
      summary: 'Create rule-based trading strategies combining multiple indicators.',
      whatYouLearn: [
        'Strategy rule definition',
        'Backtesting basics',
        'Rule combination logic'
      ],
      whyItMatters: 'Systematic strategies remove emotion and enforce discipline.',
      metrics: [
        {
          id: 'strategy_rules',
          name: 'Entry/Exit Rules',
          description: 'Defined conditions for trades.',
          interpretation: {
            excellent: 'Clear, testable rules with all scenarios covered',
            good: 'Most scenarios covered',
            fair: 'Basic rules defined',
            poor: 'Vague or incomplete rules'
          }
        },
        {
          id: 'backtest_result',
          name: 'Backtest Performance',
          description: 'Historical strategy performance.',
          interpretation: {
            excellent: 'Positive expectancy, reasonable drawdown',
            good: 'Positive but with caveats',
            fair: 'Marginal or inconsistent',
            poor: 'Negative expectancy'
          }
        }
      ],
      actionableInsights: [
        'Keep strategies simple - 2-3 rules max',
        'Out-of-sample testing is critical',
        'Paper trade before real money'
      ],
      nextTools: ['trade-expectancy', 'trade-journal', 'technical-indicators']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 5: CASHFLOW ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

export const cashflowModule: ModuleDefinition = {
  id: 'cashflow',
  name: 'Cash Flow Analysis',
  icon: '💵',
  description: 'Understand free cash flow, cash conversion, and working capital cycles.',
  prerequisites: ['growth'],
  learningOutcomes: [
    'Analyze FCF health and sustainability',
    'Understand cash conversion cycles',
    'Identify cash flow quality issues'
  ],
  lessons: [
    {
      toolId: 'fcf-health',
      toolName: 'FCF Health',
      category: 'cashflow',
      difficulty: 'intermediate',
      duration: '7 min',
      summary: 'Evaluate free cash flow generation, sustainability, and usage.',
      whatYouLearn: [
        'FCF calculation and interpretation',
        'FCF yield as valuation metric',
        'Capital allocation from FCF'
      ],
      whyItMatters: 'Free cash flow is what companies can distribute to shareholders. Its the ultimate measure of value creation.',
      metrics: [
        {
          id: 'fcf',
          name: 'Free Cash Flow',
          formula: 'Operating Cash Flow - Capital Expenditure',
          description: 'Cash available after maintaining/growing the business.',
          interpretation: {
            excellent: 'Consistently positive and growing: Strong',
            good: 'Positive most years: Healthy',
            fair: 'Volatile or flat: Some concerns',
            poor: 'Negative: Cash burning'
          }
        },
        {
          id: 'fcf_yield',
          name: 'FCF Yield',
          formula: 'FCF / Market Cap × 100',
          description: 'Cash return you get on stock price. Like a cash dividend.',
          interpretation: {
            excellent: '> 8%: Very high yield, potentially undervalued',
            good: '4-8%: Good cash return',
            fair: '2-4%: Moderate',
            poor: '< 2%: Low cash return'
          },
          thresholds: { excellent: 8, good: 4, fair: 2, poor: 0 },
          indianContext: 'IT companies often have 3-5% FCF yield. Infrastructure can be negative.',
          relatedMetrics: ['dividend_yield', 'earnings_yield']
        },
        {
          id: 'fcf_margin',
          name: 'FCF Margin',
          formula: 'FCF / Revenue × 100',
          description: 'What percentage of revenue becomes free cash.',
          interpretation: {
            excellent: '> 15%: Exceptional cash generation',
            good: '8-15%: Good',
            fair: '3-8%: Moderate',
            poor: '< 3%: Low conversion'
          }
        },
        {
          id: 'fcf_sustainability',
          name: 'FCF Sustainability Score',
          description: 'How reliable and recurring is FCF.',
          interpretation: {
            excellent: '> 80: Very sustainable',
            good: '60-80: Reliable',
            fair: '40-60: Some volatility',
            poor: '< 40: Unpredictable'
          }
        }
      ],
      actionableInsights: [
        'FCF yield > 8% + growing FCF = attractive investment',
        'Negative FCF is okay for high-growth companies temporarily',
        'FCF should grow faster than or with earnings long-term'
      ],
      nextTools: ['cash-conversion-earnings', 'capital-allocation', 'dividend-crystal-ball']
    },

    {
      toolId: 'cash-conversion-cycle',
      toolName: 'Cash Conversion Cycle',
      category: 'cashflow',
      difficulty: 'intermediate',
      duration: '6 min',
      summary: 'Track how quickly a company converts inventory to cash.',
      whatYouLearn: [
        'DSO, DIO, DPO components',
        'CCC optimization',
        'Working capital efficiency'
      ],
      whyItMatters: 'Shorter CCC means less cash tied up in operations, more available for growth or returns.',
      metrics: [
        {
          id: 'cash_conversion_cycle',
          name: 'Cash Conversion Cycle (CCC)',
          formula: 'DSO + DIO - DPO',
          description: 'Days from cash outflow to cash inflow.',
          interpretation: {
            excellent: '< 30 days: Excellent efficiency',
            good: '30-60 days: Good',
            fair: '60-90 days: Average',
            poor: '> 90 days: Cash intensive'
          },
          indianContext: 'D-Mart has negative CCC (~-20 days). They collect before paying suppliers!',
          relatedMetrics: ['receivable_days', 'inventory_days', 'payable_days']
        },
        {
          id: 'ccc_trend',
          name: 'CCC Trend',
          description: 'How CCC is changing over time.',
          interpretation: {
            excellent: 'Declining: Improving efficiency',
            fair: 'Stable: Maintaining',
            poor: 'Rising: Deteriorating efficiency'
          }
        }
      ],
      actionableInsights: [
        'Negative CCC = supplier financing = capital efficient',
        'Rising CCC consumes cash, falling CCC generates',
        'Compare CCC to industry peers for context'
      ],
      nextTools: ['working-capital-health', 'efficiency-dashboard', 'fcf-health']
    },

    {
      toolId: 'cash-conversion-earnings',
      toolName: 'Cash Conversion of Earnings',
      category: 'cashflow',
      difficulty: 'intermediate',
      duration: '6 min',
      summary: 'How much of reported earnings actually converts to cash.',
      whatYouLearn: [
        'Earnings quality through cash lens',
        'Accrual vs cash accounting',
        'Cash conversion ratio analysis'
      ],
      whyItMatters: 'Earnings can be manipulated. Cash cannot. This is your BS detector.',
      metrics: [
        {
          id: 'cash_conversion_ratio',
          name: 'Cash Conversion Ratio',
          formula: 'Operating Cash Flow / Net Income',
          description: 'How much of each rupee of earnings becomes cash.',
          interpretation: {
            excellent: '> 1.2x: More cash than earnings, excellent',
            good: '0.8-1.2x: Healthy conversion',
            fair: '0.5-0.8x: Below average',
            poor: '< 0.5x: Poor conversion, quality concern'
          },
          thresholds: { excellent: 1.2, good: 0.8, fair: 0.5, poor: 0.3 },
          indianContext: 'Persistent < 0.7x often leads to working capital issues down the road.'
        },
        {
          id: 'cumulative_conversion',
          name: '3-Year Cumulative Conversion',
          description: 'Total cash generated vs total earnings over 3 years.',
          interpretation: {
            excellent: '> 100%: Cash exceeds earnings',
            good: '80-100%: Healthy',
            fair: '60-80%: Some gap',
            poor: '< 60%: Significant gap, investigate'
          }
        }
      ],
      actionableInsights: [
        'Conversion < 80% for 3+ years = quality problem',
        'Check where cash is stuck (receivables? inventory?)',
        'Consistent > 100% conversion is best quality signal'
      ],
      nextTools: ['earnings-quality', 'profit-vs-cash-divergence', 'fcf-health']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// Additional modules for macro, income, portfolio, etc. follow same pattern
// ═══════════════════════════════════════════════════════════════════════════

export const incomeModule: ModuleDefinition = {
  id: 'income',
  name: 'Dividend Investing',
  icon: '💰',
  description: 'Dividend analysis, yield calculations, and income sustainability.',
  prerequisites: ['value'],
  learningOutcomes: [
    'Evaluate dividend safety and sustainability',
    'Project future dividend income',
    'Build dividend growth portfolios'
  ],
  lessons: [
    {
      toolId: 'dividend-crystal-ball',
      toolName: 'Dividend Crystal Ball',
      category: 'income',
      difficulty: 'beginner',
      duration: '6 min',
      summary: 'Project future dividends and assess dividend safety.',
      whatYouLearn: [
        'Dividend yield vs dividend growth trade-off',
        'Payout ratio sustainability',
        'Dividend safety indicators'
      ],
      whyItMatters: 'Dividend cuts devastate income portfolios. Safety assessment prevents nasty surprises.',
      metrics: [
        {
          id: 'dividend_yield',
          name: 'Dividend Yield',
          formula: 'Annual Dividend / Stock Price × 100',
          description: 'Cash return from dividends at current price.',
          interpretation: {
            excellent: '> 4%: High yield',
            good: '2-4%: Moderate yield',
            fair: '1-2%: Low yield',
            poor: '< 1%: Minimal dividend'
          },
          indianContext: 'PSU stocks often have 4-8% yields. IT stocks 1-3%. High growth stocks near 0%.',
          commonMistakes: ['High yield can signal price drop. Check if sustainable.']
        },
        {
          id: 'payout_ratio',
          name: 'Dividend Payout Ratio',
          formula: 'Dividends / Net Income × 100',
          description: 'What percentage of earnings paid as dividends.',
          interpretation: {
            excellent: '30-50%: Sweet spot, room for growth',
            good: '50-70%: Healthy payout',
            fair: '70-90%: High payout, limited growth room',
            poor: '> 100%: Unsustainable, drawing from reserves'
          },
          indianContext: 'Indian companies historically conservative (30-40%). MNCs often higher (50-70%).'
        },
        {
          id: 'dividend_safety',
          name: 'Dividend Safety Score',
          description: 'Composite safety assessment.',
          interpretation: {
            excellent: '> 80: Very safe dividend',
            good: '60-80: Safe',
            fair: '40-60: Some risk',
            poor: '< 40: Dividend at risk'
          }
        },
        {
          id: 'dividend_growth',
          name: '5-Year Dividend CAGR',
          description: 'Annual growth rate of dividends.',
          interpretation: {
            excellent: '> 15%: High dividend growth',
            good: '8-15%: Good growth',
            fair: '3-8%: Moderate',
            poor: '< 3%: Slow or no growth'
          }
        }
      ],
      actionableInsights: [
        'Yield > 6% needs extra safety checks',
        'Payout ratio rising each year = unsustainable trend',
        'Dividend growth + safety more important than current yield'
      ],
      nextTools: ['income-stability', 'dividend-sip-tracker', 'fcf-health']
    },

    {
      toolId: 'income-stability',
      toolName: 'Income Stability',
      category: 'income',
      difficulty: 'beginner',
      duration: '5 min',
      summary: 'Track dividend history, consistency, and cut risk.',
      whatYouLearn: [
        'Dividend track record analysis',
        'Cut risk identification',
        'Consistency metrics'
      ],
      whyItMatters: 'Past dividend consistency predicts future reliability. One cut destroys years of income.',
      metrics: [
        {
          id: 'consecutive_years',
          name: 'Consecutive Dividend Years',
          description: 'Years of uninterrupted dividend payments.',
          interpretation: {
            excellent: '> 20 years: Dividend aristocrat',
            good: '10-20 years: Reliable payer',
            fair: '5-10 years: Building track record',
            poor: '< 5 years: Limited history'
          },
          indianContext: 'TCS, HUL have 20+ year streaks. PSUs more erratic.'
        },
        {
          id: 'cuts_in_10y',
          name: 'Dividend Cuts (Last 10Y)',
          description: 'Number of years dividend was reduced.',
          interpretation: {
            excellent: '0 cuts: Perfect record',
            good: '1 cut: Acceptable if explained',
            fair: '2-3 cuts: Concerning',
            poor: '> 3 cuts: Unreliable'
          }
        },
        {
          id: 'stability_score',
          name: 'Stability Score',
          description: 'Overall dividend reliability rating.',
          interpretation: {
            excellent: '> 80: Very stable',
            good: '60-80: Stable',
            fair: '40-60: Some volatility',
            poor: '< 40: Unstable'
          }
        }
      ],
      actionableInsights: [
        '10+ years without cut = strong indicator',
        'Recent cut = stock needs recovery time',
        'Stability + growth = best dividend stocks'
      ],
      nextTools: ['dividend-crystal-ball', 'earnings-stability', 'piotroski-score']
    },

    {
      toolId: 'dividend-sip-tracker',
      toolName: 'Dividend SIP Tracker',
      category: 'income',
      difficulty: 'intermediate',
      duration: '5 min',
      summary: 'Track dividend income from systematic investments over time.',
      whatYouLearn: [
        'Dividend reinvestment impact',
        'Yield on cost calculation',
        'Income growth tracking'
      ],
      whyItMatters: 'Reinvesting dividends compounds returns dramatically over time.',
      metrics: [
        {
          id: 'yield_on_cost',
          name: 'Yield on Cost',
          formula: 'Current Annual Dividend / Original Purchase Price × 100',
          description: 'Dividend yield based on your purchase price.',
          interpretation: {
            excellent: '> 10%: Excellent YoC',
            good: '5-10%: Good',
            fair: '3-5%: Moderate',
            poor: '< 3%: Low'
          },
          indianContext: 'Long-term holders often have 10-20% YoC on quality dividend stocks.'
        },
        {
          id: 'income_growth',
          name: 'Annual Income Growth',
          description: 'How your dividend income is growing year over year.',
          interpretation: {
            excellent: '> 15%: Rapid income growth',
            good: '8-15%: Strong',
            fair: '3-8%: Moderate',
            poor: '< 3%: Slow'
          }
        }
      ],
      actionableInsights: [
        'Reinvest dividends to accelerate compounding',
        'YoC rises as you hold good dividend growers',
        'Track actual income received, not just yield'
      ],
      nextTools: ['dividend-crystal-ball', 'portfolio-leaderboard', 'rebalance-optimizer']
    }
  ]
};

// Export all modules
import { additionalModules } from './curriculum-part2';

export const allModules: ModuleDefinition[] = [
  valueModule,
  growthModule,
  riskModule,
  technicalModule,
  cashflowModule,
  incomeModule,
  ...additionalModules,
];

// Get all lessons across all modules
export function getAllLessons(): LessonDefinition[] {
  return allModules.flatMap(m => m.lessons);
}

// Get lesson by tool ID
export function getLessonByToolId(toolId: string): LessonDefinition | undefined {
  return getAllLessons().find(l => l.toolId === toolId);
}

// Get metric definition by ID
export function getMetricDefinition(metricId: string): MetricDefinition | undefined {
  for (const lesson of getAllLessons()) {
    const metric = lesson.metrics.find(m => m.id === metricId);
    if (metric) return metric;
  }
  return undefined;
}

// Get all unique metrics
export function getAllMetrics(): MetricDefinition[] {
  const metrics: MetricDefinition[] = [];
  const seen = new Set<string>();
  
  for (const lesson of getAllLessons()) {
    for (const metric of lesson.metrics) {
      if (!seen.has(metric.id)) {
        seen.add(metric.id);
        metrics.push(metric);
      }
    }
  }
  
  return metrics;
}

export default {
  allModules,
  getAllLessons,
  getLessonByToolId,
  getMetricDefinition,
  getAllMetrics
};
