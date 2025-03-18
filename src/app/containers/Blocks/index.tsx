import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { blockColumns } from '../../../utils/tableColumns';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

export function Blocks() {
  const { t } = useTranslation();
  const url = '/block';
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsBlocksWidth = [4, 4, 3, 5, 4, 5, 4, 4, 5];
  const columnsBlocks = [
    blockColumns.epoch,
    blockColumns.hashWithPivot,
    blockColumns.txns,
    blockColumns.crossSpaceCalls,
    blockColumns.avgGasPrice,
    blockColumns.gasUsedPercentWithProgress,
    blockColumns.gasLimit,
    blockColumns.burntFees,
    blockColumns.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({
    ...item,
    width: columnsBlocksWidth[i],
  }));

  return (
    <>
      <Helmet>
        <title>{t(translations.blocks.title)}</title>
        <meta name="description" content={t(translations.blocks.description)} />
      </Helmet>
      <PageHeader>{t(translations.blocks.title)}</PageHeader>
      <TablePanelNew
        url={url}
        columns={columnsBlocks}
        rowKey="hash"
      ></TablePanelNew>
    </>
  );
}
