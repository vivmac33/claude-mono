import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricStrip } from "@/components/shared/MetricBox";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ReferenceArea } from "recharts";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface TrendStrengthData {
  symbol: string;
  asOf: string;
  trend: "Strong Uptrend" | "Uptrend" | "Sideways" | "Downtrend" | "Strong Downtrend";
  adx: { value: number; trend: "strengthening" | "weakening" | "stable" };
  diPlus: number;
  diMinus: number;
  historical: Array<{ date: string; adx: number; diPlus: number; diMinus: number; price: number }>;
  signals: { goldenCross: boolean; deathCross: boolean; supertrendBullish: boolean };
}

// ═══════════════════════════════════════════════════════════════════════════
// POWER BAR SIGNATURE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function PowerBar({ 
  adx, 
  diPlus, 
  diMinus, 
  trend 
}: { 
  adx: number; 
  diPlus: number; 
  diMinus: number; 
  trend: TrendStrengthData['trend'];
}) {
  const isBullish = diPlus > diMinus;
  const isStrong = adx >= 25;
  const isVeryStrong = adx >= 40;
  
  // ADX fill percentage (0-60 scale for visual)
  const fillPercent = Math.min(100, (adx / 60) * 100);
  
  // Direction color
  const directionColor = isBullish ? '#10b981' : '#ef4444';
  const glowColor = isBullish ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)';
  
  return (
    <div className="relative flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
      {/* Power Bar Container */}
      <div className="relative w-16 h-32">
        {/* Background track */}
        <div className="absolute inset-0 rounded-full bg-slate-900 border border-slate-700/50 overflow-hidden">
          {/* Zone indicators */}
          <div className="absolute bottom-0 left-0 right-0 h-[42%] bg-slate-800/50" /> {/* Weak zone: 0-25 */}
          <div className="absolute bottom-[42%] left-0 right-0 h-[25%] bg-amber-500/10" /> {/* Medium zone: 25-40 */}
          <div className="absolute bottom-[67%] left-0 right-0 h-[33%] bg-emerald-500/10" /> {/* Strong zone: 40-60 */}
          
          {/* Zone lines */}
          <div className="absolute bottom-[42%] left-0 right-0 h-px bg-amber-500/40" />
          <div className="absolute bottom-[67%] left-0 right-0 h-px bg-emerald-500/40" />
        </div>
        
        {/* Fill bar with glow */}
        <div 
          className="absolute bottom-0 left-1 right-1 rounded-full transition-all duration-700 ease-out"
          style={{ 
            height: `${fillPercent}%`,
            background: `linear-gradient(to top, ${directionColor}40, ${directionColor})`,
            boxShadow: isStrong ? `0 0 20px ${glowColor}, inset 0 0 10px ${glowColor}` : 'none',
          }}
        />
        
        {/* ADX value bubble */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-xs font-bold text-white transition-all duration-700"
          style={{ 
            bottom: `${fillPercent}%`,
            backgroundColor: isVeryStrong ? '#10b981' : isStrong ? '#f59e0b' : '#64748b',
            boxShadow: isStrong ? `0 0 10px ${isVeryStrong ? 'rgba(16, 185, 129, 0.5)' : 'rgba(245, 158, 11, 0.5)'}` : 'none',
          }}
        >
          {adx.toFixed(0)}
        </div>
        
        {/* Scale labels */}
        <div className="absolute -right-6 top-0 text-[8px] text-slate-500">60</div>
        <div className="absolute -right-6 top-[33%] text-[8px] text-emerald-500">40</div>
        <div className="absolute -right-6 top-[58%] text-[8px] text-amber-500">25</div>
        <div className="absolute -right-6 bottom-0 text-[8px] text-slate-500">0</div>
      </div>
      
      {/* Direction Indicator */}
      <div className="flex-1 space-y-3">
        {/* Trend Label */}
        <div className="text-center">
          <div className="text-[10px] uppercase text-slate-500 mb-1">Trend Direction</div>
          <div 
            className="text-lg font-bold"
            style={{ color: directionColor }}
          >
            {isBullish ? '▲ BULLISH' : '▼ BEARISH'}
          </div>
        </div>
        
        {/* DI Comparison */}
        <div className="relative h-8 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-600" />
          
          {/* +DI bar (from center to right) */}
          <div 
            className="absolute top-1 bottom-1 left-1/2 rounded-r-full transition-all duration-500"
            style={{ 
              width: `${Math.min(48, diPlus)}%`,
              background: 'linear-gradient(to right, #10b98150, #10b981)',
            }}
          />
          
          {/* -DI bar (from center to left) */}
          <div 
            className="absolute top-1 bottom-1 right-1/2 rounded-l-full transition-all duration-500"
            style={{ 
              width: `${Math.min(48, diMinus)}%`,
              background: 'linear-gradient(to left, #ef444450, #ef4444)',
            }}
          />
          
          {/* Labels */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-medium text-red-400">
            -{diMinus.toFixed(0)}
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-medium text-emerald-400">
            +{diPlus.toFixed(0)}
          </div>
        </div>
        
        {/* Strength Label */}
        <div className="text-center">
          <span 
            className={`text-[10px] px-2 py-0.5 rounded-full ${
              isVeryStrong ? 'bg-emerald-500/20 text-emerald-400' : 
              isStrong ? 'bg-amber-500/20 text-amber-400' : 
              'bg-slate-500/20 text-slate-400'
            }`}
          >
            {isVeryStrong ? 'VERY STRONG TREND' : isStrong ? 'STRONG TREND' : 'WEAK/NO TREND'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getTrendStrengthOutput(data: TrendStrengthData): CardOutput {
  const { symbol, asOf, trend, adx, diPlus, diMinus, signals } = data;
  
  const isUptrend = trend.includes("Up");
  const isDowntrend = trend.includes("Down");
  const isStrong = trend.includes("Strong");
  const sentiment = isUptrend ? "bullish" : isDowntrend ? "bearish" : "neutral";
  const signalStrength = isStrong ? 5 : isUptrend || isDowntrend ? 4 : 3;
  
  const keyMetrics: MetricValue[] = [
    createMetric("ADX", "ts_adx", adx.value, 
      adx.value > 40 ? "excellent" : adx.value > 25 ? "good" : "fair",
      { format: "number", priority: 1, trend: { direction: adx.trend === "strengthening" ? "up" : adx.trend === "weakening" ? "down" : "flat", period: "recent" } }),
    createMetric("+DI", "ts_di_plus", diPlus, 
      diPlus > diMinus ? "good" : "fair",
      { format: "number", priority: 1 }),
    createMetric("-DI", "ts_di_minus", diMinus, 
      diMinus > diPlus ? "poor" : "neutral",
      { format: "number", priority: 1 }),
    createMetric("DI Spread", "ts_di_spread", Math.abs(diPlus - diMinus), 
      Math.abs(diPlus - diMinus) > 15 ? "excellent" : "good",
      { format: "number", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // Trend assessment
  if (trend === "Strong Uptrend") {
    insights.push(createInsight("strength", `Strong uptrend confirmed: ADX at ${adx.value.toFixed(0)} with +DI dominant`, 1, ["ts_adx", "ts_di_plus"]));
  } else if (trend === "Strong Downtrend") {
    insights.push(createInsight("weakness", `Strong downtrend confirmed: ADX at ${adx.value.toFixed(0)} with -DI dominant`, 1, ["ts_adx", "ts_di_minus"]));
  } else if (trend === "Sideways") {
    insights.push(createInsight("observation", `No clear trend: ADX below 25 (${adx.value.toFixed(0)}) - range-bound`, 1, ["ts_adx"]));
  }
  
  // ADX trend
  if (adx.trend === "strengthening" && adx.value > 25) {
    insights.push(createInsight("strength", "Trend strengthening - ADX rising", 2, ["ts_adx"]));
  } else if (adx.trend === "weakening") {
    insights.push(createInsight("observation", "Trend weakening - ADX declining", 2, ["ts_adx"]));
  }
  
  // Signals
  if (signals.goldenCross) {
    insights.push(createInsight("strength", "Golden cross detected - bullish MA crossover", 2));
  }
  if (signals.deathCross) {
    insights.push(createInsight("weakness", "Death cross detected - bearish MA crossover", 2));
  }
  if (signals.supertrendBullish) {
    insights.push(createInsight("strength", "Supertrend bullish - price above indicator", 3));
  }
  
  const headline = `${symbol} ${trend.toLowerCase()}: ADX ${adx.value.toFixed(0)} (+DI: ${diPlus.toFixed(0)}, -DI: ${diMinus.toFixed(0)})`;
  
  return {
    cardId: "trend-strength",
    cardCategory: "technical",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: adx.value > 25 ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["technical-indicators", "momentum-heatmap", "price-structure"],
    tags: ["trend", trend.toLowerCase().replace(" ", "-"), adx.trend],
    scoreContribution: {
      category: "momentum",
      score: isUptrend ? 60 + adx.value * 0.4 : isDowntrend ? 40 - adx.value * 0.4 : 50,
      weight: 0.15,
    },
  };
}

interface Props { data?: TrendStrengthData; isLoading?: boolean; error?: string | null; }

export default function TrendStrengthCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  if (isLoading) return (
    <Card className="overflow-hidden">
      <CardHeader className={categoryStyle.headerBg}>
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">{categoryStyle.icon}</span>
          Trend Strength
        </CardTitle>
        <CardDescription>Loading…</CardDescription>
      </CardHeader>
      <CardContent><Skeleton className="h-48 w-full" /></CardContent>
    </Card>
  );
  
  if (error) return (
    <Card className="overflow-hidden">
      <CardHeader className={categoryStyle.headerBg}>
        <CardTitle>Trend Strength</CardTitle>
        <CardDescription className="text-red-400">{error}</CardDescription>
      </CardHeader>
    </Card>
  );
  
  if (!data) return (
    <Card className="overflow-hidden">
      <CardHeader className={categoryStyle.headerBg}>
        <CardTitle>Trend Strength</CardTitle>
        <CardDescription>No data</CardDescription>
      </CardHeader>
    </Card>
  );

  const trendColor = data.trend.includes("Up") ? "success" : data.trend.includes("Down") ? "destructive" : "secondary";

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Trend Strength
              <Badge variant={trendColor}>{data.trend}</Badge>
            </CardTitle>
            <CardDescription>{data.symbol} • ADX analysis • {data.asOf}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Signature Power Bar */}
        <PowerBar 
          adx={data.adx.value} 
          diPlus={data.diPlus} 
          diMinus={data.diMinus} 
          trend={data.trend}
        />
        
        {/* ADX History Chart */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">ADX History</div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.historical.slice(-30)} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="adxGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <ReferenceArea y1={0} y2={25} fill="#64748b" fillOpacity={0.05} />
                <ReferenceArea y1={25} y2={40} fill="#f59e0b" fillOpacity={0.05} />
                <ReferenceArea y1={40} y2={60} fill="#10b981" fillOpacity={0.05} />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 8 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 8 }} axisLine={false} tickLine={false} domain={[0, 60]} width={25} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "10px" }} />
                <ReferenceLine y={25} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.5} />
                <ReferenceLine y={40} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.5} />
                <Line 
                  type="monotone" 
                  dataKey="adx" 
                  stroke="#06b6d4" 
                  strokeWidth={2} 
                  dot={false}
                  filter="url(#glow)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Signal Badges */}
        <div className="flex gap-2 flex-wrap">
          {data.signals.goldenCross && <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-500/30">✨ Golden Cross</span>}
          {data.signals.deathCross && <span className="text-[10px] px-2 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-500/30">💀 Death Cross</span>}
          {data.signals.supertrendBullish && <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-500/30">📈 Supertrend Bullish</span>}
          {!data.signals.supertrendBullish && <span className="text-[10px] px-2 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-500/30">📉 Supertrend Bearish</span>}
        </div>
        
        <InterpretationFooter variant={data.adx.value >= 25 && data.diPlus > data.diMinus ? "success" : data.adx.value >= 25 && data.diMinus > data.diPlus ? "warning" : "info"}>
          ADX at {data.adx.value.toFixed(0)} indicates {data.adx.value >= 40 ? "very strong" : data.adx.value >= 25 ? "strong" : "weak"} trend. {data.diPlus > data.diMinus ? `+DI (${data.diPlus.toFixed(0)}) dominates -DI (${data.diMinus.toFixed(0)}) → bullish.` : `-DI (${data.diMinus.toFixed(0)}) dominates +DI (${data.diPlus.toFixed(0)}) → bearish.`}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
