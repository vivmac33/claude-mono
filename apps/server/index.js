
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 4000;
app.use(require('cors')());
app.use(express.json());
const mockDir = path.join(__dirname, 'mock-data');
function sendJSON(name, res){ const p = path.join(mockDir, name); if(fs.existsSync(p)) res.json(JSON.parse(fs.readFileSync(p,'utf8'))); else res.status(404).json({status:'missing', name}); }
app.get('/api/valuation/summary', (req,res)=> sendJSON('valuation_summary.json', res));
app.get('/api/growth/summary', (req,res)=> sendJSON('growth_summary.json', res));
app.get('/api/dividend/profile', (req,res)=> sendJSON('dividend_profile.json', res));
app.get('/api/risk/snapshot', (req,res)=> sendJSON('risk_snapshot.json', res));
app.get('/api/portfolio/leaderboard', (req,res)=> sendJSON('portfolio_leaderboard.json', res));
app.get('/api/etf/compare', (req,res)=> sendJSON('etf_compare.json', res));
app.get('/api/valuation/forecaster', (req,res)=> sendJSON('fv_forecast.json', res));
app.get('/api/valuation/ratios', (req,res)=> sendJSON('ratio_evolution.json', res));
app.get('/api/dividends/projection', (req,res)=> sendJSON('dividend_projection.json', res));
app.get('/api/quant/pattern', (req,res)=> sendJSON('pattern_matcher.json', res));
app.get('/api/minis/sentiment-zscore', (req,res)=> sendJSON('sentiment_zscore.json', res));
app.get('/api/minis/warning-sentinel', (req,res)=> sendJSON('warning_sentinel.json', res));
app.get('/api/minis/factor-tilt', (req,res)=> sendJSON('factor_tilt.json', res));

// India-specific analytics endpoints

app.get('/api/ohlcv/:symbol', (req,res)=> sendJSON('ohlcv_'+req.params.symbol+'.json', res));
app.get('/', (req,res)=> res.send({status:'ok'}));
app.listen(port, ()=> console.log('Server listening on', port));

// Generic analytics endpoints (re-usable across markets)
app.get('/api/analytics/piotroski-score', (req,res)=> sendJSON('analytics_piotroski.json', res));
app.get('/api/analytics/peer-comparison', (req,res)=> sendJSON('analytics_peer_comparison.json', res));
app.get('/api/analytics/risk-health', (req,res)=> sendJSON('analytics_risk_health.json', res));
app.get('/api/analytics/quarterly-results', (req,res)=> sendJSON('analytics_quarterly_results.json', res));
app.get('/api/analytics/shareholding-pattern', (req,res)=> sendJSON('analytics_shareholding.json', res));
app.get('/api/analytics/advanced-screener', (req,res)=> sendJSON('analytics_screener.json', res));
app.get('/api/analytics/technical-indicators', (req,res)=> sendJSON('analytics_technical_indicators.json', res));
app.get('/api/analytics/sector-insights', (req,res)=> sendJSON('analytics_sector_insights.json', res));
app.get('/api/analytics/institutional-flows', (req,res)=> sendJSON('analytics_institutional_flows.json', res));
app.get('/api/analytics/dcf-valuation', (req,res)=> sendJSON('analytics_dcf_valuation.json', res));
app.get('/api/analytics/management-quality', (req,res)=> sendJSON('analytics_management_quality.json', res));
app.get('/api/analytics/dupont-analysis', (req,res)=> sendJSON('analytics_dupont.json', res));
app.get('/api/analytics/portfolio-correlation', (req,res)=> sendJSON('analytics_portfolio_correlation.json', res));
app.get('/api/analytics/drawdown-var', (req,res)=> sendJSON('analytics_drawdown_var.json', res));
app.get('/api/analytics/attribution-tax', (req,res)=> sendJSON('analytics_attribution_tax.json', res));
app.get('/api/analytics/dividend-sip-tracker', (req,res)=> sendJSON('analytics_dividend_sip.json', res));
app.get('/api/analytics/macro-calendar', (req,res)=> sendJSON('analytics_macro_calendar.json', res));
app.get('/api/analytics/volatility-risk', (req,res)=> sendJSON('analytics_volatility_risk.json', res));
app.get('/api/analytics/orderbook-liquidity', (req,res)=> sendJSON('analytics_orderbook_liquidity.json', res));
app.get('/api/analytics/altman-graham', (req,res)=> sendJSON('analytics_altman_graham.json', res));


