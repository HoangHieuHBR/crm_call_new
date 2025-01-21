import Packet from './packet';
function cleanInvalidXMLChars(str) {
  var regex = /((?:[\0-\x08\x0B\f\x0E-\x1F\uFFFD\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g;
  return str.replace(regex, '');
}

function getDeviceName() {
  if (process.platform == 'win32') {
    return 'WINDOWS';
  }

  if (process.platform == 'darwin') {
    return 'MAC';
  }

  return 'WINDOWS';
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
    if (isNotEmpty(this.loginObj.domain)) {
      login.att('DOMAIN', this.loginObj.domain);
    }

    if (isNotEmpty(this.loginObj.password)) {
      login.att('PASSWORD', this.loginObj.password);
    }

    if (isNotEmpty(this.loginObj.userID)) {
      login.att('ID', this.loginObj.userID);
    }

    if (isNotEmpty(this.loginObj.extend)) {
      login.att('EXTEND', this.loginObj.extend);
      login.att('PHONE', this.loginObj.extend);
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
    if (isNotEmpty(this.loginObj.domain)) {
      login.att('DOMAIN', this.loginObj.domain);
    }

    if (isNotEmpty(this.loginObj.password)) {
      login.att('PASSWORD', this.loginObj.password);
    }

    if (isNotEmpty(this.loginObj.userID)) {
      login.att('ID', this.loginObj.userID);
    }

    if (isNotEmpty(this.loginObj.extend)) {
      login.att('EXTEND', this.loginObj.extend);
      login.att('PHONE', this.loginObj.extend);
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
    let live = alarm.ele('LIVE');
  }
}

export class LogoutPacket extends Packet {
  constructor() {
    super();
  }

  extensionXml(root) {
    let user = root.ele('USER');
    let logout = user.ele('LOGOUT');
  }
}

export class GetUserInfoPacket extends Packet {
  constructor(callId, phone, status) {
    super();
    this.callId = callId;
    this.phone = phone;
    this.status = status;
  }

  extensionXml(root) {
    let user = root.ele('USER');
    let info = user.ele('USERINFO');
    info.att('ID', this.callId);
    info.att('PHONE', this.phone);
    info.att('STATUS', this.status);
  }
}

export class StatusesPacket extends Packet {
  constructor() {
    super();
  }

  extensionXml(root) {
    let user = root.ele('USER');
    let statues = user.ele('STATUSES');
  }
}

export class TransferNumberPacket extends Packet {
  constructor(from, to, phone, callid) {
    super();
    this.from = from;
    this.to = to;
    this.phone = phone;
    this.callid = callid;
  }

  extensionXml(root) {
    let alarm = root.ele('ALARM');
    let transfer = alarm.ele('TRANSFERNUMBER');
    transfer.att('CUR', this.from);
    transfer.att('NEXT', this.to);
    transfer.att('NUMBER', this.phone);
    transfer.att('CALLID', this.callid);
  }
}

export class TransferCallPacket extends Packet {
  constructor(userKey, phone) {
    super();
    this.userKey = userKey;
    this.phone = phone;
  }

  extensionXml(root) {
    let alarm = root.ele('ALARM');
    let makeCall = alarm.ele('MAKECALL');
    makeCall.att('USERKEY', this.userKey);
    makeCall.att('NUMBER', this.phone);
  }
}
