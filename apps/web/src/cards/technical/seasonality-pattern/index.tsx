import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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

export interface SeasonalityPatternData {
  symbol: string;
  asOf: string;
  monthlyReturns: Array<{ month: string; avgReturn: number; winRate: number; years: number }>;
  dayOfWeekReturns: Array<{ day: string; avgReturn: number; winRate: number }>;
  bestMonth: { month: string; avgReturn: number };
  worstMonth: { month: string; avgReturn: number };
  currentMonthOutlook: { month: string; historical: number; signal: "bullish" | "bearish" | "neutral" };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getSeasonalityPatternOutput(data: SeasonalityPatternData): CardOutput {
  const { symbol, asOf, monthlyReturns, dayOfWeekReturns, bestMonth, worstMonth, currentMonthOutlook } = data;
  
  const sentiment = currentMonthOutlook.signal;
  const signalStrength = Math.abs(currentMonthOutlook.historical) > 3 ? 4 : Math.abs(currentMonthOutlook.historical) > 1 ? 3 : 2;
  
  const currentMonth = monthlyReturns.find(m => m.month === currentMonthOutlook.month);
  const avgMonthlyReturn = monthlyReturns.reduce((sum, m) => sum + m.avgReturn, 0) / monthlyReturns.length;
  const bestDay = dayOfWeekReturns.reduce((a, b) => a.avgReturn > b.avgReturn ? a : b);
  const worstDay = dayOfWeekReturns.reduce((a, b) => a.avgReturn < b.avgReturn ? a : b);
  
  const keyMetrics: MetricValue[] = [
    createMetric("Current Month Avg", "sp_current", currentMonthOutlook.historical, 
      currentMonthOutlook.historical > 2 ? "excellent" : currentMonthOutlook.historical > 0 ? "good" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Current Month Win Rate", "sp_current_wr", currentMonth?.winRate || 50, 
      (currentMonth?.winRate || 50) > 60 ? "excellent" : (currentMonth?.winRate || 50) > 50 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("Best Month Return", "sp_best", bestMonth.avgReturn, "excellent", 
      { format: "percent", priority: 2 }),
    createMetric("Worst Month Return", "sp_worst", worstMonth.avgReturn, "poor", 
      { format: "percent", priority: 2 }),
    createMetric("Best Day Return", "sp_best_day", bestDay.avgReturn, "good", 
      { format: "percent", priority: 3 }),
    createMetric("Avg Monthly Return", "sp_avg", avgMonthlyReturn, "neutral", 
      { format: "percent", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Current month outlook
  if (currentMonthOutlook.signal === "bullish") {
    insights.push(createInsight("strength", `${currentMonthOutlook.month} historically bullish: +${currentMonthOutlook.historical.toFixed(1)}% avg return`, 1, ["sp_current"]));
  } else if (currentMonthOutlook.signal === "bearish") {
    insights.push(createInsight("weakness", `${currentMonthOutlook.month} historically bearish: ${currentMonthOutlook.historical.toFixed(1)}% avg return`, 1, ["sp_current"]));
  }
  
  // Best/worst months
  insights.push(createInsight("observation", `Best month: ${bestMonth.month} (+${bestMonth.avgReturn.toFixed(1)}%), Worst: ${worstMonth.month} (${worstMonth.avgReturn.toFixed(1)}%)`, 2, ["sp_best", "sp_worst"]));
  
  // Day of week pattern
  if (bestDay.avgReturn > 0.2) {
    insights.push(createInsight("observation", `${bestDay.day} historically strongest day (+${bestDay.avgReturn.toFixed(2)}% avg)`, 3, ["sp_best_day"]));
  }
  
  const headline = `${symbol} ${currentMonthOutlook.month} ${currentMonthOutlook.signal}: ${currentMonthOutlook.historical > 0 ? "+" : ""}${currentMonthOutlook.historical.toFixed(1)}% historical avg`;
  
  return {
    cardId: "seasonality-pattern",
    cardCategory: "technical",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: currentMonth && currentMonth.years >= 10 ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["pattern-matcher", "trend-strength", "technical-indicators"],
    tags: ["seasonality", currentMonthOutlook.signal],
    scoreContribution: {
      category: "momentum",
      score: 50 + currentMonthOutlook.historical * 5,
      weight: 0.05,
    },
  };
}

interface Props { data?: SeasonalityPatternData; isLoading?: boolean; error?: string | null; }

export default function SeasonalityPatternCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  if (isLoading) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Seasonality Pattern
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Seasonality Pattern</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Seasonality Pattern</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  const getReturnColor = (r: number) => r > 1 ? "bg-emerald-500" : r > 0 ? "bg-emerald-700" : r > -1 ? "bg-red-700" : "bg-red-500";

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <CardTitle>Seasonality Pattern</CardTitle>
        <CardDescription>{data.symbol} • Monthly & weekly patterns • {data.asOf}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded bg-emerald-900/20 border border-emerald-800/30 p-2">
            <div className="text-[9px] text-emerald-400 uppercase">Best Month</div>
            <div className="text-lg font-semibold text-emerald-400">{data.bestMonth.month}</div>
            <div className="text-xs text-slate-400">Avg: +{data.bestMonth.avgReturn.toFixed(1)}%</div>
          </div>
          <div className="rounded bg-red-900/20 border border-red-800/30 p-2">
            <div className="text-[9px] text-red-400 uppercase">Worst Month</div>
            <div className="text-lg font-semibold text-red-400">{data.worstMonth.month}</div>
            <div className="text-xs text-slate-400">Avg: {data.worstMonth.avgReturn.toFixed(1)}%</div>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Monthly Returns Heatmap</div>
          <div className="grid grid-cols-6 gap-1">
            {data.monthlyReturns.map((m) => (
              <div key={m.month} className={`rounded p-1.5 text-center ${getReturnColor(m.avgReturn)}`}>
                <div className="text-[9px] text-white/80">{m.month.slice(0, 3)}</div>
                <div className="text-[10px] font-semibold text-white">{m.avgReturn > 0 ? "+" : ""}{m.avgReturn.toFixed(1)}%</div>
                <div className="text-[8px] text-white/60">{Math.round(m.winRate)}% win</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Day of Week Pattern</div>
          <div className="grid grid-cols-5 gap-1">
            {data.dayOfWeekReturns.map((d) => (
              <div key={d.day} className="rounded bg-slate-800/50 p-2 text-center">
                <div className="text-[9px] text-slate-500">{d.day}</div>
                <div className={`text-xs font-semibold ${d.avgReturn >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {d.avgReturn >= 0 ? "+" : ""}{d.avgReturn.toFixed(2)}%
                </div>
                <div className="text-[8px] text-slate-500">{Math.round(d.winRate)}%</div>
              </div>
            ))}
          </div>
        </div>
        <InterpretationFooter variant={data.currentMonthOutlook.signal === "bullish" ? "success" : data.currentMonthOutlook.signal === "bearish" ? "warning" : "info"}>
          {data.currentMonthOutlook.month} historically returns {data.currentMonthOutlook.historical > 0 ? "+" : ""}{data.currentMonthOutlook.historical.toFixed(1)}% on average—{data.currentMonthOutlook.signal} bias. Best month: {data.bestMonth.month} (+{data.bestMonth.avgReturn.toFixed(1)}%).
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
