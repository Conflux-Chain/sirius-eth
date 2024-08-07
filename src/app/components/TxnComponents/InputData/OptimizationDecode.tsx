import React, { useEffect, useState } from 'react';
import { disassembleEvent } from '../util';
import styled from 'styled-components';
import { reqContractAndToken } from 'utils/httpRequest';
import { formatContractAndTokenInfoMap } from 'utils';
import _ from 'lodash';
import { ContractDetail } from '../ContractDetail';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { Event } from '../Event';
// import Info from '@zeit-ui/react-icons/info';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { AddressLabel } from '../AddressLabel';
import { convertCheckSum } from '@cfxjs/sirius-next-common/dist/utils/address';

export const OptimizationDecode = ({
  data = '',
  decodedData = {},
}: {
  data: string;
  decodedData: any;
}) => {
  const { signature, name } = decodedData;
  const [contractAndTokenInfo, setContractAndTokenInfo] = useState({});
  const args = disassembleEvent(decodedData, {});

  useEffect(() => {
    let addressList = args.map(t => t.hexAddress).filter(t => t);
    addressList = _.uniq(addressList);

    if (addressList.length) {
      reqContractAndToken({
        address: addressList,
      })
        .then(data => {
          if (data.total) {
            setContractAndTokenInfo(formatContractAndTokenInfoMap(data.map));
          }
        })
        .catch(e => {
          console.log('reqContractAndToken or process error: ', e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedData]);

  return (
    <StyledOptimizationDecodeWrapper>
      <div className="optimization-decode-item optimization-decode-fullname">
        <div className="optimization-decode-item-title function">
          Function:{' '}
        </div>
        <div className="optimization-decode-item-body">
          <Event fnName={name} args={args}></Event>
        </div>
      </div>
      <div className="optimization-decode-item optimization-decode-signature">
        <div className="optimization-decode-item-title method-id">
          MethodID:{' '}
        </div>
        <div className="optimization-decode-item-body">
          {signature || data.slice(0, 10)}
        </div>
      </div>
      {args.length > 0 ? (
        <div className="optimization-decode-item optimization-decode-data">
          <div className="optimization-decode-item-title parameters">
            Parameters:
          </div>
          <div className="optimization-decode-item-body optimization-decode-data-body">
            {args.map((a, index) => {
              let value = a.value;
              if (a.type === 'address') {
                const contractInfo = contractAndTokenInfo[a.hexAddress];

                value = (
                  <>
                    <Link href={`/address/${a.hexAddress}`}>
                      {convertCheckSum(a.hexAddress)}{' '}
                    </Link>
                    <ContractDetail info={contractInfo} />
                    <AddressLabel address={a.hexAddress} />
                  </>
                );
              }

              let type: React.ReactNode = a.type;
              if (/\(.*\)/.test(type as string)) {
                type = (
                  <span className="optimization-decode-data-item-type-turple">
                    <span style={{ marginRight: '2px' }}>turple</span>
                    {/* <Info size={12} /> */}
                  </span>
                );
              }
              return (
                <div className="optimization-decode-data-item" key={index}>
                  <div className="optimization-decode-data-item-index">
                    {index}
                  </div>
                  <div className="optimization-decode-data-item-type">
                    <Text maxWidth={'70px'} hoverValue={a.type}>
                      {type}
                    </Text>
                  </div>
                  <div className="optimization-decode-data-item-name">
                    {a.argName}:
                  </div>
                  <div className="optimization-decode-data-item-value">
                    <pre className="prev">{value}</pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </StyledOptimizationDecodeWrapper>
  );
};
const StyledOptimizationDecodeWrapper = styled.div`
  .optimization-decode-item {
    display: flex;
    min-height: 32px;

    .optimization-decode-item-title {
      width: 100px;
      flex-shrink: 0;
      flex-grow: 0;
      font-size: 14px;
      line-height: 18px;
      color: #6a737d;

      &.function {
        padding-top: 1px;
      }

      &.method-id {
        padding-top: 1px;
      }

      &.parameters {
        padding-top: 6px;
      }
    }
  }

  .optimization-decode-data-body {
    background-color: #f7f7f8;
    width: 100%;
    max-height: 200px;
    overflow: auto;

    .optimization-decode-data-item {
      display: flex;
      align-items: flex-start;
      min-height: 32px;
      border-bottom: 1px solid #e8e9ea;
      padding: 0.3571rem 0.3571rem 0.3571rem 0;
      overflow: hidden;

      ${media.s} {
        flex-direction: column;
        align-items: center;
      }

      &:first-child {
        border-top: 1px solid #e8e9ea;
      }

      .optimization-decode-data-item-index {
        margin-left: 0.5rem;
        font-size: 14px;
        color: #6a737d;
        min-width: 8px;
        flex-shrink: 0;
        height: 1.4286rem;
        line-height: 1.4286rem;
      }
      .optimization-decode-data-item-type {
        margin-left: 0.6rem;
        border: 1px solid rgba(217, 99, 73, 0.5);
        border-radius: 10px;
        font-size: 12px;
        line-height: 1.4286rem;
        color: #d96349;
        flex-shrink: 0;
        width: 5.7143rem;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 1.4286rem;

        .optimization-decode-data-item-type-turple {
          display: flex;
          align-items: center;
        }
      }
      .optimization-decode-data-item-name {
        margin-left: 0.6rem;
        font-size: 14px;
        color: #e79d35;
        flex-shrink: 0;
        height: 1.4286rem;
        line-height: 1.2857rem;
      }
      .optimization-decode-data-item-value {
        font-size: 14px;
        color: #25282d;
        padding-left: 0.3571rem;

        .prev {
          margin-bottom: -0.2857rem;
          font-size: 1rem;
        }
      }
    }
  }
`;
