import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface ImportWalletButtonProps {
  navigateTo: string;
}

export const ImportWalletButton: React.FC<ImportWalletButtonProps> = ({ navigateTo }) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => navigation.navigate(navigateTo)}
        style={styles.button}
      >
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <Text style={styles.buttonText}>Import Wallet</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  button: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#121212',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});