import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from 'recharts';
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface DeliveryDataPoint {
  date: string;
  close: number;
  volume: number;
  deliveryQty: number;
  deliveryPct: number;
  avgTradeSize: number;
}

export interface DeliveryAnalysisData {
  symbol: string;
  asOf: string;
  
  // Current metrics
  currentDeliveryPct: number;
  avgDeliveryPct30D: number;
  deliveryPctile: number; // Percentile vs 90 day history
  
  // Trend analysis
  deliveryTrend: 'Rising' | 'Falling' | 'Stable';
  deliveryTrendStrength: number; // 0-100
  
  // Smart money signals
  accumulationScore: number; // 0-100 (high delivery + price up)
  distributionScore: number; // 0-100 (high delivery + price down)
  smartMoneySignal: 'Strong Accumulation' | 'Accumulation' | 'Neutral' | 'Distribution' | 'Strong Distribution';
  
  // Divergence detection
  priceTrend: 'Up' | 'Down' | 'Flat';
  deliveryDivergence: 'Bullish' | 'Bearish' | 'None';
  divergenceStrength: number;
  
  // Volume quality
  volumeQuality: 'High' | 'Medium' | 'Low';
  avgTradeSize: number;
  tradeSizeTrend: 'Increasing' | 'Decreasing' | 'Stable';
  
  // Historical data
  history: DeliveryDataPoint[];
  
  // Key insights
  insights: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getDeliveryAnalysisOutput(data: DeliveryAnalysisData): CardOutput {
  const { symbol, asOf, currentDeliveryPct, avgDeliveryPct30D, deliveryPctile, smartMoneySignal, accumulationScore, distributionScore, deliveryDivergence, volumeQuality, insights: dataInsights } = data;
  
  const isAccumulating = smartMoneySignal.includes("Accumulation");
  const isDistributing = smartMoneySignal.includes("Distribution");
  const sentiment = isAccumulating ? "bullish" : isDistributing ? "bearish" : "neutral";
  const signalStrength = smartMoneySignal.includes("Strong") ? 5 : isAccumulating || isDistributing ? 4 : 3;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Current Delivery %", "da_delivery_pct", currentDeliveryPct, 
      currentDeliveryPct > 60 ? "excellent" : currentDeliveryPct > 40 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("30D Avg Delivery %", "da_avg_delivery", avgDeliveryPct30D, "neutral", 
      { format: "percent", priority: 2 }),
    createMetric("Delivery Percentile", "da_percentile", deliveryPctile, 
      deliveryPctile > 80 ? "excellent" : deliveryPctile > 50 ? "good" : "fair",
      { format: "percentile", priority: 1 }),
    createMetric("Accumulation Score", "da_accum", accumulationScore, 
      accumulationScore > 70 ? "excellent" : accumulationScore > 50 ? "good" : "neutral",
      { format: "score", priority: 1 }),
    createMetric("Distribution Score", "da_distrib", distributionScore, 
      distributionScore < 30 ? "good" : distributionScore < 50 ? "neutral" : "poor",
      { format: "score", priority: 2 }),
  ];
  
  const cardInsights: Insight[] = [];
  
  // Smart money signal
  if (smartMoneySignal === "Strong Accumulation") {
    cardInsights.push(createInsight("strength", `Strong accumulation signal: ${currentDeliveryPct.toFixed(1)}% delivery at ${deliveryPctile}th percentile`, 1, ["da_delivery_pct", "da_percentile"]));
  } else if (smartMoneySignal === "Strong Distribution") {
    cardInsights.push(createInsight("weakness", `Strong distribution signal: high delivery with price weakness`, 1, ["da_distrib"]));
  } else if (smartMoneySignal === "Accumulation") {
    cardInsights.push(createInsight("strength", `Accumulation pattern: genuine buying interest (${accumulationScore}/100)`, 2, ["da_accum"]));
  }
  
  // Divergence
  if (deliveryDivergence === "Bullish") {
    cardInsights.push(createInsight("opportunity", "Bullish delivery divergence: accumulation despite price weakness", 2));
  } else if (deliveryDivergence === "Bearish") {
    cardInsights.push(createInsight("risk", "Bearish delivery divergence: distribution despite price strength", 2));
  }
  
  // Volume quality
  if (volumeQuality === "High") {
    cardInsights.push(createInsight("strength", "High volume quality - institutional-size transactions", 3));
  }
  
  // Add data insights
  dataInsights.slice(0, 2).forEach(insight => {
    cardInsights.push(createInsight("observation", insight, 3));
  });
  
  const headline = `${symbol} ${smartMoneySignal.toLowerCase()}: ${currentDeliveryPct.toFixed(1)}% delivery (${deliveryPctile}th percentile)`;
  
  return {
    cardId: "delivery-analysis",
    cardCategory: "technical",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: deliveryPctile > 70 || deliveryPctile < 30 ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights: cardInsights,
    suggestedCards: ["trade-flow-intel", "institutional-flows", "shareholding-pattern"],
    tags: ["delivery", "volume", smartMoneySignal.toLowerCase().replace(" ", "-")],
    scoreContribution: {
      category: "momentum",
      score: isAccumulating ? accumulationScore : isDistributing ? 100 - distributionScore : 50,
      weight: 0.15,
    },
  };
}

interface Props {
  data?: DeliveryAnalysisData;
  isLoading?: boolean;
  error?: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function SignalBadge({ signal }: { signal: string }) {
  const colors: Record<string, string> = {
    'Strong Accumulation': 'bg-emerald-600 text-white',
    'Accumulation': 'bg-emerald-900/50 text-emerald-300',
    'Neutral': 'bg-slate-700 text-slate-300',
    'Distribution': 'bg-red-900/50 text-red-300',
    'Strong Distribution': 'bg-red-600 text-white',
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[signal] || colors['Neutral']}`}>
      {signal}
    </span>
  );
}

function MeterGauge({ 
  value, 
  label, 
  leftLabel = 'Distribution', 
  rightLabel = 'Accumulation' 
}: { 
  value: number; 
  label: string;
  leftLabel?: string;
  rightLabel?: string;
}) {
  // value: 0 = full left, 50 = center, 100 = full right
  const position = Math.max(0, Math.min(100, value));
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>{leftLabel}</span>
        <span className="text-slate-400">{label}</span>
        <span>{rightLabel}</span>
      </div>
      <div className="relative h-2 bg-gradient-to-r from-red-600 via-slate-600 to-emerald-600 rounded-full">
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-slate-900 shadow-lg"
          style={{ left: `calc(${position}% - 6px)` }}
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value, subValue, trend }: { 
  label: string; 
  value: string | number; 
  subValue?: string;
  trend?: 'up' | 'down' | 'flat';
}) {
  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-red-400',
    flat: 'text-slate-400',
  };
  
  return (
    <div className="bg-slate-800/30 rounded-lg p-3">
      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</div>
      <div className="text-lg font-semibold text-slate-100 mt-1">{value}</div>
      {subValue && (
        <div className={`text-xs mt-0.5 ${trend ? trendColors[trend] : 'text-slate-400'}`}>
          {trend === 'up' && '↑ '}{trend === 'down' && '↓ '}{subValue}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function DeliveryAnalysisPro({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 animate-pulse">
        <div className="h-5 bg-slate-700 rounded w-1/3 mb-4" />
        <div className="h-48 bg-slate-800/50 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-700/50 bg-red-900/20 p-4">
        <div className="text-sm text-red-400">Error loading delivery analysis</div>
        <div className="text-xs text-red-300 mt-1">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
        <div className="text-sm text-slate-400">No delivery data available</div>
      </div>
    );
  }

  // Calculate accumulation meter position (0-100 scale, 50 = neutral)
  const meterPosition = 50 + ((data.accumulationScore - data.distributionScore) / 2);

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/80 overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Delivery Analysis Pro</h3>
            <p className="text-xs text-slate-500">Smart money flow detection • {data.symbol}</p>
          </div>
          <SignalBadge signal={data.smartMoneySignal} />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Smart Money Meter */}
        <div className="bg-slate-800/30 rounded-lg p-4">
          <MeterGauge 
            value={meterPosition} 
            label="Smart Money Flow"
          />
          <div className="flex justify-center gap-6 mt-3 text-xs">
            <div className="text-center">
              <div className="text-red-400 font-semibold">{data.distributionScore}</div>
              <div className="text-slate-500">Distribution</div>
            </div>
            <div className="text-center">
              <div className="text-emerald-400 font-semibold">{data.accumulationScore}</div>
              <div className="text-slate-500">Accumulation</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-2">
          <MetricCard 
            label="Delivery %" 
            value={`${data.currentDeliveryPct.toFixed(1)}%`}
            subValue={`30D avg: ${data.avgDeliveryPct30D.toFixed(1)}%`}
            trend={data.currentDeliveryPct > data.avgDeliveryPct30D ? 'up' : 'down'}
          />
          <MetricCard 
            label="Percentile" 
            value={`${Math.round(data.deliveryPctile)}th`}
            subValue="vs 90 day history"
          />
          <MetricCard 
            label="Del. Trend" 
            value={data.deliveryTrend}
            subValue={`Strength: ${data.deliveryTrendStrength.toFixed(1)}%`}
            trend={data.deliveryTrend === 'Rising' ? 'up' : data.deliveryTrend === 'Falling' ? 'down' : 'flat'}
          />
          <MetricCard 
            label="Avg Trade" 
            value={`₹${(data.avgTradeSize / 1000).toFixed(0)}K`}
            subValue={data.tradeSizeTrend}
            trend={data.tradeSizeTrend === 'Increasing' ? 'up' : data.tradeSizeTrend === 'Decreasing' ? 'down' : 'flat'}
          />
        </div>

        {/* Divergence Alert */}
        {data.deliveryDivergence !== 'None' && (
          <div className={`rounded-lg p-3 ${
            data.deliveryDivergence === 'Bullish' 
              ? 'bg-emerald-900/30 border border-emerald-700/50' 
              : 'bg-red-900/30 border border-red-700/50'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{data.deliveryDivergence === 'Bullish' ? '📈' : '📉'}</span>
              <div>
                <div className={`text-sm font-medium ${
                  data.deliveryDivergence === 'Bullish' ? 'text-emerald-300' : 'text-red-300'
                }`}>
                  {data.deliveryDivergence} Divergence Detected
                </div>
                <div className="text-xs text-slate-400">
                  Price {data.priceTrend.toLowerCase()} but delivery {data.deliveryTrend.toLowerCase()} • 
                  Strength: {data.divergenceStrength.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.history.slice(-30)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="deliveryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 9, fill: '#64748b' }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis 
                yAxisId="price"
                orientation="right"
                tick={{ fontSize: 9, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <YAxis 
                yAxisId="delivery"
                orientation="left"
                tick={{ fontSize: 9, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontSize: '11px'
                }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <ReferenceLine 
                yAxisId="delivery" 
                y={data.avgDeliveryPct30D} 
                stroke="#64748b" 
                strokeDasharray="3 3" 
                label={{ value: 'Avg', fontSize: 9, fill: '#64748b' }}
              />
              <Area
                yAxisId="delivery"
                type="monotone"
                dataKey="deliveryPct"
                stroke="#10b981"
                fill="url(#deliveryGradient)"
                strokeWidth={2}
              />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="close"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend */}
        <div className="flex justify-center gap-6 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-blue-500" />
            <span className="text-slate-400">Price</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-500/30 border border-emerald-500 rounded" />
            <span className="text-slate-400">Delivery %</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 border-t border-dashed border-slate-500" />
            <span className="text-slate-400">30D Avg</span>
          </div>
        </div>

        {/* Key Insights */}
        {data.insights.length > 0 && (
          <div className="space-y-1">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Key Insights</div>
            {data.insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="text-blue-400">•</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-slate-800/30 border-t border-slate-800">
        <div className="text-[10px] text-slate-500">
          💡 High delivery % with rising prices indicates institutional accumulation.
          Divergences often precede major price moves.
        </div>
      </div>
    </div>
  );
}
