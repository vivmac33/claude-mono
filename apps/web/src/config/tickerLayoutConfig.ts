import { toolsRegistry } from '../registry/toolsRegistry';

// Explicit hero cards (by id) that should appear in the top row on the ticker view.
// You can tweak this list freely without changing any component code.
export const TICKER_HERO_TOOL_IDS: string[] = [
  'fair-value-forecaster',
  'candlestick-hero-spy',
];

// All other card-type tools appear in the main grid automatically.
export const TICKER_GRID_TOOL_IDS: string[] = toolsRegistry
  .filter(
    (t) =>
      t.kind === 'card' && !TICKER_HERO_TOOL_IDS.includes(t.id)
  )
  .map((t) => t.id);
