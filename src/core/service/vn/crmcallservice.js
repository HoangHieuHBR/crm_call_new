import parser from 'xml-js';
import axios from 'axios';
import HanSocket from './hansocket';
import TextUtils from '../../utils/text.utils';
import {
  SOCKET_ERROR_CODE,
  ACTION_ERROR_SOCKET_EVENT,
  ACTION_DATA_SOCKET_EVENT,
  ACTION_LOGIN_SOCKET_EVENT,
  EVENT_ID_EXTEND_ONLINE,
  EVENT_ID_CALL_EVENT,
  EVENT_ID_USER_INFO,
  EVENT_ID_LOGOUT_BY_OTHER_DEVICE,
  EVENT_ID_TRANSFER_CALL_RESULT
} from '../../../configs/constant';
import * as CRMPacket from './xml/crmpacket';
import CRMAPI from './server.api';
import log from 'electron-log';

class CRMCallServiceCenter {
  constructor() {
    this.listeners = [];
    this.connecting = false;
    this.isAuthenticated = false;
    this.hanSocket = null;
    this.liveTimer = null;
    this.cancelTokenDNSSource = null;

    this.loginResultObject = null;

    this._initServerInfo();

    this.numberOfRetry = 0;
    this.safeRetryRelogin = 0;

    this.timeoutRelogin = null;
  }

  _resetNumberRetry() {
    this.numberOfRetry = 0;
  }

  _initServerInfo() {
    this.serverInfo = {
      ip: null,
      port: 0,
      saveLogger: false
    };
  }

  addListener(listener) {
    if (listener) {
      this.listeners.push(listener);
    }
  }

  removeListener(listener) {
    if (listener) {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    }
  }

  _broadcastListener(action, data) {
    this.listeners.forEach(listener => {
      listener(action, data);
    });
  }

  parserXMLResponsePackageDemo(xmlString) {
    const raw = xmlString.toString('utf8').trim();
    this._parserXMLAllAPI(raw);
  }

  disconnectService() {
    if (this.cancelTokenDNSSource) {
      this.cancelTokenDNSSource.cancel();
      this.cancelTokenDNSSource = null;
    }

    this.isConnecting = false;
    this.isAuthenticated = false;
    if (this.hanSocket) {
      this.hanSocket.disconnectSocket(true);
      this.hanSocket = null;
    }

    this.stopLiveTimer();
    if (this.timeoutRelogin) {
      clearTimeout(this.timeoutRelogin);
      this.timeoutRelogin = null;
    }
  }

  reconnectService(reset) {
    const isOnRequest = this.isConnecting || this.isAuthenticated;
    if (isOnRequest) {
      console.log('has connection already, ignore retry login ');
      return;
    }

    if (
      !this.loginResultObject ||
      TextUtils.isEmpty(this.loginResultObject.cookies)
    ) {
      return;
    }

    if (this.safeRetryRelogin >= 100) {
      this.safeRetryRelogin = 0;
      this.logoutWithStatus({
        code: 2,
        msg: 'The server restarted or an internal error occurred'
      });
      return;
    }

    if (reset) {
      this._resetNumberRetry();
    }

    const timeout = this.numberOfRetry * 10000;
    if (this.timeoutRelogin) {
      clearTimeout(this.timeoutRelogin);
      this.timeoutRelogin = null;
    }

    this.timeoutRelogin = setTimeout(() => {
      console.log(
        'start reconnect socket retry = ',
        this.numberOfRetry,
        timeout
      );
      this.safeRetryRelogin++;
      this.numberOfRetry++;
      this.isConnecting = true;
      this._startCRMCenter(false, false, null, null);
    }, timeout);
  }

  logoutWithStatus(status, callback) {
    this._resetNumberRetry();
    this.disconnectService();
    this.loginResultObject = null;
    CRMAPI.updateData(null, null);
    this._broadcastListener(ACTION_DATA_SOCKET_EVENT, {
      eventId: EVENT_ID_LOGOUT_BY_OTHER_DEVICE,
      status: status
    });
    if (callback) {
      callback();
    }
  }

  cancelLogin() {
    this.disconnectService();
  }

  loginWithDomainUserIdPassword(
    domain,
    userId,
    password,
    extendNumber,
    otpCode,
    extra_info
  ) {
    console.log('run loginWithDomainUserIdPassword');
    this.isConnecting = true;
    this.domain = domain;
    this.userId = userId;
    this.password = password;
    this.extendNumber = extendNumber;
    this.extra_info = extra_info;
    this._startCRMCenter(true, true, otpCode, extra_info);
  }

  _connectWebsocketClient(isLogin, otpCode, extra_info) {
    this._setupLog();
    this.hanSocket = new HanSocket();
    this.hanSocket.saveLogger = this.serverInfo.saveLogger;
    global.ShareGlobalObject.isFileLogger = this.serverInfo.saveLogger;
    this.hanSocket.connectWithIpPort(this.serverInfo.ip, this.serverInfo.port, {
      socketConnected: () => {
        let loginPacket;
        if (isLogin) {
          loginPacket = new CRMPacket.LoginPacket({
            otp: otpCode,
            domain: this.domain,
            password: this.password,
            extend: this.extendNumber,
            cookies: extra_info?.cookies,
            jwt: extra_info?.jwt,
            hmail: extra_info?.hmail,
            session: extra_info?.session,
            userID: this.userId
          });
        } else {
          loginPacket = new CRMPacket.ReLoginPacket({
            domain: this.domain,
            extend: this.extendNumber,
            cookies: this.loginResultObject.cookies,
            jwt: this.loginResultObject.jwt,
            hmail: this.loginResultObject.hmail,
            session: this.loginResultObject.session,
            userID: this.userId
          });
        }

        this.hanSocket.sendPacket(loginPacket);
      },
      socketDisconnectWithError: error => {
        if (
          !this.loginResultObject ||
          TextUtils.isEmpty(this.loginResultObject.cookies)
        ) {
          this.disconnectService();
          this._broadcastListener(ACTION_ERROR_SOCKET_EVENT, {
            code: SOCKET_ERROR_CODE.customError,
            errorMessage:
              'An error occurred during login. Please try again later'
          });
        } else {
          this.disconnectService();
          this.reconnectService(false);
        }
      },
      onReceivedPacket: xmlString => {
        const raw = xmlString.toString('utf8').trim();
        this._parserXMLAllAPI(raw);
      }
    });
  }

  _parserXMLAllAPI(xmlString) {
    try {
      const jsonData = parser.xml2js(xmlString, { compact: false });
      const childXML = jsonData.elements[0].elements;
      childXML.forEach(element => {
        if (element.name == 'USER') {
          const childUser = element.elements;
          XMLProcess.processUser(this, childUser);
        } else if (element.name == 'SIP') {
          const childSip = element.elements;
          XMLProcess.processSip(this, childSip);
        }
      });
    } catch (err) {
      this.disconnectService();
      this._broadcastListener(ACTION_ERROR_SOCKET_EVENT, {
        code: SOCKET_ERROR_CODE.customError,
        errorMessage: err
      });
    }
  }

  _startCRMCenter(isLogin, serverXmlRequest, otpCode, extra_info) {
    if (serverXmlRequest) {
      this._resolveDNSFromHost('http://', this.domain, (response, error) => {
        if (error != null) {
          this._broadcastListener(ACTION_LOGIN_SOCKET_EVENT, {
            code: SOCKET_ERROR_CODE.dns_error,
            errorMessage: error
          });
        } else {
          if (this._processDNSXML(response.data)) {
            console.log('start connect socket');
            this._connectWebsocketClient(isLogin, otpCode, extra_info);
          } else {
            console.log('error process dns');
            this._broadcastListener(ACTION_LOGIN_SOCKET_EVENT, {
              code: SOCKET_ERROR_CODE.dns_error,
              errorMessage: error
            });
          }
        }
      });
    } else {
      this._connectWebsocketClient(isLogin, otpCode, extra_info);
    }
  }

  _processDNSXML(dataResponse) {
    try {
      this._initServerInfo();
      const jsonData = parser.xml2js(dataResponse, { compact: false });

      const childXML = jsonData.elements[0].elements;
      childXML.forEach(element => {
        if (element.name == 'SERVER') {
          const attrs = element.attributes;
          if (attrs) {
            const domainTmp = attrs['DOMAIN'];
            if (this.domain == domainTmp) {
              this.serverInfo.ip = attrs['IP'] ?? '';
              this.serverInfo.port = attrs['PORT'] ?? 0;
            }
          }
        } else if (element.name == 'LOG') {
          if (element.elements) {
            this.serverInfo.saveLogger =
              element.elements[0].text == 1 ? true : false;
          }
        }
      });

      if (TextUtils.isEmpty(this.serverInfo.ip) || this.serverInfo.port <= 0) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  async _resolveDNSFromHost(scheme, domain, callback) {
    var url = scheme + domain + '/crmcallnodejs/server2.xml';
    console.log('start request:' + url);
    try {
      const CancelToken = axios.CancelToken;
      this.cancelTokenDNSSource = CancelToken.source();
      const response = await axios.get(url, {
        timeout: 10000,
        cancelToken: this.cancelTokenDNSSource.token
      });
      this.cancelTokenDNSSource = null;
      callback(response, null);
    } catch (error) {
      this.cancelTokenDNSSource = null;
      if (axios.isCancel(error)) {
        console.log('Request canncelled');
        return;
      }
      callback(null, error);
    }
  }

  _setupLog() {
    log.transports.file.level = 'info';
    log.transports.file.fileName = `${this.domain}.log`;
    log.transports.file.maxSize = 5242880;
  }

  sendLivePacket() {
    if (this.isAuthenticated) {
      this.hanSocket.sendPacket(new CRMPacket.LivePacket(this.extendNumber));
    }
  }

  stopLiveTimer() {
    if (this.liveTimer) {
      clearInterval(this.liveTimer);
      this.liveTimer = null;
    }
  }

  sendLivePacketTimer() {
    const liveDelay = 10000;
    this.sendLivePacket();
    this.stopLiveTimer();
    this.liveTimer = setInterval(() => {
      this.sendLivePacket();
    }, liveDelay);
  }

  sendTranferCallWithPhone({ from, to, phone, callid }) {
    if (this.isAuthenticated) {
      this.hanSocket.sendPacket(
        new CRMPacket.TransferPhonePacket(from, to, phone, callid)
      );
    }
  }

  sendMakeCall({ from, to }) {
    if (this.isAuthenticated) {
      this.hanSocket.sendPacket(new CRMPacket.TransferCallPacket(from, to));
    }
  }
}

const XMLProcess = {
  processUser(crmcallService, rootElement) {
    let response = {};
    rootElement.forEach(element => {
      if (element.name == 'LOGIN') {
        response.apiID = 'LOGIN';
        const attrs = element.attributes;
        let login = null;
        let statusCode = attrs['RESULT'] ?? 0;
        const msg = attrs['MSG'] ?? '';
        if (statusCode != 1) {
          let errorMessage = 'Unknown error';
          if (statusCode == 3) {
            errorMessage = 'OTP required';
          } else if (statusCode == 2) {
            if (TextUtils.isEmpty(msg)) {
              errorMessage = 'Authenticate failed';
            } else {
              errorMessage = msg;
            }
          }
          login = {
            result: statusCode,
            errorMessage: errorMessage
          };
        } else {
          login = {
            result: statusCode,
            data: {
              email: attrs['EMAIL'] ?? '',
              id: attrs['ID'] ?? '',
              mobilephone: attrs['MOBILEPHONE'] ?? '',
              registerphonetime: attrs['REGISTERED_PHONE_TIME'] ?? 0,
              sex: attrs['SEX'] ?? '1',
              telephone: attrs['TELEPHONE'] ?? '',
              username: attrs['USERNAME'] ?? '',
              extend: attrs['EXTEND'] ?? '',
              cookies: attrs['COOKIES'] ?? '',
              hmail: attrs['HMAIL'] ?? '',
              session: attrs['SESSION'] ?? '',
              cn: attrs['CN'] ?? '',
              userno: attrs['USERNO'] ?? '',
              jwt: attrs['JWT'] ?? '',
              domain: attrs['DOMAIN'] ?? '',
              versionwin: attrs['VERSION_WIN'] ?? '',
              folderwin: attrs['FOLDER_WIN'] ?? '',
              filewin: attrs['FILE_WIN'] ?? ''
            }
          };
        }
        response.login = login;
      } else if (element.name == 'EXTEND_ONLINE') {
        response.apiID = 'EXTEND_ONLINE';
        const attrs = element.attributes;
        let data = {};
        if (attrs) {
          const result = attrs['RESULT'] ?? '';
          data.result = result;
        }
        response.data = data;
      } else if (element.name == 'LOGOUT') {
        response.apiID = 'LOGOUT';
      } else if (element.name == 'USERINFO') {
        response.apiID = 'USERINFO';
        const attrs = element.attributes;
        let data = {};
        if (attrs) {
          data = {
            category: attrs['CATEGORY'] ?? '',
            cn: attrs['CN'] ?? '',
            code: attrs['CODE'] ?? '',
            id: attrs['ID'] ?? '',
            name: attrs['NAME'] ?? '',
            parentcn: attrs['PARENT_CN'] ?? '',
            parentcode: attrs['PARENT_CODE'] ?? '',
            parentname: attrs['PARENT_NAME'] ?? '',
            phone: attrs['PHONE'] ?? '',
            phonetype: attrs['PHONETYPE'] ?? '',
            rating: attrs['RATING'] ?? '',
            type: attrs['TYPE'] ?? '',
            customerid: attrs['CUSTOMER_ID'] ?? ''
          };
        }

        const staffElements = element.elements;
        let staffs = [];
        if (staffElements) {
          staffElements.forEach(staffElement => {
            if (staffElement.name == 'STAFF') {
              const attrs = staffElement.attributes;
              if (attrs) {
                staffs.push({
                  staff_user_name: attrs['STAFF_NAME'],
                  staff_cn: attrs['STAFF_CN'],
                  staff_no: attrs['STAFF_NO']
                });
              }
            }
          });
        }

        data.staffs = staffs;
        response.data = data;
      }
    });

    if (response.apiID == 'LOGIN') {
      PacketListener.onReceivedLoginPacket(crmcallService, response);
    } else if (response.apiID == 'EXTEND_ONLINE') {
      PacketListener.onReceivedExtendOnlinePacket(crmcallService, response);
    } else if (response.apiID == 'LOGOUT') {
      PacketListener.onReceivedLogoutPacket(crmcallService, response);
    } else if (response.apiID == 'USERINFO') {
      PacketListener.onReceivedUserInfoPacket(crmcallService, response);
    }
  },
  processSip(crmcallService, rootElement) {
    let response = {};
    rootElement.forEach(element => {
      if (element.name == 'CALLSTATUS') {
        response.apiID = 'CALLSTATUS';
        const attrs = element.attributes;
        let data = null;
        if (attrs) {
          data = {
            direction: attrs['DIRECTION'] ?? '',
            event: attrs['EVENT'] ?? '',
            callid: attrs['CALLID'] ?? '',
            time: TextUtils.timeFromTimeStampSafe(attrs['TIME'] ?? ''),
            from: attrs['FROM'] ?? '',
            to: attrs['TO'] ?? '',
            pickupid: attrs['PICKUPID'] ?? ''
          };
        }
        response.data = data;
      } else if (element.name == 'TRANSFER_RESULT') {
        response.apiID = 'TRANSFER_RESULT';
        const attrs = element.attributes;
        let data = {};
        if (attrs) {
          data = {
            result: attrs['RESULT'] == 'true',
            callid: attrs['CALLID'] ?? ''
          };
        }
        response.data = data;
      }
    });

    if (response.apiID == 'CALLSTATUS') {
      PacketListener.onReceivedCallStatusPacket(crmcallService, response);
    } else if (response.apiID == 'TRANSFER_RESULT') {
      PacketListener.onReceivedTransferResultPacket(crmcallService, response);
    }
  }
};

const PacketListener = {
  onReceivedLoginPacket(crmcallService, response) {
    if (response.login.result == 1) {
      CRMAPI.updateData(crmcallService.domain, response.login.data);
      //login success
      crmcallServiceCenter._resetNumberRetry();
      crmcallService._broadcastListener(ACTION_LOGIN_SOCKET_EVENT, {
        code: SOCKET_ERROR_CODE.login_success,
        data: {
          domain: crmcallService.domain,
          userId: crmcallService.userId,
          password: crmcallService.password,
          extendNumber: crmcallService.extendNumber,
          result: response.login.data
        }
      });
      crmcallService.isAuthenticated = true;
      crmcallService.loginResultObject = response.login.data;

      crmcallService.sendLivePacketTimer();
    } else if (response.login.result == 3) {
      crmcallService.disconnectService();
      crmcallService._broadcastListener(ACTION_LOGIN_SOCKET_EVENT, {
        code: SOCKET_ERROR_CODE.require_otp,
        errorMessage: response.login.errorMessage
      });
    } else if (response.login.result == 2) {
      crmcallService.disconnectService();
      crmcallService._broadcastListener(ACTION_LOGIN_SOCKET_EVENT, {
        code: SOCKET_ERROR_CODE.customError,
        errorMessage: response.login.errorMessage
      });
    } else {
      crmcallService.disconnectService();
      crmcallService._broadcastListener(ACTION_LOGIN_SOCKET_EVENT, {
        code: SOCKET_ERROR_CODE.customError,
        errorMessage: response.login.errorMessage
      });
    }
  },
  onReceivedExtendOnlinePacket(crmcallService, response) {
    if (TextUtils.isNotEmpty(response.data?.result)) {
      crmcallService.hanSocket
        ._decryptData(response.data?.result)
        .then(result => {
          let data = [];
          try {
            data = JSON.parse(result);
          } catch (err) {
            data = [];
          }

          crmcallService._broadcastListener(ACTION_DATA_SOCKET_EVENT, {
            eventId: EVENT_ID_EXTEND_ONLINE,
            data: data
          });
        })
        .catch(error => {});
    }
  },
  onReceivedLogoutPacket(crmcallService, response) {
    crmcallServiceCenter.logoutWithStatus({
      code: 1,
      msg: 'You have already logged in with another device'
    });
  },
  onReceivedCallStatusPacket(crmcallService, response) {
    if (response.data) {
      crmcallService._broadcastListener(ACTION_DATA_SOCKET_EVENT, {
        eventId: EVENT_ID_CALL_EVENT,
        data: response.data
      });
    }
  },
  onReceivedTransferResultPacket(crmcallService, response) {
    if (response.data) {
      crmcallService._broadcastListener(ACTION_DATA_SOCKET_EVENT, {
        eventId: EVENT_ID_TRANSFER_CALL_RESULT,
        data: response.data
      });
    }
  },
  onReceivedUserInfoPacket(crmcallService, response) {
    if (!crmcallService.isAuthenticated) {
      return;
    }
    if (response.data) {
      crmcallService._broadcastListener(ACTION_DATA_SOCKET_EVENT, {
        eventId: EVENT_ID_USER_INFO,
        data: response.data
      });
    }
  }
};

const crmcallServiceCenter = new CRMCallServiceCenter();
export default crmcallServiceCenter;
