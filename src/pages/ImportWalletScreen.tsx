import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ethers } from 'ethers';
import { useWalletAuth } from '../contexts/WalletAuth';

export const ImportWalletScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { setSeedPhrase, setAddress, setError, words, setWords } = useWalletAuth();
  const [error, setLocalError] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleWordChange = (text: string, idx: number) => {
    // Clear any existing errors when user starts typing
    if (error) setLocalError(null);
    
    // Handle pasting of complete seed phrase (12 words or more)
    const wordsArray = text.trim().split(/\s+/).filter(word => word.length > 0);
    
    if (wordsArray.length >= 12) {
      // Take only the first 12 words in case more than 12 are pasted
      const first12Words = wordsArray.slice(0, 12);
      setWords(first12Words);
      setLocalError(null);
      // Focus the last input and then blur to show all words are filled
      setTimeout(() => {
        inputRefs.current[11]?.focus();
        inputRefs.current[11]?.blur();
      }, 100);
      return;
    }
    
    // Handle pasting multiple words but less than 12
    if (wordsArray.length > 1 && idx + wordsArray.length <= 12) {
      const updated = [...words];
      wordsArray.forEach((word, i) => {
        if (idx + i < 12) {
          updated[idx + i] = word;
        }
      });
      setWords(updated);
      setLocalError(null);
      // Focus the next empty input or the last filled input
      const nextFocusIndex = Math.min(idx + wordsArray.length, 11);
      setTimeout(() => {
        inputRefs.current[nextFocusIndex]?.focus();
      }, 100);
      return;
    }
    
    // Update current word only (normal typing)
    const updated = [...words];
    updated[idx] = text.replace(/\s/g, '');
    setWords(updated);
    setLocalError(null);
  };

  const handleKeyPress = (key: string, idx: number) => {
    // Move to next input when space is pressed and current word has content
    if (key === ' ' && words[idx].trim() && idx < 11) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleValidate = async () => {
    // Clear any existing errors first
    setLocalError(null);
    setError?.(null);
    
    // Set loading to true and add a small delay to ensure it's visible
    setLoading(true);
    
    // Add a minimum delay to make loading visible
    // await new Promise(resolve => setTimeout(resolve, 10));
    
    try {
      const joinedWords = words.join(' ').trim();
      
      // Additional validation - check if we have exactly 12 words
      if (words.filter(w => w.trim()).length !== 12) {
        throw new Error('Please enter all 12 words');
      }
      
      // Validate the seed phrase
      const wallet = ethers.Wallet.fromPhrase(joinedWords);
      
      if (!wallet || !wallet.address) {
        throw new Error('Invalid seed phrase');
      }
      
      // If validation successful, set the seed phrase and address
      setSeedPhrase?.(words);
      setAddress?.(wallet.address);
      
      // Navigate to next screen
      navigation.navigate('NewPassword');
      
    } catch (err: any) {
      console.error('Seed phrase validation error:', err);
      const errorMessage = err.message || 'Invalid seed phrase';
      setLocalError(errorMessage);
      setError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check if all words are filled
  const allWordsFilled = words.every(w => w.trim().length > 0);
  const canImport = acknowledged && allWordsFilled && !loading;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.warning}>
            I acknowledge that I have full control over my wallet, and it cannot be recovered by anyone else, not even RSKVault.
          </Text>
          <TouchableOpacity
            style={styles.ackCheckbox}
            onPress={() => setAcknowledged(!acknowledged)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, acknowledged && styles.checkboxChecked]}>
              {acknowledged && <Icon name="check" size={14} color="#FF8D00" />}
            </View>
            <Text style={styles.ackText}>I understand and acknowledge</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Import Wallet</Text>
          <Text style={styles.instructions}>
            Enter your 12-word recovery phrase below. Each word goes in its own box.
          </Text>
          <View style={styles.grid}>
            {words.map((word, idx) => (
              <View key={idx} style={styles.wordBox}>
                <Text style={styles.wordIndex}>{idx + 1}</Text>
                <TextInput
                  ref={ref => { inputRefs.current[idx] = ref; }}
                  style={styles.input}
                  value={word}
                  onChangeText={text => handleWordChange(text, idx)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, idx)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType={idx === 11 ? 'done' : 'next'}
                  onSubmitEditing={() => {
                    if (idx < 11) inputRefs.current[idx + 1]?.focus();
                  }}
                  blurOnSubmit={idx === 11}
                  placeholder="word"
                  placeholderTextColor="#888"
                  editable={!loading} // Disable inputs while loading
                />
              </View>
            ))}
          </View>
          
          {/* Show error message */}
          {error && <Text style={styles.error}>{error}</Text>}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.importButton,
                !canImport && styles.disabledButton,
              ]}
              disabled={!canImport}
              onPress={handleValidate}
              activeOpacity={0.7}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#121212" />
                  <Text style={[styles.importButtonText, { marginLeft: 8 }]}>Importing...</Text>
                </View>
              ) : (
                <Text style={styles.importButtonText}>Import Wallet</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={[styles.backButton, loading && styles.disabledButton]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#000',
  },
  container: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  warning: {
    backgroundColor: '#FFF8E1',
    color: '#B45309',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    borderRadius: 8,
    padding: 14,
    marginBottom: 18,
    marginTop: 10,
    width: '100%',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    marginVertical: 12,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    marginBottom: 18,
  },
  wordBox: {
    width: '28%',
    minWidth: 90,
    margin: 4,
    alignItems: 'center',
  },
  wordIndex: {
    color: '#FF8D00',
    fontSize: 12,
    marginBottom: 2,
    fontFamily: 'Inter-Medium',
  },
  input: {
    width: '100%',
    minWidth: 70,
    height: 38,
    backgroundColor: '#1A202C',
    borderRadius: 8,
    paddingHorizontal: 8,
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'left',
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: '#23272F',
  },
  importButton: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#FF8D00',
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    minHeight: 48, // Ensure consistent height
  },
  importButtonText: {
    color: '#121212',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#23272F',
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  backText: {
    color: '#FF8D00',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  error: {
    color: '#EF4444',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 8,
    marginBottom: -8,
    textAlign: 'center',
  },
  ackCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#FF8D00',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8E1',
  },
  checkboxChecked: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FF8D00',
  },
  ackText: {
    color: '#B45309',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});