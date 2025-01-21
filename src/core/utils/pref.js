import Store from 'electron-store';
import keytar from 'keytar';
import os from 'os';
import crypto from 'crypto';
import basicUtils from './basic.utils';
import { MODE_COUNTRY } from '../../configs/constant';
function normalLang(lang) {
  return lang.split('-')[0];
}

const keystoreName = 'CRMCall' + basicUtils.prefixFromArguments();

// STORE PATH IN HERE console.log(app.getPath('userData')); config.json

var KEEP_ACCOUNT_INFO = null;
class AppPreference {
  constructor() {
    const prefix = basicUtils.prefixFromArguments();
    if (prefix) {
      const name = 'CRMCall' + prefix;
      this.store = new Store({ name: name });
    } else {
      this.store = new Store();
    }
    this.userKey = null;
  }

  getDeviceName() {
    if (process.platform == 'win32') {
      return 'WINDOWS';
    }

    if (process.platform == 'darwin') {
      return 'MAC';
    }

    return 'LINUX';
  }

  getPCUUid() {
    var pid = this.store.get('pref_pc_uuid');
    if (pid == null) {
      const id = crypto.randomBytes(16).toString('hex');
      pid = os.hostname + '_' + id;
      this.store.set('pref_pc_uuid', pid);
    }
    return pid;
  }

  getLastPassword(domain, userId) {
    return new Promise(resolve => {
      keytar.getPassword(keystoreName, domain + '_' + userId).then(
        v => {
          resolve(v);
        },
        err => {
          resolve('');
        }
      );
    });
  }

  async clearAcccount(clearAll, callback) {
    KEEP_ACCOUNT_INFO = null;
    this.userKey = null;
    if (clearAll) {
      const domain = this.store.get('pref_domain') ?? '';
      const userId = this.store.get('pref_user_id') ?? '';
      try {
        if (domain && userId) {
          await keytar.deletePassword(keystoreName, domain + '_' + userId);
        }
      } catch (error) {}

      this.store.set('pref_domain', '');
      this.store.set('pref_user_id', '');
      this.store.set('pref_extra_data', '');
      this.store.set('pref_extend_number', '');
      this.store.set('pref_auto_login', false);
      this.store.set('pref_mode_country', '');
    } else {
      this.store.set('pref_extra_data', '');
    }
    callback();
  }

  async clearPassword(callback) {
    KEEP_ACCOUNT_INFO = null;
    this.userKey = null;
    const domain = this.store.get('pref_domain') ?? '';
    const userId = this.store.get('pref_user_id') ?? '';
    try {
      if (domain && userId) {
        await keytar.deletePassword(keystoreName, domain + '_' + userId);
      }
    } catch (error) {}
    this.store.set('pref_auto_login', false);
    callback();
  }

  setCallInfoDock(dockValue) {
    this.store.set('pref_call_info_dock', dockValue);
  }

  getCallInfoDock() {
    return this.store.get('pref_call_info_dock') ?? '1'; //TODO default is center and value must string
  }

  async setAccountInfo(accountInfo, callback) {
    KEEP_ACCOUNT_INFO = null;
    this.store.set('pref_domain', accountInfo.domain);
    this.store.set('pref_user_id', accountInfo.userId);
    try {
      if (accountInfo.extraData) {
        this.userKey = accountInfo.extraData.userkey;
        const json = JSON.stringify(accountInfo.extraData);
        const jsonEncrypt = encryptAes(json);
        this.store.set('pref_extra_data', jsonEncrypt);
      }

      if (accountInfo.password) {
        await keytar.setPassword(
          keystoreName,
          accountInfo.domain + '_' + accountInfo.userId,
          accountInfo.password
        );
      } else {
        await keytar.deletePassword(
          keystoreName,
          accountInfo.domain + '_' + accountInfo.userId
        );
      }
      this.store.set('pref_extend_number', accountInfo.extend);
      this.store.set('pref_auto_login', accountInfo.autoLogin);
      this.store.set('pref_mode_country', accountInfo.mode_country);
      callback();
    } catch (err) {}
  }

  async loadAllAppSetting(callback) {
    if (KEEP_ACCOUNT_INFO != null) {
      callback(KEEP_ACCOUNT_INFO);
      return;
    }
    this.loadAccountInfo(acc => {
      KEEP_ACCOUNT_INFO = acc;
      callback(acc);
    });
  }

  async loadAccountInfo(callback) {
    const accountInfo = {};
    accountInfo.domain = this.store.get('pref_domain') ?? '';
    accountInfo.userId = this.store.get('pref_user_id') ?? '';
    accountInfo.password = await this.getLastPassword(
      accountInfo.domain,
      accountInfo.userId
    );
    accountInfo.extend = this.store.get('pref_extend_number') ?? '';
    accountInfo.autoLogin = this.store.get('pref_auto_login') ?? false;
    accountInfo.mode_country =
      this.store.get('pref_mode_country') ?? MODE_COUNTRY.vietnamese;

    const extraDataEncrypt = this.store.get('pref_extra_data') ?? '';
    try {
      const extraDataJson = decryptAes(extraDataEncrypt);
      if (extraDataJson && extraDataJson != '') {
        accountInfo.extraData = JSON.parse(extraDataJson);
      } else {
        accountInfo.extraData = {};
      }
    } catch (error) {
      accountInfo.extraData = {};
    }

    let alreadyLogin =
      accountInfo.domain &&
      accountInfo.userId &&
      accountInfo.password &&
      accountInfo.domain != '' &&
      accountInfo.userId != '' &&
      accountInfo.password != '';

    if (alreadyLogin && accountInfo.mode_country == MODE_COUNTRY.korean) {
      alreadyLogin = this.userKey?.length > 0;
    }
    accountInfo.alreadyLogin = alreadyLogin;
    callback(accountInfo);
  }

  // keep current language
  setLanguage(lang, cb) {
    const nLang = normalLang(lang);
    this.store.set('pref_lang', nLang);
    cb(nLang);
  }

  getLanguage() {
    const lang = this.store.get('pref_lang') ?? '';
    return normalLang(lang);
  }

  getLanguageDef() {
    const lang = this.store.get('pref_lang') ?? 'ko';
    return normalLang(lang);
  }

  updateLanguageCode(lang, cb) {
    const nLang = normalLang(lang);
    if (cb) {
      cb(nLang);
    }
  }
}

var algorithm = 'aes-256-ctr';
var password = 'a4e1112f45e84f785358bb86ba750f48';

export function encryptAes(text) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decryptAes(text) {
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

const appPrefs = new AppPreference();

export default appPrefs;
