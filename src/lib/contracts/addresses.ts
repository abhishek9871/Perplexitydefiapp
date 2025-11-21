// Token addresses and metadata for Arbitrum One
// Per spec PART 5.3: Token Addresses with CoinGecko integration

export interface TokenMetadata {
  symbol: string;
  name: string;
  address: `0x${string}`;
  decimals: number;
  coingeckoId: string | null;
  logoUrl: string;
}

/**
 * Arbitrum One token addresses (Chain ID: 42161)
 * These are verified contract addresses on Arbitrum
 */
export const ARBITRUM_TOKENS: TokenMetadata[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000', // Native ETH
    decimals: 18,
    coingeckoId: 'ethereum',
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026',
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', // WBTC on Arbitrum
    decimals: 8,
    coingeckoId: 'wrapped-bitcoin',
    logoUrl: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png?v=026',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // Native USDC on Arbitrum
    decimals: 6,
    coingeckoId: 'usd-coin',
    logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT on Arbitrum
    decimals: 6,
    coingeckoId: 'tether',
    logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=026',
  },
  {
    symbol: 'ARB',
    name: 'Arbitrum',
    address: '0x912CE59144191C1204E64559FE8253a0e49E6548', // ARB on Arbitrum
    decimals: 18,
    coingeckoId: 'arbitrum',
    logoUrl: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=026',
  },
];

/**
 * Arbitrum Sepolia testnet token addresses (Chain ID: 421614)
 * For testing purposes
 */
export const ARBITRUM_SEPOLIA_TOKENS: TokenMetadata[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    coingeckoId: 'ethereum',
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d', // Mock USDC on Sepolia
    decimals: 6,
    coingeckoId: 'usd-coin',
    logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026',
  },
];

/**
 * Get tokens for current chain
 * @param chainId - Chain ID
 * @returns Array of token metadata
 */
export function getTokensForChain(chainId: number): TokenMetadata[] {
  switch (chainId) {
    case 42161: // Arbitrum One
      return ARBITRUM_TOKENS;
    case 421614: // Arbitrum Sepolia
      return ARBITRUM_SEPOLIA_TOKENS;
    default:
      return ARBITRUM_TOKENS; // Default to mainnet
  }
}

/**
 * Get token by symbol
 * @param symbol - Token symbol
 * @param chainId - Chain ID
 * @returns Token metadata or undefined
 */
export function getTokenBySymbol(
  symbol: string,
  chainId: number = 42161
): TokenMetadata | undefined {
  const tokens = getTokensForChain(chainId);
  return tokens.find((t) => t.symbol.toLowerCase() === symbol.toLowerCase());
}

/**
 * Get token by address
 * @param address - Token address
 * @param chainId - Chain ID
 * @returns Token metadata or undefined
 */
export function getTokenByAddress(
  address: string,
  chainId: number = 42161
): TokenMetadata | undefined {
  const tokens = getTokensForChain(chainId);
  return tokens.find((t) => t.address.toLowerCase() === address.toLowerCase());
}
