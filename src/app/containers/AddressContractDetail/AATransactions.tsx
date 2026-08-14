import React from 'react';
import {
  accountAbstractionColumns,
  authorizationsColumns,
} from 'utils/tableColumns';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { TablePanel } from 'app/components/TablePanelNew';
import { useEnhanceDataWithNameMap } from '@cfxjs/sirius-next-common/dist/utils/hooks/useEnhanceDataWithNameMap';
import { OPEN_API_URLS } from 'utils/constants';
import { useTableData } from '@cfxjs/sirius-next-common/dist/utils/hooks/useTableData';

const keys = ['bundlerHex', 'entryPointHex'];

export const AATransactions = ({ address }: { address: string }) => {
  const [ageFormat, toggleAgeFormat] = useAge();
  const { data, loading, pagination, setPagination } = useTableData({
    url: OPEN_API_URLS.aaTransactions,
    query: {
      sender: address,
    },
  });
  const { data: enhancedData } = useEnhanceDataWithNameMap(data?.list, {
    addressKeys: keys,
  });

  const columnsWidth = [5, 5, 4, 4, 8, 8, 4, 8];
  const columns = [
    accountAbstractionColumns.aaHash,
    {
      ...accountAbstractionColumns.bundleHash,
      render: (value, row, index) =>
        accountAbstractionColumns.bundleHash.render(value, row, index, false),
    },
    accountAbstractionColumns.method,
    accountAbstractionColumns.blockHeight,
    accountAbstractionColumns.bundler,
    accountAbstractionColumns.entryPoint,
    accountAbstractionColumns.aaGasFee,
    authorizationsColumns.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  return (
    <TablePanel
      dataSource={enhancedData}
      pagination={pagination}
      loading={loading}
      onChange={setPagination}
      columns={columns}
      total={data?.total}
      listLimit={data?.listLimit}
      rowKey="id"
    />
  );
};
