import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import { SignalBadge, TrendBadge, SignalType, TrendType } from "@/components/ui/status-badges";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface MomentumHeatmapData {
  symbol: string;
  asOf: string;
  overallMomentum: "Strong" | "Moderate" | "Weak" | "Negative";
  timeframes: Array<{ tf: string; rsi: number; macd: string; momentum: number; signal: "bullish" | "bearish" | "neutral" }>;
  sectors: Array<{ sector: string; momentum: number; relativeStrength: number }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getMomentumHeatmapOutput(data: MomentumHeatmapData): CardOutput {
  const { symbol, asOf, overallMomentum, timeframes, sectors } = data;
  
  const sentiment = overallMomentum === "Strong" ? "bullish" : overallMomentum === "Negative" ? "bearish" : "neutral";
  const signalStrength = overallMomentum === "Strong" ? 5 : overallMomentum === "Moderate" ? 4 : overallMomentum === "Weak" ? 3 : 2;
  
  const bullishTFs = timeframes.filter(tf => tf.signal === "bullish").length;
  const bearishTFs = timeframes.filter(tf => tf.signal === "bearish").length;
  const avgMomentum = timeframes.reduce((sum, tf) => sum + tf.momentum, 0) / timeframes.length;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Avg Momentum", "mh_momentum", avgMomentum, 
      avgMomentum > 2 ? "excellent" : avgMomentum > 0 ? "good" : "poor",
      { format: "number", priority: 1 }),
    createMetric("Bullish TFs", "mh_bullish", bullishTFs, 
      bullishTFs >= timeframes.length * 0.7 ? "excellent" : "good",
      { format: "number", priority: 1 }),
    createMetric("Bearish TFs", "mh_bearish", bearishTFs, 
      bearishTFs >= timeframes.length * 0.7 ? "poor" : "neutral",
      { format: "number", priority: 2 }),
  ];
  
  // Add timeframe-specific metrics
  timeframes.forEach(tf => {
    keyMetrics.push(createMetric(`${tf.tf} RSI`, `mh_rsi_${tf.tf}`, tf.rsi, 
      tf.rsi > 70 ? "risky" : tf.rsi < 30 ? "opportunity" : "neutral",
      { format: "number", priority: 2 }));
  });
  
  const insights: Insight[] = [];
  
  // Overall momentum
  if (overallMomentum === "Strong") {
    insights.push(createInsight("strength", `Strong momentum across ${bullishTFs}/${timeframes.length} timeframes`, 1, ["mh_bullish"]));
  } else if (overallMomentum === "Negative") {
    insights.push(createInsight("weakness", `Negative momentum across ${bearishTFs}/${timeframes.length} timeframes`, 1, ["mh_bearish"]));
  }
  
  // Timeframe alignment
  if (bullishTFs === timeframes.length) {
    insights.push(createInsight("strength", "All timeframes aligned bullish - high confluence", 1, ["mh_bullish"]));
  } else if (bearishTFs === timeframes.length) {
    insights.push(createInsight("weakness", "All timeframes aligned bearish - high confluence", 1, ["mh_bearish"]));
  } else if (bullishTFs > 0 && bearishTFs > 0) {
    insights.push(createInsight("observation", "Mixed signals across timeframes - conflicting momentum", 2));
  }
  
  // RSI extremes
  const overboughtTFs = timeframes.filter(tf => tf.rsi > 70);
  const oversoldTFs = timeframes.filter(tf => tf.rsi < 30);
  if (overboughtTFs.length > 0) {
    insights.push(createInsight("risk", `Overbought on ${overboughtTFs.map(tf => tf.tf).join(", ")}`, 2));
  }
  if (oversoldTFs.length > 0) {
    insights.push(createInsight("opportunity", `Oversold on ${oversoldTFs.map(tf => tf.tf).join(", ")}`, 2));
  }
  
  const headline = `${symbol} ${overallMomentum.toLowerCase()} momentum: ${bullishTFs}/${timeframes.length} timeframes bullish`;
  
  return {
    cardId: "momentum-heatmap",
    cardCategory: "technical",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: bullishTFs === timeframes.length || bearishTFs === timeframes.length ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["trend-strength", "technical-indicators", "price-structure"],
    tags: ["momentum", overallMomentum.toLowerCase()],
    scoreContribution: {
      category: "momentum",
      score: overallMomentum === "Strong" ? 85 : overallMomentum === "Moderate" ? 65 : overallMomentum === "Weak" ? 45 : 25,
      weight: 0.10,
    },
  };
}

interface Props { data?: MomentumHeatmapData; isLoading?: boolean; error?: string | null; }

function getMomentumSignal(momentum: MomentumHeatmapData["overallMomentum"]): SignalType {
  switch (momentum) {
    case "Strong": return "bullish";
    case "Moderate": return "neutral";
    case "Weak": return "neutral";
    case "Negative": return "bearish";
  }
}

function getTrendFromSignal(signal: "bullish" | "bearish" | "neutral"): TrendType {
  switch (signal) {
    case "bullish": return "up";
    case "bearish": return "down";
    case "neutral": return "flat";
  }
}

export default function MomentumHeatmapCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  if (isLoading) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Momentum Heatmap
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Momentum Heatmap</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Momentum Heatmap</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  const getMomentumColor = (m: number) => m > 2 ? "bg-emerald-500" : m > 0 ? "bg-emerald-700" : m > -2 ? "bg-red-700" : "bg-red-500";

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <CardTitle className="flex items-center gap-2">Momentum Heatmap
          <SignalBadge signal={getMomentumSignal(data.overallMomentum)} size="md" />
        </CardTitle>
        <CardDescription>{data.symbol} • Multi-timeframe momentum • {data.asOf}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Timeframe Analysis</div>
          <div className="space-y-1">
            {data.timeframes.map((tf) => (
              <div key={tf.tf} className="flex items-center gap-2">
                <span className="w-12 text-[10px] text-slate-500">{tf.tf}</span>
                <div className={`w-8 h-6 rounded flex items-center justify-center text-[10px] font-medium text-white ${getMomentumColor(tf.momentum)}`}>
                  {tf.momentum > 0 ? "+" : ""}{tf.momentum.toFixed(0)}
                </div>
                <div className="flex-1 grid grid-cols-3 gap-2 text-xs">
                  <span className="text-slate-400">RSI: <span className={tf.rsi > 70 ? "text-red-400" : tf.rsi < 30 ? "text-emerald-400" : "text-slate-200"}>{tf.rsi.toFixed(0)}</span></span>
                  <span className="text-slate-400">MACD: <span className={tf.macd === "Bullish" ? "text-emerald-400" : "text-red-400"}>{tf.macd}</span></span>
                  <TrendBadge trend={getTrendFromSignal(tf.signal)} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Sector Momentum (Relative Strength)</div>
          <div className="grid grid-cols-3 gap-2">
            {data.sectors.slice(0, 6).map((s) => (
              <div key={s.sector} className={`rounded p-2 text-center ${s.momentum > 0 ? "bg-emerald-900/30" : "bg-red-900/30"}`}>
                <div className="text-[9px] text-slate-400 truncate">{s.sector}</div>
                <div className={`text-sm font-semibold ${s.momentum > 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {s.momentum > 0 ? "+" : ""}{s.momentum.toFixed(1)}%
                </div>
                <div className="text-[9px] text-slate-500">RS: {s.relativeStrength.toFixed(0)}</div>
              </div>
            ))}
          </div>
        </div>
        <InterpretationFooter variant={data.overallMomentum === "Strong" ? "success" : data.overallMomentum === "Negative" ? "warning" : "info"}>
          {data.overallMomentum} momentum across timeframes. {data.timeframes.filter(t => t.signal === "bullish").length}/{data.timeframes.length} timeframes bullish.
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
