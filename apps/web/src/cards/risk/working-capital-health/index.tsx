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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
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

export interface WorkingCapitalHealthData {
  symbol: string;
  asOf: string;
  healthScore: number;
  status: "Healthy" | "Adequate" | "Tight" | "Stressed";
  currentMetrics: {
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
    workingCapital: number;
    netWorkingCapitalDays: number;
  };
  cashConversionCycle: {
    dso: number;
    dio: number;
    dpo: number;
    ccc: number;
    trend: "Improving" | "Stable" | "Worsening";
  };
  historicalWC: Array<{
    period: string;
    workingCapital: number;
    currentRatio: number;
  }>;
  liquidityRunway: {
    months: number;
    cashBurnRate: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getWorkingCapitalHealthOutput(data: WorkingCapitalHealthData): CardOutput {
  const { symbol, asOf, healthScore, status, currentMetrics, cashConversionCycle, liquidityRunway } = data;
  
  const sentiment = status === "Healthy" ? "bullish" : status === "Stressed" ? "bearish" : "neutral";
  const signalStrength = healthScore > 80 ? 5 : healthScore > 60 ? 4 : healthScore > 40 ? 3 : healthScore > 20 ? 2 : 1;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Health Score", "wch_health_score", healthScore, 
      healthScore > 75 ? "excellent" : healthScore > 50 ? "good" : healthScore > 30 ? "fair" : "poor",
      { format: "score", priority: 1 }),
    createMetric("Current Ratio", "wch_current_ratio", currentMetrics.currentRatio, 
      currentMetrics.currentRatio > 2 ? "excellent" : currentMetrics.currentRatio > 1.5 ? "good" : currentMetrics.currentRatio > 1 ? "fair" : "poor",
      { format: "ratio", priority: 1, unit: "x" }),
    createMetric("Quick Ratio", "wch_quick_ratio", currentMetrics.quickRatio, 
      currentMetrics.quickRatio > 1 ? "good" : currentMetrics.quickRatio > 0.7 ? "fair" : "poor",
      { format: "ratio", priority: 1, unit: "x" }),
    createMetric("Cash Ratio", "wch_cash_ratio", currentMetrics.cashRatio, 
      currentMetrics.cashRatio > 0.5 ? "excellent" : currentMetrics.cashRatio > 0.2 ? "good" : "fair",
      { format: "ratio", priority: 2, unit: "x" }),
    createMetric("Cash Conversion Cycle", "wch_ccc", cashConversionCycle.ccc, 
      cashConversionCycle.ccc < 30 ? "excellent" : cashConversionCycle.ccc < 60 ? "good" : cashConversionCycle.ccc < 90 ? "fair" : "poor",
      { format: "number", priority: 2, unit: "days" }),
    createMetric("Liquidity Runway", "wch_runway", liquidityRunway.months, 
      liquidityRunway.months > 12 ? "safe" : liquidityRunway.months > 6 ? "moderate" : "risky",
      { format: "number", priority: 2, unit: "months" }),
    createMetric("Working Capital", "wch_wc", currentMetrics.workingCapital, 
      currentMetrics.workingCapital > 0 ? "good" : "poor",
      { format: "currency", priority: 3, unit: "₹Cr" }),
  ];
  
  const insights: Insight[] = [];
  
  // Status insight
  if (status === "Healthy") {
    insights.push(createInsight("strength", `Healthy working capital position (${healthScore}/100) - strong liquidity`, 1, ["wch_health_score"]));
  } else if (status === "Stressed") {
    insights.push(createInsight("risk", `Stressed working capital (${healthScore}/100) - liquidity constraints`, 1, ["wch_health_score"]));
  } else if (status === "Tight") {
    insights.push(createInsight("weakness", `Tight working capital (${healthScore}/100) - limited buffer`, 1, ["wch_health_score"]));
  }
  
  // Current ratio
  if (currentMetrics.currentRatio < 1) {
    insights.push(createInsight("risk", `Current ratio below 1 (${currentMetrics.currentRatio.toFixed(2)}x) - may struggle to meet short-term obligations`, 1, ["wch_current_ratio"]));
  } else if (currentMetrics.currentRatio > 2.5) {
    insights.push(createInsight("observation", `High current ratio (${currentMetrics.currentRatio.toFixed(2)}x) - may indicate inefficient capital use`, 2, ["wch_current_ratio"]));
  }
  
  // Cash conversion cycle
  if (cashConversionCycle.trend === "Worsening") {
    insights.push(createInsight("risk", `Cash conversion cycle worsening - takes ${cashConversionCycle.ccc} days to convert inventory to cash`, 2, ["wch_ccc"]));
  } else if (cashConversionCycle.ccc < 30) {
    insights.push(createInsight("strength", `Efficient ${cashConversionCycle.ccc}-day cash cycle supports strong liquidity`, 2, ["wch_ccc"]));
  }
  
  // Runway
  if (liquidityRunway.months < 6) {
    insights.push(createInsight("risk", `Only ${liquidityRunway.months} months liquidity runway at current burn rate`, 1, ["wch_runway"]));
  }
  
  const headline = `${symbol} working capital ${status.toLowerCase()} with ${currentMetrics.currentRatio.toFixed(2)}x current ratio and ${cashConversionCycle.ccc}-day cycle`;
  
  return {
    cardId: "working-capital-health",
    cardCategory: "risk",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: status === "Healthy"
      ? ["efficiency-dashboard", "fcf-health", "cash-conversion-cycle"]
      : ["financial-stress-radar", "bankruptcy-health", "leverage-history"],
    tags: ["working-capital", "liquidity", status.toLowerCase()],
    scoreContribution: {
      category: "risk",
      score: healthScore,
      weight: 0.15,
    },
  };
}

interface Props {
  data?: WorkingCapitalHealthData;
  isLoading?: boolean;
  error?: string | null;
}

export default function WorkingCapitalHealthCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['risk'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Working Capital Health
            </CardTitle>
          <CardDescription>Analyzing liquidity position…</CardDescription>
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
          <CardTitle>Working Capital Health</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Working Capital Health</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const metrics = [
    { label: "Current Ratio", value: `${data.currentMetrics.currentRatio.toFixed(2)}x`, trend: data.currentMetrics.currentRatio >= 1.5 ? "up" as const : "down" as const },
    { label: "Quick Ratio", value: `${data.currentMetrics.quickRatio.toFixed(2)}x` },
    { label: "Cash Ratio", value: `${data.currentMetrics.cashRatio.toFixed(2)}x` },
    { label: "Cash Cycle", value: `${data.cashConversionCycle.ccc} days`, trend: data.cashConversionCycle.ccc < 60 ? "up" as const : "down" as const },
  ];

  const cccData = [
    { name: "DSO", value: data.cashConversionCycle.dso, fill: "#3b82f6" },
    { name: "DIO", value: data.cashConversionCycle.dio, fill: "#8b5cf6" },
    { name: "DPO", value: -data.cashConversionCycle.dpo, fill: "#10b981" },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Working Capital Health
              <Badge variant={data.status === "Healthy" ? "success" : data.status === "Adequate" ? "secondary" : "destructive"}>
                {data.status}
              </Badge>
            </CardTitle>
            <CardDescription>
              {data.symbol} • Liquidity & working capital • As of {data.asOf}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-100">₹{(data.currentMetrics.workingCapital / 100).toFixed(0)}Cr</div>
            <div className="text-[10px] text-slate-500">Net Working Capital</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        {/* Cash Conversion Cycle Visual */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Cash Conversion Cycle Breakdown</div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cccData} layout="vertical" margin={{ left: 40, right: 20 }}>
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={(v) => `${Math.abs(v)}d`} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: number) => [`${Math.abs(value)} days`, ""]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {cccData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center items-center gap-2 mt-1">
            <span className="text-[10px] text-blue-400">DSO {data.cashConversionCycle.dso}d</span>
            <span className="text-slate-500">+</span>
            <span className="text-[10px] text-purple-400">DIO {data.cashConversionCycle.dio}d</span>
            <span className="text-slate-500">−</span>
            <span className="text-[10px] text-emerald-400">DPO {data.cashConversionCycle.dpo}d</span>
            <span className="text-slate-500">=</span>
            <span className={`text-[10px] font-semibold ${data.cashConversionCycle.ccc < 60 ? "text-emerald-400" : "text-amber-400"}`}>
              CCC {data.cashConversionCycle.ccc}d
            </span>
          </div>
        </div>

        {/* Historical Working Capital */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Working Capital Trend</div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.historicalWC} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="wcGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: number, name: string) => [name === "workingCapital" ? `₹${value}Cr` : `${value.toFixed(2)}x`, name === "workingCapital" ? "Working Capital" : "Current Ratio"]}
                />
                <Area type="monotone" dataKey="workingCapital" stroke="#3b82f6" fill="url(#wcGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Liquidity Runway */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded bg-slate-800/50 p-3">
            <div className="text-[9px] text-slate-500 uppercase">Liquidity Runway</div>
            <div className={`text-xl font-bold ${data.liquidityRunway.months >= 12 ? "text-emerald-400" : data.liquidityRunway.months >= 6 ? "text-amber-400" : "text-red-400"}`}>
              {data.liquidityRunway.months} months
            </div>
            <div className="text-[9px] text-slate-400">at current burn rate</div>
          </div>
          <div className="rounded bg-slate-800/50 p-3">
            <div className="text-[9px] text-slate-500 uppercase">CCC Trend</div>
            <div className={`text-lg font-semibold ${
              data.cashConversionCycle.trend === "Improving" ? "text-emerald-400" : 
              data.cashConversionCycle.trend === "Stable" ? "text-slate-200" : "text-red-400"
            }`}>
              {data.cashConversionCycle.trend}
            </div>
            <div className="text-[9px] text-slate-400">cash cycle efficiency</div>
          </div>
        </div>

        <InterpretationFooter variant={data.status === "Healthy" ? "success" : data.status === "Adequate" ? "info" : "warning"}>
          Current ratio of {data.currentMetrics.currentRatio.toFixed(2)}x {data.currentMetrics.currentRatio >= 1.5 ? "provides comfortable" : data.currentMetrics.currentRatio >= 1 ? "indicates adequate" : "suggests tight"} short-term liquidity.
          Cash conversion cycle of {data.cashConversionCycle.ccc} days is {data.cashConversionCycle.trend.toLowerCase()}, with {data.liquidityRunway.months} months of runway at current operations.
          {data.currentMetrics.quickRatio < 1 && " Quick ratio below 1 warrants attention to near-term cash needs."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
