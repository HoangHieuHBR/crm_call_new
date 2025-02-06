import fs from 'fs';
import path from 'path';
import { assetResourcePath } from './util';

function normalLang(lang: string) {
  return lang.split('-')[0];
}

class Language {
  LANG_MAP: any;
  currentLanguage?: string | null;

  constructor() {
    this.LANG_MAP = {};
  }

  text(key: string) {
    return this.LANG_MAP[key] ?? key;
  }

  setLanguage(lang: string) {
    if (!lang) {
      console.log('WTF with THAT LANGUAGE NUL NULL');
    }

    const newLang = normalLang(lang);

    if (this.currentLanguage != newLang) {
      this.currentLanguage = newLang;
      this._readLangFile();
    }
  }

  _readLangFile() {
    const resourcePath = assetResourcePath();
    const langDir = path.join(resourcePath, 'languages');
    let langfile = path.join(langDir, 'lang_' + this.currentLanguage + '.json');

    if (!fs.existsSync(langfile)) {
      langfile = path.join(langDir, 'lang_en.json');
    }

    if (fs.existsSync(langfile)) {
      const rawData = fs.readFileSync(langfile);
      const json = rawData.toString('utf8');
      this.LANG_MAP = JSON.parse(json);
    }
  }
}

const allTranslation = new Language();

export default allTranslation;
