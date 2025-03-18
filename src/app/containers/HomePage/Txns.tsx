import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { transactionColumns, blockColumns } from 'utils/tableColumns';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';

interface Props {
  url: string;
}

export const Txns = ({ url }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsWidth = [5, 4, 5, 5, 4, 3, 4, 4];
  const columns = [
    transactionColumns.hash,
    blockColumns.blockHeight,
    transactionColumns.from,
    transactionColumns.to,
    transactionColumns.value,
    transactionColumns.gasPrice,
    transactionColumns.gasFee,
    transactionColumns.age(ageFormat, toggleAgeFormat),
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
