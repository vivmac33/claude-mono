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
  Legend,
  BarChart,
  Bar,
} from "recharts";

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface DividendCrystalBallData {
  symbol: string;
  asOf: string;
  currentYield: number;
  forwardYield: number;
  dividendGrowthRate5Y: number;
  payoutRatio: number;
  consecutiveYearsGrowth: number;
  dividendSafety: "Very Safe" | "Safe" | "Moderate" | "At Risk" | "Unsafe";
  projection: Array<{
    year: string;
    dividend: number;
    yieldOnCost: number;
  }>;
  historicalDividends: Array<{
    year: string;
    dividend: number;
    growth: number;
  }>;
  incomeScenarios: {
    conservative: number;
    base: number;
    optimistic: number;
  };
  nextExDate: string;
  nextPayDate: string;
  nextAmount: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getDividendCrystalBallOutput(data: DividendCrystalBallData): CardOutput {
  const { symbol, asOf, currentYield, forwardYield, dividendGrowthRate5Y, payoutRatio, consecutiveYearsGrowth, dividendSafety, projection, nextExDate } = data;
  
  const isSafe = dividendSafety === "Very Safe" || dividendSafety === "Safe";
  const isAtRisk = dividendSafety === "At Risk" || dividendSafety === "Unsafe";
  const sentiment = isSafe && currentYield > 2 ? "bullish" : isAtRisk ? "bearish" : "neutral";
  const signalStrength = isSafe ? (currentYield > 4 ? 5 : currentYield > 2 ? 4 : 3) : isAtRisk ? 2 : 3;
  
  const yieldOnCost5Y = projection.length > 0 ? projection[projection.length - 1]?.yieldOnCost || currentYield : currentYield;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Current Yield", "dcb_yield", currentYield, 
      currentYield > 4 ? "excellent" : currentYield > 2 ? "good" : currentYield > 1 ? "fair" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Forward Yield", "dcb_fwd_yield", forwardYield, 
      forwardYield > currentYield ? "excellent" : "good",
      { format: "percent", priority: 2 }),
    createMetric("5Y Dividend Growth", "dcb_growth", dividendGrowthRate5Y, 
      dividendGrowthRate5Y > 10 ? "excellent" : dividendGrowthRate5Y > 5 ? "good" : dividendGrowthRate5Y > 0 ? "fair" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Payout Ratio", "dcb_payout", payoutRatio, 
      payoutRatio < 50 ? "safe" : payoutRatio < 70 ? "moderate" : payoutRatio < 90 ? "risky" : "dangerous",
      { format: "percent", priority: 1 }),
    createMetric("Consecutive Years", "dcb_streak", consecutiveYearsGrowth, 
      consecutiveYearsGrowth > 10 ? "excellent" : consecutiveYearsGrowth > 5 ? "good" : "fair",
      { format: "number", priority: 2, unit: "years" }),
    createMetric("Projected YoC (5Y)", "dcb_yoc", yieldOnCost5Y, 
      yieldOnCost5Y > currentYield * 1.5 ? "excellent" : yieldOnCost5Y > currentYield * 1.2 ? "good" : "fair",
      { format: "percent", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // Safety assessment
  if (dividendSafety === "Very Safe") {
    insights.push(createInsight("strength", `Very safe dividend with ${payoutRatio.toFixed(0)}% payout ratio and ${consecutiveYearsGrowth} years of consecutive growth`, 1, ["dcb_payout", "dcb_streak"]));
  } else if (dividendSafety === "Unsafe") {
    insights.push(createInsight("risk", `Unsafe dividend - high payout ratio (${payoutRatio.toFixed(0)}%) raises cut risk`, 1, ["dcb_payout"]));
  } else if (dividendSafety === "At Risk") {
    insights.push(createInsight("risk", `Dividend at risk - monitor for potential cut`, 1, ["dcb_payout"]));
  }
  
  // Yield assessment
  if (currentYield > 5) {
    insights.push(createInsight("observation", `High ${currentYield.toFixed(1)}% yield - verify sustainability before committing`, 2, ["dcb_yield"]));
  } else if (currentYield > 3 && isSafe) {
    insights.push(createInsight("strength", `Attractive ${currentYield.toFixed(1)}% yield with safe payout`, 2, ["dcb_yield"]));
  }
  
  // Growth
  if (dividendGrowthRate5Y > 10) {
    insights.push(createInsight("strength", `Strong dividend growth of ${dividendGrowthRate5Y.toFixed(1)}% CAGR over 5 years`, 2, ["dcb_growth"]));
  } else if (dividendGrowthRate5Y < 0) {
    insights.push(createInsight("weakness", `Dividend declining at ${dividendGrowthRate5Y.toFixed(1)}% annually`, 2, ["dcb_growth"]));
  }
  
  // Upcoming dividend
  if (nextExDate) {
    insights.push(createInsight("action", `Next ex-dividend date: ${nextExDate}`, 3));
  }
  
  const headline = `${symbol} ${currentYield.toFixed(1)}% yield with ${dividendSafety.toLowerCase()} dividend - ${consecutiveYearsGrowth} years growth streak`;
  
  return {
    cardId: "dividend-crystal-ball",
    cardCategory: "income",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: consecutiveYearsGrowth >= 5 ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: isSafe
      ? ["income-stability", "dividend-sip-tracker", "fcf-health"]
      : ["fcf-health", "financial-stress-radar", "earnings-stability"],
    tags: ["dividend", "income", dividendSafety.toLowerCase().replace(" ", "-")],
    scoreContribution: {
      category: "quality",
      score: isSafe ? (currentYield > 3 ? 85 : 70) : isAtRisk ? 30 : 50,
      weight: 0.15,
    },
  };
}

interface Props {
  data?: DividendCrystalBallData;
  isLoading?: boolean;
  error?: string | null;
}

export default function DividendCrystalBallCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['income'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Dividend Crystal Ball
            </CardTitle>
          <CardDescription>Projecting dividends…</CardDescription>
        </CardHeader>
        <CardContent><Skeleton className="h-48 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Dividend Crystal Ball</CardTitle>
          <CardDescription className={error ? "text-red-400" : ""}>{error || "No data"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const {
    symbol, asOf, currentYield, forwardYield, dividendGrowthRate5Y, payoutRatio,
    consecutiveYearsGrowth, dividendSafety, projection, historicalDividends,
    incomeScenarios, nextExDate, nextPayDate, nextAmount
  } = data;

  const safetyColors = {
    "Very Safe": "success" as const,
    "Safe": "success" as const,
    "Moderate": "warning" as const,
    "At Risk": "destructive" as const,
    "Unsafe": "destructive" as const,
  };

  const metrics = [
    { label: "Current Yield", value: `${currentYield.toFixed(2)}%` },
    { label: "Forward Yield", value: `${forwardYield.toFixed(2)}%` },
    { label: "5Y Growth", value: `${dividendGrowthRate5Y.toFixed(1)}%` },
    { label: "Payout Ratio", value: `${payoutRatio.toFixed(0)}%`, trend: payoutRatio < 60 ? "up" as const : payoutRatio > 80 ? "down" as const : "neutral" as const },
    { label: "Streak", value: `${consecutiveYearsGrowth}Y` },
    { label: "Next Div", value: `$${nextAmount.toFixed(2)}` },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Dividend Crystal Ball
              <Badge variant={safetyColors[dividendSafety]}>{dividendSafety}</Badge>
            </CardTitle>
            <CardDescription>{symbol} • Income projection • As of {asOf}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-400">{currentYield.toFixed(2)}%</div>
            <div className="text-xs text-slate-400">Current Yield</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={6} />

        {/* Projection Chart */}
        <div className="h-44">
          <div className="text-[10px] uppercase text-slate-500 mb-1">10-Year Dividend Projection</div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projection}>
              <defs>
                <linearGradient id="divGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={{ stroke: "#334155" }} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                formatter={(value: number, name: string) => [
                  name === "dividend" ? `$${value.toFixed(2)}` : `${value.toFixed(2)}%`,
                  name === "dividend" ? "Dividend" : "Yield on Cost"
                ]}
              />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Area type="monotone" dataKey="dividend" name="Dividend" stroke="#10b981" fill="url(#divGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Historical Growth */}
        <div className="h-32">
          <div className="text-[10px] uppercase text-slate-500 mb-1">Historical Dividend Growth</div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={historicalDividends}>
              <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={{ stroke: "#334155" }} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
              />
              <Bar dataKey="growth" name="YoY Growth" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Income Scenarios */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-800/30 rounded-lg p-2 text-center">
            <div className="text-[9px] uppercase text-slate-500">Conservative</div>
            <div className="text-sm font-bold text-slate-300">${incomeScenarios.conservative.toFixed(0)}</div>
            <div className="text-[9px] text-slate-500">10Y income/share</div>
          </div>
          <div className="bg-emerald-900/30 rounded-lg p-2 text-center border border-emerald-700/50">
            <div className="text-[9px] uppercase text-slate-500">Base Case</div>
            <div className="text-sm font-bold text-emerald-300">${incomeScenarios.base.toFixed(0)}</div>
            <div className="text-[9px] text-slate-500">10Y income/share</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-2 text-center">
            <div className="text-[9px] uppercase text-slate-500">Optimistic</div>
            <div className="text-sm font-bold text-slate-300">${incomeScenarios.optimistic.toFixed(0)}</div>
            <div className="text-[9px] text-slate-500">10Y income/share</div>
          </div>
        </div>

        {/* Upcoming Dividend */}
        <div className="flex justify-between items-center bg-slate-800/30 rounded-lg px-3 py-2 text-xs">
          <div>
            <span className="text-slate-500">Ex-Date:</span> <span className="text-slate-200">{nextExDate}</span>
          </div>
          <div>
            <span className="text-slate-500">Pay Date:</span> <span className="text-slate-200">{nextPayDate}</span>
          </div>
          <div>
            <span className="text-slate-500">Amount:</span> <span className="text-emerald-400">${nextAmount.toFixed(2)}</span>
          </div>
        </div>

        <InterpretationFooter variant={dividendSafety === "Very Safe" || dividendSafety === "Safe" ? "success" : dividendSafety === "Unsafe" || dividendSafety === "At Risk" ? "warning" : "neutral"}>
          {consecutiveYearsGrowth}-year dividend growth streak with {payoutRatio.toFixed(0)}% payout ratio.
          {dividendSafety === "Very Safe" || dividendSafety === "Safe"
            ? " Sustainable dividend with room for growth."
            : dividendSafety === "At Risk" || dividendSafety === "Unsafe"
            ? " Elevated payout ratio raises sustainability concerns."
            : " Monitor earnings coverage for dividend sustainability."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
