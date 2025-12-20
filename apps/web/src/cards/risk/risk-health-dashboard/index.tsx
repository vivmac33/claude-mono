import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RadialGauge, ScoreGauge } from "@/components/shared/ScoreGauge";
import { MetricStrip } from "@/components/shared/MetricBox";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import { RiskBadge, HealthBadge, RiskType, HealthType } from "@/components/ui/status-badges";
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
  MetricInterpretation,
  SignalStrength,
  Sentiment,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface RiskHealthData {
  symbol: string;
  asOf: string;
  overallRiskScore: number;
  riskLevel: "Very Low" | "Low" | "Moderate" | "High" | "Very High";
  categories: {
    financial: { score: number; items: Array<{ name: string; value: number; threshold: number; status: "good" | "warning" | "danger" }> };
    operational: { score: number; items: Array<{ name: string; value: number; threshold: number; status: "good" | "warning" | "danger" }> };
    market: { score: number; items: Array<{ name: string; value: number; threshold: number; status: "good" | "warning" | "danger" }> };
    governance: { score: number; items: Array<{ name: string; value: number; threshold: number; status: "good" | "warning" | "danger" }> };
  };
  radarData: Array<{ category: string; risk: number }>;
  alerts: Array<{ message: string; severity: "critical" | "warning" | "info" }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getRiskHealthDashboardOutput(data: RiskHealthData): CardOutput {
  const { symbol, asOf, overallRiskScore, riskLevel, categories, radarData, alerts } = data;
  
  // Risk level to interpretation mapping
  const riskInterp: Record<string, MetricInterpretation> = {
    "Very Low": "safe",
    "Low": "safe",
    "Moderate": "moderate",
    "High": "risky",
    "Very High": "dangerous",
  };
  
  // Category score interpretation
  const catInterp = (score: number): MetricInterpretation => {
    if (score >= 80) return "safe";
    if (score >= 60) return "moderate";
    if (score >= 40) return "risky";
    return "dangerous";
  };
  
  // Build key metrics
  const keyMetrics: MetricValue[] = [
    createMetric("Overall Risk Score", "risk_score", overallRiskScore, riskInterp[riskLevel], {
      format: "score",
      unit: "100",
      priority: 1,
    }),
    createMetric("Financial Risk", "financial_risk", categories.financial.score, catInterp(categories.financial.score), {
      format: "score",
      unit: "100",
      priority: 1,
    }),
    createMetric("Operational Risk", "operational_risk", categories.operational.score, catInterp(categories.operational.score), {
      format: "score",
      unit: "100",
      priority: 2,
    }),
    createMetric("Market Risk", "market_risk", categories.market.score, catInterp(categories.market.score), {
      format: "score",
      unit: "100",
      priority: 2,
    }),
    createMetric("Governance Risk", "governance_risk", categories.governance.score, catInterp(categories.governance.score), {
      format: "score",
      unit: "100",
      priority: 3,
    }),
  ];
  
  // Build insights
  const insights: Insight[] = [];
  
  // Overall risk insight
  const riskInsights: Record<string, { type: "strength" | "risk" | "observation", text: string }> = {
    "Very Low": { type: "strength", text: `${symbol} has very low overall risk - suitable for conservative investors` },
    "Low": { type: "strength", text: `${symbol} maintains low risk profile with solid fundamentals` },
    "Moderate": { type: "observation", text: `${symbol} has moderate risk - typical for its sector` },
    "High": { type: "risk", text: `${symbol} carries elevated risk - careful position sizing recommended` },
    "Very High": { type: "risk", text: `${symbol} has very high risk - only for risk-tolerant investors` },
  };
  insights.push(createInsight(riskInsights[riskLevel].type, riskInsights[riskLevel].text, 1));
  
  // Category-specific insights
  const allCategories = [
    { name: "Financial", ...categories.financial },
    { name: "Operational", ...categories.operational },
    { name: "Market", ...categories.market },
    { name: "Governance", ...categories.governance },
  ];
  
  // Find weakest category
  const weakest = allCategories.reduce((min, cat) => cat.score < min.score ? cat : min);
  if (weakest.score < 50) {
    insights.push(createInsight("risk", `${weakest.name} risk is elevated (score: ${weakest.score}/100)`, 2));
  }
  
  // Find strongest category
  const strongest = allCategories.reduce((max, cat) => cat.score > max.score ? cat : max);
  if (strongest.score > 80) {
    insights.push(createInsight("strength", `Strong ${strongest.name.toLowerCase()} risk management (score: ${strongest.score}/100)`, 2));
  }
  
  // Process alerts
  const criticalAlerts = alerts.filter(a => a.severity === "critical");
  const warningAlerts = alerts.filter(a => a.severity === "warning");
  
  if (criticalAlerts.length > 0) {
    insights.push(createInsight("risk", `Critical alert: ${criticalAlerts[0].message}`, 1));
  }
  
  if (warningAlerts.length > 0 && criticalAlerts.length === 0) {
    insights.push(createInsight("risk", `Warning: ${warningAlerts[0].message}`, 2));
  }
  
  // Process individual risk items
  const allItems = [
    ...categories.financial.items,
    ...categories.operational.items,
    ...categories.market.items,
    ...categories.governance.items,
  ];
  
  const dangerItems = allItems.filter(i => i.status === "danger");
  if (dangerItems.length > 0 && dangerItems.length <= 2) {
    const itemNames = dangerItems.map(i => i.name).join(", ");
    insights.push(createInsight("risk", `Key concerns: ${itemNames}`, 2));
  } else if (dangerItems.length > 2) {
    insights.push(createInsight("risk", `Multiple risk factors in danger zone (${dangerItems.length} items)`, 2));
  }
  
  // Suggested cards based on risk level
  const suggestedCards = riskLevel === "High" || riskLevel === "Very High"
    ? ["bankruptcy-health", "financial-stress-radar", "drawdown-var"]
    : riskLevel === "Very Low" || riskLevel === "Low"
    ? ["valuation-summary", "growth-summary", "piotroski-score"]
    : ["leverage-history", "cashflow-stability-index", "volatility-regime"];
  
  // Build headline
  const headline = `${symbol} has ${riskLevel.toLowerCase()} risk profile (score: ${overallRiskScore}/100)`;
  
  // Determine sentiment (inverse - high risk = bearish)
  const sentiment: Sentiment = 
    riskLevel === "Very Low" || riskLevel === "Low" ? "bullish" :
    riskLevel === "High" || riskLevel === "Very High" ? "bearish" : "neutral";
  
  // Signal strength (inverse - low risk = strong signal for safety)
  const signalStrength = Math.min(5, Math.max(1, Math.round((100 - overallRiskScore) / 20) + 1)) as SignalStrength;
  
  return {
    cardId: "risk-health-dashboard",
    cardCategory: "risk",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength,
    keyMetrics,
    insights,
    primaryChart: {
      type: "radar",
      title: "Risk Breakdown",
      data: radarData,
    },
    suggestedCards,
    tags: ["risk", "safety", riskLevel.toLowerCase().replace(" ", "-")],
    scoreContribution: {
      category: "risk",
      score: 100 - overallRiskScore, // Invert for positive correlation with overall sentiment
      weight: 0.15,
    },
  };
}

interface Props {
  data?: RiskHealthData;
  isLoading?: boolean;
  error?: string | null;
}

function getRiskType(riskLevel: RiskHealthData["riskLevel"]): RiskType {
  switch (riskLevel) {
    case "Very Low": return "low";
    case "Low": return "low";
    case "Moderate": return "medium";
    case "High": return "high";
    case "Very High": return "extreme";
  }
}

function getHealthFromRisk(riskLevel: RiskHealthData["riskLevel"]): HealthType {
  switch (riskLevel) {
    case "Very Low": return "excellent";
    case "Low": return "good";
    case "Moderate": return "fair";
    case "High": return "poor";
    case "Very High": return "critical";
  }
}

export default function RiskHealthDashboardCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['risk'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Risk Health Dashboard
            </CardTitle>
          <CardDescription>Evaluating risk factors…</CardDescription>
        </CardHeader>
        <CardContent><Skeleton className="h-56 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Risk Health Dashboard</CardTitle>
          <CardDescription className={error ? "text-red-400" : ""}>{error || "No data"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { symbol, asOf, overallRiskScore, riskLevel, categories, radarData, alerts } = data;

  const statusColors = {
    good: "text-emerald-400",
    warning: "text-amber-400",
    danger: "text-red-400",
  };

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Risk Health Dashboard
              <RiskBadge risk={getRiskType(riskLevel)} size="md" />
            </CardTitle>
            <CardDescription>{symbol} • Comprehensive risk assessment • As of {asOf}</CardDescription>
          </div>
          <RadialGauge value={100 - overallRiskScore} max={100} label="Health" size={70} colorScale="quality" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Risk Radar */}
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 9 }} />
                <Radar name="Risk" dataKey="risk" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Scores */}
          <div className="space-y-2">
            {Object.entries(categories).map(([key, cat]) => (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="capitalize text-slate-400">{key}</span>
                  <span className="text-slate-300">{cat.score}/25</span>
                </div>
                <ScoreGauge value={25 - cat.score} max={25} showValue={false} size="sm" colorScale="quality" />
              </div>
            ))}
          </div>
        </div>

        {/* Risk Items Detail */}
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(categories).flatMap(([catKey, cat]) =>
            cat.items.slice(0, 2).map((item) => (
              <div key={`${catKey}-${item.name}`} className="bg-slate-800/30 rounded px-2 py-1.5 flex justify-between items-center">
                <span className="text-[10px] text-slate-400">{item.name}</span>
                <span className={`text-xs font-medium ${statusColors[item.status]}`}>{item.value.toFixed(1)}</span>
              </div>
            ))
          )}
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-1">
            {alerts.slice(0, 3).map((alert, i) => (
              <div key={i} className={`text-[10px] px-2 py-1 rounded flex items-center gap-2 ${
                alert.severity === "critical" ? "bg-red-900/30 text-red-300" :
                alert.severity === "warning" ? "bg-amber-900/30 text-amber-300" :
                "bg-blue-900/30 text-blue-300"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  alert.severity === "critical" ? "bg-red-400" :
                  alert.severity === "warning" ? "bg-amber-400" :
                  "bg-blue-400"
                }`} />
                {alert.message}
              </div>
            ))}
          </div>
        )}

        <InterpretationFooter variant={riskLevel === "Very Low" || riskLevel === "Low" ? "success" : riskLevel === "High" || riskLevel === "Very High" ? "warning" : "neutral"}>
          {riskLevel} risk profile with health score of {100 - overallRiskScore}/100.
          {alerts.length > 0 ? ` ${alerts.length} active alert(s) require attention.` : " No critical alerts."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
