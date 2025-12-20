// ═══════════════════════════════════════════════════════════════════════════
// LEARNING PATH CARD
// Display card for learning paths with progress tracking
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { LearningPath, calculatePathProgress } from '@/lib/learning';
import { Progress } from '@/components/ui/progress';

interface LearningPathCardProps {
  path: LearningPath;
  completedModules: string[];
  isActive?: boolean;
  compact?: boolean;
  onSelect?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Zap: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Clock: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  TrendingUp: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Target: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Landmark: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
  ),
  GraduationCap: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4-3l4 3 4-3" />
    </svg>
  ),
};

export function LearningPathCard({
  path,
  completedModules,
  isActive,
  compact,
  onSelect,
}: LearningPathCardProps) {
  const progress = calculatePathProgress(path.id, completedModules);
  const allModules = path.stages.flatMap(s => s.moduleIds);
  const completedCount = allModules.filter(m => completedModules.includes(m)).length;
  
  // Determine progress variant
  const progressVariant = progress === 100 ? 'success' : progress > 0 ? 'default' : 'default';

  if (compact) {
    return (
      <button
        onClick={onSelect}
        className={`
          w-full p-4 rounded-xl border text-left transition-all
          ${isActive
            ? 'bg-blue-500/10 border-blue-500/50'
            : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
          }
        `}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${path.color}`}>
            {iconMap[path.icon] || iconMap.GraduationCap}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{path.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{path.description}</p>
            
            {/* Progress */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>{path.stages.length} stages</span>
                <span>{progress}%</span>
              </div>
              <Progress 
                value={progress} 
                size="sm" 
                variant={progressVariant}
              />
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div
      className={`
        rounded-2xl border overflow-hidden transition-all
        ${isActive
          ? 'border-blue-500/50 shadow-lg shadow-blue-500/10'
          : 'border-slate-700/50 hover:border-slate-600'
        }
      `}
    >
      {/* Header with gradient */}
      <div className={`p-6 bg-gradient-to-r ${path.color}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              {iconMap[path.icon] || iconMap.GraduationCap}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{path.name}</h3>
              {path.persona && (
                <span className="text-xs text-white/70 uppercase tracking-wide">
                  {path.persona} path
                </span>
              )}
            </div>
          </div>
          
          {isActive && (
            <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
              Active
            </span>
          )}
        </div>
        
        <p className="text-white/80 mt-3">{path.description}</p>
        
        <div className="flex items-center gap-4 mt-4 text-sm text-white/70">
          <span>{path.stages.length} stages</span>
          <span>~{path.estimatedHours} hours</span>
          <span>{allModules.length} modules</span>
        </div>
      </div>

      {/* Progress section */}
      <div className="p-6 bg-slate-800/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Progress</span>
          <span className="text-sm font-medium text-white">{completedCount}/{allModules.length} completed</span>
        </div>
        
        <Progress 
          value={progress} 
          size="md" 
          variant={progressVariant}
          animated={progress > 0 && progress < 100}
        />

        {/* Stage indicators */}
        <div className="flex items-center gap-2 mt-4">
          {path.stages.map((stage, i) => {
            const stageComplete = stage.moduleIds.every(m => completedModules.includes(m));
            const stageStarted = stage.moduleIds.some(m => completedModules.includes(m));
            
            return (
              <div
                key={i}
                className={`
                  flex-1 h-1 rounded-full transition-colors
                  ${stageComplete
                    ? `bg-gradient-to-r ${path.color}`
                    : stageStarted
                    ? 'bg-blue-500/50'
                    : 'bg-slate-700'
                  }
                `}
                title={stage.name}
              />
            );
          })}
        </div>

        {/* Action button */}
        <button
          onClick={onSelect}
          className="w-full mt-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
        >
          {progress === 0 ? 'Start Path' : progress === 100 ? 'Review Path' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Path Progress Component (for header/sidebar)
// ─────────────────────────────────────────────────────────────────────────────

interface PathProgressProps {
  path: LearningPath;
  completedModules: string[];
  showStages?: boolean;
}

export function PathProgress({ path, completedModules, showStages }: PathProgressProps) {
  const progress = calculatePathProgress(path.id, completedModules);
  const progressVariant = progress === 100 ? 'success' : 'default';

  return (
    <div className="flex items-center gap-3">
      <div className={`p-1.5 rounded-lg bg-gradient-to-r ${path.color}`}>
        {iconMap[path.icon] || iconMap.GraduationCap}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-white">{path.name}</span>
          <span className="text-xs text-slate-400">{progress}%</span>
        </div>
        
        {showStages ? (
          <div className="flex items-center gap-1">
            {path.stages.map((stage, i) => {
              const stageComplete = stage.moduleIds.every(m => completedModules.includes(m));
              return (
                <div
                  key={i}
                  className={`
                    flex-1 h-1.5 rounded-full
                    ${stageComplete ? `bg-gradient-to-r ${path.color}` : 'bg-slate-700'}
                  `}
                />
              );
            })}
          </div>
        ) : (
          <Progress value={progress} size="sm" variant={progressVariant} />
        )}
      </div>
    </div>
  );
}

export default LearningPathCard;
