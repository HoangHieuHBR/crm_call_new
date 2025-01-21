import { JSEncrypt } from 'jsencrypt';

const publicKeyEncode =
  '-----BEGIN PUBLIC KEY-----\r\n' +
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN\r\n' +
  'FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76\r\n' +
  'xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4\r\n' +
  'gwQco1KRMDSmXSMkDwIDAQAB\r\n' +
  '-----END PUBLIC KEY-----';

const jsEncrypt = new JSEncrypt();
jsEncrypt.setPublicKey(publicKeyEncode);

export const encryptRsa = rawString => {
  return jsEncrypt.encrypt(rawString);
};
