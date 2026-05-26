import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import { EventLogs } from '../EventLogs/Loadable';
import { TabLabel } from 'app/components/TabsTablePanel/Label';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { Detail } from './Detail';

import { InternalTxns } from 'app/containers/Transactions/Loadable';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { StyledHeader, StyledPageWrapper, TagWrapper } from '../styled';
import { useTxEventLogs } from 'utils/hooks/useTxEventLogs';
import { useAATxDetail } from 'utils/hooks/useAATxDetail';
import { useAddressNameMap } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAddressNameMap';

const AATxIcon = () => {
  const { t } = useTranslation();
  return (
    <TagWrapper>
      <Tooltip title={t(translations.toolTip.tx.aaTx)}>
        {t(translations.transaction.aaTx.title)}
      </Tooltip>
    </TagWrapper>
  );
};

export const AATransaction = () => {
  const { t } = useTranslation();
  const { hash } = useParams<{
    hash: string;
  }>();
  const { data: aaTx, isValidating } = useAATxDetail(hash, {
    refreshInterval: 10 * 1000,
    keepPreviousData: true,
  });
  const { senderHex, entryPointHex } = aaTx ?? {};
  const { data: eventlogs } = useTxEventLogs(hash, true);
  const { data: nameMap } = useAddressNameMap([senderHex, entryPointHex]);

  let tabs = [
    {
      value: 'overview',
      label: t(translations.transaction.overview),
      content: <Detail data={aaTx} partLoading={isValidating} key={hash} />,
    },
    {
      value: 'internal-txns',
      action: 'transactionCfxTransfers',
      label: t(translations.transaction.txTrace.title),
      content: (
        <InternalTxns
          hash={hash}
          from={senderHex}
          to={entryPointHex}
          nameMap={nameMap}
          isAATx={true}
          key={hash}
        />
      ),
    },
    {
      value: 'logs',
      label: (
        <TabLabel showTooltip={false}>
          {t(translations.transaction.logs.title)}
        </TabLabel>
      ),
      content: <EventLogs hash={hash} key={hash} isAATx></EventLogs>,
      hidden: !eventlogs?.length,
    },
  ];

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
          <AATxIcon />
        </StyledHeader>
      </PageHeader>
      <div className="content-wrapper">
        <TabsTablePanel tabs={tabs} />
      </div>
    </StyledPageWrapper>
  );
};
