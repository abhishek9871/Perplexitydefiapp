'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType, IChartApi, CandlestickSeriesPartialOptions } from 'lightweight-charts';
import { getChartData, TIMEFRAMES_LIVE, LiveTimeframe, aggregateCandles, ChartDataPoint } from '@/lib/chartService';
import { subscribeToPythPriceFeed, PythTickData } from '@/lib/pyth';
import { trackEvent } from '@/lib/analytics';

interface TradingChartProps {
  coinId?: string;
  height?: number;
}

const TradingChart: React.FC<TradingChartProps> = ({ 
  coinId = 'ethereum', 
  height = 400 
}) => {
  // Refs for chart container and chart instance
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const dataRef = useRef<ChartDataPoint[]>([]); // Track data in ref to avoid dependency loop
  const requestIdRef = useRef(0); // Guard to ignore late responses
  const pythCleanupRef = useRef<null | (() => void)>(null);
  const firstTickTrackedRef = useRef(false);
  
  // State for UI
  const [activeCoinId, setActiveCoinId] = useState<string>(coinId);
  const [selectedTf, setSelectedTf] = useState<LiveTimeframe>(TIMEFRAMES_LIVE[0]); // default 1m
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [liveStatus, setLiveStatus] = useState<'unsupported' | 'connecting' | 'live' | 'offline'>('unsupported');
  const [seriesReady, setSeriesReady] = useState<boolean>(false);

  // Load chart data
  const loadChartData = useCallback(async (tf: LiveTimeframe, showLoading: boolean = true) => {
    const reqId = ++requestIdRef.current; // increment request id for this invocation
    try {
      if (showLoading) {
        setIsLoading(true);
        setError(null);
      }

      const raw = await getChartData(activeCoinId, tf.windowDays);
      const chartData = aggregateCandles(raw, tf.bucketSec);
      // If a newer request started, ignore this result
      if (reqId !== requestIdRef.current) return;
      
      if (chartData.length === 0) {
        // If we already have data, keep rendering it and do NOT show error overlay
        if (dataRef.current.length > 0) {
          console.warn('⚠️ Empty chart data received; keeping previous candles');
          // Ensure any previous error overlay is cleared since we still have candles
          setError(null);
          if (showLoading) {
            setIsLoading(false);
          }
          return;
        }
        // Only set error if we truly have no data at all
        setError('No chart data available');
        setData([]);
        dataRef.current = [];
        if (showLoading) {
          setIsLoading(false);
        }
        return;
      }

      // Clear any previous errors since we have data
      setError(null);
      setData(chartData);
      dataRef.current = chartData;
      
      // Update chart if it exists
      if (candlestickSeriesRef.current && chartData.length > 0) {
        candlestickSeriesRef.current.setData(chartData);
        chartRef.current?.timeScale().fitContent();
      }

      // Track successful load
      if (showLoading && chartData.length > 0) {
        trackEvent('Chart', 'Chart Loaded', activeCoinId);
      }

    } catch (err) {
      console.error('Chart data error:', err);
      // Ignore if a newer request started
      if (reqId !== requestIdRef.current) return;
      // Only show error if we have no existing data to display
      if (dataRef.current.length === 0) {
        setError('Failed to load chart data');
      }
    } finally {
      // Only the latest request should toggle loading off
      if (showLoading && reqId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [activeCoinId]);

  // Handle timeframe change
  const handleTimeframeChange = useCallback((tf: LiveTimeframe) => {
    setSelectedTf(tf);
    trackEvent('Chart', 'Timeframe Selected', tf.label);
  }, []);

  // Initialize chart (only once, or when height changes)
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Wait for container to have proper dimensions
    const initializeChart = () => {
      const container = chartContainerRef.current;
      if (!container) return;

      // Ensure container has width before initializing
      const containerWidth = container.clientWidth;
      if (containerWidth === 0) {
        // Retry after a short delay if container width is 0
        window.setTimeout(initializeChart, 100);
        return;
      }

      // Create chart instance with dark theme matching Hyper-DEX design system
      const chart = createChart(container, {
        layout: {
          background: { type: ColorType.Solid, color: '#151A21' }, // --bg-secondary from spec
          textColor: '#A3A3A3', // --text-secondary from spec
        },
        grid: {
          vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
          horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
        },
        width: containerWidth,
        height,
        crosshair: {
          mode: 0,
        },
        rightPriceScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        timeScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          timeVisible: true,
          secondsVisible: false,
        },
      });

      // Add candlestick series with Hyper-DEX colors
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#14B8A6', // teal-500 from spec (bullish candles)
        downColor: '#EF4444', // red-500 from spec (bearish candles)
        borderVisible: false,
        wickUpColor: '#14B8A6',
        wickDownColor: '#EF4444',
      } as CandlestickSeriesPartialOptions);

      // Store refs
      chartRef.current = chart;
      candlestickSeriesRef.current = candlestickSeries;

      // Initial data load - use current selected timeframe
      loadChartData(selectedTf);
      setSeriesReady(true);
    };

    // Start initialization with a small delay to ensure DOM is ready
    const initTimer = window.setTimeout(initializeChart, 50);

    // Cleanup function
    return () => {
      clearTimeout(initTimer);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
      }
    };
    // Only re-initialize if height changes, not when selectedDays or loadChartData changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  // Handle timeframe changes (only after chart is initialized)
  useEffect(() => {
    if (chartRef.current && candlestickSeriesRef.current) {
      loadChartData(selectedTf);
    }
  }, [selectedTf, loadChartData]);

  // Handle window resize
  useEffect(() => {
    let resizeTimeout: number;
    
    const handleResize = () => {
      // Debounce resize to avoid excessive calls
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        if (chartContainerRef.current && chartRef.current) {
          const newWidth = chartContainerRef.current.clientWidth;
          if (newWidth > 0) {
            chartRef.current.resize(newWidth, height);
          }
        }
      }, 100);
    };

    // Force initial resize after component mount
    const forceInitialResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        const containerWidth = chartContainerRef.current.clientWidth;
        if (containerWidth > 0) {
          chartRef.current.resize(containerWidth, height);
        }
      }
    };

    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Force resize after a short delay to fix initial sizing
    const initialResizeTimer = window.setTimeout(forceInitialResize, 200);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      clearTimeout(initialResizeTimer);
    };
  }, [height]);

  // Live updates via Pyth SDK (if supported for coinId)
  useEffect(() => {
    // Clean up any previous subscription
    pythCleanupRef.current?.();
    pythCleanupRef.current = null;
    firstTickTrackedRef.current = false;
    // Only start once chart/series are ready
    if (!candlestickSeriesRef.current || !seriesReady) return;

    const cleanup = subscribeToPythPriceFeed(
      activeCoinId,
      (tick: PythTickData) => {
        const candles = dataRef.current;
        if (!candles || candles.length === 0) return;
        const bucketSec = selectedTf.bucketSec;
        const tickTs = Math.floor(tick.time || Date.now() / 1000);
        const tickBucket = Math.floor(tickTs / bucketSec) * bucketSec;
        const lastIndex = candles.length - 1;
        const last = candles[lastIndex];
        const lastTs = typeof last.time === 'number' ? last.time : Number(last.time as any);
        const price = tick.price;

        if (tickBucket === lastTs) {
          // Patch current candle
          const updated = {
            time: last.time,
            open: last.open,
            high: Math.max(last.high, price),
            low: Math.min(last.low, price),
            close: price,
          } as ChartDataPoint;
          candles[lastIndex] = updated;
          dataRef.current = candles;
          candlestickSeriesRef.current?.update(updated);
        } else if (tickBucket > lastTs) {
          // Open a new candle for the next bucket
          const newBar: ChartDataPoint = {
            time: tickBucket as any,
            open: last.close,
            high: price,
            low: price,
            close: price,
          };
          candles.push(newBar);
          dataRef.current = candles;
          candlestickSeriesRef.current?.update(newBar);
        }

        setData([...dataRef.current]);

        if (!firstTickTrackedRef.current) {
          trackEvent('Chart', 'Live Tick Received', activeCoinId);
          firstTickTrackedRef.current = true;
        }
      },
      (status) => setLiveStatus(status)
    );

    pythCleanupRef.current = cleanup;

    return () => {
      pythCleanupRef.current?.();
      pythCleanupRef.current = null;
    };
  }, [activeCoinId, selectedTf.bucketSec, seriesReady]);

  // Auto-refresh historical candles every 60 seconds (live ticks still stream)
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // Silently refresh data without showing loading state
      loadChartData(selectedTf, false);
    }, 60 * 1000); // 60 seconds

    return () => clearInterval(refreshInterval);
  }, [selectedTf, loadChartData]);

  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4">
      {/* Chart Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Price Chart</h3>
        <div className="text-sm text-gray-400">
          {coinId.charAt(0).toUpperCase() + coinId.slice(1)}/USD
          <span className="ml-3 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-gray-600">
            <span
              className={
                liveStatus === 'live'
                  ? 'inline-block w-2 h-2 rounded-full bg-emerald-400'
                  : liveStatus === 'connecting'
                  ? 'inline-block w-2 h-2 rounded-full bg-amber-400'
                  : liveStatus === 'unsupported'
                  ? 'inline-block w-2 h-2 rounded-full bg-gray-500'
                  : 'inline-block w-2 h-2 rounded-full bg-red-500'
              }
            />
            {liveStatus === 'live' && 'Live'}
            {liveStatus === 'connecting' && 'Connecting…'}
            {liveStatus === 'offline' && 'Live offline'}
            {liveStatus === 'unsupported' && 'No live feed'}
          </span>
        </div>
      </div>

      {/* Timeframe Selector (live buckets) */}
      <div className="flex gap-2 mb-4">
        {TIMEFRAMES_LIVE.map((tf) => (
          <button
            key={tf.label}
            onClick={() => handleTimeframeChange(tf)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedTf.label === tf.label
                ? 'bg-teal-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tf.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="relative">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-2"></div>
              <div className="text-gray-400">Loading chart data...</div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && dataRef.current.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10 rounded-lg">
            <div className="text-center">
              <div className="text-red-400 mb-2">⚠️</div>
              <div className="text-red-400">{error}</div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div 
          ref={chartContainerRef} 
          className="w-full"
          style={{ height: `${height}px` }}
        />
      </div>

      {/* Chart Info */}
      {data.length > 0 && !isLoading && !error && (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
          <div>
            {data.length} candles • {selectedTf.label.toUpperCase()}
          </div>
          <div>
            Auto-refresh: 60s
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingChart;
