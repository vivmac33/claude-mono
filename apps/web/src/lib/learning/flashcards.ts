// ═══════════════════════════════════════════════════════════════════════════
// FLASHCARDS DATABASE
// 125 flashcards organized by learning path (25 per path)
// ═══════════════════════════════════════════════════════════════════════════

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  relatedTools?: string[];
  relatedConcepts?: string[];
}

export interface FlashcardDeck {
  pathId: string;
  pathName: string;
  description: string;
  cards: Flashcard[];
}

// ─────────────────────────────────────────────────────────────────────────────
// PATH 1: SCALPER MASTERY — 25 FLASHCARDS
// ─────────────────────────────────────────────────────────────────────────────

export const SCALPER_FLASHCARDS: Flashcard[] = [
  {
    id: 'scalper-1',
    front: 'What Candles Represent',
    back: 'Candles show the open, high, low, and close of price during a time interval. The body reveals buyer/seller strength, while wicks show rejection points. Scalpers rely heavily on candle behavior to interpret fast market sentiment.',
    category: 'price-action',
    difficulty: 'easy',
    relatedTools: ['candlestick-hero']
  },
  {
    id: 'scalper-2',
    front: 'Wick Rejections',
    back: 'Wicks indicate areas where price was rejected due to strong opposite pressure. Long upper wicks show selling dominance; long lower wicks show buyer defense. They help avoid chasing false breakouts.',
    category: 'price-action',
    difficulty: 'easy',
    relatedTools: ['candlestick-hero', 'price-structure']
  },
  {
    id: 'scalper-3',
    front: 'Engulfing Candle Pattern',
    back: 'An engulfing candle fully covers the previous candle\'s body, showing momentum shift. Bullish engulfing suggests strong buying takeover; bearish indicates selling strength. Works best near key levels.',
    category: 'price-action',
    difficulty: 'medium',
    relatedTools: ['candlestick-hero', 'pattern-matcher']
  },
  {
    id: 'scalper-4',
    front: 'Support & Resistance Levels',
    back: 'S/R levels come from previous highs/lows, round numbers, and reaction points. Price often respects these levels due to clustered orders. Scalpers rely on them for precision entries.',
    category: 'price-action',
    difficulty: 'easy',
    relatedTools: ['price-structure']
  },
  {
    id: 'scalper-5',
    front: 'Strong vs Weak Levels',
    back: 'Strong levels have multiple touches and strong reactions, while weak levels form from isolated movements. Strong levels create higher-probability trades. Weak levels break more easily.',
    category: 'price-action',
    difficulty: 'medium',
    relatedTools: ['price-structure']
  },
  {
    id: 'scalper-6',
    front: 'False Breakouts',
    back: 'A false breakout occurs when price briefly moves beyond a level but quickly reverses back. It often traps traders and creates sharp moves in the opposite direction. Wicks and low volume hint at fakeouts.',
    category: 'price-action',
    difficulty: 'medium',
    relatedTools: ['volume-profile', 'price-structure']
  },
  {
    id: 'scalper-7',
    front: 'Multi-Candle Reversals',
    back: 'Reversals like harami or tweezer candles indicate shifts in sentiment. They gain reliability when aligned with structure or volume confirmation. Used to anticipate trend change.',
    category: 'price-action',
    difficulty: 'medium',
    relatedTools: ['candlestick-hero']
  },
  {
    id: 'scalper-8',
    front: 'Volume Confirmation',
    back: 'Volume validates whether a move has institutional interest. Low volume means weak conviction; high volume strengthens signals. Scalpers use this to filter false setups.',
    category: 'volume',
    difficulty: 'easy',
    relatedTools: ['volume-profile', 'delivery-analysis']
  },
  {
    id: 'scalper-9',
    front: 'Trend vs Range Context',
    back: 'Reversal signals behave differently in trends versus ranges. A reversal in a strong trend is often just a pullback. Context prevents misreading patterns.',
    category: 'market-structure',
    difficulty: 'medium',
    relatedTools: ['market-regime-radar']
  },
  {
    id: 'scalper-10',
    front: 'Climactic Candles',
    back: 'A large candle with unusually high volume suggests exhaustion. It often signals the final push before reversal. Useful for anticipating turning points.',
    category: 'volume',
    difficulty: 'hard',
    relatedTools: ['volume-profile', 'candlestick-hero']
  },
  {
    id: 'scalper-11',
    front: 'VWAP Meaning',
    back: 'VWAP represents the average price institutions traded at during the session. Price above VWAP indicates bullish control; below shows bearish pressure. It is a crucial scalping reference.',
    category: 'volume',
    difficulty: 'easy',
    relatedTools: ['vwap-analysis']
  },
  {
    id: 'scalper-12',
    front: 'Anchored VWAP',
    back: 'Anchored VWAP calculates fair value from specific starting points like market open or high-volume events. It reveals hidden support/resistance zones. Helps refine intraday levels.',
    category: 'volume',
    difficulty: 'medium',
    relatedTools: ['vwap-analysis']
  },
  {
    id: 'scalper-13',
    front: 'Delivery Percentage',
    back: 'Delivery % shows the portion of shares actually delivered (not just traded). High delivery implies real buying interest. Useful for strengthening directional conviction.',
    category: 'volume',
    difficulty: 'medium',
    relatedTools: ['delivery-analysis']
  },
  {
    id: 'scalper-14',
    front: 'Absorption & Distribution',
    back: 'Absorption happens when price doesn\'t move despite heavy orders, signaling accumulation. Distribution occurs when large sellers absorb buyers. Recognizing these shifts improves reversal timing.',
    category: 'order-flow',
    difficulty: 'hard',
    relatedTools: ['trade-flow-intel', 'volume-profile']
  },
  {
    id: 'scalper-15',
    front: 'Value Area (Volume Profile)',
    back: 'The Value Area contains 70% of traded volume. Price tends to react strongly at VAH/VAL boundaries. Helps identify bounce or rejection zones.',
    category: 'volume',
    difficulty: 'medium',
    relatedTools: ['volume-profile']
  },
  {
    id: 'scalper-16',
    front: 'Point of Control (POC)',
    back: 'POC is the price level with maximum traded volume. Acts as a magnet during balance phases. Reversals at POC are common scalping setups.',
    category: 'volume',
    difficulty: 'medium',
    relatedTools: ['volume-profile']
  },
  {
    id: 'scalper-17',
    front: 'Low Volume Nodes (LVN)',
    back: 'LVNs show price areas with little interest. Price often moves swiftly through LVNs. They help anticipate momentum bursts.',
    category: 'volume',
    difficulty: 'medium',
    relatedTools: ['volume-profile']
  },
  {
    id: 'scalper-18',
    front: 'Per-Trade Risk Rule',
    back: 'Scalpers risk only 0.5–1% per trade to survive losing streaks. This keeps drawdowns manageable. Small risks ensure longevity.',
    category: 'risk-management',
    difficulty: 'easy',
    relatedTools: ['fno-risk-advisor', 'trade-expectancy']
  },
  {
    id: 'scalper-19',
    front: 'Daily Stop Rule',
    back: 'A daily stop prevents emotional overtrading after losses. Typically set at 3% of account equity. Protects capital from tilt.',
    category: 'risk-management',
    difficulty: 'easy',
    relatedTools: ['fno-risk-advisor']
  },
  {
    id: 'scalper-20',
    front: 'Position Sizing Formula',
    back: 'Position size = Risk per trade ÷ Stop-loss distance. This ensures consistent risk regardless of volatility. Prevents emotional over-sizing.',
    category: 'risk-management',
    difficulty: 'medium',
    relatedTools: ['fno-risk-advisor', 'trade-expectancy']
  },
  {
    id: 'scalper-21',
    front: 'CPR Setup',
    back: 'Central Pivot Range highlights intraday balance zones. Breakouts or rejections from CPR provide reliable scalping entries. Stronger when aligned with volume.',
    category: 'price-action',
    difficulty: 'medium',
    relatedTools: ['price-structure']
  },
  {
    id: 'scalper-22',
    front: 'Market Regime Filters',
    back: 'Scalpers avoid high-VIX or choppy markets and focus on structured trends. Regime filters prevent low-quality trades. Environment determines setup success.',
    category: 'market-structure',
    difficulty: 'medium',
    relatedTools: ['market-regime-radar']
  },
  {
    id: 'scalper-23',
    front: 'Playbook Development',
    back: 'A playbook defines entry, SL, targets, and filters. It ensures consistent behavior and repeatability. Reduces emotional decision-making.',
    category: 'psychology',
    difficulty: 'easy',
    relatedTools: ['playbook-builder']
  },
  {
    id: 'scalper-24',
    front: 'Pre-Trade Checklist',
    back: 'A quick checklist checks trend, levels, volatility, and emotional readiness. Ensures disciplined execution. Reduces impulsive trades.',
    category: 'psychology',
    difficulty: 'easy',
    relatedTools: ['playbook-builder', 'trade-journal']
  },
  {
    id: 'scalper-25',
    front: 'Post-Loss Routine',
    back: 'Helps calm emotional spikes after a loss. Prevents revenge trading. Encourages objective review and resets mental clarity.',
    category: 'psychology',
    difficulty: 'easy',
    relatedTools: ['trade-journal']
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// PATH 2: INTRADAY TRADER — 25 FLASHCARDS
// ─────────────────────────────────────────────────────────────────────────────

export const INTRADAY_FLASHCARDS: Flashcard[] = [
  {
    id: 'intraday-1',
    front: 'Global Cues Influence',
    back: 'Global markets like US indices or SGX Nifty affect India\'s opening sentiment. Strong global moves create gap opens and early volatility. Understanding these cues helps anticipate early directional bias.',
    category: 'market-structure',
    difficulty: 'easy',
    relatedTools: ['macro-pulse']
  },
  {
    id: 'intraday-2',
    front: 'Pre-Market Levels',
    back: 'Marking previous day\'s high/low, close, and overnight levels builds intraday structure. These levels attract liquidity and guide early trading. They form the backbone of first-hour analysis.',
    category: 'market-structure',
    difficulty: 'easy',
    relatedTools: ['price-structure', 'orb-analysis']
  },
  {
    id: 'intraday-3',
    front: 'Gap Logic',
    back: 'Gaps reflect overnight sentiment or news. A gap that holds suggests strong trend potential; a gap that fills indicates lack of follow-through. Recognizing gap behavior helps shape early expectations.',
    category: 'market-structure',
    difficulty: 'medium',
    relatedTools: ['orb-analysis', 'macro-pulse']
  },
  {
    id: 'intraday-4',
    front: 'Opening Range Breakout (ORB)',
    back: 'The ORB is formed in the first minutes of trading. Breaks of this range with volume signal strong directional momentum. Used to catch early-morning trends.',
    category: 'market-structure',
    difficulty: 'medium',
    relatedTools: ['orb-analysis']
  },
  {
    id: 'intraday-5',
    front: 'Identifying Intraday Ranges',
    back: 'When price oscillates between two boundaries, a range is formed. Ranges require different tactics compared to trends. Recognizing this early prevents mismatched trades.',
    category: 'market-structure',
    difficulty: 'medium',
    relatedTools: ['market-regime-radar', 'price-structure']
  },
  {
    id: 'intraday-6',
    front: 'VWAP Magnet Effect',
    back: 'Price often reverts to VWAP during consolidation. Large deviations from VWAP frequently snap back. VWAP helps determine trend vs. mean-reversion phases.',
    category: 'volume',
    difficulty: 'medium',
    relatedTools: ['vwap-analysis']
  },
  {
    id: 'intraday-7',
    front: 'Session High/Low Importance',
    back: 'Session highs/lows act as intraday turning points. Price reactions here reveal strength or weakness. Useful for anticipating breakouts or reversals.',
    category: 'price-action',
    difficulty: 'easy',
    relatedTools: ['price-structure']
  },
  {
    id: 'intraday-8',
    front: 'Regime Classification',
    back: 'Markets shift between trend, range, and chop regimes. Each requires different strategies. Correct classification increases accuracy dramatically.',
    category: 'market-structure',
    difficulty: 'medium',
    relatedTools: ['market-regime-radar']
  },
  {
    id: 'intraday-9',
    front: 'Short MAs for Momentum',
    back: 'Short MAs like 5, 9, and 20 EMA show immediate price trend. Crossovers indicate momentum shifts. They act as trend confirmation tools.',
    category: 'technical',
    difficulty: 'easy',
    relatedTools: ['technical-indicators']
  },
  {
    id: 'intraday-10',
    front: 'MA + VWAP Confluence',
    back: 'When moving averages align with VWAP, they form strong dynamic zones. These areas can act as supports/resistances. High-quality entries often occur here.',
    category: 'technical',
    difficulty: 'medium',
    relatedTools: ['vwap-analysis', 'technical-indicators']
  },
  {
    id: 'intraday-11',
    front: 'RSI for Intraday',
    back: 'RSI shows intraday momentum and overextension. High RSI suggests caution against chasing longs, while low RSI warns against chasing shorts. Useful when interpreted with context.',
    category: 'technical',
    difficulty: 'easy',
    relatedTools: ['technical-indicators', 'momentum-heatmap']
  },
  {
    id: 'intraday-12',
    front: 'RSI Divergences',
    back: 'Divergence occurs when price and RSI move oppositely. This signals momentum fading. It helps predict reversals or pullbacks.',
    category: 'technical',
    difficulty: 'medium',
    relatedTools: ['technical-indicators']
  },
  {
    id: 'intraday-13',
    front: 'MACD Histogram',
    back: 'The histogram shows early acceleration or slowdown in momentum. Growing bars suggest strengthening trend; shrinking bars warn of weakening. Provides early signal before crossovers.',
    category: 'technical',
    difficulty: 'medium',
    relatedTools: ['technical-indicators']
  },
  {
    id: 'intraday-14',
    front: 'MACD Crossovers',
    back: 'Bullish crossovers show momentum shift upward; bearish indicate downward shift. Works best with key levels. A lagging but reliable confirmation tool.',
    category: 'technical',
    difficulty: 'easy',
    relatedTools: ['technical-indicators']
  },
  {
    id: 'intraday-15',
    front: 'Futures Leverage',
    back: 'Futures provide high exposure with small capital. This magnifies both gains and losses. Understanding leverage is critical for risk control.',
    category: 'fno',
    difficulty: 'easy',
    relatedTools: ['fno-risk-advisor']
  },
  {
    id: 'intraday-16',
    front: 'Rollover Behavior',
    back: 'Near expiry, futures positions shift to next month contracts. This creates volatility and unusual price movements. Recognizing rollovers prevents misinterpretation.',
    category: 'fno',
    difficulty: 'medium',
    relatedTools: ['fno-risk-advisor']
  },
  {
    id: 'intraday-17',
    front: 'Options Greeks for Intraday',
    back: 'Delta controls price movement sensitivity; Gamma increases near expiry; Theta eats premium each minute. Understanding Greeks improves option timing.',
    category: 'fno',
    difficulty: 'hard',
    relatedTools: ['options-strategy', 'fno-risk-advisor']
  },
  {
    id: 'intraday-18',
    front: 'Credit Spreads',
    back: 'Credit spreads define risk before entry and benefit from time decay. They offer controlled-risk intraday setups. Best in range or low-vol environments.',
    category: 'fno',
    difficulty: 'hard',
    relatedTools: ['options-strategy']
  },
  {
    id: 'intraday-19',
    front: 'ATR-Based Stops',
    back: 'ATR shows market volatility and helps place logical stop-loss levels. Prevents stops that are too tight in volatile phases. Makes SL placement adaptive.',
    category: 'risk-management',
    difficulty: 'medium',
    relatedTools: ['fno-risk-advisor', 'trade-expectancy']
  },
  {
    id: 'intraday-20',
    front: 'Position Scaling',
    back: 'Adjusting size based on volatility or confidence improves performance. Smaller size in uncertain markets reduces risk. Scaling stabilizes outcomes.',
    category: 'risk-management',
    difficulty: 'medium',
    relatedTools: ['fno-risk-advisor']
  },
  {
    id: 'intraday-21',
    front: 'End-of-Day Square Off',
    back: 'Intraday positions must be closed before the session ends to avoid overnight risk. Prevents penalties and unpredictable gaps. Essential discipline.',
    category: 'risk-management',
    difficulty: 'easy',
    relatedTools: ['trade-journal']
  },
  {
    id: 'intraday-22',
    front: 'Time-Based Exits',
    back: 'When setups stall, exiting after a fixed duration avoids dead trades. Improves opportunity use and reduces frustration. Helps maintain rhythm.',
    category: 'psychology',
    difficulty: 'medium',
    relatedTools: ['trade-journal']
  },
  {
    id: 'intraday-23',
    front: 'Partial Profits',
    back: 'Taking partial profits reduces emotional pressure and protects gains. Balances risk and reward. Encourages patience for the remainder of the move.',
    category: 'psychology',
    difficulty: 'easy',
    relatedTools: ['trade-journal']
  },
  {
    id: 'intraday-24',
    front: 'Trading Journal',
    back: 'Journaling helps track decisions, emotions, and setups. Reveals patterns in wins/losses. Crucial for long-term improvement.',
    category: 'psychology',
    difficulty: 'easy',
    relatedTools: ['trade-journal']
  },
  {
    id: 'intraday-25',
    front: 'Morning / Midday / Close Routine',
    back: 'Structured routines stabilize emotions and focus. Morning prep sets bias; midday resets avoid tilt; end-of-day review builds mastery. Routines create consistency.',
    category: 'psychology',
    difficulty: 'easy',
    relatedTools: ['trade-journal', 'playbook-builder']
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// PATH 3: SWING TRADER — 25 FLASHCARDS
// ─────────────────────────────────────────────────────────────────────────────

export const SWING_FLASHCARDS: Flashcard[] = [
  {
    id: 'swing-1',
    front: 'Candlestick Meaning on Daily Charts',
    back: 'Daily candles reveal meaningful market structure and sentiment over time. They help time entries around major levels. Long-term signal reliability increases with timeframe.',
    category: 'price-action',
    difficulty: 'easy',
    relatedTools: ['candlestick-hero']
  },
  {
    id: 'swing-2',
    front: 'Major Reversal Patterns',
    back: 'Patterns like H&S and double tops indicate momentum exhaustion. They signal upcoming multi-day trend shifts. Work best with volume confirmation.',
    category: 'price-action',
    difficulty: 'medium',
    relatedTools: ['pattern-matcher']
  },
  {
    id: 'swing-3',
    front: 'Channels & Trendlines',
    back: 'Channels guide price direction and momentum. Breakouts from channels signal trend acceleration or reversal. Useful for swing setups.',
    category: 'price-action',
    difficulty: 'medium',
    relatedTools: ['price-structure', 'trend-strength']
  },
  {
    id: 'swing-4',
    front: 'Consolidation Breakouts',
    back: 'Price builds energy during consolidation. Breakouts with volume initiate multi-day swings. They offer clean risk levels.',
    category: 'price-action',
    difficulty: 'medium',
    relatedTools: ['pattern-matcher', 'volume-profile']
  },
  {
    id: 'swing-5',
    front: 'False Breakouts',
    back: 'Breakouts without strong volume often fail. Fakeouts trap traders and reverse quickly. Recognizing them avoids losses.',
    category: 'price-action',
    difficulty: 'medium',
    relatedTools: ['volume-profile', 'delivery-analysis']
  },
  {
    id: 'swing-6',
    front: 'Multi-Timeframe Confirmation',
    back: 'Aligning daily and weekly signals increases reliability. Reduces noise and improves confidence. High-quality swings require confluence.',
    category: 'technical',
    difficulty: 'medium',
    relatedTools: ['trend-strength']
  },
  {
    id: 'swing-7',
    front: '50 & 200 SMA',
    back: 'The 50 SMA reveals medium-term trend; 200 SMA shows long-term trend. A golden cross signals strong bullish structure. Trend alignment improves trade selection.',
    category: 'technical',
    difficulty: 'easy',
    relatedTools: ['technical-indicators', 'trend-strength']
  },
  {
    id: 'swing-8',
    front: 'Pullbacks to MA',
    back: 'Healthy trends return to the 20/50 SMA before continuing. Creates low-risk entry zones. Helps catch continuation trades.',
    category: 'technical',
    difficulty: 'medium',
    relatedTools: ['technical-indicators', 'fibonacci-levels']
  },
  {
    id: 'swing-9',
    front: 'RSI in Trend',
    back: 'RSI above 50 suggests bullish strength; below 50 signals weakness. Prevents trading against trend momentum. Assists in timing.',
    category: 'technical',
    difficulty: 'easy',
    relatedTools: ['technical-indicators', 'momentum-heatmap']
  },
  {
    id: 'swing-10',
    front: 'MACD Crossovers',
    back: 'MACD confirms momentum shift. Crossovers above zero are high-quality continuation signals. Helps validate breakouts.',
    category: 'technical',
    difficulty: 'easy',
    relatedTools: ['technical-indicators']
  },
  {
    id: 'swing-11',
    front: 'MACD Divergences',
    back: 'Divergence signals weakening momentum. Often precedes reversals. Useful for protecting profits.',
    category: 'technical',
    difficulty: 'medium',
    relatedTools: ['technical-indicators']
  },
  {
    id: 'swing-12',
    front: 'Accumulation Zones',
    back: 'Institutions accumulate during consolidations before breakouts. Rising volume and delivery % are clues. These zones precede big swings.',
    category: 'institutional',
    difficulty: 'medium',
    relatedTools: ['delivery-analysis', 'trade-flow-intel']
  },
  {
    id: 'swing-13',
    front: 'Distribution Zones',
    back: 'Institutions sell during rallies quietly. Leads to breakdowns. Avoid long positions during distribution.',
    category: 'institutional',
    difficulty: 'medium',
    relatedTools: ['delivery-analysis', 'trade-flow-intel']
  },
  {
    id: 'swing-14',
    front: 'FII/DII Flow Impact',
    back: 'Institutional flows influence market trend strength. Consistent buying supports swing setups. Selling weakens follow-through.',
    category: 'institutional',
    difficulty: 'easy',
    relatedTools: ['trade-flow-intel']
  },
  {
    id: 'swing-15',
    front: 'Earnings Reaction',
    back: 'Positive earnings shifts sentiment bullish. Breakouts after strong earnings have high sustainability. Track earnings calendar.',
    category: 'fundamental',
    difficulty: 'medium',
    relatedTools: ['earnings-quality']
  },
  {
    id: 'swing-16',
    front: 'Trailing Stops',
    back: 'Protect profits during multi-day moves. ATR-based or swing-low-based stops work best. Allow trends to run while managing risk.',
    category: 'risk-management',
    difficulty: 'medium',
    relatedTools: ['fno-risk-advisor', 'trade-journal']
  },
  {
    id: 'swing-17',
    front: 'Scaling Out',
    back: 'Partial exits lock in profits while allowing remaining position to run. Reduces emotional stress. Smoothens equity curve.',
    category: 'risk-management',
    difficulty: 'easy',
    relatedTools: ['trade-journal']
  },
  {
    id: 'swing-18',
    front: 'Adding on Pullbacks',
    back: 'Add small positions during trend pullbacks to increase position efficiently. Must be done only in strong trends. Compounds gains safely.',
    category: 'risk-management',
    difficulty: 'hard',
    relatedTools: ['fibonacci-levels', 'fno-risk-advisor']
  },
  {
    id: 'swing-19',
    front: 'Correlation Risk',
    back: 'Holding similar stocks increases sector-level risk. One negative event impacts all positions. Diversification stabilizes portfolio.',
    category: 'risk-management',
    difficulty: 'medium',
    relatedTools: ['risk-health-dashboard']
  },
  {
    id: 'swing-20',
    front: 'Volatility-Based Positioning',
    back: 'Higher volatility requires smaller size. Maintains equal risk across environments. Prevents oversized losses.',
    category: 'risk-management',
    difficulty: 'medium',
    relatedTools: ['fno-risk-advisor', 'drawdown-var']
  },
  {
    id: 'swing-21',
    front: 'Pattern + Flow Playbook',
    back: 'Combining technical patterns with institutional flows increases conviction. Reduces false entries. Creates a consistent strategy framework.',
    category: 'system',
    difficulty: 'medium',
    relatedTools: ['playbook-builder', 'pattern-matcher']
  },
  {
    id: 'swing-22',
    front: 'Expectancy',
    back: 'Expectancy shows average expected profit per trade. Must be positive for long-term success. Helps evaluate system performance.',
    category: 'system',
    difficulty: 'medium',
    relatedTools: ['trade-expectancy']
  },
  {
    id: 'swing-23',
    front: 'Watchlist Construction',
    back: 'A good watchlist focuses on strong patterns + high momentum + flows. Prepares traders for upcoming swing opportunities. Reduces emotional entries.',
    category: 'system',
    difficulty: 'easy',
    relatedTools: ['momentum-heatmap']
  },
  {
    id: 'swing-24',
    front: 'Weekly Performance Review',
    back: 'Weekly reviews reveal trends in behavior and performance. Helps refine strategy. Essential for long-term improvement.',
    category: 'psychology',
    difficulty: 'easy',
    relatedTools: ['trade-journal']
  },
  {
    id: 'swing-25',
    front: 'Sharpe Ratio',
    back: 'Measures risk-adjusted returns. A Sharpe above 1 indicates efficient risk use. Helps benchmark portfolio performance.',
    category: 'risk-management',
    difficulty: 'medium',
    relatedTools: ['portfolio-leaderboard']
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// PATH 4: POSITIONAL TRADER — 25 FLASHCARDS
// ─────────────────────────────────────────────────────────────────────────────

export const POSITIONAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'positional-1',
    front: 'Sector Rotation',
    back: 'Shifts in capital between sectors create multi-week trends. Identifying rotations early allows strategic positioning. Core skill for positional traders.',
    category: 'macro',
    difficulty: 'medium',
    relatedTools: ['narrative-theme', 'market-regime-radar']
  },
  {
    id: 'positional-2',
    front: 'Policy Influence',
    back: 'Government decisions like PLI or budget initiatives impact sectors. They act as catalysts for multi-week moves. Tracking them improves theme selection.',
    category: 'macro',
    difficulty: 'medium',
    relatedTools: ['narrative-theme']
  },
  {
    id: 'positional-3',
    front: 'Economic Indicators',
    back: 'GDP, inflation, and interest rates influence sector behavior. Understanding macro conditions enhances stock picking. Helps build directional bias.',
    category: 'macro',
    difficulty: 'medium',
    relatedTools: ['macro-pulse']
  },
  {
    id: 'positional-4',
    front: 'Weekly Research Cycle',
    back: 'Weekly reports strengthen understanding of sector trends. They clarify long-term narratives. Essential for thematic accuracy.',
    category: 'research',
    difficulty: 'easy',
    relatedTools: ['narrative-theme']
  },
  {
    id: 'positional-5',
    front: 'Valuation Metrics (PE/PEG)',
    back: 'Valuation helps avoid overpaying for stocks. PEG < 1 often shows undervalued growth. Prevents buying expensive traps.',
    category: 'valuation',
    difficulty: 'easy',
    relatedTools: ['valuation-summary']
  },
  {
    id: 'positional-6',
    front: 'ROE / ROCE',
    back: 'High ROE/ROCE indicates efficient use of capital. Strong profitability supports long-term compounding. Quality stocks maintain high ratios.',
    category: 'fundamental',
    difficulty: 'medium',
    relatedTools: ['financial-health-dna', 'dupont-analysis']
  },
  {
    id: 'positional-7',
    front: 'Earnings Revision Trends',
    back: 'Upward revisions predict multi-month rallies. Downward revisions warn of weakness. Used to confirm themes.',
    category: 'fundamental',
    difficulty: 'medium',
    relatedTools: ['earnings-quality']
  },
  {
    id: 'positional-8',
    front: 'Relative Strength (RS)',
    back: 'RS identifies outperforming stocks. Leaders tend to outperform consistently. Best candidates for positional trades.',
    category: 'technical',
    difficulty: 'easy',
    relatedTools: ['momentum-heatmap', 'trend-strength']
  },
  {
    id: 'positional-9',
    front: 'Breakout Retests',
    back: 'Retests offer low-risk entries after breakouts. Confirm strength of breakout. Very reliable for positional timing.',
    category: 'technical',
    difficulty: 'medium',
    relatedTools: ['price-structure', 'pattern-matcher']
  },
  {
    id: 'positional-10',
    front: 'Fibonacci Pullbacks',
    back: 'Fib levels help identify natural correction levels. Entries near 38-61% often work well. Helps time trend continuation.',
    category: 'technical',
    difficulty: 'medium',
    relatedTools: ['fibonacci-levels']
  },
  {
    id: 'positional-11',
    front: 'Delivery % Meaning',
    back: 'High delivery shows real investor interest. Supports sustainable long-term moves. Confirms breakout quality.',
    category: 'institutional',
    difficulty: 'easy',
    relatedTools: ['delivery-analysis']
  },
  {
    id: 'positional-12',
    front: 'Margin of Safety (MOS)',
    back: 'MOS provides valuation buffer. Protects against market mispricing. Essential for positional confidence.',
    category: 'valuation',
    difficulty: 'medium',
    relatedTools: ['fair-value-forecaster']
  },
  {
    id: 'positional-13',
    front: 'DCF Analysis Basics',
    back: 'DCF estimates intrinsic value using future cash flows. Useful for filtering overpriced stocks. Adds valuation discipline.',
    category: 'valuation',
    difficulty: 'hard',
    relatedTools: ['dcf-valuation', 'fair-value-forecaster']
  },
  {
    id: 'positional-14',
    front: 'Theme Leaders',
    back: 'Leaders outperform peers during strong themes. They break out first and fall last. Best picks for positional trades.',
    category: 'theme',
    difficulty: 'medium',
    relatedTools: ['narrative-theme', 'momentum-heatmap']
  },
  {
    id: 'positional-15',
    front: 'Momentum Scores',
    back: 'Quantifies stock strength. Higher scores indicate strong institutional interest. Great filter for watchlists.',
    category: 'technical',
    difficulty: 'easy',
    relatedTools: ['momentum-heatmap']
  },
  {
    id: 'positional-16',
    front: 'Volatility-Based Sizing',
    back: 'High volatility = smaller size. Keeps risk consistent. Essential during uncertain phases.',
    category: 'risk-management',
    difficulty: 'medium',
    relatedTools: ['fno-risk-advisor']
  },
  {
    id: 'positional-17',
    front: 'Rebalancing',
    back: 'Rebalancing maintains optimal risk distribution. Prevents overweighting high-flyers. Keeps portfolio stable.',
    category: 'portfolio',
    difficulty: 'medium',
    relatedTools: ['risk-health-dashboard']
  },
  {
    id: 'positional-18',
    front: 'Correlation Risk',
    back: 'Similar stocks increase portfolio risk. Sector diversification reduces drawdowns. Builds smoother returns.',
    category: 'portfolio',
    difficulty: 'medium',
    relatedTools: ['risk-health-dashboard']
  },
  {
    id: 'positional-19',
    front: 'Thesis Testing',
    back: 'Reviewing your investment thesis ensures fundamentals remain intact. Prevents holding deteriorating companies. Critical discipline.',
    category: 'research',
    difficulty: 'medium',
    relatedTools: ['financial-health-dna']
  },
  {
    id: 'positional-20',
    front: 'Partial Exits',
    back: 'Helps lock in profits during rallies. Reduces emotional conflict. Maintains exposure to trends.',
    category: 'risk-management',
    difficulty: 'easy',
    relatedTools: ['trade-journal']
  },
  {
    id: 'positional-21',
    front: 'Hedging',
    back: 'Index futures or ETFs reduce downside risk. Protects portfolio during corrections. Adds stability.',
    category: 'risk-management',
    difficulty: 'hard',
    relatedTools: ['options-strategy']
  },
  {
    id: 'positional-22',
    front: 'Strong Balance Sheet',
    back: 'Low debt and strong cash positions improve survivability. Reduces volatility risk. Supports long-term returns.',
    category: 'fundamental',
    difficulty: 'easy',
    relatedTools: ['financial-health-dna']
  },
  {
    id: 'positional-23',
    front: 'Peer Comparison',
    back: 'Comparing valuation to peers gives context. Shows whether a stock is overpriced. Improves confidence.',
    category: 'valuation',
    difficulty: 'easy',
    relatedTools: ['valuation-summary']
  },
  {
    id: 'positional-24',
    front: 'Event Risk',
    back: 'Earnings, macro data, and policy shifts create volatility. Adjusting positions reduces unexpected losses. Good risk practice.',
    category: 'risk-management',
    difficulty: 'medium',
    relatedTools: ['trade-journal']
  },
  {
    id: 'positional-25',
    front: 'Long Consolidations',
    back: 'Long consolidations often precede big moves. Breakouts can deliver positional trades with high reliability. Essential pattern knowledge.',
    category: 'technical',
    difficulty: 'medium',
    relatedTools: ['pattern-matcher', 'volume-profile']
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// PATH 5: LONG-TERM INVESTOR — 25 FLASHCARDS
// ─────────────────────────────────────────────────────────────────────────────

export const INVESTOR_FLASHCARDS: Flashcard[] = [
  {
    id: 'investor-1',
    front: 'Income Statement',
    back: 'Shows revenue, expenses, and profit. Evaluates growth and efficiency. Helps judge long-term earning power.',
    category: 'fundamental',
    difficulty: 'easy',
    relatedTools: ['financial-health-dna', 'growth-summary']
  },
  {
    id: 'investor-2',
    front: 'Balance Sheet',
    back: 'Lists assets, liabilities, equity. Strong balance sheets indicate financial health. Essential for long-term resilience.',
    category: 'fundamental',
    difficulty: 'easy',
    relatedTools: ['financial-health-dna']
  },
  {
    id: 'investor-3',
    front: 'Cash Flow Statement',
    back: 'Shows real money generated. Free cash flow indicates financial flexibility. Crucial for dividends and reinvestment.',
    category: 'fundamental',
    difficulty: 'medium',
    relatedTools: ['financial-health-dna', 'earnings-quality']
  },
  {
    id: 'investor-4',
    front: 'DuPont ROE',
    back: 'Breaks ROE into profitability, efficiency, and leverage. Reveals true drivers of performance. Helps compare companies.',
    category: 'fundamental',
    difficulty: 'medium',
    relatedTools: ['dupont-analysis']
  },
  {
    id: 'investor-5',
    front: 'Cyclical vs Defensive',
    back: 'Cyclical sectors move with economy; defensive stay stable. Helps balance portfolio for all conditions. Reduces volatility.',
    category: 'sector',
    difficulty: 'easy',
    relatedTools: ['narrative-theme']
  },
  {
    id: 'investor-6',
    front: 'Asset-Light Models',
    back: 'Low capital needs, scalable profits. Faster growth and lower risk. Attractive for long-term compounding.',
    category: 'business-model',
    difficulty: 'medium',
    relatedTools: ['capital-allocation']
  },
  {
    id: 'investor-7',
    front: 'Regulation-Heavy Sectors',
    back: 'Policies influence telecom, banking, energy. Must track government actions. Impacts risk and valuation.',
    category: 'sector',
    difficulty: 'medium',
    relatedTools: ['narrative-theme']
  },
  {
    id: 'investor-8',
    front: 'DCF Model',
    back: 'Estimates intrinsic value using future cash flows. Encourages rational decisions. Prevents overpaying.',
    category: 'valuation',
    difficulty: 'hard',
    relatedTools: ['dcf-valuation', 'fair-value-forecaster']
  },
  {
    id: 'investor-9',
    front: 'Terminal Value',
    back: 'Represents business value beyond forecast. Sensitive to small changes. Must be conservative.',
    category: 'valuation',
    difficulty: 'hard',
    relatedTools: ['dcf-valuation']
  },
  {
    id: 'investor-10',
    front: 'Discount Rate (WACC)',
    back: 'Reflects risk and expected return. Higher WACC = riskier business. Affects valuation significantly.',
    category: 'valuation',
    difficulty: 'hard',
    relatedTools: ['dcf-valuation']
  },
  {
    id: 'investor-11',
    front: 'Sensitivity Tables',
    back: 'Show impact of assumptions on valuation. Helps test robustness. Key for reducing bias.',
    category: 'valuation',
    difficulty: 'hard',
    relatedTools: ['dcf-valuation']
  },
  {
    id: 'investor-12',
    front: 'P/E Ratio',
    back: 'Compares price to earnings. High P/E can mean growth or overvaluation. Context matters.',
    category: 'valuation',
    difficulty: 'easy',
    relatedTools: ['valuation-summary']
  },
  {
    id: 'investor-13',
    front: 'EV/EBITDA',
    back: 'Useful for capital-heavy companies. Accounts for debt better than P/E. Helps compare peers.',
    category: 'valuation',
    difficulty: 'medium',
    relatedTools: ['valuation-summary']
  },
  {
    id: 'investor-14',
    front: 'Moats',
    back: 'Competitive advantages like brands or network effects. Protect long-term profits. Key to compounding.',
    category: 'quality',
    difficulty: 'medium',
    relatedTools: ['management-quality']
  },
  {
    id: 'investor-15',
    front: 'Earnings Stability',
    back: 'Stable earnings reflect strong business. Lower volatility in profits reduces risk. Attractive for long-term investors.',
    category: 'quality',
    difficulty: 'easy',
    relatedTools: ['earnings-quality']
  },
  {
    id: 'investor-16',
    front: 'Earnings Quality',
    back: 'High-quality earnings come from operations, not adjustments. Cash flow verifies quality. Prevents misjudgment.',
    category: 'quality',
    difficulty: 'medium',
    relatedTools: ['earnings-quality']
  },
  {
    id: 'investor-17',
    front: 'Dividend Yield',
    back: 'Shows income return. Sustainable yields come from strong cash flows. Avoid unsustainable high yields.',
    category: 'dividends',
    difficulty: 'easy',
    relatedTools: ['dividend-crystal-ball']
  },
  {
    id: 'investor-18',
    front: 'Dividend Growth',
    back: 'Companies increasing dividends show financial strength. Enhances long-term returns. Helps beat inflation.',
    category: 'dividends',
    difficulty: 'easy',
    relatedTools: ['dividend-crystal-ball']
  },
  {
    id: 'investor-19',
    front: 'DRIP',
    back: 'Reinvesting dividends compounds wealth automatically. Boosts long-term growth. Passive but powerful tool.',
    category: 'dividends',
    difficulty: 'easy',
    relatedTools: ['dividend-crystal-ball']
  },
  {
    id: 'investor-20',
    front: 'Tax-Loss Harvesting',
    back: 'Offset gains with losses to reduce taxes. Improves net returns. Used strategically during volatility.',
    category: 'tax',
    difficulty: 'medium',
    relatedTools: ['tax-calculator']
  },
  {
    id: 'investor-21',
    front: 'Asset Allocation',
    back: 'Mix of equity and debt balances risk. 60/40 is classic model. Foundation of long-term portfolios.',
    category: 'portfolio',
    difficulty: 'easy',
    relatedTools: ['risk-health-dashboard']
  },
  {
    id: 'investor-22',
    front: 'Diversification',
    back: 'Reduces portfolio-specific risk. Holding 10–15 stocks balances focus and stability. Avoids concentration risk.',
    category: 'portfolio',
    difficulty: 'easy',
    relatedTools: ['risk-health-dashboard']
  },
  {
    id: 'investor-23',
    front: 'Sharpe Ratio',
    back: 'Measures risk-adjusted return. Sharpe >1 indicates efficient investing. Helps evaluate performance.',
    category: 'portfolio',
    difficulty: 'medium',
    relatedTools: ['portfolio-leaderboard']
  },
  {
    id: 'investor-24',
    front: 'Annual Thesis Review',
    back: 'Ensures your investment logic remains valid. Helps remove underperformers. Keeps portfolio aligned.',
    category: 'psychology',
    difficulty: 'easy',
    relatedTools: ['trade-journal']
  },
  {
    id: 'investor-25',
    front: 'Handling Corrections',
    back: 'Market corrections are normal. Long-term investors stay patient and may accumulate. Discipline is key.',
    category: 'psychology',
    difficulty: 'easy',
    relatedTools: ['trade-journal']
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// FLASHCARD DECKS - Organized by Path
// ─────────────────────────────────────────────────────────────────────────────

// Import curriculum flashcards
import { BEGINNER_FLASHCARDS, CurriculumFlashcard } from './curriculum-beginner';
import { INTERMEDIATE_FLASHCARDS } from './curriculum-intermediate';
import { ADVANCED_FLASHCARDS } from './curriculum-advanced';

// Convert curriculum flashcards to standard format
function convertCurriculumCards(cards: CurriculumFlashcard[]): Flashcard[] {
  return cards.map(c => ({
    id: c.id,
    front: c.front,
    back: c.back,
    category: 'curriculum',
    difficulty: 'medium' as const,
  }));
}

export const FLASHCARD_DECKS: FlashcardDeck[] = [
  // Trading Style Decks (original)
  {
    pathId: 'scalper-path',
    pathName: 'Scalper Mastery',
    description: 'Master quick intraday moves with 25 essential concepts',
    cards: SCALPER_FLASHCARDS
  },
  {
    pathId: 'intraday-path',
    pathName: 'Intraday Trader',
    description: 'Capture larger intraday moves with structured analysis',
    cards: INTRADAY_FLASHCARDS
  },
  {
    pathId: 'swing-path',
    pathName: 'Swing Trader',
    description: 'Multi-day moves using technical and delivery analysis',
    cards: SWING_FLASHCARDS
  },
  {
    pathId: 'positional-path',
    pathName: 'Positional Trader',
    description: 'Theme-based multi-week position building',
    cards: POSITIONAL_FLASHCARDS
  },
  {
    pathId: 'investor-path',
    pathName: 'Long-Term Investor',
    description: 'Wealth building through fundamental analysis',
    cards: INVESTOR_FLASHCARDS
  },
  // Curriculum Decks (new 50-module course)
  {
    pathId: 'curriculum-beginner',
    pathName: 'Curriculum: Beginner',
    description: 'Stock market basics, Demat, NAV, orders, compounding, risk (Modules 1-15)',
    cards: convertCurriculumCards(BEGINNER_FLASHCARDS)
  },
  {
    pathId: 'curriculum-intermediate',
    pathName: 'Curriculum: Intermediate',
    description: 'Financial statements, valuation, technical analysis, options (Modules 16-33)',
    cards: convertCurriculumCards(INTERMEDIATE_FLASHCARDS)
  },
  {
    pathId: 'curriculum-advanced',
    pathName: 'Curriculum: Advanced',
    description: 'DCF, quality metrics, derivatives, factor investing, systems (Modules 34-50)',
    cards: convertCurriculumCards(ADVANCED_FLASHCARDS)
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export function getFlashcardDeck(pathId: string): FlashcardDeck | undefined {
  return FLASHCARD_DECKS.find(deck => deck.pathId === pathId);
}

export function getFlashcardsByCategory(pathId: string, category: string): Flashcard[] {
  const deck = getFlashcardDeck(pathId);
  if (!deck) return [];
  return deck.cards.filter(card => card.category === category);
}

export function getFlashcardsByDifficulty(pathId: string, difficulty: 'easy' | 'medium' | 'hard'): Flashcard[] {
  const deck = getFlashcardDeck(pathId);
  if (!deck) return [];
  return deck.cards.filter(card => card.difficulty === difficulty);
}

export function shuffleFlashcards(cards: Flashcard[]): Flashcard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getFlashcardsForTool(toolId: string): Flashcard[] {
  const allCards = FLASHCARD_DECKS.flatMap(deck => deck.cards);
  return allCards.filter(card => card.relatedTools?.includes(toolId));
}

export const ALL_FLASHCARDS = FLASHCARD_DECKS.flatMap(deck => deck.cards);
