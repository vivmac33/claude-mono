// ═══════════════════════════════════════════════════════════════════════════
// CONDITION NODE
// Simple branching node - routes based on score threshold
// ═══════════════════════════════════════════════════════════════════════════

import React, { memo, useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { ConditionNodeData } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface ConditionNodeComponentProps {
  id: string;
  data: ConditionNodeData;
  selected: boolean;
}

function ConditionNodeComponent({ id, data, selected }: ConditionNodeComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [threshold, setThreshold] = useState(() => {
    // Parse threshold from condition like "score > 50"
    const match = data.condition?.match(/>\s*(\d+)/);
    return match ? parseInt(match[1]) : 50;
  });
  const { setNodes } = useReactFlow();
  
  const updateThreshold = useCallback((newThreshold: number) => {
    setThreshold(newThreshold);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              condition: `score > ${newThreshold}`,
            },
          };
        }
        return node;
      })
    );
    setIsEditing(false);
  }, [id, setNodes]);
  
  return (
    <div
      className={`
        relative
        transition-all duration-300 ease-out
        ${selected ? 'scale-105' : isHovered ? 'scale-102' : 'scale-100'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Input Handle - Top */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-5 !h-5 !bg-amber-400 !border-2 !border-amber-300 !rounded-full
          hover:!bg-amber-300 hover:!scale-150 transition-all duration-200 !-top-2.5"
      />
      
      {/* Diamond Shape Container */}
      <div className="relative w-[160px] h-[100px] flex items-center justify-center">
        {/* Diamond Background */}
        <div
          className={`
            absolute inset-0
            bg-gradient-to-br from-amber-900/80 via-amber-800/60 to-orange-900/80
            backdrop-blur-xl
            border-2 transition-all duration-300
            ${selected 
              ? 'border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.4)]' 
              : isHovered
                ? 'border-amber-500/70 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                : 'border-amber-600/50'
            }
          `}
          style={{
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 py-2">
          <div className="text-xl mb-1">⚡</div>
          <div className="text-[10px] text-amber-300/80 mb-1">Score above</div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-lg font-bold text-white bg-black/30 px-3 py-0.5 rounded
                hover:bg-black/50 transition-colors"
            >
              {threshold}
            </button>
          ) : (
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
              onBlur={() => updateThreshold(threshold)}
              onKeyDown={(e) => e.key === 'Enter' && updateThreshold(threshold)}
              className="w-14 text-center text-lg font-bold bg-slate-900 text-white rounded px-2 py-0.5 outline-none"
              autoFocus
              min={0}
              max={100}
            />
          )}
        </div>
      </div>
      
      {/* Branch Labels */}
      <div className="absolute -bottom-5 left-0 right-0 flex justify-between px-2 text-[9px] font-medium">
        <span className="text-emerald-400">✓ Pass</span>
        <span className="text-red-400">✗ Fail</span>
      </div>
      
      {/* Output Handle - True (Left-Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="!w-5 !h-5 !bg-emerald-400 !border-2 !border-emerald-300 !rounded-full
          hover:!bg-emerald-300 hover:!scale-150 transition-all duration-200
          !left-[25%] !-translate-x-1/2 !-bottom-2.5"
        style={{ left: '25%' }}
      />
      
      {/* Output Handle - False (Right-Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="!w-5 !h-5 !bg-red-400 !border-2 !border-red-300 !rounded-full
          hover:!bg-red-300 hover:!scale-150 transition-all duration-200
          !left-[75%] !-translate-x-1/2 !-bottom-2.5"
        style={{ left: '75%' }}
      />
    </div>
  );
}

export const ConditionNode = memo(ConditionNodeComponent);
export default ConditionNode;
