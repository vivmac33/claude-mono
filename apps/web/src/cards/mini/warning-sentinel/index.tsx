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

export interface WarningSentinelData {
  symbol: string;
  asOf: string;
  alerts: Array<{
    type: "critical" | "warning" | "info";
    message: string;
    metric?: string;
  }>;
  riskScore: number;
  watchItems: Array<{
    item: string;
    status: "ok" | "watch" | "alert";
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getWarningSentinelOutput(data: WarningSentinelData): CardOutput {
  const { symbol, asOf, alerts, riskScore, watchItems } = data;
  
  const criticalCount = alerts.filter(a => a.type === "critical").length;
  const warningCount = alerts.filter(a => a.type === "warning").length;
  const alertItems = watchItems.filter(w => w.status === "alert").length;
  
  // Inverse: low risk score = bullish, high risk = bearish
  const sentiment = riskScore < 30 ? "bullish" : riskScore > 60 ? "bearish" : "neutral";
  const signalStrength = criticalCount > 0 ? 5 : warningCount > 0 ? 4 : 3;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Risk Score", "ws_risk", riskScore, 
      riskScore < 30 ? "safe" : riskScore < 60 ? "moderate" : "risky",
      { format: "score", priority: 1 }),
    createMetric("Critical Alerts", "ws_critical", criticalCount, 
      criticalCount === 0 ? "safe" : "dangerous",
      { format: "number", priority: 1 }),
    createMetric("Warnings", "ws_warnings", warningCount, 
      warningCount === 0 ? "safe" : warningCount < 3 ? "moderate" : "risky",
      { format: "number", priority: 2 }),
    createMetric("Alert Items", "ws_alert_items", alertItems, 
      alertItems === 0 ? "safe" : "risky",
      { format: "number", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // Risk score
  if (riskScore > 70) {
    insights.push(createInsight("risk", `High risk score (${riskScore}/100) - multiple concerns identified`, 1, ["ws_risk"]));
  } else if (riskScore < 30) {
    insights.push(createInsight("strength", `Low risk score (${riskScore}/100) - no major concerns`, 2, ["ws_risk"]));
  }
  
  // Critical alerts
  if (criticalCount > 0) {
    const criticalAlerts = alerts.filter(a => a.type === "critical");
    insights.push(createInsight("risk", `${criticalCount} critical alert(s): ${criticalAlerts[0].message}`, 1, ["ws_critical"]));
  }
  
  // Warning alerts
  if (warningCount > 0) {
    const warningAlerts = alerts.filter(a => a.type === "warning");
    insights.push(createInsight("observation", `${warningCount} warning(s): ${warningAlerts[0].message}`, 2, ["ws_warnings"]));
  }
  
  // No alerts
  if (alerts.length === 0) {
    insights.push(createInsight("strength", "No active alerts - monitoring healthy", 2));
  }
  
  const headline = `${symbol} risk ${riskScore}/100: ${criticalCount} critical, ${warningCount} warnings`;
  
  return {
    cardId: "warning-sentinel",
    cardCategory: "mini",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["financial-stress-radar", "risk-health-dashboard", "bankruptcy-health"],
    tags: ["risk", "alerts", riskScore > 60 ? "high-risk" : riskScore < 30 ? "low-risk" : "moderate-risk"],
    scoreContribution: {
      category: "risk",
      score: 100 - riskScore, // Inverse: low risk = high score
      weight: 0.10,
    },
  };
}

interface Props {
  data?: WarningSentinelData;
  isLoading?: boolean;
  error?: string | null;
}

export default function WarningSentinelMini({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['mini'];

  if (isLoading) {
    return (
      <Card className="w-full max-w-xs border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Warning Sentinel</CardTitle>
        </CardHeader>
        <CardContent><Skeleton className="h-24 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="w-full max-w-xs border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Warning Sentinel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-slate-500">{error || "No data"}</div>
        </CardContent>
      </Card>
    );
  }

  const { symbol, alerts, riskScore, watchItems } = data;

  const alertColors = {
    critical: "bg-red-900/40 border-red-700/50 text-red-300",
    warning: "bg-amber-900/40 border-amber-700/50 text-amber-300",
    info: "bg-blue-900/40 border-blue-700/50 text-blue-300",
  };

  const alertIcons = {
    critical: "🚨",
    warning: "⚠️",
    info: "ℹ️",
  };

  const statusColors = {
    ok: "bg-emerald-500",
    watch: "bg-amber-500",
    alert: "bg-red-500",
  };

  const criticalCount = alerts.filter(a => a.type === "critical").length;
  const warningCount = alerts.filter(a => a.type === "warning").length;

  return (
    <Card className="w-full max-w-xs border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm flex items-center gap-2">
            Warning Sentinel
            {criticalCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
                {criticalCount}
              </span>
            )}
          </CardTitle>
          <span className="text-xs text-slate-400">{symbol}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Risk Score */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">Risk Level</span>
          <div className="flex-1 h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                riskScore > 70 ? "bg-red-500" : riskScore > 40 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
          <span className={`text-xs font-medium ${
            riskScore > 70 ? "text-red-400" : riskScore > 40 ? "text-amber-400" : "text-emerald-400"
          }`}>
            {riskScore}
          </span>
        </div>

        {/* Alerts */}
        <div className="space-y-1 max-h-24 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span>✓</span> No active alerts
            </div>
          ) : (
            alerts.slice(0, 4).map((alert, i) => (
              <div
                key={i}
                className={`text-[10px] px-2 py-1 rounded border ${alertColors[alert.type]}`}
              >
                <span className="mr-1">{alertIcons[alert.type]}</span>
                {alert.message}
              </div>
            ))
          )}
        </div>

        {/* Watch Items */}
        <div className="pt-2 border-t border-slate-700/50">
          <div className="flex flex-wrap gap-1.5">
            {watchItems.map((item, i) => (
              <div key={i} className="flex items-center gap-1 text-[9px] text-slate-400">
                <span className={`w-1.5 h-1.5 rounded-full ${statusColors[item.status]}`} />
                {item.item}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
