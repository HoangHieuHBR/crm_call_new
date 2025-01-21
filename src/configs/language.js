export const LanguageSetting = {
  defaultLanguage: 'vi',
  languageSupport: ['en', 'vi', 'ko'],
  resourcesLanguage: {
    en: {
      translation: require('../language/resources/lang_en.json')
    },
    vi: {
      translation: require('../language/resources/lang_vi.json')
    },
    ko: {
      translation: require('../language/resources/lang_ko.json')
    }
  }
};
