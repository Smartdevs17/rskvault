import React from 'react';
import { Image } from 'react-native';

interface RootstockLogoProps {
  width?: number;
  height?: number;
  style?: any;
}

export const RootstockLogo: React.FC<RootstockLogoProps> = ({ width = 120, height = 40, style }) => (
  <Image
    source={require('../../../assets/rsk-logo.png')}
    style={[{ width, height, resizeMode: 'contain' }, style]}
    accessibilityLabel="Rootstock Logo"
  />
);