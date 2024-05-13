import React from 'react';
import { Tooltip as UITooltip } from '@cfxjs/react-ui';
import styled from 'styled-components';
import { TooltipProps } from '@cfxjs/react-ui/dist/tooltip/tooltip';
import clsx from 'clsx';
import { media } from 'styles/media';

export const Tooltip = React.memo(
  ({
    children,
    contentClassName,
    text,
    placement,
    ...others
  }: TooltipProps) => {
    return (
      <TooltipWrapper>
        <UITooltip
          contentClassName={clsx('sirius-tooltip', contentClassName)}
          text={text}
          placement={placement || 'top'}
          {...others}
        >
          {children}
        </UITooltip>
      </TooltipWrapper>
    );
  },
);

const TooltipWrapper = styled.span`
  .tooltip-content.sirius-tooltip {
    font-variant-numeric: initial;
    text-transform: initial;
    border-radius: 0;
    padding: 0.2857rem 0.7143rem 0.3571rem;
    font-weight: 400;
    font-size: 12px;
    color: #cdcdcd;
    line-height: 1.1429rem;
    min-width: 40px;
    max-width: 40rem; // max width of hash tooltip, longer content will fold with word break
    ${media.s} {
      max-width: 24rem;
      white-space: normal;
      word-break: break-all;
    }
  }

  a {
    color: #00acff;
    &:hover {
      color: #3dc0ff;
    }
  }
`;
