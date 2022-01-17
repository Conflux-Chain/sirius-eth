import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Grid } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { Card } from 'app/components/Card/Loadable';
import { Tooltip } from 'app/components/Tooltip/Loadable';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';
import { reqCfxSupply } from 'utils/httpRequest';
import { formatBalance } from 'utils';
import zeroAddressIcon from '../../../images/home/zeroAddress.svg';
import circulatingMarketCap from 'images/home/circulatingMarketCap.svg';

function Info(icon, title, tooltip, number) {
  return (
    <Grid xs={24} sm={12} className="info">
      <div>
        <div className="icon">
          <img src={icon} alt={title} />
        </div>
        <div className="info-content">
          <Tooltip
            hoverable
            text={
              <div
                dangerouslySetInnerHTML={{
                  __html: tooltip,
                }}
              />
            }
            placement="top"
          >
            <span className="title">{title}</span>
          </Tooltip>
          <div className="number">{number}</div>
        </div>
      </div>
    </Grid>
  );
}

export function MarketInfo() {
  const { t } = useTranslation();
  const [marketInfo, setMarketInfo] = useState<any>({});
  useEffect(() => {
    reqCfxSupply().then(res => {
      setMarketInfo(res || {});
    });
  }, []);

  return marketInfo.totalCirculating != null ? (
    <CardWrapper>
      <Card>
        <Grid.Container gap={3} justify="center">
          {Info(
            circulatingMarketCap,
            t(translations.charts.cfxCirculatingSupply.title),
            t(translations.charts.cfxCirculatingSupply.description),
            `${formatBalance(marketInfo.totalCirculating, 18, false, {
              withUnit: false,
              keepDecimal: false,
            })} CFX`,
          )}
          {Info(
            zeroAddressIcon,
            t(translations.charts.zeroAddress.title),
            t(translations.charts.zeroAddress.description),
            `${formatBalance(marketInfo.nullAddressBalance, 18, false, {
              withUnit: false,
              keepDecimal: false,
            })} CFX`,
          )}
        </Grid.Container>
      </Card>
    </CardWrapper>
  ) : null;
}

const CardWrapper = styled.div`
  margin-bottom: 24px;
  width: 100%;

  .info {
    ${media.s} {
      border-bottom: 1px solid #e8e9ea;
    }
    > div {
      width: 100%;
      display: flex;
      align-items: center;
      border-right: 1px solid #e8e9ea;

      ${media.s} {
        border-right: none;
      }

      .icon {
        width: 60px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 60px;
        background-color: rgba(138, 130, 255, 0.06);

        img {
          width: 20px;
          height: 20px;
        }
      }

      .info-content {
        padding-left: 24px;

        .title {
          font-size: 14px;
          font-weight: normal;
          color: #7e8598;
          line-height: 24px;
        }

        .number {
          font-size: 18px;
          font-weight: bold;
          color: #282d30;
          line-height: 30px;
        }
      }
    }

    &:nth-of-type(2) {
      .icon {
        background-color: rgba(79, 158, 255, 0.06);
      }
    }

    &:nth-of-type(3) {
      .icon {
        background-color: rgba(116, 219, 88, 0.06);
      }
    }

    &:last-of-type {
      ${media.s} {
        border-bottom: none;
      }
      > div {
        border-right: none;
      }
    }
  }
`;
