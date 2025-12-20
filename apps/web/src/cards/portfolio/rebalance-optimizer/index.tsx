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
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts";

export interface RebalanceOptimizerData {
  portfolioId: string;
  asOf: string;
  totalValue: number;
  currentAllocation: Array<{
    symbol: string;
    name: string;
    currentWeight: number;
    targetWeight: number;
    drift: number;
    action: "Buy" | "Sell" | "Hold";
    shares: number;
    value: number;
  }>;
  metricsBefore: {
    expectedReturn: number;
    volatility: number;
    sharpe: number;
    maxDrawdown: number;
  };
  metricsAfter: {
    expectedReturn: number;
    volatility: number;
    sharpe: number;
    maxDrawdown: number;
  };
  rebalanceTrades: Array<{
    symbol: string;
    action: "Buy" | "Sell";
    shares: number;
    value: number;
  }>;
  taxImpact: number;
  urgency: "Low" | "Medium" | "High";
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export function getRebalanceOptimizerOutput(data: RebalanceOptimizerData): CardOutput {
  const { asOf, totalValue, currentAllocation, metricsBefore, metricsAfter, rebalanceTrades, taxImpact, urgency } = data;
  
  const buyTrades = rebalanceTrades.filter(t => t.action === "Buy");
  const sellTrades = rebalanceTrades.filter(t => t.action === "Sell");
  const totalTradeValue = rebalanceTrades.reduce((sum, t) => sum + Math.abs(t.value), 0);
  const sharpeImprovement = metricsAfter.sharpe - metricsBefore.sharpe;
  const maxDrift = Math.max(...currentAllocation.map(a => Math.abs(a.drift)));
  
  const sentiment = urgency === "High" ? "bearish" : sharpeImprovement > 0.1 ? "bullish" : "neutral";
  const signalStrength = urgency === "High" ? 5 : urgency === "Medium" ? 4 : 3;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Portfolio Value", "ro_value", totalValue, "neutral", 
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("Sharpe Before", "ro_sharpe_before", metricsBefore.sharpe, 
      metricsBefore.sharpe > 1 ? "good" : "fair",
      { format: "ratio", priority: 2 }),
    createMetric("Sharpe After", "ro_sharpe_after", metricsAfter.sharpe, 
      metricsAfter.sharpe > 1.2 ? "excellent" : metricsAfter.sharpe > 1 ? "good" : "fair",
      { format: "ratio", priority: 1 }),
    createMetric("Sharpe Improvement", "ro_sharpe_delta", sharpeImprovement, 
      sharpeImprovement > 0.1 ? "excellent" : sharpeImprovement > 0 ? "good" : "fair",
      { format: "number", priority: 1 }),
    createMetric("Max Drift", "ro_drift", maxDrift, 
      maxDrift < 5 ? "safe" : maxDrift < 10 ? "moderate" : "risky",
      { format: "percent", priority: 1 }),
    createMetric("Trade Value", "ro_trade_val", totalTradeValue, "neutral", 
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("Buy Trades", "ro_buys", buyTrades.length, "neutral", 
      { format: "number", priority: 2 }),
    createMetric("Sell Trades", "ro_sells", sellTrades.length, "neutral", 
      { format: "number", priority: 2 }),
    createMetric("Tax Impact", "ro_tax", taxImpact, 
      taxImpact < 1000 ? "safe" : "moderate",
      { format: "currency", priority: 3, unit: "₹" }),
  ];
  
  const insights: Insight[] = [];
  
  // Urgency
  if (urgency === "High") {
    insights.push(createInsight("action", `High urgency rebalance needed - max drift ${maxDrift.toFixed(1)}%`, 1, ["ro_drift"]));
  } else if (urgency === "Medium") {
    insights.push(createInsight("observation", `Medium urgency - consider rebalancing soon`, 2, ["ro_drift"]));
  }
  
  // Sharpe improvement
  if (sharpeImprovement > 0.1) {
    insights.push(createInsight("strength", `Rebalance improves Sharpe ratio by ${sharpeImprovement.toFixed(2)} (${metricsBefore.sharpe.toFixed(2)} → ${metricsAfter.sharpe.toFixed(2)})`, 1, ["ro_sharpe_delta"]));
  }
  
  // Trade summary
  if (rebalanceTrades.length > 0) {
    insights.push(createInsight("action", `${rebalanceTrades.length} trades recommended: ${buyTrades.length} buys, ${sellTrades.length} sells (₹${(totalTradeValue/1000).toFixed(0)}K value)`, 2, ["ro_buys", "ro_sells"]));
  }
  
  // Tax impact
  if (taxImpact > 5000) {
    insights.push(createInsight("observation", `Tax impact: ₹${taxImpact.toFixed(0)} - consider tax-loss harvesting`, 3, ["ro_tax"]));
  }
  
  const headline = `Rebalance ${urgency.toLowerCase()} urgency: ${rebalanceTrades.length} trades, Sharpe ${metricsBefore.sharpe.toFixed(2)} → ${metricsAfter.sharpe.toFixed(2)}`;
  
  return {
    cardId: "rebalance-optimizer",
    cardCategory: "portfolio",
    symbol: "PORTFOLIO",
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["portfolio-correlation", "portfolio-leaderboard", "risk-health-dashboard"],
    tags: ["rebalance", urgency.toLowerCase(), sharpeImprovement > 0 ? "improving" : "maintaining"],
    scoreContribution: {
      category: "risk",
      score: urgency === "Low" ? 80 : urgency === "Medium" ? 50 : 30,
      weight: 0.10,
    },
  };
}

interface Props {
  data?: RebalanceOptimizerData;
  isLoading?: boolean;
  error?: string | null;
}

export default function RebalanceOptimizerCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['portfolio'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Rebalance Optimizer
            </CardTitle>
          <CardDescription>Optimizing allocations…</CardDescription>
        </CardHeader>
        <CardContent><Skeleton className="h-48 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Rebalance Optimizer</CardTitle>
          <CardDescription className={error ? "text-red-400" : ""}>{error || "No data"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const {
    portfolioId, asOf, totalValue, currentAllocation, metricsBefore, metricsAfter,
    rebalanceTrades, taxImpact, urgency
  } = data;

  const urgencyColors = {
    Low: "secondary" as const,
    Medium: "warning" as const,
    High: "destructive" as const,
  };

  const metrics = [
    { label: "Portfolio Value", value: `₹${(totalValue / 100000).toFixed(1)}L` },
    { label: "Sharpe Before", value: (metricsBefore?.sharpe ?? 0).toFixed(2) },
    { label: "Sharpe After", value: (metricsAfter?.sharpe ?? 0).toFixed(2), trend: (metricsAfter?.sharpe ?? 0) > (metricsBefore?.sharpe ?? 0) ? "up" as const : "down" as const },
    { label: "Vol Before", value: `${(metricsBefore?.volatility ?? 0).toFixed(1)}%` },
    { label: "Vol After", value: `${(metricsAfter?.volatility ?? 0).toFixed(1)}%`, trend: (metricsAfter?.volatility ?? 0) < (metricsBefore?.volatility ?? 0) ? "up" as const : "down" as const },
    { label: "Tax Impact", value: `₹${(taxImpact ?? 0).toFixed(0)}` },
  ];

  const driftData = currentAllocation.map(a => ({
    symbol: a.symbol,
    drift: a.drift,
    current: a.currentWeight,
    target: a.targetWeight,
  }));

  const pieData = currentAllocation.map(a => ({
    name: a.symbol,
    value: a.currentWeight,
  }));

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#a855f7", "#06b6d4", "#ec4899", "#84cc16"];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Rebalance Optimizer
              <Badge variant={urgencyColors[urgency]}>{urgency} Urgency</Badge>
            </CardTitle>
            <CardDescription>{portfolioId} • Allocation optimization • As of {asOf}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-slate-100">{rebalanceTrades.length}</div>
            <div className="text-xs text-slate-400">Trades Needed</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={6} />

        <div className="grid grid-cols-2 gap-4">
          {/* Drift Chart */}
          <div className="h-44">
            <div className="text-[10px] uppercase text-slate-500 mb-1">Weight Drift from Target</div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driftData} layout="vertical">
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={{ stroke: "#334155" }} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="symbol" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={{ stroke: "#334155" }} tickLine={false} width={40} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, "Drift"]}
                />
                <Bar dataKey="drift" radius={[0, 4, 4, 0]}>
                  {driftData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.drift > 0 ? "#10b981" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Allocation Pie */}
          <div className="h-44">
            <div className="text-[10px] uppercase text-slate-500 mb-1">Current Allocation</div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value.toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, "Weight"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommended Trades */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Recommended Trades</div>
          <div className="grid grid-cols-2 gap-2">
            {rebalanceTrades.slice(0, 6).map((trade, i) => (
              <div key={i} className={`flex justify-between items-center px-2 py-1.5 rounded text-xs ${
                trade.action === "Buy" ? "bg-emerald-900/30 border border-emerald-700/50" : "bg-red-900/30 border border-red-700/50"
              }`}>
                <div className="flex items-center gap-2">
                  <span className={trade.action === "Buy" ? "text-emerald-400" : "text-red-400"}>{trade.action}</span>
                  <span className="text-slate-200">{trade.symbol}</span>
                </div>
                <div className="text-slate-400">
                  {trade.shares} sh · ₹{trade.value.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Before/After Comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/30 rounded-lg p-2">
            <div className="text-[9px] uppercase text-slate-500 mb-1">Before Rebalance</div>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <div>E[R]: {metricsBefore.expectedReturn.toFixed(1)}%</div>
              <div>Vol: {metricsBefore.volatility.toFixed(1)}%</div>
              <div>Sharpe: {metricsBefore.sharpe.toFixed(2)}</div>
              <div>MaxDD: {metricsBefore.maxDrawdown.toFixed(1)}%</div>
            </div>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-2 border border-blue-700/50">
            <div className="text-[9px] uppercase text-slate-500 mb-1">After Rebalance</div>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <div>E[R]: {metricsAfter.expectedReturn.toFixed(1)}%</div>
              <div>Vol: {metricsAfter.volatility.toFixed(1)}%</div>
              <div>Sharpe: {metricsAfter.sharpe.toFixed(2)}</div>
              <div>MaxDD: {metricsAfter.maxDrawdown.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <InterpretationFooter variant={(urgency ?? 'Medium') === "Low" ? "success" : (urgency ?? 'Medium') === "High" ? "warning" : "neutral"}>
          Rebalancing improves Sharpe from {(metricsBefore?.sharpe ?? 0).toFixed(2)} to {(metricsAfter?.sharpe ?? 0).toFixed(2)}.
          Estimated tax impact: ₹{(taxImpact ?? 0).toFixed(0)}.
          {(urgency ?? 'Medium') === "High" ? " Significant drift detected; rebalance recommended." : " Portfolio within acceptable drift tolerance."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
