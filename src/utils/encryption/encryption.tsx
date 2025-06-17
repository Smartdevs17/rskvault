// src/utils/crypto.ts
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'react-native-crypto-js';

// Encryption/Decryption
export const encrypt = async (password: string, seedPhrase: string): Promise<string> => {
  try {
    const encrypted = CryptoJS.AES.encrypt(seedPhrase, password).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt seed phrase');
  }
};

export const decrypt = async (password: string, encrypted: string): Promise<string> => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);
    if (!decrypted) throw new Error('Decryption failed - possibly wrong password');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt seed phrase');
  }
};

// Password Hashing
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hash = CryptoJS.SHA256(password).toString();
    return hash;
  } catch (error) {
    console.error('Hashing failed:', error);
    throw new Error('Failed to hash password');
  }
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    const newHash = await hashPassword(password);
    return newHash === hash;
  } catch (error) {
    console.error('Verification failed:', error);
    return false;
  }
};

// Secure Storage Helpers
export const storeEncryptedSeed = async (key: string, encryptedSeed: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, encryptedSeed);
  } catch (error) {
    console.error('Secure storage failed:', error);
    throw new Error('Failed to store seed phrase securely');
  }
};

export const getEncryptedSeed = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error('Secure retrieval failed:', error);
    return null;
  }
};

export const generateRandomBytes = async (byteCount: number = 32): Promise<string> => {
  try {
    const randomBytes = await Crypto.getRandomBytesAsync(byteCount);
    return randomBytes.toString();
  } catch (error) {
    console.error('Random bytes generation failed:', error);
    throw new Error('Failed to generate secure random bytes');
  }
};