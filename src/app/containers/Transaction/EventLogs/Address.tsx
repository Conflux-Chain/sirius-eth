import React from 'react';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { formatAddress } from 'utils';
import { ContractDetail } from 'app/components/TxnComponents/ContractDetail';
import { convertCheckSum } from '@cfxjs/sirius-next-common/dist/utils/address';

export const Address = ({ address, contract }) => {
  const hex = convertCheckSum(formatAddress(address));
  return (
    <>
      <Link href={`/address/${hex}`}>{hex}</Link>
      <ContractDetail info={contract} />
    </>
  );
};
