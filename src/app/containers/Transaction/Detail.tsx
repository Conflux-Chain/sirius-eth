import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { Spinner } from '@cfxjs/react-ui';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { Description } from '@cfxjs/sirius-next-common/dist/components/Description';
import { CopyButton } from '@cfxjs/sirius-next-common/dist/components/CopyButton';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { SkeletonContainer } from '@cfxjs/sirius-next-common/dist/components/SkeletonContainer';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { Age } from '@cfxjs/sirius-next-common/dist/components/Age';
import { reqContract, reqTransactionEventlogs } from 'utils/httpRequest';
import { formatTimeStamp, getPercent, toThousands, isZeroAddress } from 'utils';
import { formatAddress } from 'utils';
import { CFX_TOKEN_TYPES } from 'utils/constants';
import { EVMAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/EVMAddressContainer';
import clsx from 'clsx';
import { Security } from 'app/components/Security/Loadable';
import { GasFee, InputDataNew, Status } from 'app/components/TxnComponents';
import { TransactionAction } from '@cfxjs/sirius-next-common/dist/components/TransactionAction/evmTransactionAction';
import _ from 'lodash';

import imgChevronDown from 'images/chevronDown.png';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { CreateTxNote } from '../Profile/CreateTxNote';
import { useNametag } from 'utils/hooks/useNametag';

import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import {
  fromDripToCfx,
  fromDripToGdrip,
} from '@cfxjs/sirius-next-common/dist/utils';
import { isEvmContractAddress } from '@cfxjs/sirius-next-common/dist/utils/address';
import BigNumber from 'bignumber.js';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import dayjs from 'dayjs';
import { StyledHighlight } from './EventLogs/StyledComponents';
import { EOACodeIcon } from 'app/components/EOACodeIcon';
import { CFXTransfers } from './CFXTransfers';
import { TokenTransfers } from './TokenTransfers';
import { getItemByKey, renderAddressWithNameMap } from './utils';

// Transaction Detail Page
export const Detail = ({
  data: transactionDetail,
  loading: outerLoading,
  partLoading,
}) => {
  const [visible, setVisible] = useState(false);
  const [globalData] = useGlobalData();
  const { t } = useTranslation();
  const [isContract, setIsContract] = useState(false);
  const [eventlogs, setEventlogs] = useState<any>([]);
  const [contractInfo, setContractInfo] = useState({});
  const [innerLoading, setInnerLoading] = useState(false);
  const { hash: routeHash } = useParams<{
    hash: string;
  }>();
  const {
    from,
    to,
    value,
    gasPrice,
    gas,
    nonce,
    blockHash,
    transactionIndex,
    epochNumber,
    syncTimestamp,
    gasFee,
    gasUsed,
    gasCharged,
    status,
    data,
    contractCreated,
    confirmedEpochCount,
    txExecErrorInfo,
    gasCoveredBySponsor,
    baseFeePerGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    burntGasFee,
    type,
    typeDesc,
    txExecErrorMsg,
    effectiveAuth: _effectiveAuth,
    tokenTransfers,
    cfxTransfers,
    nameMap,
  } = transactionDetail;
  const renderAddress = renderAddressWithNameMap(nameMap);
  const [folded, setFolded] = useState(true);
  const nametags = useNametag([from, to]);
  const effectiveAuth = isZeroAddress(_effectiveAuth?.address)
    ? null
    : _effectiveAuth;

  const loading = innerLoading || outerLoading;
  const isPending = _.isNil(status) || status === 4;
  const isCrossSpaceCall = gasPrice === '0';
  const notEnoughCash = txExecErrorMsg && /^NotEnoughCash/.test(txExecErrorMsg);
  const isValidGasCharged =
    !notEnoughCash || new BigNumber(gasCharged).isEqualTo(gas);

  useEffect(() => {
    if (!to) return;
    const fetchTxInfo = async toCheckAddress => {
      setInnerLoading(true);

      try {
        const proArr: Promise<any>[] = [];
        const _isContract =
          toCheckAddress !== null &&
          (await isEvmContractAddress(toCheckAddress));
        if (_isContract) {
          setIsContract(true);

          const contractFields = [
            'address',
            'type',
            'name',
            'website',
            'tokenName',
            'tokenSymbol',
            'token',
            'tokenDecimal',
            'abi',
            'bytecode',
            'iconUrl',
            'sourceCode',
            'typeCode',
          ];

          proArr.push(
            reqContract({ address: toCheckAddress, fields: contractFields }),
          );
        }

        proArr.push(
          reqTransactionEventlogs({
            transactionHash: routeHash,
            aggregate: false,
          }),
        );

        const proRes = await Promise.all(proArr);

        if (_isContract) {
          const contractResponse = proRes.shift();
          setContractInfo(contractResponse);
        }

        const eventlogsResponse = proRes[0];

        setEventlogs(eventlogsResponse.list);
      } catch (e) {
        console.error('fetchTxInfo error: ', e);
      } finally {
        setInnerLoading(false);
      }
    };
    fetchTxInfo(to);
  }, [to, routeHash]);

  const addressContent = useCallback(
    (isFull = false, address) => {
      const addr = formatAddress(address);
      return (
        <span>
          <StyledHighlight scope="address" value={addr}>
            <EVMAddressContainer value={addr} isFull={isFull} />
          </StyledHighlight>{' '}
          {nametags[addr]?.nameTag ? `(${nametags[addr]?.nameTag})` : null}{' '}
          <CopyButton copyText={addr} />
        </span>
      );
    },
    [nametags],
  );

  const generatedToAddress = () => {
    if (to) {
      if (isContract) {
        return (
          <Description
            title={
              <Tooltip title={t(translations.toolTip.tx.to)}>
                {t(translations.transaction.to)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {t(translations.transaction.contract)}{' '}
              {contractInfo && (
                <>
                  {contractInfo['token'] && contractInfo['token']['iconUrl'] ? (
                    <img
                      className="logo"
                      src={
                        contractInfo['token'] &&
                        contractInfo['token']['iconUrl']
                      }
                      alt="icon"
                    />
                  ) : null}
                  <Link href={`/address/${formatAddress(to)}`}>
                    {contractInfo['name'] ||
                      (contractInfo['token'] && contractInfo['token']['name']
                        ? `${contractInfo['token']['name']}`
                        : '')}
                  </Link>{' '}
                </>
              )}
              {addressContent(true, to)}
            </SkeletonContainer>
          </Description>
        );
      } else {
        return (
          <Description
            title={
              <Tooltip title={t(translations.toolTip.tx.to)}>
                {t(translations.transaction.to)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              <RowWrapper>
                {effectiveAuth && <EOACodeIcon />}
                {addressContent(true, to)}
              </RowWrapper>
            </SkeletonContainer>
          </Description>
        );
      }
    } else if (contractCreated) {
      return (
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.to)}>
              {t(translations.transaction.to)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            <span className="label">
              {t(translations.transaction.contract)}
            </span>
            <EVMAddressContainer
              value={transactionDetail['contractCreated']}
              isFull={true}
              isContract={true}
            />{' '}
            <CopyButton
              copyText={formatAddress(transactionDetail['contractCreated'])}
            />
            &nbsp; {t(translations.transaction.created)}
          </SkeletonContainer>
        </Description>
      );
    } else {
      return (
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.to)}>
              {t(translations.transaction.to)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {t(translations.transaction.contractCreation)}
          </SkeletonContainer>
        </Description>
      );
    }
  };
  const batchCombinedTransferList = useMemo(() => {
    const transferList = tokenTransfers?.list ?? [];
    // combine erc1155 batch transfer with batchIndex field
    let batchCombinedTransferList: any[] = [];
    if (transferList && transferList.length > 0) {
      transferList.forEach((transfer: any) => {
        if (transfer.transferType === CFX_TOKEN_TYPES.erc1155) {
          // find batch transfers
          const batchCombinedTransferListIndex = batchCombinedTransferList.findIndex(
            trans =>
              trans.transferType === transfer.transferType &&
              trans.address === transfer.address &&
              trans.from === transfer.from &&
              trans.to === transfer.to,
          );
          if (batchCombinedTransferListIndex < 0) {
            batchCombinedTransferList.push({
              batch: [transfer],
              ...transfer,
            });
          } else {
            batchCombinedTransferList[
              batchCombinedTransferListIndex
            ].batch.push(transfer);
          }
        } else {
          batchCombinedTransferList.push(transfer);
        }
      });
    }
    return batchCombinedTransferList;
  }, [tokenTransfers]);
  const transferToken = useMemo(() => {
    let transferListInfo: Array<any> = [];

    for (let i = 0; i < batchCombinedTransferList.length; i++) {
      const transferItem: any = batchCombinedTransferList[i];

      const tokenItem = getItemByKey('token', nameMap, transferItem.address);

      transferListInfo.push({
        token: tokenItem,
      });
    }

    if (_.isObject(contractInfo) && !_.isEmpty(contractInfo)) {
      let contractInfoCopy: any = contractInfo;
      if (contractInfoCopy.token && contractInfoCopy.address) {
        contractInfoCopy.token.address = contractInfoCopy.address;
      }

      transferListInfo.push(contractInfoCopy);
    }
    return transferListInfo;
  }, [contractInfo, nameMap, batchCombinedTransferList]);

  const handleFolded = () => setFolded(folded => !folded);

  const txNoteMap = globalData[LOCALSTORAGE_KEYS_MAP.txPrivateNote];
  const txNote = txNoteMap?.[routeHash];

  const txNoteProps = {
    stage: txNote ? 'edit' : 'create',
    visible,
    data: {
      hash: routeHash,
    },
    onOk: () => {
      setVisible(false);
    },
    onCancel: () => {
      setVisible(false);
    },
  };

  const transactionActionElement = useMemo(
    () =>
      TransactionAction({
        transaction: transactionDetail,
        event: eventlogs,
        customInfo: transferToken,
      }),
    [transactionDetail, eventlogs, transferToken],
  );

  return (
    <StyledCardWrapper>
      <Card className="sirius-Transactions-card">
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.transactionHash)}>
              {t(translations.transaction.hash)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={outerLoading}>
            {routeHash} <CopyButton copyText={routeHash} />
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.block.blockHeight)}>
              {t(translations.general.table.block.height)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={outerLoading}>
            <Link href={`/block/${blockHash}`}>{toThousands(epochNumber)}</Link>{' '}
            <CopyButton copyText={epochNumber} />
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.blockHash)}>
              {t(translations.transaction.blockHash)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={outerLoading}>
            {_.isNil(blockHash) ? (
              '--'
            ) : (
              <>
                <Link href={`/block/${blockHash}`}>{blockHash}</Link>{' '}
                <CopyButton copyText={blockHash} />
              </>
            )}
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.timestamp)}>
              {t(translations.transaction.timestamp)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={outerLoading}>
            {_.isNil(syncTimestamp) ? (
              '--'
            ) : (
              <>
                <Age
                  from={syncTimestamp}
                  retainDurations={4}
                  to={dayjs().valueOf()}
                />
                {` (${formatTimeStamp(syncTimestamp * 1000, 'timezone')})`}
              </>
            )}
          </SkeletonContainer>
        </Description>
        {status === 0 && transactionActionElement.show && (
          <Description
            title={
              <Tooltip title={t(translations.transaction.action.tooltip)}>
                {t(translations.transaction.action.title)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {transactionActionElement.content}
            </SkeletonContainer>
          </Description>
        )}
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.status)}>
              {t(translations.transaction.status)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={outerLoading}>
            <Status
              type={status}
              txExecErrorInfo={txExecErrorInfo}
              address={formatAddress(from)}
              hash={routeHash}
            ></Status>
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.security)}>
              {t(translations.block.security)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={outerLoading}>
            {_.isNil(blockHash) ? (
              '--'
            ) : (
              <>
                <Security blockHash={blockHash}></Security>
                <StyledEpochConfirmationsWrapper>
                  {t(translations.transaction.epochConfirmations, {
                    count: _.isNil(confirmedEpochCount)
                      ? '--'
                      : confirmedEpochCount,
                  })}
                  {partLoading ? (
                    <Spinner
                      size="small"
                      style={{ display: 'inline-block', marginLeft: 5 }}
                    />
                  ) : null}
                </StyledEpochConfirmationsWrapper>
              </>
            )}
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.from)}>
              {t(translations.transaction.from)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={outerLoading}>
            {addressContent(true, from)}
          </SkeletonContainer>
        </Description>
        {generatedToAddress()}
        {effectiveAuth && (
          <Description
            title={
              <Tooltip title={t(translations.authList.tooltip.delegateTo)}>
                {t(translations.authList.delegateTo)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={outerLoading}>
              <RowWrapper>
                {renderAddress(
                  effectiveAuth.address,
                  effectiveAuth,
                  'to',
                  false,
                )}
                <CopyButton copyText={effectiveAuth.address} size={14} />
              </RowWrapper>
            </SkeletonContainer>
          </Description>
        )}

        <CFXTransfers transfers={cfxTransfers} nameMap={nameMap} />
        <TokenTransfers
          transferList={batchCombinedTransferList}
          nameMap={nameMap}
        />

        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.value)}>
              {t(translations.transaction.value)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={outerLoading}>
            {value ? `${fromDripToCfx(value, true)} CFX` : '--'}
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.transactionFee)}>
              {t(translations.transaction.transactionFee)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={outerLoading}>
            <GasFee
              fee={gasFee}
              sponsored={gasCoveredBySponsor}
              isCrossSpaceCall={isCrossSpaceCall}
            />
          </SkeletonContainer>
        </Description>
        <div
          className={clsx('detailResetWrapper', {
            folded: folded,
          })}
        >
          <Description
            title={
              <Tooltip title={t(translations.toolTip.tx.gasPrice)}>
                {t(translations.transaction.gasPrice)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={outerLoading}>
              {!_.isNil(gasPrice) && gasPrice !== '0'
                ? `${fromDripToGdrip(gasPrice, false, {
                    precision: 9,
                    minNum: 1e-9,
                  })} Gdrip`
                : '--'}
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip
                title={
                  <StyleToolTipText>
                    {t(translations.toolTip.tx.gasLimitTip)}
                    <br />
                    <br />
                    {t(translations.toolTip.tx.gasUsedTip)}
                    <br />
                    <br />
                    {t(translations.toolTip.tx.gasChargedip)}
                  </StyleToolTipText>
                }
              >
                {t(translations.transaction.gasUsed)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={outerLoading}>
              {!_.isNil(gasUsed) && gasUsed !== '0' && gas ? (
                <>
                  {`${toThousands(gas)} | ${toThousands(gasUsed)} (${getPercent(
                    gasUsed,
                    gas,
                  )}) | ${isValidGasCharged ? toThousands(gasCharged) : '--'}`}
                </>
              ) : (
                <>--</>
              )}
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip
                title={
                  <>
                    {t(translations.toolTip.tx.baseFee)}
                    <br />
                    {t(translations.toolTip.tx.maxFee)}
                  </>
                }
              >
                {t(translations.transaction.gasFee)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={outerLoading}>
              {isCrossSpaceCall ? (
                '--'
              ) : (
                <>
                  <GasFeeLabelWrapper>
                    {t(translations.transaction.baseFee)}
                  </GasFeeLabelWrapper>
                  {isPending
                    ? '--'
                    : `${fromDripToGdrip(baseFeePerGas, true)} Gdrip`}
                  {type !== 0 && type !== 1 && (
                    <>
                      {' | '}
                      <GasFeeLabelWrapper>
                        {t(translations.transaction.maxFee)}
                      </GasFeeLabelWrapper>
                      {fromDripToGdrip(maxFeePerGas, true)} Gdrip
                      {' | '}
                      <GasFeeLabelWrapper>
                        {t(translations.transaction.maxPriorityFee)}
                      </GasFeeLabelWrapper>
                      {fromDripToGdrip(maxPriorityFeePerGas, true)} Gdrip
                    </>
                  )}
                </>
              )}
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip title={t(translations.toolTip.tx.burntFees)}>
                {t(translations.transaction.burntFees)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={outerLoading}>
              {isCrossSpaceCall || !burntGasFee
                ? '--'
                : `🔥 ${fromDripToCfx(burntGasFee, true)} CFX`}
            </SkeletonContainer>
          </Description>

          <Description
            title={
              <Tooltip title={t(translations.toolTip.tx.transactionAttributes)}>
                {t(translations.transaction.transactionAttributes)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={outerLoading}>
              <AttributeWrapper>
                <Text
                  className="attribute"
                  hoverValue={t(translations.toolTip.tx.txnType[type])}
                  hideTooltip={isCrossSpaceCall || _.isNil(type)}
                  tag="span"
                >
                  {t(translations.transaction.txnType, {
                    type: isCrossSpaceCall || _.isNil(type) ? '--' : type,
                    typeDesc:
                      isCrossSpaceCall || _.isNil(typeDesc)
                        ? ''
                        : `(${typeDesc})`,
                  })}
                </Text>
                <Text
                  className="attribute"
                  hoverValue={t(translations.toolTip.tx.nonce)}
                  tag="span"
                >
                  {t(translations.transaction.nonce, {
                    num: toThousands(nonce),
                  })}
                </Text>
                <Text
                  className="attribute"
                  hoverValue={t(translations.toolTip.tx.position)}
                  tag="span"
                >
                  {t(translations.transaction.position, {
                    num: _.isNil(transactionIndex) ? '--' : transactionIndex,
                  })}
                </Text>
              </AttributeWrapper>
            </SkeletonContainer>
          </Description>
          {/* only send to user type will with empty data */}
          {!data || data === '0x' ? null : (
            <Description
              title={
                <Tooltip title={t(translations.transaction.inputTips)}>
                  {t(translations.transaction.inputData)}
                </Tooltip>
              }
              className="inputLine"
            >
              <SkeletonContainer shown={outerLoading}>
                <InputDataNew
                  toHash={to}
                  data={data}
                  isContractCreated={!!contractCreated}
                ></InputDataNew>
              </SkeletonContainer>
            </Description>
          )}
        </div>
        <Description
          title={
            <StyledFoldButtonWrapper>
              <div
                className={clsx('detailResetFoldButton', {
                  folded: folded,
                })}
                onClick={handleFolded}
              >
                {t(translations.general[folded ? 'viewMore' : 'showLess'])}
              </div>
            </StyledFoldButtonWrapper>
          }
        >
          {' '}
        </Description>
        <Description
          noBorder
          title={
            <Tooltip title={t(translations.profile.tip.note)}>
              {t(translations.transaction.note)}
            </Tooltip>
          }
        >
          {
            <div>
              {txNote ? <span className="tx-note">{txNote}</span> : null}
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setVisible(true);
                }}
                href=""
              >
                {t(translations.transaction[txNote ? 'updateNote' : 'addNote'])}
              </a>
            </div>
          }
        </Description>
      </Card>
      <CreateTxNote {...txNoteProps}></CreateTxNote>
    </StyledCardWrapper>
  );
};

const GasFeeLabelWrapper = styled.span`
  color: #74798c;
`;

const AttributeWrapper = styled.div`
  display: flex;
  gap: 12px;
  ${media.s} {
    flex-direction: column;
  }
  .attribute {
    border: 1px solid #ebeced;
    height: 30px;
    padding: 4px 16px 4px 16px;
    border-radius: 2px;
  }
`;

const StyledCardWrapper = styled.div`
  .inputLine {
    .tooltip-wrapper {
      width: 100% !important;
    }
  }
  .card.sirius-Transactions-card {
    .content {
      padding: 0 1.2857rem;
    }
  }
  .card.sirius-Transactions-table-card {
    margin-top: 1.4286rem;
  }
  .logo {
    width: 1.1429rem;
    margin: 0 0.5714rem 0.2143rem;
  }
  .linkMargin {
    margin-left: 0.5714rem;
  }
  .transferListContainer {
    &.onlyOne {
      .lineContainer .index {
        display: none;
      }
    }
    .lineContainer {
      line-height: 1.7143rem;
    }
    .from {
      margin-right: 0.1429rem;
    }
    .to {
      margin: 0 0.1429rem;
    }
    .for {
      margin: 0 0.1429rem;
    }
    .value {
      margin: 0 0.1429rem;
      color: #002257;
    }
    .type {
      margin: 0 0.1429rem;
    }
    .tokenId {
      margin: 0 0.1429rem;
      color: #002257;
    }
    .batch {
      margin: 0 0.1429rem 0 1.1429rem;
    }
  }
  .label {
    margin-right: 0.2857rem;
  }
  .btnSelectContainer {
    margin-top: 0.8571rem;
  }
  .warningContainer {
    margin-top: 0.5714rem;
    display: flex;
    align-items: center;
    .warningImg {
      width: 1rem;
    }
    .text {
      margin-left: 0.5714rem;
      font-size: 1rem;
      color: #ffa500;
    }
  }
  .shown {
    visibility: visible;
  }
  .hidden {
    visibility: hidden;
  }

  .detailResetWrapper {
    height: inherit;
    overflow: hidden;

    &.folded {
      height: 0;
    }
  }

  .icon-sponsored {
    height: 1.4286rem;
    margin-left: 0.5714rem;
  }

  .tx-note {
    font-style: italic;
    margin-right: 10px;
  }
`;

const StyledEpochConfirmationsWrapper = styled.span`
  margin-left: 1rem;
  vertical-align: middle;
`;

const StyledFoldButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;

  .detailResetFoldButton {
    display: flex;
    align-items: center;
    justify-items: center;
    padding: 0.8571rem 0;
    font-size: 1rem;
    color: #002257;
    cursor: pointer;
    padding: 0;

    &::after {
      content: '';
      background-image: url(${imgChevronDown});
      transform: rotate(180deg);
      width: 1.1429rem;
      height: 1.1429rem;
      display: inline-block;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      margin-left: 0.3571rem;
    }

    &.folded::after {
      transform: rotate(0);
    }
  }
`;

const StyleToolTipText = styled.div`
  font-size: 12px;
  font-weight: 500;
  font-family: PingFang SC;
  color: #ececec;
`;

const RowWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
