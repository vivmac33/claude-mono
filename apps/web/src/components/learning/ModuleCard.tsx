// ═══════════════════════════════════════════════════════════════════════════
// MODULE CARD
// Individual learning module display card
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { LearningModule, DifficultyLevel } from '@/lib/learning';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/components/ThemeProvider';

interface ModuleCardProps {
  module: LearningModule;
  isCompleted?: boolean;
  progress?: number;
  onStart?: () => void;
  onContinue?: () => void;
}

const difficultyStyles: Record<DifficultyLevel, { badge: string; badgeLight: string; border: string }> = {
  beginner: {
    badge: 'bg-green-500/20 text-green-400 border border-green-500/30',
    badgeLight: 'bg-green-100 text-green-700 border border-green-300',
    border: 'hover:border-green-500/50',
  },
  intermediate: {
    badge: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    badgeLight: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    border: 'hover:border-yellow-500/50',
  },
  advanced: {
    badge: 'bg-red-500/20 text-red-400 border border-red-500/30',
    badgeLight: 'bg-red-100 text-red-700 border border-red-300',
    border: 'hover:border-red-500/50',
  },
};

const categoryIcons: Record<string, React.ReactNode> = {
  concepts: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  strategies: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  analysis: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  tutorials: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
};

export function ModuleCard({ module, isCompleted, progress, onStart, onContinue }: ModuleCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = difficultyStyles[module.difficulty];
  const hasProgress = progress !== undefined && progress > 0 && progress < 100;

  return (
    <div
      className={`
        rounded-xl border p-5 transition-all duration-300
        ${isDark 
          ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/80' 
          : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm hover:shadow-md'
        }
        ${styles.border}
      `}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <div className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {categoryIcons[module.category]}
          <span className="text-sm font-semibold">{module.title}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isDark ? styles.badge : styles.badgeLight}`}>
          {module.difficulty}
        </span>
      </div>

      {/* Description */}
      <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        {module.description}
      </p>

      {/* Progress Bar (if in progress) */}
      {hasProgress && (
        <div className="mb-4">
          <Progress 
            value={progress} 
            size="sm" 
            showLabel 
            animated
          />
        </div>
      )}

      {/* Completed Progress Bar */}
      {isCompleted && (
        <div className="mb-4">
          <Progress 
            value={100} 
            size="sm" 
            variant="success"
          />
        </div>
      )}

      {/* Footer Row */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-4 text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          {/* Duration */}
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{module.durationMinutes} min</span>
          </div>

          {/* Rating */}
          {module.rating && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{module.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {isCompleted ? (
          <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Completed</span>
          </div>
        ) : hasProgress ? (
          <button
            onClick={onContinue}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              isDark 
                ? 'text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-500/50'
                : 'text-blue-600 hover:text-blue-700 border border-blue-300 hover:border-blue-400 bg-blue-50'
            }`}
          >
            Continue
          </button>
        ) : (
          <button
            onClick={onStart}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              isDark 
                ? 'text-white bg-slate-700 hover:bg-slate-600'
                : 'text-white bg-slate-800 hover:bg-slate-700'
            }`}
          >
            Start Learning
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Module Card Grid
// ─────────────────────────────────────────────────────────────────────────────

interface ModuleGridProps {
  modules: LearningModule[];
  completedModules?: string[];
  moduleProgress?: Record<string, number>;
  onModuleSelect?: (module: LearningModule) => void;
}

export function ModuleGrid({ modules, completedModules = [], moduleProgress = {}, onModuleSelect }: ModuleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {modules.map(module => (
        <ModuleCard
          key={module.id}
          module={module}
          isCompleted={completedModules.includes(module.id)}
          progress={moduleProgress[module.id]}
          onStart={() => onModuleSelect?.(module)}
          onContinue={() => onModuleSelect?.(module)}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Category Tabs
// ─────────────────────────────────────────────────────────────────────────────

interface CategoryTabsProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const ALL_CATEGORY_IDS = ['concepts', 'strategies', 'analysis', 'tutorials'] as const;

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const categories = [
    { id: null as string | null, label: 'All', icon: categoryIcons.concepts },
    { id: 'concepts', label: 'Concepts', icon: categoryIcons.concepts },
    { id: 'strategies', label: 'Strategies', icon: categoryIcons.strategies },
    { id: 'analysis', label: 'Analysis', icon: categoryIcons.analysis },
    { id: 'tutorials', label: 'Tutorials', icon: categoryIcons.tutorials },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {categories.map(cat => (
        <button
          key={cat.id || 'all'}
          onClick={() => onCategoryChange(cat.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
            whitespace-nowrap transition-all duration-200
            ${activeCategory === cat.id
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }
          `}
        >
          {cat.icon}
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}

export default ModuleCard;
