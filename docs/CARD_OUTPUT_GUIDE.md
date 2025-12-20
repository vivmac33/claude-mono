# Card Output Implementation Guide

## Overview

This guide explains how to add `getOutput()` to cards that don't yet have it. The goal is for every card to produce a standardized `CardOutput` that the synthesis engine can use to combine insights from multiple cards.

## Current Status

**Implemented (6 cards):**
- `stock-snapshot` (overview)
- `valuation-summary` (value)
- `piotroski-score` (value)
- `growth-summary` (growth)
- `risk-health-dashboard` (risk)
- `candlestick-hero` (technical)

**Remaining: 63 cards**

## Implementation Pattern

### Step 1: Add Imports

At the top of the card file, add:

```typescript
import {
  CardOutput,
  MetricValue,
  Insight,
  createMetric,
  createInsight,
  MetricInterpretation,
  SignalStrength,
} from "@/types/card-output";
```

### Step 2: Create the getOutput Function

Add the function after the data interface, before the Props interface:

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// GET OUTPUT - Standardized output for synthesis engine
// ═══════════════════════════════════════════════════════════════════════════

export function get[CardName]Output(data: [CardName]Data): CardOutput {
  const { symbol, asOf, /* ...destructure other fields */ } = data;
  
  // Build key metrics (6-8 most important)
  const keyMetrics: MetricValue[] = [
    createMetric("Metric Name", "metric_key", value, interpretation, {
      format: "number" | "currency" | "percent" | "ratio" | "score",
      priority: 1 | 2 | 3,
      // Optional:
      unit: "x" | "%" | "₹",
      benchmark: { value: 100, label: "Avg", comparison: "above" | "below" },
      trend: { direction: "up" | "down" | "flat", period: "YoY", change: 5 },
    }),
    // ... more metrics
  ];
  
  // Build insights (interpretive statements)
  const insights: Insight[] = [];
  
  // Add main insight based on verdict/status
  insights.push(createInsight(
    "strength" | "weakness" | "opportunity" | "risk" | "observation",
    "Human-readable insight text",
    1 | 2 | 3, // importance
    ["metric_key1", "metric_key2"] // supporting metrics (optional)
  ));
  
  // Add conditional insights based on data
  if (someCondition) {
    insights.push(createInsight("opportunity", "...", 2));
  }
  
  // Determine suggested next cards
  const suggestedCards = condition
    ? ["card-id-1", "card-id-2"]
    : ["card-id-3", "card-id-4"];
  
  // Build headline (one sentence summary)
  const headline = `${symbol} shows [key finding] with [key metric]`;
  
  return {
    cardId: "card-id",
    cardCategory: "value" | "growth" | "risk" | "technical" | etc,
    symbol,
    asOf,
    headline,
    sentiment: "bullish" | "bearish" | "neutral" | "mixed",
    confidence: "high" | "medium" | "low",
    signalStrength: 1 | 2 | 3 | 4 | 5,
    keyMetrics,
    insights,
    primaryChart: {
      type: "radar" | "bar" | "line" | "gauge" | etc,
      title: "Chart Title",
      data: chartData,
    },
    suggestedCards,
    tags: ["tag1", "tag2"],
    scoreContribution: {
      category: "valuation" | "quality" | "growth" | "momentum" | "risk",
      score: 0-100,
      weight: 0-1,
    },
  };
}
```

### Step 3: Register the Function

In `registry/cardOutputRegistry.ts`:

1. Add the import:
```typescript
import { get[CardName]Output, [CardName]Data } from "@/cards/[category]/[card-name]";
```

2. Add to the registry:
```typescript
export const cardOutputRegistry: Record<string, GetOutputFn> = {
  // ...existing entries
  "[card-id]": get[CardName]Output,
};
```

## Key Principles

### 1. Metric Priority
- **Priority 1**: Primary metrics that define the card's main insight
- **Priority 2**: Important supporting metrics
- **Priority 3**: Additional context metrics

### 2. Interpretation Values
```typescript
// Quality scale
"excellent" | "good" | "fair" | "poor" | "critical"

// Valuation scale
"undervalued" | "fairly-valued" | "overvalued"

// Directional
"bullish" | "bearish" | "neutral"

// Risk scale
"safe" | "moderate" | "risky" | "dangerous"

// Trend scale
"strong" | "weak" | "improving" | "deteriorating"
```

### 3. Insight Types
```typescript
"strength"     // Positive factor
"weakness"     // Negative factor
"opportunity"  // Potential upside
"risk"         // Potential downside
"observation"  // Neutral fact
"action"       // Suggested next step
```

### 4. Score Contribution
The `scoreContribution` field helps the synthesis engine calculate an overall score:
- **category**: Which aspect this card contributes to
- **score**: 0-100 (higher is better)
- **weight**: 0-1 (how much influence this card has)

Typical weights:
- Valuation: 0.25
- Quality (Piotroski, etc): 0.20
- Growth: 0.20
- Momentum/Technical: 0.15
- Risk: 0.15
- Income: 0.05

## Examples by Category

### Value Cards
Focus on: multiples, fair value, quality scores
Sentiment: based on undervalued/overvalued
Signal: based on margin of safety

### Growth Cards
Focus on: growth rates, trends, estimates
Sentiment: based on growth tier/trajectory
Signal: based on growth consistency

### Risk Cards
Focus on: risk scores, alerts, thresholds
Sentiment: INVERSE (low risk = bullish)
Signal: INVERSE (low risk = strong signal)

### Technical Cards
Focus on: price, momentum, patterns
Sentiment: based on trend direction
Signal: based on confirmation (volume, multiple indicators)

### Income Cards
Focus on: yield, sustainability, growth
Sentiment: based on dividend health
Signal: based on payout safety

## Testing

After implementing:
1. Import the function in a test file
2. Pass mock data
3. Verify output structure matches CardOutput interface
4. Check insights make logical sense
5. Verify sentiment/signalStrength calculations

## Checklist

- [ ] Import CardOutput types
- [ ] Create getOutput function
- [ ] Export function from card file
- [ ] Add to cardOutputRegistry
- [ ] Test with mock data
- [ ] Update implementation status in this doc
