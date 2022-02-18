/**
 *
 * ContractDetailPage
 *
 */

import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { /*Link as RouterLink,*/ useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Copy, Qrcode } from './HeadLineButtons';
import { BalanceCard, NonceCard, TokensCard } from './AddressInfoCards';
import { ContractMetadata, Table } from './Loadable';
import { useContract } from 'utils/api';
import {
  Bottom,
  Head,
  HeadAddressLine,
  Main,
  Middle,
  Title,
  Top,
} from './layouts';
import ContractIcon from '../../../images/contract-icon.png';
import styled from 'styled-components/macro';
// import DownIcon from '../../../images/down.png';
// import { Menu } from '@cfxjs/antd';
// import { DropdownWrapper, MenuWrapper } from './AddressDetailPage';
import { tokenTypeTag } from '../TokenDetail/Basic';

interface RouteParams {
  address: string;
}

export const ContractDetailPage = memo(() => {
  const { t } = useTranslation();
  const { address } = useParams<RouteParams>();

  const { data: contractInfo } = useContract(address, [
    'name',
    'iconUrl',
    'sponsor',
    'admin',
    'from',
    'code',
    'website',
    'transactionHash',
    'cfxTransferCount',
    'erc20TransferCount',
    'erc721TransferCount',
    'erc1155TransferCount',
    'stakingBalance',
    'sourceCode',
    'abi',
    'isRegistered',
    'verifyInfo',
  ]);

  // const websiteUrl = contractInfo?.website || '';
  // const hasWebsite =
  //   !!websiteUrl &&
  //   websiteUrl !== 'https://' &&
  //   websiteUrl !== 'http://' &&
  //   websiteUrl !== t(translations.general.loading);

  // const menu = (
  //   <MenuWrapper>
  //     {!contractInfo?.verify?.exactMatch ? (
  //       <Menu.Item>
  //         <RouterLink to={`/contract-verification?address=${SDK.format.hexAddress(address)}`}>
  //           {t(translations.general.address.more.verifyContract)}
  //         </RouterLink>
  //       </Menu.Item>
  //     ) : null}
  //     <Menu.Item>
  //       <RouterLink to={`/balance-checker?address=${address}`}>
  //         {t(translations.general.address.more.balanceChecker)}
  //       </RouterLink>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <RouterLink to={`/contract-info/${address}`}>
  //         {t(translations.general.address.more.editContract)}
  //       </RouterLink>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <RouterLink to={`/report?address=${address}`}>
  //         {t(translations.general.address.more.report)}
  //       </RouterLink>
  //     </Menu.Item>
  //     {hasWebsite && (
  //       <Menu.Item>
  //         <RouterLink
  //           onClick={e => {
  //             e.preventDefault();
  //             e.stopPropagation();

  //             const link = websiteUrl.startsWith('http')
  //               ? websiteUrl
  //               : `http://${websiteUrl}`;

  //             window.open(link);
  //           }}
  //           to=""
  //         >
  //           {t(translations.general.address.more.website)}
  //         </RouterLink>
  //       </Menu.Item>
  //     )}
  //   </MenuWrapper>
  // );

  return (
    <>
      <Helmet>
        <title>{`${t(translations.contractDetail.title)} ${address}`}</title>
        <meta
          name="description"
          content={`${t(translations.contractDetail.content)} ${address}`}
        />
      </Helmet>
      <Main key="main">
        <Head key="head">
          <Title>{contractInfo.name || t(translations.general.contract)}</Title>
          <HeadAddressLine>
            <IconWrapper className="address">
              <img src={ContractIcon} alt={t(translations.general.contract)} />
              &nbsp;
              <span>{address}</span>
            </IconWrapper>
            <div className="icons">
              <Copy address={address} />
              <Qrcode address={address} />
              {/* <DropdownWrapper overlay={menu} trigger={['click']}>
                <span onClick={e => e.preventDefault()}>
                  {t(translations.general.address.more.title)}{' '}
                  <img
                    src={DownIcon}
                    alt={t(translations.general.address.more.title)}
                  />
                </span>
              </DropdownWrapper> */}
            </div>
          </HeadAddressLine>
        </Head>
        <Top key="top">
          <BalanceCard accountInfo={contractInfo} />
          <TokensCard address={address} />
          <NonceCard accountInfo={contractInfo} />
        </Top>
        <Middle key="middle">
          <div style={{ position: 'relative' }}>
            <ContractMetadata address={address} contractInfo={contractInfo} />
            {contractInfo.isRegistered && tokenTypeTag(t, 'registered')}
          </div>
        </Middle>
        <Bottom key="bottom">
          <Table
            key="table"
            address={address}
            addressInfo={contractInfo}
            type="contract"
          />
        </Bottom>
      </Main>
    </>
  );
});

const IconWrapper = styled.span`
  margin-right: 2px;

  img {
    width: 16px;
    height: 16px;
    margin-bottom: 4px;
  }
`;
