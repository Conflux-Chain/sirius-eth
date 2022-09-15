/**
 *
 * NFTPreview
 *
 */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Image, Popover, Skeleton, Spin } from '@cfxjs/antd';
import tokenIdNotFound from 'images/token/tokenIdNotFound.jpg';
import styled from 'styled-components';
import { Text } from '../Text/Loadable';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import nftPreviewActive from 'images/token/nftPreviewActive2.svg';
import nftPreview from 'images/token/nftPreview2.svg';
import nftInfo from 'images/info.svg';
import { reqNFTInfo } from 'utils/httpRequest';
import { Tooltip } from '@cfxjs/antd';
import NotFoundIcon from 'images/token/tokenIdNotFound.jpg';
import fetch from 'utils/request';
import audioDesign from './audio-design.svg';
import audioBg from './audio-bg.svg';
import audioPause from './audio-pause.svg';
import audioPlay from './audio-play.svg';
import Link from '@zeit-ui/react-icons/link';
import { Link as ALink } from 'app/components/Link/Loadable';
import { formatAddress } from 'utils';
import { Tag } from '@cfxjs/antd';
import { AddressContainer } from '../AddressContainer';

const epiKProtocolKnowledgeBadge =
  'cfx:acev4c2s2ttu3jzxzsd4a2hrzsa4pfc3f6f199y5mk';

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const videoType = ['mp4', 'avi', 'mpeg', 'ogv', 'ts', 'webm', '3gp', '2gp'];
const audioType = [
  'aac',
  'mid',
  'midi',
  'mp3',
  'oga',
  'opus',
  'wav',
  'weba',
  'cda',
];
const imageType = [
  'bmp',
  'gif',
  'ico',
  'jpg',
  'jpeg',
  'png',
  'svg',
  'tif',
  'tiff',
  'webp',
];

export const NFTCardInfo = React.memo(
  ({
    imageUri,
    tokenId,
    audioImg,
    imageMinHeight,
    width = 200,
    preview = true,
  }: {
    imageUri: string;
    tokenId?: number | string;
    audioImg?: string;
    imageMinHeight?: number;
    width?: 200 | 500;
    preview?: boolean;
  }) => {
    let [nftType, setNftType] = useState('image');
    const [isAudioPlay, setIsAudioPlay] = useState(false);
    const [percent, setPercent] = useState<string>();
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
      let nftType = 'image';
      // eslint-disable-next-line no-useless-escape
      const suffix = /\.[^\.]+$/.exec(imageUri.substr(-5));

      if (suffix) {
        const sourceType = suffix[0].substr(1);
        if (videoType.includes(sourceType)) {
          nftType = 'video';
        } else if (imageType.includes(sourceType)) {
          nftType = 'image';
        } else if (audioType.includes(sourceType)) {
          nftType = 'audio';
        }
      } else {
        // has not suffix
        fetch(imageUri, {
          method: 'HEAD',
        })
          .then(res => {
            for (let pair of res.headers.entries()) {
              if (pair[0] === 'content-type') {
                nftType = pair[1].split('/')[0];
                setNftType(nftType);
              }
            }
          })
          .catch(console.log);
      }

      setNftType(nftType);
    }, [imageUri]);

    const audioControl = useCallback(() => {
      const audioDom: HTMLAudioElement | null = audioRef.current;
      if (audioDom) {
        if (audioDom.paused) {
          audioDom.play();
          setIsAudioPlay(true);
        } else {
          audioDom.pause();
          setIsAudioPlay(false);
        }

        audioDom.ontimeupdate = () => {
          const percent = audioDom.currentTime / audioDom.duration;
          setPercent(`${percent * 100}%`);
        };

        audioDom.onended = () => {
          setIsAudioPlay(false);
        };
      }
    }, [audioRef]);

    return (
      <>
        {nftType === 'video' ? (
          <VideoCard>
            <video
              controls
              className="ant-video"
              preload="metadata"
              // poster={imageUri}
              src={`${imageUri}?source=video`}
            ></video>
          </VideoCard>
        ) : nftType === 'audio' ? (
          <AudioCard percent={percent}>
            {audioImg && (
              <img src={audioImg} alt="audio-img" className="audio-img" />
            )}
            <img
              src={audioDesign}
              alt="audio-design"
              className="audio audio-design"
            />
            <img src={audioBg} alt="audio-bg" className="audio audio-bg" />
            <img
              src={isAudioPlay ? audioPause : audioPlay}
              alt="audio-play"
              className="audio audio-play"
              onClick={audioControl}
            />
            <div className="audio-control">
              <div className="audio-percent"></div>
            </div>
            <audio ref={audioRef} preload="metadata" src={imageUri}></audio>
          </AudioCard>
        ) : (
          <Image
            width={width}
            style={{ minHeight: imageMinHeight }}
            src={imageUri}
            preview={preview}
            fallback={tokenIdNotFound}
            alt={tokenId + ''}
          />
        )}
      </>
    );
  },
);

export const NFTPreview = React.memo(
  ({
    contractAddress,
    tokenId,
    type = 'preview',
    amount = 0,
    owner = '',
  }: {
    contractAddress?: string;
    tokenId?: number | string;
    type?: 'preview' | 'card' | 'primary';
    amount?: number;
    owner?: string;
  }) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language.includes('zh') ? 'zh' : 'en';
    const [imageUri, setImageUri] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageMinHeight, setImageMinHeight] = useState(200);
    const [previewIcon, setPreviewIcon] = useState(nftPreview);
    const [imageName, setImageName] = useState('');
    const [isFirstTime, setIsFirstTime] = useState(true);

    useEffect(() => {
      if (contractAddress && tokenId) {
        setLoading(true);

        reqNFTInfo({
          query: { contractAddress, tokenId },
        })
          .then(data => {
            if (data) {
              setImageMinHeight(data.imageMinHeight);
              if (data.imageUri) {
                setImageUri(data.imageUri);
              }
              setImageName(data.imageName ? data.imageName[lang] || '' : '');
            }
          })
          .catch(e => {
            console.log(e);
          })
          .finally(() => {
            setLoading(false);
            setIsFirstTime(false);
          });
      }
    }, [contractAddress, tokenId, lang]);

    if (contractAddress && tokenId) {
      if (type === 'card') {
        return (
          <NFTCard>
            <Spin spinning={loading}>
              <div className="nft-container">
                {imageUri ? (
                  contractAddress === epiKProtocolKnowledgeBadge ? (
                    <div className="ant-image">
                      <iframe title={imageName} src={imageUri} />
                    </div>
                  ) : (
                    <NFTCardInfo
                      imageUri={imageUri}
                      tokenId={tokenId}
                      width={500}
                    />
                  )
                ) : isFirstTime ? (
                  <Skeleton.Image />
                ) : (
                  <Image
                    width={500}
                    src={NotFoundIcon}
                    alt={'not found'}
                    fallback={tokenIdNotFound}
                  />
                )}
                {!!amount && (
                  <Tooltip title={t(translations.nftChecker.amount)}>
                    <Tag className="nft-amount">x{amount}</Tag>
                  </Tooltip>
                )}
              </div>
              <div className="info">
                <div className="info-name">
                  <Tooltip title={imageName}>
                    <div className="name">{imageName}</div>
                  </Tooltip>
                  {imageUri ? (
                    <Tooltip title={imageUri}>
                      <div className="name">
                        <Link size={12} />
                      </div>
                    </Tooltip>
                  ) : null}
                </div>
                <div className="id">
                  <Tooltip title={tokenId}>
                    {t(translations.nftChecker.tokenId)}: {tokenId}
                  </Tooltip>{' '}
                  <ALink
                    href={`/nft/${formatAddress(contractAddress)}/${tokenId}`}
                  >
                    {t(translations.general.table.token.view)}
                  </ALink>
                  {owner && (
                    <div className="owner">
                      <span className="title">
                        {t(translations.nftChecker.owner)}:{' '}
                      </span>
                      <AddressContainer
                        value={owner}
                        maxWidth={120}
                      ></AddressContainer>
                    </div>
                  )}
                </div>
              </div>
            </Spin>
          </NFTCard>
        );
      } else if (type === 'preview') {
        return imageUri ? (
          <PopoverWrapper
            placement="right"
            trigger="click"
            overlayClassName="image-preview-popover"
            content={
              <>
                {contractAddress === epiKProtocolKnowledgeBadge ? (
                  <iframe
                    title={imageName}
                    width={200}
                    style={{ minHeight: imageMinHeight }}
                    src={imageUri}
                  />
                ) : (
                  <NFTCardInfo
                    imageUri={imageUri}
                    tokenId={tokenId}
                    imageMinHeight={imageMinHeight}
                  />
                )}
                {imageName ? (
                  <div className="info-name">
                    <Tooltip title={imageName}>
                      <div className="name">{imageName}</div>
                    </Tooltip>
                    {imageUri ? (
                      <Tooltip title={imageUri}>
                        <div className="name">
                          <Link size={12} />
                        </div>
                      </Tooltip>
                    ) : null}
                  </div>
                ) : null}
              </>
            }
            onVisibleChange={(visible: boolean) => {
              setPreviewIcon(visible ? nftPreviewActive : nftPreview);
            }}
          >
            <Text span hoverValue={t(translations.general.preview)}>
              <img
                src={previewIcon}
                alt="Preview"
                style={{ width: 17, height: 17, marginTop: -4 }}
              />
            </Text>
          </PopoverWrapper>
        ) : imageName ? (
          <Tooltip title={imageName}>
            <img src={nftInfo} alt="?" style={{ marginLeft: 4 }} />
          </Tooltip>
        ) : null;
      } else {
        return (
          <NFTCard>
            <Spin spinning={loading}>
              {imageUri ? (
                contractAddress === epiKProtocolKnowledgeBadge ? (
                  <div className="ant-image">
                    <iframe title={imageName} src={imageUri} />
                  </div>
                ) : (
                  <NFTCardInfo
                    imageUri={imageUri}
                    tokenId={tokenId}
                    width={500}
                    preview={false}
                  />
                )
              ) : isFirstTime ? (
                <Skeleton.Image />
              ) : (
                <Image
                  width={500}
                  src={NotFoundIcon}
                  alt={'not found'}
                  fallback={tokenIdNotFound}
                />
              )}
            </Spin>
          </NFTCard>
        );
      }
    } else {
      return null;
    }
  },
);

const AudioCard = styled.div<{ percent: any }>`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
  background: #81caff;
  border-radius: 5px;

  .audio-img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .audio {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }
  .audio-bg,
  .audio-play {
    cursor: pointer;
  }
  .audio-control {
    position: absolute;
    width: 100%;
    height: 29px;
    line-height: 29px;
    left: 0px;
    bottom: 0px;

    background: rgba(0, 0, 0, 0.1);
    /* filter: blur(2px); */
    .audio-percent {
      position: absolute;
      height: 2px;
      left: 0;
      top: 0;
      width: ${props => props.percent || 0};
      background: rgba(234, 234, 234, 0.5);
    }
  }
`;

const PopoverWrapper = styled(Popover)`
  margin-left: 8px;
`;

const VideoCard = styled.div`
  width: 100%;
  height: 0;
  padding-top: 100%;
  position: relative;
  min-width: 200px;
  .ant-video {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const NFTCard = styled.div`
  background-color: #fff;
  border: 1px solid #ebeced;
  border-radius: 5px;

  .ant-image {
    position: relative;
    display: block;
    width: 100%;
    max-width: 100%;
    padding-top: 100%;

    img,
    iframe {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      object-fit: contain;
      border-radius: 5px 5px 0 0;
    }

    iframe {
      .album .btn {
        cursor: pointer;
      }
    }
  }

  .ant-skeleton {
    position: relative;
    width: 100%;
    max-width: 100%;
    padding-top: 100%;

    .ant-skeleton-image {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      object-fit: contain;
      border-radius: 5px 5px 0 0;
    }
  }

  .nft-container {
    position: relative;

    .nft-amount {
      position: absolute;
      top: 5px;
      right: 5px;
      margin: 0;
      padding: 0 5px;
    }
  }

  .info {
    padding: 8px 10px 10px;
    font-size: 12px;
    color: #002257;

    .info-name {
      display: flex;
      justify-content: space-between;
    }

    .name {
      height: 18px;
      min-width: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tooltip {
      width: 179px;

      .id {
        color: #74798c;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .owner {
      display: flex;

      .title {
        margin-right: 4px;
      }
    }
  }
`;
