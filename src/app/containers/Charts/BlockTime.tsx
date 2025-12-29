import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/PreviewChartTemplate';
import {
  ChildProps,
  xAxisCustomLabelHour,
  tooltipCustomLabel,
} from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { scope } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import { useChartQueryParams } from '@cfxjs/sirius-next-common/dist/utils/hooks/useChartQueryParams';

export function BlockTime({ preview = false }: ChildProps) {
  const { t } = useTranslation();
  const query = useChartQueryParams({
    preview,
  });

  const props = {
    request: {
      url: OPEN_API_URLS.mining,
      query: query,
      formatter: data => [
        data?.list?.map(s => [
          // @ts-ignore
          dayjs.utc(s.statTime).valueOf(),
          // @ts-ignore
          Number(s.blockTime),
        ]),
      ],
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      header: {
        title: {
          text: t(translations.highcharts.averageBlockTime.title),
        },
        subtitle: {
          text: t(translations.highcharts.averageBlockTime.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.breadcrumb.charts),
            path: '/charts',
          },
          {
            name: t(translations.highcharts.breadcrumb.blocktime),
            path: '/charts/blocktime',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.averageBlockTime.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
        ...xAxisCustomLabelHour,
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.averageBlockTime.yAxisTitle),
        },
      },
      tooltip: {
        valueDecimals: 2,
        ...tooltipCustomLabel,
      },
      series: [
        {
          type: 'column',
          name: `<span>${t(
            translations.highcharts.averageBlockTime.seriesName,
          )}</span>`,
          tooltip: {
            valueSuffix: 's',
          },
          opacity: 0.75,
        },
      ],
      navigator: {
        xAxis: {
          ...xAxisCustomLabelHour,
        },
      },
      intervalScope: {
        min: scope.min,
        hour: scope.hour,
        day: scope.day,
      },
    },
  };

  return preview ? (
    <PreviewChartTemplate {...props}></PreviewChartTemplate>
  ) : (
    <StockChartTemplate {...props}></StockChartTemplate>
  );
}
