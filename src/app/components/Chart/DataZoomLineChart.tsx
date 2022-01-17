import React from 'react';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { formatNumber } from '../../../utils';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

interface Props {
  dateKey?: string;
  valueKey?: string | string[];
  indicator?: string;
  width?: number | string;
  minHeight?: number;
  data?: any[];
  hideRoom?: boolean;
}
export const DataZoomLineChart = ({
  indicator = '',
  dateKey = 'day',
  valueKey = 'value',
  width = document.body.clientWidth,
  minHeight = 500,
  data = [],
  hideRoom = false,
}: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.includes('zh') ? 'zh' : 'en';
  const dateFormatter = function (value, simple = false) {
    return dayjs(value).format(
      lang === 'zh'
        ? simple
          ? 'MM-DD'
          : 'YYYY-MM-DD'
        : simple
        ? 'MMM DD'
        : 'MMM DD, YYYY',
    );
  };

  if (!Array.isArray(valueKey)) {
    valueKey = [valueKey as string];
  }

  const chartData = data
    // sort for data zoom thumbnail
    .sort((a, b) => a[dateKey].localeCompare(b[dateKey]))
    .map(d => [d[dateKey], ...(valueKey as string[]).map(v => +d[v])]);

  const unit = (indicator, index: any) => {
    if (indicator === 'dailyTransactionCFX' && index === 2) {
      return ' CFX';
    }
    return '';
  };

  return (
    <ReactECharts
      style={{ minHeight, height: minHeight }}
      notMerge={true}
      option={{
        tooltip: {
          trigger: 'axis',
          confine: true,
          formatter: function (params) {
            const data = params
              .map(
                (p, index) =>
                  `<div>
<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${
                    p.color
                  };"></span>
<span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">${
                    p.seriesName
                  }</span>
<span style="${
                    p.seriesName ? 'float:right;margin-left:20px;' : ''
                  }font-size:14px;color:#666;font-weight:700">${formatNumber(
                    p.data[1],
                  )}${unit(indicator, index)}</span>
<div style="clear:both"></div>
</div>`,
              )
              .join('');
            return `<div style="font-weight: 700;margin-bottom: 10px;">${dateFormatter(
              params[0].data[0],
            )}</div>${data}`;
          },
        },
        grid: {
          top: minHeight < 300 ? 20 : 40,
          left: '10',
          right: '20',
          bottom: minHeight < 300 ? 35 : 50, // typeof width === 'number' && width < 800 ? '100' : '70',
          containLabel: true,
        },
        legend: {
          show: valueKey.length > 1,
          itemGap: 10,
          right: 10,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          minInterval: 1000 * 3600 * 24 * 10,
          axisLabel: {
            rotate: 0, // typeof width === 'number' && width < 800 ? -30 : 0,
            formatter: v => dateFormatter(v, true),
            showMinLabel: true,
          },
        },
        yAxis: {
          type: 'value',
          splitNumber: minHeight < 300 ? 2 : 5,
          // boundaryGap: [0, '10%'],
          // axisLabel: {
          //   formatter: function (value) {
          //     return formatNumber(value);
          //   },
          // },
        },
        dataZoom: hideRoom
          ? []
          : [
              {
                id: 'dataZoomX',
                type: 'inside',
                xAxisIndex: [0],
                filterMode: 'filter',
                rangeMode: ['percent', 'value'],
                start: 100,
                endValue: chartData.length - 31,
              },
              {
                id: 'dataZoomY',
                type: 'slider',
                filterMode: 'empty',
                labelFormatter: function (value) {
                  // category date formatter: value is index
                  return chartData && chartData[value] && chartData[value][0]
                    ? dateFormatter(chartData[value][0])
                    : value;
                },
                height: minHeight < 300 ? 20 : 30,
                bottom: minHeight < 300 ? 10 : 'auto',
                showDetail: minHeight >= 300,
              },
            ],
        series: valueKey.map((v, i) => ({
          name: t(translations.charts[indicator][v]) || '',
          type: 'line',
          symbol: 'none',
          data: chartData.map(d => [d[0], d[i + 1]]),
        })),
      }}
    />
  );
};
