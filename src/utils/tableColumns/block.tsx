import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components/macro';
import { Text } from 'app/components/Text/Loadable';
import { Link } from 'app/components/Link/Loadable';
import {
  formatNumber,
  getPercent,
  fromDripToCfx,
  toThousands,
  fromDripToGdrip,
  roundToFixedPrecision,
} from 'utils/';
// import imgPivot from 'images/pivot.svg';
import { AddressContainer } from 'app/components/AddressContainer';
import { ColumnAge } from './utils';
import { Progress } from '@cfxjs/antd';
import BigNumber from 'bignumber.js';
import eSpaceIcon from 'images/icon-eSpace.svg';
import cSpaceIcon from 'images/icon-core.svg';
import imgInfo from 'images/info.svg';
import NotApplicable from 'app/components/TxnComponents/NotApplicable';

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  img {
    margin-right: 8px;
    margin-top: -2px;
  }
`;
const StyleToolTip = styled.div`
  display: flex;
  align-items: center;
  img {
    margin-top: -4px;
    margin-left: 4px;
  }
`;
export const epochWithNoLink = {
  title: (
    <Translation>{t => t(translations.general.table.block.epoch)}</Translation>
  ),
  dataIndex: 'epochNumber',
  key: 'epochNumber',
  width: 1,
  render: (value, row) => <Link href={`/block/${value}`}>{value}</Link>,
};

export const blockHeight = {
  title: (
    <Translation>{t => t(translations.general.table.block.height)}</Translation>
  ),
  dataIndex: 'epochNumber',
  key: 'epochNumber',
  width: 1,
  render: (value, row) => <Link href={`/block/${value}`}>{value}</Link>,
};

export const epoch = {
  title: (
    <Translation>{t => t(translations.general.table.block.epoch)}</Translation>
  ),
  dataIndex: 'epochNumber',
  key: 'epochNumber',
  width: 1,
  render: (value, row) => (
    <Link href={`/block/${value}`}>
      <IconWrapper>
        <Text
          span
          hoverValue={
            <Translation>
              {t => {
                return row.coreBlock === 1
                  ? t(translations.general.table.tooltip.coreSpace)
                  : t(translations.general.table.tooltip.evmSpace);
              }}
            </Translation>
          }
        >
          <img src={row.coreBlock === 1 ? cSpaceIcon : eSpaceIcon} alt="?" />
        </Text>
        {value}
      </IconWrapper>
    </Link>
  ),
};

export const position = {
  title: (
    <Translation>
      {t => t(translations.general.table.block.position)}
    </Translation>
  ),
  dataIndex: 'blockIndex',
  key: 'blockIndex',
  width: 1,
};

export const txns = {
  title: (
    <StyleToolTip>
      <Translation>{t => t(translations.general.table.block.txns)}</Translation>
      <Text
        span
        hoverValue={
          <Translation>
            {t => t(translations.general.table.tooltip.txns)}
          </Translation>
        }
      >
        <img src={imgInfo} alt="tips" />
      </Text>
    </StyleToolTip>
  ),
  dataIndex: 'transactionCount',
  key: 'transactionCount',
  width: 1,
  render: (value, row: any) =>
    formatNumber(row.transactionCount - row.crossSpaceTransactionCount),
};

export const crossSpaceCalls = {
  title: (
    <StyleToolTip>
      <Translation>
        {t => t(translations.general.table.block.cross)}
      </Translation>
      <Text
        span
        hoverValue={
          <>
            <Translation>
              {t => t(translations.general.table.tooltip.cross, '')}
            </Translation>
            <a href="http://doc.confluxnetwork.org/docs/espace/build/cross-space-bridge/">
              http://doc.confluxnetwork.org/docs/espace/build/cross-space-bridge/
            </a>
          </>
        }
      >
        <img src={imgInfo} alt="tips" />
      </Text>
    </StyleToolTip>
  ),
  dataIndex: 'crossSpaceTransactionCount',
  key: 'crossSpaceTransactionCount',
  width: 1,
  render: formatNumber,
};

export const hashWithPivot = {
  title: (
    <Translation>{t => t(translations.general.table.block.hash)}</Translation>
  ),
  dataIndex: 'hash',
  key: 'hash',
  width: 1,
  render: (value, row: any) => {
    return (
      <StyledHashWrapper>
        <Link href={`/block/${value}`}>
          <Text span hoverValue={value}>
            <SpanWrap>{value}</SpanWrap>
          </Text>
        </Link>
      </StyledHashWrapper>
    );
  },
  // render: (value, row: any) => {
  //   let pivotTag: React.ReactNode = null;
  //   if (row.pivotHash === row.hash) {
  //     pivotTag = <img className="img" src={imgPivot} alt="pivot" />;
  //   }
  //   return (
  //     <StyledHashWrapper>
  //       <Link href={`/block/${value}`}>
  //         <Text span hoverValue={value}>
  //           <SpanWrap>{value}</SpanWrap>
  //         </Text>
  //       </Link>
  //       {pivotTag}
  //     </StyledHashWrapper>
  //   );
  // },
};

export const miner = {
  title: (
    <Translation>{t => t(translations.general.table.block.miner)}</Translation>
  ),
  dataIndex: 'miner',
  key: 'miner',
  width: 1,
  render: value => <AddressContainer value={value} />,
};

export const avgGasPrice = {
  title: (
    <StyleToolTip>
      <Translation>
        {t => t(translations.general.table.block.avgGasPrice)}
      </Translation>
      <Text
        span
        hoverValue={
          <Translation>
            {t => t(translations.general.table.tooltip.avgGasPrice)}
          </Translation>
        }
      >
        <img src={imgInfo} alt="tips" />
      </Text>
    </StyleToolTip>
  ),
  dataIndex: 'avgGasPrice',
  key: 'avgGasPrice',
  width: 1,
  render: (value, row: any) =>
    (value && value !== '0') || row.coreBlock === 0 ? (
      <Text span hoverValue={`${toThousands(value)} drip`}>
        {`${roundToFixedPrecision(
          fromDripToGdrip(value, false, {
            precision: 6,
            minNum: 1e-6,
          }),
          2,
        )} Gdrip`}
      </Text>
    ) : (
      <NotApplicable />
    ),
};

export const gasUsedPercent = {
  title: (
    <Translation>
      {t => t(translations.general.table.block.gasUsedPercent)}
    </Translation>
  ),
  dataIndex: 'gasUsed',
  key: 'gasUsed',
  width: 1,
  render: (value, row: any) => {
    if (value && value !== '0') {
      return getPercent(row.gasUsed, row.gasLimit, 2);
    } else {
      return <NotApplicable />;
    }
  },
};

export const gasUsedPercentWithProgress = {
  title: (
    <Translation>
      {t => t(translations.general.table.block.gasUsedPercent)}
    </Translation>
  ),
  dataIndex: 'gasUsed',
  key: 'gasUsed',
  width: 1,
  render: (value, row: any) => {
    const gasUsed = new BigNumber(row.gasUsed);
    const percent = Number(
      gasUsed.dividedBy(row.gasLimit).multipliedBy(100).toFixed(2),
    );

    if ((value && value !== '0') || row.coreBlock === 0) {
      return (
        <StyledGasPercentWrapper>
          <div className="gas-detail">
            <Text
              span
              hoverValue={
                <Translation>
                  {t =>
                    t(translations.general.table.block.gasUsedPercent) +
                    ': ' +
                    toThousands(gasUsed.toFixed())
                  }
                </Translation>
              }
            >
              {toThousands(gasUsed.toFixed())}{' '}
            </Text>

            <span className="gas-detail-percent">
              ({getPercent(row.gasUsed, row.gasLimit, 2)})
            </span>
          </div>
          <Progress
            percent={percent}
            size="small"
            showInfo={false}
            strokeWidth={2}
            strokeColor="#1e3de4"
            trailColor="#eeeeee"
          />
        </StyledGasPercentWrapper>
      );
    } else {
      return <NotApplicable />;
    }
  },
};

export const reward = {
  title: (
    <Translation>{t => t(translations.general.table.block.reward)}</Translation>
  ),
  dataIndex: 'totalReward',
  key: 'totalReward',
  width: 1,
  render: value =>
    value ? (
      <Text span hoverValue={`${fromDripToCfx(value, true)} CFX`}>
        {`${fromDripToCfx(value)} CFX`}
      </Text>
    ) : (
      '--'
    ),
};

export const age = (ageFormat, toggleAgeFormat) =>
  ColumnAge({ ageFormat, toggleAgeFormat });

export const difficulty = {
  title: (
    <Translation>
      {t => t(translations.general.table.block.difficulty)}
    </Translation>
  ),
  dataIndex: 'difficulty',
  key: 'difficulty',
  width: 1,
  render: formatNumber,
};

export const gasLimit = {
  title: (
    <StyleToolTip>
      <Translation>
        {t => t(translations.general.table.block.gasLimit)}
      </Translation>
      <Text
        span
        hoverValue={
          <Translation>
            {t => t(translations.general.table.tooltip.gasLimit)}
          </Translation>
        }
      >
        <img src={imgInfo} alt="tips" />
      </Text>
    </StyleToolTip>
  ),
  dataIndex: 'gasLimit',
  key: 'gasLimit',
  width: 1,
  render: value => {
    if (value && value !== '0') {
      return toThousands(value);
    }
    return <NotApplicable />;
  },
};

const StyledHashWrapper = styled.span`
  display: flex;
  align-items: center;
  white-space: nowrap;

  .img {
    width: 3rem;
    height: 1.4286rem;
    margin-left: 0.5714rem;
  }
`;

const SpanWrap = styled.span`
  display: inline-block;
  text-overflow: ellipsis;
  max-width: 100px;
  overflow: hidden;
  vertical-align: bottom;
`;

const StyledGasPercentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: -8px 0;

  .gas-detail {
    margin-bottom: -10px;
  }

  .gas-detail-percent {
    color: #999999;
    font-size: 12px;
  }
`;
