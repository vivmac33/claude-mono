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

export interface PriceStructureData {
  symbol: string;
  asOf: string;
  currentPrice: number;
  structure: "Higher Highs" | "Lower Lows" | "Range Bound" | "Breakout" | "Breakdown";
  levels: {
    resistance: Array<{ price: number; strength: "strong" | "moderate" | "weak"; type: string }>;
    support: Array<{ price: number; strength: "strong" | "moderate" | "weak"; type: string }>;
  };
  pivots: { r3: number; r2: number; r1: number; pivot: number; s1: number; s2: number; s3: number };
  keyLevels: { previousDayHigh: number; previousDayLow: number; weekHigh: number; weekLow: number };
  nearestLevels: { resistance: number; resistanceDist: number; support: number; supportDist: number };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getPriceStructureOutput(data: PriceStructureData): CardOutput {
  const { symbol, asOf, currentPrice, structure, levels, nearestLevels, pivots } = data;
  
  const isBullish = structure === "Higher Highs" || structure === "Breakout";
  const isBearish = structure === "Lower Lows" || structure === "Breakdown";
  const sentiment = isBullish ? "bullish" : isBearish ? "bearish" : "neutral";
  const signalStrength = structure === "Breakout" || structure === "Breakdown" ? 5 : isBullish || isBearish ? 4 : 3;
  
  const strongResistance = levels.resistance.filter(r => r.strength === "strong");
  const strongSupport = levels.support.filter(s => s.strength === "strong");
  
  const keyMetrics: MetricValue[] = [
    createMetric("Current Price", "ps_price", currentPrice, "neutral", 
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("Nearest Resistance", "ps_resistance", nearestLevels.resistance, "neutral", 
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("Distance to Resistance", "ps_res_dist", nearestLevels.resistanceDist, 
      nearestLevels.resistanceDist < 2 ? "risky" : "neutral",
      { format: "percent", priority: 1 }),
    createMetric("Nearest Support", "ps_support", nearestLevels.support, "neutral", 
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("Distance to Support", "ps_sup_dist", nearestLevels.supportDist, 
      nearestLevels.supportDist < 2 ? "risky" : "neutral",
      { format: "percent", priority: 2 }),
    createMetric("Pivot Point", "ps_pivot", pivots.pivot, "neutral", 
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("Strong Resistance Levels", "ps_strong_res", strongResistance.length, "neutral", 
      { format: "number", priority: 3 }),
    createMetric("Strong Support Levels", "ps_strong_sup", strongSupport.length, "neutral", 
      { format: "number", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Structure insight
  if (structure === "Breakout") {
    insights.push(createInsight("strength", `Breakout structure - price above key resistance`, 1, ["ps_price"]));
  } else if (structure === "Breakdown") {
    insights.push(createInsight("weakness", `Breakdown structure - price below key support`, 1, ["ps_price"]));
  } else if (structure === "Higher Highs") {
    insights.push(createInsight("strength", `Higher highs forming - bullish structure intact`, 1));
  } else if (structure === "Lower Lows") {
    insights.push(createInsight("weakness", `Lower lows forming - bearish structure`, 1));
  }
  
  // Resistance proximity
  if (nearestLevels.resistanceDist < 2) {
    insights.push(createInsight("observation", `Near resistance at ₹${nearestLevels.resistance.toFixed(0)} (${nearestLevels.resistanceDist.toFixed(1)}% away)`, 2, ["ps_resistance", "ps_res_dist"]));
  }
  
  // Support proximity
  if (nearestLevels.supportDist < 2) {
    insights.push(createInsight("observation", `Near support at ₹${nearestLevels.support.toFixed(0)} (${nearestLevels.supportDist.toFixed(1)}% away)`, 2, ["ps_support", "ps_sup_dist"]));
  }
  
  // Strong levels
  if (strongResistance.length > 0) {
    insights.push(createInsight("observation", `${strongResistance.length} strong resistance level(s) overhead`, 3, ["ps_strong_res"]));
  }
  
  const headline = `${symbol} ${structure.toLowerCase()}: current ₹${currentPrice.toFixed(0)}, resistance ₹${nearestLevels.resistance.toFixed(0)}, support ₹${nearestLevels.support.toFixed(0)}`;
  
  return {
    cardId: "price-structure",
    cardCategory: "technical",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["trend-strength", "technical-indicators", "pattern-matcher"],
    tags: ["price-structure", structure.toLowerCase().replace(" ", "-")],
    scoreContribution: {
      category: "momentum",
      score: isBullish ? 75 : isBearish ? 25 : 50,
      weight: 0.10,
    },
  };
}

interface Props { data?: PriceStructureData; isLoading?: boolean; error?: string | null; }

export default function PriceStructureCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  if (isLoading) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Price Structure
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Price Structure</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Price Structure</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  const structureColor = data.structure === "Higher Highs" || data.structure === "Breakout" ? "success" : data.structure === "Lower Lows" || data.structure === "Breakdown" ? "warning" : "neutral";
  const badgeColor = data.structure === "Higher Highs" || data.structure === "Breakout" ? "success" : data.structure === "Lower Lows" || data.structure === "Breakdown" ? "destructive" : "secondary";
  const strengthColor = (s: string) => s === "strong" ? "bg-emerald-500" : s === "moderate" ? "bg-amber-500" : "bg-slate-500";

  const metrics = [
    { label: "Current", value: `₹${data.currentPrice.toFixed(0)}` },
    { label: "Nearest Res", value: `₹${data.nearestLevels.resistance.toFixed(0)}`, trend: "up" as const },
    { label: "Nearest Sup", value: `₹${data.nearestLevels.support.toFixed(0)}`, trend: "down" as const },
    { label: "To Resistance", value: `${data.nearestLevels.resistanceDist.toFixed(1)}%` },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">Price Structure
              <Badge variant={badgeColor as any}>{data.structure}</Badge>
            </CardTitle>
            <CardDescription>{data.symbol} • S/R levels • {data.asOf}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] uppercase text-red-400 mb-2">Resistance Levels</div>
            <div className="space-y-1">
              {data.levels.resistance.slice(0, 4).map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-red-900/20 rounded px-2 py-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${strengthColor(r.strength)}`} />
                    <span className="text-slate-300">₹{r.price.toFixed(0)}</span>
                  </div>
                  <span className="text-[9px] text-slate-500">{r.type}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-emerald-400 mb-2">Support Levels</div>
            <div className="space-y-1">
              {data.levels.support.slice(0, 4).map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-emerald-900/20 rounded px-2 py-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${strengthColor(s.strength)}`} />
                    <span className="text-slate-300">₹{s.price.toFixed(0)}</span>
                  </div>
                  <span className="text-[9px] text-slate-500">{s.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Floor Pivots</div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {[
              { label: "R3", value: data.pivots.r3, color: "text-red-400" },
              { label: "R2", value: data.pivots.r2, color: "text-red-400" },
              { label: "R1", value: data.pivots.r1, color: "text-red-400" },
              { label: "P", value: data.pivots.pivot, color: "text-blue-400" },
              { label: "S1", value: data.pivots.s1, color: "text-emerald-400" },
              { label: "S2", value: data.pivots.s2, color: "text-emerald-400" },
              { label: "S3", value: data.pivots.s3, color: "text-emerald-400" },
            ].map((p) => (
              <div key={p.label} className="rounded bg-slate-800/50 p-1">
                <div className={`text-[9px] ${p.color}`}>{p.label}</div>
                <div className="text-[10px] text-slate-200">₹{p.value.toFixed(0)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded bg-slate-800/50 p-1.5 text-center">
            <div className="text-[8px] text-slate-500">PDH</div>
            <div className="text-[10px] text-slate-200">₹{data.keyLevels.previousDayHigh.toFixed(0)}</div>
          </div>
          <div className="rounded bg-slate-800/50 p-1.5 text-center">
            <div className="text-[8px] text-slate-500">PDL</div>
            <div className="text-[10px] text-slate-200">₹{data.keyLevels.previousDayLow.toFixed(0)}</div>
          </div>
          <div className="rounded bg-slate-800/50 p-1.5 text-center">
            <div className="text-[8px] text-slate-500">Wk High</div>
            <div className="text-[10px] text-slate-200">₹{data.keyLevels.weekHigh.toFixed(0)}</div>
          </div>
          <div className="rounded bg-slate-800/50 p-1.5 text-center">
            <div className="text-[8px] text-slate-500">Wk Low</div>
            <div className="text-[10px] text-slate-200">₹{data.keyLevels.weekLow.toFixed(0)}</div>
          </div>
        </div>
        <InterpretationFooter variant={structureColor}>
          {data.structure} structure. Nearest resistance ₹{data.nearestLevels.resistance.toFixed(0)} ({data.nearestLevels.resistanceDist.toFixed(1)}% away), support at ₹{data.nearestLevels.support.toFixed(0)} ({Math.abs(data.nearestLevels.supportDist).toFixed(1)}% below).
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
