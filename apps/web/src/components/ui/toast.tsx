/**
 * Toast Notification System
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Using sonner - a lightweight, beautiful toast library
 * 
 * Usage:
 *   import { toast } from '@/components/ui/toast';
 *   
 *   toast.success('Workflow saved!');
 *   toast.error('Failed to fetch data');
 *   toast.info('Processing...');
 *   toast.warning('Rate limit approaching');
 *   toast.promise(fetchData(), {
 *     loading: 'Loading...',
 *     success: 'Data loaded!',
 *     error: 'Failed to load'
 *   });
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';
import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TOASTER COMPONENT (Add to App.tsx)
// ═══════════════════════════════════════════════════════════════════════════

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        // Default styling for dark theme
        style: {
          background: 'rgb(30 41 59)', // slate-800
          border: '1px solid rgb(51 65 85)', // slate-700
          color: 'rgb(241 245 249)', // slate-100
        },
        className: 'font-sans',
        // Duration in ms
        duration: 4000,
      }}
      // Custom icons for each type
      icons={{
        success: <SuccessIcon />,
        error: <ErrorIcon />,
        warning: <WarningIcon />,
        info: <InfoIcon />,
        loading: <LoadingIcon />,
      }}
      // Gap between toasts
      gap={8}
      // Expand on hover
      expand={true}
      // Rich colors for different toast types
      richColors
      // Close button
      closeButton
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM ICONS
// ═══════════════════════════════════════════════════════════════════════════

function SuccessIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg className="w-5 h-5 text-teal-400 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TOAST API (Enhanced wrapper around sonner)
// ═══════════════════════════════════════════════════════════════════════════

export const toast = {
  // Basic toasts
  success: (message: string, options?: ToastOptions) => 
    sonnerToast.success(message, options),
  
  error: (message: string, options?: ToastOptions) => 
    sonnerToast.error(message, options),
  
  warning: (message: string, options?: ToastOptions) => 
    sonnerToast.warning(message, options),
  
  info: (message: string, options?: ToastOptions) => 
    sonnerToast.info(message, options),
  
  // Loading toast (returns ID for dismissal)
  loading: (message: string, options?: ToastOptions) => 
    sonnerToast.loading(message, options),
  
  // Promise toast (auto-updates based on promise state)
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
    options?: ToastOptions
  ) => sonnerToast.promise(promise, messages, options),
  
  // Custom toast with JSX
  custom: (jsx: React.ReactNode, options?: ToastOptions) => 
    sonnerToast.custom(() => jsx, options),
  
  // Dismiss specific or all toasts
  dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),
  
  // ─────────────────────────────────────────────────────────────────────────
  // MONOMORPH-SPECIFIC TOASTS
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Workflow saved successfully */
  workflowSaved: (name?: string) => 
    sonnerToast.success(name ? `Workflow "${name}" saved` : 'Workflow saved', {
      description: 'Your changes have been saved locally',
    }),
  
  /** Stock added to watchlist */
  addedToWatchlist: (symbol: string) => 
    sonnerToast.success(`${symbol} added to watchlist`),
  
  /** Stock removed from watchlist */
  removedFromWatchlist: (symbol: string) => 
    sonnerToast.info(`${symbol} removed from watchlist`),
  
  /** Data fetch error */
  fetchError: (context?: string) => 
    sonnerToast.error('Failed to fetch data', {
      description: context || 'Please check your connection and try again',
    }),
  
  /** Zerodha connection status */
  zerodhaConnected: () => 
    sonnerToast.success('Connected to Zerodha', {
      description: 'Live market data is now available',
    }),
  
  zerodhaDisconnected: () => 
    sonnerToast.warning('Zerodha session expired', {
      description: 'Please reconnect to access live data',
      action: {
        label: 'Reconnect',
        onClick: () => window.location.hash = '#/settings',
      },
    }),
  
  /** Copy to clipboard */
  copied: (what?: string) => 
    sonnerToast.success(what ? `${what} copied` : 'Copied to clipboard'),
  
  /** Feature coming soon */
  comingSoon: (feature?: string) => 
    sonnerToast.info(feature ? `${feature} coming soon` : 'Coming soon', {
      description: 'This feature is under development',
    }),
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface ToastOptions {
  id?: string | number;
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick?: () => void;
  };
  onDismiss?: () => void;
  onAutoClose?: () => void;
}

export default toast;
