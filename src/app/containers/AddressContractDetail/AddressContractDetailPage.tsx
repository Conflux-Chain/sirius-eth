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
import { isAccountAddress, isAddress, isZeroAddress } from '../../../utils';
import styled from 'styled-components';
import { StyledCard as Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { Spin } from '@cfxjs/sirius-next-common/dist/components/Spin';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { convertCheckSum } from '@cfxjs/sirius-next-common/dist/utils/address';

interface RouteParams {
  address: string;
}

export const AddressContractDetailPage = () => {
  const { t } = useTranslation();
  const { address: addressParams } = useParams<RouteParams>();
  const address = convertCheckSum(addressParams);
  const history = useHistory();
  const [isAccount, setIsAccount] = useState<null | boolean>(() => {
    return isZeroAddress(address) ? true : null;
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
          setIsAccount(await isAccountAddress(address));
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

  if (isAccount === null) {
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

  return isAccount ? <AddressDetailPage /> : <ContractDetailPage />;
};

const StyledWrapper = styled.div`
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
