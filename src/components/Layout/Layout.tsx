import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Header } from '../Header/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const Layout = ({ children }: LayoutProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* App Header */}
        <Header />
        
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.contentBox}>
            {children}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20, // Reduced from 20
    paddingBottom: 30, // Reduced from 40
    minHeight: screenHeight * 0.7, // Ensure minimum height
  },
  contentBox: {
    width: '100%',
    maxWidth: screenWidth - 32, // Account for horizontal padding
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20, // Reduced from 24
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    alignSelf: 'center',
  },
});