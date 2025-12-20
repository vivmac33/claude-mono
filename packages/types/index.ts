
export type SeriesPoint = { t: string; v: number };
export type Candle = { t: string; o: number; h: number; l: number; c: number; v?: number };
export type CandlePayload = {
  symbol: string;
  series: Candle[];
  overlays?: { ma20?: { t: string; v: number }[]; ma50?: { t: string; v: number }[]; bbUpper?: { t: string; v: number }[]; bbLower?: { t: string; v: number }[]; };
  indicators?: { rsi?: { t: string; v: number }[]; macd?: { t: string; macd: number; signal: number; hist: number }[]; };
};
export type FairValueForecaster = { symbol: string; asOf: string; fairValueNow: number; marginOfSafetyNow: number; horizonYears: number; fan: { t:string; p5:number; p25:number; p50:number; p75:number; p95:number }[]; sensitivity: { growthDeltaPct:number; fv:number }[]; };
export type DividendProjection = { holdings: { symbol:string; weight:number }[]; asOf:string; projection: { t:string; income:number }[]; projectedYield:number; growth5yPct:number; payoutWarning?: { symbol:string; payoutRatio:number }[]; };
export type RebalanceResult = { portfolioId:string; asOf:string; before:{symbol:string;w:number}[]; after:{symbol:string;w:number}[]; metricsBefore:any; metricsAfter:any; deltas:any };
export type RatioEvolution = { symbol:string; series: { t:string; pe?:number; growthSales?:number; growthEps?:number }[] };
export type ETFComparator = { left:any; right:any; corrHeatmap:{a:string;b:string;r:number}[]; holdingsOverlapPct:number };
export type PortfolioLeaderboard = { rows: Array<{ portfolioId:string; name:string; rankPct:number; metrics:any; spark:any[] }>; asOf:string };
export type PatternMatch = { symbol:string; base:{t:string;v:number}[]; matches: Array<{ symbol:string; refWindow:string; similarity:number; aligned:{t:string;v:number}[] }> };
