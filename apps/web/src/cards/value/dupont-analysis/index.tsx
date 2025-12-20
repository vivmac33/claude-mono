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
import { TrendIndicator, Sparkline } from "@/components/shared/TrendIndicator";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface DuPontAnalysisData {
  symbol: string;
  asOf: string;
  roe: number;
  roePrevious: number;
  decomposition: {
    netProfitMargin: number;
    assetTurnover: number;
    equityMultiplier: number;
  };
  decompositionPrevious: {
    netProfitMargin: number;
    assetTurnover: number;
    equityMultiplier: number;
  };
  historicalTrend: Array<{
    period: string;
    roe: number;
    margin: number;
    turnover: number;
    leverage: number;
  }>;
  peerComparison: {
    avgROE: number;
    avgMargin: number;
    avgTurnover: number;
    avgLeverage: number;
  };
  primaryDriver: "Margin" | "Turnover" | "Leverage";
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getDuPontAnalysisOutput(data: DuPontAnalysisData): CardOutput {
  const { symbol, asOf, roe, roePrevious, decomposition, decompositionPrevious, peerComparison, primaryDriver } = data;
  
  const roeChange = roe - roePrevious;
  const marginChange = decomposition.netProfitMargin - decompositionPrevious.netProfitMargin;
  const turnoverChange = decomposition.assetTurnover - decompositionPrevious.assetTurnover;
  const leverageChange = decomposition.equityMultiplier - decompositionPrevious.equityMultiplier;
  
  // ROE quality assessment
  const sentiment = roe > 15 && roeChange >= 0 ? "bullish" : roe < 10 || roeChange < -2 ? "bearish" : "neutral";
  const signalStrength = roe > 20 ? 5 : roe > 15 ? 4 : roe > 10 ? 3 : roe > 5 ? 2 : 1;
  
  const keyMetrics: MetricValue[] = [
    createMetric("ROE", "dupont_roe", roe, 
      roe > 20 ? "excellent" : roe > 15 ? "good" : roe > 10 ? "fair" : "poor",
      { format: "percent", priority: 1, trend: { direction: roeChange > 0 ? "up" : roeChange < 0 ? "down" : "flat", period: "YoY", change: roeChange } }),
    createMetric("Net Profit Margin", "dupont_margin", decomposition.netProfitMargin, 
      decomposition.netProfitMargin > peerComparison.avgMargin ? "good" : "fair",
      { format: "percent", priority: 1, benchmark: { value: peerComparison.avgMargin, label: "Peer Avg", comparison: decomposition.netProfitMargin > peerComparison.avgMargin ? "above" : "below" } }),
    createMetric("Asset Turnover", "dupont_turnover", decomposition.assetTurnover, 
      decomposition.assetTurnover > peerComparison.avgTurnover ? "good" : "fair",
      { format: "ratio", priority: 1, unit: "x", benchmark: { value: peerComparison.avgTurnover, label: "Peer Avg", comparison: decomposition.assetTurnover > peerComparison.avgTurnover ? "above" : "below" } }),
    createMetric("Equity Multiplier", "dupont_leverage", decomposition.equityMultiplier, 
      decomposition.equityMultiplier > 3 ? "risky" : decomposition.equityMultiplier > 2 ? "moderate" : "safe",
      { format: "ratio", priority: 2, unit: "x" }),
    createMetric("Peer ROE", "dupont_peer_roe", peerComparison.avgROE, "neutral", 
      { format: "percent", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // ROE quality
  if (roe > 15 && roe > peerComparison.avgROE) {
    insights.push(createInsight("strength", `Strong ROE of ${roe.toFixed(1)}% exceeds peer average of ${peerComparison.avgROE.toFixed(1)}%`, 1, ["dupont_roe", "dupont_peer_roe"]));
  } else if (roe < peerComparison.avgROE) {
    insights.push(createInsight("weakness", `ROE of ${roe.toFixed(1)}% lags peer average of ${peerComparison.avgROE.toFixed(1)}%`, 1, ["dupont_roe", "dupont_peer_roe"]));
  }
  
  // Primary driver insight
  insights.push(createInsight("observation", `ROE primarily driven by ${primaryDriver.toLowerCase()} - ${
    primaryDriver === "Margin" ? "focus on pricing power and cost control" :
    primaryDriver === "Turnover" ? "asset efficiency is the key competitive advantage" :
    "leverage amplifies returns but increases risk"
  }`, 2, [primaryDriver === "Margin" ? "dupont_margin" : primaryDriver === "Turnover" ? "dupont_turnover" : "dupont_leverage"]));
  
  // Trend insights
  if (roeChange > 2) {
    insights.push(createInsight("strength", `ROE improving: +${roeChange.toFixed(1)}pp YoY driven by ${marginChange > turnoverChange ? "margin expansion" : "efficiency gains"}`, 2, ["dupont_roe"]));
  } else if (roeChange < -2) {
    insights.push(createInsight("weakness", `ROE declining: ${roeChange.toFixed(1)}pp YoY - investigate ${marginChange < 0 ? "margin compression" : "efficiency deterioration"}`, 2, ["dupont_roe"]));
  }
  
  // Leverage warning
  if (decomposition.equityMultiplier > 3) {
    insights.push(createInsight("risk", `High financial leverage (${decomposition.equityMultiplier.toFixed(1)}x) - ROE quality may be lower than headline suggests`, 2, ["dupont_leverage"]));
  }
  
  const headline = `${symbol} ROE at ${roe.toFixed(1)}% is ${primaryDriver.toLowerCase()}-driven, ${roe > peerComparison.avgROE ? "above" : "below"} peer average`;
  
  return {
    cardId: "dupont-analysis",
    cardCategory: "value",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: primaryDriver === "Leverage" 
      ? ["leverage-history", "financial-stress-radar", "risk-health-dashboard"]
      : ["efficiency-dashboard", "growth-summary", "piotroski-score"],
    tags: ["dupont", "roe", "profitability", primaryDriver.toLowerCase()],
    scoreContribution: {
      category: "quality",
      score: Math.min(100, roe * 4),
      weight: 0.15,
    },
  };
}

interface Props {
  data?: DuPontAnalysisData;
  isLoading?: boolean;
  error?: string | null;
}

export default function DuPontAnalysisCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['value'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              DuPont Analysis
            </CardTitle>
          <CardDescription>Decomposing ROE drivers…</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full mb-3" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>DuPont Analysis</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>DuPont Analysis</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const {
    symbol,
    asOf,
    roe,
    roePrevious,
    decomposition,
    decompositionPrevious,
    historicalTrend,
    peerComparison,
    primaryDriver,
  } = data;

  const roeChange = roe - roePrevious;
  const marginChange = decomposition.netProfitMargin - decompositionPrevious.netProfitMargin;
  const turnoverChange = decomposition.assetTurnover - decompositionPrevious.assetTurnover;
  const leverageChange = decomposition.equityMultiplier - decompositionPrevious.equityMultiplier;

  const metrics = [
    { label: "ROE", value: `${roe.toFixed(1)}%`, subValue: `${roeChange > 0 ? "+" : ""}${roeChange.toFixed(1)}%`, trend: roeChange > 0 ? "up" as const : roeChange < 0 ? "down" as const : "neutral" as const },
    { label: "Net Margin", value: `${decomposition.netProfitMargin.toFixed(1)}%`, subValue: `Peer: ${peerComparison.avgMargin.toFixed(1)}%` },
    { label: "Asset Turnover", value: `${decomposition.assetTurnover.toFixed(2)}x`, subValue: `Peer: ${peerComparison.avgTurnover.toFixed(2)}x` },
    { label: "Equity Mult.", value: `${decomposition.equityMultiplier.toFixed(2)}x`, subValue: `Peer: ${peerComparison.avgLeverage.toFixed(2)}x` },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              DuPont Analysis
              <Badge variant="secondary">{primaryDriver}-Driven</Badge>
            </CardTitle>
            <CardDescription>
              {symbol} • ROE decomposition • As of {asOf}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-100">{roe.toFixed(1)}%</div>
            <TrendIndicator value={roeChange} format="percent" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        {/* DuPont Formula Visual */}
        <div className="bg-slate-800/30 rounded-lg p-3">
          <div className="text-[10px] uppercase text-slate-500 mb-2">ROE = Margin × Turnover × Leverage</div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="bg-blue-900/40 rounded px-3 py-2 text-center">
              <div className="text-lg font-bold text-blue-300">{roe.toFixed(1)}%</div>
              <div className="text-[9px] text-slate-500">ROE</div>
            </div>
            <span className="text-slate-500">=</span>
            <div className={`rounded px-3 py-2 text-center ${marginChange > 0 ? "bg-emerald-900/40" : marginChange < 0 ? "bg-red-900/40" : "bg-slate-800/40"}`}>
              <div className="text-lg font-bold text-slate-200">{decomposition.netProfitMargin.toFixed(1)}%</div>
              <div className="text-[9px] text-slate-500">Margin</div>
            </div>
            <span className="text-slate-500">×</span>
            <div className={`rounded px-3 py-2 text-center ${turnoverChange > 0 ? "bg-emerald-900/40" : turnoverChange < 0 ? "bg-red-900/40" : "bg-slate-800/40"}`}>
              <div className="text-lg font-bold text-slate-200">{decomposition.assetTurnover.toFixed(2)}x</div>
              <div className="text-[9px] text-slate-500">Turnover</div>
            </div>
            <span className="text-slate-500">×</span>
            <div className={`rounded px-3 py-2 text-center ${leverageChange > 0 ? "bg-amber-900/40" : leverageChange < 0 ? "bg-emerald-900/40" : "bg-slate-800/40"}`}>
              <div className="text-lg font-bold text-slate-200">{decomposition.equityMultiplier.toFixed(2)}x</div>
              <div className="text-[9px] text-slate-500">Leverage</div>
            </div>
          </div>
        </div>

        {/* Historical Trend Chart */}
        <div className="h-40">
          <div className="text-[10px] uppercase text-slate-500 mb-1">Historical ROE Components</div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalTrend}>
              <XAxis
                dataKey="period"
                tick={{ fill: "#64748b", fontSize: 9 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 9 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Line type="monotone" dataKey="roe" name="ROE %" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="margin" name="Margin %" stroke="#10b981" strokeWidth={1.5} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="turnover" name="Turnover x" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <InterpretationFooter variant={roeChange > 0 ? "success" : roeChange < 0 ? "warning" : "neutral"}>
          {symbol}'s ROE is primarily driven by {primaryDriver.toLowerCase()}.
          {primaryDriver === "Margin"
            ? " Focus on pricing power and cost efficiency for ROE sustainability."
            : primaryDriver === "Turnover"
            ? " Asset efficiency is key; monitor inventory and receivable cycles."
            : " Elevated leverage amplifies returns but increases financial risk."}
          vs peers: margin is {decomposition.netProfitMargin > peerComparison.avgMargin ? "above" : "below"} average.
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
