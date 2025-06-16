// src/components/Home/NewTokenButton.tsx
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useToken } from '../../contexts/Token';

export const NewTokenButton = () => {
  const { setNewTokenModal } = useToken();

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => setNewTokenModal(true)}
    >
      <Text style={styles.text}>IMPORT NEW TOKEN</Text>
      <MaterialIcons name="add" size={20} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 40,
  },
  text: {
    color: 'white',
    fontFamily: 'monospace',
  },
});