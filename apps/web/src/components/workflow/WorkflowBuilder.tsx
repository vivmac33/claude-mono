// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOW BUILDER V3
// Visual node-based workflow editor using React Flow
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './workflow-animations.css';

import { CardNode } from './nodes/CardNodeEnhanced';
import { ConditionNode } from './nodes/ConditionNode';
import { MergeNode } from './nodes/MergeNode';
import { WorkflowSidebar } from './WorkflowSidebar';
import { WorkflowToolbarEnhanced } from './WorkflowToolbarEnhanced';
import { SymbolInput } from './SymbolInput';
import { WorkflowResults } from './WorkflowResults';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import { NodeConfigPanel } from './NodeConfigPanel';
import { WorkflowHints } from './WorkflowHints';
import { ValidationModal, ValidationBadge, useWorkflowValidation } from './ValidationWarnings';
import { WORKFLOW_TEMPLATES, type WorkflowTemplate } from './templates';
import { NavHeader } from '@/components/layout/NavHeader';
import { useUserStore } from '@/stores/userStore';
import { useTheme } from '@/components/ThemeProvider';
import { edgeTypes as customEdgeTypes } from './edges/CustomEdges';
import { useUndoRedo, useCopyPaste, useAutoLayout, useKeyboardShortcuts } from './hooks/useWorkflowEnhancements';
import type { CardNodeData, ConditionNodeData, MergeNodeData, WorkflowNode, WorkflowEdge, WorkflowState, WorkflowRunState } from './types';
import { cardRegistry, getCardById, type CardDescriptor, CATEGORIES } from '@/registry/cardRegistry';
import { generateMockData } from '@/lib/mockDataGenerator';

// ─────────────────────────────────────────────────────────────────────────────
// NODE TYPES & EDGE TYPES
// ─────────────────────────────────────────────────────────────────────────────

const nodeTypes: NodeTypes = {
  card: CardNode,
  condition: ConditionNode,
  merge: MergeNode,
};

const edgeTypes: EdgeTypes = customEdgeTypes;

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'monomorph_workflows_v3';

function loadSavedWorkflows(): WorkflowState[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWorkflows(workflows: WorkflowState[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function createCardNode(
  card: CardDescriptor, 
  position: { x: number; y: number },
  symbol: string = 'TCS'
): WorkflowNode {
  return {
    id: generateId(),
    type: 'card',
    position,
    data: {
      type: 'card',
      cardId: card.id,
      label: card.label,
      category: card.category,
      description: card.description,
      symbol,
      params: {},
      status: 'idle',
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function WorkflowBuilderInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, getNodes, setNodes: rfSetNodes, setEdges: rfSetEdges, fitView } = useReactFlow();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // State
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge>([]);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [symbols, setSymbols] = useState<string[]>(['TCS']);
  const [symbolInput, setSymbolInput] = useState('');
  const [outputMode, setOutputMode] = useState<'cards' | 'list' | 'report'>('cards');
  const [savedWorkflows, setSavedWorkflows] = useState<WorkflowState[]>([]);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);
  
  // Max 4 symbols
  const MAX_SYMBOLS = 4;
  
  // Add symbol handler
  const addSymbol = useCallback((sym: string) => {
    const upperSym = sym.toUpperCase().trim();
    if (upperSym && symbols.length < MAX_SYMBOLS && !symbols.includes(upperSym)) {
      setSymbols(prev => [...prev, upperSym]);
      setSymbolInput('');
    }
  }, [symbols]);
  
  // Remove symbol handler
  const removeSymbol = useCallback((sym: string) => {
    if (symbols.length > 1) {
      setSymbols(prev => prev.filter(s => s !== sym));
    }
  }, [symbols]);
  
  // Run state
  const [runState, setRunState] = useState<WorkflowRunState>({
    status: 'idle',
    progress: 0,
    results: {},
    errors: {},
  });
  
  // Panels
  const [showResults, setShowResults] = useState(false);
  const [showSavedWorkflows, setShowSavedWorkflows] = useState(false);
  
  // Enhancement state
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [configNode, setConfigNode] = useState<WorkflowNode | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  
  // Enhancement hooks
  const { canUndo, canRedo, saveState, undo, redo, clearHistory } = useUndoRedo();
  const { hasClipboard, copyNodes, pasteNodes, duplicateNodes, deleteSelected } = useCopyPaste();
  const { autoLayout } = useAutoLayout();
  
  // Validation hook
  const validation = useWorkflowValidation(nodes, edges, symbols);
  
  // Selected nodes
  const selectedNodes = useMemo(() => nodes.filter(n => n.selected), [nodes]);
  const hasSelection = selectedNodes.length > 0;
  
  // Load saved workflows on mount
  useEffect(() => {
    setSavedWorkflows(loadSavedWorkflows());
  }, []);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // CONNECTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  
  const onConnect = useCallback(
    (params: Connection) => {
      // Determine edge type based on source handle
      let edgeType = 'gradient';
      if (params.sourceHandle === 'true') {
        edgeType = 'trueBranch';
      } else if (params.sourceHandle === 'false') {
        edgeType = 'falseBranch';
      }
      
      saveState(nodes, edges); // Save for undo
      setEdges(eds => addEdge({
        ...params,
        type: edgeType,
        animated: edgeType === 'gradient',
        style: { strokeWidth: 2 },
      }, eds));
    },
    [setEdges, nodes, edges, saveState]
  );
  
  // ─────────────────────────────────────────────────────────────────────────────
  // DRAG & DROP
  // ─────────────────────────────────────────────────────────────────────────────
  
  const onDragStart = useCallback((event: React.DragEvent, card: CardDescriptor) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(card));
    event.dataTransfer.effectAllowed = 'move';
  }, []);
  
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      // Try to get card data first
      const cardData = event.dataTransfer.getData('application/reactflow');
      const logicData = event.dataTransfer.getData('application/reactflow-logic');
      
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      if (cardData) {
        // Handle regular card drop
        const card: CardDescriptor = JSON.parse(cardData);
        const newNode = createCardNode(card, position, symbols[0] || 'TCS');
        saveState(nodes, edges); // Save for undo
        setNodes(nds => [...nds, newNode]);
      } else if (logicData) {
        // Handle logic node drop (condition, merge, etc.)
        const logic = JSON.parse(logicData);
        const newNode: WorkflowNode = {
          id: generateId(),
          type: logic.type,
          position,
          data: logic,
        };
        saveState(nodes, edges); // Save for undo
        setNodes(nds => [...nds, newNode]);
      }
    },
    [screenToFlowPosition, symbols, setNodes, nodes, edges, saveState]
  );
  
  // ─────────────────────────────────────────────────────────────────────────────
  // TEMPLATE LOADING
  // ─────────────────────────────────────────────────────────────────────────────
  
  const loadTemplate = useCallback((template: WorkflowTemplate) => {
    // Create nodes from template with better spread-out positions
    const newNodes: WorkflowNode[] = template.nodes.map((nodeDef, index) => {
      // Spread nodes horizontally and vertically for better visibility
      const row = Math.floor(index / 3);
      const col = index % 3;
      const baseX = 100 + col * 300;
      const baseY = 100 + row * 200;
      
      return {
        ...nodeDef,
        id: `${index}`,
        position: { x: baseX, y: baseY },
        data: {
          ...nodeDef.data,
          symbol: symbols[0] || 'TCS',
        },
      };
    }) as WorkflowNode[];
    
    // Create edges from template
    const newEdges: WorkflowEdge[] = template.edges.map((edgeDef, index) => ({
      ...edgeDef,
      id: `e${index}`,
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 2 },
    })) as WorkflowEdge[];
    
    setNodes(newNodes);
    setEdges(newEdges);
    setWorkflowName(template.name);
    setActiveWorkflowId(null);
    setRunState({ status: 'idle', progress: 0, results: {}, errors: {} });
    setShowResults(false);
    
    // Auto-fit view after a short delay to let nodes render
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 500 });
    }, 100);
  }, [symbols, setNodes, setEdges, fitView]);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // WORKFLOW OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────────
  
  // Get userStore actions for saving to activity tab
  const { saveWorkflow: saveToUserStore, updateWorkflow: updateInUserStore } = useUserStore();
  
  const saveWorkflow = useCallback(() => {
    const now = new Date().toISOString();
    const workflow: WorkflowState = {
      id: activeWorkflowId || generateId(),
      name: workflowName,
      nodes,
      edges,
      outputMode,
      symbols,
      createdAt: activeWorkflowId 
        ? savedWorkflows.find(w => w.id === activeWorkflowId)?.createdAt || now
        : now,
      updatedAt: now,
    };
    
    // Save to local state (for current session)
    setSavedWorkflows(prev => {
      const existing = prev.findIndex(w => w.id === workflow.id);
      const updated = existing >= 0
        ? [...prev.slice(0, existing), workflow, ...prev.slice(existing + 1)]
        : [workflow, ...prev];
      saveWorkflows(updated);
      return updated;
    });
    
    // Also save to userStore (persists to localStorage, shows in Activity dropdown)
    if (activeWorkflowId) {
      updateInUserStore(workflow.id, {
        name: workflow.name,
        nodes: workflow.nodes,
        edges: workflow.edges,
        symbols: workflow.symbols,
      });
    } else {
      saveToUserStore({
        name: workflow.name,
        nodes: workflow.nodes,
        edges: workflow.edges,
        symbols: workflow.symbols,
      });
    }
    
    setActiveWorkflowId(workflow.id);
  }, [workflowName, nodes, edges, outputMode, symbols, activeWorkflowId, savedWorkflows, saveToUserStore, updateInUserStore]);
  
  const loadWorkflow = useCallback((workflow: WorkflowState) => {
    setNodes(workflow.nodes);
    setEdges(workflow.edges);
    setWorkflowName(workflow.name);
    setOutputMode(workflow.outputMode);
    if (workflow.symbols?.length) setSymbols(workflow.symbols);
    setActiveWorkflowId(workflow.id);
    setRunState({ status: 'idle', progress: 0, results: {}, errors: {} });
    setShowResults(false);
    setShowSavedWorkflows(false);
  }, [setNodes, setEdges]);
  
  const deleteWorkflow = useCallback((id: string) => {
    setSavedWorkflows(prev => {
      const updated = prev.filter(w => w.id !== id);
      saveWorkflows(updated);
      return updated;
    });
    if (activeWorkflowId === id) {
      setActiveWorkflowId(null);
    }
  }, [activeWorkflowId]);
  
  const newWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setWorkflowName('Untitled Workflow');
    setActiveWorkflowId(null);
    setRunState({ status: 'idle', progress: 0, results: {}, errors: {} });
    setShowResults(false);
  }, [setNodes, setEdges]);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // WORKFLOW EXECUTION
  // ─────────────────────────────────────────────────────────────────────────────
  
  // Handler to check validation before running
  const handleRunClick = useCallback(() => {
    // If there are issues, show the validation modal
    if (!validation.isValid) {
      setShowValidationModal(true);
      return;
    }
    // Otherwise run directly
    runWorkflowDirect();
  }, [validation]);
  
  // The actual run function (called directly or after validation approval)
  const runWorkflowDirect = useCallback(async () => {
    if (nodes.length === 0 || symbols.length === 0) return;
    
    setShowValidationModal(false); // Close modal if open
    
    setRunState({
      status: 'running',
      progress: 0,
      results: {},
      errors: {},
      startedAt: new Date().toISOString(),
    });
    
    const results: Record<string, any> = {};
    const errors: Record<string, string> = {};
    
    // Total iterations = nodes * symbols
    const totalIterations = nodes.length * symbols.length;
    let currentIteration = 0;
    
    // Execute for each symbol
    for (const sym of symbols) {
      // Execute nodes sequentially for this symbol
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const resultKey = symbols.length > 1 ? `${node.id}-${sym}` : node.id;
        currentIteration++;
        const progress = Math.round((currentIteration / totalIterations) * 100);
        
        // Update node status to running
        setNodes(nds => nds.map(n => 
          n.id === node.id 
            ? { ...n, data: { ...n.data, status: 'running', symbol: sym } }
            : n
        ));
        
        setRunState(prev => ({
          ...prev,
          currentNodeId: node.id,
          progress,
        }));
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        try {
          // Generate mock data for this card and symbol
          const cardData = generateMockData(node.data.cardId, sym);
          results[resultKey] = { ...cardData, _symbol: sym, _nodeId: node.id, _cardId: node.data.cardId };
          
          // Update node status to success
          setNodes(nds => nds.map(n => 
            n.id === node.id 
              ? { ...n, data: { ...n.data, status: 'success', result: cardData } }
              : n
          ));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          errors[resultKey] = errorMessage;
          
          // Update node status to error
          setNodes(nds => nds.map(n => 
            n.id === node.id 
              ? { ...n, data: { ...n.data, status: 'error', error: errorMessage } }
              : n
          ));
        }
      }
    }
    
    setRunState({
      status: Object.keys(errors).length > 0 ? 'error' : 'completed',
      progress: 100,
      results,
      errors,
      completedAt: new Date().toISOString(),
    });
    
    setShowResults(true);
  }, [nodes, symbols, setNodes]);
  
  // Reset node statuses
  const resetNodes = useCallback(() => {
    setNodes(nds => nds.map(n => ({
      ...n,
      data: { ...n.data, status: 'idle', result: undefined, error: undefined },
    })));
    setRunState({ status: 'idle', progress: 0, results: {}, errors: {} });
  }, [setNodes]);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ENHANCEMENT HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  
  // Undo handler
  const handleUndo = useCallback(() => {
    undo(nodes, edges, setNodes, setEdges);
  }, [nodes, edges, setNodes, setEdges, undo]);
  
  // Redo handler
  const handleRedo = useCallback(() => {
    redo(nodes, edges, setNodes, setEdges);
  }, [nodes, edges, setNodes, setEdges, redo]);
  
  // Copy handler
  const handleCopy = useCallback(() => {
    copyNodes(selectedNodes, edges);
  }, [selectedNodes, edges, copyNodes]);
  
  // Paste handler
  const handlePaste = useCallback(() => {
    const result = pasteNodes(nodes, edges);
    if (result) {
      saveState(nodes, edges);
      setNodes(result.nodes);
      setEdges(result.edges);
    }
  }, [nodes, edges, pasteNodes, setNodes, setEdges, saveState]);
  
  // Duplicate handler
  const handleDuplicate = useCallback(() => {
    const result = duplicateNodes(selectedNodes, nodes, edges);
    if (result) {
      saveState(nodes, edges);
      setNodes(result.nodes);
      setEdges(result.edges);
    }
  }, [selectedNodes, nodes, edges, duplicateNodes, setNodes, setEdges, saveState]);
  
  // Delete handler
  const handleDelete = useCallback(() => {
    if (selectedNodes.length === 0) return;
    const result = deleteSelected(selectedNodes, nodes, edges);
    saveState(nodes, edges);
    setNodes(result.nodes);
    setEdges(result.edges);
  }, [selectedNodes, nodes, edges, deleteSelected, setNodes, setEdges, saveState]);
  
  // Auto-layout handler
  const handleAutoLayout = useCallback(() => {
    if (nodes.length === 0) return;
    saveState(nodes, edges);
    const layouted = autoLayout(nodes, edges);
    setNodes(layouted);
  }, [nodes, edges, autoLayout, setNodes, saveState]);
  
  // Select all handler
  const handleSelectAll = useCallback(() => {
    setNodes(nds => nds.map(n => ({ ...n, selected: true })));
  }, [setNodes]);
  
  // Node config update handler
  const handleNodeConfigUpdate = useCallback((nodeId: string, data: Partial<CardNodeData>) => {
    saveState(nodes, edges);
    setNodes(nds => nds.map(n => 
      n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
    ));
  }, [nodes, edges, setNodes, saveState]);
  
  // Node delete handler (from config panel)
  const handleNodeDelete = useCallback((nodeId: string) => {
    saveState(nodes, edges);
    setNodes(nds => nds.filter(n => n.id !== nodeId));
    setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
  }, [nodes, edges, setNodes, setEdges, saveState]);
  
  // Node double click handler
  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'card') {
      setConfigNode(node as WorkflowNode);
    }
  }, []);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // KEYBOARD SHORTCUTS
  // ─────────────────────────────────────────────────────────────────────────────
  
  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onDuplicate: handleDuplicate,
    onDelete: handleDelete,
    onSelectAll: handleSelectAll,
    onSave: saveWorkflow,
    onRun: handleRunClick,
    onAutoLayout: handleAutoLayout,
    onEscape: () => {
      setShowResults(false);
      setShowSavedWorkflows(false);
      setShowShortcuts(false);
      setConfigNode(null);
    },
    onHelp: () => setShowShortcuts(prev => !prev),
  });
  
  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  
  return (
    <div className={`h-screen w-full flex flex-col transition-colors ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      {/* Navigation Header */}
      <NavHeader currentPage="workflow" variant="compact" />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <WorkflowSidebar
          onDragStart={onDragStart}
          onTemplateSelect={loadTemplate}
          onAddCard={(card) => {
            const position = { x: 300, y: 100 + nodes.length * 150 };
            const newNode = createCardNode(card, position, symbols[0] || 'TCS');
            setNodes(nds => [...nds, newNode]);
          }}
        />
        
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <WorkflowToolbarEnhanced
            workflowName={workflowName}
            onWorkflowNameChange={setWorkflowName}
            symbols={symbols}
            symbolInput={symbolInput}
            onSymbolInputChange={setSymbolInput}
            onAddSymbol={addSymbol}
            onRemoveSymbol={removeSymbol}
            maxSymbols={MAX_SYMBOLS}
            outputMode={outputMode}
            onOutputModeChange={setOutputMode}
            onNew={newWorkflow}
            onSave={saveWorkflow}
            onRun={handleRunClick}
            onReset={resetNodes}
            onToggleSavedWorkflows={() => setShowSavedWorkflows(!showSavedWorkflows)}
            isRunning={runState.status === 'running'}
            hasNodes={nodes.length > 0}
            isSaved={!!activeWorkflowId}
            runProgress={runState.progress}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={handleUndo}
            onRedo={handleRedo}
            hasSelection={hasSelection}
            hasClipboard={hasClipboard}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onAutoLayout={handleAutoLayout}
            onShowShortcuts={() => setShowShortcuts(true)}
          />
          
          {/* Canvas */}
          <div ref={reactFlowWrapper} className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeDoubleClick={onNodeDoubleClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            snapToGrid
            snapGrid={[20, 20]}
            connectionMode={ConnectionMode.Loose}
            defaultEdgeOptions={{
              type: 'gradient',
              animated: false,
            }}
            connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
            className={isDark ? 'bg-slate-950' : 'bg-slate-200'}
          >
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1}
              color={isDark ? '#334155' : '#94a3b8'}
            />
            <Controls 
              className={isDark ? '!bg-slate-800 !border-slate-700 !rounded-xl !shadow-lg' : '!bg-white !border-slate-300 !rounded-xl !shadow-lg'}
            />
            <MiniMap 
              nodeColor={(node) => {
                if (node.type === 'condition') return '#f59e0b'; // Amber for conditions
                if (node.type === 'merge') return '#8b5cf6'; // Violet for merge
                const data = node.data as CardNodeData;
                const cat = CATEGORIES.find(c => c.id === data?.category);
                return cat?.color || '#64748b';
              }}
              maskColor={isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'}
              className={isDark ? '!bg-slate-900 !border-slate-700 !rounded-xl' : '!bg-white !border-slate-300 !rounded-xl'}
            />
            
            {/* Empty State */}
            {nodes.length === 0 && (
              <Panel position="top-center" className="mt-32">
                <div className="text-center animate-fade-in">
                  <div className="text-6xl mb-4">🔧</div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-2">
                    Build Your Workflow
                  </h3>
                  <p className="text-slate-400 mb-4 max-w-md">
                    Drag cards from the sidebar onto the canvas, or select a template to get started
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => loadTemplate(WORKFLOW_TEMPLATES[0])}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Start with Template
                    </button>
                  </div>
                </div>
              </Panel>
            )}
          </ReactFlow>
          
          {/* Contextual Hints */}
          <WorkflowHints
            nodeCount={nodes.length}
            edgeCount={edges.length}
            hasRun={runState.status === 'completed' || runState.status === 'error'}
            isRunning={runState.status === 'running'}
          />
        </div>
      </div>
      
      {/* Saved Workflows Panel */}
      {showSavedWorkflows && (
        <div className="absolute right-0 top-16 bottom-0 w-80 bg-slate-900/95 border-l border-slate-700 
          shadow-2xl z-50 flex flex-col animate-slide-up">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold text-slate-200">Saved Workflows</h3>
            <button
              onClick={() => setShowSavedWorkflows(false)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {savedWorkflows.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                <div className="text-3xl mb-2">📂</div>
                <div className="text-sm">No saved workflows</div>
              </div>
            ) : (
              <div className="space-y-2">
                {savedWorkflows.map(workflow => (
                  <div
                    key={workflow.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all
                      ${workflow.id === activeWorkflowId
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
                      }`}
                    onClick={() => loadWorkflow(workflow)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-200">{workflow.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteWorkflow(workflow.id);
                        }}
                        className="p-1 text-slate-500 hover:text-red-400"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {workflow.nodes.length} cards • {new Date(workflow.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Results Panel */}
      {showResults && runState.status !== 'idle' && (
        <WorkflowResults
          nodes={nodes}
          symbols={symbols}
          results={runState.results}
          errors={runState.errors}
          outputMode={outputMode}
          onClose={() => setShowResults(false)}
        />
      )}
      
      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
      
      {/* Node Configuration Panel */}
      {configNode && (
        <NodeConfigPanel
          node={configNode}
          onClose={() => setConfigNode(null)}
          onUpdate={handleNodeConfigUpdate}
          onDelete={handleNodeDelete}
          symbols={symbols}
        />
      )}
      
      {/* Validation Modal */}
      <ValidationModal
        isOpen={showValidationModal}
        validation={validation}
        onClose={() => setShowValidationModal(false)}
        onProceed={runWorkflowDirect}
      />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT WITH PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export function WorkflowBuilder() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner />
    </ReactFlowProvider>
  );
}

export default WorkflowBuilder;
