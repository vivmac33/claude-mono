// ═══════════════════════════════════════════════════════════════════════════
// EXECUTION PAD PAGE
// Hotkey-based order execution system
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useCallback } from 'react';
import { NavHeader } from '@/components/layout/NavHeader';
import { useTheme } from '@/components/ThemeProvider';
import { useExecutionStore, PendingExecution } from '@/stores/executionStore';
import { useExecutionHotkeys } from '@/hooks/useExecutionHotkeys';
import {
  KeyCardGrid,
  ExecutionModal,
  ExecutionLog,
  KeyMappingSettings,
  HardwareGuide,
} from '@/components/execution';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type TabType = 'dashboard' | 'settings' | 'hardware';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK EXECUTION HANDLER
// In real implementation, this would call OpenAlgo or similar
// ─────────────────────────────────────────────────────────────────────────────

function generateMockExecution(keyNum: number, mapping: any): PendingExecution {
  // For workflow type, generate mock order params
  if (mapping.type === 'workflow') {
    return {
      keyNum,
      mapping,
      orderParams: {
        symbol: 'TCS',
        action: 'BUY',
        quantity: 50,
        price: 4125.00,
        stopLoss: 4083.75,
        target: 4207.50,
        orderType: 'MARKET',
      },
      riskSummary: {
        capitalAtRisk: 2062.50,
        riskPercent: 1.03,
        riskReward: '1:2',
        positionSize: 206250,
      },
    };
  }
  
  // For quick actions, just return mapping
  return {
    keyNum,
    mapping,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ExecutionPadPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedKey, setSelectedKey] = useState<number | null>(null);
  
  // Store state
  const hotkeysEnabled = useExecutionStore((state) => state.hotkeysEnabled);
  const setHotkeysEnabled = useExecutionStore((state) => state.setHotkeysEnabled);
  const mappings = useExecutionStore((state) => state.mappings);
  const pendingExecution = useExecutionStore((state) => state.pendingExecution);
  const setPendingExecution = useExecutionStore((state) => state.setPendingExecution);
  const executionLogs = useExecutionStore((state) => state.executionLogs);
  const addLog = useExecutionStore((state) => state.addLog);
  const isPaperTrading = useExecutionStore((state) => state.isPaperTrading);
  const setIsPaperTrading = useExecutionStore((state) => state.setIsPaperTrading);
  
  // Handle hotkey trigger
  const handleHotkeyTrigger = useCallback((keyNum: number) => {
    const mapping = mappings.find(m => m.keyNum === keyNum);
    if (!mapping || mapping.type === 'empty') {
      // Log empty key press
      addLog({
        keyNum,
        label: `Key ${keyNum}`,
        action: 'Empty slot - no action configured',
        result: 'cancelled',
      });
      return;
    }
    
    // Generate execution preview
    const execution = generateMockExecution(keyNum, mapping);
    
    // If auto-confirm is enabled, execute immediately
    if (mapping.autoConfirm) {
      handleConfirmExecution(execution);
    } else {
      // Show confirmation modal
      setPendingExecution(execution);
    }
  }, [mappings, addLog, setPendingExecution]);
  
  // Handle execution confirmation
  const handleConfirmExecution = useCallback((execution: PendingExecution) => {
    // Log the execution
    addLog({
      keyNum: execution.keyNum,
      label: execution.mapping.label,
      action: execution.mapping.type === 'quick-action'
        ? `Quick Action: ${execution.mapping.quickAction}`
        : `Workflow: ${execution.mapping.workflowName || 'Unknown'}`,
      result: 'success',
      details: execution.orderParams
        ? `${execution.orderParams.action} ${execution.orderParams.quantity} ${execution.orderParams.symbol} @ ₹${execution.orderParams.price}`
        : undefined,
    });
    
    // Clear pending execution
    setPendingExecution(null);
    
    // TODO: Actually execute via OpenAlgo
    console.log('🚀 Executing:', execution);
  }, [addLog, setPendingExecution]);
  
  // Handle execution cancellation
  const handleCancelExecution = useCallback(() => {
    if (pendingExecution) {
      addLog({
        keyNum: pendingExecution.keyNum,
        label: pendingExecution.mapping.label,
        action: 'Execution cancelled by user',
        result: 'cancelled',
      });
    }
    setPendingExecution(null);
  }, [pendingExecution, addLog, setPendingExecution]);
  
  // Register hotkey listener
  useExecutionHotkeys({
    onTrigger: handleHotkeyTrigger,
    enabled: activeTab === 'dashboard', // Only active on dashboard
  });
  
  // Handle key card click (for editing)
  const handleKeyClick = useCallback((keyNum: number) => {
    setSelectedKey(keyNum);
    setActiveTab('settings');
  }, []);

  return (
    <div className={`min-h-screen transition-colors ${
      isDark 
        ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white' 
        : 'bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-900'
    }`}>
      <NavHeader currentPage="execute" />
      
      {/* Header */}
      <div className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Execution Pad
              </h1>
              <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                One-key workflow execution • Ctrl+1 through Ctrl+0
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Paper Trading Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Paper Trading
                </span>
                <button
                  onClick={() => setIsPaperTrading(!isPaperTrading)}
                  className={`
                    relative w-11 h-6 rounded-full transition-colors
                    ${isPaperTrading 
                      ? 'bg-blue-600' 
                      : 'bg-green-600'
                    }
                  `}
                >
                  <span className={`
                    absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                    ${isPaperTrading ? 'left-1' : 'left-6'}
                  `} />
                </button>
                <span className={`text-sm font-medium ${isPaperTrading ? 'text-blue-400' : 'text-green-400'}`}>
                  {isPaperTrading ? 'Paper' : 'Live'}
                </span>
              </label>
              
              {/* Hotkeys Toggle */}
              <button
                onClick={() => setHotkeysEnabled(!hotkeysEnabled)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                  ${hotkeysEnabled
                    ? isDark 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-green-100 text-green-700 border border-green-300'
                    : isDark 
                      ? 'bg-slate-800 text-slate-400 border border-slate-700' 
                      : 'bg-slate-200 text-slate-600 border border-slate-300'
                  }
                `}
              >
                <span className={`w-2 h-2 rounded-full ${hotkeysEnabled ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
                {hotkeysEnabled ? 'Hotkeys Active' : 'Hotkeys Disabled'}
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {([
              { id: 'dashboard', label: 'Dashboard', icon: '🎛️' },
              { id: 'settings', label: 'Settings', icon: '⚙️' },
              { id: 'hardware', label: 'Hardware Guide', icon: '⌨️' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
                  ${activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : isDark 
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }
                `}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Keyboard Guide */}
            {hotkeysEnabled && (
              <div className={`
                p-3 rounded-lg flex items-center gap-3 text-sm
                ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-700'}
              `}>
                <span className="text-lg">💡</span>
                <span>
                  Press <kbd className={`px-1.5 py-0.5 rounded font-mono text-xs ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>Ctrl</kbd>
                  {' + '}
                  <kbd className={`px-1.5 py-0.5 rounded font-mono text-xs ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>1-0</kbd>
                  {' '}to trigger hotkeys. Click a key card to configure it.
                </span>
              </div>
            )}
            
            {/* Key Cards Grid */}
            <div>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Hotkey Mappings
              </h2>
              <KeyCardGrid
                mappings={mappings}
                isDark={isDark}
                activeKey={selectedKey}
                onKeyClick={handleKeyClick}
              />
            </div>
            
            {/* Execution Log */}
            <div>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Recent Executions
              </h2>
              <ExecutionLog logs={executionLogs} isDark={isDark} maxItems={5} />
            </div>
          </div>
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Configure Key Mappings
            </h2>
            <KeyMappingSettings isDark={isDark} />
          </div>
        )}
        
        {/* Hardware Guide Tab */}
        {activeTab === 'hardware' && (
          <HardwareGuide isDark={isDark} />
        )}
      </div>
      
      {/* Execution Modal */}
      {pendingExecution && (
        <ExecutionModal
          execution={pendingExecution}
          isDark={isDark}
          onConfirm={() => handleConfirmExecution(pendingExecution)}
          onCancel={handleCancelExecution}
        />
      )}
    </div>
  );
}
