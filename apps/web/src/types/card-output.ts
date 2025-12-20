// ═══════════════════════════════════════════════════════════════════════════
// CARD OUTPUT SCHEMA - Foundation for Synthesis Engine
// ═══════════════════════════════════════════════════════════════════════════
// Every card implements getOutput() returning this standardized format
// Enables: rule-based synthesis, unified display, LLM integration
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// CORE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type Sentiment = "bullish" | "bearish" | "neutral" | "mixed";
export type Confidence = "high" | "medium" | "low";
export type SignalStrength = 1 | 2 | 3 | 4 | 5; // 1=weak, 5=strong

export type MetricInterpretation = 
  | "excellent" | "good" | "fair" | "poor" | "critical"  // Quality scale
  | "undervalued" | "fairly-valued" | "overvalued"       // Valuation scale
  | "bullish" | "bearish" | "neutral"                     // Directional
  | "safe" | "moderate" | "risky" | "dangerous"          // Risk scale
  | "strong" | "weak" | "improving" | "deteriorating";   // Trend scale

export type InsightType = 
  | "strength"      // Positive factor
  | "weakness"      // Negative factor  
  | "opportunity"   // Potential upside
  | "risk"          // Potential downside
  | "observation"   // Neutral fact
  | "action";       // Suggested next step

export type ChartType = 
  | "line" | "bar" | "area" | "radar" | "gauge" 
  | "pie" | "scatter" | "heatmap" | "candlestick";

// ─────────────────────────────────────────────────────────────────────────────
// METRIC VALUE - Individual data point with context
// ─────────────────────────────────────────────────────────────────────────────

export interface MetricValue {
  name: string;                          // Display name: "P/E Ratio"
  key: string;                           // Lookup key: "pe_ratio" (for MetricTooltip)
  value: number | string | null;         // The actual value
  unit?: string;                         // "x", "%", "₹", "days", etc.
  format?: "number" | "currency" | "percent" | "ratio" | "score";
  interpretation: MetricInterpretation;  // How to read this value
  benchmark?: {                          // Optional comparison
    value: number;
    label: string;                       // "Sector Avg", "5Y Mean", "Industry"
    comparison: "above" | "below" | "at";
  };
  trend?: {                              // Optional historical context
    direction: "up" | "down" | "flat";
    period: string;                      // "vs last quarter", "YoY"
    change?: number;                     // Percent change
  };
  priority: 1 | 2 | 3;                   // 1=primary, 2=secondary, 3=supporting
}

// ─────────────────────────────────────────────────────────────────────────────
// INSIGHT - Interpretive statement about the data
// ─────────────────────────────────────────────────────────────────────────────

export interface Insight {
  type: InsightType;
  text: string;                          // Human-readable insight
  metrics?: string[];                    // Which metrics support this insight
  importance: 1 | 2 | 3;                 // 1=critical, 2=notable, 3=minor
}

// ─────────────────────────────────────────────────────────────────────────────
// CHART CONFIG - For unified visualization
// ─────────────────────────────────────────────────────────────────────────────

export interface ChartConfig {
  type: ChartType;
  title: string;
  data: any[];                           // Chart-specific data format
  xKey?: string;                         // X-axis data key
  yKey?: string | string[];              // Y-axis data key(s)
  colors?: string[];                     // Custom colors
  showLegend?: boolean;
  height?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD OUTPUT - The standardized output every card produces
// ─────────────────────────────────────────────────────────────────────────────

export interface CardOutput {
  // ── Identity ──
  cardId: string;                        // "valuation-summary"
  cardCategory: string;                  // "value"
  symbol: string;                        // "RELIANCE"
  asOf: string;                          // "Dec 10, 2025"
  
  // ── Summary ──
  headline: string;                      // One-line summary: "RELIANCE appears fairly valued with strong fundamentals"
  sentiment: Sentiment;                  // Overall card sentiment
  confidence: Confidence;                // How confident in the assessment
  signalStrength: SignalStrength;        // 1-5 score for quick filtering
  
  // ── Data ──
  keyMetrics: MetricValue[];             // Primary metrics (max 6-8)
  supportingMetrics?: MetricValue[];     // Secondary metrics for deep dive
  
  // ── Analysis ──
  insights: Insight[];                   // Interpretive statements
  
  // ── Visualization ──
  primaryChart?: ChartConfig;            // Main visualization
  secondaryCharts?: ChartConfig[];       // Additional charts
  
  // ── Navigation ──
  suggestedCards?: string[];             // Related cards to explore
  
  // ── Synthesis Helpers ──
  tags: string[];                        // For grouping/filtering: ["value", "pe", "undervalued"]
  scoreContribution?: {                  // For weighted scoring
    category: string;                    // "valuation" | "quality" | "momentum" | etc.
    score: number;                       // -100 to +100
    weight: number;                      // 0-1 (how much this should influence overall)
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS - For building CardOutput
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a MetricValue with sensible defaults
 */
export function createMetric(
  name: string,
  key: string,
  value: number | string | null,
  interpretation: MetricInterpretation,
  options?: Partial<Omit<MetricValue, 'name' | 'key' | 'value' | 'interpretation'>>
): MetricValue {
  return {
    name,
    key,
    value,
    interpretation,
    priority: 2,
    ...options,
  };
}

/**
 * Create an Insight
 */
export function createInsight(
  type: InsightType,
  text: string,
  importance: 1 | 2 | 3 = 2,
  metrics?: string[]
): Insight {
  return { type, text, importance, metrics };
}

/**
 * Determine sentiment from score
 */
export function scoreToSentiment(score: number): Sentiment {
  if (score >= 60) return "bullish";
  if (score >= 40) return "neutral";
  if (score >= 20) return "mixed";
  return "bearish";
}

/**
 * Determine confidence from data completeness
 */
export function dataToConfidence(completeness: number): Confidence {
  if (completeness >= 0.9) return "high";
  if (completeness >= 0.7) return "medium";
  return "low";
}

/**
 * Convert score to signal strength (1-5)
 */
export function scoreToSignal(score: number, max: number = 100): SignalStrength {
  const normalized = (score / max) * 5;
  return Math.max(1, Math.min(5, Math.round(normalized))) as SignalStrength;
}

/**
 * Format metric value for display
 */
export function formatMetricValue(metric: MetricValue): string {
  if (metric.value === null) return "N/A";
  
  const val = metric.value;
  if (typeof val === 'string') return val;
  
  switch (metric.format) {
    case 'currency':
      return `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    case 'percent':
      return `${val.toFixed(2)}%`;
    case 'ratio':
      return `${val.toFixed(2)}x`;
    case 'score':
      return `${val}/${metric.unit || '10'}`;
    default:
      return val.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }
}

/**
 * Get color for interpretation
 */
export function interpretationColor(interp: MetricInterpretation): string {
  const colors: Record<MetricInterpretation, string> = {
    excellent: '#10b981',
    good: '#34d399',
    fair: '#fbbf24',
    poor: '#f87171',
    critical: '#ef4444',
    undervalued: '#10b981',
    'fairly-valued': '#64748b',
    overvalued: '#ef4444',
    bullish: '#10b981',
    bearish: '#ef4444',
    neutral: '#64748b',
    safe: '#10b981',
    moderate: '#fbbf24',
    risky: '#f97316',
    dangerous: '#ef4444',
    strong: '#10b981',
    weak: '#ef4444',
    improving: '#34d399',
    deteriorating: '#f87171',
  };
  return colors[interp] || '#64748b';
}

// ─────────────────────────────────────────────────────────────────────────────
// SYNTHESIS HELPERS - For combining multiple CardOutputs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Aggregate sentiment from multiple cards
 */
export function aggregateSentiment(outputs: CardOutput[]): Sentiment {
  const sentiments = outputs.map(o => o.sentiment);
  const bullish = sentiments.filter(s => s === 'bullish').length;
  const bearish = sentiments.filter(s => s === 'bearish').length;
  const total = sentiments.length;
  
  if (bullish > total * 0.6) return 'bullish';
  if (bearish > total * 0.6) return 'bearish';
  if (bullish > 0 && bearish > 0) return 'mixed';
  return 'neutral';
}

/**
 * Calculate weighted score from multiple cards
 */
export function calculateCompositeScore(outputs: CardOutput[]): number {
  const scored = outputs.filter(o => o.scoreContribution);
  if (scored.length === 0) return 50;
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  for (const output of scored) {
    if (output.scoreContribution) {
      weightedSum += output.scoreContribution.score * output.scoreContribution.weight;
      totalWeight += output.scoreContribution.weight;
    }
  }
  
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 50;
}

/**
 * Collect all insights by type
 */
export function collectInsights(outputs: CardOutput[]): Record<InsightType, Insight[]> {
  const collected: Record<InsightType, Insight[]> = {
    strength: [],
    weakness: [],
    opportunity: [],
    risk: [],
    observation: [],
    action: [],
  };
  
  for (const output of outputs) {
    for (const insight of output.insights) {
      collected[insight.type].push(insight);
    }
  }
  
  // Sort each by importance
  for (const type of Object.keys(collected) as InsightType[]) {
    collected[type].sort((a, b) => a.importance - b.importance);
  }
  
  return collected;
}

/**
 * Get top N metrics across all cards
 */
export function getTopMetrics(outputs: CardOutput[], n: number = 8): MetricValue[] {
  const allMetrics = outputs.flatMap(o => o.keyMetrics);
  return allMetrics
    .sort((a, b) => a.priority - b.priority)
    .slice(0, n);
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD OUTPUT REGISTRY TYPE - For type-safe card output collection
// ─────────────────────────────────────────────────────────────────────────────

export interface CardOutputRegistry {
  'stock-snapshot': CardOutput;
  'valuation-summary': CardOutput;
  'piotroski-score': CardOutput;
  'dcf-valuation': CardOutput;
  'fair-value-forecaster': CardOutput;
  'dupont-analysis': CardOutput;
  'intrinsic-value-range': CardOutput;
  'multi-factor-scorecard': CardOutput;
  'financial-health-dna': CardOutput;
  'growth-summary': CardOutput;
  'earnings-quality': CardOutput;
  'earnings-stability': CardOutput;
  'management-quality': CardOutput;
  'capital-allocation': CardOutput;
  'efficiency-dashboard': CardOutput;
  'sales-profit-cash': CardOutput;
  'profit-vs-cash-divergence': CardOutput;
  // ... (would list all 69 cards)
  [key: string]: CardOutput;
}
