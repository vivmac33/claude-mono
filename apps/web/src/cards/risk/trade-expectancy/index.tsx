// ═══════════════════════════════════════════════════════════════════════════
// TRADE EXPECTANCY SIMULATOR
// Calculates realistic expectancy including Indian fee structure
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

interface TradeExpectancyProps {
  data?: ExpectancyInputs;
  symbol?: string;
}

export interface ExpectancyInputs {
  winRate: number; // percentage
  avgWinPercent: number;
  avgLossPercent: number;
  tradesPerMonth: number;
  capitalPerTrade: number;
  productType: 'equity_intraday' | 'equity_delivery' | 'futures' | 'options_buy' | 'options_sell';
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getTradeExpectancyOutput(data: ExpectancyInputs): CardOutput {
  const { winRate, avgWinPercent, avgLossPercent, tradesPerMonth, capitalPerTrade, productType } = data;
  
  // Calculate expectancy
  const grossExpectancyPerTrade = (winRate / 100) * avgWinPercent - ((100 - winRate) / 100) * avgLossPercent;
  
  // Estimate fees based on product type (simplified)
  const feeEstimates: Record<string, number> = {
    equity_intraday: 0.08,
    equity_delivery: 0.15,
    futures: 0.05,
    options_buy: 0.3,
    options_sell: 0.25,
  };
  const avgFeePercent = feeEstimates[productType] || 0.1;
  const netExpectancyPerTrade = grossExpectancyPerTrade - avgFeePercent;
  
  const monthlyExpectancy = netExpectancyPerTrade * tradesPerMonth;
  const monthlyPnL = (monthlyExpectancy / 100) * capitalPerTrade * tradesPerMonth;
  const annualizedReturn = monthlyExpectancy * 12;
  const payoffRatio = avgWinPercent / avgLossPercent;
  const breakEvenWinRate = 100 / (1 + payoffRatio);
  
  const isProfitable = netExpectancyPerTrade > 0;
  const sentiment = isProfitable && annualizedReturn > 20 ? "bullish" : !isProfitable ? "bearish" : "neutral";
  const signalStrength = annualizedReturn > 50 ? 5 : annualizedReturn > 25 ? 4 : annualizedReturn > 0 ? 3 : annualizedReturn > -25 ? 2 : 1;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Net Expectancy/Trade", "te_expectancy", netExpectancyPerTrade, 
      netExpectancyPerTrade > 0.5 ? "excellent" : netExpectancyPerTrade > 0 ? "good" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Win Rate", "te_win_rate", winRate, 
      winRate > breakEvenWinRate ? "good" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Payoff Ratio", "te_payoff_ratio", payoffRatio, 
      payoffRatio > 2 ? "excellent" : payoffRatio > 1.5 ? "good" : payoffRatio > 1 ? "fair" : "poor",
      { format: "ratio", priority: 1, unit: "x" }),
    createMetric("Break-Even Win Rate", "te_breakeven", breakEvenWinRate, "neutral", 
      { format: "percent", priority: 2 }),
    createMetric("Monthly Return", "te_monthly", monthlyExpectancy, 
      monthlyExpectancy > 5 ? "excellent" : monthlyExpectancy > 0 ? "good" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Annualized Return", "te_annual", annualizedReturn, 
      annualizedReturn > 50 ? "excellent" : annualizedReturn > 20 ? "good" : annualizedReturn > 0 ? "fair" : "poor",
      { format: "percent", priority: 1 }),
    createMetric("Est. Monthly P&L", "te_monthly_pnl", monthlyPnL, 
      monthlyPnL > 0 ? "good" : "poor",
      { format: "currency", priority: 2, unit: "₹" }),
  ];
  
  const insights: Insight[] = [];
  
  // Profitability assessment
  if (isProfitable) {
    insights.push(createInsight("strength", `Positive expectancy system: ${netExpectancyPerTrade.toFixed(2)}% per trade after fees`, 1, ["te_expectancy"]));
  } else {
    insights.push(createInsight("weakness", `Negative expectancy: losing ${Math.abs(netExpectancyPerTrade).toFixed(2)}% per trade - system needs improvement`, 1, ["te_expectancy"]));
  }
  
  // Win rate vs break-even
  if (winRate < breakEvenWinRate) {
    insights.push(createInsight("risk", `Win rate ${winRate}% below break-even ${breakEvenWinRate.toFixed(0)}% - increase winners or improve payoff ratio`, 1, ["te_win_rate", "te_breakeven"]));
  } else {
    insights.push(createInsight("strength", `Win rate ${winRate}% above break-even ${breakEvenWinRate.toFixed(0)}% - edge confirmed`, 2, ["te_win_rate"]));
  }
  
  // Payoff ratio
  if (payoffRatio < 1) {
    insights.push(createInsight("weakness", `Payoff ratio below 1 (${payoffRatio.toFixed(2)}x) - losses larger than wins`, 2, ["te_payoff_ratio"]));
  } else if (payoffRatio > 2) {
    insights.push(createInsight("strength", `Excellent payoff ratio of ${payoffRatio.toFixed(2)}x - letting winners run`, 2, ["te_payoff_ratio"]));
  }
  
  // Fee impact
  insights.push(createInsight("observation", `Fees eat ${avgFeePercent.toFixed(2)}% per trade in ${productType.replace('_', ' ')}`, 3));
  
  const headline = `Trading system ${isProfitable ? "profitable" : "unprofitable"} with ${netExpectancyPerTrade.toFixed(2)}% expectancy and ${annualizedReturn.toFixed(0)}% projected annual return`;
  
  return {
    cardId: "trade-expectancy",
    cardCategory: "risk",
    symbol: "PORTFOLIO",
    asOf: new Date().toISOString().split('T')[0],
    headline,
    sentiment,
    confidence: tradesPerMonth >= 20 ? "high" : "medium", // More trades = more reliable stats
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["fno-risk-advisor", "trade-journal", "drawdown-var"],
    tags: ["expectancy", "trading-system", productType, isProfitable ? "profitable" : "unprofitable"],
    scoreContribution: {
      category: "risk",
      score: Math.min(100, Math.max(0, 50 + annualizedReturn)),
      weight: 0.10,
    },
  };
}

const DEFAULT_INPUTS: ExpectancyInputs = {
  winRate: 45,
  avgWinPercent: 2.5,
  avgLossPercent: 1.5,
  tradesPerMonth: 40,
  capitalPerTrade: 100000,
  productType: 'options_buy',
};

// Indian fee structure (as of 2024)
const FEE_STRUCTURE = {
  equity_intraday: {
    stt: 0.025, // 0.025% on sell side
    exchangeTxn: 0.00345,
    sebi: 0.0001,
    gst: 18, // % on brokerage
    stampDuty: 0.003, // on buy side
    brokerage: 0.03, // typical discount broker
  },
  equity_delivery: {
    stt: 0.1, // 0.1% on both sides
    exchangeTxn: 0.00345,
    sebi: 0.0001,
    gst: 18,
    stampDuty: 0.015,
    brokerage: 0,
  },
  futures: {
    stt: 0.0125, // on sell side
    exchangeTxn: 0.002,
    sebi: 0.0001,
    gst: 18,
    stampDuty: 0.002,
    brokerage: 0.03,
  },
  options_buy: {
    stt: 0.0625, // on premium (sell side)
    exchangeTxn: 0.053,
    sebi: 0.0001,
    gst: 18,
    stampDuty: 0.003,
    brokerage: 20, // flat per lot
  },
  options_sell: {
    stt: 0.125, // on premium (intrinsic on exercise)
    exchangeTxn: 0.053,
    sebi: 0.0001,
    gst: 18,
    stampDuty: 0.003,
    brokerage: 20,
  },
};

export default function TradeExpectancySimulator({ data }: TradeExpectancyProps) {
  const categoryStyle = CATEGORY_STYLES['risk'];

  // Use DEFAULT_INPUTS if data is empty or undefined
  const initialInputs = (data && Object.keys(data).length > 0) ? data : DEFAULT_INPUTS;
  const [inputs, setInputs] = useState(initialInputs);
  
  const calculations = useMemo(() => {
    const { winRate, avgWinPercent, avgLossPercent, tradesPerMonth, capitalPerTrade, productType } = inputs;
    const fees = FEE_STRUCTURE[productType];
    
    // Calculate per-trade fees (as % of capital)
    let totalFeesPercent: number;
    if (productType === 'options_buy' || productType === 'options_sell') {
      // Options: flat brokerage + percentage fees
      const flatFeePercent = (fees.brokerage * 2) / capitalPerTrade * 100; // buy + sell
      const percentFees = fees.stt + fees.exchangeTxn + fees.sebi + fees.stampDuty;
      const brokerageForGST = (fees.brokerage * 2) / capitalPerTrade * 100;
      const gstAmount = brokerageForGST * (fees.gst / 100);
      totalFeesPercent = flatFeePercent + percentFees + gstAmount;
    } else {
      // Equity/Futures: all percentage based
      const percentFees = fees.stt + fees.exchangeTxn + fees.sebi + fees.stampDuty + fees.brokerage;
      const gstOnBrokerage = fees.brokerage * (fees.gst / 100);
      totalFeesPercent = (percentFees + gstOnBrokerage) * 2; // round trip
    }
    
    // Gross expectancy (before fees)
    const winProb = winRate / 100;
    const lossProb = 1 - winProb;
    const grossExpectancy = (winProb * avgWinPercent) - (lossProb * avgLossPercent);
    
    // Net expectancy (after fees)
    const netExpectancyPerTrade = grossExpectancy - totalFeesPercent;
    
    // Monthly projections
    const grossMonthlyReturn = grossExpectancy * tradesPerMonth;
    const totalMonthlyFees = totalFeesPercent * tradesPerMonth;
    const netMonthlyReturn = netExpectancyPerTrade * tradesPerMonth;
    
    // Rupee values
    const grossMonthlyRupees = capitalPerTrade * (grossMonthlyReturn / 100);
    const feesMonthlyRupees = capitalPerTrade * (totalMonthlyFees / 100);
    const netMonthlyRupees = capitalPerTrade * (netMonthlyReturn / 100);
    
    // Break-even calculations
    const breakEvenWinRate = (avgLossPercent + totalFeesPercent) / (avgWinPercent + avgLossPercent) * 100;
    const currentEdge = winRate - breakEvenWinRate;
    
    // Risk of ruin simulation (simplified)
    const kellyFraction = ((winProb * avgWinPercent) - (lossProb * avgLossPercent)) / avgWinPercent;
    const adjustedKelly = Math.max(0, kellyFraction * 0.25); // Quarter Kelly for safety
    
    // Monte Carlo simulation for drawdown probability
    const simulations = 1000;
    const tradesPerSim = 100;
    let drawdown20Count = 0;
    let drawdown50Count = 0;
    let blowupCount = 0;
    
    for (let sim = 0; sim < simulations; sim++) {
      let equity = 100;
      let peak = 100;
      let maxDrawdown = 0;
      
      for (let trade = 0; trade < tradesPerSim; trade++) {
        const isWin = Math.random() < winProb;
        const returnPercent = isWin ? avgWinPercent : -avgLossPercent;
        const netReturn = returnPercent - totalFeesPercent;
        equity *= (1 + netReturn / 100);
        
        if (equity > peak) peak = equity;
        const drawdown = (peak - equity) / peak * 100;
        if (drawdown > maxDrawdown) maxDrawdown = drawdown;
        
        if (equity <= 0) break;
      }
      
      if (maxDrawdown >= 20) drawdown20Count++;
      if (maxDrawdown >= 50) drawdown50Count++;
      if (equity <= 10) blowupCount++;
    }
    
    const probDrawdown20 = (drawdown20Count / simulations) * 100;
    const probDrawdown50 = (drawdown50Count / simulations) * 100;
    const probBlowup = (blowupCount / simulations) * 100;
    
    // Annual projection
    const annualReturn = netMonthlyReturn * 12;
    const annualRupees = netMonthlyRupees * 12;
    
    // Status determination
    let status: 'profitable' | 'marginal' | 'losing' = 'losing';
    if (netExpectancyPerTrade > 0.5) status = 'profitable';
    else if (netExpectancyPerTrade > 0) status = 'marginal';
    
    return {
      // Per trade
      grossExpectancy,
      totalFeesPercent,
      netExpectancyPerTrade,
      
      // Monthly
      grossMonthlyReturn,
      totalMonthlyFees,
      netMonthlyReturn,
      grossMonthlyRupees,
      feesMonthlyRupees,
      netMonthlyRupees,
      
      // Break-even
      breakEvenWinRate,
      currentEdge,
      
      // Kelly
      kellyFraction: kellyFraction * 100,
      adjustedKelly: adjustedKelly * 100,
      
      // Risk
      probDrawdown20,
      probDrawdown50,
      probBlowup,
      
      // Annual
      annualReturn,
      annualRupees,
      
      status,
    };
  }, [inputs]);

  const statusColors = {
    profitable: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400' },
    marginal: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400' },
    losing: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400' },
  };
  
  const colors = statusColors[calculations.status];
  
  // R-Multiple calculation
  const rMultiple = inputs.avgWinPercent / inputs.avgLossPercent;
  const payoffRatio = rMultiple;

  // R-Multiple Ladder Signature Component
  const RMultipleLadder = () => {
    const rungs = [
      { r: 3.0, label: 'Elite', color: '#10b981', desc: 'Pro trader territory' },
      { r: 2.5, label: 'Excellent', color: '#22d3ee', desc: 'Strong edge' },
      { r: 2.0, label: 'Good', color: '#3b82f6', desc: 'Solid system' },
      { r: 1.5, label: 'Adequate', color: '#f59e0b', desc: 'Workable edge' },
      { r: 1.0, label: 'Break-even', color: '#ef4444', desc: 'Needs improvement' },
      { r: 0.5, label: 'Poor', color: '#7f1d1d', desc: 'Losing system' },
    ];
    
    const currentRung = rungs.findIndex(r => rMultiple >= r.r);
    const clampedR = Math.max(0.5, Math.min(3, rMultiple));
    const position = ((3 - clampedR) / 2.5) * 100;
    
    return (
      <div className="relative bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase text-slate-500">R-Multiple Ladder</span>
            <div className="text-xs text-slate-400 mt-0.5">Reward-to-Risk Ratio</div>
          </div>
          <div 
            className="px-3 py-1 rounded-lg text-lg font-bold"
            style={{ 
              backgroundColor: `${rungs[Math.max(0, currentRung)]?.color || '#ef4444'}20`,
              color: rungs[Math.max(0, currentRung)]?.color || '#ef4444',
            }}
          >
            {rMultiple.toFixed(2)}R
          </div>
        </div>
        
        {/* Ladder visualization */}
        <div className="relative h-40 flex">
          {/* Ladder rails */}
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-slate-700 rounded" />
          <div className="absolute right-4 top-0 bottom-0 w-1 bg-slate-700 rounded" />
          
          {/* Rungs */}
          <div className="flex-1 flex flex-col justify-between py-2 relative">
            {rungs.map((rung, i) => (
              <div key={i} className="flex items-center relative">
                {/* Rung bar */}
                <div 
                  className="h-1 flex-1 mx-6 rounded"
                  style={{ 
                    backgroundColor: rung.color,
                    opacity: rMultiple >= rung.r ? 1 : 0.3,
                  }}
                />
                {/* Label */}
                <div className="absolute left-8 flex items-center gap-2">
                  <span 
                    className="text-[10px] font-bold w-8"
                    style={{ color: rung.color }}
                  >
                    {rung.r}R
                  </span>
                  <span className={`text-[10px] ${rMultiple >= rung.r ? 'text-slate-300' : 'text-slate-600'}`}>
                    {rung.label}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Current position indicator */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-500"
              style={{ top: `${position}%` }}
            >
              <div 
                className="relative flex items-center justify-center"
                style={{ filter: `drop-shadow(0 0 8px ${rungs[Math.max(0, currentRung)]?.color || '#ef4444'})` }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ 
                    backgroundColor: rungs[Math.max(0, currentRung)]?.color || '#ef4444',
                  }}
                >
                  YOU
                </div>
                <div 
                  className="absolute -right-20 whitespace-nowrap px-2 py-0.5 rounded text-[9px]"
                  style={{ 
                    backgroundColor: `${rungs[Math.max(0, currentRung)]?.color || '#ef4444'}30`,
                    color: rungs[Math.max(0, currentRung)]?.color || '#ef4444',
                  }}
                >
                  {rungs[Math.max(0, currentRung)]?.desc || 'Losing system'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center">
            <div className="text-[9px] text-slate-500">Avg Win</div>
            <div className="text-sm font-bold text-emerald-400">+{inputs.avgWinPercent}%</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-slate-500">Avg Loss</div>
            <div className="text-sm font-bold text-red-400">-{inputs.avgLossPercent}%</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-slate-500">Win Rate</div>
            <div className="text-sm font-bold text-slate-200">{inputs.winRate}%</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="bg-slate-900 rounded-xl border border-slate-700 border-l-4 p-5" 
      style={{ borderLeftColor: calculations.status === 'profitable' ? '#10b981' : calculations.status === 'marginal' ? '#eab308' : '#ef4444' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-lg">{categoryStyle.icon}</span>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Trade Expectancy</div>
            <div className="text-lg font-semibold text-slate-100">Realistic P&L Simulator</div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border`}>
          {calculations.status === 'profitable' ? '✓ POSITIVE EDGE' : 
           calculations.status === 'marginal' ? '⚠ MARGINAL' : '✗ NEGATIVE EDGE'}
        </div>
      </div>
      
      {/* Signature R-Multiple Ladder */}
      <RMultipleLadder />

      {/* Input Controls */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-5">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Win Rate (%)</label>
          <input
            type="number"
            value={inputs.winRate}
            onChange={(e) => setInputs({ ...inputs, winRate: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Avg Win (%)</label>
          <input
            type="number"
            step="0.1"
            value={inputs.avgWinPercent}
            onChange={(e) => setInputs({ ...inputs, avgWinPercent: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Avg Loss (%)</label>
          <input
            type="number"
            step="0.1"
            value={inputs.avgLossPercent}
            onChange={(e) => setInputs({ ...inputs, avgLossPercent: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Trades/Month</label>
          <input
            type="number"
            value={inputs.tradesPerMonth}
            onChange={(e) => setInputs({ ...inputs, tradesPerMonth: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Capital/Trade (₹)</label>
          <input
            type="number"
            value={inputs.capitalPerTrade}
            onChange={(e) => setInputs({ ...inputs, capitalPerTrade: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Product Type</label>
          <select
            value={inputs.productType}
            onChange={(e) => setInputs({ ...inputs, productType: e.target.value as any })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
          >
            <option value="options_buy">Options Buying</option>
            <option value="options_sell">Options Selling</option>
            <option value="futures">Futures</option>
            <option value="equity_intraday">Equity Intraday</option>
            <option value="equity_delivery">Equity Delivery</option>
          </select>
        </div>
      </div>

      {/* Expectancy Breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="p-4 bg-slate-800/50 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-400">
            {calculations.grossExpectancy >= 0 ? '+' : ''}{calculations.grossExpectancy.toFixed(2)}%
          </div>
          <div className="text-xs text-slate-400">Gross Expectancy</div>
          <div className="text-xs text-slate-500">per trade</div>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-400">
            -{calculations.totalFeesPercent.toFixed(3)}%
          </div>
          <div className="text-xs text-slate-400">Total Fees</div>
          <div className="text-xs text-slate-500">STT+GST+Charges</div>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-lg text-center">
          <div className={`text-2xl font-bold ${calculations.netExpectancyPerTrade >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {calculations.netExpectancyPerTrade >= 0 ? '+' : ''}{calculations.netExpectancyPerTrade.toFixed(2)}%
          </div>
          <div className="text-xs text-slate-400">Net Expectancy</div>
          <div className="text-xs text-slate-500">after all costs</div>
        </div>
      </div>

      {/* Monthly Projection */}
      <div className="p-4 bg-slate-800/30 rounded-lg mb-5">
        <div className="text-sm font-medium text-slate-300 mb-3">Monthly Projection ({inputs.tradesPerMonth} trades)</div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-blue-400">
              ₹{Math.abs(calculations.grossMonthlyRupees).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-slate-500">Gross P&L</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-400">
              ₹{calculations.feesMonthlyRupees.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-slate-500">Total Fees</div>
          </div>
          <div>
            <div className={`text-lg font-semibold ${calculations.netMonthlyRupees >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {calculations.netMonthlyRupees >= 0 ? '+' : ''}₹{Math.abs(calculations.netMonthlyRupees).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-slate-500">Net P&L</div>
          </div>
        </div>
      </div>

      {/* Break-even Analysis */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="p-4 bg-slate-800/30 rounded-lg">
          <div className="text-sm font-medium text-slate-300 mb-2">Break-even Win Rate</div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-yellow-400">{calculations.breakEvenWinRate.toFixed(1)}%</span>
            <span className="text-sm text-slate-500 pb-1">required to break even</span>
          </div>
          <div className="mt-2 text-xs">
            <span className={calculations.currentEdge > 0 ? 'text-emerald-400' : 'text-red-400'}>
              Your edge: {calculations.currentEdge >= 0 ? '+' : ''}{calculations.currentEdge.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="p-4 bg-slate-800/30 rounded-lg">
          <div className="text-sm font-medium text-slate-300 mb-2">Kelly Criterion</div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-purple-400">{Math.max(0, calculations.adjustedKelly).toFixed(1)}%</span>
            <span className="text-sm text-slate-500 pb-1">of capital per trade</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Full Kelly: {calculations.kellyFraction.toFixed(1)}% (too aggressive)
          </div>
        </div>
      </div>

      {/* Risk Simulation */}
      <div className="p-4 bg-slate-800/30 rounded-lg mb-5">
        <div className="text-sm font-medium text-slate-300 mb-3">Drawdown Probability (100 trades simulation)</div>
        <div className="space-y-2">
          <ProbBar label="20% Drawdown" prob={calculations.probDrawdown20} />
          <ProbBar label="50% Drawdown" prob={calculations.probDrawdown50} />
          <ProbBar label="90% Loss (Blowup)" prob={calculations.probBlowup} />
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="p-4 bg-slate-800/30 rounded-lg">
        <div className="text-sm font-medium text-slate-300 mb-2">Indian Fee Structure ({inputs.productType.replace('_', ' ')})</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">STT:</span>
            <span className="text-slate-400">{(FEE_STRUCTURE[inputs.productType].stt * 100).toFixed(4)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Exchange Txn:</span>
            <span className="text-slate-400">{(FEE_STRUCTURE[inputs.productType].exchangeTxn * 100).toFixed(4)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">SEBI Fees:</span>
            <span className="text-slate-400">{(FEE_STRUCTURE[inputs.productType].sebi * 100).toFixed(4)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Stamp Duty:</span>
            <span className="text-slate-400">{(FEE_STRUCTURE[inputs.productType].stampDuty * 100).toFixed(4)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">GST:</span>
            <span className="text-slate-400">{FEE_STRUCTURE[inputs.productType].gst}% on brokerage</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Brokerage:</span>
            <span className="text-slate-400">
              {typeof FEE_STRUCTURE[inputs.productType].brokerage === 'number' && FEE_STRUCTURE[inputs.productType].brokerage < 1
                ? `${(FEE_STRUCTURE[inputs.productType].brokerage * 100).toFixed(2)}%`
                : `₹${FEE_STRUCTURE[inputs.productType].brokerage}/lot`}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-500">
          💡 Even a 50% win rate needs a 2:1 reward-risk ratio to be profitable after Indian fees. Most traders underestimate the fee drag.
        </div>
      </div>
    </div>
  );
}

function ProbBar({ label, prob }: { label: string; prob: number }) {
  const color = prob < 20 ? 'bg-emerald-500' : prob < 50 ? 'bg-yellow-500' : 'bg-red-500';
  
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 text-xs text-slate-400">{label}</div>
      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${Math.min(100, prob)}%` }} />
      </div>
      <div className="w-12 text-xs text-slate-300 text-right">{prob.toFixed(0)}%</div>
    </div>
  );
}
