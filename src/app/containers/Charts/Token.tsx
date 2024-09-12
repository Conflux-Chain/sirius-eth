import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { ChildProps } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import BigNumber from 'bignumber.js';

export function Token({
  address,
  type,
}: ChildProps & { address: string; type: string }) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.token,
      query: {
        limit: '365',
        intervalType: 'day',
        address,
      },
      formatter: data => {
        const data1: any = [];
        const data2: any = [];
        const data3: any = [];
        const data4: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.day).valueOf();
          data1.push([t, new BigNumber(d.transferAmount).div(1e18).toNumber()]);
          data2.push([t, Number(d.transferCount)]);
          data3.push([t, Number(d.uniqueReceiver)]);
          data4.push([t, Number(d.uniqueSender)]);
        });

        if (type.indexOf('20') > -1) {
          return [data1, data2, data3, data4];
        } else {
          return [data2, data3, data4];
        }
      },
    },
    options: {
      chart: {
        zoomType: 'x',
        type: 'line',
      },
      header: {
        breadcrumbShow: false,
        titleShow: false,
        title: {
          text: t(translations.highcharts.token.title),
        },
        subtitle: {
          text: t(translations.highcharts.token.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.breadcrumb.charts),
            path: '/charts',
          },
          {
            name: t(translations.highcharts.token.title),
            path: '/charts/account-growth',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.token.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.token.yAxisTitle),
        },
      },
      series: [
        {
          name: `<span>${t(translations.highcharts.token.seriesName2)}</span>`,
        },
        {
          name: `<span>${t(translations.highcharts.token.seriesName3)}</span>`,
        },
        {
          name: `<span>${t(translations.highcharts.token.seriesName4)}</span>`,
        },
      ],
    },
  };

  if (type.indexOf('20') > -1) {
    props.options.series.unshift({
      name: `<span>${t(translations.highcharts.token.seriesName)}</span>`,
      // @ts-ignore
      tooltip: {
        valueDecimals: 2,
      },
    });
  }

  return <StockChartTemplate {...props}></StockChartTemplate>;
}
