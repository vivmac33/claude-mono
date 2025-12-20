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
import { TrendIndicator } from "@/components/shared/TrendIndicator";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
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

export interface GrowthSummaryData {
  symbol: string;
  asOf: string;
  growthScore: number;
  growthTier: "Hyper Growth" | "High Growth" | "Moderate" | "Slow" | "Declining";
  metrics: {
    revenueGrowth3Y: number;
    revenueGrowth5Y: number;
    epsGrowth3Y: number;
    epsGrowth5Y: number;
    fcfGrowth3Y: number;
    bookValueGrowth5Y: number;
  };
  historicalGrowth: Array<{
    year: string;
    revenue: number;
    earnings: number;
    fcf: number;
  }>;
  forwardEstimates: {
    revenueGrowthNTM: number;
    epsGrowthNTM: number;
    analystRevisions: number;
  };
  peerComparison: {
    avgRevenueGrowth: number;
    avgEpsGrowth: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GROWTH TRAJECTORY COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function GrowthTrajectory({ 
  data, 
  growthTier 
}: { 
  data: GrowthSummaryData['historicalGrowth'];
  growthTier: GrowthSummaryData['growthTier'];
}) {
  const isPositive = growthTier === 'Hyper Growth' || growthTier === 'High Growth';
  const isNegative = growthTier === 'Declining';
  
  // Calculate momentum (trend direction)
  const recentGrowth = data.slice(-3);
  const avgRecent = recentGrowth.reduce((sum, d) => sum + d.revenue, 0) / recentGrowth.length;
  const olderGrowth = data.slice(0, -3);
  const avgOlder = olderGrowth.length > 0 ? olderGrowth.reduce((sum, d) => sum + d.revenue, 0) / olderGrowth.length : avgRecent;
  const momentum = avgRecent - avgOlder;
  
  return (
    <div className="relative h-52">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            {/* Main gradient with glow effect */}
            <linearGradient id="growthTrajectoryGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={isNegative ? "#ef4444" : "#10b981"} stopOpacity={0.1} />
              <stop offset="50%" stopColor={isNegative ? "#ef4444" : "#10b981"} stopOpacity={0.6} />
              <stop offset="100%" stopColor={isNegative ? "#f97316" : "#14b8a6"} stopOpacity={1} />
            </linearGradient>
            <linearGradient id="growthTrajectoryFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isNegative ? "#ef4444" : "#10b981"} stopOpacity={0.4} />
              <stop offset="100%" stopColor={isNegative ? "#ef4444" : "#10b981"} stopOpacity={0.02} />
            </linearGradient>
            {/* Glow filter */}
            <filter id="growthGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {/* Earnings gradient */}
            <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="year" 
            tick={{ fill: "#64748b", fontSize: 9 }} 
            axisLine={{ stroke: "#334155" }} 
            tickLine={false} 
          />
          <YAxis 
            tick={{ fill: "#64748b", fontSize: 9 }} 
            axisLine={{ stroke: "#334155" }} 
            tickLine={false} 
            tickFormatter={(v) => `${v}%`}
            width={40}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: "#1e293b", 
              border: "1px solid #334155", 
              borderRadius: "8px", 
              fontSize: "11px" 
            }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, ""]}
          />
          
          {/* Earnings area (background) */}
          <Area
            type="monotone"
            dataKey="earnings"
            name="Earnings"
            stroke="#8b5cf6"
            strokeWidth={1}
            fill="url(#earningsGradient)"
            dot={false}
          />
          
          {/* Revenue trajectory with glow */}
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="url(#growthTrajectoryGradient)"
            strokeWidth={3}
            fill="url(#growthTrajectoryFill)"
            filter="url(#growthGlow)"
            dot={{
              r: 4,
              fill: '#ffffff',
              strokeWidth: 2,
              stroke: isNegative ? '#ef4444' : '#10b981',
            }}
            activeDot={{
              r: 6,
              fill: isNegative ? '#ef4444' : '#14b8a6',
              stroke: '#ffffff',
              strokeWidth: 2,
            }}
          />
          
          {/* FCF line */}
          <Line 
            type="monotone" 
            dataKey="fcf" 
            name="FCF" 
            stroke="#f59e0b" 
            strokeWidth={2} 
            strokeDasharray="4 4"
            dot={{ r: 2, fill: '#f59e0b' }} 
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Momentum indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-slate-700/50">
        <div className={`w-2 h-2 rounded-full ${momentum > 0 ? 'bg-emerald-500 animate-pulse' : momentum < 0 ? 'bg-red-500' : 'bg-slate-500'}`} />
        <span className="text-[10px] font-medium text-slate-300">
          {momentum > 5 ? 'Accelerating' : momentum > 0 ? 'Gaining' : momentum < -5 ? 'Decelerating' : momentum < 0 ? 'Slowing' : 'Steady'}
        </span>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 text-[9px]">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-emerald-500 rounded" /> Revenue
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-violet-500 rounded" /> Earnings
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-amber-500 rounded opacity-70" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #f59e0b 0, #f59e0b 3px, transparent 3px, transparent 6px)' }} /> FCF
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getGrowthSummaryOutput(data: GrowthSummaryData): CardOutput {
  const { symbol, asOf, growthScore, growthTier, metrics, forwardEstimates, peerComparison, historicalGrowth } = data;
  
  // Helper for growth interpretation
  const growthInterp = (value: number): MetricInterpretation => {
    if (value >= 20) return "excellent";
    if (value >= 10) return "good";
    if (value >= 0) return "fair";
    return "poor";
  };
  
  // Build key metrics
  const keyMetrics: MetricValue[] = [
    createMetric("Revenue Growth (3Y)", "revenue_growth_3y", metrics.revenueGrowth3Y, growthInterp(metrics.revenueGrowth3Y), {
      format: "percent",
      priority: 1,
      benchmark: { value: peerComparison.avgRevenueGrowth, label: "Peer Avg", comparison: metrics.revenueGrowth3Y > peerComparison.avgRevenueGrowth ? "above" : "below" },
    }),
    createMetric("EPS Growth (3Y)", "eps_growth_3y", metrics.epsGrowth3Y, growthInterp(metrics.epsGrowth3Y), {
      format: "percent",
      priority: 1,
      benchmark: { value: peerComparison.avgEpsGrowth, label: "Peer Avg", comparison: metrics.epsGrowth3Y > peerComparison.avgEpsGrowth ? "above" : "below" },
    }),
    createMetric("FCF Growth (3Y)", "fcf_growth_3y", metrics.fcfGrowth3Y, growthInterp(metrics.fcfGrowth3Y), {
      format: "percent",
      priority: 2,
    }),
    createMetric("Revenue Growth (5Y)", "revenue_growth_5y", metrics.revenueGrowth5Y, growthInterp(metrics.revenueGrowth5Y), {
      format: "percent",
      priority: 2,
    }),
    createMetric("Forward EPS Growth", "eps_growth_ntm", forwardEstimates.epsGrowthNTM, growthInterp(forwardEstimates.epsGrowthNTM), {
      format: "percent",
      priority: 1,
      trend: {
        direction: forwardEstimates.analystRevisions > 0 ? "up" : forwardEstimates.analystRevisions < 0 ? "down" : "flat",
        period: "analyst revisions",
        change: forwardEstimates.analystRevisions,
      },
    }),
    createMetric("Book Value Growth (5Y)", "book_value_growth_5y", metrics.bookValueGrowth5Y, growthInterp(metrics.bookValueGrowth5Y), {
      format: "percent",
      priority: 3,
    }),
  ];
  
  // Build insights
  const insights: Insight[] = [];
  
  // Tier insight
  const tierInsights: Record<string, { type: "strength" | "weakness" | "observation", text: string }> = {
    "Hyper Growth": { type: "strength", text: `${symbol} is a hyper-growth company with exceptional expansion rates` },
    "High Growth": { type: "strength", text: `${symbol} demonstrates strong growth above market averages` },
    "Moderate": { type: "observation", text: `${symbol} shows moderate growth in line with market` },
    "Slow": { type: "weakness", text: `${symbol} is showing slower growth - may be maturing` },
    "Declining": { type: "weakness", text: `${symbol} has negative growth - fundamentals need review` },
  };
  insights.push(createInsight(tierInsights[growthTier].type, tierInsights[growthTier].text, 1));
  
  // Revenue vs EPS comparison
  if (metrics.epsGrowth3Y > metrics.revenueGrowth3Y + 5) {
    insights.push(createInsight("strength", "EPS growing faster than revenue - improving margins", 2, ["eps_growth_3y", "revenue_growth_3y"]));
  } else if (metrics.revenueGrowth3Y > metrics.epsGrowth3Y + 5) {
    insights.push(createInsight("observation", "Revenue outpacing EPS - watch for margin compression", 2, ["eps_growth_3y", "revenue_growth_3y"]));
  }
  
  // Peer comparison
  if (metrics.revenueGrowth3Y > peerComparison.avgRevenueGrowth * 1.5) {
    insights.push(createInsight("strength", `Revenue growth ${((metrics.revenueGrowth3Y / peerComparison.avgRevenueGrowth - 1) * 100).toFixed(0)}% above peer average`, 2, ["revenue_growth_3y"]));
  } else if (metrics.revenueGrowth3Y < peerComparison.avgRevenueGrowth * 0.5) {
    insights.push(createInsight("weakness", "Revenue growth significantly lagging peers", 2, ["revenue_growth_3y"]));
  }
  
  // Analyst revisions
  if (forwardEstimates.analystRevisions > 5) {
    insights.push(createInsight("opportunity", "Analysts raising earnings estimates - positive momentum", 2, ["eps_growth_ntm"]));
  } else if (forwardEstimates.analystRevisions < -5) {
    insights.push(createInsight("risk", "Analysts cutting earnings estimates - headwinds ahead", 2, ["eps_growth_ntm"]));
  }
  
  // FCF vs EPS comparison
  if (metrics.fcfGrowth3Y > metrics.epsGrowth3Y) {
    insights.push(createInsight("strength", "FCF growth exceeding EPS growth - quality earnings", 3, ["fcf_growth_3y"]));
  } else if (metrics.fcfGrowth3Y < metrics.epsGrowth3Y - 10) {
    insights.push(createInsight("risk", "FCF lagging EPS growth - potential earnings quality concern", 3, ["fcf_growth_3y"]));
  }
  
  // Suggested cards
  const suggestedCards = growthTier === "Hyper Growth" || growthTier === "High Growth"
    ? ["earnings-quality", "valuation-summary", "capital-allocation"]
    : growthTier === "Declining"
    ? ["piotroski-score", "financial-health-dna", "risk-health-dashboard"]
    : ["earnings-stability", "efficiency-dashboard", "peer-comparison"];
  
  // Build headline
  const headline = `${symbol} classified as ${growthTier} with ${metrics.revenueGrowth3Y.toFixed(1)}% revenue growth (3Y CAGR)`;
  
  // Calculate sentiment
  const sentiment = growthTier === "Hyper Growth" || growthTier === "High Growth" ? "bullish" 
    : growthTier === "Declining" ? "bearish" : "neutral";
  
  return {
    cardId: "growth-summary",
    cardCategory: "growth",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: Math.min(5, Math.max(1, Math.round(growthScore / 20))) as SignalStrength,
    keyMetrics,
    insights,
    primaryChart: {
      type: "bar",
      title: "Historical Growth",
      data: historicalGrowth,
      xKey: "year",
      yKey: ["revenue", "earnings", "fcf"],
    },
    suggestedCards,
    tags: ["growth", "revenue", "eps", growthTier.toLowerCase().replace(" ", "-")],
    scoreContribution: {
      category: "growth",
      score: growthScore,
      weight: 0.20,
    },
  };
}

interface Props {
  data?: GrowthSummaryData;
  isLoading?: boolean;
  error?: string | null;
}

export default function GrowthSummaryCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES.growth;
  
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">{categoryStyle.icon}</span>
            Growth Summary
          </CardTitle>
          <CardDescription>Analyzing growth metrics…</CardDescription>
        </CardHeader>
        <CardContent><Skeleton className="h-48 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">{categoryStyle.icon}</span>
            Growth Summary
          </CardTitle>
          <CardDescription className={error ? "text-red-400" : ""}>{error || "No data"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { symbol, asOf, growthScore, growthTier, metrics, historicalGrowth, forwardEstimates, peerComparison } = data;

  const tierConfig: Record<GrowthSummaryData['growthTier'], { bg: string; color: string }> = {
    "Hyper Growth": { bg: "bg-purple-500/20", color: "#a855f7" },
    "High Growth": { bg: "bg-emerald-500/20", color: "#10b981" },
    "Moderate": { bg: "bg-blue-500/20", color: "#3b82f6" },
    "Slow": { bg: "bg-amber-500/20", color: "#f59e0b" },
    "Declining": { bg: "bg-red-500/20", color: "#ef4444" },
  };

  const metricsList = [
    { label: "Rev 3Y CAGR", value: `${metrics.revenueGrowth3Y.toFixed(1)}%`, trend: metrics.revenueGrowth3Y > peerComparison.avgRevenueGrowth ? "up" as const : "down" as const },
    { label: "Rev 5Y CAGR", value: `${metrics.revenueGrowth5Y.toFixed(1)}%` },
    { label: "EPS 3Y CAGR", value: `${metrics.epsGrowth3Y.toFixed(1)}%`, trend: metrics.epsGrowth3Y > peerComparison.avgEpsGrowth ? "up" as const : "down" as const },
    { label: "EPS 5Y CAGR", value: `${metrics.epsGrowth5Y.toFixed(1)}%` },
    { label: "FCF 3Y CAGR", value: `${metrics.fcfGrowth3Y.toFixed(1)}%` },
    { label: "Book Value 5Y", value: `${metrics.bookValueGrowth5Y.toFixed(1)}%` },
  ];

  return (
    <Card className={`overflow-hidden border-l-4`} style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Growth Summary
              <span 
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${tierConfig[growthTier].bg}`}
                style={{ 
                  color: tierConfig[growthTier].color,
                  borderColor: `${tierConfig[growthTier].color}50`,
                }}
              >
                {growthTier}
              </span>
            </CardTitle>
            <CardDescription>{symbol} • Historical & forward growth • As of {asOf}</CardDescription>
          </div>
          <div className="text-right bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
            <div className="text-2xl font-bold" style={{ color: categoryStyle.accent }}>{Math.round(growthScore)}</div>
            <div className="text-[10px] text-slate-400 uppercase">Growth Score</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metricsList} columns={6} />

        {/* Signature Growth Trajectory */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 font-medium mb-1">Growth Trajectory (YoY %)</div>
          <GrowthTrajectory data={historicalGrowth} growthTier={growthTier} />
        </div>

        {/* Forward Estimates */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg p-3 border border-emerald-500/20">
            <div className="text-[9px] uppercase text-emerald-400/80 font-medium">NTM Revenue</div>
            <div className="text-lg font-bold text-emerald-400">
              {forwardEstimates.revenueGrowthNTM > 0 ? "+" : ""}{forwardEstimates.revenueGrowthNTM.toFixed(1)}%
            </div>
          </div>
          <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-lg p-3 border border-violet-500/20">
            <div className="text-[9px] uppercase text-violet-400/80 font-medium">NTM EPS</div>
            <div className="text-lg font-bold text-violet-400">
              {forwardEstimates.epsGrowthNTM > 0 ? "+" : ""}{forwardEstimates.epsGrowthNTM.toFixed(1)}%
            </div>
          </div>
          <div className={`rounded-lg p-3 border ${forwardEstimates.analystRevisions > 0 ? 'bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20' : forwardEstimates.analystRevisions < 0 ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20' : 'bg-slate-800/30 border-slate-700/30'}`}>
            <div className="text-[9px] uppercase text-slate-400 font-medium">Est. Revisions</div>
            <div className={`text-lg font-bold ${forwardEstimates.analystRevisions > 0 ? "text-emerald-400" : forwardEstimates.analystRevisions < 0 ? "text-red-400" : "text-slate-400"}`}>
              {forwardEstimates.analystRevisions > 0 ? "+" : ""}{forwardEstimates.analystRevisions.toFixed(1)}%
            </div>
          </div>
        </div>

        <InterpretationFooter variant={growthTier.includes("Growth") ? "success" : growthTier === "Declining" ? "warning" : "neutral"}>
          {growthTier} profile with {Math.round(growthScore)}/100 score.
          Revenue CAGR is {metrics.revenueGrowth3Y > peerComparison.avgRevenueGrowth ? "above" : "below"} peer avg ({peerComparison.avgRevenueGrowth.toFixed(1)}%).
          Forward estimates show {forwardEstimates.analystRevisions > 0 ? "upward" : "downward"} revisions.
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
