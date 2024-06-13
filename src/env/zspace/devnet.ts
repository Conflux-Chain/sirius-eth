import { API_HOST_MAP, IS_DEV } from 'env/env-constants';
import { NETWORK_TYPES } from 'env/types';
import logo from 'images/espace/logo.svg';
export * from './base';
export { default as ENV_LOCALES_EN } from '@cfxjs/sirius-next-i18n/evm/espace/en/translation.json';
export { default as ENV_LOCALES_CN } from '@cfxjs/sirius-next-i18n/evm/espace/zh_cn/translation.json';

export const ENV_NETWORK_ID = 16600;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.ZG_DEVNET;
export const ENV_API_HOST =
  API_HOST_MAP.openAPIHost ||
  (IS_DEV
    ? 'http://54.183.138.255/open'
    : window.location.origin.replace(/eth/, 'api'));
export const ENV_RPC_SERVER =
  API_HOST_MAP.rpcHost || 'http://54.183.138.255/cfx-bridge';
export const ENV_WALLET_CONFIG = {
  chainId: ENV_NETWORK_ID,
  chainName: 'zg scan',
  rpcUrls: ['http://54.183.138.255/cfx-bridge'],
  blockExplorerUrls: ['http://54.183.138.255/'],
  nativeCurrency: {
    name: 'ZG',
    symbol: 'A0GI',
    decimals: 18,
  },
};
export const ENV_LOGO = logo;
export const ENV_ADDRESS = 'hex';
