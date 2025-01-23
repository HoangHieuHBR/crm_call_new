import CryptoJS from 'crypto-js';

const keyAes = 'KesoiaZa$Honbiry';

const options = {
  mode: CryptoJS.mode.ECB,
  iv: CryptoJS.enc.Utf8.parse('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'),
  padding: CryptoJS.pad.ZeroPadding
};

export function decrypt(data) {
  return new Promise(function(resolve, reject) {
    try {
      const encryptedData = data.slice(6);
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Hex.parse(encryptedData) },
        CryptoJS.enc.Utf8.parse(keyAes),
        options
      );
      resolve(decrypted ? decrypted.toString(CryptoJS.enc.Utf8) : '');
    } catch (e) {
      reject('');
    }
  });
}

export function decryptWithFlag(data) {
  return new Promise(function(resolve, reject) {
    try {
      let flag = data.slice(0, 1).toString();
      if (flag == 0) {
        return data.slice(1).toString();
      }
      const encryptedData = data.slice(1);

      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Hex.parse(encryptedData.toString()) },
        CryptoJS.enc.Utf8.parse(keyAes),
        options
      );
      resolve(decrypted ? decrypted.toString(CryptoJS.enc.Utf8) : '');
    } catch (e) {
      reject('');
    }
  });
}

export function encrypt(data) {
  const flagEncrypt = 1;
  try {
    const encrypted = CryptoJS.AES.encrypt(
      data,
      CryptoJS.enc.Utf8.parse(keyAes),
      options
    );
    const encryptedData = encrypted.ciphertext.toString();
    const headerData = encryptedData.length + 1;
    const headerDataWithFilled = ('00000' + headerData).slice(-5);
    return `${headerDataWithFilled}${flagEncrypt}${encryptedData}`;
  } catch (ex) {
    return '';
  }
}
