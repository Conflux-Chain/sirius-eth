import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col } from '@cfxjs/sirius-next-common/dist/components/Grid';
import { useTranslation } from 'react-i18next';
import { StyledCard as Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { translations } from 'locales/i18n';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { formatNumber } from '../../../utils';
import {
  reqHomeDashboard /*, reqTransferTPS */,
  reqTransferPlot,
} from '../../../utils/httpRequest';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import lodash from 'lodash';
import { Tx, AccountGrowth } from '../Charts/Loadable';
import ENV_CONFIG from 'env';

function Info(title, number: any) {
  return (
    <div className="info">
      <div className="title">{title}</div>
      <div className="number">{number || '--'}</div>
    </div>
  );
}

const reqCorePlotData = async () => {
  try {
    const response = await fetch(
      `${ENV_CONFIG.ENV_CORE_SCAN_HOST}/v1/plot?interval=133&limit=7`,
    );

    return await response.json();
  } catch (error) {
    return { error };
  }
};

// TODO redesign
export function BlockchainInfo({ timestamp = 1 }: { timestamp?: number }) {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<any>({});
  // const [transferData, setTransferData] = useState<any>({});
  const [tps, setTps] = useState<string>();
  const [blockTime, setBlockTime] = useState<string>();
  const [hashRate, setHashRate] = useState<string>();

  useEffect(() => {
    reqHomeDashboard()
      .then(res => {
        setDashboardData(res || {});
      })
      .catch(e => {
        console.log('reqHomeDashboard error: ', e);
      });

    reqCorePlotData().then(res => {
      if (res && res.data && res.data.list) {
        setHashRate(formatNumber(res.data.list[6].hashRate));
      }
    });
    // reqTransferTPS()
    //   .then(res => {
    //     if (Object.keys(res)) {
    //       setTransferData(res);
    //     }
    //   })
    //   .catch(e => {
    //     console.log('reqTransferTPS error: ', e);
    //   });

    reqTransferPlot()
      .then(res => {
        if (res.list?.length) {
          setTps(formatNumber(res.list[6].tps));
          setBlockTime(formatNumber(res.list[6].blockTime));
        }
      })
      .catch(e => {
        console.log('reqTransferPlot error: ', e);
      });
  }, [timestamp]);

  return (
    <CardWrapper>
      <Card>
        <Row
          gutter={[8, 8]}
          justify="start"
          className="stats-container stats-container-pow-top"
        >
          <Col xs={24} sm={24} lg2={5}>
            {Info(
              t(translations.statistics.home.currentEpoch),
              `${dashboardData.epochNumber ? dashboardData.epochNumber : '--'}`,
            )}
          </Col>
          <Col xs={24} sm={24} lg2={4}>
            {Info(
              t(translations.statistics.home.account),
              `${
                dashboardData.addressCount
                  ? formatNumber(dashboardData.addressCount, {
                      withUnit: false,
                      keepDecimal: false,
                    })
                  : '--'
              }`,
            )}
          </Col>
          <Col xs={24} sm={24} lg2={3}>
            {Info(
              // t(translations.statistics.home.transactions),
              <Link href={'/charts/tx'} className="info-link">
                {t(translations.statistics.home.transactions)}
              </Link>,
              `${
                dashboardData.transactionCount
                  ? formatNumber(dashboardData.transactionCount, {
                      withUnit: false,
                      keepDecimal: false,
                    })
                  : '--'
              }`,
            )}
          </Col>
          <Col xs={24} sm={24} lg2={3}>
            {Info(
              // t(translations.charts.tps.title),
              <Link href="/charts/tps" className="info-link">
                {t(translations.charts.tps.title)}
              </Link>,
              lodash.isNil(tps) ? '--' : tps,
            )}
          </Col>
          <Col xs={24} sm={24} lg2={3}>
            {Info(
              t(translations.statistics.home.gasUsed),
              `${
                dashboardData.gasUsedPerSecond
                  ? formatNumber(dashboardData.gasUsedPerSecond, {
                      withUnit: false,
                      keepDecimal: false,
                    })
                  : '--'
              }`,
            )}
          </Col>
          <Col xs={24} sm={24} lg2={3}>
            {Info(
              // t(translations.charts.blockTime.title),
              <Link href="/charts/blocktime" className="info-link">
                {t(translations.charts.blockTime.title)}
              </Link>,
              lodash.isNil(blockTime) ? '--' : blockTime + 's',
            )}
          </Col>
          <Col xs={24} sm={24} lg2={3}>
            {Info(
              // t(translations.charts.hashRate.title),
              <Link href="/charts/hashrate" className="info-link">
                {t(translations.charts.hashRate.title)}
              </Link>,
              lodash.isNil(hashRate) ? '--' : hashRate,
            )}
          </Col>

          {/* <Col xs={24} sm={24} lg2={4}>
            {Info(
              t(translations.statistics.home.currentBlockNumber),
              `${dashboardData.blockNumber ? dashboardData.blockNumber : '--'}`,
            )}
          </Col> */}
          {/* <Col xs={24} sm={24} lg2={4}>
            {Info(
              t(translations.statistics.home.contract),
              // <Link to={'/chart/contractDeploy'} className="info-link">
              //   {t(translations.statistics.home.contract)}
              // </Link>,
              `${
                dashboardData.contractCount
                  ? formatNumber(dashboardData.contractCount, {
                      withUnit: false,
                      keepDecimal: false,
                    })
                  : '--'
              }`,
            )}
          </Col> */}
        </Row>
        {/* <div className="stats-container stats-container-split"></div>
        <Row
          gutter={[8, 8]}
          justify="start"
          className="stats-container stats-container-pow-bottom"
        >
          
          <Col xs={24} sm={24} lg2={4}>
            {Info(
              t(translations.charts.tokenTransferTps.title),
              lodash.isNil(transferData?.tps)
                ? '--'
                : formatNumber(transferData?.tps, {
                    withUnit: false,
                  }),
            )}
          </Col>
          
        </Row> */}
      </Card>

      <div className="charts">
        <Row gutter={[20, 20]} justify="center">
          <Col xs={24} sm={24} lg2={12}>
            <Tx preview={true} />
          </Col>
          <Col xs={24} sm={24} lg2={12}>
            <AccountGrowth preview={true} />
          </Col>
        </Row>
      </div>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 16px;
  width: 100%;

  .charts {
    margin-top: 20px;
    width: calc(100% - 1px); // fix shaking

    .overview-chart-item {
      > div {
        padding: 12px 18px;
        width: 100%;
        height: 210px;
        min-height: inherit;
        overflow: hidden;
      }

      ${media.m} {
        > div {
          padding: 10px 12px 5px;
        }
      }
    }
  }

  .stats-container {
    padding: 12px 0;

    ${media.m} {
      padding: 0;
    }

    &.stats-container-pow-bottom {
      margin-top: 1px solid #e8e9ea;
    }

    &.stats-container-split {
      border-top: 1px solid #e8e9ea;
      padding: 0;
    }

    & > .sirius-col {
      &:nth-child(1) {
        border-right: 1px solid #e8e9ea;
      }

      &:nth-child(3) {
        border-right: 1px solid #e8e9ea;
      }

      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(4) {
        padding-left: 2rem;
      }
    }

    &.stats-container-pow-bottom {
      margin-top: 1px solid #e8e9ea;
    }

    &.stats-container-split {
      border-top: 1px solid #e8e9ea;
      padding: 0;
    }

    & > .sirius-col {
      ${media.m} {
        max-width: 100%;
        border-right: none !important;
        padding-left: 0 !important;
        border-bottom: 1px solid #e8e9ea;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }

  .info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    ${media.m} {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .title {
      font-size: 14px;
      font-weight: normal;
      color: #7e8598;
      line-height: 24px;
      white-space: nowrap;

      ${media.s} {
        font-size: 12px;
      }
    }

    .number {
      font-size: 18px;
      font-weight: bold;
      color: #282d30;
      display: flex;
      flex-direction: row;
      align-items: baseline;
      justify-content: flex-start;

      ${media.s} {
        font-size: 16px;
      }

      .trend {
        margin-left: 10px;
      }
    }
  }

  .info-link,
  .chart-link {
    cursor: pointer;

    &:hover {
      border-bottom: 1px solid var(--theme-color-link);
    }
  }
`;
