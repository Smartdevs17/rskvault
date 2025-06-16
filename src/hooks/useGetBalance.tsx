// src/hooks/useGetBalance.ts
import { erc20Abi } from 'viem';
import { useReadContract, useBalance } from 'wagmi';

type GetBalanceProps = {
  address: `0x${string}`;
  tokenAddress: `0x${string}`;
  chainId?: number; // Made optional with RSK defaults
};

export const useGetBalance = ({ 
  address, 
  tokenAddress,
  chainId = 31 // Default to RSK Testnet
}: GetBalanceProps) => {
  const { data } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
    chainId, // Use provided chainId or default to RSK
  });

  return data;
};

export const useGetEthBalance = ({ 
  address,
  chainId = 31 // Default to RSK Testnet
}: { 
  address: `0x${string}`;
  chainId?: number;
}) => {
  const { data } = useBalance({
    address: address,
    chainId,
  });
  return data;
};