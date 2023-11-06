import React, { useEffect, useState, useMemo } from 'react';
import { tokenColunms, transactionColunms } from 'utils/tableColumns';
import { fetchWithPrefix } from 'utils/request';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from '@cfxjs/react-ui';
import { translations } from 'locales/i18n';
import { AddressContainer } from 'app/components/AddressContainer';
import { CopyButton } from 'app/components/CopyButton/Loadable';
import { formatAddress } from 'utils';
import styled from 'styled-components/macro';
import { publishRequestError } from 'utils';
import { NETWORK_TYPE, NETWORK_TYPES, IS_PRE_RELEASE } from 'utils/constants';
import IconQuestion from 'images/icon-question.svg';
import { Tooltip } from 'app/components/Tooltip/Loadable';

const treeToFlat = tree => {
  let list: Array<any> = [];

  try {
    const fn = (t, level: number, parentLevel) => {
      if (Array.isArray(t)) {
        t.map((item, index) => fn(item, index, parentLevel));
      } else {
        const index = `${parentLevel}_${level}`;
        list.push({
          index,
          type: `${t.action.callType || t.type}`,
          from: t.action.from,
          to: t.action.to,
          value: t.action.value,
          result: t.result,
        });
        t.calls && fn(t.calls, level + 1, `${parentLevel}_${level}`);
      }
    };

    fn(tree, 0, '');
  } catch (e) {
    throw new Error(e);
  }

  return list;
};

interface Props {
  address: string;
  from: string;
  to: string;
}

export const InternalTxns = ({ address, from, to }: Props) => {
  const { t } = useTranslation();
  const [state, setState] = useState<{
    total: number;
    data: any;
    error: any;
    loading: boolean;
  }>({
    total: 0,
    data: null,
    error: null,
    loading: false,
  });

  useEffect(() => {
    if (address) {
      setState({
        ...state,
        loading: true,
      });
      fetchWithPrefix(`/transferTree/${address}`)
        .then(resp => {
          if (resp?.traceTree) {
            try {
              const list = treeToFlat(resp.traceTree).map(l => {
                const contractInfo = resp.contractMap || {};
                const tokenInfo = resp.tokenMap || {};
                return {
                  ...l,
                  fromContractInfo: contractInfo[l.from] || {},
                  toContractInfo: contractInfo[l.to] || {},
                  fromTokenInfo: tokenInfo[l.from] || {},
                  toTokenInfo: tokenInfo[l.to] || {},
                };
              });
              setState({
                ...state,
                data: list,
                total: list.length,
              });
            } catch (e) {
              console.log('trace parse error: ', e);
              publishRequestError({ code: 60002, message: e.message }, 'code');
            }
          } else {
            setState({
              ...state,
              loading: false,
            });
          }
        })
        .catch(e => {
          setState({
            ...state,
            error: e,
          });
        })
        .finally(() => {
          setState(state => ({
            ...state,
            loading: false,
          }));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const AdvancedViewLink = useMemo(() => {
    const sld = NETWORK_TYPE === NETWORK_TYPES.mainnet ? 'evm' : 'evmtestnet';
    const preOrPro = IS_PRE_RELEASE ? '-stage' : '';
    const domain = window.location.hostname.includes('.io') ? 'io' : 'net';

    return `https://${sld}${preOrPro}.confluxscan.${domain}/tracer#${address}`;
  }, [address]);

  const columnsWidth = [3, 4, 4, 3, 3, 5];
  const columns = [
    tokenColunms.traceType,
    {
      ...tokenColunms.from,
      render: (value, row, index) =>
        tokenColunms.from.render(value, row, undefined, false),
    },
    tokenColunms.to,
    transactionColunms.value,
    tokenColunms.traceOutcome,
    tokenColunms.traceResult,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const fromContent = (isFull = false) => (
    <span>
      <AddressContainer value={from} isFull={isFull} />{' '}
      <CopyButton copyText={formatAddress(from)} />
    </span>
  );
  const toContent = (isFull = false) => (
    <span>
      <AddressContainer value={to} isFull={isFull} />{' '}
      <CopyButton copyText={formatAddress(to)} />
    </span>
  );

  const { data, total, loading } = state;

  const tableHeader = () => {
    return (
      <StyledTipWrapper>
        <div>
          {t(translations.transaction.internalTxnsTip.from)} {fromContent()}{' '}
          {t(translations.transaction.internalTxnsTip.to)} {toContent()}{' '}
          {t(translations.transaction.internalTxnsTip.produced)}{' '}
          <StyledCountWrapper>{total}</StyledCountWrapper>{' '}
          <Trans
            i18nKey="transaction.internalTxnsTip.txns"
            count={total}
          ></Trans>
        </div>
        <StyledAdvancedWrapper>
          <Tooltip
            text={t(translations.transaction.advancedViewTips)}
            placement="top"
          >
            <img src={IconQuestion} alt="tips" />
          </Tooltip>

          <Link href={AdvancedViewLink} target={'_blank'}>
            <StyledAdvancedBtn>Advanced View</StyledAdvancedBtn>
          </Link>
        </StyledAdvancedWrapper>
      </StyledTipWrapper>
    );
  };

  return (
    <TablePanelNew
      columns={columns}
      pagination={false}
      dataSource={data}
      loading={loading}
      title={tableHeader}
    ></TablePanelNew>
  );
};

const StyledTipWrapper = styled.span`
  color: #94a3b6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledCountWrapper = styled.span`
  color: #1e3de4;
`;
const StyledAdvancedWrapper = styled.div`
  display: flex;
  gap: 11px;
`;
const StyledAdvancedBtn = styled.div`
  height: 24px;
  border: solid 1px #b7b7b7;
  background: #f5f5f5;
  padding: 3px 9px;
  border-radius: 3px;
  color: #000;
  font-size: 12px;
`;
