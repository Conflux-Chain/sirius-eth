import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { transactionColunms, blockColunms } from 'utils/tableColumns';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

export function Transactions() {
  const { t } = useTranslation();
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsTransactionsWidth = [8, 7, 6, 10, 10, 6, 8, 8, 8];
  const columnsTransactions = [
    transactionColunms.hash,
    transactionColunms.method,
    blockColunms.blockHeight,
    transactionColunms.from,
    transactionColunms.to,
    transactionColunms.value,
    transactionColunms.gasPrice,
    transactionColunms.gasFee,
    transactionColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({
    ...item,
    width: columnsTransactionsWidth[i],
  }));

  return (
    <>
      <Helmet>
        <title>{t(translations.transactions.title)}</title>
        <meta
          name="description"
          content={t(translations.transactions.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.transactions.title)}</PageHeader>

      <TablePanelNew
        url="/transaction"
        columns={columnsTransactions}
        rowKey="hash"
      ></TablePanelNew>
    </>
  );
}
