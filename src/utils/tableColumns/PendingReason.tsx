import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components/macro';
import { Popover } from '@cfxjs/antd';
import { reqPendingTxs } from 'utils/httpRequest';
import { Link } from 'app/components/Link/Loadable';
import { formatAddress, formatBalance } from 'utils';
import BigNumber from 'bignumber.js';

interface Props {
  detail?: any;
  account?: string;
  hash?: string;
}

export const PendingReason = ({
  detail: _detail,
  account,
  hash: _hash,
}: Props) => {
  const { t } = useTranslation();
  const [detail, setDetail] = useState(_detail || {});

  useEffect(() => {
    async function main() {
      if (account) {
        const data = await reqPendingTxs({
          query: {
            accountAddress: account,
          },
        });

        if (data) {
          const { pendingDetail, pendingTransactions } = data;

          // not current tx pending reason
          if (pendingTransactions[0]?.hash === _hash) {
            setDetail(pendingDetail);
          }
        }
      }
    }

    main().catch(console.log);
  }, [_hash, account]);

  const codeMap = useMemo(() => {
    const {
      futrueNonce,
      notEnoughCash,
      readyToPack,
      tooOldEpoch,
      fullnodeInnerError,
    } = translations.transaction.pendingDetails;
    return {
      '11': {
        summary: futrueNonce.summary,
        detail: futrueNonce.detail,
        tip: futrueNonce.tip,
      },
      '20': {
        summary: notEnoughCash.summary,
        detail: notEnoughCash.original.detail,
        tip: notEnoughCash.original.tip,
      },
      '21': {
        summary: notEnoughCash.summary,
        detail: notEnoughCash.contractCreateAndToEOA.detail,
        tip: notEnoughCash.contractCreateAndToEOA.tip,
      },
      '22': {
        summary: notEnoughCash.summary,
        detail: notEnoughCash.contractCreateAndToEOA.detail,
        tip: notEnoughCash.contractCreateAndToEOA.tip,
      },
      '23': {
        summary: notEnoughCash.summary,
        detail: notEnoughCash.toContract.detail,
        tip: notEnoughCash.toContract.tip,
      },
      '31': {
        summary: readyToPack.summary,
        detail: readyToPack.epochExceed.detail,
        tip: readyToPack.epochExceed.tip,
      },
      '32': {
        summary: readyToPack.summary,
        detail: readyToPack.lowGasPrice.detail,
        tip: readyToPack.lowGasPrice.tip,
      },
      '41': {
        summary: tooOldEpoch.summary,
        detail: tooOldEpoch.detail,
        tip: tooOldEpoch.tip,
      },
      '51': {
        summary: fullnodeInnerError.summary,
        detail: fullnodeInnerError.detail,
        tip: fullnodeInnerError.tip,
      },
    };
  }, []);

  const getDetail = useCallback(() => {
    const i18n = codeMap[detail.code];

    let params = {};

    if (detail.code === 11 || detail.code === 31 || detail.code === 32) {
      params = detail.params;
    } else if (detail.code === 20) {
      params = {
        original: detail.message,
      };
    } else if (detail.code === 21 || detail.code === 22 || detail.code === 23) {
      const { value, gas, gasPrice, balance } = detail.params;

      params = {
        total: formatBalance(
          new BigNumber(value).plus(new BigNumber(gas).multipliedBy(gasPrice)),
          18,
          false,
          {
            precision: 18,
          },
        ),
        value: detail.params.value,
        gas: detail.params.gas,
        gasPrice: detail.params.gasPrice,
        balance: formatBalance(balance),
      };
    }

    const content = (
      <StyledPendingContentWrapper>
        <div>
          <b>{t(translations.transaction.pending.detail)} </b>
          {t(i18n.detail, { ...params })}
        </div>
        <div>
          <b>{t(translations.transaction.pending.tip)}</b> {t(i18n.tip)}
        </div>
        <div>
          <b>{t(translations.transaction.pending.reference)}</b>{' '}
          <a href={t(translations.transaction.pending.link)} target="__blank">
            {t(translations.transaction.pending.link)}
          </a>
        </div>
      </StyledPendingContentWrapper>
    );

    return (
      <StyledPendingReasonWrapper>
        <div className="summary">{t(i18n.summary)}</div>
        <Popover content={content} title="">
          <div className="detail">
            {t(translations.transaction.pending.view)}
          </div>
        </Popover>
      </StyledPendingReasonWrapper>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  if (account) {
    if (detail.code) {
      return getDetail();
    } else {
      return (
        <Link
          href={`/address/${formatAddress(
            account as string,
          )}?transactionType=pending`}
        >
          {t(translations.transaction.pendingReasonLink)}
        </Link>
      );
    }
  } else {
    if (detail.code) {
      return getDetail();
    } else {
      return <>--</>;
    }
  }
};

const StyledPendingReasonWrapper = styled.div`
  display: inline-flex;
  color: #333;

  .summary {
    padding-right: 10px;
  }

  .detail {
    color: var(--theme-color-blue2);
    display: inline;
  }
`;

const StyledPendingContentWrapper = styled.div`
  max-width: 450px;

  b {
    color: var(--theme-color-blue0);
  }
`;
