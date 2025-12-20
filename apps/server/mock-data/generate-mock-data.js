/**
 * Mock Data Generator for Monomorph
 * Generates realistic mock data for all 65 cards across 15 stocks
 */

const fs = require('fs');
const path = require('path');

// Master stock database
const stocks = {
  TCS: { name: "Tata Consultancy Services", sector: "IT", price: 3720, mcap: 1350000, profile: "blue-chip" },
  INFY: { name: "Infosys", sector: "IT", price: 1510, mcap: 625000, profile: "blue-chip" },
  LTIM: { name: "LTIMindtree", sector: "IT", price: 4980, mcap: 148000, profile: "growth" },
  HDFCBANK: { name: "HDFC Bank", sector: "Banking", price: 1545, mcap: 1180000, profile: "blue-chip" },
  ICICIBANK: { name: "ICICI Bank", sector: "Banking", price: 1248, mcap: 875000, profile: "turnaround" },
  SBIN: { name: "State Bank of India", sector: "Banking", price: 802, mcap: 715000, profile: "value" },
  BAJFINANCE: { name: "Bajaj Finance", sector: "NBFC", price: 7180, mcap: 445000, profile: "growth" },
  HINDUNILVR: { name: "Hindustan Unilever", sector: "FMCG", price: 2320, mcap: 545000, profile: "defensive" },
  ITC: { name: "ITC Ltd", sector: "FMCG", price: 468, mcap: 585000, profile: "dividend" },
  TITAN: { name: "Titan Company", sector: "Consumer", price: 3320, mcap: 295000, profile: "growth" },
  RELIANCE: { name: "Reliance Industries", sector: "Conglomerate", price: 2545, mcap: 1720000, profile: "conglomerate" },
  LT: { name: "Larsen & Toubro", sector: "Industrial", price: 3540, mcap: 485000, profile: "cyclical" },
  ADANIENT: { name: "Adani Enterprises", sector: "Conglomerate", price: 2810, mcap: 320000, profile: "high-risk" },
  SUNPHARMA: { name: "Sun Pharma", sector: "Pharma", price: 1772, mcap: 425000, profile: "stable" },
  DRREDDY: { name: "Dr Reddy's", sector: "Pharma", price: 6720, mcap: 112000, profile: "stable" }
};

// Utility functions
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const pick = (arr) => arr[randInt(0, arr.length - 1)];
const round = (n, d = 2) => Math.round(n * Math.pow(10, d)) / Math.pow(10, d);

// Generate historical data points
const genHistory = (baseValue, volatility, periods, trend = 0) => {
  const result = [];
  let value = baseValue;
  for (let i = 0; i < periods; i++) {
    value = value * (1 + rand(-volatility, volatility) + trend);
    result.push(round(value));
  }
  return result;
};

// Generate date series
const genDates = (count, format = 'month') => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const quarters = ['Q1FY24', 'Q2FY24', 'Q3FY24', 'Q4FY24', 'Q1FY25', 'Q2FY25'];
  if (format === 'month') return months.slice(-count);
  if (format === 'quarter') return quarters.slice(-count);
  return Array.from({ length: count }, (_, i) => `2024-${String(12 - count + i + 1).padStart(2, '0')}`);
};

// Card data generators
const generators = {
  // DCF Valuation
  'dcf-valuation': (symbol) => {
    const stock = stocks[symbol];
    const wacc = rand(9, 14);
    const terminalGrowth = rand(3, 5);
    const fcfGrowth = rand(8, 18);
    const dcfValue = stock.price * rand(0.9, 1.3);
    
    return {
      symbol,
      asOf: "2024-12-20",
      dcfValue: round(dcfValue),
      currentPrice: stock.price,
      upside: round((dcfValue / stock.price - 1) * 100),
      assumptions: {
        wacc: round(wacc),
        terminalGrowth: round(terminalGrowth),
        fcfGrowth: round(fcfGrowth),
        projectionYears: 10
      },
      fcfProjections: genHistory(stock.mcap * 0.03, 0.05, 10, 0.08).map((v, i) => ({
        year: 2024 + i,
        fcf: round(v),
        discounted: round(v / Math.pow(1 + wacc / 100, i + 1))
      })),
      sensitivity: {
        waccRange: [wacc - 2, wacc - 1, wacc, wacc + 1, wacc + 2].map(w => ({
          wacc: round(w),
          value: round(dcfValue * (wacc / w))
        })),
        growthRange: [terminalGrowth - 1, terminalGrowth, terminalGrowth + 1].map(g => ({
          growth: round(g),
          value: round(dcfValue * (1 + (g - terminalGrowth) * 0.1))
        }))
      },
      components: {
        pvFcf: round(dcfValue * 0.45),
        terminalValue: round(dcfValue * 0.55),
        netDebt: round(stock.mcap * rand(-0.05, 0.15))
      }
    };
  },

  // DuPont Analysis
  'dupont-analysis': (symbol) => {
    const stock = stocks[symbol];
    const isBank = stock.sector === 'Banking' || stock.sector === 'NBFC';
    const netMargin = isBank ? rand(15, 25) : rand(8, 22);
    const assetTurnover = isBank ? rand(0.08, 0.12) : rand(0.5, 1.5);
    const leverage = isBank ? rand(8, 12) : rand(1.2, 3.5);
    const roe = netMargin * assetTurnover * leverage / 100;

    return {
      symbol,
      asOf: "2024-12-20",
      roe: round(roe * 100),
      components: {
        netProfitMargin: { value: round(netMargin), trend: pick(['up', 'down', 'stable']) },
        assetTurnover: { value: round(assetTurnover, 3), trend: pick(['up', 'down', 'stable']) },
        financialLeverage: { value: round(leverage), trend: pick(['up', 'down', 'stable']) }
      },
      breakdown: {
        taxBurden: round(rand(0.7, 0.85)),
        interestBurden: round(rand(0.85, 0.98)),
        ebitMargin: round(netMargin * rand(1.2, 1.5)),
        assetTurnover: round(assetTurnover, 3),
        leverage: round(leverage)
      },
      historical: genDates(5, 'year').map((year, i) => ({
        year,
        roe: round(roe * 100 * (1 + rand(-0.15, 0.15))),
        margin: round(netMargin * (1 + rand(-0.1, 0.1))),
        turnover: round(assetTurnover * (1 + rand(-0.1, 0.1)), 3),
        leverage: round(leverage * (1 + rand(-0.1, 0.1)))
      })),
      peerComparison: Object.keys(stocks)
        .filter(s => stocks[s].sector === stock.sector && s !== symbol)
        .slice(0, 3)
        .map(s => ({
          symbol: s,
          roe: round(rand(10, 30)),
          margin: round(rand(8, 25)),
          turnover: round(rand(0.3, 1.2), 2),
          leverage: round(rand(1.5, 4))
        }))
    };
  },

  // Dividend Crystal Ball
  'dividend-crystal-ball': (symbol) => {
    const stock = stocks[symbol];
    const divYield = stock.profile === 'dividend' ? rand(2.5, 4) : rand(0.3, 2);
    const dps = stock.price * divYield / 100;
    const payoutRatio = rand(25, 65);
    
    return {
      symbol,
      asOf: "2024-12-20",
      currentDPS: round(dps),
      dividendYield: round(divYield),
      payoutRatio: round(payoutRatio),
      sustainability: payoutRatio < 50 ? "High" : payoutRatio < 70 ? "Moderate" : "Low",
      projections: Array.from({ length: 5 }, (_, i) => ({
        year: 2025 + i,
        dps: round(dps * Math.pow(1.08, i + 1)),
        yield: round(divYield * (1 + rand(-0.1, 0.15))),
        payout: round(payoutRatio * (1 + rand(-0.05, 0.05)))
      })),
      history: genDates(6, 'year').map((year, i) => ({
        year,
        dps: round(dps * Math.pow(0.92, 5 - i)),
        special: i === 3 ? round(dps * 0.5) : 0
      })),
      coverage: {
        earningsCoverage: round(100 / payoutRatio, 1),
        fcfCoverage: round(100 / payoutRatio * rand(0.8, 1.2), 1),
        cashBalance: round(stock.mcap * rand(0.02, 0.08))
      },
      streaks: {
        consecutiveYears: randInt(5, 25),
        growthYears: randInt(3, 15),
        noCutYears: randInt(8, 30)
      }
    };
  },

  // Technical Indicators
  'technical-indicators': (symbol) => {
    const stock = stocks[symbol];
    const rsi = rand(25, 75);
    const bullish = randInt(4, 10);
    const bearish = randInt(2, 8);
    
    return {
      symbol,
      asOf: "2024-12-20",
      overallSignal: rsi > 60 ? "Buy" : rsi < 40 ? "Sell" : "Neutral",
      score: randInt(30, 85),
      indicators: {
        rsi: { value: round(rsi), signal: rsi > 70 ? "Overbought" : rsi < 30 ? "Oversold" : "Neutral" },
        macd: { value: round(rand(-5, 5)), signal: pick(["Bullish", "Bearish"]), histogram: round(rand(-2, 2)) },
        stochastic: { k: round(rand(20, 80)), d: round(rand(20, 80)), signal: pick(["Buy", "Sell", "Neutral"]) },
        adx: { value: round(rand(15, 45)), signal: rand(0, 1) > 0.5 ? "Trending" : "Ranging" },
        cci: { value: round(rand(-150, 150)), signal: pick(["Overbought", "Oversold", "Neutral"]) },
        williamsR: { value: round(rand(-90, -10)), signal: pick(["Overbought", "Oversold", "Neutral"]) }
      },
      movingAverages: {
        sma20: { value: round(stock.price * rand(0.95, 1.05)), signal: pick(["Buy", "Sell"]) },
        sma50: { value: round(stock.price * rand(0.9, 1.1)), signal: pick(["Buy", "Sell"]) },
        sma200: { value: round(stock.price * rand(0.85, 1.15)), signal: pick(["Buy", "Sell"]) },
        ema20: { value: round(stock.price * rand(0.96, 1.04)), signal: pick(["Buy", "Sell"]) }
      },
      summary: { bullish, bearish, neutral: 12 - bullish - bearish }
    };
  },

  // Candlestick Hero (OHLCV data)
  'candlestick-hero': (symbol) => {
    const stock = stocks[symbol];
    const days = 90;
    let price = stock.price * 0.9;
    const data = [];
    
    for (let i = 0; i < days; i++) {
      const open = price;
      const change = rand(-0.03, 0.03);
      const close = open * (1 + change);
      const high = Math.max(open, close) * (1 + rand(0, 0.015));
      const low = Math.min(open, close) * (1 - rand(0, 0.015));
      const volume = stock.mcap * rand(0.001, 0.004);
      
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        open: round(open),
        high: round(high),
        low: round(low),
        close: round(close),
        volume: Math.round(volume)
      });
      price = close;
    }
    
    return {
      symbol,
      asOf: "2024-12-20",
      currentPrice: stock.price,
      change: round(rand(-3, 3)),
      changePercent: round(rand(-2, 2)),
      ohlcv: data,
      patterns: [
        { name: pick(["Hammer", "Doji", "Engulfing", "Morning Star"]), date: data[data.length - randInt(1, 10)].date, signal: pick(["Bullish", "Bearish"]) }
      ],
      supports: [round(stock.price * 0.95), round(stock.price * 0.9)],
      resistances: [round(stock.price * 1.05), round(stock.price * 1.1)]
    };
  },

  // Portfolio Leaderboard
  'portfolio-leaderboard': () => {
    const holdings = Object.keys(stocks).slice(0, 10);
    const returns = holdings.map(s => ({
      symbol: s,
      return: round(rand(-15, 35)),
      contribution: round(rand(-2, 5)),
      weight: round(rand(5, 15))
    })).sort((a, b) => b.return - a.return);
    
    const portfolioReturn = returns.reduce((sum, h) => sum + h.contribution, 0);
    const benchmarkReturn = round(rand(8, 18));
    
    return {
      asOf: "2024-12-20",
      portfolioReturn: round(portfolioReturn),
      benchmarkReturn,
      alpha: round(portfolioReturn - benchmarkReturn),
      rankings: returns,
      topPerformers: returns.slice(0, 3).map(r => ({ symbol: r.symbol, return: r.return })),
      bottomPerformers: returns.slice(-3).map(r => ({ symbol: r.symbol, return: r.return })),
      attribution: {
        stockSelection: round(rand(-2, 5)),
        sectorAllocation: round(rand(-1, 3)),
        timing: round(rand(-1, 2))
      }
    };
  },

  // Options Interest
  'options-interest': (symbol) => {
    const stock = stocks[symbol];
    const pcr = rand(0.6, 1.5);
    const callOI = randInt(5000000, 20000000);
    const putOI = Math.round(callOI * pcr);
    
    const strikes = [];
    for (let i = -5; i <= 5; i++) {
      const strike = Math.round(stock.price * (1 + i * 0.025) / 10) * 10;
      strikes.push({
        strike,
        callOI: randInt(100000, 2000000),
        putOI: randInt(100000, 2000000),
        type: i < -2 ? "put" : i > 2 ? "call" : "balanced"
      });
    }
    
    return {
      symbol,
      asOf: "2024-12-20",
      sentiment: pcr > 1.2 ? "Bearish" : pcr < 0.8 ? "Bullish" : "Neutral",
      pcr: { value: round(pcr), change: round(rand(-0.1, 0.1)) },
      maxPain: Math.round(stock.price / 10) * 10,
      currentPrice: stock.price,
      openInterest: { calls: callOI, puts: putOI, total: callOI + putOI },
      topStrikes: strikes.sort((a, b) => (b.callOI + b.putOI) - (a.callOI + a.putOI)).slice(0, 5),
      unusualActivity: randInt(0, 2) > 0 ? [{
        strike: `${Math.round(stock.price * rand(0.95, 1.05))} CE`,
        type: "Call",
        volume: randInt(50000, 200000),
        signal: "Bullish bet"
      }] : []
    };
  }
};

// Generate all mock data
const generateAllMockData = () => {
  const cardsDir = path.join(__dirname, 'cards');
  if (!fs.existsSync(cardsDir)) {
    fs.mkdirSync(cardsDir, { recursive: true });
  }

  Object.entries(generators).forEach(([cardId, generator]) => {
    const data = {};
    
    if (cardId === 'portfolio-leaderboard') {
      // Portfolio-level cards don't need per-stock data
      Object.assign(data, generator());
    } else {
      // Generate for each stock
      Object.keys(stocks).forEach(symbol => {
        data[symbol] = generator(symbol);
      });
    }
    
    const filePath = path.join(cardsDir, `${cardId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Generated: ${cardId}.json`);
  });
  
  console.log('\nMock data generation complete!');
};

// Run if called directly
if (require.main === module) {
  generateAllMockData();
}

module.exports = { generators, stocks, generateAllMockData };
