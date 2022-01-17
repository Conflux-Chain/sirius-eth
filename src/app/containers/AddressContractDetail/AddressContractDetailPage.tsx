/* -*- mode: typescript -*- */
/**
 * @fileOverview
 * @name AddressContractDetailPage.tsx
 * @author yqrashawn <namy.19@gmail.com>
 */

import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { AddressDetailPage, ContractDetailPage } from './Loadable';
import { isCurrentNetworkAddress, isAccountAddress } from '../../../utils';
interface RouteParams {
  address: string;
}

export const AddressContractDetailPage = () => {
  const { address } = useParams<RouteParams>();
  const history = useHistory();

  useEffectOnce(() => {
    if (!isCurrentNetworkAddress(address)) history.push('/404');
  });

  return isAccountAddress(address) ? (
    <AddressDetailPage />
  ) : (
    <ContractDetailPage />
  );
};
