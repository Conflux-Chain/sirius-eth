import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useDelegatedInfoStore } from 'utils/store';
import { CopyButton } from '@cfxjs/sirius-next-common/dist/components/CopyButton';
import { EVMAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/EVMAddressContainer';

export const DelegatedAddress: React.FC = () => {
  const { t } = useTranslation();
  const {
    delegatedAddress,
    delegatedContractInfo,
    delegatedTokenInfo,
  } = useDelegatedInfoStore();
  if (!delegatedAddress) return null;
  return (
    <>
      <span>{t(translations.authList.delegateTo)}</span>
      <EVMAddressContainer
        value={delegatedAddress}
        alias={delegatedContractInfo?.name || delegatedTokenInfo?.name}
        verify={delegatedContractInfo?.verify?.exactMatch}
        isContract={!!delegatedContractInfo}
      />
      <CopyButton copyText={delegatedAddress} />
    </>
  );
};
