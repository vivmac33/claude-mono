import * as React from "react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

type ProgressVariant = "default" | "success" | "warning" | "danger" | "info";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: ProgressVariant;
  animated?: boolean;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  indicatorClassName?: string;
}

const variantColors: Record<ProgressVariant, string> = {
  default: "bg-blue-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-cyan-500",
};

const sizeClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value = 0, 
    max = 100, 
    variant = "default",
    animated = false,
    showLabel = false,
    size = "md",
    indicatorClassName, 
    ...props 
  }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div className={cn("relative", showLabel && "flex items-center gap-2")}>
        <div
          ref={ref}
          className={cn(
            "relative w-full overflow-hidden rounded-full bg-slate-700/50",
            sizeClasses[size],
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "h-full transition-all duration-300",
              variantColors[variant],
              animated && "motion-safe:animate-pulse",
              indicatorClassName
            )}
            style={{ width: `${percentage}%` }}
          />
          {animated && percentage < 100 && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent motion-safe:animate-shimmer bg-[length:200%_100%]"
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>
        {showLabel && (
          <span className="text-xs text-slate-400 min-w-[3ch] text-right">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
export type { ProgressProps, ProgressVariant };
