// ═══════════════════════════════════════════════════════════════════════════
// STOCK SNAPSHOT CARD - PRIMARY ENTRY POINT
// Default card shown when user types just a ticker symbol
// Provides: Company info, price, day stats, key levels, mini chart
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricTooltip } from "@/components/shared/MetricTooltip";
import { NextSteps } from "@/components/shared/NextSteps";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface StockSnapshotData {
  // Company identification
  symbol: string;
  companyName: string;
  sector: string;
  industry: string;
  exchange: "NSE" | "BSE" | "NSE/BSE";
  logoUrl?: string;
  
  // Current price data
  lastPrice: number;
  change: number;
  changePct: number;
  asOf: string;
  
  // Day statistics
  open: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  avgVolume: number;
  
  // Market cap & fundamentals snapshot
  marketCap: number;        // in Crores
  marketCapCategory: "Large Cap" | "Mid Cap" | "Small Cap";
  pe: number | null;
  eps: number | null;
  dividendYield: number | null;
  
  // Key levels
  high52w: number;
  low52w: number;
  demandZone: number;       // Support
  supplyZone: number;       // Resistance
  
  // Mini intraday chart (1D)
  intradayData: Array<{
    time: string;
    price: number;
    volume: number;
  }>;
  
  // Quick sentiment
  analystRating: "Strong Buy" | "Buy" | "Hold" | "Sell" | "Strong Sell";
  targetPrice: number;
}

interface Props {
  data?: StockSnapshotData;
  isLoading?: boolean;
  error?: string | null;
  onCardSelect?: (cardId: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function formatCurrency(value: number, currency: string = "₹"): string {
  return `${currency}${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatMarketCap(crores: number): string {
  if (crores >= 100000) {
    return `₹${(crores / 100000).toFixed(2)}L Cr`;
  } else if (crores >= 1000) {
    return `₹${(crores / 1000).toFixed(2)}K Cr`;
  }
  return `₹${crores.toFixed(0)} Cr`;
}

function formatVolume(vol: number): string {
  if (vol >= 10000000) return `${(vol / 10000000).toFixed(2)} Cr`;
  if (vol >= 100000) return `${(vol / 100000).toFixed(2)} L`;
  if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
  return vol.toString();
}

function getChangeColor(change: number): string {
  if (change > 0) return "text-emerald-400";
  if (change < 0) return "text-red-400";
  return "text-slate-400";
}

function getRatingBadge(rating: StockSnapshotData["analystRating"]) {
  const variants: Record<string, "success" | "default" | "secondary" | "destructive"> = {
    "Strong Buy": "success",
    "Buy": "success",
    "Hold": "secondary",
    "Sell": "destructive",
    "Strong Sell": "destructive",
  };
  return <Badge variant={variants[rating] || "secondary"}>{rating}</Badge>;
}

function getCapBadge(category: StockSnapshotData["marketCapCategory"]) {
  const colors: Record<string, string> = {
    "Large Cap": "bg-blue-900/50 text-blue-300 border-blue-700",
    "Mid Cap": "bg-purple-900/50 text-purple-300 border-purple-700",
    "Small Cap": "bg-amber-900/50 text-amber-300 border-amber-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs border ${colors[category]}`}>
      {category}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STOCK SNAPSHOT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function StockSnapshotCard({ data, isLoading, error, onCardSelect }: Props) {
  const categoryStyle = CATEGORY_STYLES['overview'];

  const [chartTimeframe, setChartTimeframe] = useState<"1D" | "1W" | "1M">("1D");

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-slate-900 border-slate-800 border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full mb-4" />
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="bg-slate-900 border-slate-800 border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Stock Snapshot
            </CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // No data state
  if (!data) {
    return (
      <Card className="bg-slate-900 border-slate-800 border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Stock Snapshot</CardTitle>
          <CardDescription>Enter a stock symbol to view details</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const {
    symbol,
    companyName,
    sector,
    industry,
    exchange,
    lastPrice,
    change,
    changePct,
    asOf,
    open,
    previousClose,
    dayHigh,
    dayLow,
    volume,
    avgVolume,
    marketCap,
    marketCapCategory,
    pe,
    eps,
    dividendYield,
    high52w,
    low52w,
    demandZone,
    supplyZone,
    intradayData,
    analystRating,
    targetPrice,
  } = data;

  const isUp = change >= 0;
  const priceFromTarget = ((targetPrice - lastPrice) / lastPrice) * 100;
  const position52w = ((lastPrice - low52w) / (high52w - low52w)) * 100;

  // Handler for navigation
  const handleCardSelect = (cardId: string) => {
    if (onCardSelect) {
      onCardSelect(cardId);
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800 border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      {/* ─────────────────────────────────────────────────────────────────────
          HEADER: Company Info + Price
      ───────────────────────────────────────────────────────────────────── */}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            {/* Company Logo Placeholder */}
            <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-400">
              {symbol.slice(0, 2)}
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                {companyName}
                {getCapBadge(marketCapCategory)}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {sector} • {exchange}: {symbol}
              </CardDescription>
            </div>
          </div>
          
          {/* Price Display */}
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-100">
              {formatCurrency(lastPrice)}
            </div>
            <div className={`text-lg font-medium ${getChangeColor(change)}`}>
              {isUp ? "+" : ""}{formatCurrency(change).replace("₹", "")} ({isUp ? "+" : ""}{changePct.toFixed(2)}%)
            </div>
            <div className="text-xs text-slate-500">As of {asOf}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ─────────────────────────────────────────────────────────────────────
            INTRADAY CHART
        ───────────────────────────────────────────────────────────────────── */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Intraday</span>
            <div className="flex gap-1">
              {(["1D", "1W", "1M"] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setChartTimeframe(tf)}
                  className={`px-2 py-0.5 text-xs rounded ${
                    chartTimeframe === tf
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={intradayData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={["dataMin - 5", "dataMax + 5"]} hide />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(value: number) => [formatCurrency(value), "Price"]}
              />
              <ReferenceLine y={previousClose} stroke="#64748b" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isUp ? "#10b981" : "#ef4444"}
                fill="url(#priceGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────
            DAY STATISTICS ROW
        ───────────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-6 gap-2 text-center">
          <div className="bg-slate-800/30 rounded p-2">
            <MetricTooltip metric="open">
              <div className="text-xs text-slate-500">Open</div>
              <div className="text-sm font-medium text-slate-200">{formatCurrency(open)}</div>
            </MetricTooltip>
          </div>
          <div className="bg-slate-800/30 rounded p-2">
            <MetricTooltip metric="previousClose">
              <div className="text-xs text-slate-500">Prev Close</div>
              <div className="text-sm font-medium text-slate-200">{formatCurrency(previousClose)}</div>
            </MetricTooltip>
          </div>
          <div className="bg-slate-800/30 rounded p-2">
            <MetricTooltip metric="dayHigh">
              <div className="text-xs text-slate-500">Day High</div>
              <div className="text-sm font-medium text-emerald-400">{formatCurrency(dayHigh)}</div>
            </MetricTooltip>
          </div>
          <div className="bg-slate-800/30 rounded p-2">
            <MetricTooltip metric="dayLow">
              <div className="text-xs text-slate-500">Day Low</div>
              <div className="text-sm font-medium text-red-400">{formatCurrency(dayLow)}</div>
            </MetricTooltip>
          </div>
          <div className="bg-slate-800/30 rounded p-2">
            <MetricTooltip metric="volume">
              <div className="text-xs text-slate-500">Volume</div>
              <div className="text-sm font-medium text-slate-200">{formatVolume(volume)}</div>
            </MetricTooltip>
          </div>
          <div className="bg-slate-800/30 rounded p-2">
            <MetricTooltip metric="marketCap">
              <div className="text-xs text-slate-500">MCap</div>
              <div className="text-sm font-medium text-slate-200">{formatMarketCap(marketCap)}</div>
            </MetricTooltip>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────
            SUPPLY/DEMAND & KEY LEVELS
        ───────────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4">
          {/* Supply & Demand */}
          <div className="bg-slate-800/30 rounded-lg p-3">
            <div className="text-xs text-slate-500 mb-2">SUPPLY & DEMAND</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <MetricTooltip metric="demandZone">
                  <span className="text-sm text-slate-400">Demand Zone</span>
                </MetricTooltip>
                <span className="text-sm font-medium text-emerald-400">{formatCurrency(demandZone)}</span>
              </div>
              <div className="flex justify-between items-center">
                <MetricTooltip metric="supplyZone">
                  <span className="text-sm text-slate-400">Supply Zone</span>
                </MetricTooltip>
                <span className="text-sm font-medium text-red-400">{formatCurrency(supplyZone)}</span>
              </div>
            </div>
          </div>

          {/* 52-Week Range */}
          <div className="bg-slate-800/30 rounded-lg p-3">
            <div className="text-xs text-slate-500 mb-2">52-WEEK RANGE</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <MetricTooltip metric="high52w">
                  <span className="text-sm text-slate-400">52W High</span>
                </MetricTooltip>
                <span className="text-sm font-medium text-emerald-400">{formatCurrency(high52w)}</span>
              </div>
              <div className="flex justify-between items-center">
                <MetricTooltip metric="low52w">
                  <span className="text-sm text-slate-400">52W Low</span>
                </MetricTooltip>
                <span className="text-sm font-medium text-red-400">{formatCurrency(low52w)}</span>
              </div>
              {/* Position indicator */}
              <div className="mt-2">
                <div className="h-1.5 bg-slate-700 rounded-full relative">
                  <div
                    className="absolute h-3 w-3 bg-blue-500 rounded-full -top-[3px] transform -translate-x-1/2"
                    style={{ left: `${Math.min(Math.max(position52w, 5), 95)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Low</span>
                  <span>{position52w.toFixed(0)}% from low</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────
            QUICK FUNDAMENTALS ROW
        ───────────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-slate-800/30 rounded p-2 text-center">
            <MetricTooltip metric="pe">
              <div className="text-xs text-slate-500">P/E Ratio</div>
              <div className="text-lg font-medium text-slate-200">
                {pe !== null ? pe.toFixed(1) : "N/A"}
              </div>
            </MetricTooltip>
          </div>
          <div className="bg-slate-800/30 rounded p-2 text-center">
            <MetricTooltip metric="eps">
              <div className="text-xs text-slate-500">EPS (TTM)</div>
              <div className="text-lg font-medium text-slate-200">
                {eps !== null ? formatCurrency(eps) : "N/A"}
              </div>
            </MetricTooltip>
          </div>
          <div className="bg-slate-800/30 rounded p-2 text-center">
            <MetricTooltip metric="dividendYield">
              <div className="text-xs text-slate-500">Div Yield</div>
              <div className="text-lg font-medium text-slate-200">
                {dividendYield !== null ? `${dividendYield.toFixed(2)}%` : "N/A"}
              </div>
            </MetricTooltip>
          </div>
          <div className="bg-slate-800/30 rounded p-2 text-center">
            <div className="text-xs text-slate-500">Analyst</div>
            <div className="mt-1">{getRatingBadge(analystRating)}</div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────
            TARGET PRICE BAR
        ───────────────────────────────────────────────────────────────────── */}
        <div className="bg-slate-800/30 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-slate-400">Analyst Target: </span>
              <span className="text-sm font-medium text-slate-200">{formatCurrency(targetPrice)}</span>
            </div>
            <div className={`text-sm font-medium ${priceFromTarget >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {priceFromTarget >= 0 ? "+" : ""}{priceFromTarget.toFixed(1)}% upside
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────
            NEXT STEPS NAVIGATION
        ───────────────────────────────────────────────────────────────────── */}
        <NextSteps
          currentCard="stock-snapshot"
          context={{
            symbol,
            sector,
            marketCapCategory,
            pe: pe ?? undefined,
            analystRating,
          }}
          onCardSelect={handleCardSelect}
          suggestions={[
            {
              cardId: "valuation-summary",
              label: "Analyze Valuation",
              reason: "Deep dive into PE, PB, and intrinsic value",
            },
            {
              cardId: "candlestick-hero",
              label: "Technical View",
              reason: "Charts, patterns, and indicators",
            },
            {
              cardId: "piotroski-score",
              label: "Check Fundamentals",
              reason: "Financial health and quality scores",
            },
            {
              cardId: "shareholding-tracker",
              label: "Ownership Analysis",
              reason: "FII, DII, and promoter holdings",
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CARD OUTPUT (for synthesis engine)
// ═══════════════════════════════════════════════════════════════════════════

import type { CardOutput, MetricValue, Insight, SignalStrength, Sentiment, MetricInterpretation } from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export function getStockSnapshotOutput(data: StockSnapshotData): CardOutput {
  const isUp = data.change >= 0;
  const position52w = ((data.lastPrice - data.low52w) / (data.high52w - data.low52w)) * 100;
  const priceFromTarget = ((data.targetPrice - data.lastPrice) / data.lastPrice) * 100;
  
  // Build key metrics
  const keyMetrics: MetricValue[] = [
    {
      name: "Last Price",
      key: "last_price",
      value: data.lastPrice,
      format: "currency",
      interpretation: isUp ? "bullish" : "bearish",
      priority: 1,
      trend: {
        direction: isUp ? "up" : "down",
        period: "today",
        change: data.changePct,
      },
    },
    {
      name: "Market Cap",
      key: "market_cap",
      value: data.marketCap,
      unit: "Cr",
      format: "number",
      interpretation: "neutral",
      priority: 1,
    },
    {
      name: "P/E Ratio",
      key: "pe_ratio",
      value: data.pe,
      format: "ratio",
      interpretation: (data.pe && data.pe < 15 ? "undervalued" : data.pe && data.pe > 30 ? "overvalued" : "fairly-valued") as MetricInterpretation,
      priority: 2,
    },
    {
      name: "52W Position",
      key: "position_52w",
      value: position52w,
      unit: "%",
      format: "percent",
      interpretation: (position52w > 80 ? "overvalued" : position52w < 20 ? "undervalued" : "neutral") as MetricInterpretation,
      priority: 2,
    },
    {
      name: "Volume",
      key: "volume",
      value: data.volume,
      format: "number",
      interpretation: data.volume > data.avgVolume * 1.5 ? "strong" : "neutral",
      priority: 3,
      benchmark: {
        value: data.avgVolume,
        label: "Avg",
        comparison: data.volume > data.avgVolume ? "above" : "below",
      },
    },
    {
      name: "Dividend Yield",
      key: "dividend_yield",
      value: data.dividendYield,
      unit: "%",
      format: "percent",
      interpretation: data.dividendYield && data.dividendYield > 2 ? "good" : "fair",
      priority: 3,
    },
  ];
  
  // Build insights
  const insights: Insight[] = [
    {
      type: "observation",
      text: `${data.marketCapCategory} stock in ${data.sector} sector`,
      importance: 2,
    },
    {
      type: position52w > 70 ? "risk" : position52w < 30 ? "opportunity" : "observation",
      text: `Trading ${position52w.toFixed(0)}% above 52-week low`,
      importance: 2,
      metrics: ["position_52w"],
    },
    {
      type: priceFromTarget >= 10 ? "opportunity" : priceFromTarget <= -10 ? "risk" : "observation",
      text: `Analyst consensus: ${data.analystRating} with ${priceFromTarget.toFixed(1)}% ${priceFromTarget >= 0 ? "upside" : "downside"} to target`,
      importance: 1,
    },
  ];
  
  // Add volume insight if notable
  if (data.volume > data.avgVolume * 1.5) {
    insights.push({
      type: "observation",
      text: "Volume significantly above average - increased interest",
      importance: 3,
      metrics: ["volume"],
    });
  }
  
  // Add analyst-based insight
  if (data.analystRating === "Strong Buy") {
    insights.push({
      type: "strength",
      text: "Strong analyst consensus supports bullish outlook",
      importance: 2,
    });
  } else if (data.analystRating === "Sell" || data.analystRating === "Strong Sell") {
    insights.push({
      type: "weakness",
      text: "Analyst consensus is negative - review fundamentals",
      importance: 2,
    });
  }
  
  // Determine sentiment
  const sentiment: Sentiment = 
    data.analystRating.includes("Buy") && isUp ? "bullish" :
    data.analystRating.includes("Sell") ? "bearish" :
    isUp ? "neutral" : "mixed";
  
  // Calculate signal strength
  let signalScore = 3;
  if (data.analystRating === "Strong Buy") signalScore++;
  if (data.analystRating === "Strong Sell") signalScore--;
  if (isUp && data.volume > data.avgVolume) signalScore++;
  if (!isUp && data.volume > data.avgVolume) signalScore--;
  
  const headline = `${data.companyName} (${data.symbol}) at ₹${data.lastPrice.toFixed(2)} (${isUp ? "+" : ""}${data.changePct.toFixed(2)}%) - ${data.analystRating}`;
  
  return {
    cardId: "stock-snapshot",
    cardCategory: "overview",
    symbol: data.symbol,
    asOf: data.asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: Math.max(1, Math.min(5, signalScore)) as SignalStrength,
    keyMetrics,
    insights,
    suggestedCards: ["valuation-summary", "candlestick-hero", "piotroski-score", "shareholding-pattern"],
    tags: ["overview", "price", data.marketCapCategory.toLowerCase().replace(" ", "-"), data.sector.toLowerCase()],
    scoreContribution: {
      category: "momentum",
      score: isUp ? 60 + Math.min(20, data.changePct * 5) : 40 - Math.min(20, Math.abs(data.changePct) * 5),
      weight: 0.10,
    },
  };
}
