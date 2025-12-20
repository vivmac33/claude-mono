import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export interface DrawdownVaRData {
  symbol: string;
  asOf: string;
  currentDrawdown: number;
  maxDrawdown: number;
  maxDrawdownDate: string;
  recoveryDays: number | null;
  var95_1d: number;
  var99_1d: number;
  cvar95: number;
  volatility30d: number;
  volatility90d: number;
  beta: number;
  drawdownHistory: Array<{ date: string; drawdown: number }>;
  stressScenarios: Array<{ scenario: string; impact: number }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// RISK WATERFALL SIGNATURE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function RiskWaterfall({ 
  currentDrawdown, 
  maxDrawdown,
  var95_1d,
  var99_1d,
  cvar95
}: { 
  currentDrawdown: number;
  maxDrawdown: number;
  var95_1d: number;
  var99_1d: number;
  cvar95: number;
}) {
  // Waterfall stages from top (0%) to bottom (max risk)
  const stages = [
    { label: 'Current DD', value: currentDrawdown, color: currentDrawdown > -5 ? '#10b981' : currentDrawdown > -15 ? '#f59e0b' : '#ef4444' },
    { label: 'VaR 95%', value: -var95_1d, color: '#3b82f6' },
    { label: 'VaR 99%', value: -var99_1d, color: '#6366f1' },
    { label: 'CVaR 95%', value: -cvar95, color: '#8b5cf6' },
    { label: 'Max DD', value: maxDrawdown, color: '#ef4444' },
  ].sort((a, b) => b.value - a.value); // Sort by value descending (closest to 0 first)
  
  const maxRisk = Math.min(...stages.map(s => s.value), -50);
  
  return (
    <div className="relative">
      {/* Water level indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[8px] text-slate-500 py-2">
        <span>0%</span>
        <span>-25%</span>
        <span>-50%</span>
      </div>
      
      {/* Waterfall container */}
      <div className="ml-10 relative h-48 bg-gradient-to-b from-slate-800/30 via-slate-800/50 to-red-900/30 rounded-xl overflow-hidden border border-slate-700/50">
        {/* Grid lines */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 right-0 h-px bg-slate-700/30" />
          <div className="absolute top-1/4 left-0 right-0 h-px bg-slate-700/30" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-amber-500/20" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-red-500/20" />
        </div>
        
        {/* Waterfall stages */}
        <div className="absolute inset-0 flex items-end justify-around px-4 pb-2">
          {stages.map((stage, i) => {
            const height = Math.abs(stage.value) / 50 * 100; // Scale to 50% max
            const isCurrentDD = stage.label === 'Current DD';
            
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                {/* Value label */}
                <div 
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ 
                    color: stage.color,
                    backgroundColor: `${stage.color}20`,
                  }}
                >
                  {stage.value.toFixed(1)}%
                </div>
                
                {/* Bar */}
                <div 
                  className="w-10 rounded-t-lg transition-all duration-700 relative overflow-hidden"
                  style={{ 
                    height: `${Math.max(10, height)}%`,
                    background: `linear-gradient(to bottom, ${stage.color}80, ${stage.color}40)`,
                    boxShadow: isCurrentDD ? `0 0 15px ${stage.color}50` : 'none',
                  }}
                >
                  {/* Waterfall animation effect */}
                  <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: `repeating-linear-gradient(180deg, transparent, transparent 4px, ${stage.color}30 4px, ${stage.color}30 8px)`,
                      animation: 'waterfall 2s linear infinite',
                    }}
                  />
                  
                  {/* Glow at bottom */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-2"
                    style={{
                      background: `linear-gradient(to top, ${stage.color}, transparent)`,
                    }}
                  />
                </div>
                
                {/* Label */}
                <div className="text-[9px] text-slate-400 text-center whitespace-nowrap">
                  {stage.label}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* "Water" base */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-red-500/30 to-transparent" />
      </div>
      
      {/* Risk level indicator */}
      <div className="flex justify-center mt-3">
        <div 
          className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
            currentDrawdown > -5 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
            currentDrawdown > -15 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
            'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${
            currentDrawdown > -5 ? 'bg-emerald-400' :
            currentDrawdown > -15 ? 'bg-amber-400' :
            'bg-red-400 animate-pulse'
          }`} />
          {currentDrawdown > -5 ? 'LOW RISK' : currentDrawdown > -15 ? 'MODERATE RISK' : 'HIGH RISK'}
        </div>
      </div>
      
      <style>{`
        @keyframes waterfall {
          0% { transform: translateY(-8px); }
          100% { transform: translateY(8px); }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getDrawdownVaROutput(data: DrawdownVaRData): CardOutput {
  const { symbol, asOf, currentDrawdown, maxDrawdown, maxDrawdownDate, recoveryDays, var95_1d, var99_1d, cvar95, volatility30d, beta, stressScenarios } = data;
  
  const riskLevel = currentDrawdown > -5 ? "low" : currentDrawdown > -15 ? "moderate" : "high";
  const sentiment = riskLevel === "low" ? "bullish" : riskLevel === "high" ? "bearish" : "neutral";
  const signalStrength = currentDrawdown > -5 ? 5 : currentDrawdown > -10 ? 4 : currentDrawdown > -20 ? 3 : currentDrawdown > -30 ? 2 : 1;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Current Drawdown", "dv_current_dd", currentDrawdown, 
      currentDrawdown > -5 ? "safe" : currentDrawdown > -15 ? "moderate" : "risky",
      { format: "percent", priority: 1 }),
    createMetric("Max Drawdown", "dv_max_dd", maxDrawdown, 
      maxDrawdown > -20 ? "safe" : maxDrawdown > -40 ? "moderate" : "risky",
      { format: "percent", priority: 1 }),
    createMetric("VaR 95% 1D", "dv_var95", var95_1d, 
      var95_1d < 2 ? "safe" : var95_1d < 4 ? "moderate" : "risky",
      { format: "percent", priority: 1 }),
    createMetric("VaR 99% 1D", "dv_var99", var99_1d, 
      var99_1d < 3 ? "safe" : var99_1d < 5 ? "moderate" : "risky",
      { format: "percent", priority: 2 }),
    createMetric("CVaR 95%", "dv_cvar95", cvar95, 
      cvar95 < 3 ? "safe" : cvar95 < 5 ? "moderate" : "risky",
      { format: "percent", priority: 2 }),
    createMetric("Volatility 30D", "dv_vol30d", volatility30d, 
      volatility30d < 20 ? "safe" : volatility30d < 35 ? "moderate" : "risky",
      { format: "percent", priority: 2 }),
    createMetric("Beta", "dv_beta", beta, 
      beta < 0.8 ? "safe" : beta < 1.2 ? "moderate" : "risky",
      { format: "ratio", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  if (currentDrawdown > -5) {
    insights.push(createInsight("strength", `Near all-time high with only ${Math.abs(currentDrawdown).toFixed(1)}% drawdown`, 1, ["dv_current_dd"]));
  } else if (currentDrawdown < -20) {
    insights.push(createInsight("risk", `Deep drawdown of ${Math.abs(currentDrawdown).toFixed(1)}% from peak - significant recovery needed`, 1, ["dv_current_dd"]));
  } else if (currentDrawdown < -10) {
    insights.push(createInsight("observation", `Moderate ${Math.abs(currentDrawdown).toFixed(1)}% drawdown from peak`, 1, ["dv_current_dd"]));
  }
  
  if (maxDrawdown < -40) {
    insights.push(createInsight("risk", `Historically volatile with ${Math.abs(maxDrawdown).toFixed(1)}% max drawdown on ${maxDrawdownDate}`, 2, ["dv_max_dd"]));
  }
  
  if (recoveryDays === null && currentDrawdown < -10) {
    insights.push(createInsight("observation", "Still recovering from recent drawdown", 2));
  } else if (recoveryDays && recoveryDays > 365) {
    insights.push(createInsight("risk", `Extended recovery: took ${recoveryDays} days to recover from max drawdown`, 2));
  }
  
  insights.push(createInsight("observation", `Daily VaR95 of ${var95_1d.toFixed(2)}% means 5% chance of larger single-day loss`, 3, ["dv_var95"]));
  
  if (beta > 1.3) {
    insights.push(createInsight("risk", `High beta (${beta.toFixed(2)}) - amplifies market moves`, 2, ["dv_beta"]));
  } else if (beta < 0.7) {
    insights.push(createInsight("strength", `Low beta (${beta.toFixed(2)}) - defensive characteristics`, 2, ["dv_beta"]));
  }
  
  const headline = `${symbol} ${riskLevel} drawdown risk with ${Math.abs(currentDrawdown).toFixed(1)}% from peak and ${var95_1d.toFixed(2)}% daily VaR`;
  
  return {
    cardId: "drawdown-var",
    cardCategory: "risk",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: riskLevel === "high"
      ? ["volatility-regime", "risk-health-dashboard", "candlestick-hero"]
      : ["trend-strength", "technical-indicators", "valuation-summary"],
    tags: ["drawdown", "var", "volatility", "market-risk", riskLevel + "-risk"],
    scoreContribution: {
      category: "risk",
      score: Math.min(100, Math.max(0, 100 + currentDrawdown * 2)),
      weight: 0.15,
    },
  };
}

interface Props {
  data?: DrawdownVaRData;
  isLoading?: boolean;
  error?: string | null;
}

export default function DrawdownVaRCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['risk'];

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Drawdown & VaR</CardTitle>
          <CardDescription>Calculating risk metrics…</CardDescription>
        </CardHeader>
        <CardContent><Skeleton className="h-48 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Drawdown & VaR</CardTitle>
          <CardDescription className={error ? "text-red-400" : ""}>{error || "No data"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const {
    symbol, asOf, currentDrawdown, maxDrawdown, maxDrawdownDate, recoveryDays,
    var95_1d, var99_1d, cvar95, volatility30d, volatility90d, beta,
    drawdownHistory, stressScenarios
  } = data;

  const riskColor = currentDrawdown > -5 ? '#10b981' : currentDrawdown > -15 ? '#f59e0b' : '#ef4444';

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: riskColor }}>
      <CardHeader className={categoryStyle.headerBg}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Drawdown & VaR
              <Badge variant={currentDrawdown > -10 ? "secondary" : currentDrawdown > -20 ? "warning" : "destructive"}>
                {currentDrawdown > -5 ? "Healthy" : currentDrawdown > -15 ? "Moderate" : "Deep DD"}
              </Badge>
            </CardTitle>
            <CardDescription>{symbol} • Risk metrics • As of {asOf}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: riskColor }}>{currentDrawdown.toFixed(1)}%</div>
            <div className="text-xs text-slate-400">From Peak</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Signature Risk Waterfall */}
        <RiskWaterfall 
          currentDrawdown={currentDrawdown}
          maxDrawdown={maxDrawdown}
          var95_1d={var95_1d}
          var99_1d={var99_1d}
          cvar95={cvar95}
        />

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-800/30 rounded-lg p-2 text-center border border-slate-700/30">
            <div className="text-[9px] text-slate-500 uppercase">Vol 30D</div>
            <div className="text-sm font-bold text-slate-200">{volatility30d.toFixed(1)}%</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-2 text-center border border-slate-700/30">
            <div className="text-[9px] text-slate-500 uppercase">Vol 90D</div>
            <div className="text-sm font-bold text-slate-200">{volatility90d.toFixed(1)}%</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-2 text-center border border-slate-700/30">
            <div className="text-[9px] text-slate-500 uppercase">Beta</div>
            <div className={`text-sm font-bold ${beta > 1.2 ? 'text-red-400' : beta < 0.8 ? 'text-emerald-400' : 'text-slate-200'}`}>
              {beta.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Drawdown Chart - Compact */}
        <div className="h-28">
          <div className="text-[10px] uppercase text-slate-500 mb-1">Drawdown History</div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={drawdownHistory}>
              <defs>
                <linearGradient id="ddGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 8 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 8 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={['auto', 0]} width={30} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "10px" }}
                formatter={(value: number) => [`${value.toFixed(2)}%`, "Drawdown"]}
              />
              <ReferenceLine y={maxDrawdown} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1} />
              <Area type="monotone" dataKey="drawdown" stroke="#ef4444" fill="url(#ddGradient)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stress Scenarios */}
        <div>
          <div className="text-[10px] uppercase text-slate-500 mb-2">Stress Scenarios</div>
          <div className="grid grid-cols-3 gap-2">
            {stressScenarios.slice(0, 3).map((s) => (
              <div 
                key={s.scenario} 
                className="rounded-lg px-2 py-1.5 text-center border"
                style={{
                  backgroundColor: s.impact < -10 ? 'rgba(239, 68, 68, 0.1)' : s.impact < -5 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                  borderColor: s.impact < -10 ? 'rgba(239, 68, 68, 0.3)' : s.impact < -5 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(100, 116, 139, 0.3)',
                }}
              >
                <div className="text-[9px] text-slate-400 truncate">{s.scenario}</div>
                <div className={`text-sm font-bold ${s.impact < -10 ? "text-red-400" : s.impact < -5 ? "text-amber-400" : "text-slate-300"}`}>
                  {s.impact.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[10px] text-slate-500">
          Max DD: {maxDrawdown.toFixed(1)}% on {maxDrawdownDate}.
          {recoveryDays ? ` Recovered in ${recoveryDays}d.` : " Still recovering."}
        </div>

        <InterpretationFooter variant={currentDrawdown > -10 ? "neutral" : "warning"}>
          VaR95 {var95_1d.toFixed(2)}% = 5% chance of larger daily loss. CVaR95 {cvar95.toFixed(2)}% = expected loss when VaR breached.
          Beta {beta.toFixed(2)} = {beta > 1.2 ? "high" : beta < 0.8 ? "low" : "moderate"} market sensitivity.
        </InterpretationFooter>
      </CardContent>
    </Card>
  );
}
