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

export interface MacroPulseData {
  asOf: string;
  regime: "Risk On" | "Risk Off" | "Neutral" | "Transitioning";
  indicators: Array<{ name: string; value: number; trend: "up" | "down" | "flat"; status: "positive" | "negative" | "neutral" }>;
  radarData: Array<{ indicator: string; value: number; fullMark: number }>;
  globalMarkets: { us: number; europe: number; asia: number; india: number };
  riskMetrics: { vix: number; dollarIndex: number; goldPrice: number; oilPrice: number };
  // NEW: Pre-Market Scanner Data
  preMarket?: {
    sgxNifty: { value: number; change: number; changePct: number };
    giftNifty: { value: number; change: number; changePct: number };
    globalSummary: {
      dowFutures: number;
      nasdaqFutures: number;
      sp500Futures: number;
      ftse: number;
      dax: number;
      hangseng: number;
      nikkei: number;
    };
    gapProbability: {
      direction: 'Gap Up' | 'Gap Down' | 'Flat Open';
      probability: number; // 0-100
      expectedGap: number; // In points
      expectedGapPct: number; // In %
    };
    keyEvents: string[]; // Today's key events
    lastUpdated: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getMacroPulseOutput(data: MacroPulseData): CardOutput {
  const { asOf, regime, indicators, globalMarkets, riskMetrics } = data;
  
  const sentiment = regime === "Risk On" ? "bullish" : regime === "Risk Off" ? "bearish" : "neutral";
  const signalStrength = regime === "Risk On" ? 4 : regime === "Risk Off" ? 2 : 3;
  
  const positiveIndicators = indicators.filter(i => i.status === "positive").length;
  const negativeIndicators = indicators.filter(i => i.status === "negative").length;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Market Regime", "mp_regime", regime === "Risk On" ? 75 : regime === "Risk Off" ? 25 : 50, 
      regime === "Risk On" ? "excellent" : regime === "Risk Off" ? "poor" : "neutral",
      { format: "score", priority: 1 }),
    createMetric("VIX", "mp_vix", riskMetrics.vix, 
      riskMetrics.vix < 15 ? "excellent" : riskMetrics.vix < 20 ? "good" : riskMetrics.vix < 25 ? "fair" : "poor",
      { format: "number", priority: 1 }),
    createMetric("Dollar Index", "mp_dxy", riskMetrics.dollarIndex, "neutral", 
      { format: "number", priority: 2 }),
    createMetric("India Market", "mp_india", globalMarkets.india, 
      globalMarkets.india > 0 ? "good" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("US Market", "mp_us", globalMarkets.us, 
      globalMarkets.us > 0 ? "good" : "poor",
      { format: "percent", priority: 2 }),
    createMetric("Gold", "mp_gold", riskMetrics.goldPrice, "neutral", 
      { format: "currency", priority: 3, unit: "$" }),
    createMetric("Oil", "mp_oil", riskMetrics.oilPrice, "neutral", 
      { format: "currency", priority: 3, unit: "$" }),
  ];
  
  const insights: Insight[] = [];
  
  // Regime
  if (regime === "Risk On") {
    insights.push(createInsight("strength", "Risk-on environment - favorable for equities and risk assets", 1, ["mp_regime"]));
  } else if (regime === "Risk Off") {
    insights.push(createInsight("weakness", "Risk-off environment - defensive positioning recommended", 1, ["mp_regime"]));
  } else if (regime === "Transitioning") {
    insights.push(createInsight("observation", "Market regime transitioning - watch for directional confirmation", 1, ["mp_regime"]));
  }
  
  // VIX
  if (riskMetrics.vix > 25) {
    insights.push(createInsight("risk", `Elevated VIX at ${riskMetrics.vix.toFixed(1)} - high market fear`, 2, ["mp_vix"]));
  } else if (riskMetrics.vix < 15) {
    insights.push(createInsight("observation", `Low VIX at ${riskMetrics.vix.toFixed(1)} - complacency may precede volatility`, 2, ["mp_vix"]));
  }
  
  // Global markets
  const avgGlobal = (globalMarkets.us + globalMarkets.europe + globalMarkets.asia) / 3;
  if (avgGlobal > 0.5) {
    insights.push(createInsight("strength", "Global markets trending positive - supportive backdrop", 2, ["mp_us"]));
  } else if (avgGlobal < -0.5) {
    insights.push(createInsight("weakness", "Global markets under pressure - risk of contagion", 2, ["mp_us"]));
  }
  
  // Indicator balance
  if (positiveIndicators > negativeIndicators + 2) {
    insights.push(createInsight("strength", `${positiveIndicators}/${indicators.length} indicators positive`, 3));
  }
  
  const headline = `Macro ${regime}: VIX ${riskMetrics.vix.toFixed(1)}, India ${globalMarkets.india > 0 ? "+" : ""}${globalMarkets.india.toFixed(1)}%, US ${globalMarkets.us > 0 ? "+" : ""}${globalMarkets.us.toFixed(1)}%`;
  
  return {
    cardId: "macro-pulse",
    cardCategory: "macro",
    symbol: "MARKET",
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["market-regime-radar", "macro-calendar", "volatility-regime"],
    tags: ["macro", regime.toLowerCase().replace(" ", "-"), "global"],
    scoreContribution: {
      category: "momentum",
      score: regime === "Risk On" ? 75 : regime === "Risk Off" ? 25 : 50,
      weight: 0.10,
    },
  };
}

interface Props { data?: MacroPulseData; isLoading?: boolean; error?: string | null; }

export default function MacroPulseCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['macro'];

  if (isLoading) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Macro Pulse
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Macro Pulse</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Macro Pulse</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">Macro Pulse
              <Badge variant={data.regime === "Risk On" ? "success" : data.regime === "Risk Off" ? "destructive" : "secondary"}>{data.regime}</Badge>
            </CardTitle>
            <CardDescription>Global macro indicators • {data.asOf}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pre-Market Scanner Section */}
        {data.preMarket && (
          <div className="bg-indigo-500/10 rounded-lg p-3 border border-indigo-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-indigo-400">📡 Pre-Market Scanner</span>
              <span className="text-[9px] text-slate-500">{data.preMarket.lastUpdated}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="text-center">
                <div className={`text-lg font-bold ${data.preMarket.giftNifty.changePct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {data.preMarket.giftNifty.value.toLocaleString('en-IN')}
                </div>
                <div className={`text-xs ${data.preMarket.giftNifty.changePct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {data.preMarket.giftNifty.changePct >= 0 ? '+' : ''}{data.preMarket.giftNifty.changePct.toFixed(2)}%
                </div>
                <div className="text-[9px] text-slate-500">GIFT Nifty</div>
              </div>
              <div className="text-center">
                <div className={`text-sm font-semibold ${data.preMarket.gapProbability.direction === 'Gap Up' ? 'text-emerald-400' : data.preMarket.gapProbability.direction === 'Gap Down' ? 'text-red-400' : 'text-slate-400'}`}>
                  {data.preMarket.gapProbability.direction}
                </div>
                <div className="text-xs text-white">{data.preMarket.gapProbability.probability}% prob</div>
                <div className="text-[9px] text-slate-500">Expected: {data.preMarket.gapProbability.expectedGapPct >= 0 ? '+' : ''}{data.preMarket.gapProbability.expectedGapPct.toFixed(2)}%</div>
              </div>
              <div className="text-center">
                <div className={`text-sm font-semibold ${data.preMarket.globalSummary.sp500Futures >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {data.preMarket.globalSummary.sp500Futures >= 0 ? '+' : ''}{data.preMarket.globalSummary.sp500Futures.toFixed(2)}%
                </div>
                <div className="text-[9px] text-slate-500">S&P Futures</div>
              </div>
            </div>
            {data.preMarket.keyEvents.length > 0 && (
              <div className="text-[9px] text-slate-400 border-t border-slate-700 pt-1">
                📅 {data.preMarket.keyEvents.slice(0, 2).join(' • ')}
              </div>
            )}
          </div>
        )}
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data.radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="indicator" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Radar name="Macro" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "US", value: data.globalMarkets.us },
            { label: "Europe", value: data.globalMarkets.europe },
            { label: "Asia", value: data.globalMarkets.asia },
            { label: "India", value: data.globalMarkets.india },
          ].map((m) => (
            <div key={m.label} className="rounded bg-slate-800/50 p-2 text-center">
              <div className={`text-sm font-semibold ${m.value >= 0 ? "text-emerald-400" : "text-red-400"}`}>{m.value >= 0 ? "+" : ""}{m.value.toFixed(1)}%</div>
              <div className="text-[9px] text-slate-500">{m.label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className={`text-sm font-semibold ${data.riskMetrics.vix < 20 ? "text-emerald-400" : "text-amber-400"}`}>{data.riskMetrics.vix.toFixed(1)}</div>
            <div className="text-[9px] text-slate-500">VIX</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className="text-sm font-semibold text-slate-200">{data.riskMetrics.dollarIndex.toFixed(1)}</div>
            <div className="text-[9px] text-slate-500">DXY</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className="text-sm font-semibold text-amber-400">${data.riskMetrics.goldPrice.toFixed(0)}</div>
            <div className="text-[9px] text-slate-500">Gold</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className="text-sm font-semibold text-slate-200">${data.riskMetrics.oilPrice.toFixed(0)}</div>
            <div className="text-[9px] text-slate-500">Brent</div>
          </div>
        </div>
        <div className="space-y-1">
          {data.indicators.slice(0, 4).map((ind, i) => (
            <div key={i} className="flex items-center justify-between text-xs bg-slate-800/30 rounded px-2 py-1">
              <span className="text-slate-300">{ind.name}</span>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${ind.status === "positive" ? "text-emerald-400" : ind.status === "negative" ? "text-red-400" : "text-slate-400"}`}>{ind.value}</span>
                <span className={ind.trend === "up" ? "text-emerald-400" : ind.trend === "down" ? "text-red-400" : "text-slate-500"}>{ind.trend === "up" ? "↑" : ind.trend === "down" ? "↓" : "→"}</span>
              </div>
            </div>
          ))}
        </div>
        <InterpretationFooter variant={data.regime === "Risk On" ? "success" : data.regime === "Risk Off" ? "warning" : "info"}>
          Market regime is {data.regime.toLowerCase()} with VIX at {data.riskMetrics.vix.toFixed(1)}. {data.regime === "Risk On" ? "Favorable conditions for equity exposure." : data.regime === "Risk Off" ? "Consider defensive positioning and reduced leverage." : "Mixed signals suggest selective positioning."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
