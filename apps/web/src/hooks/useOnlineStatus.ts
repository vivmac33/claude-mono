/**
 * useOnlineStatus Hook
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Tracks browser online/offline status with optional API health check.
 * 
 * Usage:
 *   const { isOnline, isApiHealthy, lastChecked } = useOnlineStatus();
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';

interface OnlineStatus {
  /** Browser reports online */
  isOnline: boolean;
  /** API health check passed */
  isApiHealthy: boolean | null;
  /** Last successful API check */
  lastChecked: Date | null;
  /** Currently checking API */
  isChecking: boolean;
  /** Force a health check */
  checkNow: () => Promise<void>;
}

interface UseOnlineStatusOptions {
  /** API health endpoint URL */
  healthEndpoint?: string;
  /** How often to check API health (ms) */
  checkInterval?: number;
  /** Enable API health checks */
  enableHealthCheck?: boolean;
}

const DEFAULT_OPTIONS: UseOnlineStatusOptions = {
  healthEndpoint: '/api/v1/health',
  checkInterval: 30000, // 30 seconds
  enableHealthCheck: true,
};

export function useOnlineStatus(options: UseOnlineStatusOptions = {}): OnlineStatus {
  const { healthEndpoint, checkInterval, enableHealthCheck } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isApiHealthy, setIsApiHealthy] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // Check API health
  const checkHealth = useCallback(async () => {
    if (!enableHealthCheck || !isOnline) {
      return;
    }

    setIsChecking(true);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(healthEndpoint!, {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      const healthy = response.ok;
      setIsApiHealthy(healthy);
      setLastChecked(new Date());
    } catch (error) {
      // Network error or timeout
      setIsApiHealthy(false);
    } finally {
      setIsChecking(false);
    }
  }, [healthEndpoint, enableHealthCheck, isOnline]);

  // Browser online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Check API when coming back online
      checkHealth();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsApiHealthy(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkHealth]);

  // Periodic health checks
  useEffect(() => {
    if (!enableHealthCheck || !isOnline) {
      return;
    }

    // Initial check
    checkHealth();

    // Set up interval
    const intervalId = setInterval(checkHealth, checkInterval);

    return () => clearInterval(intervalId);
  }, [checkHealth, checkInterval, enableHealthCheck, isOnline]);

  // Check on visibility change (tab focus)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isOnline) {
        checkHealth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkHealth, isOnline]);

  return {
    isOnline,
    isApiHealthy,
    lastChecked,
    isChecking,
    checkNow: checkHealth,
  };
}

export default useOnlineStatus;
