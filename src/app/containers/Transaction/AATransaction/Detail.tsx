import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import BigNumber from 'bignumber.js';
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
import {
  formatAddress,
  formatTimeStamp,
  getPercent,
  toThousands,
  isZeroAddress,
} from 'utils';
import { CFX_TOKEN_TYPES } from 'utils/constants';
import { EVMAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/EVMAddressContainer';
import { getAddressNameInfo } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/utils';
import clsx from 'clsx';
import { Security } from 'app/components/Security/Loadable';
import { InputDataNew } from 'app/components/TxnComponents';
import { TransactionAction } from '@cfxjs/sirius-next-common/dist/components/TransactionAction/evmTransactionAction';
import _ from 'lodash';

import imgChevronDown from 'images/chevronDown.png';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { CreateTxNote } from '../../Profile/CreateTxNote';

import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import {
  fromCfxToDrip,
  fromDripToGdrip,
  decodeAANonce,
} from '@cfxjs/sirius-next-common/dist/utils';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import dayjs from 'dayjs';
import { StyledHighlight } from '../EventLogs/StyledComponents';
import { EOACodeIcon } from 'app/components/EOACodeIcon';
import { CFXTransfers } from '../CFXTransfers';
import { TokenTransfers } from '../TokenTransfers';
import { renderAddress } from 'utils/tableColumns/utils';
import { InputData as InputDataBody } from '@cfxjs/sirius-next-common/dist/components/InputData';
import { Status } from './Status';
import { useTxEventLogs } from 'utils/hooks/useTxEventLogs';

// AA Transaction Detail Page
export const Detail = ({ data: transactionDetail, partLoading }) => {
  const [visible, setVisible] = useState(false);
  const [globalData] = useGlobalData();
  const { t } = useTranslation();
  const { hash: routeHash } = useParams<{
    hash: string;
  }>();
  const {
    senderHex: from,
    entryPointHex: to,
    bundlerHex,
    userOpHash,
    txHash,
    nonce: originNonce,
    blockHash,
    epoch,
    createdAt,
    success,
    data,
    actualGasCost,
    actualGasUsed,
    confirmedEpochCount,
    blockBaseFeePerGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    callGasLimit,
    verificationGasLimit,
    preVerificationGas,
    effectiveAuth: _effectiveAuth,
    tokenTransfers,
    cfxTransfers,
    nameMap,
    position,
    signature,
    paymasterDecoded,
    paymasterPostOpGasLimit,
    paymasterVerificationGasLimit,
    initCode,
    failedReason,
  } = transactionDetail;
  const hasInitCode = !_.isNil(initCode) && initCode !== '0x';
  const {
    nonce,
    key,
    keyHex,
    syncTimestamp,
    gasPrice,
    gasLimit,
  } = useMemo(() => {
    const syncTimestamp = createdAt ? dayjs(createdAt).unix() : null;
    let nonce = originNonce;
    let key = '0';
    let keyHex = '0x0';
    try {
      const decoded = decodeAANonce(originNonce);
      nonce = decoded.nonce;
      key = decoded.key;
      keyHex = decoded.keyHex;
    } catch (error) {
      console.log('nonce decode error:', error);
    }
    const gasUsedBn = new BigNumber(actualGasUsed || 0);
    const gasPriceBn = gasUsedBn.isZero()
      ? null
      : fromCfxToDrip(actualGasCost).div(gasUsedBn);
    const gasLimit = new BigNumber(callGasLimit || 0)
      .plus(verificationGasLimit || 0)
      .plus(preVerificationGas || 0)
      .plus(paymasterVerificationGasLimit || 0)
      .plus(paymasterPostOpGasLimit || 0);
    return {
      nonce,
      key,
      keyHex,
      syncTimestamp,
      gasPrice: gasPriceBn?.toFixed(),
      gasLimit: gasLimit.toFixed(),
    };
  }, [
    originNonce,
    createdAt,
    actualGasCost,
    actualGasUsed,
    callGasLimit,
    verificationGasLimit,
    preVerificationGas,
    paymasterVerificationGasLimit,
    paymasterPostOpGasLimit,
  ]);
  const { data: eventlogs, isLoading: logLoading } = useTxEventLogs(
    routeHash,
    true,
  );
  const [folded, setFolded] = useState(true);
  const effectiveAuth = isZeroAddress(_effectiveAuth?.address)
    ? null
    : _effectiveAuth;

  const addressContent = useCallback(
    (isFull = false, address) => {
      const addr = formatAddress(address);
      const nameInfo = getAddressNameInfo(addr, nameMap);
      return (
        <span>
          <StyledHighlight scope="address" value={addr}>
            <EVMAddressContainer
              value={addr}
              isFull={isFull}
              isContract={nameInfo?.isContract}
              verify={nameInfo?.verify}
            />
          </StyledHighlight>{' '}
          {nameInfo?.nametag ? `(${nameInfo.nametag})` : null}{' '}
          <CopyButton copyText={addr} />
        </span>
      );
    },
    [nameMap],
  );

  const generatedToAddress = () => {
    if (to) {
      const toNameInfo = getAddressNameInfo(to, nameMap);
      if (toNameInfo?.isContract) {
        return (
          <Description
            title={
              <Tooltip title={t(translations.toolTip.tx.entryPoint)}>
                {t(translations.transaction.aaTx.entryPoint)}
              </Tooltip>
            }
          >
            {t(translations.transaction.contract)}{' '}
            {toNameInfo && (
              <>
                {toNameInfo.tokenIconUrl ? (
                  <img
                    className="logo"
                    src={toNameInfo.tokenIconUrl}
                    alt="icon"
                  />
                ) : null}
                <Link href={`/address/${formatAddress(to)}`}>
                  {toNameInfo.alias || ''}
                </Link>{' '}
              </>
            )}
            {addressContent(true, to)}
          </Description>
        );
      } else {
        return (
          <Description
            title={
              <Tooltip title={t(translations.toolTip.tx.entryPoint)}>
                {t(translations.transaction.aaTx.entryPoint)}
              </Tooltip>
            }
          >
            <RowWrapper>
              {effectiveAuth && <EOACodeIcon />}
              {addressContent(true, to)}
            </RowWrapper>
          </Description>
        );
      }
    } else {
      return (
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.entryPoint)}>
              {t(translations.transaction.aaTx.entryPoint)}
            </Tooltip>
          }
        >
          {t(translations.transaction.contractCreation)}
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

      const nameInfo = getAddressNameInfo(transferItem.address, nameMap);

      if (nameInfo) {
        transferListInfo.push({
          token: {
            ...nameInfo.originInfo.token,
            address: transferItem.address,
          },
        });
      }
    }

    const toNameInfo = getAddressNameInfo(to, nameMap);
    if (toNameInfo) {
      transferListInfo.push({
        token: {
          ...toNameInfo.originInfo.token,
          address: to,
        },
      });
    }
    return transferListInfo;
  }, [nameMap, to, batchCombinedTransferList]);

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
        event: eventlogs || [],
        customInfo: transferToken,
      }),
    [transactionDetail, eventlogs, transferToken],
  );

  return (
    <StyledCardWrapper>
      <Card className="sirius-Transactions-card">
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.aaTransactionHash)}>
              {t(translations.transaction.aaTx.aaHash)}
            </Tooltip>
          }
        >
          {userOpHash} <CopyButton copyText={userOpHash} />
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.bundleTransactionHash)}>
              {t(translations.transaction.aaTx.bundleHash)}
            </Tooltip>
          }
        >
          <Link href={`/tx/${txHash}`}>{txHash}</Link>{' '}
          <CopyButton copyText={txHash} />
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.block.blockHeight)}>
              {t(translations.general.table.block.height)}
            </Tooltip>
          }
        >
          <SkeletonContainer>
            <Link href={`/block/${blockHash}`}>{toThousands(epoch)}</Link>{' '}
            <CopyButton copyText={epoch} />
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.blockHash)}>
              {t(translations.transaction.blockHash)}
            </Tooltip>
          }
        >
          <SkeletonContainer>
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
          <SkeletonContainer>
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

        {success && transactionActionElement.show && (
          <Description
            title={
              <Tooltip title={t(translations.transaction.action.tooltip)}>
                {t(translations.transaction.action.title)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={logLoading}>
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
          <SkeletonContainer>
            <Status
              success={success}
              failedReason={failedReason}
              to={from}
              implementation={effectiveAuth?.address}
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
          <SkeletonContainer>
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
          <SkeletonContainer>{addressContent(true, from)}</SkeletonContainer>
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
            <SkeletonContainer>
              <RowWrapper>
                {renderAddress(effectiveAuth.address, {
                  ...effectiveAuth,
                  nameMap,
                })}
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

        <Description title={t(translations.transaction.aaTx.transactionFee)}>
          <SkeletonContainer>
            {`${_.isNil(actualGasCost) ? '--' : `${actualGasCost} CFX`}`}
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
            <SkeletonContainer>
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
                  </StyleToolTipText>
                }
              >
                {t(translations.transaction.aaTx.gasUsed)}
              </Tooltip>
            }
          >
            <SkeletonContainer>
              {!_.isNil(actualGasUsed) && actualGasUsed !== 0 && gasLimit ? (
                <>
                  {`${toThousands(gasLimit)} | ${toThousands(
                    actualGasUsed,
                  )} (${getPercent(actualGasUsed, gasLimit)})`}
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
            <SkeletonContainer>
              <GasFeeLabelWrapper>
                {t(translations.transaction.baseFee)}
              </GasFeeLabelWrapper>
              {`${fromDripToGdrip(blockBaseFeePerGas, true)} Gdrip`}
              {maxFeePerGas && (
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
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip title={t(translations.toolTip.tx.bundler)}>
                {t(translations.transaction.aaTx.bundler)}
              </Tooltip>
            }
          >
            {addressContent(true, bundlerHex)}
          </Description>
          {paymasterDecoded?.address && (
            <Description
              title={
                <Tooltip title={t(translations.toolTip.tx.paymaster)}>
                  {t(translations.transaction.aaTx.paymaster)}
                </Tooltip>
              }
            >
              {addressContent(true, paymasterDecoded.address)}
            </Description>
          )}

          <Description
            title={
              <Tooltip title={t(translations.toolTip.tx.transactionAttributes)}>
                {t(translations.transaction.transactionAttributes)}
              </Tooltip>
            }
          >
            <SkeletonContainer>
              <AttributeWrapper>
                <Text className="attribute" tag="span" hideTooltip>
                  {t(translations.transaction.aaTx.aaPosition, {
                    num: _.isNil(position) ? '--' : position,
                  })}
                </Text>
                <Text className="attribute" tag="span" hideTooltip>
                  {t(translations.transaction.nonce, {
                    num: toThousands(nonce),
                  })}
                </Text>
                {key !== '0' && (
                  <Text className="attribute" tag="span" hideTooltip>
                    {t(translations.transaction.aaTx.key, {
                      key: keyHex,
                    })}
                  </Text>
                )}
                <Text className="attribute" tag="span" hideTooltip>
                  {t(translations.transaction.aaTx.callGasLimit, {
                    num: toThousands(callGasLimit),
                  })}
                </Text>
                {verificationGasLimit && (
                  <Text className="attribute" tag="span" hideTooltip>
                    {t(translations.transaction.aaTx.verificationGasLimit, {
                      num: toThousands(verificationGasLimit),
                    })}
                  </Text>
                )}
                {preVerificationGas && (
                  <Text className="attribute" tag="span" hideTooltip>
                    {t(translations.transaction.aaTx.preVerificationGas, {
                      num: toThousands(preVerificationGas),
                    })}
                  </Text>
                )}
                {paymasterVerificationGasLimit && (
                  <Text className="attribute" tag="span" hideTooltip>
                    {t(
                      translations.transaction.aaTx
                        .paymasterVerificationGasLimit,
                      {
                        num: toThousands(paymasterVerificationGasLimit),
                      },
                    )}
                  </Text>
                )}
                {paymasterPostOpGasLimit && (
                  <Text className="attribute" tag="span" hideTooltip>
                    {t(translations.transaction.aaTx.paymasterPostOpGas, {
                      num: toThousands(paymasterPostOpGasLimit),
                    })}
                  </Text>
                )}
              </AttributeWrapper>
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip title={t(translations.toolTip.tx.signature)}>
                {t(translations.transaction.aaTx.signature)}
              </Tooltip>
            }
          >
            <SkeletonContainer>
              <InputDataBody
                dataType="original"
                input={signature}
                space="evm"
              />
            </SkeletonContainer>
          </Description>
          {hasInitCode && (
            <Description
              title={
                <Tooltip title={t(translations.toolTip.tx.initCode)}>
                  {t(translations.transaction.aaTx.initCode)}
                </Tooltip>
              }
            >
              <SkeletonContainer>
                <InputDataBody
                  dataType="original"
                  input={initCode}
                  space="evm"
                />
              </SkeletonContainer>
            </Description>
          )}
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
              {/* aa tx use from or effectiveAuth?.address to decode tx data */}
              <SkeletonContainer>
                <InputDataNew
                  toHash={from}
                  data={data}
                  isContractCreated={false}
                  implementation={effectiveAuth?.address}
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
  flex-wrap: wrap;
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
