// app.config.js
export default ({ config }) => ({
  ...config,
  extra: {
    rpcUrls: {
      rskMainnet: process.env.RSK_RPC_MAINNET || 'https://public-node.rsk.co',
      rskTestnet: process.env.RSK_RPC_TESTNET || 'https://public-node.testnet.rsk.co',
    },
    walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID // Required
  },
});