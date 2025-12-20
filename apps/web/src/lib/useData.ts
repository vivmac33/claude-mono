// ═══════════════════════════════════════════════════════════════════════════
// REACT HOOKS FOR DATA FETCHING
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { getCardData, isRealDataCard } from './dataProvider';
import {
  getStockInfo,
  getAllStocks,
  searchStocks,
  getStockOHLCV,
  getAllMutualFunds,
  searchMutualFunds,
  getMutualFundsByCategory,
  StockInfo,
  MutualFund,
  StockOHLCV,
} from './dataService';

// ═══════════════════════════════════════════════════════════════════════════
// GENERIC CARD DATA HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useCardData(cardId: string, symbol: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const result = await getCardData(cardId, symbol);
        if (!cancelled) {
          setData(result);
          setIsRealData(isRealDataCard(cardId));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch data'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [cardId, symbol]);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCardData(cardId, symbol);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setLoading(false);
    }
  }, [cardId, symbol]);

  return { data, loading, error, isRealData, refetch };
}

// ═══════════════════════════════════════════════════════════════════════════
// STOCK HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useStockInfo(symbol: string) {
  const [data, setData] = useState<StockInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      try {
        const result = await getStockInfo(symbol);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Failed'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (symbol) fetch();

    return () => { cancelled = true; };
  }, [symbol]);

  return { data, loading, error };
}

export function useAllStocks() {
  const [data, setData] = useState<StockInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      try {
        const result = await getAllStocks();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Failed'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();

    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}

export function useStockSearch(query: string) {
  const [data, setData] = useState<StockInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function search() {
      if (!query || query.length < 2) {
        setData([]);
        return;
      }

      setLoading(true);
      try {
        const result = await searchStocks(query);
        if (!cancelled) setData(result);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const timeout = setTimeout(search, 300); // Debounce

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  return { data, loading };
}

// ═══════════════════════════════════════════════════════════════════════════
// OHLCV HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useStockOHLCV(symbol: string, days: number = 365) {
  const [data, setData] = useState<StockOHLCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      try {
        const result = await getStockOHLCV(symbol, days);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Failed'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (symbol) fetch();

    return () => { cancelled = true; };
  }, [symbol, days]);

  return { data, loading, error };
}

// ═══════════════════════════════════════════════════════════════════════════
// MUTUAL FUND HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useAllMutualFunds() {
  const [data, setData] = useState<MutualFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      try {
        const result = await getAllMutualFunds();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Failed'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();

    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}

export function useMutualFundsByCategory(category: string) {
  const [data, setData] = useState<MutualFund[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      if (!category) return;
      
      setLoading(true);
      try {
        const result = await getMutualFundsByCategory(category);
        if (!cancelled) setData(result);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();

    return () => { cancelled = true; };
  }, [category]);

  return { data, loading };
}

export function useMutualFundSearch(query: string) {
  const [data, setData] = useState<MutualFund[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function search() {
      if (!query || query.length < 2) {
        setData([]);
        return;
      }

      setLoading(true);
      try {
        const result = await searchMutualFunds(query);
        if (!cancelled) setData(result);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const timeout = setTimeout(search, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  return { data, loading };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ALL
// ═══════════════════════════════════════════════════════════════════════════

export default {
  useCardData,
  useStockInfo,
  useAllStocks,
  useStockSearch,
  useStockOHLCV,
  useAllMutualFunds,
  useMutualFundsByCategory,
  useMutualFundSearch,
};
