import ENV_CONFIG from 'env';
import { NETWORK_ID } from './constants';
import { switchChain as _switchChain } from '@cfx-kit/react-utils/dist/AccountManage';

export const switchChain = () => {
  return _switchChain(`${NETWORK_ID}`, {
    addChainParams: ENV_CONFIG.ENV_WALLET_CONFIG
      ? {
          ...ENV_CONFIG.ENV_WALLET_CONFIG,
          chainId: `${NETWORK_ID}`,
        }
      : undefined,
  });
};
