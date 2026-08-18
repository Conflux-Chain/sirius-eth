import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import qs from 'query-string';
import { useHistory, useLocation } from 'react-router-dom';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { SubTabs } from 'app/components/Tabs/Loadable';
import { Authorizations } from './Authorizations';
import { AATransactions } from './AATransactions';

type TabsItemType = {
  key: string;
  label: string;
  abi?: Array<unknown>;
  content: React.ReactNode;
};

export const OtherTransactions = ({
  address,
  showAuthorizations,
  showAATxns,
}: {
  address: string;
  showAuthorizations: boolean;
  showAATxns: boolean;
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs: Array<TabsItemType> = [];
  if (showAuthorizations) {
    tabs.push({
      key: 'authorizations',
      label: t(translations.otherTransactions.tabs.authorizations),
      content: <Authorizations address={address} />,
    });
  }
  if (showAATxns) {
    tabs.push({
      key: 'aa-txs',
      label: t(translations.otherTransactions.tabs.aaTransactions),
      content: <AATransactions address={address} />,
    });
  }

  const clickHandler = (key, index) => {
    setActiveIndex(index);
    history.push(
      qs.stringifyUrl({
        url: pathname,
        query: {
          ...qs.parse(search),
          skip: '0',
        },
      }),
    );
  };

  useEffect(() => {
    // reset index
    setActiveIndex(0);
  }, [address]);

  return (
    <Container>
      <SubTabs
        tabs={tabs}
        activeKey={tabs[activeIndex]?.key}
        onChange={clickHandler}
        className="other-transactions-subtabs"
      ></SubTabs>
      <WrapperCard>{tabs[activeIndex]?.content}</WrapperCard>
    </Container>
  );
};

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 4px;

  .other-transactions-subtabs {
    padding: 0.5714rem 1.2857rem;
    border-bottom: 1px solid #e8e9ea;
  }
`;

const WrapperCard = styled(Card)`
  padding-bottom: 1.2857rem !important;
`;
