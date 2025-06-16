// src/components/Home/TokenList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGetEthBalance } from '../../hooks/useGetBalance';
import { formatBalance } from '../../utils/formatBalance';
import { useAuth } from '../../contexts/AuthContext';
import { useToken } from '../../contexts/Token';
import { useNetwork } from '../../contexts/NetworkProvider';
import { TokenRow } from './TokenRow';
import { useChainId } from 'wagmi';
import { TransactionHistory } from './TransactionHistory';

interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
}

export const TokenList = () => {
  const { tokens } = useToken();
  const { currentNetwork } = useNetwork();
  const [balances, setBalances] = useState<{ [key: string]: string | null }>({});
  const { currentUser } = useAuth();
  const address = currentUser?.address;
  const wagmiChainId = useChainId();

  // Use currentNetwork from your context instead of wagmi
  const activeChainId = currentNetwork ? Number(currentNetwork) : wagmiChainId;

  // Filter tokens based on your context's currentNetwork
  const filteredTokens = tokens.filter((token: Token) => token.chainId === activeChainId);

  // Get RBTC balance using the active chain ID
  const rbtcBalance = useGetEthBalance({
    address: address as `0x${string}`,
    chainId: activeChainId,
  });

  useEffect(() => {
    const newBalances: { [key: string]: string | null } = {};

    // Format RBTC balance
    if (rbtcBalance) {
      newBalances['RBTC'] = formatBalance(rbtcBalance.value, 18);
    }

    if (JSON.stringify(newBalances) !== JSON.stringify(balances)) {
      setBalances(newBalances);
    }
  }, [rbtcBalance]);

  // Debug: Show which network is active
  const getNetworkName = (chainId: number) => {
    switch(chainId) {
      case 30: return 'Rootstock Mainnet';
      case 31: return 'Rootstock Testnet';
      default: return `Chain ${chainId}`;
    }
  };

  return (
    <View style={styles.container}>
      {/* Debug info - remove this in production */}
      {/* <View style={styles.debugContainer}>
        <Text style={styles.debugText}>
          Active Network: {getNetworkName(activeChainId)}
        </Text>
        <Text style={styles.debugText}>
          Wagmi: {wagmiChainId} | Context: {currentNetwork}
        </Text>
      </View> */}

      {/* RBTC Token */}
      <TouchableOpacity style={styles.tokenItem}>
        <View style={styles.tokenLeft}>
          <View style={[styles.tokenIcon, { backgroundColor: '#FFD700' }]}>
            <MaterialCommunityIcons name="currency-btc" size={20} color="black" />
          </View>
          <Text style={styles.tokenName}>ROOTSTOCK RBTC</Text>
        </View>
        <Text style={styles.tokenBalance}>
          {balances['RBTC'] || '0'} RBTC
        </Text>
      </TouchableOpacity>

      {/* Other Tokens */}
      {filteredTokens.map((token: Token) => (
        <TokenRow
          key={token.address}
          token={token}
          userAddress={address as `0x${string}`}
        />
      ))}

      <TransactionHistory />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 40,
    width: '100%',
  },
  debugContainer: {
    backgroundColor: '#1E1E1E',
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  debugText: {
    color: '#2ECC71',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  tokenItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  tokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenName: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  tokenBalance: {
    color: '#A0A0A0',
    fontSize: 16,
    fontFamily: 'monospace',
  },
});