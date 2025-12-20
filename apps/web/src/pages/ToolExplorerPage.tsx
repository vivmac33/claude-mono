import React, { useState, useMemo } from 'react';
import { cardRegistry, CardDescriptor } from '@/registry/cardRegistry';
import { DynamicCardLoader } from '@/components/output/DynamicCardLoader';
import { ToolHoverTooltip } from '@/components/learning/ConceptTooltip';
import { NavHeader } from '@/components/layout/NavHeader';
import { useTheme } from '@/components/ThemeProvider';

// All available stocks in the system
const AVAILABLE_STOCKS = [
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT' },
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking' },
  { symbol: 'INFY', name: 'Infosys', sector: 'IT' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'FMCG' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking' },
  { symbol: 'ITC', name: 'ITC Limited', sector: 'FMCG' },
  { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure' },
  { symbol: 'AXISBANK', name: 'Axis Bank', sector: 'Banking' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', sector: 'Consumer' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', sector: 'Auto' },
  { symbol: 'WIPRO', name: 'Wipro', sector: 'IT' },
];

const CATEGORY_ORDER = ['value', 'growth', 'risk', 'technical', 'macro', 'portfolio', 'cashflow', 'income', 'derivatives', 'mutual-funds', 'commodities', 'mini'];

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  value: { icon: '💎', color: 'bg-blue-600' },
  growth: { icon: '📈', color: 'bg-green-600' },
  risk: { icon: '🛡️', color: 'bg-red-600' },
  technical: { icon: '📊', color: 'bg-purple-600' },
  macro: { icon: '🌍', color: 'bg-amber-600' },
  portfolio: { icon: '💼', color: 'bg-indigo-600' },
  cashflow: { icon: '💵', color: 'bg-emerald-600' },
  income: { icon: '💰', color: 'bg-yellow-600' },
  derivatives: { icon: '📉', color: 'bg-pink-600' },
  'mutual-funds': { icon: '📁', color: 'bg-cyan-600' },
  commodities: { icon: '🏭', color: 'bg-orange-600' },
  mini: { icon: '⚡', color: 'bg-slate-600' },
};

function getCardsByCategory(): Map<string, CardDescriptor[]> {
  const map = new Map<string, CardDescriptor[]>();
  cardRegistry.forEach(card => {
    const existing = map.get(card.category) || [];
    existing.push(card);
    map.set(card.category, existing);
  });
  return map;
}

// Individual Tool Card with its own ticker management
function ToolCard({ card, isDark }: { card: CardDescriptor; isDark: boolean }) {
  const [selectedStocks, setSelectedStocks] = useState<string[]>(['TCS']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Hide ticker controls for mutual funds category
  const showTickerControls = card.category !== 'mutual-funds';

  const handleToggleStock = (symbol: string) => {
    setSelectedStocks(prev => {
      if (prev.includes(symbol)) {
        if (prev.length === 1) return prev; // Keep at least 1
        return prev.filter(s => s !== symbol);
      } else {
        if (prev.length >= 4) return prev; // Max 4
        return [...prev, symbol];
      }
    });
  };

  return (
    <div 
      className={`rounded-xl transition-all hover:z-50 ${
        isDark 
          ? 'bg-slate-800/30 border border-slate-700/50' 
          : 'bg-white border border-slate-200 shadow-sm'
      }`}
      style={{ overflow: 'visible', position: 'relative' }}
    >
      {/* Tool Header */}
      <div className={`p-3 border-b rounded-t-xl ${
        isDark 
          ? 'bg-slate-800/50 border-slate-700/50' 
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 relative" style={{ zIndex: 100 }}>
            <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{card.label}</span>
            {/* Hover tooltip - shows quick definition & formula */}
            <ToolHoverTooltip toolId={card.id}>
              <span className="p-1 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 cursor-help transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </ToolHoverTooltip>
          </div>
          
          {/* Add Tickers Button - only show for non-MF tools */}
          {showTickerControls && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-md text-xs transition-colors ${
                isDark 
                  ? 'bg-slate-700 hover:bg-slate-600 border-slate-600'
                  : 'bg-white hover:bg-slate-50 border-slate-300'
              }`}
            >
              <svg className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Tickers</span>
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>({selectedStocks.length}/4)</span>
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className={`absolute top-full right-0 mt-1 w-72 max-h-80 overflow-y-auto border rounded-lg shadow-xl z-50 ${
                  isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-300'
                }`}>
                  <div className={`p-2 border-b sticky top-0 ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
                    <div className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Select up to 4 stocks</div>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    {AVAILABLE_STOCKS.map(stock => {
                      const isSelected = selectedStocks.includes(stock.symbol);
                      const isDisabled = !isSelected && selectedStocks.length >= 4;
                      
                      return (
                        <button
                          key={stock.symbol}
                          onClick={() => !isDisabled && handleToggleStock(stock.symbol)}
                          disabled={isDisabled}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors ${
                            isSelected 
                              ? 'bg-blue-600/20 border border-blue-500/40 text-blue-500' 
                              : isDisabled
                                ? isDark ? 'bg-slate-700/20 text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : isDark ? 'hover:bg-slate-700/50 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : isDark ? 'border-slate-500' : 'border-slate-400'}`}>
                              {isSelected && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                            </span>
                            <div>
                              <div className="text-xs font-medium">{stock.symbol}</div>
                              <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{stock.name}</div>
                            </div>
                          </div>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>{stock.sector}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
          )}
        </div>

        {/* Selected Stocks Pills - only show for non-MF tools */}
        {showTickerControls && (
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {selectedStocks.map(symbol => (
            <span 
              key={symbol}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-600/20 border border-blue-500/30 rounded text-[10px] text-blue-300"
            >
              {symbol}
              {selectedStocks.length > 1 && (
                <button 
                  onClick={() => handleToggleStock(symbol)}
                  className="hover:text-blue-100 ml-0.5"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
        )}
      </div>
      
      {/* Cards Grid for selected stocks */}
      <div className={`grid gap-3 p-3 ${
        !showTickerControls ? 'grid-cols-1' :
        selectedStocks.length === 1 ? 'grid-cols-1' :
        selectedStocks.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
        selectedStocks.length === 3 ? 'grid-cols-1 lg:grid-cols-3' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      }`}>
        {(showTickerControls ? selectedStocks : ['MF']).map(symbol => (
          <div key={symbol} className="relative">
            {showTickerControls && selectedStocks.length > 1 && (
              <div className="absolute top-2 right-2 z-10 px-1.5 py-0.5 bg-slate-900/90 rounded text-[10px] font-medium text-blue-400 border border-slate-700">
                {symbol}
              </div>
            )}
            <DynamicCardLoader
              cardId={card.id}
              symbol={symbol}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ToolExplorerPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedCategory, setSelectedCategory] = useState<string>('value');
  
  const cardsByCategory = useMemo(() => getCardsByCategory(), []);
  const categories = CATEGORY_ORDER.filter(cat => cardsByCategory.has(cat));
  const currentCards = cardsByCategory.get(selectedCategory) || [];

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white' : 'bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-900'}`}>
      {/* Header */}
      <NavHeader currentPage="tools" />

      {/* Category Tabs - Wrap to multiple lines */}
      <div className={`sticky top-[57px] z-40 backdrop-blur border-b ${isDark ? 'bg-slate-900/95 border-slate-800/50' : 'bg-white/95 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {categories.map(cat => {
                const meta = CATEGORY_META[cat] || { icon: '📦', color: 'bg-gray-600' };
                const count = cardsByCategory.get(cat)?.length || 0;
                const isSelected = selectedCategory === cat;
                
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isSelected 
                        ? `${meta.color} text-white` 
                        : isDark 
                          ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <span>{meta.icon}</span>
                    <span className="capitalize">{cat.replace('-', ' ')}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${isSelected ? 'bg-white/20' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className={`text-sm ml-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {cardRegistry.length} Tools
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold capitalize">{selectedCategory.replace('-', ' ')}</h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {currentCards.length} tools • Each tool supports up to 4 tickers for comparison
          </p>
        </div>

        <div className="space-y-6">
          {currentCards.map(card => (
            <ToolCard key={card.id} card={card} isDark={isDark} />
          ))}
        </div>

        {currentCards.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No tools in this category
          </div>
        )}
      </main>
    </div>
  );
}
