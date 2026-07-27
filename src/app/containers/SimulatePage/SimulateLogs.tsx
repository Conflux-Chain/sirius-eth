import React from 'react';
import { toThousands } from 'utils';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { Empty } from '@cfxjs/sirius-next-common/dist/components/Empty';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { EventLog } from '../Transaction/EventLogs';
import { SimulateLog } from '@cfxjs/sirius-next-common/dist/utils/hooks/useSimulateTrace';

interface Props {
  logs?: SimulateLog[];
  isLoading?: boolean;
}

export const SimulateLogs = ({ logs, isLoading }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledEventLogsWrapper>
      <Card>
        {isLoading ? null : <Empty show={!logs?.length} />}
        {logs?.length ? (
          <>
            <div className="eventlog-title-total">
              {t(translations.general.totalRecord, {
                total: toThousands(logs.length),
              })}
            </div>
            {logs.map((log, index) => (
              <EventLog log={log} key={`${log.address}-${index}`} />
            ))}
          </>
        ) : null}
      </Card>
    </StyledEventLogsWrapper>
  );
};

const StyledEventLogsWrapper = styled.div`
  position: relative;
  margin-bottom: 2.2857rem;
  min-height: 16.4286rem;

  .eventlog-title-total {
    padding: 1.1429rem 0;
    border-bottom: 1px solid #e8e9ea;
  }

  .eventlog-content {
    display: flex;

    ${media.s} {
      flex-direction: column;
    }

    .eventlog-index {
      width: 2.2857rem;
      min-width: 2.2857rem;
      height: 2.2857rem;
      border-radius: 50%;
      background: #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0.8571rem 2rem 0 0;
    }
    .eventlog-item {
      flex-grow: 1;
    }
  }
`;
