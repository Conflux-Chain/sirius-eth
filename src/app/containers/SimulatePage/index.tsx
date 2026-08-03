import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { usePortal } from 'utils/hooks/usePortal';
import { TabsTablePanel } from 'app/components/TabsTablePanel';
import { SimulateTrace } from './SimulateTrace';
import { EVMAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/EVMAddressContainer';
import { useDecodeFunctionData } from '@cfxjs/sirius-next-common/dist/utils/hooks/useDecodeFunctionData';
import { ValueHighlight } from '@cfxjs/sirius-next-common/dist/components/Highlight';
import simulateImg from 'images/simulate.svg';
import { useSimulateTrace } from '@cfxjs/sirius-next-common/dist/utils/hooks/useSimulateTrace';
import { transformNameMapKeysToLowerCase } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAddressNameMap';
import { decodeCalldataFromUrl } from '@cfxjs/sirius-next-common/dist/utils/calldataUrl';
import { SimulateLogs } from './SimulateLogs';
import { Button } from '@cfxjs/react-ui';
import { ConnectButton } from 'app/components/ConnectWallet';
import { isAddress } from 'utils';
import { Hex } from '@cfxjs/sirius-next-common/dist/utils/types';
import { ZERO_ADDRESS_HEX } from '@cfxjs/sirius-next-common/dist/utils/constants';

const getStringParam = (value: unknown) =>
  typeof value === 'string' ? value : undefined;

const getTabQuery = (params: Record<string, unknown>) => {
  const query: Record<string, string> = {};
  const keys = ['from', 'to', 'data', 'value', 'gas'] as const;

  keys.forEach(key => {
    const value = getStringParam(params[key]);
    if (value !== undefined) query[key] = value;
  });

  const gasPrice =
    getStringParam(params.gasPrice) || getStringParam(params.price);
  if (gasPrice !== undefined) query.gasPrice = gasPrice;

  return query;
};

const useSimulateParams = (params: Record<string, string>) => {
  const { account } = usePortal();
  const decodedData = useMemo(() => decodeCalldataFromUrl(params.data), [
    params.data,
  ]);
  const to = isAddress(params.to, false) ? (params.to as Hex) : undefined;
  if (!decodedData.ok || !to) return;
  const from = isAddress(params.from, false)
    ? (params.from as Hex)
    : (account as Hex) || ZERO_ADDRESS_HEX;
  const value = Number.isNaN(Number(params.value)) ? '0x0' : params.value;
  const gasPrice = Number.isNaN(Number(params.gasPrice))
    ? undefined
    : params.gasPrice;
  const gas = Number.isNaN(Number(params.gas)) ? undefined : params.gas;
  return {
    from,
    to,
    value,
    data: decodedData.data,
    gasPrice,
    gas,
    space: 'evm',
  } as const;
};

export const SimulatePage = () => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const params = useMemo(() => qs.parse(search), [search]);
  const tabQuery = useMemo(() => getTabQuery(params), [params]);
  const simulateParams = useSimulateParams(tabQuery);
  const [result] = useDecodeFunctionData({
    to: simulateParams?.to,
    input: simulateParams?.data,
    space: 'evm',
  });
  const isViewMethod =
    result.abiItem?.stateMutability === 'view' ||
    result.abiItem?.stateMutability === 'pure';
  const { data: traceData, isValidating, mutate } = useSimulateTrace({
    tx: simulateParams,
    disabled: !simulateParams,
  });
  const { list = [], total = 0, logs } = traceData ?? {};
  const nameMap = useMemo(() => {
    return transformNameMapKeysToLowerCase(list[0]?.nameMap);
  }, [list]);

  let tabs = [
    {
      value: 'simulate-trace',
      label: t(translations.simulateTrace.simulateTrace),
      content: (
        <SimulateTrace
          nameMap={nameMap}
          list={list}
          total={total}
          isLoading={isValidating}
          from={simulateParams?.from}
          to={simulateParams?.to}
        />
      ),
    },
    {
      value: 'logs',
      label: t(translations.simulateTrace.simulateLogs),
      content: <SimulateLogs logs={logs} isLoading={isValidating} />,
      hidden: !logs || logs.length === 0,
    },
  ];

  const functionName =
    result.abiItem?.name ||
    (simulateParams && simulateParams.data && simulateParams.data.length > 10
      ? simulateParams.data.slice(0, 10)
      : undefined);
  const calldataError = simulateParams
    ? ''
    : t(translations.simulateTrace.invalidUrl);

  return (
    <StyledContainer>
      <StyledHeader>
        <div className="simulate-title">
          <img src={simulateImg} alt="" />
          <span>{t(translations.simulateTrace.simulateTransaction)}</span>
        </div>
        <div className="simulate-info">
          {simulateParams?.from && (
            <div className="simulate-contract">
              {t(translations.simulateTrace.from)}:{' '}
              <ValueHighlight scope="address" value={simulateParams.from}>
                <EVMAddressContainer
                  value={simulateParams.from}
                  nameMap={nameMap}
                  showVerificationName
                />
              </ValueHighlight>
            </div>
          )}
          {simulateParams?.to && (
            <div className="simulate-contract">
              {t(translations.simulateTrace.contract)}:{' '}
              <ValueHighlight scope="address" value={simulateParams.to}>
                <EVMAddressContainer
                  value={simulateParams.to}
                  nameMap={nameMap}
                  showVerificationName
                />
              </ValueHighlight>
            </div>
          )}
          {functionName && (
            <div>
              {t(translations.simulateTrace.function)}: {functionName}
            </div>
          )}
        </div>
        {!isViewMethod && !simulateParams?.from && (
          <div className="connect-wallet-tip">
            {t(translations.connectWallet.tip)}
          </div>
        )}
        {calldataError && <div className="calldata-error">{calldataError}</div>}
      </StyledHeader>
      {simulateParams && (
        <ContentContainer>
          {isViewMethod ? (
            <Button
              variant="solid"
              color="primary"
              className="btnComp"
              onClick={() => mutate()}
            >
              {t(translations.simulateTrace.button.reSimulate)}
            </Button>
          ) : (
            <ConnectButton>
              <Button
                variant="solid"
                color="primary"
                className="btnComp"
                onClick={() => mutate()}
              >
                {t(translations.simulateTrace.button.reSimulate)}
              </Button>
            </ConnectButton>
          )}
          <TabsTablePanel tabs={tabs} query={tabQuery} />
        </ContentContainer>
      )}
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StyledHeader = styled.div`
  background: #fff;
  padding: 6px 24px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .simulate-title {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #282d30;
    font-size: 28px;
    font-weight: 700;
    line-height: 32px;

    img {
      width: 28px;
      height: 28px;
    }
  }

  .simulate-info {
    display: flex;
    align-items: center;
    gap: 24px;
    color: #282d30;
    font-size: 14px;
    font-weight: 450;
    line-height: 20px;

    .simulate-contract {
      display: flex;
      align-items: center;
    }
  }
  .connect-wallet-tip {
    color: red;
  }
  .calldata-error {
    color: red;
  }
`;

const ContentContainer = styled.div`
  position: relative;
  background: #fff;
  padding: 6px 0;
  .btnComp.btn {
    position: absolute;
    top: 10px;
    right: 10px;
    height: 30px;
    line-height: 30px;
    min-width: initial;
    margin-left: 0;
    .text {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
`;
