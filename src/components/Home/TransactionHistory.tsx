import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TransactionCard } from '../UI/TransactionCard';
import { useTransactionHistory } from '../../contexts/TransactionHistoryContext';

export const TransactionHistory = () => {
  const { transactions } = useTransactionHistory();

  if (!transactions.length) {
    return (
      <View style={styles.historyContainer}>
        <Text style={styles.noTxText}>No transactions yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>Transaction History</Text>
      <FlatList
        scrollEnabled={false}
        data={transactions}
        keyExtractor={item => item.hash}
        renderItem={({ item }) => (
          <TransactionCard
            type={item.to.toLowerCase() === 'your_address_here' ? 'receive' : 'send'}
            tokenSymbol={item.tokenSymbol}
            amount={item.amount}
            status="confirmed"
            timestamp={new Date(item.timestamp).toLocaleString()}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  historyContainer: {
    marginTop: 24,
    width: '100%',
  },
  historyTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  noTxText: {
    color: '#A0A0A0',
    fontSize: 16,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginTop: 24,
  },
});