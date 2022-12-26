import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Card } from 'app/components/Card/Loadable';
import { Link } from 'app/components/Link/Loadable';
import { NFTPreview } from 'app/components/NFTPreview';
import styled from 'styled-components';
import { Row, Col, Collapse, Tooltip, message } from '@cfxjs/antd';
import { Description } from 'app/components/Description/Loadable';
import { CopyButton } from 'app/components/CopyButton/Loadable';
import { reqNFTDetail, reqToken, reqRefreshMetadata } from 'utils/httpRequest';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { useBreakpoint } from 'styles/media';
import { InfoIconWithTooltip } from 'app/components/InfoIconWithTooltip/Loadable';
import { Button } from 'app/components/Button/Loadable';

import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';

import { formatTimeStamp, formatAddress } from 'utils';

import { TransferAndHolders } from './TransferAndHolders';
import { TransferModal } from './TransferModal';

import { AddressContainer } from 'app/components/AddressContainer';
import dayjs from 'dayjs';

const AceEditorStyle = {
  width: 'initial',
  backgroundColor: '#F8F9FB',
  opacity: 0.62,
  margin: '0.3571rem 0',
};

interface Props {
  type: string;
  address: string;
  decimals: number;
}

interface Query {
  accountAddress?: string;
  transactionHash?: string;
  tokenId?: string;
}

interface StringAttributes {
  trait_type: string;
  value: string;
}

interface NumberAttributes {
  trait_type: string;
  value: number;
}

const TraitPanel = ({ data = [] }: { data: Array<StringAttributes> }) => {
  return (
    <StyledTraitPanelWrapper>
      <Row gutter={[16, 16]} align="stretch">
        {data.map(d => (
          <Col span={6} key={d.trait_type}>
            <div className="container">
              <div className="type">{d.trait_type}</div>
              <div className="value">{d.value}</div>
            </div>
          </Col>
        ))}
      </Row>
    </StyledTraitPanelWrapper>
  );
};

const DatePanel = ({ data = [] }: { data: Array<NumberAttributes> }) => {
  return (
    <StyledDatePanelWrapper>
      {data.map(d => {
        let date = '--';

        try {
          date = dayjs(d.value * 1000).format('YYYY-MM-DD HH:mm:ss');
        } catch (error) {}

        return (
          <div className="container" key={d.trait_type}>
            <span className="type">{d.trait_type}</span>
            <span className="value">{date}</span>
          </div>
        );
      })}
    </StyledDatePanelWrapper>
  );
};

const DescriptionPanel = ({ data = '' }) => {
  return <div>{data}</div>;
};

const StyledTraitPanelWrapper = styled.div`
  .container {
    border: 1px solid var(--theme-color-blue2);
    border-radius: 4px;
    padding: 1rem;
    text-align: center;
    background-color: rgba(70, 101, 240, 0.05);
    height: 100%;
  }

  .type {
    color: var(--theme-color-blue2);
    text-transform: uppercase;
    font-weight: 500;
    font-size: 12px;
  }

  .value {
    font-weight: 500;
  }
`;
const StyledDatePanelWrapper = styled.div`
  .container {
    display: flex;
    justify-content: space-between;
  }
`;

export function NFTDetail(props) {
  const bp = useBreakpoint();
  const { t, i18n } = useTranslation();
  const { id, address } = useParams<{
    id: string;
    address: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const [tokenInfo, setTokenInfo] = useState({
    name: '',
    symbol: '',
  });

  useEffect(() => {
    setLoading(true);

    reqNFTDetail({
      query: { contractAddress: address, tokenId: id },
    })
      .then(data => {
        setData(data);
      })
      .catch(e => {
        setData(e.response?.result || {});
      })
      .finally(() => {
        setLoading(false);
      });

    reqToken({ address }).then(({ name, symbol }) => {
      setTokenInfo({
        name,
        symbol,
      });
    });
  }, [address, id]);

  const handleRefresh = useCallback(
    e => {
      reqRefreshMetadata({
        contractAddress: address,
        tokenId: id,
      }).then(() => {
        message.info(t(translations.nftDetail.refreshTip));
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, id],
  );

  const contractAddress = formatAddress(address);
  const creator = formatAddress(data.creator);
  const name =
    i18n.language === 'zh-CN' ? data.imageName?.zh : data.imageName?.en;
  const owner = formatAddress(data.owner);
  const { description = '', attributes = [] } = data.detail?.metadata || {};

  const {
    description: descrptionStr,
    dateTypeAttributes,
    stringTypeAttributes,
  } = useMemo(() => {
    let dateTypeAttributes: any = [],
      stringTypeAttributes: any = [];

    attributes.forEach(a => {
      if (a.display_type === 'date') {
        dateTypeAttributes.push(a);
      } else if (a.display_type === undefined) {
        stringTypeAttributes.push(a);
      }
    });

    return {
      description,
      dateTypeAttributes,
      stringTypeAttributes,
    };
  }, [description, attributes]);

  return (
    <StyledWrapper>
      <Helmet>
        <title>{t(translations.header.nftDetail)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.nftDetail.title)}</PageHeader>

      <Row gutter={[24, 24]}>
        <Col sm={24} md={8} style={{ width: '100%' }}>
          <Card style={{ padding: 0 }}>
            <NFTPreview
              contractAddress={address}
              tokenId={id}
              type="primary"
              enable3D={true}
            />
          </Card>

          {bp !== 's' && (
            <TransferModal
              id={id}
              contractAddress={address}
              contractType={data.type}
            ></TransferModal>
          )}
        </Col>
        <Col sm={24} md={16} style={{ width: '100%' }}>
          <Card style={{ padding: 0 }}>
            <Button
              className="button-refresh"
              size="small"
              onClick={handleRefresh}
            >
              {t(translations.general.refresh)}
            </Button>
            <Collapse defaultActiveKey={['details']} ghost>
              <Collapse.Panel
                header={t(translations.nftDetail.details)}
                key="details"
              >
                <Description title={t(translations.nftDetail.id)}>
                  <SkeletonContainer shown={loading}>
                    {id ? id : '--'}
                  </SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.name)}>
                  <SkeletonContainer shown={loading}>
                    {name ? name : '--'}
                  </SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.url)}>
                  <SkeletonContainer shown={loading}>
                    {data.imageUri ? (
                      <div className="image-uri-container">
                        <Tooltip title={data.imageUri}>
                          <Link href={data.imageUri} className="image-uri">
                            {data.imageUri}
                          </Link>
                        </Tooltip>
                        <CopyButton copyText={data.imageUri} />
                      </div>
                    ) : (
                      '--'
                    )}
                  </SkeletonContainer>
                </Description>
                {data.type?.includes('721') && (
                  <Description title={t(translations.nftDetail.owner)}>
                    <SkeletonContainer shown={loading}>
                      {owner ? (
                        <>
                          <AddressContainer
                            value={owner}
                            isFull={true}
                          ></AddressContainer>{' '}
                          <CopyButton copyText={owner} />
                        </>
                      ) : (
                        '--'
                      )}
                    </SkeletonContainer>
                  </Description>
                )}
                <Description title={t(translations.nftDetail.type)}>
                  <SkeletonContainer shown={loading}>
                    {data.type ? data.type : '--'}
                  </SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.address)}>
                  <SkeletonContainer shown={loading}>
                    {contractAddress ? (
                      <>
                        <AddressContainer
                          value={contractAddress}
                          isFull={true}
                        ></AddressContainer>{' '}
                        <CopyButton copyText={contractAddress} />
                      </>
                    ) : (
                      '--'
                    )}
                  </SkeletonContainer>
                </Description>
                <Description
                  title={
                    <InfoIconWithTooltip
                      info={t(translations.nftDetail.contractInfoTip)}
                    >
                      {t(translations.nftDetail.contractInfo)}
                    </InfoIconWithTooltip>
                  }
                >
                  <SkeletonContainer shown={loading}>
                    {`${tokenInfo.name ? tokenInfo.name : '--'} (${
                      tokenInfo.symbol ? tokenInfo.symbol : '--'
                    })`}
                  </SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.creator)}>
                  <SkeletonContainer shown={loading}>
                    {creator ? (
                      <>
                        <AddressContainer
                          value={creator}
                          isFull={true}
                        ></AddressContainer>{' '}
                        <CopyButton copyText={creator} />
                      </>
                    ) : (
                      '--'
                    )}
                  </SkeletonContainer>
                </Description>
                <Description
                  title={t(translations.nftDetail.mintedTime)}
                  noBorder
                >
                  <SkeletonContainer shown={loading}>
                    {data.mintTime
                      ? formatTimeStamp(data.mintTime, 'timezone')
                      : '--'}
                  </SkeletonContainer>
                </Description>
              </Collapse.Panel>
              {!!stringTypeAttributes.length && (
                <Collapse.Panel
                  header={t(translations.nftDetail.trait, {
                    amount: stringTypeAttributes.length,
                  })}
                  key="trait"
                >
                  <TraitPanel data={stringTypeAttributes} />
                </Collapse.Panel>
              )}
              {!!dateTypeAttributes.length && (
                <Collapse.Panel
                  header={t(translations.nftDetail.datetime)}
                  key="date"
                >
                  <DatePanel data={dateTypeAttributes} />
                </Collapse.Panel>
              )}
              {!!descrptionStr && (
                <Collapse.Panel
                  header={t(translations.nftDetail.description)}
                  key="description"
                >
                  <DescriptionPanel data={descrptionStr} />
                </Collapse.Panel>
              )}
              {data.detail?.metadata && (
                <Collapse.Panel
                  header={t(translations.nftDetail.metadata)}
                  key="metadata"
                >
                  <AceEditor
                    style={AceEditorStyle}
                    mode="json"
                    theme="tomorrow"
                    name="inputdata_json"
                    setOptions={{
                      showLineNumbers: true,
                    }}
                    fontSize="1rem"
                    showGutter={false}
                    showPrintMargin={false}
                    value={JSON.stringify(data.detail?.metadata, null, 4)}
                    readOnly={true}
                    height="20.1429rem"
                    wrapEnabled={true}
                  />
                </Collapse.Panel>
              )}
            </Collapse>
          </Card>
        </Col>
      </Row>

      <StyledBottomWrapper>
        <TransferAndHolders
          type={data.type}
          address={address}
          id={id}
          loading={loading}
          key={data.type}
        ></TransferAndHolders>
      </StyledBottomWrapper>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  div.ant-collapse-header {
    display: flex;
    align-items: center;
  }

  .button-transfer {
    margin-top: 16px;
  }

  .image-uri-container {
    display: flex;
    align-items: center;
  }

  .link.image-uri {
    max-width: 350px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
  }

  .button-refresh {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 2;
  }
`;

const StyledBottomWrapper = styled.div`
  margin-top: 1.7143rem;
`;
