import { API_HOST_MAP, DOMAIN, IS_STAGE } from 'env/env-constants';
import { NETWORK_TYPES, CHAIN_TYPES } from 'env/types';
import logo from 'images/espace/logo.svg';
export { default as ENV_LOCALES_EN } from '@cfxjs/sirius-next-i18n/evm/espace/en/translation.json';
export { default as ENV_LOCALES_CN } from '@cfxjs/sirius-next-i18n/evm/espace/zh_cn/translation.json';
export const ENV_NETWORK_ID = 1030;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.EVM;
export const ENV_CHAIN_TYPE = CHAIN_TYPES.MAINNET;
export const ENV_OPEN_API_HOST =
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
export const ENV_RPC_SERVER =
  API_HOST_MAP.rpcHost || 'https://evm-cfxbridge.confluxrpc.com';
export const ENV_EVM_RPC_SERVER =
  API_HOST_MAP.evmRPCHost || 'https://evm.confluxrpc.com';
export const ENV_WALLET_CONFIG = {
  chainId: ENV_NETWORK_ID,
  chainName: 'Conflux eSpace',
  rpcUrls: [ENV_EVM_RPC_SERVER],
  blockExplorerUrls: ['https://evm.confluxscan.org/'],
  nativeCurrency: {
    name: 'Conflux',
    symbol: 'CFX',
    decimals: 18,
  },
};
export const ENV_LOGO = logo;
