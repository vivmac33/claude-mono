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

export interface MacroCalendarData {
  asOf: string;
  upcomingEvents: Array<{ date: string; time: string; event: string; country: string; importance: "high" | "medium" | "low"; previous?: string; forecast?: string }>;
  recentEvents: Array<{ date: string; event: string; actual: string; forecast: string; impact: "positive" | "negative" | "neutral" }>;
  keyDates: { nextFed: string; nextRBI: string; nextGDP: string };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getMacroCalendarOutput(data: MacroCalendarData): CardOutput {
  const { asOf, upcomingEvents, recentEvents, keyDates } = data;
  
  const highImpactEvents = upcomingEvents.filter(e => e.importance === "high");
  const recentPositive = recentEvents.filter(e => e.impact === "positive").length;
  const recentNegative = recentEvents.filter(e => e.impact === "negative").length;
  
  const sentiment = recentPositive > recentNegative ? "bullish" : recentNegative > recentPositive ? "bearish" : "neutral";
  const signalStrength = highImpactEvents.length > 3 ? 4 : highImpactEvents.length > 1 ? 3 : 2;
  
  const keyMetrics: MetricValue[] = [
    createMetric("High Impact Events", "mc_high", highImpactEvents.length, 
      highImpactEvents.length > 3 ? "risky" : "neutral",
      { format: "number", priority: 1 }),
    createMetric("Upcoming Events", "mc_upcoming", upcomingEvents.length, "neutral", 
      { format: "number", priority: 2 }),
    createMetric("Recent Positive", "mc_positive", recentPositive, 
      recentPositive > recentNegative ? "good" : "neutral",
      { format: "number", priority: 2 }),
    createMetric("Recent Negative", "mc_negative", recentNegative, 
      recentNegative > recentPositive ? "poor" : "neutral",
      { format: "number", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // High impact events
  if (highImpactEvents.length > 0) {
    const nextHigh = highImpactEvents[0];
    insights.push(createInsight("observation", `${highImpactEvents.length} high-impact event(s) upcoming: ${nextHigh.event} (${nextHigh.date})`, 1, ["mc_high"]));
  }
  
  // Key dates
  insights.push(createInsight("action", `Key dates: Fed ${keyDates.nextFed}, RBI ${keyDates.nextRBI}`, 2));
  
  // Recent impact
  if (recentPositive > recentNegative + 1) {
    insights.push(createInsight("strength", `Recent macro data mostly positive (${recentPositive}/${recentEvents.length})`, 2, ["mc_positive"]));
  } else if (recentNegative > recentPositive + 1) {
    insights.push(createInsight("weakness", `Recent macro data mostly negative (${recentNegative}/${recentEvents.length})`, 2, ["mc_negative"]));
  }
  
  const headline = `${highImpactEvents.length} high-impact events upcoming, next Fed ${keyDates.nextFed}, RBI ${keyDates.nextRBI}`;
  
  return {
    cardId: "macro-calendar",
    cardCategory: "macro",
    symbol: "MARKET",
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["macro-pulse", "market-regime-radar", "volatility-regime"],
    tags: ["macro", "calendar", "events"],
    scoreContribution: {
      category: "momentum",
      score: 50 + (recentPositive - recentNegative) * 10,
      weight: 0.05,
    },
  };
}

interface Props { data?: MacroCalendarData; isLoading?: boolean; error?: string | null; }

export default function MacroCalendarCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['macro'];

  if (isLoading) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Macro Calendar
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Macro Calendar</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Macro Calendar</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  const importanceColor = (imp: string) => imp === "high" ? "bg-red-900/50 text-red-400" : imp === "medium" ? "bg-amber-900/50 text-amber-400" : "bg-slate-700 text-slate-400";

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <CardTitle>Macro Calendar</CardTitle>
        <CardDescription>Economic events & central bank decisions • {data.asOf}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className="text-[9px] text-slate-500 uppercase">Next Fed</div>
            <div className="text-sm font-semibold text-slate-200">{data.keyDates.nextFed}</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className="text-[9px] text-slate-500 uppercase">Next RBI</div>
            <div className="text-sm font-semibold text-slate-200">{data.keyDates.nextRBI}</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className="text-[9px] text-slate-500 uppercase">GDP Release</div>
            <div className="text-sm font-semibold text-slate-200">{data.keyDates.nextGDP}</div>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Upcoming Events</div>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {data.upcomingEvents.slice(0, 6).map((event, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-slate-800/30 rounded px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${importanceColor(event.importance)}`}>{event.importance[0].toUpperCase()}</span>
                  <div>
                    <div className="text-slate-300">{event.event}</div>
                    <div className="text-[9px] text-slate-500">{event.country} • {event.date}</div>
                  </div>
                </div>
                {event.forecast && <div className="text-slate-400 text-[10px]">Est: {event.forecast}</div>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Recent Releases</div>
          <div className="space-y-1">
            {data.recentEvents.slice(0, 4).map((event, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-slate-800/30 rounded px-2 py-1.5">
                <span className="text-slate-300">{event.event}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${event.impact === "positive" ? "text-emerald-400" : event.impact === "negative" ? "text-red-400" : "text-slate-400"}`}>{event.actual}</span>
                  <span className="text-[9px] text-slate-500">vs {event.forecast}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <InterpretationFooter variant="info">
          Monitor high-importance events for potential market impact. Fed and RBI decisions typically drive cross-asset volatility.
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
