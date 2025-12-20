import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricStrip } from "@/components/shared/MetricBox";
import { RadialGauge } from "@/components/shared/ScoreGauge";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import { ValuationBadge, ValuationType } from "@/components/ui/status-badges";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
  scoreToSentiment,
  scoreToSignal,
  MetricInterpretation,
} from "@/types/card-output";

import { CATEGORY_STYLES, valueGaugeConfig, getValuationStatus as getValuationLabel } from "@/lib/chartTheme";

export interface ValuationSummaryData {
  symbol: string;
  asOf: string;
  overallScore: number;
  verdict: "Cheap" | "Fair" | "Expensive";
  percentileRank: number;
  multiples: {
    pe: number;
    peMedian: number;
    pb: number;
    pbMedian: number;
    ps: number;
    psMedian: number;
    evEbitda: number;
    evEbitdaMedian: number;
    pegRatio: number;
  };
  radarData: Array<{
    metric: string;
    value: number;
    benchmark: number;
  }>;
  historicalPE: Array<{
    year: string;
    pe: number;
  }>;
  peerComparison: Array<{
    symbol: string;
    pe: number;
    pb: number;
  }>;
  // Optional: fair value for thermometer
  currentPrice?: number;
  fairValue?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// VALUE THERMOMETER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function ValueThermometer({ 
  currentPrice, 
  fairValue, 
  percentile 
}: { 
  currentPrice: number; 
  fairValue: number; 
  percentile: number;
}) {
  const ratio = currentPrice / fairValue;
  const status = getValuationLabel(ratio);
  
  // Position on thermometer (0-100)
  // Ratio 0.5 = 0%, 1.0 = 50%, 1.5+ = 100%
  const position = Math.min(100, Math.max(0, (ratio - 0.5) * 100));
  
  return (
    <div className="relative p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
      <div className="text-[10px] uppercase text-slate-500 font-medium mb-2">Price vs Fair Value</div>
      
      {/* Fair Value marker - ABOVE the bar */}
      <div className="flex justify-center mb-2">
        <div className="flex flex-col items-center">
          <div className="px-2 py-1 bg-slate-700 rounded text-xs font-bold text-white border border-slate-600">
            Fair: ₹{fairValue.toLocaleString()}
          </div>
          <div className="w-0.5 h-3 bg-slate-500" />
        </div>
      </div>
      
      {/* Thermometer Bar */}
      <div className="relative h-8 rounded-full overflow-hidden bg-slate-900">
        {/* Gradient background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, #10b981 0%, #84cc16 25%, #eab308 50%, #f97316 75%, #ef4444 100%)'
          }}
        />
        
        {/* Labels on edges - with better contrast */}
        <div className="absolute inset-0 flex justify-between items-center px-3">
          <span className="text-[9px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">DEEP VALUE</span>
          <span className="text-[9px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">EXPENSIVE</span>
        </div>
        
        {/* Center fair value line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/70 -translate-x-1/2" />
      </div>
      
      {/* Current price indicator */}
      <div 
        className="absolute -translate-x-1/2 transition-all duration-500"
        style={{ left: `calc(${position}% + 16px)`, top: 'calc(100% - 4.5rem)' }}
      >
        {/* Triangle pointer */}
        <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-white mx-auto" />
        {/* Value box */}
        <div className="bg-white text-slate-900 px-2 py-1 rounded text-xs font-bold text-center mt-0.5 shadow-lg">
          <div className="text-[9px] text-slate-500">Current</div>
          <div>₹{currentPrice.toLocaleString()}</div>
        </div>
      </div>
      
      {/* Status and ratio */}
      <div className="flex justify-between items-center mt-16 pt-2 border-t border-slate-700/30">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: status.color }}
          />
          <span className="text-xs font-medium" style={{ color: status.color }}>
            {status.label}
          </span>
        </div>
        <div className="text-xs text-slate-400">
          {ratio < 1 
            ? `${((1 - ratio) * 100).toFixed(0)}% below fair value`
            : ratio > 1 
            ? `${((ratio - 1) * 100).toFixed(0)}% above fair value`
            : 'At fair value'
          }
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getValuationSummaryOutput(data: ValuationSummaryData): CardOutput {
  const { symbol, asOf, overallScore, verdict, percentileRank, multiples, historicalPE, peerComparison } = data;
  
  // Determine interpretations based on comparisons to median
  const peInterp = getValuationInterp(multiples.pe, multiples.peMedian);
  const pbInterp = getValuationInterp(multiples.pb, multiples.pbMedian);
  const psInterp = getValuationInterp(multiples.ps, multiples.psMedian);
  const evInterp = getValuationInterp(multiples.evEbitda, multiples.evEbitdaMedian);
  const pegInterp: MetricInterpretation = multiples.pegRatio < 1 ? "undervalued" : multiples.pegRatio > 2 ? "overvalued" : "fairly-valued";
  
  // Build key metrics
  const keyMetrics: MetricValue[] = [
    createMetric("P/E Ratio", "pe_ratio", multiples.pe, peInterp, {
      format: "ratio",
      unit: "x",
      priority: 1,
      benchmark: { value: multiples.peMedian, label: "5Y Median", comparison: multiples.pe > multiples.peMedian ? "above" : "below" },
    }),
    createMetric("P/B Ratio", "pb_ratio", multiples.pb, pbInterp, {
      format: "ratio",
      unit: "x",
      priority: 1,
      benchmark: { value: multiples.pbMedian, label: "5Y Median", comparison: multiples.pb > multiples.pbMedian ? "above" : "below" },
    }),
    createMetric("P/S Ratio", "ps_ratio", multiples.ps, psInterp, {
      format: "ratio",
      unit: "x",
      priority: 2,
      benchmark: { value: multiples.psMedian, label: "5Y Median", comparison: multiples.ps > multiples.psMedian ? "above" : "below" },
    }),
    createMetric("EV/EBITDA", "ev_ebitda", multiples.evEbitda, evInterp, {
      format: "ratio",
      unit: "x",
      priority: 2,
      benchmark: { value: multiples.evEbitdaMedian, label: "5Y Median", comparison: multiples.evEbitda > multiples.evEbitdaMedian ? "above" : "below" },
    }),
    createMetric("PEG Ratio", "peg_ratio", multiples.pegRatio, pegInterp, {
      format: "ratio",
      unit: "x",
      priority: 1,
    }),
    createMetric("Valuation Percentile", "valuation_percentile", percentileRank, 
      percentileRank < 30 ? "undervalued" : percentileRank > 70 ? "overvalued" : "fairly-valued", {
      format: "number",
      unit: "th",
      priority: 2,
    }),
  ];
  
  // Build insights
  const insights: Insight[] = [];
  
  // Verdict insight
  if (verdict === "Cheap") {
    insights.push(createInsight("strength", `${symbol} is trading at attractive valuations relative to historical levels`, 1, ["pe_ratio", "pb_ratio"]));
  } else if (verdict === "Expensive") {
    insights.push(createInsight("risk", `${symbol} appears expensive on multiple valuation metrics`, 1, ["pe_ratio", "pb_ratio"]));
  } else {
    insights.push(createInsight("observation", `${symbol} is trading near fair value based on historical comparisons`, 2));
  }
  
  // PE vs median insight
  const pePremium = ((multiples.pe - multiples.peMedian) / multiples.peMedian) * 100;
  if (Math.abs(pePremium) > 20) {
    insights.push(createInsight(
      pePremium > 0 ? "risk" : "opportunity",
      `Trading at ${Math.abs(pePremium).toFixed(0)}% ${pePremium > 0 ? "premium" : "discount"} to 5-year median P/E`,
      2,
      ["pe_ratio"]
    ));
  }
  
  // PEG insight
  if (multiples.pegRatio < 1) {
    insights.push(createInsight("strength", "PEG ratio below 1 suggests growth is underpriced", 2, ["peg_ratio"]));
  } else if (multiples.pegRatio > 2) {
    insights.push(createInsight("weakness", "High PEG ratio indicates growth premium may be excessive", 2, ["peg_ratio"]));
  }
  
  // Peer comparison insight
  if (peerComparison.length > 0) {
    const avgPeerPE = peerComparison.reduce((sum, p) => sum + p.pe, 0) / peerComparison.length;
    const vsPeers = ((multiples.pe - avgPeerPE) / avgPeerPE) * 100;
    if (Math.abs(vsPeers) > 15) {
      insights.push(createInsight(
        vsPeers > 0 ? "observation" : "opportunity",
        `P/E is ${Math.abs(vsPeers).toFixed(0)}% ${vsPeers > 0 ? "higher" : "lower"} than peer average`,
        3,
        ["pe_ratio"]
      ));
    }
  }
  
  // Suggested next cards
  const suggestedCards = verdict === "Cheap" 
    ? ["piotroski-score", "dcf-valuation", "growth-summary"]
    : verdict === "Expensive"
    ? ["growth-summary", "peer-comparison", "earnings-quality"]
    : ["fair-value-forecaster", "intrinsic-value-range"];
  
  // Build headline
  const headline = verdict === "Cheap"
    ? `${symbol} appears undervalued with a score of ${overallScore}/100`
    : verdict === "Expensive"
    ? `${symbol} is trading at premium valuations (score: ${overallScore}/100)`
    : `${symbol} is fairly valued at current levels (score: ${overallScore}/100)`;
  
  return {
    cardId: "valuation-summary",
    cardCategory: "value",
    symbol,
    asOf,
    headline,
    sentiment: verdict === "Cheap" ? "bullish" : verdict === "Expensive" ? "bearish" : "neutral",
    confidence: "high",
    signalStrength: scoreToSignal(overallScore),
    keyMetrics,
    insights,
    primaryChart: {
      type: "radar",
      title: "Relative Valuation",
      data: data.radarData,
    },
    secondaryCharts: [{
      type: "bar",
      title: "Historical P/E",
      data: historicalPE,
      xKey: "year",
      yKey: "pe",
    }],
    suggestedCards,
    tags: ["valuation", "multiples", "pe", "pb", verdict.toLowerCase()],
    scoreContribution: {
      category: "valuation",
      score: verdict === "Cheap" ? overallScore : verdict === "Expensive" ? -overallScore + 100 : 50,
      weight: 0.25,
    },
  };
}

// Helper function for valuation interpretation
function getValuationInterp(value: number, median: number): MetricInterpretation {
  const ratio = value / median;
  if (ratio < 0.8) return "undervalued";
  if (ratio > 1.2) return "overvalued";
  return "fairly-valued";
}

interface Props {
  data?: ValuationSummaryData;
  isLoading?: boolean;
  error?: string | null;
}

function getValuationStatus(verdict: ValuationSummaryData["verdict"]): ValuationType {
  switch (verdict) {
    case "Cheap": return "undervalued";
    case "Fair": return "fair-value";
    case "Expensive": return "overvalued";
  }
}

export default function ValuationSummaryCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES.value;
  
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">{categoryStyle.icon}</span>
            Valuation Summary
          </CardTitle>
          <CardDescription>Analyzing valuation metrics…</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full mb-3" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">{categoryStyle.icon}</span>
            Valuation Summary
          </CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">{categoryStyle.icon}</span>
            Valuation Summary
          </CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { symbol, asOf, overallScore, verdict, percentileRank, multiples, radarData, historicalPE, peerComparison } = data;

  const metrics = [
    { label: "P/E", value: multiples.pe.toFixed(1), subValue: `Med: ${multiples.peMedian.toFixed(1)}` },
    { label: "P/B", value: multiples.pb.toFixed(2), subValue: `Med: ${multiples.pbMedian.toFixed(2)}` },
    { label: "P/S", value: multiples.ps.toFixed(2), subValue: `Med: ${multiples.psMedian.toFixed(2)}` },
    { label: "EV/EBITDA", value: multiples.evEbitda.toFixed(1), subValue: `Med: ${multiples.evEbitdaMedian.toFixed(1)}` },
    { label: "PEG", value: multiples.pegRatio.toFixed(2) },
    { label: "Percentile", value: `${percentileRank}th` },
  ];

  const peColors = historicalPE.map((d) =>
    d.pe > multiples.peMedian * 1.2 ? "#ef4444" : d.pe < multiples.peMedian * 0.8 ? "#10b981" : "#3b82f6"
  );

  // Derive fair value from percentile (rough estimation if not provided)
  const currentPrice = data.currentPrice || multiples.pe * 10; // Simplified
  const fairValue = data.fairValue || currentPrice * (percentileRank > 50 ? 0.9 : 1.1);

  return (
    <Card className={`overflow-hidden border-l-4`} style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Valuation Summary
              <ValuationBadge valuation={getValuationStatus(verdict)} size="md" />
            </CardTitle>
            <CardDescription>
              {symbol} • Multi-metric valuation • As of {asOf}
            </CardDescription>
          </div>
          <RadialGauge
            value={overallScore}
            max={100}
            label="Score"
            size={70}
            colorScale={verdict === "Cheap" ? "quality" : verdict === "Expensive" ? "risk" : "default"}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MetricStrip metrics={metrics} columns={6} />

        {/* Signature Value Thermometer */}
        <ValueThermometer 
          currentPrice={currentPrice}
          fairValue={fairValue}
          percentile={percentileRank}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Radar Chart with gradient styling */}
          <div className="h-44">
            <div className="text-[10px] uppercase text-slate-500 font-medium mb-1">Relative Valuation</div>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <defs>
                  <linearGradient id="valueRadarGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                  <radialGradient id="valueRadarFill" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                  </radialGradient>
                </defs>
                <PolarGrid stroke="#334155" strokeOpacity={0.5} />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "#94a3b8", fontSize: 9 }}
                />
                <Radar
                  name="Stock"
                  dataKey="value"
                  stroke="url(#valueRadarGradient)"
                  fill="url(#valueRadarFill)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#fff', strokeWidth: 2 }}
                />
                <Radar
                  name="Benchmark"
                  dataKey="benchmark"
                  stroke="#64748b"
                  fill="#64748b"
                  fillOpacity={0.1}
                  strokeDasharray="4 4"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Historical P/E */}
          <div className="h-44">
            <div className="text-[10px] uppercase text-slate-500 font-medium mb-1">Historical P/E</div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalPE}>
                <XAxis
                  dataKey="year"
                  tick={{ fill: "#64748b", fontSize: 9 }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 9 }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="pe" radius={[4, 4, 0, 0]}>
                  {historicalPE.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={peColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peer Comparison */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 font-medium mb-2">Peer Comparison</div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {peerComparison.map((peer) => (
              <div
                key={peer.symbol}
                className={`rounded-lg border p-2 transition-all ${
                  peer.symbol === symbol
                    ? "border-indigo-500/50 bg-indigo-950/30 shadow-lg shadow-indigo-500/10"
                    : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50"
                }`}
              >
                <div className={`text-xs font-semibold ${peer.symbol === symbol ? 'text-indigo-300' : 'text-slate-200'}`}>
                  {peer.symbol}
                </div>
                <div className="text-[10px] text-slate-400">
                  P/E: {peer.pe.toFixed(1)} · P/B: {peer.pb.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <InterpretationFooter variant={verdict === "Cheap" ? "success" : verdict === "Expensive" ? "warning" : "neutral"}>
          {symbol} trades at the {percentileRank}th percentile vs its 5-year history.
          {verdict === "Cheap"
            ? " Current multiples suggest attractive entry; verify fundamentals support the discount."
            : verdict === "Expensive"
            ? " Premium valuation requires above-average growth to justify; watch for multiple compression."
            : " Valuation appears balanced; focus on earnings trajectory for direction."}
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
