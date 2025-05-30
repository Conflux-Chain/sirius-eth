import ENV_LOCALES_EN from '@cfxjs/sirius-next-i18n/evm/espace/en/translation.json';
import ENV_LOCALES_CN from '@cfxjs/sirius-next-i18n/evm/espace/zh_cn/translation.json';

export enum NETWORK_TYPES {
  EVM = 'EVM',
  BTC = 'BTC',
}

export enum CHAIN_TYPES {
  MAINNET = 'MAINNET',
  TESTNET = 'TESTNET',
  DEVNET = 'DEVNET',
}

export interface WalletConfig {
  chainId: number;
  chainName: string;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface ENVConfig {
  ENV_LOGO?: string;
  ENV_NETWORK_ID: number;
  ENV_NETWORK_TYPE: NETWORK_TYPES;
  ENV_CHAIN_TYPE: CHAIN_TYPES;
  ENV_OPEN_API_HOST: string;
  ENV_CORE_API_HOST?: string;
  ENV_CORE_SCAN_HOST?: string;
  ENV_RPC_SERVER: string;
  ENV_WALLET_CONFIG?: WalletConfig;
  ENV_LOCALES_EN?: typeof ENV_LOCALES_EN;
  ENV_LOCALES_CN?: typeof ENV_LOCALES_CN;
}
