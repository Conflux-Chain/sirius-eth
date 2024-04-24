import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from 'styles/media';
import { translations } from 'locales/i18n';
import { DetailPageCard } from './DetailPageCard';
import { InfoImage } from './InfoImage';
import { TokenBalanceSelect } from './TokenBalanceSelect';
import { Text } from 'app/components/Text/Loadable';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { fromDripToCfx } from 'utils';
import { Tooltip } from 'app/components/Tooltip/Loadable';
import imgBalance from 'images/contract-address/balance.svg';
import imgToken from 'images/contract-address/token.svg';
import imgStorage from 'images/contract-address/storage.svg';
import imgNonce from 'images/contract-address/nonce.svg';

// todo, need to refactor the request, and rewrite skeleton style
const skeletonStyle = { width: '7rem', height: '2.4rem' };

export function BalanceCard({ accountInfo }) {
  const { t } = useTranslation();
  // const { data: accountInfo } = useAccount(address);
  const loading = accountInfo.balance === t(translations.general.loading);

  return (
    <DetailPageCard
      title={
        <Tooltip text={t(translations.toolTip.address.balance)} placement="top">
          {t(translations.general.balance)}
        </Tooltip>
      }
      content={
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <Text hoverValue={`${fromDripToCfx(accountInfo.balance, true)} CFX`}>
            {fromDripToCfx(accountInfo.balance)}
          </Text>
        </SkeletonContainer>
      }
      icon={
        <InfoImage
          color="#1e3de4"
          alt={t(translations.general.balance)}
          icon={imgBalance}
        />
      }
    />
  );
}

export function TokensCard({ address }) {
  const { t } = useTranslation();

  return (
    <DetailPageCard
      title={
        <Tooltip text={t(translations.toolTip.address.token)} placement="top">
          {t(translations.general.token)}
        </Tooltip>
      }
      content={<TokenBalanceSelect address={address} />}
      icon={
        <InfoImage
          color="#16DBCC"
          alt={t(translations.general.token)}
          icon={imgToken}
        />
      }
    />
  );
}

export function StorageStakingCard({ accountInfo }) {
  const { t } = useTranslation();
  const bp = useBreakpoint();
  // const { data: accountInfo } = useAccount(address);
  const loading = accountInfo.balance === t(translations.general.loading);

  return (
    <DetailPageCard
      title={
        <Text
          hoverValue={t(translations.toolTip.address.storageCollateral)}
          maxCount={bp === 's' ? 10 : undefined}
        >
          {t(translations.general.storageStaking)}
        </Text>
      }
      content={
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <Text
            hoverValue={`${fromDripToCfx(
              accountInfo.collateralForStorage,
              true,
            )} CFX`}
          >
            {fromDripToCfx(accountInfo.collateralForStorage)}
          </Text>
        </SkeletonContainer>
      }
      icon={
        <InfoImage
          color="#FFBB37"
          alt={t(translations.general.storageStaking)}
          icon={imgStorage}
        />
      }
    />
  );
}

export function NonceCard({ accountInfo }) {
  const { t } = useTranslation();
  // const { data: accountInfo } = useAccount(address);
  const loading = accountInfo.balance === t(translations.general.loading);

  return (
    <DetailPageCard
      title={
        <Tooltip text={t(translations.toolTip.address.nonce)} placement="top">
          {t(translations.general.nonce)}
        </Tooltip>
      }
      content={
        <SkeletonContainer shown={loading} style={skeletonStyle}>
          <Text hoverValue={accountInfo.nonce}>{accountInfo.nonce}</Text>
        </SkeletonContainer>
      }
      icon={
        <InfoImage
          color="#FF82AC"
          alt={t(translations.general.nonce)}
          icon={imgNonce}
        />
      }
    />
  );
}
