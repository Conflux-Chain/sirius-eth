import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import { EventLogs } from './EventLogs/Loadable';
import { AuthorizationList } from './AuthorizationList';
import { TabLabel } from 'app/components/TabsTablePanel/Label';
import { reqBundleTxDetail, reqTransactionDetail } from 'utils/httpRequest';
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
import useSWR from 'swr';
import { AATxns } from './AATxns';
import { StyledHeader, StyledPageWrapper, TagWrapper } from './styled';
import { AATransaction } from './AATransaction';
import { useAATxDetail } from 'utils/hooks/useAATxDetail';

const BundleTxIcon = () => {
  const { t } = useTranslation();
  return (
    <TagWrapper>
      <Tooltip title={t(translations.toolTip.tx.bundleTx)}>
        {t(translations.transaction.bundleTx.title)}
      </Tooltip>
    </TagWrapper>
  );
};

function CommonTransaction() {
  const { t } = useTranslation();
  const { hash } = useParams<{
    hash: string;
  }>();
  const history = useHistory();
  const [txnDetail, setTxnDetail] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [partLoading, setPartLoading] = useState(false); // partial update indicator

  const { data: userOps } = useSWR<any[]>(
    hash ? ['bundle tx detail', hash] : null,
    async () => {
      try {
        const res = await reqBundleTxDetail({
          query: { txHash: hash },
          showErrorMessage: false,
        });
        return res?.userOps;
      } catch (error) {
        console.log('get bundle tx detail error', error);
        return [];
      }
    },
  );
  const isBundleTx = userOps && userOps.length > 0;

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

  const { from, to, eventLogCount, gasPrice, type, nameMap } = txnDetail;

  let tabs = [
    {
      value: 'overview',
      label: t(translations.transaction.overview),
      content: (
        <Detail
          data={txnDetail}
          loading={loading}
          partLoading={partLoading}
          key={hash}
        />
      ),
    },
    {
      value: 'internal-txns',
      action: 'transactionCfxTransfers',
      label: t(translations.transaction.txTrace.title),
      content: (
        <InternalTxns
          hash={hash}
          from={from}
          to={to}
          nameMap={nameMap}
          key={hash}
        />
      ),
      // hidden: cfxTransferAllCount < 2,
    },
    {
      value: 'aa-txs',
      label: (
        <TabLabel showTooltip={false}>
          {t(translations.accountAbstraction.tabs.aaTransactions)}
        </TabLabel>
      ),
      content: <AATxns list={userOps!} key={hash} />,
      hidden: !isBundleTx,
    },
    {
      value: 'logs',
      label: (
        <TabLabel showTooltip={false}>
          {t(translations.transaction.logs.title)}
        </TabLabel>
      ),
      content: <EventLogs hash={hash} key={hash}></EventLogs>,
      hidden: !eventLogCount,
    },
    {
      value: 'authorization-list',
      label: (
        <TabLabel showTooltip={false}>
          {t(translations.authList.authorizationList)}
        </TabLabel>
      ),
      content: <AuthorizationList hash={hash} key={hash} />,
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
          {isBundleTx && <BundleTxIcon />}
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

export function Transaction() {
  const { t } = useTranslation();
  const { hash } = useParams<{
    hash: string;
  }>();

  const { data: aaTx, isLoading } = useAATxDetail(hash);

  const isAATx = aaTx && aaTx.txHash;
  if (isLoading) {
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
          <StyledHeader>{t(translations.transaction.title)}</StyledHeader>
        </PageHeader>
      </StyledPageWrapper>
    );
  }
  if (!isAATx) {
    return <CommonTransaction />;
  }

  return <AATransaction />;
}
