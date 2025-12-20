# Monomorph Markets OS

Professional-grade financial analytics platform with 79 analytical tools, visual workflow builder, and interactive learning center.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
cd apps/web && npm run dev

# Build for production
npm run build
```

## Features

### 🔗 Visual Workflow Builder
- Drag-and-drop analytics cards
- Connect tools to create analysis pipelines
- 15 pre-built workflow templates
- Auto-layout and keyboard shortcuts (Ctrl+Z undo, Ctrl+C/V copy-paste)
- Save and share workflows

### 📊 79 Analytics Tools
Organized into 13 categories:

| Category | Tools | Description |
|----------|-------|-------------|
| Value | 8 | DCF, Piotroski, Fair Value, DuPont Analysis |
| Growth | 8 | Earnings Quality, Management Quality, Sales-Profit-Cash |
| Technical | 20 | Pattern Matcher, Fibonacci, VWAP, Volume Profile |
| Risk | 9 | Drawdown VaR, Bankruptcy Health, Trade Expectancy |
| Cashflow | 3 | FCF Health, Cash Conversion Cycle |
| Income | 3 | Dividend Crystal Ball, Income Stability |
| Portfolio | 10 | Peer Comparison, Correlation, Tax Calculator |
| Macro | 9 | Earnings Calendar, Insider Trades, Sector Rotation |
| Derivatives | 2 | Options Strategy, Currency Dashboard |
| Commodities | 1 | MCX Dashboard |
| Mutual Funds | 3 | MF Explorer, Analyzer, Portfolio Optimizer |
| Mini Cards | 5 | Quick indicators (Altman-Graham, Sentiment Z-Score) |
| Overview | 1 | Stock Snapshot |

### 📈 Chart Studio
- Multi-chart workspace
- 20+ technical indicators
- Drawing tools
- Multiple timeframes

### 📚 Learning Center
- Interactive flashcards
- Quizzes with scoring
- Guided learning paths (Beginner → Advanced)
- Tool-specific education panels

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts, Lightweight Charts
- **Workflow**: React Flow
- **State**: Zustand (with localStorage persistence)

## Project Structure

```
monomorph/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── cards/          # 79 analytics cards
│   │   │   ├── components/
│   │   │   │   ├── workflow/   # Workflow builder
│   │   │   │   ├── learning/   # Learning components
│   │   │   │   ├── charts/     # Chart components
│   │   │   │   └── ui/         # Shared UI components
│   │   │   ├── pages/          # Route pages
│   │   │   ├── lib/            # Utilities & data
│   │   │   └── stores/         # Zustand stores
│   │   └── dist/               # Production build
│   └── server/                 # Mock API server
├── docs/                       # Documentation
└── packages/types/             # Shared TypeScript types
```

## Routes

| Route | Page |
|-------|------|
| `#/` | Landing Page |
| `#/workflow` | Workflow Builder |
| `#/charts` | Chart Studio |
| `#/explore` | Tool Explorer |
| `#/learn` | Learning Center |
| `#/ticker/{symbol}` | Full Stock Analysis |
| `#/settings` | User Settings |
| `#/profile` | User Profile |

## Design System

- **Colors**: Indigo/Purple primary, Teal accents, Slate backgrounds
- **Theme**: Dark mode optimized
- **Cards**: Category-colored left borders (4px accent)
- **Typography**: Clean, minimal formatting

## User Features

- **Onboarding**: 5-step profile setup (persona, experience, risk tolerance)
- **Watchlist**: Save and track stocks
- **Saved Workflows**: Persist custom analysis pipelines
- **Learning Progress**: Track flashcard and quiz completion

## Development

```bash
# Run in development
cd apps/web && npm run dev

# Type check
npm run type-check

# Build
npm run build
```

## Documentation

- `/docs/TOOL_REFERENCE.md` - Complete tool documentation
- `/docs/WORKFLOW_TEMPLATES.md` - Pre-built template details
- `/docs/LEARNING_CURRICULUM.md` - Learning path content
- `/docs/CARD_OUTPUT_GUIDE.md` - Card output specifications

## License

MIT
