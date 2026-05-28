import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { accountAbstractionColumns } from 'utils/tableColumns';
import { useEnhanceDataWithNameMap } from '@cfxjs/sirius-next-common/dist/utils/hooks/useEnhanceDataWithNameMap';

const keys = ['senderHex', 'bundlerHex', 'entryPointHex'];

export const AATxns = ({ list }: { list: any[] }) => {
  const { data: enhancedData } = useEnhanceDataWithNameMap(list, {
    addressKeys: keys,
  });

  const columnsWidth = [5, 4, 4, 8, 4, 4, 4, 5, 4];
  const columns = [
    accountAbstractionColumns.aaHash,
    accountAbstractionColumns.method,
    accountAbstractionColumns.position,
    {
      ...accountAbstractionColumns.from,
      dataIndex: 'from',
    },
    accountAbstractionColumns.internalTxns,
    accountAbstractionColumns.tokenTxns,
    accountAbstractionColumns.nftTxns,
    accountAbstractionColumns.aaTxnFee,
    accountAbstractionColumns.gasUsed,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  return (
    <TablePanelNew
      dataSource={enhancedData}
      hideDefaultTitle
      columns={columns}
      rowKey="userOpHash"
      pagination={false}
    />
  );
};
