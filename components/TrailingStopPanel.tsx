import React, { useState } from 'react';

interface TrailingStopPanelProps {
  currentPrice: number;
  isWalletConnected: boolean;
  onConnect: () => void;
}

const TrailingStopPanel: React.FC<TrailingStopPanelProps> = ({ currentPrice, isWalletConnected, onConnect }) => {
  const [trailPercent, setTrailPercent] = useState<number>(5.0);
  const [orderState, setOrderState] = useState<'idle' | 'creating' | 'success'>('idle');

  const stopPrice = currentPrice * (1 - trailPercent / 100);

  const handleCreateOrder = () => {
    if (!isWalletConnected) {
      onConnect();
      return;
    }

    setOrderState('creating');

    // Simulate network/contract interaction
    setTimeout(() => {
      setOrderState('success');
      
      // Reset state after 3 seconds
      setTimeout(() => {
        setOrderState('idle');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark p-4 md:p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        Trailing Stop-Loss
        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/20 uppercase font-bold tracking-wider">Beta</span>
      </h2>

      <div className="mb-6">
        <div className="flex justify-between items-center text-sm mb-3">
          <label htmlFor="trail-percentage" className="font-medium text-text-light-secondary dark:text-text-dark-secondary">Trail Percentage</label>
          <span className="font-bold text-primary font-mono bg-primary/10 px-2 py-1 rounded">{trailPercent.toFixed(1)}%</span>
        </div>
        
        <div className="relative h-6 flex items-center">
          <input
            id="trail-percentage"
            type="range"
            min="0.5"
            max="50"
            step="0.5"
            value={trailPercent}
            onChange={(e) => setTrailPercent(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex justify-between text-xs text-text-light-secondary dark:text-text-dark-secondary mt-1">
          <span>Tight (0.5%)</span>
          <span>Wide (50%)</span>
        </div>
      </div>

      <div className="flex justify-between text-sm bg-background-light dark:bg-background-dark p-4 rounded-lg mb-6 border border-border-light dark:border-border-dark">
        <div>
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs mb-1">Current Price</p>
          <p className="font-bold font-mono text-text-light-primary dark:text-text-dark-primary">${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="text-right">
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs mb-1">Stop Price</p>
          <p className="font-bold font-mono text-error">${stopPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      <button 
        onClick={handleCreateOrder}
        disabled={orderState === 'creating' || orderState === 'success'}
        className={`w-full py-3 rounded-lg font-bold transition-all duration-200 border-2 flex items-center justify-center gap-2
          ${!isWalletConnected 
            ? 'bg-transparent border-primary text-primary hover:bg-primary hover:text-white' 
            : ''}
          ${isWalletConnected && orderState === 'idle' 
            ? 'bg-card-light dark:bg-card-dark border-primary text-primary hover:bg-primary hover:text-white' 
            : ''}
          ${orderState === 'creating' 
            ? 'bg-primary text-white border-primary opacity-80 cursor-wait' 
            : ''}
          ${orderState === 'success' 
            ? 'bg-success text-white border-success' 
            : ''}
        `}
      >
        {orderState === 'creating' && (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        )}

        {!isWalletConnected && 'Connect Wallet to Trade'}
        
        {isWalletConnected && orderState === 'idle' && 'Create Stop Order'}
        {isWalletConnected && orderState === 'creating' && 'Creating Order...'}
        {isWalletConnected && orderState === 'success' && (
          <>
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Order Created!
          </>
        )}
      </button>
    </div>
  );
};

export default TrailingStopPanel;