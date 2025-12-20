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
import { ScoreGauge } from "@/components/shared/ScoreGauge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
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

export interface CashConversionEarningsData {
  symbol: string;
  asOf: string;
  qualityScore: number;
  grade: "High" | "Good" | "Moderate" | "Low";
  currentRatios: {
    ocfToNetIncome: number;
    fcfToNetIncome: number;
    accrualRatio: number;
  };
  historical: Array<{
    period: string;
    netIncome: number;
    ocf: number;
    conversionRate: number;
  }>;
  qualityFlags: Array<{
    flag: string;
    severity: "positive" | "neutral" | "warning";
    description: string;
  }>;
  benchmarks: {
    industryAvg: number;
    topQuartile: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getCashConversionEarningsOutput(data: CashConversionEarningsData): CardOutput {
  const { symbol, asOf, qualityScore, grade, currentRatios, qualityFlags, benchmarks } = data;
  
  const sentiment = grade === "High" || grade === "Good" ? "bullish" : grade === "Low" ? "bearish" : "neutral";
  const signalStrength = qualityScore > 80 ? 5 : qualityScore > 60 ? 4 : qualityScore > 40 ? 3 : qualityScore > 20 ? 2 : 1;
  
  const vsIndustry = currentRatios.ocfToNetIncome - benchmarks.industryAvg;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Quality Score", "cce_quality", qualityScore, 
      qualityScore > 75 ? "excellent" : qualityScore > 50 ? "good" : qualityScore > 30 ? "fair" : "poor",
      { format: "score", priority: 1 }),
    createMetric("OCF/Net Income", "cce_ocf_ni", currentRatios.ocfToNetIncome * 100, 
      currentRatios.ocfToNetIncome > 1 ? "excellent" : currentRatios.ocfToNetIncome > 0.8 ? "good" : currentRatios.ocfToNetIncome > 0.5 ? "fair" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("FCF/Net Income", "cce_fcf_ni", currentRatios.fcfToNetIncome * 100, 
      currentRatios.fcfToNetIncome > 0.8 ? "excellent" : currentRatios.fcfToNetIncome > 0.5 ? "good" : currentRatios.fcfToNetIncome > 0 ? "fair" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Accrual Ratio", "cce_accrual", currentRatios.accrualRatio * 100, 
      Math.abs(currentRatios.accrualRatio) < 0.05 ? "excellent" : Math.abs(currentRatios.accrualRatio) < 0.1 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("vs Industry Avg", "cce_vs_industry", vsIndustry * 100, 
      vsIndustry > 0.1 ? "excellent" : vsIndustry > 0 ? "good" : "fair",
      { format: "percent", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // Grade insight
  if (grade === "High") {
    insights.push(createInsight("strength", `High quality earnings - ${(currentRatios.ocfToNetIncome * 100).toFixed(0)}% of net income backed by cash`, 1, ["cce_ocf_ni"]));
  } else if (grade === "Low") {
    insights.push(createInsight("weakness", `Low quality earnings - only ${(currentRatios.ocfToNetIncome * 100).toFixed(0)}% backed by cash flow`, 1, ["cce_ocf_ni"]));
  }
  
  // OCF vs Net Income
  if (currentRatios.ocfToNetIncome > 1.2) {
    insights.push(createInsight("strength", `OCF exceeds net income by ${((currentRatios.ocfToNetIncome - 1) * 100).toFixed(0)}% - conservative accounting`, 2, ["cce_ocf_ni"]));
  } else if (currentRatios.ocfToNetIncome < 0.5) {
    insights.push(createInsight("risk", `Poor cash conversion - earnings may be inflated by accruals`, 1, ["cce_ocf_ni", "cce_accrual"]));
  }
  
  // Accrual ratio
  if (Math.abs(currentRatios.accrualRatio) > 0.1) {
    insights.push(createInsight("observation", `High accrual ratio of ${(currentRatios.accrualRatio * 100).toFixed(1)}% - investigate working capital changes`, 2, ["cce_accrual"]));
  }
  
  // Quality flags
  const warningFlags = qualityFlags.filter(f => f.severity === "warning");
  const positiveFlags = qualityFlags.filter(f => f.severity === "positive");
  
  if (warningFlags.length > 0) {
    insights.push(createInsight("risk", `${warningFlags.length} quality warning(s): ${warningFlags.map(f => f.flag).join(", ")}`, 2));
  }
  if (positiveFlags.length > 0) {
    insights.push(createInsight("strength", `${positiveFlags.length} positive indicator(s): ${positiveFlags.map(f => f.flag).join(", ")}`, 3));
  }
  
  const headline = `${symbol} ${grade.toLowerCase()} earnings quality with ${(currentRatios.ocfToNetIncome * 100).toFixed(0)}% cash conversion`;
  
  return {
    cardId: "cash-conversion-earnings",
    cardCategory: "cashflow",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: grade === "High" || grade === "Good"
      ? ["earnings-quality", "fcf-health", "sales-profit-cash"]
      : ["profit-vs-cash-divergence", "earnings-quality", "financial-stress-radar"],
    tags: ["earnings-quality", "cash-conversion", grade.toLowerCase()],
    scoreContribution: {
      category: "quality",
      score: qualityScore,
      weight: 0.15,
    },
  };
}

interface Props {
  data?: CashConversionEarningsData;
  isLoading?: boolean;
  error?: string | null;
}

export default function CashConversionEarningsCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['cashflow'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Cash Conversion of Earnings
            </CardTitle>
          <CardDescription>Analyzing earnings quality…</CardDescription>
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
          <CardTitle>Cash Conversion of Earnings</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Cash Conversion of Earnings</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const metrics = [
    { label: "OCF/Net Income", value: `${data.currentRatios.ocfToNetIncome.toFixed(0)}%`, trend: data.currentRatios.ocfToNetIncome >= 80 ? "up" as const : "down" as const },
    { label: "FCF/Net Income", value: `${data.currentRatios.fcfToNetIncome.toFixed(0)}%` },
    { label: "Accrual Ratio", value: `${data.currentRatios.accrualRatio.toFixed(1)}%`, trend: data.currentRatios.accrualRatio < 10 ? "up" as const : "down" as const },
    { label: "Quality Score", value: `${data.qualityScore}/100` },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Cash Conversion of Earnings
              <Badge variant={data.grade === "High" || data.grade === "Good" ? "success" : data.grade === "Moderate" ? "secondary" : "destructive"}>
                {data.grade} Quality
              </Badge>
            </CardTitle>
            <CardDescription>
              {data.symbol} • Earnings to cash conversion • As of {data.asOf}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${data.currentRatios.ocfToNetIncome >= 80 ? "text-emerald-400" : data.currentRatios.ocfToNetIncome >= 60 ? "text-amber-400" : "text-red-400"}`}>
              {data.currentRatios.ocfToNetIncome.toFixed(0)}%
            </div>
            <div className="text-[10px] text-slate-500">OCF/NI Conversion</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        {/* Conversion Comparison Chart */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Net Income vs Operating Cash Flow</div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.historical} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: number, name: string) => [`₹${value.toFixed(0)}Cr`, name === "netIncome" ? "Net Income" : "OCF"]}
                />
                <Bar dataKey="netIncome" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="ocf" radius={[2, 2, 0, 0]}>
                  {data.historical.map((entry, index) => (
                    <Cell key={index} fill={entry.ocf >= entry.netIncome ? "#10b981" : "#f59e0b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-1">
            <span className="text-[10px] flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded bg-purple-500" /> Net Income</span>
            <span className="text-[10px] flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded bg-emerald-500" /> OCF ≥ NI</span>
            <span className="text-[10px] flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded bg-amber-500" /> OCF &lt; NI</span>
          </div>
        </div>

        {/* Quality Gauge */}
        <div className="flex justify-center">
          <ScoreGauge value={data.qualityScore} max={100} label="Earnings Quality Score" />
        </div>

        {/* Quality Flags */}
        {data.qualityFlags.length > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] uppercase text-slate-500">Quality Indicators</div>
            {data.qualityFlags.map((flag, i) => (
              <SignalBox
                key={i}
                signal={flag.severity === "positive" ? "bullish" : flag.severity === "warning" ? "caution" : "neutral"}
                title={flag.flag}
                description={flag.description}
              />
            ))}
          </div>
        )}

        {/* Benchmarks */}
        <div className="flex items-center justify-between bg-slate-800/30 rounded p-2">
          <span className="text-[10px] text-slate-500">Industry Benchmark</span>
          <div className="flex items-center gap-3">
            <span className="text-xs">
              <span className="text-slate-500">You:</span>{" "}
              <span className={data.currentRatios.ocfToNetIncome >= data.benchmarks.industryAvg ? "text-emerald-400" : "text-amber-400"}>
                {data.currentRatios.ocfToNetIncome.toFixed(0)}%
              </span>
            </span>
            <span className="text-xs text-slate-500">|</span>
            <span className="text-xs text-slate-500">Avg: {data.benchmarks.industryAvg}%</span>
            <span className="text-xs text-slate-500">|</span>
            <span className="text-xs text-emerald-400">Top: {data.benchmarks.topQuartile}%</span>
          </div>
        </div>

        <InterpretationFooter variant={data.grade === "High" || data.grade === "Good" ? "success" : data.grade === "Moderate" ? "info" : "warning"}>
          OCF-to-Net Income conversion of {data.currentRatios.ocfToNetIncome.toFixed(0)}% indicates {data.grade.toLowerCase()} earnings quality.
          {data.currentRatios.ocfToNetIncome >= 100 
            ? " Cash flow exceeds reported earnings, suggesting conservative accounting."
            : data.currentRatios.ocfToNetIncome >= 80 
            ? " Healthy cash backing of reported profits."
            : " Lower conversion may indicate elevated accruals or working capital absorption."
          }
          {data.currentRatios.accrualRatio > 15 && ` Elevated accrual ratio of ${data.currentRatios.accrualRatio.toFixed(1)}% warrants monitoring.`}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
