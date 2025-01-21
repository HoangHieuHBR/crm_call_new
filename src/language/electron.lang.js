import fs from 'fs';
import path from 'path';
class Language {
  constructor() {
    this.LANG_MAP = {};
  }

  text(key) {
    let safeKey = key ?? '**Not Found**';
    return this.LANG_MAP[key] ?? key;
  }

  setLanguage(rootApp, lang) {
    if (!rootApp || !lang) {
      console.log('WTF with THAT LANGUAGE NUL NULL');
    }
    if (this.curLang != lang) {
      this.dirName = rootApp;
      this.curLang = lang;
      this.readLangFile(lang);
    }
  }

  readLangFile() {
    let langDir = path.join(this.dirName, 'language');
    let resourceDir = path.join(langDir, 'resources');
    // console.log(resourceDir);
    let langfile = path.join(resourceDir, 'lang_' + this.curLang + '.json');
    if (!fs.existsSync(langfile)) {
      langfile = path.join(resourceDir, 'lang_en.json');
    }

    if (fs.existsSync(langfile)) {
      const rawData = fs.readFileSync(langfile);
      this.LANG_MAP = JSON.parse(rawData, 'utf8');
    }
  }
}

const allTranslation = new Language();

export default allTranslation;
