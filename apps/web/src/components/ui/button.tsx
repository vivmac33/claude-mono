import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════
// BUTTON VARIANTS
// Using class-variance-authority for type-safe variant management
// ═══════════════════════════════════════════════════════════════════════════

const buttonVariants = cva(
  // Base styles applied to all buttons
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-lg font-medium",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
    "disabled:pointer-events-none disabled:opacity-50",
    "motion-safe:active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        // Primary - Main CTA (indigo)
        primary: [
          "bg-indigo-600 text-white",
          "hover:bg-indigo-500",
          "focus-visible:ring-indigo-500",
          "shadow-lg shadow-indigo-500/20",
        ],
        
        // Secondary - Less prominent action (slate)
        secondary: [
          "bg-slate-700 text-slate-100",
          "hover:bg-slate-600",
          "focus-visible:ring-slate-500",
          "border border-slate-600",
        ],
        
        // Ghost - Minimal, for toolbars
        ghost: [
          "bg-transparent text-slate-300",
          "hover:bg-slate-800 hover:text-white",
          "focus-visible:ring-slate-500",
        ],
        
        // Outline - Bordered button
        outline: [
          "bg-transparent text-slate-300",
          "border border-slate-600",
          "hover:bg-slate-800 hover:text-white hover:border-slate-500",
          "focus-visible:ring-slate-500",
        ],
        
        // Danger - Destructive actions (red)
        danger: [
          "bg-red-600 text-white",
          "hover:bg-red-500",
          "focus-visible:ring-red-500",
          "shadow-lg shadow-red-500/20",
        ],
        
        // Success - Positive actions (emerald)
        success: [
          "bg-emerald-600 text-white",
          "hover:bg-emerald-500",
          "focus-visible:ring-emerald-500",
          "shadow-lg shadow-emerald-500/20",
        ],
        
        // Warning - Caution actions (amber)
        warning: [
          "bg-amber-500 text-slate-900",
          "hover:bg-amber-400",
          "focus-visible:ring-amber-500",
          "shadow-lg shadow-amber-500/20",
        ],
        
        // Teal - Secondary accent (for workflow actions)
        teal: [
          "bg-teal-600 text-white",
          "hover:bg-teal-500",
          "focus-visible:ring-teal-500",
          "shadow-lg shadow-teal-500/20",
        ],
        
        // Link - Text-only button
        link: [
          "bg-transparent text-indigo-400",
          "hover:text-indigo-300 hover:underline",
          "focus-visible:ring-indigo-500",
          "p-0 h-auto",
        ],
      },
      
      size: {
        xs: "h-7 px-2 text-xs",
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-5 text-sm",
        xl: "h-12 px-6 text-base",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-7 w-7 p-0",
        "icon-lg": "h-11 w-11 p-0",
      },
      
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as a different element (uses Radix Slot) */
  asChild?: boolean;
  /** Show loading spinner */
  isLoading?: boolean;
  /** Icon to show on the left */
  leftIcon?: React.ReactNode;
  /** Icon to show on the right */
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner className="h-4 w-4" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

// ═══════════════════════════════════════════════════════════════════════════
// LOADING SPINNER
// ═══════════════════════════════════════════════════════════════════════════

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("motion-safe:animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BUTTON GROUP
// ═══════════════════════════════════════════════════════════════════════════

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Attach buttons together */
  attached?: boolean;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, attached = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex",
          attached && [
            "[&>button]:rounded-none",
            "[&>button:first-child]:rounded-l-lg",
            "[&>button:last-child]:rounded-r-lg",
            "[&>button:not(:last-child)]:border-r-0",
          ],
          !attached && "gap-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";

// ═══════════════════════════════════════════════════════════════════════════
// ICON BUTTON (Convenience wrapper)
// ═══════════════════════════════════════════════════════════════════════════

interface IconButtonProps extends Omit<ButtonProps, "children"> {
  /** Accessible label for the button */
  "aria-label": string;
  /** The icon to display */
  icon: React.ReactNode;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = "icon", variant = "ghost", ...props }, ref) => {
    return (
      <Button ref={ref} size={size} variant={variant} {...props}>
        {icon}
      </Button>
    );
  }
);
IconButton.displayName = "IconButton";

export { Button, ButtonGroup, IconButton, buttonVariants };
