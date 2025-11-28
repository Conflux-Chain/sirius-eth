import { NETWORK_ID } from 'utils/constants';
import {
  connect,
  useAccount,
  useChainId,
  useBalance,
  sendTransaction,
  useRegisteredWallets,
  createPrioritySorter,
} from '@cfx-kit/react-utils/dist/AccountManage';
import { useState } from 'react';

export enum AuthConnectStatus {
  Connected = 'connected',
  NotConnected = 'not-connected',
  NotChainMatch = 'not-chainMatch',
}

const prioritySorter = createPrioritySorter([
  'Fluent',
  'MetaMask',
  'WalletConnect',
]);

export const usePortal = () => {
  const [walletConnectingMap, setWalletConnectingMap] = useState({});
  const account = useAccount();
  const chainId = useChainId();
  const wallets = useRegisteredWallets(prioritySorter);

  const isChainMatch = chainId && Number(chainId) === NETWORK_ID;

  const authConnectStatus = account
    ? isChainMatch
      ? AuthConnectStatus.Connected
      : AuthConnectStatus.NotChainMatch
    : AuthConnectStatus.NotConnected;

  const login = (walletName: string) => {
    if (!walletConnectingMap[walletName]) {
      setWalletConnectingMap(prev => ({
        ...prev,
        [walletName]: true,
      }));
      return connect(walletName).finally(() => {
        setWalletConnectingMap(prev => ({
          ...prev,
          [walletName]: false,
        }));
      });
    }
    return Promise.reject('wallet is connecting');
  };

  return {
    authConnectStatus,
    walletConnectingMap,
    account: account ? account : undefined,
    wallets,
    chainId, // hex value, 0xNaN mean changing network
    login,
    useBalance,
    sendTransaction,
  };
};
