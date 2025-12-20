// ═══════════════════════════════════════════════════════════════════════════
// METRIC TOOLTIP
// Wraps metric values with educational tooltips from concepts database
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useRef, useEffect } from 'react';
import { getConceptById, searchConcepts, Concept, ALL_CONCEPTS } from '@/lib/learning/concepts';
import { Info, BookOpen, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// METRIC TO CONCEPT MAPPING
// ─────────────────────────────────────────────────────────────────────────────

const METRIC_TO_CONCEPT: Record<string, string> = {
  // Valuation
  'pe': 'pe-ratio',
  'p/e': 'pe-ratio',
  'pe ratio': 'pe-ratio',
  'price-to-earnings': 'pe-ratio',
  'pb': 'pb-ratio',
  'p/b': 'pb-ratio',
  'price-to-book': 'pb-ratio',
  'ps': 'ps-ratio',
  'p/s': 'ps-ratio',
  'ev/ebitda': 'ev-ebitda',
  'ev-ebitda': 'ev-ebitda',
  
  // Profitability
  'eps': 'eps',
  'roe': 'roe',
  'return on equity': 'roe',
  'roa': 'roa',
  'return on assets': 'roa',
  'roce': 'roce',
  'gross margin': 'gross-margin',
  'net margin': 'net-margin',
  'operating margin': 'operating-margin',
  
  // Growth
  'cagr': 'cagr',
  'revenue growth': 'revenue-growth',
  'earnings growth': 'earnings-growth',
  
  // Debt & Leverage
  'debt-to-equity': 'debt-to-equity',
  'd/e': 'debt-to-equity',
  'debt ratio': 'debt-to-equity',
  'current ratio': 'current-ratio',
  'quick ratio': 'quick-ratio',
  
  // Technical
  'rsi': 'rsi',
  'macd': 'macd',
  'moving average': 'moving-average',
  'bollinger': 'bollinger-bands',
  'volume': 'volume',
  'atr': 'atr',
  
  // Risk
  'beta': 'beta',
  'volatility': 'volatility',
  'sharpe': 'sharpe-ratio',
  'sharpe ratio': 'sharpe-ratio',
  'drawdown': 'max-drawdown',
  'max drawdown': 'max-drawdown',
  'var': 'var',
  'value at risk': 'var',
  
  // Dividend
  'dividend yield': 'dividend-yield',
  'div yield': 'dividend-yield',
  'payout ratio': 'payout-ratio',
  
  // Quality
  'piotroski': 'piotroski-score',
  'f-score': 'piotroski-score',
  'altman z': 'altman-z',
  'z-score': 'altman-z',
  
  // Market
  'mcap': 'market-cap',
  'market cap': 'market-cap',
  'market capitalization': 'market-cap',
  'free float': 'free-float',
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function getConceptForMetric(metricName: string): Concept | undefined {
  if (!metricName) return undefined;
  const normalized = metricName.toLowerCase().trim();
  
  // Direct mapping
  const conceptId = METRIC_TO_CONCEPT[normalized];
  if (conceptId) {
    return getConceptById(conceptId);
  }
  
  // Fuzzy search
  const results = searchConcepts(normalized);
  return results[0];
}

function getSignalColor(value: number | undefined, metricType: string): string {
  if (value === undefined || value === null) return 'text-slate-400';
  
  // Metrics where higher is better
  const higherBetter = ['roe', 'roa', 'roce', 'eps', 'cagr', 'revenue growth', 'current ratio', 'sharpe'];
  // Metrics where lower is better
  const lowerBetter = ['pe', 'pb', 'ps', 'debt-to-equity', 'beta', 'volatility'];
  
  const normalized = metricType.toLowerCase();
  
  if (higherBetter.some(m => normalized.includes(m))) {
    if (value > 15) return 'text-emerald-400';
    if (value > 10) return 'text-green-400';
    if (value > 0) return 'text-slate-300';
    return 'text-red-400';
  }
  
  if (lowerBetter.some(m => normalized.includes(m))) {
    if (normalized.includes('pe')) {
      if (value < 15) return 'text-emerald-400';
      if (value < 25) return 'text-slate-300';
      return 'text-amber-400';
    }
    if (value < 0.5) return 'text-emerald-400';
    if (value < 1) return 'text-slate-300';
    return 'text-amber-400';
  }
  
  return 'text-slate-300';
}

function getSignalIcon(value: number | undefined, metricType: string) {
  const color = getSignalColor(value, metricType);
  
  if (color.includes('emerald') || color.includes('green')) {
    return <TrendingUp className="w-3 h-3 text-emerald-400" />;
  }
  if (color.includes('red') || color.includes('amber')) {
    return <TrendingDown className="w-3 h-3 text-amber-400" />;
  }
  return <Minus className="w-3 h-3 text-slate-500" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLTIP POPUP COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface TooltipPopupProps {
  concept: Concept;
  value?: number | string;
  position: { top: number; left: number };
  onClose: () => void;
}

function TooltipPopup({ concept, value, position, onClose }: TooltipPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      ref={popupRef}
      className="fixed z-50 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
      style={{ 
        top: Math.min(position.top, window.innerHeight - 400),
        left: Math.min(position.left, window.innerWidth - 340),
      }}
    >
      {/* Header */}
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-200">{concept.name}</span>
          </div>
          <span className={`
            text-[9px] px-2 py-0.5 rounded uppercase
            ${concept.difficulty === 'beginner' ? 'bg-green-900/50 text-green-400' : ''}
            ${concept.difficulty === 'intermediate' ? 'bg-amber-900/50 text-amber-400' : ''}
            ${concept.difficulty === 'advanced' ? 'bg-red-900/50 text-red-400' : ''}
          `}>
            {concept.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
        {/* Current Value */}
        {value !== undefined && (
          <div className="flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2">
            <span className="text-xs text-slate-400">Current Value</span>
            <span className="text-lg font-bold text-blue-400">{value}</span>
          </div>
        )}

        {/* Short Definition */}
        <p className="text-sm text-slate-300 leading-relaxed">
          {concept.shortDefinition}
        </p>

        {/* Formula */}
        {concept.formulas && concept.formulas.length > 0 && (
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Formula</div>
            <code className="text-xs text-blue-300 font-mono">
              {concept.formulas[0].expression}
            </code>
          </div>
        )}

        {/* Key Points */}
        {concept.keyPoints && concept.keyPoints.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Key Points</div>
            <ul className="space-y-1">
              {concept.keyPoints.slice(0, 3).map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="text-blue-400 mt-0.5">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Indian Context */}
        {concept.indianContext && (
          <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-amber-400 mb-1">
              🇮🇳 Indian Context
            </div>
            <p className="text-xs text-amber-200/80">
              {concept.indianContext}
            </p>
          </div>
        )}

        {/* Example */}
        {concept.examples && concept.examples.length > 0 && (
          <details className="group">
            <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-300 flex items-center gap-1">
              <span>View Example</span>
            </summary>
            <div className="mt-2 bg-slate-800/50 rounded-lg p-3">
              <div className="text-xs font-medium text-slate-300 mb-1">
                {concept.examples[0].title}
              </div>
              <p className="text-[11px] text-slate-400">
                {concept.examples[0].scenario}
              </p>
              {concept.examples[0].result && (
                <div className="mt-2 text-xs text-emerald-400">
                  → {concept.examples[0].result}
                </div>
              )}
            </div>
          </details>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-800/50 px-4 py-2 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500">
            Category: {concept.category}
          </span>
          {concept.relatedTools.length > 0 && (
            <span className="text-[10px] text-blue-400">
              Used in {concept.relatedTools.length} tools
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// METRIC TOOLTIP COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export interface MetricTooltipProps {
  metricName: string;
  value?: number | string;
  displayValue?: string;
  showIcon?: boolean;
  showSignal?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function MetricTooltip({ 
  metricName, 
  value, 
  displayValue,
  showIcon = true,
  showSignal = false,
  className = '',
  children 
}: MetricTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  
  const concept = getConceptForMetric(metricName);
  const numericValue = typeof value === 'number' ? value : undefined;
  const valueColor = getSignalColor(numericValue, metricName);

  const handleClick = (e: React.MouseEvent) => {
    if (!concept) return;
    
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <span 
        ref={triggerRef}
        className={`
          inline-flex items-center gap-1 cursor-help
          ${concept ? 'hover:text-blue-400 transition-colors' : ''}
          ${className}
        `}
        onClick={handleClick}
      >
        {children || (
          <>
            <span className={valueColor}>
              {displayValue ?? value ?? '-'}
            </span>
            {showSignal && numericValue !== undefined && (
              getSignalIcon(numericValue, metricName)
            )}
          </>
        )}
        {showIcon && concept && (
          <Info className="w-3 h-3 text-slate-500 hover:text-blue-400 flex-shrink-0" />
        )}
      </span>

      {isOpen && concept && (
        <TooltipPopup
          concept={concept}
          value={displayValue ?? value}
          position={position}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// METRIC ROW COMPONENT (for tables)
// ─────────────────────────────────────────────────────────────────────────────

export interface MetricRowProps {
  label: string;
  value: number | string;
  suffix?: string;
  benchmark?: number | string;
  benchmarkLabel?: string;
  showTooltip?: boolean;
}

export function MetricRow({ 
  label, 
  value, 
  suffix = '', 
  benchmark,
  benchmarkLabel = 'Industry',
  showTooltip = true 
}: MetricRowProps) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value as string);
  const numericBenchmark = benchmark !== undefined 
    ? (typeof benchmark === 'number' ? benchmark : parseFloat(benchmark as string))
    : undefined;
  
  const isAboveBenchmark = numericBenchmark !== undefined && !isNaN(numericValue) && !isNaN(numericBenchmark)
    ? numericValue > numericBenchmark
    : undefined;

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
      <div className="flex items-center gap-2">
        {showTooltip ? (
          <MetricTooltip metricName={label} showIcon={true}>
            <span className="text-sm text-slate-400">{label}</span>
          </MetricTooltip>
        ) : (
          <span className="text-sm text-slate-400">{label}</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {benchmark !== undefined && (
          <span className="text-xs text-slate-500">
            {benchmarkLabel}: {benchmark}{suffix}
          </span>
        )}
        <MetricTooltip 
          metricName={label} 
          value={numericValue} 
          displayValue={`${value}${suffix}`}
          showIcon={false}
          showSignal={true}
        />
        {isAboveBenchmark !== undefined && (
          <span className={`text-xs ${isAboveBenchmark ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isAboveBenchmark ? '▲' : '▼'}
          </span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// METRIC GRID COMPONENT (for card layouts)
// ─────────────────────────────────────────────────────────────────────────────

export interface MetricGridItem {
  label: string;
  value: number | string;
  suffix?: string;
}

export function MetricGrid({ metrics }: { metrics: MetricGridItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-slate-800/50 rounded-lg p-3">
          <MetricTooltip metricName={metric.label} showIcon={true}>
            <div className="text-xs text-slate-500 mb-1">{metric.label}</div>
          </MetricTooltip>
          <MetricTooltip 
            metricName={metric.label}
            value={typeof metric.value === 'number' ? metric.value : undefined}
            displayValue={`${metric.value}${metric.suffix || ''}`}
            showIcon={false}
            showSignal={true}
            className="text-lg font-semibold"
          />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default MetricTooltip;
