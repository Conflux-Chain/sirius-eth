import { useHistory } from 'react-router';
import {
  isBlockHash,
  isHash,
  isBlockNumber,
  tranferToLowerCase,
  formatAddress,
  isAddress,
  isZeroAddress,
} from 'utils';
import { CONTRACTS } from '../constants';
import { trackEvent } from '../ga';
import { ScanEvent } from '../gaConstants';

// Search bar hook
export const useSearch = (value?: string) => {
  const history = useHistory();
  let innerValue = value;

  const setSearch = async (
    searchValue?: string,
    setValue?: (value: string | undefined) => void,
  ) => {
    innerValue = searchValue || value;

    if (typeof innerValue !== 'string' || innerValue.trim() === '') return;

    // cip-37
    innerValue = tranferToLowerCase(innerValue.trim());

    // zero address support
    if (isZeroAddress(innerValue)) {
      history.push(`/address/${CONTRACTS.zero}`);
      // update searchbar value from 0x0 to zeroAddress
      setValue && setValue(CONTRACTS.zero);
      trackEvent({
        category: ScanEvent.search.category,
        action: ScanEvent.search.action.zeroAddress,
        label: innerValue,
      });
      return;
    }

    if (isAddress(innerValue)) {
      history.push(`/address/${formatAddress(innerValue)}`);
      return;
    }

    if (isBlockNumber(innerValue)) {
      history.push(`/block/${innerValue}`);
      trackEvent({
        category: ScanEvent.search.category,
        action: ScanEvent.search.action.epoch,
        label: innerValue,
      });
      return;
    }

    try {
      const isBlock = await isBlockHash(innerValue);
      if (isBlock) {
        history.push(`/block/${innerValue}`);
        trackEvent({
          category: ScanEvent.search.category,
          action: ScanEvent.search.action.block,
          label: innerValue,
        });
        return;
      }

      if (isHash(innerValue as string)) {
        history.push(`/tx/${innerValue}`);
        trackEvent({
          category: ScanEvent.search.category,
          action: ScanEvent.search.action.transaction,
          label: innerValue,
        });
        return;
      }

      history.push('/404');
      trackEvent({
        category: ScanEvent.search.category,
        action: ScanEvent.search.action.invalid,
        label: innerValue,
      });
    } catch (e) {}
  };

  return [innerValue, setSearch] as const;
};
