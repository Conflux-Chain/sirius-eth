import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TipLabel } from 'app/components/TabsTablePanel/Loadable';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { accountColunms, utils as tableColumnsUtils } from 'utils/tableColumns';
import styled from 'styled-components';
import { Select } from '@cfxjs/sirius-next-common/dist/components/Select';
import { Option } from 'styles/global-styles';
import { usePortal } from 'utils/hooks/usePortal';
import { EVMAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/EVMAddressContainer';
import { formatAddress, checkIfContractByInfo } from 'utils';
import { monospaceFont } from 'styles/variable';
import { AccountWrapper } from 'utils/tableColumns/token';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

const { ContentWrapper } = tableColumnsUtils;

export function Accounts() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  // get portal selected address
  const { accounts } = usePortal();

  let columnsWidth = [2, 9, 4, 3, 3];
  let columns = [
    accountColunms.rank,
    {
      ...accountColunms.address,
      render: (value, row: any) => (
        <AccountWrapper>
          <EVMAddressContainer
            value={value}
            alias={
              row.name ||
              (row.tokenInfo && row.tokenInfo.name ? row.tokenInfo.name : null)
            }
            isFull={true}
            isMe={
              accounts && accounts.length > 0
                ? formatAddress(accounts[0]) === formatAddress(value)
                : false
            }
            isContract={checkIfContractByInfo(value, row)}
          />
        </AccountWrapper>
      ),
    },
    {
      ...accountColunms.balance,
      title: (
        <ContentWrapper right>
          {t(translations.accounts.balance)}
        </ContentWrapper>
      ),
      dataIndex: 'value2',
      key: 'value2',
    },
    accountColunms.percentage,
    accountColunms.count,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const title = t(translations.header.accounts);
  const url = `/stat/top-cfx-holder?type=rank_address_by_cfx&limit=100`;

  const handleDownloadItemClick = (count: string) => {
    window.open(
      `/stat/top-cfx-holder-csv?limit=${count}&skip=0&type=rank_address_by_cfx`,
      '_blank',
    );
  };

  const tableTitle = useMemo(
    () => {
      return (
        <StyledSelectWrapper isEn={isEn} className="download">
          {/* not good, should be replace with real dropdown or refactor Select Component to support */}
          <Select
            onChange={handleDownloadItemClick}
            disableMatchWidth
            size="small"
            className="btnSelectContainer"
            lable={t(translations.accounts.downloadButtonText)}
          >
            {['100', '500', '1000', '3000', '5000'].map(
              (o: string, index: number) => {
                return (
                  <Option key={index} value={String(o)}>
                    {o}
                  </Option>
                );
              },
            )}
          </Select>
        </StyledSelectWrapper>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEn],
  );

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={t(title)} />
      </Helmet>
      <PageHeader>{title}</PageHeader>
      <TipLabel
        total={100}
        left={t(translations.accounts.tipLeft, {
          type: t(translations.accounts.balance),
        })}
        right={t(translations.accounts.tipRight, {
          type: t(translations.accounts.balance),
        })}
      />
      <StyledTableWrapper>
        <TablePanelNew
          url={url}
          columns={columns}
          rowKey="hex"
          pagination={false}
          title={() => tableTitle}
        ></TablePanelNew>
      </StyledTableWrapper>
    </>
  );
}

const StyledTableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2.57rem;
  background-color: #fff;
  font-family: ${monospaceFont};
`;

const StyledSelectWrapper = styled.div<{
  isEn: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 1.4286rem;
    right: 1.4286rem;
  }

  .selectLabel {
    &:first-child {
      margin-right: 0.4286rem;
    }

    &:last-child {
      margin-left: ${props => (props.isEn ? '0' : '0.4286rem')};
    }
  }

  .select.btnSelectContainer .option.selected,
  .selectLabel {
    color: #8890a4;
    font-size: 0.8571rem;
    font-weight: normal;
  }

  .select.btnSelectContainer {
    background: rgba(30, 61, 228, 0.04);
    &:hover {
      background: rgba(30, 61, 228, 0.08);
    }
  }

  /* download button */
  &.download {
    margin-left: 0.7143rem;
  }
`;
