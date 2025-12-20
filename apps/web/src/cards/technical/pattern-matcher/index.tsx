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
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface PatternMatcherData {
  symbol: string;
  asOf: string;
  currentPattern: Array<{ t: string; v: number }>;
  matches: Array<{
    symbol: string;
    period: string;
    similarity: number;
    outcome: number;
    alignedPattern: Array<{ t: string; v: number }>;
  }>;
  expectedOutcome: {
    avgReturn: number;
    winRate: number;
    avgDuration: number;
  };
  confidenceLevel: "High" | "Medium" | "Low";
  edgeMetrics?: {
    setupWinRate: number;
    avgRMultiple: number;
    medianTimeToTarget: number;
    medianTimeToStop: number;
    confidenceScore: number;
    regimeTag: 'Strong Trend' | 'Choppy' | 'Mean-reversion' | 'Volatile Breakout';
    performanceBySession?: {
      opening: number;
      morning: number;
      afternoon: number;
      closing: number;
    };
    performanceByMarketCondition?: {
      niftyAboveEMA: number;
      niftyBelowEMA: number;
    };
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN SPOTLIGHT SIGNATURE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function PatternSpotlight({ 
  currentPattern, 
  matches, 
  expectedOutcome,
  confidenceLevel 
}: { 
  currentPattern: PatternMatcherData['currentPattern'];
  matches: PatternMatcherData['matches'];
  expectedOutcome: PatternMatcherData['expectedOutcome'];
  confidenceLevel: PatternMatcherData['confidenceLevel'];
}) {
  const isBullish = expectedOutcome.avgReturn > 0;
  const isHighConfidence = confidenceLevel === 'High';
  
  // Normalize patterns for comparison
  const normalizePattern = (pattern: Array<{ t: string; v: number }>) => {
    const min = Math.min(...pattern.map(p => p.v));
    const max = Math.max(...pattern.map(p => p.v));
    const range = max - min || 1;
    return pattern.map((p, i) => ({ index: i, value: ((p.v - min) / range) * 100 }));
  };

  const normalizedCurrent = normalizePattern(currentPattern);
  
  // Build chart data with spotlight zone
  const chartData = normalizedCurrent.map((point, i) => {
    const result: any = { 
      index: i, 
      current: point.value,
      // Add spotlight zone for last 20% of pattern
      spotlightMin: i >= normalizedCurrent.length * 0.8 ? 0 : null,
      spotlightMax: i >= normalizedCurrent.length * 0.8 ? 100 : null,
    };
    
    // Add top 2 matches
    matches.slice(0, 2).forEach((match, j) => {
      const normMatch = normalizePattern(match.alignedPattern);
      if (normMatch[i]) {
        result[`match${j}`] = normMatch[i].value;
      }
    });
    return result;
  });

  const glowColor = isBullish ? '#10b981' : '#ef4444';
  const accentColor = isBullish ? '#10b981' : '#ef4444';

  return (
    <div className="relative">
      {/* Confidence Ring */}
      <div className="absolute -top-2 -right-2 z-10">
        <div 
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isHighConfidence ? 'bg-emerald-500/20 border-2 border-emerald-500/50' :
            confidenceLevel === 'Medium' ? 'bg-amber-500/20 border-2 border-amber-500/50' :
            'bg-slate-500/20 border-2 border-slate-500/50'
          }`}
          style={{
            boxShadow: isHighConfidence ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none',
          }}
        >
          <div className="text-center">
            <div className={`text-lg font-bold ${
              isHighConfidence ? 'text-emerald-400' :
              confidenceLevel === 'Medium' ? 'text-amber-400' :
              'text-slate-400'
            }`}>
              {(matches[0]?.similarity * 100).toFixed(0)}%
            </div>
            <div className="text-[8px] text-slate-500">MATCH</div>
          </div>
        </div>
      </div>

      {/* Pattern Chart with Spotlight */}
      <div className="h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              {/* Spotlight gradient */}
              <linearGradient id="spotlightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity={0.3} />
                <stop offset="50%" stopColor={accentColor} stopOpacity={0.1} />
                <stop offset="100%" stopColor={accentColor} stopOpacity={0.3} />
              </linearGradient>
              
              {/* Current pattern glow */}
              <filter id="patternGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* Match line gradients */}
              <linearGradient id="match0Gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="match1Gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            
            {/* Spotlight zone */}
            <Area
              type="monotone"
              dataKey="spotlightMax"
              stackId="spotlight"
              stroke="none"
              fill="url(#spotlightGradient)"
            />
            
            <XAxis dataKey="index" hide />
            <YAxis domain={[0, 100]} hide />
            <Tooltip
              contentStyle={{ 
                backgroundColor: "#1e293b", 
                border: "1px solid #334155", 
                borderRadius: "8px", 
                fontSize: "10px" 
              }}
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}%`,
                name === 'current' ? 'Current' : matches[parseInt(name.replace('match', ''))]?.symbol || name
              ]}
            />
            
            {/* Historical matches (dashed, subtle) */}
            {matches.slice(0, 2).map((match, i) => (
              <Line
                key={i}
                type="monotone"
                dataKey={`match${i}`}
                stroke={`url(#match${i}Gradient)`}
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
              />
            ))}
            
            {/* Current pattern (solid, glowing) */}
            <Line
              type="monotone"
              dataKey="current"
              stroke="#ffffff"
              strokeWidth={3}
              dot={false}
              filter="url(#patternGlow)"
            />
            
            {/* Endpoint marker */}
            <ReferenceLine
              x={chartData.length - 1}
              stroke={accentColor}
              strokeWidth={2}
              strokeDasharray="3 3"
            />
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* "NOW" indicator */}
        <div 
          className="absolute bottom-6 right-4 px-2 py-1 rounded text-[9px] font-bold"
          style={{ 
            backgroundColor: `${accentColor}30`,
            color: accentColor,
            border: `1px solid ${accentColor}50`,
          }}
        >
          NOW →
        </div>
      </div>
      
      {/* Match Legend */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="w-4 h-0.5 bg-white rounded" /> Current
        </span>
        {matches.slice(0, 2).map((match, i) => (
          <span key={i} className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span 
              className="w-4 h-0.5 rounded" 
              style={{ 
                background: i === 0 ? '#3b82f6' : '#8b5cf6',
                opacity: 0.8,
              }} 
            /> 
            {match.symbol}
          </span>
        ))}
      </div>
      
      {/* Expected Outcome Banner */}
      <div 
        className="mt-3 p-3 rounded-lg flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
          border: `1px solid ${accentColor}30`,
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            {isBullish ? '📈' : '📉'}
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Expected Move</div>
            <div 
              className="text-lg font-bold"
              style={{ color: accentColor }}
            >
              {expectedOutcome.avgReturn > 0 ? '+' : ''}{expectedOutcome.avgReturn.toFixed(1)}%
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400">in ~{expectedOutcome.avgDuration}d</div>
          <div className="text-sm font-semibold text-slate-200">{expectedOutcome.winRate.toFixed(0)}% win rate</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getPatternMatcherOutput(data: PatternMatcherData): CardOutput {
  const { symbol, asOf, matches, expectedOutcome, confidenceLevel, edgeMetrics } = data;
  
  const sentiment = expectedOutcome.avgReturn > 3 && expectedOutcome.winRate > 55 ? "bullish" : expectedOutcome.avgReturn < -3 ? "bearish" : "neutral";
  const signalStrength = confidenceLevel === "High" ? 5 : confidenceLevel === "Medium" ? 3 : 2;
  
  const avgSimilarity = matches.length > 0 ? matches.reduce((sum, m) => sum + m.similarity, 0) / matches.length : 0;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Expected Return", "pm_return", expectedOutcome.avgReturn, 
      expectedOutcome.avgReturn > 5 ? "excellent" : expectedOutcome.avgReturn > 2 ? "good" : expectedOutcome.avgReturn > 0 ? "fair" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Win Rate", "pm_winrate", expectedOutcome.winRate, 
      expectedOutcome.winRate > 60 ? "excellent" : expectedOutcome.winRate > 50 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("Avg Duration", "pm_duration", expectedOutcome.avgDuration, "neutral", 
      { format: "number", priority: 2, unit: "days" }),
    createMetric("Pattern Matches", "pm_matches", matches.length, 
      matches.length > 5 ? "excellent" : matches.length > 2 ? "good" : "fair",
      { format: "number", priority: 1 }),
    createMetric("Avg Similarity", "pm_similarity", avgSimilarity, 
      avgSimilarity > 85 ? "excellent" : avgSimilarity > 70 ? "good" : "fair",
      { format: "percent", priority: 2 }),
  ];
  
  if (edgeMetrics) {
    keyMetrics.push(
      createMetric("Confidence Score", "pm_confidence", edgeMetrics.confidenceScore, 
        edgeMetrics.confidenceScore > 70 ? "excellent" : edgeMetrics.confidenceScore > 50 ? "good" : "fair",
        { format: "score", priority: 1 }),
      createMetric("R-Multiple", "pm_r", edgeMetrics.avgRMultiple, 
        edgeMetrics.avgRMultiple > 2 ? "excellent" : edgeMetrics.avgRMultiple > 1.5 ? "good" : "fair",
        { format: "ratio", priority: 2, unit: "R" })
    );
  }
  
  const insights: Insight[] = [];
  
  if (confidenceLevel === "High" && matches.length >= 3) {
    insights.push(createInsight("strength", `High-confidence pattern match with ${matches.length} historical analogs (avg ${avgSimilarity.toFixed(0)}% similarity)`, 1, ["pm_matches", "pm_similarity"]));
  }
  
  if (expectedOutcome.avgReturn > 5 && expectedOutcome.winRate > 55) {
    insights.push(createInsight("strength", `Historically profitable setup: ${expectedOutcome.winRate.toFixed(0)}% win rate with ${expectedOutcome.avgReturn.toFixed(1)}% avg return`, 1, ["pm_return", "pm_winrate"]));
  } else if (expectedOutcome.avgReturn < 0) {
    insights.push(createInsight("weakness", `Pattern historically negative: ${expectedOutcome.avgReturn.toFixed(1)}% avg return`, 1, ["pm_return"]));
  }
  
  if (edgeMetrics && edgeMetrics.avgRMultiple > 2) {
    insights.push(createInsight("strength", `Excellent risk-reward: ${edgeMetrics.avgRMultiple.toFixed(1)}R avg multiple`, 2, ["pm_r"]));
  }
  
  if (edgeMetrics) {
    insights.push(createInsight("observation", `Pattern regime: ${edgeMetrics.regimeTag}`, 3));
  }
  
  const headline = `${symbol} pattern ${confidenceLevel.toLowerCase()} confidence: ${expectedOutcome.winRate.toFixed(0)}% win rate, ${expectedOutcome.avgReturn > 0 ? "+" : ""}${expectedOutcome.avgReturn.toFixed(1)}% expected`;
  
  return {
    cardId: "pattern-matcher",
    cardCategory: "technical",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: confidenceLevel === "High" ? "high" : confidenceLevel === "Medium" ? "medium" : "low",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["playbook-builder", "trend-strength", "technical-indicators"],
    tags: ["pattern", confidenceLevel.toLowerCase(), edgeMetrics?.regimeTag?.toLowerCase().replace(" ", "-") || "general"],
    scoreContribution: {
      category: "momentum",
      score: expectedOutcome.winRate,
      weight: 0.10,
    },
  };
}

interface Props {
  data?: PatternMatcherData;
  isLoading?: boolean;
  error?: string | null;
}

export default function PatternMatcherCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">{categoryStyle.icon}</span>
            Pattern Matcher
          </CardTitle>
          <CardDescription>Searching for patterns…</CardDescription>
        </CardHeader>
        <CardContent><Skeleton className="h-48 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Pattern Matcher</CardTitle>
          <CardDescription className={error ? "text-red-400" : ""}>{error || "No data"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { symbol, asOf, currentPattern, matches, expectedOutcome, confidenceLevel, edgeMetrics } = data;

  const confidenceColors = {
    High: "success" as const,
    Medium: "warning" as const,
    Low: "secondary" as const,
  };

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Pattern Matcher
              <Badge variant={confidenceColors[confidenceLevel]}>{confidenceLevel}</Badge>
            </CardTitle>
            <CardDescription>{symbol} • Historical pattern analysis • As of {asOf}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Signature Pattern Spotlight */}
        <PatternSpotlight 
          currentPattern={currentPattern}
          matches={matches}
          expectedOutcome={expectedOutcome}
          confidenceLevel={confidenceLevel}
        />

        {/* Top Matches Grid */}
        <div className="grid grid-cols-2 gap-2">
          {matches.slice(0, 4).map((match, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between bg-slate-800/30 rounded-lg px-3 py-2 border border-slate-700/30"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ 
                    backgroundColor: match.outcome > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: match.outcome > 0 ? '#10b981' : '#ef4444',
                  }}
                >
                  {match.outcome > 0 ? '+' : ''}{match.outcome.toFixed(0)}%
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-200">{match.symbol}</div>
                  <div className="text-[9px] text-slate-500">{match.period}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">{(match.similarity * 100).toFixed(0)}%</div>
                <div className="text-[8px] text-slate-500">match</div>
              </div>
            </div>
          ))}
        </div>

        {/* Edge Metrics (if available) */}
        {edgeMetrics && (
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-slate-800/30 rounded-lg p-2 text-center border border-slate-700/30">
              <div className="text-[9px] uppercase text-slate-500">R-Multiple</div>
              <div className="text-sm font-bold text-cyan-400">{edgeMetrics.avgRMultiple.toFixed(1)}R</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-2 text-center border border-slate-700/30">
              <div className="text-[9px] uppercase text-slate-500">Setup Win%</div>
              <div className="text-sm font-bold text-slate-200">{edgeMetrics.setupWinRate.toFixed(0)}%</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-2 text-center border border-slate-700/30">
              <div className="text-[9px] uppercase text-slate-500">To Target</div>
              <div className="text-sm font-bold text-slate-200">{edgeMetrics.medianTimeToTarget}d</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-2 text-center border border-slate-700/30">
              <div className="text-[9px] uppercase text-slate-500">Regime</div>
              <div className="text-[10px] font-medium text-amber-400">{edgeMetrics.regimeTag}</div>
            </div>
          </div>
        )}

        <InterpretationFooter variant={expectedOutcome.avgReturn > 5 ? "success" : expectedOutcome.avgReturn < -5 ? "warning" : "neutral"}>
          {matches.length} historical matches averaging {(matches.reduce((s, m) => s + m.similarity, 0) / matches.length * 100).toFixed(0)}% similarity.
          {expectedOutcome.avgReturn > 0 ? ' Bullish' : ' Bearish'} bias with {expectedOutcome.winRate.toFixed(0)}% historical win rate.
          Pattern signals are probabilistic.
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
