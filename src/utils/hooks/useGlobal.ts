import React, { useContext } from 'react';
import { getCurrency, NETWORK_OPTIONS } from 'utils/constants';
import { createGlobalState } from 'react-use';
import ENV_CONFIG from 'env';

const defatultGlobalData = {
  currency: getCurrency(),
};

export const GlobalContext = React.createContext<{
  data: {
    currency: string;
  };
  setGlobalData: (data) => void;
}>({
  data: defatultGlobalData,
  setGlobalData: data => {},
});

export const GlobalProvider = function ({ children, data: outerData }) {
  const [data, setGlobalData] = React.useState<any>({
    ...defatultGlobalData,
    ...outerData,
  });

  return React.createElement(
    GlobalContext.Provider,
    {
      value: {
        data,
        setGlobalData,
      },
      key: Math.random(),
    },
    children,
  );
};
GlobalProvider.defaultProps = {
  data: defatultGlobalData,
};

export const useGlobal = () => {
  return useContext(GlobalContext);
};

// react-use version, to solve useContext can not update global value in App.ts
export interface ContractsType {
  [index: string]: string;
  announcement: string;
  faucet: string;
  faucetLast: string;
  wcfx: string;
  governance: string;
}

export interface NetworksType {
  url: string;
  name: string;
  id: number;
}

export interface GlobalDataType {
  networks: {
    mainnet: NetworksType[];
    testnet: NetworksType[];
    devnet: NetworksType[];
  };
  networkId: number;
  contracts: ContractsType;
}

// @todo, if no default global data, homepage should loading until getProjectConfig return resp
export const useGlobalData = createGlobalState<object>({
  networks: NETWORK_OPTIONS,
  networkId: ENV_CONFIG.ENV_NETWORK_ID,
  contracts: {},
});

export interface GasPriceBundle {
  gasPriceInfo: {
    min: number;
    tp50: number;
    max: number;
  };
  gasPriceMarket: {
    min: number;
    tp25: number;
    tp50: number;
    tp75: number;
    max: number;
  };
  maxEpoch: number;
  minEpoch: number;
  maxTime: string;
  minTime: string;
  blockHeight: number;
}
export const defaultGasPriceBundle: GasPriceBundle = {
  gasPriceInfo: {
    min: 0,
    tp50: 0,
    max: 0,
  },
  gasPriceMarket: {
    min: 0,
    tp25: 0,
    tp50: 0,
    tp75: 0,
    max: 0,
  },
  maxEpoch: 0,
  minEpoch: 0,
  maxTime: '0',
  minTime: '0',
  blockHeight: 0,
};
export const useGasPrice = createGlobalState<GasPriceBundle>(
  defaultGasPriceBundle,
);
