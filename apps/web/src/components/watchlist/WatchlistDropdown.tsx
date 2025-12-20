// ═══════════════════════════════════════════════════════════════════════════
// WATCHLIST COMPONENTS
// Watchlist dropdown, management, and quick-switch
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useRef, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ─────────────────────────────────────────────────────────────────────────────
// WATCHLIST DROPDOWN
// ─────────────────────────────────────────────────────────────────────────────

interface WatchlistDropdownProps {
  onSelectStock?: (symbol: string) => void;
  className?: string;
}

export function WatchlistDropdown({ onSelectStock, className = '' }: WatchlistDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { 
    watchlists, 
    activeWatchlistId, 
    addToWatchlist, 
    removeFromWatchlist,
    setActiveWatchlist 
  } = useUserStore();

  const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId) || watchlists[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowAddForm(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymbol.trim()) {
      addToWatchlist(newSymbol.toUpperCase().trim(), newSymbol.toUpperCase().trim());
      setNewSymbol('');
      setShowAddForm(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
      >
        <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <span className="text-sm text-slate-200">Watchlist</span>
        <span className="text-xs text-slate-500">({activeWatchlist?.items.length || 0})</span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <select
              value={activeWatchlistId || 'default'}
              onChange={(e) => setActiveWatchlist(e.target.value)}
              className="text-sm font-medium text-white bg-transparent border-none focus:outline-none"
            >
              {watchlists.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <form onSubmit={handleAddStock} className="p-3 border-b border-slate-800">
              <div className="flex gap-2">
                <Input
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  placeholder="Enter symbol (e.g., TCS)"
                  inputSize="sm"
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit" size="sm" variant="primary">Add</Button>
              </div>
            </form>
          )}

          {/* Stock List */}
          <div className="max-h-64 overflow-y-auto">
            {activeWatchlist?.items.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-slate-400">No stocks in watchlist</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="text-xs text-teal-400 hover:text-teal-300 mt-2"
                >
                  Add your first stock
                </button>
              </div>
            ) : (
              activeWatchlist?.items.map(item => (
                <div
                  key={item.symbol}
                  className="flex items-center justify-between px-3 py-2 hover:bg-slate-800/50 transition-colors group"
                >
                  <button
                    onClick={() => {
                      onSelectStock?.(item.symbol);
                      setIsOpen(false);
                    }}
                    className="flex-1 text-left"
                  >
                    <span className="text-sm font-medium text-white">{item.symbol}</span>
                    {item.name !== item.symbol && (
                      <span className="text-xs text-slate-500 ml-2">{item.name}</span>
                    )}
                  </button>
                  <button
                    onClick={() => removeFromWatchlist(item.symbol)}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-700 rounded transition-all"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-slate-800 bg-slate-800/30">
            <a
              href="#/watchlist"
              className="block text-center text-xs text-slate-400 hover:text-white transition-colors py-1"
            >
              Manage Watchlists →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD TO WATCHLIST BUTTON
// ─────────────────────────────────────────────────────────────────────────────

interface AddToWatchlistButtonProps {
  symbol: string;
  name?: string;
  size?: 'sm' | 'md';
}

export function AddToWatchlistButton({ symbol, name, size = 'md' }: AddToWatchlistButtonProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useUserStore();
  const inWatchlist = isInWatchlist(symbol);

  const handleClick = () => {
    if (inWatchlist) {
      removeFromWatchlist(symbol);
    } else {
      addToWatchlist(symbol, name || symbol);
    }
  };

  const sizeClasses = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses} flex items-center justify-center rounded-lg border transition-all ${
        inWatchlist
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-500/30'
      }`}
      title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <svg className={iconSize} fill={inWatchlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WATCHLIST PAGE (FULL)
// ─────────────────────────────────────────────────────────────────────────────

export function WatchlistPage() {
  const { 
    watchlists, 
    activeWatchlistId, 
    createWatchlist, 
    deleteWatchlist,
    setActiveWatchlist,
    addToWatchlist,
    removeFromWatchlist 
  } = useUserStore();

  const [newListName, setNewListName] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const [showNewListForm, setShowNewListForm] = useState(false);

  const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId) || watchlists[0];

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      const id = createWatchlist(newListName.trim());
      setActiveWatchlist(id);
      setNewListName('');
      setShowNewListForm(false);
    }
  };

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymbol.trim()) {
      addToWatchlist(newSymbol.toUpperCase().trim(), newSymbol.toUpperCase().trim());
      setNewSymbol('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <a 
          href="#/workflow" 
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Workflow
        </a>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Watchlists</h1>
            <p className="text-slate-400 text-sm mt-1">Track your favorite stocks</p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => setShowNewListForm(true)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Watchlist
          </Button>
        </div>

        {/* New List Form */}
        {showNewListForm && (
          <form onSubmit={handleCreateList} className="mb-6 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="flex gap-3">
              <Input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Watchlist name"
                inputSize="lg"
                className="flex-1"
                autoFocus
              />
              <Button type="submit" variant="primary">Create</Button>
              <Button type="button" variant="ghost" onClick={() => setShowNewListForm(false)}>Cancel</Button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar - List of Watchlists */}
          <div className="space-y-2">
            {watchlists.map(list => (
              <button
                key={list.id}
                onClick={() => setActiveWatchlist(list.id)}
                className={`w-full p-3 rounded-lg text-left transition-all flex items-center justify-between ${
                  activeWatchlistId === list.id
                    ? 'bg-slate-800 border border-slate-700'
                    : 'hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <span className="text-sm font-medium text-white block">{list.name}</span>
                  <span className="text-xs text-slate-500">{list.items.length} stocks</span>
                </div>
                {list.isDefault && (
                  <span className="text-xs text-slate-600">Default</span>
                )}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
              {/* Watchlist Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">{activeWatchlist?.name}</h2>
                {!activeWatchlist?.isDefault && (
                  <button
                    onClick={() => {
                      if (confirm('Delete this watchlist?')) {
                        deleteWatchlist(activeWatchlist.id);
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Add Stock Form */}
              <form onSubmit={handleAddStock} className="p-4 border-b border-slate-800">
                <div className="flex gap-3">
                  <Input
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    placeholder="Add stock symbol (e.g., RELIANCE)"
                    inputSize="md"
                    className="flex-1"
                  />
                  <Button type="submit" variant="secondary" size="md">Add Stock</Button>
                </div>
              </form>

              {/* Stock List */}
              {activeWatchlist?.items.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <p className="text-slate-400">No stocks in this watchlist</p>
                  <p className="text-slate-500 text-sm mt-1">Add stocks using the form above</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {activeWatchlist?.items.map(item => (
                    <div key={item.symbol} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                          {item.symbol.charAt(0)}
                        </div>
                        <div>
                          <a 
                            href={`#/ticker/${item.symbol}`}
                            className="text-sm font-medium text-white hover:text-teal-400 transition-colors"
                          >
                            {item.symbol}
                          </a>
                          <p className="text-xs text-slate-500">
                            Added {new Date(item.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`#/ticker/${item.symbol}`}
                          className="px-3 py-1 text-xs text-teal-400 hover:bg-teal-500/10 rounded transition-colors"
                        >
                          Analyze
                        </a>
                        <button
                          onClick={() => removeFromWatchlist(item.symbol)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchlistDropdown;
