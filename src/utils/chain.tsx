import { RSK_NETWORKS } from '../constants/networks';

export const getChainName = (chainId: number): string | undefined => {
  const chain = RSK_NETWORKS.find(network => network.id === chainId);
  return chain?.name;
};

export const getChainId = (chainName: string): number | undefined => {
  const chain = RSK_NETWORKS.find(network => network.name === chainName);
  return chain?.id;
};