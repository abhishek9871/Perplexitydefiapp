// Protocol Fee Calculation - 0.20% swap fee (per spec PART 10.1)
// Uses BigInt arithmetic to avoid precision loss

/**
 * Protocol fee configuration
 * Fee Breakdown:
 * - Swap Fee: 0.20% (20 basis points)
 * - Fee is deducted from input amount before swap
 */
export const PROTOCOL_FEES = {
  swapFeePercent: 0.20,
  
  // Fee receiver address from environment
  get feeReceiver(): `0x${string}` {
    return import.meta.env.VITE_FEE_RECEIVER_ADDRESS as `0x${string}`;
  },
  
  /**
   * Calculate swap fee (0.20% of input amount)
   * Formula: (amountIn * 20n) / 10000n
   * @param amountIn - Input amount in wei/smallest unit (bigint)
   * @returns Fee amount in same units (bigint)
   */
  calculateSwapFee: (amountIn: bigint): bigint => {
    return (amountIn * 20n) / 10000n; // 0.20% = 20/10000
  },
  
  /**
   * Calculate net amount after fee deduction
   * @param amountIn - Input amount in wei/smallest unit (bigint)
   * @returns Net amount after fee (bigint)
   */
  calculateNetAmount: (amountIn: bigint): bigint => {
    const fee = PROTOCOL_FEES.calculateSwapFee(amountIn);
    return amountIn - fee;
  },
  
  /**
   * Calculate fee as a percentage value
   * Useful for display purposes
   * @param amountIn - Input amount as number
   * @returns Fee amount as number
   */
  calculateSwapFeeNumber: (amountIn: number): number => {
    return (amountIn * 0.20) / 100;
  },
  
  /**
   * Calculate net amount as number
   * @param amountIn - Input amount as number
   * @returns Net amount after fee as number
   */
  calculateNetAmountNumber: (amountIn: number): number => {
    const fee = PROTOCOL_FEES.calculateSwapFeeNumber(amountIn);
    return amountIn - fee;
  },
} as const;

/**
 * Vault performance fee configuration (for future use)
 * Fee Breakdown:
 * - Performance Fee: 10% on net gains
 * - Assessment Interval: 7 days
 */
export const VAULT_FEES = {
  performanceFeePercent: 10,
  feeAssessmentInterval: 7 * 24 * 60 * 60, // 7 days in seconds
  
  /**
   * Calculate performance fee (10% of net gains)
   * @param netGain - Net gain amount in wei (bigint)
   * @returns Fee amount (bigint)
   */
  calculatePerformanceFee: (netGain: bigint): bigint => {
    if (netGain <= 0n) return 0n;
    return (netGain * 10n) / 100n; // 10%
  },
} as const;
