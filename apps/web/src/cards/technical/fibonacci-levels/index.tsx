import React from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import {
  CardOutput,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface PriceDataPoint {
  date: string;
  price: number;
  high: number;
  low: number;
}

interface FibLevel {
  level: number; // e.g., 0.236, 0.382, 0.5, 0.618, 0.786, 1.0, 1.618, 2.618
  price: number;
  type: 'Retracement' | 'Extension';
  status: 'Above' | 'At' | 'Below' | 'Target';
  isKeyLevel: boolean;
}

interface SwingPoint {
  type: 'High' | 'Low';
  price: number;
  date: string;
  significance: 'Major' | 'Minor';
}

export interface FibonacciLevelsData {
  symbol: string;
  asOf: string;
  
  // Detected Swing Points
  swingHigh: number;
  swingHighDate: string;
  swingLow: number;
  swingLowDate: string;
  swingRange: number; // In %
  trendDirection: 'Uptrend' | 'Downtrend';
  
  // Current Price
  currentPrice: number;
  pricePosition: string; // e.g., "Between 38.2% and 50%"
  currentRetracement: number; // Current retracement % from swing
  
  // Retracement Levels
  retracementLevels: FibLevel[];
  
  // Extension Levels (for targets)
  extensionLevels: FibLevel[];
  
  // Key Levels Analysis
  nearestSupport: FibLevel;
  nearestResistance: FibLevel;
  goldenPocket: { low: number; high: number }; // 61.8% - 65% zone
  
  // Confluence Zones (Fib + other S/R)
  confluenceZones: { price: number; factors: string[] }[];
  
  // Trading Implications
  bias: 'Bullish' | 'Bearish' | 'Neutral';
  biasReason: string;
  
  // Entry/Exit Suggestions
  entryZone: { low: number; high: number; reason: string };
  targetZone: { low: number; high: number; reason: string };
  stopLossZone: { price: number; reason: string };
  
  // Retracement Quality
  retracementQuality: 'Shallow' | 'Healthy' | 'Deep' | 'Broken';
  qualityImplication: string;
  
  // Historical Fib Reactions
  historicalReactions: { level: number; reactionCount: number; avgBounce: number }[];
  
  // Chart data
  priceHistory: PriceDataPoint[];
  
  // Insights
  insights: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

export function getFibonacciLevelsOutput(data: FibonacciLevelsData): CardOutput {
  const { symbol, currentPrice, currentRetracement, trendDirection, bias, pricePosition, nearestSupport, nearestResistance, insights: dataInsights } = data;
  
  const sentiment = bias === 'Bullish' ? 'bullish' : bias === 'Bearish' ? 'bearish' : 'neutral';
  const signalStrength = data.retracementQuality === 'Healthy' ? 5 : data.retracementQuality !== 'Broken' ? 4 : 2;
  
  return {
    cardId: "fibonacci-levels",
    symbol,
    generatedAt: new Date().toISOString(),
    
    summary: {
      headline: `${symbol}: ${currentRetracement.toFixed(1)}% retracement in ${trendDirection}`,
      body: `Price ${pricePosition}. Nearest support: ₹${nearestSupport.price.toFixed(2)} (${(nearestSupport.level * 100).toFixed(1)}%), resistance: ₹${nearestResistance.price.toFixed(2)}`,
      sentiment,
      signalStrength,
    },
    
    metrics: [
      createMetric("Swing High", data.swingHigh, { format: "currency" }),
      createMetric("Swing Low", data.swingLow, { format: "currency" }),
      createMetric("Current Retracement", currentRetracement, { format: "percent" }),
      createMetric("38.2% Level", data.retracementLevels.find(l => l.level === 0.382)?.price || 0, { format: "currency" }),
      createMetric("50% Level", data.retracementLevels.find(l => l.level === 0.5)?.price || 0, { format: "currency" }),
      createMetric("61.8% Level", data.retracementLevels.find(l => l.level === 0.618)?.price || 0, { format: "currency" }),
    ],
    
    insights: dataInsights.map((text, i) => createInsight(
      text,
      i === 0 ? "high" : "medium",
      i === 0 ? (sentiment === 'bullish' ? 'positive' : sentiment === 'bearish' ? 'negative' : 'neutral') : 'neutral'
    )),
    
    nextSteps: [
      `Entry zone: ₹${data.entryZone.low.toFixed(2)} - ₹${data.entryZone.high.toFixed(2)} (${data.entryZone.reason})`,
      `Target zone: ₹${data.targetZone.low.toFixed(2)} - ₹${data.targetZone.high.toFixed(2)}`,
      `Stop loss: ₹${data.stopLossZone.price.toFixed(2)} (${data.stopLossZone.reason})`,
      data.goldenPocket ? `Golden Pocket zone: ₹${data.goldenPocket.low.toFixed(2)} - ₹${data.goldenPocket.high.toFixed(2)}` : "",
    ].filter(Boolean),
    
    metadata: {
      dataAsOf: data.asOf,
      confidence: signalStrength >= 4 ? 0.75 : 0.6,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface FibonacciLevelsCardProps {
  data?: FibonacciLevelsData | null;
  isLoading?: boolean;
  error?: string | null;
}

export default function FibonacciLevelsCard({ data, isLoading, error }: FibonacciLevelsCardProps) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  if (isLoading) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 border-l-4 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4" />
        <div className="h-64 bg-slate-800 rounded" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <div className="text-slate-400">{error || 'No data available'}</div>
      </div>
    );
  }

  const {
    symbol,
    asOf,
    swingHigh,
    swingHighDate,
    swingLow,
    swingLowDate,
    swingRange,
    trendDirection,
    currentPrice,
    pricePosition,
    currentRetracement,
    retracementLevels,
    extensionLevels,
    nearestSupport,
    nearestResistance,
    goldenPocket,
    confluenceZones,
    bias,
    biasReason,
    entryZone,
    targetZone,
    stopLossZone,
    retracementQuality,
    qualityImplication,
    historicalReactions,
    priceHistory,
    insights,
  } = data;

  const biasColor = bias === 'Bullish' ? 'emerald' : bias === 'Bearish' ? 'red' : 'slate';
  const trendEmoji = trendDirection === 'Uptrend' ? '📈' : '📉';
  
  // Colors for Fib levels
  const getFibColor = (level: number) => {
    if (level === 0.618 || level === 0.65) return '#f59e0b'; // Golden ratio - amber
    if (level === 0.5) return '#8b5cf6'; // Purple
    if (level === 0.382 || level === 0.236) return '#10b981'; // Green
    if (level === 0.786 || level === 1.0) return '#ef4444'; // Red
    if (level > 1) return '#06b6d4'; // Cyan for extensions
    return '#6366f1'; // Default indigo
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            📐 Fibonacci Levels
            <span className="text-sm font-normal text-slate-400">{trendEmoji} {trendDirection}</span>
          </h3>
          <p className="text-slate-400 text-sm">{symbol} • {asOf}</p>
        </div>
        <div className={`px-4 py-2 rounded-lg bg-${biasColor}-500/20 text-${biasColor}-400`}>
          <span className="font-semibold">{bias}</span>
        </div>
      </div>

      {/* Swing Points */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`rounded-lg p-4 border ${trendDirection === 'Uptrend' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
          <p className={`text-xs font-medium mb-1 ${trendDirection === 'Uptrend' ? 'text-emerald-400' : 'text-red-400'}`}>Swing High</p>
          <p className="text-2xl font-bold text-white">₹{swingHigh.toFixed(2)}</p>
          <p className="text-xs text-slate-400">{swingHighDate}</p>
        </div>
        <div className={`rounded-lg p-4 border ${trendDirection === 'Downtrend' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
          <p className={`text-xs font-medium mb-1 ${trendDirection === 'Downtrend' ? 'text-emerald-400' : 'text-red-400'}`}>Swing Low</p>
          <p className="text-2xl font-bold text-white">₹{swingLow.toFixed(2)}</p>
          <p className="text-xs text-slate-400">{swingLowDate}</p>
        </div>
        <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/30">
          <p className="text-indigo-400 text-xs font-medium mb-1">Current</p>
          <p className="text-2xl font-bold text-white">₹{currentPrice.toFixed(2)}</p>
          <p className="text-xs text-cyan-400">{currentRetracement.toFixed(1)}% retraced</p>
        </div>
      </div>

      {/* Fibonacci Chart */}
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Fibonacci Retracement Levels</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={priceHistory} margin={{ top: 10, right: 60, left: 0, bottom: 10 }}>
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#f8fafc' }}
              />
              
              {/* Golden Pocket Zone */}
              {goldenPocket && (
                <ReferenceArea 
                  y1={goldenPocket.low} 
                  y2={goldenPocket.high} 
                  fill="#f59e0b" 
                  fillOpacity={0.15}
                  label={{ value: 'Golden Pocket', fill: '#f59e0b', fontSize: 9 }}
                />
              )}
              
              {/* Fibonacci Levels */}
              {retracementLevels.map((fib, i) => (
                <ReferenceLine 
                  key={`ret-${i}`}
                  y={fib.price} 
                  stroke={getFibColor(fib.level)} 
                  strokeWidth={fib.isKeyLevel ? 2 : 1}
                  strokeDasharray={fib.isKeyLevel ? "0" : "5 5"}
                  label={{ 
                    value: `${(fib.level * 100).toFixed(1)}%`, 
                    fill: getFibColor(fib.level), 
                    fontSize: 9,
                    position: 'right'
                  }}
                />
              ))}
              
              {/* Current Price Line */}
              <ReferenceLine y={currentPrice} stroke="#22d3ee" strokeWidth={2} label={{ value: 'CMP', fill: '#22d3ee', fontSize: 10 }} />
              
              {/* Price Line */}
              <Line type="monotone" dataKey="price" stroke="#f8fafc" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Retracement Levels Table */}
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Retracement Levels</h4>
        <div className="grid grid-cols-6 gap-2">
          {retracementLevels.filter(l => l.type === 'Retracement').map((fib, i) => (
            <div 
              key={i} 
              className={`rounded-lg p-2 text-center border ${
                fib.status === 'At' ? 'bg-cyan-500/20 border-cyan-500' :
                fib.isKeyLevel ? 'bg-amber-500/10 border-amber-500/50' :
                'bg-slate-700/50 border-slate-600'
              }`}
            >
              <p className="text-xs font-medium mb-1" style={{ color: getFibColor(fib.level) }}>
                {(fib.level * 100).toFixed(1)}%
              </p>
              <p className="text-sm font-semibold text-white">₹{fib.price.toFixed(2)}</p>
              <p className="text-xs text-slate-400">{fib.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Extension Levels (for targets) */}
      {extensionLevels.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Extension Levels (Targets)</h4>
          <div className="grid grid-cols-4 gap-2">
            {extensionLevels.slice(0, 4).map((fib, i) => (
              <div key={i} className="bg-cyan-500/10 rounded-lg p-2 text-center border border-cyan-500/30">
                <p className="text-cyan-400 text-xs font-medium mb-1">
                  {(fib.level * 100).toFixed(1)}%
                </p>
                <p className="text-sm font-semibold text-white">₹{fib.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Analysis */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Retracement Quality */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Retracement Quality</h4>
          <div className={`text-2xl font-bold mb-2 ${
            retracementQuality === 'Healthy' ? 'text-emerald-400' :
            retracementQuality === 'Shallow' ? 'text-amber-400' :
            retracementQuality === 'Deep' ? 'text-orange-400' :
            'text-red-400'
          }`}>
            {retracementQuality}
          </div>
          <p className="text-xs text-slate-400">{qualityImplication}</p>
          
          {/* Visual indicator */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Shallow</span>
              <span>Healthy</span>
              <span>Deep</span>
              <span>Broken</span>
            </div>
            <div className="w-full h-2 bg-gradient-to-r from-amber-500 via-emerald-500 via-orange-500 to-red-500 rounded-full relative">
              <div 
                className="absolute w-3 h-3 bg-white rounded-full -top-0.5 transform -translate-x-1/2"
                style={{ 
                  left: `${
                    retracementQuality === 'Shallow' ? '12.5%' :
                    retracementQuality === 'Healthy' ? '37.5%' :
                    retracementQuality === 'Deep' ? '62.5%' :
                    '87.5%'
                  }` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Nearest Levels */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Nearest Levels</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Support</span>
              <div className="text-right">
                <span className="text-emerald-400 font-semibold">₹{nearestSupport.price.toFixed(2)}</span>
                <span className="text-xs text-slate-400 ml-2">({(nearestSupport.level * 100).toFixed(1)}%)</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Resistance</span>
              <div className="text-right">
                <span className="text-red-400 font-semibold">₹{nearestResistance.price.toFixed(2)}</span>
                <span className="text-xs text-slate-400 ml-2">({(nearestResistance.level * 100).toFixed(1)}%)</span>
              </div>
            </div>
            {goldenPocket && (
              <div className="flex justify-between items-center">
                <span className="text-amber-400">Golden Pocket</span>
                <span className="text-white font-semibold">₹{goldenPocket.low.toFixed(2)} - ₹{goldenPocket.high.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trade Setup */}
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Trade Setup</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/30">
            <p className="text-emerald-400 text-xs font-medium mb-1">Entry Zone</p>
            <p className="text-white font-semibold">₹{entryZone.low.toFixed(2)} - ₹{entryZone.high.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-1">{entryZone.reason}</p>
          </div>
          <div className="bg-indigo-500/10 rounded-lg p-3 border border-indigo-500/30">
            <p className="text-indigo-400 text-xs font-medium mb-1">Target Zone</p>
            <p className="text-white font-semibold">₹{targetZone.low.toFixed(2)} - ₹{targetZone.high.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-1">{targetZone.reason}</p>
          </div>
          <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
            <p className="text-red-400 text-xs font-medium mb-1">Stop Loss</p>
            <p className="text-white font-semibold">₹{stopLossZone.price.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-1">{stopLossZone.reason}</p>
          </div>
        </div>
      </div>

      {/* Confluence Zones */}
      {confluenceZones.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3">🎯 Confluence Zones</h4>
          <div className="space-y-2">
            {confluenceZones.slice(0, 3).map((zone, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                <span className="text-white font-semibold">₹{zone.price.toFixed(2)}</span>
                <div className="flex gap-2">
                  {zone.factors.map((factor, j) => (
                    <span key={j} className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historical Reactions */}
      {historicalReactions.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Historical Fib Reactions</h4>
          <div className="grid grid-cols-3 gap-3">
            {historicalReactions.slice(0, 3).map((reaction, i) => (
              <div key={i} className="bg-slate-700/50 rounded-lg p-3 text-center">
                <p className="text-amber-400 font-semibold">{(reaction.level * 100).toFixed(1)}%</p>
                <p className="text-xs text-slate-400">{reaction.reactionCount} reactions</p>
                <p className="text-xs text-emerald-400">Avg bounce: {reaction.avgBounce.toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-slate-800/30 rounded-lg p-4">
        <h4 className="text-sm font-medium text-slate-300 mb-3">💡 Key Insights</h4>
        <div className="space-y-2">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-indigo-400 mt-0.5">•</span>
              <span className="text-slate-300">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bias Reasoning */}
      <div className={`mt-6 p-4 bg-${biasColor}-500/10 border border-${biasColor}-500/30 rounded-lg`}>
        <h4 className={`text-sm font-medium text-${biasColor}-400 mb-2`}>📊 Trading Implication</h4>
        <p className="text-slate-300 text-sm">{biasReason}</p>
      </div>
    </div>
  );
}
