import React, { useState } from 'react';
import ChartWidget from './components/ChartWidget';
import SwapPanel from './components/SwapPanel';
import TrailingStopPanel from './components/TrailingStopPanel';
import RecentTrades from './components/RecentTrades';
import { VaultsPage } from './components/VaultsPage';
import { TOKENS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'trade' | 'vaults'>('vaults');
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const btcToken = TOKENS.find(t => t.symbol === 'BTC');
  const currentPrice = btcToken ? btcToken.price : 68420.69;

  const handleConnect = () => {
    setIsWalletConnected(true);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200 pb-20 md:pb-0">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-30 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">H</div>
                <span className="text-xl font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary font-display">Hyper-DEX</span>
             </div>
             
             {/* Desktop Nav Links */}
             <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-black/20 p-1 rounded-lg">
               <button 
                 onClick={() => setView('trade')}
                 className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${view === 'trade' ? 'bg-card-light dark:bg-card-dark shadow-sm text-text-light-primary dark:text-text-dark-primary' : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary'}`}
               >
                 Trade
               </button>
               <button 
                 onClick={() => setView('vaults')}
                 className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${view === 'vaults' ? 'bg-card-light dark:bg-card-dark shadow-sm text-text-light-primary dark:text-text-dark-primary' : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary'}`}
               >
                 Vaults
               </button>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={handleConnect}
               className={`${isWalletConnected ? 'bg-primary/10 text-primary border-primary/20' : 'bg-primary text-black hover:opacity-90'} border border-transparent px-4 py-2 rounded-lg text-sm font-bold transition-all`}
             >
               {isWalletConnected ? '0x12...8f4A' : 'Connect Wallet'}
             </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1600px] mx-auto">
        {view === 'vaults' ? (
          <VaultsPage />
        ) : (
          <div className="p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column: Chart & Market Data */}
              <div className="lg:w-[70%] flex flex-col gap-6">
                <ChartWidget 
                  symbol="BTC/USDT" 
                  price={currentPrice} 
                  changePercent={2.58} 
                />
              </div>

              {/* Right Column: Interaction Panels */}
              <div className="lg:w-[30%] flex flex-col gap-6">
                <SwapPanel 
                  isWalletConnected={isWalletConnected} 
                  onConnect={handleConnect} 
                />
                <TrailingStopPanel 
                  currentPrice={currentPrice} 
                  isWalletConnected={isWalletConnected}
                  onConnect={handleConnect}
                />
              </div>
            </div>

            {/* Bottom Section: Trades */}
            <RecentTrades />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card-light dark:bg-card-dark border-t border-border-light dark:border-border-dark z-40 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => setView('vaults')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors active:scale-95 ${
              view === 'vaults' 
                ? 'text-primary' 
                : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${view === 'vaults' ? 'filled' : ''}`}>savings</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Vaults</span>
          </button>
           <button 
            onClick={() => setView('trade')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors active:scale-95 ${
              view === 'trade' 
                ? 'text-primary' 
                : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${view === 'trade' ? 'filled' : ''}`}>candlestick_chart</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Trade</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;