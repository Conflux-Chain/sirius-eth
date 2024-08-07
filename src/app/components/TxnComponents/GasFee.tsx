import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import React from 'react';
import _ from 'lodash';

import imgSponsoredEn from 'images/sponsored.png';
import imgSponsoredZh from 'images/sponsored-zh.png';
import { fromDripToCfx } from '@cfxjs/sirius-next-common/dist/utils';

export const GasFee: React.FC<{
  fee: string;
  sponsored: boolean;
  isCrossSpaceCall: boolean;
}> = ({ fee, sponsored, isCrossSpaceCall }) => {
  const { i18n } = useTranslation();
  const imgSponsored = i18n.language.startsWith('en')
    ? imgSponsoredEn
    : imgSponsoredZh;

  return (
    <StyledFeeWrapper>
      {`${
        _.isNil(fee) || isCrossSpaceCall
          ? '--'
          : fromDripToCfx(fee, false, {
              precision: 18,
              minNum: 1e-18,
            }) + ' CFX'
      }`}
      {sponsored && (
        <img src={imgSponsored} alt="sponsored" className="icon-sponsored" />
      )}
    </StyledFeeWrapper>
  );
};

const StyledFeeWrapper = styled.span`
  .icon-sponsored {
    height: 1.4286rem;
    margin-left: 0.5714rem;
  }
`;
