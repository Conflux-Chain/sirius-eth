import { NETWORK_TYPES } from 'env/types';

export const ENV_NETWORK_ID = 8890;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.BTC_DEVNET;
// TODO-btc
export const ENV_API_HOST = window.location.host.replace(/cfx|eth/, 'api');
// TODO-btc
export const ENV_CORE_API_HOST = window.location.host.replace(/cfx|eth/, 'api');
export const ENV_CORE_SCAN_HOST = 'www.confluxscan.net';
// TODO-btc
export const ENV_RPC_SERVER = 'https://net8889eth-cfxbridge.confluxrpc.com';
// TODO-btc
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
