import React from 'react';
import styled from 'styled-components';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { monospaceFont } from 'styles/variable';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Age } from '@cfxjs/sirius-next-common/dist/components/Age';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { EVMAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/EVMAddressContainer';
import { ProxyContractAddress } from '@cfxjs/sirius-next-common/dist/components/ProxyContractAddress';
import { ValueHighlight } from '@cfxjs/sirius-next-common/dist/components/Highlight';
import queryString from 'query-string';
import { isAddressEqual } from '@cfxjs/sirius-next-common/dist/utils/address';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { formatAddress } from 'utils';
import imgOut from 'images/token/out.svg';
import imgIn from 'images/token/in.svg';
import imgArrow from 'images/token/arrow.svg';
import { AddressNameMap } from '@cfxjs/sirius-next-common/dist/utils/request.types';
import { ProxyType } from '@cfxjs/sirius-next-common/dist/utils/hooks/useTxTrace';

export interface ContentWrapperProps {
  children: React.ReactNode;
  left?: boolean;
  right?: boolean;
  center?: boolean;
  className?: string;
  monospace?: boolean;
}

export const ContentWrapper = ({
  children,
  left,
  right,
  center,
  className,
  monospace,
  ...others
}: ContentWrapperProps) => {
  return (
    <StyledTdWrapper
      className={clsx({
        className,
        left,
        right,
        center,
        monospace,
      })}
      {...others}
    >
      {children}
    </StyledTdWrapper>
  );
};

const StyledTdWrapper = styled.div`
  &.monospace {
    font-family: ${monospaceFont};
  }
  &.right {
    text-align: right;
  }
  &.center {
    text-align: center;
  }
  &.left {
    text-align: left;
  }
`;

export interface ColumnAgeTypes {
  key?: string;
  dataIndex?: string;
  title?: React.ReactNode;
  ageFormat?: string;
  toggleAgeFormat?: any;
}

export const ColumnAge = ({
  key,
  dataIndex,
  title,
  ageFormat = 'age',
  toggleAgeFormat,
}: ColumnAgeTypes) => {
  return {
    title: (
      <AgeTHeader
        onClick={() =>
          toggleAgeFormat &&
          toggleAgeFormat(ageFormat === 'age' ? 'datetime' : 'age')
        }
      >
        <Tooltip
          title={
            <Translation>
              {t =>
                t(translations.general.table.switchAgeTip, {
                  format:
                    ageFormat === 'age'
                      ? t(translations.general.table.dateTime)
                      : t(translations.general.table.block.age),
                })
              }
            </Translation>
          }
        >
          {ageFormat === 'age' ? (
            title || (
              <Translation>
                {t => t(translations.general.table.block.age)}
              </Translation>
            )
          ) : (
            <Translation>
              {t => t(translations.general.table.dateTime)}
            </Translation>
          )}
        </Tooltip>
      </AgeTHeader>
    ),
    dataIndex: dataIndex || 'syncTimestamp',
    key: key || 'syncTimestamp',
    width: 1,
    render: value => {
      const second = /^\d+$/.test(value) ? value : dayjs(value).unix();

      return ageFormat === 'age' ? (
        <Age from={second} to={dayjs().valueOf()} />
      ) : (
        <div
          style={{
            whiteSpace: 'nowrap',
          }}
        >
          {dayjs.unix(second).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      );
    },
  };
};

const AgeTHeader = styled.div`
  color: var(--theme-color-link);
  cursor: pointer;
`;

export const number = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.number)}</Translation>
  ),
  dataIndex: 'epochNumber',
  key: 'epochNumber',
  render: (value, row, index, wrapperNumber = Infinity) => {
    const { skip = 0, limit = 10 } = queryString.parse(window.location.search);
    let page = 0;
    let pageSize = 10;
    let number = 1;

    try {
      page = Math.floor(Number(skip) / Number(limit)) + 1;
      pageSize = Math.floor(Number(limit));
      number = (page - 1) * pageSize + index + 1;
    } catch (e) {}

    if (String(number).length > wrapperNumber) {
      return (
        <Text
          maxCount={3}
          hoverValue={<StyledNumberWrapper>{number}</StyledNumberWrapper>}
        >
          {String(number)}
        </Text>
      );
    } else {
      return number;
    }
  },
};

const StyledNumberWrapper = styled.span`
  white-space: nowrap;
`;

const reg = /address\/(.*)$/;

type GetFromTypeReturnValueType = 'in' | 'out' | 'arrow';
export const getFromType = (value: string): GetFromTypeReturnValueType => {
  let address = '';

  try {
    // fixed for multiple request in /address/:hash page
    let r = reg.exec(window.location.pathname);
    if (r) {
      address = r[1];
    }
  } catch (e) {}

  const { accountAddress = address } = queryString.parse(
    window.location.search,
  );
  const filter = accountAddress as string;

  return !filter
    ? 'arrow'
    : isAddressEqual(formatAddress(filter), formatAddress(value))
    ? 'out'
    : 'in';
};

export const fromTypeInfo = {
  arrow: {
    src: imgArrow,
    text: (
      <Translation>
        {t => t(translations.general.table.token.fromTypeOut)}
      </Translation>
    ),
  },
  out: {
    src: imgOut,
    text: (
      <Translation>
        {t => t(translations.general.table.token.fromTypeOut)}
      </Translation>
    ),
  },
  in: {
    src: imgIn,
    text: (
      <Translation>
        {t => t(translations.general.table.token.fromTypeIn)}
      </Translation>
    ),
  },
};

export const renderAddressWithNameMap = (
  value: string,
  row: {
    nameMap?: Record<string, AddressNameMap>;
    proxy?: {
      type: ProxyType;
      implAddress: string;
      beaconAddress?: string;
    };
    contractCreated?: string;
  },
  type?: 'to' | 'from',
  withArrow = true,
) => {
  let address = '';

  try {
    // fixed for multiple request in /address/:hash page
    let r = reg.exec(window.location.pathname);
    if (r) {
      address = r[1];
    }
  } catch (e) {}

  const { accountAddress = address } = queryString.parse(
    window.location.search,
  );
  const valueInLowerCase = value?.toLowerCase();
  const filter = (accountAddress as string) || '';
  let alias = '';
  let verify = false;
  let isContract = false;
  let nametagInfo:
    | {
        [k: string]: {
          address: string;
          nametag: string;
        };
      }
    | undefined = undefined;

  if (row.nameMap && row.nameMap[valueInLowerCase]) {
    const nameInfo = row.nameMap[valueInLowerCase];
    alias = nameInfo.token?.name || nameInfo.contract?.name || '';
    verify = !!nameInfo.verification?.name;
    isContract = !!nameInfo.contract;
    nametagInfo = nameInfo.nameTag?.nameTag
      ? {
          [valueInLowerCase]: {
            address: value,
            nametag: nameInfo.nameTag.nameTag,
          },
        }
      : undefined;
  }

  if (type === 'to' && row.proxy) {
    return (
      <ValueHighlight scope="address" value={value}>
        <ProxyContractAddress
          address={value}
          alias={alias}
          verify={verify}
          proxy={row.proxy}
        />
      </ValueHighlight>
    );
  }

  return (
    <>
      <ValueHighlight scope="address" value={value}>
        <EVMAddressContainer
          value={value}
          alias={alias}
          link={!isAddressEqual(formatAddress(filter), formatAddress(value))}
          contractCreated={row.contractCreated}
          verify={verify}
          isContract={isContract}
          nametagInfo={nametagInfo}
        />
      </ValueHighlight>
      {type === 'from' && withArrow && (
        <ImgWrap src={fromTypeInfo[getFromType(value)].src} />
      )}
    </>
  );
};

const ImgWrap = styled.img`
  position: absolute;
  width: 36px;
  height: 20px;
  right: -0.8571rem;
  top: 0.1429rem;

  ${media.s} {
    right: -0.98rem;
  }
`;
