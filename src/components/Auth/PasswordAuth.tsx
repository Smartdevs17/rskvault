import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Keyboard } from 'react-native';
import { Modal } from "../UI/Modal";
import { maskAddress } from "../../utils/maskAddress";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from "../../contexts/AuthContext";
import { getSeedPhrase } from "../../utils/storage/database";
import { Layout } from "../Layout/Layout";

export const PasswordAuth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    password,
    setPassword,
    setIsPasswordSet,
    currentUser,
    setIsAuthenticated,
    setCurrentUser,
    error,
    setError,
  } = useAuth();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
    Keyboard.dismiss();
  };

  const handleSetPassword = async () => {
    try {
      const seedPhrase = await getSeedPhrase(password);
      if (seedPhrase) {
        setIsPasswordSet(true);
        setIsAuthenticated(true);
        setCurrentUser({ 
          ...currentUser, 
          password, 
          seedPhrase, 
          address: currentUser?.address ?? "" // Ensure address is always a string
        });
        setError("");
      } else {
        setIsPasswordSet(false);
        setError("Invalid password");
      }
    } catch (error) {
      setError("Invalid password");
      console.error("Authentication error:", error);
    }
  };

  return (
    <Layout>
      <Modal onClose={() => {}}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={require('../../../assets/avatar.png')}
              style={styles.avatar}
            />
            <Text style={styles.address}>
              {maskAddress(currentUser?.address ?? "")}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showPassword}
              placeholder="Enter Password"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={handleSetPassword}
            />
            <TouchableOpacity onPress={handleShowPassword} style={styles.eyeButton}>
              <Icon 
                name={showPassword ? 'eye-slash' : 'eye'} 
                size={24} 
                color="#9CA3AF" 
              />
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, password.length < 8 && styles.disabledButton]}
            onPress={handleSetPassword}
            disabled={password.length < 8}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 20,
  },
  address: {
    color: '#9CA3AF',
    fontSize: 18,
    fontFamily: 'monospace',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingBottom: 12,
    marginVertical: 20,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontFamily: 'monospace',
    padding: 8,
    textAlign: 'center',
  },
  eyeButton: {
    padding: 8,
  },
  errorContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#FF8D00',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#4B5563',
    opacity: 0.5,
  },
  buttonText: {
    color: '#121212',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
});