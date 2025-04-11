import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { StyledCard as Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { Description } from '@cfxjs/sirius-next-common/dist/components/Description';
import { CopyButton } from '@cfxjs/sirius-next-common/dist/components/CopyButton';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { SkeletonContainer } from '@cfxjs/sirius-next-common/dist/components/SkeletonContainer';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { IncreasePercent } from '@cfxjs/sirius-next-common/dist/components/IncreasePercent';
import { Security } from 'app/components/Security/Loadable';
import {
  getPercent,
  formatTimeStamp,
  toThousands,
  getEvmGasTargetUsedPercent,
} from 'utils';
import BigNumber from 'bignumber.js';
import iconCross from 'images/icon-crossSpace.svg';
import {
  fromDripToCfx,
  fromDripToGdrip,
} from '@cfxjs/sirius-next-common/dist/utils';
import { Progress } from '@cfxjs/antd';

const GasTargetUsage: React.FC<{
  gasUsed: string;
  tooltip?: React.ReactNode;
}> = ({ gasUsed, tooltip }) => {
  const { t } = useTranslation();
  const { value, percent } = getEvmGasTargetUsedPercent(gasUsed);
  return (
    <span>
      <Progress
        type="dashboard"
        size="small"
        gapDegree={150}
        showInfo={false}
        strokeWidth={10}
        strokeColor="#4AC2AB"
        trailColor="#eeeeee"
        percent={Math.min(value, 100)}
        width={35}
        style={{
          margin: '0 16px',
          display: 'inline',
        }}
      />
      <Tooltip title={tooltip}>
        {t(translations.block.gasTarget, { percent })}
      </Tooltip>
    </span>
  );
};

/**
 * ISSUE LIST:
 * - security: todo, extract a Security component
 * - others:
 *  - CopyButton: 目前是 block 的，后续 react-ui/Tooltip 更新后会解决
 *  - Skeleton: 显示文字 - 后续 react-ui/Skeleton 更新后会解决
 *  - title tooltip: 需要给定文案后确定哪些需要添加
 */
export function DescriptionPanel({ data, loading }) {
  const { t } = useTranslation();

  const {
    hash,
    height,
    epochNumber,
    difficulty,
    // miner,
    parentHash,
    nonce,
    // blame,
    // totalReward,
    gasUsed,
    timestamp,
    size,
    gasLimit,
    pivotHash,
    transactionCount,
    crossSpaceTransactionCount,
    baseFeePerGas,
    baseFeePerGasRef,
    burntGasFee,
    coreBlock,
  } = data || {};
  const isEip1559Enabled = 'baseFeePerGas' in data;

  const onlyCore = coreBlock === 1;

  return (
    <StyledCardWrapper>
      <Card className="sirius-blocks-card">
        <Description
          title={
            <Tooltip title={t(translations.toolTip.block.blockHeight)}>
              {t(translations.block.blockHeight)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {toThousands(epochNumber)}{' '}
            <CopyButton copyText={height} className="copy" />
          </SkeletonContainer>
        </Description>
        {/* <Description
          title={
            <Tooltip text={t(translations.toolTip.block.epoch)} placement="top">
              {t(translations.block.epoch)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            <Link href={`/epoch/${epochNumber}`}>
              {toThousands(epochNumber)}
            </Link>{' '}
            <CopyButton copyText={epochNumber} />
          </SkeletonContainer>
        </Description> */}
        <Description
          title={
            <Tooltip title={t(translations.toolTip.block.difficulty)}>
              {t(translations.block.difficulty)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {toThousands(difficulty)}{' '}
            <CopyButton copyText={difficulty} className="copy" />
          </SkeletonContainer>
        </Description>
        {/* <Description
          title={
            <Tooltip text={t(translations.toolTip.block.miner)} placement="top">
              {t(translations.block.miner)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {
              <>
                <AddressContainer value={miner} isFull={true} />{' '}
                <CopyButton copyText={formatAddress(miner)} />
              </>
            }
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip
              text={t(translations.toolTip.block.reward)}
              placement="top"
            >
              {t(translations.block.reward)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {totalReward ? `${fromDripToCfx(totalReward, true)} CFX` : '--'}
          </SkeletonContainer>
        </Description> */}
        <Description
          title={
            <Tooltip title={t(translations.toolTip.block.security)}>
              {t(translations.block.security)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            <Security blockHash={hash}></Security>
          </SkeletonContainer>
        </Description>
        {/* <Description
          title={
            <Tooltip text={t(translations.toolTip.block.blame)} placement="top">
              {t(translations.block.blame)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>{blame}</SkeletonContainer>
        </Description> */}
        <Description
          title={
            <Tooltip title={t(translations.toolTip.block.blockHash)}>
              {t(translations.block.blockHash)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {pivotHash} <CopyButton copyText={pivotHash} className="copy" />
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.block.parentHash)}>
              {t(translations.block.parentHash)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {
              <>
                <Link href={`/block/${parentHash}`}>{parentHash}</Link>{' '}
                <CopyButton copyText={parentHash} className="copy" />
              </>
            }
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.block.nonce)}>
              {t(translations.block.nonce)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {new BigNumber(nonce).toString()}
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.block.transactions)}>
              {t(translations.block.transactions)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            <StyledCross>
              {transactionCount - crossSpaceTransactionCount}
              <Text
                tag="span"
                hoverValue={t(
                  translations.general.table.tooltip.crossSpaceCall,
                )}
              >
                <div className="overview-cross">
                  <img src={iconCross} alt="?" />
                  Calls: &nbsp;
                  {crossSpaceTransactionCount}
                </div>
              </Text>
            </StyledCross>
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.block.gasUsed)}>
              {t(translations.block.gasUsed)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {`${gasUsed ? toThousands(gasUsed) : '--'} (${getPercent(
              gasUsed,
              gasLimit,
              2,
            )})`}
            {isEip1559Enabled && !onlyCore && (
              <GasTargetUsage
                gasUsed={baseFeePerGasRef?.gasUsed ?? '0'}
                tooltip={
                  baseFeePerGasRef?.height &&
                  baseFeePerGasRef.height !== height && (
                    <div>
                      {t(translations.toolTip.block.referencetoPivotBlock, {
                        block: baseFeePerGasRef.height,
                      })}
                      <CopyButton
                        copyText={baseFeePerGasRef.height}
                        color="#ECECEC"
                        className="copy-button-in-tooltip"
                      />
                    </div>
                  )
                }
              />
            )}
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.block.gasLimit)}>
              {t(translations.block.gasLimit)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {gasLimit ? toThousands(gasLimit) : '--'}
          </SkeletonContainer>
        </Description>

        {isEip1559Enabled && !onlyCore && (
          <>
            <Description
              title={
                <Tooltip title={t(translations.toolTip.block.baseFeePerGas)}>
                  {t(translations.block.baseFeePerGas)}
                </Tooltip>
              }
            >
              <SkeletonContainer shown={loading}>
                {baseFeePerGas
                  ? `${fromDripToGdrip(baseFeePerGas, true)} Gdrip `
                  : '--'}
                {baseFeePerGas && baseFeePerGasRef?.prePivot?.baseFeePerGas && (
                  <Tooltip
                    title={
                      baseFeePerGasRef?.prePivot?.height && (
                        <div>
                          {t(translations.toolTip.block.compareToPivotBlock, {
                            block: baseFeePerGasRef?.prePivot.height,
                          })}
                          <CopyButton
                            copyText={baseFeePerGasRef?.prePivot.height}
                            color="#ECECEC"
                            className="copy-button-in-tooltip"
                          />
                        </div>
                      )
                    }
                  >
                    <BaseFeeIncreaseWrapper>
                      <IncreasePercent
                        base={baseFeePerGas}
                        prev={baseFeePerGasRef.prePivot.baseFeePerGas}
                        showArrow
                      />
                    </BaseFeeIncreaseWrapper>
                  </Tooltip>
                )}
              </SkeletonContainer>
            </Description>
            <Description
              title={
                <Tooltip title={t(translations.toolTip.block.burntFeesLabel)}>
                  {t(translations.block.burntFeesLabel)}
                </Tooltip>
              }
            >
              <SkeletonContainer shown={loading}>
                {burntGasFee
                  ? `🔥 ${fromDripToCfx(burntGasFee, true)} CFX`
                  : '--'}
              </SkeletonContainer>
            </Description>
          </>
        )}
        <Description
          title={
            <Tooltip title={t(translations.toolTip.block.timestamp)}>
              {t(translations.block.timestamp)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {formatTimeStamp(timestamp * 1000, 'timezone')}
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.block.size)}>
              {t(translations.block.size)}
            </Tooltip>
          }
          noBorder
        >
          <SkeletonContainer shown={loading}>{size}</SkeletonContainer>
        </Description>
      </Card>
    </StyledCardWrapper>
  );
}

const BaseFeeIncreaseWrapper = styled.div`
  display: inline-block;
  padding: 4px 16px;
  border: 1px solid #ebeced;
  margin-left: 16px;
`;

const StyledCardWrapper = styled.div`
  .card.sirius-blocks-card {
    padding: 0;
    .content {
      padding: 0 18px;
    }
  }
  .description > .right {
    display: flex;
    align-items: center;
    padding: 0;
    .copy {
      margin-left: 5px;
    }
  }
  .copy-button-in-tooltip {
    margin-left: 8px;
  }
`;

const StyledCross = styled.div`
  display: flex;
  align-items: center;

  .overview-cross {
    width: fit-content;
    margin-left: 8px;
    lint-height: 22px;
    display: flex;
    align-items: center;
    background: rgba(171, 172, 181, 0.1);
    font-weight: 400;
    border-radius: 12px;
    padding: 0px 12px;
    gap: 8px;
    color: #9b9eac;
  }
`;
