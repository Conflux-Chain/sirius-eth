import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Card } from 'app/components/Card/Loadable';
import { Link } from 'app/components/Link/Loadable';
import { NFTPreview } from 'app/components/NFTPreview';
import styled from 'styled-components';
import { Row, Col, Collapse, Tooltip } from '@cfxjs/antd';
import { Description } from 'app/components/Description/Loadable';
import { CopyButton } from 'app/components/CopyButton/Loadable';
import { reqNFTDetail } from 'utils/httpRequest';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { useBreakpoint } from 'styles/media';

import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';

import { formatTimeStamp, formatAddress } from 'utils';

import { TransferList } from './TransferList';
import { TransferModal } from './TransferModal';

import lodash from 'lodash';
// @ts-ignore
window.lodash = lodash;

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

export function NFTDetail(props) {
  const bp = useBreakpoint();
  const { t, i18n } = useTranslation();
  const { id, address } = useParams<{
    id: string;
    address: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    setLoading(true);

    reqNFTDetail({
      query: { contractAddress: address, tokenId: id },
    })
      .then(data => {
        setData(data);
      })
      .catch(e => {
        setData(e.response?.data || {});
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address, id]);

  const owner = formatAddress(data.owner);
  const contractAddress = formatAddress(address);
  const creator = formatAddress(data.creator);
  const name =
    i18n.language === 'zh-CN' ? data.imageName?.zh : data.imageName?.en;
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
              contractAddress={contractAddress}
              tokenId={id}
              type="primary"
            />
          </Card>

          {bp !== 's' && (
            <TransferModal
              owner={owner}
              id={id}
              contractAddress={address}
              contractType={data.type}
            ></TransferModal>
          )}
        </Col>
        <Col sm={24} md={16} style={{ width: '100%' }}>
          <Card style={{ padding: 0 }}>
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
                <Description title={t(translations.nftDetail.owner)}>
                  <SkeletonContainer shown={loading}>
                    {owner ? (
                      <>
                        <Link href={`/address/${owner}`}>{owner}</Link>{' '}
                        <CopyButton copyText={owner} />
                      </>
                    ) : (
                      '--'
                    )}
                  </SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.type)}>
                  <SkeletonContainer shown={loading}>
                    {data.type ? data.type : '--'}
                  </SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.address)}>
                  <SkeletonContainer shown={loading}>
                    {contractAddress ? (
                      <>
                        <Link href={`/address/${contractAddress}`}>
                          {contractAddress}
                        </Link>{' '}
                        <CopyButton copyText={contractAddress} />
                      </>
                    ) : (
                      '--'
                    )}
                  </SkeletonContainer>
                </Description>
                <Description title={t(translations.nftDetail.creator)}>
                  <SkeletonContainer shown={loading}>
                    {creator ? (
                      <>
                        <Link href={`/address/${creator}`}>{creator}</Link>{' '}
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
              {data.detail?.metadata?.description && (
                <Collapse.Panel
                  header={t(translations.nftDetail.description)}
                  key="description"
                >
                  {data.detail?.metadata?.description}
                </Collapse.Panel>
              )}
            </Collapse>
          </Card>
        </Col>
      </Row>

      <StyledBottomWrapper>
        <TransferList
          type={data.type}
          address={address}
          id={id}
          loading={loading}
        ></TransferList>
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
`;

const StyledBottomWrapper = styled.div`
  margin-top: 1.7143rem;
`;
