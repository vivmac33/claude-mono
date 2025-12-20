// ═══════════════════════════════════════════════════════════════════════════
// SHARED MOCK DATA GENERATOR - Used by both WorkflowBuilder and DynamicCardLoader
// Generates realistic mock data for all 69 cards
// ═══════════════════════════════════════════════════════════════════════════

import { MUTUAL_FUND_DATA, CATEGORY_COUNTS, AMC_LIST } from '@/data/mutualFundData';

export function generateMockData(cardId: string, symbol: string): any {
  const asOf = new Date().toISOString().split('T')[0];
  const basePrice = 1000 + Math.floor(Math.random() * 3000);
  const score = Math.floor(Math.random() * 40) + 50;
  
  const mockGenerators: Record<string, () => any> = {
    // ═══════════════════════════════════════════════════════════════════════
    // VALUE CARDS
    // ═══════════════════════════════════════════════════════════════════════
    'fair-value-forecaster': () => {
      const fairValue = basePrice * (1 + (Math.random() - 0.3) * 0.4);
      const upside = ((fairValue - basePrice) / basePrice) * 100;
      return {
        symbol, asOf,
        currentPrice: basePrice,
        fairValueNow: fairValue,
        marginOfSafetyPct: upside > 0 ? upside * 0.8 : 0,
        horizonYears: 3,
        upside,
        valuation: upside > 15 ? 'Undervalued' : upside < -15 ? 'Overvalued' : 'Fair Value',
        confidence: 70 + Math.floor(Math.random() * 20),
        fan: Array.from({ length: 12 }, (_, i) => ({
          t: `${2024 + Math.floor(i / 4)}Q${(i % 4) + 1}`,
          p5: basePrice * (0.7 + i * 0.02),
          p25: basePrice * (0.85 + i * 0.025),
          p50: basePrice * (1 + i * 0.03),
          p75: basePrice * (1.15 + i * 0.035),
          p95: basePrice * (1.3 + i * 0.04)
        })),
        // sensitivity must be array of { growthDeltaPct: number, fv: number }
        sensitivity: [
          { growthDeltaPct: -10, fv: fairValue * 0.85 },
          { growthDeltaPct: -5, fv: fairValue * 0.92 },
          { growthDeltaPct: 0, fv: fairValue },
          { growthDeltaPct: 5, fv: fairValue * 1.08 },
          { growthDeltaPct: 10, fv: fairValue * 1.15 }
        ],
        // drivers must be object with these exact numeric keys
        drivers: {
          earningsGrowth: Math.floor(Math.random() * 30) + 5,
          revenueGrowth: Math.floor(Math.random() * 25) + 5,
          marginExpansion: Math.floor(Math.random() * 15) - 5,
          multipleChange: Math.floor(Math.random() * 20) - 10
        },
        score
      };
    },
    
    'valuation-summary': () => {
      const pe = 15 + Math.random() * 25;
      const pb = 2 + Math.random() * 5;
      const ps = 1 + Math.random() * 4;
      const evEbitda = 8 + Math.random() * 12;
      const verdicts = ['Cheap', 'Fair', 'Expensive'] as const;
      return {
        symbol, asOf,
        overallScore: score,
        verdict: verdicts[Math.floor(Math.random() * 3)],
        percentileRank: Math.floor(Math.random() * 100),
        multiples: {
          pe,
          peMedian: pe * (0.9 + Math.random() * 0.2),
          pb,
          pbMedian: pb * (0.9 + Math.random() * 0.2),
          ps,
          psMedian: ps * (0.9 + Math.random() * 0.2),
          evEbitda,
          evEbitdaMedian: evEbitda * (0.9 + Math.random() * 0.2),
          pegRatio: 0.8 + Math.random() * 1.5
        },
        radarData: [
          { metric: 'P/E', value: pe, benchmark: pe * 1.1 },
          { metric: 'P/B', value: pb, benchmark: pb * 1.05 },
          { metric: 'P/S', value: ps, benchmark: ps * 1.1 },
          { metric: 'EV/EBITDA', value: evEbitda, benchmark: evEbitda * 0.95 },
          { metric: 'PEG', value: 1 + Math.random(), benchmark: 1.2 }
        ],
        historicalPE: Array.from({ length: 5 }, (_, i) => ({
          year: `FY${2020 + i}`,
          pe: 12 + Math.random() * 20
        })),
        peerComparison: [
          { symbol: 'INFY', pe: 20 + Math.random() * 10, pb: 3 + Math.random() * 2 },
          { symbol: 'WIPRO', pe: 18 + Math.random() * 8, pb: 2.5 + Math.random() * 1.5 },
          { symbol: 'HCLTECH', pe: 22 + Math.random() * 10, pb: 4 + Math.random() * 2 }
        ],
        // Legacy fields
        peRatio: pe,
        pbRatio: pb,
        evEbitda,
        score
      };
    },
    
    'dcf-valuation': () => {
      const intrinsicValue = basePrice * (1 + (Math.random() - 0.3) * 0.5);
      const marginOfSafety = ((intrinsicValue - basePrice) / intrinsicValue) * 100;
      return {
        symbol, asOf,
        currentPrice: basePrice,
        intrinsicValue,
        marginOfSafety,
        verdict: marginOfSafety > 20 ? 'Buy' : marginOfSafety < -10 ? 'Sell' : 'Hold',
        assumptions: {
          revenueGrowth: 10 + Math.floor(Math.random() * 15),
          terminalGrowth: 2 + Math.floor(Math.random() * 2),
          wacc: 10 + Math.floor(Math.random() * 5),
          taxRate: 25 + Math.floor(Math.random() * 10)
        },
        projections: Array.from({ length: 5 }, (_, i) => ({
          year: `FY${2024 + i}`,
          revenue: basePrice * 100 * Math.pow(1.1, i),
          fcf: basePrice * 10 * Math.pow(1.08, i),
          discountedFcf: basePrice * 10 * Math.pow(1.08, i) / Math.pow(1.1, i)
        })),
        sensitivityMatrix: [
          { wacc: 8, terminalGrowth: 2, intrinsicValue: intrinsicValue * 1.15 },
          { wacc: 10, terminalGrowth: 2, intrinsicValue: intrinsicValue },
          { wacc: 12, terminalGrowth: 2, intrinsicValue: intrinsicValue * 0.88 },
          { wacc: 8, terminalGrowth: 3, intrinsicValue: intrinsicValue * 1.22 },
          { wacc: 10, terminalGrowth: 3, intrinsicValue: intrinsicValue * 1.08 },
          { wacc: 12, terminalGrowth: 3, intrinsicValue: intrinsicValue * 0.95 }
        ],
        valueBreakdown: {
          pvFcf: intrinsicValue * 0.4,
          terminalValue: intrinsicValue * 0.65,
          netDebt: intrinsicValue * 0.05,
          equityValue: intrinsicValue * 100,
          sharesOutstanding: 100
        },
        score
      };
    },
    
    'piotroski-score': () => {
      const profScore = Math.floor(Math.random() * 2) + 2;
      const levScore = Math.floor(Math.random() * 2) + 1;
      const effScore = Math.floor(Math.random() * 2) + 1;
      const total = profScore + levScore + effScore;
      return {
        symbol, asOf,
        totalScore: total,
        verdict: total >= 7 ? 'Strong' : total >= 5 ? 'Moderate' : 'Weak',
        previousScore: total - 1 + Math.floor(Math.random() * 3),
        trend: ['Improving', 'Stable', 'Declining'][Math.floor(Math.random() * 3)],
        categories: {
          profitability: {
            score: profScore, maxScore: 4,
            items: [
              { name: 'Positive ROA', pass: Math.random() > 0.3, value: `${(5 + Math.random() * 15).toFixed(1)}%` },
              { name: 'Positive CFO', pass: Math.random() > 0.3, value: `₹${(100 + Math.random() * 500).toFixed(0)}Cr` },
              { name: 'ROA Improving', pass: Math.random() > 0.5, value: `+${(Math.random() * 3).toFixed(1)}%` },
              { name: 'CFO > Net Income', pass: Math.random() > 0.4, value: `${(0.8 + Math.random() * 0.5).toFixed(2)}x` },
            ]
          },
          leverage: {
            score: levScore, maxScore: 3,
            items: [
              { name: 'Lower Leverage', pass: Math.random() > 0.5, value: `${(0.3 + Math.random() * 0.5).toFixed(2)}x` },
              { name: 'Higher Current Ratio', pass: Math.random() > 0.5, value: `${(1.2 + Math.random() * 0.8).toFixed(2)}x` },
              { name: 'No Dilution', pass: Math.random() > 0.4, value: 'No new shares' },
            ]
          },
          efficiency: {
            score: effScore, maxScore: 2,
            items: [
              { name: 'Higher Gross Margin', pass: Math.random() > 0.5, value: `+${(Math.random() * 2).toFixed(1)}%` },
              { name: 'Higher Asset Turnover', pass: Math.random() > 0.5, value: `${(0.5 + Math.random() * 0.5).toFixed(2)}x` },
            ]
          }
        },
        historicalScores: [
          { year: '2021', score: Math.floor(Math.random() * 4) + 4 },
          { year: '2022', score: Math.floor(Math.random() * 4) + 4 },
          { year: '2023', score: Math.floor(Math.random() * 4) + 5 },
          { year: '2024', score: total },
        ]
      };
    },
    
    'intrinsic-value-range': () => ({
      symbol, asOf,
      currentPrice: basePrice,
      valuationMethods: [
        { method: 'DCF', lowValue: basePrice * 0.85, midValue: basePrice * 1.1, highValue: basePrice * 1.35, weight: 0.4 },
        { method: 'PE Multiple', lowValue: basePrice * 0.8, midValue: basePrice * 1.05, highValue: basePrice * 1.3, weight: 0.3 },
        { method: 'EV/EBITDA', lowValue: basePrice * 0.75, midValue: basePrice * 1.0, highValue: basePrice * 1.25, weight: 0.3 },
      ],
      compositeRange: { low: basePrice * 0.8, mid: basePrice * 1.1, high: basePrice * 1.4 },
      upside: (Math.random() - 0.3) * 40, confidence: 65 + Math.random() * 25,
      verdict: ['Below Range', 'Within Range', 'Above Range'][Math.floor(Math.random() * 3)]
    }),
    
    'financial-health-dna': () => {
      const healthScore = 50 + Math.floor(Math.random() * 40);
      const grades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'] as const;
      const gradeIdx = Math.max(0, Math.min(7, Math.floor((100 - healthScore) / 12)));
      return {
        symbol, asOf,
        healthScore,
        healthGrade: grades[gradeIdx],
        healthVerdict: healthScore > 70 ? 'Excellent financial health' : healthScore > 50 ? 'Good financial health' : 'Needs monitoring',
        piotroski: {
          totalScore: Math.floor(Math.random() * 4) + 5,
          components: {
            positiveNetIncome: Math.random() > 0.3,
            positiveCFO: Math.random() > 0.3,
            roaImproving: Math.random() > 0.5,
            cfoGreaterThanNI: Math.random() > 0.4,
            lowerLeverage: Math.random() > 0.5,
            higherCurrentRatio: Math.random() > 0.5,
            noNewShares: Math.random() > 0.6,
            higherGrossMargin: Math.random() > 0.5,
            higherAssetTurnover: Math.random() > 0.5,
          },
          interpretation: 'Strong fundamental signals'
        },
        altmanZ: {
          score: 2 + Math.random() * 2,
          zone: ['Safe', 'Grey', 'Distress'][Math.floor(Math.random() * 2)] as 'Safe' | 'Grey' | 'Distress',
          components: {
            workingCapitalRatio: 0.1 + Math.random() * 0.3,
            retainedEarningsRatio: 0.2 + Math.random() * 0.3,
            ebitRatio: 0.1 + Math.random() * 0.2,
            marketValueRatio: 0.5 + Math.random() * 1,
            salesRatio: 0.8 + Math.random() * 0.5,
          },
          interpretation: 'Low bankruptcy risk'
        },
        cashQuality: {
          score: 60 + Math.floor(Math.random() * 30),
          accrualRatio: -5 + Math.random() * 10,
          cashConversion: 0.8 + Math.random() * 0.3,
          earningsQuality: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 2)] as 'High' | 'Medium' | 'Low',
          redFlags: Math.random() > 0.7 ? ['Rising receivables'] : []
        },
        leverageHealth: {
          score: 60 + Math.floor(Math.random() * 30),
          debtToEquity: 0.2 + Math.random() * 0.8,
          interestCoverage: 3 + Math.random() * 7,
          status: ['Conservative', 'Moderate', 'Aggressive'][Math.floor(Math.random() * 2)] as 'Conservative' | 'Moderate' | 'Aggressive'
        },
        profitability: {
          score: 60 + Math.floor(Math.random() * 30),
          roe: 10 + Math.random() * 15,
          roa: 5 + Math.random() * 10,
          opm: 10 + Math.random() * 15,
          npm: 5 + Math.random() * 12,
          trend: ['Improving', 'Stable', 'Declining'][Math.floor(Math.random() * 2)] as 'Improving' | 'Stable' | 'Declining'
        },
        radarData: [
          { metric: 'Profitability', score: 60 + Math.random() * 30, fullMark: 100 },
          { metric: 'Liquidity', score: 60 + Math.random() * 30, fullMark: 100 },
          { metric: 'Solvency', score: 60 + Math.random() * 30, fullMark: 100 },
          { metric: 'Efficiency', score: 60 + Math.random() * 30, fullMark: 100 },
          { metric: 'Growth', score: 50 + Math.random() * 40, fullMark: 100 },
        ],
        historicalScores: [
          { year: '2021', score: healthScore - 10 + Math.floor(Math.random() * 20) },
          { year: '2022', score: healthScore - 5 + Math.floor(Math.random() * 15) },
          { year: '2023', score: healthScore },
        ],
        concerns: Math.random() > 0.5 ? ['Watch leverage ratio'] : [],
        strengths: ['Strong cash generation', 'Improving margins']
      };
    },
    
    'dupont-analysis': () => {
      const netMargin = 8 + Math.random() * 12;
      const turnover = 0.5 + Math.random() * 1;
      const leverage = 1.5 + Math.random() * 1.5;
      const roe = netMargin * turnover * leverage / 100 * 100; // Simplified ROE calc
      return {
        symbol, asOf,
        roe: 12 + Math.random() * 10,
        roePrevious: 10 + Math.random() * 8,
        decomposition: {
          netProfitMargin: netMargin,
          assetTurnover: turnover,
          equityMultiplier: leverage
        },
        decompositionPrevious: {
          netProfitMargin: netMargin - 1 + Math.random() * 2,
          assetTurnover: turnover - 0.1 + Math.random() * 0.2,
          equityMultiplier: leverage - 0.1 + Math.random() * 0.2
        },
        historicalTrend: [
          { year: '2021', roe: 10 + Math.random() * 5 },
          { year: '2022', roe: 11 + Math.random() * 6 },
          { year: '2023', roe: 12 + Math.random() * 7 },
          { year: '2024', roe: 12 + Math.random() * 10 }
        ],
        peerComparison: {
          avgMargin: 9 + Math.random() * 8,
          avgTurnover: 0.6 + Math.random() * 0.6,
          avgLeverage: 1.8 + Math.random() * 1
        },
        primaryDriver: ['Margin Improvement', 'Asset Efficiency', 'Leverage Optimization'][Math.floor(Math.random() * 3)],
        score
      };
    },
    
    'multi-factor-scorecard': () => {
      const compositeScore = 40 + Math.floor(Math.random() * 50);
      const factorNames = ['Value', 'Quality', 'Momentum', 'Growth', 'Volatility'];
      return {
        symbol, asOf,
        compositeScore,
        grade: compositeScore >= 80 ? 'A' : compositeScore >= 65 ? 'B' : compositeScore >= 50 ? 'C' : compositeScore >= 35 ? 'D' : 'F',
        factors: factorNames.map(name => ({
          name,
          score: Math.floor(Math.random() * 80) + 20,
          maxScore: 100,
          weight: 0.2,
          trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
        })),
        radarData: factorNames.map(factor => ({
          factor,
          score: 40 + Math.floor(Math.random() * 50),
          benchmark: 50 + Math.floor(Math.random() * 20)
        })),
        ranking: {
          sector: Math.floor(Math.random() * 20) + 1,
          sectorTotal: 50,
          market: Math.floor(Math.random() * 100) + 1,
          marketTotal: 500
        },
        score: compositeScore
      };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // TECHNICAL CARDS
    // ═══════════════════════════════════════════════════════════════════════
    'technical-indicators': () => {
      const rsiVal = 30 + Math.random() * 40;
      const signals = ['Strong Buy', 'Buy', 'Neutral', 'Sell', 'Strong Sell'] as const;
      const overallSignal = signals[Math.floor(Math.random() * 5)];
      const bullCount = Math.floor(Math.random() * 6) + 2;
      const bearCount = Math.floor(Math.random() * 4);
      return {
        symbol, asOf,
        overallSignal,
        score,
        indicators: {
          rsi: { value: rsiVal, signal: rsiVal > 70 ? 'Overbought' : rsiVal < 30 ? 'Oversold' : 'Neutral' },
          macd: { value: Math.random() * 10 - 5, signal: Math.random() > 0.5 ? 'Bullish' : 'Bearish', histogram: Math.random() * 4 - 2 },
          stochastic: { k: Math.random() * 100, d: Math.random() * 100, signal: 'Neutral' },
          adx: { value: 15 + Math.random() * 30, signal: 'Trending' },
          cci: { value: Math.random() * 200 - 100, signal: 'Neutral' },
          williamsR: { value: -20 - Math.random() * 60, signal: 'Neutral' }
        },
        movingAverages: {
          sma20: { value: basePrice * (0.97 + Math.random() * 0.06), signal: 'Above' },
          sma50: { value: basePrice * (0.94 + Math.random() * 0.06), signal: 'Above' },
          sma200: { value: basePrice * (0.88 + Math.random() * 0.08), signal: 'Above' },
          ema20: { value: basePrice * (0.98 + Math.random() * 0.04), signal: 'Above' }
        },
        summary: { bullish: bullCount, bearish: bearCount, neutral: 10 - bullCount - bearCount },
        // Legacy fields for backward compat
        rsi: rsiVal,
        macd: { value: Math.random() * 10 - 5, signal: Math.random() * 8 - 4, histogram: Math.random() * 4 - 2 },
        stochastic: { k: Math.random() * 100, d: Math.random() * 100 },
        adx: 15 + Math.random() * 30,
        sentiment: overallSignal.includes('Buy') ? 'Bullish' : overallSignal.includes('Sell') ? 'Bearish' : 'Neutral'
      };
    },
    
    'trend-strength': () => {
      const trends = ['Strong Uptrend', 'Uptrend', 'Sideways', 'Downtrend', 'Strong Downtrend'] as const;
      const trend = trends[Math.floor(Math.random() * 5)];
      const adxValue = 20 + Math.random() * 30;
      const diPlusVal = 20 + Math.random() * 25;
      const diMinusVal = 15 + Math.random() * 20;
      return {
        symbol, asOf,
        trend,
        adx: { 
          value: adxValue, 
          trend: adxValue > 30 ? 'strengthening' : adxValue < 20 ? 'weakening' : 'stable' 
        },
        diPlus: diPlusVal,
        diMinus: diMinusVal,
        historical: Array.from({ length: 20 }, (_, i) => ({
          date: new Date(Date.now() - (20 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          adx: adxValue + (Math.random() - 0.5) * 10,
          diPlus: diPlusVal + (Math.random() - 0.5) * 8,
          diMinus: diMinusVal + (Math.random() - 0.5) * 8,
          price: basePrice * (0.95 + i * 0.005 + Math.random() * 0.02)
        })),
        signals: {
          goldenCross: Math.random() > 0.7,
          deathCross: Math.random() > 0.8,
          supertrendBullish: trend.includes('Up')
        },
        // Legacy fields
        trendScore: score,
        direction: trend.includes('Up') ? 'Uptrend' : trend.includes('Down') ? 'Downtrend' : 'Sideways',
        strength: trend.includes('Strong') ? 'Strong' : 'Moderate',
        movingAverages: { sma20: basePrice * 0.98, sma50: basePrice * 0.95, sma200: basePrice * 0.9 }
      };
    },
    
    'pattern-matcher': () => {
      const confidenceLevels = ['High', 'Medium', 'Low'] as const;
      return {
        symbol, asOf,
        currentPattern: Array.from({ length: 20 }, (_, i) => ({
          t: new Date(Date.now() - (20 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          v: basePrice * (0.95 + i * 0.005 + Math.random() * 0.03)
        })),
        matches: [
          {
            symbol: 'RELIANCE',
            period: '2023-Q2',
            similarity: 78 + Math.random() * 15,
            outcome: 8 + Math.random() * 12,
            alignedPattern: Array.from({ length: 20 }, (_, i) => ({
              t: `Day ${i + 1}`,
              v: basePrice * 0.9 * (0.95 + i * 0.005 + Math.random() * 0.03)
            }))
          },
          {
            symbol: 'HDFC',
            period: '2022-Q4',
            similarity: 72 + Math.random() * 15,
            outcome: -3 + Math.random() * 10,
            alignedPattern: Array.from({ length: 20 }, (_, i) => ({
              t: `Day ${i + 1}`,
              v: basePrice * 0.85 * (0.95 + i * 0.005 + Math.random() * 0.03)
            }))
          }
        ],
        expectedOutcome: {
          avgReturn: 5 + Math.random() * 10,
          winRate: 55 + Math.random() * 25,
          avgDuration: 10 + Math.floor(Math.random() * 15)
        },
        confidenceLevel: confidenceLevels[Math.floor(Math.random() * 3)],
        // Legacy fields
        patterns: [
          { name: 'Double Bottom', confidence: 75 + Math.random() * 20, type: 'bullish', priceTarget: basePrice * 1.1 },
          { name: 'Head & Shoulders', confidence: 60 + Math.random() * 25, type: 'bearish', priceTarget: basePrice * 0.9 }
        ],
        activePattern: 'Double Bottom',
        reliability: 70 + Math.random() * 20
      };
    },
    
    'candlestick-hero': () => {
      const change = (Math.random() - 0.5) * 10;
      
      // Generate series with weekend skip (like TickerPage)
      const seriesData: any[] = [];
      const now = new Date();
      let currentPrice = basePrice * 0.9;
      
      for (let i = 59; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Skip weekends - markets are closed (THIS WAS MISSING!)
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        const volatility = 0.015;
        const drift = (Math.random() - 0.48) * volatility;
        const dayOpen = currentPrice;
        const dayClose = dayOpen * (1 + drift);
        const dayHigh = Math.max(dayOpen, dayClose) * (1 + Math.random() * volatility);
        const dayLow = Math.min(dayOpen, dayClose) * (1 - Math.random() * volatility);
        
        seriesData.push({
          date: date.toISOString().split('T')[0],
          open: +dayOpen.toFixed(2),
          high: +dayHigh.toFixed(2),
          low: +dayLow.toFixed(2),
          close: +dayClose.toFixed(2),
          volume: Math.floor(500000 + Math.random() * 2000000)
        });
        
        currentPrice = dayClose;
      }
      
      return {
        symbol, asOf,
        lastPrice: basePrice,
        change,
        changePct: (change / basePrice) * 100,
        volume: Math.floor(1000000 + Math.random() * 5000000),
        avgVolume: Math.floor(2000000 + Math.random() * 3000000),
        high52w: basePrice * (1.2 + Math.random() * 0.3),
        low52w: basePrice * (0.6 + Math.random() * 0.2),
        series: seriesData,
        indicators: {
          ma20: basePrice * (0.98 + Math.random() * 0.04),
          ma50: basePrice * (0.95 + Math.random() * 0.1),
          ma200: basePrice * (0.9 + Math.random() * 0.15),
          rsi: 30 + Math.random() * 40,
          macdLine: Math.random() * 4 - 2,
          macdSignal: Math.random() * 3 - 1.5,
          macdHist: Math.random() * 2 - 1
        },
        // Legacy fields
        pattern: ['Doji', 'Hammer', 'Engulfing', 'Morning Star', 'Evening Star'][Math.floor(Math.random() * 5)],
        signal: Math.random() > 0.5 ? 'Bullish' : 'Bearish', 
        reliability: 60 + Math.random() * 30,
        description: 'Potential reversal signal detected'
      };
    },
    
    'momentum-heatmap': () => {
      const overallMomentums = ['Strong', 'Moderate', 'Weak', 'Negative'] as const;
      const overallMomentum = overallMomentums[Math.floor(Math.random() * 4)];
      const tfSignals = ['bullish', 'bearish', 'neutral'] as const;
      return {
        symbol, asOf,
        overallMomentum,
        timeframes: [
          { tf: '1D', rsi: 40 + Math.random() * 30, macd: Math.random() > 0.5 ? 'Bullish' : 'Bearish', momentum: Math.random() * 6 - 3, signal: tfSignals[Math.floor(Math.random() * 3)] },
          { tf: '1W', rsi: 40 + Math.random() * 30, macd: Math.random() > 0.5 ? 'Bullish' : 'Bearish', momentum: Math.random() * 10 - 5, signal: tfSignals[Math.floor(Math.random() * 3)] },
          { tf: '1M', rsi: 40 + Math.random() * 30, macd: Math.random() > 0.5 ? 'Bullish' : 'Bearish', momentum: Math.random() * 15 - 7, signal: tfSignals[Math.floor(Math.random() * 3)] },
          { tf: '3M', rsi: 40 + Math.random() * 30, macd: Math.random() > 0.5 ? 'Bullish' : 'Bearish', momentum: Math.random() * 25 - 10, signal: tfSignals[Math.floor(Math.random() * 3)] },
        ],
        sectors: [
          { sector: 'Technology', momentum: Math.random() * 10 - 3, relativeStrength: 90 + Math.random() * 20 },
          { sector: 'Financials', momentum: Math.random() * 8 - 4, relativeStrength: 80 + Math.random() * 25 },
          { sector: 'Healthcare', momentum: Math.random() * 6 - 3, relativeStrength: 75 + Math.random() * 30 },
        ],
        // Legacy fields for backward compat
        momentum: { 
          daily: Math.random() * 6 - 3, 
          weekly: Math.random() * 10 - 5, 
          monthly: Math.random() * 15 - 7,
          quarterly: Math.random() * 25 - 10
        },
        signal: overallMomentum === 'Strong' ? 'Strong Buy' : overallMomentum === 'Negative' ? 'Sell' : 'Hold',
        score
      };
    },
    
    'volatility-regime': () => {
      const regimes = ['Low', 'Normal', 'High', 'Extreme'] as const;
      const regime = regimes[Math.floor(Math.random() * 4)];
      const atrValue = 20 + Math.random() * 80;
      const bbWidth = 2 + Math.random() * 8;
      return {
        symbol, asOf,
        regime,
        atr: { 
          value: atrValue, 
          percentile: Math.floor(Math.random() * 100) 
        },
        bollingerWidth: { 
          value: bbWidth, 
          squeeze: bbWidth < 4 
        },
        historical: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          atr: atrValue * (0.8 + Math.random() * 0.4),
          bbWidth: bbWidth * (0.8 + Math.random() * 0.4),
          price: basePrice * (0.95 + Math.random() * 0.1)
        })),
        alerts: regime === 'Extreme' 
          ? [{ type: 'warning', message: 'Volatility spike detected' }]
          : regime === 'Low' && bbWidth < 4 
            ? [{ type: 'info', message: 'Bollinger squeeze forming' }]
            : []
      };
    },
    
    'market-regime-radar': () => {
      const regimes = ['Bull', 'Bear', 'Sideways', 'Volatile', 'Transitioning'] as const;
      const signals = ['bullish', 'bearish', 'neutral'] as const;
      const regime = regimes[Math.floor(Math.random() * 5)];
      const confidence = 60 + Math.random() * 30;
      return {
        symbol, asOf,
        regime,
        confidence,
        factors: [
          { factor: 'Trend', value: Math.random() * 100, weight: 0.25, signal: signals[Math.floor(Math.random() * 3)] },
          { factor: 'Momentum', value: Math.random() * 100, weight: 0.20, signal: signals[Math.floor(Math.random() * 3)] },
          { factor: 'Volatility', value: Math.random() * 100, weight: 0.15, signal: signals[Math.floor(Math.random() * 3)] },
          { factor: 'Volume', value: Math.random() * 100, weight: 0.15, signal: signals[Math.floor(Math.random() * 3)] },
          { factor: 'Breadth', value: Math.random() * 100, weight: 0.15, signal: signals[Math.floor(Math.random() * 3)] },
          { factor: 'Sentiment', value: Math.random() * 100, weight: 0.10, signal: signals[Math.floor(Math.random() * 3)] }
        ],
        radarData: [
          { factor: 'Trend', score: 50 + Math.random() * 40, fullMark: 100 },
          { factor: 'Momentum', score: 50 + Math.random() * 40, fullMark: 100 },
          { factor: 'Volatility', score: 50 + Math.random() * 40, fullMark: 100 },
          { factor: 'Volume', score: 50 + Math.random() * 40, fullMark: 100 },
          { factor: 'Breadth', score: 50 + Math.random() * 40, fullMark: 100 },
          { factor: 'Sentiment', score: 50 + Math.random() * 40, fullMark: 100 }
        ],
        recommendation: {
          action: regime === 'Bull' ? 'Stay Invested' : regime === 'Bear' ? 'Reduce Exposure' : 'Hold',
          strategy: regime === 'Bull' ? 'Momentum plays' : regime === 'Bear' ? 'Defensive sectors' : 'Range trading',
          timeframe: 'Short-term (1-3 months)'
        }
      };
    },
    
    'seasonality-pattern': () => {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const signals = ['bullish', 'bearish', 'neutral'] as const;
      const currentMonth = months[new Date().getMonth()];
      const monthlyReturns = months.map(month => ({
        month,
        avgReturn: Math.random() * 8 - 3,
        winRate: 40 + Math.random() * 30,
        years: 10
      }));
      const sortedMonths = [...monthlyReturns].sort((a, b) => b.avgReturn - a.avgReturn);
      const currentMonthData = monthlyReturns.find(m => m.month === currentMonth)!;
      return {
        symbol, asOf,
        monthlyReturns,
        dayOfWeekReturns: days.map(day => ({
          day,
          avgReturn: Math.random() * 1 - 0.3,
          winRate: 45 + Math.random() * 15
        })),
        bestMonth: { month: sortedMonths[0].month, avgReturn: sortedMonths[0].avgReturn },
        worstMonth: { month: sortedMonths[11].month, avgReturn: sortedMonths[11].avgReturn },
        currentMonthOutlook: {
          month: currentMonth,
          historical: currentMonthData.avgReturn,
          signal: currentMonthData.avgReturn > 1 ? 'bullish' : currentMonthData.avgReturn < -1 ? 'bearish' : 'neutral'
        }
      };
    },
    
    'price-structure': () => {
      const structures = ['Higher Highs', 'Lower Lows', 'Range Bound', 'Breakout', 'Breakdown'] as const;
      const strengths = ['strong', 'moderate', 'weak'] as const;
      const structure = structures[Math.floor(Math.random() * 5)];
      const r1 = basePrice * 1.02;
      const r2 = basePrice * 1.04;
      const s1 = basePrice * 0.98;
      const s2 = basePrice * 0.96;
      return {
        symbol, asOf,
        currentPrice: basePrice,
        structure,
        levels: {
          resistance: [
            { price: r1, strength: 'moderate' as const, type: 'Recent High' },
            { price: r2, strength: 'strong' as const, type: '52W High' },
            { price: basePrice * 1.08, strength: 'weak' as const, type: 'Psychological' }
          ],
          support: [
            { price: s1, strength: 'moderate' as const, type: 'Recent Low' },
            { price: s2, strength: 'strong' as const, type: 'Moving Avg' },
            { price: basePrice * 0.92, strength: 'weak' as const, type: '52W Low' }
          ]
        },
        pivots: {
          r3: basePrice * 1.06,
          r2: basePrice * 1.04,
          r1: basePrice * 1.02,
          pivot: basePrice,
          s1: basePrice * 0.98,
          s2: basePrice * 0.96,
          s3: basePrice * 0.94
        },
        keyLevels: {
          previousDayHigh: basePrice * 1.01,
          previousDayLow: basePrice * 0.99,
          weekHigh: basePrice * 1.03,
          weekLow: basePrice * 0.97
        },
        nearestLevels: {
          resistance: r1,
          resistanceDist: ((r1 - basePrice) / basePrice) * 100,
          support: s1,
          supportDist: ((basePrice - s1) / basePrice) * 100
        }
      };
    },
    
    'delivery-analysis': () => {
      const currentDeliveryPct = 30 + Math.random() * 40;
      const avgDeliveryPct30D = 35 + Math.random() * 15;
      const trends = ['Rising', 'Falling', 'Stable'] as const;
      const priceTrends = ['Up', 'Down', 'Flat'] as const;
      const signals = ['Strong Accumulation', 'Accumulation', 'Neutral', 'Distribution', 'Strong Distribution'] as const;
      const divergences = ['Bullish', 'Bearish', 'None'] as const;
      const qualities = ['High', 'Medium', 'Low'] as const;
      const sizeTrends = ['Increasing', 'Decreasing', 'Stable'] as const;
      const accScore = Math.floor(Math.random() * 100);
      const distScore = 100 - accScore;
      return {
        symbol, asOf,
        currentDeliveryPct,
        avgDeliveryPct30D,
        deliveryPctile: Math.floor(30 + Math.random() * 50),
        deliveryTrend: trends[Math.floor(Math.random() * 3)],
        deliveryTrendStrength: Math.floor(30 + Math.random() * 50),
        accumulationScore: accScore,
        distributionScore: distScore,
        smartMoneySignal: accScore > 70 ? 'Strong Accumulation' : accScore > 50 ? 'Accumulation' : accScore > 30 ? 'Neutral' : accScore > 15 ? 'Distribution' : 'Strong Distribution',
        priceTrend: priceTrends[Math.floor(Math.random() * 3)],
        deliveryDivergence: divergences[Math.floor(Math.random() * 3)],
        divergenceStrength: Math.floor(20 + Math.random() * 60),
        volumeQuality: qualities[Math.floor(Math.random() * 3)],
        avgTradeSize: 5000 + Math.floor(Math.random() * 15000),
        tradeSizeTrend: sizeTrends[Math.floor(Math.random() * 3)],
        history: Array.from({ length: 20 }, (_, i) => ({
          date: new Date(Date.now() - (20 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          close: basePrice * (0.95 + Math.random() * 0.1),
          volume: Math.floor(500000 + Math.random() * 2000000),
          deliveryQty: Math.floor(200000 + Math.random() * 800000),
          deliveryPct: 25 + Math.random() * 45,
          avgTradeSize: 5000 + Math.floor(Math.random() * 10000)
        })),
        insights: ['High delivery with rising prices suggests accumulation', 'Smart money activity detected']
      };
    },
    
    'trade-flow-intel': () => {
      const tradeSizeSignals = ['Institutional', 'Mixed', 'Retail'] as const;
      const volumeSignals = ['Surge', 'High', 'Normal', 'Low', 'Dry'] as const;
      const flowBiases = ['Institutional Buying', 'Institutional Selling', 'Retail Driven', 'Mixed'] as const;
      const activityTypes = ['Large Buyer', 'Large Seller', 'Block Deal', 'Bulk Deal'] as const;
      const volumeToday = Math.floor(500000 + Math.random() * 3000000);
      const volumeAvg20D = Math.floor(400000 + Math.random() * 1500000);
      const volumeRatio = volumeToday / volumeAvg20D;
      const institutionalPct = 20 + Math.random() * 50;
      return {
        symbol, asOf,
        avgTradeSize: 8000 + Math.floor(Math.random() * 20000),
        avgTradeSizePctile: Math.floor(30 + Math.random() * 50),
        tradeSizeSignal: tradeSizeSignals[Math.floor(Math.random() * 3)],
        volumeToday,
        volumeAvg20D,
        volumeRatio,
        volumeSignal: volumeRatio > 2 ? 'Surge' : volumeRatio > 1.3 ? 'High' : volumeRatio > 0.7 ? 'Normal' : volumeRatio > 0.3 ? 'Low' : 'Dry',
        institutionalFlowPct: institutionalPct,
        retailFlowPct: 100 - institutionalPct,
        flowBias: flowBiases[Math.floor(Math.random() * 4)],
        tradeDistribution: [
          { bucket: '₹0-10K', percentage: 30 + Math.random() * 20, type: 'Retail' as const },
          { bucket: '₹10K-50K', percentage: 20 + Math.random() * 15, type: 'HNI' as const },
          { bucket: '₹50K-1L', percentage: 15 + Math.random() * 10, type: 'HNI' as const },
          { bucket: '₹1L+', percentage: 15 + Math.random() * 15, type: 'Institutional' as const }
        ],
        history: Array.from({ length: 15 }, (_, i) => ({
          date: new Date(Date.now() - (15 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          avgTradeSize: 5000 + Math.floor(Math.random() * 15000),
          volume: Math.floor(300000 + Math.random() * 2000000),
          close: basePrice * (0.95 + Math.random() * 0.1),
          turnover: Math.floor(50000000 + Math.random() * 200000000)
        })),
        unusualActivity: Math.random() > 0.7,
        unusualActivityType: Math.random() > 0.7 ? activityTypes[Math.floor(Math.random() * 4)] : undefined,
        insights: ['Elevated institutional activity detected', 'Trade sizes above average suggest smart money participation']
      };
    },
    
    'playbook-builder': () => {
      const styles = ['scalper', 'intraday', 'swing', 'positional', 'investor'] as const;
      return {
        instrument: symbol,
        currentPrice: basePrice,
        atr: basePrice * (0.015 + Math.random() * 0.02),
        selectedStyle: styles[Math.floor(Math.random() * 5)]
      };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // RISK CARDS
    // ═══════════════════════════════════════════════════════════════════════
    'risk-health-dashboard': () => {
      const riskLevels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'] as const;
      const statuses = ['good', 'warning', 'danger'] as const;
      const severities = ['critical', 'warning', 'info'] as const;
      
      const createItem = (name: string, threshold: number) => {
        const value = threshold * (0.5 + Math.random() * 1);
        return {
          name,
          value,
          threshold,
          status: value >= threshold * 1.2 ? 'good' : value >= threshold * 0.8 ? 'warning' : 'danger'
        };
      };
      
      const financialScore = 50 + Math.floor(Math.random() * 40);
      const operationalScore = 50 + Math.floor(Math.random() * 40);
      const marketScore = 50 + Math.floor(Math.random() * 40);
      const governanceScore = 50 + Math.floor(Math.random() * 40);
      const overallScore = Math.floor((financialScore + operationalScore + marketScore + governanceScore) / 4);
      
      return {
        symbol, asOf,
        overallRiskScore: overallScore,
        riskLevel: overallScore >= 80 ? 'Very Low' : overallScore >= 65 ? 'Low' : overallScore >= 50 ? 'Moderate' : overallScore >= 35 ? 'High' : 'Very High',
        categories: {
          financial: {
            score: financialScore,
            items: [
              createItem('Debt/Equity', 1.0),
              createItem('Interest Coverage', 3.0),
              createItem('Current Ratio', 1.5)
            ]
          },
          operational: {
            score: operationalScore,
            items: [
              createItem('Asset Turnover', 1.0),
              createItem('Inventory Days', 60),
              createItem('Receivable Days', 45)
            ]
          },
          market: {
            score: marketScore,
            items: [
              createItem('Beta', 1.0),
              createItem('Volatility', 25),
              createItem('Liquidity', 500000)
            ]
          },
          governance: {
            score: governanceScore,
            items: [
              createItem('Promoter Holding', 50),
              createItem('Pledge Ratio', 10),
              createItem('Independent Directors', 50)
            ]
          }
        },
        radarData: [
          { category: 'Financial', risk: 100 - financialScore },
          { category: 'Operational', risk: 100 - operationalScore },
          { category: 'Market', risk: 100 - marketScore },
          { category: 'Governance', risk: 100 - governanceScore }
        ],
        alerts: overallScore < 50 
          ? [{ message: 'Elevated risk detected', severity: 'warning' }]
          : []
      };
    },
    
    'drawdown-var': () => {
      const currentDD = -(Math.random() * 15);
      const maxDD = -(15 + Math.random() * 25);
      return {
        symbol, asOf,
        currentDrawdown: currentDD,
        maxDrawdown: maxDD,
        maxDrawdownDate: '2023-03-15',
        recoveryDays: currentDD > -5 ? null : Math.floor(30 + Math.random() * 60),
        var95_1d: -(1.5 + Math.random() * 2.5),
        var99_1d: -(2.5 + Math.random() * 4),
        cvar95: -(2 + Math.random() * 3),
        volatility30d: 15 + Math.random() * 20,
        volatility90d: 18 + Math.random() * 15,
        beta: 0.8 + Math.random() * 0.6,
        drawdownHistory: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          drawdown: -(Math.random() * 20)
        })),
        stressScenarios: [
          { scenario: '2008 Financial Crisis', impact: -(35 + Math.random() * 15) },
          { scenario: 'COVID-19 Crash', impact: -(25 + Math.random() * 15) },
          { scenario: '10% Market Correction', impact: -(8 + Math.random() * 5) }
        ]
      };
    },
    
    'financial-stress-radar': () => {
      const stressScore = 20 + Math.floor(Math.random() * 50);
      type StatusType = 'ok' | 'warning' | 'critical';
      const getStatus = (val: number, goodThreshold: number): StatusType => 
        val >= goodThreshold * 1.2 ? 'ok' : val >= goodThreshold ? 'warning' : 'critical';
      
      const interestCov = 3 + Math.random() * 7;
      const currentRatio = 1 + Math.random() * 1.5;
      const quickRatio = 0.8 + Math.random() * 1;
      const debtToEbitda = 1 + Math.random() * 4;
      const cashBurn = -50 + Math.random() * 150;
      const workingCapital = 500 + Math.random() * 2000;
      
      return {
        symbol, asOf,
        stressScore,
        riskLevel: stressScore < 25 ? 'Safe' : stressScore < 45 ? 'Watch' : stressScore < 65 ? 'Elevated' : 'Critical',
        indicators: {
          interestCoverage: { value: interestCov, threshold: 3, status: getStatus(interestCov, 3) },
          currentRatio: { value: currentRatio, threshold: 1.2, status: getStatus(currentRatio, 1.2) },
          quickRatio: { value: quickRatio, threshold: 0.8, status: getStatus(quickRatio, 0.8) },
          cashBurn: { value: cashBurn, threshold: 0, status: cashBurn > 0 ? 'ok' : cashBurn > -50 ? 'warning' : 'critical' },
          debtToEbitda: { value: debtToEbitda, threshold: 3, status: debtToEbitda < 3 ? 'ok' : debtToEbitda < 4.5 ? 'warning' : 'critical' },
          workingCapital: { value: workingCapital, threshold: 500, status: workingCapital > 1000 ? 'ok' : workingCapital > 500 ? 'warning' : 'critical' }
        },
        radarData: [
          { metric: 'Liquidity', value: 70 + Math.random() * 25, fullMark: 100 },
          { metric: 'Leverage', value: 60 + Math.random() * 30, fullMark: 100 },
          { metric: 'Coverage', value: 65 + Math.random() * 30, fullMark: 100 },
          { metric: 'Cashflow', value: 55 + Math.random() * 35, fullMark: 100 },
          { metric: 'Profitability', value: 60 + Math.random() * 30, fullMark: 100 }
        ],
        earlyWarnings: stressScore > 35 ? [
          { warning: 'Monitor working capital trends', severity: 'medium' as const, trend: 'stable' as const },
          { warning: 'Debt maturity in 12 months', severity: 'high' as const, trend: 'worsening' as const }
        ] : [],
        peerComparison: {
          company: stressScore,
          sectorMedian: stressScore + Math.floor(Math.random() * 15) - 5,
          sectorWorst: stressScore + 20 + Math.floor(Math.random() * 20)
        }
      };
    },
    
    'bankruptcy-health': () => {
      const altmanZ = 1.5 + Math.random() * 3;
      const zones = ['Safe', 'Grey', 'Distress'] as const;
      return {
        symbol, asOf,
        altmanZScore: altmanZ,
        zone: altmanZ > 2.99 ? 'Safe' : altmanZ > 1.81 ? 'Grey' : 'Distress',
        probability: altmanZ > 2.99 ? Math.random() * 5 : altmanZ > 1.81 ? 10 + Math.random() * 20 : 30 + Math.random() * 40,
        components: {
          workingCapitalRatio: 0.1 + Math.random() * 0.3,
          retainedEarningsRatio: 0.2 + Math.random() * 0.4,
          ebitRatio: 0.05 + Math.random() * 0.15,
          marketValueRatio: 0.5 + Math.random() * 1.5,
          salesRatio: 0.8 + Math.random() * 1.2
        },
        historicalZ: [
          { period: 'Q1 2023', zScore: altmanZ - 0.3 + Math.random() * 0.6 },
          { period: 'Q2 2023', zScore: altmanZ - 0.2 + Math.random() * 0.4 },
          { period: 'Q3 2023', zScore: altmanZ - 0.1 + Math.random() * 0.3 },
          { period: 'Q4 2023', zScore: altmanZ - 0.05 + Math.random() * 0.2 },
          { period: 'Q1 2024', zScore: altmanZ }
        ],
        peerComparison: [
          { symbol: 'INFY', zScore: 2.5 + Math.random() * 1.5, zone: zones[Math.floor(Math.random() * 3)] },
          { symbol: 'WIPRO', zScore: 2.2 + Math.random() * 1.2, zone: zones[Math.floor(Math.random() * 3)] },
          { symbol: 'HCLTECH', zScore: 2.8 + Math.random() * 1, zone: zones[Math.floor(Math.random() * 3)] }
        ],
        score
      };
    },
    
    'working-capital-health': () => {
      const currentRatio = 1 + Math.random() * 1.5;
      const quickRatio = 0.8 + Math.random() * 1;
      const cashRatio = 0.3 + Math.random() * 0.6;
      const dso = 20 + Math.floor(Math.random() * 40);
      const dio = 30 + Math.floor(Math.random() * 50);
      const dpo = 20 + Math.floor(Math.random() * 40);
      const ccc = dso + dio - dpo;
      const workingCapital = 500 + Math.floor(Math.random() * 3000);
      const healthScore = Math.min(100, Math.max(0, currentRatio * 30 + quickRatio * 20 + 20));
      const trends = ['Improving', 'Stable', 'Worsening'] as const;
      const statuses = ['Healthy', 'Adequate', 'Tight', 'Stressed'] as const;
      return {
        symbol, asOf,
        healthScore,
        status: currentRatio >= 1.5 ? 'Healthy' : currentRatio >= 1.2 ? 'Adequate' : currentRatio >= 1 ? 'Tight' : 'Stressed',
        currentMetrics: {
          currentRatio,
          quickRatio,
          cashRatio,
          workingCapital,
          netWorkingCapitalDays: ccc
        },
        cashConversionCycle: {
          dso, dio, dpo,
          ccc,
          trend: trends[Math.floor(Math.random() * 3)]
        },
        historicalWC: [
          { period: 'FY2021', workingCapital: workingCapital - 200, currentRatio: currentRatio - 0.15 },
          { period: 'FY2022', workingCapital: workingCapital - 100, currentRatio: currentRatio - 0.1 },
          { period: 'FY2023', workingCapital: workingCapital - 50, currentRatio: currentRatio - 0.05 },
          { period: 'FY2024', workingCapital, currentRatio }
        ],
        liquidityRunway: {
          months: 6 + Math.floor(Math.random() * 18),
          cashBurnRate: Math.random() > 0.5 ? 0 : 50 + Math.floor(Math.random() * 100)
        }
      };
    },
    
    'leverage-history': () => {
      const debtToEquity = 0.3 + Math.random() * 1.2;
      const debtToEbitda = 1 + Math.random() * 4;
      const interestCoverage = 2 + Math.random() * 8;
      const leverageScore = Math.max(0, Math.min(100, 100 - debtToEquity * 40));
      const riskLevels = ['Low', 'Moderate', 'High', 'Critical'] as const;
      return {
        symbol, asOf,
        leverageScore,
        riskLevel: debtToEquity < 0.5 ? 'Low' : debtToEquity < 1 ? 'Moderate' : debtToEquity < 1.5 ? 'High' : 'Critical',
        currentMetrics: {
          debtToEquity,
          debtToEbitda,
          interestCoverage,
          netDebtToEbitda: debtToEbitda - 0.5 + Math.random()
        },
        historicalLeverage: [
          { period: 'FY2021', debtToEquity: debtToEquity + 0.2, interestCoverage: interestCoverage - 1, totalDebt: 5000 + Math.random() * 3000 },
          { period: 'FY2022', debtToEquity: debtToEquity + 0.1, interestCoverage: interestCoverage - 0.5, totalDebt: 4500 + Math.random() * 2500 },
          { period: 'FY2023', debtToEquity: debtToEquity + 0.05, interestCoverage: interestCoverage - 0.2, totalDebt: 4000 + Math.random() * 2000 },
          { period: 'FY2024', debtToEquity, interestCoverage, totalDebt: 3500 + Math.random() * 1500 }
        ],
        debtBreakdown: {
          shortTerm: 500 + Math.floor(Math.random() * 500),
          longTerm: 2500 + Math.floor(Math.random() * 2000),
          secured: 1500 + Math.floor(Math.random() * 1000),
          unsecured: 1000 + Math.floor(Math.random() * 1000)
        },
        covenants: {
          status: interestCoverage > 3 ? 'Compliant' : interestCoverage > 2 ? 'Near Breach' : 'Breached',
          headroom: 20 + Math.random() * 50,
          details: 'Interest coverage covenant at 2.5x minimum'
        },
        maturitySchedule: [
          { year: '2024', amount: 300 + Math.floor(Math.random() * 200) },
          { year: '2025', amount: 500 + Math.floor(Math.random() * 300) },
          { year: '2026', amount: 400 + Math.floor(Math.random() * 250) },
          { year: '2027', amount: 600 + Math.floor(Math.random() * 400) },
          { year: '2028+', amount: 1200 + Math.floor(Math.random() * 800) }
        ]
      };
    },
    
    'cashflow-stability-index': () => {
      const stabilityIndex = 50 + Math.floor(Math.random() * 45);
      const ocfVolatility = 10 + Math.floor(Math.random() * 30);
      const fcfVolatility = ocfVolatility + 5 + Math.random() * 10;
      const totalYears = 5;
      const ocfPositiveYears = 3 + Math.floor(Math.random() * 3);
      const grades = ['A', 'B', 'C', 'D', 'F'] as const;
      const trends = ['Growing', 'Stable', 'Declining', 'Volatile'] as const;
      return {
        symbol, asOf,
        stabilityIndex,
        grade: stabilityIndex >= 80 ? 'A' : stabilityIndex >= 65 ? 'B' : stabilityIndex >= 50 ? 'C' : stabilityIndex >= 35 ? 'D' : 'F',
        metrics: {
          ocfVolatility,
          fcfVolatility,
          ocfPositiveYears,
          totalYears,
          coefficientOfVariation: 0.1 + Math.random() * 0.4
        },
        historicalCashflow: [
          { period: 'FY2020', ocf: 200 + Math.random() * 300, fcf: 100 + Math.random() * 200, capex: 80 + Math.random() * 100 },
          { period: 'FY2021', ocf: 250 + Math.random() * 300, fcf: 120 + Math.random() * 200, capex: 90 + Math.random() * 110 },
          { period: 'FY2022', ocf: 280 + Math.random() * 300, fcf: 140 + Math.random() * 200, capex: 100 + Math.random() * 120 },
          { period: 'FY2023', ocf: 300 + Math.random() * 300, fcf: 160 + Math.random() * 200, capex: 110 + Math.random() * 130 },
          { period: 'FY2024', ocf: 320 + Math.random() * 300, fcf: 180 + Math.random() * 200, capex: 120 + Math.random() * 140 }
        ],
        consistency: {
          streakYears: ocfPositiveYears,
          averageOCF: 200 + Math.floor(Math.random() * 800),
          trend: trends[Math.floor(Math.random() * 4)]
        },
        qualityIndicators: {
          ocfToNetIncome: 70 + Math.random() * 30,
          fcfToOcf: 40 + Math.random() * 50,
          capexIntensity: 15 + Math.random() * 25
        }
      };
    },
    
    'fno-risk-advisor': () => {
      const productTypes = ['index_options', 'stock_options', 'index_futures', 'stock_futures'] as const;
      const timeHorizons = ['intraday', 'weekly', 'monthly'] as const;
      const productType = productTypes[Math.floor(Math.random() * 4)];
      const lotSize = productType.includes('index') ? 50 : 500;
      const marginRequired = productType.includes('options') ? basePrice * lotSize * 0.15 : basePrice * lotSize * 0.2;
      return {
        capital: 100000 + Math.floor(Math.random() * 400000),
        productType,
        instrument: symbol,
        lotSize,
        currentPrice: basePrice,
        marginRequired,
        avgDailyRange: 1.5 + Math.random() * 2.5,
        maxMonthlyLossPercent: 5 + Math.random() * 10,
        timeHorizon: timeHorizons[Math.floor(Math.random() * 3)]
      };
    },
    
    'trade-expectancy': () => {
      const productTypes = ['equity_intraday', 'equity_delivery', 'futures', 'options_buy', 'options_sell'] as const;
      return {
        winRate: 40 + Math.random() * 25,
        avgWinPercent: 2 + Math.random() * 4,
        avgLossPercent: 1 + Math.random() * 2,
        tradesPerMonth: 5 + Math.floor(Math.random() * 20),
        capitalPerTrade: 10000 + Math.floor(Math.random() * 40000),
        productType: productTypes[Math.floor(Math.random() * 5)]
      };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // GROWTH CARDS
    // ═══════════════════════════════════════════════════════════════════════
    'growth-summary': () => {
      const revenueGrowth3Y = 8 + Math.random() * 20;
      const growthScore = Math.min(100, Math.max(0, 30 + revenueGrowth3Y * 2));
      const tiers = ['Hyper Growth', 'High Growth', 'Moderate', 'Slow', 'Declining'] as const;
      return {
        symbol, asOf,
        growthScore,
        growthTier: revenueGrowth3Y > 25 ? 'Hyper Growth' : revenueGrowth3Y > 15 ? 'High Growth' : revenueGrowth3Y > 8 ? 'Moderate' : revenueGrowth3Y > 0 ? 'Slow' : 'Declining',
        metrics: {
          revenueGrowth3Y,
          revenueGrowth5Y: revenueGrowth3Y - 2 + Math.random() * 4,
          epsGrowth3Y: revenueGrowth3Y + Math.random() * 10 - 5,
          epsGrowth5Y: revenueGrowth3Y - 3 + Math.random() * 6,
          fcfGrowth3Y: revenueGrowth3Y - 5 + Math.random() * 10,
          bookValueGrowth5Y: 5 + Math.random() * 10
        },
        historicalGrowth: [
          { year: '2020', revenue: 8000, earnings: 800, fcf: 600 },
          { year: '2021', revenue: 9200, earnings: 950, fcf: 720 },
          { year: '2022', revenue: 10500, earnings: 1100, fcf: 850 },
          { year: '2023', revenue: 12000, earnings: 1300, fcf: 1000 },
          { year: '2024', revenue: 13800, earnings: 1550, fcf: 1200 }
        ],
        forwardEstimates: {
          revenueGrowthNTM: revenueGrowth3Y - 2 + Math.random() * 8,
          epsGrowthNTM: revenueGrowth3Y + Math.random() * 5,
          analystRevisions: Math.random() * 10 - 3
        },
        peerComparison: {
          avgRevenueGrowth: revenueGrowth3Y - 5 + Math.random() * 10,
          percentile: 40 + Math.random() * 40
        }
      };
    },
    
    'earnings-quality': () => {
      const grades = ['Excellent', 'Good', 'Average', 'Poor', 'Concerning'] as const;
      const signals = ['good', 'neutral', 'bad'] as const;
      const qualityScore = Math.floor(40 + Math.random() * 50);
      return {
        symbol, asOf,
        qualityScore,
        qualityGrade: qualityScore >= 80 ? 'Excellent' : qualityScore >= 60 ? 'Good' : qualityScore >= 40 ? 'Average' : qualityScore >= 20 ? 'Poor' : 'Concerning',
        components: {
          accrualRatio: { value: Math.random() * 0.15 - 0.05, score: 70 + Math.floor(Math.random() * 30), signal: signals[Math.floor(Math.random() * 3)] },
          cashConversion: { value: 80 + Math.random() * 30, score: 70 + Math.floor(Math.random() * 30), signal: signals[Math.floor(Math.random() * 3)] },
          earningsPersistence: { value: 0.7 + Math.random() * 0.25, score: 70 + Math.floor(Math.random() * 30), signal: signals[Math.floor(Math.random() * 3)] },
          revenueQuality: { value: 0.8 + Math.random() * 0.15, score: 70 + Math.floor(Math.random() * 30), signal: signals[Math.floor(Math.random() * 3)] },
          accountingConservatism: { value: 0.6 + Math.random() * 0.3, score: 70 + Math.floor(Math.random() * 30), signal: signals[Math.floor(Math.random() * 3)] }
        },
        redFlags: Math.random() > 0.5 ? [
          { flag: 'Receivables growing faster than revenue', severity: 'medium' as const },
          { flag: 'Inventory days increasing', severity: 'low' as const }
        ] : [],
        beneishMScore: -2.5 + Math.random() * 2,
        manipulationRisk: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Moderate' : 'Low'
      };
    },
    
    'earnings-stability': () => {
      const grades = ['High', 'Moderate', 'Low', 'Volatile'] as const;
      const epsVolatility = 5 + Math.random() * 25;
      const stabilityScore = Math.max(0, 100 - epsVolatility * 2);
      return {
        symbol, asOf,
        stabilityScore,
        stabilityGrade: stabilityScore >= 75 ? 'High' : stabilityScore >= 50 ? 'Moderate' : stabilityScore >= 25 ? 'Low' : 'Volatile',
        metrics: {
          epsVolatility,
          coefficientOfVariation: 0.1 + Math.random() * 0.3,
          consecutiveGrowthYears: Math.floor(Math.random() * 8),
          beatRate: 50 + Math.random() * 40
        },
        historicalEPS: Array.from({ length: 8 }, (_, i) => {
          const actual = 10 + Math.random() * 10;
          return {
            period: `Q${(i % 4) + 1} FY${2022 + Math.floor(i / 4)}`,
            actual,
            estimate: actual * (0.95 + Math.random() * 0.1)
          };
        }),
        trendLine: {
          slope: 0.5 + Math.random() * 1.5,
          r2: 0.6 + Math.random() * 0.35
        },
        surpriseHistory: Array.from({ length: 8 }, (_, i) => ({
          period: `Q${(i % 4) + 1} FY${2022 + Math.floor(i / 4)}`,
          surprise: (Math.random() - 0.3) * 15
        }))
      };
    },
    
    'management-quality': () => {
      const overallScore = 50 + Math.floor(Math.random() * 40);
      const grades = ['A', 'B', 'C', 'D', 'F'] as const;
      const sentiments = ['Bullish', 'Bearish', 'Neutral'] as const;
      const promoterHolding = 45 + Math.random() * 25;
      return {
        symbol, asOf,
        overallScore,
        grade: overallScore >= 80 ? 'A' : overallScore >= 65 ? 'B' : overallScore >= 50 ? 'C' : overallScore >= 35 ? 'D' : 'F',
        promoterHolding: {
          current: promoterHolding,
          change3M: Math.random() * 4 - 2,
          pledged: Math.random() * 15
        },
        insiderActivity: {
          netBuys: Math.floor(Math.random() * 10 - 3),
          totalTransactions: Math.floor(5 + Math.random() * 15),
          sentiment: sentiments[Math.floor(Math.random() * 3)]
        },
        governance: {
          boardIndependence: 40 + Math.random() * 30,
          auditQuality: ['Big 4', 'Reputed', 'Others'][Math.floor(Math.random() * 3)],
          relatedPartyFlag: Math.random() > 0.7
        },
        capitalAllocation: {
          roic5Y: 12 + Math.random() * 15,
          reinvestmentRate: 30 + Math.random() * 40,
          dividendConsistency: 3 + Math.floor(Math.random() * 8)
        },
        recentTransactions: [
          { date: '2024-01-15', type: Math.random() > 0.4 ? 'Buy' : 'Sell', insider: 'CEO', value: 50 + Math.floor(Math.random() * 200) },
          { date: '2024-01-10', type: Math.random() > 0.4 ? 'Buy' : 'Sell', insider: 'Director', value: 20 + Math.floor(Math.random() * 100) },
          { date: '2023-12-20', type: Math.random() > 0.4 ? 'Buy' : 'Sell', insider: 'CFO', value: 30 + Math.floor(Math.random() * 80) }
        ]
      };
    },
    
    'efficiency-dashboard': () => {
      const operatingMargin = 10 + Math.random() * 15;
      const overallScore = Math.min(100, 30 + operatingMargin * 3);
      const gross = 25 + Math.random() * 20;
      const net = operatingMargin * 0.7;
      return {
        symbol, asOf,
        overallScore,
        grade: overallScore >= 80 ? 'A' : overallScore >= 65 ? 'B' : overallScore >= 50 ? 'C' : 'D',
        margins: {
          gross,
          operating: operatingMargin,
          net,
          ebitda: operatingMargin + 3 + Math.random() * 5
        },
        marginTrends: [
          { period: 'FY2021', gross: gross - 2, operating: operatingMargin - 1.5, net: net - 1 },
          { period: 'FY2022', gross: gross - 1, operating: operatingMargin - 0.8, net: net - 0.5 },
          { period: 'FY2023', gross: gross - 0.5, operating: operatingMargin - 0.3, net: net - 0.2 },
          { period: 'FY2024', gross, operating: operatingMargin, net }
        ],
        efficiencyRatios: {
          assetTurnover: 0.8 + Math.random() * 0.8,
          inventoryTurnover: 4 + Math.random() * 8,
          receivablesTurnover: 6 + Math.random() * 6,
          payablesTurnover: 5 + Math.random() * 5
        },
        workingCapitalDays: {
          dso: 30 + Math.floor(Math.random() * 45),
          dio: 40 + Math.floor(Math.random() * 60),
          dpo: 35 + Math.floor(Math.random() * 40),
          ccc: 35 + Math.floor(Math.random() * 50)
        },
        peerComparison: {
          operatingMargin: { company: operatingMargin, peer: operatingMargin - 3 + Math.random() * 6 },
          assetTurnover: { company: 0.8 + Math.random() * 0.4, peer: 0.7 + Math.random() * 0.4 }
        }
      };
    },
    
    'capital-allocation': () => {
      const roic = 10 + Math.random() * 15;
      const wacc = 8 + Math.random() * 4;
      const spread = roic - wacc;
      const verdicts = ['Value Creator', 'Value Neutral', 'Value Destroyer'] as const;
      return {
        symbol, asOf,
        roic,
        wacc,
        spread,
        verdict: spread > 3 ? 'Value Creator' : spread > -1 ? 'Value Neutral' : 'Value Destroyer',
        allocation: {
          reinvestment: 30 + Math.random() * 30,
          dividends: 15 + Math.random() * 25,
          buybacks: Math.random() * 15,
          debtRepay: 5 + Math.random() * 15,
          ma: Math.random() * 20
        },
        historicalROIC: [
          { year: '2020', roic: roic - 2 + Math.random() * 2, wacc: wacc + 0.5 },
          { year: '2021', roic: roic - 1.5 + Math.random() * 2, wacc: wacc + 0.3 },
          { year: '2022', roic: roic - 1 + Math.random() * 2, wacc: wacc + 0.1 },
          { year: '2023', roic: roic - 0.5 + Math.random() * 1, wacc },
          { year: '2024', roic, wacc }
        ],
        reinvestmentEfficiency: {
          incrementalROIC: roic + Math.random() * 5 - 2,
          capitalEfficiency: 0.7 + Math.random() * 0.25
        }
      };
    },
    
    'sales-profit-cash': () => {
      const verdicts = ['Strong', 'Moderate', 'Weak', 'Divergent'] as const;
      const trends = ['Improving', 'Stable', 'Declining'] as const;
      const alignmentScore = Math.floor(40 + Math.random() * 50);
      const profitToSales = 8 + Math.random() * 15;
      const cashToProfit = 70 + Math.random() * 50;
      return {
        symbol, asOf,
        alignmentScore,
        verdict: alignmentScore >= 75 ? 'Strong' : alignmentScore >= 50 ? 'Moderate' : alignmentScore >= 25 ? 'Weak' : 'Divergent',
        currentRatios: {
          profitToSales,
          cashToProfit,
          cashToSales: profitToSales * cashToProfit / 100
        },
        historicalFlow: Array.from({ length: 5 }, (_, i) => {
          const revenue = 10000 + Math.random() * 5000;
          const profit = revenue * (0.08 + Math.random() * 0.12);
          const ocf = profit * (0.8 + Math.random() * 0.4);
          return {
            period: `FY${2020 + i}`,
            revenue,
            profit,
            ocf,
            fcf: ocf * (0.6 + Math.random() * 0.3)
          };
        }),
        conversionQuality: {
          avgCashConversion: 75 + Math.random() * 30,
          cashConversionTrend: trends[Math.floor(Math.random() * 3)],
          accrualRatio: Math.random() * 0.1 - 0.03
        },
        alerts: Math.random() > 0.6 ? ['Cash flow lagging profit growth', 'Working capital increasing'] : []
      };
    },
    
    'profit-vs-cash-divergence': () => {
      const netIncome = 1500 + Math.random() * 2000;
      const ocf = netIncome * (0.7 + Math.random() * 0.6);
      const divergencePct = ((ocf - netIncome) / netIncome) * 100;
      const divergenceScore = Math.max(0, Math.min(100, 50 + divergencePct));
      const riskLevels = ['Low', 'Moderate', 'High', 'Critical'] as const;
      return {
        symbol, asOf,
        divergenceScore,
        riskLevel: Math.abs(divergencePct) < 15 ? 'Low' : Math.abs(divergencePct) < 30 ? 'Moderate' : Math.abs(divergencePct) < 50 ? 'High' : 'Critical',
        currentDivergence: {
          netIncome,
          operatingCashFlow: ocf,
          divergencePct
        },
        historicalDivergence: [
          { period: 'FY2021', profit: 1200, ocf: 1100, divergence: -8.3 },
          { period: 'FY2022', profit: 1350, ocf: 1400, divergence: 3.7 },
          { period: 'FY2023', profit: 1450, ocf: 1300, divergence: -10.3 },
          { period: 'FY2024', profit: netIncome, ocf: ocf, divergence: divergencePct }
        ],
        redFlags: divergencePct < -20 ? [
          { flag: 'OCF below Net Income', severity: 'warning' as const, detail: 'Cash generation not keeping pace with profits' },
          { flag: 'Rising receivables', severity: 'warning' as const, detail: 'DSO increased 15% YoY' }
        ] : [],
        drivers: {
          receivablesChange: Math.random() * 300 - 150,
          inventoryChange: Math.random() * 200 - 100,
          payablesChange: Math.random() * 150 - 75,
          otherAccruals: Math.random() * 100 - 50
        }
      };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // CASHFLOW CARDS
    // ═══════════════════════════════════════════════════════════════════════
    'fcf-health': () => {
      const fcf = 500 + Math.floor(Math.random() * 3000);
      const fcfYield = 2 + Math.random() * 6;
      const fcfMargin = 8 + Math.random() * 15;
      const fcfGrowth = Math.random() * 40 - 10;
      const healthScore = Math.min(100, Math.max(0, 50 + fcfMargin * 2 + fcfGrowth * 0.5));
      const grades = ['Excellent', 'Good', 'Fair', 'Poor'] as const;
      return {
        symbol, asOf,
        healthScore,
        grade: healthScore >= 75 ? 'Excellent' : healthScore >= 55 ? 'Good' : healthScore >= 35 ? 'Fair' : 'Poor',
        currentMetrics: {
          fcf,
          fcfYield,
          fcfMargin,
          fcfGrowth
        },
        historicalFCF: [
          { period: 'FY2021', fcf: fcf * 0.7, ocf: fcf * 0.85, capex: fcf * 0.15 },
          { period: 'FY2022', fcf: fcf * 0.85, ocf: fcf * 1.0, capex: fcf * 0.15 },
          { period: 'FY2023', fcf: fcf * 0.95, ocf: fcf * 1.1, capex: fcf * 0.15 },
          { period: 'FY2024', fcf, ocf: fcf * 1.2, capex: fcf * 0.2 }
        ],
        sustainability: {
          avgFcfMargin: fcfMargin - 1 + Math.random() * 2,
          volatility: 10 + Math.random() * 20,
          consistency: 70 + Math.random() * 25
        },
        usage: {
          dividends: 20 + Math.random() * 25,
          buybacks: Math.random() * 15,
          debtRepay: 10 + Math.random() * 20,
          acquisitions: Math.random() * 10,
          reinvestment: 30 + Math.random() * 20
        }
      };
    },
    
    'cash-conversion-cycle': () => {
      const dso = 20 + Math.floor(Math.random() * 40);
      const dio = 30 + Math.floor(Math.random() * 50);
      const dpo = 20 + Math.floor(Math.random() * 40);
      const ccc = dso + dio - dpo;
      const directions = ['Improving', 'Stable', 'Worsening'] as const;
      const efficiencies = ['Excellent', 'Good', 'Average', 'Poor'] as const;
      return {
        symbol, asOf,
        efficiency: ccc < 40 ? 'Excellent' : ccc < 60 ? 'Good' : ccc < 80 ? 'Average' : 'Poor',
        current: { dso, dio, dpo, ccc },
        historical: [
          { period: 'Q1 FY24', dso: dso + 5, dio: dio + 3, dpo: dpo + 2, ccc: ccc + 6 },
          { period: 'Q2 FY24', dso: dso + 3, dio: dio + 2, dpo: dpo + 1, ccc: ccc + 4 },
          { period: 'Q3 FY24', dso: dso + 1, dio: dio + 1, dpo: dpo, ccc: ccc + 2 },
          { period: 'Q4 FY24', dso, dio, dpo, ccc }
        ],
        peerComparison: {
          company: ccc,
          sectorAvg: ccc + Math.floor(Math.random() * 20) - 10,
          sectorBest: ccc - 15 - Math.floor(Math.random() * 10)
        },
        trend: {
          direction: ccc < 50 ? 'Improving' : ccc > 70 ? 'Worsening' : 'Stable',
          changeYoY: Math.floor(Math.random() * 20) - 10
        },
        breakdown: {
          receivablesAmount: 100 + Math.floor(Math.random() * 500),
          inventoryAmount: 150 + Math.floor(Math.random() * 400),
          payablesAmount: 80 + Math.floor(Math.random() * 300)
        }
      };
    },
    
    'cash-conversion-earnings': () => {
      const ocfToNetIncome = 70 + Math.random() * 40;
      const fcfToNetIncome = 50 + Math.random() * 50;
      const accrualRatio = 5 + Math.random() * 15;
      const grades = ['High', 'Good', 'Moderate', 'Low'] as const;
      return {
        symbol, asOf,
        qualityScore: Math.floor(60 + Math.random() * 30),
        grade: ocfToNetIncome >= 100 ? 'High' : ocfToNetIncome >= 80 ? 'Good' : ocfToNetIncome >= 60 ? 'Moderate' : 'Low',
        currentRatios: {
          ocfToNetIncome,
          fcfToNetIncome,
          accrualRatio
        },
        historical: [
          { period: 'FY2021', netIncome: 1000 + Math.random() * 500, ocf: 900 + Math.random() * 400, conversionRate: ocfToNetIncome - 10 + Math.random() * 5 },
          { period: 'FY2022', netIncome: 1100 + Math.random() * 500, ocf: 1000 + Math.random() * 400, conversionRate: ocfToNetIncome - 5 + Math.random() * 5 },
          { period: 'FY2023', netIncome: 1200 + Math.random() * 500, ocf: 1100 + Math.random() * 400, conversionRate: ocfToNetIncome - 2 + Math.random() * 5 },
          { period: 'FY2024', netIncome: 1300 + Math.random() * 500, ocf: 1200 + Math.random() * 400, conversionRate: ocfToNetIncome }
        ],
        qualityFlags: [
          { flag: 'Cash Quality', severity: ocfToNetIncome > 90 ? 'positive' : 'neutral', description: 'Operating cash flow tracks earnings' },
          { flag: 'Accrual Level', severity: accrualRatio < 10 ? 'positive' : 'warning', description: `Accrual ratio at ${accrualRatio.toFixed(1)}%` }
        ],
        benchmarks: {
          industryAvg: 85 + Math.random() * 20,
          topQuartile: 110 + Math.random() * 15
        },
        score
      };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // INCOME CARDS
    // ═══════════════════════════════════════════════════════════════════════
    'dividend-crystal-ball': () => {
      const currentYield = 1 + Math.random() * 4;
      const forwardYield = currentYield * (1.02 + Math.random() * 0.08);
      const dividendGrowthRate5Y = 5 + Math.random() * 15;
      const payoutRatio = 20 + Math.random() * 40;
      const consecutiveYearsGrowth = 5 + Math.floor(Math.random() * 15);
      const safeties = ['Very Safe', 'Safe', 'Moderate', 'At Risk', 'Unsafe'] as const;
      const baseDividend = 10 + Math.random() * 20;
      return {
        symbol, asOf,
        currentYield,
        forwardYield,
        dividendGrowthRate5Y,
        payoutRatio,
        consecutiveYearsGrowth,
        dividendSafety: payoutRatio < 40 ? 'Very Safe' : payoutRatio < 55 ? 'Safe' : payoutRatio < 70 ? 'Moderate' : payoutRatio < 85 ? 'At Risk' : 'Unsafe',
        projection: [
          { year: '2025', dividend: baseDividend * 1.08, yieldOnCost: currentYield * 1.08 },
          { year: '2026', dividend: baseDividend * 1.16, yieldOnCost: currentYield * 1.16 },
          { year: '2027', dividend: baseDividend * 1.25, yieldOnCost: currentYield * 1.25 },
          { year: '2028', dividend: baseDividend * 1.35, yieldOnCost: currentYield * 1.35 },
          { year: '2029', dividend: baseDividend * 1.45, yieldOnCost: currentYield * 1.45 }
        ],
        historicalDividends: [
          { year: '2020', dividend: baseDividend * 0.75, growth: 10 },
          { year: '2021', dividend: baseDividend * 0.82, growth: 9 },
          { year: '2022', dividend: baseDividend * 0.90, growth: 10 },
          { year: '2023', dividend: baseDividend * 0.97, growth: 8 },
          { year: '2024', dividend: baseDividend, growth: 3 }
        ],
        incomeScenarios: {
          conservative: baseDividend * 12 * 0.95,
          base: baseDividend * 12,
          optimistic: baseDividend * 12 * 1.10
        },
        nextExDate: '2024-03-01',
        nextPayDate: '2024-03-15',
        nextAmount: baseDividend / 4
      };
    },
    
    'dividend-sip-tracker': () => {
      const monthlyAmount = 5000 + Math.floor(Math.random() * 15000);
      const tenure = 12 + Math.floor(Math.random() * 60);
      const totalInvested = monthlyAmount * tenure;
      const currentValue = totalInvested * (1.1 + Math.random() * 0.3);
      const dividendsReceived = totalInvested * (0.02 + Math.random() * 0.04);
      const currentYieldOnCost = 2 + Math.random() * 3;
      return {
        symbol, asOf,
        sipDetails: {
          monthlyAmount,
          tenure,
          totalInvested,
          currentValue,
          dividendsReceived,
          dividendsReinvested: Math.random() > 0.5
        },
        returns: {
          absoluteReturn: ((currentValue - totalInvested) / totalInvested) * 100,
          xirr: 10 + Math.random() * 15,
          dividendContribution: (dividendsReceived / (currentValue - totalInvested)) * 100
        },
        projection: Array.from({ length: 5 }, (_, i) => ({
          year: `Year ${i + 1}`,
          invested: totalInvested + monthlyAmount * 12 * (i + 1),
          valueWithDRIP: currentValue * Math.pow(1.12, i + 1),
          valueWithoutDRIP: currentValue * Math.pow(1.10, i + 1),
          dividends: dividendsReceived * (i + 1) * 1.08
        })),
        dividendHistory: Array.from({ length: 8 }, (_, i) => ({
          date: new Date(Date.now() - (8 - i) * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          amount: (dividendsReceived / 8) * (0.9 + Math.random() * 0.2),
          yieldOnCost: currentYieldOnCost * (0.8 + i * 0.025)
        })),
        yieldOnCost: {
          current: currentYieldOnCost,
          projected5Y: currentYieldOnCost * 1.5
        }
      };
    },
    
    'income-stability': () => {
      const dividendYield = 1 + Math.random() * 4;
      const payoutRatio = 20 + Math.random() * 50;
      const safetyScore = Math.min(100, Math.max(0, 100 - payoutRatio + dividendYield * 5));
      const ratings = ['Very Safe', 'Safe', 'Borderline', 'Unsafe'] as const;
      const severities = ['low', 'medium', 'high'] as const;
      const consecutiveYears = 5 + Math.floor(Math.random() * 15);
      return {
        symbol, asOf,
        safetyScore,
        rating: safetyScore >= 75 ? 'Very Safe' : safetyScore >= 55 ? 'Safe' : safetyScore >= 35 ? 'Borderline' : 'Unsafe',
        currentMetrics: {
          dividendYield,
          payoutRatio,
          fcfPayoutRatio: payoutRatio * 0.8 + Math.random() * 10,
          dividendCoverage: 100 / payoutRatio
        },
        history: {
          consecutiveYears,
          cutsInLast10Y: Math.floor(Math.random() * 2),
          growthStreak: Math.floor(consecutiveYears * 0.7),
          cagr5Y: 5 + Math.random() * 10
        },
        dividendHistory: [
          { year: '2020', dividend: 10, growth: 8 },
          { year: '2021', dividend: 11, growth: 10 },
          { year: '2022', dividend: 12, growth: 9 },
          { year: '2023', dividend: 13, growth: 8 },
          { year: '2024', dividend: 14, growth: 7 }
        ],
        riskFactors: payoutRatio > 60 ? [
          { factor: 'High payout ratio', severity: 'medium' as const, description: 'Payout ratio above comfortable levels' },
          { factor: 'Earnings volatility', severity: 'low' as const, description: 'Some quarter-to-quarter fluctuation' }
        ] : [],
        sustainability: {
          earningsCoverage: 100 / payoutRatio,
          cashCoverage: 100 / (payoutRatio * 0.8),
          debtImpact: Math.random() * 20
        }
      };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // MACRO / OWNERSHIP CARDS
    // ═══════════════════════════════════════════════════════════════════════
    'shareholding-pattern': () => {
      const promoter = 50 + Math.random() * 20;
      const fii = 10 + Math.random() * 20;
      const dii = 10 + Math.random() * 15;
      const publicPct = 100 - promoter - fii - dii;
      const signalTypes = ['bullish', 'bearish', 'neutral'] as const;
      return {
        symbol, asOf,
        current: {
          promoter,
          promoterPledge: Math.random() * 10,
          fii,
          dii,
          public: publicPct
        },
        changes: {
          promoter: Math.random() * 2 - 1,
          fii: Math.random() * 3 - 1.5,
          dii: Math.random() * 2 - 1,
          public: Math.random() * 2 - 1
        },
        historical: [
          { quarter: 'Q1 FY24', promoter: promoter + 1, fii: fii - 0.5, dii: dii - 0.3 },
          { quarter: 'Q2 FY24', promoter: promoter + 0.5, fii: fii - 0.3, dii: dii },
          { quarter: 'Q3 FY24', promoter: promoter + 0.2, fii: fii - 0.1, dii: dii + 0.2 },
          { quarter: 'Q4 FY24', promoter, fii, dii }
        ],
        topHolders: [
          { name: 'LIC of India', holding: 3 + Math.random() * 5, change: Math.random() * 0.5 - 0.2 },
          { name: 'HDFC AMC', holding: 2 + Math.random() * 3, change: Math.random() * 0.3 - 0.1 },
          { name: 'SBI MF', holding: 1.5 + Math.random() * 2, change: Math.random() * 0.4 }
        ],
        signals: [
          { signal: 'FII accumulation', type: signalTypes[Math.floor(Math.random() * 3)], description: 'FIIs increased stake for 3rd consecutive quarter' },
          { signal: 'Promoter stable', type: 'neutral' as const, description: 'No change in promoter holding' }
        ]
      };
    },
    
    'institutional-flows': () => {
      const sentiments = ['Strong Buy', 'Accumulating', 'Neutral', 'Distributing', 'Selling'] as const;
      const fiiNet = Math.random() * 1000 - 500;
      const diiNet = Math.random() * 800 - 400;
      return {
        symbol, asOf,
        sentiment: sentiments[Math.floor(Math.random() * 5)],
        netFlow: {
          fii: fiiNet,
          dii: diiNet,
          total: fiiNet + diiNet
        },
        dailyFlows: Array.from({ length: 20 }, (_, i) => ({
          date: new Date(Date.now() - (20 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          fii: Math.random() * 200 - 100,
          dii: Math.random() * 150 - 75
        })),
        monthlyTrend: [
          { month: 'Oct 2023', fii: Math.random() * 5000 - 2500, dii: Math.random() * 4000 - 2000 },
          { month: 'Nov 2023', fii: Math.random() * 5000 - 2500, dii: Math.random() * 4000 - 2000 },
          { month: 'Dec 2023', fii: Math.random() * 5000 - 2500, dii: Math.random() * 4000 - 2000 },
          { month: 'Jan 2024', fii: fiiNet, dii: diiNet }
        ],
        activity: {
          fiiDays: { buy: Math.floor(10 + Math.random() * 10), sell: Math.floor(5 + Math.random() * 10) },
          diiDays: { buy: Math.floor(8 + Math.random() * 10), sell: Math.floor(6 + Math.random() * 8) }
        }
      };
    },
    
    'insider-trades': () => {
      const sentiments = ['Bullish', 'Neutral', 'Bearish'] as const;
      const signals = ['bullish', 'bearish', 'neutral'] as const;
      const totalBuys = Math.floor(Math.random() * 10000000);
      const totalSells = Math.floor(Math.random() * 8000000);
      return {
        symbol, asOf,
        sentiment: sentiments[Math.floor(Math.random() * 3)],
        summary: {
          totalBuys,
          totalSells,
          netValue: (totalBuys - totalSells) / 10000000, // in Cr
          transactionCount: Math.floor(5 + Math.random() * 15)
        },
        recentTrades: Array.from({ length: 5 }, (_, i) => {
          const isBuy = Math.random() > 0.4;
          const shares = Math.floor(10000 + Math.random() * 90000);
          const pricePerShare = basePrice * (0.95 + Math.random() * 0.1);
          return {
            date: new Date(Date.now() - (5 - i) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            insider: ['CEO', 'CFO', 'Director', 'Promoter', 'Key Personnel'][i % 5],
            type: isBuy ? 'Buy' : 'Sell',
            shares,
            value: shares * pricePerShare,
            pricePerShare
          };
        }),
        patterns: [
          { pattern: 'Cluster Buying', signal: signals[Math.floor(Math.random() * 3)], detail: 'Multiple insiders bought in same period' },
          { pattern: 'Promoter Activity', signal: signals[Math.floor(Math.random() * 3)], detail: 'Promoter increased stake' }
        ]
      };
    },
    
    'macro-calendar': () => {
      const importances = ['high', 'medium', 'low'] as const;
      const impacts = ['positive', 'negative', 'neutral'] as const;
      return {
        asOf,
        upcomingEvents: [
          { date: '2024-02-01', time: '10:00', event: 'RBI Policy Decision', country: 'IN', importance: 'high' as const, previous: '6.50%', forecast: '6.50%' },
          { date: '2024-02-06', time: '14:00', event: 'Fed FOMC Minutes', country: 'US', importance: 'high' as const, previous: 'N/A', forecast: 'N/A' },
          { date: '2024-02-15', time: '17:30', event: 'India GDP Q3', country: 'IN', importance: 'medium' as const, previous: '7.6%', forecast: '7.2%' },
          { date: '2024-02-28', time: '08:00', event: 'US PCE Inflation', country: 'US', importance: 'high' as const, previous: '2.6%', forecast: '2.5%' }
        ],
        recentEvents: [
          { date: '2024-01-25', event: 'US GDP Q4', actual: '3.3%', forecast: '2.0%', impact: 'positive' as const },
          { date: '2024-01-31', event: 'Fed Rate Decision', actual: 'Hold', forecast: 'Hold', impact: 'neutral' as const },
          { date: '2024-01-29', event: 'India IIP Data', actual: '2.4%', forecast: '3.0%', impact: 'negative' as const }
        ],
        keyDates: {
          nextFed: '2024-03-20',
          nextRBI: '2024-02-08',
          nextGDP: '2024-02-28'
        }
      };
    },
    
    'macro-pulse': () => {
      const regimes = ['Risk On', 'Risk Off', 'Neutral', 'Transitioning'] as const;
      const trends = ['up', 'down', 'flat'] as const;
      const statuses = ['positive', 'negative', 'neutral'] as const;
      
      const giftNiftyChange = (Math.random() - 0.4) * 2;
      const gapDirections = ['Gap Up', 'Gap Down', 'Flat Open'] as const;
      const gapDirection = giftNiftyChange > 0.3 ? 'Gap Up' : giftNiftyChange < -0.3 ? 'Gap Down' : 'Flat Open';
      
      return {
        asOf,
        regime: regimes[Math.floor(Math.random() * 4)],
        indicators: [
          { name: 'GDP Growth', value: 6 + Math.random() * 2, trend: trends[Math.floor(Math.random() * 3)], status: statuses[Math.floor(Math.random() * 3)] },
          { name: 'Inflation', value: 4 + Math.random() * 3, trend: trends[Math.floor(Math.random() * 3)], status: statuses[Math.floor(Math.random() * 3)] },
          { name: 'Interest Rate', value: 6 + Math.random() * 1, trend: trends[Math.floor(Math.random() * 3)], status: statuses[Math.floor(Math.random() * 3)] },
          { name: 'FII Flows', value: Math.random() * 20000 - 10000, trend: trends[Math.floor(Math.random() * 3)], status: statuses[Math.floor(Math.random() * 3)] },
          { name: 'Credit Growth', value: 12 + Math.random() * 8, trend: trends[Math.floor(Math.random() * 3)], status: statuses[Math.floor(Math.random() * 3)] }
        ],
        radarData: [
          { indicator: 'Growth', value: 60 + Math.random() * 30, fullMark: 100 },
          { indicator: 'Inflation', value: 50 + Math.random() * 30, fullMark: 100 },
          { indicator: 'Liquidity', value: 55 + Math.random() * 35, fullMark: 100 },
          { indicator: 'Sentiment', value: 45 + Math.random() * 40, fullMark: 100 },
          { indicator: 'Momentum', value: 50 + Math.random() * 35, fullMark: 100 }
        ],
        globalMarkets: {
          us: Math.random() * 4 - 1,
          europe: Math.random() * 3 - 1,
          asia: Math.random() * 3 - 0.5,
          india: Math.random() * 4 - 0.5
        },
        riskMetrics: {
          vix: 12 + Math.random() * 15,
          dollarIndex: 102 + Math.random() * 5,
          goldPrice: 1950 + Math.random() * 150,
          oilPrice: 70 + Math.random() * 20
        },
        // NEW: Pre-Market Scanner Data
        preMarket: {
          sgxNifty: {
            value: 24500 + Math.random() * 500,
            change: giftNiftyChange * 100,
            changePct: giftNiftyChange
          },
          giftNifty: {
            value: 24500 + Math.random() * 500,
            change: giftNiftyChange * 100,
            changePct: giftNiftyChange
          },
          globalSummary: {
            dowFutures: (Math.random() - 0.45) * 1.5,
            nasdaqFutures: (Math.random() - 0.45) * 2,
            sp500Futures: (Math.random() - 0.45) * 1.5,
            ftse: (Math.random() - 0.45) * 1,
            dax: (Math.random() - 0.45) * 1.2,
            hangseng: (Math.random() - 0.45) * 2,
            nikkei: (Math.random() - 0.45) * 1.5
          },
          gapProbability: {
            direction: gapDirection,
            probability: 60 + Math.floor(Math.random() * 30),
            expectedGap: Math.round(giftNiftyChange * 100),
            expectedGapPct: Math.round(giftNiftyChange * 100) / 100
          },
          keyEvents: [
            'RBI MPC meeting at 10:00 AM',
            'US CPI data tonight',
            'F&O expiry tomorrow'
          ].slice(0, Math.floor(Math.random() * 3) + 1),
          lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        }
      };
    },
    
    'earnings-calendar': () => {
      const daysAway = Math.floor(5 + Math.random() * 25);
      const estimatedEPS = 25 + Math.random() * 10;
      const statuses = ['upcoming', 'reported'] as const;
      return {
        symbol, asOf,
        upcoming: {
          date: new Date(Date.now() + daysAway * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          quarter: 'Q3 FY24',
          estimatedEPS,
          estimatedRevenue: 5000 + Math.random() * 3000,
          daysAway
        },
        historicalBeats: {
          last4Q: Math.floor(2 + Math.random() * 3),
          last8Q: Math.floor(4 + Math.random() * 5)
        },
        peerEarnings: [
          { symbol: 'INFY', date: '2024-01-15', status: 'reported' as const, surprise: 2.5 + Math.random() * 3 },
          { symbol: 'WIPRO', date: '2024-01-20', status: 'reported' as const, surprise: -1 + Math.random() * 4 },
          { symbol: 'HCLTECH', date: '2024-02-01', status: 'upcoming' as const }
        ],
        estimates: {
          epsHigh: estimatedEPS * 1.15,
          epsLow: estimatedEPS * 0.85,
          epsConsensus: estimatedEPS,
          numAnalysts: 15 + Math.floor(Math.random() * 20)
        }
      };
    },
    
    'earnings-surprise': () => {
      const beatRate = 60 + Math.random() * 30;
      const consistencies = ['High', 'Moderate', 'Low'] as const;
      const tendencies = ['Beats', 'Misses', 'Mixed'] as const;
      const directions = ['positive', 'negative', 'mixed'] as const;
      return {
        symbol, asOf,
        avgSurprise: Math.random() * 10 - 2,
        beatRate,
        history: [
          { quarter: 'Q4 FY23', actual: 22 + Math.random() * 5, estimate: 21, surprise: Math.random() * 10 - 2, priceReaction: Math.random() * 6 - 2 },
          { quarter: 'Q1 FY24', actual: 24 + Math.random() * 5, estimate: 23, surprise: Math.random() * 10 - 2, priceReaction: Math.random() * 6 - 2 },
          { quarter: 'Q2 FY24', actual: 25 + Math.random() * 5, estimate: 24.5, surprise: Math.random() * 10 - 2, priceReaction: Math.random() * 6 - 2 },
          { quarter: 'Q3 FY24', actual: 26 + Math.random() * 5, estimate: 25, surprise: Math.random() * 10 - 2, priceReaction: Math.random() * 6 - 2 }
        ],
        pattern: {
          consistency: beatRate > 75 ? 'High' : beatRate > 50 ? 'Moderate' : 'Low',
          tendency: beatRate > 65 ? 'Beats' : beatRate < 40 ? 'Misses' : 'Mixed'
        },
        postEarningsMove: {
          avg1D: Math.random() * 4 - 1,
          avg5D: Math.random() * 6 - 2,
          direction: directions[Math.floor(Math.random() * 3)]
        }
      };
    },
    
    'narrative-theme': () => {
      const themeTypes = ['long_term', 'short_term', 'cyclical'] as const;
      const momentums = ['accelerating', 'stable', 'decelerating'] as const;
      const fundFlows = ['inflow', 'outflow', 'neutral'] as const;
      const sentiments = ['bullish', 'bearish', 'neutral'] as const;
      const fiiActivities = ['buying', 'selling', 'neutral'] as const;
      
      const createStock = (sym: string, name: string) => ({
        symbol: sym,
        name,
        return1m: Math.random() * 20 - 5,
        return3m: Math.random() * 30 - 5,
        relativeStrength: 50 + Math.random() * 50
      });
      
      return {
        themes: [
          {
            id: 'digital-transformation',
            name: 'Digital Transformation',
            description: 'Companies leading in cloud, AI, and digital services adoption',
            type: themeTypes[Math.floor(Math.random() * 3)],
            strength: 60 + Math.random() * 30,
            momentum: momentums[Math.floor(Math.random() * 3)],
            fundFlow: fundFlows[Math.floor(Math.random() * 3)],
            duration: '18 months',
            startDate: '2023-06-01',
            leaders: [createStock('TCS', 'Tata Consultancy'), createStock('INFY', 'Infosys')],
            laggards: [createStock('WIPRO', 'Wipro'), createStock('TECHM', 'Tech Mahindra')],
            catalysts: ['AI adoption surge', 'Cloud migration deals'],
            risks: ['Tech spending slowdown', 'Competition'],
            mfExposure: 15 + Math.random() * 10,
            fiiActivity: fiiActivities[Math.floor(Math.random() * 3)],
            retailSentiment: sentiments[Math.floor(Math.random() * 3)],
            technicalSetup: 'Bullish consolidation near highs'
          },
          {
            id: 'green-energy',
            name: 'Green Energy Transition',
            description: 'Renewable energy and EV ecosystem plays',
            type: themeTypes[Math.floor(Math.random() * 3)],
            strength: 50 + Math.random() * 40,
            momentum: momentums[Math.floor(Math.random() * 3)],
            fundFlow: fundFlows[Math.floor(Math.random() * 3)],
            duration: '24 months',
            startDate: '2023-01-01',
            leaders: [createStock('TATAPOWER', 'Tata Power'), createStock('ADANIGR', 'Adani Green')],
            laggards: [createStock('NTPC', 'NTPC'), createStock('POWERGRID', 'Power Grid')],
            catalysts: ['Government incentives', 'EV adoption'],
            risks: ['Policy changes', 'Execution delays'],
            mfExposure: 8 + Math.random() * 8,
            fiiActivity: fiiActivities[Math.floor(Math.random() * 3)],
            retailSentiment: sentiments[Math.floor(Math.random() * 3)],
            technicalSetup: 'Breakout from base'
          }
        ],
        lastUpdated: asOf
      };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // PORTFOLIO CARDS
    // ═══════════════════════════════════════════════════════════════════════
    'peer-comparison': () => {
      const pe = 20 + Math.random() * 15;
      const roe = 15 + Math.random() * 15;
      const growth = 10 + Math.random() * 20;
      const overallRank = Math.floor(Math.random() * 10) + 1;
      return {
        symbol, asOf,
        rank: {
          overall: overallRank,
          total: 15,
          percentile: Math.floor(100 - (overallRank / 15) * 100)
        },
        peers: [
          { symbol: 'INFY', name: 'Infosys', mcap: 50000, pe: 22, roe: 28, growth: 12, score: 75 },
          { symbol: 'WIPRO', name: 'Wipro', mcap: 25000, pe: 18, roe: 18, growth: 8, score: 65 },
          { symbol: 'HCLTECH', name: 'HCL Tech', mcap: 35000, pe: 24, roe: 24, growth: 14, score: 72 },
          { symbol: 'TECHM', name: 'Tech Mahindra', mcap: 15000, pe: 20, roe: 16, growth: 6, score: 60 }
        ],
        companyMetrics: { pe, pb: pe / 3, roe, growth, margin: 15 + Math.random() * 10, debtEquity: 0.1 + Math.random() * 0.5 },
        radarData: [
          { metric: 'P/E', company: pe, peerAvg: 21 },
          { metric: 'ROE', company: roe, peerAvg: 22 },
          { metric: 'Growth', company: growth, peerAvg: 10 },
          { metric: 'Margin', company: 18, peerAvg: 16 },
          { metric: 'D/E', company: 0.2, peerAvg: 0.3 }
        ],
        strengths: ['Strong ROE', 'Low debt', 'Consistent growth'],
        weaknesses: ['Premium valuation', 'Currency exposure']
      };
    },
    
    'portfolio-correlation': () => {
      const avgCorrelation = 0.3 + Math.random() * 0.4;
      const diversificationScore = Math.floor(100 - avgCorrelation * 100);
      return {
        asOf,
        diversificationScore,
        avgCorrelation,
        correlationMatrix: [
          { symbol1: 'TCS', symbol2: 'INFY', correlation: 0.85 },
          { symbol1: 'TCS', symbol2: 'RELIANCE', correlation: 0.45 },
          { symbol1: 'TCS', symbol2: 'HDFCBANK', correlation: 0.52 },
          { symbol1: 'INFY', symbol2: 'RELIANCE', correlation: 0.38 },
          { symbol1: 'INFY', symbol2: 'HDFCBANK', correlation: 0.48 },
          { symbol1: 'RELIANCE', symbol2: 'HDFCBANK', correlation: 0.65 }
        ],
        holdings: [
          { symbol: 'TCS', weight: 25 },
          { symbol: 'INFY', weight: 20 },
          { symbol: 'RELIANCE', weight: 15 },
          { symbol: 'HDFCBANK', weight: 15 },
          { symbol: 'ICICIBANK', weight: 10 },
          { symbol: 'BHARTIARTL', weight: 10 },
          { symbol: 'ITC', weight: 5 }
        ],
        clusters: [
          { name: 'IT Services', holdings: ['TCS', 'INFY'], intraCorr: 0.85 },
          { name: 'Banking', holdings: ['HDFCBANK', 'ICICIBANK'], intraCorr: 0.78 }
        ],
        recommendations: ['Consider adding commodities for diversification', 'IT cluster highly correlated - consider reducing']
      };
    },
    
    'rebalance-optimizer': () => {
      const totalValue = 1000000 + Math.random() * 4000000;
      const urgencies = ['Low', 'Medium', 'High'] as const;
      return {
        portfolioId: 'portfolio-001',
        asOf,
        totalValue,
        currentAllocation: [
          { symbol: 'TCS', name: 'TCS Ltd', currentWeight: 28, targetWeight: 25, drift: 3, action: 'Sell' as const, shares: 15, value: totalValue * 0.03 },
          { symbol: 'INFY', name: 'Infosys', currentWeight: 18, targetWeight: 20, drift: -2, action: 'Buy' as const, shares: 20, value: totalValue * 0.02 },
          { symbol: 'RELIANCE', name: 'Reliance', currentWeight: 15, targetWeight: 15, drift: 0, action: 'Hold' as const, shares: 0, value: 0 },
          { symbol: 'HDFCBANK', name: 'HDFC Bank', currentWeight: 12, targetWeight: 15, drift: -3, action: 'Buy' as const, shares: 25, value: totalValue * 0.03 }
        ],
        metricsBefore: {
          expectedReturn: 12 + Math.random() * 5,
          volatility: 18 + Math.random() * 8,
          sharpe: 0.6 + Math.random() * 0.3,
          maxDrawdown: 15 + Math.random() * 10
        },
        metricsAfter: {
          expectedReturn: 13 + Math.random() * 5,
          volatility: 16 + Math.random() * 6,
          sharpe: 0.7 + Math.random() * 0.4,
          maxDrawdown: 12 + Math.random() * 8
        },
        rebalanceTrades: [
          { symbol: 'TCS', action: 'Sell' as const, shares: 15, value: totalValue * 0.03, impact: 0.02 },
          { symbol: 'INFY', action: 'Buy' as const, shares: 20, value: totalValue * 0.02, impact: 0.01 },
          { symbol: 'HDFCBANK', action: 'Buy' as const, shares: 25, value: totalValue * 0.03, impact: 0.01 }
        ],
        taxImpact: 5000 + Math.random() * 15000,
        urgency: urgencies[Math.floor(Math.random() * 3)]
      };
    },
    
    'etf-comparator': () => ({
      asOf,
      etfs: [
        { symbol: 'NIFTYBEES', name: 'Nippon India Nifty BeES', expenseRatio: 0.05, aum: 15000, return1Y: 18.5, tracking: 0.1, holdings: 50 },
        { symbol: 'JUNIORBEES', name: 'Nippon India Junior BeES', expenseRatio: 0.12, aum: 8000, return1Y: 32.2, tracking: 0.15, holdings: 100 },
        { symbol: 'BANKBEES', name: 'Nippon India Bank BeES', expenseRatio: 0.19, aum: 5000, return1Y: 12.3, tracking: 0.12, holdings: 12 },
        { symbol: 'SETFNIF50', name: 'SBI Nifty 50 ETF', expenseRatio: 0.07, aum: 12000, return1Y: 18.2, tracking: 0.08, holdings: 50 }
      ],
      overlap: [
        { etf1: 'NIFTYBEES', etf2: 'SETFNIF50', overlapPct: 98 },
        { etf1: 'NIFTYBEES', etf2: 'JUNIORBEES', overlapPct: 35 },
        { etf1: 'NIFTYBEES', etf2: 'BANKBEES', overlapPct: 25 }
      ],
      topHoldings: [
        { symbol: 'HDFCBANK', weight: 12.5, inEtfs: ['NIFTYBEES', 'SETFNIF50', 'BANKBEES'] },
        { symbol: 'RELIANCE', weight: 10.2, inEtfs: ['NIFTYBEES', 'SETFNIF50'] },
        { symbol: 'ICICIBANK', weight: 8.1, inEtfs: ['NIFTYBEES', 'SETFNIF50', 'BANKBEES'] }
      ],
      recommendation: { pick: 'NIFTYBEES', reason: 'Lowest expense ratio with excellent tracking' }
    }),
    
    'portfolio-leaderboard': () => {
      const portfolioReturn = 12 + Math.random() * 15;
      const benchmarkReturn = 10 + Math.random() * 10;
      const alpha = portfolioReturn - benchmarkReturn;
      return {
        asOf,
        portfolioReturn,
        benchmarkReturn,
        alpha,
        rankings: [
          { symbol: 'TCS', return: 25 + Math.random() * 10, contribution: 5 + Math.random() * 3, weight: 25 },
          { symbol: 'INFY', return: 18 + Math.random() * 8, contribution: 3 + Math.random() * 2, weight: 20 },
          { symbol: 'RELIANCE', return: 8 + Math.random() * 10, contribution: 1 + Math.random() * 2, weight: 15 },
          { symbol: 'HDFCBANK', return: 5 + Math.random() * 8, contribution: 0.5 + Math.random() * 1, weight: 15 },
          { symbol: 'ITC', return: -2 + Math.random() * 6, contribution: -0.5 + Math.random() * 1, weight: 10 }
        ],
        topPerformers: [
          { symbol: 'TCS', return: 28 },
          { symbol: 'INFY', return: 22 },
          { symbol: 'BHARTIARTL', return: 18 }
        ],
        bottomPerformers: [
          { symbol: 'HINDUNILVR', return: -5 },
          { symbol: 'ASIAN PAINTS', return: -3 },
          { symbol: 'ITC', return: 2 }
        ],
        attribution: {
          stockSelection: alpha * 0.6,
          sectorAllocation: alpha * 0.3,
          timing: alpha * 0.1
        }
      };
    },
    
    'options-interest': () => {
      const sentiments = ['Bullish', 'Bearish', 'Neutral'] as const;
      const pcr = 0.7 + Math.random() * 0.6;
      const callOI = Math.floor(5000000 + Math.random() * 10000000);
      const putOI = Math.floor(callOI * pcr);
      return {
        symbol, asOf,
        sentiment: pcr > 1.1 ? 'Bullish' : pcr < 0.8 ? 'Bearish' : 'Neutral',
        pcr: { value: pcr, change: Math.random() * 0.2 - 0.1 },
        maxPain: Math.round(basePrice / 50) * 50,
        currentPrice: basePrice,
        openInterest: {
          calls: callOI,
          puts: putOI,
          total: callOI + putOI
        },
        topStrikes: [
          { strike: Math.round(basePrice * 1.05 / 50) * 50, callOI: Math.floor(1000000 + Math.random() * 500000), putOI: Math.floor(500000 + Math.random() * 300000), type: 'call' as const },
          { strike: Math.round(basePrice / 50) * 50, callOI: Math.floor(800000 + Math.random() * 400000), putOI: Math.floor(900000 + Math.random() * 400000), type: 'balanced' as const },
          { strike: Math.round(basePrice * 0.95 / 50) * 50, callOI: Math.floor(400000 + Math.random() * 300000), putOI: Math.floor(1200000 + Math.random() * 500000), type: 'put' as const }
        ],
        unusualActivity: [
          { strike: `${Math.round(basePrice * 1.1)}CE`, type: 'Call', volume: Math.floor(50000 + Math.random() * 50000), signal: 'Bullish bet' },
          { strike: `${Math.round(basePrice * 0.9)}PE`, type: 'Put', volume: Math.floor(30000 + Math.random() * 40000), signal: 'Hedge activity' }
        ]
      };
    },
    
    'trade-journal': () => {
      const exitReasons = ['target', 'stop', 'manual', 'time_exit'] as const;
      const productTypes = ['equity', 'futures', 'options_buy', 'options_sell'] as const;
      const tradeTypes = ['long', 'short'] as const;
      
      const trades = Array.from({ length: 10 }, (_, i) => {
        const entryPrice = basePrice * (0.9 + Math.random() * 0.2);
        const exitPrice = entryPrice * (0.95 + Math.random() * 0.1);
        const quantity = Math.floor(10 + Math.random() * 90);
        const pnl = (exitPrice - entryPrice) * quantity;
        return {
          id: `trade-${i + 1}`,
          date: new Date(Date.now() - (10 - i) * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: `${9 + Math.floor(Math.random() * 6)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          instrument: symbol,
          type: tradeTypes[Math.floor(Math.random() * 2)],
          productType: productTypes[Math.floor(Math.random() * 4)],
          entryPrice,
          exitPrice,
          quantity,
          pnl,
          pnlPercent: (pnl / (entryPrice * quantity)) * 100,
          plannedStop: entryPrice * 0.97,
          plannedTarget: entryPrice * 1.05,
          actualExitReason: exitReasons[Math.floor(Math.random() * 4)],
          holdingTime: Math.floor(30 + Math.random() * 300)
        };
      });
      
      return {
        trades,
        capital: 500000 + Math.random() * 500000,
        period: 'Last 30 Days'
      };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // DERIVATIVES CARDS
    // ═══════════════════════════════════════════════════════════════════════
    'options-strategy': () => ({
      symbol, asOf,
      strategy: ['Bull Call Spread', 'Iron Condor', 'Straddle'][Math.floor(Math.random() * 3)],
      maxProfit: Math.floor(Math.random() * 50000),
      maxLoss: Math.floor(Math.random() * 20000),
      breakeven: [basePrice * 0.95, basePrice * 1.05]
    }),
    
    'nse-currency-dashboard': () => {
      type PairCategory = 'inr' | 'cross';
      const createCurrencyContract = (pair: string, displayName: string, category: PairCategory, spotPrice: number, lotSize: number) => {
        const change = Math.random() * 0.3 - 0.15;
        const changePercent = (change / spotPrice) * 100;
        const futuresPrice = spotPrice * (1 + Math.random() * 0.003);
        const premiumToSpot = futuresPrice - spotPrice;
        return {
          pair,
          displayName,
          category,
          lotSize,
          lotUnit: 'USD',
          tickSize: 0.0025,
          tickValue: lotSize * 0.0025,
          spotRate: spotPrice,
          futuresPrice,
          change,
          changePercent,
          bid: futuresPrice - 0.0025,
          ask: futuresPrice + 0.0025,
          dayHigh: futuresPrice + Math.random() * 0.2,
          dayLow: futuresPrice - Math.random() * 0.2,
          volume: Math.floor(100000 + Math.random() * 500000),
          openInterest: Math.floor(500000 + Math.random() * 1000000),
          oiChange: Math.random() * 10 - 5,
          oiChangePercent: Math.random() * 5 - 2.5,
          spanMargin: lotSize * spotPrice * 0.02,
          elmRate: lotSize * spotPrice * 0.005,
          totalMargin: lotSize * spotPrice * 0.025,
          expiryDate: '2024-02-28',
          daysToExpiry: 15 + Math.floor(Math.random() * 30),
          premiumToSpot
        };
      };
      
      return {
        asOf,
        marketStatus: 'open' as const,
        tradingHours: { start: '09:00', end: '17:00' },
        rbiReferenceTime: '13:30',
        referenceRates: {
          usdinr: 83.2 + Math.random() * 0.5,
          eurinr: 90 + Math.random() * 1,
          gbpinr: 105 + Math.random() * 1,
          jpyinr: 0.55 + Math.random() * 0.02
        },
        inrPairs: [
          createCurrencyContract('USDINR', 'USD/INR', 'inr', 83.2 + Math.random() * 0.5, 1000),
          createCurrencyContract('EURINR', 'EUR/INR', 'inr', 90 + Math.random() * 1, 1000),
          createCurrencyContract('GBPINR', 'GBP/INR', 'inr', 105 + Math.random() * 1, 1000),
          createCurrencyContract('JPYINR', 'JPY/INR', 'inr', 0.55 + Math.random() * 0.02, 100000)
        ],
        crossPairs: [
          createCurrencyContract('EURUSD', 'EUR/USD', 'cross', 1.08 + Math.random() * 0.02, 1000),
          createCurrencyContract('GBPUSD', 'GBP/USD', 'cross', 1.26 + Math.random() * 0.02, 1000)
        ],
        contractChain: {
          pair: 'USDINR',
          contracts: [
            { month: '2024-02', monthLabel: 'Feb 2024', price: 83.3, change: 0.1, changePercent: 0.12, oi: 1000000, volume: 500000, expiryDate: '2024-02-28', daysToExpiry: 15, isNearMonth: true },
            { month: '2024-03', monthLabel: 'Mar 2024', price: 83.5, change: 0.12, changePercent: 0.14, oi: 800000, volume: 300000, expiryDate: '2024-03-28', daysToExpiry: 45, isNearMonth: false },
            { month: '2024-04', monthLabel: 'Apr 2024', price: 83.7, change: 0.15, changePercent: 0.18, oi: 500000, volume: 150000, expiryDate: '2024-04-28', daysToExpiry: 75, isNearMonth: false }
          ]
        },
        optionsSnapshot: {
          pair: 'USDINR',
          atmStrike: 83.25,
          spotPrice: 83.2,
          iv: 4 + Math.random() * 2,
          pcr: 0.8 + Math.random() * 0.4,
          maxPain: 83.0,
          totalCEOI: Math.floor(500000 + Math.random() * 500000),
          totalPEOI: Math.floor(400000 + Math.random() * 400000),
          topStrikes: [
            { strike: 83.0, ceOI: 150000, peOI: 100000, ceLTP: 0.35, peLTP: 0.15 },
            { strike: 83.25, ceOI: 200000, peOI: 180000, ceLTP: 0.20, peLTP: 0.22 },
            { strike: 83.5, ceOI: 120000, peOI: 160000, ceLTP: 0.12, peLTP: 0.35 }
          ]
        },
        technicals: [
          { pair: 'USDINR', sma20: 83.1, sma50: 83.0, sma200: 82.5, rsi14: 50 + Math.random() * 20, trend: 'sideways' as const, support: [82.8, 82.5], resistance: [83.5, 84.0] }
        ],
        spreads: [
          { id: 'usdinr-feb-mar', pair: 'USDINR', nearMonth: 'Feb 2024', farMonth: 'Mar 2024', currentSpread: 0.2, spreadHistory: [{date: '2024-01-01', spread: 0.18}, {date: '2024-01-15', spread: 0.2}], mean30D: 0.19, stdDev: 0.02, zScore: 0.5, signal: 'neutral' as const }
        ],
        insights: ['RBI likely to maintain stability', 'Watch for Fed commentary']
      };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // MUTUAL FUNDS CARDS
    // ═══════════════════════════════════════════════════════════════════════
    'mf-explorer': () => {
      // Using imported MUTUAL_FUND_DATA, CATEGORY_COUNTS, AMC_LIST
      
      const mapRiskLevel = (risk: string) => {
        const map: Record<string, string> = {
          'Low': 'low',
          'Low-Moderate': 'moderate',
          'Moderate': 'moderate',
          'Moderate-High': 'moderately_high',
          'High': 'high',
          'Very High': 'very_high'
        };
        return map[risk] || 'moderate';
      };

      const mapCategory = (cat: string) => {
        const map: Record<string, string> = {
          'Equity': 'equity',
          'Debt': 'debt',
          'Hybrid': 'hybrid',
          'Index': 'equity',
          'International': 'other',
          'Commodity': 'other',
          'Solution': 'other'
        };
        return map[cat] || 'other';
      };

      const mapSubCategory = (sub: string) => {
        const map: Record<string, string> = {
          'Large Cap': 'large_cap',
          'Mid Cap': 'mid_cap',
          'Small Cap': 'small_cap',
          'Flexi Cap': 'flexi_cap',
          'Multi Cap': 'multi_cap',
          'Value': 'value',
          'Contra': 'value',
          'ELSS': 'elss',
          'Thematic - Infrastructure': 'sectoral',
          'Thematic - PSU': 'sectoral',
          'Thematic - Banking': 'sectoral',
          'Thematic - Pharma': 'sectoral',
          'Thematic - IT': 'sectoral',
          'Thematic - Consumption': 'sectoral',
          'Thematic - Defence': 'sectoral',
          'Multi Asset': 'multi_asset',
          'Aggressive Hybrid': 'aggressive_hybrid',
          'Conservative Hybrid': 'conservative_hybrid',
          'Dynamic Asset Allocation': 'balanced_advantage',
          'Equity Savings': 'equity_savings',
          'Arbitrage': 'arbitrage',
          'Floating Rate': 'short_duration',
          'Medium Duration': 'medium_duration',
          'Short Duration': 'short_duration',
          'Ultra Short Duration': 'ultra_short',
          'Long Duration': 'long_duration',
          'Corporate Bond': 'corporate_bond',
          'Banking & PSU': 'banking_psu',
          'Liquid': 'liquid',
          'Gilt': 'gilt',
          'Credit Risk': 'credit_risk',
          'Gold': 'gold',
          'Silver': 'gold',
          'US Equity': 'international',
          'Japan Equity': 'international',
          'China Equity': 'international',
          'Retirement': 'fof',
          'Children': 'fof'
        };
        return map[sub] || 'focused';
      };

      // Transform data to match MFExplorer interface - include ALL funds
      const funds = MUTUAL_FUND_DATA.map((f: any) => ({
        schemeCode: `INF${Math.floor(100000 + Math.random() * 900000)}`,
        schemeName: f.name,
        amc: f.name.split(' ')[0] + ' Mutual Fund',
        category: mapCategory(f.category),
        subCategory: mapSubCategory(f.subCategory),
        planType: 'direct',
        nav: 50 + Math.random() * 200,
        navDate: asOf,
        aum: f.aum,
        expenseRatio: f.expenseRatio,
        riskLevel: mapRiskLevel(f.riskLevel),
        rating: f.returns3Y > 20 ? 5 : f.returns3Y > 15 ? 4 : f.returns3Y > 10 ? 3 : 2,
        returns: {
          '1M': (f.returns1Y / 12) + (Math.random() * 2 - 1),
          '3M': (f.returns1Y / 4) + (Math.random() * 3 - 1.5),
          '6M': (f.returns1Y / 2) + (Math.random() * 4 - 2),
          '1Y': f.returns1Y,
          '3Y': f.returns3Y,
          '5Y': f.returns5Y
        },
        minSipAmount: f.minSip,
        minLumpsum: f.minLumpsum,
        exitLoad: f.exitLoad,
        benchmark: 'NIFTY 50 TRI',
        fundManager: f.fundManager
      }));

      return {
        asOf,
        totalFunds: MUTUAL_FUND_DATA.length,
        categories: {
          equity: CATEGORY_COUNTS.equity + CATEGORY_COUNTS.index,
          debt: CATEGORY_COUNTS.debt,
          hybrid: CATEGORY_COUNTS.hybrid,
          other: CATEGORY_COUNTS.international + CATEGORY_COUNTS.commodity + CATEGORY_COUNTS.solution
        },
        funds,
        amcList: AMC_LIST,
        popularFilters: [
          { name: 'Top Rated', count: funds.filter((f: any) => f.rating >= 4).length },
          { name: 'Low Expense', count: funds.filter((f: any) => f.expenseRatio < 1).length },
          { name: 'High Returns', count: funds.filter((f: any) => f.returns['1Y'] > 15).length }
        ]
      };
    },
    
    'mf-analyzer': () => {
      const randomFund = MUTUAL_FUND_DATA[Math.floor(Math.random() * MUTUAL_FUND_DATA.length)];
      
      return {
        symbol, 
        asOf,
        fundName: randomFund.name,
        category: randomFund.category,
        subCategory: randomFund.subCategory,
        rating: randomFund.returns3Y > 20 ? 5 : randomFund.returns3Y > 15 ? 4 : 3,
        returns: {
          '1Y': randomFund.returns1Y,
          '3Y': randomFund.returns3Y,
          '5Y': randomFund.returns5Y
        },
        aum: randomFund.aum,
        expenseRatio: randomFund.expenseRatio,
        riskLevel: randomFund.riskLevel,
        sharpeRatio: 0.8 + (randomFund.returns3Y / 20),
        alpha: randomFund.returns1Y - 12 + (Math.random() * 2 - 1),
        beta: 0.85 + Math.random() * 0.3,
        standardDeviation: 12 + Math.random() * 8,
        sortino: 1.0 + (randomFund.returns3Y / 25),
        maxDrawdown: -(8 + Math.random() * 12),
        fundManager: randomFund.fundManager,
        verdict: randomFund.returns3Y > 18 ? 'Strong Buy' : randomFund.returns3Y > 12 ? 'Recommended' : 'Hold'
      };
    },
    
    'mf-portfolio-optimizer': () => {
      // Pick diverse funds for portfolio
      const largeCap = MUTUAL_FUND_DATA.find((f: any) => f.subCategory === 'Large Cap');
      const midCap = MUTUAL_FUND_DATA.find((f: any) => f.subCategory === 'Mid Cap');
      const smallCap = MUTUAL_FUND_DATA.find((f: any) => f.subCategory === 'Small Cap');
      const flexi = MUTUAL_FUND_DATA.find((f: any) => f.subCategory === 'Flexi Cap');
      const debt = MUTUAL_FUND_DATA.find((f: any) => f.category === 'Debt' && f.subCategory === 'Short Duration');
      
      const funds = [
        { schemeCode: 'INF204K01EY2', schemeName: largeCap?.name || 'Axis Bluechip Fund', category: 'Large Cap', currentWeight: 25, optimizedWeight: 20, amount: 250000, expectedReturn: largeCap?.returns3Y || 14, volatility: 14, sharpeRatio: 0.8 },
        { schemeCode: 'INF846K01EW2', schemeName: midCap?.name || 'HDFC Mid-Cap Opportunities', category: 'Mid Cap', currentWeight: 20, optimizedWeight: 25, amount: 200000, expectedReturn: midCap?.returns3Y || 18, volatility: 18, sharpeRatio: 0.85 },
        { schemeCode: 'INF179K01BH3', schemeName: smallCap?.name || 'SBI Small Cap Fund', category: 'Small Cap', currentWeight: 15, optimizedWeight: 15, amount: 150000, expectedReturn: smallCap?.returns3Y || 20, volatility: 24, sharpeRatio: 0.75 },
        { schemeCode: 'INF109K01Z48', schemeName: flexi?.name || 'Parag Parikh Flexi Cap', category: 'Flexi Cap', currentWeight: 15, optimizedWeight: 15, amount: 150000, expectedReturn: flexi?.returns3Y || 16, volatility: 16, sharpeRatio: 0.82 },
        { schemeCode: 'INF090I01GG8', schemeName: debt?.name || 'Axis Short Term Fund', category: 'Debt', currentWeight: 25, optimizedWeight: 25, amount: 250000, expectedReturn: debt?.returns3Y || 7.5, volatility: 4, sharpeRatio: 1.2 }
      ];
      
      return {
        asOf,
        investmentAmount: 1000000,
        funds,
        correlationMatrix: [
          [1.00, 0.85, 0.78, 0.82, 0.15],
          [0.85, 1.00, 0.88, 0.80, 0.12],
          [0.78, 0.88, 1.00, 0.75, 0.18],
          [0.82, 0.80, 0.75, 1.00, 0.14],
          [0.15, 0.12, 0.18, 0.14, 1.00]
        ],
        efficientFrontier: Array.from({ length: 10 }, (_, i) => ({
          risk: 8 + i * 2,
          return: 8 + i * 1.5 - (i > 5 ? (i - 5) * 0.3 : 0),
          weights: { 'Large Cap': 40 - i * 3, 'Mid Cap': 20 + i * 2, 'Small Cap': 10 + i * 2, 'Debt': 30 - i * 2 },
          sharpe: 0.6 + (i < 5 ? i * 0.05 : (10 - i) * 0.05),
          isOptimal: i === 4,
          label: i === 4 ? 'Optimal' : undefined
        })),
        currentPortfolio: { expectedReturn: 13.5, volatility: 15.2, sharpeRatio: 0.72, maxDrawdown: 18.5, diversificationScore: 65 },
        optimizedPortfolio: { expectedReturn: 14.8, volatility: 13.5, sharpeRatio: 0.92, maxDrawdown: 14.8, diversificationScore: 82 },
        recommendations: [
          { action: 'decrease', fund: largeCap?.name || 'Large Cap Fund', from: 25, to: 20, reason: 'High correlation with other large caps' },
          { action: 'increase', fund: midCap?.name || 'Mid Cap Fund', from: 20, to: 25, reason: 'Better risk-adjusted returns potential' }
        ],
        assetAllocation: { equity: 75, debt: 25, hybrid: 0, other: 0 },
        capAllocation: { largeCap: 35, midCap: 35, smallCap: 30 }
      };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // COMMODITIES CARDS
    // ═══════════════════════════════════════════════════════════════════════
    'mcx-commodity-dashboard': () => {
      type CommodityCategory = 'bullion' | 'baseMetals' | 'energy';
      const createContract = (sym: string, displayName: string, category: CommodityCategory, basePrice: number, lotSize: number, lotUnit: string): any => {
        const change = Math.random() * 3 - 1.5;
        const changePercent = (change / basePrice) * 100;
        return {
          symbol: sym,
          contractMonth: 'Feb 2024',
          displayName,
          category,
          lotSize,
          lotUnit,
          tickSize: basePrice > 10000 ? 1 : 0.05,
          tickValue: basePrice > 10000 ? lotSize : lotSize * 0.05,
          ltp: basePrice + change,
          change,
          changePercent,
          open: basePrice - Math.random() * 50,
          high: basePrice + Math.random() * 100,
          low: basePrice - Math.random() * 100,
          previousClose: basePrice,
          volume: Math.floor(10000 + Math.random() * 50000),
          oi: Math.floor(50000 + Math.random() * 100000),
          oiChange: Math.random() * 10 - 5
        };
      };
      
      return {
        asOf,
        marketStatus: 'open' as const,
        tradingSession: { start: '09:00', end: '23:30', currentTime: '14:30' },
        usdinr: 83.2 + Math.random() * 0.5,
        commodities: {
          bullion: [
            createContract('GOLD', 'Gold', 'bullion', 60000 + Math.random() * 2000, 100, 'grams'),
            createContract('GOLDM', 'Gold Mini', 'bullion', 60000 + Math.random() * 2000, 10, 'grams'),
            createContract('SILVER', 'Silver', 'bullion', 72000 + Math.random() * 3000, 30, 'kg'),
            createContract('SILVERM', 'Silver Mini', 'bullion', 72000 + Math.random() * 3000, 5, 'kg')
          ],
          baseMetals: [
            createContract('COPPER', 'Copper', 'baseMetals', 720 + Math.random() * 30, 2500, 'kg'),
            createContract('ZINC', 'Zinc', 'baseMetals', 220 + Math.random() * 20, 5000, 'kg'),
            createContract('LEAD', 'Lead', 'baseMetals', 185 + Math.random() * 15, 5000, 'kg'),
            createContract('ALUMINIUM', 'Aluminium', 'baseMetals', 200 + Math.random() * 15, 5000, 'kg')
          ],
          energy: [
            createContract('CRUDEOIL', 'Crude Oil', 'energy', 6200 + Math.random() * 300, 100, 'bbl'),
            createContract('NATURALGAS', 'Natural Gas', 'energy', 220 + Math.random() * 30, 1250, 'mmBtu')
          ]
        },
        globalBenchmarks: [
          { id: 'comex-gold', name: 'COMEX Gold', exchange: 'COMEX', price: 2030 + Math.random() * 50, change: Math.random() * 20 - 10, changePercent: Math.random() * 1 - 0.5, currency: 'USD', mcxEquivalent: 'GOLD', mcxParityPrice: 60500 },
          { id: 'lme-copper', name: 'LME Copper', exchange: 'LME', price: 8500 + Math.random() * 200, change: Math.random() * 50 - 25, changePercent: Math.random() * 1 - 0.5, currency: 'USD', mcxEquivalent: 'COPPER', mcxParityPrice: 720 },
          { id: 'brent', name: 'Brent Crude', exchange: 'ICE', price: 80 + Math.random() * 5, change: Math.random() * 2 - 1, changePercent: Math.random() * 2 - 1, currency: 'USD', mcxEquivalent: 'CRUDEOIL', mcxParityPrice: 6300 }
        ],
        contractChain: {
          commodity: 'GOLD',
          contracts: [
            { month: '2024-02', monthLabel: 'Feb 2024', ltp: 60500, change: 150, changePercent: 0.25, oi: 100000, volume: 50000, expiryDate: '2024-02-28', daysToExpiry: 15, isNearMonth: true, premiumToNear: 0 },
            { month: '2024-04', monthLabel: 'Apr 2024', ltp: 60800, change: 160, changePercent: 0.26, oi: 80000, volume: 30000, expiryDate: '2024-04-28', daysToExpiry: 75, isNearMonth: false, premiumToNear: 300 },
            { month: '2024-06', monthLabel: 'Jun 2024', ltp: 61100, change: 170, changePercent: 0.28, oi: 50000, volume: 15000, expiryDate: '2024-06-28', daysToExpiry: 135, isNearMonth: false, premiumToNear: 600 }
          ],
          structure: 'contango' as const,
          annualizedCarry: 2.5,
          rollDays: 15
        },
        spreads: {
          calendarSpreads: [
            { id: 'gold-feb-apr', commodity: 'GOLD', nearMonth: 'Feb 2024', farMonth: 'Apr 2024', currentSpread: 300, spreadHistory: [{date: '2024-01-01', spread: 280}, {date: '2024-01-15', spread: 300}], mean30D: 290, stdDev: 15, zScore: 0.67, signal: 'neutral' as const }
          ],
          interCommodityRatios: [
            { id: 'gold-silver', name: 'Gold/Silver Ratio', numerator: 'GOLD', denominator: 'SILVER', currentRatio: 83.5, avgRatio: 82, percentile: 65, interpretation: 'neutral' as const, description: 'Ratio near historical average' }
          ]
        },
        insights: ['Gold near all-time highs', 'Base metals supported by China demand']
      };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // OVERVIEW CARDS
    // ═══════════════════════════════════════════════════════════════════════
    'stock-snapshot': () => {
      const change = Math.random() * 50 - 25;
      const changePct = (change / basePrice) * 100;
      const dayHigh = basePrice * (1 + Math.random() * 0.03);
      const dayLow = basePrice * (1 - Math.random() * 0.03);
      const ratings = ['Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'] as const;
      const capCategories = ['Large Cap', 'Mid Cap', 'Small Cap'] as const;
      
      // Generate intraday data
      const intradayData = [];
      let currentPrice = basePrice * 0.99;
      for (let i = 0; i < 78; i++) { // 9:15 AM to 3:30 PM = 6.25 hours = 375 mins, every 5 min = 75 points
        const hour = 9 + Math.floor((i * 5 + 15) / 60);
        const min = (i * 5 + 15) % 60;
        currentPrice = currentPrice * (1 + (Math.random() - 0.48) * 0.005);
        intradayData.push({
          time: `${hour}:${min.toString().padStart(2, '0')}`,
          price: currentPrice,
          volume: Math.floor(Math.random() * 100000)
        });
      }
      
      return {
        symbol,
        companyName: `${symbol} Industries Ltd`,
        sector: ['Technology', 'Finance', 'Healthcare', 'Consumer', 'Industrial'][Math.floor(Math.random() * 5)],
        industry: ['Software', 'Banking', 'Pharma', 'FMCG', 'Auto'][Math.floor(Math.random() * 5)],
        exchange: 'NSE' as const,
        lastPrice: basePrice,
        change,
        changePct,
        asOf,
        open: basePrice * (1 + (Math.random() - 0.5) * 0.02),
        previousClose: basePrice - change,
        dayHigh,
        dayLow,
        volume: Math.floor(Math.random() * 10000000),
        avgVolume: Math.floor(Math.random() * 8000000),
        marketCap: Math.floor(Math.random() * 500000) + 10000,
        marketCapCategory: capCategories[Math.floor(Math.random() * 3)],
        pe: 15 + Math.random() * 30,
        eps: basePrice / (15 + Math.random() * 30),
        dividendYield: Math.random() * 3,
        high52w: basePrice * 1.3,
        low52w: basePrice * 0.7,
        demandZone: basePrice * 0.92,
        supplyZone: basePrice * 1.08,
        intradayData,
        analystRating: ratings[Math.floor(Math.random() * 5)],
        targetPrice: basePrice * (1 + (Math.random() - 0.3) * 0.3)
      };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // MINI CARDS
    // ═══════════════════════════════════════════════════════════════════════
    'sentiment-zscore': () => {
      const signals = ['Bullish', 'Bearish', 'Neutral'] as const;
      return {
        symbol, asOf,
        zscoreReturn: Math.random() * 4 - 2,
        zscoreVolume: Math.random() * 4 - 2,
        zscoreMomentum: Math.random() * 4 - 2,
        signal: signals[Math.floor(Math.random() * 3)]
      };
    },
    
    'sentiment-zscore-mini': () => {
      const signals = ['Bullish', 'Bearish', 'Neutral'] as const;
      return {
        symbol, asOf,
        zscoreReturn: Math.random() * 4 - 2,
        zscoreVolume: Math.random() * 4 - 2,
        zscoreMomentum: Math.random() * 4 - 2,
        signal: signals[Math.floor(Math.random() * 3)]
      };
    },
    
    'warning-sentinel': () => {
      const alertTypes = ['critical', 'warning', 'info'] as const;
      const statuses = ['ok', 'watch', 'alert'] as const;
      return {
        symbol, asOf,
        alerts: [
          { type: alertTypes[Math.floor(Math.random() * 3)], message: 'Debt levels increasing', metric: 'D/E Ratio' },
          { type: alertTypes[Math.floor(Math.random() * 3)], message: 'Cash flow declining', metric: 'OCF' },
          { type: alertTypes[Math.floor(Math.random() * 3)], message: 'Margin pressure', metric: 'OPM' }
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        riskScore: Math.floor(30 + Math.random() * 50),
        watchItems: [
          { item: 'Debt Service', status: statuses[Math.floor(Math.random() * 3)] },
          { item: 'Working Capital', status: statuses[Math.floor(Math.random() * 3)] },
          { item: 'Promoter Pledge', status: statuses[Math.floor(Math.random() * 3)] },
          { item: 'Related Party', status: statuses[Math.floor(Math.random() * 3)] }
        ]
      };
    },
    
    'warning-sentinel-mini': () => {
      const alertTypes = ['critical', 'warning', 'info'] as const;
      const statuses = ['ok', 'watch', 'alert'] as const;
      return {
        symbol, asOf,
        alerts: [
          { type: alertTypes[Math.floor(Math.random() * 3)], message: 'Debt levels increasing', metric: 'D/E Ratio' },
          { type: alertTypes[Math.floor(Math.random() * 3)], message: 'Cash flow declining', metric: 'OCF' },
          { type: alertTypes[Math.floor(Math.random() * 3)], message: 'Margin pressure', metric: 'OPM' }
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        riskScore: Math.floor(30 + Math.random() * 50),
        watchItems: [
          { item: 'Debt Service', status: statuses[Math.floor(Math.random() * 3)] },
          { item: 'Working Capital', status: statuses[Math.floor(Math.random() * 3)] },
          { item: 'Promoter Pledge', status: statuses[Math.floor(Math.random() * 3)] },
          { item: 'Related Party', status: statuses[Math.floor(Math.random() * 3)] }
        ]
      };
    },
    
    'crash-warning-mini': () => {
      const signals = ['safe', 'caution', 'warning', 'danger'] as const;
      const statuses = ['ok', 'watch', 'alert'] as const;
      const rollingReturn = -2 + Math.random() * 4;  // -2% to +2%
      const rollingVol = 0.5 + Math.random() * 3;  // 0.5% to 3.5%
      const drawdown = Math.random() * 25;  // 0% to 25%
      
      // Rule-based signal determination (from Amanxai crash analysis)
      let signal: typeof signals[number];
      let crashProximity: number;
      
      if (rollingReturn < -0.5 && rollingVol > 2) {
        signal = drawdown > 15 ? 'danger' : 'warning';
        crashProximity = 60 + Math.random() * 35;
      } else if (rollingReturn < 0 || rollingVol > 1.5) {
        signal = 'caution';
        crashProximity = 30 + Math.random() * 30;
      } else {
        signal = 'safe';
        crashProximity = Math.random() * 30;
      }
      
      return {
        symbol, asOf,
        rollingReturn10D: rollingReturn,
        rollingVolatility10D: rollingVol,
        currentDrawdown: drawdown,
        maxDrawdown52W: drawdown + Math.random() * 10,
        signal,
        crashProximity,
        factors: [
          { name: 'Momentum', status: rollingReturn < -0.5 ? 'alert' : rollingReturn < 0 ? 'watch' : 'ok' as typeof statuses[number], value: `${rollingReturn.toFixed(2)}%` },
          { name: 'Volatility', status: rollingVol > 2 ? 'alert' : rollingVol > 1.5 ? 'watch' : 'ok' as typeof statuses[number], value: `${rollingVol.toFixed(1)}%` },
          { name: 'Drawdown', status: drawdown > 15 ? 'alert' : drawdown > 5 ? 'watch' : 'ok' as typeof statuses[number], value: `-${drawdown.toFixed(1)}%` },
          { name: 'Volume', status: statuses[Math.floor(Math.random() * 3)], value: Math.random() > 0.5 ? 'Above Avg' : 'Normal' },
          { name: 'Breadth', status: statuses[Math.floor(Math.random() * 3)], value: Math.random() > 0.5 ? 'Narrow' : 'Broad' }
        ]
      };
    },
    
    'factor-tilt-mini': () => {
      const momentums = ['Favorable', 'Neutral', 'Unfavorable'] as const;
      const factorNames = ['Value', 'Growth', 'Momentum', 'Quality', 'Size', 'Volatility'];
      return {
        symbol, asOf,
        factors: factorNames.slice(0, 4).map(name => ({
          name,
          exposure: Math.random() * 2 - 0.5,
          percentile: Math.floor(20 + Math.random() * 60)
        })),
        dominantFactor: factorNames[Math.floor(Math.random() * 4)],
        factorMomentum: momentums[Math.floor(Math.random() * 3)]
      };
    },
    
    'altman-graham': () => {
      const altmanScore = 1.5 + Math.random() * 2.5;
      const grahamNum = basePrice * (0.7 + Math.random() * 0.4);
      const zones = ['Safe', 'Grey', 'Distress'] as const;
      return {
        symbol,
        altmanZ: { 
          score: altmanScore, 
          zone: altmanScore > 2.99 ? 'Safe' : altmanScore > 1.81 ? 'Grey' : 'Distress'
        },
        grahamNumber: grahamNum,
        currentPrice: basePrice,
        marginOfSafety: ((grahamNum - basePrice) / basePrice) * 100
      };
    },
    
    'altman-graham-mini': () => {
      const altmanScore = 1.5 + Math.random() * 2.5;
      return {
        symbol, 
        altmanZ: { 
          score: altmanScore, 
          zone: altmanScore > 2.99 ? 'Safe' : altmanScore > 1.81 ? 'Grey' : 'Distress'
        },
        grahamNumber: basePrice * (0.7 + Math.random() * 0.4),
        currentPrice: basePrice,
        marginOfSafety: (Math.random() - 0.3) * 40
      };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // NEW TOOLS - Volume Profile, VWAP, ORB, Fibonacci, Tax Calculator
    // ═══════════════════════════════════════════════════════════════════════════
    
    'volume-profile': () => {
      const range = basePrice * 0.05;
      const poc = basePrice + (Math.random() - 0.5) * range * 0.5;
      const vah = poc + range * 0.3;
      const val = poc - range * 0.3;
      const priceVsPOC = ((basePrice - poc) / poc) * 100;
      
      // Generate volume distribution
      const volumeDistribution = [];
      const priceStep = range / 20;
      const startPrice = val - range * 0.2;
      for (let i = 0; i < 25; i++) {
        const price = startPrice + i * priceStep;
        const distFromPOC = Math.abs(price - poc) / range;
        const baseVol = 500000 * Math.exp(-distFromPOC * 3);
        const buyVol = baseVol * (0.4 + Math.random() * 0.3);
        const sellVol = baseVol - buyVol;
        volumeDistribution.push({
          price: Math.round(price * 100) / 100,
          volume: Math.round(baseVol),
          buyVolume: Math.round(buyVol),
          sellVolume: Math.round(sellVol),
          isHVN: distFromPOC < 0.2,
          isLVN: distFromPOC > 0.6,
          isPOC: i === 12,
          isVAH: Math.abs(price - vah) < priceStep,
          isVAL: Math.abs(price - val) < priceStep,
        });
      }
      
      const totalBuy = volumeDistribution.reduce((sum, v) => sum + v.buyVolume, 0);
      const totalSell = volumeDistribution.reduce((sum, v) => sum + v.sellVolume, 0);
      const delta = totalBuy - totalSell;
      
      const pricePositions = ['Above VAH', 'In Value Area', 'Below VAL', 'At POC'] as const;
      const pricePosition = basePrice > vah ? 'Above VAH' : basePrice < val ? 'Below VAL' : Math.abs(basePrice - poc) < priceStep ? 'At POC' : 'In Value Area';
      
      const profileShapes = ['P-Shape', 'b-Shape', 'D-Shape', 'B-Shape'] as const;
      const shapeImplications = {
        'P-Shape': 'Bullish - buyers in control, possible breakout setup',
        'b-Shape': 'Bearish - sellers in control, possible breakdown setup',
        'D-Shape': 'Balanced - fair value established, range-bound trading likely',
        'B-Shape': 'Double distribution - major battle between buyers/sellers'
      };
      const shape = profileShapes[Math.floor(Math.random() * 4)];
      
      return {
        symbol, asOf,
        timeframe: ['1D', '5D', '20D', 'Session'][Math.floor(Math.random() * 4)] as '1D' | '5D' | '20D' | 'Session',
        poc: Math.round(poc * 100) / 100,
        vah: Math.round(vah * 100) / 100,
        val: Math.round(val * 100) / 100,
        currentPrice: basePrice,
        valueAreaVolumePct: 68 + Math.random() * 8,
        valueAreaRange: Math.round(((vah - val) / poc) * 10000) / 100,
        pricePosition,
        priceVsPOC: Math.round(priceVsPOC * 100) / 100,
        lvnZones: [
          { low: val - range * 0.4, high: val - range * 0.25, gapSize: range * 0.15 },
          { low: vah + range * 0.2, high: vah + range * 0.35, gapSize: range * 0.15 }
        ].map(z => ({ low: Math.round(z.low * 100) / 100, high: Math.round(z.high * 100) / 100, gapSize: Math.round(z.gapSize * 100) / 100 })),
        hvnZones: [
          { price: Math.round(poc * 100) / 100, volumePct: 15 + Math.random() * 10 },
          { price: Math.round((poc - range * 0.15) * 100) / 100, volumePct: 8 + Math.random() * 7 },
          { price: Math.round((poc + range * 0.15) * 100) / 100, volumePct: 8 + Math.random() * 7 }
        ],
        bias: delta > 100000 ? 'Bullish' : delta < -100000 ? 'Bearish' : 'Neutral',
        biasReason: delta > 100000 
          ? 'Buy volume dominates, suggesting institutional accumulation. Price likely to test VAH.' 
          : delta < -100000 
          ? 'Sell volume dominates, suggesting distribution. Price may test VAL support.'
          : 'Balanced volume suggests consolidation. Wait for directional catalyst.',
        nearestSupport: Math.round((pricePosition === 'Below VAL' ? val - range * 0.3 : val) * 100) / 100,
        nearestResistance: Math.round((pricePosition === 'Above VAH' ? vah + range * 0.3 : vah) * 100) / 100,
        totalBuyVolume: totalBuy,
        totalSellVolume: totalSell,
        volumeDelta: delta,
        deltaSignal: delta > 200000 ? 'Strong Buy' : delta > 50000 ? 'Buy' : delta < -200000 ? 'Strong Sell' : delta < -50000 ? 'Sell' : 'Neutral',
        profileShape: shape,
        shapeImplication: shapeImplications[shape],
        volumeDistribution,
        insights: [
          `POC at ₹${poc.toFixed(2)} represents highest traded volume - key pivot level`,
          `Value Area spans ${((vah - val) / poc * 100).toFixed(1)}% - ${(vah - val) / poc * 100 < 3 ? 'tight range, breakout expected' : 'normal volatility'}`,
          pricePosition === 'Above VAH' ? 'Price above value area - extended, watch for pullback to VAH' : pricePosition === 'Below VAL' ? 'Price below value area - oversold, watch for bounce to VAL' : 'Price in value area - fair value zone',
          `Volume delta ${delta > 0 ? 'positive' : 'negative'} indicates ${delta > 0 ? 'buyer' : 'seller'} dominance`
        ]
      };
    },
    
    'vwap-analysis': () => {
      const sessionVWAP = basePrice * (0.98 + Math.random() * 0.04);
      const stdDev = basePrice * (0.005 + Math.random() * 0.01);
      const priceVsVWAP = ((basePrice - sessionVWAP) / sessionVWAP) * 100;
      
      const upperBand1 = sessionVWAP + stdDev;
      const lowerBand1 = sessionVWAP - stdDev;
      const upperBand2 = sessionVWAP + stdDev * 2;
      const lowerBand2 = sessionVWAP - stdDev * 2;
      
      const pricePosition = 
        basePrice > upperBand2 ? 'Above +2σ' :
        basePrice > upperBand1 ? 'Above +1σ' :
        basePrice < lowerBand2 ? 'Below -2σ' :
        basePrice < lowerBand1 ? 'Below -1σ' :
        Math.abs(basePrice - sessionVWAP) < stdDev * 0.3 ? 'At VWAP' : 'Between Bands';
      
      const positionSignal = 
        pricePosition.includes('+2') ? 'Overbought' :
        pricePosition.includes('+1') ? 'Bullish' :
        pricePosition.includes('-2') ? 'Oversold' :
        pricePosition.includes('-1') ? 'Bearish' : 'Neutral';
      
      // Generate intraday history
      const history = [];
      let runningVWAP = basePrice * 0.99;
      let price = basePrice * 0.98;
      for (let i = 0; i < 78; i++) { // 5-min bars from 9:15 to 15:30
        const hour = 9 + Math.floor((i * 5 + 15) / 60);
        const min = (15 + i * 5) % 60;
        price += (Math.random() - 0.48) * stdDev * 0.3;
        runningVWAP += (price - runningVWAP) * 0.05;
        history.push({
          time: `${hour}:${min.toString().padStart(2, '0')}`,
          price: Math.round(price * 100) / 100,
          vwap: Math.round(runningVWAP * 100) / 100,
          upperBand1: Math.round((runningVWAP + stdDev) * 100) / 100,
          lowerBand1: Math.round((runningVWAP - stdDev) * 100) / 100,
          upperBand2: Math.round((runningVWAP + stdDev * 2) * 100) / 100,
          lowerBand2: Math.round((runningVWAP - stdDev * 2) * 100) / 100,
          volume: Math.round(50000 + Math.random() * 100000)
        });
      }
      
      const vwapSlopes = ['Rising', 'Falling', 'Flat'] as const;
      const vwapSlope = history[history.length - 1].vwap > history[history.length - 10].vwap ? 'Rising' : history[history.length - 1].vwap < history[history.length - 10].vwap ? 'Falling' : 'Flat';
      
      const signals = ['Strong Buy', 'Buy', 'Neutral', 'Sell', 'Strong Sell'] as const;
      const signal = positionSignal === 'Oversold' ? 'Strong Buy' : positionSignal === 'Bearish' ? 'Buy' : positionSignal === 'Overbought' ? 'Strong Sell' : positionSignal === 'Bullish' ? 'Sell' : 'Neutral';
      
      const meanReversionProb = Math.abs(priceVsVWAP) > 2 ? 75 + Math.random() * 20 : Math.abs(priceVsVWAP) > 1 ? 50 + Math.random() * 25 : 20 + Math.random() * 30;
      
      const sessionPhases = ['Opening', 'Mid-Session', 'Closing', 'After-Hours'] as const;
      const now = new Date();
      const hour = now.getHours();
      const sessionPhase = hour < 10 ? 'Opening' : hour < 14 ? 'Mid-Session' : hour < 16 ? 'Closing' : 'After-Hours';
      
      return {
        symbol, asOf,
        sessionVWAP: Math.round(sessionVWAP * 100) / 100,
        currentPrice: basePrice,
        priceVsVWAP: Math.round(priceVsVWAP * 100) / 100,
        upperBand1: Math.round(upperBand1 * 100) / 100,
        lowerBand1: Math.round(lowerBand1 * 100) / 100,
        upperBand2: Math.round(upperBand2 * 100) / 100,
        lowerBand2: Math.round(lowerBand2 * 100) / 100,
        stdDev: Math.round(stdDev * 100) / 100,
        pricePosition,
        positionSignal,
        vwapSlope,
        slopeStrength: 30 + Math.floor(Math.random() * 50),
        meanReversionProb: Math.round(meanReversionProb),
        expectedReversion: Math.round(sessionVWAP * 100) / 100,
        anchoredVWAPs: [
          { anchorPoint: 'Session Open', anchorTime: '9:15', vwapValue: Math.round(sessionVWAP * 0.995 * 100) / 100, currentDeviation: Math.round(priceVsVWAP * 0.8 * 100) / 100 },
          { anchorPoint: 'Day High', anchorTime: '11:30', vwapValue: Math.round(sessionVWAP * 1.01 * 100) / 100, currentDeviation: Math.round((priceVsVWAP - 1) * 100) / 100 },
          { anchorPoint: 'Day Low', anchorTime: '10:45', vwapValue: Math.round(sessionVWAP * 0.99 * 100) / 100, currentDeviation: Math.round((priceVsVWAP + 1) * 100) / 100 }
        ],
        signal,
        signalReason: positionSignal === 'Overbought' 
          ? 'Price extended above +2σ band. High probability of mean reversion to VWAP. Consider profit-taking or short scalp.'
          : positionSignal === 'Oversold'
          ? 'Price stretched below -2σ band. Oversold conditions favor bounce back to VWAP. Look for long entry on confirmation.'
          : positionSignal === 'Bullish'
          ? 'Price trading above VWAP with positive slope. Buyers in control. Use VWAP as trailing stop for longs.'
          : positionSignal === 'Bearish'
          ? 'Price below VWAP with negative momentum. Sellers dominating. Use rallies to VWAP as short entries.'
          : 'Price near VWAP - fair value zone. Wait for directional break or trade the range.',
        vwapSupport: Math.round((sessionVWAP - stdDev * 0.5) * 100) / 100,
        vwapResistance: Math.round((sessionVWAP + stdDev * 0.5) * 100) / 100,
        vwapTouchesCount: 3 + Math.floor(Math.random() * 5),
        lastVWAPTouch: `${10 + Math.floor(Math.random() * 4)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        isFirstHour: hour < 10,
        sessionPhase,
        history,
        insights: [
          `Session VWAP at ₹${sessionVWAP.toFixed(2)} - institutional average price reference`,
          `Price ${priceVsVWAP > 0 ? 'above' : 'below'} VWAP by ${Math.abs(priceVsVWAP).toFixed(2)}% - ${Math.abs(priceVsVWAP) > 1.5 ? 'extended' : 'normal'}`,
          `VWAP slope ${vwapSlope.toLowerCase()} - ${vwapSlope === 'Rising' ? 'bullish session' : vwapSlope === 'Falling' ? 'bearish session' : 'balanced session'}`,
          `Mean reversion probability: ${meanReversionProb.toFixed(0)}% - ${meanReversionProb > 60 ? 'high' : 'moderate'} chance of pullback to VWAP`
        ]
      };
    },
    
    'orb-analysis': () => {
      const orbRange = basePrice * (0.005 + Math.random() * 0.015);
      const orbMid = basePrice * (0.995 + Math.random() * 0.01);
      const orbHigh = orbMid + orbRange / 2;
      const orbLow = orbMid - orbRange / 2;
      const previousClose = basePrice * (0.98 + Math.random() * 0.04);
      
      const gapPct = ((basePrice - previousClose) / previousClose) * 100;
      const gapTypes = ['Gap Up', 'Gap Down', 'No Gap', 'Full Gap Up', 'Full Gap Down'] as const;
      const gapType = gapPct > 1 ? (gapPct > 2 ? 'Full Gap Up' : 'Gap Up') : gapPct < -1 ? (gapPct < -2 ? 'Full Gap Down' : 'Gap Down') : 'No Gap';
      
      const breakoutStatuses = ['Above ORB High', 'Below ORB Low', 'Inside ORB', 'Testing High', 'Testing Low'] as const;
      const breakoutStatus = basePrice > orbHigh * 1.005 ? 'Above ORB High' : basePrice < orbLow * 0.995 ? 'Below ORB Low' : Math.abs(basePrice - orbHigh) < orbRange * 0.1 ? 'Testing High' : Math.abs(basePrice - orbLow) < orbRange * 0.1 ? 'Testing Low' : 'Inside ORB';
      
      const breakoutDirection = breakoutStatus === 'Above ORB High' ? 'Bullish' : breakoutStatus === 'Below ORB Low' ? 'Bearish' : 'None';
      const breakoutStrength = breakoutDirection !== 'None' ? 50 + Math.floor(Math.random() * 45) : 20 + Math.floor(Math.random() * 30);
      
      const signals = ['Long Breakout', 'Short Breakout', 'Wait for Breakout', 'Fade the Move', 'No Trade'] as const;
      const signal = breakoutDirection === 'Bullish' && breakoutStrength > 65 ? 'Long Breakout' : breakoutDirection === 'Bearish' && breakoutStrength > 65 ? 'Short Breakout' : breakoutDirection === 'None' ? 'Wait for Breakout' : breakoutStrength < 40 ? 'Fade the Move' : 'Wait for Breakout';
      
      // Generate intraday data
      const history = [];
      let price = previousClose * (1 + gapPct / 100 * 0.3);
      for (let i = 0; i < 30; i++) {
        const hour = 9 + Math.floor((i * 5 + 15) / 60);
        const min = (15 + i * 5) % 60;
        const isORBPeriod = i < 3; // First 15 minutes
        price += (Math.random() - 0.48) * orbRange * 0.15;
        history.push({
          time: `${hour}:${min.toString().padStart(2, '0')}`,
          price: Math.round(price * 100) / 100,
          volume: Math.round((isORBPeriod ? 200000 : 80000) + Math.random() * 100000),
          isORBPeriod
        });
      }
      
      const orbTimeframes = ['5min', '15min', '30min'] as const;
      const sessionTypes = ['Trend Day', 'Range Day', 'Reversal Day', 'Undetermined'] as const;
      const falseBreakoutRisks = ['High', 'Medium', 'Low'] as const;
      
      return {
        symbol, asOf,
        orbTimeframe: orbTimeframes[Math.floor(Math.random() * 3)],
        orbHigh: Math.round(orbHigh * 100) / 100,
        orbLow: Math.round(orbLow * 100) / 100,
        orbRange: Math.round((orbRange / orbMid) * 10000) / 100,
        orbMidpoint: Math.round(orbMid * 100) / 100,
        currentPrice: basePrice,
        breakoutStatus,
        breakoutTime: breakoutDirection !== 'None' ? `${9 + Math.floor(Math.random() * 2)}:${(20 + Math.floor(Math.random() * 40)).toString().padStart(2, '0')}` : undefined,
        breakoutStrength,
        breakoutDirection,
        breakoutConfirmed: breakoutStrength > 70,
        confirmationFactors: breakoutStrength > 60 ? ['Volume > 1.5x avg', 'Strong candle close', 'RSI confirmation'] : [],
        falseBreakoutRisk: breakoutStrength > 70 ? 'Low' : breakoutStrength > 50 ? 'Medium' : 'High',
        falseBreakoutReasons: breakoutStrength < 70 ? ['Volume below average', 'Wick rejection visible', 'Near key resistance'] : [],
        gap: {
          gapType,
          gapSize: Math.round(gapPct * 100) / 100,
          gapFilled: Math.random() > 0.6,
          gapFillTime: Math.random() > 0.5 ? '10:15' : undefined,
          previousClose: Math.round(previousClose * 100) / 100,
          todayOpen: Math.round((previousClose * (1 + gapPct / 100)) * 100) / 100
        },
        preMarketHigh: Math.round((orbHigh * 1.01) * 100) / 100,
        preMarketLow: Math.round((orbLow * 0.99) * 100) / 100,
        previousDayHigh: Math.round((previousClose * 1.015) * 100) / 100,
        previousDayLow: Math.round((previousClose * 0.985) * 100) / 100,
        previousClose: Math.round(previousClose * 100) / 100,
        orbVolume: 500000 + Math.floor(Math.random() * 500000),
        avgVolume: 400000,
        volumeRatio: 1 + Math.random() * 0.8,
        signal,
        signalReason: signal === 'Long Breakout' 
          ? 'Strong bullish breakout above ORB high with volume confirmation. Enter long with stop below ORB low.'
          : signal === 'Short Breakout'
          ? 'Bearish breakdown below ORB low with selling pressure. Enter short with stop above ORB high.'
          : signal === 'Fade the Move'
          ? 'Weak breakout attempt. Consider fading back to ORB midpoint.'
          : 'Price contained in ORB. Wait for clear break of high or low before entering.',
        longEntry: Math.round((orbHigh + orbRange * 0.02) * 100) / 100,
        longTarget1: Math.round((orbHigh + orbRange) * 100) / 100,
        longTarget2: Math.round((orbHigh + orbRange * 1.5) * 100) / 100,
        longStop: Math.round((orbLow - orbRange * 0.1) * 100) / 100,
        shortEntry: Math.round((orbLow - orbRange * 0.02) * 100) / 100,
        shortTarget1: Math.round((orbLow - orbRange) * 100) / 100,
        shortTarget2: Math.round((orbLow - orbRange * 1.5) * 100) / 100,
        shortStop: Math.round((orbHigh + orbRange * 0.1) * 100) / 100,
        longRR: 2 + Math.random(),
        shortRR: 2 + Math.random(),
        sessionType: sessionTypes[Math.floor(Math.random() * 4)],
        sessionBias: gapPct > 0.5 ? 'Bullish' : gapPct < -0.5 ? 'Bearish' : 'Neutral',
        orbBreakoutSuccessRate: 55 + Math.floor(Math.random() * 20),
        avgBreakoutMove: 0.8 + Math.random() * 1.2,
        history,
        insights: [
          `ORB Range: ${(orbRange / orbMid * 100).toFixed(2)}% - ${orbRange / orbMid * 100 < 1 ? 'Tight range, potential explosive move' : 'Normal volatility'}`,
          gapType !== 'No Gap' ? `${gapType} of ${Math.abs(gapPct).toFixed(2)}% - ${gapPct > 0 ? 'bullish' : 'bearish'} sentiment` : 'No significant gap today',
          `Volume ratio ${(1 + Math.random() * 0.8).toFixed(2)}x - ${Math.random() > 0.5 ? 'above' : 'below'} average participation`,
          breakoutDirection !== 'None' ? `${breakoutDirection} breakout ${breakoutStrength > 70 ? 'confirmed' : 'developing'} - ${breakoutStrength}% strength` : 'No breakout yet - watch for break of ORB boundaries'
        ]
      };
    },
    
    'fibonacci-levels': () => {
      const swingRange = basePrice * (0.1 + Math.random() * 0.15);
      const trendDirection = Math.random() > 0.5 ? 'Uptrend' : 'Downtrend';
      const swingHigh = trendDirection === 'Uptrend' ? basePrice + swingRange * 0.3 : basePrice + swingRange * 0.7;
      const swingLow = trendDirection === 'Uptrend' ? basePrice - swingRange * 0.7 : basePrice - swingRange * 0.3;
      
      const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.65, 0.786, 1.0];
      const currentRetracement = trendDirection === 'Uptrend' 
        ? ((swingHigh - basePrice) / (swingHigh - swingLow)) * 100
        : ((basePrice - swingLow) / (swingHigh - swingLow)) * 100;
      
      const retracementLevels = fibLevels.map(level => {
        const price = trendDirection === 'Uptrend'
          ? swingHigh - level * (swingHigh - swingLow)
          : swingLow + level * (swingHigh - swingLow);
        return {
          level,
          price: Math.round(price * 100) / 100,
          type: 'Retracement' as const,
          status: basePrice > price ? 'Above' : basePrice < price ? 'Below' : 'At',
          isKeyLevel: [0.382, 0.5, 0.618].includes(level)
        };
      });
      
      const extensionLevels = [1.272, 1.618, 2.0, 2.618].map(level => {
        const price = trendDirection === 'Uptrend'
          ? swingLow + level * (swingHigh - swingLow)
          : swingHigh - level * (swingHigh - swingLow);
        return {
          level,
          price: Math.round(price * 100) / 100,
          type: 'Extension' as const,
          status: 'Target' as const,
          isKeyLevel: level === 1.618
        };
      });
      
      const nearestSupport = retracementLevels.filter(l => l.price < basePrice).sort((a, b) => b.price - a.price)[0] || retracementLevels[0];
      const nearestResistance = retracementLevels.filter(l => l.price > basePrice).sort((a, b) => a.price - b.price)[0] || retracementLevels[retracementLevels.length - 1];
      
      const goldenPocket = trendDirection === 'Uptrend'
        ? { low: swingHigh - 0.65 * (swingHigh - swingLow), high: swingHigh - 0.618 * (swingHigh - swingLow) }
        : { low: swingLow + 0.618 * (swingHigh - swingLow), high: swingLow + 0.65 * (swingHigh - swingLow) };
      
      const retracementQualities = ['Shallow', 'Healthy', 'Deep', 'Broken'] as const;
      const retracementQuality = currentRetracement < 30 ? 'Shallow' : currentRetracement < 65 ? 'Healthy' : currentRetracement < 90 ? 'Deep' : 'Broken';
      
      // Generate price history
      const priceHistory = [];
      let price = swingLow;
      for (let i = 0; i < 60; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (60 - i));
        if (i < 30) {
          price += (swingHigh - swingLow) / 30 + (Math.random() - 0.5) * swingRange * 0.02;
        } else {
          price -= (swingHigh - swingLow) * currentRetracement / 100 / 30 + (Math.random() - 0.5) * swingRange * 0.02;
        }
        priceHistory.push({
          date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
          price: Math.round(price * 100) / 100,
          high: Math.round((price * 1.01) * 100) / 100,
          low: Math.round((price * 0.99) * 100) / 100
        });
      }
      
      return {
        symbol, asOf,
        swingHigh: Math.round(swingHigh * 100) / 100,
        swingHighDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
        swingLow: Math.round(swingLow * 100) / 100,
        swingLowDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
        swingRange: Math.round((swingHigh - swingLow) / swingLow * 10000) / 100,
        trendDirection,
        currentPrice: basePrice,
        pricePosition: `Between ${(Math.floor(currentRetracement / 10) * 10)}% and ${(Math.ceil(currentRetracement / 10) * 10)}%`,
        currentRetracement: Math.round(currentRetracement * 100) / 100,
        retracementLevels,
        extensionLevels,
        nearestSupport,
        nearestResistance,
        goldenPocket: { 
          low: Math.round(goldenPocket.low * 100) / 100, 
          high: Math.round(goldenPocket.high * 100) / 100 
        },
        confluenceZones: [
          { price: Math.round(nearestSupport.price * 100) / 100, factors: ['38.2% Fib', '50 DMA', 'Previous Support'] },
          { price: Math.round((swingLow + 0.5 * (swingHigh - swingLow)) * 100) / 100, factors: ['50% Fib', 'VWAP', 'Volume POC'] }
        ],
        bias: retracementQuality === 'Healthy' && trendDirection === 'Uptrend' ? 'Bullish' : retracementQuality === 'Broken' ? 'Bearish' : 'Neutral',
        biasReason: retracementQuality === 'Healthy' 
          ? `${currentRetracement.toFixed(1)}% retracement is healthy for ${trendDirection.toLowerCase()} continuation. Look for entry near ${nearestSupport.level * 100}% level.`
          : retracementQuality === 'Shallow'
          ? 'Shallow pullback indicates strong momentum. May continue without deeper retracement.'
          : retracementQuality === 'Deep'
          ? 'Deep retracement - trend weakening. Watch for break of 78.6% level.'
          : 'Trend structure broken. Wait for new swing formation.',
        entryZone: {
          low: Math.round(goldenPocket.low * 100) / 100,
          high: Math.round(goldenPocket.high * 100) / 100,
          reason: 'Golden pocket zone (61.8%-65%)'
        },
        targetZone: {
          low: Math.round(extensionLevels[0].price * 100) / 100,
          high: Math.round(extensionLevels[1].price * 100) / 100,
          reason: '127.2% - 161.8% extension'
        },
        stopLossZone: {
          price: Math.round((trendDirection === 'Uptrend' ? swingLow * 0.99 : swingHigh * 1.01) * 100) / 100,
          reason: 'Below swing low with buffer'
        },
        retracementQuality,
        qualityImplication: retracementQuality === 'Healthy' 
          ? 'Ideal buying zone for trend continuation'
          : retracementQuality === 'Shallow'
          ? 'Strong momentum - entry may be at premium'
          : retracementQuality === 'Deep'
          ? 'Caution - trend showing weakness'
          : 'Trend broken - reassess direction',
        historicalReactions: [
          { level: 0.382, reactionCount: 5 + Math.floor(Math.random() * 5), avgBounce: 2 + Math.random() * 3 },
          { level: 0.5, reactionCount: 4 + Math.floor(Math.random() * 4), avgBounce: 1.5 + Math.random() * 2.5 },
          { level: 0.618, reactionCount: 6 + Math.floor(Math.random() * 6), avgBounce: 3 + Math.random() * 4 }
        ],
        priceHistory,
        insights: [
          `${trendDirection} with ${currentRetracement.toFixed(1)}% retracement - ${retracementQuality.toLowerCase()} pullback`,
          `Golden pocket zone: ₹${goldenPocket.low.toFixed(2)} - ₹${goldenPocket.high.toFixed(2)} - key reversal area`,
          `Nearest support at ₹${nearestSupport.price.toFixed(2)} (${(nearestSupport.level * 100).toFixed(1)}% level)`,
          retracementQuality === 'Healthy' ? 'Healthy retracement suggests trend continuation likely' : retracementQuality === 'Deep' ? 'Deep pullback - monitor for trend break' : `${retracementQuality} retracement observed`
        ]
      };
    },
    
    'tax-calculator': () => {
      const holdings = Array.from({ length: 8 }, (_, i) => {
        const symbols = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'HINDUNILVR', 'ITC', 'SBIN'];
        const buyPrice = 1000 + Math.random() * 2000;
        const currentPrice = buyPrice * (0.8 + Math.random() * 0.6);
        const quantity = 10 + Math.floor(Math.random() * 50);
        const holdingPeriod = Math.floor(Math.random() * 24);
        const gain = (currentPrice - buyPrice) * quantity;
        return {
          symbol: symbols[i],
          buyDate: new Date(Date.now() - holdingPeriod * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
          buyPrice: Math.round(buyPrice * 100) / 100,
          quantity,
          currentPrice: Math.round(currentPrice * 100) / 100,
          holdingPeriod,
          isLongTerm: holdingPeriod >= 12,
          gain: Math.round(gain),
          gainPct: Math.round(((currentPrice - buyPrice) / buyPrice) * 10000) / 100
        };
      });
      
      const ltcgGains = holdings.filter(h => h.isLongTerm && h.gain > 0).reduce((sum, h) => sum + h.gain, 0);
      const ltcgLosses = Math.abs(holdings.filter(h => h.isLongTerm && h.gain < 0).reduce((sum, h) => sum + h.gain, 0));
      const stcgGains = holdings.filter(h => !h.isLongTerm && h.gain > 0).reduce((sum, h) => sum + h.gain, 0);
      const stcgLosses = Math.abs(holdings.filter(h => !h.isLongTerm && h.gain < 0).reduce((sum, h) => sum + h.gain, 0));
      
      const netLTCG = Math.max(0, ltcgGains - ltcgLosses);
      const netSTCG = Math.max(0, stcgGains - stcgLosses);
      const ltcgExemption = Math.min(125000, netLTCG);
      const taxableLTCG = Math.max(0, netLTCG - ltcgExemption);
      const ltcgTax = taxableLTCG * 0.125;
      const stcgTax = netSTCG * 0.20;
      const totalTax = ltcgTax + stcgTax;
      
      const totalGains = ltcgGains + stcgGains;
      const effectiveTaxRate = totalGains > 0 ? (totalTax / totalGains) * 100 : 0;
      
      const totalDividends = 20000 + Math.random() * 80000;
      const tdsDeducted = totalDividends > 10000 ? (totalDividends - 10000) * 0.1 : 0;
      const dividendTaxRate = 30; // Assuming 30% slab
      const additionalDividendTax = totalDividends * (dividendTaxRate / 100) - tdsDeducted;
      
      const holdingsWithLoss = holdings.filter(h => h.gain < 0);
      const harvestingOpportunities = holdingsWithLoss.map(h => ({
        symbol: h.symbol,
        currentLoss: Math.abs(h.gain),
        potentialTaxSaving: Math.round(Math.abs(h.gain) * 0.2),
        recommendedAction: `Sell ${h.symbol} to book ₹${Math.abs(h.gain).toLocaleString('en-IN')} loss. Can offset ${h.isLongTerm ? 'LTCG' : 'STCG and LTCG'} gains.`,
        canOffset: holdings.filter(hh => hh.gain > 0 && (h.isLongTerm ? hh.isLongTerm : true)).map(hh => hh.symbol).slice(0, 3)
      }));
      
      const potentialTaxSaving = harvestingOpportunities.reduce((sum, o) => sum + o.potentialTaxSaving, 0);
      
      const totalInvested = holdings.reduce((sum, h) => sum + h.buyPrice * h.quantity, 0);
      const currentValue = holdings.reduce((sum, h) => sum + h.currentPrice * h.quantity, 0);
      
      return {
        asOf,
        financialYear: '2024-25',
        holdings,
        taxBreakdown: {
          ltcgGains: Math.round(ltcgGains),
          stcgGains: Math.round(stcgGains),
          ltcgLosses: Math.round(ltcgLosses),
          stcgLosses: Math.round(stcgLosses),
          netLTCG: Math.round(netLTCG),
          netSTCG: Math.round(netSTCG),
          ltcgExemption: Math.round(ltcgExemption),
          taxableLTCG: Math.round(taxableLTCG),
          ltcgTax: Math.round(ltcgTax),
          stcgTax: Math.round(stcgTax),
          totalTax: Math.round(totalTax),
          effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100
        },
        harvestingOpportunities,
        potentialTaxSaving: Math.round(potentialTaxSaving),
        dividendTax: {
          totalDividends: Math.round(totalDividends),
          tdsDeducted: Math.round(tdsDeducted),
          additionalTaxDue: Math.round(Math.max(0, additionalDividendTax)),
          effectiveRate: dividendTaxRate,
          exemptionUsed: 10000
        },
        grandfatheredGains: Math.floor(Math.random() * 50000),
        suggestions: [
          netLTCG < 125000 ? 'LTCG within ₹1.25L exemption - consider booking more long-term gains' : 'Maximize use of ₹1.25L LTCG exemption',
          potentialTaxSaving > 0 ? `Harvest losses to save ₹${potentialTaxSaving.toLocaleString('en-IN')} in taxes` : 'No harvesting opportunities currently',
          'Consider ELSS investments for Section 80C deduction',
          'Hold appreciated stocks for 12+ months to qualify for lower LTCG rate',
          totalDividends > 10000 ? 'Dividends above ₹10,000 - TDS of 10% applied' : 'Dividends below TDS threshold'
        ],
        estimatedAnnualTax: Math.round(totalTax * 1.1),
        holdingsApproachingLongTerm: holdings.filter(h => h.holdingPeriod >= 10 && h.holdingPeriod < 12),
        totalInvested: Math.round(totalInvested),
        currentValue: Math.round(currentValue),
        totalUnrealizedGain: Math.round(currentValue - totalInvested),
        totalRealizedGain: 0,
        realizedGainsThisYear: Math.round((ltcgGains + stcgGains) * 0.3),
        insights: [
          `Total tax liability: ₹${totalTax.toLocaleString('en-IN')} (LTCG: ₹${Math.round(ltcgTax).toLocaleString('en-IN')}, STCG: ₹${Math.round(stcgTax).toLocaleString('en-IN')})`,
          ltcgExemption > 0 ? `Using ₹${ltcgExemption.toLocaleString('en-IN')} of ₹1.25L LTCG exemption` : 'LTCG exemption not utilized',
          potentialTaxSaving > 5000 ? `Tax-loss harvesting can save ₹${potentialTaxSaving.toLocaleString('en-IN')}` : 'Limited harvesting opportunities',
          `Effective tax rate: ${effectiveTaxRate.toFixed(2)}% on total gains`
        ]
      };
    },
  };
  
  // Return specific mock or generic fallback
  if (mockGenerators[cardId]) {
    return mockGenerators[cardId]();
  }
  
  // Generic fallback for any unknown cards
  return {
    symbol,
    asOf,
    score,
    verdict: ['Bullish', 'Neutral', 'Bearish'][Math.floor(Math.random() * 3)],
    value: basePrice,
    change: (Math.random() - 0.5) * 10
  };
}

export default generateMockData;
