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
import { RadialGauge, ScoreGauge } from "@/components/shared/ScoreGauge";
import { InterpretationFooter, SignalBox } from "@/components/shared/InterpretationFooter";

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface EarningsQualityData {
  symbol: string;
  asOf: string;
  qualityScore: number;
  qualityGrade: "Excellent" | "Good" | "Average" | "Poor" | "Concerning";
  components: {
    accrualRatio: { value: number; score: number; signal: "good" | "neutral" | "bad" };
    cashConversion: { value: number; score: number; signal: "good" | "neutral" | "bad" };
    earningsPersistence: { value: number; score: number; signal: "good" | "neutral" | "bad" };
    revenueQuality: { value: number; score: number; signal: "good" | "neutral" | "bad" };
    accountingConservatism: { value: number; score: number; signal: "good" | "neutral" | "bad" };
  };
  redFlags: Array<{
    flag: string;
    severity: "high" | "medium" | "low";
  }>;
  beneishMScore: number;
  manipulationRisk: "Low" | "Moderate" | "High";
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getEarningsQualityOutput(data: EarningsQualityData): CardOutput {
  const { symbol, asOf, qualityScore, qualityGrade, components, redFlags, beneishMScore, manipulationRisk } = data;
  
  const sentiment = qualityGrade === "Excellent" || qualityGrade === "Good" ? "bullish" : 
    qualityGrade === "Concerning" || qualityGrade === "Poor" ? "bearish" : "neutral";
  const signalStrength = qualityScore > 80 ? 5 : qualityScore > 60 ? 4 : qualityScore > 40 ? 3 : qualityScore > 20 ? 2 : 1;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Quality Score", "eq_quality_score", qualityScore, 
      qualityScore > 80 ? "excellent" : qualityScore > 60 ? "good" : qualityScore > 40 ? "fair" : "poor",
      { format: "score", priority: 1 }),
    createMetric("Beneish M-Score", "eq_beneish_m", beneishMScore, 
      manipulationRisk === "Low" ? "safe" : manipulationRisk === "Moderate" ? "moderate" : "dangerous",
      { format: "number", priority: 1 }),
    createMetric("Accrual Ratio", "eq_accrual_ratio", components.accrualRatio.value, 
      components.accrualRatio.signal === "good" ? "excellent" : components.accrualRatio.signal === "bad" ? "poor" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Cash Conversion", "eq_cash_conversion", components.cashConversion.value, 
      components.cashConversion.signal === "good" ? "excellent" : components.cashConversion.signal === "bad" ? "poor" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Earnings Persistence", "eq_persistence", components.earningsPersistence.value, 
      components.earningsPersistence.signal === "good" ? "excellent" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Revenue Quality", "eq_revenue_quality", components.revenueQuality.value, 
      components.revenueQuality.signal === "good" ? "excellent" : "fair",
      { format: "percent", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Overall quality
  insights.push(createInsight(
    qualityGrade === "Excellent" || qualityGrade === "Good" ? "strength" : 
    qualityGrade === "Concerning" ? "weakness" : "observation",
    `${qualityGrade} earnings quality (${qualityScore}/100)`,
    1, ["eq_quality_score"]
  ));
  
  // Manipulation risk
  if (manipulationRisk === "High") {
    insights.push(createInsight("risk", `High manipulation risk (M-Score: ${beneishMScore.toFixed(2)}) - earnings may not be trustworthy`, 1, ["eq_beneish_m"]));
  } else if (manipulationRisk === "Low") {
    insights.push(createInsight("strength", `Low manipulation risk (M-Score: ${beneishMScore.toFixed(2)}) - earnings appear genuine`, 2, ["eq_beneish_m"]));
  }
  
  // Component-specific insights
  if (components.cashConversion.signal === "bad") {
    insights.push(createInsight("weakness", `Poor cash conversion (${components.cashConversion.value.toFixed(1)}%) - earnings not backed by cash`, 2, ["eq_cash_conversion"]));
  }
  if (components.accrualRatio.signal === "bad") {
    insights.push(createInsight("risk", `High accrual ratio (${components.accrualRatio.value.toFixed(1)}%) - aggressive accounting practices`, 2, ["eq_accrual_ratio"]));
  }
  
  // Red flags
  const highSeverityFlags = redFlags.filter(rf => rf.severity === "high");
  if (highSeverityFlags.length > 0) {
    insights.push(createInsight("risk", `Critical red flags: ${highSeverityFlags.map(f => f.flag).slice(0, 2).join("; ")}`, 1));
  } else if (redFlags.length === 0) {
    insights.push(createInsight("strength", "No significant earnings red flags detected", 3));
  }
  
  const headline = `${symbol} earnings quality ${qualityGrade.toLowerCase()} with ${manipulationRisk.toLowerCase()} manipulation risk`;
  
  return {
    cardId: "earnings-quality",
    cardCategory: "growth",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: redFlags.length === 0 ? "high" : redFlags.length < 3 ? "medium" : "low",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: manipulationRisk === "High" 
      ? ["financial-stress-radar", "fcf-health", "cash-conversion-earnings"]
      : ["growth-summary", "piotroski-score", "profit-vs-cash-divergence"],
    tags: ["earnings-quality", "accounting", manipulationRisk.toLowerCase() + "-risk"],
    scoreContribution: {
      category: "quality",
      score: qualityScore,
      weight: 0.15,
    },
  };
}

interface Props {
  data?: EarningsQualityData;
  isLoading?: boolean;
  error?: string | null;
}

export default function EarningsQualityCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['growth'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Earnings Quality
            </CardTitle>
          <CardDescription>Analyzing earnings quality…</CardDescription>
        </CardHeader>
        <CardContent><Skeleton className="h-48 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Earnings Quality</CardTitle>
          <CardDescription className={error ? "text-red-400" : ""}>{error || "No data"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { symbol, asOf, qualityScore, qualityGrade, components, redFlags, beneishMScore, manipulationRisk } = data;

  const gradeColors = {
    Excellent: "success" as const,
    Good: "success" as const,
    Average: "secondary" as const,
    Poor: "warning" as const,
    Concerning: "destructive" as const,
  };

  const signalColors = {
    good: "bg-emerald-900/40 border-emerald-700/50",
    neutral: "bg-slate-800/40 border-slate-700/50",
    bad: "bg-red-900/40 border-red-700/50",
  };

  const componentLabels = {
    accrualRatio: "Accrual Ratio",
    cashConversion: "Cash Conversion",
    earningsPersistence: "Persistence",
    revenueQuality: "Revenue Quality",
    accountingConservatism: "Conservatism",
  };

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Earnings Quality
              <Badge variant={gradeColors[qualityGrade]}>{qualityGrade}</Badge>
            </CardTitle>
            <CardDescription>{symbol} • Quality metrics • As of {asOf}</CardDescription>
          </div>
          <RadialGauge value={qualityScore} max={100} label="Score" size={70} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quality Components */}
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(components).map(([key, comp]) => (
            <div key={key} className={`rounded-lg border p-2 ${signalColors[comp.signal]}`}>
              <div className="text-[9px] uppercase text-slate-500 truncate">{componentLabels[key as keyof typeof componentLabels]}</div>
              <div className="text-sm font-bold text-slate-100">{comp.value.toFixed(1)}%</div>
              <ScoreGauge value={comp.score} max={20} showValue={false} size="sm" className="mt-1" />
            </div>
          ))}
        </div>

        {/* Beneish M-Score */}
        <div className="bg-slate-800/30 rounded-lg p-3 flex justify-between items-center">
          <div>
            <div className="text-xs text-slate-400">Beneish M-Score</div>
            <div className="text-lg font-bold text-slate-100">{beneishMScore.toFixed(2)}</div>
          </div>
          <Badge variant={manipulationRisk === "Low" ? "success" : manipulationRisk === "High" ? "destructive" : "warning"}>
            {manipulationRisk} Manipulation Risk
          </Badge>
        </div>

        {/* Red Flags */}
        {redFlags.length > 0 && (
          <div>
            <div className="text-[10px] uppercase text-slate-500 mb-2">Red Flags ({redFlags.length})</div>
            <div className="space-y-1">
              {redFlags.map((rf, i) => (
                <div key={i} className={`text-xs px-2 py-1 rounded flex items-center gap-2 ${
                  rf.severity === "high" ? "bg-red-900/30 text-red-300" :
                  rf.severity === "medium" ? "bg-amber-900/30 text-amber-300" :
                  "bg-slate-800/30 text-slate-300"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    rf.severity === "high" ? "bg-red-400" :
                    rf.severity === "medium" ? "bg-amber-400" :
                    "bg-slate-400"
                  }`} />
                  {rf.flag}
                </div>
              ))}
            </div>
          </div>
        )}

        <InterpretationFooter variant={qualityGrade === "Excellent" || qualityGrade === "Good" ? "success" : qualityGrade === "Concerning" ? "warning" : "neutral"}>
          {qualityGrade} earnings quality with {qualityScore}/100 score.
          M-Score of {beneishMScore.toFixed(2)} indicates {manipulationRisk.toLowerCase()} manipulation risk.
          {redFlags.length > 0 ? ` ${redFlags.length} red flag(s) detected.` : " No significant red flags."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
