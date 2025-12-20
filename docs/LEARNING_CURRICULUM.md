# Monomorph Learning Curriculum
## Complete Guide to 70 Financial Analysis Tools

> **Your journey from beginner to expert in Indian market analysis**

---

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [Module 1: Value Investing](#module-1-value-investing-8-tools)
3. [Module 2: Growth Analysis](#module-2-growth-analysis-8-tools)
4. [Module 3: Risk Management](#module-3-risk-management-9-tools)
5. [Module 4: Cash Flow Mastery](#module-4-cash-flow-mastery-3-tools)
6. [Module 5: Income & Dividends](#module-5-income--dividends-3-tools)
7. [Module 6: Technical Analysis](#module-6-technical-analysis-12-tools)
8. [Module 7: Market & Macro](#module-7-market--macro-8-tools)
9. [Module 8: Portfolio Management](#module-8-portfolio-management-7-tools)
10. [Module 9: Derivatives & F&O](#module-9-derivatives--fo-2-tools)
11. [Module 10: Mutual Funds](#module-10-mutual-funds-3-tools)
12. [Module 11: Commodities & Forex](#module-11-commodities--forex-1-tool)
13. [Module 12: Overview](#module-12-overview-1-tool)
14. [Module 13: Quick Reference Minis](#module-13-quick-reference-minis-5-tools)
14. [Metric Reference Guide](#metric-reference-guide)
15. [Learning Paths](#learning-paths)

---

## Getting Started

### How to Use This Curriculum

Each tool lesson includes:
- **📖 Summary**: What the tool does
- **🎯 Key Metrics**: Numbers you'll see and what they mean
- **📊 Interpretation**: How to read the signals (🟢 Good, 🟡 Caution, 🔴 Warning)
- **🇮🇳 Indian Context**: India-specific considerations
- **💡 Pro Tips**: Expert insights
- **🔗 Related Tools**: What to look at next

### Difficulty Levels
- 🌱 **Beginner**: Start here if you're new
- 🌿 **Intermediate**: Requires basic financial knowledge
- 🌳 **Advanced**: For experienced analysts

---

# Module 1: Value Investing (8 Tools)
*Learn to find undervalued stocks using fundamental analysis*

## 1.1 Valuation Summary 🌱
**Tool ID:** `valuation-summary` | **Duration:** 8 min

### What It Does
Your first stop for understanding if a stock is cheap or expensive. Combines multiple valuation ratios into one view with historical comparison.

### Key Metrics

| Metric | Formula | What It Tells You |
|--------|---------|-------------------|
| **P/E Ratio** | Price ÷ EPS | Years of earnings you're paying for |
| **P/B Ratio** | Price ÷ Book Value | Premium over net assets |
| **P/S Ratio** | Price ÷ Sales per Share | Revenue multiple |
| **EV/EBITDA** | Enterprise Value ÷ EBITDA | Acquisition multiple |
| **PEG Ratio** | P/E ÷ Growth Rate | Growth-adjusted P/E |

### How to Read P/E Ratio

| P/E Range | Signal | Interpretation |
|-----------|--------|----------------|
| < 12 | 🟢 Cheap | Potentially undervalued (verify why) |
| 12-20 | 🟡 Fair | Reasonable for stable companies |
| 20-35 | 🟠 Premium | High expectations priced in |
| > 35 | 🔴 Expensive | Needs exceptional growth to justify |

### 🇮🇳 Indian Context
- **Nifty 50 average P/E**: 20-22 historically (currently 22.4 as of Dec 2025)
- **IT sector**: Typically trades at 25-35 P/E (Infosys ~28x)
- **PSU Banks**: Often at 5-10 P/E (Nifty PSU Bank index 8-10x, value trap risk)
- **FMCG**: Premium at 40-60 P/E (Nestle, HUL ~55x)

### 💡 Pro Tips
1. Always compare P/E to sector average, not market average
2. Negative P/E = company is losing money (use P/S instead)
3. Look at 5-year P/E range, not just current value
4. Low P/E + Low growth = Value Trap

### ❓ Common Questions
**Q: Why is Infosys P/E higher than TCS sometimes?**
A: Market expects different growth rates. Higher P/E = higher growth expectations.

**Q: What's a "cheap" stock in India?**
A: Relative to its own history AND peers. A stock at 15 P/E can be expensive if it usually trades at 10.

---

## 1.2 Piotroski F-Score 🌱
**Tool ID:** `piotroski-score` | **Duration:** 10 min

### What It Does
Scores stocks 0-9 based on 9 fundamental tests. Higher = financially stronger. Created by Professor Joseph Piotroski to find quality among cheap stocks.

### The 9 Tests

| # | Category | Test | Pass = +1 Point |
|---|----------|------|-----------------|
| 1 | Profitability | Net Income | Positive |
| 2 | Profitability | Operating Cash Flow | Positive |
| 3 | Profitability | ROA | Improving YoY |
| 4 | Profitability | Cash Flow > Net Income | Yes (quality earnings) |
| 5 | Leverage | Long-term Debt | Decreasing |
| 6 | Leverage | Current Ratio | Improving |
| 7 | Leverage | Shares Outstanding | No dilution |
| 8 | Efficiency | Gross Margin | Improving |
| 9 | Efficiency | Asset Turnover | Improving |

### How to Read the Score

| Score | Signal | Action |
|-------|--------|--------|
| 8-9 | 🟢 Strong | High quality, potential buy |
| 6-7 | 🟡 Good | Solid fundamentals |
| 4-5 | 🟠 Average | Mixed signals, dig deeper |
| 0-3 | 🔴 Weak | Avoid or short candidate |

### 🇮🇳 Indian Context
- Works best for mid-caps and small-caps
- Combine with promoter holding check (>50% preferred)
- PSU stocks often score 4-6 due to inefficiency
- High F-Score + low P/B = classic value play
- **Backtested edge**: High-score (8-9) Nifty 100 portfolios delivered 7-9% annual excess returns (2015-2025)

### 💡 Pro Tips
1. F-Score alone isn't enough—check WHY score changed
2. Improving F-Score (e.g., 4→7) is bullish signal
3. Best used for stocks already identified as "cheap"
4. Backtest shows 8-9 scores outperform 0-3 by 7.5% annually

---

## 1.3 DCF Valuation 🌿
**Tool ID:** `dcf-valuation` | **Duration:** 15 min

### What It Does
Calculates intrinsic value by projecting future cash flows and discounting them to present value. The gold standard of fundamental valuation.

### Key Metrics

| Metric | What It Is | Why It Matters |
|--------|------------|----------------|
| **FCF (Free Cash Flow)** | OCF - CapEx | Cash available to shareholders |
| **WACC** | Weighted cost of capital | Discount rate (10-14% for India) |
| **Terminal Value** | Value beyond projection | Often 60-70% of total value |
| **Intrinsic Value** | Sum of discounted FCFs | Fair price per share |
| **Margin of Safety** | (Intrinsic - Price) / Intrinsic | Your safety buffer |

### DCF Formula Simplified
```
Intrinsic Value = Σ(FCF × Growth) ÷ (1 + WACC)^n + Terminal Value
```

### How to Read Results

| Margin of Safety | Signal | Action |
|------------------|--------|--------|
| > 30% | 🟢 Undervalued | Strong buy zone |
| 15-30% | 🟡 Fair | Reasonable entry |
| 0-15% | 🟠 Full | Wait for dip |
| < 0% | 🔴 Overvalued | Avoid or sell |

### 🇮🇳 Indian Context
- Use WACC of 11-14% (higher than US due to risk-free rate)
- Terminal growth: 4-6% (GDP growth proxy)
- Be conservative with FCF growth (max 15-20% for 5 years)
- IT companies: More predictable FCF, easier to model

### 💡 Pro Tips
1. DCF is highly sensitive to assumptions—run multiple scenarios
2. If >60% of value is terminal value, be skeptical
3. Never use for cyclicals (metals, commodities) or early-stage
4. Cross-check with relative valuation (P/E, EV/EBITDA)

### ⚠️ Common Mistakes
- Using too high growth rates (>20% for >5 years)
- Ignoring working capital changes
- Not adjusting for debt (use Enterprise Value)

---

## 1.4 DuPont Analysis 🌿
**Tool ID:** `dupont-analysis` | **Duration:** 12 min

### What It Does
Decomposes ROE into three drivers to understand WHERE returns come from. Essential for comparing companies with similar ROE.

### The DuPont Formula
```
ROE = Profit Margin × Asset Turnover × Equity Multiplier
    = (Net Income/Sales) × (Sales/Assets) × (Assets/Equity)
```

### The Three Levers

| Component | Formula | What It Shows | Ideal |
|-----------|---------|---------------|-------|
| **Profit Margin** | Net Income ÷ Sales | Pricing power, efficiency | >15% |
| **Asset Turnover** | Sales ÷ Assets | Asset utilization | >1.0x |
| **Equity Multiplier** | Assets ÷ Equity | Leverage used | 1.5-2.5x |

### Reading the Decomposition

| High ROE From | Good Sign? | Example |
|---------------|------------|---------|
| High Margins | ✅ Yes | HUL, Asian Paints |
| High Turnover | ✅ Yes | DMart, Retail |
| High Leverage | ⚠️ Risky | NBFCs, Realty |

### 🇮🇳 Indian Context
- **IT Services**: High margin (20%+), low turnover, low leverage
- **Banks**: Low margin (2-3%), high leverage (10x+)
- **FMCG**: High margin, moderate turnover, low leverage
- **Infra/Realty**: Watch leverage carefully

### 💡 Pro Tips
1. Prefer margin-driven ROE over leverage-driven
2. Compare components to peers, not just ROE
3. Declining margins with rising leverage = red flag
4. Banks use different DuPont (NIM × Leverage × Asset Quality)

---

## 1.5 Intrinsic Value Range 🌿
**Tool ID:** `intrinsic-value-range` | **Duration:** 10 min

### What It Does
Shows fair value estimates using multiple methods (DCF, Graham, Earnings Power) to give a range rather than single point estimate.

### Valuation Methods Used

| Method | Best For | Formula |
|--------|----------|---------|
| **DCF** | Growth companies | Discounted future FCF |
| **Graham Number** | Value stocks | √(22.5 × EPS × BVPS) |
| **Earnings Power** | Stable earners | Normalized Earnings ÷ Cost of Capital |
| **Relative** | Peer comparison | Sector avg multiple × earnings |

### How to Read the Range

| Price vs Range | Signal | Interpretation |
|----------------|--------|----------------|
| Below low end | 🟢 Deep Value | Strong margin of safety |
| Within range | 🟡 Fair | Reasonable price |
| Above high end | 🔴 Overvalued | Priced for perfection |

### 🇮🇳 Indian Context
- Use Graham Number with caution (designed for US markets)
- India premium: quality stocks often trade above "fair" value
- Consider growth potential (India GDP 6.6-7.2% FY26 vs US 2-3%)

---

## 1.6 Fair Value Forecaster 🌿
**Tool ID:** `fair-value-forecaster` | **Duration:** 10 min

### What It Does
Projects future fair value based on expected growth, margins, and multiple expansion/contraction.

### Key Inputs

| Input | Description | Typical Range |
|-------|-------------|---------------|
| **Revenue Growth** | Expected sales growth | 10-25% |
| **Margin Trajectory** | Operating margin path | -2% to +2% |
| **Exit Multiple** | Future P/E expectation | 15-30x |
| **Discount Rate** | Required return | 12-15% |

### Sensitivity Analysis
The tool shows how value changes with different assumptions:
- Bull Case (optimistic growth)
- Base Case (consensus)
- Bear Case (conservative)

---

## 1.7 Financial Health DNA 🌿
**Tool ID:** `financial-health-dna` | **Duration:** 12 min

### What It Does
Comprehensive financial health score combining profitability, solvency, liquidity, and efficiency into a DNA-style visualization.

### Health Components

| Category | Metrics | Weight |
|----------|---------|--------|
| **Profitability** | ROE, ROA, Margins | 30% |
| **Solvency** | D/E, Interest Coverage | 25% |
| **Liquidity** | Current Ratio, Quick Ratio | 20% |
| **Efficiency** | Turnover Ratios | 15% |
| **Growth** | Revenue, EPS Growth | 10% |

### DNA Score Interpretation

| Score | Rating | Meaning |
|-------|--------|---------|
| 80-100 | 🟢 A+ | Exceptional health |
| 65-79 | 🟢 A/B | Strong fundamentals |
| 50-64 | 🟡 C | Average, monitor closely |
| 35-49 | 🟠 D | Concerns present |
| 0-34 | 🔴 F | Distressed, high risk |

---

## 1.8 Multi-Factor Scorecard 🌳
**Tool ID:** `multi-factor-scorecard` | **Duration:** 15 min

### What It Does
Combines multiple investment factors (Value, Quality, Momentum, Growth, Low Volatility) into one composite score.

### Factor Definitions

| Factor | Key Metrics | What It Captures |
|--------|-------------|------------------|
| **Value** | P/E, P/B, EV/EBITDA | Cheapness |
| **Quality** | ROE, Debt/Equity, Stability | Financial strength |
| **Momentum** | 6M/12M returns, RS | Price trend |
| **Growth** | EPS growth, Revenue growth | Expansion |
| **Low Vol** | Beta, Standard deviation | Stability |

### Factor Scores

| Percentile | Rating | Meaning |
|------------|--------|---------|
| 80-100 | 🟢 Strong | Top quintile exposure |
| 60-79 | 🟢 Positive | Above average |
| 40-59 | 🟡 Neutral | Average |
| 20-39 | 🟠 Weak | Below average |
| 0-19 | 🔴 Very Weak | Bottom quintile |

### 🇮🇳 Indian Context
- Momentum factor historically strong in India
- Quality premium higher due to governance concerns
- Value factor works best in mid/small caps

---

# Module 2: Growth Analysis (8 Tools)
*Identify companies with sustainable competitive advantages*

## 2.1 Growth Summary 🌱
**Tool ID:** `growth-summary` | **Duration:** 8 min

### What It Does
Dashboard of all growth metrics: revenue, earnings, cash flow growth across multiple timeframes.

### Key Metrics

| Metric | Formula | Good | Excellent |
|--------|---------|------|-----------|
| **Revenue CAGR 3Y** | (Rev_now/Rev_3y)^(1/3) - 1 | >10% | >20% |
| **EPS CAGR 3Y** | (EPS_now/EPS_3y)^(1/3) - 1 | >12% | >25% |
| **FCF CAGR 3Y** | (FCF_now/FCF_3y)^(1/3) - 1 | >10% | >20% |

### Growth Quality Tiers

| Tier | Characteristics |
|------|-----------------|
| 🟢 **High Growth** | Revenue >20%, EPS >25%, Consistent |
| 🟡 **Moderate Growth** | Revenue 10-20%, EPS 10-20% |
| 🟠 **Slow Growth** | Revenue <10%, EPS <10% |
| 🔴 **Declining** | Negative growth in key metrics |

---

## 2.2 Earnings Quality 🌿
**Tool ID:** `earnings-quality` | **Duration:** 12 min

### What It Does
Detects whether reported earnings are backed by real cash or accounting tricks.

### Key Metrics

| Metric | Formula | Red Flag If |
|--------|---------|-------------|
| **Accruals Ratio** | (NI - OCF) / Total Assets | > 10% |
| **Cash Conversion** | OCF / Net Income | < 80% |
| **Beneish M-Score** | Composite of 8 ratios | > -2.22 |
| **Days Sales Outstanding** | (Receivables / Revenue) × 365 | Rising fast |

### Earnings Quality Score

| Score | Signal | Interpretation |
|-------|--------|----------------|
| 80-100 | 🟢 High Quality | Cash-backed earnings |
| 60-79 | 🟡 Good | Minor concerns |
| 40-59 | 🟠 Moderate | Investigate accruals |
| 0-39 | 🔴 Poor | Potential manipulation |

### 🇮🇳 Indian Context
- Watch for related party transactions
- Auditor changes are red flags
- Pledged shares + poor earnings quality = very risky

---

## 2.3 Earnings Stability 🌱
**Tool ID:** `earnings-stability` | **Duration:** 8 min

### What It Does
Measures consistency of earnings over time—stable earners deserve higher multiples.

### Key Metrics

| Metric | What It Measures |
|--------|------------------|
| **Stability Score** | Variance in EPS over 5 years |
| **Beat Rate** | % quarters beating estimates |
| **Surprise Magnitude** | Avg % beat/miss |
| **Streak** | Consecutive beats/misses |

### Interpretation

| Stability Score | Type | Examples |
|-----------------|------|----------|
| >80 | 🟢 Very Stable | FMCG, IT Services |
| 60-80 | 🟡 Stable | Banks, Pharma |
| 40-60 | 🟠 Moderate | Industrials |
| <40 | 🔴 Volatile | Metals, Commodities |

---

## 2.4 Management Quality 🌿
**Tool ID:** `management-quality` | **Duration:** 12 min

### What It Does
Assesses management through capital allocation, insider behavior, and governance metrics.

### Key Metrics

| Metric | Good Sign | Red Flag |
|--------|-----------|----------|
| **Promoter Holding** | >50%, Stable | Declining, <30% |
| **Promoter Pledge** | 0% | >20% of holding |
| **Board Independence** | >50% independent | <33% |
| **Related Party Txns** | <5% of revenue | >10% of revenue |
| **Capital Allocation** | High ROIC, Low payout | Poor returns, High debt |

### Management Score

| Score | Rating | Trust Level |
|-------|--------|-------------|
| 80-100 | 🟢 Excellent | High conviction |
| 60-79 | 🟡 Good | Standard diligence |
| 40-59 | 🟠 Average | Extra caution |
| 0-39 | 🔴 Poor | Governance risk |

### 🇮🇳 Indian Context
- Promoter holding >50% is norm for family businesses
- Check SEBI orders for past violations
- Auditor resignation = immediate red flag

---

## 2.5 Capital Allocation 🌳
**Tool ID:** `capital-allocation` | **Duration:** 15 min

### What It Does
Analyzes how management deploys capital: reinvestment, M&A, dividends, buybacks.

### Key Metrics

| Metric | Formula | Excellent |
|--------|---------|-----------|
| **ROIC** | NOPAT / Invested Capital | >20% |
| **Reinvestment Rate** | (CapEx + WC) / NOPAT | 40-60% |
| **ROIC - WACC Spread** | Excess returns | >5% |

### Capital Deployment Analysis

| Use of Capital | Good If | Bad If |
|----------------|---------|--------|
| **Reinvestment** | ROIC > WACC | ROIC < WACC |
| **M&A** | Accretive, <10x EBITDA | Dilutive, overpriced |
| **Dividends** | Sustainable, growing | Debt-funded |
| **Buybacks** | Below intrinsic value | At premium |

---

## 2.6 Efficiency Dashboard 🌱
**Tool ID:** `efficiency-dashboard` | **Duration:** 8 min

### What It Does
Tracks operational efficiency through margins, turnover ratios, and working capital management.

### Key Metrics

| Metric | Formula | Industry Dependent |
|--------|---------|-------------------|
| **Gross Margin** | (Revenue - COGS) / Revenue | Yes |
| **Operating Margin** | EBIT / Revenue | Yes |
| **Net Margin** | Net Income / Revenue | Yes |
| **Asset Turnover** | Revenue / Total Assets | Yes |
| **Inventory Days** | (Inventory / COGS) × 365 | Lower better |
| **Receivable Days** | (Receivables / Revenue) × 365 | Lower better |

### Margin Benchmarks by Sector

| Sector | Gross | Operating | Net |
|--------|-------|-----------|-----|
| IT Services | 70-80% | 20-28% | 15-22% |
| FMCG | 45-55% | 18-25% | 12-18% |
| Banks | N/A | N/A | 15-25% (ROA 1-2%) |
| Pharma | 60-75% | 15-25% | 10-18% |
| Auto | 25-35% | 8-15% | 5-10% |

---

## 2.7 Profit vs Cash Divergence 🌿
**Tool ID:** `profit-vs-cash-divergence` | **Duration:** 10 min

### What It Does
Highlights when accounting profits diverge from actual cash generation—early warning for earnings quality issues.

### Key Metrics

| Metric | Formula | Warning If |
|--------|---------|------------|
| **Cash Conversion** | OCF / Net Income | <80% for 2+ years |
| **Accruals** | Net Income - OCF | Growing faster than revenue |
| **FCF/Net Income** | FCF / Net Income | <50% |

### Divergence Signals

| Pattern | Signal | Interpretation |
|---------|--------|----------------|
| Profit ↑, Cash ↓ | 🔴 Red Flag | Potential manipulation |
| Profit ↓, Cash ↑ | 🟢 Positive | Conservative accounting |
| Both moving together | 🟡 Normal | Healthy correlation |

---

## 2.8 Sales-Profit-Cash Alignment 🌱
**Tool ID:** `sales-profit-cash` | **Duration:** 8 min

### What It Does
Visual waterfall from Revenue → Gross Profit → Operating Profit → Net Income → Cash Flow.

### Conversion Benchmarks

| Step | Expected Conversion |
|------|---------------------|
| Revenue → Gross | 30-70% (sector dependent) |
| Gross → Operating | 40-60% |
| Operating → Net | 60-80% |
| Net → Cash | 80-120% |

---

# Module 3: Risk Management (9 Tools)
*Protect your portfolio from permanent capital loss*

## 3.1 Bankruptcy Health 🌱
**Tool ID:** `bankruptcy-health` | **Duration:** 10 min

### What It Does
Calculates Altman Z-Score and other distress indicators to predict bankruptcy risk.

### Altman Z-Score Formula
```
Z = 1.2×A + 1.4×B + 3.3×C + 0.6×D + 1.0×E
Where:
A = Working Capital / Total Assets
B = Retained Earnings / Total Assets
C = EBIT / Total Assets
D = Market Cap / Total Liabilities
E = Sales / Total Assets
```

### Z-Score Interpretation

| Z-Score | Zone | Probability |
|---------|------|-------------|
| > 2.99 | 🟢 Safe | <5% bankruptcy risk |
| 1.81 - 2.99 | 🟡 Grey | 15-35% risk |
| < 1.81 | 🔴 Distress | >50% risk |

### 🇮🇳 Indian Context
- Original model for US manufacturing—use with caution
- Indian variant available (adjust for Indian capital structure)
- Combine with Interest Coverage Ratio
- Works better for mid-caps than large diversified conglomerates

---

## 3.2 Financial Stress Radar 🌿
**Tool ID:** `financial-stress-radar` | **Duration:** 12 min

### What It Does
Multi-factor early warning system detecting financial stress before it becomes crisis.

### Stress Indicators

| Indicator | Warning Level | Critical Level |
|-----------|---------------|----------------|
| **Interest Coverage** | <3x | <1.5x |
| **Debt/EBITDA** | >3x | >5x |
| **Current Ratio** | <1.2 | <1.0 |
| **Cash Burn Rate** | >12 months runway | <6 months |
| **Promoter Pledge** | >10% | >30% |

### Stress Score

| Score | Level | Action |
|-------|-------|--------|
| 0-20 | 🟢 Low | Normal monitoring |
| 21-40 | 🟡 Moderate | Increased diligence |
| 41-60 | 🟠 Elevated | Review position |
| 61-100 | 🔴 High | Consider exit |

---

## 3.3 Leverage History 🌿
**Tool ID:** `leverage-history` | **Duration:** 10 min

### What It Does
Tracks debt levels over time with breakdown by type (short-term, long-term, secured, unsecured).

### Key Metrics

| Metric | Formula | Safe | Risky |
|--------|---------|------|-------|
| **Debt/Equity** | Total Debt / Equity | <1.0 | >2.0 |
| **Debt/EBITDA** | Total Debt / EBITDA | <3.0 | >4.0 |
| **Interest Coverage** | EBIT / Interest | >4x | <2x |
| **Net Debt/Equity** | (Debt - Cash) / Equity | <0.5 | >1.5 |

### Debt Quality

| Type | Better | Worse |
|------|--------|-------|
| Long-term vs Short-term | Long-term | Short-term |
| Fixed vs Floating | Fixed | Floating |
| Secured vs Unsecured | Depends | High unsecured = risky |

---

## 3.4 Drawdown & VaR 🌿
**Tool ID:** `drawdown-var` | **Duration:** 12 min

### What It Does
Historical drawdown analysis and Value at Risk calculations for portfolio risk assessment.

### Key Metrics

| Metric | Description | Use |
|--------|-------------|-----|
| **Max Drawdown** | Largest peak-to-trough decline | Worst case historical |
| **Current Drawdown** | Current decline from peak | Live risk |
| **VaR 95%** | Max daily loss (95% confidence) | Position sizing |
| **CVaR (ES)** | Expected loss beyond VaR | Tail risk |
| **Recovery Time** | Days to recover from drawdown | Opportunity cost |

### Drawdown Severity

| Drawdown | Severity | Recovery Time |
|----------|----------|---------------|
| 0-10% | 🟢 Normal | Days to weeks |
| 10-20% | 🟡 Correction | Weeks to months |
| 20-30% | 🟠 Bear | Months |
| >30% | 🔴 Crash | Months to years |

### 🇮🇳 Indian Context
- Nifty typical drawdown: 15-20% annually
- 2008 crash: -60% drawdown
- 2020 COVID: -38% drawdown
- Small caps can see 50%+ drawdowns

---

## 3.5 F&O Risk Advisor 🌳
**Tool ID:** `fno-risk-advisor` | **Duration:** 15 min

### What It Does
Position sizing and risk management for F&O traders. Calculates optimal lot sizes based on account risk.

### Key Metrics

| Metric | Formula | Guideline |
|--------|---------|-----------|
| **Position Size** | (Account × Risk%) / Stop Loss | Max 2% risk per trade |
| **Max Lots** | Position Size / (Lot Size × Price) | - |
| **Margin Utilization** | Used Margin / Available | <50% |
| **Greeks Exposure** | Delta, Gamma, Theta, Vega | Know your exposure |

### Risk Rules

| Rule | Guideline |
|------|-----------|
| Per Trade Risk | 1-2% of capital |
| Total F&O Exposure | <30% of portfolio |
| Single Stock Exposure | <10% of F&O capital |
| Stop Loss | Always defined before entry |

### 🇮🇳 NSE Index Lot Sizes (Post Dec 30, 2025)

| Index | Symbol | Old Lot | New Lot | ~Contract Value |
|-------|--------|---------|---------|-----------------|
| Nifty 50 | NIFTY | 75 | **65** | ₹17L |
| Bank Nifty | BANKNIFTY | 35 | **30** | ₹13L |
| Fin Nifty | FINNIFTY | 65 | **60** | ₹13L |
| Midcap Select | MIDCPNIFTY | 140 | **120** | ₹12L |
| Nifty Next 50 | NIFTYNXT50 | 25 | 25 | ₹15L |

### Margin Requirements (Approximate)

| Component | Index Futures | Index Options |
|-----------|--------------|---------------|
| **SPAN (Initial)** | 12-15% | 12-15% |
| **Exposure** | 3% | 3% |
| **ELM (Short Options)** | - | +2% |
| **Total** | 15-18% | 15-20% |

*Note: Margins vary daily with volatility. Use NSE/broker margin calculators.*

---

## 3.6 Trade Expectancy Simulator 🌿
**Tool ID:** `trade-expectancy` | **Duration:** 10 min

### What It Does
Calculates trading system expectancy and simulates outcomes based on win rate and risk-reward.

### Expectancy Formula
```
Expectancy = (Win% × Avg Win) - (Loss% × Avg Loss)
```

### Key Metrics

| Metric | Formula | Good |
|--------|---------|------|
| **Win Rate** | Winning trades / Total | >50% |
| **Risk:Reward** | Avg Win / Avg Loss | >1.5:1 |
| **Expectancy** | Per trade expected value | >0.3R |
| **Profit Factor** | Gross Profit / Gross Loss | >1.5 |

### Expectancy Interpretation

| Expectancy | Rating | Meaning |
|------------|--------|---------|
| > 0.5R | 🟢 Excellent | Strong edge |
| 0.2 - 0.5R | 🟡 Good | Viable system |
| 0 - 0.2R | 🟠 Marginal | Barely profitable |
| < 0R | 🔴 Negative | Losing system |

---

## 3.7 Risk Health Dashboard 🌱
**Tool ID:** `risk-health-dashboard` | **Duration:** 8 min

### What It Does
Composite view of all risk metrics in one dashboard with traffic light indicators.

### Risk Categories

| Category | Metrics | Weight |
|----------|---------|--------|
| Solvency Risk | Z-Score, D/E | 30% |
| Liquidity Risk | Current Ratio, Cash | 25% |
| Market Risk | Beta, Volatility | 20% |
| Operational Risk | Margins, Concentration | 15% |
| Governance Risk | Promoter, Audit | 10% |

---

## 3.8 Working Capital Health 🌱
**Tool ID:** `working-capital-health` | **Duration:** 8 min

### What It Does
Analyzes working capital management through current ratio, quick ratio, and cash conversion cycle.

### Key Metrics

| Metric | Formula | Healthy |
|--------|---------|---------|
| **Current Ratio** | Current Assets / Current Liabilities | 1.5-2.5 |
| **Quick Ratio** | (CA - Inventory) / CL | >1.0 |
| **Cash Ratio** | Cash / Current Liabilities | >0.2 |
| **Working Capital Days** | (WC / Revenue) × 365 | Industry dependent |

---

## 3.9 Cashflow Stability Index 🌿
**Tool ID:** `cashflow-stability-index` | **Duration:** 10 min

### What It Does
Measures predictability and consistency of operating cash flows over time.

### Key Metrics

| Metric | What It Measures |
|--------|------------------|
| **OCF Stability Score** | Variance in quarterly OCF |
| **OCF/Revenue Ratio** | Cash generation efficiency |
| **Consecutive Positive** | Streak of positive OCF quarters |

### Stability Tiers

| Score | Tier | Characteristics |
|-------|------|-----------------|
| 80-100 | 🟢 Very Stable | Predictable, subscription-like |
| 60-79 | 🟡 Stable | Normal variation |
| 40-59 | 🟠 Moderate | Seasonal patterns |
| <40 | 🔴 Volatile | Lumpy, project-based |

---

# Module 4: Cash Flow Mastery (3 Tools)
*Cash is king—learn to follow the money*

## 4.1 FCF Health 🌱
**Tool ID:** `fcf-health` | **Duration:** 8 min

### What It Does
Analyzes Free Cash Flow generation, sustainability, and quality.

### FCF Formula
```
FCF = Operating Cash Flow - Capital Expenditure
```

### Key Metrics

| Metric | Formula | Good |
|--------|---------|------|
| **FCF Margin** | FCF / Revenue | >10% |
| **FCF Yield** | FCF / Market Cap | >5% |
| **FCF Growth** | CAGR of FCF | >10% |
| **FCF/Net Income** | Conversion ratio | >80% |

### FCF Quality

| FCF Source | Quality |
|------------|---------|
| Operations | 🟢 High quality |
| Working capital release | 🟡 One-time |
| CapEx deferral | 🔴 Unsustainable |

---

## 4.2 Cash Conversion Cycle 🌿
**Tool ID:** `cash-conversion-cycle` | **Duration:** 10 min

### What It Does
Tracks how quickly a company converts inventory purchases into cash receipts.

### CCC Formula
```
CCC = DIO + DSO - DPO

Where:
DIO = Days Inventory Outstanding
DSO = Days Sales Outstanding
DPO = Days Payables Outstanding
```

### Interpretation

| CCC | Signal | Meaning |
|-----|--------|---------|
| Negative | 🟢 Excellent | Gets paid before paying suppliers (DMart!) |
| 0-30 days | 🟢 Good | Efficient cycle |
| 30-60 days | 🟡 Average | Normal for most |
| >60 days | 🟠 Slow | Capital tied up |
| >90 days | 🔴 Concern | Cash flow stress |

### 🇮🇳 Indian Examples
- **DMart**: Negative CCC (cash business, pays later)
- **IT Services**: ~45 days (invoice cycle)
- **Auto Ancillary**: 60-90 days (OEM payment terms)

---

## 4.3 Cash Conversion of Earnings 🌿
**Tool ID:** `cash-conversion-earnings` | **Duration:** 10 min

### What It Does
Compares accounting earnings to actual cash received—earnings quality check.

### Key Metrics

| Metric | Formula | Healthy |
|--------|---------|---------|
| **Cash Conversion** | OCF / Net Income | 80-120% |
| **Accrual Ratio** | (NI - OCF) / Assets | <5% |
| **Quality Score** | Composite | >70 |

---

# Module 5: Income & Dividends (3 Tools)
*Build passive income streams*

## 5.1 Dividend Crystal Ball 🌿
**Tool ID:** `dividend-crystal-ball` | **Duration:** 10 min

### What It Does
Projects future dividends based on payout policy, earnings growth, and sustainability analysis.

### Key Metrics

| Metric | Formula | Sustainable |
|--------|---------|-------------|
| **Dividend Yield** | DPS / Price | 2-4% |
| **Payout Ratio** | DPS / EPS | 30-60% |
| **Dividend Cover** | EPS / DPS | >1.5x |
| **CAGR 5Y** | Dividend growth rate | >8% |

### Dividend Safety Score

| Score | Safety | Characteristics |
|-------|--------|-----------------|
| 80-100 | 🟢 Very Safe | Low payout, growing, covered |
| 60-79 | 🟡 Safe | Sustainable |
| 40-59 | 🟠 Moderate | Watch payout |
| <40 | 🔴 At Risk | May be cut |

### 🇮🇳 Indian Context
- Dividend tax changed in 2020 (taxed in recipient hands, 20% withholding)
- **TDS threshold**: ₹10,000 (from April 2025, previously ₹5,000)
- PSUs mandated 30% payout
- IT companies: High payout + buybacks
- Coal India: High yield (~8%) but declining business

---

## 5.2 Income Stability 🌱
**Tool ID:** `income-stability` | **Duration:** 8 min

### What It Does
Measures consistency and growth of dividend payments over time.

### Key Metrics

| Metric | Description |
|--------|-------------|
| **Consecutive Years** | Unbroken dividend streak |
| **Growth Streak** | Years of rising dividends |
| **Cut History** | Any cuts in last 10 years |
| **Stability Score** | Overall reliability |

### Dividend Aristocrats Criteria
- 10+ years of consistent dividends
- 5+ years of growing dividends
- Payout ratio <70%

---

## 5.3 Dividend SIP Tracker 🌱
**Tool ID:** `dividend-sip-tracker` | **Duration:** 8 min

### What It Does
Tracks dividend reinvestment returns and projects future income.

### Metrics Tracked

| Metric | Description |
|--------|-------------|
| **Dividend Received** | Total dividends |
| **Shares Added** | Through DRIP |
| **Yield on Cost** | Dividend / Original Price |
| **Income Growth** | YoY dividend increase |

---

# Module 6: Technical Analysis (12 Tools)
*Read price action and timing signals*

## 6.1 Technical Indicators 🌿
**Tool ID:** `technical-indicators` | **Duration:** 15 min

### What It Does
Comprehensive technical dashboard with trend, momentum, volatility, and volume indicators.

### Key Indicators

| Indicator | Type | Calculation | Signal |
|-----------|------|-------------|--------|
| **RSI** | Momentum | 14-period relative strength | >70 overbought, <30 oversold |
| **MACD** | Trend | 12,26,9 EMA difference | Signal line crossover |
| **Bollinger Bands** | Volatility | 20-MA ± 2 std dev | Touch = potential reversal |
| **ADX** | Trend Strength | 14-period | >25 trending, <20 ranging |
| **OBV** | Volume | Cumulative volume | Divergence = reversal |

### RSI Interpretation

| RSI | Zone | Trading Action |
|-----|------|----------------|
| >80 | 🔴 Extreme Overbought | Sell signal |
| 70-80 | 🟠 Overbought | Watch for reversal |
| 30-70 | 🟡 Neutral | Trend-following |
| 20-30 | 🟠 Oversold | Watch for bounce |
| <20 | 🟢 Extreme Oversold | Buy signal |

### MACD Signals

| Signal | Meaning |
|--------|---------|
| MACD crosses above Signal | 🟢 Bullish |
| MACD crosses below Signal | 🔴 Bearish |
| Histogram expanding | Trend strengthening |
| Histogram contracting | Trend weakening |
| Divergence with price | Potential reversal |

---

## 6.2 Candlestick Hero 🌿
**Tool ID:** `candlestick-hero` | **Duration:** 12 min

### What It Does
Identifies candlestick patterns and their trading implications.

### Key Patterns

| Pattern | Type | Signal | Reliability |
|---------|------|--------|-------------|
| **Doji** | Single | Indecision | Medium |
| **Hammer** | Single | Bullish reversal | High |
| **Shooting Star** | Single | Bearish reversal | High |
| **Engulfing** | Double | Reversal | High |
| **Morning Star** | Triple | Bullish reversal | Very High |
| **Evening Star** | Triple | Bearish reversal | Very High |

### Reading Candlesticks

| Component | Meaning |
|-----------|---------|
| Long body | Strong conviction |
| Short body | Indecision |
| Long upper wick | Selling pressure |
| Long lower wick | Buying pressure |
| No wicks (Marubozu) | Extreme conviction |

---

## 6.3 Trend Strength 🌱
**Tool ID:** `trend-strength` | **Duration:** 8 min

### What It Does
Measures strength and quality of current price trend using ADX and moving averages.

### Key Metrics

| Metric | Description | Strong Trend |
|--------|-------------|--------------|
| **ADX** | Trend strength | >25 |
| **+DI / -DI** | Direction | Gap >10 |
| **MA Alignment** | 20 > 50 > 200 | Yes for uptrend |
| **Slope** | MA angle | Steep |

### Trend Classification

| ADX | +DI vs -DI | Trend |
|-----|------------|-------|
| >40, +DI > -DI | 🟢 Strong Uptrend |
| >40, -DI > +DI | 🔴 Strong Downtrend |
| 25-40 | 🟡 Moderate Trend |
| <25 | ⚪ No Trend / Range |

---

## 6.4 Momentum Heatmap 🌱
**Tool ID:** `momentum-heatmap` | **Duration:** 8 min

### What It Does
Multi-timeframe momentum visualization across different periods.

### Timeframes Analyzed

| Period | Use Case |
|--------|----------|
| 1 Week | Very short-term |
| 1 Month | Short-term swing |
| 3 Month | Medium-term |
| 6 Month | Intermediate |
| 12 Month | Long-term trend |

### Momentum Score

| Score | Color | Meaning |
|-------|-------|---------|
| >80 | 🟢 Dark Green | Very strong |
| 60-80 | 🟢 Light Green | Strong |
| 40-60 | 🟡 Yellow | Neutral |
| 20-40 | 🟠 Orange | Weak |
| <20 | 🔴 Red | Very weak |

---

## 6.5 Price Structure 🌿
**Tool ID:** `price-structure` | **Duration:** 10 min

### What It Does
Identifies support/resistance levels, pivot points, and key price zones.

### Key Levels

| Level Type | Calculation | Use |
|------------|-------------|-----|
| **Pivot Point** | (H + L + C) / 3 | Day trading reference |
| **Support 1** | (2 × PP) - High | First support |
| **Resistance 1** | (2 × PP) - Low | First resistance |
| **200 DMA** | 200-day average | Major trend |
| **52W High/Low** | Year extremes | Key psychological levels |

### 🇮🇳 Indian Context
- Round numbers (₹100, ₹500, ₹1000) act as psychological S/R
- Pre-market levels (9:00-9:15) important for intraday
- Option strikes create artificial S/R levels

---

## 6.6 Pattern Matcher 🌿
**Tool ID:** `pattern-matcher` | **Duration:** 12 min

### What It Does
Detects chart patterns (Head & Shoulders, Triangles, Flags) automatically.

### Key Patterns

| Pattern | Type | Target |
|---------|------|--------|
| **Head & Shoulders** | Reversal | Neckline distance |
| **Double Top/Bottom** | Reversal | Pattern height |
| **Triangle (Ascending)** | Continuation | Width × 0.75 |
| **Flag/Pennant** | Continuation | Pole length |
| **Cup & Handle** | Continuation | Cup depth |

### Pattern Reliability

| Pattern | Reliability | Breakout Success |
|---------|-------------|------------------|
| H&S | High | 70% |
| Double Bottom | High | 70% |
| Ascending Triangle | Medium | 65% |
| Flag | Medium | 60% |
| Symmetrical Triangle | Low | 55% |

---

## 6.7 Volatility Regime 🌿
**Tool ID:** `volatility-regime` | **Duration:** 10 min

### What It Does
Classifies current volatility environment and suggests appropriate strategies.

### Key Metrics

| Metric | Calculation | Use |
|--------|-------------|-----|
| **ATR** | 14-period average range | Position sizing |
| **ATR %** | ATR / Price | Normalized volatility |
| **Bollinger Width** | (Upper - Lower) / Middle | Squeeze detection |
| **India VIX** | Options implied vol | Market fear gauge |

### Volatility Regimes

| ATR Percentile | Regime | Strategy |
|----------------|--------|----------|
| >80th | 🔴 High Vol | Reduce size, wider stops |
| 60-80th | 🟠 Elevated | Normal with caution |
| 40-60th | 🟡 Normal | Standard approach |
| <40th | 🟢 Low Vol | Breakout setup, tighter stops |

### India VIX Interpretation

| VIX | Market State | Implication |
|-----|--------------|-------------|
| <12 | 🟢 Complacent | Low fear, potential complacency |
| 12-18 | 🟡 Normal | Standard conditions |
| 18-25 | 🟠 Elevated | Uncertainty rising |
| >25 | 🔴 Fear | Panic, potential bottom |

### 🇮🇳 Current Context (Dec 2025)
- **India VIX**: 10-11 (complacent territory)
- Low VIX = cheap options premiums for buyers
- Complacency often precedes corrections—stay alert
- Nifty 55% average delivery % in 2025

---

## 6.8 Delivery Analysis Pro 🌿
**Tool ID:** `delivery-analysis` | **Duration:** 10 min

### What It Does
Analyzes delivery percentage to distinguish genuine buying from speculation.

### Key Metrics

| Metric | Description | Bullish If |
|--------|-------------|------------|
| **Delivery %** | Delivered / Traded | >50% |
| **Delivery Trend** | 5-day average | Rising |
| **Price-Delivery Divergence** | Price up, delivery down | 🔴 Warning |

### Interpretation

| Delivery % | Price Move | Signal |
|------------|------------|--------|
| High (>60%) | Up | 🟢 Genuine buying |
| High (>60%) | Down | 🟢 Genuine selling |
| Low (<30%) | Up | 🟠 Speculative, may reverse |
| Low (<30%) | Down | 🟠 Speculative selling |

### 🇮🇳 Indian Context
- F&O stocks: Look for delivery >40%
- Cash-only stocks: Delivery usually higher
- Pre-expiry: Delivery drops (rollover activity)

---

## 6.9 Market Regime Radar 🌿
**Tool ID:** `market-regime-radar` | **Duration:** 10 min

### What It Does
Classifies market into Bull, Bear, or Sideways regime using multiple indicators.

### Regime Detection

| Indicator | Bull | Bear | Sideways |
|-----------|------|------|----------|
| 200 DMA | Price > 200 DMA | Price < 200 DMA | Flat 200 DMA |
| Breadth | A/D > 1.5 | A/D < 0.6 | A/D ~ 1 |
| New Highs | Expanding | Contracting | Flat |
| Momentum | RSI > 50 | RSI < 50 | RSI 40-60 |

### Strategy by Regime

| Regime | Strategy |
|--------|----------|
| 🟢 Bull | Long bias, buy dips, momentum |
| 🔴 Bear | Cash, hedges, short-term trades |
| 🟡 Sideways | Mean reversion, range trading |

---

## 6.10 Seasonality Pattern 🌱
**Tool ID:** `seasonality-pattern` | **Duration:** 8 min

### What It Does
Historical analysis of monthly and daily return patterns.

### Key Views

| View | Analysis |
|------|----------|
| Monthly | Which months historically best/worst |
| Day of Week | Intraday patterns |
| Pre-Events | Behavior before earnings, dividends |

### 🇮🇳 Indian Seasonality
- **October-December**: Historically strong (Diwali rally, Q4 2025 +6.3% Nifty)
- **May-June**: "Sell in May" effect
- **March**: Volatile (fiscal year-end)
- **Tuesday**: F&O weekly/monthly expiry (changed from Thursday, Sept 2025)

---

## 6.11 Trade Flow Intelligence 🌳
**Tool ID:** `trade-flow-intel` | **Duration:** 15 min

### What It Does
Order flow analysis showing buy/sell pressure from order book data.

### Key Metrics

| Metric | Description |
|--------|-------------|
| **Buy/Sell Ratio** | Buyer vs seller aggression |
| **Block Deals** | Large institutional trades |
| **Bulk Deals** | >0.5% of equity traded |
| **Cumulative Delta** | Net buying pressure |

---

## 6.12 Playbook Builder 🌳
**Tool ID:** `playbook-builder` | **Duration:** 15 min

### What It Does
Create, backtest, and save trading strategies with rule-based entries and exits.

### Components

| Component | Options |
|-----------|---------|
| Entry Rules | Price, indicator conditions |
| Exit Rules | Target, stop loss, trailing |
| Position Size | Fixed, risk-based |
| Filters | Volume, volatility, trend |

---

# Module 7: Market & Macro (8 Tools)
*Understand market structure and money flows*

## 7.1 Institutional Flows 🌱
**Tool ID:** `institutional-flows` | **Duration:** 8 min

### What It Does
Tracks FII/DII buying and selling patterns—the smart money footprint.

### Key Metrics

| Metric | Description |
|--------|-------------|
| **FII Net** | Foreign buying - selling (₹ Cr) |
| **DII Net** | Domestic institutions net |
| **Cumulative** | Running total over period |
| **Trend** | 20-day direction |

### Interpretation

| FII | DII | Typical Market |
|-----|-----|----------------|
| +++ | + | 🟢 Bull run |
| --- | +++ | 🟠 Support from DIIs |
| --- | --- | 🔴 Broad selling |
| + | --- | 🟡 Mixed signals |

### 🇮🇳 Indian Context
- FII flows dominate short-term moves
- DII (mutual funds, insurance) provide stability
- ₹2000+ Cr daily flow is significant
- Check sector-wise flows for rotation

---

## 7.2 Shareholding Pattern 🌱
**Tool ID:** `shareholding-pattern` | **Duration:** 8 min

### What It Does
Tracks ownership breakdown and changes across promoter, FII, DII, public categories.

### Key Categories

| Category | Good Sign | Red Flag |
|----------|-----------|----------|
| **Promoter** | >50%, stable | Declining, <30% |
| **FII** | Increasing | Consistent selling |
| **DII** | Increasing | - |
| **Public** | Decreasing | Sharply increasing |

### 🇮🇳 Indian Context
- SEBI requires quarterly disclosure
- Promoter pledge percentage crucial
- Watch for sudden changes >2%

---

## 7.3 Insider Trades 🌿
**Tool ID:** `insider-trades` | **Duration:** 10 min

### What It Does
Tracks promoter and key managerial personnel (KMP) transactions.

### Signal Types

| Transaction | By Whom | Signal |
|-------------|---------|--------|
| Buying | Promoter | 🟢 Very bullish |
| Buying | KMP | 🟢 Bullish |
| Selling | Promoter | 🟠 Investigate reason |
| Selling | KMP (options) | 🟡 Usually normal |

### 🇮🇳 Indian Context
- Check SAST disclosures for large trades
- Creeping acquisition (>5% stake building)
- Watch for pre-result trades (timing suspicious)

---

## 7.4 Earnings Calendar 🌱
**Tool ID:** `earnings-calendar` | **Duration:** 5 min

### What It Does
Upcoming earnings dates and historical patterns.

### Key Information

| Field | Use |
|-------|-----|
| **Date** | Plan trades around it |
| **Time** | Pre/post market |
| **Estimate** | Consensus expectation |
| **History** | Past beat/miss pattern |

---

## 7.5 Earnings Surprise 🌱
**Tool ID:** `earnings-surprise` | **Duration:** 8 min

### What It Does
Historical analysis of earnings beats/misses and stock reaction.

### Key Metrics

| Metric | Description |
|--------|-------------|
| **Beat Rate** | % quarters beating estimates |
| **Avg Surprise** | Average % beat/miss |
| **Price Reaction** | Typical move on earnings |
| **Drift** | Post-earnings drift pattern |

---

## 7.6 Macro Calendar 🌱
**Tool ID:** `macro-calendar` | **Duration:** 5 min

### What It Does
Upcoming economic events: RBI policy, GDP, inflation, global events.

### Key Indian Events

| Event | Frequency | Market Impact |
|-------|-----------|---------------|
| RBI MPC | Bi-monthly | High |
| GDP | Quarterly | Medium |
| IIP | Monthly | Medium |
| CPI Inflation | Monthly | High |
| Trade Data | Monthly | Low |

---

## 7.7 Macro Pulse 🌿
**Tool ID:** `macro-pulse` | **Duration:** 10 min

### What It Does
Dashboard of key economic indicators with trend analysis.

### Key Indicators

| Indicator | Good | Concern |
|-----------|------|---------|
| **GDP Growth** | >6.5% | <5.5% |
| **Inflation (CPI)** | 4-6% | >6% |
| **Repo Rate** | Falling (currently 5.25%, Dec 2025) | Rising |
| **USD/INR** | Stable (83-85 range) | Rapid depreciation |
| **CAD/GDP** | <2.5% | >3% |

### 🇮🇳 Current Context (Dec 2025)
- **FY26 GDP forecast**: 6.6-7.2% (IMF/ADB)
- **RBI MPC**: Recent 25bps cut to 5.25%
- **India VIX**: Low at 10-11 (complacency, supports bull run)

---

## 7.8 Narrative Theme Tracker 🌿
**Tool ID:** `narrative-theme` | **Duration:** 10 min

### What It Does
Identifies dominant market narratives and theme strength.

### Theme Categories

| Theme Type | Duration | Example |
|------------|----------|---------|
| Long-term | Years | Digital India, Energy transition |
| Cyclical | Quarters | Commodity cycle, Capex cycle |
| Short-term | Weeks | Election trade, Budget play |
| Event | Days | IPO fever, Rights issue |

### Theme Strength Score

| Score | Strength | Strategy |
|-------|----------|----------|
| >80 | 🟢 Strong | Ride the trend |
| 60-80 | 🟡 Moderate | Selective plays |
| <60 | 🟠 Weak | Fading, avoid |

---

# Module 8: Portfolio Management (7 Tools)
*Optimize and track your portfolio*

## 8.1 Portfolio Correlation 🌿
**Tool ID:** `portfolio-correlation` | **Duration:** 12 min

### What It Does
Analyzes correlation between holdings to assess diversification.

### Correlation Interpretation

| Correlation | Meaning | Diversification |
|-------------|---------|-----------------|
| >0.8 | High positive | 🔴 Poor - moves together |
| 0.4-0.8 | Moderate positive | 🟠 Some overlap |
| -0.2 to 0.4 | Low | 🟢 Good diversification |
| <-0.2 | Negative | 🟢 Excellent hedge |

### 🇮🇳 Indian Context
- IT and Pharma: Low correlation
- Banks and NBFCs: High correlation
- PSUs tend to move together
- Global exposure (IT) hedges INR

---

## 8.2 Rebalance Optimizer 🌿
**Tool ID:** `rebalance-optimizer` | **Duration:** 10 min

### What It Does
Identifies portfolio drift and suggests trades to return to target allocation.

### Key Metrics

| Metric | Description |
|--------|-------------|
| **Drift** | Current vs target weight |
| **Threshold** | Rebalance trigger (usually 5%) |
| **Tax Impact** | STCG/LTCG consideration |
| **Trade Cost** | Brokerage + impact |

### Rebalancing Triggers

| Drift | Action |
|-------|--------|
| <3% | 🟢 No action |
| 3-5% | 🟡 Monitor |
| 5-10% | 🟠 Consider rebalancing |
| >10% | 🔴 Rebalance needed |

---

## 8.3 Peer Comparison 🌱
**Tool ID:** `peer-comparison` | **Duration:** 8 min

### What It Does
Compares stock to sector peers across valuation, growth, and efficiency metrics.

### Comparison Dimensions

| Dimension | Metrics |
|-----------|---------|
| Valuation | P/E, P/B, EV/EBITDA |
| Growth | Revenue, EPS CAGR |
| Profitability | ROE, Margins |
| Quality | D/E, Interest Coverage |

---

## 8.4 Portfolio Leaderboard 🌱
**Tool ID:** `portfolio-leaderboard` | **Duration:** 5 min

### What It Does
Ranks holdings by contribution to portfolio returns.

### Metrics Shown

| Metric | Description |
|--------|-------------|
| **Absolute Return** | Total gain/loss |
| **Contribution** | Impact on portfolio return |
| **Weight** | Current allocation |
| **Risk Contribution** | Volatility impact |

---

## 8.5 ETF Comparator 🌱
**Tool ID:** `etf-comparator` | **Duration:** 8 min

### What It Does
Compares ETFs on expense ratio, tracking error, liquidity, and overlap.

### Key Metrics

| Metric | Better |
|--------|--------|
| **Expense Ratio** | Lower (Nifty BeES: <0.2% in 2025) |
| **Tracking Error** | Lower (<0.5% ideal) |
| **AUM** | Higher (>₹1000Cr for liquidity) |
| **Bid-Ask Spread** | Narrower |
| **Overlap** | Depends on goal |

### 🇮🇳 Indian ETF Context
- Nifty 50 ETFs: TER 0.05-0.20%
- Sectoral ETFs: Higher TER 0.30-0.50%
- Gold ETFs: ~0.50% TER
- Avoid high tracking error (>1%)

---

## 8.6 Trade Journal Analytics 🌿
**Tool ID:** `trade-journal` | **Duration:** 10 min

### What It Does
Analyzes your trading history for patterns, mistakes, and improvement areas.

### Analytics Provided

| Analysis | Insight |
|----------|---------|
| Win Rate by Setup | Which patterns work |
| Time Analysis | Best trading hours |
| Size Impact | Optimal position size |
| Emotion Tags | Fear/greed patterns |

---

## 8.7 Options Interest Dashboard 🌿
**Tool ID:** `options-interest` | **Duration:** 10 min

### What It Does
Open interest analysis with put-call ratio and max pain calculation.

### Key Metrics

| Metric | Description | Bullish If |
|--------|-------------|------------|
| **PCR** | Put OI / Call OI | >1.2 (contrarian) |
| **Max Pain** | Strike with max OI loss | Price moving toward |
| **OI Change** | Daily change | Put unwinding |
| **IV** | Implied volatility | Low (buying opportunity) |

### PCR Interpretation

| PCR | Market Sentiment | Contrarian View |
|-----|------------------|-----------------|
| >1.5 | Extreme fear | 🟢 Bullish |
| 1.0-1.5 | Cautious | 🟡 Neutral |
| 0.7-1.0 | Neutral | 🟡 Neutral |
| <0.7 | Extreme greed | 🔴 Bearish |

---

# Module 9: Derivatives & F&O (2 Tools)
*Navigate options and futures markets*

## 9.1 Options Strategy Explainer 🌿
**Tool ID:** `options-strategy` | **Duration:** 15 min

### What It Does
Visualizes options strategies with P&L diagrams and Greeks.

### Common Strategies

| Strategy | View | Max Profit | Max Loss |
|----------|------|------------|----------|
| **Long Call** | Bullish | Unlimited | Premium |
| **Long Put** | Bearish | Strike - Premium | Premium |
| **Covered Call** | Neutral-Bullish | Premium + (Strike - Stock) | Stock - Premium |
| **Bull Call Spread** | Bullish | Spread - Net Debit | Net Debit |
| **Iron Condor** | Neutral | Net Credit | Spread - Credit |
| **Straddle** | Volatile | Unlimited | Double Premium |

### Greeks Explained

| Greek | Measures | Positive If |
|-------|----------|-------------|
| **Delta** | Price sensitivity | Long calls/short puts |
| **Gamma** | Delta change rate | Long options |
| **Theta** | Time decay | Short options |
| **Vega** | Volatility sensitivity | Long options |

### 🇮🇳 NSE Options Context
- **Weekly expiry**: Every Tuesday (changed Sept 2025)
- **Monthly expiry**: Last Tuesday of month
- **IV crush**: Expect post-earnings premium collapse
- **India VIX**: Currently 10-11 (low vol environment, cheap options)

### 💡 Pro Tips
- New lot sizes (Jan 2026): Nifty 65, BankNifty 30 - lower capital needed
- Use India VIX to gauge option pricing: <12 = cheap premiums
- Tuesday expiries: Plan rollovers by Monday EOD

---

## 9.2 NSE Currency Dashboard 🌱
**Tool ID:** `nse-currency-dashboard` | **Duration:** 8 min

### What It Does
USD/INR, EUR/INR futures and options data with spot tracking.

### Key Metrics

| Metric | Description |
|--------|-------------|
| **Spot Rate** | Current USD/INR (83-85 range, stable with RBI intervention) |
| **Futures Premium** | Futures - Spot |
| **Forward Points** | Implied forward rate |
| **RBI Reference** | Official daily rate |

### Currency Derivatives Specifications

| Pair | Lot Size | Tick Size | Expiry |
|------|----------|-----------|--------|
| USDINR | 1,000 USD | 0.0025 | Last working day, 12:30 PM |
| EURINR | 1,000 EUR | 0.0025 | Last working day |
| GBPINR | 1,000 GBP | 0.0025 | Last working day |
| JPYINR | 100,000 JPY | 0.0025 | Last working day |

### Margin Requirements (Currency)

| Component | Rate |
|-----------|------|
| SPAN | 2-4% |
| Exposure | 1% |
| Total | 3-5% |

*Lower margins than equity due to RBI interventions maintaining stability.*

---

# Module 10: Mutual Funds (3 Tools)
*Analyze and optimize fund investments*

## 10.1 Mutual Fund Analyzer 🌿
**Tool ID:** `mf-analyzer` | **Duration:** 12 min

### What It Does
Deep-dive analysis of mutual fund performance, holdings, and risks.

### Key Metrics

| Metric | Description | Good |
|--------|-------------|------|
| **CAGR** | Annualized returns | >Category avg |
| **Sharpe Ratio** | Risk-adjusted return | >1.0 |
| **Alpha** | Excess over benchmark | Positive |
| **Expense Ratio** | Annual cost | <1.5% |
| **Portfolio Turnover** | Trading activity | <50% |

### Rating Components

| Component | Weight |
|-----------|--------|
| Returns | 35% |
| Risk-adjusted | 30% |
| Consistency | 20% |
| Cost | 15% |

---

## 10.2 Mutual Fund Explorer 🌱
**Tool ID:** `mf-explorer` | **Duration:** 8 min

### What It Does
Fund discovery and screening by category, returns, and risk.

### Categories

| Category | Risk | Typical Return |
|----------|------|----------------|
| Large Cap | Low | 10-14% |
| Mid Cap | Medium | 12-18% |
| Small Cap | High | 14-25% |
| Flexi Cap | Medium | 12-16% |
| ELSS | Medium | 12-16% |
| Debt | Very Low | 6-9% |

---

## 10.3 MF Portfolio Optimizer 🌳
**Tool ID:** `mf-portfolio-optimizer` | **Duration:** 15 min

### What It Does
Optimizes mutual fund allocation using modern portfolio theory.

### Optimization Goals

| Goal | Approach |
|------|----------|
| Max Return | Risk tolerance high |
| Min Risk | Conservative allocation |
| Max Sharpe | Best risk-adjusted |
| Target Return | Specific return goal |

---

# Module 11: Commodities & Forex (1 Tool)

## 11.1 MCX Commodity Dashboard 🌱
**Tool ID:** `mcx-commodity-dashboard` | **Duration:** 8 min

### What It Does
Live MCX commodity prices, trends, and related equity mapping.

### Commodities Tracked

| Commodity | Contract | Related Stocks |
|-----------|----------|----------------|
| Gold | GOLD, GOLDM | Titan, Kalyan |
| Silver | SILVER, SILVERM | - |
| Crude Oil | CRUDE | ONGC, Reliance |
| Natural Gas | NATGAS | GAIL, IGL |
| Copper | COPPER | Hindalco |
| Zinc | ZINC | Hindustan Zinc |
| Aluminum | ALUMINIUM | Hindalco, NALCO |

---

# Module 12: Overview (1 Tool)
*Quick stock summary at a glance*

## 12.1 Stock Snapshot 🌱
**Tool ID:** `stock-snapshot` | **Duration:** 5 min

### What It Does
Comprehensive one-page overview of any stock with key metrics, price chart, and quick health indicators.

### Key Sections

| Section | Content |
|---------|---------|
| **Header** | Name, sector, current price, change |
| **Key Stats** | Market cap, P/E, P/B, dividend yield |
| **Price Chart** | 1Y price with volume |
| **Health Indicators** | Quick traffic lights for value, growth, risk |
| **Recent News** | Latest headlines |

### Quick Health Traffic Lights

| Indicator | 🟢 Good | 🟡 Fair | 🔴 Poor |
|-----------|---------|---------|---------|
| Valuation | P/E < sector | P/E ~ sector | P/E > sector |
| Growth | EPS growth >15% | 5-15% | <5% |
| Quality | F-Score >6 | 4-6 | <4 |
| Risk | D/E <1 | 1-2 | >2 |

### 🇮🇳 Indian Context
- Shows NSE/BSE codes
- Displays in ₹ with Indian number formatting (Cr, L)
- Links to SEBI filings and exchange announcements

### When to Use
- First stop when researching any stock
- Quick screening before deep dive
- Portfolio review dashboard

---

# Module 13: Quick Reference Minis (5 Tools)
*Compact signals at a glance*

## 13.1 Altman & Graham Mini 🌱
**Tool ID:** `altman-graham-mini` | **Duration:** 5 min

### What It Shows
- Altman Z-Score (bankruptcy risk)
- Graham Number (value threshold)
- Quick safety check

| Z-Score | Graham vs Price | Signal |
|---------|-----------------|--------|
| >2.99, Price < Graham | 🟢 Strong Buy |
| >2.99, Price > Graham | 🟡 Hold |
| <2.99 | 🔴 Risk Alert |

---

## 13.2 Sentiment Z-Score Mini 🌱
**Tool ID:** `sentiment-zscore-mini` | **Duration:** 5 min

### What It Shows
- News sentiment score
- Social sentiment
- Combined Z-Score (deviation from normal)

| Z-Score | Meaning |
|---------|---------|
| >2 | 🟢 Extremely bullish |
| 1 to 2 | 🟢 Bullish |
| -1 to 1 | 🟡 Neutral |
| -2 to -1 | 🔴 Bearish |
| <-2 | 🔴 Extremely bearish |

---

## 13.3 Factor Tilt Mini 🌱
**Tool ID:** `factor-tilt-mini` | **Duration:** 5 min

### What It Shows
- Dominant factor exposure (Value, Growth, Momentum, Quality)
- Factor percentile ranking
- Factor momentum (accelerating/decelerating)

---

## 13.4 Warning Sentinel Mini 🌱
**Tool ID:** `warning-sentinel-mini` | **Duration:** 5 min

### What It Shows
- Critical alerts (red)
- Warnings (yellow)
- Watch items (status dots)
- Overall risk score

---

## 13.5 Crash Warning Mini 🌱 (NEW)
**Tool ID:** `crash-warning-mini` | **Duration:** 5 min

### What It Shows
Traffic light crash risk indicator based on:
- 10-day rolling return
- 10-day rolling volatility
- Current drawdown
- Crash proximity score

### Signal Logic

| Signal | Conditions | Action |
|--------|------------|--------|
| 🟢 SAFE | Normal metrics | Hold/Buy |
| 🟡 CAUTION | Some factors elevated | Monitor closely |
| 🟠 WARNING | Return < -0.5% AND Vol > 2% | Reduce exposure |
| 🔴 DANGER | Above + Drawdown > 15% | Exit/Hedge |

---

# Metric Reference Guide

## Valuation Metrics Quick Reference

| Metric | Formula | Low | High | Notes |
|--------|---------|-----|------|-------|
| P/E | Price / EPS | <15 | >35 | Sector dependent |
| P/B | Price / Book | <1.5 | >4 | Asset-heavy matters |
| P/S | Price / Sales | <2 | >8 | For loss-making |
| EV/EBITDA | EV / EBITDA | <8 | >15 | Acquisition metric |
| PEG | P/E / Growth | <1 | >2 | Growth adjustment |

## Quality Metrics Quick Reference

| Metric | Formula | Good | Excellent | Red Flag |
|--------|---------|------|-----------|----------|
| ROE | NI / Equity | >15% | >20% | <10% |
| ROA | NI / Assets | >5% | >10% | <2% |
| ROIC | NOPAT / IC | >12% | >20% | <WACC |
| Net Margin | NI / Revenue | >10% | >20% | Declining |
| FCF Margin | FCF / Revenue | >5% | >15% | Negative |

## Risk Metrics Quick Reference

| Metric | Formula | Safe | Watch | Danger |
|--------|---------|------|-------|--------|
| D/E | Debt / Equity | <0.5 | 0.5-1.5 | >2 |
| Interest Cover | EBIT / Interest | >5x | 2-5x | <2x |
| Current Ratio | CA / CL | >1.5 | 1-1.5 | <1 |
| Z-Score | Altman formula | >2.99 | 1.8-3 | <1.8 |

## Technical Metrics Quick Reference

| Metric | Range | Oversold | Neutral | Overbought |
|--------|-------|----------|---------|------------|
| RSI | 0-100 | <30 | 30-70 | >70 |
| Stochastic | 0-100 | <20 | 20-80 | >80 |
| ADX | 0-100 | <20 (no trend) | 20-40 | >40 (strong) |
| India VIX | 10-40+ | <12 | 12-20 | >25 |

---

# Learning Paths

## 🎯 Path 1: Beginner Investor (4 weeks)
**Goal**: Build foundation for stock analysis

| Week | Tools | Focus |
|------|-------|-------|
| 1 | Valuation Summary, Piotroski Score | Is it cheap? Is it quality? |
| 2 | Growth Summary, Earnings Stability | Is it growing? Consistently? |
| 3 | Risk Health Dashboard, Bankruptcy Health | Is it safe? |
| 4 | Institutional Flows, Shareholding Pattern | Who's buying? |

---

## 🎯 Path 2: Value Investor (6 weeks)
**Goal**: Master value investing principles

| Week | Tools | Focus |
|------|-------|-------|
| 1 | DCF Valuation, Intrinsic Value Range | Calculate fair value |
| 2 | DuPont Analysis, Financial Health DNA | Quality analysis |
| 3 | FCF Health, Earnings Quality | Cash vs accounting |
| 4 | Leverage History, Working Capital Health | Balance sheet safety |
| 5 | Management Quality, Insider Trades | Governance |
| 6 | Multi-Factor Scorecard, Peer Comparison | Compare & rank |

---

## 🎯 Path 3: Technical Trader (4 weeks)
**Goal**: Master technical analysis

| Week | Tools | Focus |
|------|-------|-------|
| 1 | Technical Indicators, Trend Strength | Indicators basics |
| 2 | Candlestick Hero, Pattern Matcher | Pattern recognition |
| 3 | Volatility Regime, Delivery Analysis | Volume & volatility |
| 4 | Market Regime Radar, Playbook Builder | System building |

---

## 🎯 Path 4: F&O Trader (3 weeks)
**Goal**: Derivatives trading competency

| Week | Tools | Focus |
|------|-------|-------|
| 1 | Options Interest, Options Strategy | Options basics |
| 2 | F&O Risk Advisor, Trade Expectancy | Risk management |
| 3 | Volatility Regime, Market Regime Radar | Regime-based trading |

---

## 🎯 Path 5: Portfolio Manager (4 weeks)
**Goal**: Manage diversified portfolios

| Week | Tools | Focus |
|------|-------|-------|
| 1 | Portfolio Correlation, Rebalance Optimizer | Diversification |
| 2 | Drawdown & VaR, Risk Health Dashboard | Risk metrics |
| 3 | ETF Comparator, MF Portfolio Optimizer | Product selection |
| 4 | Trade Journal, Portfolio Leaderboard | Performance tracking |

---

## 📱 Quick Reference Card

### Daily Checklist
1. ☐ Check Market Regime Radar (Bull/Bear/Sideways)
2. ☐ Review Institutional Flows (FII/DII)
3. ☐ Scan Warning Sentinel for portfolio alerts
4. ☐ Check Crash Warning for market risk

### Before Buying
1. ☐ Valuation Summary (Is it cheap?)
2. ☐ Piotroski Score (Is it quality?)
3. ☐ Management Quality (Trust management?)
4. ☐ Earnings Quality (Real profits?)
5. ☐ Peer Comparison (Best in sector?)

### Position Sizing
1. ☐ F&O Risk Advisor (Max position)
2. ☐ Drawdown & VaR (Risk capacity)
3. ☐ Trade Expectancy (System check)

---

## 📊 NSE Derivatives Quick Reference (Dec 2025)

### Index Lot Sizes Transition

| Index | Pre-Dec 30, 2025 | Post-Dec 30, 2025 |
|-------|------------------|-------------------|
| Nifty 50 | 75 | **65** |
| Bank Nifty | 35 | **30** |
| Fin Nifty | 65 | **60** |
| Midcap Select | 140 | **120** |
| Nifty Next 50 | 25 | 25 (unchanged) |

*New sizes apply from January 2026 weekly expiry (Jan 6) and monthly (Jan 27)*

### Expiry Schedule
- **Weekly**: Every Tuesday
- **Monthly**: Last Tuesday of month
- **Currency**: Last working day, 12:30 PM IST

### Margin Quick Reference

| Segment | SPAN | Exposure | Total |
|---------|------|----------|-------|
| Index Futures | 12-15% | 3% | 15-18% |
| Index Options (Short) | 12-15% | 3% + 2% ELM | 17-20% |
| Currency | 2-4% | 1% | 3-5% |

---

*Last Updated: December 2025*
*Version: 1.1*
*Tools: 70*
