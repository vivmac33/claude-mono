// ═══════════════════════════════════════════════════════════════════════════
// VOCABULARY MODULE - Export Barrel
// ═══════════════════════════════════════════════════════════════════════════

// Core vocabulary system
export {
  SYNONYM_MAP,
  INTENT_CLUSTERS,
  QUERY_PATTERNS,
  normalizeQuery,
  detectIntent,
  recommendTools,
  getAutocompleteSuggestions,
  explainTerm,
  TERM_EXPLANATIONS,
  ERROR_SUGGESTIONS,
  AUTOCOMPLETE_SUGGESTIONS,
  type DetectedIntent,
  type ToolRecommendation,
} from './index';

// Smart search
export {
  smartSearch,
  quickSearch,
  getRecommendedForSegment,
  getRelatedTools,
  detectQuestionType,
  searchByQuestionType,
  type SearchResult,
  type SearchOptions,
  type QuestionType,
} from './smartSearch';

// Contextual suggestions
export {
  WORKFLOW_CHAINS,
  NEXT_TOOL_MAP,
  TIME_BASED_SUGGESTIONS,
  EXPIRY_DAY_TOOLS,
  MARKET_CONDITION_SUGGESTIONS,
  LEARNING_PATHS,
  getContextualSuggestions,
  suggestWorkflow,
  getToolWorkflowInfo,
  getLearningPath,
  type UserContext,
  type ContextualSuggestion,
} from './contextualSuggestions';
