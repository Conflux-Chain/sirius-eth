import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import Title from '@cfxjs/sirius-next-common/dist/components/Charts/PreviewTitle';
import styled from 'styled-components';
import column from 'images/charts/column.png';
import lineRight from 'images/charts/line-right.png';

export function CIP1559Metrics() {
  const { t } = useTranslation();

  const header = {
    title: {
      text: t(translations.highcharts.burntFeesAnalysis['CIP-1559Metrics']),
    },
    subtitle: {
      text: t(translations.highcharts.burntFeesAnalysis['CIP-1559MetricsTips']),
    },
    breadcrumb: [
      {
        name: t(translations.highcharts.preview.title),
        path: '/pow-charts',
      },
      {
        name: t(translations.highcharts.burntFeesAnalysis['CIP-1559Metrics']),
        path: '/cip-1559-metrics',
      },
    ],
  };
  return (
    <BurntFeesAnalysisWrap>
      <Title header={header}></Title>
      <ChartWrap style={{ gap: '6%' }}>
        <img className="lineRight" src={lineRight} alt="" />
        <img className="column" src={column} alt="" />
      </ChartWrap>
    </BurntFeesAnalysisWrap>
  );
}

const BurntFeesAnalysisWrap = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const ChartWrap = styled.div`
  width: 100%;
  display: flex;
  padding: 2.15rem 1.25rem;

  .lineRight {
    width: 100%;
    min-width: 100px;
    max-width: 360px;
  }
  .column {
    width: 100%;
    min-width: 100px;
    max-width: 232px;
  }
`;
