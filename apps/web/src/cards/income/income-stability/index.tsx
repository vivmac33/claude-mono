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
import { InterpretationFooter, SignalBox } from "@/components/shared/InterpretationFooter";
import { RadialGauge } from "@/components/shared/ScoreGauge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface IncomeStabilityData {
  symbol: string;
  asOf: string;
  safetyScore: number;
  rating: "Very Safe" | "Safe" | "Borderline" | "Unsafe";
  currentMetrics: {
    dividendYield: number;
    payoutRatio: number;
    fcfPayoutRatio: number;
    dividendCoverage: number;
  };
  history: {
    consecutiveYears: number;
    cutsInLast10Y: number;
    growthStreak: number;
    cagr5Y: number;
  };
  dividendHistory: Array<{
    year: string;
    dividend: number;
    growth: number;
  }>;
  riskFactors: Array<{
    factor: string;
    severity: "low" | "medium" | "high";
    description: string;
  }>;
  sustainability: {
    earningsCoverage: number;
    cashCoverage: number;
    debtImpact: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getIncomeStabilityOutput(data: IncomeStabilityData): CardOutput {
  const { symbol, asOf, safetyScore, rating, currentMetrics, history, riskFactors, sustainability } = data;
  
  const isSafe = rating === "Very Safe" || rating === "Safe";
  const sentiment = isSafe ? "bullish" : rating === "Unsafe" ? "bearish" : "neutral";
  const signalStrength = safetyScore > 80 ? 5 : safetyScore > 60 ? 4 : safetyScore > 40 ? 3 : safetyScore > 20 ? 2 : 1;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Safety Score", "is_safety", safetyScore, 
      safetyScore > 75 ? "excellent" : safetyScore > 50 ? "good" : safetyScore > 30 ? "fair" : "poor",
      { format: "score", priority: 1 }),
    createMetric("Dividend Yield", "is_yield", currentMetrics.dividendYield, 
      currentMetrics.dividendYield > 3 ? "excellent" : currentMetrics.dividendYield > 1.5 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("Payout Ratio", "is_payout", currentMetrics.payoutRatio, 
      currentMetrics.payoutRatio < 50 ? "safe" : currentMetrics.payoutRatio < 70 ? "moderate" : currentMetrics.payoutRatio < 90 ? "risky" : "dangerous",
      { format: "percent", priority: 1 }),
    createMetric("FCF Payout Ratio", "is_fcf_payout", currentMetrics.fcfPayoutRatio, 
      currentMetrics.fcfPayoutRatio < 60 ? "safe" : currentMetrics.fcfPayoutRatio < 80 ? "moderate" : "risky",
      { format: "percent", priority: 2 }),
    createMetric("Dividend Coverage", "is_coverage", currentMetrics.dividendCoverage, 
      currentMetrics.dividendCoverage > 2 ? "excellent" : currentMetrics.dividendCoverage > 1.5 ? "good" : currentMetrics.dividendCoverage > 1 ? "fair" : "poor",
      { format: "ratio", priority: 1, unit: "x" }),
    createMetric("Consecutive Years", "is_streak", history.consecutiveYears, 
      history.consecutiveYears > 10 ? "excellent" : history.consecutiveYears > 5 ? "good" : "fair",
      { format: "number", priority: 2, unit: "years" }),
    createMetric("5Y CAGR", "is_cagr", history.cagr5Y, 
      history.cagr5Y > 10 ? "excellent" : history.cagr5Y > 5 ? "good" : history.cagr5Y > 0 ? "fair" : "poor",
      { format: "percent", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // Safety rating
  if (rating === "Very Safe") {
    insights.push(createInsight("strength", `Very safe dividend with ${safetyScore}/100 safety score and ${currentMetrics.dividendCoverage.toFixed(1)}x coverage`, 1, ["is_safety", "is_coverage"]));
  } else if (rating === "Unsafe") {
    insights.push(createInsight("risk", `Unsafe dividend (${safetyScore}/100) - high risk of cut`, 1, ["is_safety"]));
  } else if (rating === "Borderline") {
    insights.push(createInsight("observation", `Borderline dividend safety (${safetyScore}/100) - monitor closely`, 1, ["is_safety"]));
  }
  
  // Track record
  if (history.consecutiveYears >= 10) {
    insights.push(createInsight("strength", `${history.consecutiveYears} consecutive years of dividend payments - reliable income`, 2, ["is_streak"]));
  }
  if (history.cutsInLast10Y > 0) {
    insights.push(createInsight("weakness", `${history.cutsInLast10Y} dividend cut(s) in last 10 years`, 2));
  }
  
  // Coverage
  if (currentMetrics.dividendCoverage < 1.2) {
    insights.push(createInsight("risk", `Low dividend coverage (${currentMetrics.dividendCoverage.toFixed(1)}x) - limited margin of safety`, 1, ["is_coverage"]));
  }
  
  // Risk factors
  const highRisks = riskFactors.filter(r => r.severity === "high");
  if (highRisks.length > 0) {
    insights.push(createInsight("risk", `${highRisks.length} high-risk factor(s): ${highRisks.map(r => r.factor).join(", ")}`, 2));
  }
  
  // Growth
  if (history.cagr5Y > 10) {
    insights.push(createInsight("strength", `Strong ${history.cagr5Y.toFixed(1)}% dividend CAGR - growing income stream`, 2, ["is_cagr"]));
  }
  
  const headline = `${symbol} dividend ${rating.toLowerCase()} with ${currentMetrics.dividendYield.toFixed(1)}% yield and ${history.consecutiveYears} year streak`;
  
  return {
    cardId: "income-stability",
    cardCategory: "income",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: history.consecutiveYears >= 5 ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: isSafe
      ? ["dividend-crystal-ball", "dividend-sip-tracker", "fcf-health"]
      : ["fcf-health", "financial-stress-radar", "earnings-stability"],
    tags: ["dividend-safety", "income", rating.toLowerCase().replace(" ", "-")],
    scoreContribution: {
      category: "quality",
      score: safetyScore,
      weight: 0.15,
    },
  };
}

interface Props {
  data?: IncomeStabilityData;
  isLoading?: boolean;
  error?: string | null;
}

export default function IncomeStabilityCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['income'];

  if (isLoading) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Income Stability
            </CardTitle>
          <CardDescription>Analyzing dividend safety…</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-32 mb-3" />
          <Skeleton className="h-48 w-full mb-3" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Income Stability</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Income Stability</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const metrics = [
    { label: "Dividend Yield", value: `${data.currentMetrics.dividendYield.toFixed(2)}%` },
    { label: "Payout Ratio", value: `${data.currentMetrics.payoutRatio.toFixed(0)}%`, trend: data.currentMetrics.payoutRatio < 60 ? "up" as const : "down" as const },
    { label: "FCF Payout", value: `${data.currentMetrics.fcfPayoutRatio.toFixed(0)}%` },
    { label: "Coverage", value: `${data.currentMetrics.dividendCoverage.toFixed(1)}x`, trend: data.currentMetrics.dividendCoverage >= 2 ? "up" as const : "down" as const },
  ];

  return (
    <Card className="border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Income Stability
              <Badge variant={data.rating === "Very Safe" || data.rating === "Safe" ? "success" : data.rating === "Borderline" ? "secondary" : "destructive"}>
                {data.rating}
              </Badge>
            </CardTitle>
            <CardDescription>
              {data.symbol} • Dividend sustainability • As of {data.asOf}
            </CardDescription>
          </div>
          <RadialGauge value={data.safetyScore} max={100} label="Safety" size={70} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        {/* Dividend History Chart */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Dividend Growth History</div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dividendHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: number, name: string) => [name === "dividend" ? `₹${value.toFixed(2)}` : `${value.toFixed(1)}%`, name === "dividend" ? "DPS" : "Growth"]}
                />
                <Bar dataKey="dividend" radius={[4, 4, 0, 0]}>
                  {data.dividendHistory.map((entry, index) => (
                    <Cell key={index} fill={entry.growth >= 0 ? "#10b981" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Track Record */}
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className="text-lg font-bold text-emerald-400">{data.history.consecutiveYears}</div>
            <div className="text-[9px] text-slate-500">Years Paid</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className="text-lg font-bold text-blue-400">{data.history.growthStreak}</div>
            <div className="text-[9px] text-slate-500">Growth Streak</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className={`text-lg font-bold ${data.history.cutsInLast10Y === 0 ? "text-emerald-400" : "text-amber-400"}`}>
              {data.history.cutsInLast10Y}
            </div>
            <div className="text-[9px] text-slate-500">Cuts (10Y)</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className={`text-lg font-bold ${data.history.cagr5Y >= 5 ? "text-emerald-400" : "text-slate-200"}`}>
              {data.history.cagr5Y.toFixed(1)}%
            </div>
            <div className="text-[9px] text-slate-500">5Y CAGR</div>
          </div>
        </div>

        {/* Sustainability Indicators */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Sustainability Check</div>
          <div className="space-y-1">
            {[
              { label: "Earnings Coverage", value: data.sustainability.earningsCoverage, target: 2, good: data.sustainability.earningsCoverage >= 1.5 },
              { label: "Cash Coverage", value: data.sustainability.cashCoverage, target: 2, good: data.sustainability.cashCoverage >= 1.5 },
              { label: "Debt Impact", value: data.sustainability.debtImpact, target: 30, good: data.sustainability.debtImpact <= 30, isPercent: true },
            ].map((ind) => (
              <div key={ind.label} className="flex items-center gap-2">
                <div className="w-28 text-[10px] text-slate-500">{ind.label}</div>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${ind.good ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${Math.min(100, (ind.value / (ind.isPercent ? 100 : ind.target)) * 100)}%` }}
                  />
                </div>
                <div className={`w-12 text-right text-xs ${ind.good ? "text-emerald-400" : "text-amber-400"}`}>
                  {ind.isPercent ? `${ind.value.toFixed(0)}%` : `${ind.value.toFixed(1)}x`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        {data.riskFactors.length > 0 && (
          <div className="space-y-2">
            {data.riskFactors.map((risk, i) => (
              <SignalBox
                key={i}
                signal={risk.severity === "high" ? "bearish" : risk.severity === "medium" ? "caution" : "neutral"}
                title={risk.factor}
                description={risk.description}
              />
            ))}
          </div>
        )}

        <InterpretationFooter variant={data.rating === "Very Safe" || data.rating === "Safe" ? "success" : data.rating === "Borderline" ? "info" : "warning"}>
          {data.history.consecutiveYears} consecutive years of dividends with {data.history.cutsInLast10Y === 0 ? "no cuts" : `${data.history.cutsInLast10Y} cut(s)`} in the last decade.
          Payout ratio of {data.currentMetrics.payoutRatio.toFixed(0)}% with {data.currentMetrics.dividendCoverage.toFixed(1)}x coverage {data.currentMetrics.dividendCoverage >= 2 ? "provides comfortable safety margin" : "suggests limited buffer"}.
          {data.history.cagr5Y > 0 ? ` Dividend CAGR of ${data.history.cagr5Y.toFixed(1)}% supports income growth.` : ""}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
