import * as ESPACE_MAINNET_CONFIG from './espace/mainnet';
import * as ESPACE_TESTNET_CONFIG from './espace/testnet';
import * as ESPACE_DEVNET_CONFIG from './espace/devnet';
import * as BSPACE_MAINNET_CONFIG from './bspace/mainnet';
import * as BSPACE_TESTNET_CONFIG from './bspace/testnet';
import * as BSPACE_DEVNET_CONFIG from './bspace/devnet';
import {
  IS_ESPACE_MAINNET,
  IS_ESPACE_TESTNET,
  IS_ESPACE_DEVNET,
  IS_BSPACE_MAINNET,
  IS_BSPACE_TESTNET,
  IS_BSPACE_DEVNET,
} from './env-constants';

const DEFAULT_NETWORK_CONFIG = ESPACE_MAINNET_CONFIG;

const _ENV_CONFIG = (() => {
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

export * from './env-constants';
export * from './types';
/**
 * This makes it easy to replace strings directly in the script
 * @see `docker/setupEnv.js`
 */
const ENV_CONFIG = _ENV_CONFIG;
export default ENV_CONFIG;
