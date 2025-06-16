import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNetwork } from '../../contexts/NetworkProvider';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export const NetworkModal = ({ setNetworkModal }: { setNetworkModal: (v: boolean) => void }) => {
  const navigation = useNavigation();
  const { 
    networkModal, 
    setNetworkModal: setNetworkModalContext, 
    networks, 
    currentNetwork, 
    setCurrentNetwork 
  } = useNetwork();
  const { setIsAuthenticated, setCurrentUser, setSeedPhrase, setIsAddressSet,  } = useAuth();

  const handleNetworkSelect = (networkId: string) => {
    setCurrentNetwork(networkId);
    setNetworkModal(false);
  };

  const handleDisconnect = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSeedPhrase('');
    setIsAddressSet(false);
    setNetworkModal(false);

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' as never }],
    });
  };

  const renderNetworkItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.networkItem,
        currentNetwork === item.id.toString() && styles.selectedNetwork
      ]}
      onPress={() => handleNetworkSelect(item.id.toString())}
    >
      <MaterialIcons 
        name="public" 
        size={20} 
        color={currentNetwork === item.id.toString() ? '#2ECC71' : '#FFFFFF'} 
      />
      <Text style={[
        styles.networkName,
        currentNetwork === item.id.toString() && styles.selectedNetworkText
      ]}>
        {item.name}
      </Text>
      {currentNetwork === item.id.toString() && (
        <MaterialIcons name="check" size={20} color="#2ECC71" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={networkModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setNetworkModal(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Network</Text>
            <TouchableOpacity
              onPress={() => setNetworkModal(false)}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Network List */}
          <FlatList
            data={networks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderNetworkItem}
            style={styles.networkList}
          />

          {/* Disconnect Button */}
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={handleDisconnect}
          >
            <MaterialIcons name="power-settings-new" size={20} color="#FF4757" />
            <Text style={styles.disconnectText}>Disconnect Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  networkList: {
    maxHeight: 200,
  },
  networkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: '#2A2A2A',
  },
  selectedNetwork: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    borderWidth: 1,
    borderColor: '#2ECC71',
  },
  networkName: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  selectedNetworkText: {
    color: '#2ECC71',
    fontWeight: 'bold',
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 71, 87, 0.2)',
    borderWidth: 1,
    borderColor: '#FF4757',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 20,
  },
  disconnectText: {
    color: '#FF4757',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});