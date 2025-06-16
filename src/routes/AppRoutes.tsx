import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from "../pages/Home";
import { Auth } from "../components/Auth/Auth";
import { useAuth } from "../contexts/AuthContext";
import { useToken } from "../contexts/Token";
import { useChainId, useSwitchChain } from "wagmi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetwork } from "../contexts/NetworkProvider";
import { useReceive } from "../contexts/Receive";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NewWalletScreen } from '../pages/NewWalletScreen';
import { ImportWalletScreen } from '../pages/ImportWalletScreen';
import { NewPasswordScreen } from '../pages/NewPasswordScreen';
import { ReceiveScreen } from '../pages/ReceiveScreen';
import { SendScreen } from '../pages/SendScreen';
import { LoginScreen } from '../pages/LoginScreen';
import { RootStackParamList } from './RootstockRoutes';

interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
  userAddress: string;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppRoutes: React.FC = () => {
  const { isAuthenticated, setCurrentUser, setIsAuthenticated } = useAuth();
  const { setTokens, setChainId } = useToken();
  const { networkModal, setNetworkModal, currentNetwork, setCurrentNetwork } = useNetwork();
  const { receiveModal, sendModal, setReceiveModal, setSendModal } = useReceive();
  const wagmiChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);
  const [isCheckingWallet, setIsCheckingWallet] = useState(true);

  // Determine initial route based on wallet existence
  useEffect(() => {
    const checkWalletExists = async () => {
      try {
        setIsCheckingWallet(true);
        
        // Check all possible storage keys for wallet data
        const checks = await Promise.all([
          AsyncStorage.getItem('walletAddress'),
          AsyncStorage.getItem('0xaddress'), 
          AsyncStorage.getItem('seedPhrase'),
          AsyncStorage.getItem('password'),
          AsyncStorage.getItem('hasPassword'),
          AsyncStorage.getItem('encryptedSeedPhrase'), 
        ]);

        const [walletAddress, oxAddress, seedPhrase, password, hasPassword, encryptedSeedPhrase] = checks;
        
        // Check if any wallet data exists
        const hasWalletData = walletAddress || oxAddress || seedPhrase || encryptedSeedPhrase;
        const hasPasswordSet = password || hasPassword === 'true';

        console.log('Wallet check results:', {
          walletAddress: !!walletAddress,
          oxAddress: !!oxAddress,
          seedPhrase: !!seedPhrase,
          password: !!password,
          hasPassword: hasPassword,
          encryptedSeedPhrase: !!encryptedSeedPhrase,
          hasWalletData: !!hasWalletData,
          hasPasswordSet: !!hasPasswordSet
        });

        if (!hasWalletData) {
          // Fresh install - no wallet exists
          console.log('Fresh install detected - showing Auth screen');
          setInitialRoute('Auth');
        } else if (hasWalletData && hasPasswordSet) {
          // Wallet exists with password - show login
          console.log('Existing wallet with password - showing Login screen');
          setInitialRoute('Login');
        } else if (hasWalletData && !hasPasswordSet) {
          // Legacy wallet without password - auto-authenticate
          console.log('Legacy wallet detected - auto-authenticating');
          const address = walletAddress || oxAddress;
          if (address) {
            // Set all required contexts for legacy wallet
            setCurrentUser({
              address: address,
              password: null,
              seedPhrase: seedPhrase || "",
            });
            setIsAuthenticated(true); // <-- Add this line
            setInitialRoute('Home');
          } else {
            setInitialRoute('Auth');
          }
        } else {
          // Fallback to Auth for safety
          setInitialRoute('Auth');
        }
      } catch (error) {
        console.error("Error checking wallet existence:", error);
        // On error, default to Auth screen for safety
        setInitialRoute('Auth');
      } finally {
        setIsCheckingWallet(false);
      }
    };

    checkWalletExists();
  }, []);

  // Handle network switching and token loading
  useEffect(() => {
    const loadTokensAndChain = async () => {
      if (isAuthenticated) {
        try {
          const tokens = await AsyncStorage.getItem("tokens");
          const localChainId = await AsyncStorage.getItem("chainId");

          // Set the network context from stored data
          if (localChainId && !currentNetwork) {
            const parsedChainId = parseInt(localChainId);
            console.log('Setting network context to:', parsedChainId);
            setCurrentNetwork(parsedChainId.toString());
            setChainId(parsedChainId);
          }

          // Load and filter tokens
          if (tokens) {
            const parsedTokens = JSON.parse(tokens);
            const activeChainId = currentNetwork ? Number(currentNetwork) : (localChainId ? parseInt(localChainId) : wagmiChainId);
            
            console.log('Active chain ID for filtering:', activeChainId);
            
            const filteredTokens = parsedTokens.filter(
              (token: Token) => token.chainId === activeChainId
            );
            
            console.log('Filtered tokens:', filteredTokens);
            setTokens([...filteredTokens]);
          }

          // Switch wagmi to match the stored/context network
          const targetChainId = currentNetwork ? Number(currentNetwork) : (localChainId ? parseInt(localChainId) : 31);
          if (wagmiChainId !== targetChainId) {
            console.log('Switching wagmi chain from', wagmiChainId, 'to', targetChainId);
            try {
              await switchChain({ chainId: targetChainId });
            } catch (switchError) {
              console.error('Failed to switch chain:', switchError);
            }
          }

        } catch (error) {
          console.error("Error loading tokens/chain:", error);
        }
      }
    };

    loadTokensAndChain();
  }, [isAuthenticated, currentNetwork, wagmiChainId]);

  // Sync wagmi chain changes back to context
  useEffect(() => {
    if (isAuthenticated && wagmiChainId && currentNetwork !== wagmiChainId.toString()) {
      console.log('Syncing wagmi chain change to context:', wagmiChainId);
      setCurrentNetwork(wagmiChainId.toString());
      setChainId(wagmiChainId);
      
      // Save to AsyncStorage
      AsyncStorage.setItem("chainId", wagmiChainId.toString());
    }
  }, [wagmiChainId, isAuthenticated]);

  // Show loading while checking wallet status
  if (isCheckingWallet || initialRoute === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="NewWallet" component={NewWalletScreen} />
      <Stack.Screen name="ImportWallet" component={ImportWalletScreen} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      <Stack.Screen 
        name="Receive" 
        component={ReceiveScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen 
        name="Send" 
        component={SendScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});

export default AppRoutes;