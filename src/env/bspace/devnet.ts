import { API_HOST_MAP, IS_DEV } from 'env/env-constants';
import { NETWORK_TYPES, CHAIN_TYPES } from 'env/types';
import logo from 'images/bspace/logo.svg';
export * from './base';
export { default as ENV_LOCALES_EN } from '@cfxjs/sirius-next-i18n/evm/bspace/en/translation.json';
export { default as ENV_LOCALES_CN } from '@cfxjs/sirius-next-i18n/evm/bspace/zh_cn/translation.json';

export const ENV_NETWORK_ID = 1030;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.BTC;
export const ENV_CHAIN_TYPE = CHAIN_TYPES.DEVNET;
export const ENV_API_HOST =
  API_HOST_MAP.openAPIHost ||
  (IS_DEV
    ? 'https://net8890api.confluxscan.net'
    : window.location.origin.replace(/btc/, 'api'));
export const ENV_CORE_API_HOST =
  API_HOST_MAP.secondaryOpenAPIHost ||
  (IS_DEV
    ? 'https://net8890api.confluxscan.net'
    : window.location.origin.replace(/btc/, 'api'));
export const ENV_CORE_SCAN_HOST =
  API_HOST_MAP.secondaryBackendAPIHost || 'https://www.confluxscan.net';
// TODO-btc
export const ENV_RPC_SERVER =
  API_HOST_MAP.rpcHost || 'https://net8889eth-cfxbridge.confluxrpc.com';
export const ENV_WALLET_CONFIG = {
  chainId: ENV_NETWORK_ID,
  chainName: 'Conflux bSpace',
  // TODO-btc
  rpcUrls: ['https://net8889eth-cfxbridge.confluxrpc.com'],
  blockExplorerUrls: ['https://net8890btc.confluxscan.net'],
  // TODO-btc
  nativeCurrency: {
    name: 'Conflux',
    symbol: 'CFX',
    decimals: 18,
  },
};
export const ENV_LOGO = logo;
