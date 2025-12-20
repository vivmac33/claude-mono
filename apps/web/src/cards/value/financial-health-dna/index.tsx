import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface HealthScoreComponent {
  name: string;
  score: number; // 0-100
  weight: number;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  details: string;
}

export interface FinancialHealthDNAData {
  symbol: string;
  asOf: string;
  
  // Composite Score
  healthScore: number; // 0-100
  healthGrade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  healthVerdict: string;
  
  // Piotroski F-Score (9 points)
  piotroski: {
    totalScore: number;
    components: {
      positiveNetIncome: boolean;
      positiveCFO: boolean;
      roaImproving: boolean;
      cfoGreaterThanNI: boolean;
      lowerLeverage: boolean;
      higherCurrentRatio: boolean;
      noNewShares: boolean;
      higherGrossMargin: boolean;
      higherAssetTurnover: boolean;
    };
    interpretation: string;
  };
  
  // Altman Z-Score (bankruptcy risk)
  altmanZ: {
    score: number;
    zone: 'Safe' | 'Grey' | 'Distress';
    components: {
      workingCapitalRatio: number;
      retainedEarningsRatio: number;
      ebitRatio: number;
      marketValueRatio: number;
      salesRatio: number;
    };
    interpretation: string;
  };
  
  // Cash Conversion Quality
  cashQuality: {
    score: number; // 0-100
    accrualRatio: number;
    cashConversion: number; // CFO/NI
    earningsQuality: 'High' | 'Medium' | 'Low' | 'Poor';
    redFlags: string[];
  };
  
  // Leverage Health
  leverageHealth: {
    score: number;
    debtToEquity: number;
    interestCoverage: number;
    status: 'Conservative' | 'Moderate' | 'Aggressive' | 'Dangerous';
  };
  
  // Profitability
  profitability: {
    score: number;
    roe: number;
    roa: number;
    opm: number;
    npm: number;
    trend: 'Improving' | 'Stable' | 'Declining';
  };
  
  // Radar chart data
  radarData: { metric: string; score: number; fullMark: number }[];
  
  // Historical scores
  historicalScores: { year: string; score: number }[];
  
  // Key concerns
  concerns: string[];
  strengths: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getFinancialHealthDNAOutput(data: FinancialHealthDNAData): CardOutput {
  const { symbol, asOf, healthScore, healthGrade, healthVerdict, piotroski, altmanZ, cashQuality, leverageHealth, profitability, concerns, strengths } = data;
  
  const sentiment = healthGrade.startsWith('A') || healthGrade === 'B+' ? "bullish" : 
    healthGrade === 'D' || healthGrade === 'F' ? "bearish" : "neutral";
  const signalStrength = healthScore > 80 ? 5 : healthScore > 60 ? 4 : healthScore > 40 ? 3 : healthScore > 20 ? 2 : 1;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Health Score", "fhd_health_score", healthScore, 
      healthScore > 80 ? "excellent" : healthScore > 60 ? "good" : healthScore > 40 ? "fair" : "poor",
      { format: "score", priority: 1 }),
    createMetric("Piotroski F-Score", "fhd_piotroski", piotroski.totalScore, 
      piotroski.totalScore >= 7 ? "excellent" : piotroski.totalScore >= 5 ? "good" : piotroski.totalScore >= 3 ? "fair" : "poor",
      { format: "score", priority: 1 }),
    createMetric("Altman Z-Score", "fhd_altman_z", altmanZ.score, 
      altmanZ.zone === "Safe" ? "safe" : altmanZ.zone === "Grey" ? "moderate" : "dangerous",
      { format: "number", priority: 1 }),
    createMetric("Earnings Quality", "fhd_earnings_quality", 
      cashQuality.earningsQuality === "High" ? 4 : cashQuality.earningsQuality === "Medium" ? 3 : cashQuality.earningsQuality === "Low" ? 2 : 1,
      cashQuality.earningsQuality === "High" ? "excellent" : cashQuality.earningsQuality === "Medium" ? "good" : "poor",
      { format: "score", priority: 2 }),
    createMetric("ROE", "fhd_roe", profitability.roe, 
      profitability.roe > 20 ? "excellent" : profitability.roe > 12 ? "good" : profitability.roe > 8 ? "fair" : "poor",
      { format: "percent", priority: 2 }),
    createMetric("Debt to Equity", "fhd_de_ratio", leverageHealth.debtToEquity, 
      leverageHealth.status === "Conservative" ? "safe" : leverageHealth.status === "Moderate" ? "moderate" : "risky",
      { format: "ratio", priority: 2, unit: "x" }),
    createMetric("Interest Coverage", "fhd_interest_coverage", leverageHealth.interestCoverage, 
      leverageHealth.interestCoverage > 5 ? "safe" : leverageHealth.interestCoverage > 2 ? "moderate" : "risky",
      { format: "ratio", priority: 2, unit: "x" }),
    createMetric("Cash Conversion", "fhd_cash_conversion", cashQuality.cashConversion * 100, 
      cashQuality.cashConversion > 0.9 ? "excellent" : cashQuality.cashConversion > 0.7 ? "good" : "fair",
      { format: "percent", priority: 3 }),
  ];
  
  const insights: Insight[] = [];
  
  // Overall health
  if (healthGrade.startsWith('A')) {
    insights.push(createInsight("strength", `Grade ${healthGrade} health (${healthScore}/100) - ${healthVerdict}`, 1, ["fhd_health_score"]));
  } else if (healthGrade === 'F') {
    insights.push(createInsight("weakness", `Grade F health (${healthScore}/100) - significant financial concerns`, 1, ["fhd_health_score"]));
  } else {
    insights.push(createInsight("observation", `Grade ${healthGrade} health (${healthScore}/100) - ${healthVerdict}`, 1, ["fhd_health_score"]));
  }
  
  // Piotroski insight
  if (piotroski.totalScore >= 7) {
    insights.push(createInsight("strength", `Strong Piotroski F-Score of ${piotroski.totalScore}/9 - high quality fundamentals`, 2, ["fhd_piotroski"]));
  } else if (piotroski.totalScore <= 3) {
    insights.push(createInsight("weakness", `Weak Piotroski F-Score of ${piotroski.totalScore}/9 - fundamental quality concerns`, 2, ["fhd_piotroski"]));
  }
  
  // Altman Z insight
  if (altmanZ.zone === "Distress") {
    insights.push(createInsight("risk", `Altman Z-Score in distress zone (${altmanZ.score.toFixed(2)}) - elevated bankruptcy risk`, 1, ["fhd_altman_z"]));
  } else if (altmanZ.zone === "Safe") {
    insights.push(createInsight("strength", `Altman Z-Score in safe zone (${altmanZ.score.toFixed(2)}) - low bankruptcy risk`, 2, ["fhd_altman_z"]));
  }
  
  // Cash quality
  if (cashQuality.redFlags.length > 0) {
    insights.push(createInsight("risk", `Cash quality red flags: ${cashQuality.redFlags.slice(0, 2).join(", ")}`, 2, ["fhd_earnings_quality"]));
  }
  
  // Leverage
  if (leverageHealth.status === "Dangerous") {
    insights.push(createInsight("risk", `Dangerous leverage (D/E: ${leverageHealth.debtToEquity.toFixed(2)}, Coverage: ${leverageHealth.interestCoverage.toFixed(1)}x)`, 2, ["fhd_de_ratio", "fhd_interest_coverage"]));
  }
  
  // Add strengths and concerns
  strengths.slice(0, 2).forEach(s => {
    insights.push(createInsight("strength", s, 3));
  });
  concerns.slice(0, 2).forEach(c => {
    insights.push(createInsight("weakness", c, 3));
  });
  
  const headline = `${symbol} financial health Grade ${healthGrade} (${healthScore}/100) with ${altmanZ.zone.toLowerCase()} bankruptcy risk`;
  
  return {
    cardId: "financial-health-dna",
    cardCategory: "value",
    symbol,
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    primaryChart: { type: "radar", title: "Health DNA", data: data.radarData },
    suggestedCards: altmanZ.zone === "Distress" 
      ? ["bankruptcy-health", "financial-stress-radar", "leverage-history"]
      : ["piotroski-score", "dupont-analysis", "earnings-quality"],
    tags: ["financial-health", "quality", healthGrade.toLowerCase(), altmanZ.zone.toLowerCase()],
    scoreContribution: {
      category: "quality",
      score: healthScore,
      weight: 0.25,
    },
  };
}

interface Props {
  data?: FinancialHealthDNAData;
  isLoading?: boolean;
  error?: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function HealthGauge({ score, grade }: { score: number; grade: string }) {
  const rotation = (score / 100) * 180 - 90; // -90 to 90 degrees
  
  const gradeColors: Record<string, string> = {
    'A+': '#10b981', 'A': '#10b981',
    'B+': '#22c55e', 'B': '#84cc16',
    'C+': '#eab308', 'C': '#f59e0b',
    'D': '#f97316', 'F': '#ef4444',
  };
  
  return (
    <div className="relative w-48 h-24 mx-auto">
      {/* Gauge background */}
      <svg viewBox="0 0 100 50" className="w-full h-full">
        {/* Background arc */}
        <path
          d="M 5 50 A 45 45 0 0 1 95 50"
          fill="none"
          stroke="#1e293b"
          strokeWidth="8"
        />
        {/* Colored segments */}
        <path
          d="M 5 50 A 45 45 0 0 1 27 15"
          fill="none"
          stroke="#ef4444"
          strokeWidth="8"
        />
        <path
          d="M 27 15 A 45 45 0 0 1 50 5"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="8"
        />
        <path
          d="M 50 5 A 45 45 0 0 1 73 15"
          fill="none"
          stroke="#eab308"
          strokeWidth="8"
        />
        <path
          d="M 73 15 A 45 45 0 0 1 95 50"
          fill="none"
          stroke="#10b981"
          strokeWidth="8"
        />
        {/* Needle */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="15"
          stroke={gradeColors[grade] || '#64748b'}
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${rotation}, 50, 50)`}
        />
        {/* Center circle */}
        <circle cx="50" cy="50" r="4" fill={gradeColors[grade] || '#64748b'} />
      </svg>
      {/* Score display */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-2xl font-bold text-slate-100">{score}</div>
        <div 
          className="text-sm font-semibold"
          style={{ color: gradeColors[grade] || '#64748b' }}
        >
          Grade {grade}
        </div>
      </div>
    </div>
  );
}

function PiotroskiGrid({ components, total }: { 
  components: FinancialHealthDNAData['piotroski']['components']; 
  total: number;
}) {
  const items = [
    { key: 'positiveNetIncome', label: 'Net Income > 0', pass: components.positiveNetIncome },
    { key: 'positiveCFO', label: 'CFO > 0', pass: components.positiveCFO },
    { key: 'roaImproving', label: 'ROA Improving', pass: components.roaImproving },
    { key: 'cfoGreaterThanNI', label: 'CFO > Net Income', pass: components.cfoGreaterThanNI },
    { key: 'lowerLeverage', label: 'Lower Leverage', pass: components.lowerLeverage },
    { key: 'higherCurrentRatio', label: 'Higher Liquidity', pass: components.higherCurrentRatio },
    { key: 'noNewShares', label: 'No Dilution', pass: components.noNewShares },
    { key: 'higherGrossMargin', label: 'Higher Margin', pass: components.higherGrossMargin },
    { key: 'higherAssetTurnover', label: 'Higher Turnover', pass: components.higherAssetTurnover },
  ];
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">Piotroski F-Score</span>
        <span className={`text-lg font-bold ${
          total >= 7 ? 'text-emerald-400' : total >= 4 ? 'text-amber-400' : 'text-red-400'
        }`}>
          {total}/9
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {items.map(item => (
          <div 
            key={item.key}
            className={`px-2 py-1 rounded text-[9px] text-center ${
              item.pass 
                ? 'bg-emerald-900/30 text-emerald-300' 
                : 'bg-red-900/30 text-red-300'
            }`}
          >
            {item.pass ? '✓' : '✗'} {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function ZScoreIndicator({ score, zone }: { score: number; zone: string }) {
  const zoneColors = {
    'Safe': 'text-emerald-400',
    'Grey': 'text-amber-400',
    'Distress': 'text-red-400',
  };
  
  // Z-score scale: <1.8 distress, 1.8-3.0 grey, >3.0 safe
  const position = Math.min(100, Math.max(0, ((score - 1) / 3) * 100));
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">Altman Z-Score</span>
        <span className={`font-semibold ${zoneColors[zone as keyof typeof zoneColors]}`}>
          {score.toFixed(2)} ({zone})
        </span>
      </div>
      <div className="relative h-2 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full">
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-slate-900 shadow"
          style={{ left: `calc(${position}% - 6px)` }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-slate-500">
        <span>Distress (&lt;1.8)</span>
        <span>Grey (1.8-3.0)</span>
        <span>Safe (&gt;3.0)</span>
      </div>
    </div>
  );
}

function CashQualityCard({ data }: { data: FinancialHealthDNAData['cashQuality'] }) {
  const qualityColors = {
    'High': 'text-emerald-400',
    'Medium': 'text-blue-400',
    'Low': 'text-amber-400',
    'Poor': 'text-red-400',
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">Earnings Quality</span>
        <span className={`font-semibold ${qualityColors[data.earningsQuality]}`}>
          {data.earningsQuality}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-800/30 rounded px-2 py-1">
          <div className="text-slate-500">Accrual Ratio</div>
          <div className={data.accrualRatio < 0.1 ? 'text-emerald-400' : 'text-amber-400'}>
            {(data.accrualRatio * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-slate-800/30 rounded px-2 py-1">
          <div className="text-slate-500">Cash Conversion</div>
          <div className={data.cashConversion > 0.8 ? 'text-emerald-400' : 'text-amber-400'}>
            {(data.cashConversion * 100).toFixed(0)}%
          </div>
        </div>
      </div>
      {data.redFlags.length > 0 && (
        <div className="text-[9px] text-red-400">
          ⚠️ {data.redFlags.join(' • ')}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function FinancialHealthDNA({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['value'];

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 animate-pulse">
        <div className="h-5 bg-slate-700 rounded w-1/3 mb-4" />
        <div className="h-48 bg-slate-800/50 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-700/50 bg-red-900/20 p-4">
        <div className="text-sm text-red-400">Error loading health data</div>
        <div className="text-xs text-red-300 mt-1">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
        <div className="text-sm text-slate-400">No health data available</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/80 overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Financial Health DNA</h3>
            <p className="text-xs text-slate-500">Comprehensive health analysis • {data.symbol}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Health Gauge */}
        <div className="text-center">
          <HealthGauge score={data.healthScore} grade={data.healthGrade} />
          <p className="text-sm text-slate-400 mt-2">{data.healthVerdict}</p>
        </div>

        {/* Radar Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data.radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis 
                dataKey="metric" 
                tick={{ fontSize: 9, fill: '#94a3b8' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 8, fill: '#64748b' }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Component Scores */}
        <div className="grid grid-cols-2 gap-4">
          {/* Piotroski */}
          <div className="bg-slate-800/30 rounded-lg p-3">
            <PiotroskiGrid components={data.piotroski.components} total={data.piotroski.totalScore} />
          </div>

          {/* Altman Z */}
          <div className="bg-slate-800/30 rounded-lg p-3">
            <ZScoreIndicator score={data.altmanZ.score} zone={data.altmanZ.zone} />
          </div>
        </div>

        {/* Cash Quality */}
        <div className="bg-slate-800/30 rounded-lg p-3">
          <CashQualityCard data={data.cashQuality} />
        </div>

        {/* Leverage & Profitability */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-800/30 rounded-lg p-3">
            <div className="text-slate-500 mb-2">Leverage</div>
            <div className="flex justify-between">
              <span>D/E Ratio</span>
              <span className="text-slate-200">{data.leverageHealth.debtToEquity.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Interest Coverage</span>
              <span className="text-slate-200">{data.leverageHealth.interestCoverage.toFixed(1)}x</span>
            </div>
            <div className={`text-center mt-2 ${
              data.leverageHealth.status === 'Conservative' ? 'text-emerald-400' :
              data.leverageHealth.status === 'Moderate' ? 'text-blue-400' :
              data.leverageHealth.status === 'Aggressive' ? 'text-amber-400' : 'text-red-400'
            }`}>
              {data.leverageHealth.status}
            </div>
          </div>
          
          <div className="bg-slate-800/30 rounded-lg p-3">
            <div className="text-slate-500 mb-2">Profitability</div>
            <div className="flex justify-between">
              <span>ROE</span>
              <span className="text-slate-200">{data.profitability.roe.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>ROA</span>
              <span className="text-slate-200">{data.profitability.roa.toFixed(1)}%</span>
            </div>
            <div className={`text-center mt-2 ${
              data.profitability.trend === 'Improving' ? 'text-emerald-400' :
              data.profitability.trend === 'Stable' ? 'text-blue-400' : 'text-red-400'
            }`}>
              {data.profitability.trend}
            </div>
          </div>
        </div>

        {/* Strengths & Concerns */}
        <div className="grid grid-cols-2 gap-4">
          {data.strengths.length > 0 && (
            <div>
              <div className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">Strengths</div>
              {data.strengths.slice(0, 3).map((s, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-1">
                  <span className="text-emerald-400">✓</span> {s}
                </div>
              ))}
            </div>
          )}
          {data.concerns.length > 0 && (
            <div>
              <div className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Concerns</div>
              {data.concerns.slice(0, 3).map((c, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-1">
                  <span className="text-red-400">!</span> {c}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-slate-800/30 border-t border-slate-800">
        <div className="text-[10px] text-slate-500">
          💡 Combines Piotroski F-Score, Altman Z-Score, and cash flow quality for holistic health assessment.
        </div>
      </div>
    </div>
  );
}
