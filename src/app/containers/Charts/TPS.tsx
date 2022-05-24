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

export function TPS({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    preview: preview,
    name: 'tps',
    title: t(translations.highcharts.tps.title),
    subtitle: t(translations.highcharts.tps.subtitle),
    request: {
      url: OPEN_API_URLS.tps,
      formatter: data => {
        return [
          data?.list?.map(s => [
            // @ts-ignore
            dayjs.utc(s.statTime).valueOf(),
            // @ts-ignore
            Number(s.tps),
          ]),
        ];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.tps.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.tps.yAxisTitle),
        },
      },
      tooltip: {
        valueDecimals: 2,
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(translations.highcharts.tps.seriesName)}</span>`,
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
