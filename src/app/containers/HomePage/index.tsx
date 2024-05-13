import React, { useState } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { Link } from 'sirius-next/packages/common/dist/components/Link';
import {
  useBreakpoint,
  media,
} from 'sirius-next/packages/common/dist/utils/media';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import { useTabTableData } from 'app/components/TabsTablePanel';
import { ScanEvent } from 'utils/gaConstants';
import { BlockchainInfo } from './BlockchainInfo';
import { useInterval } from 'react-use';
// import { Notices } from 'app/containers/Notices/Loadable';

import { Blocks } from './Blocks';
import { Txns } from './Txns';

export function HomePage() {
  const { t } = useTranslation();
  const bp = useBreakpoint();
  const [timestamp, setTimestamp] = useState(+new Date());

  const tabs = [
    {
      value: 'blocks',
      action: 'latestBlocks',
      label: t(translations.blocks.latestBlocks),
      content: <Blocks url={'/block?t=' + timestamp} />,
    },
    {
      value: 'transactions',
      action: 'latestTransactions',
      label: t(translations.transactions.latestTransactions),
      content: <Txns url={'/transaction?t=' + timestamp} />,
    },
  ];

  // auto update
  useInterval(() => {
    setTimestamp(+new Date());
  }, 20000);

  const { currentTabValue } = useTabTableData(tabs);

  return (
    <>
      <Helmet>
        <title>{t(translations.metadata.title)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <Main>
        {/* {bp && bp === 's' ? <Notices /> : null} */}
        <BlockchainInfo timestamp={timestamp} />
        <Bottom>
          <TabsTablePanel tabs={tabs} />
          <ViewAllLinkWrapper>
            {currentTabValue === 'blocks' ? (
              <Link
                className="viewall-link"
                href={`/blocks`}
                ga={{
                  category: ScanEvent.menu.category,
                  action: ScanEvent.menu.action.blocks,
                }}
              >
                {bp === 's'
                  ? t(translations.general.viewAll)
                  : t(translations.general.viewAllBlocks)}
              </Link>
            ) : (
              <Link
                className="viewall-link"
                href={`/txs`}
                ga={{
                  category: ScanEvent.menu.category,
                  action: ScanEvent.menu.action.transactions,
                }}
              >
                {bp === 's'
                  ? t(translations.general.viewAll)
                  : t(translations.general.viewAllTxns)}
              </Link>
            )}
          </ViewAllLinkWrapper>
        </Bottom>
      </Main>
    </>
  );
}

const Main = styled.div`
  max-width: 1368px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.57rem;
  ${media.s} {
    margin-bottom: 0;
  }
`;

const Bottom = styled.section`
  position: relative;
  width: 100%;
`;
const ViewAllLinkWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 0;
  border-bottom: 2px solid var(--theme-color-link);
  ${media.s} {
    top: 0.6429rem;
  }
  .viewall-link.link {
    color: var(--theme-color-link);
    &:hover {
      color: var(--theme-color-link-hover);
    }
  }
`;
