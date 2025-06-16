import { formatUnits } from "viem";

export const formatBalance = (balance: bigint, decimals: number) => {
  const formatted = formatUnits(balance, decimals);
  // Show up to 6 decimals, but trim trailing zeros and decimal point if not needed
  return Number(formatted).toFixed(6).replace(/\.?0+$/, "");
};

export const formatBalanceWithCommas = (balance: string) => {
  return balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
