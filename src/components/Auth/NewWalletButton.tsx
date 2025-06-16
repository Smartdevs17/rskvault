import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface NewWalletButtonProps {
  navigateTo: string;
}

export const NewWalletButton: React.FC<NewWalletButtonProps> = ({ navigateTo }) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate(navigateTo)}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Create New Wallet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  button: {
    backgroundColor: '#FF8D00',
    width: '90%',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF8D00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#121212',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});