import ENV_CONFIG from 'env';
import { CFX } from 'utils/constants';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { publishRequestError } from '@cfxjs/sirius-next-common/dist/utils/pubsub';

// @ts-ignore
window.SDK = SDK;
// @ts-ignore
window.CFX = CFX;

const request = async (method, ...args) => {
  try {
    const [namespace, m] = method.split('_');
    return await CFX[namespace][m](...args);
  } catch (e) {
    e.method = method;
    publishRequestError(e, 'rpc');
    throw e;
  }
};

type ConfirmationRiskByHashType = string | null;
export const getConfirmationRiskByHash = async (
  hash: string,
): Promise<ConfirmationRiskByHashType> => {
  return request('cfx_getConfirmationRiskByHash', hash)
    .then(data => data)
    .catch(e => {
      return null;
    });
};

export const getClientVersion = async () => {
  try {
    return request('cfx_clientVersion');
  } catch (e) {
    throw e;
  }
};

export const sendRawTransaction = async (...args) => {
  try {
    return request('cfx_sendRawTransaction', ...args);
  } catch (e) {
    throw e;
  }
};

export default request;

const evmRequest = async (method: string, ...args: any[]) => {
  try {
    if (!ENV_CONFIG.ENV_EVM_RPC_SERVER) {
      throw new Error('evm rpc server is not set');
    }
    const response = await window.fetch(ENV_CONFIG.ENV_EVM_RPC_SERVER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params: args,
        id: `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`,
      }),
    });
    const data = await response.json();
    return data.result;
  } catch (e) {
    e.method = method;
    publishRequestError(e, 'rpc');
    throw e;
  }
};

export const getTransactionByHash = async (...args) => {
  try {
    return evmRequest('eth_getTransactionByHash', ...args);
  } catch (e) {
    throw e;
  }
};
