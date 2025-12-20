import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface SentimentZScoreData {
  symbol: string;
  asOf: string;
  zscoreReturn: number;
  zscoreVolume: number;
  zscoreMomentum: number;
  signal: "Bullish" | "Bearish" | "Neutral";
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getSentimentZScoreOutput(data: SentimentZScoreData): CardOutput {
  const { symbol, asOf, zscoreReturn, zscoreVolume, zscoreMomentum, signal } = data;
  
  const sentiment = signal === "Bullish" ? "bullish" : signal === "Bearish" ? "bearish" : "neutral";
  const avgZScore = (zscoreReturn + zscoreVolume + zscoreMomentum) / 3;
  const signalStrength = Math.abs(avgZScore) > 2 ? 5 : Math.abs(avgZScore) > 1.5 ? 4 : Math.abs(avgZScore) > 1 ? 3 : 2;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Return Z-Score", "sz_return", zscoreReturn, 
      zscoreReturn > 1 ? "excellent" : zscoreReturn > 0 ? "good" : zscoreReturn > -1 ? "fair" : "poor",
      { format: "number", priority: 1 }),
    createMetric("Volume Z-Score", "sz_volume", zscoreVolume, 
      zscoreVolume > 1 ? "excellent" : zscoreVolume > 0 ? "good" : "fair",
      { format: "number", priority: 1 }),
    createMetric("Momentum Z-Score", "sz_momentum", zscoreMomentum, 
      zscoreMomentum > 1 ? "excellent" : zscoreMomentum > 0 ? "good" : zscoreMomentum > -1 ? "fair" : "poor",
      { format: "number", priority: 1 }),
    createMetric("Average Z-Score", "sz_avg", avgZScore, 
      avgZScore > 1 ? "excellent" : avgZScore > 0 ? "good" : avgZScore > -1 ? "fair" : "poor",
      { format: "number", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // Signal
  if (signal === "Bullish") {
    insights.push(createInsight("strength", `Bullish sentiment across metrics (avg Z: ${avgZScore.toFixed(2)})`, 1, ["sz_avg"]));
  } else if (signal === "Bearish") {
    insights.push(createInsight("weakness", `Bearish sentiment across metrics (avg Z: ${avgZScore.toFixed(2)})`, 1, ["sz_avg"]));
  }
  
  // Extreme readings
  if (zscoreReturn > 2) {
    insights.push(createInsight("observation", `Extreme positive return Z-score (${zscoreReturn.toFixed(2)}) - potential mean reversion`, 2, ["sz_return"]));
  } else if (zscoreReturn < -2) {
    insights.push(createInsight("observation", `Extreme negative return Z-score (${zscoreReturn.toFixed(2)}) - oversold bounce possible`, 2, ["sz_return"]));
  }
  
  // Volume confirmation
  if (zscoreVolume > 1.5 && zscoreReturn > 1) {
    insights.push(createInsight("strength", "High volume confirming positive returns", 2, ["sz_volume"]));
  }
  
  // Momentum
  if (zscoreMomentum > 1.5) {
    insights.push(createInsight("strength", `Strong momentum Z-score (${zscoreMomentum.toFixed(2)})`, 2, ["sz_momentum"]));
  }
  
  const headline = `${symbol} sentiment ${signal.toLowerCase()}: Return Z ${zscoreReturn.toFixed(2)}, Vol Z ${zscoreVolume.toFixed(2)}, Mom Z ${zscoreMomentum.toFixed(2)}`;
  
  return {
    cardId: "sentiment-zscore",
    cardCategory: "mini",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["momentum-heatmap", "technical-indicators", "trend-strength"],
    tags: ["sentiment", "zscore", signal.toLowerCase()],
    scoreContribution: {
      category: "momentum",
      score: Math.min(100, Math.max(0, 50 + avgZScore * 15)),
      weight: 0.05,
    },
  };
}

interface Props {
  data?: SentimentZScoreData;
  isLoading?: boolean;
  error?: string | null;
}

function ZScoreGauge({ value, label }: { value: number; label: string }) {
  // Clamp z-score display between -3 and 3
  const normalized = Math.max(-3, Math.min(3, value));
  const position = ((normalized + 3) / 6) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-slate-500">{label}</span>
        <span className={`font-medium ${value > 1 ? "text-emerald-400" : value < -1 ? "text-red-400" : "text-slate-300"}`}>
          {value > 0 ? "+" : ""}{value.toFixed(2)}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-gradient-to-r from-red-600 via-slate-600 to-emerald-600">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full border-2 border-slate-900 shadow-lg transition-all duration-300"
          style={{ left: `calc(${position}% - 5px)` }}
        />
      </div>
    </div>
  );
}

export default function SentimentZScoreMini({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['mini'];

  if (isLoading) {
    return (
      <Card className="w-full max-w-xs border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Sentiment Z-Score</CardTitle>
        </CardHeader>
        <CardContent><Skeleton className="h-20 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="w-full max-w-xs border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Sentiment Z-Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-slate-500">{error || "No data"}</div>
        </CardContent>
      </Card>
    );
  }

  const { symbol, zscoreReturn, zscoreVolume, zscoreMomentum, signal } = data;

  const signalColors = {
    Bullish: "text-emerald-400",
    Bearish: "text-red-400",
    Neutral: "text-slate-400",
  };

  return (
    <Card className="w-full max-w-xs border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">Sentiment Z-Score</CardTitle>
          <span className="text-xs text-slate-400">{symbol}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ZScoreGauge value={zscoreReturn} label="Return" />
        <ZScoreGauge value={zscoreVolume} label="Volume" />
        <ZScoreGauge value={zscoreMomentum} label="Momentum" />
        
        <div className="pt-2 border-t border-slate-700/50 flex justify-between items-center">
          <span className="text-[10px] text-slate-500">Overall Signal</span>
          <span className={`text-xs font-semibold ${signalColors[signal]}`}>{signal}</span>
        </div>
      </CardContent>
    </Card>
  );
}
