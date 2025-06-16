// src/config/rpc.ts
import Constants from 'expo-constants';

type RpcConfig = {
  RSK_MAINNET: string;
  RSK_TESTNET: string;
  WALLET_CONNECT_PROJECT_ID: string;
};

export const RPC_CONFIG: RpcConfig = {
  RSK_MAINNET: Constants.expoConfig?.extra?.rpcUrls.rskMainnet as string,
  RSK_TESTNET: Constants.expoConfig?.extra?.rpcUrls.rskTestnet as string,
  WALLET_CONNECT_PROJECT_ID: Constants.expoConfig?.extra?.walletConnectProjectId as string
};