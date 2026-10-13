import BigNumber from 'bignumber.js';
import type { SimulateTraceTxParams } from '@cfxjs/sirius-next-common/dist/utils/hooks/useSimulateTrace';

type GasParams = Pick<
  SimulateTraceTxParams,
  'gas' | 'gasPrice' | 'maxFeePerGas'
> & {
  maxPriorityFeePerGas?: string;
};

const getStringParam = (value: unknown) =>
  typeof value === 'string' && value ? value : undefined;

export const getTabQuery = (params: Record<string, unknown>) => {
  const query: Record<string, string> = {};
  const keys = [
    'from',
    'to',
    'data',
    'value',
    'maxFeePerGas',
    'maxPriorityFeePerGas',
  ] as const;

  keys.forEach(key => {
    const value = getStringParam(params[key]);
    if (value !== undefined) query[key] = value;
  });

  const gas = getStringParam(params.gas) || getStringParam(params.gasLimit);
  if (gas !== undefined) query.gas = gas;
  const gasPrice =
    getStringParam(params.gasPrice) || getStringParam(params.price);
  if (gasPrice !== undefined) query.gasPrice = gasPrice;

  return query;
};

const keys = [
  'gas',
  'gasPrice',
  'maxFeePerGas',
  'maxPriorityFeePerGas',
] as const;
export const parseGasParams = (params: Record<string, string>): GasParams => {
  const result: GasParams = {};

  for (const key of keys) {
    const value = params[key];
    if (value === undefined) continue;
    if (!/^(?:[0-9]+|0x[0-9a-f]+)$/i.test(value)) continue;
    result[key] = `0x${new BigNumber(value).toString(16)}`;
  }

  // EIP-1559 fees take precedence over both legacy price parameter names.
  if (result.maxFeePerGas || result.maxPriorityFeePerGas) {
    delete result.gasPrice;
  }

  return result;
};
