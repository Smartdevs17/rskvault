// src/pages/SendScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  ActivityIndicator,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { erc20Abi } from 'viem';
import { ethers } from 'ethers';
import { useChainId } from 'wagmi';
import { useAuth } from '../contexts/AuthContext';
import { useToken } from '../contexts/Token';
import { getRpcUrl } from '../utils/getRpcUrl';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useContacts } from '../contexts/ContactsContext';
import { maskAddress } from '../utils/maskAddress';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../routes/RootstockRoutes';
import { useTransactionHistory } from '../contexts/TransactionHistoryContext';


type SendScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Send'>;

export const SendScreen = () => {
  const chainId = useChainId();
  const { tokens } = useToken();
  const { currentUser } = useAuth();
  const { contacts, addContact } = useContacts();
  const { addTransaction } = useTransactionHistory();
  const navigation = useNavigation<SendScreenNavigationProp>();
  
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>('RBTC');
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [gasEstimate, setGasEstimate] = useState<string>('');
  const [showContacts, setShowContacts] = useState<boolean>(false);
  const [showRecent, setShowRecent] = useState<boolean>(false);

  const filteredTokens = tokens.filter((token: any) => token.chainId === chainId);
  const recentTransactions = useTransactionHistory().transactions.slice(0, 3);

  const handleClose = () => navigation.goBack();

  // Gas estimation effect
  useEffect(() => {
    const estimateGas = async () => {
      if (!recipient || !amount || !currentUser?.seedPhrase) return;

      try {
        const rpcUrl = getRpcUrl(chainId);
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const signer = ethers.Wallet.fromPhrase(currentUser.seedPhrase).connect(provider);

        if (selectedTokenAddress === 'RBTC') {
          const estimatedGas = await provider.estimateGas({
            from: signer.address,
            to: recipient,
            value: ethers.parseEther(amount)
          });
          setGasEstimate(ethers.formatUnits(estimatedGas, 'gwei') + ' Gwei');
        } else {
          const contract = new ethers.Contract(selectedTokenAddress, erc20Abi, signer);
          const decimals = await contract.decimals();
          const estimatedGas = await contract.transfer.estimateGas(
            recipient, 
            ethers.parseUnits(amount, decimals)
          );
          setGasEstimate(ethers.formatUnits(estimatedGas, 'gwei') + ' Gwei');
        }
      } catch (error) {
        setGasEstimate('Estimate failed');
      }
    };

    const timer = setTimeout(() => {
      estimateGas();
    }, 500);

    return () => clearTimeout(timer);
  }, [recipient, amount, selectedTokenAddress]);

  const handleContactSelect = (address: string) => {
    setRecipient(address);
    setShowContacts(false);
  };

  const handleRecentSelect = (tx: any) => {
    setRecipient(tx.to);
    if (tx.tokenSymbol === 'RBTC') {
      setSelectedTokenAddress('RBTC');
    }
    setShowRecent(false);
  };

  const getErrorMessage = (error: any): string => {
    if (error?.info?.error?.message) {
      const message = error.info.error.message;
      if (message.includes('insufficient funds')) return 'Insufficient RBTC for gas';
      if (message.includes('gas required exceeds allowance')) return 'Adjust gas limit';
      if (message.includes('execution reverted')) return 'Transaction reverted';
      if (message.includes('nonce has already been used')) return 'Nonce issue';
    }

    if (error instanceof Error) {
      if (error.message.includes('user rejected')) return 'Transaction rejected';
      if (error.message.includes('network')) return 'Network error';
    }

    return 'Transaction failed';
  };

  const sendRbtc = async (to: string, amountInRbtc: string) => {
    setIsLoading(true);
    setError('');
    setIsSuccess(false);

    try {
      if (!currentUser?.seedPhrase) throw new Error('No seed phrase');
      
      const rpcUrl = getRpcUrl(chainId);
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const signer = ethers.Wallet.fromPhrase(currentUser.seedPhrase).connect(provider);

      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amountInRbtc),
      });

      console.log('Transaction hash:', tx.hash);
      await tx.wait();
      await addTransaction({
        hash: tx.hash,
        to,
        amount: amountInRbtc,
        tokenSymbol: selectedTokenAddress === 'RBTC' ? 'RBTC' : '',
        timestamp: Date.now(),
      });

      // Auto-add recipient to contacts if not already present
      if (!contacts.some(c => c.address.toLowerCase() === to.toLowerCase())) {
        addContact({ name: maskAddress(to), address: to });
      }
      setIsSuccess(true);
      Alert.alert('Success', 'Transaction sent successfully!');
      handleReset();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const sendToken = async () => {
    if (!selectedTokenAddress) {
      setError('Select a token');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setIsSuccess(false);

      if (!currentUser?.seedPhrase) throw new Error('No seed phrase');
      
      const rpcUrl = getRpcUrl(chainId);
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const signer = ethers.Wallet.fromPhrase(currentUser.seedPhrase).connect(provider);

      const contract = new ethers.Contract(selectedTokenAddress, erc20Abi, signer);
      const decimals = await contract.decimals();
      const tx = await contract.transfer(
        recipient, 
        ethers.parseUnits(amount, decimals)
      );

      console.log('Transaction hash:', tx.hash);
      await tx.wait();
      await addTransaction({
        hash: tx.hash,
        to: recipient,
        amount,
        tokenSymbol: selectedTokenAddress === 'RBTC' ? 'RBTC' : '',
        timestamp: Date.now(),
      });
      setIsSuccess(true);
      Alert.alert('Success', 'Transaction sent successfully!');
      handleReset();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!recipient || !ethers.isAddress(recipient)) {
      setError('Invalid recipient');
      return;
    }

    if (!amount || !Number(amount)) {
      setError('Invalid amount');
      return;
    }

    if (selectedTokenAddress === 'RBTC') {
      await sendRbtc(recipient, amount);
    } else {
      await sendToken();
    }
  };

  const handleReset = () => {
    setError('');
    setIsSuccess(false);
    setRecipient('');
    setAmount('');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#A0A0A0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>SEND {chainId === 31 ? 'tRBTC' : 'RBTC'}</Text>
          
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : isSuccess ? (
            <Text style={styles.successText}>Transaction successful!</Text>
          ) : null}
        </View>

        {/* Token Selector */}
        <View style={styles.inputContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedTokenAddress}
              onValueChange={(itemValue: React.SetStateAction<string>) => {
                setSelectedTokenAddress(itemValue);
                setGasEstimate('');
              }}
              style={styles.picker}
              dropdownIconColor="#FFFFFF"
            >
              <Picker.Item label="RBTC" value="RBTC" />
              {filteredTokens.map((token: { address: any; symbol: any; }) => (
                <Picker.Item 
                  key={token.address} 
                  label={token.symbol} 
                  value={token.address} 
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.inputLabel}>TOKEN</Text>
        </View>

        {/* Recipient Address with Contacts */}
        <View style={styles.inputContainer}>
          <View style={styles.recipientInputContainer}>
            <TextInput
              style={styles.input}
              value={recipient}
              onChangeText={setRecipient}
              placeholder="0x..."
              placeholderTextColor="#666"
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              onPress={() => setShowContacts(!showContacts)}
              style={styles.contactsButton}
            >
              <MaterialIcons name="contacts" size={24} color="#2ECC71" />
            </TouchableOpacity>
          </View>
          <Text style={styles.inputLabel}>RECIPIENT</Text>
        </View>

        {/* Contacts List */}
        {showContacts && (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>CONTACTS</Text>
            <FlatList
                scrollEnabled={false}

              data={contacts}
              keyExtractor={(item) => item.address}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.listItem}
                  onPress={() => handleContactSelect(item.address)}
                >
                  <Text style={styles.listItemText}>{item.name}</Text>
                  <Text style={styles.listItemSubtext}>{maskAddress(item.address)}</Text>
                </TouchableOpacity>
              )}
              style={styles.flatList}
            />
          </View>
        )}

        {/* Recent Transactions List */}
        {showRecent && (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>RECENT</Text>
            <FlatList
              scrollEnabled={false}
              data={recentTransactions}
              keyExtractor={(item) => item.hash}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.listItem}
                  onPress={() => handleRecentSelect(item)}
                >
                  <Text style={styles.listItemText}>
                    {item.tokenSymbol} to {maskAddress(item.to)}
                  </Text>
                  <Text style={styles.listItemSubtext}>
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.flatList}
            />
          </View>
        )}

        {/* Amount */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.0"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
          <Text style={styles.inputLabel}>AMOUNT</Text>
        </View>

        {/* Gas Estimate */}
        {gasEstimate && (
          <View style={styles.gasEstimateContainer}>
            <Text style={styles.gasEstimateText}>
              Estimated gas: {gasEstimate}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => setShowRecent(!showRecent)}
          >
            <FontAwesome name="history" size={16} color="#2ECC71" />
            <Text style={styles.secondaryButtonText}>Recent</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sendButton,
              isLoading && styles.disabledButton
            ]}
            onPress={handleSend}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#2ECC71" />
            ) : (
              <Text style={styles.sendButtonText}>
                SEND {selectedTokenAddress === 'RBTC' ? 'RBTC' : 'TOKEN'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40, // Same width as back button for centering
  },
  content: {
    flex: 1,
    padding: 24,
  },
  titleContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF5252',
    marginTop: 16,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  successText: {
    color: '#2ECC71',
    marginTop: 16,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    color: 'white',
    width: '100%',
  },
  input: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'monospace',
    flex: 1,
    padding: 8,
  },
  inputLabel: {
    color: '#A0A0A0',
    fontFamily: 'monospace',
    marginLeft: 16,
  },
  recipientInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactsButton: {
    padding: 8,
  },
  listContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    maxHeight: 200,
  },
  listTitle: {
    color: '#2ECC71',
    fontFamily: 'monospace',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  flatList: {
    maxHeight: 150,
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  listItemText: {
    color: 'white',
    fontFamily: 'monospace',
  },
  listItemSubtext: {
    color: '#A0A0A0',
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 4,
  },
  gasEstimateContainer: {
    width: '100%',
    padding: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    marginBottom: 16,
  },
  gasEstimateText: {
    color: '#A0A0A0',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 24,
    marginBottom: 40,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2ECC71',
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#2ECC71',
    fontFamily: 'monospace',
  },
  sendButton: {
    backgroundColor: '#2ECC71',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});