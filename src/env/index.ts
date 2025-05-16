import * as ESPACE_MAINNET_CONFIG from './espace/mainnet';
import * as ESPACE_TESTNET_CONFIG from './espace/testnet';
import * as ESPACE_DEVNET_CONFIG from './espace/devnet';
import * as BSPACE_MAINNET_CONFIG from './bspace/mainnet';
import * as BSPACE_TESTNET_CONFIG from './bspace/testnet';
import * as BSPACE_DEVNET_CONFIG from './bspace/devnet';
import { CHAIN_TYPES, NETWORK_TYPES } from './types';

const DEFAULT_NETWORK_CONFIG = ESPACE_MAINNET_CONFIG;

const ENV_CONFIG = (() => {
  if (window.customConfig && typeof window.customConfig === 'object') {
    return window.customConfig as typeof DEFAULT_NETWORK_CONFIG;
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
  const IS_BSPACE_DEVNET =
    process.env.REACT_APP_BTC_DEVNET === 'true' ||
    /^net[\d]+btc/.test(window.location.host);
  const IS_BSPACE_TESTNET =
    process.env.REACT_APP_BTC_TESTNET === 'true' ||
    /^btctestnet[.-]/.test(window.location.hostname);
  const IS_BSPACE_MAINNET =
    process.env.REACT_APP_BTC_MAINNET === 'true' ||
    /^btc[.-]/.test(window.location.hostname);

  if (IS_ESPACE_MAINNET) {
    return ESPACE_MAINNET_CONFIG;
  } else if (IS_ESPACE_TESTNET) {
    return ESPACE_TESTNET_CONFIG;
  } else if (IS_ESPACE_DEVNET) {
    return ESPACE_DEVNET_CONFIG;
  }
  if (IS_BSPACE_MAINNET) {
    return BSPACE_MAINNET_CONFIG;
  } else if (IS_BSPACE_TESTNET) {
    return BSPACE_TESTNET_CONFIG;
  } else if (IS_BSPACE_DEVNET) {
    return BSPACE_DEVNET_CONFIG;
  }
  console.warn('Unknown env');
  return DEFAULT_NETWORK_CONFIG;
})();

export const IS_ESPACE = ENV_CONFIG.ENV_NETWORK_TYPE === NETWORK_TYPES.EVM;
export const IS_BSPACE = ENV_CONFIG.ENV_NETWORK_TYPE === NETWORK_TYPES.BTC;
export const IS_MAINNET = ENV_CONFIG.ENV_CHAIN_TYPE === CHAIN_TYPES.MAINNET;
export const IS_TESTNET = ENV_CONFIG.ENV_CHAIN_TYPE === CHAIN_TYPES.TESTNET;
export const IS_DEVNET = ENV_CONFIG.ENV_CHAIN_TYPE === CHAIN_TYPES.DEVNET;

export * from './env-constants';
export * from './types';
export default ENV_CONFIG;
