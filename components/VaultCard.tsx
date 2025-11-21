import React from 'react';
import { Vault } from '../types';

interface VaultCardProps {
  vault: Vault;
  onViewDetails: (vault: Vault) => void;
}

export const VaultCard: React.FC<VaultCardProps> = ({ vault, onViewDetails }) => {
  const formatTVL = (tvl: number) => {
    if (tvl >= 1000000) return `$${(tvl / 1000000).toFixed(1)}M`;
    if (tvl >= 1000) return `$${(tvl / 1000).toFixed(0)}K`;
    return `$${tvl}`;
  };

  const isPositive = vault.weeklyChange >= 0;

  return (
    <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6 flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => onViewDetails(vault)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold font-display text-text-light dark:text-text-dark truncate max-w-[180px]">{vault.name}</h3>
          <p className="text-xs text-text-light/70 dark:text-text-dark/70">{vault.manager}</p>
        </div>
        <div className="bg-primary/10 text-primary text-xs font-bold py-1 px-3 rounded-full whitespace-nowrap">
          {formatTVL(vault.tvl)} TVL
        </div>
      </div>
      
      <div className="my-4">
        <p className="text-4xl font-bold font-display text-text-light dark:text-text-dark">
          {vault.apy.toFixed(1)}% <span className="text-base font-normal text-text-light/70 dark:text-text-dark/70">APY</span>
        </p>
      </div>
      
      <div className="flex items-center justify-between text-sm mb-6">
        <p className="text-text-light/70 dark:text-text-dark/70">7d Perf.</p>
        <p className={`font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{vault.weeklyChange.toFixed(1)}%
        </p>
      </div>
      
      <div className="border-t border-border-light dark:border-border-dark pt-4 mt-auto flex items-center justify-between">
        <div className="flex items-center text-sm text-text-light/70 dark:text-text-dark/70">
          <span className="material-icons-outlined text-base mr-1.5">group</span>
          <span>{vault.investors.toLocaleString()} Investors</span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(vault);
          }}
          className="text-sm font-semibold py-2 px-4 rounded-lg border border-border-light dark:border-border-dark hover:bg-black/5 dark:hover:bg-white/5 text-text-light dark:text-text-dark transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};