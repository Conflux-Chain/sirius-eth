import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import fetch from './request';
import { getAccount } from './rpcRequest';
import { Buffer } from 'buffer';
import { GlobalDataType, NetworksType } from './hooks/useGlobal';
import {
  NETWORK_ID,
  CFX,
  getCurrencySymbol,
  CORE_SPACE_CHAIN_IDS,
  ESPACE_CHAIN_IDS,
  BSPACE_CHAIN_IDS,
} from 'utils/constants';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import pubsub from './pubsub';
import lodash from 'lodash';
import { Nametag } from 'utils/hooks/useNametag';
import ENV_CONFIG from 'env';
import IconCore from 'images/core-space/icon.svg';
import IconEvm from 'images/espace/icon.svg';
import IconBtc from 'images/bspace/icon.svg';

import {
  getEllipsStr,
  toThousands,
  formatNumber,
} from 'sirius-next/packages/common/dist/utils';

export { formatNumber, toThousands };
// @ts-ignore
window.SDK = SDK;
// @ts-ignore
window.CFX = CFX;
// @ts-ignore

dayjs.extend(relativeTime);

export const isBase32Address = (address: string): boolean => {
  try {
    return SDK.address.isValidCfxAddress(address);
  } catch (e) {
    return false;
  }
};

export const formatAddress = (
  address: string,
  outputType = 'hex', // base32 or hex
): string => {
  // TODO, eth space, remove base32 address condition
  // return input address as default value if it can not convert to conflux chain base32/hex format
  // if necessary, check for errors at the call site
  const invalidAddressReturnValue = address;

  try {
    if (isAddress(address)) {
      if (outputType === 'hex') {
        if (isBase32Address(address)) {
          return SDK.format.hexAddress(address);
        } else {
          return address;
        }
      } else if (outputType === 'base32') {
        return SDK.format.address(address, NETWORK_ID);
      } else {
        return invalidAddressReturnValue;
      }
    } else if (isBase32Address(address)) {
      if (outputType === 'hex') {
        return SDK.format.hexAddress(address);
      } else if (outputType === 'base32') {
        const reg = /(.*):(.*):(.*)/;
        let lowercaseAddress = address;

        // compatibility with verbose address, will replace with simply address later
        if (typeof address === 'string' && reg.test(address)) {
          lowercaseAddress = address.replace(reg, '$1:$3').toLowerCase();
        }
        return lowercaseAddress;
      } else {
        return invalidAddressReturnValue;
      }
    } else {
      return invalidAddressReturnValue;
    }
  } catch (e) {
    return invalidAddressReturnValue;
  }
};

// support hex and base32
export const isAddress = (address: string): boolean => {
  try {
    if (address.startsWith('0x')) {
      // return isCfxHexAddress(address);
      return SDK.address.isValidHexAddress(address) || isZeroAddress(address);
    } else {
      // TODO, eth space, remove base32 address condition
      return isBase32Address(address);
    }
  } catch (e) {
    return false;
  }
};

export function isZeroAddress(address: string): boolean {
  try {
    return address === SDK.CONST.ZERO_ADDRESS_HEX || address === '0x0';
  } catch (e) {
    return false;
  }
}

export function isContractCodeHashEmpty(codeHash) {
  return (
    codeHash ===
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' ||
    codeHash === '0x' ||
    codeHash === ''
  );
}

export async function getAddressType(address: string): Promise<string> {
  try {
    const account = await getAccount(address);
    if (isContractCodeHashEmpty(account.codeHash)) {
      return 'account';
    }
    return 'contract';
  } catch (e) {
    console.log('getAddressType error: ', e);
    throw e;
  }
}

export async function isAccountAddress(address: string): Promise<boolean> {
  try {
    return (await getAddressType(address)) === 'account';
  } catch (e) {
    throw e;
  }
}

export async function isContractAddress(address: string): Promise<boolean> {
  try {
    return (await getAddressType(address)) === 'contract';
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

/**
 *
 * @param num original number
 * @param isShowFull Whether to show all numbers
 */
export const fromDripToCfx = (
  num: number | string,
  isShowFull: boolean = false,
  _opt = {},
) => {
  const opt = {
    minNum: 0.001,
    ..._opt,
  };
  const bn = new BigNumber(num);
  let result: string = '0';
  if (!window.isNaN(bn.toNumber()) && bn.toNumber() !== 0) {
    const divideBn = bn.dividedBy(10 ** 18);
    if (isShowFull) {
      result = toThousands(divideBn.toFixed());
    } else {
      result = divideBn.lt(opt.minNum)
        ? '< ' + new BigNumber(opt.minNum).toString()
        : formatNumber(divideBn.toFixed(), opt);
    }
  }
  return result;
};

/**
 *
 * @param num original number
 * @param isShowFull Whether to show all numbers
 */
export const fromDripToGdrip = (
  num: number | string,
  isShowFull: boolean = false,
  _opt = {},
) => {
  const opt = {
    minNum: 0.001,
    ..._opt,
  };
  const bn = new BigNumber(num);
  let result: string = '0';
  if (!window.isNaN(bn.toNumber()) && bn.toNumber() !== 0) {
    const divideBn = bn.dividedBy(10 ** 9);
    if (isShowFull) {
      result = toThousands(divideBn.toFixed());
    } else {
      result = divideBn.lt(opt.minNum)
        ? '< ' + new BigNumber(opt.minNum).toString()
        : formatNumber(divideBn.toFixed(), opt);
    }
  }
  return `${result}`;
};

export const fromGdripToDrip = (num: number | string) =>
  new BigNumber(num).multipliedBy(10 ** 9);

export const fromCfxToDrip = (num: number | string) =>
  new BigNumber(num).multipliedBy(10 ** 18);

export const getPercent = (
  divisor: number | string,
  dividend: number | string,
  precision?: number,
) => {
  if (Number(dividend) === 0) return 0 + '%';
  const bnDivisor = new BigNumber(divisor);
  const bnDividend = new BigNumber(dividend);
  const percentageNum = formatNumber(
    bnDivisor.dividedBy(bnDividend).multipliedBy(100).toNumber(),
  );
  if (precision || precision === 0) {
    const percentageNumPrecision = roundToFixedPrecision(
      percentageNum,
      precision,
    );
    if (percentageNumPrecision === '100.00') {
      return '100%';
    } else if (percentageNumPrecision === '0.00') {
      return '0%';
    }
    return roundToFixedPrecision(percentageNum, precision) + '%';
  }

  return `${percentageNum}%`;
};

export const roundToFixedPrecision = (
  number: number | string,
  precision: number,
  method: string = 'ROUND',
) => {
  if (typeof number === 'string' && number.includes('<')) {
    return number;
  }

  const regex = /^([+-]?[0-9]*\.?[0-9]+)(\D*)$/;
  let matches = String(number).match(regex);
  if (!matches) {
    matches = [String(number), ''];
  }
  const suffix = matches[2];

  const numberFormat = parseFloat(matches[1]);
  const factor = Math.pow(10, precision);
  let resultNum: number;

  switch (method) {
    case 'FLOOR':
      resultNum = Math.floor(numberFormat * factor) / factor;
      break;
    case 'CEIL':
      resultNum = Math.ceil(numberFormat * factor) / factor;
      break;
    case 'ROUND':
    default:
      resultNum = Math.round((numberFormat + Number.EPSILON) * factor) / factor;
  }
  return resultNum.toFixed(precision) + suffix;
};

export const roundToPrecision = (
  num: string | number,
  precision: number,
): string => {
  console.log(num);
  const number = typeof num === 'string' ? parseFloat(num) : num;
  console.log(number);
  if (isNaN(number)) {
    throw new Error('Provided value is not a valid number');
  }
  // 执行四舍五入操作
  const factor = Math.pow(10, precision);
  return (Math.round((number + Number.EPSILON) * factor) / factor).toFixed(
    precision,
  );
};

export const formatTimeStamp = (
  time: number,
  type?: 'standard' | 'timezone',
) => {
  let result: string;
  try {
    switch (type) {
      case 'standard':
        result = dayjs(time).format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'timezone':
        result = dayjs(time).format('YYYY-MM-DD HH:mm:ss Z');
        break;
      default:
        result = dayjs(time).format('YYYY-MM-DD HH:mm:ss');
    }
  } catch (error) {
    result = '';
  }
  return result;
};

export const formatBalance = (
  balance,
  decimals = 18,
  isShowFull = false,
  opt = {},
  ltValue?,
) => {
  try {
    const num = new BigNumber(balance).div(new BigNumber(10).pow(decimals));
    if (num.eq(0)) {
      return num.toFixed();
    }
    if (isShowFull) {
      return toThousands(num.toFixed());
    }
    if (ltValue && num.lt(ltValue)) {
      return `<${ltValue}`;
    }
    return formatNumber(num.toString(), opt);
  } catch {
    return '';
  }
};

interface BodyElement extends HTMLBodyElement {
  createTextRange?(): Range;
}

export const selectText = (element: HTMLElement) => {
  var range,
    selection,
    body = document.body as BodyElement;
  if (body.createTextRange) {
    range = body.createTextRange();
    range.moveToElementText(element);
    range.select();
  } else if (window.getSelection) {
    selection = window.getSelection();
    range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

export const isHash = (str: string) => {
  return /^0x[0-9a-fA-F]{64}$/.test(str);
};

export const isBlockHash = async (str: string) => {
  if (!isHash(str)) return false;
  let isBlock = true;
  try {
    const block = await fetch(`/v1/block/${str}`);
    // server side will return {} when no block found
    if (!block.hash || block.code !== undefined) isBlock = false;
  } catch (err) {
    isBlock = false;
  }

  return isBlock;
};

export const isTxHash = async (str: string) => {
  if (!isHash(str)) return false;
  return !isBlockHash(str);
};

// Is input match epoch number format
// 0x??? need to convert to decimal int
export function isBlockNumber(str: string) {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}

export function validURL(str: string) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
}

export function byteToKb(bytes) {
  return bytes / 1024;
}

export function isObject(o) {
  return o !== null && typeof o === 'object' && Array.isArray(o) === false;
}

export function checkInt(value, type) {
  const num = Number(type.substr(3));
  const min = new BigNumber(2).pow(num - 1).multipliedBy(-1);
  const max = new BigNumber(2).pow(num - 1).minus(1);
  let isType = false;
  if (!isNaN(value)) {
    const valNum = new BigNumber(value);
    if (
      valNum.isInteger() &&
      valNum.isGreaterThanOrEqualTo(min) &&
      valNum.isLessThanOrEqualTo(max)
    ) {
      isType = true;
    } else {
      isType = false;
    }
  } else {
    isType = false;
  }
  return [isType, num, min.toString(), max.toString()];
}

export function checkUint(value, type) {
  const num = Number(type.substr(4));
  const min = new BigNumber(0);
  const max = new BigNumber(Math.pow(2, num)).minus(1);
  let isType = false;
  if (!isNaN(value)) {
    const valNum = new BigNumber(value);
    if (
      valNum.isInteger() &&
      valNum.isGreaterThanOrEqualTo(min) &&
      valNum.isLessThanOrEqualTo(max)
    ) {
      isType = true;
    } else {
      isType = false;
    }
  } else {
    isType = false;
  }
  return [isType, num, min.toFixed(), max.toFixed()];
}

export function isHex(num, withPrefix = true) {
  const reg = withPrefix ? /^0x[0-9a-f]*$/i : /^(0x)?[0-9a-f]*$/i;
  return Boolean(num.match(reg));
}

export function isEvenLength(str) {
  const length = str.length;
  return length > 0 && length % 2 === 0;
}

export function checkBytes(value, type) {
  if (type === 'byte') {
    type = 'bytes1';
  }
  const num = Number(type.substr(5));
  let isBytes = false;
  if (!value) return [isBytes, num];
  if (isHex(value) && isEvenLength(value)) {
    if (num > 0) {
      const str = value.substr(2);
      const buffer = Buffer.from(str, 'hex');
      if (buffer.length === num) {
        isBytes = true;
      } else {
        isBytes = false;
      }
    } else {
      isBytes = true;
    }
  } else {
    isBytes = false;
  }
  return [isBytes, num];
}

export function checkCfxType(value) {
  if (isNaN(value)) {
    return false;
  }
  const valNum = new BigNumber(value);
  if (valNum.isNegative()) {
    return false;
  }
  let index = value.indexOf('.');
  if (index !== -1) {
    if (value.substr(index + 1).length > 18) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}

export const sleep = timeout =>
  new Promise(resolve => setTimeout(resolve, timeout));

// get two block interval time
export const getTimeByBlockInterval = (minuend = 0, subtrahend = 0) => {
  const seconds = new BigNumber(minuend)
    .minus(subtrahend)
    .dividedBy(2)
    .toNumber();
  const dayBase = 86400;
  const hourBase = 3600;
  const days = Math.floor(seconds / dayBase);
  const deltaSecond = seconds - days * 86400;
  const hours = Math.floor(deltaSecond / hourBase);
  return { days, hours, seconds };
};

export const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 *
 * @param {number|string} data
 * @returns {boolean}
 * @example
 * 0    -> true
 * .    -> true
 * 0.   -> true
 * .0   -> true
 * 0.0  -> true
 * 0..0 -> false
 * x    -> false
 * e    -> false
 * @todo support config, such as negative and exponential notation
 */

/**
 *
 * @param {number|string} data
 * @returns {boolean}
 * @example
 * 0    -> true
 * .    -> false
 * 11   -> true
 * 011  -> false
 * -1   -> false
 */
export const isSafeNumberOrNumericStringInput = data =>
  /^\d+\.?\d*$|^\.\d*$/.test(data);

export const isZeroOrPositiveInteger = data => /^(0|[1-9]\d*)$/.test(data);

export const parseString = v => {
  if (typeof v === 'string' && !v.startsWith('0x')) {
    return Buffer.from(v);
  }
  return v;
};

// process datepicker initial value
export const getInitialDate = (minTimestamp, maxTimestamp) => {
  const startDate = dayjs('2020-10-29T00:00:00+08:00');
  const endDate = dayjs();
  const innerMinTimestamp = minTimestamp
    ? dayjs(new Date(parseInt((minTimestamp + '000') as string)))
    : startDate;
  const innerMaxTimestamp = maxTimestamp
    ? dayjs(new Date(parseInt((maxTimestamp + '000') as string)))
    : endDate;
  const disabledDateD1 = date =>
    date &&
    (date > innerMaxTimestamp.endOf('day') ||
      date < startDate.subtract(1, 'day').endOf('day'));
  const disabledDateD2 = date =>
    date &&
    (date < innerMinTimestamp.subtract(1, 'day').endOf('day') ||
      date > endDate.endOf('day'));

  return {
    minT: innerMinTimestamp,
    maxT: innerMaxTimestamp,
    dMinT: disabledDateD1,
    dMaxT: disabledDateD2,
  };
};

export const getNetwork = (
  networks: GlobalDataType['networks'],
  id: number,
) => {
  const matched = [
    ...networks.mainnet,
    ...networks.testnet,
    ...networks.devnet,
  ].find(n => n.id === id);
  let network: NetworksType;

  if (matched) {
    network = matched;
  } else {
    network = networks.mainnet[0];
  }

  return network;
};

export const gotoNetwork = (networkUrl: string): void => {
  networkUrl && window.location.assign(networkUrl);
};

export const getNetworkIcon = (
  id = NaN,
  props?: {
    isCore?: boolean;
    isEvm?: boolean;
    isBtc?: boolean;
  },
) => {
  const isCore = CORE_SPACE_CHAIN_IDS.includes(id) || props?.isCore;
  const isEvm = ESPACE_CHAIN_IDS.includes(id) || props?.isEvm;
  const isBtc = BSPACE_CHAIN_IDS.includes(id) || props?.isBtc;
  if (isCore) {
    return IconCore;
  } else if (isEvm) {
    return IconEvm;
  } else if (isBtc) {
    return IconBtc;
  }
};

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

    if (address === fromInfo.address) {
      return true;
    }

    if (address === toInfo.address) {
      return true;
    }

    if (address === commonInfo.address) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}

interface ErrorInfoType {
  url?: string;
  code?: number;
  message?: string;
  data?: string;
  method?: string;
}

export const publishRequestError = (
  e: (Error & ErrorInfoType) | ErrorInfoType,
  type: 'rpc' | 'http' | 'wallet' | 'code',
) => {
  let detail = '';
  if (e.code && e.message) {
    if (type === 'code') {
      detail = e.message;
    } else {
      detail = `Error Code: ${e.code} \n`;
      if (type === 'http') {
        const origin = window.location.origin;
        detail += `Rest Api Url: ${
          e.url?.includes('https://') ? e.url : origin + e.url
        } \n`;
      }
      if (type === 'rpc') {
        detail += `RPC Url: ${ENV_CONFIG.ENV_RPC_SERVER} \n`;
        if (!lodash.isNil(e.method)) {
          detail += `Method: ${e.method} \n`;
        }
        if (!lodash.isNil(e.data)) {
          detail += `Data: ${e.data} \n`;
        }
      }
      detail += `Error Message: ${e.message} \n`;
    }
  }

  pubsub.publish('notify', {
    type: 'request',
    option: {
      code: type === 'rpc' ? 30001 : e.code || 20000, // code is used for title, 20000 means unknown issue
      message: e.message,
      detail: detail,
    },
  });
};

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

export const addIPFSGateway = (
  imgURL: string,
  IPFSGatewayURL: string,
): string => {
  if (
    typeof imgURL === 'string' &&
    typeof IPFSGatewayURL === 'string' &&
    imgURL.startsWith('ipfs://')
  ) {
    imgURL = `${IPFSGatewayURL}/${imgURL.replace('ipfs://', 'ipfs/')}`;
  }

  return imgURL;
};

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

export const isLikeBigNumber = obj => {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }
  return 's' in obj && 'e' in obj && 'c' in obj && Array.isArray(obj.c);
};

type NestedArray = (string | number | BigNumber | NestedArray)[];
type NestedObject = {
  [key: string]: BigNumber | string | NestedObject | NestedObject[];
};
export const convertBigNumbersToStrings = (input: NestedArray) => {
  return input.map(item => {
    if (item instanceof Uint8Array) {
      return item;
    }
    if (Array.isArray(item)) {
      return convertBigNumbersToStrings(item);
    } else if (
      item !== null &&
      typeof item === 'object' &&
      !isLikeBigNumber(item)
    ) {
      return convertObjBigNumbersToStrings(item);
    } else if (isLikeBigNumber(item)) {
      return item.toString(10);
    } else {
      return item;
    }
  });
};
export const convertObjBigNumbersToStrings = input => {
  const newObj: NestedObject = {};
  if (Array.isArray(input)) {
    return convertBigNumbersToStrings(input);
  }
  for (let key in input) {
    if (isLikeBigNumber(input[key])) {
      newObj[key] = input[key].toString(10);
    } else if (Array.isArray(input[key])) {
      newObj[key] = convertBigNumbersToStrings(input[key]);
    } else if (typeof input[key] === 'object') {
      newObj[key] = convertObjBigNumbersToStrings(input[key] as NestedObject);
    } else {
      newObj[key] = input[key];
    }
  }
  return newObj;
};

export const constprocessResultArray = resultArray => {
  if (typeof resultArray === 'string') {
    return resultArray;
  }
  const processElement = element => {
    if (Array.isArray(element)) {
      return element.map(processElement);
    } else if (element.type && element.type === 'Buffer') {
      let result = element.data
        .map(byte => ('00' + byte.toString(16)).slice(-2))
        .join('');
      if (!result.startsWith('0x')) {
        result = '0x' + result;
      }
      return result;
    } else {
      return element;
    }
  };

  const inputArray = Array.isArray(resultArray) ? resultArray : [resultArray];
  return inputArray.map(processElement);
};

export const formatLargeNumber = (number: string | number) => {
  const num = new BigNumber(number);

  if (num.isNaN()) {
    return { value: null, unit: '' };
  }

  const T = new BigNumber(10).pow(12);
  const P = new BigNumber(10).pow(15);
  const E = new BigNumber(10).pow(18);

  if (num.isGreaterThanOrEqualTo(E)) {
    const result = num.dividedBy(E);
    return {
      value: result.isNaN() ? null : result.toString(),
      unit: 'E',
    };
  } else if (num.isGreaterThanOrEqualTo(P)) {
    const result = num.dividedBy(P);
    return {
      value: result.isNaN() ? null : result.toString(),
      unit: 'P',
    };
  } else if (num.isGreaterThanOrEqualTo(T)) {
    const result = num.dividedBy(T);
    return {
      value: result.isNaN() ? null : result.toString(),
      unit: 'T',
    };
  } else {
    return {
      value: num.toString(),
      unit: '',
    };
  }
};
