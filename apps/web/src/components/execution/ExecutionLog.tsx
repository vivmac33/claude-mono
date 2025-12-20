// ═══════════════════════════════════════════════════════════════════════════
// EXECUTION LOG
// Displays recent hotkey executions
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { ExecutionLog as ExecutionLogType } from '@/stores/executionStore';

interface ExecutionLogProps {
  logs: ExecutionLogType[];
  isDark: boolean;
  maxItems?: number;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  }
}

const RESULT_STYLES: Record<string, { icon: string; color: string; bg: string }> = {
  success: { icon: '✓', color: 'text-green-500', bg: 'bg-green-500/10' },
  cancelled: { icon: '✕', color: 'text-slate-400', bg: 'bg-slate-500/10' },
  error: { icon: '!', color: 'text-red-500', bg: 'bg-red-500/10' },
  pending: { icon: '○', color: 'text-amber-500', bg: 'bg-amber-500/10' },
};

export function ExecutionLog({ logs, isDark, maxItems = 10 }: ExecutionLogProps) {
  const displayLogs = logs.slice(0, maxItems);
  
  if (displayLogs.length === 0) {
    return (
      <div className={`
        p-8 text-center rounded-xl border border-dashed
        ${isDark ? 'border-slate-700 text-slate-500' : 'border-slate-300 text-slate-400'}
      `}>
        <div className="text-3xl mb-2">📋</div>
        <div className="text-sm">No executions yet</div>
        <div className="text-xs mt-1">
          Press Ctrl+1 through Ctrl+0 to trigger hotkeys
        </div>
      </div>
    );
  }

  return (
    <div className={`
      rounded-xl border overflow-hidden
      ${isDark ? 'border-slate-700' : 'border-slate-200'}
    `}>
      {/* Header */}
      <div className={`
        px-4 py-3 border-b flex items-center justify-between
        ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}
      `}>
        <div className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Recent Executions
        </div>
        <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {logs.length} total
        </div>
      </div>
      
      {/* Log List */}
      <div className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-slate-100'}`}>
        {displayLogs.map((log) => {
          const resultStyle = RESULT_STYLES[log.result] || RESULT_STYLES.pending;
          
          return (
            <div
              key={log.id}
              className={`
                px-4 py-3 flex items-center gap-3 transition-colors
                ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}
              `}
            >
              {/* Result Icon */}
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${resultStyle.bg} ${resultStyle.color}
              `}>
                {resultStyle.icon}
              </div>
              
              {/* Key Number */}
              <div className={`
                w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold
                ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}
              `}>
                {log.keyNum}
              </div>
              
              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {log.label}
                </div>
                <div className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  {log.action}
                  {log.details && <span> • {log.details}</span>}
                </div>
              </div>
              
              {/* Timestamp */}
              <div className={`text-right flex-shrink-0`}>
                <div className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {formatTime(log.timestamp)}
                </div>
                <div className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                  {formatDate(log.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Show More */}
      {logs.length > maxItems && (
        <div className={`
          px-4 py-2 text-center border-t
          ${isDark ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50'}
        `}>
          <button className={`text-xs ${isDark ? 'text-indigo-400' : 'text-indigo-600'} hover:underline`}>
            View all {logs.length} executions
          </button>
        </div>
      )}
    </div>
  );
}

export default ExecutionLog;
