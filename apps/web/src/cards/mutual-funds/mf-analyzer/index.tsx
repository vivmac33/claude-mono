import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  Cell,
} from "recharts";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface MFDetailedFund {
  schemeCode: string;
  schemeName: string;
  amc: string;
  category: string;
  subCategory: string;
  nav: number;
  navDate: string;
  aum: number;
  expenseRatio: number;
  riskLevel: string;
  rating: number;
  
  // Returns
  returns: {
    "1M": number;
    "3M": number;
    "6M": number;
    "1Y": number;
    "3Y": number;
    "5Y": number;
    "10Y"?: number;
  };
  
  // Risk metrics
  riskMetrics: {
    sharpeRatio: number;
    sortinoRatio: number;
    alpha: number;
    beta: number;
    standardDeviation: number;
    maxDrawdown: number;
    treynorRatio: number;
    informationRatio: number;
  };
  
  // Portfolio composition
  holdings: {
    topStocks: Array<{ name: string; weight: number; sector: string }>;
    sectorAllocation: Record<string, number>;
    capAllocation: {
      largeCap: number;
      midCap: number;
      smallCap: number;
      cash: number;
    };
  };
  
  // NAV history (for chart)
  navHistory: Array<{ date: string; nav: number }>;
  
  // Rolling returns
  rollingReturns: {
    "1Y": { min: number; max: number; median: number; current: number };
    "3Y": { min: number; max: number; median: number; current: number };
  };
  
  // Fund info
  fundManager: string;
  benchmark: string;
  inceptionDate: string;
  exitLoad: string;
  minSipAmount: number;
  minLumpsum: number;
}

export interface MFAnalyzerData {
  asOf: string;
  funds: MFDetailedFund[];
  benchmarkNav?: Array<{ date: string; nav: number }>;
  overlap?: {
    percentage: number;
    commonHoldings: Array<{ name: string; fund1Weight: number; fund2Weight: number }>;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export function getMFAnalyzerOutput(data: MFAnalyzerData): CardOutput {
  const { asOf, funds, overlap } = data;
  
  if (funds.length === 0) {
    return {
      cardId: "mf-analyzer",
      cardCategory: "mutual-funds",
      symbol: "MF",
      asOf,
      headline: "No funds to analyze",
      sentiment: "neutral",
      confidence: "low",
      signalStrength: 1,
      keyMetrics: [],
      insights: [],
      suggestedCards: ["mf-explorer"],
      tags: ["mutual-funds"],
      scoreContribution: { category: "value", score: 50, weight: 0.05 },
    };
  }
  
  const primaryFund = funds[0];
  const avgReturn1Y = funds.reduce((sum, f) => sum + f.returns["1Y"], 0) / funds.length;
  const avgSharpe = funds.reduce((sum, f) => sum + f.riskMetrics.sharpeRatio, 0) / funds.length;
  
  const sentiment = avgReturn1Y > 15 && avgSharpe > 1 ? "bullish" : avgReturn1Y < 5 ? "bearish" : "neutral";
  const signalStrength = avgSharpe > 1.5 ? 5 : avgSharpe > 1 ? 4 : avgSharpe > 0.5 ? 3 : 2;
  
  const keyMetrics: MetricValue[] = [
    createMetric("1Y Return", "mfa_ret1y", primaryFund.returns["1Y"], 
      primaryFund.returns["1Y"] > 15 ? "excellent" : primaryFund.returns["1Y"] > 10 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("3Y Return", "mfa_ret3y", primaryFund.returns["3Y"], 
      primaryFund.returns["3Y"] > 12 ? "excellent" : primaryFund.returns["3Y"] > 8 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("Sharpe Ratio", "mfa_sharpe", primaryFund.riskMetrics.sharpeRatio, 
      primaryFund.riskMetrics.sharpeRatio > 1.5 ? "excellent" : primaryFund.riskMetrics.sharpeRatio > 1 ? "good" : "fair",
      { format: "ratio", priority: 1 }),
    createMetric("Alpha", "mfa_alpha", primaryFund.riskMetrics.alpha, 
      primaryFund.riskMetrics.alpha > 2 ? "excellent" : primaryFund.riskMetrics.alpha > 0 ? "good" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Beta", "mfa_beta", primaryFund.riskMetrics.beta, "neutral", 
      { format: "ratio", priority: 2 }),
    createMetric("Max Drawdown", "mfa_dd", primaryFund.riskMetrics.maxDrawdown, 
      primaryFund.riskMetrics.maxDrawdown < 15 ? "safe" : primaryFund.riskMetrics.maxDrawdown < 25 ? "moderate" : "risky",
      { format: "percent", priority: 2 }),
    createMetric("Expense Ratio", "mfa_exp", primaryFund.expenseRatio, 
      primaryFund.expenseRatio < 1 ? "excellent" : primaryFund.expenseRatio < 1.5 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("AUM", "mfa_aum", primaryFund.aum / 100, "neutral", 
      { format: "currency", priority: 2, unit: "₹Cr" }),
  ];
  
  if (overlap) {
    keyMetrics.push(createMetric("Overlap", "mfa_overlap", overlap.percentage, 
      overlap.percentage > 50 ? "risky" : "safe",
      { format: "percent", priority: 2 }));
  }
  
  const insights: Insight[] = [];
  
  // Performance
  if (primaryFund.riskMetrics.alpha > 2) {
    insights.push(createInsight("strength", `Strong alpha: ${primaryFund.riskMetrics.alpha.toFixed(2)}% outperformance vs benchmark`, 1, ["mfa_alpha"]));
  }
  
  // Risk-adjusted returns
  if (primaryFund.riskMetrics.sharpeRatio > 1.5) {
    insights.push(createInsight("strength", `Excellent risk-adjusted returns: Sharpe ${primaryFund.riskMetrics.sharpeRatio.toFixed(2)}`, 1, ["mfa_sharpe"]));
  }
  
  // Drawdown
  if (primaryFund.riskMetrics.maxDrawdown > 25) {
    insights.push(createInsight("risk", `High drawdown risk: ${primaryFund.riskMetrics.maxDrawdown.toFixed(1)}% max drawdown`, 2, ["mfa_dd"]));
  }
  
  // Overlap warning
  if (overlap && overlap.percentage > 50) {
    insights.push(createInsight("observation", `${overlap.percentage.toFixed(0)}% overlap between funds - consider diversification`, 2, ["mfa_overlap"]));
  }
  
  // Rating
  if (primaryFund.rating >= 4) {
    insights.push(createInsight("observation", `${primaryFund.rating}-star rated fund`, 3));
  }
  
  const headline = `${primaryFund.schemeName}: ${primaryFund.returns["1Y"].toFixed(1)}% 1Y, Sharpe ${primaryFund.riskMetrics.sharpeRatio.toFixed(2)}, α ${primaryFund.riskMetrics.alpha.toFixed(1)}%`;
  
  return {
    cardId: "mf-analyzer",
    cardCategory: "mutual-funds",
    symbol: primaryFund.schemeCode,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["mf-explorer", "mf-portfolio-optimizer"],
    tags: ["mutual-funds", "analysis", primaryFund.category, primaryFund.riskLevel],
    scoreContribution: {
      category: "value",
      score: Math.min(100, 50 + primaryFund.riskMetrics.sharpeRatio * 20),
      weight: 0.10,
    },
  };
}

interface Props {
  data?: MFAnalyzerData;
  isLoading?: boolean;
  error?: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const MetricCompareRow = ({
  label,
  values,
  format,
  higherIsBetter = true,
  colors,
}: {
  label: string;
  values: number[];
  format: (v: number) => string;
  higherIsBetter?: boolean;
  colors: string[];
}) => {
  const bestIndex = higherIsBetter
    ? values.indexOf(Math.max(...values))
    : values.indexOf(Math.min(...values));
  
  return (
    <div className="flex items-center py-1.5 border-b border-slate-700/30 last:border-0">
      <div className="w-28 text-[11px] text-slate-500">{label}</div>
      {values.map((v, i) => (
        <div
          key={i}
          className={`flex-1 text-center text-[11px] ${
            i === bestIndex ? "text-emerald-400 font-medium" : "text-slate-300"
          }`}
        >
          {format(v)}
          {i === bestIndex && " ✓"}
        </div>
      ))}
    </div>
  );
};

const SectorBar = ({ sector, weight, color }: { sector: string; weight: number; color: string }) => (
  <div className="flex items-center gap-2 text-[10px]">
    <div className="w-16 text-slate-500 truncate">{sector}</div>
    <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${weight}%` }} />
    </div>
    <div className="w-10 text-right text-slate-400">{weight.toFixed(1)}%</div>
  </div>
);

const CapAllocationBar = ({ allocation, color }: { allocation: MFDetailedFund["holdings"]["capAllocation"]; color: string }) => (
  <div className="flex h-3 rounded-full overflow-hidden">
    <div className="bg-blue-500" style={{ width: `${allocation.largeCap}%` }} title={`Large: ${allocation.largeCap}%`} />
    <div className="bg-purple-500" style={{ width: `${allocation.midCap}%` }} title={`Mid: ${allocation.midCap}%`} />
    <div className="bg-amber-500" style={{ width: `${allocation.smallCap}%` }} title={`Small: ${allocation.smallCap}%`} />
    <div className="bg-slate-600" style={{ width: `${allocation.cash}%` }} title={`Cash: ${allocation.cash}%`} />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function MFAnalyzerCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['mutual-funds'];

  const [activeTab, setActiveTab] = useState<"returns" | "risk" | "portfolio" | "rolling">("returns");

  // All hooks must be called before any early returns
  const funds = data?.funds || [];
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
  const colorClasses = ["text-blue-400", "text-emerald-400", "text-amber-400", "text-red-400"];
  const bgColors = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-red-500"];

  // Prepare chart data
  const navChartData = useMemo(() => {
    if (!funds.length || !funds[0]?.navHistory) return [];
    return funds[0].navHistory.map((point, idx) => {
      const dataPoint: Record<string, any> = { date: point.date };
      funds.forEach((fund, i) => {
        if (fund.navHistory?.[idx]) {
          // Normalize to base 100 for comparison
          const baseNav = fund.navHistory[0]?.nav || 1;
          dataPoint[`fund${i}`] = ((fund.navHistory[idx].nav / baseNav) * 100).toFixed(2);
        }
      });
      return dataPoint;
    });
  }, [funds]);

  // Radar chart data
  const radarData = useMemo(() => {
    if (!funds.length) return [];
    const metrics = [
      { key: "returns", label: "Returns" },
      { key: "sharpe", label: "Sharpe" },
      { key: "alpha", label: "Alpha" },
      { key: "consistency", label: "Consistency" },
      { key: "risk", label: "Low Risk" },
    ];
    
    return metrics.map(m => {
      const point: Record<string, any> = { metric: m.label };
      funds.forEach((fund, i) => {
        let value = 50; // default
        switch (m.key) {
          case "returns": value = Math.min(100, Math.max(0, ((fund.returns?.["3Y"] || 0) + 10) * 3)); break;
          case "sharpe": value = Math.min(100, Math.max(0, (fund.riskMetrics?.sharpeRatio || 0) * 40)); break;
          case "alpha": value = Math.min(100, Math.max(0, ((fund.riskMetrics?.alpha || 0) + 5) * 10)); break;
          case "consistency": value = Math.min(100, Math.max(0, 100 - (fund.riskMetrics?.standardDeviation || 0) * 3)); break;
          case "risk": value = Math.min(100, Math.max(0, 100 - Math.abs(fund.riskMetrics?.maxDrawdown || 0) * 2)); break;
        }
        point[`fund${i}`] = value;
      });
      return point;
    });
  }, [funds]);

  // Generate verdict
  const verdict = useMemo(() => {
    if (funds.length < 2) return null;
    
    const f0 = funds[0];
    const f1 = funds[1];
    
    if (!f0?.riskMetrics || !f1?.riskMetrics) return null;
    
    const f0Score = 
      (f0.riskMetrics.sharpeRatio > f1.riskMetrics.sharpeRatio ? 1 : 0) +
      (f0.riskMetrics.alpha > f1.riskMetrics.alpha ? 1 : 0) +
      (Math.abs(f0.riskMetrics.maxDrawdown) < Math.abs(f1.riskMetrics.maxDrawdown) ? 1 : 0) +
      ((f0.returns?.["3Y"] || 0) > (f1.returns?.["3Y"] || 0) ? 1 : 0);
    
    const winner = f0Score >= 2 ? 0 : 1;
    const winnerFund = funds[winner];
    
    return {
      winner,
      text: `${winnerFund.schemeName.split(" ").slice(0, 3).join(" ")} shows better risk-adjusted performance with ${
        winner === 0 
          ? `higher Sharpe ratio (${f0.riskMetrics.sharpeRatio.toFixed(2)} vs ${f1.riskMetrics.sharpeRatio.toFixed(2)})`
          : `higher Sharpe ratio (${f1.riskMetrics.sharpeRatio.toFixed(2)} vs ${f0.riskMetrics.sharpeRatio.toFixed(2)})`
      } and lower maximum drawdown.`,
    };
  }, [funds]);

  if (isLoading) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Mutual Fund Analyzer
            </CardTitle>
          <CardDescription>Loading analysis...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Mutual Fund Analyzer</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data || funds.length === 0) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Mutual Fund Analyzer</CardTitle>
          <CardDescription>Select funds to analyze</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-500">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>Add funds from Explorer to compare</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          Mutual Fund Analyzer
          <Badge variant="secondary">{funds.length} funds</Badge>
        </CardTitle>
        <CardDescription>
          Side-by-side comparison • Data as of {data.asOf}
        </CardDescription>
        
        {/* Fund pills */}
        <div className="flex flex-wrap gap-2 mt-2">
          {funds.map((fund, i) => (
            <div
              key={fund.schemeCode}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700`}
            >
              <div className={`w-2 h-2 rounded-full ${bgColors[i]}`} />
              <span className="text-xs text-slate-300">{fund.schemeName.split(" ").slice(0, 3).join(" ")}</span>
              <button className="text-slate-500 hover:text-slate-300">×</button>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tab navigation */}
        <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg">
          {[
            { id: "returns", label: "Returns" },
            { id: "risk", label: "Risk Metrics" },
            { id: "portfolio", label: "Portfolio" },
            { id: "rolling", label: "Rolling Returns" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Returns Tab */}
        {activeTab === "returns" && (
          <div className="space-y-4">
            {/* NAV Growth Chart */}
            <div>
              <div className="text-[10px] uppercase text-slate-500 mb-2">NAV Growth (Normalized to 100)</div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={navChartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: "#64748b", fontSize: 9 }} 
                      tickLine={false}
                      axisLine={{ stroke: "#334155" }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fill: "#64748b", fontSize: 9 }} 
                      tickLine={false}
                      axisLine={{ stroke: "#334155" }}
                      domain={["auto", "auto"]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                    <Legend 
                      formatter={(value, entry) => {
                        const idx = parseInt(value.replace("fund", ""));
                        return funds[idx]?.schemeName.split(" ").slice(0, 2).join(" ");
                      }}
                      wrapperStyle={{ fontSize: "10px" }}
                    />
                    {funds.map((_, i) => (
                      <Line
                        key={i}
                        type="monotone"
                        dataKey={`fund${i}`}
                        stroke={colors[i]}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Returns comparison table */}
            <div className="bg-slate-800/30 rounded-lg p-3">
              <div className="text-[10px] uppercase text-slate-500 mb-2">Returns Comparison (CAGR)</div>
              <div className="flex items-center py-1.5 border-b border-slate-700/50 text-[10px] text-slate-500">
                <div className="w-28">Period</div>
                {funds.map((f, i) => (
                  <div key={i} className={`flex-1 text-center ${colorClasses[i]}`}>
                    {f.schemeName.split(" ")[0]}
                  </div>
                ))}
              </div>
              <MetricCompareRow 
                label="1 Month" 
                values={funds.map(f => f.returns["1M"])} 
                format={v => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`}
                colors={colors}
              />
              <MetricCompareRow 
                label="3 Months" 
                values={funds.map(f => f.returns["3M"])} 
                format={v => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`}
                colors={colors}
              />
              <MetricCompareRow 
                label="1 Year" 
                values={funds.map(f => f.returns["1Y"])} 
                format={v => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`}
                colors={colors}
              />
              <MetricCompareRow 
                label="3 Years" 
                values={funds.map(f => f.returns["3Y"])} 
                format={v => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`}
                colors={colors}
              />
              <MetricCompareRow 
                label="5 Years" 
                values={funds.map(f => f.returns["5Y"])} 
                format={v => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`}
                colors={colors}
              />
            </div>
          </div>
        )}

        {/* Risk Metrics Tab */}
        {activeTab === "risk" && (
          <div className="space-y-4">
            {/* Radar Chart */}
            <div>
              <div className="text-[10px] uppercase text-slate-500 mb-2">Risk-Return Profile</div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <PolarRadiusAxis tick={false} axisLine={false} />
                    {funds.map((_, i) => (
                      <Radar
                        key={i}
                        name={funds[i].schemeName.split(" ").slice(0, 2).join(" ")}
                        dataKey={`fund${i}`}
                        stroke={colors[i]}
                        fill={colors[i]}
                        fillOpacity={0.2}
                      />
                    ))}
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk metrics table */}
            <div className="bg-slate-800/30 rounded-lg p-3">
              <div className="text-[10px] uppercase text-slate-500 mb-2">Detailed Risk Metrics</div>
              <MetricCompareRow 
                label="Sharpe Ratio" 
                values={funds.map(f => f.riskMetrics.sharpeRatio)} 
                format={v => v.toFixed(2)}
                colors={colors}
              />
              <MetricCompareRow 
                label="Sortino Ratio" 
                values={funds.map(f => f.riskMetrics.sortinoRatio)} 
                format={v => v.toFixed(2)}
                colors={colors}
              />
              <MetricCompareRow 
                label="Alpha" 
                values={funds.map(f => f.riskMetrics.alpha)} 
                format={v => `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`}
                colors={colors}
              />
              <MetricCompareRow 
                label="Beta" 
                values={funds.map(f => f.riskMetrics.beta)} 
                format={v => v.toFixed(2)}
                higherIsBetter={false}
                colors={colors}
              />
              <MetricCompareRow 
                label="Std Deviation" 
                values={funds.map(f => f.riskMetrics.standardDeviation)} 
                format={v => `${v.toFixed(1)}%`}
                higherIsBetter={false}
                colors={colors}
              />
              <MetricCompareRow 
                label="Max Drawdown" 
                values={funds.map(f => f.riskMetrics.maxDrawdown)} 
                format={v => `${v.toFixed(1)}%`}
                higherIsBetter={false}
                colors={colors}
              />
              <MetricCompareRow 
                label="Expense Ratio" 
                values={funds.map(f => f.expenseRatio)} 
                format={v => `${v.toFixed(2)}%`}
                higherIsBetter={false}
                colors={colors}
              />
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <div className="space-y-4">
            {/* Cap allocation comparison */}
            <div className="bg-slate-800/30 rounded-lg p-3">
              <div className="text-[10px] uppercase text-slate-500 mb-3">Market Cap Allocation</div>
              <div className="space-y-3">
                {funds.map((fund, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] ${colorClasses[i]}`}>
                        {fund.schemeName.split(" ").slice(0, 2).join(" ")}
                      </span>
                    </div>
                    <CapAllocationBar allocation={fund.holdings.capAllocation} color={bgColors[i]} />
                    <div className="flex justify-between mt-1 text-[9px] text-slate-500">
                      <span>Large {fund.holdings.capAllocation.largeCap}%</span>
                      <span>Mid {fund.holdings.capAllocation.midCap}%</span>
                      <span>Small {fund.holdings.capAllocation.smallCap}%</span>
                      <span>Cash {fund.holdings.capAllocation.cash}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top holdings */}
            <div className="grid grid-cols-2 gap-3">
              {funds.slice(0, 2).map((fund, i) => (
                <div key={i} className="bg-slate-800/30 rounded-lg p-3">
                  <div className={`text-[10px] uppercase mb-2 ${colorClasses[i]}`}>
                    {fund.schemeName.split(" ")[0]} Top Holdings
                  </div>
                  <div className="space-y-1.5">
                    {fund.holdings.topStocks.slice(0, 5).map((stock, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-300 truncate flex-1">{stock.name}</span>
                        <span className="text-slate-500 ml-2">{stock.weight.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Overlap indicator */}
            {data.overlap && funds.length >= 2 && (
              <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-amber-400 font-medium">
                    Portfolio Overlap: {data.overlap.percentage.toFixed(0)}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {data.overlap.commonHoldings.length} common holdings. 
                  {data.overlap.percentage > 50 
                    ? " High overlap may reduce diversification benefits."
                    : " Good diversification between funds."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Rolling Returns Tab */}
        {activeTab === "rolling" && (
          <div className="space-y-4">
            <div className="text-[10px] text-slate-500 mb-2">
              Rolling returns show the range of returns over different entry points, giving a better picture of consistency.
            </div>
            
            {["1Y", "3Y"].map(period => (
              <div key={period} className="bg-slate-800/30 rounded-lg p-3">
                <div className="text-[10px] uppercase text-slate-500 mb-3">
                  {period} Rolling Returns Range
                </div>
                <div className="space-y-3">
                  {funds.map((fund, i) => {
                    const rolling = fund.rollingReturns[period as "1Y" | "3Y"];
                    const range = rolling.max - rolling.min;
                    const currentPos = ((rolling.current - rolling.min) / range) * 100;
                    const medianPos = ((rolling.median - rolling.min) / range) * 100;
                    
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] ${colorClasses[i]}`}>
                            {fund.schemeName.split(" ").slice(0, 2).join(" ")}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Current: {rolling.current.toFixed(1)}%
                          </span>
                        </div>
                        <div className="relative h-4 bg-slate-700/50 rounded">
                          {/* Range bar */}
                          <div className={`absolute top-1 bottom-1 ${bgColors[i]} opacity-30 rounded`} 
                            style={{ left: "5%", right: "5%" }} 
                          />
                          {/* Min marker */}
                          <div className="absolute top-0 bottom-0 w-0.5 bg-slate-500" style={{ left: "5%" }}>
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-slate-500">
                              {rolling.min.toFixed(0)}%
                            </span>
                          </div>
                          {/* Max marker */}
                          <div className="absolute top-0 bottom-0 w-0.5 bg-slate-500" style={{ right: "5%" }}>
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-slate-500">
                              {rolling.max.toFixed(0)}%
                            </span>
                          </div>
                          {/* Median marker */}
                          <div 
                            className="absolute top-0 bottom-0 w-0.5 bg-slate-400" 
                            style={{ left: `${5 + medianPos * 0.9}%` }}
                          />
                          {/* Current marker */}
                          <div 
                            className={`absolute top-0 bottom-0 w-1 ${bgColors[i]} rounded`}
                            style={{ left: `${5 + currentPos * 0.9}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Verdict */}
        {verdict && (
          <InterpretationFooter variant={verdict.winner === 0 ? "success" : "info"}>
            <strong>Analysis:</strong> {verdict.text}
          </InterpretationFooter>
        )}
      </CardContent>
    </Card>
  );
}
