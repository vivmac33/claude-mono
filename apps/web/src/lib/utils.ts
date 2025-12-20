import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind CSS conflict resolution
 * Combines clsx for conditional classes with tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency with Indian locale
 */
export function formatCurrency(value: number, currency: string = "₹"): string {
  if (value === undefined || value === null) return `${currency}0.00`;
  return `${currency}${value.toLocaleString("en-IN", { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
}

/**
 * Format large numbers (lakhs, crores)
 */
export function formatIndianNumber(value: number): string {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `${(value / 100000).toFixed(2)} L`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} K`;
  }
  return value.toFixed(2);
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 2): string {
  if (value === undefined || value === null) return "0.00%";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Get color class based on value (positive/negative)
 */
export function getValueColor(value: number): string {
  if (value > 0) return "text-emerald-400";
  if (value < 0) return "text-red-400";
  return "text-slate-400";
}

/**
 * Get background color class based on value
 */
export function getValueBgColor(value: number): string {
  if (value > 0) return "bg-emerald-500/20";
  if (value < 0) return "bg-red-500/20";
  return "bg-slate-500/20";
}
