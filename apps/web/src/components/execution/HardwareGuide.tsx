// ═══════════════════════════════════════════════════════════════════════════
// HARDWARE GUIDE
// Recommendations for physical macro keypads
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';

interface HardwareGuideProps {
  isDark: boolean;
}

interface KeypadOption {
  name: string;
  price: string;
  priceINR: string;
  keys: number;
  features: string[];
  pros: string[];
  cons: string[];
  buyLink?: string;
  image?: string;
  recommended?: boolean;
}

const KEYPAD_OPTIONS: KeypadOption[] = [
  {
    name: 'Generic Amazon Numpad',
    price: '$10-15',
    priceINR: '₹800-1,500',
    keys: 10,
    features: ['USB connection', 'Plug & play', 'Compact'],
    pros: ['Cheapest option', 'No software needed', 'Works immediately'],
    cons: ['No customization', 'Basic feel', 'Not programmable'],
    recommended: false,
  },
  {
    name: 'Koolertron One-Handed Macro Pad',
    price: '$30-40',
    priceINR: '₹2,500-3,500',
    keys: 24,
    features: ['Programmable keys', 'Onboard memory', 'RGB lighting', 'Mechanical switches'],
    pros: ['Best value', 'Fully programmable', 'Good build quality', 'No software after setup'],
    cons: ['Setup software Windows-only', 'Learning curve'],
    recommended: true,
  },
  {
    name: 'Redragon K585 DITI',
    price: '$35-45',
    priceINR: '₹3,000-4,000',
    keys: 42,
    features: ['Wireless option', 'Blue switches', 'RGB', 'Detachable wrist rest'],
    pros: ['Wireless available', 'Full programmability', 'Gaming quality'],
    cons: ['Larger footprint', 'Overkill for 10 keys'],
    recommended: false,
  },
  {
    name: 'Elgato Stream Deck Mini',
    price: '$70-90',
    priceINR: '₹6,000-8,000',
    keys: 6,
    features: ['LCD keys', 'Visual feedback', 'Deep integration', 'App ecosystem'],
    pros: ['Shows key labels on screen', 'Best visual feedback', 'Profile switching'],
    cons: ['Expensive', 'Only 6 keys', 'Requires software running'],
    recommended: false,
  },
  {
    name: 'DIY Arduino/RP2040 Numpad',
    price: '$15-25',
    priceINR: '₹1,500-2,500',
    keys: 10,
    features: ['Fully customizable', 'Open source', 'QMK/VIA firmware'],
    pros: ['Total control', 'Cheapest programmable', 'Learning experience'],
    cons: ['Requires assembly', 'Technical knowledge needed', 'Time investment'],
    recommended: false,
  },
];

const SETUP_STEPS = [
  {
    step: 1,
    title: 'Program keypad to send Ctrl+1 through Ctrl+0',
    description: 'Use the keypad\'s software to map physical keys to keyboard shortcuts.',
    details: [
      'Key 1 → Ctrl+1',
      'Key 2 → Ctrl+2',
      '... and so on',
      'Key 0 → Ctrl+0',
    ],
  },
  {
    step: 2,
    title: 'Open Monomorph Execution Pad',
    description: 'Navigate to the Execution Pad page and ensure hotkeys are enabled.',
    details: [
      'Check the "Hotkeys Active" toggle is ON',
      'Configure your key mappings in Settings tab',
    ],
  },
  {
    step: 3,
    title: 'Test your setup',
    description: 'Press a key on your physical keypad and watch Monomorph respond.',
    details: [
      'You should see the confirmation modal appear',
      'The execution will be logged in Recent Executions',
    ],
  },
];

export function HardwareGuide({ isDark }: HardwareGuideProps) {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className={`
        p-6 rounded-xl border
        ${isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}
      `}>
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Why Use a Physical Keypad?
        </h3>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          While Monomorph's hotkeys work with your regular keyboard (Ctrl+1 through Ctrl+0), 
          a dedicated physical keypad provides <strong>muscle memory</strong>, 
          <strong> tactile feedback</strong>, and <strong>zero screen time</strong> for faster execution.
          This is especially valuable for scalp trading where speed matters.
        </p>
        <div className={`
          mt-4 p-3 rounded-lg flex items-start gap-3
          ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700'}
        `}>
          <span className="text-lg">💡</span>
          <div className="text-sm">
            <strong>No custom hardware required.</strong> Any programmable keypad that can send 
            keyboard shortcuts will work with Monomorph.
          </div>
        </div>
      </div>

      {/* Recommended Keypads */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Recommended Keypads
        </h3>
        <div className="space-y-4">
          {KEYPAD_OPTIONS.map((keypad) => (
            <div
              key={keypad.name}
              className={`
                p-4 rounded-xl border relative overflow-hidden
                ${keypad.recommended
                  ? isDark 
                    ? 'bg-indigo-500/10 border-indigo-500/30' 
                    : 'bg-indigo-50 border-indigo-200'
                  : isDark 
                    ? 'bg-slate-800/30 border-slate-700' 
                    : 'bg-white border-slate-200'
                }
              `}
            >
              {keypad.recommended && (
                <div className={`
                  absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold
                  ${isDark ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white'}
                `}>
                  ⭐ RECOMMENDED
                </div>
              )}
              
              <div className="flex items-start gap-4">
                {/* Placeholder for image */}
                <div className={`
                  w-20 h-20 rounded-lg flex items-center justify-center text-3xl flex-shrink-0
                  ${isDark ? 'bg-slate-700' : 'bg-slate-100'}
                `}>
                  ⌨️
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {keypad.name}
                      </h4>
                      <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {keypad.keys} keys • {keypad.priceINR}
                      </div>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {keypad.features.map((feature) => (
                      <span
                        key={feature}
                        className={`
                          px-2 py-0.5 rounded-full text-xs
                          ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}
                        `}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  {/* Pros/Cons */}
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className={`text-xs font-medium mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        ✓ Pros
                      </div>
                      <ul className={`text-xs space-y-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {keypad.pros.map((pro) => (
                          <li key={pro}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className={`text-xs font-medium mb-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                        ✗ Cons
                      </div>
                      <ul className={`text-xs space-y-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {keypad.cons.map((con) => (
                          <li key={con}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Setup Guide */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Setup Guide
        </h3>
        <div className="space-y-4">
          {SETUP_STEPS.map((step) => (
            <div
              key={step.step}
              className={`
                p-4 rounded-xl border flex gap-4
                ${isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}
              `}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0
                ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}
              `}>
                {step.step}
              </div>
              <div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {step.title}
                </h4>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {step.description}
                </p>
                {step.details && (
                  <ul className={`text-sm mt-2 space-y-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-xs">→</span>
                        <code className={`
                          px-1.5 py-0.5 rounded text-xs font-mono
                          ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}
                        `}>
                          {detail}
                        </code>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* No Hardware Note */}
      <div className={`
        p-4 rounded-xl border flex items-start gap-3
        ${isDark ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-green-50 border-green-200 text-green-700'}
      `}>
        <span className="text-lg">✓</span>
        <div className="text-sm">
          <strong>Don't want to buy hardware?</strong> No problem! 
          The Execution Pad works perfectly with just your keyboard. 
          Press Ctrl+1 through Ctrl+0 to trigger your configured actions.
        </div>
      </div>
    </div>
  );
}

export default HardwareGuide;
