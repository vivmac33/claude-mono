// ═══════════════════════════════════════════════════════════════════════════
// INDICATOR COMBO PRESETS
// 25 curated combinations for different trading styles
// ═══════════════════════════════════════════════════════════════════════════

export type ComboCategory = 'trend' | 'reversion' | 'breakout' | 'volume' | 'advanced';

export interface IndicatorDef {
  id: string;
  name: string;
  shortName: string;
  type: 'ma' | 'momentum' | 'volatility' | 'volume' | 'trend' | 'support';
  color: string;
  params: Record<string, number>;
  description: string;
}

export interface IndicatorCombo {
  id: string;
  name: string;
  category: ComboCategory;
  description: string;
  indicators: IndicatorDef[];
  signalLogic: string;
  bestFor: string;
  timeframe: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// ═══════════════════════════════════════════════════════════════════════════
// INDICATOR DEFINITIONS (Reusable across combos)
// ═══════════════════════════════════════════════════════════════════════════

const INDICATOR_LIBRARY: Record<string, IndicatorDef> = {
  // Moving Averages
  ema20: { id: 'ema20', name: 'EMA 20', shortName: 'EMA20', type: 'ma', color: '#3b82f6', params: { period: 20 }, description: 'Short-term trend' },
  ema50: { id: 'ema50', name: 'EMA 50', shortName: 'EMA50', type: 'ma', color: '#f59e0b', params: { period: 50 }, description: 'Medium-term trend' },
  ema200: { id: 'ema200', name: 'EMA 200', shortName: 'EMA200', type: 'ma', color: '#10b981', params: { period: 200 }, description: 'Long-term trend' },
  sma50: { id: 'sma50', name: 'SMA 50', shortName: 'SMA50', type: 'ma', color: '#f59e0b', params: { period: 50 }, description: 'Medium-term trend (simple)' },
  sma200: { id: 'sma200', name: 'SMA 200', shortName: 'SMA200', type: 'ma', color: '#10b981', params: { period: 200 }, description: 'Long-term trend (simple)' },
  hullma: { id: 'hullma', name: 'Hull MA', shortName: 'HMA', type: 'ma', color: '#8b5cf6', params: { period: 20 }, description: 'Low-lag moving average' },
  
  // Momentum
  macd: { id: 'macd', name: 'MACD', shortName: 'MACD', type: 'momentum', color: '#3b82f6', params: { fast: 12, slow: 26, signal: 9 }, description: 'Trend momentum' },
  rsi: { id: 'rsi', name: 'RSI', shortName: 'RSI', type: 'momentum', color: '#8b5cf6', params: { period: 14 }, description: 'Overbought/oversold' },
  stochastic: { id: 'stochastic', name: 'Stochastic', shortName: 'STOCH', type: 'momentum', color: '#ec4899', params: { k: 14, d: 3, smooth: 3 }, description: 'Momentum oscillator' },
  cci: { id: 'cci', name: 'CCI', shortName: 'CCI', type: 'momentum', color: '#14b8a6', params: { period: 20 }, description: 'Cycle identification' },
  roc: { id: 'roc', name: 'Rate of Change', shortName: 'ROC', type: 'momentum', color: '#f97316', params: { period: 12 }, description: 'Price velocity' },
  williamsR: { id: 'williamsR', name: 'Williams %R', shortName: '%R', type: 'momentum', color: '#6366f1', params: { period: 14 }, description: 'Overbought/oversold' },
  ultimateOsc: { id: 'ultimateOsc', name: 'Ultimate Oscillator', shortName: 'UO', type: 'momentum', color: '#84cc16', params: { period1: 7, period2: 14, period3: 28 }, description: 'Multi-timeframe momentum' },
  trix: { id: 'trix', name: 'TRIX', shortName: 'TRIX', type: 'momentum', color: '#06b6d4', params: { period: 15 }, description: 'Triple-smoothed momentum' },
  
  // Volatility
  bb: { id: 'bb', name: 'Bollinger Bands', shortName: 'BB', type: 'volatility', color: '#8b5cf6', params: { period: 20, stdDev: 2 }, description: 'Volatility bands' },
  keltner: { id: 'keltner', name: 'Keltner Channels', shortName: 'KC', type: 'volatility', color: '#f59e0b', params: { period: 20, atrMult: 2 }, description: 'ATR-based channels' },
  atr: { id: 'atr', name: 'ATR', shortName: 'ATR', type: 'volatility', color: '#ef4444', params: { period: 14 }, description: 'True range volatility' },
  donchian: { id: 'donchian', name: 'Donchian Channels', shortName: 'DC', type: 'volatility', color: '#22c55e', params: { period: 20 }, description: 'Breakout channels' },
  squeeze: { id: 'squeeze', name: 'Squeeze Momentum', shortName: 'SQZ', type: 'volatility', color: '#f43f5e', params: { bbPeriod: 20, kcPeriod: 20 }, description: 'Volatility squeeze' },
  
  // Trend
  adx: { id: 'adx', name: 'ADX', shortName: 'ADX', type: 'trend', color: '#a855f7', params: { period: 14 }, description: 'Trend strength' },
  supertrend: { id: 'supertrend', name: 'Supertrend', shortName: 'ST', type: 'trend', color: '#22c55e', params: { period: 10, multiplier: 3 }, description: 'Trend following' },
  psar: { id: 'psar', name: 'Parabolic SAR', shortName: 'PSAR', type: 'trend', color: '#f59e0b', params: { step: 0.02, max: 0.2 }, description: 'Trailing stops' },
  aroon: { id: 'aroon', name: 'Aroon', shortName: 'AROON', type: 'trend', color: '#06b6d4', params: { period: 25 }, description: 'Trend timing' },
  ichimoku: { id: 'ichimoku', name: 'Ichimoku Cloud', shortName: 'ICHI', type: 'trend', color: '#10b981', params: { tenkan: 9, kijun: 26, senkou: 52 }, description: 'Complete system' },
  
  // Volume
  obv: { id: 'obv', name: 'OBV', shortName: 'OBV', type: 'volume', color: '#3b82f6', params: {}, description: 'Cumulative volume' },
  vwap: { id: 'vwap', name: 'VWAP', shortName: 'VWAP', type: 'volume', color: '#f59e0b', params: {}, description: 'Volume-weighted price' },
  cmf: { id: 'cmf', name: 'Chaikin Money Flow', shortName: 'CMF', type: 'volume', color: '#10b981', params: { period: 20 }, description: 'Accumulation/distribution' },
  mfi: { id: 'mfi', name: 'Money Flow Index', shortName: 'MFI', type: 'volume', color: '#8b5cf6', params: { period: 14 }, description: 'Volume-weighted RSI' },
  forceIndex: { id: 'forceIndex', name: 'Force Index', shortName: 'FI', type: 'volume', color: '#ec4899', params: { period: 13 }, description: 'Price-volume strength' },
  volumeSpike: { id: 'volumeSpike', name: 'Volume Spike', shortName: 'VOL', type: 'volume', color: '#6366f1', params: { threshold: 2 }, description: 'Above-average volume' },
  
  // Support/Resistance
  pivots: { id: 'pivots', name: 'Pivot Points', shortName: 'PP', type: 'support', color: '#94a3b8', params: {}, description: 'Support/resistance levels' },
};

// Helper to get indicator by id
export const getIndicator = (id: string): IndicatorDef | undefined => INDICATOR_LIBRARY[id];

// ═══════════════════════════════════════════════════════════════════════════
// COMBO DEFINITIONS - 25 Strategies
// ═══════════════════════════════════════════════════════════════════════════

export const INDICATOR_COMBOS: IndicatorCombo[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // TREND-FOLLOWING (1-5)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'classic-trend',
    name: 'Classic Trend Follower',
    category: 'trend',
    description: 'EMA stack with MACD confirmation - the bread and butter of trend trading',
    indicators: [
      INDICATOR_LIBRARY.ema20,
      INDICATOR_LIBRARY.ema50,
      INDICATOR_LIBRARY.ema200,
      INDICATOR_LIBRARY.macd,
    ],
    signalLogic: 'Price above EMA stack (20>50>200) → MACD bullish cross → Long entry',
    bestFor: 'Swing and position trading in trending markets',
    timeframe: '4H, Daily',
    difficulty: 'beginner',
  },
  {
    id: 'golden-cross',
    name: 'Golden Cross Confirmation',
    category: 'trend',
    description: 'Classic SMA crossover with RSI and volume confirmation',
    indicators: [
      INDICATOR_LIBRARY.sma50,
      INDICATOR_LIBRARY.sma200,
      INDICATOR_LIBRARY.rsi,
      INDICATOR_LIBRARY.volumeSpike,
    ],
    signalLogic: '50 SMA crosses above 200 → RSI >50 → Volume >1.5x average',
    bestFor: 'Long-term position entries',
    timeframe: 'Daily, Weekly',
    difficulty: 'beginner',
  },
  {
    id: 'supertrend-atr',
    name: 'Supertrend + ATR Stops',
    category: 'trend',
    description: 'Dynamic trend following with ATR-based risk management',
    indicators: [
      INDICATOR_LIBRARY.supertrend,
      INDICATOR_LIBRARY.atr,
      INDICATOR_LIBRARY.adx,
    ],
    signalLogic: 'Supertrend flips bullish → ADX >25 → Use ATR for trailing stops',
    bestFor: 'Trend following with dynamic stop-loss',
    timeframe: '1H, 4H',
    difficulty: 'intermediate',
  },
  {
    id: 'hull-ma-trend',
    name: 'Hull MA Low-Lag Trend',
    category: 'trend',
    description: 'Faster trend detection using Hull Moving Average',
    indicators: [
      INDICATOR_LIBRARY.hullma,
      INDICATOR_LIBRARY.macd,
      INDICATOR_LIBRARY.volumeSpike,
    ],
    signalLogic: 'Price above Hull MA → MACD cross confirms → Volume spike validates',
    bestFor: 'Faster trend entries than traditional MAs',
    timeframe: '15m, 1H, 4H',
    difficulty: 'intermediate',
  },
  {
    id: 'multi-ma-ribbon',
    name: 'Multi-MA Ribbon Trend',
    category: 'trend',
    description: 'Visual trend strength using multiple EMAs',
    indicators: [
      INDICATOR_LIBRARY.ema20,
      INDICATOR_LIBRARY.ema50,
      INDICATOR_LIBRARY.adx,
      INDICATOR_LIBRARY.volumeSpike,
    ],
    signalLogic: 'MA ribbon expands → ADX >25 → Volume confirmation = Strong trend',
    bestFor: 'Visual trend strength identification',
    timeframe: '4H, Daily',
    difficulty: 'beginner',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MEAN REVERSION (6-8)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'rsi-divergence',
    name: 'RSI Divergence Pro',
    category: 'reversion',
    description: 'Catch reversals using RSI and MACD divergence',
    indicators: [
      INDICATOR_LIBRARY.rsi,
      INDICATOR_LIBRARY.macd,
      INDICATOR_LIBRARY.bb,
    ],
    signalLogic: 'Bullish divergence on RSI/MACD → Price at lower BB → Reversal candle',
    bestFor: 'Swing reversals in ranging markets',
    timeframe: '4H, Daily',
    difficulty: 'intermediate',
  },
  {
    id: 'stoch-pullback',
    name: 'Stochastic Overbought Pullback',
    category: 'reversion',
    description: 'Mean reversion using Stochastic extremes',
    indicators: [
      INDICATOR_LIBRARY.stochastic,
      INDICATOR_LIBRARY.ema20,
      INDICATOR_LIBRARY.bb,
    ],
    signalLogic: 'Stochastic <20 → Price touches lower BB → Bounce above EMA 20',
    bestFor: 'Short-term mean reversion trades',
    timeframe: '15m, 1H',
    difficulty: 'beginner',
  },
  {
    id: 'cci-reversion',
    name: 'CCI Mean Reversion',
    category: 'reversion',
    description: 'Cycle-based trading using CCI extremes',
    indicators: [
      INDICATOR_LIBRARY.cci,
      INDICATOR_LIBRARY.bb,
      INDICATOR_LIBRARY.volumeSpike,
    ],
    signalLogic: 'CCI <-100 → Price at lower BB → Volume confirms reversal',
    bestFor: 'Cycle-based swing trading',
    timeframe: '1H, 4H',
    difficulty: 'intermediate',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // BREAKOUT & VOLATILITY (9-11)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'bb-squeeze',
    name: 'Bollinger Squeeze Breakout',
    category: 'breakout',
    description: 'Catch volatility expansion after squeeze',
    indicators: [
      INDICATOR_LIBRARY.bb,
      INDICATOR_LIBRARY.keltner,
      INDICATOR_LIBRARY.volumeSpike,
      INDICATOR_LIBRARY.adx,
    ],
    signalLogic: 'BB inside Keltner (squeeze) → Breakout direction → Volume spike + ADX rising',
    bestFor: 'High-momentum breakout trades',
    timeframe: '1H, 4H',
    difficulty: 'advanced',
  },
  {
    id: 'donchian-breakout',
    name: 'Donchian Breakout',
    category: 'breakout',
    description: 'Classic channel breakout strategy',
    indicators: [
      INDICATOR_LIBRARY.donchian,
      INDICATOR_LIBRARY.volumeSpike,
      INDICATOR_LIBRARY.atr,
    ],
    signalLogic: 'Price breaks 20-period high → Volume >average → ATR expansion confirms',
    bestFor: 'Pure breakout trading',
    timeframe: 'Daily',
    difficulty: 'beginner',
  },
  {
    id: 'squeeze-momentum',
    name: 'Squeeze Momentum Pro',
    category: 'breakout',
    description: 'Volatility contraction to expansion plays',
    indicators: [
      INDICATOR_LIBRARY.squeeze,
      INDICATOR_LIBRARY.bb,
      INDICATOR_LIBRARY.volumeSpike,
    ],
    signalLogic: 'Squeeze releases → Momentum positive → Volume breakout confirmation',
    bestFor: 'Catching explosive moves after consolidation',
    timeframe: '15m, 1H, 4H',
    difficulty: 'intermediate',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // VOLUME-CONFIRMED MOMENTUM (12-15)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'momentum-volume',
    name: 'Momentum Volume Surge',
    category: 'volume',
    description: 'Confirm momentum with smart money (volume)',
    indicators: [
      INDICATOR_LIBRARY.macd,
      INDICATOR_LIBRARY.obv,
      INDICATOR_LIBRARY.volumeSpike,
    ],
    signalLogic: 'MACD bullish cross → OBV rising → Volume >2x average',
    bestFor: 'Momentum with institutional confirmation',
    timeframe: '1H, 4H',
    difficulty: 'intermediate',
  },
  {
    id: 'vwap-intraday',
    name: 'VWAP Intraday Mastery',
    category: 'volume',
    description: 'Professional intraday trading around VWAP',
    indicators: [
      INDICATOR_LIBRARY.vwap,
      INDICATOR_LIBRARY.rsi,
      INDICATOR_LIBRARY.volumeSpike,
    ],
    signalLogic: 'Price above VWAP → RSI >50 → Volume confirms strength',
    bestFor: 'Professional day trading',
    timeframe: '5m, 15m',
    difficulty: 'intermediate',
  },
  {
    id: 'cmf-entry',
    name: 'Chaikin Money Flow Entry',
    category: 'volume',
    description: 'Detect accumulation/distribution',
    indicators: [
      INDICATOR_LIBRARY.cmf,
      INDICATOR_LIBRARY.rsi,
      INDICATOR_LIBRARY.ema20,
    ],
    signalLogic: 'CMF >0 (accumulation) → RSI >50 → Price above EMA 20',
    bestFor: 'Volume-based accumulation detection',
    timeframe: '4H, Daily',
    difficulty: 'intermediate',
  },
  {
    id: 'force-divergence',
    name: 'Force Index Divergence',
    category: 'volume',
    description: 'Volume-strength reversal signals',
    indicators: [
      INDICATOR_LIBRARY.forceIndex,
      INDICATOR_LIBRARY.rsi,
      INDICATOR_LIBRARY.ema20,
    ],
    signalLogic: 'Bullish Force Index divergence → RSI confirmation → Reversal candle',
    bestFor: 'Volume-strength reversals',
    timeframe: '4H, Daily',
    difficulty: 'advanced',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ADVANCED MULTI-PURPOSE (16-25)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ichimoku-complete',
    name: 'Ichimoku Complete System',
    category: 'advanced',
    description: 'All-in-one Japanese trend analysis',
    indicators: [
      INDICATOR_LIBRARY.ichimoku,
      INDICATOR_LIBRARY.volumeSpike,
    ],
    signalLogic: 'Price above cloud → Tenkan > Kijun → Chikou above price → Strong bullish',
    bestFor: 'Comprehensive trend analysis',
    timeframe: '4H, Daily',
    difficulty: 'advanced',
  },
  {
    id: 'adx-rsi-filter',
    name: 'ADX + RSI Filter',
    category: 'advanced',
    description: 'Avoid false signals in ranging markets',
    indicators: [
      INDICATOR_LIBRARY.adx,
      INDICATOR_LIBRARY.rsi,
      INDICATOR_LIBRARY.bb,
    ],
    signalLogic: 'ADX >25 (trending) → RSI 40-60 (not extreme) → Trend continuation',
    bestFor: 'Filtering out choppy markets',
    timeframe: '1H, 4H',
    difficulty: 'intermediate',
  },
  {
    id: 'pivot-intraday',
    name: 'Pivot Point Intraday',
    category: 'advanced',
    description: 'Trade around key daily levels',
    indicators: [
      INDICATOR_LIBRARY.pivots,
      INDICATOR_LIBRARY.vwap,
      INDICATOR_LIBRARY.volumeSpike,
    ],
    signalLogic: 'Price above R1/Pivot → Above VWAP → Volume confirms',
    bestFor: 'Day trading with clear levels',
    timeframe: '5m, 15m',
    difficulty: 'beginner',
  },
  {
    id: 'ultimate-osc',
    name: 'Ultimate Oscillator Multi-TF',
    category: 'advanced',
    description: 'Multi-timeframe momentum alignment',
    indicators: [
      INDICATOR_LIBRARY.ultimateOsc,
      INDICATOR_LIBRARY.ema50,
      INDICATOR_LIBRARY.macd,
    ],
    signalLogic: 'UO >50 → Price above EMA 50 → MACD confirms direction',
    bestFor: 'Higher-timeframe momentum alignment',
    timeframe: 'Daily, Weekly',
    difficulty: 'intermediate',
  },
  {
    id: 'roc-momentum',
    name: 'Rate of Change Momentum',
    category: 'advanced',
    description: 'Speed-based momentum entries',
    indicators: [
      INDICATOR_LIBRARY.roc,
      INDICATOR_LIBRARY.macd,
      INDICATOR_LIBRARY.volumeSpike,
    ],
    signalLogic: 'ROC rising above zero → MACD cross → Volume surge confirms acceleration',
    bestFor: 'Catching momentum acceleration',
    timeframe: '1H, 4H',
    difficulty: 'intermediate',
  },
  {
    id: 'aroon-strength',
    name: 'Aroon Trend Strength',
    category: 'advanced',
    description: 'Early trend detection',
    indicators: [
      INDICATOR_LIBRARY.aroon,
      INDICATOR_LIBRARY.adx,
      INDICATOR_LIBRARY.ema50,
    ],
    signalLogic: 'Aroon Up >70 & Down <30 → ADX >25 → Price above EMA 50',
    bestFor: 'Early trend identification',
    timeframe: '4H, Daily',
    difficulty: 'intermediate',
  },
  {
    id: 'williams-rsi-double',
    name: 'Williams %R + RSI Double',
    category: 'advanced',
    description: 'Double confirmation for extreme oversold',
    indicators: [
      INDICATOR_LIBRARY.williamsR,
      INDICATOR_LIBRARY.rsi,
      INDICATOR_LIBRARY.macd,
    ],
    signalLogic: 'Both %R & RSI <20 → MACD bullish cross → Reversal entry',
    bestFor: 'Extreme oversold bounces',
    timeframe: '1H, 4H',
    difficulty: 'intermediate',
  },
  {
    id: 'mfi-momentum',
    name: 'MFI Volume Momentum',
    category: 'advanced',
    description: 'Volume-weighted momentum with MFI',
    indicators: [
      INDICATOR_LIBRARY.mfi,
      INDICATOR_LIBRARY.rsi,
      INDICATOR_LIBRARY.volumeSpike,
    ],
    signalLogic: 'MFI bullish divergence → RSI confirmation → Volume spike validates',
    bestFor: 'Volume-weighted momentum signals',
    timeframe: '4H, Daily',
    difficulty: 'advanced',
  },
  {
    id: 'trix-zero',
    name: 'TRIX Zero Cross',
    category: 'advanced',
    description: 'Noise-reduced momentum signals',
    indicators: [
      INDICATOR_LIBRARY.trix,
      INDICATOR_LIBRARY.macd,
      INDICATOR_LIBRARY.volumeSpike,
    ],
    signalLogic: 'TRIX crosses zero → MACD confirms → Volume spike for entry',
    bestFor: 'Filtering market noise',
    timeframe: '4H, Daily',
    difficulty: 'advanced',
  },
  {
    id: 'psar-trend-rider',
    name: 'Parabolic SAR Trend Rider',
    category: 'advanced',
    description: 'Ride trends with dynamic trailing stops',
    indicators: [
      INDICATOR_LIBRARY.psar,
      INDICATOR_LIBRARY.adx,
      INDICATOR_LIBRARY.ema50,
    ],
    signalLogic: 'PSAR below price → ADX >25 → Price above EMA 50 → Uptrend confirmed',
    bestFor: 'Trailing stop management',
    timeframe: '1H, 4H, Daily',
    difficulty: 'beginner',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export const getCombosByCategory = (category: ComboCategory): IndicatorCombo[] => {
  return INDICATOR_COMBOS.filter(c => c.category === category);
};

export const getComboById = (id: string): IndicatorCombo | undefined => {
  return INDICATOR_COMBOS.find(c => c.id === id);
};

export const getCombosByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): IndicatorCombo[] => {
  return INDICATOR_COMBOS.filter(c => c.difficulty === difficulty);
};

export const getAllIndicators = (): IndicatorDef[] => {
  return Object.values(INDICATOR_LIBRARY);
};

export const getIndicatorsByType = (type: IndicatorDef['type']): IndicatorDef[] => {
  return Object.values(INDICATOR_LIBRARY).filter(i => i.type === type);
};

// Category metadata
export const CATEGORY_META: Record<ComboCategory, { name: string; icon: string; description: string; color: string }> = {
  trend: { name: 'Trend Following', icon: '📈', description: 'Ride established trends', color: '#10b981' },
  reversion: { name: 'Mean Reversion', icon: '🔄', description: 'Trade bounces from extremes', color: '#8b5cf6' },
  breakout: { name: 'Breakout', icon: '💥', description: 'Catch volatility expansion', color: '#f59e0b' },
  volume: { name: 'Volume Confirmed', icon: '📊', description: 'Smart money confirmation', color: '#3b82f6' },
  advanced: { name: 'Advanced Multi', icon: '🎯', description: 'Complex multi-purpose systems', color: '#ec4899' },
};

export default INDICATOR_COMBOS;
