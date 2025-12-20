// ═══════════════════════════════════════════════════════════════════════════
// PLAYBOOK BUILDER
// Auto-generates trading playbooks based on style selection
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

interface PlaybookBuilderProps {
  data?: PlaybookData;
  symbol?: string;
}

export interface PlaybookData {
  instrument?: string;
  currentPrice?: number;
  atr?: number;
  selectedStyle?: TradingStyle;
}

type TradingStyle = 'scalper' | 'intraday' | 'swing' | 'positional' | 'investor';

interface PlaybookConfig {
  name: string;
  description: string;
  timeframes: { primary: string; secondary: string; entry: string };
  indicators: string[];
  entryRules: string[];
  exitRules: string[];
  riskRules: string[];
  avoidRules: string[];
  keyLevels: string[];
  sessionTiming: string;
  holdingPeriod: string;
  riskPerTrade: string;
  targetRR: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getPlaybookBuilderOutput(data: PlaybookData): CardOutput {
  const style = data.selectedStyle || 'intraday';
  const playbook = PLAYBOOK_CONFIGS[style];
  
  const keyMetrics: MetricValue[] = [
    createMetric("Primary Timeframe", "pb_tf_primary", 0, "neutral", 
      { format: "text", priority: 1, displayValue: playbook.timeframes.primary }),
    createMetric("Entry Timeframe", "pb_tf_entry", 0, "neutral", 
      { format: "text", priority: 2, displayValue: playbook.timeframes.entry }),
    createMetric("Risk Per Trade", "pb_risk", 0, "neutral", 
      { format: "text", priority: 1, displayValue: playbook.riskPerTrade }),
    createMetric("Target R:R", "pb_target", 0, "neutral", 
      { format: "text", priority: 1, displayValue: playbook.targetRR }),
    createMetric("Holding Period", "pb_holding", 0, "neutral", 
      { format: "text", priority: 2, displayValue: playbook.holdingPeriod }),
  ];
  
  if (data.currentPrice && data.atr) {
    keyMetrics.push(
      createMetric("Current Price", "pb_price", data.currentPrice, "neutral", 
        { format: "currency", priority: 1, unit: "₹" }),
      createMetric("ATR", "pb_atr", data.atr, "neutral", 
        { format: "currency", priority: 2, unit: "₹" })
    );
  }
  
  const insights: Insight[] = [
    createInsight("observation", `${playbook.name}: ${playbook.description}`, 1),
    createInsight("action", `Key indicators: ${playbook.indicators.slice(0, 3).join(", ")}`, 2),
    createInsight("action", `Entry rules: ${playbook.entryRules.length} rules defined`, 3),
    createInsight("risk", `Risk management: ${playbook.riskRules[0]}`, 2),
  ];
  
  return {
    cardId: "playbook-builder",
    cardCategory: "technical",
    symbol: data.instrument || "N/A",
    asOf: new Date().toISOString().split('T')[0],
    headline: `${playbook.name} playbook: ${playbook.holdingPeriod} trades, ${playbook.riskPerTrade} risk`,
    sentiment: "neutral",
    confidence: "high",
    signalStrength: 3 as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["pattern-matcher", "trend-strength", "technical-indicators"],
    tags: ["playbook", style, "trading-system"],
    scoreContribution: {
      category: "momentum",
      score: 50,
      weight: 0.05,
    },
  };
}

const PLAYBOOK_CONFIGS: Record<TradingStyle, PlaybookConfig> = {
  scalper: {
    name: 'Index Scalper',
    description: 'Quick in-and-out trades on Nifty/Bank Nifty using price action and momentum',
    timeframes: { primary: '5min', secondary: '1min', entry: '1min' },
    indicators: ['VWAP', 'CPR Levels', 'RSI (14)', 'Volume', 'EMA 9/21'],
    entryRules: [
      'Wait for first 15 minutes to establish opening range',
      'Enter LONG when price breaks above Opening Range High with volume > 1.5x avg',
      'Enter SHORT when price breaks below Opening Range Low with volume > 1.5x avg',
      'Use 1-min candle close above/below VWAP as confirmation',
      'RSI should be > 60 for longs, < 40 for shorts',
    ],
    exitRules: [
      'Exit at CPR resistance/support levels',
      'Exit if RSI reaches extreme (>80 or <20)',
      'Time-based exit: close all positions by 3:15 PM',
      'Trail stop to breakeven after 1R profit',
    ],
    riskRules: [
      'Max risk per trade: 0.5% of capital',
      'Max daily loss: 1.5% of capital',
      'Max 3 consecutive losses then stop for the day',
      'Position size: Capital × 0.5% ÷ Stop distance',
    ],
    avoidRules: [
      'No trades in first 5 minutes',
      'No trades during 12:30-1:30 PM (lunch chop)',
      'No trades on major event days (RBI policy, Budget, etc.)',
      'No counter-trend trades in strong trending days',
    ],
    keyLevels: ['Opening Range High/Low', 'Previous Day High/Low', 'CPR levels', 'VWAP', 'Round numbers (50/100)'],
    sessionTiming: '9:30 AM - 3:15 PM',
    holdingPeriod: '5-30 minutes',
    riskPerTrade: '0.5%',
    targetRR: '1:1.5 to 1:2',
  },
  intraday: {
    name: 'Intraday Momentum Trader',
    description: 'Capture intraday trends in liquid stocks and indices',
    timeframes: { primary: '15min', secondary: '5min', entry: '5min' },
    indicators: ['EMA 20/50', 'MACD', 'RSI (14)', 'Volume Profile', 'ATR'],
    entryRules: [
      'Identify 15-min trend direction using EMA 20 slope',
      'Wait for pullback to EMA 20 on 15-min chart',
      'Enter on 5-min bullish/bearish engulfing at support',
      'MACD should be above/below signal line',
      'Volume should be above 20-period average',
    ],
    exitRules: [
      'Target: 1.5x ATR from entry',
      'Stop: 1x ATR from entry',
      'Exit if MACD crosses against trade direction',
      'Compulsory exit by 3:20 PM',
    ],
    riskRules: [
      'Max risk per trade: 1% of capital',
      'Max daily loss: 2% of capital',
      'Max 2 open positions at a time',
      'No averaging down on losing trades',
    ],
    avoidRules: [
      'Avoid low-volume stocks (< ₹10cr daily turnover)',
      'No trades after 2:30 PM unless strong trend',
      'Avoid trading during major global market opens',
      'No trades on weekly expiry day (for index)',
    ],
    keyLevels: ['Daily Pivot', 'PDH/PDL', 'VWAP', 'Gap levels', 'Volume nodes'],
    sessionTiming: '9:15 AM - 3:20 PM',
    holdingPeriod: '30 min - 4 hours',
    riskPerTrade: '1%',
    targetRR: '1:1.5',
  },
  swing: {
    name: 'Swing Trader',
    description: 'Capture multi-day trends with defined risk',
    timeframes: { primary: 'Daily', secondary: '4H', entry: '1H' },
    indicators: ['EMA 20/50/200', 'RSI (14)', 'MACD', 'Volume', 'Supertrend'],
    entryRules: [
      'Daily trend must be up (price > EMA 50)',
      'Wait for 3-5 day pullback to EMA 20',
      'Enter on 4H bullish reversal pattern (hammer, engulfing)',
      'RSI should be rising from < 50 level',
      'Supertrend should give buy signal within 2 days',
    ],
    exitRules: [
      'Target 1: Previous swing high (book 50%)',
      'Target 2: 2x ATR (14) from entry',
      'Stop: Below the pullback low or EMA 20',
      'Exit if daily close below EMA 50',
    ],
    riskRules: [
      'Max risk per trade: 2% of capital',
      'Max sector exposure: 20% of capital',
      'Max 5 open positions',
      'Reduce position size in high VIX environment',
    ],
    avoidRules: [
      'No entries before major events (earnings, RBI)',
      'Avoid stocks with corporate actions pending',
      'No entries on Friday for weekly positions',
      'Avoid low-liquidity stocks (< 1000 daily volume)',
    ],
    keyLevels: ['52-week High/Low', 'Major swing points', 'EMA 200', 'Gap zones', 'Fibonacci retracements'],
    sessionTiming: 'Daily review at 9:00 PM',
    holdingPeriod: '3-15 trading days',
    riskPerTrade: '2%',
    targetRR: '1:2 to 1:3',
  },
  positional: {
    name: 'Positional Trader',
    description: 'Capture medium-term trends lasting weeks to months',
    timeframes: { primary: 'Weekly', secondary: 'Daily', entry: 'Daily' },
    indicators: ['EMA 10/30 Weekly', 'RSI Weekly', 'Volume', 'Relative Strength vs Nifty', 'ADX'],
    entryRules: [
      'Weekly trend must be up (EMA 10 > EMA 30)',
      'Stock should be outperforming Nifty (RS > 1)',
      'Enter on daily close above weekly resistance',
      'ADX > 25 indicating trending market',
      'FII/DII data should show accumulation',
    ],
    exitRules: [
      'Exit on weekly EMA 10/30 bearish crossover',
      'Book partial at 15-20% gain',
      'Trail stop to weekly EMA 10',
      'Exit if relative strength drops below 0.9',
    ],
    riskRules: [
      'Max risk per trade: 3% of capital',
      'Max portfolio heat: 15%',
      'Max 8-10 positions',
      'Diversify across sectors',
    ],
    avoidRules: [
      'Avoid during election/budget uncertainty',
      'No highly leveraged companies (D/E > 2)',
      'Avoid stocks in structural downtrend',
      'No micro-caps (Mcap < ₹1000cr)',
    ],
    keyLevels: ['52-week High', 'All-time High', 'Weekly pivots', 'Sector rotation levels'],
    sessionTiming: 'Weekend review',
    holdingPeriod: '3 weeks - 3 months',
    riskPerTrade: '3%',
    targetRR: '1:3 to 1:5',
  },
  investor: {
    name: 'Long-term Investor',
    description: 'Build wealth through quality stocks held for years',
    timeframes: { primary: 'Monthly', secondary: 'Weekly', entry: 'Weekly' },
    indicators: ['200 DMA', 'Fundamentals (PE, ROE, ROCE)', 'Earnings Growth', 'Dividend Yield', 'Free Cash Flow'],
    entryRules: [
      'Piotroski Score > 7',
      'ROE > 15% for 3+ years',
      'Debt-to-Equity < 1',
      'Consistent earnings growth > 10% CAGR',
      'Buy on monthly close above 200 DMA',
      'Use SIP for accumulation in quality stocks',
    ],
    exitRules: [
      'Exit if fundamentals deteriorate',
      'Exit if management issues arise',
      'Partial exit at 100%+ gain for rebalancing',
      'Review annually, not quarterly',
    ],
    riskRules: [
      'Max 5% in single stock initially',
      'Max 20% in single sector',
      'Maintain 10-15 stock portfolio',
      'Keep 10-20% cash for opportunities',
    ],
    avoidRules: [
      'No penny stocks or tips',
      'No companies with poor governance',
      'Avoid highly cyclical stocks',
      'No companies with declining margins',
    ],
    keyLevels: ['52-week Low for accumulation', 'Earnings support levels', 'Book value'],
    sessionTiming: 'Monthly review',
    holdingPeriod: '1-10+ years',
    riskPerTrade: '5% max position',
    targetRR: 'Long-term compounding',
  },
};

export default function PlaybookBuilder({ data }: PlaybookBuilderProps) {
  const categoryStyle = CATEGORY_STYLES['technical'];

  const [style, setStyle] = useState<TradingStyle>('intraday');
  const [showDetails, setShowDetails] = useState(true);
  
  const playbook = PLAYBOOK_CONFIGS[style];

  const styleButtons: { style: TradingStyle; label: string; icon: string }[] = [
    { style: 'scalper', label: 'Scalper', icon: '⚡' },
    { style: 'intraday', label: 'Intraday', icon: '📊' },
    { style: 'swing', label: 'Swing', icon: '🌊' },
    { style: 'positional', label: 'Positional', icon: '📈' },
    { style: 'investor', label: 'Investor', icon: '🏦' },
  ];

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-5 border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider">Playbook Builder</div>
          <div className="text-lg font-semibold text-slate-100">{playbook.name}</div>
          <div className="text-xs text-slate-400 mt-1">{playbook.description}</div>
        </div>
      </div>

      {/* Style Selector */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
        {styleButtons.map(({ style: s, label, icon }) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              style === s
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="p-3 bg-slate-800/50 rounded-lg text-center">
          <div className="text-lg font-semibold text-blue-400">{playbook.timeframes.primary}</div>
          <div className="text-xs text-slate-500">Primary TF</div>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-lg text-center">
          <div className="text-lg font-semibold text-purple-400">{playbook.riskPerTrade}</div>
          <div className="text-xs text-slate-500">Risk/Trade</div>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-lg text-center">
          <div className="text-lg font-semibold text-emerald-400">{playbook.targetRR}</div>
          <div className="text-xs text-slate-500">Target R:R</div>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-lg text-center">
          <div className="text-lg font-semibold text-yellow-400">{playbook.holdingPeriod}</div>
          <div className="text-xs text-slate-500">Holding</div>
        </div>
      </div>

      {/* Timeframe Stack */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-5">
        <div className="text-sm font-medium text-blue-400 mb-3">📐 Timeframe Stack</div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-200">{playbook.timeframes.primary}</div>
            <div className="text-xs text-slate-500">Trend</div>
          </div>
          <div className="text-slate-600">→</div>
          <div className="text-center">
            <div className="text-lg font-bold text-slate-200">{playbook.timeframes.secondary}</div>
            <div className="text-xs text-slate-500">Setup</div>
          </div>
          <div className="text-slate-600">→</div>
          <div className="text-center">
            <div className="text-lg font-bold text-slate-200">{playbook.timeframes.entry}</div>
            <div className="text-xs text-slate-500">Entry</div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="mb-5">
        <div className="text-sm font-medium text-slate-300 mb-2">📉 Indicator Bundle</div>
        <div className="flex flex-wrap gap-2">
          {playbook.indicators.map((indicator, i) => (
            <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs">
              {indicator}
            </span>
          ))}
        </div>
      </div>

      {/* Rules Sections */}
      <div className="space-y-4">
        {/* Entry Rules */}
        <RulesSection 
          title="✅ Entry Rules" 
          rules={playbook.entryRules} 
          color="emerald"
        />
        
        {/* Exit Rules */}
        <RulesSection 
          title="🚪 Exit Rules" 
          rules={playbook.exitRules} 
          color="blue"
        />
        
        {/* Risk Rules */}
        <RulesSection 
          title="🛡️ Risk Management" 
          rules={playbook.riskRules} 
          color="yellow"
        />
        
        {/* Avoid Rules */}
        <RulesSection 
          title="⛔ Avoid Rules" 
          rules={playbook.avoidRules} 
          color="red"
        />
      </div>

      {/* Key Levels */}
      <div className="mt-5 p-4 bg-slate-800/30 rounded-lg">
        <div className="text-sm font-medium text-slate-300 mb-2">🎯 Key Levels to Watch</div>
        <div className="flex flex-wrap gap-2">
          {playbook.keyLevels.map((level, i) => (
            <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
              {level}
            </span>
          ))}
        </div>
      </div>

      {/* Session Timing */}
      <div className="mt-4 flex items-center justify-between text-xs p-3 bg-slate-800/30 rounded-lg">
        <div>
          <span className="text-slate-500">Session: </span>
          <span className="text-slate-300">{playbook.sessionTiming}</span>
        </div>
        <div>
          <span className="text-slate-500">Holding: </span>
          <span className="text-slate-300">{playbook.holdingPeriod}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-500">
          💡 Stick to ONE playbook style. Mixing styles leads to confusion and losses. Master one approach before exploring others.
        </div>
      </div>
    </div>
  );
}

function RulesSection({ title, rules, color }: { title: string; rules: string[]; color: string }) {
  const colors: Record<string, string> = {
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
    blue: 'border-blue-500/30 bg-blue-500/5',
    yellow: 'border-yellow-500/30 bg-yellow-500/5',
    red: 'border-red-500/30 bg-red-500/5',
  };
  
  const textColors: Record<string, string> = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[color]}`}>
      <div className={`text-sm font-medium ${textColors[color]} mb-2`}>{title}</div>
      <ul className="space-y-1">
        {rules.map((rule, i) => (
          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
            <span className={textColors[color]}>•</span>
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
}
