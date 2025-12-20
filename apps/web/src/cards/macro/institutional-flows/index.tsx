import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricStrip } from "@/components/shared/MetricBox";
import { InterpretationFooter, SignalBox } from "@/components/shared/InterpretationFooter";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from "recharts";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface InstitutionalFlowsData {
  symbol: string;
  asOf: string;
  sentiment: "Strong Buy" | "Accumulating" | "Neutral" | "Distributing" | "Selling";
  netFlow: { fii: number; dii: number; total: number };
  dailyFlows: Array<{ date: string; fii: number; dii: number }>;
  monthlyTrend: Array<{ month: string; fii: number; dii: number }>;
  activity: { fiiDays: { buy: number; sell: number }; diiDays: { buy: number; sell: number } };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getInstitutionalFlowsOutput(data: InstitutionalFlowsData): CardOutput {
  const { symbol, asOf, sentiment: flowSentiment, netFlow, activity } = data;
  
  const isBullish = flowSentiment === "Strong Buy" || flowSentiment === "Accumulating";
  const isBearish = flowSentiment === "Distributing" || flowSentiment === "Selling";
  const sentiment = isBullish ? "bullish" : isBearish ? "bearish" : "neutral";
  const signalStrength = flowSentiment === "Strong Buy" ? 5 : flowSentiment === "Accumulating" ? 4 : flowSentiment === "Neutral" ? 3 : flowSentiment === "Distributing" ? 2 : 1;
  
  const fiiNetDays = activity.fiiDays.buy - activity.fiiDays.sell;
  const diiNetDays = activity.diiDays.buy - activity.diiDays.sell;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Total Net Flow", "if_total", netFlow.total, 
      netFlow.total > 500 ? "excellent" : netFlow.total > 0 ? "good" : netFlow.total > -500 ? "fair" : "poor",
      { format: "currency", priority: 1, unit: "₹Cr" }),
    createMetric("FII Net Flow", "if_fii", netFlow.fii, 
      netFlow.fii > 0 ? "good" : "poor",
      { format: "currency", priority: 1, unit: "₹Cr" }),
    createMetric("DII Net Flow", "if_dii", netFlow.dii, 
      netFlow.dii > 0 ? "good" : "fair",
      { format: "currency", priority: 1, unit: "₹Cr" }),
    createMetric("FII Buy Days", "if_fii_buy", activity.fiiDays.buy, "neutral", 
      { format: "number", priority: 2, unit: "days" }),
    createMetric("FII Sell Days", "if_fii_sell", activity.fiiDays.sell, "neutral", 
      { format: "number", priority: 2, unit: "days" }),
  ];
  
  const insights: Insight[] = [];
  
  // Overall sentiment
  if (flowSentiment === "Strong Buy") {
    insights.push(createInsight("strength", `Strong institutional buying with ₹${netFlow.total.toFixed(0)}Cr net inflow`, 1, ["if_total"]));
  } else if (flowSentiment === "Selling") {
    insights.push(createInsight("weakness", `Institutional selling pressure with ₹${Math.abs(netFlow.total).toFixed(0)}Cr net outflow`, 1, ["if_total"]));
  }
  
  // FII activity
  if (netFlow.fii > 200) {
    insights.push(createInsight("strength", `FIIs net buyers: ₹${netFlow.fii.toFixed(0)}Cr inflow`, 2, ["if_fii"]));
  } else if (netFlow.fii < -200) {
    insights.push(createInsight("weakness", `FIIs net sellers: ₹${Math.abs(netFlow.fii).toFixed(0)}Cr outflow`, 2, ["if_fii"]));
  }
  
  // DII support
  if (netFlow.dii > 100 && netFlow.fii < -100) {
    insights.push(createInsight("observation", `DIIs absorbing FII selling with ₹${netFlow.dii.toFixed(0)}Cr buying`, 2, ["if_dii"]));
  }
  
  // Consistency
  if (fiiNetDays > 3) {
    insights.push(createInsight("strength", `FIIs bought on ${fiiNetDays} more days than sold - consistent accumulation`, 3, ["if_fii_buy"]));
  }
  
  const headline = `${symbol} ${flowSentiment.toLowerCase()}: FII ₹${netFlow.fii > 0 ? "+" : ""}${netFlow.fii.toFixed(0)}Cr, DII ₹${netFlow.dii > 0 ? "+" : ""}${netFlow.dii.toFixed(0)}Cr`;
  
  return {
    cardId: "institutional-flows",
    cardCategory: "macro",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["shareholding-pattern", "delivery-analysis", "insider-trades"],
    tags: ["institutional", "fii", "dii", netFlow.total > 0 ? "inflow" : "outflow"],
    scoreContribution: {
      category: "momentum",
      score: Math.min(100, Math.max(0, 50 + (netFlow.total / 20))),
      weight: 0.10,
    },
  };
}

interface Props { data?: InstitutionalFlowsData; isLoading?: boolean; error?: string | null; }

export default function InstitutionalFlowsCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['macro'];

  if (isLoading) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Institutional Flows
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Institutional Flows</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Institutional Flows</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  const metrics = [
    { label: "FII Net", value: `₹${data.netFlow.fii.toFixed(0)}Cr`, trend: data.netFlow.fii > 0 ? "up" as const : "down" as const },
    { label: "DII Net", value: `₹${data.netFlow.dii.toFixed(0)}Cr`, trend: data.netFlow.dii > 0 ? "up" as const : "down" as const },
    { label: "Total Flow", value: `₹${data.netFlow.total.toFixed(0)}Cr` },
    { label: "Sentiment", value: data.sentiment },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">Institutional Flows
              <Badge variant={data.netFlow.total > 0 ? "success" : "destructive"}>{data.netFlow.total > 0 ? "Net Inflow" : "Net Outflow"}</Badge>
            </CardTitle>
            <CardDescription>{data.symbol} • FII/DII activity • {data.asOf}</CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${data.netFlow.total >= 0 ? "text-emerald-400" : "text-red-400"}`}>₹{Math.abs(data.netFlow.total).toFixed(0)}Cr</div>
            <div className="text-[10px] text-slate-500">Net {data.netFlow.total >= 0 ? "Inflow" : "Outflow"}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Daily Flow Trend</div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dailyFlows.slice(-10)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }} />
                <ReferenceLine y={0} stroke="#64748b" />
                <Bar dataKey="fii" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="dii" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded bg-blue-900/20 border border-blue-800/30 p-2">
            <div className="text-[9px] text-blue-400 uppercase">FII Activity</div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-emerald-400">{data.activity.fiiDays.buy} Buy Days</span>
              <span className="text-xs text-red-400">{data.activity.fiiDays.sell} Sell Days</span>
            </div>
          </div>
          <div className="rounded bg-emerald-900/20 border border-emerald-800/30 p-2">
            <div className="text-[9px] text-emerald-400 uppercase">DII Activity</div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-emerald-400">{data.activity.diiDays.buy} Buy Days</span>
              <span className="text-xs text-red-400">{data.activity.diiDays.sell} Sell Days</span>
            </div>
          </div>
        </div>
        <InterpretationFooter variant={data.netFlow.total > 0 ? "success" : data.netFlow.total < -100 ? "warning" : "info"}>
          {data.netFlow.fii > 0 ? `FII net buyers at ₹${data.netFlow.fii.toFixed(0)}Cr. ` : `FII net sellers at ₹${Math.abs(data.netFlow.fii).toFixed(0)}Cr. `}
          {data.netFlow.dii > 0 ? `DII providing support with ₹${data.netFlow.dii.toFixed(0)}Cr inflow.` : `DII also selling ₹${Math.abs(data.netFlow.dii).toFixed(0)}Cr.`}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
