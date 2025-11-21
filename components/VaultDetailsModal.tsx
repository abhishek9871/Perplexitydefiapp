import React from 'react';
import { Vault } from '../types';
import ChartWidget from './ChartWidget';

interface VaultDetailsModalProps {
  vault: Vault | null;
  onClose: () => void;
}

export const VaultDetailsModal: React.FC<VaultDetailsModalProps> = ({ vault, onClose }) => {
  if (!vault) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-start">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xl">
               {vault.name.substring(0, 1)}
             </div>
             <div>
               <h2 className="text-2xl font-bold font-display text-text-light dark:text-text-dark">{vault.name}</h2>
               <p className="text-text-light/70 dark:text-text-dark/70">Managed by {vault.manager}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-text-light/70 dark:text-text-dark/70">
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
              <p className="text-sm text-text-light/70 dark:text-text-dark/70">Total Value Locked</p>
              <p className="text-2xl font-bold text-text-light dark:text-text-dark">${vault.tvl.toLocaleString()}</p>
            </div>
            <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
              <p className="text-sm text-text-light/70 dark:text-text-dark/70">Current APY</p>
              <p className="text-2xl font-bold text-primary">{vault.apy.toFixed(2)}%</p>
            </div>
            <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
              <p className="text-sm text-text-light/70 dark:text-text-dark/70">Active Investors</p>
              <p className="text-2xl font-bold text-text-light dark:text-text-dark">{vault.investors}</p>
            </div>
          </div>

          <div className="mb-8 h-[300px] md:h-[400px] border border-border-light dark:border-border-dark rounded-lg overflow-hidden">
             {/* Reusing existing ChartWidget logic with hardcoded mock params for visual demo */}
             <ChartWidget symbol={vault.asset} price={vault.tvl / 1000} changePercent={vault.weeklyChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
               <h3 className="text-lg font-bold mb-2 text-text-light dark:text-text-dark">Strategy Description</h3>
               <p className="text-text-light/70 dark:text-text-dark/70 leading-relaxed">
                 {vault.description || "This vault employs a diversified strategy across multiple DeFi protocols to generate sustainable yield while minimizing downside risk. The strategy automatically rebalances based on market conditions and volatility indices."}
               </p>
             </div>
             <div>
               <h3 className="text-lg font-bold mb-2 text-text-light dark:text-text-dark">Vault Details</h3>
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-text-light/70 dark:text-text-dark/70">Asset</span>
                   <span className="font-bold text-text-light dark:text-text-dark">{vault.asset}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-text-light/70 dark:text-text-dark/70">Lock-up Period</span>
                   <span className="font-bold text-text-light dark:text-text-dark">None</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-text-light/70 dark:text-text-dark/70">Management Fee</span>
                   <span className="font-bold text-text-light dark:text-text-dark">2%</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-text-light/70 dark:text-text-dark/70">Performance Fee</span>
                   <span className="font-bold text-text-light dark:text-text-dark">20%</span>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark flex justify-end gap-3">
           <button onClick={onClose} className="px-6 py-3 rounded-lg font-bold text-text-light dark:text-text-dark hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">Cancel</button>
           <button className="px-8 py-3 rounded-lg font-bold bg-primary text-black hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">Deposit {vault.asset}</button>
        </div>
      </div>
    </div>
  );
};