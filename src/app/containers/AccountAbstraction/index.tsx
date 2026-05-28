import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import {
  TabLabel,
  TabsTablePanel,
} from 'app/components/TabsTablePanel/Loadable';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { Helmet } from 'react-helmet-async';

import { AATxns } from './AATxns';
import { BundleTxns } from './BundleTxns';

export function AccountAbstraction() {
  const { t } = useTranslation();

  const tabs = [
    {
      value: 'aa',
      action: 'aaTransactions',
      label: (
        <TabLabel>
          {t(translations.accountAbstraction.tabs.aaTransactions)}
        </TabLabel>
      ),
      content: <AATxns />,
    },
    {
      value: 'bundle',
      action: 'bundleTransactions',
      label: (
        <TabLabel>
          {t(translations.accountAbstraction.tabs.bundleTransactions)}
        </TabLabel>
      ),
      content: <BundleTxns />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t(translations.accountAbstraction.title)}</title>
      </Helmet>
      <PageHeader>{t(translations.accountAbstraction.title)}</PageHeader>
      <TabsTablePanel tabs={tabs} />
    </>
  );
}
