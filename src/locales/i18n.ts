import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';

import en from '@cfxjs/sirius-next-i18n/evm/base/en/translation.json';
import zh_cn from '@cfxjs/sirius-next-i18n/evm/base/zh_cn/translation.json';
import { ConvertedToObjectType } from '@cfxjs/sirius-next-i18n/types/index';
import ENV_CONFIG from 'env';
import lodash from 'lodash';
import { useI18n } from '@cfxjs/sirius-next-common/dist/store/index';

const translationsJson = {
  en: {
    translation: lodash.merge(en, ENV_CONFIG.ENV_LOCALES_EN),
  },
  'zh-CN': {
    translation: lodash.merge(zh_cn, ENV_CONFIG.ENV_LOCALES_CN),
  },
};

export type TranslationResource = typeof en;
export type LanguageKey = keyof TranslationResource;

export const translations: ConvertedToObjectType<TranslationResource> = {} as any;

/*
 * Converts the static JSON file into an object where keys are identical
 * but values are strings concatenated according to syntax.
 * This is helpful when using the JSON file keys and still have the intellisense support
 * along with type-safety
 */
const convertLanguageJsonToObject = (obj: any, dict: {}, current?: string) => {
  Object.keys(obj).forEach(key => {
    const currentLookupKey = current ? `${current}.${key}` : key;
    if (typeof obj[key] === 'object') {
      dict[key] = {};
      convertLanguageJsonToObject(obj[key], dict[key], currentLookupKey);
    } else {
      dict[key] = currentLookupKey;
    }
  });
};
export const i18n = i18next
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init(
    {
      resources: translationsJson,

      fallbackLng: 'en',
      debug:
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test',

      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
    },
    () => {
      convertLanguageJsonToObject(
        lodash.merge(en, ENV_CONFIG.ENV_LOCALES_EN),
        translations,
      );
      useI18n.setState({ translations });
    },
  );
