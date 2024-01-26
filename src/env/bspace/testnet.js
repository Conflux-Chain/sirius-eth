export const ENV_NETWORK_ID = 71;
export const ENV_SCAN_URL = '//evmtestnet-stage.confluxscan.net';
export const ENV_NETWORK_TYPE = 'BTC_TESTNET';
export const ENV_API_HOST_PREFIX = 'evmapi-testnet';
export const ENV_CORE_API_HOST_PREFIX = 'api-testnet';
export const ENV_CORE_HOST_PREFIX = 'testnet';
export const ENV_RPC_SERVER = 'https://evmtestnet-cfxbridge.confluxrpc.com';
export const ENV_WALLET_CONFIG = {
  chainId: ENV_NETWORK_ID,
  chainName: 'eSpace Testnet',
  rpcUrls: ['https://evmtestnet.confluxrpc.com'],
  blockExplorerUrls: ['https://evmtestnet.confluxscan.io/'],
  nativeCurrency: {
    name: 'Conflux',
    symbol: 'CFX',
    decimals: 18,
  },
};
