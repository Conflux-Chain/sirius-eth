import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import styled from 'styled-components';
import { EventLogs } from './EventLogs/Loadable';
import { AuthorizationList } from './AuthorizationList';
import { TabLabel } from 'app/components/TabsTablePanel/Label';
import { reqTransactionDetail } from 'utils/httpRequest';
import { useHistory, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { Detail } from './Detail';

import { InternalTxns } from 'app/containers/Transactions/Loadable';
import iconCross from 'images/icon-crossSpace.svg';
import { getTransactionByHash } from 'utils/rpcRequest';
import { ReactComponent as JsonIcon } from 'images/json.svg';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { viewJson } from '@cfxjs/sirius-next-common/dist/utils';

export function Transaction() {
  const { t } = useTranslation();
  const { hash } = useParams<{
    hash: string;
  }>();
  const history = useHistory();
  const [txnDetail, setTxnDetail] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [partLoading, setPartLoading] = useState(false); // partial update indicator

  // get txn detail info
  const fetchTxDetail = useCallback(
    (initial = true) => {
      if (initial) {
        setLoading(true);
      } else {
        // only update timestamp & confirmedEpochCount
        setPartLoading(true);
      }
      reqTransactionDetail({
        hash,
      })
        .then(body => {
          if (!body?.hash) {
            history.push(`/notfound/${hash}`, {
              type: 'transaction',
            });
          }

          if (body.code) {
            switch (body.code) {
              case 30404:
                history.push(`/notfound/${hash}`, {
                  type: 'transaction',
                });
                break;
            }
          } else {
            //success
            setTxnDetail(body || {});
          }
        })
        .finally(() => {
          setLoading(false);
          setPartLoading(false);
        });
    },
    [history, hash],
  );
  useEffect(() => {
    fetchTxDetail();
    // auto update tx detail info
    const autoUpdateDetailIntervalId = setInterval(() => {
      fetchTxDetail(false);
    }, 10 * 1000);
    return () => {
      clearInterval(autoUpdateDetailIntervalId);
    };
  }, [fetchTxDetail]);

  const { from, to, eventLogCount, gasPrice, type } = txnDetail;

  let tabs = [
    {
      value: 'overview',
      label: t(translations.transaction.overview),
      content: (
        <Detail data={txnDetail} loading={loading} partLoading={partLoading} />
      ),
    },
    {
      value: 'internal-txns',
      action: 'transactionCfxTransfers',
      label: t(translations.transaction.internalTxns.title),
      content: <InternalTxns address={hash} from={from} to={to} />,
      // hidden: cfxTransferAllCount < 2,
    },
    {
      value: 'logs',
      label: (
        <TabLabel showTooltip={false}>
          {t(translations.transaction.logs.title)}
        </TabLabel>
      ),
      content: <EventLogs hash={hash}></EventLogs>,
      hidden: !eventLogCount,
    },
    {
      value: 'authorization-list',
      label: (
        <TabLabel showTooltip={false}>
          {t(translations.authList.authorizationList)}
        </TabLabel>
      ),
      content: <AuthorizationList hash={hash} />,
      hidden: type !== 4,
    },
  ];
  const isCrossSpaceCall = gasPrice === '0';

  const handleViewRawTxJson = async () => {
    const transaction = await getTransactionByHash(hash);
    viewJson(transaction);
  };

  return (
    <StyledPageWrapper>
      <Helmet>
        <title>{t(translations.transaction.title)}</title>
        <meta
          name="description"
          content={t(translations.transaction.description)}
        />
      </Helmet>
      <PageHeader>
        <StyledHeader>
          {t(translations.transaction.title)}
          {isCrossSpaceCall && (
            <div className="overview-cross">
              <img src={iconCross} alt="?" />
              <div>{t(translations.general.table.tooltip.crossSpaceCall)}</div>
            </div>
          )}
        </StyledHeader>
      </PageHeader>
      <div className="content-wrapper">
        <div className="raw-tx-json-wrapper">
          <Tooltip title={t(translations.toolTip.tx.getRawTxJson)}>
            <div className="raw-tx-json" onClick={handleViewRawTxJson}>
              <JsonIcon style={{ width: '24px', height: '24px' }} />
            </div>
          </Tooltip>
        </div>
        <TabsTablePanel tabs={tabs} />
      </div>
    </StyledPageWrapper>
  );
}

const StyledPageWrapper = styled.div`
  margin-bottom: 2.2857rem;
  .content-wrapper {
    position: relative;
    .raw-tx-json-wrapper {
      position: absolute;
      top: 0;
      right: 0;
      height: 3.2857rem;
      display: flex;
      align-items: center;
      .raw-tx-json {
        cursor: pointer;
        background: #fefefe;
        border: 1px solid #ebeced;
        height: 32px;
        display: flex;
        align-items: center;
        border-radius: 16px;
        color: #686c7e;
        padding: 0 16px;
      }
    }
  }
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  .overview-cross {
    width: fit-content;
    margin-left: 16px;
    line-height: 32px;
    display: flex;
    align-items: center;
    background: #fff;
    font-weight: 400;
    border-radius: 16px;
    padding: 0px 12px;
    gap: 8px;
    font-size: 14px;
    img {
      width: 16px;
      height: 16px;
    }
  }
`;
