import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from "recharts";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface PeerComparisonData {
  symbol: string;
  asOf: string;
  rank: { overall: number; total: number; percentile: number };
  peers: Array<{ symbol: string; name: string; mcap: number; pe: number; roe: number; growth: number; score: number }>;
  companyMetrics: { pe: number; pb: number; roe: number; growth: number; margin: number; debtEquity: number };
  radarData: Array<{ metric: string; company: number; peerAvg: number }>;
  strengths: string[];
  weaknesses: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getPeerComparisonOutput(data: PeerComparisonData): CardOutput {
  const { symbol, asOf, rank, companyMetrics, strengths, weaknesses } = data;
  
  const sentiment = rank.percentile >= 70 ? "bullish" : rank.percentile <= 30 ? "bearish" : "neutral";
  const signalStrength = rank.percentile >= 80 ? 5 : rank.percentile >= 60 ? 4 : rank.percentile >= 40 ? 3 : 2;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Peer Rank", "pc_rank", rank.overall, 
      rank.percentile >= 75 ? "excellent" : rank.percentile >= 50 ? "good" : "fair",
      { format: "number", priority: 1 }),
    createMetric("Percentile", "pc_pctl", rank.percentile, 
      rank.percentile >= 75 ? "excellent" : rank.percentile >= 50 ? "good" : "fair",
      { format: "percentile", priority: 1 }),
    createMetric("P/E Ratio", "pc_pe", companyMetrics.pe, 
      companyMetrics.pe < 15 ? "excellent" : companyMetrics.pe < 25 ? "good" : "fair",
      { format: "ratio", priority: 1, unit: "x" }),
    createMetric("ROE", "pc_roe", companyMetrics.roe, 
      companyMetrics.roe > 20 ? "excellent" : companyMetrics.roe > 12 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("Growth", "pc_growth", companyMetrics.growth, 
      companyMetrics.growth > 15 ? "excellent" : companyMetrics.growth > 8 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Margin", "pc_margin", companyMetrics.margin, 
      companyMetrics.margin > 15 ? "excellent" : companyMetrics.margin > 8 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("D/E Ratio", "pc_de", companyMetrics.debtEquity, 
      companyMetrics.debtEquity < 0.5 ? "excellent" : companyMetrics.debtEquity < 1 ? "good" : "fair",
      { format: "ratio", priority: 2, unit: "x" }),
  ];
  
  const insights: Insight[] = [];
  
  // Rank insight
  if (rank.percentile >= 75) {
    insights.push(createInsight("strength", `Top quartile: rank #${rank.overall} of ${rank.total} peers (${rank.percentile}th percentile)`, 1, ["pc_rank", "pc_pctl"]));
  } else if (rank.percentile <= 25) {
    insights.push(createInsight("weakness", `Bottom quartile: rank #${rank.overall} of ${rank.total} peers`, 1, ["pc_rank"]));
  }
  
  // Strengths
  strengths.slice(0, 2).forEach(s => {
    insights.push(createInsight("strength", s, 2));
  });
  
  // Weaknesses
  weaknesses.slice(0, 2).forEach(w => {
    insights.push(createInsight("weakness", w, 2));
  });
  
  const headline = `${symbol} ranks #${rank.overall}/${rank.total} (${rank.percentile}th pctl) vs peers: ROE ${companyMetrics.roe.toFixed(1)}%, P/E ${companyMetrics.pe.toFixed(1)}x`;
  
  return {
    cardId: "peer-comparison",
    cardCategory: "portfolio",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: rank.total >= 5 ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["valuation-summary", "multi-factor-scorecard", "financial-health-dna"],
    tags: ["peer-comparison", rank.percentile >= 75 ? "outperformer" : rank.percentile <= 25 ? "underperformer" : "average"],
    scoreContribution: {
      category: "value",
      score: rank.percentile,
      weight: 0.10,
    },
  };
}

interface Props { data?: PeerComparisonData; isLoading?: boolean; error?: string | null; }

export default function PeerComparisonCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['portfolio'];

  if (isLoading) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Peer Comparison
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Peer Comparison</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Peer Comparison</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">Peer Comparison
              <Badge variant={data.rank.percentile >= 75 ? "success" : data.rank.percentile >= 50 ? "secondary" : "destructive"}>Rank #{data.rank.overall}</Badge>
            </CardTitle>
            <CardDescription>{data.symbol} vs peers • {data.asOf}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-100">{Math.round(data.rank.percentile)}%</div>
            <div className="text-[10px] text-slate-500">Percentile</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data.radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 9 }} />
              <Radar name="Company" dataKey="company" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
              <Radar name="Peer Avg" dataKey="peerAvg" stroke="#64748b" fill="none" strokeDasharray="4 4" strokeWidth={1} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Peer Ranking</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {data.peers.slice(0, 5).map((peer, i) => (
              <div key={peer.symbol} className={`flex items-center justify-between text-xs rounded px-2 py-1 ${peer.symbol === data.symbol ? "bg-blue-900/30 border border-blue-800/30" : "bg-slate-800/30"}`}>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-4">{i + 1}.</span>
                  <span className={peer.symbol === data.symbol ? "text-blue-400 font-medium" : "text-slate-300"}>{peer.symbol}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span>PE: {peer.pe.toFixed(1)}</span>
                  <span>ROE: {peer.roe.toFixed(0)}%</span>
                  <span className={`font-medium ${peer.score >= 70 ? "text-emerald-400" : "text-slate-300"}`}>{peer.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded bg-emerald-900/20 border border-emerald-800/30 p-2">
            <div className="text-[9px] text-emerald-400 uppercase mb-1">Strengths</div>
            {data.strengths.slice(0, 2).map((s, i) => <div key={i} className="text-[10px] text-slate-300">• {s}</div>)}
          </div>
          <div className="rounded bg-red-900/20 border border-red-800/30 p-2">
            <div className="text-[9px] text-red-400 uppercase mb-1">Weaknesses</div>
            {data.weaknesses.slice(0, 2).map((w, i) => <div key={i} className="text-[10px] text-slate-300">• {w}</div>)}
          </div>
        </div>
        <InterpretationFooter variant={data.rank.percentile >= 75 ? "success" : data.rank.percentile >= 50 ? "info" : "warning"}>
          Ranks #{data.rank.overall} of {data.rank.total} peers ({data.rank.percentile}th percentile). {data.strengths[0]} while {data.weaknesses[0]?.toLowerCase()}.
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
