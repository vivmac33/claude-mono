// ═══════════════════════════════════════════════════════════════════════════
// MERGE NODE
// Combines multiple workflow paths into one
// ═══════════════════════════════════════════════════════════════════════════

import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { MergeNodeData } from '../types';

interface MergeNodeComponentProps {
  data: MergeNodeData;
  selected: boolean;
}

function MergeNodeComponent({ data, selected }: MergeNodeComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const strategyLabels = {
    all: 'Wait for all',
    any: 'First to complete',
    first: 'First input only',
  };
  
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
      {/* Multiple Input Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="input-1"
        className="!w-5 !h-5 !bg-violet-400 !border-2 !border-violet-300 !rounded-full
          hover:!bg-violet-300 hover:!scale-150 transition-all duration-200 !-top-2.5"
        style={{ left: '30%' }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="input-2"
        className="!w-5 !h-5 !bg-violet-400 !border-2 !border-violet-300 !rounded-full
          hover:!bg-violet-300 hover:!scale-150 transition-all duration-200 !-top-2.5"
        style={{ left: '70%' }}
      />
      
      {/* Hexagon Shape Container */}
      <div className="relative w-[140px] h-[80px] flex items-center justify-center">
        {/* Hexagon Background */}
        <div
          className={`
            absolute inset-0
            bg-gradient-to-br from-violet-900/80 via-purple-800/60 to-fuchsia-900/80
            backdrop-blur-xl
            border-2 transition-all duration-300
            ${selected 
              ? 'border-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.4)]' 
              : isHovered
                ? 'border-violet-500/70 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                : 'border-violet-600/50'
            }
          `}
          style={{
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 text-center px-3 py-2">
          {/* Icon */}
          <div className="text-xl mb-0.5">🔀</div>
          
          {/* Label */}
          <div className="text-[10px] font-medium text-violet-200">
            {data.label || 'Merge'}
          </div>
          
          {/* Strategy */}
          <div className="text-[9px] text-violet-400/70">
            {strategyLabels[data.mergeStrategy] || 'Wait for all'}
          </div>
        </div>
      </div>
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-5 !h-5 !bg-violet-400 !border-2 !border-violet-300 !rounded-full
          hover:!bg-violet-300 hover:!scale-150 transition-all duration-200 !-bottom-2.5"
      />
    </div>
  );
}

export const MergeNode = memo(MergeNodeComponent);
export default MergeNode;
