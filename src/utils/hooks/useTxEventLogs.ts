import useSWRImmutable from 'swr/immutable';
import { reqTransactionEventlogs } from 'utils/httpRequest';

export const useTxEventLogs = (
  hash?: string,
  isAATx = false,
  shouldFetch = true,
) => {
  return useSWRImmutable<any[]>(
    shouldFetch && hash ? `tx event log ${hash} - ${isAATx ? 'aa' : ''}` : null,
    async () => {
      const extra = isAATx
        ? {
            txType: 'aa',
          }
        : {};
      const res = await reqTransactionEventlogs({
        transactionHash: hash,
        aggregate: false,
        ...extra,
      });
      return res.list;
    },
  );
};
