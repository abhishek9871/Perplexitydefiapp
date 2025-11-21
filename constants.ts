import { Token, Trade, ChartDataPoint } from './types';

export const TOKENS: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026',
    balance: 5.42,
    decimals: 18,
    price: 3013.41
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026',
    balance: 12500.50,
    decimals: 6,
    price: 1.00
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026',
    balance: 0.15,
    decimals: 8,
    price: 68420.69
  }
];

export const INITIAL_TRADES: Trade[] = [
  { id: '1', time: '14:32:05', type: 'BUY', price: 68420.69, amount: 0.0512, total: 3502.84 },
  { id: '2', time: '14:32:01', type: 'SELL', price: 68418.23, amount: 0.1200, total: 8210.18 },
  { id: '3', time: '14:31:58', type: 'BUY', price: 68419.01, amount: 0.0750, total: 5131.42 },
  { id: '4', time: '14:31:55', type: 'BUY', price: 68418.50, amount: 0.2500, total: 17104.62 },
  { id: '5', time: '14:31:52', type: 'SELL', price: 68419.99, amount: 0.0987, total: 6753.05 },
];

// Helper to generate realistic-ish candle data
export const generateMockCandles = (count: number, startPrice: number): ChartDataPoint[] => {
  let currentPrice = startPrice;
  const data: ChartDataPoint[] = [];
  const now = Math.floor(Date.now() / 1000);
  
  // Go back 'count' intervals (e.g., hours)
  for (let i = count; i > 0; i--) {
    const time = now - (i * 3600); // Hourly intervals
    const volatility = currentPrice * 0.002; // 0.2% volatility
    const change = (Math.random() - 0.5) * volatility;
    
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    
    data.push({ time, open, high, low, close });
    currentPrice = close;
  }
  return data;
};
