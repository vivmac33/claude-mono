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
import { RadialGauge } from "@/components/shared/ScoreGauge";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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

export interface CashflowStabilityData {
  symbol: string;
  asOf: string;
  stabilityIndex: number;
  grade: "A" | "B" | "C" | "D" | "F";
  metrics: {
    ocfVolatility: number;
    fcfVolatility: number;
    ocfPositiveYears: number;
    totalYears: number;
    coefficientOfVariation: number;
  };
  historicalCashflow: Array<{
    period: string;
    ocf: number;
    fcf: number;
    capex: number;
  }>;
  consistency: {
    streakYears: number;
    averageOCF: number;
    trend: "Growing" | "Stable" | "Declining" | "Volatile";
  };
  qualityIndicators: {
    ocfToNetIncome: number;
    fcfToOcf: number;
    capexIntensity: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getCashflowStabilityOutput(data: CashflowStabilityData): CardOutput {
  const { symbol, asOf, stabilityIndex, grade, metrics, consistency, qualityIndicators } = data;
  
  const sentiment = grade === "A" || grade === "B" ? "bullish" : grade === "D" || grade === "F" ? "bearish" : "neutral";
  const signalStrength = stabilityIndex > 80 ? 5 : stabilityIndex > 60 ? 4 : stabilityIndex > 40 ? 3 : stabilityIndex > 20 ? 2 : 1;
  
  const positiveYearsPct = (metrics.ocfPositiveYears / metrics.totalYears) * 100;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Stability Index", "csi_stability", stabilityIndex, 
      stabilityIndex > 75 ? "excellent" : stabilityIndex > 50 ? "good" : stabilityIndex > 30 ? "fair" : "poor",
      { format: "score", priority: 1 }),
    createMetric("OCF Volatility", "csi_ocf_vol", metrics.ocfVolatility, 
      metrics.ocfVolatility < 20 ? "excellent" : metrics.ocfVolatility < 40 ? "good" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("FCF Volatility", "csi_fcf_vol", metrics.fcfVolatility, 
      metrics.fcfVolatility < 30 ? "excellent" : metrics.fcfVolatility < 50 ? "good" : "poor",
      { format: "percent", priority: 2 }),
    createMetric("Positive OCF Years", "csi_positive_years", positiveYearsPct, 
      positiveYearsPct > 90 ? "excellent" : positiveYearsPct > 70 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("OCF/Net Income", "csi_ocf_ni", qualityIndicators.ocfToNetIncome * 100, 
      qualityIndicators.ocfToNetIncome > 1 ? "excellent" : qualityIndicators.ocfToNetIncome > 0.8 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("FCF/OCF", "csi_fcf_ocf", qualityIndicators.fcfToOcf * 100, 
      qualityIndicators.fcfToOcf > 0.5 ? "excellent" : qualityIndicators.fcfToOcf > 0.3 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Capex Intensity", "csi_capex", qualityIndicators.capexIntensity * 100, 
      qualityIndicators.capexIntensity < 0.3 ? "good" : qualityIndicators.capexIntensity < 0.5 ? "fair" : "poor",
      { format: "percent", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Grade insight
  if (grade === "A") {
    insights.push(createInsight("strength", `Grade A cash flow stability (${stabilityIndex}/100) - highly predictable cash generation`, 1, ["csi_stability"]));
  } else if (grade === "F") {
    insights.push(createInsight("weakness", `Grade F cash flow stability (${stabilityIndex}/100) - unpredictable cash flows`, 1, ["csi_stability"]));
  } else {
    insights.push(createInsight("observation", `Grade ${grade} cash flow stability (${stabilityIndex}/100)`, 1, ["csi_stability"]));
  }
  
  // Consistency
  if (consistency.streakYears >= 5) {
    insights.push(createInsight("strength", `${consistency.streakYears} consecutive years of positive operating cash flow`, 2, ["csi_positive_years"]));
  } else if (positiveYearsPct < 70) {
    insights.push(createInsight("weakness", `Only ${positiveYearsPct.toFixed(0)}% of years with positive OCF - inconsistent cash generation`, 2, ["csi_positive_years"]));
  }
  
  // Trend
  if (consistency.trend === "Growing") {
    insights.push(createInsight("strength", `Cash flow trend is growing - strengthening financial position`, 2));
  } else if (consistency.trend === "Declining") {
    insights.push(createInsight("weakness", `Cash flow trend is declining - monitor for deterioration`, 2));
  } else if (consistency.trend === "Volatile") {
    insights.push(createInsight("risk", `Volatile cash flow pattern - difficult to forecast`, 2, ["csi_ocf_vol"]));
  }
  
  // Quality
  if (qualityIndicators.ocfToNetIncome > 1.2) {
    insights.push(createInsight("strength", `High-quality earnings: OCF exceeds net income by ${((qualityIndicators.ocfToNetIncome - 1) * 100).toFixed(0)}%`, 2, ["csi_ocf_ni"]));
  }
  
  const headline = `${symbol} cash flow stability Grade ${grade} with ${metrics.ocfPositiveYears}/${metrics.totalYears} positive OCF years`;
  
  return {
    cardId: "cashflow-stability-index",
    cardCategory: "risk",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: metrics.coefficientOfVariation < 30 ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: grade === "A" || grade === "B"
      ? ["fcf-health", "earnings-quality", "dividend-crystal-ball"]
      : ["financial-stress-radar", "profit-vs-cash-divergence", "working-capital-health"],
    tags: ["cashflow-stability", `grade-${grade.toLowerCase()}`, consistency.trend.toLowerCase()],
    scoreContribution: {
      category: "quality",
      score: stabilityIndex,
      weight: 0.15,
    },
  };
}

interface Props {
  data?: CashflowStabilityData;
  isLoading?: boolean;
  error?: string | null;
}

export default function CashflowStabilityIndexCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['risk'];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Cashflow Stability Index
            </CardTitle>
          <CardDescription>Analyzing cash flow patterns…</CardDescription>
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
      <Card>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Cashflow Stability Index</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Cashflow Stability Index</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const metrics = [
    { label: "Stability Index", value: `${data.stabilityIndex}/100` },
    { label: "OCF Volatility", value: `${data.metrics.ocfVolatility.toFixed(0)}%`, trend: data.metrics.ocfVolatility < 30 ? "up" as const : "down" as const },
    { label: "Positive Years", value: `${data.metrics.ocfPositiveYears}/${data.metrics.totalYears}` },
    { label: "OCF/Net Income", value: `${data.qualityIndicators.ocfToNetIncome.toFixed(0)}%`, trend: data.qualityIndicators.ocfToNetIncome >= 80 ? "up" as const : "down" as const },
  ];

  return (
    <Card className="border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Cashflow Stability Index
              <Badge variant={data.grade === "A" || data.grade === "B" ? "success" : data.grade === "C" ? "secondary" : "destructive"}>
                Grade {data.grade}
              </Badge>
            </CardTitle>
            <CardDescription>
              {data.symbol} • Cash flow consistency • As of {data.asOf}
            </CardDescription>
          </div>
          <RadialGauge value={data.stabilityIndex} max={100} label="Stability" size={70} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        {/* Historical Cashflow Chart */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Cash Flow History (OCF vs FCF)</div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.historicalCashflow} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="ocfGradStab" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="fcfGradStab" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} tickFormatter={(v) => `₹${v}Cr`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: number, name: string) => [`₹${value.toFixed(0)}Cr`, name.toUpperCase()]}
                />
                <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="ocf" stroke="#3b82f6" fill="url(#ocfGradStab)" strokeWidth={2} />
                <Area type="monotone" dataKey="fcf" stroke="#10b981" fill="url(#fcfGradStab)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-1">
            <span className="text-[10px] flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-blue-500" /> OCF</span>
            <span className="text-[10px] flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-500" /> FCF</span>
          </div>
        </div>

        {/* Consistency Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className="text-lg font-bold text-slate-100">{data.consistency.streakYears}</div>
            <div className="text-[9px] text-slate-500">Years OCF+</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className={`text-sm font-semibold ${
              data.consistency.trend === "Growing" ? "text-emerald-400" : 
              data.consistency.trend === "Stable" ? "text-slate-200" : 
              data.consistency.trend === "Declining" ? "text-amber-400" : "text-red-400"
            }`}>
              {data.consistency.trend}
            </div>
            <div className="text-[9px] text-slate-500">Trend</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className="text-lg font-bold text-slate-100">₹{data.consistency.averageOCF.toFixed(0)}Cr</div>
            <div className="text-[9px] text-slate-500">Avg OCF</div>
          </div>
        </div>

        {/* Quality Indicators */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Quality Indicators</div>
          <div className="space-y-2">
            {[
              { label: "OCF to Net Income", value: data.qualityIndicators.ocfToNetIncome, target: 100, good: data.qualityIndicators.ocfToNetIncome >= 80 },
              { label: "FCF to OCF", value: data.qualityIndicators.fcfToOcf, target: 100, good: data.qualityIndicators.fcfToOcf >= 50 },
              { label: "Capex Intensity", value: data.qualityIndicators.capexIntensity, target: 50, good: data.qualityIndicators.capexIntensity <= 30 },
            ].map((ind) => (
              <div key={ind.label} className="flex items-center gap-2">
                <div className="w-28 text-[10px] text-slate-500">{ind.label}</div>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${ind.good ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${Math.min(100, ind.value)}%` }}
                  />
                </div>
                <div className={`w-12 text-right text-xs ${ind.good ? "text-emerald-400" : "text-amber-400"}`}>
                  {ind.value.toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <InterpretationFooter variant={data.grade === "A" || data.grade === "B" ? "success" : data.grade === "C" ? "info" : "warning"}>
          Cashflow stability index of {data.stabilityIndex} with {data.consistency.trend.toLowerCase()} trend over {data.metrics.totalYears} years.
          {data.metrics.ocfPositiveYears === data.metrics.totalYears 
            ? ` Consistent positive operating cash flow demonstrates strong cash generation ability.`
            : ` ${data.metrics.ocfPositiveYears} of ${data.metrics.totalYears} years with positive OCF indicates some variability.`
          }
          {data.qualityIndicators.ocfToNetIncome < 70 && " Low OCF/Net Income ratio suggests earnings quality may need scrutiny."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
