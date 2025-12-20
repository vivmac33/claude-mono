// ═══════════════════════════════════════════════════════════════════════════
// EXECUTION MODAL
// Preview and confirmation modal for hotkey-triggered executions
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { PendingExecution, useExecutionStore } from '@/stores/executionStore';

interface ExecutionModalProps {
  execution: PendingExecution;
  isDark: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ExecutionModal({ execution, isDark, onConfirm, onCancel }: ExecutionModalProps) {
  const isPaperTrading = useExecutionStore((state) => state.isPaperTrading);
  const connectedBroker = useExecutionStore((state) => state.connectedBroker);
  
  const { mapping, orderParams, riskSummary } = execution;
  const isQuickAction = mapping.type === 'quick-action';
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className={`
        relative w-full max-w-lg rounded-2xl border shadow-2xl
        ${isDark 
          ? 'bg-slate-900 border-slate-700' 
          : 'bg-white border-slate-200'
        }
      `}>
        {/* Header */}
        <div className={`
          flex items-center justify-between px-6 py-4 border-b
          ${isDark ? 'border-slate-700' : 'border-slate-200'}
        `}>
          <div className="flex items-center gap-3">
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold
              ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}
            `}>
              {execution.keyNum}
            </div>
            <div>
              <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Execute: {mapping.label}
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {isQuickAction ? 'Quick Action' : 'Workflow Execution'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className={`
              p-2 rounded-lg transition-colors
              ${isDark 
                ? 'hover:bg-slate-800 text-slate-400' 
                : 'hover:bg-slate-100 text-slate-500'
              }
            `}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Quick Action Display */}
          {isQuickAction && (
            <div className={`
              p-4 rounded-xl border
              ${isDark 
                ? 'bg-amber-500/10 border-amber-500/30' 
                : 'bg-amber-50 border-amber-200'
              }
            `}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {mapping.quickAction === 'exit-all' && '🚪'}
                  {mapping.quickAction === 'flat-all' && '⚖️'}
                  {mapping.quickAction === 'cancel-orders' && '✕'}
                </span>
                <div>
                  <div className={`font-medium ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                    {mapping.quickAction === 'exit-all' && 'Exit All Positions'}
                    {mapping.quickAction === 'flat-all' && 'Flatten All Positions'}
                    {mapping.quickAction === 'cancel-orders' && 'Cancel All Orders'}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-amber-400/70' : 'text-amber-600'}`}>
                    This will affect all open positions
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Order Parameters (for workflow executions) */}
          {orderParams && (
            <div className={`
              p-4 rounded-xl border space-y-3
              ${isDark 
                ? 'bg-slate-800/50 border-slate-700' 
                : 'bg-slate-50 border-slate-200'
              }
            `}>
              <div className={`text-xs uppercase tracking-wide font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Order Details
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Symbol</div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {orderParams.symbol}
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Action</div>
                  <div className={`font-semibold ${
                    orderParams.action === 'BUY' 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {orderParams.action}
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Quantity</div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {orderParams.quantity} shares
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Price</div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {formatCurrency(orderParams.price)} ({orderParams.orderType})
                  </div>
                </div>
                {orderParams.stopLoss && (
                  <div>
                    <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Stop Loss</div>
                    <div className="font-semibold text-red-500">
                      {formatCurrency(orderParams.stopLoss)}
                    </div>
                  </div>
                )}
                {orderParams.target && (
                  <div>
                    <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Target</div>
                    <div className="font-semibold text-green-500">
                      {formatCurrency(orderParams.target)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Risk Summary */}
          {riskSummary && (
            <div className={`
              p-4 rounded-xl border space-y-3
              ${isDark 
                ? 'bg-slate-800/50 border-slate-700' 
                : 'bg-slate-50 border-slate-200'
              }
            `}>
              <div className={`text-xs uppercase tracking-wide font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Risk Summary
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Capital at Risk</div>
                  <div className={`font-semibold text-amber-500`}>
                    {formatCurrency(riskSummary.capitalAtRisk)}
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Risk %</div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {riskSummary.riskPercent.toFixed(2)}% of portfolio
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Risk:Reward</div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {riskSummary.riskReward}
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Position Size</div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {formatCurrency(riskSummary.positionSize)}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Warning */}
          <div className={`
            flex items-start gap-3 p-3 rounded-lg
            ${isPaperTrading
              ? (isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700')
              : (isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-700')
            }
          `}>
            <span className="text-lg">{isPaperTrading ? '📝' : '⚠️'}</span>
            <div className="text-sm">
              {isPaperTrading ? (
                <>This is a <strong>paper trade</strong> - no real orders will be placed.</>
              ) : (
                <>This will place a <strong>LIVE order</strong> via {connectedBroker || 'your broker'}.</>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className={`
          flex items-center justify-end gap-3 px-6 py-4 border-t
          ${isDark ? 'border-slate-700' : 'border-slate-200'}
        `}>
          <button
            onClick={onCancel}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${isDark 
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }
            `}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`
              px-6 py-2 rounded-lg font-medium transition-colors
              ${isPaperTrading
                ? 'bg-blue-600 text-white hover:bg-blue-500'
                : 'bg-green-600 text-white hover:bg-green-500'
              }
            `}
          >
            {isPaperTrading ? 'Execute (Paper)' : 'Confirm & Execute'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExecutionModal;
