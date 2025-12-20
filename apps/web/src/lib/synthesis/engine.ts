// ═══════════════════════════════════════════════════════════════════════════
// SYNTHESIS ENGINE
// Rule-based engine for combining multiple CardOutput results into unified insights
// ═══════════════════════════════════════════════════════════════════════════

import { CardOutput, MetricValue, Insight } from "@/types/card-output";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SynthesisResult {
  symbol: string;
  asOf: string;
  
  // Overall assessment
  overallSentiment: "bullish" | "bearish" | "neutral";
  overallConfidence: "high" | "medium" | "low";
  overallScore: number; // 0-100
  
  // Category scores
  categoryScores: {
    value: { score: number; weight: number; sentiment: string };
    growth: { score: number; weight: number; sentiment: string };
    risk: { score: number; weight: number; sentiment: string };
    momentum: { score: number; weight: number; sentiment: string };
    quality: { score: number; weight: number; sentiment: string };
  };
  
  // Synthesized headline
  headline: string;
  
  // Key takeaways (top 5-7 insights)
  keyTakeaways: SynthesizedInsight[];
  
  // Conflicts detected
  conflicts: ConflictReport[];
  
  // Top metrics across all cards
  topMetrics: RankedMetric[];
  
  // Action items
  actionItems: ActionItem[];
  
  // Card-level summaries
  cardSummaries: CardSummary[];
  
  // Tags aggregated
  allTags: string[];
  
  // Suggested next cards
  suggestedCards: string[];
}

export interface SynthesizedInsight {
  type: "strength" | "weakness" | "opportunity" | "risk" | "action";
  message: string;
  confidence: "high" | "medium" | "low";
  sources: string[]; // Card IDs that contributed
  priority: number;
}

export interface ConflictReport {
  topic: string;
  bullishCards: string[];
  bearishCards: string[];
  resolution: string;
}

export interface RankedMetric {
  label: string;
  value: number;
  interpretation: string;
  cardId: string;
  priority: number;
}

export interface ActionItem {
  action: string;
  urgency: "immediate" | "soon" | "monitor";
  source: string;
}

export interface CardSummary {
  cardId: string;
  category: string;
  sentiment: string;
  score: number;
  headline: string;
  topInsight: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SYNTHESIS ENGINE CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class SynthesisEngine {
  private outputs: CardOutput[] = [];
  
  constructor(outputs: CardOutput[]) {
    this.outputs = outputs;
  }
  
  /**
   * Main synthesis method - combines all card outputs
   */
  synthesize(): SynthesisResult {
    if (this.outputs.length === 0) {
      return this.createEmptyResult();
    }
    
    const symbol = this.outputs[0].symbol;
    const asOf = this.getLatestDate();
    
    // Calculate category scores
    const categoryScores = this.calculateCategoryScores();
    
    // Calculate overall score and sentiment
    const { overallScore, overallSentiment } = this.calculateOverallAssessment(categoryScores);
    
    // Detect conflicts
    const conflicts = this.detectConflicts();
    
    // Synthesize insights
    const keyTakeaways = this.synthesizeInsights();
    
    // Rank top metrics
    const topMetrics = this.rankMetrics();
    
    // Extract action items
    const actionItems = this.extractActionItems();
    
    // Create card summaries
    const cardSummaries = this.createCardSummaries();
    
    // Generate headline
    const headline = this.generateHeadline(overallSentiment, overallScore, categoryScores);
    
    // Aggregate tags and suggestions
    const allTags = this.aggregateTags();
    const suggestedCards = this.aggregateSuggestions();
    
    return {
      symbol,
      asOf,
      overallSentiment,
      overallConfidence: this.calculateOverallConfidence(),
      overallScore,
      categoryScores,
      headline,
      keyTakeaways,
      conflicts,
      topMetrics,
      actionItems,
      cardSummaries,
      allTags,
      suggestedCards,
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY SCORING
  // ═══════════════════════════════════════════════════════════════════════════
  
  private calculateCategoryScores() {
    const categories = ["value", "growth", "risk", "momentum", "quality"] as const;
    const result: SynthesisResult["categoryScores"] = {
      value: { score: 50, weight: 0, sentiment: "neutral" },
      growth: { score: 50, weight: 0, sentiment: "neutral" },
      risk: { score: 50, weight: 0, sentiment: "neutral" },
      momentum: { score: 50, weight: 0, sentiment: "neutral" },
      quality: { score: 50, weight: 0, sentiment: "neutral" },
    };
    
    categories.forEach(cat => {
      const catOutputs = this.outputs.filter(o => o.scoreContribution.category === cat);
      if (catOutputs.length > 0) {
        const totalWeight = catOutputs.reduce((sum, o) => sum + o.scoreContribution.weight, 0);
        const weightedScore = catOutputs.reduce(
          (sum, o) => sum + o.scoreContribution.score * o.scoreContribution.weight, 
          0
        ) / totalWeight;
        
        result[cat] = {
          score: Math.round(weightedScore),
          weight: totalWeight,
          sentiment: weightedScore > 60 ? "bullish" : weightedScore < 40 ? "bearish" : "neutral",
        };
      }
    });
    
    return result;
  }
  
  private calculateOverallAssessment(categoryScores: SynthesisResult["categoryScores"]) {
    const categories = Object.values(categoryScores);
    const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0) || 1;
    const weightedScore = categories.reduce((sum, c) => sum + c.score * c.weight, 0) / totalWeight;
    
    const overallScore = Math.round(weightedScore);
    const overallSentiment = overallScore > 60 ? "bullish" : overallScore < 40 ? "bearish" : "neutral";
    
    return { overallScore, overallSentiment: overallSentiment as "bullish" | "bearish" | "neutral" };
  }
  
  private calculateOverallConfidence(): "high" | "medium" | "low" {
    const highConfidence = this.outputs.filter(o => o.confidence === "high").length;
    const ratio = highConfidence / this.outputs.length;
    return ratio > 0.7 ? "high" : ratio > 0.4 ? "medium" : "low";
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CONFLICT DETECTION
  // ═══════════════════════════════════════════════════════════════════════════
  
  private detectConflicts(): ConflictReport[] {
    const conflicts: ConflictReport[] = [];
    
    // Group by category
    const categoryGroups = new Map<string, CardOutput[]>();
    this.outputs.forEach(o => {
      const cat = o.scoreContribution.category;
      if (!categoryGroups.has(cat)) categoryGroups.set(cat, []);
      categoryGroups.get(cat)!.push(o);
    });
    
    // Check each category for sentiment conflicts
    categoryGroups.forEach((outputs, category) => {
      const bullish = outputs.filter(o => o.sentiment === "bullish");
      const bearish = outputs.filter(o => o.sentiment === "bearish");
      
      if (bullish.length > 0 && bearish.length > 0) {
        // Significant conflict
        const resolution = bullish.length > bearish.length 
          ? `Majority bullish (${bullish.length} vs ${bearish.length})`
          : bearish.length > bullish.length 
            ? `Majority bearish (${bearish.length} vs ${bullish.length})`
            : "Mixed signals - exercise caution";
        
        conflicts.push({
          topic: `${category} sentiment`,
          bullishCards: bullish.map(o => o.cardId),
          bearishCards: bearish.map(o => o.cardId),
          resolution,
        });
      }
    });
    
    return conflicts;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INSIGHT SYNTHESIS
  // ═══════════════════════════════════════════════════════════════════════════
  
  private synthesizeInsights(): SynthesizedInsight[] {
    const allInsights: Array<Insight & { cardId: string }> = [];
    
    // Collect all insights with source tracking
    this.outputs.forEach(output => {
      output.insights.forEach(insight => {
        allInsights.push({ ...insight, cardId: output.cardId });
      });
    });
    
    // Group by type and priority
    const grouped = new Map<string, Array<Insight & { cardId: string }>>();
    allInsights.forEach(i => {
      const key = `${i.type}-${i.priority}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(i);
    });
    
    // Convert to synthesized insights
    const synthesized: SynthesizedInsight[] = [];
    
    // Priority 1 insights (most important)
    allInsights
      .filter(i => i.priority === 1)
      .forEach(i => {
        synthesized.push({
          type: i.type,
          message: i.message,
          confidence: "high",
          sources: [i.cardId],
          priority: 1,
        });
      });
    
    // Priority 2 insights
    allInsights
      .filter(i => i.priority === 2)
      .slice(0, 5) // Limit
      .forEach(i => {
        synthesized.push({
          type: i.type,
          message: i.message,
          confidence: "medium",
          sources: [i.cardId],
          priority: 2,
        });
      });
    
    // Sort by priority and type importance
    const typeOrder = { risk: 0, strength: 1, weakness: 2, opportunity: 3, action: 4, observation: 5 };
    synthesized.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return (typeOrder[a.type] || 5) - (typeOrder[b.type] || 5);
    });
    
    return synthesized.slice(0, 7); // Top 7
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // METRIC RANKING
  // ═══════════════════════════════════════════════════════════════════════════
  
  private rankMetrics(): RankedMetric[] {
    const allMetrics: RankedMetric[] = [];
    
    this.outputs.forEach(output => {
      output.keyMetrics
        .filter(m => m.priority === 1)
        .forEach(m => {
          allMetrics.push({
            label: m.label,
            value: m.value,
            interpretation: m.interpretation,
            cardId: output.cardId,
            priority: m.priority,
          });
        });
    });
    
    // Sort by interpretation importance
    const interpOrder = { excellent: 0, good: 1, safe: 2, opportunity: 3, fair: 4, poor: 5, risky: 6, dangerous: 7 };
    allMetrics.sort((a, b) => (interpOrder[a.interpretation] || 4) - (interpOrder[b.interpretation] || 4));
    
    return allMetrics.slice(0, 10);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ACTION EXTRACTION
  // ═══════════════════════════════════════════════════════════════════════════
  
  private extractActionItems(): ActionItem[] {
    const actions: ActionItem[] = [];
    
    this.outputs.forEach(output => {
      output.insights
        .filter(i => i.type === "action" || i.type === "risk")
        .forEach(i => {
          actions.push({
            action: i.message,
            urgency: i.type === "risk" ? "immediate" : i.priority === 1 ? "soon" : "monitor",
            source: output.cardId,
          });
        });
    });
    
    // Sort by urgency
    const urgencyOrder = { immediate: 0, soon: 1, monitor: 2 };
    actions.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
    
    return actions.slice(0, 5);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CARD SUMMARIES
  // ═══════════════════════════════════════════════════════════════════════════
  
  private createCardSummaries(): CardSummary[] {
    return this.outputs.map(output => ({
      cardId: output.cardId,
      category: output.cardCategory,
      sentiment: output.sentiment,
      score: output.scoreContribution.score,
      headline: output.headline,
      topInsight: output.insights[0]?.message || "",
    }));
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // HEADLINE GENERATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  private generateHeadline(
    sentiment: "bullish" | "bearish" | "neutral",
    score: number,
    categories: SynthesisResult["categoryScores"]
  ): string {
    const symbol = this.outputs[0]?.symbol || "Stock";
    
    // Find strongest and weakest categories
    const catArray = Object.entries(categories);
    const strongest = catArray.reduce((a, b) => a[1].score > b[1].score ? a : b);
    const weakest = catArray.reduce((a, b) => a[1].score < b[1].score ? a : b);
    
    const sentimentWord = sentiment === "bullish" ? "positive" : sentiment === "bearish" ? "cautious" : "mixed";
    
    return `${symbol} overall ${sentimentWord} (${score}/100): ${strongest[0]} strong (${strongest[1].score}), ${weakest[0]} needs attention (${weakest[1].score})`;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // AGGREGATION HELPERS
  // ═══════════════════════════════════════════════════════════════════════════
  
  private getLatestDate(): string {
    return this.outputs
      .map(o => o.asOf)
      .sort()
      .reverse()[0] || new Date().toISOString().split("T")[0];
  }
  
  private aggregateTags(): string[] {
    const tagCounts = new Map<string, number>();
    this.outputs.forEach(o => {
      o.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }
  
  private aggregateSuggestions(): string[] {
    const suggCounts = new Map<string, number>();
    this.outputs.forEach(o => {
      o.suggestedCards.forEach(card => {
        // Don't suggest cards we already have
        if (!this.outputs.some(existing => existing.cardId === card)) {
          suggCounts.set(card, (suggCounts.get(card) || 0) + 1);
        }
      });
    });
    
    return Array.from(suggCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([card]) => card);
  }
  
  private createEmptyResult(): SynthesisResult {
    return {
      symbol: "N/A",
      asOf: new Date().toISOString().split("T")[0],
      overallSentiment: "neutral",
      overallConfidence: "low",
      overallScore: 50,
      categoryScores: {
        value: { score: 50, weight: 0, sentiment: "neutral" },
        growth: { score: 50, weight: 0, sentiment: "neutral" },
        risk: { score: 50, weight: 0, sentiment: "neutral" },
        momentum: { score: 50, weight: 0, sentiment: "neutral" },
        quality: { score: 50, weight: 0, sentiment: "neutral" },
      },
      headline: "No data available for synthesis",
      keyTakeaways: [],
      conflicts: [],
      topMetrics: [],
      actionItems: [],
      cardSummaries: [],
      allTags: [],
      suggestedCards: [],
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

export function synthesize(outputs: CardOutput[]): SynthesisResult {
  const engine = new SynthesisEngine(outputs);
  return engine.synthesize();
}
