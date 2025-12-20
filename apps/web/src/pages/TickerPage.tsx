import React, { useState, useEffect } from 'react';
import CandlestickHeroCard, { CandlestickHeroData } from '@/cards/technical/candlestick-hero';
import { NavHeader } from '@/components/layout/NavHeader';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface TickerQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  volume: number;
  avgVolume: number;
  marketCap: number;
  peRatio: number;
  eps: number;
  dividend: number;
  dividendYield: number;
  high52w: number;
  low52w: number;
  sector: string;
  industry: string;
}

interface TickerPageProps {
  symbol?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK QUOTE DATA (would come from real API)
// ═══════════════════════════════════════════════════════════════════════════

function generateMockQuote(symbol: string): TickerQuote {
  const basePrice = 150 + Math.random() * 100;
  const change = (Math.random() - 0.5) * 10;
  
  const companies: Record<string, { name: string; sector: string; industry: string }> = {
    TCS: { name: 'Tata Consultancy Services Ltd', sector: 'Information Technology', industry: 'IT Services' },
    INFY: { name: 'Infosys Ltd', sector: 'Information Technology', industry: 'IT Services' },
    RELIANCE: { name: 'Reliance Industries Ltd', sector: 'Energy', industry: 'Oil & Gas' },
    HDFCBANK: { name: 'HDFC Bank Ltd', sector: 'Financial Services', industry: 'Private Banks' },
    ICICIBANK: { name: 'ICICI Bank Ltd', sector: 'Financial Services', industry: 'Private Banks' },
    SBIN: { name: 'State Bank of India', sector: 'Financial Services', industry: 'Public Banks' },
    TITAN: { name: 'Titan Company Ltd', sector: 'Consumer Goods', industry: 'Jewellery & Watches' },
    HINDUNILVR: { name: 'Hindustan Unilever Ltd', sector: 'Consumer Goods', industry: 'FMCG' },
    ITC: { name: 'ITC Ltd', sector: 'Consumer Goods', industry: 'FMCG' },
    LT: { name: 'Larsen & Toubro Ltd', sector: 'Industrials', industry: 'Infrastructure' },
    BAJFINANCE: { name: 'Bajaj Finance Ltd', sector: 'Financial Services', industry: 'NBFC' },
    SUNPHARMA: { name: 'Sun Pharmaceutical Industries Ltd', sector: 'Healthcare', industry: 'Pharmaceuticals' },
    DRREDDY: { name: "Dr. Reddy's Laboratories Ltd", sector: 'Healthcare', industry: 'Pharmaceuticals' },
    ADANIENT: { name: 'Adani Enterprises Ltd', sector: 'Industrials', industry: 'Diversified' },
    LTIM: { name: 'LTIMindtree Ltd', sector: 'Information Technology', industry: 'IT Services' },
  };

  const info = companies[symbol] || { name: `${symbol} Corp.`, sector: 'Unknown', industry: 'Unknown' };

  return {
    symbol,
    name: info.name,
    price: +basePrice.toFixed(2),
    change: +change.toFixed(2),
    changePct: +((change / basePrice) * 100).toFixed(2),
    volume: Math.floor(Math.random() * 100e6),
    avgVolume: Math.floor(Math.random() * 80e6),
    marketCap: Math.floor(Math.random() * 3000e9),
    peRatio: +(15 + Math.random() * 30).toFixed(2),
    eps: +(basePrice / (15 + Math.random() * 20)).toFixed(2),
    dividend: +(Math.random() * 4).toFixed(2),
    dividendYield: +(Math.random() * 3).toFixed(2),
    high52w: +(basePrice * 1.3).toFixed(2),
    low52w: +(basePrice * 0.7).toFixed(2),
    sector: info.sector,
    industry: info.industry,
  };
}

// Generate mock candlestick data
function generateCandlestickData(symbol: string, quote: TickerQuote): CandlestickHeroData {
  const series: CandlestickHeroData['series'] = [];
  let currentPrice = quote.price * 0.9; // Start 10% lower
  const now = new Date();
  
  for (let i = 59; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const volatility = 0.015;
    const drift = (Math.random() - 0.48) * volatility;
    const open = currentPrice;
    const close = open * (1 + drift);
    const high = Math.max(open, close) * (1 + Math.random() * volatility);
    const low = Math.min(open, close) * (1 - Math.random() * volatility);
    const volume = quote.avgVolume * (0.5 + Math.random());
    
    series.push({
      date: date.toISOString().split('T')[0],
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume: Math.floor(volume),
    });
    
    currentPrice = close;
  }
  
  // Calculate indicators based on series
  const closes = series.map(s => s.close);
  const ma20 = closes.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const ma50 = closes.slice(-50).reduce((a, b) => a + b, 0) / Math.min(50, closes.length);
  const ma200 = closes.reduce((a, b) => a + b, 0) / closes.length;
  
  // Simple RSI calculation
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < Math.min(15, closes.length); i++) {
    const diff = closes[closes.length - i] - closes[closes.length - i - 1];
    if (diff > 0) gains.push(diff);
    else losses.push(Math.abs(diff));
  }
  const avgGain = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / 14 : 0;
  const avgLoss = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / 14 : 0.01;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  // Determine trend
  const lastClose = closes[closes.length - 1];
  const trend: 'Bullish' | 'Bearish' | 'Neutral' = 
    lastClose > ma20 && lastClose > ma50 ? 'Bullish' :
    lastClose < ma20 && lastClose < ma50 ? 'Bearish' : 'Neutral';
  
  return {
    symbol,
    asOf: new Date().toISOString().split('T')[0],
    lastPrice: quote.price,
    change: quote.change,
    changePct: quote.changePct,
    volume: quote.volume,
    avgVolume: quote.avgVolume,
    high52w: quote.high52w,
    low52w: quote.low52w,
    series,
    indicators: {
      ma20: +ma20.toFixed(2),
      ma50: +ma50.toFixed(2),
      ma200: +ma200.toFixed(2),
      rsi: +rsi.toFixed(1),
      macdLine: +(Math.random() * 10 - 5).toFixed(2),
      macdSignal: +(Math.random() * 8 - 4).toFixed(2),
      macdHist: +(Math.random() * 4 - 2).toFixed(2),
      bbUpper: +(lastClose * 1.05).toFixed(2),
      bbLower: +(lastClose * 0.95).toFixed(2),
    },
    pattern: Math.random() > 0.7 ? (trend === 'Bullish' ? 'Bullish Engulfing' : trend === 'Bearish' ? 'Evening Star' : null) : null,
    trend,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN TICKER PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function TickerPage({ symbol: propSymbol }: TickerPageProps) {
  const [symbol, setSymbol] = useState(propSymbol || 'TCS');
  const [quote, setQuote] = useState<TickerQuote | null>(null);
  const [chartData, setChartData] = useState<CandlestickHeroData | null>(null);
  const [searchInput, setSearchInput] = useState('');

  // Load quote and chart data on mount/symbol change
  useEffect(() => {
    const newQuote = generateMockQuote(symbol);
    setQuote(newQuote);
    setChartData(generateCandlestickData(symbol, newQuote));
  }, [symbol]);

  if (!quote) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const isPositive = quote.change >= 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <NavHeader currentPage="ticker" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Symbol Search */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 mb-6">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Change Symbol</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchInput) {
                  setSymbol(searchInput);
                  setSearchInput('');
                }
              }}
              placeholder="Enter symbol..."
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500"
            />
            <button
              onClick={() => {
                if (searchInput) {
                  setSymbol(searchInput);
                  setSearchInput('');
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500"
            >
              Go
            </button>
          </div>
          
          {/* Quick Symbols */}
          <div className="flex flex-wrap gap-1 mt-3">
            {['TCS', 'INFY', 'RELIANCE', 'HDFCBANK', 'ICICIBANK', 'TITAN', 'ITC', 'SBIN', 'LT', 'BAJFINANCE'].map(s => (
              <button
                key={s}
                onClick={() => setSymbol(s)}
                className={`px-2 py-1 rounded text-xs ${
                  symbol === s ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Quote Header */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-100">{quote.symbol}</h1>
                <span className="px-2 py-0.5 text-xs rounded bg-slate-700 text-slate-300">{quote.sector}</span>
              </div>
              <div className="text-sm text-slate-400 mt-1">{quote.name}</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-slate-100">₹{quote.price.toFixed(2)}</div>
              <div className={`text-lg font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{quote.change.toFixed(2)} ({isPositive ? '+' : ''}{quote.changePct.toFixed(2)}%)
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="pt-4 border-t border-slate-700">
            <div className="text-sm text-slate-200">{quote.sector} → {quote.industry}</div>
          </div>
        </div>

        {/* Candlestick Chart */}
        {chartData && (
          <div className="mb-6">
            <CandlestickHeroCard data={chartData} />
          </div>
        )}

        {/* Key Statistics */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-4">Key Statistics</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-slate-500 mb-1">Market Cap</div>
              <div className="text-lg font-semibold text-slate-200">₹{(quote.marketCap / 1e7).toFixed(0)} Cr</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">P/E Ratio</div>
              <div className="text-lg font-semibold text-slate-200">{quote.peRatio.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">EPS (TTM)</div>
              <div className="text-lg font-semibold text-slate-200">₹{quote.eps.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Dividend Yield</div>
              <div className="text-lg font-semibold text-slate-200">{quote.dividendYield.toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">52W High</div>
              <div className="text-lg font-semibold text-slate-200">₹{quote.high52w.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">52W Low</div>
              <div className="text-lg font-semibold text-slate-200">₹{quote.low52w.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Volume</div>
              <div className="text-lg font-semibold text-slate-200">{(quote.volume / 1e6).toFixed(1)}M</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Avg Volume</div>
              <div className="text-lg font-semibold text-slate-200">{(quote.avgVolume / 1e6).toFixed(1)}M</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
