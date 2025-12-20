// ═══════════════════════════════════════════════════════════════════════════
// FLASHCARD DECK COMPONENT
// Interactive flashcard viewer with flip animation, progress, and shuffle
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Shuffle, 
  CheckCircle2,
  Circle,
  Lightbulb,
  BookOpen,
  Layers
} from 'lucide-react';
import type { Flashcard, FlashcardDeck as FlashcardDeckType } from '../../lib/learning/flashcards';
import { shuffleFlashcards } from '../../lib/learning/flashcards';

interface FlashcardDeckProps {
  deck: FlashcardDeckType;
  onClose: () => void;
  onComplete?: (masteredCount: number, totalCount: number) => void;
}

export function FlashcardDeck({ deck, onClose, onComplete }: FlashcardDeckProps) {
  const [cards, setCards] = useState<Flashcard[]>(deck.cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());
  const [reviewCards, setReviewCards] = useState<Set<string>>(new Set());

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, cards.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleShuffle = useCallback(() => {
    setCards(shuffleFlashcards(deck.cards));
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [deck.cards]);

  const handleReset = useCallback(() => {
    setCards(deck.cards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCards(new Set());
    setReviewCards(new Set());
  }, [deck.cards]);

  const handleMarkMastered = useCallback(() => {
    setMasteredCards(prev => {
      const next = new Set(prev);
      next.add(currentCard.id);
      return next;
    });
    setReviewCards(prev => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    handleNext();
  }, [currentCard?.id, handleNext]);

  const handleMarkReview = useCallback(() => {
    setReviewCards(prev => {
      const next = new Set(prev);
      next.add(currentCard.id);
      return next;
    });
    setMasteredCards(prev => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    handleNext();
  }, [currentCard?.id, handleNext]);

  const handleComplete = useCallback(() => {
    onComplete?.(masteredCards.size, cards.length);
    onClose();
  }, [masteredCards.size, cards.length, onComplete, onClose]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          handleFlip();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrevious, onClose]);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'hard': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getCardStatus = (cardId: string) => {
    if (masteredCards.has(cardId)) return 'mastered';
    if (reviewCards.has(cardId)) return 'review';
    return 'unseen';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">{deck.pathName} Flashcards</h2>
              <p className="text-sm text-slate-400">{deck.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-400">
              Card {currentIndex + 1} of {cards.length}
            </span>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {masteredCards.size} mastered
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <Circle className="w-3.5 h-3.5" />
                {reviewCards.size} to review
              </span>
            </div>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card Progress Dots */}
        <div className="px-4 py-3 flex items-center justify-center gap-1 flex-wrap max-h-16 overflow-auto">
          {cards.map((card, idx) => {
            const status = getCardStatus(card.id);
            return (
              <button
                key={card.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsFlipped(false);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900' 
                    : ''
                } ${
                  status === 'mastered' 
                    ? 'bg-emerald-500' 
                    : status === 'review' 
                      ? 'bg-amber-500' 
                      : 'bg-slate-600'
                }`}
                title={`Card ${idx + 1}: ${card.front}`}
              />
            );
          })}
        </div>

        {/* Flashcard */}
        <div className="flex-1 p-6 flex items-center justify-center">
          <div 
            className="relative w-full max-w-xl aspect-[3/2] cursor-pointer perspective-1000"
            onClick={handleFlip}
          >
            <div 
              className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of card */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-600 rounded-2xl p-6 flex flex-col backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs text-slate-500 uppercase tracking-wider">
                      {currentCard?.category || 'Concept'}
                    </span>
                  </div>
                  {currentCard?.difficulty && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getDifficultyColor(currentCard.difficulty)}`}>
                      {currentCard.difficulty}
                    </span>
                  )}
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white text-center">
                    {currentCard?.front}
                  </h3>
                </div>
                <div className="text-center text-sm text-slate-500 mt-4">
                  Click or press Space to flip
                </div>
              </div>

              {/* Back of card */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-slate-800 border border-indigo-500/30 rounded-2xl p-6 flex flex-col rotate-y-180 backface-hidden"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-400 uppercase tracking-wider">
                    Answer
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center overflow-auto">
                  <p className="text-lg text-slate-200 text-center leading-relaxed">
                    {currentCard?.back}
                  </p>
                </div>
                {currentCard?.relatedTools && currentCard.relatedTools.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      <span className="text-xs text-slate-500">Related tools:</span>
                      {currentCard.relatedTools.map(tool => (
                        <span 
                          key={tool}
                          className="text-xs px-2 py-0.5 bg-teal-500/20 text-teal-400 rounded"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-slate-700">
          {/* Mark buttons - only show when flipped */}
          {isFlipped && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <button
                onClick={handleMarkReview}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors"
              >
                <Circle className="w-4 h-4" />
                Need Review
              </button>
              <button
                onClick={handleMarkMastered}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Got It!
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                title="Shuffle cards"
              >
                <Shuffle className="w-5 h-5" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                title="Reset progress"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6 text-slate-400" />
              </button>
              
              {currentIndex === cards.length - 1 ? (
                <button
                  onClick={handleComplete}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Complete Session
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-slate-400" />
                </button>
              )}
            </div>

            {/* Keyboard hints */}
            <div className="text-xs text-slate-600 hidden sm:block">
              ← → navigate • Space flip • Esc close
            </div>
          </div>
        </div>
      </div>

      {/* CSS for 3D transforms */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FLASHCARD DECK PREVIEW CARD
// ─────────────────────────────────────────────────────────────────────────────

interface FlashcardDeckPreviewProps {
  deck: FlashcardDeckType;
  onStart: () => void;
  completedCount?: number;
}

export function FlashcardDeckPreview({ deck, onStart, completedCount = 0 }: FlashcardDeckPreviewProps) {
  const categories = [...new Set(deck.cards.map(c => c.category).filter(Boolean))];
  
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-indigo-500/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h4 className="font-medium text-white">{deck.pathName}</h4>
            <p className="text-xs text-slate-400">{deck.cards.length} cards</p>
          </div>
        </div>
        {completedCount > 0 && (
          <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
            {completedCount} mastered
          </span>
        )}
      </div>
      
      <p className="text-sm text-slate-400 mb-3">{deck.description}</p>
      
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {categories.slice(0, 4).map(cat => (
            <span key={cat} className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded">
              {cat}
            </span>
          ))}
          {categories.length > 4 && (
            <span className="text-xs px-2 py-0.5 bg-slate-700 text-slate-400 rounded">
              +{categories.length - 4} more
            </span>
          )}
        </div>
      )}
      
      <button
        onClick={onStart}
        className="w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg transition-colors text-sm font-medium"
      >
        Start Practice
      </button>
    </div>
  );
}
