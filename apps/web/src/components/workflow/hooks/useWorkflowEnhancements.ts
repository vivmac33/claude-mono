// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOW ENHANCEMENTS
// Undo/Redo, Copy/Paste, Auto-Layout, and Keyboard Shortcuts
// ═══════════════════════════════════════════════════════════════════════════

import { useCallback, useState, useRef, useEffect } from 'react';
import type { Node, Edge } from '@xyflow/react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

interface ClipboardData {
  nodes: Node[];
  edges: Edge[];
}

// ─────────────────────────────────────────────────────────────────────────────
// UNDO/REDO HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function useUndoRedo(maxHistory = 50) {
  const [past, setPast] = useState<HistoryState[]>([]);
  const [future, setFuture] = useState<HistoryState[]>([]);
  const isUndoRedoAction = useRef(false);
  
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;
  
  // Save state to history
  const saveState = useCallback((nodes: Node[], edges: Edge[]) => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }
    
    setPast(prev => {
      const newPast = [...prev, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }];
      // Limit history size
      if (newPast.length > maxHistory) {
        return newPast.slice(-maxHistory);
      }
      return newPast;
    });
    setFuture([]); // Clear redo stack when new action is performed
  }, [maxHistory]);
  
  // Undo action
  const undo = useCallback((
    currentNodes: Node[],
    currentEdges: Edge[],
    setNodes: (nodes: Node[]) => void,
    setEdges: (edges: Edge[]) => void
  ) => {
    if (past.length === 0) return;
    
    isUndoRedoAction.current = true;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);
    
    setPast(newPast);
    setFuture(prev => [...prev, { nodes: JSON.parse(JSON.stringify(currentNodes)), edges: JSON.parse(JSON.stringify(currentEdges)) }]);
    
    setNodes(previous.nodes);
    setEdges(previous.edges);
  }, [past]);
  
  // Redo action
  const redo = useCallback((
    currentNodes: Node[],
    currentEdges: Edge[],
    setNodes: (nodes: Node[]) => void,
    setEdges: (edges: Edge[]) => void
  ) => {
    if (future.length === 0) return;
    
    isUndoRedoAction.current = true;
    
    const next = future[future.length - 1];
    const newFuture = future.slice(0, -1);
    
    setFuture(newFuture);
    setPast(prev => [...prev, { nodes: JSON.parse(JSON.stringify(currentNodes)), edges: JSON.parse(JSON.stringify(currentEdges)) }]);
    
    setNodes(next.nodes);
    setEdges(next.edges);
  }, [future]);
  
  // Clear history
  const clearHistory = useCallback(() => {
    setPast([]);
    setFuture([]);
  }, []);
  
  return {
    canUndo,
    canRedo,
    saveState,
    undo,
    redo,
    clearHistory,
    historyLength: past.length,
    futureLength: future.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COPY/PASTE HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function useCopyPaste() {
  const [clipboard, setClipboard] = useState<ClipboardData | null>(null);
  
  // Generate new unique ID
  const generateId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  
  // Copy selected nodes
  const copyNodes = useCallback((selectedNodes: Node[], allEdges: Edge[]) => {
    if (selectedNodes.length === 0) return;
    
    const selectedIds = new Set(selectedNodes.map(n => n.id));
    
    // Get edges that connect selected nodes
    const relevantEdges = allEdges.filter(
      e => selectedIds.has(e.source) && selectedIds.has(e.target)
    );
    
    setClipboard({
      nodes: JSON.parse(JSON.stringify(selectedNodes)),
      edges: JSON.parse(JSON.stringify(relevantEdges)),
    });
    
    return selectedNodes.length;
  }, []);
  
  // Paste nodes with offset
  const pasteNodes = useCallback((
    existingNodes: Node[],
    existingEdges: Edge[],
    offset = { x: 50, y: 50 }
  ): { nodes: Node[]; edges: Edge[] } | null => {
    if (!clipboard) return null;
    
    // Create ID mapping from old to new
    const idMap = new Map<string, string>();
    clipboard.nodes.forEach(node => {
      idMap.set(node.id, generateId());
    });
    
    // Create new nodes with new IDs and offset positions
    const newNodes: Node[] = clipboard.nodes.map(node => ({
      ...node,
      id: idMap.get(node.id)!,
      position: {
        x: node.position.x + offset.x,
        y: node.position.y + offset.y,
      },
      selected: true, // Select pasted nodes
      data: {
        ...node.data,
        status: 'idle', // Reset status
        result: undefined,
        error: undefined,
      },
    }));
    
    // Create new edges with mapped IDs
    const newEdges: Edge[] = clipboard.edges.map(edge => ({
      ...edge,
      id: generateId(),
      source: idMap.get(edge.source)!,
      target: idMap.get(edge.target)!,
    }));
    
    // Deselect existing nodes
    const updatedExisting = existingNodes.map(n => ({ ...n, selected: false }));
    
    return {
      nodes: [...updatedExisting, ...newNodes],
      edges: [...existingEdges, ...newEdges],
    };
  }, [clipboard]);
  
  // Duplicate nodes (copy + paste in one action)
  const duplicateNodes = useCallback((
    selectedNodes: Node[],
    allNodes: Node[],
    allEdges: Edge[],
    offset = { x: 50, y: 50 }
  ): { nodes: Node[]; edges: Edge[] } | null => {
    if (selectedNodes.length === 0) return null;
    
    const selectedIds = new Set(selectedNodes.map(n => n.id));
    const relevantEdges = allEdges.filter(
      e => selectedIds.has(e.source) && selectedIds.has(e.target)
    );
    
    // Create ID mapping
    const idMap = new Map<string, string>();
    selectedNodes.forEach(node => {
      idMap.set(node.id, generateId());
    });
    
    // Create duplicated nodes
    const newNodes: Node[] = selectedNodes.map(node => ({
      ...node,
      id: idMap.get(node.id)!,
      position: {
        x: node.position.x + offset.x,
        y: node.position.y + offset.y,
      },
      selected: true,
      data: {
        ...node.data,
        status: 'idle',
        result: undefined,
        error: undefined,
      },
    }));
    
    // Create duplicated edges
    const newEdges: Edge[] = relevantEdges.map(edge => ({
      ...edge,
      id: generateId(),
      source: idMap.get(edge.source)!,
      target: idMap.get(edge.target)!,
    }));
    
    // Deselect original nodes
    const updatedExisting = allNodes.map(n => ({ ...n, selected: false }));
    
    return {
      nodes: [...updatedExisting, ...newNodes],
      edges: [...allEdges, ...newEdges],
    };
  }, []);
  
  // Delete selected nodes
  const deleteSelected = useCallback((
    selectedNodes: Node[],
    allNodes: Node[],
    allEdges: Edge[]
  ): { nodes: Node[]; edges: Edge[] } => {
    const selectedIds = new Set(selectedNodes.map(n => n.id));
    
    return {
      nodes: allNodes.filter(n => !selectedIds.has(n.id)),
      edges: allEdges.filter(e => !selectedIds.has(e.source) && !selectedIds.has(e.target)),
    };
  }, []);
  
  return {
    clipboard,
    hasClipboard: clipboard !== null,
    copyNodes,
    pasteNodes,
    duplicateNodes,
    deleteSelected,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTO-LAYOUT (DAGRE-FREE IMPLEMENTATION)
// Uses topological sort + layering algorithm
// ─────────────────────────────────────────────────────────────────────────────

interface LayoutOptions {
  direction: 'TB' | 'LR'; // Top-Bottom or Left-Right
  nodeWidth: number;
  nodeHeight: number;
  horizontalSpacing: number;
  verticalSpacing: number;
}

export function useAutoLayout() {
  // Build adjacency list from edges
  const buildGraph = (nodes: Node[], edges: Edge[]) => {
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    
    nodes.forEach(node => {
      graph.set(node.id, []);
      inDegree.set(node.id, 0);
    });
    
    edges.forEach(edge => {
      graph.get(edge.source)?.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });
    
    return { graph, inDegree };
  };
  
  // Topological sort using Kahn's algorithm with level assignment
  const assignLevels = (nodes: Node[], edges: Edge[]) => {
    const { graph, inDegree } = buildGraph(nodes, edges);
    const levels = new Map<string, number>();
    const queue: string[] = [];
    
    // Start with nodes that have no incoming edges
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
        levels.set(nodeId, 0);
      }
    });
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentLevel = levels.get(current)!;
      
      graph.get(current)?.forEach(neighbor => {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);
        
        // Update level to be max of current assignments
        const existingLevel = levels.get(neighbor);
        const newLevel = currentLevel + 1;
        
        if (existingLevel === undefined || newLevel > existingLevel) {
          levels.set(neighbor, newLevel);
        }
        
        if (newDegree === 0) {
          queue.push(neighbor);
        }
      });
    }
    
    // Handle disconnected nodes (cycles or isolated)
    nodes.forEach(node => {
      if (!levels.has(node.id)) {
        levels.set(node.id, 0);
      }
    });
    
    return levels;
  };
  
  // Main auto-layout function
  const autoLayout = useCallback((
    nodes: Node[],
    edges: Edge[],
    options: Partial<LayoutOptions> = {}
  ): Node[] => {
    const {
      direction = 'TB',
      nodeWidth = 240,
      nodeHeight = 140,
      horizontalSpacing = 80,
      verticalSpacing = 100,
    } = options;
    
    if (nodes.length === 0) return nodes;
    
    const levels = assignLevels(nodes, edges);
    
    // Group nodes by level
    const levelGroups = new Map<number, Node[]>();
    nodes.forEach(node => {
      const level = levels.get(node.id) || 0;
      if (!levelGroups.has(level)) {
        levelGroups.set(level, []);
      }
      levelGroups.get(level)!.push(node);
    });
    
    // Calculate positions
    const maxLevel = Math.max(...Array.from(levelGroups.keys()));
    const layoutedNodes: Node[] = [];
    
    levelGroups.forEach((nodesInLevel, level) => {
      const levelWidth = nodesInLevel.length * nodeWidth + (nodesInLevel.length - 1) * horizontalSpacing;
      const startX = -levelWidth / 2 + nodeWidth / 2;
      
      nodesInLevel.forEach((node, index) => {
        const x = direction === 'TB' 
          ? startX + index * (nodeWidth + horizontalSpacing)
          : level * (nodeWidth + verticalSpacing);
        const y = direction === 'TB'
          ? level * (nodeHeight + verticalSpacing)
          : startX + index * (nodeHeight + horizontalSpacing);
        
        layoutedNodes.push({
          ...node,
          position: { x: x + 300, y: y + 100 }, // Offset from origin
        });
      });
    });
    
    return layoutedNodes;
  }, []);
  
  return { autoLayout };
}

// ─────────────────────────────────────────────────────────────────────────────
// KEYBOARD SHORTCUTS HANDLER
// ─────────────────────────────────────────────────────────────────────────────

interface ShortcutActions {
  onUndo?: () => void;
  onRedo?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onSelectAll?: () => void;
  onSave?: () => void;
  onRun?: () => void;
  onEscape?: () => void;
  onAutoLayout?: () => void;
  onHelp?: () => void;
}

export function useKeyboardShortcuts(actions: ShortcutActions, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMod = event.metaKey || event.ctrlKey;
      const isShift = event.shiftKey;
      
      // Ignore if typing in input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Cmd/Ctrl + Z: Undo
      if (isMod && !isShift && event.key === 'z') {
        event.preventDefault();
        actions.onUndo?.();
        return;
      }
      
      // Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y: Redo
      if ((isMod && isShift && event.key === 'z') || (isMod && event.key === 'y')) {
        event.preventDefault();
        actions.onRedo?.();
        return;
      }
      
      // Cmd/Ctrl + C: Copy
      if (isMod && event.key === 'c') {
        event.preventDefault();
        actions.onCopy?.();
        return;
      }
      
      // Cmd/Ctrl + V: Paste
      if (isMod && event.key === 'v') {
        event.preventDefault();
        actions.onPaste?.();
        return;
      }
      
      // Cmd/Ctrl + D: Duplicate
      if (isMod && event.key === 'd') {
        event.preventDefault();
        actions.onDuplicate?.();
        return;
      }
      
      // Delete or Backspace: Delete selected
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        actions.onDelete?.();
        return;
      }
      
      // Cmd/Ctrl + A: Select all
      if (isMod && event.key === 'a') {
        event.preventDefault();
        actions.onSelectAll?.();
        return;
      }
      
      // Cmd/Ctrl + S: Save
      if (isMod && event.key === 's') {
        event.preventDefault();
        actions.onSave?.();
        return;
      }
      
      // Cmd/Ctrl + Enter: Run
      if (isMod && event.key === 'Enter') {
        event.preventDefault();
        actions.onRun?.();
        return;
      }
      
      // Cmd/Ctrl + L: Auto-layout
      if (isMod && event.key === 'l') {
        event.preventDefault();
        actions.onAutoLayout?.();
        return;
      }
      
      // Escape: Cancel/Close
      if (event.key === 'Escape') {
        actions.onEscape?.();
        return;
      }
      
      // ?: Show help
      if (event.key === '?') {
        event.preventDefault();
        actions.onHelp?.();
        return;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions, enabled]);
}

// ─────────────────────────────────────────────────────────────────────────────
// KEYBOARD SHORTCUTS DATA
// ─────────────────────────────────────────────────────────────────────────────

export const KEYBOARD_SHORTCUTS = [
  { keys: ['⌘', 'S'], action: 'Save workflow', category: 'File' },
  { keys: ['⌘', '↵'], action: 'Run workflow', category: 'File' },
  { keys: ['⌘', 'Z'], action: 'Undo', category: 'Edit' },
  { keys: ['⌘', '⇧', 'Z'], action: 'Redo', category: 'Edit' },
  { keys: ['⌘', 'C'], action: 'Copy selected', category: 'Edit' },
  { keys: ['⌘', 'V'], action: 'Paste', category: 'Edit' },
  { keys: ['⌘', 'D'], action: 'Duplicate selected', category: 'Edit' },
  { keys: ['⌫'], action: 'Delete selected', category: 'Edit' },
  { keys: ['⌘', 'A'], action: 'Select all', category: 'Edit' },
  { keys: ['⌘', 'L'], action: 'Auto-layout', category: 'View' },
  { keys: ['Esc'], action: 'Close panel / Deselect', category: 'General' },
  { keys: ['?'], action: 'Show shortcuts', category: 'General' },
];
