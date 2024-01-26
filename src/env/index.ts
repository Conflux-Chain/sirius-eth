import * as ESPACE_MAINNET_CONFIG from './espace/mainnet';
import * as ESPACE_TESTNET_CONFIG from './espace/testnet';
import * as BSPACE_MAINNET_CONFIG from './bspace/mainnet';
import * as BSPACE_TESTNET_CONFIG from './bspace/testnet';
import * as LOCAL_8899_CONFIG from './local/8899';

// only for dev and qa, use with caution
export const IS_PRE_RELEASE =
  process.env.REACT_APP_EVM_TESTNET === 'true' ||
  window.location.hostname.includes('stage');

export const IS_LOCAL_PRIVATENET = process.env.REACT_APP_8889 === 'true';

export const IS_ESPACE_TESTNET =
  process.env.REACT_APP_EVM_TESTNET === 'true' ||
  /evmtestnet\./.test(window.location.hostname);
export const IS_ESPACE_MAINNET =
  process.env.REACT_APP_EVM_MAINNET === 'true' ||
  /evm\./.test(window.location.hostname);
export const IS_BSPACE_TESTNET =
  process.env.REACT_APP_BTC_TESTNET === 'true' ||
  /btctestnet\./.test(window.location.hostname);
export const IS_BSPACE_MAINNET =
  process.env.REACT_APP_BTC_MAINNET === 'true' ||
  /btc\./.test(window.location.hostname);

export const IS_ESPACE = IS_ESPACE_MAINNET || IS_ESPACE_TESTNET;
export const IS_BSPACE = IS_BSPACE_MAINNET || IS_BSPACE_TESTNET;
export const IS_MAINNET = IS_ESPACE_MAINNET || IS_BSPACE_MAINNET;
export const IS_TESTNET = IS_ESPACE_TESTNET || IS_BSPACE_TESTNET;

export const IS_FOREIGN_HOST = /.io$/.test(window.location.host);

export const STAGE_FLAG = IS_PRE_RELEASE ? '-stage' : '';

export const DOMAIN = window.location.hostname.includes('.io') ? '.io' : '.net';

const ENV_CONFIG = (() => {
  if (IS_ESPACE_MAINNET) {
    return ESPACE_MAINNET_CONFIG;
  } else if (IS_ESPACE_TESTNET) {
    return ESPACE_TESTNET_CONFIG;
  }
  if (IS_BSPACE_MAINNET) {
    return BSPACE_MAINNET_CONFIG;
  } else if (IS_BSPACE_TESTNET) {
    return BSPACE_TESTNET_CONFIG;
  }
  if (IS_LOCAL_PRIVATENET) {
    return LOCAL_8899_CONFIG;
  }
  throw new Error('Unknown env');
})();

export default ENV_CONFIG;
