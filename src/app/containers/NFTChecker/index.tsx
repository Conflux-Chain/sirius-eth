/**
 *
 * NFT Checker
 *
 */

import React, { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { Input } from '@cfxjs/antd';
import { useParams, useHistory } from 'react-router-dom';
import {
  /*isAccountAddress,*/
  isAddress,
} from 'utils';
import { NFTAsset } from 'app/containers/NFTAsset';
import { convertCheckSum } from '@cfxjs/sirius-next-common/dist/utils/address';

const { Search } = Input;

export function NFTChecker() {
  // const [loading, setLoading] = useState(false);
  const { address: routerAddress = '' } = useParams<{
    address?: string;
  }>();
  const { t } = useTranslation();
  const history = useHistory();
  const [address, setAddress] = useState<string>(
    convertCheckSum(routerAddress),
  );
  const [addressFormatErrorMsg, setAddressFormatErrorMsg] = useState<string>(
    '',
  );
  const validateAddress = (address, cb?) => {
    if (isAddress(address, false)) {
      cb && cb();
      // setLoading(true);
      // isAccountAddress(address)
      //   .then(data => {
      //     if (data) {
      //       cb && cb();
      //     } else {
      //       setAddressFormatErrorMsg(
      //         t(translations.nftChecker.incorrectAddressType),
      //       );
      //     }
      //   })
      //   .catch(e => {
      //     setAddressFormatErrorMsg(
      //       t(translations.nftChecker.incorrectAddressType),
      //     );
      //   })
      //   .finally(() => {
      //     setLoading(false);
      //   });
    } else {
      setAddressFormatErrorMsg(t(translations.nftChecker.incorrectAddressType));
    }
  };

  useEffectOnce(() => {
    if (address) {
      validateAddress(address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const handleAddressChange = e => {
    setAddress(e.target.value.trim());
    setAddressFormatErrorMsg('');
  };

  return (
    <>
      <Helmet>
        <title>{t(translations.header.nftChecker)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.nftChecker.title)}</PageHeader>
      <StyledSubtitleWrapper>
        {t(translations.nftChecker.subtitle)}
      </StyledSubtitleWrapper>
      <SearchWrapper>
        <Search
          value={address}
          onChange={handleAddressChange}
          placeholder=""
          onSearch={value => {
            validateAddress(value, () => {
              history.push(`/nft-checker/${value}`);
            });
          }}
          // loading={loading}
        />
        {addressFormatErrorMsg.length ? (
          <div className="convert-address-error">{addressFormatErrorMsg}</div>
        ) : null}
      </SearchWrapper>
      <NFTAsset />
    </>
  );
}

const SearchWrapper = styled.div`
  margin-bottom: 24px;

  .ant-input-search {
    max-width: 500px;
  }

  .ant-input {
    border-radius: 16px !important;
    background: rgba(30, 61, 228, 0.04);
    border: none !important;
    padding-right: 41px;
  }

  .ant-input-group-addon {
    background: transparent !important;
    left: -38px !important;
    z-index: 80;

    .ant-btn {
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
      margin: 0 !important;
      line-height: 1 !important;
      box-shadow: none !important;

      &:after {
        display: none !important;
      }

      .anticon {
        font-size: 18px;
        margin-bottom: 3px;
      }
    }
  }

  .convert-address-error {
    width: 100%;
    margin: 0.5714rem 0;
    font-size: 0.8571rem;
    color: #e64e4e;
    line-height: 1.1429rem;
    padding-left: 0.3571rem;

    ${media.s} {
      width: 100%;
    }
  }

  span.ant-input-group-addon {
    background-color: transparent !important;

    button.ant-btn::before {
      background-color: transparent !important;
    }
  }
`;

const StyledSubtitleWrapper = styled.div`
  color: #74798c;
  font-size: 1rem;
  line-height: 1.2857rem;
  margin: 1.1429rem 0 1.7143rem;
`;
