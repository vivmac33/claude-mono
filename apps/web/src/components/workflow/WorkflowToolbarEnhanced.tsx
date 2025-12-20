// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOW TOOLBAR V2
// Enhanced toolbar with undo/redo, copy/paste, auto-layout
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  // Workflow info
  workflowName: string;
  onWorkflowNameChange: (name: string) => void;
  
  // Symbols
  symbols: string[];
  symbolInput: string;
  onSymbolInputChange: (value: string) => void;
  onAddSymbol: (symbol: string) => void;
  onRemoveSymbol: (symbol: string) => void;
  maxSymbols: number;
  
  // Output mode
  outputMode: 'cards' | 'list' | 'report';
  onOutputModeChange: (mode: 'cards' | 'list' | 'report') => void;
  
  // Actions
  onNew: () => void;
  onSave: () => void;
  onRun: () => void;
  onReset: () => void;
  onToggleSavedWorkflows: () => void;
  
  // NEW: Undo/Redo
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  
  // NEW: Copy/Paste
  hasSelection: boolean;
  hasClipboard: boolean;
  onCopy: () => void;
  onPaste: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  
  // NEW: Layout
  onAutoLayout: () => void;
  onShowShortcuts: () => void;
  
  // State
  isRunning: boolean;
  hasNodes: boolean;
  isSaved: boolean;
  runProgress: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function ToolbarButton({ 
  onClick, 
  disabled, 
  active,
  title, 
  icon, 
  label,
  variant = 'default',
  shortcut,
}: {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  title: string;
  icon: string;
  label?: string;
  variant?: 'default' | 'primary' | 'danger';
  shortcut?: string;
}) {
  const baseClasses = `
    flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
    transition-all duration-200 whitespace-nowrap
    ${disabled ? 'opacity-50 cursor-default' : 'cursor-pointer'}
  `;
  
  const variantClasses = {
    default: `
      bg-slate-800/80 border border-slate-700/50 text-slate-300
      ${!disabled ? 'hover:bg-slate-700 hover:text-white hover:border-slate-600' : ''}
      ${active ? 'bg-slate-700 border-slate-600 text-white' : ''}
    `,
    primary: `
      bg-indigo-600 border border-indigo-500 text-white
      ${!disabled ? 'hover:bg-indigo-500 hover:border-indigo-400' : ''}
    `,
    danger: `
      bg-red-500/20 border border-red-500/30 text-red-400
      ${!disabled ? 'hover:bg-red-500/30 hover:border-red-500/50' : ''}
    `,
  };
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      title={shortcut ? `${title} (${shortcut})` : title}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <span>{icon}</span>
      {label && <span>{label}</span>}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-slate-700/50" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function WorkflowToolbarEnhanced({
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
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  hasSelection,
  hasClipboard,
  onCopy,
  onPaste,
  onDuplicate,
  onDelete,
  onAutoLayout,
  onShowShortcuts,
  isRunning,
  hasNodes,
  isSaved,
  runProgress,
}: Props) {
  return (
    <div className="flex flex-col border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
      {/* Main toolbar row */}
      <div className="flex items-center gap-2 px-4 py-2">
        
        {/* Workflow name */}
        <input
          type="text"
          value={workflowName}
          onChange={(e) => onWorkflowNameChange(e.target.value)}
          className="bg-transparent text-base font-semibold text-slate-200 outline-none 
            border-b-2 border-transparent hover:border-slate-700 focus:border-indigo-500 
            px-1 py-0.5 min-w-[150px] max-w-[250px] transition-colors"
        />
        
        {/* Saved indicator */}
        {isSaved && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-medium">
            Saved
          </span>
        )}
        
        <div className="flex-1" />
        
        {/* Edit actions group */}
        <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700/30">
          <ToolbarButton
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
            icon="↩"
            shortcut="⌘Z"
          />
          <ToolbarButton
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
            icon="↪"
            shortcut="⌘⇧Z"
          />
          <ToolbarDivider />
          <ToolbarButton
            onClick={onCopy}
            disabled={!hasSelection}
            title="Copy"
            icon="📋"
            shortcut="⌘C"
          />
          <ToolbarButton
            onClick={onPaste}
            disabled={!hasClipboard}
            title="Paste"
            icon="📄"
            shortcut="⌘V"
          />
          <ToolbarButton
            onClick={onDuplicate}
            disabled={!hasSelection}
            title="Duplicate"
            icon="⧉"
            shortcut="⌘D"
          />
          <ToolbarButton
            onClick={onDelete}
            disabled={!hasSelection}
            title="Delete"
            icon="🗑️"
            variant="danger"
            shortcut="⌫"
          />
        </div>
        
        <ToolbarDivider />
        
        {/* Keyboard shortcuts */}
        <ToolbarButton
          onClick={onShowShortcuts}
          title="Keyboard Shortcuts"
          icon="⌨️"
          shortcut="?"
        />
        
        <ToolbarDivider />
        
        {/* File actions */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={onNew}
            title="New Workflow"
            icon="📄"
            label="New"
          />
          <ToolbarButton
            onClick={onToggleSavedWorkflows}
            title="Saved Workflows"
            icon="📂"
            label="Open"
          />
          <ToolbarButton
            onClick={onSave}
            disabled={!hasNodes}
            title="Save"
            icon="💾"
            label="Save"
            shortcut="⌘S"
          />
        </div>
        
        <ToolbarDivider />
        
        {/* Run button */}
        <ToolbarButton
          onClick={onRun}
          disabled={!hasNodes || isRunning}
          title="Run Workflow"
          icon={isRunning ? '⏳' : '▶️'}
          label={isRunning ? `${runProgress}%` : 'Run'}
          variant="primary"
          shortcut="⌘↵"
        />
        
        {hasNodes && (
          <ToolbarButton
            onClick={onReset}
            title="Reset Results"
            icon="🔄"
          />
        )}
      </div>
      
      {/* Symbols & Output Mode row */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-slate-800/50">
        {/* Symbols */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wide text-slate-500 font-medium">
            Symbols
          </span>
          <div className="flex items-center gap-1">
            {symbols.map(sym => (
              <span
                key={sym}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md
                  bg-gradient-to-r from-teal-500/20 to-cyan-500/20
                  text-teal-300 text-xs font-mono font-bold
                  border border-teal-500/30"
              >
                {sym}
                {symbols.length > 1 && (
                  <button
                    onClick={() => onRemoveSymbol(sym)}
                    className="ml-0.5 text-teal-400/60 hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
            {symbols.length < maxSymbols && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (symbolInput.trim()) {
                    onAddSymbol(symbolInput.trim());
                  }
                }}
                className="flex items-center"
              >
                <input
                  type="text"
                  value={symbolInput}
                  onChange={(e) => onSymbolInputChange(e.target.value.toUpperCase())}
                  placeholder="+ Add"
                  className="w-16 px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700/50
                    text-xs text-slate-300 placeholder-slate-600 outline-none
                    focus:border-teal-500/50 transition-colors font-mono"
                />
              </form>
            )}
          </div>
          <span className="text-[9px] text-slate-600">
            {symbols.length}/{maxSymbols}
          </span>
        </div>
        
        <div className="flex-1" />
        
        {/* Output Mode */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wide text-slate-500 font-medium">
            Output
          </span>
          <div className="flex items-center bg-slate-800/50 rounded-lg p-0.5 border border-slate-700/30">
            {(['cards', 'list', 'report'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => onOutputModeChange(mode)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all
                  ${outputMode === mode
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
              >
                {mode === 'cards' ? '🃏' : mode === 'list' ? '📋' : '📄'} {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      {isRunning && (
        <div className="h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 to-teal-500 transition-all duration-300 animate-progress-shimmer"
            style={{ width: `${runProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default WorkflowToolbarEnhanced;
