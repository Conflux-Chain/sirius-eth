import { API_HOST_MAP, DOMAIN, IS_STAGE } from 'env/env-constants';
import { NETWORK_TYPES, CHAIN_TYPES } from 'env/types';
import logo from 'images/espace/logo-testnet.svg';
export { default as ENV_LOCALES_EN } from '@cfxjs/sirius-next-i18n/evm/espace/en/translation.json';
export { default as ENV_LOCALES_CN } from '@cfxjs/sirius-next-i18n/evm/espace/zh_cn/translation.json';
export const ENV_NETWORK_ID = 71;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.EVM;
export const ENV_CHAIN_TYPE = CHAIN_TYPES.TESTNET;
export const ENV_OPEN_API_HOST =
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
export const ENV_RPC_SERVER =
  API_HOST_MAP.rpcHost || 'https://evmtestnet-cfxbridge.confluxrpc.com';
export const ENV_EVM_RPC_SERVER =
  API_HOST_MAP.evmRPCHost || 'https://evmtestnet.confluxrpc.com';
export const ENV_WALLET_CONFIG = {
  chainId: ENV_NETWORK_ID,
  chainName: 'eSpace Testnet',
  rpcUrls: [ENV_EVM_RPC_SERVER],
  blockExplorerUrls: ['https://evmtestnet.confluxscan.org/'],
  nativeCurrency: {
    name: 'Conflux',
    symbol: 'CFX',
    decimals: 18,
  },
};
export const ENV_LOGO = logo;
