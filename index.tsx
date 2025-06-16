import "@walletconnect/react-native-compat";
import { registerRootComponent } from 'expo';
import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/contexts/AuthContext';
import { TokenProvider } from './src/contexts/Token';
import { NetworkProvider } from './src/contexts/NetworkProvider';
import { ReceiveProvider } from './src/contexts/Receive';
import { WalletAuthProvider } from './src/contexts/WalletAuth';
import App from './App';
import { NavigationContainer } from '@react-navigation/native';
import { wagmiConfig, chains } from './src/config/wagmi';
import { createAppKit, AppKit } from "@reown/appkit-wagmi-react-native";
import { ContactsProvider } from "./src/contexts/ContactsContext";
import { TransactionHistoryProvider } from "./src/contexts/TransactionHistoryContext";

// Setup queryClient
const queryClient = new QueryClient();

// Get projectId from env or fallback
const projectId = process.env.WALLET_CONNECT_PROJECT_ID || "YOUR_PROJECT_ID";

// App metadata for WalletConnect modal
const metadata = {
  name: "RSKVault",
  description: "RSKVault wallet",
  url: "https://yourapp.com",
  icons: ["https://yourapp.com/icon.png"],
  redirect: {
    native: "rskvault://",
    universal: "https://yourapp.com",
  },
};

// Initialize AppKit modal
createAppKit({
  projectId,
  wagmiConfig,
  defaultChain: chains[0],
  enableAnalytics: true,
  metadata,
});

function Root() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TokenProvider>
            <NetworkProvider>
              <ReceiveProvider>
                <WalletAuthProvider>
                  <TransactionHistoryProvider>
                  <ContactsProvider>
                    <App />
                  </ContactsProvider>
                  </TransactionHistoryProvider>
                </WalletAuthProvider>
              </ReceiveProvider>
            </NetworkProvider>
          </TokenProvider>
        </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

registerRootComponent(Root);
