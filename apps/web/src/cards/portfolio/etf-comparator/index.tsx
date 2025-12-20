import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricStrip } from "@/components/shared/MetricBox";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface ETFComparatorData {
  asOf: string;
  etfs: Array<{ symbol: string; name: string; expenseRatio: number; aum: number; return1Y: number; tracking: number; holdings: number }>;
  overlap: Array<{ etf1: string; etf2: string; overlapPct: number }>;
  topHoldings: Array<{ symbol: string; weight: number; inEtfs: string[] }>;
  recommendation: { pick: string; reason: string };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getETFComparatorOutput(data: ETFComparatorData): CardOutput {
  const { asOf, etfs, overlap, recommendation } = data;
  
  const bestETF = etfs.reduce((a, b) => a.return1Y > b.return1Y ? a : b);
  const lowestER = etfs.reduce((a, b) => a.expenseRatio < b.expenseRatio ? a : b);
  const avgOverlap = overlap.length > 0 ? overlap.reduce((sum, o) => sum + o.overlapPct, 0) / overlap.length : 0;
  
  const sentiment = bestETF.return1Y > 10 ? "bullish" : bestETF.return1Y < 0 ? "bearish" : "neutral";
  
  const keyMetrics: MetricValue[] = [
    createMetric("ETFs Compared", "ec_count", etfs.length, "neutral", 
      { format: "number", priority: 1 }),
    createMetric("Best 1Y Return", "ec_best", bestETF.return1Y, 
      bestETF.return1Y > 15 ? "excellent" : bestETF.return1Y > 5 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("Lowest Expense Ratio", "ec_er", lowestER.expenseRatio, 
      lowestER.expenseRatio < 0.2 ? "excellent" : lowestER.expenseRatio < 0.5 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("Avg Overlap", "ec_overlap", avgOverlap, 
      avgOverlap < 30 ? "excellent" : avgOverlap < 50 ? "good" : "fair",
      { format: "percent", priority: 2 }),
  ];
  
  etfs.forEach(etf => {
    keyMetrics.push(createMetric(`${etf.symbol} Return`, `ec_${etf.symbol.toLowerCase()}_ret`, etf.return1Y, 
      etf.return1Y > 10 ? "excellent" : etf.return1Y > 0 ? "good" : "poor",
      { format: "percent", priority: 2 }));
  });
  
  const insights: Insight[] = [];
  
  // Best performer
  insights.push(createInsight("strength", `Best performer: ${bestETF.symbol} with ${bestETF.return1Y.toFixed(1)}% 1Y return`, 1, ["ec_best"]));
  
  // Lowest cost
  insights.push(createInsight("observation", `Lowest cost: ${lowestER.symbol} at ${lowestER.expenseRatio.toFixed(2)}% expense ratio`, 2, ["ec_er"]));
  
  // Recommendation
  if (recommendation.pick) {
    insights.push(createInsight("action", `Recommendation: ${recommendation.pick} - ${recommendation.reason}`, 1));
  }
  
  // Overlap
  if (avgOverlap > 60) {
    insights.push(createInsight("observation", `High average overlap (${avgOverlap.toFixed(0)}%) - similar exposures`, 3, ["ec_overlap"]));
  }
  
  const headline = `ETF comparison: ${bestETF.symbol} leads with ${bestETF.return1Y.toFixed(1)}% return, ${lowestER.symbol} lowest cost at ${lowestER.expenseRatio.toFixed(2)}%`;
  
  return {
    cardId: "etf-comparator",
    cardCategory: "portfolio",
    symbol: "ETF",
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: 3 as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["portfolio-correlation", "rebalance-optimizer"],
    tags: ["etf", "comparison"],
    scoreContribution: {
      category: "value",
      score: Math.min(100, 50 + bestETF.return1Y * 2),
      weight: 0.05,
    },
  };
}

interface Props { data?: ETFComparatorData; isLoading?: boolean; error?: string | null; }

export default function ETFComparatorCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['portfolio'];

  if (isLoading) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              ETF Comparator
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>ETF Comparator</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>ETF Comparator</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <CardTitle>ETF Comparator</CardTitle>
        <CardDescription>Holdings overlap & comparison • {data.asOf}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">ETF Comparison</div>
          <div className="space-y-1">
            {data.etfs.map((etf) => (
              <div key={etf.symbol} className="flex items-center justify-between text-xs bg-slate-800/30 rounded px-2 py-1.5">
                <div>
                  <span className="text-slate-200 font-medium">{etf.symbol}</span>
                  <span className="text-slate-500 ml-2 text-[10px]">{etf.name}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span>ER: {etf.expenseRatio.toFixed(2)}%</span>
                  <span className={etf.return1Y >= 0 ? "text-emerald-400" : "text-red-400"}>{etf.return1Y >= 0 ? "+" : ""}{etf.return1Y.toFixed(1)}%</span>
                  <span>{etf.holdings} holdings</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Holdings Overlap</div>
          <div className="grid grid-cols-3 gap-1">
            {data.overlap.map((o, i) => (
              <div key={i} className={`rounded p-2 text-center ${o.overlapPct > 70 ? "bg-amber-900/30" : "bg-slate-800/50"}`}>
                <div className="text-[9px] text-slate-400">{o.etf1} vs {o.etf2}</div>
                <div className={`text-sm font-semibold ${o.overlapPct > 70 ? "text-amber-400" : "text-slate-200"}`}>{Math.round(o.overlapPct)}%</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Top Shared Holdings</div>
          <div className="flex flex-wrap gap-1">
            {data.topHoldings.slice(0, 6).map((h) => (
              <span key={h.symbol} className="text-[10px] px-2 py-1 rounded bg-slate-800/50 text-slate-300">
                {h.symbol} <span className="text-slate-500">({h.weight.toFixed(1)}%)</span>
              </span>
            ))}
          </div>
        </div>
        <div className="rounded bg-emerald-900/20 border border-emerald-800/30 p-2">
          <div className="text-[9px] text-emerald-400 uppercase">Recommended</div>
          <div className="text-sm font-semibold text-slate-200">{data.recommendation.pick}</div>
          <div className="text-[10px] text-slate-400">{data.recommendation.reason}</div>
        </div>
        <InterpretationFooter variant="info">
          Compare expense ratios, tracking error, and holdings overlap before selecting. High overlap ETFs provide similar exposure.
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
