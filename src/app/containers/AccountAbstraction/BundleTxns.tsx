import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import {
  authorizationsColumns,
  accountAbstractionColumns,
} from 'utils/tableColumns';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { useEnhanceDataWithNameMap } from '@cfxjs/sirius-next-common/dist/utils/hooks/useEnhanceDataWithNameMap';
import { OPEN_API_URLS } from 'utils/constants';
import { useTableData } from '@cfxjs/sirius-next-common/dist/utils/hooks/useTableData';
import { Title } from '../Transactions/components';

const keys = ['bundlerHex', 'entryPointHex'];

export const BundleTxns = () => {
  const [ageFormat, toggleAgeFormat] = useAge();
  const { data, loading, pagination, setPagination } = useTableData({
    url: OPEN_API_URLS.bundleTransactions,
  });
  const { data: enhancedData } = useEnhanceDataWithNameMap(data?.list, {
    addressKeys: keys,
  });

  const columnsWidth = [150, 120, 200, 200, 120, 150, 120, 180];
  const columns = [
    {
      ...accountAbstractionColumns.bundleHash,
      dataIndex: 'hash',
    },
    accountAbstractionColumns.blockHeight,
    accountAbstractionColumns.bundler,
    accountAbstractionColumns.entryPoint,
    accountAbstractionColumns.aaCount,
    accountAbstractionColumns.value,
    accountAbstractionColumns.txnFee,
    authorizationsColumns.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const title = ({ total, listLimit }) => (
    <Title
      total={total}
      listLimit={listLimit}
      showSearch={true}
      searchOptions={{
        bundler: true,
        entryPoint: true,
        button: {
          col: {
            xs: 24,
            sm: 6,
            md: 6,
            lg: 6,
            xl: 6,
          },
        },
      }}
    />
  );

  return (
    <TablePanelNew
      dataSource={enhancedData}
      pagination={pagination}
      loading={loading}
      onChange={setPagination}
      title={title}
      columns={columns}
      total={data?.total}
      listLimit={data?.listLimit}
      rowKey="id"
    />
  );
};
