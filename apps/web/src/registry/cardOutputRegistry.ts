// ═══════════════════════════════════════════════════════════════════════════
// CARD OUTPUT REGISTRY
// Maps card IDs to their getOutput functions for the synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

import { CardOutput } from "@/types/card-output";

// Import getOutput functions from cards that have them
import { getValuationSummaryOutput, ValuationSummaryData } from "@/cards/value/valuation-summary";
import { getPiotroskiScoreOutput, PiotroskiScoreData } from "@/cards/value/piotroski-score";
import { getCandlestickHeroOutput, CandlestickHeroData } from "@/cards/technical/candlestick-hero";
import { getGrowthSummaryOutput, GrowthSummaryData } from "@/cards/growth/growth-summary";
import { getRiskHealthDashboardOutput, RiskHealthData } from "@/cards/risk/risk-health-dashboard";
import { getStockSnapshotOutput, StockSnapshotData } from "@/cards/overview/stock-snapshot";

// NEW: Technical tools for Scalper/Intraday paths
import { getVolumeProfileOutput, VolumeProfileData } from "@/cards/technical/volume-profile";
import { getVWAPAnalysisOutput, VWAPAnalysisData } from "@/cards/technical/vwap-analysis";
import { getORBAnalysisOutput, ORBAnalysisData } from "@/cards/technical/orb-analysis";
import { getFibonacciLevelsOutput, FibonacciLevelsData } from "@/cards/technical/fibonacci-levels";

// NEW: Portfolio tool for Long-Term Investor path
import { getTaxCalculatorOutput, TaxCalculatorData } from "@/cards/portfolio/tax-calculator";

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

// Union of all card data types
export type CardDataType = 
  | ValuationSummaryData
  | PiotroskiScoreData
  | CandlestickHeroData
  | GrowthSummaryData
  | RiskHealthData
  | StockSnapshotData
  | VolumeProfileData
  | VWAPAnalysisData
  | ORBAnalysisData
  | FibonacciLevelsData
  | TaxCalculatorData;

// Function signature for getOutput
export type GetOutputFn<T = any> = (data: T) => CardOutput;

// ─────────────────────────────────────────────────────────────────────────────
// OUTPUT REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Registry mapping card IDs to their getOutput functions
 * Add entries here as more cards implement getOutput()
 */
export const cardOutputRegistry: Record<string, GetOutputFn> = {
  // Overview
  "stock-snapshot": getStockSnapshotOutput,
  
  // Value
  "valuation-summary": getValuationSummaryOutput,
  "piotroski-score": getPiotroskiScoreOutput,
  
  // Growth
  "growth-summary": getGrowthSummaryOutput,
  
  // Risk
  "risk-health-dashboard": getRiskHealthDashboardOutput,
  
  // Technical
  "candlestick-hero": getCandlestickHeroOutput,
  "volume-profile": getVolumeProfileOutput,
  "vwap-analysis": getVWAPAnalysisOutput,
  "orb-analysis": getORBAnalysisOutput,
  "fibonacci-levels": getFibonacciLevelsOutput,
  
  // Portfolio
  "tax-calculator": getTaxCalculatorOutput,
  
  // TODO: Add remaining cards as they implement getOutput()
  // "dcf-valuation": getDCFValuationOutput,
  // "fair-value-forecaster": getFairValueForecasterOutput,
  // "dupont-analysis": getDupontAnalysisOutput,
  // ... etc
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if a card has a getOutput implementation
 */
export function hasGetOutput(cardId: string): boolean {
  return cardId in cardOutputRegistry;
}

/**
 * Get the output for a card if it has a getOutput implementation
 */
export function getCardOutput(cardId: string, data: any): CardOutput | null {
  const getOutputFn = cardOutputRegistry[cardId];
  if (!getOutputFn) return null;
  
  try {
    return getOutputFn(data);
  } catch (error) {
    console.error(`Error getting output for card ${cardId}:`, error);
    return null;
  }
}

/**
 * Get outputs for multiple cards
 */
export function getMultipleCardOutputs(
  cards: Array<{ cardId: string; data: any }>
): CardOutput[] {
  return cards
    .map(({ cardId, data }) => getCardOutput(cardId, data))
    .filter((output): output is CardOutput => output !== null);
}

/**
 * List all cards that have getOutput implemented
 */
export function getImplementedCardIds(): string[] {
  return Object.keys(cardOutputRegistry);
}

/**
 * Get implementation status
 */
export function getImplementationStatus(): {
  implemented: string[];
  pending: string[];
  total: number;
  percentage: number;
} {
  const implemented = Object.keys(cardOutputRegistry);
  
  // All 75 cards (70 + 5 new)
  const allCards = [
    // Overview
    "stock-snapshot",
    // Value
    "valuation-summary", "piotroski-score", "dcf-valuation", "fair-value-forecaster",
    "dupont-analysis", "intrinsic-value-range", "multi-factor-scorecard", "financial-health-dna",
    // Growth
    "growth-summary", "earnings-quality", "earnings-stability", "management-quality",
    "capital-allocation", "efficiency-dashboard", "sales-profit-cash", "profit-vs-cash-divergence",
    // Risk
    "risk-health-dashboard", "drawdown-var", "financial-stress-radar", "bankruptcy-health",
    "working-capital-health", "leverage-history", "cashflow-stability-index", "fno-risk-advisor", "trade-expectancy",
    // Cashflow
    "fcf-health", "cash-conversion-cycle", "cash-conversion-earnings",
    // Income
    "dividend-crystal-ball", "dividend-sip-tracker", "income-stability",
    // Macro
    "shareholding-pattern", "institutional-flows", "insider-trades", "macro-calendar",
    "macro-pulse", "earnings-calendar", "earnings-surprise", "narrative-theme",
    // Technical (now includes 5 new tools)
    "candlestick-hero", "pattern-matcher", "delivery-analysis", "trade-flow-intel",
    "technical-indicators", "trend-strength", "momentum-heatmap", "volatility-regime",
    "seasonality-pattern", "market-regime-radar", "price-structure", "playbook-builder",
    "volume-profile", "vwap-analysis", "orb-analysis", "fibonacci-levels",
    // Portfolio (now includes tax-calculator)
    "rebalance-optimizer", "peer-comparison", "portfolio-correlation", "etf-comparator",
    "portfolio-leaderboard", "options-interest", "trade-journal", "tax-calculator",
    // Derivatives
    "options-strategy", "nse-currency-dashboard",
    // Mutual Funds
    "mf-explorer", "mf-analyzer", "mf-portfolio-optimizer",
    // Commodities
    "mcx-commodity-dashboard",
    // Mini
    "sentiment-zscore-mini", "warning-sentinel-mini", "factor-tilt-mini", "altman-graham-mini",
  ];
  
  const pending = allCards.filter(id => !implemented.includes(id));
  
  return {
    implemented,
    pending,
    total: allCards.length,
    percentage: Math.round((implemented.length / allCards.length) * 100),
  };
}
