import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface FactorTiltData {
  symbol: string;
  asOf: string;
  factors: Array<{
    name: string;
    exposure: number;
    percentile: number;
  }>;
  dominantFactor: string;
  factorMomentum: "Favorable" | "Neutral" | "Unfavorable";
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getFactorTiltOutput(data: FactorTiltData): CardOutput {
  const { symbol, asOf, factors, dominantFactor, factorMomentum } = data;
  
  const sentiment = factorMomentum === "Favorable" ? "bullish" : factorMomentum === "Unfavorable" ? "bearish" : "neutral";
  const signalStrength = factorMomentum === "Favorable" ? 4 : factorMomentum === "Unfavorable" ? 2 : 3;
  
  const keyMetrics: MetricValue[] = factors.map(f => 
    createMetric(f.name, `ft_${f.name.toLowerCase().replace(/\s/g, "_")}`, f.exposure, 
      f.exposure > 0.5 ? "excellent" : f.exposure > 0 ? "good" : f.exposure > -0.5 ? "fair" : "poor",
      { format: "number", priority: f.name === dominantFactor ? 1 : 2, percentile: f.percentile })
  );
  
  const insights: Insight[] = [];
  
  // Dominant factor
  const dominant = factors.find(f => f.name === dominantFactor);
  if (dominant) {
    const direction = dominant.exposure > 0 ? "positive" : "negative";
    insights.push(createInsight(dominant.exposure > 0 ? "strength" : "observation", 
      `Dominant factor: ${dominantFactor} (${direction} ${Math.abs(dominant.exposure).toFixed(2)} exposure, P${dominant.percentile})`, 1));
  }
  
  // Factor momentum
  if (factorMomentum === "Favorable") {
    insights.push(createInsight("strength", "Factor momentum favorable - aligned with current market conditions", 2));
  } else if (factorMomentum === "Unfavorable") {
    insights.push(createInsight("weakness", "Factor momentum unfavorable - headwind from factor exposure", 2));
  }
  
  // Strong exposures
  const strongPositive = factors.filter(f => f.exposure > 0.5);
  const strongNegative = factors.filter(f => f.exposure < -0.5);
  
  if (strongPositive.length > 0) {
    insights.push(createInsight("strength", `Strong positive exposure: ${strongPositive.map(f => f.name).join(", ")}`, 3));
  }
  if (strongNegative.length > 0) {
    insights.push(createInsight("observation", `Strong negative exposure: ${strongNegative.map(f => f.name).join(", ")}`, 3));
  }
  
  const headline = `${symbol} factor profile: ${dominantFactor} dominant, momentum ${factorMomentum.toLowerCase()}`;
  
  return {
    cardId: "factor-tilt",
    cardCategory: "mini",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["multi-factor-scorecard", "peer-comparison", "market-regime-radar"],
    tags: ["factor", dominantFactor.toLowerCase(), factorMomentum.toLowerCase()],
    scoreContribution: {
      category: "momentum",
      score: factorMomentum === "Favorable" ? 70 : factorMomentum === "Unfavorable" ? 30 : 50,
      weight: 0.05,
    },
  };
}

interface Props {
  data?: FactorTiltData;
  isLoading?: boolean;
  error?: string | null;
}

function FactorBar({ name, exposure, percentile }: { name: string; exposure: number; percentile: number }) {
  const barWidth = Math.min(100, Math.abs(exposure) * 20);
  const isPositive = exposure > 0;

  return (
    <div className="flex items-center gap-2 text-[10px]">
      <span className="w-16 text-slate-400 truncate">{name}</span>
      <div className="flex-1 flex items-center">
        <div className="w-full h-2 bg-slate-800/50 rounded-full relative overflow-hidden">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-600" />
          {/* Bar */}
          <div
            className={`absolute top-0 bottom-0 rounded-full transition-all ${
              isPositive ? "bg-emerald-500" : "bg-red-500"
            }`}
            style={{
              left: isPositive ? "50%" : `${50 - barWidth / 2}%`,
              width: `${barWidth / 2}%`,
            }}
          />
        </div>
      </div>
      <span className={`w-10 text-right font-medium ${
        exposure > 0.5 ? "text-emerald-400" : exposure < -0.5 ? "text-red-400" : "text-slate-400"
      }`}>
        {exposure > 0 ? "+" : ""}{exposure.toFixed(2)}
      </span>
      <span className="w-8 text-right text-slate-500">P{percentile}</span>
    </div>
  );
}

export default function FactorTiltMini({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['mini'];

  if (isLoading) {
    return (
      <Card className="w-full max-w-xs border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Factor Tilt</CardTitle>
        </CardHeader>
        <CardContent><Skeleton className="h-28 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="w-full max-w-xs border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Factor Tilt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-slate-500">{error || "No data"}</div>
        </CardContent>
      </Card>
    );
  }

  const { symbol, factors, dominantFactor, factorMomentum } = data;
  const safeFactors = factors || [];

  const momentumColors = {
    Favorable: "text-emerald-400",
    Neutral: "text-slate-400",
    Unfavorable: "text-red-400",
  };

  return (
    <Card className="w-full max-w-xs border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">Factor Tilt</CardTitle>
          <span className="text-xs text-slate-400">{symbol}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {safeFactors.map((f) => (
          <FactorBar key={f.name} name={f.name} exposure={f.exposure} percentile={f.percentile} />
        ))}
        
        <div className="pt-2 border-t border-slate-700/50 flex justify-between items-center">
          <div>
            <span className="text-[9px] text-slate-500">Dominant: </span>
            <span className="text-[10px] text-slate-200">{dominantFactor}</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500">Momentum: </span>
            <span className={`text-[10px] font-medium ${momentumColors[factorMomentum]}`}>
              {factorMomentum}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
