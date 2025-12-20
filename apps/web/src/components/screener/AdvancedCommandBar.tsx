import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Screener, ScreenerResponse, Stock, QUERYABLE_FIELDS, SECTORS } from '@/lib/screener';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface AdvancedCommandBarProps {
  onResultsChange?: (results: Stock[], response: ScreenerResponse) => void;
  placeholder?: string;
  showHelp?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function AdvancedCommandBar({ 
  onResultsChange, 
  placeholder = "Try: 'stocks with PE < 15 and ROE > 20%' or 'energy sector Mcap > $5B'",
  showHelp = true,
}: AdvancedCommandBarProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ScreenerResponse | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const screenerRef = useRef<Screener | null>(null);
  
  // Initialize screener
  useEffect(() => {
    screenerRef.current = new Screener();
  }, []);
  
  // Keyboard shortcut to focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  
  // Execute query
  const executeQuery = useCallback((query: string) => {
    if (!query.trim() || !screenerRef.current) return;
    
    setIsLoading(true);
    
    // Simulate slight delay for UX
    setTimeout(() => {
      const result = screenerRef.current!.query(query);
      setResponse(result);
      setIsLoading(false);
      
      // Add to history
      setHistory(prev => [query, ...prev.filter(h => h !== query)].slice(0, 20));
      setHistoryIndex(-1);
      
      // Callback
      if (onResultsChange) {
        onResultsChange(result.data, result);
      }
    }, 100);
  }, [onResultsChange]);
  
  // Handle submit
  const handleSubmit = () => {
    if (input.trim()) {
      executeQuery(input);
    }
  };
  
  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };
  
  // Clear context
  const handleClear = () => {
    screenerRef.current?.clearContext();
    setResponse(null);
    setInput('');
  };
  
  // Quick filter suggestions
  const quickFilters = [
    { label: 'Low PE Value', query: 'stocks with PE < 12 and ROE > 15%' },
    { label: 'High Growth', query: 'stocks with cagr3y > 20% and revenue growth > 15%' },
    { label: 'Large Cap Tech', query: 'technology stocks with Mcap > $50B' },
    { label: 'Dividend Yield', query: 'stocks with dividend yield > 3% and PE < 20' },
    { label: 'Volume Surge', query: 'stocks with ascending volume in last 5 days' },
    { label: 'Energy Sector', query: 'energy stocks with PE < 10' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Command Input */}
      <div className="relative">
        <div className="flex items-center bg-slate-800/80 backdrop-blur-xl border border-slate-600 rounded-2xl shadow-2xl overflow-hidden focus-within:border-blue-500 transition-colors">
          {/* Search Icon */}
          <div className="pl-5 pr-3">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="flex-1 py-4 bg-transparent text-slate-100 placeholder-slate-500 outline-none text-base"
          />
          
          {/* Actions */}
          <div className="flex items-center gap-2 pr-3">
            {response && (
              <button
                onClick={handleClear}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            )}
            <span className="text-xs text-slate-600 hidden sm:block">⌘K</span>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                isLoading
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : input.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" />
                </span>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>
        
        {/* Quick Filters */}
        {showSuggestions && !response && (
          <div className="absolute z-50 w-full mt-2 p-3 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Quick Filters</div>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(filter.query);
                    executeQuery(filter.query);
                    setShowSuggestions(false);
                  }}
                  className="px-3 py-1.5 text-xs bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  {filter.label}
                </button>
              ))}
            </div>
            
            {showHelp && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="text-xs text-slate-500 mb-2">Syntax Tips</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <div>• PE &lt; 15, ROE &gt; 20%</div>
                  <div>• Mcap &gt; $5B</div>
                  <div>• "in energy sector"</div>
                  <div>• "exclude pharma"</div>
                  <div>• +1 to refine results</div>
                  <div>• "help" for full guide</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Response Display */}
      {response && (
        <div className="mt-4">
          {/* Interpretation */}
          <div className="mb-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-300 whitespace-pre-wrap">{response.interpretation}</div>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span>{response.total} results</span>
                  <span>{response.executionTime.toFixed(1)}ms</span>
                  <span className="capitalize">{response.type}</span>
                </div>
              </div>
              {response.type === 'screener' && response.data.length > 0 && (
                <div className="text-xs text-slate-500">
                  Type "+1 exclude [sector]" to refine
                </div>
              )}
            </div>
            
            {/* Suggestions */}
            {response.suggestions && response.suggestions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="text-xs text-slate-500 mb-1">Suggestions:</div>
                <div className="space-y-1">
                  {response.suggestions.map((s, i) => (
                    <div key={i} className="text-xs text-slate-400">{s}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Results Table */}
          {response.data.length > 0 && (
            <ScreenerResultsTable 
              data={response.data} 
              columns={response.columns || ['symbol', 'name', 'sector', 'price', 'changePct', 'mcap', 'pe']}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RESULTS TABLE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface ScreenerResultsTableProps {
  data: Stock[];
  columns: string[];
}

function ScreenerResultsTable({ data, columns }: ScreenerResultsTableProps) {
  // Format values for display
  const formatValue = (value: any, field: string): string => {
    if (value === null || value === undefined) return '-';
    
    const config = QUERYABLE_FIELDS[field];
    
    if (typeof value === 'number') {
      // Market cap formatting (Indian units)
      if (field === 'mcap' || field === 'revenue') {
        if (value >= 1e7) return `₹${(value / 1e7).toFixed(1)}Cr`;
        if (value >= 1e5) return `₹${(value / 1e5).toFixed(1)}L`;
        return `₹${value.toFixed(0)}`;
      }
      
      // Volume formatting
      if (field.includes('volume') || field.includes('Volume')) {
        if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
        if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
        return value.toFixed(0);
      }
      
      // Percentage fields
      if (config?.unit === '%' || field.includes('Pct') || field.includes('return') || 
          field.includes('growth') || field.includes('yield') || field.includes('roe') ||
          field.includes('roa') || field.includes('roce') || field.includes('cagr')) {
        return `${value.toFixed(1)}%`;
      }
      
      // Price fields
      if (field === 'price' || field === 'change' || field === 'eps') {
        return `₹${value.toFixed(2)}`;
      }
      
      // Ratio fields
      if (field === 'pe' || field === 'pb' || field === 'ps' || field === 'beta' ||
          field === 'debtToEquity' || field === 'currentRatio') {
        return value.toFixed(2);
      }
      
      return value.toFixed(2);
    }
    
    return String(value);
  };
  
  // Get header label
  const getHeaderLabel = (field: string): string => {
    const labels: Record<string, string> = {
      symbol: 'Symbol',
      name: 'Name',
      sector: 'Sector',
      industry: 'Industry',
      mcap: 'Mcap',
      price: 'Price',
      change: 'Chg',
      changePct: 'Chg%',
      pe: 'P/E',
      pb: 'P/B',
      ps: 'P/S',
      roe: 'ROE',
      roa: 'ROA',
      roce: 'ROCE',
      debtToEquity: 'D/E',
      currentRatio: 'CR',
      dividendYield: 'Div%',
      eps: 'EPS',
      revenue: 'Revenue',
      revenueGrowth: 'Rev Gr',
      profitGrowth: 'Profit Gr',
      volume: 'Volume',
      avgVolume20d: 'Avg Vol',
      volumeChange5d: 'Vol Chg 5D',
      return1d: '1D',
      return1w: '1W',
      return1m: '1M',
      return3m: '3M',
      return1y: '1Y',
      return3y: '3Y',
      cagr3y: 'CAGR 3Y',
      beta: 'Beta',
      rsi: 'RSI',
      deliveryPct: 'Del%',
    };
    return labels[field] || field;
  };
  
  // Get value color
  const getValueColor = (value: any, field: string): string => {
    if (typeof value !== 'number') return 'text-slate-300';
    
    // Fields where higher is better (green)
    const higherIsBetter = ['roe', 'roa', 'roce', 'revenueGrowth', 'profitGrowth', 
                           'return1d', 'return1w', 'return1m', 'return3m', 'return1y', 
                           'return3y', 'cagr3y', 'changePct', 'dividendYield', 'deliveryPct'];
    
    // Fields where lower is better (green when low)
    const lowerIsBetter = ['pe', 'pb', 'ps', 'debtToEquity'];
    
    if (higherIsBetter.includes(field)) {
      if (value > 0) return 'text-emerald-400';
      if (value < 0) return 'text-red-400';
    }
    
    if (lowerIsBetter.includes(field)) {
      if (value < 10) return 'text-emerald-400';
      if (value > 30) return 'text-red-400';
    }
    
    if (field === 'volumeChange5d') {
      if (value < -20) return 'text-red-400';
      if (value > 20) return 'text-emerald-400';
    }
    
    return 'text-slate-300';
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="text-left px-4 py-3 text-slate-400 font-medium sticky left-0 bg-slate-800/50">#</th>
              {columns.map(col => (
                <th key={col} className="text-left px-4 py-3 text-slate-400 font-medium whitespace-nowrap">
                  {getHeaderLabel(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((stock, idx) => (
              <tr 
                key={stock.symbol}
                className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-4 py-3 text-slate-500 sticky left-0 bg-slate-900/50">{idx + 1}</td>
                {columns.map(col => (
                  <td 
                    key={col} 
                    className={`px-4 py-3 whitespace-nowrap ${
                      col === 'symbol' ? 'font-mono font-semibold text-blue-400' :
                      col === 'name' ? 'text-slate-200 max-w-[200px] truncate' :
                      col === 'sector' ? 'text-slate-400' :
                      getValueColor((stock as any)[col], col)
                    }`}
                  >
                    {col === 'name' ? (
                      <span title={(stock as any)[col]}>{(stock as any)[col]}</span>
                    ) : (
                      formatValue((stock as any)[col], col)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2 bg-slate-800/30 border-t border-slate-800 flex justify-between text-xs text-slate-500">
        <span>Showing {data.length} stocks</span>
        <span>Use "+1 exclude [sector]" or "+2 top 5" to refine</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default AdvancedCommandBar;
