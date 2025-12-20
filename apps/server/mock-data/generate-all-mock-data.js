/**
 * Complete Mock Data Generator for Monomorph
 * Generates realistic mock data for all 65 cards across 15 stocks
 */

const fs = require('fs');
const path = require('path');

// Master stock database with comprehensive financial data
const stocks = {
  TCS: { 
    name: "Tata Consultancy Services", sector: "IT", industry: "IT Services",
    price: 3720, mcap: 1350000, profile: "blue-chip",
    pe: 29.9, pb: 13.5, roe: 45.2, debtEquity: 0.05, divYield: 1.51,
    revenueGrowth: 8.5, profitGrowth: 9.2, margin: 18.75
  },
  INFY: { 
    name: "Infosys", sector: "IT", industry: "IT Services",
    price: 1510, mcap: 625000, profile: "blue-chip",
    pe: 23.5, pb: 7.6, roe: 32.5, debtEquity: 0.08, divYield: 2.25,
    revenueGrowth: 4.2, profitGrowth: 3.8, margin: 17.0
  },
  LTIM: { 
    name: "LTIMindtree", sector: "IT", industry: "IT Services",
    price: 4980, mcap: 148000, profile: "growth",
    pe: 29.6, pb: 8.4, roe: 28.4, debtEquity: 0.12, divYield: 0.9,
    revenueGrowth: 18.5, profitGrowth: 22.1, margin: 13.7
  },
  HDFCBANK: { 
    name: "HDFC Bank", sector: "Banking", industry: "Private Bank",
    price: 1545, mcap: 1180000, profile: "blue-chip",
    pe: 22.7, pb: 2.97, roe: 16.8, debtEquity: null, divYield: 1.26,
    revenueGrowth: 22.5, profitGrowth: 18.2, margin: 21.2, nim: 4.1, gnpa: 1.24
  },
  ICICIBANK: { 
    name: "ICICI Bank", sector: "Banking", industry: "Private Bank",
    price: 1248, mcap: 875000, profile: "turnaround",
    pe: 19.7, pb: 3.28, roe: 18.2, debtEquity: null, divYield: 0.8,
    revenueGrowth: 25.8, profitGrowth: 28.5, margin: 22.5, nim: 4.4, gnpa: 2.48
  },
  SBIN: { 
    name: "State Bank of India", sector: "Banking", industry: "PSU Bank",
    price: 802, mcap: 715000, profile: "value",
    pe: 11.7, pb: 1.96, roe: 18.5, debtEquity: null, divYield: 1.71,
    revenueGrowth: 18.2, profitGrowth: 35.2, margin: 14.4, nim: 3.3, gnpa: 2.78
  },
  BAJFINANCE: { 
    name: "Bajaj Finance", sector: "NBFC", industry: "Consumer Finance",
    price: 7180, mcap: 445000, profile: "growth",
    pe: 30.6, pb: 6.1, roe: 22.5, debtEquity: 3.2, divYield: 0.5,
    revenueGrowth: 28.5, profitGrowth: 32.1, margin: 25.0, gnpa: 0.91
  },
  HINDUNILVR: { 
    name: "Hindustan Unilever", sector: "FMCG", industry: "Personal Products",
    price: 2320, mcap: 545000, profile: "defensive",
    pe: 50.2, pb: 43.0, roe: 85.2, debtEquity: 0.02, divYield: 1.81,
    revenueGrowth: 5.2, profitGrowth: 4.8, margin: 17.4
  },
  ITC: { 
    name: "ITC Ltd", sector: "FMCG", industry: "Tobacco & FMCG",
    price: 468, mcap: 585000, profile: "dividend",
    pe: 28.5, pb: 8.1, roe: 28.5, debtEquity: 0.01, divYield: 3.31,
    revenueGrowth: 6.8, profitGrowth: 8.2, margin: 29.1
  },
  TITAN: { 
    name: "Titan Company", sector: "Consumer", industry: "Jewellery",
    price: 3320, mcap: 295000, profile: "growth",
    pe: 76.5, pb: 22.4, roe: 32.8, debtEquity: 0.45, divYield: 0.33,
    revenueGrowth: 22.5, profitGrowth: 18.2, margin: 7.5
  },
  RELIANCE: { 
    name: "Reliance Industries", sector: "Conglomerate", industry: "Oil & Telecom",
    price: 2545, mcap: 1720000, profile: "conglomerate",
    pe: 21.7, pb: 1.93, roe: 9.2, debtEquity: 0.42, divYield: 0.39,
    revenueGrowth: 12.5, profitGrowth: 9.8, margin: 8.2
  },
  LT: { 
    name: "Larsen & Toubro", sector: "Industrial", industry: "Construction",
    price: 3540, mcap: 485000, profile: "cyclical",
    pe: 32.0, pb: 4.54, roe: 14.8, debtEquity: 1.15, divYield: 0.79,
    revenueGrowth: 15.2, profitGrowth: 18.5, margin: 6.8
  },
  ADANIENT: { 
    name: "Adani Enterprises", sector: "Conglomerate", industry: "Infrastructure",
    price: 2810, mcap: 320000, profile: "high-risk",
    pe: 76.4, pb: 8.8, roe: 12.5, debtEquity: 2.85, divYield: 0.05,
    revenueGrowth: 42.5, profitGrowth: 55.2, margin: 2.9
  },
  SUNPHARMA: { 
    name: "Sun Pharma", sector: "Pharma", industry: "Pharmaceuticals",
    price: 1772, mcap: 425000, profile: "stable",
    pe: 41.7, pb: 6.2, roe: 15.8, debtEquity: 0.18, divYield: 0.42,
    revenueGrowth: 11.2, profitGrowth: 22.5, margin: 19.4
  },
  DRREDDY: { 
    name: "Dr Reddy's", sector: "Pharma", industry: "Pharmaceuticals",
    price: 6720, mcap: 112000, profile: "stable",
    pe: 23.1, pb: 4.0, roe: 18.2, debtEquity: 0.12, divYield: 0.6,
    revenueGrowth: 8.5, profitGrowth: 15.2, margin: 17.0
  }
};

// Utility functions
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const round = (n, d = 2) => Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
const genDates = (count, type = 'month') => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const quarters = ['Q1FY23', 'Q2FY23', 'Q3FY23', 'Q4FY23', 'Q1FY24', 'Q2FY24', 'Q3FY24', 'Q4FY24'];
  if (type === 'month') return months.slice(-count);
  if (type === 'quarter') return quarters.slice(-count);
  if (type === 'year') return ['2020', '2021', '2022', '2023', '2024'].slice(-count);
  return Array.from({ length: count }, (_, i) => `Day ${i + 1}`);
};

// All card generators
const allGenerators = {
  // VALUE CARDS
  'fair-value-forecaster': (sym) => {
    const s = stocks[sym];
    const fv = s.price * rand(0.9, 1.25);
    return {
      symbol: sym, asOf: "2024-12-20", currentPrice: s.price, fairValue: round(fv),
      upside: round((fv/s.price - 1) * 100), confidence: randInt(55, 85),
      verdict: fv > s.price * 1.1 ? "Undervalued" : fv < s.price * 0.9 ? "Overvalued" : "Fairly Valued",
      methods: [
        { name: "DCF", value: round(fv * rand(0.95, 1.08)), weight: 0.35 },
        { name: "PE Relative", value: round(fv * rand(0.92, 1.05)), weight: 0.25 },
        { name: "EV/EBITDA", value: round(fv * rand(0.94, 1.06)), weight: 0.20 },
        { name: "Graham Number", value: round(fv * rand(0.88, 1.02)), weight: 0.10 },
        { name: "Dividend Discount", value: round(fv * rand(0.9, 1.1)), weight: 0.10 }
      ],
      range: { low: round(fv * 0.85), fair: round(fv), high: round(fv * 1.15) },
      historicalValuation: genDates(7, 'month').map((d, i) => ({
        date: `2024-${String(6+i).padStart(2,'0')}`, price: round(s.price * rand(0.9, 1.1)), fairValue: round(fv * rand(0.95, 1.05))
      })),
      scenarios: { bull: { value: round(fv * 1.15), probability: 25 }, base: { value: round(fv), probability: 50 }, bear: { value: round(fv * 0.85), probability: 25 } }
    };
  },

  'valuation-summary': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20", currentPrice: s.price,
      verdict: s.pe < 20 ? "Undervalued" : s.pe > 40 ? "Overvalued" : "Fairly Valued",
      multiples: {
        pe: { current: s.pe, sector: round(s.pe * rand(0.8, 1.2)), historical5Y: round(s.pe * rand(0.9, 1.1)), percentile: randInt(20, 80) },
        pb: { current: s.pb, sector: round(s.pb * rand(0.7, 1.3)), historical5Y: round(s.pb * rand(0.85, 1.15)), percentile: randInt(25, 75) },
        evEbitda: { current: round(s.pe * 0.7), sector: round(s.pe * 0.65), historical5Y: round(s.pe * 0.68), percentile: randInt(30, 70) },
        pegRatio: { current: round(s.pe / Math.max(s.profitGrowth, 5), 1), sector: round(rand(1, 3), 1), historical5Y: round(rand(1.2, 2.5), 1), percentile: randInt(20, 80) }
      },
      premiumDiscount: { vsSector: round(rand(-20, 25)), vsHistorical: round(rand(-15, 20)), verdict: pick(["Premium", "Discount", "Fair"]) },
      peerComparison: Object.keys(stocks).filter(x => stocks[x].sector === s.sector).slice(0, 4).map(x => ({
        symbol: x, pe: stocks[x].pe, pb: stocks[x].pb, roe: stocks[x].roe, growth: stocks[x].profitGrowth
      }))
    };
  },

  'dcf-valuation': (sym) => {
    const s = stocks[sym];
    const wacc = round(rand(9, 14));
    const tg = round(rand(3, 5));
    const dcfVal = round(s.price * rand(0.9, 1.3));
    return {
      symbol: sym, asOf: "2024-12-20", dcfValue: dcfVal, currentPrice: s.price,
      upside: round((dcfVal/s.price - 1) * 100),
      assumptions: { wacc, terminalGrowth: tg, fcfGrowth: round(rand(8, 18)), projectionYears: 10 },
      fcfProjections: Array.from({length: 10}, (_, i) => ({
        year: 2024 + i, fcf: round(s.mcap * 0.03 * Math.pow(1.1, i)), discounted: round(s.mcap * 0.025 * Math.pow(0.9, i))
      })),
      sensitivity: {
        waccRange: [-2, -1, 0, 1, 2].map(d => ({ wacc: round(wacc + d), value: round(dcfVal * (1 - d * 0.08)) })),
        growthRange: [-1, 0, 1].map(d => ({ growth: round(tg + d), value: round(dcfVal * (1 + d * 0.1)) }))
      },
      components: { pvFcf: round(dcfVal * 0.45), terminalValue: round(dcfVal * 0.55), netDebt: round(s.mcap * rand(-0.05, 0.15)) }
    };
  },

  'piotroski-score': (sym) => {
    const s = stocks[sym];
    const score = s.profile === 'high-risk' ? randInt(2, 4) : s.profile === 'blue-chip' ? randInt(7, 9) : randInt(5, 8);
    return {
      symbol: sym, asOf: "2024-12-20", score, maxScore: 9,
      rating: score >= 7 ? "Strong" : score >= 5 ? "Moderate" : "Weak",
      criteria: {
        profitability: [
          { name: "Positive Net Income", passed: score > 3, value: `₹${randInt(1000, 50000)} Cr`, description: "Net profit is positive" },
          { name: "Positive OCF", passed: score > 2, value: `₹${randInt(1200, 55000)} Cr`, description: "Operating cash flow positive" },
          { name: "ROA Improving", passed: score > 5, value: `${rand(-1, 2).toFixed(1)}%`, description: "ROA trend" },
          { name: "OCF > Net Income", passed: score > 4, value: `${rand(0.9, 1.3).toFixed(2)}x`, description: "Earnings quality" }
        ],
        leverage: [
          { name: "Decrease in Leverage", passed: score > 4, value: `${rand(-0.2, 0.1).toFixed(2)}`, description: "D/E change" },
          { name: "Current Ratio Up", passed: score > 5, value: `${rand(-0.1, 0.2).toFixed(2)}`, description: "Liquidity trend" },
          { name: "No Dilution", passed: score > 3, value: "0", description: "Share count stable" }
        ],
        efficiency: [
          { name: "Margin Improving", passed: score > 6, value: `${rand(-0.5, 1).toFixed(1)}%`, description: "Gross margin trend" },
          { name: "Turnover Improving", passed: score > 5, value: `${rand(-0.05, 0.05).toFixed(2)}`, description: "Asset efficiency" }
        ]
      },
      historicalScores: genDates(5, 'year').map((y, i) => ({ year: y, score: Math.min(9, Math.max(1, score + randInt(-2, 2))) })),
      sectorAverage: round(rand(5, 7), 1)
    };
  },

  'dupont-analysis': (sym) => {
    const s = stocks[sym];
    const margin = s.margin || rand(8, 20);
    const turnover = s.sector === 'Banking' ? rand(0.08, 0.12) : rand(0.5, 1.5);
    const leverage = s.debtEquity ? 1 + s.debtEquity : rand(1.5, 4);
    return {
      symbol: sym, asOf: "2024-12-20", roe: s.roe,
      components: {
        netProfitMargin: { value: round(margin), trend: pick(['up', 'down', 'stable']) },
        assetTurnover: { value: round(turnover, 3), trend: pick(['up', 'down', 'stable']) },
        financialLeverage: { value: round(leverage), trend: pick(['up', 'down', 'stable']) }
      },
      breakdown: { taxBurden: round(rand(0.7, 0.85)), interestBurden: round(rand(0.85, 0.98)), ebitMargin: round(margin * 1.3), assetTurnover: round(turnover, 3), leverage: round(leverage) },
      historical: genDates(5, 'year').map(y => ({ year: y, roe: round(s.roe * rand(0.85, 1.15)), margin: round(margin * rand(0.9, 1.1)), turnover: round(turnover * rand(0.9, 1.1), 3), leverage: round(leverage * rand(0.9, 1.1)) })),
      peerComparison: Object.keys(stocks).filter(x => stocks[x].sector === s.sector && x !== sym).slice(0, 3).map(x => ({ symbol: x, roe: stocks[x].roe, margin: round(rand(8, 25)), turnover: round(rand(0.3, 1.2), 2), leverage: round(rand(1.5, 4)) }))
    };
  },

  'intrinsic-value-range': (sym) => {
    const s = stocks[sym];
    const base = s.price * rand(0.95, 1.15);
    return {
      symbol: sym, asOf: "2024-12-20", currentPrice: s.price,
      models: [
        { name: "DCF Conservative", value: round(base * 0.85), confidence: randInt(60, 80) },
        { name: "DCF Base", value: round(base), confidence: randInt(70, 85) },
        { name: "DCF Optimistic", value: round(base * 1.2), confidence: randInt(55, 75) },
        { name: "Comparable Cos", value: round(base * rand(0.9, 1.1)), confidence: randInt(65, 80) },
        { name: "Graham Number", value: round(Math.sqrt(22.5 * (s.mcap/1000) * (s.mcap/s.pe/1000)) * rand(0.8, 1.2)), confidence: randInt(50, 70) }
      ],
      range: { low: round(base * 0.75), mid: round(base), high: round(base * 1.25) },
      consensus: round(base * rand(0.95, 1.05)),
      upside: round((base/s.price - 1) * 100)
    };
  },

  'multi-factor-scorecard': (sym) => {
    const s = stocks[sym];
    const overall = s.profile === 'blue-chip' ? randInt(70, 90) : s.profile === 'high-risk' ? randInt(30, 55) : randInt(50, 75);
    return {
      symbol: sym, asOf: "2024-12-20", overallScore: overall, grade: overall >= 75 ? "A" : overall >= 60 ? "B" : overall >= 45 ? "C" : "D",
      factors: [
        { name: "Value", score: randInt(30, 90), weight: 0.2, percentile: randInt(20, 80) },
        { name: "Quality", score: randInt(40, 95), weight: 0.25, percentile: randInt(25, 85) },
        { name: "Momentum", score: randInt(25, 85), weight: 0.15, percentile: randInt(15, 75) },
        { name: "Growth", score: randInt(35, 90), weight: 0.2, percentile: randInt(20, 80) },
        { name: "Low Vol", score: randInt(30, 85), weight: 0.1, percentile: randInt(25, 75) },
        { name: "Dividend", score: randInt(20, 90), weight: 0.1, percentile: randInt(15, 85) }
      ],
      radarData: ["Value", "Quality", "Momentum", "Growth", "Safety", "Yield"].map(f => ({ factor: f, score: randInt(30, 90), fullMark: 100 })),
      sectorRank: { rank: randInt(1, 15), total: 15, percentile: randInt(20, 95) }
    };
  },

  'financial-health-dna': (sym) => {
    const s = stocks[sym];
    const health = s.profile === 'high-risk' ? 'Weak' : s.profile === 'blue-chip' ? 'Strong' : 'Moderate';
    return {
      symbol: sym, asOf: "2024-12-20", overallHealth: health, healthScore: health === 'Strong' ? randInt(75, 95) : health === 'Weak' ? randInt(25, 45) : randInt(50, 74),
      dnaStrands: [
        { name: "Profitability", score: randInt(40, 95), benchmark: 70, trend: pick(['up', 'down', 'stable']) },
        { name: "Solvency", score: s.debtEquity < 0.5 ? randInt(70, 95) : randInt(30, 65), benchmark: 65, trend: pick(['up', 'stable']) },
        { name: "Liquidity", score: randInt(50, 90), benchmark: 60, trend: pick(['up', 'down', 'stable']) },
        { name: "Efficiency", score: randInt(45, 85), benchmark: 65, trend: pick(['up', 'stable']) },
        { name: "Growth", score: s.profitGrowth > 15 ? randInt(70, 95) : randInt(35, 65), benchmark: 60, trend: s.profitGrowth > 10 ? 'up' : 'stable' },
        { name: "Cash Flow", score: randInt(50, 90), benchmark: 70, trend: pick(['up', 'down', 'stable']) },
        { name: "Valuation", score: s.pe < 25 ? randInt(60, 85) : randInt(30, 55), benchmark: 55, trend: pick(['up', 'down']) },
        { name: "Stability", score: s.profile === 'defensive' ? randInt(75, 95) : randInt(40, 75), benchmark: 65, trend: 'stable' }
      ],
      peerOverlay: Object.keys(stocks).filter(x => stocks[x].sector === s.sector && x !== sym).slice(0, 2).map(x => ({ symbol: x, scores: Array(8).fill(0).map(() => randInt(40, 85)) }))
    };
  },

  // GROWTH CARDS
  'growth-summary': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20",
      overallGrade: s.profitGrowth > 20 ? "A" : s.profitGrowth > 10 ? "B" : s.profitGrowth > 5 ? "C" : "D",
      growthScore: Math.min(100, Math.round(s.profitGrowth * 3 + 20)),
      metrics: {
        revenueGrowth: { "1Y": s.revenueGrowth, "3Y": round(s.revenueGrowth * 1.2), "5Y": round(s.revenueGrowth * 1.1), trend: s.revenueGrowth > 10 ? "up" : "stable" },
        profitGrowth: { "1Y": s.profitGrowth, "3Y": round(s.profitGrowth * 1.15), "5Y": round(s.profitGrowth * 1.05), trend: s.profitGrowth > 10 ? "up" : "stable" },
        epsGrowth: { "1Y": round(s.profitGrowth * 1.05), "3Y": round(s.profitGrowth * 1.2), "5Y": round(s.profitGrowth * 1.1), trend: "stable" },
        ebitdaGrowth: { "1Y": round(s.profitGrowth * 0.9), "3Y": round(s.profitGrowth * 1.1), "5Y": round(s.profitGrowth * 1.0), trend: "stable" }
      },
      quarterlyTrend: genDates(6, 'quarter').map((q, i) => ({ quarter: q, revenue: round(s.mcap * 0.05 * (1 + i * 0.02)), profit: round(s.mcap * 0.01 * (1 + i * 0.02)), margin: round(s.margin * rand(0.95, 1.05)) })),
      sectorComparison: { rank: randInt(1, 5), total: Object.keys(stocks).filter(x => stocks[x].sector === s.sector).length, percentile: randInt(50, 95) },
      guidance: { revenueGrowth: `${Math.round(s.revenueGrowth * 0.8)}-${Math.round(s.revenueGrowth * 1.2)}%`, marginOutlook: pick(["Stable", "Expanding", "Pressure"]) }
    };
  },

  'earnings-quality': (sym) => {
    const s = stocks[sym];
    const quality = s.profile === 'high-risk' ? 'Low' : s.profile === 'blue-chip' ? 'High' : 'Moderate';
    return {
      symbol: sym, asOf: "2024-12-20", qualityScore: quality === 'High' ? randInt(75, 95) : quality === 'Low' ? randInt(25, 45) : randInt(50, 74),
      grade: quality, 
      metrics: {
        accrualRatio: round(rand(-5, 15)), ocfToNetIncome: round(rand(80, 130)),
        receivablesDays: randInt(30, 90), inventoryDays: randInt(20, 120),
        revenueQuality: randInt(60, 95), earningsPersistence: randInt(55, 90)
      },
      redFlags: s.profile === 'high-risk' ? [
        { flag: "High accruals", severity: "warning", description: "Earnings may not be sustainable" },
        { flag: "Working capital concerns", severity: "warning", description: "Cash conversion lagging" }
      ] : [],
      historical: genDates(6, 'quarter').map(q => ({ quarter: q, ocf: round(s.mcap * 0.012 * rand(0.8, 1.2)), netIncome: round(s.mcap * 0.01 * rand(0.9, 1.1)), ratio: round(rand(85, 125)) }))
    };
  },

  'efficiency-dashboard': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20",
      operatingEfficiency: { score: randInt(55, 90), trend: pick(["Improving", "Stable", "Declining"]) },
      metrics: {
        operatingMargin: s.margin, grossMargin: round(s.margin * 1.4), ebitdaMargin: round(s.margin * 1.2),
        assetTurnover: round(rand(0.4, 1.5), 2), inventoryTurnover: round(rand(4, 15), 1),
        receivablesTurnover: round(rand(5, 12), 1), payablesTurnover: round(rand(4, 10), 1)
      },
      workingCapital: { dso: randInt(30, 75), dio: randInt(25, 90), dpo: randInt(30, 70), ccc: randInt(20, 80) },
      marginWaterfall: [
        { stage: "Revenue", value: 100 }, { stage: "Gross", value: round(s.margin * 1.4 + 50) },
        { stage: "EBITDA", value: round(s.margin * 1.2 + 40) }, { stage: "Operating", value: round(s.margin + 35) },
        { stage: "Net", value: round(s.margin + 30) }
      ],
      peerComparison: { operatingMargin: { company: s.margin, sectorAvg: round(s.margin * rand(0.85, 1.15)) }, assetTurnover: { company: round(rand(0.5, 1.2), 2), sectorAvg: round(rand(0.6, 1.0), 2) } }
    };
  },

  'earnings-stability': (sym) => {
    const s = stocks[sym];
    const stability = s.profile === 'defensive' ? 'High' : s.profile === 'high-risk' ? 'Low' : 'Moderate';
    return {
      symbol: sym, asOf: "2024-12-20",
      stabilityScore: stability === 'High' ? randInt(75, 95) : stability === 'Low' ? randInt(25, 50) : randInt(50, 74),
      grade: stability,
      metrics: { epsVolatility: round(rand(8, 35)), coefficientOfVariation: round(rand(0.1, 0.5), 2), trendR2: round(rand(0.5, 0.95), 2), predictability: randInt(50, 90) },
      epsHistory: genDates(8, 'quarter').map((q, i) => ({ quarter: q, actual: round(s.price / s.pe * rand(0.9, 1.1), 1), estimate: round(s.price / s.pe * rand(0.95, 1.05), 1) })),
      surpriseHistory: genDates(8, 'quarter').map(q => ({ quarter: q, surprise: round(rand(-5, 8)) })),
      beatRate: randInt(50, 85)
    };
  },

  'management-quality': (sym) => {
    const s = stocks[sym];
    const quality = s.profile === 'high-risk' ? 'Concerning' : s.profile === 'blue-chip' ? 'Excellent' : 'Good';
    return {
      symbol: sym, asOf: "2024-12-20",
      qualityRating: quality, score: quality === 'Excellent' ? randInt(80, 95) : quality === 'Concerning' ? randInt(30, 50) : randInt(55, 79),
      promoterHolding: { current: round(rand(30, 75)), change3M: round(rand(-2, 2), 2) },
      pledge: { percentage: s.profile === 'high-risk' ? round(rand(2, 15)) : round(rand(0, 3)), trend: pick(["Stable", "Increasing", "Decreasing"]) },
      insiderActivity: { sentiment: pick(["Bullish", "Neutral", "Bearish"]), netValue: round(rand(-50, 100)), transactions: randInt(2, 15) },
      recentTransactions: Array(randInt(2, 5)).fill(0).map(() => ({ date: `2024-${randInt(10, 12)}-${randInt(1, 28)}`, insider: pick(["CEO", "CFO", "Director", "Promoter"]), type: pick(["Buy", "Sell"]), value: round(rand(1, 50)) })),
      governance: { boardIndependence: randInt(40, 70), auditorQuality: pick(["Big 4", "Reputed", "Other"]), relatedPartyFlag: s.profile === 'high-risk' ? "High" : "Low" },
      capitalAllocation: { roic5Y: round(rand(10, 30)) }
    };
  },

  'capital-allocation': (sym) => {
    const s = stocks[sym];
    const roic = round(rand(10, 35));
    const wacc = round(rand(9, 14));
    return {
      symbol: sym, asOf: "2024-12-20",
      roic, wacc, spread: round(roic - wacc),
      verdict: roic > wacc + 5 ? "Value Creator" : roic > wacc ? "Value Neutral" : "Value Destroyer",
      deployment: { reinvestment: randInt(30, 60), dividends: randInt(15, 40), buybacks: randInt(0, 15), debtRepayment: randInt(5, 20), acquisitions: randInt(0, 15) },
      historical: genDates(5, 'year').map(y => ({ year: y, roic: round(roic * rand(0.85, 1.15)), wacc: round(wacc * rand(0.95, 1.05)) })),
      incrementalRoic: round(rand(8, 30)), capitalEfficiency: round(rand(60, 95))
    };
  },

  'sales-profit-cash': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20",
      alignmentScore: randInt(60, 95),
      metrics: { profitToSales: round(s.margin), cashToProfit: round(rand(80, 130)), cashToSales: round(s.margin * rand(0.8, 1.1)), accrualRatio: round(rand(-5, 12)) },
      trend: pick(["Improving", "Stable", "Declining"]),
      flowData: genDates(6, 'quarter').map((q, i) => ({
        period: q, revenue: round(s.mcap * 0.05 * (1 + i * 0.015)),
        profit: round(s.mcap * 0.01 * (1 + i * 0.01)),
        cashFlow: round(s.mcap * 0.012 * (1 + i * 0.01))
      })),
      divergenceAlerts: rand(0, 1) > 0.7 ? [{ type: "warning", message: "Cash lagging profit growth" }] : []
    };
  },

  'profit-vs-cash-divergence': (sym) => {
    const s = stocks[sym];
    const divergence = s.profile === 'high-risk' ? randInt(60, 90) : randInt(10, 45);
    return {
      symbol: sym, asOf: "2024-12-20",
      divergenceScore: divergence,
      riskLevel: divergence > 60 ? "High" : divergence > 35 ? "Moderate" : "Low",
      comparison: { netIncome: round(s.mcap * 0.01), operatingCashFlow: round(s.mcap * 0.012 * (100 - divergence) / 100 * 2) },
      historicalDivergence: genDates(8, 'quarter').map(q => ({ quarter: q, netIncome: round(s.mcap * 0.01 * rand(0.9, 1.1)), ocf: round(s.mcap * 0.012 * rand(0.7, 1.3)), divergence: round(rand(-20, 40)) })),
      workingCapitalDrivers: { receivables: round(rand(-10, 20)), inventory: round(rand(-15, 25)), payables: round(rand(-10, 15)), otherAccruals: round(rand(-5, 10)) },
      redFlags: divergence > 50 ? [{ flag: "High accruals", severity: divergence > 70 ? "critical" : "warning", description: "Cash not supporting earnings" }] : [],
      earningsQuality: divergence < 30 ? "High" : divergence < 50 ? "Moderate" : "Low"
    };
  },

  // RISK CARDS
  'risk-health-dashboard': (sym) => {
    const s = stocks[sym];
    const risk = s.profile === 'high-risk' ? 'High' : s.profile === 'defensive' ? 'Low' : s.profile === 'blue-chip' ? 'Low' : 'Moderate';
    return {
      symbol: sym, asOf: "2024-12-20",
      overallRisk: risk, riskScore: risk === 'High' ? randInt(60, 85) : risk === 'Low' ? randInt(15, 35) : randInt(35, 55),
      categories: {
        market: { score: randInt(20, 70), level: pick(["Low", "Moderate", "High"]), factors: [`Beta: ${rand(0.6, 1.5).toFixed(2)}`, `Volatility: ${randInt(15, 40)}%`, `Drawdown: -${randInt(10, 35)}%`] },
        financial: { score: s.debtEquity > 1 ? randInt(50, 80) : randInt(15, 40), level: s.debtEquity > 1 ? "Moderate" : "Low", factors: [`D/E: ${(s.debtEquity || 0.1).toFixed(2)}`, `ICR: ${randInt(5, 50)}x`, `Current: ${rand(1.2, 3).toFixed(1)}x`] },
        operational: { score: randInt(20, 55), level: "Low", factors: ["Client concentration", "Attrition manageable", "Margins stable"] },
        governance: { score: s.profile === 'high-risk' ? randInt(55, 80) : randInt(15, 35), level: s.profile === 'high-risk' ? "High" : "Low", factors: ["Board quality", "Disclosures", "Related party"] }
      },
      riskTrend: genDates(6, 'month').map(m => ({ month: m, score: randInt(25, 65) })),
      alerts: s.profile === 'high-risk' ? [{ type: "danger", message: "Elevated leverage and governance concerns" }] : []
    };
  },

  'drawdown-var': (sym) => {
    const s = stocks[sym];
    const vol = s.profile === 'high-risk' ? rand(40, 60) : s.profile === 'defensive' ? rand(12, 22) : rand(20, 35);
    return {
      symbol: sym, asOf: "2024-12-20",
      maxDrawdown: { value: round(vol * rand(1.2, 2)), startDate: "2024-03-15", endDate: "2024-06-20", recoveryDays: randInt(30, 120) },
      var: { daily95: round(s.price * vol / 100 * 1.65 / Math.sqrt(252)), daily99: round(s.price * vol / 100 * 2.33 / Math.sqrt(252)), monthly95: round(s.price * vol / 100 * 1.65 / Math.sqrt(12)) },
      volatility: { current: round(vol), historical: round(vol * rand(0.85, 1.15)), percentile: randInt(30, 80) },
      drawdownHistory: genDates(6, 'month').map((m, i) => ({ month: m, drawdown: round(rand(0, vol * 0.8)), cumulative: round(rand(-vol, 5)) })),
      stressScenarios: [
        { scenario: "Market Crash (-20%)", impact: round(-s.price * 0.22), probability: "Low" },
        { scenario: "Sector Decline (-15%)", impact: round(-s.price * 0.18), probability: "Medium" },
        { scenario: "Company Specific (-10%)", impact: round(-s.price * 0.12), probability: "Medium" }
      ]
    };
  },

  'financial-stress-radar': (sym) => {
    const s = stocks[sym];
    const stress = s.profile === 'high-risk' ? 'Elevated' : s.debtEquity > 1 ? 'Watch' : 'Safe';
    return {
      symbol: sym, asOf: "2024-12-20",
      stressScore: stress === 'Elevated' ? randInt(60, 85) : stress === 'Watch' ? randInt(40, 60) : randInt(15, 40),
      riskLevel: stress,
      indicators: {
        interestCoverage: { value: round(rand(2, 20)), status: rand(0, 1) > 0.3 ? "ok" : "warning" },
        currentRatio: { value: round(rand(1, 3), 1), status: rand(0, 1) > 0.2 ? "ok" : "warning" },
        quickRatio: { value: round(rand(0.8, 2.5), 1), status: rand(0, 1) > 0.3 ? "ok" : "warning" },
        cashBurn: { value: randInt(-5, 20), status: rand(0, 1) > 0.4 ? "ok" : "warning" },
        debtToEbitda: { value: round(rand(0.5, 5), 1), status: s.debtEquity > 1 ? "warning" : "ok" },
        workingCapital: { value: round(s.mcap * rand(0.01, 0.05)), status: "ok" }
      },
      radarData: ["Int Coverage", "Liquidity", "Cash Flow", "Leverage", "Working Cap", "Debt Service"].map(m => ({ metric: m, value: randInt(30, 95), max: 100 })),
      earlyWarnings: stress === 'Elevated' ? [{ signal: "Liquidity pressure", severity: "warning", trend: "worsening" }] : [],
      peerComparison: { company: randInt(30, 80), sectorMedian: randInt(40, 60) }
    };
  },

  'bankruptcy-health': (sym) => {
    const s = stocks[sym];
    const zScore = s.profile === 'high-risk' ? rand(1.2, 2.2) : s.profile === 'blue-chip' ? rand(4, 8) : rand(2.5, 5);
    return {
      symbol: sym, asOf: "2024-12-20",
      altmanZScore: round(zScore, 2),
      zone: zScore > 3 ? "Safe" : zScore > 1.8 ? "Grey" : "Distress",
      defaultProbability: zScore > 3 ? round(rand(0.1, 2)) : zScore > 1.8 ? round(rand(5, 20)) : round(rand(25, 50)),
      components: [
        { name: "Working Capital/TA", value: round(rand(0.05, 0.3), 2), weight: 1.2 },
        { name: "Retained Earnings/TA", value: round(rand(0.1, 0.5), 2), weight: 1.4 },
        { name: "EBIT/TA", value: round(rand(0.05, 0.2), 2), weight: 3.3 },
        { name: "Market Cap/TL", value: round(rand(0.5, 3), 2), weight: 0.6 },
        { name: "Sales/TA", value: round(rand(0.3, 1.5), 2), weight: 1.0 }
      ],
      historical: genDates(5, 'year').map(y => ({ year: y, zScore: round(zScore * rand(0.85, 1.15), 2) })),
      peerComparison: Object.keys(stocks).filter(x => stocks[x].sector === s.sector).slice(0, 4).map(x => ({ symbol: x, zScore: round(rand(2, 6), 2), zone: rand(0, 1) > 0.3 ? "Safe" : "Grey" }))
    };
  },

  'working-capital-health': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20",
      healthScore: randInt(55, 90),
      status: pick(["Healthy", "Adequate", "Tight"]),
      currentMetrics: { currentRatio: round(rand(1.2, 3), 2), quickRatio: round(rand(0.8, 2.5), 2), cashRatio: round(rand(0.3, 1.5), 2), workingCapital: round(s.mcap * rand(0.02, 0.08)), netWorkingCapitalDays: randInt(30, 90) },
      cashConversionCycle: { dso: randInt(30, 75), dio: randInt(25, 80), dpo: randInt(30, 70), ccc: randInt(20, 85), trend: pick(["Improving", "Stable", "Worsening"]) },
      historicalWC: genDates(6, 'quarter').map(q => ({ period: q, workingCapital: round(s.mcap * rand(0.02, 0.06)), currentRatio: round(rand(1.3, 2.5), 2) })),
      liquidityRunway: { months: randInt(6, 36), cashBurnRate: round(rand(50, 500)) }
    };
  },

  'leverage-history': (sym) => {
    const s = stocks[sym];
    const de = s.debtEquity || rand(0.1, 0.8);
    return {
      symbol: sym, asOf: "2024-12-20",
      leverageScore: de > 1.5 ? randInt(60, 85) : de > 0.5 ? randInt(35, 55) : randInt(15, 35),
      riskLevel: de > 1.5 ? "High" : de > 0.5 ? "Moderate" : "Low",
      currentMetrics: { debtToEquity: round(de, 2), debtToEbitda: round(de * 2.5, 1), interestCoverage: round(rand(3, 25), 1), netDebtToEbitda: round(de * 2, 1) },
      historicalLeverage: genDates(8, 'quarter').map(q => ({ period: q, debtToEquity: round(de * rand(0.85, 1.15), 2), interestCoverage: round(rand(4, 20), 1), totalDebt: round(s.mcap * de * rand(0.1, 0.2)) })),
      debtBreakdown: { shortTerm: randInt(15, 40), longTerm: 100 - randInt(15, 40), secured: randInt(40, 70), unsecured: 100 - randInt(40, 70) },
      covenants: { status: de > 2 ? "Near Breach" : "Compliant", headroom: round(rand(15, 50)), details: "Debt/EBITDA covenant" },
      maturitySchedule: ["FY25", "FY26", "FY27", "FY28", "FY29"].map(y => ({ year: y, amount: round(s.mcap * de * 0.02 * rand(0.5, 2)) }))
    };
  },

  'cashflow-stability-index': (sym) => {
    const s = stocks[sym];
    const stability = s.profile === 'defensive' ? randInt(75, 95) : s.profile === 'high-risk' ? randInt(30, 55) : randInt(55, 80);
    return {
      symbol: sym, asOf: "2024-12-20",
      stabilityIndex: stability,
      grade: stability >= 75 ? "A" : stability >= 60 ? "B" : stability >= 45 ? "C" : "D",
      metrics: { ocfVolatility: round(rand(15, 45)), fcfVolatility: round(rand(20, 55)), ocfPositiveYears: randInt(4, 10), totalYears: 10, coefficientOfVariation: round(rand(0.15, 0.5), 2) },
      historicalCashflow: genDates(8, 'quarter').map(q => ({ period: q, ocf: round(s.mcap * 0.012 * rand(0.7, 1.3)), fcf: round(s.mcap * 0.008 * rand(0.5, 1.5)), capex: round(s.mcap * 0.004 * rand(0.8, 1.2)) })),
      consistency: { streakYears: randInt(3, 10), averageOCF: round(s.mcap * 0.012), trend: pick(["Growing", "Stable", "Declining"]) },
      qualityIndicators: { ocfToNetIncome: round(rand(75, 130)), fcfToOcf: round(rand(40, 80)), capexIntensity: round(rand(15, 45)) }
    };
  },

  // Add more generators for remaining cards...
  'dividend-crystal-ball': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20",
      currentDPS: round(s.price * s.divYield / 100, 2),
      dividendYield: s.divYield, payoutRatio: round(rand(25, 70)),
      sustainability: s.divYield > 2 ? "High" : "Moderate",
      projections: Array.from({length: 5}, (_, i) => ({
        year: 2025 + i, dps: round(s.price * s.divYield / 100 * Math.pow(1.08, i + 1), 2),
        yield: round(s.divYield * rand(0.95, 1.1), 2), payout: round(rand(30, 60))
      })),
      history: genDates(5, 'year').map((y, i) => ({ year: y, dps: round(s.price * s.divYield / 100 * Math.pow(0.92, 4 - i), 2), special: 0 })),
      coverage: { earningsCoverage: round(rand(1.5, 4), 1), fcfCoverage: round(rand(1.3, 3.5), 1), cashBalance: round(s.mcap * rand(0.02, 0.06)) },
      streaks: { consecutiveYears: randInt(5, 20), growthYears: randInt(3, 12), noCutYears: randInt(8, 25) }
    };
  },

  'technical-indicators': (sym) => {
    const s = stocks[sym];
    const rsi = rand(25, 75);
    return {
      symbol: sym, asOf: "2024-12-20",
      overallSignal: rsi > 60 ? "Buy" : rsi < 40 ? "Sell" : "Neutral",
      score: randInt(30, 85),
      indicators: {
        rsi: { value: round(rsi), signal: rsi > 70 ? "Overbought" : rsi < 30 ? "Oversold" : "Neutral" },
        macd: { value: round(rand(-5, 5)), signal: pick(["Bullish", "Bearish"]), histogram: round(rand(-2, 2)) },
        stochastic: { k: round(rand(20, 80)), d: round(rand(20, 80)), signal: pick(["Buy", "Sell", "Neutral"]) },
        adx: { value: round(rand(15, 45)), signal: rand(0, 1) > 0.5 ? "Trending" : "Ranging" },
        cci: { value: round(rand(-150, 150)), signal: pick(["Overbought", "Oversold", "Neutral"]) },
        williamsR: { value: round(rand(-90, -10)), signal: pick(["Buy", "Sell", "Neutral"]) }
      },
      movingAverages: {
        sma20: { value: round(s.price * rand(0.95, 1.05)), signal: pick(["Buy", "Sell"]) },
        sma50: { value: round(s.price * rand(0.9, 1.1)), signal: pick(["Buy", "Sell"]) },
        sma200: { value: round(s.price * rand(0.85, 1.15)), signal: pick(["Buy", "Sell"]) },
        ema20: { value: round(s.price * rand(0.96, 1.04)), signal: pick(["Buy", "Sell"]) }
      },
      summary: { bullish: randInt(4, 9), bearish: randInt(2, 6), neutral: randInt(1, 4) }
    };
  },

  'shareholding-pattern': (sym) => {
    const s = stocks[sym];
    const promoter = s.sector === 'Banking' && sym !== 'SBIN' ? 0 : rand(25, 75);
    return {
      symbol: sym, asOf: "2024-12-20",
      current: { promoter: round(promoter), promoterPledge: s.profile === 'high-risk' ? round(rand(2, 15)) : 0, fii: round(rand(10, 45)), dii: round(rand(10, 40)), public: round(100 - promoter - rand(20, 50)) },
      changes: { promoter: 0, fii: round(rand(-1.5, 1.5), 2), dii: round(rand(-1, 1), 2), public: round(rand(-0.5, 0.5), 2) },
      historical: genDates(5, 'quarter').map(q => ({ quarter: q, promoter: round(promoter), fii: round(rand(15, 40)), dii: round(rand(15, 35)) })),
      topHolders: [
        { name: "LIC of India", holding: round(rand(2, 8), 2), change: round(rand(-0.2, 0.3), 2) },
        { name: "SBI Mutual Fund", holding: round(rand(1, 5), 2), change: round(rand(-0.1, 0.2), 2) },
        { name: "HDFC Mutual Fund", holding: round(rand(1, 4), 2), change: round(rand(-0.1, 0.15), 2) }
      ],
      signals: [{ signal: "Institutional holding stable", type: "neutral", description: "No major changes" }]
    };
  },

  'candlestick-hero': (sym) => {
    const s = stocks[sym];
    const ohlcv = [];
    let price = s.price * 0.9;
    for (let i = 0; i < 90; i++) {
      const open = price;
      const change = rand(-0.025, 0.025);
      const close = open * (1 + change);
      const high = Math.max(open, close) * (1 + rand(0, 0.012));
      const low = Math.min(open, close) * (1 - rand(0, 0.012));
      ohlcv.push({
        date: new Date(Date.now() - (90 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        open: round(open), high: round(high), low: round(low), close: round(close),
        volume: Math.round(s.mcap * rand(0.001, 0.003))
      });
      price = close;
    }
    return {
      symbol: sym, asOf: "2024-12-20", currentPrice: s.price,
      change: round(rand(-50, 50)), changePercent: round(rand(-2, 2)),
      ohlcv, patterns: [{ name: pick(["Hammer", "Doji", "Engulfing"]), date: ohlcv[ohlcv.length - randInt(1, 5)].date, signal: pick(["Bullish", "Bearish"]) }],
      supports: [round(s.price * 0.95), round(s.price * 0.9)],
      resistances: [round(s.price * 1.05), round(s.price * 1.1)]
    };
  },

  // Portfolio cards
  'peer-comparison': (sym) => {
    const s = stocks[sym];
    const peers = Object.keys(stocks).filter(x => stocks[x].sector === s.sector);
    return {
      symbol: sym, asOf: "2024-12-20",
      rank: { overall: randInt(1, peers.length), total: peers.length, percentile: randInt(40, 95) },
      peers: peers.map(p => ({ symbol: p, name: stocks[p].name, mcap: stocks[p].mcap, pe: stocks[p].pe, roe: stocks[p].roe, growth: stocks[p].profitGrowth, score: randInt(50, 90) })),
      companyMetrics: { pe: s.pe, pb: s.pb, roe: s.roe, growth: s.profitGrowth, margin: s.margin, debtEquity: s.debtEquity || 0.1 },
      radarData: ["Valuation", "Growth", "Profitability", "Quality", "Momentum"].map(m => ({ metric: m, company: randInt(40, 90), peerAvg: randInt(50, 70) })),
      strengths: ["Strong brand", "High margins", "Low debt"],
      weaknesses: ["Slower growth", "High valuation"]
    };
  },

  'portfolio-correlation': () => {
    const holdings = Object.keys(stocks).slice(0, 10);
    const matrix = [];
    for (let i = 0; i < Math.min(8, holdings.length); i++) {
      for (let j = i + 1; j < Math.min(8, holdings.length); j++) {
        matrix.push({ symbol1: holdings[i], symbol2: holdings[j], correlation: round(rand(-0.2, 0.9), 2) });
      }
    }
    return {
      asOf: "2024-12-20",
      diversificationScore: randInt(55, 85),
      avgCorrelation: round(rand(0.3, 0.6), 2),
      correlationMatrix: matrix.slice(0, 8),
      holdings: holdings.map(h => ({ symbol: h, weight: round(100 / holdings.length) })),
      clusters: [
        { name: "IT Services", holdings: ["TCS", "INFY", "LTIM"], intraCorr: round(rand(0.6, 0.85), 2) },
        { name: "Banking", holdings: ["HDFCBANK", "ICICIBANK", "SBIN"], intraCorr: round(rand(0.5, 0.75), 2) }
      ],
      recommendations: ["Consider adding uncorrelated assets", "Reduce IT concentration"]
    };
  },

  'portfolio-leaderboard': () => {
    const holdings = Object.keys(stocks).slice(0, 10);
    const returns = holdings.map(s => ({ symbol: s, return: round(rand(-15, 35)), contribution: round(rand(-2, 5)), weight: round(100 / holdings.length) })).sort((a, b) => b.return - a.return);
    const portfolioReturn = round(returns.reduce((sum, h) => sum + h.contribution, 0));
    return {
      asOf: "2024-12-20", portfolioReturn, benchmarkReturn: round(rand(8, 18)),
      alpha: round(portfolioReturn - rand(8, 18)),
      rankings: returns,
      topPerformers: returns.slice(0, 3).map(r => ({ symbol: r.symbol, return: r.return })),
      bottomPerformers: returns.slice(-3).map(r => ({ symbol: r.symbol, return: r.return })),
      attribution: { stockSelection: round(rand(-2, 5)), sectorAllocation: round(rand(-1, 3)), timing: round(rand(-1, 2)) }
    };
  },

  'options-interest': (sym) => {
    const s = stocks[sym];
    const pcr = rand(0.6, 1.5);
    return {
      symbol: sym, asOf: "2024-12-20",
      sentiment: pcr > 1.2 ? "Bearish" : pcr < 0.8 ? "Bullish" : "Neutral",
      pcr: { value: round(pcr, 2), change: round(rand(-0.15, 0.15), 2) },
      maxPain: Math.round(s.price / 50) * 50,
      currentPrice: s.price,
      openInterest: { calls: randInt(5000000, 20000000), puts: Math.round(randInt(5000000, 20000000) * pcr), total: randInt(10000000, 35000000) },
      topStrikes: Array.from({length: 5}, (_, i) => ({
        strike: Math.round(s.price * (0.95 + i * 0.025) / 10) * 10,
        callOI: randInt(100000, 2000000), putOI: randInt(100000, 2000000),
        type: i < 2 ? "put" : i > 3 ? "call" : "balanced"
      })),
      unusualActivity: rand(0, 1) > 0.6 ? [{ strike: `${Math.round(s.price * rand(0.95, 1.05))} CE`, type: "Call", volume: randInt(50000, 200000), signal: "Bullish bet" }] : []
    };
  },

  // ==================== REMAINING CARDS ====================

  // CASHFLOW CARDS
  'fcf-health': (sym) => {
    const s = stocks[sym];
    const fcfYield = s.profile === 'high-risk' ? rand(-2, 3) : rand(2, 8);
    return {
      symbol: sym, asOf: "2024-12-20",
      healthScore: fcfYield > 4 ? randInt(75, 95) : fcfYield > 0 ? randInt(50, 74) : randInt(20, 49),
      grade: fcfYield > 4 ? "Strong" : fcfYield > 0 ? "Moderate" : "Weak",
      currentMetrics: {
        fcf: round(s.mcap * fcfYield / 100),
        fcfYield: round(fcfYield, 2),
        fcfMargin: round(rand(5, 20)),
        fcfGrowth: round(rand(-10, 25)),
        fcfPerShare: round(s.price * fcfYield / 100 / s.pe, 2)
      },
      components: {
        operatingCashFlow: round(s.mcap * 0.08 * rand(0.8, 1.2)),
        capex: round(s.mcap * 0.03 * rand(0.7, 1.3)),
        workingCapitalChange: round(s.mcap * 0.01 * rand(-1, 1))
      },
      historical: genDates(8, 'quarter').map(q => ({
        period: q,
        fcf: round(s.mcap * fcfYield / 100 * rand(0.7, 1.3)),
        ocf: round(s.mcap * 0.08 * rand(0.8, 1.2)),
        capex: round(s.mcap * 0.03 * rand(0.7, 1.3))
      })),
      conversion: { ocfToFcf: round(rand(50, 85)), netIncomeToFcf: round(rand(70, 130)) },
      peerComparison: Object.keys(stocks).filter(x => stocks[x].sector === s.sector).slice(0, 4).map(x => ({
        symbol: x, fcfYield: round(rand(1, 8), 2), fcfMargin: round(rand(5, 20))
      }))
    };
  },

  'cash-conversion-cycle': (sym) => {
    const s = stocks[sym];
    const ccc = s.sector === 'Banking' ? randInt(-10, 20) : randInt(30, 120);
    return {
      symbol: sym, asOf: "2024-12-20",
      ccc: ccc,
      trend: pick(["Improving", "Stable", "Worsening"]),
      efficiency: ccc < 45 ? "Excellent" : ccc < 75 ? "Good" : ccc < 100 ? "Average" : "Poor",
      components: {
        dso: { value: randInt(25, 75), trend: pick(["up", "down", "stable"]), benchmark: randInt(35, 55) },
        dio: { value: randInt(20, 90), trend: pick(["up", "down", "stable"]), benchmark: randInt(40, 60) },
        dpo: { value: randInt(25, 70), trend: pick(["up", "down", "stable"]), benchmark: randInt(35, 50) }
      },
      historical: genDates(8, 'quarter').map(q => ({
        period: q, ccc: randInt(ccc - 15, ccc + 15), dso: randInt(30, 65), dio: randInt(25, 80), dpo: randInt(30, 60)
      })),
      waterfall: [
        { stage: "Inventory Days", value: randInt(25, 80) },
        { stage: "+ Receivable Days", value: randInt(30, 70) },
        { stage: "- Payable Days", value: -randInt(25, 60) },
        { stage: "= Cash Cycle", value: ccc }
      ],
      industryBenchmark: { average: randInt(ccc - 20, ccc + 20), best: randInt(20, 45), worst: randInt(100, 150) }
    };
  },

  'cash-conversion-earnings': (sym) => {
    const s = stocks[sym];
    const ratio = s.profile === 'high-risk' ? rand(50, 85) : rand(85, 130);
    return {
      symbol: sym, asOf: "2024-12-20",
      conversionRatio: round(ratio),
      quality: ratio > 100 ? "High" : ratio > 75 ? "Moderate" : "Low",
      metrics: {
        netIncome: round(s.mcap / s.pe),
        operatingCashFlow: round(s.mcap / s.pe * ratio / 100),
        fcf: round(s.mcap / s.pe * ratio / 100 * 0.7),
        accruals: round(s.mcap / s.pe * (1 - ratio / 100))
      },
      historical: genDates(8, 'quarter').map(q => ({
        period: q,
        netIncome: round(s.mcap / s.pe / 4 * rand(0.85, 1.15)),
        ocf: round(s.mcap / s.pe / 4 * ratio / 100 * rand(0.8, 1.2)),
        ratio: round(ratio * rand(0.85, 1.15))
      })),
      accrualBreakdown: {
        receivablesChange: round(rand(-500, 500)),
        inventoryChange: round(rand(-300, 400)),
        payablesChange: round(rand(-400, 500)),
        otherAccruals: round(rand(-200, 300))
      },
      redFlags: ratio < 70 ? [{ flag: "Low cash conversion", severity: "warning", description: "Earnings not converting to cash" }] : []
    };
  },

  // INCOME CARDS
  'dividend-sip-tracker': (sym) => {
    const s = stocks[sym];
    const monthlyInvest = 10000;
    return {
      symbol: sym, asOf: "2024-12-20",
      sipDetails: { monthlyAmount: monthlyInvest, startDate: "2020-01-01", tenure: "5 years" },
      totalInvested: monthlyInvest * 60,
      currentValue: round(monthlyInvest * 60 * rand(1.3, 2.2)),
      totalDividends: round(monthlyInvest * 60 * s.divYield / 100 * 2.5),
      returns: {
        absolute: round(rand(40, 120)),
        cagr: round(rand(12, 28)),
        dividendYieldOnCost: round(s.divYield * rand(1.5, 2.5), 2)
      },
      monthlyDividendHistory: genDates(12, 'month').map((m, i) => ({
        month: m, amount: round(monthlyInvest * (12 + i) * s.divYield / 100 / 12 * rand(0.8, 1.2))
      })),
      projections: Array.from({length: 5}, (_, i) => ({
        year: 2025 + i,
        estimatedDividend: round(monthlyInvest * (60 + 12 * (i + 1)) * s.divYield / 100 * Math.pow(1.08, i + 1)),
        yieldOnCost: round(s.divYield * Math.pow(1.08, i + 1), 2)
      })),
      reinvestmentImpact: { withReinvest: round(monthlyInvest * 60 * rand(1.8, 2.8)), withoutReinvest: round(monthlyInvest * 60 * rand(1.4, 2.0)) }
    };
  },

  'income-stability': (sym) => {
    const s = stocks[sym];
    const stability = s.divYield > 2 ? randInt(70, 95) : s.divYield > 1 ? randInt(50, 75) : randInt(25, 55);
    return {
      symbol: sym, asOf: "2024-12-20",
      stabilityScore: stability,
      grade: stability > 75 ? "A" : stability > 60 ? "B" : stability > 45 ? "C" : "D",
      metrics: {
        dividendYield: s.divYield,
        payoutRatio: round(rand(25, 70)),
        dividendGrowth5Y: round(rand(5, 15)),
        consecutiveYears: randInt(5, 25),
        coverageRatio: round(rand(1.5, 4), 1)
      },
      streaks: { noCutYears: randInt(10, 30), growthYears: randInt(5, 15), specialDividends: randInt(0, 5) },
      historical: genDates(5, 'year').map((y, i) => ({
        year: y,
        dps: round(s.price * s.divYield / 100 * Math.pow(0.92, 4 - i), 2),
        yield: round(s.divYield * rand(0.9, 1.1), 2),
        payout: round(rand(30, 60))
      })),
      sustainability: {
        earningsCoverage: round(rand(1.5, 4), 1),
        fcfCoverage: round(rand(1.2, 3.5), 1),
        debtServiceRatio: round(rand(2, 8), 1)
      },
      riskFactors: s.divYield > 4 ? [{ factor: "High yield may be unsustainable", severity: "watch" }] : []
    };
  },

  // MACRO CARDS
  'institutional-flows': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20",
      netFlow: round(rand(-500, 800)),
      sentiment: rand(0, 1) > 0.5 ? "Bullish" : rand(0, 1) > 0.5 ? "Neutral" : "Bearish",
      flows: {
        fii: { current: round(rand(15, 45)), change: round(rand(-2, 2), 2), netBuySell: round(rand(-300, 400)) },
        dii: { current: round(rand(15, 40)), change: round(rand(-1.5, 1.5), 2), netBuySell: round(rand(-200, 300)) },
        mf: { current: round(rand(8, 25)), change: round(rand(-1, 1), 2), netBuySell: round(rand(-150, 200)) }
      },
      historical: genDates(12, 'month').map(m => ({
        month: m, fiiNet: round(rand(-200, 300)), diiNet: round(rand(-150, 200)), mfNet: round(rand(-100, 150))
      })),
      topBuyers: [
        { name: "LIC of India", change: round(rand(0.1, 0.5), 2), value: round(rand(100, 500)) },
        { name: "SBI MF", change: round(rand(0.05, 0.3), 2), value: round(rand(50, 300)) },
        { name: "HDFC MF", change: round(rand(0.05, 0.25), 2), value: round(rand(50, 250)) }
      ],
      topSellers: [
        { name: "Goldman Sachs", change: round(rand(-0.3, -0.1), 2), value: round(rand(-300, -50)) },
        { name: "Morgan Stanley", change: round(rand(-0.25, -0.05), 2), value: round(rand(-200, -30)) }
      ],
      signals: [{ signal: rand(0, 1) > 0.5 ? "FII accumulation" : "DII buying pressure", type: "info" }]
    };
  },

  'insider-trades': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20",
      sentiment: pick(["Bullish", "Neutral", "Bearish"]),
      summary: { netValue: round(rand(-100, 200)), buyCount: randInt(2, 15), sellCount: randInt(1, 10), totalTransactions: randInt(5, 25) },
      recentTrades: Array.from({length: randInt(5, 12)}, () => ({
        date: `2024-${randInt(10, 12)}-${String(randInt(1, 28)).padStart(2, '0')}`,
        insider: pick(["CEO", "CFO", "Director", "Promoter", "VP", "Company Secretary"]),
        type: pick(["Buy", "Sell"]),
        shares: randInt(1000, 100000),
        value: round(rand(5, 200)),
        pricePerShare: round(s.price * rand(0.95, 1.05))
      })),
      insiderHoldings: [
        { name: "Promoter Group", holding: round(rand(30, 70), 2), change3M: round(rand(-0.5, 0.5), 2) },
        { name: "Key Management", holding: round(rand(0.5, 3), 2), change3M: round(rand(-0.1, 0.2), 2) }
      ],
      historicalPattern: genDates(6, 'month').map(m => ({ month: m, netBuys: randInt(-5, 10), netValue: round(rand(-50, 100)) })),
      alerts: rand(0, 1) > 0.7 ? [{ type: "info", message: "Significant insider buying detected" }] : []
    };
  },

  'macro-calendar': () => {
    const events = [
      { type: "RBI Policy", impact: "High" },
      { type: "GDP Data", impact: "High" },
      { type: "Inflation", impact: "Medium" },
      { type: "PMI Data", impact: "Medium" },
      { type: "Trade Balance", impact: "Low" },
      { type: "Industrial Production", impact: "Medium" },
      { type: "Fed Decision", impact: "High" },
      { type: "Jobs Report", impact: "High" }
    ];
    return {
      asOf: "2024-12-20",
      upcomingEvents: Array.from({length: 15}, (_, i) => {
        const event = pick(events);
        return {
          date: `2024-12-${String(20 + Math.floor(i / 2)).padStart(2, '0')}`,
          event: event.type,
          country: pick(["India", "US", "Global"]),
          impact: event.impact,
          previous: `${rand(1, 8).toFixed(1)}%`,
          forecast: `${rand(1, 8).toFixed(1)}%`,
          actual: i < 3 ? `${rand(1, 8).toFixed(1)}%` : null
        };
      }),
      thisWeek: { highImpact: randInt(2, 5), mediumImpact: randInt(3, 8), lowImpact: randInt(2, 6) },
      marketSensitivity: { rbiPolicy: "High", fedDecision: "High", inflation: "Medium", gdp: "Medium" }
    };
  },

  'macro-pulse': () => {
    return {
      asOf: "2024-12-20",
      overallSentiment: pick(["Risk-On", "Neutral", "Risk-Off"]),
      indicators: {
        gdpGrowth: { value: round(rand(5.5, 7.5), 1), trend: pick(["up", "stable", "down"]), outlook: "Positive" },
        inflation: { value: round(rand(4, 6.5), 1), trend: pick(["up", "stable", "down"]), outlook: pick(["Stable", "Concerning"]) },
        interestRate: { value: round(rand(6, 7), 2), trend: "stable", outlook: "Neutral" },
        unemployment: { value: round(rand(6, 9), 1), trend: pick(["up", "stable", "down"]), outlook: pick(["Stable", "Improving"]) },
        pmi: { value: round(rand(52, 58), 1), trend: pick(["up", "stable"]), outlook: "Expansionary" },
        iip: { value: round(rand(3, 8), 1), trend: pick(["up", "stable", "down"]), outlook: pick(["Positive", "Moderate"]) }
      },
      globalFactors: {
        dollarIndex: { value: round(rand(102, 108), 2), impact: pick(["Positive", "Neutral", "Negative"]) },
        crudeOil: { value: round(rand(70, 90)), impact: pick(["Positive", "Neutral", "Negative"]) },
        usYield10Y: { value: round(rand(4, 5), 2), impact: pick(["Neutral", "Negative"]) }
      },
      sectorImpact: [
        { sector: "Banking", impact: "Positive", reason: "Stable rates support NIMs" },
        { sector: "IT", impact: "Neutral", reason: "Rupee depreciation helps" },
        { sector: "Auto", impact: "Positive", reason: "Demand recovery" },
        { sector: "FMCG", impact: "Neutral", reason: "Rural recovery slow" }
      ]
    };
  },

  'earnings-calendar': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20",
      nextEarnings: { date: "2025-01-15", time: "After Market", daysAway: 26 },
      consensus: {
        epsEstimate: round(s.price / s.pe * 0.27, 2),
        revenueEstimate: round(s.mcap * 0.05),
        numberOfAnalysts: randInt(15, 35)
      },
      historical: genDates(8, 'quarter').map((q, i) => ({
        quarter: q,
        date: `2024-${String(3 * (i % 4) + 1).padStart(2, '0')}-15`,
        epsActual: round(s.price / s.pe * 0.25 * rand(0.9, 1.1), 2),
        epsEstimate: round(s.price / s.pe * 0.25, 2),
        surprise: round(rand(-5, 10)),
        reaction: round(rand(-5, 8))
      })),
      upcomingInSector: Object.keys(stocks).filter(x => stocks[x].sector === s.sector).slice(0, 5).map(x => ({
        symbol: x, date: `2025-01-${randInt(10, 25)}`, daysAway: randInt(20, 35)
      })),
      guidance: { provided: rand(0, 1) > 0.3, outlook: pick(["Positive", "Stable", "Cautious"]) }
    };
  },

  'earnings-surprise': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20",
      lastSurprise: { value: round(rand(-5, 15)), direction: rand(0, 1) > 0.3 ? "Beat" : "Miss" },
      beatRate: { "1Y": randInt(50, 100), "3Y": randInt(60, 90), "5Y": randInt(55, 85) },
      history: genDates(12, 'quarter').map(q => ({
        quarter: q,
        epsActual: round(s.price / s.pe * 0.25 * rand(0.9, 1.15), 2),
        epsEstimate: round(s.price / s.pe * 0.25, 2),
        surprise: round(rand(-8, 15)),
        priceReaction: round(rand(-6, 10)),
        volumeReaction: round(rand(80, 250))
      })),
      analystRevisions: { upgrades: randInt(2, 10), downgrades: randInt(1, 6), net: randInt(-3, 8) },
      surpriseCorrelation: { withPrice: round(rand(0.4, 0.8), 2), avgPriceMove: round(rand(2, 6)) },
      upcoming: { daysToEarnings: randInt(20, 60), estimatedEPS: round(s.price / s.pe * 0.26, 2), whisperNumber: round(s.price / s.pe * 0.27, 2) }
    };
  },

  // TECHNICAL CARDS
  'pattern-matcher': (sym) => {
    const s = stocks[sym];
    const patterns = ["Head & Shoulders", "Double Top", "Double Bottom", "Triangle", "Flag", "Cup & Handle", "Wedge", "Channel"];
    return {
      symbol: sym, asOf: "2024-12-20", currentPrice: s.price,
      detectedPatterns: Array.from({length: randInt(1, 4)}, () => ({
        pattern: pick(patterns),
        type: pick(["Bullish", "Bearish", "Neutral"]),
        reliability: randInt(60, 90),
        priceTarget: round(s.price * rand(0.9, 1.15)),
        stopLoss: round(s.price * rand(0.92, 0.98)),
        timeframe: pick(["Daily", "Weekly", "4H"]),
        status: pick(["Forming", "Confirmed", "Breakout"])
      })),
      supportResistance: {
        supports: [round(s.price * 0.95), round(s.price * 0.9), round(s.price * 0.85)],
        resistances: [round(s.price * 1.05), round(s.price * 1.1), round(s.price * 1.15)]
      },
      historicalPatterns: Array.from({length: 5}, () => ({
        pattern: pick(patterns),
        date: `2024-${randInt(6, 11)}-${randInt(1, 28)}`,
        outcome: pick(["Success", "Failure"]),
        return: round(rand(-8, 15))
      })),
      patternStrength: randInt(55, 90)
    };
  },

  'trend-strength': (sym) => {
    const s = stocks[sym];
    const adx = rand(15, 50);
    return {
      symbol: sym, asOf: "2024-12-20", currentPrice: s.price,
      trendStrength: round(adx),
      trendDirection: adx > 25 ? (rand(0, 1) > 0.5 ? "Strong Uptrend" : "Strong Downtrend") : "Ranging",
      indicators: {
        adx: { value: round(adx), plusDI: round(rand(15, 40)), minusDI: round(rand(15, 40)) },
        aroon: { up: randInt(40, 100), down: randInt(0, 60), oscillator: randInt(-50, 50) },
        supertrend: { value: round(s.price * rand(0.95, 1.05)), signal: pick(["Buy", "Sell"]) },
        parabolicSar: { value: round(s.price * rand(0.96, 1.04)), signal: pick(["Bullish", "Bearish"]) }
      },
      movingAverages: {
        ma20: { price: round(s.price * rand(0.97, 1.03)), slope: round(rand(-2, 2), 2) },
        ma50: { price: round(s.price * rand(0.94, 1.06)), slope: round(rand(-1.5, 1.5), 2) },
        ma200: { price: round(s.price * rand(0.88, 1.12)), slope: round(rand(-1, 1), 2) }
      },
      trendHistory: genDates(30, 'day').map((_, i) => ({ day: i + 1, adx: round(adx + rand(-10, 10)), plusDI: round(rand(15, 40)), minusDI: round(rand(15, 40)) }))
    };
  },

  'momentum-heatmap': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20",
      overallMomentum: pick(["Strong Bullish", "Bullish", "Neutral", "Bearish", "Strong Bearish"]),
      score: randInt(20, 90),
      timeframes: {
        "1D": { momentum: randInt(-100, 100), rsi: round(rand(25, 75)), macd: pick(["Bullish", "Bearish"]) },
        "1W": { momentum: randInt(-100, 100), rsi: round(rand(30, 70)), macd: pick(["Bullish", "Bearish"]) },
        "1M": { momentum: randInt(-100, 100), rsi: round(rand(35, 65)), macd: pick(["Bullish", "Bearish"]) },
        "3M": { momentum: randInt(-100, 100), rsi: round(rand(35, 65)), macd: pick(["Bullish", "Bearish"]) },
        "6M": { momentum: randInt(-100, 100), rsi: round(rand(40, 60)), macd: pick(["Bullish", "Bearish"]) },
        "1Y": { momentum: randInt(-100, 100), rsi: round(rand(40, 60)), macd: pick(["Bullish", "Bearish"]) }
      },
      sectorComparison: Object.keys(stocks).filter(x => stocks[x].sector === s.sector).map(x => ({
        symbol: x, momentum1M: randInt(-50, 50), momentum3M: randInt(-40, 60)
      })),
      heatmapData: ["1D", "1W", "1M", "3M", "6M", "1Y"].map(tf => ({
        timeframe: tf, value: randInt(-100, 100), color: pick(["green", "lightgreen", "gray", "orange", "red"])
      }))
    };
  },

  'volatility-regime': (sym) => {
    const s = stocks[sym];
    const vol = s.profile === 'high-risk' ? rand(35, 55) : s.profile === 'defensive' ? rand(12, 22) : rand(18, 32);
    return {
      symbol: sym, asOf: "2024-12-20",
      currentVolatility: round(vol),
      regime: vol > 35 ? "High Volatility" : vol > 22 ? "Normal" : "Low Volatility",
      percentile: randInt(20, 80),
      metrics: {
        historicalVol30D: round(vol),
        historicalVol90D: round(vol * rand(0.9, 1.1)),
        impliedVol: round(vol * rand(1.05, 1.25)),
        ivRank: randInt(15, 85),
        ivPercentile: randInt(20, 80)
      },
      volHistory: genDates(12, 'month').map(m => ({ month: m, realized: round(vol * rand(0.7, 1.3)), implied: round(vol * rand(0.8, 1.4)) })),
      regimeHistory: [
        { period: "Last 1M", regime: pick(["Low", "Normal", "High"]), avgVol: round(vol * rand(0.9, 1.1)) },
        { period: "Last 3M", regime: pick(["Low", "Normal", "High"]), avgVol: round(vol * rand(0.85, 1.15)) },
        { period: "Last 1Y", regime: pick(["Low", "Normal"]), avgVol: round(vol * rand(0.8, 1.2)) }
      ],
      volCone: { min: round(vol * 0.5), q25: round(vol * 0.75), median: round(vol), q75: round(vol * 1.25), max: round(vol * 1.8) }
    };
  },

  'seasonality-pattern': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20",
      currentMonth: "December",
      historicalReturn: round(rand(-5, 12)),
      winRate: randInt(45, 75),
      monthlySeasonality: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => ({
        month: m, avgReturn: round(rand(-4, 6)), winRate: randInt(35, 70), volatility: round(rand(15, 35))
      })),
      quarterlyPattern: ["Q1", "Q2", "Q3", "Q4"].map(q => ({
        quarter: q, avgReturn: round(rand(-2, 10)), winRate: randInt(45, 70)
      })),
      eventSeasonality: [
        { event: "Budget", avgReturn: round(rand(-3, 5)), typical: pick(["Bullish", "Volatile", "Neutral"]) },
        { event: "Diwali", avgReturn: round(rand(0, 6)), typical: "Bullish" },
        { event: "Q4 Results", avgReturn: round(rand(-2, 4)), typical: "Volatile" }
      ],
      bestMonths: ["Mar", "Nov", "Dec"].slice(0, 2),
      worstMonths: ["May", "Sep"].slice(0, 2)
    };
  },

  'market-regime-radar': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20",
      currentRegime: pick(["Bull Market", "Bear Market", "Sideways", "High Volatility", "Recovery"]),
      regimeScore: randInt(30, 85),
      indicators: {
        trend: { value: randInt(-100, 100), signal: pick(["Bullish", "Bearish", "Neutral"]) },
        momentum: { value: randInt(-100, 100), signal: pick(["Bullish", "Bearish", "Neutral"]) },
        volatility: { value: randInt(15, 45), signal: pick(["Low", "Normal", "High"]) },
        breadth: { value: randInt(30, 70), signal: pick(["Strong", "Weak", "Neutral"]) },
        sentiment: { value: randInt(20, 80), signal: pick(["Greedy", "Fearful", "Neutral"]) }
      },
      radarData: ["Trend", "Momentum", "Volatility", "Breadth", "Sentiment", "Volume"].map(m => ({
        metric: m, value: randInt(20, 90), benchmark: 50
      })),
      regimeHistory: genDates(6, 'month').map(m => ({
        month: m, regime: pick(["Bull", "Bear", "Sideways"]), score: randInt(30, 80)
      })),
      recommendations: [
        pick(["Stay invested", "Reduce exposure", "Accumulate on dips", "Book partial profits"])
      ]
    };
  },

  'price-structure': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20", currentPrice: s.price,
      structure: pick(["Higher Highs", "Lower Lows", "Range Bound", "Breakout", "Breakdown"]),
      levels: {
        pivot: round(s.price),
        r1: round(s.price * 1.02), r2: round(s.price * 1.04), r3: round(s.price * 1.06),
        s1: round(s.price * 0.98), s2: round(s.price * 0.96), s3: round(s.price * 0.94)
      },
      fibonacciLevels: {
        high52W: round(s.price * 1.25), low52W: round(s.price * 0.75),
        fib236: round(s.price * 0.88), fib382: round(s.price * 0.94),
        fib50: round(s.price), fib618: round(s.price * 1.06), fib786: round(s.price * 1.12)
      },
      gapAnalysis: Array.from({length: randInt(2, 5)}, () => ({
        type: pick(["Gap Up", "Gap Down"]),
        date: `2024-${randInt(10, 12)}-${randInt(1, 28)}`,
        size: round(rand(1, 4)),
        filled: pick([true, false])
      })),
      volumeProfile: { poc: round(s.price * rand(0.97, 1.03)), valueAreaHigh: round(s.price * 1.03), valueAreaLow: round(s.price * 0.97) }
    };
  },

  'delivery-analysis': (sym) => {
    const s = stocks[sym];
    const deliveryPct = rand(30, 75);
    return {
      symbol: sym, asOf: "2024-12-20", currentPrice: s.price,
      deliveryPercentage: round(deliveryPct),
      signal: deliveryPct > 55 ? "Strong Buying" : deliveryPct < 40 ? "Speculative" : "Normal",
      metrics: {
        avgDelivery30D: round(deliveryPct * rand(0.9, 1.1)),
        avgDelivery90D: round(deliveryPct * rand(0.85, 1.15)),
        volumeToday: randInt(1000000, 10000000),
        avgVolume: randInt(800000, 8000000)
      },
      deliveryTrend: genDates(20, 'day').map((_, i) => ({
        day: i + 1,
        delivery: round(deliveryPct * rand(0.7, 1.3)),
        volume: randInt(500000, 5000000),
        priceChange: round(rand(-3, 3))
      })),
      bulkDeals: rand(0, 1) > 0.7 ? [
        { date: `2024-12-${randInt(15, 20)}`, buyer: pick(["FII", "DII", "HNI"]), quantity: randInt(100000, 1000000), price: round(s.price * rand(0.98, 1.02)) }
      ] : [],
      interpretation: deliveryPct > 55 ? "High delivery suggests genuine buying interest" : "Normal trading activity"
    };
  },

  'trade-flow-intel': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20", currentPrice: s.price,
      flowScore: randInt(30, 85),
      netFlow: pick(["Strong Inflow", "Inflow", "Neutral", "Outflow", "Strong Outflow"]),
      metrics: {
        buyVolume: randInt(500000, 5000000),
        sellVolume: randInt(400000, 4500000),
        netVolume: randInt(-500000, 1000000),
        largeOrders: randInt(50, 200),
        avgOrderSize: randInt(5000, 50000)
      },
      orderFlow: {
        retail: { buy: randInt(40, 60), sell: 100 - randInt(40, 60) },
        hni: { buy: randInt(35, 65), sell: 100 - randInt(35, 65) },
        institutional: { buy: randInt(45, 70), sell: 100 - randInt(45, 70) }
      },
      timeAnalysis: ["9:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:00"].map(t => ({
        time: t, netFlow: randInt(-100000, 200000), volume: randInt(50000, 500000)
      })),
      signals: rand(0, 1) > 0.6 ? [{ type: "info", message: "Large institutional buying detected at support" }] : []
    };
  },

  // PORTFOLIO CARDS
  'etf-comparator': () => {
    const etfs = [
      { symbol: "NIFTYBEES", name: "Nippon Nifty BeES", category: "Large Cap" },
      { symbol: "BANKBEES", name: "Nippon Bank BeES", category: "Banking" },
      { symbol: "JUNIORBEES", name: "Nippon Junior BeES", category: "Mid Cap" },
      { symbol: "ITBEES", name: "Nippon IT BeES", category: "IT Sector" },
      { symbol: "GOLDBEES", name: "Nippon Gold BeES", category: "Gold" }
    ];
    return {
      asOf: "2024-12-20",
      etfs: etfs.map(e => ({
        ...e,
        price: round(rand(15, 500)),
        aum: round(rand(500, 5000)),
        expenseRatio: round(rand(0.05, 0.5), 2),
        trackingError: round(rand(0.02, 0.15), 2),
        return1Y: round(rand(5, 25)),
        return3Y: round(rand(8, 18)),
        return5Y: round(rand(10, 16))
      })),
      comparison: {
        byReturns: etfs.map(e => ({ symbol: e.symbol, "1Y": round(rand(5, 25)), "3Y": round(rand(8, 18)) })),
        byCost: etfs.map(e => ({ symbol: e.symbol, expense: round(rand(0.05, 0.5), 2), tracking: round(rand(0.02, 0.15), 2) }))
      },
      recommendation: pick(["NIFTYBEES for broad market exposure", "ITBEES for tech sector growth", "GOLDBEES for hedging"])
    };
  },

  'rebalance-optimizer': () => {
    const holdings = Object.keys(stocks).slice(0, 8);
    return {
      asOf: "2024-12-20",
      portfolioValue: round(rand(500000, 2000000)),
      driftScore: randInt(5, 35),
      needsRebalance: rand(0, 1) > 0.5,
      currentAllocation: holdings.map(h => ({ symbol: h, current: round(100 / holdings.length * rand(0.7, 1.3)), target: round(100 / holdings.length) })),
      suggestions: holdings.slice(0, 4).map(h => ({
        symbol: h,
        action: pick(["Buy", "Sell", "Hold"]),
        amount: round(rand(10000, 100000)),
        shares: randInt(10, 200),
        reason: pick(["Underweight", "Overweight", "Rebalance"])
      })),
      taxImpact: { shortTermGains: round(rand(5000, 50000)), longTermGains: round(rand(10000, 100000)), taxPayable: round(rand(2000, 20000)) },
      projectedImprovement: { sharpeRatio: round(rand(0.05, 0.2), 2), volatility: round(rand(-2, -0.5)) },
      lastRebalanced: "2024-09-15"
    };
  },

  'trade-journal': () => {
    return {
      asOf: "2024-12-20",
      summary: {
        totalTrades: randInt(50, 200),
        winRate: randInt(45, 70),
        avgWin: round(rand(5, 15)),
        avgLoss: round(rand(-8, -3)),
        profitFactor: round(rand(1.2, 2.5), 2),
        expectancy: round(rand(0.5, 3), 2)
      },
      recentTrades: Array.from({length: 10}, () => ({
        date: `2024-12-${randInt(1, 20)}`,
        symbol: pick(Object.keys(stocks)),
        type: pick(["Long", "Short"]),
        entry: round(rand(100, 5000)),
        exit: round(rand(100, 5000)),
        pnl: round(rand(-5000, 10000)),
        pnlPct: round(rand(-10, 20)),
        notes: pick(["Trend follow", "Mean reversion", "Breakout", "Earnings play"])
      })),
      monthlyPerformance: genDates(6, 'month').map(m => ({ month: m, pnl: round(rand(-20000, 50000)), trades: randInt(5, 30), winRate: randInt(40, 75) })),
      patterns: { bestSetup: "Trend following", worstSetup: "Counter-trend", bestTimeframe: "Daily" },
      insights: ["Win rate improves in trending markets", "Reduce position size on volatile days"]
    };
  },

  'playbook-builder': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20", currentPrice: s.price,
      activePlaybooks: [
        {
          name: "Trend Following",
          status: "Active",
          entryCondition: "Price > 20 EMA and RSI > 50",
          exitCondition: "Price < 20 EMA or RSI < 40",
          stopLoss: round(s.price * 0.95),
          target: round(s.price * 1.15),
          positionSize: "5% of portfolio"
        },
        {
          name: "Mean Reversion",
          status: "Watching",
          entryCondition: "RSI < 30 and price at support",
          exitCondition: "RSI > 60 or target hit",
          stopLoss: round(s.price * 0.92),
          target: round(s.price * 1.08),
          positionSize: "3% of portfolio"
        }
      ],
      signals: {
        trendFollowing: pick(["Entry", "Exit", "No Signal"]),
        meanReversion: pick(["Entry", "Exit", "No Signal"]),
        breakout: pick(["Entry", "Exit", "No Signal"])
      },
      backtestResults: { winRate: randInt(50, 70), avgReturn: round(rand(1, 5)), maxDrawdown: round(rand(5, 15)), sharpe: round(rand(0.8, 2), 2) },
      riskManagement: { maxPositionSize: "10%", maxPortfolioRisk: "2%", correlationLimit: "0.7" }
    };
  },

  // SCREENER CARDS
  'advanced-screener': () => {
    const results = Object.keys(stocks).map(sym => {
      const s = stocks[sym];
      return {
        symbol: sym,
        name: s.name,
        sector: s.sector,
        price: s.price,
        pe: s.pe,
        pb: s.pb,
        roe: s.roe,
        debtEquity: s.debtEquity || 0.1,
        divYield: s.divYield,
        revenueGrowth: s.revenueGrowth,
        profitGrowth: s.profitGrowth,
        score: randInt(40, 95)
      };
    });
    return {
      asOf: "2024-12-20",
      totalResults: results.length,
      results: results.sort((a, b) => b.score - a.score),
      filters: { pe: "< 30", roe: "> 15", debtEquity: "< 1" },
      savedScreens: [
        { name: "Value Picks", criteria: "PE < 20, ROE > 18, Debt/Equity < 0.5", matches: randInt(3, 8) },
        { name: "Growth Stars", criteria: "Revenue Growth > 15, Profit Growth > 20", matches: randInt(4, 10) },
        { name: "Dividend Champions", criteria: "Yield > 2%, Payout < 60%", matches: randInt(5, 12) }
      ]
    };
  },

  'attribution-tax-optimizer': () => {
    const holdings = Object.keys(stocks).slice(0, 8);
    return {
      asOf: "2024-12-20",
      portfolioValue: round(rand(1000000, 5000000)),
      unrealizedGains: {
        shortTerm: round(rand(20000, 150000)),
        longTerm: round(rand(50000, 300000)),
        total: round(rand(80000, 400000))
      },
      taxLiability: {
        ifSoldNow: round(rand(15000, 80000)),
        optimizedScenario: round(rand(8000, 50000)),
        savings: round(rand(5000, 30000))
      },
      holdings: holdings.map(h => ({
        symbol: h,
        buyDate: `202${randInt(1, 3)}-${String(randInt(1, 12)).padStart(2, '0')}-${String(randInt(1, 28)).padStart(2, '0')}`,
        buyPrice: round(stocks[h].price * rand(0.6, 0.9)),
        currentPrice: stocks[h].price,
        gain: round(rand(10, 80)),
        holdingPeriod: randInt(100, 900),
        taxType: rand(0, 1) > 0.5 ? "LTCG" : "STCG"
      })),
      harvestingOpportunities: holdings.slice(0, 3).map(h => ({
        symbol: h,
        loss: round(rand(-20000, -2000)),
        potentialSavings: round(rand(1000, 5000))
      })),
      recommendations: [
        "Hold TCS for 45 more days to qualify for LTCG",
        "Consider harvesting losses in INFY to offset gains",
        "Defer selling HDFCBANK until next FY"
      ]
    };
  },

  // DERIVATIVES CARDS
  'options-strategy': (sym) => {
    const s = stocks[sym];
    const strike = Math.round(s.price / 50) * 50;
    return {
      symbol: sym, asOf: "2024-12-20", currentPrice: s.price,
      recommendedStrategy: pick(["Bull Call Spread", "Iron Condor", "Covered Call", "Protective Put", "Straddle"]),
      strategyDetails: {
        name: "Bull Call Spread",
        legs: [
          { type: "Buy Call", strike: strike, premium: round(rand(20, 80)), expiry: "2025-01-30" },
          { type: "Sell Call", strike: strike + 100, premium: round(rand(10, 40)), expiry: "2025-01-30" }
        ],
        maxProfit: round(rand(3000, 8000)),
        maxLoss: round(rand(1500, 4000)),
        breakeven: round(s.price * rand(1.01, 1.03)),
        probabilityOfProfit: randInt(45, 65)
      },
      greeks: { delta: round(rand(0.3, 0.7), 2), gamma: round(rand(0.01, 0.05), 3), theta: round(rand(-50, -10)), vega: round(rand(20, 80)) },
      ivAnalysis: { currentIV: round(rand(18, 40)), ivRank: randInt(20, 80), ivPercentile: randInt(25, 75) },
      alternativeStrategies: [
        { name: "Iron Condor", maxProfit: round(rand(2000, 5000)), maxLoss: round(rand(3000, 8000)), probability: randInt(55, 75) },
        { name: "Covered Call", maxProfit: round(rand(1500, 4000)), maxLoss: "Unlimited", probability: randInt(60, 80) }
      ]
    };
  },

  // RISK CARDS (additional)
  'fno-risk-advisor': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20", currentPrice: s.price,
      riskScore: randInt(30, 85),
      riskLevel: pick(["Low", "Moderate", "High", "Very High"]),
      metrics: {
        lotSize: randInt(25, 1000),
        marginRequired: round(s.price * randInt(25, 500) * 0.15),
        maxLoss: round(s.price * randInt(25, 500) * 0.1),
        leverageUsed: round(rand(1, 10), 1)
      },
      positionAnalysis: {
        currentExposure: round(rand(100000, 1000000)),
        maxExposureAllowed: round(rand(500000, 2000000)),
        utilizationPct: randInt(20, 80)
      },
      riskFactors: [
        { factor: "Volatility Risk", level: pick(["Low", "Medium", "High"]), description: "Based on IV percentile" },
        { factor: "Liquidity Risk", level: pick(["Low", "Medium"]), description: "Based on OI and volume" },
        { factor: "Time Decay", level: pick(["Low", "Medium", "High"]), description: "Days to expiry impact" }
      ],
      recommendations: [
        "Reduce position size due to elevated IV",
        "Consider hedging with protective puts",
        "Roll positions before expiry week"
      ]
    };
  },

  'trade-expectancy': (sym) => {
    const s = stocks[sym];
    const winRate = rand(40, 70);
    const avgWin = rand(5, 15);
    const avgLoss = rand(3, 8);
    return {
      symbol: sym, asOf: "2024-12-20",
      expectancy: round((winRate / 100 * avgWin) - ((100 - winRate) / 100 * avgLoss), 2),
      winRate: round(winRate),
      avgWin: round(avgWin),
      avgLoss: round(avgLoss),
      profitFactor: round(winRate / 100 * avgWin / ((100 - winRate) / 100 * avgLoss), 2),
      metrics: {
        totalTrades: randInt(50, 200),
        winners: randInt(25, 100),
        losers: randInt(20, 80),
        breakeven: randInt(5, 20),
        largestWin: round(rand(15, 40)),
        largestLoss: round(rand(10, 25)),
        avgHoldingPeriod: randInt(3, 20)
      },
      distribution: [
        { range: "> 20%", count: randInt(5, 15) },
        { range: "10-20%", count: randInt(15, 30) },
        { range: "0-10%", count: randInt(20, 40) },
        { range: "-10-0%", count: randInt(15, 35) },
        { range: "< -10%", count: randInt(5, 20) }
      ],
      suggestions: [
        "Improve entry timing to increase win rate",
        "Trail stops to capture larger winners",
        "Reduce position size on low-conviction trades"
      ]
    };
  },

  // MINI CARDS
  'sentiment-zscore-mini': (sym) => {
    const s = stocks[sym];
    const zscore = rand(-2.5, 2.5);
    return {
      symbol: sym, asOf: "2024-12-20",
      zscore: round(zscore, 2),
      signal: zscore > 1.5 ? "Overbought" : zscore < -1.5 ? "Oversold" : "Neutral",
      percentile: Math.round(50 + zscore * 20),
      components: {
        priceZscore: round(rand(-2, 2), 2),
        volumeZscore: round(rand(-1.5, 1.5), 2),
        momentumZscore: round(rand(-2, 2), 2)
      },
      interpretation: zscore > 1.5 ? "Extreme bullish sentiment - caution advised" : zscore < -1.5 ? "Extreme bearish sentiment - potential opportunity" : "Sentiment within normal range"
    };
  },

  'warning-sentinel-mini': (sym) => {
    const s = stocks[sym];
    const alerts = s.profile === 'high-risk' ? randInt(2, 5) : randInt(0, 2);
    return {
      symbol: sym, asOf: "2024-12-20",
      alertCount: alerts,
      riskLevel: alerts > 3 ? "High" : alerts > 1 ? "Moderate" : "Low",
      alerts: Array.from({length: alerts}, () => ({
        type: pick(["Governance", "Financial", "Operational", "Market"]),
        severity: pick(["Critical", "Warning", "Watch"]),
        message: pick([
          "Unusual related party transactions",
          "Declining cash flows",
          "Auditor concerns raised",
          "High promoter pledge",
          "Margin pressure detected",
          "Volume anomaly detected"
        ])
      })),
      lastUpdated: "2024-12-20T10:30:00Z"
    };
  },

  'factor-tilt-mini': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20",
      dominantFactor: pick(["Value", "Quality", "Momentum", "Growth", "Low Vol"]),
      factorScores: {
        value: randInt(20, 90),
        quality: randInt(30, 95),
        momentum: randInt(15, 85),
        growth: randInt(25, 90),
        lowVol: randInt(20, 80),
        yield: randInt(10, 85)
      },
      tilt: pick(["Strong Value", "Growth-Quality", "Momentum", "Defensive", "Balanced"]),
      percentileRank: randInt(30, 90)
    };
  },

  'altman-graham-mini': (sym) => {
    const s = stocks[sym];
    const zScore = s.profile === 'high-risk' ? rand(1.5, 2.5) : rand(3, 7);
    const grahamNumber = Math.sqrt(22.5 * (s.mcap / s.pe / 1000) * (s.mcap / s.pb / 1000)) * rand(0.8, 1.2);
    return {
      symbol: sym, asOf: "2024-12-20", currentPrice: s.price,
      altmanZScore: round(zScore, 2),
      zScoreZone: zScore > 3 ? "Safe" : zScore > 1.8 ? "Grey" : "Distress",
      grahamNumber: round(grahamNumber),
      grahamUpside: round((grahamNumber / s.price - 1) * 100),
      verdict: zScore > 3 && grahamNumber > s.price ? "Undervalued & Safe" : zScore > 3 ? "Safe but fairly valued" : "Caution advised"
    };
  },

  // MACRO CARDS (additional)
  'narrative-theme': (sym) => {
    const s = stocks[sym];
    return {
      symbol: sym, asOf: "2024-12-20",
      activeThemes: [
        { theme: pick(["AI Revolution", "Green Energy", "Digital India", "Make in India", "Consumption Story"]), relevance: randInt(60, 95), momentum: pick(["Rising", "Stable", "Fading"]) },
        { theme: pick(["Interest Rate Cycle", "Capex Revival", "Rural Recovery", "Export Growth"]), relevance: randInt(40, 80), momentum: pick(["Rising", "Stable", "Fading"]) }
      ],
      sectorNarrative: {
        theme: s.sector === 'IT' ? "AI and Digital Transformation" : s.sector === 'Banking' ? "Credit Growth Cycle" : "Domestic Consumption",
        strength: randInt(50, 90),
        duration: pick(["Short-term", "Medium-term", "Secular"])
      },
      newsFlow: [
        { headline: `${s.name} announces expansion plans`, sentiment: "Positive", date: "2024-12-18" },
        { headline: `Sector outlook remains strong`, sentiment: "Neutral", date: "2024-12-15" }
      ],
      thematicScore: randInt(45, 90)
    };
  }
};

// Generate all data
const generateAll = () => {
  const cardsDir = path.join(__dirname, 'cards');
  if (!fs.existsSync(cardsDir)) fs.mkdirSync(cardsDir, { recursive: true });

  Object.entries(allGenerators).forEach(([cardId, generator]) => {
    const data = {};
    if (['portfolio-correlation', 'portfolio-leaderboard'].includes(cardId)) {
      Object.assign(data, generator());
    } else {
      Object.keys(stocks).forEach(sym => { data[sym] = generator(sym); });
    }
    fs.writeFileSync(path.join(cardsDir, `${cardId}.json`), JSON.stringify(data, null, 2));
    console.log(`✓ ${cardId}.json`);
  });
  
  console.log(`\n✅ Generated ${Object.keys(allGenerators).length} card data files for ${Object.keys(stocks).length} stocks`);
};

if (require.main === module) generateAll();
module.exports = { allGenerators, stocks };
