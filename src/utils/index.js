import validator from 'validator';

function _validateValue(_value, _isLowerCase) {
  if (typeof _isLowerCase != undefined && _isLowerCase == false) {
    return _value.trim();
  } else {
    return _value.trim().toLowerCase();
  }
}

export const validate = {
  isID: function (_value, _isLowerCase = null) {
    let success = true;
    let msg = '';
    let value = _validateValue(_value, _isLowerCase);
    if (validator.isEmpty(value)) {
      success = false;
      msg = 'Please input User ID value';
    }
    return { success, msg, value };
  },
  isExtendNumber: function (_value, _isLowerCase = null) {
    let success = true;
    let msg = '';
    let value = _validateValue(_value, _isLowerCase);
    if (validator.isEmpty(value)) {
      success = false;
      msg = 'Please input Extend Number value';
    }
    return { success, msg, value };
  },
  isDomain: function (_value, _isLowerCase = null) {
    let success = true;
    let msg = '';
    let value = _validateValue(_value, _isLowerCase);
    let re = new RegExp(
      /^[\w.-]+(?:\.[\w\.-]+)+[\w\-\.~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
    );
    if (validator.isEmpty(value)) {
      success = false;
      msg = 'Please input domain value';
    } else if (!value.match(re)) {
      success = false;
      msg = 'Domain value is not valid';
    }
    return { success, msg, value };
  },
  isName: function (_value, _isLowerCase = null) {
    let success = true;
    let msg = '';
    let value = _validateValue(_value, _isLowerCase);
    if (validator.isEmpty(value)) {
      success = false;
      msg = 'input_full_name';
    }
    return { success, msg, value };
  },
  isEmail: function (_value, _isLowerCase = null) {
    let success = true;
    let msg = '';
    let value = _validateValue(_value, _isLowerCase);
    if (validator.isEmpty(value)) {
      success = false;
      msg = 'jsc_input_email';
    } else if (!validator.isEmail(value)) {
      success = false;
      msg = 'jsc_valid_email';
    }
    return { success, msg, value };
  },
  isPhone: function (_value, _isLowerCase = null) {
    let success = true;
    let msg = '';
    let value = _validateValue(_value, _isLowerCase);
    if (validator.isEmpty(value) || !validator.isNumeric(value)) {
      success = false;
      msg = 'common_phone_invalid_msg';
    }
    return { success, msg, value };
  },
  isPass: function (_value, _isLowerCase = null) {
    let success = true;
    let msg = '';
    let value = _validateValue(_value, _isLowerCase);
    if (validator.isEmpty(value)) {
      success = false;
      msg = 'Please input Password value';
    }
    return { success, msg, value };
  },
  isPassword: function (_value, _isLowerCase = null) {
    let re = new RegExp(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/);
    let success = true;
    let msg = '';
    let value = _validateValue(_value, _isLowerCase);
    if (validator.isEmpty(value)) {
      success = false;
      msg = 'jsc_input_password';
    } else if (!value.match(re)) {
      success = false;
      msg = 'jsc_valid_password';
    }
    return { success, msg, value };
  },
  isTelephone: function (_value, _isLowerCase = null) {
    let re = new RegExp(/^[0-9]+$|/);
    let success = true;
    let msg = '';
    let value = _validateValue(_value, _isLowerCase);
    if (!value.match(re)) {
      success = false;
      msg = 'common_phone_invalid_msg';
    }
    return { success, msg, value };
  },
};

export const convertFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const saveDataToStorage = (name, data) => {
  const json = JSON.stringify(data);
  localStorage.setItem(name, json);
};

export const getDataFromStorage = (name) => {
  const openState = localStorage.getItem(name);
  return JSON.parse(openState);
};

export function cleanInvalidXMLChars(str) {
  var regex =
    /((?:[\0-\x08\x0B\f\x0E-\x1F\uFFFD\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g;
  return str.replace(regex, '');
}

const removeEmoji = (str) =>
  str.replace(
    new RegExp(
      '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*',
      'g',
    ),
    '',
  );

export const isOnlyEmojis = (str) => {
  if (!str || str.length >= 50) {
    return false;
  }
  return !removeEmoji(str).length;
};

export const convertHtmlToPlainText = (input) => {
  let html = input.replace(
    /(<p[\w\W]+?)><br data-mce-bogus=\"1\"><\/p>/gi,
    '$1></p>',
  );
  html = html.replace(/(<p[\w\W]+?)><br><\/p>/gi, '$1></p>');
  html = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
  html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
  html = html.replace(/<\/div>/gi, '\n');
  html = html.replace(/<\/li>/gi, '\n');
  html = html.replace(/<li>/gi, '  *  ');
  html = html.replace(/<\/ul>/gi, '\n');
  html = html.replace(/<\/p>/gi, '\n');
  html = html.replace(/<br\s*[\/]?>/gi, '\n');
  html = html.replace(/<[^>]+>/gi, '');
  return html.trim();
};

export const languageFromCode = (code) => {
  switch (code) {
    case 'en':
      return 'English';
    case 'vi':
      return 'Vietnamese';
    case 'ko':
      return 'Korean';
    default:
      return 'Unknown';
  }
};
