import React, { useState } from 'react';
import styled from 'styled-components';
import { Select } from '@cfxjs/sirius-next-common/dist/components/Select';
import { Option } from 'styles/global-styles';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { ContractDetail } from 'app/components/TxnComponents/ContractDetail';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { AddressLabel } from 'app/components/TxnComponents/AddressLabel';
import { convertCheckSum } from '@cfxjs/sirius-next-common/dist/utils/address';
import { StyledHighlight } from './StyledComponents';

export const Topics = ({ data, signature, contractAndTokenInfo }) => {
  const { t } = useTranslation();
  const [selectMap, setSelectMap] = useState(() => {
    return data.reduce((prev, curr) => {
      if (curr.argName) {
        prev[curr.argName] = 'decode';
      }
      return prev;
    }, {});
  });
  const handleChange = (value, argName) => {
    setSelectMap({
      ...selectMap,
      [argName]: value,
    });
  };
  const options = [
    {
      key: 'hex',
      value: 'hex',
      content: t(translations.transaction.logs.hex),
    },
    {
      key: 'decode',
      value: 'decode',
      content: t(translations.transaction.logs.decode),
    },
  ];
  const baseIndex = signature ? 1 : 0;

  return (
    <StyledTopicsWrapper>
      {signature ? (
        <div className="topic-item">
          <span className="index">0</span>
          <span className="value">{signature}</span>
        </div>
      ) : null}
      {data.map((d, index) => {
        let value: React.ReactNode = '';
        let select: React.ReactNode = null;

        if (typeof d === 'string') {
          value = d;
        } else {
          const name = selectMap[d.argName] || 'hex';
          const valueMap: {
            hex: string;
            decode: string;
          } = {
            hex: d.hexValue,
            decode:
              d.type === 'address' // only address type show hexAddress prior
                ? d.hexAddress
                : d.value,
          };
          const availableOptions = options.filter(o => !!valueMap[o.value]);
          value = valueMap[name];

          if (name === 'decode' && d.type === 'address') {
            const contractInfo = contractAndTokenInfo[valueMap.decode];

            value = (
              <>
                <StyledHighlight scope="address" value={value}>
                  <Link href={`/address/${value}`}>
                    {typeof value === 'string' ? convertCheckSum(value) : value}
                  </Link>
                </StyledHighlight>
                <ContractDetail info={contractInfo}></ContractDetail>
                <AddressLabel address={value} />
              </>
            );
          }

          select = (
            <TextSelect
              className="select"
              disableMatchWidth={true}
              size="small"
              value={valueMap.hex === valueMap.decode ? 'hex' : name}
              onChange={value => {
                handleChange(value, d.argName);
              }}
              width="7.8rem"
              disabled={valueMap.hex === valueMap.decode}
            >
              {availableOptions.map(o => (
                <Option key={o.key} value={o.value}>
                  {o.content}
                </Option>
              ))}
            </TextSelect>
          );
        }

        return (
          <div key={index} className="topic-item">
            <span className="index">{index + baseIndex}</span>
            {select}
            <span className="value">{value}</span>
          </div>
        );
      })}
    </StyledTopicsWrapper>
  );
};

Topics.defaultProps = {
  contractAndTokenInfo: {},
};
const TextSelect = styled(Select)`
  background-color: #fff;
  border: 1px solid #ccc;
`;
const StyledTopicsWrapper = styled.div`
  .topic-item {
    margin-bottom: 0.3571rem;
    display: flex;
    align-items: center;

    ${media.s} {
      flex-wrap: wrap;
      align-items: baseline;
      margin-top: 5px;

      .value {
        padding-top: 5px;
        padding-bottom: 5px;
      }
    }

    .index {
      flex-shrink: 0;
      width: 1.7143rem;
      height: 1.7143rem;
      background: #fafbfc;
      border-radius: 0.1429rem;
      margin-right: 0.8571rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .select {
      height: 1.5714rem;
      padding: 0 0.7143rem;
      margin-right: 0.8571rem;
      color: #444;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 0.25rem;

      .value {
        padding-left: 0;
      }
    }

    .select:hover {
      background-color: rgba(30, 61, 228, 0.08);
    }
  }
`;
