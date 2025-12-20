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
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
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

export interface ProfitCashDivergenceData {
  symbol: string;
  asOf: string;
  divergenceScore: number;
  riskLevel: "Low" | "Moderate" | "High" | "Critical";
  currentDivergence: {
    netIncome: number;
    operatingCashFlow: number;
    divergencePct: number;
  };
  historicalDivergence: Array<{
    period: string;
    profit: number;
    ocf: number;
    divergence: number;
  }>;
  redFlags: Array<{
    flag: string;
    severity: "warning" | "critical";
    detail: string;
  }>;
  drivers: {
    receivablesChange: number;
    inventoryChange: number;
    payablesChange: number;
    otherAccruals: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getProfitCashDivergenceOutput(data: ProfitCashDivergenceData): CardOutput {
  const { symbol, asOf, divergenceScore, riskLevel, currentDivergence, redFlags, drivers } = data;
  
  // INVERSE sentiment: low divergence = bullish, high divergence = bearish
  const sentiment = riskLevel === "Low" ? "bullish" : riskLevel === "Critical" || riskLevel === "High" ? "bearish" : "neutral";
  const signalStrength = riskLevel === "Low" ? 5 : riskLevel === "Moderate" ? 3 : riskLevel === "High" ? 2 : 1;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Divergence Score", "pcd_divergence_score", divergenceScore, 
      divergenceScore < 20 ? "excellent" : divergenceScore < 40 ? "good" : divergenceScore < 60 ? "fair" : "poor",
      { format: "score", priority: 1 }),
    createMetric("Divergence %", "pcd_divergence_pct", currentDivergence.divergencePct, 
      Math.abs(currentDivergence.divergencePct) < 15 ? "excellent" : Math.abs(currentDivergence.divergencePct) < 30 ? "good" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Net Income", "pcd_net_income", currentDivergence.netIncome, "neutral", 
      { format: "currency", priority: 2, unit: "₹Cr" }),
    createMetric("Operating Cash Flow", "pcd_ocf", currentDivergence.operatingCashFlow, 
      currentDivergence.operatingCashFlow >= currentDivergence.netIncome ? "good" : "fair",
      { format: "currency", priority: 2, unit: "₹Cr" }),
    createMetric("Receivables Change", "pcd_receivables", drivers.receivablesChange, 
      drivers.receivablesChange < 5 ? "good" : drivers.receivablesChange < 15 ? "fair" : "poor",
      { format: "percent", priority: 3 }),
    createMetric("Inventory Change", "pcd_inventory", drivers.inventoryChange, 
      drivers.inventoryChange < 5 ? "good" : drivers.inventoryChange < 15 ? "fair" : "poor",
      { format: "percent", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Main divergence insight
  if (currentDivergence.operatingCashFlow >= currentDivergence.netIncome) {
    insights.push(createInsight("strength", `OCF exceeds net income by ${Math.abs(currentDivergence.divergencePct).toFixed(0)}% - high quality earnings`, 1, ["pcd_divergence_pct", "pcd_ocf"]));
  } else if (Math.abs(currentDivergence.divergencePct) > 40) {
    insights.push(createInsight("weakness", `Significant profit-cash divergence of ${Math.abs(currentDivergence.divergencePct).toFixed(0)}% - investigate accruals`, 1, ["pcd_divergence_pct"]));
  } else if (Math.abs(currentDivergence.divergencePct) > 20) {
    insights.push(createInsight("observation", `Moderate divergence of ${Math.abs(currentDivergence.divergencePct).toFixed(0)}% - monitor working capital`, 1, ["pcd_divergence_pct"]));
  }
  
  // Working capital drivers
  if (drivers.receivablesChange > 20) {
    insights.push(createInsight("risk", `Receivables up ${drivers.receivablesChange.toFixed(0)}% - potential collection issues or aggressive revenue recognition`, 2, ["pcd_receivables"]));
  }
  if (drivers.inventoryChange > 20) {
    insights.push(createInsight("risk", `Inventory up ${drivers.inventoryChange.toFixed(0)}% - demand slowdown or obsolescence risk`, 2, ["pcd_inventory"]));
  }
  
  // Red flags
  const criticalFlags = redFlags.filter(f => f.severity === "critical");
  if (criticalFlags.length > 0) {
    insights.push(createInsight("risk", `Critical: ${criticalFlags[0].flag}`, 1));
  }
  redFlags.filter(f => f.severity === "warning").slice(0, 2).forEach(flag => {
    insights.push(createInsight("risk", flag.flag, 2));
  });
  
  // Risk level summary
  if (riskLevel === "Low" && redFlags.length === 0) {
    insights.push(createInsight("strength", "No significant divergence concerns - earnings well-supported by cash", 2));
  }
  
  const headline = `${symbol} ${riskLevel.toLowerCase()} profit-cash divergence risk with ${currentDivergence.divergencePct > 0 ? "+" : ""}${currentDivergence.divergencePct.toFixed(0)}% gap`;
  
  return {
    cardId: "profit-vs-cash-divergence",
    cardCategory: "growth",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: redFlags.length === 0 ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: riskLevel === "Low" 
      ? ["earnings-quality", "fcf-health", "sales-profit-cash"]
      : ["earnings-quality", "working-capital-health", "financial-stress-radar"],
    tags: ["divergence", "cash-flow", "earnings-quality", riskLevel.toLowerCase() + "-risk"],
    scoreContribution: {
      category: "quality",
      score: 100 - divergenceScore, // Inverse: low divergence = high score
      weight: 0.15,
    },
  };
}

interface Props {
  data?: ProfitCashDivergenceData;
  isLoading?: boolean;
  error?: string | null;
}

export default function ProfitCashDivergenceCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['growth'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Profit vs Cash Divergence
            </CardTitle>
          <CardDescription>Analyzing divergence patterns…</CardDescription>
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
          <CardTitle>Profit vs Cash Divergence</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Profit vs Cash Divergence</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const metrics = [
    { label: "Net Income", value: `₹${data.currentDivergence.netIncome.toFixed(0)}Cr` },
    { label: "Operating CF", value: `₹${data.currentDivergence.operatingCashFlow.toFixed(0)}Cr` },
    { label: "Divergence", value: `${data.currentDivergence.divergencePct > 0 ? "+" : ""}${data.currentDivergence.divergencePct.toFixed(0)}%`, trend: Math.abs(data.currentDivergence.divergencePct) < 20 ? "up" as const : "down" as const },
    { label: "Risk Level", value: data.riskLevel },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Profit vs Cash Divergence
              <Badge variant={data.riskLevel === "Low" ? "success" : data.riskLevel === "Moderate" ? "secondary" : "destructive"}>
                {data.riskLevel} Risk
              </Badge>
            </CardTitle>
            <CardDescription>
              {data.symbol} • Earnings quality analysis • As of {data.asOf}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${Math.abs(data.currentDivergence.divergencePct) < 20 ? "text-emerald-400" : Math.abs(data.currentDivergence.divergencePct) < 40 ? "text-amber-400" : "text-red-400"}`}>
              {data.currentDivergence.divergencePct > 0 ? "+" : ""}{data.currentDivergence.divergencePct.toFixed(0)}%
            </div>
            <div className="text-[10px] text-slate-500">Divergence</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        {/* Divergence Chart */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Profit vs Cash Flow History</div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.historicalDivergence} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: number, name: string) => [name === "divergence" ? `${value.toFixed(0)}%` : `₹${value.toFixed(0)}Cr`, name === "profit" ? "Net Income" : name === "ocf" ? "OCF" : "Divergence"]}
                />
                <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />
                <Bar dataKey="profit" fill="#3b82f6" radius={[2, 2, 0, 0]} name="profit" />
                <Bar dataKey="ocf" fill="#10b981" radius={[2, 2, 0, 0]} name="ocf" />
                <Line type="monotone" dataKey="divergence" stroke="#f59e0b" strokeWidth={2} dot={false} name="divergence" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <span className="text-[10px] flex items-center gap-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Net Income
            </span>
            <span className="text-[10px] flex items-center gap-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> OCF
            </span>
            <span className="text-[10px] flex items-center gap-1 text-slate-400">
              <span className="w-2 h-0.5 bg-amber-500" /> Divergence
            </span>
          </div>
        </div>

        {/* Divergence Drivers */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Divergence Drivers (Change in Working Capital)</div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Receivables", value: data.drivers.receivablesChange, bad: data.drivers.receivablesChange > 0 },
              { label: "Inventory", value: data.drivers.inventoryChange, bad: data.drivers.inventoryChange > 0 },
              { label: "Payables", value: data.drivers.payablesChange, bad: data.drivers.payablesChange < 0 },
              { label: "Other", value: data.drivers.otherAccruals, bad: data.drivers.otherAccruals > 0 },
            ].map((driver) => (
              <div key={driver.label} className="rounded bg-slate-800/50 p-2 text-center">
                <div className={`text-sm font-semibold ${driver.value === 0 ? "text-slate-400" : driver.bad ? "text-red-400" : "text-emerald-400"}`}>
                  {driver.value > 0 ? "+" : ""}{driver.value.toFixed(0)}%
                </div>
                <div className="text-[9px] text-slate-500">{driver.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Red Flags */}
        {data.redFlags.length > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] uppercase text-slate-500">Red Flags</div>
            {data.redFlags.map((flag, i) => (
              <SignalBox
                key={i}
                signal={flag.severity === "critical" ? "bearish" : "caution"}
                title={flag.flag}
                description={flag.detail}
              />
            ))}
          </div>
        )}

        <InterpretationFooter variant={data.riskLevel === "Low" ? "success" : data.riskLevel === "Moderate" ? "info" : "warning"}>
          {data.currentDivergence.operatingCashFlow >= data.currentDivergence.netIncome 
            ? `Cash flow exceeds reported profits by ${Math.abs(data.currentDivergence.divergencePct).toFixed(0)}%, indicating high earnings quality. `
            : `Profits exceed cash flow by ${Math.abs(data.currentDivergence.divergencePct).toFixed(0)}%, which may indicate accrual-based income or working capital buildup. `
          }
          {data.redFlags.length > 0 ? `${data.redFlags.length} warning flag(s) detected—investigate working capital trends.` : "No significant divergence concerns identified."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
