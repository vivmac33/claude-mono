/**
 * MONOMORPH LEARNING CURRICULUM - PART 2
 * Remaining modules: Macro, Portfolio, Derivatives, Mutual Funds, Commodities, Overview, Mini
 */

import { ModuleDefinition, LessonDefinition, MetricDefinition } from './curriculum';

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 6: MACRO & MARKET INTELLIGENCE
// ═══════════════════════════════════════════════════════════════════════════

export const macroModule: ModuleDefinition = {
  id: 'macro',
  name: 'Macro & Market Intelligence',
  icon: '🌐',
  description: 'Track institutional flows, insider activity, shareholding patterns, and market-wide events.',
  prerequisites: [],
  learningOutcomes: [
    'Follow smart money through FII/DII flows',
    'Interpret insider trading signals',
    'Track shareholding pattern changes',
    'Use economic calendars for timing'
  ],
  lessons: [
    // ─────────────────────────────────────────────────────────────────────
    // LESSON: Institutional Flows
    // ─────────────────────────────────────────────────────────────────────
    {
      toolId: 'institutional-flows',
      toolName: 'Institutional Flows',
      category: 'macro',
      difficulty: 'beginner',
      duration: '7 min',
      summary: 'Track FII and DII buying/selling patterns to understand smart money positioning.',
      whatYouLearn: [
        'FII vs DII flow interpretation',
        'Correlation with market movements',
        'Using flows for market timing'
      ],
      whyItMatters: 'FIIs move markets. When they buy aggressively, markets rise. Their flows are leading indicators.',
      metrics: [
        {
          id: 'fii_net_flow',
          name: 'FII Net Flow',
          formula: 'FII Buys - FII Sells (₹ Cr)',
          description: 'Net buying or selling by Foreign Institutional Investors.',
          interpretation: {
            excellent: '> ₹2000 Cr/day: Strong buying, very bullish',
            good: '₹500-2000 Cr: Moderate buying',
            fair: '-₹500 to +₹500 Cr: Neutral',
            poor: '-₹500 to -₹2000 Cr: Selling pressure',
            dangerous: '< -₹2000 Cr/day: Heavy selling, bearish'
          },
          indianContext: 'FIIs own ~20% of NSE market cap. Their flows directly impact Nifty. 2022 saw record outflows of ₃.5L Cr.',
          relatedMetrics: ['dii_net_flow', 'market_direction'],
          commonMistakes: [
            'Single day flows are noisy. Look at 5-day or monthly trends.',
            'FII selling doesnt always mean market fall if DII absorbs.'
          ]
        },
        {
          id: 'dii_net_flow',
          name: 'DII Net Flow',
          formula: 'DII Buys - DII Sells (₹ Cr)',
          description: 'Net buying or selling by Domestic Institutional Investors (MFs, insurance, etc).',
          interpretation: {
            excellent: '> ₹2000 Cr/day: Strong domestic support',
            good: '₹500-2000 Cr: Healthy buying',
            fair: '-₹500 to +₹500 Cr: Neutral',
            poor: '< -₹500 Cr: Unusual selling'
          },
          indianContext: 'DIIs have grown significantly due to SIP flows (~₹15,000 Cr/month). They often counter FII selling.',
          relatedMetrics: ['fii_net_flow', 'sip_flows']
        },
        {
          id: 'flow_ratio',
          name: 'FII/DII Ratio',
          formula: 'FII Net Flow / DII Net Flow',
          description: 'Relative positioning of foreign vs domestic institutions.',
          interpretation: {
            excellent: 'Both buying: Strongest bull signal',
            good: 'FII buying, DII neutral: Bullish',
            fair: 'FII selling, DII buying: Tug of war',
            poor: 'Both selling: Rare, very bearish'
          }
        },
        {
          id: 'cumulative_flow',
          name: 'Monthly Cumulative Flow',
          description: 'Total net flow over the month.',
          interpretation: {
            excellent: '> ₹20,000 Cr: Strong monthly inflow',
            good: '₹5,000-20,000 Cr: Positive month',
            fair: '-₹5,000 to +₹5,000 Cr: Flat',
            poor: '< -₹10,000 Cr: Significant outflow'
          }
        }
      ],
      practicalExample: `December 2024 Flow Analysis:
- FII: -₃12,000 Cr (selling)
- DII: +₹18,000 Cr (absorbing)
- Net: -₹14,000 Cr
- Market: Nifty down 2%

DIIs absorbed most FII selling, limiting damage. Without DII support, correction would have been 5-7%.`,
      actionableInsights: [
        'FII buying + DII buying = strongest bull phase',
        'FII selling absorbed by DII = consolidation, not crash',
        'Sustained FII outflows (>₹10K Cr/week) = reduce exposure',
        'Track monthly patterns, not daily noise'
      ],
      commonQuestions: [
        { q: 'Why do FIIs sell?', a: 'Global risk-off, dollar strength, better opportunities elsewhere, or India-specific concerns.' },
        { q: 'Can retail beat institutions?', a: 'Not by timing. But institutions are forced sellers sometimes, creating retail opportunities.' },
        { q: 'Where to get this data?', a: 'NSE website daily, moneycontrol, NSDL for detailed FPI data.' }
      ],
      nextTools: ['shareholding-pattern', 'insider-trades', 'macro-pulse']
    },

    // ─────────────────────────────────────────────────────────────────────
    // LESSON: Shareholding Pattern
    // ─────────────────────────────────────────────────────────────────────
    {
      toolId: 'shareholding-pattern',
      toolName: 'Shareholding Pattern',
      category: 'macro',
      difficulty: 'beginner',
      duration: '6 min',
      summary: 'Track ownership breakdown between promoters, FIIs, DIIs, and retail.',
      whatYouLearn: [
        'Reading quarterly shareholding disclosures',
        'Identifying accumulation/distribution',
        'Ownership quality assessment'
      ],
      whyItMatters: 'Who owns the stock tells you about conviction levels. Rising institutional ownership is bullish.',
      metrics: [
        {
          id: 'promoter_holding',
          name: 'Promoter Holding %',
          description: 'Ownership by founders/promoters.',
          interpretation: {
            excellent: '> 60%: High conviction, aligned interests',
            good: '50-60%: Good ownership',
            fair: '35-50%: Moderate',
            poor: '< 35%: Low promoter stake'
          },
          indianContext: 'MNCs: 50-75%. Family businesses: 50-70%. Widely held (HDFC Bank): 20-30%.',
          relatedMetrics: ['promoter_pledge', 'promoter_change'],
          commonMistakes: ['Low promoter holding in widely-held companies is normal, not concerning.']
        },
        {
          id: 'fii_holding',
          name: 'FII Holding %',
          description: 'Foreign institutional ownership.',
          interpretation: {
            excellent: '> 30%: High foreign interest',
            good: '15-30%: Good institutional participation',
            fair: '5-15%: Moderate',
            poor: '< 5%: Low foreign interest'
          },
          indianContext: 'FII limits exist in some sectors (banking, insurance). Check if at limit.',
          commonMistakes: ['FII at limit cant buy more - upside capped from this source.']
        },
        {
          id: 'dii_holding',
          name: 'DII Holding %',
          description: 'Domestic institutional (MF, insurance) ownership.',
          interpretation: {
            excellent: '> 25%: Strong domestic institutional support',
            good: '15-25%: Good DII participation',
            fair: '5-15%: Moderate',
            poor: '< 5%: Low DII interest'
          },
          indianContext: 'MF holdings via AMC disclosures. Rising MF holding = SIP-driven accumulation.'
        },
        {
          id: 'retail_holding',
          name: 'Retail Holding %',
          description: 'Public/retail investor ownership.',
          interpretation: {
            excellent: '15-30%: Healthy retail participation',
            fair: '30-50%: High retail, more volatile',
            poor: '> 50%: Retail dominated, risky'
          },
          indianContext: 'High retail = more volatility. These stocks swing more on sentiment.'
        },
        {
          id: 'holding_change',
          name: 'Quarterly Change',
          description: 'How ownership shifted this quarter.',
          interpretation: {
            excellent: 'FII + DII increasing: Strong accumulation',
            good: 'One increasing, other stable: Positive',
            fair: 'No change: Holding pattern',
            poor: 'FII + DII decreasing: Distribution'
          }
        }
      ],
      actionableInsights: [
        'Rising FII + DII = smart money accumulating',
        'Falling promoter (not pledge) + rising institutions = healthy transition',
        'Sudden large stake = block deal, check who bought',
        'Compare QoQ changes, not just absolute levels'
      ],
      commonQuestions: [
        { q: 'Promoter selling - always bad?', a: 'Not always. PE exit, diversification, or estate planning can be benign.' },
        { q: 'How to find this data?', a: 'BSE/NSE corporate filings, screener.in, trendlyne - updated quarterly.' }
      ],
      nextTools: ['institutional-flows', 'insider-trades', 'management-quality']
    },

    // ─────────────────────────────────────────────────────────────────────
    // LESSON: Insider Trades
    // ─────────────────────────────────────────────────────────────────────
    {
      toolId: 'insider-trades',
      toolName: 'Insider Trades',
      category: 'macro',
      difficulty: 'intermediate',
      duration: '6 min',
      summary: 'Track buying and selling by company insiders - directors, executives, promoters.',
      whatYouLearn: [
        'Reading SAST disclosures',
        'Distinguishing meaningful vs routine trades',
        'Cluster buying/selling signals'
      ],
      whyItMatters: 'Insiders know their company best. Their buying, especially clusters, often precedes good news.',
      metrics: [
        {
          id: 'insider_net_activity',
          name: 'Net Insider Activity',
          description: 'Total insider buys minus sells.',
          interpretation: {
            excellent: 'Multiple insiders buying: Very bullish',
            good: 'Net buying by key executives: Positive',
            fair: 'Mixed or neutral: No signal',
            poor: 'Multiple insiders selling: Concerning'
          },
          indianContext: 'SEBI requires disclosure within 2 days of trade. Track via BSE/NSE.',
          commonMistakes: [
            'ESOP exercises look like buys but arent voluntary',
            'Small trades by junior staff are noise'
          ]
        },
        {
          id: 'buy_significance',
          name: 'Buy Significance',
          formula: 'Buy Amount / Insider Annual Compensation',
          description: 'How meaningful is the purchase relative to their income.',
          interpretation: {
            excellent: '> 100% of salary: Very significant conviction',
            good: '25-100%: Meaningful',
            fair: '< 25%: Token purchase',
            poor: 'Sells > Buys: Net negative'
          }
        },
        {
          id: 'cluster_activity',
          name: 'Cluster Detection',
          description: 'Multiple insiders trading in same direction.',
          interpretation: {
            excellent: '3+ insiders buying within 30 days: Strong signal',
            good: '2 insiders buying: Positive',
            fair: 'Single insider: Weaker signal',
            poor: 'Cluster selling: Negative'
          },
          indianContext: 'Promoter buying at market price (not preferential) is strongest signal.'
        }
      ],
      actionableInsights: [
        'Promoter open market buy = strongest bullish signal',
        'CFO/CEO buying > director buying (they know more)',
        'Cluster buying (3+) within month = high conviction',
        'Ignore routine ESOP exercises'
      ],
      commonQuestions: [
        { q: 'Insider sold but stock went up?', a: 'Selling for personal reasons (tax, diversification) doesnt mean bearish view.' },
        { q: 'Where to track insider trades?', a: 'BSE insider trading section, NSE SAST filings, Trendlyne insider tracking.' }
      ],
      nextTools: ['shareholding-pattern', 'management-quality', 'institutional-flows']
    },

    // ─────────────────────────────────────────────────────────────────────
    // LESSON: Earnings Calendar
    // ─────────────────────────────────────────────────────────────────────
    {
      toolId: 'earnings-calendar',
      toolName: 'Earnings Calendar',
      category: 'macro',
      difficulty: 'beginner',
      duration: '4 min',
      summary: 'Track upcoming earnings announcements and board meetings.',
      whatYouLearn: [
        'Earnings season timing',
        'Pre-earnings positioning',
        'Post-earnings drift'
      ],
      whyItMatters: 'Earnings drive stock prices. Knowing when results come helps plan entries/exits.',
      metrics: [
        {
          id: 'days_to_earnings',
          name: 'Days to Earnings',
          description: 'Trading days until next results.',
          interpretation: {
            excellent: '> 30 days: Time to analyze and position',
            fair: '7-30 days: Building expectations',
            poor: '< 7 days: High IV, risky to initiate'
          }
        },
        {
          id: 'expected_date',
          name: 'Expected Announcement Date',
          description: 'When results are likely to be declared.',
          interpretation: {
            excellent: 'Confirmed date from exchange',
            fair: 'Estimated from historical pattern',
            poor: 'Unknown'
          },
          indianContext: 'Indian companies announce 15-45 days after quarter end. IT first, banks mid, PSUs last.'
        },
        {
          id: 'historical_reaction',
          name: 'Historical Earnings Reaction',
          description: 'How stock typically moves on results.',
          interpretation: {
            excellent: 'Usually gaps up on results',
            fair: 'Mixed reactions',
            poor: 'Usually gaps down'
          }
        }
      ],
      actionableInsights: [
        'Avoid initiating F&O positions < 7 days before results',
        'Post-earnings drift: momentum continues 5-10 days',
        'Beat expectations + raise guidance = strongest reaction'
      ],
      nextTools: ['earnings-surprise', 'earnings-stability', 'options-interest']
    },

    // ─────────────────────────────────────────────────────────────────────
    // LESSON: Earnings Surprise
    // ─────────────────────────────────────────────────────────────────────
    {
      toolId: 'earnings-surprise',
      toolName: 'Earnings Surprise',
      category: 'macro',
      difficulty: 'intermediate',
      duration: '6 min',
      summary: 'Analyze historical earnings beats/misses and their price impact.',
      whatYouLearn: [
        'Beat/miss patterns',
        'Surprise magnitude analysis',
        'Post-earnings drift trading'
      ],
      whyItMatters: 'Companies that consistently beat tend to continue. Surprise patterns are tradeable.',
      metrics: [
        {
          id: 'beat_rate',
          name: 'Beat Rate',
          formula: 'Quarters Beating / Total Quarters × 100',
          description: 'How often the company exceeds estimates.',
          interpretation: {
            excellent: '> 75%: Consistent beater',
            good: '60-75%: Usually beats',
            fair: '40-60%: In line',
            poor: '< 40%: Frequent misses'
          },
          indianContext: 'Quality managements guide conservatively. TCS, HDFC Bank beat 80%+ of quarters.'
        },
        {
          id: 'avg_surprise',
          name: 'Average Surprise %',
          formula: '(Actual - Estimate) / Estimate × 100',
          description: 'Typical magnitude of beat/miss.',
          interpretation: {
            excellent: '> 5% avg beat: Significant outperformance',
            good: '2-5% avg beat: Modest beats',
            fair: '-2% to +2%: In line',
            poor: '> 5% avg miss: Persistent disappointment'
          }
        },
        {
          id: 'post_earnings_drift',
          name: 'Post-Earnings Drift',
          description: 'Price movement 5-20 days after results.',
          interpretation: {
            excellent: 'Beat → continues higher: Momentum',
            fair: 'Beat → flat: Priced in',
            poor: 'Beat → falls: Sell the news'
          }
        }
      ],
      actionableInsights: [
        'Buy high beat-rate stocks before results (if IV reasonable)',
        'Post-earnings drift lasts 5-20 days - trade the momentum',
        'Guidance matters more than the beat itself'
      ],
      nextTools: ['earnings-calendar', 'earnings-stability', 'fair-value-forecaster']
    },

    // ─────────────────────────────────────────────────────────────────────
    // LESSON: Macro Calendar
    // ─────────────────────────────────────────────────────────────────────
    {
      toolId: 'macro-calendar',
      toolName: 'Macro Calendar',
      category: 'macro',
      difficulty: 'beginner',
      duration: '5 min',
      summary: 'Track economic events - RBI policy, GDP, inflation, global events.',
      whatYouLearn: [
        'Key economic indicators',
        'Event-driven trading setup',
        'Global-local linkages'
      ],
      whyItMatters: 'Macro events move markets. RBI policy, US Fed, elections create volatility and opportunity.',
      metrics: [
        {
          id: 'upcoming_events',
          name: 'Upcoming Events',
          description: 'Key events in next 30 days.',
          interpretation: {
            excellent: 'Clear calendar: Low event risk',
            fair: 'Moderate events: Plan around them',
            poor: 'Multiple high-impact events: Elevated risk'
          }
        },
        {
          id: 'event_impact',
          name: 'Event Impact Rating',
          description: 'Expected market impact of event.',
          interpretation: {
            excellent: 'High impact: RBI policy, Fed, elections',
            good: 'Medium: GDP, inflation, trade data',
            fair: 'Low: PMI, services data'
          },
          indianContext: 'RBI MPC (6x/year), Union Budget (Feb), US Fed (8x/year) are highest impact.'
        }
      ],
      actionableInsights: [
        'Reduce F&O exposure before RBI/Fed meetings',
        'Budget creates sector-specific opportunities',
        'US markets affect India next day - track overnight'
      ],
      nextTools: ['macro-pulse', 'volatility-regime', 'options-interest']
    },

    // ─────────────────────────────────────────────────────────────────────
    // LESSON: Macro Pulse
    // ─────────────────────────────────────────────────────────────────────
    {
      toolId: 'macro-pulse',
      toolName: 'Macro Pulse',
      category: 'macro',
      difficulty: 'intermediate',
      duration: '7 min',
      summary: 'Dashboard of key economic indicators and their trends.',
      whatYouLearn: [
        'Leading vs lagging indicators',
        'Economic cycle positioning',
        'Sector rotation implications'
      ],
      whyItMatters: 'Economic health drives corporate earnings. Understanding macro helps sector allocation.',
      metrics: [
        {
          id: 'gdp_growth',
          name: 'GDP Growth',
          description: 'Quarterly real GDP growth rate.',
          interpretation: {
            excellent: '> 7%: Strong growth',
            good: '5-7%: Healthy growth',
            fair: '3-5%: Moderate',
            poor: '< 3%: Slowdown'
          },
          indianContext: 'India potential growth 6-7%. Below this = underperformance. Above = overheating risk.'
        },
        {
          id: 'inflation_cpi',
          name: 'CPI Inflation',
          description: 'Consumer price inflation rate.',
          interpretation: {
            excellent: '2-4%: Goldilocks zone',
            good: '4-6%: Manageable, RBI comfort zone',
            fair: '6-7%: Elevated, rate hike risk',
            poor: '> 7%: High, policy tightening likely'
          },
          indianContext: 'RBI target 4% ± 2%. Persistent > 6% triggers rate hikes.'
        },
        {
          id: 'interest_rate',
          name: 'Repo Rate',
          description: 'RBI policy interest rate.',
          interpretation: {
            excellent: 'Rate cuts: Bullish for equities',
            fair: 'Rates stable: Neutral',
            poor: 'Rate hikes: Headwind for markets'
          },
          indianContext: 'Current repo ~6.5%. Each 25bps cut adds ~5% to Nifty historically.'
        },
        {
          id: 'pmi_manufacturing',
          name: 'Manufacturing PMI',
          description: 'Purchasing Managers Index - leading indicator.',
          interpretation: {
            excellent: '> 55: Strong expansion',
            good: '52-55: Moderate expansion',
            fair: '50-52: Marginal expansion',
            poor: '< 50: Contraction'
          }
        }
      ],
      actionableInsights: [
        'Rising GDP + falling inflation = best for equities',
        'Rate cut cycle starting = go long',
        'PMI falling below 50 = reduce cyclical exposure'
      ],
      nextTools: ['macro-calendar', 'market-regime-radar', 'institutional-flows']
    },

    // ─────────────────────────────────────────────────────────────────────
    // LESSON: Narrative Theme Tracker
    // ─────────────────────────────────────────────────────────────────────
    {
      toolId: 'narrative-theme',
      toolName: 'Narrative Theme Tracker',
      category: 'macro',
      difficulty: 'intermediate',
      duration: '6 min',
      summary: 'Track market themes and narratives driving sector rotations.',
      whatYouLearn: [
        'Identifying active themes',
        'Theme lifecycle stages',
        'Riding themes profitably'
      ],
      whyItMatters: 'Markets move on narratives - AI, EV, PLI, defense. Catching themes early multiplies returns.',
      metrics: [
        {
          id: 'theme_strength',
          name: 'Theme Strength',
          description: 'Current intensity of the theme.',
          interpretation: {
            excellent: '> 80: Peak interest, may be crowded',
            good: '60-80: Strong momentum',
            fair: '40-60: Building or fading',
            poor: '< 40: Weak or exhausted'
          }
        },
        {
          id: 'theme_stage',
          name: 'Theme Lifecycle Stage',
          description: 'Where the theme is in its cycle.',
          interpretation: {
            excellent: 'Early stage: Biggest gains ahead',
            good: 'Growth stage: Still has room',
            fair: 'Mature: Selectivity needed',
            poor: 'Decline: Avoid new entries'
          }
        },
        {
          id: 'theme_momentum',
          name: 'Theme Momentum',
          description: 'Is the theme accelerating or decelerating?',
          interpretation: {
            excellent: 'Accelerating: Add exposure',
            fair: 'Stable: Hold',
            poor: 'Decelerating: Reduce/exit'
          }
        }
      ],
      practicalExample: `Current Active Themes (Dec 2024):
1. AI/Data Centers (Strength: 85, Accelerating)
2. Defense/PSU (Strength: 70, Mature)
3. Green Energy (Strength: 65, Growth)
4. Real Estate (Strength: 55, Stable)

Action: New money → AI/Green Energy. Defense stocks may consolidate.`,
      actionableInsights: [
        'Best returns in early-to-growth stage themes',
        'Avoid crowded themes (strength > 85)',
        'Theme leaders outperform followers',
        'Themes last 6-24 months typically'
      ],
      nextTools: ['momentum-heatmap', 'institutional-flows', 'relative-rotation']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 7: PORTFOLIO MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

export const portfolioModule: ModuleDefinition = {
  id: 'portfolio',
  name: 'Portfolio Management',
  icon: '💼',
  description: 'Portfolio construction, rebalancing, correlation, and performance tracking.',
  prerequisites: ['value', 'risk'],
  learningOutcomes: [
    'Build diversified portfolios',
    'Monitor and rebalance effectively',
    'Track portfolio performance',
    'Manage position correlations'
  ],
  lessons: [
    {
      toolId: 'portfolio-correlation',
      toolName: 'Portfolio Correlation',
      category: 'portfolio',
      difficulty: 'intermediate',
      duration: '7 min',
      summary: 'Analyze how your holdings move together - key to real diversification.',
      whatYouLearn: [
        'Correlation coefficient interpretation',
        'Building truly diversified portfolios',
        'Hidden correlation risks'
      ],
      whyItMatters: 'Owning 10 highly correlated stocks = owning 1 stock with 10x risk. Correlation is real diversification.',
      metrics: [
        {
          id: 'correlation_matrix',
          name: 'Correlation Matrix',
          description: 'Pairwise correlations between all holdings.',
          interpretation: {
            excellent: '< 0.3: Low correlation, good diversification',
            good: '0.3-0.5: Moderate correlation',
            fair: '0.5-0.7: High correlation',
            poor: '> 0.7: Very high, essentially same bet'
          }
        },
        {
          id: 'avg_correlation',
          name: 'Average Portfolio Correlation',
          description: 'Mean correlation across all pairs.',
          interpretation: {
            excellent: '< 0.4: Well diversified',
            good: '0.4-0.5: Reasonably diversified',
            fair: '0.5-0.6: Concentrated',
            poor: '> 0.6: Poorly diversified'
          }
        },
        {
          id: 'diversification_ratio',
          name: 'Diversification Ratio',
          formula: 'Weighted avg volatility / Portfolio volatility',
          description: 'Benefit from diversification. Higher = better.',
          interpretation: {
            excellent: '> 1.5: Strong diversification benefit',
            good: '1.2-1.5: Good benefit',
            fair: '1.0-1.2: Limited benefit',
            poor: '< 1.0: No benefit (shouldnt happen)'
          }
        }
      ],
      actionableInsights: [
        'Add assets with correlation < 0.5 to existing holdings',
        'Same sector stocks often correlate > 0.7',
        'Gold, bonds have low/negative correlation with equities',
        'Correlations spike in crashes - diversification fails when needed most'
      ],
      nextTools: ['rebalance-optimizer', 'etf-comparator', 'drawdown-var']
    },

    {
      toolId: 'rebalance-optimizer',
      toolName: 'Rebalance Optimizer',
      category: 'portfolio',
      difficulty: 'intermediate',
      duration: '8 min',
      summary: 'Identify portfolio drift and get optimal rebalancing trades.',
      whatYouLearn: [
        'When to rebalance',
        'Tax-efficient rebalancing',
        'Drift tolerance setting'
      ],
      whyItMatters: 'Portfolios drift from targets. Systematic rebalancing sells high, buys low automatically.',
      metrics: [
        {
          id: 'portfolio_drift',
          name: 'Portfolio Drift',
          formula: 'Sum of |Actual % - Target %| / 2',
          description: 'How far portfolio has drifted from targets.',
          interpretation: {
            excellent: '< 3%: No rebalancing needed',
            good: '3-5%: Monitor',
            fair: '5-10%: Consider rebalancing',
            poor: '> 10%: Rebalance now'
          }
        },
        {
          id: 'rebalance_urgency',
          name: 'Rebalance Urgency',
          description: 'Priority level for rebalancing.',
          interpretation: {
            excellent: 'Low: Within tolerance',
            fair: 'Medium: Approaching threshold',
            poor: 'High: Outside tolerance'
          }
        },
        {
          id: 'tax_impact',
          name: 'Tax Impact',
          description: 'Estimated tax on rebalancing trades.',
          interpretation: {
            excellent: 'Minimal tax: Short-term < ₹1L or long-term',
            fair: 'Moderate: Some short-term gains',
            poor: 'High: Large short-term gains'
          },
          indianContext: 'LTCG > ₹1.25L taxed 12.5%. STCG at 20%. Factor tax into rebalancing decisions.'
        },
        {
          id: 'suggested_trades',
          name: 'Suggested Trades',
          description: 'Specific buy/sell to rebalance.',
          interpretation: {
            excellent: 'Few trades to reach target',
            fair: 'Multiple trades needed',
            poor: 'Major restructuring required'
          }
        }
      ],
      actionableInsights: [
        'Rebalance when drift > 5% or annually',
        'Use new inflows to rebalance (avoids selling)',
        'Tax loss harvesting during rebalancing saves taxes',
        'Set calendar reminder for quarterly review'
      ],
      nextTools: ['portfolio-correlation', 'tax-harvesting', 'portfolio-leaderboard']
    },

    {
      toolId: 'peer-comparison',
      toolName: 'Peer Comparison',
      category: 'portfolio',
      difficulty: 'beginner',
      duration: '6 min',
      summary: 'Compare a stock against its sector peers across multiple metrics.',
      whatYouLearn: [
        'Relative valuation assessment',
        'Identifying sector leaders',
        'Peer group selection'
      ],
      whyItMatters: 'Stocks dont exist in isolation. Understanding peer positioning reveals relative value.',
      metrics: [
        {
          id: 'rank_percentile',
          name: 'Peer Rank Percentile',
          description: 'Where the stock ranks among peers.',
          interpretation: {
            excellent: '> 80th: Top of peer group',
            good: '60-80th: Above average',
            fair: '40-60th: Middle of pack',
            poor: '< 40th: Below average'
          }
        },
        {
          id: 'valuation_vs_peers',
          name: 'Valuation vs Peers',
          description: 'P/E relative to sector average.',
          interpretation: {
            excellent: '< 0.8x peer avg: Discount',
            good: '0.8-1.0x: Slight discount',
            fair: '1.0-1.2x: In line or slight premium',
            poor: '> 1.2x: Premium, needs justification'
          }
        },
        {
          id: 'growth_vs_peers',
          name: 'Growth vs Peers',
          description: 'EPS growth relative to sector.',
          interpretation: {
            excellent: '> 1.5x peer avg: Growth leader',
            good: '1.0-1.5x: Above average',
            fair: '0.8-1.0x: In line',
            poor: '< 0.8x: Laggard'
          }
        },
        {
          id: 'quality_vs_peers',
          name: 'Quality vs Peers',
          description: 'ROE/ROIC relative to sector.',
          interpretation: {
            excellent: '> 1.3x peer avg: Quality leader',
            good: '1.0-1.3x: Above average',
            fair: '0.8-1.0x: Average',
            poor: '< 0.8x: Below average'
          }
        }
      ],
      actionableInsights: [
        'Best value: High quality at peer average valuation',
        'Avoid: Premium valuation with average quality',
        'Sector leaders often deserve 20-30% premium',
        'Compare within industry, not cross-sector'
      ],
      nextTools: ['valuation-summary', 'multi-factor-scorecard', 'growth-summary']
    },

    {
      toolId: 'portfolio-leaderboard',
      toolName: 'Portfolio Leaderboard',
      category: 'portfolio',
      difficulty: 'beginner',
      duration: '5 min',
      summary: 'Rank portfolio holdings by performance and contribution.',
      whatYouLearn: [
        'Attribution analysis basics',
        'Winner/loser identification',
        'Position performance tracking'
      ],
      whyItMatters: 'Know whats working and what isnt. Cut losers, let winners run is easier said than done.',
      metrics: [
        {
          id: 'holding_return',
          name: 'Holding Return %',
          description: 'Total return per position.',
          interpretation: {
            excellent: '> 50%: Star performer',
            good: '20-50%: Solid contributor',
            fair: '0-20%: Modest',
            poor: '< 0%: Losing position'
          }
        },
        {
          id: 'contribution',
          name: 'Portfolio Contribution',
          formula: 'Position Return × Weight',
          description: 'Impact on total portfolio return.',
          interpretation: {
            excellent: '> 5% contribution: Major driver',
            good: '2-5%: Significant contributor',
            fair: '0-2%: Minor contributor',
            poor: '< 0%: Drag on portfolio'
          }
        },
        {
          id: 'win_loss_ratio',
          name: 'Win/Loss Ratio',
          description: 'Winners vs losers in portfolio.',
          interpretation: {
            excellent: '> 2:1: Most positions winning',
            good: '1.5:1: Healthy ratio',
            fair: '1:1: Mixed results',
            poor: '< 1:1: More losers than winners'
          }
        }
      ],
      actionableInsights: [
        'Review bottom 3 positions regularly - cut or add?',
        'Top performers may need trimming if overweight',
        'Contribution matters more than individual return',
        'One big winner can offset many small losers'
      ],
      nextTools: ['rebalance-optimizer', 'trade-journal', 'drawdown-var']
    },

    {
      toolId: 'etf-comparator',
      toolName: 'ETF Comparator',
      category: 'portfolio',
      difficulty: 'beginner',
      duration: '5 min',
      summary: 'Compare ETFs by expense ratio, tracking error, and holdings overlap.',
      whatYouLearn: [
        'ETF selection criteria',
        'Hidden costs in ETFs',
        'Overlap analysis'
      ],
      whyItMatters: 'ETFs look similar but differ in costs, tracking, and liquidity. Small differences compound.',
      metrics: [
        {
          id: 'expense_ratio',
          name: 'Expense Ratio',
          description: 'Annual fee as % of AUM.',
          interpretation: {
            excellent: '< 0.1%: Very low cost (index ETFs)',
            good: '0.1-0.3%: Low cost',
            fair: '0.3-0.5%: Moderate',
            poor: '> 0.5%: High for passive'
          },
          indianContext: 'Nifty 50 ETFs: 0.03-0.10%. Nifty Next 50: 0.10-0.20%.'
        },
        {
          id: 'tracking_error',
          name: 'Tracking Error',
          description: 'Deviation from benchmark index.',
          interpretation: {
            excellent: '< 0.3%: Excellent tracking',
            good: '0.3-0.5%: Good',
            fair: '0.5-1.0%: Acceptable',
            poor: '> 1.0%: Poor tracking'
          }
        },
        {
          id: 'overlap_pct',
          name: 'Holdings Overlap %',
          description: 'Common holdings between two ETFs.',
          interpretation: {
            excellent: '< 20%: Different exposure, good diversification',
            fair: '20-50%: Some overlap',
            poor: '> 50%: Similar exposure, redundant'
          }
        },
        {
          id: 'liquidity',
          name: 'Trading Liquidity',
          description: 'Ease of buying/selling.',
          interpretation: {
            excellent: '> ₹10 Cr daily: Very liquid',
            good: '₹1-10 Cr: Good liquidity',
            fair: '₹10L-1 Cr: Moderate',
            poor: '< ₹10L: Illiquid, avoid'
          }
        }
      ],
      actionableInsights: [
        'For same index, choose lowest expense ratio',
        'Check tracking error over 1+ years',
        'Avoid illiquid ETFs - bid-ask spread eats returns',
        'Use overlap analysis to avoid redundant ETFs'
      ],
      nextTools: ['portfolio-correlation', 'rebalance-optimizer', 'mf-analyzer']
    },

    {
      toolId: 'trade-journal',
      toolName: 'Trade Journal Analytics',
      category: 'portfolio',
      difficulty: 'intermediate',
      duration: '6 min',
      summary: 'Log trades and analyze patterns in your trading behavior.',
      whatYouLearn: [
        'Trade logging best practices',
        'Identifying behavioral patterns',
        'Improving trade quality'
      ],
      whyItMatters: 'The market is expensive tuition. A journal helps you learn from every trade.',
      metrics: [
        {
          id: 'trade_count',
          name: 'Trade Frequency',
          description: 'Number of trades per month.',
          interpretation: {
            excellent: 'Consistent with strategy: Disciplined',
            fair: 'Variable: Emotional trading?',
            poor: 'Excessive: Overtrading'
          },
          indianContext: 'For swing trading: 5-15/month. For investing: 1-5/month.'
        },
        {
          id: 'avg_hold_time',
          name: 'Average Holding Period',
          description: 'How long positions are held.',
          interpretation: {
            excellent: 'Matches strategy timeframe',
            fair: 'Variable hold times',
            poor: 'Exiting too early or holding too long'
          }
        },
        {
          id: 'win_rate_by_setup',
          name: 'Win Rate by Setup',
          description: 'Success rate per trade type.',
          interpretation: {
            excellent: 'Clear edge in specific setups',
            fair: 'Mixed results across setups',
            poor: 'No winning setups identified'
          }
        },
        {
          id: 'biggest_mistakes',
          name: 'Common Mistakes',
          description: 'Recurring error patterns.',
          interpretation: {
            excellent: 'Few repeated mistakes',
            fair: 'Some patterns identified',
            poor: 'Same mistakes repeated'
          }
        }
      ],
      actionableInsights: [
        'Review journal weekly - patterns emerge',
        'Track emotion and reason for each trade',
        'Double down on winning setups, eliminate losing ones',
        'Calculate expectancy per setup'
      ],
      nextTools: ['trade-expectancy', 'playbook-builder', 'portfolio-leaderboard']
    },

    {
      toolId: 'options-interest',
      toolName: 'Options Interest Dashboard',
      category: 'portfolio',
      difficulty: 'advanced',
      duration: '8 min',
      summary: 'Analyze options open interest, PCR, and max pain for market direction.',
      whatYouLearn: [
        'Reading open interest buildup',
        'Put-call ratio interpretation',
        'Max pain theory'
      ],
      whyItMatters: 'Options data reveals what big players expect. OI analysis often predicts ranges.',
      metrics: [
        {
          id: 'pcr',
          name: 'Put-Call Ratio (PCR)',
          formula: 'Put OI / Call OI',
          description: 'Ratio of put to call open interest.',
          interpretation: {
            excellent: '> 1.2: High put writing, bullish (support below)',
            good: '0.9-1.2: Neutral',
            fair: '0.7-0.9: Moderate call writing',
            poor: '< 0.7: Heavy call writing, bearish (resistance above)'
          },
          indianContext: 'Nifty PCR 0.8-1.2 is normal range. Extreme readings often reverse.',
          commonMistakes: ['PCR is contrarian - very high PCR can signal top, very low can signal bottom.']
        },
        {
          id: 'max_pain',
          name: 'Max Pain Level',
          description: 'Price where option buyers lose most / writers gain most.',
          interpretation: {
            excellent: 'Price far from max pain: May gravitate toward it',
            fair: 'Price near max pain: Range-bound likely',
            poor: 'Expiry approaching max pain: Pinning likely'
          },
          indianContext: 'Nifty tends to expire near max pain on monthly expiry.'
        },
        {
          id: 'oi_buildup',
          name: 'OI Buildup Analysis',
          description: 'Where is new OI being created?',
          interpretation: {
            excellent: 'Put OI buildup below: Support forming',
            good: 'Call OI buildup above: Resistance forming',
            fair: 'Mixed buildup: Range-bound',
            poor: 'OI unwinding: Trend reversal possible'
          }
        },
        {
          id: 'iv_percentile',
          name: 'IV Percentile',
          description: 'Current IV vs historical range.',
          interpretation: {
            excellent: '< 20%: Low IV, options cheap',
            good: '20-50%: Normal IV',
            fair: '50-80%: Elevated IV',
            poor: '> 80%: High IV, options expensive'
          }
        }
      ],
      actionableInsights: [
        'Max pain gives weekly/monthly range idea',
        'Highest OI strikes act as support/resistance',
        'PCR extreme readings often mark reversals',
        'Use OI data for strike selection in options trading'
      ],
      nextTools: ['options-strategy', 'volatility-regime', 'fno-risk-advisor']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 8: DERIVATIVES & STRATEGIES
// ═══════════════════════════════════════════════════════════════════════════

export const derivativesModule: ModuleDefinition = {
  id: 'derivatives',
  name: 'Derivatives & Strategies',
  icon: '📈',
  description: 'Options and futures strategies, currency derivatives, and hedging.',
  prerequisites: ['technical', 'risk'],
  learningOutcomes: [
    'Understand options payoffs',
    'Build basic option strategies',
    'Use currency derivatives',
    'Hedge portfolio risk'
  ],
  lessons: [
    {
      toolId: 'options-strategy',
      toolName: 'Options Strategy Explainer',
      category: 'derivatives',
      difficulty: 'advanced',
      duration: '10 min',
      summary: 'Visualize P&L of options strategies - covered calls, spreads, straddles.',
      whatYouLearn: [
        'Common options strategies',
        'Payoff diagram interpretation',
        'Strategy selection for market views'
      ],
      whyItMatters: 'Options offer asymmetric payoffs. Right strategy + right market = amplified returns.',
      metrics: [
        {
          id: 'max_profit',
          name: 'Maximum Profit',
          description: 'Best case scenario profit.',
          interpretation: {
            excellent: 'Unlimited or high defined profit',
            good: 'Good risk/reward ratio',
            fair: 'Limited but acceptable',
            poor: 'Low profit potential'
          }
        },
        {
          id: 'max_loss',
          name: 'Maximum Loss',
          description: 'Worst case scenario loss.',
          interpretation: {
            excellent: 'Defined and limited loss',
            good: 'Limited to premium paid',
            fair: 'Moderate loss potential',
            poor: 'Unlimited loss (naked short)'
          },
          indianContext: 'SEBI margin rules make unlimited loss strategies capital intensive.'
        },
        {
          id: 'breakeven',
          name: 'Breakeven Points',
          description: 'Price where strategy neither profits nor loses.',
          interpretation: {
            excellent: 'Wide profit zone',
            good: 'Reasonable breakeven distance',
            fair: 'Narrow profit zone',
            poor: 'Unlikely to reach breakeven'
          }
        },
        {
          id: 'probability_profit',
          name: 'Probability of Profit',
          description: 'Statistical chance of making money.',
          interpretation: {
            excellent: '> 70%: High probability strategy',
            good: '50-70%: Moderate probability',
            fair: '30-50%: Lower probability, higher reward',
            poor: '< 30%: Long shot'
          }
        }
      ],
      practicalExample: `Bull Call Spread on Nifty:
- Buy 24000 CE @ ₹200
- Sell 24500 CE @ ₹80
- Net Cost: ₹120 × 25 = ₹3,000
- Max Profit: (500 - 120) × 25 = ₹9,500
- Max Loss: ₹3,000 (premium paid)
- Breakeven: 24120

Use when: Moderately bullish, want to reduce cost of long call.`,
      actionableInsights: [
        'Match strategy to market outlook',
        'Defined risk strategies for beginners',
        'Time decay helps sellers, hurts buyers',
        'IV matters as much as direction'
      ],
      nextTools: ['options-interest', 'fno-risk-advisor', 'volatility-regime']
    },

    {
      toolId: 'nse-currency-dashboard',
      toolName: 'NSE Currency Dashboard',
      category: 'derivatives',
      difficulty: 'intermediate',
      duration: '7 min',
      summary: 'Track USD/INR futures and options for currency hedging or trading.',
      whatYouLearn: [
        'Currency futures basics',
        'USD/INR movement factors',
        'Hedging import/export exposure'
      ],
      whyItMatters: 'INR weakness affects returns on foreign investments. Currency derivatives help hedge or speculate.',
      metrics: [
        {
          id: 'usdinr_spot',
          name: 'USD/INR Spot Rate',
          description: 'Current exchange rate.',
          interpretation: {
            excellent: 'Stable INR: Good for importers',
            fair: 'Moderate movement: Normal',
            poor: 'Rapid depreciation: Inflationary'
          },
          indianContext: 'INR depreciates 3-5% annually on average vs USD. Sharp moves impact markets.'
        },
        {
          id: 'futures_premium',
          name: 'Futures Premium',
          description: 'Difference between futures and spot.',
          interpretation: {
            excellent: 'Normal premium (2-4% annualized)',
            fair: 'High premium: Depreciation expected',
            poor: 'Low/no premium: Unusual'
          }
        },
        {
          id: 'currency_trend',
          name: 'Currency Trend',
          description: 'Direction of INR movement.',
          interpretation: {
            excellent: 'Stable/strengthening INR',
            fair: 'Moderate weakening',
            poor: 'Sharp depreciation'
          }
        },
        {
          id: 'rbi_action',
          name: 'RBI Intervention',
          description: 'Central bank activity in forex.',
          interpretation: {
            excellent: 'Minimal intervention: Market-driven',
            fair: 'Moderate smoothing: Normal',
            poor: 'Heavy intervention: Stress in market'
          }
        }
      ],
      actionableInsights: [
        'Importers: Hedge when INR strong, exposure when weak',
        'Exporters: Hedge when INR weak',
        'Dollar strength = FII outflows = market weakness',
        'Currency futures for 1-3 month hedges'
      ],
      nextTools: ['macro-pulse', 'institutional-flows', 'options-strategy']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 9: MUTUAL FUNDS
// ═══════════════════════════════════════════════════════════════════════════

export const mutualFundsModule: ModuleDefinition = {
  id: 'mutual-funds',
  name: 'Mutual Funds',
  icon: '🏦',
  description: 'Mutual fund analysis, comparison, and portfolio optimization.',
  prerequisites: [],
  learningOutcomes: [
    'Evaluate mutual fund performance',
    'Compare funds objectively',
    'Build optimal MF portfolios',
    'Understand fund categories'
  ],
  lessons: [
    {
      toolId: 'mf-analyzer',
      toolName: 'Mutual Fund Analyzer',
      category: 'mutual-funds',
      difficulty: 'beginner',
      duration: '8 min',
      summary: 'Deep-dive analysis of mutual fund performance, risk, and holdings.',
      whatYouLearn: [
        'Key MF metrics explained',
        'Risk-adjusted return measures',
        'Holdings analysis'
      ],
      whyItMatters: 'Past returns dont predict future. Understanding risk-adjusted metrics helps pick consistent performers.',
      metrics: [
        {
          id: 'cagr_returns',
          name: 'CAGR Returns',
          description: 'Compound annual growth rate.',
          interpretation: {
            excellent: '> 15% (5Y): Strong performer',
            good: '12-15%: Good',
            fair: '8-12%: Average',
            poor: '< 8%: Below benchmark likely'
          },
          indianContext: 'Compare to category average. Large-cap 12-15%, Mid-cap 15-18%, Small-cap 18-22% are good.',
          commonMistakes: ['Recent 1-year return is meaningless. Focus on 3-5 year CAGR.']
        },
        {
          id: 'sharpe_ratio',
          name: 'Sharpe Ratio',
          formula: '(Fund Return - Risk Free Rate) / Standard Deviation',
          description: 'Return earned per unit of risk.',
          interpretation: {
            excellent: '> 1.0: Excellent risk-adjusted return',
            good: '0.7-1.0: Good',
            fair: '0.4-0.7: Average',
            poor: '< 0.4: Poor risk-adjusted return'
          },
          indianContext: 'Risk-free rate ~7% (10Y G-Sec). Sharpe > 1 is rare and valuable.'
        },
        {
          id: 'sortino_ratio',
          name: 'Sortino Ratio',
          formula: '(Fund Return - MAR) / Downside Deviation',
          description: 'Like Sharpe but only penalizes downside volatility.',
          interpretation: {
            excellent: '> 1.5: Excellent downside management',
            good: '1.0-1.5: Good',
            fair: '0.5-1.0: Average',
            poor: '< 0.5: Poor downside protection'
          }
        },
        {
          id: 'alpha',
          name: 'Alpha',
          formula: 'Fund Return - Benchmark Return (risk-adjusted)',
          description: 'Excess return from fund managers skill.',
          interpretation: {
            excellent: '> 3%: Significant outperformance',
            good: '1-3%: Modest alpha',
            fair: '0-1%: In line with benchmark',
            poor: '< 0%: Underperforming benchmark'
          },
          indianContext: 'Consistent 2%+ alpha over 5 years is rare. Most funds have negative alpha.'
        },
        {
          id: 'beta',
          name: 'Beta',
          description: 'Sensitivity to market movements.',
          interpretation: {
            excellent: 'Beta 0.8-1.0: Slightly defensive',
            good: 'Beta 1.0: Moves with market',
            fair: 'Beta 1.0-1.2: Slightly aggressive',
            poor: 'Beta > 1.3: Very aggressive'
          }
        },
        {
          id: 'expense_ratio',
          name: 'Expense Ratio',
          description: 'Annual fee charged by fund.',
          interpretation: {
            excellent: '< 0.5%: Very low (index/ETF)',
            good: '0.5-1.0%: Reasonable for active',
            fair: '1.0-1.5%: Moderate',
            poor: '> 1.5%: High, eats returns'
          },
          indianContext: 'Direct plans save 0.5-1% vs regular. Always prefer direct.'
        }
      ],
      actionableInsights: [
        'Sharpe > 1 + consistent alpha = quality fund',
        'Compare within same category, not across',
        'Direct plans always better than regular',
        '5-year track record minimum for evaluation'
      ],
      nextTools: ['mf-explorer', 'mf-portfolio-optimizer', 'etf-comparator']
    },

    {
      toolId: 'mf-explorer',
      toolName: 'Mutual Fund Explorer',
      category: 'mutual-funds',
      difficulty: 'beginner',
      duration: '5 min',
      summary: 'Discover and screen mutual funds by category, performance, and attributes.',
      whatYouLearn: [
        'Fund category selection',
        'Screening criteria',
        'Shortlisting methodology'
      ],
      whyItMatters: '40+ AMCs, 2000+ schemes. Explorer helps narrow to relevant options quickly.',
      metrics: [
        {
          id: 'category_rank',
          name: 'Category Rank',
          description: 'Where fund ranks in its category.',
          interpretation: {
            excellent: 'Top 10%: Category leader',
            good: 'Top 25%: Above average',
            fair: 'Top 50%: Average',
            poor: 'Bottom 50%: Below average'
          }
        },
        {
          id: 'aum',
          name: 'Assets Under Management',
          description: 'Total money managed by fund.',
          interpretation: {
            excellent: '₹5,000-50,000 Cr: Good size for equity',
            good: '₹1,000-5,000 Cr: Manageable',
            fair: '₹500-1,000 Cr: Smaller',
            poor: '< ₹500 Cr or > ₹1L Cr: Size constraints'
          },
          indianContext: 'Very large AUM limits stock picking flexibility. Very small has liquidity risk.'
        },
        {
          id: 'fund_age',
          name: 'Fund Age',
          description: 'Years since inception.',
          interpretation: {
            excellent: '> 10 years: Full market cycle tested',
            good: '5-10 years: Good track record',
            fair: '3-5 years: Developing record',
            poor: '< 3 years: Too early to judge'
          }
        },
        {
          id: 'fund_manager_tenure',
          name: 'Fund Manager Tenure',
          description: 'How long current manager has run the fund.',
          interpretation: {
            excellent: '> 5 years: Consistent management',
            good: '3-5 years: Reasonable',
            fair: '1-3 years: New manager',
            poor: '< 1 year: Transition period'
          },
          indianContext: 'Track record should be from current manager, not fund history.'
        }
      ],
      actionableInsights: [
        'Prioritize Sharpe ratio over absolute returns',
        'Check fund manager, not just fund name',
        'Avoid NFOs - wait for 3-year track record',
        'Large AUM in small-cap = problem'
      ],
      nextTools: ['mf-analyzer', 'mf-portfolio-optimizer', 'etf-comparator']
    },

    {
      toolId: 'mf-portfolio-optimizer',
      toolName: 'MF Portfolio Optimizer',
      category: 'mutual-funds',
      difficulty: 'intermediate',
      duration: '7 min',
      summary: 'Build optimal mutual fund portfolio with right category allocation.',
      whatYouLearn: [
        'Asset allocation principles',
        'Category mixing for diversification',
        'Portfolio construction'
      ],
      whyItMatters: 'Random fund collection ≠ portfolio. Optimizer ensures proper diversification and balance.',
      metrics: [
        {
          id: 'equity_allocation',
          name: 'Equity Allocation %',
          description: 'Portion in equity funds.',
          interpretation: {
            excellent: 'Age-appropriate (100 - age rule)',
            good: 'Within 10% of target',
            fair: 'Within 20% of target',
            poor: 'Far from target allocation'
          },
          indianContext: '30-year-old: 70% equity. 50-year-old: 50% equity. Adjust for risk appetite.'
        },
        {
          id: 'overlap_score',
          name: 'Portfolio Overlap',
          description: 'Common holdings across funds.',
          interpretation: {
            excellent: '< 20%: Well diversified',
            good: '20-35%: Acceptable',
            fair: '35-50%: Some redundancy',
            poor: '> 50%: Too much overlap'
          }
        },
        {
          id: 'category_mix',
          name: 'Category Mix',
          description: 'Distribution across fund categories.',
          interpretation: {
            excellent: 'Balanced across large/mid/small',
            good: 'Most categories covered',
            fair: 'Heavy in few categories',
            poor: 'Concentrated in one category'
          }
        },
        {
          id: 'risk_score',
          name: 'Portfolio Risk Score',
          description: 'Overall portfolio volatility.',
          interpretation: {
            excellent: 'Matches risk appetite',
            good: 'Close to target risk',
            fair: 'Somewhat different',
            poor: 'Mismatched with profile'
          }
        }
      ],
      actionableInsights: [
        '3-5 funds is optimal for most portfolios',
        'One fund per category is enough',
        'Rebalance annually or when 10% off target',
        'Use overlap tool to avoid redundant funds'
      ],
      nextTools: ['portfolio-correlation', 'rebalance-optimizer', 'etf-comparator']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 10: COMMODITIES
// ═══════════════════════════════════════════════════════════════════════════

export const commoditiesModule: ModuleDefinition = {
  id: 'commodities',
  name: 'Commodities',
  icon: '🛢️',
  description: 'Track MCX commodities - gold, silver, crude, metals.',
  prerequisites: [],
  learningOutcomes: [
    'Understand commodity price drivers',
    'Use commodities for diversification',
    'Track gold as portfolio hedge'
  ],
  lessons: [
    {
      toolId: 'mcx-commodity-dashboard',
      toolName: 'MCX Commodity Dashboard',
      category: 'commodities',
      difficulty: 'intermediate',
      duration: '7 min',
      summary: 'Track gold, silver, crude oil, and base metals prices and trends.',
      whatYouLearn: [
        'Key commodity price drivers',
        'Gold as portfolio hedge',
        'Commodity-equity correlations'
      ],
      whyItMatters: 'Commodities diversify portfolios. Gold often rises when equities fall.',
      metrics: [
        {
          id: 'gold_price',
          name: 'Gold Price (₹/10gm)',
          description: 'Current MCX gold price.',
          interpretation: {
            excellent: 'Near 52-week low: Accumulation zone',
            good: 'At average levels',
            fair: 'Above average',
            poor: 'Near 52-week high: Expensive'
          },
          indianContext: 'Indian gold prices = International price × USD/INR + import duty. Both matter.'
        },
        {
          id: 'gold_trend',
          name: 'Gold Trend',
          description: 'Direction of gold prices.',
          interpretation: {
            excellent: 'Uptrend in uncertainty: Doing its job',
            good: 'Range-bound: Normal',
            fair: 'Downtrend in equity bull: Normal',
            poor: 'Falling with equities: Unusual'
          },
          indianContext: 'Gold rallies during: USD weakness, geopolitical tension, inflation fears, equity crashes.'
        },
        {
          id: 'crude_price',
          name: 'Crude Oil Price ($/bbl)',
          description: 'Brent crude price.',
          interpretation: {
            excellent: '$60-80: Sweet spot for India',
            good: '$80-100: Manageable',
            fair: '> $100: Inflationary pressure',
            poor: '> $120: Severe impact on economy'
          },
          indianContext: 'India imports 85% of oil. Every $10 rise = 0.5% CAD increase.'
        },
        {
          id: 'silver_price',
          name: 'Silver Price (₹/kg)',
          description: 'MCX silver price.',
          interpretation: {
            excellent: 'Gold/silver ratio > 80: Silver cheap',
            good: 'Ratio 65-80: Normal',
            fair: 'Ratio 50-65: Silver expensive',
            poor: 'Ratio < 50: Very expensive'
          }
        },
        {
          id: 'portfolio_allocation',
          name: 'Recommended Gold Allocation',
          description: 'How much gold in portfolio.',
          interpretation: {
            excellent: '5-15%: Optimal diversification',
            good: '15-25%: Conservative allocation',
            fair: '0-5%: Limited hedge',
            poor: '> 25%: Overallocated'
          }
        }
      ],
      actionableInsights: [
        '10% gold allocation reduces portfolio volatility',
        'Buy gold gradually (SIP in gold ETF)',
        'High crude = negative for Indian equities (except ONGC/RIL)',
        'Silver more volatile than gold - smaller allocation'
      ],
      nextTools: ['portfolio-correlation', 'macro-pulse', 'etf-comparator']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 11: OVERVIEW & QUICK ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

export const overviewModule: ModuleDefinition = {
  id: 'overview',
  name: 'Quick Analysis',
  icon: '👁️',
  description: 'Quick snapshot tools for rapid stock assessment.',
  prerequisites: [],
  learningOutcomes: [
    'Rapid stock screening',
    'Quick fundamental check',
    'First-pass analysis'
  ],
  lessons: [
    {
      toolId: 'stock-snapshot',
      toolName: 'Stock Snapshot',
      category: 'overview',
      difficulty: 'beginner',
      duration: '4 min',
      summary: 'Quick overview of a stock - price, valuation, quality indicators in one view.',
      whatYouLearn: [
        'Reading key metrics at a glance',
        'Traffic light indicators',
        'When to dig deeper'
      ],
      whyItMatters: 'First impression matters. Snapshot helps decide if stock deserves deeper analysis.',
      metrics: [
        {
          id: 'quick_health',
          name: 'Health Traffic Light',
          description: 'Quick financial health indicator.',
          interpretation: {
            excellent: '🟢 Green: Healthy financials',
            fair: '🟡 Yellow: Some concerns',
            poor: '🔴 Red: Significant issues'
          }
        },
        {
          id: 'quick_valuation',
          name: 'Valuation Status',
          description: 'Quick cheap/fair/expensive assessment.',
          interpretation: {
            excellent: 'Cheap: Below historical average',
            good: 'Fair: Near average',
            poor: 'Expensive: Above average'
          }
        },
        {
          id: 'quick_momentum',
          name: 'Momentum Status',
          description: 'Price trend direction.',
          interpretation: {
            excellent: 'Bullish: Above key MAs',
            fair: 'Neutral: Consolidating',
            poor: 'Bearish: Below key MAs'
          }
        },
        {
          id: 'quick_quality',
          name: 'Quality Score',
          description: 'Composite fundamental quality.',
          interpretation: {
            excellent: '> 70: High quality',
            good: '50-70: Average',
            poor: '< 50: Low quality'
          }
        }
      ],
      actionableInsights: [
        'Green health + cheap valuation = investigate further',
        'Red health = skip regardless of valuation',
        'Use snapshot for screening, not final decision',
        'Check 5+ stocks to build comparison context'
      ],
      nextTools: ['valuation-summary', 'financial-health-dna', 'technical-indicators']
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 12: MINI CARDS (QUICK SIGNALS)
// ═══════════════════════════════════════════════════════════════════════════

export const miniCardsModule: ModuleDefinition = {
  id: 'mini-cards',
  name: 'Quick Signal Cards',
  icon: '🔹',
  description: 'Compact signal cards for rapid assessment - Altman Z, sentiment, warnings.',
  prerequisites: [],
  learningOutcomes: [
    'Quick risk assessment',
    'Sentiment gauge reading',
    'Warning signal interpretation'
  ],
  lessons: [
    {
      toolId: 'altman-graham-mini',
      toolName: 'Altman & Graham Mini',
      category: 'mini',
      difficulty: 'beginner',
      duration: '3 min',
      summary: 'Quick view of Altman Z-Score and Graham Number in one card.',
      whatYouLearn: [
        'Altman Z for bankruptcy risk',
        'Graham Number for value'
      ],
      whyItMatters: 'Two classic metrics in one glance - safety check + value check.',
      metrics: [
        {
          id: 'altman_z_quick',
          name: 'Altman Z-Score',
          description: 'Bankruptcy risk indicator.',
          interpretation: {
            excellent: '> 3.0: Safe zone',
            fair: '1.8-3.0: Grey zone',
            poor: '< 1.8: Distress zone'
          }
        },
        {
          id: 'graham_number_quick',
          name: 'Graham Number',
          formula: '√(22.5 × EPS × BVPS)',
          description: 'Maximum price for value investors.',
          interpretation: {
            excellent: 'Price < Graham: Value buy',
            fair: 'Price = Graham: Fair',
            poor: 'Price > Graham: Not value'
          }
        }
      ],
      actionableInsights: [
        'Both green = classic value opportunity',
        'Z < 1.8 = avoid regardless of Graham',
        'Use as first filter before deep dive'
      ],
      nextTools: ['bankruptcy-health', 'valuation-summary', 'piotroski-score']
    },

    {
      toolId: 'sentiment-zscore-mini',
      toolName: 'Sentiment Z-Score Mini',
      category: 'mini',
      difficulty: 'beginner',
      duration: '3 min',
      summary: 'Standardized sentiment deviation from normal - are emotions extreme?',
      whatYouLearn: [
        'Sentiment extremes as contrarian signals',
        'Z-Score interpretation'
      ],
      whyItMatters: 'Extreme sentiment often marks turning points. Buy fear, sell greed.',
      metrics: [
        {
          id: 'sentiment_zscore',
          name: 'Sentiment Z-Score',
          description: 'Standard deviations from mean sentiment.',
          interpretation: {
            excellent: 'Z < -2: Extreme fear, contrarian buy',
            good: 'Z -1 to -2: Elevated fear',
            fair: 'Z -1 to +1: Normal range',
            poor: 'Z > +2: Extreme greed, contrarian sell'
          }
        }
      ],
      actionableInsights: [
        'Z < -2 in quality stocks = buying opportunity',
        'Z > +2 = consider taking profits',
        'Works best at market level, not individual stocks'
      ],
      nextTools: ['institutional-flows', 'technical-indicators', 'options-interest']
    },

    {
      toolId: 'factor-tilt-mini',
      toolName: 'Factor Tilt Mini',
      category: 'mini',
      difficulty: 'intermediate',
      duration: '3 min',
      summary: 'Quick view of factor exposures - value, growth, momentum, quality.',
      whatYouLearn: [
        'Factor exposure at a glance',
        'Dominant factor identification'
      ],
      whyItMatters: 'Know what youre buying - is it a value bet or momentum play?',
      metrics: [
        {
          id: 'dominant_factor',
          name: 'Dominant Factor',
          description: 'Strongest factor exposure.',
          interpretation: {
            excellent: 'Multiple high-factor scores',
            good: 'Clear factor identity',
            fair: 'No dominant factor',
            poor: 'Negative factor scores'
          }
        },
        {
          id: 'factor_percentile',
          name: 'Factor Percentile',
          description: 'Where stock ranks on each factor.',
          interpretation: {
            excellent: '> 80th: Top factor exposure',
            good: '60-80th: Good exposure',
            fair: '40-60th: Average',
            poor: '< 40th: Below average'
          }
        }
      ],
      actionableInsights: [
        'Value + Quality = GARP strategy',
        'High momentum alone = risky',
        'Low all factors = avoid'
      ],
      nextTools: ['multi-factor-scorecard', 'peer-comparison', 'growth-summary']
    },

    {
      toolId: 'warning-sentinel-mini',
      toolName: 'Warning Sentinel Mini',
      category: 'mini',
      difficulty: 'beginner',
      duration: '3 min',
      summary: 'Active warnings and risk alerts in compact view.',
      whatYouLearn: [
        'Critical vs warning alerts',
        'Risk monitoring'
      ],
      whyItMatters: 'Know what to watch out for before it becomes a problem.',
      metrics: [
        {
          id: 'critical_alerts',
          name: 'Critical Alerts',
          description: 'Serious issues requiring action.',
          interpretation: {
            excellent: '0: All clear',
            fair: '1-2: Investigate',
            poor: '> 2: Serious concerns'
          }
        },
        {
          id: 'warnings',
          name: 'Warnings',
          description: 'Issues to monitor.',
          interpretation: {
            excellent: '0: Clean',
            fair: '1-3: Monitor',
            poor: '> 3: Multiple concerns'
          }
        },
        {
          id: 'risk_level',
          name: 'Risk Level',
          description: 'Overall risk assessment.',
          interpretation: {
            excellent: 'Low: < 30',
            fair: 'Medium: 30-60',
            poor: 'High: > 60'
          }
        }
      ],
      actionableInsights: [
        'Any critical alert = investigate immediately',
        'Rising risk score = increasing caution',
        'Compare to historical risk for context'
      ],
      nextTools: ['financial-stress-radar', 'bankruptcy-health', 'risk-health-dashboard']
    },

    {
      toolId: 'crash-warning-mini',
      toolName: 'Crash Warning Mini',
      category: 'mini',
      difficulty: 'intermediate',
      duration: '4 min',
      summary: 'Traffic light crash risk indicator using rule-based analysis.',
      whatYouLearn: [
        'Crash condition detection',
        'Rule-based risk assessment',
        'When to reduce exposure'
      ],
      whyItMatters: 'Early warning before crashes. Getting out early preserves capital.',
      metrics: [
        {
          id: 'crash_signal',
          name: 'Crash Signal',
          description: 'Traffic light crash risk.',
          interpretation: {
            excellent: '🟢 SAFE: Normal conditions',
            good: '🟡 CAUTION: Some factors elevated',
            fair: '🟠 WARNING: Risk conditions developing',
            poor: '🔴 DANGER: High crash risk'
          }
        },
        {
          id: 'crash_proximity',
          name: 'Crash Proximity %',
          description: 'How close conditions are to historical crashes.',
          interpretation: {
            excellent: '< 30%: Far from crash conditions',
            fair: '30-60%: Elevated risk',
            poor: '> 60%: Near crash conditions'
          }
        },
        {
          id: 'rolling_metrics',
          name: '10-Day Metrics',
          description: 'Return and volatility rolling averages.',
          interpretation: {
            excellent: 'Positive return, low volatility',
            fair: 'Mixed signals',
            poor: 'Negative return + high volatility'
          }
        }
      ],
      practicalExample: `Crash Warning Logic:
- 10D Rolling Return < -0.5% AND
- 10D Volatility > 2% AND
- Current Drawdown > 15%
= 🔴 DANGER

If only return negative OR only vol high:
= 🟡 CAUTION or 🟠 WARNING`,
      actionableInsights: [
        '🔴 DANGER: Reduce exposure, raise cash',
        '🟠 WARNING: Tighten stop losses',
        '🟡 CAUTION: Monitor closely',
        '🟢 SAFE: Normal positioning'
      ],
      nextTools: ['drawdown-var', 'volatility-regime', 'risk-health-dashboard']
    }
  ]
};

// Export all additional modules
export const additionalModules: ModuleDefinition[] = [
  macroModule,
  portfolioModule,
  derivativesModule,
  mutualFundsModule,
  commoditiesModule,
  overviewModule,
  miniCardsModule
];

export default additionalModules;
