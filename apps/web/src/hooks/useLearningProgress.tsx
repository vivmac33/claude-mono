// ═══════════════════════════════════════════════════════════════════════════
// LEARNING STATE MANAGEMENT
// Persistent state for learning progress using localStorage
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { LearningModule, LearningPath, getModuleById, getPathById } from '@/lib/learning';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface LearningProgress {
  completedModules: string[];
  moduleProgress: Record<string, number>;  // moduleId -> percentage (0-100)
  activePath: string | null;
  completedPaths: string[];
  quizScores: Record<string, number>;      // moduleId -> score percentage
  lastActivity: string | null;             // ISO date string
  totalTimeSpent: number;                  // minutes
  streak: {
    current: number;
    longest: number;
    lastDate: string | null;
  };
  bookmarks: string[];                     // moduleId or conceptId
  notes: Record<string, string>;           // moduleId -> user notes
}

export interface LearningStats {
  totalModulesCompleted: number;
  totalPathsCompleted: number;
  averageQuizScore: number;
  currentStreak: number;
  totalTimeSpent: number;
  progressPercentage: number;
}

interface LearningContextValue {
  progress: LearningProgress;
  stats: LearningStats;
  // Module actions
  startModule: (moduleId: string) => void;
  completeModule: (moduleId: string, quizScore?: number) => void;
  updateModuleProgress: (moduleId: string, percentage: number) => void;
  // Path actions
  startPath: (pathId: string) => void;
  completePath: (pathId: string) => void;
  // Bookmark actions
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  // Notes
  saveNote: (moduleId: string, note: string) => void;
  getNote: (moduleId: string) => string;
  // Time tracking
  logTimeSpent: (minutes: number) => void;
  // Reset
  resetProgress: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'monomorph_learning_progress';
const TOTAL_MODULES = 10; // Update this as you add more modules

const DEFAULT_PROGRESS: LearningProgress = {
  completedModules: [],
  moduleProgress: {},
  activePath: null,
  completedPaths: [],
  quizScores: {},
  lastActivity: null,
  totalTimeSpent: 0,
  streak: {
    current: 0,
    longest: 0,
    lastDate: null,
  },
  bookmarks: [],
  notes: {},
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function loadProgress(): LearningProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle new fields
      return { ...DEFAULT_PROGRESS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load learning progress:', e);
  }
  return DEFAULT_PROGRESS;
}

function saveProgress(progress: LearningProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save learning progress:', e);
  }
}

function calculateStats(progress: LearningProgress): LearningStats {
  const quizScores = Object.values(progress.quizScores);
  const averageQuizScore = quizScores.length > 0
    ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length
    : 0;

  return {
    totalModulesCompleted: progress.completedModules.length,
    totalPathsCompleted: progress.completedPaths.length,
    averageQuizScore: Math.round(averageQuizScore),
    currentStreak: progress.streak.current,
    totalTimeSpent: progress.totalTimeSpent,
    progressPercentage: Math.round((progress.completedModules.length / TOTAL_MODULES) * 100),
  };
}

function updateStreak(progress: LearningProgress): LearningProgress['streak'] {
  const today = new Date().toISOString().split('T')[0];
  const lastDate = progress.streak.lastDate;

  if (!lastDate) {
    // First activity
    return {
      current: 1,
      longest: 1,
      lastDate: today,
    };
  }

  if (lastDate === today) {
    // Already logged today
    return progress.streak;
  }

  const lastDateObj = new Date(lastDate);
  const todayObj = new Date(today);
  const diffDays = Math.floor((todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day
    const newCurrent = progress.streak.current + 1;
    return {
      current: newCurrent,
      longest: Math.max(newCurrent, progress.streak.longest),
      lastDate: today,
    };
  } else {
    // Streak broken
    return {
      current: 1,
      longest: progress.streak.longest,
      lastDate: today,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function useLearningProgress() {
  const [progress, setProgress] = useState<LearningProgress>(loadProgress);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Calculate stats
  const stats = calculateStats(progress);

  // ─────────────────────────────────────────────────────────────────────────
  // Module Actions
  // ─────────────────────────────────────────────────────────────────────────

  const startModule = useCallback((moduleId: string) => {
    setProgress(prev => {
      // Only set initial progress if not already started
      if (prev.moduleProgress[moduleId] !== undefined) return prev;

      return {
        ...prev,
        moduleProgress: {
          ...prev.moduleProgress,
          [moduleId]: 0,
        },
        lastActivity: new Date().toISOString(),
        streak: updateStreak(prev),
      };
    });
  }, []);

  const completeModule = useCallback((moduleId: string, quizScore?: number) => {
    setProgress(prev => {
      const newCompleted = prev.completedModules.includes(moduleId)
        ? prev.completedModules
        : [...prev.completedModules, moduleId];

      return {
        ...prev,
        completedModules: newCompleted,
        moduleProgress: {
          ...prev.moduleProgress,
          [moduleId]: 100,
        },
        quizScores: quizScore !== undefined
          ? { ...prev.quizScores, [moduleId]: quizScore }
          : prev.quizScores,
        lastActivity: new Date().toISOString(),
        streak: updateStreak(prev),
      };
    });
  }, []);

  const updateModuleProgress = useCallback((moduleId: string, percentage: number) => {
    setProgress(prev => ({
      ...prev,
      moduleProgress: {
        ...prev.moduleProgress,
        [moduleId]: Math.min(100, Math.max(0, percentage)),
      },
      lastActivity: new Date().toISOString(),
      streak: updateStreak(prev),
    }));
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Path Actions
  // ─────────────────────────────────────────────────────────────────────────

  const startPath = useCallback((pathId: string) => {
    setProgress(prev => ({
      ...prev,
      activePath: pathId,
      lastActivity: new Date().toISOString(),
      streak: updateStreak(prev),
    }));
  }, []);

  const completePath = useCallback((pathId: string) => {
    setProgress(prev => {
      const newCompleted = prev.completedPaths.includes(pathId)
        ? prev.completedPaths
        : [...prev.completedPaths, pathId];

      return {
        ...prev,
        completedPaths: newCompleted,
        activePath: prev.activePath === pathId ? null : prev.activePath,
        lastActivity: new Date().toISOString(),
        streak: updateStreak(prev),
      };
    });
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Bookmark Actions
  // ─────────────────────────────────────────────────────────────────────────

  const toggleBookmark = useCallback((id: string) => {
    setProgress(prev => {
      const isBookmarked = prev.bookmarks.includes(id);
      return {
        ...prev,
        bookmarks: isBookmarked
          ? prev.bookmarks.filter(b => b !== id)
          : [...prev.bookmarks, id],
      };
    });
  }, []);

  const isBookmarked = useCallback((id: string) => {
    return progress.bookmarks.includes(id);
  }, [progress.bookmarks]);

  // ─────────────────────────────────────────────────────────────────────────
  // Notes
  // ─────────────────────────────────────────────────────────────────────────

  const saveNote = useCallback((moduleId: string, note: string) => {
    setProgress(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [moduleId]: note,
      },
    }));
  }, []);

  const getNote = useCallback((moduleId: string) => {
    return progress.notes[moduleId] || '';
  }, [progress.notes]);

  // ─────────────────────────────────────────────────────────────────────────
  // Time Tracking
  // ─────────────────────────────────────────────────────────────────────────

  const logTimeSpent = useCallback((minutes: number) => {
    setProgress(prev => ({
      ...prev,
      totalTimeSpent: prev.totalTimeSpent + minutes,
      lastActivity: new Date().toISOString(),
      streak: updateStreak(prev),
    }));
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Reset
  // ─────────────────────────────────────────────────────────────────────────

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return {
    progress,
    stats,
    startModule,
    completeModule,
    updateModuleProgress,
    startPath,
    completePath,
    toggleBookmark,
    isBookmarked,
    saveNote,
    getNote,
    logTimeSpent,
    resetProgress,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT (for global access)
// ─────────────────────────────────────────────────────────────────────────────

const LearningContext = createContext<LearningContextValue | null>(null);

export function LearningProvider({ children }: { children: ReactNode }) {
  const learning = useLearningProgress();

  return (
    <LearningContext.Provider value={learning}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default useLearningProgress;
