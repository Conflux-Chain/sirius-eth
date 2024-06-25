import React, { useState } from 'react';
import { Select } from '@cfxjs/sirius-next-common/dist/components/Select';
import { Option } from 'styles/global-styles';
import styled from 'styled-components';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { ContractDetail } from 'app/components/TxnComponents/ContractDetail';
import { DecodedParams } from 'app/components/TxnComponents/util';
import { AddressLabel } from 'app/components/TxnComponents/AddressLabel';

type SelectedLineSelect = {
  value?: string;
  options: Array<any>;
  onChange?: (value: string | string[]) => void;
} | null;

const isPossibleAddress = data => {
  try {
    let top24 = data.substr(0, 24);
    if (Number(top24) === 0) {
      return true;
    }
  } catch (e) {}
  return false;
};

const SelectedLine = ({
  select,
  index,
  data,
}: {
  select?: SelectedLineSelect;
  index?: number | undefined;
  data?: any;
}) => {
  const [selected, setSelected] = useState(select?.value);
  const handleChange = value => {
    setSelected(value);
    select && select.onChange && select.onChange(value);
  };

  const options =
    (isPossibleAddress(data.hexValue)
      ? select?.options
      : select?.options.filter(o => o.key !== 'address')) || [];

  return (
    <StyledSelectItemWrapper>
      {index === undefined ? null : <span className="index">{index + 1}</span>}
      {select ? (
        <TextSelect
          className="select"
          disableMatchWidth={true}
          size="small"
          value={selected}
          onChange={handleChange}
          width="7.8rem"
        >
          {options.map(o => (
            <Option key={o.key} value={o.value}>
              {o.content}
            </Option>
          ))}
        </TextSelect>
      ) : null}
      <span className="value">{decodeData(data.hexValue, selected)}</span>
    </StyledSelectItemWrapper>
  );
};

const decodeData = (value, type) => {
  let result = value;
  const v = `0x${value}`;

  try {
    switch (type) {
      case 'address':
        const address = `0x${value.substr(24)}`;
        result = (
          <>
            <Link href={`/address/${address}`}>{address}</Link>
            <AddressLabel address={address} />
          </>
        );
        break;
      case 'number':
        result = SDK.format.bigInt(v).toString();
        break;
      case 'text':
        result = SDK.format.hexBuffer(v).toString();
        break;
      case 'bool':
        break;
      default:
    }
  } catch (e) {
    console.log('decode error: ', e);
  }

  return result;
};
const TextSelect = styled(Select)`
  background-color: #fff;
  border: 1px solid #ccc;
`;
const StyledSelectItemWrapper = styled.div`
  margin-bottom: 5px;
  display: flex;
  align-items: center;

  ${media.s} {
    flex-direction: column;
    align-items: baseline;
    margin-bottom: 10px;
    > .value {
      margin-top: 5px;
    }
  }

  .index {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    background: #fafbfc;
    border-radius: 2px;
    margin-right: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .select {
    position: absolute;
    right: 0;
    margin-right: 12px;
    color: #444;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 0.25rem;

    .value {
      padding-left: 0;
    }
    ${media.s} {
      position: relative;
      top: auto;
      right: auto;
      margin-bottom: 10px;
    }
  }
  .select:hover {
    background-color: rgba(30, 61, 228, 0.08);
  }
`;

export const Data = ({
  data,
  hexData,
  contractAndTokenInfo,
}: {
  data: Array<DecodedParams>;
  hexData: string;
  contractAndTokenInfo: any;
}) => {
  const { t } = useTranslation();
  if (!data.length) {
    return null;
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState('decode');

    let content: string | Array<React.ReactNode> = hexData;
    let body: React.ReactNode = null;
    let withAbi = false;

    if (data[0].argName) {
      // data after decode with contract abi
      const handleChange = value => setValue(value);

      if (value === 'decode') {
        content = data.map((d, index) => {
          let value: React.ReactNode = <pre>{d.value}</pre>;

          if (d.type === 'address') {
            const contractInfo = contractAndTokenInfo[d.value];

            value = (
              <>
                <Link href={`/address/${d.value}`}>{d.value} </Link>
                <ContractDetail info={contractInfo}></ContractDetail>
                <AddressLabel address={d.value} />
              </>
            );
          }

          return (
            <div className="data-item" key={index}>
              <span className="data-item-title">{d.argName}: </span>
              <span className="data-item-value">{value}</span>
            </div>
          );
        });
      }

      body = (
        <>
          <TextSelect
            className="select"
            value={value}
            onChange={handleChange}
            size="small"
            disableMatchWidth={true}
            width="7.8rem"
          >
            <Option value="hex">{t(translations.transaction.logs.hex)}</Option>
            <Option value="decode">
              {t(translations.transaction.logs.decode)}
            </Option>
          </TextSelect>
          {content}
        </>
      );
      withAbi = true;
    } else {
      // original eventlog data
      const select: SelectedLineSelect = {
        value: 'hex',
        options: [
          {
            key: 'hex',
            value: 'hex',
            content: t(translations.transaction.logs.hex),
          },
          {
            key: 'number',
            value: 'number',
            content: t(translations.transaction.logs.number),
          },
          {
            key: 'text',
            value: 'text',
            content: t(translations.transaction.logs.text),
          },
          {
            key: 'address',
            value: 'address',
            content: t(translations.transaction.logs.address),
          },
        ],
      };

      body = data.map((d, index) => {
        return (
          <SelectedLine key={index} select={select} data={d}></SelectedLine>
        );
      });
    }

    return <StyledDataWrapper withAbi={withAbi}>{body}</StyledDataWrapper>;
  }
};
const StyledDataWrapper = styled.div<{ withAbi: boolean }>`
  padding: 16px ${props => (props.withAbi ? '124px' : '24px')} 16px 16px;
  background-color: #fafbfc;
  position: relative;

  ${media.s} {
    padding: 16px;
  }

  .with-abi {
    padding-right: 100px;
  }

  .select {
    position: absolute;
    right: 0;
    margin-right: 12px;
    color: #444;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 0.25rem;

    .value {
      padding-left: 0;
    }
    ${media.s} {
      position: relative;
      top: auto;
      right: auto;
      margin-bottom: 10px;
    }
  }
  .select:hover {
    background-color: rgba(30, 61, 228, 0.08);
  }

  .data-item {
    display: flex;
    align-items: baseline;

    .data-item-title {
      margin-right: 0.3571rem;
      flex-shrink: 0;
    }

    .data-item-value {
      margin-top: 0.1429rem;
      margin-bottom: -0.1429rem;
    }

    img {
      margin: 0 0.1429rem;
    }
  }
`;
