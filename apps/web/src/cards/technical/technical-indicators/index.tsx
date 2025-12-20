import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricStrip } from "@/components/shared/MetricBox";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import { ScoreGauge } from "@/components/shared/ScoreGauge";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface TechnicalIndicatorsData {
  symbol: string;
  asOf: string;
  overallSignal: "Strong Buy" | "Buy" | "Neutral" | "Sell" | "Strong Sell";
  score: number;
  indicators: {
    rsi: { value: number; signal: string };
    macd: { value: number; signal: string; histogram: number };
    stochastic: { k: number; d: number; signal: string };
    adx: { value: number; signal: string };
    cci: { value: number; signal: string };
    williamsR: { value: number; signal: string };
  };
  movingAverages: {
    sma20: { value: number; signal: string };
    sma50: { value: number; signal: string };
    sma200: { value: number; signal: string };
    ema20: { value: number; signal: string };
  };
  summary: { bullish: number; bearish: number; neutral: number };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getTechnicalIndicatorsOutput(data: TechnicalIndicatorsData): CardOutput {
  const { symbol, asOf, overallSignal, score, indicators, movingAverages, summary } = data;
  
  const isBullish = overallSignal.includes("Buy");
  const isBearish = overallSignal.includes("Sell");
  const sentiment = isBullish ? "bullish" : isBearish ? "bearish" : "neutral";
  const signalStrength = overallSignal.includes("Strong") ? 5 : isBullish || isBearish ? 4 : 3;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Technical Score", "ti_score", score, 
      score > 70 ? "excellent" : score > 50 ? "good" : score > 30 ? "fair" : "poor",
      { format: "score", priority: 1 }),
    createMetric("RSI (14)", "ti_rsi", indicators.rsi.value, 
      indicators.rsi.value > 70 ? "risky" : indicators.rsi.value < 30 ? "opportunity" : "neutral",
      { format: "number", priority: 1 }),
    createMetric("MACD Histogram", "ti_macd", indicators.macd.histogram, 
      indicators.macd.histogram > 0 ? "good" : "poor",
      { format: "number", priority: 1 }),
    createMetric("Stochastic %K", "ti_stoch", indicators.stochastic.k, 
      indicators.stochastic.k > 80 ? "risky" : indicators.stochastic.k < 20 ? "opportunity" : "neutral",
      { format: "number", priority: 2 }),
    createMetric("ADX", "ti_adx", indicators.adx.value, 
      indicators.adx.value > 25 ? "excellent" : "fair",
      { format: "number", priority: 2 }),
    createMetric("Bullish Signals", "ti_bullish", summary.bullish, "good", 
      { format: "number", priority: 2 }),
    createMetric("Bearish Signals", "ti_bearish", summary.bearish, "poor", 
      { format: "number", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // Overall signal
  if (overallSignal === "Strong Buy") {
    insights.push(createInsight("strength", `Strong buy signal: ${summary.bullish}/${summary.bullish + summary.bearish + summary.neutral} indicators bullish`, 1, ["ti_bullish"]));
  } else if (overallSignal === "Strong Sell") {
    insights.push(createInsight("weakness", `Strong sell signal: ${summary.bearish}/${summary.bullish + summary.bearish + summary.neutral} indicators bearish`, 1, ["ti_bearish"]));
  }
  
  // RSI
  if (indicators.rsi.value > 70) {
    insights.push(createInsight("risk", `Overbought RSI at ${indicators.rsi.value.toFixed(0)} - potential pullback`, 2, ["ti_rsi"]));
  } else if (indicators.rsi.value < 30) {
    insights.push(createInsight("opportunity", `Oversold RSI at ${indicators.rsi.value.toFixed(0)} - potential bounce`, 2, ["ti_rsi"]));
  }
  
  // MACD
  if (indicators.macd.histogram > 0 && indicators.macd.signal.toLowerCase().includes("bullish")) {
    insights.push(createInsight("strength", "MACD bullish crossover - momentum positive", 2, ["ti_macd"]));
  } else if (indicators.macd.histogram < 0 && indicators.macd.signal.toLowerCase().includes("bearish")) {
    insights.push(createInsight("weakness", "MACD bearish crossover - momentum negative", 2, ["ti_macd"]));
  }
  
  // Trend strength
  if (indicators.adx.value > 25) {
    insights.push(createInsight("observation", `Strong trend in place: ADX at ${indicators.adx.value.toFixed(0)}`, 3, ["ti_adx"]));
  }
  
  const headline = `${symbol} ${overallSignal.toLowerCase()}: ${summary.bullish} bullish, ${summary.bearish} bearish, ${summary.neutral} neutral signals`;
  
  return {
    cardId: "technical-indicators",
    cardCategory: "technical",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["trend-strength", "momentum-heatmap", "pattern-matcher"],
    tags: ["technical", overallSignal.toLowerCase().replace(" ", "-")],
    scoreContribution: {
      category: "momentum",
      score,
      weight: 0.15,
    },
  };
}

interface Props { data?: TechnicalIndicatorsData; isLoading?: boolean; error?: string | null; }

// MA Ribbon Component - Visual representation of MA stacking
function MARibbon({ movingAverages, currentPrice }: { movingAverages: TechnicalIndicatorsData['movingAverages']; currentPrice?: number }) {
  const mas = [
    { label: 'EMA20', value: movingAverages.ema20.value, signal: movingAverages.ema20.signal, color: '#22d3ee' },
    { label: 'SMA20', value: movingAverages.sma20.value, signal: movingAverages.sma20.signal, color: '#3b82f6' },
    { label: 'SMA50', value: movingAverages.sma50.value, signal: movingAverages.sma50.signal, color: '#8b5cf6' },
    { label: 'SMA200', value: movingAverages.sma200.value, signal: movingAverages.sma200.signal, color: '#f59e0b' },
  ].sort((a, b) => b.value - a.value);
  
  const minVal = Math.min(...mas.map(m => m.value));
  const maxVal = Math.max(...mas.map(m => m.value));
  const range = maxVal - minVal || 1;
  
  // Check if bullish stacking (shorter MAs above longer)
  const isBullishStack = movingAverages.ema20.value > movingAverages.sma50.value && 
                         movingAverages.sma50.value > movingAverages.sma200.value;
  const isBearishStack = movingAverages.ema20.value < movingAverages.sma50.value && 
                         movingAverages.sma50.value < movingAverages.sma200.value;
  
  return (
    <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase text-slate-500">MA Ribbon</span>
        <span className={`text-[10px] px-2 py-0.5 rounded ${
          isBullishStack ? 'bg-emerald-500/20 text-emerald-400' : 
          isBearishStack ? 'bg-red-500/20 text-red-400' : 
          'bg-slate-700 text-slate-400'
        }`}>
          {isBullishStack ? '↑ BULLISH STACK' : isBearishStack ? '↓ BEARISH STACK' : '⟷ MIXED'}
        </span>
      </div>
      
      <div className="relative h-24">
        {/* Ribbon lines */}
        {mas.map((ma, i) => {
          const top = ((maxVal - ma.value) / range) * 80 + 10;
          const isBullish = ma.signal.toLowerCase().includes('buy');
          
          return (
            <div key={ma.label} className="absolute left-0 right-0" style={{ top: `${top}%` }}>
              {/* Line */}
              <div 
                className="h-1 rounded-full transition-all duration-300"
                style={{ 
                  backgroundColor: ma.color,
                  boxShadow: `0 0 8px ${ma.color}50`,
                }}
              />
              {/* Label */}
              <div className="absolute -left-1 -top-4 flex items-center gap-1">
                <span className="text-[9px] font-medium" style={{ color: ma.color }}>{ma.label}</span>
                <span className="text-[8px] text-slate-500">₹{ma.value.toFixed(0)}</span>
              </div>
              {/* Signal dot */}
              <div 
                className="absolute right-0 -top-1 w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: isBullish ? '#10b981' : '#ef4444',
                }}
              />
            </div>
          );
        })}
        
        {/* Current price marker if available */}
        {currentPrice && (
          <div 
            className="absolute left-0 right-0 flex items-center"
            style={{ top: `${((maxVal - currentPrice) / range) * 80 + 10}%` }}
          >
            <div className="flex-1 h-px bg-white/50 border-dashed" />
            <span className="px-1.5 py-0.5 bg-white text-slate-900 text-[9px] font-bold rounded">
              CMP
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TechnicalIndicatorsCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  if (isLoading) return <Card className="overflow-hidden"><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Technical Indicators
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden"><CardHeader className={categoryStyle.headerBg}><CardTitle>Technical Indicators</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden"><CardHeader className={categoryStyle.headerBg}><CardTitle>Technical Indicators</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  const signalColor = (sig: string) => sig.toLowerCase().includes("buy") ? "text-emerald-400" : sig.toLowerCase().includes("sell") ? "text-red-400" : "text-slate-400";
  const accentColor = data.overallSignal.includes("Buy") ? '#10b981' : data.overallSignal.includes("Sell") ? '#ef4444' : '#6366f1';

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: accentColor }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Technical Indicators
              <Badge variant={data.overallSignal.includes("Buy") ? "success" : data.overallSignal.includes("Sell") ? "destructive" : "secondary"}>{data.overallSignal}</Badge>
            </CardTitle>
            <CardDescription>{data.symbol} • Oscillators & MAs • {data.asOf}</CardDescription>
          </div>
          <ScoreGauge value={data.score} max={100} label="Score" size={60} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Signal Summary */}
        <div className="flex justify-center gap-6 py-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{data.summary.bullish}</div>
            <div className="text-[9px] text-slate-500 uppercase">Bullish</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-400">{data.summary.neutral}</div>
            <div className="text-[9px] text-slate-500 uppercase">Neutral</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{data.summary.bearish}</div>
            <div className="text-[9px] text-slate-500 uppercase">Bearish</div>
          </div>
        </div>
        
        {/* MA Ribbon */}
        <MARibbon movingAverages={data.movingAverages} />
        
        {/* Oscillators Grid */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Oscillators</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "RSI(14)", value: data.indicators.rsi.value, signal: data.indicators.rsi.signal },
              { label: "Stoch %K", value: data.indicators.stochastic.k, signal: data.indicators.stochastic.signal },
              { label: "CCI(20)", value: data.indicators.cci.value, signal: data.indicators.cci.signal },
              { label: "ADX(14)", value: data.indicators.adx.value, signal: data.indicators.adx.signal },
              { label: "Williams %R", value: data.indicators.williamsR.value, signal: data.indicators.williamsR.signal },
              { label: "MACD Hist", value: data.indicators.macd.histogram, signal: data.indicators.macd.signal },
            ].map((ind) => (
              <div key={ind.label} className="rounded-lg bg-slate-800/50 p-2 border border-slate-700/30">
                <div className="text-[9px] text-slate-500">{ind.label}</div>
                <div className="text-sm font-semibold text-slate-200">{ind.value.toFixed(1)}</div>
                <div className={`text-[9px] font-medium ${signalColor(ind.signal)}`}>{ind.signal}</div>
              </div>
            ))}
          </div>
        </div>
        
        <InterpretationFooter variant={data.overallSignal.includes("Buy") ? "success" : data.overallSignal.includes("Sell") ? "warning" : "info"}>
          {data.summary.bullish} bullish, {data.summary.bearish} bearish signals. RSI {data.indicators.rsi.value.toFixed(0)} is {data.indicators.rsi.value > 70 ? "overbought" : data.indicators.rsi.value < 30 ? "oversold" : "neutral"}.
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
