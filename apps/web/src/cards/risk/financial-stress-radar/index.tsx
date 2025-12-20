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
import { InterpretationFooter, SignalBox } from "@/components/shared/InterpretationFooter";
import { RadialGauge } from "@/components/shared/ScoreGauge";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PolarRadiusAxis,
} from "recharts";

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES, riskLevelConfig } from "@/lib/chartTheme";

export interface FinancialStressData {
  symbol: string;
  asOf: string;
  stressScore: number;
  riskLevel: "Safe" | "Watch" | "Elevated" | "Critical";
  indicators: {
    interestCoverage: { value: number; threshold: number; status: "ok" | "warning" | "critical" };
    currentRatio: { value: number; threshold: number; status: "ok" | "warning" | "critical" };
    quickRatio: { value: number; threshold: number; status: "ok" | "warning" | "critical" };
    cashBurn: { value: number; threshold: number; status: "ok" | "warning" | "critical" };
    debtToEbitda: { value: number; threshold: number; status: "ok" | "warning" | "critical" };
    workingCapital: { value: number; threshold: number; status: "ok" | "warning" | "critical" };
  };
  radarData: Array<{ metric: string; value: number; fullMark: number }>;
  earlyWarnings: Array<{
    warning: string;
    severity: "low" | "medium" | "high";
    trend: "improving" | "stable" | "worsening";
  }>;
  peerComparison: {
    company: number;
    sectorMedian: number;
    sectorWorst: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getFinancialStressRadarOutput(data: FinancialStressData): CardOutput {
  const { symbol, asOf, stressScore, riskLevel, indicators, earlyWarnings, peerComparison } = data;
  
  // INVERSE sentiment: low stress = bullish, high stress = bearish
  const sentiment = riskLevel === "Safe" ? "bullish" : riskLevel === "Critical" || riskLevel === "Elevated" ? "bearish" : "neutral";
  const signalStrength = riskLevel === "Safe" ? 5 : riskLevel === "Watch" ? 4 : riskLevel === "Elevated" ? 2 : 1;
  
  const criticalCount = Object.values(indicators).filter(i => i.status === "critical").length;
  const warningCount = Object.values(indicators).filter(i => i.status === "warning").length;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Stress Score", "fsr_stress_score", stressScore, 
      stressScore < 20 ? "safe" : stressScore < 40 ? "moderate" : stressScore < 60 ? "risky" : "dangerous",
      { format: "score", priority: 1 }),
    createMetric("Interest Coverage", "fsr_interest_coverage", indicators.interestCoverage.value, 
      indicators.interestCoverage.status === "ok" ? "safe" : indicators.interestCoverage.status === "warning" ? "moderate" : "dangerous",
      { format: "ratio", priority: 1, unit: "x" }),
    createMetric("Current Ratio", "fsr_current_ratio", indicators.currentRatio.value, 
      indicators.currentRatio.status === "ok" ? "safe" : indicators.currentRatio.status === "warning" ? "moderate" : "risky",
      { format: "ratio", priority: 1, unit: "x" }),
    createMetric("Quick Ratio", "fsr_quick_ratio", indicators.quickRatio.value, 
      indicators.quickRatio.status === "ok" ? "safe" : indicators.quickRatio.status === "warning" ? "moderate" : "risky",
      { format: "ratio", priority: 2, unit: "x" }),
    createMetric("Debt/EBITDA", "fsr_debt_ebitda", indicators.debtToEbitda.value, 
      indicators.debtToEbitda.status === "ok" ? "safe" : indicators.debtToEbitda.status === "warning" ? "moderate" : "risky",
      { format: "ratio", priority: 2, unit: "x" }),
    createMetric("vs Sector Median", "fsr_vs_sector", peerComparison.company - peerComparison.sectorMedian, 
      peerComparison.company < peerComparison.sectorMedian ? "good" : "fair",
      { format: "number", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Overall risk level
  if (riskLevel === "Safe") {
    insights.push(createInsight("strength", `Safe financial position with stress score of ${stressScore} - all indicators healthy`, 1, ["fsr_stress_score"]));
  } else if (riskLevel === "Critical") {
    insights.push(createInsight("risk", `Critical financial stress (score: ${stressScore}) - ${criticalCount} indicators in danger zone`, 1, ["fsr_stress_score"]));
  } else if (riskLevel === "Elevated") {
    insights.push(createInsight("risk", `Elevated financial stress (score: ${stressScore}) - monitor liquidity closely`, 1, ["fsr_stress_score"]));
  } else {
    insights.push(createInsight("observation", `Financial stress score of ${stressScore} - some indicators warrant monitoring`, 1, ["fsr_stress_score"]));
  }
  
  // Critical indicators
  if (indicators.interestCoverage.status === "critical") {
    insights.push(createInsight("risk", `Critical: Interest coverage (${indicators.interestCoverage.value.toFixed(1)}x) below safe threshold`, 1, ["fsr_interest_coverage"]));
  }
  if (indicators.currentRatio.status === "critical") {
    insights.push(createInsight("risk", `Critical: Current ratio (${indicators.currentRatio.value.toFixed(2)}x) indicates liquidity stress`, 1, ["fsr_current_ratio"]));
  }
  
  // Early warnings
  const highSeverityWarnings = earlyWarnings.filter(w => w.severity === "high");
  if (highSeverityWarnings.length > 0) {
    insights.push(createInsight("risk", `High-severity warning: ${highSeverityWarnings[0].warning}`, 2));
  }
  
  // Peer comparison
  if (peerComparison.company < peerComparison.sectorMedian * 0.7) {
    insights.push(createInsight("strength", `Better than sector: stress score ${peerComparison.company} vs median ${peerComparison.sectorMedian}`, 2, ["fsr_vs_sector"]));
  } else if (peerComparison.company > peerComparison.sectorMedian * 1.3) {
    insights.push(createInsight("weakness", `Worse than sector: stress score ${peerComparison.company} vs median ${peerComparison.sectorMedian}`, 2, ["fsr_vs_sector"]));
  }
  
  const headline = `${symbol} financial stress ${riskLevel.toLowerCase()} with ${criticalCount} critical and ${warningCount} warning indicators`;
  
  return {
    cardId: "financial-stress-radar",
    cardCategory: "risk",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    primaryChart: { type: "radar", title: "Stress Indicators", data: data.radarData },
    suggestedCards: riskLevel === "Safe"
      ? ["valuation-summary", "growth-summary", "piotroski-score"]
      : ["bankruptcy-health", "leverage-history", "working-capital-health"],
    tags: ["financial-stress", "liquidity", riskLevel.toLowerCase()],
    scoreContribution: {
      category: "risk",
      score: 100 - stressScore, // Inverse: low stress = high score
      weight: 0.20,
    },
  };
}

interface Props {
  data?: FinancialStressData;
  isLoading?: boolean;
  error?: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// SIGNATURE THREAT RADAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function ThreatRadar({ data, riskLevel }: { data: FinancialStressData['radarData']; riskLevel: string }) {
  const isCritical = riskLevel === 'Critical' || riskLevel === 'Elevated';
  const categoryStyle = CATEGORY_STYLES.risk;
  
  return (
    <div className="relative h-56">
      {/* Pulsing danger rings for critical status */}
      {isCritical && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-32 h-32 rounded-full border-2 border-red-500/20 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute w-40 h-40 rounded-full border border-red-500/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
        </div>
      )}
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          {/* Gradient definitions */}
          <defs>
            {/* Radar stroke gradient */}
            <linearGradient id="threatRadarStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={isCritical ? '#ef4444' : '#6366f1'} />
              <stop offset="100%" stopColor={isCritical ? '#f97316' : '#14b8a6'} />
            </linearGradient>
            {/* Radar fill gradient */}
            <radialGradient id="threatRadarFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isCritical ? '#ef4444' : '#6366f1'} stopOpacity="0.4" />
              <stop offset="100%" stopColor={isCritical ? '#f97316' : '#14b8a6'} stopOpacity="0.1" />
            </radialGradient>
            {/* Concentric zone gradients */}
            <radialGradient id="zoneSafe" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </radialGradient>
            <radialGradient id="zoneWatch" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
            </radialGradient>
            <radialGradient id="zoneDanger" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
            </radialGradient>
          </defs>
          
          {/* Concentric threat zones */}
          <PolarGrid 
            gridType="polygon"
            stroke="#334155"
            strokeOpacity={0.4}
            radialLines={false}
          />
          
          {/* Custom zone circles */}
          <circle cx="50%" cy="50%" r="25%" fill="url(#zoneDanger)" />
          <circle cx="50%" cy="50%" r="50%" fill="url(#zoneWatch)" />
          <circle cx="50%" cy="50%" r="75%" fill="url(#zoneSafe)" />
          
          <PolarAngleAxis 
            dataKey="metric" 
            tick={{ 
              fill: '#94a3b8', 
              fontSize: 9,
              fontWeight: 500,
            }}
            tickLine={false}
          />
          
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={false}
            axisLine={false}
          />
          
          {/* Main radar with gradient styling */}
          <Radar
            name="Risk Score"
            dataKey="value"
            stroke="url(#threatRadarStroke)"
            fill="url(#threatRadarFill)"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: '#ffffff',
              strokeWidth: 2,
              stroke: isCritical ? '#ef4444' : '#6366f1',
            }}
            activeDot={{
              r: 6,
              fill: isCritical ? '#ef4444' : '#14b8a6',
              stroke: '#ffffff',
              strokeWidth: 2,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Zone legend */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 text-[9px]">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500/50" /> Safe
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500/50" /> Watch
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500/50" /> Danger
        </span>
      </div>
    </div>
  );
}

export default function FinancialStressRadarCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES.risk;
  
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">{categoryStyle.icon}</span>
            Financial Stress Radar
          </CardTitle>
          <CardDescription>Scanning for distress signals…</CardDescription>
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
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">{categoryStyle.icon}</span>
            Financial Stress Radar
          </CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">{categoryStyle.icon}</span>
            Financial Stress Radar
          </CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok": return "text-emerald-400";
      case "warning": return "text-amber-400";
      case "critical": return "text-red-400";
      default: return "text-slate-400";
    }
  };

  const metrics = [
    { label: "Interest Coverage", value: `${data.indicators.interestCoverage.value.toFixed(1)}x`, trend: data.indicators.interestCoverage.status === "ok" ? "up" as const : "down" as const },
    { label: "Current Ratio", value: `${data.indicators.currentRatio.value.toFixed(2)}x` },
    { label: "Quick Ratio", value: `${data.indicators.quickRatio.value.toFixed(2)}x` },
    { label: "Debt/EBITDA", value: `${data.indicators.debtToEbitda.value.toFixed(1)}x`, trend: data.indicators.debtToEbitda.status === "ok" ? "up" as const : "down" as const },
  ];

  const riskConfig = riskLevelConfig[data.riskLevel.toLowerCase() as keyof typeof riskLevelConfig] || riskLevelConfig.watch;

  return (
    <Card className={`overflow-hidden border-t-2`} style={{ borderTopColor: riskConfig.color }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Financial Stress Radar
              <Badge 
                className="ml-2"
                style={{ 
                  backgroundColor: `${riskConfig.color}20`,
                  color: riskConfig.color,
                  borderColor: `${riskConfig.color}50`,
                }}
              >
                {data.riskLevel}
              </Badge>
            </CardTitle>
            <CardDescription>
              {data.symbol} • Early warning indicators • As of {data.asOf}
            </CardDescription>
          </div>
          <RadialGauge value={100 - data.stressScore} max={100} label="Health" size={70} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        {/* Signature Threat Radar */}
        <ThreatRadar data={data.radarData} riskLevel={data.riskLevel} />

        {/* Indicator Status Grid */}
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(data.indicators).map(([key, indicator]) => (
            <div key={key} className="rounded-lg bg-slate-800/50 p-2 border border-slate-700/50">
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-slate-500 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className={`w-2 h-2 rounded-full ${indicator.status === "ok" ? "bg-emerald-500" : indicator.status === "warning" ? "bg-amber-500" : "bg-red-500"}`} />
              </div>
              <div className={`text-sm font-semibold ${getStatusColor(indicator.status)}`}>
                {indicator.value.toFixed(2)}
              </div>
              <div className="text-[9px] text-slate-500">vs {indicator.threshold} threshold</div>
            </div>
          ))}
        </div>

        {/* Early Warnings */}
        {data.earlyWarnings.length > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] uppercase text-slate-500 font-medium">Early Warning Signals</div>
            {data.earlyWarnings.map((warning, i) => (
              <SignalBox
                key={i}
                signal={warning.severity === "high" ? "bearish" : warning.severity === "medium" ? "caution" : "neutral"}
                title={warning.warning}
                description={`Trend: ${warning.trend}`}
              />
            ))}
          </div>
        )}

        {/* Peer Comparison */}
        <div className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
          <span className="text-[10px] text-slate-500 uppercase font-medium">vs Sector</span>
          <div className="flex items-center gap-3">
            <span className="text-xs">
              <span className="text-slate-500">Company:</span>{" "}
              <span className={data.peerComparison.company < data.peerComparison.sectorMedian ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
                {data.peerComparison.company.toFixed(0)}
              </span>
            </span>
            <span className="text-xs text-slate-600">|</span>
            <span className="text-xs">
              <span className="text-slate-500">Median:</span> <span className="text-slate-300">{data.peerComparison.sectorMedian.toFixed(0)}</span>
            </span>
          </div>
        </div>

        <InterpretationFooter variant={data.riskLevel === "Safe" ? "success" : data.riskLevel === "Watch" ? "info" : "warning"}>
          {data.riskLevel === "Safe" || data.riskLevel === "Watch"
            ? `Financial health indicators are ${data.riskLevel === "Safe" ? "within safe ranges" : "acceptable but warrant monitoring"}. Interest coverage of ${data.indicators.interestCoverage.value.toFixed(1)}x provides ${data.indicators.interestCoverage.value >= 3 ? "comfortable" : "adequate"} debt service capacity.`
            : `Elevated stress score of ${data.stressScore} indicates financial vulnerability. ${data.earlyWarnings.length} warning signal(s) detected. Monitor liquidity closely and evaluate refinancing options.`
          }
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
