import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricStrip } from "@/components/shared/MetricBox";
import { InterpretationFooter, SignalBox } from "@/components/shared/InterpretationFooter";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface InsiderTradesData {
  symbol: string;
  asOf: string;
  sentiment: "Bullish" | "Neutral" | "Bearish";
  summary: { totalBuys: number; totalSells: number; netValue: number; transactionCount: number };
  recentTrades: Array<{ date: string; insider: string; type: "Buy" | "Sell"; shares: number; value: number; pricePerShare: number }>;
  patterns: Array<{ pattern: string; signal: "bullish" | "bearish" | "neutral"; detail: string }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getInsiderTradesOutput(data: InsiderTradesData): CardOutput {
  const { symbol, asOf, sentiment: insiderSentiment, summary, recentTrades, patterns } = data;
  
  const sentiment = insiderSentiment === "Bullish" ? "bullish" : insiderSentiment === "Bearish" ? "bearish" : "neutral";
  const signalStrength = insiderSentiment === "Bullish" ? 4 : insiderSentiment === "Bearish" ? 2 : 3;
  
  const buyCount = recentTrades.filter(t => t.type === "Buy").length;
  const sellCount = recentTrades.filter(t => t.type === "Sell").length;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Net Value", "it_net", summary.netValue, 
      summary.netValue > 1 ? "excellent" : summary.netValue > 0 ? "good" : summary.netValue > -1 ? "fair" : "poor",
      { format: "currency", priority: 1, unit: "₹Cr" }),
    createMetric("Total Buys", "it_buys", summary.totalBuys, 
      summary.totalBuys > summary.totalSells ? "good" : "neutral",
      { format: "currency", priority: 1, unit: "₹Cr" }),
    createMetric("Total Sells", "it_sells", summary.totalSells, 
      summary.totalSells > summary.totalBuys ? "poor" : "neutral",
      { format: "currency", priority: 2, unit: "₹Cr" }),
    createMetric("Transaction Count", "it_count", summary.transactionCount, "neutral", 
      { format: "number", priority: 2 }),
    createMetric("Buy/Sell Ratio", "it_ratio", buyCount > 0 && sellCount > 0 ? buyCount / sellCount : buyCount > 0 ? 999 : 0, 
      buyCount > sellCount ? "good" : "fair",
      { format: "ratio", priority: 2, unit: "x" }),
  ];
  
  const insights: Insight[] = [];
  
  // Sentiment
  if (insiderSentiment === "Bullish") {
    insights.push(createInsight("strength", `Bullish insider activity: ₹${summary.netValue.toFixed(1)}Cr net buying`, 1, ["it_net"]));
  } else if (insiderSentiment === "Bearish") {
    insights.push(createInsight("weakness", `Bearish insider activity: ₹${Math.abs(summary.netValue).toFixed(1)}Cr net selling`, 1, ["it_net"]));
  }
  
  // Buy patterns
  if (summary.totalBuys > 5) {
    insights.push(createInsight("strength", `Significant insider buying: ₹${summary.totalBuys.toFixed(1)}Cr in ${buyCount} transactions`, 2, ["it_buys"]));
  }
  
  // Sell patterns
  if (summary.totalSells > 5) {
    insights.push(createInsight("weakness", `Notable insider selling: ₹${summary.totalSells.toFixed(1)}Cr in ${sellCount} transactions`, 2, ["it_sells"]));
  }
  
  // Pattern insights
  patterns.slice(0, 2).forEach(p => {
    const type = p.signal === "bullish" ? "strength" : p.signal === "bearish" ? "weakness" : "observation";
    insights.push(createInsight(type, `${p.pattern}: ${p.detail}`, 2));
  });
  
  const headline = `${symbol} insider ${insiderSentiment.toLowerCase()}: ₹${summary.netValue > 0 ? "+" : ""}${summary.netValue.toFixed(1)}Cr net (${summary.transactionCount} trades)`;
  
  return {
    cardId: "insider-trades",
    cardCategory: "macro",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: summary.transactionCount >= 3 ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["shareholding-pattern", "institutional-flows", "management-quality"],
    tags: ["insider", insiderSentiment.toLowerCase(), summary.netValue > 0 ? "buying" : "selling"],
    scoreContribution: {
      category: "momentum",
      score: insiderSentiment === "Bullish" ? 75 : insiderSentiment === "Bearish" ? 25 : 50,
      weight: 0.10,
    },
  };
}

interface Props { data?: InsiderTradesData; isLoading?: boolean; error?: string | null; }

export default function InsiderTradesCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['macro'];

  if (isLoading) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Insider Trades
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Insider Trades</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Insider Trades</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  const metrics = [
    { label: "Net Value", value: `₹${data.summary.netValue.toFixed(1)}Cr`, trend: data.summary.netValue > 0 ? "up" as const : "down" as const },
    { label: "Buys", value: `₹${data.summary.totalBuys.toFixed(1)}Cr` },
    { label: "Sells", value: `₹${data.summary.totalSells.toFixed(1)}Cr` },
    { label: "Transactions", value: data.summary.transactionCount.toString() },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">Insider Trades
              <Badge variant={data.sentiment === "Bullish" ? "success" : data.sentiment === "Bearish" ? "destructive" : "secondary"}>{data.sentiment}</Badge>
            </CardTitle>
            <CardDescription>{data.symbol} • Insider activity • {data.asOf}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Recent Transactions</div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {data.recentTrades.slice(0, 6).map((trade, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-slate-800/30 rounded px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${trade.type === "Buy" ? "bg-emerald-900/50 text-emerald-400" : "bg-red-900/50 text-red-400"}`}>{trade.type}</span>
                  <span className="text-slate-300 truncate max-w-[120px]">{trade.insider}</span>
                </div>
                <div className="text-right">
                  <div className="text-slate-200">₹{trade.value.toFixed(2)}Cr</div>
                  <div className="text-[9px] text-slate-500">@₹{trade.pricePerShare.toFixed(0)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {data.patterns.length > 0 && (
          <div className="space-y-2">
            {data.patterns.map((p, i) => <SignalBox key={i} signal={p.signal} title={p.pattern} description={p.detail} />)}
          </div>
        )}
        <InterpretationFooter variant={data.sentiment === "Bullish" ? "success" : data.sentiment === "Bearish" ? "warning" : "info"}>
          {data.summary.netValue > 0 ? `Net insider buying of ₹${data.summary.netValue.toFixed(1)}Cr signals management confidence.` : data.summary.netValue < 0 ? `Net insider selling of ₹${Math.abs(data.summary.netValue).toFixed(1)}Cr—monitor for patterns.` : "Balanced insider activity with no clear directional signal."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
