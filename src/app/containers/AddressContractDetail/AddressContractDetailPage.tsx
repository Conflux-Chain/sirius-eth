/* -*- mode: typescript -*- */
/**
 * @fileOverview
 * @name AddressContractDetailPage.tsx
 * @author yqrashawn <namy.19@gmail.com>
 */

import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { AddressDetailPage, ContractDetailPage } from './Loadable';
import { isAddress, isZeroAddress } from '../../../utils';
import styled from 'styled-components';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { Spin } from '@cfxjs/sirius-next-common/dist/components/Spin';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import {
  convertCheckSum,
  getEvmAddressType,
  EvmAddressType,
} from '@cfxjs/sirius-next-common/dist/utils/address';

interface RouteParams {
  address: string;
}

export const AddressContractDetailPage = () => {
  const { t } = useTranslation();
  const { address: addressParams } = useParams<RouteParams>();
  const address = convertCheckSum(addressParams);
  const history = useHistory();
  const [addressType, setAddressType] = useState<EvmAddressType | null>(() => {
    return isZeroAddress(address) ? 'user' : null;
  });
  const [error, setError] = useState(false);

  useEffectOnce(() => {
    if (!isAddress(address)) history.push('/404');
  });

  useEffect(() => {
    async function fn() {
      setError(false);
      try {
        if (isAddress(address)) {
          setAddressType(await getEvmAddressType(address));
        }
      } catch (e) {
        console.log('check address type error: ', e);
        setError(true);
      }
    }

    if (!isZeroAddress(address)) {
      fn();
    }
  }, [address]);

  if (addressType === null) {
    return (
      <Card style={{ marginTop: '20px' }}>
        <StyledWrapper>
          {error ? (
            t(translations.general.errors.getAccountInfoError)
          ) : (
            <Spin />
          )}
        </StyledWrapper>
      </Card>
    );
  }

  return addressType !== 'contract' ? (
    <AddressDetailPage type={addressType} />
  ) : (
    <ContractDetailPage />
  );
};

const StyledWrapper = styled.div`
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
