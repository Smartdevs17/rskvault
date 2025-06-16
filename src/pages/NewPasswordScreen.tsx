import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useWalletAuth } from '../contexts/WalletAuth';
import { useAuth } from '../contexts/AuthContext';
import { saveSeedPhrase } from "../utils/storage/database";
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useToken } from '../contexts/Token';
import { RootStackParamList } from '../routes/RootstockRoutes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NewPasswordScreen: React.FC = () => {
  const { seedPhrase, address } = useWalletAuth();
  const { setCurrentUser, currentUser, setIsPasswordSet, setIsAuthenticated } = useAuth();
  const { setTokens, setChainId } = useToken();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [useBiometric, setUseBiometric] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  React.useEffect(() => {
    const checkBiometrics = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(hasHardware && isEnrolled);
    };
    checkBiometrics();
  }, []);

  const getPasswordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const isPasswordValid = () => {
    if (password.length < 8) return false;
    if (password !== confirmPassword) return false;
    if (getPasswordStrength() < 3) return false;
    return true;
  };

  const setupUserTokensAndChain = async (userAddress: string) => {
    try {
      // Set default chainId
      const defaultChainId = 30; // Rootstock mainnet
      setChainId(defaultChainId);
      await AsyncStorage.setItem("chainId", defaultChainId.toString());
      
      // Initialize empty tokens array for new user
      setTokens([]);
      
      // You can add default tokens here if needed
      // const defaultTokens = [
      //   {
      //     address: "0x...", // RBTC or other default token
      //     name: "Rootstock BTC",
      //     symbol: "RBTC",
      //     decimals: 18,
      //     chainId: defaultChainId,
      //     userAddress: userAddress
      //   }
      // ];
      // setTokens(defaultTokens);
      // await AsyncStorage.setItem("tokens", JSON.stringify(defaultTokens));
      
    } catch (error) {
      console.error('Error setting up user tokens and chain:', error);
      // Set fallback defaults
      setChainId(30);
      setTokens([]);
    }
  };

  const handleSetPassword = async () => {
    if (!isPasswordValid()) {
      setError('Password must be at least 8 characters, match, and be strong.');
      return;
    }

    if (!address || !seedPhrase) {
      setError('Wallet data is missing. Please try creating/importing your wallet again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const joinedSeedPhrase = Array.isArray(seedPhrase) ? seedPhrase.join(' ') : seedPhrase;
      
      // Save encrypted seed phrase
      await saveSeedPhrase(joinedSeedPhrase, password);
      
      // Store wallet address in both SecureStore and AsyncStorage for compatibility
      await SecureStore.setItemAsync('walletAddress', address);
      await AsyncStorage.setItem('0xaddress', address);
      await AsyncStorage.setItem('walletAddress', address);
      
      // Store password flag
      await AsyncStorage.setItem('hasPassword', 'true');
      
      // Store biometric preference
      if (useBiometric) {
        await SecureStore.setItemAsync('useBiometric', 'true');
        // Save seed phrase for biometric login
        await SecureStore.setItemAsync('seedPhrase', joinedSeedPhrase);
      }

      // Set all authentication contexts
      setIsPasswordSet(true);
      setIsAuthenticated(true);
      setCurrentUser({
        address,
        seedPhrase: joinedSeedPhrase,
        password,
      });

      // Setup tokens and chain for the new user
      await setupUserTokensAndChain(address);

      // Navigate to home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err) {
      console.error('Password setup failed:', err);
      Alert.alert('Error', 'Failed to set password. Please try again.');
      setError('Failed to set password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBiometric = async () => {
    if (!isBiometricAvailable) return;
    
    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometric login'
      });
      if (success) {
        setUseBiometric(!useBiometric);
      }
    } catch (err) {
      console.error('Biometric authentication failed:', err);
      Alert.alert('Error', 'Biometric authentication failed');
    }
  };

  const passwordStrength = getPasswordStrength();
  const strengthColors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Set a New Password</Text>
        <Text style={styles.instructions}>
          Secure your wallet with a password. You'll need this to unlock your wallet on this device.
        </Text>
        
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter New Password"
            placeholderTextColor="#A0A0A0"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError(null);
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
        
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="#A0A0A0"
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError(null);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
        </View>
        
        {/* Password Strength Indicator */}
        {password.length > 0 && (
          <>
            <View style={styles.strengthContainer}>
              {[1, 2, 3, 4].map((i) => (
                <View 
                  key={i}
                  style={[
                    styles.strengthBar,
                    { 
                      backgroundColor: i <= passwordStrength 
                        ? strengthColors[passwordStrength - 1] 
                        : '#E5E7EB',
                      flex: passwordStrength >= i ? passwordStrength : 0.5
                    }
                  ]}
                />
              ))}
            </View>
            <Text style={styles.strengthText}>
              {passwordStrength < 2 ? 'Weak' : 
                passwordStrength < 4 ? 'Good' : 'Strong'}
            </Text>
          </>
        )}
        
        {/* Biometric Toggle */}
        {isBiometricAvailable && (
          <TouchableOpacity 
            style={styles.biometricContainer}
            onPress={toggleBiometric}
            disabled={isLoading}
          >
            <MaterialIcons 
              name={useBiometric ? 'check-box' : 'check-box-outline-blank'} 
              size={24} 
              color={useBiometric ? '#2ECC71' : '#A0A0A0'} 
            />
            <Text style={styles.biometricText}>
              Enable Biometric Authentication
            </Text>
          </TouchableOpacity>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[
            styles.setPasswordButton,
            (!isPasswordValid() || isLoading) && styles.disabledButton,
          ]}
          onPress={handleSetPassword}
          disabled={!isPasswordValid() || isLoading}
        >
          <Text style={styles.setPasswordButtonText}>
            {isLoading ? 'PROCESSING...' : 'SET PASSWORD & CONTINUE'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructions: {
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 16,
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
  strengthContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 4,
    height: 4,
    marginTop: 10,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    color: '#A0A0A0',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
    marginBottom: 16,
  },
  biometricContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 16,
    alignSelf: 'flex-start',
  },
  biometricText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  setPasswordButton: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#2ECC71',
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  setPasswordButtonText: {
    color: '#121212',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
    opacity: 0.6,
  },
  error: {
    color: '#EF4444',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});