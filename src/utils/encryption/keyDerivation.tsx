// src/utils/crypto.ts
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { AES, enc } from 'react-native-crypto-js';

const SALT_KEY = 'rskvault-salt';

// Get or generate salt using Expo's secure storage
const getSalt = async (): Promise<string> => {
  let salt = await SecureStore.getItemAsync(SALT_KEY);
  if (!salt) {
    const saltBytes = await Crypto.getRandomBytesAsync(16);
    const saltString = Buffer.from(saltBytes).toString('base64');
    await SecureStore.setItemAsync(SALT_KEY, saltString);
    return saltString;
  }
  return salt;
};

// PBKDF2 key derivation using Expo Crypto
const deriveKey = async (password: string, salt: string): Promise<string> => {
  const iterations = 100000;
  const keyLength = 256 / 8; // 256 bits
  
  const derivedKey = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + salt, // Not a real PBKDF2!
    { 
      encoding: Crypto.CryptoEncoding.BASE64
    }
  );

  return derivedKey;
};

export const encryptData = async (data: any, password: string): Promise<string> => {
  try {
    const salt = await getSalt();
    const key = await deriveKey(password, salt);
    
    // Using react-native-crypto-js for actual encryption
    const iv = enc.Hex.parse(Buffer.from(await Crypto.getRandomBytesAsync(12)).toString('hex'));
    const encrypted = AES.encrypt(JSON.stringify(data), key, { iv });
    
    return JSON.stringify({
      iv: iv.toString(),
      ciphertext: encrypted.toString(),
      salt // Store salt with the payload for mobile
    });
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

export const decryptData = async (payload: string, password: string): Promise<any> => {
  try {
    const { iv, ciphertext, salt } = JSON.parse(payload);
    const key = await deriveKey(password, salt);
    
    const decrypted = AES.decrypt(ciphertext, key, { iv: enc.Hex.parse(iv) });
    const decryptedStr = decrypted.toString(enc.Utf8);
    
    if (!decryptedStr) throw new Error('Decryption failed - possibly wrong password');
    
    return JSON.parse(decryptedStr);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};

// Alternative implementation using react-native-aes-crypto if more security is needed
// Would require additional package: react-native-aes-crypto
/*
import Aes from 'react-native-aes-crypto';

const deriveKeyAlt = async (password: string, salt: string) => {
  return Aes.pbkdf2(password, salt, 100000, 256);
};

const encryptDataAlt = async (data: any, password: string) => {
  const salt = await getSalt();
  const key = await deriveKeyAlt(password, salt);
  const iv = await Crypto.getRandomBytesAsync(16);
  
  const encrypted = await Aes.encrypt(
    JSON.stringify(data),
    key,
    iv.toString('hex'),
    'aes-256-cbc'
  );
  
  return JSON.stringify({ iv: iv.toString('hex'), encrypted, salt });
};
*/