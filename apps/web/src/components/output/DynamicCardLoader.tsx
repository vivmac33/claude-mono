import React, { useState, useEffect, Suspense, lazy, useMemo } from 'react';
import { getCardById, CardDescriptor } from '@/registry/cardRegistry';
import { generateMockData } from '@/lib/mockDataGenerator';
import { NextSteps } from '@/components/shared/NextSteps';
import { getToolEducation } from '@/lib/learning/toolEducation';

// ═══════════════════════════════════════════════════════════════════════════
// DYNAMIC COMPONENT LOADING
// ═══════════════════════════════════════════════════════════════════════════

const implementedCards: Record<string, React.LazyExoticComponent<any>> = {
  'stock-snapshot': lazy(() => import('@/cards/overview/stock-snapshot')),
  'fair-value-forecaster': lazy(() => import('@/cards/value/fair-value-forecaster')),
  'valuation-summary': lazy(() => import('@/cards/value/valuation-summary')),
  'dcf-valuation': lazy(() => import('@/cards/value/dcf-valuation')),
  'piotroski-score': lazy(() => import('@/cards/value/piotroski-score')),
  'dupont-analysis': lazy(() => import('@/cards/value/dupont-analysis')),
  'intrinsic-value-range': lazy(() => import('@/cards/value/intrinsic-value-range')),
  'multi-factor-scorecard': lazy(() => import('@/cards/value/multi-factor-scorecard')),
  'financial-health-dna': lazy(() => import('@/cards/value/financial-health-dna')),
  'growth-summary': lazy(() => import('@/cards/growth/growth-summary')),
  'earnings-quality': lazy(() => import('@/cards/growth/earnings-quality')),
  'efficiency-dashboard': lazy(() => import('@/cards/growth/efficiency-dashboard')),
  'earnings-stability': lazy(() => import('@/cards/growth/earnings-stability')),
  'management-quality': lazy(() => import('@/cards/growth/management-quality')),
  'capital-allocation': lazy(() => import('@/cards/growth/capital-allocation')),
  'sales-profit-cash': lazy(() => import('@/cards/growth/sales-profit-cash')),
  'profit-vs-cash-divergence': lazy(() => import('@/cards/growth/profit-vs-cash-divergence')),
  'risk-health-dashboard': lazy(() => import('@/cards/risk/risk-health-dashboard')),
  'drawdown-var': lazy(() => import('@/cards/risk/drawdown-var')),
  'financial-stress-radar': lazy(() => import('@/cards/risk/financial-stress-radar')),
  'bankruptcy-health': lazy(() => import('@/cards/risk/bankruptcy-health')),
  'working-capital-health': lazy(() => import('@/cards/risk/working-capital-health')),
  'leverage-history': lazy(() => import('@/cards/risk/leverage-history')),
  'cashflow-stability-index': lazy(() => import('@/cards/risk/cashflow-stability-index')),
  'fno-risk-advisor': lazy(() => import('@/cards/risk/fno-risk-advisor')),
  'trade-expectancy': lazy(() => import('@/cards/risk/trade-expectancy')),
  'fcf-health': lazy(() => import('@/cards/cashflow/fcf-health')),
  'cash-conversion-cycle': lazy(() => import('@/cards/cashflow/cash-conversion-cycle')),
  'cash-conversion-earnings': lazy(() => import('@/cards/cashflow/cash-conversion-earnings')),
  'dividend-crystal-ball': lazy(() => import('@/cards/income/dividend-crystal-ball')),
  'dividend-sip-tracker': lazy(() => import('@/cards/income/dividend-sip-tracker')),
  'income-stability': lazy(() => import('@/cards/income/income-stability')),
  'shareholding-pattern': lazy(() => import('@/cards/macro/shareholding-pattern')),
  'institutional-flows': lazy(() => import('@/cards/macro/institutional-flows')),
  'insider-trades': lazy(() => import('@/cards/macro/insider-trades')),
  'macro-calendar': lazy(() => import('@/cards/macro/macro-calendar')),
  'macro-pulse': lazy(() => import('@/cards/macro/macro-pulse')),
  'earnings-calendar': lazy(() => import('@/cards/macro/earnings-calendar')),
  'earnings-surprise': lazy(() => import('@/cards/macro/earnings-surprise')),
  'narrative-theme': lazy(() => import('@/cards/macro/narrative-theme')),
  'candlestick-hero': lazy(() => import('@/cards/technical/candlestick-hero')),
  'pattern-matcher': lazy(() => import('@/cards/technical/pattern-matcher')),
  'delivery-analysis': lazy(() => import('@/cards/technical/delivery-analysis')),
  'trade-flow-intel': lazy(() => import('@/cards/technical/trade-flow-intel')),
  'technical-indicators': lazy(() => import('@/cards/technical/technical-indicators')),
  'trend-strength': lazy(() => import('@/cards/technical/trend-strength')),
  'momentum-heatmap': lazy(() => import('@/cards/technical/momentum-heatmap')),
  'volatility-regime': lazy(() => import('@/cards/technical/volatility-regime')),
  'seasonality-pattern': lazy(() => import('@/cards/technical/seasonality-pattern')),
  'market-regime-radar': lazy(() => import('@/cards/technical/market-regime-radar')),
  'price-structure': lazy(() => import('@/cards/technical/price-structure')),
  'volume-profile': lazy(() => import('@/cards/technical/volume-profile')),
  'vwap-analysis': lazy(() => import('@/cards/technical/vwap-analysis')),
  'orb-analysis': lazy(() => import('@/cards/technical/orb-analysis')),
  'fibonacci-levels': lazy(() => import('@/cards/technical/fibonacci-levels')),
  'playbook-builder': lazy(() => import('@/cards/technical/playbook-builder')),
  'rebalance-optimizer': lazy(() => import('@/cards/portfolio/rebalance-optimizer')),
  'peer-comparison': lazy(() => import('@/cards/portfolio/peer-comparison')),
  'portfolio-correlation': lazy(() => import('@/cards/portfolio/portfolio-correlation')),
  'etf-comparator': lazy(() => import('@/cards/portfolio/etf-comparator')),
  'portfolio-leaderboard': lazy(() => import('@/cards/portfolio/portfolio-leaderboard')),
  'options-interest': lazy(() => import('@/cards/portfolio/options-interest')),
  'tax-calculator': lazy(() => import('@/cards/portfolio/tax-calculator')),
  'trade-journal': lazy(() => import('@/cards/portfolio/trade-journal')),
  'options-strategy': lazy(() => import('@/cards/derivatives/options-strategy')),
  'nse-currency-dashboard': lazy(() => import('@/cards/derivatives/nse-currency-dashboard')),
  'mf-explorer': lazy(() => import('@/cards/mutual-funds/mf-explorer')),
  'mf-analyzer': lazy(() => import('@/cards/mutual-funds/mf-analyzer')),
  'mf-portfolio-optimizer': lazy(() => import('@/cards/mutual-funds/mf-portfolio-optimizer')),
  'mcx-commodity-dashboard': lazy(() => import('@/cards/commodities/mcx-commodity-dashboard')),
  'sentiment-zscore-mini': lazy(() => import('@/cards/mini/sentiment-zscore')),
  'warning-sentinel-mini': lazy(() => import('@/cards/mini/warning-sentinel')),
  'crash-warning-mini': lazy(() => import('@/cards/mini/crash-warning')),
  'factor-tilt-mini': lazy(() => import('@/cards/mini/factor-tilt')),
  'altman-graham-mini': lazy(() => import('@/cards/mini/altman-graham')),
  // V41 Enhanced Cards
  'sector-rotation-tracker': lazy(() => import('@/cards/macro/sector-rotation-tracker')),
  'sentiment-contradiction': lazy(() => import('@/cards/technical/sentiment-contradiction')),
  'portfolio-drift-monitor': lazy(() => import('@/cards/portfolio/portfolio-drift-monitor')),
  // V42 Footprint Card
  'footprint-analysis': lazy(() => import('@/cards/technical/footprint-analysis')),
};

// ═══════════════════════════════════════════════════════════════════════════
// FALLBACK CARD FOR UNIMPLEMENTED
// ═══════════════════════════════════════════════════════════════════════════

interface FallbackCardProps {
  cardId: string;
  card: CardDescriptor;
  data: any;
  isLoading: boolean;
  error: string | null;
}

function FallbackCard({ cardId, card, data, isLoading, error }: FallbackCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 motion-safe:animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-1/3 mb-2" />
        <div className="h-3 bg-slate-800 rounded w-1/2 mb-4" />
        <div className="h-32 bg-slate-800/50 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-700/50 bg-red-900/20 p-4">
        <div className="text-sm font-medium text-red-400">{card.label}</div>
        <div className="text-xs text-red-300 mt-1">{error}</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-medium text-slate-200">{card.label}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">{card.category}</div>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded bg-amber-900/50 text-amber-300">Preview</span>
      </div>
      <div className="text-xs text-slate-400 mb-3">{card.description}</div>
      
      {data && (
        <div className="space-y-2">
          {data.symbol && (
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Symbol</span>
              <span className="text-slate-200 font-mono">{data.symbol}</span>
            </div>
          )}
          {(data.score !== undefined || data.overallScore !== undefined) && (
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Score</span>
              <span className="text-slate-200">{data.score ?? data.overallScore}</span>
            </div>
          )}
          {data.verdict && (
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Verdict</span>
              <span className={`${
                String(data.verdict).toLowerCase().includes('buy') || String(data.verdict).toLowerCase().includes('bullish') || String(data.verdict).toLowerCase().includes('strong')
                  ? 'text-emerald-400' 
                  : String(data.verdict).toLowerCase().includes('sell') || String(data.verdict).toLowerCase().includes('bearish') || String(data.verdict).toLowerCase().includes('weak')
                  ? 'text-red-400'
                  : 'text-slate-200'
              }`}>{data.verdict}</span>
            </div>
          )}
          
          <details className="mt-3">
            <summary className="text-[10px] text-slate-500 cursor-pointer hover:text-slate-400">View raw data</summary>
            <pre className="mt-2 text-[9px] text-slate-500 bg-slate-800/50 rounded p-2 overflow-auto max-h-32">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LOADING SKELETON
// ═══════════════════════════════════════════════════════════════════════════

function CardSkeleton({ mini = false }: { mini?: boolean }) {
  if (mini) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-900/80 p-3 motion-safe:animate-pulse">
        <div className="h-3 bg-slate-700 rounded w-1/2 mb-2" />
        <div className="h-16 bg-slate-800/50 rounded" />
      </div>
    );
  }
  
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 motion-safe:animate-pulse">
      <div className="h-4 bg-slate-700 rounded w-1/3 mb-2" />
      <div className="h-3 bg-slate-800 rounded w-1/2 mb-4" />
      <div className="h-32 bg-slate-800/50 rounded" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DYNAMIC CARD LOADER - Uses Mock Data
// ═══════════════════════════════════════════════════════════════════════════

interface DynamicCardLoaderProps {
  cardId: string;
  symbol?: string;
  params?: Record<string, string>;
  preloadedData?: any;
  data?: any;
  onCardSelect?: (cardId: string) => void;
  showNextSteps?: boolean;
  showEducation?: boolean;
}

const EMPTY_PARAMS: Record<string, string> = {};

export function DynamicCardLoader({ 
  cardId, 
  symbol = 'TCS', 
  params,
  preloadedData,
  data: externalData,
  onCardSelect,
  showNextSteps = false,
  showEducation = false,
}: DynamicCardLoaderProps) {
  const stableParams = params || EMPTY_PARAMS;
  
  const [data, setData] = useState<any>(preloadedData || externalData || null);
  const [loading, setLoading] = useState(!preloadedData && !externalData);
  const [error, setError] = useState<string | null>(null);

  const card = useMemo(() => getCardById(cardId), [cardId]);
  const Component = implementedCards[cardId];
  const isMini = card?.kind === 'mini';
  const education = useMemo(() => showEducation ? getToolEducation(cardId) : null, [cardId, showEducation]);

  // Generate mock data instead of fetching
  useEffect(() => {
    if (preloadedData || externalData) {
      setData(preloadedData || externalData);
      setLoading(false);
      return;
    }
    
    if (!card) {
      setError('Card not found');
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Simulate network delay
    const delay = 200 + Math.random() * 300;
    setTimeout(() => {
      try {
        const mockData = generateMockData(cardId, symbol);
        setData(mockData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    }, delay);
  }, [cardId, symbol, preloadedData, externalData, card]);

  if (!card) {
    return (
      <div className="rounded-xl border border-red-700/50 bg-red-900/20 p-4">
        <div className="text-sm text-red-400">Unknown card: {cardId}</div>
      </div>
    );
  }

  // Wrapper component to add NextSteps and Education
  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="card-wrapper">
      {/* Education Quick Tip */}
      {education && showEducation && (
        <div className="px-4 pt-2 pb-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-800/50 rounded-lg px-3 py-1.5">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-slate-400">{education.quickTip}</span>
          </div>
        </div>
      )}
      
      {children}
      
      {/* NextSteps */}
      {showNextSteps && onCardSelect && !isMini && (
        <div className="px-4 pb-4">
          <NextSteps
            currentCardId={cardId}
            onCardSelect={onCardSelect}
            variant="compact"
            maxSuggestions={3}
            showLearnMore={false}
          />
        </div>
      )}
    </div>
  );

  if (Component) {
    const CardComponent = Component as React.ComponentType<{ data: any; isLoading: boolean; error: string | null; symbol?: string }>;
    return (
      <CardWrapper>
        <Suspense fallback={<CardSkeleton mini={isMini} />}>
          <CardComponent data={data} isLoading={loading} error={error} symbol={symbol} />
        </Suspense>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper>
      <FallbackCard 
        cardId={cardId} 
        card={card} 
        data={data} 
        isLoading={loading} 
        error={error} 
      />
    </CardWrapper>
  );
}

export default DynamicCardLoader;
