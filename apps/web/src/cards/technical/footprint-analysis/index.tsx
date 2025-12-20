// ═══════════════════════════════════════════════════════════════════════════
// FOOTPRINT ANALYSIS
// Order flow analysis showing buy/sell volume at each price level per candle
// Uses 15-min aggregated data to show institutional activity patterns
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

interface PriceLevelFlow {
  price: number;
  bidVolume: number; // Sold at bid (selling pressure)
  askVolume: number; // Bought at ask (buying pressure)
  delta: number; // askVolume - bidVolume
  totalVolume: number;
  imbalance: number; // Ratio of dominant side
  imbalanceType: 'buy' | 'sell' | 'none';
  isStacked: boolean; // Part of stacked imbalance
}

interface FootprintCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  delta: number; // Candle-level delta
  cumulativeDelta: number;
  priceLevels: PriceLevelFlow[];
  poc: number; // Point of Control for this candle
  stackedImbalances: {
    type: 'buy' | 'sell';
    startPrice: number;
    endPrice: number;
    count: number;
  }[];
  absorption: {
    detected: boolean;
    type: 'buy' | 'sell';
    price: number;
    volume: number;
  } | null;
}

interface SessionStats {
  totalBuyVolume: number;
  totalSellVolume: number;
  sessionDelta: number;
  cumulativeDelta: number;
  maxDelta: number;
  minDelta: number;
  buyImbalances: number;
  sellImbalances: number;
  absorptionEvents: number;
  dominantFlow: 'buyers' | 'sellers' | 'balanced';
}

export interface FootprintAnalysisData {
  symbol: string;
  asOf: string;
  timeframe: '5min' | '15min' | '30min';
  candles: FootprintCandle[];
  sessionStats: SessionStats;
  keyLevels: {
    price: number;
    type: 'support' | 'resistance' | 'absorption';
    strength: number;
  }[];
  insights: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

export function getFootprintAnalysisOutput(data: FootprintAnalysisData): CardOutput {
  const { symbol, sessionStats, keyLevels } = data;
  const { sessionDelta, dominantFlow, buyImbalances, sellImbalances } = sessionStats;
  
  const sentiment = dominantFlow === 'buyers' ? 'bullish' : dominantFlow === 'sellers' ? 'bearish' : 'neutral';
  const signalStrength = Math.abs(sessionDelta) > sessionStats.totalBuyVolume * 0.15 ? 5 : Math.abs(sessionDelta) > sessionStats.totalBuyVolume * 0.08 ? 4 : 3;
  
  return {
    cardId: "footprint-analysis",
    symbol,
    generatedAt: new Date().toISOString(),
    summary: {
      headline: `${symbol}: ${dominantFlow === 'buyers' ? 'Buyer' : dominantFlow === 'sellers' ? 'Seller' : 'Balanced'} control, Delta ${sessionDelta > 0 ? '+' : ''}${(sessionDelta / 100000).toFixed(1)}L`,
      body: `${buyImbalances} buy imbalances, ${sellImbalances} sell imbalances. ${keyLevels.length} key levels identified.`,
      sentiment,
      signalStrength,
    },
    metrics: [
      createMetric("Session Delta", sessionDelta, { format: "number" }),
      createMetric("Buy Imbalances", buyImbalances, { format: "number" }),
      createMetric("Sell Imbalances", sellImbalances, { format: "number" }),
    ],
    insights: data.insights.map((text, i) => createInsight(text, i === 0 ? "high" : "medium", "neutral")),
    metadata: { dataAsOf: data.asOf, timeframe: data.timeframe },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

function generateMockData(symbol: string = 'NIFTY'): FootprintAnalysisData {
  const basePrice = symbol === 'NIFTY' ? 24500 : 3500;
  const tickSize = symbol === 'NIFTY' ? 0.05 : 0.05;
  
  const candles: FootprintCandle[] = [];
  let cumulativeDelta = 0;
  let totalBuy = 0;
  let totalSell = 0;
  let buyImbalances = 0;
  let sellImbalances = 0;
  let absorptionEvents = 0;
  
  // Generate 26 candles (15-min from 9:15 to 3:30)
  for (let i = 0; i < 26; i++) {
    const hour = Math.floor(i / 4) + 9;
    const min = (i % 4) * 15 + 15;
    const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    
    // Simulate price movement with trend bias
    const trend = Math.sin(i / 8) * 0.3 + (Math.random() - 0.5) * 0.4;
    const range = basePrice * (0.002 + Math.random() * 0.003);
    const midPoint = basePrice + trend * basePrice * 0.005;
    
    const open = midPoint - range * (0.3 + Math.random() * 0.4);
    const close = midPoint + range * (0.3 + Math.random() * 0.4) * (Math.random() > 0.5 ? 1 : -1);
    const high = Math.max(open, close) + range * 0.2 * Math.random();
    const low = Math.min(open, close) - range * 0.2 * Math.random();
    
    // Generate price levels within this candle
    const numLevels = Math.ceil((high - low) / tickSize);
    const priceLevels: PriceLevelFlow[] = [];
    let candleBuyVol = 0;
    let candleSellVol = 0;
    let candlePOC = midPoint;
    let maxLevelVol = 0;
    
    const stackedImbalances: FootprintCandle['stackedImbalances'] = [];
    let currentStack: { type: 'buy' | 'sell'; prices: number[] } | null = null;
    
    for (let j = 0; j <= numLevels; j++) {
      const price = low + j * tickSize;
      
      // Volume distribution - more at middle, less at extremes
      const distFromMid = Math.abs(price - midPoint) / range;
      const volMultiplier = Math.max(0.2, 1 - distFromMid);
      const levelVol = Math.floor((20000 + Math.random() * 80000) * volMultiplier);
      
      // Determine buy/sell split based on candle direction and position
      const isUpCandle = close > open;
      const isUpperHalf = price > midPoint;
      let buyPct = 0.5;
      
      if (isUpCandle) {
        buyPct = isUpperHalf ? 0.55 + Math.random() * 0.15 : 0.5 + Math.random() * 0.1;
      } else {
        buyPct = isUpperHalf ? 0.4 - Math.random() * 0.1 : 0.35 - Math.random() * 0.15;
      }
      
      const askVol = Math.floor(levelVol * buyPct);
      const bidVol = levelVol - askVol;
      const delta = askVol - bidVol;
      const imbalanceRatio = askVol > bidVol ? askVol / bidVol : bidVol / askVol;
      
      const hasImbalance = imbalanceRatio >= 2.5;
      const imbalanceType = hasImbalance ? (askVol > bidVol ? 'buy' : 'sell') : 'none';
      
      if (hasImbalance) {
        if (imbalanceType === 'buy') buyImbalances++;
        else sellImbalances++;
        
        // Track stacked imbalances
        if (currentStack && currentStack.type === imbalanceType) {
          currentStack.prices.push(price);
        } else {
          if (currentStack && currentStack.prices.length >= 3) {
            stackedImbalances.push({
              type: currentStack.type,
              startPrice: currentStack.prices[0],
              endPrice: currentStack.prices[currentStack.prices.length - 1],
              count: currentStack.prices.length,
            });
          }
          currentStack = { type: imbalanceType as 'buy' | 'sell', prices: [price] };
        }
      } else {
        if (currentStack && currentStack.prices.length >= 3) {
          stackedImbalances.push({
            type: currentStack.type,
            startPrice: currentStack.prices[0],
            endPrice: currentStack.prices[currentStack.prices.length - 1],
            count: currentStack.prices.length,
          });
        }
        currentStack = null;
      }
      
      priceLevels.push({
        price,
        bidVolume: bidVol,
        askVolume: askVol,
        delta,
        totalVolume: levelVol,
        imbalance: imbalanceRatio,
        imbalanceType,
        isStacked: false,
      });
      
      candleBuyVol += askVol;
      candleSellVol += bidVol;
      
      if (levelVol > maxLevelVol) {
        maxLevelVol = levelVol;
        candlePOC = price;
      }
    }
    
    // Mark stacked imbalances in price levels
    stackedImbalances.forEach(stack => {
      priceLevels.forEach(pl => {
        if (pl.price >= Math.min(stack.startPrice, stack.endPrice) && 
            pl.price <= Math.max(stack.startPrice, stack.endPrice)) {
          pl.isStacked = true;
        }
      });
    });
    
    const candleDelta = candleBuyVol - candleSellVol;
    cumulativeDelta += candleDelta;
    totalBuy += candleBuyVol;
    totalSell += candleSellVol;
    
    // Detect absorption (high volume but little price movement)
    const priceMove = Math.abs(close - open);
    const expectedMove = (candleBuyVol + candleSellVol) / 10000000; // Rough heuristic
    const absorption = priceMove < expectedMove * 0.3 && (candleBuyVol + candleSellVol) > 800000 ? {
      detected: true,
      type: candleDelta > 0 ? 'sell' as const : 'buy' as const,
      price: candleDelta > 0 ? high : low,
      volume: candleBuyVol + candleSellVol,
    } : null;
    
    if (absorption) absorptionEvents++;
    
    candles.push({
      time,
      open,
      high,
      low,
      close,
      volume: candleBuyVol + candleSellVol,
      delta: candleDelta,
      cumulativeDelta,
      priceLevels,
      poc: candlePOC,
      stackedImbalances,
      absorption,
    });
  }
  
  // Identify key levels
  const allLevels = candles.flatMap(c => c.priceLevels);
  const volumeByPrice = new Map<number, { buy: number; sell: number; count: number }>();
  
  allLevels.forEach(pl => {
    const roundedPrice = Math.round(pl.price * 20) / 20; // Round to nearest 0.05
    const existing = volumeByPrice.get(roundedPrice) || { buy: 0, sell: 0, count: 0 };
    volumeByPrice.set(roundedPrice, {
      buy: existing.buy + pl.askVolume,
      sell: existing.sell + pl.bidVolume,
      count: existing.count + 1,
    });
  });
  
  const keyLevels = Array.from(volumeByPrice.entries())
    .map(([price, data]) => ({
      price,
      type: data.buy > data.sell * 1.5 ? 'support' as const : data.sell > data.buy * 1.5 ? 'resistance' as const : 'absorption' as const,
      strength: (data.buy + data.sell) / 1000000,
    }))
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 5);
  
  const sessionDelta = totalBuy - totalSell;
  const dominantFlow = sessionDelta > totalBuy * 0.08 ? 'buyers' : sessionDelta < -totalBuy * 0.08 ? 'sellers' : 'balanced';
  
  return {
    symbol,
    asOf: new Date().toISOString(),
    timeframe: '15min',
    candles,
    sessionStats: {
      totalBuyVolume: totalBuy,
      totalSellVolume: totalSell,
      sessionDelta,
      cumulativeDelta,
      maxDelta: Math.max(...candles.map(c => c.cumulativeDelta)),
      minDelta: Math.min(...candles.map(c => c.cumulativeDelta)),
      buyImbalances,
      sellImbalances,
      absorptionEvents,
      dominantFlow,
    },
    keyLevels,
    insights: [
      `Session delta ${sessionDelta > 0 ? '+' : ''}${(sessionDelta / 100000).toFixed(1)}L - ${dominantFlow} in control`,
      `${buyImbalances} buy vs ${sellImbalances} sell imbalances (${buyImbalances > sellImbalances ? 'bullish' : 'bearish'} skew)`,
      absorptionEvents > 0 ? `${absorptionEvents} absorption events detected - potential reversal zones` : 'No significant absorption',
      candles.some(c => c.stackedImbalances.length > 0) ? 'Stacked imbalances present - strong directional pressure' : '',
    ].filter(Boolean),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

interface FootprintCandleViewProps {
  candle: FootprintCandle;
  maxVolume: number;
  tickSize: number;
}

function FootprintCandleView({ candle, maxVolume, tickSize }: FootprintCandleViewProps) {
  const isUp = candle.close > candle.open;
  const sortedLevels = [...candle.priceLevels].sort((a, b) => b.price - a.price);
  
  // Show only levels with meaningful volume (top 80%)
  const volThreshold = Math.max(...sortedLevels.map(l => l.totalVolume)) * 0.1;
  const visibleLevels = sortedLevels.filter(l => l.totalVolume > volThreshold);
  
  return (
    <div className="bg-slate-800/30 rounded-lg p-2 min-w-[140px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 text-xs">
        <span className="text-slate-400">{candle.time}</span>
        <span className={`font-medium ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
          Δ {candle.delta > 0 ? '+' : ''}{(candle.delta / 1000).toFixed(0)}K
        </span>
      </div>
      
      {/* Price levels */}
      <div className="space-y-px text-[10px] font-mono max-h-[200px] overflow-y-auto">
        {visibleLevels.map((level, idx) => {
          const isPOC = Math.abs(level.price - candle.poc) < tickSize;
          const atHigh = Math.abs(level.price - candle.high) < tickSize;
          const atLow = Math.abs(level.price - candle.low) < tickSize;
          
          return (
            <div 
              key={level.price}
              className={`flex items-center gap-1 py-0.5 px-1 rounded ${
                isPOC ? 'bg-amber-900/40' :
                level.isStacked ? (level.imbalanceType === 'buy' ? 'bg-emerald-900/30' : 'bg-red-900/30') :
                ''
              }`}
            >
              {/* Bid (Sell) */}
              <div className={`w-10 text-right ${level.imbalanceType === 'sell' ? 'text-red-400 font-bold' : 'text-red-400/70'}`}>
                {(level.bidVolume / 1000).toFixed(0)}
              </div>
              
              {/* Price */}
              <div className={`w-14 text-center ${
                isPOC ? 'text-amber-400 font-bold' :
                atHigh || atLow ? 'text-cyan-400' :
                'text-slate-500'
              }`}>
                {level.price.toFixed(2)}
              </div>
              
              {/* Ask (Buy) */}
              <div className={`w-10 text-left ${level.imbalanceType === 'buy' ? 'text-emerald-400 font-bold' : 'text-emerald-400/70'}`}>
                {(level.askVolume / 1000).toFixed(0)}
              </div>
              
              {/* Imbalance indicator */}
              {level.imbalanceType !== 'none' && (
                <span className={`text-[8px] ${level.imbalanceType === 'buy' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {level.isStacked ? '██' : '█'}
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between text-[10px]">
        <span className="text-slate-500">Vol: {(candle.volume / 100000).toFixed(1)}L</span>
        <span className={`${candle.cumulativeDelta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          Σ {candle.cumulativeDelta > 0 ? '+' : ''}{(candle.cumulativeDelta / 100000).toFixed(1)}L
        </span>
      </div>
      
      {/* Stacked imbalance indicator */}
      {candle.stackedImbalances.length > 0 && (
        <div className="mt-1 text-[9px]">
          {candle.stackedImbalances.map((si, i) => (
            <div key={i} className={`${si.type === 'buy' ? 'text-emerald-400' : 'text-red-400'}`}>
              ⚡ {si.count}x {si.type} stack
            </div>
          ))}
        </div>
      )}
      
      {/* Absorption indicator */}
      {candle.absorption && (
        <div className="mt-1 text-[9px] text-amber-400">
          🛑 Absorption @ {candle.absorption.price.toFixed(2)}
        </div>
      )}
    </div>
  );
}

function DeltaChart({ candles }: { candles: FootprintCandle[] }) {
  const maxDelta = Math.max(...candles.map(c => Math.abs(c.cumulativeDelta)));
  
  return (
    <div className="bg-slate-800/30 rounded-lg p-4">
      <h4 className="text-sm font-medium text-slate-300 mb-3">Cumulative Delta</h4>
      <div className="flex items-end gap-1 h-24">
        {candles.map((candle, i) => {
          const height = (Math.abs(candle.cumulativeDelta) / maxDelta) * 100;
          const isPositive = candle.cumulativeDelta >= 0;
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div 
                className={`w-full rounded-t ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ height: `${height}%` }}
                title={`${candle.time}: ${(candle.cumulativeDelta / 100000).toFixed(2)}L`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
        <span>{candles[0]?.time}</span>
        <span>{candles[candles.length - 1]?.time}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface FootprintAnalysisCardProps {
  data?: FootprintAnalysisData | null;
  symbol?: string;
  isLoading?: boolean;
  error?: string | null;
}

export default function FootprintAnalysisCard({ data, symbol, isLoading, error }: FootprintAnalysisCardProps) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  const [view, setView] = useState<'footprint' | 'delta' | 'summary'>('footprint');
  const [selectedRange, setSelectedRange] = useState<'all' | 'recent'>('recent');
  
  // Ensure we have valid data with all required fields
  const safeData = useMemo(() => {
    if (data && data.candles && data.candles.length > 0 && data.sessionStats && data.keyLevels) {
      return data;
    }
    return generateMockData(symbol || 'NIFTY');
  }, [data, symbol]);
  
  if (isLoading) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 border-l-4 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4" />
        <div className="h-64 bg-slate-800 rounded" />
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
  
  const { candles, sessionStats, keyLevels, insights } = safeData;
  const visibleCandles = selectedRange === 'recent' ? candles.slice(-8) : candles;
  const maxVolume = Math.max(...candles.flatMap(c => c.priceLevels.map(p => p.totalVolume)));
  
  const deltaPct = (sessionStats.totalBuyVolume + sessionStats.totalSellVolume) > 0
    ? ((sessionStats.sessionDelta) / (sessionStats.totalBuyVolume + sessionStats.totalSellVolume) * 100)
    : 0;
  
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              👣 Footprint Analysis
              <span className="text-sm font-normal text-slate-400">• {safeData.symbol} • {safeData.timeframe}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Order flow analysis with bid/ask volume per price level</p>
          </div>
        </div>
        
        {/* Session Stats */}
        <div className="grid grid-cols-5 gap-2">
          <div className={`rounded-lg p-2 text-center ${sessionStats.dominantFlow === 'buyers' ? 'bg-emerald-900/30 border border-emerald-800' : sessionStats.dominantFlow === 'sellers' ? 'bg-red-900/30 border border-red-800' : 'bg-slate-800/50'}`}>
            <div className="text-xs text-slate-400 mb-0.5">Session Delta</div>
            <div className={`text-lg font-bold ${sessionStats.sessionDelta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {sessionStats.sessionDelta > 0 ? '+' : ''}{(sessionStats.sessionDelta / 100000).toFixed(1)}L
            </div>
          </div>
          <div className="bg-emerald-900/20 rounded-lg p-2 text-center">
            <div className="text-xs text-slate-400 mb-0.5">Buy Vol</div>
            <div className="text-lg font-bold text-emerald-400">{(sessionStats.totalBuyVolume / 100000).toFixed(1)}L</div>
          </div>
          <div className="bg-red-900/20 rounded-lg p-2 text-center">
            <div className="text-xs text-slate-400 mb-0.5">Sell Vol</div>
            <div className="text-lg font-bold text-red-400">{(sessionStats.totalSellVolume / 100000).toFixed(1)}L</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-xs text-slate-400 mb-0.5">Buy Imbal</div>
            <div className="text-lg font-bold text-emerald-400">{sessionStats.buyImbalances}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-xs text-slate-400 mb-0.5">Sell Imbal</div>
            <div className="text-lg font-bold text-red-400">{sessionStats.sellImbalances}</div>
          </div>
        </div>
      </div>
      
      {/* View Toggle */}
      <div className="flex items-center justify-between p-2 border-b border-slate-800 bg-slate-800/30">
        <div className="flex items-center gap-1">
          <button onClick={() => setView('footprint')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'footprint' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            Footprint Grid
          </button>
          <button onClick={() => setView('delta')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'delta' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            Delta Profile
          </button>
          <button onClick={() => setView('summary')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'summary' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            Summary
          </button>
        </div>
        {view === 'footprint' && (
          <div className="flex items-center gap-1">
            <button onClick={() => setSelectedRange('recent')} className={`px-2 py-1 rounded text-xs ${selectedRange === 'recent' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>
              Recent 8
            </button>
            <button onClick={() => setSelectedRange('all')} className={`px-2 py-1 rounded text-xs ${selectedRange === 'all' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>
              All
            </button>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="p-4">
        {view === 'footprint' && (
          <div className="overflow-x-auto">
            <div className="flex gap-2 pb-2" style={{ minWidth: visibleCandles.length * 150 }}>
              {visibleCandles.map((candle, i) => (
                <FootprintCandleView key={i} candle={candle} maxVolume={maxVolume} tickSize={0.05} />
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700 text-[10px] text-slate-500">
              <span>Bid×Ask format</span>
              <span className="flex items-center gap-1"><span className="text-emerald-400 font-bold">Bold</span> = Buy imbalance (3:1+)</span>
              <span className="flex items-center gap-1"><span className="text-red-400 font-bold">Bold</span> = Sell imbalance (3:1+)</span>
              <span className="flex items-center gap-1"><span className="text-emerald-400">██</span> = Stacked</span>
              <span className="flex items-center gap-1"><span className="text-amber-400">●</span> = POC</span>
            </div>
          </div>
        )}
        
        {view === 'delta' && (
          <div className="space-y-4">
            <DeltaChart candles={candles} />
            
            {/* Delta stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-500 mb-1">Max Cum. Delta</div>
                <div className="text-lg font-bold text-emerald-400">+{(sessionStats.maxDelta / 100000).toFixed(2)}L</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-500 mb-1">Min Cum. Delta</div>
                <div className="text-lg font-bold text-red-400">{(sessionStats.minDelta / 100000).toFixed(2)}L</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-500 mb-1">Delta %</div>
                <div className={`text-lg font-bold ${deltaPct > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {deltaPct > 0 ? '+' : ''}{deltaPct.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}
        
        {view === 'summary' && (
          <div className="space-y-4">
            {/* Flow Analysis */}
            <div className={`p-4 rounded-lg border ${
              sessionStats.dominantFlow === 'buyers' ? 'bg-emerald-900/20 border-emerald-800' :
              sessionStats.dominantFlow === 'sellers' ? 'bg-red-900/20 border-red-800' :
              'bg-slate-800/50 border-slate-700'
            }`}>
              <h4 className={`text-sm font-medium mb-2 ${
                sessionStats.dominantFlow === 'buyers' ? 'text-emerald-400' :
                sessionStats.dominantFlow === 'sellers' ? 'text-red-400' : 'text-slate-400'
              }`}>
                {sessionStats.dominantFlow === 'buyers' ? '📈 Buyers in Control' :
                 sessionStats.dominantFlow === 'sellers' ? '📉 Sellers in Control' :
                 '➡️ Balanced Flow'}
              </h4>
              <p className="text-sm text-slate-300">
                Session delta of {sessionStats.sessionDelta > 0 ? '+' : ''}{(sessionStats.sessionDelta / 100000).toFixed(2)}L 
                with {sessionStats.buyImbalances} buy and {sessionStats.sellImbalances} sell imbalances.
              </p>
            </div>
            
            {/* Key Levels */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Key Order Flow Levels</h4>
              <div className="space-y-2">
                {keyLevels.map((level, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        level.type === 'support' ? 'bg-emerald-500' :
                        level.type === 'resistance' ? 'bg-red-500' : 'bg-amber-500'
                      }`} />
                      <span className="text-sm text-white">₹{level.price.toFixed(2)}</span>
                      <span className="text-xs text-slate-500">{level.type}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Strength: {level.strength.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Absorption Events */}
            {sessionStats.absorptionEvents > 0 && (
              <div className="bg-amber-900/20 border border-amber-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-amber-400 mb-2">🛑 Absorption Detected</h4>
                <p className="text-sm text-slate-300">
                  {sessionStats.absorptionEvents} absorption event(s) - high volume with minimal price movement. 
                  These often indicate trapped traders or institutional activity.
                </p>
              </div>
            )}
            
            {/* Insights */}
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-2">💡 Insights</h4>
              <div className="space-y-1">
                {insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-indigo-400">•</span>
                    <span className="text-slate-300">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
