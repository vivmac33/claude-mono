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

export interface FCFHealthData {
  symbol: string;
  asOf: string;
  healthScore: number;
  grade: "Excellent" | "Good" | "Fair" | "Poor";
  currentMetrics: {
    fcf: number;
    fcfYield: number;
    fcfMargin: number;
    fcfGrowth: number;
  };
  historicalFCF: Array<{
    period: string;
    fcf: number;
    ocf: number;
    capex: number;
  }>;
  sustainability: {
    avgFcfMargin: number;
    volatility: number;
    consistency: number;
  };
  usage: {
    dividends: number;
    buybacks: number;
    debtRepay: number;
    acquisitions: number;
    reinvestment: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getFCFHealthOutput(data: FCFHealthData): CardOutput {
  const { symbol, asOf, healthScore, grade, currentMetrics, sustainability, usage } = data;
  
  const sentiment = grade === "Excellent" || grade === "Good" ? "bullish" : grade === "Poor" ? "bearish" : "neutral";
  const signalStrength = healthScore > 80 ? 5 : healthScore > 60 ? 4 : healthScore > 40 ? 3 : healthScore > 20 ? 2 : 1;
  
  const shareholderReturn = usage.dividends + usage.buybacks;
  
  const keyMetrics: MetricValue[] = [
    createMetric("FCF Health Score", "fcf_health_score", healthScore, 
      healthScore > 75 ? "excellent" : healthScore > 50 ? "good" : healthScore > 30 ? "fair" : "poor",
      { format: "score", priority: 1 }),
    createMetric("Free Cash Flow", "fcf_amount", currentMetrics.fcf, 
      currentMetrics.fcf > 0 ? "good" : "poor",
      { format: "currency", priority: 1, unit: "₹Cr" }),
    createMetric("FCF Yield", "fcf_yield", currentMetrics.fcfYield, 
      currentMetrics.fcfYield > 6 ? "excellent" : currentMetrics.fcfYield > 3 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("FCF Margin", "fcf_margin", currentMetrics.fcfMargin, 
      currentMetrics.fcfMargin > 15 ? "excellent" : currentMetrics.fcfMargin > 8 ? "good" : currentMetrics.fcfMargin > 0 ? "fair" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("FCF Growth", "fcf_growth", currentMetrics.fcfGrowth, 
      currentMetrics.fcfGrowth > 15 ? "excellent" : currentMetrics.fcfGrowth > 0 ? "good" : "poor",
      { format: "percent", priority: 2, trend: { direction: currentMetrics.fcfGrowth > 0 ? "up" : "down", period: "YoY" } }),
    createMetric("FCF Consistency", "fcf_consistency", sustainability.consistency, 
      sustainability.consistency > 80 ? "excellent" : sustainability.consistency > 60 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("FCF Volatility", "fcf_volatility", sustainability.volatility, 
      sustainability.volatility < 20 ? "excellent" : sustainability.volatility < 40 ? "good" : "poor",
      { format: "percent", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Grade insight
  if (grade === "Excellent") {
    insights.push(createInsight("strength", `Excellent FCF health (${healthScore}/100) - strong and consistent cash generation`, 1, ["fcf_health_score"]));
  } else if (grade === "Poor") {
    insights.push(createInsight("weakness", `Poor FCF health (${healthScore}/100) - weak or inconsistent cash generation`, 1, ["fcf_health_score"]));
  }
  
  // FCF yield
  if (currentMetrics.fcfYield > 6) {
    insights.push(createInsight("strength", `Attractive FCF yield of ${currentMetrics.fcfYield.toFixed(1)}% - good value indicator`, 2, ["fcf_yield"]));
  }
  
  // Growth
  if (currentMetrics.fcfGrowth > 20) {
    insights.push(createInsight("strength", `Strong FCF growth of ${currentMetrics.fcfGrowth.toFixed(0)}% YoY`, 2, ["fcf_growth"]));
  } else if (currentMetrics.fcfGrowth < -10) {
    insights.push(createInsight("weakness", `FCF declining ${Math.abs(currentMetrics.fcfGrowth).toFixed(0)}% YoY - investigate causes`, 2, ["fcf_growth"]));
  }
  
  // Usage
  if (shareholderReturn > 70) {
    insights.push(createInsight("observation", `High shareholder return: ${shareholderReturn}% of FCF to dividends/buybacks`, 2));
  }
  
  // Consistency
  if (sustainability.consistency < 50) {
    insights.push(createInsight("risk", `Low FCF consistency (${sustainability.consistency}%) - unpredictable cash generation`, 2, ["fcf_consistency"]));
  }
  
  const headline = `${symbol} FCF health ${grade.toLowerCase()} with ${currentMetrics.fcfYield.toFixed(1)}% yield and ${currentMetrics.fcfGrowth > 0 ? "+" : ""}${currentMetrics.fcfGrowth.toFixed(0)}% growth`;
  
  return {
    cardId: "fcf-health",
    cardCategory: "cashflow",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: sustainability.consistency > 70 ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: grade === "Excellent" || grade === "Good"
      ? ["dividend-crystal-ball", "valuation-summary", "capital-allocation"]
      : ["cash-conversion-cycle", "profit-vs-cash-divergence", "working-capital-health"],
    tags: ["fcf", "cash-flow", grade.toLowerCase()],
    scoreContribution: {
      category: "quality",
      score: healthScore,
      weight: 0.20,
    },
  };
}

interface Props {
  data?: FCFHealthData;
  isLoading?: boolean;
  error?: string | null;
}

export default function FCFHealthCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['cashflow'];

  if (isLoading) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              FCF Health
            </CardTitle>
          <CardDescription>Analyzing free cash flow…</CardDescription>
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
      <Card className="border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>FCF Health</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>FCF Health</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const metrics = [
    { label: "FCF", value: `₹${data.currentMetrics.fcf.toFixed(0)}Cr` },
    { label: "FCF Yield", value: `${data.currentMetrics.fcfYield.toFixed(1)}%`, trend: data.currentMetrics.fcfYield >= 5 ? "up" as const : "neutral" as const },
    { label: "FCF Margin", value: `${data.currentMetrics.fcfMargin.toFixed(1)}%` },
    { label: "FCF Growth", value: `${data.currentMetrics.fcfGrowth > 0 ? "+" : ""}${data.currentMetrics.fcfGrowth.toFixed(0)}%`, trend: data.currentMetrics.fcfGrowth > 0 ? "up" as const : "down" as const },
  ];

  return (
    <Card className="border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              FCF Health
              <Badge variant={data.grade === "Excellent" || data.grade === "Good" ? "success" : data.grade === "Fair" ? "secondary" : "destructive"}>
                {data.grade}
              </Badge>
            </CardTitle>
            <CardDescription>
              {data.symbol} • Free cash flow analysis • As of {data.asOf}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${data.currentMetrics.fcf >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              ₹{data.currentMetrics.fcf.toFixed(0)}Cr
            </div>
            <div className="text-[10px] text-slate-500">Free Cash Flow</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        {/* Historical FCF Chart */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">FCF Generation History</div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.historicalFCF} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: number, name: string) => [`₹${value.toFixed(0)}Cr`, name === "fcf" ? "FCF" : name === "ocf" ? "OCF" : "Capex"]}
                />
                <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />
                <Bar dataKey="fcf" radius={[4, 4, 0, 0]}>
                  {data.historicalFCF.map((entry, index) => (
                    <Cell key={index} fill={entry.fcf >= 0 ? "#10b981" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sustainability Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className="text-lg font-bold text-slate-100">{data.sustainability.avgFcfMargin.toFixed(1)}%</div>
            <div className="text-[9px] text-slate-500">Avg FCF Margin</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className={`text-lg font-bold ${data.sustainability.volatility < 30 ? "text-emerald-400" : "text-amber-400"}`}>
              {data.sustainability.volatility.toFixed(0)}%
            </div>
            <div className="text-[9px] text-slate-500">Volatility</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className="text-lg font-bold text-slate-100">{data.sustainability.consistency.toFixed(0)}%</div>
            <div className="text-[9px] text-slate-500">Consistency</div>
          </div>
        </div>

        {/* FCF Usage Breakdown */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">FCF Deployment</div>
          <div className="space-y-1">
            {[
              { label: "Dividends", value: data.usage.dividends, color: "bg-purple-500" },
              { label: "Buybacks", value: data.usage.buybacks, color: "bg-blue-500" },
              { label: "Debt Repay", value: data.usage.debtRepay, color: "bg-emerald-500" },
              { label: "M&A", value: data.usage.acquisitions, color: "bg-amber-500" },
              { label: "Reinvestment", value: data.usage.reinvestment, color: "bg-slate-500" },
            ].filter(u => u.value > 0).map((usage) => (
              <div key={usage.label} className="flex items-center gap-2">
                <div className="w-20 text-[10px] text-slate-500">{usage.label}</div>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${usage.color}`} style={{ width: `${usage.value}%` }} />
                </div>
                <div className="w-10 text-right text-[10px] text-slate-400">{usage.value}%</div>
              </div>
            ))}
          </div>
        </div>

        <InterpretationFooter variant={data.grade === "Excellent" || data.grade === "Good" ? "success" : data.grade === "Fair" ? "info" : "warning"}>
          FCF yield of {data.currentMetrics.fcfYield.toFixed(1)}% with {data.sustainability.consistency.toFixed(0)}% consistency over the measurement period.
          {data.currentMetrics.fcfGrowth > 0 
            ? ` Growing FCF at ${data.currentMetrics.fcfGrowth.toFixed(0)}% supports dividend sustainability and capital returns.`
            : ` Declining FCF trend may pressure future dividend capacity.`
          }
          {data.usage.reinvestment > 50 && " High reinvestment rate suggests growth-focused capital allocation."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
