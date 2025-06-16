import React, { createContext, useContext, useState, useEffect } from 'react';
import { RSK_NETWORKS } from '../constants/networks';

type NetworkContextType = {
  networkModal: boolean;
  setNetworkModal: (value: boolean) => void;
  currentNetwork: string;
  setCurrentNetwork: (network: string) => void;
  networks: any[];
  setNetworks: (networks: any[]) => void;
};

export const NetworkContext = createContext<NetworkContextType | null>(null);

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) throw new Error('useNetwork must be used within NetworkProvider');
  return context;
}

export function NetworkProvider({ children }: React.PropsWithChildren) {
  const [networkModal, setNetworkModal] = useState(false);
  // Set default network to Rootstock Mainnet
  const [currentNetwork, setCurrentNetwork] = useState('30');
  const [networks, setNetworks] = useState<any[]>([]);

  // Populate networks on mount
  useEffect(() => {
    setNetworks(RSK_NETWORKS);
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        networkModal,
        setNetworkModal,
        currentNetwork,
        setCurrentNetwork,
        networks,
        setNetworks,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}