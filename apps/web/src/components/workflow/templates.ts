// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOW TEMPLATES
// Pre-built workflows for common analysis patterns
// ═══════════════════════════════════════════════════════════════════════════

import type { WorkflowTemplate } from './types';

// Re-export the type for convenience
export type { WorkflowTemplate };

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // BEGINNER TEMPLATES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'quick-snapshot',
    name: 'Quick Snapshot',
    description: 'Get a quick overview of any stock with key metrics',
    icon: '📷',
    category: 'beginner',
    tags: ['quick', 'overview', 'beginner'],
    philosophy: {
      question: 'When should I use this?',
      answer: 'Use Quick Snapshot when you first hear about a stock and want a rapid assessment. It gives you the essential numbers in under 30 seconds without deep analysis. Think of it as a first date with a stock—enough to decide if you want to learn more.',
      bestFor: ['First look at a new stock', 'Quick sanity checks', 'Comparing multiple stocks rapidly'],
      notFor: ['Making buy/sell decisions', 'Deep fundamental analysis'],
    },
    nodes: [
      {
        type: 'card',
        position: { x: 250, y: 100 },
        data: {
          type: 'card',
          cardId: 'stock-snapshot',
          label: 'Stock Snapshot',
          category: 'overview',
          description: 'Primary entry point showing company info',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 250, y: 250 },
        data: {
          type: 'card',
          cardId: 'valuation-summary',
          label: 'Valuation Summary',
          category: 'value',
          description: 'Multi-metric valuation dashboard',
          symbol: '',
          params: {},
        },
      },
    ],
    edges: [
      { source: '0', target: '1' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // VALUE INVESTING TEMPLATES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'value-investor',
    name: 'Value Investor',
    description: 'Warren Buffett style analysis - intrinsic value, margin of safety, quality',
    icon: '💎',
    category: 'value',
    tags: ['buffett', 'value', 'fundamental', 'long-term'],
    philosophy: {
      question: 'When should I use this?',
      answer: 'Use Value Investor when you\'re looking for stocks trading below their intrinsic worth. This workflow follows the Buffett/Graham philosophy: find wonderful companies at fair prices. It calculates what a business is actually worth based on future cash flows, then checks if the current price offers a margin of safety.',
      bestFor: ['Long-term investors (3+ year horizon)', 'Finding undervalued quality stocks', 'Building a core portfolio'],
      notFor: ['Short-term trading', 'Momentum plays', 'Speculative growth stocks'],
    },
    nodes: [
      {
        type: 'card',
        position: { x: 250, y: 50 },
        data: {
          type: 'card',
          cardId: 'fair-value-forecaster',
          label: 'Fair Value Forecaster',
          category: 'value',
          description: 'DCF-based intrinsic value projection',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 250, y: 200 },
        data: {
          type: 'card',
          cardId: 'piotroski-score',
          label: 'Piotroski F-Score',
          category: 'value',
          description: '9-point fundamental health check',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 250, y: 350 },
        data: {
          type: 'card',
          cardId: 'dcf-valuation',
          label: 'DCF Valuation',
          category: 'value',
          description: 'Discounted cash flow model',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 250, y: 500 },
        data: {
          type: 'card',
          cardId: 'intrinsic-value-range',
          label: 'Intrinsic Value Range',
          category: 'value',
          description: 'Multiple valuation methods combined',
          symbol: '',
          params: {},
        },
      },
    ],
    edges: [
      { source: '0', target: '1' },
      { source: '1', target: '2' },
      { source: '2', target: '3' },
    ],
  },
  {
    id: 'margin-of-safety',
    name: 'Margin of Safety',
    description: 'Find undervalued stocks with strong fundamentals',
    icon: '🛡️',
    category: 'value',
    tags: ['undervalued', 'safety', 'conservative'],
    philosophy: {
      question: 'When should I use this?',
      answer: 'Use Margin of Safety when you want to minimize downside risk. This workflow identifies stocks where the gap between price and value provides a cushion against mistakes in your analysis. Even if your valuation is off by 20%, you\'re still protected.',
      bestFor: ['Conservative investors', 'Bear market shopping', 'Capital preservation focus'],
      notFor: ['High-growth momentum stocks', 'Turnaround situations', 'Early-stage companies'],
    },
    nodes: [
      {
        type: 'card',
        position: { x: 250, y: 50 },
        data: {
          type: 'card',
          cardId: 'valuation-summary',
          label: 'Valuation Summary',
          category: 'value',
          description: 'Multi-metric valuation dashboard',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 50, y: 200 },
        data: {
          type: 'card',
          cardId: 'fair-value-forecaster',
          label: 'Fair Value',
          category: 'value',
          description: 'Intrinsic value estimate',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 450, y: 200 },
        data: {
          type: 'card',
          cardId: 'bankruptcy-health',
          label: 'Bankruptcy Health',
          category: 'risk',
          description: 'Altman Z-Score analysis',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 250, y: 350 },
        data: {
          type: 'card',
          cardId: 'multi-factor-scorecard',
          label: 'Multi-Factor Score',
          category: 'value',
          description: 'Combined quality score',
          symbol: '',
          params: {},
        },
      },
    ],
    edges: [
      { source: '0', target: '1' },
      { source: '0', target: '2' },
      { source: '1', target: '3' },
      { source: '2', target: '3' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // GROWTH TEMPLATES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'growth-hunter',
    name: 'Growth Hunter',
    description: 'Find high-growth companies with sustainable momentum',
    icon: '🚀',
    category: 'growth',
    tags: ['growth', 'momentum', 'earnings'],
    philosophy: {
      question: 'When should I use this?',
      answer: 'Use Growth Hunter when seeking companies expanding rapidly. It goes beyond simple revenue growth to check if growth is profitable, sustainable, and coming from the right sources. Great for finding the next market leaders before they become household names.',
      bestFor: ['Finding compounders', 'Sector leaders research', 'GARP (Growth at Reasonable Price) investing'],
      notFor: ['Income/dividend investors', 'Risk-averse portfolios', 'Value-only strategies'],
    },
    nodes: [
      {
        type: 'card',
        position: { x: 250, y: 50 },
        data: {
          type: 'card',
          cardId: 'growth-summary',
          label: 'Growth Summary',
          category: 'growth',
          description: 'Revenue, earnings, margin trends',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 250, y: 200 },
        data: {
          type: 'card',
          cardId: 'earnings-quality',
          label: 'Earnings Quality',
          category: 'growth',
          description: 'Quality and sustainability of earnings',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 250, y: 350 },
        data: {
          type: 'card',
          cardId: 'dupont-analysis',
          label: 'DuPont Analysis',
          category: 'value',
          description: 'ROE breakdown',
          symbol: '',
          params: {},
        },
      },
    ],
    edges: [
      { source: '0', target: '1' },
      { source: '1', target: '2' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // TECHNICAL TEMPLATES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'technical-deep-dive',
    name: 'Technical Deep Dive',
    description: 'Complete technical analysis with patterns, indicators, and levels',
    icon: '📊',
    category: 'technical',
    tags: ['technical', 'patterns', 'indicators', 'chart'],
    philosophy: {
      question: 'When should I use this?',
      answer: 'Use Technical Deep Dive when timing matters. After you\'ve found a fundamentally sound stock, this workflow helps you find optimal entry and exit points. It combines pattern recognition, momentum indicators, and trend analysis to read what the market is actually doing.',
      bestFor: ['Timing entries and exits', 'Swing trading setups', 'Confirming fundamental thesis'],
      notFor: ['Long-term buy-and-hold', 'Fundamental-only investors', 'Illiquid stocks'],
    },
    nodes: [
      {
        type: 'card',
        position: { x: 250, y: 50 },
        data: {
          type: 'card',
          cardId: 'candlestick-hero',
          label: 'Candlestick Chart',
          category: 'technical',
          description: 'Interactive price chart',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 50, y: 200 },
        data: {
          type: 'card',
          cardId: 'pattern-matcher',
          label: 'Pattern Matcher',
          category: 'technical',
          description: 'Detect chart patterns',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 450, y: 200 },
        data: {
          type: 'card',
          cardId: 'technical-indicators',
          label: 'Technical Indicators',
          category: 'technical',
          description: 'RSI, MACD, Bollinger',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 250, y: 350 },
        data: {
          type: 'card',
          cardId: 'trend-strength',
          label: 'Trend Strength',
          category: 'technical',
          description: 'ADX and trend analysis',
          symbol: '',
          params: {},
        },
      },
    ],
    edges: [
      { source: '0', target: '1' },
      { source: '0', target: '2' },
      { source: '1', target: '3' },
      { source: '2', target: '3' },
    ],
  },
  {
    id: 'swing-trader',
    name: 'Swing Trader',
    description: 'Find swing trading opportunities with momentum and volatility',
    icon: '🎢',
    category: 'technical',
    tags: ['swing', 'momentum', 'volatility'],
    philosophy: {
      question: 'When should I use this?',
      answer: 'Use Swing Trader when you want to capture moves lasting days to weeks. It focuses on momentum shifts, volatility expansion, and risk management. Perfect for traders who can\'t watch screens all day but want more action than buy-and-hold.',
      bestFor: ['Part-time traders', '2-10 day holding periods', 'Volatile market conditions'],
      notFor: ['Day trading', 'Passive investors', 'Low-volatility stocks'],
    },
    nodes: [
      {
        type: 'card',
        position: { x: 250, y: 50 },
        data: {
          type: 'card',
          cardId: 'technical-indicators',
          label: 'Technical Indicators',
          category: 'technical',
          description: 'RSI, MACD signals',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 250, y: 200 },
        data: {
          type: 'card',
          cardId: 'drawdown-var',
          label: 'Risk Metrics',
          category: 'risk',
          description: 'Drawdown and VaR',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 250, y: 350 },
        data: {
          type: 'card',
          cardId: 'trade-expectancy',
          label: 'Trade Expectancy',
          category: 'risk',
          description: 'Win rate and R-multiple',
          symbol: '',
          params: {},
        },
      },
    ],
    edges: [
      { source: '0', target: '1' },
      { source: '1', target: '2' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // RISK TEMPLATES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'risk-assessment',
    name: 'Risk Assessment',
    description: 'Comprehensive risk analysis before investing',
    icon: '⚠️',
    category: 'risk',
    tags: ['risk', 'safety', 'due-diligence'],
    nodes: [
      {
        type: 'card',
        position: { x: 250, y: 50 },
        data: {
          type: 'card',
          cardId: 'risk-health-dashboard',
          label: 'Risk Dashboard',
          category: 'risk',
          description: 'Overall risk health',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 50, y: 200 },
        data: {
          type: 'card',
          cardId: 'bankruptcy-health',
          label: 'Bankruptcy Health',
          category: 'risk',
          description: 'Financial stability',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 450, y: 200 },
        data: {
          type: 'card',
          cardId: 'leverage-history',
          label: 'Leverage History',
          category: 'risk',
          description: 'Debt trends',
          symbol: '',
          params: {},
        },
      },
      {
        type: 'card',
        position: { x: 250, y: 350 },
        data: {
          type: 'card',
          cardId: 'financial-stress-radar',
          label: 'Stress Radar',
          category: 'risk',
          description: 'Multi-factor stress test',
          symbol: '',
          params: {},
        },
      },
    ],
    edges: [
      { source: '0', target: '1' },
      { source: '0', target: '2' },
      { source: '1', target: '3' },
      { source: '2', target: '3' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NEW TEMPLATES - VALUE INVESTING
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'magic-formula',
    name: 'Magic Formula 2.0 (Greenblatt India)',
    description: 'Top value screen in India - earnings yield + ROIC ranking',
    icon: '🧙',
    category: 'value',
    tags: ['greenblatt', 'magic-formula', 'value', 'roic'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'valuation-summary', label: 'Valuation Summary', category: 'value', description: 'Starting point', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'piotroski-score', label: 'Piotroski F-Score', category: 'value', description: 'Quality filter', symbol: '', params: {} } },
      { type: 'card', position: { x: 50, y: 350 }, data: { type: 'card', cardId: 'dupont-analysis', label: 'ROIC Analysis', category: 'value', description: 'Return on capital', symbol: '', params: {} } },
      { type: 'card', position: { x: 450, y: 350 }, data: { type: 'card', cardId: 'earnings-quality', label: 'Earnings Yield', category: 'growth', description: 'EV/EBITDA', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'multi-factor-scorecard', label: 'Multi-Factor Score', category: 'value', description: 'Combined ranking', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'financial-health-dna', label: 'Financial Health DNA', category: 'value', description: 'Final check', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '1', target: '3' }, { source: '2', target: '4' }, { source: '3', target: '4' }, { source: '4', target: '5' }],
  },
  {
    id: 'deep-value-moat',
    name: 'Deep Value + Quality Moat',
    description: 'Buffett-style analysis - intrinsic value with quality moat',
    icon: '💎',
    category: 'value',
    tags: ['buffett', 'value', 'moat', 'quality'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'stock-snapshot', label: 'Stock Snapshot', category: 'overview', description: 'Overview', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'intrinsic-value-range', label: 'Intrinsic Value', category: 'value', description: 'Graham + DCF', symbol: '', params: {} } },
      { type: 'card', position: { x: 50, y: 350 }, data: { type: 'card', cardId: 'piotroski-score', label: 'Piotroski F-Score', category: 'value', description: 'Quality', symbol: '', params: {} } },
      { type: 'card', position: { x: 450, y: 350 }, data: { type: 'card', cardId: 'dupont-analysis', label: 'DuPont Analysis', category: 'value', description: 'ROE breakdown', symbol: '', params: {} } },
      { type: 'card', position: { x: 50, y: 500 }, data: { type: 'card', cardId: 'capital-allocation', label: 'Capital Allocation', category: 'growth', description: 'Mgmt quality', symbol: '', params: {} } },
      { type: 'card', position: { x: 450, y: 500 }, data: { type: 'card', cardId: 'management-quality', label: 'Management Quality', category: 'growth', description: 'Track record', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'financial-health-dna', label: 'Financial Health DNA', category: 'value', description: 'Moat check', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '1', target: '3' }, { source: '2', target: '4' }, { source: '3', target: '5' }, { source: '4', target: '6' }, { source: '5', target: '6' }],
  },
  {
    id: 'garp-hunter',
    name: 'GARP Hunter (Growth at Reasonable Price)',
    description: 'PEG ratio focus - best hybrid style in India',
    icon: '🎯',
    category: 'growth',
    tags: ['garp', 'peg', 'growth', 'value'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'growth-summary', label: 'Growth Summary', category: 'growth', description: 'Growth metrics', symbol: '', params: {} } },
      { type: 'card', position: { x: 50, y: 200 }, data: { type: 'card', cardId: 'valuation-summary', label: 'PEG Ratio', category: 'value', description: 'Growth-adjusted PE', symbol: '', params: {} } },
      { type: 'card', position: { x: 450, y: 200 }, data: { type: 'card', cardId: 'dupont-analysis', label: 'ROIC Check', category: 'value', description: 'Capital efficiency', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'earnings-quality', label: 'Earnings Quality', category: 'growth', description: 'Sustainable growth', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'multi-factor-scorecard', label: 'Multi-Factor Score', category: 'value', description: 'Combined ranking', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '0', target: '2' }, { source: '1', target: '3' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'hyper-growth',
    name: 'Hyper-Growth + Quality Filter',
    description: 'Find next 10-baggers early with quality checks',
    icon: '🚀',
    category: 'growth',
    tags: ['hyper-growth', 'multibagger', '10x'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'growth-summary', label: 'Growth Summary', category: 'growth', description: 'Revenue 30%+ CAGR', symbol: '', params: {} } },
      { type: 'card', position: { x: 50, y: 200 }, data: { type: 'card', cardId: 'earnings-quality', label: 'Earnings Growth', category: 'growth', description: 'EPS momentum', symbol: '', params: {} } },
      { type: 'card', position: { x: 450, y: 200 }, data: { type: 'card', cardId: 'capital-allocation', label: 'CapEx Intensity', category: 'growth', description: 'Growth investment', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'piotroski-score', label: 'Piotroski Check', category: 'value', description: 'Quality filter', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'fcf-health', label: 'FCF Growth', category: 'cashflow', description: 'Cash generation', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'management-quality', label: 'Management Quality', category: 'growth', description: 'Execution', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '0', target: '2' }, { source: '1', target: '3' }, { source: '2', target: '3' }, { source: '3', target: '4' }, { source: '4', target: '5' }],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NEW TEMPLATES - INCOME / THEMATIC
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'dividend-income-suite',
    name: 'Dividend Income Suite',
    description: 'Complete dividend analysis - growth + yield + safety filters',
    icon: '💰',
    category: 'income',
    tags: ['dividend', 'income', 'retirement', 'safety', 'high-yield'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'dividend-crystal-ball', label: 'Dividend Crystal Ball', category: 'income', description: 'Projection', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'income-stability', label: 'Income Stability', category: 'income', description: 'Consistency', symbol: '', params: {} } },
      { type: 'card', position: { x: 50, y: 350 }, data: { type: 'card', cardId: 'valuation-summary', label: 'Yield > 4%', category: 'value', description: 'High yield filter', symbol: '', params: {} } },
      { type: 'card', position: { x: 450, y: 350 }, data: { type: 'card', cardId: 'piotroski-score', label: 'Piotroski > 7', category: 'value', description: 'Quality filter', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'bankruptcy-health', label: 'Z-Score > 3', category: 'risk', description: 'Safe zone', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'cashflow-stability-index', label: 'Cashflow Stability', category: 'risk', description: 'Dividend backing', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 800 }, data: { type: 'card', cardId: 'leverage-history', label: 'Interest Coverage', category: 'risk', description: 'Debt safety', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '1', target: '3' }, { source: '2', target: '4' }, { source: '3', target: '4' }, { source: '4', target: '5' }, { source: '5', target: '6' }],
  },
  {
    id: 'psu-value-dividend',
    name: 'PSU Value + Dividend Play',
    description: '2024-2025 top performing theme - government stocks',
    icon: '🏛️',
    category: 'thematic',
    tags: ['psu', 'government', 'dividend', 'india'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'stock-snapshot', label: 'Stock Snapshot', category: 'overview', description: 'PSU filter', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'valuation-summary', label: 'Dividend Yield', category: 'value', description: 'Income', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'piotroski-score', label: 'Piotroski Score', category: 'value', description: 'Quality', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'shareholding-pattern', label: 'Govt Ownership', category: 'macro', description: 'Promoter stake', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'institutional-flows', label: 'Institutional Flows', category: 'macro', description: 'FII/DII', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NEW TEMPLATES - RISK / FORENSIC
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'forensic-red-flags',
    name: 'Forensic Red Flags Detector',
    description: 'Avoid blow-ups - multi-factor fraud detection',
    icon: '🚩',
    category: 'risk',
    tags: ['forensic', 'red-flags', 'fraud', 'risk'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'bankruptcy-health', label: 'Altman Z-Score', category: 'risk', description: 'Bankruptcy risk', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'earnings-quality', label: 'Earnings Quality', category: 'growth', description: 'Manipulation check', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'piotroski-score', label: 'Piotroski Check', category: 'value', description: 'Fundamental flags', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'insider-trades', label: 'Insider Trading', category: 'macro', description: 'Insider selling', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'warning-sentinel-mini', label: 'Warning Sentinel', category: 'mini', description: 'All red flags', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'crash-early-warning',
    name: 'Crash Early Warning System',
    description: 'Protect capital in corrections - volatility + macro signals',
    icon: '🚨',
    category: 'risk',
    tags: ['crash', 'warning', 'protection', 'volatility'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'drawdown-var', label: 'Drawdown & VaR', category: 'risk', description: 'Risk metrics', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'volatility-regime', label: 'Volatility Regime', category: 'technical', description: 'VIX analysis', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'market-regime-radar', label: 'Market Regime', category: 'technical', description: 'Risk-on/off', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'crash-warning-mini', label: 'Crash Warning', category: 'mini', description: 'Alert level', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'risk-health-dashboard', label: 'Risk Dashboard', category: 'risk', description: 'Portfolio risk', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NEW TEMPLATES - SENTIMENT & FLOWS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'fii-dii-momentum',
    name: 'FII + DII Flow Momentum',
    description: 'Smart money tracker - institutional flow analysis',
    icon: '💵',
    category: 'sentiment',
    tags: ['fii', 'dii', 'institutional', 'smart-money'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'institutional-flows', label: 'Institutional Flows', category: 'macro', description: 'FII/DII data', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'shareholding-pattern', label: 'Shareholding Pattern', category: 'macro', description: 'Ownership', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Spike', category: 'technical', description: 'Unusual volume', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'pattern-matcher', label: 'Price Pattern', category: 'technical', description: 'Accumulation', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'trend-strength', label: 'Trend Strength', category: 'technical', description: 'Momentum', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'delivery-surge',
    name: 'Delivery % Surge (Accumulation)',
    description: 'Classic accumulation signal - high delivery percentage',
    icon: '📈',
    category: 'sentiment',
    tags: ['delivery', 'accumulation', 'institutional'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'delivery-analysis', label: 'Delivery Analysis', category: 'technical', description: 'High delivery %', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Spike', category: 'technical', description: 'Volume confirm', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'shareholding-pattern', label: 'Shareholding', category: 'macro', description: 'Ownership change', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price Chart', category: 'technical', description: 'Visual analysis', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'institutional-flows', label: 'Institutional Flows', category: 'macro', description: 'Flow confirm', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NEW TEMPLATES - TECHNICAL
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'golden-cross',
    name: 'Golden Cross + Volume',
    description: 'Classic trend-following entry - MA crossover',
    icon: '✝️',
    category: 'technical',
    tags: ['golden-cross', 'moving-average', 'trend'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'technical-indicators', label: '50/200 SMA Cross', category: 'technical', description: 'Golden cross', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Spike', category: 'technical', description: 'Breakout volume', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'trend-strength', label: 'ADX Trend', category: 'technical', description: 'Trend strength', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Candlestick Chart', category: 'technical', description: 'Visual confirm', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }],
  },
  {
    id: 'mean-reversion-pro',
    name: 'Mean Reversion Pro',
    description: 'High win-rate counter-trend - RSI + Bollinger',
    icon: '🔄',
    category: 'technical',
    tags: ['mean-reversion', 'oversold', 'rsi', 'bollinger'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'technical-indicators', label: 'RSI Extreme', category: 'technical', description: 'Oversold/overbought', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'volatility-regime', label: 'Bollinger Bands', category: 'technical', description: 'Band touch', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Spike', category: 'technical', description: 'Capitulation', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Reversal Candle', category: 'technical', description: 'Entry signal', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'vwap-analysis', label: 'VWAP Target', category: 'technical', description: 'Mean target', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 800 }, data: { type: 'card', cardId: 'trade-expectancy', label: 'Trade Expectancy', category: 'risk', description: 'R-multiple', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }, { source: '4', target: '5' }],
  },
  {
    id: 'intraday-scalper',
    name: 'Intraday Scalper Setup',
    description: 'Full intraday toolkit - VWAP, ORB, Volume, Risk',
    icon: '⚡',
    category: 'technical',
    tags: ['scalper', 'intraday', 'vwap', 'orb'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price Chart', category: 'technical', description: '5-min chart', symbol: '', params: {} } },
      { type: 'card', position: { x: 50, y: 200 }, data: { type: 'card', cardId: 'vwap-analysis', label: 'VWAP', category: 'technical', description: 'Intraday anchor', symbol: '', params: {} } },
      { type: 'card', position: { x: 450, y: 200 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Profile', category: 'technical', description: 'Key levels', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'orb-analysis', label: 'ORB Analysis', category: 'technical', description: '9:15-9:30 range', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'trade-flow-intel', label: 'Trade Flow', category: 'technical', description: 'Order flow', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'fno-risk-advisor', label: 'F&O Risk Advisor', category: 'risk', description: 'Position sizing', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 800 }, data: { type: 'card', cardId: 'trade-expectancy', label: 'Trade Expectancy', category: 'risk', description: 'R-multiple', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '0', target: '2' }, { source: '1', target: '3' }, { source: '2', target: '3' }, { source: '3', target: '4' }, { source: '4', target: '5' }, { source: '5', target: '6' }],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NEW TEMPLATES - EVENT-DRIVEN
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'earnings-surprise-momentum',
    name: 'Earnings Surprise + Momentum',
    description: 'Best post-earnings drift play',
    icon: '📊',
    category: 'event',
    tags: ['earnings', 'surprise', 'momentum', 'drift'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'earnings-calendar', label: 'Earnings Calendar', category: 'macro', description: 'Upcoming results', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'earnings-quality', label: 'Earnings Surprise', category: 'growth', description: 'Beat/miss', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Spike', category: 'technical', description: 'Reaction volume', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'technical-indicators', label: 'Momentum Signals', category: 'technical', description: 'RSI/MACD', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'trend-strength', label: 'Trend Strength', category: 'technical', description: 'Drift potential', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'pre-earnings-options',
    name: 'Pre-Earnings Options Strategy',
    description: 'Most profitable event strategy - options around earnings',
    icon: '🎰',
    category: 'event',
    tags: ['earnings', 'options', 'straddle', 'iv'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'earnings-calendar', label: 'Earnings Calendar', category: 'macro', description: 'Result dates', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'volatility-regime', label: 'Implied Volatility', category: 'technical', description: 'IV percentile', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'options-strategy', label: 'Options Strategy', category: 'derivatives', description: 'Strategy selection', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price Chart', category: 'technical', description: 'S/R levels', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'fno-risk-advisor', label: 'F&O Risk Advisor', category: 'risk', description: 'Position sizing', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NEW TEMPLATES - PORTFOLIO
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'portfolio-health-check',
    name: 'Portfolio Health Check',
    description: 'Monthly portfolio review - risk, returns, rebalancing',
    icon: '🏥',
    category: 'portfolio',
    tags: ['portfolio', 'health', 'review', 'rebalance'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'portfolio-leaderboard', label: 'Portfolio Leaderboard', category: 'portfolio', description: 'Holdings', symbol: '', params: {} } },
      { type: 'card', position: { x: 50, y: 200 }, data: { type: 'card', cardId: 'drawdown-var', label: 'Sharpe / Sortino', category: 'risk', description: 'Risk-adjusted', symbol: '', params: {} } },
      { type: 'card', position: { x: 450, y: 200 }, data: { type: 'card', cardId: 'risk-health-dashboard', label: 'Max Drawdown', category: 'risk', description: 'Downside risk', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'peer-comparison', label: 'Correlation Matrix', category: 'portfolio', description: 'Diversification', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'rebalance-optimizer', label: 'Rebalance Optimizer', category: 'portfolio', description: 'Rebalancing plan', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '0', target: '2' }, { source: '1', target: '3' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'tax-harvesting',
    name: 'Tax-Loss Harvesting Assistant',
    description: 'Year-end tax alpha - LTCG/STCG optimization',
    icon: '💸',
    category: 'portfolio',
    tags: ['tax', 'harvesting', 'ltcg', 'stcg'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'tax-calculator', label: 'Tax Calculator', category: 'portfolio', description: 'LTCG/STCG', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'drawdown-var', label: 'Loss Positions', category: 'risk', description: 'Harvest candidates', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'peer-comparison', label: 'Replacements', category: 'portfolio', description: 'Similar stocks', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'rebalance-optimizer', label: 'Rebalance Optimizer', category: 'portfolio', description: 'Tax-efficient swap', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NEW TEMPLATES - QUALITY / SPECIAL
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'debt-free-compounders',
    name: 'Debt-Free Compounders',
    description: "India's favorite screener - zero debt + high ROIC",
    icon: '🏔️',
    category: 'quality',
    tags: ['debt-free', 'compounder', 'roic', 'quality'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'leverage-history', label: 'D/E = 0', category: 'risk', description: 'Zero debt', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'dupont-analysis', label: 'ROIC > 15%', category: 'value', description: 'High returns', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'piotroski-score', label: 'Piotroski Check', category: 'value', description: 'Quality filter', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'fcf-health', label: 'FCF Growth', category: 'cashflow', description: 'Cash generation', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'capital-allocation', label: 'Capital Allocation', category: 'growth', description: 'Reinvestment', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'coffee-can-portfolio',
    name: 'Coffee Can Portfolio',
    description: 'Buy-and-forget strategy - 10+ year compounders',
    icon: '☕',
    category: 'quality',
    tags: ['coffee-can', 'long-term', 'buy-hold', 'compounder'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'multi-factor-scorecard', label: 'Multi-Factor Score', category: 'value', description: 'Quality ranking', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'dupont-analysis', label: 'ROIC Consistency', category: 'value', description: '10Y ROIC > 15%', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'growth-summary', label: 'Revenue Growth', category: 'growth', description: '10Y CAGR > 10%', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'management-quality', label: 'Management Quality', category: 'growth', description: 'Long tenure', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'financial-health-dna', label: 'Financial Health DNA', category: 'value', description: 'Moat strength', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // FLAGSHIP TEMPLATE
  // ─────────────────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────
  // BATCH 2 - SPECIAL SITUATIONS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'turnaround-detector',
    name: 'Turnaround Candidate Detector',
    description: 'Capture 100-300% moves from recovering companies',
    icon: '🔄',
    category: 'value',
    tags: ['turnaround', 'recovery', 'special-situation', 'deep-value'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'piotroski-score', label: 'Piotroski Improving', category: 'value', description: '3Y improvement', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'leverage-history', label: 'D/E Declining', category: 'risk', description: 'Deleveraging', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'earnings-quality', label: 'Earnings Turnaround', category: 'growth', description: 'Profit inflection', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'cash-conversion-earnings', label: 'Cash Conversion', category: 'cashflow', description: 'Real cash', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'bankruptcy-health', label: 'Altman Z-Score', category: 'risk', description: 'Survival check', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'short-squeeze',
    name: 'Short Squeeze Candidate',
    description: '2021-style squeezes - high short interest + volume',
    icon: '🩳',
    category: 'sentiment',
    tags: ['short-squeeze', 'shorts', 'volume', 'momentum'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'delivery-analysis', label: 'Short Interest', category: 'technical', description: 'High short %', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Spike', category: 'technical', description: 'Unusual activity', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'technical-indicators', label: 'RSI < 35', category: 'technical', description: 'Oversold', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'pattern-matcher', label: 'Price Action', category: 'technical', description: 'Reversal pattern', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'options-strategy', label: 'Put/Call Ratio', category: 'derivatives', description: 'Options sentiment', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 800 }, data: { type: 'card', cardId: 'fno-risk-advisor', label: 'F&O Risk Advisor', category: 'risk', description: 'Position sizing', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }, { source: '4', target: '5' }],
  },
  {
    id: 'low-pe-trap-avoider',
    name: 'Low PE + High ROE Trap Avoider',
    description: 'Avoid classic value traps with quality filters',
    icon: '🪤',
    category: 'value',
    tags: ['value-trap', 'pe', 'roe', 'quality'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'valuation-summary', label: 'P/E < 15', category: 'value', description: 'Low PE stocks', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'dupont-analysis', label: 'ROE > 20%', category: 'value', description: 'High ROE', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'piotroski-score', label: 'Piotroski > 6', category: 'value', description: 'Quality filter', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'leverage-history', label: 'D/E < 0.6', category: 'risk', description: 'Low leverage', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'financial-health-dna', label: 'Financial Health DNA', category: 'value', description: 'Final validation', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BATCH 2 - MORE TECHNICAL SETUPS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'trend-pullback',
    name: 'Trend-Following with Pullback',
    description: 'Classic pullback entry - buy dips in uptrend',
    icon: '📉',
    category: 'technical',
    tags: ['pullback', 'trend', 'moving-average', 'dip-buy'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'technical-indicators', label: '50/200 SMA', category: 'technical', description: 'Uptrend confirm', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'fibonacci-levels', label: 'Fib Retracement', category: 'technical', description: 'Pullback levels', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'volume-profile', label: 'Low Volume', category: 'technical', description: 'Weak pullback', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Entry Candle', category: 'technical', description: 'Reversal signal', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'trend-strength', label: 'ADX Check', category: 'technical', description: 'Trend intact', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'breakout-volume',
    name: 'Breakout + Volume Confirmation',
    description: 'High-momentum breakout - S/R break with volume',
    icon: '💥',
    category: 'technical',
    tags: ['breakout', 'volume', 'support', 'resistance'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'price-structure', label: 'Support & Resistance', category: 'technical', description: 'Key levels', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Spike', category: 'technical', description: 'Breakout volume', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Breakout Candle', category: 'technical', description: 'Strong close', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'vwap-analysis', label: 'VWAP Check', category: 'technical', description: 'Above VWAP', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'trade-flow-intel', label: 'Trade Flow', category: 'technical', description: 'Order flow', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'bollinger-squeeze',
    name: 'Bollinger Squeeze Breakout',
    description: 'Most reliable volatility expansion - squeeze then pop',
    icon: '🎯',
    category: 'technical',
    tags: ['bollinger', 'squeeze', 'volatility', 'breakout'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'volatility-regime', label: 'Bollinger Squeeze', category: 'technical', description: 'Band contraction', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Building', category: 'technical', description: 'Pre-breakout', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'trend-strength', label: 'ADX Rising', category: 'technical', description: 'Trend starting', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Breakout Chart', category: 'technical', description: 'Direction signal', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'trade-flow-intel', label: 'Trade Flow', category: 'technical', description: 'Order pressure', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'vwap-mastery',
    name: 'VWAP Mastery (Support + Reversion)',
    description: 'Complete VWAP toolkit - support/resistance + mean reversion strategies',
    icon: '📏',
    category: 'technical',
    tags: ['vwap', 'volume-profile', 'intraday', 'institutional', 'mean-reversion'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'vwap-analysis', label: 'VWAP Analysis', category: 'technical', description: 'VWAP + bands + deviation', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Profile', category: 'technical', description: 'POC / VAH / VAL', symbol: '', params: {} } },
      { type: 'card', position: { x: 50, y: 350 }, data: { type: 'card', cardId: 'price-structure', label: 'Support & Resistance', category: 'technical', description: 'Key levels', symbol: '', params: {} } },
      { type: 'card', position: { x: 450, y: 350 }, data: { type: 'card', cardId: 'orb-analysis', label: 'ORB Levels', category: 'technical', description: 'Opening range', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price Chart', category: 'technical', description: 'Entry signals', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'trade-flow-intel', label: 'Trade Flow Intel', category: 'technical', description: 'Order flow', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 800 }, data: { type: 'card', cardId: 'trade-expectancy', label: 'Trade Expectancy', category: 'risk', description: 'R-multiple targets', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '1', target: '3' }, { source: '2', target: '4' }, { source: '3', target: '4' }, { source: '4', target: '5' }, { source: '5', target: '6' }],
  },
  {
    id: 'gap-playbook',
    name: 'Gap-Up/Gap-Down Playbook',
    description: 'Gap trading strategy - gap fill vs continuation',
    icon: '🕳️',
    category: 'technical',
    tags: ['gap', 'gap-fill', 'gap-continuation', 'opening'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Gap Analysis', category: 'technical', description: 'Gap size & type', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'volume-profile', label: 'Gap Volume', category: 'technical', description: 'Volume confirm', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'pattern-matcher', label: 'First 15-min', category: 'technical', description: 'Opening action', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'earnings-quality', label: 'News Catalyst', category: 'growth', description: 'Gap reason', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'institutional-flows', label: 'Institutional Activity', category: 'macro', description: 'Big player moves', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'seasonality-confluence',
    name: 'Seasonality + Technical Confluence',
    description: 'Diwali, budget, expiry patterns - seasonal edge',
    icon: '🗓️',
    category: 'technical',
    tags: ['seasonality', 'diwali', 'budget', 'expiry'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'macro-calendar', label: 'Seasonal Calendar', category: 'macro', description: 'Key dates', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Historical Pattern', category: 'technical', description: 'Past behavior', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Pattern', category: 'technical', description: 'Seasonal volume', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'technical-indicators', label: 'RSI / MACD', category: 'technical', description: 'Technical confirm', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BATCH 2 - F&O / DERIVATIVES
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'expiry-scalper',
    name: 'Expiry Week Options Scalper',
    description: 'Weekly income strategy - theta decay plays',
    icon: '📆',
    category: 'derivatives',
    tags: ['expiry', 'options', 'theta', 'weekly'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'options-strategy', label: 'Options Strategy', category: 'derivatives', description: 'Strategy selection', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'volatility-regime', label: 'IV Percentile', category: 'technical', description: 'Premium levels', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Range Analysis', category: 'technical', description: 'Expected range', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'vwap-analysis', label: 'Strike Selection', category: 'technical', description: 'VWAP anchor', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'fno-risk-advisor', label: 'F&O Risk Advisor', category: 'risk', description: 'Position sizing', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'commodity-hedge',
    name: 'Commodity Hedging Playbook',
    description: 'Inflation hedge strategy - gold, silver, crude',
    icon: '🥇',
    category: 'derivatives',
    tags: ['commodity', 'gold', 'silver', 'hedge', 'inflation'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'mcx-commodity-dashboard', label: 'MCX Dashboard', category: 'commodities', description: 'Commodity prices', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'macro-calendar', label: 'Inflation Data', category: 'macro', description: 'CPI / WPI', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'nse-currency-dashboard', label: 'USD/INR', category: 'derivatives', description: 'Currency impact', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price Chart', category: 'technical', description: 'Trend analysis', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'risk-health-dashboard', label: 'Risk Dashboard', category: 'risk', description: 'Position sizing', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'currency-carry',
    name: 'Currency Pair Carry Trade',
    description: 'INR carry trades - interest rate differential',
    icon: '💱',
    category: 'derivatives',
    tags: ['currency', 'forex', 'carry', 'usdinr'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'nse-currency-dashboard', label: 'Currency Dashboard', category: 'derivatives', description: 'USD/EUR/GBP INR', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'macro-calendar', label: 'Interest Rates', category: 'macro', description: 'RBI vs Fed', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'volatility-regime', label: 'Currency IV', category: 'technical', description: 'Implied vol', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price Chart', category: 'technical', description: 'Trend analysis', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BATCH 2 - MORE EVENT-DRIVEN & THEMATIC
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ipo-quick-check',
    name: 'IPO Quick Check',
    description: 'Post-listing screening - evaluate new listings',
    icon: '🆕',
    category: 'event',
    tags: ['ipo', 'listing', 'new-stock'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'stock-snapshot', label: 'Stock Snapshot', category: 'overview', description: 'Company overview', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'valuation-summary', label: 'Valuation Summary', category: 'value', description: 'IPO pricing', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'shareholding-pattern', label: 'Shareholding', category: 'macro', description: 'Promoter/anchor', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'institutional-flows', label: 'Institutional Interest', category: 'macro', description: 'FII/DII', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'risk-health-dashboard', label: 'Risk Dashboard', category: 'risk', description: 'Risk assessment', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'corporate-action',
    name: 'Corporate Action Opportunity',
    description: 'Bonus/split/dividend plays - corporate event alpha',
    icon: '📋',
    category: 'event',
    tags: ['corporate-action', 'bonus', 'split', 'dividend'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'macro-calendar', label: 'Corporate Events', category: 'macro', description: 'Upcoming actions', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'dividend-crystal-ball', label: 'Dividend Analysis', category: 'income', description: 'Yield & dates', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price Action', category: 'technical', description: 'Run-up pattern', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Analysis', category: 'technical', description: 'Pre-event volume', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }],
  },
  {
    id: 'rbi-rate-impact',
    name: 'RBI Policy Rate Impact',
    description: 'Rate-cut beneficiaries - banking and rate-sensitive',
    icon: '🏦',
    category: 'event',
    tags: ['rbi', 'interest-rate', 'banking', 'policy'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'macro-calendar', label: 'RBI Calendar', category: 'macro', description: 'Policy dates', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'leverage-history', label: 'Debt Sensitivity', category: 'risk', description: 'D/E analysis', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'narrative-theme', label: 'Banking Sector', category: 'macro', description: 'Beneficiaries', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price Action', category: 'technical', description: 'Entry timing', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }],
  },
  {
    id: 'results-season',
    name: 'Results Season Momentum',
    description: 'Quarterly earnings season alpha - systematic approach',
    icon: '📅',
    category: 'event',
    tags: ['results', 'earnings', 'quarterly', 'season'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'earnings-calendar', label: 'Earnings Calendar', category: 'macro', description: 'Season schedule', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'earnings-quality', label: 'Earnings Surprise', category: 'growth', description: 'Beat expectations', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Spike', category: 'technical', description: 'Reaction volume', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Gap Analysis', category: 'technical', description: 'Post-earnings', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'options-strategy', label: 'Options Strategy', category: 'derivatives', description: 'Leverage play', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'sector-rotation',
    name: 'Sector Rotation Momentum',
    description: '2025 top macro strategy - ride sector trends',
    icon: '🔄',
    category: 'thematic',
    tags: ['sector', 'rotation', 'momentum', 'macro'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'narrative-theme', label: 'Narrative Themes', category: 'macro', description: 'Hot sectors', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'institutional-flows', label: 'Institutional Flows', category: 'macro', description: 'Smart money', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'market-regime-radar', label: 'Momentum Heatmap', category: 'technical', description: 'Sector strength', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'trend-strength', label: 'Relative Strength', category: 'technical', description: 'Outperformers', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }],
  },
  {
    id: 'budget-election-play',
    name: 'Budget/Election Thematic Play',
    description: '2024-2025 event theme - policy beneficiaries',
    icon: '🗳️',
    category: 'thematic',
    tags: ['budget', 'election', 'policy', 'thematic'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'macro-calendar', label: 'Macro Pulse', category: 'macro', description: 'Policy calendar', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'narrative-theme', label: 'Narrative Themes', category: 'macro', description: 'Beneficiaries', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'institutional-flows', label: 'Institutional Flows', category: 'macro', description: 'Smart money', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price Action', category: 'technical', description: 'Chart confirm', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }],
  },
  {
    id: 'monsoon-commodity',
    name: 'Monsoon Commodity Play',
    description: 'India-specific seasonal - agri and commodity stocks',
    icon: '🌧️',
    category: 'thematic',
    tags: ['monsoon', 'commodity', 'agri', 'seasonal'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'mcx-commodity-dashboard', label: 'MCX Dashboard', category: 'commodities', description: 'Commodity prices', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'narrative-theme', label: 'Agri Themes', category: 'macro', description: 'Monsoon plays', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Spike', category: 'technical', description: 'Entry signal', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price Action', category: 'technical', description: 'Chart setup', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BATCH 2 - MORE PORTFOLIO & QUALITY
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'small-cap-discovery',
    name: 'Small-Cap Discovery',
    description: 'High demand segment - find quality small caps',
    icon: '🔬',
    category: 'growth',
    tags: ['small-cap', 'discovery', 'multibagger'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'stock-snapshot', label: 'Stock Snapshot', category: 'overview', description: 'Market cap filter', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'growth-summary', label: 'Growth Summary', category: 'growth', description: 'Revenue & earnings', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'piotroski-score', label: 'Piotroski Score', category: 'value', description: 'Quality check', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'institutional-flows', label: 'Institutional Flows', category: 'macro', description: 'Smart money', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'risk-health-dashboard', label: 'Risk Health', category: 'risk', description: 'Risk assessment', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'nifty-rebalancing',
    name: 'Nifty 50 Rebalancing Play',
    description: 'Semi-annual alpha - index recomposition trades',
    icon: '🔄',
    category: 'portfolio',
    tags: ['nifty', 'index', 'rebalancing', 'inclusion'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'macro-calendar', label: 'Rebalancing Calendar', category: 'macro', description: 'Review dates', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'institutional-flows', label: 'Passive Flows', category: 'macro', description: 'Index fund flows', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Spike', category: 'technical', description: 'Inclusion volume', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price Chart', category: 'technical', description: 'Entry timing', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }],
  },
  {
    id: 'pair-trading',
    name: 'Pair Trading Setup',
    description: 'Market-neutral strategy - correlation-based pairs',
    icon: '🔗',
    category: 'technical',
    tags: ['pair-trading', 'correlation', 'market-neutral', 'quant'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'peer-comparison', label: 'Peer Comparison', category: 'portfolio', description: 'Find pairs', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'technical-indicators', label: 'Correlation', category: 'technical', description: 'Co-integration', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'pattern-matcher', label: 'Price Divergence', category: 'technical', description: 'Spread analysis', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Charts', category: 'technical', description: 'Visual spread', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'trade-expectancy', label: 'Trade Expectancy', category: 'risk', description: 'R-multiple', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'earnings-quality-monster',
    name: 'Earnings Quality Monster',
    description: 'Catch accounting fraud early - accruals and cash conversion',
    icon: '🔍',
    category: 'quality',
    tags: ['earnings-quality', 'forensic', 'accruals', 'fraud'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'earnings-quality', label: 'Earnings Quality', category: 'growth', description: 'Quality score', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'cash-conversion-earnings', label: 'Cash Conversion', category: 'cashflow', description: 'Earnings to cash', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'piotroski-score', label: 'Piotroski F-Score', category: 'value', description: 'Fundamental check', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'fcf-health', label: 'Free Cash Flow', category: 'cashflow', description: 'Real cash', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'management-quality', label: 'Management Quality', category: 'growth', description: 'Governance', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'capital-allocation-champions',
    name: 'Capital Allocation Champions',
    description: 'Find capital-efficient businesses with smart management',
    icon: '🏆',
    category: 'quality',
    tags: ['capital-allocation', 'roic', 'buyback', 'quality'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'capital-allocation', label: 'Capital Allocation', category: 'growth', description: 'Allocation score', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'dupont-analysis', label: 'ROIC Analysis', category: 'value', description: 'Return on capital', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'fcf-health', label: 'Free Cash Flow', category: 'cashflow', description: 'Cash for allocation', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'dividend-crystal-ball', label: 'Shareholder Returns', category: 'income', description: 'Div + buyback', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'management-quality', label: 'Management Quality', category: 'growth', description: 'Track record', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'promoter-pledge-risk',
    name: 'Promoter Pledge + Governance Risk',
    description: 'Critical India-specific risk - pledged shares',
    icon: '⚠️',
    category: 'risk',
    tags: ['promoter', 'pledge', 'governance', 'india'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'shareholding-pattern', label: 'Shareholding Pattern', category: 'macro', description: 'Promoter holding', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'insider-trades', label: 'Insider Trading', category: 'macro', description: 'Promoter txns', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'management-quality', label: 'Management Quality', category: 'growth', description: 'Governance score', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'warning-sentinel-mini', label: 'Warning Sentinel', category: 'mini', description: 'All warnings', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }],
  },
  {
    id: 'insider-buying',
    name: 'Insider + Promoter Buying Signal',
    description: 'Smart money signal - follow insider purchases',
    icon: '👔',
    category: 'sentiment',
    tags: ['insider', 'promoter', 'buying', 'smart-money'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'insider-trades', label: 'Insider Trading', category: 'macro', description: 'Buy transactions', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'shareholding-pattern', label: 'Shareholding Pattern', category: 'macro', description: 'Promoter increase', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Spike', category: 'technical', description: 'Accumulation', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price Chart', category: 'technical', description: 'Entry timing', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }],
  },
  {
    id: 'bulk-block-deals',
    name: 'Bulk/Block Deal Tracker',
    description: 'Big player entry detector - large transaction analysis',
    icon: '📦',
    category: 'sentiment',
    tags: ['bulk-deal', 'block-deal', 'large-trades'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'institutional-flows', label: 'Institutional Flows', category: 'macro', description: 'Bulk/block deals', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Spike', category: 'technical', description: 'Unusual volume', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price Impact', category: 'technical', description: 'Visual context', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'trade-flow-intel', label: 'Trade Flow Intel', category: 'technical', description: 'Order flow', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }],
  },
  {
    id: 'mf-deep-dive',
    name: 'Mutual Fund Deep Dive',
    description: 'MF analysis toolkit - expense ratio, alpha, Sharpe',
    icon: '📊',
    category: 'portfolio',
    tags: ['mutual-fund', 'mf', 'analysis', 'expense-ratio'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'mf-explorer', label: 'MF Explorer', category: 'mutual-funds', description: 'Fund search', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'mf-analyzer', label: 'MF Analyzer', category: 'mutual-funds', description: 'Deep analysis', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'drawdown-var', label: 'Alpha vs Benchmark', category: 'risk', description: 'Outperformance', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'mf-portfolio-optimizer', label: 'MF Optimizer', category: 'mutual-funds', description: 'Allocation', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }],
  },
  {
    id: 'etf-vs-stock',
    name: 'ETF vs Stock Comparison',
    description: 'Popular with new investors - direct vs ETF decision',
    icon: '⚖️',
    category: 'portfolio',
    tags: ['etf', 'comparison', 'index', 'direct-equity'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'peer-comparison', label: 'ETF vs Stock', category: 'portfolio', description: 'Side-by-side', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'drawdown-var', label: 'Alpha & Beta', category: 'risk', description: 'Risk-return', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'multi-factor-scorecard', label: 'Sharpe Ratio', category: 'value', description: 'Risk-adjusted', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'portfolio-leaderboard', label: 'Portfolio Impact', category: 'portfolio', description: 'Fit analysis', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // FLAGSHIP TEMPLATE
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ultimate-investor-checklist',
    name: 'Ultimate Investor Checklist (Flagship)',
    description: 'Your one-click full report - comprehensive 360° analysis',
    icon: '🎯',
    category: 'flagship',
    tags: ['complete', 'comprehensive', 'full-analysis', 'flagship'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'stock-snapshot', label: 'Stock Snapshot', category: 'overview', description: 'Overview', symbol: '', params: {} } },
      { type: 'card', position: { x: 50, y: 200 }, data: { type: 'card', cardId: 'valuation-summary', label: 'Valuation', category: 'value', description: 'Multiples', symbol: '', params: {} } },
      { type: 'card', position: { x: 450, y: 200 }, data: { type: 'card', cardId: 'growth-summary', label: 'Growth', category: 'growth', description: 'Growth metrics', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'financial-health-dna', label: 'Financial Health', category: 'value', description: 'Quality score', symbol: '', params: {} } },
      { type: 'card', position: { x: 50, y: 500 }, data: { type: 'card', cardId: 'piotroski-score', label: 'Piotroski', category: 'value', description: 'F-Score', symbol: '', params: {} } },
      { type: 'card', position: { x: 450, y: 500 }, data: { type: 'card', cardId: 'risk-health-dashboard', label: 'Risk Dashboard', category: 'risk', description: 'Risk check', symbol: '', params: {} } },
      { type: 'card', position: { x: 50, y: 650 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price Chart', category: 'technical', description: 'Technical', symbol: '', params: {} } },
      { type: 'card', position: { x: 450, y: 650 }, data: { type: 'card', cardId: 'institutional-flows', label: 'Institutional', category: 'macro', description: 'FII/DII', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 800 }, data: { type: 'card', cardId: 'technical-indicators', label: 'Technicals', category: 'technical', description: 'Indicators', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 950 }, data: { type: 'card', cardId: 'narrative-theme', label: 'Themes', category: 'macro', description: 'Thematic fit', symbol: '', params: {} } },
    ],
    edges: [
      { source: '0', target: '1' }, { source: '0', target: '2' },
      { source: '1', target: '3' }, { source: '2', target: '3' },
      { source: '3', target: '4' }, { source: '3', target: '5' },
      { source: '4', target: '6' }, { source: '5', target: '7' },
      { source: '6', target: '8' }, { source: '7', target: '8' },
      { source: '8', target: '9' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ADDITIONAL TEMPLATES TO REACH 60
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'oi-analysis',
    name: 'Open Interest Analysis (F&O)',
    description: 'Options OI buildup and unwinding analysis for F&O stocks',
    icon: '📊',
    category: 'derivatives',
    tags: ['oi', 'open-interest', 'fno', 'options', 'futures'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'options-strategy', label: 'Options Chain', category: 'derivatives', description: 'OI distribution', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Profile', category: 'technical', description: 'Volume vs OI', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price + OI Chart', category: 'technical', description: 'Correlation', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'volatility-regime', label: 'IV Analysis', category: 'technical', description: 'Implied volatility', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'fno-risk-advisor', label: 'F&O Risk Advisor', category: 'risk', description: 'Position sizing', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'relative-strength-leaders',
    name: 'Relative Strength Leaders',
    description: 'Find stocks outperforming the market - RS ranking strategy',
    icon: '💪',
    category: 'technical',
    tags: ['relative-strength', 'momentum', 'outperformers', 'rs-ranking'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'trend-strength', label: 'Trend Strength', category: 'technical', description: 'RS vs Nifty', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'technical-indicators', label: 'Momentum Signals', category: 'technical', description: 'RSI/MACD confirm', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Confirmation', category: 'technical', description: 'Strong volume', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price Chart', category: 'technical', description: 'Base breakout', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'institutional-flows', label: 'Institutional Flows', category: 'macro', description: 'Smart money', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
  {
    id: 'first-stock-analysis',
    name: 'First Stock Analysis (Beginner)',
    description: 'Simple 3-card workflow for beginners - snapshot + chart + risk',
    icon: '🎓',
    category: 'beginner',
    tags: ['beginner', 'simple', 'starter', 'easy'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'stock-snapshot', label: 'Stock Snapshot', category: 'overview', description: 'Company overview', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Price Chart', category: 'technical', description: 'See the price', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'risk-health-dashboard', label: 'Risk Check', category: 'risk', description: 'Is it safe?', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }],
  },
  {
    id: 'monthly-income-portfolio',
    name: 'Monthly Income Portfolio',
    description: 'Build a portfolio for regular monthly dividend income',
    icon: '📅',
    category: 'income',
    tags: ['income', 'monthly', 'dividend', 'retirement', 'passive'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'dividend-crystal-ball', label: 'Dividend Calendar', category: 'income', description: 'Payment schedule', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'income-stability', label: 'Income Stability', category: 'income', description: 'Consistency check', symbol: '', params: {} } },
      { type: 'card', position: { x: 50, y: 350 }, data: { type: 'card', cardId: 'cashflow-stability-index', label: 'Cashflow Stability', category: 'risk', description: 'Payout safety', symbol: '', params: {} } },
      { type: 'card', position: { x: 450, y: 350 }, data: { type: 'card', cardId: 'bankruptcy-health', label: 'Financial Health', category: 'risk', description: 'No default risk', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'rebalance-optimizer', label: 'Portfolio Optimizer', category: 'portfolio', description: 'Diversification', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '1', target: '3' }, { source: '2', target: '4' }, { source: '3', target: '4' }],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTCOME-DRIVEN TEMPLATES - Trading & Investing Workflows
  // ═══════════════════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. EARNINGS SEASON MASTERY
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'earnings-season-mastery',
    name: 'Earnings Season Mastery',
    description: 'Identify companies with consistent beats, clean accounting, and macro tailwinds before results',
    icon: '📈',
    category: 'macro',
    tags: ['earnings', 'quarterly', 'results', 'surprise', 'quality', 'macro'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'earnings-calendar', label: 'Earnings Calendar', category: 'macro', description: 'Upcoming announcements', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'earnings-surprise', label: 'Earnings Surprise', category: 'macro', description: 'Beat/miss history', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'earnings-quality', label: 'Earnings Quality', category: 'growth', description: 'Accrual analysis', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'earnings-stability', label: 'Earnings Stability', category: 'growth', description: 'Consistency score', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'profit-vs-cash-divergence', label: 'Profit vs Cash', category: 'growth', description: 'Red flag detection', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 800 }, data: { type: 'card', cardId: 'macro-pulse', label: 'Macro Pulse', category: 'macro', description: 'Economic context', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }, { source: '4', target: '5' }],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. ORDER FLOW & DELIVERY EDGE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'order-flow-delivery-edge',
    name: 'Order Flow & Delivery Edge',
    description: 'Spot institutional buying through delivery spikes, order imbalances, and volume clusters',
    icon: '🔬',
    category: 'technical',
    tags: ['orderflow', 'delivery', 'institutional', 'volume', 'breakout', 'india'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Candlestick Hero', category: 'technical', description: 'Price action', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Profile', category: 'technical', description: 'POC & value area', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'footprint-analysis', label: 'Footprint Analysis', category: 'technical', description: 'Delta & imbalances', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'delivery-analysis', label: 'Delivery Analysis', category: 'technical', description: 'Delivery vs traded', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'trade-flow-intel', label: 'Trade Flow Intel', category: 'technical', description: 'Smart money flow', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 800 }, data: { type: 'card', cardId: 'vwap-analysis', label: 'VWAP Analysis', category: 'technical', description: 'Institutional levels', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }, { source: '4', target: '5' }],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. PORTFOLIO DRIFT & REBALANCE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'portfolio-drift-rebalance',
    name: 'Portfolio Drift & Rebalance',
    description: 'Monitor if holdings match thesis, check correlations, compare vs ETFs, log decisions, rebalance',
    icon: '⚖️',
    category: 'portfolio',
    tags: ['portfolio', 'drift', 'rebalance', 'correlation', 'etf', 'journal'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'portfolio-leaderboard', label: 'Portfolio Leaderboard', category: 'portfolio', description: 'Current standings', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'portfolio-drift-monitor', label: 'Drift Monitor', category: 'portfolio', description: 'Allocation drift', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'portfolio-correlation', label: 'Correlation Matrix', category: 'portfolio', description: 'Diversification check', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'etf-comparator', label: 'ETF Comparator', category: 'portfolio', description: 'Alternative options', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'trade-journal', label: 'Trade Journal', category: 'portfolio', description: 'Document decision', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 800 }, data: { type: 'card', cardId: 'rebalance-optimizer', label: 'Rebalance Optimizer', category: 'portfolio', description: 'Execute plan', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }, { source: '4', target: '5' }],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. DIVIDEND INCOME ENGINE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'dividend-income-engine',
    name: 'Dividend Income Engine',
    description: 'Project reliable monthly income from dividend stocks + SIPs, filtered for payout consistency',
    icon: '💰',
    category: 'income',
    tags: ['dividend', 'income', 'sip', 'passive', 'cashflow', 'retirement'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'dividend-crystal-ball', label: 'Dividend Forecast', category: 'income', description: 'Future payouts', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'dividend-sip-tracker', label: 'Dividend SIP Tracker', category: 'income', description: 'SIP projections', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'income-stability', label: 'Income Stability', category: 'income', description: 'Payout consistency', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'cash-conversion-cycle', label: 'Cash Conversion', category: 'cashflow', description: 'Cash efficiency', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'cashflow-stability-index', label: 'Cashflow Stability', category: 'risk', description: 'Payout backing', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. FACTOR TILT & ROTATION
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'factor-tilt-rotation',
    name: 'Factor Tilt & Rotation',
    description: 'Build factor-based portfolios (value/momentum/quality) and rotate sectors based on leadership',
    icon: '🧬',
    category: 'value',
    tags: ['factor', 'momentum', 'value', 'rotation', 'quant', 'sector'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'multi-factor-scorecard', label: 'Multi-Factor Score', category: 'value', description: 'Combined factors', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'factor-tilt-mini', label: 'Factor Tilt', category: 'mini', description: 'Factor exposure', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'momentum-heatmap', label: 'Momentum Heatmap', category: 'technical', description: 'Momentum factor', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'sector-rotation-tracker', label: 'Sector Rotation', category: 'macro', description: 'Sector leadership', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'macro-pulse', label: 'Macro Pulse', category: 'macro', description: 'Cycle context', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. SENTIMENT CONTRADICTION PLAY
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'sentiment-contradiction-play',
    name: 'Sentiment Contradiction Play',
    description: 'Find stocks with conflicting signals (FII buying + extreme retail sentiment) - often precede reversals',
    icon: '🎭',
    category: 'technical',
    tags: ['sentiment', 'contrarian', 'fii', 'insider', 'reversal', 'divergence'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'institutional-flows', label: 'Institutional Flows', category: 'macro', description: 'FII/DII activity', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'insider-trades', label: 'Insider Trades', category: 'macro', description: 'Management buying', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'sentiment-zscore-mini', label: 'Sentiment Z-Score', category: 'mini', description: 'Extreme readings', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'sentiment-contradiction', label: 'Sentiment Contradiction', category: 'technical', description: 'Conflicting signals', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'macro-pulse', label: 'Macro Pulse', category: 'macro', description: 'Economic context', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. QUICK RISK & VALUE SNAPSHOT
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'quick-risk-value-snapshot',
    name: 'Quick Risk & Value Snapshot',
    description: '60-second safety check before deeper analysis - bankruptcy risk, Graham cheapness, liquidity health',
    icon: '⚡',
    category: 'risk',
    tags: ['quick', 'safety', 'risk', 'value', 'screening', 'altman', 'graham'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'stock-snapshot', label: 'Stock Snapshot', category: 'overview', description: 'Quick overview', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'altman-graham-mini', label: 'Altman-Graham', category: 'mini', description: 'Safety + value', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'working-capital-health', label: 'Working Capital', category: 'risk', description: 'Liquidity check', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'risk-health-dashboard', label: 'Risk Dashboard', category: 'risk', description: 'Overall risk', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. SEASONAL & CYCLICAL TRADER
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'seasonal-cyclical-trader',
    name: 'Seasonal & Cyclical Trader',
    description: 'Exploit recurring calendar patterns (budget rallies, monsoon plays) with volume confirmation',
    icon: '🗓️',
    category: 'technical',
    tags: ['seasonality', 'cycles', 'calendar', 'budget', 'monsoon', 'patterns'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'macro-pulse', label: 'Macro Pulse', category: 'macro', description: 'Cycle context', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'seasonality-pattern', label: 'Seasonality Pattern', category: 'technical', description: 'Calendar patterns', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'sector-rotation-tracker', label: 'Sector Rotation', category: 'macro', description: 'Sector timing', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'volume-profile', label: 'Volume Profile', category: 'technical', description: 'Volume confirmation', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Candlestick Hero', category: 'technical', description: 'Entry timing', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EFFICIENCY, JOURNAL & PLAYBOOK TEMPLATES
  // ═══════════════════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. OPERATIONAL EFFICIENCY SCREENER
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'operational-efficiency-screener',
    name: 'Operational Efficiency Screener',
    description: 'Identify companies with superior operational metrics - high asset turnover, efficient capital use',
    icon: '⚙️',
    category: 'growth',
    tags: ['efficiency', 'operations', 'turnover', 'capital', 'dupont'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'stock-snapshot', label: 'Stock Snapshot', category: 'overview', description: 'Company overview', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'efficiency-dashboard', label: 'Efficiency Dashboard', category: 'growth', description: 'Operational metrics', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'dupont-analysis', label: 'DuPont Analysis', category: 'value', description: 'ROE breakdown', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'working-capital-health', label: 'Working Capital', category: 'risk', description: 'WC efficiency', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'capital-allocation', label: 'Capital Allocation', category: 'growth', description: 'Capital deployment', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. CUSTOM PLAYBOOK CREATOR
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'custom-playbook-creator',
    name: 'Custom Playbook Creator',
    description: 'Build and save custom trading rules (VWAP bounce with volume confirmation) for one-click reuse',
    icon: '📋',
    category: 'technical',
    tags: ['playbook', 'setup', 'rules', 'patterns', 'custom', 'trading'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'candlestick-hero', label: 'Candlestick Hero', category: 'technical', description: 'Price patterns', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'pattern-matcher', label: 'Pattern Matcher', category: 'technical', description: 'Chart patterns', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'vwap-analysis', label: 'VWAP Analysis', category: 'technical', description: 'Institutional levels', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'trade-flow-intel', label: 'Trade Flow Intel', category: 'technical', description: 'Confirmation signals', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'playbook-builder', label: 'Playbook Builder', category: 'technical', description: 'Save setup', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. TRADE REVIEW & PERFORMANCE JOURNAL
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'trade-review-performance',
    name: 'Trade Review & Performance',
    description: 'Log trades, auto-calculate expectancy/R-multiple, flag violations, track portfolio impact',
    icon: '📔',
    category: 'portfolio',
    tags: ['journal', 'review', 'expectancy', 'performance', 'risk', 'tracking'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'trade-journal', label: 'Trade Journal', category: 'portfolio', description: 'Log trades', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'trade-expectancy', label: 'Trade Expectancy', category: 'risk', description: 'Win rate & R:R', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'drawdown-var', label: 'Drawdown & VaR', category: 'risk', description: 'Risk metrics', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'warning-sentinel-mini', label: 'Warning Sentinel', category: 'mini', description: 'Rule violations', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'portfolio-leaderboard', label: 'Portfolio Impact', category: 'portfolio', description: 'Portfolio effect', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 12. EFFICIENCY + CASHFLOW QUALITY FILTER
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'efficiency-cashflow-filter',
    name: 'Efficiency + Cashflow Filter',
    description: 'Find companies that efficiently generate real cash from operations - avoids accrual traps',
    icon: '💎',
    category: 'cashflow',
    tags: ['efficiency', 'cashflow', 'quality', 'accruals', 'fcf', 'real'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'efficiency-dashboard', label: 'Efficiency Dashboard', category: 'growth', description: 'Operational efficiency', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'sales-profit-cash', label: 'Sales-Profit-Cash', category: 'growth', description: 'Revenue waterfall', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'cash-conversion-cycle', label: 'Cash Conversion Cycle', category: 'cashflow', description: 'Days to cash', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'fcf-health', label: 'FCF Health', category: 'cashflow', description: 'Free cash flow', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'profit-vs-cash-divergence', label: 'Profit vs Cash', category: 'growth', description: 'Accrual traps', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 800 }, data: { type: 'card', cardId: 'cashflow-stability-index', label: 'Cashflow Stability', category: 'risk', description: 'Cash consistency', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }, { source: '4', target: '5' }],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 13. PLAYBOOK PERFORMANCE & FEEDBACK LOOP
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'playbook-performance-feedback',
    name: 'Playbook Performance & Feedback',
    description: 'Execute playbook → Log result → Analyze performance → Get improvement suggestions',
    icon: '🔄',
    category: 'portfolio',
    tags: ['playbook', 'feedback', 'performance', 'optimization', 'learning'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'playbook-builder', label: 'Playbook Builder', category: 'technical', description: 'Execute setup', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'trade-journal', label: 'Trade Journal', category: 'portfolio', description: 'Log result', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'trade-expectancy', label: 'Trade Expectancy', category: 'risk', description: 'Analyze performance', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'warning-sentinel-mini', label: 'Warning Sentinel', category: 'mini', description: 'Flag issues', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'options-interest', label: 'Options Interest', category: 'portfolio', description: 'OI context', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 14. JOURNAL-DRIVEN WEEKLY REVIEW
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'journal-weekly-review',
    name: 'Journal-Driven Weekly Review',
    description: 'Weekly reflection: trade outcomes, company efficiency changes, drift alerts, macro context',
    icon: '📅',
    category: 'portfolio',
    tags: ['journal', 'weekly', 'review', 'reflection', 'discipline', 'ritual'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'trade-journal', label: 'Trade Journal', category: 'portfolio', description: 'Week trades', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'efficiency-dashboard', label: 'Efficiency Dashboard', category: 'growth', description: 'Company changes', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'portfolio-drift-monitor', label: 'Drift Monitor', category: 'portfolio', description: 'Allocation drift', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'risk-health-dashboard', label: 'Risk Dashboard', category: 'risk', description: 'Risk check', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'macro-pulse', label: 'Macro Pulse', category: 'macro', description: 'Week ahead', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 15. EFFICIENCY MOAT + MANAGEMENT COMBO
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'efficiency-moat-management',
    name: 'Efficiency Moat + Management',
    description: 'Screen for operationally excellent companies run by shareholder-friendly management',
    icon: '🏰',
    category: 'value',
    tags: ['moat', 'efficiency', 'management', 'quality', 'compounders', 'insider'],
    nodes: [
      { type: 'card', position: { x: 250, y: 50 }, data: { type: 'card', cardId: 'efficiency-dashboard', label: 'Efficiency Dashboard', category: 'growth', description: 'Operational moat', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 200 }, data: { type: 'card', cardId: 'management-quality', label: 'Management Quality', category: 'growth', description: 'Leadership score', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 350 }, data: { type: 'card', cardId: 'capital-allocation', label: 'Capital Allocation', category: 'growth', description: 'Capital decisions', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 500 }, data: { type: 'card', cardId: 'dupont-analysis', label: 'DuPont Analysis', category: 'value', description: 'ROE quality', symbol: '', params: {} } },
      { type: 'card', position: { x: 250, y: 650 }, data: { type: 'card', cardId: 'insider-trades', label: 'Insider Trades', category: 'macro', description: 'Skin in game', symbol: '', params: {} } },
    ],
    edges: [{ source: '0', target: '1' }, { source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }],
  },
];
export function getTemplateById(id: string): WorkflowTemplate | undefined {
  return WORKFLOW_TEMPLATES.find(t => t.id === id);
}

// Get templates by category
export function getTemplatesByCategory(category: WorkflowTemplate['category']): WorkflowTemplate[] {
  return WORKFLOW_TEMPLATES.filter(t => t.category === category);
}

// Search templates
export function searchTemplates(query: string): WorkflowTemplate[] {
  const lowerQuery = query.toLowerCase();
  return WORKFLOW_TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.includes(lowerQuery))
  );
}

// Get templates by tag
export function getTemplatesByTag(tag: string): WorkflowTemplate[] {
  return WORKFLOW_TEMPLATES.filter(t => t.tags.includes(tag.toLowerCase()));
}

// Get all unique categories
export function getAllCategories(): string[] {
  return [...new Set(WORKFLOW_TEMPLATES.map(t => t.category))];
}

// Get all unique tags
export function getAllTags(): string[] {
  const allTags = WORKFLOW_TEMPLATES.flatMap(t => t.tags);
  return [...new Set(allTags)].sort();
}

// Get template count by category
export function getTemplateCounts(): Record<string, number> {
  return WORKFLOW_TEMPLATES.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
