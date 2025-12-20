// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOW SIDEBAR
// Card library with search, filter, and drag-to-canvas support
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { cardRegistry, CATEGORIES, searchCards, type CardDescriptor } from '@/registry/cardRegistry';
import { WORKFLOW_TEMPLATES, type WorkflowTemplate } from './templates';
import { useTheme } from '@/components/ThemeProvider';

// ─────────────────────────────────────────────────────────────────────────────
// DRAGGABLE CARD ITEM
// ─────────────────────────────────────────────────────────────────────────────

interface DraggableCardProps {
  card: CardDescriptor;
  onDragStart: (event: React.DragEvent, card: CardDescriptor) => void;
  isDark: boolean;
}

function DraggableCard({ card, onDragStart, isDark }: DraggableCardProps) {
  const category = CATEGORIES.find(c => c.id === card.category);
  const categoryColor = category?.color || '#64748b';
  
  const categoryIcons: Record<string, string> = {
    value: '💎',
    growth: '📈',
    risk: '🛡️',
    technical: '📊',
    macro: '🌍',
    portfolio: '💼',
    cashflow: '💵',
    income: '💰',
    derivatives: '📉',
    'mutual-funds': '📁',
    commodities: '🏭',
    mini: '⚡',
    overview: '👁️',
  };
  
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card)}
      className={`group relative p-2.5 rounded-lg border cursor-grab active:cursor-grabbing transition-all duration-150 hover:shadow-lg ${
        isDark 
          ? 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800 hover:border-slate-600'
          : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 shadow-sm'
      }`}
    >
      {/* Drag Handle Indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity ${
        isDark 
          ? 'from-slate-600 via-slate-500 to-slate-600'
          : 'from-slate-400 via-slate-500 to-slate-400'
      }`} />
      
      <div className="flex items-start gap-2">
        {/* Category indicator */}
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
          style={{ backgroundColor: `${categoryColor}20` }}
        >
          {categoryIcons[card.category] || '📋'}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {card.label}
            </span>
          </div>
          <div className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {card.description}
          </div>
        </div>
        
        {/* Drag Icon */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
          <span className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>⋮⋮</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE CARD
// ─────────────────────────────────────────────────────────────────────────────

interface TemplateCardProps {
  template: WorkflowTemplate;
  onSelect: (template: WorkflowTemplate) => void;
  isDark: boolean;
}

function TemplateCard({ template, onSelect, isDark }: TemplateCardProps) {
  const categoryColors: Record<string, string> = {
    beginner: '#6366f1',
    value: '#3b82f6',
    growth: '#10b981',
    technical: '#ec4899',
    risk: '#ef4444',
    income: '#8b5cf6',
    thematic: '#f59e0b',
    sentiment: '#06b6d4',
    event: '#f97316',
    portfolio: '#14b8a6',
    quality: '#a855f7',
    derivatives: '#64748b',
    cashflow: '#22c55e',
    flagship: '#eab308',
    macro: '#0ea5e9',
  };
  
  const color = categoryColors[template.category] || '#64748b';
  
  return (
    <button
      onClick={() => onSelect(template)}
      className={`group relative w-full p-2.5 rounded-lg border text-left transition-all ${
        isDark 
          ? 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800 hover:border-slate-600' 
          : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
      }`}
      title={template.description}
    >
      <div className="flex items-center gap-2.5">
        <div 
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          {template.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium truncate ${isDark ? 'text-slate-200 group-hover:text-white' : 'text-slate-800'}`}>
            {template.name}
          </div>
          <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            {template.nodes.length} cards
          </div>
        </div>
      </div>
      
      {/* Hover tooltip */}
      <div className={`
        absolute left-full top-0 ml-2 z-50 w-64 p-3 rounded-lg shadow-xl
        opacity-0 invisible group-hover:opacity-100 group-hover:visible
        transition-all duration-200 pointer-events-none
        ${isDark 
          ? 'bg-slate-800 border border-slate-700 text-slate-300' 
          : 'bg-white border border-slate-200 text-slate-600 shadow-lg'
        }
      `}>
        <div className={`font-medium text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {template.name}
        </div>
        <div className="text-xs leading-relaxed">
          {template.description}
        </div>
        <div className={`mt-2 pt-2 border-t text-[10px] ${isDark ? 'border-slate-700 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
          {template.nodes.length} cards • {template.category}
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE CATEGORY CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const TEMPLATE_CATEGORIES = [
  { id: 'beginner', label: 'Beginner', icon: '🟢', color: '#6366f1' },
  { id: 'value', label: 'Value', icon: '💎', color: '#3b82f6' },
  { id: 'growth', label: 'Growth', icon: '🚀', color: '#10b981' },
  { id: 'quality', label: 'Quality', icon: '🏆', color: '#a855f7' },
  { id: 'technical', label: 'Technical', icon: '📊', color: '#ec4899' },
  { id: 'risk', label: 'Risk', icon: '⚠️', color: '#ef4444' },
  { id: 'income', label: 'Income', icon: '💰', color: '#8b5cf6' },
  { id: 'sentiment', label: 'Sentiment', icon: '📈', color: '#06b6d4' },
  { id: 'event', label: 'Event', icon: '📅', color: '#f97316' },
  { id: 'portfolio', label: 'Portfolio', icon: '💼', color: '#14b8a6' },
  { id: 'thematic', label: 'Thematic', icon: '🎯', color: '#f59e0b' },
  { id: 'derivatives', label: 'Derivatives', icon: '📉', color: '#64748b' },
  { id: 'cashflow', label: 'Cashflow', icon: '💵', color: '#22c55e' },
  { id: 'macro', label: 'Macro', icon: '🌍', color: '#0ea5e9' },
  { id: 'flagship', label: 'Flagship', icon: '🏅', color: '#eab308' },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SIDEBAR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface WorkflowSidebarProps {
  onDragStart: (event: React.DragEvent, card: CardDescriptor) => void;
  onTemplateSelect: (template: WorkflowTemplate) => void;
  onAddCard: (card: CardDescriptor) => void;
}

type TabType = 'cards' | 'templates';

export function WorkflowSidebar({ 
  onDragStart, 
  onTemplateSelect,
  onAddCard 
}: WorkflowSidebarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<TabType>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Filter cards
  const filteredCards = useMemo(() => {
    let cards = cardRegistry;
    
    if (selectedCategory) {
      cards = cards.filter(c => c.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      cards = searchCards(searchQuery);
      if (selectedCategory) {
        cards = cards.filter(c => c.category === selectedCategory);
      }
    }
    
    return cards;
  }, [searchQuery, selectedCategory]);
  
  // Filter templates
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return WORKFLOW_TEMPLATES;
    const lowerQuery = searchQuery.toLowerCase();
    return WORKFLOW_TEMPLATES.filter(t => 
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);
  
  if (isCollapsed) {
    return (
      <div className={`w-12 h-full border-r flex flex-col items-center py-4 ${
        isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white border-slate-200'
      }`}>
        <button
          onClick={() => setIsCollapsed(false)}
          className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'}`}
          title="Expand sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }
  
  return (
    <div className={`w-72 h-full border-r flex flex-col ${
      isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Workflow Builder</h3>
          <button
            onClick={() => setIsCollapsed(true)}
            className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'}`}
            title="Collapse sidebar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
        
        {/* Tabs */}
        <div className={`flex gap-1 p-1 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
              ${activeTab === 'cards' 
                ? isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-900 shadow-sm'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Cards ({cardRegistry.length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
              ${activeTab === 'templates' 
                ? isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-900 shadow-sm'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Templates
          </button>
        </div>
      </div>
      
      {/* Search */}
      <div className={`p-3 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'cards' ? "Search cards..." : "Search templates..."}
            className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-500/20 ${
              isDark 
                ? 'bg-slate-800/50 border-slate-700 text-slate-200 placeholder-slate-500 focus:border-indigo-500'
                : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {/* Category Filter (Cards tab only) */}
      {activeTab === 'cards' && (
        <div className={`p-3 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-colors
                ${!selectedCategory 
                  ? 'bg-indigo-500 text-white' 
                  : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-colors`}
                style={{
                  backgroundColor: selectedCategory === cat.id ? cat.color : (isDark ? '#1e293b' : '#f1f5f9'),
                  color: selectedCategory === cat.id ? 'white' : (isDark ? '#94a3b8' : '#475569'),
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'cards' ? (
          <div className="space-y-2">
            {filteredCards.length === 0 ? (
              <div className={`text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <div className="text-3xl mb-2">🔍</div>
                <div className="text-sm">No cards found</div>
              </div>
            ) : (
              filteredCards.map(card => (
                <DraggableCard
                  key={card.id}
                  card={card}
                  onDragStart={onDragStart}
                  isDark={isDark}
                />
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTemplates.length === 0 ? (
              <div className={`text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <div className="text-3xl mb-2">📋</div>
                <div className="text-sm">No templates found</div>
              </div>
            ) : (
              // Group templates by category
              TEMPLATE_CATEGORIES
                .filter(cat => filteredTemplates.some(t => t.category === cat.id))
                .map(cat => {
                  const categoryTemplates = filteredTemplates.filter(t => t.category === cat.id);
                  if (categoryTemplates.length === 0) return null;
                  
                  return (
                    <div key={cat.id}>
                      {/* Category Header */}
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <span className="text-sm">{cat.icon}</span>
                        <span 
                          className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: cat.color }}
                        >
                          {cat.label}
                        </span>
                        <span className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                          ({categoryTemplates.length})
                        </span>
                      </div>
                      
                      {/* Templates in this category */}
                      <div className="space-y-1.5 mb-3">
                        {categoryTemplates.map(template => (
                          <TemplateCard
                            key={template.id}
                            template={template}
                            onSelect={onTemplateSelect}
                            isDark={isDark}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}
      </div>
      
      {/* Logic Nodes Section (Cards tab only) */}
      {activeTab === 'cards' && (
        <div className={`p-3 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
          <div className={`text-xs uppercase tracking-wider font-bold mb-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Logic & Flow
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* Condition Node */}
            <button
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/reactflow-logic', JSON.stringify({
                  type: 'condition',
                  label: 'Condition',
                  condition: 'score > 50',
                }));
                e.dataTransfer.effectAllowed = 'move';
              }}
              className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10
                hover:bg-amber-500/20 hover:border-amber-500/50 
                cursor-grab active:cursor-grabbing transition-all group"
            >
              <div className="text-amber-400 text-lg mb-1">⚡</div>
              <div className="text-[11px] font-medium text-amber-500">Condition</div>
              <div className={`text-[9px] group-hover:text-slate-400 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>If/Then/Else</div>
            </button>
            
            {/* Merge Node */}
            <button
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/reactflow-logic', JSON.stringify({
                  type: 'merge',
                  label: 'Merge',
                  mergeStrategy: 'all',
                }));
                e.dataTransfer.effectAllowed = 'move';
              }}
              className="p-2.5 rounded-lg border border-violet-500/30 bg-violet-500/10
                hover:bg-violet-500/20 hover:border-violet-500/50 
                cursor-grab active:cursor-grabbing transition-all group"
            >
              <div className="text-violet-400 text-lg mb-1">🔀</div>
              <div className="text-[11px] font-medium text-violet-500">Merge</div>
              <div className={`text-[9px] group-hover:text-slate-400 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Combine paths</div>
            </button>
          </div>
        </div>
      )}
      
      {/* Footer Hint */}
      <div className={`p-3 border-t ${isDark ? 'border-slate-700/50 bg-slate-800/30' : 'border-slate-200 bg-slate-50'}`}>
        <div className={`text-[11px] text-center ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          {activeTab === 'cards' 
            ? '💡 Drag cards onto the canvas to build your workflow'
            : '💡 Click a template to start with a pre-built workflow'
          }
        </div>
      </div>
    </div>
  );
}

export default WorkflowSidebar;
