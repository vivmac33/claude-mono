import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface AltmanGrahamData {
  symbol: string;
  altmanZ: { score: number; zone: "Safe" | "Grey" | "Distress" };
  grahamNumber: number;
  currentPrice: number;
  marginOfSafety: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getAltmanGrahamOutput(data: AltmanGrahamData): CardOutput {
  const { symbol, altmanZ, grahamNumber, currentPrice, marginOfSafety } = data;
  
  const isSafe = altmanZ.zone === "Safe";
  const isDistress = altmanZ.zone === "Distress";
  const hasValue = marginOfSafety > 20;
  const sentiment = isSafe && hasValue ? "bullish" : isDistress ? "bearish" : "neutral";
  const signalStrength = isSafe ? (hasValue ? 5 : 4) : isDistress ? 2 : 3;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Altman Z-Score", "ag_altman", altmanZ.score, 
      altmanZ.zone === "Safe" ? "excellent" : altmanZ.zone === "Distress" ? "poor" : "fair",
      { format: "number", priority: 1 }),
    createMetric("Graham Number", "ag_graham", grahamNumber, "neutral", 
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("Current Price", "ag_price", currentPrice, "neutral", 
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("Margin of Safety", "ag_mos", marginOfSafety, 
      marginOfSafety > 30 ? "excellent" : marginOfSafety > 0 ? "good" : "poor",
      { format: "percent", priority: 1 }),
  ];
  
  const insights: Insight[] = [];
  
  // Altman Z
  if (altmanZ.zone === "Safe") {
    insights.push(createInsight("strength", `Altman Z-Score ${altmanZ.score.toFixed(2)} - Safe Zone (low bankruptcy risk)`, 1, ["ag_altman"]));
  } else if (altmanZ.zone === "Distress") {
    insights.push(createInsight("risk", `Altman Z-Score ${altmanZ.score.toFixed(2)} - Distress Zone (high bankruptcy risk)`, 1, ["ag_altman"]));
  }
  
  // Margin of Safety
  if (marginOfSafety > 30) {
    insights.push(createInsight("strength", `${marginOfSafety.toFixed(0)}% below Graham Number - significant margin of safety`, 1, ["ag_mos"]));
  } else if (marginOfSafety < 0) {
    insights.push(createInsight("weakness", `Trading ${Math.abs(marginOfSafety).toFixed(0)}% above Graham Number - overvalued`, 2, ["ag_mos"]));
  }
  
  const headline = `${symbol} Altman Z ${altmanZ.score.toFixed(2)} (${altmanZ.zone}), Graham ₹${grahamNumber.toFixed(0)} (${marginOfSafety > 0 ? "+" : ""}${marginOfSafety.toFixed(0)}% MoS)`;
  
  return {
    cardId: "altman-graham",
    cardCategory: "mini",
    symbol,
    asOf: new Date().toISOString().split('T')[0],
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["financial-stress-radar", "bankruptcy-health", "intrinsic-value-range"],
    tags: ["altman-z", "graham-number", altmanZ.zone.toLowerCase()],
    scoreContribution: {
      category: "risk",
      score: isSafe ? 80 : isDistress ? 20 : 50,
      weight: 0.10,
    },
  };
}

interface Props { data?: AltmanGrahamData; isLoading?: boolean; error?: string | null; }

export default function AltmanGrahamMini({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['mini'];

  if (isLoading) return <Card className="p-3 border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}><Skeleton className="h-16 w-full" /></Card>;
  if (error || !data) return <Card className="p-3 border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}><div className="text-xs text-red-400">{error || "No data"}</div></Card>;

  const zoneColor = data.altmanZ.zone === "Safe" ? "text-emerald-400" : data.altmanZ.zone === "Grey" ? "text-amber-400" : "text-red-400";

  return (
    <Card className="p-3 border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
      <div className="text-[9px] uppercase text-slate-500 mb-2">Altman & Graham</div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-[9px] text-slate-500">Altman Z</div>
          <div className={`text-lg font-bold ${zoneColor}`}>{data.altmanZ.score.toFixed(2)}</div>
          <div className={`text-[9px] ${zoneColor}`}>{data.altmanZ.zone}</div>
        </div>
        <div>
          <div className="text-[9px] text-slate-500">Graham #</div>
          <div className="text-lg font-bold text-slate-100">₹{data.grahamNumber.toFixed(0)}</div>
          <div className={`text-[9px] ${data.marginOfSafety > 0 ? "text-emerald-400" : "text-red-400"}`}>
            {data.marginOfSafety > 0 ? "+" : ""}{data.marginOfSafety.toFixed(0)}% MoS
          </div>
        </div>
      </div>
    </Card>
  );
}
