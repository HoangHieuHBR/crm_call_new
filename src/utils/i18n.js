import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const initI18n = (lang, LanguageSetting) => {
  i18n.use(initReactI18next).init({
    resources: LanguageSetting.resourcesLanguage,
    lng: lang,
    fallbackLng: LanguageSetting.defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });
};
