import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricStrip } from "@/components/shared/MetricBox";
import { InterpretationFooter, SignalBox } from "@/components/shared/InterpretationFooter";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface OptionsInterestData {
  symbol: string;
  asOf: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  pcr: { value: number; change: number };
  maxPain: number;
  currentPrice: number;
  openInterest: { calls: number; puts: number; total: number };
  topStrikes: Array<{ strike: number; callOI: number; putOI: number; type: "call" | "put" | "balanced" }>;
  unusualActivity: Array<{ strike: string; type: string; volume: number; signal: string }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getOptionsInterestOutput(data: OptionsInterestData): CardOutput {
  const { symbol, asOf, sentiment: optionsSentiment, pcr, maxPain, currentPrice, openInterest, unusualActivity } = data;
  
  const sentiment = optionsSentiment === "Bullish" ? "bullish" : optionsSentiment === "Bearish" ? "bearish" : "neutral";
  const signalStrength = optionsSentiment !== "Neutral" ? 4 : 3;
  
  const maxPainDist = ((maxPain - currentPrice) / currentPrice) * 100;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Put-Call Ratio", "oi_pcr", pcr.value, 
      pcr.value > 1.2 ? "excellent" : pcr.value > 0.8 ? "good" : "fair",
      { format: "ratio", priority: 1, trend: { direction: pcr.change > 0 ? "up" : "down", period: "daily" } }),
    createMetric("Max Pain", "oi_maxpain", maxPain, "neutral", 
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("Distance to Max Pain", "oi_maxpain_dist", maxPainDist, 
      Math.abs(maxPainDist) < 2 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("Call OI", "oi_call", openInterest.calls / 1e6, "neutral", 
      { format: "number", priority: 2, unit: "M" }),
    createMetric("Put OI", "oi_put", openInterest.puts / 1e6, "neutral", 
      { format: "number", priority: 2, unit: "M" }),
    createMetric("Total OI", "oi_total", openInterest.total / 1e6, "neutral", 
      { format: "number", priority: 2, unit: "M" }),
  ];
  
  const insights: Insight[] = [];
  
  // Sentiment
  if (optionsSentiment === "Bullish") {
    insights.push(createInsight("strength", `Bullish options sentiment: PCR ${pcr.value.toFixed(2)} (high put writing = bullish)`, 1, ["oi_pcr"]));
  } else if (optionsSentiment === "Bearish") {
    insights.push(createInsight("weakness", `Bearish options sentiment: PCR ${pcr.value.toFixed(2)}`, 1, ["oi_pcr"]));
  }
  
  // Max pain
  if (Math.abs(maxPainDist) > 3) {
    const direction = maxPainDist > 0 ? "above" : "below";
    insights.push(createInsight("observation", `Price ${Math.abs(maxPainDist).toFixed(1)}% ${direction} max pain (₹${maxPain.toFixed(0)}) - potential mean reversion`, 2, ["oi_maxpain", "oi_maxpain_dist"]));
  }
  
  // Unusual activity
  if (unusualActivity.length > 0) {
    insights.push(createInsight("observation", `${unusualActivity.length} unusual activity signal(s) detected`, 2));
  }
  
  const headline = `${symbol} options ${optionsSentiment.toLowerCase()}: PCR ${pcr.value.toFixed(2)}, max pain ₹${maxPain.toFixed(0)} (${maxPainDist > 0 ? "+" : ""}${maxPainDist.toFixed(1)}% away)`;
  
  return {
    cardId: "options-interest",
    cardCategory: "portfolio",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["trade-flow-intel", "volatility-regime", "technical-indicators"],
    tags: ["options", "open-interest", optionsSentiment.toLowerCase()],
    scoreContribution: {
      category: "momentum",
      score: optionsSentiment === "Bullish" ? 70 : optionsSentiment === "Bearish" ? 30 : 50,
      weight: 0.10,
    },
  };
}

interface Props { data?: OptionsInterestData; isLoading?: boolean; error?: string | null; }

export default function OptionsInterestCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['portfolio'];

  if (isLoading) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Options Interest
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Options Interest</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Options Interest</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  const metrics = [
    { label: "PCR", value: data.pcr.value.toFixed(2), trend: data.pcr.value > 1 ? "down" as const : "up" as const },
    { label: "Max Pain", value: `₹${data.maxPain.toFixed(0)}` },
    { label: "Call OI", value: `${(data.openInterest.calls / 1e6).toFixed(1)}M` },
    { label: "Put OI", value: `${(data.openInterest.puts / 1e6).toFixed(1)}M` },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">Options Interest
              <Badge variant={data.sentiment === "Bullish" ? "success" : data.sentiment === "Bearish" ? "destructive" : "secondary"}>{data.sentiment}</Badge>
            </CardTitle>
            <CardDescription>{data.symbol} • OI analysis • {data.asOf}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />
        <div className="flex items-center justify-between bg-slate-800/50 rounded p-2">
          <div className="text-center flex-1">
            <div className="text-[9px] text-slate-500">Current</div>
            <div className="text-sm font-semibold text-slate-200">₹{data.currentPrice.toFixed(0)}</div>
          </div>
          <div className="text-xl text-slate-500">→</div>
          <div className="text-center flex-1">
            <div className="text-[9px] text-slate-500">Max Pain</div>
            <div className="text-sm font-semibold text-amber-400">₹{data.maxPain.toFixed(0)}</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-[9px] text-slate-500">Distance</div>
            <div className={`text-sm font-semibold ${data.maxPain > data.currentPrice ? "text-emerald-400" : "text-red-400"}`}>
              {((data.maxPain - data.currentPrice) / data.currentPrice * 100).toFixed(1)}%
            </div>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">OI by Strike</div>
          <div className="space-y-1">
            {data.topStrikes.slice(0, 5).map((s) => (
              <div key={s.strike} className="flex items-center gap-2">
                <span className="w-16 text-xs text-slate-400">₹{s.strike}</span>
                <div className="flex-1 flex h-3">
                  <div className="bg-emerald-500 rounded-l" style={{ width: `${(s.callOI / (s.callOI + s.putOI)) * 100}%` }} />
                  <div className="bg-red-500 rounded-r" style={{ width: `${(s.putOI / (s.callOI + s.putOI)) * 100}%` }} />
                </div>
                <span className="text-[9px] text-slate-500 w-16 text-right">{((s.callOI + s.putOI) / 1e3).toFixed(0)}K</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-1">
            <span className="text-[9px] flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded bg-emerald-500" /> Calls</span>
            <span className="text-[9px] flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded bg-red-500" /> Puts</span>
          </div>
        </div>
        {data.unusualActivity.length > 0 && (
          <div className="space-y-1">
            <div className="text-[10px] uppercase text-slate-500">Unusual Activity</div>
            {data.unusualActivity.slice(0, 2).map((a, i) => (
              <SignalBox key={i} signal={a.signal.includes("Bullish") ? "bullish" : "bearish"} title={`${a.strike} ${a.type}`} description={`${a.volume.toLocaleString()} contracts`} />
            ))}
          </div>
        )}
        <InterpretationFooter variant={data.sentiment === "Bullish" ? "success" : data.sentiment === "Bearish" ? "warning" : "info"}>
          PCR of {data.pcr.value.toFixed(2)} suggests {data.pcr.value > 1.2 ? "bearish" : data.pcr.value < 0.8 ? "bullish" : "neutral"} sentiment. Max pain at ₹{data.maxPain.toFixed(0)} ({((data.maxPain - data.currentPrice) / data.currentPrice * 100).toFixed(1)}% from current).
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
