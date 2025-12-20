// ═══════════════════════════════════════════════════════════════════════════
// NSE CURRENCY DASHBOARD
// Comprehensive currency derivatives dashboard for INR & cross-currency pairs
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from "react";
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
  BarChart,
  Bar,
  Cell,
} from "recharts";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type PairCategory = "inr" | "cross";

interface CurrencyContract {
  pair: string;
  displayName: string;
  category: PairCategory;
  lotSize: number;
  lotUnit: string;
  tickSize: number;
  tickValue: number;
  spotRate: number;
  futuresPrice: number;
  change: number;
  changePercent: number;
  bid: number;
  ask: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  openInterest: number;
  oiChange: number;
  oiChangePercent: number;
  spanMargin: number;
  elmRate: number;
  totalMargin: number;
  expiryDate: string;
  daysToExpiry: number;
  premiumToSpot: number;
  quoteCurrency?: string;
  conversionRate?: number;
}

interface ContractMonth {
  month: string;
  monthLabel: string;
  price: number;
  change: number;
  changePercent: number;
  oi: number;
  volume: number;
  expiryDate: string;
  daysToExpiry: number;
  isNearMonth: boolean;
  isWeekly?: boolean;
}

interface OptionsSnapshot {
  pair: string;
  atmStrike: number;
  spotPrice: number;
  iv: number;
  pcr: number;
  maxPain: number;
  totalCEOI: number;
  totalPEOI: number;
  topStrikes: Array<{
    strike: number;
    ceOI: number;
    peOI: number;
    ceLTP: number;
    peLTP: number;
  }>;
}

interface CalendarSpread {
  id: string;
  pair: string;
  nearMonth: string;
  farMonth: string;
  currentSpread: number;
  spreadHistory: Array<{ date: string; spread: number }>;
  mean30D: number;
  stdDev: number;
  zScore: number;
  signal: "long_spread" | "short_spread" | "neutral";
}

interface TechnicalData {
  pair: string;
  sma20: number;
  sma50: number;
  sma200: number;
  rsi14: number;
  trend: "bullish" | "bearish" | "sideways";
  support: number[];
  resistance: number[];
}

export interface CurrencyDashboardData {
  asOf: string;
  marketStatus: "open" | "closed" | "pre-open";
  tradingHours: { start: string; end: string };
  rbiReferenceTime: string;
  referenceRates: {
    usdinr: number;
    eurinr: number;
    gbpinr: number;
    jpyinr: number;
  };
  inrPairs: CurrencyContract[];
  crossPairs: CurrencyContract[];
  contractChain: {
    pair: string;
    contracts: ContractMonth[];
  };
  optionsSnapshot: OptionsSnapshot;
  technicals: TechnicalData[];
  spreads: CalendarSpread[];
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

export function getNSECurrencyDashboardOutput(data: CurrencyDashboardData): CardOutput {
  const { asOf, marketStatus, referenceRates, inrPairs, crossPairs, optionsSnapshot, insights } = data;
  
  const allPairs = [...inrPairs, ...crossPairs];
  const gainers = allPairs.filter(p => p.changePercent > 0);
  const losers = allPairs.filter(p => p.changePercent < 0);
  const usdinrPair = inrPairs.find(p => p.pair === "USDINR") || inrPairs[0];
  const avgChange = allPairs.reduce((sum, p) => sum + p.changePercent, 0) / allPairs.length;
  
  // INR strengthening (USD down) = bullish for importers, INR weakening = bearish
  const sentiment = usdinrPair && usdinrPair.changePercent < -0.2 ? "bullish" : usdinrPair && usdinrPair.changePercent > 0.2 ? "bearish" : "neutral";
  const signalStrength = Math.abs(usdinrPair?.changePercent || 0) > 0.5 ? 4 : 3;
  
  const keyMetrics: MetricValue[] = [
    createMetric("USD/INR Spot", "cd_usdinr", referenceRates.usdinr, "neutral", 
      { format: "currency", priority: 1, unit: "₹" }),
    createMetric("EUR/INR", "cd_eurinr", referenceRates.eurinr, "neutral", 
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("GBP/INR", "cd_gbpinr", referenceRates.gbpinr, "neutral", 
      { format: "currency", priority: 2, unit: "₹" }),
    createMetric("JPY/INR", "cd_jpyinr", referenceRates.jpyinr, "neutral", 
      { format: "currency", priority: 3, unit: "₹" }),
  ];
  
  if (usdinrPair) {
    keyMetrics.push(
      createMetric("USD/INR Change", "cd_usdinr_chg", usdinrPair.changePercent, 
        usdinrPair.changePercent < 0 ? "good" : usdinrPair.changePercent > 0 ? "poor" : "neutral",
        { format: "percent", priority: 1 }),
      createMetric("USD/INR Futures", "cd_usdinr_fut", usdinrPair.futuresPrice, "neutral", 
        { format: "currency", priority: 1, unit: "₹" }),
      createMetric("Premium to Spot", "cd_premium", usdinrPair.premiumToSpot, "neutral", 
        { format: "percent", priority: 2 })
    );
  }
  
  if (optionsSnapshot) {
    keyMetrics.push(
      createMetric("Options PCR", "cd_pcr", optionsSnapshot.pcr, 
        optionsSnapshot.pcr > 1 ? "good" : "fair",
        { format: "ratio", priority: 2 }),
      createMetric("Max Pain", "cd_maxpain", optionsSnapshot.maxPain, "neutral", 
        { format: "currency", priority: 2, unit: "₹" })
    );
  }
  
  const cardInsights: Insight[] = [];
  
  // INR movement
  if (usdinrPair) {
    if (usdinrPair.changePercent < -0.2) {
      cardInsights.push(createInsight("strength", `INR strengthening: USD/INR ${usdinrPair.changePercent.toFixed(2)}%`, 1, ["cd_usdinr_chg"]));
    } else if (usdinrPair.changePercent > 0.2) {
      cardInsights.push(createInsight("weakness", `INR weakening: USD/INR +${usdinrPair.changePercent.toFixed(2)}%`, 1, ["cd_usdinr_chg"]));
    }
  }
  
  // Market status
  cardInsights.push(createInsight("observation", `Currency market ${marketStatus}: ${allPairs.length} pairs active`, 2));
  
  // Dashboard insights
  insights.slice(0, 2).forEach(i => {
    cardInsights.push(createInsight("observation", i, 3));
  });
  
  const headline = `Currency: USD/INR ${referenceRates.usdinr.toFixed(2)} (${usdinrPair ? (usdinrPair.changePercent >= 0 ? "+" : "") + usdinrPair.changePercent.toFixed(2) + "%" : "N/A"})`;
  
  return {
    cardId: "nse-currency-dashboard",
    cardCategory: "derivatives",
    symbol: "CURRENCY",
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights: cardInsights,
    suggestedCards: ["macro-pulse", "mcx-commodity-dashboard"],
    tags: ["currency", "forex", marketStatus, sentiment],
    scoreContribution: {
      category: "momentum",
      score: 50 - (usdinrPair?.changePercent || 0) * 20, // INR strengthening = higher score
      weight: 0.05,
    },
  };
}

interface Props {
  data?: CurrencyDashboardData;
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
  onClick,
}: {
  id: PairCategory;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      active
        ? "bg-blue-600 text-white"
        : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
    }`}
  >
    {label}
    <span className={`ml-2 text-xs ${active ? "text-blue-200" : "text-slate-500"}`}>
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

const CurrencyPairCard = ({ contract, isINR }: { contract: CurrencyContract; isINR: boolean }) => {
  const isPositive = contract.change >= 0;
  const spread = ((contract.ask - contract.bid) * 10000).toFixed(1);

  return (
    <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50 hover:border-slate-600/50 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-100">{contract.pair}</span>
            <Badge variant="outline" className="text-[9px] py-0 h-4 border-slate-600 text-slate-400">
              {contract.daysToExpiry}d
            </Badge>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {contract.lotSize.toLocaleString()} {contract.lotUnit}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-slate-100">
            {isINR ? "₹" : ""}{contract.futuresPrice.toFixed(4)}
          </div>
          <div className={`text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
            {isPositive ? "▲" : "▼"} {Math.abs(contract.change).toFixed(4)} ({contract.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Spot & Spread */}
      <div className="grid grid-cols-3 gap-2 text-[10px] mb-2">
        <div>
          <span className="text-slate-500">Spot:</span>
          <span className="text-slate-300 ml-1">{contract.spotRate.toFixed(4)}</span>
        </div>
        <div>
          <span className="text-slate-500">Spread:</span>
          <span className="text-slate-300 ml-1">{spread} pips</span>
        </div>
        <div>
          <span className="text-slate-500">Prem:</span>
          <span className={`ml-1 ${(contract.premiumToSpot ?? 0) > 0 ? "text-amber-400" : "text-blue-400"}`}>
            {(contract.premiumToSpot ?? 0) > 0 ? "+" : ""}{(contract.premiumToSpot ?? 0).toFixed(4)}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2 text-[10px] mb-2">
        <div>
          <span className="text-slate-500">H:</span>
          <span className="text-slate-300 ml-1">{contract.dayHigh.toFixed(4)}</span>
        </div>
        <div>
          <span className="text-slate-500">L:</span>
          <span className="text-slate-300 ml-1">{contract.dayLow.toFixed(4)}</span>
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
          <span className="text-blue-400 ml-1 font-medium">
            ₹{contract.totalMargin.toLocaleString("en-IN")}
          </span>
        </div>
        <div>
          <span className="text-slate-500">Tick:</span>
          <span className="text-slate-300 ml-1">₹{contract.tickValue.toFixed(2)}</span>
        </div>
        <div className={`text-[9px] ${contract.oiChange > 0 ? "text-emerald-400" : "text-red-400"}`}>
          OI {contract.oiChange > 0 ? "+" : ""}{contract.oiChangePercent.toFixed(1)}%
        </div>
      </div>

      {/* Cross currency conversion info */}
      {!isINR && contract.conversionRate && (
        <div className="mt-2 pt-2 border-t border-slate-700/50 text-[10px]">
          <span className="text-slate-500">INR Conv:</span>
          <span className="text-slate-300 ml-1">
            {contract.quoteCurrency === "JPY" ? "JPY/INR" : "USD/INR"} @ {contract.conversionRate.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
};

const ReferenceRateCard = ({ rates }: { rates: CurrencyDashboardData["referenceRates"] }) => (
  <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
    <div className="text-xs font-medium text-slate-300 mb-2 flex items-center gap-2">
      RBI Reference Rates
      <span className="text-[9px] text-slate-500">(FBIL 12:30 PM)</span>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {[
        { pair: "USD/INR", rate: rates.usdinr },
        { pair: "EUR/INR", rate: rates.eurinr },
        { pair: "GBP/INR", rate: rates.gbpinr },
        { pair: "JPY/INR", rate: rates.jpyinr, note: "/100" },
      ].map((item) => (
        <div key={item.pair} className="text-center">
          <div className="text-[10px] text-slate-500">{item.pair}{item.note || ""}</div>
          <div className="text-sm font-bold text-slate-200">{item.rate.toFixed(4)}</div>
        </div>
      ))}
    </div>
  </div>
);

const ContractChainRow = ({ contract }: { contract: ContractMonth }) => {
  const isPositive = contract.change >= 0;

  return (
    <tr className={`border-b border-slate-700/30 ${contract.isNearMonth ? "bg-blue-500/10" : ""}`}>
      <td className="py-2 px-2 text-xs">
        <span className="text-slate-200">{contract.monthLabel}</span>
        {contract.isNearMonth && (
          <span className="ml-2 text-[9px] text-blue-400">● Active</span>
        )}
        {contract.isWeekly && (
          <span className="ml-1 text-[9px] text-amber-400">W</span>
        )}
      </td>
      <td className="py-2 px-2 text-xs text-right text-slate-200">
        {contract.price.toFixed(4)}
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

const OptionsSnapshotPanel = ({ options }: { options: OptionsSnapshot }) => {
  const maxOI = Math.max(...options.topStrikes.map((s) => Math.max(s.ceOI, s.peOI)));

  return (
    <div className="bg-slate-800/20 rounded-lg p-3 border border-slate-700/30">
      <div className="text-xs font-medium text-slate-300 mb-3">
        {options.pair} Options Snapshot
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-2 mb-3 text-[10px]">
        <div className="text-center p-2 bg-slate-800/40 rounded">
          <div className="text-slate-500">ATM</div>
          <div className="text-sm font-bold text-slate-200">{options.atmStrike.toFixed(2)}</div>
        </div>
        <div className="text-center p-2 bg-slate-800/40 rounded">
          <div className="text-slate-500">IV</div>
          <div className="text-sm font-bold text-amber-400">{options.iv.toFixed(1)}%</div>
        </div>
        <div className="text-center p-2 bg-slate-800/40 rounded">
          <div className="text-slate-500">PCR</div>
          <div className={`text-sm font-bold ${options.pcr > 1 ? "text-emerald-400" : "text-red-400"}`}>
            {options.pcr.toFixed(2)}
          </div>
        </div>
        <div className="text-center p-2 bg-slate-800/40 rounded">
          <div className="text-slate-500">Max Pain</div>
          <div className="text-sm font-bold text-blue-400">{options.maxPain.toFixed(2)}</div>
        </div>
      </div>

      {/* OI Distribution Chart */}
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={options.topStrikes} layout="vertical">
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="strike"
              tick={{ fontSize: 9, fill: "#94a3b8" }}
              width={50}
              tickFormatter={(v) => v.toFixed(2)}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
              labelStyle={{ color: "#f1f5f9" }}
            />
            <Bar dataKey="ceOI" fill="#22c55e" name="CE OI" />
            <Bar dataKey="peOI" fill="#ef4444" name="PE OI" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between text-[9px] text-slate-500 mt-2">
        <span>Total CE OI: {(options.totalCEOI / 100000).toFixed(1)}L</span>
        <span>Total PE OI: {(options.totalPEOI / 100000).toFixed(1)}L</span>
      </div>
    </div>
  );
};

const TechnicalPanel = ({ technicals }: { technicals: TechnicalData }) => {
  const trendColor = {
    bullish: "text-emerald-400",
    bearish: "text-red-400",
    sideways: "text-amber-400",
  }[technicals.trend];

  const trendIcon = {
    bullish: "↑",
    bearish: "↓",
    sideways: "→",
  }[technicals.trend];

  return (
    <div className="bg-slate-800/20 rounded-lg p-3 border border-slate-700/30">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-medium text-slate-300">{technicals.pair} Technicals</div>
        <span className={`text-xs font-medium ${trendColor}`}>
          {trendIcon} {technicals.trend.charAt(0).toUpperCase() + technicals.trend.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-[10px]">
        {/* Moving Averages */}
        <div className="space-y-1">
          <div className="text-slate-500 font-medium mb-1">Moving Averages</div>
          <div className="flex justify-between">
            <span className="text-slate-400">SMA 20:</span>
            <span className="text-slate-200">{technicals.sma20.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">SMA 50:</span>
            <span className="text-slate-200">{technicals.sma50.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">SMA 200:</span>
            <span className="text-slate-200">{technicals.sma200.toFixed(4)}</span>
          </div>
        </div>

        {/* RSI & Levels */}
        <div className="space-y-1">
          <div className="text-slate-500 font-medium mb-1">Momentum</div>
          <div className="flex justify-between">
            <span className="text-slate-400">RSI (14):</span>
            <span className={`${
              technicals.rsi14 > 70 ? "text-red-400" :
              technicals.rsi14 < 30 ? "text-emerald-400" : "text-slate-200"
            }`}>
              {technicals.rsi14.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Support:</span>
            <span className="text-emerald-400">{technicals.support[0]?.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Resistance:</span>
            <span className="text-red-400">{technicals.resistance[0]?.toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
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

// ═══════════════════════════════════════════════════════════════════════════
// CALCULATORS
// ═══════════════════════════════════════════════════════════════════════════

const MarginCalculator = ({ contracts }: { contracts: CurrencyContract[] }) => {
  const [selectedPair, setSelectedPair] = useState(contracts[0]?.pair || "");
  const [lots, setLots] = useState(1);
  const [orderType, setOrderType] = useState<"NRML" | "MIS">("NRML");

  React.useEffect(() => {
    if (contracts.length > 0 && !selectedPair) {
      setSelectedPair(contracts[0].pair);
    }
  }, [contracts, selectedPair]);

  const selectedContract = contracts.find((c) => c.pair === selectedPair);

  const calculation = useMemo(() => {
    if (!selectedContract) return null;

    const misMultiplier = orderType === "MIS" ? 0.5 : 1;
    const spanMargin = selectedContract.spanMargin * lots * misMultiplier;
    const elm = selectedContract.spanMargin * selectedContract.elmRate * lots * misMultiplier;
    const totalMargin = spanMargin + elm;
    const contractValue = selectedContract.futuresPrice * selectedContract.lotSize * lots;

    return {
      contractValue,
      spanMargin,
      elm,
      totalMargin,
      tickValue: selectedContract.tickValue * lots,
      tickSize: selectedContract.tickSize,
    };
  }, [selectedContract, lots, orderType]);

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
          <label className="text-[10px] text-slate-500 block mb-1">Pair</label>
          <select
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1.5 text-xs text-slate-200"
          >
            {contracts.map((c) => (
              <option key={c.pair} value={c.pair}>
                {c.pair}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Lots</label>
          <input
            type="number"
            min={1}
            max={1000}
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
            <span className="text-slate-500">ELM ({(selectedContract?.elmRate || 0) * 100}%):</span>
            <span className="text-slate-300">₹{calculation.elm.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-slate-700/50">
            <span className="text-slate-400 font-medium">Total Margin:</span>
            <span className="text-blue-400 font-bold">₹{calculation.totalMargin.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between pt-1.5 text-[10px]">
            <span className="text-slate-500">Tick Value:</span>
            <span className="text-slate-400">₹{calculation.tickValue.toFixed(2)} per {calculation.tickSize} move</span>
          </div>
        </div>
      )}
    </div>
  );
};

const PLCalculator = ({
  contracts,
  referenceRates,
}: {
  contracts: CurrencyContract[];
  referenceRates: CurrencyDashboardData["referenceRates"];
}) => {
  const [selectedPair, setSelectedPair] = useState(contracts[0]?.pair || "");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [lots, setLots] = useState(1);
  const [direction, setDirection] = useState<"long" | "short">("long");

  React.useEffect(() => {
    if (contracts.length > 0 && !selectedPair) {
      setSelectedPair(contracts[0].pair);
    }
  }, [contracts, selectedPair]);

  const selectedContract = contracts.find((c) => c.pair === selectedPair);

  const calculation = useMemo(() => {
    if (!selectedContract || !entryPrice || !exitPrice) return null;

    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    if (isNaN(entry) || isNaN(exit)) return null;

    const pips = direction === "long" ? exit - entry : entry - exit;
    const pipValue = selectedContract.tickValue / selectedContract.tickSize;
    let grossPL = pips * pipValue * lots;

    // For cross currency, convert to INR
    let conversionNote = "";
    if (selectedContract.category === "cross") {
      const convRate = selectedContract.quoteCurrency === "JPY" 
        ? referenceRates.jpyinr / 100 
        : referenceRates.usdinr;
      grossPL = grossPL * convRate;
      conversionNote = `Converted @ ${selectedContract.quoteCurrency}/INR: ${convRate.toFixed(4)}`;
    }

    // Charges (approximate)
    const contractValue = selectedContract.futuresPrice * selectedContract.lotSize * lots * 
      (selectedContract.category === "cross" ? (selectedContract.conversionRate || 1) : 1);
    const brokerage = 40;
    const exchangeFees = contractValue * 0.0000325;
    const sebiCharges = contractValue * 0.000001;
    const gst = (brokerage + exchangeFees) * 0.18;
    const stampDuty = contractValue * 0.00003;

    const totalCharges = brokerage + exchangeFees + sebiCharges + gst + stampDuty;
    const netPL = grossPL - totalCharges;

    return {
      pips,
      grossPL,
      totalCharges,
      netPL,
      conversionNote,
    };
  }, [selectedContract, entryPrice, exitPrice, lots, direction, referenceRates]);

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
          <label className="text-[10px] text-slate-500 block mb-1">Pair</label>
          <select
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1.5 text-xs text-slate-200"
          >
            {contracts.map((c) => (
              <option key={c.pair} value={c.pair}>
                {c.pair}
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
            step="0.0001"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            placeholder={selectedContract?.futuresPrice.toFixed(4)}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1.5 text-xs text-slate-200"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Exit</label>
          <input
            type="number"
            step="0.0001"
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
            max={1000}
            value={lots}
            onChange={(e) => setLots(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1.5 text-xs text-slate-200"
          />
        </div>
      </div>

      {calculation && (
        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-500">Pips:</span>
            <span className={calculation.pips >= 0 ? "text-emerald-400" : "text-red-400"}>
              {calculation.pips >= 0 ? "+" : ""}{calculation.pips.toFixed(4)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Gross P&L (INR):</span>
            <span className={calculation.grossPL >= 0 ? "text-emerald-400" : "text-red-400"}>
              ₹{calculation.grossPL.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </span>
          </div>
          {calculation.conversionNote && (
            <div className="text-[9px] text-slate-500">{calculation.conversionNote}</div>
          )}
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
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function NSECurrencyDashboard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['derivatives'];

  const [activeCategory, setActiveCategory] = useState<PairCategory>("inr");

  // All hooks before early returns
  const allContracts = useMemo(() => {
    if (!data) return [];
    return [...data.inrPairs, ...data.crossPairs];
  }, [data]);

  const categoryCounts = useMemo(
    () => ({
      inr: data?.inrPairs?.length || 0,
      cross: data?.crossPairs?.length || 0,
    }),
    [data]
  );

  const activeContracts = useMemo(() => {
    if (!data) return [];
    return activeCategory === "inr" ? data.inrPairs : data.crossPairs;
  }, [data, activeCategory]);

  const activeTechnicals = useMemo(() => {
    if (!data?.technicals) return null;
    const primaryPair = activeCategory === "inr" ? "USDINR" : "EURUSD";
    return data.technicals.find((t) => t.pair === primaryPair) || data.technicals[0];
  }, [data, activeCategory]);

  // Loading state
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              NSE Currency Dashboard
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
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>NSE Currency Dashboard</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // No data state
  if (!data) {
    return (
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>NSE Currency Dashboard</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              NSE Currency Dashboard
              <MarketStatusBadge status={data.marketStatus} />
            </CardTitle>
            <CardDescription>
              Currency derivatives • {data.tradingHours.start} - {data.tradingHours.end} IST • Updated: {data.asOf}
            </CardDescription>
          </div>
          <div className="text-right text-[10px] text-slate-500">
            RBI Ref: {data.rbiReferenceTime}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* RBI Reference Rates */}
        <ReferenceRateCard rates={data.referenceRates} />

        {/* Category Tabs */}
        <div className="flex gap-2">
          <CategoryTab
            id="inr"
            label="INR Pairs"
            count={categoryCounts.inr}
            active={activeCategory === "inr"}
            onClick={() => setActiveCategory("inr")}
          />
          <CategoryTab
            id="cross"
            label="Cross Currency"
            count={categoryCounts.cross}
            active={activeCategory === "cross"}
            onClick={() => setActiveCategory("cross")}
          />
        </div>

        {/* Currency Pair Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeContracts.map((contract) => (
            <CurrencyPairCard
              key={contract.pair}
              contract={contract}
              isINR={activeCategory === "inr"}
            />
          ))}
        </div>

        {/* Calculators Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <MarginCalculator contracts={allContracts} />
          <PLCalculator contracts={allContracts} referenceRates={data.referenceRates} />
        </div>

        {/* Contract Chain */}
        <div className="bg-slate-800/20 rounded-lg p-3 border border-slate-700/30">
          <div className="text-xs font-medium text-slate-300 mb-3">
            Contract Chain: {data.contractChain.pair}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] text-slate-500 border-b border-slate-700/50">
                  <th className="text-left py-2 px-2 font-medium">Contract</th>
                  <th className="text-right py-2 px-2 font-medium">Price</th>
                  <th className="text-right py-2 px-2 font-medium">Change</th>
                  <th className="text-right py-2 px-2 font-medium">OI</th>
                  <th className="text-right py-2 px-2 font-medium">Volume</th>
                  <th className="text-right py-2 px-2 font-medium">Expiry</th>
                </tr>
              </thead>
              <tbody>
                {data.contractChain.contracts.map((contract) => (
                  <ContractChainRow key={contract.month} contract={contract} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Options & Technicals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <OptionsSnapshotPanel options={data.optionsSnapshot} />
          {activeTechnicals && <TechnicalPanel technicals={activeTechnicals} />}
        </div>

        {/* Calendar Spreads */}
        <div className="bg-slate-800/20 rounded-lg p-3 border border-slate-700/30">
          <div className="text-xs font-medium text-slate-300 mb-3">Calendar Spreads</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.spreads.map((spread) => (
              <div key={spread.id} className="bg-slate-800/40 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-slate-300">
                    {spread.pair} {spread.nearMonth} - {spread.farMonth}
                  </span>
                  <SpreadSignalBadge signal={spread.signal} />
                </div>
                <div className="flex items-center justify-between text-[10px] mb-2">
                  <span className="text-slate-400">
                    Current: <span className="text-slate-200">{spread.currentSpread.toFixed(4)}</span>
                  </span>
                  <span className="text-slate-500">
                    Mean: {spread.mean30D.toFixed(4)} | Z: {spread.zScore.toFixed(2)}
                  </span>
                </div>

                {/* Mini sparkline */}
                <div className="h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spread.spreadHistory.slice(-15)}>
                      <Line
                        type="monotone"
                        dataKey="spread"
                        stroke="#3b82f6"
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
        </div>

        {/* Insights */}
        <InterpretationFooter variant="info">
          {data.insights.join(" ")}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
