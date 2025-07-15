import {
  getDelegatedAddress,
  isEvmContractAddress,
} from '@cfxjs/sirius-next-common/dist/utils/address';
import create from 'zustand';
import { reqContract, reqToken } from './httpRequest';

export const useNametagCacheStore = create(set => ({
  nametagCache: {},
  contractCache: {},
  setNametagCache: e =>
    set(state => ({
      nametagCache: {
        ...state.nametagCache,
        ...e,
      },
    })),
  setContractCache: e =>
    set(state => ({
      contractCache: {
        ...state.contractCache,
        ...e,
      },
    })),
}));

interface DelegatedInfoStore {
  delegatedAddress: string | null;
  delegatedContractInfo: any;
  delegatedTokenInfo: any;
  fetchDelegatedInfo: (address: string | null) => Promise<void>;
}

export const useDelegatedInfoStore = create<DelegatedInfoStore>(set => ({
  delegatedAddress: null,
  delegatedContractInfo: null,
  delegatedTokenInfo: null,
  fetchDelegatedInfo: async (address: string | null) => {
    // reset before fetching
    set({
      delegatedAddress: null,
      delegatedContractInfo: null,
      delegatedTokenInfo: null,
    });
    try {
      if (!address) return;
      const delegatedAddress = await getDelegatedAddress(address);
      const isDelegatedToContract = await isEvmContractAddress(
        delegatedAddress,
      );
      if (isDelegatedToContract) {
        const delegatedContractInfo = await reqContract({
          address: delegatedAddress,
          fields: ['name', 'from', 'code', 'sourceCode', 'abi', 'verifyInfo'],
        });
        const delegatedTokenInfo = await reqToken({
          address: delegatedAddress,
          fields: ['name', 'iconUrl'],
        });
        set({
          delegatedAddress,
          delegatedContractInfo,
          delegatedTokenInfo,
        });
      } else {
        set({
          delegatedAddress,
        });
      }
    } catch (error) {
      console.error('fetch delegated info error: ', error);
    }
  },
}));
