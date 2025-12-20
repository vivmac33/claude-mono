// ═══════════════════════════════════════════════════════════════════════════
// SYNTHESIS USAGE EXAMPLE
// Demonstrates how to use the synthesis engine with card data
// ═══════════════════════════════════════════════════════════════════════════

import { synthesize } from "@/lib/synthesis";
import { getCardOutput } from "@/lib/synthesis/card-registry";
import { CardOutput } from "@/types/card-output";

/**
 * Example: Synthesize multiple card outputs for a stock analysis
 */
export function synthesizeStockAnalysis(symbol: string, cardData: Record<string, any>): void {
  // Collect outputs from available cards
  const outputs: CardOutput[] = [];
  
  // Value analysis cards
  if (cardData.valuationSummary) {
    outputs.push(getCardOutput("valuation-summary", cardData.valuationSummary));
  }
  if (cardData.piotroskiScore) {
    outputs.push(getCardOutput("piotroski-score", cardData.piotroskiScore));
  }
  
  // Risk analysis cards
  if (cardData.riskHealthDashboard) {
    outputs.push(getCardOutput("risk-health-dashboard", cardData.riskHealthDashboard));
  }
  if (cardData.financialStressRadar) {
    outputs.push(getCardOutput("financial-stress-radar", cardData.financialStressRadar));
  }
  
  // Technical analysis cards
  if (cardData.technicalIndicators) {
    outputs.push(getCardOutput("technical-indicators", cardData.technicalIndicators));
  }
  if (cardData.trendStrength) {
    outputs.push(getCardOutput("trend-strength", cardData.trendStrength));
  }
  
  // Macro/ownership cards
  if (cardData.shareholdingPattern) {
    outputs.push(getCardOutput("shareholding-pattern", cardData.shareholdingPattern));
  }
  if (cardData.insiderTrades) {
    outputs.push(getCardOutput("insider-trades", cardData.insiderTrades));
  }
  
  // Run synthesis
  const result = synthesize(outputs);
  
  console.log("=== SYNTHESIS RESULT ===");
  console.log(`Symbol: ${result.symbol}`);
  console.log(`Overall: ${result.overallSentiment} (${result.overallScore}/100)`);
  console.log(`Confidence: ${result.overallConfidence}`);
  console.log("");
  console.log("Category Scores:");
  Object.entries(result.categoryScores).forEach(([cat, data]) => {
    console.log(`  ${cat}: ${data.score} (${data.sentiment})`);
  });
  console.log("");
  console.log("Key Takeaways:");
  result.keyTakeaways.forEach(t => {
    console.log(`  [${t.type}] ${t.message}`);
  });
  console.log("");
  if (result.conflicts.length > 0) {
    console.log("Conflicts Detected:");
    result.conflicts.forEach(c => {
      console.log(`  ${c.topic}: ${c.resolution}`);
    });
  }
  console.log("");
  console.log("Action Items:");
  result.actionItems.forEach(a => {
    console.log(`  [${a.urgency}] ${a.action}`);
  });
  
  return result;
}

/**
 * Example: Quick synthesis from raw card data arrays
 */
export function quickSynthesize(outputs: CardOutput[]) {
  return synthesize(outputs);
}

/**
 * Example mock data for testing
 */
export const MOCK_CARD_DATA = {
  valuationSummary: {
    symbol: "RELIANCE",
    asOf: "2024-12-10",
    overallVerdict: "Fairly Valued",
    score: 68,
    currentPrice: 2500,
    fairValue: 2450,
    upside: -2,
    methods: [
      { name: "DCF", fairValue: 2600, weight: 0.4, upside: 4 },
      { name: "PE Multiple", fairValue: 2400, weight: 0.3, upside: -4 },
      { name: "EV/EBITDA", fairValue: 2350, weight: 0.3, upside: -6 },
    ],
    metrics: { pe: 25, pb: 2.1, evEbitda: 12, dividendYield: 0.5 },
    sectorComparison: { pePctl: 45, pbPctl: 55, evEbitdaPctl: 50 },
    historicalValuation: [],
    catalysts: { positive: ["Strong refining margins"], negative: ["High capex"] },
  },
  technicalIndicators: {
    symbol: "RELIANCE",
    asOf: "2024-12-10",
    verdict: "Buy",
    score: 72,
    indicators: {
      rsi: { value: 58, signal: "neutral" },
      macd: { histogram: 12, signal: "bullish" },
      stochastic: { k: 65, d: 60, signal: "neutral" },
      adx: { value: 28, trend: "trending" },
      ma: { short: 2480, medium: 2420, long: 2350, alignment: "bullish" },
    },
    signalCounts: { bullish: 8, bearish: 2, neutral: 5 },
    supportResistance: { support: 2400, resistance: 2600 },
  },
};

/**
 * Run example
 */
export function runExample() {
  console.log("Running synthesis example...\n");
  
  const outputs = [
    getCardOutput("valuation-summary", MOCK_CARD_DATA.valuationSummary),
    getCardOutput("technical-indicators", MOCK_CARD_DATA.technicalIndicators),
  ];
  
  const result = synthesize(outputs);
  
  console.log("Headline:", result.headline);
  console.log("Score:", result.overallScore);
  console.log("Sentiment:", result.overallSentiment);
  
  return result;
}
