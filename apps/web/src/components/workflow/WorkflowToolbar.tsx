// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOW TOOLBAR
// Top toolbar with workflow controls, multi-symbol input, and action buttons
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';

interface WorkflowToolbarProps {
  workflowName: string;
  onWorkflowNameChange: (name: string) => void;
  symbols: string[];
  symbolInput: string;
  onSymbolInputChange: (value: string) => void;
  onAddSymbol: (symbol: string) => void;
  onRemoveSymbol: (symbol: string) => void;
  maxSymbols: number;
  outputMode: 'cards' | 'list' | 'report';
  onOutputModeChange: (mode: 'cards' | 'list' | 'report') => void;
  onNew: () => void;
  onSave: () => void;
  onRun: () => void;
  onReset: () => void;
  onToggleSavedWorkflows: () => void;
  isRunning: boolean;
  hasNodes: boolean;
  isSaved: boolean;
  runProgress: number;
}

export function WorkflowToolbar({
  workflowName,
  onWorkflowNameChange,
  symbols,
  symbolInput,
  onSymbolInputChange,
  onAddSymbol,
  onRemoveSymbol,
  maxSymbols,
  outputMode,
  onOutputModeChange,
  onNew,
  onSave,
  onRun,
  onReset,
  onToggleSavedWorkflows,
  isRunning,
  hasNodes,
  isSaved,
  runProgress,
}: WorkflowToolbarProps) {
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && symbolInput.trim()) {
      onAddSymbol(symbolInput);
    }
  };
  
  return (
    <div className="h-14 bg-slate-900/80 border-b border-slate-700/50 px-4 flex items-center gap-3">
      
      {/* Workflow Name */}
      <div className="flex items-center gap-2">
        <span className="text-slate-500 text-sm">📊</span>
        <input
          type="text"
          value={workflowName}
          onChange={(e) => onWorkflowNameChange(e.target.value)}
          className="bg-transparent border-none outline-none text-base font-semibold text-slate-200
            focus:ring-0 w-36 truncate"
          placeholder="Workflow Name"
        />
        {isSaved && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
            saved
          </span>
        )}
      </div>
      
      {/* Divider */}
      <div className="h-8 w-px bg-slate-700" />
      
      {/* Symbols */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Symbols:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {symbols.map(sym => (
            <span 
              key={sym}
              className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-sm font-mono font-semibold text-teal-400"
            >
              {sym}
              {symbols.length > 1 && (
                <button
                  onClick={() => onRemoveSymbol(sym)}
                  className="text-slate-500 hover:text-red-400 text-xs ml-0.5"
                >
                  ×
                </button>
              )}
            </span>
          ))}
          {symbols.length < maxSymbols && (
            <div className="flex items-center">
              <input
                type="text"
                value={symbolInput}
                onChange={(e) => onSymbolInputChange(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
                className="w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg
                  text-sm font-mono text-slate-300 outline-none
                  focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20
                  placeholder:text-slate-600"
                placeholder="+ Add"
              />
              {symbolInput && (
                <button
                  onClick={() => onAddSymbol(symbolInput)}
                  className="ml-1 p-1 text-teal-400 hover:text-teal-300"
                >
                  ↵
                </button>
              )}
            </div>
          )}
        </div>
        <span className="text-[10px] text-slate-600">({symbols.length}/{maxSymbols})</span>
      </div>
      
      {/* Divider */}
      <div className="h-8 w-px bg-slate-700" />
      
      {/* Output Mode */}
      <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg">
        {(['cards', 'list', 'report'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => onOutputModeChange(mode)}
            className={`px-2 py-1 rounded-md text-xs font-medium capitalize transition-colors
              ${outputMode === mode
                ? 'bg-indigo-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
          >
            {mode === 'cards' && '🃏'}
            {mode === 'list' && '📋'}
            {mode === 'report' && '📄'}
          </button>
        ))}
      </div>
      
      {/* Spacer */}
      <div className="flex-1" />
      
      {/* Progress Indicator */}
      {isRunning && (
        <div className="flex items-center gap-2 mr-2">
          <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${runProgress}%` }}
            />
          </div>
          <span className="text-xs text-slate-400">{runProgress}%</span>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Saved Workflows */}
        <button
          onClick={onToggleSavedWorkflows}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Saved Workflows"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </button>
        
        {/* New */}
        <button
          onClick={onNew}
          className="px-2.5 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 
            text-xs text-slate-300 hover:text-white transition-colors"
          title="New Workflow"
        >
          New
        </button>
        
        {/* Save */}
        <button
          onClick={onSave}
          disabled={!hasNodes}
          className="px-2.5 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 
            text-xs text-slate-300 hover:text-white transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
          title="Save Workflow (Ctrl+S)"
        >
          Save
        </button>
        
        {/* Reset */}
        {hasNodes && (
          <button
            onClick={onReset}
            className="px-2.5 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 
              text-xs text-slate-300 hover:text-white transition-colors"
            title="Reset Results"
          >
            Reset
          </button>
        )}
        
        {/* Run */}
        <button
          onClick={onRun}
          disabled={!hasNodes || isRunning}
          className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all
            ${isRunning
              ? 'bg-indigo-600/50 text-indigo-300 cursor-wait'
              : hasNodes
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          title="Run Workflow (Ctrl+Enter)"
        >
          {isRunning ? (
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3 motion-safe:animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Running
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              ▶ Run
            </span>
          )}
        </button>
      </div>
      
      {/* Keyboard Shortcuts Hint */}
      <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-600 ml-1">
        <span>⌘S</span>
        <span>⌘↵</span>
      </div>
    </div>
  );
}

export default WorkflowToolbar;
