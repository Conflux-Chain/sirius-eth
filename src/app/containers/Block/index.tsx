import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import {
  TabLabel,
  TabsTablePanel,
} from 'app/components/TabsTablePanel/Loadable';
import { useHistory, useParams } from 'react-router-dom';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { Helmet } from 'react-helmet-async';
import { DescriptionPanel } from './DescriptionPanel';
import styled from 'styled-components';
import { reqBlockDetail } from 'utils/httpRequest';
import { useBreakpoint } from '@cfxjs/sirius-next-common/dist/utils/media';

import { Txns } from './Txns';

export function Block() {
  const history = useHistory();
  const bp = useBreakpoint();
  const { t } = useTranslation();
  const { hash } = useParams<{
    hash: string;
  }>();
  const [blockDetail, setBlockDetail] = useState<any>({
    transactionCount: 0,
    initial: true, // identify for send request or not
  });
  const [loading, setLoading] = useState(false);
  const { transactionCount, hash: blockHash } = blockDetail;

  useEffect(() => {
    setLoading(true);
    reqBlockDetail({
      hash,
    })
      .then(body => {
        setBlockDetail(body);
      })
      .finally(() => setLoading(false));
  }, [hash]);
  useEffect(() => {
    if (!blockDetail.initial && !blockDetail.hash) {
      history.push(`/notfound/${hash}`, {
        type: 'block',
      });
    }
  }, [history, hash, blockDetail]);

  const tabs = [
    {
      value: 'overview',
      label: t(translations.block.overview),
      content: <DescriptionPanel data={blockDetail} loading={loading} />,
    },
    {
      value: 'transactions',
      action: 'blockTransactions',
      label: (
        <TabLabel showTooltip={bp !== 's'}>
          {bp === 's' ? (
            t(translations.block.tabs.transactions)
          ) : (
            <Tooltip title={t(translations.toolTip.block.transactions)}>
              {t(translations.block.tabs.transactions)}
            </Tooltip>
          )}
        </TabLabel>
      ),
      content: blockHash && (
        <Txns url={`/transaction?blockHash=${blockHash}`} />
      ),
      hidden: !transactionCount,
    },
  ];

  return (
    <StyledPageWrapper>
      <Helmet>
        <title>{t(translations.block.title)}</title>
        <meta name="description" content={t(translations.block.description)} />
      </Helmet>
      <PageHeader>{t(translations.block.title)}</PageHeader>
      <TabsTablePanel tabs={tabs} />
    </StyledPageWrapper>
  );
}

const StyledPageWrapper = styled.div`
  margin-bottom: 2.2857rem;
`;
