import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Link } from 'app/components/Link';
import { Modal } from '@cfxjs/react-ui';
import ReCAPTCHA from 'react-google-recaptcha';
import iconInfo from 'images/info.svg';
import { Tooltip } from 'app/components/Tooltip/Loadable';
import querystring from 'query-string';

export const DownloadCSV = ({ url: outerUrl }) => {
  const { t, i18n } = useTranslation();
  const [recaptchaVisible, setRecaptchaVisible] = useState(false);

  const handleRecaptchaModalClose = () => setRecaptchaVisible(false);
  const onRecaptchaChange = value => {
    if (value) {
      const { url, query } = querystring.parseUrl(outerUrl);
      // download csv file
      window.open(
        querystring.stringifyUrl({
          url: url,
          query: {
            ...query,
            token: value,
          },
        }),
      );
      // close google recaptcha
      setRecaptchaVisible(false);
    }
  };
  const handleDownloadCSV = e => {
    e.preventDefault();
    setRecaptchaVisible(true);
  };

  return (
    <StyledDownloadCSVWrapper>
      <Tooltip
        className="download-csv-tooltip"
        text={t(translations.general.downloadCSV.latest5000records)}
        placement="top"
      >
        <IconWrapper>
          <img
            src={iconInfo}
            alt="warning-icon"
            className="download-svg-img"
          ></img>
        </IconWrapper>
      </Tooltip>
      <span>{t(translations.general.downloadCSV.download)} </span>
      <Link onClick={handleDownloadCSV}>
        {t(translations.general.downloadCSV.csvFile)}
      </Link>
      <Modal
        open={recaptchaVisible}
        onClose={handleRecaptchaModalClose}
        closable
        width={'26.0714rem'}
      >
        <ReCAPTCHA
          sitekey="6LeSnTofAAAAAML11Df2KzLagoDb59fhVWb8ENSc"
          onChange={onRecaptchaChange}
          hl={i18n.language.indexOf('en') > -1 ? 'en' : 'zh'}
        />
      </Modal>
    </StyledDownloadCSVWrapper>
  );
};

const StyledDownloadCSVWrapper = styled.div`
  text-align: right;
  margin-bottom: -1rem;
  .tooltip.download-csv-tooltip + .tooltip-content {
    div.tooltip-arrow {
      left: -0.8571rem !important;
    }
  }
`;

const IconWrapper = styled.div`
  padding-right: 0.2857rem;
  width: 1.2857rem;
  cursor: pointer;

  .download-svg-img {
    margin-top: -0.2857rem;
  }
`;
