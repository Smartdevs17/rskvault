import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNetwork } from '../../contexts/NetworkProvider';
import { useAuth } from '../../contexts/AuthContext';
import { maskAddress } from '../../utils/maskAddress';
import { getChainName } from '../../utils/chain';
import { MaterialIcons } from '@expo/vector-icons';
import { NetworkModal } from './NetworkModal';

export const Header = () => {
  const { setNetworkModal, currentNetwork } = useNetwork();
  const { currentUser, isAuthenticated } = useAuth();
  const [chainName, setChainName] = useState<string>('');

  useEffect(() => {
    if (currentNetwork) {
      const name = getChainName(Number(currentNetwork));
      setChainName(name || 'Rootstock');
    }
  }, [currentNetwork]);

  return (
    <>
      <View style={styles.container}>
        {/* Logo & Wallet */}
        <View style={styles.leftSection}>
          <Image 
            source={require('../../../assets/rsk-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          {isAuthenticated && currentUser?.address && (
            <Text style={styles.addressText}>
              {maskAddress(currentUser.address)}
            </Text>
          )}
        </View>

        {/* Network Selector - Only show when authenticated */}
        {isAuthenticated && (
          <TouchableOpacity 
            style={styles.networkButton}
            onPress={() => setNetworkModal(true)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="public" size={18} color="#2ECC71" />
            <Text style={styles.networkText}>
              {chainName}
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={16} color="#2ECC71" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Add the Network Modal - Only render when authenticated */}
      {isAuthenticated && <NetworkModal setNetworkModal={setNetworkModal} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#121212',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#2ECC71',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 18,
  },
  addressText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'monospace',
  },
  networkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  networkText: {
    color: '#2ECC71',
    fontSize: 14,
    fontFamily: 'monospace',
  },
});