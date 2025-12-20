// ═══════════════════════════════════════════════════════════════════════════
// CARD SHELL
// Unified wrapper component for all Monomorph cards
// Provides consistent loading, error, empty states and header patterns
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import { cn } from "@/lib/utils";
import { Badge, BadgeProps } from "./badge";
import { Skeleton } from "./skeleton";
import { useTheme } from "@/components/ThemeProvider";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type CardSize = "mini" | "standard" | "large" | "full";
export type CardStatus = "idle" | "loading" | "success" | "error" | "empty";

export interface CardShellProps {
  /** Card title */
  title: string;
  /** Card description/subtitle */
  description?: string;
  /** Symbol being analyzed (e.g., "TCS", "RELIANCE") */
  symbol?: string;
  /** Date/time of data */
  asOf?: string;
  /** Badge to show next to title */
  badge?: {
    label: string;
    variant?: BadgeProps["variant"];
  };
  /** Card size variant */
  size?: CardSize;
  /** Current status */
  status?: CardStatus;
  /** Error message (when status is error) */
  error?: string | null;
  /** Empty state message */
  emptyMessage?: string;
  /** Right-aligned header content */
  headerRight?: React.ReactNode;
  /** Toolbar below header */
  toolbar?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Additional header actions */
  actions?: React.ReactNode;
  /** Card content */
  children?: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Category label */
  category?: string;
  /** Icon element */
  icon?: React.ReactNode;
  /** Make content scrollable */
  scrollable?: boolean;
  /** Compact mode (less padding) */
  compact?: boolean;
  /** onClick handler */
  onClick?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// SIZE CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

const sizeConfig: Record<CardSize, { 
  padding: string; 
  headerPadding: string;
  titleSize: string; 
  minHeight: string;
  skeletonLines: number;
}> = {
  mini: {
    padding: "p-3",
    headerPadding: "px-3 pt-3 pb-2",
    titleSize: "text-sm",
    minHeight: "min-h-[120px]",
    skeletonLines: 2,
  },
  standard: {
    padding: "p-4",
    headerPadding: "px-4 pt-4 pb-2",
    titleSize: "text-base",
    minHeight: "min-h-[200px]",
    skeletonLines: 4,
  },
  large: {
    padding: "p-5",
    headerPadding: "px-5 pt-5 pb-3",
    titleSize: "text-lg",
    minHeight: "min-h-[320px]",
    skeletonLines: 6,
  },
  full: {
    padding: "p-6",
    headerPadding: "px-6 pt-6 pb-4",
    titleSize: "text-xl",
    minHeight: "min-h-[400px]",
    skeletonLines: 8,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// LOADING SKELETON
// ═══════════════════════════════════════════════════════════════════════════

interface CardSkeletonProps {
  size: CardSize;
  lines?: number;
}

function CardSkeleton({ size, lines }: CardSkeletonProps) {
  const config = sizeConfig[size];
  const numLines = lines ?? config.skeletonLines;
  
  return (
    <div className="space-y-3">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-2 pt-2">
        {Array.from({ length: numLines }).map((_, i) => (
          <Skeleton 
            key={i} 
            className={cn(
              "h-3",
              i === 0 && "w-full",
              i === 1 && "w-4/5",
              i === 2 && "w-3/4",
              i > 2 && "w-2/3"
            )} 
          />
        ))}
      </div>
      
      {/* Chart placeholder for larger cards */}
      {(size === "standard" || size === "large" || size === "full") && (
        <Skeleton className={cn(
          "w-full rounded-lg",
          size === "standard" && "h-32",
          size === "large" && "h-48",
          size === "full" && "h-64"
        )} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ERROR STATE
// ═══════════════════════════════════════════════════════════════════════════

interface CardErrorProps {
  error: string;
  onRetry?: () => void;
  isDark?: boolean;
}

function CardError({ error, onRetry, isDark = true }: CardErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isDark ? 'bg-red-500/10' : 'bg-red-100'}`}>
        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className={`text-sm mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`text-xs underline ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-800'}`}
        >
          Try again
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════════════════════════════════

interface CardEmptyProps {
  message?: string;
  isDark?: boolean;
}

function CardEmpty({ message = "No data available", isDark = true }: CardEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <svg className={`w-6 h-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>{message}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CARD HEADER
// ═══════════════════════════════════════════════════════════════════════════

interface CardHeaderInternalProps {
  title: string;
  description?: string;
  symbol?: string;
  asOf?: string;
  badge?: CardShellProps["badge"];
  category?: string;
  icon?: React.ReactNode;
  headerRight?: React.ReactNode;
  actions?: React.ReactNode;
  size: CardSize;
  compact?: boolean;
  isDark?: boolean;
}

function CardHeaderInternal({
  title,
  description,
  symbol,
  asOf,
  badge,
  category,
  icon,
  headerRight,
  actions,
  size,
  compact,
  isDark = true,
}: CardHeaderInternalProps) {
  const config = sizeConfig[size];
  
  // Build description parts
  const descParts: string[] = [];
  if (symbol) descParts.push(symbol);
  if (asOf) descParts.push(`As of ${asOf}`);
  if (description && !symbol && !asOf) descParts.push(description);
  
  const finalDescription = descParts.length > 0 
    ? descParts.join(" • ") 
    : description;

  return (
    <div className={cn(
      "flex justify-between items-start gap-4",
      compact ? "pb-2" : config.headerPadding
    )}>
      <div className="flex-1 min-w-0">
        {/* Category label */}
        {category && (
          <div className={`text-[9px] uppercase tracking-widest mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            {category}
          </div>
        )}
        
        {/* Title row */}
        <div className="flex items-center gap-2 flex-wrap">
          {icon && (
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{icon}</span>
          )}
          <h3 className={cn(
            "font-semibold leading-tight",
            isDark ? 'text-slate-100' : 'text-slate-900',
            config.titleSize
          )}>
            {title}
          </h3>
          {badge && (
            <Badge variant={badge.variant || "default"}>
              {badge.label}
            </Badge>
          )}
        </div>
        
        {/* Description */}
        {finalDescription && (
          <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {finalDescription}
          </p>
        )}
      </div>
      
      {/* Right side content */}
      {(headerRight || actions) && (
        <div className="flex items-center gap-2 shrink-0">
          {headerRight}
          {actions}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN CARD SHELL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function CardShell({
  title,
  description,
  symbol,
  asOf,
  badge,
  size = "standard",
  status = "success",
  error,
  emptyMessage,
  headerRight,
  toolbar,
  footer,
  actions,
  children,
  className,
  category,
  icon,
  scrollable = false,
  compact = false,
  onClick,
}: CardShellProps) {
  const config = sizeConfig[size];
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Derive status from props if not explicitly set
  const derivedStatus: CardStatus = error 
    ? "error" 
    : status;

  return (
    <div
      className={cn(
        "rounded-xl border shadow-lg backdrop-blur-sm flex flex-col",
        isDark 
          ? "border-slate-700/50 bg-slate-900/80" 
          : "border-slate-200 bg-white",
        config.minHeight,
        onClick && "cursor-pointer hover:border-slate-600/50 transition-colors",
        className
      )}
      onClick={onClick}
    >
      {/* Header */}
      <CardHeaderInternal
        title={title}
        description={description}
        symbol={symbol}
        asOf={asOf}
        badge={badge}
        category={category}
        icon={icon}
        headerRight={headerRight}
        actions={actions}
        size={size}
        compact={compact}
        isDark={isDark}
      />
      
      {/* Toolbar */}
      {toolbar && (
        <div className={cn(
          "border-b",
          isDark ? "border-slate-800/50" : "border-slate-200",
          compact ? "px-3 pb-2" : "px-4 pb-3"
        )}>
          {toolbar}
        </div>
      )}
      
      {/* Content */}
      <div className={cn(
        "flex-1",
        compact ? "p-3 pt-0" : config.padding,
        !compact && "pt-0",
        scrollable && "overflow-auto"
      )}>
        {derivedStatus === "loading" && <CardSkeleton size={size} />}
        {derivedStatus === "error" && <CardError error={error || "An error occurred"} isDark={isDark} />}
        {derivedStatus === "empty" && <CardEmpty message={emptyMessage} isDark={isDark} />}
        {derivedStatus === "success" && children}
        {derivedStatus === "idle" && children}
      </div>
      
      {/* Footer */}
      {footer && derivedStatus === "success" && (
        <div className={cn(
          "border-t",
          isDark ? "border-slate-800/50" : "border-slate-200",
          compact ? "p-3" : "p-4"
        )}>
          {footer}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CARD CONTENT SECTIONS
// ═══════════════════════════════════════════════════════════════════════════

interface CardSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function CardSection({ title, children, className }: CardSectionProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {title && (
        <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CARD METRIC DISPLAY
// ═══════════════════════════════════════════════════════════════════════════

interface CardMetricProps {
  label: string;
  value: React.ReactNode;
  subValue?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CardMetric({
  label,
  value,
  subValue,
  trend,
  size = "md",
  className,
}: CardMetricProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const sizeClasses = {
    sm: { container: "px-2 py-1.5", value: "text-sm", label: "text-[9px]" },
    md: { container: "px-3 py-2", value: "text-base", label: "text-[10px]" },
    lg: { container: "px-4 py-3", value: "text-lg", label: "text-[10px]" },
  };
  
  const trendColors = {
    up: "text-emerald-400",
    down: "text-red-400",
    neutral: isDark ? "text-slate-400" : "text-slate-600",
  };

  return (
    <div className={cn(
      "rounded-lg border flex flex-col",
      isDark 
        ? "border-slate-700/50 bg-slate-800/30" 
        : "border-slate-200 bg-slate-50",
      sizeClasses[size].container,
      className
    )}>
      <div className={cn(
        "uppercase tracking-wider mb-0.5",
        isDark ? "text-slate-500" : "text-slate-500",
        sizeClasses[size].label
      )}>
        {label}
      </div>
      <div className={cn(
        "font-semibold",
        isDark ? "text-slate-100" : "text-slate-900",
        sizeClasses[size].value
      )}>
        {value}
      </div>
      {subValue && (
        <div className={cn(
          "text-[10px] mt-0.5",
          trend ? trendColors[trend] : (isDark ? "text-slate-500" : "text-slate-600")
        )}>
          {subValue}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CARD METRIC GRID
// ═══════════════════════════════════════════════════════════════════════════

interface CardMetricGridProps {
  metrics: CardMetricProps[];
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function CardMetricGrid({ metrics, columns = 4, className }: CardMetricGridProps) {
  const colClasses = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };
  
  return (
    <div className={cn("grid gap-2", colClasses[columns], className)}>
      {metrics.map((metric, i) => (
        <CardMetric key={i} {...metric} size="sm" />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CARD STATUS INDICATOR
// ═══════════════════════════════════════════════════════════════════════════

type StatusType = "bullish" | "bearish" | "neutral" | "strong" | "weak" | "positive" | "negative" | "warning";

interface CardStatusIndicatorProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const statusConfig: Record<StatusType, { 
  bg: string; 
  text: string; 
  icon: string;
}> = {
  bullish: { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: "↑" },
  bearish: { bg: "bg-red-500/20", text: "text-red-400", icon: "↓" },
  neutral: { bg: "bg-slate-500/20", text: "text-slate-400", icon: "→" },
  strong: { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: "●" },
  weak: { bg: "bg-red-500/20", text: "text-red-400", icon: "○" },
  positive: { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: "+" },
  negative: { bg: "bg-red-500/20", text: "text-red-400", icon: "−" },
  warning: { bg: "bg-amber-500/20", text: "text-amber-400", icon: "!" },
};

export function CardStatusIndicator({ 
  status, 
  label, 
  showIcon = true,
  size = "md" 
}: CardStatusIndicatorProps) {
  const config = statusConfig[status];
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full font-medium",
      config.bg,
      config.text,
      sizeClasses[size]
    )}>
      {showIcon && <span>{config.icon}</span>}
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default CardShell;
