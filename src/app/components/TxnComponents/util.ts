import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';

/**
 *
 * @param data
 * @param type
 * @returns
 * @todo
 * 1. handle JSON.stringify issue
 */
export const formatData = (data, type, option?) => {
  if (!data) return '';
  const _option = option || {
    space: 4,
  };

  try {
    // handle string type specially, translate to hex format
    // if (type === 'string') {
    //   const bytes = SDK.format.bytes(data); // SDK.format.bytes should update, not accept string
    //   const hex = SDK.format.hex(bytes);
    //   return hex;
    // }
    // bytes is formatted to hex
    if (type.startsWith('bytes')) {
      if (Array.isArray(data)) {
        return JSON.stringify(
          data.map(d => formatData(d, 'bytes')),
          null,
          4,
        );
      } else {
        return SDK.format.hex(data);
      }
    }
    // bigint value, should convert first, because Object.prototype.toString.call(data) = '[object Array]'
    if (data.sign !== undefined) {
      return data.toString();
    }
    // bytes[], uint[], int[], tuple
    // @todo use JSON.stringify to decode data, will cause inner value to be wrapped with quotation mark, like "string" type
    if (Object.prototype.toString.call(data) === '[object Array]') {
      return JSON.stringify(data, null, _option.space);
    }
    // others: address, uint, int,
    return data.toString();
  } catch (e) {
    console.log('format data error: ', e);
    return data.toString();
  }
};

export interface DecodedParams {
  argName: string;
  type: string;
  indexed: number;
  originalValue?: any; // original value
  value?: any;
  hexValue?: string; // @todo, hex formatted value
  hexAddress?: any; // hex formatted address
  cfxAddress?: string; // base32 formatted address
}

// @todo, use this for eventlogs
export const disassembleEvent = (decodedLog, log) => {
  try {
    var r = /(.*?)(?=\()(\((.*)\))$/;
    const result = r.exec(decodedLog.fullName);

    if (result !== null) {
      let args: string | Array<DecodedParams> = result[3];
      let indexCount = 1;

      args = args
        .split(', ')
        .filter(a => a !== '')
        .map(i => {
          let item = i.trim().split(' ');
          const type = item[0];

          let r = {
            argName: '',
            type: type,
            indexed: 0, // 0 is mean not indexed
            value: null,
            originalValue: '',
            hexValue: '',
            hexAddress: '',
            cfxAddress: '',
          };

          let valueIndex = 1;

          // for eventlog topic decode
          if (item.length === 3) {
            r.indexed = indexCount;
            r.hexValue = log.topics ? log.topics[indexCount] : '';

            valueIndex = 2;
            indexCount += 1;
          }

          const argName = item[valueIndex];
          const value = formatData(decodedLog.object[argName], r.type);

          r.argName = argName;
          r.originalValue = decodedLog.object[argName];
          r.value = value;

          // try to get hex address and base32 address
          if (r.type === 'address') {
            try {
              r.hexAddress = SDK.format.hexAddress(value); // try to format cfx address to hex address
            } catch (e) {
              console.log('disassembleEvent error: ', e);
            }
          }

          return r;
        })
        .filter(b => b.originalValue !== undefined);
      return args;
    } else {
      return [];
    }
  } catch (e) {
    return [];
  }
};
