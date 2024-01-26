export const DOMAIN = window.location.hostname.includes('.io') ? '.io' : '.net';
export const IS_FOREIGN_HOST = /.io$/.test(window.location.host);

export const IS_ESPACE_DEVNET =
  process.env.REACT_APP_EVM_DEVNET === 'true' ||
  /^net[-evm]?\d/.test(window.location.host);
export const IS_ESPACE_TESTNET =
  process.env.REACT_APP_EVM_TESTNET === 'true' ||
  /evmtestnet\./.test(window.location.hostname);
export const IS_ESPACE_MAINNET =
  process.env.REACT_APP_EVM_MAINNET === 'true' ||
  /evm\./.test(window.location.hostname);
export const IS_BSPACE_DEVNET =
  process.env.REACT_APP_EVM_DEVNET === 'true' ||
  /^net-btc\d/.test(window.location.host);
export const IS_BSPACE_TESTNET =
  process.env.REACT_APP_BTC_TESTNET === 'true' ||
  /btctestnet\./.test(window.location.hostname);
export const IS_BSPACE_MAINNET =
  process.env.REACT_APP_BTC_MAINNET === 'true' ||
  /btc\./.test(window.location.hostname);

// only for dev and qa, use with caution
export const IS_STAGE = process.env.REACT_APP_DEV === 'true';
export const IS_ESPACE = IS_ESPACE_MAINNET || IS_ESPACE_TESTNET;
export const IS_BSPACE = IS_BSPACE_MAINNET || IS_BSPACE_TESTNET;
export const IS_MAINNET = IS_ESPACE_MAINNET || IS_BSPACE_MAINNET;
export const IS_TESTNET = IS_ESPACE_TESTNET || IS_BSPACE_TESTNET;

export const STAGE_FLAG = IS_STAGE ? '-stage' : '';
