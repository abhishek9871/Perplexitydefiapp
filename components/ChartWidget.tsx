import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries } from 'lightweight-charts';
import { generateMockCandles } from '../constants';
import { TimeFrame } from '../types';

interface ChartWidgetProps {
  symbol: string;
  price: number;
  changePercent: number;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({ symbol, price, changePercent }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>('1H');
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#A3A3A3',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    });

    const newSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10B981', // Success color
      downColor: '#EF4444', // Error color
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });

    const data = generateMockCandles(100, price);
    newSeries.setData(data);

    chartRef.current = chart;
    seriesRef.current = newSeries;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Effect to update data when timeframe changes
  useEffect(() => {
    if (seriesRef.current) {
      // In a real app, fetch new data here. We'll just regenerate slightly different noise.
      const multiplier = activeTimeFrame === '1H' ? 1 : activeTimeFrame === '4H' ? 4 : 24;
      const data = generateMockCandles(100, price * (1 + (Math.random() * 0.01)));
      seriesRef.current.setData(data);
    }
  }, [activeTimeFrame, price]);

  const timeFrames: TimeFrame[] = ['1H', '4H', '1D', '1W', '1M'];

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark p-4 md:p-6 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {/* Overlapping Icons Mockup Style */}
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center z-10 border-2 border-card-dark">
               <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026" alt="BTC" className="w-full h-full rounded-full" />
            </div>
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center -ml-3 z-0 border-2 border-card-dark">
               <img src="https://cryptologos.cc/logos/tether-usdt-logo.png?v=026" alt="USDT" className="w-full h-full rounded-full" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold font-sans">{symbol}</h1>
            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Bitcoin</p>
          </div>
        </div>
        
        <div className="text-left sm:text-right">
          <p className="text-2xl font-bold font-mono">${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className={`text-sm font-medium ${changePercent >= 0 ? 'text-success' : 'text-error'}`}>
            {changePercent >= 0 ? '+' : ''}{changePercent}%
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-3 text-sm text-text-light-secondary dark:text-text-dark-secondary">
        {timeFrames.map((tf) => (
          <button
            key={tf}
            onClick={() => setActiveTimeFrame(tf)}
            className={`px-3 py-1.5 rounded transition-colors font-medium ${
              activeTimeFrame === tf
                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                : 'hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div 
        ref={chartContainerRef} 
        className="w-full h-[400px] relative"
      />
    </div>
  );
};

export default ChartWidget;