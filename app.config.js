// app.config.js
export default ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    package: 'com.smartdevx.rskvault',
  },
  extra: {
    ...(config.extra || {}),
    rpcUrls: {
      rskMainnet: process.env.RSK_RPC_MAINNET || 'https://public-node.rsk.co',
      rskTestnet: process.env.RSK_RPC_TESTNET || 'https://public-node.testnet.rsk.co',
    },
    walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID,
    eas: {
      projectId: '2e456fc1-842b-4259-95de-054f61c7c7dd',
    },
  },
});
