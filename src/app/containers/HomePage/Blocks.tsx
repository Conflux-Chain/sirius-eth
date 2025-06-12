import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { blockColunms } from 'utils/tableColumns';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { useTranslation } from 'react-i18next';

interface Props {
  url: string;
}

export const Blocks = ({ url }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const { i18n } = useTranslation();
  const columnsWidth = i18n.language.includes('zh')
    ? [3, 3, 2, 3, 4, 4, 4, 4, 4]
    : [4, 4, 2, 5, 4, 4, 4, 4, 5];
  const columns = [
    blockColunms.epoch,
    blockColunms.hashWithPivot,
    blockColunms.txns,
    blockColunms.crossSpaceCalls,
    blockColunms.avgGasPrice,
    blockColunms.gasUsedPercentWithProgress,
    blockColunms.gasLimit,
    blockColunms.burntFees,
    blockColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  return (
    <TablePanelNew
      url={url}
      columns={columns}
      rowKey="hash"
      pagination={false}
      hideDefaultTitle={true}
    ></TablePanelNew>
  );
};
