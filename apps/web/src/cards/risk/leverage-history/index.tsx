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

export interface LeverageHistoryData {
  symbol: string;
  asOf: string;
  leverageScore: number;
  riskLevel: "Low" | "Moderate" | "High" | "Critical";
  currentMetrics: {
    debtToEquity: number;
    debtToEbitda: number;
    interestCoverage: number;
    netDebtToEbitda: number;
  };
  historicalLeverage: Array<{
    period: string;
    debtToEquity: number;
    interestCoverage: number;
    totalDebt: number;
  }>;
  debtBreakdown: {
    shortTerm: number;
    longTerm: number;
    secured: number;
    unsecured: number;
  };
  covenants: {
    status: "Compliant" | "Near Breach" | "Breached";
    headroom: number;
    details: string;
  };
  maturitySchedule: Array<{
    year: string;
    amount: number;
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getLeverageHistoryOutput(data: LeverageHistoryData): CardOutput {
  const { symbol, asOf, leverageScore, riskLevel, currentMetrics, covenants, maturitySchedule, debtBreakdown } = data;
  
  const sentiment = riskLevel === "Low" ? "bullish" : riskLevel === "Critical" || riskLevel === "High" ? "bearish" : "neutral";
  const signalStrength = riskLevel === "Low" ? 5 : riskLevel === "Moderate" ? 4 : riskLevel === "High" ? 2 : 1;
  
  const shortTermPct = (debtBreakdown.shortTerm / (debtBreakdown.shortTerm + debtBreakdown.longTerm)) * 100;
  const nearTermMaturity = maturitySchedule.slice(0, 2).reduce((sum, m) => sum + m.amount, 0);
  
  const keyMetrics: MetricValue[] = [
    createMetric("Leverage Score", "lh_leverage_score", leverageScore, 
      leverageScore > 75 ? "safe" : leverageScore > 50 ? "moderate" : leverageScore > 25 ? "risky" : "dangerous",
      { format: "score", priority: 1 }),
    createMetric("Debt/Equity", "lh_debt_equity", currentMetrics.debtToEquity, 
      currentMetrics.debtToEquity < 0.5 ? "safe" : currentMetrics.debtToEquity < 1 ? "moderate" : currentMetrics.debtToEquity < 2 ? "risky" : "dangerous",
      { format: "ratio", priority: 1, unit: "x" }),
    createMetric("Debt/EBITDA", "lh_debt_ebitda", currentMetrics.debtToEbitda, 
      currentMetrics.debtToEbitda < 2 ? "safe" : currentMetrics.debtToEbitda < 4 ? "moderate" : "risky",
      { format: "ratio", priority: 1, unit: "x" }),
    createMetric("Interest Coverage", "lh_interest_coverage", currentMetrics.interestCoverage, 
      currentMetrics.interestCoverage > 5 ? "safe" : currentMetrics.interestCoverage > 2 ? "moderate" : "dangerous",
      { format: "ratio", priority: 1, unit: "x" }),
    createMetric("Net Debt/EBITDA", "lh_net_debt_ebitda", currentMetrics.netDebtToEbitda, 
      currentMetrics.netDebtToEbitda < 1 ? "safe" : currentMetrics.netDebtToEbitda < 3 ? "moderate" : "risky",
      { format: "ratio", priority: 2, unit: "x" }),
    createMetric("Short-Term Debt %", "lh_short_term_pct", shortTermPct, 
      shortTermPct < 20 ? "safe" : shortTermPct < 40 ? "moderate" : "risky",
      { format: "percent", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Risk level
  if (riskLevel === "Low") {
    insights.push(createInsight("strength", `Low leverage risk (${leverageScore}/100) - conservative debt levels`, 1, ["lh_leverage_score"]));
  } else if (riskLevel === "Critical") {
    insights.push(createInsight("risk", `Critical leverage risk (${leverageScore}/100) - debt levels unsustainable`, 1, ["lh_leverage_score"]));
  } else if (riskLevel === "High") {
    insights.push(createInsight("risk", `High leverage risk (${leverageScore}/100) - elevated debt concerns`, 1, ["lh_leverage_score"]));
  }
  
  // Interest coverage
  if (currentMetrics.interestCoverage < 2) {
    insights.push(createInsight("risk", `Weak interest coverage (${currentMetrics.interestCoverage.toFixed(1)}x) - debt servicing at risk`, 1, ["lh_interest_coverage"]));
  } else if (currentMetrics.interestCoverage > 8) {
    insights.push(createInsight("strength", `Strong interest coverage (${currentMetrics.interestCoverage.toFixed(1)}x) - comfortable debt service`, 2, ["lh_interest_coverage"]));
  }
  
  // Covenants
  if (covenants.status === "Breached") {
    insights.push(createInsight("risk", `Covenant breach: ${covenants.details}`, 1));
  } else if (covenants.status === "Near Breach") {
    insights.push(createInsight("risk", `Near covenant breach - only ${covenants.headroom}% headroom`, 2));
  }
  
  // Maturity wall
  if (nearTermMaturity > 0) {
    insights.push(createInsight("observation", `₹${nearTermMaturity.toFixed(0)}Cr debt maturing in next 2 years`, 3));
  }
  
  const headline = `${symbol} ${riskLevel.toLowerCase()} leverage with ${currentMetrics.debtToEquity.toFixed(2)}x D/E and ${currentMetrics.interestCoverage.toFixed(1)}x interest coverage`;
  
  return {
    cardId: "leverage-history",
    cardCategory: "risk",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: riskLevel === "Low"
      ? ["financial-health-dna", "capital-allocation", "piotroski-score"]
      : ["financial-stress-radar", "bankruptcy-health", "working-capital-health"],
    tags: ["leverage", "debt", riskLevel.toLowerCase() + "-risk"],
    scoreContribution: {
      category: "risk",
      score: leverageScore,
      weight: 0.15,
    },
  };
}

interface Props {
  data?: LeverageHistoryData;
  isLoading?: boolean;
  error?: string | null;
}

export default function LeverageHistoryCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['risk'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Leverage History
            </CardTitle>
          <CardDescription>Analyzing debt structure…</CardDescription>
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
          <CardTitle>Leverage History</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Leverage History</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const metrics = [
    { label: "Debt/Equity", value: `${data.currentMetrics.debtToEquity.toFixed(2)}x`, trend: data.currentMetrics.debtToEquity < 1 ? "up" as const : "down" as const },
    { label: "Debt/EBITDA", value: `${data.currentMetrics.debtToEbitda.toFixed(1)}x`, trend: data.currentMetrics.debtToEbitda < 3 ? "up" as const : "down" as const },
    { label: "Int Coverage", value: `${data.currentMetrics.interestCoverage.toFixed(1)}x`, trend: data.currentMetrics.interestCoverage > 3 ? "up" as const : "down" as const },
    { label: "Net Debt/EBITDA", value: `${data.currentMetrics.netDebtToEbitda.toFixed(1)}x` },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Leverage History
              <Badge variant={data.riskLevel === "Low" ? "success" : data.riskLevel === "Moderate" ? "secondary" : "destructive"}>
                {data.riskLevel} Risk
              </Badge>
            </CardTitle>
            <CardDescription>
              {data.symbol} • Debt & leverage analysis • As of {data.asOf}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${data.currentMetrics.debtToEquity < 0.5 ? "text-emerald-400" : data.currentMetrics.debtToEquity < 1 ? "text-slate-200" : "text-amber-400"}`}>
              {data.currentMetrics.debtToEquity.toFixed(2)}x
            </div>
            <div className="text-[10px] text-slate-500">Debt/Equity</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        {/* Covenant Status */}
        <SignalBox
          signal={data.covenants.status === "Compliant" ? "bullish" : data.covenants.status === "Near Breach" ? "caution" : "bearish"}
          title={`Covenant Status: ${data.covenants.status}`}
          description={`${data.covenants.headroom.toFixed(0)}% headroom • ${data.covenants.details}`}
        />

        {/* Historical Leverage Chart */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Leverage Trend</div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.historicalLeverage} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: number, name: string) => [name === "totalDebt" ? `₹${value}Cr` : `${value.toFixed(2)}x`, name === "debtToEquity" ? "D/E" : name === "interestCoverage" ? "Int Cov" : "Total Debt"]}
                />
                <ReferenceLine yAxisId="left" y={1} stroke="#f59e0b" strokeDasharray="3 3" />
                <Bar yAxisId="right" dataKey="totalDebt" fill="#3b82f6" opacity={0.3} radius={[2, 2, 0, 0]} />
                <Line yAxisId="left" type="monotone" dataKey="debtToEquity" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line yAxisId="left" type="monotone" dataKey="interestCoverage" stroke="#10b981" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-1">
            <span className="text-[10px] flex items-center gap-1 text-slate-400"><span className="w-2 h-0.5 bg-red-500" /> D/E Ratio</span>
            <span className="text-[10px] flex items-center gap-1 text-slate-400"><span className="w-2 h-0.5 bg-emerald-500" /> Int Coverage</span>
            <span className="text-[10px] flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded bg-blue-500 opacity-30" /> Total Debt</span>
          </div>
        </div>

        {/* Debt Breakdown */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-[9px] text-slate-500 uppercase mb-1">By Maturity</div>
            <div className="flex gap-1">
              <div className="flex-1 rounded bg-amber-900/30 p-2 text-center">
                <div className="text-sm font-semibold text-amber-400">{Math.round(data.debtBreakdown.shortTerm)}%</div>
                <div className="text-[9px] text-slate-500">Short-term</div>
              </div>
              <div className="flex-1 rounded bg-blue-900/30 p-2 text-center">
                <div className="text-sm font-semibold text-blue-400">{Math.round(data.debtBreakdown.longTerm)}%</div>
                <div className="text-[9px] text-slate-500">Long-term</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[9px] text-slate-500 uppercase mb-1">By Security</div>
            <div className="flex gap-1">
              <div className="flex-1 rounded bg-emerald-900/30 p-2 text-center">
                <div className="text-sm font-semibold text-emerald-400">{Math.round(data.debtBreakdown.secured)}%</div>
                <div className="text-[9px] text-slate-500">Secured</div>
              </div>
              <div className="flex-1 rounded bg-slate-700 p-2 text-center">
                <div className="text-sm font-semibold text-slate-300">{Math.round(data.debtBreakdown.unsecured)}%</div>
                <div className="text-[9px] text-slate-500">Unsecured</div>
              </div>
            </div>
          </div>
        </div>

        {/* Maturity Schedule */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Debt Maturity Schedule</div>
          <div className="flex gap-1">
            {data.maturitySchedule.map((m) => (
              <div key={m.year} className="flex-1 text-center">
                <div className="h-16 bg-slate-800/50 rounded flex items-end justify-center pb-1">
                  <div 
                    className="w-full mx-1 bg-blue-500 rounded-t"
                    style={{ height: `${Math.min(100, (m.amount / Math.max(...data.maturitySchedule.map(x => x.amount))) * 100)}%` }}
                  />
                </div>
                <div className="text-[9px] text-slate-500 mt-1">{m.year}</div>
                <div className="text-[9px] text-slate-400">₹{m.amount}Cr</div>
              </div>
            ))}
          </div>
        </div>

        <InterpretationFooter variant={data.riskLevel === "Low" ? "success" : data.riskLevel === "Moderate" ? "info" : "warning"}>
          Debt-to-equity of {data.currentMetrics.debtToEquity.toFixed(2)}x with interest coverage of {data.currentMetrics.interestCoverage.toFixed(1)}x indicates {data.riskLevel.toLowerCase()} leverage risk.
          {data.covenants.status !== "Compliant" && ` ⚠️ Covenant ${data.covenants.status.toLowerCase()} with ${data.covenants.headroom.toFixed(0)}% headroom.`}
          {data.debtBreakdown.shortTerm > 40 && " High short-term debt concentration requires near-term refinancing attention."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
