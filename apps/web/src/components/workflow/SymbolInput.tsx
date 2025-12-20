// ═══════════════════════════════════════════════════════════════════════════
// SYMBOL INPUT
// Symbol input with autocomplete suggestions
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useRef, useEffect } from 'react';

// Popular Indian stocks for autocomplete
const POPULAR_SYMBOLS = [
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT' },
  { symbol: 'INFY', name: 'Infosys', sector: 'IT' },
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'FMCG' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom' },
  { symbol: 'ITC', name: 'ITC Limited', sector: 'FMCG' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', sector: 'Finance' },
  { symbol: 'WIPRO', name: 'Wipro', sector: 'IT' },
  { symbol: 'HCLTECH', name: 'HCL Technologies', sector: 'IT' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking' },
  { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure' },
  { symbol: 'AXISBANK', name: 'Axis Bank', sector: 'Banking' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', sector: 'Chemicals' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', sector: 'Auto' },
  { symbol: 'TITAN', name: 'Titan Company', sector: 'Consumer' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', sector: 'Pharma' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Auto' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', sector: 'Diversified' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports', sector: 'Ports' },
  { symbol: 'POWERGRID', name: 'Power Grid Corp', sector: 'Power' },
  { symbol: 'NTPC', name: 'NTPC Limited', sector: 'Power' },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', sector: 'Cement' },
  // US Stocks
  { symbol: 'AAPL', name: 'Apple Inc', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet (Google)', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon', sector: 'E-commerce' },
  { symbol: 'NVDA', name: 'NVIDIA', sector: 'Technology' },
  { symbol: 'META', name: 'Meta Platforms', sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla', sector: 'Auto' },
];

interface SymbolInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SymbolInput({ 
  value, 
  onChange, 
  placeholder = 'Enter symbol',
  className = ''
}: SymbolInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof POPULAR_SYMBOLS>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Filter suggestions based on input
  useEffect(() => {
    if (!value.trim()) {
      setSuggestions(POPULAR_SYMBOLS.slice(0, 8));
      return;
    }
    
    const query = value.toUpperCase();
    const matches = POPULAR_SYMBOLS.filter(s => 
      s.symbol.includes(query) ||
      s.name.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(matches.slice(0, 8));
    setHighlightIndex(-1);
  }, [value]);
  
  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightIndex >= 0 && suggestions[highlightIndex]) {
          onChange(suggestions[highlightIndex].symbol);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };
  
  const handleSelect = (symbol: string) => {
    onChange(symbol);
    setIsOpen(false);
    inputRef.current?.focus();
  };
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
          text-sm font-mono font-semibold text-teal-400 outline-none
          focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20
          placeholder:text-slate-600 placeholder:font-normal"
      />
      
      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50
          bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden
          animate-slide-down">
          {suggestions.map((s, index) => (
            <button
              key={s.symbol}
              onClick={() => handleSelect(s.symbol)}
              className={`w-full px-3 py-2 text-left flex items-center gap-3 
                transition-colors
                ${index === highlightIndex 
                  ? 'bg-slate-700' 
                  : 'hover:bg-slate-700/50'
                }`}
            >
              <span className="font-mono font-semibold text-teal-400 w-20">
                {s.symbol}
              </span>
              <span className="text-sm text-slate-300 flex-1 truncate">
                {s.name}
              </span>
              <span className="text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-900">
                {s.sector}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SymbolInput;
