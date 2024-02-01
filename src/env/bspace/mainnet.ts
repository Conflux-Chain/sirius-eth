import { DOMAIN, IS_STAGE } from 'env/env-constants';
import { NETWORK_TYPES } from 'env/types';
import logo from 'images/bspace/logo.svg';
export * from './base';

// TODO-btc
export const ENV_NETWORK_ID = 1030;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.BTC_MAINNET;
// TODO-btc
export const ENV_API_HOST = IS_STAGE
  ? `evmapi-stage.confluxscan${DOMAIN}`
  : `evmapi.confluxscan${DOMAIN}`;
export const ENV_CORE_API_HOST = IS_STAGE
  ? `api-stage.confluxscan${DOMAIN}`
  : `api.confluxscan${DOMAIN}`;
export const ENV_CORE_SCAN_HOST = IS_STAGE
  ? `www-stage.confluxscan${DOMAIN}`
  : `www.confluxscan${DOMAIN}`;
// TODO-btc
export const ENV_RPC_SERVER = 'https://evm-cfxbridge.confluxrpc.com';
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
