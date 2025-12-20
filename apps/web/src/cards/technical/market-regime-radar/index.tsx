import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface MarketRegimeRadarData {
  symbol: string;
  asOf: string;
  regime: "Bull" | "Bear" | "Sideways" | "Volatile" | "Transitioning";
  confidence: number;
  factors: Array<{ factor: string; value: number; weight: number; signal: "bullish" | "bearish" | "neutral" }>;
  radarData: Array<{ factor: string; score: number; fullMark: number }>;
  recommendation: { action: string; strategy: string; timeframe: string };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getMarketRegimeRadarOutput(data: MarketRegimeRadarData): CardOutput {
  const { symbol, asOf, regime, confidence, factors, recommendation } = data;
  
  const sentiment = regime === "Bull" ? "bullish" : regime === "Bear" ? "bearish" : "neutral";
  const signalStrength = confidence > 80 ? 5 : confidence > 60 ? 4 : confidence > 40 ? 3 : 2;
  
  const bullishFactors = factors.filter(f => f.signal === "bullish").length;
  const bearishFactors = factors.filter(f => f.signal === "bearish").length;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Confidence", "mrr_confidence", confidence, 
      confidence > 75 ? "excellent" : confidence > 50 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("Bullish Factors", "mrr_bullish", bullishFactors, 
      bullishFactors > factors.length / 2 ? "good" : "neutral",
      { format: "number", priority: 1 }),
    createMetric("Bearish Factors", "mrr_bearish", bearishFactors, 
      bearishFactors > factors.length / 2 ? "poor" : "neutral",
      { format: "number", priority: 2 }),
  ];
  
  // Add top factor metrics
  factors.slice(0, 4).forEach(f => {
    keyMetrics.push(createMetric(f.factor, `mrr_${f.factor.toLowerCase().replace(" ", "_")}`, f.value, 
      f.signal === "bullish" ? "good" : f.signal === "bearish" ? "poor" : "neutral",
      { format: "number", priority: 2 }));
  });
  
  const insights: Insight[] = [];
  
  // Regime insight
  if (regime === "Bull") {
    insights.push(createInsight("strength", `Bull market regime with ${confidence}% confidence`, 1, ["mrr_confidence"]));
  } else if (regime === "Bear") {
    insights.push(createInsight("weakness", `Bear market regime with ${confidence}% confidence`, 1, ["mrr_confidence"]));
  } else if (regime === "Volatile") {
    insights.push(createInsight("observation", `Volatile regime - elevated risk environment`, 1, ["mrr_confidence"]));
  } else if (regime === "Transitioning") {
    insights.push(createInsight("observation", `Market regime transitioning - watch for confirmation`, 1));
  }
  
  // Recommendation
  insights.push(createInsight("action", `Recommended: ${recommendation.action} - ${recommendation.strategy}`, 2));
  
  // Factor consensus
  if (bullishFactors > bearishFactors + 2) {
    insights.push(createInsight("strength", `${bullishFactors}/${factors.length} factors bullish - strong consensus`, 2, ["mrr_bullish"]));
  } else if (bearishFactors > bullishFactors + 2) {
    insights.push(createInsight("weakness", `${bearishFactors}/${factors.length} factors bearish`, 2, ["mrr_bearish"]));
  }
  
  const headline = `${symbol} ${regime.toLowerCase()} regime: ${confidence}% confidence (${bullishFactors} bullish, ${bearishFactors} bearish factors)`;
  
  return {
    cardId: "market-regime-radar",
    cardCategory: "technical",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: confidence > 70 ? "high" : confidence > 50 ? "medium" : "low",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["macro-pulse", "volatility-regime", "trend-strength"],
    tags: ["regime", regime.toLowerCase()],
    scoreContribution: {
      category: "momentum",
      score: regime === "Bull" ? 75 : regime === "Bear" ? 25 : 50,
      weight: 0.15,
    },
  };
}

interface Props { data?: MarketRegimeRadarData; isLoading?: boolean; error?: string | null; }

export default function MarketRegimeRadarCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  if (isLoading) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Market Regime Radar
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Market Regime Radar</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Market Regime Radar</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  const regimeColor = data.regime === "Bull" ? "success" : data.regime === "Bear" ? "destructive" : "secondary";
  const signalColor = (s: string) => s === "bullish" ? "text-emerald-400" : s === "bearish" ? "text-red-400" : "text-slate-400";

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">Market Regime Radar
              <Badge variant={regimeColor}>{data.regime}</Badge>
            </CardTitle>
            <CardDescription>{data.symbol} • Multi-factor regime • {data.asOf}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-100">{Math.round(data.confidence)}%</div>
            <div className="text-[10px] text-slate-500">Confidence</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data.radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="factor" tick={{ fill: "#94a3b8", fontSize: 9 }} />
              <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1">
          {data.factors.map((f) => (
            <div key={f.factor} className="flex items-center justify-between text-xs bg-slate-800/30 rounded px-2 py-1">
              <span className="text-slate-300">{f.factor}</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">{f.value.toFixed(0)} ({f.weight}x)</span>
                <span className={`font-medium ${signalColor(f.signal)}`}>{f.signal}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded bg-blue-900/20 border border-blue-800/30 p-2">
          <div className="text-[9px] text-blue-400 uppercase">Recommendation</div>
          <div className="text-sm font-semibold text-slate-200">{data.recommendation.action}</div>
          <div className="text-xs text-slate-400">{data.recommendation.strategy} • {data.recommendation.timeframe}</div>
        </div>
        <InterpretationFooter variant={data.regime === "Bull" ? "success" : data.regime === "Bear" ? "warning" : "info"}>
          {data.regime} regime detected with {Math.round(data.confidence)}% confidence. {data.recommendation.strategy} strategy recommended for {data.recommendation.timeframe} timeframe.
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
