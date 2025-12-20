// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOW RESULTS
// Results panel showing executed workflow outputs
// ═══════════════════════════════════════════════════════════════════════════

import React, { useMemo, useState } from 'react';
import type { WorkflowNode, CardNodeData } from './types';
import { DynamicCardLoader } from '@/components/output/DynamicCardLoader';
import { CATEGORIES } from '@/registry/cardRegistry';

interface WorkflowResultsProps {
  nodes: WorkflowNode[];
  symbols: string[];
  results: Record<string, any>;
  errors: Record<string, string>;
  outputMode: 'cards' | 'list' | 'report';
  onClose: () => void;
  onAddCard?: (cardId: string) => void;
}

export function WorkflowResults({
  nodes,
  symbols,
  results,
  errors,
  outputMode,
  onClose,
  onAddCard,
}: WorkflowResultsProps) {
  // Build expanded result entries (node × symbol combinations)
  const resultEntries = useMemo(() => {
    const entries: Array<{ nodeId: string; symbol: string; cardId: string; result: any; error?: string }> = [];
    
    for (const node of nodes) {
      // Skip non-card nodes (condition, merge, etc.)
      if (node.type !== 'card') continue;
      
      const data = node.data as CardNodeData;
      if (!data?.cardId) continue;
      
      for (const sym of symbols) {
        const resultKey = symbols.length > 1 ? `${node.id}-${sym}` : node.id;
        const result = results[resultKey];
        const error = errors[resultKey];
        
        if (result || error) {
          entries.push({
            nodeId: node.id,
            symbol: sym,
            cardId: data.cardId,
            result,
            error,
          });
        }
      }
    }
    
    return entries;
  }, [nodes, symbols, results, errors]);
  
  const successCount = resultEntries.filter(e => e.result && !e.error).length;
  const errorCount = resultEntries.filter(e => e.error).length;
  
  // Collect all suggested cards from results
  const allSuggestedCards = useMemo(() => {
    const suggested = new Set<string>();
    resultEntries.forEach(entry => {
      if (entry.result?.suggestedCards) {
        entry.result.suggestedCards.forEach((cardId: string) => suggested.add(cardId));
      }
    });
    // Remove cards already in workflow
    nodes.forEach(node => {
      const data = node.data as CardNodeData;
      suggested.delete(data.cardId);
    });
    return Array.from(suggested).slice(0, 4);
  }, [resultEntries, nodes]);
  
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto">
      <div className="w-full max-w-6xl m-4 my-8 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-700 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                📊 Workflow Results
              </h2>
              <div className="flex items-center gap-4 mt-1 text-sm">
                <span className="text-emerald-400">
                  ✓ {successCount} completed
                </span>
                {errorCount > 0 && (
                  <span className="text-red-400">
                    ✕ {errorCount} failed
                  </span>
                )}
                {symbols.length > 1 && (
                  <span className="text-slate-400">
                    • {symbols.length} symbols × {nodes.length} cards
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Output Mode Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg">
                {(['cards', 'list', 'report'] as const).map(mode => (
                  <span
                    key={mode}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize
                      ${outputMode === mode
                        ? 'bg-indigo-500 text-white'
                        : 'text-slate-500'
                      }`}
                  >
                    {mode}
                  </span>
                ))}
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {outputMode === 'cards' && (
            <CardsView 
              resultEntries={resultEntries}
              onAddCard={onAddCard}
              suggestedCards={allSuggestedCards}
            />
          )}
          {outputMode === 'list' && (
            <ListView resultEntries={resultEntries} />
          )}
          {outputMode === 'report' && (
            <ReportView resultEntries={resultEntries} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARDS VIEW
// ─────────────────────────────────────────────────────────────────────────────

interface ResultEntry {
  nodeId: string;
  symbol: string;
  cardId: string;
  result: any;
  error?: string;
}

interface CardsViewProps {
  resultEntries: ResultEntry[];
  onAddCard?: (cardId: string) => void;
  suggestedCards?: string[];
}

// Helper to extract a composite score from a result
function extractScore(result: any): number {
  if (!result) return 0;
  
  // Priority: explicit score, then rating, then calculate from metrics
  if (typeof result.score === 'number') return result.score;
  if (typeof result.overallScore === 'number') return result.overallScore;
  if (typeof result.rating === 'number') return result.rating * 10;
  
  // Calculate from valuation metrics if available
  if (result.percentile) return result.percentile;
  
  // Default middle score
  return 50;
}

function CardsView({ resultEntries, onAddCard, suggestedCards = [] }: CardsViewProps) {
  // Get unique symbols for comparison
  const symbols = [...new Set(resultEntries.map(e => e.symbol))];
  const isMultiStock = symbols.length > 1;
  
  // Calculate composite scores per symbol
  const symbolScores = symbols.map(sym => {
    const symEntries = resultEntries.filter(e => e.symbol === sym && e.result);
    const scores = symEntries.map(e => extractScore(e.result));
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    
    // Extract key metrics for verdict
    const valuationEntry = symEntries.find(e => e.cardId?.includes('valuation'));
    const riskEntry = symEntries.find(e => e.cardId?.includes('risk') || e.cardId?.includes('stress'));
    const growthEntry = symEntries.find(e => e.cardId?.includes('growth') || e.cardId?.includes('earnings'));
    
    return {
      symbol: sym,
      avgScore: Math.round(avgScore),
      valuationScore: valuationEntry?.result?.score || valuationEntry?.result?.percentile || null,
      riskScore: riskEntry?.result?.score || riskEntry?.result?.healthScore || null,
      growthScore: growthEntry?.result?.score || growthEntry?.result?.overallScore || null,
      pe: valuationEntry?.result?.pe || null,
      roe: symEntries.find(e => e.cardId.includes('dupont'))?.result?.roe || null,
    };
  }).sort((a, b) => b.avgScore - a.avgScore);
  
  return (
    <div className="space-y-6">
      {/* Comparison Verdict - Only show when 2+ symbols */}
      {isMultiStock && (
        <div className="p-5 bg-gradient-to-r from-indigo-500/10 to-teal-500/10 rounded-xl border border-indigo-500/30">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🏆</span>
            <h3 className="text-lg font-bold text-white">Comparison Verdict</h3>
          </div>
          
          {/* Rankings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {symbolScores.map((sym, idx) => (
              <div 
                key={sym.symbol}
                className={`p-4 rounded-lg border ${
                  idx === 0 
                    ? 'bg-emerald-500/20 border-emerald-500/50' 
                    : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold ${idx === 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                    #{idx + 1}
                  </span>
                  {idx === 0 && <span className="text-xs px-2 py-0.5 bg-emerald-500 text-white rounded-full">Best Pick</span>}
                </div>
                <div className="text-lg font-bold text-white">{sym.symbol}</div>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Composite Score</span>
                    <span className={`font-semibold ${sym.avgScore >= 70 ? 'text-emerald-400' : sym.avgScore >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                      {sym.avgScore}/100
                    </span>
                  </div>
                  {sym.valuationScore !== null && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Valuation</span>
                      <span className="text-slate-300">{sym.valuationScore}</span>
                    </div>
                  )}
                  {sym.pe !== null && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">P/E</span>
                      <span className="text-slate-300">{sym.pe.toFixed(1)}x</span>
                    </div>
                  )}
                  {sym.roe !== null && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">ROE</span>
                      <span className="text-slate-300">{sym.roe.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* AI Summary */}
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-start gap-3">
              <span className="text-lg">💡</span>
              <div className="text-sm text-slate-300 leading-relaxed">
                {symbolScores.length >= 2 && (
                  <>
                    <strong className="text-emerald-400">{symbolScores[0].symbol}</strong> ranks highest with a composite score of {symbolScores[0].avgScore}/100.
                    {symbolScores[0].avgScore - symbolScores[1].avgScore > 15 
                      ? ` It shows a clear advantage over ${symbolScores[1].symbol} (${symbolScores[1].avgScore}/100).`
                      : ` It's closely matched with ${symbolScores[1].symbol} (${symbolScores[1].avgScore}/100) - consider qualitative factors.`
                    }
                    {symbolScores[0].pe && symbolScores[1].pe && (
                      symbolScores[0].pe < symbolScores[1].pe 
                        ? ` ${symbolScores[0].symbol} is also cheaper at ${symbolScores[0].pe.toFixed(1)}x P/E vs ${symbolScores[1].pe.toFixed(1)}x.`
                        : ''
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Card Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {resultEntries.map((entry, idx) => {
          if (!entry.result) return null;
          
          return (
            <div key={`${entry.nodeId}-${entry.symbol}-${idx}`} className="rounded-xl border border-slate-700 overflow-hidden bg-slate-800/50">
              <DynamicCardLoader
                cardId={entry.cardId}
                symbol={entry.symbol}
                data={entry.result}
                onCardSelect={onAddCard}
                showNextSteps={true}
                showEducation={true}
              />
            </div>
          );
        })}
      </div>
      
      {/* Workflow-level Suggested Cards */}
      {suggestedCards.length > 0 && onAddCard && (
        <div className="mt-8 p-5 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-sm font-semibold text-slate-200">Add More Analysis</span>
            <span className="text-xs text-slate-500">Click to add to workflow</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedCards.map(cardId => (
              <button
                key={cardId}
                onClick={() => onAddCard(cardId)}
                className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 
                         text-indigo-300 hover:text-indigo-200 text-sm rounded-lg transition-all
                         flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {cardId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIST VIEW
// ─────────────────────────────────────────────────────────────────────────────

interface ListViewProps {
  resultEntries: ResultEntry[];
}

function ListView({ resultEntries }: ListViewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Card</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Symbol</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Key Metrics</th>
          </tr>
        </thead>
        <tbody>
          {resultEntries.map((entry, idx) => {
            const cardLabel = entry.cardId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            
            return (
              <tr key={`${entry.nodeId}-${entry.symbol}-${idx}`} className="border-b border-slate-800 hover:bg-slate-800/30">
                <td className="py-3 px-4">
                  <span className="text-sm font-medium text-slate-200">{cardLabel}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-mono text-teal-400">{entry.symbol}</span>
                </td>
                <td className="py-3 px-4">
                  {entry.error ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                      Error
                    </span>
                  ) : entry.result ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                      Success
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-400">
                      Pending
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {entry.result && (
                    <div className="flex flex-wrap gap-2">
                      {extractKeyMetrics(entry.result).map((metric, i) => (
                        <span 
                          key={i}
                          className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300"
                        >
                          {metric.label}: <span className="font-semibold">{metric.value}</span>
                        </span>
                      ))}
                    </div>
                  )}
                  {entry.error && (
                    <span className="text-xs text-red-400">{entry.error}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORT VIEW
// ─────────────────────────────────────────────────────────────────────────────

interface ReportViewProps {
  resultEntries: ResultEntry[];
}

function ReportView({ resultEntries }: ReportViewProps) {
  // Group entries by symbol
  const entriesBySymbol = resultEntries.reduce((acc, entry) => {
    if (!acc[entry.symbol]) acc[entry.symbol] = [];
    acc[entry.symbol].push(entry);
    return acc;
  }, {} as Record<string, ResultEntry[]>);
  
  const symbols = Object.keys(entriesBySymbol);
  
  return (
    <div className="prose prose-invert prose-slate max-w-none">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">
        Analysis Report: {symbols.join(', ')}
      </h1>
      
      <p className="text-slate-400 mb-8">
        Generated on {new Date().toLocaleDateString('en-IN', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
      
      {symbols.map(symbol => (
        <div key={symbol} className="mb-10">
          {symbols.length > 1 && (
            <h2 className="text-xl font-bold text-teal-400 mb-4 border-b border-slate-700 pb-2">
              {symbol}
            </h2>
          )}
          
          {entriesBySymbol[symbol].map((entry, idx) => {
            if (!entry.result) return null;
            
            const cardLabel = entry.cardId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            
            return (
              <section key={`${entry.nodeId}-${idx}`} className="mb-8 p-6 bg-slate-800/30 rounded-xl border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">
                  {cardLabel}
                </h3>
                
                {/* Key Findings */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {extractKeyMetrics(entry.result).map((metric, i) => (
                    <div key={i} className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="text-[11px] text-slate-500 uppercase">{metric.label}</div>
                      <div className="text-lg font-semibold text-slate-200">{metric.value}</div>
                    </div>
                  ))}
                </div>
                
                {/* Generate narrative from result */}
                <div className="text-slate-300 text-sm leading-relaxed">
                  {generateNarrative(entry.cardId, entry.result)}
                </div>
              </section>
            );
          })}
        </div>
      ))}
      
      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <p className="text-xs text-slate-500 m-0">
          <strong>Disclaimer:</strong> This report is generated for informational purposes only 
          and should not be considered financial advice. Always conduct your own research and 
          consult with a qualified financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function extractKeyMetrics(result: any): { label: string; value: string }[] {
  const metrics: { label: string; value: string }[] = [];
  
  if (!result) return metrics;
  
  // Common metric patterns
  if (result.score !== undefined) {
    metrics.push({ label: 'Score', value: String(result.score) });
  }
  if (result.rating !== undefined) {
    metrics.push({ label: 'Rating', value: String(result.rating) });
  }
  if (result.signal !== undefined) {
    metrics.push({ label: 'Signal', value: String(result.signal) });
  }
  if (result.fairValue !== undefined || result.fairValueNow !== undefined) {
    const fv = result.fairValue || result.fairValueNow;
    metrics.push({ label: 'Fair Value', value: `₹${fv.toFixed(2)}` });
  }
  if (result.currentPrice !== undefined) {
    metrics.push({ label: 'Price', value: `₹${result.currentPrice.toFixed(2)}` });
  }
  if (result.upside !== undefined) {
    metrics.push({ label: 'Upside', value: `${result.upside > 0 ? '+' : ''}${result.upside.toFixed(1)}%` });
  }
  if (result.valuation !== undefined) {
    metrics.push({ label: 'Valuation', value: String(result.valuation) });
  }
  if (result.riskScore !== undefined) {
    metrics.push({ label: 'Risk Score', value: String(result.riskScore) });
  }
  if (result.volatility !== undefined) {
    metrics.push({ label: 'Volatility', value: `${(result.volatility * 100).toFixed(1)}%` });
  }
  
  return metrics.slice(0, 4);
}

function generateNarrative(cardId: string, result: any): string {
  // Generate contextual narrative based on card type and results
  if (!result) return '';
  
  const narratives: Record<string, (r: any) => string> = {
    'fair-value-forecaster': (r) => `
      Based on discounted cash flow analysis, the fair value is estimated at ₹${r.fairValueNow?.toFixed(2) || 'N/A'} 
      with a ${r.confidence || 0}% confidence level. The current price implies a 
      ${r.upside > 0 ? 'potential upside' : 'potential downside'} of ${Math.abs(r.upside || 0).toFixed(1)}%. 
      The stock appears to be ${r.valuation?.toLowerCase() || 'fairly valued'}.
    `,
    'piotroski-score': (r) => `
      The Piotroski F-Score is ${r.score || 'N/A'} out of 9, indicating 
      ${r.score >= 7 ? 'strong' : r.score >= 4 ? 'moderate' : 'weak'} fundamental health. 
      The company shows ${r.profitability?.positive || 0} positive profitability signals 
      and ${r.leverage?.positive || 0} positive leverage signals.
    `,
    'risk-health-dashboard': (r) => `
      The overall risk assessment indicates ${r.overallRisk || 'moderate'} risk levels. 
      Key concerns include ${r.topRisks?.slice(0, 2).join(', ') || 'volatility and market conditions'}. 
      The risk score of ${r.riskScore || 'N/A'} suggests ${r.recommendation || 'caution is advised'}.
    `,
    'growth-summary': (r) => `
      Revenue growth stands at ${r.revenueGrowth?.toFixed(1) || 'N/A'}% with earnings growth of 
      ${r.earningsGrowth?.toFixed(1) || 'N/A'}%. The company demonstrates 
      ${r.sustainableGrowth ? 'sustainable' : 'variable'} growth patterns with 
      margin trends showing ${r.marginTrend || 'stability'}.
    `,
  };
  
  const narrativeFn = narratives[cardId];
  if (narrativeFn) {
    return narrativeFn(result).trim().replace(/\s+/g, ' ');
  }
  
  // Default narrative
  const metrics = extractKeyMetrics(result);
  if (metrics.length > 0) {
    return `Key findings: ${metrics.map(m => `${m.label} at ${m.value}`).join(', ')}.`;
  }
  
  return 'Analysis completed successfully.';
}

export default WorkflowResults;
