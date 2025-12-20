import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Use pulse animation instead of shimmer (shimmer is now default) */
  pulse?: boolean;
}

function Skeleton({
  className,
  pulse = false,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md",
        pulse 
          ? "bg-slate-700/50 motion-safe:animate-pulse"
          : "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-[length:200%_100%] motion-safe:animate-shimmer",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
export type { SkeletonProps };
