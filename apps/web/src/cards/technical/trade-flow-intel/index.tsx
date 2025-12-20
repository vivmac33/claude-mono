import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  ComposedChart,
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

export interface TradeFlowData {
  symbol: string;
  asOf: string;
  
  // Current session
  avgTradeSize: number; // Turnover / No. of Trades
  avgTradeSizePctile: number; // vs 90 day
  tradeSizeSignal: 'Institutional' | 'Mixed' | 'Retail';
  
  // Volume analysis
  volumeToday: number;
  volumeAvg20D: number;
  volumeRatio: number;
  volumeSignal: 'Surge' | 'High' | 'Normal' | 'Low' | 'Dry';
  
  // Flow estimation
  institutionalFlowPct: number; // Estimated based on trade size
  retailFlowPct: number;
  flowBias: 'Institutional Buying' | 'Institutional Selling' | 'Retail Driven' | 'Mixed';
  
  // Trade distribution
  tradeDistribution: {
    bucket: string; // "₹0-10K", "₹10K-50K", etc.
    percentage: number;
    type: 'Retail' | 'HNI' | 'Institutional';
  }[];
  
  // Historical
  history: {
    date: string;
    avgTradeSize: number;
    volume: number;
    close: number;
    turnover: number;
  }[];
  
  // Signals
  unusualActivity: boolean;
  unusualActivityType?: 'Large Buyer' | 'Large Seller' | 'Block Deal' | 'Bulk Deal';
  
  insights: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getTradeFlowIntelOutput(data: TradeFlowData): CardOutput {
  const { symbol, asOf, avgTradeSize, avgTradeSizePctile, tradeSizeSignal, volumeRatio, volumeSignal, flowBias, institutionalFlowPct, unusualActivity, unusualActivityType, insights: dataInsights } = data;
  
  const isInstitutionalBuying = flowBias === "Institutional Buying";
  const isInstitutionalSelling = flowBias === "Institutional Selling";
  const sentiment = isInstitutionalBuying ? "bullish" : isInstitutionalSelling ? "bearish" : "neutral";
  const signalStrength = tradeSizeSignal === "Institutional" ? 4 : tradeSizeSignal === "Mixed" ? 3 : 2;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Avg Trade Size", "tfi_trade_size", avgTradeSize, 
      tradeSizeSignal === "Institutional" ? "excellent" : "good",
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("Trade Size Percentile", "tfi_size_pctile", avgTradeSizePctile, 
      avgTradeSizePctile > 80 ? "excellent" : avgTradeSizePctile > 50 ? "good" : "fair",
      { format: "percentile", priority: 1 }),
    createMetric("Volume Ratio", "tfi_vol_ratio", volumeRatio, 
      volumeRatio > 2 ? "excellent" : volumeRatio > 1.5 ? "good" : "fair",
      { format: "ratio", priority: 1, unit: "x" }),
    createMetric("Institutional Flow %", "tfi_inst_flow", institutionalFlowPct, 
      institutionalFlowPct > 60 ? "excellent" : institutionalFlowPct > 40 ? "good" : "fair",
      { format: "percent", priority: 1 }),
  ];
  
  const cardInsights: Insight[] = [];
  
  // Flow bias
  if (isInstitutionalBuying) {
    cardInsights.push(createInsight("strength", `Institutional buying detected: ${institutionalFlowPct.toFixed(0)}% institutional flow`, 1, ["tfi_inst_flow"]));
  } else if (isInstitutionalSelling) {
    cardInsights.push(createInsight("weakness", `Institutional selling detected: large trade sizes on downside`, 1, ["tfi_trade_size"]));
  }
  
  // Volume signal
  if (volumeSignal === "Surge") {
    cardInsights.push(createInsight("observation", `Volume surge: ${volumeRatio.toFixed(1)}x average - significant activity`, 2, ["tfi_vol_ratio"]));
  }
  
  // Trade size
  if (tradeSizeSignal === "Institutional") {
    cardInsights.push(createInsight("strength", `Institutional-size trades at ${avgTradeSizePctile}th percentile`, 2, ["tfi_size_pctile"]));
  }
  
  // Unusual activity
  if (unusualActivity && unusualActivityType) {
    cardInsights.push(createInsight("observation", `Unusual activity: ${unusualActivityType}`, 1));
  }
  
  // Data insights
  dataInsights.slice(0, 2).forEach(insight => {
    cardInsights.push(createInsight("observation", insight, 3));
  });
  
  const headline = `${symbol} ${flowBias.toLowerCase()}: ${tradeSizeSignal.toLowerCase()} trade sizes, ${volumeSignal.toLowerCase()} volume`;
  
  return {
    cardId: "trade-flow-intel",
    cardCategory: "technical",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: avgTradeSizePctile > 70 || avgTradeSizePctile < 30 ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights: cardInsights,
    suggestedCards: ["delivery-analysis", "institutional-flows", "options-interest"],
    tags: ["trade-flow", "volume", flowBias.toLowerCase().replace(" ", "-")],
    scoreContribution: {
      category: "momentum",
      score: isInstitutionalBuying ? 75 : isInstitutionalSelling ? 25 : 50,
      weight: 0.10,
    },
  };
}

interface Props {
  data?: TradeFlowData;
  isLoading?: boolean;
  error?: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function FlowMeter({ institutional, retail }: { institutional: number; retail: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-blue-400">Institutional {institutional}%</span>
        <span className="text-amber-400">Retail {retail}%</span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden">
        <div 
          className="bg-blue-500 transition-all"
          style={{ width: `${institutional}%` }}
        />
        <div 
          className="bg-amber-500 transition-all"
          style={{ width: `${retail}%` }}
        />
      </div>
    </div>
  );
}

function VolumeBar({ ratio, signal }: { ratio: number; signal: string }) {
  const width = Math.min(100, ratio * 50); // 2x = 100%
  const colors: Record<string, string> = {
    'Surge': 'bg-emerald-500',
    'High': 'bg-emerald-600',
    'Normal': 'bg-slate-500',
    'Low': 'bg-amber-500',
    'Dry': 'bg-red-500',
  };
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">Volume vs 20D Avg</span>
        <span className={`font-medium ${
          signal === 'Surge' || signal === 'High' ? 'text-emerald-400' :
          signal === 'Low' || signal === 'Dry' ? 'text-red-400' : 'text-slate-300'
        }`}>
          {ratio.toFixed(2)}x ({signal})
        </span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[signal] || colors['Normal']} transition-all`}
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-slate-600">
        <span>0x</span>
        <span>1x</span>
        <span>2x+</span>
      </div>
    </div>
  );
}

function StatBox({ label, value, subtext, highlight }: {
  label: string;
  value: string | number;
  subtext?: string;
  highlight?: 'positive' | 'negative' | 'neutral';
}) {
  const highlightColors = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-slate-300',
  };
  
  return (
    <div className="bg-slate-800/30 rounded-lg p-3 text-center">
      <div className="text-[10px] text-slate-500 uppercase">{label}</div>
      <div className={`text-lg font-semibold mt-1 ${highlight ? highlightColors[highlight] : 'text-slate-100'}`}>
        {value}
      </div>
      {subtext && <div className="text-[10px] text-slate-400 mt-0.5">{subtext}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function TradeFlowIntelligence({ data, isLoading, error }: Props) {
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
        <div className="text-sm text-red-400">Error loading trade flow data</div>
        <div className="text-xs text-red-300 mt-1">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
        <div className="text-sm text-slate-400">No trade flow data available</div>
      </div>
    );
  }

  const biasColors: Record<string, string> = {
    'Institutional Buying': 'bg-emerald-600',
    'Institutional Selling': 'bg-red-600',
    'Retail Driven': 'bg-amber-600',
    'Mixed': 'bg-slate-600',
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/80 overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Trade Flow Intelligence</h3>
            <p className="text-xs text-slate-500">Institutional activity detection • {data.symbol}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${biasColors[data.flowBias]}`}>
            {data.flowBias}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Unusual Activity Alert */}
        {data.unusualActivity && (
          <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <div>
                <div className="text-sm font-medium text-amber-300">Unusual Activity Detected</div>
                <div className="text-xs text-slate-400">{data.unusualActivityType} spotted</div>
              </div>
            </div>
          </div>
        )}

        {/* Key Stats */}
        <div className="grid grid-cols-4 gap-2">
          <StatBox 
            label="Avg Trade Size" 
            value={`₹${(data.avgTradeSize / 1000).toFixed(0)}K`}
            subtext={`${data.avgTradeSizePctile}th percentile`}
            highlight={data.tradeSizeSignal === 'Institutional' ? 'positive' : 'neutral'}
          />
          <StatBox 
            label="Trade Type" 
            value={data.tradeSizeSignal}
            highlight={data.tradeSizeSignal === 'Institutional' ? 'positive' : data.tradeSizeSignal === 'Retail' ? 'negative' : 'neutral'}
          />
          <StatBox 
            label="Today's Volume" 
            value={`${(data.volumeToday / 1e6).toFixed(1)}M`}
            subtext={`Avg: ${(data.volumeAvg20D / 1e6).toFixed(1)}M`}
          />
          <StatBox 
            label="Vol Ratio" 
            value={`${data.volumeRatio.toFixed(2)}x`}
            highlight={data.volumeRatio > 1.5 ? 'positive' : data.volumeRatio < 0.5 ? 'negative' : 'neutral'}
          />
        </div>

        {/* Volume Bar */}
        <VolumeBar ratio={data.volumeRatio} signal={data.volumeSignal} />

        {/* Flow Meter */}
        <div className="bg-slate-800/30 rounded-lg p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Estimated Flow Distribution</div>
          <FlowMeter institutional={data.institutionalFlowPct} retail={data.retailFlowPct} />
        </div>

        {/* Trade Distribution Chart */}
        {data.tradeDistribution.length > 0 && (
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Trade Size Distribution</div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.tradeDistribution} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis 
                    type="category" 
                    dataKey="bucket" 
                    tick={{ fontSize: 9, fill: '#64748b' }} 
                    axisLine={false} 
                    tickLine={false}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                    {data.tradeDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.type === 'Institutional' ? '#3b82f6' :
                          entry.type === 'HNI' ? '#8b5cf6' : '#f59e0b'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2 text-[10px]">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-amber-500" />
                <span className="text-slate-400">Retail</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-purple-500" />
                <span className="text-slate-400">HNI</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-blue-500" />
                <span className="text-slate-400">Institutional</span>
              </div>
            </div>
          </div>
        )}

        {/* Avg Trade Size Trend */}
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Trade Size Trend (30D)</div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.history.slice(-30)} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tradeSizeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 8, fill: '#64748b' }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                  tickFormatter={(v) => v.slice(8)}
                />
                <YAxis 
                  tick={{ fontSize: 9, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v/1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                  formatter={(v: number) => [`₹${(v/1000).toFixed(1)}K`, 'Avg Trade']}
                />
                <Area
                  type="monotone"
                  dataKey="avgTradeSize"
                  stroke="#3b82f6"
                  fill="url(#tradeSizeGradient)"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        {data.insights.length > 0 && (
          <div className="space-y-1">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Intelligence Summary</div>
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
          💡 Large average trade sizes typically indicate institutional participation.
          Rising trade sizes with volume often precede major moves.
        </div>
      </div>
    </div>
  );
}
