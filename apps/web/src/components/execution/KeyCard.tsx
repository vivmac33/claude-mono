// ═══════════════════════════════════════════════════════════════════════════
// KEY CARD
// Individual hotkey card showing mapped action
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { KeyMapping } from '@/stores/executionStore';
import { getHotkeyDisplay } from '@/hooks/useExecutionHotkeys';

interface KeyCardProps {
  mapping: KeyMapping;
  isDark: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const QUICK_ACTION_LABELS: Record<string, { label: string; icon: string }> = {
  'exit-all': { label: 'Exit All', icon: '🚪' },
  'flat-all': { label: 'Flat All', icon: '⚖️' },
  'cancel-orders': { label: 'Cancel Orders', icon: '✕' },
  'buy-market': { label: 'Buy Market', icon: '📈' },
  'sell-market': { label: 'Sell Market', icon: '📉' },
};

export function KeyCard({ mapping, isDark, isActive, onClick }: KeyCardProps) {
  const isEmpty = mapping.type === 'empty';
  const isQuickAction = mapping.type === 'quick-action';
  const isWorkflow = mapping.type === 'workflow';
  
  const quickActionInfo = isQuickAction && mapping.quickAction 
    ? QUICK_ACTION_LABELS[mapping.quickAction] 
    : null;
  
  const getBorderColor = () => {
    if (isActive) return 'border-indigo-500 ring-2 ring-indigo-500/30';
    if (mapping.color) return `border-[${mapping.color}]/50`;
    if (isEmpty) return isDark ? 'border-slate-700/50 border-dashed' : 'border-slate-300 border-dashed';
    if (isQuickAction) return isDark ? 'border-amber-500/30' : 'border-amber-400/50';
    return isDark ? 'border-indigo-500/30' : 'border-indigo-400/50';
  };
  
  const getBackgroundColor = () => {
    if (isEmpty) return isDark ? 'bg-slate-800/20' : 'bg-slate-50';
    if (isQuickAction) return isDark ? 'bg-amber-500/5' : 'bg-amber-50';
    return isDark ? 'bg-indigo-500/5' : 'bg-indigo-50';
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full aspect-square rounded-xl border-2 p-3
        flex flex-col items-center justify-center gap-2
        transition-all duration-200 hover:scale-[1.02]
        ${getBorderColor()}
        ${getBackgroundColor()}
        ${isEmpty ? 'opacity-60 hover:opacity-100' : ''}
        ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'}
      `}
    >
      {/* Key Number Badge */}
      <div className={`
        absolute top-2 left-2 w-7 h-7 rounded-lg
        flex items-center justify-center text-sm font-bold
        ${isDark 
          ? 'bg-slate-700 text-slate-300' 
          : 'bg-slate-200 text-slate-700'
        }
      `}>
        {mapping.keyNum}
      </div>
      
      {/* Icon/Status */}
      <div className="text-2xl mt-2">
        {isEmpty && '➕'}
        {isQuickAction && (quickActionInfo?.icon || '⚡')}
        {isWorkflow && '🔄'}
      </div>
      
      {/* Label */}
      <div className={`
        text-sm font-medium text-center line-clamp-2 leading-tight
        ${isEmpty 
          ? (isDark ? 'text-slate-500' : 'text-slate-400')
          : (isDark ? 'text-slate-200' : 'text-slate-800')
        }
      `}>
        {isEmpty ? 'Empty' : mapping.label}
      </div>
      
      {/* Workflow/Action Type */}
      {!isEmpty && (
        <div className={`
          text-[10px] uppercase tracking-wide
          ${isDark ? 'text-slate-500' : 'text-slate-500'}
        `}>
          {isQuickAction ? 'Quick Action' : 'Workflow'}
        </div>
      )}
      
      {/* Hotkey */}
      <div className={`
        absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono
        ${isDark 
          ? 'bg-slate-700/50 text-slate-400' 
          : 'bg-slate-200/80 text-slate-500'
        }
      `}>
        {getHotkeyDisplay(mapping.keyNum)}
      </div>
      
      {/* Auto-confirm indicator */}
      {mapping.autoConfirm && !isEmpty && (
        <div 
          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500"
          title="Auto-confirm enabled"
        />
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KEY CARD GRID
// ─────────────────────────────────────────────────────────────────────────────

interface KeyCardGridProps {
  mappings: KeyMapping[];
  isDark: boolean;
  activeKey?: number | null;
  onKeyClick?: (keyNum: number) => void;
}

export function KeyCardGrid({ mappings, isDark, activeKey, onKeyClick }: KeyCardGridProps) {
  // Sort mappings: 1-5 on first row, 6-9,0 on second row
  const topRow = mappings.filter(m => m.keyNum >= 1 && m.keyNum <= 5).sort((a, b) => a.keyNum - b.keyNum);
  const bottomRow = [
    ...mappings.filter(m => m.keyNum >= 6 && m.keyNum <= 9).sort((a, b) => a.keyNum - b.keyNum),
    ...mappings.filter(m => m.keyNum === 0),
  ];

  return (
    <div className="space-y-3">
      {/* Row 1: Keys 1-5 */}
      <div className="grid grid-cols-5 gap-3">
        {topRow.map((mapping) => (
          <KeyCard
            key={mapping.keyNum}
            mapping={mapping}
            isDark={isDark}
            isActive={activeKey === mapping.keyNum}
            onClick={() => onKeyClick?.(mapping.keyNum)}
          />
        ))}
      </div>
      
      {/* Row 2: Keys 6-9, 0 */}
      <div className="grid grid-cols-5 gap-3">
        {bottomRow.map((mapping) => (
          <KeyCard
            key={mapping.keyNum}
            mapping={mapping}
            isDark={isDark}
            isActive={activeKey === mapping.keyNum}
            onClick={() => onKeyClick?.(mapping.keyNum)}
          />
        ))}
      </div>
    </div>
  );
}

export default KeyCard;
