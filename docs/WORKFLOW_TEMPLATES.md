# Monomorph Workflow Templates

**9 Pre-built Workflow Templates** for common analysis patterns. Each template chains multiple analysis cards together in a logical flow.

---

## Template Overview

| # | Template | Icon | Category | Cards | Use Case |
|---|----------|------|----------|-------|----------|
| 1 | Quick Snapshot | 📷 | Beginner | 2 | Fast overview of any stock |
| 2 | Value Investor | 💎 | Value | 4 | Warren Buffett style analysis |
| 3 | Margin of Safety | 🛡️ | Value | 4 | Find undervalued stocks |
| 4 | Growth Hunter | 🚀 | Growth | 3 | High-growth companies |
| 5 | Technical Deep Dive | 📊 | Technical | 4 | Complete chart analysis |
| 6 | Swing Trader | 🎢 | Technical | 3 | Swing trading setups |
| 7 | Risk Assessment | ⚠️ | Risk | 4 | Pre-investment due diligence |
| 8 | Dividend Investor | 💰 | Income | 3 | Sustainable dividend stocks |
| 9 | Complete Analysis | 🎯 | Beginner | 6 | Full 360° analysis |

---

## 1. Quick Snapshot 📷

**Category:** Beginner | **Cards:** 2

Get a quick overview of any stock with key metrics.

### Flow Diagram
```
┌─────────────────────┐
│   Stock Snapshot    │ ← Entry point
│     (overview)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Valuation Summary   │ ← Quick valuation check
│      (value)        │
└─────────────────────┘
```

### Cards Involved

| Order | Card ID | Card Name | Category | Purpose |
|-------|---------|-----------|----------|---------|
| 1 | `stock-snapshot` | Stock Snapshot | Overview | Company info, price, day stats, key levels |
| 2 | `valuation-summary` | Valuation Summary | Value | P/E, P/B, P/S multiples with peer comparison |

### Data Flow
- **Input:** Stock symbol
- **Output:** Price overview → Valuation assessment

---

## 2. Value Investor 💎

**Category:** Value | **Cards:** 4

Warren Buffett style analysis - intrinsic value, margin of safety, quality.

### Flow Diagram
```
┌─────────────────────┐
│ Fair Value Forecaster│ ← DCF projection
│      (value)         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Piotroski F-Score  │ ← Quality check
│      (value)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    DCF Valuation    │ ← Detailed DCF model
│      (value)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│Intrinsic Value Range│ ← Combined valuation
│      (value)        │
└─────────────────────┘
```

### Cards Involved

| Order | Card ID | Card Name | Category | Purpose |
|-------|---------|-----------|----------|---------|
| 1 | `fair-value-forecaster` | Fair Value Forecaster | Value | DCF-based intrinsic value with probability fans |
| 2 | `piotroski-score` | Piotroski F-Score | Value | 9-point fundamental health check |
| 3 | `dcf-valuation` | DCF Valuation | Value | Full discounted cash flow model |
| 4 | `intrinsic-value-range` | Intrinsic Value Range | Value | Multi-model value range (Graham, DCF, EPV) |

### Data Flow
- **Input:** Stock symbol
- **Output:** Fair value estimate → Quality score → DCF details → Composite value range with margin of safety

---

## 3. Margin of Safety 🛡️

**Category:** Value | **Cards:** 4 | **Structure:** Diamond (fan-out, fan-in)

Find undervalued stocks with strong fundamentals.

### Flow Diagram
```
         ┌─────────────────────┐
         │ Valuation Summary   │ ← Starting point
         │      (value)        │
         └──────────┬──────────┘
                    │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
┌─────────────────┐  ┌─────────────────┐
│   Fair Value    │  │Bankruptcy Health│
│    (value)      │  │     (risk)      │
└────────┬────────┘  └────────┬────────┘
          │                 │
          └────────┬────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │Multi-Factor Scorecard│ ← Confluence
         │       (value)        │
         └─────────────────────┘
```

### Cards Involved

| Order | Card ID | Card Name | Category | Purpose |
|-------|---------|-----------|----------|---------|
| 1 | `valuation-summary` | Valuation Summary | Value | Multi-metric valuation dashboard |
| 2a | `fair-value-forecaster` | Fair Value | Value | Intrinsic value estimate |
| 2b | `bankruptcy-health` | Bankruptcy Health | Risk | Altman Z-Score (financial safety) |
| 3 | `multi-factor-scorecard` | Multi-Factor Scorecard | Value | Combined quality score |

### Data Flow
- **Input:** Stock symbol
- **Output:** Valuation multiples → (Fair value + Financial safety) → Composite score
- **Logic:** Only proceed if both value AND safety checks pass

---

## 4. Growth Hunter 🚀

**Category:** Growth | **Cards:** 3

Find high-growth companies with sustainable momentum.

### Flow Diagram
```
┌─────────────────────┐
│   Growth Summary    │ ← Growth metrics
│      (growth)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Earnings Quality   │ ← Quality check
│      (growth)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  DuPont Analysis    │ ← ROE breakdown
│      (value)        │
└─────────────────────┘
```

### Cards Involved

| Order | Card ID | Card Name | Category | Purpose |
|-------|---------|-----------|----------|---------|
| 1 | `growth-summary` | Growth Summary | Growth | Revenue, EPS, margin trends & CAGR |
| 2 | `earnings-quality` | Earnings Quality | Growth | Beneish M-Score, accruals, cash conversion |
| 3 | `dupont-analysis` | DuPont Analysis | Value | ROE decomposition (margin × turnover × leverage) |

### Data Flow
- **Input:** Stock symbol
- **Output:** Growth rates → Earnings sustainability → Profitability drivers
- **Logic:** High growth + High quality + Healthy ROE = Strong pick

---

## 5. Technical Deep Dive 📊

**Category:** Technical | **Cards:** 4 | **Structure:** Diamond

Complete technical analysis with patterns, indicators, and levels.

### Flow Diagram
```
         ┌─────────────────────┐
         │  Candlestick Hero   │ ← Price chart
         │    (technical)      │
         └──────────┬──────────┘
                    │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
┌─────────────────┐  ┌─────────────────┐
│ Pattern Matcher │  │Technical Indicators│
│   (technical)   │  │   (technical)    │
└────────┬────────┘  └────────┬────────┘
          │                 │
          └────────┬────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │   Trend Strength    │ ← ADX analysis
         │    (technical)      │
         └─────────────────────┘
```

### Cards Involved

| Order | Card ID | Card Name | Category | Purpose |
|-------|---------|-----------|----------|---------|
| 1 | `candlestick-hero` | Candlestick Hero | Technical | Interactive OHLCV chart with overlays |
| 2a | `pattern-matcher` | Pattern Matcher | Technical | Detect chart patterns (H&S, flags, triangles) |
| 2b | `technical-indicators` | Technical Indicators | Technical | RSI, MACD, Bollinger, Stochastic |
| 3 | `trend-strength` | Trend Strength | Technical | ADX, +DI/-DI, trend direction |

### Data Flow
- **Input:** Stock symbol
- **Output:** Price action → (Patterns + Indicators) → Trend confirmation
- **Logic:** Patterns align with indicators + Strong trend = High confidence signal

---

## 6. Swing Trader 🎢

**Category:** Technical | **Cards:** 3

Find swing trading opportunities with momentum and volatility.

### Flow Diagram
```
┌─────────────────────┐
│Technical Indicators │ ← Entry signals
│    (technical)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Drawdown & VaR    │ ← Risk sizing
│      (risk)         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Trade Expectancy    │ ← Edge calculation
│      (risk)         │
└─────────────────────┘
```

### Cards Involved

| Order | Card ID | Card Name | Category | Purpose |
|-------|---------|-----------|----------|---------|
| 1 | `technical-indicators` | Technical Indicators | Technical | RSI, MACD for entry timing |
| 2 | `drawdown-var` | Drawdown & VaR | Risk | Max drawdown, VaR, position sizing |
| 3 | `trade-expectancy` | Trade Expectancy | Risk | Win rate, R-multiple, break-even analysis |

### Data Flow
- **Input:** Stock symbol
- **Output:** Entry signals → Risk metrics → Expected value per trade
- **Logic:** Good signal + Acceptable risk + Positive expectancy = Take trade

---

## 7. Risk Assessment ⚠️

**Category:** Risk | **Cards:** 4 | **Structure:** Diamond

Comprehensive risk analysis before investing.

### Flow Diagram
```
         ┌─────────────────────┐
         │ Risk Health Dashboard│ ← Overall risk
         │       (risk)         │
         └──────────┬──────────┘
                    │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
┌─────────────────┐  ┌─────────────────┐
│Bankruptcy Health│  │ Leverage History│
│     (risk)      │  │     (risk)      │
└────────┬────────┘  └────────┬────────┘
          │                 │
          └────────┬────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │Financial Stress Radar│ ← Deep dive
         │       (risk)         │
         └─────────────────────┘
```

### Cards Involved

| Order | Card ID | Card Name | Category | Purpose |
|-------|---------|-----------|----------|---------|
| 1 | `risk-health-dashboard` | Risk Health Dashboard | Risk | Overall risk score, position sizing |
| 2a | `bankruptcy-health` | Bankruptcy Health | Risk | Altman Z-Score, zone classification |
| 2b | `leverage-history` | Leverage History | Risk | Debt-to-equity trends, interest coverage |
| 3 | `financial-stress-radar` | Financial Stress Radar | Risk | Early warning indicators |

### Data Flow
- **Input:** Stock symbol
- **Output:** Risk overview → (Bankruptcy + Leverage checks) → Stress indicators
- **Logic:** All risk checks must be green before investing

---

## 8. Dividend Investor 💰

**Category:** Income | **Cards:** 3

Find sustainable dividend stocks with growth potential.

### Flow Diagram
```
┌─────────────────────┐
│ Dividend Crystal Ball│ ← Yield & growth
│      (income)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Income Stability   │ ← Payout safety
│      (income)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│Cashflow Stability   │ ← Sustainability
│      (risk)         │
└─────────────────────┘
```

### Cards Involved

| Order | Card ID | Card Name | Category | Purpose |
|-------|---------|-----------|----------|---------|
| 1 | `dividend-crystal-ball` | Dividend Crystal Ball | Income | Dividend projection, yield on cost |
| 2 | `income-stability` | Income Stability | Income | Payout ratio, dividend safety score |
| 3 | `cashflow-stability-index` | Cashflow Stability | Risk | OCF/FCF volatility, sustainability |

### Data Flow
- **Input:** Stock symbol
- **Output:** Dividend forecast → Payout sustainability → Cash backing
- **Logic:** Good yield + Safe payout + Stable cash flow = Reliable income

---

## 9. Complete Analysis 🎯

**Category:** Beginner | **Cards:** 6 | **Structure:** Complex tree

Full 360° analysis covering value, growth, risk, and technicals.

### Flow Diagram
```
                    ┌─────────────────────┐
                    │   Stock Snapshot    │ ← Overview
                    │     (overview)      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
    ┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
    │   Fair Value    │ │   Growth    │ │  Risk Health    │
    │    (value)      │ │  (growth)   │ │    (risk)       │
    └────────┬────────┘ └──────┬──────┘ └────────┬────────┘
              │                │                │
              │         ┌─────┴─────┐          │
              │         │           │          │
              ▼         ▼           ▼          ▼
        ┌─────────────────┐   ┌─────────────────┐
        │  Candlestick    │   │   Technical     │
        │     Hero        │   │   Indicators    │
        │  (technical)    │   │  (technical)    │
        └─────────────────┘   └─────────────────┘
```

### Cards Involved

| Order | Card ID | Card Name | Category | Purpose |
|-------|---------|-----------|----------|---------|
| 1 | `stock-snapshot` | Stock Snapshot | Overview | Company overview, price, key levels |
| 2a | `fair-value-forecaster` | Fair Value | Value | Intrinsic value estimate |
| 2b | `growth-summary` | Growth Summary | Growth | Revenue & earnings growth |
| 2c | `risk-health-dashboard` | Risk Health | Risk | Overall risk assessment |
| 3a | `candlestick-hero` | Candlestick Hero | Technical | Price chart (fed by Value + Growth) |
| 3b | `technical-indicators` | Technical Indicators | Technical | RSI, MACD (fed by Growth + Risk) |

### Data Flow
- **Input:** Stock symbol
- **Output:** Overview → (Value + Growth + Risk analysis) → Technical confirmation
- **Logic:** Complete picture across all dimensions before making decision

---

## Template Usage

### In the UI

1. Open **Workflow Builder** (`/#/workflow`)
2. Click **Templates** button in sidebar
3. Select a template from the list
4. Template nodes are auto-populated
5. Enter stock symbol in the first card
6. All downstream cards automatically receive the symbol

### Programmatic Access

```typescript
import { 
  WORKFLOW_TEMPLATES, 
  getTemplateById, 
  getTemplatesByCategory,
  searchTemplates 
} from '@/components/workflow-v3/templates';

// Get all templates
const allTemplates = WORKFLOW_TEMPLATES;

// Get specific template
const valueInvestor = getTemplateById('value-investor');

// Get templates by category
const technicalTemplates = getTemplatesByCategory('technical');

// Search templates
const results = searchTemplates('dividend');
```

---

## Card Usage Summary

| Card ID | Used In Templates |
|---------|-------------------|
| `stock-snapshot` | Quick Snapshot, Complete Analysis |
| `valuation-summary` | Quick Snapshot, Margin of Safety |
| `fair-value-forecaster` | Value Investor, Margin of Safety, Complete Analysis |
| `piotroski-score` | Value Investor |
| `dcf-valuation` | Value Investor |
| `intrinsic-value-range` | Value Investor |
| `bankruptcy-health` | Margin of Safety, Risk Assessment |
| `multi-factor-scorecard` | Margin of Safety |
| `growth-summary` | Growth Hunter, Complete Analysis |
| `earnings-quality` | Growth Hunter |
| `dupont-analysis` | Growth Hunter |
| `candlestick-hero` | Technical Deep Dive, Complete Analysis |
| `pattern-matcher` | Technical Deep Dive |
| `technical-indicators` | Technical Deep Dive, Swing Trader, Complete Analysis |
| `trend-strength` | Technical Deep Dive |
| `drawdown-var` | Swing Trader |
| `trade-expectancy` | Swing Trader |
| `risk-health-dashboard` | Risk Assessment, Complete Analysis |
| `leverage-history` | Risk Assessment |
| `financial-stress-radar` | Risk Assessment |
| `dividend-crystal-ball` | Dividend Investor |
| `income-stability` | Dividend Investor |
| `cashflow-stability-index` | Dividend Investor |

---

## Suggested Additional Templates

These templates could be added to cover more use cases:

### 10. Intraday Scalper
```
VWAP Analysis → Volume Profile → ORB Analysis → F&O Risk Advisor
```

### 11. IPO Analysis
```
Stock Snapshot → Valuation Summary → Shareholding Pattern → Institutional Flows
```

### 12. Earnings Play
```
Earnings Calendar → Earnings Surprise → Volatility Regime → Options Strategy
```

### 13. Sector Rotation
```
Narrative Theme Tracker → Institutional Flows → Momentum Heatmap → Delivery Analysis
```

### 14. Tax Harvesting
```
Portfolio Leaderboard → Tax Calculator → Drawdown & VaR → Rebalance Optimizer
```
