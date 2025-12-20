// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOW VALIDATION
// Pre-run validation warnings and checks
// ═══════════════════════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import type { WorkflowNode, WorkflowEdge } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  id: string;
  severity: ValidationSeverity;
  title: string;
  message: string;
  icon: string;
  nodeIds?: string[];
  canProceed: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  canProceed: boolean;
  issues: ValidationIssue[];
  stats: {
    errors: number;
    warnings: number;
    info: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION LOGIC
// ─────────────────────────────────────────────────────────────────────────────

export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  symbols: string[]
): ValidationResult {
  const issues: ValidationIssue[] = [];
  
  // Check: No nodes
  if (nodes.length === 0) {
    issues.push({
      id: 'no-nodes',
      severity: 'error',
      title: 'Empty Workflow',
      message: 'Add at least one card to your workflow before running.',
      icon: '📋',
      canProceed: false,
    });
  }
  
  // Check: No symbols
  if (symbols.length === 0) {
    issues.push({
      id: 'no-symbols',
      severity: 'error',
      title: 'No Symbol Selected',
      message: 'Enter at least one stock symbol to analyze.',
      icon: '🏷️',
      canProceed: false,
    });
  }
  
  // Check: Disconnected nodes (only if we have multiple nodes)
  if (nodes.length > 1) {
    const connectedNodeIds = new Set<string>();
    
    // Build set of all connected nodes
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });
    
    // Find disconnected nodes
    const disconnectedNodes = nodes.filter(node => !connectedNodeIds.has(node.id));
    
    if (disconnectedNodes.length > 0 && disconnectedNodes.length < nodes.length) {
      issues.push({
        id: 'disconnected-nodes',
        severity: 'warning',
        title: `${disconnectedNodes.length} Disconnected Card${disconnectedNodes.length > 1 ? 's' : ''}`,
        message: `Some cards aren't connected to the workflow. They'll still run, but won't receive data from other cards.`,
        icon: '🔌',
        nodeIds: disconnectedNodes.map(n => n.id),
        canProceed: true,
      });
    }
  }
  
  // Check: No edges at all (when multiple nodes exist)
  if (nodes.length > 1 && edges.length === 0) {
    issues.push({
      id: 'no-connections',
      severity: 'warning',
      title: 'No Connections',
      message: 'Your cards aren\'t connected. Each card will run independently without data flow.',
      icon: '🔗',
      canProceed: true,
    });
  }
  
  // Check: Orphan condition/merge nodes
  const logicNodes = nodes.filter(n => n.type === 'condition' || n.type === 'merge');
  logicNodes.forEach(node => {
    const hasInput = edges.some(e => e.target === node.id);
    const hasOutput = edges.some(e => e.source === node.id);
    
    if (!hasInput || !hasOutput) {
      issues.push({
        id: `orphan-logic-${node.id}`,
        severity: 'warning',
        title: `${node.type === 'condition' ? 'Condition' : 'Merge'} Node Not Connected`,
        message: `The ${node.data.label || node.type} node needs both input and output connections to function.`,
        icon: node.type === 'condition' ? '⚡' : '🔀',
        nodeIds: [node.id],
        canProceed: true,
      });
    }
  });
  
  // Check: Large workflow warning
  if (nodes.length > 10) {
    issues.push({
      id: 'large-workflow',
      severity: 'info',
      title: 'Large Workflow',
      message: `Running ${nodes.length} cards across ${symbols.length} symbol${symbols.length > 1 ? 's' : ''} may take a moment.`,
      icon: '⏱️',
      canProceed: true,
    });
  }
  
  // Check: Multiple symbols info
  if (symbols.length > 1) {
    issues.push({
      id: 'multi-symbol',
      severity: 'info',
      title: 'Multi-Symbol Analysis',
      message: `Will analyze ${symbols.length} symbols: ${symbols.join(', ')}`,
      icon: '📊',
      canProceed: true,
    });
  }
  
  // Calculate stats
  const stats = {
    errors: issues.filter(i => i.severity === 'error').length,
    warnings: issues.filter(i => i.severity === 'warning').length,
    info: issues.filter(i => i.severity === 'info').length,
  };
  
  // Determine if workflow can run
  const hasBlockingError = issues.some(i => !i.canProceed);
  
  return {
    isValid: issues.length === 0,
    canProceed: !hasBlockingError,
    issues,
    stats,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION MODAL
// ─────────────────────────────────────────────────────────────────────────────

interface ValidationModalProps {
  isOpen: boolean;
  validation: ValidationResult;
  onClose: () => void;
  onProceed: () => void;
}

export function ValidationModal({ 
  isOpen, 
  validation, 
  onClose, 
  onProceed 
}: ValidationModalProps) {
  if (!isOpen) return null;
  
  const severityConfig = {
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: '❌',
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      icon: '⚠️',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: 'ℹ️',
    },
  };
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl 
        w-full max-w-lg mx-4 overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center text-xl
                ${validation.canProceed 
                  ? 'bg-amber-500/20 text-amber-400' 
                  : 'bg-red-500/20 text-red-400'
                }
              `}>
                {validation.canProceed ? '⚠️' : '🛑'}
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  {validation.canProceed ? 'Review Before Running' : 'Cannot Run Workflow'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {validation.stats.errors > 0 && `${validation.stats.errors} error${validation.stats.errors > 1 ? 's' : ''}`}
                  {validation.stats.errors > 0 && validation.stats.warnings > 0 && ' • '}
                  {validation.stats.warnings > 0 && `${validation.stats.warnings} warning${validation.stats.warnings > 1 ? 's' : ''}`}
                  {(validation.stats.errors > 0 || validation.stats.warnings > 0) && validation.stats.info > 0 && ' • '}
                  {validation.stats.info > 0 && `${validation.stats.info} note${validation.stats.info > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Issues List */}
        <div className="px-6 py-4 max-h-[400px] overflow-y-auto space-y-3">
          {validation.issues.map(issue => {
            const config = severityConfig[issue.severity];
            return (
              <div
                key={issue.id}
                className={`
                  p-4 rounded-xl border ${config.bg} ${config.border}
                  transition-all duration-200
                `}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{issue.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-medium text-sm ${config.text}`}>
                        {issue.title}
                      </h4>
                      <span className={`
                        text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded
                        ${config.bg} ${config.text}
                      `}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {issue.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-800/30 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium
              bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white
              transition-colors"
          >
            {validation.canProceed ? 'Cancel' : 'Go Back'}
          </button>
          
          {validation.canProceed && (
            <button
              onClick={onProceed}
              className="px-4 py-2 rounded-lg text-sm font-medium
                bg-indigo-600 text-white hover:bg-indigo-500
                transition-colors flex items-center gap-2"
            >
              <span>▶️</span>
              <span>Run Anyway</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INLINE VALIDATION BADGE
// Shows quick validation status in toolbar
// ─────────────────────────────────────────────────────────────────────────────

interface ValidationBadgeProps {
  validation: ValidationResult;
  onClick: () => void;
}

export function ValidationBadge({ validation, onClick }: ValidationBadgeProps) {
  if (validation.isValid) return null;
  
  const { errors, warnings } = validation.stats;
  
  if (errors === 0 && warnings === 0) return null;
  
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium
        transition-all duration-200 hover:scale-105
        ${errors > 0 
          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }
      `}
      title="Click to see validation details"
    >
      <span>{errors > 0 ? '❌' : '⚠️'}</span>
      <span>
        {errors > 0 ? `${errors} issue${errors > 1 ? 's' : ''}` : `${warnings} warning${warnings > 1 ? 's' : ''}`}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK FOR VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

export function useWorkflowValidation(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  symbols: string[]
) {
  const validation = useMemo(
    () => validateWorkflow(nodes, edges, symbols),
    [nodes, edges, symbols]
  );
  
  return validation;
}

export default ValidationModal;
