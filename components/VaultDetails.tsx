import React, { useEffect, useRef, useState } from 'react';
import { Vault, VaultTransaction, Investor } from '../types';
import { MOCK_INVESTORS, MOCK_VAULT_TRANSACTIONS, generateMockCandles } from '../constants';
import { createChart, ColorType, AreaSeries } from 'lightweight-charts';

interface VaultDetailsProps {
  vault: Vault;
  onBack: () => void;
}

export const VaultDetails: React.FC<VaultDetailsProps> = ({ vault, onBack }) => {
  const [timeFrame, setTimeFrame] = useState<'1D' | '7D' | '30D' | 'All'>('30D');
  const [activeTab, setActiveTab] = useState<'Deposit' | 'Withdraw'>('Deposit');
  const [amount, setAmount] = useState('');
  const [transactionState, setTransactionState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');

  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Mock data for specific vault, or fallbacks
  const investors = MOCK_INVESTORS;
  const transactions = MOCK_VAULT_TRANSACTIONS;
  const vaultValue = 115.34;
  const userPosition = 5000;
  const userBalance = 1200;

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94A3B8',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 320,
      timeScale: {
        timeVisible: true,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#14B8A6',
      topColor: 'rgba(20, 184, 166, 0.5)',
      bottomColor: 'rgba(20, 184, 166, 0.0)',
      lineWidth: 2,
    });

    const data = generateMockCandles(100, vaultValue).map(c => ({
      time: c.time,
      value: c.close
    }));
    
    areaSeries.setData(data);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [timeFrame]);

  const handleTransaction = () => {
    if (!amount) return;
    setTransactionState('loading');
    setTimeout(() => {
      setTransactionState('success');
      setTimeout(() => {
        setTransactionState('idle');
        setAmount('');
      }, 2000);
    }, 1500);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Hyper-DEX | ${vault.name}`,
      text: `Check out the ${vault.name} vault on Hyper-DEX.`,
      url: window.location.href
    };

    // Try using the native Web Share API first (common on mobile)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Ignore AbortError (user cancelled)
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // Fallback to clipboard copy
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareState('copied');
        setTimeout(() => setShareState('idle'), 2000);
      } catch (err) {
        console.error('Clipboard failed:', err);
      }
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      
      {/* Breadcrumb / Back */}
      <button onClick={onBack} className="flex items-center text-text-secondary hover:text-text-primary mb-6 transition-colors">
        <span className="material-symbols-outlined mr-1">arrow_back</span>
        Back to Vaults
      </button>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content */}
        <main className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-display">{vault.name}</h1>
              <div className="flex items-center gap-1.5 bg-card py-1 px-3 rounded-full border border-border text-xs text-text-secondary">
                <span className="material-symbols-outlined text-primary !text-base">verified</span>
                <span>Manager</span>
              </div>
              <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-positive/10 text-positive text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-positive"></div>
                Active
              </div>
            </div>
            <button 
              onClick={handleShare}
              className="flex items-center justify-center gap-2 self-start sm:self-center px-4 py-2 bg-card border border-border rounded-lg font-medium text-text-primary hover:bg-white/5 transition-colors min-w-[100px]"
            >
              <span className="material-symbols-outlined !text-xl">
                {shareState === 'copied' ? 'check' : 'ios_share'}
              </span>
              <span>{shareState === 'copied' ? 'Copied' : 'Share'}</span>
            </button>
          </header>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-sm text-text-secondary">TVL</p>
              <p className="text-2xl font-semibold mt-1 text-text-primary">${vault.tvl.toLocaleString()}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-sm text-text-secondary">7D Performance</p>
              <p className={`text-2xl font-semibold mt-1 ${vault.weeklyChange >= 0 ? 'text-positive' : 'text-negative'}`}>
                {vault.weeklyChange >= 0 ? '+' : ''}{vault.weeklyChange}%
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-sm text-text-secondary">APY</p>
              <p className="text-2xl font-semibold mt-1 text-text-primary">{vault.apy}%</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-sm text-text-secondary">Your Position</p>
              <p className="text-2xl font-semibold mt-1 text-text-primary">${userPosition.toLocaleString()}</p>
            </div>
          </div>

          {/* Chart & Deposit Section */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Chart */}
            <div className="xl:col-span-3 bg-card p-4 sm:p-6 rounded-lg border border-border flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-text-secondary">Vault Value</p>
                  <p className="text-3xl font-bold text-text-primary mt-1">${vaultValue}</p>
                  <p className="text-sm text-positive font-medium">+1.25% (24H)</p>
                </div>
                <div className="flex items-center bg-background border border-border rounded-lg text-sm self-start">
                  {(['1D', '7D', '30D', 'All'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeFrame(tf)}
                      className={`px-3 py-1.5 transition-colors ${
                        timeFrame === tf 
                        ? 'bg-white/10 text-text-primary font-semibold' 
                        : 'text-text-secondary hover:text-text-primary'
                      } ${tf !== 'All' ? 'border-r border-border' : ''}`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 relative min-h-[250px]" ref={chartContainerRef}></div>
            </div>

            {/* Action Panel */}
            <div className="xl:col-span-2 bg-card p-4 sm:p-6 rounded-lg border border-border flex flex-col">
              <div>
                <div className="flex border-b border-border">
                  <button 
                    onClick={() => setActiveTab('Deposit')}
                    className={`flex-1 pb-3 border-b-2 font-semibold transition-colors ${
                      activeTab === 'Deposit' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Deposit
                  </button>
                  <button 
                    onClick={() => setActiveTab('Withdraw')}
                    className={`flex-1 pb-3 border-b-2 font-semibold transition-colors ${
                      activeTab === 'Withdraw' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Withdraw
                  </button>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-text-secondary" htmlFor="amount">Amount</label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <input 
                      className="block w-full rounded-lg border border-border bg-background focus:ring-1 focus:ring-primary focus:border-primary text-lg text-text-primary placeholder:text-text-secondary/50 py-3 pl-4 pr-20 outline-none transition-all" 
                      id="amount" 
                      placeholder="0.00" 
                      type="text"
                      value={amount}
                      onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setAmount(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                      <span className="text-text-secondary sm:text-sm font-medium">{activeTab === 'Deposit' ? 'USDC' : 'AW-TOKENS'}</span>
                      <button 
                        onClick={() => setAmount(activeTab === 'Deposit' ? userBalance.toString() : (userPosition / vaultValue).toFixed(2))}
                        className="text-primary text-xs font-bold hover:text-primary-hover"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                  <div className="text-right text-xs mt-1 text-text-secondary">
                    {activeTab === 'Deposit' ? `Balance: ${userBalance.toLocaleString()} USDC` : `Available: ${(userPosition / vaultValue).toFixed(2)} AW-TOKENS`}
                  </div>
                </div>
                <div className="mt-4 space-y-3 text-sm border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Share Price</span>
                    <span className="font-medium text-text-primary">${vaultValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">{activeTab === 'Deposit' ? 'You will receive' : 'You will receive'}</span>
                    <span className="font-medium text-text-primary">
                      {activeTab === 'Deposit' 
                        ? `${amount ? (parseFloat(amount) / vaultValue).toFixed(2) : '0.00'} AW-TOKENS`
                        : `${amount ? (parseFloat(amount) * vaultValue).toFixed(2) : '0.00'} USDC`
                      }
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleTransaction}
                disabled={!amount || parseFloat(amount) === 0 || transactionState !== 'idle'}
                className={`mt-6 w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2
                  ${transactionState === 'success' ? 'bg-positive text-white' : 'bg-primary text-white hover:bg-primary-hover'}
                  ${(!amount || parseFloat(amount) === 0) && transactionState === 'idle' ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {transactionState === 'loading' && (
                   <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                )}
                {transactionState === 'idle' ? activeTab : ''}
                {transactionState === 'loading' ? (activeTab === 'Deposit' ? 'Depositing...' : 'Withdrawing...') : ''}
                {transactionState === 'success' ? 'Success!' : ''}
              </button>
            </div>
          </div>

          {/* Trading Activity */}
          <div className="bg-card p-4 sm:p-6 rounded-lg border border-border">
            <h2 className="text-xl font-bold text-text-primary mb-4 font-display">Trading Activity</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">PnL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{tx.timeAgo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        <span className={`font-medium ${tx.type === 'BUY' ? 'text-positive' : 'text-negative'}`}>{tx.type}</span> {tx.pair}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{tx.amount}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${tx.pnl >= 0 ? 'text-positive' : 'text-negative'}`}>
                        {tx.pnl >= 0 ? '+' : ''}${Math.abs(tx.pnl).toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Manager Info */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center gap-4">
              <img 
                alt="Manager profile" 
                className="h-16 w-16 rounded-full object-cover" 
                src={vault.managerAvatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAqR-rn1QfWMGExbIBE0JSNgJXSX1KA98Ufgkkie5Xca9o_emVEj4fw8x7Mp3U0UsvbfcufCt939mBhxtRIw0mUWHhY8oLA6rw_gz67EXMXO9r_npL_NneW8ZPNpFnYMZlkbvMCvgMHV3m5XzS7CyvbW7ywgL6ZIcy_9n-Yrfn1mAkiICy3nlt4XZqzMFETnWyU2SYkwvZL10IU2jgzeYmlvSOgX8PjSBfrKQj_2Yg1f99ZRSqVE0uhr38383oltp6wp_gFN868vcM"}
              />
              <div>
                <p className="text-sm text-text-secondary">Manager</p>
                <h3 className="text-lg font-bold text-text-primary font-display">{vault.manager}</h3>
              </div>
            </div>
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
              {vault.description || "Expert in high-frequency trading with a focus on major crypto assets. Strategy involves swing trades based on technical analysis and market sentiment."}
            </p>
          </div>

          {/* Top Investors */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-bold text-text-primary mb-4 font-display">Top Investors</h3>
            <ul className="space-y-4">
              {investors.map((investor) => (
                <li key={investor.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img alt="Investor" className="h-10 w-10 rounded-full" src={investor.avatar} />
                    <div>
                      <p className="font-medium text-sm text-text-primary">{investor.name}</p>
                      <p className="text-xs text-text-secondary">Invested: ${investor.invested.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium text-sm ${investor.pnlPercent >= 0 ? 'text-positive' : 'text-negative'}`}>
                      {investor.pnlPercent >= 0 ? '+' : ''}{investor.pnlPercent}%
                    </p>
                    <p className="text-xs text-text-secondary">Total PnL</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};