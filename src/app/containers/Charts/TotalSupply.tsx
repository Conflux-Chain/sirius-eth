import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import SDK from 'js-conflux-sdk';
import { useChartQueryParams } from '@cfxjs/sirius-next-common/dist/utils/hooks/useChartQueryParams';

export function TotalSupply({ preview = false }: ChildProps) {
  const { t } = useTranslation();
  const query = useChartQueryParams({
    preview,
  });

  const props = {
    request: {
      url: OPEN_API_URLS.supply,
      query: query,
      formatter: data => {
        if (data) {
          return [
            {
              name: t(translations.highcharts.totalSupply.fourYearUnlock),
              y: parseInt(new SDK.Drip(data?.fourYearUnlockBalance).toCFX()),
            },
            {
              name: t(translations.highcharts.totalSupply.twoYearUnlock),
              y: parseInt(new SDK.Drip(data?.twoYearUnlockBalance).toCFX()),
            },
            {
              sliced: true,
              selected: true,
              name: t(translations.highcharts.totalSupply.circulatingUnlock),
              y: parseInt(new SDK.Drip(data?.totalCirculating).toCFX()),
            },
          ];
        }
        return [];
      },
    },
    options: {
      chart: {
        type: 'pie',
      },
      header: {
        optionShow: false,
        title: {
          text: t(translations.highcharts.totalSupply.title),
        },
        subtitle: {
          text: t(translations.highcharts.totalSupply.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.breadcrumb.charts),
            path: '/charts',
          },
          {
            name: t(translations.highcharts.breadcrumb.supply),
            path: '/charts/supply',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.totalSupply.title),
      },
      tooltip: {
        pointFormat: `Amount: <b>{point.y}</b><br>Percentage: <b>{point.percentage:.2f}%</b>`,
        valueSuffix: ' CFX',
      },
      series: [
        {
          type: 'pie',
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
