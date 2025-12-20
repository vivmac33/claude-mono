// ═══════════════════════════════════════════════════════════════════════════
// QUERY INTENT ANALYZER
// Analyzes natural language queries to determine intent, output type, and pipeline
// ═══════════════════════════════════════════════════════════════════════════

import { Stock, ParsedQuery, ScreenerQuery, resolveFieldName, resolveSectorName } from './queryParser';
import { NumericPipeline, ScoreConfig, CalculateConfig, AggregateFunction } from './numericEngine';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type OutputType = 'list' | 'cards' | 'report';
export type VisualizationType = 
  | 'table' 
  | 'heatmap' 
  | 'line_chart' 
  | 'candlestick' 
  | 'bar_chart'
  | 'sankey' 
  | 'treemap' 
  | 'scatter' 
  | 'radar' 
  | 'gauge'
  | 'pie'
  | 'area';

export type QueryIntent = 
  | 'screen'           // Find stocks matching criteria → LIST
  | 'compare'          // Compare specific stocks → CARDS + visualizations
  | 'analyze'          // Deep dive into stock(s) → CARDS + key data
  | 'rank'             // Rank stocks by metric → LIST with rankings
  | 'sector_analysis'  // Analyze a sector → CARDS + heatmap
  | 'portfolio'        // Portfolio analysis → CARDS + allocations
  | 'trend'            // Historical trends → CARDS + line charts
  | 'alert'            // Set up monitoring → confirmation + watchlist
  | 'explain'          // Understand a concept → REPORT
  | 'summarize'        // Summarize data → REPORT with key insights
  | 'custom';          // Complex multi-step query

export interface IntentAnalysis {
  intent: QueryIntent;
  outputType: OutputType;
  confidence: number;
  symbols: string[];
  sectors: string[];
  metrics: string[];
  timeframe?: string;
  visualizations: VisualizationType[];
  suggestedCards: string[];
  pipeline: PipelineStep[];
  explanation: string;
}

export interface PipelineStep {
  operation: string;
  params: Record<string, any>;
  description: string;
}

export interface OutputConfig {
  type: OutputType;
  visualizations: VisualizationType[];
  cards: string[];
  columns: string[];
  title: string;
  subtitle?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// INTENT PATTERNS
// ─────────────────────────────────────────────────────────────────────────────

const INTENT_PATTERNS: Array<{
  patterns: RegExp[];
  intent: QueryIntent;
  outputType: OutputType;
  visualizations: VisualizationType[];
  cards: string[];
}> = [
  // SCREEN - Find stocks
  {
    patterns: [
      /(?:find|show|list|give me|get|screen|filter)\s+(?:all\s+)?(?:stocks?|companies)/i,
      /(?:stocks?|companies)\s+(?:with|where|having|that have)/i,
      /(?:which|what)\s+(?:stocks?|companies)/i,
      /top\s+\d+\s+(?:stocks?|companies)/i,
      /\b(?:mcap|pe|pb|roe|roa)\s*[><]=?\s*[\d.]/i,
    ],
    intent: 'screen',
    outputType: 'list',
    visualizations: ['table'],
    cards: [],
  },
  
  // COMPARE - Compare stocks
  {
    patterns: [
      /compare\s+.+(?:vs|versus|and|with|to)/i,
      /comparison\s+(?:of|between)/i,
      /(?:how does|how do)\s+.+\s+compare/i,
      /side\s*by\s*side/i,
      /\bvs\.?\b/i,
    ],
    intent: 'compare',
    outputType: 'cards',
    visualizations: ['radar', 'bar_chart', 'table'],
    cards: ['peer-comparison', 'valuation-summary', 'growth-summary'],
  },
  
  // ANALYZE - Deep dive
  {
    patterns: [
      /(?:analyze|analysis|analyse)\s+/i,
      /(?:deep\s*dive|detailed|comprehensive)\s+(?:look|analysis|view)/i,
      /(?:tell me|explain)\s+(?:about|everything)/i,
      /(?:what|how)\s+(?:is|are)\s+.+\s+(?:doing|performing)/i,
    ],
    intent: 'analyze',
    outputType: 'cards',
    visualizations: ['line_chart', 'radar', 'gauge'],
    cards: ['valuation-summary', 'growth-summary', 'risk-health-dashboard', 'candlestick-hero'],
  },
  
  // RANK - Ranking query
  {
    patterns: [
      /(?:rank|ranking|ranked)\s+(?:stocks?|companies)?/i,
      /(?:best|worst|top|bottom)\s+(?:performing|rated)/i,
      /(?:highest|lowest)\s+(?:pe|pb|roe|roa|return|growth)/i,
      /sort(?:ed)?\s+by/i,
    ],
    intent: 'rank',
    outputType: 'list',
    visualizations: ['table', 'bar_chart'],
    cards: ['multi-factor-scorecard'],
  },
  
  // SECTOR - Sector analysis
  {
    patterns: [
      /(?:sector|industry)\s+(?:analysis|breakdown|overview|performance)/i,
      /(?:how is|how are)\s+(?:the\s+)?(?:tech|energy|finance|banking|pharma)\s+sector/i,
      /(?:all|every)\s+(?:stocks?\s+)?in\s+(?:the\s+)?(.+?)\s+sector/i,
    ],
    intent: 'sector_analysis',
    outputType: 'cards',
    visualizations: ['heatmap', 'treemap', 'bar_chart'],
    cards: ['sector-insights', 'momentum-heatmap', 'peer-comparison'],
  },
  
  // PORTFOLIO - Portfolio analysis
  {
    patterns: [
      /(?:my\s+)?portfolio/i,
      /(?:allocation|diversification|rebalance)/i,
      /(?:correlation|exposure)\s+(?:analysis|matrix)/i,
    ],
    intent: 'portfolio',
    outputType: 'cards',
    visualizations: ['pie', 'sankey', 'heatmap'],
    cards: ['portfolio-correlation', 'rebalance-optimizer', 'risk-health-dashboard'],
  },
  
  // TREND - Historical trends
  {
    patterns: [
      /(?:trend|trending|historical)\s+/i,
      /(?:over|in|for)\s+(?:the\s+)?(?:last|past)\s+\d+\s+(?:days?|weeks?|months?|years?)/i,
      /(?:how has|how have)\s+.+\s+(?:performed|changed|moved)/i,
      /price\s+(?:history|action|movement)/i,
    ],
    intent: 'trend',
    outputType: 'cards',
    visualizations: ['line_chart', 'candlestick', 'area'],
    cards: ['candlestick-hero', 'technical-indicators', 'momentum-heatmap'],
  },
  
  // EXPLAIN - Conceptual explanation
  {
    patterns: [
      /(?:what\s+is|what's|explain|define)\s+(?:a\s+)?(?:pe|pb|roe|dcf|piotroski)/i,
      /(?:how\s+does|how\s+do)\s+(?:you\s+)?(?:calculate|compute|measure)/i,
      /(?:meaning|definition)\s+of/i,
    ],
    intent: 'explain',
    outputType: 'report',
    visualizations: [],
    cards: [],
  },
  
  // SUMMARIZE - Summary request
  {
    patterns: [
      /(?:summarize|summary|overview|recap)/i,
      /(?:key|main|important)\s+(?:points|metrics|highlights)/i,
      /(?:quick|brief)\s+(?:look|summary|overview)/i,
    ],
    intent: 'summarize',
    outputType: 'report',
    visualizations: ['gauge', 'radar'],
    cards: ['valuation-summary', 'multi-factor-scorecard'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// VISUALIZATION RECOMMENDATIONS
// ─────────────────────────────────────────────────────────────────────────────

const METRIC_VISUALIZATIONS: Record<string, VisualizationType[]> = {
  // Price/Volume → Candlestick, Line
  'price': ['candlestick', 'line_chart'],
  'volume': ['bar_chart', 'area'],
  'return': ['line_chart', 'bar_chart'],
  
  // Ratios → Radar, Gauge
  'pe': ['gauge', 'bar_chart'],
  'pb': ['gauge', 'bar_chart'],
  'roe': ['gauge', 'radar'],
  'roa': ['gauge', 'radar'],
  
  // Comparisons → Bar, Radar
  'comparison': ['radar', 'bar_chart'],
  'ranking': ['bar_chart', 'table'],
  
  // Distributions → Heatmap, Treemap
  'sector': ['heatmap', 'treemap', 'pie'],
  'allocation': ['pie', 'sankey', 'treemap'],
  
  // Correlations → Heatmap, Scatter
  'correlation': ['heatmap', 'scatter'],
  
  // Trends → Line, Area
  'trend': ['line_chart', 'area'],
  'growth': ['line_chart', 'bar_chart'],
};

// ─────────────────────────────────────────────────────────────────────────────
// CARD RECOMMENDATIONS BY INTENT
// ─────────────────────────────────────────────────────────────────────────────

const INTENT_CARDS: Record<QueryIntent, string[]> = {
  'screen': [],  // List only, no cards
  'compare': ['peer-comparison', 'valuation-summary', 'multi-factor-scorecard'],
  'analyze': ['valuation-summary', 'growth-summary', 'risk-health-dashboard', 'piotroski-score', 'candlestick-hero'],
  'rank': ['multi-factor-scorecard', 'momentum-heatmap'],
  'sector_analysis': ['sector-insights', 'momentum-heatmap', 'peer-comparison'],
  'portfolio': ['portfolio-correlation', 'rebalance-optimizer', 'risk-health-dashboard', 'drawdown-var'],
  'trend': ['candlestick-hero', 'technical-indicators', 'pattern-matcher', 'delivery-analysis'],
  'alert': ['warning-sentinel-mini'],
  'explain': [],  // Report only
  'summarize': ['valuation-summary', 'financial-health-dna'],
  'custom': [],
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ANALYZER
// ─────────────────────────────────────────────────────────────────────────────

export function analyzeIntent(query: string): IntentAnalysis {
  const lower = query.toLowerCase();
  
  // Detect intent
  let intent: QueryIntent = 'custom';
  let outputType: OutputType = 'list';
  let visualizations: VisualizationType[] = ['table'];
  let suggestedCards: string[] = [];
  let confidence = 0;
  
  for (const pattern of INTENT_PATTERNS) {
    for (const regex of pattern.patterns) {
      if (regex.test(lower)) {
        intent = pattern.intent;
        outputType = pattern.outputType;
        visualizations = pattern.visualizations;
        suggestedCards = pattern.cards;
        confidence = 0.8;
        break;
      }
    }
    if (confidence > 0) break;
  }
  
  // Extract symbols
  const symbolMatches = query.match(/\b([A-Z]{2,12})\b/g) || [];
  const symbols = symbolMatches.filter(s => 
    !['AND', 'OR', 'NOT', 'WITH', 'THE', 'FOR', 'ALL'].includes(s)
  );
  
  // Extract sectors
  const sectors: string[] = [];
  const sectorWords = ['tech', 'technology', 'energy', 'pharma', 'healthcare', 'finance', 
                       'banking', 'auto', 'consumer', 'industrial', 'material', 'telecom'];
  for (const word of sectorWords) {
    if (lower.includes(word)) {
      const resolved = resolveSectorName(word);
      if (resolved) sectors.push(resolved);
    }
  }
  
  // Extract metrics
  const metrics: string[] = [];
  const metricPatterns = ['pe', 'pb', 'ps', 'roe', 'roa', 'roce', 'mcap', 'volume', 
                         'return', 'growth', 'dividend', 'debt', 'beta', 'rsi'];
  for (const metric of metricPatterns) {
    if (lower.includes(metric)) {
      const resolved = resolveFieldName(metric);
      if (resolved) metrics.push(resolved);
    }
  }
  
  // Enhance visualizations based on detected metrics
  const enhancedVisualizations = [...visualizations];
  for (const metric of metrics) {
    const metricViz = METRIC_VISUALIZATIONS[metric];
    if (metricViz) {
      for (const viz of metricViz) {
        if (!enhancedVisualizations.includes(viz)) {
          enhancedVisualizations.push(viz);
        }
      }
    }
  }
  
  // Build pipeline steps
  const pipeline = buildPipelineSteps(query, intent, metrics, sectors);
  
  // Generate explanation
  const explanation = generateExplanation(intent, symbols, sectors, metrics, outputType);
  
  // Override output type based on symbol count
  if (symbols.length === 1 && intent !== 'screen' && intent !== 'rank') {
    outputType = 'cards';
    if (!suggestedCards.length) {
      suggestedCards = INTENT_CARDS['analyze'];
    }
  }
  
  if (lower.includes('report') || lower.includes('detailed') || lower.includes('comprehensive')) {
    outputType = 'report';
  }
  
  return {
    intent,
    outputType,
    confidence,
    symbols,
    sectors,
    metrics,
    visualizations: enhancedVisualizations.slice(0, 4),
    suggestedCards: suggestedCards.slice(0, 4),
    pipeline,
    explanation,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PIPELINE BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildPipelineSteps(
  query: string, 
  intent: QueryIntent,
  metrics: string[],
  sectors: string[]
): PipelineStep[] {
  const steps: PipelineStep[] = [];
  const lower = query.toLowerCase();
  
  // Step 1: Load data
  steps.push({
    operation: 'load',
    params: { source: 'stocks' },
    description: 'Load stock database',
  });
  
  // Step 2: Sector filter if specified
  if (sectors.length > 0) {
    steps.push({
      operation: 'filter',
      params: { 
        conditions: sectors.map(s => ({ field: 'sector', operator: 'contains', value: s }))
      },
      description: `Filter by sector: ${sectors.join(', ')}`,
    });
  }
  
  // Step 3: Parse numeric conditions
  const conditionPatterns = [
    /(\w+)\s*([><]=?|=)\s*(\$?[\d.]+[KMBT%]?)/gi,
    /(\w+)\s+(greater|less|above|below)\s+(?:than\s+)?(\$?[\d.]+[KMBT%]?)/gi,
  ];
  
  const conditions: Array<{ field: string; operator: string; value: any }> = [];
  
  for (const pattern of conditionPatterns) {
    let match;
    while ((match = pattern.exec(query)) !== null) {
      const field = resolveFieldName(match[1]);
      if (field) {
        conditions.push({
          field,
          operator: normalizeOp(match[2]),
          value: parseNumericValue(match[3]),
        });
      }
    }
  }
  
  if (conditions.length > 0) {
    steps.push({
      operation: 'filter',
      params: { conditions },
      description: `Apply ${conditions.length} filter conditions`,
    });
  }
  
  // Step 4: Scoring if analyzing or comparing
  if (intent === 'analyze' || intent === 'compare' || intent === 'rank') {
    const scoreFactors = metrics.length > 0 ? metrics : ['pe', 'roe', 'roa', 'debtToEquity'];
    steps.push({
      operation: 'score',
      params: {
        factors: scoreFactors.map(f => ({
          field: f,
          weight: 1,
          higherIsBetter: !['pe', 'pb', 'ps', 'debtToEquity'].includes(f),
        })),
      },
      description: `Calculate composite score from ${scoreFactors.length} factors`,
    });
  }
  
  // Step 5: Ranking
  const rankMatch = lower.match(/(?:rank|sort|order)\s+by\s+(\w+)/i);
  if (rankMatch || intent === 'rank') {
    const rankField = rankMatch ? (resolveFieldName(rankMatch[1]) || '_score') : '_score';
    steps.push({
      operation: 'rank',
      params: { field: rankField, order: 'desc' },
      description: `Rank by ${rankField}`,
    });
  }
  
  // Step 6: Limit
  const limitMatch = lower.match(/(?:top|first|show)\s*(\d+)/i);
  const limitValue = limitMatch ? parseInt(limitMatch[1]) : 20;
  steps.push({
    operation: 'limit',
    params: { n: limitValue },
    description: `Return top ${limitValue} results`,
  });
  
  // Step 7: Aggregation for sector analysis
  if (intent === 'sector_analysis') {
    steps.push({
      operation: 'group',
      params: { field: 'sector', aggregations: [
        { field: 'mcap', fn: 'sum' },
        { field: 'return1y', fn: 'avg' },
        { field: 'pe', fn: 'avg' },
      ]},
      description: 'Aggregate by sector',
    });
  }
  
  return steps;
}

function normalizeOp(op: string): string {
  const lower = op.toLowerCase();
  if (lower === 'greater' || lower === 'above') return '>';
  if (lower === 'less' || lower === 'below') return '<';
  return op;
}

function parseNumericValue(str: string): number {
  const cleaned = str.replace(/[$,%]/g, '').toUpperCase();
  const match = cleaned.match(/^([\d.]+)([KMBT])?$/);
  if (!match) return parseFloat(cleaned);
  
  const num = parseFloat(match[1]);
  const suffix = match[2];
  const multipliers: Record<string, number> = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 };
  return suffix ? num * multipliers[suffix] : num;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPLANATION GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

function generateExplanation(
  intent: QueryIntent,
  symbols: string[],
  sectors: string[],
  metrics: string[],
  outputType: OutputType
): string {
  const parts: string[] = [];
  
  // Intent description
  const intentDescriptions: Record<QueryIntent, string> = {
    'screen': 'Screening stocks based on criteria',
    'compare': 'Comparing stocks side-by-side',
    'analyze': 'Analyzing in depth',
    'rank': 'Ranking stocks by metric',
    'sector_analysis': 'Analyzing sector performance',
    'portfolio': 'Analyzing portfolio composition',
    'trend': 'Examining historical trends',
    'alert': 'Setting up price/metric alert',
    'explain': 'Explaining concept',
    'summarize': 'Generating summary',
    'custom': 'Processing custom query',
  };
  
  parts.push(intentDescriptions[intent]);
  
  if (symbols.length > 0) {
    parts.push(`for ${symbols.join(', ')}`);
  }
  
  if (sectors.length > 0) {
    parts.push(`in ${sectors.join(', ')} sector`);
  }
  
  if (metrics.length > 0) {
    parts.push(`focusing on ${metrics.join(', ')}`);
  }
  
  // Output type
  const outputDescriptions: Record<OutputType, string> = {
    'list': 'Results will be shown as a sortable table',
    'cards': 'Results will include visual cards with key insights',
    'report': 'A detailed report will be generated',
  };
  
  parts.push(`→ ${outputDescriptions[outputType]}`);
  
  return parts.join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// OUTPUT CONFIG BUILDER
// ─────────────────────────────────────────────────────────────────────────────

export function buildOutputConfig(analysis: IntentAnalysis): OutputConfig {
  // Determine columns based on intent and metrics
  const baseColumns = ['symbol', 'name', 'sector', 'price', 'changePct'];
  const metricColumns = analysis.metrics.length > 0 
    ? analysis.metrics 
    : ['pe', 'roe', 'mcap', 'return1y'];
  
  const columns = [...baseColumns, ...metricColumns];
  
  // Build title
  let title = '';
  switch (analysis.intent) {
    case 'screen':
      title = `Stock Screener Results`;
      break;
    case 'compare':
      title = `Comparison: ${analysis.symbols.join(' vs ')}`;
      break;
    case 'analyze':
      title = `Analysis: ${analysis.symbols[0] || 'Stocks'}`;
      break;
    case 'rank':
      title = `Stock Rankings`;
      break;
    case 'sector_analysis':
      title = `${analysis.sectors[0] || 'Sector'} Analysis`;
      break;
    case 'portfolio':
      title = `Portfolio Analysis`;
      break;
    case 'trend':
      title = `Trend Analysis: ${analysis.symbols.join(', ')}`;
      break;
    default:
      title = 'Results';
  }
  
  return {
    type: analysis.outputType,
    visualizations: analysis.visualizations,
    cards: analysis.suggestedCards,
    columns,
    title,
    subtitle: analysis.explanation,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default {
  analyzeIntent,
  buildOutputConfig,
};
