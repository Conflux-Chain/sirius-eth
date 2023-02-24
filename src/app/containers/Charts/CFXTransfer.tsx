import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import {
  StockChartTemplate,
  ChildProps,
} from 'app/components/Charts/StockChartTemplate';
import { OPEN_API_URLS } from 'utils/constants';
import { Wrapper } from './Wrapper';
import BigNumber from 'bignumber.js';

export function CFXTransfer({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const tickAmount = preview ? 4 : 6;

  const props = {
    preview: preview,
    name: 'cfx-transfer',
    title: t(translations.highcharts.cfxTransfer.title),
    subtitle: t(translations.highcharts.cfxTransfer.subtitle),
    request: {
      url: OPEN_API_URLS.cfxTransfer,
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
      title: {
        text: t(translations.highcharts.cfxTransfer.title),
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
            text: t(translations.highcharts.cfxTransfer.yAxisTitle),
          },
          opposite: false,
          tickAmount,
        },
        {
          title: {
            text: t(translations.highcharts.cfxTransfer.yAxisTitle3),
          },
          opposite: true,
          tickAmount,
        },
      ],
      series: [
        {
          type: 'column',
          name: `<span>${t(
            translations.highcharts.cfxTransfer.seriesName3,
          )}</span>`,
          color: '#7cb5ec',
          yAxis: 1,
          tooltip: {
            valueDecimals: 2,
            valueSuffix: ' CFX',
          },
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.cfxTransfer.seriesName2,
          )}</span>`,
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.cfxTransfer.seriesName,
          )}</span>`,
        },
      ],
    },
  };

  return (
    <Wrapper {...props}>
      <StockChartTemplate {...props}></StockChartTemplate>
    </Wrapper>
  );
}
