import * as React from "react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════
// SKIP LINK
// Hidden link that appears on focus, allowing keyboard users to skip navigation
// ═══════════════════════════════════════════════════════════════════════════

interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The target element ID to skip to (without #) */
  targetId?: string;
  /** Custom text for the skip link */
  children?: React.ReactNode;
}

function SkipLink({
  targetId = "main-content",
  children = "Skip to main content",
  className,
  ...props
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        // Hidden by default
        "sr-only",
        // Visible when focused
        "focus:not-sr-only",
        "focus:fixed focus:top-4 focus:left-4 focus:z-[9999]",
        "focus:px-4 focus:py-2",
        "focus:bg-indigo-600 focus:text-white",
        "focus:rounded-lg focus:shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600",
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SKIP LINK GROUP
// Multiple skip links for complex pages
// ═══════════════════════════════════════════════════════════════════════════

interface SkipLinkItem {
  targetId: string;
  label: string;
}

interface SkipLinkGroupProps {
  links: SkipLinkItem[];
  className?: string;
}

function SkipLinkGroup({ links, className }: SkipLinkGroupProps) {
  return (
    <div className={cn("contents", className)}>
      {links.map((link, index) => (
        <SkipLink
          key={link.targetId}
          targetId={link.targetId}
          className={cn(
            // Stack multiple links vertically
            index > 0 && "focus:top-16"
          )}
        >
          {link.label}
        </SkipLink>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VISUALLY HIDDEN (for screen readers only)
// ═══════════════════════════════════════════════════════════════════════════

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

function VisuallyHidden({ children, className, ...props }: VisuallyHiddenProps) {
  return (
    <span className={cn("sr-only", className)} {...props}>
      {children}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOCUS TRAP (for modals/dialogs)
// Keeps focus within a container for accessibility
// ═══════════════════════════════════════════════════════════════════════════

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
}

function FocusTrap({ children, active = true }: FocusTrapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first element on mount
    firstElement?.focus();

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  return <div ref={containerRef}>{children}</div>;
}

export { SkipLink, SkipLinkGroup, VisuallyHidden, FocusTrap };
