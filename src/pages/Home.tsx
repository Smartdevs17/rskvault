import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from "../components/Header/Header";
import { ActionButtons } from "../components/Home/ActionButtons";
import { TokenList } from "../components/Home/TokenList";
import { WalletBalance } from "../components/Home/WalletBalance";
import { Layout } from "../components/Layout/Layout";
import { useNetwork } from "../contexts/NetworkProvider";
import { useToken } from "../contexts/Token";
import { useReceive } from "../contexts/Receive";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../routes/RootstockRoutes';

export const Home: React.FC = () => {
  const { networkModal } = useNetwork();
  const { newTokenModal, selectedToken } = useToken();
  const { receiveModal, sendModal } = useReceive();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();



  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.balanceSection}>
          <WalletBalance />
        </View>
        
        <View style={styles.actionsSection}>
          <ActionButtons />
        </View>
        
        <View style={styles.tokensSection}>
          <TokenList />
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  balanceSection: {
    marginBottom: 24,
  },
  actionsSection: {
    marginBottom: 32,
  },
  tokensSection: {
    flex: 1,
  },
});