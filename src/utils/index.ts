import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CFX, getCurrencySymbol } from 'utils/constants';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { Nametag } from 'utils/hooks/useNametag';

import {
  getEllipsStr,
  toThousands,
  formatNumber,
  roundToFixedPrecision,
  getPercent,
  formatTimeStamp,
  fromGdripToDrip,
  fromCfxToDrip,
  formatBalance,
  isHash,
  isBlockHash,
  isTxHash,
  validURL,
  byteToKb,
  isObject,
  checkInt,
  checkUint,
  isHex,
  checkBytes,
  checkCfxType,
  sleep,
  getTimeByBlockInterval,
  isSafeNumberOrNumericStringInput,
  isZeroOrPositiveInteger,
  parseString,
  getInitialDate,
  addIPFSGateway,
  convertBigNumbersToStrings,
  convertObjBigNumbersToStrings,
  constprocessResultArray,
  formatLargeNumber,
} from '@cfxjs/sirius-next-common/dist/utils';

import {
  isZeroAddress,
  getEvmAddressType,
  isEvmContractAddress,
  isEvmAddress as isAddress,
  formatAddress as _formatAddress,
  formatAddressHexToBase32,
  isAddressEqual,
} from '@cfxjs/sirius-next-common/dist/utils/address';

export {
  getEllipsStr,
  formatNumber,
  toThousands,
  roundToFixedPrecision,
  getPercent,
  formatTimeStamp,
  fromGdripToDrip,
  fromCfxToDrip,
  formatBalance,
  isHash,
  isBlockHash,
  isTxHash,
  validURL,
  byteToKb,
  isObject,
  checkInt,
  checkUint,
  isHex,
  checkBytes,
  checkCfxType,
  sleep,
  getTimeByBlockInterval,
  isSafeNumberOrNumericStringInput,
  isZeroOrPositiveInteger,
  parseString,
  getInitialDate,
  addIPFSGateway,
  convertBigNumbersToStrings,
  convertObjBigNumbersToStrings,
  constprocessResultArray,
  formatLargeNumber,
  formatAddressHexToBase32,
};

export { isZeroAddress, getEvmAddressType, isEvmContractAddress, isAddress };
// @ts-ignore
window.SDK = SDK;
// @ts-ignore
window.CFX = CFX;
// @ts-ignore

dayjs.extend(relativeTime);

export const formatAddress = (
  address: string,
  outputType: 'hex' | 'base32' = 'hex',
) => {
  return _formatAddress(address, outputType);
};

// Todo: Distinguish between core and evm
export async function isAccountAddress(address: string): Promise<boolean> {
  try {
    return (await getEvmAddressType(address)) === 'user';
  } catch (e) {
    throw e;
  }
}

/**
 * 格式化字符串
 * @param {string} str
 * @param {string} type 可能取值为：tag - contract name tag, hash, address; 如果 type 为数字，则截取对应数字 + ...，默认值为 12
 */
export const formatString = (
  str: string,
  type?: 'tag' | 'hash' | 'address' | 'tokenTracker' | 'posAddress' | number,
) => {
  let result: string;
  switch (type) {
    case 'tag':
      result = getEllipsStr(str, 14, 0);
      break;
    case 'hash':
      result = getEllipsStr(str, 10, 0);
      break;
    case 'address':
      result = getEllipsStr(str, 6, 4);
      break;
    case 'tokenTracker':
      result = getEllipsStr(str, 24, 0);
      break;
    case 'posAddress':
      result = getEllipsStr(str, 10, 0);
      break;
    default:
      let num = 12;
      if (typeof type === 'number') num = type;
      if (str.length > num) {
        result = getEllipsStr(str, num, 0);
      } else {
        result = str;
      }
  }
  return result;
};

/**
 * 获取给定时间戳 from 到给定时间 to 的 duration
 * @param {string | number} from syncTimestamp
 * @param {string | number} to current serverTimestamp or current browserTimestamp
 */
export const getDuration = (pFrom: number, pTo?: number) => {
  try {
    const to = pTo || +new Date();
    const from = pFrom * 1000;

    if (from > to) {
      throw new Error('invalid timestamp pair');
    }

    const dayjsTo = dayjs(to);

    const fullDay = dayjsTo.diff(from, 'day');
    const fullHour = dayjsTo.diff(from, 'hour');
    const fullMinute = dayjsTo.diff(from, 'minute');

    const day = dayjsTo.diff(from, 'day');
    const hour = dayjsTo.subtract(fullDay, 'day').diff(from, 'hour');
    const minute = dayjsTo.subtract(fullHour, 'hour').diff(from, 'minute');
    const second = dayjsTo.subtract(fullMinute, 'minute').diff(from, 'second');

    return [day, hour, minute, second];
  } catch (e) {
    return [0, 0, 0, 0];
  }
};

// Is input match epoch number format
// 0x??? need to convert to decimal int
export function isBlockNumber(str: string) {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}

export function padLeft(n: string, totalLength?: number): string;
export function padLeft(n: number, totalLength?: number): string;
export function padLeft(n, totalLength = 1) {
  const num = parseInt(n);
  if (window.isNaN(num)) {
    return String(n);
  } else {
    let result = String(num);
    while (result.length < totalLength) {
      result = '0' + result;
    }
    return result;
  }
}

export function checkIfContractByInfo(address: string, info: any, type?) {
  try {
    const fromInfo = info.fromContractInfo || info.fromTokenInfo || {};
    const toInfo = info.toContractInfo || info.toTokenInfo || {};
    const commonInfo =
      info.contractInfo || info.tokenInfo || info.transferTokenInfo || {};

    if (isAddressEqual(address, fromInfo.address)) {
      return true;
    }

    if (isAddressEqual(address, toInfo.address)) {
      return true;
    }

    if (isAddressEqual(address, commonInfo.address)) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}

export const formatContractAndTokenInfoMap = m => {
  try {
    return Object.entries(m)
      .map(a => ({
        [formatAddress(a[0])]: a[1],
        [a[0]]: a[1],
      }))
      .reduce((prev, curr) => Object.assign(prev, curr), {});
  } catch (error) {
    return {};
  }
};

export const getDomainTLD = () =>
  (window.location.host.match(/scan\.(.*)$/) || [])[1] || 'net';

const cSymbol = getCurrencySymbol();

export const formatPrice = (
  price: string | number,
  symbol: string = cSymbol,
): string[] => {
  const p = new BigNumber(price);
  let precision = 2;

  if (p.eq(0)) {
    return ['0', ''];
  } else if (p.lt(0.0001)) {
    return [
      '<0.0001',
      formatNumber(price || 0, {
        withUnit: false,
        precision: 18,
        keepZero: false,
      }),
    ];
  } else if (p.lt(1)) {
    precision = 4;
  } else if (p.lt(10)) {
    precision = 3;
  } else {
    precision = 2;
  }

  return [
    symbol +
      formatNumber(price || 0, {
        withUnit: false,
        keepZero: false,
        precision,
      }),
    '',
  ];
};

export const getNametagInfo = (row: {
  from?: string;
  fromNameTagInfo?: Nametag;
  to?: string;
  toNameTagInfo?: Nametag;
  address?: string;
  nameTagInfo?: Nametag;
  miner?: string;
  minerNameTagInfo?: Nametag;
  base32address?: string;
}): {
  [k: string]: { address: string; nametag: string };
} => {
  let result = {};

  try {
    if (row.from) {
      const addr = formatAddress(row.from);
      result[addr] = {
        address: addr,
        nametag: row.fromNameTagInfo?.nameTag,
      };
    }

    if (row.to) {
      const addr = formatAddress(row.to);
      result[addr] = {
        address: addr,
        nametag: row.toNameTagInfo?.nameTag,
      };
    }

    if (row.address) {
      const addr = formatAddress(row.address);
      result[addr] = {
        address: addr,
        nametag: row.nameTagInfo?.nameTag,
      };
    }

    if (row.base32address) {
      const addr = formatAddress(row.base32address);
      result[addr] = {
        address: addr,
        nametag: row.nameTagInfo?.nameTag,
      };
    }

    if (row.miner) {
      const addr = formatAddress(row.miner);
      result[addr] = {
        address: addr,
        nametag: row.minerNameTagInfo?.nameTag,
      };
    }
  } catch (e) {}

  return result;
};

export const getEvmGasTargetUsedPercent = (_gasUsed: string | number) => {
  const gasUsed = new BigNumber(_gasUsed);
  const value = Number(
    gasUsed.dividedBy(15000000).multipliedBy(100).toFixed(0),
  );
  return {
    value,
    percent: getPercent(_gasUsed, 15000000, 0),
  };
};
