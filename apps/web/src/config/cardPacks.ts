export interface CardPack {
  id: string;
  label: string;
  description: string;
  toolIds: string[];
}

/**
 * Card packs are just different "views" on the same cards.
 * You can adjust toolIds to better fit each investing style.
 */
export const CARD_PACKS: CardPack[] = [
  {
    id: 'value',
    label: 'Value Pack',
    description: 'Valuation, Piotroski, DuPont, DCF, and quality metrics.',
    toolIds: [
      'fair-value-forecaster',
      'piotroski-score-analytics',
      'dupont-analysis-analytics',
      'dcf-valuation-analytics',
    ],
  },
  {
    id: 'growth',
    label: 'Growth Pack',
    description: 'Revenue growth, quarterly results, and sector momentum.',
    toolIds: [
      'quarterly-results-analytics',
      'sector-insights-analytics',
    ],
  },
  {
    id: 'risk',
    label: 'Risk Pack',
    description: 'Drawdowns, VAR, volatility, correlation, and institutional flows.',
    toolIds: [
      'risk-health-dashboard',
      'drawdown-var-analytics',
      'portfolio-correlation-analytics',
      'institutional-flows-analytics',
    ],
  },
  {
    id: 'income',
    label: 'Income Pack',
    description: 'Dividends, payout stability, and macro calendar for income investors.',
    toolIds: [
      'dividend-sip-tracker-analytics',
      'macro-calendar-analytics',
    ],
  },
];
