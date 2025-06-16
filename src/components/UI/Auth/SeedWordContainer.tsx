import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useWalletAuth } from "../../../contexts/WalletAuth";

interface SeedWordContainerProps {
  word: string;
  index: number;
}

export const SeedWordContainer: React.FC<SeedWordContainerProps> = ({
  word,
  index,
}) => {
  const { showSeedPhrase } = useWalletAuth();

  if (showSeedPhrase) {
    return (
      <View style={styles.container}>
        <Text style={styles.indexText}>{index}</Text>
        <Text style={styles.wordText} numberOfLines={1}>
          {word}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.indexText}>{index}</Text>
        <Text style={styles.wordText} numberOfLines={1}>
          ••••••
        </Text>
      </View>
      {Platform.OS === 'ios' ? (
        <BlurView
          style={styles.blurOverlay}
          intensity={50}
          tint="light"
        />
      ) : (
        <View style={[styles.blurOverlay, { backgroundColor: 'rgba(255,255,255,0.7)' }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    minWidth: 120,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    zIndex: 2,
  },
  indexText: {
    color: '#6B7280',
    fontSize: 12,
    marginRight: 8,
    fontFamily: 'Inter-Medium',
  },
  wordText: {
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
});