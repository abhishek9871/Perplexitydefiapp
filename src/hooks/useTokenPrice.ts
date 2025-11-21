// React Query hook for token price fetching and caching
import { useQuery } from '@tanstack/react-query';
import { getTokenPrices } from '../lib/priceService';

interface UseTokenPriceReturn {
  prices: Record<string, number>;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
}

/**
 * Hook to fetch and cache token prices from CoinGecko
 * 
 * Features:
 * - Auto-refresh every 60 seconds
 * - Caches results to avoid rate limits
 * - Retries 3 times on failure with exponential backoff
 * - Does not refetch on window focus
 * 
 * @returns Object containing prices, loading state, and error
 */
export function useTokenPrice(): UseTokenPriceReturn {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['tokenPrices'],
    queryFn: getTokenPrices,
    staleTime: 60 * 1000, // 1 minute (per spec PART 2.1 - avoid rate limits)
    refetchInterval: 60 * 1000, // Auto-refresh every 60 seconds
    refetchOnWindowFocus: false, // Don't refetch when user returns to tab
    retry: 3, // Retry 3 times on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  return {
    prices: data || {},
    isLoading,
    error: error as Error | null,
    isError,
  };
}
