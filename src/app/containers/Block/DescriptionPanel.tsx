import React, { useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { Card } from 'sirius-next/packages/common/dist/components/Card';
import { useBlockQuery } from 'utils/api';
import { Text } from 'app/components/Text/Loadable';
import { Description } from 'sirius-next/packages/common/dist/components/Description';
import { CopyButton } from 'sirius-next/packages/common/dist/components/CopyButton';
import { Link } from 'app/components/Link/Loadable';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { Tooltip } from 'app/components/Tooltip/Loadable';
import { Security } from 'app/components/Security/Loadable';
import { useHistory } from 'react-router-dom';
import {
  getPercent,
  /*fromDripToCfx,*/ formatTimeStamp,
  toThousands,
} from 'utils';
// import { AddressContainer } from 'app/components/AddressContainer';
// import { formatAddress } from 'utils';
import { useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import iconCross from 'images/icon-crossSpace.svg';

export function DescriptionPanel() {
  const { hash: blockHash } = useParams<{
    hash: string;
  }>();
  const history = useHistory();
  const { t } = useTranslation();
  let loading = false;
  const hashQuery = useMemo(() => ({ hash: blockHash }), [blockHash]);
  const { data } = useBlockQuery(hashQuery);

  useEffect(() => {
    if (data && !data.hash) {
      history.push(`/notfound/${blockHash}`, {
        type: 'block',
      });
    }
  }, [blockHash, data, history]);

  const intervalToClear = useRef(false);
  if (!data) loading = true;

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
  } = data || {};

  useEffect(() => {
    return () => {
      intervalToClear.current = false;
    };
  }, [intervalToClear]);
  /**
   * ISSUE LIST:
   * - security: todo, extract a Security component
   * - others:
   *  - CopyButton: 目前是 block 的，后续 react-ui/Tooltip 更新后会解决
   *  - Skeleton: 显示文字 - 后续 react-ui/Skeleton 更新后会解决
   *  - title tooltip: 需要给定文案后确定哪些需要添加
   */

  return (
    <StyledCardWrapper>
      <Card className="sirius-blocks-card">
        <Description
          title={
            <Tooltip
              text={t(translations.toolTip.block.blockHeight)}
              placement="top"
            >
              {t(translations.block.blockHeight)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {toThousands(epochNumber)} <CopyButton copyText={height} />
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
            <Tooltip
              text={t(translations.toolTip.block.difficulty)}
              placement="top"
            >
              {t(translations.block.difficulty)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {toThousands(difficulty)} <CopyButton copyText={difficulty} />
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
            <Tooltip
              text={t(translations.toolTip.block.security)}
              placement="top"
            >
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
            <Tooltip
              text={t(translations.toolTip.block.blockHash)}
              placement="top"
            >
              {t(translations.block.blockHash)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {pivotHash} <CopyButton copyText={pivotHash} />
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip
              text={t(translations.toolTip.block.parentHash)}
              placement="top"
            >
              {t(translations.block.parentHash)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {
              <>
                <Link href={`/block/${parentHash}`}>{parentHash}</Link>{' '}
                <CopyButton copyText={parentHash} />
              </>
            }
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip text={t(translations.toolTip.block.nonce)} placement="top">
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
            <Tooltip
              text={t(translations.toolTip.block.transactions)}
              placement="top"
            >
              {t(translations.block.transactions)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            <StyledCross>
              {transactionCount - crossSpaceTransactionCount}
              <Text
                span
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
            <Tooltip
              text={t(translations.toolTip.block.gasUsedLimit)}
              placement="top"
            >
              {t(translations.block.gasUsed)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {`${gasLimit || '--'} | ${gasUsed || '--'} (${getPercent(
              gasUsed,
              gasLimit,
              2,
            )})`}
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip
              text={t(translations.toolTip.block.timestamp)}
              placement="top"
            >
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
            <Tooltip text={t(translations.toolTip.block.size)} placement="top">
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

const StyledCardWrapper = styled.div`
  .card.sirius-blocks-card {
    padding: 0;
    .content {
      padding: 0 18px;
    }
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
