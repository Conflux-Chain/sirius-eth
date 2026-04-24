import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { authorizationsColumns } from 'utils/tableColumns';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { useEnhanceDataWithNameMap } from '@cfxjs/sirius-next-common/dist/utils/hooks/useEnhanceDataWithNameMap';
import { useTableData } from '@cfxjs/sirius-next-common/dist/utils/hooks/useTableData';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { OPEN_API_URLS } from 'utils/constants';

const keys = ['author', 'address', 'txSender'];

export function EIP7702Authorizations() {
  const { t } = useTranslation();
  const [ageFormat, toggleAgeFormat] = useAge();
  const { data, loading, pagination, setPagination } = useTableData({
    url: OPEN_API_URLS.eip7702Authorizations,
  });
  const { data: enhancedData } = useEnhanceDataWithNameMap(data?.list, {
    addressKeys: keys,
  });

  const columnsWidth = [4, 3, 4, 4, 4, 2, 3, 4];
  const columns = [
    authorizationsColumns.hash,
    authorizationsColumns.blockHeight,
    authorizationsColumns.authority,
    authorizationsColumns.delegatedAddress,
    authorizationsColumns.txSender,
    authorizationsColumns.nonce,
    authorizationsColumns.valid,
    authorizationsColumns.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  return (
    <>
      <Helmet>
        <title>{t(translations.eip7702Authorizations.title)}</title>
      </Helmet>
      <PageHeader>{t(translations.eip7702Authorizations.title)}</PageHeader>

      <TablePanelNew
        dataSource={enhancedData}
        pagination={pagination}
        loading={loading}
        onChange={setPagination}
        columns={columns}
        total={data?.total}
        listLimit={data?.listLimit}
        rowKey="id"
      />
    </>
  );
}
