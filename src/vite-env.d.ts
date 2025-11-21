/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ARBITRUM_RPC_URL: string;
  readonly VITE_ARBITRUM_SEPOLIA_RPC_URL: string;
  readonly VITE_WALLETCONNECT_PROJECT_ID: string;
  readonly VITE_ORDER_BOOK_ADDRESS: string;
  readonly VITE_TRAILING_STOP_MANAGER_ADDRESS: string;
  readonly VITE_SOCIAL_TRADING_VAULT_ADDRESS: string;
  readonly VITE_FEE_RECEIVER_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
