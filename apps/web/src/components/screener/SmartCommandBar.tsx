// ═══════════════════════════════════════════════════════════════════════════
// SMART COMMAND BAR
// Unified interface that orchestrates the numeric workflow engine
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Screener, 
  Stock, 
  ScreenerResponse,
  parseNaturalQuery,
  getStockDatabase,
} from '@/lib/screener';
import { NumericPipeline } from '@/lib/screener/numericEngine';
import { 
  analyzeIntent, 
  buildOutputConfig, 
  IntentAnalysis, 
  OutputConfig,
  OutputType,
  VisualizationType,
} from '@/lib/screener/intentAnalyzer';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface SmartCommandBarProps {
  onResultsChange?: (results: ProcessedResults) => void;
  className?: string;
}

export interface ProcessedResults {
  success: boolean;
  data: any[];
  outputConfig: OutputConfig;
  analysis: IntentAnalysis;
  metadata: {
    total: number;
    executionTime: number;
    pipelineSteps: string[];
  };
  visualizationData?: {
    heatmap?: HeatmapData;
    lineChart?: LineChartData;
    radar?: RadarData;
    sankey?: SankeyData;
    treemap?: TreemapData;
  };
}

interface HeatmapData {
  rows: string[];
  columns: string[];
  values: number[][];
}

interface LineChartData {
  labels: string[];
  datasets: Array<{ label: string; data: number[] }>;
}

interface RadarData {
  labels: string[];
  datasets: Array<{ label: string; data: number[] }>;
}

interface SankeyData {
  nodes: Array<{ name: string }>;
  links: Array<{ source: number; target: number; value: number }>;
}

interface TreemapData {
  name: string;
  children: Array<{ name: string; value: number; color?: string }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function SmartCommandBar({ onResultsChange, className }: SmartCommandBarProps) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessedResults | null>(null);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const screenerRef = useRef<Screener | null>(null);
  
  // Initialize screener
  useEffect(() => {
    screenerRef.current = new Screener();
  }, []);
  
  // Keyboard shortcut
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
  
  // Process query
  const processQuery = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    setIsProcessing(true);
    const startTime = performance.now();
    
    try {
      // Step 1: Analyze intent
      const analysis = analyzeIntent(query);
      
      // Step 2: Build output config
      const outputConfig = buildOutputConfig(analysis);
      
      // Step 3: Get stock data
      const stocks = getStockDatabase();
      
      // Step 4: Build and execute numeric pipeline
      const pipeline = new NumericPipeline();
      
      // Apply sector filters
      if (analysis.sectors.length > 0) {
        pipeline.filter(
          analysis.sectors.map(s => ({ 
            field: 'sector', 
            operator: 'contains', 
            value: s 
          }))
        );
      }
      
      // Parse and apply conditions from the analysis pipeline
      const parsedQuery = parseNaturalQuery(query);
      if (parsedQuery.query?.filters) {
        pipeline.filter(parsedQuery.query.filters.map(f => ({
          field: f.field,
          operator: f.operator,
          value: f.value as any,
        })));
      }
      
      // Apply exclusions
      if (parsedQuery.query?.exclude?.sectors) {
        pipeline.filter(
          parsedQuery.query.exclude.sectors.map(s => ({
            field: 'sector',
            operator: 'not_in',
            value: [s],
          }))
        );
      }
      
      // Score if needed for analysis/compare intents
      if (['analyze', 'compare', 'rank', 'summarize'].includes(analysis.intent)) {
        const scoreFields = analysis.metrics.length > 0 
          ? analysis.metrics 
          : ['roe', 'roa', 'pe', 'debtToEquity'];
        
        pipeline.score(
          scoreFields.map(f => ({
            name: f,
            field: f,
            weight: 1,
            higherIsBetter: !['pe', 'pb', 'ps', 'debtToEquity', 'beta'].includes(f),
          })),
          '_compositeScore'
        );
        
        pipeline.rank('_compositeScore', 'desc', '_rank');
      }
      
      // Apply sorting
      if (parsedQuery.query?.sort) {
        pipeline.sort([parsedQuery.query.sort]);
      } else if (analysis.intent === 'rank') {
        pipeline.sort([{ field: '_compositeScore', order: 'desc' }]);
      }
      
      // Apply limit
      const limit = parsedQuery.query?.limit || 20;
      pipeline.limit(limit);
      
      // Execute pipeline
      const pipelineResult = pipeline.execute(stocks);
      
      // Step 5: Generate visualization data
      const visualizationData = generateVisualizationData(
        pipelineResult.data,
        analysis,
        stocks
      );
      
      // Step 6: Build final results
      const processedResults: ProcessedResults = {
        success: true,
        data: pipelineResult.data,
        outputConfig,
        analysis,
        metadata: {
          total: pipelineResult.metadata.outputCount,
          executionTime: performance.now() - startTime,
          pipelineSteps: pipelineResult.metadata.operationsApplied,
        },
        visualizationData,
      };
      
      setResults(processedResults);
      
      // Update history
      setConversationHistory(prev => [query, ...prev.filter(h => h !== query)].slice(0, 20));
      setHistoryIndex(-1);
      
      // Callback
      if (onResultsChange) {
        onResultsChange(processedResults);
      }
    } catch (error) {
      console.error('Query processing error:', error);
      setResults({
        success: false,
        data: [],
        outputConfig: {
          type: 'list',
          visualizations: ['table'],
          cards: [],
          columns: [],
          title: 'Error',
          subtitle: error instanceof Error ? error.message : 'Unknown error',
        },
        analysis: analyzeIntent(''),
        metadata: {
          total: 0,
          executionTime: performance.now() - startTime,
          pipelineSteps: [],
        },
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onResultsChange]);
  
  // Handle submit
  const handleSubmit = () => {
    if (input.trim() && !isProcessing) {
      processQuery(input);
    }
  };
  
  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (conversationHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, conversationHistory.length - 1);
        setHistoryIndex(newIndex);
        setInput(conversationHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(conversationHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };
  
  // Quick examples
  const examples = [
    { label: 'Screen', query: 'stocks with PE < 15 and ROE > 18%' },
    { label: 'Compare', query: 'compare TCS vs INFY vs WIPRO' },
    { label: 'Analyze', query: 'analyze TCS in depth' },
    { label: 'Sector', query: 'energy sector performance overview' },
    { label: 'Rank', query: 'rank tech stocks by ROE' },
    { label: 'Report', query: 'comprehensive report on RELIANCE' },
  ];

  return (
    <div className={`w-full ${className || ''}`}>
      {/* Command Input */}
      <div className="relative">
        <div className="flex items-center bg-slate-800/80 backdrop-blur-xl border border-slate-600 rounded-2xl shadow-2xl overflow-hidden focus-within:border-blue-500 transition-all">
          {/* Icon */}
          <div className="pl-5 pr-3">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          
          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... 'compare TCS vs INFY', 'stocks with PE < 15', 'analyze TCS'"
            className="flex-1 py-4 bg-transparent text-slate-100 placeholder-slate-500 outline-none text-base"
            disabled={isProcessing}
          />
          
          {/* Actions */}
          <div className="flex items-center gap-2 pr-3">
            <span className="text-xs text-slate-600 hidden sm:block">⌘K</span>
            <button
              onClick={handleSubmit}
              disabled={isProcessing || !input.trim()}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                isProcessing
                  ? 'bg-blue-600/50 text-white/50 cursor-wait'
                  : input.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" />
                  Processing
                </span>
              ) : (
                'Go'
              )}
            </button>
          </div>
        </div>
        
        {/* Quick Examples */}
        {!results && (
          <div className="mt-4 flex flex-wrap gap-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(ex.query);
                  processQuery(ex.query);
                }}
                className="px-3 py-1.5 text-xs bg-slate-800/50 text-slate-400 rounded-lg hover:bg-slate-700 hover:text-slate-200 transition-colors border border-slate-700/50"
              >
                <span className="text-blue-400 mr-1">{ex.label}:</span>
                {ex.query.slice(0, 30)}...
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Results */}
      {results && (
        <SmartResults results={results} onNewQuery={processQuery} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESULTS COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface SmartResultsProps {
  results: ProcessedResults;
  onNewQuery: (query: string) => void;
}

function SmartResults({ results, onNewQuery }: SmartResultsProps) {
  const { outputConfig, analysis, data, metadata, visualizationData } = results;
  
  return (
    <div className="mt-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">{outputConfig.title}</h2>
          <p className="text-sm text-slate-400 mt-1">{outputConfig.subtitle}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{metadata.total} results</span>
          <span>{metadata.executionTime.toFixed(0)}ms</span>
          <span className="px-2 py-1 bg-slate-800 rounded capitalize">{outputConfig.type}</span>
        </div>
      </div>
      
      {/* Pipeline Steps */}
      {metadata.pipelineSteps.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto pb-2">
          <span className="text-slate-600">Pipeline:</span>
          {metadata.pipelineSteps.map((step, i) => (
            <React.Fragment key={i}>
              <span className="px-2 py-1 bg-slate-800/50 rounded whitespace-nowrap">{step}</span>
              {i < metadata.pipelineSteps.length - 1 && <span className="text-slate-700">→</span>}
            </React.Fragment>
          ))}
        </div>
      )}
      
      {/* Output based on type */}
      {outputConfig.type === 'list' && (
        <ListOutput data={data} columns={outputConfig.columns} />
      )}
      
      {outputConfig.type === 'cards' && (
        <CardsOutput 
          data={data} 
          cards={outputConfig.cards} 
          visualizations={outputConfig.visualizations}
          visualizationData={visualizationData}
        />
      )}
      
      {outputConfig.type === 'report' && (
        <ReportOutput 
          data={data} 
          analysis={analysis}
          visualizationData={visualizationData}
        />
      )}
      
      {/* Suggested follow-ups */}
      <div className="pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 mb-2">Try next:</div>
        <div className="flex flex-wrap gap-2">
          {generateFollowUps(analysis).map((followUp, i) => (
            <button
              key={i}
              onClick={() => onNewQuery(followUp)}
              className="px-3 py-1 text-xs bg-slate-800/30 text-slate-400 rounded hover:bg-slate-700 transition-colors"
            >
              {followUp}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OUTPUT COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function ListOutput({ data, columns }: { data: any[]; columns: string[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No stocks match your criteria. Try relaxing filters.
      </div>
    );
  }
  
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="text-left px-4 py-3 text-slate-400 font-medium">#</th>
              {columns.slice(0, 10).map(col => (
                <th key={col} className="text-left px-4 py-3 text-slate-400 font-medium whitespace-nowrap">
                  {formatColumnHeader(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={row.symbol || idx} className="border-t border-slate-800 hover:bg-slate-800/30">
                <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                {columns.slice(0, 10).map(col => (
                  <td key={col} className={`px-4 py-3 whitespace-nowrap ${getValueColor(row[col], col)}`}>
                    {formatValue(row[col], col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CardsOutput({ 
  data, 
  cards, 
  visualizations,
  visualizationData,
}: { 
  data: any[]; 
  cards: string[];
  visualizations: VisualizationType[];
  visualizationData?: ProcessedResults['visualizationData'];
}) {
  return (
    <div className="space-y-6">
      {/* Visualizations */}
      {visualizations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visualizations.slice(0, 4).map((viz, i) => (
            <VisualizationPlaceholder 
              key={i} 
              type={viz} 
              data={visualizationData}
            />
          ))}
        </div>
      )}
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.slice(0, 4).map((stock, i) => (
          <div key={i} className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
            <div className="text-sm font-mono text-blue-400">{stock.symbol}</div>
            <div className="text-xs text-slate-400 truncate">{stock.name}</div>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Price</span>
                <span className="text-slate-200">${stock.price?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">P/E</span>
                <span className="text-slate-200">{stock.pe?.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">ROE</span>
                <span className={stock.roe > 15 ? 'text-emerald-400' : 'text-slate-200'}>
                  {stock.roe?.toFixed(1)}%
                </span>
              </div>
              {stock._compositeScore && (
                <div className="flex justify-between text-xs pt-2 border-t border-slate-700">
                  <span className="text-slate-500">Score</span>
                  <span className="text-blue-400 font-semibold">{stock._compositeScore}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Suggested Cards */}
      {cards.length > 0 && (
        <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
          <div className="text-xs text-slate-500 mb-2">Recommended Cards for Deeper Analysis:</div>
          <div className="flex flex-wrap gap-2">
            {cards.map((card, i) => (
              <span key={i} className="px-3 py-1 text-xs bg-slate-700/50 text-slate-300 rounded-lg">
                {card.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReportOutput({ 
  data, 
  analysis,
  visualizationData,
}: { 
  data: any[];
  analysis: IntentAnalysis;
  visualizationData?: ProcessedResults['visualizationData'];
}) {
  const topStock = data[0];
  
  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-xl">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Executive Summary</h3>
        <div className="prose prose-invert prose-sm max-w-none">
          <p className="text-slate-300">
            {generateReportSummary(data, analysis)}
          </p>
        </div>
      </div>
      
      {/* Key Findings */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Top Pick</div>
          {topStock ? (
            <>
              <div className="text-lg font-semibold text-blue-400">{topStock.symbol}</div>
              <div className="text-sm text-slate-400">{topStock.name}</div>
              <div className="mt-2 text-2xl font-bold text-slate-100">
                {topStock._compositeScore || topStock.pe?.toFixed(1)}
              </div>
            </>
          ) : (
            <div className="text-slate-400">No data</div>
          )}
        </div>
        
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Avg P/E</div>
          <div className="text-2xl font-bold text-slate-100">
            {(data.reduce((sum, s) => sum + (s.pe || 0), 0) / data.length).toFixed(1)}
          </div>
          <div className="text-sm text-slate-400">vs market ~20</div>
        </div>
        
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Avg ROE</div>
          <div className="text-2xl font-bold text-emerald-400">
            {(data.reduce((sum, s) => sum + (s.roe || 0), 0) / data.length).toFixed(1)}%
          </div>
          <div className="text-sm text-slate-400">profitability indicator</div>
        </div>
      </div>
      
      {/* Detailed Table */}
      <ListOutput 
        data={data.slice(0, 10)} 
        columns={['symbol', 'name', 'sector', 'pe', 'roe', 'roa', 'mcap', 'return1y']} 
      />
      
      {/* Methodology */}
      <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl text-xs text-slate-500">
        <strong>Methodology:</strong> {analysis.explanation}
      </div>
    </div>
  );
}

function VisualizationPlaceholder({ 
  type, 
  data 
}: { 
  type: VisualizationType;
  data?: ProcessedResults['visualizationData'];
}) {
  const vizConfig: Record<VisualizationType, { icon: string; label: string; bg: string }> = {
    table: { icon: '📊', label: 'Data Table', bg: 'from-slate-800' },
    heatmap: { icon: '🗺️', label: 'Sector Heatmap', bg: 'from-orange-900/30' },
    line_chart: { icon: '📈', label: 'Trend Line', bg: 'from-blue-900/30' },
    candlestick: { icon: '🕯️', label: 'Price Action', bg: 'from-green-900/30' },
    bar_chart: { icon: '📊', label: 'Comparison', bg: 'from-purple-900/30' },
    sankey: { icon: '🌊', label: 'Flow Diagram', bg: 'from-cyan-900/30' },
    treemap: { icon: '🗃️', label: 'Market Map', bg: 'from-emerald-900/30' },
    scatter: { icon: '⭐', label: 'Scatter Plot', bg: 'from-yellow-900/30' },
    radar: { icon: '🎯', label: 'Radar Chart', bg: 'from-pink-900/30' },
    gauge: { icon: '🎚️', label: 'Gauge', bg: 'from-red-900/30' },
    pie: { icon: '🥧', label: 'Allocation', bg: 'from-indigo-900/30' },
    area: { icon: '📉', label: 'Area Chart', bg: 'from-teal-900/30' },
  };
  
  const config = vizConfig[type] || vizConfig.table;
  
  return (
    <div className={`p-6 bg-gradient-to-br ${config.bg} to-slate-900 border border-slate-700 rounded-xl min-h-[200px] flex flex-col items-center justify-center`}>
      <div className="text-4xl mb-2">{config.icon}</div>
      <div className="text-sm text-slate-300">{config.label}</div>
      <div className="text-xs text-slate-500 mt-1">Visualization ready</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function generateVisualizationData(
  data: any[],
  analysis: IntentAnalysis,
  allStocks: Stock[]
): ProcessedResults['visualizationData'] {
  const vizData: ProcessedResults['visualizationData'] = {};
  
  // Heatmap for sector analysis
  if (analysis.visualizations.includes('heatmap')) {
    const sectors = [...new Set(data.map(s => s.sector))];
    const metrics = ['pe', 'roe', 'return1y'];
    
    vizData.heatmap = {
      rows: sectors,
      columns: metrics,
      values: sectors.map(sector => {
        const sectorStocks = data.filter(s => s.sector === sector);
        return metrics.map(m => {
          const values = sectorStocks.map(s => s[m]).filter(v => v != null);
          return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        });
      }),
    };
  }
  
  // Radar for comparison
  if (analysis.visualizations.includes('radar') && data.length > 0) {
    const metrics = ['pe', 'roe', 'roa', 'debtToEquity', 'return1y'];
    vizData.radar = {
      labels: metrics.map(m => formatColumnHeader(m)),
      datasets: data.slice(0, 4).map(stock => ({
        label: stock.symbol,
        data: metrics.map(m => normalizeForRadar(stock[m], m)),
      })),
    };
  }
  
  return vizData;
}

function normalizeForRadar(value: number, field: string): number {
  if (value == null) return 50;
  
  // Normalize to 0-100 based on typical ranges
  const ranges: Record<string, [number, number]> = {
    pe: [0, 50],
    roe: [0, 40],
    roa: [0, 20],
    debtToEquity: [0, 2],
    return1y: [-50, 100],
  };
  
  const [min, max] = ranges[field] || [0, 100];
  const normalized = ((value - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, normalized));
}

function generateFollowUps(analysis: IntentAnalysis): string[] {
  const followUps: string[] = [];
  
  if (analysis.symbols.length > 0) {
    followUps.push(`compare ${analysis.symbols[0]} with peers`);
    followUps.push(`technical analysis of ${analysis.symbols[0]}`);
  }
  
  if (analysis.sectors.length > 0) {
    followUps.push(`top performers in ${analysis.sectors[0]}`);
    followUps.push(`+1 exclude high PE stocks`);
  }
  
  if (analysis.intent === 'screen') {
    followUps.push('+1 add dividend yield > 2%');
    followUps.push('+1 sort by ROE');
  }
  
  if (followUps.length === 0) {
    followUps.push('compare TCS vs INFY');
    followUps.push('energy sector overview');
    followUps.push('stocks with high dividend yield');
  }
  
  return followUps.slice(0, 4);
}

function generateReportSummary(data: any[], analysis: IntentAnalysis): string {
  if (data.length === 0) return 'No stocks matched the specified criteria.';
  
  const avgPE = data.reduce((sum, s) => sum + (s.pe || 0), 0) / data.length;
  const avgROE = data.reduce((sum, s) => sum + (s.roe || 0), 0) / data.length;
  const topStock = data[0];
  
  let summary = `Based on the analysis of ${data.length} stocks`;
  
  if (analysis.sectors.length > 0) {
    summary += ` in the ${analysis.sectors.join(', ')} sector`;
  }
  
  summary += `, the average P/E ratio is ${avgPE.toFixed(1)} and average ROE is ${avgROE.toFixed(1)}%.`;
  
  if (topStock) {
    summary += ` ${topStock.symbol} (${topStock.name}) emerges as the top pick`;
    if (topStock._compositeScore) {
      summary += ` with a composite score of ${topStock._compositeScore}`;
    }
    summary += '.';
  }
  
  return summary;
}

function formatColumnHeader(col: string): string {
  const headers: Record<string, string> = {
    symbol: 'Symbol', name: 'Name', sector: 'Sector', price: 'Price',
    changePct: 'Chg%', mcap: 'Mcap', pe: 'P/E', pb: 'P/B', roe: 'ROE',
    roa: 'ROA', roce: 'ROCE', debtToEquity: 'D/E', dividendYield: 'Div%',
    return1y: '1Y Ret', return3y: '3Y Ret', cagr3y: 'CAGR', beta: 'Beta',
    _compositeScore: 'Score', _rank: 'Rank',
  };
  return headers[col] || col;
}

function formatValue(value: any, field: string): string {
  if (value == null) return '-';
  
  if (typeof value === 'number') {
    if (field === 'mcap') {
      if (value >= 1e7) return `₹${(value / 1e7).toFixed(1)}Cr`;
      if (value >= 1e5) return `₹${(value / 1e5).toFixed(1)}L`;
      return `₹${value.toFixed(0)}`;
    }
    if (field === 'price') return `₹${value.toFixed(2)}`;
    if (field.includes('Pct') || field.includes('return') || field === 'roe' || 
        field === 'roa' || field === 'roce' || field === 'dividendYield') {
      return `${value.toFixed(1)}%`;
    }
    if (field === '_compositeScore' || field === '_rank') return value.toFixed(0);
    return value.toFixed(2);
  }
  
  return String(value);
}

function getValueColor(value: any, field: string): string {
  if (typeof value !== 'number') return 'text-slate-300';
  
  const positiveFields = ['roe', 'roa', 'roce', 'return1y', 'return3y', 'changePct', 'dividendYield', '_compositeScore'];
  const negativeFields = ['pe', 'pb', 'debtToEquity'];
  
  if (positiveFields.includes(field)) {
    if (value > 15) return 'text-emerald-400';
    if (value < 0) return 'text-red-400';
  }
  
  if (field === 'symbol') return 'text-blue-400 font-mono font-semibold';
  if (field === 'name') return 'text-slate-200';
  
  return 'text-slate-300';
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default SmartCommandBar;
