import React, { useState, useMemo, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface PortfolioFund {
  schemeCode: string;
  schemeName: string;
  category: string;
  currentWeight: number;
  optimizedWeight: number;
  amount: number;
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
}

export interface EfficientFrontierPoint {
  risk: number;
  return: number;
  weights: Record<string, number>;
  sharpe: number;
  isOptimal?: boolean;
  label?: string;
}

export interface OptimizationResult {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  diversificationScore: number;
}

export interface PortfolioRecommendation {
  action: "increase" | "decrease" | "add" | "remove";
  fund: string;
  from: number;
  to: number;
  reason: string;
}

export interface MFPortfolioOptimizerData {
  asOf: string;
  investmentAmount: number;
  funds: PortfolioFund[];
  correlationMatrix: number[][];
  efficientFrontier: EfficientFrontierPoint[];
  currentPortfolio: OptimizationResult;
  optimizedPortfolio: OptimizationResult;
  recommendations: PortfolioRecommendation[];
  assetAllocation: {
    equity: number;
    debt: number;
    hybrid: number;
    other: number;
  };
  capAllocation: {
    largeCap: number;
    midCap: number;
    smallCap: number;
  };
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

export function getMFPortfolioOptimizerOutput(data: MFPortfolioOptimizerData): CardOutput {
  const { asOf, investmentAmount, funds, currentPortfolio, optimizedPortfolio, recommendations, assetAllocation, capAllocation } = data;
  
  const sharpeImprovement = optimizedPortfolio.sharpeRatio - currentPortfolio.sharpeRatio;
  const returnImprovement = optimizedPortfolio.expectedReturn - currentPortfolio.expectedReturn;
  const volatilityReduction = currentPortfolio.volatility - optimizedPortfolio.volatility;
  
  const sentiment = sharpeImprovement > 0.1 ? "bullish" : sharpeImprovement < -0.1 ? "bearish" : "neutral";
  const signalStrength = optimizedPortfolio.sharpeRatio > 1.5 ? 5 : optimizedPortfolio.sharpeRatio > 1 ? 4 : 3;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Investment", "mpo_invest", investmentAmount / 100000, "neutral", 
      { format: "currency", priority: 1, unit: "₹L" }),
    createMetric("Current Sharpe", "mpo_sharpe_cur", currentPortfolio.sharpeRatio, 
      currentPortfolio.sharpeRatio > 1 ? "good" : "fair",
      { format: "ratio", priority: 1 }),
    createMetric("Optimized Sharpe", "mpo_sharpe_opt", optimizedPortfolio.sharpeRatio, 
      optimizedPortfolio.sharpeRatio > 1.5 ? "excellent" : optimizedPortfolio.sharpeRatio > 1 ? "good" : "fair",
      { format: "ratio", priority: 1 }),
    createMetric("Expected Return", "mpo_ret", optimizedPortfolio.expectedReturn, 
      optimizedPortfolio.expectedReturn > 12 ? "excellent" : optimizedPortfolio.expectedReturn > 8 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("Volatility", "mpo_vol", optimizedPortfolio.volatility, 
      optimizedPortfolio.volatility < 12 ? "safe" : optimizedPortfolio.volatility < 18 ? "moderate" : "risky",
      { format: "percent", priority: 1 }),
    createMetric("Max Drawdown", "mpo_dd", optimizedPortfolio.maxDrawdown, 
      optimizedPortfolio.maxDrawdown < 15 ? "safe" : "risky",
      { format: "percent", priority: 2 }),
    createMetric("Diversification", "mpo_divers", optimizedPortfolio.diversificationScore, 
      optimizedPortfolio.diversificationScore > 70 ? "excellent" : "good",
      { format: "score", priority: 2 }),
    createMetric("Equity Allocation", "mpo_equity", assetAllocation.equity, "neutral", 
      { format: "percent", priority: 2 }),
    createMetric("Funds Count", "mpo_funds", funds.length, "neutral", 
      { format: "number", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Sharpe improvement
  if (sharpeImprovement > 0.1) {
    insights.push(createInsight("strength", `Optimization improves Sharpe by ${sharpeImprovement.toFixed(2)} (${currentPortfolio.sharpeRatio.toFixed(2)} → ${optimizedPortfolio.sharpeRatio.toFixed(2)})`, 1, ["mpo_sharpe_cur", "mpo_sharpe_opt"]));
  }
  
  // Return improvement
  if (returnImprovement > 1) {
    insights.push(createInsight("strength", `Expected return improves by ${returnImprovement.toFixed(1)}%`, 2, ["mpo_ret"]));
  }
  
  // Volatility reduction
  if (volatilityReduction > 1) {
    insights.push(createInsight("strength", `Volatility reduced by ${volatilityReduction.toFixed(1)}%`, 2, ["mpo_vol"]));
  }
  
  // Recommendations
  if (recommendations.length > 0) {
    const topRec = recommendations[0];
    insights.push(createInsight("action", `Top action: ${topRec.action} ${topRec.fund} - ${topRec.reason}`, 1));
  }
  
  // Cap allocation
  if (capAllocation.smallCap > 30) {
    insights.push(createInsight("observation", `High small-cap allocation (${capAllocation.smallCap.toFixed(0)}%) - higher volatility expected`, 3));
  }
  
  const headline = `MF Optimizer: Sharpe ${currentPortfolio.sharpeRatio.toFixed(2)} → ${optimizedPortfolio.sharpeRatio.toFixed(2)}, ${recommendations.length} actions`;
  
  return {
    cardId: "mf-portfolio-optimizer",
    cardCategory: "mutual-funds",
    symbol: "MFPORT",
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["mf-analyzer", "portfolio-correlation", "rebalance-optimizer"],
    tags: ["mutual-funds", "optimization", "portfolio"],
    scoreContribution: {
      category: "value",
      score: Math.min(100, 50 + optimizedPortfolio.sharpeRatio * 20),
      weight: 0.10,
    },
  };
}

interface Props {
  data?: MFPortfolioOptimizerData;
  isLoading?: boolean;
  error?: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// OPTIMIZATION MODES
// ═══════════════════════════════════════════════════════════════════════════

type OptimizationMode = "max_sharpe" | "min_vol" | "risk_parity" | "equal_weight" | "target_return";

const optimizationModes: { id: OptimizationMode; label: string; description: string }[] = [
  { id: "max_sharpe", label: "Max Sharpe", description: "Best risk-adjusted returns" },
  { id: "min_vol", label: "Min Volatility", description: "Lowest risk portfolio" },
  { id: "risk_parity", label: "Risk Parity", description: "Equal risk contribution" },
  { id: "equal_weight", label: "Equal Weight", description: "Simple 1/n allocation" },
  { id: "target_return", label: "Target Return", description: "Set your return goal" },
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const MetricCard = ({
  label,
  current,
  optimized,
  format,
  improvement,
  higherIsBetter = true,
}: {
  label: string;
  current: number;
  optimized: number;
  format: (v: number) => string;
  improvement?: string;
  higherIsBetter?: boolean;
}) => {
  const isImproved = higherIsBetter ? optimized > current : optimized < current;
  
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
      <div className="text-[10px] uppercase text-slate-500 mb-1">{label}</div>
      <div className="text-lg font-bold text-slate-100">{format(current)}</div>
      {optimized !== current && (
        <div className={`text-[10px] mt-1 ${isImproved ? "text-emerald-400" : "text-amber-400"}`}>
          {isImproved ? "▲" : "▼"} {format(optimized)} after
        </div>
      )}
    </div>
  );
};

const WeightSlider = ({
  fund,
  weight,
  optimizedWeight,
  onChange,
  color,
}: {
  fund: string;
  weight: number;
  optimizedWeight: number;
  onChange: (value: number) => void;
  color: string;
}) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-slate-300 truncate flex-1">{fund}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-500">
          {optimizedWeight !== weight && (
            <span className={optimizedWeight > weight ? "text-emerald-400" : "text-amber-400"}>
              Opt: {optimizedWeight.toFixed(0)}%
            </span>
          )}
        </span>
        <span className="text-xs font-medium text-slate-200 w-12 text-right">{weight.toFixed(0)}%</span>
      </div>
    </div>
    <div className="relative">
      <input
        type="range"
        min="0"
        max="100"
        value={weight}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      {/* Optimized weight marker */}
      {optimizedWeight !== weight && (
        <div
          className="absolute top-0 w-1 h-2 bg-emerald-500 rounded"
          style={{ left: `${optimizedWeight}%` }}
        />
      )}
    </div>
  </div>
);

const CorrelationCell = ({ value }: { value: number }) => {
  const getColor = (v: number) => {
    if (v >= 0.7) return "bg-red-500/60";
    if (v >= 0.4) return "bg-amber-500/50";
    if (v >= 0) return "bg-emerald-500/40";
    return "bg-blue-500/40";
  };
  
  return (
    <div
      className={`w-8 h-8 flex items-center justify-center text-[9px] font-medium text-white rounded ${getColor(value)}`}
    >
      {value.toFixed(1)}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function MFPortfolioOptimizerCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['mutual-funds'];

  const [optimizationMode, setOptimizationMode] = useState<OptimizationMode>("max_sharpe");
  const [riskTolerance, setRiskTolerance] = useState<"conservative" | "moderate" | "aggressive">("moderate");
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [activeView, setActiveView] = useState<"allocation" | "frontier" | "correlation">("allocation");

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

  // Initialize weights from data - using useEffect for side effects
  React.useEffect(() => {
    if (data?.funds && Object.keys(weights).length === 0) {
      const initialWeights: Record<string, number> = {};
      data.funds.forEach(f => {
        initialWeights[f.schemeCode] = f.currentWeight;
      });
      setWeights(initialWeights);
    }
  }, [data?.funds]);

  // Compute derived values - must be before early returns
  const totalWeight = useMemo(() => {
    return Object.values(weights).reduce((sum, w) => sum + w, 0);
  }, [weights]);

  // Prepare efficient frontier data
  const frontierData = useMemo(() => {
    if (!data?.efficientFrontier) return [];
    return data.efficientFrontier.map((point, i) => ({
      ...point,
      x: point.risk,
      y: point.return,
    }));
  }, [data?.efficientFrontier]);

  // Current portfolio point
  const currentPoint = useMemo(() => {
    if (!data?.currentPortfolio) return { x: 0, y: 0, label: "Current" };
    return {
      x: data.currentPortfolio.volatility,
      y: data.currentPortfolio.expectedReturn,
      label: "Current",
    };
  }, [data?.currentPortfolio]);

  // Optimized portfolio point
  const optimizedPoint = useMemo(() => {
    if (!data?.optimizedPortfolio) return { x: 0, y: 0, label: "Optimized" };
    return {
      x: data.optimizedPortfolio.volatility,
      y: data.optimizedPortfolio.expectedReturn,
      label: "Optimized",
    };
  }, [data?.optimizedPortfolio]);

  // Pie chart data
  const pieData = useMemo(() => {
    if (!data?.funds) return [];
    return data.funds.map((f, i) => ({
      name: f.schemeName.split(" ").slice(0, 2).join(" "),
      value: weights[f.schemeCode] || f.currentWeight,
      color: colors[i % colors.length],
    }));
  }, [data?.funds, weights, colors]);

  const handleWeightChange = useCallback((schemeCode: string, newWeight: number) => {
    setWeights(prev => ({
      ...prev,
      [schemeCode]: newWeight,
    }));
  }, []);

  const applyOptimization = useCallback(() => {
    if (!data?.funds) return;
    const optimizedWeights: Record<string, number> = {};
    data.funds.forEach(f => {
      optimizedWeights[f.schemeCode] = f.optimizedWeight;
    });
    setWeights(optimizedWeights);
  }, [data?.funds]);

  if (isLoading) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              MF Portfolio Optimizer
            </CardTitle>
          <CardDescription>Loading optimization...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>MF Portfolio Optimizer</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data || data.funds.length === 0) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>MF Portfolio Optimizer</CardTitle>
          <CardDescription>Add funds to optimize</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-500">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <p>Select funds from Explorer to optimize portfolio</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4" style={{ borderLeftColor: categoryStyle?.accent || '#6366f1' }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              MF Portfolio Optimizer
              <Badge variant="secondary">₹{(data.investmentAmount / 100000).toFixed(1)}L</Badge>
            </CardTitle>
            <CardDescription>
              Optimize allocation for risk-adjusted returns • {data.asOf}
            </CardDescription>
          </div>
          <button
            onClick={applyOptimization}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Apply Optimization
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Optimization Mode Selection */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Optimization Strategy</div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {optimizationModes.map(mode => (
              <button
                key={mode.id}
                onClick={() => setOptimizationMode(mode.id)}
                className={`
                  flex-shrink-0 px-3 py-2 rounded-lg text-left transition-all
                  ${optimizationMode === mode.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                  }
                `}
              >
                <div className="text-xs font-medium">{mode.label}</div>
                <div className="text-[9px] opacity-80">{mode.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Risk Tolerance */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Risk Tolerance</div>
          <div className="flex gap-2">
            {(["conservative", "moderate", "aggressive"] as const).map(level => (
              <button
                key={level}
                onClick={() => setRiskTolerance(level)}
                className={`
                  flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all
                  ${riskTolerance === level
                    ? level === "conservative"
                      ? "bg-emerald-600 text-white"
                      : level === "moderate"
                        ? "bg-blue-600 text-white"
                        : "bg-red-600 text-white"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                  }
                `}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Metrics */}
        <div className="grid grid-cols-4 gap-2">
          <MetricCard
            label="Exp. Return"
            current={data.currentPortfolio.expectedReturn}
            optimized={data.optimizedPortfolio.expectedReturn}
            format={v => `${v.toFixed(1)}%`}
          />
          <MetricCard
            label="Volatility"
            current={data.currentPortfolio.volatility}
            optimized={data.optimizedPortfolio.volatility}
            format={v => `${v.toFixed(1)}%`}
            higherIsBetter={false}
          />
          <MetricCard
            label="Sharpe"
            current={data.currentPortfolio.sharpeRatio}
            optimized={data.optimizedPortfolio.sharpeRatio}
            format={v => v.toFixed(2)}
          />
          <MetricCard
            label="Max DD"
            current={data.currentPortfolio.maxDrawdown}
            optimized={data.optimizedPortfolio.maxDrawdown}
            format={v => `${v.toFixed(0)}%`}
            higherIsBetter={false}
          />
        </div>

        {/* View Tabs */}
        <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg">
          {[
            { id: "allocation", label: "Allocation" },
            { id: "frontier", label: "Efficient Frontier" },
            { id: "correlation", label: "Correlation" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as typeof activeView)}
              className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
                activeView === tab.id
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Allocation View */}
        {activeView === "allocation" && (
          <div className="grid grid-cols-2 gap-4">
            {/* Weight sliders */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase text-slate-500">Fund Weights</span>
                <span className={`text-xs font-medium ${
                  Math.abs(totalWeight - 100) < 1 ? "text-emerald-400" : "text-amber-400"
                }`}>
                  Total: {totalWeight.toFixed(0)}%
                </span>
              </div>
              {data.funds.map((fund, i) => (
                <WeightSlider
                  key={fund.schemeCode}
                  fund={fund.schemeName.split(" ").slice(0, 3).join(" ")}
                  weight={weights[fund.schemeCode] || fund.currentWeight}
                  optimizedWeight={fund.optimizedWeight}
                  onChange={(v) => handleWeightChange(fund.schemeCode, v)}
                  color={colors[i % colors.length]}
                />
              ))}
            </div>

            {/* Pie chart */}
            <div>
              <div className="text-[10px] uppercase text-slate-500 mb-2">Allocation Breakdown</div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`, "Weight"]}
                    />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      wrapperStyle={{ fontSize: "10px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Asset type allocation */}
              <div className="mt-4 space-y-1">
                <div className="text-[10px] uppercase text-slate-500 mb-2">By Asset Type</div>
                {Object.entries(data.assetAllocation).map(([type, pct]) => (
                  <div key={type} className="flex items-center gap-2 text-[10px]">
                    <span className="w-12 text-slate-500 capitalize">{type}</span>
                    <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          type === "equity" ? "bg-blue-500" :
                          type === "debt" ? "bg-emerald-500" :
                          type === "hybrid" ? "bg-purple-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-slate-400">{pct.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Efficient Frontier View */}
        {activeView === "frontier" && (
          <div>
            <div className="text-[10px] text-slate-500 mb-2">
              The efficient frontier shows optimal portfolios offering the best return for each risk level.
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Risk"
                    unit="%"
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    axisLine={{ stroke: "#334155" }}
                    label={{ value: "Risk (Std Dev %)", position: "bottom", fill: "#64748b", fontSize: 10 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Return"
                    unit="%"
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    axisLine={{ stroke: "#334155" }}
                    label={{ value: "Expected Return %", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(2)}%`,
                      name === "x" ? "Risk" : "Return"
                    ]}
                  />
                  
                  {/* Efficient frontier line */}
                  <Scatter
                    name="Efficient Frontier"
                    data={frontierData}
                    fill="#3b82f6"
                    line={{ stroke: "#3b82f6", strokeWidth: 2 }}
                    shape="circle"
                  >
                    {frontierData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.isOptimal ? "#10b981" : "#3b82f6"}
                        r={entry.isOptimal ? 8 : 4}
                      />
                    ))}
                  </Scatter>
                  
                  {/* Current portfolio */}
                  <Scatter
                    name="Current"
                    data={[currentPoint]}
                    fill="#f59e0b"
                  >
                    <Cell fill="#f59e0b" r={8} />
                  </Scatter>
                  
                  {/* Optimized portfolio */}
                  <Scatter
                    name="Optimized"
                    data={[optimizedPoint]}
                    fill="#10b981"
                  >
                    <Cell fill="#10b981" r={8} />
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2 text-[10px]">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-slate-400">Current Portfolio</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-400">Optimized</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-slate-400">Efficient Frontier</span>
              </div>
            </div>
          </div>
        )}

        {/* Correlation View */}
        {activeView === "correlation" && (
          <div>
            <div className="text-[10px] text-slate-500 mb-3">
              Lower correlation between funds = better diversification. Values close to 1 mean high overlap.
            </div>
            <div className="overflow-x-auto">
              <table className="mx-auto">
                <thead>
                  <tr>
                    <th className="p-1" />
                    {data.funds.slice(0, 6).map((f, i) => (
                      <th key={i} className="p-1 text-[9px] text-slate-500 font-normal w-10">
                        {f.schemeName.split(" ")[0].slice(0, 4)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.correlationMatrix.slice(0, 6).map((row, i) => (
                    <tr key={i}>
                      <td className="p-1 text-[9px] text-slate-500 text-right pr-2">
                        {data.funds[i]?.schemeName.split(" ")[0].slice(0, 4)}
                      </td>
                      {row.slice(0, 6).map((val, j) => (
                        <td key={j} className="p-0.5">
                          <CorrelationCell value={val} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center gap-4 mt-3 text-[9px]">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-500/60" />
                <span className="text-slate-500">High (0.7+)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-amber-500/50" />
                <span className="text-slate-500">Medium (0.4-0.7)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-emerald-500/40" />
                <span className="text-slate-500">Low (0-0.4)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-blue-500/40" />
                <span className="text-slate-500">Negative</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-slate-800/30 rounded-lg">
              <div className="text-[10px] font-medium text-slate-300 mb-1">
                Diversification Score: {data.currentPortfolio.diversificationScore.toFixed(0)}/100
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    data.currentPortfolio.diversificationScore >= 70
                      ? "bg-emerald-500"
                      : data.currentPortfolio.diversificationScore >= 40
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${data.currentPortfolio.diversificationScore}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations.length > 0 && (
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
            <div className="text-[10px] uppercase text-blue-400 font-medium mb-2">
              Optimization Recommendations
            </div>
            <div className="space-y-2">
              {data.recommendations.slice(0, 3).map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px]">
                  <span className={`mt-0.5 ${
                    rec.action === "increase" ? "text-emerald-400" :
                    rec.action === "decrease" ? "text-amber-400" :
                    rec.action === "add" ? "text-blue-400" : "text-red-400"
                  }`}>
                    {rec.action === "increase" ? "▲" :
                     rec.action === "decrease" ? "▼" :
                     rec.action === "add" ? "+" : "−"}
                  </span>
                  <div>
                    <span className="text-slate-300">
                      {rec.action === "add" ? `Add ${rec.fund}` :
                       rec.action === "remove" ? `Remove ${rec.fund}` :
                       `${rec.fund}: ${rec.from}% → ${rec.to}%`}
                    </span>
                    <div className="text-slate-500">{rec.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <InterpretationFooter variant="success">
          Optimization improves Sharpe ratio from {data.currentPortfolio.sharpeRatio.toFixed(2)} to {data.optimizedPortfolio.sharpeRatio.toFixed(2)} while reducing volatility by {(data.currentPortfolio.volatility - data.optimizedPortfolio.volatility).toFixed(1)}%. Expected max drawdown improves from {data.currentPortfolio.maxDrawdown.toFixed(0)}% to {data.optimizedPortfolio.maxDrawdown.toFixed(0)}%.
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
