import { RPC_CONFIG } from '../config/rpc';

export const getRpcUrl = (chainId: number) => {
  if (chainId === 30) return RPC_CONFIG.RSK_MAINNET;
  if (chainId === 31) return RPC_CONFIG.RSK_TESTNET;
  return '';
};
