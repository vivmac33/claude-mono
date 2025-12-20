// ═══════════════════════════════════════════════════════════════════════════
// MODAL
// Accessible dialog/modal component with focus trapping and animations
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { FocusTrap } from "./accessibility";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal description/subtitle */
  description?: string;
  /** Modal size */
  size?: ModalSize;
  /** Modal content */
  children: React.ReactNode;
  /** Footer content (actions) */
  footer?: React.ReactNode;
  /** Show close button in header */
  showCloseButton?: boolean;
  /** Close on backdrop click */
  closeOnBackdropClick?: boolean;
  /** Close on Escape key */
  closeOnEscape?: boolean;
  /** Additional className for modal content */
  className?: string;
  /** Hide header entirely */
  hideHeader?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// SIZE CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-4xl",
};

// ═══════════════════════════════════════════════════════════════════════════
// MODAL OVERLAY
// ═══════════════════════════════════════════════════════════════════════════

interface ModalOverlayProps {
  isOpen: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

function ModalOverlay({ isOpen, onClick, children }: ModalOverlayProps) {
  if (!isOpen) return null;
  
  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        "flex items-center justify-center p-4",
        "bg-slate-950/80 backdrop-blur-sm",
        // Animation: fade in the overlay
        "motion-safe:animate-fade-in"
      )}
      onClick={onClick}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL CONTENT
// ═══════════════════════════════════════════════════════════════════════════

interface ModalContentProps {
  size: ModalSize;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

function ModalContent({ size, children, className, onClick }: ModalContentProps) {
  return (
    <div
      className={cn(
        "relative w-full",
        sizeClasses[size],
        "bg-slate-900 border border-slate-700/50",
        "rounded-xl shadow-2xl",
        // Animation: modal entrance (scale + slide)
        "motion-safe:animate-modal-in",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL HEADER
// ═══════════════════════════════════════════════════════════════════════════

interface ModalHeaderProps {
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
}

function ModalHeader({ title, description, showCloseButton, onClose }: ModalHeaderProps) {
  if (!title && !showCloseButton) return null;
  
  return (
    <div className="flex items-start justify-between p-4 border-b border-slate-800/50">
      <div>
        {title && (
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        )}
        {description && (
          <p className="text-sm text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
      {showCloseButton && (
        <button
          onClick={onClose}
          className={cn(
            "p-1.5 rounded-lg",
            "text-slate-400 hover:text-slate-200",
            "hover:bg-slate-800",
            "transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-slate-500"
          )}
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL BODY
// ═══════════════════════════════════════════════════════════════════════════

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn("p-4", className)}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL FOOTER
// ═══════════════════════════════════════════════════════════════════════════

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn(
      "flex items-center justify-end gap-2",
      "p-4 border-t border-slate-800/50",
      className
    )}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
  hideHeader = false,
}: ModalProps) {
  // Handle escape key
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && closeOnEscape) {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  // Handle backdrop click
  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  // Prevent clicks inside modal from closing it
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleBackdropClick}>
      <FocusTrap active={isOpen}>
        <ModalContent size={size} className={className} onClick={handleContentClick}>
          {!hideHeader && (
            <ModalHeader
              title={title}
              description={description}
              showCloseButton={showCloseButton}
              onClose={onClose}
            />
          )}
          <ModalBody>{children}</ModalBody>
          {footer && <ModalFooter>{footer}</ModalFooter>}
        </ModalContent>
      </FocusTrap>
    </ModalOverlay>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIRMATION MODAL (Convenience component)
// ═══════════════════════════════════════════════════════════════════════════

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmModalProps) {
  const buttonVariant = variant === "danger" 
    ? "danger" 
    : variant === "warning" 
    ? "warning" 
    : "primary";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button 
            variant={buttonVariant} 
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-300">{message}</p>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ALERT MODAL (Convenience component)
// ═══════════════════════════════════════════════════════════════════════════

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  buttonLabel?: string;
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  buttonLabel = "OK",
}: AlertModalProps) {
  const iconConfig = {
    info: { bg: "bg-blue-500/20", color: "text-blue-400", icon: "ℹ" },
    success: { bg: "bg-emerald-500/20", color: "text-emerald-400", icon: "✓" },
    warning: { bg: "bg-amber-500/20", color: "text-amber-400", icon: "!" },
    error: { bg: "bg-red-500/20", color: "text-red-400", icon: "✕" },
  };
  
  const config = iconConfig[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <Button variant="secondary" onClick={onClose}>
          {buttonLabel}
        </Button>
      }
    >
      <div className="flex gap-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
          config.bg
        )}>
          <span className={cn("text-lg font-bold", config.color)}>
            {config.icon}
          </span>
        </div>
        <p className="text-sm text-slate-300 pt-2">{message}</p>
      </div>
    </Modal>
  );
}

export default Modal;
