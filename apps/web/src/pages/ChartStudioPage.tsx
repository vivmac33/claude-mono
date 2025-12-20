import React, { useState, useEffect, useMemo } from 'react';
import { AdvancedChart, type OHLCData } from '@/components/charts/AdvancedChart';
import { NavHeader } from '@/components/layout/NavHeader';
import { useTheme } from '@/components/ThemeProvider';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface ChartSlot {
  id: number;
  symbol: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

function generateOHLCData(symbol: string): OHLCData[] {
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) {
    seed += symbol.charCodeAt(i);
  }
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const basePrice = 500 + random() * 3000;
  const avgVolume = Math.floor(random() * 40e6) + 5e6;
  const series: OHLCData[] = [];
  let currentPrice = basePrice * 0.9;
  const now = new Date();

  for (let i = 89; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const volatility = 0.018;
    const drift = (random() - 0.48) * volatility;
    const open = currentPrice;
    const close = open * (1 + drift);
    const high = Math.max(open, close) * (1 + random() * volatility);
    const low = Math.min(open, close) * (1 - random() * volatility);
    const volume = avgVolume * (0.5 + random());

    series.push({
      date: date.toISOString().split('T')[0],
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume: Math.floor(volume),
    });

    currentPrice = close;
  }

  return series;
}

// ═══════════════════════════════════════════════════════════════════════════
// CHART SLOT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface ChartSlotProps {
  slot: ChartSlot;
  onSymbolChange: (id: number, symbol: string) => void;
  onClear: (id: number) => void;
}

function ChartSlotComponent({ slot, onSymbolChange, onClear }: ChartSlotProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [inputValue, setInputValue] = useState('');
  const [chartData, setChartData] = useState<OHLCData[] | null>(null);

  useEffect(() => {
    if (slot.symbol) {
      setChartData(generateOHLCData(slot.symbol));
    } else {
      setChartData(null);
    }
  }, [slot.symbol]);

  if (!slot.symbol) {
    return (
      <div className={`absolute inset-0 border border-dashed rounded-lg flex flex-col items-center justify-center p-4 ${
        isDark ? 'border-slate-700 bg-slate-900/30' : 'border-slate-300 bg-slate-50'
      }`}>
        <div className={`text-sm mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Add Symbol</div>
        <div className="flex gap-2 w-full max-w-xs">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue) {
                onSymbolChange(slot.id, inputValue);
                setInputValue('');
              }
            }}
            placeholder="e.g., TCS"
            className={`flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-indigo-500 ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500'
                : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
            }`}
          />
          <button
            onClick={() => {
              if (inputValue) {
                onSymbolChange(slot.id, inputValue);
                setInputValue('');
              }
            }}
            className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500"
          >
            +
          </button>
        </div>
        <div className="flex flex-wrap gap-1 mt-3 justify-center">
          {['TCS', 'INFY', 'RELIANCE', 'HDFCBANK'].map(s => (
            <button
              key={s}
              onClick={() => onSymbolChange(slot.id, s)}
              className={`px-2 py-1 rounded text-xs ${
                isDark 
                  ? 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 group">
      <button
        onClick={() => onClear(slot.id)}
        className={`absolute top-12 right-3 z-20 w-5 h-5 hover:bg-red-600 hover:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold ${
          isDark ? 'bg-slate-800/90 text-slate-400' : 'bg-slate-200/90 text-slate-500'
        }`}
        title="Remove chart"
      >
        ×
      </button>
      {chartData && (
        <AdvancedChart
          data={chartData}
          symbol={slot.symbol}
          showToolbar={true}
          showVolume={true}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PRESET GROUPS
// ═══════════════════════════════════════════════════════════════════════════

const PRESET_GROUPS = [
  { name: 'IT Sector', symbols: ['TCS', 'INFY', 'WIPRO', 'HCLTECH', 'LTIM', 'TECHM'] },
  { name: 'Banks', symbols: ['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK', 'AXISBANK'] },
  { name: 'FMCG', symbols: ['HINDUNILVR', 'ITC', 'NESTLEIND', 'TITAN'] },
  { name: 'Auto', symbols: ['MARUTI', 'TATAMOTORS'] },
  { name: 'Pharma', symbols: ['SUNPHARMA', 'DRREDDY'] },
];

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT DEFINITIONS - Using absolute positioning for guaranteed sizing
// ═══════════════════════════════════════════════════════════════════════════

interface LayoutCell {
  top: string;
  left: string;
  width: string;
  height: string;
}

function getLayoutCells(count: number): LayoutCell[] {
  const gap = 8; // px
  const gapPercent = 0.5; // approximate gap as percentage
  
  switch (count) {
    case 1:
      return [{ top: '0', left: '0', width: '100%', height: '100%' }];
    
    case 2:
      return [
        { top: '0', left: '0', width: `calc(50% - ${gap/2}px)`, height: '100%' },
        { top: '0', left: `calc(50% + ${gap/2}px)`, width: `calc(50% - ${gap/2}px)`, height: '100%' },
      ];
    
    case 3:
      return [
        { top: '0', left: '0', width: `calc(50% - ${gap/2}px)`, height: '100%' },
        { top: '0', left: `calc(50% + ${gap/2}px)`, width: `calc(50% - ${gap/2}px)`, height: `calc(50% - ${gap/2}px)` },
        { top: `calc(50% + ${gap/2}px)`, left: `calc(50% + ${gap/2}px)`, width: `calc(50% - ${gap/2}px)`, height: `calc(50% - ${gap/2}px)` },
      ];
    
    case 4:
      return [
        { top: '0', left: '0', width: `calc(50% - ${gap/2}px)`, height: `calc(50% - ${gap/2}px)` },
        { top: '0', left: `calc(50% + ${gap/2}px)`, width: `calc(50% - ${gap/2}px)`, height: `calc(50% - ${gap/2}px)` },
        { top: `calc(50% + ${gap/2}px)`, left: '0', width: `calc(50% - ${gap/2}px)`, height: `calc(50% - ${gap/2}px)` },
        { top: `calc(50% + ${gap/2}px)`, left: `calc(50% + ${gap/2}px)`, width: `calc(50% - ${gap/2}px)`, height: `calc(50% - ${gap/2}px)` },
      ];
    
    case 5:
      const w3 = `calc(33.333% - ${gap*2/3}px)`;
      const h2 = `calc(50% - ${gap/2}px)`;
      return [
        { top: '0', left: '0', width: w3, height: h2 },
        { top: '0', left: `calc(33.333% + ${gap/3}px)`, width: w3, height: h2 },
        { top: '0', left: `calc(66.666% + ${gap*2/3}px)`, width: w3, height: h2 },
        { top: `calc(50% + ${gap/2}px)`, left: '0', width: `calc(50% - ${gap/2}px)`, height: h2 },
        { top: `calc(50% + ${gap/2}px)`, left: `calc(50% + ${gap/2}px)`, width: `calc(50% - ${gap/2}px)`, height: h2 },
      ];
    
    case 6:
      const w6 = `calc(33.333% - ${gap*2/3}px)`;
      const h6 = `calc(50% - ${gap/2}px)`;
      return [
        { top: '0', left: '0', width: w6, height: h6 },
        { top: '0', left: `calc(33.333% + ${gap/3}px)`, width: w6, height: h6 },
        { top: '0', left: `calc(66.666% + ${gap*2/3}px)`, width: w6, height: h6 },
        { top: `calc(50% + ${gap/2}px)`, left: '0', width: w6, height: h6 },
        { top: `calc(50% + ${gap/2}px)`, left: `calc(33.333% + ${gap/3}px)`, width: w6, height: h6 },
        { top: `calc(50% + ${gap/2}px)`, left: `calc(66.666% + ${gap*2/3}px)`, width: w6, height: h6 },
      ];
    
    default:
      return [{ top: '0', left: '0', width: '100%', height: '100%' }];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN CHART STUDIO PAGE
// ═══════════════════════════════════════════════════════════════════════════

interface ChartStudioPageProps {
  initialSymbols?: string[];
}

export default function ChartStudioPage({ initialSymbols }: ChartStudioPageProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Default to 1 chart with TCS
  const [chartCount, setChartCount] = useState(1);
  const [slots, setSlots] = useState<ChartSlot[]>(() => {
    const initial = initialSymbols || ['TCS'];
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      symbol: initial[i] || null,
    }));
  });

  const activeSlots = useMemo(() => slots.slice(0, chartCount), [slots, chartCount]);
  const layoutCells = useMemo(() => getLayoutCells(chartCount), [chartCount]);

  const handleSymbolChange = (id: number, symbol: string) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, symbol } : s));
  };

  const handleClear = (id: number) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, symbol: null } : s));
  };

  const handlePresetLoad = (symbols: string[]) => {
    const count = Math.min(symbols.length, 6);
    setChartCount(count);
    setSlots(prev => prev.map((s, i) => ({ ...s, symbol: symbols[i] || null })));
  };

  const handleClearAll = () => {
    setSlots(prev => prev.map(s => ({ ...s, symbol: null })));
  };

  const filledCount = activeSlots.filter(s => s.symbol).length;

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      <NavHeader currentPage="charts" />

      {/* Top Bar - Fixed height */}
      <div className={`flex-shrink-0 px-4 py-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-300'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className={`text-lg font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Chart Studio</h1>
            <span className={`text-xs px-2 py-1 rounded ${isDark ? 'text-slate-500 bg-slate-800' : 'text-slate-600 bg-slate-200'}`}>
              {filledCount} / {chartCount} charts
            </span>
          </div>

          {/* Layout Selector */}
          <div className={`flex items-center gap-1 rounded-lg p-1 ${isDark ? 'bg-slate-800/50' : 'bg-slate-200'}`}>
            {[1, 2, 3, 4, 5, 6].map(count => (
              <button
                key={count}
                onClick={() => setChartCount(count)}
                className={`w-7 h-7 rounded flex items-center justify-center text-sm font-medium transition-all ${
                  chartCount === count
                    ? 'bg-indigo-600 text-white'
                    : isDark 
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300'
                }`}
                title={`${count} chart${count > 1 ? 's' : ''}`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Presets Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-xs text-slate-500">Quick Load:</span>
          {PRESET_GROUPS.map(group => (
            <button
              key={group.name}
              onClick={() => handlePresetLoad(group.symbols)}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
            >
              {group.name}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={handleClearAll}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-400 rounded-md transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Chart Grid Container - Takes all remaining space */}
      <div className="flex-1 p-2 relative">
        {activeSlots.map((slot, index) => {
          const cell = layoutCells[index];
          return (
            <div
              key={slot.id}
              className="absolute"
              style={{
                top: cell.top,
                left: cell.left,
                width: cell.width,
                height: cell.height,
              }}
            >
              <ChartSlotComponent
                slot={slot}
                onSymbolChange={handleSymbolChange}
                onClear={handleClear}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
