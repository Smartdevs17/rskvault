// src/config/chains.ts
import type { Chain } from 'viem/chains';
import { RPC_CONFIG } from './rpc';
import type { ImageSourcePropType } from 'react-native';

export interface AppChain extends Chain {
  iconUrl?: ImageSourcePropType;
}

export const rootstockMainnet: AppChain = {
  id: 30,
  name: 'Rootstock',
  nativeCurrency: {
    decimals: 18,
    name: 'Rootstock Bitcoin',
    symbol: 'RBTC',
  },
  rpcUrls: {
    public: { http: [RPC_CONFIG.RSK_MAINNET] },
    default: { http: [RPC_CONFIG.RSK_MAINNET] },
  },
  blockExplorers: {
    default: { name: 'RSKExplorer', url: 'https://explorer.rsk.co' },
  },
  iconUrl: require('../../assets/rsk-logo.png'),
};

export const rootstockTestnet: AppChain = {
  id: 31,
  name: 'Rootstock Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Test Rootstock Bitcoin',
    symbol: 'tRBTC',
  },
  rpcUrls: {
    public: { http: [RPC_CONFIG.RSK_TESTNET] },
    default: { http: [RPC_CONFIG.RSK_TESTNET] },
  },
  blockExplorers: {
    default: { name: 'RSKTestnetExplorer', url: 'https://explorer.testnet.rsk.co' },
  },
  iconUrl: require('../../assets/rsk-logo.png')
};

export const supportedChains = [rootstockMainnet, rootstockTestnet];