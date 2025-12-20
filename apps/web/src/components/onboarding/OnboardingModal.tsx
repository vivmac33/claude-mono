// ═══════════════════════════════════════════════════════════════════════════
// ONBOARDING MODAL
// First-run experience for new users
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import type { InvestorPersona, ExperienceLevel, RiskTolerance } from '@/stores/userStore';

// ─────────────────────────────────────────────────────────────────────────────
// STEP DATA
// ─────────────────────────────────────────────────────────────────────────────

const PERSONAS: { id: InvestorPersona; icon: string; title: string; description: string }[] = [
  { id: 'trader', icon: '📈', title: 'Trader', description: 'Intraday to swing trading, technical analysis focused' },
  { id: 'value-investor', icon: '💎', title: 'Value Investor', description: 'Long-term, fundamentals-driven, seeking undervalued stocks' },
  { id: 'growth-investor', icon: '🚀', title: 'Growth Investor', description: 'High-growth companies, willing to pay premium for potential' },
  { id: 'income-seeker', icon: '💰', title: 'Income Seeker', description: 'Dividends and stable returns, capital preservation' },
  { id: 'passive', icon: '🎯', title: 'Passive Investor', description: 'Index funds, ETFs, minimal active management' },
  { id: 'beginner', icon: '🌱', title: 'Just Starting', description: 'Learning the ropes, exploring different strategies' },
];

const EXPERIENCE_LEVELS: { id: ExperienceLevel; label: string; description: string }[] = [
  { id: 'new', label: 'New to investing', description: 'Less than 1 year' },
  { id: '1-3years', label: '1-3 years', description: 'Some experience' },
  { id: '3-5years', label: '3-5 years', description: 'Intermediate' },
  { id: '5+years', label: '5+ years', description: 'Experienced' },
];

const RISK_LEVELS: { id: RiskTolerance; icon: string; title: string; description: string; color: string }[] = [
  { id: 'conservative', icon: '🛡️', title: 'Conservative', description: 'Capital preservation, lower volatility', color: 'from-blue-500 to-cyan-500' },
  { id: 'moderate', icon: '⚖️', title: 'Moderate', description: 'Balanced risk and return', color: 'from-amber-500 to-orange-500' },
  { id: 'aggressive', icon: '🔥', title: 'Aggressive', description: 'Higher risk for higher potential returns', color: 'from-red-500 to-pink-500' },
];

const FEATURES = [
  { icon: '🔗', title: 'Workflow Builder', description: 'Chain analytics cards into custom analysis flows' },
  { icon: '📊', title: '79 Analytics Tools', description: 'Valuation, Technical, Risk, Growth & more' },
  { icon: '📈', title: 'Chart Studio', description: 'Multi-chart workspace with indicators' },
  { icon: '📚', title: 'Learning Center', description: 'Flashcards, quizzes, and guided paths' },
];

// ─────────────────────────────────────────────────────────────────────────────
// STEP COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
}

function WelcomeStep({ onNext, onSkip }: StepProps) {
  return (
    <div className="text-center">
      {/* Logo */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/25">
        <span className="text-4xl">📊</span>
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-3">
        Welcome to Monomorph
      </h2>
      <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
        Professional-grade financial analytics for Indian markets. Let's personalize your experience.
      </p>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8 max-w-lg mx-auto">
        {FEATURES.map((f, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-left">
            <span className="text-2xl mb-2 block">{f.icon}</span>
            <div className="text-sm font-medium text-white">{f.title}</div>
            <div className="text-xs text-slate-500">{f.description}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onNext}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
        >
          Get Started →
        </button>
        <button
          onClick={onSkip}
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          Skip setup
        </button>
      </div>
    </div>
  );
}

function PersonaStep({ onNext, onBack, selectedPersona, setSelectedPersona }: StepProps & {
  selectedPersona: InvestorPersona | null;
  setSelectedPersona: (p: InvestorPersona) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        What describes you best?
      </h2>
      <p className="text-slate-400 mb-6 text-center">
        We'll customize your dashboard and recommendations
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPersona(p.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedPersona === p.id
                ? 'bg-indigo-500/20 border-indigo-500 ring-2 ring-indigo-500/50'
                : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
            }`}
          >
            <span className="text-2xl mb-2 block">{p.icon}</span>
            <div className="text-sm font-medium text-white">{p.title}</div>
            <div className="text-xs text-slate-500">{p.description}</div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-slate-800 text-slate-300 font-medium rounded-xl hover:bg-slate-700 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedPersona}
          className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

function ExperienceStep({ onNext, onBack, selectedExperience, setSelectedExperience }: StepProps & {
  selectedExperience: ExperienceLevel | null;
  setSelectedExperience: (e: ExperienceLevel) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        How long have you been investing?
      </h2>
      <p className="text-slate-400 mb-6 text-center">
        We'll adjust complexity and explanations accordingly
      </p>

      <div className="space-y-3 mb-6">
        {EXPERIENCE_LEVELS.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelectedExperience(e.id)}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              selectedExperience === e.id
                ? 'bg-indigo-500/20 border-indigo-500 ring-2 ring-indigo-500/50'
                : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
            }`}
          >
            <div>
              <div className="text-sm font-medium text-white">{e.label}</div>
              <div className="text-xs text-slate-500">{e.description}</div>
            </div>
            {selectedExperience === e.id && (
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-slate-800 text-slate-300 font-medium rounded-xl hover:bg-slate-700 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedExperience}
          className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

function RiskStep({ onNext, onBack, selectedRisk, setSelectedRisk }: StepProps & {
  selectedRisk: RiskTolerance | null;
  setSelectedRisk: (r: RiskTolerance) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        What's your risk tolerance?
      </h2>
      <p className="text-slate-400 mb-6 text-center">
        This helps us highlight relevant tools and warnings
      </p>

      <div className="space-y-3 mb-6">
        {RISK_LEVELS.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRisk(r.id)}
            className={`w-full p-4 rounded-xl border text-left transition-all ${
              selectedRisk === r.id
                ? 'bg-indigo-500/20 border-indigo-500 ring-2 ring-indigo-500/50'
                : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-xl`}>
                {r.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{r.title}</div>
                <div className="text-xs text-slate-500">{r.description}</div>
              </div>
              {selectedRisk === r.id && (
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-slate-800 text-slate-300 font-medium rounded-xl hover:bg-slate-700 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedRisk}
          className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

function CompleteStep({ onFinish, persona, experience, risk }: { 
  onFinish: () => void;
  persona: InvestorPersona | null;
  experience: ExperienceLevel | null;
  risk: RiskTolerance | null;
}) {
  const personaData = PERSONAS.find(p => p.id === persona);
  const experienceData = EXPERIENCE_LEVELS.find(e => e.id === experience);
  const riskData = RISK_LEVELS.find(r => r.id === risk);

  const recommendations = [
    persona === 'trader' && 'Start with Technical Analysis cards',
    persona === 'value-investor' && 'Check out Valuation Summary and Piotroski Score',
    persona === 'growth-investor' && 'Explore Growth Summary and Earnings Quality',
    persona === 'income-seeker' && 'Try Dividend Crystal Ball and Income Stability',
    experience === 'new' && 'Visit the Learning Center for guided tutorials',
    risk === 'aggressive' && 'F&O Risk Advisor can help manage derivatives risk',
  ].filter(Boolean);

  return (
    <div className="text-center">
      {/* Success Animation */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/25">
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        You're all set!
      </h2>
      <p className="text-slate-400 mb-6">
        Your profile has been customized
      </p>

      {/* Profile Summary */}
      <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-left">
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Your Profile</div>
        <div className="space-y-2">
          {personaData && (
            <div className="flex items-center gap-2">
              <span>{personaData.icon}</span>
              <span className="text-sm text-slate-300">{personaData.title}</span>
            </div>
          )}
          {experienceData && (
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span className="text-sm text-slate-300">{experienceData.label}</span>
            </div>
          )}
          {riskData && (
            <div className="flex items-center gap-2">
              <span>{riskData.icon}</span>
              <span className="text-sm text-slate-300">{riskData.title} risk</span>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 mb-6 text-left">
          <div className="text-xs text-indigo-400 uppercase tracking-wider mb-2">Recommended for you</div>
          <ul className="space-y-1">
            {recommendations.slice(0, 3).map((rec, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onFinish}
        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25"
      >
        🚀 Start Exploring
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState<InvestorPersona | null>(null);
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [risk, setRisk] = useState<RiskTolerance | null>(null);

  const { updateProfile, completeOnboarding } = useUserStore();

  if (!isOpen) return null;

  const handleSkip = () => {
    completeOnboarding();
    onClose();
  };

  const handleFinish = () => {
    // Save preferences to profile
    updateProfile({
      persona,
      experienceLevel: experience,
      riskTolerance: risk,
    });
    completeOnboarding();
    onClose();
  };

  const totalSteps = 5;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1 bg-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-8">
            {step === 0 && (
              <WelcomeStep 
                onNext={() => setStep(1)} 
                onSkip={handleSkip}
              />
            )}
            {step === 1 && (
              <PersonaStep 
                onNext={() => setStep(2)} 
                onBack={() => setStep(0)}
                selectedPersona={persona}
                setSelectedPersona={setPersona}
              />
            )}
            {step === 2 && (
              <ExperienceStep 
                onNext={() => setStep(3)} 
                onBack={() => setStep(1)}
                selectedExperience={experience}
                setSelectedExperience={setExperience}
              />
            )}
            {step === 3 && (
              <RiskStep 
                onNext={() => setStep(4)} 
                onBack={() => setStep(2)}
                selectedRisk={risk}
                setSelectedRisk={setRisk}
              />
            )}
            {step === 4 && (
              <CompleteStep 
                onFinish={handleFinish}
                persona={persona}
                experience={experience}
                risk={risk}
              />
            )}
          </div>

          {/* Step Indicator */}
          <div className="px-8 pb-6 flex justify-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === step 
                    ? 'w-6 bg-indigo-500' 
                    : i < step 
                    ? 'bg-indigo-500/50' 
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK FOR AUTO-SHOWING ONBOARDING
// ─────────────────────────────────────────────────────────────────────────────

export function useOnboarding() {
  const { hasCompletedOnboarding, resetOnboarding } = useUserStore();
  const [isOpen, setIsOpen] = useState(!hasCompletedOnboarding);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    reset: () => {
      resetOnboarding();
      setIsOpen(true);
    },
  };
}

export default OnboardingModal;
