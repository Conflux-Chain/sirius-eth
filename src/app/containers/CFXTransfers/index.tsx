import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import {
  blockColunms,
  tokenColunms,
  transactionColunms,
} from 'utils/tableColumns';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { useAge } from 'utils/hooks/useAge';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

export function CFXTransfers() {
  const { t } = useTranslation();
  const url = '/transfer?transferType=CFX';
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsCFXTransferWidth = [4, 4, 8, 7, 4, 5];
  const columnsCFXTrasfer = [
    tokenColunms.txnHash,
    blockColunms.blockHeight,
    tokenColunms.from,
    tokenColunms.to,
    transactionColunms.value,
    tokenColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsCFXTransferWidth[i] }));

  return (
    <>
      <Helmet>
        <title>{t(translations.transfers.title)}</title>
        <meta
          name="description"
          content={t(translations.transfers.description)}
        />
      </Helmet>
      <PageHeader subtitle={t(translations.transfers.description)}>
        {t(translations.transfers.title)}
      </PageHeader>

      <TablePanelNew url={url} columns={columnsCFXTrasfer}></TablePanelNew>
    </>
  );
}
