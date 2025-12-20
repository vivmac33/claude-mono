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

export interface CashConversionCycleData {
  symbol: string;
  asOf: string;
  efficiency: "Excellent" | "Good" | "Average" | "Poor";
  current: {
    dso: number;
    dio: number;
    dpo: number;
    ccc: number;
  };
  historical: Array<{
    period: string;
    dso: number;
    dio: number;
    dpo: number;
    ccc: number;
  }>;
  peerComparison: {
    company: number;
    sectorAvg: number;
    sectorBest: number;
  };
  trend: {
    direction: "Improving" | "Stable" | "Worsening";
    changeYoY: number;
  };
  breakdown: {
    receivablesAmount: number;
    inventoryAmount: number;
    payablesAmount: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getCashConversionCycleOutput(data: CashConversionCycleData): CardOutput {
  const { symbol, asOf, efficiency, current, peerComparison, trend } = data;
  
  const sentiment = efficiency === "Excellent" || efficiency === "Good" ? "bullish" : efficiency === "Poor" ? "bearish" : "neutral";
  const signalStrength = efficiency === "Excellent" ? 5 : efficiency === "Good" ? 4 : efficiency === "Average" ? 3 : 2;
  
  const vsPeer = current.ccc - peerComparison.sectorAvg;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Cash Conversion Cycle", "ccc_days", current.ccc, 
      current.ccc < 30 ? "excellent" : current.ccc < 60 ? "good" : current.ccc < 90 ? "fair" : "poor",
      { format: "number", priority: 1, unit: "days" }),
    createMetric("Days Sales Outstanding", "ccc_dso", current.dso, 
      current.dso < 30 ? "excellent" : current.dso < 45 ? "good" : current.dso < 60 ? "fair" : "poor",
      { format: "number", priority: 1, unit: "days" }),
    createMetric("Days Inventory Outstanding", "ccc_dio", current.dio, 
      current.dio < 30 ? "excellent" : current.dio < 60 ? "good" : current.dio < 90 ? "fair" : "poor",
      { format: "number", priority: 1, unit: "days" }),
    createMetric("Days Payable Outstanding", "ccc_dpo", current.dpo, 
      current.dpo > 45 ? "excellent" : current.dpo > 30 ? "good" : "fair",
      { format: "number", priority: 2, unit: "days" }),
    createMetric("vs Sector Avg", "ccc_vs_sector", vsPeer, 
      vsPeer < -10 ? "excellent" : vsPeer < 10 ? "good" : "poor",
      { format: "number", priority: 2, unit: "days" }),
    createMetric("YoY Change", "ccc_yoy", trend.changeYoY, 
      trend.changeYoY < -5 ? "excellent" : trend.changeYoY < 5 ? "good" : "poor",
      { format: "number", priority: 2, unit: "days", trend: { direction: trend.changeYoY < 0 ? "down" : "up", period: "YoY" } }),
  ];
  
  const insights: Insight[] = [];
  
  // Efficiency assessment
  if (efficiency === "Excellent") {
    insights.push(createInsight("strength", `Excellent cash efficiency with ${current.ccc}-day cycle - cash tied up for minimal time`, 1, ["ccc_days"]));
  } else if (efficiency === "Poor") {
    insights.push(createInsight("weakness", `Poor cash efficiency with ${current.ccc}-day cycle - significant working capital tied up`, 1, ["ccc_days"]));
  }
  
  // Peer comparison
  if (vsPeer < -15) {
    insights.push(createInsight("strength", `${Math.abs(vsPeer).toFixed(0)} days faster than sector average - competitive advantage`, 2, ["ccc_vs_sector"]));
  } else if (vsPeer > 15) {
    insights.push(createInsight("weakness", `${vsPeer.toFixed(0)} days slower than sector - room for improvement`, 2, ["ccc_vs_sector"]));
  }
  
  // Trend
  if (trend.direction === "Improving") {
    insights.push(createInsight("strength", `CCC improving by ${Math.abs(trend.changeYoY).toFixed(0)} days YoY`, 2, ["ccc_yoy"]));
  } else if (trend.direction === "Worsening") {
    insights.push(createInsight("weakness", `CCC worsening by ${trend.changeYoY.toFixed(0)} days YoY - investigate causes`, 2, ["ccc_yoy"]));
  }
  
  // Component insights
  if (current.dso > 60) {
    insights.push(createInsight("action", `High DSO of ${current.dso} days - consider tightening collection policies`, 3, ["ccc_dso"]));
  }
  if (current.dio > 90) {
    insights.push(createInsight("action", `High DIO of ${current.dio} days - inventory management improvement needed`, 3, ["ccc_dio"]));
  }
  
  const headline = `${symbol} ${efficiency.toLowerCase()} cash cycle at ${current.ccc} days (DSO: ${current.dso}, DIO: ${current.dio}, DPO: ${current.dpo})`;
  
  return {
    cardId: "cash-conversion-cycle",
    cardCategory: "cashflow",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: efficiency === "Excellent" || efficiency === "Good"
      ? ["fcf-health", "efficiency-dashboard", "working-capital-health"]
      : ["working-capital-health", "financial-stress-radar", "profit-vs-cash-divergence"],
    tags: ["cash-cycle", "working-capital", efficiency.toLowerCase()],
    scoreContribution: {
      category: "quality",
      score: efficiency === "Excellent" ? 90 : efficiency === "Good" ? 70 : efficiency === "Average" ? 50 : 30,
      weight: 0.10,
    },
  };
}

interface Props {
  data?: CashConversionCycleData;
  isLoading?: boolean;
  error?: string | null;
}

export default function CashConversionCycleCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['cashflow'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Cash Conversion Cycle
            </CardTitle>
          <CardDescription>Analyzing working capital efficiency…</CardDescription>
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
          <CardTitle>Cash Conversion Cycle</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Cash Conversion Cycle</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const metrics = [
    { label: "DSO", value: `${data.current.dso} days` },
    { label: "DIO", value: `${data.current.dio} days` },
    { label: "DPO", value: `${data.current.dpo} days` },
    { label: "CCC", value: `${data.current.ccc} days`, trend: data.current.ccc < 60 ? "up" as const : "down" as const },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Cash Conversion Cycle
              <Badge variant={data.efficiency === "Excellent" || data.efficiency === "Good" ? "success" : data.efficiency === "Average" ? "secondary" : "destructive"}>
                {data.efficiency}
              </Badge>
            </CardTitle>
            <CardDescription>
              {data.symbol} • Working capital cycle • As of {data.asOf}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${data.current.ccc < 45 ? "text-emerald-400" : data.current.ccc < 90 ? "text-slate-100" : "text-amber-400"}`}>
              {data.current.ccc} days
            </div>
            <div className="text-[10px] text-slate-500">Cash Cycle</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        {/* CCC Formula Visual */}
        <div className="bg-slate-800/30 rounded-lg p-3">
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="text-center">
              <div className="text-blue-400 font-semibold">{data.current.dso}</div>
              <div className="text-[9px] text-slate-500">DSO</div>
            </div>
            <span className="text-slate-500">+</span>
            <div className="text-center">
              <div className="text-purple-400 font-semibold">{data.current.dio}</div>
              <div className="text-[9px] text-slate-500">DIO</div>
            </div>
            <span className="text-slate-500">−</span>
            <div className="text-center">
              <div className="text-emerald-400 font-semibold">{data.current.dpo}</div>
              <div className="text-[9px] text-slate-500">DPO</div>
            </div>
            <span className="text-slate-500">=</span>
            <div className="text-center">
              <div className={`font-bold ${data.current.ccc < 60 ? "text-emerald-400" : "text-amber-400"}`}>{data.current.ccc}</div>
              <div className="text-[9px] text-slate-500">CCC</div>
            </div>
          </div>
        </div>

        {/* Historical Trend */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">CCC Trend ({data.trend.direction})</div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.historical} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: number, name: string) => [`${value} days`, name.toUpperCase()]}
                />
                <ReferenceLine y={data.peerComparison.sectorAvg} stroke="#64748b" strokeDasharray="3 3" label={{ value: "Sector Avg", fill: "#64748b", fontSize: 9 }} />
                <Line type="monotone" dataKey="ccc" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Component Breakdown */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Working Capital Components</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded bg-blue-900/20 border border-blue-800/30">
              <span className="text-xs text-blue-400">Receivables (DSO)</span>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-200">₹{data.breakdown.receivablesAmount.toFixed(0)}Cr</span>
                <span className="text-[10px] text-slate-500 ml-2">{data.current.dso}d</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-purple-900/20 border border-purple-800/30">
              <span className="text-xs text-purple-400">Inventory (DIO)</span>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-200">₹{data.breakdown.inventoryAmount.toFixed(0)}Cr</span>
                <span className="text-[10px] text-slate-500 ml-2">{data.current.dio}d</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-emerald-900/20 border border-emerald-800/30">
              <span className="text-xs text-emerald-400">Payables (DPO)</span>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-200">₹{data.breakdown.payablesAmount.toFixed(0)}Cr</span>
                <span className="text-[10px] text-slate-500 ml-2">{data.current.dpo}d</span>
              </div>
            </div>
          </div>
        </div>

        {/* Peer Comparison */}
        <div className="flex items-center justify-between bg-slate-800/30 rounded p-2">
          <span className="text-[10px] text-slate-500">vs Sector</span>
          <div className="flex items-center gap-3">
            <span className="text-xs">
              <span className="text-slate-500">You:</span>{" "}
              <span className={data.peerComparison.company < data.peerComparison.sectorAvg ? "text-emerald-400" : "text-amber-400"}>
                {data.peerComparison.company}d
              </span>
            </span>
            <span className="text-xs text-slate-500">|</span>
            <span className="text-xs text-slate-500">Avg: {data.peerComparison.sectorAvg}d</span>
            <span className="text-xs text-slate-500">|</span>
            <span className="text-xs text-emerald-400">Best: {data.peerComparison.sectorBest}d</span>
          </div>
        </div>

        <InterpretationFooter variant={data.efficiency === "Excellent" || data.efficiency === "Good" ? "success" : data.efficiency === "Average" ? "info" : "warning"}>
          Cash conversion cycle of {data.current.ccc} days is {data.peerComparison.company < data.peerComparison.sectorAvg ? "better than" : "above"} sector average of {data.peerComparison.sectorAvg} days.
          {data.trend.direction === "Improving" 
            ? ` Improving trend (${data.trend.changeYoY > 0 ? "+" : ""}${data.trend.changeYoY} days YoY) indicates better working capital management.`
            : data.trend.direction === "Worsening"
            ? ` Worsening trend warrants attention to receivables collection and inventory management.`
            : " Stable cycle suggests consistent operational efficiency."
          }
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
