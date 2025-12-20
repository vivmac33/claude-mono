import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricStrip } from "@/components/shared/MetricBox";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from "recharts";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface EarningsSurpriseData {
  symbol: string;
  asOf: string;
  avgSurprise: number;
  beatRate: number;
  history: Array<{ quarter: string; actual: number; estimate: number; surprise: number; priceReaction: number }>;
  pattern: { consistency: "High" | "Moderate" | "Low"; tendency: "Beats" | "Misses" | "Mixed" };
  postEarningsMove: { avg1D: number; avg5D: number; direction: "positive" | "negative" | "mixed" };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getEarningsSurpriseOutput(data: EarningsSurpriseData): CardOutput {
  const { symbol, asOf, avgSurprise, beatRate, pattern, postEarningsMove, history } = data;
  
  const sentiment = pattern.tendency === "Beats" ? "bullish" : pattern.tendency === "Misses" ? "bearish" : "neutral";
  const signalStrength = pattern.consistency === "High" ? 4 : pattern.consistency === "Moderate" ? 3 : 2;
  
  const lastSurprise = history.length > 0 ? history[history.length - 1].surprise : 0;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Beat Rate", "es_beat_rate", beatRate, 
      beatRate >= 75 ? "excellent" : beatRate >= 50 ? "good" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Avg Surprise", "es_avg_surprise", avgSurprise, 
      avgSurprise > 5 ? "excellent" : avgSurprise > 0 ? "good" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Last Surprise", "es_last", lastSurprise, 
      lastSurprise > 5 ? "excellent" : lastSurprise > 0 ? "good" : lastSurprise > -5 ? "fair" : "poor",
      { format: "percent", priority: 2 }),
    createMetric("Avg 1D Move", "es_1d", postEarningsMove.avg1D, 
      postEarningsMove.avg1D > 2 ? "excellent" : postEarningsMove.avg1D > 0 ? "good" : "poor",
      { format: "percent", priority: 2 }),
    createMetric("Avg 5D Move", "es_5d", postEarningsMove.avg5D, 
      postEarningsMove.avg5D > 3 ? "excellent" : postEarningsMove.avg5D > 0 ? "good" : "poor",
      { format: "percent", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // Tendency
  if (pattern.tendency === "Beats") {
    insights.push(createInsight("strength", `Consistent beat pattern: ${beatRate}% beat rate with ${avgSurprise > 0 ? "+" : ""}${avgSurprise.toFixed(1)}% avg surprise`, 1, ["es_beat_rate", "es_avg_surprise"]));
  } else if (pattern.tendency === "Misses") {
    insights.push(createInsight("weakness", `History of misses: only ${beatRate}% beat rate`, 1, ["es_beat_rate"]));
  }
  
  // Consistency
  if (pattern.consistency === "High") {
    insights.push(createInsight("strength", "High consistency in earnings results - predictable patterns", 2));
  } else if (pattern.consistency === "Low") {
    insights.push(createInsight("observation", "Low consistency - earnings results highly variable", 2));
  }
  
  // Post-earnings move
  if (postEarningsMove.direction === "positive" && postEarningsMove.avg1D > 2) {
    insights.push(createInsight("strength", `Positive post-earnings drift: avg +${postEarningsMove.avg1D.toFixed(1)}% on day 1`, 2, ["es_1d"]));
  } else if (postEarningsMove.direction === "negative" && postEarningsMove.avg1D < -2) {
    insights.push(createInsight("weakness", `Negative post-earnings drift: avg ${postEarningsMove.avg1D.toFixed(1)}% on day 1`, 2, ["es_1d"]));
  }
  
  const headline = `${symbol} ${pattern.tendency.toLowerCase()}: ${beatRate}% beat rate with ${avgSurprise > 0 ? "+" : ""}${avgSurprise.toFixed(1)}% avg surprise`;
  
  return {
    cardId: "earnings-surprise",
    cardCategory: "macro",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: pattern.consistency === "High" ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["earnings-calendar", "earnings-quality", "earnings-stability"],
    tags: ["earnings", "surprise", pattern.tendency.toLowerCase()],
    scoreContribution: {
      category: "momentum",
      score: beatRate,
      weight: 0.10,
    },
  };
}

interface Props { data?: EarningsSurpriseData; isLoading?: boolean; error?: string | null; }

export default function EarningsSurpriseCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['macro'];

  if (isLoading) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Earnings Surprise
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Earnings Surprise</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Earnings Surprise</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  const metrics = [
    { label: "Beat Rate", value: `${data.beatRate.toFixed(1)}%`, trend: data.beatRate >= 70 ? "up" as const : "down" as const },
    { label: "Avg Surprise", value: `${data.avgSurprise > 0 ? "+" : ""}${data.avgSurprise.toFixed(1)}%` },
    { label: "Avg 1D Move", value: `${data.postEarningsMove.avg1D > 0 ? "+" : ""}${data.postEarningsMove.avg1D.toFixed(1)}%` },
    { label: "Consistency", value: data.pattern.consistency },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">Earnings Surprise
              <Badge variant={data.pattern.tendency === "Beats" ? "success" : data.pattern.tendency === "Misses" ? "destructive" : "secondary"}>{data.pattern.tendency}</Badge>
            </CardTitle>
            <CardDescription>{data.symbol} • Surprise history • {data.asOf}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Surprise History & Price Reaction</div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.history} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="quarter" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }} formatter={(v: number, name: string) => [`${v.toFixed(1)}%`, name === "surprise" ? "EPS Surprise" : "Price Move"]} />
                <ReferenceLine y={0} stroke="#64748b" />
                <Bar dataKey="surprise" radius={[2, 2, 0, 0]}>{data.history.map((e, i) => <Cell key={i} fill={e.surprise >= 0 ? "#10b981" : "#ef4444"} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Quarter Details</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {data.history.map((q, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-slate-800/30 rounded px-2 py-1">
                <span className="text-slate-400">{q.quarter}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">Est: ₹{q.estimate.toFixed(2)}</span>
                  <span className="text-slate-200">Act: ₹{q.actual.toFixed(2)}</span>
                  <span className={`font-medium ${q.surprise >= 0 ? "text-emerald-400" : "text-red-400"}`}>{q.surprise >= 0 ? "+" : ""}{q.surprise.toFixed(1)}%</span>
                  <span className={`text-[10px] ${q.priceReaction >= 0 ? "text-emerald-400" : "text-red-400"}`}>{q.priceReaction >= 0 ? "↑" : "↓"}{Math.abs(q.priceReaction).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <InterpretationFooter variant={data.beatRate >= 70 ? "success" : data.beatRate >= 50 ? "info" : "warning"}>
          {data.beatRate}% beat rate with {data.pattern.consistency.toLowerCase()} consistency. Average post-earnings move of {data.postEarningsMove.avg1D > 0 ? "+" : ""}{data.postEarningsMove.avg1D.toFixed(1)}% (1D) suggests {data.postEarningsMove.direction} reaction tendency.
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
