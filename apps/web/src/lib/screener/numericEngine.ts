// ═══════════════════════════════════════════════════════════════════════════
// MONOMORPH NUMERIC WORKFLOW ENGINE
// Pure numeric pipeline - no visuals until final render
// ═══════════════════════════════════════════════════════════════════════════

import { Stock } from './queryParser';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type OperatorType = 
  | 'filter' 
  | 'rank' 
  | 'score' 
  | 'calculate' 
  | 'compare' 
  | 'merge' 
  | 'aggregate' 
  | 'group'
  | 'sort'
  | 'limit'
  | 'transform'
  | 'join'
  | 'pivot'
  | 'normalize';

export type AggregateFunction = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'median' | 'stddev' | 'percentile';
export type CompareMode = 'absolute' | 'relative' | 'percentile' | 'zscore';
export type NormalizeMode = 'minmax' | 'zscore' | 'percentile' | 'rank';

export interface OperatorConfig {
  type: OperatorType;
  params: Record<string, any>;
}

export interface PipelineResult {
  data: any[];
  metadata: {
    inputCount: number;
    outputCount: number;
    operationsApplied: string[];
    executionTime: number;
    columns: string[];
    aggregates?: Record<string, number>;
    groups?: Record<string, any[]>;
  };
}

export interface ScoreConfig {
  name: string;
  field: string;
  weight: number;
  higherIsBetter: boolean;
  threshold?: { min?: number; max?: number };
}

export interface CalculateConfig {
  outputField: string;
  formula: string; // e.g., "pe * pb", "roe / debtToEquity", "(a + b) / 2"
  fields: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// OPERATOR IMPLEMENTATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * FILTER - Remove rows that don't match conditions
 */
export function filter(
  data: any[],
  conditions: Array<{ field: string; operator: string; value: any }>
): any[] {
  return data.filter(row => {
    return conditions.every(cond => {
      const fieldValue = row[cond.field];
      if (fieldValue === undefined || fieldValue === null) return false;
      
      switch (cond.operator) {
        case '>': return fieldValue > cond.value;
        case '<': return fieldValue < cond.value;
        case '>=': return fieldValue >= cond.value;
        case '<=': return fieldValue <= cond.value;
        case '=': case '==': return fieldValue === cond.value;
        case '!=': case '<>': return fieldValue !== cond.value;
        case 'in': return Array.isArray(cond.value) && cond.value.includes(fieldValue);
        case 'not_in': return Array.isArray(cond.value) && !cond.value.includes(fieldValue);
        case 'contains': return String(fieldValue).toLowerCase().includes(String(cond.value).toLowerCase());
        case 'between': return fieldValue >= cond.value[0] && fieldValue <= cond.value[1];
        default: return true;
      }
    });
  });
}

/**
 * RANK - Assign rank based on field value
 */
export function rank(
  data: any[],
  field: string,
  order: 'asc' | 'desc' = 'desc',
  outputField: string = '_rank'
): any[] {
  const sorted = [...data].sort((a, b) => {
    const aVal = a[field] ?? (order === 'desc' ? -Infinity : Infinity);
    const bVal = b[field] ?? (order === 'desc' ? -Infinity : Infinity);
    return order === 'desc' ? bVal - aVal : aVal - bVal;
  });
  
  return sorted.map((row, idx) => ({
    ...row,
    [outputField]: idx + 1,
  }));
}

/**
 * SCORE - Calculate weighted composite score
 */
export function score(
  data: any[],
  configs: ScoreConfig[],
  outputField: string = '_score'
): any[] {
  // First, normalize each field to 0-100 scale
  const normalized = normalizeFields(data, configs.map(c => c.field));
  
  return normalized.map(row => {
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const config of configs) {
      const normalizedField = `_norm_${config.field}`;
      let fieldScore = row[normalizedField] ?? 50;
      
      // Invert if lower is better
      if (!config.higherIsBetter) {
        fieldScore = 100 - fieldScore;
      }
      
      // Apply threshold penalties
      if (config.threshold) {
        const rawValue = row[config.field];
        if (config.threshold.min !== undefined && rawValue < config.threshold.min) {
          fieldScore *= 0.5; // Penalty for below minimum
        }
        if (config.threshold.max !== undefined && rawValue > config.threshold.max) {
          fieldScore *= 0.5; // Penalty for above maximum
        }
      }
      
      totalScore += fieldScore * config.weight;
      totalWeight += config.weight;
    }
    
    return {
      ...row,
      [outputField]: totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0,
    };
  });
}

/**
 * CALCULATE - Create new fields from formulas
 */
export function calculate(
  data: any[],
  configs: CalculateConfig[]
): any[] {
  return data.map(row => {
    const result = { ...row };
    
    for (const config of configs) {
      try {
        // Simple formula parser - supports basic math operations
        let formula = config.formula;
        
        // Replace field names with values
        for (const field of config.fields) {
          const value = row[field] ?? 0;
          formula = formula.replace(new RegExp(`\\b${field}\\b`, 'g'), String(value));
        }
        
        // Evaluate (using Function for simple math - safe for numeric operations)
        const calculated = evaluateFormula(formula);
        result[config.outputField] = isNaN(calculated) ? null : calculated;
      } catch (e) {
        result[config.outputField] = null;
      }
    }
    
    return result;
  });
}

/**
 * COMPARE - Compare values across rows or to benchmarks
 */
export function compare(
  data: any[],
  field: string,
  mode: CompareMode = 'percentile',
  benchmark?: number,
  outputField?: string
): any[] {
  const output = outputField || `_compare_${field}`;
  const values = data.map(r => r[field]).filter(v => v != null);
  
  switch (mode) {
    case 'absolute':
      return data.map(row => ({
        ...row,
        [output]: benchmark !== undefined ? row[field] - benchmark : row[field],
      }));
    
    case 'relative':
      const baseline = benchmark ?? average(values);
      return data.map(row => ({
        ...row,
        [output]: baseline !== 0 ? ((row[field] - baseline) / baseline) * 100 : 0,
      }));
    
    case 'percentile':
      return data.map(row => ({
        ...row,
        [output]: percentileRank(row[field], values),
      }));
    
    case 'zscore':
      const mean = average(values);
      const std = stdDev(values);
      return data.map(row => ({
        ...row,
        [output]: std !== 0 ? (row[field] - mean) / std : 0,
      }));
    
    default:
      return data;
  }
}

/**
 * MERGE - Combine multiple datasets
 */
export function merge(
  datasets: any[][],
  keyField: string = 'symbol',
  mode: 'inner' | 'left' | 'outer' = 'inner'
): any[] {
  if (datasets.length === 0) return [];
  if (datasets.length === 1) return datasets[0];
  
  const [first, ...rest] = datasets;
  let result = [...first];
  
  for (const dataset of rest) {
    const dataMap = new Map(dataset.map(row => [row[keyField], row]));
    
    if (mode === 'inner') {
      result = result
        .filter(row => dataMap.has(row[keyField]))
        .map(row => ({ ...row, ...dataMap.get(row[keyField]) }));
    } else if (mode === 'left') {
      result = result.map(row => ({
        ...row,
        ...(dataMap.get(row[keyField]) || {}),
      }));
    } else {
      // outer join
      const resultMap = new Map(result.map(row => [row[keyField], row]));
      const allKeys = new Set([
        ...result.map(r => r[keyField]),
        ...dataset.map(r => r[keyField]),
      ]);
      
      result = Array.from(allKeys).map(key => ({
        ...(resultMap.get(key) || {}),
        ...(dataMap.get(key) || {}),
        [keyField]: key,
      }));
    }
  }
  
  return result;
}

/**
 * AGGREGATE - Compute aggregate statistics
 */
export function aggregate(
  data: any[],
  field: string,
  functions: AggregateFunction[]
): Record<string, number> {
  const values = data.map(r => r[field]).filter(v => v != null && !isNaN(v));
  
  const result: Record<string, number> = {};
  
  for (const fn of functions) {
    switch (fn) {
      case 'sum':
        result[`${field}_sum`] = values.reduce((a, b) => a + b, 0);
        break;
      case 'avg':
        result[`${field}_avg`] = average(values);
        break;
      case 'min':
        result[`${field}_min`] = Math.min(...values);
        break;
      case 'max':
        result[`${field}_max`] = Math.max(...values);
        break;
      case 'count':
        result[`${field}_count`] = values.length;
        break;
      case 'median':
        result[`${field}_median`] = median(values);
        break;
      case 'stddev':
        result[`${field}_stddev`] = stdDev(values);
        break;
      case 'percentile':
        result[`${field}_p25`] = percentile(values, 25);
        result[`${field}_p50`] = percentile(values, 50);
        result[`${field}_p75`] = percentile(values, 75);
        break;
    }
  }
  
  return result;
}

/**
 * GROUP - Group data by field value
 */
export function group(
  data: any[],
  field: string,
  aggregations?: Array<{ field: string; fn: AggregateFunction }>
): Record<string, any[]> | any[] {
  const groups: Record<string, any[]> = {};
  
  for (const row of data) {
    const key = String(row[field] ?? 'unknown');
    if (!groups[key]) groups[key] = [];
    groups[key].push(row);
  }
  
  if (!aggregations) return groups;
  
  // Return aggregated results per group
  return Object.entries(groups).map(([key, rows]) => {
    const result: any = { [field]: key, _count: rows.length };
    
    for (const agg of aggregations) {
      const aggResult = aggregate(rows, agg.field, [agg.fn]);
      Object.assign(result, aggResult);
    }
    
    return result;
  });
}

/**
 * SORT - Sort data by field(s)
 */
export function sort(
  data: any[],
  sorts: Array<{ field: string; order: 'asc' | 'desc' }>
): any[] {
  return [...data].sort((a, b) => {
    for (const s of sorts) {
      const aVal = a[s.field];
      const bVal = b[s.field];
      
      if (aVal === bVal) continue;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      
      const comparison = aVal < bVal ? -1 : 1;
      return s.order === 'asc' ? comparison : -comparison;
    }
    return 0;
  });
}

/**
 * LIMIT - Take top N rows
 */
export function limit(data: any[], n: number, offset: number = 0): any[] {
  return data.slice(offset, offset + n);
}

/**
 * TRANSFORM - Apply transformation to field values
 */
export function transform(
  data: any[],
  field: string,
  transformation: 'log' | 'sqrt' | 'square' | 'abs' | 'round' | 'ceil' | 'floor' | 'percent',
  outputField?: string
): any[] {
  const output = outputField || field;
  
  return data.map(row => {
    const value = row[field];
    if (value == null) return { ...row, [output]: null };
    
    let transformed: number;
    switch (transformation) {
      case 'log': transformed = Math.log(value); break;
      case 'sqrt': transformed = Math.sqrt(value); break;
      case 'square': transformed = value * value; break;
      case 'abs': transformed = Math.abs(value); break;
      case 'round': transformed = Math.round(value); break;
      case 'ceil': transformed = Math.ceil(value); break;
      case 'floor': transformed = Math.floor(value); break;
      case 'percent': transformed = value * 100; break;
      default: transformed = value;
    }
    
    return { ...row, [output]: transformed };
  });
}

/**
 * NORMALIZE - Normalize field values to standard scale
 */
export function normalize(
  data: any[],
  field: string,
  mode: NormalizeMode = 'minmax',
  outputField?: string
): any[] {
  const output = outputField || `_norm_${field}`;
  const values = data.map(r => r[field]).filter(v => v != null);
  
  if (values.length === 0) return data;
  
  switch (mode) {
    case 'minmax':
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min;
      return data.map(row => ({
        ...row,
        [output]: range !== 0 ? ((row[field] - min) / range) * 100 : 50,
      }));
    
    case 'zscore':
      const mean = average(values);
      const std = stdDev(values);
      return data.map(row => ({
        ...row,
        [output]: std !== 0 ? (row[field] - mean) / std : 0,
      }));
    
    case 'percentile':
      return data.map(row => ({
        ...row,
        [output]: percentileRank(row[field], values),
      }));
    
    case 'rank':
      if (data.length === 0) return data;
      const ranked = rank(data, field, 'desc', output);
      return ranked.map(row => ({
        ...row,
        [output]: ((data.length - row[output] + 1) / data.length) * 100,
      }));
    
    default:
      return data;
  }
}

/**
 * PIVOT - Pivot data for visualization
 */
export function pivot(
  data: any[],
  rowField: string,
  columnField: string,
  valueField: string,
  aggFn: AggregateFunction = 'avg'
): { rows: string[]; columns: string[]; values: number[][] } {
  const rows = [...new Set(data.map(r => r[rowField]))];
  const columns = [...new Set(data.map(r => r[columnField]))];
  
  const values: number[][] = rows.map(() => columns.map(() => 0));
  const counts: number[][] = rows.map(() => columns.map(() => 0));
  
  for (const row of data) {
    const rowIdx = rows.indexOf(row[rowField]);
    const colIdx = columns.indexOf(row[columnField]);
    if (rowIdx >= 0 && colIdx >= 0) {
      values[rowIdx][colIdx] += row[valueField] ?? 0;
      counts[rowIdx][colIdx]++;
    }
  }
  
  if (aggFn === 'avg') {
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        if (counts[i][j] > 0) {
          values[i][j] /= counts[i][j];
        }
      }
    }
  }
  
  return { rows: rows.map(String), columns: columns.map(String), values };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function normalizeFields(data: any[], fields: string[]): any[] {
  const normalized = data.map(row => ({ ...row }));
  
  for (const field of fields) {
    const values = data.map(r => r[field]).filter(v => v != null);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    
    for (const row of normalized) {
      row[`_norm_${field}`] = range !== 0 
        ? ((row[field] - min) / range) * 100 
        : 50;
    }
  }
  
  return normalized;
}

function evaluateFormula(formula: string): number {
  // Safe math evaluation - only allows numbers and basic operators
  const sanitized = formula.replace(/[^0-9+\-*/().%\s]/g, '');
  try {
    return Function(`"use strict"; return (${sanitized})`)();
  } catch {
    return NaN;
  }
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 
    ? sorted[mid] 
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function stdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const avg = average(values);
  const squareDiffs = values.map(v => Math.pow(v - avg, 2));
  return Math.sqrt(average(squareDiffs));
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
}

function percentileRank(value: number, allValues: number[]): number {
  if (value == null || allValues.length === 0) return 0;
  const below = allValues.filter(v => v < value).length;
  return (below / allValues.length) * 100;
}

// ─────────────────────────────────────────────────────────────────────────────
// PIPELINE BUILDER
// ─────────────────────────────────────────────────────────────────────────────

export class NumericPipeline {
  private operations: Array<{ name: string; fn: (data: any[]) => any[] | any }> = [];
  private aggregateResults: Record<string, number> = {};
  private groupResults: Record<string, any[]> = {};
  
  filter(conditions: Array<{ field: string; operator: string; value: any }>): this {
    this.operations.push({
      name: `filter(${conditions.length} conditions)`,
      fn: (data) => filter(data, conditions),
    });
    return this;
  }
  
  rank(field: string, order: 'asc' | 'desc' = 'desc', outputField?: string): this {
    this.operations.push({
      name: `rank(${field}, ${order})`,
      fn: (data) => rank(data, field, order, outputField),
    });
    return this;
  }
  
  score(configs: ScoreConfig[], outputField?: string): this {
    this.operations.push({
      name: `score(${configs.length} factors)`,
      fn: (data) => score(data, configs, outputField),
    });
    return this;
  }
  
  calculate(configs: CalculateConfig[]): this {
    this.operations.push({
      name: `calculate(${configs.map(c => c.outputField).join(', ')})`,
      fn: (data) => calculate(data, configs),
    });
    return this;
  }
  
  compare(field: string, mode: CompareMode = 'percentile', benchmark?: number): this {
    this.operations.push({
      name: `compare(${field}, ${mode})`,
      fn: (data) => compare(data, field, mode, benchmark),
    });
    return this;
  }
  
  normalize(field: string, mode: NormalizeMode = 'minmax', outputField?: string): this {
    this.operations.push({
      name: `normalize(${field}, ${mode})`,
      fn: (data) => normalize(data, field, mode, outputField),
    });
    return this;
  }
  
  sort(sorts: Array<{ field: string; order: 'asc' | 'desc' }>): this {
    this.operations.push({
      name: `sort(${sorts.map(s => `${s.field} ${s.order}`).join(', ')})`,
      fn: (data) => sort(data, sorts),
    });
    return this;
  }
  
  limit(n: number, offset?: number): this {
    this.operations.push({
      name: `limit(${n}${offset ? `, offset ${offset}` : ''})`,
      fn: (data) => limit(data, n, offset),
    });
    return this;
  }
  
  transform(field: string, transformation: Parameters<typeof transform>[2], outputField?: string): this {
    this.operations.push({
      name: `transform(${field}, ${transformation})`,
      fn: (data) => transform(data, field, transformation, outputField),
    });
    return this;
  }
  
  aggregate(field: string, functions: AggregateFunction[]): this {
    this.operations.push({
      name: `aggregate(${field})`,
      fn: (data) => {
        this.aggregateResults = { ...this.aggregateResults, ...aggregate(data, field, functions) };
        return data; // Pass through data unchanged
      },
    });
    return this;
  }
  
  group(field: string, aggregations?: Array<{ field: string; fn: AggregateFunction }>): this {
    this.operations.push({
      name: `group(${field})`,
      fn: (data) => {
        const result = group(data, field, aggregations);
        if (Array.isArray(result)) {
          return result; // Aggregated groups
        }
        this.groupResults = result;
        return data;
      },
    });
    return this;
  }
  
  /**
   * Execute the pipeline
   */
  execute(data: any[]): PipelineResult {
    const startTime = performance.now();
    const inputCount = data.length;
    const operationsApplied: string[] = [];
    
    let result = [...data];
    
    for (const op of this.operations) {
      result = op.fn(result);
      operationsApplied.push(op.name);
      
      // Handle group results that return aggregated arrays
      if (!Array.isArray(result)) {
        result = [];
      }
    }
    
    const columns = result.length > 0 ? Object.keys(result[0]) : [];
    
    return {
      data: result,
      metadata: {
        inputCount,
        outputCount: result.length,
        operationsApplied,
        executionTime: performance.now() - startTime,
        columns,
        aggregates: Object.keys(this.aggregateResults).length > 0 ? this.aggregateResults : undefined,
        groups: Object.keys(this.groupResults).length > 0 ? this.groupResults : undefined,
      },
    };
  }
  
  /**
   * Reset pipeline
   */
  reset(): this {
    this.operations = [];
    this.aggregateResults = {};
    this.groupResults = {};
    return this;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default {
  filter,
  rank,
  score,
  calculate,
  compare,
  merge,
  aggregate,
  group,
  sort,
  limit,
  transform,
  normalize,
  pivot,
  NumericPipeline,
};
