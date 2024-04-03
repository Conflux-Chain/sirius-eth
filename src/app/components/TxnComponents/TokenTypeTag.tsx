import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';

interface Props {
  type: 'erc20' | 'erc721' | 'erc1155';
}

export const TokenTypeTag = ({
  type,
}: Props): React.ReactComponentElement<'span'> => {
  const { t } = useTranslation();

  return (
    <StyledTokenTypeTag className={type}>
      {type.toUpperCase()} {t(translations.general.tokenTypeTag.token)}
    </StyledTokenTypeTag>
  );
};

const StyledTokenTypeTag = styled.span`
  color: #ffffff;
  font-size: 10px;
  border-radius: 0.7143rem;
  padding: 0 0.3571rem;
  white-space: nowrap;

  &.erc20 {
    background-color: rgb(104, 206, 252);
  }

  &.erc721 {
    background-color: rgb(44, 72, 198);
  }

  &.erc1155 {
    background-color: rgb(97, 152, 249);
  }
`;
