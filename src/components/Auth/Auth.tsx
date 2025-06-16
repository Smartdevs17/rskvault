import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Layout } from "../Layout/Layout";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NewWalletButton } from "./NewWalletButton";
import { ImportWalletButton } from "./ImportWalletButton";
import { useWalletAuth } from "../../contexts/WalletAuth";
import { useAuth } from "../../contexts/AuthContext";
import { LoadingAuth } from "./LoadingAuth";

export const Auth = () => {

  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <LoadingAuth />;
  }

  return (
    <Layout>
      <View style={styles.container}>
        {/* Logo and Title */}
        <View style={styles.header}>
          <Icon name="account-balance-wallet" size={48} color="#FF8D00" />
          <Text style={styles.title}>Rsk Vault</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <NewWalletButton navigateTo="NewWallet" />
          <ImportWalletButton navigateTo="ImportWallet" />
        </View>

  
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    fontFamily: 'Inter-Bold',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
});