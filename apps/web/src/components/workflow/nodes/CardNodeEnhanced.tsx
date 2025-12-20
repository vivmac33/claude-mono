// ═══════════════════════════════════════════════════════════════════════════
// CARD NODE - ENHANCED
// Premium visual styling with glassmorphism, animations, and category theming
// ═══════════════════════════════════════════════════════════════════════════

import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { CardNodeData } from '../types';
import { CATEGORIES } from '@/registry/cardRegistry';

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY STYLING
// ─────────────────────────────────────────────────────────────────────────────

interface CategoryStyle {
  gradient: string;
  glow: string;
  icon: string;
  accentBg: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  value: {
    gradient: 'from-indigo-600 via-violet-600 to-purple-600',
    glow: 'rgba(99, 102, 241, 0.5)',
    icon: '💎',
    accentBg: 'bg-indigo-500/20',
  },
  growth: {
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    glow: 'rgba(16, 185, 129, 0.5)',
    icon: '📈',
    accentBg: 'bg-emerald-500/20',
  },
  risk: {
    gradient: 'from-red-600 via-orange-600 to-amber-600',
    glow: 'rgba(239, 68, 68, 0.5)',
    icon: '🛡️',
    accentBg: 'bg-red-500/20',
  },
  technical: {
    gradient: 'from-cyan-600 via-blue-600 to-indigo-600',
    glow: 'rgba(6, 182, 212, 0.5)',
    icon: '📊',
    accentBg: 'bg-cyan-500/20',
  },
  macro: {
    gradient: 'from-blue-600 via-indigo-600 to-violet-600',
    glow: 'rgba(59, 130, 246, 0.5)',
    icon: '🌍',
    accentBg: 'bg-blue-500/20',
  },
  portfolio: {
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
    glow: 'rgba(139, 92, 246, 0.5)',
    icon: '💼',
    accentBg: 'bg-violet-500/20',
  },
  cashflow: {
    gradient: 'from-green-600 via-emerald-600 to-teal-600',
    glow: 'rgba(34, 197, 94, 0.5)',
    icon: '💵',
    accentBg: 'bg-green-500/20',
  },
  income: {
    gradient: 'from-amber-600 via-yellow-600 to-orange-600',
    glow: 'rgba(245, 158, 11, 0.5)',
    icon: '💰',
    accentBg: 'bg-amber-500/20',
  },
  derivatives: {
    gradient: 'from-rose-600 via-pink-600 to-fuchsia-600',
    glow: 'rgba(244, 63, 94, 0.5)',
    icon: '📉',
    accentBg: 'bg-rose-500/20',
  },
  'mutual-funds': {
    gradient: 'from-teal-600 via-cyan-600 to-sky-600',
    glow: 'rgba(20, 184, 166, 0.5)',
    icon: '📁',
    accentBg: 'bg-teal-500/20',
  },
  commodities: {
    gradient: 'from-orange-600 via-amber-600 to-yellow-600',
    glow: 'rgba(249, 115, 22, 0.5)',
    icon: '🏭',
    accentBg: 'bg-orange-500/20',
  },
  mini: {
    gradient: 'from-fuchsia-600 via-pink-600 to-rose-600',
    glow: 'rgba(192, 38, 211, 0.5)',
    icon: '⚡',
    accentBg: 'bg-fuchsia-500/20',
  },
  overview: {
    gradient: 'from-slate-600 via-gray-600 to-zinc-600',
    glow: 'rgba(100, 116, 139, 0.5)',
    icon: '👁️',
    accentBg: 'bg-slate-500/20',
  },
};

const getStyle = (category: string): CategoryStyle => {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.overview;
};

const getCategoryColor = (category: string): string => {
  const cat = CATEGORIES.find(c => c.id === category);
  return cat?.color || '#64748b';
};

// ─────────────────────────────────────────────────────────────────────────────
// STATUS INDICATOR
// ─────────────────────────────────────────────────────────────────────────────

const StatusIndicator = ({ status }: { status?: CardNodeData['status'] }) => {
  if (!status || status === 'idle') return null;
  
  const config = {
    running: { 
      bg: 'bg-blue-500', 
      ring: 'ring-blue-400', 
      icon: '⟳',
      animate: true 
    },
    success: { 
      bg: 'bg-emerald-500', 
      ring: 'ring-emerald-400', 
      icon: '✓',
      animate: false 
    },
    error: { 
      bg: 'bg-red-500', 
      ring: 'ring-red-400', 
      icon: '✕',
      animate: false 
    },
  }[status];
  
  if (!config) return null;
  
  return (
    <div className="absolute -top-2 -right-2 z-20">
      {/* Pulse ring for running state */}
      {config.animate && (
        <div className={`absolute inset-0 ${config.bg} rounded-full animate-ping opacity-75`} />
      )}
      <div 
        className={`
          relative w-6 h-6 rounded-full ${config.bg} ring-2 ${config.ring}
          flex items-center justify-center text-white text-xs font-bold
          shadow-lg
          ${config.animate ? 'animate-spin' : 'animate-bounce-once'}
        `}
      >
        {config.icon}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface CardNodeComponentProps {
  data: CardNodeData;
  selected: boolean;
}

function CardNodeComponent({ data, selected }: CardNodeComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const style = getStyle(data.category);
  const categoryColor = getCategoryColor(data.category);
  
  return (
    <div
      className={`
        relative min-w-[200px] max-w-[240px]
        transition-all duration-300 ease-out
        ${selected ? 'scale-105' : isHovered ? 'scale-102' : 'scale-100'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className={`
          !w-5 !h-5 !rounded-full !border-2 transition-all duration-200
          !bg-slate-500 !border-slate-300
          hover:!bg-teal-400 hover:!border-teal-300 hover:!scale-150
          !-top-2.5
        `}
      />
      
      {/* Status Indicator */}
      <StatusIndicator status={data.status} />
      
      {/* Main Card Container */}
      <div
        className={`
          relative overflow-hidden rounded-xl
          bg-gradient-to-br from-slate-800/90 via-slate-850/95 to-slate-900/90
          backdrop-blur-xl
          border-2 transition-all duration-300
          ${selected 
            ? 'border-transparent shadow-2xl' 
            : isHovered
              ? 'border-slate-600 shadow-xl'
              : 'border-slate-700/50 shadow-lg'
          }
        `}
        style={{
          boxShadow: selected 
            ? `0 0 40px ${style.glow}, 0 20px 40px rgba(0,0,0,0.4)`
            : isHovered
              ? `0 0 20px ${style.glow.replace('0.5', '0.2')}, 0 10px 30px rgba(0,0,0,0.3)`
              : '0 4px 20px rgba(0,0,0,0.2)',
        }}
      >
        {/* Animated Gradient Border (when selected) */}
        {selected && (
          <div 
            className={`absolute inset-0 bg-gradient-to-r ${style.gradient} opacity-100`}
            style={{
              padding: '2px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        )}
        
        {/* Category Gradient Bar */}
        <div 
          className={`h-1.5 bg-gradient-to-r ${style.gradient}`}
        />
        
        {/* Subtle Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(${categoryColor} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />
        
        {/* Content */}
        <div className="relative p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            {/* Icon with glow */}
            <div 
              className={`
                text-2xl p-2 rounded-lg ${style.accentBg}
                ${selected ? 'animate-pulse' : ''}
              `}
              style={{
                boxShadow: selected ? `0 0 20px ${style.glow}` : 'none',
              }}
            >
              {style.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Card Label */}
              <div className="text-sm font-bold text-slate-100 leading-tight mb-1">
                {data.label}
              </div>
              
              {/* Category Badge */}
              <div 
                className={`
                  inline-flex items-center gap-1
                  text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide
                  ${style.accentBg}
                `}
                style={{ color: categoryColor }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: categoryColor }} />
                {data.category}
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mb-3">
            {data.description}
          </div>
          
          {/* Symbol Badge */}
          {data.symbol && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wide">Symbol</span>
              <span 
                className="text-xs font-mono font-bold px-2 py-1 rounded-md
                  bg-gradient-to-r from-teal-500/20 to-cyan-500/20
                  text-teal-300 border border-teal-500/30"
              >
                {data.symbol}
              </span>
            </div>
          )}
          
          {/* Error Message */}
          {data.error && (
            <div className="mt-3 text-[10px] text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg">
              ⚠️ {data.error}
            </div>
          )}
        </div>
        
        {/* Hover Actions - REMOVED as requested */}
        {isHovered && !selected && (
          <div 
            className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r opacity-50"
            style={{
              background: `linear-gradient(90deg, transparent, ${categoryColor}, transparent)`,
            }}
          />
        )}
      </div>
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`
          !w-5 !h-5 !rounded-full !border-2 transition-all duration-200
          !bg-slate-500 !border-slate-300
          hover:!bg-indigo-400 hover:!border-indigo-300 hover:!scale-150
          !-bottom-2.5
        `}
      />
    </div>
  );
}

export const CardNode = memo(CardNodeComponent);
export default CardNode;
