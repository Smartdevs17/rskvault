// src/config/wagmi.ts
import { defaultWagmiConfig } from '@reown/appkit-wagmi-react-native';
import type { Chain } from 'wagmi/chains';
import { RPC_CONFIG } from './rpc';

// RSK Mainnet Chain
const rskMainnet: Chain = {
  id: 30,
  name: 'Rootstock',
  nativeCurrency: {
    decimals: 18,
    name: 'Rootstock Bitcoin',
    symbol: 'RBTC',
  },
  rpcUrls: {
    default: { http: [RPC_CONFIG.RSK_MAINNET] },
  },
  blockExplorers: {
    default: { name: 'RSKExplorer', url: 'https://explorer.rsk.co' },
  },
};

// RSK Testnet Chain
const rskTestnet: Chain = {
  id: 31,
  name: 'Rootstock Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Test Rootstock Bitcoin',
    symbol: 'tRBTC',
  },
  rpcUrls: {
    default: { http: [RPC_CONFIG.RSK_TESTNET] },
  },
  blockExplorers: {
    default: { name: 'RSKTestnetExplorer', url: 'https://explorer.testnet.rsk.co' },
  },
};

export const chains = [rskMainnet, rskTestnet] as const;

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: RPC_CONFIG.WALLET_CONNECT_PROJECT_ID,
  metadata: {
    name: 'RSKVault',
    description: 'RSKVault wallet',
    url: 'https://yourapp.com',
    icons: ['https://yourapp.com/icon.png'],
  },
});