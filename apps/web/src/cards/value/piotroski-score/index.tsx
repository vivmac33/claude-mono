import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import { HealthBadge, TrendBadge, HealthType, TrendType } from "@/components/ui/status-badges";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
  MetricInterpretation,
  SignalStrength,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface PiotroskiScoreData {
  symbol: string;
  asOf: string;
  totalScore: number;
  verdict: "Strong" | "Moderate" | "Weak";
  previousScore: number;
  trend: "Improving" | "Stable" | "Declining";
  categories: {
    profitability: {
      score: number;
      maxScore: number;
      items: Array<{ name: string; pass: boolean; value: string }>;
    };
    leverage: {
      score: number;
      maxScore: number;
      items: Array<{ name: string; pass: boolean; value: string }>;
    };
    efficiency: {
      score: number;
      maxScore: number;
      items: Array<{ name: string; pass: boolean; value: string }>;
    };
  };
  historicalScores: Array<{ year: string; score: number }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// STRENGTH SHIELD SIGNATURE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function StrengthShield({ 
  score, 
  categories,
  verdict 
}: { 
  score: number;
  categories: PiotroskiScoreData['categories'];
  verdict: PiotroskiScoreData['verdict'];
}) {
  // Map all 9 criteria to segments
  const allItems = [
    ...categories.profitability.items,
    ...categories.leverage.items,
    ...categories.efficiency.items,
  ];
  
  // Calculate segment angles (9 segments = 40 degrees each)
  const segmentAngle = 360 / 9;
  const innerRadius = 35;
  const outerRadius = 70;
  const centerX = 80;
  const centerY = 80;
  
  // Colors based on verdict
  const activeColor = verdict === 'Strong' ? '#10b981' : verdict === 'Moderate' ? '#f59e0b' : '#ef4444';
  const glowColor = verdict === 'Strong' ? 'rgba(16, 185, 129, 0.5)' : verdict === 'Moderate' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(239, 68, 68, 0.5)';
  
  // Create SVG arc path
  const createArcPath = (startAngle: number, endAngle: number, inner: number, outer: number) => {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = centerX + outer * Math.cos(startRad);
    const y1 = centerY + outer * Math.sin(startRad);
    const x2 = centerX + outer * Math.cos(endRad);
    const y2 = centerY + outer * Math.sin(endRad);
    const x3 = centerX + inner * Math.cos(endRad);
    const y3 = centerY + inner * Math.sin(endRad);
    const x4 = centerX + inner * Math.cos(startRad);
    const y4 = centerY + inner * Math.sin(startRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${outer} ${outer} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };
  
  return (
    <div className="relative flex items-center justify-center">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <defs>
          {/* Glow filter */}
          <filter id="shieldGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Active segment gradient */}
          <radialGradient id="segmentGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={activeColor} stopOpacity={0.9} />
            <stop offset="100%" stopColor={activeColor} stopOpacity={0.5} />
          </radialGradient>
        </defs>
        
        {/* Background segments (inactive) */}
        {allItems.map((_, i) => {
          const startAngle = i * segmentAngle;
          const endAngle = (i + 1) * segmentAngle - 2; // 2 degree gap
          return (
            <path
              key={`bg-${i}`}
              d={createArcPath(startAngle, endAngle, innerRadius, outerRadius)}
              fill="#1e293b"
              stroke="#334155"
              strokeWidth={1}
            />
          );
        })}
        
        {/* Active segments (passed criteria) */}
        {allItems.map((item, i) => {
          if (!item.pass) return null;
          const startAngle = i * segmentAngle;
          const endAngle = (i + 1) * segmentAngle - 2;
          return (
            <path
              key={`active-${i}`}
              d={createArcPath(startAngle, endAngle, innerRadius, outerRadius)}
              fill="url(#segmentGradient)"
              stroke={activeColor}
              strokeWidth={1}
              filter="url(#shieldGlow)"
              style={{
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          );
        })}
        
        {/* Center circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius - 5}
          fill="#0f172a"
          stroke={activeColor}
          strokeWidth={2}
          style={{
            filter: score >= 7 ? 'url(#shieldGlow)' : 'none',
          }}
        />
        
        {/* Score in center */}
        <text
          x={centerX}
          y={centerY - 5}
          textAnchor="middle"
          className="text-2xl font-bold"
          fill={activeColor}
        >
          {score}
        </text>
        <text
          x={centerX}
          y={centerY + 12}
          textAnchor="middle"
          className="text-[10px]"
          fill="#64748b"
        >
          / 9
        </text>
      </svg>
      
      {/* Shield Status Label */}
      <div 
        className="absolute -bottom-2 px-3 py-1 rounded-full text-[10px] font-bold"
        style={{
          backgroundColor: `${activeColor}20`,
          color: activeColor,
          border: `1px solid ${activeColor}50`,
        }}
      >
        {verdict === 'Strong' ? '🛡️ STRONG' : verdict === 'Moderate' ? '⚔️ MODERATE' : '⚠️ WEAK'}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getPiotroskiScoreOutput(data: PiotroskiScoreData): CardOutput {
  const { symbol, asOf, totalScore, verdict, previousScore, trend, categories, historicalScores } = data;
  
  const scoreInterp: MetricInterpretation = totalScore >= 7 ? "excellent" : totalScore >= 5 ? "good" : totalScore >= 3 ? "fair" : "poor";
  const trendInterp: MetricInterpretation = trend === "Improving" ? "improving" : trend === "Declining" ? "deteriorating" : "neutral";
  
  const keyMetrics: MetricValue[] = [
    createMetric("Piotroski F-Score", "piotroski_score", totalScore, scoreInterp, {
      format: "score",
      unit: "9",
      priority: 1,
      trend: {
        direction: trend === "Improving" ? "up" : trend === "Declining" ? "down" : "flat",
        period: "vs last year",
        change: totalScore - previousScore,
      },
    }),
    createMetric("Profitability", "profitability_score", categories.profitability.score, 
      categories.profitability.score >= 3 ? "good" : categories.profitability.score >= 2 ? "fair" : "poor", {
      format: "score",
      unit: String(categories.profitability.maxScore),
      priority: 2,
    }),
    createMetric("Leverage & Liquidity", "leverage_score", categories.leverage.score,
      categories.leverage.score >= 2 ? "good" : categories.leverage.score >= 1 ? "fair" : "poor", {
      format: "score",
      unit: String(categories.leverage.maxScore),
      priority: 2,
    }),
    createMetric("Operating Efficiency", "efficiency_score", categories.efficiency.score,
      categories.efficiency.score >= 2 ? "good" : categories.efficiency.score >= 1 ? "fair" : "poor", {
      format: "score",
      unit: String(categories.efficiency.maxScore),
      priority: 2,
    }),
    createMetric("Score Trend", "score_trend", trend, trendInterp, {
      priority: 3,
    }),
  ];
  
  const insights: Insight[] = [];
  
  if (verdict === "Strong") {
    insights.push(createInsight("strength", `${symbol} shows strong financial health with F-Score of ${totalScore}/9`, 1, ["piotroski_score"]));
  } else if (verdict === "Weak") {
    insights.push(createInsight("weakness", `${symbol} shows weak fundamentals with F-Score of ${totalScore}/9 - exercise caution`, 1, ["piotroski_score"]));
  } else {
    insights.push(createInsight("observation", `${symbol} has moderate financial strength (F-Score: ${totalScore}/9)`, 2, ["piotroski_score"]));
  }
  
  if (trend === "Improving") {
    insights.push(createInsight("opportunity", `Financial quality improving - score up from ${previousScore} to ${totalScore}`, 2, ["score_trend"]));
  } else if (trend === "Declining") {
    insights.push(createInsight("risk", `Financial quality deteriorating - score down from ${previousScore} to ${totalScore}`, 2, ["score_trend"]));
  }
  
  const allItems = [
    ...categories.profitability.items,
    ...categories.leverage.items,
    ...categories.efficiency.items,
  ];
  
  const failedItems = allItems.filter(item => !item.pass);
  const passedItems = allItems.filter(item => item.pass);
  
  if (passedItems.length > 0) {
    const strengthText = passedItems.slice(0, 2).map(i => i.name).join(", ");
    insights.push(createInsight("strength", `Key positives: ${strengthText}`, 3));
  }
  
  if (failedItems.length > 0) {
    const concernText = failedItems.slice(0, 2).map(i => i.name).join(", ");
    insights.push(createInsight("weakness", `Areas of concern: ${concernText}`, 3));
  }
  
  const suggestedCards = verdict === "Strong"
    ? ["valuation-summary", "growth-summary", "dcf-valuation"]
    : verdict === "Weak"
    ? ["bankruptcy-health", "financial-stress-radar", "leverage-history"]
    : ["financial-health-dna", "dupont-analysis"];
  
  const headline = verdict === "Strong"
    ? `${symbol} demonstrates strong financial quality (Piotroski ${totalScore}/9)`
    : verdict === "Weak"
    ? `${symbol} shows weak fundamentals requiring caution (Piotroski ${totalScore}/9)`
    : `${symbol} has moderate financial health (Piotroski ${totalScore}/9)`;
  
  return {
    cardId: "piotroski-score",
    cardCategory: "value",
    symbol,
    asOf,
    headline,
    sentiment: verdict === "Strong" ? "bullish" : verdict === "Weak" ? "bearish" : "neutral",
    confidence: "high",
    signalStrength: Math.min(5, Math.max(1, Math.round(totalScore / 9 * 5))) as SignalStrength,
    keyMetrics,
    insights,
    primaryChart: {
      type: "gauge",
      title: "F-Score",
      data: [{ value: totalScore, max: 9 }],
    },
    secondaryCharts: [{
      type: "line",
      title: "Historical F-Score",
      data: historicalScores,
      xKey: "year",
      yKey: "score",
    }],
    suggestedCards,
    tags: ["quality", "fundamentals", "piotroski", verdict.toLowerCase()],
    scoreContribution: {
      category: "quality",
      score: (totalScore / 9) * 100,
      weight: 0.20,
    },
  };
}

interface Props {
  data?: PiotroskiScoreData;
  isLoading?: boolean;
  error?: string | null;
}

function CheckIcon({ pass }: { pass: boolean }) {
  return pass ? (
    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function PiotroskiScoreCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['value'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Piotroski F-Score</CardTitle>
          <CardDescription>Calculating financial strength…</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full mb-3" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Piotroski F-Score</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Piotroski F-Score</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { symbol, asOf, totalScore, verdict, previousScore, trend, categories, historicalScores } = data;

  const getHealthType = (v: PiotroskiScoreData["verdict"]): HealthType => {
    switch (v) {
      case "Strong": return "excellent";
      case "Moderate": return "fair";
      case "Weak": return "poor";
    }
  };

  const getTrendType = (t: PiotroskiScoreData["trend"]): TrendType => {
    switch (t) {
      case "Improving": return "up";
      case "Stable": return "flat";
      case "Declining": return "down";
    }
  };

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Piotroski F-Score
              <HealthBadge health={getHealthType(verdict)} size="md" />
            </CardTitle>
            <CardDescription>
              {symbol} • 9-point financial strength • As of {asOf}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs text-slate-500">Previous</div>
              <div className="text-lg font-bold text-slate-300">{previousScore}/9</div>
              <TrendBadge trend={getTrendType(trend)} size="sm" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Signature Strength Shield */}
        <div className="flex justify-center py-4">
          <StrengthShield 
            score={totalScore} 
            categories={categories}
            verdict={verdict}
          />
        </div>

        {/* Category Breakdown - Compact */}
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(categories).map(([catKey, cat]) => (
            <div key={catKey} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase text-slate-400 capitalize">{catKey}</span>
                <span className="text-xs font-bold text-slate-200">{cat.score}/{cat.maxScore}</span>
              </div>
              <div className="space-y-1">
                {cat.items.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-[10px]">
                    <CheckIcon pass={item.pass} />
                    <span className={item.pass ? "text-slate-300" : "text-slate-500"}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Historical Scores */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase text-slate-500">History:</span>
          <div className="flex gap-1.5">
            {historicalScores.map((h) => (
              <div
                key={h.year}
                className={`px-2 py-1 rounded text-[10px] font-medium ${
                  h.score >= 7
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : h.score >= 4
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {h.year}: {h.score}
              </div>
            ))}
          </div>
        </div>

        <InterpretationFooter variant={verdict === "Strong" ? "success" : verdict === "Weak" ? "warning" : "neutral"}>
          F-Score {totalScore}/9 = {verdict.toLowerCase()} fundamentals.
          {totalScore >= 7 ? " High scores correlate with value stock outperformance." : totalScore >= 4 ? " Mixed signals - monitor profitability and leverage." : " Low scores suggest caution."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
