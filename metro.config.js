const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add polyfills for Node.js modules
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'node:crypto': require.resolve('react-native-crypto-js'),
  'crypto': require.resolve('react-native-crypto-js'),
  'stream': require.resolve('stream-browserify'),
  'buffer': require.resolve('buffer'),
  'events': require.resolve('events'),
  'util': require.resolve('util'),
  'url': require.resolve('url'),
  'querystring': require.resolve('querystring-es3'),
};

// Add alias mapping
config.resolver.alias = {
  ...config.resolver.alias,
  'node:crypto': 'react-native-crypto-js',
  'crypto': 'react-native-crypto-js',
};

module.exports = config;