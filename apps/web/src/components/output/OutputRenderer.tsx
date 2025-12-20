import React, { useMemo } from 'react';
import { DynamicCardLoader } from './DynamicCardLoader';
import { getCardById, CATEGORIES } from '@/registry/cardRegistry';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type OutputMode = 'cards' | 'list' | 'report';

interface WorkflowResult {
  nodeId: string;
  cardId: string;
  symbol: string;
  data: any;
  error?: string;
}

interface OutputRendererProps {
  mode: OutputMode;
  results: WorkflowResult[];
  isLoading?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// CARD DECK OUTPUT - Visual grid of cards
// ═══════════════════════════════════════════════════════════════════════════

function CardDeckOutput({ results }: { results: WorkflowResult[] }) {
  // Group by category for better organization
  const grouped = useMemo(() => {
    const groups: Record<string, WorkflowResult[]> = {};
    results.forEach(r => {
      const card = getCardById(r.cardId);
      const cat = card?.category || 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(r);
    });
    return groups;
  }, [results]);

  const categories = Object.keys(grouped);

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <div className="text-4xl mb-2">📊</div>
        <div>No results yet. Run a workflow to see outputs.</div>
      </div>
    );
  }

  // Single category - just show grid
  if (categories.length === 1) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map(r => (
          <DynamicCardLoader
            key={r.nodeId}
            cardId={r.cardId}
            symbol={r.symbol}
            preloadedData={r.data}
          />
        ))}
      </div>
    );
  }

  // Multiple categories - group with headers
  return (
    <div className="space-y-6">
      {CATEGORIES.filter(c => grouped[c.id]).map(cat => (
        <div key={cat.id}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
            <span className="text-sm font-medium text-slate-300">{cat.label}</span>
            <span className="text-xs text-slate-600">({grouped[cat.id].length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped[cat.id].map(r => (
              <DynamicCardLoader
                key={r.nodeId}
                cardId={r.cardId}
                symbol={r.symbol}
                preloadedData={r.data}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LIST OUTPUT - Data table view
// ═══════════════════════════════════════════════════════════════════════════

function ListOutput({ results }: { results: WorkflowResult[] }) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No results yet.
      </div>
    );
  }

  // Extract key metrics from each result
  const rows = results.map(r => {
    const card = getCardById(r.cardId);
    const data = r.data || {};
    
    // Common metric extraction
    const metrics: Record<string, any> = {
      Card: card?.label || r.cardId,
      Symbol: r.symbol || data.symbol || '-',
    };

    // Try to extract common patterns
    if (data.score !== undefined) metrics['Score'] = data.score;
    if (data.overallScore !== undefined) metrics['Score'] = data.overallScore;
    if (data.totalScore !== undefined) metrics['Score'] = data.totalScore;
    if (data.verdict) metrics['Verdict'] = data.verdict;
    if (data.signal) metrics['Signal'] = data.signal;
    if (data.currentPrice !== undefined) metrics['Price'] = `$${data.currentPrice.toFixed(2)}`;
    if (data.fairValueNow !== undefined) metrics['Fair Value'] = `$${data.fairValueNow.toFixed(2)}`;
    if (data.upside !== undefined) metrics['Upside'] = `${data.upside > 0 ? '+' : ''}${data.upside.toFixed(1)}%`;
    if (data.marginOfSafety !== undefined) metrics['MoS'] = `${data.marginOfSafety.toFixed(1)}%`;
    if (data.roe !== undefined) metrics['ROE'] = `${data.roe.toFixed(1)}%`;
    if (data.currentYield !== undefined) metrics['Yield'] = `${data.currentYield.toFixed(2)}%`;
    if (data.riskLevel) metrics['Risk'] = data.riskLevel;
    if (data.growthTier) metrics['Growth'] = data.growthTier;
    if (data.trend) metrics['Trend'] = data.trend;
    if (data.grade) metrics['Grade'] = data.grade;
    if (data.confidence !== undefined) metrics['Confidence'] = `${data.confidence}%`;

    return { nodeId: r.nodeId, cardId: r.cardId, metrics, error: r.error };
  });

  // Get all unique columns
  const allColumns = new Set<string>();
  rows.forEach(r => Object.keys(r.metrics).forEach(k => allColumns.add(k)));
  const columns = Array.from(allColumns);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-700">
            {columns.map(col => (
              <th key={col} className="text-left py-2 px-3 text-slate-400 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.nodeId} className="border-b border-slate-800 hover:bg-slate-800/30">
              {columns.map(col => {
                const val = row.metrics[col];
                let className = 'py-2 px-3 text-slate-300';
                
                // Color coding for common patterns
                if (col === 'Verdict' || col === 'Signal') {
                  if (typeof val === 'string') {
                    if (val.toLowerCase().includes('buy') || val.toLowerCase().includes('bullish') || val.toLowerCase().includes('strong')) {
                      className += ' text-emerald-400';
                    } else if (val.toLowerCase().includes('sell') || val.toLowerCase().includes('bearish') || val.toLowerCase().includes('weak')) {
                      className += ' text-red-400';
                    }
                  }
                }
                if (col === 'Upside' && typeof val === 'string') {
                  className += val.startsWith('+') ? ' text-emerald-400' : ' text-red-400';
                }
                if (col === 'Grade' && typeof val === 'string') {
                  if (val === 'A' || val === 'B') className += ' text-emerald-400';
                  else if (val === 'D' || val === 'F') className += ' text-red-400';
                }

                return (
                  <td key={col} className={className}>
                    {val ?? '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// REPORT OUTPUT - Narrative markdown generation
// ═══════════════════════════════════════════════════════════════════════════

function ReportOutput({ results }: { results: WorkflowResult[] }) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No results yet.
      </div>
    );
  }

  // Generate narrative sections
  const sections = results.map(r => {
    const card = getCardById(r.cardId);
    const data = r.data || {};
    const symbol = r.symbol || data.symbol || 'Unknown';

    let narrative = '';
    let keyInsight = '';
    let verdict = '';

    // Generate narrative based on card type
    switch (r.cardId) {
      case 'fair-value-forecaster':
        narrative = `The Fair Value Forecaster estimates ${symbol} at $${data.fairValueNow?.toFixed(2) || 'N/A'} with a ${data.upside > 0 ? 'potential upside' : 'downside risk'} of ${Math.abs(data.upside || 0).toFixed(1)}%.`;
        keyInsight = `Confidence level: ${data.confidence || 'N/A'}%. Primary drivers include earnings growth (${data.drivers?.earningsGrowth || 0}%) and revenue expansion (${data.drivers?.revenueGrowth || 0}%).`;
        verdict = data.valuation || 'N/A';
        break;

      case 'valuation-summary':
        narrative = `${symbol} trades at a P/E of ${data.multiples?.pe?.toFixed(1) || 'N/A'}x vs. sector median of ${data.multiples?.peMedian?.toFixed(1) || 'N/A'}x.`;
        keyInsight = `Overall valuation score: ${data.overallScore || 'N/A'}/100, ranking at the ${data.percentileRank || 'N/A'}th percentile.`;
        verdict = data.verdict || 'N/A';
        break;

      case 'piotroski-score':
        narrative = `${symbol} scores ${data.totalScore || 'N/A'}/9 on the Piotroski F-Score, indicating ${data.verdict || 'N/A'} financial health.`;
        keyInsight = `Trend is ${data.trend || 'N/A'}. Previous score was ${data.previousScore || 'N/A'}.`;
        verdict = `F-Score: ${data.totalScore || 'N/A'}`;
        break;

      case 'dupont-analysis':
        narrative = `ROE of ${data.roe?.toFixed(1) || 'N/A'}% is driven primarily by ${data.primaryDriver || 'N/A'}.`;
        keyInsight = `Net margin: ${data.decomposition?.netProfitMargin?.toFixed(1) || 'N/A'}%, Asset turnover: ${data.decomposition?.assetTurnover?.toFixed(2) || 'N/A'}x, Leverage: ${data.decomposition?.equityMultiplier?.toFixed(2) || 'N/A'}x.`;
        verdict = `${data.primaryDriver || 'N/A'}-driven`;
        break;

      case 'growth-summary':
        narrative = `${symbol} exhibits ${data.growthTier || 'N/A'} characteristics with ${data.metrics?.revenueGrowth3Y?.toFixed(1) || 'N/A'}% 3Y revenue CAGR.`;
        keyInsight = `EPS growth: ${data.metrics?.epsGrowth3Y?.toFixed(1) || 'N/A'}% (3Y), FCF growth: ${data.metrics?.fcfGrowth3Y?.toFixed(1) || 'N/A'}% (3Y).`;
        verdict = data.growthTier || 'N/A';
        break;

      case 'risk-health-dashboard':
        narrative = `Overall risk level is ${data.riskLevel || 'N/A'} with a health score of ${100 - (data.overallRiskScore || 0)}/100.`;
        keyInsight = data.alerts?.length > 0 
          ? `${data.alerts.length} active alert(s): ${data.alerts.map((a: any) => a.message).join('; ')}`
          : 'No critical alerts detected.';
        verdict = data.riskLevel || 'N/A';
        break;

      case 'dividend-crystal-ball':
        narrative = `${symbol} offers a ${data.currentYield?.toFixed(2) || 'N/A'}% yield with ${data.consecutiveYearsGrowth || 'N/A'} consecutive years of dividend growth.`;
        keyInsight = `Payout ratio: ${data.payoutRatio?.toFixed(0) || 'N/A'}%. Dividend safety: ${data.dividendSafety || 'N/A'}.`;
        verdict = data.dividendSafety || 'N/A';
        break;

      default:
        narrative = `Analysis completed for ${card?.label || r.cardId}.`;
        keyInsight = data.verdict || data.signal || data.score ? 
          `Result: ${data.verdict || data.signal || data.score}` : 
          'See detailed data below.';
        verdict = data.verdict || data.signal || '-';
    }

    return {
      cardId: r.cardId,
      cardLabel: card?.label || r.cardId,
      category: card?.category || 'other',
      symbol,
      narrative,
      keyInsight,
      verdict,
      data,
    };
  });

  // Group by symbol if multiple
  const symbols = [...new Set(sections.map(s => s.symbol))];
  const now = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="prose prose-invert prose-sm max-w-none">
      {/* Report Header */}
      <div className="border-b border-slate-700 pb-4 mb-6">
        <h1 className="text-xl font-bold text-slate-100 mb-1">
          Analysis Report: {symbols.join(', ')}
        </h1>
        <p className="text-sm text-slate-400">
          Generated on {now} • {sections.length} analytics applied
        </p>
      </div>

      {/* Executive Summary */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-200 mb-3">Executive Summary</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {sections.slice(0, 3).map(s => (
            <div key={s.cardId} className="bg-slate-800/30 rounded-lg p-3">
              <div className="text-[10px] uppercase text-slate-500">{s.cardLabel}</div>
              <div className="text-sm font-medium text-slate-200 mt-1">{s.verdict}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-300">
          This report provides a comprehensive analysis using {sections.length} different analytical frameworks.
          Key findings are summarized below with detailed insights for each methodology.
        </p>
      </section>

      {/* Detailed Analysis by Category */}
      {CATEGORIES.filter(c => sections.some(s => s.category === c.id)).map(cat => {
        const catSections = sections.filter(s => s.category === cat.id);
        return (
          <section key={cat.id} className="mb-8">
            <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              {cat.label} Analysis
            </h2>
            {catSections.map(s => (
              <div key={s.cardId} className="mb-4 bg-slate-800/20 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-300 mb-2">{s.cardLabel}</h3>
                <p className="text-sm text-slate-400 mb-2">{s.narrative}</p>
                <p className="text-xs text-slate-500 italic">{s.keyInsight}</p>
              </div>
            ))}
          </section>
        );
      })}

      {/* Conclusion */}
      <section className="border-t border-slate-700 pt-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-3">Conclusion</h2>
        <p className="text-sm text-slate-400">
          Based on the {sections.length} analytics applied, the analysis provides a multi-dimensional 
          view of {symbols.join(' and ')}. Investors should consider these findings in context of 
          their investment objectives and risk tolerance.
        </p>
        <p className="text-xs text-slate-600 mt-4">
          Disclaimer: This report is for informational purposes only and does not constitute investment advice.
        </p>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN OUTPUT RENDERER
// ═══════════════════════════════════════════════════════════════════════════

export function OutputRenderer({ mode, results, isLoading }: OutputRendererProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full motion-safe:animate-spin" />
          <span>Running workflow...</span>
        </div>
      </div>
    );
  }

  switch (mode) {
    case 'cards':
      return <CardDeckOutput results={results} />;
    case 'list':
      return <ListOutput results={results} />;
    case 'report':
      return <ReportOutput results={results} />;
    default:
      return <CardDeckOutput results={results} />;
  }
}

// Mode selector component
interface OutputModeSelectorProps {
  mode: OutputMode;
  onChange: (mode: OutputMode) => void;
}

export function OutputModeSelector({ mode, onChange }: OutputModeSelectorProps) {
  const modes: { id: OutputMode; label: string; icon: string }[] = [
    { id: 'cards', label: 'Cards', icon: '▦' },
    { id: 'list', label: 'Table', icon: '☰' },
    { id: 'report', label: 'Report', icon: '📄' },
  ];

  return (
    <div className="flex bg-slate-800 rounded-lg p-0.5">
      {modes.map(m => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            mode === m.id
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="mr-1">{m.icon}</span>
          {m.label}
        </button>
      ))}
    </div>
  );
}

export default OutputRenderer;
