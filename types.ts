export interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  decimals: number;
  price: number;
}

export interface Trade {
  id: string;
  time: string;
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  total: number;
}

export interface ChartDataPoint {
  time: string | number; // String for days/months, Number (unix) for intraday usually, but Lightweight charts accepts both
  open: number;
  high: number;
  low: number;
  close: number;
}

export type TimeFrame = '1H' | '4H' | '1D' | '1W' | '1M';

export interface Vault {
  id: string;
  name: string;
  manager: string;
  managerAvatar?: string;
  asset: 'ETH' | 'USDC' | 'WBTC';
  tvl: number;
  apy: number;
  weeklyChange: number;
  investors: number;
  createdAt: number; // timestamp
  description?: string;
  isFeatured?: boolean;
}

export interface Investor {
  id: string;
  name: string;
  avatar: string;
  invested: number;
  pnl: number;
  pnlPercent: number;
}

export interface VaultTransaction {
  id: string;
  timeAgo: string;
  type: 'BUY' | 'SELL';
  pair: string;
  amount: string;
  pnl: number;
}