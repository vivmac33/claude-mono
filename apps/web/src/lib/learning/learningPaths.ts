// ═══════════════════════════════════════════════════════════════════════════
// LEARNING PATHS
// Curated paths for different trader personas and skill levels
// ═══════════════════════════════════════════════════════════════════════════

import { UserSegment } from '@/registry/cardRegistry';

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  persona?: UserSegment;
  icon: string;
  color: string;
  estimatedHours: number;
  stages: PathStage[];
}

export interface PathStage {
  name: string;
  description: string;
  moduleIds: string[];          // Learning module IDs
  toolIds: string[];            // Tool IDs to practice with
  milestone: string;            // What you'll achieve
  practiceTask?: string;        // Hands-on exercise
}

// ─────────────────────────────────────────────────────────────────────────────
// PERSONA-BASED LEARNING PATHS
// ─────────────────────────────────────────────────────────────────────────────

export const PERSONA_PATHS: LearningPath[] = [
  {
    id: 'scalper-path',
    name: 'Scalper Mastery',
    description: 'Learn to profit from quick intraday moves with tight risk management',
    persona: 'scalper',
    icon: 'Zap',
    color: 'from-yellow-500 to-orange-500',
    estimatedHours: 10,
    stages: [
      {
        name: 'Price Action Foundation',
        description: 'Master reading raw price without indicators',
        moduleIds: ['candlestick-basics', 'support-resistance-basics'],
        toolIds: ['candlestick-hero', 'price-structure'],
        milestone: 'Identify key levels and reversal candles in real-time',
        practiceTask: 'Mark support/resistance on Bank Nifty 5-minute chart for 5 days'
      },
      {
        name: 'VWAP & Volume Mastery',
        description: 'Use institutional benchmarks and volume analysis',
        moduleIds: ['volume-analysis-basics'],
        toolIds: ['vwap-analysis', 'volume-profile', 'delivery-analysis'],
        milestone: 'Identify POC, VAH/VAL and use VWAP as dynamic support/resistance',
        practiceTask: 'Track VWAP touches and volume profile levels for 1 week on Nifty'
      },
      {
        name: 'Risk-First Approach',
        description: 'Size positions correctly for quick trades',
        moduleIds: ['risk-management-101'],
        toolIds: ['fno-risk-advisor', 'trade-expectancy'],
        milestone: 'Calculate position size for any scalp setup in seconds',
        practiceTask: 'Paper trade 20 scalps with proper position sizing'
      },
      {
        name: 'Order Flow Reading',
        description: 'Understand institutional footprints',
        moduleIds: [],
        toolIds: ['trade-flow-intel', 'volume-profile'],
        milestone: 'Spot institutional activity through volume delta and HVN/LVN',
        practiceTask: 'Identify 3 HVN bounces and 3 LVN breakouts in real-time'
      },
      {
        name: 'System Building',
        description: 'Create and test your scalping playbook',
        moduleIds: [],
        toolIds: ['playbook-builder', 'trade-journal'],
        milestone: 'Document 3 repeatable scalp setups with rules',
        practiceTask: 'Build playbook for VWAP + Volume Profile scalping strategy'
      }
    ]
  },
  {
    id: 'intraday-path',
    name: 'Intraday Trader Path',
    description: 'Develop skills for capturing larger intraday moves with multiple setups',
    persona: 'intraday',
    icon: 'Clock',
    color: 'from-blue-500 to-cyan-500',
    estimatedHours: 14,
    stages: [
      {
        name: 'Market Structure & ORB',
        description: 'Understand how markets move during the day',
        moduleIds: ['intro-stock-market', 'candlestick-basics', 'support-resistance-basics'],
        toolIds: ['market-regime-radar', 'price-structure', 'orb-analysis'],
        milestone: 'Identify market regime, gap type, and ORB levels before 9:30 AM',
        practiceTask: 'Prepare daily ORB analysis for Nifty/Bank Nifty for 2 weeks'
      },
      {
        name: 'VWAP & Volume Tools',
        description: 'Master intraday volume-based analysis',
        moduleIds: ['volume-analysis-basics'],
        toolIds: ['vwap-analysis', 'volume-profile', 'delivery-analysis'],
        milestone: 'Combine VWAP, POC, and volume delta for entry timing',
        practiceTask: 'Track all VWAP and volume profile signals for 10 trading days'
      },
      {
        name: 'Technical Analysis',
        description: 'Use indicators to confirm setups',
        moduleIds: ['moving-averages-strategy', 'rsi-macd-mastery'],
        toolIds: ['technical-indicators', 'momentum-heatmap'],
        milestone: 'Combine price action with indicators for high-probability entries',
        practiceTask: 'Backtest MA crossover + RSI system on historical data'
      },
      {
        name: 'F&O Execution',
        description: 'Trade futures and options efficiently',
        moduleIds: ['fno-basics', 'risk-management-101'],
        toolIds: ['fno-risk-advisor', 'options-strategy', 'trade-expectancy'],
        milestone: 'Execute F&O trades with proper risk management',
        practiceTask: 'Paper trade F&O for 1 month tracking all metrics'
      },
      {
        name: 'Psychology & Discipline',
        description: 'Manage emotions and build consistency',
        moduleIds: [],
        toolIds: ['trade-journal', 'playbook-builder'],
        milestone: 'Maintain 80%+ plan adherence rate',
        practiceTask: 'Journal every trade with emotional state for 1 month'
      }
    ]
  },
  {
    id: 'swing-path',
    name: 'Swing Trader Path',
    description: 'Capture multi-day moves using technical and delivery analysis',
    persona: 'swing',
    icon: 'TrendingUp',
    color: 'from-green-500 to-emerald-500',
    estimatedHours: 16,
    stages: [
      {
        name: 'Pattern Recognition',
        description: 'Identify high-probability chart patterns',
        moduleIds: ['candlestick-basics', 'support-resistance-basics'],
        toolIds: ['pattern-matcher', 'candlestick-hero'],
        milestone: 'Spot breakout patterns with 60%+ historical accuracy',
        practiceTask: 'Identify 10 patterns and track their outcomes over 1 month'
      },
      {
        name: 'Fibonacci & Entry Timing',
        description: 'Use Fibonacci levels for precision entries and targets',
        moduleIds: ['support-resistance-basics'],
        toolIds: ['fibonacci-levels', 'price-structure'],
        milestone: 'Enter at golden pocket (61.8%) retracements consistently',
        practiceTask: 'Draw Fibonacci on 10 stocks and trade pullbacks to 61.8%'
      },
      {
        name: 'Trend Confirmation',
        description: 'Validate setups with trend and momentum',
        moduleIds: ['moving-averages-strategy', 'rsi-macd-mastery'],
        toolIds: ['trend-strength', 'technical-indicators', 'momentum-heatmap'],
        milestone: 'Combine trend, momentum, and pattern for entry decisions',
        practiceTask: 'Create checklist for swing entry with all confirmations'
      },
      {
        name: 'Smart Money Tracking',
        description: 'Follow institutional footprints',
        moduleIds: [],
        toolIds: ['delivery-analysis', 'trade-flow-intel', 'volume-profile'],
        milestone: 'Identify accumulation zones before breakouts',
        practiceTask: 'Track delivery % and volume profile for 10 stocks daily'
      },
      {
        name: 'Risk & Position Management',
        description: 'Manage positions over multiple days',
        moduleIds: ['risk-management-101'],
        toolIds: ['risk-health-dashboard', 'drawdown-var', 'trade-journal'],
        milestone: 'Hold winners and cut losers systematically',
        practiceTask: 'Execute 10 swing trades with proper trailing stops'
      }
    ]
  },
  {
    id: 'positional-path',
    name: 'Positional Trader Path',
    description: 'Build positions in emerging themes for multi-week gains',
    persona: 'positional',
    icon: 'Target',
    color: 'from-purple-500 to-pink-500',
    estimatedHours: 20,
    stages: [
      {
        name: 'Theme Discovery',
        description: 'Identify emerging market themes and sectors',
        moduleIds: ['intro-stock-market'],
        toolIds: ['narrative-theme', 'market-regime-radar'],
        milestone: 'Track and evaluate 3-5 active market themes',
        practiceTask: 'Write weekly theme analysis reports for 1 month'
      },
      {
        name: 'Stock Selection',
        description: 'Pick quality stocks within themes',
        moduleIds: ['pe-ratio-explained'],
        toolIds: ['delivery-analysis', 'financial-health-dna', 'valuation-summary'],
        milestone: 'Build watchlist of theme leaders with good fundamentals',
        practiceTask: 'Screen and rank 20 stocks in your favorite theme'
      },
      {
        name: 'Fibonacci Entry & Targets',
        description: 'Time entries and set targets using Fibonacci',
        moduleIds: ['support-resistance-basics'],
        toolIds: ['fibonacci-levels', 'price-structure', 'pattern-matcher'],
        milestone: 'Enter pullbacks and set extension targets systematically',
        practiceTask: 'Use Fibonacci to plan 5 positional entries with targets'
      },
      {
        name: 'Valuation & Fair Value',
        description: 'Combine technicals with fundamental valuation',
        moduleIds: ['moving-averages-strategy'],
        toolIds: ['fair-value-forecaster', 'dcf-valuation'],
        milestone: 'Enter at technical pullbacks with margin of safety',
        practiceTask: 'Paper trade theme-based positions for 2 months'
      },
      {
        name: 'Portfolio Management',
        description: 'Manage multiple positions and overall risk',
        moduleIds: ['risk-management-101'],
        toolIds: ['drawdown-var', 'trade-journal', 'tax-calculator'],
        milestone: 'Maintain balanced portfolio with tax-efficient exits',
        practiceTask: 'Track portfolio heat, correlation, and tax implications weekly'
      }
    ]
  },
  {
    id: 'investor-path',
    name: 'Long-Term Investor Path',
    description: 'Build wealth through fundamental analysis and patient investing',
    persona: 'investor',
    icon: 'Landmark',
    color: 'from-indigo-500 to-blue-600',
    estimatedHours: 22,
    stages: [
      {
        name: 'Fundamental Analysis',
        description: 'Understand financial statements and ratios',
        moduleIds: ['intro-stock-market', 'pe-ratio-explained'],
        toolIds: ['financial-health-dna', 'piotroski-score', 'growth-summary'],
        milestone: 'Analyze any company\'s fundamentals independently',
        practiceTask: 'Analyze 10 companies from different sectors'
      },
      {
        name: 'Valuation Mastery',
        description: 'Determine intrinsic value of businesses',
        moduleIds: [],
        toolIds: ['valuation-summary', 'fair-value-forecaster', 'dcf-valuation', 'dupont-analysis'],
        milestone: 'Calculate fair value using multiple methods',
        practiceTask: 'Value 5 companies using DCF, comparable, and asset-based methods'
      },
      {
        name: 'Quality Assessment',
        description: 'Identify compounders vs value traps',
        moduleIds: [],
        toolIds: ['earnings-quality', 'management-quality', 'capital-allocation'],
        milestone: 'Distinguish quality businesses from mediocre ones',
        practiceTask: 'Compare quality metrics of Nifty 50 companies'
      },
      {
        name: 'Income & Dividends',
        description: 'Build passive income through dividends',
        moduleIds: [],
        toolIds: ['dividend-crystal-ball'],
        milestone: 'Build dividend portfolio with growing yield',
        practiceTask: 'Create dividend growth portfolio plan'
      },
      {
        name: 'Tax Planning & Optimization',
        description: 'Maximize returns through tax-efficient investing',
        moduleIds: ['tax-planning-basics'],
        toolIds: ['tax-calculator', 'portfolio-leaderboard'],
        milestone: 'Minimize tax impact through strategic exits and harvesting',
        practiceTask: 'Review portfolio for tax-loss harvesting before FY end'
      }
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// BEGINNER LEARNING TRACK
// ─────────────────────────────────────────────────────────────────────────────

export const BEGINNER_PATH: LearningPath = {
  id: 'beginner-complete',
  name: 'Complete Beginner Course',
  description: 'Start from zero and build a solid foundation in trading and investing',
  icon: 'GraduationCap',
  color: 'from-slate-500 to-slate-700',
  estimatedHours: 25,
  stages: [
    {
      name: 'Market Foundations',
      description: 'Understand what stock markets are and how they work',
      moduleIds: ['intro-stock-market'],
      toolIds: [],
      milestone: 'Explain how stock prices are determined',
      practiceTask: 'Open a demat account and explore the trading interface'
    },
    {
      name: 'Reading Price Charts',
      description: 'Learn to read candlestick charts and identify patterns',
      moduleIds: ['candlestick-basics'],
      toolIds: ['candlestick-hero'],
      milestone: 'Identify basic candlestick patterns on any chart',
      practiceTask: 'Identify 5 different candle patterns on Nifty daily chart'
    },
    {
      name: 'Support & Resistance',
      description: 'Find key price levels where markets reverse',
      moduleIds: ['support-resistance-basics'],
      toolIds: ['price-structure'],
      milestone: 'Draw accurate S/R levels on any timeframe',
      practiceTask: 'Mark S/R levels on 5 stocks and track price reactions'
    },
    {
      name: 'Understanding Valuation',
      description: 'Learn if stocks are cheap or expensive',
      moduleIds: ['pe-ratio-explained'],
      toolIds: ['valuation-summary'],
      milestone: 'Compare valuations within an industry',
      practiceTask: 'Compare P/E ratios of 5 IT companies and explain differences'
    },
    {
      name: 'Risk Management Essentials',
      description: 'The most important skill - protecting your capital',
      moduleIds: ['risk-management-101'],
      toolIds: ['fno-risk-advisor', 'trade-expectancy'],
      milestone: 'Calculate position size for any trade',
      practiceTask: 'Paper trade 10 times with proper position sizing'
    },
    {
      name: 'Technical Indicators',
      description: 'Add indicators to confirm your analysis',
      moduleIds: ['moving-averages-strategy', 'rsi-macd-mastery'],
      toolIds: ['technical-indicators', 'trend-strength'],
      milestone: 'Use RSI and MACD for trade timing',
      practiceTask: 'Backtest RSI strategy on historical Nifty data'
    },
    {
      name: 'Derivatives Introduction',
      description: 'Understand futures and options basics',
      moduleIds: ['fno-basics'],
      toolIds: ['options-strategy', 'fno-risk-advisor'],
      milestone: 'Understand how F&O works and their risks',
      practiceTask: 'Paper trade 5 options with tracking of Greeks'
    },
    {
      name: 'Building Your System',
      description: 'Create your own trading playbook',
      moduleIds: [],
      toolIds: ['playbook-builder', 'trade-journal'],
      milestone: 'Document your first complete trading strategy',
      practiceTask: 'Write down 1 strategy with entry/exit/sizing rules'
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT MAP NODES - For Visual Learning Map
// ─────────────────────────────────────────────────────────────────────────────

export interface ConceptMapNode {
  id: string;
  label: string;
  category: 'basics' | 'technical' | 'fundamental' | 'derivatives' | 'risk' | 'psychology';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  subtopicsCount: number;
  moduleIds: string[];
  conceptIds: string[];
  connections: string[];        // IDs of connected nodes
  position?: { x: number; y: number };  // For visual layout
}

export const CONCEPT_MAP_NODES: ConceptMapNode[] = [
  // Beginner Level - Left Side
  {
    id: 'market-basics',
    label: 'Market Basics',
    category: 'basics',
    difficulty: 'beginner',
    description: 'Understanding stocks, bonds, and how markets work',
    subtopicsCount: 8,
    moduleIds: ['intro-stock-market'],
    conceptIds: [],
    connections: ['stock-analysis', 'risk-management', 'economic-indicators'],
    position: { x: 100, y: 150 }
  },
  {
    id: 'economic-indicators',
    label: 'Economic Indicators',
    category: 'basics',
    difficulty: 'beginner',
    description: 'GDP, inflation, interest rates and market impact',
    subtopicsCount: 6,
    moduleIds: [],
    conceptIds: [],
    connections: ['market-basics', 'portfolio-theory'],
    position: { x: 100, y: 450 }
  },
  
  // Intermediate Level - Center
  {
    id: 'stock-analysis',
    label: 'Stock Analysis',
    category: 'fundamental',
    difficulty: 'intermediate',
    description: 'Technical and fundamental analysis techniques',
    subtopicsCount: 12,
    moduleIds: ['pe-ratio-explained', 'candlestick-basics', 'support-resistance-basics'],
    conceptIds: ['pe-ratio', 'candlestick-patterns', 'support-resistance'],
    connections: ['market-basics', 'trading-strategies', 'options-trading'],
    position: { x: 350, y: 100 }
  },
  {
    id: 'risk-management',
    label: 'Risk Management',
    category: 'risk',
    difficulty: 'intermediate',
    description: 'Portfolio protection and position sizing',
    subtopicsCount: 7,
    moduleIds: ['risk-management-101'],
    conceptIds: ['position-sizing', 'stop-loss', 'risk-reward-ratio', 'drawdown'],
    connections: ['market-basics', 'options-trading', 'portfolio-theory'],
    position: { x: 150, y: 300 }
  },
  {
    id: 'options-trading',
    label: 'Options Trading',
    category: 'derivatives',
    difficulty: 'advanced',
    description: 'Calls, puts, and complex option strategies',
    subtopicsCount: 10,
    moduleIds: ['fno-basics', 'options-strategies'],
    conceptIds: ['option-greeks', 'open-interest'],
    connections: ['stock-analysis', 'risk-management', 'cryptocurrency'],
    position: { x: 400, y: 280 }
  },
  {
    id: 'portfolio-theory',
    label: 'Portfolio Theory',
    category: 'risk',
    difficulty: 'intermediate',
    description: 'Diversification and asset allocation strategies',
    subtopicsCount: 9,
    moduleIds: [],
    conceptIds: ['sharpe-ratio'],
    connections: ['risk-management', 'economic-indicators', 'value-investing'],
    position: { x: 600, y: 350 }
  },
  
  // Advanced Level - Right Side
  {
    id: 'trading-strategies',
    label: 'Trading Strategies',
    category: 'technical',
    difficulty: 'advanced',
    description: 'Day trading, swing trading, and position trading',
    subtopicsCount: 15,
    moduleIds: ['moving-averages-strategy', 'rsi-macd-mastery'],
    conceptIds: ['rsi', 'macd', 'moving-averages'],
    connections: ['stock-analysis'],
    position: { x: 650, y: 130 }
  },
  {
    id: 'cryptocurrency',
    label: 'Cryptocurrency',
    category: 'derivatives',
    difficulty: 'intermediate',
    description: 'Digital assets, blockchain, and crypto trading',
    subtopicsCount: 11,
    moduleIds: [],
    conceptIds: [],
    connections: ['options-trading'],
    position: { x: 400, y: 450 }
  },
  {
    id: 'value-investing',
    label: 'Value Investing',
    category: 'fundamental',
    difficulty: 'intermediate',
    description: 'Warren Buffett style long-term investing',
    subtopicsCount: 8,
    moduleIds: [],
    conceptIds: ['dcf', 'free-cash-flow', 'piotroski-f-score'],
    connections: ['portfolio-theory'],
    position: { x: 650, y: 500 }
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export function getPathForPersona(persona: UserSegment): LearningPath | undefined {
  return PERSONA_PATHS.find(p => p.persona === persona);
}

export function getAllPaths(): LearningPath[] {
  return [BEGINNER_PATH, ...PERSONA_PATHS];
}

export function getPathById(pathId: string): LearningPath | undefined {
  return getAllPaths().find(p => p.id === pathId);
}

export function calculatePathProgress(pathId: string, completedModules: string[]): number {
  const path = getPathById(pathId);
  if (!path) return 0;
  
  const allModules = path.stages.flatMap(s => s.moduleIds);
  if (allModules.length === 0) return 0;
  
  const completed = allModules.filter(m => completedModules.includes(m)).length;
  return Math.round((completed / allModules.length) * 100);
}

export function getNextStage(pathId: string, completedModules: string[]): PathStage | undefined {
  const path = getPathById(pathId);
  if (!path) return undefined;
  
  for (const stage of path.stages) {
    const stageComplete = stage.moduleIds.every(m => completedModules.includes(m));
    if (!stageComplete) return stage;
  }
  
  return undefined;
}

export function getRecommendedPath(
  experience: 'beginner' | 'intermediate' | 'advanced',
  interest: UserSegment | 'general'
): LearningPath {
  if (experience === 'beginner') {
    return BEGINNER_PATH;
  }
  
  if (interest !== 'general') {
    const personaPath = getPathForPersona(interest);
    if (personaPath) return personaPath;
  }
  
  // Default to intraday path for intermediate+
  return PERSONA_PATHS.find(p => p.id === 'intraday-path') || BEGINNER_PATH;
}
