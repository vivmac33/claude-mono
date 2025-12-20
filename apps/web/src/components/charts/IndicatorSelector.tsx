// ═══════════════════════════════════════════════════════════════════════════
// INDICATOR SELECTOR COMPONENT
// Mix-and-match indicators from combos
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import {
  INDICATOR_COMBOS,
  CATEGORY_META,
  type ComboCategory,
  type IndicatorCombo,
  type IndicatorDef,
} from '@/lib/indicatorCombos';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ActiveIndicator extends IndicatorDef {
  enabled: boolean;
  fromCombo?: string;
}

interface IndicatorSelectorProps {
  activeIndicators: ActiveIndicator[];
  onIndicatorsChange: (indicators: ActiveIndicator[]) => void;
  maxIndicators?: number;
  onClose?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMBO CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface ComboCardProps {
  combo: IndicatorCombo;
  isSelected: boolean;
  selectedIndicators: string[];
  onIndicatorToggle: (indicator: IndicatorDef, comboId: string) => void;
}

function ComboCard({ combo, isSelected, selectedIndicators, onIndicatorToggle }: ComboCardProps) {
  const [isExpanded, setIsExpanded] = useState(isSelected);
  const categoryMeta = CATEGORY_META[combo.category];
  
  const selectedCount = combo.indicators.filter(i => selectedIndicators.includes(i.id)).length;
  const allSelected = selectedCount === combo.indicators.length;

  // Apply all indicators from this combo
  const handleApplyAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    combo.indicators.forEach(indicator => {
      if (!selectedIndicators.includes(indicator.id)) {
        onIndicatorToggle(indicator, combo.id);
      }
    });
  };

  // Remove all indicators from this combo
  const handleRemoveAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    combo.indicators.forEach(indicator => {
      if (selectedIndicators.includes(indicator.id)) {
        onIndicatorToggle(indicator, combo.id);
      }
    });
  };

  return (
    <div 
      className={`border rounded-lg overflow-hidden transition-all ${
        isSelected 
          ? 'border-indigo-500 bg-indigo-950/30' 
          : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
      }`}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <span className="text-lg">{categoryMeta.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-100 truncate">{combo.name}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
              combo.difficulty === 'beginner' ? 'bg-green-900/50 text-green-400' :
              combo.difficulty === 'intermediate' ? 'bg-amber-900/50 text-amber-400' :
              'bg-red-900/50 text-red-400'
            }`}>
              {combo.difficulty}
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate">{combo.description}</p>
        </div>
        {selectedCount > 0 && (
          <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
            {selectedCount}/{combo.indicators.length}
          </span>
        )}
        <svg 
          className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-slate-700/50">
          {/* Signal Logic */}
          <div className="pt-2">
            <div className="text-[10px] text-slate-500 uppercase mb-1">Signal Logic</div>
            <p className="text-xs text-slate-300">{combo.signalLogic}</p>
          </div>

          {/* Best For & Timeframe */}
          <div className="flex gap-4 text-xs flex-wrap">
            <div>
              <span className="text-slate-500">Best for: </span>
              <span className="text-slate-300">{combo.bestFor}</span>
            </div>
            <div>
              <span className="text-slate-500">Timeframe: </span>
              <span className="text-teal-400">{combo.timeframe}</span>
            </div>
          </div>

          {/* Indicators */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] text-slate-500 uppercase">Indicators (click to add/remove)</div>
              {/* Apply All / Remove All buttons */}
              <div className="flex items-center gap-2">
                {!allSelected && (
                  <button
                    onClick={handleApplyAll}
                    className="px-2 py-1 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
                  >
                    Apply All
                  </button>
                )}
                {selectedCount > 0 && (
                  <button
                    onClick={handleRemoveAll}
                    className="px-2 py-1 text-[10px] bg-slate-700 hover:bg-red-900/50 text-slate-300 hover:text-red-400 rounded transition-colors"
                  >
                    Remove All
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {combo.indicators.map(indicator => {
                const isActive = selectedIndicators.includes(indicator.id);
                return (
                  <button
                    key={indicator.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onIndicatorToggle(indicator, combo.id);
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: indicator.color }}
                    />
                    <span>{indicator.shortName}</span>
                    {isActive && <span>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTIVE INDICATORS PANEL
// ═══════════════════════════════════════════════════════════════════════════

interface ActiveIndicatorsPanelProps {
  indicators: ActiveIndicator[];
  onRemove: (id: string) => void;
  onSettingsClick: (indicator: ActiveIndicator) => void;
  maxIndicators: number;
}

function ActiveIndicatorsPanel({ indicators, onRemove, onSettingsClick, maxIndicators }: ActiveIndicatorsPanelProps) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-200">Active Indicators</span>
        <span className={`text-xs ${indicators.length >= maxIndicators ? 'text-amber-400' : 'text-slate-500'}`}>
          {indicators.length}/{maxIndicators} max
        </span>
      </div>
      
      {indicators.length === 0 ? (
        <p className="text-xs text-slate-500 py-2">
          Select indicators from combos below
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {indicators.map(ind => (
            <div
              key={ind.id}
              className="flex items-center gap-1 px-2 py-1 bg-slate-700 rounded-md text-xs group"
            >
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: ind.color }}
              />
              <span className="text-slate-200">{ind.shortName}</span>
              {ind.params && Object.keys(ind.params).length > 0 && (
                <button
                  onClick={() => onSettingsClick(ind)}
                  className="text-slate-500 hover:text-white"
                  title="Settings"
                >
                  ⚙️
                </button>
              )}
              <button
                onClick={() => onRemove(ind.id)}
                className="text-slate-500 hover:text-red-400 ml-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// INDICATOR SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════════════════

interface IndicatorSettingsProps {
  indicator: ActiveIndicator;
  onSave: (indicator: ActiveIndicator) => void;
  onClose: () => void;
}

function IndicatorSettingsModal({ indicator, onSave, onClose }: IndicatorSettingsProps) {
  const [config, setConfig] = useState<ActiveIndicator>({ ...indicator });

  const handleParamChange = (key: string, value: number) => {
    setConfig(prev => ({
      ...prev,
      params: { ...prev.params, [key]: value },
    }));
  };

  const paramLabels: Record<string, string> = {
    period: 'Period',
    fast: 'Fast Period',
    slow: 'Slow Period',
    signal: 'Signal Period',
    stdDev: 'Std Deviation',
    multiplier: 'Multiplier',
    k: 'K Period',
    d: 'D Period',
    smooth: 'Smoothing',
    step: 'Step',
    max: 'Max',
    atrMult: 'ATR Multiplier',
    threshold: 'Threshold',
    tenkan: 'Tenkan Period',
    kijun: 'Kijun Period',
    senkou: 'Senkou Period',
    period1: 'Period 1',
    period2: 'Period 2',
    period3: 'Period 3',
    bbPeriod: 'BB Period',
    kcPeriod: 'KC Period',
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-slate-800 border border-slate-700 rounded-xl p-4 w-80 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: indicator.color }} />
            <h3 className="text-sm font-semibold text-slate-100">{indicator.name} Settings</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-3">
          {Object.entries(config.params).map(([key, value]) => (
            <div key={key}>
              <label className="text-xs text-slate-400 block mb-1">{paramLabels[key] || key}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleParamChange(key, parseFloat(e.target.value) || 0)}
                min={key.includes('std') || key === 'step' ? 0.1 : 1}
                max={key.includes('std') ? 5 : key === 'max' ? 1 : 500}
                step={key.includes('std') || key === 'step' || key === 'max' ? 0.01 : 1}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white"
              />
            </div>
          ))}

          <div>
            <label className="text-xs text-slate-400 block mb-1">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.color}
                onChange={(e) => setConfig(prev => ({ ...prev, color: e.target.value }))}
                className="w-8 h-8 rounded border border-slate-600 cursor-pointer"
              />
              <input
                type="text"
                value={config.color}
                onChange={(e) => setConfig(prev => ({ ...prev, color: e.target.value }))}
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-3 py-1.5 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600">
            Cancel
          </button>
          <button onClick={() => { onSave(config); onClose(); }} className="flex-1 px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-500">
            Apply
          </button>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function IndicatorSelector({
  activeIndicators,
  onIndicatorsChange,
  maxIndicators = 5,
  onClose,
}: IndicatorSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<ComboCategory | 'all'>('all');
  const [editingIndicator, setEditingIndicator] = useState<ActiveIndicator | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCombos = useMemo(() => {
    let combos = selectedCategory === 'all' 
      ? INDICATOR_COMBOS 
      : INDICATOR_COMBOS.filter(c => c.category === selectedCategory);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      combos = combos.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.indicators.some(i => i.name.toLowerCase().includes(query))
      );
    }
    
    return combos;
  }, [selectedCategory, searchQuery]);

  const selectedIndicatorIds = activeIndicators.map(i => i.id);

  const handleIndicatorToggle = (indicator: IndicatorDef, comboId: string) => {
    const isActive = selectedIndicatorIds.includes(indicator.id);
    
    if (isActive) {
      onIndicatorsChange(activeIndicators.filter(i => i.id !== indicator.id));
    } else {
      if (activeIndicators.length < maxIndicators) {
        onIndicatorsChange([
          ...activeIndicators,
          { ...indicator, enabled: true, fromCombo: comboId },
        ]);
      }
    }
  };

  const handleRemove = (id: string) => {
    onIndicatorsChange(activeIndicators.filter(i => i.id !== id));
  };

  const handleSettingsSave = (updated: ActiveIndicator) => {
    onIndicatorsChange(activeIndicators.map(i => i.id === updated.id ? updated : i));
  };

  const combosWithSelections = new Set(
    activeIndicators.filter(i => i.fromCombo).map(i => i.fromCombo)
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Indicator Combos</h2>
          <p className="text-xs text-slate-500">Select up to {maxIndicators} indicators from any combo</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">✕</button>
        )}
      </div>

      {/* Active Indicators */}
      <div className="px-4 py-3 border-b border-slate-700">
        <ActiveIndicatorsPanel
          indicators={activeIndicators}
          onRemove={handleRemove}
          onSettingsClick={setEditingIndicator}
          maxIndicators={maxIndicators}
        />
      </div>

      {/* Search & Categories */}
      <div className="px-4 py-3 border-b border-slate-700 space-y-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search combos or indicators..."
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
        />

        {/* Scrollable category tabs */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
          <div className="flex gap-1 pb-1 min-w-max">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2 py-1 rounded-md text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            {(Object.keys(CATEGORY_META) as ComboCategory[]).map(cat => {
              const meta = CATEGORY_META[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
                    selectedCategory === cat
                      ? 'text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  style={selectedCategory === cat ? { backgroundColor: meta.color } : {}}
                >
                  <span>{meta.icon}</span>
                  <span>{meta.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Combo List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Individual Indicators Quick Add */}
        <div className="border border-slate-700 rounded-lg p-3 bg-slate-800/30">
          <div className="text-[10px] text-slate-500 uppercase mb-2">Quick Add Individual Indicators</div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'sma20', name: 'SMA 20', shortName: 'SMA20', color: '#3b82f6', params: { period: 20 }, type: 'overlay' as const },
              { id: 'sma50', name: 'SMA 50', shortName: 'SMA50', color: '#f59e0b', params: { period: 50 }, type: 'overlay' as const },
              { id: 'sma200', name: 'SMA 200', shortName: 'SMA200', color: '#10b981', params: { period: 200 }, type: 'overlay' as const },
              { id: 'ema9', name: 'EMA 9', shortName: 'EMA9', color: '#ec4899', params: { period: 9 }, type: 'overlay' as const },
              { id: 'ema21', name: 'EMA 21', shortName: 'EMA21', color: '#8b5cf6', params: { period: 21 }, type: 'overlay' as const },
              { id: 'vwap', name: 'VWAP', shortName: 'VWAP', color: '#14b8a6', params: {}, type: 'overlay' as const },
              { id: 'rsi', name: 'RSI 14', shortName: 'RSI', color: '#f97316', params: { period: 14 }, type: 'pane' as const },
              { id: 'macd', name: 'MACD', shortName: 'MACD', color: '#84cc16', params: { fast: 12, slow: 26, signal: 9 }, type: 'pane' as const },
              { id: 'bb', name: 'Bollinger Bands', shortName: 'BB', color: '#6366f1', params: { period: 20, stdDev: 2 }, type: 'overlay' as const },
              { id: 'supertrend', name: 'Supertrend', shortName: 'ST', color: '#22c55e', params: { period: 10, multiplier: 3 }, type: 'overlay' as const },
              { id: 'atr', name: 'ATR 14', shortName: 'ATR', color: '#ef4444', params: { period: 14 }, type: 'pane' as const },
              { id: 'stoch', name: 'Stochastic', shortName: 'STOCH', color: '#06b6d4', params: { k: 14, d: 3, smooth: 3 }, type: 'pane' as const },
            ].map(ind => {
              const isActive = selectedIndicatorIds.includes(ind.id);
              return (
                <button
                  key={ind.id}
                  onClick={() => handleIndicatorToggle(ind, 'individual')}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ind.color }} />
                  <span>{ind.shortName}</span>
                  {isActive && <span>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Combo Cards */}
        {filteredCombos.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No combos found matching "{searchQuery}"
          </div>
        ) : (
          filteredCombos.map(combo => (
            <ComboCard
              key={combo.id}
              combo={combo}
              isSelected={combosWithSelections.has(combo.id)}
              selectedIndicators={selectedIndicatorIds}
              onIndicatorToggle={handleIndicatorToggle}
            />
          ))
        )}
      </div>

      {/* Settings Modal */}
      {editingIndicator && (
        <IndicatorSettingsModal
          indicator={editingIndicator}
          onSave={handleSettingsSave}
          onClose={() => setEditingIndicator(null)}
        />
      )}
    </div>
  );
}

export default IndicatorSelector;
