import React from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { renderAddress } from './utils';
import NotApplicable from 'app/components/TxnComponents/NotApplicable';

import {
  formatBalance,
  formatNumber,
} from '@cfxjs/sirius-next-common/dist/utils';
import { ValueHighlight } from '@cfxjs/sirius-next-common/dist/components/Highlight';
import { ErrorDecode } from '@cfxjs/sirius-next-common/dist/components/OutputData/ErrorDecode';
import {
  Failed,
  Warning,
} from '@cfxjs/sirius-next-common/dist/components/Icons';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';

const AAFailedReason = ({ data }) => {
  const { t } = useTranslation();
  return (
    <ErrorDecode
      errorData={data}
      space="evm"
      fallback={t(translations.accountAbstraction.aaTxFailed)}
    />
  );
};

export const aaHash = {
  title: (
    <Translation>
      {t => t(translations.general.table.aaTransaction.userOpHash)}
    </Translation>
  ),
  dataIndex: 'userOpHash',
  key: 'userOpHash',
  width: 1,
  render: (value, row) => {
    return (
      <HashWrapper>
        {row.success === false && (
          <Tooltip
            title={
              row.failedReason && <AAFailedReason data={row.failedReason} />
            }
            className="tooltip-trigger"
          >
            <Failed className="status" />
          </Tooltip>
        )}
        <Link href={`/tx/${value}`}>
          <Text tag="span" hoverValue={value}>
            <SpanWrap>{value}</SpanWrap>
          </Text>
        </Link>
      </HashWrapper>
    );
  },
};

export const bundleHash = {
  title: (
    <Translation>
      {t => t(translations.general.table.aaTransaction.bundleHash)}
    </Translation>
  ),
  dataIndex: 'txHash',
  key: 'txHash',
  width: 1,
  render: (value, row, index, showError = true) => {
    return (
      <HashWrapper>
        {/* bundle tx failed */}
        {showError && row.status !== 0 && (
          <Tooltip title={row.errMsg} className="tooltip-trigger">
            <Failed className="status" />
          </Tooltip>
        )}
        {/* internal aa tx failed */}
        {showError && row.failedTxCount !== 0 && (
          <Tooltip
            title={
              <Translation>
                {t => t(translations.accountAbstraction.internalTxFailed)}
              </Translation>
            }
            className="tooltip-trigger"
          >
            <Warning className="status warning" />
          </Tooltip>
        )}
        <Link href={`/tx/${value}`}>
          <Text tag="span" hoverValue={value}>
            <SpanWrap>{value}</SpanWrap>
          </Text>
        </Link>
      </HashWrapper>
    );
  },
};

export const from = {
  title: (
    <Translation>
      {t => t(translations.general.table.aaTransaction.from)}
    </Translation>
  ),
  dataIndex: 'senderHex',
  key: 'senderHex',
  width: 1,
  render: (value, row) => {
    return renderAddress(value, row);
  },
};

export const bundler = {
  title: (
    <Translation>
      {t => t(translations.general.table.aaTransaction.bundler)}
    </Translation>
  ),
  dataIndex: 'bundlerHex',
  key: 'bundlerHex',
  width: 1,
  render: (value, row) => {
    return renderAddress(value, row);
  },
};

export const entryPoint = {
  title: (
    <Translation>
      {t => t(translations.general.table.aaTransaction.entryPoint)}
    </Translation>
  ),
  dataIndex: 'entryPointHex',
  key: 'entryPointHex',
  width: 1,
  render: (value, row) => {
    return renderAddress(value, row);
  },
};

export const method = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.method)}
    </Translation>
  ),
  dataIndex: 'method',
  key: 'method',
  width: 1,
  render: value => {
    if (!value || value === '0x') {
      return '--';
    }
    const reg = /([^(]*)(?=\(.*\))/;
    const match = reg.exec(value);
    let text = '';
    if (match) {
      text = match[0];
    } else {
      text = value;
    }

    return (
      <StyledMethodContainerWrapper>
        <MethodHighlight scope="method" value={text}>
          <Text tag="span" hoverValue={text}>
            <StyledMethodWrapper>{text}</StyledMethodWrapper>
          </Text>
        </MethodHighlight>
      </StyledMethodContainerWrapper>
    );
  },
};

export const blockHeight = {
  title: (
    <Translation>{t => t(translations.general.table.block.height)}</Translation>
  ),
  dataIndex: 'epoch',
  key: 'epoch',
  width: 1,
  render: value => <Link href={`/block/${value}`}>{value}</Link>,
};

export const aaGasFee = {
  title: (
    <Translation>
      {t => t(translations.general.table.aaTransaction.aaTransactionFee)}
    </Translation>
  ),
  dataIndex: 'actualGasCost',
  key: 'actualGasCost',
  width: 1,
  render: value =>
    value ? (
      <Text tag="span" hoverValue={`${value} CFX`}>
        {formatNumber(value, {
          precision: 6,
          minNum: 1e-6,
        })}
      </Text>
    ) : (
      <NotApplicable />
    ),
};

export const aaCount = {
  title: (
    <Translation>
      {t => t(translations.general.table.aaTransaction.aaCount)}
    </Translation>
  ),
  dataIndex: 'txCount',
  key: 'txCount',
  width: 1,
};

export const txnFee = {
  title: (
    <Translation>
      {t => t(translations.general.table.aaTransaction.transactionFee)}
    </Translation>
  ),
  dataIndex: 'txnFee',
  key: 'txnFee',
  width: 1,
  render: value =>
    value ? (
      <Text tag="span" hoverValue={`${formatBalance(value, 0, true)} CFX`}>
        {formatNumber(value, {
          precision: 6,
          minNum: 1e-6,
        })}
      </Text>
    ) : (
      <NotApplicable />
    ),
};

export const value = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.value)}
    </Translation>
  ),
  dataIndex: 'value',
  key: 'value',
  width: 1,
  render: value =>
    value ? (
      <Text tag="span" hoverValue={`${formatBalance(value, 0, true)} CFX`}>
        {`${formatBalance(value, 0)} CFX`}
      </Text>
    ) : (
      '--'
    ),
};

const HashWrapper = styled.div`
  display: flex;
  align-items: center;
  .tooltip-trigger {
    display: flex;
    align-items: center;
  }
  .status {
    margin-right: 4px;
    &.warning {
      color: #ffc107;
    }
  }
`;

const SpanWrap = styled.span`
  display: inline-block;
  text-overflow: ellipsis;
  max-width: 85px;
  overflow: hidden;
  vertical-align: bottom;
`;

const StyledMethodContainerWrapper = styled.span`
  display: flex;
  .method-warning {
    flex-shrink: 0;
  }
  .method-warning-icon {
    width: 16px;
    height: 16px;
    vertical-align: bottom;
    margin-bottom: 3px;
  }
`;
const MethodHighlight = styled(ValueHighlight)`
  height: 20px;
  padding: 0;
`;
const StyledMethodWrapper = styled.span`
  background: rgba(171, 172, 181, 0.1);
  border-radius: 10px;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 500;
  color: #424a71;
  line-height: 12px;
  max-width: 95px;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
