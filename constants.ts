import { Token, Trade, ChartDataPoint, Vault } from './types';

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

export const MOCK_VAULTS: Vault[] = [
  {
    id: '1',
    name: 'AlphaBlue Chip Momentum',
    manager: '0x4b...a2ef',
    managerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCH7RmxvHMzXsY_aiNdG7YgliIOzbKcDll-Lih34f84TPwpTCNzoiV8N2CYH5vmEZTjMBzjMWx4ymCK9U0zSGl3m2MrUCJWzOD4l91JHXy7x5CzlvkD5CwTL8uVLQtI-1-s8OFiQnFD2Ka6BFrxHwpVCD6TbpzQGCxSC1VMQgwzWJhKkSGxUN81UnEIu-_qPG-RD932F8U4cvq0k944c3-9h5U5Hs_syMLOY4cbmbMKdCZZxB3UP1E5UL9T1AGPzsRDjHKwi8bjogI',
    asset: 'ETH',
    tvl: 1200000,
    apy: 45.6,
    weeklyChange: 12.5,
    investors: 450,
    createdAt: Date.now() - 100000000,
    isFeatured: true,
    description: "High-conviction momentum strategy focusing on blue-chip DeFi protocols on Arbitrum. Rebalances weekly based on on-chain volume metrics."
  },
  {
    id: '2',
    name: 'DeFi Yield Aggregator',
    manager: '0x8a...f3d1',
    asset: 'USDC',
    tvl: 980000,
    apy: 38.2,
    weeklyChange: 8.1,
    investors: 312,
    createdAt: Date.now() - 200000000
  },
  {
    id: '3',
    name: 'ETH Long-Term Hold',
    manager: '0x2c...b7a9',
    asset: 'ETH',
    tvl: 2500000,
    apy: 15.7,
    weeklyChange: -2.4,
    investors: 1045,
    createdAt: Date.now() - 500000000
  },
  {
    id: '4',
    name: 'Stablecoin Farmer',
    manager: '0x9f...e4c2',
    asset: 'USDC',
    tvl: 5100000,
    apy: 9.3,
    weeklyChange: 0.5,
    investors: 876,
    createdAt: Date.now() - 600000000
  },
  {
    id: '5',
    name: 'BTC Maxi Vault',
    manager: '0x1d...a8b6',
    asset: 'WBTC',
    tvl: 1800000,
    apy: 12.1,
    weeklyChange: -4.2,
    investors: 650,
    createdAt: Date.now() - 150000000
  },
  {
    id: '6',
    name: 'High-Risk Gems',
    manager: '0x5e...c9d3',
    asset: 'ETH',
    tvl: 450000,
    apy: 128.4,
    weeklyChange: 25.9,
    investors: 189,
    createdAt: Date.now() - 50000000
  },
  {
    id: '7',
    name: 'Momentum Trader',
    manager: '0x7b...f8e0',
    asset: 'WBTC',
    tvl: 720000,
    apy: 62.5,
    weeklyChange: 15.3,
    investors: 241,
    createdAt: Date.now() - 300000000
  },
  {
    id: '8',
    name: 'Delta Neutral Stable',
    manager: '0x3a...c1b2',
    asset: 'USDC',
    tvl: 3200000,
    apy: 18.5,
    weeklyChange: 1.2,
    investors: 512,
    createdAt: Date.now() - 450000000
  },
  {
    id: '9',
    name: 'Arbitrum Native Index',
    manager: '0x9c...d4e5',
    asset: 'ETH',
    tvl: 1500000,
    apy: 28.9,
    weeklyChange: 6.7,
    investors: 380,
    createdAt: Date.now() - 120000000
  },
  {
    id: '10',
    name: 'Liquidity Provisioning',
    manager: '0xf2...a1b3',
    asset: 'ETH',
    tvl: 890000,
    apy: 34.2,
    weeklyChange: -1.5,
    investors: 220,
    createdAt: Date.now() - 80000000
  },
  {
    id: '11',
    name: 'Wrapped Bitcoin Yield',
    manager: '0xe1...f2a4',
    asset: 'WBTC',
    tvl: 2100000,
    apy: 11.5,
    weeklyChange: 2.1,
    investors: 410,
    createdAt: Date.now() - 550000000
  },
  {
    id: '12',
    name: 'Real World Assets',
    manager: '0xb4...c5d6',
    asset: 'USDC',
    tvl: 6500000,
    apy: 7.8,
    weeklyChange: 0.2,
    investors: 950,
    createdAt: Date.now() - 700000000
  },
  {
    id: '13',
    name: 'Leveraged ETH Loop',
    manager: '0x6d...e7f8',
    asset: 'ETH',
    tvl: 600000,
    apy: 85.4,
    weeklyChange: 18.2,
    investors: 150,
    createdAt: Date.now() - 90000000
  },
  {
    id: '14',
    name: 'Swing Trading Bot',
    manager: '0xa2...b3c4',
    asset: 'USDC',
    tvl: 420000,
    apy: 55.1,
    weeklyChange: -5.6,
    investors: 180,
    createdAt: Date.now() - 110000000
  },
  {
    id: '15',
    name: 'Macro Hedge',
    manager: '0x88...11aa',
    asset: 'WBTC',
    tvl: 3500000,
    apy: 14.2,
    weeklyChange: 3.5,
    investors: 620,
    createdAt: Date.now() - 400000000
  }
];