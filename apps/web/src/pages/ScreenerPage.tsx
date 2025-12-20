import React, { useState } from 'react';
import { SmartCommandBar, ProcessedResults } from '@/components/screener';

// ═══════════════════════════════════════════════════════════════════════════
// SCREENER PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function ScreenerPage() {
  const [lastResults, setLastResults] = useState<ProcessedResults | null>(null);
  
  const handleResultsChange = (results: ProcessedResults) => {
    setLastResults(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <a href="#/" className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-medium hover:text-blue-300">
                ← Monomorph
              </a>
              <h1 className="text-xl font-semibold text-slate-100">Smart Screener</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">Natural language • Numeric engine • Smart output</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        {!lastResults && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-100 mb-3">
              Ask Anything About Stocks
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Screen, compare, analyze, or generate reports using plain English. 
              The engine understands your intent and delivers the right output format.
            </p>
          </div>
        )}

        {/* Smart Command Bar */}
        <SmartCommandBar onResultsChange={handleResultsChange} />

        {/* How It Works Section */}
        {!lastResults && (
          <div className="mt-16">
            <h3 className="text-lg font-semibold text-slate-200 mb-6 text-center">How It Works</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Screen */}
              <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                <div className="text-3xl mb-3">📋</div>
                <div className="text-lg font-semibold text-slate-200 mb-2">Screen → LIST</div>
                <div className="text-sm text-slate-400 mb-4">
                  Filter stocks by criteria and get a sortable table
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-slate-900/50 rounded text-slate-300 font-mono">
                    "stocks with PE &lt; 15 and ROE &gt; 18%"
                  </div>
                  <div className="p-2 bg-slate-900/50 rounded text-slate-300 font-mono">
                    "energy stocks with Mcap &gt; $5B"
                  </div>
                </div>
              </div>
              
              {/* Analyze */}
              <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                <div className="text-3xl mb-3">📊</div>
                <div className="text-lg font-semibold text-slate-200 mb-2">Analyze → CARDS</div>
                <div className="text-sm text-slate-400 mb-4">
                  Deep dive with visual cards, charts, and key metrics
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-slate-900/50 rounded text-slate-300 font-mono">
                    "compare TCS vs INFY vs WIPRO"
                  </div>
                  <div className="p-2 bg-slate-900/50 rounded text-slate-300 font-mono">
                    "analyze TCS performance"
                  </div>
                </div>
              </div>
              
              {/* Report */}
              <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                <div className="text-3xl mb-3">📝</div>
                <div className="text-lg font-semibold text-slate-200 mb-2">Study → REPORT</div>
                <div className="text-sm text-slate-400 mb-4">
                  Comprehensive report with insights and recommendations
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-slate-900/50 rounded text-slate-300 font-mono">
                    "comprehensive report on RELIANCE"
                  </div>
                  <div className="p-2 bg-slate-900/50 rounded text-slate-300 font-mono">
                    "summarize tech sector"
                  </div>
                </div>
              </div>
            </div>
            
            {/* Numeric Pipeline */}
            <div className="mt-12 p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <h4 className="text-lg font-semibold text-slate-200 mb-4">🔢 Numeric Pipeline Engine</h4>
              <div className="text-sm text-slate-400 mb-4">
                Every query is processed through a pure numeric pipeline - no visuals until the final step:
              </div>
              <div className="flex items-center gap-2 text-xs overflow-x-auto pb-2">
                {['Load Data', 'Filter', 'Score', 'Calculate', 'Rank', 'Sort', 'Limit', 'Output'].map((step, i) => (
                  <React.Fragment key={i}>
                    <span className="px-3 py-2 bg-slate-700/50 text-slate-300 rounded-lg whitespace-nowrap">
                      {step}
                    </span>
                    {i < 7 && <span className="text-blue-500">→</span>}
                  </React.Fragment>
                ))}
              </div>
              
              <div className="mt-6 grid md:grid-cols-4 gap-4">
                {OPERATORS.map((op, i) => (
                  <div key={i} className="p-3 bg-slate-900/50 rounded-lg">
                    <div className="text-sm font-semibold text-blue-400">{op.name}</div>
                    <div className="text-xs text-slate-500">{op.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Monomorph Screener Engine v2.0</span>
            <span>100+ stocks • 14 operators • 3 output modes • 12 visualizations</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const OPERATORS = [
  { name: 'Filter', description: 'Remove rows by conditions' },
  { name: 'Rank', description: 'Assign rank by field value' },
  { name: 'Score', description: 'Weighted composite scoring' },
  { name: 'Calculate', description: 'Create derived fields' },
  { name: 'Compare', description: 'Relative/percentile comparison' },
  { name: 'Merge', description: 'Combine multiple datasets' },
  { name: 'Aggregate', description: 'Sum, avg, min, max, median' },
  { name: 'Group', description: 'Group by field value' },
  { name: 'Sort', description: 'Multi-field sorting' },
  { name: 'Limit', description: 'Take top N rows' },
  { name: 'Transform', description: 'Log, sqrt, percent, round' },
  { name: 'Normalize', description: 'Min-max, z-score, percentile' },
  { name: 'Pivot', description: 'Pivot for visualization' },
  { name: 'Join', description: 'Join datasets by key' },
];
