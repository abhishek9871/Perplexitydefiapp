import { PriceServiceConnection } from '@pythnetwork/price-service-client';

// Pyth price feed IDs (verified Nov 2025)
export const PYTH_PRICE_FEEDS = {
  ethereum: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  bitcoin: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  'usd-coin': '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
  arbitrum: '0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5',
} as const;

export type SupportedCoin = keyof typeof PYTH_PRICE_FEEDS;

export function getPythPriceId(coinId: string): string | null {
  return PYTH_PRICE_FEEDS[coinId as SupportedCoin] || null;
}

export interface PythTickData {
  price: number;
  time: number; // Unix timestamp in seconds
  confidence: number;
}

// Create singleton connection
let connection: PriceServiceConnection | null = null;

export function getPythConnection(): PriceServiceConnection {
  if (!connection) {
    connection = new PriceServiceConnection('https://hermes.pyth.network', {
      priceFeedRequestConfig: {
        binary: false, // We don't need on-chain VAA for display
      },
      logger: {
        error: console.error,
        warn: console.warn,
        info: console.log,
        debug: () => {}, // Suppress debug logs
        trace: () => {},
      },
    });
  }
  return connection;
}

export function subscribeToPythPriceFeed(
  coinId: string,
  onTick: (data: PythTickData) => void,
  onStatusChange: (status: 'connecting' | 'live' | 'offline' | 'unsupported') => void
): () => void {
  const priceId = getPythPriceId(coinId);
  
  if (!priceId) {
    onStatusChange('unsupported');
    return () => {};
  }

  onStatusChange('connecting');
  
  const conn = getPythConnection();
  
  try {
    // Subscribe using official SDK
    conn.subscribePriceFeedUpdates([priceId], (priceFeed) => {
      onStatusChange('live');
      
      const currentPrice = priceFeed.getPriceNoOlderThan(60); // Max 60s old
      if (currentPrice) {
        onTick({
          price: Number(currentPrice.price) * Math.pow(10, currentPrice.expo),
          time: Math.floor(Date.now() / 1000),
          confidence: Number(currentPrice.conf) * Math.pow(10, currentPrice.expo),
        });
      }
    });
    
    console.log(`[Pyth SDK] Subscribed to ${coinId} (${priceId})`);
    
    // Return cleanup function
    return () => {
      conn.closeWebSocket();
      console.log(`[Pyth SDK] Unsubscribed from ${coinId}`);
    };
    
  } catch (error) {
    console.error('[Pyth SDK] Subscription error:', error);
    onStatusChange('offline');
    return () => {};
  }
}
