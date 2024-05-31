import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';

export function Contracts({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.contracts,
      query: preview
        ? {
            limit: '30',
            intervalType: 'day',
          }
        : undefined,
      formatter: data => {
        const data1: any = [];
        const data2: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.statTime).valueOf();
          data1.push([t, Number(d.total)]);
          data2.push([t, Number(d.count)]);
        });

        return [data1, data2];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      header: {
        title: {
          text: t(translations.highcharts.contracts.title),
        },
        subtitle: {
          text: t(translations.highcharts.contracts.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.breadcrumb.charts),
            path: '/charts',
          },
          {
            name: t(translations.highcharts.breadcrumb.contracts),
            path: '/charts/contracts',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.contracts.title),
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
      yAxis: {
        title: {
          text: t(translations.highcharts.contracts.yAxisTitle),
        },
      },
      tooltip: {
        shared: true,
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.contracts.seriesName,
          )}</span>`,
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.contracts.seriesName2,
          )}</span>`,
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
