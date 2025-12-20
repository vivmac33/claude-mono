// ═══════════════════════════════════════════════════════════════════════════
// ADVANCED CHART COMPONENT
// Features: Timeframes, Chart Types, Individual Indicators, Combos Panel, Compare
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
  PriceScaleMode,
  type IChartApi,
  type Time,
} from 'lightweight-charts';
import { chartColors } from '@/lib/chartTheme';
import { IndicatorSelector, type ActiveIndicator } from './IndicatorSelector';
import * as Indicators from '@/lib/indicators';
import { useTheme } from '@/components/ThemeProvider';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface OHLCData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type ChartType = 'candle' | 'line' | 'area' | 'bar' | 'heikin-ashi';
export type Timeframe = '15m' | '30m' | '1h' | '2h' | '4h' | '1d';
export type PriceScale = 'linear' | 'log' | 'percentage';
export type DrawingTool = 'none' | 'trendline' | 'horizontal' | 'fib';

interface CompareSymbol {
  symbol: string;
  color: string;
  enabled: boolean;
}

// Individual indicator config
interface IndicatorConfig {
  id: string;
  name: string;
  shortName: string;
  enabled: boolean;
  color: string;
  params: Record<string, number>;
}

export interface AdvancedChartProps {
  data: OHLCData[];
  symbol?: string;
  showToolbar?: boolean;
  showVolume?: boolean;
  defaultChartType?: ChartType;
  defaultTimeframe?: Timeframe;
  onTimeframeChange?: (tf: Timeframe) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const TIMEFRAMES: { id: Timeframe; label: string }[] = [
  { id: '15m', label: '15m' },
  { id: '30m', label: '30m' },
  { id: '1h', label: '1H' },
  { id: '2h', label: '2H' },
  { id: '4h', label: '4H' },
  { id: '1d', label: '1D' },
];

const CHART_TYPES: { id: ChartType; label: string; icon: string }[] = [
  { id: 'candle', label: 'Candles', icon: '🕯️' },
  { id: 'line', label: 'Line', icon: '📈' },
  { id: 'area', label: 'Area', icon: '📊' },
  { id: 'bar', label: 'Bars', icon: '📉' },
  { id: 'heikin-ashi', label: 'Heikin-Ashi', icon: '🔶' },
];

const DRAWING_TOOLS: { id: DrawingTool; label: string; icon: string }[] = [
  { id: 'none', label: 'Select', icon: '👆' },
  { id: 'trendline', label: 'Trend Line', icon: '📐' },
  { id: 'horizontal', label: 'Horizontal', icon: '➖' },
  { id: 'fib', label: 'Fibonacci', icon: '🔢' },
];

// Default individual indicators
const DEFAULT_INDICATORS: IndicatorConfig[] = [
  { id: 'sma20', name: 'SMA 20', shortName: 'SMA20', enabled: false, color: '#3b82f6', params: { period: 20 } },
  { id: 'sma50', name: 'SMA 50', shortName: 'SMA50', enabled: false, color: '#f59e0b', params: { period: 50 } },
  { id: 'sma200', name: 'SMA 200', shortName: 'SMA200', enabled: false, color: '#10b981', params: { period: 200 } },
  { id: 'ema20', name: 'EMA 20', shortName: 'EMA20', enabled: true, color: '#8b5cf6', params: { period: 20 } },
  { id: 'ema50', name: 'EMA 50', shortName: 'EMA50', enabled: false, color: '#ec4899', params: { period: 50 } },
  { id: 'bb', name: 'Bollinger Bands', shortName: 'BB', enabled: false, color: '#6366f1', params: { period: 20, stdDev: 2 } },
  { id: 'vwap', name: 'VWAP', shortName: 'VWAP', enabled: false, color: '#14b8a6', params: {} },
  { id: 'rsi', name: 'RSI', shortName: 'RSI', enabled: false, color: '#f97316', params: { period: 14 } },
  { id: 'macd', name: 'MACD', shortName: 'MACD', enabled: false, color: '#84cc16', params: { fast: 12, slow: 26, signal: 9 } },
  { id: 'supertrend', name: 'Supertrend', shortName: 'ST', enabled: false, color: '#22c55e', params: { period: 10, multiplier: 3 } },
  { id: 'atr', name: 'ATR', shortName: 'ATR', enabled: false, color: '#ef4444', params: { period: 14 } },
];

const COMPARE_COLORS = ['#f59e0b', '#10b981', '#ec4899', '#6366f1'];
const TOOLBAR_HEIGHT = 36;

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function calculateHeikinAshi(data: OHLCData[]): OHLCData[] {
  const result: OHLCData[] = [];
  for (let i = 0; i < data.length; i++) {
    const current = data[i];
    const prev = i > 0 ? result[i - 1] : current;
    const haClose = (current.open + current.high + current.low + current.close) / 4;
    const haOpen = (prev.open + prev.close) / 2;
    result.push({
      date: current.date,
      open: haOpen,
      high: Math.max(current.high, haOpen, haClose),
      low: Math.min(current.low, haOpen, haClose),
      close: haClose,
      volume: current.volume,
    });
  }
  return result;
}

function calculateSMA(closes: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    const start = Math.max(0, i - period + 1);
    const slice = closes.slice(start, i + 1);
    result.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return result;
}

function calculateEMA(closes: number[], period: number): number[] {
  const result: number[] = [];
  const multiplier = 2 / (period + 1);
  for (let i = 0; i < closes.length; i++) {
    if (i === 0) result.push(closes[0]);
    else result.push((closes[i] - result[i - 1]) * multiplier + result[i - 1]);
  }
  return result;
}

function calculateBB(closes: number[], period: number, mult: number): { upper: number[]; middle: number[]; lower: number[] } {
  const middle = calculateSMA(closes, period);
  const upper: number[] = [];
  const lower: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    const start = Math.max(0, i - period + 1);
    const slice = closes.slice(start, i + 1);
    const avg = middle[i];
    const variance = slice.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / slice.length;
    const std = Math.sqrt(variance);
    upper.push(avg + mult * std);
    lower.push(avg - mult * std);
  }
  return { upper, middle, lower };
}

function calculateRSI(closes: number[], period: number): number[] {
  const result: number[] = [];
  let avgGain = 0, avgLoss = 0;
  for (let i = 0; i < closes.length; i++) {
    if (i === 0) { result.push(50); continue; }
    const change = closes[i] - closes[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;
    if (i <= period) {
      avgGain = (avgGain * (i - 1) + gain) / i;
      avgLoss = (avgLoss * (i - 1) + loss) / i;
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
    }
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result.push(100 - 100 / (1 + rs));
  }
  return result;
}

function calculateMACD(closes: number[]): { macd: number[]; signal: number[]; histogram: number[] } {
  const fast = calculateEMA(closes, 12);
  const slow = calculateEMA(closes, 26);
  const macd = fast.map((f, i) => f - slow[i]);
  const signal = calculateEMA(macd, 9);
  const histogram = macd.map((m, i) => m - signal[i]);
  return { macd, signal, histogram };
}

function generateCompareData(symbol: string, baseData: OHLCData[]): OHLCData[] {
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) seed += symbol.charCodeAt(i);
  const random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const basePrice = 100 + random() * 2000;
  let price = basePrice;
  return baseData.map(d => {
    const change = (random() - 0.48) * 0.02;
    price = price * (1 + change);
    return { date: d.date, open: price, high: price * 1.01, low: price * 0.99, close: price, volume: Math.floor(random() * 1000000) };
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// INDICATOR SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════════════════

interface IndicatorSettingsModalProps {
  indicator: IndicatorConfig;
  onSave: (ind: IndicatorConfig) => void;
  onClose: () => void;
}

function IndicatorSettingsModal({ indicator, onSave, onClose }: IndicatorSettingsModalProps) {
  const [config, setConfig] = useState({ ...indicator });

  const paramLabels: Record<string, string> = {
    period: 'Period', stdDev: 'Std Dev', fast: 'Fast', slow: 'Slow', signal: 'Signal', multiplier: 'Multiplier',
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-slate-800 border border-slate-700 rounded-xl p-4 w-72 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-100">{indicator.name} Settings</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="space-y-3">
          {Object.entries(config.params).map(([key, value]) => (
            <div key={key}>
              <label className="text-xs text-slate-400 block mb-1">{paramLabels[key] || key}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setConfig(prev => ({ ...prev, params: { ...prev.params, [key]: parseFloat(e.target.value) || 0 } }))}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white"
              />
            </div>
          ))}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Color</label>
            <div className="flex gap-2">
              <input type="color" value={config.color} onChange={(e) => setConfig(prev => ({ ...prev, color: e.target.value }))} className="w-8 h-8 rounded border border-slate-600" />
              <input type="text" value={config.color} onChange={(e) => setConfig(prev => ({ ...prev, color: e.target.value }))} className="flex-1 px-2 py-1 bg-slate-900 border border-slate-600 rounded text-sm text-white font-mono" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-3 py-1.5 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600">Cancel</button>
          <button onClick={() => { onSave(config); onClose(); }} className="flex-1 px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-500">Apply</button>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function AdvancedChart({
  data,
  symbol,
  showToolbar = true,
  showVolume = true,
  defaultChartType = 'candle',
  defaultTimeframe = '1d',
  onTimeframeChange,
}: AdvancedChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Theme-aware chart colors
  const colors = isDark ? chartColors.tradingView : chartColors.tradingViewLight;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const [timeframe, setTimeframe] = useState<Timeframe>(defaultTimeframe);
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);
  const [priceScale, setPriceScale] = useState<PriceScale>('linear');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [drawingTool, setDrawingTool] = useState<DrawingTool>('none');
  
  // Individual Indicators (dropdown)
  const [indicators, setIndicators] = useState<IndicatorConfig[]>(DEFAULT_INDICATORS);
  const [showIndicatorMenu, setShowIndicatorMenu] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<IndicatorConfig | null>(null);
  
  // Combos Panel (sidebar)
  const [showCombosPanel, setShowCombosPanel] = useState(false);
  const [comboIndicators, setComboIndicators] = useState<ActiveIndicator[]>([]);
  
  // Compare
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareSymbols, setCompareSymbols] = useState<CompareSymbol[]>([]);
  const [compareInput, setCompareInput] = useState('');

  // Dropdown states
  const [showChartTypeMenu, setShowChartTypeMenu] = useState(false);
  const [showDrawingMenu, setShowDrawingMenu] = useState(false);
  const [showScaleMenu, setShowScaleMenu] = useState(false);

  // Container dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Count enabled indicators
  const enabledIndicatorCount = indicators.filter(i => i.enabled).length + comboIndicators.length;

  // Process data
  const processedData = useMemo(() => {
    if (chartType === 'heikin-ashi') return calculateHeikinAshi(data);
    return data;
  }, [data, chartType]);

  const handleTimeframeChange = useCallback((tf: Timeframe) => {
    setTimeframe(tf);
    onTimeframeChange?.(tf);
  }, [onTimeframeChange]);

  // Indicator toggle
  const handleIndicatorToggle = useCallback((id: string) => {
    setIndicators(prev => prev.map(ind => ind.id === id ? { ...ind, enabled: !ind.enabled } : ind));
  }, []);

  // Indicator settings save
  const handleIndicatorSave = useCallback((updated: IndicatorConfig) => {
    setIndicators(prev => prev.map(ind => ind.id === updated.id ? updated : ind));
  }, []);

  // Compare functions
  const handleCompareAdd = useCallback((sym: string) => {
    if (!sym || compareSymbols.some(c => c.symbol === sym)) return;
    const colorIndex = compareSymbols.length % COMPARE_COLORS.length;
    setCompareSymbols(prev => [...prev, { symbol: sym, color: COMPARE_COLORS[colorIndex], enabled: true }]);
    setCompareInput('');
  }, [compareSymbols]);

  const handleCompareRemove = useCallback((sym: string) => {
    setCompareSymbols(prev => prev.filter(c => c.symbol !== sym));
  }, []);

  const handleCompareToggle = useCallback((sym: string) => {
    setCompareSymbols(prev => prev.map(c => c.symbol === sym ? { ...c, enabled: !c.enabled } : c));
  }, []);

  // Screenshot
  const handleScreenshot = useCallback(() => {
    const canvas = chartContainerRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${symbol || 'chart'}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }, [symbol]);

  // Fullscreen
  const handleFullscreenToggle = useCallback(() => {
    if (!containerRef.current) return;
    if (!isFullscreen) containerRef.current.requestFullscreen?.();
    else document.exitFullscreen?.();
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  // ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    resizeObserverRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });
    resizeObserverRef.current.observe(containerRef.current);
    return () => resizeObserverRef.current?.disconnect();
  }, []);

  // Create chart
  useEffect(() => {
    if (!chartContainerRef.current || processedData.length === 0 || dimensions.width === 0) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const panelWidth = showCombosPanel ? 320 : 0;
    const chartWidth = dimensions.width - panelWidth;
    const chartHeight = dimensions.height - (showToolbar ? TOOLBAR_HEIGHT : 0);

    if (chartWidth <= 0 || chartHeight <= 0) return;

    const priceScaleMode = priceScale === 'log' ? PriceScaleMode.Logarithmic :
      priceScale === 'percentage' ? PriceScaleMode.Percentage : PriceScaleMode.Normal;

    const chart = createChart(chartContainerRef.current, {
      width: chartWidth,
      height: chartHeight,
      layout: {
        background: { type: ColorType.Solid, color: colors.background },
        textColor: colors.text,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      rightPriceScale: { visible: true, borderColor: colors.border, mode: priceScaleMode },
      timeScale: { borderColor: colors.border, timeVisible: true, rightOffset: 5, barSpacing: 8 },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { width: 1, color: colors.crosshair, style: LineStyle.Dashed },
        horzLine: { width: 1, color: colors.crosshair, style: LineStyle.Dashed },
      },
    });

    chartRef.current = chart;

    // Main series
    const seriesData = processedData.map(d => ({ time: d.date as Time, open: d.open, high: d.high, low: d.low, close: d.close }));

    if (chartType === 'candle' || chartType === 'heikin-ashi') {
      const series = chart.addCandlestickSeries({ upColor: colors.upColor, downColor: colors.downColor, borderVisible: false, wickUpColor: colors.upColor, wickDownColor: colors.downColor });
      series.setData(seriesData);
    } else if (chartType === 'bar') {
      const series = chart.addBarSeries({ upColor: colors.upColor, downColor: colors.downColor });
      series.setData(seriesData);
    } else if (chartType === 'line') {
      const series = chart.addLineSeries({ color: colors.upColor, lineWidth: 2 });
      series.setData(seriesData.map(d => ({ time: d.time, value: d.close })));
    } else if (chartType === 'area') {
      const series = chart.addAreaSeries({ lineColor: colors.upColor, topColor: `${colors.upColor}50`, bottomColor: `${colors.upColor}10`, lineWidth: 2 });
      series.setData(seriesData.map(d => ({ time: d.time, value: d.close })));
    }

    // Volume
    if (showVolume && (chartType === 'candle' || chartType === 'bar' || chartType === 'heikin-ashi')) {
      const volumeSeries = chart.addHistogramSeries({ color: colors.volumeUp, priceFormat: { type: 'volume' }, priceScaleId: 'volume' });
      volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });
      volumeSeries.setData(processedData.map(d => ({ time: d.date as Time, value: d.volume, color: d.close >= d.open ? colors.volumeUp : colors.volumeDown })));
    }

    // Compare symbols
    compareSymbols.filter(c => c.enabled).forEach(comp => {
      const compareData = generateCompareData(comp.symbol, processedData);
      const startPrice = compareData[0]?.close || 1;
      const mainStartPrice = processedData[0]?.close || 1;
      const compSeries = chart.addLineSeries({ color: comp.color, lineWidth: 2, priceLineVisible: true, lastValueVisible: true, priceScaleId: 'right', title: comp.symbol });
      compSeries.setData(compareData.map(d => {
        const pctChange = (d.close - startPrice) / startPrice;
        return { time: d.date as Time, value: mainStartPrice * (1 + pctChange) };
      }));
    });

    // Individual indicators
    const closes = processedData.map(d => d.close);
    const ohlcv = processedData.map(d => ({ date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume }));

    indicators.forEach(ind => {
      if (!ind.enabled) return;
      try {
        if (ind.id === 'sma20' || ind.id === 'sma50' || ind.id === 'sma200') {
          const smaData = calculateSMA(closes, ind.params.period);
          const series = chart.addLineSeries({ color: ind.color, lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
          series.setData(smaData.map((v, i) => ({ time: processedData[i].date as Time, value: v })));
        }
        if (ind.id === 'ema20' || ind.id === 'ema50') {
          const emaData = calculateEMA(closes, ind.params.period);
          const series = chart.addLineSeries({ color: ind.color, lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
          series.setData(emaData.map((v, i) => ({ time: processedData[i].date as Time, value: v })));
        }
        if (ind.id === 'bb') {
          const bb = calculateBB(closes, ind.params.period, ind.params.stdDev);
          const upperSeries = chart.addLineSeries({ color: ind.color, lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false });
          upperSeries.setData(bb.upper.map((v, i) => ({ time: processedData[i].date as Time, value: v })));
          const middleSeries = chart.addLineSeries({ color: ind.color, lineWidth: 1, priceLineVisible: false });
          middleSeries.setData(bb.middle.map((v, i) => ({ time: processedData[i].date as Time, value: v })));
          const lowerSeries = chart.addLineSeries({ color: ind.color, lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false });
          lowerSeries.setData(bb.lower.map((v, i) => ({ time: processedData[i].date as Time, value: v })));
        }
        if (ind.id === 'vwap') {
          const vwapData = Indicators.VWAP(ohlcv);
          const series = chart.addLineSeries({ color: ind.color, lineWidth: 2, priceLineVisible: false });
          series.setData(vwapData.map(d => ({ time: d.date as Time, value: d.value })));
        }
        if (ind.id === 'rsi') {
          const rsiData = calculateRSI(closes, ind.params.period);
          const series = chart.addLineSeries({ color: ind.color, lineWidth: 1, priceScaleId: 'rsi', priceLineVisible: false });
          series.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0.05 } });
          series.setData(rsiData.map((v, i) => ({ time: processedData[i].date as Time, value: v })));
        }
        if (ind.id === 'macd') {
          const macdData = calculateMACD(closes);
          const histSeries = chart.addHistogramSeries({ color: ind.color, priceScaleId: 'macd', priceFormat: { type: 'price', precision: 2 } });
          histSeries.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
          histSeries.setData(macdData.histogram.map((v, i) => ({ time: processedData[i].date as Time, value: v, color: v >= 0 ? '#26a69a' : '#ef5350' })));
        }
        if (ind.id === 'supertrend') {
          const stData = Indicators.Supertrend(ohlcv, ind.params.period, ind.params.multiplier);
          const series = chart.addLineSeries({ color: ind.color, lineWidth: 2, priceLineVisible: false });
          series.setData(stData.map(d => ({ time: d.date as Time, value: d.value })));
        }
        if (ind.id === 'atr') {
          const atrData = Indicators.ATR(ohlcv, ind.params.period);
          const series = chart.addLineSeries({ color: ind.color, lineWidth: 1, priceScaleId: 'atr' });
          series.priceScale().applyOptions({ scaleMargins: { top: 0.85, bottom: 0.05 } });
          series.setData(atrData.map(d => ({ time: d.date as Time, value: d.value })));
        }
      } catch (e) {
        console.warn(`Failed to add indicator ${ind.id}:`, e);
      }
    });

    // Combo indicators
    comboIndicators.forEach(ind => {
      if (!ind.enabled) return;
      try {
        // Same logic as individual indicators - check by id prefix
        if (ind.id.startsWith('ema')) {
          const period = ind.params.period || 20;
          const emaData = calculateEMA(closes, period);
          const series = chart.addLineSeries({ color: ind.color, lineWidth: 1, priceLineVisible: false });
          series.setData(emaData.map((v, i) => ({ time: processedData[i].date as Time, value: v })));
        }
        if (ind.id.startsWith('sma')) {
          const period = ind.params.period || 50;
          const smaData = calculateSMA(closes, period);
          const series = chart.addLineSeries({ color: ind.color, lineWidth: 1, priceLineVisible: false });
          series.setData(smaData.map((v, i) => ({ time: processedData[i].date as Time, value: v })));
        }
        if (ind.id === 'bb') {
          const bb = calculateBB(closes, ind.params.period || 20, ind.params.stdDev || 2);
          const upperSeries = chart.addLineSeries({ color: ind.color, lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false });
          upperSeries.setData(bb.upper.map((v, i) => ({ time: processedData[i].date as Time, value: v })));
          const lowerSeries = chart.addLineSeries({ color: ind.color, lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false });
          lowerSeries.setData(bb.lower.map((v, i) => ({ time: processedData[i].date as Time, value: v })));
        }
        if (ind.id === 'macd') {
          const macdData = calculateMACD(closes);
          const histSeries = chart.addHistogramSeries({ color: ind.color, priceScaleId: 'macd' });
          histSeries.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
          histSeries.setData(macdData.histogram.map((v, i) => ({ time: processedData[i].date as Time, value: v, color: v >= 0 ? '#26a69a' : '#ef5350' })));
        }
        if (ind.id === 'rsi') {
          const rsiData = calculateRSI(closes, ind.params.period || 14);
          const series = chart.addLineSeries({ color: ind.color, lineWidth: 1, priceScaleId: 'rsi' });
          series.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0.05 } });
          series.setData(rsiData.map((v, i) => ({ time: processedData[i].date as Time, value: v })));
        }
        if (ind.id === 'vwap') {
          const vwapData = Indicators.VWAP(ohlcv);
          const series = chart.addLineSeries({ color: ind.color, lineWidth: 2, priceLineVisible: false });
          series.setData(vwapData.map(d => ({ time: d.date as Time, value: d.value })));
        }
        if (ind.id === 'supertrend') {
          const stData = Indicators.Supertrend(ohlcv, ind.params.period || 10, ind.params.multiplier || 3);
          const series = chart.addLineSeries({ color: ind.color, lineWidth: 2, priceLineVisible: false });
          series.setData(stData.map(d => ({ time: d.date as Time, value: d.value })));
        }
        if (ind.id === 'adx') {
          const adxData = Indicators.ADX(ohlcv, ind.params.period || 14);
          const series = chart.addLineSeries({ color: ind.color, lineWidth: 1, priceScaleId: 'adx' });
          series.priceScale().applyOptions({ scaleMargins: { top: 0.85, bottom: 0.05 } });
          series.setData(adxData.map(d => ({ time: d.date as Time, value: d.adx as number })));
        }
        if (ind.id === 'obv') {
          const obvData = Indicators.OBV(ohlcv);
          const series = chart.addLineSeries({ color: ind.color, lineWidth: 1, priceScaleId: 'obv' });
          series.priceScale().applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });
          series.setData(obvData.map(d => ({ time: d.date as Time, value: d.value })));
        }
      } catch (e) {
        console.warn(`Failed to add combo indicator ${ind.id}:`, e);
      }
    });

    chart.timeScale().fitContent();

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [processedData, chartType, priceScale, showVolume, isFullscreen, compareSymbols, indicators, comboIndicators, dimensions, showCombosPanel, showToolbar, colors]);

  if (processedData.length === 0) {
    return <div className={`absolute inset-0 flex items-center justify-center rounded-lg ${isDark ? 'text-slate-500 bg-slate-900' : 'text-slate-400 bg-white'}`}>No data available</div>;
  }

  const currentChartType = CHART_TYPES.find(t => t.id === chartType);

  return (
    <div ref={containerRef} className={`absolute inset-0 flex flex-col rounded-lg overflow-hidden border ${isDark ? 'border-slate-700/50 bg-slate-900' : 'border-slate-300 bg-white'} ${isFullscreen ? 'fixed z-50' : ''}`} tabIndex={0}>
      {/* Toolbar */}
      {showToolbar && (
        <div className={`flex items-center gap-1 px-2 py-1.5 border-b text-xs flex-shrink-0 ${isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-slate-100 border-slate-200'}`} style={{ height: TOOLBAR_HEIGHT }}>
          {symbol && <div className={`px-2 py-1 font-semibold border-r mr-1 ${isDark ? 'text-slate-100 border-slate-700' : 'text-slate-800 border-slate-300'}`}>{symbol}</div>}

          {/* Timeframes */}
          <div className={`flex items-center rounded p-0.5 ${isDark ? 'bg-slate-800/50' : 'bg-slate-200'}`}>
            {TIMEFRAMES.map(tf => (
              <button key={tf.id} onClick={() => handleTimeframeChange(tf.id)} className={`px-1.5 py-0.5 rounded transition-all ${timeframe === tf.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>{tf.label}</button>
            ))}
          </div>

          <div className="w-px h-4 bg-slate-700 mx-1" />

          {/* Chart Type */}
          <div className="relative">
            <button onClick={() => setShowChartTypeMenu(!showChartTypeMenu)} className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-800/50 rounded text-slate-300 hover:text-white">
              <span>{currentChartType?.icon}</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showChartTypeMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowChartTypeMenu(false)} />
                <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 py-1 min-w-[120px]">
                  {CHART_TYPES.map(type => (
                    <button key={type.id} onClick={() => { setChartType(type.id); setShowChartTypeMenu(false); }} className={`w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-slate-700 ${chartType === type.id ? 'text-indigo-400' : 'text-slate-300'}`}>
                      <span>{type.icon}</span><span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="w-px h-4 bg-slate-700 mx-1" />

          {/* Drawing */}
          <div className="relative">
            <button onClick={() => setShowDrawingMenu(!showDrawingMenu)} className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${drawingTool !== 'none' ? 'bg-indigo-600 text-white' : 'bg-slate-800/50 text-slate-300 hover:text-white'}`}>
              <span>📐</span><span>Draw</span>
            </button>
            {showDrawingMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDrawingMenu(false)} />
                <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 py-1 min-w-[140px]">
                  <div className="px-3 py-1 text-[10px] text-amber-400 border-b border-slate-700 mb-1">🚧 Coming Soon</div>
                  {DRAWING_TOOLS.map(tool => (
                    <button 
                      key={tool.id} 
                      onClick={() => { 
                        if (tool.id === 'none') {
                          setDrawingTool(tool.id); 
                        }
                        setShowDrawingMenu(false); 
                      }} 
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-slate-700 ${drawingTool === tool.id ? 'text-indigo-400' : 'text-slate-300'} ${tool.id !== 'none' ? 'opacity-50' : ''}`}
                      disabled={tool.id !== 'none'}
                    >
                      <span>{tool.icon}</span><span>{tool.label}</span>
                      {tool.id !== 'none' && <span className="ml-auto text-[10px] text-slate-500">soon</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="w-px h-4 bg-slate-700 mx-1" />

          {/* INDICATORS DROPDOWN */}
          <div className="relative">
            <button onClick={() => setShowIndicatorMenu(!showIndicatorMenu)} className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${indicators.some(i => i.enabled) ? 'bg-indigo-600 text-white' : 'bg-slate-800/50 text-slate-300 hover:text-white'}`}>
              <span>📊</span>
              <span>Indicators</span>
              {indicators.filter(i => i.enabled).length > 0 && (
                <span className="px-1 bg-indigo-700 rounded text-[10px]">{indicators.filter(i => i.enabled).length}</span>
              )}
            </button>
            {showIndicatorMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowIndicatorMenu(false)} />
                <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 py-1 w-56 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] text-slate-500 uppercase border-b border-slate-700">Individual Indicators</div>
                  {indicators.map(ind => (
                    <div key={ind.id} className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-700 group">
                      <button onClick={() => handleIndicatorToggle(ind.id)} className="flex items-center gap-2 flex-1">
                        <span className={`w-3 h-3 rounded border flex items-center justify-center ${ind.enabled ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                          {ind.enabled && <span className="text-white text-[8px]">✓</span>}
                        </span>
                        <span className="w-3 h-3 rounded" style={{ backgroundColor: ind.color }} />
                        <span className="text-sm text-slate-200">{ind.name}</span>
                      </button>
                      {Object.keys(ind.params).length > 0 && (
                        <button onClick={() => { setEditingIndicator(ind); setShowIndicatorMenu(false); }} className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100">⚙️</button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="w-px h-4 bg-slate-700 mx-1" />

          {/* COMBOS BUTTON - Opens side panel */}
          <button onClick={() => setShowCombosPanel(!showCombosPanel)} className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${showCombosPanel || comboIndicators.length > 0 ? 'bg-teal-600 text-white' : 'bg-slate-800/50 text-slate-300 hover:text-white'}`}>
            <span>🎯</span>
            <span>Combos</span>
            {comboIndicators.length > 0 && <span className="px-1 bg-teal-700 rounded text-[10px]">{comboIndicators.length}</span>}
          </button>

          <div className="w-px h-4 bg-slate-700 mx-1" />

          {/* Compare */}
          <button onClick={() => setShowCompareModal(!showCompareModal)} className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${compareSymbols.length > 0 ? 'bg-amber-600 text-white' : 'bg-slate-800/50 text-slate-300 hover:text-white'}`}>
            <span>⚖️</span><span>Compare</span>
            {compareSymbols.length > 0 && <span className="px-1 bg-amber-700 rounded text-[10px]">{compareSymbols.length}</span>}
          </button>

          <div className="flex-1" />

          {/* Scale */}
          <div className="relative">
            <button onClick={() => setShowScaleMenu(!showScaleMenu)} className="px-1.5 py-0.5 bg-slate-800/50 rounded text-slate-400 text-[10px] uppercase">{priceScale}</button>
            {showScaleMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowScaleMenu(false)} />
                <div className="absolute top-full right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 py-1">
                  {(['linear', 'log', 'percentage'] as PriceScale[]).map(scale => (
                    <button key={scale} onClick={() => { setPriceScale(scale); setShowScaleMenu(false); }} className={`w-full px-3 py-1 text-left capitalize hover:bg-slate-700 ${priceScale === scale ? 'text-indigo-400' : 'text-slate-300'}`}>{scale}</button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button onClick={handleScreenshot} className="p-1 text-slate-400 hover:text-white" title="Screenshot">📷</button>
          <button onClick={handleFullscreenToggle} className="p-1 text-slate-400 hover:text-white" title="Fullscreen">{isFullscreen ? '✖' : '⛶'}</button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div ref={chartContainerRef} className="flex-1" />
        
        {showCombosPanel && (
          <div className="w-80 border-l border-slate-700 overflow-hidden flex-shrink-0">
            <IndicatorSelector
              activeIndicators={comboIndicators}
              onIndicatorsChange={setComboIndicators}
              maxIndicators={5}
              onClose={() => setShowCombosPanel(false)}
            />
          </div>
        )}
      </div>

      {/* Indicator Settings Modal */}
      {editingIndicator && (
        <IndicatorSettingsModal
          indicator={editingIndicator}
          onSave={handleIndicatorSave}
          onClose={() => setEditingIndicator(null)}
        />
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowCompareModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-slate-800 border border-slate-700 rounded-xl p-4 w-72 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-100">Compare Symbols</h3>
              <button onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="flex gap-2 mb-3">
              <input type="text" value={compareInput} onChange={(e) => setCompareInput(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === 'Enter' && handleCompareAdd(compareInput)} placeholder="Symbol..." className="flex-1 px-2 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white" />
              <button onClick={() => handleCompareAdd(compareInput)} className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm">Add</button>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {['NIFTY50', 'NIFTYIT', 'BANKNIFTY', 'SENSEX'].map(sym => (
                <button key={sym} onClick={() => handleCompareAdd(sym)} disabled={compareSymbols.some(c => c.symbol === sym)} className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 disabled:opacity-50">{sym}</button>
              ))}
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {compareSymbols.map(comp => (
                <div key={comp.symbol} className="flex items-center justify-between px-2 py-1 bg-slate-900 rounded">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleCompareToggle(comp.symbol)} className={`w-3 h-3 rounded border ${comp.enabled ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`} />
                    <span className="w-3 h-3 rounded" style={{ backgroundColor: comp.color }} />
                    <span className="text-sm text-slate-200">{comp.symbol}</span>
                  </div>
                  <button onClick={() => handleCompareRemove(comp.symbol)} className="text-slate-500 hover:text-red-400">✕</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdvancedChart;
