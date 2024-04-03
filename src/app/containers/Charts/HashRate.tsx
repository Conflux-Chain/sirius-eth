import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import {
  StockChartTemplate,
  ChildProps,
} from 'app/components/Charts/StockChartTemplate';
import { OPEN_API_URLS } from 'utils/constants';
import { Wrapper } from './Wrapper';
import {
  xAxisCustomLabelHour,
  tooltipCustomLabel,
} from 'utils/hooks/useHighcharts';

export function HashRate({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    name: 'hashrate',
    preview: preview,
    title: t(translations.highcharts.hashRate.title),
    subtitle: t(translations.highcharts.hashRate.subtitle),
    request: {
      url: OPEN_API_URLS.core_mining,
      formatter: data => [
        data?.list?.map(s => [
          // @ts-ignore
          dayjs.utc(s.statTime).valueOf(),
          // @ts-ignore
          Number(s.hashRate) / 1000000000, // format to GH/s
        ]),
      ],
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.hashRate.title),
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
          text: t(translations.highcharts.hashRate.yAxisTitle),
        },
      },
      tooltip: {
        valueDecimals: 2,
        ...tooltipCustomLabel,
      },
      series: [
        {
          type: 'area',
          name: `<span>${t(
            translations.highcharts.hashRate.seriesName,
          )}</span>`,
        },
      ],
      navigator: {
        xAxis: {
          ...xAxisCustomLabelHour,
        },
      },
    },
  };

  return (
    <Wrapper {...props}>
      <StockChartTemplate {...props}></StockChartTemplate>
    </Wrapper>
  );
}
