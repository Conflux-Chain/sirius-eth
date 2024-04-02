/**
 *
 * AddressDetailPage
 *
 */

import React, { memo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Copy, Qrcode, Debank } from './HeadLineButtons';
import { BalanceCard, TokensCard, NonceCard } from './AddressInfoCards';
import { Main, Title, Bottom, HeadAddressLine, Top, Head } from './layouts';
import { Table } from './Loadable';
import { isZeroAddress } from '../../../utils';
import { useAccount } from '../../../utils/api';
import { Dropdown, Menu } from '@cfxjs/antd';
import DownIcon from '../../../images/down.png';
import styled from 'styled-components';
import { media } from '../../../styles/media';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { Bookmark } from '@zeit-ui/react-icons';
import { Text } from 'app/components/Text/Loadable';
import { CreateAddressLabel } from '../Profile/CreateAddressLabel';
import Nametag from './Nametag';
import ENV_CONFIG from 'sirius-next/packages/common/dist/env';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';

interface RouteParams {
  address: string;
}

export const AddressDetailPage = memo(() => {
  const [globalData = {}] = useGlobalData();
  const { t } = useTranslation();
  const { address } = useParams<RouteParams>();
  const { data: accountInfo } = useAccount(address, [
    'cfxTransferCount',
    'erc20TransferCount',
    'erc721TransferCount',
    'erc1155TransferCount',
    'stakingBalance',
  ]);
  const [visible, setVisible] = useState(false);

  const addressLabelMap = globalData[LOCALSTORAGE_KEYS_MAP.addressLabel];
  const addressLabel = addressLabelMap[address];

  const menu = (
    <MenuWrapper>
      <Menu.Item>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            setVisible(true);
          }}
          href=""
        >
          {t(
            translations.general.address.more[
              addressLabel ? 'updateLabel' : 'addLabel'
            ],
          )}
        </a>
      </Menu.Item>
    </MenuWrapper>
  );

  const props = {
    stage: addressLabel ? 'edit' : 'create',
    visible,
    data: {
      address,
    },
    onOk: () => {
      setVisible(false);
    },
    onCancel: () => {
      setVisible(false);
    },
  };

  return (
    <>
      <Helmet>
        <title>{`${t(translations.addressDetail.title)} ${address}`}</title>
        <meta
          name="description"
          content={`${t(translations.addressDetail.content)} ${address}`}
        />
      </Helmet>
      <Main>
        <Head>
          <Title>
            {isZeroAddress(address)
              ? t(translations.general.zeroAddress)
              : t(translations.general.address.address)}

            <Nametag address={address}></Nametag>
          </Title>
          <HeadAddressLine>
            <span className="address">
              {address}
              {addressLabel ? (
                <>
                  {' '}
                  (
                  <Text span hoverValue={t(translations.profile.tip.label)}>
                    <Bookmark color="var(--theme-color-gray2)" size={16} />
                  </Text>
                  {addressLabel})
                </>
              ) : (
                ''
              )}
            </span>
            <div className="icons">
              <Copy address={address} />
              <Qrcode address={address} />
              <Debank address={address} />
              <DropdownWrapper overlay={menu} trigger={['hover']}>
                <span onClick={e => e.preventDefault()}>
                  {t(translations.general.address.more.title)}{' '}
                  <img
                    src={DownIcon}
                    alt={t(translations.general.address.more.title)}
                  />
                </span>
              </DropdownWrapper>
            </div>
          </HeadAddressLine>
        </Head>
        <Top>
          <BalanceCard accountInfo={accountInfo} />
          <TokensCard address={address} />
          <NonceCard accountInfo={accountInfo} />
        </Top>
        <Bottom>
          <Table
            address={address}
            addressInfo={accountInfo}
            key={address}
            type="account"
          />
        </Bottom>
        <CreateAddressLabel {...props}></CreateAddressLabel>
      </Main>
    </>
  );
});

export const DropdownWrapper = styled(Dropdown)`
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 0 !important;

  ${media.s} {
    position: relative;
  }

  img {
    width: 11px;
    margin-left: 5px;
  }
`;

export const MenuWrapper = styled(Menu)`
  min-width: 100px;

  li {
    list-style: none;

    &:before {
      display: none;
    }

    a {
      color: #65709a;
    }

    &:hover {
      a {
        color: ${ENV_CONFIG.ENV_THEME.primary};
      }
    }
  }
`;
