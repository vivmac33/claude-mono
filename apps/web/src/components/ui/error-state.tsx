// ═══════════════════════════════════════════════════════════════════════════
// ERROR STATE COMPONENT
// Consistent error display across all cards and pages
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ErrorSeverity = 'warning' | 'error' | 'critical';

export type ErrorVariant = 
  | 'default'
  | 'network'
  | 'timeout'
  | 'notfound'
  | 'permission'
  | 'validation'
  | 'server';

interface ErrorStateProps {
  variant?: ErrorVariant;
  severity?: ErrorSeverity;
  title?: string;
  message?: string;
  error?: Error | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// ─────────────────────────────────────────────────────────────────────────────
// PRESET CONFIGS
// ─────────────────────────────────────────────────────────────────────────────

const PRESETS: Record<ErrorVariant, { icon: string; title: string; message: string }> = {
  default: {
    icon: '⚠️',
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
  },
  network: {
    icon: '📡',
    title: 'Connection error',
    message: 'Unable to connect. Check your internet connection.',
  },
  timeout: {
    icon: '⏱️',
    title: 'Request timed out',
    message: 'The server took too long to respond. Please try again.',
  },
  notfound: {
    icon: '🔍',
    title: 'Not found',
    message: 'The requested data could not be found.',
  },
  permission: {
    icon: '🔒',
    title: 'Access denied',
    message: 'You don\'t have permission to view this data.',
  },
  validation: {
    icon: '📝',
    title: 'Invalid input',
    message: 'Please check your input and try again.',
  },
  server: {
    icon: '🖥️',
    title: 'Server error',
    message: 'Something went wrong on our end. We\'re working on it.',
  },
};

const SEVERITY_COLORS: Record<ErrorSeverity, { bg: string; border: string; icon: string; text: string }> = {
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: 'text-amber-400',
    text: 'text-amber-300',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: 'text-red-400',
    text: 'text-red-300',
  },
  critical: {
    bg: 'bg-rose-500/15',
    border: 'border-rose-500/40',
    icon: 'text-rose-400',
    text: 'text-rose-300',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SIZE CONFIGS
// ─────────────────────────────────────────────────────────────────────────────

const SIZE_CLASSES = {
  sm: {
    wrapper: 'p-3',
    icon: 'text-xl',
    title: 'text-sm font-medium',
    message: 'text-xs',
    button: 'px-2.5 py-1 text-xs',
  },
  md: {
    wrapper: 'p-4',
    icon: 'text-2xl',
    title: 'text-base font-semibold',
    message: 'text-sm',
    button: 'px-3 py-1.5 text-sm',
  },
  lg: {
    wrapper: 'p-6',
    icon: 'text-4xl',
    title: 'text-lg font-bold',
    message: 'text-base',
    button: 'px-4 py-2 text-base',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function ErrorState({
  variant = 'default',
  severity = 'error',
  title,
  message,
  error,
  onRetry,
  onDismiss,
  showDetails = false,
  className = '',
  size = 'md',
}: ErrorStateProps) {
  const preset = PRESETS[variant];
  const colors = SEVERITY_COLORS[severity];
  const sizeClass = SIZE_CLASSES[size];

  const displayTitle = title || preset.title;
  const displayMessage = message || (typeof error === 'string' ? error : error?.message) || preset.message;
  const errorDetails = typeof error === 'object' && error?.stack ? error.stack : null;

  return (
    <div 
      className={`rounded-xl border ${colors.bg} ${colors.border} ${sizeClass.wrapper} ${className}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`${sizeClass.icon} ${colors.icon} flex-shrink-0`}>
          {preset.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`${sizeClass.title} ${colors.text}`}>
            {displayTitle}
          </h4>
          <p className={`${sizeClass.message} text-slate-400 mt-0.5`}>
            {displayMessage}
          </p>

          {/* Error Details (collapsible) */}
          {showDetails && errorDetails && (
            <details className="mt-3">
              <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400">
                Show technical details
              </summary>
              <pre className="mt-2 text-[10px] text-slate-500 bg-slate-800/50 rounded p-2 overflow-auto max-h-24">
                {errorDetails}
              </pre>
            </details>
          )}

          {/* Actions */}
          {(onRetry || onDismiss) && (
            <div className="flex items-center gap-2 mt-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`${sizeClass.button} bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors flex items-center gap-1.5`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className={`${sizeClass.button} text-slate-400 hover:text-slate-300 transition-colors`}
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>

        {/* Close Button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 text-slate-500 hover:text-slate-300 rounded transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD ERROR STATE (fits inside card layout)
// ─────────────────────────────────────────────────────────────────────────────

interface CardErrorStateProps extends ErrorStateProps {
  cardTitle?: string;
  accentColor?: string;
}

export function CardErrorState({
  cardTitle,
  accentColor = '#ef4444',
  ...props
}: CardErrorStateProps) {
  return (
    <div 
      className="rounded-xl border border-slate-700 bg-slate-900/80 border-l-4 overflow-hidden"
      style={{ borderLeftColor: accentColor }}
    >
      {cardTitle && (
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-sm font-medium text-slate-300">{cardTitle}</h4>
          <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">Error</span>
        </div>
      )}
      <ErrorState {...props} size={props.size || 'sm'} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INLINE ERROR (minimal, for form fields etc)
// ─────────────────────────────────────────────────────────────────────────────

interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({ message, className = '' }: InlineErrorProps) {
  return (
    <div className={`flex items-center gap-1.5 text-red-400 ${className}`}>
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-xs">{message}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST ERROR (for notifications)
// ─────────────────────────────────────────────────────────────────────────────

interface ToastErrorProps {
  message: string;
  onDismiss?: () => void;
}

export function ToastError({ message, onDismiss }: ToastErrorProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-red-500/15 border border-red-500/30 rounded-xl shadow-lg backdrop-blur-xl">
      <span className="text-red-400">⚠️</span>
      <span className="text-sm text-red-200 flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 text-red-400 hover:text-red-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default ErrorState;
