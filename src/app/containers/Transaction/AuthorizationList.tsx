import React from 'react';
import { authorizationsColumns } from 'utils/tableColumns';
import { TablePanel } from 'app/components/TablePanelNew';

export const AuthorizationList = ({ hash }: { hash: string }) => {
  const url = `/stat/list-auth-action-in-tx?txHash=${hash}`;

  const columnsWidth = [2, 2, 1, 1, 1, 2, 2, 2];
  const columns = [
    authorizationsColumns.authority,
    authorizationsColumns.delegatedAddress,
    authorizationsColumns.nonce,
    authorizationsColumns.valid,
    authorizationsColumns.yParity,
    authorizationsColumns.r,
    authorizationsColumns.s,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  return (
    <TablePanel
      url={url}
      columns={columns}
      rowKey="id"
      hideDefaultTitle
      pagination={false}
    />
  );
};
