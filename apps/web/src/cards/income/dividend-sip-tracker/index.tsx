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
  ComposedChart,
  Bar,
  Line,
} from "recharts";

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface DividendSIPTrackerData {
  symbol: string;
  asOf: string;
  sipDetails: {
    monthlyAmount: number;
    tenure: number;
    totalInvested: number;
    currentValue: number;
    dividendsReceived: number;
    dividendsReinvested: boolean;
  };
  returns: {
    absoluteReturn: number;
    xirr: number;
    dividendContribution: number;
  };
  projection: Array<{
    year: string;
    invested: number;
    valueWithDRIP: number;
    valueWithoutDRIP: number;
    dividends: number;
  }>;
  dividendHistory: Array<{
    date: string;
    amount: number;
    yieldOnCost: number;
  }>;
  yieldOnCost: {
    current: number;
    projected5Y: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getDividendSIPTrackerOutput(data: DividendSIPTrackerData): CardOutput {
  const { symbol, asOf, sipDetails, returns, yieldOnCost } = data;
  
  const sentiment = returns.xirr > 15 ? "bullish" : returns.xirr > 8 ? "neutral" : "bearish";
  const signalStrength = returns.xirr > 20 ? 5 : returns.xirr > 15 ? 4 : returns.xirr > 10 ? 3 : returns.xirr > 0 ? 2 : 1;
  
  const totalReturn = sipDetails.currentValue + sipDetails.dividendsReceived - sipDetails.totalInvested;
  const totalReturnPct = (totalReturn / sipDetails.totalInvested) * 100;
  
  const keyMetrics: MetricValue[] = [
    createMetric("XIRR", "sip_xirr", returns.xirr, 
      returns.xirr > 15 ? "excellent" : returns.xirr > 10 ? "good" : returns.xirr > 0 ? "fair" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Total Invested", "sip_invested", sipDetails.totalInvested, "neutral", 
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("Current Value", "sip_value", sipDetails.currentValue, 
      sipDetails.currentValue > sipDetails.totalInvested ? "good" : "poor",
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("Dividends Received", "sip_dividends", sipDetails.dividendsReceived, 
      sipDetails.dividendsReceived > 0 ? "good" : "neutral",
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("Dividend Contribution", "sip_div_contrib", returns.dividendContribution, 
      returns.dividendContribution > 30 ? "excellent" : returns.dividendContribution > 15 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Current Yield on Cost", "sip_yoc", yieldOnCost.current, 
      yieldOnCost.current > 5 ? "excellent" : yieldOnCost.current > 3 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("Projected YoC (5Y)", "sip_yoc_5y", yieldOnCost.projected5Y, 
      yieldOnCost.projected5Y > yieldOnCost.current * 1.5 ? "excellent" : "good",
      { format: "percent", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // Return assessment
  if (returns.xirr > 15) {
    insights.push(createInsight("strength", `Strong ${returns.xirr.toFixed(1)}% XIRR on dividend SIP over ${sipDetails.tenure} months`, 1, ["sip_xirr"]));
  } else if (returns.xirr < 0) {
    insights.push(createInsight("weakness", `Negative ${returns.xirr.toFixed(1)}% XIRR - investment underwater despite dividends`, 1, ["sip_xirr"]));
  }
  
  // Dividend contribution
  if (returns.dividendContribution > 30) {
    insights.push(createInsight("strength", `Dividends contributed ${returns.dividendContribution.toFixed(0)}% of total returns - income strategy working`, 2, ["sip_div_contrib"]));
  }
  
  // Yield on cost
  if (yieldOnCost.current > 5) {
    insights.push(createInsight("strength", `High ${yieldOnCost.current.toFixed(1)}% yield on cost - original investment paying off`, 2, ["sip_yoc"]));
  }
  
  // DRIP
  if (sipDetails.dividendsReinvested) {
    insights.push(createInsight("observation", `DRIP enabled - dividends automatically reinvested for compounding`, 3));
  }
  
  // Projection
  if (yieldOnCost.projected5Y > yieldOnCost.current * 1.5) {
    insights.push(createInsight("opportunity", `Projected YoC to grow to ${yieldOnCost.projected5Y.toFixed(1)}% in 5 years with dividend growth`, 2, ["sip_yoc_5y"]));
  }
  
  const headline = `${symbol} SIP: ${returns.xirr.toFixed(1)}% XIRR with ${yieldOnCost.current.toFixed(1)}% yield on cost over ${sipDetails.tenure} months`;
  
  return {
    cardId: "dividend-sip-tracker",
    cardCategory: "income",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: sipDetails.tenure >= 24 ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["dividend-crystal-ball", "income-stability", "fcf-health"],
    tags: ["dividend", "sip", "income", sipDetails.dividendsReinvested ? "drip" : "payout"],
    scoreContribution: {
      category: "quality",
      score: Math.min(100, Math.max(0, 50 + returns.xirr * 2)),
      weight: 0.10,
    },
  };
}

interface Props {
  data?: DividendSIPTrackerData;
  isLoading?: boolean;
  error?: string | null;
}

export default function DividendSIPTrackerCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['income'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Dividend SIP Tracker
            </CardTitle>
          <CardDescription>Tracking systematic investment…</CardDescription>
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
          <CardTitle>Dividend SIP Tracker</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Dividend SIP Tracker</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const metrics = [
    { label: "Total Invested", value: `₹${(data.sipDetails.totalInvested / 100).toFixed(1)}L` },
    { label: "Current Value", value: `₹${(data.sipDetails.currentValue / 100).toFixed(1)}L`, trend: data.sipDetails.currentValue > data.sipDetails.totalInvested ? "up" as const : "down" as const },
    { label: "Dividends", value: `₹${(data.sipDetails.dividendsReceived / 100).toFixed(1)}L` },
    { label: "XIRR", value: `${data.returns.xirr.toFixed(1)}%`, trend: data.returns.xirr > 12 ? "up" as const : "neutral" as const },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Dividend SIP Tracker
              <Badge variant={data.sipDetails.dividendsReinvested ? "success" : "secondary"}>
                {data.sipDetails.dividendsReinvested ? "DRIP Enabled" : "Cash Dividends"}
              </Badge>
            </CardTitle>
            <CardDescription>
              {data.symbol} • ₹{data.sipDetails.monthlyAmount.toLocaleString()}/month × {data.sipDetails.tenure} months • As of {data.asOf}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${data.returns.absoluteReturn >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {data.returns.absoluteReturn >= 0 ? "+" : ""}{data.returns.absoluteReturn.toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-500">Total Return</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        {/* DRIP vs Non-DRIP Projection */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">DRIP vs Cash Dividends Projection</div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.projection} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="dripGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="noDripGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} tickFormatter={(v) => `₹${(v/100).toFixed(0)}L`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: number, name: string) => [`₹${(value/100).toFixed(1)}L`, name === "valueWithDRIP" ? "With DRIP" : name === "valueWithoutDRIP" ? "Without DRIP" : "Invested"]}
                />
                <Area type="monotone" dataKey="valueWithDRIP" stroke="#10b981" fill="url(#dripGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="valueWithoutDRIP" stroke="#3b82f6" fill="url(#noDripGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="invested" stroke="#64748b" fill="none" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-1">
            <span className="text-[10px] flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-500" /> With DRIP</span>
            <span className="text-[10px] flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-blue-500" /> Without DRIP</span>
            <span className="text-[10px] flex items-center gap-1 text-slate-400"><span className="w-2 h-0.5 bg-slate-500" /> Invested</span>
          </div>
        </div>

        {/* Return Attribution */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className="text-lg font-bold text-emerald-400">{data.returns.xirr.toFixed(1)}%</div>
            <div className="text-[9px] text-slate-500">XIRR</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className="text-lg font-bold text-purple-400">{data.returns.dividendContribution.toFixed(0)}%</div>
            <div className="text-[9px] text-slate-500">Dividend Contribution</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className="text-lg font-bold text-blue-400">{data.yieldOnCost.current.toFixed(1)}%</div>
            <div className="text-[9px] text-slate-500">Yield on Cost</div>
          </div>
        </div>

        {/* Dividend History */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Recent Dividend History</div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {data.dividendHistory.slice(0, 5).map((div, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-slate-800/30 rounded px-2 py-1">
                <span className="text-slate-400">{div.date}</span>
                <span className="text-emerald-400">₹{div.amount.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500">{div.yieldOnCost.toFixed(2)}% YOC</span>
              </div>
            ))}
          </div>
        </div>

        {/* Yield on Cost Projection */}
        <div className="flex items-center justify-between bg-emerald-900/20 border border-emerald-800/30 rounded p-2">
          <span className="text-[10px] text-emerald-400">Projected Yield on Cost (5Y)</span>
          <span className="text-sm font-semibold text-emerald-400">{data.yieldOnCost.projected5Y.toFixed(1)}%</span>
        </div>

        <InterpretationFooter variant={data.returns.xirr >= 12 ? "success" : data.returns.xirr >= 8 ? "info" : "warning"}>
          SIP of ₹{data.sipDetails.monthlyAmount.toLocaleString()}/month over {data.sipDetails.tenure} months has generated {data.returns.xirr.toFixed(1)}% XIRR with dividends contributing {data.returns.dividendContribution.toFixed(0)}% of total returns.
          {data.sipDetails.dividendsReinvested 
            ? ` DRIP is compounding your yield on cost to ${data.yieldOnCost.projected5Y.toFixed(1)}% in 5 years.`
            : " Consider enabling DRIP to accelerate compounding through dividend reinvestment."
          }
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
