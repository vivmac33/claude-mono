import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InterpretationFooter } from "@/components/shared/InterpretationFooter";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type MFCategory = "equity" | "debt" | "hybrid" | "other";
export type MFSubCategory = 
  | "large_cap" | "mid_cap" | "small_cap" | "flexi_cap" | "multi_cap" | "elss" | "sectoral" | "index" | "value" | "focused"
  | "liquid" | "overnight" | "ultra_short" | "short_duration" | "medium_duration" | "long_duration" | "corporate_bond" | "gilt" | "credit_risk" | "banking_psu"
  | "aggressive_hybrid" | "conservative_hybrid" | "balanced_advantage" | "arbitrage" | "equity_savings" | "multi_asset"
  | "gold" | "international" | "fof";

export type RiskLevel = "low" | "moderate" | "moderately_high" | "high" | "very_high";

export interface MutualFund {
  schemeCode: string;
  schemeName: string;
  amc: string;
  category: MFCategory;
  subCategory: MFSubCategory;
  planType: "direct" | "regular";
  nav: number;
  navDate: string;
  aum: number;
  expenseRatio: number;
  riskLevel: RiskLevel;
  rating: number;
  returns: {
    "1M": number;
    "3M": number;
    "6M": number;
    "1Y": number;
    "3Y": number;
    "5Y": number;
    "10Y"?: number;
  };
  minSipAmount: number;
  minLumpsum: number;
  exitLoad: string;
  benchmark: string;
  fundManager: string;
}

export interface MFExplorerData {
  asOf: string;
  totalFunds: number;
  categories: {
    equity: number;
    debt: number;
    hybrid: number;
    other: number;
  };
  funds: MutualFund[];
  amcList: string[];
  popularFilters: Array<{ name: string; count: number }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

export function getMFExplorerOutput(data: MFExplorerData): CardOutput {
  const { asOf, totalFunds, categories, funds } = data;
  
  const topPerformers = [...funds].sort((a, b) => b.returns["1Y"] - a.returns["1Y"]).slice(0, 5);
  const avgReturn1Y = funds.reduce((sum, f) => sum + f.returns["1Y"], 0) / funds.length;
  const avgExpenseRatio = funds.reduce((sum, f) => sum + f.expenseRatio, 0) / funds.length;
  const highRatedFunds = funds.filter(f => f.rating >= 4);
  
  const sentiment = avgReturn1Y > 15 ? "bullish" : avgReturn1Y < 5 ? "bearish" : "neutral";
  
  const keyMetrics: MetricValue[] = [
    createMetric("Total Funds", "mfe_total", totalFunds, "neutral", 
      { format: "number", priority: 1 }),
    createMetric("Equity Funds", "mfe_equity", categories.equity, "neutral", 
      { format: "number", priority: 2 }),
    createMetric("Debt Funds", "mfe_debt", categories.debt, "neutral", 
      { format: "number", priority: 2 }),
    createMetric("Hybrid Funds", "mfe_hybrid", categories.hybrid, "neutral", 
      { format: "number", priority: 3 }),
    createMetric("Avg 1Y Return", "mfe_avg_ret", avgReturn1Y, 
      avgReturn1Y > 15 ? "excellent" : avgReturn1Y > 10 ? "good" : "fair",
      { format: "percent", priority: 1 }),
    createMetric("Avg Expense Ratio", "mfe_exp", avgExpenseRatio, 
      avgExpenseRatio < 1 ? "excellent" : avgExpenseRatio < 1.5 ? "good" : "fair",
      { format: "percent", priority: 2 }),
    createMetric("4+ Star Funds", "mfe_rated", highRatedFunds.length, "neutral", 
      { format: "number", priority: 2 }),
  ];
  
  const insights: Insight[] = [];
  
  // Top performers
  if (topPerformers.length > 0) {
    const top = topPerformers[0];
    insights.push(createInsight("strength", `Top performer: ${top.schemeName} (${top.returns["1Y"].toFixed(1)}% 1Y)`, 1, ["mfe_avg_ret"]));
  }
  
  // Category distribution
  const largestCategory = Object.entries(categories).reduce((a, b) => a[1] > b[1] ? a : b);
  insights.push(createInsight("observation", `${largestCategory[1]} ${largestCategory[0]} funds available (largest category)`, 2, ["mfe_total"]));
  
  // High-rated funds
  if (highRatedFunds.length > 0) {
    insights.push(createInsight("observation", `${highRatedFunds.length} funds rated 4+ stars`, 2, ["mfe_rated"]));
  }
  
  const headline = `MF Explorer: ${totalFunds} funds, avg ${avgReturn1Y.toFixed(1)}% 1Y return, ${highRatedFunds.length} rated 4+`;
  
  return {
    cardId: "mf-explorer",
    cardCategory: "mutual-funds",
    symbol: "MF",
    asOf,
    headline,
    sentiment,
    confidence: "high",
    signalStrength: 3 as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["mf-analyzer", "mf-portfolio-optimizer"],
    tags: ["mutual-funds", "explorer", "screening"],
    scoreContribution: {
      category: "value",
      score: Math.min(100, 50 + avgReturn1Y * 2),
      weight: 0.05,
    },
  };
}

interface Props {
  data?: MFExplorerData;
  isLoading?: boolean;
  error?: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const CategoryTab = ({ 
  label, 
  count, 
  active, 
  onClick,
  color 
}: { 
  label: string; 
  count: number; 
  active: boolean; 
  onClick: () => void;
  color: string;
}) => (
  <button
    onClick={onClick}
    className={`
      flex-1 py-2 px-3 rounded-lg text-center transition-all
      ${active 
        ? `${color} text-white shadow-lg` 
        : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
      }
    `}
  >
    <div className="text-sm font-medium">{label}</div>
    <div className="text-xs opacity-80">{count} funds</div>
  </button>
);

const RiskBadge = ({ level }: { level: RiskLevel }) => {
  const styles: Record<RiskLevel, string> = {
    low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    moderate: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    moderately_high: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    very_high: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  const labels: Record<RiskLevel, string> = {
    low: "Low",
    moderate: "Moderate",
    moderately_high: "Mod High",
    high: "High",
    very_high: "Very High",
  };
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded border ${styles[level]}`}>
      {labels[level]}
    </span>
  );
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-3 h-3 ${star <= rating ? "text-yellow-400" : "text-slate-600"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const SubCategoryChip = ({ 
  label, 
  active, 
  onClick 
}: { 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      text-[10px] px-2 py-1 rounded-full transition-all whitespace-nowrap
      ${active 
        ? "bg-blue-600 text-white" 
        : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-slate-200"
      }
    `}
  >
    {label}
  </button>
);

// ═══════════════════════════════════════════════════════════════════════════
// SUB-CATEGORY MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════

const subCategoryLabels: Record<MFSubCategory, string> = {
  large_cap: "Large Cap",
  mid_cap: "Mid Cap",
  small_cap: "Small Cap",
  flexi_cap: "Flexi Cap",
  multi_cap: "Multi Cap",
  elss: "ELSS (Tax Saver)",
  sectoral: "Sectoral/Thematic",
  index: "Index Funds",
  value: "Value/Contra",
  focused: "Focused",
  liquid: "Liquid",
  overnight: "Overnight",
  ultra_short: "Ultra Short",
  short_duration: "Short Duration",
  medium_duration: "Medium Duration",
  long_duration: "Long Duration",
  corporate_bond: "Corporate Bond",
  gilt: "Gilt",
  credit_risk: "Credit Risk",
  banking_psu: "Banking & PSU",
  aggressive_hybrid: "Aggressive Hybrid",
  conservative_hybrid: "Conservative Hybrid",
  balanced_advantage: "Balanced Advantage",
  arbitrage: "Arbitrage",
  equity_savings: "Equity Savings",
  multi_asset: "Multi Asset",
  gold: "Gold",
  international: "International",
  fof: "Fund of Funds",
};

const categorySubCategories: Record<MFCategory, MFSubCategory[]> = {
  equity: ["large_cap", "mid_cap", "small_cap", "flexi_cap", "multi_cap", "elss", "sectoral", "index", "value", "focused"],
  debt: ["liquid", "overnight", "ultra_short", "short_duration", "medium_duration", "long_duration", "corporate_bond", "gilt", "credit_risk", "banking_psu"],
  hybrid: ["aggressive_hybrid", "conservative_hybrid", "balanced_advantage", "arbitrage", "equity_savings", "multi_asset"],
  other: ["gold", "international", "fof"],
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function MFExplorerCard({ data, isLoading, error }: Props) {
  const categoryStyle = CATEGORY_STYLES['mutual-funds'];

  const [activeCategory, setActiveCategory] = useState<MFCategory>("equity");
  const [activeSubCategory, setActiveSubCategory] = useState<MFSubCategory | null>(null);
  const [sortBy, setSortBy] = useState<"returns_3y" | "returns_1y" | "aum" | "expense" | "rating">("returns_3y");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Filter and sort funds - must be before any early returns
  const filteredFunds = useMemo(() => {
    if (!data?.funds) return [];
    
    let funds = data.funds.filter(f => f.category === activeCategory);
    
    if (activeSubCategory) {
      funds = funds.filter(f => f.subCategory === activeSubCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      funds = funds.filter(f => 
        f.schemeName.toLowerCase().includes(term) || 
        f.amc.toLowerCase().includes(term)
      );
    }
    
    // Sort
    funds.sort((a, b) => {
      switch (sortBy) {
        case "returns_3y": return (b.returns["3Y"] || 0) - (a.returns["3Y"] || 0);
        case "returns_1y": return (b.returns["1Y"] || 0) - (a.returns["1Y"] || 0);
        case "aum": return b.aum - a.aum;
        case "expense": return a.expenseRatio - b.expenseRatio;
        case "rating": return b.rating - a.rating;
        default: return 0;
      }
    });
    
    return funds;
  }, [data?.funds, activeCategory, activeSubCategory, searchTerm, sortBy]);

  // Get selected fund details for comparison
  const selectedFundsData = useMemo(() => {
    if (!data?.funds) return [];
    return data.funds.filter(f => selectedFunds.includes(f.schemeCode));
  }, [data?.funds, selectedFunds]);

  const toggleFundSelection = (code: string) => {
    setSelectedFunds(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code].slice(0, 4)
    );
  };

  const categoryColors: Record<MFCategory, string> = {
    equity: "bg-blue-600",
    debt: "bg-emerald-600",
    hybrid: "bg-purple-600",
    other: "bg-amber-600",
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              Mutual Fund Explorer
            </CardTitle>
          <CardDescription>Loading funds...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Mutual Fund Explorer</CardTitle>
          <CardDescription className="text-red-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // No data state
  if (!data) {
    return (
      <Card>
        <CardHeader className={categoryStyle.headerBg}>
          <CardTitle>Mutual Fund Explorer</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Mutual Fund Explorer
              <Badge variant="secondary">{data.totalFunds} funds</Badge>
            </CardTitle>
            <CardDescription>
              Discover & compare mutual funds • NAV as of {data.asOf}
            </CardDescription>
          </div>
          {selectedFunds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{selectedFunds.length} selected</span>
              <button 
                onClick={() => setShowComparison(!showComparison)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                  showComparison 
                    ? 'bg-slate-600 hover:bg-slate-500 text-white' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {showComparison ? '← Back to Explorer' : 'Compare →'}
              </button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!showComparison && (
        <>
        {/* Category Tabs */}
        <div className="flex gap-2">
          <CategoryTab
            label="Equity"
            count={data.categories.equity}
            active={activeCategory === "equity"}
            onClick={() => { setActiveCategory("equity"); setActiveSubCategory(null); }}
            color={categoryColors.equity}
          />
          <CategoryTab
            label="Debt"
            count={data.categories.debt}
            active={activeCategory === "debt"}
            onClick={() => { setActiveCategory("debt"); setActiveSubCategory(null); }}
            color={categoryColors.debt}
          />
          <CategoryTab
            label="Hybrid"
            count={data.categories.hybrid}
            active={activeCategory === "hybrid"}
            onClick={() => { setActiveCategory("hybrid"); setActiveSubCategory(null); }}
            color={categoryColors.hybrid}
          />
          <CategoryTab
            label="Other"
            count={data.categories.other}
            active={activeCategory === "other"}
            onClick={() => { setActiveCategory("other"); setActiveSubCategory(null); }}
            color={categoryColors.other}
          />
        </div>

        {/* Sub-category chips */}
        <div className="flex flex-wrap gap-1.5">
          <SubCategoryChip
            label="All"
            active={activeSubCategory === null}
            onClick={() => setActiveSubCategory(null)}
          />
          {categorySubCategories[activeCategory].map(sub => (
            <SubCategoryChip
              key={sub}
              label={subCategoryLabels[sub]}
              active={activeSubCategory === sub}
              onClick={() => setActiveSubCategory(sub)}
            />
          ))}
        </div>

        {/* Search and Sort */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search funds or AMC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="returns_3y">3Y Returns</option>
            <option value="returns_1y">1Y Returns</option>
            <option value="aum">AUM (Size)</option>
            <option value="expense">Expense Ratio</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {/* Results count */}
        <div className="text-xs text-slate-500">
          Showing {filteredFunds.length} funds
          {activeSubCategory && ` in ${subCategoryLabels[activeSubCategory]}`}
        </div>

        {/* Fund List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {filteredFunds.slice(0, 15).map((fund, index) => (
            <div
              key={fund.schemeCode}
              className={`
                relative p-3 rounded-lg border transition-all cursor-pointer
                ${selectedFunds.includes(fund.schemeCode)
                  ? "bg-blue-900/30 border-blue-500/50"
                  : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600"
                }
              `}
              onClick={() => toggleFundSelection(fund.schemeCode)}
            >
              {/* Checkbox indicator */}
              <div className={`
                absolute top-3 left-3 w-4 h-4 rounded border flex items-center justify-center
                ${selectedFunds.includes(fund.schemeCode)
                  ? "bg-blue-600 border-blue-600"
                  : "border-slate-600"
                }
              `}>
                {selectedFunds.includes(fund.schemeCode) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <div className="ml-6">
                {/* Fund name and AMC */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-200 leading-tight">
                      {fund.schemeName}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {fund.amc} • {fund.planType === "direct" ? "Direct" : "Regular"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <StarRating rating={fund.rating} />
                    <RiskBadge level={fund.riskLevel} />
                  </div>
                </div>

                {/* Metrics row */}
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-slate-500">1Y: </span>
                      <span className={fund.returns["1Y"] >= 0 ? "text-emerald-400" : "text-red-400"}>
                        {fund.returns["1Y"] >= 0 ? "+" : ""}{fund.returns["1Y"]?.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">3Y: </span>
                      <span className={fund.returns["3Y"] >= 0 ? "text-emerald-400" : "text-red-400"}>
                        {fund.returns["3Y"] >= 0 ? "+" : ""}{fund.returns["3Y"]?.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">5Y: </span>
                      <span className={fund.returns["5Y"] >= 0 ? "text-emerald-400" : "text-red-400"}>
                        {fund.returns["5Y"] >= 0 ? "+" : ""}{fund.returns["5Y"]?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <div>
                      <span className="text-slate-500">AUM: </span>
                      ₹{fund.aum >= 1000 ? `${(fund.aum / 1000).toFixed(1)}K` : fund.aum.toFixed(0)} Cr
                    </div>
                    <div>
                      <span className="text-slate-500">Exp: </span>
                      {fund.expenseRatio.toFixed(2)}%
                    </div>
                    <div>
                      <span className="text-slate-500">NAV: </span>
                      ₹{fund.nav.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show more indicator */}
        {filteredFunds.length > 15 && (
          <div className="text-center">
            <button className="text-xs text-blue-400 hover:text-blue-300">
              Show all {filteredFunds.length} funds →
            </button>
          </div>
        )}

        <InterpretationFooter variant="info">
          {activeCategory === "equity" && "Equity funds invest primarily in stocks. Higher risk but potential for higher long-term returns. Best for 5+ year horizon."}
          {activeCategory === "debt" && "Debt funds invest in fixed-income securities. Lower risk with relatively stable returns. Good for 1-3 year goals."}
          {activeCategory === "hybrid" && "Hybrid funds combine equity and debt. Balanced risk-return profile suitable for moderate investors."}
          {activeCategory === "other" && "Includes gold funds, international funds, and fund of funds for specialized exposure."}
        </InterpretationFooter>
        </>
        )}

      {/* Comparison View */}
      {showComparison && selectedFundsData.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-200">Side-by-Side Comparison</h3>
            <div className="flex gap-2">
              {selectedFundsData.map(fund => (
                <button
                  key={fund.schemeCode}
                  onClick={() => toggleFundSelection(fund.schemeCode)}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300"
                >
                  {fund.schemeName.split(' ').slice(0, 3).join(' ')}
                  <span className="text-slate-500">×</span>
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">Metric</th>
                  {selectedFundsData.map(fund => (
                    <th key={fund.schemeCode} className="text-right py-2 px-3 text-slate-300 font-medium min-w-[150px]">
                      <div className="truncate">{fund.schemeName.split(' ').slice(0, 3).join(' ')}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{fund.amc}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {/* Category */}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-400">Category</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.schemeCode} className="py-2 px-3 text-right text-slate-300">
                      {fund.subCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                  ))}
                </tr>
                {/* 1Y Returns */}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-400">1Y Returns</td>
                  {selectedFundsData.map(fund => {
                    const best = Math.max(...selectedFundsData.map(f => f.returns["1Y"] || 0));
                    const isBest = fund.returns["1Y"] === best;
                    return (
                      <td key={fund.schemeCode} className={`py-2 px-3 text-right ${isBest ? 'text-emerald-400 font-medium' : 'text-slate-300'}`}>
                        {fund.returns["1Y"] > 0 ? '+' : ''}{fund.returns["1Y"]?.toFixed(1)}%
                        {isBest && <span className="ml-1 text-[10px]">★</span>}
                      </td>
                    );
                  })}
                </tr>
                {/* 3Y Returns */}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-400">3Y Returns</td>
                  {selectedFundsData.map(fund => {
                    const best = Math.max(...selectedFundsData.map(f => f.returns["3Y"] || 0));
                    const isBest = fund.returns["3Y"] === best;
                    return (
                      <td key={fund.schemeCode} className={`py-2 px-3 text-right ${isBest ? 'text-emerald-400 font-medium' : 'text-slate-300'}`}>
                        {fund.returns["3Y"] > 0 ? '+' : ''}{fund.returns["3Y"]?.toFixed(1)}%
                        {isBest && <span className="ml-1 text-[10px]">★</span>}
                      </td>
                    );
                  })}
                </tr>
                {/* 5Y Returns */}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-400">5Y Returns</td>
                  {selectedFundsData.map(fund => {
                    const best = Math.max(...selectedFundsData.map(f => f.returns["5Y"] || 0));
                    const isBest = fund.returns["5Y"] === best;
                    return (
                      <td key={fund.schemeCode} className={`py-2 px-3 text-right ${isBest ? 'text-emerald-400 font-medium' : 'text-slate-300'}`}>
                        {fund.returns["5Y"] > 0 ? '+' : ''}{fund.returns["5Y"]?.toFixed(1)}%
                        {isBest && <span className="ml-1 text-[10px]">★</span>}
                      </td>
                    );
                  })}
                </tr>
                {/* AUM */}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-400">AUM</td>
                  {selectedFundsData.map(fund => {
                    const best = Math.max(...selectedFundsData.map(f => f.aum));
                    const isBest = fund.aum === best;
                    return (
                      <td key={fund.schemeCode} className={`py-2 px-3 text-right ${isBest ? 'text-blue-400' : 'text-slate-300'}`}>
                        ₹{(fund.aum / 1000).toFixed(1)}K Cr
                      </td>
                    );
                  })}
                </tr>
                {/* Expense Ratio */}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-400">Expense Ratio</td>
                  {selectedFundsData.map(fund => {
                    const best = Math.min(...selectedFundsData.map(f => f.expenseRatio));
                    const isBest = fund.expenseRatio === best;
                    return (
                      <td key={fund.schemeCode} className={`py-2 px-3 text-right ${isBest ? 'text-emerald-400 font-medium' : 'text-slate-300'}`}>
                        {fund.expenseRatio.toFixed(2)}%
                        {isBest && <span className="ml-1 text-[10px]">★</span>}
                      </td>
                    );
                  })}
                </tr>
                {/* Risk Level */}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-400">Risk Level</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.schemeCode} className="py-2 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        fund.riskLevel === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                        fund.riskLevel === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                        fund.riskLevel === 'high' || fund.riskLevel === 'very_high' ? 'bg-red-500/20 text-red-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {fund.riskLevel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                  ))}
                </tr>
                {/* Rating */}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-400">Rating</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.schemeCode} className="py-2 px-3 text-right text-amber-400">
                      {'★'.repeat(fund.rating)}{'☆'.repeat(5 - fund.rating)}
                    </td>
                  ))}
                </tr>
                {/* NAV */}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-400">NAV</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.schemeCode} className="py-2 px-3 text-right text-slate-300">
                      ₹{fund.nav.toFixed(2)}
                    </td>
                  ))}
                </tr>
                {/* Min SIP */}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-400">Min SIP</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.schemeCode} className="py-2 px-3 text-right text-slate-300">
                      ₹{fund.minSipAmount}
                    </td>
                  ))}
                </tr>
                {/* Min Lumpsum */}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-400">Min Lumpsum</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.schemeCode} className="py-2 px-3 text-right text-slate-300">
                      ₹{fund.minLumpsum}
                    </td>
                  ))}
                </tr>
                {/* Exit Load */}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-400">Exit Load</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.schemeCode} className="py-2 px-3 text-right text-slate-300">
                      {fund.exitLoad}
                    </td>
                  ))}
                </tr>
                {/* Fund Manager */}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-400">Fund Manager</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.schemeCode} className="py-2 px-3 text-right text-slate-300">
                      {fund.fundManager}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <InterpretationFooter variant="info">
            ★ indicates the best value for that metric among selected funds. Lower expense ratio is better.
          </InterpretationFooter>
        </>
      )}
      </CardContent>
    </Card>
  );
}
