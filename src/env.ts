import { z } from 'zod';

const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const httpsUrlRegex = /^https:\/\/.+/;

const envSchema = z.object({
  VITE_ARBITRUM_RPC_URL: z.string()
    .regex(httpsUrlRegex, 'VITE_ARBITRUM_RPC_URL must be a valid HTTPS URL')
    .min(1, 'VITE_ARBITRUM_RPC_URL cannot be empty'),
  
  VITE_ARBITRUM_SEPOLIA_RPC_URL: z.string()
    .regex(httpsUrlRegex, 'VITE_ARBITRUM_SEPOLIA_RPC_URL must be a valid HTTPS URL')
    .min(1, 'VITE_ARBITRUM_SEPOLIA_RPC_URL cannot be empty'),
  
  VITE_WALLETCONNECT_PROJECT_ID: z.string()
    .min(8, 'VITE_WALLETCONNECT_PROJECT_ID must be at least 8 characters long')
    .min(1, 'VITE_WALLETCONNECT_PROJECT_ID cannot be empty'),
  
  VITE_ORDER_BOOK_ADDRESS: z.string()
    .regex(ethereumAddressRegex, 'VITE_ORDER_BOOK_ADDRESS must be a valid Ethereum address (0x + 40 hex chars)')
    .refine((addr) => addr !== '0x0000000000000000000000000000000000000000', {
      message: 'VITE_ORDER_BOOK_ADDRESS cannot be the zero address',
    }),
  
  VITE_TRAILING_STOP_MANAGER_ADDRESS: z.string()
    .regex(ethereumAddressRegex, 'VITE_TRAILING_STOP_MANAGER_ADDRESS must be a valid Ethereum address (0x + 40 hex chars)')
    .refine((addr) => addr !== '0x0000000000000000000000000000000000000000', {
      message: 'VITE_TRAILING_STOP_MANAGER_ADDRESS cannot be the zero address',
    }),
  
  VITE_SOCIAL_TRADING_VAULT_ADDRESS: z.string()
    .regex(ethereumAddressRegex, 'VITE_SOCIAL_TRADING_VAULT_ADDRESS must be a valid Ethereum address (0x + 40 hex chars)')
    .refine((addr) => addr !== '0x0000000000000000000000000000000000000000', {
      message: 'VITE_SOCIAL_TRADING_VAULT_ADDRESS cannot be the zero address',
    }),
  
  VITE_FEE_RECEIVER_ADDRESS: z.string()
    .regex(ethereumAddressRegex, 'VITE_FEE_RECEIVER_ADDRESS must be a valid Ethereum address (0x + 40 hex chars)')
    .refine((addr) => addr !== '0x0000000000000000000000000000000000000000', {
      message: 'VITE_FEE_RECEIVER_ADDRESS cannot be the zero address',
    }),
});

// Parse and validate environment variables at import time
// This will throw immediately if any validation fails
const env = envSchema.parse(import.meta.env);

// Export the validated environment object
// All other modules should import this instead of using import.meta.env directly
export const ENV = env;
