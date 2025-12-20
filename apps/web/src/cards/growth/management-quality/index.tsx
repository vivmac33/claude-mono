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
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface ManagementQualityData {
  symbol: string;
  asOf: string;
  overallScore: number;
  grade: string;
  promoterHolding: {
    current: number;
    change3M: number;
    pledged: number;
  };
  insiderActivity: {
    netBuys: number;
    totalTransactions: number;
    sentiment: "Bullish" | "Bearish" | "Neutral";
  };
  governance: {
    boardIndependence: number;
    auditQuality: string;
    relatedPartyFlag: boolean;
  };
  capitalAllocation: {
    roic5Y: number;
    reinvestmentRate: number;
    dividendConsistency: number;
  };
  recentTransactions: Array<{
    date: string;
    type: "Buy" | "Sell";
    insider: string;
    value: number;
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getManagementQualityOutput(data: ManagementQualityData): CardOutput {
  const { symbol, asOf, overallScore, grade, promoterHolding, insiderActivity, governance, capitalAllocation } = data;
  
  const sentiment = grade === "A" || grade === "B" ? "bullish" : 
    grade === "D" || grade === "F" ? "bearish" : "neutral";
  const signalStrength = overallScore > 80 ? 5 : overallScore > 60 ? 4 : overallScore > 40 ? 3 : overallScore > 20 ? 2 : 1;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Management Score", "mq_score", overallScore, 
      overallScore > 75 ? "excellent" : overallScore > 50 ? "good" : overallScore > 30 ? "fair" : "poor",
      { format: "score", priority: 1 }),
    createMetric("Promoter Holding", "mq_promoter_holding", promoterHolding.current, 
      promoterHolding.current > 50 ? "good" : promoterHolding.current > 30 ? "fair" : "poor",
      { format: "percent", priority: 1, trend: { direction: promoterHolding.change3M >= 0 ? "up" : "down", period: "3M", change: promoterHolding.change3M } }),
    createMetric("Promoter Pledge", "mq_promoter_pledge", promoterHolding.pledged, 
      promoterHolding.pledged < 10 ? "safe" : promoterHolding.pledged < 30 ? "moderate" : "risky",
      { format: "percent", priority: 1 }),
    createMetric("5Y ROIC", "mq_roic_5y", capitalAllocation.roic5Y, 
      capitalAllocation.roic5Y > 20 ? "excellent" : capitalAllocation.roic5Y > 12 ? "good" : capitalAllocation.roic5Y > 8 ? "fair" : "poor",
      { format: "percent", priority: 2 }),
    createMetric("Board Independence", "mq_board_independence", governance.boardIndependence, 
      governance.boardIndependence >= 50 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Dividend Consistency", "mq_dividend_consistency", capitalAllocation.dividendConsistency, 
      capitalAllocation.dividendConsistency > 80 ? "excellent" : capitalAllocation.dividendConsistency > 50 ? "good" : "fair",
      { format: "percent", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Overall score
  if (grade === "A" || grade === "B") {
    insights.push(createInsight("strength", `Grade ${grade} management quality (${overallScore}/100) - well-governed company`, 1, ["mq_score"]));
  } else if (grade === "D" || grade === "F") {
    insights.push(createInsight("weakness", `Grade ${grade} management quality (${overallScore}/100) - governance concerns`, 1, ["mq_score"]));
  }
  
  // Pledging concern
  if (promoterHolding.pledged > 30) {
    insights.push(createInsight("risk", `High promoter pledge of ${promoterHolding.pledged.toFixed(0)}% - significant risk factor`, 1, ["mq_promoter_pledge"]));
  } else if (promoterHolding.pledged < 5) {
    insights.push(createInsight("strength", `Low promoter pledge (${promoterHolding.pledged.toFixed(0)}%) - minimal pledge risk`, 3, ["mq_promoter_pledge"]));
  }
  
  // Insider sentiment
  if (insiderActivity.sentiment === "Bullish") {
    insights.push(createInsight("strength", `Bullish insider sentiment - net buying of ₹${insiderActivity.netBuys.toFixed(1)}Cr`, 2));
  } else if (insiderActivity.sentiment === "Bearish") {
    insights.push(createInsight("weakness", `Bearish insider sentiment - net selling indicates caution`, 2));
  }
  
  // Promoter holding trend
  if (promoterHolding.change3M < -2) {
    insights.push(createInsight("risk", `Promoter stake decreased ${Math.abs(promoterHolding.change3M).toFixed(1)}% in 3 months`, 2, ["mq_promoter_holding"]));
  } else if (promoterHolding.change3M > 2) {
    insights.push(createInsight("strength", `Promoter stake increased ${promoterHolding.change3M.toFixed(1)}% in 3 months`, 2, ["mq_promoter_holding"]));
  }
  
  // Capital allocation
  if (capitalAllocation.roic5Y > 15) {
    insights.push(createInsight("strength", `Strong capital allocation with ${capitalAllocation.roic5Y.toFixed(1)}% 5Y ROIC`, 2, ["mq_roic_5y"]));
  }
  
  // Governance flags
  if (governance.relatedPartyFlag) {
    insights.push(createInsight("risk", "Related party transaction flag - review disclosure quality", 2));
  }
  
  const headline = `${symbol} management Grade ${grade} with ${promoterHolding.current.toFixed(0)}% promoter stake and ${insiderActivity.sentiment.toLowerCase()} insider sentiment`;
  
  return {
    cardId: "management-quality",
    cardCategory: "growth",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: governance.auditQuality === "Big4" ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: promoterHolding.pledged > 20 
      ? ["shareholding-pattern", "insider-trades", "financial-stress-radar"]
      : ["capital-allocation", "dupont-analysis", "piotroski-score"],
    tags: ["management", "governance", "insider-activity", `grade-${grade.toLowerCase()}`],
    scoreContribution: {
      category: "quality",
      score: overallScore,
      weight: 0.15,
    },
  };
}

interface Props {
  data?: ManagementQualityData;
  isLoading?: boolean;
  error?: string | null;
}

export default function ManagementQualityCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['growth'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Management Quality
            </CardTitle>
          <CardDescription>Evaluating management effectiveness…</CardDescription>
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
          <CardTitle>Management Quality</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Management Quality</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const metrics = [
    { label: "Promoter Holding", value: `${data.promoterHolding.current.toFixed(1)}%`, trend: data.promoterHolding.change3M >= 0 ? "up" as const : "down" as const },
    { label: "Pledge %", value: `${data.promoterHolding.pledged.toFixed(1)}%`, trend: data.promoterHolding.pledged < 10 ? "up" as const : "down" as const },
    { label: "5Y ROIC", value: `${data.capitalAllocation.roic5Y.toFixed(1)}%` },
    { label: "Board Independence", value: `${data.governance.boardIndependence.toFixed(1)}%` },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Management Quality
              <Badge variant={data.grade === "A" || data.grade === "B" ? "success" : data.grade === "C" ? "secondary" : "destructive"}>
                Grade {data.grade}
              </Badge>
            </CardTitle>
            <CardDescription>
              {data.symbol} • Governance & insider activity • As of {data.asOf}
            </CardDescription>
          </div>
          <RadialGauge value={data.overallScore} max={100} label="Score" size={70} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        {/* Insider Activity Signal */}
        <SignalBox
          signal={data.insiderActivity.sentiment === "Bullish" ? "bullish" : data.insiderActivity.sentiment === "Bearish" ? "bearish" : "neutral"}
          title={`Insider Sentiment: ${data.insiderActivity.sentiment}`}
          description={`${data.insiderActivity.netBuys > 0 ? "Net buying" : "Net selling"} of ₹${Math.abs(data.insiderActivity.netBuys).toFixed(1)}Cr over ${data.insiderActivity.totalTransactions} transactions`}
        />

        {/* Promoter Analysis */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className="text-lg font-bold text-slate-100">{data.promoterHolding.current.toFixed(1)}%</div>
            <div className="text-[9px] text-slate-500">Promoter Stake</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className={`text-lg font-bold ${data.promoterHolding.change3M >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {data.promoterHolding.change3M > 0 ? "+" : ""}{data.promoterHolding.change3M.toFixed(1)}%
            </div>
            <div className="text-[9px] text-slate-500">3M Change</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className={`text-lg font-bold ${data.promoterHolding.pledged < 10 ? "text-emerald-400" : data.promoterHolding.pledged < 30 ? "text-amber-400" : "text-red-400"}`}>
              {data.promoterHolding.pledged.toFixed(1)}%
            </div>
            <div className="text-[9px] text-slate-500">Pledged</div>
          </div>
        </div>

        {/* Recent Insider Transactions */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Recent Insider Transactions</div>
          <div className="space-y-1">
            {data.recentTransactions.slice(0, 4).map((tx, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-slate-800/30 rounded px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${tx.type === "Buy" ? "bg-emerald-900/50 text-emerald-400" : "bg-red-900/50 text-red-400"}`}>
                    {tx.type}
                  </span>
                  <span className="text-slate-300">{tx.insider}</span>
                </div>
                <div className="text-slate-400">₹{tx.value.toFixed(1)}Cr</div>
              </div>
            ))}
          </div>
        </div>

        {/* Governance Flags */}
        <div className="flex gap-2 flex-wrap">
          <span className={`text-[10px] px-2 py-1 rounded ${data.governance.boardIndependence >= 50 ? "bg-emerald-900/30 text-emerald-400" : "bg-amber-900/30 text-amber-400"}`}>
            {data.governance.boardIndependence.toFixed(1)}% Independent Board
          </span>
          <span className={`text-[10px] px-2 py-1 rounded ${data.governance.auditQuality === "Big4" ? "bg-emerald-900/30 text-emerald-400" : "bg-slate-700 text-slate-400"}`}>
            {data.governance.auditQuality} Auditor
          </span>
          {data.governance.relatedPartyFlag && (
            <span className="text-[10px] px-2 py-1 rounded bg-amber-900/30 text-amber-400">
              Related Party Flag
            </span>
          )}
        </div>

        <InterpretationFooter variant={data.overallScore >= 70 ? "success" : data.overallScore >= 50 ? "info" : "warning"}>
          {data.promoterHolding.pledged > 30 
            ? `⚠️ High promoter pledge of ${data.promoterHolding.pledged.toFixed(0)}% is a significant risk factor. `
            : ""
          }
          5-year ROIC of {data.capitalAllocation.roic5Y.toFixed(1)}% indicates {data.capitalAllocation.roic5Y >= 15 ? "strong" : data.capitalAllocation.roic5Y >= 10 ? "adequate" : "weak"} capital allocation.
          Insider activity shows {data.insiderActivity.sentiment.toLowerCase()} sentiment with {data.insiderActivity.totalTransactions} transactions in recent period.
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
