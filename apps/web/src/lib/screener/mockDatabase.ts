// ═══════════════════════════════════════════════════════════════════════════
// MOCK STOCK DATABASE - EXACTLY 15 INDIAN STOCKS
// ═══════════════════════════════════════════════════════════════════════════

import { Stock } from './queryParser';

function generateStock(
  symbol: string,
  name: string,
  sector: string,
  industry: string,
  basePrice: number,
  mcapBillions: number,
  pe: number,
  overrides: Partial<Stock> = {}
): Stock {
  const price = basePrice;
  const mcap = mcapBillions * 1e9;
  
  return {
    symbol,
    name,
    sector,
    industry,
    mcap,
    price,
    change: price * (Math.random() * 0.04 - 0.02),
    changePct: Math.random() * 4 - 2,
    pe,
    pb: pe * 0.3 * (0.9 + Math.random() * 0.2),
    ps: pe * 0.5 * (0.9 + Math.random() * 0.2),
    roe: 15 + Math.random() * 20,
    roa: 8 + Math.random() * 10,
    roce: 18 + Math.random() * 15,
    debtToEquity: Math.random() * 0.8,
    currentRatio: 1.5 + Math.random() * 1.5,
    dividendYield: 0.5 + Math.random() * 2.5,
    eps: price / pe,
    revenue: mcap * (0.3 + Math.random() * 0.3),
    revenueGrowth: 5 + Math.random() * 15,
    profitGrowth: 8 + Math.random() * 20,
    volume: Math.floor(2e6 + Math.random() * 10e6),
    avgVolume20d: Math.floor(2e6 + Math.random() * 8e6),
    volumeChange5d: -10 + Math.random() * 20,
    high52w: price * 1.25,
    low52w: price * 0.75,
    return1d: -2 + Math.random() * 4,
    return1w: -3 + Math.random() * 6,
    return1m: -5 + Math.random() * 10,
    return3m: -8 + Math.random() * 16,
    return6m: -10 + Math.random() * 25,
    return1y: 5 + Math.random() * 30,
    return3y: 20 + Math.random() * 60,
    cagr3y: 8 + Math.random() * 15,
    beta: 0.7 + Math.random() * 0.6,
    rsi: 40 + Math.random() * 30,
    deliveryPct: 35 + Math.random() * 25,
    deliveryPctAvg: 38 + Math.random() * 15,
    ...overrides,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXACTLY 15 STOCKS - NO MORE, NO LESS
// ═══════════════════════════════════════════════════════════════════════════

export const MOCK_STOCKS: Stock[] = [
  generateStock('TCS', 'Tata Consultancy Services', 'Technology', 'IT Services', 3720, 1350, 28),
  generateStock('INFY', 'Infosys Ltd', 'Technology', 'IT Services', 1820, 620, 24),
  generateStock('LTIM', 'LTIMindtree Ltd', 'Technology', 'IT Services', 5200, 180, 32),
  generateStock('HDFCBANK', 'HDFC Bank Ltd', 'Financial Services', 'Private Banks', 1650, 920, 18),
  generateStock('ICICIBANK', 'ICICI Bank Ltd', 'Financial Services', 'Private Banks', 1050, 740, 16),
  generateStock('SBIN', 'State Bank of India', 'Financial Services', 'Public Banks', 620, 550, 10),
  generateStock('BAJFINANCE', 'Bajaj Finance Ltd', 'Financial Services', 'NBFC', 6800, 420, 35),
  generateStock('HINDUNILVR', 'Hindustan Unilever Ltd', 'Consumer Goods', 'FMCG', 2450, 580, 55),
  generateStock('ITC', 'ITC Ltd', 'Consumer Goods', 'FMCG', 435, 540, 25),
  generateStock('TITAN', 'Titan Company Ltd', 'Consumer Goods', 'Jewellery', 3200, 285, 85),
  generateStock('RELIANCE', 'Reliance Industries Ltd', 'Energy', 'Oil & Gas', 2450, 1680, 22),
  generateStock('LT', 'Larsen & Toubro Ltd', 'Industrials', 'Infrastructure', 3100, 435, 30),
  generateStock('ADANIENT', 'Adani Enterprises Ltd', 'Industrials', 'Diversified', 2850, 325, 65),
  generateStock('SUNPHARMA', 'Sun Pharmaceutical Industries', 'Healthcare', 'Pharmaceuticals', 1180, 285, 28),
  generateStock('DRREDDY', "Dr. Reddy's Laboratories", 'Healthcare', 'Pharmaceuticals', 1220, 102, 22),
];

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const getStockDatabase = (): Stock[] => MOCK_STOCKS;

export const getStockBySymbol = (symbol: string): Stock | undefined => {
  return MOCK_STOCKS.find(s => s.symbol === symbol);
};

export const searchStocks = (query: string): Stock[] => {
  const q = query.toLowerCase();
  return MOCK_STOCKS.filter(s => 
    s.symbol.toLowerCase().includes(q) || 
    s.name.toLowerCase().includes(q)
  );
};

export const getStocksByCategory = () => {
  const byCategory: Record<string, Stock[]> = {};
  MOCK_STOCKS.forEach(stock => {
    const cat = stock.sector;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(stock);
  });
  return byCategory;
};
