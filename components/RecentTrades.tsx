import React, { useState } from 'react';
import { INITIAL_TRADES } from '../constants';

const RecentTrades: React.FC = () => {
  const [trades] = useState(INITIAL_TRADES);

  return (
    <div className="mt-6 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark p-4 md:p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Recent Trades</h2>
        <button className="text-xs text-primary hover:text-primary-hover font-medium">View All</button>
      </div>
      
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <table className="w-full min-w-[600px] text-sm text-left border-collapse">
          <thead className="text-xs text-text-light-secondary dark:text-text-dark-secondary uppercase">
            <tr className="border-b border-border-light dark:border-border-dark">
              <th scope="col" className="py-3 px-4 font-medium">Time</th>
              <th scope="col" className="py-3 px-4 font-medium">Type</th>
              <th scope="col" className="py-3 px-4 font-medium text-right">Price (USDT)</th>
              <th scope="col" className="py-3 px-4 font-medium text-right">Amount (BTC)</th>
              <th scope="col" className="py-3 px-4 font-medium text-right">Total (USDT)</th>
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
