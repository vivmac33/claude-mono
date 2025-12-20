// ═══════════════════════════════════════════════════════════════════════════
// STATUS BADGES
// Enhanced badge system for financial data status indicators
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type SignalType = 
  | "bullish" 
  | "bearish" 
  | "neutral"
  | "strong-buy"
  | "buy"
  | "hold"
  | "sell"
  | "strong-sell";

export type HealthType = 
  | "excellent" 
  | "good" 
  | "fair" 
  | "poor" 
  | "critical";

export type TrendType = 
  | "up" 
  | "down" 
  | "flat" 
  | "volatile";

export type RiskType = 
  | "low" 
  | "medium" 
  | "high" 
  | "extreme";

export type ValuationType = 
  | "undervalued" 
  | "fair-value" 
  | "overvalued"
  | "deep-value"
  | "expensive";

// ═══════════════════════════════════════════════════════════════════════════
// SIGNAL BADGE (Buy/Sell/Hold)
// ═══════════════════════════════════════════════════════════════════════════

interface SignalBadgeProps {
  signal: SignalType;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const signalConfig: Record<SignalType, {
  label: string;
  bg: string;
  text: string;
  icon: string;
}> = {
  "strong-buy": { label: "Strong Buy", bg: "bg-emerald-600", text: "text-white", icon: "▲▲" },
  "buy": { label: "Buy", bg: "bg-emerald-500/80", text: "text-white", icon: "▲" },
  "bullish": { label: "Bullish", bg: "bg-emerald-500/60", text: "text-emerald-100", icon: "↑" },
  "hold": { label: "Hold", bg: "bg-slate-600", text: "text-slate-100", icon: "●" },
  "neutral": { label: "Neutral", bg: "bg-slate-500/60", text: "text-slate-200", icon: "→" },
  "bearish": { label: "Bearish", bg: "bg-red-500/60", text: "text-red-100", icon: "↓" },
  "sell": { label: "Sell", bg: "bg-red-500/80", text: "text-white", icon: "▼" },
  "strong-sell": { label: "Strong Sell", bg: "bg-red-600", text: "text-white", icon: "▼▼" },
};

const signalSizes = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

export function SignalBadge({ signal, showIcon = true, size = "md", className }: SignalBadgeProps) {
  const config = signalConfig[signal];
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full font-semibold",
      config.bg,
      config.text,
      signalSizes[size],
      className
    )}>
      {showIcon && <span className="text-[0.8em]">{config.icon}</span>}
      {config.label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HEALTH BADGE (Financial health indicators)
// ═══════════════════════════════════════════════════════════════════════════

interface HealthBadgeProps {
  health: HealthType;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const healthConfig: Record<HealthType, {
  label: string;
  bg: string;
  text: string;
  icon: string;
}> = {
  excellent: { label: "Excellent", bg: "bg-emerald-500/20", text: "text-emerald-400", icon: "★" },
  good: { label: "Good", bg: "bg-teal-500/20", text: "text-teal-400", icon: "●" },
  fair: { label: "Fair", bg: "bg-amber-500/20", text: "text-amber-400", icon: "◐" },
  poor: { label: "Poor", bg: "bg-orange-500/20", text: "text-orange-400", icon: "○" },
  critical: { label: "Critical", bg: "bg-red-500/20", text: "text-red-400", icon: "✕" },
};

export function HealthBadge({ health, showIcon = true, size = "md", className }: HealthBadgeProps) {
  const config = healthConfig[health];
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full font-medium",
      config.bg,
      config.text,
      signalSizes[size],
      className
    )}>
      {showIcon && <span>{config.icon}</span>}
      {config.label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TREND BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface TrendBadgeProps {
  trend: TrendType;
  value?: string | number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const trendConfig: Record<TrendType, {
  label: string;
  bg: string;
  text: string;
  icon: string;
}> = {
  up: { label: "Up", bg: "bg-emerald-500/20", text: "text-emerald-400", icon: "↑" },
  down: { label: "Down", bg: "bg-red-500/20", text: "text-red-400", icon: "↓" },
  flat: { label: "Flat", bg: "bg-slate-500/20", text: "text-slate-400", icon: "→" },
  volatile: { label: "Volatile", bg: "bg-amber-500/20", text: "text-amber-400", icon: "↕" },
};

export function TrendBadge({ trend, value, showIcon = true, size = "md", className }: TrendBadgeProps) {
  const config = trendConfig[trend];
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full font-medium",
      config.bg,
      config.text,
      signalSizes[size],
      className
    )}>
      {showIcon && <span>{config.icon}</span>}
      {value !== undefined ? value : config.label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RISK BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface RiskBadgeProps {
  risk: RiskType;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const riskConfig: Record<RiskType, {
  label: string;
  bg: string;
  text: string;
  icon: string;
}> = {
  low: { label: "Low Risk", bg: "bg-emerald-500/20", text: "text-emerald-400", icon: "◇" },
  medium: { label: "Medium Risk", bg: "bg-amber-500/20", text: "text-amber-400", icon: "◆" },
  high: { label: "High Risk", bg: "bg-orange-500/20", text: "text-orange-400", icon: "⬥" },
  extreme: { label: "Extreme Risk", bg: "bg-red-500/20", text: "text-red-400", icon: "⬧" },
};

export function RiskBadge({ risk, showIcon = true, size = "md", className }: RiskBadgeProps) {
  const config = riskConfig[risk];
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full font-medium",
      config.bg,
      config.text,
      signalSizes[size],
      className
    )}>
      {showIcon && <span>{config.icon}</span>}
      {config.label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VALUATION BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface ValuationBadgeProps {
  valuation: ValuationType;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const valuationConfig: Record<ValuationType, {
  label: string;
  bg: string;
  text: string;
  icon: string;
}> = {
  "deep-value": { label: "Deep Value", bg: "bg-emerald-600", text: "text-white", icon: "$$" },
  "undervalued": { label: "Undervalued", bg: "bg-emerald-500/60", text: "text-emerald-100", icon: "$↓" },
  "fair-value": { label: "Fair Value", bg: "bg-slate-500/60", text: "text-slate-200", icon: "$=" },
  "overvalued": { label: "Overvalued", bg: "bg-red-500/60", text: "text-red-100", icon: "$↑" },
  "expensive": { label: "Expensive", bg: "bg-red-600", text: "text-white", icon: "$$$" },
};

export function ValuationBadge({ valuation, showIcon = true, size = "md", className }: ValuationBadgeProps) {
  const config = valuationConfig[valuation];
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full font-medium",
      config.bg,
      config.text,
      signalSizes[size],
      className
    )}>
      {showIcon && <span className="font-mono text-[0.8em]">{config.icon}</span>}
      {config.label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SCORE BADGE (0-100 scale)
// ═══════════════════════════════════════════════════════════════════════════

interface ScoreBadgeProps {
  score: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ScoreBadge({ score, max = 100, showLabel = false, size = "md", className }: ScoreBadgeProps) {
  const percentage = (score / max) * 100;
  
  let config: { bg: string; text: string };
  if (percentage >= 80) {
    config = { bg: "bg-emerald-500/20", text: "text-emerald-400" };
  } else if (percentage >= 60) {
    config = { bg: "bg-teal-500/20", text: "text-teal-400" };
  } else if (percentage >= 40) {
    config = { bg: "bg-amber-500/20", text: "text-amber-400" };
  } else if (percentage >= 20) {
    config = { bg: "bg-orange-500/20", text: "text-orange-400" };
  } else {
    config = { bg: "bg-red-500/20", text: "text-red-400" };
  }
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full font-bold",
      config.bg,
      config.text,
      signalSizes[size],
      className
    )}>
      {score}{max !== 100 && `/${max}`}
      {showLabel && <span className="font-normal opacity-70">pts</span>}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CHANGE BADGE (Percentage change with direction)
// ═══════════════════════════════════════════════════════════════════════════

interface ChangeBadgeProps {
  value: number;
  format?: "percent" | "currency" | "number";
  prefix?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ChangeBadge({ value, format = "percent", prefix = "", size = "md", className }: ChangeBadgeProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  const config = isPositive 
    ? { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: "↑" }
    : isNeutral
    ? { bg: "bg-slate-500/20", text: "text-slate-400", icon: "→" }
    : { bg: "bg-red-500/20", text: "text-red-400", icon: "↓" };
  
  let displayValue: string;
  if (format === "percent") {
    displayValue = `${isPositive ? "+" : ""}${value.toFixed(2)}%`;
  } else if (format === "currency") {
    displayValue = `${isPositive ? "+" : ""}${prefix}${Math.abs(value).toLocaleString()}`;
  } else {
    displayValue = `${isPositive ? "+" : ""}${value.toLocaleString()}`;
  }
  
  return (
    <span className={cn(
      "inline-flex items-center gap-0.5 rounded-full font-semibold",
      config.bg,
      config.text,
      signalSizes[size],
      className
    )}>
      <span className="text-[0.9em]">{config.icon}</span>
      {displayValue}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY BADGE (Colored category labels)
// ═══════════════════════════════════════════════════════════════════════════

export type CategoryType = 
  | "value" 
  | "growth" 
  | "risk" 
  | "cashflow" 
  | "income"
  | "macro"
  | "technical"
  | "portfolio"
  | "overview"
  | "mini";

interface CategoryBadgeProps {
  category: CategoryType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const categoryConfig: Record<CategoryType, {
  label: string;
  bg: string;
  text: string;
}> = {
  value: { label: "Value", bg: "bg-indigo-500/20", text: "text-indigo-400" },
  growth: { label: "Growth", bg: "bg-teal-500/20", text: "text-teal-400" },
  risk: { label: "Risk", bg: "bg-red-500/20", text: "text-red-400" },
  cashflow: { label: "Cash Flow", bg: "bg-emerald-500/20", text: "text-emerald-400" },
  income: { label: "Income", bg: "bg-amber-500/20", text: "text-amber-400" },
  macro: { label: "Macro", bg: "bg-purple-500/20", text: "text-purple-400" },
  technical: { label: "Technical", bg: "bg-blue-500/20", text: "text-blue-400" },
  portfolio: { label: "Portfolio", bg: "bg-cyan-500/20", text: "text-cyan-400" },
  overview: { label: "Overview", bg: "bg-slate-500/20", text: "text-slate-400" },
  mini: { label: "Mini", bg: "bg-slate-600/30", text: "text-slate-300" },
};

export function CategoryBadge({ category, size = "sm", className }: CategoryBadgeProps) {
  const config = categoryConfig[category];
  
  return (
    <span className={cn(
      "inline-flex items-center rounded font-medium uppercase tracking-wider",
      config.bg,
      config.text,
      signalSizes[size],
      className
    )}>
      {config.label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LIVE/STATUS INDICATOR
// ═══════════════════════════════════════════════════════════════════════════

interface LiveIndicatorProps {
  isLive?: boolean;
  label?: string;
  className?: string;
}

export function LiveIndicator({ isLive = true, label = "Live", className }: LiveIndicatorProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-medium",
      isLive ? "text-emerald-400" : "text-slate-500",
      className
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        isLive ? "bg-emerald-400 motion-safe:animate-pulse" : "bg-slate-500"
      )} />
      {label}
    </span>
  );
}
