import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Area,
  Line,
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

interface VolumeNode {
  price: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
  isHVN: boolean; // High Volume Node
  isLVN: boolean; // Low Volume Node
  isPOC: boolean; // Point of Control
  isVAH: boolean; // Value Area High
  isVAL: boolean; // Value Area Low
  // TPO fields
  tpoCount?: number; // Number of 30-min periods at this price
  periods?: number[]; // Which periods touched this price
  isSinglePrint?: boolean;
  isIBHigh?: boolean;
  isIBLow?: boolean;
}

interface TPOPeriod {
  periodNum: number;
  time: string;
  high: number;
  low: number;
  open: number;
  close: number;
}

interface InitialBalance {
  high: number;
  low: number;
  range: number;
  ibType: 'Wide' | 'Normal' | 'Narrow';
}

export interface VolumeProfileData {
  symbol: string;
  asOf: string;
  timeframe: '1D' | '5D' | '20D' | 'Session';
  
  // Key Levels
  poc: number; // Point of Control - highest volume price
  vah: number; // Value Area High (70% of volume above this)
  val: number; // Value Area Low (70% of volume below this)
  currentPrice: number;
  
  // Value Area Stats
  valueAreaVolumePct: number; // % of volume in value area (typically ~70%)
  valueAreaRange: number; // VAH - VAL in %
  
  // Price Position
  pricePosition: 'Above VAH' | 'In Value Area' | 'Below VAL' | 'At POC';
  priceVsPOC: number; // % distance from POC
  
  // Low Volume Nodes (potential fast-move zones)
  lvnZones: { low: number; high: number; gapSize: number }[];
  
  // High Volume Nodes (potential support/resistance)
  hvnZones: { price: number; volumePct: number }[];
  
  // Trading Implications
  bias: 'Bullish' | 'Bearish' | 'Neutral';
  biasReason: string;
  nearestSupport: number;
  nearestResistance: number;
  
  // Volume Delta
  totalBuyVolume: number;
  totalSellVolume: number;
  volumeDelta: number; // Buy - Sell
  deltaSignal: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  
  // Profile Shape
  profileShape: 'P-Shape' | 'b-Shape' | 'D-Shape' | 'B-Shape';
  shapeImplication: string;
  
  // Volume distribution data for chart
  volumeDistribution: VolumeNode[];
  
  // Key insights
  insights: string[];
  
  // TPO Data (optional - for TPO view)
  tpoPeriods?: TPOPeriod[];
  initialBalance?: InitialBalance;
  singlePrints?: number[];
  poorHigh?: boolean;
  poorLow?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getVolumeProfileOutput(data: VolumeProfileData): CardOutput {
  const { symbol, poc, vah, val, currentPrice, pricePosition, bias, deltaSignal, profileShape, insights: dataInsights } = data;
  
  const sentiment = bias === 'Bullish' ? 'bullish' : bias === 'Bearish' ? 'bearish' : 'neutral';
  const signalStrength = deltaSignal.includes('Strong') ? 5 : deltaSignal !== 'Neutral' ? 4 : 3;
  
  return {
    cardId: "volume-profile",
    symbol,
    generatedAt: new Date().toISOString(),
    
    summary: {
      headline: `${symbol}: POC at ₹${poc.toFixed(2)}, Price ${pricePosition}`,
      body: `Value Area: ₹${val.toFixed(2)} - ₹${vah.toFixed(2)}. Profile shape: ${profileShape}. ${bias} bias based on volume distribution.`,
      sentiment,
      signalStrength,
    },
    
    metrics: [
      createMetric("POC", poc, { format: "currency", description: "Point of Control - highest volume price" }),
      createMetric("VAH", vah, { format: "currency", description: "Value Area High" }),
      createMetric("VAL", val, { format: "currency", description: "Value Area Low" }),
      createMetric("Current Price", currentPrice, { format: "currency" }),
      createMetric("Price vs POC", data.priceVsPOC, { format: "percent", thresholds: { good: 2, bad: -2 } }),
      createMetric("Volume Delta", data.volumeDelta, { format: "number", description: "Buy - Sell volume" }),
    ],
    
    insights: dataInsights.map((text, i) => createInsight(
      text,
      i === 0 ? "high" : "medium",
      i === 0 ? (sentiment === 'bullish' ? 'positive' : sentiment === 'bearish' ? 'negative' : 'neutral') : 'neutral'
    )),
    
    nextSteps: [
      pricePosition === 'Below VAL' ? "Watch for bounce back to POC" : "",
      pricePosition === 'Above VAH' ? "Price extended, watch for mean reversion to VAH" : "",
      data.lvnZones.length > 0 ? `LVN zones may see fast moves: ${data.lvnZones.map(z => `₹${z.low}-${z.high}`).join(', ')}` : "",
      `Nearest support: ₹${data.nearestSupport.toFixed(2)}, Resistance: ₹${data.nearestResistance.toFixed(2)}`,
    ].filter(Boolean),
    
    metadata: {
      dataAsOf: data.asOf,
      timeframe: data.timeframe,
      confidence: signalStrength >= 4 ? 0.8 : 0.65,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface VolumeProfileCardProps {
  data?: VolumeProfileData | null;
  isLoading?: boolean;
  error?: string | null;
}

export default function VolumeProfileCard({ data, isLoading, error }: VolumeProfileCardProps) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  const [view, setView] = React.useState<'profile' | 'tpo'>('profile');
  
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
    timeframe,
    poc,
    vah,
    val,
    currentPrice,
    pricePosition,
    valueAreaVolumePct,
    valueAreaRange,
    priceVsPOC,
    lvnZones,
    hvnZones,
    bias,
    biasReason,
    nearestSupport,
    nearestResistance,
    totalBuyVolume,
    totalSellVolume,
    volumeDelta,
    deltaSignal,
    profileShape,
    shapeImplication,
    volumeDistribution,
    insights,
    tpoPeriods,
    initialBalance,
    singlePrints,
    poorHigh,
    poorLow,
  } = data;

  const biasColor = bias === 'Bullish' ? 'text-emerald-400' : bias === 'Bearish' ? 'text-red-400' : 'text-slate-400';
  const deltaPct = totalBuyVolume + totalSellVolume > 0 
    ? ((totalBuyVolume - totalSellVolume) / (totalBuyVolume + totalSellVolume) * 100) 
    : 0;

  // Prepare horizontal bar chart data (volume profile is typically horizontal)
  const chartData = volumeDistribution.map(node => ({
    price: node.price,
    volume: node.volume,
    buyVolume: node.buyVolume,
    sellVolume: -node.sellVolume, // Negative for left side
    isPOC: node.isPOC,
    isVAH: node.isVAH,
    isVAL: node.isVAL,
    isHVN: node.isHVN,
    isLVN: node.isLVN,
  }));

  const getBarColor = (node: VolumeNode) => {
    if (node.isPOC) return '#f59e0b'; // Amber for POC
    if (node.isVAH || node.isVAL) return '#8b5cf6'; // Purple for VA boundaries
    if (node.isHVN) return '#3b82f6'; // Blue for HVN
    if (node.isLVN) return '#64748b'; // Slate for LVN
    return '#6366f1'; // Indigo default
  };

  // Volume Mountain gradient colors
  const mountainGradient = bias === 'Bullish' ? ['#10b981', '#059669'] : bias === 'Bearish' ? ['#ef4444', '#dc2626'] : ['#6366f1', '#4f46e5'];
  const glowColor = bias === 'Bullish' ? 'rgba(16, 185, 129, 0.3)' : bias === 'Bearish' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)';

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 border-l-4" style={{ borderLeftColor: mountainGradient[0] }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-lg">📊</span> Volume Profile
            <span className="text-sm font-normal text-slate-400">({timeframe})</span>
          </h3>
          <p className="text-slate-400 text-sm">{symbol} • {asOf}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setView('profile')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${view === 'profile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Volume Profile
            </button>
            <button
              onClick={() => setView('tpo')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${view === 'tpo' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              TPO
            </button>
          </div>
          <div 
            className="px-4 py-2 rounded-lg font-semibold"
            style={{
              backgroundColor: `${mountainGradient[0]}20`,
              color: mountainGradient[0],
              boxShadow: `0 0 15px ${glowColor}`,
            }}
          >
            {bias}
          </div>
        </div>
      </div>

      {/* Signature Volume Mountain - Key Levels Visual */}
      <div className="relative bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase text-slate-500">Volume Mountain</span>
          <span className="text-xs text-slate-400">Value Area: {valueAreaVolumePct.toFixed(0)}%</span>
        </div>
        
        {/* Mountain Visualization */}
        <div className="relative h-32">
          {/* Background mountain shape */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="mountainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={mountainGradient[0]} stopOpacity={0.6} />
                <stop offset="100%" stopColor={mountainGradient[1]} stopOpacity={0.1} />
              </linearGradient>
              <filter id="mountainGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Mountain path - simulated from volume distribution */}
            <path
              d={`M 0 100 
                  L 50 ${100 - (volumeDistribution[0]?.volume || 30) / Math.max(...volumeDistribution.map(v => v.volume)) * 60}
                  Q 100 ${100 - (volumeDistribution[Math.floor(volumeDistribution.length * 0.25)]?.volume || 50) / Math.max(...volumeDistribution.map(v => v.volume)) * 80} 150 ${100 - (volumeDistribution[Math.floor(volumeDistribution.length * 0.4)]?.volume || 70) / Math.max(...volumeDistribution.map(v => v.volume)) * 90}
                  Q 200 ${100 - Math.max(...volumeDistribution.map(v => v.volume)) / Math.max(...volumeDistribution.map(v => v.volume)) * 95} 250 ${100 - (volumeDistribution[Math.floor(volumeDistribution.length * 0.6)]?.volume || 70) / Math.max(...volumeDistribution.map(v => v.volume)) * 85}
                  Q 300 ${100 - (volumeDistribution[Math.floor(volumeDistribution.length * 0.75)]?.volume || 50) / Math.max(...volumeDistribution.map(v => v.volume)) * 70} 350 ${100 - (volumeDistribution[Math.floor(volumeDistribution.length * 0.9)]?.volume || 30) / Math.max(...volumeDistribution.map(v => v.volume)) * 50}
                  L 400 100 Z`}
              fill="url(#mountainGradient)"
              filter="url(#mountainGlow)"
            />
            
            {/* POC line */}
            <line x1="200" y1="5" x2="200" y2="95" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
            
            {/* Value Area boundaries */}
            <line x1="100" y1="10" x2="100" y2="90" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="3 3" opacity={0.7} />
            <line x1="300" y1="10" x2="300" y2="90" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="3 3" opacity={0.7} />
          </svg>
          
          {/* Price levels overlay */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            {/* VAL */}
            <div className="text-center">
              <div className="text-[9px] text-purple-400 uppercase">VAL</div>
              <div className="text-sm font-bold text-white">₹{val.toFixed(0)}</div>
            </div>
            
            {/* POC - Center */}
            <div className="text-center relative">
              <div 
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                style={{ backgroundColor: '#f59e0b', boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)' }}
              />
              <div className="text-[9px] text-amber-400 uppercase mt-3">POC</div>
              <div className="text-lg font-bold text-white">₹{poc.toFixed(0)}</div>
              <div className="text-[9px] text-slate-400">Peak Volume</div>
            </div>
            
            {/* VAH */}
            <div className="text-center">
              <div className="text-[9px] text-purple-400 uppercase">VAH</div>
              <div className="text-sm font-bold text-white">₹{vah.toFixed(0)}</div>
            </div>
          </div>
          
          {/* Current Price Indicator */}
          <div 
            className="absolute top-0 h-full w-0.5 transition-all duration-500"
            style={{ 
              left: `${Math.max(5, Math.min(95, ((currentPrice - val) / (vah - val)) * 50 + 25))}%`,
              background: `linear-gradient(to bottom, ${mountainGradient[0]}, transparent)`,
            }}
          >
            <div 
              className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold text-white whitespace-nowrap"
              style={{ backgroundColor: mountainGradient[0] }}
            >
              CMP ₹{currentPrice.toFixed(0)}
            </div>
          </div>
        </div>
        
        {/* Position Badge */}
        <div className="flex justify-center mt-3">
          <span 
            className="px-3 py-1 rounded-full text-[10px] font-medium"
            style={{
              backgroundColor: pricePosition === 'Above VAH' ? 'rgba(16, 185, 129, 0.2)' : pricePosition === 'Below VAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(139, 92, 246, 0.2)',
              color: pricePosition === 'Above VAH' ? '#10b981' : pricePosition === 'Below VAL' ? '#ef4444' : '#8b5cf6',
              border: `1px solid ${pricePosition === 'Above VAH' ? 'rgba(16, 185, 129, 0.3)' : pricePosition === 'Below VAL' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
            }}
          >
            Price {pricePosition}
          </span>
        </div>
      </div>

      {/* Key Levels Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
          <p className="text-amber-400 text-xs font-medium mb-1">POC</p>
          <p className="text-2xl font-bold text-white">₹{poc.toFixed(2)}</p>
          <p className="text-xs text-slate-400">Point of Control</p>
        </div>
        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
          <p className="text-purple-400 text-xs font-medium mb-1">VAH</p>
          <p className="text-2xl font-bold text-white">₹{vah.toFixed(2)}</p>
          <p className="text-xs text-slate-400">Value Area High</p>
        </div>
        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
          <p className="text-purple-400 text-xs font-medium mb-1">VAL</p>
          <p className="text-2xl font-bold text-white">₹{val.toFixed(2)}</p>
          <p className="text-xs text-slate-400">Value Area Low</p>
        </div>
        <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/30">
          <p className="text-indigo-400 text-xs font-medium mb-1">Current</p>
          <p className="text-2xl font-bold text-white">₹{currentPrice.toFixed(2)}</p>
          <p className={`text-xs ${priceVsPOC > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {priceVsPOC > 0 ? '+' : ''}{priceVsPOC.toFixed(2)}% vs POC
          </p>
        </div>
      </div>

      {/* IB Info (shown when available) */}
      {initialBalance && (
        <div className="flex items-center gap-4 mb-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
          <div className="text-xs">
            <span className="text-blue-400 font-medium">Initial Balance:</span>
            <span className="text-white ml-2">₹{initialBalance.high.toFixed(2)} - ₹{initialBalance.low.toFixed(2)}</span>
            <span className="text-slate-400 ml-2">({initialBalance.ibType})</span>
          </div>
          {singlePrints && singlePrints.length > 0 && (
            <div className="text-xs">
              <span className="text-cyan-400 font-medium">Single Prints:</span>
              <span className="text-white ml-2">{singlePrints.length}</span>
            </div>
          )}
          {(poorHigh || poorLow) && (
            <div className="text-xs text-amber-400">
              {poorHigh && '⚠️ Poor High'} {poorLow && '⚠️ Poor Low'}
            </div>
          )}
        </div>
      )}

      {/* TPO View */}
      {view === 'tpo' && (
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3">TPO Distribution</h4>
          <div className="font-mono text-[11px] max-h-[350px] overflow-y-auto">
            {volumeDistribution
              .filter(n => n.volume > 0)
              .sort((a, b) => b.price - a.price)
              .slice(0, 40)
              .map((node, idx) => {
                const isInVA = node.price <= vah && node.price >= val;
                const tpoCount = node.tpoCount || Math.ceil(node.volume / (totalBuyVolume + totalSellVolume) * 50);
                const delta = node.buyVolume - node.sellVolume;
                const deltaPctNode = node.volume > 0 ? (delta / node.volume) * 100 : 0;
                
                return (
                  <div key={node.price} className={`flex items-center h-5 border-b border-slate-800/30 ${
                    node.isPOC ? 'bg-amber-500/20' : isInVA ? 'bg-slate-700/20' : ''
                  }`}>
                    <div className={`w-20 text-right pr-2 tabular-nums ${
                      node.isPOC ? 'text-amber-400 font-bold' :
                      node.isVAH || node.isVAL ? 'text-purple-400' :
                      'text-slate-500'
                    }`}>
                      {node.isPOC && 'POC '}
                      {node.isVAH && 'VAH '}
                      {node.isVAL && 'VAL '}
                      {!node.isPOC && !node.isVAH && !node.isVAL && node.price.toFixed(1)}
                    </div>
                    <div className="flex-1 flex items-center gap-px pl-1">
                      {node.isIBHigh || node.isIBLow ? (
                        <div className="w-0.5 h-4 bg-blue-400 mr-1" />
                      ) : null}
                      {Array.from({ length: Math.min(tpoCount, 15) }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3.5 rounded-sm ${
                            node.isSinglePrint ? 'bg-cyan-500' :
                            node.buyVolume > node.sellVolume ? 'bg-teal-500/70' : 'bg-red-500/70'
                          }`}
                        />
                      ))}
                      {node.isSinglePrint && <span className="ml-1 text-cyan-400 text-[9px]">SP</span>}
                    </div>
                    <div className={`w-12 text-right pr-2 tabular-nums ${
                      deltaPctNode > 15 ? 'text-emerald-400' : deltaPctNode < -15 ? 'text-red-400' : 'text-slate-600'
                    }`}>
                      {Math.abs(deltaPctNode) > 5 && (deltaPctNode > 0 ? '+' : '') + deltaPctNode.toFixed(0) + '%'}
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-700 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-teal-500/70 rounded-sm"></span> Buy</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500/70 rounded-sm"></span> Sell</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-cyan-500 rounded-sm"></span> Single Print</span>
            <span className="flex items-center gap-1"><span className="w-0.5 h-3 bg-blue-400"></span> IB</span>
          </div>
        </div>
      )}

      {/* Volume Profile Visualization */}
      {view === 'profile' && (
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Volume Distribution by Price</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              layout="vertical"
              data={chartData}
              margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
            >
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis 
                dataKey="price" 
                type="number" 
                domain={['auto', 'auto']}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#f8fafc' }}
                formatter={(value: number, name: string) => [
                  `${Math.abs(value).toLocaleString('en-IN')}`,
                  name === 'buyVolume' ? 'Buy Volume' : name === 'sellVolume' ? 'Sell Volume' : 'Total Volume'
                ]}
                labelFormatter={(label) => `Price: ₹${label}`}
              />
              {/* Reference lines for key levels */}
              <ReferenceLine y={poc} stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" label={{ value: 'POC', fill: '#f59e0b', fontSize: 10 }} />
              <ReferenceLine y={vah} stroke="#8b5cf6" strokeWidth={1} strokeDasharray="3 3" label={{ value: 'VAH', fill: '#8b5cf6', fontSize: 10 }} />
              <ReferenceLine y={val} stroke="#8b5cf6" strokeWidth={1} strokeDasharray="3 3" label={{ value: 'VAL', fill: '#8b5cf6', fontSize: 10 }} />
              <ReferenceLine y={currentPrice} stroke="#22d3ee" strokeWidth={2} label={{ value: 'CMP', fill: '#22d3ee', fontSize: 10 }} />
              
              {/* Buy volume (positive, right side) */}
              <Bar dataKey="buyVolume" fill="#10b981" opacity={0.8} />
              {/* Sell volume (negative, left side) */}
              <Bar dataKey="sellVolume" fill="#ef4444" opacity={0.8} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded"></span> Buy Volume</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> Sell Volume</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded"></span> POC</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500 rounded"></span> Value Area</span>
        </div>
      </div>
      )}

      {/* Price Position & Volume Delta */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Price Position */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Price Position</h4>
          <div className={`text-lg font-semibold mb-2 ${
            pricePosition === 'Above VAH' ? 'text-emerald-400' :
            pricePosition === 'Below VAL' ? 'text-red-400' :
            pricePosition === 'At POC' ? 'text-amber-400' :
            'text-indigo-400'
          }`}>
            {pricePosition}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Value Area Range</span>
              <span className="text-white">{valueAreaRange.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">VA Volume</span>
              <span className="text-white">{valueAreaVolumePct.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Support</span>
              <span className="text-emerald-400">₹{nearestSupport.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Resistance</span>
              <span className="text-red-400">₹{nearestResistance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Volume Delta */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Volume Delta</h4>
          <div className={`text-lg font-semibold mb-2 ${
            deltaSignal.includes('Buy') ? 'text-emerald-400' :
            deltaSignal.includes('Sell') ? 'text-red-400' :
            'text-slate-400'
          }`}>
            {deltaSignal}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Buy Volume</span>
              <span className="text-emerald-400">{(totalBuyVolume / 100000).toFixed(2)}L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sell Volume</span>
              <span className="text-red-400">{(totalSellVolume / 100000).toFixed(2)}L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Net Delta</span>
              <span className={volumeDelta > 0 ? 'text-emerald-400' : 'text-red-400'}>
                {volumeDelta > 0 ? '+' : ''}{(volumeDelta / 100000).toFixed(2)}L
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Delta %</span>
              <span className={deltaPct > 0 ? 'text-emerald-400' : 'text-red-400'}>
                {deltaPct > 0 ? '+' : ''}{deltaPct.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Shape & LVN Zones */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Profile Shape */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Profile Shape</h4>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">
              {profileShape === 'P-Shape' ? '🅿️' : 
               profileShape === 'b-Shape' ? '🅱️' : 
               profileShape === 'D-Shape' ? '🇩' : '🅱️'}
            </span>
            <span className="text-lg font-semibold text-white">{profileShape}</span>
          </div>
          <p className="text-xs text-slate-400">{shapeImplication}</p>
        </div>

        {/* LVN Zones */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Low Volume Nodes (Fast Move Zones)</h4>
          {lvnZones.length > 0 ? (
            <div className="space-y-2">
              {lvnZones.slice(0, 3).map((zone, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">LVN {i + 1}</span>
                  <span className="text-cyan-400">₹{zone.low.toFixed(2)} - ₹{zone.high.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No significant LVN zones detected</p>
          )}
        </div>
      </div>

      {/* HVN Zones */}
      {hvnZones.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3">High Volume Nodes (Support/Resistance)</h4>
          <div className="flex flex-wrap gap-3">
            {hvnZones.slice(0, 5).map((zone, i) => (
              <div key={i} className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2">
                <span className="text-blue-400 font-medium">₹{zone.price.toFixed(2)}</span>
                <span className="text-slate-400 text-xs ml-2">({zone.volumePct.toFixed(1)}%)</span>
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

      {/* Trading Implications */}
      <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
        <h4 className="text-sm font-medium text-indigo-400 mb-2">📈 Trading Implication</h4>
        <p className="text-slate-300 text-sm">{biasReason}</p>
      </div>
    </div>
  );
}
