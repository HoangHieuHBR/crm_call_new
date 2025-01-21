import Packet from './packet';
function cleanInvalidXMLChars(str) {
  var regex = /((?:[\0-\x08\x0B\f\x0E-\x1F\uFFFD\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g;
  return str.replace(regex, '');
}

function getDeviceName() {
  if (process.platform == 'win32') {
    return 'WIN';
  }

  if (process.platform == 'darwin') {
    return 'MAC';
  }

  return 'LINUX';
}

function isEmpty(data) {
  return data == null || data == '';
}

function isNotEmpty(data) {
  return data != null && data != '';
}

export class LoginPacket extends Packet {
  constructor(loginObj) {
    super();
    this.loginObj = loginObj;
  }

  extensionXml(root) {
    let user = root.ele('USER');
    let login = user.ele('LOGIN');
    if (isNotEmpty(this.loginObj.otp)) {
      login.att('CODE', this.loginObj.otp);
    }

    if (isNotEmpty(this.loginObj.domain)) {
      login.att('DOMAIN', this.loginObj.domain);
    }

    if (isNotEmpty(this.loginObj.password)) {
      login.att('PASSWORD', this.loginObj.password);
    }

    if (isNotEmpty(this.loginObj.extend)) {
      login.att('EXTEND', this.loginObj.extend);
      login.att('PHONE', this.loginObj.extend);
    }

    if (isNotEmpty(this.loginObj.cookies)) {
      login.att('COOKIES', this.loginObj.cookies);
    }

    if (isNotEmpty(this.loginObj.jwt)) {
      login.att('JWT', this.loginObj.jwt);
    }

    if (isNotEmpty(this.loginObj.hmail)) {
      login.att('HMAIL', this.loginObj.hmail);
    }

    if (isNotEmpty(this.loginObj.session)) {
      login.att('SESSION', this.loginObj.session);
    }

    if (isNotEmpty(this.loginObj.userID)) {
      login.att('ID', this.loginObj.userID);
    }

    login.att('VER', '1.0');
    login.att('ISPTYPE', '4');
    login.att('DEVICE', getDeviceName());
  }
}

export class ReLoginPacket extends Packet {
  constructor(loginObj) {
    super();
    this.loginObj = loginObj;
  }

  extensionXml(root) {
    let user = root.ele('USER');
    let login = user.ele('LOGIN');
    if (isNotEmpty(this.loginObj.otp)) {
      login.att('CODE', this.loginObj.otp);
    }

    if (isNotEmpty(this.loginObj.domain)) {
      login.att('DOMAIN', this.loginObj.domain);
    }

    if (isNotEmpty(this.loginObj.password)) {
      login.att('PASSWORD', this.loginObj.password);
    }

    if (isNotEmpty(this.loginObj.extend)) {
      login.att('EXTEND', this.loginObj.extend);
      login.att('PHONE', this.loginObj.extend);
    }

    if (isNotEmpty(this.loginObj.cookies)) {
      login.att('COOKIES', this.loginObj.cookies);
    }

    if (isNotEmpty(this.loginObj.jwt)) {
      login.att('JWT', this.loginObj.jwt);
    }

    if (isNotEmpty(this.loginObj.hmail)) {
      login.att('HMAIL', this.loginObj.hmail);
    }

    if (isNotEmpty(this.loginObj.session)) {
      login.att('SESSION', this.loginObj.session);
    }

    if (isNotEmpty(this.loginObj.userID)) {
      login.att('ID', this.loginObj.userID);
    }

    login.att('VER', '1.0');
    login.att('ISPTYPE', '4');
    login.att('DEVICE', getDeviceName());
  }
}

export class LivePacket extends Packet {
  constructor(extendNumber) {
    super();
    this.extendNumber = extendNumber;
  }

  extensionXml(root) {
    let alarm = root.ele('ALARM');
    alarm.att('EXTEND', this.extendNumber);
    let live = alarm.ele('LIVE');
  }
}

export class TransferPhonePacket extends Packet {
  constructor(from, to, phone, callid) {
    super();
    this.from = from;
    this.to = to;
    this.phone = phone;
    this.callid = callid;
  }

  extensionXml(root) {
    let transfer = root.ele('TRANSFER');
    transfer.att('FROM', this.from);
    transfer.att('TO', this.to);
    transfer.att('PHONE', this.phone);
    transfer.att('CALLID', this.callid);
  }
}

export class TransferCallPacket extends Packet {
  constructor(from, to) {
    super();
    this.from = from;
    this.to = to;
  }

  extensionXml(root) {
    let call = root.ele('CALL_PHONE');
    call.att('FROM', this.from);
    call.att('TO', this.from);
  }
}
