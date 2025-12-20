// ═══════════════════════════════════════════════════════════════════════════
// SYNTHESIS MODULE
// Exports synthesis engine, card registry, and related utilities
// ═══════════════════════════════════════════════════════════════════════════

export { 
  SynthesisEngine, 
  synthesize,
  type SynthesisResult,
  type SynthesizedInsight,
  type ConflictReport,
  type RankedMetric,
  type ActionItem,
  type CardSummary,
} from "./engine";

export {
  cardRegistry,
  getCardOutput,
  getMultipleCardOutputs,
  getAllCardIds,
  isValidCardId,
  type CardId,
} from "./card-registry";
