import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Clipboard, ScrollView } from 'react-native';
import { SeedWordContainer } from "./SeedWordContainer";
import { useWalletAuth } from "../../../contexts/WalletAuth";
import { generateWallet } from "../../../utils/wallet/generateWallet";

export const SeedPhrasesContainer: React.FC = () => {
  const { seedPhrase, setSeedPhrase, error, setError, setAddress, showSeedPhrase, setShowSeedPhrase } = useWalletAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [copySuccess, setCopySuccess] = useState<string>('');

  useEffect(() => {
    const generateSeedPhrase = async () => {
      try {
        setLoading(true);
        const wallet = await generateWallet();
        const phrase = wallet.mnemonic?.phrase.split(" ") || [];
        setSeedPhrase(phrase);
        setAddress(wallet.address);
        setError(null);
      } catch (err) {
        setError("Error generating wallet");
        console.error("Wallet generation error:", err);
      } finally {
        setLoading(false);
      }
    };
    generateSeedPhrase();
  }, []);

  const handleCopyAll = () => {
    if (seedPhrase && showSeedPhrase) {
      const phraseText = seedPhrase.join(" ");
      Clipboard.setString(phraseText);
      setCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
    }
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true} // Show scroll indicator for user feedback
    >
      <View style={styles.container}>
         <Text style={styles.heading}>Write down your 12-word seed phrase</Text>
        <Text style={styles.instructions}>
          This is the only way to recover your wallet. Store it securely and never share it with anyone.
        </Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF8D00" />
            <Text style={styles.loadingText}>Generating secure wallet...</Text>
          </View>
        ) : (
          <View style={styles.cardStack}>
            <View style={styles.seedCard}>
              <View style={styles.gridContainer}>
                {seedPhrase?.map((word: string, index: number) => (
                  <SeedWordContainer key={`word-${index}`} word={word} index={index + 1} />
                ))}
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.hideButton}
                onPress={() => setShowSeedPhrase(!showSeedPhrase)}
              >
                <Text style={styles.hideButtonText}>{showSeedPhrase ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.copyButton,
                  { opacity: !showSeedPhrase ? 0.5 : 1 }
                ]}
                onPress={handleCopyAll}
                disabled={!showSeedPhrase}
              >
                <Text style={styles.copyButtonText}>Copy All</Text>
              </TouchableOpacity>
            </View>
            {copySuccess ? <Text style={styles.copySuccess}>{copySuccess}</Text> : null}
           <View style={styles.acknowledgeContainer}>
              <Text style={styles.acknowledgeText}>
                I acknowledge that I have full control over my wallet, and it cannot be recovered by anyone else, not even RSKVault.
              </Text>
            </View>

          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000000', // Match background to avoid white flashes
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 20, // Ensure padding at the bottom for button visibility
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10, // Add horizontal padding for better spacing
  },
  cardStack: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10, // Add vertical padding for spacing
  },
    heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF8D00',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  seedCard: {
    backgroundColor: '#1A202C',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 600,
    alignItems: 'center',
    minHeight: 100, // Minimum height to ensure card is visible
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#FF8D00',
    fontFamily: 'Inter-Medium',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    width: '90%', // Match seedCard width for consistency
    justifyContent: 'center',
  },
    instructions: {
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    opacity: 0.85,
  },
  hideButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  hideButtonText: {
    color: '#1A202C',
    fontFamily: 'Inter-Medium',
  },
  acknowledgeContainer: {
    marginTop: 24,
    padding: 14,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    width: '90%',
    maxWidth: 600,
  },  acknowledgeText: {
    color: '#B45309',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  copyButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
  },
  copySuccess: {
    marginTop: 10,
    color: '#4CAF50',
    fontFamily: 'Inter-Medium',
  },
  errorContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    width: '90%', // Match other elements
  },
  errorText: {
    color: '#EF4444',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});