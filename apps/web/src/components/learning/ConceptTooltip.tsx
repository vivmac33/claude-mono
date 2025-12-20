// ═══════════════════════════════════════════════════════════════════════════
// CONCEPT TOOLTIP
// Educational tooltip that appears on hover over tools/terms
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useRef, useEffect } from 'react';
import { getToolEducation, getConceptById, ToolTerm, Concept } from '@/lib/learning';

// ═══════════════════════════════════════════════════════════════════════════
// SIMPLE HOVER TOOLTIP - Shows basic definition & formula on hover
// ═══════════════════════════════════════════════════════════════════════════

interface ToolHoverTooltipProps {
  toolId: string;
  children?: React.ReactNode;
  className?: string;
}

export function ToolHoverTooltip({ toolId, children, className = '' }: ToolHoverTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const containerRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const education = getToolEducation(toolId);

  const showTooltip = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    showTimeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setPosition(rect.top < 280 ? 'bottom' : 'top');
      }
      setIsVisible(true);
    }, 200);
  };

  const hideTooltip = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    // Delay hiding to allow mouse to move to tooltip
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  const keepTooltipOpen = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  if (!education) return <>{children}</>;

  const primaryFormula = education.keyTerms.find(t => t.formula);

  return (
    <div 
      ref={containerRef}
      className={`relative inline-flex ${className}`}
      style={{ isolation: 'isolate' }}
    >
      {/* Trigger Element */}
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children || (
          <span className="text-slate-400 hover:text-blue-400 cursor-help">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        )}
      </div>

      {/* Hover Tooltip */}
      {isVisible && (
        <div
          className={`
            absolute w-72 p-3
            bg-slate-800 rounded-lg border border-slate-600 shadow-xl
            ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
            left-1/2 -translate-x-1/2
          `}
          style={{ zIndex: 9999 }}
          onMouseEnter={keepTooltipOpen}
          onMouseLeave={hideTooltip}
        >
          {/* Arrow */}
          <div className={`
            absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-slate-600 rotate-45
            ${position === 'top' ? 'bottom-[-5px] border-r border-b' : 'top-[-5px] border-l border-t'}
          `} />

          {/* Quick Tip */}
          <p className="text-sm text-slate-200 mb-2">{education.quickTip}</p>

          {/* Primary Formula */}
          {primaryFormula && (
            <div className="mt-2 pt-2 border-t border-slate-700">
              <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Key Formula</div>
              <div className="font-mono text-xs text-blue-300 bg-slate-900/50 px-2 py-1 rounded">
                {primaryFormula.formula}
              </div>
            </div>
          )}

          {/* Link to Learning Center */}
          <a 
            href={`#/learn?tab=tools&tool=${toolId}`}
            className="mt-3 flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Full guide in Learning Center</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FULL EDUCATION BUTTON - Click to open detailed panel (existing)
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// Tool Education Button (appears on each tool card)
// ─────────────────────────────────────────────────────────────────────────────

interface ToolEducationButtonProps {
  toolId: string;
  variant?: 'icon' | 'text' | 'pill';
  className?: string;
}

export function ToolEducationButton({ toolId, variant = 'icon', className = '' }: ToolEducationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const education = getToolEducation(toolId);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setPosition(spaceBelow < 400 ? 'top' : 'bottom');
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!education) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          transition-all duration-200
          ${variant === 'icon' 
            ? 'p-1.5 rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-blue-400' 
            : variant === 'pill'
            ? 'px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-medium flex items-center gap-1'
            : 'text-blue-400 hover:text-blue-300 text-sm underline'
          }
        `}
        title="Learn about this tool"
      >
        {variant === 'pill' && <span>Learn</span>}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Education Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className={`
            absolute z-50 w-96 max-h-[500px] overflow-y-auto
            bg-slate-800 rounded-xl border border-slate-600 shadow-2xl
            ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
            right-0
          `}
        >
          <ToolEducationPanel education={education} onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool Education Panel Content
// ─────────────────────────────────────────────────────────────────────────────

interface ToolEducationPanelProps {
  education: NonNullable<ReturnType<typeof getToolEducation>>;
  onClose: () => void;
}

function ToolEducationPanel({ education, onClose }: ToolEducationPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'terms' | 'tips'>('overview');

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div>
          <h3 className="font-semibold text-white">{education.toolName}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{education.quickTip}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        {(['overview', 'terms', 'tips'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 px-4 py-2 text-sm font-medium capitalize transition-colors
              ${activeTab === tab
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* How to Use */}
            <div>
              <h4 className="text-sm font-medium text-white mb-2">How to Use</h4>
              <ul className="space-y-1.5">
                {education.howToUse.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-blue-400 mt-0.5">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Concepts */}
            {education.concepts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Key Concepts</h4>
                <div className="flex flex-wrap gap-2">
                  {education.concepts.map(conceptId => {
                    const concept = getConceptById(conceptId);
                    if (!concept) return null;
                    return (
                      <ConceptBadge key={conceptId} concept={concept} />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-3">
            {education.keyTerms.map((term, i) => (
              <TermDefinition key={i} term={term} />
            ))}
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-4">
            {/* Pro Tips */}
            <div>
              <h4 className="text-sm font-medium text-white mb-2">💡 Pro Tips</h4>
              <ul className="space-y-2">
                {education.proTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-yellow-400">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs */}
            {education.commonQuestions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white mb-2">❓ Common Questions</h4>
                <div className="space-y-3">
                  {education.commonQuestions.map((faq, i) => (
                    <div key={i} className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-sm font-medium text-white mb-1">{faq.question}</p>
                      <p className="text-xs text-slate-400">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer - Link to full module */}
      {education.relatedModules.length > 0 && (
        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <a
            href={`/learn/${education.relatedModules[0]}`}
            className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Learn more in full course</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Term Definition Component
// ─────────────────────────────────────────────────────────────────────────────

function TermDefinition({ term }: { term: ToolTerm }) {
  return (
    <div className="bg-slate-700/30 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-white text-sm">{term.term}</span>
      </div>
      <p className="text-xs text-slate-400 mb-2">{term.definition}</p>
      {term.formula && (
        <div className="bg-slate-900/50 rounded px-2 py-1 font-mono text-xs text-blue-300">
          {term.formula}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Concept Badge with Hover Tooltip
// ─────────────────────────────────────────────────────────────────────────────

function ConceptBadge({ concept }: { concept: Concept }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="px-2 py-1 bg-slate-700/50 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors"
      >
        {concept.name}
      </button>

      {showTooltip && (
        <div className="absolute z-10 bottom-full left-0 mb-2 w-64 p-3 bg-slate-900 rounded-lg border border-slate-600 shadow-xl">
          <p className="text-xs text-slate-300">{concept.shortDefinition}</p>
          {concept.formulas?.[0] && (
            <div className="mt-2 bg-slate-800 rounded px-2 py-1 font-mono text-xs text-green-400">
              {concept.formulas[0].expression}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline Term Tooltip (for use within text)
// ─────────────────────────────────────────────────────────────────────────────

interface InlineTermProps {
  term: string;
  definition: string;
  formula?: string;
  children: React.ReactNode;
}

export function InlineTerm({ term, definition, formula, children }: InlineTermProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="border-b border-dashed border-blue-400 text-blue-400 cursor-help">
        {children}
      </span>

      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 rounded-lg border border-slate-600 shadow-xl">
          <p className="font-medium text-white text-sm mb-1">{term}</p>
          <p className="text-xs text-slate-400">{definition}</p>
          {formula && (
            <div className="mt-2 bg-slate-800 rounded px-2 py-1 font-mono text-xs text-green-400">
              {formula}
            </div>
          )}
          {/* Arrow */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-slate-600" />
        </div>
      )}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick Tip Badge (minimal version)
// ─────────────────────────────────────────────────────────────────────────────

interface QuickTipBadgeProps {
  toolId: string;
}

export function QuickTipBadge({ toolId }: QuickTipBadgeProps) {
  const [showTip, setShowTip] = useState(false);
  const education = getToolEducation(toolId);

  if (!education) return null;

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        className="text-slate-500 hover:text-blue-400 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {showTip && (
        <div className="absolute z-50 bottom-full right-0 mb-2 w-56 p-2 bg-slate-900 rounded-lg border border-slate-700 shadow-xl">
          <p className="text-xs text-slate-300">{education.quickTip}</p>
        </div>
      )}
    </div>
  );
}

export default ToolEducationButton;
