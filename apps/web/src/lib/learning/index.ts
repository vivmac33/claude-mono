// ═══════════════════════════════════════════════════════════════════════════
// LEARNING MODULE - Main Export
// ═══════════════════════════════════════════════════════════════════════════

// Concepts
export {
  type Concept,
  type ConceptCategory,
  type DifficultyLevel,
  type Formula,
  type Example,
  ALL_CONCEPTS,
  FUNDAMENTAL_CONCEPTS,
  TECHNICAL_CONCEPTS,
  RISK_CONCEPTS,
  PSYCHOLOGY_CONCEPTS,
  getConceptById,
  getConceptsByCategory,
  getConceptsByDifficulty,
  getConceptsForTool,
  getRelatedConcepts,
  searchConcepts,
} from './concepts';

// Modules
export {
  type LearningModule,
  type ModuleCategory,
  type ModuleSection,
  type Quiz,
  type QuizQuestion,
  type MarketExample,
  ALL_MODULES,
  BEGINNER_MODULES,
  INTERMEDIATE_MODULES,
  ADVANCED_MODULES,
  getModuleById,
  getModulesByCategory,
  getModulesByDifficulty,
  getPrerequisites,
  getNextModules,
} from './modules';

// Tool Education
export {
  type ToolEducation,
  type ToolTerm,
  type FAQ,
  TOOL_EDUCATION,
  getToolEducation,
  getConceptsForTool as getToolConcepts,
  getQuickTip,
  getKeyTerms,
  searchToolEducation,
} from './toolEducation';

// Learning Paths
export {
  type LearningPath,
  type PathStage,
  type ConceptMapNode,
  PERSONA_PATHS,
  BEGINNER_PATH,
  CONCEPT_MAP_NODES,
  getPathForPersona,
  getAllPaths,
  getPathById,
  calculatePathProgress,
  getNextStage,
  getRecommendedPath,
} from './learningPaths';

// Flashcards
export {
  type Flashcard,
  type FlashcardDeck,
  FLASHCARD_DECKS,
  getFlashcardDeck,
  getFlashcardsByCategory,
  getFlashcardsByDifficulty,
  shuffleFlashcards,
  getFlashcardsForTool,
} from './flashcards';

// Quizzes
export {
  type QuizQuestion as PathQuizQuestion,
  type PathQuiz,
  ALL_QUIZZES,
  getQuizForPath,
  getQuestionsByType,
  getQuestionsByDifficulty,
  shuffleQuestions,
  calculateScore,
  getSubsetQuiz,
} from './quizzes';

// ═══════════════════════════════════════════════════════════════════════════
// 50-MODULE CURRICULUM (Beginner → Intermediate → Advanced)
// ═══════════════════════════════════════════════════════════════════════════

export { type CurriculumFlashcard, CURRICULUM_BEGINNER, BEGINNER_FLASHCARDS } from './curriculum-beginner';
export { CURRICULUM_INTERMEDIATE, INTERMEDIATE_FLASHCARDS } from './curriculum-intermediate';
export { 
  CURRICULUM_ADVANCED, 
  ADVANCED_FLASHCARDS,
  ALL_CURRICULUM_MODULES,
  ALL_CURRICULUM_FLASHCARDS,
  getCurriculumByLevel,
  getCurriculumModule,
  getCurriculumModuleByNumber,
  getFlashcardsByLevel,
} from './curriculum-advanced';
