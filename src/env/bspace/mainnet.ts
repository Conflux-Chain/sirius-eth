import { API_HOST_MAP, DOMAIN, IS_STAGE } from 'env/env-constants';
import { NETWORK_TYPES, CHAIN_TYPES } from 'env/types';
import logo from 'images/bspace/logo.svg';
export * from './base';
export { default as ENV_LOCALES_EN } from '@cfxjs/sirius-next-i18n/evm/bspace/en/translation.json';
export { default as ENV_LOCALES_CN } from '@cfxjs/sirius-next-i18n/evm/bspace/zh_cn/translation.json';

// TODO-btc
export const ENV_NETWORK_ID = 1030;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.BTC;
export const ENV_CHAIN_TYPE = CHAIN_TYPES.MAINNET;
// TODO-btc
export const ENV_API_HOST =
  API_HOST_MAP.openAPIHost ||
  (IS_STAGE
    ? `https://evmapi-stage.confluxscan${DOMAIN}`
    : `https://evmapi.confluxscan${DOMAIN}`);
export const ENV_CORE_API_HOST =
  API_HOST_MAP.secondaryOpenAPIHost ||
  (IS_STAGE
    ? `https://api-stage.confluxscan${DOMAIN}`
    : `https://api.confluxscan${DOMAIN}`);
export const ENV_CORE_SCAN_HOST =
  API_HOST_MAP.secondaryBackendAPIHost ||
  (IS_STAGE
    ? `https://www-stage.confluxscan${DOMAIN}`
    : `https://www.confluxscan${DOMAIN}`);
// TODO-btc
export const ENV_RPC_SERVER =
  API_HOST_MAP.rpcHost || 'https://evm-cfxbridge.confluxrpc.com';
// TODO-btc
export const ENV_WALLET_CONFIG = {
  chainId: ENV_NETWORK_ID,
  chainName: 'Conflux bSpace',
  rpcUrls: ['https://evm.confluxrpc.com'],
  blockExplorerUrls: ['https://btc.confluxscan.org/'],
  nativeCurrency: {
    name: 'Conflux',
    symbol: 'CFX',
    decimals: 18,
  },
};
export const ENV_LOGO = logo;
