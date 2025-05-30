import * as ESPACE_MAINNET_CONFIG from './espace/mainnet';
import * as ESPACE_TESTNET_CONFIG from './espace/testnet';
import * as ESPACE_DEVNET_CONFIG from './espace/devnet';
import { CHAIN_TYPES, NETWORK_TYPES, ENVConfig } from './types';

const DEFAULT_NETWORK_CONFIG = ESPACE_MAINNET_CONFIG;
let isCustom = false;

const ENV_CONFIG: ENVConfig = (() => {
  if (window.customConfig && typeof window.customConfig === 'object') {
    isCustom = true;
    return window.customConfig as ENVConfig;
  }

  const IS_ESPACE_DEVNET =
    process.env.REACT_APP_EVM_DEVNET === 'true' ||
    /^net[\d]+eth/.test(window.location.host);
  const IS_ESPACE_TESTNET =
    process.env.REACT_APP_EVM_TESTNET === 'true' ||
    /^evmtestnet[.-]/.test(window.location.hostname);
  const IS_ESPACE_MAINNET =
    process.env.REACT_APP_EVM_MAINNET === 'true' ||
    /^evm[.-]/.test(window.location.hostname);

  if (IS_ESPACE_MAINNET) {
    return ESPACE_MAINNET_CONFIG;
  } else if (IS_ESPACE_TESTNET) {
    return ESPACE_TESTNET_CONFIG;
  } else if (IS_ESPACE_DEVNET) {
    return ESPACE_DEVNET_CONFIG;
  }
  console.warn('Unknown env');
  isCustom = true;
  return DEFAULT_NETWORK_CONFIG;
})();

if (!ENV_CONFIG.ENV_CORE_API_HOST) {
  ENV_CONFIG.ENV_CORE_API_HOST = ENV_CONFIG.ENV_OPEN_API_HOST;
}
if (!ENV_CONFIG.ENV_CORE_SCAN_HOST) {
  ENV_CONFIG.ENV_CORE_SCAN_HOST = '';
}

export * from './env-constants';
export * from './types';
export const IS_ESPACE = ENV_CONFIG.ENV_NETWORK_TYPE === NETWORK_TYPES.EVM;
export const IS_MAINNET = ENV_CONFIG.ENV_CHAIN_TYPE === CHAIN_TYPES.MAINNET;
export const IS_TESTNET = ENV_CONFIG.ENV_CHAIN_TYPE === CHAIN_TYPES.TESTNET;
export const IS_DEVNET = ENV_CONFIG.ENV_CHAIN_TYPE === CHAIN_TYPES.DEVNET;
export const IS_CUSTOM = isCustom;
export const IS_CONFLUX_FEATURE_ENABLED = !IS_DEVNET && !IS_CUSTOM;
export default ENV_CONFIG;
