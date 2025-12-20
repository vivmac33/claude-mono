import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface PortfolioLeaderboardData {
  asOf: string;
  portfolioReturn: number;
  benchmarkReturn: number;
  alpha: number;
  rankings: Array<{ symbol: string; return: number; contribution: number; weight: number }>;
  topPerformers: Array<{ symbol: string; return: number }>;
  bottomPerformers: Array<{ symbol: string; return: number }>;
  attribution: { stockSelection: number; sectorAllocation: number; timing: number };
  // NEW: Sharpe Ratio Analysis
  sharpeAnalysis?: {
    portfolioSharpe: number; // Overall portfolio Sharpe
    benchmarkSharpe: number; // Benchmark Sharpe
    riskFreeRate: number; // Current risk-free rate used (e.g., 6.5% for India)
    stockSharpes: Array<{
      symbol: string;
      sharpe: number;
      annualizedReturn: number;
      annualizedVol: number;
      weight: number;
    }>;
    rollingSharpe: Array<{
      date: string;
      portfolio: number;
      benchmark: number;
    }>;
    sharpeContribution: Array<{
      symbol: string;
      contribution: number; // How much this stock contributes to portfolio Sharpe
    }>;
    insights: {
      bestRiskAdjusted: string;
      worstRiskAdjusted: string;
      sharpeRating: 'Excellent' | 'Good' | 'Average' | 'Poor' | 'Negative';
    };
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getPortfolioLeaderboardOutput(data: PortfolioLeaderboardData): CardOutput {
  const { asOf, portfolioReturn, benchmarkReturn, alpha, topPerformers, bottomPerformers, attribution } = data;
  
  const hasPositiveAlpha = alpha > 0;
  const sentiment = hasPositiveAlpha ? "bullish" : alpha < -2 ? "bearish" : "neutral";
  const signalStrength = alpha > 5 ? 5 : alpha > 2 ? 4 : alpha > 0 ? 3 : alpha > -2 ? 2 : 1;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Portfolio Return", "pl_return", portfolioReturn, 
      portfolioReturn > 15 ? "excellent" : portfolioReturn > 5 ? "good" : portfolioReturn > 0 ? "fair" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Benchmark Return", "pl_benchmark", benchmarkReturn, "neutral", 
      { format: "percent", priority: 2 }),
    createMetric("Alpha", "pl_alpha", alpha, 
      alpha > 5 ? "excellent" : alpha > 2 ? "good" : alpha > 0 ? "fair" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Stock Selection", "pl_stock_sel", attribution.stockSelection, 
      attribution.stockSelection > 0 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Sector Allocation", "pl_sector", attribution.sectorAllocation, 
      attribution.sectorAllocation > 0 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("Timing", "pl_timing", attribution.timing, 
      attribution.timing > 0 ? "good" : "fair",
      { format: "percent", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Alpha
  if (hasPositiveAlpha) {
    insights.push(createInsight("strength", `Positive alpha of ${alpha.toFixed(1)}% - outperforming benchmark by ${(portfolioReturn - benchmarkReturn).toFixed(1)}%`, 1, ["pl_alpha"]));
  } else if (alpha < -2) {
    insights.push(createInsight("weakness", `Negative alpha of ${alpha.toFixed(1)}% - underperforming benchmark`, 1, ["pl_alpha"]));
  }
  
  // Top performers
  if (topPerformers.length > 0) {
    const top = topPerformers[0];
    insights.push(createInsight("strength", `Top performer: ${top.symbol} with ${top.return.toFixed(1)}% return`, 2));
  }
  
  // Bottom performers
  if (bottomPerformers.length > 0) {
    const bottom = bottomPerformers[0];
    insights.push(createInsight("weakness", `Bottom performer: ${bottom.symbol} with ${bottom.return.toFixed(1)}% return`, 2));
  }
  
  // Attribution analysis
  const bestAttrib = attribution.stockSelection > attribution.sectorAllocation ? "stock selection" : "sector allocation";
  insights.push(createInsight("observation", `Primary return driver: ${bestAttrib}`, 3, ["pl_stock_sel", "pl_sector"]));
  
  const headline = `Portfolio ${portfolioReturn >= 0 ? "+" : ""}${portfolioReturn.toFixed(1)}% vs benchmark ${benchmarkReturn >= 0 ? "+" : ""}${benchmarkReturn.toFixed(1)}% (α: ${alpha >= 0 ? "+" : ""}${alpha.toFixed(1)}%)`;
  
  return {
    cardId: "portfolio-leaderboard",
    cardCategory: "portfolio",
    symbol: "PORTFOLIO",
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["portfolio-correlation", "rebalance-optimizer", "risk-health-dashboard"],
    tags: ["performance", "alpha", hasPositiveAlpha ? "outperforming" : "underperforming"],
    scoreContribution: {
      category: "momentum",
      score: Math.min(100, Math.max(0, 50 + alpha * 5)),
      weight: 0.15,
    },
  };
}

interface Props { data?: PortfolioLeaderboardData; isLoading?: boolean; error?: string | null; }

export default function PortfolioLeaderboardCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['portfolio'];

  if (isLoading) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Portfolio Leaderboard
            </CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>;
  if (error) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Portfolio Leaderboard</CardTitle><CardDescription className="text-red-400">{error}</CardDescription></CardHeader></Card>;
  if (!data) return <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}><CardHeader className={categoryStyle.headerBg}><CardTitle>Portfolio Leaderboard</CardTitle><CardDescription>No data</CardDescription></CardHeader></Card>;

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">Portfolio Leaderboard
              <Badge variant={data.alpha >= 0 ? "success" : "destructive"}>{data.alpha >= 0 ? "+" : ""}{data.alpha.toFixed(1)}% α</Badge>
            </CardTitle>
            <CardDescription>Performance attribution • {data.asOf}</CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${data.portfolioReturn >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {data.portfolioReturn >= 0 ? "+" : ""}{data.portfolioReturn.toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-500">vs Benchmark {data.benchmarkReturn >= 0 ? "+" : ""}{data.benchmarkReturn.toFixed(1)}%</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className={`text-lg font-bold ${data.attribution.stockSelection >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {data.attribution.stockSelection >= 0 ? "+" : ""}{data.attribution.stockSelection.toFixed(1)}%
            </div>
            <div className="text-[9px] text-slate-500">Stock Selection</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className={`text-lg font-bold ${data.attribution.sectorAllocation >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {data.attribution.sectorAllocation >= 0 ? "+" : ""}{data.attribution.sectorAllocation.toFixed(1)}%
            </div>
            <div className="text-[9px] text-slate-500">Sector Allocation</div>
          </div>
          <div className="rounded bg-slate-800/50 p-2 text-center">
            <div className={`text-lg font-bold ${data.attribution.timing >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {data.attribution.timing >= 0 ? "+" : ""}{data.attribution.timing.toFixed(1)}%
            </div>
            <div className="text-[9px] text-slate-500">Timing</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] uppercase text-emerald-400 mb-2">Top Performers</div>
            <div className="space-y-1">
              {data.topPerformers.slice(0, 3).map((s) => (
                <div key={s.symbol} className="flex justify-between text-xs bg-emerald-900/20 rounded px-2 py-1">
                  <span className="text-slate-300">{s.symbol}</span>
                  <span className="text-emerald-400">+{s.return.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-red-400 mb-2">Bottom Performers</div>
            <div className="space-y-1">
              {data.bottomPerformers.slice(0, 3).map((s) => (
                <div key={s.symbol} className="flex justify-between text-xs bg-red-900/20 rounded px-2 py-1">
                  <span className="text-slate-300">{s.symbol}</span>
                  <span className="text-red-400">{s.return.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Holdings by Contribution</div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {data.rankings.slice(0, 5).map((r, i) => (
              <div key={r.symbol} className="flex items-center justify-between text-xs bg-slate-800/30 rounded px-2 py-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-4">{i + 1}.</span>
                  <span className="text-slate-300">{r.symbol}</span>
                  <span className="text-slate-500">({r.weight.toFixed(1)}%)</span>
                </div>
                <span className={r.contribution >= 0 ? "text-emerald-400" : "text-red-400"}>
                  {r.contribution >= 0 ? "+" : ""}{r.contribution.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sharpe Ratio Analysis Section */}
        {data.sharpeAnalysis && (
          <div className="border-t border-slate-700 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase text-indigo-400">📊 Risk-Adjusted Returns (Sharpe)</div>
              <Badge variant={
                data.sharpeAnalysis.insights.sharpeRating === 'Excellent' ? 'success' :
                data.sharpeAnalysis.insights.sharpeRating === 'Good' ? 'default' :
                data.sharpeAnalysis.insights.sharpeRating === 'Average' ? 'secondary' :
                'destructive'
              }>
                {data.sharpeAnalysis.insights.sharpeRating}
              </Badge>
            </div>
            
            {/* Portfolio vs Benchmark Sharpe */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded bg-indigo-900/20 p-2 text-center border border-indigo-500/30">
                <div className={`text-lg font-bold ${data.sharpeAnalysis.portfolioSharpe >= 1 ? 'text-emerald-400' : data.sharpeAnalysis.portfolioSharpe >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                  {data.sharpeAnalysis.portfolioSharpe.toFixed(2)}
                </div>
                <div className="text-[9px] text-slate-500">Portfolio Sharpe</div>
              </div>
              <div className="rounded bg-slate-800/50 p-2 text-center">
                <div className="text-lg font-bold text-slate-300">{data.sharpeAnalysis.benchmarkSharpe.toFixed(2)}</div>
                <div className="text-[9px] text-slate-500">Benchmark Sharpe</div>
              </div>
              <div className="rounded bg-slate-800/50 p-2 text-center">
                <div className="text-lg font-bold text-slate-300">{data.sharpeAnalysis.riskFreeRate.toFixed(1)}%</div>
                <div className="text-[9px] text-slate-500">Risk-Free Rate</div>
              </div>
            </div>
            
            {/* Rolling Sharpe Chart */}
            {data.sharpeAnalysis.rollingSharpe.length > 0 && (
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.sharpeAnalysis.rollingSharpe} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 8 }} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 8 }} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', fontSize: 10 }}
                      labelStyle={{ color: '#f8fafc' }}
                    />
                    <ReferenceLine y={1} stroke="#f59e0b" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="portfolio" stroke="#6366f1" strokeWidth={2} dot={false} name="Portfolio" />
                    <Line type="monotone" dataKey="benchmark" stroke="#94a3b8" strokeWidth={1} dot={false} name="Benchmark" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {/* Stock Sharpe Rankings */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-emerald-900/20 rounded p-2">
                <div className="text-[9px] text-emerald-400 mb-1">Best Risk-Adjusted</div>
                <div className="text-xs text-white font-medium">{data.sharpeAnalysis.insights.bestRiskAdjusted}</div>
                <div className="text-[9px] text-slate-400">
                  Sharpe: {data.sharpeAnalysis.stockSharpes.find(s => s.symbol === data.sharpeAnalysis!.insights.bestRiskAdjusted)?.sharpe.toFixed(2) || 'N/A'}
                </div>
              </div>
              <div className="bg-red-900/20 rounded p-2">
                <div className="text-[9px] text-red-400 mb-1">Worst Risk-Adjusted</div>
                <div className="text-xs text-white font-medium">{data.sharpeAnalysis.insights.worstRiskAdjusted}</div>
                <div className="text-[9px] text-slate-400">
                  Sharpe: {data.sharpeAnalysis.stockSharpes.find(s => s.symbol === data.sharpeAnalysis!.insights.worstRiskAdjusted)?.sharpe.toFixed(2) || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <InterpretationFooter variant={data.alpha >= 0 ? "success" : "warning"}>
          Portfolio {data.alpha >= 0 ? "outperformed" : "underperformed"} benchmark by {Math.abs(data.alpha).toFixed(1)}%. {data.attribution.stockSelection >= 0 ? "Stock selection added value." : "Stock selection detracted."} 
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
