import React from 'react';
import { Row, Col, Divider } from '@cfxjs/antd';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components/macro';
import moment from 'moment';

import { BlockTime } from './BlockTime';
import { TPS } from './TPS';
import { HashRate } from './HashRate';
import { CirculatingSupply } from './CirculatingSupply';
import { Difficulty } from './Difficulty';
import { Tx } from './Tx';
import { CFXTransfer } from './CFXTransfer';
import { TokenTransfer } from './TokenTransfer';
import { CFXHolderAccounts } from './CFXHolderAccounts';
import { AccountGrowth } from './AccountGrowth';
import { ActiveAccounts } from './ActiveAccounts';
import { Contracts } from './Contracts';

export function NewChart() {
  const { t, i18n } = useTranslation();
  const iszh = i18n.language.includes('zh');

  const format = iszh ? 'YYYY MMMDD' : 'DD MMM YYYY';
  // TODO, temporary use moment, should use dayjs, but need solve locale issue first
  moment.locale(iszh ? 'zh-cn' : 'en');
  const current = moment().subtract(1, 'day');
  const oneMonthBefore = moment().subtract(30, 'day');

  return (
    <StyledChartPreviewWrapper>
      <PageHeader subtitle={t(translations.highcharts.preview.subtitle)}>
        {t(translations.highcharts.preview.title)}
      </PageHeader>
      <Row justify="space-between">
        <Col>
          <div className="tip">{t(translations.highcharts.preview.tip)}</div>
        </Col>
        <Col>
          <div className="duration">
            {oneMonthBefore.format(format)} - {current.format(format)}
          </div>
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Divider orientation="left">
          {t(translations.highcharts.preview.marketData)}
        </Divider>
        {/* <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <TotalSupply preview={true} />
        </Col> */}
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <CirculatingSupply preview={true} />
        </Col>
        <Divider orientation="left">
          {t(translations.highcharts.preview.blockchainData)}
        </Divider>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <BlockTime preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <TPS preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <HashRate preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <Difficulty preview={true} />
        </Col>
        <Divider orientation="left">
          {t(translations.highcharts.preview.transaction)}
        </Divider>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <Tx preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <TokenTransfer preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <CFXTransfer preview={true} />
        </Col>
        <Divider orientation="left">
          {t(translations.highcharts.preview.account)}
        </Divider>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <CFXHolderAccounts preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <AccountGrowth preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <ActiveAccounts preview={true} />
        </Col>
        <Divider orientation="left">
          {t(translations.highcharts.preview.contracts)}
        </Divider>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <Contracts preview={true} />
        </Col>
      </Row>
    </StyledChartPreviewWrapper>
  );
}

const StyledChartPreviewWrapper = styled.div`
  .tip,
  .duration {
    font-size: 16px;
    margin: 0 0 12px 0;
    color: var(--theme-color-gray4);
  }

  .duration {
    color: var(--theme-color-blue0);
  }

  div.ant-divider.ant-divider-horizontal {
    margin: 0;
    color: var(--theme-color-blue0);
  }
`;
