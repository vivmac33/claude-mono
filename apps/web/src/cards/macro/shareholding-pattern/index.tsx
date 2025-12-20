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
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface ShareholdingPatternData {
  symbol: string;
  asOf: string;
  current: {
    promoter: number;
    promoterPledge: number;
    fii: number;
    dii: number;
    public: number;
  };
  changes: {
    promoter: number;
    fii: number;
    dii: number;
    public: number;
  };
  historical: Array<{
    quarter: string;
    promoter: number;
    fii: number;
    dii: number;
  }>;
  topHolders: Array<{
    name: string;
    holding: number;
    change: number;
  }>;
  signals: Array<{
    signal: string;
    type: "bullish" | "bearish" | "neutral";
    description: string;
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getShareholdingPatternOutput(data: ShareholdingPatternData): CardOutput {
  const { symbol, asOf, current, changes, signals, topHolders } = data;
  
  const bullishSignals = signals.filter(s => s.type === "bullish").length;
  const bearishSignals = signals.filter(s => s.type === "bearish").length;
  const sentiment = bullishSignals > bearishSignals ? "bullish" : bearishSignals > bullishSignals ? "bearish" : "neutral";
  
  const institutionalHolding = current.fii + current.dii;
  const institutionalChange = changes.fii + changes.dii;
  const signalStrength = Math.abs(institutionalChange) > 3 ? 4 : Math.abs(institutionalChange) > 1.5 ? 3 : 2;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Promoter Holding", "shp_promoter", current.promoter, 
      current.promoter > 50 ? "excellent" : current.promoter > 30 ? "good" : "fair",
      { format: "percent", priority: 1, trend: { direction: changes.promoter > 0 ? "up" : changes.promoter < 0 ? "down" : "flat", period: "QoQ" } }),
    createMetric("Promoter Pledge", "shp_pledge", current.promoterPledge, 
      current.promoterPledge < 5 ? "safe" : current.promoterPledge < 20 ? "moderate" : "risky",
      { format: "percent", priority: 1 }),
    createMetric("FII Holding", "shp_fii", current.fii, 
      current.fii > 20 ? "excellent" : current.fii > 10 ? "good" : "fair",
      { format: "percent", priority: 1, trend: { direction: changes.fii > 0 ? "up" : changes.fii < 0 ? "down" : "flat", period: "QoQ" } }),
    createMetric("DII Holding", "shp_dii", current.dii, 
      current.dii > 15 ? "excellent" : current.dii > 8 ? "good" : "fair",
      { format: "percent", priority: 2, trend: { direction: changes.dii > 0 ? "up" : changes.dii < 0 ? "down" : "flat", period: "QoQ" } }),
    createMetric("Public Holding", "shp_public", current.public, "neutral", 
      { format: "percent", priority: 3 }),
    createMetric("FII Change", "shp_fii_change", changes.fii, 
      changes.fii > 1 ? "excellent" : changes.fii > 0 ? "good" : changes.fii > -1 ? "fair" : "poor",
      { format: "percent", priority: 2 }),
    createMetric("DII Change", "shp_dii_change", changes.dii, 
      changes.dii > 1 ? "excellent" : changes.dii > 0 ? "good" : changes.dii > -1 ? "fair" : "poor",
      { format: "percent", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // Promoter pledge
  if (current.promoterPledge > 30) {
    insights.push(createInsight("risk", `High promoter pledge of ${current.promoterPledge.toFixed(1)}% - watch for forced selling`, 1, ["shp_pledge"]));
  } else if (current.promoterPledge < 5) {
    insights.push(createInsight("strength", `Low promoter pledge (${current.promoterPledge.toFixed(1)}%) - minimal forced sale risk`, 2, ["shp_pledge"]));
  }
  
  // FII activity
  if (changes.fii > 2) {
    insights.push(createInsight("strength", `FIIs increased stake by ${changes.fii.toFixed(1)}% - institutional confidence`, 1, ["shp_fii", "shp_fii_change"]));
  } else if (changes.fii < -2) {
    insights.push(createInsight("weakness", `FIIs reduced stake by ${Math.abs(changes.fii).toFixed(1)}% - institutional selling`, 1, ["shp_fii", "shp_fii_change"]));
  }
  
  // DII activity
  if (changes.dii > 2) {
    insights.push(createInsight("strength", `DIIs increased stake by ${changes.dii.toFixed(1)}% - domestic institutional support`, 2, ["shp_dii", "shp_dii_change"]));
  }
  
  // Promoter buying/selling
  if (changes.promoter > 1) {
    insights.push(createInsight("strength", `Promoters increased stake by ${changes.promoter.toFixed(1)}% - insider confidence`, 1, ["shp_promoter"]));
  } else if (changes.promoter < -1) {
    insights.push(createInsight("weakness", `Promoters reduced stake by ${Math.abs(changes.promoter).toFixed(1)}%`, 2, ["shp_promoter"]));
  }
  
  // Add top signals
  signals.slice(0, 2).forEach(s => {
    const insightType = s.type === "bullish" ? "strength" : s.type === "bearish" ? "weakness" : "observation";
    insights.push(createInsight(insightType, `${s.signal}: ${s.description}`, 2));
  });
  
  const headline = `${symbol} promoter ${current.promoter.toFixed(1)}%, FII ${current.fii.toFixed(1)}% (${changes.fii > 0 ? "+" : ""}${changes.fii.toFixed(1)}%), DII ${current.dii.toFixed(1)}%`;
  
  return {
    cardId: "shareholding-pattern",
    cardCategory: "macro",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["institutional-flows", "insider-trades", "delivery-analysis"],
    tags: ["shareholding", "institutional", changes.fii > 0 ? "fii-buying" : changes.fii < 0 ? "fii-selling" : "fii-neutral"],
    scoreContribution: {
      category: "momentum",
      score: 50 + (institutionalChange * 10),
      weight: 0.10,
    },
  };
}

interface Props {
  data?: ShareholdingPatternData;
  isLoading?: boolean;
  error?: string | null;
}

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#64748b"];

export default function ShareholdingPatternCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['macro'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Shareholding Pattern
            </CardTitle>
          <CardDescription>Loading ownership data…</CardDescription>
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
          <CardTitle>Shareholding Pattern</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Shareholding Pattern</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const pieData = [
    { name: "Promoter", value: data.current.promoter },
    { name: "FII", value: data.current.fii },
    { name: "DII", value: data.current.dii },
    { name: "Public", value: data.current.public },
  ];

  const metrics = [
    { label: "Promoter", value: `${data.current.promoter.toFixed(1)}%`, trend: data.changes.promoter >= 0 ? "up" as const : "down" as const },
    { label: "FII", value: `${data.current.fii.toFixed(1)}%`, trend: data.changes.fii >= 0 ? "up" as const : "down" as const },
    { label: "DII", value: `${data.current.dii.toFixed(1)}%`, trend: data.changes.dii >= 0 ? "up" as const : "down" as const },
    { label: "Pledge", value: `${data.current.promoterPledge.toFixed(1)}%`, trend: data.current.promoterPledge < 10 ? "up" as const : "down" as const },
  ];

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Shareholding Pattern
              {data.current.promoterPledge > 20 && <Badge variant="destructive">High Pledge</Badge>}
            </CardTitle>
            <CardDescription>
              {data.symbol} • Ownership breakdown • As of {data.asOf}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={4} />

        <div className="grid grid-cols-2 gap-4">
          {/* Pie Chart */}
          <div>
            <div className="text-[10px] uppercase text-slate-500 mb-2">Current Ownership</div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-1">
              {pieData.map((entry, index) => (
                <span key={entry.name} className="text-[9px] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  {entry.name}
                </span>
              ))}
            </div>
          </div>

          {/* Historical Trend */}
          <div>
            <div className="text-[10px] uppercase text-slate-500 mb-2">Ownership Trend</div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.historical} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <XAxis dataKey="quarter" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }}
                    formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name.toUpperCase()]}
                  />
                  <Line type="monotone" dataKey="promoter" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="fii" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="dii" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quarter Changes */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Promoter", change: data.changes.promoter, color: "#8b5cf6" },
            { label: "FII", change: data.changes.fii, color: "#3b82f6" },
            { label: "DII", change: data.changes.dii, color: "#10b981" },
            { label: "Public", change: data.changes.public, color: "#64748b" },
          ].map((item) => (
            <div key={item.label} className="rounded bg-slate-800/50 p-2 text-center">
              <div className={`text-sm font-semibold ${item.change > 0 ? "text-emerald-400" : item.change < 0 ? "text-red-400" : "text-slate-400"}`}>
                {item.change > 0 ? "+" : ""}{item.change.toFixed(2)}%
              </div>
              <div className="text-[9px] text-slate-500">{item.label} QoQ</div>
            </div>
          ))}
        </div>

        {/* Top Holders */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Top Institutional Holders</div>
          <div className="space-y-1">
            {data.topHolders.slice(0, 4).map((holder, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-slate-800/30 rounded px-2 py-1">
                <span className="text-slate-300 truncate max-w-[60%]">{holder.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200">{holder.holding.toFixed(2)}%</span>
                  <span className={`text-[10px] ${holder.change > 0 ? "text-emerald-400" : holder.change < 0 ? "text-red-400" : "text-slate-500"}`}>
                    {holder.change > 0 ? "+" : ""}{holder.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signals */}
        {data.signals && data.signals.length > 0 && (
          <div className="space-y-2">
            {data.signals.map((signal, i) => (
              <SignalBox
                key={i}
                signal={signal.type}
                title={signal.signal}
                description={signal.description}
              />
            ))}
          </div>
        )}

        <InterpretationFooter variant={data.changes.fii > 0 && data.changes.dii > 0 ? "success" : data.changes.fii < -1 || data.changes.dii < -1 ? "warning" : "info"}>
          Promoter holding at {data.current.promoter.toFixed(1)}% {data.current.promoterPledge > 0 ? `with ${data.current.promoterPledge.toFixed(1)}% pledged` : "with no pledge"}.
          {data.changes.fii > 0 ? ` FII increased stake by ${data.changes.fii.toFixed(2)}%.` : data.changes.fii < 0 ? ` FII reduced stake by ${Math.abs(data.changes.fii).toFixed(2)}%.` : ""}
          {data.changes.dii > 0 ? ` DII accumulation of ${data.changes.dii.toFixed(2)}%.` : ""}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
