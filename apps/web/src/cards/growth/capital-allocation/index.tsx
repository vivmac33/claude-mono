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
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface CapitalAllocationData {
  symbol: string;
  asOf: string;
  roic: number;
  wacc: number;
  spread: number;
  verdict: "Value Creator" | "Value Neutral" | "Value Destroyer";
  allocation: {
    reinvestment: number;
    dividends: number;
    buybacks: number;
    debtRepay: number;
    ma: number;
  };
  historicalROIC: Array<{
    year: string;
    roic: number;
    wacc: number;
  }>;
  reinvestmentEfficiency: {
    incrementalROIC: number;
    capitalEfficiency: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getCapitalAllocationOutput(data: CapitalAllocationData): CardOutput {
  const { symbol, asOf, roic, wacc, spread, verdict, allocation, reinvestmentEfficiency } = data;
  
  const sentiment = verdict === "Value Creator" ? "bullish" : verdict === "Value Destroyer" ? "bearish" : "neutral";
  const signalStrength = spread > 10 ? 5 : spread > 5 ? 4 : spread > 0 ? 3 : spread > -5 ? 2 : 1;
  
  // Find primary allocation
  const allocationEntries = [
    { name: "Reinvestment", value: allocation.reinvestment },
    { name: "Dividends", value: allocation.dividends },
    { name: "Buybacks", value: allocation.buybacks },
    { name: "Debt Repay", value: allocation.debtRepay },
    { name: "M&A", value: allocation.ma },
  ].sort((a, b) => b.value - a.value);
  const primaryAllocation = allocationEntries[0];
  
  const keyMetrics: MetricValue[] = [
    createMetric("ROIC", "ca_roic", roic, 
      roic > 20 ? "excellent" : roic > 12 ? "good" : roic > 8 ? "fair" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("WACC", "ca_wacc", wacc, "neutral", { format: "percent", priority: 2 }),
    createMetric("ROIC-WACC Spread", "ca_spread", spread, 
      spread > 5 ? "excellent" : spread > 0 ? "good" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Incremental ROIC", "ca_incremental_roic", reinvestmentEfficiency.incrementalROIC, 
      reinvestmentEfficiency.incrementalROIC > 15 ? "excellent" : reinvestmentEfficiency.incrementalROIC > 10 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Capital Efficiency", "ca_capital_efficiency", reinvestmentEfficiency.capitalEfficiency, 
      reinvestmentEfficiency.capitalEfficiency > 2 ? "excellent" : reinvestmentEfficiency.capitalEfficiency > 1 ? "good" : "fair",
      { format: "ratio", priority: 2, unit: "x" }),
    createMetric("Reinvestment Rate", "ca_reinvestment", allocation.reinvestment, "neutral", 
      { format: "percent", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Value creation verdict
  if (verdict === "Value Creator") {
    insights.push(createInsight("strength", `Value creator: ROIC ${roic.toFixed(1)}% exceeds WACC by ${spread.toFixed(1)}pp`, 1, ["ca_roic", "ca_spread"]));
  } else if (verdict === "Value Destroyer") {
    insights.push(createInsight("weakness", `Value destroyer: ROIC ${roic.toFixed(1)}% below WACC - negative spread of ${spread.toFixed(1)}pp`, 1, ["ca_roic", "ca_spread"]));
  } else {
    insights.push(createInsight("observation", `Value neutral: ROIC roughly equals cost of capital`, 1, ["ca_spread"]));
  }
  
  // Capital allocation priority
  insights.push(createInsight("observation", `Capital allocation prioritizes ${primaryAllocation.name.toLowerCase()} (${primaryAllocation.value}% of deployment)`, 2, ["ca_reinvestment"]));
  
  // Incremental returns
  if (reinvestmentEfficiency.incrementalROIC > 20) {
    insights.push(createInsight("strength", `Excellent incremental ROIC of ${reinvestmentEfficiency.incrementalROIC.toFixed(1)}% on new investments`, 2, ["ca_incremental_roic"]));
  } else if (reinvestmentEfficiency.incrementalROIC < 8) {
    insights.push(createInsight("weakness", `Weak incremental ROIC of ${reinvestmentEfficiency.incrementalROIC.toFixed(1)}% - new investments underperforming`, 2, ["ca_incremental_roic"]));
  }
  
  // Shareholder returns
  const shareholderReturn = allocation.dividends + allocation.buybacks;
  if (shareholderReturn > 50) {
    insights.push(createInsight("observation", `High shareholder return focus: ${shareholderReturn}% via dividends and buybacks`, 3));
  }
  
  const headline = `${symbol} is a ${verdict.toLowerCase()} with ${spread > 0 ? "+" : ""}${spread.toFixed(1)}% ROIC-WACC spread`;
  
  return {
    cardId: "capital-allocation",
    cardCategory: "growth",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: spread > 0 
      ? ["dupont-analysis", "growth-summary", "fcf-health"]
      : ["risk-health-dashboard", "leverage-history", "financial-stress-radar"],
    tags: ["capital-allocation", "roic", verdict.toLowerCase().replace(" ", "-")],
    scoreContribution: {
      category: "quality",
      score: Math.min(100, Math.max(0, 50 + spread * 5)),
      weight: 0.20,
    },
  };
}

interface Props {
  data?: CapitalAllocationData;
  isLoading?: boolean;
  error?: string | null;
}

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

export default function CapitalAllocationCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['growth'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Capital Allocation
            </CardTitle>
          <CardDescription>Analyzing capital deployment…</CardDescription>
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
          <CardTitle>Capital Allocation</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Capital Allocation</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const allocationData = [
    { name: "Reinvestment", value: data.allocation.reinvestment },
    { name: "Dividends", value: data.allocation.dividends },
    { name: "Buybacks", value: data.allocation.buybacks },
    { name: "Debt Repay", value: data.allocation.debtRepay },
    { name: "M&A", value: data.allocation.ma },
  ].filter(d => d.value > 0);

  const metrics = [
    { label: "ROIC", value: `${data.roic.toFixed(1)}%`, trend: data.roic >= 15 ? "up" as const : "down" as const },
    { label: "WACC", value: `${data.wacc.toFixed(1)}%` },
    { label: "Spread", value: `${data.spread > 0 ? "+" : ""}${data.spread.toFixed(1)}%`, trend: data.spread > 0 ? "up" as const : "down" as const },
    { label: "Inc. ROIC", value: `${data.reinvestmentEfficiency.incrementalROIC.toFixed(1)}%` },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Capital Allocation
              <Badge variant={data.verdict === "Value Creator" ? "success" : data.verdict === "Value Neutral" ? "secondary" : "destructive"}>
                {data.verdict}
              </Badge>
            </CardTitle>
            <CardDescription>
              {data.symbol} • Capital deployment analysis • As of {data.asOf}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${data.spread > 0 ? "text-emerald-400" : "text-red-400"}`}>
              {data.spread > 0 ? "+" : ""}{data.spread.toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-500">ROIC - WACC Spread</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        <div className="grid grid-cols-2 gap-4">
          {/* Allocation Pie */}
          <div>
            <div className="text-[10px] uppercase text-slate-500 mb-2">Capital Deployment Mix</div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-1 justify-center mt-1">
              {allocationData.map((entry, index) => (
                <span key={entry.name} className="text-[9px] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name}
                </span>
              ))}
            </div>
          </div>

          {/* ROIC vs WACC History */}
          <div>
            <div className="text-[10px] uppercase text-slate-500 mb-2">ROIC vs WACC Trend</div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.historicalROIC} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                  <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                    formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name.toUpperCase()]}
                  />
                  <Bar dataKey="roic" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="wacc" fill="#64748b" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Efficiency Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded bg-slate-800/50 p-2">
            <div className="text-[9px] text-slate-500 uppercase">Incremental ROIC</div>
            <div className={`text-lg font-semibold ${data.reinvestmentEfficiency.incrementalROIC >= 15 ? "text-emerald-400" : "text-amber-400"}`}>
              {data.reinvestmentEfficiency.incrementalROIC.toFixed(1)}%
            </div>
            <div className="text-[9px] text-slate-400">Return on new investments</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2">
            <div className="text-[9px] text-slate-500 uppercase">Capital Efficiency</div>
            <div className="text-lg font-semibold text-slate-200">
              {data.reinvestmentEfficiency.capitalEfficiency.toFixed(2)}x
            </div>
            <div className="text-[9px] text-slate-400">Revenue per capital employed</div>
          </div>
        </div>

        <InterpretationFooter variant={data.spread > 5 ? "success" : data.spread > 0 ? "info" : "warning"}>
          {data.spread > 0 
            ? `ROIC of ${data.roic.toFixed(1)}% exceeds cost of capital by ${data.spread.toFixed(1)}pp, indicating value creation. `
            : `ROIC of ${data.roic.toFixed(1)}% is below WACC of ${data.wacc.toFixed(1)}%, destroying shareholder value. `
          }
          Capital allocation prioritizes {allocationData[0]?.name.toLowerCase()} ({allocationData[0]?.value}%) 
          with incremental returns of {data.reinvestmentEfficiency.incrementalROIC.toFixed(1)}% on new investments.
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
