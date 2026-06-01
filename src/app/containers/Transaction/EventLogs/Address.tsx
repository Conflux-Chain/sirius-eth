import React from 'react';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { ContractDetail } from '@cfxjs/sirius-next-common/dist/components/InputData/ContractDetail';
import { formatAddress } from 'utils';
import { convertCheckSum } from '@cfxjs/sirius-next-common/dist/utils/address';
import { StyledHighlight } from './StyledComponents';

export const Address = ({ address }) => {
  const hex = convertCheckSum(formatAddress(address));
  return (
    <>
      <StyledHighlight scope="address" value={hex}>
        <Link href={`/address/${hex}`}>{hex}</Link>
      </StyledHighlight>
      <ContractDetail address={address} addressType="hex" />
    </>
  );
};
