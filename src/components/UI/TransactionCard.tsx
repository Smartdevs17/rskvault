// src/components/UI/TransactionCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TransactionCardProps {
  type?: 'send' | 'receive';
  tokenSymbol: string;
  amount: string;
  status?: 'confirmed' | 'pending' | 'failed';
  timestamp?: string;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  type = 'send',
  tokenSymbol = 'RBTC',
  amount = '0',
  status = 'confirmed',
  timestamp,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Transaction Icon */}
        <View style={styles.iconContainer}>
          <MaterialIcons 
            name={type === 'send' ? 'arrow-upward' : 'arrow-downward'} 
            size={20} 
            color="black" 
          />
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.actionText}>
            {type === 'send' ? 'Sent' : 'Received'} {tokenSymbol}
          </Text>
          <Text style={[
            styles.statusText,
            status === 'confirmed' && styles.confirmedStatus,
            status === 'pending' && styles.pendingStatus,
            status === 'failed' && styles.failedStatus,
          ]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>

        {/* Amount */}
        <Text style={[
          styles.amountText,
          type === 'send' && styles.sendAmount,
          type === 'receive' && styles.receiveAmount,
        ]}>
          {type === 'send' ? '-' : '+'}{amount} {tokenSymbol}
        </Text>
      </View>

      {/* Timestamp (optional) */}
      {timestamp && (
        <Text style={styles.timestampText}>
          {timestamp}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  actionText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'monospace',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  confirmedStatus: {
    color: '#2ECC71', // Rootstock green
  },
  pendingStatus: {
    color: '#F59E0B', // Amber
  },
  failedStatus: {
    color: '#EF4444', // Red
  },
  amountText: {
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  sendAmount: {
    color: 'white',
  },
  receiveAmount: {
    color: '#2ECC71', // Rootstock green
  },
  timestampText: {
    color: '#A0A0A0',
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 8,
    marginLeft: 56, // Align with details
  },
});