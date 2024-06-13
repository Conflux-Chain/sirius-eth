import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';
export const IS_FOREIGN_HOST = /.io$/.test(window.location.host);
export const DOMAIN = IS_FOREIGN_HOST ? '.io' : '.net';

export const IS_ESPACE_DEVNET =
  process.env.REACT_APP_EVM_DEVNET === 'true' ||
  /^net[\d]+eth/.test(window.location.host);
export const IS_ESPACE_TESTNET =
  process.env.REACT_APP_EVM_TESTNET === 'true' ||
  /^evmtestnet[.-]/.test(window.location.hostname);
export const IS_ESPACE_MAINNET =
  process.env.REACT_APP_EVM_MAINNET === 'true' ||
  /^evm[.-]/.test(window.location.hostname);
export const IS_BSPACE_DEVNET =
  process.env.REACT_APP_BTC_DEVNET === 'true' ||
  /^net[\d]+btc/.test(window.location.host);
export const IS_BSPACE_TESTNET =
  process.env.REACT_APP_BTC_TESTNET === 'true' ||
  /^btctestnet[.-]/.test(window.location.hostname);
export const IS_BSPACE_MAINNET =
  process.env.REACT_APP_BTC_MAINNET === 'true' ||
  /^btc[.-]/.test(window.location.hostname);
export const IS_ZSPACE_DEVNET =
  process.env.REACT_APP_ZG_DEVNET === 'true' ||
  /54.183.138.255/.test(window.location.host);
export const IS_ZSPACE_TESTNET =
  process.env.REACT_APP_ZG_TESTNET === 'true' ||
  /^zgtestnet[.-]/.test(window.location.hostname);
export const IS_ZSPACE_MAINNET =
  process.env.REACT_APP_ZG_MAINNET === 'true' ||
  /^zg[.-]/.test(window.location.hostname);

export const IS_ZSPACE =
  IS_ESPACE_MAINNET || IS_ESPACE_TESTNET || IS_ESPACE_DEVNET;
export const IS_ESPACE =
  IS_ESPACE_MAINNET || IS_ESPACE_TESTNET || IS_ESPACE_DEVNET;
export const IS_BSPACE =
  IS_BSPACE_MAINNET || IS_BSPACE_TESTNET || IS_BSPACE_DEVNET;
export const IS_MAINNET =
  IS_ZSPACE_MAINNET || IS_ESPACE_MAINNET || IS_BSPACE_MAINNET;
export const IS_TESTNET =
  IS_ZSPACE_TESTNET || IS_ESPACE_TESTNET || IS_BSPACE_TESTNET;
export const IS_DEVNET =
  IS_ZSPACE_DEVNET || IS_ESPACE_DEVNET || IS_BSPACE_DEVNET;
// only for dev and qa, use with caution
export const IS_STAGE = process.env.REACT_APP_DEV === 'true';
export const IS_DEV = process.env.NODE_ENV === 'development';

export const STAGE_FLAG = IS_STAGE ? '-stage' : '';

export const API_HOST_MAP: {
  rpcHost?: string;
  openAPIHost?: string;
  secondaryOpenAPIHost?: string;
  secondaryBackendAPIHost?: string;
} = (() => {
  try {
    const apis = localStorage.getItem(LOCALSTORAGE_KEYS_MAP.apis) ?? '';
    return JSON.parse(apis);
  } catch (error) {
    return {};
  }
})();
