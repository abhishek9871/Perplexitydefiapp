import React, { useState } from 'react';
import { INITIAL_TRADES } from '../constants';
import { Trade } from '../types';

type SortKey = 'time' | 'type' | 'price' | 'amount' | 'total';
type SortDirection = 'asc' | 'desc';

const RecentTrades: React.FC = () => {
  const [trades, setTrades] = useState(INITIAL_TRADES);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'time',
    direction: 'desc',
  });

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });

    const sortedTrades = [...trades].sort((a, b) => {
      let aValue: any = a[key];
      let bValue: any = b[key];

      // Specialized string sorts if needed, but for these simple values logical sort works
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setTrades(sortedTrades);
  };

  const SortIcon = ({ active, direction }: { active: boolean; direction: SortDirection }) => {
    if (!active) return <span className="material-symbols-outlined text-[16px] opacity-20 align-middle">unfold_more</span>;
    return <span className="material-symbols-outlined text-[16px] align-middle">{direction === 'asc' ? 'expand_less' : 'expand_more'}</span>;
  };

  return (
    <div className="mt-6 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark p-4 md:p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Recent Trades</h2>
        <button className="text-xs text-primary hover:text-primary-hover font-medium">View All</button>
      </div>
      
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <table className="w-full min-w-[600px] text-sm text-left border-collapse">
          <thead className="text-xs text-text-light-secondary dark:text-text-dark-secondary uppercase select-none">
            <tr className="border-b border-border-light dark:border-border-dark">
              <th 
                scope="col" 
                className="py-3 px-4 font-medium cursor-pointer hover:text-text-light-primary dark:hover:text-text-dark-primary transition-colors"
                onClick={() => handleSort('time')}
              >
                <div className="flex items-center gap-1">Time <SortIcon active={sortConfig.key === 'time'} direction={sortConfig.direction} /></div>
              </th>
              <th 
                scope="col" 
                className="py-3 px-4 font-medium cursor-pointer hover:text-text-light-primary dark:hover:text-text-dark-primary transition-colors"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center gap-1">Type <SortIcon active={sortConfig.key === 'type'} direction={sortConfig.direction} /></div>
              </th>
              <th 
                scope="col" 
                className="py-3 px-4 font-medium text-right cursor-pointer hover:text-text-light-primary dark:hover:text-text-dark-primary transition-colors"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center justify-end gap-1">Price (USDT) <SortIcon active={sortConfig.key === 'price'} direction={sortConfig.direction} /></div>
              </th>
              <th 
                scope="col" 
                className="py-3 px-4 font-medium text-right cursor-pointer hover:text-text-light-primary dark:hover:text-text-dark-primary transition-colors"
                onClick={() => handleSort('amount')}
              >
                 <div className="flex items-center justify-end gap-1">Amount (BTC) <SortIcon active={sortConfig.key === 'amount'} direction={sortConfig.direction} /></div>
              </th>
              <th 
                scope="col" 
                className="py-3 px-4 font-medium text-right cursor-pointer hover:text-text-light-primary dark:hover:text-text-dark-primary transition-colors"
                onClick={() => handleSort('total')}
              >
                 <div className="flex items-center justify-end gap-1">Total (USDT) <SortIcon active={sortConfig.key === 'total'} direction={sortConfig.direction} /></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                <td className="py-3 px-4 text-text-light-secondary dark:text-text-dark-secondary font-mono text-xs">{trade.time}</td>
                <td className={`py-3 px-4 font-bold text-xs ${trade.type === 'BUY' ? 'text-success' : 'text-error'}`}>
                  {trade.type}
                </td>
                <td className="py-3 px-4 text-right font-mono text-text-light-primary dark:text-text-dark-primary group-hover:text-primary transition-colors">
                  {trade.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right font-mono text-text-light-primary dark:text-text-dark-primary">
                  {trade.amount.toFixed(4)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-text-light-secondary dark:text-text-dark-secondary">
                  {trade.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTrades;