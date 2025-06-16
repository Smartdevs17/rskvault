// src/utils/database.ts
import * as SQLite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';
import { encryptData, decryptData } from '../encryption/keyDerivation';

const DB_NAME = 'rskvault.db';
const STORE_NAME = 'vault';
const KEY_ID = 'data';

// Modern expo-sqlite API
const db = SQLite.openDatabaseSync(DB_NAME);

// Ensure table exists (run once at startup)
const ensureTable = () => {
  db.execSync(
    `CREATE TABLE IF NOT EXISTS ${STORE_NAME} (id TEXT PRIMARY KEY NOT NULL, value TEXT);`
  );
};

ensureTable();

export const saveSeedPhrase = async (
  seedPhrase: string,
  password: string
): Promise<void> => {
  try {
    const encrypted = await encryptData(seedPhrase, password);
    
    db.runSync(
      `INSERT OR REPLACE INTO ${STORE_NAME} (id, value) VALUES (?, ?);`,
      [KEY_ID, encrypted]
    );
    
    await SecureStore.setItemAsync(KEY_ID, encrypted);
  } catch (error) {
    console.error('Failed to save seed phrase:', error);
    throw new Error('Failed to securely store seed phrase');
  }
};

export const getSeedPhrase = async (
  password: string
): Promise<string | null> => {
  try {
    let encrypted: string | null = null;
    
    const result = db.getFirstSync(
      `SELECT value FROM ${STORE_NAME} WHERE id = ?;`,
      [KEY_ID]
    ) as { value: string } | null;
    
    if (result) {
      encrypted = result.value;
    }

    if (!encrypted) {
      encrypted = await SecureStore.getItemAsync(KEY_ID);
      if (!encrypted) return null;
    }

    const decrypted = await decryptData(encrypted, password);
    return decrypted;
  } catch (error) {
    console.error('Failed to retrieve seed phrase:', error);
    throw new Error('Invalid password or corrupted data');
  }
};

export const deleteSeedPhrase = async (): Promise<void> => {
  try {
    db.runSync(
      `DELETE FROM ${STORE_NAME} WHERE id = ?;`,
      [KEY_ID]
    );
    
    await SecureStore.deleteItemAsync(KEY_ID);
  } catch (error) {
    console.error('Failed to delete seed phrase:', error);
    throw new Error('Failed to securely remove seed phrase');
  }
};

export const migrateFromIndexedDB = async (password: string): Promise<void> => {
  // Implementation with proper typing would go here
};