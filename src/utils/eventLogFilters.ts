import { eventLogScan } from '@cfxjs/sirius-next-common/dist/utils/eventLogScan';

export const {
  fields: eventLogFields,
  read: readEventLogFilters,
  validate: validateEventLogFilters,
} = eventLogScan.evm;

export const eventLogErrorKeys = {
  invalidHeight: 'invalidBlock',
  reversedRange: 'fromBlockGtToBlock',
  invalidTopic0: 'invalidTopic0',
} as const;
