// ═══════════════════════════════════════════════════════════════════════════
// KEY MAPPING SETTINGS
// UI for configuring hotkey mappings
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { KeyMapping, QuickAction, useExecutionStore } from '@/stores/executionStore';
import { getHotkeyDisplay } from '@/hooks/useExecutionHotkeys';

interface KeyMappingSettingsProps {
  isDark: boolean;
}

const QUICK_ACTIONS: { id: QuickAction; label: string; icon: string; description: string }[] = [
  { id: 'exit-all', label: 'Exit All Positions', icon: '🚪', description: 'Close all open positions at market' },
  { id: 'flat-all', label: 'Flatten All', icon: '⚖️', description: 'Net zero all positions' },
  { id: 'cancel-orders', label: 'Cancel All Orders', icon: '✕', description: 'Cancel all pending orders' },
  { id: 'buy-market', label: 'Buy Market', icon: '📈', description: 'Quick market buy (requires symbol)' },
  { id: 'sell-market', label: 'Sell Market', icon: '📉', description: 'Quick market sell (requires symbol)' },
];

// Mock workflows - in real app, fetch from workflow store
const MOCK_WORKFLOWS = [
  { id: 'wf-1', name: 'Value Hunter', description: 'Screens for undervalued stocks' },
  { id: 'wf-2', name: 'Scalp Entry', description: 'Quick entry with risk management' },
  { id: 'wf-3', name: 'Swing Setup', description: 'Multi-day position sizing' },
  { id: 'wf-4', name: 'F&O Hedge', description: 'Options hedge calculator' },
  { id: 'wf-5', name: 'Momentum Scanner', description: 'High relative volume stocks' },
];

interface KeyConfigPanelProps {
  mapping: KeyMapping;
  isDark: boolean;
  onUpdate: (updates: Partial<KeyMapping>) => void;
  onClear: () => void;
}

function KeyConfigPanel({ mapping, isDark, onUpdate, onClear }: KeyConfigPanelProps) {
  const [actionType, setActionType] = useState<'workflow' | 'quick-action' | 'empty'>(mapping.type);
  
  const handleTypeChange = (type: 'workflow' | 'quick-action' | 'empty') => {
    setActionType(type);
    if (type === 'empty') {
      onClear();
    } else {
      onUpdate({ type });
    }
  };

  return (
    <div className={`
      p-4 rounded-xl border space-y-4
      ${isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold
            ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}
          `}>
            {mapping.keyNum}
          </div>
          <div>
            <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Key {mapping.keyNum}
            </div>
            <div className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {getHotkeyDisplay(mapping.keyNum)}
            </div>
          </div>
        </div>
        
        {mapping.type !== 'empty' && (
          <button
            onClick={onClear}
            className={`
              px-2 py-1 text-xs rounded transition-colors
              ${isDark 
                ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10' 
                : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
              }
            `}
          >
            Clear
          </button>
        )}
      </div>
      
      {/* Action Type Selector */}
      <div>
        <div className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Action Type
        </div>
        <div className="flex gap-2">
          {(['workflow', 'quick-action', 'empty'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`
                flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${actionType === type
                  ? 'bg-indigo-600 text-white'
                  : isDark 
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }
              `}
            >
              {type === 'workflow' && '🔄 Workflow'}
              {type === 'quick-action' && '⚡ Quick Action'}
              {type === 'empty' && '➖ Empty'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Workflow Selector */}
      {actionType === 'workflow' && (
        <div>
          <div className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Select Workflow
          </div>
          <select
            value={mapping.workflowId || ''}
            onChange={(e) => {
              const workflow = MOCK_WORKFLOWS.find(w => w.id === e.target.value);
              onUpdate({
                type: 'workflow',
                workflowId: e.target.value,
                workflowName: workflow?.name,
                label: workflow?.name || `Slot ${mapping.keyNum}`,
              });
            }}
            className={`
              w-full px-3 py-2 rounded-lg border text-sm
              ${isDark 
                ? 'bg-slate-800 border-slate-600 text-slate-200' 
                : 'bg-white border-slate-300 text-slate-800'
              }
            `}
          >
            <option value="">Select a workflow...</option>
            {MOCK_WORKFLOWS.map((wf) => (
              <option key={wf.id} value={wf.id}>
                {wf.name} - {wf.description}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Quick Action Selector */}
      {actionType === 'quick-action' && (
        <div>
          <div className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Select Quick Action
          </div>
          <div className="space-y-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                onClick={() => onUpdate({
                  type: 'quick-action',
                  quickAction: action.id,
                  label: action.label,
                })}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-left transition-colors
                  ${mapping.quickAction === action.id
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : isDark 
                      ? 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/50' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }
                `}
              >
                <span className="text-xl">{action.icon}</span>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {action.label}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {action.description}
                  </div>
                </div>
                {mapping.quickAction === action.id && (
                  <span className="text-indigo-500">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Custom Label */}
      {actionType !== 'empty' && (
        <div>
          <div className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Custom Label (optional)
          </div>
          <input
            type="text"
            value={mapping.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Enter custom label..."
            className={`
              w-full px-3 py-2 rounded-lg border text-sm
              ${isDark 
                ? 'bg-slate-800 border-slate-600 text-slate-200 placeholder-slate-500' 
                : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
              }
            `}
          />
        </div>
      )}
      
      {/* Auto-confirm Toggle */}
      {actionType !== 'empty' && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={mapping.autoConfirm}
            onChange={(e) => onUpdate({ autoConfirm: e.target.checked })}
            className="w-4 h-4 rounded border-slate-500 text-indigo-600 focus:ring-indigo-500"
          />
          <div>
            <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Auto-confirm
            </div>
            <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Skip confirmation modal (use with caution)
            </div>
          </div>
        </label>
      )}
    </div>
  );
}

export function KeyMappingSettings({ isDark }: KeyMappingSettingsProps) {
  const mappings = useExecutionStore((state) => state.mappings);
  const updateMapping = useExecutionStore((state) => state.updateMapping);
  const clearMapping = useExecutionStore((state) => state.clearMapping);
  const resetMappings = useExecutionStore((state) => state.resetMappings);
  
  const [selectedKey, setSelectedKey] = useState<number>(1);
  const selectedMapping = mappings.find(m => m.keyNum === selectedKey) || mappings[0];

  return (
    <div className="space-y-6">
      {/* Key Selector */}
      <div>
        <div className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Select Key to Configure
        </div>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((keyNum) => {
            const mapping = mappings.find(m => m.keyNum === keyNum);
            const isEmpty = mapping?.type === 'empty';
            
            return (
              <button
                key={keyNum}
                onClick={() => setSelectedKey(keyNum)}
                className={`
                  w-12 h-12 rounded-xl font-bold text-lg transition-all
                  ${selectedKey === keyNum
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-500/50'
                    : isEmpty
                      ? isDark 
                        ? 'bg-slate-800 text-slate-500 hover:bg-slate-700' 
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      : isDark 
                        ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' 
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }
                `}
              >
                {keyNum}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Config Panel */}
      <KeyConfigPanel
        mapping={selectedMapping}
        isDark={isDark}
        onUpdate={(updates) => updateMapping(selectedKey, updates)}
        onClear={() => clearMapping(selectedKey)}
      />
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <button
          onClick={resetMappings}
          className={`
            px-4 py-2 rounded-lg text-sm transition-colors
            ${isDark 
              ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10' 
              : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
            }
          `}
        >
          Reset All to Defaults
        </button>
        
        <div className="flex gap-2">
          <button
            className={`
              px-4 py-2 rounded-lg text-sm transition-colors
              ${isDark 
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }
            `}
          >
            Export
          </button>
          <button
            className={`
              px-4 py-2 rounded-lg text-sm transition-colors
              ${isDark 
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }
            `}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}

export default KeyMappingSettings;
