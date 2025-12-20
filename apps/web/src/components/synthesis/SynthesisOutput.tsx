// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED SYNTHESIS OUTPUT COMPONENT
// Renders synthesis results in a comprehensive dashboard view
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import { SynthesisResult } from "@/lib/synthesis";

interface Props {
  result: SynthesisResult;
  showDetails?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const SentimentBadge = ({ sentiment }: { sentiment: string }) => {
  const colors = {
    bullish: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    bearish: "bg-red-500/20 text-red-400 border-red-500/30",
    neutral: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded border text-xs font-medium ${colors[sentiment] || colors.neutral}`}>
      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
    </span>
  );
};

const ScoreGauge = ({ score, label }: { score: number; label: string }) => {
  const color = score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-200 font-medium">{score}</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
};

const InsightCard = ({ insight }: { insight: SynthesisResult["keyTakeaways"][0] }) => {
  const icons = {
    strength: "✓",
    weakness: "⚠",
    opportunity: "★",
    risk: "⚡",
    action: "→",
    observation: "○",
  };
  const colors = {
    strength: "border-emerald-500/30 bg-emerald-900/20",
    weakness: "border-amber-500/30 bg-amber-900/20",
    opportunity: "border-blue-500/30 bg-blue-900/20",
    risk: "border-red-500/30 bg-red-900/20",
    action: "border-purple-500/30 bg-purple-900/20",
    observation: "border-slate-500/30 bg-slate-800/30",
  };
  
  return (
    <div className={`border rounded-lg p-3 ${colors[insight.type] || colors.observation}`}>
      <div className="flex items-start gap-2">
        <span className="text-lg">{icons[insight.type] || "○"}</span>
        <div className="flex-1">
          <p className="text-sm text-slate-200">{insight.message}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-slate-500">
              From: {insight.sources.join(", ")}
            </span>
            <span className={`text-[10px] ${insight.confidence === "high" ? "text-emerald-400" : "text-slate-400"}`}>
              {insight.confidence} confidence
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({ action }: { action: SynthesisResult["actionItems"][0] }) => {
  const urgencyColors = {
    immediate: "bg-red-500",
    soon: "bg-amber-500",
    monitor: "bg-blue-500",
  };
  
  return (
    <div className="flex items-center gap-3 p-2 rounded bg-slate-800/50">
      <span className={`w-2 h-2 rounded-full ${urgencyColors[action.urgency]}`} />
      <div className="flex-1">
        <p className="text-sm text-slate-200">{action.action}</p>
        <span className="text-[10px] text-slate-500">{action.source}</span>
      </div>
      <span className="text-[10px] text-slate-400 uppercase">{action.urgency}</span>
    </div>
  );
};

const ConflictCard = ({ conflict }: { conflict: SynthesisResult["conflicts"][0] }) => (
  <div className="border border-amber-500/30 bg-amber-900/10 rounded-lg p-3">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-amber-400">⚠</span>
      <span className="text-sm font-medium text-amber-300">{conflict.topic}</span>
    </div>
    <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
      <div>
        <span className="text-emerald-400">Bullish: </span>
        <span className="text-slate-400">{conflict.bullishCards.join(", ")}</span>
      </div>
      <div>
        <span className="text-red-400">Bearish: </span>
        <span className="text-slate-400">{conflict.bearishCards.join(", ")}</span>
      </div>
    </div>
    <p className="text-xs text-slate-400">{conflict.resolution}</p>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function SynthesisOutput({ result, showDetails = true }: Props) {
  const {
    symbol,
    asOf,
    overallSentiment,
    overallConfidence,
    overallScore,
    categoryScores,
    headline,
    keyTakeaways,
    conflicts,
    topMetrics,
    actionItems,
    cardSummaries,
    allTags,
    suggestedCards,
  } = result;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-slate-100">{symbol} Synthesis</h2>
              <SentimentBadge sentiment={overallSentiment} />
            </div>
            <p className="text-sm text-slate-400">{headline}</p>
            <p className="text-xs text-slate-500 mt-1">As of {asOf} • {overallConfidence} confidence</p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${overallScore >= 60 ? "text-emerald-400" : overallScore >= 40 ? "text-amber-400" : "text-red-400"}`}>
              {overallScore}
            </div>
            <div className="text-[10px] text-slate-500 uppercase">Overall Score</div>
          </div>
        </div>
      </div>

      {/* Category Scores */}
      <div className="p-5 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Category Breakdown</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(categoryScores).map(([cat, data]) => (
            <div key={cat} className="space-y-1">
              <ScoreGauge score={data.score} label={cat.charAt(0).toUpperCase() + cat.slice(1)} />
              <div className="flex justify-between text-[10px]">
                <SentimentBadge sentiment={data.sentiment} />
                <span className="text-slate-500">{(data.weight * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Takeaways */}
      {keyTakeaways.length > 0 && (
        <div className="p-5 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Key Takeaways</h3>
          <div className="grid grid-cols-2 gap-3">
            {keyTakeaways.map((insight, i) => (
              <InsightCard key={i} insight={insight} />
            ))}
          </div>
        </div>
      )}

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <div className="p-5 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-amber-300 mb-3">⚠ Conflicting Signals</h3>
          <div className="grid grid-cols-2 gap-3">
            {conflicts.map((conflict, i) => (
              <ConflictCard key={i} conflict={conflict} />
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      {actionItems.length > 0 && (
        <div className="p-5 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Action Items</h3>
          <div className="space-y-2">
            {actionItems.map((action, i) => (
              <ActionCard key={i} action={action} />
            ))}
          </div>
        </div>
      )}

      {showDetails && (
        <>
          {/* Top Metrics */}
          {topMetrics.length > 0 && (
            <div className="p-5 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Key Metrics</h3>
              <div className="grid grid-cols-5 gap-3">
                {topMetrics.slice(0, 10).map((metric, i) => (
                  <div key={i} className="bg-slate-800/50 rounded p-2">
                    <div className="text-xs text-slate-400">{metric.label}</div>
                    <div className="text-lg font-bold text-slate-100">
                      {typeof metric.value === "number" ? metric.value.toFixed(1) : metric.value}
                    </div>
                    <div className={`text-[10px] ${
                      metric.interpretation === "excellent" ? "text-emerald-400" :
                      metric.interpretation === "good" ? "text-emerald-300" :
                      metric.interpretation === "poor" ? "text-red-400" :
                      metric.interpretation === "risky" ? "text-amber-400" :
                      "text-slate-400"
                    }`}>
                      {metric.interpretation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card Summaries */}
          {cardSummaries.length > 0 && (
            <div className="p-5 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">
                Card Analysis ({cardSummaries.length} cards)
              </h3>
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="text-slate-500 uppercase">
                    <tr>
                      <th className="text-left p-1">Card</th>
                      <th className="text-left p-1">Category</th>
                      <th className="text-left p-1">Sentiment</th>
                      <th className="text-right p-1">Score</th>
                      <th className="text-left p-1">Top Insight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cardSummaries.map((card, i) => (
                      <tr key={i} className="border-t border-slate-800">
                        <td className="p-1 text-slate-200">{card.cardId}</td>
                        <td className="p-1 text-slate-400">{card.category}</td>
                        <td className="p-1"><SentimentBadge sentiment={card.sentiment} /></td>
                        <td className="p-1 text-right text-slate-200">{card.score}</td>
                        <td className="p-1 text-slate-400 truncate max-w-xs">{card.topInsight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div className="p-4 bg-slate-800/30">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {allTags.slice(0, 8).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 bg-slate-700/50 rounded text-[10px] text-slate-400">
                {tag}
              </span>
            ))}
          </div>
          {suggestedCards.length > 0 && (
            <div className="text-[10px] text-slate-500">
              Suggested: {suggestedCards.slice(0, 3).join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPACT VARIANT
// ═══════════════════════════════════════════════════════════════════════════

export function SynthesisOutputCompact({ result }: { result: SynthesisResult }) {
  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-slate-100">{result.symbol}</span>
          <SentimentBadge sentiment={result.overallSentiment} />
        </div>
        <span className={`text-2xl font-bold ${
          result.overallScore >= 60 ? "text-emerald-400" : 
          result.overallScore >= 40 ? "text-amber-400" : "text-red-400"
        }`}>
          {result.overallScore}
        </span>
      </div>
      <p className="text-sm text-slate-400 mb-3">{result.headline}</p>
      {result.keyTakeaways.length > 0 && (
        <div className="space-y-1">
          {result.keyTakeaways.slice(0, 3).map((insight, i) => (
            <p key={i} className="text-xs text-slate-300">• {insight.message}</p>
          ))}
        </div>
      )}
    </div>
  );
}
