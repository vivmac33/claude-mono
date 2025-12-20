// ═══════════════════════════════════════════════════════════════════════════
// VOLUME PROFILE + TPO (TIME PRICE OPPORTUNITY)
// Enhanced Market Profile with session volume, TPO distribution, IB, single prints
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import {
  CardOutput,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface TPOPeriod {
  periodNum: number; // 1, 2, 3... (each 30-min period)
  time: string; // "09:15", "09:45", etc.
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
}

interface PriceLevel {
  price: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
  tpoCount: number; // How many 30-min periods touched this price
  periods: number[]; // Which periods touched this price [1, 2, 3]
  isHVN: boolean;
  isLVN: boolean;
  isPOC: boolean;
  isVAH: boolean;
  isVAL: boolean;
  isIBHigh: boolean;
  isIBLow: boolean;
  isSinglePrint: boolean; // Only touched once
  isOpeningPrint: boolean; // First period
  isClosingPrint: boolean; // Last period
}

interface InitialBalance {
  high: number;
  low: number;
  range: number;
  rangeATRPct: number; // IB range as % of ATR
  ibType: 'Wide' | 'Normal' | 'Narrow';
  breakout: 'Above' | 'Below' | 'None';
  breakoutDistance: number;
}

interface CompositeProfile {
  date: string;
  poc: number;
  vah: number;
  val: number;
  high: number;
  low: number;
  profileShape: 'P-Shape' | 'b-Shape' | 'D-Shape' | 'B-Shape';
}

export interface VolumeProfileTPOData {
  symbol: string;
  asOf: string;
  sessionDate: string;
  timeframe: 'Session' | '3D' | '5D' | '10D' | '20D';
  
  // Current session OHLC
  sessionOpen: number;
  sessionHigh: number;
  sessionLow: number;
  currentPrice: number;
  
  // Key Levels
  poc: number;
  vah: number;
  val: number;
  
  // TPO specific
  tpoPeriods: TPOPeriod[];
  priceLevels: PriceLevel[];
  tickSize: number; // Price increment (0.05 for stocks, 0.25 for Nifty)
  
  // Initial Balance (first hour)
  initialBalance: InitialBalance;
  
  // Single Prints (unfinished business)
  singlePrints: { price: number; type: 'Gap Up' | 'Gap Down' | 'Extension' }[];
  
  // Poor Highs/Lows (no excess)
  poorHigh: boolean;
  poorLow: boolean;
  
  // Value Area Stats
  valueAreaVolumePct: number;
  valueAreaRange: number;
  pricePosition: 'Above VAH' | 'In Value Area' | 'Below VAL' | 'At POC';
  priceVsPOC: number;
  
  // Volume Analysis
  totalVolume: number;
  totalBuyVolume: number;
  totalSellVolume: number;
  volumeDelta: number;
  deltaSignal: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  
  // Profile Shape
  profileShape: 'P-Shape' | 'b-Shape' | 'D-Shape' | 'B-Shape';
  shapeImplication: string;
  
  // Composite (multi-day)
  compositeProfiles?: CompositeProfile[];
  compositePOC?: number;
  compositeVAH?: number;
  compositeVAL?: number;
  
  // LVN/HVN
  lvnZones: { low: number; high: number }[];
  hvnZones: { price: number; volumePct: number }[];
  
  // Trading
  bias: 'Bullish' | 'Bearish' | 'Neutral';
  biasReason: string;
  nearestSupport: number;
  nearestResistance: number;
  
  insights: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

export function getVolumeProfileTPOOutput(data: VolumeProfileTPOData): CardOutput {
  const { symbol, poc, vah, val, currentPrice, pricePosition, bias, deltaSignal, profileShape, initialBalance, singlePrints } = data;
  
  const sentiment = bias === 'Bullish' ? 'bullish' : bias === 'Bearish' ? 'bearish' : 'neutral';
  const signalStrength = deltaSignal.includes('Strong') ? 5 : deltaSignal !== 'Neutral' ? 4 : 3;
  
  return {
    cardId: "volume-profile-tpo",
    symbol,
    generatedAt: new Date().toISOString(),
    summary: {
      headline: `${symbol}: POC ₹${poc.toFixed(2)}, ${pricePosition}, IB ${initialBalance.ibType}`,
      body: `VA: ₹${val.toFixed(2)}-${vah.toFixed(2)}. ${profileShape}. ${singlePrints.length} single prints. ${bias} bias.`,
      sentiment,
      signalStrength,
    },
    metrics: [
      createMetric("POC", poc, { format: "currency" }),
      createMetric("VAH", vah, { format: "currency" }),
      createMetric("VAL", val, { format: "currency" }),
      createMetric("IB Range", initialBalance.range, { format: "currency" }),
    ],
    insights: data.insights.map((text, i) => createInsight(text, i === 0 ? "high" : "medium", "neutral")),
    metadata: { dataAsOf: data.asOf, timeframe: data.timeframe },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

function generateMockData(symbol: string = 'NIFTY'): VolumeProfileTPOData {
  const basePrice = symbol === 'NIFTY' ? 24500 : 3500;
  const tickSize = symbol === 'NIFTY' ? 0.05 : 0.05;
  const range = basePrice * 0.012; // ~1.2% range
  
  // Generate 13 TPO periods (9:15 to 3:30)
  const periods: TPOPeriod[] = [];
  let currentHigh = basePrice + range * 0.3;
  let currentLow = basePrice - range * 0.3;
  
  for (let i = 1; i <= 13; i++) {
    const hour = Math.floor((i - 1) / 2) + 9;
    const min = ((i - 1) % 2) * 30 + 15;
    const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    
    const periodRange = range * (0.15 + Math.random() * 0.1);
    const midPoint = basePrice + (Math.random() - 0.5) * range * 0.8;
    
    const high = midPoint + periodRange / 2;
    const low = midPoint - periodRange / 2;
    const open = low + Math.random() * periodRange;
    const close = low + Math.random() * periodRange;
    const volume = Math.floor(500000 + Math.random() * 1500000);
    const buyPct = 0.4 + Math.random() * 0.2;
    
    periods.push({
      periodNum: i,
      time,
      high,
      low,
      open,
      close,
      volume,
      buyVolume: Math.floor(volume * buyPct),
      sellVolume: Math.floor(volume * (1 - buyPct)),
    });
    
    currentHigh = Math.max(currentHigh, high);
    currentLow = Math.min(currentLow, low);
  }
  
  // Generate price levels
  const numLevels = Math.floor(range / tickSize);
  const priceLevels: PriceLevel[] = [];
  
  let maxVolume = 0;
  let pocPrice = basePrice;
  
  for (let i = 0; i <= numLevels; i++) {
    const price = currentLow + (i * tickSize);
    const touchedPeriods = periods.filter(p => price >= p.low && price <= p.high).map(p => p.periodNum);
    
    // Volume distribution - more at middle prices (bell curve-ish)
    const distanceFromMid = Math.abs(price - basePrice) / range;
    const volumeMultiplier = Math.max(0.1, 1 - distanceFromMid * 1.5);
    const volume = Math.floor((200000 + Math.random() * 800000) * volumeMultiplier);
    const buyPct = 0.4 + Math.random() * 0.2;
    
    if (volume > maxVolume) {
      maxVolume = volume;
      pocPrice = price;
    }
    
    priceLevels.push({
      price,
      volume,
      buyVolume: Math.floor(volume * buyPct),
      sellVolume: Math.floor(volume * (1 - buyPct)),
      tpoCount: touchedPeriods.length,
      periods: touchedPeriods,
      isHVN: false,
      isLVN: false,
      isPOC: false,
      isVAH: false,
      isVAL: false,
      isIBHigh: false,
      isIBLow: false,
      isSinglePrint: touchedPeriods.length === 1,
      isOpeningPrint: touchedPeriods.includes(1) && touchedPeriods.length === 1,
      isClosingPrint: touchedPeriods.includes(13) && touchedPeriods.length === 1,
    });
  }
  
  // Mark POC
  const pocLevel = priceLevels.find(p => p.price === pocPrice);
  if (pocLevel) pocLevel.isPOC = true;
  
  // Calculate VAH/VAL (70% of volume)
  const totalVol = priceLevels.reduce((s, p) => s + p.volume, 0);
  const targetVol = totalVol * 0.7;
  const pocIdx = priceLevels.findIndex(p => p.isPOC);
  
  let vaVol = priceLevels[pocIdx]?.volume || 0;
  let vahIdx = pocIdx;
  let valIdx = pocIdx;
  
  while (vaVol < targetVol && (vahIdx < priceLevels.length - 1 || valIdx > 0)) {
    const upperVol = vahIdx < priceLevels.length - 1 ? priceLevels[vahIdx + 1]?.volume || 0 : 0;
    const lowerVol = valIdx > 0 ? priceLevels[valIdx - 1]?.volume || 0 : 0;
    
    if (upperVol >= lowerVol && vahIdx < priceLevels.length - 1) {
      vahIdx++;
      vaVol += upperVol;
    } else if (valIdx > 0) {
      valIdx--;
      vaVol += lowerVol;
    } else break;
  }
  
  const vah = priceLevels[vahIdx]?.price || currentHigh;
  const val = priceLevels[valIdx]?.price || currentLow;
  
  if (priceLevels[vahIdx]) priceLevels[vahIdx].isVAH = true;
  if (priceLevels[valIdx]) priceLevels[valIdx].isVAL = true;
  
  // Initial Balance (first 2 periods)
  const ibHigh = Math.max(periods[0].high, periods[1].high);
  const ibLow = Math.min(periods[0].low, periods[1].low);
  const ibRange = ibHigh - ibLow;
  
  // Mark IB levels
  priceLevels.forEach(p => {
    if (Math.abs(p.price - ibHigh) < tickSize) p.isIBHigh = true;
    if (Math.abs(p.price - ibLow) < tickSize) p.isIBLow = true;
  });
  
  // Single prints
  const singlePrints = priceLevels
    .filter(p => p.isSinglePrint && !p.isOpeningPrint)
    .slice(0, 5)
    .map(p => ({
      price: p.price,
      type: p.price > pocPrice ? 'Extension' as const : 'Gap Down' as const,
    }));
  
  const currentPrice = periods[periods.length - 1].close;
  const totalBuy = priceLevels.reduce((s, p) => s + p.buyVolume, 0);
  const totalSell = priceLevels.reduce((s, p) => s + p.sellVolume, 0);
  const delta = totalBuy - totalSell;
  
  return {
    symbol,
    asOf: new Date().toISOString(),
    sessionDate: new Date().toISOString().split('T')[0],
    timeframe: 'Session',
    sessionOpen: periods[0].open,
    sessionHigh: currentHigh,
    sessionLow: currentLow,
    currentPrice,
    poc: pocPrice,
    vah,
    val,
    tpoPeriods: periods,
    priceLevels,
    tickSize,
    initialBalance: {
      high: ibHigh,
      low: ibLow,
      range: ibRange,
      rangeATRPct: 65,
      ibType: ibRange > range * 0.5 ? 'Wide' : ibRange < range * 0.25 ? 'Narrow' : 'Normal',
      breakout: currentHigh > ibHigh ? 'Above' : currentLow < ibLow ? 'Below' : 'None',
      breakoutDistance: currentHigh > ibHigh ? currentHigh - ibHigh : currentLow < ibLow ? ibLow - currentLow : 0,
    },
    singlePrints,
    poorHigh: priceLevels.filter(p => p.price >= currentHigh - tickSize * 3).some(p => p.tpoCount >= 3),
    poorLow: priceLevels.filter(p => p.price <= currentLow + tickSize * 3).some(p => p.tpoCount >= 3),
    valueAreaVolumePct: 70,
    valueAreaRange: ((vah - val) / pocPrice) * 100,
    pricePosition: currentPrice > vah ? 'Above VAH' : currentPrice < val ? 'Below VAL' : Math.abs(currentPrice - pocPrice) < tickSize * 5 ? 'At POC' : 'In Value Area',
    priceVsPOC: ((currentPrice - pocPrice) / pocPrice) * 100,
    totalVolume: totalVol,
    totalBuyVolume: totalBuy,
    totalSellVolume: totalSell,
    volumeDelta: delta,
    deltaSignal: delta > totalVol * 0.1 ? 'Strong Buy' : delta > totalVol * 0.03 ? 'Buy' : delta < -totalVol * 0.1 ? 'Strong Sell' : delta < -totalVol * 0.03 ? 'Sell' : 'Neutral',
    profileShape: vah - pocPrice > pocPrice - val ? 'P-Shape' : pocPrice - val > vah - pocPrice ? 'b-Shape' : 'D-Shape',
    shapeImplication: 'Balanced auction with fair value discovery',
    lvnZones: [{ low: val - range * 0.1, high: val - range * 0.05 }],
    hvnZones: [{ price: pocPrice, volumePct: 12 }],
    bias: delta > 0 ? 'Bullish' : delta < 0 ? 'Bearish' : 'Neutral',
    biasReason: `Volume delta ${delta > 0 ? 'positive' : 'negative'}, price ${currentPrice > pocPrice ? 'above' : 'below'} POC`,
    nearestSupport: val,
    nearestResistance: vah,
    insights: [
      `POC at ₹${pocPrice.toFixed(2)} with ${((maxVolume / totalVol) * 100).toFixed(1)}% of volume`,
      `IB ${ibRange > range * 0.5 ? 'wide' : 'narrow'} (${((ibRange / basePrice) * 100).toFixed(2)}% range)`,
      singlePrints.length > 0 ? `${singlePrints.length} single prints - potential revisit zones` : 'No significant single prints',
    ],
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// TPO VISUALIZATION COMPONENT (Custom Canvas-like with divs)
// ═══════════════════════════════════════════════════════════════════════════

interface TPOGridProps {
  data: VolumeProfileTPOData;
  showVolume: boolean;
}

function TPOGrid({ data, showVolume }: TPOGridProps) {
  const { priceLevels, tpoPeriods, poc, vah, val, initialBalance, currentPrice, tickSize } = data;
  
  // Filter to show reasonable number of price levels
  const visibleLevels = priceLevels.filter(p => p.tpoCount > 0 || p.isPOC || p.isVAH || p.isVAL);
  const maxTpoCount = Math.max(...visibleLevels.map(p => p.tpoCount));
  const maxVolume = Math.max(...visibleLevels.map(p => p.volume));
  
  // Sort by price descending (highest at top)
  const sortedLevels = [...visibleLevels].sort((a, b) => b.price - a.price);
  
  return (
    <div className="font-mono text-xs">
      {/* Header */}
      <div className="flex items-center border-b border-slate-700 pb-2 mb-2">
        <div className="w-20 text-slate-500">Price</div>
        <div className="flex-1 text-slate-500">TPO Distribution</div>
        {showVolume && <div className="w-24 text-right text-slate-500">Volume</div>}
        <div className="w-16 text-right text-slate-500">Delta</div>
      </div>
      
      {/* Price Levels */}
      <div className="space-y-px max-h-[400px] overflow-y-auto">
        {sortedLevels.map((level, idx) => {
          const isInVA = level.price <= vah && level.price >= val;
          const isInIB = level.price <= initialBalance.high && level.price >= initialBalance.low;
          const delta = level.buyVolume - level.sellVolume;
          const deltaPct = level.volume > 0 ? (delta / level.volume) * 100 : 0;
          
          // Determine row styling
          let rowBg = '';
          if (level.isPOC) rowBg = 'bg-amber-900/40';
          else if (level.isVAH || level.isVAL) rowBg = 'bg-purple-900/30';
          else if (isInVA) rowBg = 'bg-slate-800/30';
          
          return (
            <div key={level.price} className={`flex items-center py-0.5 ${rowBg} hover:bg-slate-700/30`}>
              {/* Price */}
              <div className={`w-20 tabular-nums ${
                level.isPOC ? 'text-amber-400 font-bold' :
                level.isVAH ? 'text-purple-400' :
                level.isVAL ? 'text-purple-400' :
                Math.abs(level.price - currentPrice) < tickSize ? 'text-cyan-400' :
                'text-slate-400'
              }`}>
                {level.price.toFixed(2)}
                {level.isPOC && ' ◄'}
                {level.isVAH && ' ▲'}
                {level.isVAL && ' ▼'}
              </div>
              
              {/* TPO Blocks */}
              <div className="flex-1 flex items-center gap-px">
                {/* IB marker */}
                {isInIB && (
                  <div className="w-1 h-4 bg-blue-500/50 mr-1" title="Initial Balance" />
                )}
                
                {/* TPO blocks for each period that touched this price */}
                {level.periods.map(periodNum => {
                  const period = tpoPeriods.find(p => p.periodNum === periodNum);
                  const isUp = period && period.close > period.open;
                  
                  return (
                    <div
                      key={periodNum}
                      className={`w-4 h-4 rounded-sm text-center leading-4 text-[10px] font-bold ${
                        level.isSinglePrint ? 'bg-cyan-600 text-cyan-100' :
                        isUp ? 'bg-emerald-600/80 text-emerald-100' : 'bg-red-600/80 text-red-100'
                      }`}
                      title={`Period ${periodNum} (${period?.time})`}
                    >
                      {/* No letter, just colored block */}
                    </div>
                  );
                })}
                
                {/* Single print indicator */}
                {level.isSinglePrint && level.tpoCount === 1 && (
                  <span className="ml-1 text-cyan-400 text-[10px]">●</span>
                )}
              </div>
              
              {/* Volume bar */}
              {showVolume && (
                <div className="w-24 flex items-center gap-1">
                  <div className="flex-1 h-3 bg-slate-800 rounded overflow-hidden flex">
                    <div 
                      className="h-full bg-emerald-600"
                      style={{ width: `${(level.buyVolume / maxVolume) * 100}%` }}
                    />
                    <div 
                      className="h-full bg-red-600"
                      style={{ width: `${(level.sellVolume / maxVolume) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* Delta */}
              <div className={`w-16 text-right tabular-nums ${deltaPct > 10 ? 'text-emerald-400' : deltaPct < -10 ? 'text-red-400' : 'text-slate-500'}`}>
                {deltaPct > 0 ? '+' : ''}{deltaPct.toFixed(0)}%
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700 text-[10px] text-slate-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-900/60 rounded"></span> POC</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-900/40 rounded"></span> VA</span>
        <span className="flex items-center gap-1"><span className="w-1 h-3 bg-blue-500/50"></span> IB</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-600/80 rounded"></span> Up</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-600/80 rounded"></span> Down</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-cyan-600 rounded"></span> Single Print</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface VolumeProfileTPOCardProps {
  data?: VolumeProfileTPOData | null;
  symbol?: string;
  isLoading?: boolean;
  error?: string | null;
}

export default function VolumeProfileTPOCard({ data, symbol, isLoading, error }: VolumeProfileTPOCardProps) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  const [view, setView] = useState<'tpo' | 'volume' | 'composite'>('tpo');
  const [showVolume, setShowVolume] = useState(true);
  const [timeframe, setTimeframe] = useState<'Session' | '3D' | '5D'>('Session');
  
  const safeData = useMemo(() => data || generateMockData(symbol || 'NIFTY'), [data, symbol]);
  
  if (isLoading) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 border-l-4 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4" />
        <div className="h-96 bg-slate-800 rounded" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <div className="text-red-400">{error}</div>
      </div>
    );
  }
  
  const {
    poc, vah, val, currentPrice, pricePosition, priceVsPOC,
    initialBalance, singlePrints, poorHigh, poorLow,
    totalBuyVolume, totalSellVolume, volumeDelta, deltaSignal,
    profileShape, shapeImplication, bias, biasReason,
    valueAreaRange, insights,
  } = safeData;
  
  const deltaPct = (totalBuyVolume + totalSellVolume) > 0 
    ? ((totalBuyVolume - totalSellVolume) / (totalBuyVolume + totalSellVolume) * 100) 
    : 0;
  
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              📊 Volume Profile + TPO
              <span className="text-sm font-normal text-slate-400">• {safeData.symbol}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Market Profile with Time-Price Opportunity analysis</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as typeof timeframe)}
              className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-sm text-white"
            >
              <option value="Session">Session</option>
              <option value="3D">3 Day</option>
              <option value="5D">5 Day</option>
            </select>
          </div>
        </div>
        
        {/* Key Levels */}
        <div className="grid grid-cols-5 gap-2">
          <div className="bg-amber-900/30 border border-amber-800 rounded-lg p-2 text-center">
            <div className="text-amber-400 text-xs mb-0.5">POC</div>
            <div className="text-lg font-bold text-white">₹{poc.toFixed(2)}</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-800 rounded-lg p-2 text-center">
            <div className="text-purple-400 text-xs mb-0.5">VAH</div>
            <div className="text-lg font-bold text-white">₹{vah.toFixed(2)}</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-800 rounded-lg p-2 text-center">
            <div className="text-purple-400 text-xs mb-0.5">VAL</div>
            <div className="text-lg font-bold text-white">₹{val.toFixed(2)}</div>
          </div>
          <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-2 text-center">
            <div className="text-blue-400 text-xs mb-0.5">IB High</div>
            <div className="text-lg font-bold text-white">₹{initialBalance.high.toFixed(2)}</div>
          </div>
          <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-2 text-center">
            <div className="text-blue-400 text-xs mb-0.5">IB Low</div>
            <div className="text-lg font-bold text-white">₹{initialBalance.low.toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      {/* View Toggle */}
      <div className="flex items-center justify-between p-2 border-b border-slate-800 bg-slate-800/30">
        <div className="flex items-center gap-1">
          <button onClick={() => setView('tpo')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'tpo' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            TPO Grid
          </button>
          <button onClick={() => setView('volume')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'volume' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            Volume Profile
          </button>
          <button onClick={() => setView('composite')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'composite' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            Analysis
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-400">
          <input type="checkbox" checked={showVolume} onChange={(e) => setShowVolume(e.target.checked)} className="rounded" />
          Show Volume
        </label>
      </div>
      
      {/* Main Content */}
      <div className="p-4">
        {view === 'tpo' && (
          <TPOGrid data={safeData} showVolume={showVolume} />
        )}
        
        {view === 'volume' && (
          <div className="space-y-4">
            {/* Visual Volume Profile (horizontal bars) */}
            <div className="space-y-px">
              {[...safeData.priceLevels]
                .filter(p => p.tpoCount > 0)
                .sort((a, b) => b.price - a.price)
                .slice(0, 30)
                .map(level => {
                  const maxVol = Math.max(...safeData.priceLevels.map(p => p.volume));
                  const pct = (level.volume / maxVol) * 100;
                  const isInVA = level.price <= vah && level.price >= val;
                  
                  return (
                    <div key={level.price} className="flex items-center gap-2">
                      <div className={`w-20 text-xs tabular-nums ${level.isPOC ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                        ₹{level.price.toFixed(2)}
                      </div>
                      <div className="flex-1 h-4 bg-slate-800 rounded overflow-hidden relative">
                        <div 
                          className={`h-full ${level.isPOC ? 'bg-amber-500' : isInVA ? 'bg-purple-500/70' : 'bg-slate-600'}`}
                          style={{ width: `${pct}%` }}
                        />
                        {/* Buy/Sell split */}
                        <div className="absolute inset-0 flex">
                          <div className="bg-emerald-500/50" style={{ width: `${(level.buyVolume / level.volume) * pct}%` }} />
                        </div>
                      </div>
                      <div className="w-16 text-xs text-slate-500 text-right">
                        {(level.volume / 100000).toFixed(1)}L
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        
        {view === 'composite' && (
          <div className="space-y-4">
            {/* Price Position & IB Analysis */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Price Position</h4>
                <div className={`text-lg font-semibold mb-2 ${
                  pricePosition === 'Above VAH' ? 'text-emerald-400' :
                  pricePosition === 'Below VAL' ? 'text-red-400' :
                  pricePosition === 'At POC' ? 'text-amber-400' : 'text-purple-400'
                }`}>
                  {pricePosition}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">vs POC</span>
                    <span className={priceVsPOC > 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {priceVsPOC > 0 ? '+' : ''}{priceVsPOC.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">VA Range</span>
                    <span className="text-white">{valueAreaRange.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Initial Balance</h4>
                <div className={`text-lg font-semibold mb-2 ${
                  initialBalance.ibType === 'Wide' ? 'text-emerald-400' :
                  initialBalance.ibType === 'Narrow' ? 'text-amber-400' : 'text-slate-300'
                }`}>
                  {initialBalance.ibType} IB
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">IB Range</span>
                    <span className="text-white">₹{initialBalance.range.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Breakout</span>
                    <span className={initialBalance.breakout === 'Above' ? 'text-emerald-400' : initialBalance.breakout === 'Below' ? 'text-red-400' : 'text-slate-400'}>
                      {initialBalance.breakout}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Volume Delta & Profile Shape */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Volume Delta</h4>
                <div className={`text-lg font-semibold mb-2 ${
                  deltaSignal.includes('Buy') ? 'text-emerald-400' :
                  deltaSignal.includes('Sell') ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {deltaSignal}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Buy Vol</span>
                    <span className="text-emerald-400">{(totalBuyVolume / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sell Vol</span>
                    <span className="text-red-400">{(totalSellVolume / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delta %</span>
                    <span className={deltaPct > 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {deltaPct > 0 ? '+' : ''}{deltaPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Profile Shape</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {profileShape === 'P-Shape' ? '🅿️' : profileShape === 'b-Shape' ? '🅱️' : '🇩'}
                  </span>
                  <span className="text-lg font-semibold text-white">{profileShape}</span>
                </div>
                <p className="text-xs text-slate-400">{shapeImplication}</p>
              </div>
            </div>
            
            {/* Single Prints & Poor Highs/Lows */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Single Prints</h4>
                {singlePrints.length > 0 ? (
                  <div className="space-y-1">
                    {singlePrints.slice(0, 4).map((sp, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-cyan-400">₹{sp.price.toFixed(2)}</span>
                        <span className="text-xs text-slate-500">{sp.type}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No single prints</p>
                )}
                <p className="text-xs text-slate-500 mt-2">Unfinished business - may revisit</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Auction Quality</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">High</span>
                    <span className={`text-sm font-medium ${poorHigh ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {poorHigh ? '⚠️ Poor (no excess)' : '✓ Healthy'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Low</span>
                    <span className={`text-sm font-medium ${poorLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {poorLow ? '⚠️ Poor (no excess)' : '✓ Healthy'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Poor highs/lows often get tested</p>
              </div>
            </div>
            
            {/* Insights */}
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-2">💡 Key Insights</h4>
              <div className="space-y-1">
                {insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-indigo-400">•</span>
                    <span className="text-slate-300">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Trading Bias */}
            <div className={`p-4 rounded-lg border ${
              bias === 'Bullish' ? 'bg-emerald-900/20 border-emerald-800' :
              bias === 'Bearish' ? 'bg-red-900/20 border-red-800' :
              'bg-slate-800/50 border-slate-700'
            }`}>
              <h4 className={`text-sm font-medium mb-1 ${
                bias === 'Bullish' ? 'text-emerald-400' :
                bias === 'Bearish' ? 'text-red-400' : 'text-slate-400'
              }`}>
                {bias === 'Bullish' ? '📈' : bias === 'Bearish' ? '📉' : '➡️'} {bias} Bias
              </h4>
              <p className="text-sm text-slate-300">{biasReason}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
