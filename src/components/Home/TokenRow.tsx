// src/components/Home/TokenRow.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGetBalance } from '../../hooks/useGetBalance';
import { formatBalance } from '../../utils/formatBalance';
import { useToken } from '../../contexts/Token';

interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
}


interface TokenRowProps {
  token: Token;
  userAddress: `0x${string}`;
}

export const TokenRow = ({ token, userAddress }: TokenRowProps) => {
  const { setSelectedToken } = useToken();
  const balance = useGetBalance({
    address: userAddress,
    tokenAddress: token.address as `0x${string}`,
  });

  const formattedBalance = formatBalance(balance ?? BigInt(0), token.decimals);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setSelectedToken(token)}
    >
      <View style={styles.leftContainer}>
        <View style={[styles.iconContainer, { backgroundColor: '#F47E60' }]}>
          <MaterialCommunityIcons name="lightning-bolt" size={20} color="black" />
        </View>
        <Text style={styles.tokenName}>{token.name}</Text>
      </View>
      <Text style={styles.tokenBalance}>
        {formattedBalance} {token.symbol}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
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