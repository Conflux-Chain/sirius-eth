import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { Table, Pagination, Skeleton } from '@cfxjs/react-ui';
import { PaginationProps } from '@cfxjs/react-ui/dist/pagination/pagination';
import { Props as TableProps } from '@cfxjs/react-ui/dist/table/table';
import clsx from 'clsx';
import styled from 'styled-components';
import { Card } from '../Card';
import { media, useBreakpoint } from 'styles/media';
import { useTableData } from '../TabsTablePanel';
import descIcon from 'images/table-desc.svg';
import descHoverIcon from 'images/table-desc-hover.svg';
import ascIcon from 'images/table-asc.svg';
import ascHoverIcon from 'images/table-asc-hover.svg';
import { Empty } from '../Empty';
import { monospaceFont } from 'styles/variable';

export type { ColumnsType } from '@cfxjs/react-ui/dist/table/table';
export type TableType = TableProps<any> & {
  sortOrder?: string; // sort order: asc / desc
  // default sort key
  // should equal dataIndex, not equal url param
  // url param should handle in sorter function
  sortKey?: string;
  // sort function, update url TODO more flexibility
  sorter?: (opt: {
    column?: any;
    table?: any;
    url?: string;
    oldSortKey?: string;
    oldSortOrder?: string;
    newSortKey?: string;
  }) => any;
};
export type TablePanelType = {
  url: string;
  pagination?: PaginationProps | boolean;
  table: TableType;
  hasFilter?: boolean;
  className?: string;
  tableHeader?:
    | React.ReactNode
    | Array<React.ReactNode>
    | ((option: Object) => React.ReactNode);
  tableFooter?:
    | React.ReactNode
    | Array<React.ReactNode>
    | ((option?: Object) => React.ReactNode);
};

const mockTableConfig = (columns, type = 'skeleton') => {
  const mockTableColumns = columns.map((item, i) => ({
    title: item.title,
    id: i,
    key: i,
    dataIndex: 'key',
    width: item.width,
    render: () => (
      <div
        style={{
          visibility: type === 'skeleton' ? 'visible' : 'hidden',
        }}
      >
        <Skeleton />
      </div>
    ),
  }));
  let mockTableData: Array<{ id: number }> = [];
  const mockTableRowKey: string = 'id';
  for (let i = 0; i < 10; i++) {
    mockTableData.push({ id: i });
  }
  return {
    mockTableColumns,
    mockTableData,
    mockTableRowKey,
  };
};

// pagination default config
const defaultPaginationConfig: PaginationProps = {
  total: 0,
  page: 1,
  pageSize: 10,
  showPageSizeChanger: true,
  showQuickJumper: true,
  size: 'small',
  variant: 'solid',
  onPageChange: () => {},
  onPageSizeChange: () => {},
};
// mobile pagination default config
const defaultPaginationMobileConfig: PaginationProps = {
  ...defaultPaginationConfig,
  labelPageSizeBefore: '',
  labelPageSizeAfter: '',
  limit: 3,
};
// table default config
const defaultTableConfig: TableType = {
  data: [],
  rowKey: 'key',
  columns: [],
  variant: 'solid',
};

export const TablePanel = ({
  url,
  pagination,
  table,
  hasFilter = false,
  tableHeader: outerTableHeader = null,
  tableFooter: outerTableFooter = null,
}: TablePanelType) => {
  const {
    pageNumber,
    pageSize,
    total,
    realTotal,
    data,
    gotoPage,
    setPageSize,
  } = useTableData(url);

  const [cacheTotal, setCacheTotal] = useState(total);

  useEffect(() => {
    total && total !== cacheTotal && setCacheTotal(total);
    /* eslint-disable-next-line */
  }, [total, url]);

  const { t } = useTranslation();
  const breakpoint = useBreakpoint();
  const paginationObject = typeof pagination === 'boolean' ? {} : pagination;
  const mergedPaginationConfig = {
    labelPageSizeBefore: t(translations.general.pagination.labelPageSizeBefore),
    labelPageSizeAfter: t(translations.general.pagination.labelPageSizeAfter),
    labelJumperBefore: t(translations.general.pagination.labelJumperBefore),
    labelJumperAfter: t(translations.general.pagination.labelJumperAfter),
    simple: breakpoint === 's',
    ...(breakpoint === 's'
      ? defaultPaginationMobileConfig
      : defaultPaginationConfig),
    ...paginationObject,
  };
  let tableData = table.data;
  let tableColumns = table?.columns?.map(c => {
    if (c['sortable'] && table.sorter) {
      return {
        ...c,
        title: (
          <div
            className={`sortable ${
              table.sortKey === c['dataIndex']
                ? `${table.sortKey} ${table.sortOrder}`
                : ''
            }`}
            onClick={() => {
              table.sorter!({
                column: c,
                table: table,
                url: url,
                oldSortKey: table.sortKey,
                oldSortOrder: table.sortOrder,
                newSortKey: c['dataIndex'],
              });
            }}
          >
            {c.title}
          </div>
        ),
      };
    }

    return c;
  });
  let tableRowKey = table.rowKey;

  // loading table
  if (!data) {
    const {
      mockTableColumns,
      mockTableData,
      mockTableRowKey,
    } = mockTableConfig(tableColumns, 'skeleton');

    tableData = mockTableData;
    tableColumns = mockTableColumns;
    tableRowKey = mockTableRowKey;
  } else {
    tableData = data?.list || table.data;
  }

  // empty table
  const empty = !tableData?.length;
  if (empty) {
    const {
      mockTableColumns,
      mockTableData,
      mockTableRowKey,
    } = mockTableConfig(tableColumns, 'empty');

    tableData = mockTableData;
    tableColumns = mockTableColumns;
    tableRowKey = mockTableRowKey;
  }

  const numberPage = Number(pageNumber);
  const numberPageSize = Number(pageSize);
  const numberCacheTotal = cacheTotal;
  const showPagination =
    pagination !== false && numberCacheTotal > numberPageSize;

  let tableHeader: TablePanelType['tableHeader'] = outerTableHeader;
  if (typeof tableHeader === 'function') {
    // add related params to tableHeader
    tableHeader = tableHeader({
      total: realTotal,
      data: tableData,
    });
  }

  let tableFooter: TablePanelType['tableFooter'] = outerTableFooter;
  if (typeof tableFooter === 'function') {
    // add related params to tableFooter
    tableFooter = tableFooter({});
  }

  return (
    <>
      <StyledTableWrapper hasFilter={hasFilter}>
        <Card>
          {tableHeader && (
            <StyledTableHeaderWrapper key={url}>
              {tableHeader}
            </StyledTableHeaderWrapper>
          )}
          <div className="table-body">
            <Table
              className={clsx('sirius-table', table.className)}
              tableLayout="fixed"
              columns={tableColumns}
              data={tableData}
              rowKey={tableRowKey}
              scroll={{ x: 1200 }}
            />
            {/* may rewrite a new Table component with empty placeholder is better */}
            <Empty show={empty} type="fixed" />
            {tableFooter && (
              <StyledTableFooterWrapper key={url}>
                {tableFooter}
              </StyledTableFooterWrapper>
            )}
          </div>
        </Card>
      </StyledTableWrapper>
      {showPagination && (
        <StyledPaginationWrapper>
          <Pagination
            {...mergedPaginationConfig}
            className={clsx(
              'sirius-pagination',
              mergedPaginationConfig.className,
              {
                hide: empty,
              },
            )}
            onPageChange={(page: number) => gotoPage(page)}
            onPageSizeChange={(page: number, pageSize: number) =>
              setPageSize(pageSize)
            }
            page={numberPage}
            pageSize={numberPageSize}
            total={numberCacheTotal}
          />
        </StyledPaginationWrapper>
      )}
    </>
  );
};

TablePanel.defaultProps = {
  url: '',
  pagination: defaultPaginationConfig,
  table: defaultTableConfig,
};

const StyledTableFooterWrapper = styled.div`
  padding: 0 0 0.7143rem 0;
`;

const StyledTableHeaderWrapper = styled.div`
  padding: 0.7143rem 0;
  border-bottom: 1px solid #e8e9ea;
`;

const StyledTableWrapper: any = styled.div`
  .card {
    position: relative;
    background-color: red;
  }
  .table-body {
    position: relative;
  }
  .table.sirius-table {
    line-height: 1.7143rem;
    ${(props: any) =>
      props.hasFilter ? 'margin-top: 54px; border-top: 1px solid #e8e9ea;' : ''}
    .table-content {
      padding: 0 0 1rem;

      > table {
        width: 1100px !important;
      }
    }
    &.transaction-wide {
      .table-content > table {
        width: 1180px !important;
      }
    }
    &.monospaced {
      font-family: ${monospaceFont};
    }
    th.table-cell {
      white-space: nowrap;
      padding: 1.1429rem calc((0.5714rem / 2) * 3);
      color: #9b9eac;

      .sortable {
        cursor: pointer;
        background-position: right center;
        background-repeat: no-repeat;
        background-size: 12px 12px;

        &:hover {
          color: #65709a;
        }

        &.desc,
        &.asc {
          padding-right: 15px;
        }

        &.desc {
          background-image: url(${descIcon});

          &:hover {
            background-image: url(${descHoverIcon});
          }
        }

        &.asc {
          background-image: url(${ascIcon});

          &:hover {
            background-image: url(${ascHoverIcon});
          }
        }
      }
    }
    td.table-cell {
      font-size: 1rem;
      font-weight: 400;
      color: #333333;
      padding: 1.2857rem calc((0.5714rem / 2) * 3);
      white-space: nowrap;

      ${media.s} {
        padding: 1.1429rem 1rem;
      }
    }
    ${media.s} {
      margin-top: 0;
      border-top: 0;
    }
  }
`;

export const StyledPaginationWrapper = styled.div`
  .pagination.sirius-pagination {
    margin: 1.7143rem 0;

    &.hide {
      visibility: hidden;
    }

    .left,
    .right {
      margin-top: 0;
    }

    button:not(.active) {
      background-color: rgba(0, 84, 254, 0.04);

      &:not(.disabled):hover {
        background-color: rgba(0, 84, 254, 0.1);
      }
    }

    .input-wrapper.solid,
    .select {
      background-color: rgba(0, 84, 254, 0.04);
      border-color: transparent;

      &.hover,
      &:hover {
        background-color: #e0eaff;
        border-color: transparent;
      }

      input {
        color: #74798c;
        font-size: 1rem;
        font-weight: 500;
      }

      &.focus:not(.disabled),
      &.hover:not(.disabled) {
        input {
          color: #74798c;
        }
      }
    }

    div.text,
    button:not(.active),
    .option span {
      font-size: 1rem;
      font-weight: 500;
      color: #74798c;
      line-height: 1.2857rem;
    }

    ${media.s} {
      margin-bottom: 0.4286rem;
    }
  }
`;
