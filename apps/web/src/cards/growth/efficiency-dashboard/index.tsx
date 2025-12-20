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
import { ScoreGauge } from "@/components/shared/ScoreGauge";
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

export interface EfficiencyDashboardData {
  symbol: string;
  asOf: string;
  overallScore: number;
  grade: string;
  margins: {
    gross: number;
    operating: number;
    net: number;
    ebitda: number;
  };
  marginTrends: Array<{
    period: string;
    gross: number;
    operating: number;
    net: number;
  }>;
  efficiencyRatios: {
    assetTurnover: number;
    inventoryTurnover: number;
    receivablesTurnover: number;
    payablesTurnover: number;
  };
  workingCapitalDays: {
    dso: number;
    dio: number;
    dpo: number;
    ccc: number;
  };
  peerComparison: {
    operatingMargin: { company: number; peer: number };
    assetTurnover: { company: number; peer: number };
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getEfficiencyDashboardOutput(data: EfficiencyDashboardData): CardOutput {
  const { symbol, asOf, overallScore, grade, margins, efficiencyRatios, workingCapitalDays, peerComparison } = data;
  
  const sentiment = grade === "A" || grade === "B" ? "bullish" : grade === "D" || grade === "F" ? "bearish" : "neutral";
  const signalStrength = overallScore > 80 ? 5 : overallScore > 60 ? 4 : overallScore > 40 ? 3 : overallScore > 20 ? 2 : 1;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Efficiency Score", "ed_score", overallScore, 
      overallScore > 75 ? "excellent" : overallScore > 50 ? "good" : overallScore > 30 ? "fair" : "poor",
      { format: "score", priority: 1 }),
    createMetric("Operating Margin", "ed_opm", margins.operating, 
      margins.operating > 20 ? "excellent" : margins.operating > 12 ? "good" : margins.operating > 5 ? "fair" : "poor",
      { format: "percent", priority: 1, benchmark: { value: peerComparison.operatingMargin.peer, label: "Peer", comparison: margins.operating > peerComparison.operatingMargin.peer ? "above" : "below" } }),
    createMetric("Gross Margin", "ed_gross_margin", margins.gross, 
      margins.gross > 40 ? "excellent" : margins.gross > 25 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Net Margin", "ed_net_margin", margins.net, 
      margins.net > 15 ? "excellent" : margins.net > 8 ? "good" : margins.net > 3 ? "fair" : "poor",
      { format: "percent", priority: 2 }),
    createMetric("Asset Turnover", "ed_asset_turnover", efficiencyRatios.assetTurnover, 
      efficiencyRatios.assetTurnover > 1.5 ? "excellent" : efficiencyRatios.assetTurnover > 0.8 ? "good" : "fair",
      { format: "ratio", priority: 1, unit: "x", benchmark: { value: peerComparison.assetTurnover.peer, label: "Peer", comparison: efficiencyRatios.assetTurnover > peerComparison.assetTurnover.peer ? "above" : "below" } }),
    createMetric("Cash Conversion Cycle", "ed_ccc", workingCapitalDays.ccc, 
      workingCapitalDays.ccc < 30 ? "excellent" : workingCapitalDays.ccc < 60 ? "good" : workingCapitalDays.ccc < 90 ? "fair" : "poor",
      { format: "number", priority: 2, unit: "days" }),
    createMetric("Inventory Turnover", "ed_inventory_turnover", efficiencyRatios.inventoryTurnover, 
      efficiencyRatios.inventoryTurnover > 8 ? "excellent" : efficiencyRatios.inventoryTurnover > 5 ? "good" : "fair",
      { format: "ratio", priority: 3, unit: "x" }),
  ];
  
  const insights: Insight[] = [];
  
  // Overall efficiency
  if (grade === "A" || grade === "B") {
    insights.push(createInsight("strength", `Grade ${grade} operational efficiency (${overallScore}/100) - well-run operations`, 1, ["ed_score"]));
  } else if (grade === "D" || grade === "F") {
    insights.push(createInsight("weakness", `Grade ${grade} operational efficiency (${overallScore}/100) - significant room for improvement`, 1, ["ed_score"]));
  }
  
  // Margin vs peers
  if (margins.operating > peerComparison.operatingMargin.peer * 1.2) {
    insights.push(createInsight("strength", `Operating margin ${margins.operating.toFixed(1)}% significantly above peer avg ${peerComparison.operatingMargin.peer.toFixed(1)}%`, 2, ["ed_opm"]));
  } else if (margins.operating < peerComparison.operatingMargin.peer * 0.8) {
    insights.push(createInsight("weakness", `Operating margin ${margins.operating.toFixed(1)}% below peer avg ${peerComparison.operatingMargin.peer.toFixed(1)}%`, 2, ["ed_opm"]));
  }
  
  // Cash cycle insight
  if (workingCapitalDays.ccc < 30) {
    insights.push(createInsight("strength", `Excellent cash cycle of ${workingCapitalDays.ccc} days - minimal working capital needs`, 2, ["ed_ccc"]));
  } else if (workingCapitalDays.ccc > 90) {
    insights.push(createInsight("weakness", `Long cash cycle of ${workingCapitalDays.ccc} days - working capital optimization needed`, 2, ["ed_ccc"]));
  }
  
  // Asset efficiency
  if (efficiencyRatios.assetTurnover > peerComparison.assetTurnover.peer) {
    insights.push(createInsight("strength", `Superior asset utilization (${efficiencyRatios.assetTurnover.toFixed(2)}x vs peer ${peerComparison.assetTurnover.peer.toFixed(2)}x)`, 3, ["ed_asset_turnover"]));
  }
  
  const headline = `${symbol} efficiency Grade ${grade} with ${margins.operating.toFixed(1)}% OPM and ${workingCapitalDays.ccc}-day cash cycle`;
  
  return {
    cardId: "efficiency-dashboard",
    cardCategory: "growth",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: overallScore >= 60 
      ? ["dupont-analysis", "capital-allocation", "growth-summary"]
      : ["working-capital-health", "cash-conversion-cycle", "risk-health-dashboard"],
    tags: ["efficiency", "margins", "operations", `grade-${grade.toLowerCase()}`],
    scoreContribution: {
      category: "quality",
      score: overallScore,
      weight: 0.15,
    },
  };
}

interface Props {
  data?: EfficiencyDashboardData;
  isLoading?: boolean;
  error?: string | null;
}

export default function EfficiencyDashboardCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['growth'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Efficiency Dashboard
            </CardTitle>
          <CardDescription>Analyzing operating efficiency…</CardDescription>
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
          <CardTitle>Efficiency Dashboard</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Efficiency Dashboard</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const marginChartData = [
    { name: "Gross", value: data.margins.gross, fill: "#3b82f6" },
    { name: "EBITDA", value: data.margins.ebitda, fill: "#8b5cf6" },
    { name: "Operating", value: data.margins.operating, fill: "#10b981" },
    { name: "Net", value: data.margins.net, fill: "#f59e0b" },
  ];

  const metrics = [
    { label: "Asset Turnover", value: `${data.efficiencyRatios.assetTurnover.toFixed(2)}x` },
    { label: "Inventory Turn", value: `${data.efficiencyRatios.inventoryTurnover.toFixed(1)}x` },
    { label: "DSO", value: `${data.workingCapitalDays.dso} days` },
    { label: "Cash Cycle", value: `${data.workingCapitalDays.ccc} days`, trend: data.workingCapitalDays.ccc < 60 ? "up" as const : "down" as const },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Efficiency Dashboard
              <Badge variant={data.grade === "A" || data.grade === "B" ? "success" : data.grade === "C" ? "secondary" : "destructive"}>
                Grade {data.grade}
              </Badge>
            </CardTitle>
            <CardDescription>
              {data.symbol} • Operating efficiency metrics • As of {data.asOf}
            </CardDescription>
          </div>
          <ScoreGauge value={data.overallScore} max={100} label="Score" size={70} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        {/* Margin Waterfall */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Margin Structure</div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marginChartData} layout="vertical" margin={{ left: 60, right: 20 }}>
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, "Margin"]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {marginChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Working Capital Cycle */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-[9px] uppercase text-slate-500 col-span-4 mb-1">Working Capital Cycle</div>
          {[
            { label: "DSO", value: data.workingCapitalDays.dso, desc: "Receivables" },
            { label: "DIO", value: data.workingCapitalDays.dio, desc: "Inventory" },
            { label: "DPO", value: data.workingCapitalDays.dpo, desc: "Payables" },
            { label: "CCC", value: data.workingCapitalDays.ccc, desc: "Cash Cycle" },
          ].map((item) => (
            <div key={item.label} className="rounded bg-slate-800/50 p-2 text-center">
              <div className="text-xs font-semibold text-slate-200">{item.value}d</div>
              <div className="text-[9px] text-slate-500">{item.desc}</div>
            </div>
          ))}
        </div>

        <InterpretationFooter variant={data.overallScore >= 70 ? "success" : data.overallScore >= 50 ? "info" : "warning"}>
          Operating margin of {data.margins.operating.toFixed(1)}% and asset turnover of {data.efficiencyRatios.assetTurnover.toFixed(2)}x 
          indicates {data.overallScore >= 70 ? "strong operational efficiency" : data.overallScore >= 50 ? "moderate efficiency with room for improvement" : "efficiency challenges that may impact profitability"}.
          Cash conversion cycle of {data.workingCapitalDays.ccc} days {data.workingCapitalDays.ccc < 60 ? "supports healthy cash flow" : "suggests working capital optimization opportunities"}.
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
