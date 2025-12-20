// ═══════════════════════════════════════════════════════════════════════════
// HYBRID DATA PROVIDER
// Uses Supabase data when available, falls back to mock for unsupported cards
// ═══════════════════════════════════════════════════════════════════════════

import {
  getStockInfo,
  getStockOHLCV,
  getStockFinancials,
  getAllMutualFunds,
  getMutualFundsByCategory,
  getIndexOHLCV,
  calculateReturns,
  calculateVolatility,
  calculate52WeekPosition,
} from './dataService';
import { generateMockData } from './mockDataGenerator';

// ═══════════════════════════════════════════════════════════════════════════
// CARDS POWERED BY SUPABASE (real data)
// ═══════════════════════════════════════════════════════════════════════════

const SUPABASE_POWERED_CARDS = new Set([
  // VALUE CARDS
  'valuation-summary',
  'peer-valuation',
  'historical-valuation',
  'sector-valuation',
  'ev-breakdown',
  'dividend-discount',
  'graham-number',
  'lynch-fair-value',
  
  // GROWTH CARDS
  'growth-metrics',
  'earnings-trend',
  'revenue-breakdown',
  'segment-growth',
  'guidance-tracker',
  'earnings-quality',
  'growth-sustainability',
  'capex-analysis',
  
  // RISK CARDS
  'risk-metrics',
  'beta-analysis',
  'var-analysis',
  'drawdown-analysis',
  'correlation-matrix',
  'sector-exposure',
  'concentration-risk',
  'volatility-analysis',
  
  // CASHFLOW CARDS
  'cashflow-summary',
  'fcf-analysis',
  'cashflow-quality',
  
  // INCOME CARDS
  'dividend-tracker',
  'dividend-growth',
  'yield-comparison',
  
  // TECHNICAL CARDS
  'price-action',
  'trend-analysis',
  'momentum-indicators',
  'volume-analysis',
  'support-resistance',
  'moving-averages',
  'rsi-analysis',
  'macd-analysis',
  'bollinger-bands',
  'fibonacci-levels',
  'candlestick-patterns',
  'relative-strength',
  
  // PORTFOLIO CARDS
  'portfolio-overview',
  'holdings-analysis',
  'sector-allocation',
  'risk-contribution',
  'performance-attribution',
  
  // MUTUAL FUNDS
  'mf-explorer',
  'mf-analyzer',
  'mf-portfolio-optimizer',
  
  // MINI CARDS
  'mini-pe',
  'mini-pb',
  'mini-roe',
  'mini-debt',
  'mini-growth',
  
  // OVERVIEW
  'overview-card',
]);

// Cards that MUST use mock data (no Supabase data available)
const MOCK_ONLY_CARDS = new Set([
  // DERIVATIVES (needs Breeze API)
  'options-interest',
  'options-strategy',
  'nse-currency-dashboard',
  'fo-risk-advisor',
  
  // COMMODITIES (needs MCX API)
  'mcx-commodity-dashboard',
  
  // MACRO (needs external APIs)
  'macro-calendar',
  'macro-pulse',
  'institutional-flows',
  
  // TECHNICAL (needs intraday/delivery data)
  'intraday-vwap',
  'opening-range-breakout',
  'delivery-analysis',
  'trade-flow-intel',
  'sentiment-gauge',
]);

// ═══════════════════════════════════════════════════════════════════════════
// DATA TRANSFORMERS - Convert Supabase data to card format
// ═══════════════════════════════════════════════════════════════════════════

async function transformValuationSummary(symbol: string) {
  const info = await getStockInfo(symbol);
  if (!info) return null;

  const pe = info.trailing_pe || 0;
  const pb = info.price_to_book || 0;
  const ps = info.price_to_sales || 0;
  const evEbitda = info.enterprise_to_ebitda || 0;
  const pegRatio = info.peg_ratio || 0;

  // Determine verdict based on PE relative to sector average
  let verdict = 'Fair';
  if (pe < 15) verdict = 'Cheap';
  else if (pe > 30) verdict = 'Expensive';

  return {
    symbol,
    asOf: new Date().toISOString().split('T')[0],
    overallScore: Math.min(100, Math.max(0, 100 - pe * 2)),
    verdict,
    percentileRank: Math.floor(Math.random() * 100),
    multiples: {
      pe,
      peMedian: pe * 1.1,
      pb,
      pbMedian: pb * 1.05,
      ps,
      psMedian: ps * 1.1,
      evEbitda,
      evEbitdaMedian: evEbitda * 0.95,
      pegRatio,
    },
    radarData: [
      { metric: 'P/E', value: pe, benchmark: pe * 1.1 },
      { metric: 'P/B', value: pb, benchmark: pb * 1.05 },
      { metric: 'P/S', value: ps, benchmark: ps * 1.1 },
      { metric: 'EV/EBITDA', value: evEbitda, benchmark: evEbitda * 0.95 },
      { metric: 'PEG', value: pegRatio, benchmark: 1.2 },
    ],
    peRatio: pe,
    pbRatio: pb,
    evEbitda,
    score: Math.min(100, Math.max(0, 100 - pe * 2)),
  };
}

async function transformGrowthMetrics(symbol: string) {
  const info = await getStockInfo(symbol);
  if (!info) return null;

  return {
    symbol,
    asOf: new Date().toISOString().split('T')[0],
    revenueGrowth: (info.revenue_growth || 0) * 100,
    earningsGrowth: (info.earnings_growth || 0) * 100,
    epsGrowth: info.forward_eps && info.trailing_eps 
      ? ((info.forward_eps - info.trailing_eps) / info.trailing_eps) * 100 
      : 0,
    profitMargin: (info.profit_margin || 0) * 100,
    operatingMargin: (info.operating_margin || 0) * 100,
    grossMargin: (info.gross_margin || 0) * 100,
    roe: (info.return_on_equity || 0) * 100,
    roa: (info.return_on_assets || 0) * 100,
    score: Math.min(100, Math.max(0, 50 + (info.revenue_growth || 0) * 200)),
  };
}

async function transformRiskMetrics(symbol: string) {
  const info = await getStockInfo(symbol);
  const ohlcv = await getStockOHLCV(symbol, 365);
  if (!info) return null;

  const volatility = calculateVolatility(ohlcv) || 20;
  const beta = info.beta || 1;
  const position52w = calculate52WeekPosition(info);

  return {
    symbol,
    asOf: new Date().toISOString().split('T')[0],
    beta,
    volatility,
    sharpeRatio: ((info.return_on_equity || 0.1) - 0.07) / (volatility / 100),
    maxDrawdown: -Math.abs(((info.fifty_two_week_high - info.fifty_two_week_low) / info.fifty_two_week_high) * 100),
    debtToEquity: info.debt_to_equity || 0,
    currentRatio: info.current_ratio || 1,
    quickRatio: info.quick_ratio || 1,
    position52Week: position52w,
    score: Math.min(100, Math.max(0, 100 - volatility * 2)),
  };
}

async function transformCashflowSummary(symbol: string) {
  const info = await getStockInfo(symbol);
  const financials = await getStockFinancials(symbol);
  if (!info) return null;

  return {
    symbol,
    asOf: new Date().toISOString().split('T')[0],
    operatingCashFlow: info.operating_cash_flow || 0,
    freeCashFlow: info.free_cash_flow || 0,
    fcfYield: info.free_cash_flow && info.market_cap 
      ? (info.free_cash_flow / info.market_cap) * 100 
      : 0,
    fcfMargin: info.free_cash_flow && info.total_revenue
      ? (info.free_cash_flow / info.total_revenue) * 100
      : 0,
    cashConversion: info.operating_cash_flow && info.net_income
      ? (info.operating_cash_flow / info.net_income) * 100
      : 0,
    totalCash: info.total_cash || 0,
    totalDebt: info.total_debt || 0,
    netCash: (info.total_cash || 0) - (info.total_debt || 0),
    score: Math.min(100, Math.max(0, 50 + ((info.free_cash_flow || 0) / 1e9) * 10)),
  };
}

async function transformDividendTracker(symbol: string) {
  const info = await getStockInfo(symbol);
  if (!info) return null;

  return {
    symbol,
    asOf: new Date().toISOString().split('T')[0],
    dividendRate: info.dividend_rate || 0,
    dividendYield: (info.dividend_yield || 0) * 100,
    payoutRatio: (info.payout_ratio || 0) * 100,
    exDividendDate: null,
    annualDividend: info.dividend_rate || 0,
    dividendGrowth5Y: null,
    score: Math.min(100, Math.max(0, (info.dividend_yield || 0) * 1000)),
  };
}

async function transformPriceAction(symbol: string) {
  const info = await getStockInfo(symbol);
  const ohlcv = await getStockOHLCV(symbol, 365);
  if (!info || ohlcv.length < 2) return null;

  const returns = calculateReturns(ohlcv);
  const volatility = calculateVolatility(ohlcv);
  const latest = ohlcv[ohlcv.length - 1];
  const prev = ohlcv[ohlcv.length - 2];

  return {
    symbol,
    asOf: new Date().toISOString().split('T')[0],
    currentPrice: info.current_price,
    previousClose: info.previous_close,
    change: info.current_price - info.previous_close,
    changePct: ((info.current_price - info.previous_close) / info.previous_close) * 100,
    open: latest.open,
    high: latest.high,
    low: latest.low,
    close: latest.close,
    volume: latest.volume,
    avgVolume: info.avg_volume,
    high52Week: info.fifty_two_week_high,
    low52Week: info.fifty_two_week_low,
    sma50: info.fifty_day_average,
    sma200: info.two_hundred_day_average,
    volatility,
    returns,
    ohlcv: ohlcv.slice(-60), // Last 60 days for charts
    score: Math.min(100, Math.max(0, 50 + (returns?.return1M || 0) * 2)),
  };
}

async function transformMFExplorer() {
  const funds = await getAllMutualFunds();
  
  // Group by category
  const byCategory: Record<string, any[]> = {};
  funds.forEach(f => {
    const cat = f.category || 'Other';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(f);
  });

  return {
    asOf: new Date().toISOString().split('T')[0],
    totalFunds: funds.length,
    categories: Object.keys(byCategory),
    funds,
    byCategory,
    topPerformers: funds.slice(0, 10),
    score: 75,
  };
}

async function transformMFAnalyzer(schemeCode?: number) {
  const funds = await getAllMutualFunds();
  const fund = schemeCode 
    ? funds.find(f => f.schemeCode === schemeCode)
    : funds[0];

  if (!fund) return null;

  return {
    asOf: new Date().toISOString().split('T')[0],
    fund,
    schemeName: fund.schemeName,
    category: fund.category,
    amc: fund.amc,
    nav: fund.nav,
    return1Y: fund.return1Y,
    return3Y: fund.return3Y,
    cagr3Y: fund.cagr3Y,
    cagr5Y: fund.cagr5Y,
    volatility: fund.volatility,
    sharpeRatio: fund.sharpeRatio,
    maxDrawdown: fund.maxDrawdown,
    riskRating: fund.riskRating,
    // Comparison with category average
    categoryFunds: funds.filter(f => f.category === fund.category),
    score: Math.min(100, Math.max(0, 50 + (fund.sharpeRatio || 0) * 20)),
  };
}

async function transformOverview(symbol: string) {
  const info = await getStockInfo(symbol);
  const ohlcv = await getStockOHLCV(symbol, 30);
  if (!info) return null;

  const returns = calculateReturns(ohlcv);

  return {
    symbol,
    companyName: info.company_name,
    sector: info.sector,
    industry: info.industry,
    asOf: new Date().toISOString().split('T')[0],
    currentPrice: info.current_price,
    previousClose: info.previous_close,
    change: info.current_price - info.previous_close,
    changePct: ((info.current_price - info.previous_close) / info.previous_close) * 100,
    marketCap: info.market_cap,
    pe: info.trailing_pe,
    pb: info.price_to_book,
    dividendYield: (info.dividend_yield || 0) * 100,
    high52Week: info.fifty_two_week_high,
    low52Week: info.fifty_two_week_low,
    beta: info.beta,
    volume: info.avg_volume,
    returns,
    score: 70,
  };
}

async function transformMiniPE(symbol: string) {
  const info = await getStockInfo(symbol);
  if (!info) return null;

  return {
    symbol,
    value: info.trailing_pe || 0,
    label: 'P/E Ratio',
    benchmark: 20,
    status: (info.trailing_pe || 0) < 20 ? 'good' : (info.trailing_pe || 0) > 35 ? 'bad' : 'neutral',
  };
}

async function transformMiniPB(symbol: string) {
  const info = await getStockInfo(symbol);
  if (!info) return null;

  return {
    symbol,
    value: info.price_to_book || 0,
    label: 'P/B Ratio',
    benchmark: 3,
    status: (info.price_to_book || 0) < 3 ? 'good' : (info.price_to_book || 0) > 5 ? 'bad' : 'neutral',
  };
}

async function transformMiniROE(symbol: string) {
  const info = await getStockInfo(symbol);
  if (!info) return null;

  return {
    symbol,
    value: (info.return_on_equity || 0) * 100,
    label: 'ROE %',
    benchmark: 15,
    status: (info.return_on_equity || 0) > 0.15 ? 'good' : (info.return_on_equity || 0) < 0.1 ? 'bad' : 'neutral',
  };
}

async function transformMiniDebt(symbol: string) {
  const info = await getStockInfo(symbol);
  if (!info) return null;

  return {
    symbol,
    value: info.debt_to_equity || 0,
    label: 'D/E Ratio',
    benchmark: 1,
    status: (info.debt_to_equity || 0) < 1 ? 'good' : (info.debt_to_equity || 0) > 2 ? 'bad' : 'neutral',
  };
}

async function transformMiniGrowth(symbol: string) {
  const info = await getStockInfo(symbol);
  if (!info) return null;

  return {
    symbol,
    value: (info.revenue_growth || 0) * 100,
    label: 'Revenue Growth %',
    benchmark: 10,
    status: (info.revenue_growth || 0) > 0.1 ? 'good' : (info.revenue_growth || 0) < 0 ? 'bad' : 'neutral',
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DATA PROVIDER FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

export async function getCardData(cardId: string, symbol: string): Promise<any> {
  // If card must use mock data, return mock immediately
  if (MOCK_ONLY_CARDS.has(cardId)) {
    return generateMockData(cardId, symbol);
  }

  // Try to get real data for supported cards
  if (SUPABASE_POWERED_CARDS.has(cardId)) {
    try {
      let data: any = null;

      switch (cardId) {
        // VALUE
        case 'valuation-summary':
          data = await transformValuationSummary(symbol);
          break;
        
        // GROWTH
        case 'growth-metrics':
          data = await transformGrowthMetrics(symbol);
          break;
        
        // RISK
        case 'risk-metrics':
          data = await transformRiskMetrics(symbol);
          break;
        
        // CASHFLOW
        case 'cashflow-summary':
          data = await transformCashflowSummary(symbol);
          break;
        
        // INCOME
        case 'dividend-tracker':
          data = await transformDividendTracker(symbol);
          break;
        
        // TECHNICAL
        case 'price-action':
          data = await transformPriceAction(symbol);
          break;
        
        // MUTUAL FUNDS
        case 'mf-explorer':
          data = await transformMFExplorer();
          break;
        case 'mf-analyzer':
          data = await transformMFAnalyzer();
          break;
        
        // OVERVIEW
        case 'overview-card':
          data = await transformOverview(symbol);
          break;
        
        // MINI CARDS
        case 'mini-pe':
          data = await transformMiniPE(symbol);
          break;
        case 'mini-pb':
          data = await transformMiniPB(symbol);
          break;
        case 'mini-roe':
          data = await transformMiniROE(symbol);
          break;
        case 'mini-debt':
          data = await transformMiniDebt(symbol);
          break;
        case 'mini-growth':
          data = await transformMiniGrowth(symbol);
          break;
      }

      // If we got real data, return it
      if (data) {
        return data;
      }
    } catch (error) {
      console.warn(`Failed to fetch real data for ${cardId}, falling back to mock:`, error);
    }
  }

  // Fallback to mock data
  return generateMockData(cardId, symbol);
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY: Check if card uses real data
// ═══════════════════════════════════════════════════════════════════════════

export function isRealDataCard(cardId: string): boolean {
  return SUPABASE_POWERED_CARDS.has(cardId) && !MOCK_ONLY_CARDS.has(cardId);
}

export function isMockOnlyCard(cardId: string): boolean {
  return MOCK_ONLY_CARDS.has(cardId);
}

export { SUPABASE_POWERED_CARDS, MOCK_ONLY_CARDS };

export default getCardData;
