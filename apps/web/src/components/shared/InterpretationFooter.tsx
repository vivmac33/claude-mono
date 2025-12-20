import React from "react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface InterpretationFooterProps {
  children: React.ReactNode;
  variant?: "info" | "warning" | "success" | "neutral";
  className?: string;
}

export function InterpretationFooter({
  children,
  variant = "neutral",
  className,
}: InterpretationFooterProps) {
  const variantStyles = {
    info: "border-blue-800/50 bg-blue-950/20",
    warning: "border-amber-800/50 bg-amber-950/20",
    success: "border-emerald-800/50 bg-emerald-950/20",
    neutral: "border-slate-700/50 bg-slate-800/20",
  };

  const iconColors = {
    info: "text-blue-400",
    warning: "text-amber-400",
    success: "text-emerald-400",
    neutral: "text-slate-400",
  };

  return (
    <div
      className={cn(
        "mt-3 pt-3 border-t text-[11px] leading-relaxed text-slate-400 rounded-lg p-2",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex gap-2">
        <svg
          className={cn("w-3.5 h-3.5 mt-0.5 flex-shrink-0", iconColors[variant])}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>{children}</div>
      </div>
    </div>
  );
}

interface SignalBoxProps {
  signal: "bullish" | "bearish" | "neutral" | "caution";
  title: string;
  description?: string;
  className?: string;
}

export function SignalBox({ signal, title, description, className }: SignalBoxProps) {
  const signalStyles = {
    bullish: {
      bg: "bg-emerald-950/30 border-emerald-700/50",
      icon: "text-emerald-400",
      text: "text-emerald-300",
    },
    bearish: {
      bg: "bg-red-950/30 border-red-700/50",
      icon: "text-red-400",
      text: "text-red-300",
    },
    neutral: {
      bg: "bg-slate-800/30 border-slate-700/50",
      icon: "text-slate-400",
      text: "text-slate-300",
    },
    caution: {
      bg: "bg-amber-950/30 border-amber-700/50",
      icon: "text-amber-400",
      text: "text-amber-300",
    },
  };

  const style = signalStyles[signal];

  return (
    <div className={cn("rounded-lg border p-2", style.bg, className)}>
      <div className={cn("text-xs font-semibold flex items-center gap-1.5", style.text)}>
        {signal === "bullish" && (
          <svg className={cn("w-3.5 h-3.5", style.icon)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        )}
        {signal === "bearish" && (
          <svg className={cn("w-3.5 h-3.5", style.icon)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
        {signal === "neutral" && (
          <svg className={cn("w-3.5 h-3.5", style.icon)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        )}
        {signal === "caution" && (
          <svg className={cn("w-3.5 h-3.5", style.icon)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
        {title}
      </div>
      {description && (
        <div className="text-[10px] text-slate-400 mt-1">{description}</div>
      )}
    </div>
  );
}
