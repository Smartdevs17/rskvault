import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Alert,
  Image 
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useWalletAuth } from '../contexts/WalletAuth';
import { getSeedPhrase } from "../utils/storage/database";
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useToken } from '../contexts/Token';
import { RootStackParamList } from '../routes/RootstockRoutes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LoginScreen: React.FC = () => {
  const { setCurrentUser, setIsAuthenticated, setIsPasswordSet } = useAuth();
  const { setSeedPhrase, setAddress } = useWalletAuth();
  const { setTokens, setChainId } = useToken();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasBiometric, setHasBiometric] = useState(false);
  const [storedAddress, setStoredAddress] = useState<string>('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    checkStoredData();
    checkBiometrics();
  }, []);

  const checkStoredData = async () => {
    try {
      // Check both SecureStore and AsyncStorage for address
      let address = await SecureStore.getItemAsync('walletAddress');
      if (!address) {
        address = await AsyncStorage.getItem('0xaddress');
      }
      if (!address) {
        address = await AsyncStorage.getItem('walletAddress');
      }
      
      if (address) {
        setStoredAddress(address);
      }
    } catch (error) {
      console.error('Error checking stored data:', error);
    }
  };

  const checkBiometrics = async () => {
    try {
      const useBiometric = await SecureStore.getItemAsync('useBiometric');
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      setHasBiometric(useBiometric === 'true' && hasHardware && isEnrolled);
    } catch (error) {
      console.error('Error checking biometrics:', error);
    }
  };

  const loadUserTokensAndChain = async (userAddress: string) => {
    try {
      // Load tokens from storage
      const tokens = await AsyncStorage.getItem("tokens");
      let chainId = await AsyncStorage.getItem("chainId");
      
      // Set default chainId if not found
      if (!chainId) {
        chainId = "30"; // Default to mainnet
        await AsyncStorage.setItem("chainId", chainId);
      }
      
      setChainId(parseInt(chainId));
      
      if (tokens) {
        const parsedTokens = JSON.parse(tokens);
        // Filter tokens for current user and chain
        const filteredTokens = parsedTokens.filter((token: any) => 
          token.userAddress === userAddress && 
          token.chainId === parseInt(chainId)
        );
        setTokens(filteredTokens);
      } else {
        setTokens([]);
      }
    } catch (error) {
      console.error('Error loading tokens and chain:', error);
      // Set defaults on error
      setChainId(30);
      setTokens([]);
    }
  };

  const handleBiometricLogin = async () => {
    if (!hasBiometric) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your wallet',
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Get stored data from multiple sources
        let address = await SecureStore.getItemAsync('walletAddress');
        if (!address) {
          address = await AsyncStorage.getItem('0xaddress');
        }
        if (!address) {
          address = await AsyncStorage.getItem('walletAddress');
        }

        // For biometric login, we need to get the seed phrase without password
        // This assumes you have a way to retrieve it for biometric users
        let seedPhraseStr = await SecureStore.getItemAsync('seedPhrase');
        if (!seedPhraseStr && address) {
          seedPhraseStr = await AsyncStorage.getItem('seedPhrase');
        }
        if (!seedPhraseStr && address) {
          // Try to get from getSeedPhrase with empty password for biometric users
          try {
            seedPhraseStr = await getSeedPhrase('');
          } catch (err) {
            console.error('Could not retrieve seed phrase for biometric login:', err);
          }
        }
        
        if (address && seedPhraseStr) {
          // Set all contexts properly
          setAddress(address);
          setSeedPhrase(seedPhraseStr.split(' '));
          setCurrentUser({
            address,
            seedPhrase: seedPhraseStr,
            password: '', // Don't store password for biometric login
          });
          setIsAuthenticated(true);
          setIsPasswordSet(true);
          
          // Load user's tokens and chain data
          await loadUserTokensAndChain(address);
          
          // Navigate to home
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          setError('Account data not found. Please try password login.');
        }
      } else {
        setError('Biometric authentication failed');
      }
    } catch (err) {
      console.error('Biometric login error:', err);
      setError('Biometric authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Try to decrypt the seed phrase with the provided password
      const seedPhraseStr = await getSeedPhrase(password);
      
      // Get address from multiple sources
      let address = await SecureStore.getItemAsync('walletAddress');
      if (!address) {
        address = await AsyncStorage.getItem('0xaddress');
      }
      if (!address) {
        address = await AsyncStorage.getItem('walletAddress');
      }

      if (seedPhraseStr && address) {
        // Set all contexts properly
        setAddress(address);
        setSeedPhrase(seedPhraseStr.split(' '));
        setCurrentUser({
          address,
          seedPhrase: seedPhraseStr,
          password,
        });
        setIsAuthenticated(true);
        setIsPasswordSet(true);
        
        // Load user's tokens and chain data
        await loadUserTokensAndChain(address);

        // Navigate to home
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        setError('Invalid password or account not found');
      }
    } catch (err) {
      console.error('Password login error:', err);
      setError('Invalid password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const maskAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/rsk-logo.png')} // Update with your logo path
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        
        {storedAddress && (
          <Text style={styles.addressText}>
            Account: {maskAddress(storedAddress)}
          </Text>
        )}

        <Text style={styles.instructions}>
          Enter your password to unlock your wallet
        </Text>

        {/* Password Input */}
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter Password"
            placeholderTextColor="#A0A0A0"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError(null); // Clear error when user types
            }}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            disabled={isLoading}
          >
            <MaterialIcons 
              name={showPassword ? 'visibility-off' : 'visibility'} 
              size={24} 
              color="#A0A0A0" 
            />
          </TouchableOpacity>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        {/* Login Button */}
        <TouchableOpacity
          style={[
            styles.loginButton,
            (!password.trim() || isLoading) && styles.disabledButton,
          ]}
          onPress={handlePasswordLogin}
          disabled={!password.trim() || isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'UNLOCKING...' : 'UNLOCK WALLET'}
          </Text>
        </TouchableOpacity>

        {/* Biometric Login */}
        {hasBiometric && (
          <>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometricLogin}
              disabled={isLoading}
            >
              <MaterialIcons 
                name="fingerprint" 
                size={24} 
                color="#2ECC71" 
              />
              <Text style={styles.biometricButtonText}>
                Use Biometric Authentication
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Forgot Password / Import Another Wallet */}
        <View style={styles.bottomLinks}>
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => {
              Alert.alert(
                'Reset Wallet', 
                'To reset your wallet, you will need to import it again using your seed phrase. This will replace your current wallet.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Import Wallet', 
                    onPress: () => {
                      // Navigate to import wallet screen
                      navigation.navigate('ImportWallet');
                    }
                  }
                ]
              );
            }}
          >
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#000',
  },
  logoContainer: {
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  addressText: {
    color: '#2ECC71',
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructions: {
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 32,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    opacity: 0.85,
  },
  passwordInputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 12,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontFamily: 'monospace',
    padding: 8,
  },
  eyeButton: {
    padding: 8,
  },
  loginButton: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#2ECC71',
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    color: '#121212',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#A0A0A0',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginHorizontal: 16,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2ECC71',
    width: '100%',
    justifyContent: 'center',
  },
  biometricButtonText: {
    color: '#2ECC71',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  bottomLinks: {
    marginTop: 32,
    alignItems: 'center',
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    color: '#2ECC71',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textDecorationLine: 'underline',
  },
  error: {
    color: '#EF4444',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});