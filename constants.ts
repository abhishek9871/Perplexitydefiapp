import { Token, Trade, ChartDataPoint, Vault, Investor, VaultTransaction } from './types';

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
    name: 'Alpha Wave',
    manager: 'CryptoKing',
    managerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqR-rn1QfWMGExbIBE0JSNgJXSX1KA98Ufgkkie5Xca9o_emVEj4fw8x7Mp3U0UsvbfcufCt939mBhxtRIw0mUWHhY8oLA6rw_gz67EXMXO9r_npL_NneW8ZPNpFnYMZlkbvMCvgMHV3m5XzS7CyvbW7ywgL6ZIcy_9n-Yrfn1mAkiICy3nlt4XZqzMFETnWyU2SYkwvZL10IU2jgzeYmlvSOgX8PjSBfrKQj_2Yg1f99ZRSqVE0uhr38383oltp6wp_gFN868vcM',
    asset: 'USDC',
    tvl: 1234567,
    apy: 25.8,
    weeklyChange: 5.42,
    investors: 450,
    createdAt: Date.now() - 100000000,
    isFeatured: true,
    description: "Expert in high-frequency trading with a focus on major crypto assets. Strategy involves swing trades based on technical analysis and market sentiment."
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

export const MOCK_INVESTORS: Investor[] = [
  {
    id: '1',
    name: 'VaultMaster',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqOGJOdbC_fGrPKvV7zVIARXFkJTRaERuKGsVXsX104-YkyRGTGzYxSN62TPwvBtzq1IzLMQrFcHRmTqowSTYThyXm1vJrZzq_2Qs2HbiHbIVUEeAxrEClXUWjYRmLQs0O6WVLe8Va-6jBgP8cQhZKISs1V9dhmb-ybAAwWOgTntrkSX-QBw_hwBnNmkxKa34VMUaNSrUcaSAkZgahedqYzvLSd4DFA8-1WmCW_iKLoKcQE9nxZ-bSSCLHJGiVhywMGRVy4iCpI_8',
    invested: 50000,
    pnl: 6250,
    pnlPercent: 12.5
  },
  {
    id: '2',
    name: 'DiamondHands',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBRgbYb3asbtLAMpqnjpKyw7yt2x3xZ84fkrnQIdL66sb7bl1mtISnRu-iZbGCO7vflH1D6ebOnSRFG3UaDAKy_4rLKSuFU7nm4uyGOyWXOQ6Plw-ET9seF0taMEDBtc1KydeRBZgEOlNlJoUv08lF-fpNIEoovTdSR-bi5EnaXbXs3-jx604nWlVUguOCnqOTH-yGXXYpB7cOc_2R10ER-fqD6pbCXBtJN3OmzvI8qCVpvNo7mH9c_4_gClOd3ukytksdzKT08PA',
    invested: 25000,
    pnl: 2050,
    pnlPercent: 8.2
  },
  {
    id: '3',
    name: 'CryptoWhale',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByW74BK-L_toKI8qLaK6j8dJbeovZGElZOTwUrZKsoqmc5jD7lMl6UVjJhMk-BuK8WD8H-K_pm3PyUr36uUzCfyEDRdiycqxXDlm4HpkKUJk__G7lQhTQP8i3ZiZ7cb3efSIlYkmpbYEj_xk6N2jUDoS-3_x4koFjvmWT9tcXCegZYExKt0h26qCeJNPWhEnnWnatSGfdqE46-SwO2wUvyAnC7zQ6SH9RqW9EXrz-_ZeJHZcxrSf5aVwKnR5Y6-bw2-nIK8zZR0dY',
    invested: 15000,
    pnl: 765,
    pnlPercent: 5.1
  }
];

export const MOCK_VAULT_TRANSACTIONS: VaultTransaction[] = [
  {
    id: '1',
    timeAgo: '2 min ago',
    type: 'BUY',
    pair: 'ETH/USDC',
    amount: '10.5 ETH',
    pnl: 1230.50
  },
  {
    id: '2',
    timeAgo: '1 hour ago',
    type: 'SELL',
    pair: 'BTC/USDC',
    amount: '0.5 BTC',
    pnl: 5400.10
  },
  {
    id: '3',
    timeAgo: '5 hours ago',
    type: 'BUY',
    pair: 'SOL/USDC',
    amount: '100 SOL',
    pnl: -250.75
  },
  {
    id: '4',
    timeAgo: '1 day ago',
    type: 'SELL',
    pair: 'ETH/USDC',
    amount: '5.0 ETH',
    pnl: 850.00
  }
];