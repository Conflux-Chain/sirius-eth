/**
 * Asynchronously loads the component for AccountAbstraction
 */

import { lazyLoad } from 'utils/loadable';

export const AccountAbstraction = lazyLoad(
  () => import('./index'),
  module => module.AccountAbstraction,
);
