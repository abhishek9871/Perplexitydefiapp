import React, { useState } from 'react';
import ChartWidget from './components/ChartWidget';
import SwapPanel from './components/SwapPanel';
import TrailingStopPanel from './components/TrailingStopPanel';
import RecentTrades from './components/RecentTrades';
import { TOKENS } from './constants';

const App: React.FC = () => {
  // Using BTC mock data for main view
  const btcToken = TOKENS.find(t => t.symbol === 'BTC');
  const currentPrice = btcToken ? btcToken.price : 68420.69;
  
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleConnect = () => {
    // Mock connection
    setIsWalletConnected(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Top Navigation Stub */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
           <span className="text-xl font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary">Hyper-DEX</span>
        </div>
        <div className="flex items-center gap-4">
           <button className="hidden md:block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary hover:text-primary">Portfolio</button>
           <button 
             onClick={handleConnect}
             className={`${isWalletConnected ? 'bg-primary/10 text-primary border-primary/20' : 'bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark text-text-light-primary dark:text-text-dark-primary hover:border-primary'} border px-4 py-2 rounded-lg text-sm font-semibold transition-colors`}
           >
             {isWalletConnected ? '0x12...8f4A' : 'Connect Wallet'}
           </button>
        </div>
      </header>

      {/* Main Grid */}
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
  );
};

export default App;