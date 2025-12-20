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
} from "recharts";

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface SalesProfitCashData {
  symbol: string;
  asOf: string;
  alignmentScore: number;
  verdict: "Strong" | "Moderate" | "Weak" | "Divergent";
  currentRatios: {
    profitToSales: number;
    cashToProfit: number;
    cashToSales: number;
  };
  historicalFlow: Array<{
    period: string;
    revenue: number;
    profit: number;
    ocf: number;
    fcf: number;
  }>;
  conversionQuality: {
    avgCashConversion: number;
    cashConversionTrend: "Improving" | "Stable" | "Declining";
    accrualRatio: number;
  };
  alerts: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getSalesProfitCashOutput(data: SalesProfitCashData): CardOutput {
  const { symbol, asOf, alignmentScore, verdict, currentRatios, conversionQuality, alerts } = data;
  
  const sentiment = verdict === "Strong" ? "bullish" : verdict === "Divergent" || verdict === "Weak" ? "bearish" : "neutral";
  const signalStrength = alignmentScore > 80 ? 5 : alignmentScore > 60 ? 4 : alignmentScore > 40 ? 3 : alignmentScore > 20 ? 2 : 1;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Alignment Score", "spc_alignment", alignmentScore, 
      alignmentScore > 75 ? "excellent" : alignmentScore > 50 ? "good" : alignmentScore > 30 ? "fair" : "poor",
      { format: "score", priority: 1 }),
    createMetric("Cash/Profit Ratio", "spc_cash_to_profit", currentRatios.cashToProfit, 
      currentRatios.cashToProfit >= 100 ? "excellent" : currentRatios.cashToProfit >= 80 ? "good" : currentRatios.cashToProfit >= 60 ? "fair" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Profit/Sales", "spc_profit_to_sales", currentRatios.profitToSales, 
      currentRatios.profitToSales > 15 ? "excellent" : currentRatios.profitToSales > 8 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Cash/Sales", "spc_cash_to_sales", currentRatios.cashToSales, 
      currentRatios.cashToSales > 12 ? "excellent" : currentRatios.cashToSales > 6 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Avg Cash Conversion", "spc_avg_conversion", conversionQuality.avgCashConversion, 
      conversionQuality.avgCashConversion >= 90 ? "excellent" : conversionQuality.avgCashConversion >= 70 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Accrual Ratio", "spc_accrual", conversionQuality.accrualRatio, 
      conversionQuality.accrualRatio < 5 ? "excellent" : conversionQuality.accrualRatio < 10 ? "good" : conversionQuality.accrualRatio < 20 ? "fair" : "poor",
      { format: "percent", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // Main alignment verdict
  if (verdict === "Strong") {
    insights.push(createInsight("strength", `Strong sales-profit-cash alignment (${alignmentScore}/100) - healthy earnings-to-cash conversion`, 1, ["spc_alignment", "spc_cash_to_profit"]));
  } else if (verdict === "Divergent") {
    insights.push(createInsight("weakness", `Divergent cash flows (${alignmentScore}/100) - profits not converting to cash`, 1, ["spc_alignment"]));
  } else if (verdict === "Weak") {
    insights.push(createInsight("weakness", `Weak alignment (${alignmentScore}/100) - investigate working capital and accruals`, 1, ["spc_alignment"]));
  }
  
  // Conversion quality
  if (conversionQuality.avgCashConversion >= 90) {
    insights.push(createInsight("strength", `Excellent cash conversion (${conversionQuality.avgCashConversion.toFixed(0)}%) - high-quality earnings`, 2, ["spc_avg_conversion"]));
  } else if (conversionQuality.avgCashConversion < 70) {
    insights.push(createInsight("weakness", `Low cash conversion (${conversionQuality.avgCashConversion.toFixed(0)}%) - earnings quality concern`, 2, ["spc_avg_conversion"]));
  }
  
  // Accrual concern
  if (conversionQuality.accrualRatio > 15) {
    insights.push(createInsight("risk", `High accrual ratio (${conversionQuality.accrualRatio.toFixed(1)}%) - aggressive accounting practices`, 2, ["spc_accrual"]));
  }
  
  // Conversion trend
  if (conversionQuality.cashConversionTrend === "Declining") {
    insights.push(createInsight("risk", "Declining cash conversion trend - monitor for deterioration", 2));
  } else if (conversionQuality.cashConversionTrend === "Improving") {
    insights.push(createInsight("opportunity", "Improving cash conversion trend - positive quality signal", 3));
  }
  
  // Alerts
  if (alerts.length > 0) {
    alerts.slice(0, 2).forEach(alert => {
      insights.push(createInsight("risk", alert, 2));
    });
  }
  
  const headline = `${symbol} ${verdict.toLowerCase()} sales-to-cash alignment with ${conversionQuality.avgCashConversion.toFixed(0)}% conversion`;
  
  return {
    cardId: "sales-profit-cash",
    cardCategory: "growth",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: conversionQuality.accrualRatio < 10 ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: verdict === "Strong" 
      ? ["fcf-health", "earnings-quality", "growth-summary"]
      : ["profit-vs-cash-divergence", "cash-conversion-earnings", "earnings-quality"],
    tags: ["cash-flow", "earnings-quality", verdict.toLowerCase()],
    scoreContribution: {
      category: "quality",
      score: alignmentScore,
      weight: 0.15,
    },
  };
}

interface Props {
  data?: SalesProfitCashData;
  isLoading?: boolean;
  error?: string | null;
}

export default function SalesProfitCashCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['growth'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Sales-Profit-Cash Alignment</CardTitle>
          <CardDescription>Analyzing flow conversion…</CardDescription>
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
          <CardTitle>Sales-Profit-Cash Alignment</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Sales-Profit-Cash Alignment</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const metrics = [
    { label: "Profit/Sales", value: `${data.currentRatios.profitToSales.toFixed(1)}%` },
    { label: "Cash/Profit", value: `${data.currentRatios.cashToProfit.toFixed(0)}%`, trend: data.currentRatios.cashToProfit >= 80 ? "up" as const : "down" as const },
    { label: "Cash/Sales", value: `${data.currentRatios.cashToSales.toFixed(1)}%` },
    { label: "Accrual Ratio", value: `${data.conversionQuality.accrualRatio.toFixed(1)}%`, trend: data.conversionQuality.accrualRatio < 10 ? "up" as const : "down" as const },
  ];

  // Normalize data for chart (convert to percentages of first period's revenue)
  const baseRevenue = data.historicalFlow[0]?.revenue || 1;
  const chartData = data.historicalFlow.map(d => ({
    period: d.period,
    Revenue: (d.revenue / baseRevenue) * 100,
    Profit: (d.profit / baseRevenue) * 100,
    OCF: (d.ocf / baseRevenue) * 100,
    FCF: (d.fcf / baseRevenue) * 100,
  }));

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Sales-Profit-Cash Alignment
              <Badge variant={data.verdict === "Strong" ? "success" : data.verdict === "Moderate" ? "secondary" : "destructive"}>
                {data.verdict}
              </Badge>
            </CardTitle>
            <CardDescription>
              {data.symbol} • Revenue to cash flow conversion • As of {data.asOf}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-100">{data.alignmentScore}</div>
            <div className="text-[10px] text-slate-500">Alignment Score</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        {/* Flow Waterfall Chart */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Revenue → Profit → Cash Flow Trend</div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} tickFormatter={(v) => `${v.toFixed(0)}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: number, name: string) => [`${value.toFixed(1)} (indexed)`, name]}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#3b82f6" fill="url(#revenueGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="Profit" stroke="#8b5cf6" fill="url(#profitGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="OCF" stroke="#10b981" fill="url(#cashGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {[{ label: "Revenue", color: "#3b82f6" }, { label: "Profit", color: "#8b5cf6" }, { label: "OCF", color: "#10b981" }].map(item => (
              <span key={item.label} className="text-[10px] flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* Conversion Quality */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className={`text-lg font-bold ${data.conversionQuality.avgCashConversion >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
              {data.conversionQuality.avgCashConversion.toFixed(0)}%
            </div>
            <div className="text-[9px] text-slate-500">Avg Cash Conversion</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className={`text-sm font-semibold ${
              data.conversionQuality.cashConversionTrend === "Improving" ? "text-emerald-400" : 
              data.conversionQuality.cashConversionTrend === "Stable" ? "text-slate-200" : "text-red-400"
            }`}>
              {data.conversionQuality.cashConversionTrend}
            </div>
            <div className="text-[9px] text-slate-500">Conversion Trend</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className={`text-lg font-bold ${data.conversionQuality.accrualRatio < 10 ? "text-emerald-400" : "text-amber-400"}`}>
              {data.conversionQuality.accrualRatio.toFixed(1)}%
            </div>
            <div className="text-[9px] text-slate-500">Accrual Ratio</div>
          </div>
        </div>

        {/* Alerts */}
        {data.alerts.length > 0 && (
          <div className="space-y-1">
            {data.alerts.map((alert, i) => (
              <div key={i} className="text-[10px] text-amber-400 flex items-center gap-1">
                <span>⚠️</span> {alert}
              </div>
            ))}
          </div>
        )}

        <InterpretationFooter variant={data.verdict === "Strong" ? "success" : data.verdict === "Moderate" ? "info" : "warning"}>
          Cash conversion of {data.conversionQuality.avgCashConversion.toFixed(0)}% indicates {data.conversionQuality.avgCashConversion >= 80 ? "healthy" : "suboptimal"} earnings quality.
          {data.conversionQuality.accrualRatio > 15 ? ` Accrual ratio of ${data.conversionQuality.accrualRatio.toFixed(1)}% suggests elevated accounting accruals—monitor for sustainability.` : ""}
          {data.conversionQuality.cashConversionTrend === "Declining" ? " Declining conversion trend warrants attention." : ""}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
