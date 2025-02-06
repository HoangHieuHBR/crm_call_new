export const LanguageSetting = {
  defaultLanguage: 'vi',
  languageSupport: ['en', 'vi', 'ko'],
  resourcesLanguage: {
    en: {
      translation: require('./data/lang_en.json')
    },
    vi: {
      translation: require('./data/lang_vi.json')
    },
    ko: {
      translation: require('./data/lang_ko.json')
    }
  }
};
