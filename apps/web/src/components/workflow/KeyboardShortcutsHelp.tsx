// ═══════════════════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS HELP OVERLAY
// Shows all available shortcuts in a beautiful modal
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { KEYBOARD_SHORTCUTS } from './hooks/useWorkflowEnhancements';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: Props) {
  if (!isOpen) return null;
  
  // Group shortcuts by category
  const grouped = KEYBOARD_SHORTCUTS.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, typeof KEYBOARD_SHORTCUTS>);
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
          border border-slate-700/50 rounded-2xl shadow-2xl
          max-w-lg w-full mx-4 overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 
                flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
                ⌨️
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Keyboard Shortcuts</h2>
                <p className="text-xs text-slate-400">Work faster with these shortcuts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {Object.entries(grouped).map(([category, shortcuts]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts.map((shortcut, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between py-2 px-3 rounded-lg
                      hover:bg-slate-800/50 transition-colors group"
                  >
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                      {shortcut.action}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, j) => (
                        <kbd
                          key={j}
                          className="min-w-[28px] h-7 px-2 rounded-md 
                            bg-slate-700/80 border border-slate-600/50
                            text-slate-300 text-xs font-medium
                            flex items-center justify-center
                            shadow-sm shadow-black/20"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-800/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 text-[10px]">?</kbd> anytime to toggle
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 
                text-white text-sm font-medium transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsHelp;
