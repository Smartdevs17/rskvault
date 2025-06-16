import { ethers } from 'ethers';

export const shortenAddress = (
  address?: string | null,
  options: {
    charsStart?: number;
    charsEnd?: number;
    include0x?: boolean;
  } = {}
): string => {
  const { charsStart = 4, charsEnd = 4, include0x = true } = options;

  if (!address || !ethers.isAddress(address)) {
    return '';
  }

  const prefix = include0x ? '0x' : '';
  const cleanAddress = address.startsWith('0x') ? address.substring(2) : address;
  
  return `${prefix}${cleanAddress.substring(0, charsStart)}...${cleanAddress.substring(
    cleanAddress.length - charsEnd
  )}`;
};