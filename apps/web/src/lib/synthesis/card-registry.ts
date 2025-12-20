// ═══════════════════════════════════════════════════════════════════════════
// CARD REGISTRY
// Central registry of all card getOutput functions for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

import { CardOutput } from "@/types/card-output";

// VALUE CARDS
import { getValuationSummaryOutput, ValuationSummaryData } from "@/cards/value/valuation-summary";
import { getDCFValuationOutput, DCFValuationData } from "@/cards/value/dcf-valuation";
import { getDuPontAnalysisOutput, DupontAnalysisData } from "@/cards/value/dupont-analysis";
import { getFairValueForecasterOutput, FairValueForecasterData } from "@/cards/value/fair-value-forecaster";
import { getFinancialHealthDNAOutput, FinancialHealthDNAData } from "@/cards/value/financial-health-dna";
import { getIntrinsicValueRangeOutput, IntrinsicValueRangeData } from "@/cards/value/intrinsic-value-range";
import { getMultiFactorScorecardOutput, MultiFactorScorecardData } from "@/cards/value/multi-factor-scorecard";
import { getPiotroskiScoreOutput, PiotroskiScoreData } from "@/cards/value/piotroski-score";

// GROWTH CARDS
import { getGrowthSummaryOutput, GrowthSummaryData } from "@/cards/growth/growth-summary";
import { getCapitalAllocationOutput, CapitalAllocationData } from "@/cards/growth/capital-allocation";
import { getEarningsQualityOutput, EarningsQualityData } from "@/cards/growth/earnings-quality";
import { getEarningsStabilityOutput, EarningsStabilityData } from "@/cards/growth/earnings-stability";
import { getEfficiencyDashboardOutput, EfficiencyDashboardData } from "@/cards/growth/efficiency-dashboard";
import { getManagementQualityOutput, ManagementQualityData } from "@/cards/growth/management-quality";
import { getProfitCashDivergenceOutput, ProfitCashDivergenceData } from "@/cards/growth/profit-vs-cash-divergence";
import { getSalesProfitCashOutput, SalesProfitCashData } from "@/cards/growth/sales-profit-cash";

// RISK CARDS
import { getRiskHealthDashboardOutput, RiskHealthDashboardData } from "@/cards/risk/risk-health-dashboard";
import { getBankruptcyHealthOutput, BankruptcyHealthData } from "@/cards/risk/bankruptcy-health";
import { getCashflowStabilityOutput, CashflowStabilityData } from "@/cards/risk/cashflow-stability-index";
import { getDrawdownVaROutput, DrawdownVaRData } from "@/cards/risk/drawdown-var";
import { getFinancialStressRadarOutput, FinancialStressRadarData } from "@/cards/risk/financial-stress-radar";
import { getFnORiskAdvisorOutput, FNORiskAdvisorData } from "@/cards/risk/fno-risk-advisor";
import { getLeverageHistoryOutput, LeverageHistoryData } from "@/cards/risk/leverage-history";
import { getTradeExpectancyOutput, TradeExpectancyData } from "@/cards/risk/trade-expectancy";
import { getWorkingCapitalHealthOutput, WorkingCapitalHealthData } from "@/cards/risk/working-capital-health";

// CASHFLOW CARDS
import { getCashConversionCycleOutput, CashConversionCycleData } from "@/cards/cashflow/cash-conversion-cycle";
import { getCashConversionEarningsOutput, CashConversionEarningsData } from "@/cards/cashflow/cash-conversion-earnings";
import { getFCFHealthOutput, FCFHealthData } from "@/cards/cashflow/fcf-health";

// INCOME CARDS
import { getDividendCrystalBallOutput, DividendCrystalBallData } from "@/cards/income/dividend-crystal-ball";
import { getDividendSIPTrackerOutput, DividendSIPTrackerData } from "@/cards/income/dividend-sip-tracker";
import { getIncomeStabilityOutput, IncomeStabilityData } from "@/cards/income/income-stability";

// MACRO CARDS
import { getShareholdingPatternOutput, ShareholdingPatternData } from "@/cards/macro/shareholding-pattern";
import { getInstitutionalFlowsOutput, InstitutionalFlowsData } from "@/cards/macro/institutional-flows";
import { getInsiderTradesOutput, InsiderTradesData } from "@/cards/macro/insider-trades";
import { getMacroCalendarOutput, MacroCalendarData } from "@/cards/macro/macro-calendar";
import { getMacroPulseOutput, MacroPulseData } from "@/cards/macro/macro-pulse";
import { getEarningsCalendarOutput, EarningsCalendarData } from "@/cards/macro/earnings-calendar";
import { getEarningsSurpriseOutput, EarningsSurpriseData } from "@/cards/macro/earnings-surprise";
import { getNarrativeThemeOutput, NarrativeThemeData } from "@/cards/macro/narrative-theme";

// TECHNICAL CARDS
import { getCandlestickHeroOutput, CandlestickHeroData } from "@/cards/technical/candlestick-hero";
import { getDeliveryAnalysisOutput, DeliveryAnalysisData } from "@/cards/technical/delivery-analysis";
import { getMarketRegimeRadarOutput, MarketRegimeRadarData } from "@/cards/technical/market-regime-radar";
import { getMomentumHeatmapOutput, MomentumHeatmapData } from "@/cards/technical/momentum-heatmap";
import { getPatternMatcherOutput, PatternMatcherData } from "@/cards/technical/pattern-matcher";
import { getPlaybookBuilderOutput, PlaybookData } from "@/cards/technical/playbook-builder";
import { getPriceStructureOutput, PriceStructureData } from "@/cards/technical/price-structure";
import { getSeasonalityPatternOutput, SeasonalityPatternData } from "@/cards/technical/seasonality-pattern";
import { getTechnicalIndicatorsOutput, TechnicalIndicatorsData } from "@/cards/technical/technical-indicators";
import { getTradeFlowIntelOutput, TradeFlowIntelData } from "@/cards/technical/trade-flow-intel";
import { getTrendStrengthOutput, TrendStrengthData } from "@/cards/technical/trend-strength";
import { getVolatilityRegimeOutput, VolatilityRegimeData } from "@/cards/technical/volatility-regime";

// PORTFOLIO CARDS
import { getETFComparatorOutput, ETFComparatorData } from "@/cards/portfolio/etf-comparator";
import { getOptionsInterestOutput, OptionsInterestData } from "@/cards/portfolio/options-interest";
import { getPeerComparisonOutput, PeerComparisonData } from "@/cards/portfolio/peer-comparison";
import { getPortfolioCorrelationOutput, PortfolioCorrelationData } from "@/cards/portfolio/portfolio-correlation";
import { getPortfolioLeaderboardOutput, PortfolioLeaderboardData } from "@/cards/portfolio/portfolio-leaderboard";
import { getRebalanceOptimizerOutput, RebalanceOptimizerData } from "@/cards/portfolio/rebalance-optimizer";
import { getTradeJournalOutput, TradeHistoryData } from "@/cards/portfolio/trade-journal";

// MINI CARDS
import { getAltmanGrahamOutput, AltmanGrahamData } from "@/cards/mini/altman-graham";
import { getFactorTiltOutput, FactorTiltData } from "@/cards/mini/factor-tilt";
import { getSentimentZScoreOutput, SentimentZScoreData } from "@/cards/mini/sentiment-zscore";
import { getWarningSentinelOutput, WarningSentinelData } from "@/cards/mini/warning-sentinel";

// OVERVIEW CARDS
import { getStockSnapshotOutput, StockSnapshotData } from "@/cards/overview/stock-snapshot";

// COMMODITIES CARDS
import { getMCXCommodityDashboardOutput, MCXDashboardData } from "@/cards/commodities/mcx-commodity-dashboard";

// DERIVATIVES CARDS
import { getNSECurrencyDashboardOutput, CurrencyDashboardData } from "@/cards/derivatives/nse-currency-dashboard";
import { getOptionsStrategyOutput, OptionsData } from "@/cards/derivatives/options-strategy";

// MUTUAL FUNDS CARDS
import { getMFExplorerOutput, MFExplorerData } from "@/cards/mutual-funds/mf-explorer";
import { getMFAnalyzerOutput, MFAnalyzerData } from "@/cards/mutual-funds/mf-analyzer";
import { getMFPortfolioOptimizerOutput, MFPortfolioOptimizerData } from "@/cards/mutual-funds/mf-portfolio-optimizer";

// ═══════════════════════════════════════════════════════════════════════════
// CARD REGISTRY TYPE
// ═══════════════════════════════════════════════════════════════════════════

export type CardId = 
  // Value
  | "valuation-summary" | "dcf-valuation" | "dupont-analysis" | "fair-value-forecaster"
  | "financial-health-dna" | "intrinsic-value-range" | "multi-factor-scorecard" | "piotroski-score"
  // Growth
  | "growth-summary" | "capital-allocation" | "earnings-quality" | "earnings-stability"
  | "efficiency-dashboard" | "management-quality" | "profit-vs-cash-divergence" | "sales-profit-cash"
  // Risk
  | "risk-health-dashboard" | "bankruptcy-health" | "cashflow-stability-index" | "drawdown-var"
  | "financial-stress-radar" | "fno-risk-advisor" | "leverage-history" | "trade-expectancy" | "working-capital-health"
  // Cashflow
  | "cash-conversion-cycle" | "cash-conversion-earnings" | "fcf-health"
  // Income
  | "dividend-crystal-ball" | "dividend-sip-tracker" | "income-stability"
  // Macro
  | "shareholding-pattern" | "institutional-flows" | "insider-trades" | "macro-calendar"
  | "macro-pulse" | "earnings-calendar" | "earnings-surprise" | "narrative-theme"
  // Technical
  | "candlestick-hero" | "delivery-analysis" | "market-regime-radar" | "momentum-heatmap"
  | "pattern-matcher" | "playbook-builder" | "price-structure" | "seasonality-pattern"
  | "technical-indicators" | "trade-flow-intel" | "trend-strength" | "volatility-regime"
  // Portfolio
  | "etf-comparator" | "options-interest" | "peer-comparison" | "portfolio-correlation"
  | "portfolio-leaderboard" | "rebalance-optimizer" | "trade-journal"
  // Mini
  | "altman-graham" | "factor-tilt" | "sentiment-zscore" | "warning-sentinel"
  // Overview
  | "stock-snapshot"
  // Commodities
  | "mcx-commodity-dashboard"
  // Derivatives
  | "nse-currency-dashboard" | "options-strategy"
  // Mutual Funds
  | "mf-explorer" | "mf-analyzer" | "mf-portfolio-optimizer";

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY MAP
// ═══════════════════════════════════════════════════════════════════════════

export const cardRegistry: Record<CardId, (data: any) => CardOutput> = {
  // Value
  "valuation-summary": getValuationSummaryOutput,
  "dcf-valuation": getDCFValuationOutput,
  "dupont-analysis": getDuPontAnalysisOutput,
  "fair-value-forecaster": getFairValueForecasterOutput,
  "financial-health-dna": getFinancialHealthDNAOutput,
  "intrinsic-value-range": getIntrinsicValueRangeOutput,
  "multi-factor-scorecard": getMultiFactorScorecardOutput,
  "piotroski-score": getPiotroskiScoreOutput,
  
  // Growth
  "growth-summary": getGrowthSummaryOutput,
  "capital-allocation": getCapitalAllocationOutput,
  "earnings-quality": getEarningsQualityOutput,
  "earnings-stability": getEarningsStabilityOutput,
  "efficiency-dashboard": getEfficiencyDashboardOutput,
  "management-quality": getManagementQualityOutput,
  "profit-vs-cash-divergence": getProfitCashDivergenceOutput,
  "sales-profit-cash": getSalesProfitCashOutput,
  
  // Risk
  "risk-health-dashboard": getRiskHealthDashboardOutput,
  "bankruptcy-health": getBankruptcyHealthOutput,
  "cashflow-stability-index": getCashflowStabilityOutput,
  "drawdown-var": getDrawdownVaROutput,
  "financial-stress-radar": getFinancialStressRadarOutput,
  "fno-risk-advisor": getFnORiskAdvisorOutput,
  "leverage-history": getLeverageHistoryOutput,
  "trade-expectancy": getTradeExpectancyOutput,
  "working-capital-health": getWorkingCapitalHealthOutput,
  
  // Cashflow
  "cash-conversion-cycle": getCashConversionCycleOutput,
  "cash-conversion-earnings": getCashConversionEarningsOutput,
  "fcf-health": getFCFHealthOutput,
  
  // Income
  "dividend-crystal-ball": getDividendCrystalBallOutput,
  "dividend-sip-tracker": getDividendSIPTrackerOutput,
  "income-stability": getIncomeStabilityOutput,
  
  // Macro
  "shareholding-pattern": getShareholdingPatternOutput,
  "institutional-flows": getInstitutionalFlowsOutput,
  "insider-trades": getInsiderTradesOutput,
  "macro-calendar": getMacroCalendarOutput,
  "macro-pulse": getMacroPulseOutput,
  "earnings-calendar": getEarningsCalendarOutput,
  "earnings-surprise": getEarningsSurpriseOutput,
  "narrative-theme": getNarrativeThemeOutput,
  
  // Technical
  "candlestick-hero": getCandlestickHeroOutput,
  "delivery-analysis": getDeliveryAnalysisOutput,
  "market-regime-radar": getMarketRegimeRadarOutput,
  "momentum-heatmap": getMomentumHeatmapOutput,
  "pattern-matcher": getPatternMatcherOutput,
  "playbook-builder": getPlaybookBuilderOutput,
  "price-structure": getPriceStructureOutput,
  "seasonality-pattern": getSeasonalityPatternOutput,
  "technical-indicators": getTechnicalIndicatorsOutput,
  "trade-flow-intel": getTradeFlowIntelOutput,
  "trend-strength": getTrendStrengthOutput,
  "volatility-regime": getVolatilityRegimeOutput,
  
  // Portfolio
  "etf-comparator": getETFComparatorOutput,
  "options-interest": getOptionsInterestOutput,
  "peer-comparison": getPeerComparisonOutput,
  "portfolio-correlation": getPortfolioCorrelationOutput,
  "portfolio-leaderboard": getPortfolioLeaderboardOutput,
  "rebalance-optimizer": getRebalanceOptimizerOutput,
  "trade-journal": getTradeJournalOutput,
  
  // Mini
  "altman-graham": getAltmanGrahamOutput,
  "factor-tilt": getFactorTiltOutput,
  "sentiment-zscore": getSentimentZScoreOutput,
  "warning-sentinel": getWarningSentinelOutput,
  
  // Overview
  "stock-snapshot": getStockSnapshotOutput,
  
  // Commodities
  "mcx-commodity-dashboard": getMCXCommodityDashboardOutput,
  
  // Derivatives
  "nse-currency-dashboard": getNSECurrencyDashboardOutput,
  "options-strategy": getOptionsStrategyOutput,
  
  // Mutual Funds
  "mf-explorer": getMFExplorerOutput,
  "mf-analyzer": getMFAnalyzerOutput,
  "mf-portfolio-optimizer": getMFPortfolioOptimizerOutput,
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get output for a specific card
 */
export function getCardOutput(cardId: CardId, data: any): CardOutput {
  const outputFn = cardRegistry[cardId];
  if (!outputFn) {
    throw new Error(`Unknown card: ${cardId}`);
  }
  return outputFn(data);
}

/**
 * Get outputs for multiple cards
 */
export function getMultipleCardOutputs(
  cards: Array<{ cardId: CardId; data: any }>
): CardOutput[] {
  return cards.map(({ cardId, data }) => getCardOutput(cardId, data));
}

/**
 * Get all available card IDs
 */
export function getAllCardIds(): CardId[] {
  return Object.keys(cardRegistry) as CardId[];
}

/**
 * Check if a card ID exists
 */
export function isValidCardId(id: string): id is CardId {
  return id in cardRegistry;
}
