// src/components/Home/WalletBalance.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGetEthBalance } from '../../hooks/useGetBalance';
import { formatBalance } from '../../utils/formatBalance';
import { useAuth } from '../../contexts/AuthContext';
import { useChainId } from 'wagmi';

export const WalletBalance = () => {
  const [balanceHolder, setBalanceHolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const chainId = useChainId();
  const balance = useGetEthBalance({
    address: currentUser?.address as `0x${string}`,
    chainId
  });

  useEffect(() => {
    if (balance) {
      const formattedBalance = formatBalance(balance.value, 18);
      setBalanceHolder(formattedBalance);
      setLoading(false);
    }
  }, [balance]);

  // Get correct ticker symbol based on chain
  const getTickerSymbol = () => {
    return chainId === 30 ? 'RBTC' : chainId === 31 ? 'tRBTC' : 'RBTC';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>WALLET BALANCE</Text>
      <Text style={styles.balance}>
        {loading ? 'Loading...' : `${balanceHolder || '0'} ${getTickerSymbol()}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
    backgroundColor: '#121212', 
    borderWidth: 1,
    borderColor: '#2ECC71',
  },
  label: {
    color: '#2ECC71',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  balance: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'monospace',
    marginVertical: 8,
  },
});