// ═══════════════════════════════════════════════════════════════════════════
// UI COMPONENT SHOWCASE
// Demo page to test and display all UI components
// Access at #/ui-showcase
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  // Phase 1
  Button,
  ButtonGroup,
  IconButton,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  FormField,
  SearchInput,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Progress,
  Skeleton,
  // Phase 2
  CardShell,
  CardSection,
  CardMetric,
  CardMetricGrid,
  CardStatusIndicator,
  Modal,
  ConfirmModal,
  AlertModal,
  SignalBadge,
  HealthBadge,
  TrendBadge,
  RiskBadge,
  ValuationBadge,
  ScoreBadge,
  ChangeBadge,
  CategoryBadge,
  LiveIndicator,
  // State Components (V49)
  EmptyState,
  CardEmptyState,
  InlineEmptyState,
  ErrorState,
  CardErrorState,
  InlineError,
  CardSkeleton,
  LoadingSpinner,
} from '@/components/ui';

// ─────────────────────────────────────────────────────────────────────────────
// STATE COMPONENTS SHOWCASE
// ─────────────────────────────────────────────────────────────────────────────

function StateComponentsShowcase() {
  return (
    <section className="space-y-8">
      <h2 className="text-xl font-semibold border-b border-slate-800 pb-2">State Components (V49)</h2>
      
      {/* Empty States */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-300">Empty States</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
            <EmptyState variant="default" size="sm" />
          </div>
          <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
            <EmptyState variant="search" size="sm" />
          </div>
          <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
            <EmptyState variant="watchlist" size="sm" action={{ label: 'Add Stocks', onClick: () => {} }} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardEmptyState cardTitle="Valuation Summary" variant="data" accentColor="#6366f1" />
          <CardEmptyState cardTitle="Watchlist" variant="watchlist" accentColor="#10b981" action={{ label: 'Add First Stock', onClick: () => {} }} />
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
          <InlineEmptyState message="No results found" icon="🔍" />
        </div>
      </div>

      {/* Error States */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-300">Error States</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ErrorState variant="default" severity="error" onRetry={() => {}} />
          <ErrorState variant="network" severity="warning" onRetry={() => {}} onDismiss={() => {}} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardErrorState cardTitle="Growth Summary" variant="timeout" onRetry={() => {}} />
          <CardErrorState cardTitle="Technical Indicators" variant="server" severity="critical" />
        </div>
        <div className="flex items-center gap-4 bg-slate-900 rounded-xl border border-slate-700 p-4">
          <InlineError message="Invalid symbol" />
          <InlineError message="Price must be positive" />
        </div>
      </div>

      {/* Loading Skeletons */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-300">Loading Skeletons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton variant="default" category="value" title="Valuation Summary" description="Loading..." />
          <CardSkeleton variant="chart" category="technical" title="Candlestick Chart" description="Loading chart data..." />
          <CardSkeleton variant="mini" showHeader={false} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton variant="table" category="portfolio" title="Holdings" rows={4} />
          <CardSkeleton variant="radar" category="risk" title="Risk Radar" />
          <CardSkeleton variant="stats" category="growth" title="Growth Metrics" />
        </div>
        <div className="flex items-center justify-center gap-8 bg-slate-900 rounded-xl border border-slate-700 p-8">
          <LoadingSpinner size="sm" label="Small" />
          <LoadingSpinner size="md" label="Medium" />
          <LoadingSpinner size="lg" label="Large" />
        </div>
      </div>
    </section>
  );
}

export default function UIShowcase() {
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [cardStatus, setCardStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'empty'>('success');

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">UI Component Library</h1>
          <p className="text-slate-400">
            Monomorph's design system foundation. All components follow the dark theme palette
            with indigo primary, teal accent, and semantic colors.
          </p>
          <div className="flex gap-2 mt-4">
            <Badge variant="success">Phase 1 ✓</Badge>
            <Badge variant="success">Phase 2 ✓</Badge>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* CARD SHELL (Phase 2) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-2">Card Shell (Phase 2)</h2>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-400">Card States</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {(['success', 'loading', 'error', 'empty'] as const).map(status => (
                <Button
                  key={status}
                  variant={cardStatus === status ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCardStatus(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardShell
                title="Fair Value Forecaster"
                description="DCF-based intrinsic value projection"
                symbol="TCS"
                asOf="Dec 12, 2025"
                category="Value"
                badge={{ label: "Undervalued", variant: "success" }}
                status={cardStatus}
                error="Failed to load fair value data"
                emptyMessage="No valuation data available"
                headerRight={
                  <div className="text-right">
                    <div className="text-2xl font-bold">₹4,250</div>
                    <div className="text-xs text-emerald-400">+12.5% upside</div>
                  </div>
                }
              >
                <CardMetricGrid
                  metrics={[
                    { label: "Current Price", value: "₹3,780" },
                    { label: "Fair Value", value: "₹4,250", trend: "up" },
                    { label: "Margin of Safety", value: "12.4%", subValue: "Good", trend: "up" },
                    { label: "Confidence", value: "78%" },
                  ]}
                  columns={4}
                />
                <div className="h-32 bg-slate-800/30 rounded-lg mt-4 flex items-center justify-center text-slate-500">
                  Chart Placeholder
                </div>
              </CardShell>

              <CardShell
                title="Risk Dashboard"
                symbol="RELIANCE"
                badge={{ label: "Medium Risk", variant: "warning" }}
                size="standard"
                status="success"
                compact
              >
                <CardSection title="Key Metrics">
                  <CardMetricGrid
                    metrics={[
                      { label: "VaR (95%)", value: "₹45K" },
                      { label: "Max Drawdown", value: "-18.5%", trend: "down" },
                      { label: "Beta", value: "1.12" },
                      { label: "Sharpe", value: "1.85", trend: "up" },
                    ]}
                    columns={4}
                  />
                </CardSection>
              </CardShell>
            </div>
          </div>

          {/* Mini Card */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-400">Mini Card</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <CardShell
                title="Sentiment Score"
                size="mini"
                badge={{ label: "Bullish", variant: "success" }}
              >
                <div className="text-2xl font-bold text-emerald-400">72</div>
              </CardShell>
              <CardShell
                title="Warning Sentinel"
                size="mini"
                badge={{ label: "2 Alerts", variant: "warning" }}
              >
                <div className="text-2xl font-bold text-amber-400">!</div>
              </CardShell>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* STATUS BADGES (Phase 2) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-2">Status Badges (Phase 2)</h2>
          
          {/* Signal Badges */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-400">Signal Badges</h3>
            <div className="flex flex-wrap gap-2">
              <SignalBadge signal="strong-buy" />
              <SignalBadge signal="buy" />
              <SignalBadge signal="bullish" />
              <SignalBadge signal="hold" />
              <SignalBadge signal="neutral" />
              <SignalBadge signal="bearish" />
              <SignalBadge signal="sell" />
              <SignalBadge signal="strong-sell" />
            </div>
          </div>

          {/* Health Badges */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-400">Health Badges</h3>
            <div className="flex flex-wrap gap-2">
              <HealthBadge health="excellent" />
              <HealthBadge health="good" />
              <HealthBadge health="fair" />
              <HealthBadge health="poor" />
              <HealthBadge health="critical" />
            </div>
          </div>

          {/* Other Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-400">Trend Badges</h3>
              <div className="flex flex-wrap gap-2">
                <TrendBadge trend="up" value="+15.2%" />
                <TrendBadge trend="down" value="-8.3%" />
                <TrendBadge trend="flat" />
                <TrendBadge trend="volatile" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-400">Risk Badges</h3>
              <div className="flex flex-wrap gap-2">
                <RiskBadge risk="low" />
                <RiskBadge risk="medium" />
                <RiskBadge risk="high" />
                <RiskBadge risk="extreme" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-400">Valuation Badges</h3>
              <div className="flex flex-wrap gap-2">
                <ValuationBadge valuation="deep-value" />
                <ValuationBadge valuation="undervalued" />
                <ValuationBadge valuation="fair-value" />
                <ValuationBadge valuation="overvalued" />
              </div>
            </div>
          </div>

          {/* Score, Change, Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-400">Score Badges</h3>
              <div className="flex flex-wrap gap-2">
                <ScoreBadge score={92} />
                <ScoreBadge score={75} />
                <ScoreBadge score={45} />
                <ScoreBadge score={8} max={10} />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-400">Change Badges</h3>
              <div className="flex flex-wrap gap-2">
                <ChangeBadge value={12.5} />
                <ChangeBadge value={-8.3} />
                <ChangeBadge value={0} />
                <ChangeBadge value={1250} format="currency" prefix="₹" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-400">Category Badges</h3>
              <div className="flex flex-wrap gap-2">
                <CategoryBadge category="value" />
                <CategoryBadge category="growth" />
                <CategoryBadge category="risk" />
                <CategoryBadge category="technical" />
              </div>
            </div>
          </div>

          {/* Live Indicator */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-400">Live Indicator</h3>
            <div className="flex gap-4">
              <LiveIndicator />
              <LiveIndicator isLive={false} label="Delayed" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* MODALS (Phase 2) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-2">Modals (Phase 2)</h2>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setShowModal(true)}>Open Modal</Button>
            <Button variant="danger" onClick={() => setShowConfirm(true)}>Confirm Dialog</Button>
            <Button variant="warning" onClick={() => setShowAlert(true)}>Alert Dialog</Button>
          </div>

          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Add New Workflow"
            description="Create a custom analysis pipeline"
            size="md"
            footer={
              <>
                <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={() => setShowModal(false)}>Create Workflow</Button>
              </>
            }
          >
            <div className="space-y-4">
              <FormField label="Workflow Name" required>
                <Input placeholder="My Analysis Pipeline" />
              </FormField>
              <FormField label="Description">
                <Textarea placeholder="Describe what this workflow does..." rows={3} />
              </FormField>
            </div>
          </Modal>

          <ConfirmModal
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => setShowConfirm(false)}
            title="Delete Workflow?"
            message="This action cannot be undone. All associated data will be permanently removed."
            variant="danger"
            confirmLabel="Delete"
          />

          <AlertModal
            isOpen={showAlert}
            onClose={() => setShowAlert(false)}
            title="Analysis Complete"
            message="Your stock analysis has finished running. 12 insights were generated."
            type="success"
          />
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* BUTTONS (Phase 1) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-2">Buttons (Phase 1)</h2>
          
          {/* Variants */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-400">Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="teal">Teal</Button>
              <Button variant="link">Link Button</Button>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-400">Sizes</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </div>

          {/* With Icons */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-400">With Icons</h3>
            <div className="flex flex-wrap gap-3">
              <Button leftIcon={<span>▶</span>}>Run Workflow</Button>
              <Button variant="success" rightIcon={<span>✓</span>}>Save</Button>
              <Button variant="outline" leftIcon={<span>📊</span>} rightIcon={<span>→</span>}>
                View Report
              </Button>
            </div>
          </div>

          {/* States */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-400">States</h3>
            <div className="flex flex-wrap gap-3">
              <Button disabled>Disabled</Button>
              <Button isLoading onClick={handleLoadingDemo}>
                {isLoading ? 'Loading...' : 'Click for Loading'}
              </Button>
              <Button isLoading={isLoading}>Save Changes</Button>
            </div>
          </div>

          {/* Button Groups */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-400">Button Groups</h3>
            <div className="flex flex-wrap gap-6">
              <ButtonGroup>
                <Button variant="secondary">Left</Button>
                <Button variant="secondary">Center</Button>
                <Button variant="secondary">Right</Button>
              </ButtonGroup>
              <ButtonGroup attached>
                <Button variant="outline">◀</Button>
                <Button variant="outline">Page 1</Button>
                <Button variant="outline">▶</Button>
              </ButtonGroup>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* INPUTS (Phase 1) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-2">Form Inputs (Phase 1)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Input */}
            <FormField label="Default Input" htmlFor="input-default">
              <Input
                id="input-default"
                placeholder="Enter text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </FormField>

            {/* Teal Variant (for symbols) */}
            <FormField label="Symbol Input (Teal)" htmlFor="input-symbol">
              <Input
                id="input-symbol"
                variant="teal"
                placeholder="TCS"
                inputSize="md"
              />
            </FormField>

            {/* With Error */}
            <FormField label="With Error" htmlFor="input-error" error="This field is required">
              <Input id="input-error" variant="error" placeholder="Enter value..." />
            </FormField>

            {/* With Success */}
            <FormField label="With Success" htmlFor="input-success" hint="Looks good!">
              <Input id="input-success" variant="success" defaultValue="Valid input" />
            </FormField>
          </div>

          {/* Search Input */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-400">Search Input</h3>
            <div className="max-w-md">
              <SearchInput
                placeholder="Search cards..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
              />
            </div>
          </div>

          {/* Checkboxes & Radio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-400">Checkboxes</h3>
              <div className="space-y-2">
                <Checkbox label="Include fundamentals" defaultChecked />
                <Checkbox label="Include technicals" />
                <Checkbox label="Enable notifications" disabled />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-400">Radio Buttons</h3>
              <div className="space-y-2">
                <Radio name="output" label="Cards view" value="cards" defaultChecked />
                <Radio name="output" label="List view" value="list" />
                <Radio name="output" label="Report view" value="report" />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* BADGES (Phase 1) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-2">Basic Badges (Phase 1)</h2>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ACCESSIBILITY */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-2">Accessibility</h2>
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
            <h3 className="text-sm font-medium mb-2">Features:</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>✓ Skip links for keyboard users (Tab at top of page)</li>
              <li>✓ Focus rings on all interactive elements</li>
              <li>✓ motion-safe animations (respects reduce-motion preference)</li>
              <li>✓ ARIA labels on icon buttons</li>
              <li>✓ Form labels properly associated with inputs</li>
              <li>✓ Focus trap in modals</li>
              <li>✓ Escape key closes modals</li>
            </ul>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* STATE COMPONENTS (V49) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <StateComponentsShowcase />

        {/* Footer */}
        <footer className="text-center text-sm text-slate-500 pt-8 border-t border-slate-800">
          Monomorph UI Component Library • Phase 1, 2 & State Components Complete
        </footer>
      </div>
    </div>
  );
}
