// ═══════════════════════════════════════════════════════════════════════════
// EMPTY STATE COMPONENT
// Consistent empty state display across all cards and pages
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type EmptyStateVariant = 
  | 'default'
  | 'search'
  | 'filter'
  | 'data'
  | 'watchlist'
  | 'workflow'
  | 'chart'
  | 'error';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// ─────────────────────────────────────────────────────────────────────────────
// PRESET CONFIGS
// ─────────────────────────────────────────────────────────────────────────────

const PRESETS: Record<EmptyStateVariant, { icon: string; title: string; description: string }> = {
  default: {
    icon: '📭',
    title: 'No data available',
    description: 'There\'s nothing to display here yet.',
  },
  search: {
    icon: '🔍',
    title: 'No results found',
    description: 'Try adjusting your search or filters.',
  },
  filter: {
    icon: '🎯',
    title: 'No matches',
    description: 'No items match your current filters.',
  },
  data: {
    icon: '📊',
    title: 'No data to display',
    description: 'Data for this analysis is not available.',
  },
  watchlist: {
    icon: '⭐',
    title: 'Watchlist is empty',
    description: 'Add stocks to track them here.',
  },
  workflow: {
    icon: '🔗',
    title: 'Start building',
    description: 'Drag cards from the sidebar to create your workflow.',
  },
  chart: {
    icon: '📈',
    title: 'No chart data',
    description: 'Price data is not available for this symbol.',
  },
  error: {
    icon: '⚠️',
    title: 'Something went wrong',
    description: 'We couldn\'t load this data. Please try again.',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SIZE CONFIGS
// ─────────────────────────────────────────────────────────────────────────────

const SIZE_CLASSES = {
  sm: {
    wrapper: 'py-6 px-4',
    icon: 'text-3xl mb-2',
    title: 'text-sm font-medium',
    description: 'text-xs',
    button: 'px-3 py-1.5 text-xs',
  },
  md: {
    wrapper: 'py-10 px-6',
    icon: 'text-5xl mb-4',
    title: 'text-base font-semibold',
    description: 'text-sm',
    button: 'px-4 py-2 text-sm',
  },
  lg: {
    wrapper: 'py-16 px-8',
    icon: 'text-6xl mb-6',
    title: 'text-xl font-bold',
    description: 'text-base',
    button: 'px-6 py-3 text-base',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function EmptyState({
  variant = 'default',
  title,
  description,
  icon,
  action,
  secondaryAction,
  className = '',
  size = 'md',
}: EmptyStateProps) {
  const preset = PRESETS[variant];
  const sizeClass = SIZE_CLASSES[size];

  const displayIcon = icon || preset.icon;
  const displayTitle = title || preset.title;
  const displayDescription = description || preset.description;

  return (
    <div className={`flex flex-col items-center justify-center text-center ${sizeClass.wrapper} ${className}`}>
      {/* Icon */}
      <div className={`${sizeClass.icon} opacity-60`}>
        {typeof displayIcon === 'string' ? displayIcon : displayIcon}
      </div>

      {/* Title */}
      <h3 className={`${sizeClass.title} text-slate-300 mb-1`}>
        {displayTitle}
      </h3>

      {/* Description */}
      <p className={`${sizeClass.description} text-slate-500 max-w-xs mb-4`}>
        {displayDescription}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <button
              onClick={action.onClick}
              className={`${sizeClass.button} bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors`}
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={`${sizeClass.button} bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-colors`}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD-SPECIFIC EMPTY STATE (with border styling)
// ─────────────────────────────────────────────────────────────────────────────

interface CardEmptyStateProps extends EmptyStateProps {
  cardTitle?: string;
  accentColor?: string;
}

export function CardEmptyState({
  cardTitle,
  accentColor = '#6366f1',
  ...props
}: CardEmptyStateProps) {
  return (
    <div 
      className="rounded-xl border border-slate-700 bg-slate-900/80 border-l-4 overflow-hidden"
      style={{ borderLeftColor: accentColor }}
    >
      {cardTitle && (
        <div className="px-4 py-3 border-b border-slate-800">
          <h4 className="text-sm font-medium text-slate-300">{cardTitle}</h4>
        </div>
      )}
      <EmptyState {...props} size={props.size || 'sm'} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INLINE EMPTY STATE (minimal, for small spaces)
// ─────────────────────────────────────────────────────────────────────────────

interface InlineEmptyStateProps {
  message?: string;
  icon?: string;
  className?: string;
}

export function InlineEmptyState({
  message = 'No data',
  icon = '📭',
  className = '',
}: InlineEmptyStateProps) {
  return (
    <div className={`flex items-center justify-center gap-2 py-4 text-slate-500 ${className}`}>
      <span className="text-lg opacity-60">{icon}</span>
      <span className="text-sm">{message}</span>
    </div>
  );
}

export default EmptyState;
