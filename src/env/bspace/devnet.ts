import { IS_DEV } from 'env/env-constants';
import { NETWORK_TYPES } from 'env/types';
import logo from 'images/bspace/logo.svg';
export * from './base';
export { default as ENV_LOCALES_EN } from './locales/en/translation.json';
export { default as ENV_LOCALES_CN } from './locales/zh_cn/translation.json';

export const ENV_NETWORK_ID = 1030;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.BTC_DEVNET;
export const ENV_API_HOST = IS_DEV
  ? 'net8890api.confluxscan.net'
  : window.location.host.replace(/btc/, 'api');
export const ENV_CORE_API_HOST = IS_DEV
  ? 'net8890api.confluxscan.net'
  : window.location.host.replace(/btc/, 'api');
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
export const ENV_LOGO = logo;
