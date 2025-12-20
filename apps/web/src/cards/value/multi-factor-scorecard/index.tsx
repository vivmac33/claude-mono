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
import { RadialGauge, ScoreGauge } from "@/components/shared/ScoreGauge";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface MultiFactorScorecardData {
  symbol: string;
  asOf: string;
  compositeScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  factors: Array<{
    name: string;
    score: number;
    maxScore: number;
    weight: number;
    trend: "up" | "down" | "stable";
  }>;
  radarData: Array<{
    factor: string;
    score: number;
    benchmark: number;
  }>;
  ranking: {
    sector: number;
    sectorTotal: number;
    market: number;
    marketTotal: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getMultiFactorScorecardOutput(data: MultiFactorScorecardData): CardOutput {
  const { symbol, asOf, compositeScore, grade, factors, radarData, ranking } = data;
  
  const sentiment = grade === "A" || grade === "B" ? "bullish" : grade === "D" || grade === "F" ? "bearish" : "neutral";
  const signalStrength = grade === "A" ? 5 : grade === "B" ? 4 : grade === "C" ? 3 : grade === "D" ? 2 : 1;
  
  // Find strongest and weakest factors
  const sortedFactors = [...factors].sort((a, b) => (b.score / b.maxScore) - (a.score / a.maxScore));
  const strongestFactor = sortedFactors[0];
  const weakestFactor = sortedFactors[sortedFactors.length - 1];
  
  // Count improving vs declining factors
  const improvingCount = factors.filter(f => f.trend === "up").length;
  const decliningCount = factors.filter(f => f.trend === "down").length;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Composite Score", "mf_composite_score", compositeScore, 
      compositeScore > 80 ? "excellent" : compositeScore > 60 ? "good" : compositeScore > 40 ? "fair" : "poor",
      { format: "score", priority: 1 }),
    createMetric("Grade", "mf_grade", grade === "A" ? 5 : grade === "B" ? 4 : grade === "C" ? 3 : grade === "D" ? 2 : 1, 
      grade === "A" || grade === "B" ? "excellent" : grade === "C" ? "fair" : "poor",
      { format: "score", priority: 1 }),
    createMetric("Sector Rank", "mf_sector_rank", ranking.sector, 
      ranking.sector <= ranking.sectorTotal * 0.2 ? "excellent" : ranking.sector <= ranking.sectorTotal * 0.5 ? "good" : "fair",
      { format: "number", priority: 1, benchmark: { value: ranking.sectorTotal, label: "Total", comparison: "below" } }),
    createMetric("Market Rank", "mf_market_rank", ranking.market, 
      ranking.market <= ranking.marketTotal * 0.2 ? "excellent" : ranking.market <= ranking.marketTotal * 0.5 ? "good" : "fair",
      { format: "number", priority: 2, benchmark: { value: ranking.marketTotal, label: "Total", comparison: "below" } }),
  ];
  
  // Add individual factor scores
  factors.slice(0, 3).forEach((f, i) => {
    keyMetrics.push(createMetric(f.name, `mf_factor_${i}`, f.score, 
      f.score / f.maxScore > 0.8 ? "excellent" : f.score / f.maxScore > 0.6 ? "good" : f.score / f.maxScore > 0.4 ? "fair" : "poor",
      { format: "score", priority: 2, trend: { direction: f.trend === "up" ? "up" : f.trend === "down" ? "down" : "flat", period: "Recent" } }));
  });
  
  const insights: Insight[] = [];
  
  // Grade insight
  if (grade === "A") {
    insights.push(createInsight("strength", `Grade A (${compositeScore}/100) - top-tier quality across all measured factors`, 1, ["mf_composite_score", "mf_grade"]));
  } else if (grade === "B") {
    insights.push(createInsight("strength", `Grade B (${compositeScore}/100) - above-average quality with room for improvement`, 1, ["mf_composite_score"]));
  } else if (grade === "F") {
    insights.push(createInsight("weakness", `Grade F (${compositeScore}/100) - significant quality concerns across factors`, 1, ["mf_composite_score", "mf_grade"]));
  } else {
    insights.push(createInsight("observation", `Grade ${grade} (${compositeScore}/100) - mixed quality profile`, 1, ["mf_composite_score"]));
  }
  
  // Ranking insight
  const sectorPercentile = Math.round((1 - ranking.sector / ranking.sectorTotal) * 100);
  if (sectorPercentile > 80) {
    insights.push(createInsight("strength", `Top ${100 - sectorPercentile}% in sector (rank #${ranking.sector} of ${ranking.sectorTotal})`, 2, ["mf_sector_rank"]));
  } else if (sectorPercentile < 40) {
    insights.push(createInsight("weakness", `Bottom ${100 - sectorPercentile}% in sector (rank #${ranking.sector} of ${ranking.sectorTotal})`, 2, ["mf_sector_rank"]));
  }
  
  // Factor-specific insights
  if (strongestFactor && strongestFactor.score / strongestFactor.maxScore > 0.8) {
    insights.push(createInsight("strength", `Strongest factor: ${strongestFactor.name} (${strongestFactor.score}/${strongestFactor.maxScore})`, 2));
  }
  if (weakestFactor && weakestFactor.score / weakestFactor.maxScore < 0.4) {
    insights.push(createInsight("weakness", `Weakest factor: ${weakestFactor.name} (${weakestFactor.score}/${weakestFactor.maxScore})`, 2));
  }
  
  // Trend insight
  if (improvingCount > decliningCount + 1) {
    insights.push(createInsight("opportunity", `Quality momentum: ${improvingCount} factors improving vs ${decliningCount} declining`, 2));
  } else if (decliningCount > improvingCount + 1) {
    insights.push(createInsight("risk", `Quality deterioration: ${decliningCount} factors declining vs ${improvingCount} improving`, 2));
  }
  
  const headline = `${symbol} scores ${compositeScore}/100 (Grade ${grade}), ranking #${ranking.sector} in sector`;
  
  return {
    cardId: "multi-factor-scorecard",
    cardCategory: "value",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    primaryChart: { type: "radar", title: "Factor Profile", data: radarData },
    suggestedCards: grade === "A" || grade === "B" 
      ? ["valuation-summary", "dcf-valuation", "growth-summary"]
      : ["risk-health-dashboard", "piotroski-score", "financial-stress-radar"],
    tags: ["multi-factor", "quality", "scorecard", `grade-${grade.toLowerCase()}`],
    scoreContribution: {
      category: "quality",
      score: compositeScore,
      weight: 0.20,
    },
  };
}

interface Props {
  data?: MultiFactorScorecardData;
  isLoading?: boolean;
  error?: string | null;
}

export default function MultiFactorScorecardCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['value'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Multi-Factor Scorecard</CardTitle>
          <CardDescription>Evaluating factors…</CardDescription>
        </CardHeader>
        <CardContent><Skeleton className="h-48 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Multi-Factor Scorecard</CardTitle>
          <CardDescription className={error ? "text-red-400" : ""}>{error || "No data"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { symbol, asOf, compositeScore, grade, factors, radarData, ranking } = data;

  const gradeColors = {
    A: { bg: "bg-emerald-600", color: "#10b981", glow: "rgba(16, 185, 129, 0.3)" },
    B: { bg: "bg-blue-600", color: "#3b82f6", glow: "rgba(59, 130, 246, 0.3)" },
    C: { bg: "bg-amber-600", color: "#f59e0b", glow: "rgba(245, 158, 11, 0.3)" },
    D: { bg: "bg-orange-600", color: "#f97316", glow: "rgba(249, 115, 22, 0.3)" },
    F: { bg: "bg-red-600", color: "#ef4444", glow: "rgba(239, 68, 68, 0.3)" },
  };

  const gradeStyle = gradeColors[grade];

  const trendIcons = {
    up: <span className="text-emerald-400">↑</span>,
    down: <span className="text-red-400">↓</span>,
    stable: <span className="text-slate-400">→</span>,
  };

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: gradeStyle.color }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Multi-Factor Scorecard
              <span 
                className="px-2 py-0.5 rounded text-xs font-bold text-white"
                style={{ 
                  backgroundColor: gradeStyle.color,
                  boxShadow: `0 0 10px ${gradeStyle.glow}`,
                }}
              >
                Grade {grade}
              </span>
            </CardTitle>
            <CardDescription>{symbol} • Factor-based quality • As of {asOf}</CardDescription>
          </div>
          <RadialGauge value={compositeScore} max={100} label="Score" size={70} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Factor Scores */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase text-slate-500">Factor Breakdown</div>
            {factors.map((f) => (
              <div key={f.name} className="flex items-center gap-2">
                <span className="w-20 text-xs text-slate-400 truncate">{f.name}</span>
                <div className="flex-1">
                  <ScoreGauge value={f.score} max={f.maxScore} showValue={false} size="sm" />
                </div>
                <span className="w-8 text-xs text-slate-300 text-right">{f.score}</span>
                {trendIcons[f.trend]}
              </div>
            ))}
          </div>

          {/* Pentagon Radar Chart with Gradient */}
          <div className="h-44 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <defs>
                  {/* Pentagon gradient fill */}
                  <linearGradient id="pentagonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={gradeStyle.color} stopOpacity={0.6} />
                    <stop offset="100%" stopColor={gradeStyle.color} stopOpacity={0.1} />
                  </linearGradient>
                  {/* Glow filter */}
                  <filter id="pentagonGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis 
                  dataKey="factor" 
                  tick={{ fill: "#94a3b8", fontSize: 9 }} 
                />
                {/* Stock radar with gradient */}
                <Radar 
                  name="Stock" 
                  dataKey="score" 
                  stroke={gradeStyle.color}
                  strokeWidth={2}
                  fill="url(#pentagonGradient)" 
                  filter="url(#pentagonGlow)"
                />
                {/* Benchmark outline */}
                <Radar 
                  name="Benchmark" 
                  dataKey="benchmark" 
                  stroke="#64748b" 
                  fill="none" 
                  strokeDasharray="4 4" 
                  strokeWidth={1}
                />
              </RadarChart>
            </ResponsiveContainer>
            {/* Center grade badge */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ 
                backgroundColor: gradeStyle.color,
                boxShadow: `0 0 15px ${gradeStyle.glow}`,
              }}
            >
              {grade}
            </div>
          </div>
        </div>

        {/* Rankings */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/30 rounded-lg p-2 text-center border border-slate-700/30">
            <div className="text-lg font-bold text-slate-100">#{ranking.sector}</div>
            <div className="text-[10px] text-slate-500">of {ranking.sectorTotal} in Sector</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-2 text-center border border-slate-700/30">
            <div className="text-lg font-bold text-slate-100">#{ranking.market}</div>
            <div className="text-[10px] text-slate-500">of {ranking.marketTotal} in Market</div>
          </div>
        </div>

        <InterpretationFooter variant={grade === "A" || grade === "B" ? "success" : grade === "D" || grade === "F" ? "warning" : "neutral"}>
          Grade {grade} ({compositeScore}/100). Ranks #{ranking.sector} in sector.
          {grade === "A" ? " Top-tier quality." : grade === "F" ? " Significant concerns." : " Mixed profile."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
