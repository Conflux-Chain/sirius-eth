import { DOMAIN, IS_STAGE } from 'env/env-constants';
import { NETWORK_TYPES } from 'env/types';
import logo from 'images/espace/logo-testnet.svg';
export * from './base';
export { default as ENV_LOCALES_EN } from 'sirius-next/packages/i18n/evm/espace/en/translation.json';
export { default as ENV_LOCALES_CN } from 'sirius-next/packages/i18n/evm/espace/zh_cn/translation.json';
export const ENV_NETWORK_ID = 71;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.EVM_TESTNET;
export const ENV_API_HOST = IS_STAGE
  ? `evmapi-testnet-stage.confluxscan${DOMAIN}`
  : `evmapi-testnet.confluxscan${DOMAIN}`;
export const ENV_CORE_API_HOST = IS_STAGE
  ? `api-testnet-stage.confluxscan${DOMAIN}`
  : `api-testnet.confluxscan${DOMAIN}`;
export const ENV_CORE_SCAN_HOST = IS_STAGE
  ? `testnet-stage.confluxscan${DOMAIN}`
  : `testnet.confluxscan${DOMAIN}`;
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
export const ENV_LOGO = logo;
