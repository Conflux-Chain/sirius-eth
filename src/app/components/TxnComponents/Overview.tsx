import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { Description } from '@cfxjs/sirius-next-common/dist/components/Description';
import { formatAddress } from 'utils';
import { TransactionAction } from '@cfxjs/sirius-next-common/dist/components/TransactionAction/evmTransactionAction';
import { SkeletonContainer } from '@cfxjs/sirius-next-common/dist/components/SkeletonContainer';
import { reqTransactionEventlogs } from 'utils/httpRequest';
import { GasFee } from './GasFee';
import { Nonce } from './Nonce';
import { Status } from './Status';
import iconCross from 'images/icon-crossSpace.svg';
import { getAddressNameInfo } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/utils';

export const Overview = ({ data }) => {
  const { t } = useTranslation();
  const {
    hash,
    status,
    from,
    to,
    gasFee,
    gasPrice,
    gasCoveredBySponsor,
    nonce,
    transactionIndex,
    tokenTransferTokenInfo,
    txExecErrorInfo,
    nameMap,
  } = data;
  const [loading, setLoading] = useState(true);
  const [eventlogs, setEventlogs] = useState<any>([]);
  const tokenTransferTokenInfoList = useMemo(() => {
    if (tokenTransferTokenInfo && typeof tokenTransferTokenInfo === 'object') {
      return Object.keys(tokenTransferTokenInfo).map(key => ({
        token: tokenTransferTokenInfo[key],
      }));
    }
    return [];
  }, [tokenTransferTokenInfo]);
  const customInfoList = useMemo(() => {
    if (tokenTransferTokenInfoList.length > 0) {
      return tokenTransferTokenInfoList;
    }
    const nameInfo = getAddressNameInfo(to, nameMap);
    if (!nameInfo) return [];
    return [
      {
        token: {
          ...nameInfo.originInfo.token,
          address: to,
        },
      },
    ];
  }, [tokenTransferTokenInfoList, nameMap, to]);

  useEffect(() => {
    const fetchData = async () => {
      if (!hash) return;
      let logs = [];
      try {
        setLoading(true);

        const res = await reqTransactionEventlogs({
          transactionHash: hash,
          aggregate: false,
        });

        if (res && res.list && res.list.length > 0) {
          logs = res.list;
        }
      } catch (error) {
        console.error('fetch event logs error: ', error);
      } finally {
        setEventlogs(logs);
        setLoading(false);
      }
    };
    fetchData();
  }, [hash]);

  const transactionAction = TransactionAction({
    transaction: data,
    event: eventlogs,
    customInfo: customInfoList,
  });
  const isCrossSpaceCall = gasPrice === '0';

  return (
    <StyledWrapper>
      <div className="overview-title">
        {t(translations.transaction.overview)}
        {isCrossSpaceCall && (
          <div className="overview-cross">
            <img src={iconCross} alt="?" />
            {t(translations.general.table.tooltip.crossSpaceCall)}
          </div>
        )}
      </div>
      <Description
        vertical
        size="tiny"
        title={t(translations.transaction.status)}
      >
        <div className="overview-status-and-confirmedEpochCount">
          <Status
            type={status}
            txExecErrorInfo={txExecErrorInfo}
            address={formatAddress(from)}
            hash={hash}
          />
        </div>
      </Description>
      {status === 0 && transactionAction && transactionAction.show && (
        <Description
          vertical
          size="tiny"
          title={t(translations.transaction.action.title)}
        >
          <SkeletonContainer shown={loading}>
            {transactionAction.content}
          </SkeletonContainer>
        </Description>
      )}
      <Description
        vertical
        size="tiny"
        title={t(translations.transaction.transactionFee)}
      >
        <GasFee
          fee={gasFee}
          sponsored={gasCoveredBySponsor}
          isCrossSpaceCall={isCrossSpaceCall}
        />
      </Description>
      <Description
        vertical
        size="tiny"
        title={t(translations.transaction.nonce)}
        noBorder
      >
        <Nonce nonce={nonce} position={transactionIndex}></Nonce>
      </Description>
      {hash ? (
        <div className="overview-gotoDetail-container">
          <Link className="overview-gotoDetail" href={`/tx/${hash}`}>
            {t(translations.transaction.gotoDetail)}
          </Link>{' '}
        </div>
      ) : null}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 25.7143rem;
  padding: 0.3571rem;
  overflow: hidden;

  .overview-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    color: #7e8598;
    line-height: 1.2857rem;
    border-bottom: 1px solid #e8e9ea !important;
    padding-bottom: 0.8571rem;
  }

  .overview-cross {
    width: fit-content;
    display: flex;
    align-items: center;
    background: rgba(171, 172, 181, 0.1);
    font-weight: 400;
    border-radius: 12px;
    padding: 5px 15px;
    gap: 8px;
  }

  .overview-status-and-confirmedEpochCount {
    display: flex;
  }

  .overview-gotoDetail-container {
    padding: 1rem 0 0 0;
    margin-bottom: -0.5714rem;
    display: flex;
    justify-content: flex-end;

    .link.overview-gotoDetail {
      text-decoration: underline;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .description {
    &.no-border {
      .right {
        border-bottom: none !important;
      }
    }
  }
`;
