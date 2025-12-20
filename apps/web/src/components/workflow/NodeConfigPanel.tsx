// ═══════════════════════════════════════════════════════════════════════════
// NODE CONFIGURATION PANEL
// Slide-out panel for configuring selected node parameters
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback } from 'react';
import type { Node } from '@xyflow/react';
import type { CardNodeData } from './types';
import { getCardById, CATEGORIES } from '@/registry/cardRegistry';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  node: Node<CardNodeData> | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: Partial<CardNodeData>) => void;
  onDelete: (nodeId: string) => void;
  symbols: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD PARAMETER SCHEMAS
// Define configurable parameters per card type
// ─────────────────────────────────────────────────────────────────────────────

interface ParamSchema {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'range';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  default?: any;
  description?: string;
}

// Generic parameters that apply to most cards
const COMMON_PARAMS: ParamSchema[] = [
  {
    key: 'timeframe',
    label: 'Timeframe',
    type: 'select',
    options: ['1D', '1W', '1M', '3M', '6M', '1Y', '3Y', '5Y', 'MAX'],
    default: '1Y',
    description: 'Analysis period',
  },
  {
    key: 'benchmark',
    label: 'Benchmark',
    type: 'select',
    options: ['NIFTY50', 'NIFTY100', 'SENSEX', 'NIFTYBANK', 'Sector', 'None'],
    default: 'NIFTY50',
    description: 'Comparison benchmark',
  },
];

// Category-specific parameters
const CATEGORY_PARAMS: Record<string, ParamSchema[]> = {
  value: [
    { key: 'discountRate', label: 'Discount Rate', type: 'range', min: 8, max: 20, step: 0.5, default: 12, description: 'WACC for DCF' },
    { key: 'growthRate', label: 'Terminal Growth', type: 'range', min: 1, max: 8, step: 0.5, default: 3, description: 'Perpetual growth rate' },
    { key: 'marginOfSafety', label: 'Margin of Safety', type: 'range', min: 10, max: 50, step: 5, default: 25, description: 'Required safety margin %' },
  ],
  technical: [
    { key: 'emaShort', label: 'Short EMA', type: 'number', min: 5, max: 50, default: 12, description: 'Short-term EMA period' },
    { key: 'emaLong', label: 'Long EMA', type: 'number', min: 20, max: 200, default: 26, description: 'Long-term EMA period' },
    { key: 'rsiPeriod', label: 'RSI Period', type: 'number', min: 7, max: 21, default: 14, description: 'RSI calculation period' },
    { key: 'showVolume', label: 'Show Volume', type: 'boolean', default: true, description: 'Display volume bars' },
  ],
  risk: [
    { key: 'confidence', label: 'Confidence Level', type: 'select', options: ['90%', '95%', '99%'], default: '95%', description: 'VaR confidence' },
    { key: 'lookback', label: 'Lookback Period', type: 'select', options: ['1M', '3M', '6M', '1Y'], default: '1Y', description: 'Historical data period' },
  ],
  growth: [
    { key: 'periods', label: 'Comparison Periods', type: 'select', options: ['QoQ', 'YoY', '3Y CAGR', '5Y CAGR'], default: 'YoY', description: 'Growth comparison' },
  ],
  macro: [
    { key: 'includeNews', label: 'Include News', type: 'boolean', default: true, description: 'Show related news' },
    { key: 'filingTypes', label: 'Filing Types', type: 'select', options: ['All', 'Quarterly', 'Annual', 'Shareholding'], default: 'All' },
  ],
  portfolio: [
    { key: 'rebalanceFreq', label: 'Rebalance Frequency', type: 'select', options: ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'], default: 'Quarterly' },
    { key: 'targetAllocation', label: 'Show Targets', type: 'boolean', default: true, description: 'Display target allocations' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function NodeConfigPanel({ node, onClose, onUpdate, onDelete, symbols }: Props) {
  const [localParams, setLocalParams] = useState<Record<string, any>>({});
  const [localSymbol, setLocalSymbol] = useState('');
  const [labelOverride, setLabelOverride] = useState('');
  
  // Initialize local state when node changes
  useEffect(() => {
    if (node) {
      setLocalParams(node.data.params || {});
      setLocalSymbol(node.data.symbol || symbols[0] || '');
      setLabelOverride(node.data.labelOverride || '');
    }
  }, [node, symbols]);
  
  if (!node) return null;
  
  const card = getCardById(node.data.cardId);
  const category = CATEGORIES.find(c => c.id === node.data.category);
  const categoryColor = category?.color || '#64748b';
  
  // Get parameters for this card
  const categoryParams = CATEGORY_PARAMS[node.data.category] || [];
  const allParams = [...COMMON_PARAMS, ...categoryParams];
  
  // Handle parameter change
  const handleParamChange = (key: string, value: any) => {
    setLocalParams(prev => ({ ...prev, [key]: value }));
  };
  
  // Save changes
  const handleSave = () => {
    onUpdate(node.id, {
      params: localParams,
      symbol: localSymbol,
      labelOverride: labelOverride || undefined,
    });
    onClose();
  };
  
  // Render parameter input
  const renderParamInput = (param: ParamSchema) => {
    const value = localParams[param.key] ?? param.default;
    
    switch (param.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleParamChange(param.key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 
              text-slate-200 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
          >
            {param.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
        
      case 'number':
        return (
          <input
            type="number"
            value={value}
            min={param.min}
            max={param.max}
            onChange={(e) => handleParamChange(param.key, Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 
              text-slate-200 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
          />
        );
        
      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              value={value}
              min={param.min}
              max={param.max}
              step={param.step}
              onChange={(e) => handleParamChange(param.key, Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer
                bg-slate-700 accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>{param.min}</span>
              <span className="text-indigo-400 font-medium">{value}{param.key.includes('Rate') || param.key.includes('Safety') ? '%' : ''}</span>
              <span>{param.max}</span>
            </div>
          </div>
        );
        
      case 'boolean':
        return (
          <button
            onClick={() => handleParamChange(param.key, !value)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200
              ${value ? 'bg-indigo-600' : 'bg-slate-700'}`}
          >
            <span 
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200
                ${value ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        );
        
      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleParamChange(param.key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 
              text-slate-200 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
          />
        );
    }
  };
  
  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-slate-900/95 backdrop-blur-xl
      border-l border-slate-700/50 shadow-2xl z-50 flex flex-col animate-slide-up">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">Configure Node</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Card Info */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            {card?.icon || '📊'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white truncate">{node.data.label}</div>
            <div 
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: categoryColor }}
            >
              {node.data.category}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Symbol Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">
            Symbol
          </label>
          <select
            value={localSymbol}
            onChange={(e) => setLocalSymbol(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 
              text-slate-200 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
          >
            {symbols.map(sym => (
              <option key={sym} value={sym}>{sym}</option>
            ))}
          </select>
          <p className="text-[10px] text-slate-500">Select which symbol this node analyzes</p>
        </div>
        
        {/* Custom Label */}
        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">
            Custom Label (Optional)
          </label>
          <input
            type="text"
            value={labelOverride}
            onChange={(e) => setLabelOverride(e.target.value)}
            placeholder={node.data.label}
            className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 
              text-slate-200 text-sm focus:border-indigo-500 focus:outline-none transition-colors
              placeholder-slate-600"
          />
          <p className="text-[10px] text-slate-500">Override the default card name in your workflow</p>
        </div>
        
        {/* Divider */}
        <div className="border-t border-slate-700/50 pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Parameters
          </h4>
        </div>
        
        {/* Parameters */}
        {allParams.map(param => (
          <div key={param.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">
                {param.label}
              </label>
              {param.type === 'boolean' && renderParamInput(param)}
            </div>
            {param.type !== 'boolean' && renderParamInput(param)}
            {param.description && (
              <p className="text-[10px] text-slate-500">{param.description}</p>
            )}
          </div>
        ))}
        
        {/* Node Status */}
        {node.data.status && node.data.status !== 'idle' && (
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
              Last Run Status
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                node.data.status === 'success' ? 'bg-emerald-500' :
                node.data.status === 'error' ? 'bg-red-500' :
                node.data.status === 'running' ? 'bg-blue-500 animate-pulse' :
                'bg-slate-500'
              }`} />
              <span className="text-sm text-slate-300 capitalize">{node.data.status}</span>
            </div>
            {node.data.error && (
              <div className="mt-2 text-xs text-red-400 bg-red-500/10 rounded p-2">
                {node.data.error}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 
              text-white text-sm font-medium transition-colors"
          >
            Apply Changes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 
              text-slate-300 text-sm font-medium transition-colors border border-slate-700"
          >
            Cancel
          </button>
        </div>
        
        <button
          onClick={() => {
            onDelete(node.id);
            onClose();
          }}
          className="w-full px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 
            text-red-400 text-sm font-medium transition-colors border border-red-500/30"
        >
          🗑️ Delete Node
        </button>
      </div>
    </div>
  );
}

export default NodeConfigPanel;
