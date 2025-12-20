// ═══════════════════════════════════════════════════════════════════════════
// SECTOR ROTATION TRACKER
// Tracks sector leadership shifts and intra-sector rotation with relative strength
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

interface SectorStock {
  symbol: string;
  name: string;
  return1w: number;
  return1m: number;
  return3m: number;
  relativeStrength: number; // vs sector
  rsRank: number; // 1 = strongest in sector
  volume: number;
  avgVolume: number;
  volumeRatio: number;
  isLeader: boolean;
  isLaggard: boolean;
  momentum: 'accelerating' | 'stable' | 'decelerating';
}

interface SubSector {
  id: string;
  name: string;
  return1w: number;
  return1m: number;
  relativeStrength: number;
  stocks: SectorStock[];
  leader: string;
  laggard: string;
}

interface Sector {
  id: string;
  name: string;
  return1w: number;
  return1m: number;
  return3m: number;
  relativeStrength: number; // vs Nifty50
  rsRank: number;
  momentum: 'accelerating' | 'stable' | 'decelerating';
  fundFlow: 'inflow' | 'outflow' | 'neutral';
  subSectors: SubSector[];
  topStocks: SectorStock[];
  bottomStocks: SectorStock[];
  leadershipChange: {
    newLeader: string | null;
    oldLeader: string | null;
    changeDate: string | null;
  };
}

interface RotationSignal {
  type: 'leadership_change' | 'momentum_shift' | 'relative_strength' | 'fund_flow';
  sector: string;
  message: string;
  importance: 'high' | 'medium' | 'low';
  timestamp: string;
}

export interface SectorRotationData {
  asOf: string;
  nifty50Return1m: number;
  sectors: Sector[];
  rotationSignals: RotationSignal[];
  marketPhase: 'risk_on' | 'risk_off' | 'rotation' | 'consolidation';
  leadingSectors: string[];
  laggingSectors: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

export function getSectorRotationOutput(data: SectorRotationData): CardOutput {
  const { sectors, rotationSignals, marketPhase, leadingSectors, laggingSectors } = data;
  
  const strongSectors = sectors.filter(s => s.relativeStrength > 1.05);
  const acceleratingSectors = sectors.filter(s => s.momentum === 'accelerating');
  const highPrioritySignals = rotationSignals.filter(s => s.importance === 'high');
  
  const sentiment = strongSectors.length > 3 ? "bullish" : strongSectors.length > 1 ? "neutral" : "bearish";
  const signalStrength = highPrioritySignals.length > 2 ? 5 : highPrioritySignals.length > 0 ? 4 : 3;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Leading Sectors", "sr_leading", leadingSectors.length, "good", { format: "number", priority: 1 }),
    createMetric("Accelerating", "sr_accel", acceleratingSectors.length, acceleratingSectors.length > 2 ? "excellent" : "good", { format: "number", priority: 1 }),
    createMetric("Rotation Signals", "sr_signals", highPrioritySignals.length, highPrioritySignals.length > 0 ? "good" : "neutral", { format: "number", priority: 2 }),
    createMetric("Market Phase", "sr_phase", 0, "neutral", { format: "text", priority: 1, displayValue: marketPhase.replace('_', ' ') }),
  ];
  
  const insights: Insight[] = [];
  
  if (leadingSectors.length > 0) {
    insights.push(createInsight("strength", `Leading sectors: ${leadingSectors.join(', ')}`, 1, ["sr_leading"]));
  }
  
  highPrioritySignals.forEach(signal => {
    insights.push(createInsight("observation", signal.message, 2, ["sr_signals"]));
  });
  
  if (laggingSectors.length > 0) {
    insights.push(createInsight("weakness", `Lagging: ${laggingSectors.join(', ')} - avoid or underweight`, 2, []));
  }
  
  return {
    cardId: "sector-rotation-tracker",
    cardCategory: "macro",
    symbol: "SECTORS",
    asOf: data.asOf,
    headline: `Market ${marketPhase.replace('_', ' ')}: ${leadingSectors.length} leading, ${laggingSectors.length} lagging sectors`,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["narrative-theme", "momentum-heatmap", "institutional-flows"],
    tags: ["rotation", "sectors", marketPhase],
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const MOCK_DATA: SectorRotationData = {
  asOf: new Date().toISOString(),
  nifty50Return1m: 2.3,
  marketPhase: 'rotation',
  leadingSectors: ['IT', 'Pharma', 'Auto'],
  laggingSectors: ['Realty', 'PSU Banks'],
  rotationSignals: [
    { type: 'leadership_change', sector: 'Banking', message: 'Private Banks taking leadership from PSU Banks', importance: 'high', timestamp: new Date().toISOString() },
    { type: 'momentum_shift', sector: 'IT', message: 'IT sector momentum accelerating after 3 months of consolidation', importance: 'high', timestamp: new Date().toISOString() },
    { type: 'fund_flow', sector: 'Pharma', message: 'FII inflows into Pharma for 4th consecutive week', importance: 'medium', timestamp: new Date().toISOString() },
  ],
  sectors: [
    {
      id: 'it',
      name: 'Information Technology',
      return1w: 2.8,
      return1m: 8.5,
      return3m: 12.3,
      relativeStrength: 1.15,
      rsRank: 1,
      momentum: 'accelerating',
      fundFlow: 'inflow',
      leadershipChange: { newLeader: 'TCS', oldLeader: 'INFY', changeDate: '2024-12-01' },
      subSectors: [
        {
          id: 'large_cap_it',
          name: 'Large Cap IT',
          return1w: 2.5,
          return1m: 7.8,
          relativeStrength: 1.12,
          leader: 'TCS',
          laggard: 'WIPRO',
          stocks: [
            { symbol: 'TCS', name: 'TCS Ltd', return1w: 3.2, return1m: 9.5, return3m: 14.2, relativeStrength: 1.18, rsRank: 1, volume: 2500000, avgVolume: 2000000, volumeRatio: 1.25, isLeader: true, isLaggard: false, momentum: 'accelerating' },
            { symbol: 'INFY', name: 'Infosys', return1w: 2.8, return1m: 8.2, return3m: 11.5, relativeStrength: 1.10, rsRank: 2, volume: 3000000, avgVolume: 2800000, volumeRatio: 1.07, isLeader: false, isLaggard: false, momentum: 'stable' },
            { symbol: 'WIPRO', name: 'Wipro', return1w: 1.2, return1m: 4.5, return3m: 6.8, relativeStrength: 0.92, rsRank: 5, volume: 1500000, avgVolume: 1800000, volumeRatio: 0.83, isLeader: false, isLaggard: true, momentum: 'decelerating' },
          ],
        },
        {
          id: 'mid_cap_it',
          name: 'Mid Cap IT',
          return1w: 3.5,
          return1m: 10.2,
          relativeStrength: 1.22,
          leader: 'LTIM',
          laggard: 'MPHASIS',
          stocks: [
            { symbol: 'LTIM', name: 'LTIMindtree', return1w: 4.1, return1m: 12.5, return3m: 18.2, relativeStrength: 1.28, rsRank: 1, volume: 800000, avgVolume: 600000, volumeRatio: 1.33, isLeader: true, isLaggard: false, momentum: 'accelerating' },
            { symbol: 'COFORGE', name: 'Coforge', return1w: 3.8, return1m: 11.2, return3m: 15.5, relativeStrength: 1.20, rsRank: 2, volume: 400000, avgVolume: 350000, volumeRatio: 1.14, isLeader: false, isLaggard: false, momentum: 'accelerating' },
          ],
        },
      ],
      topStocks: [
        { symbol: 'TCS', name: 'TCS Ltd', return1w: 3.2, return1m: 9.5, return3m: 14.2, relativeStrength: 1.18, rsRank: 1, volume: 2500000, avgVolume: 2000000, volumeRatio: 1.25, isLeader: true, isLaggard: false, momentum: 'accelerating' },
        { symbol: 'LTIM', name: 'LTIMindtree', return1w: 4.1, return1m: 12.5, return3m: 18.2, relativeStrength: 1.28, rsRank: 1, volume: 800000, avgVolume: 600000, volumeRatio: 1.33, isLeader: true, isLaggard: false, momentum: 'accelerating' },
      ],
      bottomStocks: [
        { symbol: 'WIPRO', name: 'Wipro', return1w: 1.2, return1m: 4.5, return3m: 6.8, relativeStrength: 0.92, rsRank: 5, volume: 1500000, avgVolume: 1800000, volumeRatio: 0.83, isLeader: false, isLaggard: true, momentum: 'decelerating' },
      ],
    },
    {
      id: 'banking',
      name: 'Banking',
      return1w: 1.5,
      return1m: 4.2,
      return3m: 8.5,
      relativeStrength: 1.02,
      rsRank: 3,
      momentum: 'stable',
      fundFlow: 'neutral',
      leadershipChange: { newLeader: 'HDFCBANK', oldLeader: 'SBIN', changeDate: '2024-11-15' },
      subSectors: [
        {
          id: 'private_banks',
          name: 'Private Banks',
          return1w: 2.1,
          return1m: 5.8,
          relativeStrength: 1.08,
          leader: 'HDFCBANK',
          laggard: 'AXISBANK',
          stocks: [
            { symbol: 'HDFCBANK', name: 'HDFC Bank', return1w: 2.5, return1m: 6.5, return3m: 10.2, relativeStrength: 1.12, rsRank: 1, volume: 5000000, avgVolume: 4500000, volumeRatio: 1.11, isLeader: true, isLaggard: false, momentum: 'stable' },
            { symbol: 'ICICIBANK', name: 'ICICI Bank', return1w: 2.2, return1m: 5.8, return3m: 9.5, relativeStrength: 1.08, rsRank: 2, volume: 4000000, avgVolume: 3800000, volumeRatio: 1.05, isLeader: false, isLaggard: false, momentum: 'stable' },
          ],
        },
        {
          id: 'psu_banks',
          name: 'PSU Banks',
          return1w: 0.5,
          return1m: 1.8,
          relativeStrength: 0.88,
          leader: 'SBIN',
          laggard: 'PNB',
          stocks: [
            { symbol: 'SBIN', name: 'SBI', return1w: 0.8, return1m: 2.5, return3m: 5.2, relativeStrength: 0.92, rsRank: 1, volume: 8000000, avgVolume: 7500000, volumeRatio: 1.07, isLeader: true, isLaggard: false, momentum: 'decelerating' },
            { symbol: 'PNB', name: 'PNB', return1w: -0.5, return1m: 0.8, return3m: 2.1, relativeStrength: 0.78, rsRank: 3, volume: 3000000, avgVolume: 3500000, volumeRatio: 0.86, isLeader: false, isLaggard: true, momentum: 'decelerating' },
          ],
        },
      ],
      topStocks: [
        { symbol: 'HDFCBANK', name: 'HDFC Bank', return1w: 2.5, return1m: 6.5, return3m: 10.2, relativeStrength: 1.12, rsRank: 1, volume: 5000000, avgVolume: 4500000, volumeRatio: 1.11, isLeader: true, isLaggard: false, momentum: 'stable' },
      ],
      bottomStocks: [
        { symbol: 'PNB', name: 'PNB', return1w: -0.5, return1m: 0.8, return3m: 2.1, relativeStrength: 0.78, rsRank: 3, volume: 3000000, avgVolume: 3500000, volumeRatio: 0.86, isLeader: false, isLaggard: true, momentum: 'decelerating' },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function SectorCard({ sector, isExpanded, onToggle }: { sector: Sector; isExpanded: boolean; onToggle: () => void }) {
  const rsColor = sector.relativeStrength > 1.05 ? 'text-emerald-400' : sector.relativeStrength < 0.95 ? 'text-red-400' : 'text-slate-300';
  const momentumIcon = sector.momentum === 'accelerating' ? '🚀' : sector.momentum === 'decelerating' ? '📉' : '➡️';
  const flowIcon = sector.fundFlow === 'inflow' ? '💰' : sector.fundFlow === 'outflow' ? '🔻' : '➖';
  
  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
      <button onClick={onToggle} className="w-full p-4 text-left hover:bg-slate-700/30 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
              sector.rsRank <= 3 ? 'bg-emerald-900/50' : sector.rsRank <= 6 ? 'bg-slate-700' : 'bg-red-900/50'
            }`}>
              {sector.rsRank}
            </div>
            <div>
              <div className="font-semibold text-white flex items-center gap-2">
                {sector.name}
                <span className="text-sm">{momentumIcon}</span>
                <span className="text-sm">{flowIcon}</span>
              </div>
              <div className="text-xs text-slate-400">
                {sector.subSectors.length} sub-sectors • {sector.topStocks.length + sector.bottomStocks.length} tracked stocks
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`font-semibold ${sector.return1m >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {sector.return1m >= 0 ? '+' : ''}{sector.return1m.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-500">1M Return</div>
            </div>
            <div className="text-right">
              <div className={`font-semibold ${rsColor}`}>
                {sector.relativeStrength.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500">RS vs Nifty</div>
            </div>
            <svg className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>
      
      {isExpanded && (
        <div className="border-t border-slate-700 p-4 space-y-4">
          {/* Leadership Change Alert */}
          {sector.leadershipChange.newLeader && (
            <div className="bg-amber-900/30 border border-amber-800 rounded-lg p-3 text-sm">
              <span className="text-amber-400 font-medium">⚡ Leadership Change:</span>
              <span className="text-slate-300 ml-2">
                {sector.leadershipChange.newLeader} overtook {sector.leadershipChange.oldLeader} on {new Date(sector.leadershipChange.changeDate!).toLocaleDateString()}
              </span>
            </div>
          )}
          
          {/* Sub-sectors */}
          <div>
            <div className="text-xs text-slate-500 uppercase mb-2">Sub-Sector Breakdown</div>
            <div className="grid gap-2">
              {sector.subSectors.map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg">
                  <div>
                    <div className="text-sm text-slate-200">{sub.name}</div>
                    <div className="text-xs text-slate-500">Leader: {sub.leader} • Laggard: {sub.laggard}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`text-sm font-medium ${sub.return1m >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {sub.return1m >= 0 ? '+' : ''}{sub.return1m.toFixed(1)}%
                    </div>
                    <div className={`text-sm ${sub.relativeStrength > 1 ? 'text-emerald-400' : 'text-red-400'}`}>
                      RS {sub.relativeStrength.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Top & Bottom Stocks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-emerald-400 uppercase mb-2">🏆 Sector Leaders</div>
              {sector.topStocks.map(stock => (
                <div key={stock.symbol} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{stock.symbol}</span>
                    {stock.momentum === 'accelerating' && <span className="text-xs">🚀</span>}
                  </div>
                  <div className="text-sm text-emerald-400">+{stock.return1m.toFixed(1)}%</div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs text-red-400 uppercase mb-2">⚠️ Sector Laggards</div>
              {sector.bottomStocks.map(stock => (
                <div key={stock.symbol} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{stock.symbol}</span>
                    {stock.momentum === 'decelerating' && <span className="text-xs">📉</span>}
                  </div>
                  <div className={`text-sm ${stock.return1m >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stock.return1m >= 0 ? '+' : ''}{stock.return1m.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RotationSignalsList({ signals }: { signals: RotationSignal[] }) {
  const priorityColors = {
    high: 'border-red-800 bg-red-900/20',
    medium: 'border-amber-800 bg-amber-900/20',
    low: 'border-slate-700 bg-slate-800/50',
  };
  
  return (
    <div className="space-y-2">
      {signals.map((signal, i) => (
        <div key={i} className={`p-3 rounded-lg border ${priorityColors[signal.importance]}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              signal.importance === 'high' ? 'bg-red-800 text-red-200' :
              signal.importance === 'medium' ? 'bg-amber-800 text-amber-200' : 'bg-slate-700 text-slate-300'
            }`}>
              {signal.importance.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500">{signal.sector}</span>
          </div>
          <div className="text-sm text-slate-200">{signal.message}</div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface SectorRotationTrackerProps {
  data?: SectorRotationData;
}

export default function SectorRotationTracker({ data }: SectorRotationTrackerProps) {
  const categoryStyle = CATEGORY_STYLES['macro'];

  // Ensure we have valid data with all required fields
  const safeData = useMemo(() => {
    if (data && data.sectors && data.sectors.length > 0 && data.rotationSignals) {
      return data;
    }
    return MOCK_DATA;
  }, [data]);
  
  const [expandedSector, setExpandedSector] = useState<string | null>(safeData.sectors[0]?.id || null);
  const [view, setView] = useState<'sectors' | 'signals'>('sectors');
  
  const sortedSectors = useMemo(() => {
    return [...safeData.sectors].sort((a, b) => a.rsRank - b.rsRank);
  }, [safeData.sectors]);
  
  const phaseColors = {
    risk_on: 'bg-emerald-900/50 text-emerald-400 border-emerald-800',
    risk_off: 'bg-red-900/50 text-red-400 border-red-800',
    rotation: 'bg-amber-900/50 text-amber-400 border-amber-800',
    consolidation: 'bg-slate-800 text-slate-300 border-slate-700',
  };
  
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              🔄 Sector Rotation Tracker
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Intra-sector leadership & relative strength analysis</p>
          </div>
          <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${phaseColors[safeData.marketPhase]}`}>
            {safeData.marketPhase.replace('_', ' ').toUpperCase()}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-emerald-400">{safeData.leadingSectors.length}</div>
            <div className="text-xs text-slate-500">Leading</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-red-400">{safeData.laggingSectors.length}</div>
            <div className="text-xs text-slate-500">Lagging</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-amber-400">{safeData.rotationSignals.filter(s => s.importance === 'high').length}</div>
            <div className="text-xs text-slate-500">High Priority</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className={`text-lg font-bold ${safeData.nifty50Return1m >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {safeData.nifty50Return1m >= 0 ? '+' : ''}{safeData.nifty50Return1m.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500">Nifty 1M</div>
          </div>
        </div>
      </div>
      
      {/* View Toggle */}
      <div className="flex items-center gap-1 p-2 border-b border-slate-800">
        <button onClick={() => setView('sectors')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'sectors' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
          📊 Sector Breakdown
        </button>
        <button onClick={() => setView('signals')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'signals' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
          ⚡ Rotation Signals ({safeData.rotationSignals.length})
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {view === 'sectors' ? (
          <div className="space-y-3">
            {sortedSectors.map(sector => (
              <SectorCard
                key={sector.id}
                sector={sector}
                isExpanded={expandedSector === sector.id}
                onToggle={() => setExpandedSector(expandedSector === sector.id ? null : sector.id)}
              />
            ))}
          </div>
        ) : (
          <RotationSignalsList signals={safeData.rotationSignals} />
        )}
      </div>
    </div>
  );
}
