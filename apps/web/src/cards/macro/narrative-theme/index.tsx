// ═══════════════════════════════════════════════════════════════════════════
// NARRATIVE THEME TRACKER
// Systematizes market themes and narratives for Indian markets
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
} from "@/types/card-output";

import { CATEGORY_STYLES } from "@/lib/chartTheme";

interface NarrativeThemeProps {
  data?: ThemeData;
}

interface Theme {
  id: string;
  name: string;
  description: string;
  type: 'long_term' | 'short_term' | 'cyclical';
  strength: number; // 0-100
  momentum: 'accelerating' | 'stable' | 'decelerating';
  fundFlow: 'inflow' | 'outflow' | 'neutral';
  duration: string;
  startDate: string;
  leaders: Stock[];
  laggards: Stock[];
  catalysts: string[];
  risks: string[];
  mfExposure: number; // % of MF AUM
  fiiActivity: 'buying' | 'selling' | 'neutral';
  retailSentiment: 'bullish' | 'bearish' | 'neutral';
  technicalSetup: string;
}

interface Stock {
  symbol: string;
  name: string;
  return1m: number;
  return3m: number;
  relativeStrength: number;
  pullbackZone?: { low: number; high: number };
}

export interface ThemeData {
  themes: Theme[];
  lastUpdated: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function getNarrativeThemeOutput(data: ThemeData): CardOutput {
  const { themes, lastUpdated } = data;
  
  const strongThemes = themes.filter(t => t.strength > 70);
  const acceleratingThemes = themes.filter(t => t.momentum === "accelerating");
  const inflowThemes = themes.filter(t => t.fundFlow === "inflow");
  
  const topTheme = themes.sort((a, b) => b.strength - a.strength)[0];
  
  const bullishThemes = themes.filter(t => t.momentum === "accelerating" && t.fundFlow === "inflow").length;
  const bearishThemes = themes.filter(t => t.momentum === "decelerating" && t.fundFlow === "outflow").length;
  
  const sentiment = bullishThemes > bearishThemes ? "bullish" : bearishThemes > bullishThemes ? "bearish" : "neutral";
  const signalStrength = strongThemes.length > 3 ? 5 : strongThemes.length > 1 ? 4 : strongThemes.length > 0 ? 3 : 2;
  
  const keyMetrics: MetricValue[] = [
    createMetric("Active Themes", "nt_active", themes.length, "neutral", 
      { format: "number", priority: 1 }),
    createMetric("Strong Themes", "nt_strong", strongThemes.length, 
      strongThemes.length > 3 ? "excellent" : strongThemes.length > 1 ? "good" : "fair",
      { format: "number", priority: 1 }),
    createMetric("Accelerating", "nt_accelerating", acceleratingThemes.length, 
      acceleratingThemes.length > 2 ? "excellent" : acceleratingThemes.length > 0 ? "good" : "neutral",
      { format: "number", priority: 2 }),
    createMetric("Inflow Themes", "nt_inflow", inflowThemes.length, 
      inflowThemes.length > themes.length / 2 ? "good" : "fair",
      { format: "number", priority: 2 }),
  ];
  
  // Add top theme metrics if exists
  if (topTheme) {
    keyMetrics.push(
      createMetric("Top Theme Strength", "nt_top_strength", topTheme.strength, 
        topTheme.strength > 80 ? "excellent" : topTheme.strength > 60 ? "good" : "fair",
        { format: "score", priority: 1 }),
      createMetric("Top Theme MF Exposure", "nt_top_mf", topTheme.mfExposure, "neutral", 
        { format: "percent", priority: 2 })
    );
  }
  
  const insights: Insight[] = [];
  
  // Top theme insight
  if (topTheme) {
    const themeStatus = topTheme.momentum === "accelerating" ? "strengthening" : topTheme.momentum === "decelerating" ? "weakening" : "stable";
    insights.push(createInsight(
      topTheme.momentum === "accelerating" ? "strength" : topTheme.momentum === "decelerating" ? "weakness" : "observation",
      `Top theme: ${topTheme.name} (${topTheme.strength}/100) - ${themeStatus}`,
      1, ["nt_top_strength"]
    ));
  }
  
  // Accelerating themes
  if (acceleratingThemes.length > 2) {
    insights.push(createInsight("strength", `${acceleratingThemes.length} themes accelerating: ${acceleratingThemes.slice(0, 2).map(t => t.name).join(", ")}`, 2, ["nt_accelerating"]));
  }
  
  // Top theme leaders
  if (topTheme && topTheme.leaders.length > 0) {
    insights.push(createInsight("observation", `${topTheme.name} leaders: ${topTheme.leaders.slice(0, 3).map(s => s.symbol).join(", ")}`, 3));
  }
  
  // Catalysts and risks
  if (topTheme && topTheme.catalysts.length > 0) {
    insights.push(createInsight("opportunity", `Key catalyst: ${topTheme.catalysts[0]}`, 3));
  }
  if (topTheme && topTheme.risks.length > 0) {
    insights.push(createInsight("risk", `Key risk: ${topTheme.risks[0]}`, 3));
  }
  
  const headline = `${strongThemes.length} strong themes active, top: ${topTheme?.name || "None"} (${topTheme?.strength || 0}/100)`;
  
  return {
    cardId: "narrative-theme",
    cardCategory: "macro",
    symbol: "MARKET",
    asOf: lastUpdated.split('T')[0],
    headline,
    sentiment,
    confidence: "medium",
    signalStrength: signalStrength as 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    suggestedCards: ["market-regime-radar", "shareholding-pattern", "sector-rotation"],
    tags: ["themes", "narrative", topTheme?.id || "general"],
    scoreContribution: {
      category: "momentum",
      score: topTheme ? topTheme.strength : 50,
      weight: 0.10,
    },
  };
}

// Mock data for demonstration
const MOCK_DATA: ThemeData = {
  lastUpdated: new Date().toISOString(),
  themes: [
    {
      id: 'psu-banks',
      name: 'PSU Banks Renaissance',
      description: 'Government banks benefiting from NPL cleanup, digital push, and credit growth',
      type: 'long_term',
      strength: 85,
      momentum: 'accelerating',
      fundFlow: 'inflow',
      duration: '18 months',
      startDate: '2023-06-01',
      leaders: [
        { symbol: 'SBIN', name: 'State Bank of India', return1m: 8.5, return3m: 22.4, relativeStrength: 1.35, pullbackZone: { low: 780, high: 810 } },
        { symbol: 'BANKBARODA', name: 'Bank of Baroda', return1m: 12.3, return3m: 35.2, relativeStrength: 1.52 },
        { symbol: 'PNB', name: 'Punjab National Bank', return1m: 15.1, return3m: 42.8, relativeStrength: 1.68 },
      ],
      laggards: [
        { symbol: 'INDIANB', name: 'Indian Bank', return1m: 2.1, return3m: 8.5, relativeStrength: 0.92 },
        { symbol: 'CENTRALBK', name: 'Central Bank', return1m: -1.2, return3m: 5.2, relativeStrength: 0.78 },
      ],
      catalysts: ['Asset quality improvement', 'Credit growth revival', 'Government recapitalization', 'Digital transformation'],
      risks: ['Interest rate reversal', 'Global slowdown impact', 'Asset quality slippage'],
      mfExposure: 12.5,
      fiiActivity: 'buying',
      retailSentiment: 'bullish',
      technicalSetup: 'Weekly breakout from 2-year consolidation, holding above 20 WMA',
    },
    {
      id: 'defence',
      name: 'Defence & Aerospace',
      description: 'Make-in-India push driving domestic defence manufacturing orders',
      type: 'long_term',
      strength: 78,
      momentum: 'stable',
      fundFlow: 'inflow',
      duration: '24 months',
      startDate: '2022-12-01',
      leaders: [
        { symbol: 'HAL', name: 'Hindustan Aeronautics', return1m: 5.2, return3m: 18.5, relativeStrength: 1.28 },
        { symbol: 'BEL', name: 'Bharat Electronics', return1m: 7.8, return3m: 25.3, relativeStrength: 1.42 },
        { symbol: 'BHARATFORGE', name: 'Bharat Forge', return1m: 4.5, return3m: 15.2, relativeStrength: 1.15 },
      ],
      laggards: [
        { symbol: 'COCHINSHIP', name: 'Cochin Shipyard', return1m: -2.5, return3m: 8.2, relativeStrength: 0.88 },
      ],
      catalysts: ['Government order book', 'Export potential', 'Technology transfer', 'Geopolitical tensions'],
      risks: ['Execution delays', 'Budget constraints', 'Import dependency for components'],
      mfExposure: 3.8,
      fiiActivity: 'neutral',
      retailSentiment: 'bullish',
      technicalSetup: 'Sector index near all-time high, some stocks in consolidation',
    },
    {
      id: 'railway',
      name: 'Railway Infrastructure',
      description: 'Massive capex push in railway modernization and expansion',
      type: 'long_term',
      strength: 72,
      momentum: 'accelerating',
      fundFlow: 'inflow',
      duration: '12 months',
      startDate: '2023-09-01',
      leaders: [
        { symbol: 'IRFC', name: 'Indian Railway Finance', return1m: 18.5, return3m: 65.2, relativeStrength: 2.15, pullbackZone: { low: 145, high: 155 } },
        { symbol: 'RVNL', name: 'Rail Vikas Nigam', return1m: 22.3, return3m: 78.5, relativeStrength: 2.45 },
        { symbol: 'IRCON', name: 'Ircon International', return1m: 15.8, return3m: 52.3, relativeStrength: 1.85 },
      ],
      laggards: [
        { symbol: 'BEML', name: 'BEML', return1m: 3.2, return3m: 12.5, relativeStrength: 1.02 },
      ],
      catalysts: ['Budget allocation increase', 'Vande Bharat expansion', 'Dedicated freight corridors', 'Station redevelopment'],
      risks: ['Execution bottlenecks', 'Valuation concerns', 'Policy changes'],
      mfExposure: 2.1,
      fiiActivity: 'neutral',
      retailSentiment: 'bullish',
      technicalSetup: 'Parabolic rally - caution on latecoming entries',
    },
    {
      id: 'ev-auto',
      name: 'EV & Auto Ancillaries',
      description: 'Electric vehicle adoption driving ancillary demand',
      type: 'cyclical',
      strength: 65,
      momentum: 'decelerating',
      fundFlow: 'neutral',
      duration: '8 months',
      startDate: '2024-01-01',
      leaders: [
        { symbol: 'TATAMOTORS', name: 'Tata Motors', return1m: 2.5, return3m: 12.8, relativeStrength: 1.12 },
        { symbol: 'M&M', name: 'Mahindra & Mahindra', return1m: 4.2, return3m: 15.5, relativeStrength: 1.18 },
      ],
      laggards: [
        { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp', return1m: -3.5, return3m: -2.1, relativeStrength: 0.72 },
        { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto', return1m: -1.8, return3m: 5.2, relativeStrength: 0.85 },
      ],
      catalysts: ['Policy support', 'Battery cost reduction', 'Charging infrastructure', 'Consumer preference shift'],
      risks: ['Commodity prices', 'Technology disruption', 'Competition from China'],
      mfExposure: 8.5,
      fiiActivity: 'selling',
      retailSentiment: 'neutral',
      technicalSetup: 'Consolidation after rally, needs volume confirmation for breakout',
    },
    {
      id: 'it-services',
      name: 'IT Services Recovery',
      description: 'Bottoming out after deal delays, AI investments driving differentiation',
      type: 'short_term',
      strength: 45,
      momentum: 'accelerating',
      fundFlow: 'inflow',
      duration: '3 months',
      startDate: '2024-06-01',
      leaders: [
        { symbol: 'TCS', name: 'Tata Consultancy', return1m: 5.8, return3m: 8.2, relativeStrength: 1.08, pullbackZone: { low: 3850, high: 3950 } },
        { symbol: 'INFY', name: 'Infosys', return1m: 7.2, return3m: 10.5, relativeStrength: 1.12 },
      ],
      laggards: [
        { symbol: 'WIPRO', name: 'Wipro', return1m: 2.1, return3m: -2.5, relativeStrength: 0.88 },
        { symbol: 'TECHM', name: 'Tech Mahindra', return1m: 1.5, return3m: -5.2, relativeStrength: 0.82 },
      ],
      catalysts: ['Deal pipeline improvement', 'AI/GenAI offerings', 'Cost optimization benefits', 'Rupee depreciation'],
      risks: ['US recession fears', 'Client budget cuts', 'Wage inflation', 'Visa restrictions'],
      mfExposure: 15.2,
      fiiActivity: 'buying',
      retailSentiment: 'bearish',
      technicalSetup: 'Base formation complete, attempting breakout from downtrend',
    },
  ],
};

export default function NarrativeThemeTracker({ data }: NarrativeThemeProps) {
  const categoryStyle = CATEGORY_STYLES['macro'];

  const safeData = data || MOCK_DATA;
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'long_term' | 'short_term' | 'cyclical'>('all');
  
  const filteredThemes = useMemo(() => {
    if (filterType === 'all') return safeData.themes;
    return safeData.themes.filter(t => t.type === filterType);
  }, [safeData.themes, filterType]);
  
  const activeTheme = selectedTheme ? safeData.themes.find(t => t.id === selectedTheme) : null;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-5 border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider">Narrative Tracker</div>
          <div className="text-lg font-semibold text-slate-100">Market Themes & Ideas</div>
          <div className="text-xs text-slate-400 mt-1">{safeData.themes.length} active themes</div>
        </div>
        <div className="text-xs text-slate-500">
          Updated: {new Date(safeData.lastUpdated).toLocaleDateString()}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {(['all', 'long_term', 'short_term', 'cyclical'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === type
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {type === 'all' ? 'All' : type === 'long_term' ? 'Long-term' : type === 'short_term' ? 'Short-term' : 'Cyclical'}
          </button>
        ))}
      </div>

      {/* Theme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {filteredThemes.map(theme => (
          <ThemeCard 
            key={theme.id} 
            theme={theme} 
            isSelected={selectedTheme === theme.id}
            onClick={() => setSelectedTheme(selectedTheme === theme.id ? null : theme.id)}
          />
        ))}
      </div>

      {/* Expanded Theme Detail */}
      {activeTheme && (
        <ThemeDetail theme={activeTheme} />
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-500">
          💡 Themes systematize narratives from news & social media. Use leaders for momentum plays, laggards for value. Pullback zones are for swing entries.
        </div>
      </div>
    </div>
  );
}

function ThemeCard({ theme, isSelected, onClick }: { theme: Theme; isSelected: boolean; onClick: () => void }) {
  const typeColors = {
    long_term: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    short_term: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    cyclical: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };
  
  const momentumColors = {
    accelerating: 'text-emerald-400',
    stable: 'text-yellow-400',
    decelerating: 'text-red-400',
  };

  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected 
          ? 'bg-blue-500/10 border-blue-500/50' 
          : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-medium text-slate-200">{theme.name}</div>
          <div className={`inline-block px-2 py-0.5 rounded text-xs border ${typeColors[theme.type]}`}>
            {theme.type.replace('_', '-')}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-400">{Math.round(theme.strength)}</div>
          <div className="text-xs text-slate-500">strength</div>
        </div>
      </div>
      
      <div className="text-xs text-slate-400 mb-3 line-clamp-2">{theme.description}</div>
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className={momentumColors[theme.momentum]}>
            {theme.momentum === 'accelerating' ? '↗' : theme.momentum === 'stable' ? '→' : '↘'} {theme.momentum}
          </span>
          <span className={theme.fundFlow === 'inflow' ? 'text-emerald-400' : theme.fundFlow === 'outflow' ? 'text-red-400' : 'text-slate-400'}>
            {theme.fundFlow}
          </span>
        </div>
        <span className="text-slate-500">{theme.duration}</span>
      </div>
    </div>
  );
}

function ThemeDetail({ theme }: { theme: Theme }) {
  return (
    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
      <div className="text-sm font-medium text-slate-200 mb-4">{theme.name} - Detailed View</div>
      
      {/* Leaders & Laggards */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-emerald-400 mb-2">🚀 Leaders</div>
          <div className="space-y-2">
            {theme.leaders.map(stock => (
              <div key={stock.symbol} className="p-2 bg-slate-800 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-200">{stock.symbol}</span>
                  <span className="text-xs text-emerald-400">RS: {stock.relativeStrength.toFixed(2)}</span>
                </div>
                <div className="text-xs text-slate-400">{stock.name}</div>
                <div className="flex gap-3 mt-1 text-xs">
                  <span className={stock.return1m >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    1M: {stock.return1m >= 0 ? '+' : ''}{stock.return1m.toFixed(1)}%
                  </span>
                  <span className={stock.return3m >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    3M: {stock.return3m >= 0 ? '+' : ''}{stock.return3m.toFixed(1)}%
                  </span>
                </div>
                {stock.pullbackZone && (
                  <div className="mt-1 text-xs text-yellow-400">
                    📍 Pullback zone: ₹{stock.pullbackZone.low} - ₹{stock.pullbackZone.high}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-xs text-red-400 mb-2">📉 Laggards (Value Plays)</div>
          <div className="space-y-2">
            {theme.laggards.map(stock => (
              <div key={stock.symbol} className="p-2 bg-slate-800 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-200">{stock.symbol}</span>
                  <span className="text-xs text-slate-400">RS: {stock.relativeStrength.toFixed(2)}</span>
                </div>
                <div className="text-xs text-slate-400">{stock.name}</div>
                <div className="flex gap-3 mt-1 text-xs">
                  <span className={stock.return1m >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    1M: {stock.return1m >= 0 ? '+' : ''}{stock.return1m.toFixed(1)}%
                  </span>
                  <span className={stock.return3m >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    3M: {stock.return3m >= 0 ? '+' : ''}{stock.return3m.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Catalysts & Risks */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-emerald-400 mb-2">✨ Catalysts</div>
          <ul className="space-y-1">
            {theme.catalysts.map((c, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-1">
                <span className="text-emerald-500">•</span> {c}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs text-red-400 mb-2">⚠️ Risks</div>
          <ul className="space-y-1">
            {theme.risks.map((r, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-1">
                <span className="text-red-500">•</span> {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Sentiment Indicators */}
      <div className="grid grid-cols-4 gap-2 p-3 bg-slate-800 rounded">
        <div className="text-center">
          <div className="text-xs text-slate-500">MF Exposure</div>
          <div className="text-sm font-medium text-slate-200">{theme.mfExposure}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500">FII Activity</div>
          <div className={`text-sm font-medium ${
            theme.fiiActivity === 'buying' ? 'text-emerald-400' : 
            theme.fiiActivity === 'selling' ? 'text-red-400' : 'text-slate-400'
          }`}>
            {theme.fiiActivity}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500">Retail</div>
          <div className={`text-sm font-medium ${
            theme.retailSentiment === 'bullish' ? 'text-emerald-400' : 
            theme.retailSentiment === 'bearish' ? 'text-red-400' : 'text-slate-400'
          }`}>
            {theme.retailSentiment}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500">Duration</div>
          <div className="text-sm font-medium text-slate-200">{theme.duration}</div>
        </div>
      </div>
      
      {/* Technical Setup */}
      <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-300">
        📊 {theme.technicalSetup}
      </div>
    </div>
  );
}
