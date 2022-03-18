import React from 'react';
import { Link } from 'app/components/Link/Loadable';
import { formatAddress } from 'utils';
import { ContractDetail } from 'app/components/TxnComponents/ContractDetail';

export const Address = ({ address, contract }) => {
  const hex = formatAddress(address);
  return (
    <>
      <Link href={`/address/${hex}`}>{hex}</Link>
      <ContractDetail info={contract} />
    </>
  );
};
