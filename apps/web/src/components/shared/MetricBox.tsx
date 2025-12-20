import React, { useState } from "react";
import { ChangeBadge } from "@/components/ui/status-badges";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface MetricBoxProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  change?: number; // Percentage change - will show ChangeBadge
  size?: "sm" | "md" | "lg";
  className?: string;
  copyable?: boolean; // Enable copy on click
}

export function MetricBox({
  label,
  value,
  subValue,
  trend,
  change,
  size = "md",
  className,
  copyable = true,
}: MetricBoxProps) {
  const [copied, setCopied] = useState(false);

  const sizeClasses = {
    sm: "px-2 py-1.5",
    md: "px-3 py-2",
    lg: "px-4 py-3",
  };

  const valueSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const trendColors = {
    up: "text-emerald-400",
    down: "text-red-400",
    neutral: "text-slate-400",
  };

  const handleCopy = async () => {
    if (!copyable) return;
    
    const textToCopy = String(value);
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      onClick={handleCopy}
      className={cn(
        "rounded-lg border border-slate-700/50 bg-slate-800/30 flex flex-col relative group",
        copyable && "cursor-pointer hover:border-slate-600 hover:bg-slate-800/50 transition-all",
        sizeClasses[size],
        className
      )}
      title={copyable ? `Click to copy: ${value}` : undefined}
    >
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5 flex items-center justify-between">
        <span>{label}</span>
        {copyable && (
          <span className={cn(
            "transition-all duration-200",
            copied ? "text-emerald-400" : "text-slate-600 opacity-0 group-hover:opacity-100"
          )}>
            {copied ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </span>
        )}
      </div>
      <div className={cn("font-semibold text-slate-100 flex items-center gap-1.5", valueSizes[size])}>
        {value}
        {change !== undefined && (
          <ChangeBadge value={change} size="sm" />
        )}
      </div>
      {subValue && (
        <div className={cn("text-[10px] mt-0.5", trend ? trendColors[trend] : "text-slate-500")}>
          {subValue}
        </div>
      )}
      
      {/* Copy feedback toast */}
      {copied && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-emerald-500 text-white text-[10px] rounded shadow-lg whitespace-nowrap motion-safe:animate-fade-in">
          Copied!
        </div>
      )}
    </div>
  );
}

interface MetricStripProps {
  metrics: MetricBoxProps[];
  columns?: number;
  className?: string;
}

export function MetricStrip({ metrics, columns = 4, className }: MetricStripProps) {
  return (
    <div
      className={cn(
        "grid gap-2",
        className
      )}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {metrics.map((metric, i) => (
        <MetricBox key={i} {...metric} size="sm" />
      ))}
    </div>
  );
}
