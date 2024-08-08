import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import {
  formatNumber,
  getPercent,
  toThousands,
  roundToFixedPrecision,
  getNetworkIcon,
} from 'utils/';
// import imgPivot from 'images/pivot.svg';
import { ColumnAge } from './utils';
import { Progress } from '@cfxjs/antd';
import BigNumber from 'bignumber.js';
import imgInfo from 'images/info.svg';
import NotApplicable from 'app/components/TxnComponents/NotApplicable';
import ENV_CONFIG from 'env';
import {
  fromDripToCfx,
  fromDripToGdrip,
} from '@cfxjs/sirius-next-common/dist/utils';

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
          tag="span"
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
          {/* TODO-btc */}
          <img
            src={getNetworkIcon(undefined, {
              isCore: row.coreBlock === 1,
              isEvm: row.coreBlock !== 1,
            })}
            alt="?"
          />
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
        tag="span"
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
        tag="span"
        hoverValue={
          <Translation>
            {t => t(translations.general.table.tooltip.cross)}
          </Translation>
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
          <Text tag="span" hoverValue={value}>
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
  //         <Text tag="span" hoverValue={value}>
  //           <SpanWrap>{value}</SpanWrap>
  //         </Text>
  //       </Link>
  //       {pivotTag}
  //     </StyledHashWrapper>
  //   );
  // },
};

export const avgGasPrice = {
  title: (
    <StyleToolTip>
      <Translation>
        {t => t(translations.general.table.block.avgGasPrice)}
      </Translation>
      <Text
        tag="span"
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
      <Text tag="span" hoverValue={`${toThousands(value)} drip`}>
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
              tag="span"
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
            strokeColor={ENV_CONFIG.ENV_THEME.linkColor}
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
      <Text tag="span" hoverValue={`${fromDripToCfx(value, true)} CFX`}>
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
        tag="span"
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

export const burntFees = {
  title: (
    <StyleToolTip>
      <Translation>
        {t => t(translations.general.table.block.burntFees)}
      </Translation>
    </StyleToolTip>
  ),
  dataIndex: 'burntGasFee',
  key: 'burntGasFee',
  width: 1,
  render: (value, row) => {
    if (row.coreBlock === 1) {
      return <NotApplicable />;
    }
    return value ? (
      <Text tag="span" hoverValue={`${fromDripToCfx(value, true)} CFX`}>
        {`${fromDripToCfx(value)} CFX`}
      </Text>
    ) : (
      '--'
    );
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
