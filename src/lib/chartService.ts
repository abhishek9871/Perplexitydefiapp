import { getTokenPrices } from './priceService';
import { Time } from 'lightweight-charts';

// Chart data cache with timestamp
const chartCache = new Map<string, { data: ChartDataPoint[]; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 60 seconds

export interface ChartDataPoint {
  time: Time; // Unix timestamp in SECONDS for Lightweight Charts
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Fetch OHLC (candlestick) data from CoinGecko's free API
 * CoinGecko OHLC endpoint: /coins/{id}/ohlc?vs_currency=usd&days={days}
 * Returns array of [timestamp_ms, open, high, low, close]
 * 
 * @param coinId - CoinGecko coin ID (e.g., 'ethereum', 'bitcoin')
 * @param days - Number of days of data to fetch (1, 7, 30, 90, 365)
 * @returns Promise<ChartDataPoint[]> - Array of candlestick data
 */
export async function getChartData(
  coinId: string,
  days: number
): Promise<ChartDataPoint[]> {
  // Check cache first
  const cacheKey = `${coinId}-${days}`;
  const cached = chartCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`📊 Using cached chart data for ${coinId} (${days} days)`);
    return cached.data;
  }

  try {
    console.log(`📊 Fetching chart data for ${coinId} (${days} days)`);
    
    // CoinGecko OHLC API endpoint (free tier, no API key needed)
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`❌ CoinGecko API error [${response.status}]: ${errorText}`);
      
      // If rate limited (429), return cached data if available even if expired
      if (response.status === 429 && cached) {
        console.warn(`⚠️ Rate limited, returning stale cache for ${coinId}`);
        return cached.data;
      }
      
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    // CoinGecko returns: [[timestamp_ms, open, high, low, close], ...]
    const rawData: number[][] = await response.json();
    
    // Validate response
    if (!Array.isArray(rawData) || rawData.length === 0) {
      console.warn(`⚠️ No chart data returned for ${coinId} (${days} days)`);
      // Return cached data if available, even if expired
      if (cached) {
        console.log(`📊 Returning stale cache due to empty response`);
        return cached.data;
      }
      return [];
    }
    
    // Transform to Lightweight Charts format
    const chartData: ChartDataPoint[] = rawData.map(([timestampMs, open, high, low, close]) => ({
      time: Math.floor(timestampMs / 1000) as Time, // Convert milliseconds to seconds and cast to Time
      open,
      high,
      low,
      close,
    }));

    // Cache the transformed data
    chartCache.set(cacheKey, {
      data: chartData,
      timestamp: Date.now(),
    });

    console.log(`📊 Successfully fetched ${chartData.length} data points for ${coinId}`);
    return chartData;

  } catch (error) {
    console.error('❌ Chart data fetch error:', error);
    
    // Return cached data if available, even if expired
    if (cached) {
      console.warn(`⚠️ Fetch failed, returning stale cache for ${coinId}`);
      return cached.data;
    }
    
    // Return empty array if API fails and no cache available
    return [];
  }
}

/**
 * Clear chart data cache (useful for testing)
 */
export function clearChartCache(): void {
  chartCache.clear();
  console.log('📊 Chart cache cleared');
}

/**
 * Get available timeframes for chart
 */
export const TIMEFRAMES = [
  { label: '1D', days: 1 },
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '1Y', days: 365 },
] as const;

export type Timeframe = typeof TIMEFRAMES[number];
