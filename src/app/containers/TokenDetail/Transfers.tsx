import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import { CFX_TOKEN_TYPES } from 'utils/constants';
import { Card } from 'app/components/Card';
import { LineChart as Chart } from 'app/components/Chart/Loadable';
import {
  ContractContent,
  CheckCircleIcon,
} from '../AddressContractDetail/ContractContent';
import { useContract } from 'utils/api';
import AlertCircle from '@zeit-ui/react-icons/alertCircle';

import { Transfers as TokenTransfers } from 'app/containers/Tokens/Loadable';
import { Holders } from './Holders';
import { NFTs } from './NFTs';
import lodash from 'lodash';

interface TransferProps {
  tokenName: string;
  address: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  price: number;
  holderCount: number;
  transferType: string;
  isRegistered: boolean;
}

interface Query {
  accountAddress?: string;
  transactionHash?: string;
  tokenId?: string;
}

export function Transfers({ tokenData }: { tokenData: TransferProps }) {
  const {
    tokenName,
    address: tokenAddress,
    decimals,
    totalSupply,
    price,
    transferType = typeof tokenData.decimals !== 'undefined'
      ? CFX_TOKEN_TYPES.erc20
      : '',
    isRegistered,
  } = tokenData;
  const { t } = useTranslation();

  const { data: contractInfo } = useContract(tokenAddress, [
    'name',
    'iconUrl',
    'sponsor',
    'admin',
    'from',
    'website',
    'transactionHash',
    'cfxTransferCount',
    'erc20TransferCount',
    'erc721TransferCount',
    'erc1155TransferCount',
    'stakingBalance',
    'sourceCode',
    'abi',
    'isRegistered',
    'verifyInfo',
  ]);

  const tabs: any = [
    {
      value: 'transfers',
      action: 'tokenTransfers',
      label: t(translations.token.transfers),
      content: (
        <TokenTransfers
          type={transferType}
          address={tokenAddress}
          decimals={decimals}
        />
      ),
    },
  ];

  if (
    isRegistered &&
    (transferType === CFX_TOKEN_TYPES.erc20 ||
      transferType === CFX_TOKEN_TYPES.erc721 ||
      transferType === CFX_TOKEN_TYPES.erc1155)
  ) {
    tabs.push({
      value: 'holders',
      action: 'tokenHolders',
      label: t(translations.token.holders),
      content: (
        <Holders
          type={transferType}
          decimals={decimals}
          price={price}
          totalSupply={totalSupply}
          address={tokenAddress}
        />
      ),
    });
  }

  const clientWidth = document.body.clientWidth;
  let chartWidth = clientWidth - 36;

  if (clientWidth > 1350) chartWidth = 1350;
  if (chartWidth < 365) chartWidth = 365;

  const analysisPanel = () => (
    <StyledTabWrapper>
      <Card>
        <Chart
          width={chartWidth}
          indicator="tokenAnalysis"
          tokenInfo={{
            name: tokenName,
            address: tokenAddress,
            type: transferType,
          }}
        />
      </Card>
    </StyledTabWrapper>
  );

  const analysisTab = {
    value: 'analysis',
    action: 'tokenAnalysis',
    label: t(translations.token.analysis),
    content: analysisPanel(),
  };

  if (isRegistered) {
    tabs.push(analysisTab);
  }

  // trick by frontend, the better way is api always return 'verify' info
  let checkIcon: React.ReactNode = '';
  if (
    !lodash.isNil(contractInfo.isRegistered) ||
    !lodash.isNil(contractInfo.cfxTransferCount)
  ) {
    if (contractInfo.verify?.exactMatch === true) {
      checkIcon = <CheckCircleIcon />;
    } else {
      checkIcon = <AlertCircle size={16} color="#e36057" />;
    }
  }

  if (
    transferType === CFX_TOKEN_TYPES.erc721 ||
    transferType === CFX_TOKEN_TYPES.erc1155
  ) {
    tabs.push({
      value: 'NFT',
      action: 'tokenNFT',
      label: t(translations.token.NFT),
      content: <NFTs address={tokenAddress} />,
    });
  }

  // Contract tab
  tabs.push({
    value: 'contract-viewer',
    action: 'contractViewer',
    label: (
      <div>
        {t(translations.token.contract)} {checkIcon}
      </div>
    ),
    content: <ContractContent contractInfo={contractInfo} />,
  });

  return transferType ? <TabsTablePanel tabs={tabs} /> : null;
}

const StyledTabWrapper = styled.div`
  .card {
    padding: 0.3571rem !important;

    .content {
      overflow-x: auto;

      & > div {
        box-shadow: none !important;
      }
    }
  }
`;
