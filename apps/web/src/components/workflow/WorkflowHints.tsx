// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOW HINTS
// Contextual first-time hints that guide users through the workflow builder
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/components/ThemeProvider';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type HintId = 
  | 'canvas-empty'      // When canvas is empty
  | 'first-card-placed' // After first card is placed
  | 'multiple-cards'    // When 2+ cards exist but not connected
  | 'ready-to-run'      // When workflow is connected and ready
  | 'results-ready';    // After workflow runs

interface Hint {
  id: HintId;
  title: string;
  message: string;
  icon: string;
  position: 'canvas-center' | 'canvas-bottom' | 'toolbar' | 'sidebar';
  pulse?: boolean;
}

const HINTS: Record<HintId, Hint> = {
  'canvas-empty': {
    id: 'canvas-empty',
    title: 'Build Your Analysis',
    message: 'Drag cards from the sidebar onto the canvas, or pick a template to get started quickly.',
    icon: '🎯',
    position: 'canvas-center',
    pulse: true,
  },
  'first-card-placed': {
    id: 'first-card-placed',
    title: 'Great Start!',
    message: 'Now drag another card and connect them by pulling from the bottom handle (●) to the top handle of the next card.',
    icon: '🔗',
    position: 'canvas-bottom',
    pulse: true,
  },
  'multiple-cards': {
    id: 'multiple-cards',
    title: 'Connect Your Cards',
    message: 'Link your cards together to create an analysis flow. Drag from ● to ● to connect.',
    icon: '⚡',
    position: 'canvas-bottom',
  },
  'ready-to-run': {
    id: 'ready-to-run',
    title: 'Ready to Analyze!',
    message: 'Your workflow is set up. Click "Run" to execute the analysis on your selected symbols.',
    icon: '🚀',
    position: 'toolbar',
  },
  'results-ready': {
    id: 'results-ready',
    title: 'Results Available',
    message: 'Your analysis is complete! Check the results panel to see insights for each card.',
    icon: '✨',
    position: 'canvas-bottom',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'monomorph_workflow_hints_dismissed';

function getDismissedHints(): Set<HintId> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveDismissedHints(dismissed: Set<HintId>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...dismissed]));
}

// ─────────────────────────────────────────────────────────────────────────────
// HINT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface HintBubbleProps {
  hint: Hint;
  onDismiss: () => void;
  onDismissAll: () => void;
}

function HintBubble({ hint, onDismiss, onDismissAll }: HintBubbleProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div 
      className={`
        relative max-w-sm rounded-xl shadow-2xl overflow-hidden
        animate-fade-in-up
        ${isDark 
          ? 'bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-slate-700/50' 
          : 'bg-white border border-slate-200 shadow-lg'
        }
      `}
    >
      {/* Accent bar */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500" />
      
      {/* Pulse ring for important hints */}
      {hint.pulse && (
        <div className="absolute -inset-1 bg-indigo-500/20 rounded-xl animate-pulse -z-10" />
      )}
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-2">
          <div className={`
            text-2xl p-2 rounded-lg
            ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}
          `}>
            {hint.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              {hint.title}
            </h4>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {hint.message}
            </p>
          </div>
          <button
            onClick={onDismiss}
            className={`
              p-1 rounded-lg transition-colors text-lg leading-none
              ${isDark 
                ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-700' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }
            `}
            title="Dismiss this hint"
          >
            ×
          </button>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/30">
          <button
            onClick={onDismissAll}
            className={`
              text-[10px] uppercase tracking-wide font-medium transition-colors
              ${isDark 
                ? 'text-slate-500 hover:text-slate-300' 
                : 'text-slate-400 hover:text-slate-600'
              }
            `}
          >
            Don't show hints
          </button>
          <span className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            💡 Tip
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface WorkflowHintsProps {
  nodeCount: number;
  edgeCount: number;
  hasRun: boolean;
  isRunning: boolean;
}

export function WorkflowHints({ 
  nodeCount, 
  edgeCount,
  hasRun,
  isRunning,
}: WorkflowHintsProps) {
  const [dismissed, setDismissed] = useState<Set<HintId>>(new Set());
  const [allDismissed, setAllDismissed] = useState(false);
  
  // Load dismissed state on mount
  useEffect(() => {
    const stored = getDismissedHints();
    setDismissed(stored);
    // Check if user has dismissed all hints
    if (stored.has('all' as HintId)) {
      setAllDismissed(true);
    }
  }, []);
  
  // Determine which hint to show based on state
  const currentHintId: HintId | null = (() => {
    if (allDismissed || isRunning) return null;
    
    if (hasRun && !dismissed.has('results-ready')) {
      return 'results-ready';
    }
    
    if (nodeCount === 0 && !dismissed.has('canvas-empty')) {
      return 'canvas-empty';
    }
    
    if (nodeCount === 1 && edgeCount === 0 && !dismissed.has('first-card-placed')) {
      return 'first-card-placed';
    }
    
    if (nodeCount >= 2 && edgeCount === 0 && !dismissed.has('multiple-cards')) {
      return 'multiple-cards';
    }
    
    if (nodeCount >= 2 && edgeCount >= 1 && !hasRun && !dismissed.has('ready-to-run')) {
      return 'ready-to-run';
    }
    
    return null;
  })();
  
  const currentHint = currentHintId ? HINTS[currentHintId] : null;
  
  // Dismiss a single hint
  const dismissHint = useCallback((hintId: HintId) => {
    setDismissed(prev => {
      const updated = new Set(prev);
      updated.add(hintId);
      saveDismissedHints(updated);
      return updated;
    });
  }, []);
  
  // Dismiss all hints permanently
  const dismissAll = useCallback(() => {
    const allDismissedSet = new Set<HintId>(['all' as HintId]);
    saveDismissedHints(allDismissedSet);
    setAllDismissed(true);
  }, []);
  
  if (!currentHint) return null;
  
  // Position the hint based on its type
  const positionClasses = {
    'canvas-center': 'absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
    'canvas-bottom': 'absolute bottom-6 left-1/2 -translate-x-1/2 z-50',
    'toolbar': 'absolute top-20 right-6 z-50',
    'sidebar': 'absolute top-1/3 left-72 z-50',
  };
  
  return (
    <div className={positionClasses[currentHint.position]}>
      <HintBubble
        hint={currentHint}
        onDismiss={() => dismissHint(currentHint.id)}
        onDismissAll={dismissAll}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESET HINTS (for settings/debug)
// ─────────────────────────────────────────────────────────────────────────────

export function resetWorkflowHints() {
  localStorage.removeItem(STORAGE_KEY);
}

export default WorkflowHints;
