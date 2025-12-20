import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  CardOutput,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface Holding {
  symbol: string;
  buyDate: string;
  buyPrice: number;
  quantity: number;
  currentPrice: number;
  holdingPeriod: number; // in months
  isLongTerm: boolean; // >12 months
  gain: number;
  gainPct: number;
}

interface TaxBreakdown {
  ltcgGains: number;
  stcgGains: number;
  ltcgLosses: number;
  stcgLosses: number;
  netLTCG: number;
  netSTCG: number;
  ltcgExemption: number; // ₹1.25L exemption
  taxableLTCG: number;
  ltcgTax: number; // 12.5%
  stcgTax: number; // 20%
  totalTax: number;
  effectiveTaxRate: number;
}

interface TaxLossHarvestOpportunity {
  symbol: string;
  currentLoss: number;
  potentialTaxSaving: number;
  recommendedAction: string;
  canOffset: string[];
}

interface DividendTax {
  totalDividends: number;
  tdsDeducted: number;
  additionalTaxDue: number;
  effectiveRate: number;
  exemptionUsed: number; // ₹10,000 TDS threshold
}

export interface TaxCalculatorData {
  asOf: string;
  financialYear: string;
  
  // Portfolio Holdings
  holdings: Holding[];
  
  // Tax Calculation
  taxBreakdown: TaxBreakdown;
  
  // Tax Loss Harvesting
  harvestingOpportunities: TaxLossHarvestOpportunity[];
  potentialTaxSaving: number;
  
  // Dividend Tax
  dividendTax: DividendTax;
  
  // Grandfathering (for pre-2018 holdings)
  grandfatheredGains: number;
  
  // Tax Planning Suggestions
  suggestions: string[];
  
  // Estimated vs Actual Comparison
  estimatedAnnualTax: number;
  
  // Holding Period Analysis
  holdingsApproachingLongTerm: Holding[]; // Within 60 days of becoming long-term
  
  // Summary Stats
  totalInvested: number;
  currentValue: number;
  totalUnrealizedGain: number;
  totalRealizedGain: number;
  realizedGainsThisYear: number;
  
  // Insights
  insights: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

export function getTaxCalculatorOutput(data: TaxCalculatorData): CardOutput {
  const { taxBreakdown, potentialTaxSaving, financialYear, insights: dataInsights } = data;
  
  const sentiment = taxBreakdown.totalTax < data.estimatedAnnualTax ? 'positive' : 'neutral';
  const signalStrength = potentialTaxSaving > 10000 ? 5 : 3;
  
  return {
    cardId: "tax-calculator",
    symbol: "PORTFOLIO",
    generatedAt: new Date().toISOString(),
    
    summary: {
      headline: `${financialYear} Tax Liability: ₹${(taxBreakdown.totalTax / 1000).toFixed(1)}K`,
      body: `LTCG: ₹${(taxBreakdown.ltcgTax / 1000).toFixed(1)}K (12.5%), STCG: ₹${(taxBreakdown.stcgTax / 1000).toFixed(1)}K (20%). ${potentialTaxSaving > 0 ? `Potential saving: ₹${(potentialTaxSaving / 1000).toFixed(1)}K via tax-loss harvesting.` : ''}`,
      sentiment,
      signalStrength,
    },
    
    metrics: [
      createMetric("Total Tax", taxBreakdown.totalTax, { format: "currency" }),
      createMetric("LTCG Tax (12.5%)", taxBreakdown.ltcgTax, { format: "currency" }),
      createMetric("STCG Tax (20%)", taxBreakdown.stcgTax, { format: "currency" }),
      createMetric("LTCG Exemption Used", taxBreakdown.ltcgExemption, { format: "currency" }),
      createMetric("Effective Tax Rate", taxBreakdown.effectiveTaxRate, { format: "percent" }),
      createMetric("Tax Saving Opportunity", potentialTaxSaving, { format: "currency" }),
    ],
    
    insights: dataInsights.map((text, i) => createInsight(
      text,
      i === 0 ? "high" : "medium",
      "neutral"
    )),
    
    nextSteps: [
      potentialTaxSaving > 0 ? `Consider tax-loss harvesting to save ₹${(potentialTaxSaving / 1000).toFixed(1)}K` : "",
      data.holdingsApproachingLongTerm.length > 0 ? `${data.holdingsApproachingLongTerm.length} holdings approaching long-term status - consider holding` : "",
      taxBreakdown.netLTCG < 125000 ? "LTCG within ₹1.25L exemption limit" : "",
      ...data.suggestions.slice(0, 2),
    ].filter(Boolean),
    
    metadata: {
      dataAsOf: data.asOf,
      confidence: 0.9,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface TaxCalculatorCardProps {
  data?: TaxCalculatorData | null;
  isLoading?: boolean;
  error?: string | null;
}

export default function TaxCalculatorCard({ data, isLoading, error }: TaxCalculatorCardProps) {
  const categoryStyle = CATEGORY_STYLES['portfolio'];

  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'harvest'>('overview');
  
  if (isLoading) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 border-l-4 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4" />
        <div className="h-64 bg-slate-800 rounded" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
        <div className="text-slate-400">{error || 'No data available'}</div>
      </div>
    );
  }

  const {
    asOf,
    financialYear,
    holdings,
    taxBreakdown,
    harvestingOpportunities,
    potentialTaxSaving,
    dividendTax,
    grandfatheredGains,
    suggestions,
    holdingsApproachingLongTerm,
    totalInvested,
    currentValue,
    totalUnrealizedGain,
    realizedGainsThisYear,
    insights,
  } = data;

  const COLORS = ['#10b981', '#ef4444', '#6366f1', '#f59e0b'];
  
  // Pie chart data for tax breakdown
  const taxPieData = [
    { name: 'LTCG Tax', value: taxBreakdown.ltcgTax, color: '#10b981' },
    { name: 'STCG Tax', value: taxBreakdown.stcgTax, color: '#f59e0b' },
    { name: 'Dividend Tax', value: dividendTax.additionalTaxDue, color: '#6366f1' },
  ].filter(d => d.value > 0);

  // Holdings breakdown for chart
  const holdingsBarData = holdings.slice(0, 8).map(h => ({
    symbol: h.symbol,
    gain: h.gain,
    type: h.isLongTerm ? 'LTCG' : 'STCG',
  }));

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🧮 Tax Calculator
          </h3>
          <p className="text-slate-400 text-sm">FY {financialYear} • {asOf}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs">Estimated Tax Liability</p>
          <p className="text-2xl font-bold text-white">₹{(taxBreakdown.totalTax).toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['overview', 'holdings', 'harvest'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab 
                ? 'bg-indigo-500 text-white' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'overview' ? '📊 Overview' : tab === 'holdings' ? '📋 Holdings' : '🌾 Tax Harvest'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Main Tax Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/30">
              <p className="text-emerald-400 text-xs font-medium mb-1">LTCG (12.5%)</p>
              <p className="text-xl font-bold text-white">₹{taxBreakdown.ltcgTax.toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-400">On ₹{taxBreakdown.taxableLTCG.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
              <p className="text-amber-400 text-xs font-medium mb-1">STCG (20%)</p>
              <p className="text-xl font-bold text-white">₹{taxBreakdown.stcgTax.toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-400">On ₹{taxBreakdown.netSTCG.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/30">
              <p className="text-indigo-400 text-xs font-medium mb-1">Dividend Tax</p>
              <p className="text-xl font-bold text-white">₹{dividendTax.additionalTaxDue.toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-400">After TDS: ₹{dividendTax.tdsDeducted.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
              <p className="text-purple-400 text-xs font-medium mb-1">Effective Rate</p>
              <p className="text-xl font-bold text-white">{taxBreakdown.effectiveTaxRate.toFixed(2)}%</p>
              <p className="text-xs text-slate-400">On total gains</p>
            </div>
          </div>

          {/* Tax Breakdown Chart */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Tax Composition</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taxPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ₹${(value/1000).toFixed(1)}K`}
                      labelLine={false}
                    >
                      {taxPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Gains/Losses Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">LTCG Gains</span>
                  <span className="text-emerald-400 font-semibold">+₹{taxBreakdown.ltcgGains.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">LTCG Losses</span>
                  <span className="text-red-400 font-semibold">-₹{taxBreakdown.ltcgLosses.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">STCG Gains</span>
                  <span className="text-emerald-400 font-semibold">+₹{taxBreakdown.stcgGains.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">STCG Losses</span>
                  <span className="text-red-400 font-semibold">-₹{taxBreakdown.stcgLosses.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-3 border-t border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">LTCG Exemption (₹1.25L)</span>
                    <span className="text-indigo-400 font-semibold">-₹{taxBreakdown.ltcgExemption.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                {grandfatheredGains > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Grandfathered (Pre-2018)</span>
                    <span className="text-purple-400 font-semibold">₹{grandfatheredGains.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dividend Tax Section */}
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-slate-300 mb-3">Dividend Tax (Taxed at Slab Rate)</h4>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-400">Total Dividends</p>
                <p className="text-lg font-semibold text-white">₹{dividendTax.totalDividends.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">TDS Deducted</p>
                <p className="text-lg font-semibold text-amber-400">₹{dividendTax.tdsDeducted.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Additional Due</p>
                <p className="text-lg font-semibold text-red-400">₹{dividendTax.additionalTaxDue.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Effective Rate</p>
                <p className="text-lg font-semibold text-white">{dividendTax.effectiveRate.toFixed(1)}%</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">* TDS threshold: ₹10,000 (from April 2025). Dividends above ₹10,000 attract 10% TDS.</p>
          </div>

          {/* Approaching Long-Term */}
          {holdingsApproachingLongTerm.length > 0 && (
            <div className="bg-amber-500/10 rounded-lg p-4 mb-6 border border-amber-500/30">
              <h4 className="text-sm font-medium text-amber-400 mb-2">⏰ Holdings Approaching Long-Term Status</h4>
              <p className="text-xs text-slate-400 mb-3">Consider holding these for 12+ months to qualify for lower 12.5% LTCG rate instead of 20% STCG</p>
              <div className="grid grid-cols-3 gap-2">
                {holdingsApproachingLongTerm.slice(0, 6).map((h, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-lg p-2">
                    <p className="text-white font-medium">{h.symbol}</p>
                    <p className="text-xs text-slate-400">{h.holdingPeriod} months • {12 - h.holdingPeriod} more to go</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Holdings Tab */}
      {activeTab === 'holdings' && (
        <>
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-slate-300 mb-3">Holdings by Gain/Loss</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={holdingsBarData} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 10 }}>
                  <XAxis type="number" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis dataKey="symbol" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [`₹${value.toLocaleString('en-IN')}`, name]}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  />
                  <Bar 
                    dataKey="gain" 
                    fill="#6366f1"
                    label={{ position: 'right', fill: '#94a3b8', fontSize: 10, formatter: (v: number) => v > 0 ? 'LTCG' : 'Loss' }}
                  >
                    {holdingsBarData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.gain >= 0 ? (entry.type === 'LTCG' ? '#10b981' : '#f59e0b') : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-slate-400">Symbol</th>
                  <th className="px-4 py-3 text-right text-slate-400">Buy Price</th>
                  <th className="px-4 py-3 text-right text-slate-400">Current</th>
                  <th className="px-4 py-3 text-right text-slate-400">Gain/Loss</th>
                  <th className="px-4 py-3 text-center text-slate-400">Holding</th>
                  <th className="px-4 py-3 text-center text-slate-400">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {holdings.slice(0, 10).map((h, i) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-white font-medium">{h.symbol}</td>
                    <td className="px-4 py-3 text-right text-slate-300">₹{h.buyPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-300">₹{h.currentPrice.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${h.gain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {h.gain >= 0 ? '+' : ''}₹{h.gain.toLocaleString('en-IN')} ({h.gainPct.toFixed(1)}%)
                    </td>
                    <td className="px-4 py-3 text-center text-slate-400">{h.holdingPeriod}M</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs ${h.isLongTerm ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {h.isLongTerm ? 'LTCG' : 'STCG'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Tax Harvest Tab */}
      {activeTab === 'harvest' && (
        <>
          {/* Potential Savings */}
          <div className="bg-emerald-500/10 rounded-lg p-4 mb-6 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-emerald-400">Potential Tax Saving</h4>
                <p className="text-xs text-slate-400">By harvesting losses to offset gains</p>
              </div>
              <p className="text-3xl font-bold text-white">₹{potentialTaxSaving.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Harvesting Opportunities */}
          <div className="space-y-4">
            {harvestingOpportunities.length > 0 ? (
              harvestingOpportunities.map((opp, i) => (
                <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="text-white font-semibold">{opp.symbol}</h5>
                      <p className="text-xs text-red-400">Unrealized Loss: ₹{opp.currentLoss.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-semibold">Save ₹{opp.potentialTaxSaving.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{opp.recommendedAction}</p>
                  {opp.canOffset.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-slate-400">Can offset:</span>
                      {opp.canOffset.map((symbol, j) => (
                        <span key={j} className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">
                          {symbol}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                <p className="text-slate-400">No tax-loss harvesting opportunities identified</p>
                <p className="text-xs text-slate-500 mt-2">All positions are in profit or losses have been harvested</p>
              </div>
            )}
          </div>

          {/* Tax Loss Harvesting Rules */}
          <div className="bg-slate-800/30 rounded-lg p-4 mt-6">
            <h4 className="text-sm font-medium text-slate-300 mb-3">📚 Tax Loss Harvesting Rules</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p>• STCG losses can offset both STCG and LTCG gains</p>
              <p>• LTCG losses can only offset LTCG gains</p>
              <p>• Unused losses can be carried forward for 8 years</p>
              <p>• Avoid wash sale - don't buy back within 30 days to claim loss</p>
              <p>• Harvest losses before March 31 for current FY benefit</p>
            </div>
          </div>
        </>
      )}

      {/* Suggestions */}
      <div className="bg-slate-800/30 rounded-lg p-4 mt-6">
        <h4 className="text-sm font-medium text-slate-300 mb-3">💡 Tax Planning Suggestions</h4>
        <div className="space-y-2">
          {suggestions.map((suggestion, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-indigo-400 mt-0.5">•</span>
              <span className="text-slate-300">{suggestion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <p className="text-xs text-amber-400">
          ⚠️ This is an estimate for planning purposes only. Consult a tax professional for accurate tax filing. 
          Tax rates: LTCG 12.5% (above ₹1.25L exemption), STCG 20%. Rates effective from FY 2024-25.
        </p>
      </div>
    </div>
  );
}
