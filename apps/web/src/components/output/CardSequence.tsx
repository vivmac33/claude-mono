// ═══════════════════════════════════════════════════════════════════════════
// CARD SEQUENCE DISPLAY
// Displays multiple cards based on intent analysis with step indicators
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { DynamicCardLoader } from './DynamicCardLoader';
import { IntentAnalysis, QueryIntent } from '@/lib/screener/intentAnalyzer';
import { getCardById, CardDescriptor } from '@/registry/cardRegistry';
import { getRelatedTools } from '@/lib/vocabulary/smartSearch';
import { ChevronRight, ChevronDown, Lightbulb, ArrowRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface CardSequenceProps {
  analysis: IntentAnalysis;
  symbol?: string;
  onCardSelect?: (cardId: string) => void;
}

interface CardStepProps {
  cardId: string;
  stepNumber: number;
  totalSteps: number;
  symbol: string;
  isExpanded: boolean;
  onToggle: () => void;
  onNextStepClick?: (cardId: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// INTENT TO CARD SEQUENCE MAPPING (Enhanced from intentAnalyzer)
// ─────────────────────────────────────────────────────────────────────────────

const INTENT_CARD_SEQUENCES: Record<QueryIntent, string[]> = {
  'screen': [], // List only
  'compare': ['peer-comparison', 'valuation-summary', 'multi-factor-scorecard', 'growth-summary'],
  'analyze': ['valuation-summary', 'piotroski-score', 'growth-summary', 'risk-health-dashboard', 'candlestick-hero'],
  'rank': ['multi-factor-scorecard', 'momentum-heatmap', 'peer-comparison'],
  'sector_analysis': ['momentum-heatmap', 'peer-comparison', 'institutional-flows'],
  'portfolio': ['portfolio-correlation', 'rebalance-optimizer', 'risk-health-dashboard', 'drawdown-var'],
  'trend': ['candlestick-hero', 'technical-indicators', 'pattern-matcher', 'trend-strength'],
  'alert': ['warning-sentinel-mini'],
  'explain': [],
  'summarize': ['valuation-summary', 'piotroski-score', 'financial-health-dna'],
  'custom': ['valuation-summary', 'growth-summary'],
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP INDICATOR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function StepIndicator({ 
  step, 
  total, 
  isActive,
  label 
}: { 
  step: number; 
  total: number; 
  isActive: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div 
        className={`
          w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
          transition-all duration-300
          ${isActive 
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
            : 'bg-slate-700 text-slate-400'
          }
        `}
      >
        {step}
      </div>
      <div className="hidden sm:block">
        <div className={`text-xs font-medium ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>
          Step {step} of {total}
        </div>
        <div className={`text-[10px] ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>
          {label}
        </div>
      </div>
      {step < total && (
        <ChevronRight className="w-4 h-4 text-slate-600 mx-2" />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NEXT STEPS COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function NextStepsSuggestions({ 
  currentCardId, 
  onCardSelect 
}: { 
  currentCardId: string; 
  onCardSelect: (cardId: string) => void;
}) {
  const relatedCards = useMemo(() => {
    return getRelatedTools(currentCardId, 3);
  }, [currentCardId]);

  if (relatedCards.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-slate-700/50">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-medium text-slate-400">What's next?</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {relatedCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onCardSelect(card.id)}
            className="
              group flex items-center gap-2 px-3 py-2 
              bg-slate-800/50 hover:bg-slate-700/50 
              border border-slate-700 hover:border-blue-500/50
              rounded-lg transition-all duration-200
              text-xs text-slate-300 hover:text-blue-400
            "
          >
            <span>{card.label}</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD STEP COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function CardStep({ 
  cardId, 
  stepNumber, 
  totalSteps, 
  symbol, 
  isExpanded,
  onToggle,
  onNextStepClick
}: CardStepProps) {
  const card = getCardById(cardId);
  
  if (!card) {
    return (
      <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
        <div className="text-sm text-slate-500">Card not found: {cardId}</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Step Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-t-xl transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
            ${isExpanded ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}
          `}>
            {stepNumber}
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-slate-200">{card.label}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{card.category}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {card.complexity && (
            <span className={`
              text-[9px] px-2 py-0.5 rounded
              ${card.complexity === 'beginner' ? 'bg-green-900/50 text-green-400' : ''}
              ${card.complexity === 'intermediate' ? 'bg-amber-900/50 text-amber-400' : ''}
              ${card.complexity === 'advanced' ? 'bg-red-900/50 text-red-400' : ''}
            `}>
              {card.complexity}
            </span>
          )}
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {/* Card Content */}
      {isExpanded && (
        <div className="border border-t-0 border-slate-700 rounded-b-xl overflow-hidden">
          <DynamicCardLoader cardId={cardId} symbol={symbol} />
          
          {/* Next Steps (only for the last expanded card) */}
          {onNextStepClick && (
            <div className="px-4 pb-4">
              <NextStepsSuggestions 
                currentCardId={cardId} 
                onCardSelect={onNextStepClick} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────════════════════════════════════
// MAIN CARD SEQUENCE COMPONENT
// ─────────────════════════════════════════════════════════════════════════════

export function CardSequence({ analysis, symbol = 'TCS', onCardSelect }: CardSequenceProps) {
  // Get cards from analysis or fallback to intent mapping
  const cardIds = useMemo(() => {
    const fromAnalysis = analysis.suggestedCards || [];
    if (fromAnalysis.length > 0) return fromAnalysis;
    return INTENT_CARD_SEQUENCES[analysis.intent] || [];
  }, [analysis]);

  // Track which cards are expanded (all expanded by default)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(
    () => new Set(cardIds)
  );

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  const handleNextStepClick = (cardId: string) => {
    if (onCardSelect) {
      onCardSelect(cardId);
    }
    // Add to sequence and expand
    setExpandedCards(prev => new Set([...prev, cardId]));
  };

  // Empty state
  if (cardIds.length === 0) {
    return (
      <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl text-center">
        <div className="text-slate-400 mb-2">No cards available for this query type</div>
        <div className="text-xs text-slate-500">
          Intent: <span className="text-blue-400">{analysis.intent}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sequence Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-200">
            Analysis Results
          </h3>
          <p className="text-sm text-slate-400">
            {analysis.explanation}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {cardIds.length} cards
          </span>
          <span className={`
            text-[10px] px-2 py-1 rounded uppercase tracking-wider font-medium
            ${analysis.outputType === 'cards' ? 'bg-blue-900/50 text-blue-400' : ''}
            ${analysis.outputType === 'list' ? 'bg-emerald-900/50 text-emerald-400' : ''}
            ${analysis.outputType === 'report' ? 'bg-purple-900/50 text-purple-400' : ''}
          `}>
            {analysis.outputType}
          </span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-4">
        {cardIds.map((cardId, idx) => {
          const card = getCardById(cardId);
          return (
            <StepIndicator
              key={cardId}
              step={idx + 1}
              total={cardIds.length}
              isActive={expandedCards.has(cardId)}
              label={card?.label || cardId}
            />
          );
        })}
      </div>

      {/* Card Steps */}
      <div className="space-y-3">
        {cardIds.map((cardId, idx) => (
          <CardStep
            key={cardId}
            cardId={cardId}
            stepNumber={idx + 1}
            totalSteps={cardIds.length}
            symbol={symbol}
            isExpanded={expandedCards.has(cardId)}
            onToggle={() => toggleCard(cardId)}
            onNextStepClick={idx === cardIds.length - 1 ? handleNextStepClick : undefined}
          />
        ))}
      </div>

      {/* Expand/Collapse All */}
      <div className="flex justify-center gap-2 pt-2">
        <button
          onClick={() => setExpandedCards(new Set(cardIds))}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Expand All
        </button>
        <span className="text-slate-700">|</span>
        <button
          onClick={() => setExpandedCards(new Set())}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Collapse All
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPACT SEQUENCE (for smaller views)
// ─────────────────────────────────────────────────────────────────────────────

export function CompactCardSequence({ 
  cardIds, 
  symbol = 'TCS',
  onCardSelect 
}: { 
  cardIds: string[]; 
  symbol?: string;
  onCardSelect?: (cardId: string) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentCardId = cardIds[activeIndex];

  if (cardIds.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {cardIds.map((cardId, idx) => {
          const card = getCardById(cardId);
          return (
            <button
              key={cardId}
              onClick={() => setActiveIndex(idx)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap
                transition-all duration-200 text-xs font-medium
                ${idx === activeIndex 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }
              `}
            >
              <span className="w-5 h-5 rounded-full bg-slate-700/50 flex items-center justify-center text-[10px]">
                {idx + 1}
              </span>
              {card?.label || cardId}
            </button>
          );
        })}
      </div>

      {/* Active Card */}
      <div>
        <DynamicCardLoader cardId={currentCardId} symbol={symbol} />
        
        {/* Next Steps */}
        {onCardSelect && (
          <NextStepsSuggestions 
            currentCardId={currentCardId} 
            onCardSelect={onCardSelect} 
          />
        )}
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <span className="text-xs text-slate-500">
          {activeIndex + 1} / {cardIds.length}
        </span>
        <button
          onClick={() => setActiveIndex(Math.min(cardIds.length - 1, activeIndex + 1))}
          disabled={activeIndex === cardIds.length - 1}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default CardSequence;
