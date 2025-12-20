# Monomorph Tool Reference

**75 Financial Analytics Tools** organized by category with key metrics and functionality.

---

## Overview (1 Tool)

### 1. Stock Snapshot
**ID:** `stock-snapshot` | **Category:** Overview | **Complexity:** Beginner

Primary entry point showing company info, price, day stats, key levels, and mini chart when user types just a ticker.

**Key Metrics:**
- Current Price & LTP
- Day High/Low/Open/Close
- 52-Week High/Low
- Market Cap
- Volume & Avg Volume
- Support/Resistance Levels

**Best For:** All trader types (Scalper → Investor)

---

## Value Analysis (8 Tools)

### 2. Fair Value Forecaster ⭐
**ID:** `fair-value-forecaster` | **Category:** Value | **Complexity:** Intermediate

Projects future fair value using DCF with probability fan charts and sensitivity analysis.

**Key Metrics:**
- Intrinsic Value Estimate
- Margin of Safety %
- Probability Distribution
- Sensitivity Matrix (WACC × Growth)
- Upside/Downside Potential

**Best For:** Positional, Investor

---

### 3. Valuation Summary
**ID:** `valuation-summary` | **Category:** Value | **Complexity:** Beginner

Comprehensive multi-metric valuation dashboard with radar visualization and peer comparisons.

**Key Metrics:**
- P/E Ratio (Trailing & Forward)
- P/B Ratio
- P/S Ratio
- EV/EBITDA
- PEG Ratio
- Peer Comparison Radar

**Best For:** Swing, Positional, Investor

---

### 4. DCF Valuation
**ID:** `dcf-valuation` | **Category:** Value | **Complexity:** Advanced

Full discounted cash flow model with projections and WACC/growth sensitivity matrix.

**Key Metrics:**
- 5-10 Year FCF Projections
- WACC Calculation
- Terminal Value
- Enterprise Value
- Equity Value per Share
- Sensitivity Heatmap

**Best For:** Investor

---

### 5. Intrinsic Value Range
**ID:** `intrinsic-value-range` | **Category:** Value | **Complexity:** Intermediate

Multi-model intrinsic value range with composite fair value calculation.

**Key Metrics:**
- Graham Number
- DCF Value
- Earnings Power Value
- Asset-Based Value
- Composite Range (Low/Mid/High)
- Current Price vs Range

**Best For:** Positional, Investor

---

### 6. Piotroski F-Score 📊
**ID:** `piotroski-score` | **Category:** Value | **Complexity:** Intermediate | **Has Edge Metric**

9-point financial strength score across profitability, leverage, and efficiency.

**Key Metrics:**
- Total F-Score (0-9)
- Profitability (4 points): ROA, OCF, ΔROA, Accruals
- Leverage (3 points): ΔLeverage, ΔLiquidity, Equity Issuance
- Efficiency (2 points): ΔGross Margin, ΔAsset Turnover

**Best For:** Positional, Investor

---

### 7. DuPont Analysis
**ID:** `dupont-analysis` | **Category:** Value | **Complexity:** Intermediate

ROE decomposition into profit margin, asset turnover, and leverage.

**Key Metrics:**
- ROE (Return on Equity)
- Net Profit Margin
- Asset Turnover
- Financial Leverage (Equity Multiplier)
- 5-Factor DuPont Breakdown
- Historical Trend

**Best For:** Positional, Investor

---

### 8. Multi-Factor Scorecard 📊
**ID:** `multi-factor-scorecard` | **Category:** Value | **Complexity:** Intermediate | **Has Edge Metric**

Factor-based quality scoring with radar visualization and rankings.

**Key Metrics:**
- Value Factor Score
- Quality Factor Score
- Momentum Factor Score
- Low Volatility Score
- Size Factor
- Composite Rank

**Best For:** Positional, Investor

---

### 9. Financial Health DNA 📊 ⭐
**ID:** `financial-health-dna` | **Category:** Value | **Complexity:** Intermediate | **Has Edge Metric**

Comprehensive health analysis combining Piotroski F-Score, Altman Z-Score, cash quality, and leverage metrics.

**Key Metrics:**
- Piotroski F-Score
- Altman Z-Score
- Cash Quality Score
- Leverage Score
- Composite Health Grade (A-F)
- Trend Direction

**Best For:** Positional, Investor

---

## Growth Analysis (8 Tools)

### 10. Growth Summary ⭐
**ID:** `growth-summary` | **Category:** Growth | **Complexity:** Beginner

Historical and forward growth metrics with tier classification.

**Key Metrics:**
- Revenue CAGR (3Y, 5Y)
- EPS CAGR (3Y, 5Y)
- Net Profit Growth
- Forward Growth Estimates
- Growth Tier (Hyper/High/Moderate/Slow/Declining)

**Best For:** Swing, Positional, Investor

---

### 11. Efficiency Dashboard
**ID:** `efficiency-dashboard` | **Category:** Growth | **Complexity:** Intermediate

Operating efficiency metrics including margins and asset utilization.

**Key Metrics:**
- Gross Margin %
- Operating Margin %
- Net Margin %
- EBITDA Margin %
- Asset Turnover
- Operating Leverage

**Best For:** Positional, Investor

---

### 12. Earnings Stability
**ID:** `earnings-stability` | **Category:** Growth | **Complexity:** Intermediate

Earnings consistency and predictability analysis.

**Key Metrics:**
- EPS Coefficient of Variation
- Earnings Volatility
- Consistency Score
- Number of Profitable Years
- Trend Stability
- Predictability Rating

**Best For:** Positional, Investor

---

### 13. Earnings Quality 📊
**ID:** `earnings-quality` | **Category:** Growth | **Complexity:** Advanced | **Has Edge Metric**

Quality metrics including accruals, cash conversion, and Beneish M-Score.

**Key Metrics:**
- Beneish M-Score (Manipulation Risk)
- Accruals Ratio
- Cash Conversion (OCF/Net Income)
- Receivables Quality
- Inventory Quality
- Red Flag Count

**Best For:** Positional, Investor

---

### 14. Management Quality
**ID:** `management-quality` | **Category:** Growth | **Complexity:** Intermediate

Management effectiveness scoring with insider activity.

**Key Metrics:**
- Promoter Holding %
- Promoter Pledge %
- Insider Buying/Selling
- Capital Allocation Score
- Governance Rating
- Management Tenure

**Best For:** Positional, Investor

---

### 15. Capital Allocation
**ID:** `capital-allocation` | **Category:** Growth | **Complexity:** Intermediate

Capital deployment analysis across reinvestment, buybacks, dividends, and M&A.

**Key Metrics:**
- Capex as % of Revenue
- Dividend Payout Ratio
- Buyback Yield
- M&A Spending
- ROIC vs WACC
- Reinvestment Rate

**Best For:** Positional, Investor

---

### 16. Sales-Profit-Cash Alignment
**ID:** `sales-profit-cash` | **Category:** Growth | **Complexity:** Intermediate

Revenue to profit to cash flow conversion analysis.

**Key Metrics:**
- Revenue to Gross Profit %
- Gross to Operating Profit %
- Operating Profit to Net Profit %
- Net Profit to OCF %
- OCF to FCF %
- Conversion Waterfall

**Best For:** Positional, Investor

---

### 17. Profit vs Cash Divergence
**ID:** `profit-vs-cash-divergence` | **Category:** Growth | **Complexity:** Advanced

Identifies divergences between reported profits and cash generation.

**Key Metrics:**
- Profit vs Cash Gap
- Accrual Divergence
- Working Capital Buildup
- Receivables Divergence
- Inventory Divergence
- Warning Score

**Best For:** Positional, Investor

---

## Risk Analysis (10 Tools)

### 18. Risk Health Dashboard ⭐ 🎯
**ID:** `risk-health-dashboard` | **Category:** Risk | **Complexity:** Intermediate | **Has Risk Sizing**

Comprehensive risk assessment across financial, operational, and market risks.

**Key Metrics:**
- Overall Risk Score
- Financial Risk (Leverage, Liquidity)
- Market Risk (Beta, Volatility)
- Operational Risk
- Position Size Calculator
- Stop Loss Levels

**Best For:** Intraday, Swing, Positional

---

### 19. Drawdown & VaR 📊
**ID:** `drawdown-var` | **Category:** Risk | **Complexity:** Intermediate | **Has Edge Metric**

Maximum drawdown tracking, VaR calculations, and stress scenarios.

**Key Metrics:**
- Maximum Drawdown %
- Current Drawdown %
- Days in Drawdown
- 95% VaR (Daily)
- 99% VaR (Daily)
- Expected Shortfall (CVaR)

**Best For:** Swing, Positional, Investor

---

### 20. Financial Stress Radar
**ID:** `financial-stress-radar` | **Category:** Risk | **Complexity:** Advanced

Early warning indicators for financial distress.

**Key Metrics:**
- Cash Burn Rate
- Interest Coverage Trend
- Working Capital Stress
- Debt Service Coverage
- Liquidity Crisis Score
- Covenant Breach Risk

**Best For:** Positional, Investor

---

### 21. Bankruptcy Health
**ID:** `bankruptcy-health` | **Category:** Risk | **Complexity:** Intermediate

Altman Z-Score and bankruptcy probability analysis.

**Key Metrics:**
- Altman Z-Score
- Zone Classification (Safe/Grey/Distress)
- Bankruptcy Probability %
- Component Breakdown
- Historical Trend
- Industry Comparison

**Best For:** Positional, Investor

---

### 22. Working Capital Health
**ID:** `working-capital-health` | **Category:** Risk | **Complexity:** Intermediate

Working capital cycle and liquidity position monitoring.

**Key Metrics:**
- Current Ratio
- Quick Ratio (Acid Test)
- Cash Ratio
- Days Inventory Outstanding
- Days Sales Outstanding
- Days Payables Outstanding

**Best For:** Positional, Investor

---

### 23. Leverage History
**ID:** `leverage-history` | **Category:** Risk | **Complexity:** Intermediate

Historical leverage trends and debt covenant analysis.

**Key Metrics:**
- Debt-to-Equity Ratio
- Net Debt/EBITDA
- Interest Coverage Ratio
- DSCR (Debt Service Coverage)
- Leverage Trend (5Y)
- Covenant Headroom

**Best For:** Positional, Investor

---

### 24. Cashflow Stability Index
**ID:** `cashflow-stability-index` | **Category:** Risk | **Complexity:** Intermediate

Cash flow volatility and stability scoring.

**Key Metrics:**
- OCF Volatility
- FCF Stability Score
- Cash Flow Consistency
- Seasonal Patterns
- Trend Strength
- Predictability Index

**Best For:** Positional, Investor

---

### 25. F&O Risk Advisor ⭐ 🎯 💡
**ID:** `fno-risk-advisor` | **Category:** Risk | **Complexity:** Beginner | **Has Risk Sizing** | **Has Behavioral Tip**

SEBI-safe leverage calculator with position sizing, drawdown probability, and risk zone warnings.

**Key Metrics:**
- Recommended Position Size
- Max Loss per Trade (₹)
- Leverage Factor
- Drawdown Probability
- Break-even Win Rate
- Risk Zone (Green/Yellow/Red)

**Best For:** Scalper, Intraday, Swing

---

### 26. Trade Expectancy Simulator 📊 🎯
**ID:** `trade-expectancy` | **Category:** Risk | **Complexity:** Intermediate | **Has Edge Metric** | **Has Risk Sizing**

Calculates realistic P&L expectancy including Indian fee structure (STT, GST, stamp duty).

**Key Metrics:**
- Expected Value per Trade
- Break-even Win Rate
- Profit Factor
- Fee Impact (STT, GST, Stamp)
- Kelly Criterion %
- Drawdown Probability

**Best For:** Scalper, Intraday, Swing

---

## Cash Flow Analysis (3 Tools)

### 27. FCF Health
**ID:** `fcf-health` | **Category:** Cashflow | **Complexity:** Intermediate

Free cash flow generation and sustainability analysis.

**Key Metrics:**
- Free Cash Flow (FCF)
- FCF Yield
- FCF Margin
- FCF Growth Rate
- FCF to Net Income
- Sustainability Score

**Best For:** Positional, Investor

---

### 28. Cash Conversion Cycle
**ID:** `cash-conversion-cycle` | **Category:** Cashflow | **Complexity:** Intermediate

Days inventory, receivables, payables, and net cash cycle.

**Key Metrics:**
- Days Inventory Outstanding (DIO)
- Days Sales Outstanding (DSO)
- Days Payables Outstanding (DPO)
- Cash Conversion Cycle (CCC)
- Working Capital Days
- Industry Comparison

**Best For:** Positional, Investor

---

### 29. Cash Conversion of Earnings
**ID:** `cash-conversion-earnings` | **Category:** Cashflow | **Complexity:** Intermediate

Earnings to operating cash flow conversion quality.

**Key Metrics:**
- OCF / Net Income Ratio
- FCF / Net Income Ratio
- Accruals Quality
- Conversion Trend
- Quality Score
- Red Flags

**Best For:** Positional, Investor

---

## Income & Dividends (3 Tools)

### 30. Dividend Crystal Ball ⭐
**ID:** `dividend-crystal-ball` | **Category:** Income | **Complexity:** Intermediate

Dividend growth projection with yield on cost forecasts.

**Key Metrics:**
- Current Dividend Yield
- 5-Year Dividend CAGR
- Projected Yield on Cost (5Y, 10Y)
- Dividend Growth Rate
- Ex-Dividend Dates
- Projected Income Stream

**Best For:** Positional, Investor

---

### 31. Dividend SIP Tracker
**ID:** `dividend-sip-tracker` | **Category:** Income | **Complexity:** Intermediate

Systematic investment tracking with dividend reinvestment analysis.

**Key Metrics:**
- SIP Investment Total
- Current Value
- Dividends Received
- DRIP Value
- XIRR Return
- Dividend Yield on Cost

**Best For:** Investor

---

### 32. Income Stability
**ID:** `income-stability` | **Category:** Income | **Complexity:** Intermediate

Dividend safety and payout sustainability scoring.

**Key Metrics:**
- Dividend Payout Ratio
- FCF Payout Ratio
- Dividend Coverage
- Consecutive Years Paid
- Dividend Cut Risk
- Safety Score

**Best For:** Investor

---

## Macro & Ownership (8 Tools)

### 33. Shareholding Pattern
**ID:** `shareholding-pattern` | **Category:** Macro | **Complexity:** Intermediate

Ownership breakdown and changes in institutional/retail holdings.

**Key Metrics:**
- Promoter Holding %
- FII Holding %
- DII Holding %
- Retail Holding %
- Quarterly Changes
- Pledge Status

**Best For:** Swing, Positional, Investor

---

### 34. Institutional Flows
**ID:** `institutional-flows` | **Category:** Macro | **Complexity:** Intermediate

FII/DII flow tracking and institutional sentiment.

**Key Metrics:**
- FII Net Buy/Sell (₹)
- DII Net Buy/Sell (₹)
- 10-Day Cumulative Flow
- 30-Day Cumulative Flow
- Flow Trend
- Sentiment Score

**Best For:** Swing, Positional

---

### 35. Insider Trades
**ID:** `insider-trades` | **Category:** Macro | **Complexity:** Intermediate

Insider buying/selling activity and patterns.

**Key Metrics:**
- Recent Insider Buys
- Recent Insider Sells
- Net Insider Activity
- Bulk Deals
- Block Deals
- Insider Sentiment

**Best For:** Swing, Positional, Investor

---

### 36. Macro Calendar
**ID:** `macro-calendar` | **Category:** Macro | **Complexity:** Beginner

Upcoming economic events and central bank decisions.

**Key Metrics:**
- Upcoming Events List
- RBI Policy Dates
- GDP/Inflation Releases
- Fed/Global Events
- Earnings Dates
- Event Impact Rating

**Best For:** All trader types

---

### 37. Macro Pulse
**ID:** `macro-pulse` | **Category:** Macro | **Complexity:** Intermediate

Real-time macro indicator dashboard.

**Key Metrics:**
- GDP Growth Rate
- Inflation (CPI/WPI)
- Interest Rates
- INR/USD Exchange Rate
- Crude Oil Price
- Global Indices

**Best For:** Swing, Positional, Investor

---

### 38. Earnings Calendar
**ID:** `earnings-calendar` | **Category:** Macro | **Complexity:** Beginner

Upcoming earnings dates and consensus estimates.

**Key Metrics:**
- Earnings Date
- Consensus EPS
- Consensus Revenue
- Historical Beat/Miss Rate
- Options IV
- Expected Move

**Best For:** All trader types

---

### 39. Earnings Surprise
**ID:** `earnings-surprise` | **Category:** Macro | **Complexity:** Intermediate

Historical earnings beats/misses and price reactions.

**Key Metrics:**
- Beat/Miss History
- Surprise % (EPS & Revenue)
- Post-Earnings Price Move
- Average Reaction
- Drift Analysis
- Gap Statistics

**Best For:** Swing, Positional

---

### 40. Narrative Theme Tracker 📊
**ID:** `narrative-theme` | **Category:** Macro | **Complexity:** Intermediate | **Has Edge Metric**

Systematizes market themes (PSU banks, Defence, Railway) with leaders, laggards, and pullback zones.

**Key Metrics:**
- Active Themes
- Theme Strength Score
- Leaders & Laggards
- Sector Rotation Phase
- Pullback Zones
- Entry Opportunities

**Best For:** Swing, Positional, Investor

---

## Technical Analysis (17 Tools)

### 41. Candlestick Hero ⭐
**ID:** `candlestick-hero` | **Category:** Technical | **Complexity:** Beginner

Interactive candlestick chart with overlays and indicators.

**Key Metrics:**
- OHLCV Data
- Moving Averages (SMA, EMA)
- VWAP
- Volume Bars
- Pattern Detection
- Key Levels

**Best For:** Scalper, Intraday, Swing

---

### 42. Pattern Matcher 📊
**ID:** `pattern-matcher` | **Category:** Technical | **Complexity:** Intermediate | **Has Edge Metric**

Historical pattern matching with outcome statistics.

**Key Metrics:**
- Detected Patterns
- Pattern Win Rate %
- Average Move %
- Expected R-Multiple
- Confidence Score
- Historical Matches

**Best For:** Scalper, Intraday, Swing

---

### 43. Technical Indicators
**ID:** `technical-indicators` | **Category:** Technical | **Complexity:** Intermediate

Comprehensive technical indicator dashboard.

**Key Metrics:**
- RSI (14)
- MACD & Signal
- Stochastic %K/%D
- Bollinger Bands
- CCI, ROC, Williams %R
- Divergence Alerts

**Best For:** Scalper, Intraday, Swing

---

### 44. Trend Strength
**ID:** `trend-strength` | **Category:** Technical | **Complexity:** Beginner

ADX-based trend strength and direction analysis.

**Key Metrics:**
- ADX Value
- +DI / -DI
- Trend Direction
- Trend Strength (Weak/Moderate/Strong)
- Supertrend Signal
- Moving Average Alignment

**Best For:** Intraday, Swing, Positional

---

### 45. Momentum Heatmap
**ID:** `momentum-heatmap` | **Category:** Technical | **Complexity:** Intermediate

Multi-timeframe momentum visualization.

**Key Metrics:**
- 1m/5m/15m/1H/Daily RSI
- Multi-TF MACD
- Momentum Alignment
- Sector Relative Strength
- Heatmap Visualization
- Confluence Score

**Best For:** Scalper, Intraday, Swing

---

### 46. Volatility Regime
**ID:** `volatility-regime` | **Category:** Technical | **Complexity:** Intermediate

Volatility regime detection and breakout alerts.

**Key Metrics:**
- ATR (14)
- ATR %
- Volatility Percentile
- Regime (Low/Normal/High)
- Squeeze Detection
- Breakout Probability

**Best For:** Scalper, Intraday, Swing

---

### 47. Seasonality Pattern
**ID:** `seasonality-pattern` | **Category:** Technical | **Complexity:** Intermediate

Monthly and day-of-week seasonality analysis.

**Key Metrics:**
- Monthly Returns (Avg)
- Best/Worst Months
- Day-of-Week Performance
- Session Performance
- Holiday Effects
- Win Rate by Period

**Best For:** Swing, Positional

---

### 48. Market Regime Radar 📊
**ID:** `market-regime-radar` | **Category:** Technical | **Complexity:** Intermediate | **Has Edge Metric**

Multi-factor market regime classification.

**Key Metrics:**
- Current Regime (Bull/Bear/Sideways)
- Volatility Regime
- Trend Regime
- Risk-On/Risk-Off
- Regime Duration
- Regime Transition Signals

**Best For:** Swing, Positional, Investor

---

### 49. Price Structure
**ID:** `price-structure` | **Category:** Technical | **Complexity:** Beginner

Support/resistance levels and price structure analysis.

**Key Metrics:**
- Support Levels (S1, S2, S3)
- Resistance Levels (R1, R2, R3)
- Pivot Points (Floor, Camarilla, CPR)
- Previous Day High/Low
- Swing Highs/Lows
- Demand/Supply Zones

**Best For:** Scalper, Intraday, Swing

---

### 50. Volume Profile 📊
**ID:** `volume-profile` | **Category:** Technical | **Complexity:** Advanced | **Has Edge Metric**

Volume-at-price analysis showing POC, Value Area, HVN/LVN zones.

**Key Metrics:**
- Point of Control (POC)
- Value Area High (VAH)
- Value Area Low (VAL)
- High Volume Nodes (HVN)
- Low Volume Nodes (LVN)
- Volume Delta

**Best For:** Scalper, Intraday

---

### 51. VWAP Analysis 📊
**ID:** `vwap-analysis` | **Category:** Technical | **Complexity:** Intermediate | **Has Edge Metric**

Session VWAP with standard deviation bands and mean reversion signals.

**Key Metrics:**
- Session VWAP
- Upper/Lower Bands (+1σ, +2σ)
- Distance from VWAP %
- Anchored VWAPs
- Mean Reversion Signal
- Institutional Price Zone

**Best For:** Scalper, Intraday

---

### 52. Opening Range Breakout 📊 🎯
**ID:** `orb-analysis` | **Category:** Technical | **Complexity:** Intermediate | **Has Edge Metric** | **Has Risk Sizing**

Opening Range Breakout analysis with 5/15/30 min ranges.

**Key Metrics:**
- ORB High/Low (5m, 15m, 30m)
- Gap Classification
- Breakout Direction
- False Breakout Detection
- Target Levels
- Historical Win Rate

**Best For:** Scalper, Intraday

---

### 53. Fibonacci Levels 🎯
**ID:** `fibonacci-levels` | **Category:** Technical | **Complexity:** Intermediate | **Has Risk Sizing**

Auto-detected Fibonacci retracement and extension levels.

**Key Metrics:**
- Retracement Levels (23.6%, 38.2%, 50%, 61.8%, 78.6%)
- Golden Pocket Zone
- Extension Levels (127.2%, 161.8%, 261.8%)
- Confluence Areas
- Entry/Stop/Target Zones
- Historical Reactions

**Best For:** Swing, Positional

---

### 54. Delivery Analysis Pro 📊 ⭐
**ID:** `delivery-analysis` | **Category:** Technical | **Complexity:** Intermediate | **Has Edge Metric**

Smart money flow detection using delivery percentage and accumulation/distribution.

**Key Metrics:**
- Delivery %
- Delivery Volume
- A/D Score
- Smart Money Signal
- Divergence Alerts
- Bulk/Block Deals

**Best For:** Swing, Positional

---

### 55. Trade Flow Intelligence
**ID:** `trade-flow-intel` | **Category:** Technical | **Complexity:** Intermediate

Institutional activity detection through trade size analysis.

**Key Metrics:**
- Large Trade Detection
- Buy/Sell Pressure
- Volume Z-Score
- Unusual Activity Alerts
- Institutional vs Retail
- Order Flow Imbalance

**Best For:** Scalper, Intraday, Swing

---

### 56. Playbook Builder 💡
**ID:** `playbook-builder` | **Category:** Technical | **Complexity:** Beginner | **Has Behavioral Tip**

Auto-generates trading playbooks based on style (scalper, intraday, swing, etc.).

**Key Metrics:**
- Recommended Timeframes
- Indicator Setup
- Entry Rules
- Exit Rules
- Position Sizing Rules
- Risk Management Rules

**Best For:** All trader types

---

## Portfolio Management (8 Tools)

### 57. Peer Comparison
**ID:** `peer-comparison` | **Category:** Portfolio | **Complexity:** Intermediate

Side-by-side comparison with industry peers.

**Key Metrics:**
- Valuation Comparison
- Growth Comparison
- Profitability Comparison
- Risk Metrics Comparison
- Relative Ranking
- Radar Visualization

**Best For:** Positional, Investor

---

### 58. Portfolio Correlation
**ID:** `portfolio-correlation` | **Category:** Portfolio | **Complexity:** Intermediate

Correlation matrix and diversification analysis.

**Key Metrics:**
- Correlation Matrix
- Diversification Score
- Cluster Analysis
- Highly Correlated Pairs
- Sector Concentration
- Risk Contribution

**Best For:** Positional, Investor

---

### 59. Rebalance Optimizer ⭐
**ID:** `rebalance-optimizer` | **Category:** Portfolio | **Complexity:** Intermediate

Portfolio rebalancing recommendations with trade generation.

**Key Metrics:**
- Current vs Target Weights
- Drift %
- Rebalance Trades
- Tax Impact
- Expected Return Change
- Risk Change

**Best For:** Investor

---

### 60. ETF Comparator
**ID:** `etf-comparator` | **Category:** Portfolio | **Complexity:** Intermediate

ETF comparison with holdings overlap analysis.

**Key Metrics:**
- Expense Ratio
- Tracking Error
- Holdings Overlap %
- Sector Allocation
- Top Holdings
- Performance Comparison

**Best For:** Investor

---

### 61. Portfolio Leaderboard
**ID:** `portfolio-leaderboard` | **Category:** Portfolio | **Complexity:** Intermediate

Portfolio performance ranking and attribution.

**Key Metrics:**
- Total Return
- Risk-Adjusted Return
- Alpha vs Benchmark
- Attribution Analysis
- Best/Worst Performers
- Sector Attribution

**Best For:** Investor

---

### 62. Options Interest Dashboard
**ID:** `options-interest` | **Category:** Portfolio | **Complexity:** Intermediate

Put/call ratios, open interest, and options flow.

**Key Metrics:**
- Put/Call Ratio (PCR)
- Open Interest Analysis
- OI Change Trends
- Max Pain Level
- Unusual Options Activity
- IV Skew

**Best For:** Intraday, Swing

---

### 63. Tax Calculator 💡
**ID:** `tax-calculator` | **Category:** Portfolio | **Complexity:** Intermediate | **Has Behavioral Tip**

LTCG/STCG tax computation with ₹1.25L exemption and tax-loss harvesting.

**Key Metrics:**
- STCG Tax Liability (20%)
- LTCG Tax Liability (12.5%)
- Exemption Utilization
- Tax-Loss Harvest Opportunities
- Holding Period Analysis
- Net Tax Payable

**Best For:** Positional, Investor

---

### 64. Trade Journal Analytics 💡
**ID:** `trade-journal` | **Category:** Portfolio | **Complexity:** Intermediate | **Has Behavioral Tip**

Behavioral feedback from trade history with pattern analysis.

**Key Metrics:**
- Win Rate by Setup
- P&L by Session/Day
- Overtrading Detection
- Revenge Trade Alerts
- Discipline Score
- What-If Scenarios

**Best For:** All trader types

---

## Mutual Funds (3 Tools)

### 65. Mutual Fund Explorer ⭐
**ID:** `mf-explorer` | **Category:** Mutual Funds | **Complexity:** Beginner

Discover and filter mutual funds across equity, debt, and hybrid categories.

**Key Metrics:**
- NAV
- AUM
- Expense Ratio
- 1Y/3Y/5Y Returns
- Category Rank
- Risk Rating

**Best For:** Investor

---

### 66. Mutual Fund Analyzer
**ID:** `mf-analyzer` | **Category:** Mutual Funds | **Complexity:** Intermediate

Deep analysis and side-by-side comparison of mutual funds.

**Key Metrics:**
- Sharpe Ratio
- Sortino Ratio
- Alpha & Beta
- Max Drawdown
- Rolling Returns
- Portfolio Composition

**Best For:** Investor

---

### 67. MF Portfolio Optimizer 🎯
**ID:** `mf-portfolio-optimizer` | **Category:** Mutual Funds | **Complexity:** Advanced | **Has Risk Sizing**

Optimize mutual fund allocation using efficient frontier analysis.

**Key Metrics:**
- Efficient Frontier
- Optimal Weights
- Risk Parity Allocation
- Max Sharpe Portfolio
- Min Volatility Portfolio
- Correlation Matrix

**Best For:** Investor

---

## Derivatives (2 Tools)

### 68. Options Strategy Explainer 📊 🎯 ⭐
**ID:** `options-strategy` | **Category:** Derivatives | **Complexity:** Advanced | **Has Edge Metric** | **Has Risk Sizing**

Pre-trade risk explanation for common options strategies.

**Key Metrics:**
- Max Profit / Max Loss
- Break-even Points
- Margin Required
- IV Percentile
- Probability of Profit
- Greeks Exposure

**Best For:** Scalper, Intraday, Swing

---

### 69. NSE Currency Dashboard 🎯
**ID:** `nse-currency-dashboard` | **Category:** Derivatives | **Complexity:** Intermediate | **Has Risk Sizing**

Comprehensive NSE currency derivatives dashboard for INR pairs.

**Key Metrics:**
- USD/EUR/GBP/JPY INR Rates
- Cross Currency Rates
- Futures Chain
- Options Chain
- Margin Calculator
- P&L Calculator

**Best For:** Intraday, Swing, Positional

---

## Commodities (1 Tool)

### 70. MCX Commodity Dashboard 🎯 ⭐
**ID:** `mcx-commodity-dashboard` | **Category:** Commodities | **Complexity:** Intermediate | **Has Risk Sizing**

Comprehensive MCX futures dashboard for bullion, base metals, and energy.

**Key Metrics:**
- Live Prices (Gold, Silver, Crude, etc.)
- Contract Chain
- Margin Calculator
- Spread Analysis
- Global Parity
- P&L Calculator

**Best For:** Intraday, Swing, Positional

---

## Mini Cards (5 Tools)

### 71. Sentiment Z-Score ⭐
**ID:** `sentiment-zscore-mini` | **Category:** Mini | **Complexity:** Beginner

Return and volume z-scores as compact gauges.

**Key Metrics:**
- Price Z-Score
- Volume Z-Score
- Sentiment Gauge

---

### 72. Factor Tilt ⭐
**ID:** `factor-tilt-mini` | **Category:** Mini | **Complexity:** Beginner

Value, growth, momentum factor exposures.

**Key Metrics:**
- Value Tilt
- Growth Tilt
- Momentum Tilt

---

### 73. Warning Sentinel ⭐
**ID:** `warning-sentinel-mini` | **Category:** Mini | **Complexity:** Beginner

Risk alerts and warnings condensed view.

**Key Metrics:**
- Active Warnings
- Risk Level
- Alert Count

---

### 74. Crash Warning ⭐
**ID:** `crash-warning-mini` | **Category:** Mini | **Complexity:** Beginner

Traffic light crash risk indicator.

**Key Metrics:**
- Crash Risk (🟢/🟡/🔴)
- Momentum Score
- Volatility Score
- Drawdown Score

---

### 75. Altman & Graham
**ID:** `altman-graham-mini` | **Category:** Mini | **Complexity:** Beginner

Altman Z-score and Graham number quick view.

**Key Metrics:**
- Altman Z-Score
- Graham Number
- Zone Status

---

## Summary by Category

| Category | Count | Tools |
|----------|-------|-------|
| Overview | 1 | Stock Snapshot |
| Value | 8 | Fair Value, Valuation, DCF, Intrinsic Range, Piotroski, DuPont, Multi-Factor, Health DNA |
| Growth | 8 | Growth Summary, Efficiency, Earnings Stability/Quality, Management, Capital Allocation, Sales-Profit-Cash, Divergence |
| Risk | 10 | Risk Dashboard, Drawdown/VaR, Stress Radar, Bankruptcy, Working Capital, Leverage, Cashflow Stability, F&O Risk, Expectancy |
| Cashflow | 3 | FCF Health, CCC, Cash Conversion |
| Income | 3 | Dividend Crystal Ball, SIP Tracker, Income Stability |
| Macro | 8 | Shareholding, Flows, Insider, Calendar, Pulse, Earnings Calendar/Surprise, Themes |
| Technical | 17 | Candlestick, Patterns, Indicators, Trend, Momentum, Volatility, Seasonality, Regime, Structure, Volume, VWAP, ORB, Fib, Delivery, Flow, Playbook |
| Portfolio | 8 | Peer, Correlation, Rebalance, ETF, Leaderboard, Options Interest, Tax, Journal |
| Mutual Funds | 3 | Explorer, Analyzer, Optimizer |
| Derivatives | 2 | Options Strategy, Currency Dashboard |
| Commodities | 1 | MCX Dashboard |
| Mini | 5 | Sentiment, Factor, Warning, Crash, Altman-Graham |

**Total: 75 Tools**

---

## Legend

- ⭐ = Default/Featured Tool
- 📊 = Has Edge Metric (Win rate, R-multiple, etc.)
- 🎯 = Has Risk Sizing Helper
- 💡 = Has Behavioral Tip

---

## Tools by Trader Type

### Scalper (13 tools)
Stock Snapshot, Candlestick Hero, Pattern Matcher, Technical Indicators, Momentum Heatmap, Volatility Regime, Price Structure, Volume Profile, VWAP Analysis, ORB Analysis, Trade Flow Intel, F&O Risk Advisor, Trade Expectancy

### Intraday (18 tools)
All Scalper tools + Risk Health Dashboard, Options Interest, NSE Currency, MCX Commodity

### Swing (25 tools)
All Intraday tools + Valuation Summary, Growth Summary, Trend Strength, Market Regime, Fibonacci, Delivery Analysis, Shareholding, Institutional Flows, Earnings Surprise, Narrative Themes

### Positional (35 tools)
All Swing tools + Fair Value, Intrinsic Range, Piotroski, Multi-Factor, All Risk tools, Working Capital, Leverage, Management Quality, Capital Allocation

### Investor (45 tools)
All Positional tools + DCF Valuation, DuPont, Earnings Quality/Stability, Profit Divergence, All Income tools, Rebalance Optimizer, All MF tools, Tax Calculator
