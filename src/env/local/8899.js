export const ENV_NETWORK_ID = 1030;
export const ENV_NETWORK_TYPE = 'EVM_MAINNET';
export const ENV_API_HOST_PREFIX = 'evmapi';
export const ENV_CORE_API_HOST_PREFIX = 'api';
export const ENV_CORE_HOST_PREFIX = 'www';
export const ENV_RPC_SERVER = 'https://net8889eth-cfxbridge.confluxrpc.com';
export const ENV_WALLET_CONFIG = {
  chainId: ENV_NETWORK_ID,
  chainName: 'Conflux eSpace',
  rpcUrls: ['https://evm.confluxrpc.com'],
  blockExplorerUrls: ['https://evm.confluxscan.io/'],
  nativeCurrency: {
    name: 'Conflux',
    symbol: 'CFX',
    decimals: 18,
  },
};
