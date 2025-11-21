import React, { useState, useEffect } from 'react';
import { TOKENS } from '../constants';
import { Token } from '../types';

const SwapPanel: React.FC = () => {
  const [fromToken, setFromToken] = useState<Token>(TOKENS.find(t => t.symbol === 'ETH') || TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(TOKENS.find(t => t.symbol === 'USDC') || TOKENS[1]);
  const [amount, setAmount] = useState<string>('1.5');
  const [loading, setLoading] = useState(false);
  const [swapState, setSwapState] = useState<'idle' | 'swapping' | 'success'>('idle');
  const [showSlippage, setShowSlippage] = useState(false);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setAmount(''); // Reset amount on flip as values change drastically
  };

  const estimatedOutput = amount && !isNaN(parseFloat(amount))
    ? (parseFloat(amount) * fromToken.price / toToken.price).toFixed(2)
    : '0.00';

  const exchangeRate = (fromToken.price / toToken.price).toLocaleString(undefined, { maximumFractionDigits: 2 });

  const isValidAmount = parseFloat(amount) > 0;
  const hasBalance = parseFloat(amount) <= fromToken.balance;

  const handleSwapAction = () => {
    // TODO: Connect wallet logic here
    // TODO: Contract interaction via Wagmi
    
    setLoading(true);
    setSwapState('swapping');
    
    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      setSwapState('success');
      
      // Reset after success
      setTimeout(() => {
        setSwapState('idle');
        setAmount('');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark p-4 md:p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-4">Swap</h2>
      
      {/* From Input */}
      <div className="bg-background-light dark:bg-background-dark p-3 rounded-lg mb-2 border border-transparent focus-within:border-primary/50 transition-colors">
        <div className="flex justify-between mb-1">
          <label className="text-xs text-text-light-secondary dark:text-text-dark-secondary font-medium">From</label>
          <span className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
             Balance: <span className="text-text-light-primary dark:text-text-dark-primary font-mono">{fromToken.balance}</span>
             <button 
               onClick={() => setAmount(fromToken.balance.toString())}
               className="ml-2 text-primary hover:text-primary-hover font-semibold cursor-pointer uppercase text-[10px]"
             >
               Max
             </button>
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <input
            type="text"
            value={amount}
            onChange={(e) => {
              if (/^\d*\.?\d*$/.test(e.target.value)) {
                setAmount(e.target.value);
              }
            }}
            placeholder="0.0"
            className="bg-transparent text-2xl font-medium border-0 p-0 focus:ring-0 w-full font-mono text-text-light-primary dark:text-text-dark-primary outline-none placeholder-gray-500"
          />
          <button className="flex items-center gap-2 bg-card-light dark:bg-card-dark hover:bg-gray-200 dark:hover:bg-gray-700/50 border border-border-light dark:border-border-dark px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm transition-all shrink-0">
            <img src={fromToken.icon} alt={fromToken.symbol} className="w-5 h-5 rounded-full" />
            {fromToken.symbol}
            <span className="material-symbols-outlined text-base">expand_more</span>
          </button>
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center -my-3 relative z-10">
        <button 
          onClick={handleSwapTokens}
          className="p-2 rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:rotate-180 shadow-sm text-primary"
        >
          <span className="material-symbols-outlined align-middle text-xl">swap_vert</span>
        </button>
      </div>

      {/* To Input */}
      <div className="bg-background-light dark:bg-background-dark p-3 rounded-lg mb-4 border border-transparent focus-within:border-primary/50 transition-colors">
        <label className="text-xs text-text-light-secondary dark:text-text-dark-secondary font-medium block mb-1">To (estimated)</label>
        <div className="flex justify-between items-center gap-2">
          <p className={`text-2xl font-medium font-mono w-full truncate ${amount ? 'text-text-light-primary dark:text-text-dark-primary' : 'text-gray-500'}`}>
            {estimatedOutput}
          </p>
          <button className="flex items-center gap-2 bg-card-light dark:bg-card-dark hover:bg-gray-200 dark:hover:bg-gray-700/50 border border-border-light dark:border-border-dark px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm transition-all shrink-0">
            <img src={toToken.icon} alt={toToken.symbol} className="w-5 h-5 rounded-full" />
            {toToken.symbol}
            <span className="material-symbols-outlined text-base">expand_more</span>
          </button>
        </div>
      </div>

      {/* Info / Accordion */}
      <div className="text-xs text-text-light-secondary dark:text-text-dark-secondary mb-4 select-none">
        <div 
          className="flex justify-between items-center cursor-pointer p-1 hover:text-primary transition-colors"
          onClick={() => setShowSlippage(!showSlippage)}
        >
          <span className="flex items-center gap-1">
             1 {fromToken.symbol} ≈ {exchangeRate} {toToken.symbol}
          </span>
          <span className="flex items-center gap-1">
            Slippage 0.5%
            <span className={`material-symbols-outlined text-base transition-transform ${showSlippage ? 'rotate-180' : ''}`}>expand_more</span>
          </span>
        </div>
        
        {showSlippage && (
           <div className="mt-2 p-3 bg-background-light dark:bg-background-dark rounded border border-border-light dark:border-border-dark">
              <div className="flex justify-between mb-1">
                <span>Network Fee</span>
                <span className="font-mono">~$1.50</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Price Impact</span>
                <span className="text-success font-mono">&lt;0.01%</span>
              </div>
              <div className="flex justify-between">
                <span>Minimum Received</span>
                <span className="font-mono">{(parseFloat(estimatedOutput) * 0.995).toFixed(2)} {toToken.symbol}</span>
              </div>
           </div>
        )}
      </div>

      {/* Action Button */}
      <button 
        onClick={handleSwapAction}
        disabled={!amount || !isValidAmount || !hasBalance || loading || swapState === 'success'}
        className={`w-full py-3.5 rounded-lg font-bold text-white transition-all duration-200 flex items-center justify-center gap-2
          ${swapState === 'success' ? 'bg-success hover:bg-success' : ''}
          ${(!amount || !isValidAmount) && swapState !== 'success' ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : ''}
          ${hasBalance && isValidAmount && swapState === 'idle' ? 'bg-primary hover:bg-teal-500 shadow-lg shadow-teal-500/20' : ''}
          ${!hasBalance && amount ? 'bg-error/10 text-error border border-error/50' : ''}
        `}
      >
        {swapState === 'swapping' && (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        )}
        
        {swapState === 'idle' && !amount && 'Enter Amount'}
        {swapState === 'idle' && amount && !hasBalance && 'Insufficient Balance'}
        {swapState === 'idle' && amount && hasBalance && 'Swap'}
        {swapState === 'swapping' && 'Swapping...'}
        {swapState === 'success' && (
          <>
            <span className="material-symbols-outlined">check_circle</span>
            Swapped!
          </>
        )}
      </button>
    </div>
  );
};

export default SwapPanel;
