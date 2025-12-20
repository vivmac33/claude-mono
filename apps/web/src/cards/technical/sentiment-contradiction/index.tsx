// ═══════════════════════════════════════════════════════════════════════════
// SENTIMENT CONTRADICTION DETECTOR
// Flags conflicting signals across different data sources for contrarian plays
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

type SignalDirection = 'bullish' | 'bearish' | 'neutral';

interface SignalSource {
  id: string;
  name: string;
  category: 'price' | 'volume' | 'options' | 'positioning' | 'sentiment' | 'flow';
  direction: SignalDirection;
  strength: number; // 0-100
  description: string;
  dataPoint: string;
  confidence: 'high' | 'medium' | 'low';
}

interface Contradiction {
  id: string;
  signal1: SignalSource;
  signal2: SignalSource;
  severity: 'high' | 'medium' | 'low';
  interpretation: string;
  historicalOutcome: string;
  actionSuggestion: string;
  occurredAt: string;
}

interface HistoricalPattern {
  pattern: string;
  occurrences: number;
  bullishResolution: number; // %
  bearishResolution: number; // %
  avgTimeToResolution: string;
}

export interface SentimentContradictionData {
  symbol: string;
  asOf: string;
  signals: SignalSource[];
  contradictions: Contradiction[];
  overallBias: SignalDirection;
  biasStrength: number;
  contradictionScore: number; // 0-100, higher = more contradictions
  historicalPatterns: HistoricalPattern[];
  keyInsight: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

export function getSentimentContradictionOutput(data: SentimentContradictionData): CardOutput {
  const { symbol, signals, contradictions, overallBias, contradictionScore } = data;
  
  const highSeverity = contradictions.filter(c => c.severity === 'high');
  const bullishSignals = signals.filter(s => s.direction === 'bullish');
  const bearishSignals = signals.filter(s => s.direction === 'bearish');
  
  const sentiment = overallBias;
  const signalStrength = highSeverity.length > 0 ? 5 : contradictions.length > 2 ? 4 : 3;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Contradiction Score", "sc_score", contradictionScore, 
      contradictionScore > 70 ? "poor" : contradictionScore > 40 ? "fair" : "good",
      { format: "number", priority: 1 }),
    createMetric("Bullish Signals", "sc_bull", bullishSignals.length, "neutral", { format: "number", priority: 2 }),
    createMetric("Bearish Signals", "sc_bear", bearishSignals.length, "neutral", { format: "number", priority: 2 }),
    createMetric("High Severity", "sc_high", highSeverity.length, 
      highSeverity.length > 0 ? "poor" : "good",
      { format: "number", priority: 1 }),
  ];
  
  const insights: Insight[] = [];
  
  if (highSeverity.length > 0) {
    highSeverity.forEach(c => {
      insights.push(createInsight("risk", `${c.signal1.name} vs ${c.signal2.name}: ${c.interpretation}`, 1, ["sc_high"]));
    });
  }
  
  if (contradictionScore > 60) {
    insights.push(createInsight("observation", "High contradiction score suggests potential trend change or consolidation ahead", 2, ["sc_score"]));
  }
  
  return {
    cardId: "sentiment-contradiction",
    cardCategory: "technical",
    symbol,
    asOf: data.asOf,
    headline: `${symbol}: ${contradictions.length} signal contradictions detected (Score: ${contradictionScore})`,
    sentiment,
    confidence: contradictions.length > 0 ? "medium" : "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["sentiment-zscore-mini", "trade-flow-intel", "options-interest"],
    tags: ["sentiment", "contradiction", contradictionScore > 50 ? "divergence" : "aligned"],
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const MOCK_DATA: SentimentContradictionData = {
  symbol: 'TCS',
  asOf: new Date().toISOString(),
  overallBias: 'neutral',
  biasStrength: 45,
  contradictionScore: 72,
  keyInsight: 'Price action bullish but options flow suggests institutional hedging',
  signals: [
    { id: 's1', name: 'Price Momentum', category: 'price', direction: 'bullish', strength: 75, description: 'Price above 20 EMA, making higher highs', dataPoint: '+2.3% above 20 EMA', confidence: 'high' },
    { id: 's2', name: 'Volume Trend', category: 'volume', direction: 'bullish', strength: 65, description: 'Above average volume on up days', dataPoint: '1.3x avg volume', confidence: 'high' },
    { id: 's3', name: 'Put/Call Ratio', category: 'options', direction: 'bearish', strength: 70, description: 'Elevated put buying suggests hedging', dataPoint: 'PCR: 1.4 (vs 0.9 avg)', confidence: 'high' },
    { id: 's4', name: 'Options IV Skew', category: 'options', direction: 'bearish', strength: 60, description: 'Puts more expensive than calls', dataPoint: 'IV Skew: +5.2%', confidence: 'medium' },
    { id: 's5', name: 'FII Activity', category: 'flow', direction: 'bearish', strength: 55, description: 'FIIs net sellers in cash market', dataPoint: '-₹245 Cr (5D)', confidence: 'high' },
    { id: 's6', name: 'Delivery %', category: 'positioning', direction: 'bullish', strength: 68, description: 'High delivery indicates accumulation', dataPoint: '48% delivery (vs 35% avg)', confidence: 'high' },
    { id: 's7', name: 'RSI Divergence', category: 'price', direction: 'bearish', strength: 55, description: 'Price making highs, RSI making lower highs', dataPoint: 'Bearish divergence forming', confidence: 'medium' },
    { id: 's8', name: 'Short Interest', category: 'positioning', direction: 'bullish', strength: 50, description: 'Short interest declining', dataPoint: 'SI down 12% WoW', confidence: 'medium' },
  ],
  contradictions: [
    {
      id: 'c1',
      signal1: { id: 's1', name: 'Price Momentum', category: 'price', direction: 'bullish', strength: 75, description: 'Price above 20 EMA', dataPoint: '+2.3% above 20 EMA', confidence: 'high' },
      signal2: { id: 's3', name: 'Put/Call Ratio', category: 'options', direction: 'bearish', strength: 70, description: 'Elevated put buying', dataPoint: 'PCR: 1.4', confidence: 'high' },
      severity: 'high',
      interpretation: 'Institutions may be hedging long positions or building bearish bets despite bullish price action',
      historicalOutcome: '65% of similar setups resolved bearishly within 2 weeks',
      actionSuggestion: 'Consider tightening stops or reducing position size',
      occurredAt: new Date().toISOString(),
    },
    {
      id: 'c2',
      signal1: { id: 's6', name: 'Delivery %', category: 'positioning', direction: 'bullish', strength: 68, description: 'High delivery', dataPoint: '48% delivery', confidence: 'high' },
      signal2: { id: 's5', name: 'FII Activity', category: 'flow', direction: 'bearish', strength: 55, description: 'FIIs selling', dataPoint: '-₹245 Cr', confidence: 'high' },
      severity: 'medium',
      interpretation: 'DIIs accumulating while FIIs distribute - ownership transition in progress',
      historicalOutcome: 'Often precedes short-term weakness followed by DII-driven rally',
      actionSuggestion: 'Watch for capitulation volume before adding',
      occurredAt: new Date().toISOString(),
    },
    {
      id: 'c3',
      signal1: { id: 's2', name: 'Volume Trend', category: 'volume', direction: 'bullish', strength: 65, description: 'Strong volume', dataPoint: '1.3x avg', confidence: 'high' },
      signal2: { id: 's7', name: 'RSI Divergence', category: 'price', direction: 'bearish', strength: 55, description: 'Bearish divergence', dataPoint: 'RSI lower highs', confidence: 'medium' },
      severity: 'medium',
      interpretation: 'Strong volume but weakening momentum - possible distribution phase',
      historicalOutcome: '55% resolved with 5-10% pullback',
      actionSuggestion: 'Not ideal for new longs; wait for divergence resolution',
      occurredAt: new Date().toISOString(),
    },
  ],
  historicalPatterns: [
    { pattern: 'Bullish Price + Bearish Options', occurrences: 23, bullishResolution: 35, bearishResolution: 65, avgTimeToResolution: '8 trading days' },
    { pattern: 'High Delivery + FII Selling', occurrences: 18, bullishResolution: 55, bearishResolution: 45, avgTimeToResolution: '12 trading days' },
    { pattern: 'Volume Up + RSI Divergence', occurrences: 31, bullishResolution: 45, bearishResolution: 55, avgTimeToResolution: '6 trading days' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function SignalCard({ signal }: { signal: SignalSource }) {
  const dirColors = {
    bullish: 'border-emerald-800 bg-emerald-900/20 text-emerald-400',
    bearish: 'border-red-800 bg-red-900/20 text-red-400',
    neutral: 'border-slate-700 bg-slate-800/50 text-slate-400',
  };
  
  const categoryIcons: Record<string, string> = {
    price: '📈',
    volume: '📊',
    options: '🎯',
    positioning: '🏛️',
    sentiment: '💭',
    flow: '💰',
  };
  
  return (
    <div className={`p-3 rounded-lg border ${dirColors[signal.direction]}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span>{categoryIcons[signal.category]}</span>
          <span className="font-medium text-white text-sm">{signal.name}</span>
        </div>
        <div className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${dirColors[signal.direction]}`}>
          {signal.direction}
        </div>
      </div>
      <div className="text-xs text-slate-400 mb-1">{signal.description}</div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">{signal.dataPoint}</span>
        <div className="flex items-center gap-1">
          <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${signal.direction === 'bullish' ? 'bg-emerald-500' : signal.direction === 'bearish' ? 'bg-red-500' : 'bg-slate-500'}`}
              style={{ width: `${signal.strength}%` }}
            />
          </div>
          <span className="text-xs text-slate-500">{signal.strength}%</span>
        </div>
      </div>
    </div>
  );
}

function ContradictionCard({ contradiction }: { contradiction: Contradiction }) {
  const [expanded, setExpanded] = useState(false);
  
  const severityColors = {
    high: 'border-red-700 bg-red-900/30',
    medium: 'border-amber-700 bg-amber-900/30',
    low: 'border-slate-700 bg-slate-800/50',
  };
  
  const severityBadge = {
    high: 'bg-red-800 text-red-200',
    medium: 'bg-amber-800 text-amber-200',
    low: 'bg-slate-700 text-slate-300',
  };
  
  return (
    <div className={`rounded-xl border overflow-hidden ${severityColors[contradiction.severity]}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityBadge[contradiction.severity]}`}>
              {contradiction.severity.toUpperCase()}
            </span>
            <span className="text-white font-medium">
              {contradiction.signal1.name} ↔ {contradiction.signal2.name}
            </span>
          </div>
          <svg className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-400 border border-emerald-800">
            {contradiction.signal1.direction.toUpperCase()}
          </span>
          <span className="text-slate-500">vs</span>
          <span className="px-2 py-0.5 rounded bg-red-900/50 text-red-400 border border-red-800">
            {contradiction.signal2.direction.toUpperCase()}
          </span>
        </div>
      </button>
      
      {expanded && (
        <div className="border-t border-slate-700 p-4 space-y-3">
          <div>
            <div className="text-xs text-slate-500 uppercase mb-1">Interpretation</div>
            <div className="text-sm text-slate-200">{contradiction.interpretation}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase mb-1">Historical Outcome</div>
            <div className="text-sm text-slate-300">{contradiction.historicalOutcome}</div>
          </div>
          <div className="bg-indigo-900/30 border border-indigo-800 rounded-lg p-3">
            <div className="text-xs text-indigo-400 uppercase mb-1">💡 Action Suggestion</div>
            <div className="text-sm text-slate-200">{contradiction.actionSuggestion}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContradictionMeter({ score }: { score: number }) {
  const getColor = () => {
    if (score > 70) return 'text-red-400';
    if (score > 40) return 'text-amber-400';
    return 'text-emerald-400';
  };
  
  const getLabel = () => {
    if (score > 70) return 'High Contradictions';
    if (score > 40) return 'Moderate';
    return 'Signals Aligned';
  };
  
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
      <div className={`text-4xl font-bold ${getColor()}`}>{score}</div>
      <div className="text-xs text-slate-500 mt-1">Contradiction Score</div>
      <div className={`text-sm font-medium mt-2 ${getColor()}`}>{getLabel()}</div>
      <div className="w-full h-2 bg-slate-700 rounded-full mt-3 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all ${
            score > 70 ? 'bg-red-500' : score > 40 ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface SentimentContradictionProps {
  data?: SentimentContradictionData;
  symbol?: string;
}

export default function SentimentContradictionDetector({ data, symbol }: SentimentContradictionProps) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  const [view, setView] = useState<'overview' | 'signals' | 'history'>('overview');
  
  // Ensure we always have valid data with all required fields
  const safeData = useMemo(() => {
    if (data && data.signals && data.contradictions && data.historicalPatterns) {
      return data;
    }
    // Use MOCK_DATA but update symbol if provided
    return symbol ? { ...MOCK_DATA, symbol } : MOCK_DATA;
  }, [data, symbol]);
  
  const bullishSignals = safeData.signals.filter(s => s.direction === 'bullish');
  const bearishSignals = safeData.signals.filter(s => s.direction === 'bearish');
  
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              ⚡ Sentiment Contradiction Detector
              <span className="text-sm font-normal text-slate-400">• {safeData.symbol}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Cross-signal analysis for contrarian opportunities</p>
          </div>
        </div>
        
        {/* Key Insight Banner */}
        <div className="bg-indigo-900/30 border border-indigo-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400">💡</span>
            <span className="text-sm text-slate-200">{safeData.keyInsight}</span>
          </div>
        </div>
      </div>
      
      {/* View Toggle */}
      <div className="flex items-center gap-1 p-2 border-b border-slate-800">
        <button onClick={() => setView('overview')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
          📊 Overview
        </button>
        <button onClick={() => setView('signals')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'signals' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
          📡 All Signals ({safeData.signals.length})
        </button>
        <button onClick={() => setView('history')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
          📈 Historical Patterns
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {view === 'overview' && (
          <div className="space-y-4">
            {/* Score + Stats */}
            <div className="grid grid-cols-3 gap-4">
              <ContradictionMeter score={safeData.contradictionScore} />
              <div className="bg-emerald-900/30 border border-emerald-800 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-emerald-400">{bullishSignals.length}</div>
                <div className="text-xs text-slate-500 mt-1">Bullish Signals</div>
                <div className="text-sm text-emerald-400 mt-2">
                  Avg Strength: {Math.round(bullishSignals.reduce((s, x) => s + x.strength, 0) / bullishSignals.length)}%
                </div>
              </div>
              <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-red-400">{bearishSignals.length}</div>
                <div className="text-xs text-slate-500 mt-1">Bearish Signals</div>
                <div className="text-sm text-red-400 mt-2">
                  Avg Strength: {Math.round(bearishSignals.reduce((s, x) => s + x.strength, 0) / bearishSignals.length)}%
                </div>
              </div>
            </div>
            
            {/* Contradictions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-slate-300">Active Contradictions</h4>
                <span className="text-xs text-slate-500">{safeData.contradictions.length} detected</span>
              </div>
              <div className="space-y-3">
                {safeData.contradictions.map(c => (
                  <ContradictionCard key={c.id} contradiction={c} />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {view === 'signals' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-emerald-400 uppercase mb-2">Bullish Signals</div>
              <div className="space-y-2">
                {bullishSignals.map(s => <SignalCard key={s.id} signal={s} />)}
              </div>
            </div>
            <div>
              <div className="text-xs text-red-400 uppercase mb-2">Bearish Signals</div>
              <div className="space-y-2">
                {bearishSignals.map(s => <SignalCard key={s.id} signal={s} />)}
              </div>
            </div>
          </div>
        )}
        
        {view === 'history' && (
          <div className="space-y-3">
            <div className="text-sm text-slate-400 mb-3">
              Historical resolution patterns for similar contradiction setups:
            </div>
            {safeData.historicalPatterns.map((p, i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg p-4">
                <div className="font-medium text-white mb-2">{p.pattern}</div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500">Occurrences</div>
                    <div className="text-slate-200">{p.occurrences}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Bullish Resolution</div>
                    <div className="text-emerald-400">{p.bullishResolution}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Bearish Resolution</div>
                    <div className="text-red-400">{p.bearishResolution}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Avg Resolution Time</div>
                    <div className="text-slate-200">{p.avgTimeToResolution}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
