import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-blue-600 text-white border-transparent",
  secondary: "bg-slate-700 text-slate-200 border-transparent",
  destructive: "bg-red-600/90 text-white border-transparent",
  outline: "border-slate-600 text-slate-300 bg-transparent",
  success: "bg-emerald-600/90 text-white border-transparent",
  warning: "bg-amber-500/90 text-slate-900 border-transparent",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
export type { BadgeProps };
