/**
 * Asynchronously loads the component for EIP7702Authorizations
 */

import { lazyLoad } from 'utils/loadable';

export const EIP7702Authorizations = lazyLoad(
  () => import('./index'),
  module => module.EIP7702Authorizations,
);
