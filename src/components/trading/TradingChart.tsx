'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType, IChartApi, CandlestickSeriesPartialOptions } from 'lightweight-charts';
import { getChartData, TIMEFRAMES, Timeframe, ChartDataPoint } from '@/lib/chartService';
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
  
  // State for UI
  const [selectedDays, setSelectedDays] = useState<number>(7); // Default to 1 week
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ChartDataPoint[]>([]);

  // Load chart data
  const loadChartData = useCallback(async (days: number, showLoading: boolean = true) => {
    const reqId = ++requestIdRef.current; // increment request id for this invocation
    try {
      if (showLoading) {
        setIsLoading(true);
        setError(null);
      }

      const chartData = await getChartData(coinId, days);
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
        trackEvent('Chart', 'Chart Loaded', coinId);
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
  }, [coinId]);

  // Handle timeframe change
  const handleTimeframeChange = useCallback((days: number, label: string) => {
    setSelectedDays(days);
    trackEvent('Chart', 'Timeframe Selected', label);
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

      // Initial data load - use current selectedDays value
      loadChartData(selectedDays);
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
    // Only load data if chart is already initialized
    if (chartRef.current && candlestickSeriesRef.current) {
      loadChartData(selectedDays);
    }
  }, [selectedDays, loadChartData]);

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

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // Silently refresh data without showing loading state
      loadChartData(selectedDays, false);
    }, 60 * 1000); // 60 seconds

    return () => clearInterval(refreshInterval);
  }, [selectedDays, loadChartData]);

  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4">
      {/* Chart Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Price Chart</h3>
        <div className="text-sm text-gray-400">
          {coinId.charAt(0).toUpperCase() + coinId.slice(1)}/USD
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2 mb-4">
        {TIMEFRAMES.map(({ label, days }) => (
          <button
            key={label}
            onClick={() => handleTimeframeChange(days, label)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedDays === days
                ? 'bg-teal-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {label}
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
            {data.length} candles • {TIMEFRAMES.find(tf => tf.days === selectedDays)?.label}
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
