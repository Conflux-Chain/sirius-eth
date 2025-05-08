import React from 'react';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { formatAddress } from 'utils';
import { ContractDetail } from 'app/components/TxnComponents/ContractDetail';
import { convertCheckSum } from '@cfxjs/sirius-next-common/dist/utils/address';
import { StyledHighlight } from './StyledComponents';

export const Address = ({ address, contract }) => {
  const hex = convertCheckSum(formatAddress(address));
  return (
    <>
      <StyledHighlight scope="address" value={hex}>
        <Link href={`/address/${hex}`}>{hex}</Link>
      </StyledHighlight>
      <ContractDetail info={contract} />
    </>
  );
};
