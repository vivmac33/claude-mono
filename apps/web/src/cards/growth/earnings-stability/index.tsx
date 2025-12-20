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
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface EarningsStabilityData {
  symbol: string;
  asOf: string;
  stabilityScore: number;
  stabilityGrade: "High" | "Moderate" | "Low" | "Volatile";
  metrics: {
    epsVolatility: number;
    coefficientOfVariation: number;
    consecutiveGrowthYears: number;
    beatRate: number;
  };
  historicalEPS: Array<{
    period: string;
    actual: number;
    estimate: number;
  }>;
  trendLine: {
    slope: number;
    r2: number;
  };
  surpriseHistory: Array<{
    period: string;
    surprise: number;
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getEarningsStabilityOutput(data: EarningsStabilityData): CardOutput {
  const { symbol, asOf, stabilityScore, stabilityGrade, metrics, trendLine, surpriseHistory } = data;
  
  const sentiment = stabilityGrade === "High" ? "bullish" : 
    stabilityGrade === "Volatile" || stabilityGrade === "Low" ? "bearish" : "neutral";
  const signalStrength = stabilityScore > 80 ? 5 : stabilityScore > 60 ? 4 : stabilityScore > 40 ? 3 : stabilityScore > 20 ? 2 : 1;
  
  // Calculate recent surprise trend
  const recentSurprises = surpriseHistory.slice(-4);
  const avgSurprise = recentSurprises.reduce((sum, s) => sum + s.surprise, 0) / recentSurprises.length;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Stability Score", "es_stability_score", stabilityScore, 
      stabilityScore > 75 ? "excellent" : stabilityScore > 50 ? "good" : stabilityScore > 30 ? "fair" : "poor",
      { format: "score", priority: 1 }),
    createMetric("EPS Volatility", "es_eps_volatility", metrics.epsVolatility, 
      metrics.epsVolatility < 15 ? "good" : metrics.epsVolatility < 30 ? "fair" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Growth Streak", "es_growth_streak", metrics.consecutiveGrowthYears, 
      metrics.consecutiveGrowthYears >= 5 ? "excellent" : metrics.consecutiveGrowthYears >= 3 ? "good" : "fair",
      { format: "number", priority: 1, unit: "yrs" }),
    createMetric("Beat Rate", "es_beat_rate", metrics.beatRate, 
      metrics.beatRate >= 80 ? "excellent" : metrics.beatRate >= 60 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Trend R²", "es_trend_r2", trendLine.r2 * 100, 
      trendLine.r2 > 0.8 ? "excellent" : trendLine.r2 > 0.5 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Coefficient of Variation", "es_cv", metrics.coefficientOfVariation, 
      metrics.coefficientOfVariation < 20 ? "good" : metrics.coefficientOfVariation < 40 ? "fair" : "poor",
      { format: "percent", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Overall stability
  if (stabilityGrade === "High") {
    insights.push(createInsight("strength", `High earnings stability (${stabilityScore}/100) - predictable and reliable earnings`, 1, ["es_stability_score"]));
  } else if (stabilityGrade === "Volatile") {
    insights.push(createInsight("weakness", `Volatile earnings pattern (${stabilityScore}/100) - difficult to forecast`, 1, ["es_stability_score", "es_eps_volatility"]));
  } else {
    insights.push(createInsight("observation", `${stabilityGrade} earnings stability (${stabilityScore}/100)`, 1, ["es_stability_score"]));
  }
  
  // Growth streak
  if (metrics.consecutiveGrowthYears >= 5) {
    insights.push(createInsight("strength", `${metrics.consecutiveGrowthYears} consecutive years of EPS growth - strong track record`, 2, ["es_growth_streak"]));
  } else if (metrics.consecutiveGrowthYears === 0) {
    insights.push(createInsight("weakness", "No consecutive growth streak - inconsistent earnings trajectory", 2, ["es_growth_streak"]));
  }
  
  // Beat rate
  if (metrics.beatRate >= 75) {
    insights.push(createInsight("strength", `High beat rate (${metrics.beatRate.toFixed(1)}%) - consistently exceeds expectations`, 2, ["es_beat_rate"]));
  } else if (metrics.beatRate < 50) {
    insights.push(createInsight("weakness", `Low beat rate (${metrics.beatRate.toFixed(1)}%) - frequently misses estimates`, 2, ["es_beat_rate"]));
  }
  
  // Predictability
  if (trendLine.r2 > 0.8) {
    insights.push(createInsight("strength", `High earnings predictability (R²: ${(trendLine.r2 * 100).toFixed(0)}%)`, 3, ["es_trend_r2"]));
  }
  
  const headline = `${symbol} earnings ${stabilityGrade.toLowerCase()} stability with ${metrics.consecutiveGrowthYears}-year growth streak and ${metrics.beatRate}% beat rate`;
  
  return {
    cardId: "earnings-stability",
    cardCategory: "growth",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: trendLine.r2 > 0.6 ? "high" : trendLine.r2 > 0.3 ? "medium" : "low",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: stabilityGrade === "High" 
      ? ["growth-summary", "earnings-quality", "valuation-summary"]
      : ["risk-health-dashboard", "earnings-quality", "volatility-regime"],
    tags: ["earnings-stability", "predictability", stabilityGrade.toLowerCase()],
    scoreContribution: {
      category: "quality",
      score: stabilityScore,
      weight: 0.15,
    },
  };
}

interface Props {
  data?: EarningsStabilityData;
  isLoading?: boolean;
  error?: string | null;
}

function getStabilityBadge(grade: EarningsStabilityData["stabilityGrade"]) {
  switch (grade) {
    case "High": return <Badge variant="success">High Stability</Badge>;
    case "Moderate": return <Badge variant="secondary">Moderate</Badge>;
    case "Low": return <Badge variant="warning">Low Stability</Badge>;
    case "Volatile": return <Badge variant="destructive">Volatile</Badge>;
  }
}

export default function EarningsStabilityCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['growth'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Earnings Stability
            </CardTitle>
          <CardDescription>Analyzing earnings consistency…</CardDescription>
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
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Earnings Stability</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Earnings Stability</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const metrics = [
    { label: "Stability Score", value: `${Math.round(data.stabilityScore)}/100` },
    { label: "EPS Volatility", value: `${data.metrics.epsVolatility.toFixed(1)}%`, trend: data.metrics.epsVolatility < 15 ? "up" as const : "down" as const },
    { label: "Growth Streak", value: `${data.metrics.consecutiveGrowthYears} yrs` },
    { label: "Beat Rate", value: `${data.metrics.beatRate.toFixed(1)}%`, trend: data.metrics.beatRate >= 70 ? "up" as const : "down" as const },
  ];

  const avgEPS = data.historicalEPS.reduce((sum, e) => sum + e.actual, 0) / data.historicalEPS.length;

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Earnings Stability
              {getStabilityBadge(data.stabilityGrade)}
            </CardTitle>
            <CardDescription>
              {data.symbol} • Earnings consistency analysis • As of {data.asOf}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-100">{Math.round(data.stabilityScore)}</div>
            <div className="text-[10px] text-slate-500">Stability Score</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        {/* EPS Trend Chart */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Historical EPS vs Estimates</div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.historicalEPS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name === "actual" ? "Actual EPS" : "Estimate"]}
                />
                <ReferenceLine y={avgEPS} stroke="#64748b" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="estimate" stroke="#64748b" strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Surprise History */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Earnings Surprise History</div>
          <div className="flex gap-1">
            {data.surpriseHistory.slice(-8).map((s, i) => (
              <div key={i} className="flex-1 text-center">
                <div className={`h-8 rounded flex items-end justify-center ${s.surprise >= 0 ? "bg-emerald-900/30" : "bg-red-900/30"}`}>
                  <div
                    className={`w-full rounded ${s.surprise >= 0 ? "bg-emerald-500" : "bg-red-500"}`}
                    style={{ height: `${Math.min(100, Math.abs(s.surprise) * 10)}%` }}
                  />
                </div>
                <div className={`text-[9px] mt-1 ${s.surprise >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {s.surprise > 0 ? "+" : ""}{s.surprise.toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded bg-slate-800/50 p-2">
            <div className="text-[9px] text-slate-500 uppercase">Trend R²</div>
            <div className="text-sm font-semibold text-slate-200">{(data.trendLine.r2 * 100).toFixed(0)}%</div>
            <div className="text-[9px] text-slate-400">Predictability</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2">
            <div className="text-[9px] text-slate-500 uppercase">CV</div>
            <div className="text-sm font-semibold text-slate-200">{data.metrics.coefficientOfVariation.toFixed(1)}%</div>
            <div className="text-[9px] text-slate-400">Coefficient of Variation</div>
          </div>
        </div>

        <InterpretationFooter variant={data.stabilityGrade === "High" ? "success" : data.stabilityGrade === "Moderate" ? "info" : "warning"}>
          {data.stabilityGrade === "High" || data.stabilityGrade === "Moderate" 
            ? `Earnings show ${data.stabilityGrade.toLowerCase()} stability with ${data.metrics.consecutiveGrowthYears} consecutive years of growth and ${data.metrics.beatRate}% analyst beat rate. R² of ${(data.trendLine.r2 * 100).toFixed(0)}% indicates predictable earnings trajectory.`
            : `Earnings volatility of ${data.metrics.epsVolatility.toFixed(1)}% is elevated. Consider the business cyclicality and evaluate whether current valuation accounts for earnings uncertainty.`
          }
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
