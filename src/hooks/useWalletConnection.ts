import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { formatUnits } from 'viem';

interface UseWalletConnectionReturn {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  chain: any;
  formattedBalance: string;
  disconnect: () => void;
  isCorrectChain: boolean;
}

export const useWalletConnection = (): UseWalletConnectionReturn => {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({
    address,
  });
  const { disconnect } = useDisconnect();

  // Format balance using viem's formatUnits
  const formattedBalance = balance 
    ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} ${balance.symbol}`
    : '0 ETH';

  // Check if on correct chain (Arbitrum One or Arbitrum Sepolia)
  const isCorrectChain = chain ? (
    chain.id === 42161 || chain.id === 421614
  ) : false;

  return {
    address,
    isConnected,
    chain,
    formattedBalance,
    disconnect,
    isCorrectChain,
  };
};
