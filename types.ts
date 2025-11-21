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
