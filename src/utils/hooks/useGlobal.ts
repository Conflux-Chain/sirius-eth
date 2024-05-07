import React, { useContext } from 'react';
import { getCurrency, NETWORK_OPTIONS } from 'utils/constants';
import { createGlobalState } from 'react-use';
import ENV_CONFIG from 'env';
import { useGlobalData as useGlobalDataNext } from 'sirius-next/packages/common/dist/store/index';
import {
  GlobalDataType,
  NetworksTypeEnv,
} from 'sirius-next/packages/common/dist/store/types';

export interface ExtendedGlobalDataType
  extends Omit<GlobalDataType, 'networks'> {
  networks: NetworksTypeEnv;
}

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

const defaultGlobalData: ExtendedGlobalDataType = {
  networks: NETWORK_OPTIONS,
  networkId: ENV_CONFIG.ENV_NETWORK_ID,
  contracts: {},
};
const _useGlobalData = createGlobalState(defaultGlobalData);
export const useGlobalData = () => {
  const [globalData, setGlobalDataOriginal] = _useGlobalData();
  const { setGlobalData: setGlobalDataNext } = useGlobalDataNext();
  const setGlobalData = newData => {
    setGlobalDataOriginal(newData);
    setGlobalDataNext(newData);
  };
  return [globalData || defaultGlobalData, setGlobalData] as const;
};

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
