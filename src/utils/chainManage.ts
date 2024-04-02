import ENV_CONFIG from 'sirius-next/packages/common/dist/env';
import {
  switchChain as _switchChain,
  addChain as _addChain,
} from '@cfxjs/use-wallet-react/ethereum';
import { NETWORK_ID } from './constants';

export const switchChain = async () => {
  try {
    await _switchChain('0x' + NETWORK_ID.toString(16));
  } catch (error) {
    const switchError = error as { code: number };
    // This error code indicates that the chain has not been added to wallet.
    if (switchError?.code === 4902) {
      await addChain();
    }
  }
};

export const addChain = () => {
  return _addChain(
    {
      ...ENV_CONFIG.ENV_WALLET_CONFIG,
      chainId: '0x' + NETWORK_ID.toString(16),
    },
    false,
  );
};
