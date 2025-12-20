// ═══════════════════════════════════════════════════════════════════════════
// SMART SEARCH
// Vocabulary-aware search for cards and tools
// ═══════════════════════════════════════════════════════════════════════════

import { cardRegistry, CardDescriptor, UserSegment, ComplexityLevel } from '@/registry/cardRegistry';
import { 
  normalizeQuery, 
  detectIntent, 
  recommendTools, 
  SYNONYM_MAP,
  DetectedIntent 
} from './index';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchResult {
  card: CardDescriptor;
  score: number;
  matchType: 'exact' | 'synonym' | 'intent' | 'tag' | 'fuzzy';
  matchedTerms: string[];
  explanation: string;
}

export interface SearchOptions {
  segment?: UserSegment;
  complexity?: ComplexityLevel;
  category?: string;
  maxResults?: number;
  includeExplanation?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SEARCH FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

export function smartSearch(
  query: string, 
  options: SearchOptions = {}
): SearchResult[] {
  const {
    segment,
    complexity,
    category,
    maxResults = 10,
    includeExplanation = true,
  } = options;

  const results: SearchResult[] = [];
  const normalizedQuery = normalizeQuery(query);
  const queryTerms = normalizedQuery.split(/\s+/);
  
  // 1. Get intent-based recommendations (highest priority)
  const intentResults = detectIntent(query);
  const toolRecommendations = recommendTools(query, 20);
  
  // 2. Score each card
  for (const card of cardRegistry) {
    // Apply filters
    if (segment && card.segments && !card.segments.includes(segment)) continue;
    if (complexity && card.complexity && card.complexity !== complexity) continue;
    if (category && card.category !== category) continue;
    
    let score = 0;
    let matchType: SearchResult['matchType'] = 'fuzzy';
    const matchedTerms: string[] = [];
    
    // Check exact ID match
    if (card.id.toLowerCase() === normalizedQuery.replace(/\s+/g, '-')) {
      score += 1.0;
      matchType = 'exact';
      matchedTerms.push(card.id);
    }
    
    // Check label match
    if (card.label.toLowerCase().includes(normalizedQuery)) {
      score += 0.8;
      matchType = matchType === 'fuzzy' ? 'exact' : matchType;
      matchedTerms.push(card.label);
    }
    
    // Check intent-based match
    const intentMatch = toolRecommendations.find(r => r.toolId === card.id);
    if (intentMatch) {
      score += intentMatch.score * 0.9;
      matchType = matchType === 'fuzzy' ? 'intent' : matchType;
      matchedTerms.push(...intentMatch.reasons.map(r => r.split('(')[0].trim()));
    }
    
    // Check tag matches
    const tagScore = calculateTagScore(card.tags, queryTerms, normalizedQuery);
    if (tagScore.score > 0) {
      score += tagScore.score * 0.7;
      matchType = matchType === 'fuzzy' ? 'tag' : matchType;
      matchedTerms.push(...tagScore.matchedTags);
    }
    
    // Check synonym matches
    const synonymScore = calculateSynonymScore(card.tags, query);
    if (synonymScore.score > 0) {
      score += synonymScore.score * 0.6;
      matchType = matchType === 'fuzzy' ? 'synonym' : matchType;
      matchedTerms.push(...synonymScore.matchedSynonyms);
    }
    
    // Check description match (lower weight)
    if (card.description.toLowerCase().includes(normalizedQuery)) {
      score += 0.3;
      matchedTerms.push('description');
    }
    
    // Boost for segment match
    if (segment && card.segments?.includes(segment)) {
      score *= 1.1;
    }
    
    // Boost for default cards
    if (card.default) {
      score *= 1.05;
    }
    
    // Boost for cards with edge metrics if query mentions performance
    if (card.hasEdgeMetric && /win.?rate|expectancy|edge|performance/i.test(query)) {
      score *= 1.15;
    }
    
    // Boost for risk sizing cards if query mentions position/risk
    if (card.hasRiskSizing && /position|size|risk|lot|capital/i.test(query)) {
      score *= 1.15;
    }
    
    if (score > 0.1) {
      results.push({
        card,
        score: Math.min(score, 1),
        matchType,
        matchedTerms: [...new Set(matchedTerms)],
        explanation: includeExplanation 
          ? generateExplanation(card, matchType, matchedTerms) 
          : '',
      });
    }
  }
  
  // Sort by score and return top results
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function calculateTagScore(
  tags: string[], 
  queryTerms: string[],
  normalizedQuery: string
): { score: number; matchedTags: string[] } {
  const matchedTags: string[] = [];
  let score = 0;
  
  for (const tag of tags) {
    const normalizedTag = tag.toLowerCase();
    
    // Exact tag match
    if (normalizedQuery.includes(normalizedTag)) {
      score += 0.3;
      matchedTags.push(tag);
      continue;
    }
    
    // Partial term match
    for (const term of queryTerms) {
      if (normalizedTag.includes(term) || term.includes(normalizedTag)) {
        score += 0.15;
        matchedTags.push(tag);
        break;
      }
    }
  }
  
  return { score: Math.min(score, 1), matchedTags };
}

function calculateSynonymScore(
  tags: string[], 
  query: string
): { score: number; matchedSynonyms: string[] } {
  const matchedSynonyms: string[] = [];
  let score = 0;
  const lowerQuery = query.toLowerCase();
  
  // Check if any synonym in the query maps to a canonical term in tags
  for (const [synonym, canonical] of Object.entries(SYNONYM_MAP)) {
    if (lowerQuery.includes(synonym.toLowerCase())) {
      // Check if the canonical term or related terms are in tags
      const canonicalParts = canonical.split('_');
      for (const tag of tags) {
        const tagLower = tag.toLowerCase();
        if (
          tagLower.includes(canonical.replace(/_/g, ' ')) ||
          canonicalParts.some(part => tagLower.includes(part))
        ) {
          score += 0.2;
          matchedSynonyms.push(`${synonym} → ${tag}`);
          break;
        }
      }
    }
  }
  
  return { score: Math.min(score, 1), matchedSynonyms };
}

function generateExplanation(
  card: CardDescriptor, 
  matchType: SearchResult['matchType'],
  matchedTerms: string[]
): string {
  switch (matchType) {
    case 'exact':
      return `Direct match for "${card.label}"`;
    case 'intent':
      return `Recommended for: ${matchedTerms.slice(0, 2).join(', ')}`;
    case 'synonym':
      return `Matched via synonyms: ${matchedTerms.slice(0, 2).join(', ')}`;
    case 'tag':
      return `Matched tags: ${matchedTerms.slice(0, 3).join(', ')}`;
    case 'fuzzy':
      return `Related to your search`;
    default:
      return '';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// QUICK SEARCH - Faster search for autocomplete
// ─────────────────────────────────────────────────────────────────────────────

export function quickSearch(query: string, maxResults: number = 5): CardDescriptor[] {
  if (query.length < 2) return [];
  
  const normalized = query.toLowerCase();
  
  return cardRegistry
    .filter(card => 
      card.label.toLowerCase().includes(normalized) ||
      card.id.includes(normalized) ||
      card.tags.some(tag => tag.toLowerCase().includes(normalized))
    )
    .slice(0, maxResults);
}

// ─────────────────────────────────────────────────────────────────────────────
// SEGMENT-BASED RECOMMENDATIONS
// ─────────────────────────────────────────────────────────────────────────────

export function getRecommendedForSegment(segment: UserSegment): CardDescriptor[] {
  return cardRegistry
    .filter(card => card.segments?.includes(segment))
    .sort((a, b) => {
      // Prioritize default cards
      if (a.default && !b.default) return -1;
      if (!a.default && b.default) return 1;
      // Then cards with edge metrics
      if (a.hasEdgeMetric && !b.hasEdgeMetric) return -1;
      if (!a.hasEdgeMetric && b.hasEdgeMetric) return 1;
      return 0;
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// RELATED TOOLS
// ─────────────────────────────────────────────────────────────────────────────

export function getRelatedTools(cardId: string, maxResults: number = 4): CardDescriptor[] {
  const sourceCard = cardRegistry.find(c => c.id === cardId);
  if (!sourceCard) return [];
  
  const scores: Array<{ card: CardDescriptor; score: number }> = [];
  
  for (const card of cardRegistry) {
    if (card.id === cardId) continue;
    
    let score = 0;
    
    // Same category bonus
    if (card.category === sourceCard.category) {
      score += 0.3;
    }
    
    // Overlapping segments
    if (sourceCard.segments && card.segments) {
      const overlap = sourceCard.segments.filter(s => card.segments!.includes(s));
      score += overlap.length * 0.15;
    }
    
    // Overlapping tags
    const tagOverlap = sourceCard.tags.filter(t => 
      card.tags.some(ct => ct.toLowerCase() === t.toLowerCase())
    );
    score += tagOverlap.length * 0.1;
    
    // Same complexity
    if (card.complexity === sourceCard.complexity) {
      score += 0.1;
    }
    
    if (score > 0.2) {
      scores.push({ card, score });
    }
  }
  
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(s => s.card);
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH BY QUESTION TYPE
// ─────────────────────────────────────────────────────────────────────────────

export type QuestionType = 
  | 'how_much'      // Calculation queries
  | 'what_is'       // Definition/analysis queries
  | 'which'         // Selection/comparison queries
  | 'why'           // Explanation queries
  | 'show_me'       // Display/visualization queries
  | 'find'          // Screening queries
  | 'compare';      // Comparison queries

export function detectQuestionType(query: string): QuestionType {
  const lower = query.toLowerCase();
  
  if (/^(how much|how many|calculate|compute)/.test(lower)) return 'how_much';
  if (/^(what is|what's|explain|define)/.test(lower)) return 'what_is';
  if (/^(which|what|best|recommend)/.test(lower)) return 'which';
  if (/^(why|how come|reason)/.test(lower)) return 'why';
  if (/^(show|display|visualize|chart)/.test(lower)) return 'show_me';
  if (/^(find|search|screen|scan|filter)/.test(lower)) return 'find';
  if (/^(compare|versus|vs|difference)/.test(lower)) return 'compare';
  
  return 'what_is'; // Default
}

export function searchByQuestionType(query: string): SearchResult[] {
  const questionType = detectQuestionType(query);
  
  // Apply question-type-specific boosting
  const results = smartSearch(query);
  
  for (const result of results) {
    switch (questionType) {
      case 'how_much':
        if (result.card.hasRiskSizing || result.card.id.includes('calculator')) {
          result.score *= 1.2;
        }
        break;
      case 'show_me':
        if (result.card.category === 'technical') {
          result.score *= 1.15;
        }
        break;
      case 'find':
        if (result.card.category === 'screener') {
          result.score *= 1.2;
        }
        break;
      case 'compare':
        if (result.card.id.includes('peer') || result.card.id.includes('compare')) {
          result.score *= 1.3;
        }
        break;
      case 'why':
        if (result.card.hasBehavioralTip || result.card.id.includes('journal')) {
          result.score *= 1.2;
        }
        break;
    }
  }
  
  // Re-sort after boosting
  results.sort((a, b) => b.score - a.score);
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default {
  smartSearch,
  quickSearch,
  getRecommendedForSegment,
  getRelatedTools,
  detectQuestionType,
  searchByQuestionType,
};
