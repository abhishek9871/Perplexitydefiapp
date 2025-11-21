import { arbitrum, arbitrumSepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { ENV } from '../env';

export const wagmiConfig = getDefaultConfig({
  appName: 'Hyper-DEX',
  projectId: ENV.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [arbitrum, arbitrumSepolia],
  ssr: false, // Critical: Vite is client-only
  transports: {
    [arbitrum.id]: http(ENV.VITE_ARBITRUM_RPC_URL),
    [arbitrumSepolia.id]: http(ENV.VITE_ARBITRUM_SEPOLIA_RPC_URL),
  },
});
