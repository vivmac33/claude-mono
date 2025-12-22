/**
 * OfflineIndicator Component
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Displays a banner when the user is offline or API is unreachable.
 * 
 * Usage:
 *   <OfflineIndicator />
 * 
 * Place at the root of your app (e.g., in App.tsx or Layout).
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff, ServerOff, RefreshCw } from 'lucide-react';

interface OfflineIndicatorProps {
  /** Show API health status (not just browser offline) */
  showApiStatus?: boolean;
  /** Custom health endpoint */
  healthEndpoint?: string;
  /** Position of the banner */
  position?: 'top' | 'bottom';
}

export function OfflineIndicator({
  showApiStatus = true,
  healthEndpoint,
  position = 'top',
}: OfflineIndicatorProps) {
  const { isOnline, isApiHealthy, isChecking, checkNow } = useOnlineStatus({
    healthEndpoint,
    enableHealthCheck: showApiStatus,
  });

  // Don't show anything if all is well
  if (isOnline && (isApiHealthy === true || isApiHealthy === null)) {
    return null;
  }

  const isOffline = !isOnline;
  const isApiDown = isOnline && isApiHealthy === false;

  const positionClasses = position === 'top' 
    ? 'top-0' 
    : 'bottom-0';

  return (
    <div
      className={`fixed left-0 right-0 z-50 ${positionClasses}`}
      role="alert"
      aria-live="polite"
    >
      <div
        className={`
          flex items-center justify-center gap-3 px-4 py-2 text-sm font-medium
          ${isOffline 
            ? 'bg-gray-800 text-white' 
            : 'bg-amber-500 text-amber-950'
          }
        `}
      >
        {isOffline ? (
          <>
            <WifiOff className="h-4 w-4" />
            <span>You're offline. Check your internet connection.</span>
          </>
        ) : isApiDown ? (
          <>
            <ServerOff className="h-4 w-4" />
            <span>Unable to reach server. Some features may be unavailable.</span>
            <button
              onClick={checkNow}
              disabled={isChecking}
              className="ml-2 flex items-center gap-1 rounded bg-amber-600 px-2 py-1 text-xs hover:bg-amber-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Checking...' : 'Retry'}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default OfflineIndicator;
