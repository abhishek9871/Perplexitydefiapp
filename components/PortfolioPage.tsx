
import React, { useEffect, useRef, useState } from 'react';
import { MOCK_PORTFOLIO_ASSETS, MOCK_OPEN_ORDERS, MOCK_ACTIVITIES, generateMockCandles } from '../constants';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';

export const PortfolioPage: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<'7D' | '30D' | '90D' | 'All'>('30D');
  const [activeOrderTab, setActiveOrderTab] = useState<'Limit Orders' | 'Trailing Stops'>('Limit Orders');
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [actionState, setActionState] = useState<'idle' | 'deposit' | 'withdraw'>('idle');
  const [viewingHistory, setViewingHistory] = useState(false);
  const [processingAssetId, setProcessingAssetId] = useState<string | null>(null);
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartApiRef = useRef<IChartApi | null>(null);

  // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94A3B8',
        fontFamily: "'Manrope', sans-serif",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      width: chartContainerRef.current.clientWidth,
      height: 256, // h-64
      timeScale: {
        timeVisible: true,
        borderColor: 'transparent',
        visible: false,
      },
      rightPriceScale: {
        visible: false,
        borderColor: 'transparent',
      },
      handleScroll: false,
      handleScale: false,
    });

    const areaSeries = chart.addAreaSeries({
      lineColor: '#14B8A6',
      topColor: 'rgba(20, 184, 166, 0.3)',
      bottomColor: 'rgba(20, 184, 166, 0.0)',
      lineWidth: 2,
      crosshairMarkerVisible: true,
    });

    // Generate dynamic data based on timeframe (mock)
    const count = timeFrame === '7D' ? 24 * 7 : timeFrame === '30D' ? 24 * 30 : timeFrame === '90D' ? 24 * 90 : 24 * 365;
    const data = generateMockCandles(100, 12000).map(c => ({
      time: c.time,
      value: c.close
    }));
    
    areaSeries.setData(data as any);
    chart.timeScale().fitContent();

    chartApiRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chartApiRef.current) {
        chartApiRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [timeFrame]);

  const handleCancelOrder = (id: string) => {
    setCancellingOrder(id);
    setTimeout(() => {
      setCancellingOrder(null);
      // In a real app, we'd filter the order out here
    }, 1500);
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => setExporting(false), 2000);
  };

  const handleAction = (type: 'deposit' | 'withdraw') => {
    setActionState(type);
    setTimeout(() => {
      setActionState('idle');
    }, 2000);
  };

  const handleViewHistory = () => {
    setViewingHistory(true);
    // Simulate loading more history
    setTimeout(() => {
      setViewingHistory(false);
    }, 1500);
  };

  const handleAssetAction = (id: string) => {
    setProcessingAssetId(id);
    setTimeout(() => {
      setProcessingAssetId(null);
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-in fade-in duration-300 font-manrope">
      
      {/* Hero Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:items-center mb-6">
          <div className="bg-card-dark p-6 rounded-xl border border-border-dark w-full">
            <p className="text-sm text-text-secondary mb-2">Total Portfolio Value</p>
            <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4">
              <p className="text-4xl lg:text-5xl font-extrabold text-text-dark">$12,345.67</p>
              <div className="flex items-center gap-1.5 text-success font-semibold mt-2 sm:mt-0 sm:mb-2">
                <span className="material-icons-outlined text-lg">arrow_upward</span>
                <span>+$234.56 (+1.9%)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <button 
              onClick={() => handleAction('deposit')}
              disabled={actionState !== 'idle'}
              className="flex-1 md:flex-none bg-white/5 hover:bg-white/10 active:bg-white/20 border border-border-dark text-text-dark px-6 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {actionState === 'deposit' ? (
                 <>
                   <span className="w-4 h-4 border-2 border-text-dark/30 border-t-text-dark rounded-full animate-spin"></span>
                   Processing...
                 </>
              ) : 'Deposit'}
            </button>
            <button 
              onClick={() => handleAction('withdraw')}
              disabled={actionState !== 'idle'}
              className="flex-1 md:flex-none bg-white/5 hover:bg-white/10 active:bg-white/20 border border-border-dark text-text-dark px-6 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {actionState === 'withdraw' ? (
                 <>
                   <span className="w-4 h-4 border-2 border-text-dark/30 border-t-text-dark rounded-full animate-spin"></span>
                   Processing...
                 </>
              ) : 'Withdraw'}
            </button>
            <button 
              onClick={handleExport}
              disabled={exporting}
              className="flex-1 md:flex-none bg-primary text-[#0A0E13] px-6 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {exporting ? (
                 <>
                   <span className="w-4 h-4 border-2 border-[#0A0E13]/30 border-t-[#0A0E13] rounded-full animate-spin"></span>
                   Exporting...
                 </>
              ) : 'Export'}
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <main className="lg:col-span-2 space-y-8">
          
          {/* Assets Table */}
          <section className="bg-card-dark p-6 rounded-xl border border-border-dark">
            <h2 className="text-xl font-bold mb-4 text-text-dark">Assets</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-text-secondary uppercase border-b border-border-dark">
                    <th className="py-3 px-2 sm:px-4 font-medium">Asset</th>
                    <th className="py-3 px-2 sm:px-4 font-medium text-right">Balance</th>
                    <th className="py-3 px-2 sm:px-4 font-medium text-right">Value (USD)</th>
                    <th className="py-3 px-4 font-medium text-right hidden sm:table-cell">24h Change</th>
                    <th className="py-3 px-4 font-medium text-center hidden sm:table-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dark">
                  {MOCK_PORTFOLIO_ASSETS.map((asset) => (
                    <tr key={asset.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-2 sm:px-4">
                        <div className="flex items-center gap-3">
                          <img alt={`${asset.name} logo`} className="w-8 h-8 rounded-full shrink-0" src={asset.icon} />
                          <div className="flex flex-col">
                            <span className="font-bold text-text-dark text-sm sm:text-base truncate max-w-[100px] sm:max-w-none">{asset.name}</span>
                            <span className="text-xs sm:text-sm text-text-secondary uppercase">{asset.symbol}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-right align-middle">
                         <span className="font-medium text-text-dark text-sm sm:text-base whitespace-nowrap font-mono">{asset.balance}</span>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-right align-middle">
                         <span className="font-bold text-text-dark text-sm sm:text-base whitespace-nowrap font-mono">${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                         {/* Mobile Only Change Indicator */}
                         <div className={`sm:hidden text-xs font-medium mt-0.5 ${asset.change24h >= 0 ? 'text-success' : 'text-error'}`}>
                           {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                         </div>
                      </td>
                      <td className={`py-4 px-4 text-right font-medium hidden sm:table-cell ${asset.change24h >= 0 ? 'text-success' : 'text-error'}`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                      </td>
                      <td className="py-4 px-4 text-center hidden sm:table-cell">
                        <button 
                          onClick={() => handleAssetAction(asset.id)}
                          disabled={processingAssetId === asset.id}
                          className="text-primary hover:text-primary-hover text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center min-w-[60px]"
                        >
                          {processingAssetId === asset.id ? (
                            <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                          ) : (
                            asset.name === 'Vault Shares' ? 'Manage' : 'Trade'
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Performance Chart */}
          <section className="bg-card-dark p-6 rounded-xl border border-border-dark">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h2 className="text-xl font-bold mb-2 sm:mb-0 text-text-dark">Performance</h2>
              <div className="flex items-center gap-1 bg-background-dark p-1 rounded-lg border border-border-dark">
                {(['7D', '30D', '90D', 'All'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeFrame(tf)}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                      timeFrame === tf 
                        ? 'bg-card-dark text-text-dark shadow-sm' 
                        : 'text-text-secondary hover:text-text-dark'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative h-64 w-full" ref={chartContainerRef}></div>
          </section>

          {/* Open Orders */}
          <section className="bg-card-dark p-6 rounded-xl border border-border-dark">
            <div className="flex items-center border-b border-border-dark mb-4 overflow-x-auto">
              {(['Limit Orders', 'Trailing Stops'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveOrderTab(tab)}
                  className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeOrderTab === tab 
                      ? 'border-primary text-text-dark' 
                      : 'border-transparent text-text-secondary hover:text-text-dark'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-text-secondary uppercase border-b border-border-dark">
                    <th className="py-3 px-4 font-medium whitespace-nowrap">Order ID</th>
                    <th className="py-3 px-4 font-medium whitespace-nowrap">Type</th>
                    <th className="py-3 px-4 font-medium text-right whitespace-nowrap">Amount</th>
                    <th className="py-3 px-4 font-medium text-center whitespace-nowrap">Status</th>
                    <th className="py-3 px-4 font-medium text-center whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dark">
                  {activeOrderTab === 'Limit Orders' ? MOCK_OPEN_ORDERS.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-sm font-mono text-text-secondary whitespace-nowrap">{order.id}</td>
                      <td className="py-4 px-4 font-medium text-text-dark whitespace-nowrap">
                        <span className={order.type === 'BUY' ? 'text-success' : 'text-error'}>{order.type}</span> {order.pair}
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-text-dark whitespace-nowrap">{order.amount}</td>
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-1 text-xs font-semibold rounded-full border border-blue-500/20">
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button 
                          onClick={() => handleCancelOrder(order.id)}
                          className={`text-sm font-semibold transition-colors ${
                            cancellingOrder === order.id ? 'text-text-secondary cursor-wait' : 'text-error hover:text-red-400'
                          }`}
                        >
                          {cancellingOrder === order.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-text-secondary">
                        No active trailing stop orders.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {/* Sidebar Column */}
        <aside className="lg:col-span-1">
          <div className="bg-card-dark p-6 rounded-xl border border-border-dark sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-text-dark">Recent Activity</h2>
            
            <div className="relative">
              {/* Continuous Line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border-dark rounded-full"></div>
              
              <ul className="space-y-8">
                {MOCK_ACTIVITIES.map((activity) => (
                  <li key={activity.id} className="flex items-start gap-3 relative">
                    <div className="relative z-10 bg-background-dark h-6 w-6 rounded-full flex items-center justify-center ring-4 ring-card-dark border border-border-dark shrink-0">
                      {activity.type === 'DEPOSIT' && <span className="material-icons-outlined text-success text-xs font-bold">south_west</span>}
                      {activity.type === 'WITHDRAW' && <span className="material-icons-outlined text-error text-xs font-bold">north_east</span>}
                      {activity.type === 'SWAP' && <span className="material-icons-outlined text-blue-400 text-xs font-bold">swap_horiz</span>}
                      {activity.type === 'STAKE' && <span className="material-icons-outlined text-purple-400 text-xs font-bold">account_balance_wallet</span>}
                    </div>
                    <div className="pt-0.5">
                      <p className="font-semibold text-text-dark text-sm leading-tight">{activity.title}</p>
                      <p className="text-sm font-medium text-text-dark/80 mt-1">{activity.desc}</p>
                      <p className="text-xs text-text-secondary mt-1.5">{activity.timestamp}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={handleViewHistory}
              disabled={viewingHistory}
              className="w-full mt-8 py-2 text-sm font-semibold text-text-secondary hover:text-text-dark border border-border-dark rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {viewingHistory ? (
                 <>
                   <span className="w-3 h-3 border-2 border-text-secondary/30 border-t-text-secondary rounded-full animate-spin"></span>
                   Loading...
                 </>
              ) : 'View All History'}
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
};
