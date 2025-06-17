// src/components/UI/NewTokenModal.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { Modal } from './Modal';
import { useToken } from '../../contexts/Token';
import { useChainId, useReadContract } from 'wagmi';
import { erc20Abi } from 'viem';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NewTokenModal = () => {
  const { setNewTokenModal, setTokens, tokens } = useToken();
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const chainId = useChainId();
  const { currentUser } = useAuth();
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  // Token info hooks
  const { data: nameData } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'name',
  });

  const { data: symbolData } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'symbol',
  });

  const { data: decimalsData } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  const handleClose = () => setNewTokenModal(false);

  const handleContinue = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (!tokenAddress) {
        setError('Token address required');
        return;
      }

      if (!nameData || !symbolData || !decimalsData) {
        setError('Could not fetch token info');
        return;
      }

      setTokenName(nameData.toString());
      setTokenSymbol(symbolData.toString());
      setTokenDecimals(decimalsData.toString());
      setShowMoreInfo(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToken = async () => {
    try {
      const tokenExists = tokens.some((t: { address: string; }) => t.address === tokenAddress);
      if (tokenExists) {
        setError('Token already exists');
        return;
      }

      const newToken = {
        address: tokenAddress,
        name: tokenName,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        chainId,
        userAddress: currentUser?.address || '',
      };

      // Save to AsyncStorage
      const existingTokens = await AsyncStorage.getItem('tokens');
      const parsedTokens = existingTokens ? JSON.parse(existingTokens) : [];
      const updatedTokens = [...parsedTokens, newToken];
      await AsyncStorage.setItem('tokens', JSON.stringify(updatedTokens));

      // Update context
      setTokens([...tokens, newToken]);
      handleClose();
    } catch (err) {
      setError('Failed to add token');
    }
  };

  return (
    <Modal onClose={handleClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>NEW TOKEN</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Token Address Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={tokenAddress}
            onChangeText={setTokenAddress}
            placeholder="Token contract address"
            placeholderTextColor="#666"
            editable={!isLoading && !showMoreInfo}
          />
          <Text style={styles.inputLabel}>TOKEN ADDRESS</Text>
        </View>

        {showMoreInfo && (
          <>
            {/* Token Name */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { color: '#aaa' }]}
                value={tokenName}
                editable={false}
              />
              <Text style={styles.inputLabel}>TOKEN NAME</Text>
            </View>

            {/* Token Symbol */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { color: '#aaa' }]}
                value={tokenSymbol}
                editable={false}
              />
              <Text style={styles.inputLabel}>TOKEN SYMBOL</Text>
            </View>

            {/* Token Decimals */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { color: '#aaa' }]}
                value={tokenDecimals}
                editable={false}
              />
              <Text style={styles.inputLabel}>DECIMALS</Text>
            </View>
          </>
        )}

        {/* Action Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={showMoreInfo ? handleAddToken : handleContinue}
          disabled={isLoading || (!showMoreInfo && !tokenAddress)}
        >
          {isLoading ? (
            <ActivityIndicator color="#2ECC71" />
          ) : (
            <Text style={styles.actionButtonText}>
              {showMoreInfo ? 'ADD TOKEN' : 'GET TOKEN INFO'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  cancelText: {
    color: '#A0A0A0',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF5252',
    marginTop: 15,
    fontFamily: 'monospace',
  },
  inputContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'monospace',
    flex: 1,
    padding: 5,
  },
  inputLabel: {
    color: '#A0A0A0',
    fontFamily: 'monospace',
  },
  actionButton: {
    width: '100%',
    backgroundColor: '#2ECC71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    opacity: 0.9,
  },
  actionButtonText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});