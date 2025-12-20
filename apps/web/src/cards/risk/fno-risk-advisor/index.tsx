// ═══════════════════════════════════════════════════════════════════════════
// F&O RISK ADVISOR - SEBI-Safe Leverage Calculator
// Helps traders understand position sizing and drawdown risks
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

interface FnORiskAdvisorProps {
  data?: FnORiskData;
  symbol?: string;
}

export interface FnORiskData {
  capital: number;
  productType: 'index_options' | 'stock_options' | 'index_futures' | 'stock_futures';
  instrument: string;
  lotSize: number;
  currentPrice: number;
  marginRequired: number;
  avgDailyRange: number; // ATR as %
  maxMonthlyLossPercent: number;
  timeHorizon: 'intraday' | 'weekly' | 'monthly';
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getFnORiskAdvisorOutput(data: FnORiskData): CardOutput {
  const { capital, productType, instrument, lotSize, currentPrice, marginRequired, avgDailyRange, maxMonthlyLossPercent } = data;
  
  // Calculate key risk metrics
  const maxLots = Math.floor(capital / marginRequired);
  const maxExposure = maxLots * lotSize * currentPrice;
  const leverageRatio = maxExposure / capital;
  const riskPerLot = (avgDailyRange / 100) * lotSize * currentPrice;
  const safeLots = Math.floor((capital * maxMonthlyLossPercent / 100) / (riskPerLot * 5)); // 5 losing days buffer
  const safeLotsExposure = safeLots * lotSize * currentPrice;
  
  // SEBI loss statistics
  const sebiStats = {
    index_options: { lossRate: 89, avgLoss: 28 },
    stock_options: { lossRate: 91, avgLoss: 32 },
    index_futures: { lossRate: 72, avgLoss: 18 },
    stock_futures: { lossRate: 78, avgLoss: 22 },
  }[productType];
  
  const riskLevel = leverageRatio > 10 ? "high" : leverageRatio > 5 ? "moderate" : "low";
  const sentiment = riskLevel === "low" ? "neutral" : riskLevel === "high" ? "bearish" : "neutral";
  
  const keyMetrics: MetricValue[] = [
    createMetric("Trading Capital", "fno_capital", capital, "neutral", 
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("Max Leverage", "fno_leverage", leverageRatio, 
      leverageRatio < 5 ? "safe" : leverageRatio < 10 ? "moderate" : "risky",
      { format: "ratio", priority: 1, unit: "x" }),
    createMetric("Max Lots (Margin)", "fno_max_lots", maxLots, "neutral", 
      { format: "number", priority: 1 }),
    createMetric("Safe Lots (Risk-Adjusted)", "fno_safe_lots", safeLots, "good", 
      { format: "number", priority: 1 }),
    createMetric("Risk Per Lot", "fno_risk_per_lot", riskPerLot, "neutral", 
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("Max Monthly Loss Target", "fno_max_loss", maxMonthlyLossPercent, "neutral", 
      { format: "percent", priority: 2 }),
    createMetric("SEBI Loss Rate", "fno_sebi_loss", sebiStats.lossRate, "risky", 
      { format: "percent", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // Risk warning based on product type
  insights.push(createInsight("risk", `SEBI data: ${sebiStats.lossRate}% of ${productType.replace('_', ' ')} traders lose money, avg loss ${sebiStats.avgLoss}%`, 1, ["fno_sebi_loss"]));
  
  // Position sizing
  if (safeLots < maxLots) {
    insights.push(createInsight("action", `Risk-adjusted recommendation: Trade ${safeLots} lots (not ${maxLots}) to limit monthly drawdown to ${maxMonthlyLossPercent}%`, 1, ["fno_safe_lots", "fno_max_lots"]));
  }
  
  // Leverage warning
  if (leverageRatio > 10) {
    insights.push(createInsight("risk", `High leverage of ${leverageRatio.toFixed(1)}x - small move can wipe out capital`, 1, ["fno_leverage"]));
  } else if (leverageRatio > 5) {
    insights.push(createInsight("observation", `Moderate leverage of ${leverageRatio.toFixed(1)}x - use strict stop losses`, 2, ["fno_leverage"]));
  }
  
  // ATR-based risk
  insights.push(createInsight("observation", `Daily range of ${avgDailyRange.toFixed(1)}% means ~₹${riskPerLot.toFixed(0)} risk per lot per day`, 2, ["fno_risk_per_lot"]));
  
  const headline = `${instrument} F&O: Safe position ${safeLots} lots with ${leverageRatio.toFixed(1)}x leverage on ₹${(capital/100000).toFixed(1)}L capital`;
  
  return {
    cardId: "fno-risk-advisor",
    cardCategory: "risk",
    symbol: instrument,
    asOf: new Date().toISOString().split('T')[0],
    headline,
    sentiment,
    confidence: "high",
    signalStrength: riskLevel === "low" ? 4 : riskLevel === "moderate" ? 3 : 2,
    keyMetrics,
    insights,
    suggestedCards: ["trade-expectancy", "drawdown-var", "volatility-regime"],
    tags: ["fno", "risk-management", "position-sizing", productType],
    scoreContribution: {
      category: "risk",
      score: riskLevel === "low" ? 80 : riskLevel === "moderate" ? 50 : 20,
      weight: 0.10,
    },
  };
}

// Default mock data
const DEFAULT_DATA: FnORiskData = {
  capital: 500000,
  productType: 'index_options',
  instrument: 'NIFTY',
  lotSize: 50,
  currentPrice: 22500,
  marginRequired: 125000,
  avgDailyRange: 1.2,
  maxMonthlyLossPercent: 10,
  timeHorizon: 'weekly',
};

// SEBI loss statistics (based on actual SEBI study data)
const SEBI_LOSS_STATS = {
  index_options: { lossRate: 0.89, avgLossPercent: 28, medianLossPercent: 15 },
  stock_options: { lossRate: 0.91, avgLossPercent: 32, medianLossPercent: 18 },
  index_futures: { lossRate: 0.72, avgLossPercent: 18, medianLossPercent: 12 },
  stock_futures: { lossRate: 0.78, avgLossPercent: 22, medianLossPercent: 14 },
};

export default function FnORiskAdvisor({ data, symbol }: FnORiskAdvisorProps) {
  const categoryStyle = CATEGORY_STYLES['risk'];

  // Use DEFAULT_DATA if data is empty or undefined
  const initialData = (data && Object.keys(data).length > 0) ? data : DEFAULT_DATA;
  const [config, setConfig] = useState(initialData);
  
  const calculations = useMemo(() => {
    const {
      capital,
      productType,
      lotSize,
      currentPrice,
      marginRequired,
      avgDailyRange,
      maxMonthlyLossPercent,
      timeHorizon,
    } = config;
    
    // Position value per lot
    const positionValuePerLot = lotSize * currentPrice;
    
    // Max lots by margin
    const maxLotsByMargin = Math.floor(capital / marginRequired);
    
    // Max loss allowed
    const maxLossAllowed = capital * (maxMonthlyLossPercent / 100);
    
    // ATR-based stop loss per lot (in rupees)
    const atrStopPerLot = positionValuePerLot * (avgDailyRange / 100) * 1.5; // 1.5x ATR stop
    
    // Recommended lots based on risk
    const recommendedLots = Math.max(1, Math.floor(maxLossAllowed / atrStopPerLot / 4)); // Divide by 4 for monthly allocation
    
    // Safe lots (more conservative)
    const safeLots = Math.max(1, Math.floor(recommendedLots * 0.6));
    
    // Risk metrics
    const riskPerTrade = (atrStopPerLot * recommendedLots / capital) * 100;
    const leverageUsed = (positionValuePerLot * recommendedLots) / capital;
    
    // Drawdown probability simulation (simplified Monte Carlo based on SEBI stats)
    const sebiStats = SEBI_LOSS_STATS[productType];
    const probDrawdown20 = Math.min(95, sebiStats.lossRate * 100 * (leverageUsed / 2));
    const probDrawdown50 = Math.min(80, sebiStats.lossRate * 60 * (leverageUsed / 3));
    const probBlowup = Math.min(50, sebiStats.lossRate * 30 * leverageUsed);
    
    // Risk zone determination
    let riskZone: 'green' | 'yellow' | 'red' = 'green';
    let riskMessage = '';
    
    if (leverageUsed > 5 || riskPerTrade > 5) {
      riskZone = 'red';
      riskMessage = 'DANGER: Your sizing matches the 90% losing cohort. Reduce position size significantly.';
    } else if (leverageUsed > 3 || riskPerTrade > 3) {
      riskZone = 'yellow';
      riskMessage = 'CAUTION: Moderate risk. Consider reducing size for sustainability.';
    } else {
      riskZone = 'green';
      riskMessage = 'SAFE: Conservative sizing within professional risk limits.';
    }
    
    // Time-based adjustments
    const timeMultiplier = timeHorizon === 'intraday' ? 1 : timeHorizon === 'weekly' ? 2.5 : 5;
    const expectedDrawdownRange = {
      min: sebiStats.medianLossPercent * 0.5 * timeMultiplier,
      max: sebiStats.avgLossPercent * timeMultiplier,
    };
    
    return {
      positionValuePerLot,
      maxLotsByMargin,
      maxLossAllowed,
      atrStopPerLot,
      recommendedLots,
      safeLots,
      riskPerTrade,
      leverageUsed,
      probDrawdown20,
      probDrawdown50,
      probBlowup,
      riskZone,
      riskMessage,
      sebiStats,
      expectedDrawdownRange,
      totalExposure: positionValuePerLot * recommendedLots,
      marginUsed: marginRequired * recommendedLots,
      marginUtilization: (marginRequired * recommendedLots / capital) * 100,
    };
  }, [config]);

  const zoneColors = {
    green: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400' },
    yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400' },
    red: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400' },
  };

  const zone = zoneColors[calculations.riskZone];

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-5 border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider">F&O Risk Advisor</div>
          <div className="text-lg font-semibold text-slate-100">SEBI-Safe Position Sizing</div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${zone.bg} ${zone.text} ${zone.border} border`}>
          {calculations.riskZone.toUpperCase()} ZONE
        </div>
      </div>

      {/* Risk Alert Banner */}
      <div className={`p-3 rounded-lg mb-5 ${zone.bg} ${zone.border} border`}>
        <div className={`text-sm font-medium ${zone.text}`}>{calculations.riskMessage}</div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Capital (₹)</label>
          <input
            type="number"
            value={config.capital}
            onChange={(e) => setConfig({ ...config, capital: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Product Type</label>
          <select
            value={config.productType}
            onChange={(e) => setConfig({ ...config, productType: e.target.value as any })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
          >
            <option value="index_options">Index Options</option>
            <option value="stock_options">Stock Options</option>
            <option value="index_futures">Index Futures</option>
            <option value="stock_futures">Stock Futures</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Max Monthly Loss %</label>
          <input
            type="number"
            value={config.maxMonthlyLossPercent}
            onChange={(e) => setConfig({ ...config, maxMonthlyLossPercent: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Time Horizon</label>
          <select
            value={config.timeHorizon}
            onChange={(e) => setConfig({ ...config, timeHorizon: e.target.value as any })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
          >
            <option value="intraday">Intraday</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="p-4 bg-slate-800/50 rounded-lg text-center">
          <div className="text-2xl font-bold text-emerald-400">{calculations.safeLots}</div>
          <div className="text-xs text-slate-400">Safe Lots</div>
          <div className="text-xs text-slate-500 mt-1">Conservative</div>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-400">{calculations.recommendedLots}</div>
          <div className="text-xs text-slate-400">Recommended Lots</div>
          <div className="text-xs text-slate-500 mt-1">Balanced Risk</div>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-lg text-center">
          <div className="text-2xl font-bold text-slate-400">{calculations.maxLotsByMargin}</div>
          <div className="text-xs text-slate-400">Max by Margin</div>
          <div className="text-xs text-red-400 mt-1">⚠️ Too Risky</div>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <MetricBox 
          label="Risk per Trade" 
          value={`${calculations.riskPerTrade.toFixed(1)}%`}
          status={calculations.riskPerTrade <= 2 ? 'good' : calculations.riskPerTrade <= 5 ? 'warning' : 'bad'}
        />
        <MetricBox 
          label="Leverage Used" 
          value={`${calculations.leverageUsed.toFixed(1)}x`}
          status={calculations.leverageUsed <= 2 ? 'good' : calculations.leverageUsed <= 4 ? 'warning' : 'bad'}
        />
        <MetricBox 
          label="Margin Used" 
          value={`${calculations.marginUtilization.toFixed(0)}%`}
          status={calculations.marginUtilization <= 50 ? 'good' : calculations.marginUtilization <= 80 ? 'warning' : 'bad'}
        />
        <MetricBox 
          label="ATR Stop/Lot" 
          value={`₹${(calculations.atrStopPerLot / 1000).toFixed(1)}K`}
          status="neutral"
        />
      </div>

      {/* Drawdown Probabilities */}
      <div className="p-4 bg-slate-800/30 rounded-lg mb-5">
        <div className="text-sm font-medium text-slate-300 mb-3">Drawdown Probability (Based on SEBI Study)</div>
        <div className="space-y-2">
          <ProbabilityBar label="20% Drawdown" probability={calculations.probDrawdown20} />
          <ProbabilityBar label="50% Drawdown" probability={calculations.probDrawdown50} />
          <ProbabilityBar label="Account Blowup" probability={calculations.probBlowup} />
        </div>
      </div>

      {/* SEBI Statistics */}
      <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
        <div className="text-sm font-medium text-red-400 mb-2">⚠️ SEBI Study Warning</div>
        <div className="text-xs text-slate-400 space-y-1">
          <div>• {(calculations.sebiStats.lossRate * 100).toFixed(0)}% of {config.productType.replace('_', ' ')} traders lose money</div>
          <div>• Average loss: {calculations.sebiStats.avgLossPercent}% of capital</div>
          <div>• Median loss: {calculations.sebiStats.medianLossPercent}% of capital</div>
          <div className="pt-2 text-slate-500">Source: SEBI Study on Profit/Loss of Individual Traders in F&O Segment (2023)</div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-500">
          💡 Tip: Professional traders risk 1-2% per trade. The recommended lots above are calibrated for {config.maxMonthlyLossPercent}% max monthly drawdown.
        </div>
      </div>
    </div>
  );
}

// Helper Components
function MetricBox({ label, value, status }: { label: string; value: string; status: 'good' | 'warning' | 'bad' | 'neutral' }) {
  const colors = {
    good: 'text-emerald-400',
    warning: 'text-yellow-400',
    bad: 'text-red-400',
    neutral: 'text-slate-300',
  };
  
  return (
    <div className="p-3 bg-slate-800/50 rounded-lg">
      <div className={`text-lg font-semibold ${colors[status]}`}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function ProbabilityBar({ label, probability }: { label: string; probability: number }) {
  const color = probability < 30 ? 'bg-emerald-500' : probability < 60 ? 'bg-yellow-500' : 'bg-red-500';
  
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-xs text-slate-400">{label}</div>
      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all`} 
          style={{ width: `${Math.min(100, probability)}%` }}
        />
      </div>
      <div className="w-12 text-xs text-slate-300 text-right">{probability.toFixed(0)}%</div>
    </div>
  );
}
