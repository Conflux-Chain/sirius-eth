import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { ColumnAge } from './utils';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { Tag } from '@cfxjs/antd';
import styled from 'styled-components';
import imgInfo from 'images/info.svg';
import { renderAddress } from './token';
import { EVMAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/EVMAddressContainer';
import { ValueHighlight } from '@cfxjs/sirius-next-common/dist/components/Highlight';
import { CopyButton } from '@cfxjs/sirius-next-common/dist/components/CopyButton';

const StyleToolTip = styled.div`
  display: flex;
  align-items: center;
  > span[data-part='trigger'] {
    flex-shrink: 0;
  }
  img {
    margin-top: -4px;
    margin-left: 4px;
  }
`;
const SpanWrap = styled.span`
  display: inline-block;
  text-overflow: ellipsis;
  max-width: 160px;
  overflow: hidden;
  vertical-align: bottom;
  white-space: nowrap;
`;

export const hash = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.hash)}
    </Translation>
  ),
  dataIndex: 'txHash',
  key: 'txHash',
  width: 1,
  render: hash => (
    <Link href={`/tx/${hash}`}>
      <Text tag="span" hoverValue={hash}>
        <SpanWrap>{hash}</SpanWrap>
      </Text>
    </Link>
  ),
};

export const blockHeight = {
  title: (
    <Translation>{t => t(translations.general.table.block.height)}</Translation>
  ),
  dataIndex: 'blockNumber',
  key: 'blockNumber',
  width: 1,
  render: value => <Link href={`/block/${value}`}>{value}</Link>,
};

export const authority = {
  title: <Translation>{t => t(translations.authList.authority)}</Translation>,
  dataIndex: 'author',
  key: 'author',
  width: 1,
  render: value => {
    return (
      <ValueHighlight scope="address" value={value}>
        <EVMAddressContainer value={value} />
      </ValueHighlight>
    );
  },
};

export const delegatedAddress = {
  title: (
    <Translation>{t => t(translations.authList.delegatedAddress)}</Translation>
  ),
  dataIndex: 'address',
  key: 'address',
  width: 1,
  render: (value, row) => {
    return renderAddress(value, row, 'to', false);
  },
};

export const txSender = {
  title: <Translation>{t => t(translations.authList.txSender)}</Translation>,
  dataIndex: 'txSender',
  key: 'txSender',
  width: 1,
  render: (value, row) => {
    return renderAddress(value, row, 'from', false);
  },
};

export const nonce = {
  title: <Translation>{t => t(translations.authList.nonce)}</Translation>,
  dataIndex: 'nonce',
  key: 'nonce',
  width: 1,
};

export const valid = {
  title: (
    <StyleToolTip>
      <Translation>{t => t(translations.authList.valid)}</Translation>
      <Text
        tag="span"
        hoverValue={
          <Translation>
            {t => t(translations.authList.tooltip.valid)}
          </Translation>
        }
      >
        <img src={imgInfo} alt="tips" />
      </Text>
    </StyleToolTip>
  ),
  dataIndex: 'result',
  key: 'result',
  width: 1,
  render: (result: string) => {
    if (result === 'success') {
      return (
        <Tag color="green">
          <Translation>{t => t(translations.authList.yes)}</Translation>
        </Tag>
      );
    } else {
      return (
        <Tooltip title={result}>
          <Tag color="red">
            <Translation>{t => t(translations.authList.no)}</Translation>
          </Tag>
        </Tooltip>
      );
    }
  },
};

export const yParity = {
  title: <Translation>{t => t(translations.authList.yParity)}</Translation>,
  dataIndex: 'yParity',
  key: 'yParity',
  width: 1,
};

export const r = {
  title: <Translation>{t => t(translations.authList.r)}</Translation>,
  dataIndex: 'r',
  key: 'r',
  width: 1,
  render: r => (
    <>
      <SpanWrap>{r}</SpanWrap>
      <CopyButton copyText={r} size={14} />
    </>
  ),
};

export const s = {
  title: <Translation>{t => t(translations.authList.s)}</Translation>,
  dataIndex: 's',
  key: 's',
  width: 1,
  render: s => (
    <>
      <SpanWrap>{s}</SpanWrap>
      <CopyButton copyText={s} size={14} />
    </>
  ),
};

export const age = (ageFormat, toggleAgeFormat) =>
  ColumnAge({ ageFormat, toggleAgeFormat, dataIndex: 'createdAt' });
