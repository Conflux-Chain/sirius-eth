import React from 'react';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ReactComponent as EOAWithCodeIcon } from 'images/eoaWithCode.svg';

export const EOACodeIcon = () => {
  const { t } = useTranslation();
  return (
    <TooltipWrapper title={t(translations.authList.eoaWithCode)}>
      <EOAWithCodeIcon />
    </TooltipWrapper>
  );
};

const TooltipWrapper = styled(Tooltip)`
  margin-left: 6px;
  svg {
    width: 18px;
    height: 18px;
  }
`;
