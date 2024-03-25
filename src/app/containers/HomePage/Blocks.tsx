import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { blockColunms } from 'utils/tableColumns';
import { useAge } from 'sirius-next/packages/common/dist/utils/hooks/useAge';

interface Props {
  url: string;
}

export const Blocks = ({ url }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsWidth = [4, 4, 3, 5, 4, 5, 4, 3];
  const columns = [
    blockColunms.epoch,
    blockColunms.hashWithPivot,
    blockColunms.txns,
    blockColunms.crossSpaceCalls,
    blockColunms.avgGasPrice,
    blockColunms.gasUsedPercentWithProgress,
    blockColunms.gasLimit,
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
