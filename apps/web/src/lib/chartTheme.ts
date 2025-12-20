// ═══════════════════════════════════════════════════════════════════════════
// CHART THEME
// Centralized theme configuration for Recharts & lightweight-charts
// Ensures consistent styling across all visualizations
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY IDENTITY SYSTEM
// Each category has a unique visual signature
// ═══════════════════════════════════════════════════════════════════════════

export type CategoryId = 
  | 'value' | 'growth' | 'risk' | 'cashflow' | 'income' 
  | 'macro' | 'technical' | 'portfolio' | 'screener' 
  | 'mini' | 'commodities' | 'derivatives' | 'mutual-funds' | 'overview';

export interface CategoryStyle {
  id: CategoryId;
  label: string;
  icon: string;
  gradient: string;           // Tailwind gradient classes
  gradientFrom: string;       // hex color
  gradientTo: string;         // hex color
  accent: string;             // Primary accent color (hex)
  accentLight: string;        // Lighter variant for fills
  headerBg: string;           // Card header background
  borderColor: string;        // Border accent
}

export const CATEGORY_STYLES: Record<CategoryId, CategoryStyle> = {
  value: {
    id: 'value',
    label: 'Value',
    icon: '💎',
    gradient: 'from-indigo-600 to-violet-600',
    gradientFrom: '#4f46e5',
    gradientTo: '#7c3aed',
    accent: '#6366f1',
    accentLight: '#a5b4fc',
    headerBg: 'bg-gradient-to-r from-indigo-500/10 to-violet-500/10',
    borderColor: 'border-indigo-500/30',
  },
  growth: {
    id: 'growth',
    label: 'Growth',
    icon: '📈',
    gradient: 'from-emerald-600 to-teal-600',
    gradientFrom: '#059669',
    gradientTo: '#0d9488',
    accent: '#10b981',
    accentLight: '#6ee7b7',
    headerBg: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10',
    borderColor: 'border-emerald-500/30',
  },
  risk: {
    id: 'risk',
    label: 'Risk',
    icon: '⚠️',
    gradient: 'from-red-600 to-orange-600',
    gradientFrom: '#dc2626',
    gradientTo: '#ea580c',
    accent: '#ef4444',
    accentLight: '#fca5a5',
    headerBg: 'bg-gradient-to-r from-red-500/10 to-orange-500/10',
    borderColor: 'border-red-500/30',
  },
  cashflow: {
    id: 'cashflow',
    label: 'Cashflow',
    icon: '💰',
    gradient: 'from-amber-600 to-yellow-600',
    gradientFrom: '#d97706',
    gradientTo: '#ca8a04',
    accent: '#f59e0b',
    accentLight: '#fcd34d',
    headerBg: 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10',
    borderColor: 'border-amber-500/30',
  },
  income: {
    id: 'income',
    label: 'Income',
    icon: '💵',
    gradient: 'from-lime-600 to-green-600',
    gradientFrom: '#65a30d',
    gradientTo: '#16a34a',
    accent: '#84cc16',
    accentLight: '#bef264',
    headerBg: 'bg-gradient-to-r from-lime-500/10 to-green-500/10',
    borderColor: 'border-lime-500/30',
  },
  macro: {
    id: 'macro',
    label: 'Macro',
    icon: '🌍',
    gradient: 'from-sky-600 to-blue-600',
    gradientFrom: '#0284c7',
    gradientTo: '#2563eb',
    accent: '#0ea5e9',
    accentLight: '#7dd3fc',
    headerBg: 'bg-gradient-to-r from-sky-500/10 to-blue-500/10',
    borderColor: 'border-sky-500/30',
  },
  technical: {
    id: 'technical',
    label: 'Technical',
    icon: '📊',
    gradient: 'from-cyan-600 to-teal-600',
    gradientFrom: '#0891b2',
    gradientTo: '#0d9488',
    accent: '#06b6d4',
    accentLight: '#67e8f9',
    headerBg: 'bg-gradient-to-r from-cyan-500/10 to-teal-500/10',
    borderColor: 'border-cyan-500/30',
  },
  portfolio: {
    id: 'portfolio',
    label: 'Portfolio',
    icon: '📁',
    gradient: 'from-purple-600 to-pink-600',
    gradientFrom: '#9333ea',
    gradientTo: '#db2777',
    accent: '#a855f7',
    accentLight: '#d8b4fe',
    headerBg: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/30',
  },
  screener: {
    id: 'screener',
    label: 'Screener',
    icon: '🔍',
    gradient: 'from-slate-600 to-zinc-600',
    gradientFrom: '#475569',
    gradientTo: '#52525b',
    accent: '#64748b',
    accentLight: '#cbd5e1',
    headerBg: 'bg-gradient-to-r from-slate-500/10 to-zinc-500/10',
    borderColor: 'border-slate-500/30',
  },
  mini: {
    id: 'mini',
    label: 'Quick Insights',
    icon: '⚡',
    gradient: 'from-fuchsia-600 to-purple-600',
    gradientFrom: '#c026d3',
    gradientTo: '#9333ea',
    accent: '#d946ef',
    accentLight: '#f0abfc',
    headerBg: 'bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10',
    borderColor: 'border-fuchsia-500/30',
  },
  commodities: {
    id: 'commodities',
    label: 'Commodities',
    icon: '🛢️',
    gradient: 'from-orange-600 to-amber-600',
    gradientFrom: '#ea580c',
    gradientTo: '#d97706',
    accent: '#f97316',
    accentLight: '#fdba74',
    headerBg: 'bg-gradient-to-r from-orange-500/10 to-amber-500/10',
    borderColor: 'border-orange-500/30',
  },
  derivatives: {
    id: 'derivatives',
    label: 'Derivatives',
    icon: '📉',
    gradient: 'from-rose-600 to-red-600',
    gradientFrom: '#e11d48',
    gradientTo: '#dc2626',
    accent: '#f43f5e',
    accentLight: '#fda4af',
    headerBg: 'bg-gradient-to-r from-rose-500/10 to-red-500/10',
    borderColor: 'border-rose-500/30',
  },
  'mutual-funds': {
    id: 'mutual-funds',
    label: 'Mutual Funds',
    icon: '🏦',
    gradient: 'from-blue-600 to-indigo-600',
    gradientFrom: '#2563eb',
    gradientTo: '#4f46e5',
    accent: '#3b82f6',
    accentLight: '#93c5fd',
    headerBg: 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10',
    borderColor: 'border-blue-500/30',
  },
  overview: {
    id: 'overview',
    label: 'Overview',
    icon: '👁️',
    gradient: 'from-teal-600 to-cyan-600',
    gradientFrom: '#0d9488',
    gradientTo: '#0891b2',
    accent: '#14b8a6',
    accentLight: '#5eead4',
    headerBg: 'bg-gradient-to-r from-teal-500/10 to-cyan-500/10',
    borderColor: 'border-teal-500/30',
  },
};

/** Get category style by ID */
export function getCategoryStyle(categoryId: string): CategoryStyle {
  return CATEGORY_STYLES[categoryId as CategoryId] || CATEGORY_STYLES.overview;
}

// ═══════════════════════════════════════════════════════════════════════════
// COLOR PALETTES
// ═══════════════════════════════════════════════════════════════════════════

export const chartColors = {
  // Primary chart colors (for data series)
  primary: {
    indigo: "#6366f1",
    teal: "#14b8a6",
    blue: "#3b82f6",
    purple: "#8b5cf6",
    cyan: "#06b6d4",
    pink: "#ec4899",
  },
  
  // Semantic colors (consistent across all charts)
  semantic: {
    positive: "#26a69a", // TradingView green (used in candlesticks)
    negative: "#ef5350", // TradingView red (used in candlesticks)
    neutral: "#64748b",  // slate-500
    warning: "#f59e0b",  // amber-500
    // Aliases for readability
    bullish: "#26a69a",
    bearish: "#ef5350",
    up: "#26a69a",
    down: "#ef5350",
  },
  
  // Extended palette for multi-series charts
  series: [
    "#6366f1", // indigo
    "#14b8a6", // teal
    "#8b5cf6", // purple
    "#f59e0b", // amber
    "#06b6d4", // cyan
    "#ec4899", // pink
    "#84cc16", // lime
    "#f97316", // orange
    "#0ea5e9", // sky
    "#a855f7", // violet
  ],
  
  // Gradient colors
  gradients: {
    indigo: { start: "#6366f1", end: "#6366f1" },
    teal: { start: "#14b8a6", end: "#14b8a6" },
    positive: { start: "#26a69a", end: "#26a69a" },
    negative: { start: "#ef5350", end: "#ef5350" },
  },
  
  // Background/grid colors (matches TradingView dark theme)
  background: {
    chart: "#131722",      // TradingView chart bg
    grid: "#2B2B43",       // TradingView grid
    tooltip: "#1e293b",    // slate-800
    tooltipBorder: "#334155", // slate-700
  },
  
  // Text colors
  text: {
    primary: "#d1d4dc",    // TradingView text
    secondary: "#94a3b8",  // slate-400
    muted: "#64748b",      // slate-500
    axis: "#64748b",       // slate-500
  },
  
  // TradingView-specific (for lightweight-charts)
  tradingView: {
    // Dark theme (default)
    background: "#131722",
    text: "#d1d4dc",
    grid: "#2B2B43",
    border: "#2B2B43",
    crosshair: "#758696",
    upColor: "#26a69a",
    downColor: "#ef5350",
    volumeUp: "#26a69a80",
    volumeDown: "#ef535080",
  },
  
  // Light theme TradingView colors
  tradingViewLight: {
    background: "#ffffff",
    text: "#131722",
    grid: "#e0e3eb",
    border: "#d1d4dc",
    crosshair: "#9598a1",
    upColor: "#26a69a",
    downColor: "#ef5350",
    volumeUp: "#26a69a80",
    volumeDown: "#ef535080",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// AXIS STYLES
// ═══════════════════════════════════════════════════════════════════════════

export const axisStyle = {
  tick: {
    fill: chartColors.text.axis,
    fontSize: 10,
    fontFamily: "inherit",
  },
  axisLine: {
    stroke: chartColors.background.grid,
    strokeWidth: 1,
  },
  tickLine: false as const,
};

/** Spread directly on XAxis: <XAxis {...xAxisProps} dataKey="date" /> */
export const xAxisProps = {
  tick: axisStyle.tick,
  axisLine: axisStyle.axisLine,
  tickLine: axisStyle.tickLine,
  tickMargin: 8,
};

/** Spread directly on YAxis: <YAxis {...yAxisProps} /> */
export const yAxisProps = {
  tick: axisStyle.tick,
  axisLine: axisStyle.axisLine,
  tickLine: axisStyle.tickLine,
  tickMargin: 8,
  width: 50,
};

// ═══════════════════════════════════════════════════════════════════════════
// GRID STYLES
// ═══════════════════════════════════════════════════════════════════════════

export const gridStyle = {
  stroke: chartColors.background.grid,
  strokeDasharray: "3 3",
  strokeOpacity: 0.5,
};

/** Spread directly on CartesianGrid: <CartesianGrid {...cartesianGridProps} /> */
export const cartesianGridProps = {
  ...gridStyle,
  vertical: false,
};

// ═══════════════════════════════════════════════════════════════════════════
// TOOLTIP STYLES
// ═══════════════════════════════════════════════════════════════════════════

export const tooltipStyle = {
  contentStyle: {
    backgroundColor: chartColors.background.tooltip,
    border: `1px solid ${chartColors.background.tooltipBorder}`,
    borderRadius: "8px",
    padding: "8px 12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
    fontSize: "11px",
  },
  labelStyle: {
    color: chartColors.text.secondary,
    fontWeight: 500,
    marginBottom: "4px",
  },
  itemStyle: {
    color: chartColors.text.primary,
    fontSize: "12px",
    padding: "2px 0",
  },
  cursor: {
    stroke: chartColors.primary.indigo,
    strokeOpacity: 0.3,
    strokeWidth: 1,
  },
};

/** Spread directly on Tooltip: <Tooltip {...tooltipProps} /> */
export const tooltipProps = {
  contentStyle: tooltipStyle.contentStyle,
  labelStyle: tooltipStyle.labelStyle,
  itemStyle: tooltipStyle.itemStyle,
  cursor: tooltipStyle.cursor,
};

// ═══════════════════════════════════════════════════════════════════════════
// LEGEND STYLES
// ═══════════════════════════════════════════════════════════════════════════

export const legendStyle = {
  wrapperStyle: {
    paddingTop: "16px",
  },
  iconSize: 8,
  iconType: "circle" as const,
  formatter: (value: string) => (
    `<span style="color: ${chartColors.text.secondary}; font-size: 11px;">${value}</span>`
  ),
};

// ═══════════════════════════════════════════════════════════════════════════
// AREA CHART PRESETS
// ═══════════════════════════════════════════════════════════════════════════

export const areaChartPresets = {
  // Standard single area
  standard: {
    type: "monotone" as const,
    strokeWidth: 2,
    fillOpacity: 0.3,
  },
  
  // Gradient fill area
  gradient: {
    type: "monotone" as const,
    strokeWidth: 2,
    fillOpacity: 1,
  },
  
  // Stacked areas
  stacked: {
    type: "monotone" as const,
    strokeWidth: 0,
    fillOpacity: 0.6,
    stackId: "1",
  },
};

// Gradient definitions for area charts
export const areaGradients = {
  indigo: {
    id: "gradientIndigo",
    stops: [
      { offset: "0%", color: chartColors.primary.indigo, opacity: 0.4 },
      { offset: "100%", color: chartColors.primary.indigo, opacity: 0.05 },
    ],
  },
  teal: {
    id: "gradientTeal",
    stops: [
      { offset: "0%", color: chartColors.primary.teal, opacity: 0.4 },
      { offset: "100%", color: chartColors.primary.teal, opacity: 0.05 },
    ],
  },
  positive: {
    id: "gradientPositive",
    stops: [
      { offset: "0%", color: chartColors.semantic.positive, opacity: 0.4 },
      { offset: "100%", color: chartColors.semantic.positive, opacity: 0.05 },
    ],
  },
  negative: {
    id: "gradientNegative",
    stops: [
      { offset: "0%", color: chartColors.semantic.negative, opacity: 0.4 },
      { offset: "100%", color: chartColors.semantic.negative, opacity: 0.05 },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// LINE CHART PRESETS
// ═══════════════════════════════════════════════════════════════════════════

export const lineChartPresets = {
  // Standard line
  standard: {
    type: "monotone" as const,
    strokeWidth: 2,
    dot: false,
    activeDot: {
      r: 4,
      fill: chartColors.primary.indigo,
      stroke: chartColors.background.chart,
      strokeWidth: 2,
    },
  },
  
  // Line with dots
  withDots: {
    type: "monotone" as const,
    strokeWidth: 2,
    dot: {
      r: 3,
      fill: chartColors.background.chart,
      strokeWidth: 2,
    },
    activeDot: {
      r: 5,
      fill: chartColors.primary.indigo,
      stroke: chartColors.background.chart,
      strokeWidth: 2,
    },
  },
  
  // Dashed reference line
  reference: {
    type: "monotone" as const,
    strokeWidth: 1,
    strokeDasharray: "4 4",
    dot: false,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// BAR CHART PRESETS
// ═══════════════════════════════════════════════════════════════════════════

export const barChartPresets = {
  // Standard bars
  standard: {
    radius: [4, 4, 0, 0] as [number, number, number, number],
    maxBarSize: 40,
  },
  
  // Thin bars (for histograms)
  thin: {
    radius: [2, 2, 0, 0] as [number, number, number, number],
    maxBarSize: 20,
  },
  
  // Rounded bars
  rounded: {
    radius: [6, 6, 6, 6] as [number, number, number, number],
    maxBarSize: 30,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// REFERENCE LINE STYLES
// ═══════════════════════════════════════════════════════════════════════════

export const referenceLineStyles = {
  // Current price / target line
  target: {
    stroke: chartColors.semantic.warning,
    strokeDasharray: "4 4",
    strokeWidth: 1,
  },
  
  // Zero line
  zero: {
    stroke: chartColors.text.muted,
    strokeDasharray: "2 2",
    strokeWidth: 1,
  },
  
  // Threshold line
  threshold: {
    stroke: chartColors.semantic.negative,
    strokeDasharray: "3 3",
    strokeWidth: 1,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSIVE CONTAINER DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

export const responsiveContainerDefaults = {
  width: "100%",
  height: "100%",
  minHeight: 200,
};

// ═══════════════════════════════════════════════════════════════════════════
// CHART MARGINS
// ═══════════════════════════════════════════════════════════════════════════

export const chartMargins = {
  // Standard chart margins
  standard: {
    top: 10,
    right: 10,
    left: 0,
    bottom: 0,
  },
  
  // With labels
  withLabels: {
    top: 20,
    right: 20,
    left: 10,
    bottom: 20,
  },
  
  // Compact
  compact: {
    top: 5,
    right: 5,
    left: 0,
    bottom: 0,
  },
  
  // Mini cards
  mini: {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// PIE/DONUT CHART PRESETS
// ═══════════════════════════════════════════════════════════════════════════

export const pieChartPresets = {
  // Standard pie
  pie: {
    innerRadius: 0,
    outerRadius: "80%",
    paddingAngle: 2,
    dataKey: "value",
  },
  
  // Donut chart
  donut: {
    innerRadius: "50%",
    outerRadius: "80%",
    paddingAngle: 2,
    dataKey: "value",
  },
  
  // Mini donut (for sparklines)
  miniDonut: {
    innerRadius: "60%",
    outerRadius: "90%",
    paddingAngle: 0,
    dataKey: "value",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// RADAR CHART PRESETS
// ═══════════════════════════════════════════════════════════════════════════

export const radarChartPresets = {
  polarGrid: {
    gridType: "polygon" as const,
    stroke: chartColors.background.grid,
    strokeOpacity: 0.5,
  },
  polarAngleAxis: {
    tick: {
      fill: chartColors.text.secondary,
      fontSize: 10,
    },
    axisLine: {
      stroke: chartColors.background.grid,
    },
  },
  radar: {
    fillOpacity: 0.3,
    strokeWidth: 2,
    dot: {
      r: 3,
      fill: chartColors.background.chart,
      strokeWidth: 2,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// SIGNATURE CHART STYLES
// Distinctive visualizations for key cards
// ═══════════════════════════════════════════════════════════════════════════

/** 
 * Enhanced Radar with gradient stroke and fill
 * Use for Risk Radar, Financial Health DNA, etc.
 */
export const signatureRadar = {
  // Gradient stroke and fill for distinctive look
  stroke: "url(#radarStrokeGradient)",
  fill: "url(#radarFillGradient)",
  strokeWidth: 3,
  fillOpacity: 1,
  dot: {
    r: 4,
    fill: '#ffffff',
    stroke: 'url(#radarStrokeGradient)',
    strokeWidth: 2,
  },
  activeDot: {
    r: 6,
    fill: '#14b8a6',
    stroke: '#ffffff',
    strokeWidth: 2,
  },
};

/**
 * SVG Gradient definitions for signature charts
 * Include these in your chart's <defs> section
 */
export const signatureGradientDefs = {
  // Radar stroke gradient (indigo to teal)
  radarStroke: `
    <linearGradient id="radarStrokeGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#6366f1" />
      <stop offset="100%" stopColor="#14b8a6" />
    </linearGradient>
  `,
  // Radar fill gradient (radial, fades from center)
  radarFill: `
    <radialGradient id="radarFillGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
      <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
    </radialGradient>
  `,
  // Risk zones (concentric danger levels)
  riskZones: `
    <radialGradient id="riskZoneSafe" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
      <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
    </radialGradient>
    <radialGradient id="riskZoneWatch" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
    </radialGradient>
    <radialGradient id="riskZoneDanger" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
    </radialGradient>
  `,
  // Value thermometer gradient
  valueThermometer: `
    <linearGradient id="thermometerGradient" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stopColor="#ef4444" />
      <stop offset="30%" stopColor="#f59e0b" />
      <stop offset="50%" stopColor="#eab308" />
      <stop offset="70%" stopColor="#84cc16" />
      <stop offset="100%" stopColor="#10b981" />
    </linearGradient>
  `,
  // Growth trajectory (emerald glow)
  growthTrajectory: `
    <linearGradient id="growthGradient" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
      <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#14b8a6" stopOpacity="1" />
    </linearGradient>
    <filter id="growthGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  `,
  // Category-specific gradients
  categoryGradients: `
    <linearGradient id="valueGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#4f46e5" />
      <stop offset="100%" stopColor="#7c3aed" />
    </linearGradient>
    <linearGradient id="growthGradientFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
      <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
    </linearGradient>
    <linearGradient id="riskGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#dc2626" />
      <stop offset="100%" stopColor="#ea580c" />
    </linearGradient>
    <linearGradient id="technicalGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#0891b2" />
      <stop offset="100%" stopColor="#0d9488" />
    </linearGradient>
  `,
};

/**
 * Complete gradient definitions as a single string
 * Use: dangerouslySetInnerHTML={{ __html: allSignatureGradients }}
 */
export const allSignatureGradients = Object.values(signatureGradientDefs).join('\n');

/**
 * Risk level thresholds and colors
 */
export const riskLevelConfig = {
  safe: { threshold: 70, color: '#10b981', label: 'Safe', bg: 'bg-emerald-500/20' },
  watch: { threshold: 40, color: '#f59e0b', label: 'Watch', bg: 'bg-amber-500/20' },
  elevated: { threshold: 20, color: '#f97316', label: 'Elevated', bg: 'bg-orange-500/20' },
  critical: { threshold: 0, color: '#ef4444', label: 'Critical', bg: 'bg-red-500/20' },
};

/**
 * Get risk level based on score (0-100, higher is safer)
 */
export function getRiskLevel(score: number): keyof typeof riskLevelConfig {
  if (score >= riskLevelConfig.safe.threshold) return 'safe';
  if (score >= riskLevelConfig.watch.threshold) return 'watch';
  if (score >= riskLevelConfig.elevated.threshold) return 'elevated';
  return 'critical';
}

/**
 * Value gauge configuration
 */
export const valueGaugeConfig = {
  // Ranges as percentage of fair value
  deepUndervalued: { max: 0.7, color: '#10b981', label: 'Deep Value' },
  undervalued: { max: 0.9, color: '#84cc16', label: 'Undervalued' },
  fairValue: { max: 1.1, color: '#eab308', label: 'Fair Value' },
  overvalued: { max: 1.3, color: '#f97316', label: 'Overvalued' },
  expensive: { max: Infinity, color: '#ef4444', label: 'Expensive' },
};

/**
 * Get valuation status based on price vs fair value ratio
 */
export function getValuationStatus(priceToFairValue: number) {
  if (priceToFairValue <= valueGaugeConfig.deepUndervalued.max) return valueGaugeConfig.deepUndervalued;
  if (priceToFairValue <= valueGaugeConfig.undervalued.max) return valueGaugeConfig.undervalued;
  if (priceToFairValue <= valueGaugeConfig.fairValue.max) return valueGaugeConfig.fairValue;
  if (priceToFairValue <= valueGaugeConfig.overvalued.max) return valueGaugeConfig.overvalued;
  return valueGaugeConfig.expensive;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get color for a data series by index
 */
export function getSeriesColor(index: number): string {
  return chartColors.series[index % chartColors.series.length];
}

/**
 * Get semantic color based on value (positive/negative)
 */
export function getValueColor(value: number, threshold = 0): string {
  if (value > threshold) return chartColors.semantic.positive;
  if (value < threshold) return chartColors.semantic.negative;
  return chartColors.semantic.neutral;
}

/**
 * Get bar color based on value change
 */
export function getBarColor(value: number, previous?: number): string {
  if (previous !== undefined) {
    return value >= previous ? chartColors.semantic.positive : chartColors.semantic.negative;
  }
  return value >= 0 ? chartColors.semantic.positive : chartColors.semantic.negative;
}

/**
 * Format tick value for Indian currency (₹)
 */
export function formatCurrencyTick(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
}

/**
 * Format tick value for percentage
 */
export function formatPercentTick(value: number): string {
  return `${value}%`;
}

/**
 * Format tick value for large numbers
 */
export function formatNumberTick(value: number): string {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
}

/**
 * Format tick for compact display
 */
export function formatCompactTick(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (abs >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toFixed(1);
}

// ═══════════════════════════════════════════════════════════════════════════
// GRADIENT DEFINITIONS (for use in chart <defs>)
// Copy these into your chart's <defs> section
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Standard gradient definitions for area charts
 * Usage: Copy the appropriate gradient into your <AreaChart>'s <defs> section
 * 
 * @example
 * <AreaChart>
 *   <defs>
 *     <linearGradient id="gradientIndigo" x1="0" y1="0" x2="0" y2="1">
 *       <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
 *       <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
 *     </linearGradient>
 *   </defs>
 *   <Area fill="url(#gradientIndigo)" />
 * </AreaChart>
 */
export const gradientDefs = {
  indigo: `<linearGradient id="gradientIndigo" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="${chartColors.primary.indigo}" stopOpacity="0.4"/><stop offset="100%" stopColor="${chartColors.primary.indigo}" stopOpacity="0.05"/></linearGradient>`,
  teal: `<linearGradient id="gradientTeal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="${chartColors.primary.teal}" stopOpacity="0.4"/><stop offset="100%" stopColor="${chartColors.primary.teal}" stopOpacity="0.05"/></linearGradient>`,
  positive: `<linearGradient id="gradientPositive" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="${chartColors.semantic.positive}" stopOpacity="0.4"/><stop offset="100%" stopColor="${chartColors.semantic.positive}" stopOpacity="0.05"/></linearGradient>`,
  negative: `<linearGradient id="gradientNegative" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="${chartColors.semantic.negative}" stopOpacity="0.4"/><stop offset="100%" stopColor="${chartColors.semantic.negative}" stopOpacity="0.05"/></linearGradient>`,
};

// ═══════════════════════════════════════════════════════════════════════════
// LIGHTWEIGHT-CHARTS (TRADINGVIEW) CONFIG
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Standard configuration for lightweight-charts (TradingView engine)
 * Use with createChart() options
 */
export const lightweightChartConfig = {
  layout: {
    background: { type: 'solid' as const, color: chartColors.tradingView.background },
    textColor: chartColors.tradingView.text,
  },
  grid: {
    vertLines: { color: chartColors.tradingView.grid },
    horzLines: { color: chartColors.tradingView.grid },
  },
  rightPriceScale: {
    visible: true,
    borderColor: chartColors.tradingView.border,
  },
  timeScale: {
    borderColor: chartColors.tradingView.border,
    timeVisible: true,
    secondsVisible: false,
  },
  crosshair: {
    vertLine: { color: chartColors.tradingView.crosshair, style: 3 },
    horzLine: { color: chartColors.tradingView.crosshair, style: 3 },
  },
};

/**
 * Standard candlestick series options
 */
export const candlestickSeriesConfig = {
  upColor: chartColors.tradingView.upColor,
  downColor: chartColors.tradingView.downColor,
  borderVisible: false,
  wickUpColor: chartColors.tradingView.upColor,
  wickDownColor: chartColors.tradingView.downColor,
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT DEFAULT THEME OBJECT
// ═══════════════════════════════════════════════════════════════════════════

export const chartTheme = {
  colors: chartColors,
  categories: CATEGORY_STYLES,
  axis: {
    x: xAxisProps,
    y: yAxisProps,
  },
  grid: cartesianGridProps,
  tooltip: tooltipProps,
  legend: legendStyle,
  presets: {
    area: areaChartPresets,
    line: lineChartPresets,
    bar: barChartPresets,
    pie: pieChartPresets,
    radar: radarChartPresets,
  },
  // Signature chart styles
  signature: {
    radar: signatureRadar,
    gradients: signatureGradientDefs,
    allGradients: allSignatureGradients,
    riskLevels: riskLevelConfig,
    valueGauge: valueGaugeConfig,
  },
  gradients: areaGradients,
  referenceLine: referenceLineStyles,
  margins: chartMargins,
  // TradingView / lightweight-charts
  tradingView: {
    chart: lightweightChartConfig,
    candlestick: candlestickSeriesConfig,
  },
  // Helper functions
  utils: {
    getSeriesColor,
    getValueColor,
    getBarColor,
    formatCurrencyTick,
    formatPercentTick,
    formatNumberTick,
    formatCompactTick,
    getCategoryStyle,
    getRiskLevel,
    getValuationStatus,
  },
};

export default chartTheme;
