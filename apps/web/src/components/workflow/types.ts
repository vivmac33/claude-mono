// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOW V3 TYPES
// Type definitions for the React Flow based workflow builder
// ═══════════════════════════════════════════════════════════════════════════

import type { Node, Edge } from '@xyflow/react';
import type { CardCategory } from '@/registry/cardRegistry';

// ─────────────────────────────────────────────────────────────────────────────
// Node Types
// ─────────────────────────────────────────────────────────────────────────────

export type WorkflowNodeType = 'card' | 'condition' | 'merge' | 'output' | 'start';

export interface CardNodeData {
  type: 'card';
  cardId: string;
  label: string;
  category: CardCategory;
  description: string;
  symbol: string;
  params: Record<string, string>;
  status?: 'idle' | 'running' | 'success' | 'error';
  result?: any;
  error?: string;
}

export interface ConditionNodeData {
  type: 'condition';
  label: string;
  condition: string; // e.g., "score > 70"
  trueLabel?: string;
  falseLabel?: string;
}

export interface MergeNodeData {
  type: 'merge';
  label: string;
  mergeStrategy: 'all' | 'any' | 'first';
}

export interface OutputNodeData {
  type: 'output';
  label: string;
  outputMode: 'cards' | 'list' | 'report';
}

export interface StartNodeData {
  type: 'start';
  label: string;
  symbols: string[];
}

export type WorkflowNodeData = 
  | CardNodeData 
  | ConditionNodeData 
  | MergeNodeData 
  | OutputNodeData
  | StartNodeData;

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge<{ condition?: string }>;

// ─────────────────────────────────────────────────────────────────────────────
// Workflow State
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkflowState {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  outputMode: 'cards' | 'list' | 'report';
  symbols: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowRunState {
  status: 'idle' | 'running' | 'completed' | 'error';
  currentNodeId?: string;
  progress: number; // 0-100
  results: Record<string, any>;
  errors: Record<string, string>;
  startedAt?: string;
  completedAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Templates
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'beginner' | 'value' | 'growth' | 'technical' | 'risk' | 'income';
  tags: string[];
  nodes: Omit<WorkflowNode, 'id'>[];
  edges: Omit<WorkflowEdge, 'id'>[];
  /** Why use this template? Philosophy and use-case explanation */
  philosophy?: {
    question: string;      // "When should I use this?"
    answer: string;        // The explanation
    bestFor?: string[];    // Quick tags like "Long-term investors", "Earnings season"
    notFor?: string[];     // Anti-patterns like "Day trading", "Quick flips"
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Drag & Drop
// ─────────────────────────────────────────────────────────────────────────────

export interface DragItem {
  type: 'card';
  cardId: string;
  label: string;
  category: CardCategory;
  description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas State
// ─────────────────────────────────────────────────────────────────────────────

export interface CanvasState {
  zoom: number;
  position: { x: number; y: number };
  selectedNodes: string[];
  selectedEdges: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Preview State
// ─────────────────────────────────────────────────────────────────────────────

export interface PreviewState {
  nodeId: string | null;
  position: { x: number; y: number };
  data: any;
  isLoading: boolean;
}
