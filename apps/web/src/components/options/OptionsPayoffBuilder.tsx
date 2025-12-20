// ═══════════════════════════════════════════════════════════════════════════
// OPTIONS PAYOFF BUILDER
// Interactive strategy builder with payoff visualization
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo, useCallback } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface OptionLeg {
  id: string;
  strike: number;
  type: 'CE' | 'PE';
  action: 'BUY' | 'SELL';
  lots: number;
  premium: number;
  iv: number;
}

export interface UnderlyingData {
  symbol: string;
  spotPrice: number;
  futuresPrice: number;
  lotSize: number;
  iv: number;
  ivPercentile: number;
  daysToExpiry: number;
  expiries: string[];
}

export type StrategyCategory = 'bullish' | 'bearish' | 'neutral';

export interface StrategyTemplate {
  id: string;
  name: string;
  category: StrategyCategory;
  description: string;
  legs: Array<{
    strikeOffset: number; // relative to ATM (0 = ATM, -1 = 1 strike below, +1 = 1 strike above)
    type: 'CE' | 'PE';
    action: 'BUY' | 'SELL';
    lots: number;
  }>;
  maxProfit: string;
  maxLoss: string;
  breakeven: string;
  idealConditions: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'unlimited';
}

export interface PayoffPoint {
  price: number;
  pnl: number;
  pnlAtExpiry: number;
}

export interface StrategyMetrics {
  netCredit: number;
  netDebit: number;
  maxProfit: number;
  maxLoss: number;
  breakevens: number[];
  probabilityOfProfit: number;
  riskRewardRatio: number;
  requiredMargin: number;
  totalDelta: number;
  totalGamma: number;
  totalTheta: number;
  totalVega: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// STRATEGY TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════

const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // BULLISH STRATEGIES
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'long_call',
    name: 'Long Call',
    category: 'bullish',
    description: 'Buy a call option expecting price to rise significantly',
    legs: [{ strikeOffset: 0, type: 'CE', action: 'BUY', lots: 1 }],
    maxProfit: 'Unlimited',
    maxLoss: 'Premium Paid',
    breakeven: 'Strike + Premium',
    idealConditions: ['Strong bullish view', 'Low IV environment', 'Expecting big move'],
    riskLevel: 'medium',
  },
  {
    id: 'bull_call_spread',
    name: 'Bull Call Spread',
    category: 'bullish',
    description: 'Buy lower strike call, sell higher strike call',
    legs: [
      { strikeOffset: 0, type: 'CE', action: 'BUY', lots: 1 },
      { strikeOffset: 2, type: 'CE', action: 'SELL', lots: 1 },
    ],
    maxProfit: 'Strike Width - Net Debit',
    maxLoss: 'Net Debit Paid',
    breakeven: 'Lower Strike + Net Debit',
    idealConditions: ['Moderately bullish', 'High IV (reduces cost)', 'Defined risk desired'],
    riskLevel: 'low',
  },
  {
    id: 'bull_put_spread',
    name: 'Bull Put Spread',
    category: 'bullish',
    description: 'Sell higher strike put, buy lower strike put',
    legs: [
      { strikeOffset: 0, type: 'PE', action: 'SELL', lots: 1 },
      { strikeOffset: -2, type: 'PE', action: 'BUY', lots: 1 },
    ],
    maxProfit: 'Net Credit Received',
    maxLoss: 'Strike Width - Net Credit',
    breakeven: 'Higher Strike - Net Credit',
    idealConditions: ['Bullish to neutral', 'High IV (higher credit)', 'Want to collect premium'],
    riskLevel: 'low',
  },
  {
    id: 'call_ratio_backspread',
    name: 'Call Ratio Backspread',
    category: 'bullish',
    description: 'Sell 1 lower call, buy 2 higher calls',
    legs: [
      { strikeOffset: 0, type: 'CE', action: 'SELL', lots: 1 },
      { strikeOffset: 2, type: 'CE', action: 'BUY', lots: 2 },
    ],
    maxProfit: 'Unlimited',
    maxLoss: 'Limited (at higher strike)',
    breakeven: 'Complex - multiple points',
    idealConditions: ['Very bullish', 'Expecting big move up', 'Low IV entry'],
    riskLevel: 'medium',
  },
  {
    id: 'synthetic_long',
    name: 'Synthetic Long',
    category: 'bullish',
    description: 'Buy call + Sell put at same strike (mimics stock)',
    legs: [
      { strikeOffset: 0, type: 'CE', action: 'BUY', lots: 1 },
      { strikeOffset: 0, type: 'PE', action: 'SELL', lots: 1 },
    ],
    maxProfit: 'Unlimited',
    maxLoss: 'Strike Price (if goes to 0)',
    breakeven: 'Strike ± Net Premium',
    idealConditions: ['Strong bullish view', 'Want leverage', 'Lower margin than futures'],
    riskLevel: 'high',
  },
  {
    id: 'covered_call',
    name: 'Covered Call',
    category: 'bullish',
    description: 'Own stock/futures + Sell OTM call',
    legs: [
      { strikeOffset: 2, type: 'CE', action: 'SELL', lots: 1 },
    ],
    maxProfit: 'Strike - Entry + Premium',
    maxLoss: 'Entry - Premium (if stock to 0)',
    breakeven: 'Entry Price - Premium',
    idealConditions: ['Own underlying', 'Neutral to slightly bullish', 'Want income'],
    riskLevel: 'low',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // BEARISH STRATEGIES
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'long_put',
    name: 'Long Put',
    category: 'bearish',
    description: 'Buy a put option expecting price to fall significantly',
    legs: [{ strikeOffset: 0, type: 'PE', action: 'BUY', lots: 1 }],
    maxProfit: 'Strike - Premium (if to 0)',
    maxLoss: 'Premium Paid',
    breakeven: 'Strike - Premium',
    idealConditions: ['Strong bearish view', 'Low IV', 'Expecting crash'],
    riskLevel: 'medium',
  },
  {
    id: 'bear_put_spread',
    name: 'Bear Put Spread',
    category: 'bearish',
    description: 'Buy higher strike put, sell lower strike put',
    legs: [
      { strikeOffset: 0, type: 'PE', action: 'BUY', lots: 1 },
      { strikeOffset: -2, type: 'PE', action: 'SELL', lots: 1 },
    ],
    maxProfit: 'Strike Width - Net Debit',
    maxLoss: 'Net Debit Paid',
    breakeven: 'Higher Strike - Net Debit',
    idealConditions: ['Moderately bearish', 'High IV', 'Defined risk desired'],
    riskLevel: 'low',
  },
  {
    id: 'bear_call_spread',
    name: 'Bear Call Spread',
    category: 'bearish',
    description: 'Sell lower strike call, buy higher strike call',
    legs: [
      { strikeOffset: 0, type: 'CE', action: 'SELL', lots: 1 },
      { strikeOffset: 2, type: 'CE', action: 'BUY', lots: 1 },
    ],
    maxProfit: 'Net Credit Received',
    maxLoss: 'Strike Width - Net Credit',
    breakeven: 'Lower Strike + Net Credit',
    idealConditions: ['Bearish to neutral', 'High IV', 'Want to collect premium'],
    riskLevel: 'low',
  },
  {
    id: 'put_ratio_backspread',
    name: 'Put Ratio Backspread',
    category: 'bearish',
    description: 'Sell 1 higher put, buy 2 lower puts',
    legs: [
      { strikeOffset: 0, type: 'PE', action: 'SELL', lots: 1 },
      { strikeOffset: -2, type: 'PE', action: 'BUY', lots: 2 },
    ],
    maxProfit: 'Substantial (if crash)',
    maxLoss: 'Limited (at lower strike)',
    breakeven: 'Complex - multiple points',
    idealConditions: ['Very bearish', 'Expecting crash', 'Low IV entry'],
    riskLevel: 'medium',
  },
  {
    id: 'synthetic_short',
    name: 'Synthetic Short',
    category: 'bearish',
    description: 'Buy put + Sell call at same strike',
    legs: [
      { strikeOffset: 0, type: 'PE', action: 'BUY', lots: 1 },
      { strikeOffset: 0, type: 'CE', action: 'SELL', lots: 1 },
    ],
    maxProfit: 'Strike Price (if to 0)',
    maxLoss: 'Unlimited',
    breakeven: 'Strike ± Net Premium',
    idealConditions: ['Strong bearish view', 'Want leverage short'],
    riskLevel: 'unlimited',
  },
  {
    id: 'protective_put',
    name: 'Protective Put',
    category: 'bearish',
    description: 'Own stock + Buy OTM put for protection',
    legs: [
      { strikeOffset: -2, type: 'PE', action: 'BUY', lots: 1 },
    ],
    maxProfit: 'Unlimited (stock upside)',
    maxLoss: 'Entry - Put Strike + Premium',
    breakeven: 'Entry + Premium',
    idealConditions: ['Own stock', 'Want downside protection', 'Before events'],
    riskLevel: 'low',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // NON-DIRECTIONAL / NEUTRAL STRATEGIES
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'long_straddle',
    name: 'Long Straddle',
    category: 'neutral',
    description: 'Buy ATM call + Buy ATM put (profit from big move)',
    legs: [
      { strikeOffset: 0, type: 'CE', action: 'BUY', lots: 1 },
      { strikeOffset: 0, type: 'PE', action: 'BUY', lots: 1 },
    ],
    maxProfit: 'Unlimited',
    maxLoss: 'Total Premium Paid',
    breakeven: 'Strike ± Total Premium',
    idealConditions: ['Expecting big move', 'Low IV', 'Before events'],
    riskLevel: 'medium',
  },
  {
    id: 'short_straddle',
    name: 'Short Straddle',
    category: 'neutral',
    description: 'Sell ATM call + Sell ATM put (profit from no move)',
    legs: [
      { strikeOffset: 0, type: 'CE', action: 'SELL', lots: 1 },
      { strikeOffset: 0, type: 'PE', action: 'SELL', lots: 1 },
    ],
    maxProfit: 'Total Premium Received',
    maxLoss: 'UNLIMITED',
    breakeven: 'Strike ± Total Premium',
    idealConditions: ['High IV', 'Range-bound market', 'Post-event IV crush'],
    riskLevel: 'unlimited',
  },
  {
    id: 'long_strangle',
    name: 'Long Strangle',
    category: 'neutral',
    description: 'Buy OTM call + Buy OTM put (cheaper than straddle)',
    legs: [
      { strikeOffset: 2, type: 'CE', action: 'BUY', lots: 1 },
      { strikeOffset: -2, type: 'PE', action: 'BUY', lots: 1 },
    ],
    maxProfit: 'Unlimited',
    maxLoss: 'Total Premium Paid',
    breakeven: 'Call + Premium / Put - Premium',
    idealConditions: ['Expecting very big move', 'Low IV', 'Before major events'],
    riskLevel: 'medium',
  },
  {
    id: 'short_strangle',
    name: 'Short Strangle',
    category: 'neutral',
    description: 'Sell OTM call + Sell OTM put (wider profit zone)',
    legs: [
      { strikeOffset: 2, type: 'CE', action: 'SELL', lots: 1 },
      { strikeOffset: -2, type: 'PE', action: 'SELL', lots: 1 },
    ],
    maxProfit: 'Total Premium Received',
    maxLoss: 'UNLIMITED',
    breakeven: 'Call + Premium / Put - Premium',
    idealConditions: ['High IV', 'Strong support/resistance', 'Range-bound'],
    riskLevel: 'unlimited',
  },
  {
    id: 'iron_condor',
    name: 'Iron Condor',
    category: 'neutral',
    description: 'Bull put spread + Bear call spread (defined risk range play)',
    legs: [
      { strikeOffset: -4, type: 'PE', action: 'BUY', lots: 1 },
      { strikeOffset: -2, type: 'PE', action: 'SELL', lots: 1 },
      { strikeOffset: 2, type: 'CE', action: 'SELL', lots: 1 },
      { strikeOffset: 4, type: 'CE', action: 'BUY', lots: 1 },
    ],
    maxProfit: 'Net Credit Received',
    maxLoss: 'Wing Width - Net Credit',
    breakeven: 'Short strikes ± Net Credit',
    idealConditions: ['High IV', 'Range-bound', 'Want defined risk'],
    riskLevel: 'medium',
  },
  {
    id: 'iron_butterfly',
    name: 'Iron Butterfly',
    category: 'neutral',
    description: 'Short straddle with protective wings',
    legs: [
      { strikeOffset: -2, type: 'PE', action: 'BUY', lots: 1 },
      { strikeOffset: 0, type: 'PE', action: 'SELL', lots: 1 },
      { strikeOffset: 0, type: 'CE', action: 'SELL', lots: 1 },
      { strikeOffset: 2, type: 'CE', action: 'BUY', lots: 1 },
    ],
    maxProfit: 'Net Credit Received',
    maxLoss: 'Wing Width - Net Credit',
    breakeven: 'ATM ± Net Credit',
    idealConditions: ['High IV', 'Pin risk acceptable', 'Expecting low move'],
    riskLevel: 'medium',
  },
  {
    id: 'long_call_butterfly',
    name: 'Long Call Butterfly',
    category: 'neutral',
    description: 'Buy 1 lower, Sell 2 middle, Buy 1 higher call',
    legs: [
      { strikeOffset: -2, type: 'CE', action: 'BUY', lots: 1 },
      { strikeOffset: 0, type: 'CE', action: 'SELL', lots: 2 },
      { strikeOffset: 2, type: 'CE', action: 'BUY', lots: 1 },
    ],
    maxProfit: 'Wing Width - Net Debit',
    maxLoss: 'Net Debit Paid',
    breakeven: 'Complex - near wings',
    idealConditions: ['Expecting pin at middle', 'Low cost entry', 'Range-bound'],
    riskLevel: 'low',
  },
  {
    id: 'long_put_butterfly',
    name: 'Long Put Butterfly',
    category: 'neutral',
    description: 'Buy 1 higher, Sell 2 middle, Buy 1 lower put',
    legs: [
      { strikeOffset: 2, type: 'PE', action: 'BUY', lots: 1 },
      { strikeOffset: 0, type: 'PE', action: 'SELL', lots: 2 },
      { strikeOffset: -2, type: 'PE', action: 'BUY', lots: 1 },
    ],
    maxProfit: 'Wing Width - Net Debit',
    maxLoss: 'Net Debit Paid',
    breakeven: 'Complex - near wings',
    idealConditions: ['Expecting pin at middle', 'Low cost entry'],
    riskLevel: 'low',
  },
  {
    id: 'calendar_spread',
    name: 'Calendar Spread (Time Spread)',
    category: 'neutral',
    description: 'Sell near-term, Buy far-term same strike',
    legs: [
      { strikeOffset: 0, type: 'CE', action: 'SELL', lots: 1 },
      // Note: Far month would be different expiry - simplified here
    ],
    maxProfit: 'If price at strike at near expiry',
    maxLoss: 'Net Debit Paid',
    breakeven: 'Around strike price',
    idealConditions: ['Expecting low vol near-term', 'Pin at strike'],
    riskLevel: 'medium',
  },
  {
    id: 'diagonal_spread',
    name: 'Diagonal Spread',
    category: 'neutral',
    description: 'Calendar spread with different strikes',
    legs: [
      { strikeOffset: 0, type: 'CE', action: 'SELL', lots: 1 },
      { strikeOffset: 2, type: 'CE', action: 'BUY', lots: 1 },
    ],
    maxProfit: 'Varies by strike/expiry combo',
    maxLoss: 'Net Debit or limited',
    breakeven: 'Complex calculation',
    idealConditions: ['Directional bias + time decay', 'Rolling income'],
    riskLevel: 'medium',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_UNDERLYING: UnderlyingData = {
  symbol: 'NIFTY',
  spotPrice: 24500,
  futuresPrice: 24550,
  lotSize: 75,
  iv: 12.5,
  ivPercentile: 35,
  daysToExpiry: 14,
  expiries: ['19DEC2024', '26DEC2024', '02JAN2025', '30JAN2025'],
};

// Strike gap for NIFTY
const STRIKE_GAP = 50;

// ═══════════════════════════════════════════════════════════════════════════
// CALCULATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function getATMStrike(spotPrice: number, gap: number): number {
  return Math.round(spotPrice / gap) * gap;
}

function generateStrikes(spotPrice: number, gap: number, count: number = 20): number[] {
  const atm = getATMStrike(spotPrice, gap);
  const strikes: number[] = [];
  for (let i = -count; i <= count; i++) {
    strikes.push(atm + i * gap);
  }
  return strikes;
}

function estimatePremium(
  spotPrice: number,
  strike: number,
  type: 'CE' | 'PE',
  iv: number,
  dte: number
): number {
  // Simplified Black-Scholes approximation
  const moneyness = type === 'CE' ? spotPrice - strike : strike - spotPrice;
  const timeValue = spotPrice * (iv / 100) * Math.sqrt(dte / 365) * 0.4;
  const intrinsic = Math.max(0, moneyness);
  
  // OTM options have only time value, ATM has max time value
  const distanceFromATM = Math.abs(spotPrice - strike) / spotPrice;
  const timeValueMultiplier = Math.exp(-distanceFromATM * 10); // Decay away from ATM
  
  return Math.max(5, intrinsic + timeValue * timeValueMultiplier);
}

function calculatePayoffAtPrice(
  legs: OptionLeg[],
  priceAtExpiry: number,
  lotSize: number
): number {
  let totalPnl = 0;
  
  for (const leg of legs) {
    const direction = leg.action === 'BUY' ? 1 : -1;
    
    let intrinsicValue = 0;
    if (leg.type === 'CE') {
      intrinsicValue = Math.max(0, priceAtExpiry - leg.strike);
    } else {
      intrinsicValue = Math.max(0, leg.strike - priceAtExpiry);
    }
    
    const legPnl = (intrinsicValue - leg.premium) * direction * leg.lots * lotSize;
    totalPnl += legPnl;
  }
  
  return totalPnl;
}

function generatePayoffCurve(
  legs: OptionLeg[],
  spotPrice: number,
  lotSize: number,
  range: number = 0.15 // ±15% from spot
): PayoffPoint[] {
  const points: PayoffPoint[] = [];
  const minPrice = spotPrice * (1 - range);
  const maxPrice = spotPrice * (1 + range);
  const step = (maxPrice - minPrice) / 100;
  
  for (let price = minPrice; price <= maxPrice; price += step) {
    points.push({
      price: Math.round(price * 100) / 100,
      pnl: calculatePayoffAtPrice(legs, price, lotSize),
      pnlAtExpiry: calculatePayoffAtPrice(legs, price, lotSize),
    });
  }
  
  return points;
}

function calculateMetrics(
  legs: OptionLeg[],
  spotPrice: number,
  lotSize: number,
  iv: number,
  dte: number
): StrategyMetrics {
  const payoffCurve = generatePayoffCurve(legs, spotPrice, lotSize, 0.20);
  
  // Net premium
  let netPremium = 0;
  for (const leg of legs) {
    const direction = leg.action === 'BUY' ? -1 : 1;
    netPremium += leg.premium * direction * leg.lots * lotSize;
  }
  
  // Max profit and loss from payoff curve
  const pnls = payoffCurve.map(p => p.pnl);
  const maxProfit = Math.max(...pnls);
  const maxLoss = Math.min(...pnls);
  
  // Find breakevens (where PnL crosses 0)
  const breakevens: number[] = [];
  for (let i = 1; i < payoffCurve.length; i++) {
    const prev = payoffCurve[i - 1];
    const curr = payoffCurve[i];
    if ((prev.pnl < 0 && curr.pnl >= 0) || (prev.pnl >= 0 && curr.pnl < 0)) {
      // Linear interpolation
      const ratio = Math.abs(prev.pnl) / (Math.abs(prev.pnl) + Math.abs(curr.pnl));
      const breakeven = prev.price + (curr.price - prev.price) * ratio;
      breakevens.push(Math.round(breakeven * 100) / 100);
    }
  }
  
  // Probability of profit (simplified using expected move)
  const expectedMove = spotPrice * (iv / 100) * Math.sqrt(dte / 365);
  const profitZoneWidth = breakevens.length >= 2 
    ? breakevens[breakevens.length - 1] - breakevens[0]
    : expectedMove * 2;
  const probabilityOfProfit = Math.min(90, Math.max(10, 50 + (profitZoneWidth / expectedMove - 2) * 15));
  
  // Risk reward ratio
  const riskRewardRatio = maxLoss !== 0 ? Math.abs(maxProfit / maxLoss) : Infinity;
  
  // Margin (simplified)
  const hasNakedShort = legs.some(l => l.action === 'SELL');
  const requiredMargin = hasNakedShort 
    ? spotPrice * lotSize * 0.15 * Math.max(...legs.map(l => l.lots))
    : Math.abs(Math.min(0, netPremium));
  
  // Greeks (simplified)
  let totalDelta = 0;
  let totalGamma = 0;
  let totalTheta = 0;
  let totalVega = 0;
  
  for (const leg of legs) {
    const direction = leg.action === 'BUY' ? 1 : -1;
    const moneyness = (spotPrice - leg.strike) / spotPrice;
    
    // Delta
    let delta = leg.type === 'CE' ? 0.5 + moneyness * 2 : -0.5 + moneyness * 2;
    delta = Math.max(-1, Math.min(1, delta));
    
    // Gamma (highest at ATM)
    const gamma = 0.01 * Math.exp(-Math.abs(moneyness) * 20);
    
    // Theta (time decay)
    const theta = -leg.premium / dte * 0.7;
    
    // Vega
    const vega = leg.premium * 0.1;
    
    totalDelta += delta * direction * leg.lots * lotSize;
    totalGamma += gamma * direction * leg.lots * lotSize;
    totalTheta += theta * direction * leg.lots * lotSize;
    totalVega += vega * direction * leg.lots * lotSize;
  }
  
  return {
    netCredit: Math.max(0, netPremium),
    netDebit: Math.abs(Math.min(0, netPremium)),
    maxProfit,
    maxLoss,
    breakevens,
    probabilityOfProfit,
    riskRewardRatio,
    requiredMargin,
    totalDelta,
    totalGamma,
    totalTheta,
    totalVega,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

interface PayoffBuilderProps {
  data?: UnderlyingData;
}

export default function OptionsPayoffBuilder({ data }: PayoffBuilderProps) {
  const underlying = data || DEFAULT_UNDERLYING;
  
  const [activeCategory, setActiveCategory] = useState<StrategyCategory>('bullish');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [legs, setLegs] = useState<OptionLeg[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState(underlying.expiries[0]);
  const [showGreeks, setShowGreeks] = useState(false);
  
  const strikes = useMemo(() => 
    generateStrikes(underlying.spotPrice, STRIKE_GAP, 15),
    [underlying.spotPrice]
  );
  
  const atmStrike = useMemo(() => 
    getATMStrike(underlying.spotPrice, STRIKE_GAP),
    [underlying.spotPrice]
  );
  
  // Apply template
  const applyTemplate = useCallback((templateId: string) => {
    const template = STRATEGY_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    
    const newLegs: OptionLeg[] = template.legs.map((legDef, index) => {
      const strike = atmStrike + legDef.strikeOffset * STRIKE_GAP;
      const premium = estimatePremium(
        underlying.spotPrice,
        strike,
        legDef.type,
        underlying.iv,
        underlying.daysToExpiry
      );
      
      return {
        id: `leg-${Date.now()}-${index}`,
        strike,
        type: legDef.type,
        action: legDef.action,
        lots: legDef.lots,
        premium: Math.round(premium * 100) / 100,
        iv: underlying.iv,
      };
    });
    
    setLegs(newLegs);
    setSelectedTemplate(templateId);
  }, [atmStrike, underlying]);
  
  // Add custom leg
  const addLeg = useCallback(() => {
    const premium = estimatePremium(
      underlying.spotPrice,
      atmStrike,
      'CE',
      underlying.iv,
      underlying.daysToExpiry
    );
    
    const newLeg: OptionLeg = {
      id: `leg-${Date.now()}`,
      strike: atmStrike,
      type: 'CE',
      action: 'BUY',
      lots: 1,
      premium: Math.round(premium * 100) / 100,
      iv: underlying.iv,
    };
    
    setLegs([...legs, newLeg]);
    setSelectedTemplate(null);
  }, [legs, atmStrike, underlying]);
  
  // Update leg
  const updateLeg = useCallback((id: string, updates: Partial<OptionLeg>) => {
    setLegs(prev => prev.map(leg => {
      if (leg.id !== id) return leg;
      
      const updated = { ...leg, ...updates };
      
      // Recalculate premium if strike or type changed
      if (updates.strike !== undefined || updates.type !== undefined) {
        updated.premium = Math.round(estimatePremium(
          underlying.spotPrice,
          updated.strike,
          updated.type,
          underlying.iv,
          underlying.daysToExpiry
        ) * 100) / 100;
      }
      
      return updated;
    }));
    setSelectedTemplate(null);
  }, [underlying]);
  
  // Remove leg
  const removeLeg = useCallback((id: string) => {
    setLegs(prev => prev.filter(leg => leg.id !== id));
    setSelectedTemplate(null);
  }, []);
  
  // Reset
  const resetPositions = useCallback(() => {
    setLegs([]);
    setSelectedTemplate(null);
  }, []);
  
  // Calculate payoff and metrics
  const payoffCurve = useMemo(() => 
    generatePayoffCurve(legs, underlying.spotPrice, underlying.lotSize),
    [legs, underlying.spotPrice, underlying.lotSize]
  );
  
  const metrics = useMemo(() => 
    calculateMetrics(legs, underlying.spotPrice, underlying.lotSize, underlying.iv, underlying.daysToExpiry),
    [legs, underlying]
  );
  
  // Filter templates by category
  const filteredTemplates = STRATEGY_TEMPLATES.filter(t => t.category === activeCategory);
  
  // Standard deviation markers
  const stdDev = underlying.spotPrice * (underlying.iv / 100) * Math.sqrt(underlying.daysToExpiry / 365);
  
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Options Payoff Builder</div>
            <div className="text-lg font-semibold text-slate-100">{underlying.symbol}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-500">Spot</div>
              <div className="text-sm font-medium text-slate-200">₹{underlying.spotPrice.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">IV</div>
              <div className="text-sm font-medium text-slate-200">{underlying.iv}%</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">DTE</div>
              <div className="text-sm font-medium text-slate-200">{underlying.daysToExpiry}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Lot Size</div>
              <div className="text-sm font-medium text-slate-200">{underlying.lotSize}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-4">
          {(['bullish', 'bearish', 'neutral'] as StrategyCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat
                  ? cat === 'bullish' 
                    ? 'bg-emerald-600 text-white'
                    : cat === 'bearish'
                      ? 'bg-red-600 text-white'
                      : 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {cat === 'bullish' && '📈 '}
              {cat === 'bearish' && '📉 '}
              {cat === 'neutral' && '➡️ '}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Strategy Templates */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4">
          {filteredTemplates.map(template => (
            <button
              key={template.id}
              onClick={() => applyTemplate(template.id)}
              className={`p-2 rounded-lg border text-left transition-all ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className="text-xs font-medium text-slate-200 truncate">{template.name}</div>
              <div className={`text-[10px] mt-0.5 ${
                template.riskLevel === 'unlimited' 
                  ? 'text-red-400'
                  : template.riskLevel === 'high'
                    ? 'text-orange-400'
                    : template.riskLevel === 'medium'
                      ? 'text-yellow-400'
                      : 'text-emerald-400'
              }`}>
                {template.riskLevel === 'unlimited' ? '⚠️ Unlimited' : template.riskLevel} risk
              </div>
            </button>
          ))}
        </div>
        
        {/* Position Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Legs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-300">Positions</div>
              <div className="flex gap-2">
                <button
                  onClick={addLeg}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                >
                  + Add Leg
                </button>
                {legs.length > 0 && (
                  <button
                    onClick={resetPositions}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
            
            {legs.length === 0 ? (
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 text-center">
                <div className="text-slate-400 text-sm mb-2">No positions yet</div>
                <div className="text-slate-500 text-xs">Select a strategy template above or add custom legs</div>
              </div>
            ) : (
              <div className="space-y-2">
                {legs.map((leg, index) => (
                  <div
                    key={leg.id}
                    className={`bg-slate-800/50 rounded-lg border p-3 ${
                      leg.action === 'BUY' ? 'border-emerald-500/30' : 'border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        leg.action === 'BUY' 
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {leg.action}
                      </span>
                      <span className="text-sm text-slate-200">
                        {leg.lots}x {leg.strike} {leg.type}
                      </span>
                      <span className="text-xs text-slate-400 ml-auto">
                        ₹{leg.premium.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeLeg(leg.id)}
                        className="text-slate-500 hover:text-red-400 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      <select
                        value={leg.action}
                        onChange={e => updateLeg(leg.id, { action: e.target.value as 'BUY' | 'SELL' })}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200"
                      >
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                      </select>
                      
                      <select
                        value={leg.strike}
                        onChange={e => updateLeg(leg.id, { strike: Number(e.target.value) })}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200"
                      >
                        {strikes.map(s => (
                          <option key={s} value={s}>
                            {s} {s === atmStrike ? '(ATM)' : ''}
                          </option>
                        ))}
                      </select>
                      
                      <select
                        value={leg.type}
                        onChange={e => updateLeg(leg.id, { type: e.target.value as 'CE' | 'PE' })}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200"
                      >
                        <option value="CE">CE (Call)</option>
                        <option value="PE">PE (Put)</option>
                      </select>
                      
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={leg.lots}
                        onChange={e => updateLeg(leg.id, { lots: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200 text-center"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Metrics */}
            {legs.length > 0 && (
              <div className="mt-4 bg-slate-800/50 rounded-lg border border-slate-700 p-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-slate-500 text-xs">Net Credit/Debit</div>
                    <div className={metrics.netCredit > 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {metrics.netCredit > 0 ? '+' : '-'}₹{Math.abs(metrics.netCredit || metrics.netDebit).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Max Profit</div>
                    <div className="text-emerald-400">
                      {metrics.maxProfit === Infinity ? 'Unlimited' : `₹${metrics.maxProfit.toLocaleString()}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Max Loss</div>
                    <div className="text-red-400">
                      {metrics.maxLoss === -Infinity ? 'Unlimited' : `₹${Math.abs(metrics.maxLoss).toLocaleString()}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Risk/Reward</div>
                    <div className="text-slate-200">
                      {metrics.riskRewardRatio === Infinity ? '∞' : metrics.riskRewardRatio.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Breakeven(s)</div>
                    <div className="text-slate-200">
                      {metrics.breakevens.length > 0 
                        ? metrics.breakevens.map(b => b.toFixed(0)).join(', ')
                        : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Prob. of Profit</div>
                    <div className={metrics.probabilityOfProfit > 50 ? 'text-emerald-400' : 'text-amber-400'}>
                      {metrics.probabilityOfProfit.toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Margin Required</div>
                    <div className="text-slate-200">₹{metrics.requiredMargin.toLocaleString()}</div>
                  </div>
                </div>
                
                {/* Greeks Toggle */}
                <button
                  onClick={() => setShowGreeks(!showGreeks)}
                  className="mt-3 text-xs text-blue-400 hover:text-blue-300"
                >
                  {showGreeks ? '▼ Hide Greeks' : '▶ Show Greeks'}
                </button>
                
                {showGreeks && (
                  <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <div className="text-slate-500">Delta</div>
                      <div className="text-slate-200">{metrics.totalDelta.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Gamma</div>
                      <div className="text-slate-200">{metrics.totalGamma.toFixed(4)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Theta</div>
                      <div className="text-red-400">{metrics.totalTheta.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Vega</div>
                      <div className="text-slate-200">{metrics.totalVega.toFixed(2)}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Right: Payoff Chart */}
          <div>
            <div className="text-sm font-medium text-slate-300 mb-2">Payoff at Expiry</div>
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-3">
              {legs.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
                  Add positions to see payoff chart
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={payoffCurve.map(p => ({
                    ...p,
                    profit: p.pnl >= 0 ? p.pnl : null,
                    loss: p.pnl < 0 ? p.pnl : null,
                    profitFill: p.pnl > 0 ? p.pnl : 0,
                    lossFill: p.pnl < 0 ? p.pnl : 0,
                  }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="lossGradient" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="price"
                      tick={{ fill: '#9ca3af', fontSize: 10 }}
                      tickFormatter={v => v.toFixed(0)}
                      domain={['dataMin', 'dataMax']}
                    />
                    <YAxis
                      tick={{ fill: '#9ca3af', fontSize: 10 }}
                      tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number, name: string) => {
                        if (name === 'profitFill' || name === 'lossFill') return null;
                        if (value === null) return null;
                        const color = value >= 0 ? '#10b981' : '#ef4444';
                        return [<span style={{ color }}>{`₹${value.toLocaleString()}`}</span>, 'P&L'];
                      }}
                      labelFormatter={label => `Price: ₹${Number(label).toLocaleString()}`}
                    />
                    
                    {/* Zero line */}
                    <ReferenceLine y={0} stroke="#6b7280" strokeWidth={1} />
                    
                    {/* Current spot */}
                    <ReferenceLine
                      x={underlying.spotPrice}
                      stroke="#3b82f6"
                      strokeDasharray="5 5"
                      label={{ value: 'Spot', fill: '#3b82f6', fontSize: 10 }}
                    />
                    
                    {/* Standard deviation markers */}
                    <ReferenceLine
                      x={underlying.spotPrice - stdDev}
                      stroke="#6b7280"
                      strokeDasharray="2 2"
                      label={{ value: '-1σ', fill: '#6b7280', fontSize: 9 }}
                    />
                    <ReferenceLine
                      x={underlying.spotPrice + stdDev}
                      stroke="#6b7280"
                      strokeDasharray="2 2"
                      label={{ value: '+1σ', fill: '#6b7280', fontSize: 9 }}
                    />
                    
                    {/* Breakeven lines */}
                    {metrics.breakevens.map((be, i) => (
                      <ReferenceLine
                        key={i}
                        x={be}
                        stroke="#f59e0b"
                        strokeDasharray="3 3"
                      />
                    ))}
                    
                    {/* Profit area fill (green) */}
                    <Area
                      type="monotone"
                      dataKey="profitFill"
                      stroke="none"
                      fill="url(#profitGradient)"
                      dot={false}
                      isAnimationActive={false}
                    />
                    
                    {/* Loss area fill (red) */}
                    <Area
                      type="monotone"
                      dataKey="lossFill"
                      stroke="none"
                      fill="url(#lossGradient)"
                      dot={false}
                      isAnimationActive={false}
                    />
                    
                    {/* Profit line (green) */}
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      connectNulls={false}
                      isAnimationActive={false}
                    />
                    
                    {/* Loss line (red) */}
                    <Line
                      type="monotone"
                      dataKey="loss"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                      connectNulls={false}
                      isAnimationActive={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
            
            {/* Legend */}
            {legs.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-emerald-500/40 border border-emerald-500 rounded-sm"></div>
                  <span>Profit</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500/40 border border-red-500 rounded-sm"></div>
                  <span>Loss</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span>Spot</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-amber-500"></div>
                  <span>Breakeven</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-slate-500"></div>
                  <span>±1σ Move</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Strategy Info */}
        {selectedTemplate && (
          <div className="mt-4 bg-slate-800/30 rounded-lg border border-slate-700/50 p-3">
            {(() => {
              const template = STRATEGY_TEMPLATES.find(t => t.id === selectedTemplate);
              if (!template) return null;
              
              return (
                <>
                  <div className="text-sm font-medium text-slate-200 mb-2">{template.name}</div>
                  <div className="text-xs text-slate-400 mb-3">{template.description}</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <div className="text-slate-500">Max Profit</div>
                      <div className="text-emerald-400">{template.maxProfit}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Max Loss</div>
                      <div className="text-red-400">{template.maxLoss}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Breakeven</div>
                      <div className="text-slate-300">{template.breakeven}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Ideal When</div>
                      <div className="text-slate-300">{template.idealConditions[0]}</div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
