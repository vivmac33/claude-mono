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
import { ScoreGauge } from "@/components/shared/ScoreGauge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface BankruptcyHealthData {
  symbol: string;
  asOf: string;
  altmanZScore: number;
  zone: "Safe" | "Grey" | "Distress";
  probability: number;
  components: {
    workingCapitalRatio: number;
    retainedEarningsRatio: number;
    ebitRatio: number;
    marketValueRatio: number;
    salesRatio: number;
  };
  historicalZ: Array<{
    period: string;
    zScore: number;
  }>;
  peerComparison: Array<{
    symbol: string;
    zScore: number;
    zone: string;
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getBankruptcyHealthOutput(data: BankruptcyHealthData): CardOutput {
  const { symbol, asOf, altmanZScore, zone, probability, components, historicalZ, peerComparison } = data;
  
  // INVERSE sentiment: low risk = bullish, high risk = bearish
  const sentiment = zone === "Safe" ? "bullish" : zone === "Distress" ? "bearish" : "neutral";
  const signalStrength = zone === "Safe" ? 5 : zone === "Grey" ? 3 : 1;
  
  // Calculate trend
  const recentZ = historicalZ.slice(-4);
  const zTrend = recentZ.length >= 2 ? recentZ[recentZ.length - 1].zScore - recentZ[0].zScore : 0;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Altman Z-Score", "bh_z_score", altmanZScore, 
      zone === "Safe" ? "safe" : zone === "Grey" ? "moderate" : "dangerous",
      { format: "number", priority: 1, trend: { direction: zTrend > 0 ? "up" : zTrend < 0 ? "down" : "flat", period: "Recent" } }),
    createMetric("Bankruptcy Probability", "bh_probability", probability, 
      probability < 5 ? "safe" : probability < 20 ? "moderate" : "dangerous",
      { format: "percent", priority: 1 }),
    createMetric("Working Capital/TA", "bh_wc_ratio", components.workingCapitalRatio * 100, 
      components.workingCapitalRatio > 0.2 ? "good" : components.workingCapitalRatio > 0 ? "fair" : "poor",
      { format: "percent", priority: 2 }),
    createMetric("Retained Earnings/TA", "bh_re_ratio", components.retainedEarningsRatio * 100, 
      components.retainedEarningsRatio > 0.3 ? "good" : components.retainedEarningsRatio > 0 ? "fair" : "poor",
      { format: "percent", priority: 2 }),
    createMetric("EBIT/TA", "bh_ebit_ratio", components.ebitRatio * 100, 
      components.ebitRatio > 0.1 ? "good" : components.ebitRatio > 0 ? "fair" : "poor",
      { format: "percent", priority: 2 }),
    createMetric("Market Value/TL", "bh_mv_ratio", components.marketValueRatio, 
      components.marketValueRatio > 1 ? "good" : components.marketValueRatio > 0.5 ? "fair" : "poor",
      { format: "ratio", priority: 3, unit: "x" }),
  ];
  
  const insights: Insight[] = [];
  
  // Zone assessment
  if (zone === "Safe") {
    insights.push(createInsight("strength", `Safe zone: Z-Score ${altmanZScore.toFixed(2)} (>2.99) indicates very low bankruptcy risk`, 1, ["bh_z_score"]));
  } else if (zone === "Distress") {
    insights.push(createInsight("risk", `Distress zone: Z-Score ${altmanZScore.toFixed(2)} (<1.81) indicates elevated bankruptcy risk`, 1, ["bh_z_score"]));
  } else {
    insights.push(createInsight("observation", `Grey zone: Z-Score ${altmanZScore.toFixed(2)} (1.81-2.99) - uncertain financial health`, 1, ["bh_z_score"]));
  }
  
  // Probability
  if (probability > 20) {
    insights.push(createInsight("risk", `${probability.toFixed(0)}% estimated bankruptcy probability - significant concern`, 1, ["bh_probability"]));
  }
  
  // Trend
  if (zTrend > 0.5) {
    insights.push(createInsight("opportunity", `Z-Score improving - financial health strengthening`, 2, ["bh_z_score"]));
  } else if (zTrend < -0.5) {
    insights.push(createInsight("risk", `Z-Score declining - financial health deteriorating`, 2, ["bh_z_score"]));
  }
  
  // Component weaknesses
  if (components.workingCapitalRatio < 0) {
    insights.push(createInsight("weakness", `Negative working capital ratio indicates liquidity stress`, 2, ["bh_wc_ratio"]));
  }
  if (components.retainedEarningsRatio < 0) {
    insights.push(createInsight("weakness", `Negative retained earnings - accumulated losses`, 2, ["bh_re_ratio"]));
  }
  
  // Peer comparison
  const betterThanPeers = peerComparison.filter(p => altmanZScore > p.zScore).length;
  const totalPeers = peerComparison.length;
  if (totalPeers > 0 && betterThanPeers / totalPeers > 0.7) {
    insights.push(createInsight("strength", `Healthier than ${betterThanPeers} of ${totalPeers} peers`, 3));
  }
  
  const headline = `${symbol} in ${zone.toLowerCase()} zone with Z-Score ${altmanZScore.toFixed(2)} and ${probability.toFixed(0)}% bankruptcy probability`;
  
  return {
    cardId: "bankruptcy-health",
    cardCategory: "risk",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: zone === "Distress"
      ? ["financial-stress-radar", "leverage-history", "working-capital-health"]
      : ["piotroski-score", "financial-health-dna", "valuation-summary"],
    tags: ["altman-z", "bankruptcy", zone.toLowerCase()],
    scoreContribution: {
      category: "risk",
      score: zone === "Safe" ? 85 : zone === "Grey" ? 50 : 15, // Zone-based score
      weight: 0.20,
    },
  };
}

interface Props {
  data?: BankruptcyHealthData;
  isLoading?: boolean;
  error?: string | null;
}

export default function BankruptcyHealthCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['risk'];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Bankruptcy Health
            </CardTitle>
          <CardDescription>Calculating Altman Z-Score…</CardDescription>
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
      <Card>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Bankruptcy Health</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Bankruptcy Health</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const metrics = [
    { label: "Altman Z-Score", value: data.altmanZScore.toFixed(2) },
    { label: "Default Prob.", value: `${data.probability.toFixed(1)}%`, trend: data.probability < 10 ? "up" as const : "down" as const },
    { label: "Zone", value: data.zone },
    { label: "WC/Assets", value: `${(data.components.workingCapitalRatio * 100).toFixed(1)}%` },
  ];

  const zoneColor = data.zone === "Safe" ? "success" : data.zone === "Grey" ? "secondary" : "destructive";

  return (
    <Card>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Bankruptcy Health
              <Badge variant={zoneColor}>{data.zone} Zone</Badge>
            </CardTitle>
            <CardDescription>
              {data.symbol} • Altman Z-Score analysis • As of {data.asOf}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${data.zone === "Safe" ? "text-emerald-400" : data.zone === "Grey" ? "text-amber-400" : "text-red-400"}`}>
              {data.altmanZScore.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-500">Z-Score</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        {/* Z-Score Zones Visual */}
        <div className="relative">
          <div className="text-[10px] uppercase text-slate-500 mb-2">Z-Score Position</div>
          <div className="h-8 rounded-lg overflow-hidden flex">
            <div className="bg-red-900/50 flex-1 relative">
              <span className="absolute inset-0 flex items-center justify-center text-[9px] text-red-300">Distress (&lt;1.8)</span>
            </div>
            <div className="bg-amber-900/50 flex-1 relative">
              <span className="absolute inset-0 flex items-center justify-center text-[9px] text-amber-300">Grey (1.8-3.0)</span>
            </div>
            <div className="bg-emerald-900/50 flex-1 relative">
              <span className="absolute inset-0 flex items-center justify-center text-[9px] text-emerald-300">Safe (&gt;3.0)</span>
            </div>
          </div>
          {/* Indicator */}
          <div 
            className="absolute top-6 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white"
            style={{ left: `${Math.min(100, Math.max(0, (data.altmanZScore / 5) * 100))}%`, transform: 'translateX(-50%)' }}
          />
        </div>

        {/* Historical Z-Score */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Historical Z-Score Trend</div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.historicalZ} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <ReferenceArea y1={0} y2={1.8} fill="#ef4444" fillOpacity={0.1} />
                <ReferenceArea y1={1.8} y2={3} fill="#f59e0b" fillOpacity={0.1} />
                <ReferenceArea y1={3} y2={10} fill="#10b981" fillOpacity={0.1} />
                <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#334155" }} tickLine={false} domain={[0, 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: number) => [value.toFixed(2), "Z-Score"]}
                />
                <ReferenceLine y={1.8} stroke="#ef4444" strokeDasharray="3 3" />
                <ReferenceLine y={3} stroke="#10b981" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="zScore" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Z-Score Components */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Score Components (Weighted)</div>
          <div className="space-y-1">
            {[
              { label: "Working Capital / Assets", value: data.components.workingCapitalRatio, weight: 1.2 },
              { label: "Retained Earnings / Assets", value: data.components.retainedEarningsRatio, weight: 1.4 },
              { label: "EBIT / Assets", value: data.components.ebitRatio, weight: 3.3 },
              { label: "Market Cap / Liabilities", value: data.components.marketValueRatio, weight: 0.6 },
              { label: "Sales / Assets", value: data.components.salesRatio, weight: 1.0 },
            ].map((comp) => (
              <div key={comp.label} className="flex items-center gap-2">
                <div className="w-32 text-[9px] text-slate-500 truncate">{comp.label}</div>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${Math.min(100, Math.abs(comp.value) * 100)}%` }}
                  />
                </div>
                <div className="w-16 text-right text-[10px] text-slate-400">
                  {(comp.value * comp.weight).toFixed(2)} ({comp.weight}x)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peer Comparison */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {data.peerComparison.map((peer) => (
            <div key={peer.symbol} className={`flex-shrink-0 rounded px-2 py-1 text-center ${
              peer.zone === "Safe" ? "bg-emerald-900/30" : peer.zone === "Grey" ? "bg-amber-900/30" : "bg-red-900/30"
            }`}>
              <div className="text-[9px] text-slate-400">{peer.symbol}</div>
              <div className={`text-xs font-semibold ${
                peer.zone === "Safe" ? "text-emerald-400" : peer.zone === "Grey" ? "text-amber-400" : "text-red-400"
              }`}>
                {peer.zScore.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <InterpretationFooter variant={data.zone === "Safe" ? "success" : data.zone === "Grey" ? "info" : "warning"}>
          Altman Z-Score of {data.altmanZScore.toFixed(2)} places the company in the {data.zone.toLowerCase()} zone with a {data.probability.toFixed(1)}% implied default probability.
          {data.zone === "Safe" 
            ? " Financial health metrics indicate low bankruptcy risk. "
            : data.zone === "Grey"
            ? " The company is in the uncertainty zone—monitor leverage and liquidity closely. "
            : " Elevated distress indicators warrant immediate attention to debt restructuring and liquidity management. "
          }
          {data.components.ebitRatio < 0.1 && "Low operating profitability is the primary concern."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
