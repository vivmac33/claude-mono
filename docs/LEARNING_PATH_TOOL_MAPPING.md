# Monomorph Learning Paths: Tool Mapping & Gap Analysis

## Executive Summary

| Path | Total Concepts | Tools Available | Coverage | Gaps |
|------|---------------|-----------------|----------|------|
| **Scalper Mastery** | 30 | 22 | 73% | Volume Profile, VWAP dedicated |
| **Intraday Trader** | 40 | 28 | 70% | ORB, Pre-market tool |
| **Swing Trader** | 40 | 32 | 80% | Fibonacci tool |
| **Positional Trader** | 32 | 30 | 94% | Fibonacci tool |
| **Long-Term Investor** | 40 | 38 | 95% | Tax calculator |

**Overall: 182 concepts → 150 covered by existing tools (82% coverage)**

---

## PATH 1: SCALPER MASTERY 🎯

### Module 1: Price Action Foundation

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Candlestick Basics | `candlestick-hero` | ✅ Full |
| Wicks & Rejections | `candlestick-hero` | ✅ Full |
| Key Simple Patterns | `candlestick-hero`, `pattern-matcher` | ✅ Full |
| Context Over Patterns | `market-regime-radar` | ✅ Full |
| Support & Resistance | `price-structure` | ✅ Full |
| Strong vs Weak Levels | `price-structure` | ✅ Full |
| Breakout vs Fakeout | `price-structure`, `delivery-analysis` | ✅ Full |
| Fast Level Marking | `price-structure` | ✅ Full |

### Module 2: Advanced Price Reading

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Multi-Candle Reversals | `candlestick-hero` | ✅ Full |
| Volume + Candle Relationship | `delivery-analysis`, `trade-flow-intel` | ✅ Full |
| Trend vs Range Adaptation | `market-regime-radar` | ✅ Full |
| Detecting Traps | `trade-flow-intel` | ✅ Full |
| Climactic Candles | `candlestick-hero`, `volatility-regime` | ✅ Full |
| VWAP as Momentum Barrier | `technical-indicators` (partial) | ⚠️ Partial |
| India VIX Integration | `volatility-regime` | ✅ Full |
| Recognizing Slowdowns | `trend-strength`, `momentum-heatmap` | ✅ Full |

### Module 3: Risk-First Approach

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Per-Trade Risk (0.5-1%) | `fno-risk-advisor` | ✅ Full |
| Daily Stop-Loss Limit | `trade-journal` | ✅ Full |
| Emotional Stop Rule | `trade-journal` (logging) | ⚠️ Partial |
| Make-It-Back Trap | Educational only | 📚 Theory |
| Position Size Formula | `fno-risk-advisor` | ✅ Full |
| Volatility-Based Adjustments | `volatility-regime`, `fno-risk-advisor` | ✅ Full |
| Stop-Loss Distance Logic | `fno-risk-advisor` | ✅ Full |
| F&O Lot Examples | `fno-risk-advisor` | ✅ Full |

### Module 4: Order Flow Reading

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| VWAP Basics | `technical-indicators` (partial) | ⚠️ Partial |
| Anchored VWAP | ❌ Missing | 🔴 Gap |
| Delivery % Meaning | `delivery-analysis` | ✅ Full |
| Absorption vs Distribution | `trade-flow-intel` | ✅ Full |
| Value Area (VAH/VAL) | ❌ Missing | 🔴 Gap |
| POC - Point of Control | ❌ Missing | 🔴 Gap |
| POC Bounces | ❌ Missing | 🔴 Gap |
| Low Volume Nodes (LVNs) | ❌ Missing | 🔴 Gap |

### Module 5: System Building & Psychology

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Choosing a Core Setup | `playbook-builder` | ✅ Full |
| Entry, SL & Targets | `playbook-builder`, `fno-risk-advisor` | ✅ Full |
| Market Regime Filters | `market-regime-radar` | ✅ Full |
| Backtesting 100 Trades | `trade-expectancy` | ✅ Full |
| Pre-Trade Checklist | `playbook-builder` | ✅ Full |
| Post-Loss Routine | `trade-journal` | ✅ Full |
| Emotional Awareness | `trade-journal` | ⚠️ Partial |
| Consistency Over Profit | `trade-expectancy` | ✅ Full |

### 🔴 SCALPER PATH GAPS

1. **Volume Profile Tool** - Need VAH/VAL/POC/LVN display
2. **Anchored VWAP Tool** - Session/event-anchored VWAP
3. **Dedicated VWAP Tool** - Current VWAP is embedded in technical-indicators

---

## PATH 2: INTRADAY TRADER 📈

### Module 1: Market Structure & Session Preparation

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Reading Global Cues | `macro-pulse` (partial) | ⚠️ Partial |
| Pre-Market Levels (PDH/PDL) | `price-structure` | ✅ Full |
| Gap Up/Down Logic | ❌ Missing | 🔴 Gap |
| ORB Preparation | ❌ Missing | 🔴 Gap |
| Intraday Range Boundaries | `price-structure` | ✅ Full |
| VWAP as a Magnet | `technical-indicators` | ⚠️ Partial |
| Session High/Low Tracking | `price-structure` | ✅ Full |
| Regime Classification | `market-regime-radar` | ✅ Full |

### Module 2: Technical Analysis for Intraday

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Short MAs (5/9/20) | `technical-indicators` | ✅ Full |
| VWAP + MA Confluence | `technical-indicators` | ✅ Full |
| RSI for Overextension | `technical-indicators` | ✅ Full |
| RSI Divergences | `technical-indicators` | ✅ Full |
| MACD Histogram | `technical-indicators` | ✅ Full |
| MACD Crossovers | `technical-indicators` | ✅ Full |
| Divergence Identification | `technical-indicators` | ✅ Full |
| Indicators as Confirmation | Educational only | 📚 Theory |

### Module 3: F&O Execution & Strategies

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Futures Leverage & Exposure | `fno-risk-advisor` | ✅ Full |
| Rollover & Expiry Behavior | `options-interest` | ✅ Full |
| Margin Requirements | `fno-risk-advisor` | ✅ Full |
| Futures vs Spot | `nse-currency-dashboard` (for currency) | ⚠️ Partial |
| Option Greeks | `options-strategy` | ✅ Full |
| Credit Spreads | `options-strategy` | ✅ Full |
| Directional Buying | `options-strategy` | ✅ Full |
| Avoiding Illiquid Strikes | `options-interest` | ✅ Full |

### Module 4: Intraday Risk Management

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| ATR-Based Stop-Loss | `volatility-regime` | ✅ Full |
| Volatility Scaling | `fno-risk-advisor`, `volatility-regime` | ✅ Full |
| Correlation Risk | `portfolio-correlation` | ✅ Full |
| Execution Discipline | Educational only | 📚 Theory |
| EOD Square-Off | Educational only | 📚 Theory |
| Time-Based Exits | `playbook-builder` | ✅ Full |
| Partial Profit Taking | `playbook-builder` | ✅ Full |
| Avoiding Overtrading | `trade-journal` | ✅ Full |

### Module 5: Psychology & Routines

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Bias Awareness | `trade-journal` | ✅ Full |
| Tracking Setup Quality | `trade-journal`, `trade-expectancy` | ✅ Full |
| Emotional Scoring | `trade-journal` | ⚠️ Partial |
| Weekly Performance | `trade-journal`, `portfolio-leaderboard` | ✅ Full |
| Morning Routine | `playbook-builder` | ✅ Full |
| Mid-Session Reset | Educational only | 📚 Theory |
| Post-Session Cooldown | `trade-journal` | ✅ Full |
| Separating Life & Trading | Educational only | 📚 Theory |

### 🔴 INTRADAY PATH GAPS

1. **Opening Range Breakout (ORB) Tool** - First 15-min range analysis
2. **Gap Analysis Tool** - Gap up/down classification
3. **Pre-Market Scanner** - Global cues, SGX Nifty

---

## PATH 3: SWING TRADER 🌊

### Module 1: Pattern Recognition

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Candlesticks Multi-Day | `candlestick-hero` | ✅ Full |
| S/R on Higher Timeframes | `price-structure` | ✅ Full |
| Reversal Patterns (H&S, Double Top) | `pattern-matcher` | ✅ Full |
| Channels & Trendlines | `pattern-matcher`, `price-structure` | ✅ Full |
| Breakouts from Consolidation | `pattern-matcher` | ✅ Full |
| False Breakouts | `delivery-analysis` | ✅ Full |
| Multi-Timeframe Validation | `trend-strength` | ✅ Full |
| Volume Requirements | `delivery-analysis`, `trade-flow-intel` | ✅ Full |

### Module 2: Trend Confirmation & Momentum

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| 50 & 200 SMA Structure | `technical-indicators` | ✅ Full |
| Pullbacks to MAs | `technical-indicators` | ✅ Full |
| RSI (14) Trend Strength | `technical-indicators` | ✅ Full |
| Overbought/Oversold | `technical-indicators` | ✅ Full |
| MACD Line & Signal | `technical-indicators` | ✅ Full |
| MACD Histogram | `technical-indicators` | ✅ Full |
| MACD + Price Divergence | `technical-indicators` | ✅ Full |
| MACD for Breakout | `technical-indicators` | ✅ Full |

### Module 3: Smart Money Analysis

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Accumulation Patterns | `trade-flow-intel`, `delivery-analysis` | ✅ Full |
| Distribution Behavior | `trade-flow-intel` | ✅ Full |
| Volume Spike Interpretation | `delivery-analysis` | ✅ Full |
| Delivery % & Buyer Quality | `delivery-analysis` | ✅ Full |
| FII/DII Flow Impact | `institutional-flows` | ✅ Full |
| Flow-Based Strength Ranking | `institutional-flows` | ✅ Full |
| Early Flow Shifts | `institutional-flows` | ✅ Full |
| Flow + Technical Confluence | `institutional-flows` + technicals | ✅ Full |

### Module 4: Risk & Position Management

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Chandelier Exit | ❌ Missing (ATR-based stop in volatility-regime) | ⚠️ Partial |
| Scaling Out at R Multiples | `playbook-builder` | ✅ Full |
| Stop-Loss Below Structure | `fno-risk-advisor` | ✅ Full |
| Avoiding Tight Stops | `volatility-regime` | ✅ Full |
| Pyramiding | `playbook-builder` | ⚠️ Partial |
| Avoiding Over-Correlation | `portfolio-correlation` | ✅ Full |
| Volatility-Based Position Size | `fno-risk-advisor` | ✅ Full |
| Event Risk Management | `earnings-calendar`, `macro-calendar` | ✅ Full |

### Module 5: Advanced Integration

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Pattern + Flow Framework | `playbook-builder` | ✅ Full |
| Expectancy Calculation | `trade-expectancy` | ✅ Full |
| Regime-Based Adjustments | `market-regime-radar` | ✅ Full |
| Building Watchlist Process | `multi-factor-scorecard` | ✅ Full |
| Weekly Performance Tracking | `trade-journal` | ✅ Full |
| Quarterly Optimization | `trade-journal` | ⚠️ Partial |
| Sharpe Ratio for Swing | `mf-analyzer` (MF only) | ⚠️ Partial |
| Annualized Return Goals | `portfolio-leaderboard` | ✅ Full |

### 🔴 SWING PATH GAPS

1. **Chandelier Exit Calculator** - ATR-based trailing stop
2. **Sharpe Ratio for Stocks** - Currently only for mutual funds
3. **Fibonacci Retracement Tool** - Missing

---

## PATH 4: POSITIONAL TRADER 📊

### Module 1: Theme Discovery

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Sector Rotation | `narrative-theme` | ✅ Full |
| Policy Triggers (PLI, Budget) | `narrative-theme`, `macro-calendar` | ✅ Full |
| Economic Indicators | `macro-pulse` | ✅ Full |
| 3-5 Active Theme Trackers | `narrative-theme` | ✅ Full |
| High-Quality Research | External + `macro-pulse` | ⚠️ Partial |
| Weekly Reports | `trade-journal` | ⚠️ Partial |
| Leaders Within Theme | `momentum-heatmap` | ✅ Full |
| Avoiding Hype Themes | `delivery-analysis`, `institutional-flows` | ✅ Full |

### Module 2: Stock Selection Framework

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| P/E, PEG, Earnings Growth | `valuation-summary` | ✅ Full |
| ROE, ROCE, Profitability | `dupont-analysis`, `efficiency-dashboard` | ✅ Full |
| Debt Levels | `leverage-history`, `financial-health-dna` | ✅ Full |
| Earnings Surprise & Revisions | `earnings-surprise` | ✅ Full |
| Relative Strength | `momentum-heatmap`, `multi-factor-scorecard` | ✅ Full |
| Breakout Watchlist | `pattern-matcher` | ✅ Full |
| Momentum Scores | `trend-strength`, `multi-factor-scorecard` | ✅ Full |
| Avoiding Lagging Stocks | `momentum-heatmap` | ✅ Full |

### Module 3: Valuation & Entry Timing

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| DCF Basics | `dcf-valuation` | ✅ Full |
| Margin of Safety | `intrinsic-value-range` | ✅ Full |
| Peer Comparison | `peer-comparison` | ✅ Full |
| Overvaluation Avoidance | `valuation-summary`, `fair-value-forecaster` | ✅ Full |
| Fibonacci Pullbacks | ❌ Missing | 🔴 Gap |
| MA Support Zones | `technical-indicators` | ✅ Full |
| Breakout Retests | `pattern-matcher`, `price-structure` | ✅ Full |
| Volume Confirmation | `delivery-analysis` | ✅ Full |

### Module 4: Portfolio Construction

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Heat Map & Position Weighting | `portfolio-leaderboard` | ✅ Full |
| Correlation Tracking | `portfolio-correlation` | ✅ Full |
| Value at Risk (VaR) | `drawdown-var` | ✅ Full |
| Hedge Opportunities | `options-strategy` | ✅ Full |
| Rebalancing Thresholds | `rebalance-optimizer` | ✅ Full |
| Thesis Testing | `trade-journal` | ✅ Full |
| Partial Exits | `playbook-builder` | ✅ Full |
| Long-Term Monitoring | `warning-sentinel-mini` | ✅ Full |

### 🔴 POSITIONAL PATH GAPS

1. **Fibonacci Retracement Tool** - Entry timing
2. **Weekly Report Generator** - Auto-summarize themes

---

## PATH 5: LONG-TERM INVESTOR 💎

### Module 1: Fundamental Analysis

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Income Statement | `financial-health-dna`, `sales-profit-cash` | ✅ Full |
| Balance Sheet | `financial-health-dna`, `leverage-history` | ✅ Full |
| Cash Flow Statement | `fcf-health`, `cash-conversion-cycle` | ✅ Full |
| DuPont Analysis | `dupont-analysis` | ✅ Full |
| Cyclical vs Defensive | `peer-comparison` | ✅ Full |
| Capital vs Asset-Light | `efficiency-dashboard` | ✅ Full |
| Regulation-Heavy Industries | `narrative-theme` | ⚠️ Partial |
| Sector-Specific Metrics | `peer-comparison` | ✅ Full |

### Module 2: Valuation Mastery

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| DCF Core Logic | `dcf-valuation` | ✅ Full |
| Terminal Value & Growth | `dcf-valuation` | ✅ Full |
| Discount Rate (WACC) | `dcf-valuation` | ✅ Full |
| Sensitivity Analysis | `dcf-valuation` | ⚠️ Partial |
| P/E & P/B Ratio | `valuation-summary` | ✅ Full |
| EV/EBITDA | `valuation-summary` | ✅ Full |
| Peer Benchmarking | `peer-comparison` | ✅ Full |
| Multi-Method Valuation | `intrinsic-value-range` | ✅ Full |

### Module 3: Quality & Moat Evaluation

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Economic Moats | `management-quality` | ⚠️ Partial |
| Earnings Stability | `earnings-stability` | ✅ Full |
| Margin Trends | `efficiency-dashboard`, `sales-profit-cash` | ✅ Full |
| Capital Allocation Quality | `capital-allocation` | ✅ Full |
| Identifying Value Traps | `piotroski-score`, `altman-graham-mini` | ✅ Full |
| Identifying Growth Traps | `earnings-quality` | ✅ Full |
| Earnings Quality Checks | `earnings-quality`, `cash-conversion-earnings` | ✅ Full |
| Screening for Compounders | `multi-factor-scorecard` | ✅ Full |

### Module 4: Dividend Strategies & Tax

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| Dividend Yield & Sustainability | `dividend-crystal-ball` | ✅ Full |
| Dividend Growth Investing | `income-stability` | ✅ Full |
| DRIP Calculation | `dividend-sip-tracker` | ✅ Full |
| High-Quality Payers | `dividend-crystal-ball` | ✅ Full |
| LTCG & STCG Structure | ❌ Missing | 🔴 Gap |
| Dividend Taxation Rules | Educational (in curriculum) | 📚 Theory |
| Tax-Loss Harvesting | ❌ Missing | 🔴 Gap |
| Efficient Portfolio Structure | Educational only | 📚 Theory |

### Module 5: Portfolio Construction

| Concept | Monomorph Tool | Status |
|---------|---------------|--------|
| 60/40 & Modern Portfolio | `mf-portfolio-optimizer` | ✅ Full |
| Holding 10-15 Stocks | `portfolio-correlation` | ✅ Full |
| Rebalancing Discipline | `rebalance-optimizer` | ✅ Full |
| Risk Management | `drawdown-var`, `risk-health-dashboard` | ✅ Full |
| Annual Thesis Review | `trade-journal` | ✅ Full |
| Portfolio KPI Tracking | `portfolio-leaderboard` | ✅ Full |
| Handling Corrections | `crash-warning-mini` | ✅ Full |
| Behavioral Consistency | Educational only | 📚 Theory |

### 🔴 LONG-TERM PATH GAPS

1. **Tax Calculator Tool** - LTCG/STCG computation
2. **Tax-Loss Harvesting Helper** - Offset gains/losses

---

## 📊 COMPLETE TOOL-TO-PATH MATRIX

| Tool | Scalper | Intraday | Swing | Positional | Long-Term |
|------|---------|----------|-------|------------|-----------|
| `candlestick-hero` | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐ | - |
| `pattern-matcher` | ⭐⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐ | - |
| `price-structure` | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | - |
| `technical-indicators` | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | - |
| `volatility-regime` | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ | - |
| `market-regime-radar` | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ | - |
| `trend-strength` | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | - |
| `momentum-heatmap` | ⭐⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐ | - |
| `delivery-analysis` | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | - |
| `trade-flow-intel` | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐ | - |
| `seasonality-pattern` | ⭐ | ⭐ | ⭐⭐ | ⭐⭐ | ⭐ |
| `playbook-builder` | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ | - |
| `fno-risk-advisor` | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ | - |
| `trade-expectancy` | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ | - |
| `trade-journal` | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| `options-strategy` | ⭐ | ⭐⭐⭐ | ⭐ | ⭐⭐ | - |
| `options-interest` | ⭐ | ⭐⭐⭐ | ⭐ | ⭐ | - |
| `institutional-flows` | ⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| `macro-pulse` | ⭐ | ⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐ |
| `macro-calendar` | ⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| `narrative-theme` | - | - | ⭐ | ⭐⭐⭐ | ⭐⭐ |
| `earnings-surprise` | - | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| `valuation-summary` | - | - | - | ⭐⭐⭐ | ⭐⭐⭐ |
| `dcf-valuation` | - | - | - | ⭐⭐⭐ | ⭐⭐⭐ |
| `intrinsic-value-range` | - | - | - | ⭐⭐⭐ | ⭐⭐⭐ |
| `fair-value-forecaster` | - | - | - | ⭐⭐ | ⭐⭐⭐ |
| `piotroski-score` | - | - | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| `dupont-analysis` | - | - | - | ⭐⭐ | ⭐⭐⭐ |
| `financial-health-dna` | - | - | - | ⭐⭐ | ⭐⭐⭐ |
| `earnings-quality` | - | - | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| `earnings-stability` | - | - | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| `fcf-health` | - | - | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| `cash-conversion-cycle` | - | - | - | ⭐ | ⭐⭐⭐ |
| `cash-conversion-earnings` | - | - | - | ⭐ | ⭐⭐⭐ |
| `leverage-history` | - | - | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| `management-quality` | - | - | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| `capital-allocation` | - | - | - | ⭐⭐ | ⭐⭐⭐ |
| `efficiency-dashboard` | - | - | - | ⭐⭐ | ⭐⭐⭐ |
| `growth-summary` | - | - | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| `sales-profit-cash` | - | - | - | ⭐ | ⭐⭐⭐ |
| `profit-vs-cash-divergence` | - | - | - | ⭐ | ⭐⭐⭐ |
| `peer-comparison` | - | - | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| `multi-factor-scorecard` | - | - | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| `dividend-crystal-ball` | - | - | - | ⭐ | ⭐⭐⭐ |
| `income-stability` | - | - | - | ⭐ | ⭐⭐⭐ |
| `dividend-sip-tracker` | - | - | - | ⭐ | ⭐⭐⭐ |
| `portfolio-correlation` | ⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| `rebalance-optimizer` | - | - | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| `drawdown-var` | ⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| `portfolio-leaderboard` | - | ⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| `risk-health-dashboard` | ⭐ | ⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| `crash-warning-mini` | ⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ |
| `warning-sentinel-mini` | ⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ |
| `altman-graham-mini` | - | - | ⭐ | ⭐⭐ | ⭐⭐⭐ |

---

## 🔧 RECOMMENDED NEW TOOLS (Priority Order)

### HIGH PRIORITY (Unlocks Scalper + Intraday Paths)

1. **Volume Profile Tool** `volume-profile`
   - VAH (Value Area High)
   - VAL (Value Area Low)
   - POC (Point of Control)
   - Low Volume Nodes (LVNs)
   - *Unlocks*: Scalper M4, Intraday M1

2. **VWAP Analysis Tool** `vwap-analysis`
   - Session VWAP with bands
   - Anchored VWAP (from event/time)
   - VWAP deviation alerts
   - *Unlocks*: Scalper M2, M4

3. **Opening Range Breakout** `orb-analysis`
   - First 5/15/30 min range
   - Breakout direction signals
   - Gap classification
   - *Unlocks*: Intraday M1

### MEDIUM PRIORITY

4. **Fibonacci Tool** `fibonacci-levels`
   - Retracement levels (38.2%, 50%, 61.8%)
   - Extension levels
   - Auto-swing detection
   - *Unlocks*: Swing M4, Positional M3

5. **Tax Calculator** `tax-calculator`
   - LTCG/STCG computation
   - Tax-loss harvesting suggestions
   - Dividend tax impact
   - *Unlocks*: Long-Term M4

### LOWER PRIORITY (Nice to Have)

6. **Pre-Market Scanner** `pre-market-scanner`
   - SGX Nifty tracking
   - Global market summary
   - Gap probability

7. **Sharpe Ratio (Stocks)** - Extend `portfolio-leaderboard`
   - Individual stock Sharpe
   - Rolling Sharpe chart

---

## ✅ PRACTICE CAPABILITY ASSESSMENT

### Can Users Practice These Paths?

| Path | View Concepts | Practice with Tools | Simulate Trades | Gap Areas |
|------|--------------|---------------------|-----------------|-----------|
| **Scalper** | ✅ 90% | ⚠️ 70% | ✅ Yes (Trade Journal) | Volume Profile, VWAP |
| **Intraday** | ✅ 95% | ⚠️ 75% | ✅ Yes | ORB, Gap Analysis |
| **Swing** | ✅ 98% | ✅ 85% | ✅ Yes | Fibonacci only |
| **Positional** | ✅ 98% | ✅ 90% | ✅ Yes | Fibonacci only |
| **Long-Term** | ✅ 95% | ✅ 95% | ✅ Yes | Tax Calculator |

### Existing Practice Features

| Feature | Available | Tool |
|---------|-----------|------|
| Paper Trading Log | ✅ | `trade-journal` |
| Position Sizing Calculator | ✅ | `fno-risk-advisor` |
| Expectancy Simulator | ✅ | `trade-expectancy` |
| Backtest Stats | ⚠️ Partial | `trade-expectancy` |
| Playbook Builder | ✅ | `playbook-builder` |
| Portfolio Simulator | ⚠️ Partial | `rebalance-optimizer` |

---

## 📝 INTEGRATION RECOMMENDATIONS

### 1. Add Tool Links to Path Content

For each concept in the paths, add clickable links:
```markdown
**VWAP as Momentum Barrier** → [Technical Indicators](/tools/technical-indicators)
**Position Size Formula** → [F&O Risk Advisor](/tools/fno-risk-advisor)
```

### 2. Add "Practice This" Buttons

After each lesson:
```
✅ Practice: Open Candlestick Hero → Analyze 10 stocks → Save to Journal
```

### 3. Create Path-Specific Dashboards

- **Scalper Dashboard**: Candlestick Hero + Volatility Regime + Trade Flow Intel
- **Swing Dashboard**: Pattern Matcher + Institutional Flows + Delivery Analysis
- **Investor Dashboard**: DCF + Piotroski + Dividend Crystal Ball

### 4. Milestone Tracking Integration

Connect path milestones to tool usage:
- "80% accuracy in marking 50 levels" → Auto-track in Trade Journal
- "Complete 5 valuations" → Count DCF Valuation uses

---

*Last Updated: December 2025*
