'use client';

import { useState, useEffect, useCallback } from 'react';
import { HealthCheckResult, HealthCheckApiResponse } from '@/types';

/**
 * Custom hook for polling the health check API.
 *
 * Features:
 * - Automatically polls at a configurable interval
 * - Handles loading, error, and success states
 * - Provides manual refresh capability
 *
 * @param pollingIntervalMs - Interval between polls in milliseconds (default: 60000)
 * @returns Object containing results, loading state, error, and refresh function
 */
export function useHealthCheck(pollingIntervalMs?: number) {
  const [results, setResults] = useState<HealthCheckResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Use environment variable or default to 60 seconds
  const interval = pollingIntervalMs ?? Number(process.env.NEXT_PUBLIC_POLLING_INTERVAL) ?? 60000;

  /**
   * Fetches health check data from the API.
   */
  const fetchHealth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/health-check', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: HealthCheckApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Health check failed.');
      }

      setResults(data.results);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch health check data';
      setError(errorMessage);
      console.error('useHealthCheck error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and set up polling interval
  useEffect(() => {
    fetchHealth();

    const intervalId = setInterval(fetchHealth, interval);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchHealth, interval]);

  return {
    results,
    loading,
    error,
    lastUpdated,
    refresh: fetchHealth,
  };
}
