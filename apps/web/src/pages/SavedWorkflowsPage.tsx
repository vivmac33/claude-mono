// ═══════════════════════════════════════════════════════════════════════════
// SAVED WORKFLOWS PAGE
// View and manage saved workflows
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { NavHeader } from '@/components/layout/NavHeader';
import { useTheme } from '@/components/ThemeProvider';

export default function SavedWorkflowsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { savedWorkflows, deleteWorkflow } = useUserStore();

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <NavHeader currentPage="workflow" />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Link */}
        <a 
          href="#/workflow" 
          className={`inline-flex items-center gap-2 text-sm mb-6 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Workflow Builder
        </a>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Saved Workflows</h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {savedWorkflows.length} workflow{savedWorkflows.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <a href="#/workflow">
            <Button variant="primary" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Workflow
            </Button>
          </a>
        </div>

        {/* Workflows List */}
        <WorkflowsList 
          workflows={savedWorkflows} 
          onDelete={deleteWorkflow}
          isDark={isDark}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOWS LIST COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface WorkflowsListProps {
  workflows: ReturnType<typeof useUserStore>['savedWorkflows'];
  onDelete: (id: string) => void;
  isDark: boolean;
}

function WorkflowsList({ workflows, onDelete, isDark }: WorkflowsListProps) {
  if (workflows.length === 0) {
    return (
      <div className="text-center py-16">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <svg className={`w-10 h-10 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No saved workflows yet</h2>
        <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Create a workflow in the builder and save it to access it here.
        </p>
        <a href="#/workflow">
          <Button variant="primary">Create Your First Workflow</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {workflows.map(workflow => (
        <div
          key={workflow.id}
          className={`rounded-xl border p-4 transition-colors ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{workflow.name}</h3>
                {workflow.stats && workflow.stats.totalTrades > 0 && (
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      workflow.stats.totalPnL >= 0 
                        ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800'
                        : 'bg-red-900/50 text-red-400 border border-red-800'
                    }`}>
                      {workflow.stats.totalPnL >= 0 ? '+' : ''}
                      ₹{workflow.stats.totalPnL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs text-slate-500">
                      {workflow.stats.winRate.toFixed(0)}% WR
                    </span>
                    <span className="text-xs text-slate-500">
                      {workflow.stats.totalTrades} trades
                    </span>
                  </div>
                )}
              </div>
              {workflow.description && (
                <p className="text-sm text-slate-400 mt-1">{workflow.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3">
                <span className="text-xs text-slate-500">
                  {workflow.nodes?.length || 0} cards
                </span>
                <span className="text-xs text-slate-500">
                  {workflow.symbols?.join(', ') || 'No symbols'}
                </span>
                <span className="text-xs text-slate-500">
                  Updated {new Date(workflow.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`#/workflow?load=${workflow.id}`}
                className="px-3 py-1.5 text-sm text-teal-400 hover:bg-teal-500/10 rounded-lg transition-colors"
              >
                Open
              </a>
              <button
                onClick={() => {
                  if (confirm('Delete this workflow?')) {
                    onDelete(workflow.id);
                  }
                }}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
