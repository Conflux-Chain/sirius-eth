import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from 'sirius-next/packages/common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import BigNumber from 'bignumber.js';
import ENV_CONFIG from 'sirius-next/packages/common/dist/env';

export function CFXTransfer({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const tickAmount = preview ? 4 : 6;

  const props = {
    request: {
      url: OPEN_API_URLS.cfxTransfer,
      query: preview
        ? {
            limit: '30',
            intervalType: 'day',
          }
        : undefined,
      formatter: data => {
        const data1: any = [];
        const data2: any = [];
        const data3: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.statTime).valueOf();
          data3.push([t, Number(d.transferCount)]);
          data2.push([t, Number(d.userCount)]);
          data1.push([t, new BigNumber(d.amount).div(1e18).toNumber()]);
        });

        return [data1, data2, data3];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      header: {
        title: {
          text: t(translations.highcharts.transfer.title),
        },
        subtitle: {
          text: t(translations.highcharts.transfer.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.breadcrumb.charts),
            path: '/charts',
          },
          {
            name: t(translations.highcharts.breadcrumb.transfer),
            path: '/charts/cfx-transfer',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.transfer.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      // legend: {
      //   enabled: !preview,
      // },
      xAxis: {
        type: 'datetime',
      },
      yAxis: [
        {
          title: {
            text: t(translations.highcharts.transfer.yAxisTitle),
          },
          opposite: false,
          tickAmount,
        },
        {
          title: {
            text: t(translations.highcharts.transfer.yAxisTitle3),
          },
          opposite: true,
          tickAmount,
        },
      ],
      series: [
        {
          type: 'column',
          name: `<span>${t(
            translations.highcharts.transfer.seriesName3,
          )}</span>`,
          yAxis: 1,
          tooltip: {
            valueDecimals: 2,
            valueSuffix: ' CFX',
          },
          color: ENV_CONFIG.ENV_THEME.mixedChartColors[0],
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.transfer.seriesName2,
          )}</span>`,
          color: ENV_CONFIG.ENV_THEME.mixedChartColors[1],
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.transfer.seriesName,
          )}</span>`,
          color: ENV_CONFIG.ENV_THEME.mixedChartColors[2],
        },
      ],
    },
  };

  return preview ? (
    <PreviewChartTemplate {...props}></PreviewChartTemplate>
  ) : (
    <StockChartTemplate {...props}></StockChartTemplate>
  );
}
