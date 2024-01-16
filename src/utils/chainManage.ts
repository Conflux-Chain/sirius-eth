import { NETWORK_CONFIG } from './constants';
import {
  switchChain as _switchChain,
  addChain as _addChain,
} from '@cfxjs/use-wallet-react/ethereum';

export const switchChain = async () => {
  try {
    await _switchChain('0x' + NETWORK_CONFIG.chainId.toString(16));
  } catch (error) {
    const switchError = error as { code: number };
    // This error code indicates that the chain has not been added to wallet.
    if (switchError?.code === 4902) {
      await addChain();
    }
  }
};

export const addChain = () => {
  return _addChain({
    ...NETWORK_CONFIG,
    chainId: '0x' + NETWORK_CONFIG.chainId.toString(16),
  });
};
