import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricStrip } from "@/components/shared/MetricBox";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface VolatilityRegimeData {
  symbol: string;
  asOf: string;
  regime: "Low" | "Normal" | "High" | "Extreme";
  atr: { value: number; percentile: number };
  bollingerWidth: { value: number; squeeze: boolean };
  historical: Array<{ date: string; atr: number; bbWidth: number; price: number }>;
  alerts: Array<{ type: string; message: string }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getVolatilityRegimeOutput(data: VolatilityRegimeData): CardOutput {
  const { symbol, asOf, regime, atr, bollingerWidth, alerts } = data;
  
  // Low volatility is generally bullish (calm conditions), high/extreme is bearish (risky)
  const sentiment = regime === "Low" ? "bullish" : regime === "Extreme" ? "bearish" : "neutral";
  const signalStrength = regime === "Extreme" || (regime === "Low" && bollingerWidth.squeeze) ? 4 : 3;
  
  const keyMetrics: MetricValue[] = [
    createMetric("ATR (14)", "vr_atr", atr.value, 
      regime === "Low" ? "safe" : regime === "Extreme" ? "risky" : "neutral",
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("ATR Percentile", "vr_atr_pctl", atr.percentile, 
      atr.percentile < 25 ? "safe" : atr.percentile > 75 ? "risky" : "neutral",
      { format: "percentile", priority: 1 }),
    createMetric("Bollinger Width", "vr_bb_width", bollingerWidth.value, 
      bollingerWidth.squeeze ? "opportunity" : "neutral",
      { format: "number", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // Regime insight
  if (regime === "Extreme") {
    insights.push(createInsight("risk", `Extreme volatility: ATR at ${atr.percentile}th percentile - reduce position sizes`, 1, ["vr_atr_pctl"]));
  } else if (regime === "Low") {
    insights.push(createInsight("strength", `Low volatility environment: ATR at ${atr.percentile}th percentile`, 2, ["vr_atr_pctl"]));
  } else if (regime === "High") {
    insights.push(createInsight("observation", `Elevated volatility: ATR at ${atr.percentile}th percentile`, 2, ["vr_atr_pctl"]));
  }
  
  // Squeeze
  if (bollingerWidth.squeeze) {
    insights.push(createInsight("opportunity", "Bollinger Band squeeze detected - potential breakout imminent", 1, ["vr_bb_width"]));
  }
  
  // Alerts
  alerts.slice(0, 2).forEach(alert => {
    insights.push(createInsight("observation", alert.message, 3));
  });
  
  const headline = `${symbol} ${regime.toLowerCase()} volatility: ATR ₹${atr.value.toFixed(1)} (${atr.percentile}th pctl)${bollingerWidth.squeeze ? " - SQUEEZE" : ""}`;
  
  return {
    cardId: "volatility-regime",
    cardCategory: "technical",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["market-regime-radar", "macro-pulse", "trend-strength"],
    tags: ["volatility", regime.toLowerCase(), bollingerWidth.squeeze ? "squeeze" : "no-squeeze"],
    scoreContribution: {
      category: "momentum",
      score: regime === "Low" ? 70 : regime === "Normal" ? 50 : regime === "High" ? 35 : 20,
      weight: 0.10,
    },
  };
}

interface Props { data?: VolatilityRegimeData; isLoading?: boolean; error?: string | null; }

export default function VolatilityRegimeCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  if (isLoading) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Volatility Regime
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Volatility Regime</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Volatility Regime</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  const regimeColor = data.regime === "Low" ? "success" : data.regime === "Extreme" ? "destructive" : "secondary";
  const metrics = [
    { label: "ATR(14)", value: `₹${data.atr.value.toFixed(1)}` },
    { label: "ATR Pctl", value: `${Math.round(data.atr.percentile)}%` },
    { label: "BB Width", value: data.bollingerWidth.value.toFixed(2) },
    { label: "Squeeze", value: data.bollingerWidth.squeeze ? "Yes" : "No" },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">Volatility Regime
              <Badge variant={regimeColor}>{data.regime} Vol</Badge>
              {data.bollingerWidth.squeeze && <Badge variant="warning">Squeeze</Badge>}
            </CardTitle>
            <CardDescription>{data.symbol} • Volatility analysis • {data.asOf}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">ATR & Bollinger Width History</div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.historical.slice(-30)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="atrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }} />
                <Area type="monotone" dataKey="atr" stroke="#f59e0b" fill="url(#atrGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        {data.alerts.length > 0 && (
          <div className="space-y-1">
            {data.alerts.map((alert, i) => (
              <div key={i} className="flex items-center gap-2 text-xs bg-amber-900/20 border border-amber-800/30 rounded px-2 py-1">
                <span className="text-amber-400">⚡</span>
                <span className="text-slate-300">{alert.message}</span>
              </div>
            ))}
          </div>
        )}
        <InterpretationFooter variant={data.bollingerWidth.squeeze ? "warning" : "info"}>
          {data.regime} volatility regime with ATR at {data.atr.percentile}th percentile. {data.bollingerWidth.squeeze ? "Bollinger squeeze detected—expect breakout move." : "Normal volatility conditions."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
