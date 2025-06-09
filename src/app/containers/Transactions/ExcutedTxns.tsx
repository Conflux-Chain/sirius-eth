import React, { useState, useEffect } from 'react';
import {
  tokenColunms,
  transactionColunms,
  blockColunms,
} from 'utils/tableColumns';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { TablePanel } from 'app/components/TablePanelNew';
import { Title, Footer, TxnSwitcher } from './components';
import { isAccountAddress, isAddress } from 'utils';
import { formatListResponseWithPhishingInfo } from '@cfxjs/sirius-next-common/dist/components/PhishingAddressContainer';

interface Props {
  address: string;
}

export const ExcutedTxns = ({ address }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();
  const [isAccount, setIsAccount] = useState(false);

  const url = `/transaction?accountAddress=${address}`;

  const columnsWidth = [4, 3, 3, 5, 5, 3, 4, 4, 4];
  const columns = [
    transactionColunms.hash,
    transactionColunms.method,
    blockColunms.blockHeight,
    {
      ...tokenColunms.from,
      render(text, record, index) {
        return tokenColunms.from.render(text, record, index, false);
      },
    },
    tokenColunms.to,
    transactionColunms.value,
    transactionColunms.gasPrice,
    transactionColunms.gasFee,
    transactionColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  let searchOptions = {
    transactionHash: true,
    fromOrTo: true,
    epoch: true,
    rangePicker: true,
    nonce: true,
    button: {
      col: {
        xs: 24,
        sm: 14,
        md: 14,
        lg: 14,
        xl: 14,
      },
    },
  };

  useEffect(() => {
    async function fn() {
      try {
        if (isAddress(address)) {
          setIsAccount(await isAccountAddress(address));
        }
      } catch (e) {
        console.log('excuted txns list, get address type error: ', e);
      }
    }
    fn();
  }, [address]);

  if (!isAccount) {
    // @ts-ignore
    searchOptions.nonce = false;
    searchOptions.button = {
      col: {
        xs: 24,
        sm: 18,
        md: 18,
        lg: 18,
        xl: 18,
      },
    };
    // @ts-ignore
    searchOptions.fromOrTo = {
      col: {
        xs: 24,
        sm: 12,
        md: 12,
        lg: 12,
        xl: 12,
      },
      disabled: true,
    };
  }

  const title = ({ total, listLimit }) => (
    <Title
      address={address}
      total={total}
      listLimit={listLimit}
      showFilter={true}
      showSearch={true}
      searchOptions={searchOptions}
      filterOptions={
        isAccount
          ? [
              'txTypeAll',
              'txTypeOutgoing',
              'txTypeIncoming',
              'status1',
              'txTypeCreate',
            ]
          : ['txTypeAll', 'status1', 'txTypeCreate']
      }
      extraContent={
        <TxnSwitcher total={total} isAccount={isAccount}></TxnSwitcher>
      }
    />
  );

  const footer = <Footer pathname="transaction" />;

  return (
    <TablePanel
      url={url}
      columns={columns}
      rowKey="hash"
      footer={footer}
      title={title}
      formatResponse={formatListResponseWithPhishingInfo}
    ></TablePanel>
  );
};
