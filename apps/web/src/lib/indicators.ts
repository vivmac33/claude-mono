// ═══════════════════════════════════════════════════════════════════════════
// INDICATOR CALCULATIONS LIBRARY
// Complete technical analysis indicators - No external dependencies
// ═══════════════════════════════════════════════════════════════════════════

export interface OHLCVData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorResult {
  date: string;
  value: number;
  [key: string]: number | string; // For multi-line indicators
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

function mean(arr: number[]): number {
  return arr.length > 0 ? sum(arr) / arr.length : 0;
}

function stdDev(arr: number[]): number {
  const avg = mean(arr);
  const squareDiffs = arr.map(v => Math.pow(v - avg, 2));
  return Math.sqrt(mean(squareDiffs));
}

function highest(arr: number[]): number {
  return Math.max(...arr);
}

function lowest(arr: number[]): number {
  return Math.min(...arr);
}

function typicalPrice(bar: OHLCVData): number {
  return (bar.high + bar.low + bar.close) / 3;
}

function trueRange(current: OHLCVData, previous: OHLCVData): number {
  return Math.max(
    current.high - current.low,
    Math.abs(current.high - previous.close),
    Math.abs(current.low - previous.close)
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MOVING AVERAGES
// ═══════════════════════════════════════════════════════════════════════════

export function SMA(data: OHLCVData[], period: number, source: 'close' | 'high' | 'low' | 'open' | 'hl2' | 'hlc3' = 'close'): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  
  const getSource = (bar: OHLCVData): number => {
    switch (source) {
      case 'hl2': return (bar.high + bar.low) / 2;
      case 'hlc3': return (bar.high + bar.low + bar.close) / 3;
      default: return bar[source];
    }
  };
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      const slice = data.slice(0, i + 1).map(getSource);
      result.push({ date: data[i].date, value: mean(slice) });
    } else {
      const slice = data.slice(i - period + 1, i + 1).map(getSource);
      result.push({ date: data[i].date, value: mean(slice) });
    }
  }
  
  return result;
}

export function EMA(data: OHLCVData[], period: number, source: 'close' | 'high' | 'low' | 'open' = 'close'): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA is SMA
  const firstSMA = mean(data.slice(0, period).map(d => d[source]));
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      const slice = data.slice(0, i + 1).map(d => d[source]);
      result.push({ date: data[i].date, value: mean(slice) });
    } else if (i === period - 1) {
      result.push({ date: data[i].date, value: firstSMA });
    } else {
      const prevEMA = result[i - 1].value;
      const currentPrice = data[i][source];
      const ema = (currentPrice - prevEMA) * multiplier + prevEMA;
      result.push({ date: data[i].date, value: ema });
    }
  }
  
  return result;
}

export function WMA(data: OHLCVData[], period: number): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  const weightSum = (period * (period + 1)) / 2;
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push({ date: data[i].date, value: data[i].close });
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - period + 1 + j].close * (j + 1);
      }
      result.push({ date: data[i].date, value: sum / weightSum });
    }
  }
  
  return result;
}

export function HullMA(data: OHLCVData[], period: number): IndicatorResult[] {
  // Hull MA = WMA(2*WMA(n/2) − WMA(n)), sqrt(n))
  const halfPeriod = Math.floor(period / 2);
  const sqrtPeriod = Math.floor(Math.sqrt(period));
  
  const wma1 = WMA(data, halfPeriod);
  const wma2 = WMA(data, period);
  
  // Create synthetic data for final WMA
  const diff: OHLCVData[] = data.map((d, i) => ({
    ...d,
    close: 2 * wma1[i].value - wma2[i].value,
  }));
  
  return WMA(diff, sqrtPeriod);
}

export function DEMA(data: OHLCVData[], period: number): IndicatorResult[] {
  // DEMA = 2 * EMA - EMA(EMA)
  const ema1 = EMA(data, period);
  
  const emaData: OHLCVData[] = data.map((d, i) => ({
    ...d,
    close: ema1[i].value,
  }));
  const ema2 = EMA(emaData, period);
  
  return data.map((d, i) => ({
    date: d.date,
    value: 2 * ema1[i].value - ema2[i].value,
  }));
}

export function TEMA(data: OHLCVData[], period: number): IndicatorResult[] {
  // TEMA = 3*EMA - 3*EMA(EMA) + EMA(EMA(EMA))
  const ema1 = EMA(data, period);
  
  const ema1Data: OHLCVData[] = data.map((d, i) => ({ ...d, close: ema1[i].value }));
  const ema2 = EMA(ema1Data, period);
  
  const ema2Data: OHLCVData[] = data.map((d, i) => ({ ...d, close: ema2[i].value }));
  const ema3 = EMA(ema2Data, period);
  
  return data.map((d, i) => ({
    date: d.date,
    value: 3 * ema1[i].value - 3 * ema2[i].value + ema3[i].value,
  }));
}

export function MARibbon(data: OHLCVData[], periods: number[] = [8, 13, 21, 34, 55, 89, 144, 200]): Record<string, IndicatorResult[]> {
  const result: Record<string, IndicatorResult[]> = {};
  periods.forEach(p => {
    result[`ema${p}`] = EMA(data, p);
  });
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOMENTUM INDICATORS
// ═══════════════════════════════════════════════════════════════════════════

export function RSI(data: OHLCVData[], period: number = 14): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      result.push({ date: data[i].date, value: 50 });
      continue;
    }
    
    const change = data[i].close - data[i - 1].close;
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;
    
    gains.push(gain);
    losses.push(loss);
    
    if (i < period) {
      result.push({ date: data[i].date, value: 50 });
    } else if (i === period) {
      const avgGain = mean(gains.slice(-period));
      const avgLoss = mean(losses.slice(-period));
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      result.push({ date: data[i].date, value: 100 - 100 / (1 + rs) });
    } else {
      const prevResult = result[i - 1];
      const prevAvgGain = (prevResult.avgGain as number) || mean(gains.slice(-period - 1, -1));
      const prevAvgLoss = (prevResult.avgLoss as number) || mean(losses.slice(-period - 1, -1));
      
      const avgGain = (prevAvgGain * (period - 1) + gain) / period;
      const avgLoss = (prevAvgLoss * (period - 1) + loss) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      
      result.push({ 
        date: data[i].date, 
        value: 100 - 100 / (1 + rs),
        avgGain,
        avgLoss,
      });
    }
  }
  
  return result;
}

export function MACD(data: OHLCVData[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9): IndicatorResult[] {
  const fastEMA = EMA(data, fastPeriod);
  const slowEMA = EMA(data, slowPeriod);
  
  // MACD Line
  const macdLine = data.map((d, i) => ({
    ...d,
    close: fastEMA[i].value - slowEMA[i].value,
  }));
  
  // Signal Line (EMA of MACD)
  const signalLine = EMA(macdLine, signalPeriod);
  
  return data.map((d, i) => ({
    date: d.date,
    value: macdLine[i].close, // MACD line
    macd: macdLine[i].close,
    signal: signalLine[i].value,
    histogram: macdLine[i].close - signalLine[i].value,
  }));
}

export function Stochastic(data: OHLCVData[], kPeriod: number = 14, dPeriod: number = 3, smoothK: number = 3): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  const rawK: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < kPeriod - 1) {
      result.push({ date: data[i].date, value: 50, k: 50, d: 50 });
      rawK.push(50);
      continue;
    }
    
    const slice = data.slice(i - kPeriod + 1, i + 1);
    const highestHigh = highest(slice.map(d => d.high));
    const lowestLow = lowest(slice.map(d => d.low));
    
    const k = highestHigh === lowestLow ? 50 : 
      ((data[i].close - lowestLow) / (highestHigh - lowestLow)) * 100;
    rawK.push(k);
    
    // Smooth %K
    const smoothedK = i >= kPeriod + smoothK - 2 
      ? mean(rawK.slice(-smoothK)) 
      : k;
    
    // %D is SMA of smoothed %K
    const dValues = result.slice(-dPeriod + 1).map(r => r.k as number);
    dValues.push(smoothedK);
    const d = mean(dValues);
    
    result.push({ date: data[i].date, value: smoothedK, k: smoothedK, d });
  }
  
  return result;
}

export function CCI(data: OHLCVData[], period: number = 20): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  const tps: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    const tp = typicalPrice(data[i]);
    tps.push(tp);
    
    if (i < period - 1) {
      result.push({ date: data[i].date, value: 0 });
      continue;
    }
    
    const slice = tps.slice(-period);
    const sma = mean(slice);
    const meanDev = mean(slice.map(v => Math.abs(v - sma)));
    
    const cci = meanDev === 0 ? 0 : (tp - sma) / (0.015 * meanDev);
    result.push({ date: data[i].date, value: cci });
  }
  
  return result;
}

export function ROC(data: OHLCVData[], period: number = 12): IndicatorResult[] {
  return data.map((d, i) => {
    if (i < period) {
      return { date: d.date, value: 0 };
    }
    const prevClose = data[i - period].close;
    const roc = prevClose === 0 ? 0 : ((d.close - prevClose) / prevClose) * 100;
    return { date: d.date, value: roc };
  });
}

export function WilliamsR(data: OHLCVData[], period: number = 14): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push({ date: data[i].date, value: -50 });
      continue;
    }
    
    const slice = data.slice(i - period + 1, i + 1);
    const highestHigh = highest(slice.map(d => d.high));
    const lowestLow = lowest(slice.map(d => d.low));
    
    const wr = highestHigh === lowestLow ? -50 :
      ((highestHigh - data[i].close) / (highestHigh - lowestLow)) * -100;
    
    result.push({ date: data[i].date, value: wr });
  }
  
  return result;
}

export function UltimateOscillator(data: OHLCVData[], period1: number = 7, period2: number = 14, period3: number = 28): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  const bps: number[] = []; // Buying Pressure
  const trs: number[] = []; // True Range
  
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      result.push({ date: data[i].date, value: 50 });
      bps.push(0);
      trs.push(data[i].high - data[i].low);
      continue;
    }
    
    const bp = data[i].close - Math.min(data[i].low, data[i - 1].close);
    const tr = trueRange(data[i], data[i - 1]);
    bps.push(bp);
    trs.push(tr);
    
    if (i < period3 - 1) {
      result.push({ date: data[i].date, value: 50 });
      continue;
    }
    
    const avg1 = sum(bps.slice(-period1)) / sum(trs.slice(-period1));
    const avg2 = sum(bps.slice(-period2)) / sum(trs.slice(-period2));
    const avg3 = sum(bps.slice(-period3)) / sum(trs.slice(-period3));
    
    const uo = ((avg1 * 4) + (avg2 * 2) + avg3) / 7 * 100;
    result.push({ date: data[i].date, value: uo });
  }
  
  return result;
}

export function TRIX(data: OHLCVData[], period: number = 15): IndicatorResult[] {
  // Triple smoothed EMA
  const ema1 = EMA(data, period);
  const ema1Data: OHLCVData[] = data.map((d, i) => ({ ...d, close: ema1[i].value }));
  
  const ema2 = EMA(ema1Data, period);
  const ema2Data: OHLCVData[] = data.map((d, i) => ({ ...d, close: ema2[i].value }));
  
  const ema3 = EMA(ema2Data, period);
  
  return data.map((d, i) => {
    if (i === 0) return { date: d.date, value: 0 };
    const prev = ema3[i - 1].value;
    const curr = ema3[i].value;
    const trix = prev === 0 ? 0 : ((curr - prev) / prev) * 10000;
    return { date: d.date, value: trix };
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// VOLATILITY INDICATORS
// ═══════════════════════════════════════════════════════════════════════════

export function ATR(data: OHLCVData[], period: number = 14): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  const trs: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      const tr = data[i].high - data[i].low;
      trs.push(tr);
      result.push({ date: data[i].date, value: tr });
      continue;
    }
    
    const tr = trueRange(data[i], data[i - 1]);
    trs.push(tr);
    
    if (i < period) {
      result.push({ date: data[i].date, value: mean(trs) });
    } else {
      // Wilder's smoothing
      const prevATR = result[i - 1].value;
      const atr = (prevATR * (period - 1) + tr) / period;
      result.push({ date: data[i].date, value: atr });
    }
  }
  
  return result;
}

export function BollingerBands(data: OHLCVData[], period: number = 20, stdDevMult: number = 2): IndicatorResult[] {
  const sma = SMA(data, period);
  
  return data.map((d, i) => {
    const slice = data.slice(Math.max(0, i - period + 1), i + 1).map(d => d.close);
    const std = stdDev(slice);
    const middle = sma[i].value;
    
    return {
      date: d.date,
      value: middle,
      upper: middle + stdDevMult * std,
      middle,
      lower: middle - stdDevMult * std,
      bandwidth: std * stdDevMult * 2 / middle * 100,
      percentB: (d.close - (middle - stdDevMult * std)) / (stdDevMult * std * 2),
    };
  });
}

export function KeltnerChannels(data: OHLCVData[], emaPeriod: number = 20, atrPeriod: number = 10, atrMult: number = 2): IndicatorResult[] {
  const ema = EMA(data, emaPeriod);
  const atr = ATR(data, atrPeriod);
  
  return data.map((d, i) => ({
    date: d.date,
    value: ema[i].value,
    upper: ema[i].value + atrMult * atr[i].value,
    middle: ema[i].value,
    lower: ema[i].value - atrMult * atr[i].value,
  }));
}

export function DonchianChannels(data: OHLCVData[], period: number = 20): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  
  for (let i = 0; i < data.length; i++) {
    const slice = data.slice(Math.max(0, i - period + 1), i + 1);
    const upper = highest(slice.map(d => d.high));
    const lower = lowest(slice.map(d => d.low));
    
    result.push({
      date: data[i].date,
      value: (upper + lower) / 2,
      upper,
      middle: (upper + lower) / 2,
      lower,
    });
  }
  
  return result;
}

export function SqueezeMomentum(data: OHLCVData[], bbPeriod: number = 20, bbMult: number = 2, kcPeriod: number = 20, kcMult: number = 1.5): IndicatorResult[] {
  const bb = BollingerBands(data, bbPeriod, bbMult);
  const kc = KeltnerChannels(data, kcPeriod, kcPeriod, kcMult);
  
  // Linear regression for momentum
  const momentum = data.map((d, i) => {
    const slice = data.slice(Math.max(0, i - bbPeriod + 1), i + 1);
    const dc = DonchianChannels(slice, slice.length);
    const lastDC = dc[dc.length - 1];
    const sma = SMA(slice, slice.length);
    const lastSMA = sma[sma.length - 1];
    return d.close - ((lastDC.value + lastSMA.value) / 2);
  });
  
  return data.map((d, i) => {
    const bbUpper = bb[i].upper as number;
    const bbLower = bb[i].lower as number;
    const kcUpper = kc[i].upper as number;
    const kcLower = kc[i].lower as number;
    
    const sqzOn = bbLower > kcLower && bbUpper < kcUpper;
    const sqzOff = bbLower < kcLower && bbUpper > kcUpper;
    
    return {
      date: d.date,
      value: momentum[i],
      momentum: momentum[i],
      squeezeOn: sqzOn ? 1 : 0,
      squeezeOff: sqzOff ? 1 : 0,
    };
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// TREND INDICATORS
// ═══════════════════════════════════════════════════════════════════════════

export function ADX(data: OHLCVData[], period: number = 14): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  const plusDMs: number[] = [];
  const minusDMs: number[] = [];
  const trs: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      result.push({ date: data[i].date, value: 0, plusDI: 0, minusDI: 0, adx: 0 });
      trs.push(data[i].high - data[i].low);
      plusDMs.push(0);
      minusDMs.push(0);
      continue;
    }
    
    const tr = trueRange(data[i], data[i - 1]);
    const upMove = data[i].high - data[i - 1].high;
    const downMove = data[i - 1].low - data[i].low;
    
    const plusDM = upMove > downMove && upMove > 0 ? upMove : 0;
    const minusDM = downMove > upMove && downMove > 0 ? downMove : 0;
    
    trs.push(tr);
    plusDMs.push(plusDM);
    minusDMs.push(minusDM);
    
    if (i < period) {
      result.push({ date: data[i].date, value: 0, plusDI: 0, minusDI: 0, adx: 0 });
      continue;
    }
    
    // Smoothed values (Wilder's smoothing)
    const smoothedTR = i === period 
      ? sum(trs.slice(-period))
      : (result[i - 1] as any).smoothedTR - (result[i - 1] as any).smoothedTR / period + tr;
    
    const smoothedPlusDM = i === period
      ? sum(plusDMs.slice(-period))
      : (result[i - 1] as any).smoothedPlusDM - (result[i - 1] as any).smoothedPlusDM / period + plusDM;
    
    const smoothedMinusDM = i === period
      ? sum(minusDMs.slice(-period))
      : (result[i - 1] as any).smoothedMinusDM - (result[i - 1] as any).smoothedMinusDM / period + minusDM;
    
    const plusDI = smoothedTR === 0 ? 0 : (smoothedPlusDM / smoothedTR) * 100;
    const minusDI = smoothedTR === 0 ? 0 : (smoothedMinusDM / smoothedTR) * 100;
    
    const dx = (plusDI + minusDI) === 0 ? 0 : Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
    
    // ADX is smoothed DX
    const adx = i === period ? dx : ((result[i - 1].adx as number) * (period - 1) + dx) / period;
    
    result.push({
      date: data[i].date,
      value: adx,
      plusDI,
      minusDI,
      adx,
      smoothedTR,
      smoothedPlusDM,
      smoothedMinusDM,
    });
  }
  
  return result;
}

export function Supertrend(data: OHLCVData[], period: number = 10, multiplier: number = 3): IndicatorResult[] {
  const atr = ATR(data, period);
  const result: IndicatorResult[] = [];
  
  for (let i = 0; i < data.length; i++) {
    const hl2 = (data[i].high + data[i].low) / 2;
    const basicUpperBand = hl2 + multiplier * atr[i].value;
    const basicLowerBand = hl2 - multiplier * atr[i].value;
    
    if (i === 0) {
      result.push({
        date: data[i].date,
        value: basicLowerBand,
        upperBand: basicUpperBand,
        lowerBand: basicLowerBand,
        trend: 1, // 1 = up, -1 = down
      });
      continue;
    }
    
    const prev = result[i - 1];
    
    // Final bands
    const finalUpperBand = basicUpperBand < (prev.upperBand as number) || data[i - 1].close > (prev.upperBand as number)
      ? basicUpperBand : (prev.upperBand as number);
    
    const finalLowerBand = basicLowerBand > (prev.lowerBand as number) || data[i - 1].close < (prev.lowerBand as number)
      ? basicLowerBand : (prev.lowerBand as number);
    
    // Trend direction
    let trend = prev.trend as number;
    if (trend === 1 && data[i].close < finalLowerBand) {
      trend = -1;
    } else if (trend === -1 && data[i].close > finalUpperBand) {
      trend = 1;
    }
    
    result.push({
      date: data[i].date,
      value: trend === 1 ? finalLowerBand : finalUpperBand,
      upperBand: finalUpperBand,
      lowerBand: finalLowerBand,
      trend,
    });
  }
  
  return result;
}

export function ParabolicSAR(data: OHLCVData[], step: number = 0.02, max: number = 0.2): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  let af = step;
  let ep = data[0].high;
  let sar = data[0].low;
  let trend = 1; // 1 = up, -1 = down
  
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      result.push({ date: data[i].date, value: sar, trend });
      continue;
    }
    
    // Update SAR
    sar = sar + af * (ep - sar);
    
    // Check for reversal
    if (trend === 1) {
      if (data[i].low < sar) {
        trend = -1;
        sar = ep;
        ep = data[i].low;
        af = step;
      } else {
        if (data[i].high > ep) {
          ep = data[i].high;
          af = Math.min(af + step, max);
        }
        // SAR cannot be above prior two lows
        sar = Math.min(sar, data[i - 1].low, i > 1 ? data[i - 2].low : data[i - 1].low);
      }
    } else {
      if (data[i].high > sar) {
        trend = 1;
        sar = ep;
        ep = data[i].high;
        af = step;
      } else {
        if (data[i].low < ep) {
          ep = data[i].low;
          af = Math.min(af + step, max);
        }
        // SAR cannot be below prior two highs
        sar = Math.max(sar, data[i - 1].high, i > 1 ? data[i - 2].high : data[i - 1].high);
      }
    }
    
    result.push({ date: data[i].date, value: sar, trend });
  }
  
  return result;
}

export function Aroon(data: OHLCVData[], period: number = 25): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      result.push({ date: data[i].date, value: 0, up: 50, down: 50, oscillator: 0 });
      continue;
    }
    
    const slice = data.slice(i - period, i + 1);
    const highs = slice.map(d => d.high);
    const lows = slice.map(d => d.low);
    
    const highestIdx = highs.indexOf(highest(highs));
    const lowestIdx = lows.indexOf(lowest(lows));
    
    const aroonUp = ((period - (period - highestIdx)) / period) * 100;
    const aroonDown = ((period - (period - lowestIdx)) / period) * 100;
    
    result.push({
      date: data[i].date,
      value: aroonUp - aroonDown,
      up: aroonUp,
      down: aroonDown,
      oscillator: aroonUp - aroonDown,
    });
  }
  
  return result;
}

export function Ichimoku(data: OHLCVData[], tenkanPeriod: number = 9, kijunPeriod: number = 26, senkouBPeriod: number = 52): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  
  const donchianMid = (slice: OHLCVData[]): number => {
    const high = highest(slice.map(d => d.high));
    const low = lowest(slice.map(d => d.low));
    return (high + low) / 2;
  };
  
  for (let i = 0; i < data.length; i++) {
    // Tenkan-sen (Conversion Line)
    const tenkanSlice = data.slice(Math.max(0, i - tenkanPeriod + 1), i + 1);
    const tenkan = donchianMid(tenkanSlice);
    
    // Kijun-sen (Base Line)
    const kijunSlice = data.slice(Math.max(0, i - kijunPeriod + 1), i + 1);
    const kijun = donchianMid(kijunSlice);
    
    // Senkou Span A (Leading Span A) - plotted 26 periods ahead
    const senkouA = (tenkan + kijun) / 2;
    
    // Senkou Span B (Leading Span B) - plotted 26 periods ahead
    const senkouBSlice = data.slice(Math.max(0, i - senkouBPeriod + 1), i + 1);
    const senkouB = donchianMid(senkouBSlice);
    
    // Chikou Span (Lagging Span) - current close plotted 26 periods back
    const chikou = data[i].close;
    
    result.push({
      date: data[i].date,
      value: tenkan,
      tenkan,
      kijun,
      senkouA,
      senkouB,
      chikou,
    });
  }
  
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// VOLUME INDICATORS
// ═══════════════════════════════════════════════════════════════════════════

export function OBV(data: OHLCVData[]): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  let obv = 0;
  
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      obv = data[i].volume;
    } else if (data[i].close > data[i - 1].close) {
      obv += data[i].volume;
    } else if (data[i].close < data[i - 1].close) {
      obv -= data[i].volume;
    }
    
    result.push({ date: data[i].date, value: obv });
  }
  
  return result;
}

export function VWAP(data: OHLCVData[]): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  let cumulativeTPV = 0;
  let cumulativeVolume = 0;
  
  for (let i = 0; i < data.length; i++) {
    const tp = typicalPrice(data[i]);
    cumulativeTPV += tp * data[i].volume;
    cumulativeVolume += data[i].volume;
    
    const vwap = cumulativeVolume > 0 ? cumulativeTPV / cumulativeVolume : tp;
    result.push({ date: data[i].date, value: vwap });
  }
  
  return result;
}

export function ChaikinMoneyFlow(data: OHLCVData[], period: number = 20): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  const mfvs: number[] = []; // Money Flow Volumes
  
  for (let i = 0; i < data.length; i++) {
    const hl = data[i].high - data[i].low;
    const mfm = hl === 0 ? 0 : ((data[i].close - data[i].low) - (data[i].high - data[i].close)) / hl;
    const mfv = mfm * data[i].volume;
    mfvs.push(mfv);
    
    if (i < period - 1) {
      result.push({ date: data[i].date, value: 0 });
      continue;
    }
    
    const periodMFV = sum(mfvs.slice(-period));
    const periodVolume = sum(data.slice(i - period + 1, i + 1).map(d => d.volume));
    
    const cmf = periodVolume === 0 ? 0 : periodMFV / periodVolume;
    result.push({ date: data[i].date, value: cmf });
  }
  
  return result;
}

export function MFI(data: OHLCVData[], period: number = 14): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  const posMF: number[] = [];
  const negMF: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    const tp = typicalPrice(data[i]);
    const rawMF = tp * data[i].volume;
    
    if (i === 0) {
      posMF.push(0);
      negMF.push(0);
      result.push({ date: data[i].date, value: 50 });
      continue;
    }
    
    const prevTP = typicalPrice(data[i - 1]);
    
    if (tp > prevTP) {
      posMF.push(rawMF);
      negMF.push(0);
    } else if (tp < prevTP) {
      posMF.push(0);
      negMF.push(rawMF);
    } else {
      posMF.push(0);
      negMF.push(0);
    }
    
    if (i < period) {
      result.push({ date: data[i].date, value: 50 });
      continue;
    }
    
    const posSum = sum(posMF.slice(-period));
    const negSum = sum(negMF.slice(-period));
    
    const mfr = negSum === 0 ? 100 : posSum / negSum;
    const mfi = 100 - 100 / (1 + mfr);
    
    result.push({ date: data[i].date, value: mfi });
  }
  
  return result;
}

export function ForceIndex(data: OHLCVData[], period: number = 13): IndicatorResult[] {
  const result: IndicatorResult[] = [];
  const rawForce: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      rawForce.push(0);
      result.push({ date: data[i].date, value: 0 });
      continue;
    }
    
    const force = (data[i].close - data[i - 1].close) * data[i].volume;
    rawForce.push(force);
    
    // EMA of Force Index
    if (i < period) {
      result.push({ date: data[i].date, value: mean(rawForce) });
    } else {
      const multiplier = 2 / (period + 1);
      const ema = (force - result[i - 1].value) * multiplier + result[i - 1].value;
      result.push({ date: data[i].date, value: ema });
    }
  }
  
  return result;
}

export function VolumeProfile(data: OHLCVData[], bins: number = 20): { price: number; volume: number; side: 'buy' | 'sell' }[] {
  const prices = data.map(d => d.close);
  const minPrice = lowest(prices);
  const maxPrice = highest(prices);
  const binSize = (maxPrice - minPrice) / bins;
  
  const profile: { price: number; volume: number; buyVolume: number; sellVolume: number }[] = [];
  
  for (let i = 0; i < bins; i++) {
    profile.push({
      price: minPrice + binSize * (i + 0.5),
      volume: 0,
      buyVolume: 0,
      sellVolume: 0,
    });
  }
  
  data.forEach(bar => {
    const binIdx = Math.min(Math.floor((bar.close - minPrice) / binSize), bins - 1);
    if (binIdx >= 0 && binIdx < bins) {
      profile[binIdx].volume += bar.volume;
      if (bar.close >= bar.open) {
        profile[binIdx].buyVolume += bar.volume;
      } else {
        profile[binIdx].sellVolume += bar.volume;
      }
    }
  });
  
  return profile.map(p => ({
    price: p.price,
    volume: p.volume,
    side: p.buyVolume > p.sellVolume ? 'buy' : 'sell',
  }));
}

// ═══════════════════════════════════════════════════════════════════════════
// SUPPORT / RESISTANCE
// ═══════════════════════════════════════════════════════════════════════════

export function PivotPoints(data: OHLCVData[]): IndicatorResult[] {
  return data.map((d, i) => {
    const prev = i > 0 ? data[i - 1] : d;
    const pivot = (prev.high + prev.low + prev.close) / 3;
    
    const r1 = 2 * pivot - prev.low;
    const r2 = pivot + (prev.high - prev.low);
    const r3 = prev.high + 2 * (pivot - prev.low);
    
    const s1 = 2 * pivot - prev.high;
    const s2 = pivot - (prev.high - prev.low);
    const s3 = prev.low - 2 * (prev.high - pivot);
    
    return {
      date: d.date,
      value: pivot,
      pivot,
      r1, r2, r3,
      s1, s2, s3,
    };
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ALL
// ═══════════════════════════════════════════════════════════════════════════

export const Indicators = {
  // Moving Averages
  SMA, EMA, WMA, HullMA, DEMA, TEMA, MARibbon,
  // Momentum
  RSI, MACD, Stochastic, CCI, ROC, WilliamsR, UltimateOscillator, TRIX,
  // Volatility
  ATR, BollingerBands, KeltnerChannels, DonchianChannels, SqueezeMomentum,
  // Trend
  ADX, Supertrend, ParabolicSAR, Aroon, Ichimoku,
  // Volume
  OBV, VWAP, ChaikinMoneyFlow, MFI, ForceIndex, VolumeProfile,
  // Support/Resistance
  PivotPoints,
};

export default Indicators;
