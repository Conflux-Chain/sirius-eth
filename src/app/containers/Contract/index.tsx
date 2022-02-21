import React, { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ContractOrTokenInfo } from 'app/components/Contract/Loadable';
import { useCMContractQuery } from 'utils/api';

export function Contract(props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const matchParams = props.match.params;
  const contractAddress = matchParams.contractAddress;
  const fields = [
    'address',
    'type',
    'name',
    'website',
    'token',
    'typeCode',
    'verifyInfo',
  ];
  const params = useMemo(() => ({ address: contractAddress, fields }), [
    contractAddress,
    fields,
  ]);
  const { data, error } = useCMContractQuery(params);

  useEffect(() => {
    if (!data && !error) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [data, error]);

  return (
    <>
      <Helmet>
        <title>{t(translations.header.contract)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      {data && (
        <ContractOrTokenInfo
          contractDetail={data}
          address={contractAddress}
          loading={loading}
        ></ContractOrTokenInfo>
      )}
    </>
  );
}
