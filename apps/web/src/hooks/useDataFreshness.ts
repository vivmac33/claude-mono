/**
 * useDataFreshness Hook
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Formats timestamps into human-readable "time ago" strings.
 * Auto-updates the display as time passes.
 * 
 * Usage:
 *   const freshness = useDataFreshness(lastUpdatedTimestamp);
 *   // Returns: "Just now", "2 minutes ago", "1 hour ago", etc.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useMemo } from 'react';

interface DataFreshness {
  /** Human-readable time ago string */
  label: string;
  /** Freshness level for styling */
  level: 'fresh' | 'recent' | 'stale' | 'old';
  /** Exact timestamp */
  timestamp: Date | null;
  /** Seconds since last update */
  secondsAgo: number;
}

interface UseDataFreshnessOptions {
  /** Update interval in ms (default: 10000 = 10s) */
  updateInterval?: number;
  /** Threshold for "fresh" in seconds (default: 60) */
  freshThreshold?: number;
  /** Threshold for "recent" in seconds (default: 300 = 5min) */
  recentThreshold?: number;
  /** Threshold for "stale" in seconds (default: 3600 = 1hr) */
  staleThreshold?: number;
}

const DEFAULT_OPTIONS: UseDataFreshnessOptions = {
  updateInterval: 10000,
  freshThreshold: 60,
  recentThreshold: 300,
  staleThreshold: 3600,
};

/**
 * Format seconds into human-readable string
 */
function formatTimeAgo(seconds: number): string {
  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${Math.floor(seconds)} seconds ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  if (weeks < 4) return `${weeks} weeks ago`;
  
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;
  
  const years = Math.floor(days / 365);
  if (years === 1) return '1 year ago';
  return `${years} years ago`;
}

/**
 * Get freshness level based on seconds
 */
function getFreshnessLevel(
  seconds: number,
  freshThreshold: number,
  recentThreshold: number,
  staleThreshold: number
): DataFreshness['level'] {
  if (seconds <= freshThreshold) return 'fresh';
  if (seconds <= recentThreshold) return 'recent';
  if (seconds <= staleThreshold) return 'stale';
  return 'old';
}

export function useDataFreshness(
  timestamp: Date | string | number | null | undefined,
  options: UseDataFreshnessOptions = {}
): DataFreshness {
  const { updateInterval, freshThreshold, recentThreshold, staleThreshold } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  // Parse timestamp
  const parsedTimestamp = useMemo(() => {
    if (!timestamp) return null;
    if (timestamp instanceof Date) return timestamp;
    return new Date(timestamp);
  }, [timestamp]);

  // Calculate initial seconds ago
  const calculateSecondsAgo = () => {
    if (!parsedTimestamp) return Infinity;
    return Math.floor((Date.now() - parsedTimestamp.getTime()) / 1000);
  };

  const [secondsAgo, setSecondsAgo] = useState(calculateSecondsAgo);

  // Update periodically
  useEffect(() => {
    if (!parsedTimestamp) return;

    const intervalId = setInterval(() => {
      setSecondsAgo(calculateSecondsAgo());
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [parsedTimestamp, updateInterval]);

  // Recalculate when timestamp changes
  useEffect(() => {
    setSecondsAgo(calculateSecondsAgo());
  }, [parsedTimestamp]);

  return {
    label: parsedTimestamp ? formatTimeAgo(secondsAgo) : 'Never',
    level: getFreshnessLevel(secondsAgo, freshThreshold!, recentThreshold!, staleThreshold!),
    timestamp: parsedTimestamp,
    secondsAgo,
  };
}

export default useDataFreshness;
