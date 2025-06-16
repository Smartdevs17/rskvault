import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SeedPhrasesContainer } from '../components/UI/Auth/SeedPhrasesContainer';

export const NewWalletScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleWalletCreation = () => {
    // Logic for wallet creation
    // After wallet is created and address/seedPhrase are set
    navigation.navigate('NewPassword');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Wallet</Text>
      <SeedPhrasesContainer />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleWalletCreation}
      >
        <Text style={styles.createText}>Create Wallet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    marginVertical: 20,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF8D00',
    borderRadius: 8,
  },
  backText: {
    color: '#121212',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  createButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  createText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});