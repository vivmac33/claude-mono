import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
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

interface VWAPDataPoint {
  time: string;
  price: number;
  vwap: number;
  upperBand1: number; // +1 std dev
  lowerBand1: number; // -1 std dev
  upperBand2: number; // +2 std dev
  lowerBand2: number; // -2 std dev
  volume: number;
}

interface AnchoredVWAP {
  anchorPoint: string; // e.g., "Session Open", "Day High", "Earnings"
  anchorTime: string;
  vwapValue: number;
  currentDeviation: number; // % from anchored VWAP
}

export interface VWAPAnalysisData {
  symbol: string;
  asOf: string;
  
  // Session VWAP
  sessionVWAP: number;
  currentPrice: number;
  priceVsVWAP: number; // % deviation from VWAP
  
  // Band Analysis
  upperBand1: number; // +1 std dev
  lowerBand1: number; // -1 std dev
  upperBand2: number; // +2 std dev
  lowerBand2: number; // -2 std dev
  stdDev: number;
  
  // Price Position
  pricePosition: 'Above +2σ' | 'Above +1σ' | 'At VWAP' | 'Below -1σ' | 'Below -2σ' | 'Between Bands';
  positionSignal: 'Overbought' | 'Bullish' | 'Neutral' | 'Bearish' | 'Oversold';
  
  // VWAP Slope (momentum)
  vwapSlope: 'Rising' | 'Falling' | 'Flat';
  slopeStrength: number; // 0-100
  
  // Mean Reversion Probability
  meanReversionProb: number; // 0-100
  expectedReversion: number; // Target price for reversion
  
  // Anchored VWAPs
  anchoredVWAPs: AnchoredVWAP[];
  
  // Trading Signals
  signal: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  signalReason: string;
  
  // Support/Resistance from VWAP
  vwapSupport: number;
  vwapResistance: number;
  
  // Historical touches
  vwapTouchesCount: number; // How many times price touched VWAP today
  lastVWAPTouch: string; // Time of last touch
  
  // Time-based analysis
  isFirstHour: boolean;
  sessionPhase: 'Opening' | 'Mid-Session' | 'Closing' | 'After-Hours';
  
  // Historical data for chart
  history: VWAPDataPoint[];
  
  // Insights
  insights: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getVWAPAnalysisOutput(data: VWAPAnalysisData): CardOutput {
  const { symbol, sessionVWAP, currentPrice, priceVsVWAP, positionSignal, signal, meanReversionProb, insights: dataInsights } = data;
  
  const sentiment = signal.includes('Buy') ? 'bullish' : signal.includes('Sell') ? 'bearish' : 'neutral';
  const signalStrength = signal.includes('Strong') ? 5 : signal !== 'Neutral' ? 4 : 3;
  
  return {
    cardId: "vwap-analysis",
    symbol,
    generatedAt: new Date().toISOString(),
    
    summary: {
      headline: `${symbol}: ${priceVsVWAP > 0 ? '+' : ''}${priceVsVWAP.toFixed(2)}% from VWAP (₹${sessionVWAP.toFixed(2)})`,
      body: `Price is ${positionSignal.toLowerCase()}. ${data.signalReason}`,
      sentiment,
      signalStrength,
    },
    
    metrics: [
      createMetric("Session VWAP", sessionVWAP, { format: "currency" }),
      createMetric("Current Price", currentPrice, { format: "currency" }),
      createMetric("VWAP Deviation", priceVsVWAP, { format: "percent", thresholds: { good: -1, bad: 2 } }),
      createMetric("Mean Reversion Prob", meanReversionProb, { format: "percent" }),
      createMetric("Upper Band (+1σ)", data.upperBand1, { format: "currency" }),
      createMetric("Lower Band (-1σ)", data.lowerBand1, { format: "currency" }),
    ],
    
    insights: dataInsights.map((text, i) => createInsight(
      text,
      i === 0 ? "high" : "medium",
      i === 0 ? (sentiment === 'bullish' ? 'positive' : sentiment === 'bearish' ? 'negative' : 'neutral') : 'neutral'
    )),
    
    nextSteps: [
      positionSignal === 'Overbought' ? "Consider profit-taking or wait for pullback to VWAP" : "",
      positionSignal === 'Oversold' ? "Watch for bounce back to VWAP" : "",
      `VWAP Support: ₹${data.vwapSupport.toFixed(2)}, Resistance: ₹${data.vwapResistance.toFixed(2)}`,
      meanReversionProb > 70 ? `High reversion probability to ₹${data.expectedReversion.toFixed(2)}` : "",
    ].filter(Boolean),
    
    metadata: {
      dataAsOf: data.asOf,
      confidence: signalStrength >= 4 ? 0.8 : 0.65,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface VWAPAnalysisCardProps {
  data?: VWAPAnalysisData | null;
  isLoading?: boolean;
  error?: string | null;
}

export default function VWAPAnalysisCard({ data, isLoading, error }: VWAPAnalysisCardProps) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  if (isLoading) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4" />
        <div className="h-64 bg-slate-800 rounded" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
        <div className="text-slate-400">{error || 'No data available'}</div>
      </div>
    );
  }

  const {
    symbol,
    asOf,
    sessionVWAP,
    currentPrice,
    priceVsVWAP,
    upperBand1,
    lowerBand1,
    upperBand2,
    lowerBand2,
    stdDev,
    pricePosition,
    positionSignal,
    vwapSlope,
    slopeStrength,
    meanReversionProb,
    expectedReversion,
    anchoredVWAPs,
    signal,
    signalReason,
    vwapSupport,
    vwapResistance,
    vwapTouchesCount,
    lastVWAPTouch,
    sessionPhase,
    history,
    insights,
  } = data;

  const signalColor = signal.includes('Buy') ? 'emerald' : signal.includes('Sell') ? 'red' : 'slate';
  const accentColor = signal.includes('Buy') ? '#10b981' : signal.includes('Sell') ? '#ef4444' : '#6366f1';
  const positionColor = 
    positionSignal === 'Overbought' ? 'text-red-400' :
    positionSignal === 'Oversold' ? 'text-emerald-400' :
    positionSignal === 'Bullish' ? 'text-emerald-400' :
    positionSignal === 'Bearish' ? 'text-red-400' :
    'text-slate-400';

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 border-l-4" style={{ borderLeftColor: accentColor }}>
      {/* Header with Anchor Icon */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-lg">⚓</span> VWAP Analysis
            <span className="text-sm font-normal text-slate-400">({sessionPhase})</span>
          </h3>
          <p className="text-slate-400 text-sm">{symbol} • {asOf}</p>
        </div>
        <div 
          className="px-4 py-2 rounded-lg font-semibold"
          style={{
            backgroundColor: `${accentColor}20`,
            color: accentColor,
            boxShadow: `0 0 10px ${accentColor}30`,
          }}
        >
          {signal}
        </div>
      </div>

      {/* VWAP Anchor Visual */}
      <div className="relative bg-slate-800/30 rounded-xl p-4 mb-6 border border-slate-700/50">
        <div className="flex items-center justify-between">
          {/* VWAP Anchor Point */}
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{
                background: `linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)`,
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
              }}
            >
              ⚓
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-500">Session VWAP</div>
              <div className="text-2xl font-bold text-white">₹{sessionVWAP.toFixed(2)}</div>
            </div>
          </div>
          
          {/* Deviation Indicator */}
          <div className="text-center">
            <div className="text-[10px] text-slate-500 uppercase">Deviation</div>
            <div 
              className="text-xl font-bold"
              style={{ color: priceVsVWAP > 0 ? '#10b981' : '#ef4444' }}
            >
              {priceVsVWAP > 0 ? '+' : ''}{priceVsVWAP.toFixed(2)}%
            </div>
          </div>
          
          {/* Current Price */}
          <div className="text-right">
            <div className="text-[10px] uppercase text-slate-500">Current Price</div>
            <div className="text-2xl font-bold text-white">₹{currentPrice.toFixed(2)}</div>
            <div className={`text-xs font-medium ${positionColor}`}>{positionSignal}</div>
          </div>
        </div>
        
        {/* Visual Price Line */}
        <div className="mt-4 relative h-8">
          <div className="absolute inset-x-0 top-1/2 h-1 bg-slate-700 rounded" />
          
          {/* VWAP anchor marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div 
              className="w-4 h-4 rounded-full border-2 border-indigo-500"
              style={{ backgroundColor: '#6366f1', boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)' }}
            />
          </div>
          
          {/* Price position indicator */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-500"
            style={{ 
              left: `${Math.max(5, Math.min(95, 50 + priceVsVWAP * 5))}%`,
            }}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: priceVsVWAP > 0 ? '#10b981' : '#ef4444' }}
            />
            <div 
              className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold whitespace-nowrap px-1 rounded"
              style={{ 
                backgroundColor: priceVsVWAP > 0 ? '#10b981' : '#ef4444',
                color: 'white',
              }}
            >
              CMP
            </div>
          </div>
          
          {/* Band markers */}
          <div className="absolute top-1/2 -translate-y-1/2 left-[25%] w-1 h-3 bg-amber-500/50 rounded" />
          <div className="absolute top-1/2 -translate-y-1/2 left-[10%] w-1 h-3 bg-red-500/50 rounded" />
          <div className="absolute top-1/2 -translate-y-1/2 right-[25%] w-1 h-3 bg-amber-500/50 rounded" />
          <div className="absolute top-1/2 -translate-y-1/2 right-[10%] w-1 h-3 bg-red-500/50 rounded" />
        </div>
        
        {/* Band labels */}
        <div className="flex justify-between text-[8px] text-slate-500 mt-1 px-2">
          <span>-2σ</span>
          <span>-1σ</span>
          <span className="text-indigo-400">VWAP</span>
          <span>+1σ</span>
          <span>+2σ</span>
        </div>
      </div>

      {/* VWAP Chart with Bands */}
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-700/30">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Price vs VWAP Bands</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="vwapBandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                {/* VWAP line glow */}
                <filter id="vwapGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#94a3b8', fontSize: 9 }} tickFormatter={(v) => `₹${v}`} axisLine={false} tickLine={false} width={50} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', fontSize: '11px' }}
                labelStyle={{ color: '#f8fafc' }}
                formatter={(value: number, name: string) => [`₹${value.toFixed(2)}`, name]}
              />
              
              {/* +2σ Band */}
              <Line type="monotone" dataKey="upperBand2" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" dot={false} name="+2σ" />
              {/* +1σ Band */}
              <Line type="monotone" dataKey="upperBand1" stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" dot={false} name="+1σ" />
              {/* VWAP - Anchor line with glow */}
              <Line 
                type="monotone" 
                dataKey="vwap" 
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={false} 
                name="VWAP"
                filter="url(#vwapGlow)"
              />
              {/* -1σ Band */}
              <Line type="monotone" dataKey="lowerBand1" stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" dot={false} name="-1σ" />
              {/* -2σ Band */}
              <Line type="monotone" dataKey="lowerBand2" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" dot={false} name="-2σ" />
              {/* Price */}
              <Line type="monotone" dataKey="price" stroke="#22d3ee" strokeWidth={2} dot={false} name="Price" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-cyan-400"></span> Price</span>
          <span className="flex items-center gap-1"><span className="w-4 h-1 bg-indigo-500 rounded"></span> VWAP</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-500"></span> ±1σ</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500"></span> ±2σ</span>
        </div>
      </div>

      {/* Band Levels */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        <div className="bg-red-500/10 rounded-lg p-3 text-center border border-red-500/30">
          <p className="text-red-400 text-xs mb-1">+2σ</p>
          <p className="text-white font-semibold">₹{upperBand2.toFixed(2)}</p>
        </div>
        <div className="bg-amber-500/10 rounded-lg p-3 text-center border border-amber-500/30">
          <p className="text-amber-400 text-xs mb-1">+1σ</p>
          <p className="text-white font-semibold">₹{upperBand1.toFixed(2)}</p>
        </div>
        <div className="bg-indigo-500/10 rounded-lg p-3 text-center border border-indigo-500/30">
          <p className="text-indigo-400 text-xs mb-1">VWAP</p>
          <p className="text-white font-semibold">₹{sessionVWAP.toFixed(2)}</p>
        </div>
        <div className="bg-amber-500/10 rounded-lg p-3 text-center border border-amber-500/30">
          <p className="text-amber-400 text-xs mb-1">-1σ</p>
          <p className="text-white font-semibold">₹{lowerBand1.toFixed(2)}</p>
        </div>
        <div className="bg-red-500/10 rounded-lg p-3 text-center border border-red-500/30">
          <p className="text-red-400 text-xs mb-1">-2σ</p>
          <p className="text-white font-semibold">₹{lowerBand2.toFixed(2)}</p>
        </div>
      </div>

      {/* VWAP Dynamics & Mean Reversion */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* VWAP Dynamics */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-3">VWAP Dynamics</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">VWAP Slope</span>
              <span className={`font-semibold ${
                vwapSlope === 'Rising' ? 'text-emerald-400' :
                vwapSlope === 'Falling' ? 'text-red-400' :
                'text-slate-400'
              }`}>
                {vwapSlope} ({slopeStrength}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Std Deviation</span>
              <span className="text-white">₹{stdDev.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">VWAP Touches</span>
              <span className="text-white">{vwapTouchesCount}x today</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Last Touch</span>
              <span className="text-cyan-400">{lastVWAPTouch}</span>
            </div>
          </div>
        </div>

        {/* Mean Reversion */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Mean Reversion</h4>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-slate-400 text-sm">Probability</span>
              <span className={`font-semibold ${meanReversionProb > 60 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {meanReversionProb}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  meanReversionProb > 70 ? 'bg-emerald-500' :
                  meanReversionProb > 40 ? 'bg-amber-500' :
                  'bg-slate-500'
                }`}
                style={{ width: `${meanReversionProb}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Expected Target</span>
              <span className="text-indigo-400 font-semibold">₹{expectedReversion.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Support</span>
              <span className="text-emerald-400">₹{vwapSupport.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Resistance</span>
              <span className="text-red-400">₹{vwapResistance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Anchored VWAPs */}
      {anchoredVWAPs.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3">⚓ Anchored VWAPs</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {anchoredVWAPs.map((avwap, i) => (
              <div key={i} className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">{avwap.anchorPoint}</p>
                <p className="text-lg font-semibold text-white">₹{avwap.vwapValue.toFixed(2)}</p>
                <p className={`text-xs ${avwap.currentDeviation > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {avwap.currentDeviation > 0 ? '+' : ''}{avwap.currentDeviation.toFixed(2)}% from current
                </p>
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

      {/* Signal Reason */}
      <div className={`mt-6 p-4 bg-${signalColor}-500/10 border border-${signalColor}-500/30 rounded-lg`}>
        <h4 className={`text-sm font-medium text-${signalColor}-400 mb-2`}>📊 Signal Reasoning</h4>
        <p className="text-slate-300 text-sm">{signalReason}</p>
      </div>
    </div>
  );
}
