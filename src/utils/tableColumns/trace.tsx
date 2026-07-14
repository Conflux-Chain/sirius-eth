import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import {
  Down,
  Plus,
  Minus,
  Success,
  Failed,
} from '@cfxjs/sirius-next-common/dist/components/Icons';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import ContractIcon from 'images/contract-icon.png';
import { ValueHighlight } from '@cfxjs/sirius-next-common/dist/components/Highlight';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { getAddressNameInfo } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/utils';

export const gas = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.gas)}</Translation>
  ),
  dataIndex: 'gas',
  key: 'gas',
  render: (gas, row) => {
    if (!gas) return 'N/A';
    const normalizedGas = Number(gas);
    if (Number.isNaN(normalizedGas)) return 'N/A';
    const gasLeft = row.result?.gasLeft;
    const normalizedGasLeft =
      gasLeft === null || gasLeft === undefined ? null : Number(gasLeft);
    const gasUsed =
      normalizedGasLeft === null || Number.isNaN(normalizedGasLeft)
        ? '-'
        : normalizedGas - normalizedGasLeft;
    return `${gasUsed}/${normalizedGas}`;
  },
};

export const detailExpandColumn = ({
  expandedRowKeys,
  setExpandedKeys,
}: {
  expandedRowKeys: string[];
  setExpandedKeys: (keys: string[]) => void;
}) => ({
  title: '',
  dataIndex: 'index',
  key: 'detail',
  width: 1,
  render: (index, row) => {
    const isExpanded = expandedRowKeys.includes(index);
    const isDataEmpty = !row.input || row.input === '0x';
    const isReturnDataEmpty =
      !row.result?.returnData || row.result.returnData === '0x';
    if (isDataEmpty && isReturnDataEmpty) return null;
    return (
      <StyledIconWrapper
        onClick={() => {
          if (isExpanded) {
            setExpandedKeys(expandedRowKeys.filter(k => k !== index));
          } else {
            setExpandedKeys([...expandedRowKeys, index]);
          }
        }}
      >
        <Down className={isExpanded ? 'reverse' : ''} />
      </StyledIconWrapper>
    );
  },
});

export const index = ({
  expandedRowKeys,
  setExpandedKeys,
}: {
  expandedRowKeys: string[];
  setExpandedKeys: (keys: string[]) => void;
}) => ({
  title: 'Index',
  dataIndex: 'index',
  key: 'tree',
  width: 1,
  render: (index, row) => {
    if (!row.calls || row.calls.length === 0)
      return <span style={{ marginLeft: '26px' }}>{index}</span>;
    const isExpanded = expandedRowKeys.includes(index);
    return (
      <span
        style={{
          display: 'flex',
          gap: '10px',
        }}
      >
        <StyledIconWrapper
          onClick={() => {
            if (isExpanded) {
              setExpandedKeys(expandedRowKeys.filter(k => k !== index));
            } else {
              setExpandedKeys([...expandedRowKeys, index]);
            }
          }}
        >
          {isExpanded ? <Minus /> : <Plus />}
        </StyledIconWrapper>
        {index}
      </span>
    );
  },
});

const TraceTypeElement = ({
  info,
  withIndex,
}: {
  info: any;
  withIndex?: boolean;
}) => {
  const outcome = info?.result?.outcome;

  return (
    <StyledTraceTypeWrapper>
      {outcome && outcome !== 'success' ? <Failed /> : <Success />}
      <Text hoverValue={`${info.type}${withIndex ? `_${info.index}` : ''}`}>
        <div className="type-container">
          {info.type}
          {withIndex ? `_${info.index}` : ''}
        </div>
      </Text>
    </StyledTraceTypeWrapper>
  );
};

export const traceType = ({
  withIndex = true,
}: { withIndex?: boolean } = {}) => ({
  width: 1,
  title: (
    <Translation>
      {t => (
        <span style={{ marginLeft: '1rem' }}>
          {t(translations.general.table.token.traceType)}
        </span>
      )}
    </Translation>
  ),
  dataIndex: 'type',
  key: 'type',
  render: (_, row) => <TraceTypeElement info={row} withIndex={withIndex} />,
});

export const method = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.method)}
    </Translation>
  ),
  dataIndex: 'method',
  key: 'method',
  width: 1,
  render: (value, row) => {
    if (value === '0x' || value === null || value === undefined || !row.to) {
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
    // if delegatedTo exists, it means the method is called on the delegatedTo address, otherwise it's called on the to address
    const verify = getAddressNameInfo(row.delegatedTo || row.to, row.nameMap)
      ?.verify;
    const showWarning = !value.startsWith('0x') && !verify;

    return (
      <StyledMethodContainerWrapper>
        {showWarning && (
          <Tooltip
            title={
              <Translation>
                {t => t(translations.general.table.tooltip.methodWarning)}
              </Translation>
            }
            className="method-warning"
          >
            <img
              src={ContractIcon}
              alt="warning"
              className="method-warning-icon"
            />
          </Tooltip>
        )}
        <MethodHighlight scope="method" value={text}>
          <Text tag="span" hoverValue={text}>
            <StyledMethodWrapper>{text}</StyledMethodWrapper>
          </Text>
        </MethodHighlight>
      </StyledMethodContainerWrapper>
    );
  },
};

const StyledIconWrapper = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    width: 16px;
    height: 16px;
  }
  svg.reverse {
    transform: rotate(180deg);
  }
`;

const StyledTraceTypeWrapper = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    flex-shrink: 0;
  }

  .type-container {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    vertical-align: middle;
  }
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
