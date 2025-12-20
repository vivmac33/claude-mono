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
  ComposedChart,
  Bar,
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

export interface DCFValuationData {
  symbol: string;
  asOf: string;
  intrinsicValue: number;
  currentPrice: number;
  marginOfSafety: number;
  verdict: "Buy" | "Hold" | "Sell";
  assumptions: {
    revenueGrowth: number;
    terminalGrowth: number;
    wacc: number;
    taxRate: number;
  };
  projections: Array<{
    year: string;
    revenue: number;
    fcf: number;
    discountedFcf: number;
  }>;
  sensitivityMatrix: Array<{
    wacc: number;
    terminalGrowth: number;
    intrinsicValue: number;
  }>;
  valueBreakdown: {
    pvFcf: number;
    terminalValue: number;
    netDebt: number;
    equityValue: number;
    sharesOutstanding: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getDCFValuationOutput(data: DCFValuationData): CardOutput {
  const { symbol, asOf, intrinsicValue, currentPrice, marginOfSafety, verdict, assumptions, valueBreakdown } = data;
  
  const upside = ((intrinsicValue - currentPrice) / currentPrice) * 100;
  const terminalPct = (valueBreakdown.terminalValue / (valueBreakdown.pvFcf + valueBreakdown.terminalValue)) * 100;
  
  // Determine sentiment based on verdict and margin of safety
  const sentiment = verdict === "Buy" ? "bullish" : verdict === "Sell" ? "bearish" : "neutral";
  const signalStrength = marginOfSafety > 30 ? 5 : marginOfSafety > 20 ? 4 : marginOfSafety > 10 ? 3 : marginOfSafety > 0 ? 2 : 1;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Intrinsic Value", "intrinsic_value", intrinsicValue, 
      upside > 20 ? "undervalued" : upside < -20 ? "overvalued" : "fairly-valued", 
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("Current Price", "current_price", currentPrice, "neutral", 
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("Margin of Safety", "margin_of_safety", marginOfSafety, 
      marginOfSafety > 25 ? "excellent" : marginOfSafety > 15 ? "good" : marginOfSafety > 0 ? "fair" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Upside Potential", "dcf_upside", upside, 
      upside > 20 ? "bullish" : upside < -10 ? "bearish" : "neutral",
      { format: "percent", priority: 1 }),
    createMetric("WACC", "wacc", assumptions.wacc, "neutral", { format: "percent", priority: 2 }),
    createMetric("Terminal Growth", "terminal_growth", assumptions.terminalGrowth, "neutral", 
      { format: "percent", priority: 2 }),
    createMetric("Revenue CAGR", "dcf_revenue_cagr", assumptions.revenueGrowth, 
      assumptions.revenueGrowth > 15 ? "good" : assumptions.revenueGrowth > 8 ? "fair" : "poor",
      { format: "percent", priority: 2 }),
    createMetric("Terminal Value %", "terminal_value_pct", terminalPct, 
      terminalPct > 70 ? "risky" : terminalPct > 50 ? "moderate" : "safe",
      { format: "percent", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Main verdict insight
  if (verdict === "Buy") {
    insights.push(createInsight("strength", `DCF model indicates ${marginOfSafety.toFixed(0)}% margin of safety, supporting accumulation`, 1, ["margin_of_safety", "intrinsic_value"]));
  } else if (verdict === "Sell") {
    insights.push(createInsight("weakness", `Stock trades ${Math.abs(upside).toFixed(0)}% above intrinsic value - overvalued on DCF basis`, 1, ["dcf_upside", "intrinsic_value"]));
  } else {
    insights.push(createInsight("observation", `Stock trading near fair value with ${marginOfSafety.toFixed(0)}% margin of safety`, 1, ["margin_of_safety"]));
  }
  
  // Terminal value concentration warning
  if (terminalPct > 70) {
    insights.push(createInsight("risk", `Terminal value represents ${terminalPct.toFixed(0)}% of total - model highly sensitive to long-term assumptions`, 2, ["terminal_value_pct"]));
  }
  
  // WACC assumptions
  if (assumptions.wacc < 8) {
    insights.push(createInsight("risk", `Low WACC assumption (${assumptions.wacc}%) may overstate intrinsic value`, 2, ["wacc"]));
  } else if (assumptions.wacc > 12) {
    insights.push(createInsight("observation", `Conservative WACC (${assumptions.wacc}%) provides downside buffer`, 3, ["wacc"]));
  }
  
  // Growth assumptions
  if (assumptions.revenueGrowth > 20) {
    insights.push(createInsight("risk", `High growth assumption (${assumptions.revenueGrowth}% CAGR) requires execution validation`, 2, ["dcf_revenue_cagr"]));
  }
  
  const headline = `${symbol} DCF suggests ${verdict === "Buy" ? "undervaluation" : verdict === "Sell" ? "overvaluation" : "fair value"} with ${marginOfSafety.toFixed(0)}% margin of safety`;
  
  return {
    cardId: "dcf-valuation",
    cardCategory: "value",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: marginOfSafety > 20 ? "high" : marginOfSafety > 10 ? "medium" : "low",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: verdict === "Buy" 
      ? ["valuation-summary", "piotroski-score", "growth-summary"]
      : ["risk-health-dashboard", "financial-stress-radar"],
    tags: ["dcf", "valuation", "intrinsic-value", verdict.toLowerCase()],
    scoreContribution: {
      category: "valuation",
      score: Math.min(100, Math.max(0, 50 + marginOfSafety)),
      weight: 0.25,
    },
  };
}

interface Props {
  data?: DCFValuationData;
  isLoading?: boolean;
  error?: string | null;
}

export default function DCFValuationCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['value'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              DCF Valuation
            </CardTitle>
          <CardDescription>Running discounted cash flow model…</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full mb-3" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>DCF Valuation</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>DCF Valuation</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const {
    symbol,
    asOf,
    intrinsicValue,
    currentPrice,
    marginOfSafety,
    verdict,
    assumptions,
    projections,
    sensitivityMatrix,
    valueBreakdown,
  } = data;

  const upside = ((intrinsicValue - currentPrice) / currentPrice) * 100;

  const metrics = [
    { label: "Intrinsic Value", value: `$${intrinsicValue.toFixed(2)}` },
    { label: "Current Price", value: `$${currentPrice.toFixed(2)}` },
    { label: "Margin of Safety", value: `${marginOfSafety.toFixed(1)}%`, trend: marginOfSafety > 0 ? "up" as const : "down" as const },
    { label: "WACC", value: `${assumptions.wacc.toFixed(1)}%` },
    { label: "Terminal Growth", value: `${assumptions.terminalGrowth.toFixed(1)}%` },
    { label: "Revenue CAGR", value: `${assumptions.revenueGrowth.toFixed(1)}%` },
  ];

  const verdictBadge = {
    Buy: <Badge variant="success">Buy</Badge>,
    Hold: <Badge variant="secondary">Hold</Badge>,
    Sell: <Badge variant="destructive">Sell</Badge>,
  };

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              DCF Valuation
              {verdictBadge[verdict]}
            </CardTitle>
            <CardDescription>
              {symbol} • Discounted Cash Flow • As of {asOf}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-100">${intrinsicValue.toFixed(2)}</div>
            <div className={`text-xs ${upside > 0 ? "text-emerald-400" : "text-red-400"}`}>
              {upside > 0 ? "↑" : "↓"} {Math.abs(upside).toFixed(1)}% upside
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={6} />

        {/* FCF Projections Chart */}
        <div className="h-44">
          <div className="text-[10px] uppercase text-slate-500 mb-1">FCF Projections & Discounted Value</div>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={projections}>
              <XAxis
                dataKey="year"
                tick={{ fill: "#64748b", fontSize: 9 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 9 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1e9).toFixed(0)}B`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                formatter={(value: number) => [`$${(value / 1e9).toFixed(2)}B`, ""]}
              />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Bar dataKey="fcf" name="FCF" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Line
                type="monotone"
                dataKey="discountedFcf"
                name="Discounted FCF"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Value Breakdown */}
        <div className="grid grid-cols-5 gap-2">
          <div className="text-[9px] uppercase text-slate-500 col-span-5 mb-0.5">Value Breakdown</div>
          <div className="bg-slate-800/50 rounded p-2 text-center">
            <div className="text-xs font-semibold text-blue-400">${(valueBreakdown.pvFcf / 1e9).toFixed(1)}B</div>
            <div className="text-[9px] text-slate-500">PV of FCF</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2 text-center">
            <div className="text-xs font-semibold text-emerald-400">${(valueBreakdown.terminalValue / 1e9).toFixed(1)}B</div>
            <div className="text-[9px] text-slate-500">Terminal Value</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2 text-center">
            <div className="text-xs font-semibold text-red-400">-${(valueBreakdown.netDebt / 1e9).toFixed(1)}B</div>
            <div className="text-[9px] text-slate-500">Net Debt</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2 text-center">
            <div className="text-xs font-semibold text-slate-200">${(valueBreakdown.equityValue / 1e9).toFixed(1)}B</div>
            <div className="text-[9px] text-slate-500">Equity Value</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2 text-center">
            <div className="text-xs font-semibold text-slate-200">{(valueBreakdown.sharesOutstanding / 1e9).toFixed(2)}B</div>
            <div className="text-[9px] text-slate-500">Shares Out</div>
          </div>
        </div>

        {/* Sensitivity Matrix */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">WACC / Terminal Growth Sensitivity</div>
          <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
            <div className="text-slate-500">WACC ↓ TG →</div>
            {[1.5, 2.0, 2.5, 3.0].map((tg) => (
              <div key={tg} className="text-slate-400 font-medium">{tg}%</div>
            ))}
            {[8, 9, 10, 11, 12].map((wacc) => (
              <React.Fragment key={wacc}>
                <div className="text-slate-400 font-medium">{wacc}%</div>
                {[1.5, 2.0, 2.5, 3.0].map((tg) => {
                  const match = sensitivityMatrix.find(
                    (s) => s.wacc === wacc && s.terminalGrowth === tg
                  );
                  const val = match?.intrinsicValue || intrinsicValue;
                  const diff = ((val - currentPrice) / currentPrice) * 100;
                  return (
                    <div
                      key={`${wacc}-${tg}`}
                      className={`rounded py-1 ${
                        diff > 20 ? "bg-emerald-900/40" : diff > 0 ? "bg-blue-900/40" : "bg-red-900/40"
                      }`}
                    >
                      ${val.toFixed(0)}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        <InterpretationFooter variant={verdict === "Buy" ? "success" : verdict === "Sell" ? "warning" : "neutral"}>
          DCF suggests {marginOfSafety.toFixed(0)}% margin of safety at ${intrinsicValue.toFixed(2)}.
          Key sensitivities: each 1% WACC change moves value ~15%; terminal growth has similar impact.
          {verdict === "Buy"
            ? " Model supports accumulation with reasonable assumptions."
            : verdict === "Sell"
            ? " Implied growth expectations may be unrealistic."
            : " Fair value zone; watch for assumption changes."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
