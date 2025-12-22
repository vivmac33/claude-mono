/**
 * Toaster Component
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Renders toast notifications. Add once at the root of your app.
 * 
 * Usage:
 *   // In App.tsx
 *   import { Toaster } from '@/components/ui/toaster';
 *   
 *   <ThemeProvider>
 *     <Toaster />
 *     {children}
 *   </ThemeProvider>
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect } from 'react';
import { useToast, setGlobalToast, ToastVariant } from '@/hooks/useToast';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════
// VARIANT STYLES
// ═══════════════════════════════════════════════════════════════════════════

const variantStyles: Record<ToastVariant, {
  bg: string;
  border: string;
  icon: typeof CheckCircle;
  iconColor: string;
}> = {
  default: {
    bg: 'bg-slate-800',
    border: 'border-slate-700',
    icon: Info,
    iconColor: 'text-slate-400',
  },
  success: {
    bg: 'bg-emerald-950/90',
    border: 'border-emerald-800',
    icon: CheckCircle,
    iconColor: 'text-emerald-400',
  },
  error: {
    bg: 'bg-red-950/90',
    border: 'border-red-800',
    icon: AlertCircle,
    iconColor: 'text-red-400',
  },
  warning: {
    bg: 'bg-amber-950/90',
    border: 'border-amber-800',
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
  },
  info: {
    bg: 'bg-blue-950/90',
    border: 'border-blue-800',
    icon: Info,
    iconColor: 'text-blue-400',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// TOAST ITEM
// ═══════════════════════════════════════════════════════════════════════════

interface ToastItemProps {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  onDismiss: (id: string) => void;
}

function ToastItem({ id, title, description, variant, onDismiss }: ToastItemProps) {
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 w-full max-w-sm p-4 rounded-lg border shadow-lg backdrop-blur-sm',
        'animate-in slide-in-from-right-full duration-300',
        styles.bg,
        styles.border
      )}
      role="alert"
    >
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', styles.iconColor)} />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-100">{title}</p>
        {description && (
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        )}
      </div>
      
      <button
        onClick={() => onDismiss(id)}
        className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TOASTER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function Toaster() {
  const { toasts, dismiss, toast } = useToast();

  // Register global toast function
  useEffect(() => {
    setGlobalToast(toast);
    return () => setGlobalToast(() => {});
  }, [toast]);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          id={t.id}
          title={t.title}
          description={t.description}
          variant={t.variant || 'default'}
          onDismiss={dismiss}
        />
      ))}
    </div>
  );
}

export default Toaster;
