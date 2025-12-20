// ═══════════════════════════════════════════════════════════════════════════
// VISUAL LEARNING MAP
// Interactive concept map showing interconnected financial concepts
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { CONCEPT_MAP_NODES, ConceptMapNode } from '@/lib/learning';

interface VisualLearningMapProps {
  onNodeClick?: (node: ConceptMapNode) => void;
  completedNodes?: string[];
}

const difficultyColors = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/50',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/50',
};

const difficultyBadgeColors = {
  beginner: 'bg-green-500 text-white',
  intermediate: 'bg-yellow-500 text-black',
  advanced: 'bg-red-500 text-white',
};

const categoryIcons: Record<string, string> = {
  basics: '📊',
  technical: '📈',
  fundamental: '📋',
  derivatives: '⚡',
  risk: '🛡️',
  psychology: '🧠',
};

export function VisualLearningMap({ onNodeClick, completedNodes = [] }: VisualLearningMapProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleNodeClick = (node: ConceptMapNode) => {
    setSelectedNode(node.id);
    onNodeClick?.(node);
  };

  // Group nodes by difficulty for layout
  const beginnerNodes = CONCEPT_MAP_NODES.filter(n => n.difficulty === 'beginner');
  const intermediateNodes = CONCEPT_MAP_NODES.filter(n => n.difficulty === 'intermediate');
  const advancedNodes = CONCEPT_MAP_NODES.filter(n => n.difficulty === 'advanced');

  // Calculate connections for SVG lines
  const getNodePosition = (nodeId: string) => {
    const node = CONCEPT_MAP_NODES.find(n => n.id === nodeId);
    return node?.position || { x: 0, y: 0 };
  };

  return (
    <div className="relative w-full bg-slate-900/50 rounded-2xl border border-slate-700/50 p-6 overflow-hidden">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Visual Learning Map</h2>
        <p className="text-slate-400">
          Explore interconnected financial concepts - click any topic to dive deeper
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyBadgeColors.beginner}`}>
            beginner
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyBadgeColors.intermediate}`}>
            intermediate
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyBadgeColors.advanced}`}>
            advanced
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative min-h-[600px]">
        {/* SVG Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
            </marker>
          </defs>
          {CONCEPT_MAP_NODES.map(node =>
            node.connections.map(targetId => {
              const start = getNodePosition(node.id);
              const end = getNodePosition(targetId);
              const isHovered = hoveredNode === node.id || hoveredNode === targetId;
              
              // Calculate control points for curved lines
              const midX = (start.x + end.x) / 2;
              const midY = (start.y + end.y) / 2;
              const dx = end.x - start.x;
              const dy = end.y - start.y;
              const offset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.3;
              
              return (
                <g key={`${node.id}-${targetId}`}>
                  {/* Connection line */}
                  <path
                    d={`M ${start.x + 120} ${start.y + 50} 
                        Q ${midX} ${midY + offset} 
                        ${end.x + 120} ${end.y + 50}`}
                    fill="none"
                    stroke={isHovered ? '#f59e0b' : '#475569'}
                    strokeWidth={isHovered ? 2 : 1}
                    strokeDasharray={isHovered ? 'none' : '4 4'}
                    className="transition-all duration-300"
                  />
                  {/* Connection dot */}
                  <circle
                    cx={midX + 60}
                    cy={midY + 25}
                    r={3}
                    fill={isHovered ? '#f59e0b' : '#64748b'}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })
          )}
        </svg>

        {/* Concept Nodes */}
        {CONCEPT_MAP_NODES.map(node => {
          const isCompleted = completedNodes.includes(node.id);
          const isHovered = hoveredNode === node.id;
          const isSelected = selectedNode === node.id;
          
          return (
            <div
              key={node.id}
              className={`
                absolute w-56 p-4 rounded-xl border-2 cursor-pointer
                transition-all duration-300 transform
                ${difficultyColors[node.difficulty]}
                ${isHovered ? 'scale-105 shadow-lg shadow-slate-900/50' : ''}
                ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900' : ''}
                ${isCompleted ? 'border-green-500 bg-green-500/10' : ''}
              `}
              style={{
                left: node.position?.x || 0,
                top: node.position?.y || 0,
                zIndex: isHovered || isSelected ? 10 : 1,
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node)}
            >
              {/* Category Icon */}
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{categoryIcons[node.category]}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyBadgeColors[node.difficulty]}`}>
                  {node.difficulty}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-white mb-1">{node.label}</h3>
              
              {/* Description */}
              <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                {node.description}
              </p>

              {/* Subtopics count */}
              <div className="text-xs text-blue-400 hover:text-blue-300">
                {node.subtopicsCount} subtopics →
              </div>

              {/* Completion indicator */}
              {isCompleted && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Node Detail Panel */}
      {selectedNode && (
        <SelectedNodePanel
          node={CONCEPT_MAP_NODES.find(n => n.id === selectedNode)!}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Selected Node Detail Panel
// ─────────────────────────────────────────────────────────────────────────────

interface SelectedNodePanelProps {
  node: ConceptMapNode;
  onClose: () => void;
}

function SelectedNodePanel({ node, onClose }: SelectedNodePanelProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-slate-600 p-6 shadow-2xl z-20">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-white"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-start gap-4">
        <span className="text-4xl">{categoryIcons[node.category]}</span>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white">{node.label}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyBadgeColors[node.difficulty]}`}>
              {node.difficulty}
            </span>
          </div>
          <p className="text-slate-300 mb-4">{node.description}</p>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              {node.subtopicsCount} subtopics
            </span>
            <span className="text-sm text-slate-400">
              {node.moduleIds.length} modules
            </span>
            <span className="text-sm text-slate-400">
              {node.connections.length} connected topics
            </span>
          </div>
        </div>
        
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
          Start Learning
        </button>
      </div>
    </div>
  );
}

export default VisualLearningMap;
