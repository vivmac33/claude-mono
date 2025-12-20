// ═══════════════════════════════════════════════════════════════════════════
// SUPABASE CLIENT
// ═══════════════════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jkhycmjgfftsicilbyvb.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6pxl1ayFoRp3V6ETO7nvsA_MXtzI4ea';

export const supabase = createClient(supabaseUrl, supabaseKey);

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface StockInfo {
  symbol: string;
  company_name: string;
  sector: string;
  industry: string;
  current_price: number;
  previous_close: number;
  market_cap: number;
  enterprise_value: number;
  trailing_pe: number;
  forward_pe: number;
  price_to_book: number;
  price_to_sales: number;
  peg_ratio: number;
  enterprise_to_ebitda: number;
  dividend_rate: number;
  dividend_yield: number;
  payout_ratio: number;
  trailing_eps: number;
  forward_eps: number;
  book_value: number;
  profit_margin: number;
  operating_margin: number;
  gross_margin: number;
  ebitda_margin: number;
  return_on_equity: number;
  return_on_assets: number;
  debt_to_equity: number;
  current_ratio: number;
  quick_ratio: number;
  revenue_growth: number;
  earnings_growth: number;
  beta: number;
  fifty_two_week_high: number;
  fifty_two_week_low: number;
  fifty_day_average: number;
  two_hundred_day_average: number;
  avg_volume: number;
  total_revenue: number;
  total_cash: number;
  total_debt: number;
  free_cash_flow: number;
  operating_cash_flow: number;
  ebitda: number;
  gross_profit: number;
  net_income: number;
}

export interface StockOHLCV {
  date: string;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MutualFund {
  schemeCode: number;
  schemeName: string;
  category: string;
  amc: string;
  nav: number;
  return1Y: number;
  return3Y: number;
  cagr3Y: number;
  cagr5Y: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  riskRating: string;
}

export interface StockFinancials {
  symbol: string;
  income_statement: any[];
  balance_sheet: any[];
  cash_flow: any[];
}

export default supabase;
