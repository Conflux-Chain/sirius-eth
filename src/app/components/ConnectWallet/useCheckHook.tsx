import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { useNotifications } from '@cfxjs/react-ui';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { usePortal } from 'utils/hooks/usePortal';
import { NETWORK_ID, NETWORK_TYPE, NETWORK_TYPES } from 'utils/constants';
import XCircleFill from '@zeit-ui/react-icons/xCircleFill';

interface Props {
  showNotification?: boolean;
}

export const useCheckHook = function <Props>(showNotification = false) {
  const { t } = useTranslation();
  const { connected, accounts, chainId } = usePortal();
  const [, setNotifications] = useNotifications();

  const checkNetworkValid = () => {
    // TODO, open annotation before hardfork
    return true;
    // if (chainId !== undefined) {
    //   if (Number(chainId) === NETWORK_ID) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // } else {
    //   return true;
    // }
  };

  const checkAddressValid = () => {
    if (connected === 1) {
      return SDK.address.isValidHexAddress(accounts[0]);
    }
    return true;
  };

  const notifyNetworkError = () => {
    let content = '';

    if (NETWORK_TYPE === NETWORK_TYPES.testnet) {
      content = t(translations.connectWallet.modal.switchToTestnet);
    } else if (NETWORK_TYPE === NETWORK_TYPES.mainnet) {
      content = t(translations.connectWallet.modal.switchToMainnet);
    } else {
      content = t(translations.connectWallet.modal.switchToScanNetwork, {
        networkID: NETWORK_ID,
      });
    }

    setNotifications({
      icon: <XCircleFill color="#e15c56" />,
      title: t(translations.connectWallet.modal.networkNotice),
      content,
      delay: 5000,
    });
  };

  const notifyAddressError = () => {
    setNotifications({
      icon: <XCircleFill color="#e15c56" />,
      title: t(translations.connectWallet.modal.addressNotice),
      content: t(translations.connectWallet.modal.upgradeTipAddress),
      delay: 5000,
    });
  };

  const [isNetworkValid, setIsNetworkValid] = useState(checkNetworkValid);
  const [isAddressValid, setIsAddressValid] = useState(checkAddressValid);

  useEffect(() => {
    const isNetworkValid = checkNetworkValid();
    const isAddressValid = checkAddressValid();

    if (showNotification) {
      if (connected === 1 && !isAddressValid) {
        notifyAddressError();
      }

      if (connected === 1 && !isNetworkValid) {
        notifyNetworkError();
      }
    }

    // prevent unknonw status update
    if (chainId !== '0xNaN') {
      setIsAddressValid(isAddressValid);
      setIsNetworkValid(isNetworkValid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, chainId]);

  return {
    isNetworkValid,
    isAddressValid,
    isValid: isNetworkValid && isAddressValid,
    notifyAddressError,
    notifyNetworkError,
  };
};
