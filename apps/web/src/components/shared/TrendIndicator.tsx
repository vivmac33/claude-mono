import React from "react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface TrendIndicatorProps {
  value: number;
  format?: "percent" | "number" | "currency";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function TrendIndicator({
  value,
  format = "percent",
  size = "md",
  showIcon = true,
  className,
}: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const formatValue = () => {
    const absValue = Math.abs(value);
    switch (format) {
      case "percent":
        return `${absValue.toFixed(2)}%`;
      case "currency":
        return `₹${absValue.toFixed(2)}`;
      default:
        return absValue.toFixed(2);
    }
  };

  const sizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  const colorClass = isNeutral
    ? "text-slate-400"
    : isPositive
    ? "text-emerald-400"
    : "text-red-400";

  return (
    <span className={cn("inline-flex items-center gap-0.5 font-medium", colorClass, sizes[size], className)}>
      {showIcon && !isNeutral && (
        <svg
          className={cn("w-3 h-3", !isPositive && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      )}
      {isPositive && "+"}
      {formatValue()}
    </span>
  );
}

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showArea?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  width = 80,
  height = 24,
  color,
  showArea = false,
  className,
}: SparklineProps) {
  if (!data.length) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  // Determine color based on trend
  const trendColor = color || (data[data.length - 1] >= data[0] ? "#10b981" : "#ef4444");

  return (
    <svg width={width} height={height} className={className}>
      {showArea && (
        <path d={areaD} fill={trendColor} fillOpacity={0.1} />
      )}
      <path
        d={pathD}
        fill="none"
        stroke={trendColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
