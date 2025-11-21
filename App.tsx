import React from 'react';
import ChartWidget from './components/ChartWidget';
import SwapPanel from './components/SwapPanel';
import TrailingStopPanel from './components/TrailingStopPanel';
import RecentTrades from './components/RecentTrades';
import { TOKENS } from './constants';

const App: React.FC = () => {
  // Using BTC mock data for main view
  const btcToken = TOKENS.find(t => t.symbol === 'BTC');
  const currentPrice = btcToken ? btcToken.price : 68420.69;

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Top Navigation Stub - Optional based on typical app needs, but adhering to dashboard focus */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
           <span className="text-xl font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary">Hyper-DEX</span>
        </div>
        <div className="flex items-center gap-4">
           {/* Placeholder for wallet connection */}
           <button className="hidden md:block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary hover:text-primary">Portfolio</button>
           <button className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-primary text-text-light-primary dark:text-text-dark-primary px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
             Connect Wallet
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
          {/* Mobile-only placement for trades if we wanted to change order, but sticking to desktop flow for now */}
        </div>

        {/* Right Column: Interaction Panels */}
        <div className="lg:w-[30%] flex flex-col gap-6">
          <SwapPanel />
          <TrailingStopPanel currentPrice={currentPrice} />
        </div>
      </div>

      {/* Bottom Section: Trades */}
      <RecentTrades />
    </div>
  );
};

export default App;
