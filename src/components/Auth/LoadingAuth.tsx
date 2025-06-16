import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Layout } from "../Layout/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { getSeedPhrase } from "../../utils/storage/database";
import { PasswordAuth } from "./PasswordAuth";
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as SecureStore from 'expo-secure-store';

export const LoadingAuth = () => {
  const {
    isAuthenticated,
    setIsAuthenticated,
    currentUser,
    setShowPasswordModal,
    isPasswordSet,
    showPasswordModal,
  } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have stored address
        const address = await SecureStore.getItemAsync('0xaddress');
        
        if (address) {
          // Check if SQLite database has data
          const hasData = await new Promise<boolean>((resolve) => {
            getSeedPhrase('') // Empty password just to check existence
              .then(() => resolve(true))
              .catch(() => resolve(false));
          });

          if (hasData && !isPasswordSet) {
            setIsAuthenticated(null);
            setShowPasswordModal(true);
          } else if (!hasData) {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication state:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, currentUser]);

  if (showPasswordModal) {
    return <PasswordAuth />;
  }

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Icon name="lock" size={48} color="#FF8D00" />
          <Text style={styles.title}>Rsk Vault</Text>
        </View>

        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#FF8D00" />
          <Text style={styles.loadingText}>Securing your wallet...</Text>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    fontFamily: 'Inter-Bold',
  },
  spinnerContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});