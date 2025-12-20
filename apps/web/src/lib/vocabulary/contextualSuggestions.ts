// ═══════════════════════════════════════════════════════════════════════════
// CONTEXTUAL SUGGESTIONS
// Smart recommendations based on user context and workflow
// ═══════════════════════════════════════════════════════════════════════════

import { CardDescriptor, UserSegment, cardRegistry } from '@/registry/cardRegistry';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface UserContext {
  segment?: UserSegment;
  currentTool?: string;
  recentTools?: string[];
  timeOfDay?: 'pre_market' | 'market_hours' | 'post_market';
  dayOfWeek?: number; // 0 = Sunday, 1 = Monday, etc.
  isExpiry?: boolean;
  marketCondition?: 'bullish' | 'bearish' | 'sideways' | 'volatile';
}

export interface ContextualSuggestion {
  card: CardDescriptor;
  reason: string;
  priority: number;
  contextMatch: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKFLOW CHAINS - Common tool sequences
// ─────────────────────────────────────────────────────────────────────────────

export const WORKFLOW_CHAINS: Record<string, {
  description: string;
  sequence: string[];
  triggers: string[];
}> = {
  // Intraday morning workflow
  intraday_morning: {
    description: "Morning intraday preparation",
    sequence: [
      "market-regime-radar",    // Check market condition
      "price-structure",        // Identify key levels
      "trade-flow-intel",       // Check institutional activity
      "fno-risk-advisor",       // Size position
    ],
    triggers: ["pre_market", "intraday"],
  },
  
  // F&O analysis workflow
  fno_analysis: {
    description: "F&O decision making",
    sequence: [
      "options-strategy",       // Understand strategy risks
      "fno-risk-advisor",       // Position sizing
      "trade-expectancy",       // Calculate expected return
    ],
    triggers: ["options", "futures", "fno", "expiry"],
  },
  
  // Swing trade research
  swing_research: {
    description: "Swing trade research workflow",
    sequence: [
      "pattern-matcher",        // Find pattern setups
      "delivery-analysis",      // Check accumulation
      "price-structure",        // Key levels
      "risk-health-dashboard",  // Risk assessment
    ],
    triggers: ["swing", "positional"],
  },
  
  // Value investing workflow
  value_investing: {
    description: "Fundamental analysis for long-term",
    sequence: [
      "valuation-summary",      // Check valuation
      "financial-health-dna",   // Health check
      "fair-value-forecaster",  // Intrinsic value
      "dividend-crystal-ball",  // Dividend analysis
    ],
    triggers: ["investing", "long_term", "fundamental", "value"],
  },
  
  // Trade review workflow
  trade_review: {
    description: "Post-trade analysis",
    sequence: [
      "trade-journal",          // Log and analyze
      "trade-expectancy",       // Check expectancy
      "drawdown-var",           // Risk review
    ],
    triggers: ["review", "journal", "post_market", "loss", "mistake"],
  },
  
  // Sector rotation analysis
  sector_analysis: {
    description: "Sector and theme analysis",
    sequence: [
      "narrative-theme",        // Active themes
      "market-regime-radar",    // Market condition
      "momentum-heatmap",       // Sector momentum
    ],
    triggers: ["sector", "theme", "rotation", "psu", "defence", "railway"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// NEXT TOOL SUGGESTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const NEXT_TOOL_MAP: Record<string, {
  next: string[];
  reason: string;
}> = {
  // After checking market regime
  "market-regime-radar": {
    next: ["price-structure", "volatility-regime", "momentum-heatmap"],
    reason: "Now identify key levels and momentum",
  },
  
  // After finding patterns
  "pattern-matcher": {
    next: ["price-structure", "fno-risk-advisor", "delivery-analysis"],
    reason: "Confirm levels and size your position",
  },
  
  // After candlestick analysis
  "candlestick-hero": {
    next: ["technical-indicators", "pattern-matcher", "price-structure"],
    reason: "Add indicator confirmation",
  },
  
  // After price structure
  "price-structure": {
    next: ["fno-risk-advisor", "trade-flow-intel", "technical-indicators"],
    reason: "Size position based on levels",
  },
  
  // After delivery analysis
  "delivery-analysis": {
    next: ["trade-flow-intel", "price-structure", "fno-risk-advisor"],
    reason: "Confirm institutional activity",
  },
  
  // After trade flow
  "trade-flow-intel": {
    next: ["price-structure", "fno-risk-advisor", "delivery-analysis"],
    reason: "Identify entry levels",
  },
  
  // After options strategy
  "options-strategy": {
    next: ["fno-risk-advisor", "trade-expectancy"],
    reason: "Calculate position size and expected return",
  },
  
  // After F&O risk advisor
  "fno-risk-advisor": {
    next: ["trade-expectancy", "playbook-builder"],
    reason: "Confirm expectancy and entry rules",
  },
  
  // After trade expectancy
  "trade-expectancy": {
    next: ["fno-risk-advisor", "trade-journal", "playbook-builder"],
    reason: "Refine sizing or document strategy",
  },
  
  // After journal
  "trade-journal": {
    next: ["playbook-builder", "drawdown-var"],
    reason: "Build rules from insights",
  },
  
  // After playbook
  "playbook-builder": {
    next: ["fno-risk-advisor", "trade-journal"],
    reason: "Apply rules to next trade",
  },
  
  // After valuation
  "valuation-summary": {
    next: ["financial-health-dna", "fair-value-forecaster", "piotroski-score"],
    reason: "Deep dive into quality",
  },
  
  // After fair value
  "fair-value-forecaster": {
    next: ["valuation-summary", "financial-health-dna", "dividend-crystal-ball"],
    reason: "Cross-check with other metrics",
  },
  
  // After financial health
  "financial-health-dna": {
    next: ["piotroski-score", "dupont-analysis", "valuation-summary"],
    reason: "Detailed scoring breakdown",
  },
  
  // After theme tracker
  "narrative-theme": {
    next: ["momentum-heatmap", "delivery-analysis", "price-structure"],
    reason: "Find entry points in theme leaders",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TIME-BASED SUGGESTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const TIME_BASED_SUGGESTIONS: Record<string, {
  tools: string[];
  reason: string;
}> = {
  pre_market: {
    tools: ["market-regime-radar", "price-structure", "narrative-theme"],
    reason: "Prepare for the trading day",
  },
  market_open: {
    tools: ["trade-flow-intel", "candlestick-hero", "price-structure"],
    reason: "Opening hour analysis",
  },
  mid_session: {
    tools: ["technical-indicators", "delivery-analysis", "momentum-heatmap"],
    reason: "Mid-session review",
  },
  closing_hour: {
    tools: ["delivery-analysis", "trade-flow-intel", "price-structure"],
    reason: "End of day positioning",
  },
  post_market: {
    tools: ["trade-journal", "drawdown-var", "trade-expectancy"],
    reason: "Post-market review and learning",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPIRY DAY SUGGESTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const EXPIRY_DAY_TOOLS = {
  tools: ["options-strategy", "fno-risk-advisor", "price-structure"],
  reason: "Weekly expiry - focus on options and key levels",
  warnings: [
    "Theta decay accelerates - avoid long options",
    "Gamma risk increases near ATM strikes",
    "Watch for pin risk near max pain",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MARKET CONDITION SUGGESTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const MARKET_CONDITION_SUGGESTIONS: Record<string, {
  tools: string[];
  strategies: string[];
  avoid: string[];
}> = {
  bullish: {
    tools: ["momentum-heatmap", "trend-strength", "delivery-analysis"],
    strategies: ["trend following", "breakout", "dip buying"],
    avoid: ["shorting", "mean reversion on strength"],
  },
  bearish: {
    tools: ["drawdown-var", "volatility-regime", "price-structure"],
    strategies: ["hedging", "shorting rallies", "put buying"],
    avoid: ["catching falling knives", "averaging down"],
  },
  sideways: {
    tools: ["price-structure", "volatility-regime", "options-strategy"],
    strategies: ["range trading", "selling options", "iron condors"],
    avoid: ["trend following", "breakout chasing"],
  },
  volatile: {
    tools: ["volatility-regime", "fno-risk-advisor", "drawdown-var"],
    strategies: ["reduced position size", "wider stops", "straddles"],
    avoid: ["selling naked options", "overleveraging"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FUNCTION - GET CONTEXTUAL SUGGESTIONS
// ─────────────────────────────────────────────────────────────────────────────

export function getContextualSuggestions(context: UserContext): ContextualSuggestion[] {
  const suggestions: ContextualSuggestion[] = [];
  
  // 1. Next tool based on current tool
  if (context.currentTool && NEXT_TOOL_MAP[context.currentTool]) {
    const nextTools = NEXT_TOOL_MAP[context.currentTool];
    for (const toolId of nextTools.next) {
      const card = cardRegistry.find(c => c.id === toolId);
      if (card) {
        suggestions.push({
          card,
          reason: nextTools.reason,
          priority: 1,
          contextMatch: ['workflow_sequence'],
        });
      }
    }
  }
  
  // 2. Time-based suggestions
  if (context.timeOfDay && TIME_BASED_SUGGESTIONS[context.timeOfDay]) {
    const timeSuggestions = TIME_BASED_SUGGESTIONS[context.timeOfDay];
    for (const toolId of timeSuggestions.tools) {
      const card = cardRegistry.find(c => c.id === toolId);
      if (card && !suggestions.find(s => s.card.id === toolId)) {
        suggestions.push({
          card,
          reason: timeSuggestions.reason,
          priority: 2,
          contextMatch: ['time_of_day'],
        });
      }
    }
  }
  
  // 3. Expiry day suggestions
  if (context.isExpiry) {
    for (const toolId of EXPIRY_DAY_TOOLS.tools) {
      const card = cardRegistry.find(c => c.id === toolId);
      if (card && !suggestions.find(s => s.card.id === toolId)) {
        suggestions.push({
          card,
          reason: EXPIRY_DAY_TOOLS.reason,
          priority: 1,
          contextMatch: ['expiry_day'],
        });
      }
    }
  }
  
  // 4. Market condition suggestions
  if (context.marketCondition && MARKET_CONDITION_SUGGESTIONS[context.marketCondition]) {
    const conditionSuggestions = MARKET_CONDITION_SUGGESTIONS[context.marketCondition];
    for (const toolId of conditionSuggestions.tools) {
      const card = cardRegistry.find(c => c.id === toolId);
      if (card && !suggestions.find(s => s.card.id === toolId)) {
        suggestions.push({
          card,
          reason: `Recommended for ${context.marketCondition} market`,
          priority: 2,
          contextMatch: ['market_condition'],
        });
      }
    }
  }
  
  // 5. Segment-based suggestions
  if (context.segment) {
    const segmentCards = cardRegistry
      .filter(c => c.segments?.includes(context.segment!) && c.default)
      .slice(0, 3);
    
    for (const card of segmentCards) {
      if (!suggestions.find(s => s.card.id === card.id)) {
        suggestions.push({
          card,
          reason: `Popular with ${context.segment} traders`,
          priority: 3,
          contextMatch: ['segment'],
        });
      }
    }
  }
  
  // Sort by priority and return
  suggestions.sort((a, b) => a.priority - b.priority);
  return suggestions.slice(0, 8);
}

// ─────────────────────────────────────────────────────────────────────────────
// GET WORKFLOW SUGGESTION
// ─────────────────────────────────────────────────────────────────────────────

export function suggestWorkflow(query: string): {
  workflow: typeof WORKFLOW_CHAINS[string];
  name: string;
  matchedTrigger: string;
} | null {
  const lower = query.toLowerCase();
  
  for (const [name, workflow] of Object.entries(WORKFLOW_CHAINS)) {
    for (const trigger of workflow.triggers) {
      if (lower.includes(trigger)) {
        return {
          workflow,
          name,
          matchedTrigger: trigger,
        };
      }
    }
  }
  
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET TOOL WORKFLOW POSITION
// ─────────────────────────────────────────────────────────────────────────────

export function getToolWorkflowInfo(toolId: string): {
  workflows: string[];
  position: string;
  beforeTools: string[];
  afterTools: string[];
} {
  const workflows: string[] = [];
  let position = 'standalone';
  const beforeTools: string[] = [];
  const afterTools: string[] = [];
  
  for (const [name, workflow] of Object.entries(WORKFLOW_CHAINS)) {
    const index = workflow.sequence.indexOf(toolId);
    if (index !== -1) {
      workflows.push(name);
      
      if (index === 0) position = 'start';
      else if (index === workflow.sequence.length - 1) position = 'end';
      else position = 'middle';
      
      if (index > 0) {
        beforeTools.push(workflow.sequence[index - 1]);
      }
      if (index < workflow.sequence.length - 1) {
        afterTools.push(workflow.sequence[index + 1]);
      }
    }
  }
  
  return {
    workflows: [...new Set(workflows)],
    position,
    beforeTools: [...new Set(beforeTools)],
    afterTools: [...new Set(afterTools)],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LEARNING PATH SUGGESTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const LEARNING_PATHS: Record<UserSegment, {
  name: string;
  description: string;
  stages: Array<{
    name: string;
    tools: string[];
    goal: string;
  }>;
}> = {
  scalper: {
    name: "Scalper Learning Path",
    description: "Master quick intraday trades",
    stages: [
      {
        name: "Foundation",
        tools: ["candlestick-hero", "price-structure"],
        goal: "Read price action and identify levels",
      },
      {
        name: "Risk Management",
        tools: ["fno-risk-advisor", "trade-expectancy"],
        goal: "Size positions correctly",
      },
      {
        name: "Execution",
        tools: ["trade-flow-intel", "playbook-builder"],
        goal: "Build and follow a trading system",
      },
      {
        name: "Review",
        tools: ["trade-journal"],
        goal: "Identify and fix mistakes",
      },
    ],
  },
  intraday: {
    name: "Intraday Trader Path",
    description: "Master day trading",
    stages: [
      {
        name: "Market Context",
        tools: ["market-regime-radar", "price-structure"],
        goal: "Understand daily market structure",
      },
      {
        name: "Analysis",
        tools: ["technical-indicators", "trade-flow-intel"],
        goal: "Combine indicators and flow",
      },
      {
        name: "Risk & Sizing",
        tools: ["fno-risk-advisor", "trade-expectancy"],
        goal: "Proper position sizing",
      },
      {
        name: "Psychology",
        tools: ["trade-journal", "playbook-builder"],
        goal: "Build discipline",
      },
    ],
  },
  swing: {
    name: "Swing Trader Path",
    description: "Master multi-day trades",
    stages: [
      {
        name: "Setup Identification",
        tools: ["pattern-matcher", "delivery-analysis"],
        goal: "Find high-probability setups",
      },
      {
        name: "Confirmation",
        tools: ["trend-strength", "momentum-heatmap"],
        goal: "Confirm trend and momentum",
      },
      {
        name: "Entry & Exit",
        tools: ["price-structure", "risk-health-dashboard"],
        goal: "Define precise levels",
      },
      {
        name: "Management",
        tools: ["trade-journal", "drawdown-var"],
        goal: "Track and improve",
      },
    ],
  },
  positional: {
    name: "Positional Trader Path",
    description: "Master medium-term trades",
    stages: [
      {
        name: "Theme Research",
        tools: ["narrative-theme", "market-regime-radar"],
        goal: "Identify winning themes",
      },
      {
        name: "Stock Selection",
        tools: ["delivery-analysis", "financial-health-dna"],
        goal: "Pick quality stocks in themes",
      },
      {
        name: "Valuation",
        tools: ["valuation-summary", "fair-value-forecaster"],
        goal: "Ensure reasonable valuation",
      },
      {
        name: "Portfolio",
        tools: ["drawdown-var", "trade-journal"],
        goal: "Manage portfolio risk",
      },
    ],
  },
  investor: {
    name: "Long-Term Investor Path",
    description: "Build wealth over time",
    stages: [
      {
        name: "Fundamental Analysis",
        tools: ["financial-health-dna", "piotroski-score"],
        goal: "Assess business quality",
      },
      {
        name: "Valuation",
        tools: ["fair-value-forecaster", "valuation-summary"],
        goal: "Determine fair value",
      },
      {
        name: "Growth & Quality",
        tools: ["dupont-analysis", "growth-summary"],
        goal: "Understand growth drivers",
      },
      {
        name: "Income",
        tools: ["dividend-crystal-ball"],
        goal: "Build passive income",
      },
    ],
  },
};

export function getLearningPath(segment: UserSegment): typeof LEARNING_PATHS[UserSegment] {
  return LEARNING_PATHS[segment];
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default {
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
};
