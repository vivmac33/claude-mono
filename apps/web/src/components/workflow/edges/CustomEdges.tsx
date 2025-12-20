// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM EDGES
// Premium edge styling with gradients, animations, and conditional branches
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { 
  BaseEdge, 
  EdgeProps, 
  getBezierPath, 
  getSmoothStepPath,
  EdgeLabelRenderer 
} from '@xyflow/react';

// ─────────────────────────────────────────────────────────────────────────────
// GRADIENT FLOW EDGE
// Standard edge with animated gradient flow
// ─────────────────────────────────────────────────────────────────────────────

export function GradientFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const gradientId = `gradient-${id}`;
  const filterId = `glow-${id}`;
  
  return (
    <>
      {/* SVG Definitions */}
      <defs>
        {/* Gradient */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#14b8a6" stopOpacity="1" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
        </linearGradient>
        
        {/* Glow Filter */}
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Background glow (when selected) */}
      {selected && (
        <path
          d={edgePath}
          fill="none"
          stroke="#6366f1"
          strokeWidth={8}
          strokeOpacity={0.3}
          filter={`url(#${filterId})`}
        />
      )}
      
      {/* Main edge path */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={selected ? 3 : 2}
        className="transition-all duration-300"
      />
      
      {/* Animated flow particles */}
      <circle r="3" fill="#14b8a6">
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>
      <circle r="3" fill="#6366f1">
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          path={edgePath}
          begin="1s"
        />
      </circle>
      
      {/* Flow direction arrow at midpoint */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div 
            className={`
              w-5 h-5 rounded-full flex items-center justify-center
              bg-slate-800 border border-slate-600 text-slate-400
              text-[10px] transition-all duration-300
              ${selected ? 'scale-125 border-indigo-500 text-indigo-400' : ''}
            `}
          >
            ↓
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRUE BRANCH EDGE
// Green edge for condition "true" path
// ─────────────────────────────────────────────────────────────────────────────

export function TrueBranchEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const gradientId = `true-gradient-${id}`;
  
  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="1" />
        </linearGradient>
      </defs>
      
      {/* Glow when selected */}
      {selected && (
        <path
          d={edgePath}
          fill="none"
          stroke="#10b981"
          strokeWidth={8}
          strokeOpacity={0.2}
        />
      )}
      
      {/* Main path */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={selected ? 3 : 2}
        strokeDasharray="8 4"
        className="animate-dash-flow"
      />
      
      {/* Animated particle */}
      <circle r="4" fill="#10b981">
        <animateMotion
          dur="1.5s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>
      
      {/* Label */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[10px] font-medium">
            ✓ True
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FALSE BRANCH EDGE
// Red edge for condition "false" path
// ─────────────────────────────────────────────────────────────────────────────

export function FalseBranchEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const gradientId = `false-gradient-${id}`;
  
  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f87171" stopOpacity="1" />
        </linearGradient>
      </defs>
      
      {/* Glow when selected */}
      {selected && (
        <path
          d={edgePath}
          fill="none"
          stroke="#ef4444"
          strokeWidth={8}
          strokeOpacity={0.2}
        />
      )}
      
      {/* Main path */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={selected ? 3 : 2}
        strokeDasharray="8 4"
        className="animate-dash-flow"
      />
      
      {/* Animated particle */}
      <circle r="4" fill="#ef4444">
        <animateMotion
          dur="1.5s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>
      
      {/* Label */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-[10px] font-medium">
            ✗ False
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXECUTION EDGE
// Shows active data flow during workflow execution
// ─────────────────────────────────────────────────────────────────────────────

interface ExecutionEdgeData {
  executing?: boolean;
  completed?: boolean;
}

export function ExecutionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps & { data?: ExecutionEdgeData }) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isExecuting = data?.executing;
  const isCompleted = data?.completed;
  
  return (
    <>
      {/* Background path */}
      <path
        d={edgePath}
        fill="none"
        stroke={isCompleted ? '#10b981' : isExecuting ? '#6366f1' : '#475569'}
        strokeWidth={isExecuting ? 4 : 2}
        strokeOpacity={isExecuting ? 1 : 0.5}
        className="transition-all duration-500"
      />
      
      {/* Execution animation */}
      {isExecuting && (
        <>
          {/* Pulse effect */}
          <path
            d={edgePath}
            fill="none"
            stroke="#6366f1"
            strokeWidth={8}
            strokeOpacity={0.3}
            className="animate-pulse"
          />
          
          {/* Fast moving particles */}
          {[0, 0.25, 0.5, 0.75].map((delay, i) => (
            <circle key={i} r="4" fill="#a5b4fc">
              <animateMotion
                dur="0.8s"
                repeatCount="indefinite"
                path={edgePath}
                begin={`${delay}s`}
              />
            </circle>
          ))}
        </>
      )}
      
      {/* Completion checkmark */}
      {isCompleted && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce-once">
              ✓
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EDGE TYPES REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

export const edgeTypes = {
  gradient: GradientFlowEdge,
  trueBranch: TrueBranchEdge,
  falseBranch: FalseBranchEdge,
  execution: ExecutionEdge,
};

export default edgeTypes;
