// ═══════════════════════════════════════════════════════════════════════════
// OPTIONS STRATEGY EXPLAINER
// Pre-trade risk explanation for common options strategies
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import OptionsPayoffBuilder from '@/components/options/OptionsPayoffBuilder';

interface OptionsStrategyProps {
  data?: OptionsData;
  symbol?: string;
}

interface OptionsData {
  underlying: string;
  spotPrice: number;
  lotSize: number;
  iv: number;
  historicalVol30d: number;
  daysToExpiry: number;
  riskFreeRate: number;
}

type Strategy = 
  | 'long_call' 
  | 'long_put' 
  | 'short_straddle' 
  | 'short_strangle' 
  | 'bull_call_spread' 
  | 'bear_put_spread'
  | 'iron_condor'
  | 'covered_call';

const DEFAULT_DATA: OptionsData = {
  underlying: 'NIFTY',
  spotPrice: 22500,
  lotSize: 50,
  iv: 14.5,
  historicalVol30d: 12.8,
  daysToExpiry: 7,
  riskFreeRate: 6.5,
};

interface StrategyConfig {
  name: string;
  type: 'bullish' | 'bearish' | 'neutral' | 'volatile';
  legs: string[];
  maxProfit: string;
  maxLoss: string;
  breakeven: string;
  description: string;
  bestWhen: string[];
  avoid: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'unlimited';
}

const STRATEGIES: Record<Strategy, StrategyConfig> = {
  long_call: {
    name: 'Long Call',
    type: 'bullish',
    legs: ['Buy 1 Call'],
    maxProfit: 'Unlimited',
    maxLoss: 'Premium Paid',
    breakeven: 'Strike + Premium',
    description: 'Simple bullish bet expecting price to rise above strike + premium',
    bestWhen: ['Strong bullish view', 'IV is low', 'Expecting big move up'],
    avoid: ['High IV environment', 'Near expiry (time decay)', 'Sideways market'],
    riskLevel: 'medium',
  },
  long_put: {
    name: 'Long Put',
    type: 'bearish',
    legs: ['Buy 1 Put'],
    maxProfit: 'Strike - Premium (if goes to 0)',
    maxLoss: 'Premium Paid',
    breakeven: 'Strike - Premium',
    description: 'Simple bearish bet expecting price to fall below strike - premium',
    bestWhen: ['Strong bearish view', 'IV is low', 'Expecting big move down'],
    avoid: ['High IV environment', 'Near expiry', 'Uptrending market'],
    riskLevel: 'medium',
  },
  short_straddle: {
    name: 'Short Straddle',
    type: 'neutral',
    legs: ['Sell 1 ATM Call', 'Sell 1 ATM Put'],
    maxProfit: 'Total Premium Received',
    maxLoss: 'UNLIMITED',
    breakeven: 'Strike ± Total Premium',
    description: 'Betting on low volatility - profit if price stays near strike',
    bestWhen: ['High IV (overpriced options)', 'Range-bound market', 'Post-event IV crush'],
    avoid: ['Low IV', 'Before events', 'Trending markets', 'Without hedging'],
    riskLevel: 'unlimited',
  },
  short_strangle: {
    name: 'Short Strangle',
    type: 'neutral',
    legs: ['Sell 1 OTM Call', 'Sell 1 OTM Put'],
    maxProfit: 'Total Premium Received',
    maxLoss: 'UNLIMITED',
    breakeven: 'Call Strike + Premium / Put Strike - Premium',
    description: 'Wider profit zone than straddle but lower premium collected',
    bestWhen: ['High IV', 'Range-bound with clear support/resistance', 'After VIX spike'],
    avoid: ['Low IV', 'Before major events', 'Strong trends'],
    riskLevel: 'unlimited',
  },
  bull_call_spread: {
    name: 'Bull Call Spread',
    type: 'bullish',
    legs: ['Buy 1 ITM/ATM Call', 'Sell 1 OTM Call'],
    maxProfit: 'Width of Strikes - Net Premium',
    maxLoss: 'Net Premium Paid',
    breakeven: 'Lower Strike + Net Premium',
    description: 'Defined risk bullish trade with capped profit',
    bestWhen: ['Moderately bullish', 'High IV (reduces cost)', 'Want defined risk'],
    avoid: ['Strong breakout expected', 'Very low IV'],
    riskLevel: 'low',
  },
  bear_put_spread: {
    name: 'Bear Put Spread',
    type: 'bearish',
    legs: ['Buy 1 ITM/ATM Put', 'Sell 1 OTM Put'],
    maxProfit: 'Width of Strikes - Net Premium',
    maxLoss: 'Net Premium Paid',
    breakeven: 'Higher Strike - Net Premium',
    description: 'Defined risk bearish trade with capped profit',
    bestWhen: ['Moderately bearish', 'High IV', 'Want defined risk'],
    avoid: ['Crash expected', 'Very low IV'],
    riskLevel: 'low',
  },
  iron_condor: {
    name: 'Iron Condor',
    type: 'neutral',
    legs: ['Sell 1 OTM Put', 'Buy 1 Further OTM Put', 'Sell 1 OTM Call', 'Buy 1 Further OTM Call'],
    maxProfit: 'Net Premium Received',
    maxLoss: 'Width of Wider Spread - Net Premium',
    breakeven: 'Short Put - Premium / Short Call + Premium',
    description: 'Range-bound strategy with defined risk on both sides',
    bestWhen: ['High IV', 'Clear range', 'After VIX spike', 'Weekly expiry'],
    avoid: ['Before events', 'Trending markets', 'Low IV'],
    riskLevel: 'medium',
  },
  covered_call: {
    name: 'Covered Call',
    type: 'neutral',
    legs: ['Hold Stock/Futures', 'Sell 1 OTM Call'],
    maxProfit: 'Strike - Entry + Premium',
    maxLoss: 'Entry Price - Premium (if stock goes to 0)',
    breakeven: 'Entry Price - Premium',
    description: 'Generate income on existing holdings, cap upside',
    bestWhen: ['Own stock and neutral view', 'High IV on stock', 'Want income'],
    avoid: ['Strong bullish view', 'Low IV'],
    riskLevel: 'low',
  },
};

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

export { OptionsData };

export function getOptionsStrategyOutput(data: OptionsData, selectedStrategy: Strategy = 'iron_condor'): CardOutput {
  const { underlying, spotPrice, lotSize, iv, historicalVol30d, daysToExpiry, riskFreeRate } = data;
  
  const config = STRATEGIES[selectedStrategy];
  const ivPremium = iv - historicalVol30d;
  const isIVHigh = ivPremium > 2;
  
  const sentiment = config.type === "bullish" ? "bullish" : config.type === "bearish" ? "bearish" : "neutral";
  const signalStrength = isIVHigh && (config.type === "neutral") ? 4 : 3;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Spot Price", "os_spot", spotPrice, "neutral", 
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("Implied Vol", "os_iv", iv, 
      iv > 20 ? "risky" : "neutral",
      { format: "percent", priority: 1 }),
    createMetric("Historical Vol", "os_hv", historicalVol30d, "neutral", 
      { format: "percent", priority: 2 }),
    createMetric("IV Premium", "os_ivprem", ivPremium, 
      ivPremium > 3 ? "excellent" : ivPremium > 0 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("Days to Expiry", "os_dte", daysToExpiry, 
      daysToExpiry < 7 ? "risky" : "neutral",
      { format: "number", priority: 1 }),
    createMetric("Lot Size", "os_lot", lotSize, "neutral", 
      { format: "number", priority: 2 }),
    createMetric("Risk-Free Rate", "os_rfr", riskFreeRate, "neutral", 
      { format: "percent", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Strategy info
  insights.push(createInsight("observation", `${config.name}: ${config.description}`, 1));
  
  // IV analysis
  if (isIVHigh) {
    insights.push(createInsight("opportunity", `IV premium ${ivPremium.toFixed(1)}% above HV - selling strategies favored`, 1, ["os_ivprem"]));
  } else if (ivPremium < -2) {
    insights.push(createInsight("observation", `IV ${Math.abs(ivPremium).toFixed(1)}% below HV - buying strategies may benefit`, 2, ["os_ivprem"]));
  }
  
  // DTE
  if (daysToExpiry <= 3) {
    insights.push(createInsight("risk", `${daysToExpiry} DTE - theta decay accelerating, gamma risk elevated`, 1, ["os_dte"]));
  }
  
  // Risk level
  if (config.riskLevel === "unlimited") {
    insights.push(createInsight("risk", `Unlimited risk strategy - strict position sizing required`, 1));
  }
  
  // Best when
  insights.push(createInsight("action", `Best when: ${config.bestWhen.slice(0, 2).join(", ")}`, 2));
  
  const headline = `${underlying} ${config.name}: IV ${iv}% (${ivPremium >= 0 ? "+" : ""}${ivPremium.toFixed(1)}% vs HV), ${daysToExpiry} DTE`;
  
  return {
    cardId: "options-strategy",
    cardCategory: "derivatives",
    symbol: underlying,
    asOf: new Date().toISOString().split('T')[0],
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["options-interest", "volatility-regime", "technical-indicators"],
    tags: ["options", selectedStrategy, config.type, config.riskLevel],
    scoreContribution: {
      category: "momentum",
      score: 50 + ivPremium * 3,
      weight: 0.05,
    },
  };
}

export default function OptionsStrategyExplainer({ data }: OptionsStrategyProps) {
  const categoryStyle = CATEGORY_STYLES['derivatives'];

  const [strategy, setStrategy] = useState<Strategy>('iron_condor');
  const [lots, setLots] = useState(1);
  const [activeTab, setActiveTab] = useState<'explainer' | 'builder'>('explainer');
  
  // Use provided data or fallback to defaults
  const safeData = data && data.spotPrice ? data : DEFAULT_DATA;
  
  const config = STRATEGIES[strategy];
  
  const calculations = useMemo(() => {
    const { spotPrice, lotSize, iv, historicalVol30d, daysToExpiry, riskFreeRate } = safeData;
    
    // IV vs HV edge
    const ivEdge = iv - historicalVol30d;
    const ivEdgePercent = (ivEdge / historicalVol30d) * 100;
    const isIVRich = ivEdge > 2;
    
    // Expected move (1 standard deviation)
    const expectedMove = spotPrice * (iv / 100) * Math.sqrt(daysToExpiry / 365);
    const expectedMovePercent = (expectedMove / spotPrice) * 100;
    
    // ATM premium approximation (simplified Black-Scholes)
    const atmPremium = spotPrice * (iv / 100) * Math.sqrt(daysToExpiry / 365) * 0.4;
    
    // Strategy-specific calculations
    let maxProfitRupees = 0;
    let maxLossRupees = 0;
    let marginRequired = 0;
    let roiPercent = 0;
    let breakEvenLow = 0;
    let breakEvenHigh = 0;
    let popPercent = 50; // Probability of Profit
    
    const premiumPerLot = atmPremium * lotSize;
    const totalPremium = premiumPerLot * lots;
    
    switch (strategy) {
      case 'long_call':
      case 'long_put':
        maxProfitRupees = Infinity;
        maxLossRupees = totalPremium;
        marginRequired = totalPremium;
        popPercent = 35; // Long options typically have low POP
        breakEvenLow = strategy === 'long_call' ? spotPrice + atmPremium : spotPrice - atmPremium;
        breakEvenHigh = breakEvenLow;
        break;
        
      case 'short_straddle':
        maxProfitRupees = totalPremium * 2;
        maxLossRupees = Infinity;
        marginRequired = spotPrice * lotSize * lots * 0.15; // ~15% margin
        popPercent = 55;
        breakEvenLow = spotPrice - atmPremium * 2;
        breakEvenHigh = spotPrice + atmPremium * 2;
        roiPercent = (maxProfitRupees / marginRequired) * 100;
        break;
        
      case 'short_strangle':
        const stranglePremium = atmPremium * 0.4 * 2; // OTM options
        maxProfitRupees = stranglePremium * lotSize * lots;
        maxLossRupees = Infinity;
        marginRequired = spotPrice * lotSize * lots * 0.12;
        popPercent = 65;
        breakEvenLow = spotPrice * 0.97 - stranglePremium;
        breakEvenHigh = spotPrice * 1.03 + stranglePremium;
        roiPercent = (maxProfitRupees / marginRequired) * 100;
        break;
        
      case 'bull_call_spread':
      case 'bear_put_spread':
        const spreadWidth = spotPrice * 0.02; // 2% width
        const netDebit = atmPremium * 0.5;
        maxProfitRupees = (spreadWidth - netDebit) * lotSize * lots;
        maxLossRupees = netDebit * lotSize * lots;
        marginRequired = maxLossRupees;
        popPercent = 45;
        roiPercent = (maxProfitRupees / maxLossRupees) * 100;
        break;
        
      case 'iron_condor':
        const icPremium = atmPremium * 0.3 * 2;
        const icWidth = spotPrice * 0.02;
        maxProfitRupees = icPremium * lotSize * lots;
        maxLossRupees = (icWidth - icPremium) * lotSize * lots;
        marginRequired = maxLossRupees * 1.2;
        popPercent = 60;
        breakEvenLow = spotPrice * 0.97 - icPremium;
        breakEvenHigh = spotPrice * 1.03 + icPremium;
        roiPercent = (maxProfitRupees / marginRequired) * 100;
        break;
        
      case 'covered_call':
        maxProfitRupees = (spotPrice * 0.03 + atmPremium * 0.4) * lotSize * lots;
        maxLossRupees = spotPrice * lotSize * lots; // If stock goes to 0
        marginRequired = spotPrice * lotSize * lots;
        popPercent = 70;
        roiPercent = (atmPremium * 0.4 / spotPrice) * 100 * (365 / daysToExpiry);
        break;
    }
    
    return {
      ivEdge,
      ivEdgePercent,
      isIVRich,
      expectedMove,
      expectedMovePercent,
      atmPremium,
      maxProfitRupees,
      maxLossRupees,
      marginRequired,
      roiPercent,
      breakEvenLow,
      breakEvenHigh,
      popPercent,
      totalPremium,
    };
  }, [data, strategy, lots]);

  const riskColors = {
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    unlimited: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const typeColors = {
    bullish: 'text-emerald-400',
    bearish: 'text-red-400',
    neutral: 'text-yellow-400',
    volatile: 'text-purple-400',
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      {/* Header with Tabs */}
      <div className="bg-slate-800/50 border-b border-slate-700 p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Options Strategy</div>
            <div className="text-lg font-semibold text-slate-100">{safeData.underlying} Options</div>
            <div className="text-xs text-slate-400 mt-1">Spot: ₹{safeData.spotPrice.toLocaleString()} | IV: {safeData.iv}% | {safeData.daysToExpiry} DTE</div>
          </div>
          {activeTab === 'explainer' && (
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${riskColors[config.riskLevel]}`}>
              {config.riskLevel === 'unlimited' ? '⚠️ UNLIMITED RISK' : config.riskLevel.toUpperCase() + ' RISK'}
            </div>
          )}
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('explainer')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'explainer'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            📚 Learn Strategies
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'builder'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            📊 Payoff Builder
          </button>
        </div>
      </div>

      {activeTab === 'builder' ? (
        <OptionsPayoffBuilder 
          data={{
            symbol: safeData.underlying,
            spotPrice: safeData.spotPrice,
            futuresPrice: safeData.spotPrice * 1.002,
            lotSize: safeData.lotSize,
            iv: safeData.iv,
            ivPercentile: 35,
            daysToExpiry: safeData.daysToExpiry,
            expiries: ['19DEC2024', '26DEC2024', '02JAN2025', '30JAN2025'],
          }}
        />
      ) : (
      <div className="p-5">

      {/* Strategy Selector */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(Object.keys(STRATEGIES) as Strategy[]).map(s => (
          <button
            key={s}
            onClick={() => setStrategy(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              strategy === s
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {STRATEGIES[s].name}
          </button>
        ))}
      </div>

      {/* Strategy Info */}
      <div className="p-4 bg-slate-800/50 rounded-lg mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold text-slate-100">{config.name}</div>
          <div className={`text-sm font-medium ${typeColors[config.type]}`}>
            {config.type.charAt(0).toUpperCase() + config.type.slice(1)}
          </div>
        </div>
        <div className="text-sm text-slate-400 mb-3">{config.description}</div>
        <div className="flex flex-wrap gap-2">
          {config.legs.map((leg, i) => (
            <span key={i} className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
              {leg}
            </span>
          ))}
        </div>
      </div>

      {/* Lots Input */}
      <div className="flex items-center gap-4 mb-5">
        <label className="text-sm text-slate-400">Number of Lots:</label>
        <input
          type="number"
          min="1"
          max="100"
          value={lots}
          onChange={(e) => setLots(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
        />
        <span className="text-xs text-slate-500">({lots * safeData.lotSize} qty)</span>
      </div>

      {/* Risk/Reward Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <div className="text-lg font-semibold text-emerald-400">
            {calculations.maxProfitRupees === Infinity 
              ? '∞' 
              : `₹${(calculations.maxProfitRupees / 1000).toFixed(1)}K`}
          </div>
          <div className="text-xs text-slate-400">Max Profit</div>
        </div>
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="text-lg font-semibold text-red-400">
            {calculations.maxLossRupees === Infinity 
              ? '∞ UNLIMITED' 
              : `₹${(calculations.maxLossRupees / 1000).toFixed(1)}K`}
          </div>
          <div className="text-xs text-slate-400">Max Loss</div>
        </div>
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="text-lg font-semibold text-blue-400">
            ₹{(calculations.marginRequired / 1000).toFixed(1)}K
          </div>
          <div className="text-xs text-slate-400">Margin Required</div>
        </div>
        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <div className="text-lg font-semibold text-purple-400">
            {calculations.popPercent.toFixed(0)}%
          </div>
          <div className="text-xs text-slate-400">Prob. of Profit</div>
        </div>
      </div>

      {/* IV Analysis */}
      <div className={`p-4 rounded-lg mb-5 ${
        calculations.isIVRich 
          ? 'bg-emerald-500/10 border border-emerald-500/30' 
          : 'bg-yellow-500/10 border border-yellow-500/30'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-slate-300">IV vs Historical Volatility</div>
          <div className={calculations.isIVRich ? 'text-emerald-400' : 'text-yellow-400'}>
            {calculations.isIVRich ? '✓ IV Rich (Good for Selling)' : '⚠ IV Cheap (Favor Buying)'}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-slate-200">{safeData.iv.toFixed(1)}%</div>
            <div className="text-xs text-slate-500">Current IV</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-200">{safeData.historicalVol30d.toFixed(1)}%</div>
            <div className="text-xs text-slate-500">30d HV</div>
          </div>
          <div>
            <div className={`text-lg font-semibold ${calculations.ivEdge > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {calculations.ivEdge >= 0 ? '+' : ''}{calculations.ivEdge.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500">IV Edge</div>
          </div>
        </div>
      </div>

      {/* Expected Move */}
      <div className="p-4 bg-slate-800/30 rounded-lg mb-5">
        <div className="text-sm font-medium text-slate-300 mb-2">Expected Move (1 SD) in {safeData.daysToExpiry} days</div>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-lg font-semibold text-red-400">
              ₹{(safeData.spotPrice - calculations.expectedMove).toFixed(0)}
            </div>
            <div className="text-xs text-slate-500">-{calculations.expectedMovePercent.toFixed(1)}%</div>
          </div>
          <div className="flex-1 mx-4 h-2 bg-slate-700 rounded-full relative">
            <div 
              className="absolute top-0 left-1/2 w-0.5 h-2 bg-white transform -translate-x-1/2"
              title="Current Price"
            />
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-emerald-400">
              ₹{(safeData.spotPrice + calculations.expectedMove).toFixed(0)}
            </div>
            <div className="text-xs text-slate-500">+{calculations.expectedMovePercent.toFixed(1)}%</div>
          </div>
        </div>
        {calculations.breakEvenLow > 0 && (
          <div className="mt-2 text-xs text-center text-slate-400">
            Break-even: ₹{calculations.breakEvenLow.toFixed(0)} - ₹{calculations.breakEvenHigh.toFixed(0)}
          </div>
        )}
      </div>

      {/* Best When / Avoid */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
          <div className="text-xs text-emerald-400 mb-2">✓ Best When</div>
          <ul className="space-y-1">
            {config.bestWhen.map((item, i) => (
              <li key={i} className="text-xs text-slate-300">• {item}</li>
            ))}
          </ul>
        </div>
        <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
          <div className="text-xs text-red-400 mb-2">✗ Avoid When</div>
          <ul className="space-y-1">
            {config.avoid.map((item, i) => (
              <li key={i} className="text-xs text-slate-300">• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Warning for unlimited risk */}
      {config.riskLevel === 'unlimited' && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg mb-5">
          <div className="text-sm font-medium text-red-400 mb-1">⚠️ UNLIMITED RISK WARNING</div>
          <div className="text-xs text-slate-300">
            This strategy has unlimited loss potential. A single black swan event can wipe out months of gains. 
            Always use stop losses or hedge with further OTM options. Never risk more than you can afford to lose.
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            💡 {config.riskLevel === 'unlimited' 
              ? 'Professional traders always hedge unlimited risk strategies.' 
              : 'Defined risk strategies limit losses but also cap profits.'}
          </div>
          <button
            onClick={() => setActiveTab('builder')}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Try in Payoff Builder →
          </button>
        </div>
      </div>
      </div>
      )}
    </div>
  );
}
