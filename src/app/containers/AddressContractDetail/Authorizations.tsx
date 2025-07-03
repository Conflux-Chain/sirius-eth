import React from 'react';
import { blockColunms, authorizationsColumns } from 'utils/tableColumns';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { TablePanel } from 'app/components/TablePanelNew';

export const Authorizations = ({ address }: { address: string }) => {
  const [ageFormat, toggleAgeFormat] = useAge();
  const url = `/stat/list-auth-action?author=${address}`;

  const columnsWidth = [2, 1, 2, 2, 1, 1, 2];
  const columns = [
    authorizationsColumns.hash,
    {
      ...blockColunms.blockHeight,
      dataIndex: 'blockNumber',
      key: 'blockNumber',
    },
    authorizationsColumns.delegatedAddress,
    authorizationsColumns.txSender,
    authorizationsColumns.nonce,
    authorizationsColumns.valid,
    authorizationsColumns.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  return <TablePanel url={url} columns={columns} rowKey="id"></TablePanel>;
};
