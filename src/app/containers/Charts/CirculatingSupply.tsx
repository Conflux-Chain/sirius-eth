import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from 'sirius-next/packages/common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import SDK from 'js-conflux-sdk';
import BigNumber from 'bignumber.js';

export function CirculatingSupply({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.supply,
      query: preview
        ? {
            limit: '30',
            intervalType: 'day',
          }
        : undefined,
      formatter: data => {
        if (data) {
          return [
            {
              name: t(translations.highcharts.circulatingSupply.others),
              y: parseInt(
                new SDK.Drip(
                  new BigNumber(data?.totalCirculating)
                    .minus(data?.nullAddressBalance)
                    .toNumber(),
                ).toCFX(),
              ),
            },
            {
              sliced: true,
              selected: true,
              name: t(translations.highcharts.circulatingSupply.zeroAddress),
              y: parseInt(new SDK.Drip(data?.nullAddressBalance).toCFX()),
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
          text: t(translations.highcharts.circulatingSupply.title),
        },
        subtitle: {
          text: t(translations.highcharts.circulatingSupply.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.breadcrumb.charts),
            path: '/charts',
          },
          {
            name: t(translations.highcharts.breadcrumb.circulating),
            path: '/charts/circulating',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.circulatingSupply.title),
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
