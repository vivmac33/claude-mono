import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RiskBadge, RiskType } from "@/components/ui/status-badges";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface CrashWarningData {
  symbol: string;
  asOf: string;
  // Core metrics from rule-based crash analysis
  rollingReturn10D: number;  // 10-day rolling mean return (%)
  rollingVolatility10D: number;  // 10-day rolling volatility (%)
  currentDrawdown: number;  // Current drawdown from peak (%)
  maxDrawdown52W: number;  // Max drawdown in 52 weeks (%)
  // Signal
  signal: "safe" | "caution" | "warning" | "danger";
  // Contributing factors
  factors: Array<{
    name: string;
    status: "ok" | "watch" | "alert";
    value: string;
  }>;
  // Historical crash proximity
  crashProximity: number;  // 0-100, how close current conditions are to historical crashes
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getCrashWarningOutput(data: CrashWarningData): CardOutput {
  const { symbol, asOf, rollingReturn10D, rollingVolatility10D, currentDrawdown, signal, crashProximity, factors } = data;
  
  // Signal determines sentiment
  const sentiment = signal === "safe" ? "bullish" : signal === "danger" ? "bearish" : "neutral";
  const signalStrength = signal === "danger" ? 5 : signal === "warning" ? 4 : signal === "caution" ? 3 : 2;
  
  const keyMetrics: MetricValue[] = [
    createMetric("10D Return", "cw_return_10d", rollingReturn10D, 
      rollingReturn10D > 0 ? "positive" : rollingReturn10D > -0.5 ? "neutral" : "negative",
      { format: "percent", priority: 1 }),
    createMetric("10D Volatility", "cw_vol_10d", rollingVolatility10D, 
      rollingVolatility10D < 1.5 ? "low" : rollingVolatility10D < 2.5 ? "moderate" : "high",
      { format: "percent", priority: 1 }),
    createMetric("Drawdown", "cw_drawdown", currentDrawdown, 
      currentDrawdown < 5 ? "safe" : currentDrawdown < 15 ? "moderate" : "severe",
      { format: "percent", priority: 1 }),
    createMetric("Crash Proximity", "cw_proximity", crashProximity, 
      crashProximity < 30 ? "safe" : crashProximity < 60 ? "elevated" : "high",
      { format: "score", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // Signal-based insights
  if (signal === "danger") {
    insights.push(createInsight("risk", `⚠️ High crash risk detected - conditions match historical crash patterns`, 1, ["cw_proximity"]));
  } else if (signal === "warning") {
    insights.push(createInsight("risk", `Elevated risk - 10D return ${rollingReturn10D.toFixed(2)}% with ${rollingVolatility10D.toFixed(1)}% volatility`, 1, ["cw_return_10d", "cw_vol_10d"]));
  } else if (signal === "caution") {
    insights.push(createInsight("observation", `Caution - some risk factors elevated but no immediate danger`, 2, ["cw_return_10d"]));
  } else {
    insights.push(createInsight("strength", `✓ No crash warning signals - conditions stable`, 2));
  }
  
  // Drawdown insight
  if (currentDrawdown > 15) {
    insights.push(createInsight("risk", `Significant drawdown: -${currentDrawdown.toFixed(1)}% from recent high`, 2, ["cw_drawdown"]));
  }
  
  // Factor alerts
  const alertFactors = factors.filter(f => f.status === "alert");
  if (alertFactors.length > 0) {
    insights.push(createInsight("observation", `${alertFactors.length} factor(s) in alert: ${alertFactors.map(f => f.name).join(", ")}`, 3));
  }
  
  const headline = `${symbol} crash warning: ${signal.toUpperCase()} - ${crashProximity}% proximity to historical crash conditions`;
  
  return {
    cardId: "crash-warning-mini",
    cardCategory: "mini",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["drawdown-var", "volatility-regime", "risk-health-dashboard"],
    tags: ["risk", "crash", "volatility", signal],
    scoreContribution: {
      category: "risk",
      score: 100 - crashProximity,
      weight: 0.15,
    },
  };
}

interface Props {
  data?: CrashWarningData;
  isLoading?: boolean;
  error?: string | null;
}

function getSignalRiskType(signal: CrashWarningData["signal"]): RiskType {
  switch (signal) {
    case "safe": return "low";
    case "caution": return "medium";
    case "warning": return "high";
    case "danger": return "extreme";
  }
}

export default function CrashWarningMini({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['mini'];

  if (isLoading) {
    return (
      <Card className="w-full max-w-xs border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Crash Warning</CardTitle>
        </CardHeader>
        <CardContent><Skeleton className="h-32 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="w-full max-w-xs border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Crash Warning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-slate-500">{error || "No data"}</div>
        </CardContent>
      </Card>
    );
  }

  const { symbol, signal, crashProximity, rollingReturn10D, rollingVolatility10D, currentDrawdown, factors } = data;

  // Traffic light colors and labels
  const signalConfig = {
    safe: { 
      color: "bg-emerald-500", 
      textColor: "text-emerald-400",
      bgColor: "bg-emerald-900/30",
      borderColor: "border-emerald-700/50",
      label: "SAFE", 
      icon: "✓",
      description: "No crash warning signals"
    },
    caution: { 
      color: "bg-amber-500", 
      textColor: "text-amber-400",
      bgColor: "bg-amber-900/30",
      borderColor: "border-amber-700/50",
      label: "CAUTION", 
      icon: "⚡",
      description: "Some factors elevated"
    },
    warning: { 
      color: "bg-orange-500", 
      textColor: "text-orange-400",
      bgColor: "bg-orange-900/30",
      borderColor: "border-orange-700/50",
      label: "WARNING", 
      icon: "⚠️",
      description: "Risk conditions developing"
    },
    danger: { 
      color: "bg-red-500", 
      textColor: "text-red-400",
      bgColor: "bg-red-900/30",
      borderColor: "border-red-700/50",
      label: "DANGER", 
      icon: "🚨",
      description: "High crash risk detected"
    },
  };

  const config = signalConfig[signal];

  const statusColors = {
    ok: "bg-emerald-500",
    watch: "bg-amber-500",
    alert: "bg-red-500",
  };

  return (
    <Card className="w-full max-w-xs border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm flex items-center gap-2">
            Crash Warning
            <RiskBadge risk={getSignalRiskType(signal)} size="sm" />
          </CardTitle>
          <span className="text-xs text-slate-400">{symbol}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Traffic Light Signal */}
        <div className={`rounded-lg p-3 border ${config.bgColor} ${config.borderColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Traffic Light */}
              <div className="flex flex-col gap-1">
                <div className={`w-4 h-4 rounded-full ${signal === "danger" ? "bg-red-500 shadow-red-500/50 shadow-lg" : "bg-red-900/30"}`} />
                <div className={`w-4 h-4 rounded-full ${signal === "warning" || signal === "caution" ? "bg-amber-500 shadow-amber-500/50 shadow-lg" : "bg-amber-900/30"}`} />
                <div className={`w-4 h-4 rounded-full ${signal === "safe" ? "bg-emerald-500 shadow-emerald-500/50 shadow-lg" : "bg-emerald-900/30"}`} />
              </div>
              <div>
                <div className={`text-lg font-bold ${config.textColor}`}>
                  {config.icon} {config.label}
                </div>
                <div className="text-[10px] text-slate-400">{config.description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold ${config.textColor}`}>{Math.round(crashProximity)}%</div>
              <div className="text-[9px] text-slate-500">Crash Proximity</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className={`text-sm font-semibold ${rollingReturn10D < -0.5 ? "text-red-400" : rollingReturn10D < 0 ? "text-amber-400" : "text-emerald-400"}`}>
              {rollingReturn10D > 0 ? "+" : ""}{rollingReturn10D.toFixed(2)}%
            </div>
            <div className="text-[9px] text-slate-500">10D Return</div>
          </div>
          <div className="text-center">
            <div className={`text-sm font-semibold ${rollingVolatility10D > 2 ? "text-red-400" : rollingVolatility10D > 1.5 ? "text-amber-400" : "text-emerald-400"}`}>
              {rollingVolatility10D.toFixed(1)}%
            </div>
            <div className="text-[9px] text-slate-500">10D Vol</div>
          </div>
          <div className="text-center">
            <div className={`text-sm font-semibold ${currentDrawdown > 15 ? "text-red-400" : currentDrawdown > 5 ? "text-amber-400" : "text-emerald-400"}`}>
              -{currentDrawdown.toFixed(1)}%
            </div>
            <div className="text-[9px] text-slate-500">Drawdown</div>
          </div>
        </div>

        {/* Factors */}
        <div className="pt-2 border-t border-slate-700/50">
          <div className="text-[9px] text-slate-500 uppercase mb-1.5">Risk Factors</div>
          <div className="flex flex-wrap gap-1.5">
            {factors.map((factor, i) => (
              <div key={i} className="flex items-center gap-1 text-[9px] text-slate-400 bg-slate-800/50 px-1.5 py-0.5 rounded">
                <span className={`w-1.5 h-1.5 rounded-full ${statusColors[factor.status]}`} />
                {factor.name}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
