import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricStrip } from "@/components/shared/MetricBox";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface PortfolioCorrelationData {
  asOf: string;
  diversificationScore: number;
  avgCorrelation: number;
  correlationMatrix: Array<{ symbol1: string; symbol2: string; correlation: number }>;
  holdings: Array<{ symbol: string; weight: number }>;
  clusters: Array<{ name: string; holdings: string[]; intraCorr: number }>;
  recommendations: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getPortfolioCorrelationOutput(data: PortfolioCorrelationData): CardOutput {
  const { asOf, diversificationScore, avgCorrelation, holdings, clusters, recommendations, correlationMatrix } = data;
  
  const isWellDiversified = diversificationScore >= 70;
  const sentiment = isWellDiversified ? "bullish" : diversificationScore < 50 ? "bearish" : "neutral";
  const signalStrength = diversificationScore >= 80 ? 5 : diversificationScore >= 60 ? 4 : diversificationScore >= 40 ? 3 : 2;
  
  const highCorrPairs = correlationMatrix.filter(c => c.correlation > 0.7);
  
  const keyMetrics: MetricValue[] = [
    createMetric("Diversification Score", "pc_divers", diversificationScore, 
      diversificationScore >= 70 ? "excellent" : diversificationScore >= 50 ? "good" : "fair",
      { format: "score", priority: 1 }),
    createMetric("Avg Correlation", "pc_avg_corr", avgCorrelation, 
      avgCorrelation < 0.3 ? "excellent" : avgCorrelation < 0.5 ? "good" : "fair",
      { format: "number", priority: 1 }),
    createMetric("Holdings Count", "pc_holdings", holdings.length, "neutral", 
      { format: "number", priority: 2 }),
    createMetric("Clusters", "pc_clusters", clusters.length, "neutral", 
      { format: "number", priority: 2 }),
    createMetric("High Corr Pairs", "pc_high_corr", highCorrPairs.length, 
      highCorrPairs.length === 0 ? "excellent" : highCorrPairs.length < 3 ? "fair" : "poor",
      { format: "number", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // Diversification
  if (isWellDiversified) {
    insights.push(createInsight("strength", `Well diversified portfolio (${diversificationScore}/100) with ${avgCorrelation.toFixed(2)} avg correlation`, 1, ["pc_divers", "pc_avg_corr"]));
  } else if (diversificationScore < 50) {
    insights.push(createInsight("weakness", `Concentrated portfolio (${diversificationScore}/100) - consider diversifying`, 1, ["pc_divers"]));
  }
  
  // High correlation pairs
  if (highCorrPairs.length > 0) {
    insights.push(createInsight("risk", `${highCorrPairs.length} high-correlation pair(s) (>0.7) - overlapping risk`, 2, ["pc_high_corr"]));
  }
  
  // Recommendations
  recommendations.slice(0, 2).forEach(r => {
    insights.push(createInsight("action", r, 3));
  });
  
  const headline = `Portfolio ${isWellDiversified ? "well diversified" : "concentrated"}: ${diversificationScore}/100 score, ${avgCorrelation.toFixed(2)} avg correlation`;
  
  return {
    cardId: "portfolio-correlation",
    cardCategory: "portfolio",
    symbol: "PORTFOLIO",
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["rebalance-optimizer", "portfolio-leaderboard", "risk-health-dashboard"],
    tags: ["correlation", "diversification", isWellDiversified ? "diversified" : "concentrated"],
    scoreContribution: {
      category: "risk",
      score: diversificationScore,
      weight: 0.10,
    },
  };
}

interface Props { data?: PortfolioCorrelationData; isLoading?: boolean; error?: string | null; }

export default function PortfolioCorrelationCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['portfolio'];

  if (isLoading) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Portfolio Correlation
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Portfolio Correlation</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Portfolio Correlation</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  const getCorrColor = (c: number) => c > 0.7 ? "bg-red-500" : c > 0.4 ? "bg-amber-500" : c > 0 ? "bg-emerald-500" : "bg-blue-500";
  const metrics = [
    { label: "Diversification", value: `${data.diversificationScore}/100` },
    { label: "Avg Correlation", value: data.avgCorrelation.toFixed(2) },
    { label: "Holdings", value: data.holdings.length.toString() },
    { label: "Clusters", value: data.clusters.length.toString() },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">Portfolio Correlation
              <Badge variant={data.diversificationScore >= 70 ? "success" : data.diversificationScore >= 50 ? "secondary" : "destructive"}>
                {data.diversificationScore >= 70 ? "Well Diversified" : data.diversificationScore >= 50 ? "Moderate" : "Concentrated"}
              </Badge>
            </CardTitle>
            <CardDescription>Correlation & diversification • {data.asOf}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Correlation Heatmap (Top Pairs)</div>
          <div className="grid grid-cols-4 gap-1">
            {data.correlationMatrix.slice(0, 8).map((pair, i) => (
              <div key={i} className={`rounded p-1.5 text-center ${getCorrColor(pair.correlation)}`}>
                <div className="text-[8px] text-white/80">{pair.symbol1}-{pair.symbol2}</div>
                <div className="text-[10px] font-semibold text-white">{pair.correlation.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Holding Clusters</div>
          <div className="space-y-1">
            {data.clusters.map((cluster, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-slate-800/30 rounded px-2 py-1">
                <div>
                  <span className="text-slate-300">{cluster.name}</span>
                  <span className="text-slate-500 ml-2">({cluster.holdings.length} stocks)</span>
                </div>
                <span className={`font-medium ${cluster.intraCorr > 0.7 ? "text-red-400" : "text-emerald-400"}`}>ρ={cluster.intraCorr.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        {data.recommendations.length > 0 && (
          <div className="rounded bg-blue-900/20 border border-blue-800/30 p-2">
            <div className="text-[9px] text-blue-400 uppercase mb-1">Recommendations</div>
            {data.recommendations.slice(0, 2).map((r, i) => <div key={i} className="text-[10px] text-slate-300">• {r}</div>)}
          </div>
        )}
        <InterpretationFooter variant={data.diversificationScore >= 70 ? "success" : data.diversificationScore >= 50 ? "info" : "warning"}>
          Diversification score of {data.diversificationScore}/100 with average correlation of {data.avgCorrelation.toFixed(2)}. {data.diversificationScore >= 70 ? "Portfolio is well diversified." : "Consider adding uncorrelated assets."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
