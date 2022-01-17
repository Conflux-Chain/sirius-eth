import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { List } from 'app/components/List/';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';
import { Modal } from '@cfxjs/react-ui';
import BigNumber from 'bignumber.js';
import { Text } from 'app/components/Text';
import { fromDripToCfx, getTimeByBlockInterval } from 'utils';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { CONTRACTS, CFX, NETWORK_TYPE, NETWORK_TYPES } from 'utils/constants';
import ViewMore from '../../../images/contract-address/viewmore.png';
import {
  abi as governanceAbi,
  bytecode as gobernanceBytecode,
} from '../../../utils/contract/governance.json';
import {
  abi as stakingAbi,
  bytecode as stakingBytecode,
} from '../../../utils/contract/staking.json';
import { Tooltip } from '../../components/Tooltip/Loadable';
import { Link } from '../../components/Link/Loadable';

// https://github.com/Conflux-Dev/vote/blob/main/src/pages/staking/index.js
function getCurrentStakingEarned(list, rate, stakedCfx) {
  if (list.length === 0) return 0;
  let earned = 0;
  list.forEach(item => {
    earned =
      earned +
      (Number(item.amount) * Number(rate)) /
        Number(item.accumulatedInterestRate);
  });
  earned = new BigNumber(earned).minus(stakedCfx).toNumber();
  return earned;
}

const stakingContract = CFX.Contract({
  abi: stakingAbi,
  bytecode: stakingBytecode,
  address: CONTRACTS.staking,
});

export function AddressMetadata({ address, accountInfo }) {
  const { t } = useTranslation();
  const loading = accountInfo.name === t(translations.general.loading);
  const skeletonStyle = { height: '1.5714rem' };
  const [earned, setEarned] = useState(0);
  const [voteList, setVoteList] = useState<any>([]);
  const [lockedCFX, setLockedCFX] = useState(0);
  const [currentVotingRights, setCurrentVotingRights] = useState(0);
  const [currentBlockNumber, setCurrentBlockNumber] = useState(0);
  const [voteListLoading, setVoteListLoading] = useState<boolean>(true);
  const [modalShown, setModalShown] = useState<boolean>(false);

  const governanceContract = useMemo(() => {
    return CFX.Contract({
      abi: governanceAbi,
      bytecode: gobernanceBytecode,
      address: CONTRACTS.governance,
    });
  }, []);

  useEffect(() => {
    // get staking info
    // TODO batch
    if (accountInfo.address) {
      const proArr: any = [];
      proArr.push(CFX.getDepositList(address));
      proArr.push(CFX.getAccumulateInterestRate());
      proArr.push(CFX.getVoteList(address));
      proArr.push(governanceContract.getBlockNumber());
      Promise.all(proArr)
        .then(res => {
          const depositList = res[0];
          const rate = res[1];
          const currentBlockN: any = res[3] || 0;
          setCurrentBlockNumber(currentBlockN.toString());
          const currentStakingEarned = getCurrentStakingEarned(
            depositList,
            rate,
            new BigNumber(accountInfo.stakingBalance).toFixed(),
          );
          setEarned(currentStakingEarned);
          setVoteList(res[2]);
          // @ts-ignore
          if (res[2] && res[2].length > 0) {
            //get current voting power
            stakingContract
              .getVotePower(address, currentBlockN)
              .then(res => {
                const votePower = res;
                setCurrentVotingRights(votePower);
              })
              .catch(e => {
                console.error(e);
              });

            // get locked CFX
            CFX.InternalContract('Staking')
              .getLockedStakingBalance(address, currentBlockN)
              .then(res => {
                setLockedCFX(res || 0);
              })
              .catch(e => {
                console.error(e);
              });
          } else {
            setCurrentVotingRights(0);
          }
        })
        .catch(e => {
          console.error(e);
          setEarned(0);
          setVoteList([]);
          setCurrentVotingRights(0);
        })
        .finally(() => {
          setVoteListLoading(false);
        });
    }
  }, [address, accountInfo, governanceContract]);

  return (
    <>
      <List
        className="staking"
        list={[
          {
            title: (
              <Tooltip
                hoverable
                text={
                  <>
                    {t(translations.toolTip.address.stakedBegin)}
                    {NETWORK_TYPE === NETWORK_TYPES.testnet ? (
                      <a
                        href="https://votetest.confluxnetwork.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://votetest.confluxnetwork.org
                      </a>
                    ) : (
                      <a
                        href="https://governance.confluxnetwork.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://governance.confluxnetwork.org
                      </a>
                    )}
                    {t(translations.toolTip.address.stakedEnd)}
                  </>
                }
              >
                {t(translations.addressDetail.staked)}
              </Tooltip>
            ),
            children: (
              <SkeletonContainer shown={loading} style={skeletonStyle}>
                <CenterLine>
                  <Content>
                    <Text
                      hoverValue={`${fromDripToCfx(
                        accountInfo.stakingBalance || 0,
                        true,
                      )} CFX`}
                    >
                      {fromDripToCfx(accountInfo.stakingBalance || 0)} CFX
                    </Text>
                  </Content>
                </CenterLine>
              </SkeletonContainer>
            ),
          },
          {
            title: (
              <Tooltip
                hoverable
                text={
                  <>
                    {t(translations.toolTip.address.lockedBegin)}
                    {NETWORK_TYPE === NETWORK_TYPES.testnet ? (
                      <a
                        href="https://votetest.confluxnetwork.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://votetest.confluxnetwork.org
                      </a>
                    ) : (
                      <a
                        href="https://governance.confluxnetwork.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://governance.confluxnetwork.org
                      </a>
                    )}
                    {t(translations.toolTip.address.lockedEnd)}
                  </>
                }
              >
                {t(translations.addressDetail.locked)}
              </Tooltip>
            ),
            children: (
              <SkeletonContainer
                shown={loading || voteListLoading}
                style={skeletonStyle}
              >
                <CenterLine>
                  <Content>
                    {voteList && voteList.length > 0 ? (
                      <>
                        <Text
                          hoverValue={`${fromDripToCfx(lockedCFX, true)} CFX`}
                        >
                          {fromDripToCfx(lockedCFX)} CFX
                        </Text>
                        &nbsp;
                        <Text
                          hoverValue={t(
                            translations.addressDetail.viewLockedDetails,
                          )}
                        >
                          <ImgWrapper
                            onClick={() => {
                              setModalShown(true);
                            }}
                            src={ViewMore}
                            alt={t(
                              translations.addressDetail.viewLockedDetails,
                            )}
                          />
                        </Text>
                      </>
                    ) : (
                      '0 CFX'
                    )}
                  </Content>
                </CenterLine>
              </SkeletonContainer>
            ),
          },
          {
            title: (
              <Text hoverValue={t(translations.toolTip.address.stakingEarned)}>
                {t(translations.addressDetail.stakingEarned)}
              </Text>
            ),
            children: (
              <SkeletonContainer shown={loading} style={skeletonStyle}>
                <CenterLine>
                  <Content>
                    <Text
                      hoverValue={`${fromDripToCfx(earned || 0, true)} CFX`}
                    >
                      {fromDripToCfx(earned || 0)} CFX
                    </Text>
                    &nbsp;&nbsp;{t(translations.addressDetail.apy)}
                  </Content>
                </CenterLine>
              </SkeletonContainer>
            ),
          },
          {
            title: (
              <Text
                hoverValue={t(translations.toolTip.address.currentVotingRights)}
              >
                {t(translations.addressDetail.currentVotingRights)}
              </Text>
            ),
            children: (
              <SkeletonContainer
                shown={loading || voteListLoading}
                style={skeletonStyle}
              >
                <CenterLine>
                  <Content>
                    <Text
                      hoverValue={fromDripToCfx(currentVotingRights || 0, true)}
                    >
                      {fromDripToCfx(currentVotingRights || 0)}
                    </Text>
                  </Content>
                </CenterLine>
              </SkeletonContainer>
            ),
          },
        ]}
      />

      <Modal
        closable
        open={modalShown}
        onClose={() => {
          setModalShown(false);
        }}
        width="600"
      >
        <Modal.Content>
          <ModalWrapper>
            <h2>{t(translations.addressDetail.lockedDetailTitle)}</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>{t(translations.addressDetail.lockedDetailLocked)}</th>
                    <th>
                      {t(
                        translations.addressDetail
                          .lockedDetailUnlockBlockNumber,
                      )}
                    </th>
                    <th>
                      {t(translations.addressDetail.lockedDetailUnlockTime)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {voteList && voteList.length > 0 ? (
                    voteList.map((v, i) => {
                      const { days } = getTimeByBlockInterval(
                        v.unlockBlockNumber,
                        currentBlockNumber,
                      );
                      return (
                        <tr key={i}>
                          <td>
                            <Text
                              hoverValue={fromDripToCfx(v.amount || 0, true)}
                            >
                              {fromDripToCfx(v.amount || 0)}
                            </Text>
                          </td>
                          <td>
                            <Link
                              href={`/block-countdown/${v.unlockBlockNumber}`}
                            >
                              {v.unlockBlockNumber}
                            </Link>
                          </td>
                          <td>
                            {t(translations.addressDetail.unlockTime, { days })}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ModalWrapper>
        </Modal.Content>
      </Modal>
    </>
  );
}

const CenterLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  .metadata-tooltip-btn {
    margin-left: 0.5rem;
    margin-bottom: 0.2857rem;
    ${media.s} {
      margin-left: 1rem;
    }
  }
`;

const Content = styled.span`
  &.not-available.link {
    color: #97a3b4;
  }
`;

const ImgWrapper = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 5px;
  margin-bottom: 3px;
`;

const ModalWrapper = styled.div`
  padding: 10px;
  width: 450px;

  h2 {
    font-size: 18px;
    font-weight: 500;
    color: #3a3a3a;
    line-height: 26px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e8e9ea;
  }

  .table-wrapper {
    max-height: 350px;
    overflow-y: auto;
  }

  table {
    width: 100%;
    font-size: 14px;
    text-align: left;
    padding: 10px 0;
    th,
    td {
      font-weight: normal;
      color: #9b9eac;
      line-height: 24px;
      padding: 4px;
    }
    td {
      color: #23304f;
    }
  }
`;
