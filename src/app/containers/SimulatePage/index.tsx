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
import { Hex } from '@cfxjs/sirius-next-common/dist/utils/sdk';
import { ValueHighlight } from '@cfxjs/sirius-next-common/dist/components/Highlight';
import simulateImg from 'images/simulate.svg';
import { useSimulateTrace } from '@cfxjs/sirius-next-common/dist/utils/hooks/useSimulateTrace';
import { transformNameMapKeysToLowerCase } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAddressNameMap';
import { SimulateLogs } from './SimulateLogs';
import { Button } from '@cfxjs/react-ui';
import { ConnectButton } from 'app/components/ConnectWallet';

export const SimulatePage = () => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const { account } = usePortal();
  const params = useMemo(() => qs.parse(search), [search]);
  const from = account || '';
  const to = params.to as string;
  const data = params.data as Hex;
  const value = params.value as string;
  const [result] = useDecodeFunctionData({
    to,
    input: data,
    space: 'evm',
  });
  const { data: traceData, isValidating, mutate } = useSimulateTrace({
    from: account,
    to,
    value,
    data,
    space: 'evm',
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
    (to && data && data.length > 10 ? data.slice(0, 10) : undefined);

  return (
    <StyledContainer>
      <StyledHeader>
        <div className="simulate-title">
          <img src={simulateImg} alt="" />
          <span>{t(translations.simulateTrace.simulateTransaction)}</span>
        </div>
        <div className="simulate-info">
          {to && (
            <div className="simulate-contract">
              {t(translations.simulateTrace.contract)}:{' '}
              <ValueHighlight scope="address" value={to}>
                <EVMAddressContainer
                  value={to}
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
        {!from && (
          <div className="connect-wallet-tip">
            {t(translations.connectWallet.tip)}
          </div>
        )}
      </StyledHeader>
      {from && (
        <ContentContainer>
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
          <TabsTablePanel
            tabs={tabs}
            query={{
              to,
              data,
              value,
            }}
          />
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
