/* -*- mode: typescript -*- */
/**
 * @fileOverview
 * @name ContractMetadata.tsx
 * @author yqrashawn <namy.19@gmail.com>
 */
import React from 'react';
import clsx from 'clsx';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { List } from 'app/components/List/';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { useToken } from 'utils/api';
import { media } from 'styles/media';
import { Text } from 'app/components/Text';
import { Tooltip } from 'sirius-next/packages/common/dist/components/Tooltip';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { AddressContainer } from 'sirius-next/packages/common/dist/components/AddressContainer';
import { formatString } from 'utils';
import { ICON_DEFAULT_TOKEN, ICON_DEFAULT_CONTRACT } from 'utils/constants';
// import Edit3 from '@zeit-ui/react-icons/edit3';
import { Image } from '@cfxjs/antd';

const Link = ({ to, children }) => <RouterLink to={to}>{children}</RouterLink>;

export function ContractMetadata({ address, contractInfo }) {
  const { t } = useTranslation();
  const notAvailableText = t(translations.general.security.notAvailable);
  const { data: tokenInfo } = useToken(address, ['name', 'iconUrl']);
  const loading = contractInfo.name === t(translations.general.loading);
  const skeletonStyle = { height: '1.5714rem' };

  const isNotDeployed = [1, 2, 3].includes(contractInfo.destroy?.status);

  const isToken = ['20', '721', '1155', '3525'].includes(
    /\d+/.exec(tokenInfo.tokenType || tokenInfo.transferType)?.[0] || '', // compatible with open api
  );

  let tokenName: React.ReactNode = tokenInfo.name
    ? formatString(
        `${tokenInfo.name || notAvailableText} (${
          tokenInfo.symbol || notAvailableText
        })`,
        'tokenTracker',
      )
    : notAvailableText;

  if (tokenInfo.name && isToken) {
    tokenName = <Link to={`/token/${address}`}>{tokenName}</Link>;
  }

  const list = [
    {
      title: (
        <Tooltip title={t(translations.toolTip.contract.nameTag)}>
          {t(translations.contract.nameTag)}
        </Tooltip>
      ),
      children: (
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <CenterLine>
            <Image
              width={24} // width: 16px + padingRight: 8px = 24px
              style={{
                paddingRight: '8px',
              }}
              src={tokenInfo?.iconUrl || ''}
              preview={false}
              fallback={ICON_DEFAULT_CONTRACT}
              alt={contractInfo.name + 'logo'}
            />
            <Content>{contractInfo.name || notAvailableText}</Content>
            {/* <RouterLink
              className="contract-info-update"
              to={`/contract-info/${address}`}
            >
              <Edit3 size={18} color="#1e3de4" />
            </RouterLink> */}
          </CenterLine>
        </SkeletonContainer>
      ),
    },
    {
      title: (
        <Tooltip title={t(translations.toolTip.contract.tokenTracker)}>
          {t(translations.contract.tokenTracker)}
        </Tooltip>
      ),
      children: (
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <CenterLine>
            <Image
              width={24} // width: 16px + padingRight: 8px = 24px
              style={{
                paddingRight: '8px',
              }}
              src={tokenInfo?.iconUrl || ''}
              preview={false}
              fallback={ICON_DEFAULT_TOKEN}
              alt={tokenInfo?.name + 'logo'}
            />

            <Content className={clsx(!tokenInfo.name && 'not-available')}>
              {tokenName}
            </Content>
          </CenterLine>
        </SkeletonContainer>
      ),
    },
    {
      title: (
        <Tooltip title={t(translations.toolTip.contract.contractCreator)}>
          {t(translations.contract.creator)}
        </Tooltip>
      ),
      children: (
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <CenterLine>
            {isNotDeployed ? (
              <Content className="not-available">
                <Text type="error">
                  {t(translations.contract.thisContract)}
                  {t(
                    translations.contract.status[contractInfo.destroy?.status],
                  )}
                </Text>
              </Content>
            ) : (
              <Content
                className={clsx(
                  !contractInfo.from && 'not-available',
                  !contractInfo.transactionHash && 'not-available',
                )}
              >
                {contractInfo.from ? (
                  <AddressContainer value={contractInfo.from} />
                ) : (
                  notAvailableText
                )}
                {contractInfo.transactionHash ? (
                  <>
                    {` ${t(translations.contractDetail.at)} ${t(
                      translations.contractDetail.txOnlyEn,
                    )} `}
                    <LinkWrap to={`/tx/${contractInfo.transactionHash}`}>
                      <Text span hoverValue={contractInfo.transactionHash}>
                        {formatString(contractInfo.transactionHash, 'address')}
                      </Text>
                    </LinkWrap>
                    {` ${t(translations.contractDetail.txOnlyZh)} `}
                  </>
                ) : null}
              </Content>
            )}
          </CenterLine>
        </SkeletonContainer>
      ),
    },
  ];

  return <List list={list} />;
}

const CenterLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;

  .metadata-tooltip-btn {
    margin-left: 0.5rem;
    margin-bottom: 0.2857rem;
    ${media.s} {
      margin-left: 1rem;
    }
  }

  .contract-info-update {
    position: absolute;
    right: 0;
  }
`;

const Content = styled.span`
  &.not-available.link {
    color: #97a3b4;
  }
`;

const LinkWrap = styled(Link)`
  color: #1e3de4 !important;
  &:hover {
    color: #0f23bd !important;
  }
`;
