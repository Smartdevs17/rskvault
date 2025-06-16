// src/pages/ReceiveScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Share } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { maskAddress } from '../utils/maskAddress';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useChainId } from 'wagmi';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../routes/RootstockRoutes';

type ReceiveScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Receive'>;

export const ReceiveScreen = () => {
  const [copied, setCopied] = useState(false);
  const { currentUser } = useAuth();
  const chainId = useChainId();
  const navigation = useNavigation<ReceiveScreenNavigationProp>();
  const address = currentUser?.address || '';

  const handleClose = () => navigation.goBack();

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy address');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My Rootstock Address: ${address}`,
        title: 'Share Address'
      });
    } catch (err) {
      alert('Failed to share address');
    }
  };

  const getAssetName = () => {
    switch(chainId) {
      case 30: return 'RBTC (Rootstock Mainnet)';
      case 31: return 'tRBTC (Rootstock Testnet)';
      default: return 'RBTC';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <MaterialIcons name="arrow-back" size={24} color="#A0A0A0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receive</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>RECEIVE {getAssetName()}</Text>
        </View>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <QRCode
            value={address}
            size={220}
            color="black"
            backgroundColor="white"
            logo={require('../../assets/rsk-logo.png')}
            logoSize={40}
            logoBackgroundColor="white"
            logoMargin={2}
            logoBorderRadius={4}
          />
        </View>

        {/* Address Display */}
        <View style={styles.addressContainer}>
          <TextInput
            style={styles.addressInput}
            value={maskAddress(address)}
            editable={false}
            selectTextOnFocus={true}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleCopy}
          >
            <MaterialIcons 
              name={copied ? "check" : "content-copy"} 
              size={20} 
              color={copied ? "#2ECC71" : "white"} 
            />
            <Text style={styles.actionButtonText}>
              {copied ? "Copied!" : "Copy"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleShare}
          >
            <FontAwesome name="share" size={20} color="white" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60, // Account for status bar
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40, // Same width as close button for centering
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addressContainer: {
    width: '100%',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  addressInput: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'monospace',
    textAlign: 'center',
    padding: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#2ECC71',
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});