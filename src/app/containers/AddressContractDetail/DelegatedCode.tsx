import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ContractAbi } from 'app/components/ContractAbi/Loadable';
import styled from 'styled-components';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { CFX } from 'utils/constants';

import { SubTabs } from 'app/components/Tabs/Loadable';
import { Code } from './ContractContent';

type TabsItemType = {
  key: string;
  label: string;
  content: React.ReactNode;
};

export const DelegatedCode = ({ address, delegatedContractInfo }) => {
  const { t } = useTranslation();
  const { abi, verify = {}, destroy = {} } = delegatedContractInfo;
  const [activeIndex, setActiveIndex] = useState(0);
  const [initError, setInitError] = useState(false);

  // some contract init will trigger SDK error, need SDK to solve it
  useEffect(() => {
    try {
      CFX.Contract({
        abi,
        address,
      });
      setInitError(false);
    } catch (error) {
      setInitError(true);
    }
  }, [abi, address]);

  let tabs: Array<TabsItemType> = [
    {
      key: 'code',
      label: t(translations.contract.code),
      content: <Code isDelegated contractInfo={delegatedContractInfo} />,
    },
  ];

  if (!initError && abi && destroy.status === 0 && Object.keys(verify).length) {
    tabs = tabs.concat([
      {
        key: 'readAsProxy',
        label: t(translations.contract.readAsProxyContract),
        content: (
          <ContractAbi
            type="read"
            address={address}
            abi={abi}
            key={`contract-read-${address}`}
          ></ContractAbi>
        ),
      },
      {
        key: 'writeAsProxy',
        label: t(translations.contract.writeAsProxyContract),
        content: (
          <ContractAbi
            type="write"
            address={address}
            abi={abi}
            key={`contract-write-${address}`}
          ></ContractAbi>
        ),
      },
    ]);
  }

  const clickHandler = (key: string, index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    // reset index
    setActiveIndex(0);
  }, [address]);

  return (
    <ContractBody>
      <SubTabs
        tabs={tabs}
        activeKey={tabs[activeIndex]?.key}
        onChange={clickHandler}
        className="contract-body-subtabs"
      ></SubTabs>
      <ContractCard>{tabs[activeIndex]?.content}</ContractCard>
    </ContractBody>
  );
};

const ContractBody = styled.div`
  background-color: #ffffff;
  border-radius: 4px;

  .contract-body-subtabs {
    padding: 0.5714rem 1.2857rem;
    border-bottom: 1px solid #e8e9ea;
  }
`;

const ContractCard = styled(Card)`
  padding-bottom: 1.2857rem !important;
`;
