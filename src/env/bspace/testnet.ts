import { API_HOST_MAP, DOMAIN, IS_STAGE } from 'env/env-constants';
import { NETWORK_TYPES } from 'env/types';
import logo from 'images/bspace/logo-testnet.svg';
export * from './base';
export { default as ENV_LOCALES_EN } from '@cfxjs/sirius-next-i18n/evm/bspace/en/translation.json';
export { default as ENV_LOCALES_CN } from '@cfxjs/sirius-next-i18n/evm/bspace/zh_cn/translation.json';

// TODO-btc
export const ENV_NETWORK_ID = 71;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.BTC_TESTNET;
// TODO-btc
export const ENV_API_HOST =
  API_HOST_MAP.openAPIHost ||
  (IS_STAGE
    ? `https://evmapi-testnet-stage.confluxscan${DOMAIN}`
    : `https://evmapi-testnet.confluxscan${DOMAIN}`);
export const ENV_CORE_API_HOST =
  API_HOST_MAP.secondaryOpenAPIHost ||
  (IS_STAGE
    ? `https://api-testnet-stage.confluxscan${DOMAIN}`
    : `https://api-testnet.confluxscan${DOMAIN}`);
export const ENV_CORE_SCAN_HOST =
  API_HOST_MAP.secondaryBackendAPIHost ||
  (IS_STAGE
    ? `https://testnet-stage.confluxscan${DOMAIN}`
    : `https://testnet.confluxscan${DOMAIN}`);
// TODO-btc
export const ENV_RPC_SERVER =
  API_HOST_MAP.rpcHost || 'https://evmtestnet-cfxbridge.confluxrpc.com';
// TODO-btc
export const ENV_WALLET_CONFIG = {
  chainId: ENV_NETWORK_ID,
  chainName: 'bSpace Testnet',
  rpcUrls: ['https://evmtestnet.confluxrpc.com'],
  blockExplorerUrls: ['https://btctestnet.confluxscan.io/'],
  nativeCurrency: {
    name: 'Conflux',
    symbol: 'CFX',
    decimals: 18,
  },
};
export const ENV_LOGO = logo;
