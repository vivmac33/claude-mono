import React from "react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface ScoreGaugeProps {
  value: number;
  max?: number;
  label?: string;
  size?: "sm" | "md" | "lg" | number;
  showValue?: boolean;
  colorScale?: "default" | "risk" | "quality";
  className?: string;
}

function getColorForValue(value: number, max: number, colorScale: string): string {
  const pct = value / max;
  
  if (colorScale === "risk") {
    // Inverse: low is good (green), high is bad (red)
    if (pct <= 0.3) return "text-emerald-400";
    if (pct <= 0.6) return "text-amber-400";
    return "text-red-400";
  }
  
  // Default/quality: high is good
  if (pct >= 0.7) return "text-emerald-400";
  if (pct >= 0.4) return "text-amber-400";
  return "text-red-400";
}

function getBarColorForValue(value: number, max: number, colorScale: string): string {
  const pct = value / max;
  
  if (colorScale === "risk") {
    if (pct <= 0.3) return "bg-emerald-500";
    if (pct <= 0.6) return "bg-amber-500";
    return "bg-red-500";
  }
  
  if (pct >= 0.7) return "bg-emerald-500";
  if (pct >= 0.4) return "bg-amber-500";
  return "bg-red-500";
}

export function ScoreGauge({
  value,
  max = 100,
  label,
  size = "md",
  showValue = true,
  colorScale = "default",
  className,
}: ScoreGaugeProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const textColor = getColorForValue(value, max, colorScale);
  const barColor = getBarColorForValue(value, max, colorScale);

  // Handle numeric size by treating it as pixel width for a radial gauge-like display
  if (typeof size === 'number') {
    return (
      <RadialGauge value={value} max={max} label={label} size={size} colorScale={colorScale} className={className} />
    );
  }

  const sizes = {
    sm: { height: "h-1.5", text: "text-sm", label: "text-[9px]" },
    md: { height: "h-2", text: "text-base", label: "text-[10px]" },
    lg: { height: "h-3", text: "text-lg", label: "text-xs" },
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-baseline mb-1">
          {label && (
            <span className={cn("uppercase tracking-wider text-slate-500", sizes[size].label)}>
              {label}
            </span>
          )}
          {showValue && (
            <span className={cn("font-bold", textColor, sizes[size].text)}>
              {Math.round(value)}/{max}
            </span>
          )}
        </div>
      )}
      <div className={cn("w-full rounded-full bg-slate-700/50 overflow-hidden", sizes[size].height)}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface RadialGaugeProps {
  value: number;
  max?: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  colorScale?: "default" | "risk" | "quality";
  className?: string;
}

export function RadialGauge({
  value,
  max = 100,
  label,
  size = 80,
  strokeWidth = 8,
  colorScale = "default",
  className,
}: RadialGaugeProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const textColor = getColorForValue(value, max, colorScale);
  
  const getStrokeColor = () => {
    const pct = value / max;
    if (colorScale === "risk") {
      if (pct <= 0.3) return "#10b981";
      if (pct <= 0.6) return "#f59e0b";
      return "#ef4444";
    }
    if (pct >= 0.7) return "#10b981";
    if (pct >= 0.4) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(51, 65, 85, 0.5)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold text-lg", textColor)}>{Math.round(value)}</span>
      </div>
      {label && (
        <span className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
          {label}
        </span>
      )}
    </div>
  );
}
