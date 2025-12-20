// ═══════════════════════════════════════════════════════════════════════════
// CARD SKELETON COMPONENT
// Standardized loading states for all cards
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { Skeleton } from './skeleton';
import { CATEGORY_STYLES } from '@/lib/chartTheme';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type CardSkeletonVariant = 
  | 'default'
  | 'mini'
  | 'chart'
  | 'table'
  | 'radar'
  | 'stats'
  | 'list';

interface CardSkeletonProps {
  variant?: CardSkeletonVariant;
  category?: keyof typeof CATEGORY_STYLES;
  title?: string;
  description?: string;
  className?: string;
  showHeader?: boolean;
  rows?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON PRESETS
// ─────────────────────────────────────────────────────────────────────────────

function DefaultSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
      {/* Content */}
      <Skeleton className="h-32 w-full rounded-lg" />
      {/* Footer */}
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

function MiniSkeleton() {
  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="h-16 w-full rounded-lg" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
      {/* Chart Area */}
      <div className="relative h-48 w-full">
        <Skeleton className="absolute inset-0 rounded-lg" />
        {/* Fake chart lines */}
        <div className="absolute inset-4 flex items-end justify-between gap-1 opacity-30">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-1 bg-slate-600 rounded-t"
              style={{ height: `${Math.random() * 60 + 20}%` }}
            />
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="p-4 space-y-3">
      {/* Table Header */}
      <div className="flex gap-4 pb-2 border-b border-slate-700">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16 ml-auto" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-14 ml-auto" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-14" />
        </div>
      ))}
    </div>
  );
}

function RadarSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Center Badge */}
      <div className="flex justify-center">
        <div className="relative">
          <Skeleton className="h-40 w-40 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-3 rounded-lg bg-slate-800/30 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2">
          <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function CardSkeleton({
  variant = 'default',
  category,
  title,
  description,
  className = '',
  showHeader = true,
  rows,
}: CardSkeletonProps) {
  const categoryStyle = category ? CATEGORY_STYLES[category] : null;
  const accentColor = categoryStyle?.accent || '#6366f1';

  const renderContent = () => {
    switch (variant) {
      case 'mini':
        return <MiniSkeleton />;
      case 'chart':
        return <ChartSkeleton />;
      case 'table':
        return <TableSkeleton rows={rows} />;
      case 'radar':
        return <RadarSkeleton />;
      case 'stats':
        return <StatsSkeleton />;
      case 'list':
        return <ListSkeleton rows={rows} />;
      default:
        return <DefaultSkeleton />;
    }
  };

  return (
    <div 
      className={`rounded-xl border border-slate-700 bg-slate-900/80 border-l-4 overflow-hidden ${className}`}
      style={{ borderLeftColor: accentColor }}
    >
      {showHeader && (
        <div className={`px-4 py-3 border-b border-slate-800 ${categoryStyle?.headerBg || 'bg-slate-800/30'}`}>
          <div className="flex items-center gap-2">
            {categoryStyle && <span className="text-lg">{categoryStyle.icon}</span>}
            {title ? (
              <span className="text-sm font-medium text-slate-200">{title}</span>
            ) : (
              <Skeleton className="h-4 w-32" />
            )}
          </div>
          {description ? (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          ) : (
            <Skeleton className="h-3 w-24 mt-1" />
          )}
        </div>
      )}
      {renderContent()}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIMPLE INLINE SKELETON
// ─────────────────────────────────────────────────────────────────────────────

export function InlineSkeleton({ className = '' }: { className?: string }) {
  return <Skeleton className={`h-4 ${className}`} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE SKELETON (full page loading)
// ─────────────────────────────────────────────────────────────────────────────

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton variant="chart" />
          <CardSkeleton variant="stats" />
          <CardSkeleton variant="list" />
          <CardSkeleton variant="table" />
          <CardSkeleton variant="radar" />
          <CardSkeleton variant="default" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SPINNER (alternative to skeleton)
// ─────────────────────────────────────────────────────────────────────────────

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', label, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <svg 
        className={`${sizeClasses[size]} animate-spin text-indigo-500`} 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && <span className="text-sm text-slate-400">{label}</span>}
    </div>
  );
}

export default CardSkeleton;
