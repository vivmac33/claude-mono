import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
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

interface ORBDataPoint {
  time: string;
  price: number;
  volume: number;
  isORBPeriod: boolean;
}

interface GapAnalysis {
  gapType: 'Gap Up' | 'Gap Down' | 'No Gap' | 'Full Gap Up' | 'Full Gap Down';
  gapSize: number; // In %
  gapFilled: boolean;
  gapFillTime?: string;
  previousClose: number;
  todayOpen: number;
}

export interface ORBAnalysisData {
  symbol: string;
  asOf: string;
  
  // Opening Range (user selectable: 5, 15, 30 min)
  orbTimeframe: '5min' | '15min' | '30min';
  orbHigh: number;
  orbLow: number;
  orbRange: number; // In %
  orbMidpoint: number;
  
  // Current Status
  currentPrice: number;
  breakoutStatus: 'Above ORB High' | 'Below ORB Low' | 'Inside ORB' | 'Testing High' | 'Testing Low';
  breakoutTime?: string;
  breakoutStrength: number; // 0-100 (based on volume, momentum)
  
  // Breakout Analysis
  breakoutDirection: 'Bullish' | 'Bearish' | 'None';
  breakoutConfirmed: boolean;
  confirmationFactors: string[];
  
  // False Breakout Detection
  falseBreakoutRisk: 'High' | 'Medium' | 'Low';
  falseBreakoutReasons: string[];
  
  // Gap Analysis
  gap: GapAnalysis;
  
  // Pre-market Levels
  preMarketHigh: number;
  preMarketLow: number;
  previousDayHigh: number;
  previousDayLow: number;
  previousClose: number;
  
  // Volume Analysis
  orbVolume: number;
  avgVolume: number;
  volumeRatio: number; // ORB volume vs avg
  
  // Trading Signals
  signal: 'Long Breakout' | 'Short Breakout' | 'Wait for Breakout' | 'Fade the Move' | 'No Trade';
  signalReason: string;
  
  // Targets & Stops
  longEntry: number;
  longTarget1: number;
  longTarget2: number;
  longStop: number;
  shortEntry: number;
  shortTarget1: number;
  shortTarget2: number;
  shortStop: number;
  
  // Risk/Reward
  longRR: number;
  shortRR: number;
  
  // Session Context
  sessionType: 'Trend Day' | 'Range Day' | 'Reversal Day' | 'Undetermined';
  sessionBias: 'Bullish' | 'Bearish' | 'Neutral';
  
  // Historical ORB Stats
  orbBreakoutSuccessRate: number; // Historical success %
  avgBreakoutMove: number; // Avg move after breakout in %
  
  // Chart data
  history: ORBDataPoint[];
  
  // Insights
  insights: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getORBAnalysisOutput(data: ORBAnalysisData): CardOutput {
  const { symbol, orbHigh, orbLow, breakoutStatus, signal, gap, orbTimeframe, insights: dataInsights } = data;
  
  const sentiment = signal.includes('Long') ? 'bullish' : signal.includes('Short') ? 'bearish' : 'neutral';
  const signalStrength = data.breakoutConfirmed ? 5 : data.breakoutDirection !== 'None' ? 4 : 3;
  
  return {
    cardId: "orb-analysis",
    symbol,
    generatedAt: new Date().toISOString(),
    
    summary: {
      headline: `${symbol}: ${breakoutStatus} (${orbTimeframe} ORB)`,
      body: `ORB Range: ₹${orbLow.toFixed(2)} - ₹${orbHigh.toFixed(2)}. ${gap.gapType !== 'No Gap' ? `${gap.gapType} ${gap.gapSize.toFixed(2)}%.` : ''} ${data.signalReason}`,
      sentiment,
      signalStrength,
    },
    
    metrics: [
      createMetric("ORB High", orbHigh, { format: "currency" }),
      createMetric("ORB Low", orbLow, { format: "currency" }),
      createMetric("ORB Range", data.orbRange, { format: "percent" }),
      createMetric("Gap Size", gap.gapSize, { format: "percent" }),
      createMetric("Breakout Strength", data.breakoutStrength, { format: "number", thresholds: { good: 70, bad: 30 } }),
      createMetric("Volume Ratio", data.volumeRatio, { format: "ratio" }),
    ],
    
    insights: dataInsights.map((text, i) => createInsight(
      text,
      i === 0 ? "high" : "medium",
      i === 0 ? (sentiment === 'bullish' ? 'positive' : sentiment === 'bearish' ? 'negative' : 'neutral') : 'neutral'
    )),
    
    nextSteps: [
      breakoutStatus === 'Inside ORB' ? `Wait for break of ₹${orbHigh.toFixed(2)} or ₹${orbLow.toFixed(2)}` : "",
      signal === 'Long Breakout' ? `Long entry: ₹${data.longEntry.toFixed(2)}, Target: ₹${data.longTarget1.toFixed(2)}, Stop: ₹${data.longStop.toFixed(2)}` : "",
      signal === 'Short Breakout' ? `Short entry: ₹${data.shortEntry.toFixed(2)}, Target: ₹${data.shortTarget1.toFixed(2)}, Stop: ₹${data.shortStop.toFixed(2)}` : "",
      data.falseBreakoutRisk === 'High' ? "⚠️ High false breakout risk - wait for confirmation" : "",
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

interface ORBAnalysisCardProps {
  data?: ORBAnalysisData | null;
  isLoading?: boolean;
  error?: string | null;
}

export default function ORBAnalysisCard({ data, isLoading, error }: ORBAnalysisCardProps) {
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
    orbTimeframe,
    orbHigh,
    orbLow,
    orbRange,
    orbMidpoint,
    currentPrice,
    breakoutStatus,
    breakoutTime,
    breakoutStrength,
    breakoutDirection,
    breakoutConfirmed,
    confirmationFactors,
    falseBreakoutRisk,
    falseBreakoutReasons,
    gap,
    preMarketHigh,
    preMarketLow,
    previousDayHigh,
    previousDayLow,
    previousClose,
    orbVolume,
    avgVolume,
    volumeRatio,
    signal,
    signalReason,
    longEntry,
    longTarget1,
    longTarget2,
    longStop,
    shortEntry,
    shortTarget1,
    shortTarget2,
    shortStop,
    longRR,
    shortRR,
    sessionType,
    sessionBias,
    orbBreakoutSuccessRate,
    avgBreakoutMove,
    history,
    insights,
  } = data;

  const statusColor = 
    breakoutStatus.includes('Above') ? 'emerald' :
    breakoutStatus.includes('Below') ? 'red' :
    breakoutStatus.includes('Testing') ? 'amber' :
    'slate';

  const gapColor = gap.gapType.includes('Up') ? 'emerald' : gap.gapType.includes('Down') ? 'red' : 'slate';

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🎯 Opening Range Breakout
            <span className="text-sm font-normal text-slate-400 bg-slate-700 px-2 py-0.5 rounded">
              {orbTimeframe}
            </span>
          </h3>
          <p className="text-slate-400 text-sm">{symbol} • {asOf}</p>
        </div>
        <div className={`px-4 py-2 rounded-lg bg-${statusColor}-500/20 text-${statusColor}-400`}>
          <span className="font-semibold">{breakoutStatus}</span>
        </div>
      </div>

      {/* ORB Range Visualization */}
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-slate-300 mb-3">ORB Range & Price Action</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="orbZone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#f8fafc' }}
              />
              
              {/* ORB Zone */}
              <ReferenceArea y1={orbLow} y2={orbHigh} fill="url(#orbZone)" fillOpacity={0.6} />
              
              {/* Key Levels */}
              <ReferenceLine y={orbHigh} stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" label={{ value: 'ORB High', fill: '#10b981', fontSize: 10 }} />
              <ReferenceLine y={orbLow} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" label={{ value: 'ORB Low', fill: '#ef4444', fontSize: 10 }} />
              <ReferenceLine y={orbMidpoint} stroke="#6366f1" strokeWidth={1} strokeDasharray="3 3" label={{ value: 'Mid', fill: '#6366f1', fontSize: 9 }} />
              <ReferenceLine y={previousClose} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" label={{ value: 'PDC', fill: '#94a3b8', fontSize: 9 }} />
              
              {/* Volume bars */}
              <Bar dataKey="volume" fill="#475569" opacity={0.5} />
              
              {/* Price line */}
              <Line type="monotone" dataKey="price" stroke="#22d3ee" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ORB Stats & Gap */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/30">
          <p className="text-emerald-400 text-xs font-medium mb-1">ORB High</p>
          <p className="text-xl font-bold text-white">₹{orbHigh.toFixed(2)}</p>
        </div>
        <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
          <p className="text-red-400 text-xs font-medium mb-1">ORB Low</p>
          <p className="text-xl font-bold text-white">₹{orbLow.toFixed(2)}</p>
        </div>
        <div className="bg-indigo-500/10 rounded-lg p-3 border border-indigo-500/30">
          <p className="text-indigo-400 text-xs font-medium mb-1">ORB Range</p>
          <p className="text-xl font-bold text-white">{orbRange.toFixed(2)}%</p>
          <p className="text-xs text-slate-400">₹{(orbHigh - orbLow).toFixed(2)}</p>
        </div>
        <div className={`bg-${gapColor}-500/10 rounded-lg p-3 border border-${gapColor}-500/30`}>
          <p className={`text-${gapColor}-400 text-xs font-medium mb-1`}>{gap.gapType}</p>
          <p className="text-xl font-bold text-white">{gap.gapSize > 0 ? '+' : ''}{gap.gapSize.toFixed(2)}%</p>
          <p className="text-xs text-slate-400">{gap.gapFilled ? '✓ Filled' : 'Unfilled'}</p>
        </div>
      </div>

      {/* Breakout Analysis */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Breakout Status */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Breakout Analysis</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Direction</span>
              <span className={`font-semibold ${
                breakoutDirection === 'Bullish' ? 'text-emerald-400' :
                breakoutDirection === 'Bearish' ? 'text-red-400' :
                'text-slate-400'
              }`}>
                {breakoutDirection}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Confirmed</span>
              <span className={breakoutConfirmed ? 'text-emerald-400' : 'text-amber-400'}>
                {breakoutConfirmed ? '✓ Yes' : 'Pending'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Strength</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      breakoutStrength > 70 ? 'bg-emerald-500' :
                      breakoutStrength > 40 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${breakoutStrength}%` }}
                  />
                </div>
                <span className="text-white text-sm">{breakoutStrength}%</span>
              </div>
            </div>
            {breakoutTime && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Breakout Time</span>
                <span className="text-cyan-400">{breakoutTime}</span>
              </div>
            )}
          </div>
          
          {/* Confirmation Factors */}
          {confirmationFactors.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-700">
              <p className="text-xs text-slate-400 mb-2">Confirmation Factors:</p>
              <div className="flex flex-wrap gap-1">
                {confirmationFactors.map((factor, i) => (
                  <span key={i} className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* False Breakout Risk */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-3">False Breakout Risk</h4>
          <div className={`text-2xl font-bold mb-3 ${
            falseBreakoutRisk === 'High' ? 'text-red-400' :
            falseBreakoutRisk === 'Medium' ? 'text-amber-400' :
            'text-emerald-400'
          }`}>
            {falseBreakoutRisk}
          </div>
          {falseBreakoutReasons.length > 0 && (
            <div className="space-y-1">
              {falseBreakoutReasons.map((reason, i) => (
                <p key={i} className="text-xs text-slate-400 flex items-start gap-1">
                  <span className="text-amber-400">⚠</span> {reason}
                </p>
              ))}
            </div>
          )}
          
          {/* Volume Analysis */}
          <div className="mt-4 pt-3 border-t border-slate-700">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">ORB Volume</span>
              <span className="text-white">{(orbVolume / 100000).toFixed(2)}L</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Vol Ratio</span>
              <span className={volumeRatio > 1.5 ? 'text-emerald-400' : volumeRatio < 0.7 ? 'text-red-400' : 'text-white'}>
                {volumeRatio.toFixed(2)}x
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Setups */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Long Setup */}
        <div className={`bg-emerald-500/5 rounded-lg p-4 border ${
          signal === 'Long Breakout' ? 'border-emerald-500' : 'border-emerald-500/20'
        }`}>
          <h4 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
            📈 Long Setup
            {signal === 'Long Breakout' && <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded">ACTIVE</span>}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Entry</span>
              <span className="text-white">₹{longEntry.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target 1</span>
              <span className="text-emerald-400">₹{longTarget1.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target 2</span>
              <span className="text-emerald-400">₹{longTarget2.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Stop Loss</span>
              <span className="text-red-400">₹{longStop.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-700">
              <span className="text-slate-400">R:R</span>
              <span className="text-white font-semibold">{longRR.toFixed(2)}:1</span>
            </div>
          </div>
        </div>

        {/* Short Setup */}
        <div className={`bg-red-500/5 rounded-lg p-4 border ${
          signal === 'Short Breakout' ? 'border-red-500' : 'border-red-500/20'
        }`}>
          <h4 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
            📉 Short Setup
            {signal === 'Short Breakout' && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">ACTIVE</span>}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Entry</span>
              <span className="text-white">₹{shortEntry.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target 1</span>
              <span className="text-emerald-400">₹{shortTarget1.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target 2</span>
              <span className="text-emerald-400">₹{shortTarget2.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Stop Loss</span>
              <span className="text-red-400">₹{shortStop.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-700">
              <span className="text-slate-400">R:R</span>
              <span className="text-white font-semibold">{shortRR.toFixed(2)}:1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Levels Reference */}
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Key Levels</h4>
        <div className="grid grid-cols-5 gap-2 text-center text-sm">
          <div>
            <p className="text-slate-400 text-xs">PDH</p>
            <p className="text-white">₹{previousDayHigh.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">PDL</p>
            <p className="text-white">₹{previousDayLow.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">PDC</p>
            <p className="text-white">₹{previousClose.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">PM High</p>
            <p className="text-white">₹{preMarketHigh.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">PM Low</p>
            <p className="text-white">₹{preMarketLow.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Session Context & Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Session Context</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Session Type</span>
              <span className="text-white">{sessionType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Bias</span>
              <span className={
                sessionBias === 'Bullish' ? 'text-emerald-400' :
                sessionBias === 'Bearish' ? 'text-red-400' :
                'text-slate-400'
              }>{sessionBias}</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">ORB Stats (Historical)</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Success Rate</span>
              <span className="text-white">{orbBreakoutSuccessRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Avg Move</span>
              <span className="text-white">{avgBreakoutMove.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>

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

      {/* Signal Box */}
      <div className={`mt-6 p-4 rounded-lg border ${
        signal.includes('Long') ? 'bg-emerald-500/10 border-emerald-500/30' :
        signal.includes('Short') ? 'bg-red-500/10 border-red-500/30' :
        'bg-slate-800/50 border-slate-700'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`text-lg font-semibold ${
              signal.includes('Long') ? 'text-emerald-400' :
              signal.includes('Short') ? 'text-red-400' :
              'text-slate-400'
            }`}>{signal}</h4>
            <p className="text-slate-300 text-sm mt-1">{signalReason}</p>
          </div>
          <div className="text-4xl">
            {signal.includes('Long') ? '📈' : signal.includes('Short') ? '📉' : '⏳'}
          </div>
        </div>
      </div>
    </div>
  );
}
