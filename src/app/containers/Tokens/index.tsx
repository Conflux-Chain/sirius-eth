import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { tokenColunms, utils } from 'utils/tableColumns';
import styled from 'styled-components';
import { Tooltip } from 'sirius-next/packages/common/dist/components/Tooltip';
import { CFX_TOKEN_TYPES } from 'utils/constants';
import { formatNumber, formatLargeNumber } from 'utils';
import queryString from 'query-string';
// import { useGlobal } from 'utils/hooks/useGlobal';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useLocation } from 'react-router-dom';
import { Text } from 'app/components/Text/Loadable';
import { monospaceFont } from 'styles/variable';

import imgInfo from 'images/info.svg';

interface RouteParams {
  tokenType: string;
}

export function Tokens() {
  const location = useLocation();
  const { t } = useTranslation();
  // const { data: globalData } = useGlobal();
  const { tokenType = CFX_TOKEN_TYPES.erc20 } = useParams<RouteParams>();
  const { orderBy } = queryString.parse(location.search);

  let columnsWidth = [1, 7, 3, 3, 3, 3, 2];
  let columns = [
    {
      ...utils.number,
      render(value, row, index) {
        return utils.number.render(value, row, index, 3);
      },
    },
    tokenColunms.token,
    tokenColunms.contract(),
    {
      ...tokenColunms.price,
      sorter: true,
    },
    {
      ...tokenColunms.marketCap,
      sorter: true,
      defaultSortOrder: 'descend' as 'descend' | 'ascend',
      render(value, row, index) {
        const largeShrinkNumber = formatLargeNumber(value);
        return (
          <LargeNumber>
            <Text
              hoverValue={formatNumber(value, {
                precision: 2,
                withUnit: false,
              })}
            >
              <span>
                {largeShrinkNumber.value
                  ? '$' +
                    formatNumber(largeShrinkNumber.value, {
                      precision: 2,
                      withUnit: false,
                      unit: '',
                    }) +
                    largeShrinkNumber.unit
                  : '--'}
              </span>
            </Text>
          </LargeNumber>
        );
      },
    },
    {
      ...tokenColunms.transfer,
      sorter: true,
      render(value, row, index) {
        const largeShrinkNumber = formatLargeNumber(value);
        return (
          <LargeNumber>
            <Text
              hoverValue={formatNumber(value, {
                precision: 2,
                withUnit: false,
              })}
            >
              <span>
                {largeShrinkNumber.value
                  ? formatNumber(largeShrinkNumber.value, {
                      precision: 2,
                      withUnit: false,
                      unit: '',
                    }) + largeShrinkNumber.unit
                  : '--'}
              </span>
            </Text>
          </LargeNumber>
        );
      },
    },
    {
      ...tokenColunms.holders,
      sorter: true,
    },
    // {
    //   ...tokenColunms.projectInfo,
    //   sorter: true,
    // },
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  let url = `/stat/tokens/list?transferType=${
    CFX_TOKEN_TYPES.erc20
  }&reverse=true&orderBy=totalPrice&${queryString.stringify({
    fields: [
      'transferCount',
      'iconUrl',
      'price',
      'totalPrice',
      'quoteUrl',
      'transactionCount',
      'erc20TransferCount',
    ],
  })}`;
  // let url = `/stat/tokens/list?transferType=${CFX_TOKEN_TYPES.erc20}&reverse=true&orderBy=totalPrice&fields=transferCount,icon,price,totalPrice,quoteUrl,transactionCount,erc20TransferCount&currency=${globalData.currency}`; // @todo wait for new api handler
  let title = t(translations.header.tokens20);

  if (tokenType === CFX_TOKEN_TYPES.erc721) {
    columnsWidth = [1, 7, 5, 3, 3];
    columns = [
      utils.number,
      tokenColunms.token,
      tokenColunms.contract(),
      {
        ...tokenColunms.transfer,
        sorter: true,
      },
      {
        ...tokenColunms.holders,
        sorter: true,
      },
      // {
      //   ...tokenColunms.projectInfo,
      //   sorter: true,
      //   defaultSortOrder: 'descend',
      // },
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

    url = `/stat/tokens/list?transferType=${
      CFX_TOKEN_TYPES.erc721
    }&reverse=true&orderBy=securityCredits&${queryString.stringify({
      fields: ['transferCount', 'iconUrl', 'transactionCount'],
    })}`;
    // url = `/stat/tokens/list?transferType=${CFX_TOKEN_TYPES.erc721}&reverse=true&orderBy=transferCount&fields=transferCount,icon,transactionCount&currency=${globalData.currency}`; // @todo wait for new api handler
    title = t(translations.header.tokens721);
  }

  if (tokenType === CFX_TOKEN_TYPES.erc1155) {
    columnsWidth = [1, 5, 4, 2, 2];
    columns = [
      utils.number,
      tokenColunms.token,
      tokenColunms.contract(),
      {
        ...tokenColunms.transfer,
        sorter: true,
      },
      {
        ...tokenColunms.holders,
        sorter: true,
      },
      // {
      //   ...tokenColunms.projectInfo,
      //   sorter: true,
      //   defaultSortOrder: 'descend',
      // },
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

    url = `/stat/tokens/list?transferType=${
      CFX_TOKEN_TYPES.erc1155
    }&reverse=true&orderBy=securityCredits&${queryString.stringify({
      fields: ['transferCount', 'iconUrl', 'transactionCount'],
    })}`;
    // url = `/stat/tokens/list?transferType=${CFX_TOKEN_TYPES.erc1155}&reverse=true&orderBy=transferCount&fields=transferCount,icon,transactionCount&currency=${globalData.currency}`; // @todo wait for new api handler
    title = t(translations.header.tokens1155);
  }

  if (orderBy) {
    columns = columns.map(c => {
      // @ts-ignore
      if (c.dataIndex === orderBy) {
        // @ts-ignore
        c.defaultSortOrder = 'descend';
      } else {
        // @ts-ignore
        delete c.defaultSortOrder;
      }
      return c;
    });
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={t(title)} />
      </Helmet>
      <PageHeader>
        {title}
        <Tooltip
          title={t(translations.tokens.ercTip, {
            erc: tokenType.replace('ERC', 'ERC-'),
          })}
        >
          <IconWrapper>
            <img src={imgInfo} alt="?" />
          </IconWrapper>
        </Tooltip>
      </PageHeader>

      <TableWrapper>
        <TablePanelNew
          url={url}
          columns={columns}
          rowKey="address"
          pagination={{ pageSize: 100 }}
          key={tokenType}
        ></TablePanelNew>
      </TableWrapper>
    </>
  );
}

const IconWrapper = styled.div`
  display: inline-block;
  padding-left: 0.2857rem;
  width: 1.2857rem;
  cursor: pointer;
`;

const TableWrapper = styled.div`
  .token-list {
    table {
      tbody td:nth-child(2) img {
        width: 20px;
        height: 20px;
        margin-right: 7px;
      }
    }
  }
`;

const LargeNumber = styled.div`
  display: flex;
  justify-content: flex-end;
  span {
    font-family: ${monospaceFont};
  }
`;
