// ═══════════════════════════════════════════════════════════════════════════
// DATA SERVICE - Fetches real data from Supabase
// ═══════════════════════════════════════════════════════════════════════════

import { supabase, StockInfo, StockOHLCV, MutualFund, StockFinancials } from './supabase';

// Cache for frequently accessed data
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ═══════════════════════════════════════════════════════════════════════════
// STOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

export async function getStockInfo(symbol: string): Promise<StockInfo | null> {
  const cacheKey = `stock_info_${symbol}`;
  const cached = getCached<StockInfo>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('stocks_info')
    .select('*')
    .eq('symbol', symbol)
    .single();

  if (error || !data) return null;
  setCache(cacheKey, data);
  return data;
}

export async function getAllStocks(): Promise<StockInfo[]> {
  const cacheKey = 'all_stocks';
  const cached = getCached<StockInfo[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('stocks_info')
    .select('*')
    .order('market_cap', { ascending: false });

  if (error || !data) return [];
  setCache(cacheKey, data);
  return data;
}

export async function getStocksBySector(sector: string): Promise<StockInfo[]> {
  const { data, error } = await supabase
    .from('stocks_info')
    .select('*')
    .eq('sector', sector)
    .order('market_cap', { ascending: false });

  return data || [];
}

export async function searchStocks(query: string): Promise<StockInfo[]> {
  const { data, error } = await supabase
    .from('stocks_info')
    .select('*')
    .or(`symbol.ilike.%${query}%,company_name.ilike.%${query}%`)
    .limit(20);

  return data || [];
}

// ═══════════════════════════════════════════════════════════════════════════
// OHLCV DATA
// ═══════════════════════════════════════════════════════════════════════════

export async function getStockOHLCV(
  symbol: string,
  days: number = 365
): Promise<StockOHLCV[]> {
  const cacheKey = `ohlcv_${symbol}_${days}`;
  const cached = getCached<StockOHLCV[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('stock_ohlcv')
    .select('*')
    .eq('symbol', symbol)
    .order('date', { ascending: false })
    .limit(days);

  if (error || !data) return [];
  
  // Reverse to chronological order
  const sorted = data.reverse();
  setCache(cacheKey, sorted);
  return sorted;
}

export async function getIndexOHLCV(
  symbol: string,
  days: number = 365
): Promise<StockOHLCV[]> {
  const { data, error } = await supabase
    .from('index_ohlcv')
    .select('*')
    .eq('symbol', symbol)
    .order('date', { ascending: false })
    .limit(days);

  return data?.reverse() || [];
}

export async function getLatestPrice(symbol: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('stock_ohlcv')
    .select('close')
    .eq('symbol', symbol)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  return data?.close || null;
}

// ═══════════════════════════════════════════════════════════════════════════
// FINANCIALS DATA
// ═══════════════════════════════════════════════════════════════════════════

export async function getStockFinancials(symbol: string): Promise<StockFinancials | null> {
  const cacheKey = `financials_${symbol}`;
  const cached = getCached<StockFinancials>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('stock_financials')
    .select('*')
    .eq('symbol', symbol)
    .single();

  if (error || !data) return null;
  setCache(cacheKey, data);
  return data;
}

// ═══════════════════════════════════════════════════════════════════════════
// MUTUAL FUNDS DATA
// ═══════════════════════════════════════════════════════════════════════════

export async function getAllMutualFunds(): Promise<MutualFund[]> {
  const cacheKey = 'all_mf';
  const cached = getCached<MutualFund[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('mutual_funds')
    .select('*')
    .order('cagr3Y', { ascending: false });

  if (error || !data) return [];
  setCache(cacheKey, data);
  return data;
}

export async function getMutualFundsByCategory(category: string): Promise<MutualFund[]> {
  const { data, error } = await supabase
    .from('mutual_funds')
    .select('*')
    .eq('category', category)
    .order('cagr3Y', { ascending: false });

  return data || [];
}

export async function getMutualFundsByAMC(amc: string): Promise<MutualFund[]> {
  const { data, error } = await supabase
    .from('mutual_funds')
    .select('*')
    .eq('amc', amc)
    .order('cagr3Y', { ascending: false });

  return data || [];
}

export async function searchMutualFunds(query: string): Promise<MutualFund[]> {
  const { data, error } = await supabase
    .from('mutual_funds')
    .select('*')
    .ilike('schemeName', `%${query}%`)
    .limit(20);

  return data || [];
}

export async function getMFNavHistory(
  schemeCode: number,
  days: number = 365
): Promise<{ date: string; nav: number }[]> {
  const { data, error } = await supabase
    .from('mf_nav_history')
    .select('date, nav')
    .eq('scheme_code', schemeCode)
    .order('date', { ascending: false })
    .limit(days);

  return data?.reverse() || [];
}

// ═══════════════════════════════════════════════════════════════════════════
// AGGREGATIONS & VIEWS
// ═══════════════════════════════════════════════════════════════════════════

export async function getSectorSummary() {
  const { data, error } = await supabase
    .from('v_sector_summary')
    .select('*');

  return data || [];
}

export async function getMFCategorySummary() {
  const { data, error } = await supabase
    .from('v_mf_category_summary')
    .select('*');

  return data || [];
}

// ═══════════════════════════════════════════════════════════════════════════
// DERIVED CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

export function calculateReturns(ohlcv: StockOHLCV[]) {
  if (ohlcv.length < 2) return null;

  const latest = ohlcv[ohlcv.length - 1].close;
  const getReturn = (daysAgo: number) => {
    if (ohlcv.length <= daysAgo) return null;
    const past = ohlcv[ohlcv.length - 1 - daysAgo]?.close;
    return past ? ((latest - past) / past) * 100 : null;
  };

  return {
    return1D: getReturn(1),
    return1W: getReturn(5),
    return1M: getReturn(22),
    return3M: getReturn(66),
    return6M: getReturn(132),
    return1Y: getReturn(252),
  };
}

export function calculateVolatility(ohlcv: StockOHLCV[], period: number = 20) {
  if (ohlcv.length < period + 1) return null;

  const returns = [];
  for (let i = 1; i < ohlcv.length; i++) {
    returns.push((ohlcv[i].close - ohlcv[i - 1].close) / ohlcv[i - 1].close);
  }

  const recentReturns = returns.slice(-period);
  const mean = recentReturns.reduce((a, b) => a + b, 0) / period;
  const variance = recentReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / period;
  
  return Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized
}

export function calculate52WeekPosition(info: StockInfo) {
  const { current_price, fifty_two_week_high, fifty_two_week_low } = info;
  const range = fifty_two_week_high - fifty_two_week_low;
  return range > 0 ? ((current_price - fifty_two_week_low) / range) * 100 : 50;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ALL
// ═══════════════════════════════════════════════════════════════════════════

export default {
  // Stocks
  getStockInfo,
  getAllStocks,
  getStocksBySector,
  searchStocks,
  
  // OHLCV
  getStockOHLCV,
  getIndexOHLCV,
  getLatestPrice,
  
  // Financials
  getStockFinancials,
  
  // Mutual Funds
  getAllMutualFunds,
  getMutualFundsByCategory,
  getMutualFundsByAMC,
  searchMutualFunds,
  getMFNavHistory,
  
  // Aggregations
  getSectorSummary,
  getMFCategorySummary,
  
  // Calculations
  calculateReturns,
  calculateVolatility,
  calculate52WeekPosition,
};
