import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { TOKENS } from '../constants';
import { Token } from '../types';
import { useTokenPrice } from '../src/hooks/useTokenPrice';
import { PROTOCOL_FEES } from '../src/lib/fees';
import { trackSwapEvents } from '../src/lib/analytics';

interface SwapPanelProps {
  isWalletConnected: boolean;
  onConnect: () => void;
}

interface TokenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  tokens: Token[];
  activeToken: Token;
  otherToken: Token;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ isOpen, onClose, onSelect, tokens, activeToken, otherToken }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-20 bg-card-light dark:bg-card-dark rounded-lg p-4 flex flex-col animate-in fade-in zoom-in-95 duration-150">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary">Select Token</h3>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-light-secondary dark:text-text-dark-secondary transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto -mx-2 px-2">
        <div className="flex flex-col gap-2">
          {tokens.map((token) => {
            const isSelected = activeToken.symbol === token.symbol;
            const isDisabled = false; // Allow selecting other token to trigger swap

            return (
              <button
                key={token.symbol}
                onClick={() => onSelect(token)}
                className={`
                  flex items-center justify-between p-3 rounded-lg transition-all
                  ${isSelected 
                    ? 'bg-primary/10 border border-primary/20 cursor-default' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'}
                `}
                disabled={isSelected}
              >
                <div className="flex items-center gap-3">
                  <img src={token.icon} alt={token.symbol} className="w-8 h-8 rounded-full" />
                  <div className="text-left">
                    <div className="font-bold text-text-light-primary dark:text-text-dark-primary">{token.symbol}</div>
                    <div className="text-xs text-text-light-secondary dark:text-text-dark-secondary">{token.name}</div>
                  </div>
                </div>
                <div className="text-right">
                   <div className="font-mono text-sm text-text-light-primary dark:text-text-dark-primary">
                     {token.balance > 0 ? token.balance.toLocaleString() : '0'}
                   </div>
                   {isSelected && <span className="material-symbols-outlined text-primary text-sm">check</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SwapPanel: React.FC<SwapPanelProps> = ({ isWalletConnected, onConnect }) => {
  const { isConnected } = useAccount();
  const { prices, isLoading: pricesLoading } = useTokenPrice();
  
  const [fromToken, setFromToken] = useState<Token>(TOKENS.find(t => t.symbol === 'ETH') || TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(TOKENS.find(t => t.symbol === 'USDC') || TOKENS[1]);
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [swapState, setSwapState] = useState<'idle' | 'swapping' | 'success'>('idle');
  const [showSlippage, setShowSlippage] = useState(false);
  
  // Token selection state
  const [selectingSide, setSelectingSide] = useState<'from' | 'to' | null>(null);
  
  // Use wallet connection from hook
  const connected = isConnected || isWalletConnected;

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setAmount(''); // Reset amount on flip
  };

  const handleTokenSelect = (token: Token) => {
    if (selectingSide === 'from') {
      if (token.symbol === toToken.symbol) {
        // Swap if selecting the token that is already in 'to'
        setToToken(fromToken);
      }
      setFromToken(token);
      trackSwapEvents.tokenSelected(token.symbol, 'from');
    } else if (selectingSide === 'to') {
      if (token.symbol === fromToken.symbol) {
        // Swap if selecting the token that is already in 'from'
        setFromToken(toToken);
      }
      setToToken(token);
      trackSwapEvents.tokenSelected(token.symbol, 'to');
    }
    setSelectingSide(null);
  };

  // Get real-time prices from CoinGecko
  const fromPrice = prices[fromToken.symbol] || fromToken.price;
  const toPrice = prices[toToken.symbol] || toToken.price;
  
  // Calculate values
  const amountNum = parseFloat(amount) || 0;
  const inputUsdValue = amountNum * fromPrice;
  
  // Fee calculations (0.20%)
  const feeAmount = PROTOCOL_FEES.calculateSwapFeeNumber(amountNum);
  const feeUsdValue = feeAmount * fromPrice;
  const netAmount = amountNum - feeAmount;
  const netUsdValue = netAmount * fromPrice;
  
  // Estimated output
  const estimatedOutput = amount && !isNaN(parseFloat(amount))
    ? (netAmount * fromPrice / toPrice).toFixed(toToken.decimals === 6 ? 2 : 4)
    : '0.00';

  const exchangeRate = (fromPrice / toPrice).toLocaleString(undefined, { maximumFractionDigits: 2 });

  const isValidAmount = parseFloat(amount) > 0;
  const hasBalance = connected ? parseFloat(amount) <= fromToken.balance : true;

  const handleSwapAction = () => {
    if (!connected) {
      onConnect();
      return;
    }
    
    // Track preview click
    trackSwapEvents.previewClicked(fromToken.symbol, toToken.symbol, amount);

    setLoading(true);
    setSwapState('swapping');
    
    // Simulate network delay (actual swap will be implemented in Phase 3)
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
  
  // Track amount changes
  const handleAmountChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      if (value && parseFloat(value) > 0) {
        trackSwapEvents.amountEntered(value, fromToken.symbol);
      }
    }
  };

  return (
    <div className="relative bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark p-4 md:p-6 shadow-sm overflow-hidden">
      <h2 className="text-lg font-bold mb-4 text-text-light-primary dark:text-text-dark-primary">Swap</h2>
      
      {/* From Input */}
      <div className="bg-background-light dark:bg-background-dark p-3 rounded-lg mb-2 border border-transparent focus-within:border-primary/50 transition-colors">
        <div className="flex justify-between mb-1">
          <label className="text-xs text-text-light-secondary dark:text-text-dark-secondary font-medium">From</label>
          <span className="text-xs text-text-light-secondary dark:text-text-dark-secondary flex items-center gap-1">
             Balance: <span className="text-text-light-primary dark:text-text-dark-primary font-mono">{connected ? fromToken.balance.toFixed(4) : '-'}</span>
             {connected && (
               <button 
                 onClick={() => setAmount(fromToken.balance.toString())}
                 className="text-primary hover:text-primary-hover font-bold cursor-pointer uppercase text-[10px] bg-primary/10 px-1.5 py-0.5 rounded hover:bg-primary/20 transition-colors"
               >
                 Max
               </button>
             )}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0.0"
            disabled={!connected}
            className="bg-transparent text-2xl font-medium border-0 p-0 focus:ring-0 w-full font-mono text-text-light-primary dark:text-text-dark-primary outline-none placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button 
            onClick={() => setSelectingSide('from')}
            className="flex items-center gap-2 bg-card-light dark:bg-card-dark hover:bg-gray-200 dark:hover:bg-gray-700/50 border border-border-light dark:border-border-dark px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm transition-all shrink-0 text-text-light-primary dark:text-text-dark-primary"
          >
            <img src={fromToken.icon} alt={fromToken.symbol} className="w-5 h-5 rounded-full" />
            {fromToken.symbol}
            <span className="material-symbols-outlined text-base">expand_more</span>
          </button>
        </div>
        {/* USD Value Display */}
        {amount && parseFloat(amount) > 0 && (
          <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">
            ${inputUsdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        )}
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
      <div className="bg-background-light dark:bg-background-dark p-3 rounded-lg mb-3 border border-transparent focus-within:border-primary/50 transition-colors">
        <label className="text-xs text-text-light-secondary dark:text-text-dark-secondary font-medium block mb-1">To (estimated)</label>
        <div className="flex justify-between items-center gap-2">
          <div className="flex-1">
            <p className={`text-2xl font-medium font-mono truncate ${amount ? 'text-text-light-primary dark:text-text-dark-primary' : 'text-gray-500'}`}>
              {pricesLoading ? 'Loading...' : estimatedOutput}
            </p>
            {amount && parseFloat(amount) > 0 && (
              <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">
                ${(parseFloat(estimatedOutput) * toPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            )}
          </div>
          <button 
            onClick={() => setSelectingSide('to')}
            className="flex items-center gap-2 bg-card-light dark:bg-card-dark hover:bg-gray-200 dark:hover:bg-gray-700/50 border border-border-light dark:border-border-dark px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm transition-all shrink-0 text-text-light-primary dark:text-text-dark-primary"
          >
            <img src={toToken.icon} alt={toToken.symbol} className="w-5 h-5 rounded-full" />
            {toToken.symbol}
            <span className="material-symbols-outlined text-base">expand_more</span>
          </button>
        </div>
      </div>

      {/* Fee Breakdown */}
      {amount && parseFloat(amount) > 0 && (
        <div className="bg-background-light dark:bg-background-dark p-3 rounded-lg mb-3 border border-border-light dark:border-border-dark">
          <div className="text-xs space-y-1.5">
            <div className="flex justify-between text-text-light-secondary dark:text-text-dark-secondary">
              <span>Input Amount:</span>
              <span className="font-mono">{amountNum.toFixed(4)} {fromToken.symbol} (${inputUsdValue.toFixed(2)})</span>
            </div>
            <div className="flex justify-between text-warning">
              <span>Protocol Fee (0.20%):</span>
              <span className="font-mono">{feeAmount.toFixed(6)} {fromToken.symbol} (${feeUsdValue.toFixed(2)})</span>
            </div>
            <div className="flex justify-between text-text-light-primary dark:text-text-dark-primary font-medium pt-1.5 border-t border-border-light dark:border-border-dark">
              <span>Net Amount:</span>
              <span className="font-mono">{netAmount.toFixed(4)} {fromToken.symbol} (${netUsdValue.toFixed(2)})</span>
            </div>
            <div className="flex justify-between text-success font-medium pt-1.5 border-t border-border-light dark:border-border-dark">
              <span>You Receive (est.):</span>
              <span className="font-mono">{estimatedOutput} {toToken.symbol}</span>
            </div>
          </div>
        </div>
      )}

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
           <div className="mt-2 p-3 bg-background-light dark:bg-background-dark rounded border border-border-light dark:border-border-dark animate-in slide-in-from-top-2 fade-in duration-200">
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
        disabled={connected && (!amount || !isValidAmount || !hasBalance || loading || swapState === 'success')}
        className={`w-full py-3.5 rounded-lg font-bold text-white transition-all duration-200 flex items-center justify-center gap-2
          ${!connected ? 'bg-primary hover:bg-teal-500' : ''}
          ${connected && swapState === 'success' ? 'bg-success hover:bg-success' : ''}
          ${connected && (!amount || !isValidAmount) && swapState !== 'success' ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : ''}
          ${connected && hasBalance && isValidAmount && swapState === 'idle' ? 'bg-primary hover:bg-teal-500 shadow-lg shadow-teal-500/20' : ''}
          ${connected && !hasBalance && amount ? 'bg-error/10 text-error border border-error/50' : ''}
        `}
      >
        {swapState === 'swapping' && (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        )}
        
        {!connected && 'Connect Wallet'}
        
        {connected && swapState === 'idle' && !amount && 'Enter Amount'}
        {connected && swapState === 'idle' && amount && !hasBalance && 'Insufficient Balance'}
        {connected && swapState === 'idle' && amount && hasBalance && 'Preview Swap'}
        
        {swapState === 'swapping' && 'Swapping...'}
        
        {swapState === 'success' && (
          <>
            <span className="material-symbols-outlined">check_circle</span>
            Swapped!
          </>
        )}
      </button>
      
      {/* Price Loading Indicator */}
      {pricesLoading && (
        <div className="text-xs text-center text-text-light-secondary dark:text-text-dark-secondary mt-2">
          Loading prices...
        </div>
      )}

      {/* Token Selector Modal */}
      <TokenSelector 
        isOpen={!!selectingSide}
        onClose={() => setSelectingSide(null)}
        onSelect={handleTokenSelect}
        tokens={TOKENS}
        activeToken={selectingSide === 'from' ? fromToken : toToken}
        otherToken={selectingSide === 'from' ? toToken : fromToken}
      />
    </div>
  );
};

export default SwapPanel;