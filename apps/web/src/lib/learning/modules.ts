// ═══════════════════════════════════════════════════════════════════════════
// LEARNING MODULES
// Structured curriculum for beginners to advanced traders
// ═══════════════════════════════════════════════════════════════════════════

import { DifficultyLevel } from './concepts';

// Import 50-module curriculum
import { CURRICULUM_BEGINNER } from './curriculum-beginner';
import { CURRICULUM_INTERMEDIATE } from './curriculum-intermediate';
import { CURRICULUM_ADVANCED } from './curriculum-advanced';

export type ModuleCategory = 'concepts' | 'strategies' | 'analysis' | 'tutorials';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: ModuleCategory;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  rating?: number;              // Out of 5
  totalRatings?: number;
  icon: string;                 // Lucide icon name
  concepts: string[];           // Concept IDs covered
  tools: string[];              // Related tool IDs
  prerequisites?: string[];     // Module IDs that should be completed first
  sections: ModuleSection[];
  quiz?: Quiz;
  marketExample?: MarketExample;
}

export interface ModuleSection {
  title: string;
  content: string;              // Markdown content
  conceptRefs?: string[];       // Concept IDs referenced in this section
  visualType?: 'image' | 'chart' | 'diagram' | 'video' | 'interactive';
  visualUrl?: string;
}

export interface Quiz {
  questions: QuizQuestion[];
  passingScore: number;         // Percentage
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MarketExample {
  title: string;
  description: string;
  stock?: string;               // Stock symbol for the example
  date?: string;                // When this happened
  setup: string;
  outcome: string;
  lesson: string;
  chartUrl?: string;            // URL to chart image
}

// ─────────────────────────────────────────────────────────────────────────────
// BEGINNER MODULES - Concepts Track
// ─────────────────────────────────────────────────────────────────────────────

export const BEGINNER_MODULES: LearningModule[] = [
  {
    id: 'intro-stock-market',
    title: 'Understanding Stock Markets',
    description: 'Learn the basics of how stock markets work, who participates, and why prices move.',
    category: 'concepts',
    difficulty: 'beginner',
    durationMinutes: 10,
    rating: 4.8,
    totalRatings: 1250,
    icon: 'TrendingUp',
    concepts: [],
    tools: [],
    sections: [
      {
        title: 'What is a Stock Market?',
        content: `A stock market is a marketplace where buyers and sellers come together to trade shares of publicly listed companies.

Think of it like a vegetable market, but instead of vegetables, people buy and sell ownership pieces (shares) of companies.

**Key Players:**
- **Companies** - List their shares to raise capital
- **Investors** - Buy shares hoping for long-term growth
- **Traders** - Buy and sell for short-term profits
- **Brokers** - Facilitate transactions (like Zerodha, Groww)
- **SEBI** - Regulator that ensures fair play`,
      },
      {
        title: 'Why Do Stock Prices Move?',
        content: `Stock prices move based on **supply and demand**:
- More buyers than sellers → Price goes up
- More sellers than buyers → Price goes down

**What influences demand?**
- Company earnings and growth
- Economic conditions
- Industry trends
- Investor sentiment
- Global events
- Interest rates

**Example:** If Reliance announces record profits, more people want to buy → demand increases → price rises.`,
      },
      {
        title: 'Indian Stock Market Basics',
        content: `**Two Main Exchanges:**
1. **NSE** (National Stock Exchange) - Larger, more liquid
2. **BSE** (Bombay Stock Exchange) - Older, also important

**Key Indices:**
- **Nifty 50** - Top 50 companies on NSE
- **Sensex** - Top 30 companies on BSE
- **Bank Nifty** - Top banking stocks

**Trading Hours:**
- Pre-market: 9:00 AM - 9:15 AM
- Regular: 9:15 AM - 3:30 PM
- Post-market: 3:40 PM - 4:00 PM

**Settlement:**
- T+1 settlement (trades settle next business day)`,
      }
    ],
    quiz: {
      questions: [
        {
          question: 'What happens when there are more buyers than sellers?',
          options: ['Price goes down', 'Price stays same', 'Price goes up', 'Market closes'],
          correctIndex: 2,
          explanation: 'When demand (buyers) exceeds supply (sellers), prices rise to attract more sellers.'
        },
        {
          question: 'What does Nifty 50 represent?',
          options: ['50 random stocks', 'Top 50 companies on NSE', 'Stock price of ₹50', 'Trading at 50 PE'],
          correctIndex: 1,
          explanation: 'Nifty 50 is an index of the top 50 companies listed on the National Stock Exchange.'
        }
      ],
      passingScore: 70
    }
  },
  {
    id: 'pe-ratio-explained',
    title: 'Understanding Stock P/E Ratios',
    description: 'Learn how to analyze Price-to-Earnings ratios and what they tell you about a stock\'s valuation.',
    category: 'concepts',
    difficulty: 'beginner',
    durationMinutes: 8,
    rating: 4.7,
    totalRatings: 980,
    icon: 'Calculator',
    concepts: ['pe-ratio', 'eps'],
    tools: ['valuation-summary', 'peer-comparison'],
    prerequisites: ['intro-stock-market'],
    sections: [
      {
        title: 'What is P/E Ratio?',
        content: `P/E Ratio tells you how much investors are paying for each rupee of company earnings.

**Formula:** P/E = Stock Price / Earnings Per Share (EPS)

**Example:**
- Stock price: ₹500
- EPS: ₹25
- P/E = 500/25 = **20x**

This means investors are paying ₹20 for every ₹1 of annual earnings.

**Simple interpretation:** If a company kept earning the same amount, it would take 20 years of earnings to equal what you paid for the stock.`,
        conceptRefs: ['pe-ratio', 'eps']
      },
      {
        title: 'What is a Good P/E?',
        content: `There's no universal "good" P/E - it depends on context:

**Industry Matters:**
| Sector | Typical P/E Range |
|--------|-------------------|
| IT Services | 20-35x |
| Banks | 10-20x |
| FMCG | 40-60x |
| Auto | 15-25x |
| Pharma | 20-40x |

**Why the difference?**
- High-growth industries deserve higher P/E
- Stable, slow-growth industries have lower P/E
- Quality companies command premium P/E

**Rule of Thumb for Nifty 50:**
- Below 18x: Potentially undervalued
- 18-22x: Fair value zone
- Above 25x: Potentially overvalued`,
        conceptRefs: ['pe-ratio']
      },
      {
        title: 'P/E Traps to Avoid',
        content: `**Common Mistakes:**

1. **Cross-sector comparison**
   - Wrong: "TCS (P/E 25) is expensive vs SBI (P/E 10)"
   - Right: Compare TCS with Infosys, Wipro

2. **Ignoring growth**
   - A P/E of 30 might be cheap for 40% growth company
   - A P/E of 10 might be expensive for -5% growth company

3. **One-time items**
   - Selling property can inflate EPS temporarily
   - Legal penalties can depress EPS temporarily
   - Look at normalized/adjusted EPS

4. **Negative earnings**
   - P/E is meaningless if company is losing money
   - Use Price/Sales instead`,
        conceptRefs: ['pe-ratio', 'peg-ratio']
      }
    ],
    marketExample: {
      title: 'Why Zomato Trades at High P/E',
      description: 'Understanding growth stock valuations',
      stock: 'ZOMATO',
      setup: 'Zomato trades at P/E of 200+ while making minimal profits. Many investors call it "overvalued."',
      outcome: 'Stock has still given returns because investors are paying for future growth potential.',
      lesson: 'High P/E can be justified if the company is growing revenue rapidly and has a path to high profits. For growth stocks, use P/E to Growth (PEG) ratio or Price/Sales instead.'
    },
    quiz: {
      questions: [
        {
          question: 'A stock at ₹100 with EPS of ₹5 has P/E of?',
          options: ['5x', '10x', '20x', '500x'],
          correctIndex: 2,
          explanation: 'P/E = Price/EPS = 100/5 = 20x'
        },
        {
          question: 'Why might an IT company have higher P/E than a PSU bank?',
          options: [
            'IT companies are older',
            'IT companies have higher growth expectations',
            'Banks are more profitable',
            'IT stocks are cheaper'
          ],
          correctIndex: 1,
          explanation: 'IT companies typically grow faster, so investors pay more for each rupee of current earnings.'
        }
      ],
      passingScore: 70
    }
  },
  {
    id: 'candlestick-basics',
    title: 'Reading Candlestick Charts',
    description: 'Master the art of reading price action through Japanese candlestick patterns.',
    category: 'analysis',
    difficulty: 'beginner',
    durationMinutes: 12,
    rating: 4.9,
    totalRatings: 2100,
    icon: 'BarChart3',
    concepts: ['candlestick-patterns'],
    tools: ['candlestick-hero', 'pattern-matcher'],
    sections: [
      {
        title: 'Anatomy of a Candlestick',
        content: `Each candle shows four prices for a time period:
- **Open (O)**: Starting price
- **High (H)**: Highest price reached
- **Low (L)**: Lowest price reached
- **Close (C)**: Ending price

**Body:** The thick part between Open and Close
- 🟢 Green/White: Close > Open (bullish)
- 🔴 Red/Black: Close < Open (bearish)

**Wicks/Shadows:** The thin lines above and below
- Upper wick: Shows price went higher but pulled back
- Lower wick: Shows price went lower but recovered

**What candles tell us:**
- Long body = Strong conviction
- Short body = Indecision
- Long upper wick = Selling pressure
- Long lower wick = Buying pressure`,
        conceptRefs: ['candlestick-patterns'],
        visualType: 'diagram'
      },
      {
        title: 'Single Candle Patterns',
        content: `**Doji** (Indecision)
- Open ≈ Close (tiny body)
- Shows market indecision
- After uptrend: Potential reversal
- After downtrend: Potential reversal

**Hammer** (Bullish reversal)
- Small body at top
- Long lower wick (2x+ body)
- Found after downtrend
- Shows buyers stepping in

**Shooting Star** (Bearish reversal)
- Small body at bottom
- Long upper wick (2x+ body)
- Found after uptrend
- Shows sellers stepping in

**Marubozu** (Strong momentum)
- No wicks, just body
- Green: Very bullish
- Red: Very bearish`,
        conceptRefs: ['candlestick-patterns']
      },
      {
        title: 'Two-Candle Patterns',
        content: `**Bullish Engulfing**
- First: Small red candle
- Second: Large green candle that "engulfs" first
- Strong bullish reversal signal
- Best at support levels

**Bearish Engulfing**
- First: Small green candle  
- Second: Large red candle that engulfs first
- Strong bearish reversal signal
- Best at resistance levels

**Harami** (Inside bar)
- Second candle body inside first candle body
- Shows momentum slowdown
- Bullish harami: Red then small green
- Bearish harami: Green then small red

**Key Rule:** These patterns are MORE reliable when:
1. They appear at key S/R levels
2. Volume confirms the pattern
3. On higher timeframes (daily > hourly > 15min)`,
        conceptRefs: ['candlestick-patterns', 'support-resistance']
      }
    ],
    marketExample: {
      title: 'Bullish Engulfing at Nifty Support',
      description: 'Real example of candlestick pattern working',
      stock: 'NIFTY50',
      date: '2023-10-26',
      setup: 'Nifty fell to 18,800 support. Formed a bullish engulfing pattern with high volume on daily chart.',
      outcome: 'Nifty rallied 800+ points over next 2 weeks.',
      lesson: 'Candlestick patterns at key support/resistance levels with volume confirmation are high-probability signals.'
    },
    quiz: {
      questions: [
        {
          question: 'A candle with long lower wick and small body at top is called?',
          options: ['Doji', 'Hammer', 'Shooting Star', 'Marubozu'],
          correctIndex: 1,
          explanation: 'Hammer has small body at top with long lower wick, showing buying pressure.'
        },
        {
          question: 'What does a Doji indicate?',
          options: ['Strong trend', 'Market indecision', 'Breakout coming', 'Gap up expected'],
          correctIndex: 1,
          explanation: 'Doji forms when open ≈ close, showing neither buyers nor sellers won that period.'
        }
      ],
      passingScore: 70
    }
  },
  {
    id: 'support-resistance-basics',
    title: 'Support & Resistance Levels',
    description: 'Learn to identify key price levels where stocks tend to reverse or consolidate.',
    category: 'concepts',
    difficulty: 'beginner',
    durationMinutes: 10,
    rating: 4.8,
    totalRatings: 1800,
    icon: 'GitBranch',
    concepts: ['support-resistance'],
    tools: ['price-structure', 'pattern-matcher'],
    prerequisites: ['candlestick-basics'],
    sections: [
      {
        title: 'What is Support & Resistance?',
        content: `**Support** is a price level where buying pressure overcomes selling pressure. Price tends to "bounce" off support.

**Resistance** is a price level where selling pressure overcomes buying pressure. Price tends to "reject" from resistance.

**Why do these levels form?**
- Previous highs/lows are remembered by traders
- Many orders cluster at round numbers
- Moving averages act as dynamic levels
- Fibonacci levels are self-fulfilling

**The more times a level is tested, the stronger it becomes** - but eventually, heavily tested levels break.`,
        conceptRefs: ['support-resistance']
      },
      {
        title: 'How to Draw S/R Levels',
        content: `**Step 1:** Zoom out to see the bigger picture

**Step 2:** Identify "swing highs" and "swing lows"
- Swing high: Peak with lower highs on both sides
- Swing low: Trough with higher lows on both sides

**Step 3:** Draw horizontal lines at these levels
- Look for levels tested multiple times
- More touches = stronger level

**Step 4:** Use zones, not exact prices
- S/R are areas, not precise numbers
- A ₹5-10 range is normal for stocks

**Common S/R Levels:**
- Previous day high/low (PDH/PDL)
- Week high/low
- 52-week high/low
- Round numbers (₹100, ₹500, ₹1000)
- Moving averages (20, 50, 200 DMA)`,
        conceptRefs: ['support-resistance', 'pivot-points']
      },
      {
        title: 'Trading with S/R Levels',
        content: `**Buy at Support:**
- Wait for price to reach support
- Look for bullish candlestick pattern
- Set stop loss below support
- Target: Next resistance level

**Sell at Resistance:**
- Wait for price to reach resistance
- Look for bearish candlestick pattern
- Set stop loss above resistance
- Target: Next support level

**Breakout Trading:**
- Wait for level to break with volume
- Enter on breakout or retest
- Old resistance becomes new support

**Key Rule:** Never trade S/R in isolation. Combine with:
- Volume (high volume = more significant)
- Candlestick patterns
- Trend direction
- Indicators (RSI, MACD)`,
        conceptRefs: ['support-resistance', 'candlestick-patterns', 'volume-analysis']
      }
    ],
    marketExample: {
      title: 'Bank Nifty Breakout from 44,000 Resistance',
      description: 'How resistance becomes support',
      stock: 'BANKNIFTY',
      date: '2023-07',
      setup: 'Bank Nifty faced resistance at 44,000 three times. On fourth attempt, broke with high volume.',
      outcome: '44,000 turned into support. Bank Nifty rallied to 46,000+ over next month.',
      lesson: 'When a level that acted as resistance multiple times finally breaks, it often becomes strong support. This is called "polarity change."'
    }
  },
  {
    id: 'risk-management-101',
    title: 'Risk Management Fundamentals',
    description: 'The most important skill in trading: protecting your capital and surviving to trade another day.',
    category: 'concepts',
    difficulty: 'beginner',
    durationMinutes: 15,
    rating: 4.9,
    totalRatings: 2500,
    icon: 'Shield',
    concepts: ['position-sizing', 'risk-reward-ratio', 'stop-loss'],
    tools: ['fno-risk-advisor', 'risk-health-dashboard', 'trade-expectancy'],
    sections: [
      {
        title: 'Why Risk Management Matters',
        content: `**The Math of Losses:**

| Loss | Recovery Needed |
|------|-----------------|
| 10% | 11% |
| 20% | 25% |
| 30% | 43% |
| 50% | 100% |
| 75% | 300% |

A 50% loss requires 100% gain just to break even!

**The SEBI Study Reality:**
- 90% of F&O traders lose money
- Average loss: ₹1.1 lakh per year
- Top 1% of traders make most of the profits

**Survival is the first priority.** You can't make money if you've blown up your account.`,
        conceptRefs: ['drawdown']
      },
      {
        title: 'The 1-2% Rule',
        content: `**Never risk more than 1-2% of your capital on a single trade.**

**Example:**
- Trading capital: ₹5,00,000
- Risk per trade: 1% = ₹5,000
- This is your maximum loss, not position size

**Why this works:**
- 10 consecutive losses = 10% drawdown (recoverable)
- You can be wrong many times and still survive
- Allows you to trade through losing streaks

**Calculate Position Size:**
\`\`\`
Position Size = Max Risk / (Entry - Stop Loss)

Example:
Capital: ₹5L, Risk: 1% = ₹5,000
Entry: ₹100, Stop Loss: ₹95
Risk per share: ₹5
Shares to buy: 5000/5 = 1000 shares
\`\`\``,
        conceptRefs: ['position-sizing', 'stop-loss']
      },
      {
        title: 'Risk-Reward Ratio',
        content: `**Risk-Reward Ratio (RRR)** compares potential loss to potential gain.

**Formula:** RRR = (Target - Entry) / (Entry - Stop Loss)

**Example:**
- Entry: ₹100
- Stop Loss: ₹95 (Risk = ₹5)
- Target: ₹115 (Reward = ₹15)
- RRR = 15/5 = 1:3

**Why RRR Matters:**

| RRR | Breakeven Win Rate |
|-----|-------------------|
| 1:1 | 50% |
| 1:2 | 33% |
| 1:3 | 25% |
| 1:4 | 20% |

**With 1:3 RRR, you can be wrong 70% of the time and still profit!**

**Minimum Rule:** Never take trades below 1:1.5 RRR`,
        conceptRefs: ['risk-reward-ratio']
      },
      {
        title: 'Setting Stop Losses',
        content: `**Stop Loss Placement Rules:**

1. **Below Support (for longs)**
   - Give 0.5-1% buffer below the level
   - Account for wicks/noise

2. **Above Resistance (for shorts)**
   - Give 0.5-1% buffer above the level

3. **ATR-Based Stops**
   - Use 1.5-2x ATR from entry
   - Adjusts for stock volatility

**Stop Loss Mistakes to Avoid:**

❌ Setting stop at obvious levels (everyone's stop is there)
❌ Moving stop further away hoping for recovery
❌ Not having a stop at all ("I'll watch it")
❌ Stop too tight for the timeframe

**Golden Rule:** Set your stop BEFORE entering the trade. If you can't afford the stop distance, reduce position size or skip the trade.`,
        conceptRefs: ['stop-loss', 'position-sizing']
      }
    ],
    marketExample: {
      title: 'Position Sizing Saves the Day',
      description: 'Real example of risk management in action',
      setup: 'Trader has ₹5L capital. Takes position in small-cap stock following 1% risk rule. Stock gaps down 30% on bad news.',
      outcome: 'Due to gap, stop loss didn\'t trigger at planned level. Actual loss was ₹15,000 (3% of capital) instead of ₹5,000.',
      lesson: 'Even with stop loss, gaps can cause larger losses. The 1% rule provides buffer for unexpected events. Trader survived to continue trading.'
    },
    quiz: {
      questions: [
        {
          question: 'If you lose 50% of your capital, how much gain do you need to recover?',
          options: ['50%', '75%', '100%', '200%'],
          correctIndex: 2,
          explanation: 'If ₹100 becomes ₹50 (50% loss), you need 100% gain on ₹50 to get back to ₹100.'
        },
        {
          question: 'With 1:3 RRR, what win rate do you need to be profitable?',
          options: ['25%', '33%', '50%', '75%'],
          correctIndex: 0,
          explanation: 'At 1:3 RRR, you make 3 when you win and lose 1 when wrong. 25% × 3 - 75% × 1 = 0, so above 25% is profitable.'
        }
      ],
      passingScore: 70
    }
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// INTERMEDIATE MODULES - Strategies Track
// ─────────────────────────────────────────────────────────────────────────────

export const INTERMEDIATE_MODULES: LearningModule[] = [
  {
    id: 'moving-averages-strategy',
    title: 'Technical Analysis: Moving Averages',
    description: 'Master the art of reading moving averages to identify trends and potential entry/exit points.',
    category: 'strategies',
    difficulty: 'intermediate',
    durationMinutes: 15,
    rating: 4.8,
    totalRatings: 1450,
    icon: 'Activity',
    concepts: ['moving-averages', 'trend-following'],
    tools: ['technical-indicators', 'trend-strength'],
    prerequisites: ['candlestick-basics', 'support-resistance-basics'],
    sections: [
      {
        title: 'SMA vs EMA',
        content: `**Simple Moving Average (SMA):**
- Equal weight to all prices
- Smoother, slower to react
- Good for longer-term trend

**Exponential Moving Average (EMA):**
- More weight to recent prices
- Faster to react to price changes
- Better for short-term trading

**Common Periods:**
- **9/20 EMA:** Short-term trend, scalping
- **50 EMA/SMA:** Medium-term trend, swing trading
- **200 SMA:** Long-term trend, investing

**Which to use?**
- Active trading: EMA (faster signals)
- Position trading: SMA (fewer false signals)
- Many traders use both for confirmation`,
        conceptRefs: ['moving-averages']
      },
      {
        title: 'Trading Strategies with MAs',
        content: `**Strategy 1: Price & MA Crossover**
- Buy: Price crosses above 20 EMA
- Sell: Price crosses below 20 EMA
- Add confirmation: Volume, RSI

**Strategy 2: MA Crossovers**
- Golden Cross: 50 SMA crosses above 200 SMA (Bullish)
- Death Cross: 50 SMA crosses below 200 SMA (Bearish)
- These are longer-term signals

**Strategy 3: MA as Support/Resistance**
- In uptrend: Price pulls back to 20 EMA = Buy opportunity
- In downtrend: Price rallies to 20 EMA = Sell opportunity

**Strategy 4: Multiple MA Ribbon**
- Use 10, 20, 30, 40, 50 EMAs
- When stacked in order (10>20>30...) = Strong trend
- When tangled = Ranging/choppy market`,
        conceptRefs: ['moving-averages', 'trend-following']
      },
      {
        title: 'Common MA Mistakes',
        content: `**Mistake 1: Using MAs in Sideways Markets**
- MAs are trend-following indicators
- In ranging markets, they give many false signals
- First identify if market is trending or ranging

**Mistake 2: Too Many MAs on Chart**
- Start with just 2-3 MAs
- More isn't better, it's confusing

**Mistake 3: Using Same Settings Everywhere**
- Different stocks have different characteristics
- Volatile stocks need larger period MAs
- Optimize based on historical performance

**Mistake 4: Ignoring Slope**
- Flat MA = No trend, avoid trading
- Steep MA = Strong trend, follow it
- The angle matters as much as the position`,
        conceptRefs: ['moving-averages']
      }
    ],
    marketExample: {
      title: '200 DMA Hold in March 2023',
      description: 'How institutions use 200 DMA',
      stock: 'NIFTY50',
      date: '2023-03',
      setup: 'Nifty corrected 5% and tested 200 DMA exactly. Many feared breakdown.',
      outcome: 'Heavy institutional buying at 200 DMA. Nifty bounced 1000+ points.',
      lesson: 'The 200 DMA is watched by institutional investors globally. When price touches it in an ongoing bull market, it often acts as strong support.'
    }
  },
  {
    id: 'rsi-macd-mastery',
    title: 'RSI and MACD Indicators',
    description: 'Learn to use momentum oscillators to identify overbought/oversold conditions and divergences.',
    category: 'analysis',
    difficulty: 'intermediate',
    durationMinutes: 18,
    rating: 4.7,
    totalRatings: 1200,
    icon: 'Gauge',
    concepts: ['rsi', 'macd'],
    tools: ['technical-indicators', 'momentum-heatmap'],
    prerequisites: ['moving-averages-strategy'],
    sections: [
      {
        title: 'Understanding RSI',
        content: `**RSI (Relative Strength Index)** measures momentum on a 0-100 scale.

**Interpretation:**
- RSI > 70: Overbought (potential pullback)
- RSI < 30: Oversold (potential bounce)
- RSI = 50: Neutral

**But wait - there's more to it:**

In **strong uptrends**, RSI can stay above 70 for extended periods. Selling just because RSI is 70 will miss big moves.

In **strong downtrends**, RSI can stay below 30 for weeks. Buying just because RSI is 30 will catch falling knives.

**Better approach:** Use RSI zones
- Uptrend: Look for bounces from 40-50 zone
- Downtrend: Look for rejections from 50-60 zone`,
        conceptRefs: ['rsi']
      },
      {
        title: 'RSI Divergences',
        content: `**Divergence** = Price and indicator moving in opposite directions

**Bullish Divergence:**
- Price: Lower low
- RSI: Higher low
- Signal: Momentum improving, potential bottom

**Bearish Divergence:**
- Price: Higher high
- RSI: Lower high
- Signal: Momentum weakening, potential top

**Trading Divergences:**
1. Identify divergence on RSI
2. Wait for price confirmation (break of recent high/low)
3. Enter on confirmation
4. Stop loss beyond the divergence swing

**Warning:** Divergences can persist for a long time. Never trade divergence alone without confirmation.`,
        conceptRefs: ['rsi', 'divergence']
      },
      {
        title: 'MACD Explained',
        content: `**MACD Components:**
1. **MACD Line** = 12 EMA - 26 EMA
2. **Signal Line** = 9 EMA of MACD Line
3. **Histogram** = MACD - Signal

**Key Signals:**
- MACD crosses above Signal = Bullish
- MACD crosses below Signal = Bearish
- Histogram growing = Momentum increasing
- Zero line crossover = Trend change

**Best MACD Setups:**
1. Crossover near zero line (early trend)
2. Histogram divergence from price
3. MACD in overbought/oversold regions

**Combining RSI + MACD:**
- Both bullish = Strong buy signal
- Divergence on both = Very high probability reversal
- Conflicting signals = Stay out or reduce size`,
        conceptRefs: ['macd', 'rsi']
      }
    ],
    marketExample: {
      title: 'Hidden Bullish Divergence in SBI',
      description: 'Spotting continuation signals',
      stock: 'SBIN',
      date: '2023-06',
      setup: 'SBI in uptrend. Price made higher low at ₹560, RSI made lower low. Hidden bullish divergence indicated trend continuation.',
      outcome: 'SBI rallied from ₹560 to ₹640 (14% gain) over next 3 weeks.',
      lesson: 'Hidden divergences (opposite of regular) indicate trend continuation. In uptrends, look for price higher lows with RSI lower lows.'
    }
  },
  {
    id: 'volume-analysis-basics',
    title: 'Volume Analysis Fundamentals',
    description: 'Learn to read volume profiles, VWAP, and institutional footprints for better trade entries.',
    category: 'technical',
    difficulty: 'intermediate',
    durationMinutes: 18,
    rating: 4.7,
    totalRatings: 1200,
    icon: 'BarChart3',
    concepts: ['volume-analysis', 'support-resistance'],
    tools: ['volume-profile', 'vwap-analysis', 'delivery-analysis'],
    prerequisites: ['candlestick-basics', 'support-resistance-basics'],
    sections: [
      {
        title: 'Why Volume Matters',
        content: `Volume is the number of shares traded during a period. It confirms price moves and reveals institutional activity.

**Volume Principles:**
1. **Volume confirms trends** - Rising price + rising volume = healthy trend
2. **Volume precedes price** - Big volume often appears before big moves
3. **Climax volume** - Extremely high volume marks exhaustion/reversal

**In Indian Markets:**
- Delivery % shows conviction (buy and hold vs intraday speculation)
- FII/DII data shows institutional activity
- Option OI changes show positioning

**Key Volume Patterns:**
- Breakout on high volume = valid breakout
- Breakout on low volume = suspect, may fail
- High volume reversal candles = significant`,
        conceptRefs: ['volume-analysis']
      },
      {
        title: 'VWAP - Institutional Benchmark',
        content: `**VWAP (Volume Weighted Average Price)** is the average price weighted by volume. Institutions use it as their benchmark.

**Formula:**
VWAP = Cumulative(Price × Volume) / Cumulative(Volume)

**Why Institutions Care:**
- Buying below VWAP = good execution
- Selling above VWAP = good execution
- VWAP is their performance metric

**Trading with VWAP:**
- Price above VWAP = bullish intraday bias
- Price below VWAP = bearish intraday bias
- VWAP acts as dynamic support/resistance

**VWAP Bands:**
- ±1 standard deviation from VWAP
- ±2 standard deviation marks extremes
- Mean reversion trades at ±2σ bands

**Best Practices:**
- VWAP resets daily
- First 30 min VWAP is unreliable
- Works best on liquid stocks`,
        conceptRefs: ['volume-analysis']
      },
      {
        title: 'Volume Profile Analysis',
        content: `**Volume Profile** shows volume at each price level, not each time period. It reveals where real supply/demand exists.

**Key Levels:**
- **POC (Point of Control)** - Price with highest volume, acts as magnet
- **VAH (Value Area High)** - Upper boundary of 70% volume zone
- **VAL (Value Area Low)** - Lower boundary of 70% volume zone
- **HVN** - High Volume Nodes (support/resistance)
- **LVN** - Low Volume Nodes (price moves fast through these)

**Profile Shapes:**
- **P-Shape** - Buying pressure, higher prices expected
- **b-Shape** - Selling pressure, lower prices expected
- **D-Shape** - Balanced, consolidation
- **B-Shape** - Double distribution, breakout coming

**Trading Applications:**
1. Trade bounces at POC
2. Enter on pullbacks to VAH/VAL
3. Target LVN zones (price moves fast through them)
4. Watch for rejection at HVN`,
        conceptRefs: ['volume-analysis', 'support-resistance']
      }
    ],
    marketExample: {
      stock: 'RELIANCE',
      date: '2024-11',
      setup: 'RELIANCE in consolidation. Volume profile showed strong POC at ₹2,480 with P-Shape profile indicating buying pressure.',
      outcome: 'Price retested POC, bounced, and rallied 4% over next week.',
      lesson: 'Volume profile POC acts as a magnet and strong support. P-Shape profile confirms underlying buying pressure.'
    }
  },
  {
    id: 'tax-planning-basics',
    title: 'Tax Planning for Traders',
    description: 'Understand LTCG, STCG, tax-loss harvesting, and optimize your post-tax returns.',
    category: 'concepts',
    difficulty: 'intermediate',
    durationMinutes: 15,
    rating: 4.8,
    totalRatings: 950,
    icon: 'Calculator',
    concepts: ['portfolio-management'],
    tools: ['tax-calculator', 'portfolio-leaderboard'],
    prerequisites: ['intro-stock-market'],
    sections: [
      {
        title: 'Capital Gains Tax in India',
        content: `**Budget 2024 Changes (FY 2024-25 onwards):**

**Long-Term Capital Gains (LTCG):**
- Holding period: >12 months
- Tax rate: **12.5%** (up from 10%)
- Exemption: **₹1.25 Lakh** (up from ₹1 Lakh)
- Only gains above ₹1.25L are taxed

**Short-Term Capital Gains (STCG):**
- Holding period: <12 months
- Tax rate: **20%** (up from 15%)
- No exemption limit

**Example:**
- Buy TCS at ₹3,000, sell at ₹4,000 after 14 months
- Gain = ₹1,000 per share × 100 shares = ₹1,00,000
- Tax = ₹0 (within ₹1.25L exemption)

- Same trade after 8 months:
- STCG Tax = ₹1,00,000 × 20% = ₹20,000`,
        conceptRefs: ['portfolio-management']
      },
      {
        title: 'Tax-Loss Harvesting',
        content: `**Tax-Loss Harvesting** is selling losing positions to book losses that offset your gains.

**How It Works:**
1. Identify positions with unrealized losses
2. Sell to "book" the loss before FY end
3. Offset losses against gains to reduce tax
4. Can buy back after 30 days (avoid wash sale)

**Rules:**
- LTCG losses offset only LTCG gains
- STCG losses offset both STCG and LTCG gains
- Unused losses carry forward for 8 years

**Example:**
- LTCG on TCS: +₹2,00,000
- LTCG loss on WIPRO: -₹75,000
- Net LTCG: ₹1,25,000
- Tax = (₹1,25,000 - ₹1,25,000) × 12.5% = ₹0

**When to Harvest:**
- Before March 31 (FY end)
- When position has permanent loss potential
- Consider transaction costs`,
        conceptRefs: ['portfolio-management']
      },
      {
        title: 'Dividend & Other Taxes',
        content: `**Dividend Tax:**
- Taxed at your income tax slab rate
- TDS of 10% if dividend from single company >₹10,000
- No separate exemption

**Securities Transaction Tax (STT):**
- Already deducted, no additional action needed
- Equity delivery: 0.1%
- F&O: 0.0125% - 0.05%

**Speculative vs Non-Speculative:**
- Intraday = Speculative business income
- Delivery = Capital gains
- F&O = Non-speculative business income

**Record Keeping:**
- Maintain trade logs with buy date, price, quantity
- Keep contract notes for 8 years
- Track cost basis for each holding

**Pro Tips:**
- Hold for 12+ months if close to target
- Harvest losses systematically
- Consider holding period when selling winners`,
        conceptRefs: ['portfolio-management']
      }
    ],
    marketExample: {
      stock: 'Portfolio',
      date: '2024-03',
      setup: 'Investor had ₹2.5L LTCG and ₹50K unrealized loss in TATASTEEL before FY end.',
      outcome: 'Sold TATASTEEL to book ₹50K loss. Net LTCG = ₹2L. Tax = (₹2L - ₹1.25L) × 12.5% = ₹9,375. Saved ₹6,250 vs not harvesting.',
      lesson: 'Tax-loss harvesting before FY end can save significant tax. Always review portfolio in March.'
    }
  },
  {
    id: 'fno-basics',
    title: 'Futures & Options Fundamentals',
    description: 'Introduction to derivative trading in Indian markets - lot sizes, margins, and basic strategies.',
    category: 'concepts',
    difficulty: 'intermediate',
    durationMinutes: 20,
    rating: 4.6,
    totalRatings: 1800,
    icon: 'Layers',
    concepts: ['open-interest', 'option-greeks'],
    tools: ['options-strategy', 'fno-risk-advisor'],
    prerequisites: ['risk-management-101'],
    sections: [
      {
        title: 'What are Derivatives?',
        content: `**Derivatives** are contracts whose value is "derived" from an underlying asset.

**Types in Indian Markets:**
1. **Futures** - Obligation to buy/sell at future date
2. **Options** - Right (not obligation) to buy/sell

**Why Trade Derivatives?**
- **Leverage:** Control larger position with less capital
- **Hedging:** Protect stock portfolio from downside
- **Income:** Sell options to earn premium

**Key Differences from Stocks:**
- Expire on specific dates (weekly/monthly)
- Require margin, not full payment
- Can lose more than invested (futures)
- Time decay affects options

**Risk Warning:** 
SEBI data shows 9 out of 10 F&O traders lose money. Learn thoroughly before trading.`,
        conceptRefs: ['open-interest']
      },
      {
        title: 'Understanding Indian F&O',
        content: `**Contract Specifications:**

| Index | Lot Size | Tick Size |
|-------|----------|-----------|
| Nifty 50 | 50 | 0.05 |
| Bank Nifty | 15 | 0.05 |
| Fin Nifty | 25 | 0.05 |

**Expiry:**
- Weekly: Every Thursday
- Monthly: Last Thursday

**Margin Types:**
- **SPAN Margin:** Initial margin required
- **Exposure Margin:** Additional risk margin
- **Total Margin:** SPAN + Exposure

**Example - Nifty Futures:**
- Nifty at 22,000
- Lot size: 50
- Contract value: 22,000 × 50 = ₹11,00,000
- Margin required: ~₹1,10,000 (10%)
- You control ₹11L with ₹1.1L = 10x leverage`,
        conceptRefs: ['open-interest']
      },
      {
        title: 'Options Basics',
        content: `**Call Option (CE):** Right to BUY
- Buy Call: Bullish (unlimited profit, limited loss)
- Sell Call: Bearish/Neutral (limited profit, unlimited loss)

**Put Option (PE):** Right to SELL
- Buy Put: Bearish (large profit potential, limited loss)
- Sell Put: Bullish/Neutral (limited profit, large loss potential)

**Key Terms:**
- **Strike Price:** The price at which option can be exercised
- **Premium:** Price paid for the option
- **ITM:** In The Money (has intrinsic value)
- **ATM:** At The Money (strike = current price)
- **OTM:** Out of The Money (no intrinsic value)

**Time Decay:**
Options lose value every day (Theta decay)
- ATM options decay fastest
- Accelerates in final week
- Option sellers benefit from this`,
        conceptRefs: ['option-greeks']
      }
    ],
    marketExample: {
      title: 'Weekly Expiry Theta Decay',
      description: 'Why option buying on Thursday is risky',
      stock: 'BANKNIFTY',
      setup: 'Trader buys Bank Nifty 45000 CE at ₹200 on Wednesday morning. Bank Nifty stays flat at 44,900.',
      outcome: 'By Thursday 2 PM, option value drops to ₹50. Trader loses 75% despite no movement in Bank Nifty.',
      lesson: 'Time decay (Theta) is brutal near expiry. Option buyers need quick directional moves. If you expect slow moves, consider selling options or buy next week expiry.'
    }
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// ADVANCED MODULES
// ─────────────────────────────────────────────────────────────────────────────

export const ADVANCED_MODULES: LearningModule[] = [
  {
    id: 'options-strategies',
    title: 'Options Trading Strategies',
    description: 'Advanced options strategies including spreads, straddles, and iron condors.',
    category: 'strategies',
    difficulty: 'advanced',
    durationMinutes: 25,
    rating: 4.5,
    totalRatings: 800,
    icon: 'Sparkles',
    concepts: ['option-greeks', 'open-interest'],
    tools: ['options-strategy', 'fno-risk-advisor'],
    prerequisites: ['fno-basics'],
    sections: [
      {
        title: 'Understanding Option Greeks',
        content: `**Delta (Δ):** How much option price moves per ₹1 move in underlying
- Call Delta: 0 to 1 (ATM ≈ 0.5)
- Put Delta: -1 to 0

**Gamma (Γ):** Rate of change of Delta
- Highest for ATM options near expiry
- Creates risk for option sellers

**Theta (Θ):** Daily time decay (negative for buyers)
- ATM decays fastest
- Accelerates near expiry

**Vega (ν):** Sensitivity to implied volatility
- High before events (earnings, elections)
- IV crush after events

**Managing Greeks:**
- Delta: Directional exposure
- Gamma: Adjust positions as price moves
- Theta: Time is money (sellers win)
- Vega: Event risk management`,
        conceptRefs: ['option-greeks']
      },
      {
        title: 'Spread Strategies',
        content: `**Bull Call Spread:**
- Buy lower strike Call + Sell higher strike Call
- Limited profit, limited loss
- Use when moderately bullish

**Bear Put Spread:**
- Buy higher strike Put + Sell lower strike Put
- Limited profit, limited loss
- Use when moderately bearish

**Example - Bull Call Spread:**
Nifty at 22,000
- Buy 22,000 CE @ ₹200
- Sell 22,200 CE @ ₹100
- Net cost: ₹100
- Max profit: ₹200 - ₹100 = ₹100 (if above 22,200)
- Max loss: ₹100 (if below 22,000)
- Breakeven: 22,100

**Why spreads?**
- Lower cost than naked options
- Defined risk
- Reduce theta decay impact`,
        conceptRefs: ['option-greeks']
      },
      {
        title: 'Non-Directional Strategies',
        content: `**Straddle:** Buy both ATM Call and Put
- Profit from big move in either direction
- High cost, needs large move
- Use before uncertain events

**Strangle:** Buy OTM Call and OTM Put
- Cheaper than straddle
- Needs even larger move to profit
- Popular before earnings/events

**Iron Condor:**
- Sell OTM Call + Buy further OTM Call
- Sell OTM Put + Buy further OTM Put
- Profit if price stays in range
- Popular in sideways markets
- Limited risk, limited reward

**Example - Iron Condor:**
Nifty at 22,000, expecting range 21,800-22,200
- Sell 21,800 PE, Buy 21,700 PE
- Sell 22,200 CE, Buy 22,300 CE
- Collect premium, keep if Nifty stays in range
- Max loss if breaks either side significantly`,
        conceptRefs: ['option-greeks', 'open-interest']
      }
    ],
    marketExample: {
      title: 'Iron Condor During Budget Week',
      description: 'Selling premium in expected range',
      stock: 'NIFTY50',
      date: '2024-02',
      setup: 'Budget week expected to be event-less. IV was high. Trader sold Nifty Iron Condor 21700-21900-22100-22300.',
      outcome: 'Nifty stayed in range. IV crushed after event. Trader kept 70% of premium.',
      lesson: 'Selling premium works best when IV is high and you expect range-bound movement. Events that are "priced in" often result in IV crush, benefiting sellers.'
    }
  },
  {
    id: 'position-sizing-advanced',
    title: 'Advanced Position Sizing',
    description: 'Kelly Criterion, volatility-based sizing, and portfolio heat management.',
    category: 'strategies',
    difficulty: 'advanced',
    durationMinutes: 20,
    rating: 4.7,
    totalRatings: 650,
    icon: 'Target',
    concepts: ['position-sizing', 'sharpe-ratio', 'drawdown'],
    tools: ['fno-risk-advisor', 'trade-expectancy', 'drawdown-var'],
    prerequisites: ['risk-management-101'],
    sections: [
      {
        title: 'Kelly Criterion',
        content: `**Kelly Criterion** calculates optimal bet size to maximize long-term growth.

**Formula:**
Kelly % = W - [(1-W) / R]

Where:
- W = Win rate (as decimal)
- R = Win/Loss ratio

**Example:**
- Win rate: 55%
- Average win: ₹2,000
- Average loss: ₹1,000
- R = 2000/1000 = 2

Kelly = 0.55 - (0.45/2) = 0.55 - 0.225 = 0.325 = **32.5%**

**In Practice:**
- Full Kelly is too aggressive
- Use Half-Kelly or Quarter-Kelly
- Recommended: 25-50% of Kelly

**Risks:**
- Assumes accurate edge calculation
- Doesn't account for drawdown tolerance
- Volatility of returns is high`,
        conceptRefs: ['position-sizing']
      },
      {
        title: 'Volatility-Based Sizing',
        content: `**ATR-Based Position Sizing:**

Position Size = (Account × Risk%) / (ATR × Multiplier)

**Example:**
- Account: ₹5,00,000
- Risk: 1% = ₹5,000
- Stock ATR (14-day): ₹15
- Multiplier: 2

Shares = 5000 / (15 × 2) = 5000/30 = 166 shares

**Why ATR-Based:**
- Automatically adjusts for volatility
- Volatile stocks → Smaller positions
- Stable stocks → Larger positions
- Equalizes risk across trades

**Portfolio Heat:**
Total portfolio risk = Sum of all position risks

**Rule:** Keep total heat below 6-10%
- 5 trades × 2% each = 10% heat
- All 5 losing = 10% drawdown (acceptable)`,
        conceptRefs: ['position-sizing', 'stop-loss']
      }
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// COMBINE ALL MODULES
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_MODULES: LearningModule[] = [
  // Original modules
  ...BEGINNER_MODULES,
  ...INTERMEDIATE_MODULES,
  ...ADVANCED_MODULES,
  // 50-module curriculum
  ...CURRICULUM_BEGINNER,
  ...CURRICULUM_INTERMEDIATE,
  ...CURRICULUM_ADVANCED,
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export function getModuleById(id: string): LearningModule | undefined {
  return ALL_MODULES.find(m => m.id === id);
}

export function getModulesByCategory(category: ModuleCategory): LearningModule[] {
  return ALL_MODULES.filter(m => m.category === category);
}

export function getModulesByDifficulty(difficulty: DifficultyLevel): LearningModule[] {
  return ALL_MODULES.filter(m => m.difficulty === difficulty);
}

export function getPrerequisites(moduleId: string): LearningModule[] {
  const module = getModuleById(moduleId);
  if (!module?.prerequisites) return [];
  return module.prerequisites
    .map(id => getModuleById(id))
    .filter((m): m is LearningModule => m !== undefined);
}

export function getNextModules(completedIds: string[]): LearningModule[] {
  return ALL_MODULES.filter(m => {
    // Not completed
    if (completedIds.includes(m.id)) return false;
    // All prerequisites completed
    if (m.prerequisites) {
      return m.prerequisites.every(prereq => completedIds.includes(prereq));
    }
    return true;
  });
}
