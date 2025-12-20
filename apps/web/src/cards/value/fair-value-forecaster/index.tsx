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
  ReferenceLine,
  CartesianGrid,
} from "recharts";

// Centralized chart theme
import {
  chartColors,
  xAxisProps,
  yAxisProps,
  tooltipProps,
  cartesianGridProps,
  chartMargins,
  referenceLineStyles,
} from "@/lib/chartTheme";

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface FairValueForecastData {
  symbol: string;
  asOf: string;
  currentPrice: number;
  fairValueNow: number;
  marginOfSafetyPct: number;
  horizonYears: number;
  upside: number;
  valuation: "Undervalued" | "Fair Value" | "Overvalued";
  confidence: number;
  fan: Array<{
    t: string;
    p5: number;
    p25: number;
    p50: number;
    p75: number;
    p95: number;
  }>;
  sensitivity: Array<{
    growthDeltaPct: number;
    fv: number;
  }>;
  drivers: {
    earningsGrowth: number;
    revenueGrowth: number;
    marginExpansion: number;
    multipleChange: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getFairValueForecasterOutput(data: FairValueForecastData): CardOutput {
  const { symbol, asOf, currentPrice, fairValueNow, marginOfSafetyPct, upside, valuation, confidence, drivers, fan } = data;
  
  const sentiment = valuation === "Undervalued" ? "bullish" : valuation === "Overvalued" ? "bearish" : "neutral";
  const signalStrength = Math.abs(upside) > 30 ? 5 : Math.abs(upside) > 20 ? 4 : Math.abs(upside) > 10 ? 3 : 2;
  
  // Get terminal projections from fan chart
  const terminalP50 = fan[fan.length - 1]?.p50 || fairValueNow;
  const terminalUpside = ((terminalP50 - currentPrice) / currentPrice) * 100;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Fair Value", "fair_value_now", fairValueNow, 
      valuation === "Undervalued" ? "undervalued" : valuation === "Overvalued" ? "overvalued" : "fairly-valued",
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("Current Price", "fv_current_price", currentPrice, "neutral", 
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("Margin of Safety", "fv_margin_of_safety", marginOfSafetyPct, 
      marginOfSafetyPct > 25 ? "excellent" : marginOfSafetyPct > 10 ? "good" : marginOfSafetyPct > 0 ? "fair" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Upside Potential", "fv_upside", upside, 
      upside > 20 ? "bullish" : upside < -10 ? "bearish" : "neutral",
      { format: "percent", priority: 1 }),
    createMetric("Model Confidence", "fv_confidence", confidence, 
      confidence > 80 ? "excellent" : confidence > 60 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Earnings Growth Driver", "fv_earnings_driver", drivers.earningsGrowth, 
      drivers.earningsGrowth > 0 ? "bullish" : "bearish",
      { format: "percent", priority: 2 }),
    createMetric("Multiple Change Driver", "fv_multiple_driver", drivers.multipleChange, 
      drivers.multipleChange > 0 ? "bullish" : "bearish",
      { format: "percent", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Main valuation insight
  if (valuation === "Undervalued") {
    insights.push(createInsight("strength", `Fair value analysis suggests ${marginOfSafetyPct.toFixed(0)}% margin of safety with ${upside.toFixed(0)}% upside`, 1, ["fv_margin_of_safety", "fv_upside"]));
  } else if (valuation === "Overvalued") {
    insights.push(createInsight("weakness", `Stock trades ${Math.abs(upside).toFixed(0)}% above fair value - limited upside potential`, 1, ["fv_upside"]));
  } else {
    insights.push(createInsight("observation", `Stock trading near fair value within ${Math.abs(marginOfSafetyPct).toFixed(0)}% of intrinsic estimate`, 1, ["fv_margin_of_safety"]));
  }
  
  // Driver analysis
  const primaryDriver = Object.entries(drivers).sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))[0];
  if (primaryDriver) {
    const [driverName, driverValue] = primaryDriver;
    const driverLabel = driverName.replace(/([A-Z])/g, " $1").trim().toLowerCase();
    if (Math.abs(driverValue) > 10) {
      insights.push(createInsight(driverValue > 0 ? "strength" : "weakness", 
        `${driverLabel.charAt(0).toUpperCase() + driverLabel.slice(1)} is the primary value driver (${driverValue > 0 ? "+" : ""}${driverValue}%)`, 2));
    }
  }
  
  // Confidence warning
  if (confidence < 60) {
    insights.push(createInsight("risk", `Model confidence at ${confidence}% - wide projection range suggests high uncertainty`, 2, ["fv_confidence"]));
  }
  
  const headline = `${symbol} fair value at ₹${fairValueNow.toFixed(0)} implies ${valuation.toLowerCase()} status with ${upside > 0 ? "+" : ""}${upside.toFixed(0)}% potential`;
  
  return {
    cardId: "fair-value-forecaster",
    cardCategory: "value",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: confidence > 70 ? "high" : confidence > 50 ? "medium" : "low",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: valuation === "Undervalued" 
      ? ["dcf-valuation", "intrinsic-value-range", "growth-summary"]
      : ["risk-health-dashboard", "valuation-summary"],
    tags: ["fair-value", "valuation", "forecast", valuation.toLowerCase().replace(" ", "-")],
    scoreContribution: {
      category: "valuation",
      score: Math.min(100, Math.max(0, 50 + marginOfSafetyPct)),
      weight: 0.20,
    },
  };
}

interface Props {
  data?: FairValueForecastData;
  isLoading?: boolean;
  error?: string | null;
}

function getValuationBadge(valuation: FairValueForecastData["valuation"]) {
  switch (valuation) {
    case "Undervalued":
      return <Badge variant="success">Undervalued</Badge>;
    case "Fair Value":
      return <Badge variant="secondary">Fair Value</Badge>;
    case "Overvalued":
      return <Badge variant="destructive">Overvalued</Badge>;
  }
}

export default function FairValueForecasterCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['value'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Fair Value Forecaster
            </CardTitle>
          <CardDescription>Projecting intrinsic value…</CardDescription>
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
          <CardTitle>Fair Value Forecaster</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Fair Value Forecaster</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const {
    symbol,
    asOf,
    currentPrice,
    fairValueNow,
    marginOfSafetyPct,
    horizonYears,
    upside,
    valuation,
    confidence,
    fan,
    sensitivity,
    drivers,
  } = data;

  // Transform fan data for chart
  const chartData = fan.map((point) => ({
    date: point.t,
    p5: point.p5,
    p25: point.p25,
    median: point.p50,
    p75: point.p75,
    p95: point.p95,
  }));

  const metrics = [
    { label: "Current Price", value: `$${currentPrice.toFixed(2)}` },
    { label: "Fair Value", value: `$${fairValueNow.toFixed(2)}` },
    { label: "Margin of Safety", value: `${marginOfSafetyPct.toFixed(1)}%`, trend: marginOfSafetyPct > 0 ? "up" as const : "down" as const },
    { label: "Upside", value: `${upside > 0 ? "+" : ""}${upside.toFixed(1)}%`, trend: upside > 0 ? "up" as const : "down" as const },
    { label: "Horizon", value: `${horizonYears}Y` },
    { label: "Confidence", value: `${confidence}%` },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Fair Value Forecaster
              {getValuationBadge(valuation)}
            </CardTitle>
            <CardDescription>
              {symbol} • {horizonYears}-year projection • As of {asOf}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-100">${fairValueNow.toFixed(2)}</div>
            <div className={`text-xs ${upside > 0 ? "text-emerald-400" : "text-red-400"}`}>
              {upside > 0 ? "↑" : "↓"} {Math.abs(upside).toFixed(1)}% to fair value
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={6} />

        {/* Fan Chart - Using centralized chartTheme */}
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={chartMargins.standard}>
              <defs>
                <linearGradient id="fvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.primary.blue} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={chartColors.primary.blue} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid {...cartesianGridProps} />
              <XAxis
                {...xAxisProps}
                dataKey="date"
              />
              <YAxis
                {...yAxisProps}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                {...tooltipProps}
                formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
              />
              <ReferenceLine
                y={currentPrice}
                {...referenceLineStyles.target}
                label={{ value: "Current", fill: chartColors.semantic.warning, fontSize: 10 }}
              />
              <Area
                type="monotone"
                dataKey="p95"
                stackId="1"
                stroke="none"
                fill={chartColors.primary.blue}
                fillOpacity={0.15}
              />
              <Area
                type="monotone"
                dataKey="p75"
                stackId="2"
                stroke="none"
                fill={chartColors.primary.blue}
                fillOpacity={0.25}
              />
              <Area
                type="monotone"
                dataKey="median"
                stackId="3"
                stroke={chartColors.primary.blue}
                strokeWidth={2}
                fill="url(#fvGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sensitivity Table */}
        <div className="grid grid-cols-5 gap-1 text-center">
          <div className="text-[9px] uppercase text-slate-500 col-span-5 mb-1">
            Fair Value Sensitivity to Growth
          </div>
          {sensitivity.map((s) => (
            <div
              key={s.growthDeltaPct}
              className="rounded bg-slate-800/50 py-1.5 px-1"
            >
              <div className="text-[9px] text-slate-500">
                {s.growthDeltaPct > 0 ? "+" : ""}
                {s.growthDeltaPct}%
              </div>
              <div className="text-xs font-semibold text-slate-200">
                ${s.fv.toFixed(0)}
              </div>
            </div>
          ))}
        </div>

        {/* Value Drivers */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-[9px] uppercase text-slate-500 col-span-4 mb-0.5">
            Value Drivers Contribution
          </div>
          {Object.entries(drivers).map(([key, value]) => (
            <div key={key} className="flex flex-col items-center">
              <div className="text-xs font-semibold text-slate-200">
                {value > 0 ? "+" : ""}
                {value}%
              </div>
              <div className="text-[9px] text-slate-500 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </div>
            </div>
          ))}
        </div>

        <InterpretationFooter variant={valuation === "Undervalued" ? "success" : valuation === "Overvalued" ? "warning" : "neutral"}>
          This projection uses DCF methodology with {confidence}% confidence bounds.
          A {marginOfSafetyPct.toFixed(0)}% margin of safety suggests{" "}
          {valuation === "Undervalued"
            ? "potential buying opportunity with limited downside."
            : valuation === "Overvalued"
            ? "elevated risk; consider waiting for better entry."
            : "the stock is trading near intrinsic value."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
