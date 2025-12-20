// ═══════════════════════════════════════════════════════════════════════════
// TRADE JOURNAL ANALYTICS
// Behavioral feedback and pattern analysis from trade history
// ═══════════════════════════════════════════════════════════════════════════

import React, { useMemo } from 'react';

interface TradeJournalProps {
  data?: TradeHistoryData;
  symbol?: string;
}

interface Trade {
  id: string;
  date: string;
  time: string;
  instrument: string;
  type: 'long' | 'short';
  productType: 'equity' | 'futures' | 'options_buy' | 'options_sell';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  plannedStop?: number;
  plannedTarget?: number;
  actualExitReason: 'target' | 'stop' | 'manual' | 'time_exit';
  holdingTime: number; // minutes
  session: 'opening' | 'morning' | 'lunch' | 'afternoon' | 'closing';
  dayOfWeek: string;
}

export interface TradeHistoryData {
  trades: Trade[];
  capital: number;
  period: string;
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

export function getTradeJournalOutput(data: TradeHistoryData): CardOutput {
  const { trades, capital, period } = data;
  
  const wins = trades.filter(t => t.pnl > 0);
  const losses = trades.filter(t => t.pnl <= 0);
  const winRate = trades.length > 0 ? (wins.length / trades.length) * 100 : 0;
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length) : 0;
  const profitFactor = avgLoss > 0 ? (avgWin * wins.length) / (avgLoss * losses.length) : 0;
  const expectancy = trades.length > 0 ? totalPnl / trades.length : 0;
  
  const sentiment = totalPnl > 0 && winRate > 50 ? "bullish" : totalPnl < 0 ? "bearish" : "neutral";
  const signalStrength = winRate > 60 ? 4 : winRate > 50 ? 3 : 2;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Total Trades", "tj_trades", trades.length, "neutral", 
      { format: "number", priority: 1 }),
    createMetric("Win Rate", "tj_winrate", winRate, 
      winRate > 55 ? "excellent" : winRate > 45 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("Total P&L", "tj_pnl", totalPnl, 
      totalPnl > 0 ? "excellent" : "poor",
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("Profit Factor", "tj_pf", profitFactor, 
      profitFactor > 1.5 ? "excellent" : profitFactor > 1 ? "good" : "poor",
      { format: "ratio", priority: 1 }),
    createMetric("Avg Win", "tj_avgwin", avgWin, "good", 
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("Avg Loss", "tj_avgloss", avgLoss, "neutral", 
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("Expectancy", "tj_expect", expectancy, 
      expectancy > 0 ? "good" : "poor",
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("Capital", "tj_capital", capital, "neutral", 
      { format: "currency", priority: 3, unit: "₹" }),
  ];
  
  const insights: Insight[] = [];
  
  // Performance summary
  if (totalPnl > 0) {
    insights.push(createInsight("strength", `Profitable ${period}: ₹${totalPnl.toFixed(0)} P&L (${((totalPnl/capital)*100).toFixed(1)}% return)`, 1, ["tj_pnl"]));
  } else if (totalPnl < 0) {
    insights.push(createInsight("weakness", `Losing ${period}: ₹${totalPnl.toFixed(0)} P&L (${((totalPnl/capital)*100).toFixed(1)}% loss)`, 1, ["tj_pnl"]));
  }
  
  // Win rate
  if (winRate > 55) {
    insights.push(createInsight("strength", `Strong win rate: ${winRate.toFixed(1)}% (${wins.length}W/${losses.length}L)`, 2, ["tj_winrate"]));
  } else if (winRate < 45) {
    insights.push(createInsight("weakness", `Low win rate: ${winRate.toFixed(1)}% - review entry criteria`, 2, ["tj_winrate"]));
  }
  
  // Profit factor
  if (profitFactor > 1.5) {
    insights.push(createInsight("strength", `Excellent profit factor: ${profitFactor.toFixed(2)} (avg win/loss ratio)`, 2, ["tj_pf"]));
  } else if (profitFactor < 1) {
    insights.push(createInsight("risk", `Profit factor below 1 (${profitFactor.toFixed(2)}) - losses exceed wins`, 1, ["tj_pf"]));
  }
  
  // Expectancy
  if (expectancy > 0) {
    insights.push(createInsight("observation", `Positive expectancy: ₹${expectancy.toFixed(0)} per trade`, 3, ["tj_expect"]));
  }
  
  const headline = `Trade journal ${period}: ${trades.length} trades, ${winRate.toFixed(0)}% win rate, ₹${totalPnl.toFixed(0)} P&L`;
  
  return {
    cardId: "trade-journal",
    cardCategory: "portfolio",
    symbol: "TRADES",
    asOf: new Date().toISOString().split('T')[0],
    headline,
    sentiment,
    confidence: trades.length >= 20 ? "high" : "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["trade-expectancy", "fno-risk-advisor", "risk-health-dashboard"],
    tags: ["trading", "performance", totalPnl > 0 ? "profitable" : "losing"],
    scoreContribution: {
      category: "risk",
      score: Math.min(100, Math.max(0, 50 + (totalPnl / capital) * 100)),
      weight: 0.10,
    },
  };
}

// Mock data for demonstration
const MOCK_DATA: TradeHistoryData = {
  capital: 500000,
  period: 'Last 30 days',
  trades: generateMockTrades(80),
};

function generateMockTrades(count: number): Trade[] {
  const instruments = ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'TCS', 'INFY', 'HDFCBANK'];
  const sessions: Trade['session'][] = ['opening', 'morning', 'lunch', 'afternoon', 'closing'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const productTypes: Trade['productType'][] = ['options_buy', 'options_sell', 'futures', 'equity'];
  const exitReasons: Trade['actualExitReason'][] = ['target', 'stop', 'manual', 'time_exit'];
  
  return Array.from({ length: count }, (_, i) => {
    const isWin = Math.random() > 0.55; // 45% win rate
    const pnlPercent = isWin 
      ? Math.random() * 4 + 0.5  // 0.5% to 4.5% wins
      : -(Math.random() * 3 + 0.5); // -0.5% to -3.5% losses
    const capital = 100000;
    
    return {
      id: `trade-${i}`,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: `${9 + Math.floor(Math.random() * 6)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      instrument: instruments[Math.floor(Math.random() * instruments.length)],
      type: Math.random() > 0.5 ? 'long' : 'short',
      productType: productTypes[Math.floor(Math.random() * productTypes.length)],
      entryPrice: 100 + Math.random() * 900,
      exitPrice: 100 + Math.random() * 900,
      quantity: Math.floor(Math.random() * 100) + 10,
      pnl: capital * (pnlPercent / 100),
      pnlPercent,
      plannedStop: Math.random() > 0.3 ? 95 : undefined,
      plannedTarget: Math.random() > 0.3 ? 110 : undefined,
      actualExitReason: exitReasons[Math.floor(Math.random() * exitReasons.length)],
      holdingTime: Math.floor(Math.random() * 360) + 5,
      session: sessions[Math.floor(Math.random() * sessions.length)],
      dayOfWeek: days[Math.floor(Math.random() * days.length)],
    };
  });
}

export default function TradeJournalAnalytics({ data }: TradeJournalProps) {
  const categoryStyle = CATEGORY_STYLES['portfolio'];

  const safeData = data || MOCK_DATA;
  const analytics = useMemo(() => {
    const { trades, capital } = safeData;
    
    // Overall stats
    const totalTrades = trades.length;
    const wins = trades.filter(t => t.pnl > 0);
    const losses = trades.filter(t => t.pnl <= 0);
    const winRate = (wins.length / totalTrades) * 100;
    const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
    const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length : 0;
    const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length) : 0;
    const profitFactor = avgLoss > 0 ? (wins.reduce((sum, t) => sum + t.pnl, 0)) / Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0)) : 0;
    const avgRMultiple = avgLoss > 0 ? avgWin / avgLoss : 0;
    
    // By session
    const bySession = (sessions: string) => {
      const sessionTrades = trades.filter(t => t.session === sessions);
      const sessionWins = sessionTrades.filter(t => t.pnl > 0);
      const sessionPnl = sessionTrades.reduce((sum, t) => sum + t.pnl, 0);
      return {
        trades: sessionTrades.length,
        winRate: sessionTrades.length > 0 ? (sessionWins.length / sessionTrades.length) * 100 : 0,
        pnl: sessionPnl,
      };
    };
    
    const sessionStats = {
      opening: bySession('opening'),
      morning: bySession('morning'),
      lunch: bySession('lunch'),
      afternoon: bySession('afternoon'),
      closing: bySession('closing'),
    };
    
    // By day of week
    const byDay = (day: string) => {
      const dayTrades = trades.filter(t => t.dayOfWeek === day);
      const dayWins = dayTrades.filter(t => t.pnl > 0);
      const dayPnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
      return {
        trades: dayTrades.length,
        winRate: dayTrades.length > 0 ? (dayWins.length / dayTrades.length) * 100 : 0,
        pnl: dayPnl,
      };
    };
    
    const dayStats = {
      Monday: byDay('Monday'),
      Tuesday: byDay('Tuesday'),
      Wednesday: byDay('Wednesday'),
      Thursday: byDay('Thursday'),
      Friday: byDay('Friday'),
    };
    
    // By product type
    const byProduct = (product: string) => {
      const productTrades = trades.filter(t => t.productType === product);
      const productWins = productTrades.filter(t => t.pnl > 0);
      const productPnl = productTrades.reduce((sum, t) => sum + t.pnl, 0);
      return {
        trades: productTrades.length,
        winRate: productTrades.length > 0 ? (productWins.length / productTrades.length) * 100 : 0,
        pnl: productPnl,
      };
    };
    
    const productStats = {
      options_buy: byProduct('options_buy'),
      options_sell: byProduct('options_sell'),
      futures: byProduct('futures'),
      equity: byProduct('equity'),
    };
    
    // By instrument
    const instruments = [...new Set(trades.map(t => t.instrument))];
    const instrumentStats = instruments.map(inst => {
      const instTrades = trades.filter(t => t.instrument === inst);
      const instWins = instTrades.filter(t => t.pnl > 0);
      const instPnl = instTrades.reduce((sum, t) => sum + t.pnl, 0);
      return {
        name: inst,
        trades: instTrades.length,
        winRate: instTrades.length > 0 ? (instWins.length / instTrades.length) * 100 : 0,
        pnl: instPnl,
      };
    }).sort((a, b) => b.pnl - a.pnl);
    
    // Discipline metrics
    const tradesWithPlan = trades.filter(t => t.plannedStop && t.plannedTarget);
    const planAdherence = tradesWithPlan.length > 0
      ? (tradesWithPlan.filter(t => t.actualExitReason === 'target' || t.actualExitReason === 'stop').length / tradesWithPlan.length) * 100
      : 0;
    
    const manualExits = trades.filter(t => t.actualExitReason === 'manual').length;
    const manualExitRate = (manualExits / totalTrades) * 100;
    
    // Overtrading detection
    const tradesByDate = trades.reduce((acc, t) => {
      acc[t.date] = (acc[t.date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const avgTradesPerDay = Object.values(tradesByDate).reduce((sum, c) => sum + c, 0) / Object.keys(tradesByDate).length;
    const maxTradesDay = Math.max(...Object.values(tradesByDate));
    const overtradingDays = Object.values(tradesByDate).filter(c => c > avgTradesPerDay * 1.5).length;
    
    // Find worst patterns
    const worstSession = Object.entries(sessionStats).sort((a, b) => a[1].pnl - b[1].pnl)[0];
    const worstDay = Object.entries(dayStats).sort((a, b) => a[1].pnl - b[1].pnl)[0];
    const worstProduct = Object.entries(productStats).sort((a, b) => a[1].pnl - b[1].pnl)[0];
    
    // Generate insights
    const insights: string[] = [];
    
    if (worstSession[1].pnl < 0) {
      insights.push(`Avoid trading during ${worstSession[0]} session (₹${Math.abs(worstSession[1].pnl).toLocaleString('en-IN')} lost)`);
    }
    if (worstDay[1].pnl < -5000) {
      insights.push(`${worstDay[0]}s are your worst day (₹${Math.abs(worstDay[1].pnl).toLocaleString('en-IN')} lost)`);
    }
    if (manualExitRate > 40) {
      insights.push(`High manual exit rate (${manualExitRate.toFixed(0)}%) - stick to your stops/targets`);
    }
    if (overtradingDays > 5) {
      insights.push(`Overtrading detected on ${overtradingDays} days - reduce trade frequency`);
    }
    if (worstProduct[1].pnl < -10000) {
      insights.push(`Consider avoiding ${worstProduct[0].replace('_', ' ')} (₹${Math.abs(worstProduct[1].pnl).toLocaleString('en-IN')} lost)`);
    }
    
    // What-if scenarios
    const whatIf = {
      withStops: trades.map(t => {
        if (t.pnl < 0 && t.pnlPercent < -2) {
          return { ...t, pnl: t.pnl * 0.5, pnlPercent: -2 }; // Cap loss at 2%
        }
        return t;
      }).reduce((sum, t) => sum + t.pnl, 0),
      noOvertrading: trades.slice(0, Math.floor(trades.length * 0.7)).reduce((sum, t) => sum + t.pnl, 0),
      noWorstSession: trades.filter(t => t.session !== worstSession[0]).reduce((sum, t) => sum + t.pnl, 0),
    };
    
    return {
      totalTrades,
      winRate,
      totalPnl,
      avgWin,
      avgLoss,
      profitFactor,
      avgRMultiple,
      sessionStats,
      dayStats,
      productStats,
      instrumentStats,
      planAdherence,
      manualExitRate,
      avgTradesPerDay,
      maxTradesDay,
      overtradingDays,
      worstSession,
      worstDay,
      worstProduct,
      insights,
      whatIf,
    };
  }, [safeData]);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-5 border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider">Trade Journal</div>
          <div className="text-lg font-semibold text-slate-100">Behavioral Analytics</div>
          <div className="text-xs text-slate-400 mt-1">{safeData.period} • {analytics.totalTrades} trades</div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          analytics.totalPnl >= 0 
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
            : 'bg-red-500/20 text-red-400 border-red-500/50'
        } border`}>
          {analytics.totalPnl >= 0 ? '+' : ''}₹{analytics.totalPnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <MetricCard label="Win Rate" value={`${analytics.winRate.toFixed(0)}%`} 
          status={analytics.winRate >= 50 ? 'good' : analytics.winRate >= 40 ? 'neutral' : 'bad'} />
        <MetricCard label="Profit Factor" value={analytics.profitFactor.toFixed(2)} 
          status={analytics.profitFactor >= 1.5 ? 'good' : analytics.profitFactor >= 1 ? 'neutral' : 'bad'} />
        <MetricCard label="Avg R-Multiple" value={`${analytics.avgRMultiple.toFixed(1)}R`} 
          status={analytics.avgRMultiple >= 2 ? 'good' : analytics.avgRMultiple >= 1 ? 'neutral' : 'bad'} />
        <MetricCard label="Plan Adherence" value={`${analytics.planAdherence.toFixed(0)}%`} 
          status={analytics.planAdherence >= 70 ? 'good' : analytics.planAdherence >= 50 ? 'neutral' : 'bad'} />
      </div>

      {/* Behavioral Insights */}
      {analytics.insights.length > 0 && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-5">
          <div className="text-sm font-medium text-yellow-400 mb-2">🎯 Key Behavioral Insights</div>
          <ul className="space-y-1">
            {analytics.insights.map((insight, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* P&L by Session */}
      <div className="mb-5">
        <div className="text-sm font-medium text-slate-300 mb-3">P&L by Session</div>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(analytics.sessionStats).map(([session, stats]) => (
            <div key={session} className="p-3 bg-slate-800/50 rounded-lg text-center">
              <div className={`text-sm font-semibold ${stats.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.pnl >= 0 ? '+' : ''}₹{(stats.pnl / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-slate-500 capitalize">{session}</div>
              <div className="text-xs text-slate-600">{stats.winRate.toFixed(0)}% win</div>
            </div>
          ))}
        </div>
      </div>

      {/* P&L by Day */}
      <div className="mb-5">
        <div className="text-sm font-medium text-slate-300 mb-3">P&L by Day of Week</div>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(analytics.dayStats).map(([day, stats]) => (
            <div key={day} className="p-3 bg-slate-800/50 rounded-lg text-center">
              <div className={`text-sm font-semibold ${stats.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.pnl >= 0 ? '+' : ''}₹{(stats.pnl / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-slate-500">{day.slice(0, 3)}</div>
              <div className="text-xs text-slate-600">{stats.trades} trades</div>
            </div>
          ))}
        </div>
      </div>

      {/* P&L by Product */}
      <div className="mb-5">
        <div className="text-sm font-medium text-slate-300 mb-3">P&L by Product Type</div>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(analytics.productStats).map(([product, stats]) => (
            <div key={product} className="p-3 bg-slate-800/50 rounded-lg">
              <div className={`text-sm font-semibold ${stats.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.pnl >= 0 ? '+' : ''}₹{(stats.pnl / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-slate-500 capitalize">{product.replace('_', ' ')}</div>
              <div className="text-xs text-slate-600">{stats.winRate.toFixed(0)}% • {stats.trades} trades</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top/Bottom Instruments */}
      <div className="mb-5">
        <div className="text-sm font-medium text-slate-300 mb-3">P&L by Instrument</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="text-xs text-emerald-400 mb-2">Best Performers</div>
            {analytics.instrumentStats.slice(0, 3).map(inst => (
              <div key={inst.name} className="flex justify-between text-xs py-1">
                <span className="text-slate-300">{inst.name}</span>
                <span className="text-emerald-400">+₹{(inst.pnl / 1000).toFixed(1)}K</span>
              </div>
            ))}
          </div>
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="text-xs text-red-400 mb-2">Worst Performers</div>
            {analytics.instrumentStats.slice(-3).reverse().map(inst => (
              <div key={inst.name} className="flex justify-between text-xs py-1">
                <span className="text-slate-300">{inst.name}</span>
                <span className="text-red-400">₹{(inst.pnl / 1000).toFixed(1)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="p-4 bg-slate-800/30 rounded-lg mb-5">
        <div className="text-sm font-medium text-slate-300 mb-3">💭 What-If Scenarios</div>
        <div className="space-y-2">
          <WhatIfRow 
            label="If you used 2% stop losses" 
            current={analytics.totalPnl} 
            alternate={analytics.whatIf.withStops}
          />
          <WhatIfRow 
            label="If you reduced overtrading by 30%" 
            current={analytics.totalPnl} 
            alternate={analytics.whatIf.noOvertrading}
          />
          <WhatIfRow 
            label={`If you avoided ${analytics.worstSession[0]} session`}
            current={analytics.totalPnl} 
            alternate={analytics.whatIf.noWorstSession}
          />
        </div>
      </div>

      {/* Discipline Score */}
      <div className="p-4 bg-slate-800/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">Discipline Score</span>
          <span className={`text-lg font-bold ${
            analytics.planAdherence >= 70 ? 'text-emerald-400' : 
            analytics.planAdherence >= 50 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {Math.round((analytics.planAdherence + (100 - analytics.manualExitRate)) / 2)}/100
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-slate-400">Plan Adherence</div>
            <div className="text-slate-300">{analytics.planAdherence.toFixed(0)}%</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Manual Exits</div>
            <div className="text-slate-300">{analytics.manualExitRate.toFixed(0)}%</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Avg Trades/Day</div>
            <div className="text-slate-300">{analytics.avgTradesPerDay.toFixed(1)}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-500">
          💡 Focus on eliminating your worst patterns first. Small improvements in discipline compound significantly over time.
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, status }: { label: string; value: string; status: 'good' | 'neutral' | 'bad' }) {
  const colors = { good: 'text-emerald-400', neutral: 'text-yellow-400', bad: 'text-red-400' };
  return (
    <div className="p-3 bg-slate-800/50 rounded-lg text-center">
      <div className={`text-lg font-semibold ${colors[status]}`}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function WhatIfRow({ label, current, alternate }: { label: string; current: number; alternate: number }) {
  const diff = alternate - current;
  const improved = diff > 0;
  
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-400">{label}</span>
      <span className={improved ? 'text-emerald-400' : 'text-slate-500'}>
        {improved ? '+' : ''}₹{(diff / 1000).toFixed(1)}K {improved ? '↑' : ''}
      </span>
    </div>
  );
}
