// ═══════════════════════════════════════════════════════════════════════════
// MCX COMMODITY DASHBOARD
// Comprehensive futures dashboard for bullion, base metals & energy
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type CommodityCategory = "bullion" | "baseMetals" | "energy";

interface MCXFuturesContract {
  symbol: string;
  contractMonth: string;
  displayName: string;
  category: CommodityCategory;
  lotSize: number;
  lotUnit: string;
  tickSize: number;
  tickValue: number;
  ltp: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  openInterest: number;
  oiChange: number;
  oiChangePercent: number;
  spanMargin: number;
  exposureMargin: number;
  totalMargin: number;
  expiryDate: string;
  daysToExpiry: number;
  globalBenchmark?: string;
  parityPrice?: number;
  premiumDiscount?: number;
}

interface GlobalBenchmark {
  id: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  mcxEquivalent: string;
  mcxParityPrice: number;
}

interface ContractMonth {
  month: string;
  monthLabel: string;
  ltp: number;
  change: number;
  changePercent: number;
  oi: number;
  volume: number;
  expiryDate: string;
  daysToExpiry: number;
  isNearMonth: boolean;
  premiumToNear: number;
}

interface CalendarSpread {
  id: string;
  commodity: string;
  nearMonth: string;
  farMonth: string;
  currentSpread: number;
  spreadHistory: Array<{ date: string; spread: number }>;
  mean30D: number;
  stdDev: number;
  zScore: number;
  signal: "long_spread" | "short_spread" | "neutral";
}

interface CommodityRatio {
  id: string;
  name: string;
  numerator: string;
  denominator: string;
  currentRatio: number;
  avgRatio: number;
  percentile: number;
  interpretation: "high" | "low" | "neutral";
  description: string;
}

export interface MCXDashboardData {
  asOf: string;
  marketStatus: "open" | "closed" | "pre-open";
  tradingSession: { start: string; end: string; currentTime: string };
  usdinr: number;
  commodities: {
    bullion: MCXFuturesContract[];
    baseMetals: MCXFuturesContract[];
    energy: MCXFuturesContract[];
  };
  globalBenchmarks: GlobalBenchmark[];
  contractChain: {
    commodity: string;
    contracts: ContractMonth[];
    structure: "contango" | "backwardation" | "flat";
    annualizedCarry: number;
    rollDays: number;
  };
  spreads: {
    calendarSpreads: CalendarSpread[];
    interCommodityRatios: CommodityRatio[];
  };
  insights: string[];
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

export function getMCXCommodityDashboardOutput(data: MCXDashboardData): CardOutput {
  const { asOf, marketStatus, usdinr, commodities, contractChain, insights } = data;
  
  const allContracts = [...commodities.bullion, ...commodities.baseMetals, ...commodities.energy];
  const gainers = allContracts.filter(c => c.changePercent > 0);
  const losers = allContracts.filter(c => c.changePercent < 0);
  const topGainer = allContracts.reduce((a, b) => a.changePercent > b.changePercent ? a : b, allContracts[0]);
  const topLoser = allContracts.reduce((a, b) => a.changePercent < b.changePercent ? a : b, allContracts[0]);
  const avgChange = allContracts.reduce((sum, c) => sum + c.changePercent, 0) / allContracts.length;
  
  const sentiment = avgChange > 0.5 ? "bullish" : avgChange < -0.5 ? "bearish" : "neutral";
  const signalStrength = Math.abs(avgChange) > 1 ? 4 : 3;
  
  const keyMetrics: MetricValue[] = [
    createMetric("USD/INR", "mcx_usdinr", usdinr, "neutral", 
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("Gainers", "mcx_gainers", gainers.length, 
      gainers.length > losers.length ? "good" : "fair",
      { format: "number", priority: 1 }),
    createMetric("Losers", "mcx_losers", losers.length, 
      losers.length > gainers.length ? "poor" : "fair",
      { format: "number", priority: 1 }),
    createMetric("Avg Change", "mcx_avg", avgChange, 
      avgChange > 0 ? "good" : avgChange < 0 ? "poor" : "neutral",
      { format: "percent", priority: 1 }),
    createMetric("Carry Structure", "mcx_structure", 0, 
      contractChain.structure === "contango" ? "good" : "fair",
      { format: "text", priority: 2, displayValue: contractChain.structure }),
    createMetric("Annualized Carry", "mcx_carry", contractChain.annualizedCarry, "neutral", 
      { format: "percent", priority: 2 }),
  ];
  
  // Add top movers
  if (topGainer) {
    keyMetrics.push(createMetric("Top Gainer", "mcx_top_gain", topGainer.changePercent, "excellent", 
      { format: "percent", priority: 2, displayValue: `${topGainer.displayName} +${topGainer.changePercent.toFixed(2)}%` }));
  }
  if (topLoser) {
    keyMetrics.push(createMetric("Top Loser", "mcx_top_loss", topLoser.changePercent, "poor", 
      { format: "percent", priority: 2, displayValue: `${topLoser.displayName} ${topLoser.changePercent.toFixed(2)}%` }));
  }
  
  const cardInsights: Insight[] = [];
  
  // Market status
  cardInsights.push(createInsight("observation", `MCX market ${marketStatus}: ${allContracts.length} contracts active`, 2));
  
  // Breadth
  if (gainers.length > losers.length * 2) {
    cardInsights.push(createInsight("strength", `Broad strength: ${gainers.length} gainers vs ${losers.length} losers`, 1, ["mcx_gainers"]));
  } else if (losers.length > gainers.length * 2) {
    cardInsights.push(createInsight("weakness", `Broad weakness: ${losers.length} losers vs ${gainers.length} gainers`, 1, ["mcx_losers"]));
  }
  
  // Curve structure
  if (contractChain.structure === "backwardation") {
    cardInsights.push(createInsight("observation", `${contractChain.commodity} in backwardation (${contractChain.annualizedCarry.toFixed(1)}% carry) - supply tightness`, 2, ["mcx_structure"]));
  }
  
  // Dashboard insights
  insights.slice(0, 2).forEach(i => {
    cardInsights.push(createInsight("observation", i, 3));
  });
  
  const headline = `MCX ${marketStatus}: ${gainers.length}↑ ${losers.length}↓, avg ${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%, USD/INR ${usdinr.toFixed(2)}`;
  
  return {
    cardId: "mcx-commodity-dashboard",
    cardCategory: "commodities",
    symbol: "MCX",
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights: cardInsights,
    suggestedCards: ["macro-pulse", "volatility-regime"],
    tags: ["commodities", "mcx", marketStatus, contractChain.structure],
    scoreContribution: {
      category: "momentum",
      score: Math.min(100, Math.max(0, 50 + avgChange * 10)),
      weight: 0.05,
    },
  };
}

interface Props {
  data?: MCXDashboardData;
  isLoading?: boolean;
  error?: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const CategoryTab = ({ 
  id, 
  label, 
  count, 
  active, 
  onClick 
}: { 
  id: CommodityCategory; 
  label: string; 
  count: number; 
  active: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      active
        ? "bg-amber-600 text-white"
        : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
    }`}
  >
    {label}
    <span className={`ml-2 text-xs ${active ? "text-amber-200" : "text-slate-500"}`}>
      ({count})
    </span>
  </button>
);

const MarketStatusBadge = ({ status }: { status: string }) => {
  const config = {
    open: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Market Open" },
    closed: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Market Closed" },
    "pre-open": { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Pre-Open" },
  }[status] || { color: "bg-slate-500/20 text-slate-400", label: status };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${config.color}`}>
      🕐 {config.label}
    </span>
  );
};

const ContractCard = ({ contract }: { contract: MCXFuturesContract }) => {
  const isPositive = contract.change >= 0;
  
  return (
    <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50 hover:border-slate-600/50 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-100">{contract.symbol}</span>
            <span className="text-xs text-slate-500">{contract.contractMonth}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {contract.lotSize} {contract.lotUnit}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-slate-100">
            ₹{contract.ltp.toLocaleString("en-IN")}
          </div>
          <div className={`text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
            {isPositive ? "▲" : "▼"} {Math.abs(contract.change).toLocaleString("en-IN")} ({contract.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2 text-[10px] mb-2">
        <div>
          <span className="text-slate-500">H:</span>
          <span className="text-slate-300 ml-1">{contract.high.toLocaleString("en-IN")}</span>
        </div>
        <div>
          <span className="text-slate-500">L:</span>
          <span className="text-slate-300 ml-1">{contract.low.toLocaleString("en-IN")}</span>
        </div>
        <div>
          <span className="text-slate-500">OI:</span>
          <span className="text-slate-300 ml-1">{(contract.openInterest / 1000).toFixed(1)}K</span>
        </div>
        <div>
          <span className="text-slate-500">Vol:</span>
          <span className="text-slate-300 ml-1">{(contract.volume / 1000).toFixed(1)}K</span>
        </div>
      </div>
      
      {/* Margin & Tick */}
      <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-700/50">
        <div>
          <span className="text-slate-500">Margin:</span>
          <span className="text-amber-400 ml-1 font-medium">
            ₹{(contract.totalMargin / 100000).toFixed(2)}L
          </span>
        </div>
        <div>
          <span className="text-slate-500">Tick:</span>
          <span className="text-slate-300 ml-1">₹{contract.tickValue}</span>
        </div>
        <Badge variant="outline" className="text-[9px] py-0 h-4 border-slate-600 text-slate-400">
          {contract.daysToExpiry}d
        </Badge>
      </div>
      
      {/* Parity indicator */}
      {contract.premiumDiscount !== undefined && (
        <div className="mt-2 pt-2 border-t border-slate-700/50 text-[10px]">
          <span className="text-slate-500">vs {contract.globalBenchmark}:</span>
          <span className={`ml-1 font-medium ${
            contract.premiumDiscount > 0 ? "text-amber-400" : "text-blue-400"
          }`}>
            {contract.premiumDiscount > 0 ? "+" : ""}{contract.premiumDiscount.toFixed(2)}%
          </span>
        </div>
      )}
    </div>
  );
};

const BenchmarkCard = ({ benchmark, usdinr }: { benchmark: GlobalBenchmark; usdinr: number }) => {
  const isPositive = benchmark.change >= 0;
  
  return (
    <div className="bg-slate-800/30 rounded-lg p-2.5 border border-slate-700/30 min-w-[140px]">
      <div className="text-[10px] text-slate-500 mb-1">{benchmark.name}</div>
      <div className="text-sm font-bold text-slate-100">
        {benchmark.currency === "USD" ? "$" : ""}
        {benchmark.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div className={`text-[10px] font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
        {isPositive ? "+" : ""}{benchmark.changePercent.toFixed(2)}%
      </div>
      <div className="mt-1.5 pt-1.5 border-t border-slate-700/30 text-[9px]">
        <div className="text-slate-500">MCX Parity</div>
        <div className="text-slate-300">₹{benchmark.mcxParityPrice.toLocaleString("en-IN")}</div>
      </div>
    </div>
  );
};

const ContractChainRow = ({ contract, isActive }: { contract: ContractMonth; isActive: boolean }) => {
  const isPositive = contract.change >= 0;
  
  return (
    <tr className={`border-b border-slate-700/30 ${isActive ? "bg-amber-500/10" : ""}`}>
      <td className="py-2 px-2 text-xs">
        <span className="text-slate-200">{contract.monthLabel}</span>
        {isActive && (
          <span className="ml-2 text-[9px] text-amber-400">● Active</span>
        )}
      </td>
      <td className="py-2 px-2 text-xs text-right text-slate-200">
        ₹{contract.ltp.toLocaleString("en-IN")}
      </td>
      <td className={`py-2 px-2 text-xs text-right ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
        {isPositive ? "+" : ""}{contract.changePercent.toFixed(2)}%
      </td>
      <td className="py-2 px-2 text-xs text-right text-slate-400">
        {(contract.oi / 1000).toFixed(1)}K
      </td>
      <td className="py-2 px-2 text-xs text-right text-slate-400">
        {(contract.volume / 1000).toFixed(1)}K
      </td>
      <td className="py-2 px-2 text-xs text-right text-slate-500">
        {contract.expiryDate}
      </td>
    </tr>
  );
};

const SpreadSignalBadge = ({ signal }: { signal: string }) => {
  const config = {
    long_spread: { color: "bg-emerald-500/20 text-emerald-400", label: "Long Spread" },
    short_spread: { color: "bg-red-500/20 text-red-400", label: "Short Spread" },
    neutral: { color: "bg-slate-500/20 text-slate-400", label: "Neutral" },
  }[signal] || { color: "bg-slate-500/20 text-slate-400", label: signal };

  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const RatioInterpretation = ({ interpretation }: { interpretation: string }) => {
  const config = {
    high: { color: "text-amber-400", label: "High vs history" },
    low: { color: "text-blue-400", label: "Low vs history" },
    neutral: { color: "text-slate-400", label: "Neutral" },
  }[interpretation] || { color: "text-slate-400", label: interpretation };

  return <span className={`text-[9px] ${config.color}`}>{config.label}</span>;
};

// ═══════════════════════════════════════════════════════════════════════════
// CALCULATORS
// ═══════════════════════════════════════════════════════════════════════════

const MarginCalculator = ({ 
  contracts 
}: { 
  contracts: MCXFuturesContract[];
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState(contracts[0]?.symbol || "");
  const [lots, setLots] = useState(1);
  const [orderType, setOrderType] = useState<"NRML" | "MIS">("NRML");

  // Update selected symbol when contracts change
  React.useEffect(() => {
    if (contracts.length > 0 && !selectedSymbol) {
      setSelectedSymbol(contracts[0].symbol);
    }
  }, [contracts, selectedSymbol]);

  const selectedContract = contracts.find(c => c.symbol === selectedSymbol);
  
  const calculation = useMemo(() => {
    if (!selectedContract) return null;
    
    const contractValue = selectedContract.ltp * selectedContract.lotSize * lots;
    const misMultiplier = orderType === "MIS" ? 0.5 : 1;
    const spanMargin = selectedContract.spanMargin * lots * misMultiplier;
    const exposureMargin = selectedContract.exposureMargin * lots * misMultiplier;
    const totalMargin = spanMargin + exposureMargin;
    
    return {
      contractValue,
      spanMargin,
      exposureMargin,
      totalMargin,
      tickValue: selectedContract.tickValue * lots,
      tickSize: selectedContract.tickSize,
    };
  }, [selectedContract, lots, orderType]);

  // Guard for empty contracts
  if (contracts.length === 0) {
    return (
      <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
        <div className="text-xs font-medium text-slate-300 mb-3">Margin Calculator</div>
        <div className="text-[11px] text-slate-500">No contracts available</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
      <div className="text-xs font-medium text-slate-300 mb-3">Margin Calculator</div>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Commodity</label>
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1.5 text-xs text-slate-200"
          >
            {contracts.map(c => (
              <option key={c.symbol} value={c.symbol}>
                {c.symbol} {c.contractMonth}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Lots</label>
          <input
            type="number"
            min={1}
            max={100}
            value={lots}
            onChange={(e) => setLots(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1.5 text-xs text-slate-200"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as "NRML" | "MIS")}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1.5 text-xs text-slate-200"
          >
            <option value="NRML">NRML</option>
            <option value="MIS">MIS</option>
          </select>
        </div>
      </div>

      {calculation && (
        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-500">Contract Value:</span>
            <span className="text-slate-300">₹{calculation.contractValue.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">SPAN Margin:</span>
            <span className="text-slate-300">₹{calculation.spanMargin.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Exposure Margin:</span>
            <span className="text-slate-300">₹{calculation.exposureMargin.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-slate-700/50">
            <span className="text-slate-400 font-medium">Total Margin:</span>
            <span className="text-amber-400 font-bold">₹{calculation.totalMargin.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between pt-1.5 text-[10px]">
            <span className="text-slate-500">Tick Value:</span>
            <span className="text-slate-400">₹{calculation.tickValue} per ₹{calculation.tickSize} move</span>
          </div>
        </div>
      )}
    </div>
  );
};

const PLCalculator = ({ 
  contracts 
}: { 
  contracts: MCXFuturesContract[];
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState(contracts[0]?.symbol || "");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [lots, setLots] = useState(1);
  const [direction, setDirection] = useState<"long" | "short">("long");

  // Update selected symbol when contracts change
  React.useEffect(() => {
    if (contracts.length > 0 && !selectedSymbol) {
      setSelectedSymbol(contracts[0].symbol);
    }
  }, [contracts, selectedSymbol]);

  const selectedContract = contracts.find(c => c.symbol === selectedSymbol);
  
  const calculation = useMemo(() => {
    if (!selectedContract || !entryPrice || !exitPrice) return null;
    
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    if (isNaN(entry) || isNaN(exit)) return null;
    
    const points = direction === "long" ? exit - entry : entry - exit;
    const multiplier = selectedContract.lotSize / (selectedContract.tickSize || 1);
    const grossPL = points * selectedContract.tickValue * lots / selectedContract.tickSize;
    
    // Charges calculation
    const contractValue = selectedContract.ltp * selectedContract.lotSize * lots;
    const brokerage = 40; // ₹20 per order × 2 orders
    const stt = contractValue * 0.0001; // 0.01% on sell side
    const exchangeFees = contractValue * 0.0000325;
    const sebiCharges = contractValue * 0.000001;
    const gst = (brokerage + exchangeFees) * 0.18;
    const stampDuty = contractValue * 0.00003;
    
    const totalCharges = brokerage + stt + exchangeFees + sebiCharges + gst + stampDuty;
    const netPL = grossPL - totalCharges;
    const roiOnMargin = (netPL / selectedContract.totalMargin) * 100;
    
    return {
      points,
      grossPL,
      brokerage,
      stt,
      exchangeFees,
      sebiCharges,
      gst,
      stampDuty,
      totalCharges,
      netPL,
      roiOnMargin,
    };
  }, [selectedContract, entryPrice, exitPrice, lots, direction]);

  // Guard for empty contracts
  if (contracts.length === 0) {
    return (
      <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
        <div className="text-xs font-medium text-slate-300 mb-3">P&L Calculator</div>
        <div className="text-[11px] text-slate-500">No contracts available</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
      <div className="text-xs font-medium text-slate-300 mb-3">P&L Calculator</div>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Commodity</label>
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1.5 text-xs text-slate-200"
          >
            {contracts.map(c => (
              <option key={c.symbol} value={c.symbol}>
                {c.symbol}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Direction</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as "long" | "short")}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1.5 text-xs text-slate-200"
          >
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Entry</label>
          <input
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            placeholder={selectedContract?.ltp.toString()}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1.5 text-xs text-slate-200"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Exit</label>
          <input
            type="number"
            value={exitPrice}
            onChange={(e) => setExitPrice(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1.5 text-xs text-slate-200"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Lots</label>
          <input
            type="number"
            min={1}
            max={100}
            value={lots}
            onChange={(e) => setLots(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1.5 text-xs text-slate-200"
          />
        </div>
      </div>

      {calculation && (
        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-500">Points:</span>
            <span className={calculation.points >= 0 ? "text-emerald-400" : "text-red-400"}>
              {calculation.points >= 0 ? "+" : ""}{calculation.points.toFixed(2)} pts
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Gross P&L:</span>
            <span className={calculation.grossPL >= 0 ? "text-emerald-400" : "text-red-400"}>
              ₹{calculation.grossPL.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Charges:</span>
            <span className="text-red-400">-₹{calculation.totalCharges.toFixed(0)}</span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-slate-700/50">
            <span className="text-slate-400 font-medium">Net P&L:</span>
            <span className={`font-bold ${calculation.netPL >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              ₹{calculation.netPL.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-500">ROI on Margin:</span>
            <span className={calculation.roiOnMargin >= 0 ? "text-emerald-400" : "text-red-400"}>
              {calculation.roiOnMargin >= 0 ? "+" : ""}{calculation.roiOnMargin.toFixed(2)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function MCXCommodityDashboard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['commodities'];

  const [activeCategory, setActiveCategory] = useState<CommodityCategory>("bullion");
  const [selectedChainCommodity, setSelectedChainCommodity] = useState<string>("");

  // All hooks before early returns
  const allContracts = useMemo(() => {
    if (!data?.commodities) return [];
    return [
      ...data.commodities.bullion,
      ...data.commodities.baseMetals,
      ...data.commodities.energy,
    ];
  }, [data?.commodities]);

  const categoryCounts = useMemo(() => ({
    bullion: data?.commodities?.bullion?.length || 0,
    baseMetals: data?.commodities?.baseMetals?.length || 0,
    energy: data?.commodities?.energy?.length || 0,
  }), [data?.commodities]);

  const activeContracts = useMemo(() => {
    if (!data?.commodities) return [];
    return data.commodities[activeCategory] || [];
  }, [data?.commodities, activeCategory]);

  // Loading state
  if (isLoading) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              MCX Commodity Dashboard
            </CardTitle>
          <CardDescription>Loading market data...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-full mb-4" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>MCX Commodity Dashboard</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // No data state
  if (!data) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>MCX Commodity Dashboard</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              MCX Commodity Dashboard
              <MarketStatusBadge status={data.marketStatus} />
            </CardTitle>
            <CardDescription>
              Live futures prices & analysis • Last updated: {data.asOf}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500">USD/INR</div>
            <div className="text-sm font-bold text-slate-200">{data.usdinr.toFixed(2)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Category Tabs */}
        <div className="flex gap-2">
          <CategoryTab
            id="bullion"
            label="Bullion"
            count={categoryCounts.bullion}
            active={activeCategory === "bullion"}
            onClick={() => setActiveCategory("bullion")}
          />
          <CategoryTab
            id="baseMetals"
            label="Base Metals"
            count={categoryCounts.baseMetals}
            active={activeCategory === "baseMetals"}
            onClick={() => setActiveCategory("baseMetals")}
          />
          <CategoryTab
            id="energy"
            label="Energy"
            count={categoryCounts.energy}
            active={activeCategory === "energy"}
            onClick={() => setActiveCategory("energy")}
          />
        </div>

        {/* Contract Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeContracts.map((contract) => (
            <ContractCard key={contract.symbol} contract={contract} />
          ))}
        </div>

        {/* Global Benchmarks */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-slate-400">Global Benchmarks</div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {data.globalBenchmarks.map((benchmark) => (
              <BenchmarkCard key={benchmark.id} benchmark={benchmark} usdinr={data.usdinr} />
            ))}
          </div>
        </div>

        {/* Calculators Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <MarginCalculator contracts={allContracts} />
          <PLCalculator contracts={allContracts} />
        </div>

        {/* Contract Chain */}
        <div className="bg-slate-800/20 rounded-lg p-3 border border-slate-700/30">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-slate-300">
              Contract Chain: {data.contractChain.commodity}
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className={`font-medium ${
                data.contractChain.structure === "contango" ? "text-amber-400" :
                data.contractChain.structure === "backwardation" ? "text-blue-400" : "text-slate-400"
              }`}>
                {data.contractChain.structure.charAt(0).toUpperCase() + data.contractChain.structure.slice(1)}
              </span>
              <span className="text-slate-500">
                Carry: {data.contractChain.annualizedCarry.toFixed(1)}% p.a.
              </span>
              <span className="text-slate-500">
                Roll: {data.contractChain.rollDays}d
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] text-slate-500 border-b border-slate-700/50">
                  <th className="text-left py-2 px-2 font-medium">Contract</th>
                  <th className="text-right py-2 px-2 font-medium">LTP</th>
                  <th className="text-right py-2 px-2 font-medium">Change</th>
                  <th className="text-right py-2 px-2 font-medium">OI</th>
                  <th className="text-right py-2 px-2 font-medium">Volume</th>
                  <th className="text-right py-2 px-2 font-medium">Expiry</th>
                </tr>
              </thead>
              <tbody>
                {data.contractChain.contracts.map((contract) => (
                  <ContractChainRow 
                    key={contract.month} 
                    contract={contract} 
                    isActive={contract.isNearMonth}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Spread Analyzer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Calendar Spreads */}
          <div className="bg-slate-800/20 rounded-lg p-3 border border-slate-700/30">
            <div className="text-xs font-medium text-slate-300 mb-3">Calendar Spreads</div>
            
            {data.spreads.calendarSpreads.map((spread) => (
              <div key={spread.id} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-slate-300">
                    {spread.commodity} {spread.nearMonth} - {spread.farMonth}
                  </span>
                  <SpreadSignalBadge signal={spread.signal} />
                </div>
                <div className="flex items-center justify-between text-[10px] mb-2">
                  <span className="text-slate-400">
                    Current: <span className="text-slate-200">₹{spread.currentSpread}</span>
                  </span>
                  <span className="text-slate-500">
                    Mean: ₹{spread.mean30D} | Z: {spread.zScore.toFixed(2)}
                  </span>
                </div>
                
                {/* Mini sparkline */}
                <div className="h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spread.spreadHistory.slice(-15)}>
                      <Line 
                        type="monotone" 
                        dataKey="spread" 
                        stroke="#f59e0b" 
                        strokeWidth={1.5}
                        dot={false}
                      />
                      <ReferenceLine y={spread.mean30D} stroke="#64748b" strokeDasharray="2 2" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>

          {/* Inter-Commodity Ratios */}
          <div className="bg-slate-800/20 rounded-lg p-3 border border-slate-700/30">
            <div className="text-xs font-medium text-slate-300 mb-3">Inter-Commodity Ratios</div>
            
            {data.spreads.interCommodityRatios.map((ratio) => (
              <div key={ratio.id} className="mb-3 last:mb-0 pb-3 border-b border-slate-700/30 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-slate-300">{ratio.name}</span>
                  <RatioInterpretation interpretation={ratio.interpretation} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-slate-100">{ratio.currentRatio.toFixed(1)}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-[9px] text-slate-500 mb-1">
                      <span>Avg: {ratio.avgRatio.toFixed(1)}</span>
                      <span>{ratio.percentile}th %ile</span>
                    </div>
                    <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          ratio.interpretation === "high" ? "bg-amber-500" :
                          ratio.interpretation === "low" ? "bg-blue-500" : "bg-slate-500"
                        }`}
                        style={{ width: `${ratio.percentile}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-[9px] text-slate-500 mt-1">{ratio.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <InterpretationFooter variant="info">
          {data.insights.join(" ")}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
