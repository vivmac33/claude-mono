/**
 * FreshnessIndicator Component
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Displays data freshness with visual indicators.
 * 
 * Usage:
 *   <FreshnessIndicator timestamp={data.asOf} />
 *   <FreshnessIndicator timestamp={data.lastUpdated} label="Updated" />
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { useDataFreshness } from '@/hooks/useDataFreshness';
import { Clock, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

interface FreshnessIndicatorProps {
  /** Timestamp to display */
  timestamp: Date | string | number | null | undefined;
  /** Label prefix (default: "Updated") */
  label?: string;
  /** Show icon */
  showIcon?: boolean;
  /** Show exact time on hover */
  showTooltip?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom class names */
  className?: string;
}

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

const levelColors = {
  fresh: 'text-emerald-600',
  recent: 'text-blue-600',
  stale: 'text-amber-600',
  old: 'text-red-600',
};

const levelIcons = {
  fresh: CheckCircle,
  recent: Clock,
  stale: AlertTriangle,
  old: AlertCircle,
};

export function FreshnessIndicator({
  timestamp,
  label = 'Updated',
  showIcon = true,
  showTooltip = true,
  size = 'sm',
  className = '',
}: FreshnessIndicatorProps) {
  const freshness = useDataFreshness(timestamp);

  if (!timestamp) {
    return (
      <span className={`${sizeClasses[size]} text-gray-400 ${className}`}>
        No data
      </span>
    );
  }

  const Icon = levelIcons[freshness.level];
  const colorClass = levelColors[freshness.level];

  const formattedExactTime = freshness.timestamp
    ? freshness.timestamp.toLocaleString()
    : '';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 
        ${sizeClasses[size]} 
        ${colorClass}
        ${className}
      `}
      title={showTooltip ? formattedExactTime : undefined}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>
        {label} {freshness.label.toLowerCase()}
      </span>
    </span>
  );
}

/**
 * Compact version showing just the time ago
 */
export function FreshnessBadge({
  timestamp,
  className = '',
}: {
  timestamp: Date | string | number | null | undefined;
  className?: string;
}) {
  const freshness = useDataFreshness(timestamp);

  if (!timestamp) return null;

  const bgColors = {
    fresh: 'bg-emerald-100 text-emerald-700',
    recent: 'bg-blue-100 text-blue-700',
    stale: 'bg-amber-100 text-amber-700',
    old: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
        ${bgColors[freshness.level]}
        ${className}
      `}
      title={freshness.timestamp?.toLocaleString()}
    >
      {freshness.label}
    </span>
  );
}

export default FreshnessIndicator;
