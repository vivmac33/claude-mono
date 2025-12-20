/**
 * Fix mock data structures to match component interfaces
 */
const fs = require('fs');
const path = require('path');

const cardsDir = path.join(__dirname, 'cards');
const round = (n, d = 2) => Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper to load, fix, and save
function fixCard(filename, fixer) {
  const filepath = path.join(cardsDir, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`Skip: ${filename} not found`);
    return;
  }
  try {
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    fixer(data);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log(`Fixed: ${filename}`);
  } catch (e) {
    console.log(`Error fixing ${filename}: ${e.message}`);
  }
}

// Fix each card's data structure

// 1. Pattern Matcher - needs currentPattern and matches arrays
fixCard('pattern-matcher.json', (data) => {
  Object.keys(data).forEach(sym => {
    const d = data[sym];
    // Create currentPattern array
    if (!d.currentPattern) {
      d.currentPattern = Array.from({length: 20}, (_, i) => ({
        t: `D${i+1}`,
        v: round(d.currentPrice * (1 + (Math.random() - 0.5) * 0.1))
      }));
    }
    // Create matches array from detectedPatterns
    if (!d.matches && d.detectedPatterns) {
      d.matches = d.detectedPatterns.slice(0, 3).map(p => ({
        symbol: sym,
        period: p.date || '2024-Q3',
        similarity: p.reliability || randInt(70, 95),
        outcome: rand(-10, 20),
        alignedPattern: Array.from({length: 20}, (_, i) => ({
          t: `D${i+1}`,
          v: round(d.currentPrice * (1 + (Math.random() - 0.5) * 0.1))
        }))
      }));
    }
  });
});

// 2. Delivery Analysis - needs deliveryTrend as array with proper structure
fixCard('delivery-analysis.json', (data) => {
  Object.keys(data).forEach(sym => {
    const d = data[sym];
    if (!d.avgDelivery) {
      d.avgDelivery = { "5D": round(d.deliveryPercentage * rand(0.9, 1.1)), "20D": round(d.deliveryPercentage * rand(0.85, 1.15)) };
    }
    if (!d.volumeAnalysis) {
      d.volumeAnalysis = { today: d.metrics?.volumeToday || randInt(1000000, 5000000), avg: d.metrics?.avgVolume || randInt(800000, 4000000), ratio: round(rand(0.8, 1.5)) };
    }
  });
});

// 3. Cash Conversion Cycle - ensure components have trend field
fixCard('cash-conversion-cycle.json', (data) => {
  Object.keys(data).forEach(sym => {
    const d = data[sym];
    if (d.components) {
      ['dso', 'dio', 'dpo'].forEach(key => {
        if (d.components[key] && typeof d.components[key].trend === 'undefined') {
          d.components[key].trend = pick(['up', 'down', 'stable']);
        }
      });
    }
  });
});

// 4. Cash Conversion Earnings - ensure proper structure
fixCard('cash-conversion-earnings.json', (data) => {
  Object.keys(data).forEach(sym => {
    const d = data[sym];
    if (!d.qualityIndicators) {
      d.qualityIndicators = {
        accrualQuality: d.quality === 'High' ? 'Good' : d.quality === 'Low' ? 'Poor' : 'Fair',
        cashFlowQuality: d.quality === 'High' ? 'Strong' : d.quality === 'Low' ? 'Weak' : 'Average',
        earningsPersistence: randInt(60, 95)
      };
    }
  });
});

// 5. Dividend SIP Tracker - ensure proper structure  
fixCard('dividend-sip-tracker.json', (data) => {
  Object.keys(data).forEach(sym => {
    const d = data[sym];
    if (!d.compoundingEffect) {
      d.compoundingEffect = {
        withoutDRIP: d.currentValue || round(rand(500000, 1500000)),
        withDRIP: d.reinvestmentImpact?.withReinvest || round(rand(600000, 1800000)),
        extraReturns: round(rand(10, 30))
      };
    }
  });
});

// 6. Income Stability - ensure arrays are properly structured
fixCard('income-stability.json', (data) => {
  Object.keys(data).forEach(sym => {
    const d = data[sym];
    if (!d.dividendHistory) {
      d.dividendHistory = d.historical || Array.from({length: 5}, (_, i) => ({
        year: `FY${20 + i}`,
        amount: round(rand(5, 20)),
        yield: round(rand(1, 4)),
        growth: round(rand(-5, 15))
      }));
    }
  });
});

// 7. Institutional Flows - ensure netFlow is a number  
fixCard('institutional-flows.json', (data) => {
  Object.keys(data).forEach(sym => {
    const d = data[sym];
    if (typeof d.netFlow !== 'number') {
      d.netFlow = round(rand(-500, 800));
    }
  });
});

// 8. Insider Trades - ensure proper date format
fixCard('insider-trades.json', (data) => {
  Object.keys(data).forEach(sym => {
    const d = data[sym];
    if (d.recentTrades) {
      d.recentTrades = d.recentTrades.map(t => ({
        ...t,
        value: typeof t.value === 'number' ? `₹${t.value}Cr` : t.value
      }));
    }
  });
});

// 9. Trend Strength - ensure trendHistory is properly structured
fixCard('trend-strength.json', (data) => {
  Object.keys(data).forEach(sym => {
    const d = data[sym];
    if (d.trendHistory && Array.isArray(d.trendHistory)) {
      d.trendHistory = d.trendHistory.slice(0, 10).map((h, i) => ({
        ...h,
        date: `2024-12-${String(20 - i).padStart(2, '0')}`
      }));
    }
  });
});

// 10. Momentum Heatmap - ensure timeframes object structure
fixCard('momentum-heatmap.json', (data) => {
  Object.keys(data).forEach(sym => {
    const d = data[sym];
    if (d.timeframes) {
      Object.keys(d.timeframes).forEach(tf => {
        if (typeof d.timeframes[tf].momentum === 'number') {
          d.timeframes[tf].signal = d.timeframes[tf].momentum > 0 ? 'Bullish' : 'Bearish';
        }
      });
    }
  });
});

// 11. Volatility Regime - ensure volHistory has proper dates
fixCard('volatility-regime.json', (data) => {
  Object.keys(data).forEach(sym => {
    const d = data[sym];
    if (d.volHistory && Array.isArray(d.volHistory)) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      d.volHistory = d.volHistory.map((h, i) => ({
        ...h,
        month: h.month || months[(12 - d.volHistory.length + i) % 12]
      }));
    }
  });
});

// 12. ETF Comparator - this is a portfolio-level card, structure should be correct
fixCard('etf-comparator.json', (data) => {
  // ETF data should be at root level, not per-symbol
  if (data.TCS) {
    // Restructure: take the first stock's data as the portfolio-level data
    const firstData = data.TCS || data[Object.keys(data)[0]];
    Object.keys(data).forEach(k => delete data[k]);
    Object.assign(data, firstData);
  }
});

// 13. Rebalance Optimizer - portfolio level
fixCard('rebalance-optimizer.json', (data) => {
  if (data.TCS) {
    const firstData = data.TCS || data[Object.keys(data)[0]];
    Object.keys(data).forEach(k => delete data[k]);
    Object.assign(data, firstData);
  }
});

// 14. Trade Journal - portfolio level
fixCard('trade-journal.json', (data) => {
  if (data.TCS) {
    const firstData = data.TCS || data[Object.keys(data)[0]];
    Object.keys(data).forEach(k => delete data[k]);
    Object.assign(data, firstData);
  }
});

// 15. Advanced Screener - portfolio level
fixCard('advanced-screener.json', (data) => {
  if (data.TCS) {
    const firstData = data.TCS || data[Object.keys(data)[0]];
    Object.keys(data).forEach(k => delete data[k]);
    Object.assign(data, firstData);
  }
});

// 16. Attribution Tax Optimizer - portfolio level
fixCard('attribution-tax-optimizer.json', (data) => {
  if (data.TCS) {
    const firstData = data.TCS || data[Object.keys(data)[0]];
    Object.keys(data).forEach(k => delete data[k]);
    Object.assign(data, firstData);
  }
});

// 17. Macro Calendar - portfolio level
fixCard('macro-calendar.json', (data) => {
  if (data.TCS) {
    const firstData = data.TCS || data[Object.keys(data)[0]];
    Object.keys(data).forEach(k => delete data[k]);
    Object.assign(data, firstData);
  }
});

// 18. Macro Pulse - portfolio level
fixCard('macro-pulse.json', (data) => {
  if (data.TCS) {
    const firstData = data.TCS || data[Object.keys(data)[0]];
    Object.keys(data).forEach(k => delete data[k]);
    Object.assign(data, firstData);
  }
});

console.log('\nAll data structure fixes complete!');
