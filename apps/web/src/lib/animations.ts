// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION SYSTEM
// Centralized animation utilities for consistent motion throughout Monomorph
// All animations respect user's prefers-reduced-motion setting via motion-safe:
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION CLASS NAMES
// Use these with motion-safe: prefix for accessibility
// Example: "motion-safe:animate-fade-in"
// ═══════════════════════════════════════════════════════════════════════════

export const animations = {
  // ─────────────────────────────────────────────────────────────────────────
  // ENTRANCE ANIMATIONS
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Fade in from transparent - use for overlays, backdrops */
  fadeIn: "motion-safe:animate-fade-in",
  
  /** Slide up from below - use for toasts, bottom sheets, cards appearing */
  slideUp: "motion-safe:animate-slide-up",
  
  /** Slide down from above - use for dropdowns, notifications from top */
  slideDown: "motion-safe:animate-slide-down",
  
  /** Slide in from right - use for panels, side content */
  slideLeft: "motion-safe:animate-slide-left",
  
  /** Slide in from left - use for back navigation, left panels */
  slideRight: "motion-safe:animate-slide-right",
  
  /** Scale up from smaller - use for tooltips, popovers, buttons */
  scaleIn: "motion-safe:animate-scale-in",
  
  // ─────────────────────────────────────────────────────────────────────────
  // COMPONENT-SPECIFIC ANIMATIONS
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Modal entrance - scale + slight slide */
  modal: "motion-safe:animate-modal-in",
  
  /** Dropdown menu entrance - subtle scale + slide down */
  dropdown: "motion-safe:animate-dropdown-in",
  
  /** Tooltip entrance - quick scale */
  tooltip: "motion-safe:animate-tooltip-in",
  
  /** Toast notification entrance - slide up from bottom */
  toast: "motion-safe:animate-toast-in",
  
  /** Left drawer slide in */
  drawerLeft: "motion-safe:animate-drawer-left-in",
  
  /** Right drawer slide in */
  drawerRight: "motion-safe:animate-drawer-right-in",
  
  // ─────────────────────────────────────────────────────────────────────────
  // EXIT ANIMATIONS
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Fade out to transparent */
  fadeOut: "motion-safe:animate-fade-out",
  
  /** Scale down and fade */
  scaleOut: "motion-safe:animate-scale-out",
  
  /** Modal exit */
  modalOut: "motion-safe:animate-modal-out",
  
  // ─────────────────────────────────────────────────────────────────────────
  // CONTINUOUS ANIMATIONS (use sparingly)
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Slow pulse - use for subtle attention, live indicators */
  pulseSlow: "motion-safe:animate-pulse-slow",
  
  /** Fast pulse - use for urgent attention, loading states */
  pulseFast: "motion-safe:animate-pulse-fast",
  
  /** Glow pulse - use for highlighted/featured elements */
  glowPulse: "motion-safe:animate-glow-pulse",
  
  /** Shimmer - use for loading skeletons */
  shimmer: "motion-safe:animate-shimmer",
  
  /** Slow spin - use for loading indicators */
  spinSlow: "motion-safe:animate-spin-slow",
  
  /** Standard spin - use for loading spinners */
  spin: "motion-safe:animate-spin",
  
  // ─────────────────────────────────────────────────────────────────────────
  // ATTENTION ANIMATIONS (use very sparingly)
  // ─────────────────────────────────────────────────────────────────────────
  
  /** Subtle bounce - use for successful actions */
  bounce: "motion-safe:animate-bounce-subtle",
  
  /** Shake - use for errors, invalid inputs */
  shake: "motion-safe:animate-shake",
  
  /** Wiggle - use for playful attention */
  wiggle: "motion-safe:animate-wiggle",
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TRANSITION CLASSES
// Standard transition patterns for hover/focus states
// ═══════════════════════════════════════════════════════════════════════════

export const transitions = {
  /** Standard transition for most interactive elements */
  default: "transition-all duration-200 ease-out",
  
  /** Fast transition for micro-interactions (hover, focus) */
  fast: "transition-all duration-150 ease-out",
  
  /** Slow transition for larger state changes */
  slow: "transition-all duration-300 ease-out",
  
  /** Color-only transition */
  colors: "transition-colors duration-200",
  
  /** Transform-only transition (scale, rotate, translate) */
  transform: "transition-transform duration-200 ease-out",
  
  /** Opacity-only transition */
  opacity: "transition-opacity duration-200",
  
  /** Shadow transition for cards */
  shadow: "transition-shadow duration-200",
  
  /** No transition */
  none: "transition-none",
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT ANIMATION PRESETS
// Copy-paste ready class combinations for common components
// ═══════════════════════════════════════════════════════════════════════════

export const animationPresets = {
  // ─────────────────────────────────────────────────────────────────────────
  // OVERLAY/BACKDROP
  // ─────────────────────────────────────────────────────────────────────────
  overlay: {
    enter: "motion-safe:animate-fade-in",
    base: "transition-opacity duration-200",
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // MODAL/DIALOG
  // ─────────────────────────────────────────────────────────────────────────
  modal: {
    overlay: "motion-safe:animate-fade-in",
    content: "motion-safe:animate-modal-in",
    base: "transition-all duration-200",
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // DROPDOWN/MENU
  // ─────────────────────────────────────────────────────────────────────────
  dropdown: {
    enter: "motion-safe:animate-dropdown-in",
    base: "transition-all duration-150",
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // TOOLTIP
  // ─────────────────────────────────────────────────────────────────────────
  tooltip: {
    enter: "motion-safe:animate-tooltip-in",
    base: "transition-opacity duration-100",
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // TOAST/NOTIFICATION
  // ─────────────────────────────────────────────────────────────────────────
  toast: {
    enter: "motion-safe:animate-toast-in",
    base: "transition-all duration-300",
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // DRAWER/PANEL
  // ─────────────────────────────────────────────────────────────────────────
  drawer: {
    left: "motion-safe:animate-drawer-left-in",
    right: "motion-safe:animate-drawer-right-in",
    overlay: "motion-safe:animate-fade-in",
    base: "transition-transform duration-300",
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // CARD
  // ─────────────────────────────────────────────────────────────────────────
  card: {
    enter: "motion-safe:animate-fade-in motion-safe:animate-slide-up",
    hover: "transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
    base: "transition-shadow duration-200",
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // BUTTON
  // ─────────────────────────────────────────────────────────────────────────
  button: {
    base: "transition-all duration-200",
    active: "motion-safe:active:scale-[0.98]",
    hover: "hover:shadow-lg",
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // LIST ITEM / TABLE ROW
  // ─────────────────────────────────────────────────────────────────────────
  listItem: {
    enter: "motion-safe:animate-fade-in",
    hover: "transition-colors duration-150 hover:bg-slate-800/50",
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // LOADING STATES
  // ─────────────────────────────────────────────────────────────────────────
  loading: {
    skeleton: "motion-safe:animate-pulse",
    shimmer: "motion-safe:animate-shimmer bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-[length:200%_100%]",
    spinner: "motion-safe:animate-spin",
    dots: "motion-safe:animate-pulse-fast",
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // STATUS INDICATORS
  // ─────────────────────────────────────────────────────────────────────────
  status: {
    live: "motion-safe:animate-pulse-slow",
    alert: "motion-safe:animate-pulse-fast",
    success: "motion-safe:animate-bounce-subtle",
    error: "motion-safe:animate-shake",
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// STAGGER ANIMATION HELPER
// For animating lists of items with delay between each
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate stagger delay style for list items
 * @param index - Item index in the list
 * @param baseDelay - Base delay in ms (default: 50ms)
 * @param maxDelay - Maximum total delay in ms (default: 500ms)
 * @returns Style object with animation-delay
 * 
 * @example
 * {items.map((item, i) => (
 *   <div 
 *     className="motion-safe:animate-fade-in motion-safe:animate-slide-up opacity-0"
 *     style={staggerDelay(i)}
 *   >
 *     {item}
 *   </div>
 * ))}
 */
export function staggerDelay(
  index: number, 
  baseDelay: number = 50, 
  maxDelay: number = 500
): React.CSSProperties {
  const delay = Math.min(index * baseDelay, maxDelay);
  return {
    animationDelay: `${delay}ms`,
    animationFillMode: 'forwards',
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// REDUCED MOTION HOOK
// Check if user prefers reduced motion
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook to check if user prefers reduced motion
 * @returns true if user has enabled reduced motion in OS settings
 * 
 * @example
 * const prefersReducedMotion = usePrefersReducedMotion();
 * const animationClass = prefersReducedMotion ? '' : 'animate-fade-in';
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReducedMotion;
}

// Import React for the hook
import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// USAGE GUIDE
// ═══════════════════════════════════════════════════════════════════════════
/*

ANIMATION SYSTEM USAGE GUIDE
============================

1. BASIC USAGE - Single animation:
   <div className={animations.fadeIn}>Content</div>
   
2. PRESET USAGE - Component-specific:
   <div className={animationPresets.modal.content}>Modal</div>
   <div className={animationPresets.loading.skeleton}>Loading...</div>
   
3. TRANSITION USAGE - For hover/focus states:
   <button className={`${transitions.default} hover:bg-slate-700`}>Click</button>
   
4. STAGGER ANIMATION - For lists:
   {items.map((item, i) => (
     <div 
       className="motion-safe:animate-slide-up opacity-0"
       style={staggerDelay(i)}
     >
       {item}
     </div>
   ))}

5. COMBINING ANIMATIONS:
   <div className={`${animations.fadeIn} ${transitions.default}`}>
     Fades in, then has hover transitions
   </div>

BEST PRACTICES:
- Always use motion-safe: prefix (already included in animations object)
- Use transitions.default for most interactive elements
- Use attention animations (shake, bounce) very sparingly
- Continuous animations should have purpose (loading, live status)
- Test with reduced motion enabled in OS settings

ANIMATION TIMING GUIDELINES:
- Micro-interactions (hover, focus): 100-150ms
- Standard UI changes: 200ms
- Complex animations (modals, drawers): 300ms
- Never exceed 500ms for UI animations

*/
