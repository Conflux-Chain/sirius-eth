import { IS_DEV } from 'env/env-constants';
import { NETWORK_TYPES } from 'env/types';
import logo from 'images/espace/logo.svg';

export const ENV_NETWORK_ID = 8889;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.EVM_DEVNET;
export const ENV_API_HOST = IS_DEV
  ? 'net8889api.confluxscan.net'
  : window.location.host.replace(/eth/, 'api');
export const ENV_CORE_API_HOST = IS_DEV
  ? 'net8889api.confluxscan.net'
  : window.location.host.replace(/eth/, 'api');
export const ENV_RPC_SERVER = 'https://net8889eth-cfxbridge.confluxrpc.com';
export const ENV_CORE_SCAN_HOST = 'www.confluxscan.net';
export const ENV_WALLET_CONFIG = {
  chainId: ENV_NETWORK_ID,
  chainName: 'eSpace Devnet',
  rpcUrls: ['https://net8889eth-cfxbridge.confluxrpc.com'],
  blockExplorerUrls: ['https://net8889eth.confluxscan.net/'],
  nativeCurrency: {
    name: 'Conflux',
    symbol: 'CFX',
    decimals: 18,
  },
};
export const ENV_LOGO = logo;
export const ENV_THEME = {
  primary: '#17B38A',
  searchButtonBg: '#AFE9D2',
  searchButtonHoverBg: '#17B38A',
  gasPriceLineBg: '#F0F4F3',
  footerBg: '#05343F',
  footerHighLightColor: '#AFE9D2',
};
