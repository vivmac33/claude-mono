// ═══════════════════════════════════════════════════════════════════════════
// TOOL EDUCATION PANEL
// Displays educational content for tools - terms, tips, how-to, FAQs
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { getToolEducation, ToolEducation, ToolTerm, FAQ } from '@/lib/learning/toolEducation';

// ─────────────────────────────────────────────────────────────────────────────
// TOOL EDUCATION PANEL (Full Modal)
// ─────────────────────────────────────────────────────────────────────────────

interface ToolEducationPanelProps {
  toolId: string;
  onClose: () => void;
  onOpenTool?: (toolId: string) => void;
}

export function ToolEducationPanel({ toolId, onClose, onOpenTool }: ToolEducationPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'terms' | 'tips' | 'faq'>('overview');
  const education = getToolEducation(toolId);

  if (!education) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="w-full max-w-lg bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Tool: {toolId}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-slate-400">Education content for this tool is coming soon.</p>
          {onOpenTool && (
            <button
              onClick={() => onOpenTool(toolId)}
              className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
            >
              Open Tool
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{education.toolName}</h2>
              <p className="text-white/80 mt-1 text-sm">{education.quickTip}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 bg-slate-800/50">
          {(['overview', 'terms', 'tips', 'faq'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors
                ${activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
                }
              `}
            >
              {tab === 'faq' ? 'FAQ' : tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <OverviewTab education={education} />
          )}
          {activeTab === 'terms' && (
            <TermsTab terms={education.keyTerms} />
          )}
          {activeTab === 'tips' && (
            <TipsTab howToUse={education.howToUse} proTips={education.proTips} />
          )}
          {activeTab === 'faq' && (
            <FAQTab faqs={education.commonQuestions} />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/50 flex gap-3">
          {education.relatedModules.length > 0 && (
            <div className="flex-1 text-xs text-slate-500">
              Related: {education.relatedModules.join(', ')}
            </div>
          )}
          {onOpenTool && (
            <button
              onClick={() => onOpenTool(toolId)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Open Tool →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab Components
// ─────────────────────────────────────────────────────────────────────────────

function OverviewTab({ education }: { education: ToolEducation }) {
  return (
    <div className="space-y-6">
      {/* How to Use */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How to Use This Tool
        </h3>
        <ol className="space-y-2">
          {education.howToUse.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-400 shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Key Concepts */}
      {education.concepts.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Key Concepts
          </h3>
          <div className="flex flex-wrap gap-2">
            {education.concepts.map(concept => (
              <span key={concept} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                {concept.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick Key Terms Preview */}
      {education.keyTerms.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Key Terms ({education.keyTerms.length})
          </h3>
          <div className="space-y-2">
            {education.keyTerms.slice(0, 3).map(term => (
              <div key={term.term} className="p-3 bg-slate-700/30 rounded-lg">
                <div className="font-medium text-white text-sm">{term.term}</div>
                <div className="text-xs text-slate-400 mt-1">{term.definition}</div>
              </div>
            ))}
            {education.keyTerms.length > 3 && (
              <div className="text-xs text-slate-500 text-center">
                + {education.keyTerms.length - 3} more terms in Terms tab
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TermsTab({ terms }: { terms: ToolTerm[] }) {
  return (
    <div className="space-y-4">
      {terms.map(term => (
        <div key={term.term} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
          <div className="font-semibold text-white">{term.term}</div>
          <div className="text-sm text-slate-300 mt-2">{term.definition}</div>
          {term.formula && (
            <div className="mt-3 px-3 py-2 bg-slate-800/50 rounded font-mono text-xs text-blue-300">
              {term.formula}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TipsTab({ howToUse, proTips }: { howToUse: string[]; proTips: string[] }) {
  return (
    <div className="space-y-6">
      {/* How to Use */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Step-by-Step Guide
        </h3>
        <ol className="space-y-3">
          {howToUse.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-slate-300">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Pro Tips */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Pro Tips
        </h3>
        <div className="space-y-2">
          {proTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm text-slate-300">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FAQTab({ faqs }: { faqs: FAQ[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="border border-slate-600/30 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
          >
            <span className="text-sm font-medium text-white">{faq.question}</span>
            <svg
              className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openFaq === i && (
            <div className="p-4 text-sm text-slate-300 bg-slate-800/30">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL BADGE WITH TOOLTIP
// Compact version for inline use in learning paths
// ─────────────────────────────────────────────────────────────────────────────

interface ToolBadgeProps {
  toolId: string;
  onClick?: () => void;
  showTooltip?: boolean;
}

export function ToolBadge({ toolId, onClick, showTooltip = true }: ToolBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const education = getToolEducation(toolId);

  const displayName = education?.toolName || toolId.replace(/-/g, ' ');
  const quickTip = education?.quickTip;

  return (
    <div className="relative inline-block">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          px-3 py-1.5 rounded text-xs font-medium transition-all
          ${education
            ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 cursor-pointer'
            : 'bg-slate-600/50 text-slate-400'
          }
        `}
      >
        <span className="flex items-center gap-1">
          {displayName}
          {education && (
            <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </span>
      </button>

      {/* Tooltip */}
      {showTooltip && isHovered && quickTip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-700 rounded-lg shadow-xl border border-slate-600 pointer-events-none">
          <div className="text-xs text-slate-300">{quickTip}</div>
          <div className="text-[10px] text-slate-500 mt-1">Click for details</div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-700" />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL GRID FOR STAGE
// Grid of tool badges for a learning path stage
// ─────────────────────────────────────────────────────────────────────────────

interface ToolGridProps {
  toolIds: string[];
  onToolClick: (toolId: string) => void;
}

export function ToolGrid({ toolIds, onToolClick }: ToolGridProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {toolIds.map(toolId => (
        <ToolBadge
          key={toolId}
          toolId={toolId}
          onClick={() => onToolClick(toolId)}
        />
      ))}
    </div>
  );
}

export default ToolEducationPanel;
