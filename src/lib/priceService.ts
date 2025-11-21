// CoinGecko Price Service - Free tier (30 calls/min, 10K/month, NO API key)
// Fetches real-time token prices for ETH, WBTC, USDC

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';

// CoinGecko token ID mapping
const COINGECKO_IDS = {
  'ETH': 'ethereum',
  'WBTC': 'wrapped-bitcoin',
  'USDC': 'usd-coin',
  'BTC': 'bitcoin',
} as const;

interface PriceCache {
  prices: Record<string, number>;
  timestamp: number;
}

let priceCache: PriceCache | null = null;
const CACHE_DURATION = 60 * 1000; // 60 seconds

/**
 * Fetches current token prices from CoinGecko
 * @returns Promise of token symbol to USD price mapping
 */
export async function getTokenPrices(): Promise<Record<string, number>> {
  // Return cached prices if still valid
  if (priceCache && Date.now() - priceCache.timestamp < CACHE_DURATION) {
    return priceCache.prices;
  }

  try {
    // Build query with all token IDs
    const ids = Object.values(COINGECKO_IDS).join(',');
    const url = `${COINGECKO_API}?ids=${ids}&vs_currencies=usd`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    // Map CoinGecko IDs back to token symbols
    const prices: Record<string, number> = {};
    Object.entries(COINGECKO_IDS).forEach(([symbol, geckoId]) => {
      if (data[geckoId]?.usd) {
        prices[symbol] = data[geckoId].usd;
      }
    });

    // Update cache
    priceCache = {
      prices,
      timestamp: Date.now(),
    };

    return prices;
  } catch (error) {
    console.error('Failed to fetch token prices from CoinGecko:', error);
    
    // Return cached prices if available (even if stale)
    if (priceCache) {
      console.warn('Using stale price cache due to fetch error');
      return priceCache.prices;
    }
    
    // Return empty object if no cache available
    return {};
  }
}

/**
 * Get price for a specific token symbol
 * @param symbol - Token symbol (e.g., 'ETH', 'USDC')
 * @returns USD price or null if not available
 */
export async function getTokenPrice(symbol: string): Promise<number | null> {
  const prices = await getTokenPrices();
  return prices[symbol] || null;
}

/**
 * Clear the price cache (useful for testing)
 */
export function clearPriceCache(): void {
  priceCache = null;
}
