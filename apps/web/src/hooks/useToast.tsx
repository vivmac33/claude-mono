/**
 * Toast System
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Simple toast notification system for Monomorph.
 * 
 * Usage:
 *   import { useToast } from '@/hooks/useToast';
 *   
 *   const { toast } = useToast();
 *   toast({ title: 'Success!', variant: 'success' });
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback, createContext, useContext, ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (options: ToastOptions) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

const ToastContext = createContext<ToastContextValue | null>(null);

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const duration = options.duration ?? 5000;

    const newToast: Toast = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant ?? 'default',
      duration,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
    </ToastContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// Can be used after provider is mounted via a global ref
// ═══════════════════════════════════════════════════════════════════════════

let globalToast: ((options: ToastOptions) => void) | null = null;

export function setGlobalToast(fn: (options: ToastOptions) => void) {
  globalToast = fn;
}

export function showToast(options: ToastOptions) {
  if (globalToast) {
    globalToast(options);
  } else {
    console.warn('Toast not available - ToastProvider not mounted');
  }
}

// Convenience methods
export const toastSuccess = (title: string, description?: string) => 
  showToast({ title, description, variant: 'success' });

export const toastError = (title: string, description?: string) => 
  showToast({ title, description, variant: 'error' });

export const toastWarning = (title: string, description?: string) => 
  showToast({ title, description, variant: 'warning' });

export const toastInfo = (title: string, description?: string) => 
  showToast({ title, description, variant: 'info' });
