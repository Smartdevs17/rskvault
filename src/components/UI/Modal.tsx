// src/components/UI/Modal.tsx
import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Modal as RNModal } from 'react-native';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  visible?: boolean;
}

export const Modal = ({ children, onClose, visible = true }: ModalProps) => {
  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark overlay
    padding: 20,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#121212', // Dark background
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2ECC71', // Rootstock green border
  },
});