// ═══════════════════════════════════════════════════════════════════════════
// NODE PREVIEW
// Tooltip showing card preview data on hover
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import type { WorkflowNode, CardNodeData } from './types';
import { CATEGORIES } from '@/registry/cardRegistry';

interface NodePreviewProps {
  node: WorkflowNode;
  result?: any;
  position: { x: number; y: number };
}

export function NodePreview({ node, result, position }: NodePreviewProps) {
  const data = node.data as CardNodeData;
  const category = CATEGORIES.find(c => c.id === data.category);
  const categoryColor = category?.color || '#64748b';
  
  // Don't render if position would be off-screen
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 320),
    y: Math.min(position.y, window.innerHeight - 300),
  };
  
  return (
    <div
      className="fixed z-50 w-72 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl 
        overflow-hidden animate-fade-in pointer-events-none"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      {/* Header */}
      <div 
        className="px-3 py-2 border-b border-slate-700"
        style={{ backgroundColor: `${categoryColor}15` }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: categoryColor }}
          />
          <span className="font-medium text-sm text-slate-200">{data.label}</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5">{data.description}</div>
      </div>
      
      {/* Content */}
      <div className="p-3">
        {/* Symbol */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-slate-500">Symbol:</span>
          <span className="text-sm font-mono font-bold text-teal-400 bg-teal-500/20 px-2 py-0.5 rounded">
            {data.symbol || 'Not set'}
          </span>
        </div>
        
        {/* Status - only show when not idle */}
        {data.status && data.status !== 'idle' && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-slate-500">Status:</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
              ${data.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                data.status === 'error' ? 'bg-red-500/20 text-red-400' :
                data.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                'bg-slate-700 text-slate-400'
              }`}
            >
              {data.status}
            </span>
          </div>
        )}
        
        {/* Result Preview */}
        {result && (
          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="text-[10px] uppercase text-slate-500 mb-2">Sample Output</div>
            <div className="text-xs text-slate-300 font-mono bg-slate-900/50 rounded p-2 max-h-32 overflow-y-auto">
              {renderResultPreview(result)}
            </div>
          </div>
        )}
        
        {/* No Result Yet */}
        {!result && data.status === 'idle' && (
          <div className="text-xs text-slate-500 text-center py-4">
            Run the workflow to see results
          </div>
        )}
        
        {/* Error */}
        {data.error && (
          <div className="mt-3 p-2 bg-red-500/10 rounded-lg">
            <div className="text-xs text-red-400">{data.error}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to render result preview
function renderResultPreview(result: any): React.ReactNode {
  if (!result) return 'No data';
  
  // Extract key metrics based on common patterns
  const metrics: { label: string; value: any }[] = [];
  
  // Try to find score or rating
  if (result.score !== undefined) {
    metrics.push({ label: 'Score', value: result.score });
  }
  if (result.rating !== undefined) {
    metrics.push({ label: 'Rating', value: result.rating });
  }
  if (result.signal !== undefined) {
    metrics.push({ label: 'Signal', value: result.signal });
  }
  
  // Try to find valuation metrics
  if (result.fairValue !== undefined || result.fairValueNow !== undefined) {
    metrics.push({ label: 'Fair Value', value: `₹${(result.fairValue || result.fairValueNow).toFixed(2)}` });
  }
  if (result.currentPrice !== undefined) {
    metrics.push({ label: 'Price', value: `₹${result.currentPrice.toFixed(2)}` });
  }
  if (result.upside !== undefined) {
    metrics.push({ label: 'Upside', value: `${result.upside > 0 ? '+' : ''}${result.upside.toFixed(1)}%` });
  }
  
  // Try to find growth metrics
  if (result.revenueGrowth !== undefined) {
    metrics.push({ label: 'Revenue Growth', value: `${result.revenueGrowth.toFixed(1)}%` });
  }
  if (result.earningsGrowth !== undefined) {
    metrics.push({ label: 'Earnings Growth', value: `${result.earningsGrowth.toFixed(1)}%` });
  }
  
  // Try to find risk metrics
  if (result.riskScore !== undefined) {
    metrics.push({ label: 'Risk Score', value: result.riskScore });
  }
  if (result.volatility !== undefined) {
    metrics.push({ label: 'Volatility', value: `${(result.volatility * 100).toFixed(1)}%` });
  }
  
  if (metrics.length > 0) {
    return (
      <div className="space-y-1">
        {metrics.slice(0, 5).map((m, i) => (
          <div key={i} className="flex justify-between">
            <span className="text-slate-500">{m.label}:</span>
            <span className="text-slate-200">{m.value}</span>
          </div>
        ))}
      </div>
    );
  }
  
  // Fallback: show truncated JSON
  const jsonStr = JSON.stringify(result, null, 2);
  return jsonStr.slice(0, 200) + (jsonStr.length > 200 ? '...' : '');
}

export default NodePreview;
