import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface EarningsCalendarData {
  symbol: string;
  asOf: string;
  upcoming: { date: string; quarter: string; estimatedEPS: number; estimatedRevenue: number; daysAway: number };
  historicalBeats: { last4Q: number; last8Q: number };
  peerEarnings: Array<{ symbol: string; date: string; status: "upcoming" | "reported"; surprise?: number }>;
  estimates: { epsHigh: number; epsLow: number; epsConsensus: number; numAnalysts: number };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getEarningsCalendarOutput(data: EarningsCalendarData): CardOutput {
  const { symbol, asOf, upcoming, historicalBeats, estimates } = data;
  
  const beatRate = (historicalBeats.last4Q / 4) * 100;
  const sentiment = beatRate >= 75 ? "bullish" : beatRate <= 25 ? "bearish" : "neutral";
  const signalStrength = upcoming.daysAway <= 7 ? 4 : upcoming.daysAway <= 14 ? 3 : 2;
  
  const estimateSpread = ((estimates.epsHigh - estimates.epsLow) / estimates.epsConsensus) * 100;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Days to Earnings", "ec_days", upcoming.daysAway, 
      upcoming.daysAway <= 7 ? "risky" : "neutral",
      { format: "number", priority: 1, unit: "days" }),
    createMetric("EPS Consensus", "ec_eps", estimates.epsConsensus, "neutral", 
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("EPS Range High", "ec_eps_high", estimates.epsHigh, "neutral", 
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("EPS Range Low", "ec_eps_low", estimates.epsLow, "neutral", 
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("Beat Rate (4Q)", "ec_beat_4q", beatRate, 
      beatRate >= 75 ? "excellent" : beatRate >= 50 ? "good" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Beat Rate (8Q)", "ec_beat_8q", (historicalBeats.last8Q / 8) * 100, 
      (historicalBeats.last8Q / 8) >= 0.625 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Analyst Count", "ec_analysts", estimates.numAnalysts, "neutral", 
      { format: "number", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Upcoming date
  if (upcoming.daysAway <= 7) {
    insights.push(createInsight("action", `Earnings in ${upcoming.daysAway} days (${upcoming.date}) - position ahead of announcement`, 1, ["ec_days"]));
  } else {
    insights.push(createInsight("observation", `${upcoming.quarter} earnings on ${upcoming.date} (${upcoming.daysAway} days away)`, 2, ["ec_days"]));
  }
  
  // Beat history
  if (beatRate >= 75) {
    insights.push(createInsight("strength", `Strong beat history: ${historicalBeats.last4Q}/4 quarters beat estimates`, 2, ["ec_beat_4q"]));
  } else if (beatRate <= 25) {
    insights.push(createInsight("weakness", `Poor beat history: only ${historicalBeats.last4Q}/4 quarters beat estimates`, 2, ["ec_beat_4q"]));
  }
  
  // Estimate spread
  if (estimateSpread > 30) {
    insights.push(createInsight("observation", `Wide estimate range (${estimateSpread.toFixed(0)}% spread) - high uncertainty`, 3, ["ec_eps_high", "ec_eps_low"]));
  }
  
  const headline = `${symbol} ${upcoming.quarter} earnings ${upcoming.daysAway <= 7 ? "imminent" : "upcoming"} on ${upcoming.date} (EPS est: ₹${estimates.epsConsensus.toFixed(2)})`;
  
  return {
    cardId: "earnings-calendar",
    cardCategory: "macro",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: estimates.numAnalysts >= 5 ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["earnings-surprise", "earnings-quality", "earnings-stability"],
    tags: ["earnings", "calendar", upcoming.daysAway <= 7 ? "imminent" : "upcoming"],
    scoreContribution: {
      category: "momentum",
      score: beatRate,
      weight: 0.05,
    },
  };
}

interface Props { data?: EarningsCalendarData; isLoading?: boolean; error?: string | null; }

export default function EarningsCalendarCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['macro'];

  if (isLoading) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Earnings Calendar
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Earnings Calendar</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Earnings Calendar</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">Earnings Calendar
              <Badge variant={data.upcoming.daysAway <= 7 ? "destructive" : "secondary"}>{data.upcoming.daysAway}d away</Badge>
            </CardTitle>
            <CardDescription>{data.symbol} • {data.upcoming.quarter} earnings • {data.asOf}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <div className="text-[9px] text-slate-500 uppercase mb-1">Next Earnings</div>
          <div className="text-xl font-bold text-slate-100">{data.upcoming.date}</div>
          <div className="text-sm text-slate-400">{data.upcoming.quarter}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded bg-slate-800/50 p-2">
            <div className="text-[9px] text-slate-500 uppercase">EPS Estimate</div>
            <div className="text-lg font-semibold text-slate-100">₹{data.estimates.epsConsensus.toFixed(2)}</div>
            <div className="text-[9px] text-slate-500">Range: ₹{data.estimates.epsLow.toFixed(2)} - ₹{data.estimates.epsHigh.toFixed(2)}</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2">
            <div className="text-[9px] text-slate-500 uppercase">Revenue Est.</div>
            <div className="text-lg font-semibold text-slate-100">₹{(data.upcoming.estimatedRevenue / 100).toFixed(0)}Cr</div>
            <div className="text-[9px] text-slate-500">{data.estimates.numAnalysts} analysts</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded bg-emerald-900/20 border border-emerald-800/30 p-2 text-center">
            <div className="text-lg font-bold text-emerald-400">{data.historicalBeats.last4Q}/4</div>
            <div className="text-[9px] text-slate-500">Beats (Last 4Q)</div>
          </div>
          <div className="rounded bg-blue-900/20 border border-blue-800/30 p-2 text-center">
            <div className="text-lg font-bold text-blue-400">{data.historicalBeats.last8Q}/8</div>
            <div className="text-[9px] text-slate-500">Beats (Last 8Q)</div>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Peer Earnings</div>
          <div className="space-y-1">
            {data.peerEarnings.slice(0, 4).map((peer, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-slate-800/30 rounded px-2 py-1">
                <span className="text-slate-300 font-mono">{peer.symbol}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{peer.date}</span>
                  {peer.status === "reported" && peer.surprise !== undefined && (
                    <span className={peer.surprise >= 0 ? "text-emerald-400" : "text-red-400"}>{peer.surprise >= 0 ? "+" : ""}{peer.surprise.toFixed(1)}%</span>
                  )}
                  {peer.status === "upcoming" && <span className="text-amber-400 text-[9px]">Upcoming</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <InterpretationFooter variant={data.upcoming.daysAway <= 7 ? "warning" : "info"}>
          {data.upcoming.quarter} earnings in {data.upcoming.daysAway} days. Historical beat rate: {((data.historicalBeats.last8Q / 8) * 100).toFixed(0)}%. Consensus EPS of ₹{data.estimates.epsConsensus.toFixed(2)} from {data.estimates.numAnalysts} analysts.
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
