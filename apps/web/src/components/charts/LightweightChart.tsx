// ═══════════════════════════════════════════════════════════════════════════
// LIGHTWEIGHT CHARTS COMPONENT - Real TradingView Engine
// Uses centralized chartTheme for consistency
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react';
import {
  createChart,
  ColorType,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  type Time,
} from 'lightweight-charts';
import { chartColors } from '@/lib/chartTheme';

export interface OHLCData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MAOverlay {
  period: number;
  color: string;
  data: number[];
}

export interface LightweightChartProps {
  data: OHLCData[];
  height?: number;
  showVolume?: boolean;
  maOverlays?: MAOverlay[];
  className?: string;
}

// Use centralized colors
const colors = chartColors.tradingView;

export function LightweightCandlestickChart({
  data,
  height = 400,
  showVolume = true,
  maOverlays = [],
  className = '',
}: LightweightChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    // Clean up previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const containerWidth = containerRef.current.clientWidth;

    // Create chart with centralized theme config
    const chart = createChart(containerRef.current, {
      width: containerWidth,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: colors.background },
        textColor: colors.text,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      rightPriceScale: {
        visible: true,
        borderColor: colors.border,
      },
      timeScale: {
        borderColor: colors.border,
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 2,
        barSpacing: 6,
        minBarSpacing: 1,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 1,
          color: colors.crosshair,
          style: 3,
        },
        horzLine: {
          width: 1,
          color: colors.crosshair,
          style: 3,
        },
      },
    });

    chartRef.current = chart;

    // Add candlestick series with centralized colors
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: colors.upColor,
      downColor: colors.downColor,
      borderVisible: false,
      wickUpColor: colors.upColor,
      wickDownColor: colors.downColor,
      wickVisible: true,
    });

    // Set candlestick data
    const candleData = data.map((d) => ({
      time: d.date as Time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));
    candlestickSeries.setData(candleData);

    // Add volume series if enabled
    if (showVolume) {
      const volumeSeries = chart.addHistogramSeries({
        color: colors.volumeUp,
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      });

      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      const volumeData = data.map((d) => ({
        time: d.date as Time,
        value: d.volume,
        color: d.close >= d.open ? colors.volumeUp : colors.volumeDown,
      }));
      volumeSeries.setData(volumeData);
    }

    // Add MA overlays
    maOverlays.forEach((ma) => {
      if (ma.data.length !== data.length) return;

      const lineSeries = chart.addLineSeries({
        color: ma.color,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      });

      const lineData = ma.data.map((value, i) => ({
        time: data[i].date as Time,
        value: value,
      }));
      lineSeries.setData(lineData);
    });

    // Simple fitContent - data is now correct (no weekends)
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        const newWidth = containerRef.current.clientWidth;
        chartRef.current.applyOptions({ width: newWidth });
        chartRef.current.timeScale().fitContent();
      }
    };

    // Initial render delay for DOM settle
    const initTimer = setTimeout(() => {
      if (containerRef.current && chartRef.current) {
        const newWidth = containerRef.current.clientWidth;
        chartRef.current.applyOptions({ width: newWidth });
        chartRef.current.timeScale().fitContent();
      }
    }, 100);

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, height, showVolume, maOverlays]);

  if (data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center text-slate-500 rounded ${className}`}
        style={{ height, backgroundColor: colors.background }}
      >
        No data available
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full ${className}`}
      style={{ height }}
    />
  );
}

export default LightweightCandlestickChart;
