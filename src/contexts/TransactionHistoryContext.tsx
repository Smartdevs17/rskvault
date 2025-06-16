import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Transaction {
  hash: string;
  to: string;
  amount: string;
  tokenSymbol: string;
  timestamp: number;
}

interface TransactionHistoryContextType {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => Promise<void>;
}

const TransactionHistoryContext = createContext<TransactionHistoryContextType>({
  transactions: [],
  addTransaction: async () => {},
});

export const useTransactionHistory = () => useContext(TransactionHistoryContext);

export const TransactionHistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadTransactions = async () => {
      const saved = await AsyncStorage.getItem('transactions');
      if (saved) setTransactions(JSON.parse(saved));
    };
    loadTransactions();
  }, []);

  const addTransaction = async (tx: Transaction) => {
    setTransactions(prev => {
      const newTransactions = [tx, ...prev.slice(0, 9)];
      AsyncStorage.setItem('transactions', JSON.stringify(newTransactions));
      return newTransactions;
    });
  };

  return (
    <TransactionHistoryContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionHistoryContext.Provider>
  );
};