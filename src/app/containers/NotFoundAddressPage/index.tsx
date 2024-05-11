/**
 *
 * NotFoundPage
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { media } from 'sirius-next/packages/common/dist/utils/media';
import { translations } from 'locales/i18n';
import notFoundAddress from 'images/home/notFoundAddress.svg';
import { useLocation, useParams } from 'react-router-dom';
import { useSearch } from '../../../utils/hooks/useSearch';

interface LocationState {
  state: { type: string };
}

export function NotFoundAddressPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const { contractAddress: keywords = '' } = useParams<{
    contractAddress: string;
  }>();
  const [, setSearch] = useSearch();

  window.onbeforeunload = () => {
    // research after page refresh
    sessionStorage.setItem('confluxscan_notfound_refreshed', 'true');
  };

  if (sessionStorage.getItem('confluxscan_notfound_refreshed') && keywords) {
    sessionStorage.removeItem('confluxscan_notfound_refreshed');
    setSearch(keywords);
  }

  const { state }: LocationState = useLocation();
  const type = state?.type
    ? t(translations.notFoundAddress[state?.type])
    : t(translations.notFoundAddress.defaultType);

  return (
    <PageWrapper>
      <LeftImage alt="404" src={notFoundAddress} />
      <RightWrap>
        <ErrorTitle>
          {t(translations.notFoundAddress.title, {
            type,
          })}
        </ErrorTitle>
        <ErrorLabel>
          {t(translations.notFoundAddress.label, {
            type,
          })}
        </ErrorLabel>
        <GoTo href="/">{t(translations.notFoundAddress.btn)}</GoTo>
      </RightWrap>
    </PageWrapper>
  );
}

// wrapper
const PageWrapper = styled.div`
  display: flex;
  position: absolute;
  height: calc(100% - 8rem);
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background: #f5f6fa;
  width: 100%;

  ${media.s} {
    height: calc(100% - 116px);
    width: calc(100% - 32px);
    align-items: inherit;
    align-content: center;
  }
`;

// img
const LeftImage = styled.img`
  margin-right: 7rem;
  ${media.s} {
    margin-right: 0;
    max-width: 80%;
  }
`;
const RightWrap = styled.div`
  display: flex;
  flex-direction: column;
  ${media.m} {
    padding: 1rem;
    align-items: center;
    text-align: center;
  }
`;

const ErrorTitle = styled.span`
  display: inline-block;
  font-size: 1.5714rem;
  line-height: 2rem;
  color: #424242;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const ErrorLabel = styled.span`
  display: inline-block;
  color: #4b4b4b;
  opacity: 0.4;
  font-weight: 500;
  line-height: 1.2857rem;
  margin-bottom: 1rem;
  max-width: 540px;
`;

const GoTo = styled.a`
  width: 15.7143rem;
  height: 3.5714rem;
  background-color: #fff;
  border-radius: 2.8571rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #545454;
  font-size: 1.1429rem;
  margin-top: 2rem;
`;
