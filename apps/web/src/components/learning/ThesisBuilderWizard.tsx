// ═══════════════════════════════════════════════════════════════════════════
// THESIS BUILDER WIZARD
// Guided wizard to create structured investment thesis using Monomorph tools
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface ThesisMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  threshold: string;
  importance: 'critical' | 'important' | 'nice_to_have';
}

interface InvestmentThesis {
  // Step 1: Stock Selection
  symbol: string;
  companyName: string;
  sector: string;
  
  // Step 2: Investment Type
  investmentType: 'value' | 'growth' | 'momentum' | 'turnaround' | 'dividend' | 'event';
  timeHorizon: '3m' | '6m' | '1y' | '2-3y' | '5y+';
  
  // Step 3: Thesis Core
  summary: string;
  keyReasons: string[];
  
  // Step 4: Valuation & Targets
  entryPrice: string;
  targetPrice: string;
  stopLoss: string;
  positionSize: string;
  
  // Step 5: Metrics to Track
  metrics: ThesisMetric[];
  
  // Step 6: Risks & Catalysts
  risks: string[];
  catalysts: string[];
  
  // Step 7: Review Cadence
  reviewFrequency: 'weekly' | 'monthly' | 'quarterly';
  thesisBreakers: string[];
}

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const INVESTMENT_TYPES = [
  { id: 'value', label: 'Value Investing', icon: '💎', desc: 'Undervalued stocks trading below intrinsic value', tools: ['dcf-valuation', 'intrinsic-value-range', 'piotroski-score'] },
  { id: 'growth', label: 'Growth Investing', icon: '🚀', desc: 'Companies with high revenue/earnings growth', tools: ['growth-summary', 'earnings-quality', 'sales-profit-cash'] },
  { id: 'momentum', label: 'Momentum Trading', icon: '📈', desc: 'Riding strong price trends', tools: ['trend-strength', 'momentum-heatmap', 'technical-indicators'] },
  { id: 'turnaround', label: 'Turnaround Play', icon: '🔄', desc: 'Companies recovering from difficulties', tools: ['financial-stress-radar', 'management-quality', 'capital-allocation'] },
  { id: 'dividend', label: 'Dividend Income', icon: '💰', desc: 'Stable dividend-paying stocks', tools: ['dividend-crystal-ball', 'income-stability', 'cashflow-stability-index'] },
  { id: 'event', label: 'Event Driven', icon: '⚡', desc: 'M&A, earnings, regulatory events', tools: ['earnings-calendar', 'earnings-surprise', 'macro-calendar'] },
];

const TIME_HORIZONS = [
  { id: '3m', label: '3 Months', desc: 'Short-term trading' },
  { id: '6m', label: '6 Months', desc: 'Swing/positional' },
  { id: '1y', label: '1 Year', desc: 'Medium-term investing' },
  { id: '2-3y', label: '2-3 Years', desc: 'Long-term investing' },
  { id: '5y+', label: '5+ Years', desc: 'Core portfolio holding' },
];

const DEFAULT_METRICS: Record<string, ThesisMetric[]> = {
  value: [
    { id: 'm1', name: 'P/E Ratio', value: '', unit: 'x', threshold: '20', importance: 'critical' },
    { id: 'm2', name: 'P/B Ratio', value: '', unit: 'x', threshold: '15', importance: 'important' },
    { id: 'm3', name: 'Debt/Equity', value: '', unit: 'x', threshold: '25', importance: 'critical' },
  ],
  growth: [
    { id: 'm1', name: 'Revenue Growth', value: '', unit: '%', threshold: '30', importance: 'critical' },
    { id: 'm2', name: 'EPS Growth', value: '', unit: '%', threshold: '30', importance: 'critical' },
    { id: 'm3', name: 'ROE', value: '', unit: '%', threshold: '15', importance: 'important' },
  ],
  momentum: [
    { id: 'm1', name: 'Relative Strength', value: '', unit: 'vs Nifty', threshold: '20', importance: 'critical' },
    { id: 'm2', name: 'Volume Trend', value: '', unit: '%', threshold: '30', importance: 'important' },
    { id: 'm3', name: 'Price vs 50 EMA', value: '', unit: '%', threshold: '10', importance: 'important' },
  ],
  turnaround: [
    { id: 'm1', name: 'Operating Margin', value: '', unit: '%', threshold: '25', importance: 'critical' },
    { id: 'm2', name: 'Debt/Equity', value: '', unit: 'x', threshold: '30', importance: 'critical' },
    { id: 'm3', name: 'Cash Flow', value: '', unit: 'Cr', threshold: '50', importance: 'critical' },
  ],
  dividend: [
    { id: 'm1', name: 'Dividend Yield', value: '', unit: '%', threshold: '20', importance: 'critical' },
    { id: 'm2', name: 'Payout Ratio', value: '', unit: '%', threshold: '15', importance: 'important' },
    { id: 'm3', name: 'Dividend Growth', value: '', unit: '%', threshold: '25', importance: 'important' },
  ],
  event: [
    { id: 'm1', name: 'Event Date', value: '', unit: 'date', threshold: '', importance: 'critical' },
    { id: 'm2', name: 'Expected Move', value: '', unit: '%', threshold: '30', importance: 'critical' },
    { id: 'm3', name: 'IV Percentile', value: '', unit: '%', threshold: '20', importance: 'important' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// STEP COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

interface StepProps {
  thesis: InvestmentThesis;
  updateThesis: (updates: Partial<InvestmentThesis>) => void;
}

function Step1StockSelection({ thesis, updateThesis }: StepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-slate-300 mb-1.5">Stock Symbol *</label>
        <input
          type="text"
          value={thesis.symbol}
          onChange={(e) => updateThesis({ symbol: e.target.value.toUpperCase() })}
          placeholder="e.g., TCS"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-1.5">Company Name</label>
        <input
          type="text"
          value={thesis.companyName}
          onChange={(e) => updateThesis({ companyName: e.target.value })}
          placeholder="e.g., Tata Consultancy Services"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-1.5">Sector</label>
        <select
          value={thesis.sector}
          onChange={(e) => updateThesis({ sector: e.target.value })}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-indigo-500"
        >
          <option value="">Select sector...</option>
          <option value="IT">Information Technology</option>
          <option value="Banking">Banking</option>
          <option value="NBFC">NBFC</option>
          <option value="Pharma">Pharmaceuticals</option>
          <option value="Auto">Automobiles</option>
          <option value="FMCG">FMCG</option>
          <option value="Energy">Energy</option>
          <option value="Infra">Infrastructure</option>
          <option value="Metals">Metals & Mining</option>
          <option value="Chemicals">Chemicals</option>
          <option value="Realty">Real Estate</option>
          <option value="Telecom">Telecom</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div className="bg-indigo-900/30 border border-indigo-800 rounded-lg p-4 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-indigo-400">💡</span>
          <span className="font-medium text-slate-200">Pro Tip</span>
        </div>
        <p className="text-sm text-slate-400">
          Before building your thesis, run the <span className="text-indigo-400">Stock Snapshot</span> tool to get a quick overview of the company's fundamentals, technicals, and recent price action.
        </p>
      </div>
    </div>
  );
}

function Step2InvestmentType({ thesis, updateThesis }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-slate-300 mb-3">What type of investment is this?</label>
        <div className="grid grid-cols-2 gap-3">
          {INVESTMENT_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => updateThesis({ 
                investmentType: type.id as InvestmentThesis['investmentType'],
                metrics: DEFAULT_METRICS[type.id] || []
              })}
              className={`p-4 rounded-xl border text-left transition-all ${
                thesis.investmentType === type.id
                  ? 'border-indigo-500 bg-indigo-900/30'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{type.icon}</span>
                <span className="font-medium text-white">{type.label}</span>
              </div>
              <p className="text-xs text-slate-400">{type.desc}</p>
              {thesis.investmentType === type.id && (
                <div className="mt-2 pt-2 border-t border-slate-700">
                  <div className="text-xs text-indigo-400">Recommended tools:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {type.tools.map(tool => (
                      <span key={tool} className="px-1.5 py-0.5 text-xs bg-indigo-900/50 text-indigo-300 rounded">{tool}</span>
                    ))}
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm text-slate-300 mb-3">Investment Time Horizon</label>
        <div className="flex flex-wrap gap-2">
          {TIME_HORIZONS.map(h => (
            <button
              key={h.id}
              onClick={() => updateThesis({ timeHorizon: h.id as InvestmentThesis['timeHorizon'] })}
              className={`px-4 py-2 rounded-lg border transition-all ${
                thesis.timeHorizon === h.id
                  ? 'border-indigo-500 bg-indigo-900/30 text-white'
                  : 'border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className="font-medium">{h.label}</div>
              <div className="text-xs opacity-70">{h.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3ThesisCore({ thesis, updateThesis }: StepProps) {
  const [newReason, setNewReason] = useState('');
  
  const addReason = () => {
    if (newReason.trim()) {
      updateThesis({ keyReasons: [...thesis.keyReasons, newReason.trim()] });
      setNewReason('');
    }
  };
  
  const removeReason = (index: number) => {
    updateThesis({ keyReasons: thesis.keyReasons.filter((_, i) => i !== index) });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-slate-300 mb-1.5">Thesis Summary *</label>
        <textarea
          value={thesis.summary}
          onChange={(e) => updateThesis({ summary: e.target.value })}
          placeholder="Describe your investment thesis in 2-3 sentences. Why are you buying this stock?"
          rows={4}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-indigo-500 resize-none"
        />
        <div className="text-xs text-slate-500 mt-1">{thesis.summary.length}/500 characters</div>
      </div>
      
      <div>
        <label className="block text-sm text-slate-300 mb-1.5">Key Reasons (add 2-5)</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addReason()}
            placeholder="e.g., Strong deal pipeline growth"
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          <button onClick={addReason} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500">Add</button>
        </div>
        <div className="space-y-2">
          {thesis.keyReasons.map((reason, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
              <span className="text-emerald-400">✓</span>
              <span className="flex-1 text-sm text-slate-200">{reason}</span>
              <button onClick={() => removeReason(i)} className="text-slate-500 hover:text-red-400">×</button>
            </div>
          ))}
        </div>
        {thesis.keyReasons.length === 0 && (
          <div className="text-xs text-slate-500 mt-2">Add at least 2 key reasons for your investment</div>
        )}
      </div>
    </div>
  );
}

function Step4Valuation({ thesis, updateThesis }: StepProps) {
  const calcUpside = () => {
    const entry = parseFloat(thesis.entryPrice) || 0;
    const target = parseFloat(thesis.targetPrice) || 0;
    return entry > 0 && target > 0 ? ((target - entry) / entry * 100).toFixed(1) : '0';
  };
  
  const calcRisk = () => {
    const entry = parseFloat(thesis.entryPrice) || 0;
    const stop = parseFloat(thesis.stopLoss) || 0;
    return entry > 0 && stop > 0 ? ((entry - stop) / entry * 100).toFixed(1) : '0';
  };
  
  const riskReward = () => {
    const upside = parseFloat(calcUpside());
    const risk = parseFloat(calcRisk());
    return risk > 0 ? (upside / risk).toFixed(1) : '0';
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1.5">Entry Price *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
            <input
              type="number"
              value={thesis.entryPrice}
              onChange={(e) => updateThesis({ entryPrice: e.target.value })}
              placeholder="0"
              className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1.5">Target Price *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
            <input
              type="number"
              value={thesis.targetPrice}
              onChange={(e) => updateThesis({ targetPrice: e.target.value })}
              placeholder="0"
              className="w-full pl-8 pr-4 py-3 bg-emerald-900/30 border border-emerald-800 rounded-lg text-emerald-400 placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1.5">Stop Loss *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
            <input
              type="number"
              value={thesis.stopLoss}
              onChange={(e) => updateThesis({ stopLoss: e.target.value })}
              placeholder="0"
              className="w-full pl-8 pr-4 py-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 placeholder-slate-500 outline-none focus:border-red-500"
            />
          </div>
        </div>
      </div>
      
      {/* Risk/Reward Summary */}
      <div className="grid grid-cols-3 gap-4 bg-slate-800/50 rounded-xl p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">+{calcUpside()}%</div>
          <div className="text-xs text-slate-500">Potential Upside</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">-{calcRisk()}%</div>
          <div className="text-xs text-slate-500">Downside Risk</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${parseFloat(riskReward()) >= 2 ? 'text-emerald-400' : parseFloat(riskReward()) >= 1 ? 'text-amber-400' : 'text-red-400'}`}>
            {riskReward()}:1
          </div>
          <div className="text-xs text-slate-500">Risk:Reward</div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm text-slate-300 mb-1.5">Position Size (% of portfolio)</label>
        <input
          type="number"
          value={thesis.positionSize}
          onChange={(e) => updateThesis({ positionSize: e.target.value })}
          placeholder="e.g., 5"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-indigo-500"
        />
      </div>
      
      {parseFloat(riskReward()) < 2 && thesis.entryPrice && thesis.targetPrice && thesis.stopLoss && (
        <div className="bg-amber-900/30 border border-amber-800 rounded-lg p-3 text-sm text-amber-300">
          ⚠️ Risk:Reward below 2:1. Consider adjusting your target or stop loss for a better setup.
        </div>
      )}
    </div>
  );
}

function Step5Metrics({ thesis, updateThesis }: StepProps) {
  const updateMetric = (id: string, updates: Partial<ThesisMetric>) => {
    updateThesis({
      metrics: thesis.metrics.map(m => m.id === id ? { ...m, ...updates } : m)
    });
  };
  
  const addMetric = () => {
    const newId = `m${thesis.metrics.length + 1}`;
    updateThesis({
      metrics: [...thesis.metrics, { id: newId, name: '', value: '', unit: '', threshold: '20', importance: 'important' }]
    });
  };
  
  const removeMetric = (id: string) => {
    updateThesis({ metrics: thesis.metrics.filter(m => m.id !== id) });
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Track key metrics to monitor if your thesis is playing out. Set thresholds that would trigger a review.
      </p>
      
      <div className="space-y-3">
        {thesis.metrics.map(metric => (
          <div key={metric.id} className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={metric.name}
                onChange={(e) => updateMetric(metric.id, { name: e.target.value })}
                placeholder="Metric name"
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white placeholder-slate-500"
              />
              <button onClick={() => removeMetric(metric.id)} className="text-slate-500 hover:text-red-400 p-2">×</button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <input
                type="text"
                value={metric.value}
                onChange={(e) => updateMetric(metric.id, { value: e.target.value })}
                placeholder="Current value"
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white placeholder-slate-500"
              />
              <input
                type="text"
                value={metric.unit}
                onChange={(e) => updateMetric(metric.id, { unit: e.target.value })}
                placeholder="Unit (%, x, Cr)"
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white placeholder-slate-500"
              />
              <input
                type="text"
                value={metric.threshold}
                onChange={(e) => updateMetric(metric.id, { threshold: e.target.value })}
                placeholder="% threshold"
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white placeholder-slate-500"
              />
              <select
                value={metric.importance}
                onChange={(e) => updateMetric(metric.id, { importance: e.target.value as ThesisMetric['importance'] })}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white"
              >
                <option value="critical">Critical</option>
                <option value="important">Important</option>
                <option value="nice_to_have">Nice to have</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      
      <button onClick={addMetric} className="w-full py-2 border border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-slate-500 hover:text-white transition-colors">
        + Add Metric
      </button>
    </div>
  );
}

function Step6RisksCatalysts({ thesis, updateThesis }: StepProps) {
  const [newRisk, setNewRisk] = useState('');
  const [newCatalyst, setNewCatalyst] = useState('');
  
  const addRisk = () => {
    if (newRisk.trim()) {
      updateThesis({ risks: [...thesis.risks, newRisk.trim()] });
      setNewRisk('');
    }
  };
  
  const addCatalyst = () => {
    if (newCatalyst.trim()) {
      updateThesis({ catalysts: [...thesis.catalysts, newCatalyst.trim()] });
      setNewCatalyst('');
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-slate-300 mb-2">Risk Factors (what could go wrong?)</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newRisk}
            onChange={(e) => setNewRisk(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addRisk()}
            placeholder="e.g., Client concentration risk"
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
          />
          <button onClick={addRisk} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500">Add</button>
        </div>
        <div className="space-y-1">
          {thesis.risks.map((risk, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-red-900/20 border border-red-900 rounded-lg">
              <span className="text-red-400">⚠</span>
              <span className="flex-1 text-sm text-slate-200">{risk}</span>
              <button onClick={() => updateThesis({ risks: thesis.risks.filter((_, idx) => idx !== i) })} className="text-slate-500 hover:text-red-400">×</button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm text-slate-300 mb-2">Catalysts (what will drive the stock higher?)</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newCatalyst}
            onChange={(e) => setNewCatalyst(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCatalyst()}
            placeholder="e.g., Q3 earnings beat"
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
          />
          <button onClick={addCatalyst} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500">Add</button>
        </div>
        <div className="space-y-1">
          {thesis.catalysts.map((catalyst, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-emerald-900/20 border border-emerald-900 rounded-lg">
              <span className="text-emerald-400">⚡</span>
              <span className="flex-1 text-sm text-slate-200">{catalyst}</span>
              <button onClick={() => updateThesis({ catalysts: thesis.catalysts.filter((_, idx) => idx !== i) })} className="text-slate-500 hover:text-red-400">×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step7Review({ thesis, updateThesis }: StepProps) {
  const [newBreaker, setNewBreaker] = useState('');
  
  const addBreaker = () => {
    if (newBreaker.trim()) {
      updateThesis({ thesisBreakers: [...thesis.thesisBreakers, newBreaker.trim()] });
      setNewBreaker('');
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-slate-300 mb-2">How often will you review this thesis?</label>
        <div className="flex gap-2">
          {(['weekly', 'monthly', 'quarterly'] as const).map(freq => (
            <button
              key={freq}
              onClick={() => updateThesis({ reviewFrequency: freq })}
              className={`flex-1 py-3 rounded-lg border transition-all ${
                thesis.reviewFrequency === freq
                  ? 'border-indigo-500 bg-indigo-900/30 text-white'
                  : 'border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              {freq.charAt(0).toUpperCase() + freq.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm text-slate-300 mb-2">Thesis Breakers (conditions that invalidate your thesis)</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newBreaker}
            onChange={(e) => setNewBreaker(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addBreaker()}
            placeholder="e.g., Management change"
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
          />
          <button onClick={addBreaker} className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500">Add</button>
        </div>
        <div className="space-y-1">
          {thesis.thesisBreakers.map((breaker, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">🚫</span>
              <span className="flex-1 text-sm text-slate-200">{breaker}</span>
              <button onClick={() => updateThesis({ thesisBreakers: thesis.thesisBreakers.filter((_, idx) => idx !== i) })} className="text-slate-500 hover:text-red-400">×</button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-indigo-900/30 border border-indigo-800 rounded-lg p-4">
        <div className="font-medium text-white mb-2">🎯 Next Steps After Saving</div>
        <ul className="text-sm text-slate-400 space-y-1">
          <li>• Your thesis will be tracked in <span className="text-indigo-400">Portfolio Drift Monitor</span></li>
          <li>• You'll get alerts when metrics deviate beyond thresholds</li>
          <li>• Review reminders based on your chosen frequency</li>
        </ul>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface ThesisBuilderWizardProps {
  onComplete?: (thesis: InvestmentThesis) => void;
  onCancel?: () => void;
}

export default function ThesisBuilderWizard({ onComplete, onCancel }: ThesisBuilderWizardProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [thesis, setThesis] = useState<InvestmentThesis>({
    symbol: '', companyName: '', sector: '',
    investmentType: 'value', timeHorizon: '1y',
    summary: '', keyReasons: [],
    entryPrice: '', targetPrice: '', stopLoss: '', positionSize: '',
    metrics: DEFAULT_METRICS.value,
    risks: [], catalysts: [],
    reviewFrequency: 'monthly', thesisBreakers: [],
  });
  
  const updateThesis = (updates: Partial<InvestmentThesis>) => {
    setThesis(prev => ({ ...prev, ...updates }));
  };
  
  const STEPS = [
    { num: 1, label: 'Stock', component: Step1StockSelection },
    { num: 2, label: 'Type', component: Step2InvestmentType },
    { num: 3, label: 'Thesis', component: Step3ThesisCore },
    { num: 4, label: 'Targets', component: Step4Valuation },
    { num: 5, label: 'Metrics', component: Step5Metrics },
    { num: 6, label: 'Risks', component: Step6RisksCatalysts },
    { num: 7, label: 'Review', component: Step7Review },
  ];
  
  const CurrentStepComponent = STEPS[step - 1].component;
  
  const canProceed = () => {
    switch (step) {
      case 1: return thesis.symbol.length > 0;
      case 2: return thesis.investmentType && thesis.timeHorizon;
      case 3: return thesis.summary.length > 20 && thesis.keyReasons.length >= 2;
      case 4: return thesis.entryPrice && thesis.targetPrice && thesis.stopLoss;
      case 5: return thesis.metrics.length > 0;
      case 6: return thesis.risks.length > 0 && thesis.catalysts.length > 0;
      case 7: return true;
      default: return true;
    }
  };
  
  const handleComplete = () => {
    onComplete?.(thesis);
  };
  
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">📝 Thesis Builder Wizard</h2>
            <p className="text-sm text-slate-500">Build a structured investment thesis</p>
          </div>
          {onCancel && (
            <button onClick={onCancel} className="text-slate-400 hover:text-white">×</button>
          )}
        </div>
        
        {/* Progress */}
        <div className="flex items-center gap-1">
          {STEPS.map(s => (
            <button
              key={s.num}
              onClick={() => s.num < step && setStep(s.num as WizardStep)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                s.num === step ? 'bg-indigo-600 text-white' :
                s.num < step ? 'bg-emerald-900/50 text-emerald-400 cursor-pointer' :
                'bg-slate-800 text-slate-500'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <CurrentStepComponent thesis={thesis} updateThesis={updateThesis} />
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-900/50">
        <button
          onClick={() => setStep(prev => Math.max(1, prev - 1) as WizardStep)}
          disabled={step === 1}
          className="px-4 py-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        
        <div className="text-sm text-slate-500">Step {step} of 7</div>
        
        {step < 7 ? (
          <button
            onClick={() => setStep(prev => Math.min(7, prev + 1) as WizardStep)}
            disabled={!canProceed()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
          >
            Save Thesis ✓
          </button>
        )}
      </div>
    </div>
  );
}
