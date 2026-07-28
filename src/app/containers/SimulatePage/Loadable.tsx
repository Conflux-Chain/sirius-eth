/**
 * Asynchronously loads the component for SimulateTrace
 */

import { lazyLoad } from 'utils/loadable';

export const SimulatePage = lazyLoad(
  () => import('./index'),
  module => module.SimulatePage,
);
