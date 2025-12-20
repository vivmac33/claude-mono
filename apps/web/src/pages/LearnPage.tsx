// ═══════════════════════════════════════════════════════════════════════════
// LEARN PAGE
// Main learning page with state management integration
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import {
  ALL_MODULES,
  LearningModule,
  getAllPaths,
  LearningPath,
  BEGINNER_PATH,
  PERSONA_PATHS,
  getModuleById,
  calculatePathProgress,
} from '@/lib/learning';
import { VisualLearningMap } from '@/components/learning/VisualLearningMap';
import { ModuleCard, ModuleGrid } from '@/components/learning/ModuleCard';
import { LearningPathCard, PathProgress } from '@/components/learning/LearningPathCard';
import { useLearningProgress, LearningStats } from '@/hooks/useLearningProgress';
import { FlashcardDeck } from '@/components/learning/FlashcardDeck';
import { FLASHCARD_DECKS, FlashcardDeck as FlashcardDeckType } from '@/lib/learning/flashcards';
import { TOOL_EDUCATION, ToolEducation } from '@/lib/learning/toolEducation';
import { WORKFLOW_TEMPLATES } from '@/components/workflow/templates';
import { cardRegistry, CATEGORIES } from '@/registry/cardRegistry';
import { useTheme } from '@/components/ThemeProvider';
import { NavHeader } from '@/components/layout/NavHeader';

type ViewMode = 'map' | 'modules' | 'paths' | 'tools' | 'flashcards';

// ─────────────────────────────────────────────────────────────────────────────
// STATS DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

function StatsDashboard({ stats, isDark }: { stats: LearningStats; isDark: boolean }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className={`rounded-xl p-4 border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.totalModulesCompleted}</div>
        <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Modules Completed</div>
      </div>
      <div className={`rounded-xl p-4 border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="text-2xl font-bold text-blue-500">{stats.progressPercentage}%</div>
        <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Overall Progress</div>
      </div>
      <div className={`rounded-xl p-4 border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="text-2xl font-bold text-amber-500">{stats.currentStreak}</div>
        <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Day Streak 🔥</div>
      </div>
      <div className={`rounded-xl p-4 border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="text-2xl font-bold text-emerald-500">{stats.averageQuizScore}%</div>
        <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Avg Quiz Score</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────────────

interface ModuleDetailModalProps {
  module: LearningModule;
  isCompleted: boolean;
  progress?: number;
  onClose: () => void;
  onComplete: (quizScore?: number) => void;
  onProgressUpdate: (percentage: number) => void;
}

function ModuleDetailModal({ 
  module, 
  isCompleted, 
  progress = 0, 
  onClose, 
  onComplete,
  onProgressUpdate 
}: ModuleDetailModalProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Update progress when changing sections
  useEffect(() => {
    const newProgress = Math.round(((activeSection + 1) / module.sections.length) * 100);
    if (newProgress > progress) {
      onProgressUpdate(newProgress);
    }
  }, [activeSection, module.sections.length, progress, onProgressUpdate]);

  const handleQuizSubmit = () => {
    if (!module.quiz) return;
    
    let correct = 0;
    module.quiz.questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correctIndex) correct++;
    });
    
    const score = Math.round((correct / module.quiz.questions.length) * 100);
    setQuizSubmitted(true);
    
    if (score >= module.quiz.passingScore) {
      onComplete(score);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{module.title}</h2>
            <p className="text-sm text-slate-400 mt-1">{module.description}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 ml-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-700">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {!showQuiz ? (
          <>
            {/* Section Navigation */}
            <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-700 overflow-x-auto">
              {module.sections.map((section, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSection(i)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                    ${activeSection === i
                      ? 'bg-blue-600 text-white'
                      : i <= Math.floor((progress / 100) * module.sections.length)
                      ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                      : 'text-slate-500 hover:text-slate-400 hover:bg-slate-700/50'
                    }
                  `}
                >
                  {i + 1}. {section.title}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-invert prose-sm max-w-none">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {module.sections[activeSection].title}
                </h3>
                <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                  {module.sections[activeSection].content}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-700 bg-slate-800/50">
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>{module.durationMinutes} min read</span>
                <span>Section {activeSection + 1} of {module.sections.length}</span>
              </div>

              <div className="flex items-center gap-3">
                {activeSection > 0 && (
                  <button
                    onClick={() => setActiveSection(activeSection - 1)}
                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    ← Previous
                  </button>
                )}
                {activeSection < module.sections.length - 1 ? (
                  <button
                    onClick={() => setActiveSection(activeSection + 1)}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    Next →
                  </button>
                ) : module.quiz ? (
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                  >
                    Take Quiz →
                  </button>
                ) : (
                  <button
                    onClick={() => onComplete()}
                    className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                  >
                    {isCompleted ? 'Review Complete' : 'Mark Complete'}
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Quiz View */
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Quiz: Test Your Knowledge</h3>
            
            {module.quiz?.questions.map((question, qi) => (
              <div key={qi} className="mb-6 p-4 bg-slate-700/30 rounded-xl">
                <p className="font-medium text-white mb-3">{qi + 1}. {question.question}</p>
                <div className="space-y-2">
                  {question.options.map((option, oi) => {
                    const isSelected = quizAnswers[qi] === oi;
                    const isCorrect = question.correctIndex === oi;
                    const showResult = quizSubmitted;
                    
                    return (
                      <button
                        key={oi}
                        onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                        disabled={quizSubmitted}
                        className={`
                          w-full text-left px-4 py-2 rounded-lg border transition-colors
                          ${showResult
                            ? isCorrect
                              ? 'bg-green-500/20 border-green-500 text-green-400'
                              : isSelected
                              ? 'bg-red-500/20 border-red-500 text-red-400'
                              : 'bg-slate-700/50 border-slate-600 text-slate-400'
                            : isSelected
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                            : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                          }
                        `}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && (
                  <p className="mt-3 text-sm text-slate-400">
                    {question.explanation}
                  </p>
                )}
              </div>
            ))}

            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <button
                onClick={() => {
                  setShowQuiz(false);
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                }}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
              >
                ← Back to Content
              </button>
              
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length < (module.quiz?.questions.length || 0)}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PATH DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────────────

interface PathDetailModalProps {
  path: LearningPath;
  completedModules: string[];
  onClose: () => void;
  onStartModule: (module: LearningModule) => void;
  onStartPath: () => void;
}

function PathDetailModal({ path, completedModules, onClose, onStartModule, onStartPath }: PathDetailModalProps) {
  const progress = calculatePathProgress(path.id, completedModules);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${path.color}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{path.name}</h2>
              <p className="text-white/80 mt-1">{path.description}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-4 mt-4 text-white/80 text-sm">
            <span>{path.stages.length} stages</span>
            <span>~{path.estimatedHours} hours</span>
            <span>{progress}% complete</span>
          </div>
        </div>

        {/* Stages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {path.stages.map((stage, i) => {
              const stageModules = ALL_MODULES.filter(m => stage.moduleIds.includes(m.id));
              const stageComplete = stage.moduleIds.length === 0 || stage.moduleIds.every(id => completedModules.includes(id));
              const stageStarted = stage.moduleIds.some(id => completedModules.includes(id));

              return (
                <div
                  key={i}
                  className={`
                    p-4 rounded-xl border transition-colors
                    ${stageComplete
                      ? 'bg-green-500/10 border-green-500/30'
                      : stageStarted
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : 'bg-slate-700/30 border-slate-600/30'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    {/* Stage Number */}
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                      ${stageComplete
                        ? 'bg-green-500 text-white'
                        : stageStarted
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-600 text-slate-300'
                      }
                    `}>
                      {stageComplete ? '✓' : i + 1}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{stage.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{stage.description}</p>
                      
                      {/* Milestone */}
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Milestone: {stage.milestone}</span>
                      </div>

                      {/* Modules */}
                      {stageModules.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {stageModules.map(module => (
                            <button
                              key={module.id}
                              onClick={() => onStartModule(module)}
                              className={`
                                px-3 py-1 rounded text-xs font-medium transition-colors
                                ${completedModules.includes(module.id)
                                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                  : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                }
                              `}
                            >
                              {module.title}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Practice Task */}
                      {stage.practiceTask && (
                        <div className="mt-3 p-2 bg-slate-900/50 rounded text-xs text-slate-400">
                          <span className="text-slate-500">Practice:</span> {stage.practiceTask}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-800/50">
          <button 
            onClick={onStartPath}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
          >
            {progress === 0 ? 'Start This Path' : progress === 100 ? 'Review Path' : 'Continue Path'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLS & WORKFLOWS VIEW
// ─────────────────────────────────────────────────────────────────────────────

function ToolsAndWorkflowsView() {
  const [activeTab, setActiveTab] = useState<'tools' | 'workflows'>('tools');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);

  // Handle URL param for direct tool linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const toolParam = params.get('tool');
    if (toolParam && TOOL_EDUCATION[toolParam]) {
      setExpandedTool(toolParam);
      // Scroll to tool after a short delay to allow render
      setTimeout(() => {
        const element = document.getElementById(`tool-${toolParam}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, []);

  // Category display names
  const categoryNames: Record<string, string> = {
    'overview': 'Overview',
    'value': 'Valuation',
    'growth': 'Growth & Earnings',
    'risk': 'Risk Analysis',
    'cashflow': 'Cash Flow',
    'income': 'Income & Dividends',
    'technical': 'Technical Analysis',
    'macro': 'Macro & Events',
    'portfolio': 'Portfolio',
    'derivatives': 'Derivatives & F&O',
    'mini': 'Mini Cards',
  };

  // Category order for display
  const categoryOrder = ['overview', 'value', 'growth', 'risk', 'cashflow', 'income', 'technical', 'derivatives', 'macro', 'portfolio', 'mini'];

  // Group tools by their actual category from cardRegistry
  const toolsByCategory = Object.values(TOOL_EDUCATION).reduce((acc, tool) => {
    // Find the card in registry to get its category
    const card = cardRegistry.find(c => c.id === tool.toolId);
    const categoryId = card?.category || 'other';
    const categoryName = categoryNames[categoryId] || 'Other';
    
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(tool);
    return acc;
  }, {} as Record<string, ToolEducation[]>);

  // Sort categories according to order
  const sortedCategories = Object.entries(toolsByCategory).sort((a, b) => {
    const aKey = Object.entries(categoryNames).find(([_, name]) => name === a[0])?.[0] || 'zzz';
    const bKey = Object.entries(categoryNames).find(([_, name]) => name === b[0])?.[0] || 'zzz';
    return categoryOrder.indexOf(aKey) - categoryOrder.indexOf(bKey);
  });

  const filteredTools = searchQuery 
    ? Object.values(TOOL_EDUCATION).filter(t => 
        t.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.quickTip.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const filteredWorkflows = searchQuery
    ? WORKFLOW_TEMPLATES.filter(w =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : WORKFLOW_TEMPLATES;

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'tools' 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          📊 Tools ({Object.keys(TOOL_EDUCATION).length})
        </button>
        <button
          onClick={() => setActiveTab('workflows')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'workflows' 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          🔗 Workflows ({WORKFLOW_TEMPLATES.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Tools Tab */}
      {activeTab === 'tools' && (
        <div className="space-y-8">
          {filteredTools ? (
            <div className="space-y-3">
              <h3 className="text-sm text-slate-400">{filteredTools.length} results</h3>
              {filteredTools.map(tool => (
                <ToolEducationCard 
                  key={tool.toolId} 
                  tool={tool} 
                  isExpanded={expandedTool === tool.toolId}
                  onToggle={() => setExpandedTool(expandedTool === tool.toolId ? null : tool.toolId)}
                />
              ))}
            </div>
          ) : (
            sortedCategories.map(([category, tools]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  {category}
                  <span className="text-xs text-slate-500 font-normal">({tools.length} tools)</span>
                </h3>
                <div className="space-y-3">
                  {tools.map(tool => (
                    <ToolEducationCard 
                      key={tool.toolId} 
                      tool={tool}
                      isExpanded={expandedTool === tool.toolId}
                      onToggle={() => setExpandedTool(expandedTool === tool.toolId ? null : tool.toolId)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Workflows Tab */}
      {activeTab === 'workflows' && (
        <div className="space-y-4">
          {filteredWorkflows.map(workflow => (
            <WorkflowEducationCard 
              key={workflow.id} 
              workflow={workflow}
              isExpanded={expandedWorkflow === workflow.id}
              onToggle={() => setExpandedWorkflow(expandedWorkflow === workflow.id ? null : workflow.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Tool Education Card
function ToolEducationCard({ tool, isExpanded, onToggle }: { tool: ToolEducation; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div 
      id={`tool-${tool.toolId}`}
      className={`bg-slate-800/30 border rounded-xl overflow-hidden transition-all ${
        isExpanded ? 'border-blue-500/50 ring-1 ring-blue-500/20' : 'border-slate-700/50'
      }`}
    >
      <button 
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
      >
        <div>
          <h4 className="font-medium text-white">{tool.toolName}</h4>
          <p className="text-sm text-slate-400 mt-1">{tool.quickTip}</p>
        </div>
        <svg 
          className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-700/50 pt-4 space-y-4">
          {/* Key Terms */}
          {tool.keyTerms.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-white mb-2">Key Terms & Formulas</h5>
              <div className="space-y-2">
                {tool.keyTerms.map((term, i) => (
                  <div key={i} className="bg-slate-900/50 rounded-lg p-3">
                    <div className="font-medium text-blue-400 text-sm">{term.term}</div>
                    <p className="text-xs text-slate-400 mt-1">{term.definition}</p>
                    {term.formula && (
                      <code className="block mt-2 text-xs text-green-400 bg-slate-800 px-2 py-1 rounded font-mono">
                        {term.formula}
                      </code>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How to Use */}
          {tool.howToUse.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-white mb-2">How to Use</h5>
              <ol className="space-y-1">
                {tool.howToUse.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-blue-400 font-medium">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Pro Tips */}
          {tool.proTips.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-white mb-2">💡 Pro Tips</h5>
              <ul className="space-y-1">
                {tool.proTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-yellow-400">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQs */}
          {tool.commonQuestions.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-white mb-2">❓ Common Questions</h5>
              <div className="space-y-2">
                {tool.commonQuestions.map((faq, i) => (
                  <div key={i} className="bg-slate-700/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-white">{faq.question}</p>
                    <p className="text-xs text-slate-400 mt-1">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Link to tool */}
          <a 
            href={`#/explore?highlight=${tool.toolId}`}
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Open in Tool Explorer →
          </a>
        </div>
      )}
    </div>
  );
}

// Workflow Education Card
function WorkflowEducationCard({ workflow, isExpanded, onToggle }: { 
  workflow: typeof WORKFLOW_TEMPLATES[0]; 
  isExpanded: boolean; 
  onToggle: () => void;
}) {
  const categoryColors: Record<string, string> = {
    'fundamental': 'bg-blue-500/20 text-blue-400',
    'technical': 'bg-purple-500/20 text-purple-400',
    'risk': 'bg-red-500/20 text-red-400',
    'income': 'bg-green-500/20 text-green-400',
    'macro': 'bg-amber-500/20 text-amber-400',
    'derivatives': 'bg-pink-500/20 text-pink-400',
    'portfolio': 'bg-indigo-500/20 text-indigo-400',
  };

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
      <button 
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-white">{workflow.name}</h4>
            <span className={`px-2 py-0.5 text-xs rounded-full ${categoryColors[workflow.category] || 'bg-slate-500/20 text-slate-400'}`}>
              {workflow.category}
            </span>
          </div>
          <p className="text-sm text-slate-400">{workflow.description}</p>
        </div>
        <svg 
          className={`w-5 h-5 text-slate-400 transition-transform ml-4 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-700/50 pt-4 space-y-4">
          {/* What this workflow identifies */}
          <div>
            <h5 className="text-sm font-medium text-white mb-2">🎯 What This Workflow Identifies</h5>
            <p className="text-sm text-slate-300">
              {getWorkflowPurpose(workflow)}
            </p>
          </div>

          {/* Cards included */}
          <div>
            <h5 className="text-sm font-medium text-white mb-2">📊 Tools Included ({workflow.nodes?.length || 0})</h5>
            <div className="flex flex-wrap gap-2">
              {(workflow.nodes || []).map((node, idx) => (
                <span 
                  key={`${node.data?.cardId || idx}`}
                  className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300"
                >
                  {(node.data?.cardId || 'unknown').split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Best for */}
          <div>
            <h5 className="text-sm font-medium text-white mb-2">👤 Best For</h5>
            <p className="text-sm text-slate-300">
              {getWorkflowAudience(workflow)}
            </p>
          </div>

          {/* Link to workflow builder */}
          <a 
            href={`#/workflow?template=${workflow.id}`}
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Open in Workflow Builder →
          </a>
        </div>
      )}
    </div>
  );
}

// Helper function to describe workflow purpose
function getWorkflowPurpose(workflow: typeof WORKFLOW_TEMPLATES[0]): string {
  const purposes: Record<string, string> = {
    'value-investor-suite': 'Identifies undervalued stocks using DCF analysis, Graham criteria, and multi-factor scoring. Compares intrinsic value to market price to find margin of safety.',
    'growth-momentum': 'Spots high-growth companies with strong earnings quality and technical momentum. Combines fundamental growth metrics with price trend confirmation.',
    'dividend-income': 'Evaluates dividend sustainability using payout ratios, FCF coverage, and historical stability. Projects future income and identifies dividend growth opportunities.',
    'risk-assessment': 'Comprehensive risk evaluation covering financial health, stress scenarios, and bankruptcy probability. Essential before any investment decision.',
    'technical-complete': 'Full technical analysis including trend strength, momentum, candlestick patterns, and support/resistance levels for timing entries/exits.',
    'earnings-deep-dive': 'Analyzes earnings quality, stability, and surprise history. Detects red flags like profit-cash divergence and accounting anomalies.',
    'fno-momentum': 'Options and futures analysis combining open interest, put-call ratios, and risk metrics for derivative trading decisions.',
    'macro-sensitive': 'Evaluates how macroeconomic factors and events impact your positions. Includes earnings calendar and institutional flow tracking.',
    'quick-health': 'Fast 2-minute checkup covering valuation, risk, and cash flow health. Perfect for initial screening or daily monitoring.',
    'complete-analysis': 'The full picture - fundamental, technical, and risk analysis combined. Use for major investment decisions requiring thorough due diligence.',
  };
  const nodeCount = workflow.nodes?.length || 0;
  return purposes[workflow.id] || `Combines ${nodeCount} analysis tools to provide comprehensive insights on ${workflow.category || 'various'} factors.`;
}

// Helper function to describe target audience
function getWorkflowAudience(workflow: typeof WORKFLOW_TEMPLATES[0]): string {
  const audiences: Record<string, string> = {
    'fundamental': 'Long-term investors focused on intrinsic value and company fundamentals.',
    'technical': 'Active traders who use price action and indicators for timing.',
    'risk': 'Risk-conscious investors who prioritize capital preservation.',
    'income': 'Income-focused investors building dividend portfolios.',
    'macro': 'Investors who track economic cycles and institutional behavior.',
    'derivatives': 'F&O traders looking for high-probability setups.',
    'portfolio': 'Portfolio managers optimizing allocation and correlation.',
  };
  return audiences[workflow.category] || 'All investors looking for structured analysis.';
}

// ─────────────────────────────────────────────────────────────────────────────
// FLASHCARDS VIEW
// ─────────────────────────────────────────────────────────────────────────────

function FlashcardsView() {
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeckType | null>(null);

  if (selectedDeck) {
    return (
      <FlashcardDeck 
        deck={selectedDeck} 
        onClose={() => setSelectedDeck(null)}
        onComplete={(mastered, total) => {
          console.log(`Completed deck: ${mastered}/${total} mastered`);
          setSelectedDeck(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">📚 Flashcard Decks</h2>
        <p className="text-slate-400">
          Reinforce your learning with spaced repetition flashcards organized by trading style
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FLASHCARD_DECKS.map(deck => (
          <div 
            key={deck.pathId}
            className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 hover:border-blue-500/50 transition-all cursor-pointer"
            onClick={() => setSelectedDeck(deck)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg">
                🃏
              </div>
              <div>
                <h3 className="font-semibold text-white">{deck.pathName}</h3>
                <p className="text-xs text-slate-500">{deck.cards.length} cards</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">{deck.description}</p>
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
              Start Practice
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function LearnPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const {
    progress,
    stats,
    startModule,
    completeModule,
    updateModuleProgress,
    startPath,
  } = useLearningProgress();

  const [viewMode, setViewMode] = useState<ViewMode>('modules');
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  // Handle URL params for deep linking (e.g., #/learn?tab=tools&tool=dcf-valuation)
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const tabParam = params.get('tab');
    if (tabParam === 'tools' || tabParam === 'flashcards' || tabParam === 'paths' || tabParam === 'map' || tabParam === 'modules') {
      setViewMode(tabParam as ViewMode);
    }
  }, []);

  // Group modules by difficulty
  const modulesByDifficulty = {
    beginner: ALL_MODULES.filter(m => m.difficulty === 'beginner'),
    intermediate: ALL_MODULES.filter(m => m.difficulty === 'intermediate'),
    advanced: ALL_MODULES.filter(m => m.difficulty === 'advanced'),
  };

  // Sort each difficulty group: in progress first, then incomplete, then completed
  const sortModules = (modules: LearningModule[]) => {
    return [...modules].sort((a, b) => {
      const aProgress = progress.moduleProgress[a.id] || 0;
      const bProgress = progress.moduleProgress[b.id] || 0;
      const aComplete = progress.completedModules.includes(a.id);
      const bComplete = progress.completedModules.includes(b.id);
      
      // In progress first
      if (aProgress > 0 && aProgress < 100 && !(bProgress > 0 && bProgress < 100)) return -1;
      if (bProgress > 0 && bProgress < 100 && !(aProgress > 0 && aProgress < 100)) return 1;
      
      // Then incomplete
      if (!aComplete && bComplete) return -1;
      if (aComplete && !bComplete) return 1;
      
      return 0;
    });
  };

  // Get in-progress modules
  const inProgressModules = ALL_MODULES.filter(m => {
    const p = progress.moduleProgress[m.id];
    return p !== undefined && p > 0 && p < 100;
  });

  const handleModuleSelect = (module: LearningModule) => {
    startModule(module.id);
    setSelectedModule(module);
  };

  const handleModuleComplete = (quizScore?: number) => {
    if (selectedModule) {
      completeModule(selectedModule.id, quizScore);
    }
  };

  const handleProgressUpdate = (percentage: number) => {
    if (selectedModule) {
      updateModuleProgress(selectedModule.id, percentage);
    }
  };

  const handlePathSelect = (path: LearningPath) => {
    setSelectedPath(path);
  };

  const handleStartPath = () => {
    if (selectedPath) {
      startPath(selectedPath.id);
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950' : 'bg-gradient-to-b from-slate-100 via-white to-slate-100'}`}>
      <NavHeader currentPage="learn" />
      
      {/* Header */}
      <div className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Learning Center</h1>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Master trading concepts from basics to advanced strategies
              </p>
            </div>

            {/* Quick stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.totalModulesCompleted}</div>
                <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.progressPercentage}%</div>
                <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Progress</div>
              </div>
              {stats.currentStreak > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stats.currentStreak}🔥</div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Streak</div>
                </div>
              )}
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-2 mt-6 flex-wrap">
            {([
              { id: 'modules', label: 'Modules' },
              { id: 'paths', label: 'Learning Paths' },
              { id: 'tools', label: 'Tools & Workflows' },
              { id: 'flashcards', label: 'Flashcards' },
              { id: 'map', label: 'Visual Map' },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-all
                  ${viewMode === tab.id
                    ? 'bg-blue-600 text-white'
                    : isDark 
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Dashboard (mobile) */}
        <div className="md:hidden mb-6">
          <StatsDashboard stats={stats} isDark={isDark} />
        </div>

        {viewMode === 'map' && (
          <VisualLearningMap
            completedNodes={progress.completedModules}
            onNodeClick={(node) => {
              // Find first module for this node
              const module = ALL_MODULES.find(m => node.moduleIds.includes(m.id));
              if (module) handleModuleSelect(module);
            }}
          />
        )}

        {viewMode === 'modules' && (
          <div className="space-y-8">
            {/* Continue Learning Section */}
            {inProgressModules.length > 0 && (
              <div className="mb-8">
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <span>Continue Learning</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    {inProgressModules.length} in progress
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inProgressModules.slice(0, 2).map(module => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      progress={progress.moduleProgress[module.id]}
                      onContinue={() => handleModuleSelect(module)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Beginner Modules */}
            {modulesByDifficulty.beginner.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Beginner</h2>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Start here if you're new to trading</p>
                  </div>
                  <span className={`ml-auto text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {modulesByDifficulty.beginner.length} modules
                  </span>
                </div>
                <ModuleGrid
                  modules={sortModules(modulesByDifficulty.beginner)}
                  completedModules={progress.completedModules}
                  moduleProgress={progress.moduleProgress}
                  onModuleSelect={handleModuleSelect}
                />
              </div>
            )}

            {/* Intermediate Modules */}
            {modulesByDifficulty.intermediate.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📈</span>
                  <div>
                    <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Intermediate</h2>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Build on your foundation</p>
                  </div>
                  <span className={`ml-auto text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {modulesByDifficulty.intermediate.length} modules
                  </span>
                </div>
                <ModuleGrid
                  modules={sortModules(modulesByDifficulty.intermediate)}
                  completedModules={progress.completedModules}
                  moduleProgress={progress.moduleProgress}
                  onModuleSelect={handleModuleSelect}
                />
              </div>
            )}

            {/* Advanced Modules */}
            {modulesByDifficulty.advanced.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Advanced</h2>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Master complex strategies</p>
                  </div>
                  <span className={`ml-auto text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {modulesByDifficulty.advanced.length} modules
                  </span>
                </div>
                <ModuleGrid
                  modules={sortModules(modulesByDifficulty.advanced)}
                  completedModules={progress.completedModules}
                  moduleProgress={progress.moduleProgress}
                  onModuleSelect={handleModuleSelect}
                />
              </div>
            )}
          </div>
        )}

        {viewMode === 'paths' && (
          <div className="space-y-8">
            {/* Active Path */}
            {progress.activePath && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>Your Active Path</span>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                    Active
                  </span>
                </h2>
                {(() => {
                  const activePath = getAllPaths().find(p => p.id === progress.activePath);
                  return activePath ? (
                    <LearningPathCard
                      path={activePath}
                      completedModules={progress.completedModules}
                      isActive={true}
                      onSelect={() => handlePathSelect(activePath)}
                    />
                  ) : null;
                })()}
              </div>
            )}

            {/* Beginner Path */}
            {!progress.activePath && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Start Here</h2>
                <LearningPathCard
                  path={BEGINNER_PATH}
                  completedModules={progress.completedModules}
                  isActive={progress.activePath === BEGINNER_PATH.id}
                  onSelect={() => handlePathSelect(BEGINNER_PATH)}
                />
              </div>
            )}

            {/* Persona Paths */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Trading Style Paths</h2>
              <p className="text-slate-400 text-sm mb-4">
                Choose a path based on your trading style and goals
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PERSONA_PATHS.map(path => (
                  <LearningPathCard
                    key={path.id}
                    path={path}
                    completedModules={progress.completedModules}
                    isActive={progress.activePath === path.id}
                    onSelect={() => handlePathSelect(path)}
                    compact
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'tools' && (
          <ToolsAndWorkflowsView />
        )}

        {viewMode === 'flashcards' && (
          <FlashcardsView />
        )}
      </div>

      {/* Module Detail Modal */}
      {selectedModule && (
        <ModuleDetailModal
          module={selectedModule}
          isCompleted={progress.completedModules.includes(selectedModule.id)}
          progress={progress.moduleProgress[selectedModule.id] || 0}
          onClose={() => setSelectedModule(null)}
          onComplete={handleModuleComplete}
          onProgressUpdate={handleProgressUpdate}
        />
      )}

      {/* Path Detail Modal */}
      {selectedPath && (
        <PathDetailModal
          path={selectedPath}
          completedModules={progress.completedModules}
          onClose={() => setSelectedPath(null)}
          onStartModule={(module) => {
            setSelectedPath(null);
            handleModuleSelect(module);
          }}
          onStartPath={handleStartPath}
        />
      )}
    </div>
  );
}
