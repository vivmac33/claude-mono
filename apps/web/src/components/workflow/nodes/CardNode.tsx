// ═══════════════════════════════════════════════════════════════════════════
// CARD NODE
// Custom React Flow node for analysis cards
// ═══════════════════════════════════════════════════════════════════════════

import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { CardNodeData } from '../types';
import { CATEGORIES } from '@/registry/cardRegistry';

// Category color map
const getCategoryColor = (category: string): string => {
  const cat = CATEGORIES.find(c => c.id === category);
  return cat?.color || '#64748b';
};

// Category icon map
const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    value: '💎',
    growth: '📈',
    risk: '🛡️',
    technical: '📊',
    macro: '🌍',
    portfolio: '💼',
    cashflow: '💵',
    income: '💰',
    derivatives: '📉',
    'mutual-funds': '📁',
    commodities: '🏭',
    mini: '⚡',
    overview: '👁️',
  };
  return icons[category] || '📋';
};

// Status indicator
const StatusIndicator = ({ status }: { status?: CardNodeData['status'] }) => {
  if (!status || status === 'idle') return null;
  
  const statusConfig = {
    running: { color: 'bg-blue-500', animate: true, icon: '⟳' },
    success: { color: 'bg-emerald-500', animate: false, icon: '✓' },
    error: { color: 'bg-red-500', animate: false, icon: '✕' },
  };
  
  const config = statusConfig[status];
  if (!config) return null;
  
  return (
    <div 
      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${config.color} 
        flex items-center justify-center text-white text-[10px] font-bold
        ${config.animate ? 'motion-safe:animate-pulse' : ''}`}
    >
      {config.icon}
    </div>
  );
};

interface CardNodeComponentProps {
  data: CardNodeData;
  selected: boolean;
}

function CardNodeComponent({ data, selected }: CardNodeComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const categoryColor = getCategoryColor(data.category);
  const categoryIcon = getCategoryIcon(data.category);
  
  return (
    <div
      className={`
        relative min-w-[180px] max-w-[220px]
        rounded-xl border-2 transition-all duration-200
        ${selected 
          ? 'border-indigo-500 shadow-glow-indigo' 
          : isHovered 
            ? 'border-slate-500 shadow-node-hover' 
            : 'border-slate-700 shadow-node'
        }
        bg-gradient-to-br from-slate-800 to-slate-900
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-slate-600 !border-2 !border-slate-500 hover:!bg-indigo-500 hover:!border-indigo-400 transition-colors"
      />
      
      {/* Status Indicator */}
      <StatusIndicator status={data.status} />
      
      {/* Category Bar */}
      <div 
        className="h-1.5 rounded-t-lg"
        style={{ backgroundColor: categoryColor }}
      />
      
      {/* Content */}
      <div className="p-3">
        {/* Header */}
        <div className="flex items-start gap-2 mb-2">
          <span className="text-lg">{categoryIcon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-100 truncate">
              {data.label}
            </div>
            <div 
              className="text-[10px] px-1.5 py-0.5 rounded-full inline-block mt-0.5"
              style={{ 
                backgroundColor: `${categoryColor}20`,
                color: categoryColor,
              }}
            >
              {data.category}
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="text-[11px] text-slate-400 line-clamp-2 mb-2">
          {data.description}
        </div>
        
        {/* Symbol Badge */}
        {data.symbol && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">Symbol</span>
            <span className="text-xs font-mono font-bold text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded border border-teal-500/30">
              {data.symbol}
            </span>
          </div>
        )}
        
        {/* Error Message */}
        {data.error && (
          <div className="mt-2 text-[10px] text-red-400 bg-red-500/10 px-2 py-1 rounded">
            {data.error}
          </div>
        )}
      </div>
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-slate-600 !border-2 !border-slate-500 hover:!bg-indigo-500 hover:!border-indigo-400 transition-colors"
      />
    </div>
  );
}

export const CardNode = memo(CardNodeComponent);
export default CardNode;
