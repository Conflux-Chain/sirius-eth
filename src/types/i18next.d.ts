import { translations } from 'locales/i18n';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: typeof translations;
    returnNull: false;
  }
  interface TFunction {
    <
      TKeys extends i18next.TFunctionKeys = string,
      TInterpolationMap extends object = i18next.StringMap
    >(
      key: TKeys,
      options?: i18next.TOptions<TInterpolationMap> | string,
    ): string;
  }
  interface ParseTReturn {
    translation: string;
    formatted: string;
  }
  interface sirius_i18n {
    use(module: any): i18n;
    init(
      options: i18next.InitOptions,
      callback?: i18next.InitCompleteCallback,
    ): i18n;
  }
  const i18next: sirius_i18n;
  export = i18next;
}
