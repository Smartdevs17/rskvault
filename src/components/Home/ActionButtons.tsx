// src/components/Home/ActionButtons.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/AppRoutes';

type ActionButtonsNavigationProp = StackNavigationProp<RootStackParamList>;

export const ActionButtons = () => {
  const navigation = useNavigation<ActionButtonsNavigationProp>();

  const handleReceivePress = () => {
    navigation.navigate('Receive');
  };

  const handleSendPress = () => {
    navigation.navigate('Send');
  };

  return (
    <View style={styles.container}>
      {/* Receive Button */}
      <TouchableOpacity 
        style={[styles.button, styles.receiveButton]}
        onPress={handleReceivePress}
      >
        <View style={styles.buttonContent}>
          <MaterialIcons name="arrow-downward" size={30} color="black" />
          <Text style={styles.buttonText}>Receive</Text>
        </View>
      </TouchableOpacity>

      {/* Send Button */}
      <TouchableOpacity 
        style={[styles.button, styles.sendButton]}
        onPress={handleSendPress}
      >
        <View style={styles.buttonContent}>
          <MaterialIcons name="arrow-upward" size={30} color="black" />
          <Text style={styles.buttonText}>Send</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiveButton: {
    backgroundColor: '#FFD700', // Yellow-500 equivalent
  },
  sendButton: {
    backgroundColor: '#A0A0A0', // Gray-500 equivalent
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});