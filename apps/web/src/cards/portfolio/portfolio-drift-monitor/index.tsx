// ═══════════════════════════════════════════════════════════════════════════
// PORTFOLIO DRIFT & THESIS DECAY MONITOR
// Tracks deviation from original investment thesis and alerts on drift
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface ThesisMetric {
  id: string;
  name: string;
  category: 'valuation' | 'growth' | 'quality' | 'technical' | 'catalyst';
  entryValue: number;
  currentValue: number;
  unit: string;
  changePercent: number;
  threshold: number;
  isBreached: boolean;
  direction: 'higher_better' | 'lower_better' | 'target';
  importance: 'critical' | 'important' | 'nice_to_have';
}

interface Holding {
  symbol: string;
  name: string;
  sector: string;
  entryDate: string;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  weight: number;
  targetWeight: number;
  pnlPercent: number;
  holdingPeriod: number;
  thesis: {
    summary: string;
    timeHorizon: string;
    targetPrice: number;
    stopLoss: number;
    keyReasons: string[];
    riskFactors: string[];
    catalysts: string[];
  };
  metrics: ThesisMetric[];
  driftScore: number;
  driftStatus: 'on_track' | 'minor_drift' | 'significant_drift' | 'thesis_broken';
  alerts: string[];
  recommendation: 'hold' | 'review' | 'reduce' | 'exit';
}

interface PortfolioDrift {
  overallDriftScore: number;
  holdingsOnTrack: number;
  holdingsWithDrift: number;
  holdingsThesisBroken: number;
  totalHoldings: number;
  lastReviewDate: string;
  nextReviewDue: string;
}

export interface PortfolioDriftData {
  asOf: string;
  portfolioDrift: PortfolioDrift;
  holdings: Holding[];
  recentAlerts: Array<{
    symbol: string;
    alert: string;
    severity: 'high' | 'medium' | 'low';
    date: string;
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

export function getPortfolioDriftOutput(data: PortfolioDriftData): CardOutput {
  const { portfolioDrift, holdings, recentAlerts } = data;
  const highAlerts = recentAlerts.filter(a => a.severity === 'high');
  const thesisBrokenCount = holdings.filter(h => h.driftStatus === 'thesis_broken').length;
  const sentiment = portfolioDrift.overallDriftScore < 30 ? "bullish" : portfolioDrift.overallDriftScore > 60 ? "bearish" : "neutral";
  const signalStrength = thesisBrokenCount > 0 ? 5 : highAlerts.length > 0 ? 4 : 3;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Drift Score", "pd_drift", portfolioDrift.overallDriftScore, portfolioDrift.overallDriftScore < 30 ? "excellent" : portfolioDrift.overallDriftScore < 60 ? "good" : "poor", { format: "number", priority: 1 }),
    createMetric("On Track", "pd_ontrack", portfolioDrift.holdingsOnTrack, "good", { format: "number", priority: 1 }),
    createMetric("Need Review", "pd_review", portfolioDrift.holdingsWithDrift, portfolioDrift.holdingsWithDrift > 2 ? "poor" : "fair", { format: "number", priority: 1 }),
    createMetric("Thesis Broken", "pd_broken", portfolioDrift.holdingsThesisBroken, portfolioDrift.holdingsThesisBroken > 0 ? "poor" : "excellent", { format: "number", priority: 1 }),
  ];
  
  const insights: Insight[] = [];
  if (thesisBrokenCount > 0) {
    const broken = holdings.filter(h => h.driftStatus === 'thesis_broken');
    insights.push(createInsight("risk", `${thesisBrokenCount} holding(s) have broken thesis: ${broken.map(h => h.symbol).join(', ')}`, 1, ["pd_broken"]));
  }
  highAlerts.slice(0, 3).forEach(alert => {
    insights.push(createInsight("risk", `${alert.symbol}: ${alert.alert}`, 2, []));
  });
  
  return {
    cardId: "portfolio-drift-monitor",
    cardCategory: "portfolio",
    symbol: "PORTFOLIO",
    asOf: data.asOf,
    headline: `Portfolio drift: ${portfolioDrift.overallDriftScore}% | ${portfolioDrift.holdingsOnTrack}/${portfolioDrift.totalHoldings} on track`,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["portfolio-leaderboard", "rebalance-optimizer", "trade-journal"],
    tags: ["portfolio", "thesis", portfolioDrift.overallDriftScore > 50 ? "drift" : "aligned"],
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const MOCK_DATA: PortfolioDriftData = {
  asOf: new Date().toISOString(),
  portfolioDrift: {
    overallDriftScore: 42,
    holdingsOnTrack: 5,
    holdingsWithDrift: 2,
    holdingsThesisBroken: 1,
    totalHoldings: 8,
    lastReviewDate: '2024-12-01',
    nextReviewDue: '2024-12-15',
  },
  recentAlerts: [
    { symbol: 'WIPRO', alert: 'P/E expanded 40% above entry thesis', severity: 'high', date: '2024-12-10' },
    { symbol: 'TATAMOTORS', alert: 'Debt/Equity now 1.8x vs 1.2x at entry', severity: 'high', date: '2024-12-08' },
    { symbol: 'INFY', alert: 'Revenue growth slowed to 8% vs 15% thesis', severity: 'medium', date: '2024-12-05' },
  ],
  holdings: [
    {
      symbol: 'TCS', name: 'TCS Ltd', sector: 'IT', entryDate: '2024-06-15', entryPrice: 3200, currentPrice: 3850, quantity: 50, weight: 18, targetWeight: 15, pnlPercent: 20.3, holdingPeriod: 180,
      thesis: { summary: 'Market leader with stable margins, betting on AI services growth', timeHorizon: '2-3 years', targetPrice: 4200, stopLoss: 2900, keyReasons: ['AI/ML services growth', 'Strong deal pipeline'], riskFactors: ['US recession', 'INR appreciation'], catalysts: ['Q3 results', 'Large deal wins'] },
      metrics: [
        { id: 'm1', name: 'P/E Ratio', category: 'valuation', entryValue: 28, currentValue: 32, unit: 'x', changePercent: 14, threshold: 20, isBreached: false, direction: 'lower_better', importance: 'important' },
        { id: 'm2', name: 'Revenue Growth', category: 'growth', entryValue: 12, currentValue: 10, unit: '%', changePercent: -16, threshold: 25, isBreached: false, direction: 'higher_better', importance: 'critical' },
      ],
      driftScore: 18, driftStatus: 'on_track', alerts: ['Approaching target price'], recommendation: 'hold',
    },
    {
      symbol: 'WIPRO', name: 'Wipro Ltd', sector: 'IT', entryDate: '2024-03-20', entryPrice: 420, currentPrice: 520, quantity: 200, weight: 12, targetWeight: 10, pnlPercent: 23.8, holdingPeriod: 270,
      thesis: { summary: 'Turnaround play under new leadership', timeHorizon: '1-2 years', targetPrice: 550, stopLoss: 380, keyReasons: ['New CEO strategy', 'Cost optimization'], riskFactors: ['Execution risk'], catalysts: ['Quarterly margin improvement'] },
      metrics: [
        { id: 'm1', name: 'P/E Ratio', category: 'valuation', entryValue: 18, currentValue: 25, unit: 'x', changePercent: 39, threshold: 20, isBreached: true, direction: 'lower_better', importance: 'critical' },
        { id: 'm2', name: 'EBIT Margin', category: 'quality', entryValue: 15, currentValue: 14, unit: '%', changePercent: -6.6, threshold: 15, isBreached: false, direction: 'higher_better', importance: 'critical' },
      ],
      driftScore: 65, driftStatus: 'significant_drift', alerts: ['P/E expanded beyond thesis range'], recommendation: 'review',
    },
    {
      symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Auto', entryDate: '2024-01-10', entryPrice: 720, currentPrice: 850, quantity: 100, weight: 10, targetWeight: 10, pnlPercent: 18.1, holdingPeriod: 340,
      thesis: { summary: 'JLR recovery + EV transition play, deleveraging expected', timeHorizon: '2-3 years', targetPrice: 1000, stopLoss: 600, keyReasons: ['JLR turnaround', 'EV market share'], riskFactors: ['Chip shortage', 'EV competition'], catalysts: ['JLR profitability'] },
      metrics: [
        { id: 'm1', name: 'Debt/Equity', category: 'quality', entryValue: 1.2, currentValue: 1.8, unit: 'x', changePercent: 50, threshold: 25, isBreached: true, direction: 'lower_better', importance: 'critical' },
        { id: 'm2', name: 'JLR EBIT Margin', category: 'quality', entryValue: 6, currentValue: 4.5, unit: '%', changePercent: -25, threshold: 20, isBreached: true, direction: 'higher_better', importance: 'critical' },
      ],
      driftScore: 85, driftStatus: 'thesis_broken', alerts: ['Deleveraging thesis broken - debt increased', 'JLR margins declining'], recommendation: 'exit',
    },
    {
      symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', entryDate: '2024-07-20', entryPrice: 1580, currentPrice: 1720, quantity: 60, weight: 12, targetWeight: 12, pnlPercent: 8.9, holdingPeriod: 150,
      thesis: { summary: 'Best-in-class bank with merger synergies', timeHorizon: '3+ years', targetPrice: 2100, stopLoss: 1400, keyReasons: ['HDFC merger synergies', 'NIM stability'], riskFactors: ['Integration risk', 'NIM compression'], catalysts: ['Merger integration milestones'] },
      metrics: [
        { id: 'm1', name: 'NIM', category: 'quality', entryValue: 4.1, currentValue: 4.0, unit: '%', changePercent: -2.4, threshold: 10, isBreached: false, direction: 'higher_better', importance: 'critical' },
        { id: 'm2', name: 'GNPA', category: 'quality', entryValue: 1.2, currentValue: 1.3, unit: '%', changePercent: 8, threshold: 20, isBreached: false, direction: 'lower_better', importance: 'critical' },
      ],
      driftScore: 12, driftStatus: 'on_track', alerts: [], recommendation: 'hold',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function DriftScoreGauge({ score }: { score: number }) {
  const getColor = () => score < 30 ? 'text-emerald-400' : score < 60 ? 'text-amber-400' : 'text-red-400';
  const getLabel = () => score < 30 ? 'Well Aligned' : score < 60 ? 'Minor Drift' : 'Significant Drift';
  return (
    <div className="text-center">
      <div className={`text-5xl font-bold ${getColor()}`}>{score}</div>
      <div className="text-xs text-slate-500 mt-1">Portfolio Drift Score</div>
      <div className={`text-sm font-medium mt-2 ${getColor()}`}>{getLabel()}</div>
    </div>
  );
}

function HoldingCard({ holding, onViewThesis }: { holding: Holding; onViewThesis: () => void }) {
  const statusColors = { on_track: 'border-emerald-800 bg-emerald-900/20', minor_drift: 'border-amber-800 bg-amber-900/20', significant_drift: 'border-orange-800 bg-orange-900/20', thesis_broken: 'border-red-800 bg-red-900/20' };
  const statusBadge = { on_track: 'bg-emerald-800 text-emerald-200', minor_drift: 'bg-amber-800 text-amber-200', significant_drift: 'bg-orange-800 text-orange-200', thesis_broken: 'bg-red-800 text-red-200' };
  const recommendationColors = { hold: 'text-emerald-400', review: 'text-amber-400', reduce: 'text-orange-400', exit: 'text-red-400' };
  const breachedMetrics = holding.metrics.filter(m => m.isBreached);
  
  return (
    <div className={`rounded-xl border overflow-hidden ${statusColors[holding.driftStatus]}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div>
              <div className="font-semibold text-white">{holding.symbol}</div>
              <div className="text-xs text-slate-400">{holding.sector}</div>
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusBadge[holding.driftStatus]}`}>
              {holding.driftStatus.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
          <div className="text-right">
            <div className={`font-semibold ${holding.pnlPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {holding.pnlPercent >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500">{holding.holdingPeriod}d held</div>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500">Drift Score</span>
            <span className={holding.driftScore > 50 ? 'text-red-400' : holding.driftScore > 30 ? 'text-amber-400' : 'text-emerald-400'}>{holding.driftScore}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${holding.driftScore > 50 ? 'bg-red-500' : holding.driftScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${holding.driftScore}%` }} />
          </div>
        </div>
        
        {breachedMetrics.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-red-400 mb-1">⚠️ Breached Metrics</div>
            <div className="flex flex-wrap gap-1">
              {breachedMetrics.map(m => (
                <span key={m.id} className="px-2 py-0.5 text-xs bg-red-900/50 text-red-300 rounded border border-red-800">
                  {m.name}: {m.currentValue}{m.unit} (was {m.entryValue}{m.unit})
                </span>
              ))}
            </div>
          </div>
        )}
        
        {holding.alerts.length > 0 && (
          <div className="mb-3">
            {holding.alerts.map((alert, i) => (
              <div key={i} className="text-xs text-slate-400">• {alert}</div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Recommendation:</span>
            <span className={`text-sm font-medium uppercase ${recommendationColors[holding.recommendation]}`}>{holding.recommendation}</span>
          </div>
          <button onClick={onViewThesis} className="text-xs text-indigo-400 hover:text-indigo-300">View Thesis →</button>
        </div>
      </div>
    </div>
  );
}

function ThesisModal({ holding, onClose }: { holding: Holding; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl max-h-[80vh] overflow-y-auto">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{holding.symbol} Investment Thesis</h3>
              <p className="text-xs text-slate-500">Entry: {new Date(holding.entryDate).toLocaleDateString()} @ ₹{holding.entryPrice}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">×</button>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-xs text-slate-500 uppercase mb-1">Thesis Summary</div>
              <div className="text-sm text-slate-200">{holding.thesis.summary}</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-500">Entry</div>
                <div className="text-lg font-semibold text-white">₹{holding.entryPrice}</div>
              </div>
              <div className="bg-emerald-900/30 border border-emerald-800 rounded-lg p-3 text-center">
                <div className="text-xs text-emerald-400">Target</div>
                <div className="text-lg font-semibold text-emerald-400">₹{holding.thesis.targetPrice}</div>
              </div>
              <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-center">
                <div className="text-xs text-red-400">Stop Loss</div>
                <div className="text-lg font-semibold text-red-400">₹{holding.thesis.stopLoss}</div>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase mb-2">Key Reasons</div>
              {holding.thesis.keyReasons.map((reason, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-300"><span className="text-emerald-400">✓</span> {reason}</div>
              ))}
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase mb-2">Risk Factors</div>
              {holding.thesis.riskFactors.map((risk, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-300"><span className="text-red-400">⚠</span> {risk}</div>
              ))}
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase mb-2">Metrics: Entry vs Current</div>
              {holding.metrics.map(m => (
                <div key={m.id} className={`flex items-center justify-between p-2 rounded-lg mb-1 ${m.isBreached ? 'bg-red-900/30 border border-red-800' : 'bg-slate-800/50'}`}>
                  <div className="text-sm text-white">{m.name}</div>
                  <div className="text-sm">
                    <span className="text-slate-400">{m.entryValue}{m.unit}</span>
                    <span className="text-slate-500 mx-2">→</span>
                    <span className={m.isBreached ? 'text-red-400' : 'text-emerald-400'}>{m.currentValue}{m.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface PortfolioDriftMonitorProps {
  data?: PortfolioDriftData;
}

export default function PortfolioDriftMonitor({ data }: PortfolioDriftMonitorProps) {
  const categoryStyle = CATEGORY_STYLES['portfolio'];

  // Ensure we have valid data with all required fields
  const safeData = useMemo(() => {
    if (data && data.holdings && data.holdings.length > 0 && data.portfolioDrift) {
      return data;
    }
    return MOCK_DATA;
  }, [data]);
  
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const [filter, setFilter] = useState<'all' | 'drift' | 'broken'>('all');
  
  const filteredHoldings = useMemo(() => {
    if (filter === 'all') return safeData.holdings;
    if (filter === 'drift') return safeData.holdings.filter(h => h.driftStatus === 'minor_drift' || h.driftStatus === 'significant_drift');
    return safeData.holdings.filter(h => h.driftStatus === 'thesis_broken');
  }, [safeData.holdings, filter]);
  
  const sortedHoldings = [...filteredHoldings].sort((a, b) => b.driftScore - a.driftScore);
  
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">📐 Portfolio Drift Monitor</h3>
            <p className="text-xs text-slate-500 mt-0.5">Track thesis deviation and rebalancing alerts</p>
          </div>
          <div className="text-xs text-slate-500">Last review: {new Date(safeData.portfolioDrift.lastReviewDate).toLocaleDateString()}</div>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-3"><DriftScoreGauge score={safeData.portfolioDrift.overallDriftScore} /></div>
          <div className="bg-emerald-900/30 border border-emerald-800 rounded-lg p-3 text-center">
            <div className="text-3xl font-bold text-emerald-400">{safeData.portfolioDrift.holdingsOnTrack}</div>
            <div className="text-xs text-slate-500 mt-1">On Track</div>
          </div>
          <div className="bg-amber-900/30 border border-amber-800 rounded-lg p-3 text-center">
            <div className="text-3xl font-bold text-amber-400">{safeData.portfolioDrift.holdingsWithDrift}</div>
            <div className="text-xs text-slate-500 mt-1">Need Review</div>
          </div>
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-center">
            <div className="text-3xl font-bold text-red-400">{safeData.portfolioDrift.holdingsThesisBroken}</div>
            <div className="text-xs text-slate-500 mt-1">Thesis Broken</div>
          </div>
        </div>
      </div>
      
      {safeData.recentAlerts.length > 0 && (
        <div className="p-4 border-b border-slate-800 bg-slate-800/30">
          <div className="text-xs text-slate-500 uppercase mb-2">Recent Alerts</div>
          {safeData.recentAlerts.slice(0, 3).map((alert, i) => (
            <div key={i} className={`flex items-center gap-2 text-sm ${alert.severity === 'high' ? 'text-red-400' : alert.severity === 'medium' ? 'text-amber-400' : 'text-slate-400'}`}>
              <span>{alert.severity === 'high' ? '🔴' : alert.severity === 'medium' ? '🟡' : '🟢'}</span>
              <span className="font-medium">{alert.symbol}:</span>
              <span className="text-slate-300">{alert.alert}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-1 p-2 border-b border-slate-800">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>All ({safeData.holdings.length})</button>
        <button onClick={() => setFilter('drift')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'drift' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}>Needs Review ({safeData.portfolioDrift.holdingsWithDrift})</button>
        <button onClick={() => setFilter('broken')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'broken' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>Thesis Broken ({safeData.portfolioDrift.holdingsThesisBroken})</button>
      </div>
      
      <div className="p-4 max-h-[400px] overflow-y-auto space-y-3">
        {sortedHoldings.map(holding => (
          <HoldingCard key={holding.symbol} holding={holding} onViewThesis={() => setSelectedHolding(holding)} />
        ))}
      </div>
      
      {selectedHolding && <ThesisModal holding={selectedHolding} onClose={() => setSelectedHolding(null)} />}
    </div>
  );
}
