// ═══════════════════════════════════════════════════════════════════════════
// TOOL EDUCATION MAPPING
// Links concepts, terms, and educational content to each tool
// ═══════════════════════════════════════════════════════════════════════════

import { getConceptById, Concept } from './concepts';

export interface ToolEducation {
  toolId: string;
  toolName: string;
  quickTip: string;                    // One-liner shown on hover
  concepts: string[];                   // Concept IDs used in this tool
  keyTerms: ToolTerm[];                // Terms specific to this tool
  howToUse: string[];                  // Step-by-step usage guide
  proTips: string[];                   // Advanced tips
  commonQuestions: FAQ[];              // FAQs about this tool
  relatedModules: string[];            // Learning module IDs
  videoTutorialUrl?: string;           // Optional video link
}

export interface ToolTerm {
  term: string;
  definition: string;
  formula?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL EDUCATION DATABASE
// ─────────────────────────────────────────────────────────────────────────────

export const TOOL_EDUCATION: Record<string, ToolEducation> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // VALUATION TOOLS
  // ═══════════════════════════════════════════════════════════════════════════
  
  'valuation-summary': {
    toolId: 'valuation-summary',
    toolName: 'Valuation Summary',
    quickTip: 'Quick overview of whether a stock is cheap or expensive using key ratios',
    concepts: ['pe-ratio', 'book-value', 'dividend-yield', 'eps'],
    keyTerms: [
      {
        term: 'P/E Ratio',
        definition: 'Price divided by earnings. Shows how much you pay for ₹1 of profit.',
        formula: 'P/E = Stock Price / EPS'
      },
      {
        term: 'P/B Ratio',
        definition: 'Price divided by book value. Important for banks and asset-heavy companies.',
        formula: 'P/B = Stock Price / Book Value per Share'
      },
      {
        term: 'EV/EBITDA',
        definition: 'Enterprise value to operating profit. Better for comparing companies with different debt levels.',
        formula: 'EV/EBITDA = (Market Cap + Debt - Cash) / EBITDA'
      },
      {
        term: 'Dividend Yield',
        definition: 'Annual dividend as percentage of price. Shows income return.',
        formula: 'Yield = Annual Dividend / Price × 100'
      }
    ],
    howToUse: [
      'Compare P/E with industry average and historical P/E',
      'Check if P/B is below 1 (potential value or value trap)',
      'Look at PEG ratio if company is growing',
      'Consider all metrics together, not in isolation'
    ],
    proTips: [
      'Low P/E + High ROE is the classic value combination',
      'Compare EV/EBITDA instead of P/E for capital-intensive businesses',
      'Check if low valuation is justified by poor fundamentals'
    ],
    commonQuestions: [
      {
        question: 'What is a good P/E ratio?',
        answer: 'It depends on the industry and growth rate. For Nifty 50, 18-22x is fair value. High-growth companies deserve higher P/E. Compare within the same sector.'
      },
      {
        question: 'Why is P/B important for banks?',
        answer: 'Banks\' main assets are loans. Book value reflects this better than earnings which can be cyclical. A well-run private bank trades at 2-4x P/B, PSU banks at 0.8-1.5x.'
      }
    ],
    relatedModules: ['pe-ratio-explained']
  },

  'fair-value-forecaster': {
    toolId: 'fair-value-forecaster',
    toolName: 'Fair Value Forecaster',
    quickTip: 'Estimates intrinsic value using DCF and relative valuation methods',
    concepts: ['dcf', 'free-cash-flow', 'pe-ratio'],
    keyTerms: [
      {
        term: 'Intrinsic Value',
        definition: 'The "true" value of a stock based on fundamentals, regardless of market price.',
      },
      {
        term: 'DCF Value',
        definition: 'Present value of all future cash flows the company will generate.',
        formula: 'DCF = Σ FCF/(1+r)^t + Terminal Value'
      },
      {
        term: 'Margin of Safety',
        definition: 'Buying below intrinsic value to protect against errors in estimation.',
        formula: 'MoS = (Intrinsic Value - Market Price) / Intrinsic Value × 100'
      },
      {
        term: 'Terminal Value',
        definition: 'Value of all cash flows beyond the forecast period (usually 5-10 years).'
      }
    ],
    howToUse: [
      'Check the estimated fair value vs current market price',
      'Look at the margin of safety percentage',
      'Review the sensitivity table for different growth assumptions',
      'Compare DCF value with relative valuation (P/E based)'
    ],
    proTips: [
      'Never trust a single fair value number - use ranges',
      'Terminal value often accounts for 60-80% of DCF - be conservative',
      'Check what growth rate is implied by current price'
    ],
    commonQuestions: [
      {
        question: 'Why does small change in growth rate change value so much?',
        answer: 'DCF is highly sensitive to growth and discount rate. A 2% change in perpetual growth can change value by 30-40%. This is why margin of safety is crucial.'
      },
      {
        question: 'Should I trust the DCF value?',
        answer: 'DCF is only as good as its assumptions. Use it as one input, not the only input. Compare with other methods and apply margin of safety.'
      }
    ],
    relatedModules: ['pe-ratio-explained']
  },

  'piotroski-score': {
    toolId: 'piotroski-score',
    toolName: 'Piotroski F-Score',
    quickTip: 'Financial health score from 0-9 based on profitability, leverage, and efficiency',
    concepts: ['piotroski-f-score', 'roe', 'free-cash-flow'],
    keyTerms: [
      {
        term: 'F-Score',
        definition: 'A 0-9 score where each point represents passing one of 9 financial health tests.',
      },
      {
        term: 'Profitability (4 pts)',
        definition: 'Positive ROA, positive operating cash flow, improving ROA, OCF > Net Income'
      },
      {
        term: 'Leverage (3 pts)',
        definition: 'Decreasing debt ratio, improving current ratio, no share dilution'
      },
      {
        term: 'Efficiency (2 pts)',
        definition: 'Improving gross margin, improving asset turnover'
      }
    ],
    howToUse: [
      'Score 8-9: Strong financial health, good buy candidate',
      'Score 5-7: Average, need more analysis',
      'Score 0-4: Weak fundamentals, avoid or investigate deeply',
      'Look for improving scores over consecutive years'
    ],
    proTips: [
      'Piotroski score works best for value stocks (low P/B)',
      'A score of 8 with low P/B is a classic value opportunity',
      'Watch for companies where score is improving year-over-year'
    ],
    commonQuestions: [
      {
        question: 'Can a good company have low Piotroski score?',
        answer: 'Yes, temporarily. A company investing heavily for growth might fail some tests (dilution, lower ROA). Check why the score is low.'
      }
    ],
    relatedModules: ['pe-ratio-explained', 'risk-management-101']
  },

  'dupont-analysis': {
    toolId: 'dupont-analysis',
    toolName: 'DuPont Analysis',
    quickTip: 'Breaks down ROE into profit margin, asset turnover, and leverage components',
    concepts: ['roe', 'roce'],
    keyTerms: [
      {
        term: 'DuPont Formula',
        definition: 'ROE = Profit Margin × Asset Turnover × Financial Leverage',
        formula: 'ROE = (NI/Rev) × (Rev/Assets) × (Assets/Equity)'
      },
      {
        term: 'Profit Margin',
        definition: 'How much profit from each rupee of sales. Higher is better.',
        formula: 'Net Income / Revenue'
      },
      {
        term: 'Asset Turnover',
        definition: 'How efficiently assets generate sales. Higher is better.',
        formula: 'Revenue / Total Assets'
      },
      {
        term: 'Financial Leverage',
        definition: 'How much debt is used. Higher means more risk.',
        formula: 'Total Assets / Shareholders Equity'
      }
    ],
    howToUse: [
      'Identify which component drives ROE',
      'High ROE from leverage is risky; from margins is quality',
      'Compare components vs industry peers',
      'Track changes over time'
    ],
    proTips: [
      'Quality companies have high ROE from margins, not leverage',
      'Asset-light businesses (IT) have high turnover; capital-intensive (steel) have low',
      'If leverage is driving ROE, check debt serviceability'
    ],
    commonQuestions: [
      {
        question: 'Is high ROE always good?',
        answer: 'Not if it comes from excessive leverage. DuPont analysis reveals whether ROE is from genuine efficiency (margins, turnover) or just debt (leverage).'
      }
    ],
    relatedModules: ['pe-ratio-explained']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TECHNICAL TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  'candlestick-hero': {
    toolId: 'candlestick-hero',
    toolName: 'Candlestick Hero',
    quickTip: 'Identifies and explains candlestick patterns for reversal and continuation signals',
    concepts: ['candlestick-patterns', 'support-resistance'],
    keyTerms: [
      {
        term: 'Doji',
        definition: 'Candle where open ≈ close, showing indecision. Potential reversal signal.'
      },
      {
        term: 'Hammer',
        definition: 'Small body at top, long lower wick. Bullish reversal after downtrend.'
      },
      {
        term: 'Engulfing',
        definition: 'Second candle completely engulfs first. Strong reversal pattern.'
      },
      {
        term: 'Morning Star',
        definition: 'Three-candle bullish reversal: red candle, small body, green candle.'
      }
    ],
    howToUse: [
      'Look for patterns at key support/resistance levels',
      'Confirm with volume (high volume = stronger signal)',
      'Wait for candle close before acting',
      'Use higher timeframes for more reliable signals'
    ],
    proTips: [
      'Patterns in isolation are weak; context is everything',
      'Daily patterns are more reliable than 5-minute patterns',
      'Combine with indicators (RSI oversold + hammer = strong buy)'
    ],
    commonQuestions: [
      {
        question: 'Which candlestick patterns are most reliable?',
        answer: 'Engulfing patterns and Morning/Evening Stars have highest reliability. Single candle patterns like doji need more confirmation.'
      }
    ],
    relatedModules: ['candlestick-basics']
  },

  'price-structure': {
    toolId: 'price-structure',
    toolName: 'Price Structure',
    quickTip: 'Shows key support/resistance levels, pivot points, and CPR for trading decisions',
    concepts: ['support-resistance', 'pivot-points'],
    keyTerms: [
      {
        term: 'Support',
        definition: 'Price level where buying pressure exceeds selling. Price tends to bounce.'
      },
      {
        term: 'Resistance',
        definition: 'Price level where selling pressure exceeds buying. Price tends to reject.'
      },
      {
        term: 'CPR (Central Pivot Range)',
        definition: 'Three levels (TC, Pivot, BC) from previous day. Key for intraday trading.',
        formula: 'Pivot = (H+L+C)/3, BC = (H+L)/2, TC = (Pivot-BC)+Pivot'
      },
      {
        term: 'PDH/PDL',
        definition: 'Previous Day High and Low. Important reference points.'
      }
    ],
    howToUse: [
      'Identify bias: Price above CPR = bullish, below = bearish',
      'Narrow CPR = expect trending day',
      'Wide CPR = expect ranging day',
      'Trade bounces from support, rejections from resistance'
    ],
    proTips: [
      'Virgin CPR (untested previous day) is stronger',
      'Multiple confluences at same level = stronger S/R',
      'Broken resistance becomes support (and vice versa)'
    ],
    commonQuestions: [
      {
        question: 'How accurate is CPR for intraday trading?',
        answer: 'CPR is very popular in India and works well because many traders watch it, making it self-fulfilling. Best when combined with volume and trend.'
      }
    ],
    relatedModules: ['support-resistance-basics']
  },

  'technical-indicators': {
    toolId: 'technical-indicators',
    toolName: 'Technical Indicators',
    quickTip: 'RSI, MACD, Bollinger Bands and other momentum/trend indicators',
    concepts: ['rsi', 'macd', 'moving-averages'],
    keyTerms: [
      {
        term: 'RSI',
        definition: 'Momentum oscillator 0-100. Above 70 = overbought, below 30 = oversold.',
        formula: 'RSI = 100 - [100/(1 + RS)]'
      },
      {
        term: 'MACD',
        definition: 'Trend-following momentum indicator. Crossovers signal trend changes.',
        formula: 'MACD = 12 EMA - 26 EMA, Signal = 9 EMA of MACD'
      },
      {
        term: 'Bollinger Bands',
        definition: '20 SMA with 2 standard deviation bands. Shows volatility and extremes.',
      },
      {
        term: 'Divergence',
        definition: 'Price and indicator moving opposite directions. Signals potential reversal.'
      }
    ],
    howToUse: [
      'Use RSI for overbought/oversold and divergences',
      'Use MACD for trend direction and momentum',
      'Combine multiple indicators for confirmation',
      'Adjust indicator settings based on timeframe'
    ],
    proTips: [
      'In strong trends, RSI can stay overbought/oversold for long',
      'MACD crossovers near zero line are most significant',
      'Divergences need price confirmation before trading'
    ],
    commonQuestions: [
      {
        question: 'How many indicators should I use?',
        answer: 'Quality over quantity. 2-3 non-correlated indicators are enough. Using 10 indicators just creates confusion and conflicting signals.'
      }
    ],
    relatedModules: ['rsi-macd-mastery', 'moving-averages-strategy']
  },

  'pattern-matcher': {
    toolId: 'pattern-matcher',
    toolName: 'Pattern Matcher',
    quickTip: 'Identifies chart patterns like Head & Shoulders, triangles, flags with historical success rates',
    concepts: ['candlestick-patterns', 'support-resistance'],
    keyTerms: [
      {
        term: 'Head & Shoulders',
        definition: 'Reversal pattern with three peaks, middle highest. Bearish at tops.'
      },
      {
        term: 'Double Top/Bottom',
        definition: 'Two peaks/troughs at similar level. Reversal pattern.'
      },
      {
        term: 'Triangle',
        definition: 'Converging trendlines. Breakout direction determines next move.'
      },
      {
        term: 'Flag/Pennant',
        definition: 'Continuation pattern. Brief pause before trend resumes.'
      }
    ],
    howToUse: [
      'Identify the pattern and its completion criteria',
      'Wait for breakout with volume confirmation',
      'Measure pattern height for target projection',
      'Place stop loss beyond pattern boundary'
    ],
    proTips: [
      'Patterns work better on higher timeframes',
      'Volume should decline during pattern, expand on breakout',
      'Failed patterns often lead to moves in opposite direction'
    ],
    commonQuestions: [
      {
        question: 'Do chart patterns really work?',
        answer: 'They work because many traders watch them, creating self-fulfilling prophecy. Success rate varies: some patterns have 60-70% accuracy when properly identified.'
      }
    ],
    relatedModules: ['candlestick-basics', 'support-resistance-basics']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // F&O TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  'options-strategy': {
    toolId: 'options-strategy',
    toolName: 'Options Strategy Explainer',
    quickTip: 'Analyzes option positions showing Greeks, max profit/loss, and breakeven points',
    concepts: ['option-greeks', 'open-interest'],
    keyTerms: [
      {
        term: 'Delta',
        definition: 'Option price change per ₹1 move in underlying. Also probability of expiring ITM.'
      },
      {
        term: 'Theta',
        definition: 'Daily time decay. Options lose value each day (hurts buyers, helps sellers).'
      },
      {
        term: 'IV (Implied Volatility)',
        definition: 'Market\'s expectation of future volatility. High IV = expensive options.'
      },
      {
        term: 'Max Pain',
        definition: 'Strike price where option buyers lose most money. Price often gravitates here.'
      }
    ],
    howToUse: [
      'Analyze Greeks to understand position risk',
      'Check max profit and max loss before entering',
      'Identify breakeven points',
      'Monitor IV for entry timing (high IV = sell, low IV = buy)'
    ],
    proTips: [
      'Sell options when IV is high (before events), buy when IV is low',
      'ATM options have highest theta decay and gamma risk',
      'Weekly options have extreme theta decay on Wednesday/Thursday'
    ],
    commonQuestions: [
      {
        question: 'Why did my option lose money when stock moved in my direction?',
        answer: 'Likely IV crush or theta decay. If you bought before an event (high IV) and held after event (IV crush), option loses value even if direction is right.'
      }
    ],
    relatedModules: ['fno-basics', 'options-strategies']
  },

  'fno-risk-advisor': {
    toolId: 'fno-risk-advisor',
    toolName: 'F&O Risk Advisor',
    quickTip: 'Calculates position size for F&O trades based on your risk tolerance and capital',
    concepts: ['position-sizing', 'stop-loss', 'risk-reward-ratio'],
    keyTerms: [
      {
        term: 'Position Size',
        definition: 'Number of lots to trade based on risk management rules.'
      },
      {
        term: 'Risk per Trade',
        definition: 'Maximum amount you\'re willing to lose. Usually 1-2% of capital.'
      },
      {
        term: 'Lot Size',
        definition: 'Fixed contract size. Nifty = 50, Bank Nifty = 15.'
      },
      {
        term: 'Margin Requirement',
        definition: 'Capital blocked by broker. SPAN + Exposure margin.'
      }
    ],
    howToUse: [
      'Enter your total trading capital',
      'Set risk per trade (1-2% recommended)',
      'Input entry and stop loss levels',
      'Tool calculates safe number of lots'
    ],
    proTips: [
      'Size based on risk, not available margin',
      'Account for slippage in volatile conditions',
      'Reduce size after consecutive losses'
    ],
    commonQuestions: [
      {
        question: 'Why does the tool suggest fewer lots than I can afford?',
        answer: 'The tool sizes based on risk, not margin. Just because you have margin for 10 lots doesn\'t mean you should trade 10 lots if your stop loss risk exceeds 2%.'
      }
    ],
    relatedModules: ['risk-management-101', 'fno-basics']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RISK TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  'trade-expectancy': {
    toolId: 'trade-expectancy',
    toolName: 'Trade Expectancy Calculator',
    quickTip: 'Calculates expected value per trade based on win rate and risk-reward ratio',
    concepts: ['risk-reward-ratio', 'position-sizing'],
    keyTerms: [
      {
        term: 'Expectancy',
        definition: 'Average amount you expect to win/lose per trade over many trades.',
        formula: 'E = (Win% × Avg Win) - (Loss% × Avg Loss)'
      },
      {
        term: 'R-Multiple',
        definition: 'Trade result expressed as multiple of risk taken. 2R = made twice your risk.'
      },
      {
        term: 'Profit Factor',
        definition: 'Gross profits divided by gross losses. Above 1.5 is good.',
        formula: 'PF = Total Wins / Total Losses'
      },
      {
        term: 'Win Rate',
        definition: 'Percentage of trades that are profitable.'
      }
    ],
    howToUse: [
      'Enter your win rate from trading history',
      'Enter average winning and losing trade sizes',
      'Review if expectancy is positive',
      'Adjust RRR or system to improve expectancy'
    ],
    proTips: [
      'Positive expectancy is necessary but not sufficient for profits',
      'Even positive expectancy systems have losing streaks',
      'Track actual R-multiples in your journal'
    ],
    commonQuestions: [
      {
        question: 'What is a good expectancy value?',
        answer: 'Any positive expectancy is profitable long-term. Expectancy of 0.3R means you make 0.3× your risk per trade on average. Top traders achieve 0.5R or higher.'
      }
    ],
    relatedModules: ['risk-management-101']
  },

  'trade-journal': {
    toolId: 'trade-journal',
    toolName: 'Trade Journal Analytics',
    quickTip: 'Analyzes your trading patterns, identifies mistakes, and tracks improvement',
    concepts: ['fomo', 'revenge-trading', 'overtrading'],
    keyTerms: [
      {
        term: 'Discipline Score',
        definition: 'Percentage of trades that followed your trading plan rules.'
      },
      {
        term: 'Plan Adherence',
        definition: 'Whether entry, exit, and sizing matched your pre-trade plan.'
      },
      {
        term: 'Emotional Trades',
        definition: 'Trades taken due to FOMO, revenge, or other emotions rather than system.'
      },
      {
        term: 'Session Analysis',
        definition: 'Performance breakdown by time of day, day of week, market condition.'
      }
    ],
    howToUse: [
      'Log every trade with entry/exit/reasoning',
      'Tag trades by setup type and emotional state',
      'Review weekly for patterns in mistakes',
      'Track discipline score over time'
    ],
    proTips: [
      'The review process is more valuable than the logging',
      'Look for time-of-day patterns in your P&L',
      'Identify which setups actually make money'
    ],
    commonQuestions: [
      {
        question: 'What should I write in my trading journal?',
        answer: 'Entry/exit with screenshots, why you took the trade, what the plan was, how you felt, whether you followed rules, and what you learned.'
      }
    ],
    relatedModules: ['risk-management-101']
  },

  'drawdown-var': {
    toolId: 'drawdown-var',
    toolName: 'Drawdown & VaR Analysis',
    quickTip: 'Tracks portfolio drawdown and estimates potential loss under various scenarios',
    concepts: ['drawdown', 'sharpe-ratio'],
    keyTerms: [
      {
        term: 'Max Drawdown',
        definition: 'Largest peak-to-trough decline in portfolio value.',
        formula: 'MDD = (Peak - Trough) / Peak × 100'
      },
      {
        term: 'VaR (Value at Risk)',
        definition: 'Maximum expected loss at given confidence level (e.g., 95% VaR).'
      },
      {
        term: 'Underwater Curve',
        definition: 'Chart showing how long portfolio stayed below previous peaks.'
      },
      {
        term: 'Recovery Time',
        definition: 'Time taken to recover from drawdown to new equity high.'
      }
    ],
    howToUse: [
      'Monitor current drawdown vs historical max',
      'Set "uncle point" - max acceptable drawdown',
      'Use VaR to size overall portfolio risk',
      'Track recovery time for realistic expectations'
    ],
    proTips: [
      'Professional traders aim for MDD < 20%',
      'Drawdown duration can be as painful as depth',
      'Reduce position sizes after significant drawdowns'
    ],
    commonQuestions: [
      {
        question: 'What should be my maximum acceptable drawdown?',
        answer: 'Depends on strategy and psychology. Most can\'t handle more than 20-25% without making emotional mistakes. Set your "uncle point" lower than what you think you can handle.'
      }
    ],
    relatedModules: ['risk-management-101']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MARKET ANALYSIS TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  'delivery-analysis': {
    toolId: 'delivery-analysis',
    toolName: 'Delivery Analysis',
    quickTip: 'Analyzes delivery percentage and volume patterns to identify institutional activity',
    concepts: ['volume-analysis'],
    keyTerms: [
      {
        term: 'Delivery Percentage',
        definition: 'Percentage of traded shares that result in actual ownership transfer.',
        formula: 'Delivery % = Delivery Volume / Total Volume × 100'
      },
      {
        term: 'Bulk Deal',
        definition: 'Single transaction of 0.5%+ of company shares. Shows large player activity.'
      },
      {
        term: 'Block Deal',
        definition: 'Trade of 5 lakh+ shares or ₹10 Cr+ in value. Institutional transaction.'
      },
      {
        term: 'Accumulation',
        definition: 'Gradual buying over time. High delivery + stable/rising price.'
      }
    ],
    howToUse: [
      'Look for delivery > 50% with price increase = genuine buying',
      'Delivery < 30% suggests speculative trading',
      'Track bulk/block deals for institutional interest',
      'Compare delivery % vs historical average'
    ],
    proTips: [
      'High delivery during consolidation suggests accumulation',
      'Sudden spike in delivery after long accumulation = potential breakout',
      'Low delivery rallies often retrace'
    ],
    commonQuestions: [
      {
        question: 'What is a good delivery percentage?',
        answer: 'For conviction-based buying, above 50% is strong. Large-caps typically have 30-50%, mid-caps can have 20-40%. Compare to stock\'s own history.'
      }
    ],
    relatedModules: ['support-resistance-basics']
  },

  'market-regime-radar': {
    toolId: 'market-regime-radar',
    toolName: 'Market Regime Radar',
    quickTip: 'Identifies current market condition: trending, ranging, or volatile',
    concepts: ['moving-averages'],
    keyTerms: [
      {
        term: 'Market Regime',
        definition: 'Current state of the market: bull, bear, sideways, or high volatility.'
      },
      {
        term: 'Trend Strength',
        definition: 'How strong the current trend is. Measured by ADX or MA alignment.'
      },
      {
        term: 'Risk-On/Risk-Off',
        definition: 'Market mood. Risk-on favors stocks, risk-off favors safe assets.'
      },
      {
        term: 'Sector Rotation',
        definition: 'Money moving between sectors based on economic cycle.'
      }
    ],
    howToUse: [
      'Check regime before selecting strategy',
      'Trending market: Use trend-following strategies',
      'Ranging market: Use mean-reversion or range strategies',
      'Volatile market: Reduce position sizes'
    ],
    proTips: [
      'The same strategy doesn\'t work in all regimes',
      'Identifying regime change early gives you an edge',
      'When in doubt, stay out or reduce size'
    ],
    commonQuestions: [
      {
        question: 'How do I know if the market is trending or ranging?',
        answer: 'Check ADX (above 25 = trending), MA alignment (orderly = trending, tangled = ranging), and price action (clear swings = trending, choppy = ranging).'
      }
    ],
    relatedModules: ['moving-averages-strategy']
  },

  'narrative-theme': {
    toolId: 'narrative-theme',
    toolName: 'Narrative Theme Tracker',
    quickTip: 'Tracks emerging market themes and sector momentum for positional opportunities',
    concepts: [],
    keyTerms: [
      {
        term: 'Market Theme',
        definition: 'A dominant narrative driving multiple stocks. E.g., "AI boom", "Defence spending".'
      },
      {
        term: 'Theme Leaders',
        definition: 'Stocks that move first and most in a theme. Identify these for best returns.'
      },
      {
        term: 'Theme Laggards',
        definition: 'Stocks that catch up later. Can offer entry if theme is still valid.'
      },
      {
        term: 'FII/DII Flow',
        definition: 'Foreign and Domestic institutional money flow. Drives large market moves.'
      }
    ],
    howToUse: [
      'Identify emerging themes from news and sector performance',
      'Find theme leaders using relative strength',
      'Track institutional flows for confirmation',
      'Exit themes when narrative changes or leaders weaken'
    ],
    proTips: [
      'Themes can last months or years - be patient',
      'Buy leaders, not laggards (unless catching up)',
      'FII buying in a theme validates the narrative'
    ],
    commonQuestions: [
      {
        question: 'How do I identify themes early?',
        answer: 'Watch for multiple stocks in a sector outperforming simultaneously, government policy announcements, global trends reaching India, and sudden FII interest in a sector.'
      }
    ],
    relatedModules: []
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW SCALPER/INTRADAY TOOLS (v25)
  // ═══════════════════════════════════════════════════════════════════════════

  'volume-profile': {
    toolId: 'volume-profile',
    toolName: 'Volume Profile',
    quickTip: 'Shows where most trading happened at each price level - reveals true support/resistance',
    concepts: ['volume-analysis', 'support-resistance'],
    keyTerms: [
      {
        term: 'POC (Point of Control)',
        definition: 'The price level with the highest trading volume. Acts as a magnet for price.',
        formula: 'POC = Price level with maximum volume'
      },
      {
        term: 'VAH (Value Area High)',
        definition: 'Upper boundary of the value area. 70% of volume traded between VAH and VAL.',
        formula: 'Top of range containing 70% of volume'
      },
      {
        term: 'VAL (Value Area Low)',
        definition: 'Lower boundary of the value area. Breaking below VAL is bearish.',
        formula: 'Bottom of range containing 70% of volume'
      },
      {
        term: 'HVN (High Volume Node)',
        definition: 'Price levels with heavy trading. Act as support/resistance zones.',
        formula: 'Local maxima in volume distribution'
      },
      {
        term: 'LVN (Low Volume Node)',
        definition: 'Price levels with light trading. Price moves fast through these zones.',
        formula: 'Local minima in volume distribution'
      }
    ],
    howToUse: [
      'Identify POC as the "fair value" price for the session',
      'Trade bounces off VAH/VAL when price returns to value area',
      'Use LVN zones to set targets - price accelerates through them',
      'Watch for rejection from HVN for reversal setups'
    ],
    proTips: [
      'P-Shape profile = buying pressure, expect higher prices',
      'b-Shape profile = selling pressure, expect lower prices',
      'D-Shape profile = consolidation, wait for breakout',
      'POC + VWAP confluence = very strong level'
    ],
    commonQuestions: [
      {
        question: 'What timeframe should I use for volume profile?',
        answer: 'For scalping use session profile (today only). For swing trading use weekly or monthly. Multi-day profiles show more significant levels.'
      },
      {
        question: 'How is volume profile different from regular volume?',
        answer: 'Regular volume shows total volume per time period. Volume profile shows volume at each price level, revealing where actual supply/demand exists.'
      }
    ],
    relatedModules: ['volume-analysis-basics']
  },

  'vwap-analysis': {
    toolId: 'vwap-analysis',
    toolName: 'VWAP Analysis',
    quickTip: 'Volume-weighted average price - the benchmark institutional traders use',
    concepts: ['volume-analysis', 'moving-averages'],
    keyTerms: [
      {
        term: 'VWAP',
        definition: 'Average price weighted by volume. Resets each session. Institutions use it as benchmark.',
        formula: 'VWAP = Σ(Price × Volume) / Σ(Volume)'
      },
      {
        term: 'VWAP Bands',
        definition: 'Standard deviation bands around VWAP. +1σ and +2σ show overbought, -1σ and -2σ show oversold.',
        formula: 'Band = VWAP ± (n × Standard Deviation)'
      },
      {
        term: 'Anchored VWAP',
        definition: 'VWAP calculated from a specific point (earnings, breakout, swing low). Shows average cost of holders since that event.',
        formula: 'Same as VWAP but starting from anchor point'
      },
      {
        term: 'VWAP Slope',
        definition: 'Direction of VWAP line. Rising = bullish intraday trend. Falling = bearish.',
        formula: 'Rate of change in VWAP'
      }
    ],
    howToUse: [
      'Price above VWAP = bullish intraday bias, below = bearish',
      'Buy pullbacks to VWAP in uptrend, sell rallies to VWAP in downtrend',
      'Use ±2σ bands for mean reversion trades',
      'Anchor VWAP to swing points for swing trade support/resistance'
    ],
    proTips: [
      'First hour VWAP is unreliable - wait for it to stabilize',
      'VWAP works best on liquid stocks like Nifty 50 names',
      'Multiple VWAP touches in a day = strong magnetic level',
      'Anchored VWAP from earnings shows institutional cost basis'
    ],
    commonQuestions: [
      {
        question: 'Why do institutions care about VWAP?',
        answer: 'Large orders need to execute at or better than VWAP to show skill. If an institution buys below VWAP, they beat the benchmark. VWAP is their performance metric.'
      },
      {
        question: 'How is VWAP different from a moving average?',
        answer: 'VWAP resets daily and weights by volume. MAs use equal weight for each candle. VWAP shows where actual money traded, MAs just average price.'
      }
    ],
    relatedModules: ['volume-analysis-basics', 'moving-averages-strategy']
  },

  'orb-analysis': {
    toolId: 'orb-analysis',
    toolName: 'Opening Range Breakout',
    quickTip: 'The first 15-30 minutes sets the tone for the day - trade the breakout',
    concepts: ['support-resistance', 'candlestick-patterns'],
    keyTerms: [
      {
        term: 'Opening Range (OR)',
        definition: 'The high and low of the first 5, 15, or 30 minutes. Sets key levels for the day.',
        formula: 'OR High = High of first N minutes, OR Low = Low of first N minutes'
      },
      {
        term: 'ORB Breakout',
        definition: 'When price decisively closes above OR High (long) or below OR Low (short).',
        formula: 'Price > OR High + buffer = Long signal'
      },
      {
        term: 'Gap Classification',
        definition: 'Gap Up/Down based on previous close. Full gap = opens beyond previous range. Partial gap = opens within previous range.',
        formula: 'Gap % = (Today Open - Previous Close) / Previous Close × 100'
      },
      {
        term: 'Gap Fill',
        definition: 'When price returns to previous close level. Gaps often fill same day.',
        formula: 'Price returning to previous close'
      }
    ],
    howToUse: [
      'Wait for first 15-30 min to establish the range',
      'Enter on confirmed breakout with volume',
      'Stop loss below OR low for longs, above OR high for shorts',
      'Target 1x OR range, then trail for extended moves'
    ],
    proTips: [
      '15-min ORB is most popular in India (9:15-9:30 range)',
      'Gap ups that hold above previous high = strong bullish',
      'Low range OR (tight consolidation) leads to bigger moves',
      'Avoid ORB on F&O expiry days - too volatile'
    ],
    commonQuestions: [
      {
        question: 'Which ORB timeframe is best - 5, 15, or 30 minutes?',
        answer: '15 minutes is the sweet spot for Indian markets. 5 min is too noise-prone, 30 min misses early moves. Use 15 min for Nifty/Bank Nifty.'
      },
      {
        question: 'How do I avoid false breakouts?',
        answer: 'Wait for a close above/below OR with at least 1.2x average volume. The more time price consolidates at OR boundary before breaking, the more reliable the breakout.'
      }
    ],
    relatedModules: ['candlestick-basics', 'support-resistance-basics']
  },

  'fibonacci-levels': {
    toolId: 'fibonacci-levels',
    toolName: 'Fibonacci Levels',
    quickTip: 'Natural retracement and extension levels based on the golden ratio',
    concepts: ['support-resistance', 'trend-analysis'],
    keyTerms: [
      {
        term: 'Fibonacci Retracement',
        definition: 'Levels where pullbacks tend to find support in an uptrend or resistance in a downtrend.',
        formula: 'Key levels: 23.6%, 38.2%, 50%, 61.8%, 78.6%'
      },
      {
        term: 'Golden Ratio (61.8%)',
        definition: 'The most important Fib level. Derived from Fibonacci sequence. Strong support/resistance.',
        formula: '0.618 = 1 / 1.618'
      },
      {
        term: 'Golden Pocket',
        definition: 'Zone between 61.8% and 65% retracement. High probability bounce area.',
        formula: '61.8% to 65% zone'
      },
      {
        term: 'Fibonacci Extension',
        definition: 'Targets for price after completing retracement. Used for profit targets.',
        formula: 'Key targets: 127.2%, 161.8%, 200%, 261.8%'
      }
    ],
    howToUse: [
      'Draw from swing low to swing high in uptrend (or vice versa)',
      'Look for entries at 38.2%, 50%, or 61.8% retracement',
      'Set targets at 127.2% and 161.8% extension',
      'Combine with other support/resistance for confluence'
    ],
    proTips: [
      'Shallow retracement (23.6-38.2%) = strong trend, chase is okay',
      'Deep retracement (61.8-78.6%) = weak trend, wait for confirmation',
      'Golden pocket (61.8-65%) is the best risk/reward entry zone',
      'Retracement beyond 78.6% often leads to full trend reversal'
    ],
    commonQuestions: [
      {
        question: 'Why do Fibonacci levels work?',
        answer: 'Self-fulfilling prophecy - so many traders use them that they become significant. Also, natural retracements in markets tend to cluster around these ratios due to market psychology.'
      },
      {
        question: 'Which swings do I use for Fibonacci?',
        answer: 'Use clear, significant swing highs and lows. The more obvious the swing (visible on higher timeframes), the more reliable the Fib levels. Weekly/daily swings matter more than intraday.'
      }
    ],
    relatedModules: ['support-resistance-basics', 'trend-analysis']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LONG-TERM INVESTOR TOOL (v25)
  // ═══════════════════════════════════════════════════════════════════════════

  'tax-calculator': {
    toolId: 'tax-calculator',
    toolName: 'Tax Calculator',
    quickTip: 'Calculate LTCG/STCG tax liability and find tax-loss harvesting opportunities',
    concepts: ['portfolio-management'],
    keyTerms: [
      {
        term: 'LTCG (Long-Term Capital Gains)',
        definition: 'Gains on stocks held >12 months. Taxed at 12.5% above ₹1.25L exemption.',
        formula: 'LTCG Tax = (Gains - ₹1.25L) × 12.5%'
      },
      {
        term: 'STCG (Short-Term Capital Gains)',
        definition: 'Gains on stocks held <12 months. Taxed at 20% flat rate.',
        formula: 'STCG Tax = Gains × 20%'
      },
      {
        term: 'Tax-Loss Harvesting',
        definition: 'Selling losing positions to book losses that offset gains and reduce tax.',
        formula: 'Tax Saved = Loss × Tax Rate'
      },
      {
        term: 'Grandfathering',
        definition: 'Pre-31 Jan 2018 gains are exempt. Cost basis is higher of actual cost or 31 Jan 2018 price.',
        formula: 'Cost = Max(Actual Cost, Price on 31-Jan-2018)'
      },
      {
        term: 'Dividend Tax',
        definition: 'Dividends taxed at your income tax slab rate. TDS of 10% if >₹10,000 from a company.',
        formula: 'Net Dividend = Dividend - (Dividend × Slab Rate)'
      }
    ],
    howToUse: [
      'Review unrealized gains/losses before financial year end',
      'Harvest losses to offset realized gains',
      'Hold winners approaching 12-month mark for lower tax rate',
      'Track dividend income for advance tax planning'
    ],
    proTips: [
      'LTCG losses can only offset LTCG gains, not STCG',
      'Unused LTCG losses can be carried forward for 8 years',
      'Sell losers before March 31 to book losses in current FY',
      'Consider tax when deciding to hold vs sell winners near 12-month mark'
    ],
    commonQuestions: [
      {
        question: 'What changed in Budget 2024 for capital gains?',
        answer: 'LTCG increased from 10% to 12.5%, STCG increased from 15% to 20%. LTCG exemption increased from ₹1L to ₹1.25L. These apply from FY 2024-25.'
      },
      {
        question: 'Should I harvest tax losses even if I like the stock?',
        answer: 'Yes, you can sell to book the loss and buy back after 30 days (to avoid wash sale issues). The tax saving is real, and you can maintain your position.'
      }
    ],
    relatedModules: ['tax-planning-basics']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VALUE & QUALITY TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  'dcf-valuation': {
    toolId: 'dcf-valuation',
    toolName: 'DCF Valuation',
    quickTip: 'Calculates intrinsic value by discounting future cash flows to present value',
    concepts: ['dcf', 'free-cash-flow', 'wacc', 'terminal-value'],
    keyTerms: [
      { term: 'Free Cash Flow (FCF)', definition: 'Cash generated after all expenses and investments. The "real" profit.', formula: 'FCF = Operating Cash Flow - CapEx' },
      { term: 'WACC', definition: 'Weighted Average Cost of Capital - the discount rate used in DCF.', formula: 'WACC = (E/V × Re) + (D/V × Rd × (1-T))' },
      { term: 'Terminal Value', definition: 'Value of all cash flows beyond the forecast period.', formula: 'TV = FCF × (1+g) / (WACC - g)' },
      { term: 'Intrinsic Value', definition: 'The calculated "true" value of the stock based on fundamentals.' }
    ],
    howToUse: ['Project FCF for 5-10 years', 'Calculate terminal value', 'Discount to present value', 'Compare with market price'],
    proTips: ['Sensitivity test with different growth rates', 'DCF works best for stable, predictable businesses', 'Always use a margin of safety (20-30%)'],
    commonQuestions: [
      { question: 'What discount rate should I use?', answer: 'For Indian equities, 12-15% is typical. Use WACC for precision or your required return for simplicity.' }
    ],
    relatedModules: ['dcf-valuation-course']
  },

  'intrinsic-value-range': {
    toolId: 'intrinsic-value-range',
    toolName: 'Intrinsic Value Range',
    quickTip: 'Shows a range of fair values using multiple valuation methods',
    concepts: ['dcf', 'pe-ratio', 'book-value'],
    keyTerms: [
      { term: 'Bull Case', definition: 'Optimistic scenario with high growth assumptions.' },
      { term: 'Bear Case', definition: 'Pessimistic scenario with conservative assumptions.' },
      { term: 'Base Case', definition: 'Most likely scenario based on historical trends.' }
    ],
    howToUse: ['Compare current price to value range', 'Buy when price is in lower third', 'Be cautious when price exceeds bull case'],
    proTips: ['Wide ranges indicate high uncertainty', 'Narrow ranges suggest more predictable businesses'],
    commonQuestions: [
      { question: 'Which value should I use?', answer: 'Conservative investors use base-to-bear case. Growth investors may use base case.' }
    ],
    relatedModules: ['valuation-basics']
  },

  'multi-factor-scorecard': {
    toolId: 'multi-factor-scorecard',
    toolName: 'Multi-Factor Scorecard',
    quickTip: 'Scores stocks across value, quality, momentum, and growth factors',
    concepts: ['factor-investing', 'pe-ratio', 'roe', 'momentum'],
    keyTerms: [
      { term: 'Value Factor', definition: 'Cheap stocks relative to fundamentals (low P/E, P/B).' },
      { term: 'Quality Factor', definition: 'Companies with high ROE, stable earnings, low debt.' },
      { term: 'Momentum Factor', definition: 'Stocks with strong recent price performance tend to continue.' },
      { term: 'Size Factor', definition: 'Smaller companies historically outperform large caps.' }
    ],
    howToUse: ['Look for stocks scoring high on multiple factors', 'Avoid stocks with all low scores', 'Balance factors based on market cycle'],
    proTips: ['Quality + Value is the classic combination', 'Momentum works in trending markets', 'Factor performance rotates cyclically'],
    commonQuestions: [
      { question: 'Which factor is most important?', answer: 'Quality has the most consistent long-term performance. Value works best after corrections.' }
    ],
    relatedModules: ['factor-investing-101']
  },

  'altman-graham': {
    toolId: 'altman-graham',
    toolName: 'Altman-Graham Screen',
    quickTip: 'Classic value screens combining Altman Z-Score safety with Graham criteria',
    concepts: ['altman-z', 'graham-number', 'margin-of-safety'],
    keyTerms: [
      { term: 'Altman Z-Score', definition: 'Predicts bankruptcy probability. >2.99 is safe, <1.81 is danger zone.', formula: 'Z = 1.2A + 1.4B + 3.3C + 0.6D + 1.0E' },
      { term: 'Graham Number', definition: 'Maximum price a defensive investor should pay.', formula: 'Graham Number = √(22.5 × EPS × BVPS)' },
      { term: 'Net-Net', definition: 'Stock trading below net current asset value - Graham\'s deepest value screen.' }
    ],
    howToUse: ['Filter for Z-Score > 3 (safe companies)', 'Look for stocks below Graham Number', 'Verify with qualitative analysis'],
    proTips: ['Net-nets are rare in today\'s market', 'Z-Score is less reliable for financials', 'Graham criteria are very conservative'],
    commonQuestions: [
      { question: 'Are Graham\'s criteria still relevant?', answer: 'The principles are timeless, but exact numbers may need adjustment for modern markets.' }
    ],
    relatedModules: ['value-investing-classics']
  },

  'financial-health-dna': {
    toolId: 'financial-health-dna',
    toolName: 'Financial Health DNA',
    quickTip: 'Deep dive into balance sheet strength and financial structure',
    concepts: ['current-ratio', 'debt-to-equity', 'working-capital'],
    keyTerms: [
      { term: 'Current Ratio', definition: 'Ability to pay short-term debts.', formula: 'Current Assets / Current Liabilities' },
      { term: 'Debt-to-Equity', definition: 'Financial leverage - how much debt vs shareholder equity.', formula: 'Total Debt / Shareholders Equity' },
      { term: 'Interest Coverage', definition: 'Ability to pay interest from operating profit.', formula: 'EBIT / Interest Expense' }
    ],
    howToUse: ['Check current ratio > 1.5', 'D/E varies by industry - compare to peers', 'Interest coverage > 3x is comfortable'],
    proTips: ['Banks and NBFCs naturally have high D/E', 'Too low debt may indicate under-leveraging', 'Watch for deteriorating trends'],
    commonQuestions: [
      { question: 'What D/E ratio is good?', answer: 'For non-financials: <0.5 is conservative, 0.5-1 is moderate, >1 is aggressive. Compare within sector.' }
    ],
    relatedModules: ['financial-statement-analysis']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROWTH TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  'growth-summary': {
    toolId: 'growth-summary',
    toolName: 'Growth Summary',
    quickTip: 'Comprehensive view of revenue, profit, and earnings growth trends',
    concepts: ['cagr', 'revenue-growth', 'earnings-growth'],
    keyTerms: [
      { term: 'CAGR', definition: 'Compound Annual Growth Rate - smoothed annual growth over a period.', formula: 'CAGR = (End/Start)^(1/Years) - 1' },
      { term: 'Sequential Growth', definition: 'Quarter-over-quarter growth (QoQ).' },
      { term: 'YoY Growth', definition: 'Year-over-year comparison, removes seasonality.' }
    ],
    howToUse: ['Compare 3Y and 5Y CAGR for trend', 'Check if profit growth > revenue growth', 'Look for consistent QoQ improvement'],
    proTips: ['High growth needs to convert to cash eventually', 'Watch for growth slowing (decelerating)', 'PE expansion often accompanies accelerating growth'],
    commonQuestions: [
      { question: 'What growth rate justifies a high PE?', answer: 'PEG ratio helps - PE should roughly equal expected growth rate. PE of 50 needs 50% growth to be reasonable.' }
    ],
    relatedModules: ['growth-investing-basics']
  },

  'earnings-quality': {
    toolId: 'earnings-quality',
    toolName: 'Earnings Quality',
    quickTip: 'Assesses whether reported profits are sustainable and backed by cash',
    concepts: ['accruals', 'cash-conversion', 'earnings-manipulation'],
    keyTerms: [
      { term: 'Accruals Ratio', definition: 'High accruals suggest earnings may not be sustainable.', formula: '(Net Income - Operating Cash Flow) / Total Assets' },
      { term: 'Cash Conversion', definition: 'How much of profit converts to actual cash.', formula: 'Operating Cash Flow / Net Income' },
      { term: 'Sloan Accrual', definition: 'Stocks with high accruals tend to underperform.' }
    ],
    howToUse: ['Cash conversion > 80% is good', 'Accruals ratio should be low (<5%)', 'Compare trends over 3-5 years'],
    proTips: ['Consistently low cash conversion is a red flag', 'Growing receivables faster than sales = warning', 'Watch for frequent "one-time" adjustments'],
    commonQuestions: [
      { question: 'Why do earnings and cash differ?', answer: 'Accounting rules recognize revenue/expenses differently than cash flow. Large differences can indicate manipulation or timing issues.' }
    ],
    relatedModules: ['forensic-accounting-basics']
  },

  'earnings-stability': {
    toolId: 'earnings-stability',
    toolName: 'Earnings Stability',
    quickTip: 'Measures consistency and predictability of earnings over time',
    concepts: ['earnings-volatility', 'coefficient-of-variation'],
    keyTerms: [
      { term: 'Earnings Volatility', definition: 'Standard deviation of earnings growth rates.' },
      { term: 'Hit Rate', definition: 'Percentage of quarters meeting/beating estimates.' },
      { term: 'Earnings Surprise', definition: 'Actual vs expected earnings difference.' }
    ],
    howToUse: ['Stable earnings = reliable valuations', 'High volatility needs higher margin of safety', 'Check for seasonal patterns'],
    proTips: ['Stable earnings often command premium valuation', 'Cyclicals naturally have volatile earnings', 'FMCG/pharma typically most stable'],
    commonQuestions: [
      { question: 'Is volatility always bad?', answer: 'Not for traders who can time cycles. But for long-term investors, stability reduces risk and improves forecast accuracy.' }
    ],
    relatedModules: ['earnings-analysis']
  },

  'capital-allocation': {
    toolId: 'capital-allocation',
    toolName: 'Capital Allocation',
    quickTip: 'Analyzes how management deploys capital - dividends, buybacks, CapEx, M&A',
    concepts: ['roce', 'capital-efficiency', 'dividend-policy'],
    keyTerms: [
      { term: 'ROCE', definition: 'Return on Capital Employed - efficiency of all capital.', formula: 'EBIT / (Total Assets - Current Liabilities)' },
      { term: 'Reinvestment Rate', definition: 'Portion of earnings reinvested in the business.' },
      { term: 'Capital Intensity', definition: 'CapEx required per unit of revenue.' }
    ],
    howToUse: ['ROCE > WACC indicates value creation', 'Check if reinvestment drives growth', 'Monitor M&A track record'],
    proTips: ['Great businesses have high ROCE + high reinvestment', 'Frequent equity dilution is a red flag', 'Compare capital allocation to peers'],
    commonQuestions: [
      { question: 'Dividends vs buybacks - which is better?', answer: 'Buybacks when stock is undervalued, dividends when fully valued. Good management times this well.' }
    ],
    relatedModules: ['capital-allocation-mastery']
  },

  'efficiency-dashboard': {
    toolId: 'efficiency-dashboard',
    toolName: 'Efficiency Dashboard',
    quickTip: 'Tracks asset turnover, inventory turns, and operational efficiency',
    concepts: ['asset-turnover', 'inventory-turnover', 'receivables-turnover'],
    keyTerms: [
      { term: 'Asset Turnover', definition: 'Revenue generated per rupee of assets.', formula: 'Revenue / Total Assets' },
      { term: 'Inventory Turnover', definition: 'How many times inventory is sold and replaced.', formula: 'COGS / Average Inventory' },
      { term: 'Days Sales Outstanding', definition: 'Average days to collect receivables.', formula: '(Receivables / Revenue) × 365' }
    ],
    howToUse: ['Compare ratios to industry peers', 'Track trends over time', 'Higher turnover = more efficient'],
    proTips: ['Asset-light businesses have higher turnover', 'Improving turnover can boost ROE significantly', 'Very high inventory turnover may mean stockouts'],
    commonQuestions: [
      { question: 'What drives ROE improvement?', answer: 'DuPont analysis shows: Margin × Turnover × Leverage = ROE. Efficiency (turnover) is often overlooked.' }
    ],
    relatedModules: ['operational-analysis']
  },

  'management-quality': {
    toolId: 'management-quality',
    toolName: 'Management Quality',
    quickTip: 'Evaluates management through capital allocation track record and governance',
    concepts: ['corporate-governance', 'related-party-transactions'],
    keyTerms: [
      { term: 'Related Party Transactions', definition: 'Deals with promoter-linked entities. High levels are red flag.' },
      { term: 'Promoter Remuneration', definition: 'Salary paid to promoters vs company profits.' },
      { term: 'Capital Allocation Score', definition: 'Historical ROI on acquisitions, CapEx decisions.' }
    ],
    howToUse: ['Check RPT as % of revenue', 'Compare promoter salary to peers', 'Review past acquisition outcomes'],
    proTips: ['Good capital allocators are rare and valuable', 'Skin in the game (high promoter stake) aligns interests', 'Watch for pledge creep'],
    commonQuestions: [
      { question: 'How to assess management quality?', answer: 'Track record over 10+ years, capital allocation decisions, treatment of minorities, and communication transparency.' }
    ],
    relatedModules: ['management-evaluation']
  },

  'profit-vs-cash-divergence': {
    toolId: 'profit-vs-cash-divergence',
    toolName: 'Profit vs Cash Divergence',
    quickTip: 'Flags companies where accounting profit diverges from actual cash generation',
    concepts: ['accruals', 'cash-flow', 'earnings-quality'],
    keyTerms: [
      { term: 'CFO/PAT Ratio', definition: 'Operating cash flow to profit ratio. <80% needs scrutiny.', formula: 'Operating Cash Flow / Profit After Tax' },
      { term: 'Receivables Days', definition: 'Days to collect customer payments. Rising trend is warning.' },
      { term: 'Inventory Days', definition: 'Days inventory sits before selling. Rising = demand issue.' }
    ],
    howToUse: ['CFO should exceed PAT over time', 'Watch for persistent divergence', 'Check working capital trends'],
    proTips: ['One-time divergence is okay, persistent is concerning', 'Compare to industry norms', 'High-growth companies may have temporary divergence'],
    commonQuestions: [
      { question: 'Why would profits exceed cash?', answer: 'Revenue recognition timing, rising receivables, capitalizing expenses, or aggressive accounting.' }
    ],
    relatedModules: ['cash-flow-analysis']
  },

  'sales-profit-cash': {
    toolId: 'sales-profit-cash',
    toolName: 'Sales-Profit-Cash Flow',
    quickTip: 'Tracks conversion from top-line revenue to bottom-line cash',
    concepts: ['gross-margin', 'operating-margin', 'cash-conversion'],
    keyTerms: [
      { term: 'Gross Margin', definition: 'Profit after direct costs.', formula: '(Revenue - COGS) / Revenue' },
      { term: 'Operating Margin', definition: 'Profit after operating expenses.', formula: 'Operating Income / Revenue' },
      { term: 'Net Margin', definition: 'Final profit percentage.', formula: 'Net Income / Revenue' }
    ],
    howToUse: ['Margins should be stable or improving', 'Cash should track profit over time', 'Compare margin structure to peers'],
    proTips: ['Expanding margins with stable revenue is very bullish', 'Watch for one-time items inflating margins', 'Operating leverage means margins expand with scale'],
    commonQuestions: [
      { question: 'Which margin matters most?', answer: 'Operating margin for operations quality. Net margin for overall profitability. Gross margin for pricing power.' }
    ],
    relatedModules: ['profitability-analysis']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RISK TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  'risk-health-dashboard': {
    toolId: 'risk-health-dashboard',
    toolName: 'Risk Health Dashboard',
    quickTip: 'Comprehensive risk assessment covering financial, market, and operational risks',
    concepts: ['beta', 'volatility', 'debt-to-equity'],
    keyTerms: [
      { term: 'Beta', definition: 'Sensitivity to market moves. >1 = more volatile than market.' },
      { term: 'Volatility', definition: 'Standard deviation of returns. Higher = more risky.' },
      { term: 'Risk Score', definition: 'Composite score from multiple risk factors.' }
    ],
    howToUse: ['Higher risk needs higher expected return', 'Compare risk to similar stocks', 'Monitor risk score trends'],
    proTips: ['Low beta doesn\'t mean low risk (just low correlation)', 'Operational risks don\'t show in market data', 'Best risk analysis combines quant + qualitative'],
    commonQuestions: [
      { question: 'What risk level is acceptable?', answer: 'Depends on your portfolio. Core holdings should be lower risk. Satellite positions can take more risk.' }
    ],
    relatedModules: ['risk-management-101']
  },

  'bankruptcy-health': {
    toolId: 'bankruptcy-health',
    toolName: 'Bankruptcy Health',
    quickTip: 'Assesses probability of financial distress using Altman Z-Score and other metrics',
    concepts: ['altman-z', 'interest-coverage', 'debt-to-equity'],
    keyTerms: [
      { term: 'Altman Z-Score', definition: 'Bankruptcy prediction model. >2.99 safe, <1.81 danger.', formula: 'Z = 1.2(WC/TA) + 1.4(RE/TA) + 3.3(EBIT/TA) + 0.6(MVE/TL) + 1.0(S/TA)' },
      { term: 'Interest Coverage', definition: 'Ability to pay interest.', formula: 'EBIT / Interest Expense' },
      { term: 'Debt Service Coverage', definition: 'Ability to pay principal + interest.' }
    ],
    howToUse: ['Z-Score > 3 is safe zone', 'Interest coverage > 3x is comfortable', 'Watch for deteriorating trends'],
    proTips: ['Z-Score less reliable for banks/NBFCs', 'Combine with qualitative assessment', 'Check debt maturity schedule'],
    commonQuestions: [
      { question: 'Can a high debt company be safe?', answer: 'Yes, if cash flows are stable and predictable (like InvITs, utilities). Cyclical businesses need lower debt.' }
    ],
    relatedModules: ['credit-analysis']
  },

  'financial-stress-radar': {
    toolId: 'financial-stress-radar',
    toolName: 'Financial Stress Radar',
    quickTip: 'Early warning system for financial distress indicators',
    concepts: ['liquidity', 'solvency', 'cash-flow'],
    keyTerms: [
      { term: 'Quick Ratio', definition: 'Liquid assets to cover short-term debts.', formula: '(Current Assets - Inventory) / Current Liabilities' },
      { term: 'Cash Burn Rate', definition: 'How fast company is using cash reserves.' },
      { term: 'Stress Indicators', definition: 'Red flags like rising debt, falling margins, negative cash flow.' }
    ],
    howToUse: ['Monitor quarterly for trend changes', 'Act early on warning signals', 'Compare to historical levels'],
    proTips: ['Stress often appears in working capital first', 'Multiple small red flags = one big red flag', 'Good businesses can turn around early stress'],
    commonQuestions: [
      { question: 'What are early warning signs?', answer: 'Rising receivables days, shrinking margins, increasing debt, negative operating cash flow, auditor changes.' }
    ],
    relatedModules: ['distress-analysis']
  },

  'leverage-history': {
    toolId: 'leverage-history',
    toolName: 'Leverage History',
    quickTip: 'Tracks debt levels and financial leverage trends over time',
    concepts: ['debt-to-equity', 'interest-coverage', 'net-debt'],
    keyTerms: [
      { term: 'Net Debt', definition: 'Total debt minus cash and equivalents.', formula: 'Total Debt - Cash & Equivalents' },
      { term: 'Net Debt to EBITDA', definition: 'Years to repay debt from operating profit.' },
      { term: 'Leverage Trend', definition: 'Direction of debt levels over time.' }
    ],
    howToUse: ['Deleveraging trend is positive', 'Compare to industry norms', 'Check debt vs cash generation'],
    proTips: ['Rising leverage in cyclical downturn is dangerous', 'Some debt is good for tax efficiency', 'Watch for off-balance-sheet debt'],
    commonQuestions: [
      { question: 'Is deleveraging always good?', answer: 'Usually yes, but under-leveraging can mean missed growth opportunities. Optimal leverage depends on business stability.' }
    ],
    relatedModules: ['leverage-analysis']
  },

  'cashflow-stability-index': {
    toolId: 'cashflow-stability-index',
    toolName: 'Cashflow Stability Index',
    quickTip: 'Measures consistency and predictability of operating cash flows',
    concepts: ['cash-flow', 'volatility', 'sustainability'],
    keyTerms: [
      { term: 'CFO Volatility', definition: 'Standard deviation of operating cash flows.' },
      { term: 'CFO Consistency', definition: 'Percentage of positive CFO quarters.' },
      { term: 'CFO Trend', definition: 'Direction of cash flows over time.' }
    ],
    howToUse: ['Stable CFO supports reliable dividends', 'Volatile CFO needs higher safety margin', 'Compare to earnings stability'],
    proTips: ['CFO stability matters more than profit stability', 'Subscription businesses have most stable CFO', 'Working capital swings cause short-term volatility'],
    commonQuestions: [
      { question: 'CFO vs FCF - which to track?', answer: 'CFO for operations quality, FCF for investment capacity. Both should be positive and growing.' }
    ],
    relatedModules: ['cash-flow-analysis']
  },

  'working-capital-health': {
    toolId: 'working-capital-health',
    toolName: 'Working Capital Health',
    quickTip: 'Analyzes efficiency of managing receivables, inventory, and payables',
    concepts: ['working-capital', 'cash-conversion-cycle', 'liquidity'],
    keyTerms: [
      { term: 'Working Capital', definition: 'Current assets minus current liabilities.', formula: 'Current Assets - Current Liabilities' },
      { term: 'Cash Conversion Cycle', definition: 'Days to convert inventory to cash.', formula: 'DIO + DSO - DPO' },
      { term: 'Working Capital Ratio', definition: 'WC as percentage of revenue.' }
    ],
    howToUse: ['Negative CCC is ideal (get paid before paying)', 'Rising WC needs funding', 'Compare to industry peers'],
    proTips: ['FMCG companies often have negative working capital', 'Rising WC can trap cash flow', 'Seasonal businesses have WC swings'],
    commonQuestions: [
      { question: 'Is negative working capital bad?', answer: 'No! It\'s actually great - means suppliers fund your operations. Common in retail (advance payments).' }
    ],
    relatedModules: ['working-capital-management']
  },

  'warning-sentinel': {
    toolId: 'warning-sentinel',
    toolName: 'Warning Sentinel',
    quickTip: 'Automated red flag detection across financial and governance metrics',
    concepts: ['forensic-accounting', 'corporate-governance', 'red-flags'],
    keyTerms: [
      { term: 'Beneish M-Score', definition: 'Probability of earnings manipulation. >-1.78 suggests manipulation.' },
      { term: 'Audit Flags', definition: 'Qualified opinions, auditor changes, delays.' },
      { term: 'Governance Score', definition: 'Quality of board, disclosures, minority treatment.' }
    ],
    howToUse: ['Address red flags before investing', 'Multiple flags = avoid', 'Monitor for new warnings'],
    proTips: ['Auditor resignation is serious red flag', 'Complex group structures enable manipulation', 'Too-good-to-be-true usually isn\'t'],
    commonQuestions: [
      { question: 'How many red flags are acceptable?', answer: 'Zero for core holdings. One minor flag with explanation may be okay for speculative positions.' }
    ],
    relatedModules: ['forensic-analysis']
  },

  'crash-warning': {
    toolId: 'crash-warning',
    toolName: 'Crash Warning',
    quickTip: 'Technical and fundamental indicators suggesting potential sharp decline',
    concepts: ['momentum', 'overbought', 'distribution'],
    keyTerms: [
      { term: 'Distribution Days', definition: 'Days with high volume decline - institutions selling.' },
      { term: 'Climax Top', definition: 'Exhaustion pattern after extended rally.' },
      { term: 'Divergence', definition: 'Price making highs while indicators weaken.' }
    ],
    howToUse: ['Use for timing exits, not entries', 'Combine with fundamental analysis', 'Set stop losses based on warnings'],
    proTips: ['Overbought can stay overbought for long', 'Volume confirms distribution', 'Best used with other risk tools'],
    commonQuestions: [
      { question: 'Should I sell on crash warning?', answer: 'Reduce position or tighten stops. Full exit only if fundamental thesis also broken.' }
    ],
    relatedModules: ['market-timing']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INCOME & DIVIDEND TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  'dividend-crystal-ball': {
    toolId: 'dividend-crystal-ball',
    toolName: 'Dividend Crystal Ball',
    quickTip: 'Projects future dividends based on payout policy and earnings growth',
    concepts: ['dividend-yield', 'payout-ratio', 'dividend-growth'],
    keyTerms: [
      { term: 'Dividend Yield', definition: 'Annual dividend as percentage of price.', formula: 'Annual Dividend / Stock Price × 100' },
      { term: 'Payout Ratio', definition: 'Percentage of earnings paid as dividends.', formula: 'Dividends / Net Income × 100' },
      { term: 'Dividend Growth Rate', definition: 'CAGR of dividend payments over time.' }
    ],
    howToUse: ['Sustainable payout ratio < 60%', 'Growing dividends beat high yield', 'Check dividend history for consistency'],
    proTips: ['Dividend aristocrats rarely cut dividends', 'Special dividends are not recurring', 'Yield trap: high yield from falling price'],
    commonQuestions: [
      { question: 'High yield vs dividend growth?', answer: 'Dividend growth compounds better long-term. 3% yield growing 15%/year beats 6% flat yield in 10 years.' }
    ],
    relatedModules: ['dividend-investing']
  },

  'dividend-sip-tracker': {
    toolId: 'dividend-sip-tracker',
    toolName: 'Dividend SIP Tracker',
    quickTip: 'Tracks dividend reinvestment returns and yield-on-cost growth',
    concepts: ['drip', 'yield-on-cost', 'compounding'],
    keyTerms: [
      { term: 'Yield on Cost', definition: 'Current dividend yield based on original purchase price.', formula: 'Annual Dividend / Original Cost × 100' },
      { term: 'DRIP', definition: 'Dividend Reinvestment Plan - auto-reinvest dividends.' },
      { term: 'Total Return', definition: 'Price appreciation + dividends.' }
    ],
    howToUse: ['Track yield on cost for long-term holdings', 'Compare DRIP vs cash dividends', 'Monitor dividend contribution to returns'],
    proTips: ['YOC can exceed 100% for long-held dividend growers', 'DRIP works best in accumulation phase', 'Consider tax implications of DRIP'],
    commonQuestions: [
      { question: 'Should I reinvest dividends?', answer: 'During accumulation phase, yes (compounds faster). Near retirement, take cash for income.' }
    ],
    relatedModules: ['dividend-compounding']
  },

  'income-stability': {
    toolId: 'income-stability',
    toolName: 'Income Stability',
    quickTip: 'Assesses reliability and safety of dividend income stream',
    concepts: ['dividend-coverage', 'payout-ratio', 'fcf'],
    keyTerms: [
      { term: 'Dividend Coverage', definition: 'Times earnings cover dividend payment.', formula: 'EPS / DPS' },
      { term: 'FCF Coverage', definition: 'Free cash flow coverage of dividends.' },
      { term: 'Dividend Streak', definition: 'Consecutive years of stable/growing dividends.' }
    ],
    howToUse: ['Coverage > 2x is comfortable', 'Check FCF coverage, not just earnings', 'Longer streak = more reliable'],
    proTips: ['Earnings can be manipulated, FCF is harder to fake', 'PSU dividend policies can change with government', 'IT companies have consistent dividend policies'],
    commonQuestions: [
      { question: 'What coverage ratio is safe?', answer: '2x minimum for stable businesses. 3x+ for cyclicals. FCF coverage matters more than earnings coverage.' }
    ],
    relatedModules: ['income-investing']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CASHFLOW TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  'fcf-health': {
    toolId: 'fcf-health',
    toolName: 'FCF Health',
    quickTip: 'Analyzes free cash flow generation, trends, and quality',
    concepts: ['free-cash-flow', 'fcf-yield', 'capital-intensity'],
    keyTerms: [
      { term: 'Free Cash Flow', definition: 'Cash available after all investments.', formula: 'Operating Cash Flow - CapEx' },
      { term: 'FCF Yield', definition: 'FCF as percentage of market cap.', formula: 'FCF / Market Cap × 100' },
      { term: 'FCF Margin', definition: 'FCF as percentage of revenue.' }
    ],
    howToUse: ['Consistent positive FCF is key', 'FCF yield > 5% is attractive', 'Compare FCF to net income'],
    proTips: ['FCF is harder to manipulate than earnings', 'Growing FCF + low FCF yield = growth stock', 'High FCF yield + no growth = value/dividend play'],
    commonQuestions: [
      { question: 'Negative FCF is always bad?', answer: 'Not for high-growth companies investing heavily. But mature businesses should generate positive FCF.' }
    ],
    relatedModules: ['fcf-analysis']
  },

  'cash-conversion-cycle': {
    toolId: 'cash-conversion-cycle',
    toolName: 'Cash Conversion Cycle',
    quickTip: 'Time taken to convert inventory and receivables into cash',
    concepts: ['working-capital', 'inventory-days', 'receivables-days'],
    keyTerms: [
      { term: 'Days Inventory Outstanding', definition: 'Days inventory sits before sale.', formula: '(Inventory / COGS) × 365' },
      { term: 'Days Sales Outstanding', definition: 'Days to collect receivables.', formula: '(Receivables / Revenue) × 365' },
      { term: 'Days Payables Outstanding', definition: 'Days to pay suppliers.', formula: '(Payables / COGS) × 365' }
    ],
    howToUse: ['Lower CCC is better', 'Negative CCC is excellent', 'Track trends over time'],
    proTips: ['Amazon has negative CCC - gets paid before paying suppliers', 'Rising CCC traps working capital', 'Industry comparisons essential'],
    commonQuestions: [
      { question: 'Can CCC be too low?', answer: 'Rarely. But aggressive payables stretching can hurt supplier relationships.' }
    ],
    relatedModules: ['working-capital-management']
  },

  'cash-conversion-earnings': {
    toolId: 'cash-conversion-earnings',
    toolName: 'Cash Conversion of Earnings',
    quickTip: 'How much of reported profit converts to actual cash',
    concepts: ['cash-flow', 'accruals', 'earnings-quality'],
    keyTerms: [
      { term: 'Cash Conversion Ratio', definition: 'CFO as multiple of net income.', formula: 'Operating Cash Flow / Net Income' },
      { term: 'Quality of Earnings', definition: 'Higher cash conversion = higher quality.' },
      { term: 'Accrual Component', definition: 'Portion of earnings not backed by cash.' }
    ],
    howToUse: ['CCR > 1 over time is healthy', 'Single year < 1 is okay, persistent is red flag', 'Compare to industry average'],
    proTips: ['Capital-intensive businesses may have lower CCR', 'High-growth companies reinvest cash immediately', 'Mature businesses should have CCR > 1'],
    commonQuestions: [
      { question: 'Why would CCR be below 1?', answer: 'Working capital buildup, aggressive revenue recognition, CapEx timing, or potential earnings manipulation.' }
    ],
    relatedModules: ['earnings-quality-analysis']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MACRO & EVENT TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  'macro-pulse': {
    toolId: 'macro-pulse',
    toolName: 'Macro Pulse',
    quickTip: 'Key economic indicators affecting Indian markets - GDP, inflation, rates',
    concepts: ['gdp-growth', 'inflation', 'interest-rates'],
    keyTerms: [
      { term: 'GDP Growth', definition: 'Economic output growth rate - drives corporate earnings.' },
      { term: 'CPI Inflation', definition: 'Consumer price inflation - affects RBI policy.' },
      { term: 'Repo Rate', definition: 'RBI\'s policy rate - affects borrowing costs.' }
    ],
    howToUse: ['Rising GDP = bullish for equities', 'High inflation = hawkish RBI', 'Rate cuts = bullish for rate-sensitives'],
    proTips: ['Lead indicators matter more than current data', 'Watch RBI commentary for forward guidance', 'Global factors increasingly affect India'],
    commonQuestions: [
      { question: 'How does inflation affect stocks?', answer: 'Moderate inflation (4-6%) is fine. High inflation compresses PE multiples and raises discount rates.' }
    ],
    relatedModules: ['macro-fundamentals']
  },

  'macro-calendar': {
    toolId: 'macro-calendar',
    toolName: 'Macro Calendar',
    quickTip: 'Upcoming economic events, RBI meetings, data releases',
    concepts: ['event-risk', 'monetary-policy', 'economic-data'],
    keyTerms: [
      { term: 'MPC Meeting', definition: 'RBI Monetary Policy Committee - decides rates.' },
      { term: 'GDP Data', definition: 'Quarterly economic growth numbers.' },
      { term: 'IIP', definition: 'Index of Industrial Production - factory output.' }
    ],
    howToUse: ['Plan trades around major events', 'Reduce positions before uncertainty', 'Track consensus expectations'],
    proTips: ['Markets move on surprise vs expectations', 'Position sizing before events is key', 'Some events are regular, some ad-hoc'],
    commonQuestions: [
      { question: 'Should I trade around events?', answer: 'For most investors, reduce exposure. For traders, events offer volatility but are hard to predict.' }
    ],
    relatedModules: ['event-trading']
  },

  'earnings-calendar': {
    toolId: 'earnings-calendar',
    toolName: 'Earnings Calendar',
    quickTip: 'Upcoming quarterly results and expected announcement dates',
    concepts: ['earnings-season', 'results-preview', 'consensus-estimates'],
    keyTerms: [
      { term: 'Consensus Estimate', definition: 'Average analyst expectation for earnings.' },
      { term: 'Earnings Season', definition: 'Period when companies report results (Apr-May, Jul-Aug, Oct-Nov, Jan-Feb).' },
      { term: 'Pre-Announcement', definition: 'Guidance issued before official results.' }
    ],
    howToUse: ['Plan holdings review before results', 'Track portfolio exposure to upcoming results', 'Note historically volatile stocks'],
    proTips: ['First reporters often set sector tone', 'Management commentary matters as much as numbers', 'Guidance matters more than current quarter'],
    commonQuestions: [
      { question: 'Should I hold through results?', answer: 'For quality holdings with reasonable valuation, yes. For speculative or expensive stocks, consider reducing.' }
    ],
    relatedModules: ['earnings-analysis']
  },

  'earnings-surprise': {
    toolId: 'earnings-surprise',
    toolName: 'Earnings Surprise',
    quickTip: 'Actual vs expected earnings and subsequent price reactions',
    concepts: ['earnings-surprise', 'post-earnings-drift', 'estimate-revisions'],
    keyTerms: [
      { term: 'Earnings Surprise', definition: 'Actual EPS minus consensus estimate.' },
      { term: 'PEAD', definition: 'Post-Earnings Announcement Drift - prices continue moving after surprise.' },
      { term: 'Revision', definition: 'Analysts changing estimates after results.' }
    ],
    howToUse: ['Positive surprise often continues drifting up', 'Look for estimate revisions after surprise', 'Context matters (guidance, quality)'],
    proTips: ['PEAD anomaly persists - surprises have momentum', 'Quality of surprise matters (revenue vs cost cut)', 'Serial beaters often re-rate higher'],
    commonQuestions: [
      { question: 'Why do stocks fall on good earnings?', answer: 'Usually: beat expectations but poor guidance, or expectations were too high, or "sell the news" after run-up.' }
    ],
    relatedModules: ['earnings-momentum']
  },

  'insider-trades': {
    toolId: 'insider-trades',
    toolName: 'Insider Trades',
    quickTip: 'Promoter and key personnel buying/selling activity',
    concepts: ['insider-buying', 'promoter-stake', 'sast-regulations'],
    keyTerms: [
      { term: 'Insider', definition: 'Promoters, directors, key management with material information.' },
      { term: 'SAST', definition: 'SEBI takeover regulations requiring disclosure.' },
      { term: 'Open Market Purchase', definition: 'Buying from market (most significant signal).' }
    ],
    howToUse: ['Insider buying is bullish signal', 'Insider selling needs context', 'Cluster buying by multiple insiders is strongest'],
    proTips: ['Insiders sell for many reasons, buy for one', 'Size matters - look at % of holdings', 'Timing around results is suspicious'],
    commonQuestions: [
      { question: 'Is all insider selling bad?', answer: 'No. Diversification, taxes, personal needs are valid. Pattern of selling at highs or before bad news is concerning.' }
    ],
    relatedModules: ['insider-analysis']
  },

  'institutional-flows': {
    toolId: 'institutional-flows',
    toolName: 'Institutional Flows',
    quickTip: 'FII and DII buying/selling patterns in Indian markets',
    concepts: ['fii-flows', 'dii-flows', 'institutional-ownership'],
    keyTerms: [
      { term: 'FII', definition: 'Foreign Institutional Investors - key market drivers.' },
      { term: 'DII', definition: 'Domestic Institutional Investors - MFs, insurance, etc.' },
      { term: 'Net Flows', definition: 'Buying minus selling activity.' }
    ],
    howToUse: ['FII selling + DII buying = support', 'Sustained FII buying = bullish trend', 'Track monthly and quarterly patterns'],
    proTips: ['FII flows drive short-term markets', 'DII flows have stabilized since 2020', 'Global risk-off hurts FII flows'],
    commonQuestions: [
      { question: 'Why do FII flows matter so much?', answer: 'FIIs own ~17% of Indian equities and trade actively. Their flows drive prices, especially in large caps.' }
    ],
    relatedModules: ['flow-analysis']
  },

  'shareholding-pattern': {
    toolId: 'shareholding-pattern',
    toolName: 'Shareholding Pattern',
    quickTip: 'Breakdown of ownership - promoters, institutions, public',
    concepts: ['promoter-holding', 'institutional-ownership', 'public-float'],
    keyTerms: [
      { term: 'Promoter Holding', definition: 'Founders/controlling shareholders ownership percentage.' },
      { term: 'Pledge', definition: 'Shares used as collateral for loans - risk indicator.' },
      { term: 'Free Float', definition: 'Shares available for trading.' }
    ],
    howToUse: ['Rising promoter stake is positive', 'High pledge is risk', 'Increasing institutional ownership validates thesis'],
    proTips: ['Pledge > 50% of promoter holding is dangerous', 'Low free float = high volatility', 'Track quarter-over-quarter changes'],
    commonQuestions: [
      { question: 'What promoter holding is ideal?', answer: '50-75% shows commitment with enough float. <25% raises control questions. >75% has liquidity issues.' }
    ],
    relatedModules: ['ownership-analysis']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TECHNICAL TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  'momentum-heatmap': {
    toolId: 'momentum-heatmap',
    toolName: 'Momentum Heatmap',
    quickTip: 'Visual momentum strength across timeframes and sectors',
    concepts: ['momentum', 'relative-strength', 'trend'],
    keyTerms: [
      { term: 'Momentum', definition: 'Rate of price change - rising prices tend to continue.' },
      { term: 'RS Rating', definition: 'Relative Strength vs market/sector.' },
      { term: 'Momentum Score', definition: 'Composite score across timeframes.' }
    ],
    howToUse: ['Buy green (strong momentum), avoid red', 'Look for momentum improving (yellow to green)', 'Compare to sector momentum'],
    proTips: ['Momentum works until it doesn\'t - use with risk management', 'Relative momentum matters more than absolute', 'Momentum factor has strong backtested returns'],
    commonQuestions: [
      { question: 'How long does momentum persist?', answer: 'Typically 3-12 months. Beyond 12 months, mean reversion kicks in.' }
    ],
    relatedModules: ['momentum-investing']
  },

  'trend-strength': {
    toolId: 'trend-strength',
    toolName: 'Trend Strength',
    quickTip: 'Measures power and sustainability of current price trend',
    concepts: ['trend', 'adx', 'moving-averages'],
    keyTerms: [
      { term: 'ADX', definition: 'Average Directional Index - trend strength (not direction).', formula: 'ADX > 25 = strong trend' },
      { term: 'Trend Score', definition: 'Composite of multiple trend indicators.' },
      { term: 'Trend Duration', definition: 'How long current trend has persisted.' }
    ],
    howToUse: ['ADX > 25 with price above MAs = strong uptrend', 'Falling ADX = consolidation coming', 'Trade with the trend'],
    proTips: ['Trends last longer than expected', 'Strongest trends have ADX > 40', 'Low ADX = range-bound strategies work better'],
    commonQuestions: [
      { question: 'How to identify trend reversal?', answer: 'Watch for: lower highs, break of key MAs, divergences, falling ADX. Multiple confirmations reduce false signals.' }
    ],
    relatedModules: ['trend-analysis']
  },

  'volatility-regime': {
    toolId: 'volatility-regime',
    toolName: 'Volatility Regime',
    quickTip: 'Identifies current volatility state - low, normal, or high',
    concepts: ['volatility', 'vix', 'atr'],
    keyTerms: [
      { term: 'India VIX', definition: 'Market\'s expectation of 30-day volatility.' },
      { term: 'Historical Volatility', definition: 'Realized volatility from past prices.' },
      { term: 'Volatility Regime', definition: 'Current state - low (<15), normal (15-20), high (>20).' }
    ],
    howToUse: ['Low VIX = complacency, protect gains', 'High VIX = fear, often buying opportunity', 'Match strategy to regime'],
    proTips: ['Volatility clusters - high vol leads to high vol', 'VIX spikes are usually buying opportunities', 'Position sizing should adjust with volatility'],
    commonQuestions: [
      { question: 'Is high volatility bad?', answer: 'For buy-and-hold investors, no (ignore it). For traders, it\'s opportunity. For option sellers, it affects pricing.' }
    ],
    relatedModules: ['volatility-trading']
  },

  'seasonality-pattern': {
    toolId: 'seasonality-pattern',
    toolName: 'Seasonality Pattern',
    quickTip: 'Historical monthly and seasonal performance patterns',
    concepts: ['seasonality', 'calendar-effects', 'historical-returns'],
    keyTerms: [
      { term: 'Sell in May', definition: 'Historical underperformance May-October.' },
      { term: 'January Effect', definition: 'Historical strong performance in January.' },
      { term: 'Diwali Rally', definition: 'Indian market strength around Diwali.' }
    ],
    howToUse: ['Use as secondary timing input', 'Don\'t override fundamentals', 'Combine with other signals'],
    proTips: ['Seasonality works until it\'s widely known', 'Strong fundamentals override seasonality', 'Some sectors have stronger seasonality (sugar, cement)'],
    commonQuestions: [
      { question: 'Should I time the market based on seasonality?', answer: 'As only factor, no. As one input among many, it can help with entry timing.' }
    ],
    relatedModules: ['calendar-effects']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PORTFOLIO TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  'peer-comparison': {
    toolId: 'peer-comparison',
    toolName: 'Peer Comparison',
    quickTip: 'Side-by-side comparison of key metrics vs industry peers',
    concepts: ['relative-valuation', 'peer-analysis', 'competitive-position'],
    keyTerms: [
      { term: 'Peer Group', definition: 'Similar companies for comparison.' },
      { term: 'Relative Valuation', definition: 'Valuation compared to peers.' },
      { term: 'Percentile Rank', definition: 'Position within peer group.' }
    ],
    howToUse: ['Identify leader in each metric', 'Look for undervaluation vs peers', 'Understand why differences exist'],
    proTips: ['Cheapest isn\'t always best - understand why', 'Leaders often deserve premium', 'Peer comparison is relative, not absolute'],
    commonQuestions: [
      { question: 'How to choose the right peer group?', answer: 'Similar business model, market cap, and geography. Too narrow excludes insights, too broad is meaningless.' }
    ],
    relatedModules: ['comparative-analysis']
  },

  'portfolio-correlation': {
    toolId: 'portfolio-correlation',
    toolName: 'Portfolio Correlation',
    quickTip: 'Measures how holdings move together - diversification check',
    concepts: ['correlation', 'diversification', 'portfolio-risk'],
    keyTerms: [
      { term: 'Correlation', definition: 'How two assets move together. +1 = same, -1 = opposite, 0 = unrelated.' },
      { term: 'Diversification', definition: 'Spreading risk across uncorrelated assets.' },
      { term: 'Concentration Risk', definition: 'Too much exposure to correlated assets.' }
    ],
    howToUse: ['Target correlation < 0.5 between holdings', 'Add assets that reduce portfolio risk', 'Review after market changes'],
    proTips: ['Correlations rise in crashes - diversification fails when most needed', 'Gold and bonds are typical diversifiers', 'Sector concentration = high correlation'],
    commonQuestions: [
      { question: 'How many stocks for diversification?', answer: '15-25 stocks across sectors provides most diversification benefit. Beyond 30, you\'re just indexing.' }
    ],
    relatedModules: ['portfolio-construction']
  },

  'portfolio-leaderboard': {
    toolId: 'portfolio-leaderboard',
    toolName: 'Portfolio Leaderboard',
    quickTip: 'Ranks holdings by performance, contribution, and risk-adjusted returns',
    concepts: ['performance-attribution', 'risk-adjusted-returns', 'winners-losers'],
    keyTerms: [
      { term: 'Contribution', definition: 'How much each holding added to total return.' },
      { term: 'Risk-Adjusted Return', definition: 'Return per unit of risk (Sharpe-like).', formula: 'Return / Volatility' },
      { term: 'Position Size', definition: 'Weight of each holding in portfolio.' }
    ],
    howToUse: ['Review top and bottom performers', 'Check if winners are getting too large', 'Evaluate if losers are worth holding'],
    proTips: ['Winners becoming too large need trimming', 'Losers need honest thesis review', 'Attribution helps identify skill vs luck'],
    commonQuestions: [
      { question: 'When to sell winners?', answer: 'When overvalued, thesis broken, or position too large (>10-15% of portfolio). Not just because they\'ve risen.' }
    ],
    relatedModules: ['portfolio-review']
  },

  'etf-comparator': {
    toolId: 'etf-comparator',
    toolName: 'ETF Comparator',
    quickTip: 'Compare ETFs by tracking error, expense ratio, liquidity, and holdings',
    concepts: ['etf', 'tracking-error', 'expense-ratio'],
    keyTerms: [
      { term: 'Tracking Error', definition: 'Deviation from benchmark index.' },
      { term: 'Expense Ratio', definition: 'Annual fees charged by ETF.', formula: 'TER = Annual Fees / AUM × 100' },
      { term: 'AUM', definition: 'Assets Under Management - size of the ETF.' }
    ],
    howToUse: ['Lower expense ratio = more return for you', 'Minimal tracking error preferred', 'Higher AUM = better liquidity'],
    proTips: ['Liquidity matters for large trades', 'Tax efficiency advantage over mutual funds', 'ETFs suit passive, low-cost approach'],
    commonQuestions: [
      { question: 'ETF vs Index Fund?', answer: 'ETFs trade real-time, have lower expense ratios. Index funds easier for SIPs. Performance is similar.' }
    ],
    relatedModules: ['etf-investing']
  },

  'rebalance-optimizer': {
    toolId: 'rebalance-optimizer',
    toolName: 'Rebalance Optimizer',
    quickTip: 'Suggests trades to return portfolio to target allocation',
    concepts: ['rebalancing', 'asset-allocation', 'portfolio-drift'],
    keyTerms: [
      { term: 'Target Allocation', definition: 'Desired weight for each asset class.' },
      { term: 'Drift', definition: 'Deviation from target due to price changes.' },
      { term: 'Rebalancing', definition: 'Selling winners and buying losers to restore targets.' }
    ],
    howToUse: ['Set thresholds for rebalancing (e.g., 5% drift)', 'Review quarterly at minimum', 'Consider tax implications'],
    proTips: ['Threshold rebalancing beats calendar rebalancing', 'Use new money to rebalance when possible', 'Tax-loss harvesting during rebalancing'],
    commonQuestions: [
      { question: 'How often should I rebalance?', answer: 'When drift exceeds threshold (5-10%) or annually minimum. More frequent = more taxes.' }
    ],
    relatedModules: ['portfolio-management']
  },

  'options-interest': {
    toolId: 'options-interest',
    toolName: 'Options Interest',
    quickTip: 'Open interest analysis across strikes and expiries',
    concepts: ['open-interest', 'pcr', 'max-pain'],
    keyTerms: [
      { term: 'Open Interest', definition: 'Outstanding option contracts.' },
      { term: 'PCR', definition: 'Put-Call Ratio - sentiment indicator.', formula: 'Put OI / Call OI' },
      { term: 'Max Pain', definition: 'Strike where option sellers profit most.' }
    ],
    howToUse: ['High OI = support/resistance level', 'PCR > 1 = bearish, < 1 = bullish', 'Track OI changes for trend'],
    proTips: ['Max Pain often acts as expiry magnet', 'Option writers move markets near expiry', 'Weekly vs monthly OI have different signals'],
    commonQuestions: [
      { question: 'What does OI buildup mean?', answer: 'Rising OI + rising price = bullish (new longs). Rising OI + falling price = bearish (new shorts).' }
    ],
    relatedModules: ['options-analysis']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OVERVIEW & MINI TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  'stock-snapshot': {
    toolId: 'stock-snapshot',
    toolName: 'Stock Snapshot',
    quickTip: 'Quick overview of price, key metrics, and recent performance',
    concepts: ['market-cap', 'pe-ratio', 'dividend-yield'],
    keyTerms: [
      { term: 'Market Cap', definition: 'Total market value of shares.', formula: 'Price × Shares Outstanding' },
      { term: '52-Week Range', definition: 'Highest and lowest prices in past year.' },
      { term: 'Day Change', definition: 'Price change from previous close.' }
    ],
    howToUse: ['Start research with snapshot', 'Check key metrics at a glance', 'Compare to previous knowledge'],
    proTips: ['Snapshot is starting point, not conclusion', 'Context matters - compare to peers', 'Track over time, not just current'],
    commonQuestions: [
      { question: 'What metrics matter most?', answer: 'Depends on purpose: P/E for value, growth rates for growth, yield for income. Start with what matches your style.' }
    ],
    relatedModules: ['stock-basics']
  },

  'factor-tilt': {
    toolId: 'factor-tilt',
    toolName: 'Factor Tilt',
    quickTip: 'Shows portfolio exposure to value, quality, momentum, and size factors',
    concepts: ['factor-investing', 'factor-exposure', 'smart-beta'],
    keyTerms: [
      { term: 'Factor Tilt', definition: 'Overweight or underweight to a factor.' },
      { term: 'Factor Loading', definition: 'Sensitivity of returns to factor.' },
      { term: 'Active Factor Bet', definition: 'Intentional over/underweight vs benchmark.' }
    ],
    howToUse: ['Understand your implicit factor bets', 'Align tilts with market views', 'Diversify across factors'],
    proTips: ['Most stock pickers have unintentional factor bets', 'Factors rotate - diversify', 'Factor investing is systematic value/quality/momentum'],
    commonQuestions: [
      { question: 'Should I target specific factors?', answer: 'Quality and value are most reliable long-term. Momentum for tactical timing. Size (small cap) for higher risk/return.' }
    ],
    relatedModules: ['factor-investing-advanced']
  },

  'sentiment-zscore': {
    toolId: 'sentiment-zscore',
    toolName: 'Sentiment Z-Score',
    quickTip: 'Standardized measure of market sentiment extremes',
    concepts: ['sentiment', 'contrarian', 'fear-greed'],
    keyTerms: [
      { term: 'Z-Score', definition: 'Standard deviations from average sentiment.' },
      { term: 'Extreme Sentiment', definition: 'Z > 2 or Z < -2 suggests reversal potential.' },
      { term: 'Contrarian Signal', definition: 'Extreme optimism = sell, extreme pessimism = buy.' }
    ],
    howToUse: ['Extreme readings are contrarian signals', 'Combine with valuation', 'Don\'t trade sentiment alone'],
    proTips: ['Sentiment can stay extreme for a while', 'Best at turning points, not trends', 'Multiple sentiment indicators provide confirmation'],
    commonQuestions: [
      { question: 'Is sentiment reliable for timing?', answer: 'At extremes, moderately useful. During trends, sentiment follows price. Best as one input among many.' }
    ],
    relatedModules: ['sentiment-analysis']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MUTUAL FUND TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  'mf-analyzer': {
    toolId: 'mf-analyzer',
    toolName: 'MF Analyzer',
    quickTip: 'Deep analysis of mutual fund performance, risk, and holdings',
    concepts: ['alpha', 'sharpe-ratio', 'expense-ratio'],
    keyTerms: [
      { term: 'Alpha', definition: 'Excess return vs benchmark, skill of fund manager.' },
      { term: 'Sharpe Ratio', definition: 'Risk-adjusted return.', formula: '(Return - Risk Free Rate) / Volatility' },
      { term: 'Beta', definition: 'Sensitivity to benchmark moves.' }
    ],
    howToUse: ['Compare alpha across similar funds', 'Check consistency of returns', 'Review expense ratio vs peers'],
    proTips: ['Past performance doesn\'t guarantee future', '3-5 year track record minimum', 'Fund manager changes matter'],
    commonQuestions: [
      { question: 'Active or passive funds?', answer: 'For large caps, passive often wins. For mid/small caps and debt, active has more scope to add value.' }
    ],
    relatedModules: ['mutual-fund-selection']
  },

  'mf-explorer': {
    toolId: 'mf-explorer',
    toolName: 'MF Explorer',
    quickTip: 'Search and filter mutual funds by category, returns, and ratings',
    concepts: ['fund-category', 'risk-rating', 'returns'],
    keyTerms: [
      { term: 'Fund Category', definition: 'Type of fund - large cap, mid cap, debt, etc.' },
      { term: 'Star Rating', definition: 'Risk-adjusted performance rating.' },
      { term: 'AUM', definition: 'Assets Under Management - fund size.' }
    ],
    howToUse: ['Filter by category first', 'Then by ratings and returns', 'Review top picks in detail'],
    proTips: ['Don\'t chase recent top performers', 'Consistent top-quartile is better than occasional #1', 'Small AUM funds may close to new investors'],
    commonQuestions: [
      { question: 'How many MF categories do I need?', answer: '3-4 is usually sufficient: large cap, mid/small cap, debt, and maybe international or gold.' }
    ],
    relatedModules: ['fund-selection-basics']
  },

  'mf-portfolio-optimizer': {
    toolId: 'mf-portfolio-optimizer',
    toolName: 'MF Portfolio Optimizer',
    quickTip: 'Suggests optimal allocation across mutual funds based on goals',
    concepts: ['asset-allocation', 'risk-tolerance', 'goal-based-investing'],
    keyTerms: [
      { term: 'Risk Tolerance', definition: 'Ability and willingness to take risk.' },
      { term: 'Time Horizon', definition: 'Investment duration affects allocation.' },
      { term: 'Goal Amount', definition: 'Target corpus for the goal.' }
    ],
    howToUse: ['Input goals and risk tolerance', 'Review suggested allocation', 'Execute via SIP'],
    proTips: ['Longer horizon = more equity', 'Review allocation annually', 'Don\'t mix multiple goals'],
    commonQuestions: [
      { question: 'Equity:Debt ratio rule of thumb?', answer: '100 minus age in equity is traditional. More aggressive: 110 minus age. Adjust for risk tolerance.' }
    ],
    relatedModules: ['goal-based-investing']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DERIVATIVES & COMMODITY TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  'nse-currency-dashboard': {
    toolId: 'nse-currency-dashboard',
    toolName: 'NSE Currency Dashboard',
    quickTip: 'INR pairs, currency futures, and forex market overview',
    concepts: ['forex', 'currency-pairs', 'hedging'],
    keyTerms: [
      { term: 'USDINR', definition: 'Most traded currency pair in India.' },
      { term: 'Spot vs Forward', definition: 'Current rate vs future delivery rate.' },
      { term: 'Carry Trade', definition: 'Borrow in low-yield currency, invest in high-yield.' }
    ],
    howToUse: ['Track USDINR for export/import exposure', 'Forward premiums indicate expectations', 'Hedge currency risk for portfolio'],
    proTips: ['RBI interventions create trading opportunities', 'Oil prices correlate with INR', 'US rates strongly affect USDINR'],
    commonQuestions: [
      { question: 'Should I hedge USD exposure?', answer: 'For traders/importers, yes. For long-term investors, INR depreciation averages ~3% annually against USD - may not need hedging.' }
    ],
    relatedModules: ['currency-trading']
  },

  'mcx-commodity-dashboard': {
    toolId: 'mcx-commodity-dashboard',
    toolName: 'MCX Commodity Dashboard',
    quickTip: 'Indian commodity prices, trends, and trading volumes',
    concepts: ['commodities', 'gold', 'crude-oil'],
    keyTerms: [
      { term: 'MCX', definition: 'Multi Commodity Exchange of India.' },
      { term: 'Contango', definition: 'Futures price > spot price (normal for carrying costs).' },
      { term: 'Backwardation', definition: 'Futures price < spot price (supply shortage signal).' }
    ],
    howToUse: ['Track commodities affecting portfolio companies', 'Gold as hedge indicator', 'Crude for inflation/margins'],
    proTips: ['Commodity moves often lead equity moves', 'Seasonality strong in agri commodities', 'Global prices + INR = Indian prices'],
    commonQuestions: [
      { question: 'How do commodities affect stocks?', answer: 'Input cost changes affect margins. Inflation from commodities affects valuations. Gold correlates with uncertainty.' }
    ],
    relatedModules: ['commodity-basics']
  },

  'playbook-builder': {
    toolId: 'playbook-builder',
    toolName: 'Playbook Builder',
    quickTip: 'Create and save custom trading setups with entry, exit, and risk rules',
    concepts: ['trading-system', 'risk-management', 'trade-setup'],
    keyTerms: [
      { term: 'Setup', definition: 'Specific conditions that trigger a trade entry.' },
      { term: 'Entry Rules', definition: 'Criteria that must be met to enter a trade.' },
      { term: 'Exit Rules', definition: 'When to take profit or cut losses.' },
      { term: 'Position Sizing', definition: 'How much capital to allocate per trade.' }
    ],
    howToUse: ['Define clear entry conditions', 'Set exit rules before entering', 'Backtest on historical data'],
    proTips: ['Simple playbooks often outperform complex ones', 'Document every rule - no discretion', 'Track win rate and expectancy per playbook'],
    commonQuestions: [
      { question: 'How many setups should I trade?', answer: '2-3 well-defined setups is enough. Mastery beats variety.' }
    ],
    relatedModules: ['trading-systems']
  },

  'trade-flow-intel': {
    toolId: 'trade-flow-intel',
    toolName: 'Trade Flow Intelligence',
    quickTip: 'Real-time order flow and institutional activity detection',
    concepts: ['order-flow', 'market-microstructure', 'smart-money'],
    keyTerms: [
      { term: 'Order Flow', definition: 'Actual buy/sell orders hitting the market.' },
      { term: 'Block Trades', definition: 'Large institutional trades outside normal market.' },
      { term: 'Imbalance', definition: 'Excess of buy vs sell orders.' },
      { term: 'Smart Money', definition: 'Informed institutional traders.' }
    ],
    howToUse: ['Look for persistent buy/sell imbalances', 'Track large block trades', 'Combine with technical analysis'],
    proTips: ['Order flow shows intent, not just price', 'Block trades often precede moves', 'Divergence between flow and price is signal'],
    commonQuestions: [
      { question: 'Can retail traders use order flow?', answer: 'Yes, but data is delayed. Focus on larger patterns like bulk/block deals rather than real-time tape.' }
    ],
    relatedModules: ['order-flow-analysis']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // V41 ENHANCED TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  'sector-rotation-tracker': {
    toolId: 'sector-rotation-tracker',
    toolName: 'Sector Rotation Tracker',
    quickTip: 'Track money flow between sectors and identify leadership changes',
    concepts: ['relative-strength', 'sector-rotation', 'market-cycles'],
    keyTerms: [
      { term: 'Relative Strength', definition: 'Performance of a sector compared to benchmark (Nifty 50). RS > 100 means outperforming.' },
      { term: 'Sector Rotation', definition: 'Natural flow of money between sectors as economic cycle progresses.' },
      { term: 'Risk-On/Risk-Off', definition: 'Market sentiment favoring growth stocks (risk-on) vs defensive stocks (risk-off).' },
      { term: 'RS Rank', definition: 'Rank of sector by relative strength. #1 is strongest performer.' },
      { term: 'Momentum Score', definition: 'Combined metric of price momentum, volume trend, and RS acceleration.' }
    ],
    howToUse: [
      'Check which sectors are leading (low RS rank, high momentum)',
      'Look for sectors with improving RS (rising from bottom)',
      'Identify rotation signals when leadership changes',
      'Avoid sectors with deteriorating RS and negative momentum'
    ],
    proTips: [
      'Early cycle favors Financials & Industrials, late cycle favors IT & Pharma',
      'Rotation often happens gradually - sector strength builds over weeks',
      'Watch for divergence between sector price and RS',
      'Top 3 sectors often continue outperforming for extended periods'
    ],
    commonQuestions: [
      { question: 'How often does sector leadership change?', answer: 'Major rotations happen 2-4 times per year, often at market turning points. Minor rotations within a trend are more frequent.' },
      { question: 'Should I always buy the #1 sector?', answer: 'Not necessarily. Look for sectors moving from #5-8 to top 3 - these have more upside. Already top-ranked sectors may be crowded.' }
    ],
    relatedModules: ['sector-rotation', 'relative-strength']
  },

  'sentiment-contradiction': {
    toolId: 'sentiment-contradiction',
    toolName: 'Sentiment Contradiction Detector',
    quickTip: 'Find conflicting signals across data sources for contrarian opportunities',
    concepts: ['sentiment-analysis', 'contrarian-investing', 'divergence'],
    keyTerms: [
      { term: 'Signal Contradiction', definition: 'When different data sources give conflicting signals - e.g., bullish price but bearish options flow.' },
      { term: 'Put/Call Ratio', definition: 'Ratio of put volume to call volume. High PCR suggests hedging or bearish sentiment.' },
      { term: 'Delivery %', definition: 'Percentage of traded volume actually delivered. High delivery = real accumulation.' },
      { term: 'FII/DII Flow', definition: 'Foreign and Domestic institutional buying/selling activity.' },
      { term: 'Contradiction Score', definition: 'Metric (0-100) measuring degree of conflicting signals. High score = more contradictions.' }
    ],
    howToUse: [
      'Look for high contradiction scores (>60) - these signal potential turning points',
      'Check which signals are conflicting and their severity',
      'Review historical resolution patterns for similar setups',
      'Use contradictions as warning signs, not immediate trade signals'
    ],
    proTips: [
      'Price + Volume bullish but Options bearish often resolves bearishly',
      'High delivery + FII selling = DII accumulation, often bullish medium-term',
      'Multiple contradictions reduce confidence in any directional bet',
      'Resolution often takes 5-15 trading days'
    ],
    commonQuestions: [
      { question: 'Should I fade the contradiction?', answer: 'Not immediately. Wait for resolution. Contradictions signal uncertainty - the market often resolves them before continuing. Use for position sizing rather than direction.' },
      { question: 'Which contradictions are most reliable?', answer: 'Price vs Options flow has the best track record. Also watch Volume Trend vs RSI divergence. FII vs DII conflicts usually favor DIIs in trending markets.' }
    ],
    relatedModules: ['sentiment-analysis', 'contrarian-signals']
  },

  'portfolio-drift-monitor': {
    toolId: 'portfolio-drift-monitor',
    toolName: 'Portfolio Drift Monitor',
    quickTip: 'Track how your holdings deviate from original investment thesis',
    concepts: ['portfolio-management', 'rebalancing', 'investment-thesis'],
    keyTerms: [
      { term: 'Thesis Drift', definition: 'When a stock\'s fundamentals or price action no longer support your original buy reason.' },
      { term: 'Drift Score', definition: 'Metric (0-100) measuring deviation from thesis. Higher = more drift.' },
      { term: 'Price vs Entry', definition: 'Current price compared to your entry point, showing unrealized P&L.' },
      { term: 'Original Thesis', definition: 'The reason you bought the stock - growth, value, dividend, etc.' },
      { term: 'Thesis Broken', definition: 'When fundamental changes invalidate your investment thesis entirely.' }
    ],
    howToUse: [
      'Review holdings with high drift scores regularly',
      'Check if original buy reasons still hold',
      'Distinguish between price volatility and thesis invalidation',
      'Set alerts for critical thesis metrics'
    ],
    proTips: [
      'Price drop alone is not thesis drift - check fundamentals',
      'Review thesis quarterly even if drift score is low',
      'Some drift is normal - only act on significant changes',
      'Document thesis at purchase for easier future review'
    ],
    commonQuestions: [
      { question: 'When should I sell a thesis-broken stock?', answer: 'If your original reason for buying is no longer valid and you wouldn\'t buy it today at current price, consider selling regardless of P&L.' },
      { question: 'How often should I check drift?', answer: 'Monthly for active portfolios, quarterly for long-term. Check immediately after earnings or major news.' }
    ],
    relatedModules: ['portfolio-management', 'rebalancing']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // V42 TOOLS - TPO & FOOTPRINT
  // ═══════════════════════════════════════════════════════════════════════════

  'volume-profile-tpo': {
    toolId: 'volume-profile-tpo',
    toolName: 'Volume Profile + TPO',
    quickTip: 'See where most trading activity occurred and identify key support/resistance levels',
    concepts: ['volume-profile', 'market-profile', 'auction-theory'],
    keyTerms: [
      { term: 'POC (Point of Control)', definition: 'Price level with highest volume - acts as magnet for price.' },
      { term: 'Value Area', definition: '70% of volume traded between VAH and VAL. Price tends to return here.' },
      { term: 'VAH/VAL', definition: 'Value Area High and Low - boundaries of the fair value zone.' },
      { term: 'HVN (High Volume Node)', definition: 'Price levels with significant volume - strong support/resistance.' },
      { term: 'LVN (Low Volume Node)', definition: 'Price levels with low volume - price moves quickly through these.' },
      { term: 'Initial Balance', definition: 'First hour\'s trading range. Breakout from IB often continues.' },
      { term: 'Single Prints', definition: 'Price levels visited only once - unfinished business, price may return.' },
      { term: 'TPO (Time Price Opportunity)', definition: 'Shows how much TIME price spent at each level, not just volume.' },
      { term: 'Profile Shape', definition: 'P-shape (buying), b-shape (selling), D-shape (balance), B-shape (double distribution).' }
    ],
    howToUse: [
      'Identify POC as primary support/resistance',
      'Trade toward POC when price is outside value area',
      'Use LVN zones as potential fast-move areas',
      'Watch for IB breakouts for intraday direction',
      'Look for single prints as future targets'
    ],
    proTips: [
      'POC from previous day is powerful magnet for current day',
      'Naked POCs (untested) eventually get tested',
      'Wide IB suggests range day, narrow IB suggests trending day',
      'Single prints often get filled - use as targets',
      'P-shape profile near lows = accumulation, near highs = distribution'
    ],
    commonQuestions: [
      { question: 'How is TPO different from Volume Profile?', answer: 'Volume Profile shows WHERE volume traded. TPO shows how much TIME price spent at each level. Both are useful - TPO better for intraday, Volume Profile for swing.' },
      { question: 'What if price is above value area?', answer: 'Price above VA often pulls back to VAH. If it holds VAH, bullish continuation. If it breaks VAH, targets POC.' }
    ],
    relatedModules: ['volume-profile', 'market-profile', 'auction-market-theory']
  },

  'footprint-analysis': {
    toolId: 'footprint-analysis',
    toolName: 'Footprint Analysis',
    quickTip: 'See bid/ask volume at each price level to detect institutional activity',
    concepts: ['order-flow', 'footprint-charts', 'delta-analysis'],
    keyTerms: [
      { term: 'Footprint', definition: 'Shows bid volume × ask volume at each price level within a candle.' },
      { term: 'Delta', definition: 'Ask volume minus bid volume. Positive = buying pressure, negative = selling.' },
      { term: 'Cumulative Delta', definition: 'Running total of delta across session. Shows overall buying/selling bias.' },
      { term: 'Imbalance', definition: 'When bid or ask volume is 2.5x+ the other. Shows aggressive buyers/sellers.' },
      { term: 'Stacked Imbalances', definition: '3+ consecutive imbalances at adjacent prices. Strong institutional signal.' },
      { term: 'Absorption', definition: 'High volume with minimal price movement. Indicates trapped traders.' },
      { term: 'Exhaustion', definition: 'Volume spike at extreme with immediate reversal. Signals potential turning point.' }
    ],
    howToUse: [
      'Look for imbalances to identify aggressive institutional activity',
      'Track cumulative delta for session bias',
      'Stacked imbalances suggest strong directional conviction',
      'Absorption at key levels suggests holding/reversal',
      'Combine with traditional support/resistance'
    ],
    proTips: [
      'Buy imbalances at support = institutional accumulation',
      'Sell imbalances at resistance = institutional distribution',
      'Divergence between price and delta often precedes reversal',
      'Absorption shows where big players are defending levels',
      'Multiple stacked imbalances rarely fail'
    ],
    commonQuestions: [
      { question: 'Can I use footprint for Indian markets?', answer: 'Yes, but tick data is limited. We estimate from 15-min aggregated data with delivery %. Focus on larger patterns rather than individual ticks.' },
      { question: 'What is a significant imbalance ratio?', answer: '2.5:1 or higher. 3:1+ is very strong. Look for clusters of imbalances rather than single occurrences.' }
    ],
    relatedModules: ['order-flow', 'footprint-charts', 'institutional-trading']
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export function getToolEducation(toolId: string): ToolEducation | undefined {
  return TOOL_EDUCATION[toolId];
}

export function getConceptsForTool(toolId: string): Concept[] {
  const education = TOOL_EDUCATION[toolId];
  if (!education) return [];
  
  return education.concepts
    .map(id => getConceptById(id))
    .filter((c): c is Concept => c !== undefined);
}

export function getQuickTip(toolId: string): string {
  return TOOL_EDUCATION[toolId]?.quickTip || 'No quick tip available';
}

export function getKeyTerms(toolId: string): ToolTerm[] {
  return TOOL_EDUCATION[toolId]?.keyTerms || [];
}

export function searchToolEducation(query: string): ToolEducation[] {
  const lower = query.toLowerCase();
  return Object.values(TOOL_EDUCATION).filter(edu =>
    edu.toolName.toLowerCase().includes(lower) ||
    edu.quickTip.toLowerCase().includes(lower) ||
    edu.keyTerms.some(t => t.term.toLowerCase().includes(lower))
  );
}
