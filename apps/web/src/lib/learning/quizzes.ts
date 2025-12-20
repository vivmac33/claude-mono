// ═══════════════════════════════════════════════════════════════════════════
// QUIZZES DATABASE
// 150 quiz questions organized by learning path (30 per path)
// ═══════════════════════════════════════════════════════════════════════════

export type QuestionType = 'mcq' | 'true-false' | 'scenario';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: QuizOption[];
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
  relatedConcepts?: string[];
}

export interface Quiz {
  pathId: string;
  pathName: string;
  description: string;
  passingScore: number; // percentage
  timeLimit?: number; // minutes
  questions: QuizQuestion[];
}

// ─────────────────────────────────────────────────────────────────────────────
// PATH 1: SCALPER MASTERY — 30 QUIZ QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const SCALPER_QUIZ: QuizQuestion[] = [
  // MCQ Questions (1-10)
  {
    id: 'scalper-q1',
    type: 'mcq',
    question: 'What confirms a strong breakout?',
    options: [
      { id: 'a', text: 'Low volume', isCorrect: false },
      { id: 'b', text: 'Doji candle', isCorrect: false },
      { id: 'c', text: 'Strong body close above level + high volume', isCorrect: true },
      { id: 'd', text: 'Wick-only break', isCorrect: false }
    ],
    explanation: 'A strong breakout requires price to close decisively above the level with confirming volume, showing real institutional participation.',
    difficulty: 'easy',
    category: 'price-action'
  },
  {
    id: 'scalper-q2',
    type: 'mcq',
    question: 'A long upper wick near resistance usually signals…',
    options: [
      { id: 'a', text: 'Strong buying', isCorrect: false },
      { id: 'b', text: 'Buyer exhaustion', isCorrect: true },
      { id: 'c', text: 'Range formation', isCorrect: false },
      { id: 'd', text: 'Trend continuation', isCorrect: false }
    ],
    explanation: 'Long upper wicks near resistance show sellers pushing price back down, indicating buyer exhaustion and potential reversal.',
    difficulty: 'easy',
    category: 'price-action'
  },
  {
    id: 'scalper-q3',
    type: 'mcq',
    question: 'VWAP below price generally indicates…',
    options: [
      { id: 'a', text: 'Seller control', isCorrect: false },
      { id: 'b', text: 'Buyer control', isCorrect: true },
      { id: 'c', text: 'No trend', isCorrect: false },
      { id: 'd', text: 'Reversal only', isCorrect: false }
    ],
    explanation: 'When price is above VWAP, it means buyers are in control and willing to pay above the volume-weighted average price.',
    difficulty: 'easy',
    category: 'volume'
  },
  {
    id: 'scalper-q4',
    type: 'mcq',
    question: 'Which pattern best signals a reversal near support?',
    options: [
      { id: 'a', text: 'Doji', isCorrect: false },
      { id: 'b', text: 'Bullish engulfing', isCorrect: true },
      { id: 'c', text: 'Inside bar', isCorrect: false },
      { id: 'd', text: 'Hammer with low volume', isCorrect: false }
    ],
    explanation: 'A bullish engulfing pattern near support shows strong buying momentum overtaking sellers, signaling a potential reversal.',
    difficulty: 'medium',
    category: 'price-action'
  },
  {
    id: 'scalper-q5',
    type: 'mcq',
    question: 'What does a climactic candle usually indicate?',
    options: [
      { id: 'a', text: 'Trend continuation', isCorrect: false },
      { id: 'b', text: 'Early-stage trend', isCorrect: false },
      { id: 'c', text: 'Possible exhaustion', isCorrect: true },
      { id: 'd', text: 'Volatility drop', isCorrect: false }
    ],
    explanation: 'Climactic candles with extremely high volume often mark exhaustion and potential turning points in the market.',
    difficulty: 'medium',
    category: 'volume'
  },
  {
    id: 'scalper-q6',
    type: 'mcq',
    question: 'Best stop-loss placement for scalping?',
    options: [
      { id: 'a', text: 'Random number', isCorrect: false },
      { id: 'b', text: 'Exact round levels', isCorrect: false },
      { id: 'c', text: 'Below wick/structure', isCorrect: true },
      { id: 'd', text: 'Far below VWAP', isCorrect: false }
    ],
    explanation: 'Stop-loss should be placed below structure (recent swing low or wick) to give the trade room while keeping risk defined.',
    difficulty: 'easy',
    category: 'risk-management'
  },
  {
    id: 'scalper-q7',
    type: 'mcq',
    question: 'High delivery % typically means…',
    options: [
      { id: 'a', text: 'Speculative trading', isCorrect: false },
      { id: 'b', text: 'Strong buyer interest', isCorrect: true },
      { id: 'c', text: 'Low liquidity', isCorrect: false },
      { id: 'd', text: 'Weak fundamentals', isCorrect: false }
    ],
    explanation: 'High delivery percentage indicates shares are being held rather than just traded intraday, showing genuine buying interest.',
    difficulty: 'medium',
    category: 'volume'
  },
  {
    id: 'scalper-q8',
    type: 'mcq',
    question: 'POC acts as…',
    options: [
      { id: 'a', text: 'Support only', isCorrect: false },
      { id: 'b', text: 'Resistance only', isCorrect: false },
      { id: 'c', text: 'Demand zone', isCorrect: false },
      { id: 'd', text: 'Magnet/mean-reversion level', isCorrect: true }
    ],
    explanation: 'Point of Control (POC) acts as a price magnet where the most trading occurred, often attracting price back during consolidation.',
    difficulty: 'medium',
    category: 'volume'
  },
  {
    id: 'scalper-q9',
    type: 'mcq',
    question: 'Which emotional bias occurs after a losing streak?',
    options: [
      { id: 'a', text: 'Confidence bias', isCorrect: false },
      { id: 'b', text: 'Revenge trading', isCorrect: true },
      { id: 'c', text: 'Greed', isCorrect: false },
      { id: 'd', text: 'Over-optimization', isCorrect: false }
    ],
    explanation: 'Revenge trading is the emotional urge to win back losses quickly, often leading to poor decisions and larger losses.',
    difficulty: 'easy',
    category: 'psychology'
  },
  {
    id: 'scalper-q10',
    type: 'mcq',
    question: 'A valid CPR breakout requires…',
    options: [
      { id: 'a', text: 'Small candle', isCorrect: false },
      { id: 'b', text: 'No volume', isCorrect: false },
      { id: 'c', text: 'Clean close above/below CPR', isCorrect: true },
      { id: 'd', text: 'Wick rejection', isCorrect: false }
    ],
    explanation: 'A valid CPR breakout needs a decisive close beyond the Central Pivot Range, ideally with confirming volume.',
    difficulty: 'medium',
    category: 'price-action'
  },
  // True/False Questions (11-20)
  {
    id: 'scalper-q11',
    type: 'true-false',
    question: 'Long wicks always mean reversal.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'Long wicks indicate rejection but don\'t guarantee reversal. Context (level, trend, volume) matters for interpretation.',
    difficulty: 'easy',
    category: 'price-action'
  },
  {
    id: 'scalper-q12',
    type: 'true-false',
    question: 'VWAP works best in trending markets only.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'VWAP works in both trending and ranging markets - as trend confirmation in trends and mean-reversion level in ranges.',
    difficulty: 'medium',
    category: 'volume'
  },
  {
    id: 'scalper-q13',
    type: 'true-false',
    question: 'Scalpers should avoid trading when India VIX is high.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'High VIX means increased volatility and unpredictable moves, making scalping riskier and stop-losses more likely to be hit.',
    difficulty: 'easy',
    category: 'market-structure'
  },
  {
    id: 'scalper-q14',
    type: 'true-false',
    question: 'Breakouts without volume usually fail.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Volume confirms institutional participation. Breakouts without volume lack conviction and often fail.',
    difficulty: 'easy',
    category: 'volume'
  },
  {
    id: 'scalper-q15',
    type: 'true-false',
    question: 'Position size should stay constant in all volatility conditions.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'Position size should adjust based on volatility - smaller in high volatility, larger in low volatility - to maintain consistent risk.',
    difficulty: 'medium',
    category: 'risk-management'
  },
  {
    id: 'scalper-q16',
    type: 'true-false',
    question: 'Reversal candles in strong trends are usually weak signals.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'In strong trends, reversal patterns often just indicate pullbacks rather than true reversals. Context is crucial.',
    difficulty: 'medium',
    category: 'price-action'
  },
  {
    id: 'scalper-q17',
    type: 'true-false',
    question: 'ATR helps determine logical stop-loss distance.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'ATR (Average True Range) shows typical price movement, helping set stops that account for normal market noise.',
    difficulty: 'easy',
    category: 'risk-management'
  },
  {
    id: 'scalper-q18',
    type: 'true-false',
    question: 'A playbook removes randomness from trading.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'A playbook defines rules for entry, exit, and risk management, creating consistent, repeatable trading behavior.',
    difficulty: 'easy',
    category: 'psychology'
  },
  {
    id: 'scalper-q19',
    type: 'true-false',
    question: 'Absorption happens when large orders prevent price movement.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Absorption occurs when large institutional orders absorb opposite pressure, causing price to stall despite heavy volume.',
    difficulty: 'medium',
    category: 'order-flow'
  },
  {
    id: 'scalper-q20',
    type: 'true-false',
    question: 'Emotional check-ins reduce tilt behavior.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Regular emotional awareness helps traders recognize when they\'re not in the right mental state to trade.',
    difficulty: 'easy',
    category: 'psychology'
  },
  // Scenario Questions (21-30)
  {
    id: 'scalper-q21',
    type: 'scenario',
    question: 'Price breaks resistance with weak volume and forms long wicks. What is likely happening?',
    options: [
      { id: 'a', text: 'Strong breakout', isCorrect: false },
      { id: 'b', text: 'Fakeout/trap', isCorrect: true },
      { id: 'c', text: 'Trend reversal', isCorrect: false },
      { id: 'd', text: 'Retest setup', isCorrect: false }
    ],
    explanation: 'Weak volume and long wicks on a breakout suggest lack of conviction - likely a fakeout that will reverse.',
    difficulty: 'medium',
    category: 'price-action'
  },
  {
    id: 'scalper-q22',
    type: 'scenario',
    question: 'Price is far above VWAP after a strong rally. What should a scalper expect?',
    options: [
      { id: 'a', text: 'Continuation', isCorrect: false },
      { id: 'b', text: 'Mean reversion pullback', isCorrect: true },
      { id: 'c', text: 'Low volatility', isCorrect: false },
      { id: 'd', text: 'CPR breakout', isCorrect: false }
    ],
    explanation: 'Extended moves far from VWAP typically revert. Scalpers should expect a pullback toward VWAP.',
    difficulty: 'medium',
    category: 'volume'
  },
  {
    id: 'scalper-q23',
    type: 'scenario',
    question: 'You hit daily -3% loss early. What should you do?',
    options: [
      { id: 'a', text: 'Increase size', isCorrect: false },
      { id: 'b', text: 'Keep trading', isCorrect: false },
      { id: 'c', text: 'Revenge entry', isCorrect: false },
      { id: 'd', text: 'Stop trading', isCorrect: true }
    ],
    explanation: 'Hitting your daily stop means market conditions don\'t suit your strategy today. Stop to preserve capital.',
    difficulty: 'easy',
    category: 'risk-management'
  },
  {
    id: 'scalper-q24',
    type: 'scenario',
    question: 'Price reaches POC and immediately rejects with strong wick. Best action?',
    options: [
      { id: 'a', text: 'Chase breakout', isCorrect: false },
      { id: 'b', text: 'Enter reversal trade', isCorrect: true },
      { id: 'c', text: 'Wait for news', isCorrect: false },
      { id: 'd', text: 'Ignore it', isCorrect: false }
    ],
    explanation: 'Strong rejection from POC with wick confirmation is a valid reversal setup for scalpers.',
    difficulty: 'medium',
    category: 'volume'
  },
  {
    id: 'scalper-q25',
    type: 'scenario',
    question: 'Multiple failed breakouts occur around the same resistance. Implication?',
    options: [
      { id: 'a', text: 'Level is weak', isCorrect: false },
      { id: 'b', text: 'Level is strong', isCorrect: true },
      { id: 'c', text: 'Trend is strong', isCorrect: false },
      { id: 'd', text: 'Breakout is imminent', isCorrect: false }
    ],
    explanation: 'Multiple failed breakouts confirm the level\'s strength - sellers are defending it consistently.',
    difficulty: 'medium',
    category: 'price-action'
  },
  {
    id: 'scalper-q26',
    type: 'scenario',
    question: 'Trend is strong but RSI shows divergence. What does this signal?',
    options: [
      { id: 'a', text: 'Strong continuation', isCorrect: false },
      { id: 'b', text: 'Momentum weakening', isCorrect: true },
      { id: 'c', text: 'Range forming', isCorrect: false },
      { id: 'd', text: 'Immediate reversal', isCorrect: false }
    ],
    explanation: 'RSI divergence in a strong trend signals weakening momentum, though not necessarily immediate reversal.',
    difficulty: 'hard',
    category: 'technical'
  },
  {
    id: 'scalper-q27',
    type: 'scenario',
    question: 'Price forms bullish engulfing but VIX is above 20. Best approach?',
    options: [
      { id: 'a', text: 'Enter immediately', isCorrect: false },
      { id: 'b', text: 'Increase size', isCorrect: false },
      { id: 'c', text: 'Avoid trade', isCorrect: true },
      { id: 'd', text: 'Trade opposite', isCorrect: false }
    ],
    explanation: 'High VIX means unpredictable volatility. Even good patterns carry higher risk - better to avoid.',
    difficulty: 'medium',
    category: 'market-structure'
  },
  {
    id: 'scalper-q28',
    type: 'scenario',
    question: 'A candle engulfs previous one but happens mid-range. Interpretation?',
    options: [
      { id: 'a', text: 'Strong reversal', isCorrect: false },
      { id: 'b', text: 'Trend start', isCorrect: false },
      { id: 'c', text: 'Low reliability', isCorrect: true },
      { id: 'd', text: 'Strong breakout', isCorrect: false }
    ],
    explanation: 'Engulfing patterns are most reliable at key levels (support/resistance). Mid-range patterns have low reliability.',
    difficulty: 'hard',
    category: 'price-action'
  },
  {
    id: 'scalper-q29',
    type: 'scenario',
    question: 'You see repeated absorption near support. What does this suggest?',
    options: [
      { id: 'a', text: 'Sellers strong', isCorrect: false },
      { id: 'b', text: 'Buyers absorbing', isCorrect: true },
      { id: 'c', text: 'Trend reversal confirmed', isCorrect: false },
      { id: 'd', text: 'Low liquidity', isCorrect: false }
    ],
    explanation: 'Repeated absorption at support shows buyers defending the level - bullish accumulation sign.',
    difficulty: 'hard',
    category: 'order-flow'
  },
  {
    id: 'scalper-q30',
    type: 'scenario',
    question: 'You have 5 losing trades in a row due to poor conditions. Best decision?',
    options: [
      { id: 'a', text: 'Trade harder', isCorrect: false },
      { id: 'b', text: 'Increase size', isCorrect: false },
      { id: 'c', text: 'Stop for the day', isCorrect: true },
      { id: 'd', text: 'Switch strategy mid-session', isCorrect: false }
    ],
    explanation: 'Consecutive losses due to poor conditions mean your strategy doesn\'t fit today\'s market. Stop and reassess.',
    difficulty: 'easy',
    category: 'psychology'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// PATH 2: INTRADAY TRADER — 30 QUIZ QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const INTRADAY_QUIZ: QuizQuestion[] = [
  // MCQ (1-10)
  {
    id: 'intraday-q1',
    type: 'mcq',
    question: 'What indicates a strong ORB breakout?',
    options: [
      { id: 'a', text: 'Small candle', isCorrect: false },
      { id: 'b', text: 'High volume + full body break', isCorrect: true },
      { id: 'c', text: 'Wick breakout', isCorrect: false },
      { id: 'd', text: 'Divergence', isCorrect: false }
    ],
    explanation: 'Strong ORB breakouts show full candle body closing beyond the range with confirming volume.',
    difficulty: 'easy',
    category: 'market-structure'
  },
  {
    id: 'intraday-q2',
    type: 'mcq',
    question: 'Price far from VWAP usually leads to…',
    options: [
      { id: 'a', text: 'Strong continuation', isCorrect: false },
      { id: 'b', text: 'Mean reversion', isCorrect: true },
      { id: 'c', text: 'Trend reversal', isCorrect: false },
      { id: 'd', text: 'Range formation', isCorrect: false }
    ],
    explanation: 'Extended moves away from VWAP typically snap back as price reverts to the volume-weighted mean.',
    difficulty: 'easy',
    category: 'volume'
  },
  {
    id: 'intraday-q3',
    type: 'mcq',
    question: 'A gap that fills immediately suggests…',
    options: [
      { id: 'a', text: 'Strong trend', isCorrect: false },
      { id: 'b', text: 'Weak momentum', isCorrect: true },
      { id: 'c', text: 'Breakout', isCorrect: false },
      { id: 'd', text: 'Noise', isCorrect: false }
    ],
    explanation: 'Gaps that fill quickly show lack of follow-through and weak conviction behind the opening move.',
    difficulty: 'medium',
    category: 'market-structure'
  },
  {
    id: 'intraday-q4',
    type: 'mcq',
    question: 'Short MAs are mainly used for…',
    options: [
      { id: 'a', text: 'Reversal prediction', isCorrect: false },
      { id: 'b', text: 'Long-term trends', isCorrect: false },
      { id: 'c', text: 'Momentum confirmation', isCorrect: true },
      { id: 'd', text: 'Fundamental analysis', isCorrect: false }
    ],
    explanation: 'Short moving averages (5, 9, 20 EMA) confirm immediate price momentum and trend direction.',
    difficulty: 'easy',
    category: 'technical'
  },
  {
    id: 'intraday-q5',
    type: 'mcq',
    question: 'RSI divergence signals…',
    options: [
      { id: 'a', text: 'Trend acceleration', isCorrect: false },
      { id: 'b', text: 'Momentum weakening', isCorrect: true },
      { id: 'c', text: 'High volume', isCorrect: false },
      { id: 'd', text: 'ORB continuation', isCorrect: false }
    ],
    explanation: 'When price and RSI move in opposite directions, it signals weakening momentum.',
    difficulty: 'medium',
    category: 'technical'
  },
  {
    id: 'intraday-q6',
    type: 'mcq',
    question: 'Which Greek impacts intraday options most?',
    options: [
      { id: 'a', text: 'Theta', isCorrect: true },
      { id: 'b', text: 'Rho', isCorrect: false },
      { id: 'c', text: 'Vega', isCorrect: false },
      { id: 'd', text: 'None', isCorrect: false }
    ],
    explanation: 'Theta (time decay) erodes option premium rapidly during intraday trading, especially near expiry.',
    difficulty: 'medium',
    category: 'fno'
  },
  {
    id: 'intraday-q7',
    type: 'mcq',
    question: 'Futures leverage increases…',
    options: [
      { id: 'a', text: 'Only profit', isCorrect: false },
      { id: 'b', text: 'Only risk', isCorrect: false },
      { id: 'c', text: 'Both risk and reward', isCorrect: true },
      { id: 'd', text: 'None', isCorrect: false }
    ],
    explanation: 'Leverage amplifies both gains and losses - understanding this is critical for risk management.',
    difficulty: 'easy',
    category: 'fno'
  },
  {
    id: 'intraday-q8',
    type: 'mcq',
    question: 'ATR helps with…',
    options: [
      { id: 'a', text: 'Entry confirmation', isCorrect: false },
      { id: 'b', text: 'Stop placement', isCorrect: true },
      { id: 'c', text: 'Profit size', isCorrect: false },
      { id: 'd', text: 'Indicators', isCorrect: false }
    ],
    explanation: 'ATR measures volatility, helping place stops at logical distances that account for normal price movement.',
    difficulty: 'easy',
    category: 'risk-management'
  },
  {
    id: 'intraday-q9',
    type: 'mcq',
    question: 'Square-off discipline prevents…',
    options: [
      { id: 'a', text: 'Trend continuation', isCorrect: false },
      { id: 'b', text: 'Overtrading', isCorrect: false },
      { id: 'c', text: 'Overnight risk', isCorrect: true },
      { id: 'd', text: 'Profit booking', isCorrect: false }
    ],
    explanation: 'Closing intraday positions before session end prevents overnight gap risk and penalties.',
    difficulty: 'easy',
    category: 'risk-management'
  },
  {
    id: 'intraday-q10',
    type: 'mcq',
    question: 'A midday reset helps prevent…',
    options: [
      { id: 'a', text: 'Confidence', isCorrect: false },
      { id: 'b', text: 'Tilt', isCorrect: true },
      { id: 'c', text: 'Signal clarity', isCorrect: false },
      { id: 'd', text: 'Volume spikes', isCorrect: false }
    ],
    explanation: 'A midday break helps reset emotions and prevents tilt from morning trading outcomes.',
    difficulty: 'easy',
    category: 'psychology'
  },
  // True/False (11-20)
  {
    id: 'intraday-q11',
    type: 'true-false',
    question: 'VWAP helps determine intraday trend.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'VWAP serves as a directional filter - above is bullish bias, below is bearish bias.',
    difficulty: 'easy',
    category: 'volume'
  },
  {
    id: 'intraday-q12',
    type: 'true-false',
    question: 'Low-volume breakouts are reliable.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'Breakouts need volume confirmation. Low-volume breakouts often fail.',
    difficulty: 'easy',
    category: 'volume'
  },
  {
    id: 'intraday-q13',
    type: 'true-false',
    question: 'Mean reversion is common when price deviates far from VWAP.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Extended moves away from VWAP frequently snap back as prices revert to the mean.',
    difficulty: 'medium',
    category: 'volume'
  },
  {
    id: 'intraday-q14',
    type: 'true-false',
    question: 'ATR is fixed across sessions.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'ATR changes daily based on recent price volatility - it\'s a dynamic measure.',
    difficulty: 'medium',
    category: 'risk-management'
  },
  {
    id: 'intraday-q15',
    type: 'true-false',
    question: 'Options lose value faster near expiry.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Theta decay accelerates as expiry approaches - time value erodes rapidly.',
    difficulty: 'easy',
    category: 'fno'
  },
  {
    id: 'intraday-q16',
    type: 'true-false',
    question: 'A trading journal is optional for intraday traders.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'Journaling is essential for identifying patterns in behavior and improving performance.',
    difficulty: 'easy',
    category: 'psychology'
  },
  {
    id: 'intraday-q17',
    type: 'true-false',
    question: 'RSI should always be used alone for entries.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'RSI works best with context - price action, levels, and other confirmations.',
    difficulty: 'easy',
    category: 'technical'
  },
  {
    id: 'intraday-q18',
    type: 'true-false',
    question: 'Rollover increases volatility.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Near expiry, position shifts to next month create unusual price movements and volatility.',
    difficulty: 'medium',
    category: 'fno'
  },
  {
    id: 'intraday-q19',
    type: 'true-false',
    question: 'Trend days rarely test VWAP.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Strong trend days see price move away from VWAP consistently with few retests.',
    difficulty: 'medium',
    category: 'volume'
  },
  {
    id: 'intraday-q20',
    type: 'true-false',
    question: 'EOD exits reduce unpredictability.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Closing positions before end of day eliminates overnight gap risk.',
    difficulty: 'easy',
    category: 'risk-management'
  },
  // Scenario (21-30)
  {
    id: 'intraday-q21',
    type: 'scenario',
    question: 'Price breaks ORB with low volume. Best action?',
    options: [
      { id: 'a', text: 'Enter', isCorrect: false },
      { id: 'b', text: 'Avoid', isCorrect: true },
      { id: 'c', text: 'Double size', isCorrect: false },
      { id: 'd', text: 'Reverse', isCorrect: false }
    ],
    explanation: 'Low volume on ORB break suggests weak conviction - better to avoid this trade.',
    difficulty: 'easy',
    category: 'market-structure'
  },
  {
    id: 'intraday-q22',
    type: 'scenario',
    question: 'You see strong rally, but price is far above VWAP with divergence. Expect…',
    options: [
      { id: 'a', text: 'Trend extension', isCorrect: false },
      { id: 'b', text: 'Pullback', isCorrect: true },
      { id: 'c', text: 'Continuation', isCorrect: false },
      { id: 'd', text: 'Chop', isCorrect: false }
    ],
    explanation: 'Extended above VWAP + divergence = weakening momentum, expect mean reversion.',
    difficulty: 'medium',
    category: 'volume'
  },
  {
    id: 'intraday-q23',
    type: 'scenario',
    question: 'Options premium falling despite price rise indicates…',
    options: [
      { id: 'a', text: 'Gamma', isCorrect: false },
      { id: 'b', text: 'Theta decay', isCorrect: true },
      { id: 'c', text: 'Delta rise', isCorrect: false },
      { id: 'd', text: 'Volume spike', isCorrect: false }
    ],
    explanation: 'Theta decay can erode premium faster than delta gains from price movement.',
    difficulty: 'hard',
    category: 'fno'
  },
  {
    id: 'intraday-q24',
    type: 'scenario',
    question: 'You\'re up 3%, but you feel euphoric. Best action?',
    options: [
      { id: 'a', text: 'Enter more', isCorrect: false },
      { id: 'b', text: 'Reduce size', isCorrect: false },
      { id: 'c', text: 'Follow routine', isCorrect: true },
      { id: 'd', text: 'Ignore emotions', isCorrect: false }
    ],
    explanation: 'Emotional highs can lead to overconfidence. Stick to your trading plan and routine.',
    difficulty: 'medium',
    category: 'psychology'
  },
  {
    id: 'intraday-q25',
    type: 'scenario',
    question: 'Price stuck between PDH and PDL for hours. Market is…',
    options: [
      { id: 'a', text: 'Trend', isCorrect: false },
      { id: 'b', text: 'Range', isCorrect: true },
      { id: 'c', text: 'Volatile', isCorrect: false },
      { id: 'd', text: 'Reversing', isCorrect: false }
    ],
    explanation: 'Price oscillating between previous day high/low indicates a ranging market.',
    difficulty: 'easy',
    category: 'market-structure'
  },
  {
    id: 'intraday-q26',
    type: 'scenario',
    question: 'After 4 losing trades due to chop, the correct move is…',
    options: [
      { id: 'a', text: 'Increase size', isCorrect: false },
      { id: 'b', text: 'Continue trading', isCorrect: false },
      { id: 'c', text: 'Stop for day', isCorrect: true },
      { id: 'd', text: 'Take riskier trades', isCorrect: false }
    ],
    explanation: 'Consecutive losses in choppy conditions mean your strategy doesn\'t fit today\'s market.',
    difficulty: 'easy',
    category: 'psychology'
  },
  {
    id: 'intraday-q27',
    type: 'scenario',
    question: 'High volatility + small position size indicates…',
    options: [
      { id: 'a', text: 'Good risk management', isCorrect: true },
      { id: 'b', text: 'Bad sizing', isCorrect: false },
      { id: 'c', text: 'Lack of experience', isCorrect: false },
      { id: 'd', text: 'Poor strategy', isCorrect: false }
    ],
    explanation: 'Reducing size in high volatility maintains consistent risk - good risk management.',
    difficulty: 'medium',
    category: 'risk-management'
  },
  {
    id: 'intraday-q28',
    type: 'scenario',
    question: 'Price breaks VWAP with strong volume. Interpretation?',
    options: [
      { id: 'a', text: 'Reversal', isCorrect: true },
      { id: 'b', text: 'Noise', isCorrect: false },
      { id: 'c', text: 'No signal', isCorrect: false },
      { id: 'd', text: 'Pullback', isCorrect: false }
    ],
    explanation: 'Breaking VWAP with volume confirms shift in intraday bias - potential reversal.',
    difficulty: 'medium',
    category: 'volume'
  },
  {
    id: 'intraday-q29',
    type: 'scenario',
    question: 'You fail to journal trades. Impact?',
    options: [
      { id: 'a', text: 'Nothing', isCorrect: false },
      { id: 'b', text: 'You miss behavioral patterns', isCorrect: true },
      { id: 'c', text: 'Faster profits', isCorrect: false },
      { id: 'd', text: 'Better discipline', isCorrect: false }
    ],
    explanation: 'Without journaling, you can\'t identify patterns in your behavior or improve systematically.',
    difficulty: 'easy',
    category: 'psychology'
  },
  {
    id: 'intraday-q30',
    type: 'scenario',
    question: 'Price rapidly approaches PDL with strong volume. Expect…',
    options: [
      { id: 'a', text: 'Slow reversal', isCorrect: false },
      { id: 'b', text: 'Sharp breakout or bounce', isCorrect: true },
      { id: 'c', text: 'No reaction', isCorrect: false },
      { id: 'd', text: 'Chop', isCorrect: false }
    ],
    explanation: 'Strong momentum into a key level (PDL) typically creates a sharp reaction either way.',
    difficulty: 'medium',
    category: 'market-structure'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// PATH 3: SWING TRADER — 30 QUIZ QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const SWING_QUIZ: QuizQuestion[] = [
  // MCQ (1-10)
  {
    id: 'swing-q1',
    type: 'mcq',
    question: 'Breakouts are strongest when confirmed by…',
    options: [
      { id: 'a', text: 'Low volume', isCorrect: false },
      { id: 'b', text: 'Wick tests', isCorrect: false },
      { id: 'c', text: 'High volume', isCorrect: true },
      { id: 'd', text: 'RSI signals only', isCorrect: false }
    ],
    explanation: 'High volume confirms institutional participation and validates the breakout.',
    difficulty: 'easy',
    category: 'price-action'
  },
  {
    id: 'swing-q2',
    type: 'mcq',
    question: 'A double top indicates…',
    options: [
      { id: 'a', text: 'Trend continuation', isCorrect: false },
      { id: 'b', text: 'Exhaustion', isCorrect: true },
      { id: 'c', text: 'Range formation', isCorrect: false },
      { id: 'd', text: 'Reversal but weak', isCorrect: false }
    ],
    explanation: 'Double top shows price failed twice to break higher - indicating exhaustion.',
    difficulty: 'easy',
    category: 'price-action'
  },
  {
    id: 'swing-q3',
    type: 'mcq',
    question: 'RSI above 50 means…',
    options: [
      { id: 'a', text: 'Weak trend', isCorrect: false },
      { id: 'b', text: 'Bearish bias', isCorrect: false },
      { id: 'c', text: 'Bullish strength', isCorrect: true },
      { id: 'd', text: 'Sideways', isCorrect: false }
    ],
    explanation: 'RSI above 50 indicates bullish momentum strength in the current trend.',
    difficulty: 'easy',
    category: 'technical'
  },
  {
    id: 'swing-q4',
    type: 'mcq',
    question: 'MACD divergence suggests…',
    options: [
      { id: 'a', text: 'Momentum strengthening', isCorrect: false },
      { id: 'b', text: 'Momentum weakening', isCorrect: true },
      { id: 'c', text: 'Trend beginning', isCorrect: false },
      { id: 'd', text: 'Breakout', isCorrect: false }
    ],
    explanation: 'Divergence between price and MACD signals weakening momentum.',
    difficulty: 'medium',
    category: 'technical'
  },
  {
    id: 'swing-q5',
    type: 'mcq',
    question: 'Accumulation zones form when…',
    options: [
      { id: 'a', text: 'Retail sells', isCorrect: false },
      { id: 'b', text: 'Institutions quietly buy', isCorrect: true },
      { id: 'c', text: 'Low liquidity', isCorrect: false },
      { id: 'd', text: 'No movement', isCorrect: false }
    ],
    explanation: 'Institutions accumulate shares during consolidation phases before breakouts.',
    difficulty: 'medium',
    category: 'institutional'
  },
  {
    id: 'swing-q6',
    type: 'mcq',
    question: 'Distribution typically leads to…',
    options: [
      { id: 'a', text: 'Breakout', isCorrect: false },
      { id: 'b', text: 'Correction', isCorrect: true },
      { id: 'c', text: 'Rally', isCorrect: false },
      { id: 'd', text: 'Upside continuation', isCorrect: false }
    ],
    explanation: 'Distribution shows institutions selling quietly during rallies, leading to corrections.',
    difficulty: 'medium',
    category: 'institutional'
  },
  {
    id: 'swing-q7',
    type: 'mcq',
    question: 'Trailing stops help…',
    options: [
      { id: 'a', text: 'Increase risk', isCorrect: false },
      { id: 'b', text: 'Protect profits', isCorrect: true },
      { id: 'c', text: 'Remove trends', isCorrect: false },
      { id: 'd', text: 'Avoid entries', isCorrect: false }
    ],
    explanation: 'Trailing stops lock in profits while allowing the trend to run.',
    difficulty: 'easy',
    category: 'risk-management'
  },
  {
    id: 'swing-q8',
    type: 'mcq',
    question: 'Scaling out reduces…',
    options: [
      { id: 'a', text: 'Profit', isCorrect: false },
      { id: 'b', text: 'Emotional pressure', isCorrect: true },
      { id: 'c', text: 'Trend clarity', isCorrect: false },
      { id: 'd', text: 'Stop placement importance', isCorrect: false }
    ],
    explanation: 'Taking partial profits reduces emotional pressure and locks in gains.',
    difficulty: 'easy',
    category: 'psychology'
  },
  {
    id: 'swing-q9',
    type: 'mcq',
    question: 'Pullbacks to 20/50 SMA often provide…',
    options: [
      { id: 'a', text: 'Reversal clues', isCorrect: false },
      { id: 'b', text: 'Low-probability entries', isCorrect: false },
      { id: 'c', text: 'Low-risk entries', isCorrect: true },
      { id: 'd', text: 'Volume spikes', isCorrect: false }
    ],
    explanation: 'Healthy trends retrace to key MAs, offering low-risk entry opportunities.',
    difficulty: 'medium',
    category: 'technical'
  },
  {
    id: 'swing-q10',
    type: 'mcq',
    question: 'FII buying increases…',
    options: [
      { id: 'a', text: 'Volatility only', isCorrect: false },
      { id: 'b', text: 'Sustainability of trends', isCorrect: true },
      { id: 'c', text: 'Noise', isCorrect: false },
      { id: 'd', text: 'Mean reversion', isCorrect: false }
    ],
    explanation: 'FII buying provides sustained capital inflow that supports trend continuation.',
    difficulty: 'medium',
    category: 'institutional'
  },
  // True/False (11-20)
  {
    id: 'swing-q11',
    type: 'true-false',
    question: 'Breakouts with weak volume are reliable.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'Breakouts need volume confirmation - weak volume often leads to failures.',
    difficulty: 'easy',
    category: 'volume'
  },
  {
    id: 'swing-q12',
    type: 'true-false',
    question: 'MACD crossovers above zero are strong signals.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Crossovers above zero line indicate strong bullish momentum confirmation.',
    difficulty: 'medium',
    category: 'technical'
  },
  {
    id: 'swing-q13',
    type: 'true-false',
    question: 'Accumulation strengthens breakout potential.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Institutional accumulation during consolidation builds energy for stronger breakouts.',
    difficulty: 'easy',
    category: 'institutional'
  },
  {
    id: 'swing-q14',
    type: 'true-false',
    question: 'Diversification adds unnecessary complexity.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'Diversification reduces risk and smoothens returns - essential for portfolio health.',
    difficulty: 'easy',
    category: 'risk-management'
  },
  {
    id: 'swing-q15',
    type: 'true-false',
    question: 'Expectancy determines long-term profitability.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Positive expectancy is required for long-term trading success.',
    difficulty: 'medium',
    category: 'system'
  },
  {
    id: 'swing-q16',
    type: 'true-false',
    question: 'Strong trends rarely retest SMAs.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'Even strong trends pullback to SMAs - these create entry opportunities.',
    difficulty: 'medium',
    category: 'technical'
  },
  {
    id: 'swing-q17',
    type: 'true-false',
    question: 'A watchlist increases preparedness.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'A prepared watchlist helps traders act decisively when setups trigger.',
    difficulty: 'easy',
    category: 'system'
  },
  {
    id: 'swing-q18',
    type: 'true-false',
    question: 'Earnings events should be ignored.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'Earnings are major catalysts that can confirm or invalidate swing setups.',
    difficulty: 'easy',
    category: 'fundamental'
  },
  {
    id: 'swing-q19',
    type: 'true-false',
    question: 'Weekly reviews improve strategy execution.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Regular reviews help identify patterns and improve trading performance.',
    difficulty: 'easy',
    category: 'psychology'
  },
  {
    id: 'swing-q20',
    type: 'true-false',
    question: 'Scaling in on weak trends is safe.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'Adding positions should only be done in strong, confirmed trends.',
    difficulty: 'medium',
    category: 'risk-management'
  },
  // Scenario (21-30)
  {
    id: 'swing-q21',
    type: 'scenario',
    question: 'Price breaks consolidation with high volume. Expect…',
    options: [
      { id: 'a', text: 'Continuation', isCorrect: true },
      { id: 'b', text: 'Fakeout', isCorrect: false },
      { id: 'c', text: 'Chop', isCorrect: false },
      { id: 'd', text: 'Breakdown', isCorrect: false }
    ],
    explanation: 'High volume breakout from consolidation signals strong momentum continuation.',
    difficulty: 'easy',
    category: 'price-action'
  },
  {
    id: 'swing-q22',
    type: 'scenario',
    question: 'You see divergence at resistance. Action?',
    options: [
      { id: 'a', text: 'Hold long', isCorrect: false },
      { id: 'b', text: 'Add more', isCorrect: false },
      { id: 'c', text: 'Reduce or exit', isCorrect: true },
      { id: 'd', text: 'Ignore', isCorrect: false }
    ],
    explanation: 'Divergence at resistance warns of weakening momentum - reduce exposure.',
    difficulty: 'medium',
    category: 'technical'
  },
  {
    id: 'swing-q23',
    type: 'scenario',
    question: 'Stock in strong uptrend pulls to 20 SMA. Best?',
    options: [
      { id: 'a', text: 'Short', isCorrect: false },
      { id: 'b', text: 'Watch for long', isCorrect: true },
      { id: 'c', text: 'Avoid', isCorrect: false },
      { id: 'd', text: 'Exit everything', isCorrect: false }
    ],
    explanation: 'Pullbacks to 20 SMA in strong uptrends are classic buying opportunities.',
    difficulty: 'medium',
    category: 'technical'
  },
  {
    id: 'swing-q24',
    type: 'scenario',
    question: 'Sector strong but your stock weak. Means…',
    options: [
      { id: 'a', text: 'Leader', isCorrect: false },
      { id: 'b', text: 'Laggard', isCorrect: true },
      { id: 'c', text: 'Breakout pending', isCorrect: false },
      { id: 'd', text: 'Low volume', isCorrect: false }
    ],
    explanation: 'Underperforming in a strong sector indicates the stock is a laggard - not ideal.',
    difficulty: 'easy',
    category: 'institutional'
  },
  {
    id: 'swing-q25',
    type: 'scenario',
    question: 'After positive earnings, price breaks key level. Best?',
    options: [
      { id: 'a', text: 'Avoid', isCorrect: false },
      { id: 'b', text: 'Short', isCorrect: false },
      { id: 'c', text: 'Consider long', isCorrect: true },
      { id: 'd', text: 'Wait for crash', isCorrect: false }
    ],
    explanation: 'Positive earnings + breakout is a high-conviction swing setup.',
    difficulty: 'medium',
    category: 'fundamental'
  },
  {
    id: 'swing-q26',
    type: 'scenario',
    question: 'Multiple false breakouts occur. This level is…',
    options: [
      { id: 'a', text: 'Weak', isCorrect: false },
      { id: 'b', text: 'Strong', isCorrect: true },
      { id: 'c', text: 'Random', isCorrect: false },
      { id: 'd', text: 'Entry zone', isCorrect: false }
    ],
    explanation: 'Multiple failures to break a level confirms its strength.',
    difficulty: 'easy',
    category: 'price-action'
  },
  {
    id: 'swing-q27',
    type: 'scenario',
    question: 'You see strong accumulation for weeks. Expect…',
    options: [
      { id: 'a', text: 'Breakdown', isCorrect: false },
      { id: 'b', text: 'Range', isCorrect: false },
      { id: 'c', text: 'Strong breakout', isCorrect: true },
      { id: 'd', text: 'No change', isCorrect: false }
    ],
    explanation: 'Extended accumulation builds energy for significant breakouts.',
    difficulty: 'medium',
    category: 'institutional'
  },
  {
    id: 'swing-q28',
    type: 'scenario',
    question: 'Rising margins indicate…',
    options: [
      { id: 'a', text: 'Weak operations', isCorrect: false },
      { id: 'b', text: 'Improving efficiency', isCorrect: true },
      { id: 'c', text: 'Competition', isCorrect: false },
      { id: 'd', text: 'Overvaluation', isCorrect: false }
    ],
    explanation: 'Rising margins show the company is becoming more efficient and profitable.',
    difficulty: 'medium',
    category: 'fundamental'
  },
  {
    id: 'swing-q29',
    type: 'scenario',
    question: 'Pullback entry fails and breaks trendline. Action?',
    options: [
      { id: 'a', text: 'Add more', isCorrect: false },
      { id: 'b', text: 'Reverse', isCorrect: true },
      { id: 'c', text: 'Hold', isCorrect: false },
      { id: 'd', text: 'Ignore', isCorrect: false }
    ],
    explanation: 'When pullback entry fails and trendline breaks, the setup is invalidated.',
    difficulty: 'hard',
    category: 'risk-management'
  },
  {
    id: 'swing-q30',
    type: 'scenario',
    question: 'Watchlist has weak structures. Do what?',
    options: [
      { id: 'a', text: 'Trade anyway', isCorrect: false },
      { id: 'b', text: 'Reduce size', isCorrect: false },
      { id: 'c', text: 'Wait for strong signals', isCorrect: true },
      { id: 'd', text: 'Exit all', isCorrect: false }
    ],
    explanation: 'When setups are weak, wait patiently for better opportunities.',
    difficulty: 'easy',
    category: 'psychology'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// PATH 4: POSITIONAL TRADER — 30 QUIZ QUESTIONS  
// ─────────────────────────────────────────────────────────────────────────────

export const POSITIONAL_QUIZ: QuizQuestion[] = [
  // MCQ (1-10)
  {
    id: 'positional-q1',
    type: 'mcq',
    question: 'Sector rotation helps identify…',
    options: [
      { id: 'a', text: 'Random stocks', isCorrect: false },
      { id: 'b', text: 'Performer sectors', isCorrect: true },
      { id: 'c', text: 'Noise', isCorrect: false },
      { id: 'd', text: 'Liquidity', isCorrect: false }
    ],
    explanation: 'Tracking sector rotation helps identify where capital is flowing.',
    difficulty: 'easy',
    category: 'macro'
  },
  {
    id: 'positional-q2',
    type: 'mcq',
    question: 'PEG < 1 indicates…',
    options: [
      { id: 'a', text: 'Overvaluation', isCorrect: false },
      { id: 'b', text: 'Undervaluation', isCorrect: true },
      { id: 'c', text: 'Weak growth', isCorrect: false },
      { id: 'd', text: 'None', isCorrect: false }
    ],
    explanation: 'PEG ratio below 1 suggests the stock is undervalued relative to its growth.',
    difficulty: 'easy',
    category: 'valuation'
  },
  {
    id: 'positional-q3',
    type: 'mcq',
    question: 'RS helps identify…',
    options: [
      { id: 'a', text: 'Weak stocks', isCorrect: false },
      { id: 'b', text: 'Market leaders', isCorrect: true },
      { id: 'c', text: 'Penny stocks', isCorrect: false },
      { id: 'd', text: 'Beta stocks', isCorrect: false }
    ],
    explanation: 'Relative Strength identifies outperformers - the leaders in their sectors.',
    difficulty: 'easy',
    category: 'technical'
  },
  {
    id: 'positional-q4',
    type: 'mcq',
    question: 'Fibonacci 61.8% often gives…',
    options: [
      { id: 'a', text: 'Random reversal', isCorrect: false },
      { id: 'b', text: 'Boom/bust', isCorrect: false },
      { id: 'c', text: 'Pullback entry', isCorrect: true },
      { id: 'd', text: 'Overbought', isCorrect: false }
    ],
    explanation: 'The 61.8% Fibonacci level (golden ratio) is a key pullback entry zone.',
    difficulty: 'medium',
    category: 'technical'
  },
  {
    id: 'positional-q5',
    type: 'mcq',
    question: 'High delivery % means…',
    options: [
      { id: 'a', text: 'Traders active', isCorrect: false },
      { id: 'b', text: 'Weak buying', isCorrect: false },
      { id: 'c', text: 'Real accumulation', isCorrect: true },
      { id: 'd', text: 'Volatility spike', isCorrect: false }
    ],
    explanation: 'High delivery shows shares being held - genuine investor interest.',
    difficulty: 'easy',
    category: 'institutional'
  },
  {
    id: 'positional-q6',
    type: 'mcq',
    question: 'DCF helps avoid…',
    options: [
      { id: 'a', text: 'Cheap stocks', isCorrect: false },
      { id: 'b', text: 'Overpriced stocks', isCorrect: true },
      { id: 'c', text: 'Growth stocks', isCorrect: false },
      { id: 'd', text: 'Value stocks', isCorrect: false }
    ],
    explanation: 'DCF valuation helps identify stocks trading above intrinsic value.',
    difficulty: 'medium',
    category: 'valuation'
  },
  {
    id: 'positional-q7',
    type: 'mcq',
    question: 'Rebalancing maintains…',
    options: [
      { id: 'a', text: 'Random exposure', isCorrect: false },
      { id: 'b', text: 'Balanced risk', isCorrect: true },
      { id: 'c', text: 'High volatility', isCorrect: false },
      { id: 'd', text: 'Large positions', isCorrect: false }
    ],
    explanation: 'Rebalancing keeps portfolio risk allocation aligned with targets.',
    difficulty: 'easy',
    category: 'portfolio'
  },
  {
    id: 'positional-q8',
    type: 'mcq',
    question: 'Momentum scores show…',
    options: [
      { id: 'a', text: 'Debt', isCorrect: false },
      { id: 'b', text: 'Profitability', isCorrect: false },
      { id: 'c', text: 'Price strength', isCorrect: true },
      { id: 'd', text: 'Taxes', isCorrect: false }
    ],
    explanation: 'Momentum scores quantify price strength and trend quality.',
    difficulty: 'easy',
    category: 'technical'
  },
  {
    id: 'positional-q9',
    type: 'mcq',
    question: 'Hedging reduces…',
    options: [
      { id: 'a', text: 'Profit', isCorrect: false },
      { id: 'b', text: 'Downside', isCorrect: true },
      { id: 'c', text: 'Trend', isCorrect: false },
      { id: 'd', text: 'Alpha', isCorrect: false }
    ],
    explanation: 'Hedging protects against downside risk during market corrections.',
    difficulty: 'easy',
    category: 'risk-management'
  },
  {
    id: 'positional-q10',
    type: 'mcq',
    question: 'Thesis reviews prevent holding…',
    options: [
      { id: 'a', text: 'Leaders', isCorrect: false },
      { id: 'b', text: 'Overperformers', isCorrect: false },
      { id: 'c', text: 'Weak fundamentals', isCorrect: true },
      { id: 'd', text: 'High quality stocks', isCorrect: false }
    ],
    explanation: 'Regular thesis reviews help exit positions where fundamentals have deteriorated.',
    difficulty: 'medium',
    category: 'research'
  },
  // True/False (11-20)
  {
    id: 'positional-q11',
    type: 'true-false',
    question: 'Policy shifts can trigger themes.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Government policies like PLI schemes create new investment themes.',
    difficulty: 'easy',
    category: 'macro'
  },
  {
    id: 'positional-q12',
    type: 'true-false',
    question: 'Breakout retests are unreliable.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'Retests after breakouts are actually very reliable entry points.',
    difficulty: 'medium',
    category: 'technical'
  },
  {
    id: 'positional-q13',
    type: 'true-false',
    question: 'Peer comparison improves valuation context.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Comparing with peers helps contextualize whether valuation is reasonable.',
    difficulty: 'easy',
    category: 'valuation'
  },
  {
    id: 'positional-q14',
    type: 'true-false',
    question: 'Strong balance sheets reduce risk.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Low debt and strong cash positions provide downside protection.',
    difficulty: 'easy',
    category: 'fundamental'
  },
  {
    id: 'positional-q15',
    type: 'true-false',
    question: 'Correlated holdings increase portfolio risk.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'High correlation means positions move together - magnifying risk.',
    difficulty: 'medium',
    category: 'portfolio'
  },
  {
    id: 'positional-q16',
    type: 'true-false',
    question: 'Momentum is irrelevant for positional trades.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'Momentum helps identify leaders and time entries for positional trades.',
    difficulty: 'medium',
    category: 'technical'
  },
  {
    id: 'positional-q17',
    type: 'true-false',
    question: 'Rebalancing helps maintain risk levels.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Regular rebalancing keeps portfolio aligned with target risk allocation.',
    difficulty: 'easy',
    category: 'portfolio'
  },
  {
    id: 'positional-q18',
    type: 'true-false',
    question: 'Delivery data is useless for positional entries.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'Delivery data confirms genuine buying interest - valuable for entries.',
    difficulty: 'medium',
    category: 'institutional'
  },
  {
    id: 'positional-q19',
    type: 'true-false',
    question: 'Weak earnings revisions weaken swing potential.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Downward earnings revisions signal deteriorating fundamentals.',
    difficulty: 'medium',
    category: 'fundamental'
  },
  {
    id: 'positional-q20',
    type: 'true-false',
    question: 'Long consolidations often precede large moves.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Extended consolidation builds energy for significant breakouts.',
    difficulty: 'easy',
    category: 'technical'
  },
  // Scenario (21-30)
  {
    id: 'positional-q21',
    type: 'scenario',
    question: 'Stock breaks long consolidation with high delivery. Expect…',
    options: [
      { id: 'a', text: 'Low move', isCorrect: false },
      { id: 'b', text: 'Strong multi-week rally', isCorrect: true },
      { id: 'c', text: 'Fakeout', isCorrect: false },
      { id: 'd', text: 'Range', isCorrect: false }
    ],
    explanation: 'High delivery breakout from consolidation signals strong positional move.',
    difficulty: 'medium',
    category: 'technical'
  },
  {
    id: 'positional-q22',
    type: 'scenario',
    question: 'You find PEG = 0.5 and growing margins. Interpretation?',
    options: [
      { id: 'a', text: 'Weak valuation', isCorrect: false },
      { id: 'b', text: 'Cheap growth', isCorrect: true },
      { id: 'c', text: 'Overvaluation', isCorrect: false },
      { id: 'd', text: 'None', isCorrect: false }
    ],
    explanation: 'Low PEG with improving margins indicates undervalued growth opportunity.',
    difficulty: 'medium',
    category: 'valuation'
  },
  {
    id: 'positional-q23',
    type: 'scenario',
    question: 'Sector strong but your pick weak. Action?',
    options: [
      { id: 'a', text: 'Double down', isCorrect: false },
      { id: 'b', text: 'Replace with leader', isCorrect: true },
      { id: 'c', text: 'Hold', isCorrect: false },
      { id: 'd', text: 'Ignore', isCorrect: false }
    ],
    explanation: 'In a strong sector, own leaders not laggards.',
    difficulty: 'medium',
    category: 'institutional'
  },
  {
    id: 'positional-q24',
    type: 'scenario',
    question: 'Balance sheet weak but price rising. Risk?',
    options: [
      { id: 'a', text: 'Zero risk', isCorrect: false },
      { id: 'b', text: 'Hidden fragility', isCorrect: true },
      { id: 'c', text: 'High stability', isCorrect: false },
      { id: 'd', text: 'Strong fundamentals', isCorrect: false }
    ],
    explanation: 'Weak balance sheet means vulnerability to any negative catalyst.',
    difficulty: 'medium',
    category: 'fundamental'
  },
  {
    id: 'positional-q25',
    type: 'scenario',
    question: 'Multiple retests of support before breakout indicate…',
    options: [
      { id: 'a', text: 'Weak zone', isCorrect: false },
      { id: 'b', text: 'Buyers defending', isCorrect: true },
      { id: 'c', text: 'Noise', isCorrect: false },
      { id: 'd', text: 'Failures', isCorrect: false }
    ],
    explanation: 'Multiple defenses of support show strong buying interest at that level.',
    difficulty: 'medium',
    category: 'technical'
  },
  {
    id: 'positional-q26',
    type: 'scenario',
    question: 'RSI at 70 during strong trend means…',
    options: [
      { id: 'a', text: 'Sell', isCorrect: false },
      { id: 'b', text: 'Avoid', isCorrect: false },
      { id: 'c', text: 'Trend strength', isCorrect: true },
      { id: 'd', text: 'Weakness', isCorrect: false }
    ],
    explanation: 'High RSI in strong trends indicates momentum, not necessarily reversal.',
    difficulty: 'hard',
    category: 'technical'
  },
  {
    id: 'positional-q27',
    type: 'scenario',
    question: 'Sudden FII selling and sector breaks. Action?',
    options: [
      { id: 'a', text: 'Add positions', isCorrect: false },
      { id: 'b', text: 'Hedge', isCorrect: true },
      { id: 'c', text: 'Ignore', isCorrect: false },
      { id: 'd', text: 'Exit all', isCorrect: false }
    ],
    explanation: 'FII selling with sector weakness warrants hedging to protect capital.',
    difficulty: 'hard',
    category: 'risk-management'
  },
  {
    id: 'positional-q28',
    type: 'scenario',
    question: 'You see divergence in trend. Likely?',
    options: [
      { id: 'a', text: 'Trend acceleration', isCorrect: false },
      { id: 'b', text: 'Momentum weakening', isCorrect: true },
      { id: 'c', text: 'Random move', isCorrect: false },
      { id: 'd', text: 'No change', isCorrect: false }
    ],
    explanation: 'Divergence signals momentum is fading even as price continues.',
    difficulty: 'medium',
    category: 'technical'
  },
  {
    id: 'positional-q29',
    type: 'scenario',
    question: 'MOS reduces…',
    options: [
      { id: 'a', text: 'Profit', isCorrect: false },
      { id: 'b', text: 'Overvaluation risk', isCorrect: true },
      { id: 'c', text: 'Trend', isCorrect: false },
      { id: 'd', text: 'Liquidity', isCorrect: false }
    ],
    explanation: 'Margin of Safety provides buffer against valuation errors.',
    difficulty: 'easy',
    category: 'valuation'
  },
  {
    id: 'positional-q30',
    type: 'scenario',
    question: 'Thesis broken due to earnings warning. Best?',
    options: [
      { id: 'a', text: 'Add more', isCorrect: false },
      { id: 'b', text: 'Hold', isCorrect: false },
      { id: 'c', text: 'Exit', isCorrect: true },
      { id: 'd', text: 'Double hedge', isCorrect: false }
    ],
    explanation: 'When your investment thesis is broken, exit the position.',
    difficulty: 'easy',
    category: 'research'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// PATH 5: LONG-TERM INVESTOR — 30 QUIZ QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const INVESTOR_QUIZ: QuizQuestion[] = [
  // MCQ (1-10)
  {
    id: 'investor-q1',
    type: 'mcq',
    question: 'Free cash flow is important because it…',
    options: [
      { id: 'a', text: 'Is accounting-only', isCorrect: false },
      { id: 'b', text: 'Funds growth & dividends', isCorrect: true },
      { id: 'c', text: 'Creates debt', isCorrect: false },
      { id: 'd', text: 'Does nothing', isCorrect: false }
    ],
    explanation: 'FCF represents real money available for reinvestment and dividends.',
    difficulty: 'easy',
    category: 'fundamental'
  },
  {
    id: 'investor-q2',
    type: 'mcq',
    question: 'High ROE from leverage is…',
    options: [
      { id: 'a', text: 'Good', isCorrect: false },
      { id: 'b', text: 'Risky', isCorrect: true },
      { id: 'c', text: 'Neutral', isCorrect: false },
      { id: 'd', text: 'Always safe', isCorrect: false }
    ],
    explanation: 'ROE driven by high debt leverage increases risk and fragility.',
    difficulty: 'medium',
    category: 'fundamental'
  },
  {
    id: 'investor-q3',
    type: 'mcq',
    question: 'DCF helps find…',
    options: [
      { id: 'a', text: 'Market noise', isCorrect: false },
      { id: 'b', text: 'Intrinsic value', isCorrect: true },
      { id: 'c', text: 'Beta', isCorrect: false },
      { id: 'd', text: 'Dividends', isCorrect: false }
    ],
    explanation: 'DCF calculates intrinsic value based on future cash flows.',
    difficulty: 'easy',
    category: 'valuation'
  },
  {
    id: 'investor-q4',
    type: 'mcq',
    question: 'Defensive sectors perform well in…',
    options: [
      { id: 'a', text: 'Booms', isCorrect: false },
      { id: 'b', text: 'Recessions', isCorrect: true },
      { id: 'c', text: 'Euphoria', isCorrect: false },
      { id: 'd', text: 'Melt-ups', isCorrect: false }
    ],
    explanation: 'Defensive sectors like FMCG and pharma hold up during recessions.',
    difficulty: 'easy',
    category: 'sector'
  },
  {
    id: 'investor-q5',
    type: 'mcq',
    question: 'Terminal value represents…',
    options: [
      { id: 'a', text: 'Short-term profit', isCorrect: false },
      { id: 'b', text: 'Long-term business value', isCorrect: true },
      { id: 'c', text: 'Dividends', isCorrect: false },
      { id: 'd', text: 'Beta', isCorrect: false }
    ],
    explanation: 'Terminal value captures the business value beyond the forecast period.',
    difficulty: 'medium',
    category: 'valuation'
  },
  {
    id: 'investor-q6',
    type: 'mcq',
    question: 'EV/EBITDA is better than P/E for…',
    options: [
      { id: 'a', text: 'Asset-light', isCorrect: false },
      { id: 'b', text: 'Capital-heavy', isCorrect: true },
      { id: 'c', text: 'FMCG', isCorrect: false },
      { id: 'd', text: 'Pharma', isCorrect: false }
    ],
    explanation: 'EV/EBITDA accounts for debt, making it better for capital-heavy companies.',
    difficulty: 'medium',
    category: 'valuation'
  },
  {
    id: 'investor-q7',
    type: 'mcq',
    question: 'Moats protect…',
    options: [
      { id: 'a', text: 'Short-term gains', isCorrect: false },
      { id: 'b', text: 'Competitive advantage', isCorrect: true },
      { id: 'c', text: 'Debt levels', isCorrect: false },
      { id: 'd', text: 'EPS alone', isCorrect: false }
    ],
    explanation: 'Economic moats protect a company\'s competitive position long-term.',
    difficulty: 'easy',
    category: 'quality'
  },
  {
    id: 'investor-q8',
    type: 'mcq',
    question: 'DRIP helps…',
    options: [
      { id: 'a', text: 'Tax saving', isCorrect: false },
      { id: 'b', text: 'Automatic compounding', isCorrect: true },
      { id: 'c', text: 'Deleveraging', isCorrect: false },
      { id: 'd', text: 'Hedging', isCorrect: false }
    ],
    explanation: 'Dividend reinvestment compounds wealth automatically over time.',
    difficulty: 'easy',
    category: 'dividends'
  },
  {
    id: 'investor-q9',
    type: 'mcq',
    question: '60/40 allocation gives…',
    options: [
      { id: 'a', text: 'Max gains', isCorrect: false },
      { id: 'b', text: 'Balanced risk', isCorrect: true },
      { id: 'c', text: 'High volatility', isCorrect: false },
      { id: 'd', text: 'Instability', isCorrect: false }
    ],
    explanation: '60% equity/40% debt provides balanced risk-return for long-term investing.',
    difficulty: 'easy',
    category: 'portfolio'
  },
  {
    id: 'investor-q10',
    type: 'mcq',
    question: 'Sharpe ratio measures…',
    options: [
      { id: 'a', text: 'Debt quality', isCorrect: false },
      { id: 'b', text: 'Risk-adjusted returns', isCorrect: true },
      { id: 'c', text: 'Volatility only', isCorrect: false },
      { id: 'd', text: 'Operating margin', isCorrect: false }
    ],
    explanation: 'Sharpe ratio measures returns relative to risk taken.',
    difficulty: 'medium',
    category: 'portfolio'
  },
  // True/False (11-20)
  {
    id: 'investor-q11',
    type: 'true-false',
    question: 'Cash flow is more reliable than net profit.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Cash flow shows real money generated, harder to manipulate than accounting profit.',
    difficulty: 'easy',
    category: 'fundamental'
  },
  {
    id: 'investor-q12',
    type: 'true-false',
    question: 'High dividend yield is always positive.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'Very high yields may indicate unsustainable dividends or stock price decline.',
    difficulty: 'medium',
    category: 'dividends'
  },
  {
    id: 'investor-q13',
    type: 'true-false',
    question: 'PEG ratio helps evaluate growth fairly.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'PEG adjusts P/E for growth rate, making growth stocks comparable.',
    difficulty: 'easy',
    category: 'valuation'
  },
  {
    id: 'investor-q14',
    type: 'true-false',
    question: 'Diversification reduces risk.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Spreading investments reduces company-specific risk.',
    difficulty: 'easy',
    category: 'portfolio'
  },
  {
    id: 'investor-q15',
    type: 'true-false',
    question: 'Long-term investing requires frequent trading.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'Long-term investing means holding quality companies patiently.',
    difficulty: 'easy',
    category: 'psychology'
  },
  {
    id: 'investor-q16',
    type: 'true-false',
    question: 'Terminal value should use conservative assumptions.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Terminal value is sensitive to assumptions - conservative is safer.',
    difficulty: 'medium',
    category: 'valuation'
  },
  {
    id: 'investor-q17',
    type: 'true-false',
    question: 'Great businesses rarely need heavy debt.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Quality businesses generate strong cash flows and need less debt.',
    difficulty: 'medium',
    category: 'quality'
  },
  {
    id: 'investor-q18',
    type: 'true-false',
    question: 'Annual thesis reviews prevent holding deteriorating companies.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Regular reviews help identify when fundamentals have changed.',
    difficulty: 'easy',
    category: 'psychology'
  },
  {
    id: 'investor-q19',
    type: 'true-false',
    question: 'DRIPs reduce compounding.',
    options: [
      { id: 'true', text: 'True', isCorrect: false },
      { id: 'false', text: 'False', isCorrect: true }
    ],
    explanation: 'DRIPs enhance compounding by reinvesting dividends automatically.',
    difficulty: 'easy',
    category: 'dividends'
  },
  {
    id: 'investor-q20',
    type: 'true-false',
    question: 'Economic cycles affect long-term portfolios.',
    options: [
      { id: 'true', text: 'True', isCorrect: true },
      { id: 'false', text: 'False', isCorrect: false }
    ],
    explanation: 'Cycles create volatility but also opportunities for long-term investors.',
    difficulty: 'easy',
    category: 'sector'
  },
  // Scenario (21-30)
  {
    id: 'investor-q21',
    type: 'scenario',
    question: 'Earnings consistent for 10 years, low debt, rising margins. This is…',
    options: [
      { id: 'a', text: 'Weak business', isCorrect: false },
      { id: 'b', text: 'Compounder', isCorrect: true },
      { id: 'c', text: 'Value trap', isCorrect: false },
      { id: 'd', text: 'Gamble', isCorrect: false }
    ],
    explanation: 'Consistent earnings, low debt, and improving margins = quality compounder.',
    difficulty: 'easy',
    category: 'quality'
  },
  {
    id: 'investor-q22',
    type: 'scenario',
    question: 'Stock P/E = 80 with slowing growth. Likely…',
    options: [
      { id: 'a', text: 'Cheap', isCorrect: false },
      { id: 'b', text: 'Expensive', isCorrect: true },
      { id: 'c', text: 'Stable', isCorrect: false },
      { id: 'd', text: 'Defensive', isCorrect: false }
    ],
    explanation: 'High P/E with slowing growth suggests overvaluation.',
    difficulty: 'medium',
    category: 'valuation'
  },
  {
    id: 'investor-q23',
    type: 'scenario',
    question: 'Market correction but fundamentals unchanged. Best action?',
    options: [
      { id: 'a', text: 'Panic sell', isCorrect: false },
      { id: 'b', text: 'Hold or accumulate', isCorrect: true },
      { id: 'c', text: 'Short', isCorrect: false },
      { id: 'd', text: 'Exit all', isCorrect: false }
    ],
    explanation: 'If fundamentals are intact, corrections create buying opportunities.',
    difficulty: 'easy',
    category: 'psychology'
  },
  {
    id: 'investor-q24',
    type: 'scenario',
    question: 'Company generates profits but negative cash flows. Means…',
    options: [
      { id: 'a', text: 'High quality', isCorrect: false },
      { id: 'b', text: 'Earnings manipulation possible', isCorrect: true },
      { id: 'c', text: 'No issue', isCorrect: false },
      { id: 'd', text: 'Dividend stock', isCorrect: false }
    ],
    explanation: 'Profits without cash flow raises red flags about earnings quality.',
    difficulty: 'hard',
    category: 'quality'
  },
  {
    id: 'investor-q25',
    type: 'scenario',
    question: 'Sector booming but your stock lags. Means…',
    options: [
      { id: 'a', text: 'Leader', isCorrect: false },
      { id: 'b', text: 'Weak choice', isCorrect: true },
      { id: 'c', text: 'Strong moat', isCorrect: false },
      { id: 'd', text: 'Best pick', isCorrect: false }
    ],
    explanation: 'Underperforming in a strong sector indicates fundamental weakness.',
    difficulty: 'easy',
    category: 'sector'
  },
  {
    id: 'investor-q26',
    type: 'scenario',
    question: 'Your thesis breaks due to regulatory change. Action?',
    options: [
      { id: 'a', text: 'Ignore', isCorrect: false },
      { id: 'b', text: 'Double down', isCorrect: false },
      { id: 'c', text: 'Exit', isCorrect: true },
      { id: 'd', text: 'Add more', isCorrect: false }
    ],
    explanation: 'When the fundamental thesis is broken, exit the position.',
    difficulty: 'easy',
    category: 'psychology'
  },
  {
    id: 'investor-q27',
    type: 'scenario',
    question: 'Stock grows earnings but margins fall yearly. Means…',
    options: [
      { id: 'a', text: 'Strong growth', isCorrect: false },
      { id: 'b', text: 'Weakening efficiency', isCorrect: true },
      { id: 'c', text: 'High moat', isCorrect: false },
      { id: 'd', text: 'Defensive trend', isCorrect: false }
    ],
    explanation: 'Falling margins despite revenue growth shows deteriorating business quality.',
    difficulty: 'medium',
    category: 'fundamental'
  },
  {
    id: 'investor-q28',
    type: 'scenario',
    question: 'Investor wants stable income. Best pick?',
    options: [
      { id: 'a', text: 'High beta', isCorrect: false },
      { id: 'b', text: 'Dividend grower', isCorrect: true },
      { id: 'c', text: 'Penny stock', isCorrect: false },
      { id: 'd', text: 'Turnaround', isCorrect: false }
    ],
    explanation: 'Dividend growth stocks provide stable, growing income streams.',
    difficulty: 'easy',
    category: 'dividends'
  },
  {
    id: 'investor-q29',
    type: 'scenario',
    question: 'Portfolio overweight in one sector. Risk?',
    options: [
      { id: 'a', text: 'None', isCorrect: false },
      { id: 'b', text: 'High concentration risk', isCorrect: true },
      { id: 'c', text: 'Faster compounding', isCorrect: false },
      { id: 'd', text: 'Lower volatility', isCorrect: false }
    ],
    explanation: 'Sector concentration exposes portfolio to sector-specific risks.',
    difficulty: 'easy',
    category: 'portfolio'
  },
  {
    id: 'investor-q30',
    type: 'scenario',
    question: 'Strong business but overvalued. Best approach?',
    options: [
      { id: 'a', text: 'Buy immediately', isCorrect: false },
      { id: 'b', text: 'Wait for MOS', isCorrect: true },
      { id: 'c', text: 'Short', isCorrect: false },
      { id: 'd', text: 'Avoid permanently', isCorrect: false }
    ],
    explanation: 'Even great businesses need to be bought at reasonable valuations.',
    difficulty: 'medium',
    category: 'valuation'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// ALL QUIZZES - Organized by Path
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_QUIZZES: Quiz[] = [
  {
    pathId: 'scalper-path',
    pathName: 'Scalper Mastery',
    description: 'Test your scalping knowledge with 30 questions',
    passingScore: 70,
    timeLimit: 20,
    questions: SCALPER_QUIZ
  },
  {
    pathId: 'intraday-path',
    pathName: 'Intraday Trader',
    description: 'Test your intraday trading knowledge',
    passingScore: 70,
    timeLimit: 20,
    questions: INTRADAY_QUIZ
  },
  {
    pathId: 'swing-path',
    pathName: 'Swing Trader',
    description: 'Test your swing trading knowledge',
    passingScore: 70,
    timeLimit: 20,
    questions: SWING_QUIZ
  },
  {
    pathId: 'positional-path',
    pathName: 'Positional Trader',
    description: 'Test your positional trading knowledge',
    passingScore: 70,
    timeLimit: 20,
    questions: POSITIONAL_QUIZ
  },
  {
    pathId: 'investor-path',
    pathName: 'Long-Term Investor',
    description: 'Test your investing knowledge',
    passingScore: 70,
    timeLimit: 25,
    questions: INVESTOR_QUIZ
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export function getQuizForPath(pathId: string): Quiz | undefined {
  return ALL_QUIZZES.find(quiz => quiz.pathId === pathId);
}

export function getQuestionsByType(pathId: string, type: QuestionType): QuizQuestion[] {
  const quiz = getQuizForPath(pathId);
  if (!quiz) return [];
  return quiz.questions.filter(q => q.type === type);
}

export function getQuestionsByDifficulty(pathId: string, difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion[] {
  const quiz = getQuizForPath(pathId);
  if (!quiz) return [];
  return quiz.questions.filter(q => q.difficulty === difficulty);
}

export function shuffleQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function calculateScore(answers: Record<string, string>, questions: QuizQuestion[]): {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
} {
  let correct = 0;
  questions.forEach(q => {
    const userAnswer = answers[q.id];
    const correctOption = q.options.find(o => o.isCorrect);
    if (correctOption && userAnswer === correctOption.id) {
      correct++;
    }
  });
  
  const percentage = Math.round((correct / questions.length) * 100);
  
  return {
    score: correct,
    total: questions.length,
    percentage,
    passed: percentage >= 70,
    passingScore: 70
  };
}

export function getSubsetQuiz(pathId: string, count: number): QuizQuestion[] {
  const quiz = getQuizForPath(pathId);
  if (!quiz) return [];
  
  const shuffled = shuffleQuestions(quiz.questions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
