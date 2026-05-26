/**
 *
 * Status
 *
 */
import React, { useMemo } from 'react';
import styled from 'styled-components';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import imgSuccess from 'images/status/success.svg';
import imgError from 'images/status/error.svg';
import { AAFailedReason } from '@cfxjs/sirius-next-common/dist/components/AAFailedReason';

interface Props {
  success?: boolean;
  failedReason?: any;
  to?: string;
  implementation?: string;
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
type StatusProps = React.PropsWithChildren<Props & NativeAttrs>;

const StatusComponent = ({
  success = true,
  className,
  children,
  failedReason,
  to,
  implementation,
  ...others
}: StatusProps) => {
  const { t } = useTranslation();
  const type = success ? '0' : '1';
  const typeMap = useMemo(
    () => ({
      '0': {
        status: 'success',
        name: t(translations.general.status.success.text),
        icon: imgSuccess,
      },
      '1': {
        status: 'error',
        name: t(translations.general.status.error.text),
        icon: imgError,
      },
    }),
    [t],
  );

  let icon = typeMap[type].icon;
  let name = typeMap[type].name;

  const content = (
    <>
      <span className="icon-and-text">
        <img className="icon" src={icon} alt={type} />
        <span className="text">{name}</span>
      </span>
      {!failedReason ? null : (
        <span className="description">
          <AAFailedReason
            data={failedReason}
            to={to}
            implementation={implementation}
            fallback={t(translations.accountAbstraction.aaTxFailed)}
          />
        </span>
      )}
    </>
  );

  return (
    <StyledStatusWrapper
      className={clsx('status', className, typeMap[type].status)}
      {...others}
    >
      {content}
    </StyledStatusWrapper>
  );
};

export const Status = React.memo(StatusComponent);

const StyledStatusWrapper = styled.span`
  display: flex;
  align-items: flex-start;
  vertical-align: middle;
  margin-right: 0.7143rem;

  &.success {
    color: #7cd77b;
    .dot {
      background-color: #7cd77b;
    }
  }
  &.error {
    color: #e64e4e;
    .dot {
      background-color: #e64e4e;
    }
  }
  .icon-and-text {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .icon {
    width: 1.1429rem;
    height: 1.1429rem;
  }
  .text {
    margin-left: 0.8571rem;
    line-height: 1.5714rem;
    word-break: keep-all;
  }
  .description {
    color: #97a3b4;
    margin-left: 0.5714rem;
  }
`;
