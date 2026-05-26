import useSWR from 'swr';
import { reqAATxDetail } from 'utils/httpRequest';

export const useAATxDetail = (
  hash: string,
  options?: Parameters<typeof useSWR>[2],
) => {
  return useSWR(
    hash ? ['aa tx detail', hash] : null,
    async () => {
      try {
        const res = await reqAATxDetail(hash);
        return res;
      } catch (error) {
        console.log('get aa tx detail error', error);
        return null;
      }
    },
    options,
  );
};
