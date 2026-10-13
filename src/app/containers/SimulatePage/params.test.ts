import qs from 'query-string';
import { getTabQuery, parseGasParams } from './params';

const parse = (search: string) => parseGasParams(getTabQuery(qs.parse(search)));

describe('simulate gas parameters', () => {
  it('keeps legacy aliases and prefers canonical parameter names', () => {
    expect(parse('price=10&gasLimit=21000')).toEqual({
      gasPrice: '0xa',
      gas: '0x5208',
    });
    expect(parse('gasPrice=20&price=10&gas=30000&gasLimit=21000')).toEqual({
      gasPrice: '0x14',
      gas: '0x7530',
    });
  });

  it('prefers EIP-1559 even when the ignored legacy price is invalid', () => {
    expect(
      parse(
        'gas=21000&gasPrice=invalid&price=invalid&maxFeePerGas=100&maxPriorityFeePerGas=2',
      ),
    ).toEqual({
      gas: '0x5208',
      maxFeePerGas: '0x64',
      maxPriorityFeePerGas: '0x2',
    });
  });

  it.each(['maxFeePerGas', 'maxPriorityFeePerGas'])(
    'ignores invalid legacy prices but retains gas validation with %s',
    key => {
      expect(parse(`gasLimit=21000&gasPrice=-1&price=NaN&${key}=0`)).toEqual({
        gas: '0x5208',
        [key]: '0x0',
      });
      expect(parse(`gas=invalid&gasPrice=invalid&${key}=1`)).toEqual({
        [key]: '0x1',
      });
      expect(parseGasParams({ gasPrice: 'invalid', [key]: '0' })).toEqual({
        [key]: '0x0',
      });
    },
  );

  it('accepts either EIP-1559 parameter independently, including zero', () => {
    expect(parse('maxFeePerGas=0&gasPrice=10')).toEqual({
      maxFeePerGas: '0x0',
    });
    expect(parse('maxPriorityFeePerGas=0&gasPrice=10')).toEqual({
      maxPriorityFeePerGas: '0x0',
    });
    expect(parse('maxPriorityFeePerGas=1000000000')).toEqual({
      maxPriorityFeePerGas: '0x3b9aca00',
    });
    expect(parse('')).toEqual({});
  });

  it('preserves precision above the JavaScript safe integer limit', () => {
    expect(
      parse('maxFeePerGas=9007199254740993&maxPriorityFeePerGas=0x01'),
    ).toEqual({
      maxFeePerGas: '0x20000000000001',
      maxPriorityFeePerGas: '0x1',
    });
  });

  it.each(['-1', '1.5', 'NaN', 'Infinity', '0x', '1e9'])(
    'treats invalid quantities as absent: %s',
    value => {
      expect(parse(`maxFeePerGas=${value}`)).toEqual({});
      expect(parse(`maxPriorityFeePerGas=${value}`)).toEqual({});
      expect(
        parse(
          `maxFeePerGas=${value}&maxPriorityFeePerGas=${value}&gasPrice=10`,
        ),
      ).toEqual({ gasPrice: '0xa' });
      expect(parse(`maxFeePerGas=${value}&price=10`)).toEqual({
        gasPrice: '0xa',
      });
    },
  );

  it('uses the remaining valid EIP-1559 field when the other is invalid', () => {
    expect(
      parse('maxFeePerGas=invalid&maxPriorityFeePerGas=0&gasPrice=10'),
    ).toEqual({ maxPriorityFeePerGas: '0x0' });
    expect(
      parse('maxFeePerGas=0&maxPriorityFeePerGas=invalid&price=10'),
    ).toEqual({ maxFeePerGas: '0x0' });
  });

  it('passes fee relationships through for node validation', () => {
    expect(parse('maxFeePerGas=0x1&maxPriorityFeePerGas=2')).toEqual({
      maxFeePerGas: '0x1',
      maxPriorityFeePerGas: '0x2',
    });
    expect(parse('maxFeePerGas=2&maxPriorityFeePerGas=2')).toEqual({
      maxFeePerGas: '0x2',
      maxPriorityFeePerGas: '0x2',
    });
  });

  it('retains effective gas parameters across tab query serialization', () => {
    const query = getTabQuery(
      qs.parse('to=0x123&gasLimit=21000&price=10&maxPriorityFeePerGas=2'),
    );
    expect(query).toEqual({
      to: '0x123',
      gas: '21000',
      gasPrice: '10',
      maxPriorityFeePerGas: '2',
    });
    expect(getTabQuery(qs.parse(qs.stringify(query)))).toEqual(query);
    expect(parse(qs.stringify(query))).toEqual({
      gas: '0x5208',
      maxPriorityFeePerGas: '0x2',
    });
  });
});
