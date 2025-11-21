// Analytics & Event Tracking Service
// Lightweight analytics without external dependencies (per spec PART 11.2)

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
}

// In-memory event store for debugging
const eventLog: AnalyticsEvent[] = [];
const MAX_LOG_SIZE = 100;

/**
 * Initialize analytics
 * For now, this is a lightweight implementation
 * Can be extended with Google Analytics 4 or other services
 */
export const initAnalytics = (): void => {
  console.log('[Analytics] Initialized');
  
  // In production, this would initialize GA4:
  // const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  // if (measurementId) {
  //   ReactGA.initialize(measurementId);
  // }
};

/**
 * Track custom events
 * Fire-and-forget async tracking (per spec)
 * @param category - Event category (e.g., 'Swap', 'Wallet', 'Vault')
 * @param action - Event action (e.g., 'Token Selected', 'Amount Entered')
 * @param label - Optional event label for additional context
 * @param value - Optional numeric value
 */
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
): void => {
  const event: AnalyticsEvent = {
    category,
    action,
    label,
    value,
    timestamp: Date.now(),
  };
  
  // Add to in-memory log
  eventLog.push(event);
  if (eventLog.length > MAX_LOG_SIZE) {
    eventLog.shift(); // Remove oldest event
  }
  
  // Console log for development
  console.log(
    `[Analytics] ${category} > ${action}${label ? ` > ${label}` : ''}${value ? ` (${value})` : ''}`
  );
  
  // In production, this would send to GA4:
  // ReactGA.event({
  //   category,
  //   action,
  //   label,
  //   value,
  // });
};

/**
 * Track page views
 * @param path - Page path
 */
export const trackPageView = (path: string): void => {
  console.log(`[Analytics] Page View > ${path}`);
  
  // In production:
  // ReactGA.send({ hitType: 'pageview', page: path });
};

/**
 * Track wallet connection events
 * @param address - Wallet address
 * @param chainId - Chain ID
 */
export const trackWalletConnection = (address: string, chainId: number): void => {
  trackEvent('Wallet', 'Connected', `Chain ${chainId}`);
};

/**
 * Track wallet disconnection
 */
export const trackWalletDisconnection = (): void => {
  trackEvent('Wallet', 'Disconnected');
};

/**
 * Track swap-related events
 */
export const trackSwapEvents = {
  tokenSelected: (symbol: string, position: 'from' | 'to') => {
    trackEvent('Swap', 'Token Selected', `${symbol} (${position})`);
  },
  
  amountEntered: (amount: string, symbol: string) => {
    trackEvent('Swap', 'Amount Entered', `${amount} ${symbol}`);
  },
  
  previewClicked: (fromSymbol: string, toSymbol: string, amount: string) => {
    trackEvent('Swap', 'Preview Clicked', `${fromSymbol} → ${toSymbol}`, Number(amount));
  },
  
  swapInitiated: (fromSymbol: string, toSymbol: string, amount: string) => {
    trackEvent('Swap', 'Swap Initiated', `${fromSymbol} → ${toSymbol}`, Number(amount));
  },
  
  swapConfirmed: (fromSymbol: string, toSymbol: string, amount: string) => {
    trackEvent('Swap', 'Swap Confirmed', `${fromSymbol} → ${toSymbol}`, Number(amount));
  },
  
  swapFailed: (error: string) => {
    trackEvent('Swap', 'Swap Failed', error);
  },
};

/**
 * Get recent events (for debugging)
 * @param count - Number of recent events to return
 * @returns Array of recent analytics events
 */
export const getRecentEvents = (count: number = 10): AnalyticsEvent[] => {
  return eventLog.slice(-count);
};

/**
 * Clear event log (for testing)
 */
export const clearEventLog = (): void => {
  eventLog.length = 0;
};
