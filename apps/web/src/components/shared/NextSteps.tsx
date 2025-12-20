// ═══════════════════════════════════════════════════════════════════════════
// NEXTSTEPS - Smart Navigation Between Cards (Complete Version)
// Provides contextual "what to do next" suggestions after viewing any card
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import { ChevronRight, Lightbulb, BookOpen } from "lucide-react";

interface NextStep {
  cardId: string;
  label: string;
  reason: string;
}

interface NextStepsProps {
  currentCardId: string;
  onCardSelect?: (cardId: string) => void;
  variant?: "default" | "compact" | "inline";
  maxSuggestions?: number;
  showLearnMore?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// CARD FLOW DEFINITIONS - Maps each card to logical next steps
// ═══════════════════════════════════════════════════════════════════════════

const CARD_FLOWS: Record<string, NextStep[]> = {
  // ─────────────────────────────────────────────────────────────────────────
  // VALUE CARDS
  // ─────────────────────────────────────────────────────────────────────────
  "valuation-summary": [
    { cardId: "piotroski-score", label: "Check Quality Score", reason: "Verify fundamental strength before buying" },
    { cardId: "growth-summary", label: "Analyze Growth", reason: "See if valuation is justified by growth" },
    { cardId: "dcf-valuation", label: "Run DCF Model", reason: "Calculate intrinsic value" },
    { cardId: "peer-comparison", label: "Compare to Peers", reason: "See relative valuation" },
  ],
  "piotroski-score": [
    { cardId: "risk-health-dashboard", label: "Assess Risks", reason: "Identify potential red flags" },
    { cardId: "dupont-analysis", label: "Understand ROE", reason: "Decompose return drivers" },
    { cardId: "earnings-quality", label: "Check Earnings Quality", reason: "Verify profit sustainability" },
    { cardId: "financial-health-dna", label: "Financial DNA", reason: "Deep dive into fundamentals" },
  ],
  "dcf-valuation": [
    { cardId: "intrinsic-value-range", label: "Value Range", reason: "See multiple valuation scenarios" },
    { cardId: "fair-value-forecaster", label: "Fair Value Forecast", reason: "Project future fair value" },
    { cardId: "growth-summary", label: "Validate Growth", reason: "Check if DCF assumptions are realistic" },
    { cardId: "fcf-health", label: "FCF Analysis", reason: "Verify cash flow projections" },
  ],
  "dupont-analysis": [
    { cardId: "efficiency-dashboard", label: "Efficiency Metrics", reason: "Deep dive into operational efficiency" },
    { cardId: "capital-allocation", label: "Capital Allocation", reason: "See how capital is deployed" },
    { cardId: "leverage-history", label: "Leverage Trends", reason: "Track financial leverage over time" },
    { cardId: "management-quality", label: "Management Quality", reason: "Evaluate execution" },
  ],
  "fair-value-forecaster": [
    { cardId: "dcf-valuation", label: "DCF Model", reason: "Compare with cash flow based valuation" },
    { cardId: "earnings-stability", label: "Earnings Stability", reason: "Check forecast reliability" },
    { cardId: "growth-summary", label: "Growth Drivers", reason: "Understand growth assumptions" },
  ],
  "financial-health-dna": [
    { cardId: "bankruptcy-health", label: "Bankruptcy Risk", reason: "Check financial distress indicators" },
    { cardId: "working-capital-health", label: "Working Capital", reason: "Analyze liquidity position" },
    { cardId: "leverage-history", label: "Leverage History", reason: "Track debt trends" },
  ],
  "intrinsic-value-range": [
    { cardId: "dcf-valuation", label: "DCF Details", reason: "See full DCF model" },
    { cardId: "valuation-summary", label: "Valuation Overview", reason: "Compare multiple metrics" },
    { cardId: "peer-comparison", label: "Peer Valuation", reason: "See relative positioning" },
  ],
  "multi-factor-scorecard": [
    { cardId: "factor-tilt", label: "Factor Exposure", reason: "See detailed factor tilts" },
    { cardId: "peer-comparison", label: "Peer Ranking", reason: "Compare across peers" },
    { cardId: "valuation-summary", label: "Valuation Check", reason: "Verify value factor" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // GROWTH CARDS
  // ─────────────────────────────────────────────────────────────────────────
  "growth-summary": [
    { cardId: "earnings-quality", label: "Earnings Quality", reason: "Verify growth is real" },
    { cardId: "capital-allocation", label: "Capital Allocation", reason: "See how growth is funded" },
    { cardId: "valuation-summary", label: "Check Valuation", reason: "See if growth is priced in" },
    { cardId: "sales-profit-cash", label: "Sales→Profit→Cash", reason: "Track conversion efficiency" },
  ],
  "capital-allocation": [
    { cardId: "dupont-analysis", label: "ROE Breakdown", reason: "See return on invested capital" },
    { cardId: "fcf-health", label: "FCF Generation", reason: "Check capital available for allocation" },
    { cardId: "management-quality", label: "Management Quality", reason: "Evaluate allocation decisions" },
  ],
  "earnings-quality": [
    { cardId: "cash-conversion-earnings", label: "Cash Conversion", reason: "Compare earnings to cash" },
    { cardId: "profit-vs-cash-divergence", label: "Profit vs Cash", reason: "Spot accounting red flags" },
    { cardId: "earnings-stability", label: "Earnings Stability", reason: "Check consistency" },
  ],
  "earnings-stability": [
    { cardId: "income-stability", label: "Income Stability", reason: "Check dividend safety" },
    { cardId: "fair-value-forecaster", label: "Fair Value", reason: "Stable earnings = reliable forecasts" },
    { cardId: "growth-summary", label: "Growth Trends", reason: "See growth trajectory" },
  ],
  "efficiency-dashboard": [
    { cardId: "dupont-analysis", label: "ROE Impact", reason: "See efficiency's ROE contribution" },
    { cardId: "cash-conversion-cycle", label: "Cash Cycle", reason: "Analyze working capital efficiency" },
    { cardId: "capital-allocation", label: "Capital Efficiency", reason: "Overall capital utilization" },
  ],
  "management-quality": [
    { cardId: "insider-trades", label: "Insider Activity", reason: "See management conviction" },
    { cardId: "capital-allocation", label: "Capital Decisions", reason: "Track allocation track record" },
    { cardId: "shareholding-pattern", label: "Ownership", reason: "Check promoter stake" },
  ],
  "profit-vs-cash-divergence": [
    { cardId: "earnings-quality", label: "Earnings Quality", reason: "Deep dive into quality metrics" },
    { cardId: "fcf-health", label: "FCF Health", reason: "Full cash flow analysis" },
    { cardId: "warning-sentinel", label: "Warning Signals", reason: "Check for red flags" },
  ],
  "sales-profit-cash": [
    { cardId: "efficiency-dashboard", label: "Efficiency Metrics", reason: "Understand conversion drivers" },
    { cardId: "growth-summary", label: "Growth Analysis", reason: "See revenue growth trends" },
    { cardId: "cash-conversion-earnings", label: "Cash Conversion", reason: "Detailed cash analysis" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // RISK CARDS
  // ─────────────────────────────────────────────────────────────────────────
  "risk-health-dashboard": [
    { cardId: "bankruptcy-health", label: "Bankruptcy Risk", reason: "Check Altman Z-Score" },
    { cardId: "drawdown-var", label: "Drawdown & VaR", reason: "Quantify downside risk" },
    { cardId: "financial-stress-radar", label: "Stress Indicators", reason: "Monitor financial stress" },
    { cardId: "leverage-history", label: "Leverage Trends", reason: "Track debt evolution" },
  ],
  "bankruptcy-health": [
    { cardId: "financial-health-dna", label: "Financial DNA", reason: "Full health analysis" },
    { cardId: "working-capital-health", label: "Working Capital", reason: "Liquidity deep dive" },
    { cardId: "altman-graham", label: "Altman & Graham", reason: "Classic value screens" },
  ],
  "cashflow-stability-index": [
    { cardId: "fcf-health", label: "FCF Analysis", reason: "Detailed cash flow view" },
    { cardId: "income-stability", label: "Income Stability", reason: "Compare with dividend stability" },
    { cardId: "earnings-stability", label: "Earnings Stability", reason: "Compare with earnings" },
  ],
  "drawdown-var": [
    { cardId: "volatility-regime", label: "Volatility Analysis", reason: "Understand volatility patterns" },
    { cardId: "portfolio-correlation", label: "Correlations", reason: "Diversification analysis" },
    { cardId: "risk-health-dashboard", label: "Risk Overview", reason: "Full risk picture" },
  ],
  "financial-stress-radar": [
    { cardId: "bankruptcy-health", label: "Bankruptcy Risk", reason: "Detailed distress analysis" },
    { cardId: "leverage-history", label: "Leverage Trends", reason: "Track debt changes" },
    { cardId: "warning-sentinel", label: "Warning Signals", reason: "Monitor red flags" },
  ],
  "fno-risk-advisor": [
    { cardId: "options-strategy", label: "Strategy Guide", reason: "Learn strategy mechanics" },
    { cardId: "options-interest", label: "Open Interest", reason: "Analyze positioning" },
    { cardId: "volatility-regime", label: "Volatility", reason: "IV vs HV analysis" },
  ],
  "leverage-history": [
    { cardId: "financial-health-dna", label: "Financial Health", reason: "Full balance sheet view" },
    { cardId: "bankruptcy-health", label: "Bankruptcy Risk", reason: "Stress test debt levels" },
    { cardId: "dupont-analysis", label: "Leverage Impact", reason: "See ROE contribution" },
  ],
  "trade-expectancy": [
    { cardId: "trade-journal", label: "Trade Journal", reason: "Log your trades" },
    { cardId: "playbook-builder", label: "Build Playbook", reason: "Systematize winning setups" },
    { cardId: "drawdown-var", label: "Risk Metrics", reason: "Understand position sizing" },
  ],
  "working-capital-health": [
    { cardId: "cash-conversion-cycle", label: "Cash Cycle", reason: "Detailed WC analysis" },
    { cardId: "efficiency-dashboard", label: "Efficiency", reason: "Turnover ratios" },
    { cardId: "financial-health-dna", label: "Full Health", reason: "Complete financial picture" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // PORTFOLIO CARDS
  // ─────────────────────────────────────────────────────────────────────────
  "peer-comparison": [
    { cardId: "valuation-summary", label: "Valuation Details", reason: "Deep dive into top pick" },
    { cardId: "multi-factor-scorecard", label: "Factor Scores", reason: "Compare on multiple factors" },
    { cardId: "growth-summary", label: "Growth Comparison", reason: "See relative growth" },
  ],
  "etf-comparator": [
    { cardId: "mf-analyzer", label: "Fund Analysis", reason: "Compare with mutual funds" },
    { cardId: "portfolio-correlation", label: "Correlations", reason: "Check overlap" },
    { cardId: "rebalance-optimizer", label: "Rebalancing", reason: "Optimize allocation" },
  ],
  "options-interest": [
    { cardId: "options-strategy", label: "Strategy Guide", reason: "Plan your trades" },
    { cardId: "fno-risk-advisor", label: "Risk Assessment", reason: "Understand position risk" },
    { cardId: "volatility-regime", label: "Volatility", reason: "IV analysis" },
  ],
  "portfolio-correlation": [
    { cardId: "rebalance-optimizer", label: "Rebalancing", reason: "Optimize diversification" },
    { cardId: "drawdown-var", label: "Portfolio Risk", reason: "Quantify downside" },
    { cardId: "peer-comparison", label: "Peer Analysis", reason: "Find uncorrelated stocks" },
  ],
  "portfolio-leaderboard": [
    { cardId: "peer-comparison", label: "Peer Details", reason: "Deep dive top performers" },
    { cardId: "multi-factor-scorecard", label: "Factor Scores", reason: "Understand what's working" },
    { cardId: "rebalance-optimizer", label: "Rebalancing", reason: "Adjust allocations" },
  ],
  "rebalance-optimizer": [
    { cardId: "portfolio-correlation", label: "Correlations", reason: "Check diversification" },
    { cardId: "drawdown-var", label: "Risk Impact", reason: "See risk after rebalance" },
    { cardId: "portfolio-leaderboard", label: "Performance", reason: "Track results" },
  ],
  "trade-journal": [
    { cardId: "trade-expectancy", label: "Expectancy", reason: "Analyze your edge" },
    { cardId: "playbook-builder", label: "Playbooks", reason: "Document setups" },
    { cardId: "portfolio-leaderboard", label: "Performance", reason: "Track overall results" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // TECHNICAL CARDS
  // ─────────────────────────────────────────────────────────────────────────
  "candlestick-hero": [
    { cardId: "pattern-matcher", label: "Pattern Analysis", reason: "Find chart patterns" },
    { cardId: "trend-strength", label: "Trend Strength", reason: "Confirm trend direction" },
    { cardId: "technical-indicators", label: "Indicators", reason: "Add technical confirmation" },
  ],
  "delivery-analysis": [
    { cardId: "trade-flow-intel", label: "Trade Flow", reason: "Understand order flow" },
    { cardId: "institutional-flows", label: "Institutional", reason: "See smart money" },
    { cardId: "candlestick-hero", label: "Price Action", reason: "Correlate with charts" },
  ],
  "market-regime-radar": [
    { cardId: "volatility-regime", label: "Volatility", reason: "Understand current regime" },
    { cardId: "momentum-heatmap", label: "Momentum", reason: "See sector rotation" },
    { cardId: "macro-pulse", label: "Macro Context", reason: "Economic backdrop" },
  ],
  "momentum-heatmap": [
    { cardId: "trend-strength", label: "Trend Analysis", reason: "Confirm momentum" },
    { cardId: "seasonality-pattern", label: "Seasonality", reason: "Check seasonal bias" },
    { cardId: "narrative-theme", label: "Themes", reason: "Understand drivers" },
  ],
  "pattern-matcher": [
    { cardId: "price-structure", label: "Price Structure", reason: "Support/resistance levels" },
    { cardId: "playbook-builder", label: "Build Playbook", reason: "Create trading plan" },
    { cardId: "candlestick-hero", label: "Candlesticks", reason: "Entry signals" },
  ],
  "playbook-builder": [
    { cardId: "trade-journal", label: "Trade Journal", reason: "Log executions" },
    { cardId: "trade-expectancy", label: "Expectancy", reason: "Track results" },
    { cardId: "pattern-matcher", label: "Patterns", reason: "Find setups" },
  ],
  "price-structure": [
    { cardId: "pattern-matcher", label: "Patterns", reason: "Find chart patterns" },
    { cardId: "technical-indicators", label: "Indicators", reason: "Confirm levels" },
    { cardId: "candlestick-hero", label: "Candlesticks", reason: "Entry timing" },
  ],
  "seasonality-pattern": [
    { cardId: "momentum-heatmap", label: "Current Momentum", reason: "Verify seasonal edge" },
    { cardId: "narrative-theme", label: "Themes", reason: "Understand catalysts" },
    { cardId: "macro-calendar", label: "Events", reason: "Time around events" },
  ],
  "technical-indicators": [
    { cardId: "trend-strength", label: "Trend Analysis", reason: "Confirm direction" },
    { cardId: "candlestick-hero", label: "Price Action", reason: "Entry timing" },
    { cardId: "volatility-regime", label: "Volatility", reason: "Set stop distances" },
  ],
  "trade-flow-intel": [
    { cardId: "delivery-analysis", label: "Delivery Data", reason: "Smart money tracking" },
    { cardId: "institutional-flows", label: "FII/DII", reason: "Institutional activity" },
    { cardId: "options-interest", label: "Options Flow", reason: "Derivatives positioning" },
  ],
  "trend-strength": [
    { cardId: "technical-indicators", label: "Indicators", reason: "Confirmation signals" },
    { cardId: "momentum-heatmap", label: "Momentum", reason: "Relative strength" },
    { cardId: "price-structure", label: "Levels", reason: "Entry/exit points" },
  ],
  "volatility-regime": [
    { cardId: "options-strategy", label: "Options Strategy", reason: "Trade volatility" },
    { cardId: "drawdown-var", label: "Risk Sizing", reason: "Position sizing" },
    { cardId: "market-regime-radar", label: "Regime", reason: "Market context" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // CASHFLOW CARDS
  // ─────────────────────────────────────────────────────────────────────────
  "cash-conversion-cycle": [
    { cardId: "working-capital-health", label: "Working Capital", reason: "Full WC analysis" },
    { cardId: "efficiency-dashboard", label: "Efficiency", reason: "Turnover metrics" },
    { cardId: "fcf-health", label: "FCF Impact", reason: "Cash flow generation" },
  ],
  "cash-conversion-earnings": [
    { cardId: "earnings-quality", label: "Earnings Quality", reason: "Quality assessment" },
    { cardId: "profit-vs-cash-divergence", label: "Profit vs Cash", reason: "Divergence analysis" },
    { cardId: "fcf-health", label: "FCF Details", reason: "Full cash flow view" },
  ],
  "fcf-health": [
    { cardId: "dcf-valuation", label: "DCF Model", reason: "Use FCF for valuation" },
    { cardId: "dividend-crystal-ball", label: "Dividend Outlook", reason: "Check sustainability" },
    { cardId: "capital-allocation", label: "Capital Use", reason: "See FCF deployment" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // INCOME CARDS
  // ─────────────────────────────────────────────────────────────────────────
  "dividend-crystal-ball": [
    { cardId: "income-stability", label: "Income Stability", reason: "Track dividend history" },
    { cardId: "fcf-health", label: "FCF Coverage", reason: "Check sustainability" },
    { cardId: "dividend-sip-tracker", label: "SIP Tracker", reason: "Plan dividend SIP" },
  ],
  "dividend-sip-tracker": [
    { cardId: "dividend-crystal-ball", label: "Dividend Forecast", reason: "Project future income" },
    { cardId: "income-stability", label: "Stability Check", reason: "Verify reliability" },
    { cardId: "rebalance-optimizer", label: "Portfolio", reason: "Optimize for income" },
  ],
  "income-stability": [
    { cardId: "dividend-crystal-ball", label: "Dividend Outlook", reason: "Future projections" },
    { cardId: "fcf-health", label: "Cash Coverage", reason: "Check FCF support" },
    { cardId: "piotroski-score", label: "Quality Check", reason: "Fundamental strength" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // MACRO CARDS
  // ─────────────────────────────────────────────────────────────────────────
  "earnings-calendar": [
    { cardId: "earnings-surprise", label: "Past Surprises", reason: "Historical patterns" },
    { cardId: "volatility-regime", label: "Event Vol", reason: "Plan around earnings" },
    { cardId: "options-strategy", label: "Options Play", reason: "Trade the event" },
  ],
  "earnings-surprise": [
    { cardId: "earnings-calendar", label: "Upcoming", reason: "Next earnings dates" },
    { cardId: "earnings-quality", label: "Quality Check", reason: "Verify earnings" },
    { cardId: "growth-summary", label: "Growth Trends", reason: "Track trajectory" },
  ],
  "insider-trades": [
    { cardId: "shareholding-pattern", label: "Ownership", reason: "Full ownership picture" },
    { cardId: "management-quality", label: "Management", reason: "Evaluate leadership" },
    { cardId: "institutional-flows", label: "Institutions", reason: "Smart money activity" },
  ],
  "institutional-flows": [
    { cardId: "shareholding-pattern", label: "Ownership", reason: "Detailed breakdown" },
    { cardId: "trade-flow-intel", label: "Trade Flow", reason: "Intraday flow" },
    { cardId: "delivery-analysis", label: "Delivery", reason: "Accumulation signals" },
  ],
  "macro-calendar": [
    { cardId: "macro-pulse", label: "Macro Pulse", reason: "Current indicators" },
    { cardId: "market-regime-radar", label: "Market Regime", reason: "Positioning" },
    { cardId: "earnings-calendar", label: "Earnings", reason: "Company events" },
  ],
  "macro-pulse": [
    { cardId: "macro-calendar", label: "Upcoming Events", reason: "Key dates" },
    { cardId: "market-regime-radar", label: "Regime", reason: "Market impact" },
    { cardId: "narrative-theme", label: "Themes", reason: "Macro narratives" },
  ],
  "narrative-theme": [
    { cardId: "momentum-heatmap", label: "Momentum", reason: "Theme performance" },
    { cardId: "macro-pulse", label: "Macro", reason: "Economic drivers" },
    { cardId: "peer-comparison", label: "Theme Stocks", reason: "Find opportunities" },
  ],
  "shareholding-pattern": [
    { cardId: "insider-trades", label: "Insider Activity", reason: "Recent transactions" },
    { cardId: "institutional-flows", label: "Flow Trends", reason: "FII/DII changes" },
    { cardId: "management-quality", label: "Management", reason: "Promoter quality" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // MINI CARDS
  // ─────────────────────────────────────────────────────────────────────────
  "altman-graham": [
    { cardId: "bankruptcy-health", label: "Bankruptcy Risk", reason: "Full Altman analysis" },
    { cardId: "valuation-summary", label: "Valuation", reason: "Graham number context" },
    { cardId: "piotroski-score", label: "Quality Check", reason: "Fundamental strength" },
  ],
  "factor-tilt": [
    { cardId: "multi-factor-scorecard", label: "Full Scores", reason: "Detailed factors" },
    { cardId: "momentum-heatmap", label: "Momentum Factor", reason: "Momentum details" },
    { cardId: "valuation-summary", label: "Value Factor", reason: "Valuation details" },
  ],
  "sentiment-zscore": [
    { cardId: "trade-flow-intel", label: "Trade Flow", reason: "Sentiment confirmation" },
    { cardId: "options-interest", label: "Options", reason: "Positioning sentiment" },
    { cardId: "institutional-flows", label: "Institutions", reason: "Smart money view" },
  ],
  "warning-sentinel": [
    { cardId: "financial-stress-radar", label: "Stress Check", reason: "Full stress analysis" },
    { cardId: "bankruptcy-health", label: "Bankruptcy Risk", reason: "Distress assessment" },
    { cardId: "earnings-quality", label: "Earnings Quality", reason: "Verify concerns" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // MUTUAL FUNDS CARDS
  // ─────────────────────────────────────────────────────────────────────────
  "mf-analyzer": [
    { cardId: "mf-explorer", label: "Find Alternatives", reason: "Compare similar funds" },
    { cardId: "mf-portfolio-optimizer", label: "Optimize", reason: "Build optimal mix" },
    { cardId: "etf-comparator", label: "vs ETFs", reason: "Compare with ETFs" },
  ],
  "mf-explorer": [
    { cardId: "mf-analyzer", label: "Analyze Fund", reason: "Deep dive selected fund" },
    { cardId: "mf-portfolio-optimizer", label: "Build Portfolio", reason: "Create optimal mix" },
    { cardId: "portfolio-correlation", label: "Correlations", reason: "Check diversification" },
  ],
  "mf-portfolio-optimizer": [
    { cardId: "rebalance-optimizer", label: "Rebalancing", reason: "Maintain allocation" },
    { cardId: "portfolio-correlation", label: "Correlations", reason: "Verify diversification" },
    { cardId: "mf-analyzer", label: "Fund Details", reason: "Analyze holdings" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // DERIVATIVES CARDS
  // ─────────────────────────────────────────────────────────────────────────
  "nse-currency-dashboard": [
    { cardId: "macro-pulse", label: "Macro Context", reason: "Economic backdrop" },
    { cardId: "options-strategy", label: "Currency Options", reason: "Hedge strategies" },
    { cardId: "macro-calendar", label: "Events", reason: "RBI dates, GDP" },
  ],
  "options-strategy": [
    { cardId: "fno-risk-advisor", label: "Risk Check", reason: "Understand position risk" },
    { cardId: "options-interest", label: "Open Interest", reason: "Market positioning" },
    { cardId: "volatility-regime", label: "IV Analysis", reason: "Price options correctly" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // COMMODITIES CARDS
  // ─────────────────────────────────────────────────────────────────────────
  "mcx-commodity-dashboard": [
    { cardId: "macro-pulse", label: "Macro Pulse", reason: "Economic context" },
    { cardId: "nse-currency-dashboard", label: "Currency", reason: "USDINR impact" },
    { cardId: "seasonality-pattern", label: "Seasonality", reason: "Commodity cycles" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // OVERVIEW & MINI CARDS
  // ─────────────────────────────────────────────────────────────────────────
  "stock-snapshot": [
    { cardId: "valuation-summary", label: "Check Valuation", reason: "Is it cheap or expensive?" },
    { cardId: "growth-summary", label: "Growth Analysis", reason: "Understand growth trajectory" },
    { cardId: "risk-health-dashboard", label: "Risk Overview", reason: "Identify potential risks" },
    { cardId: "technical-indicators", label: "Technical View", reason: "Price action analysis" },
  ],
  "crash-warning": [
    { cardId: "risk-health-dashboard", label: "Full Risk Analysis", reason: "Deep dive into risk factors" },
    { cardId: "financial-stress-radar", label: "Stress Indicators", reason: "Monitor financial health" },
    { cardId: "drawdown-var", label: "Drawdown Risk", reason: "Quantify potential losses" },
  ],
  "tax-calculator": [
    { cardId: "dividend-crystal-ball", label: "Dividend Tax", reason: "Tax on dividend income" },
    { cardId: "trade-journal", label: "Track Trades", reason: "Maintain records for tax" },
    { cardId: "rebalance-optimizer", label: "Tax-Loss Harvesting", reason: "Optimize tax efficiency" },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // TECHNICAL ANALYSIS CARDS (Additional)
  // ─────────────────────────────────────────────────────────────────────────
  "volume-profile": [
    { cardId: "vwap-analysis", label: "VWAP Analysis", reason: "Volume-weighted context" },
    { cardId: "price-structure", label: "Price Structure", reason: "Support/resistance levels" },
    { cardId: "delivery-analysis", label: "Delivery Data", reason: "Institutional interest" },
  ],
  "vwap-analysis": [
    { cardId: "volume-profile", label: "Volume Profile", reason: "Value area analysis" },
    { cardId: "orb-analysis", label: "ORB Levels", reason: "Opening range context" },
    { cardId: "trade-flow-intel", label: "Order Flow", reason: "Real-time flow analysis" },
  ],
  "orb-analysis": [
    { cardId: "vwap-analysis", label: "VWAP Context", reason: "Institutional anchoring" },
    { cardId: "candlestick-hero", label: "Price Chart", reason: "Visual confirmation" },
    { cardId: "technical-indicators", label: "Indicators", reason: "Momentum confirmation" },
  ],
  "fibonacci-levels": [
    { cardId: "price-structure", label: "S/R Levels", reason: "Key price levels" },
    { cardId: "pattern-matcher", label: "Chart Patterns", reason: "Pattern confluence" },
    { cardId: "candlestick-hero", label: "Price Chart", reason: "Visual context" },
  ],
};

// Default suggestions if card not in flows
const DEFAULT_NEXT_STEPS: NextStep[] = [
  { cardId: "valuation-summary", label: "Valuation Overview", reason: "Start with valuation" },
  { cardId: "risk-health-dashboard", label: "Risk Analysis", reason: "Understand risks" },
  { cardId: "growth-summary", label: "Growth Trends", reason: "Check growth trajectory" },
];

// Related concepts for educational content
const CARD_CONCEPTS: Record<string, string[]> = {
  "valuation-summary": ["pe-ratio", "pb-ratio", "ev-ebitda"],
  "piotroski-score": ["f-score", "financial-strength", "quality-investing"],
  "dcf-valuation": ["dcf-model", "wacc", "terminal-value"],
  "growth-summary": ["revenue-growth", "eps-growth", "cagr"],
  "risk-health-dashboard": ["beta", "volatility", "risk-assessment"],
  // Add more as needed
};

export function NextSteps({
  currentCardId,
  onCardSelect,
  variant = "default",
  maxSuggestions = 3,
  showLearnMore = true,
}: NextStepsProps) {
  const nextSteps = CARD_FLOWS[currentCardId] || DEFAULT_NEXT_STEPS;
  const displaySteps = nextSteps.slice(0, maxSuggestions);
  const relatedConcepts = CARD_CONCEPTS[currentCardId] || [];

  const handleCardClick = (cardId: string) => {
    if (onCardSelect) {
      onCardSelect(cardId);
    }
  };

  // Compact variant - just buttons
  if (variant === "compact") {
    return (
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800">
        <span className="text-xs text-slate-500 mr-2">Next:</span>
        {displaySteps.map((step) => (
          <button
            key={step.cardId}
            onClick={() => handleCardClick(step.cardId)}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-full transition-colors"
          >
            {step.label}
          </button>
        ))}
      </div>
    );
  }

  // Inline variant - text links
  if (variant === "inline") {
    return (
      <div className="text-xs text-slate-500 mt-3">
        <span className="mr-1">Continue with:</span>
        {displaySteps.map((step, i) => (
          <span key={step.cardId}>
            <button
              onClick={() => handleCardClick(step.cardId)}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {step.label}
            </button>
            {i < displaySteps.length - 1 && <span className="mx-1">•</span>}
          </span>
        ))}
      </div>
    );
  }

  // Default variant - full cards
  return (
    <div className="mt-6 pt-4 border-t border-slate-800">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-medium text-slate-300">What to explore next</span>
      </div>

      <div className="grid gap-2">
        {displaySteps.map((step) => (
          <button
            key={step.cardId}
            onClick={() => handleCardClick(step.cardId)}
            className="flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors text-left group"
          >
            <div>
              <div className="text-sm font-medium text-slate-200 group-hover:text-blue-400">
                {step.label}
              </div>
              <div className="text-xs text-slate-500">{step.reason}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400" />
          </button>
        ))}
      </div>

      {showLearnMore && relatedConcepts.length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <BookOpen className="w-3 h-3" />
          <span>Learn:</span>
          {relatedConcepts.slice(0, 3).map((concept, i) => (
            <span key={concept}>
              <button className="text-blue-400 hover:underline">
                {concept.replace(/-/g, " ")}
              </button>
              {i < Math.min(relatedConcepts.length, 3) - 1 && ", "}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default NextSteps;
