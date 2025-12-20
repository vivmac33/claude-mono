// ═══════════════════════════════════════════════════════════════════════════
// ADVANCED CURRICULUM - Modules 34-50
// Full LearningModule structure + Combined Exports
// ═══════════════════════════════════════════════════════════════════════════

import { LearningModule } from './modules';
import { CurriculumFlashcard, CURRICULUM_BEGINNER, BEGINNER_FLASHCARDS } from './curriculum-beginner';
import { CURRICULUM_INTERMEDIATE, INTERMEDIATE_FLASHCARDS } from './curriculum-intermediate';

export const CURRICULUM_ADVANCED: LearningModule[] = [
  {
    id: 'cur-34-dcf', title: '34. Intrinsic Value & DCF',
    description: 'Discounted Cash Flow valuation methodology.',
    category: 'analysis', difficulty: 'advanced', durationMinutes: 20,
    rating: 4.8, totalRatings: 1450, icon: 'Calculator',
    concepts: ['dcf', 'wacc', 'intrinsic-value'], tools: ['dcf-valuation', 'valuation-summary'],
    sections: [
      { title: 'DCF Fundamentals', content: `**DCF estimates intrinsic value by:**\n1. Forecast cash flows (5-10 years)\n2. Estimate terminal value\n3. Discount using WACC\n4. Add margin of safety\n\nDCF is sensitive to assumptions - small changes swing valuation significantly.` },
      { title: 'India Example', content: `Stable FMCG (HUL) suits DCF. Cyclical metals stocks - avoid DCF, use EV/EBITDA.` }
    ],
    quiz: { questions: [
      { question: 'DCF discounts future cash flows because?', options: ['Inflation', 'Risk & time value of money', 'Taxes', 'Accounting rules'], correctIndex: 1, explanation: 'Money today worth more than future money.' },
      { question: 'Terminal value represents?', options: ['Bankruptcy value', 'Value beyond forecast period', 'Book value', 'Liquidation'], correctIndex: 1, explanation: 'Value after explicit forecast period.' },
      { question: 'DCF works best for?', options: ['Loss-making startups', 'Highly cyclical firms', 'Stable cash-generating companies', 'Penny stocks'], correctIndex: 2, explanation: 'Predictable cash flows needed.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-35-quality-scores', title: '35. Quality Metrics: Piotroski & Altman',
    description: 'Piotroski F-Score and Altman Z-Score for screening.',
    category: 'analysis', difficulty: 'advanced', durationMinutes: 15,
    rating: 4.7, totalRatings: 1350, icon: 'Award',
    concepts: ['piotroski-score', 'altman-z', 'quality-metrics'], tools: ['financial-stress-radar'],
    sections: [
      { title: 'Quality Scores', content: `**Piotroski F-Score (0-9):** Profitability, leverage, efficiency. Higher = stronger.\n\n**Altman Z-Score:** Bankruptcy risk. Lower score = higher risk.\n\nUsed to filter value traps.` },
      { title: 'India Example', content: `Low Z-scores flagged stressed NBFCs before IL&FS crisis.` }
    ],
    quiz: { questions: [
      { question: 'Higher Piotroski score means?', options: ['Overvaluation', 'Strong fundamentals', 'High debt', 'High volatility'], correctIndex: 1, explanation: '9 = strongest fundamentals.' },
      { question: 'Altman Z-Score assesses?', options: ['Growth', 'Bankruptcy risk', 'Valuation', 'Dividends'], correctIndex: 1, explanation: 'Predicts financial distress.' },
      { question: 'These scores are best used for?', options: ['Timing trades', 'Screening quality stocks', 'Intraday trading', 'IPO allotment'], correctIndex: 1, explanation: 'Filter out weak companies.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-36-earnings-quality', title: '36. Earnings Quality & Red Flags',
    description: 'Detecting earnings manipulation.',
    category: 'analysis', difficulty: 'advanced', durationMinutes: 15,
    rating: 4.8, totalRatings: 1400, icon: 'AlertTriangle',
    concepts: ['earnings-quality', 'accruals', 'red-flags'], tools: ['earnings-quality', 'profit-vs-cash-divergence'],
    sections: [
      { title: 'Red Flags', content: `**Watch for:**\n- Rising receivables faster than sales\n- Inventory buildup\n- Aggressive revenue recognition\n- High accruals\n\n**Beneish M-Score:** Detects manipulation.` },
      { title: 'India Example', content: `Infrastructure companies: Sharp rise in receivables = delayed payments (red flag).` }
    ],
    quiz: { questions: [
      { question: 'Rising receivables faster than sales indicate?', options: ['Growth', 'Accounting red flag', 'Strong demand', 'Efficiency'], correctIndex: 1, explanation: 'May indicate channel stuffing or collection issues.' },
      { question: 'High accruals imply?', options: ['Cash-rich business', 'Earnings manipulation risk', 'Conservative accounting', 'Low leverage'], correctIndex: 1, explanation: 'Profits not backed by cash.' },
      { question: 'Earnings quality focuses on?', options: ['Reported profit only', 'Cash sustainability', 'Stock price', 'Dividends'], correctIndex: 1, explanation: 'Is profit real and sustainable?' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-37-management-quality', title: '37. Management Quality & Capital Allocation',
    description: 'Evaluating management effectiveness.',
    category: 'analysis', difficulty: 'advanced', durationMinutes: 15,
    rating: 4.8, totalRatings: 1500, icon: 'Users',
    concepts: ['management-quality', 'capital-allocation', 'roic'], tools: ['management-quality'],
    sections: [
      { title: 'Key Indicators', content: `- Promoter holding trends\n- Insider buying/selling\n- Capital allocation: reinvest, dividend, buyback\n- **ROIC vs WACC:** ROIC > WACC = value creation` },
      { title: 'India Example', content: `Promoter stake increase often precedes midcap outperformance. Poor allocation → shareholder wealth loss.` }
    ],
    quiz: { questions: [
      { question: 'ROIC > WACC means?', options: ['Value destruction', 'Value creation', 'Neutral', 'Overvaluation'], correctIndex: 1, explanation: 'Returns exceed cost of capital.' },
      { question: 'Insider buying usually signals?', options: ['Panic', 'Confidence', 'Regulation', 'Dilution'], correctIndex: 1, explanation: 'Management believes stock undervalued.' },
      { question: 'Poor capital allocation leads to?', options: ['Growth', 'Shareholder wealth loss', 'Stability', 'Lower risk'], correctIndex: 1, explanation: 'Destroys value over time.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-38-options-strategies', title: '38. Options Strategies',
    description: 'Straddles, strangles, iron condors.',
    category: 'strategies', difficulty: 'advanced', durationMinutes: 20,
    rating: 4.7, totalRatings: 1650, icon: 'Target',
    concepts: ['straddle', 'strangle', 'iron-condor', 'greeks'], tools: ['options-strategy'],
    sections: [
      { title: 'Advanced Strategies', content: `**Straddle:** Buy call + put (expect big move).\n**Strangle:** Cheaper straddle with OTM options.\n**Iron Condor:** Range-bound strategy, sell both sides.\n\n**Greeks:** Delta, Gamma, Theta, Vega govern risk.` },
      { title: 'India Example', content: `Iron condors common on Nifty during low-volatility periods.` }
    ],
    quiz: { questions: [
      { question: 'Straddle profits when?', options: ['Market is flat', 'Big move either direction', 'Low volatility', 'Time passes'], correctIndex: 1, explanation: 'Profits from movement, direction doesn\'t matter.' },
      { question: 'Theta benefits which trader?', options: ['Buyer', 'Seller', 'Hedger', 'Arbitrageur'], correctIndex: 1, explanation: 'Option sellers profit from time decay.' },
      { question: 'Iron condor suits?', options: ['Trending markets', 'Range-bound markets', 'Crashes', 'IPOs'], correctIndex: 1, explanation: 'Profits when price stays in range.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-39-short-selling', title: '39. Short Selling & Bearish Plays',
    description: 'Profiting from falling prices.',
    category: 'strategies', difficulty: 'advanced', durationMinutes: 15,
    rating: 4.6, totalRatings: 1300, icon: 'TrendingDown',
    concepts: ['short-selling', 'short-squeeze'], tools: ['short-interest'],
    sections: [
      { title: 'Short Selling', content: `Sell borrowed shares, buy back cheaper. **Unlimited risk** (price can rise infinitely).\n\n**India:** Allowed intraday & derivatives. Delivery-based restricted.\n\n**Short squeeze:** Forced buying causes sharp rally.` },
      { title: 'Safer Alternative', content: `Buying puts: Limited risk (premium), unlimited profit potential.` }
    ],
    quiz: { questions: [
      { question: 'Maximum loss in short selling?', options: ['Limited', 'Unlimited', 'Fixed', 'Premium paid'], correctIndex: 1, explanation: 'Price can rise infinitely.' },
      { question: 'Short squeeze caused by?', options: ['Low volume', 'Forced covering', 'High dividends', 'Circuit breakers'], correctIndex: 1, explanation: 'Shorts forced to buy back, pushing price up.' },
      { question: 'Safer bearish strategy?', options: ['Naked short', 'Buying puts', 'Futures leverage', 'Margin trading'], correctIndex: 1, explanation: 'Max loss = premium paid.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-40-futures', title: '40. Futures & Forward Contracts',
    description: 'Standardized derivative contracts.',
    category: 'strategies', difficulty: 'advanced', durationMinutes: 15,
    rating: 4.7, totalRatings: 1450, icon: 'Clock',
    concepts: ['futures', 'contango', 'backwardation', 'margin'], tools: ['futures-vs-spot'],
    sections: [
      { title: 'Futures Basics', content: `Standardized contracts on exchanges.\n\n**Margin:** Partial payment upfront.\n**Mark-to-market:** Daily settlement.\n**Contango:** Futures > Spot.\n**Backwardation:** Spot > Futures.` },
      { title: 'India Example', content: `Nifty futures used to hedge portfolios during uncertainty.` }
    ],
    quiz: { questions: [
      { question: 'Futures are marked to market?', options: ['Monthly', 'Yearly', 'Daily', 'On expiry only'], correctIndex: 2, explanation: 'Daily settlement of gains/losses.' },
      { question: 'Contango means?', options: ['Spot > futures', 'Futures > spot', 'No difference', 'Backwardation'], correctIndex: 1, explanation: 'Future price higher than spot.' },
      { question: 'Futures hedging reduces?', options: ['Returns', 'Risk', 'Taxes', 'Volatility always'], correctIndex: 1, explanation: 'Offsets portfolio risk.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-41-sector-rotation', title: '41. Sector Rotation & Macro Cycles',
    description: 'Economic cycles and sector leadership.',
    category: 'strategies', difficulty: 'advanced', durationMinutes: 15,
    rating: 4.8, totalRatings: 1550, icon: 'RefreshCw',
    concepts: ['sector-rotation', 'economic-cycles'], tools: ['sector-rotation-tracker'],
    sections: [
      { title: 'Economic Cycles', content: `**Expansion → Peak → Contraction → Trough**\n\nDifferent sectors outperform at each stage.\n- Early cycle: Financials, Industrials\n- Late cycle: IT, Pharma (defensives)` },
      { title: 'India Example', content: `Banks lead during expansion. FMCG during slowdown.` }
    ],
    quiz: { questions: [
      { question: 'Cyclicals perform best during?', options: ['Recession', 'Expansion', 'Crisis', 'Panic'], correctIndex: 1, explanation: 'Demand rises with economy.' },
      { question: 'Defensive sectors protect during?', options: ['Boom', 'Expansion', 'Slowdown', 'Bull markets'], correctIndex: 2, explanation: 'Stable demand regardless of economy.' },
      { question: 'Sector rotation depends on?', options: ['Luck', 'Macro conditions', 'Charts only', 'Insider trades'], correctIndex: 1, explanation: 'Economic cycle drives rotation.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-42-factor-investing', title: '42. Factor-Based Investing',
    description: 'Quantitative screening with factors.',
    category: 'strategies', difficulty: 'advanced', durationMinutes: 15,
    rating: 4.7, totalRatings: 1350, icon: 'Sliders',
    concepts: ['factor-investing', 'momentum', 'quality-factor'], tools: ['multi-factor-scorecard'],
    sections: [
      { title: 'Key Factors', content: `**Value:** Low P/E, P/B\n**Momentum:** Rising prices\n**Quality:** High ROE, low debt\n**Size:** Small caps\n**Low Volatility:** Stable stocks\n\nCombining factors improves consistency.` },
      { title: 'India Example', content: `Momentum screens in midcaps outperform in bull phases.` }
    ],
    quiz: { questions: [
      { question: 'Factor investing relies on?', options: ['Stories', 'Data & rules', 'Tips', 'News'], correctIndex: 1, explanation: 'Systematic, rules-based approach.' },
      { question: 'Combining factors reduces?', options: ['Returns', 'Consistency', 'Drawdowns', 'Accuracy'], correctIndex: 2, explanation: 'Diversification across factors.' },
      { question: 'Momentum factor selects stocks with?', options: ['Low P/E', 'Rising prices', 'High dividends', 'Low volatility'], correctIndex: 1, explanation: 'Recent price trend continuation.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-43-relative-valuation', title: '43. Relative Valuation: Comps',
    description: 'Comparing companies using multiples.',
    category: 'analysis', difficulty: 'advanced', durationMinutes: 15,
    rating: 4.7, totalRatings: 1400, icon: 'GitCompare',
    concepts: ['relative-valuation', 'ev-ebitda', 'comps'], tools: ['peer-comparison'],
    sections: [
      { title: 'Relative Valuation', content: `Compare with peers using multiples:\n- P/E, P/B\n- **EV/EBITDA:** Enterprise Value / EBITDA\n- PEG ratio\n\n**EV = Market Cap + Debt − Cash**` },
      { title: 'India Example', content: `EV/EBITDA used for telecom, infrastructure (different capital structures).` }
    ],
    quiz: { questions: [
      { question: 'EV includes?', options: ['Equity only', 'Equity + debt − cash', 'Revenue', 'Profit'], correctIndex: 1, explanation: 'Total firm value including debt.' },
      { question: 'EV/EBITDA preferred when?', options: ['No debt', 'Different capital structures', 'Negative earnings', 'High growth'], correctIndex: 1, explanation: 'Normalizes for leverage differences.' },
      { question: 'Relative valuation depends on?', options: ['Peer selection', 'Accounting rules', 'Luck', 'Volume'], correctIndex: 0, explanation: 'Garbage in, garbage out.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-44-market-microstructure', title: '44. Market Microstructure',
    description: 'How trades are executed.',
    category: 'concepts', difficulty: 'advanced', durationMinutes: 12,
    rating: 4.6, totalRatings: 1200, icon: 'Cpu',
    concepts: ['market-microstructure', 'bid-ask', 'liquidity'], tools: [],
    sections: [
      { title: 'Microstructure', content: `**Order Book (Level 2):** Shows all bids/asks.\n**Bid-Ask Spread:** Liquidity cost.\n**Circuit Breakers:** Halt trading in extreme moves.\n\n**Insider trading:** Using non-public material info (illegal).` },
      { title: 'India Example', content: `NSE circuit breakers halt trading at 10%, 15%, 20% moves.` }
    ],
    quiz: { questions: [
      { question: 'Bid-ask spread represents?', options: ['Profit', 'Liquidity cost', 'Tax', 'Volume'], correctIndex: 1, explanation: 'Cost of immediate execution.' },
      { question: 'Circuit breakers exist to?', options: ['Control prices', 'Prevent panic', 'Increase volume', 'Favor institutions'], correctIndex: 1, explanation: 'Cool down extreme moves.' },
      { question: 'Insider trading involves?', options: ['Public info', 'Non-public material info', 'Technical analysis', 'Arbitrage'], correctIndex: 1, explanation: 'Trading on private information.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-45-behavioral-biases', title: '45. Advanced Behavioral Biases',
    description: 'Deep dive into trading psychology.',
    category: 'concepts', difficulty: 'advanced', durationMinutes: 15,
    rating: 4.8, totalRatings: 1500, icon: 'Brain',
    concepts: ['confirmation-bias', 'overconfidence', 'recency-bias'], tools: [],
    sections: [
      { title: 'Advanced Biases', content: `**Confirmation Bias:** Seeking supportive info only.\n**Overconfidence:** Excessive risk-taking.\n**Recency Bias:** Overweighting recent events.\n**Sunk-Cost Fallacy:** Holding losers too long.\n\nJournaling and rules reduce bias impact.` },
      { title: 'India Example', content: `Retail chasing recent multibaggers = recency bias.` }
    ],
    quiz: { questions: [
      { question: 'Confirmation bias means?', options: ['Ignoring data', 'Seeking info that supports belief', 'Panic selling', 'Over-diversifying'], correctIndex: 1, explanation: 'Only seeing what you want to see.' },
      { question: 'Overconfidence leads to?', options: ['Smaller positions', 'Excessive risk-taking', 'Better returns', 'Stability'], correctIndex: 1, explanation: 'Taking bigger bets than warranted.' },
      { question: 'Best bias-control tool?', options: ['News', 'Tips', 'Journal & rules', 'Leverage'], correctIndex: 2, explanation: 'Systematic approach removes emotion.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-46-rebalancing', title: '46. Portfolio Rebalancing & Tax',
    description: 'Maintaining allocation and tax efficiency.',
    category: 'strategies', difficulty: 'advanced', durationMinutes: 12,
    rating: 4.7, totalRatings: 1300, icon: 'RefreshCcw',
    concepts: ['rebalancing', 'tax-loss-harvesting'], tools: ['rebalance-optimizer', 'tax-calculator'],
    sections: [
      { title: 'Rebalancing', content: `**Methods:**\n- Calendar-based (quarterly/yearly)\n- Threshold-based (when allocation drifts 5%+)\n\n**Tax Optimization:**\n- Harvest losses before FY end\n- Manage holding periods for LTCG` },
      { title: 'India Example', content: `Sell loss-making stocks before March 31 to offset LTCG.` }
    ],
    quiz: { questions: [
      { question: 'Rebalancing helps control?', options: ['Returns', 'Risk profile', 'Inflation', 'Volatility always'], correctIndex: 1, explanation: 'Maintains target allocation.' },
      { question: 'Tax-loss harvesting reduces?', options: ['Gross returns', 'Tax liability', 'Risk', 'Brokerage'], correctIndex: 1, explanation: 'Losses offset gains.' },
      { question: 'Threshold rebalancing triggers when?', options: ['Time passes', 'Allocation deviates beyond limit', 'Market crashes', 'Dividend paid'], correctIndex: 1, explanation: 'Based on drift, not calendar.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-47-international', title: '47. International Diversification & ADRs',
    description: 'Global exposure for Indian investors.',
    category: 'strategies', difficulty: 'advanced', durationMinutes: 12,
    rating: 4.6, totalRatings: 1250, icon: 'Globe',
    concepts: ['international-investing', 'adr', 'currency-risk'], tools: [],
    sections: [
      { title: 'Global Diversification', content: `Reduces country risk. Currency affects returns.\n\n**ADR (American Depository Receipt):** Access foreign stocks without overseas account.\n\nINR depreciation helps foreign investment returns.` },
      { title: 'India Example', content: `US equity exposure hedges INR depreciation risk.` }
    ],
    quiz: { questions: [
      { question: 'ADR stands for?', options: ['American Depository Receipt', 'Annual Dividend Rate', 'Asset Debt Ratio', 'Advanced Derivative Rule'], correctIndex: 0, explanation: 'Foreign stock traded in US.' },
      { question: 'International investing adds?', options: ['Only risk', 'Country & currency diversification', 'Guaranteed returns', 'Tax exemption'], correctIndex: 1, explanation: 'Reduces home country concentration.' },
      { question: 'Currency depreciation helps?', options: ['Importers', 'Foreign investment returns in INR', 'Domestic equities', 'FDs'], correctIndex: 1, explanation: 'Foreign gains amplified in weak rupee.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-48-hedging', title: '48. Derivative Hedging Strategies',
    description: 'Protecting portfolios with derivatives.',
    category: 'strategies', difficulty: 'advanced', durationMinutes: 15,
    rating: 4.7, totalRatings: 1400, icon: 'Shield',
    concepts: ['hedging', 'protective-put', 'collar'], tools: ['fno-risk-advisor'],
    sections: [
      { title: 'Hedging Strategies', content: `**Protective Put:** Buy puts on holdings.\n**Collar:** Put + covered call.\n**Futures Hedge:** Short futures against long stocks.\n\nCost of hedge reduces upside but limits downside.` },
      { title: 'India Example', content: `Buy Nifty puts before elections to hedge portfolio.` }
    ],
    quiz: { questions: [
      { question: 'Protective put limits?', options: ['Upside', 'Downside risk', 'Volatility', 'Time decay'], correctIndex: 1, explanation: 'Caps losses at strike minus premium.' },
      { question: 'Collar strategy involves?', options: ['Only puts', 'Only calls', 'Call + put combo', 'Futures'], correctIndex: 2, explanation: 'Buy put, sell call.' },
      { question: 'Hedging is used to?', options: ['Maximize profit', 'Reduce risk', 'Beat index', 'Time market'], correctIndex: 1, explanation: 'Protection, not profit maximization.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-49-event-trading', title: '49. Earnings & Event-Driven Trading',
    description: 'Trading around corporate events.',
    category: 'strategies', difficulty: 'advanced', durationMinutes: 15,
    rating: 4.6, totalRatings: 1350, icon: 'Calendar',
    concepts: ['earnings-surprise', 'event-trading', 'volatility-crush'], tools: ['earnings-quality'],
    sections: [
      { title: 'Event Trading', content: `**Earnings Surprise:** Deviation from expectations causes gaps.\n**Guidance:** Forward outlook matters more than current results.\n**Volatility Crush:** IV drops sharply after event.\n\nRequires strict risk control.` },
      { title: 'India Example', content: `IT stocks gap sharply post-results based on guidance.` }
    ],
    quiz: { questions: [
      { question: 'Volatility crush occurs?', options: ['Before earnings', 'After earnings', 'During trading hours', 'In futures expiry'], correctIndex: 1, explanation: 'IV drops once uncertainty resolves.' },
      { question: 'Event trading risk is?', options: ['Low', 'Predictable', 'High & gap-driven', 'Guaranteed'], correctIndex: 2, explanation: 'Gaps can cause large losses.' },
      { question: 'Earnings surprise means?', options: ['Expected result', 'Deviation from expectations', 'Insider trading', 'Dividend'], correctIndex: 1, explanation: 'Actual vs expected difference.' }
    ], passingScore: 67 }
  },
  {
    id: 'cur-50-trading-system', title: '50. Building Your Trading System',
    description: 'Creating a systematic approach.',
    category: 'strategies', difficulty: 'advanced', durationMinutes: 20,
    rating: 4.9, totalRatings: 1600, icon: 'Settings',
    concepts: ['trading-system', 'sharpe-ratio', 'drawdown'], tools: ['trade-expectancy'],
    sections: [
      { title: 'System Components', content: `**Define:**\n- Strategy rules\n- Risk limits\n- Position sizing\n- Review process\n\n**Metrics:** CAGR, Max Drawdown, Sharpe Ratio, Win Rate.\n\n**Key:** Consistency beats prediction.` },
      { title: 'India Example', content: `Systematic SIP + periodic rebalance outperforms emotional trading.` }
    ],
    quiz: { questions: [
      { question: 'Sharpe ratio measures?', options: ['Total return', 'Risk-adjusted return', 'Drawdown', 'Win rate'], correctIndex: 1, explanation: 'Return per unit of risk.' },
      { question: 'Journaling improves?', options: ['Luck', 'Discipline & learning', 'Leverage', 'Frequency'], correctIndex: 1, explanation: 'Learn from mistakes systematically.' },
      { question: 'A system removes?', options: ['Risk', 'Emotions & randomness', 'Losses', 'Taxes'], correctIndex: 1, explanation: 'Replaces gut feel with rules.' }
    ], passingScore: 67 }
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// ADVANCED FLASHCARDS - 25 cards
// ═══════════════════════════════════════════════════════════════════════════

export const ADVANCED_FLASHCARDS: CurriculumFlashcard[] = [
  { id: 'af-01', front: 'DCF discounts', back: 'Future cash flows to present value' },
  { id: 'af-02', front: 'WACC represents', back: 'Weighted average cost of capital' },
  { id: 'af-03', front: 'Terminal value', back: 'Value beyond forecast period' },
  { id: 'af-04', front: 'Piotroski score range', back: '0-9 (higher = stronger)' },
  { id: 'af-05', front: 'Altman Z measures', back: 'Bankruptcy risk' },
  { id: 'af-06', front: 'High accruals signal', back: 'Earnings quality risk' },
  { id: 'af-07', front: 'ROIC > WACC means', back: 'Value creation' },
  { id: 'af-08', front: 'Insider buying signals', back: 'Management confidence' },
  { id: 'af-09', front: 'Delta (options)', back: 'Price sensitivity to underlying' },
  { id: 'af-10', front: 'Theta (options)', back: 'Time decay - benefits sellers' },
  { id: 'af-11', front: 'Straddle profits from', back: 'Big move either direction' },
  { id: 'af-12', front: 'Iron condor suits', back: 'Range-bound markets' },
  { id: 'af-13', front: 'Short selling risk', back: 'Unlimited loss potential' },
  { id: 'af-14', front: 'Futures MTM', back: 'Daily settlement' },
  { id: 'af-15', front: 'Contango', back: 'Futures > spot price' },
  { id: 'af-16', front: 'Sector rotation driven by', back: 'Economic cycles' },
  { id: 'af-17', front: 'Factor investing uses', back: 'Rules-based selection' },
  { id: 'af-18', front: 'Momentum factor selects', back: 'Rising price stocks' },
  { id: 'af-19', front: 'EV includes', back: 'Market cap + debt − cash' },
  { id: 'af-20', front: 'Bid-ask spread', back: 'Liquidity cost' },
  { id: 'af-21', front: 'Confirmation bias', back: 'Seeking supportive info only' },
  { id: 'af-22', front: 'Rebalancing controls', back: 'Portfolio risk drift' },
  { id: 'af-23', front: 'Tax-loss harvesting', back: 'Sell losers to offset gains' },
  { id: 'af-24', front: 'ADR provides', back: 'Foreign stock access' },
  { id: 'af-25', front: 'Sharpe ratio', back: 'Return per unit of risk' }
];

// ═══════════════════════════════════════════════════════════════════════════
// COMBINED EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const ALL_CURRICULUM_MODULES: LearningModule[] = [
  ...CURRICULUM_BEGINNER,
  ...CURRICULUM_INTERMEDIATE,
  ...CURRICULUM_ADVANCED
];

export const ALL_CURRICULUM_FLASHCARDS = {
  beginner: BEGINNER_FLASHCARDS,
  intermediate: INTERMEDIATE_FLASHCARDS,
  advanced: ADVANCED_FLASHCARDS,
  all: [...BEGINNER_FLASHCARDS, ...INTERMEDIATE_FLASHCARDS, ...ADVANCED_FLASHCARDS]
};

// Helper functions
export function getCurriculumByLevel(level: 'beginner' | 'intermediate' | 'advanced'): LearningModule[] {
  return ALL_CURRICULUM_MODULES.filter(m => m.difficulty === level);
}

export function getCurriculumModule(id: string): LearningModule | undefined {
  return ALL_CURRICULUM_MODULES.find(m => m.id === id);
}

export function getCurriculumModuleByNumber(num: number): LearningModule | undefined {
  const id = `cur-${num.toString().padStart(2, '0')}`;
  return ALL_CURRICULUM_MODULES.find(m => m.id.startsWith(id));
}

export function getFlashcardsByLevel(level: 'beginner' | 'intermediate' | 'advanced' | 'all') {
  return ALL_CURRICULUM_FLASHCARDS[level];
}
