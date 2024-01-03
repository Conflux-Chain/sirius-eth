import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { transactionColunms, blockColunms } from 'utils/tableColumns';
import { useAge } from 'utils/hooks/useAge';

interface Props {
  url: string;
}

export const Txns = ({ url }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsWidth = [5, 4, 5, 5, 4, 3, 4, 4];
  const columns = [
    transactionColunms.hash,
    blockColunms.blockHeight,
    transactionColunms.from,
    transactionColunms.to,
    transactionColunms.value,
    transactionColunms.gasPrice,
    transactionColunms.gasFee,
    transactionColunms.age(ageFormat, toggleAgeFormat),
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
