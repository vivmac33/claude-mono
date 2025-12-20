import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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

export interface IntrinsicValueRangeData {
  symbol: string;
  asOf: string;
  currentPrice: number;
  valuationMethods: Array<{
    method: string;
    lowValue: number;
    midValue: number;
    highValue: number;
    weight: number;
  }>;
  compositeRange: {
    low: number;
    mid: number;
    high: number;
  };
  verdict: "Below Range" | "Within Range" | "Above Range";
  upside: number;
  confidence: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getIntrinsicValueRangeOutput(data: IntrinsicValueRangeData): CardOutput {
  const { symbol, asOf, currentPrice, valuationMethods, compositeRange, verdict, upside, confidence } = data;
  
  const sentiment = verdict === "Below Range" ? "bullish" : verdict === "Above Range" ? "bearish" : "neutral";
  const signalStrength = Math.abs(upside) > 30 ? 5 : Math.abs(upside) > 20 ? 4 : Math.abs(upside) > 10 ? 3 : 2;
  const rangeWidth = compositeRange.high - compositeRange.low;
  const rangeWidthPct = (rangeWidth / compositeRange.mid) * 100;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Composite Fair Value", "ivr_mid_value", compositeRange.mid, 
      verdict === "Below Range" ? "undervalued" : verdict === "Above Range" ? "overvalued" : "fairly-valued",
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("Current Price", "ivr_current_price", currentPrice, "neutral", 
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("Value Range Low", "ivr_low_value", compositeRange.low, "neutral", 
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("Value Range High", "ivr_high_value", compositeRange.high, "neutral", 
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("Upside to Mid", "ivr_upside", upside, 
      upside > 20 ? "bullish" : upside < -10 ? "bearish" : "neutral",
      { format: "percent", priority: 1 }),
    createMetric("Model Confidence", "ivr_confidence", confidence, 
      confidence > 80 ? "excellent" : confidence > 60 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Range Width", "ivr_range_width", rangeWidthPct, 
      rangeWidthPct < 30 ? "good" : rangeWidthPct < 50 ? "fair" : "poor",
      { format: "percent", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Main verdict
  if (verdict === "Below Range") {
    insights.push(createInsight("strength", `Price below intrinsic range - ${Math.abs(upside).toFixed(0)}% upside to composite fair value`, 1, ["ivr_upside", "ivr_mid_value"]));
  } else if (verdict === "Above Range") {
    insights.push(createInsight("weakness", `Price above intrinsic range - trading at ${Math.abs(upside).toFixed(0)}% premium to fair value`, 1, ["ivr_upside", "ivr_mid_value"]));
  } else {
    insights.push(createInsight("observation", `Price within fair value range - no clear margin of safety`, 1, ["ivr_mid_value"]));
  }
  
  // Method agreement
  const methodAgreement = valuationMethods.filter(vm => 
    (vm.midValue > currentPrice && verdict === "Below Range") ||
    (vm.midValue < currentPrice && verdict === "Above Range")
  ).length / valuationMethods.length;
  
  if (methodAgreement > 0.8) {
    insights.push(createInsight("strength", `Strong consensus: ${(methodAgreement * 100).toFixed(0)}% of valuation methods agree on direction`, 2, ["ivr_confidence"]));
  } else if (methodAgreement < 0.5 && verdict !== "Within Range") {
    insights.push(createInsight("risk", `Mixed signals: valuation methods show divergent fair values`, 2, ["ivr_confidence"]));
  }
  
  // Range width insight
  if (rangeWidthPct > 50) {
    insights.push(createInsight("risk", `Wide valuation range (${rangeWidthPct.toFixed(0)}%) suggests high uncertainty`, 2, ["ivr_range_width"]));
  }
  
  // Highlight top method
  const topMethod = valuationMethods.sort((a, b) => b.weight - a.weight)[0];
  if (topMethod) {
    insights.push(createInsight("observation", `${topMethod.method} (${(topMethod.weight * 100).toFixed(0)}% weight) suggests ₹${topMethod.midValue.toFixed(0)} fair value`, 3));
  }
  
  const headline = `${symbol} composite value range ₹${compositeRange.low.toFixed(0)}-${compositeRange.high.toFixed(0)} suggests ${verdict.toLowerCase()}`;
  
  return {
    cardId: "intrinsic-value-range",
    cardCategory: "value",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: confidence > 70 ? "high" : confidence > 50 ? "medium" : "low",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: verdict === "Below Range" 
      ? ["dcf-valuation", "fair-value-forecaster", "piotroski-score"]
      : ["risk-health-dashboard", "valuation-summary"],
    tags: ["intrinsic-value", "valuation", "multi-model", verdict.toLowerCase().replace(" ", "-")],
    scoreContribution: {
      category: "valuation",
      score: Math.min(100, Math.max(0, 50 + upside)),
      weight: 0.20,
    },
  };
}

interface Props {
  data?: IntrinsicValueRangeData;
  isLoading?: boolean;
  error?: string | null;
}

export default function IntrinsicValueRangeCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['value'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Intrinsic Value Range
            </CardTitle>
          <CardDescription>Calculating value range…</CardDescription>
        </CardHeader>
        <CardContent><Skeleton className="h-48 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Intrinsic Value Range</CardTitle>
          <CardDescription className={error ? "text-red-400" : ""}>{error || "No data"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { symbol, asOf, currentPrice, valuationMethods, compositeRange, verdict, upside, confidence } = data;

  const verdictBadge = {
    "Below Range": <Badge variant="success">Undervalued</Badge>,
    "Within Range": <Badge variant="secondary">Fair Value</Badge>,
    "Above Range": <Badge variant="destructive">Overvalued</Badge>,
  };

  const rangeWidth = compositeRange.high - compositeRange.low;
  const pricePosition = ((currentPrice - compositeRange.low) / rangeWidth) * 100;
  const clampedPosition = Math.max(0, Math.min(100, pricePosition));

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Intrinsic Value Range
              {verdictBadge[verdict]}
            </CardTitle>
            <CardDescription>{symbol} • Multi-model range • As of {asOf}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-slate-100">${compositeRange.mid.toFixed(2)}</div>
            <div className="text-xs text-slate-400">Composite Fair Value</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip
          metrics={[
            { label: "Current", value: `$${currentPrice.toFixed(2)}` },
            { label: "Low", value: `$${compositeRange.low.toFixed(2)}` },
            { label: "Mid", value: `$${compositeRange.mid.toFixed(2)}` },
            { label: "High", value: `$${compositeRange.high.toFixed(2)}` },
            { label: "Upside", value: `${upside > 0 ? "+" : ""}${upside.toFixed(1)}%`, trend: upside > 0 ? "up" : "down" },
            { label: "Confidence", value: `${confidence}%` },
          ]}
          columns={6}
        />

        {/* Range Visualization */}
        <div className="bg-slate-800/30 rounded-lg p-3">
          <div className="text-[10px] uppercase text-slate-500 mb-3">Price Position in Value Range</div>
          <div className="relative h-8 bg-gradient-to-r from-emerald-900/40 via-blue-900/40 to-red-900/40 rounded-full">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 rounded-full border-2 border-slate-900 shadow-lg"
              style={{ left: `calc(${clampedPosition}% - 8px)` }}
            />
            <div className="absolute -bottom-5 left-0 text-[9px] text-slate-500">${compositeRange.low.toFixed(0)}</div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-slate-400">${compositeRange.mid.toFixed(0)}</div>
            <div className="absolute -bottom-5 right-0 text-[9px] text-slate-500">${compositeRange.high.toFixed(0)}</div>
          </div>
        </div>

        {/* Valuation Methods */}
        <div className="space-y-2 mt-6">
          <div className="text-[10px] uppercase text-slate-500">Valuation Methods</div>
          {valuationMethods.map((vm) => (
            <div key={vm.method} className="flex items-center gap-3 text-xs">
              <span className="w-24 text-slate-400">{vm.method}</span>
              <div className="flex-1 relative h-4 bg-slate-800/50 rounded">
                <div
                  className="absolute h-full bg-blue-600/30 rounded"
                  style={{
                    left: `${((vm.lowValue - compositeRange.low) / rangeWidth) * 100}%`,
                    width: `${((vm.highValue - vm.lowValue) / rangeWidth) * 100}%`,
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"
                  style={{ left: `calc(${((vm.midValue - compositeRange.low) / rangeWidth) * 100}% - 4px)` }}
                />
              </div>
              <span className="w-16 text-right text-slate-300">${vm.midValue.toFixed(0)}</span>
              <span className="w-12 text-right text-slate-500">{(vm.weight * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>

        <InterpretationFooter variant={verdict === "Below Range" ? "success" : verdict === "Above Range" ? "warning" : "neutral"}>
          Composite range spans ${compositeRange.low.toFixed(0)} – ${compositeRange.high.toFixed(0)} with {confidence}% confidence.
          {verdict === "Below Range"
            ? " Price below range suggests margin of safety exists."
            : verdict === "Above Range"
            ? " Premium to intrinsic value implies limited upside."
            : " Trading within fair value band; look for catalysts."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
