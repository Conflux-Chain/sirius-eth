import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Link } from 'app/components/Link';
import { Description } from 'sirius-next/packages/common/dist/components/Description';
import { formatAddress } from 'utils';
import { TransactionAction } from 'app/components/TransactionAction';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { reqContract, reqTransactionEventlogs } from 'utils/httpRequest';
import _ from 'lodash';

import { GasFee } from './GasFee';
// import { StorageFee } from './StorageFee';
import { Nonce } from './Nonce';
import { Status } from './Status';
import iconCross from 'images/icon-crossSpace.svg';

export const Overview = ({ data }) => {
  const { t } = useTranslation();
  const {
    hash,
    status,
    from,
    to,
    // confirmedEpochCount,
    gasFee,
    gasCoveredBySponsor,
    // storageCollateralized,
    // storageCoveredBySponsor,
    nonce,
    transactionIndex,
    tokenTransferTokenInfo,
    txExecErrorInfo,
  } = data;
  const [contractInfo, setContractInfo] = useState({});
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
      return [contractInfo, ...tokenTransferTokenInfoList];
    }
    return [contractInfo];
  }, [tokenTransferTokenInfoList, contractInfo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!hash) return;
        setLoading(true);

        const reqArr: Promise<any>[] = [];
        if (to) {
          reqArr.push(
            reqContract({
              address: to,
              fields: ['token'],
            }),
          );
        }

        reqArr.push(
          reqTransactionEventlogs({
            transactionHash: hash,
            aggregate: false,
          }),
        );

        const res = await Promise.all(reqArr);

        if (
          to &&
          res[0] &&
          _.isObject(res[0].token) &&
          !_.isEmpty(res[0].token)
        ) {
          setContractInfo({
            token: { address: res[0].address, ...res[0].token },
          });
        }

        const eventlogsIndex = to ? 1 : 0;
        if (
          res[eventlogsIndex] &&
          res[eventlogsIndex].list &&
          res[eventlogsIndex].list.length > 0
        ) {
          setEventlogs(res[eventlogsIndex].list);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [to, hash]);

  const transactionAction = TransactionAction({
    transaction: data,
    event: eventlogs,
    customInfo: customInfoList,
  });

  return (
    <StyledWrapper>
      <div className="overview-title">
        {t(translations.transaction.overview)}
        {gasFee === '0' && (
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
          title={'t(translations.transaction.action.title)'}
        >
          <SkeletonContainer shown={loading}>
            {transactionAction.content}
          </SkeletonContainer>
        </Description>
      )}
      <Description
        vertical
        size="tiny"
        title={t(translations.transaction.gasFee)}
      >
        <GasFee fee={gasFee} sponsored={gasCoveredBySponsor} />
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
