import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import { isZeroAddress } from 'utils';
import { CFX_TOKEN_TYPES } from 'utils/constants';
import { ContractContent } from './ContractContent';
import { ExcutedAndPendingTxns } from 'app/containers/Transactions/Loadable';
import { Contract } from '../Charts/Loadable';

import {
  CFXTxns,
  CRC20Txns,
  CRC721Txns,
  CRC1155Txns,
} from 'app/containers/Transactions/Loadable';
import { NFTAsset } from 'app/containers/NFTAsset/Loadable';
import styled from 'styled-components';
import { ContractStatus } from '../AddressContractDetail/ContractStatus';
import type { EvmAddressType } from '@cfxjs/sirius-next-common/dist/utils/address';
import { Authorizations } from './Loadable';

export const Table = memo(
  ({
    address,
    addressInfo,
    type,
  }: {
    address: string;
    addressInfo: any;
    type: EvmAddressType;
  }) => {
    const { t } = useTranslation();
    const isContract = type === 'contract';

    const tabs: any = [
      {
        value: `transaction`,
        action: 'accountTransactions',
        label: t(translations.general.transactions),
        content: <ExcutedAndPendingTxns address={address} />,
      },
      {
        hidden: !addressInfo.cfxTransferTab,
        value: `transfers-${CFX_TOKEN_TYPES.cfx}`,
        action: 'cfxTransfers',
        label: t(translations.general.transfer),
        content: <CFXTxns address={address} />,
      },
      {
        hidden: !addressInfo.erc20TransferTab,
        value: `transfers-${CFX_TOKEN_TYPES.erc20}`,
        action: 'transfersErc20',
        label: t(translations.general.tokenTxnsErc20),
        content: <CRC20Txns address={address} />,
      },
      {
        hidden: !addressInfo.erc721TransferTab,
        value: `transfers-${CFX_TOKEN_TYPES.erc721}`,
        action: 'transfersErc721',
        label: t(translations.general.tokenTxnsErc721),
        content: <CRC721Txns address={address} />,
      },
      {
        hidden: !addressInfo.erc1155TransferTab,
        value: `transfers-${CFX_TOKEN_TYPES.erc1155}`,
        action: 'transfersErc1155',
        label: t(translations.general.tokenTxnsErc1155),
        content: <CRC1155Txns address={address} />,
      },
    ];

    if (!isZeroAddress(address)) {
      tabs.push({
        hidden: !addressInfo.nftAssetTab,
        value: 'nft-asset',
        action: 'NFTAsset',
        label: t(translations.addressDetail.NFTAsset),
        content: <NFTAsset />,
      });
    }

    const analysisPanel = () => (
      <StyledTabWrapper>
        <Contract address={address} />
      </StyledTabWrapper>
    );

    if (isContract) {
      tabs.push(
        {
          value: 'analysis',
          action: 'contractAnalysis',
          label: t(translations.token.analysis),
          content: analysisPanel(),
        },
        {
          value: 'contract-viewer',
          action: 'contractViewer',
          label: (
            <div>
              {t(translations.token.contract)}
              <ContractStatus contract={addressInfo} />
            </div>
          ),
          content: <ContractContent contractInfo={addressInfo} />,
        },
      );
    } else {
      tabs.push({
        hidden: !addressInfo.authorizationsTab,
        value: 'auth-list',
        action: 'authList',
        label: t(translations.authList.authorizations),
        content: <Authorizations address={address} />,
      });
    }

    return <TabsTablePanel key="table" tabs={tabs} />;
  },
);
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
