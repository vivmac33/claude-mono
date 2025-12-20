import React, { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import {
  LightweightCandlestickChart,
  type OHLCData,
  type MAOverlay,
} from "@/components/charts/LightweightChart";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
  MetricInterpretation,
  SignalStrength,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface CandlestickHeroData {
  symbol: string;
  asOf: string;
  lastPrice: number;
  change: number;
  changePct: number;
  volume: number;
  avgVolume: number;
  high52w: number;
  low52w: number;
  series: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  indicators: {
    ma20: number;
    ma50: number;
    ma200: number;
    rsi: number;
    macdLine: number;
    macdSignal: number;
    macdHist: number;
    bbUpper: number;
    bbLower: number;
  };
  pattern: string | null;
  trend: "Bullish" | "Bearish" | "Neutral";
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getCandlestickHeroOutput(data: CandlestickHeroData): CardOutput {
  const { symbol, asOf, lastPrice, change, changePct, volume, avgVolume, high52w, low52w, indicators, pattern, trend } = data;
  
  const position52w = ((lastPrice - low52w) / (high52w - low52w)) * 100;
  const volumeRatio = volume / avgVolume;
  const aboveMa200 = lastPrice > indicators.ma200;
  
  const rsiInterp: MetricInterpretation = indicators.rsi > 70 ? "overvalued" : indicators.rsi < 30 ? "undervalued" : "neutral";
  const macdInterp: MetricInterpretation = indicators.macdHist > 0 ? "bullish" : indicators.macdHist < 0 ? "bearish" : "neutral";
  const trendInterp: MetricInterpretation = trend === "Bullish" ? "bullish" : trend === "Bearish" ? "bearish" : "neutral";
  
  const keyMetrics: MetricValue[] = [
    createMetric("Price", "last_price", lastPrice, trendInterp, {
      format: "currency",
      priority: 1,
      trend: {
        direction: changePct > 0 ? "up" : changePct < 0 ? "down" : "flat",
        period: "today",
        change: changePct,
      },
    }),
    createMetric("RSI (14)", "rsi", indicators.rsi, rsiInterp, { format: "number", priority: 1 }),
    createMetric("MACD Histogram", "macd_histogram", indicators.macdHist, macdInterp, { format: "number", priority: 2 }),
    createMetric("Volume Ratio", "volume_ratio", volumeRatio, 
      volumeRatio > 1.5 ? "strong" : volumeRatio < 0.5 ? "weak" : "neutral", {
      format: "ratio",
      unit: "x avg",
      priority: 2,
    }),
  ];
  
  const insights: Insight[] = [];
  
  if (trend === "Bullish") {
    insights.push(createInsight("strength", `${symbol} is in a bullish trend`, 1, ["last_price"]));
  } else if (trend === "Bearish") {
    insights.push(createInsight("weakness", `${symbol} is in a bearish trend`, 1, ["last_price"]));
  }
  
  if (pattern) {
    const patternType = pattern.toLowerCase().includes("bullish") ? "opportunity" : 
                       pattern.toLowerCase().includes("bearish") ? "risk" : "observation";
    insights.push(createInsight(patternType as any, `Chart pattern detected: ${pattern}`, 2));
  }
  
  if (indicators.rsi > 70) {
    insights.push(createInsight("risk", "RSI above 70 indicates overbought conditions", 2, ["rsi"]));
  } else if (indicators.rsi < 30) {
    insights.push(createInsight("opportunity", "RSI below 30 indicates oversold conditions", 2, ["rsi"]));
  }
  
  const headline = trend === "Bullish"
    ? `${symbol} showing bullish technicals at ₹${lastPrice.toFixed(2)}`
    : trend === "Bearish"
    ? `${symbol} in bearish territory at ₹${lastPrice.toFixed(2)}`
    : `${symbol} trading sideways at ₹${lastPrice.toFixed(2)}`;
  
  return {
    cardId: "candlestick-hero",
    cardCategory: "technical",
    symbol,
    asOf,
    headline,
    sentiment: trend === "Bullish" ? "bullish" : trend === "Bearish" ? "bearish" : "neutral",
    confidence: volumeRatio > 1 ? "high" : "medium",
    signalStrength: 3 as SignalStrength,
    keyMetrics,
    insights,
    primaryChart: {
      type: "candlestick",
      title: "Price Chart",
      data: data.series,
      xKey: "date",
      yKey: ["open", "high", "low", "close"],
    },
    suggestedCards: ["pattern-matcher", "momentum-heatmap", "trend-strength"],
    tags: ["technical", "price", "momentum", trend.toLowerCase()],
    scoreContribution: {
      category: "momentum",
      weight: 0.2,
      score: trend === "Bullish" ? 75 : trend === "Bearish" ? 25 : 50,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface Props {
  data?: CandlestickHeroData | null;
  isLoading?: boolean;
  error?: string | null;
}

export default function CandlestickHeroCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const [showIndicators, setShowIndicators] = useState({ ma: true, bb: false });

  // Prepare chart data
  const chartData: OHLCData[] = useMemo(() => {
    if (!data) return [];
    
    const { series, lastPrice, avgVolume } = data;
    
    if (series && series.length > 0) {
      return series.slice(-60); // Use last 60 data points for fatter candles
    }
    
    // Generate mock data if none provided
    const mockData: OHLCData[] = [];
    const basePrice = lastPrice || 100;
    const now = new Date();
    
    for (let i = 59; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Skip weekends (same as TickerPage) - markets are closed
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      const dateStr = date.toISOString().split('T')[0];
      
      const volatility = 0.02;
      const drift = (Math.random() - 0.48) * volatility;
      const prevClose = mockData.length > 0 ? mockData[mockData.length - 1].close : basePrice * 0.95;
      const open = prevClose * (1 + (Math.random() - 0.5) * 0.005);
      const close = open * (1 + drift);
      const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
      const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
      const vol = avgVolume ? avgVolume * (0.5 + Math.random()) : 1000000 * (0.5 + Math.random());
      
      mockData.push({
        date: dateStr,
        open: +open.toFixed(2),
        high: +high.toFixed(2),
        low: +low.toFixed(2),
        close: +close.toFixed(2),
        volume: Math.floor(vol),
      });
    }
    
    return mockData;
  }, [data]);

  // Helper function to calculate rolling MA
  const calculateMA = (prices: number[], period: number): number[] => {
    const result: number[] = [];
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        // Not enough data points yet - use simple average of available data
        const slice = prices.slice(0, i + 1);
        result.push(slice.reduce((a, b) => a + b, 0) / slice.length);
      } else {
        // Full period available
        const slice = prices.slice(i - period + 1, i + 1);
        result.push(slice.reduce((a, b) => a + b, 0) / period);
      }
    }
    return result;
  };

  // Build MA overlays for lightweight-charts - calculate actual rolling MAs
  const maOverlays: MAOverlay[] = useMemo(() => {
    if (!chartData || chartData.length === 0 || !showIndicators.ma) return [];
    
    const closePrices = chartData.map(d => d.close);
    const result: MAOverlay[] = [];
    
    // MA20 - Blue
    if (closePrices.length >= 5) {
      result.push({
        period: 20,
        color: '#3b82f6',
        data: calculateMA(closePrices, Math.min(20, closePrices.length)),
      });
    }
    
    // MA50 - Orange/Amber
    if (closePrices.length >= 10) {
      result.push({
        period: 50,
        color: '#f59e0b',
        data: calculateMA(closePrices, Math.min(50, closePrices.length)),
      });
    }
    
    // MA200 - Green (use shorter period if not enough data)
    if (closePrices.length >= 20) {
      result.push({
        period: 200,
        color: '#10b981',
        data: calculateMA(closePrices, Math.min(200, closePrices.length)),
      });
    }
    
    return result;
  }, [chartData, showIndicators.ma]);

  // NOW CONDITIONAL RETURNS ARE SAFE
  if (isLoading) {
    return (
      <Card>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Candlestick Chart
            </CardTitle>
          <CardDescription>Loading chart…</CardDescription>
        </CardHeader>
        <CardContent><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Candlestick Chart</CardTitle>
          <CardDescription className={error ? "text-red-400" : ""}>{error || "No data available"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { symbol, asOf, lastPrice, change, changePct, volume, avgVolume, high52w, low52w, indicators, pattern, trend } = data;

  const trendBadge = {
    Bullish: <Badge variant="success">Bullish</Badge>,
    Bearish: <Badge variant="destructive">Bearish</Badge>,
    Neutral: <Badge variant="secondary">Neutral</Badge>,
  };

  return (
    <Card 
      className="overflow-hidden border-l-4" 
      style={{ borderLeftColor: changePct >= 0 ? '#10b981' : '#ef4444' }}
    >
      <CardHeader className="pb-2 bg-gradient-to-r from-slate-800/50 to-transparent">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              {symbol}
              {trendBadge[trend]}
              {pattern && <Badge variant="outline" className="text-xs border-cyan-500/50 text-cyan-400">{pattern}</Badge>}
            </CardTitle>
            <CardDescription>Technical chart • As of {asOf}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-100">₹{lastPrice.toLocaleString()}</div>
            <div className={`text-sm font-medium ${changePct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {changePct >= 0 ? "+" : ""}{change.toFixed(2)} ({changePct >= 0 ? "+" : ""}{changePct.toFixed(2)}%)
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Indicator Toggles */}
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setShowIndicators(s => ({ ...s, ma: !s.ma }))}
            className={`px-3 py-1 rounded transition-colors ${showIndicators.ma ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
          >
            MA
          </button>
          <button
            onClick={() => setShowIndicators(s => ({ ...s, bb: !s.bb }))}
            className={`px-3 py-1 rounded transition-colors ${showIndicators.bb ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
          >
            BB
          </button>
        </div>

        {/* Key Metrics Strip - Neon styled */}
        <div className="grid grid-cols-6 gap-2 text-xs">
          <div 
            className="rounded-lg px-2 py-1.5 border"
            style={{
              backgroundColor: changePct >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderColor: changePct >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
            }}
          >
            <div className="text-slate-500">LAST</div>
            <div className={`font-medium ${changePct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              ₹{lastPrice.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500">{changePct >= 0 ? "+" : ""}{changePct.toFixed(2)}%</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg px-2 py-1.5 border border-slate-700/30">
            <div className="text-slate-500">VOLUME</div>
            <div className={`font-medium ${volume > avgVolume ? 'text-cyan-400' : 'text-slate-200'}`}>
              {(volume / 1e6).toFixed(1)}M
            </div>
            <div className="text-[10px] text-slate-500">{(volume / avgVolume).toFixed(1)}x avg</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg px-2 py-1.5 border border-slate-700/30">
            <div className="text-slate-500">52W HIGH</div>
            <div className="font-medium text-slate-200">₹{high52w.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500">{((lastPrice / high52w - 1) * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg px-2 py-1.5 border border-slate-700/30">
            <div className="text-slate-500">52W LOW</div>
            <div className="font-medium text-slate-200">₹{low52w.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500">+{((lastPrice / low52w - 1) * 100).toFixed(1)}%</div>
          </div>
          <div 
            className="rounded-lg px-2 py-1.5 border"
            style={{
              backgroundColor: indicators.rsi > 70 ? 'rgba(239, 68, 68, 0.1)' : indicators.rsi < 30 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
              borderColor: indicators.rsi > 70 ? 'rgba(239, 68, 68, 0.3)' : indicators.rsi < 30 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(100, 116, 139, 0.3)',
            }}
          >
            <div className="text-slate-500">RSI(14)</div>
            <div className={`font-medium ${indicators.rsi > 70 ? "text-red-400" : indicators.rsi < 30 ? "text-emerald-400" : "text-slate-200"}`}>
              {indicators.rsi.toFixed(1)}
            </div>
          </div>
          <div 
            className="rounded-lg px-2 py-1.5 border"
            style={{
              backgroundColor: indicators.macdHist > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderColor: indicators.macdHist > 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
            }}
          >
            <div className="text-slate-500">MACD</div>
            <div className={`font-medium ${indicators.macdHist > 0 ? "text-emerald-400" : "text-red-400"}`}>
              {indicators.macdHist.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Candlestick Chart - Using real TradingView engine with Neon Glow styling */}
        <div className="relative rounded-xl overflow-hidden border border-slate-700/50">
          {/* Glow effect overlay */}
          <div 
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: `radial-gradient(ellipse at 50% 100%, ${changePct >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'} 0%, transparent 70%)`,
            }}
          />
          <LightweightCandlestickChart
            data={chartData}
            height={350}
            showVolume={true}
            maOverlays={maOverlays}
          />
          
          {/* Live price ticker */}
          <div className="absolute top-3 right-3 z-20">
            <div 
              className={`px-3 py-1.5 rounded-lg backdrop-blur-sm border ${
                changePct >= 0 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                  : 'bg-red-500/20 border-red-500/40 text-red-400'
              }`}
              style={{
                boxShadow: changePct >= 0 
                  ? '0 0 15px rgba(16, 185, 129, 0.3)' 
                  : '0 0 15px rgba(239, 68, 68, 0.3)',
              }}
            >
              <div className="text-lg font-bold">₹{lastPrice.toLocaleString()}</div>
              <div className="text-[10px] text-center">
                {changePct >= 0 ? '▲' : '▼'} {Math.abs(changePct).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Neon-styled Moving Average Summary */}
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div 
            className="rounded-lg p-2 border"
            style={{
              backgroundColor: lastPrice > indicators.ma20 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderColor: lastPrice > indicators.ma20 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
            }}
          >
            <div className="text-slate-500 flex items-center gap-1">
              <span className="w-2 h-0.5 bg-blue-500 rounded" /> MA20
            </div>
            <div className={`font-medium ${lastPrice > indicators.ma20 ? "text-emerald-400" : "text-red-400"}`}>
              ₹{indicators.ma20.toLocaleString()}
            </div>
            <div className="text-[9px] text-slate-500">
              {lastPrice > indicators.ma20 ? '▲ Above' : '▼ Below'}
            </div>
          </div>
          <div 
            className="rounded-lg p-2 border"
            style={{
              backgroundColor: lastPrice > indicators.ma50 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderColor: lastPrice > indicators.ma50 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
            }}
          >
            <div className="text-slate-500 flex items-center gap-1">
              <span className="w-2 h-0.5 bg-amber-500 rounded" /> MA50
            </div>
            <div className={`font-medium ${lastPrice > indicators.ma50 ? "text-emerald-400" : "text-red-400"}`}>
              ₹{indicators.ma50.toLocaleString()}
            </div>
            <div className="text-[9px] text-slate-500">
              {lastPrice > indicators.ma50 ? '▲ Above' : '▼ Below'}
            </div>
          </div>
          <div 
            className="rounded-lg p-2 border"
            style={{
              backgroundColor: lastPrice > indicators.ma200 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderColor: lastPrice > indicators.ma200 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
            }}
          >
            <div className="text-slate-500 flex items-center gap-1">
              <span className="w-2 h-0.5 bg-emerald-500 rounded" /> MA200
            </div>
            <div className={`font-medium ${lastPrice > indicators.ma200 ? "text-emerald-400" : "text-red-400"}`}>
              ₹{indicators.ma200.toLocaleString()}
            </div>
            <div className="text-[9px] text-slate-500">
              {lastPrice > indicators.ma200 ? '▲ Above' : '▼ Below'}
            </div>
          </div>
          <div 
            className="rounded-lg p-2 border"
            style={{
              backgroundColor: indicators.rsi > 70 ? 'rgba(239, 68, 68, 0.1)' : indicators.rsi < 30 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
              borderColor: indicators.rsi > 70 ? 'rgba(239, 68, 68, 0.3)' : indicators.rsi < 30 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(100, 116, 139, 0.3)',
            }}
          >
            <div className="text-slate-500">RSI(14)</div>
            <div className={`font-medium ${indicators.rsi > 70 ? "text-red-400" : indicators.rsi < 30 ? "text-emerald-400" : "text-slate-300"}`}>
              {indicators.rsi.toFixed(1)}
            </div>
            <div className="text-[9px] text-slate-500">
              {indicators.rsi > 70 ? 'Overbought' : indicators.rsi < 30 ? 'Oversold' : 'Neutral'}
            </div>
          </div>
        </div>

        <InterpretationFooter variant={trend === "Bullish" ? "success" : trend === "Bearish" ? "warning" : "neutral"}>
          {trend} trend with price {lastPrice > indicators.ma50 ? "above" : "below"} MA50.
          RSI at {indicators.rsi.toFixed(0)} indicates {indicators.rsi > 70 ? "overbought" : indicators.rsi < 30 ? "oversold" : "neutral"} conditions.
          {pattern ? ` ${pattern} pattern detected.` : ""}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
