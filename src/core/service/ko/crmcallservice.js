import parser from 'xml-js';
import axios from 'axios';
import { app, ipcRenderer } from 'electron';
import log from 'electron-log';
import TCPConnection from './tcp-connection';
import TextUtils from '../../utils/text.utils';
import {
  SOCKET_ERROR_CODE,
  ACTION_ERROR_SOCKET_EVENT,
  ACTION_DATA_SOCKET_EVENT,
  ACTION_LOGIN_SOCKET_EVENT,
  EVENT_ID_UPDATE_PHONE_NUMBER,
  EVENT_ID_CALL_EVENT,
  EVENT_ID_USER_INFO,
  EVENT_ID_EXTEND_ONLINE,
  EVENT_ID_LOGOUT_BY_OTHER_DEVICE,
  EVENT_ID_TRANSFER_CALL_RESULT,
  MY_STATUS,
  CALL_EVENT,
  CALL_DIRECTION,
} from '../../../configs/constant';
import * as CRMPacket from './xml/crmpacket';

var safeRetryLiveTimeout = 0;
var ForwardCallInfo = {};

export class CRMCallServiceCenter {
  constructor({ appEmit }) {
    this.mainAppEmit = appEmit;
    this.lastLoginTime = 0;
    this.iamLogout = false;
    this.connecting = false;
    this.isAuthenticated = false;
    this.tcpSocket = null;
    this.liveTimer = null;
    this.cancelTokenDNSSource = null;

    this.loginResultObject = null;

    this.currentMyStatus = MY_STATUS.NONE;

    this.lastCallInboundObj = null;
    this.lastCallOutboundObj = null;

    this._initServerInfo();

    this.numberOfRetry = 0;
    this.safeRetryRelogin = 0;

    this.timeoutRelogin = null;

    this.timeoutPingList = [];

    this.isInLoginPage = true;
  }

  updateLoginResultObject(obj) {
    this.loginResultObject = obj;
  }

  addPingTimeout() {
    const pingDelay = 10 * 1000;
    const maxRetry = 3;
    const timer = setTimeout(() => {
      if (safeRetryLiveTimeout >= maxRetry) {
        safeRetryLiveTimeout = 0;
        this.logoutWithStatus({ code: 3, msg: 'Server restart' });
        return;
      }
      safeRetryLiveTimeout++;
      this.disconnectService();
      this.reconnectService(false);
    }, pingDelay);
    this.timeoutPingList.push(timer);
  }

  parserXMLResponsePackageDemo(xmlString) {
    const raw = xmlString.toString('utf8').trim();
    console.log('DKM >>>> DEMO DATA', xmlString);
    this._parserXMLAllAPI(raw);
  }

  removeEarlyPingTimeout() {
    const timer = this.timeoutPingList.shift();
    clearTimeout(timer);
  }

  stopAllPingTimeoutList() {
    this.timeoutPingList.forEach((timer) => {
      clearTimeout(timer);
    });
    this.timeoutPingList = [];
  }

  _resetNumberRetry() {
    this.numberOfRetry = 0;
  }

  _initServerInfo() {
    this.serverInfo = {
      ip: null,
      port: 0,
      useHttps: false,
      aLiveTime: 30,
      saveLogger: false,
    };
  }

  _broadcastListener(action, data) {
    // app.emit('crm_call_center_event', action, data);
    this.mainAppEmit('crm_call_center_event', action, data);
  }

  _broadcastListenerToRecentCallWindows(data) {
    // app.emit('crm_call_center_event_recent_callid', data);
    this.mainAppEmit('crm_call_center_event_recent_callid', data);
  }

  disconnectService() {
    this.iamLogout = false;
    if (this.cancelTokenDNSSource) {
      this.cancelTokenDNSSource.cancel();
      this.cancelTokenDNSSource = null;
    }

    this.isConnecting = false;
    this.isAuthenticated = false;
    if (this.tcpSocket) {
      this.tcpSocket.disconnectSocket(true);
      this.tcpSocket = null;
    }

    this.stopLiveTimer();
    this.stopAllPingTimeoutList();
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
      TextUtils.isEmpty(this.loginResultObject.jwt)
    ) {
      console.log('WHY GO HERE');
      this.safeRetryRelogin = 0;
      this.logoutWithStatus({
        code: 2,
        msg: 'The server restarted or an internal error occurred',
      });
      return;
    }

    const diffTime = Date.now() - this.lastLoginTime;
    if (this.safeRetryRelogin >= 100 || diffTime < 3000) {
      this.safeRetryRelogin = 0;
      this.logoutWithStatus({
        code: 2,
        msg: 'The server restarted or an internal error occurred',
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
        timeout,
      );
      this.safeRetryRelogin++;
      this.numberOfRetry++;
      this.isConnecting = true;
      this._startCRMCenter(false, false, null, null);
    }, timeout);
  }

  logout(callBack) {
    this.logoutWithStatus({ code: 0 }, callBack);
  }

  logoutWithStatus(status, callback) {
    this._resetNumberRetry();
    if (this.isAuthenticated) {
      this.iamLogout = true;
      this.tcpSocket.sendPacket(new CRMPacket.LogoutPacket());
      this.isAuthenticated = false;
      setTimeout(() => {
        this.disconnectService();

        this.loginResultObject = null;
        this._broadcastListener(ACTION_DATA_SOCKET_EVENT, {
          eventId: EVENT_ID_LOGOUT_BY_OTHER_DEVICE,
          status: status,
        });
        if (callback) {
          callback();
        }
      }, 500);
    } else {
      this.disconnectService();

      this.loginResultObject = null;
      this._broadcastListener(ACTION_DATA_SOCKET_EVENT, {
        eventId: EVENT_ID_LOGOUT_BY_OTHER_DEVICE,
        status: status,
      });
      if (callback) {
        callback();
      }
    }
  }

  _setupLog() {
    log.transports.file.level = 'info';
    log.transports.file.fileName = `${this.domain}.log`;
    log.transports.file.maxSize = 5242880;
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
    extra_info,
  ) {
    this.iamLogout = false;
    this.loginResultObject = null;
    safeRetryLiveTimeout = 0;
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
    this.tcpSocket = new TCPConnection();
    this.tcpSocket.saveLogger = this.serverInfo.saveLogger;
    global.ShareGlobalObject.isFileLogger = this.serverInfo.saveLogger;
    this.tcpSocket.connectWithIpPort(this.serverInfo.ip, this.serverInfo.port, {
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
            userID: this.userId,
          });
        } else {
          loginPacket = new CRMPacket.ReLoginPacket({
            otp: otpCode,
            domain: this.domain,
            password: this.password,
            extend: this.extendNumber,
            cookies: extra_info?.cookies,
            jwt: extra_info?.jwt,
            hmail: extra_info?.hmail,
            session: extra_info?.session,
            userID: this.userId,
          });
        }

        this.tcpSocket.sendPacket(loginPacket);
      },
      socketDisconnectWithError: (error) => {
        if (!this.loginResultObject) {
          this.disconnectService();
          this._broadcastListener(ACTION_ERROR_SOCKET_EVENT, {
            code: SOCKET_ERROR_CODE.customError,
            errorMessage:
              'An error occurred during login. Please try again later',
          });
        } else {
          this.disconnectService();
          this.reconnectService(false);
        }
      },
      onReceivedPacket: (xmlString) => {
        const raw = xmlString.toString('utf8').trim();
        this._parserXMLAllAPI(raw);
      },
    });
  }

  _parserXMLAllAPI(xmlString) {
    try {
      const jsonData = parser.xml2js(xmlString, { compact: false });
      const childXML = jsonData.elements[0].elements;
      childXML.forEach((element) => {
        if (element.name == 'USER') {
          const childUser = element.elements;
          XMLProcess.processUser(this, childUser);
        } else if (element.name == 'SIP') {
          const childSip = element.elements;
          XMLProcess.processSip(this, childSip);
        } else if (element.name == 'ALARM') {
          const childAlarm = element.elements;
          if (childAlarm) {
            XMLProcess.processAlarm(this, childAlarm);
          }
        } else if (element.name == 'TRANSFERNUMBER') {
          let response = {};
          response.apiID = 'TRANSFERNUMBER';
          const attrs = element.attributes;
          let data = {};
          if (attrs) {
            data = {
              cur: attrs['CUR'] ?? '',
              next: attrs['NEXT'] ?? '',
              number: attrs['NUMBER'] ?? '',
              callid: attrs['CALLID'],
            };
          }
          response.data = data;
          if (data.callid) {
            PacketListener.onReceivedTransferNumberPacket(this, response);
          }
        }
      });
    } catch (err) {
      this.disconnectService();
      this._broadcastListener(ACTION_ERROR_SOCKET_EVENT, {
        code: SOCKET_ERROR_CODE.customError,
        errorMessage: err,
      });
    }
  }

  _startCRMCenter(isLogin, serverXmlRequest, otpCode, extra_info) {
    if (serverXmlRequest) {
      console.log('start request server.xml');
      this._resolveDNSFromHost('http://', this.domain, (response, error) => {
        if (error != null) {
          console.log('error request server.xml', error);
          this._broadcastListener(ACTION_LOGIN_SOCKET_EVENT, {
            code: SOCKET_ERROR_CODE.dns_error,
            errorMessage: error,
          });
        } else {
          if (this._processDNSXML(response.data)) {
            console.log('start connect socket');
            this._connectWebsocketClient(isLogin, otpCode, extra_info);
          } else {
            console.log('error process server.xml');
            this._broadcastListener(ACTION_LOGIN_SOCKET_EVENT, {
              code: SOCKET_ERROR_CODE.dns_error,
              errorMessage: error,
            });
          }
        }
      });
    } else {
      console.log('start connect socket');
      this._connectWebsocketClient(isLogin, otpCode, extra_info);
    }
  }

  _processDNSXML(dataResponse) {
    try {
      this._initServerInfo();
      const jsonData = parser.xml2js(dataResponse, { compact: false });

      const childXML = jsonData.elements[0].elements;
      childXML.forEach((element) => {
        if (element.name == 'SERVERINFO') {
          const attrs = element.attributes;
          if (attrs) {
            this.serverInfo.ip = attrs['IP'] ?? '';
            this.serverInfo.port = attrs['PORT'] ?? 0;
          }
        } else if (element.name == 'USEHTTPS') {
          if (element.elements) {
            this.serverInfo.useHttps = element.elements[0].text ?? 0;
          }
        } else if (element.name == 'ALIVETIME') {
          if (element.elements) {
            this.serverInfo.aLiveTime = element.elements[0].text ?? 30;
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
    var url =
      scheme + domain + '/winapp/hcsong/crmcall/' + domain + '/server.xml';
    console.log('start request:' + url);
    try {
      const CancelToken = axios.CancelToken;
      this.cancelTokenDNSSource = CancelToken.source();
      const response = await axios.get(url, {
        timeout: 10000,
        cancelToken: this.cancelTokenDNSSource.token,
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

  sendLivePacket() {
    if (this.isAuthenticated) {
      this.addPingTimeout();
      this.tcpSocket.sendPacket(new CRMPacket.LivePacket(this.extendNumber));
      this.sendGetStatuses();
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

  sendGetUserInfo({ callId, phone, status }) {
    if (this.isAuthenticated) {
      this.tcpSocket.sendPacket(
        new CRMPacket.GetUserInfoPacket(callId, phone, status),
      );
    }
  }

  sendGetStatuses() {
    if (this.isAuthenticated) {
      this.tcpSocket.sendPacket(new CRMPacket.StatusesPacket());
    }
  }

  sendTranferNumberWithPhone({ from, to, phone, callid }) {
    if (this.isAuthenticated) {
      this.tcpSocket.sendPacket(
        new CRMPacket.TransferNumberPacket(from, to, phone, callid),
      );
    }
  }

  sendMakeCall({ userKey, phone }) {
    if (this.isAuthenticated) {
      this.tcpSocket.sendPacket(
        new CRMPacket.TransferCallPacket(userKey, phone),
      );
    }
  }
}

const XMLProcess = {
  processUser(crmcallService, rootElement) {
    let response = {};
    rootElement.forEach((element) => {
      if (element.name == 'LOGIN') {
        response.apiID = 'LOGIN';
        const attrs = element.attributes;
        let login = null;
        let statusCode = attrs['RESULT'] ?? 0;
        if (statusCode != 1) {
          let errorMessage = 'Unknown error';
          if (statusCode == 2) {
            errorMessage = 'Incorrect password';
          } else if (statusCode == 3) {
            errorMessage = 'Access denied';
          }
          login = {
            result: statusCode,
            errorMessage: errorMessage,
          };
        } else {
          login = {
            result: statusCode,
            data: {
              baseurl: attrs['BASEURL'] ?? '',
              cacheproduct: attrs['CACHE_PRODUCT'] ?? 0,
              cachepurpose: attrs['CACHE_PURPOSE'] ?? 0,
              companyphone: attrs['COMPANYPHONE'] ?? '',
              email: attrs['EMAIL'] ?? '',
              id: attrs['ID'] ?? '',
              localphone: attrs['LOCALPHONE'] ?? '',
              loginkey: attrs['LOGINKEY'] ?? '',
              mobilephone: attrs['MOBILEPHONE'] ?? '',
              nickname: attrs['NICKNAME'] ?? '',
              registeredphonetime: attrs['REGISTERED_PHONE_TIME'] ?? 0,
              sex: attrs['SEX'] ?? '1',
              telephone: attrs['TELEPHONE'] ?? '',
              userkey: attrs['USERKEY'] ?? '',
              username: attrs['USERNAME'] ?? '',
            },
          };
        }
        response.login = login;
      } else if (element.name == 'LOGOUT') {
        response.apiID = 'LOGOUT';
      } else if (element.name == 'USERINFO') {
        response.apiID = 'USERINFO';
        const attrs = element.attributes;
        let data = {};
        if (attrs) {
          let strPhoneType = attrs['PHONETYPE'] ?? '';
          strPhoneType = strPhoneType.substring(0, 1) ?? '1';
          data = {
            category: attrs['CATEGORY'] ?? '',
            cn: attrs['CN'] ?? '',
            code: attrs['CODE'] ?? '',
            id: attrs['ID'] ?? '',
            name: attrs['NAME'],
            parentcn: attrs['PARENT_CN'] ?? '',
            parentcode: attrs['PARENT_CODE'] ?? '',
            parentname: attrs['PARENT_NAME'] ?? '',
            phone: attrs['PHONE'] ?? '',
            phonetype: strPhoneType,
            rating: attrs['RATING'] ?? '',
            type: attrs['TYPE'] ?? '',
            customerid: attrs['CUSTOMER_ID'] ?? '',
          };

          if (
            TextUtils.isEmpty(data.cn) &&
            TextUtils.isEmpty(data.code) &&
            TextUtils.isEmpty(data.parentname) &&
            TextUtils.isEmpty(data.name)
          ) {
            //cheat code
            data.name = 'Guest';
            data.parentname = 'Guest';
          }
        }

        const staffElements = element.elements;
        let staffs = [];
        if (staffElements) {
          staffElements.forEach((staffElement) => {
            if (staffElement.name == 'STAFF') {
              const attrs = staffElement.attributes;
              if (attrs) {
                staffs.push({
                  staff_user_name: attrs['STAFF_NAME'],
                  staff_cn: attrs['STAFF_CN'],
                  staff_no: attrs['STAFF_NO'],
                });
              }
            }
          });
        }

        data.staffs = staffs;
        response.data = data;
      } else if (element.name == 'STATUSES') {
        response.apiID = 'STATUSES';
        let statusList = [];
        if (element) {
          const statusElement = element.elements;
          if (statusElement) {
            statusElement.forEach((status) => {
              if (status.name == 'STATUS') {
                const attrs = status.attributes;
                if (attrs) {
                  const mode = attrs['MODE'] ?? '';
                  if (mode == '' || mode == 0) {
                    let no = attrs['NO'] ?? '';
                    no = parseInt(no.substring(3));
                    statusList.push({
                      extend: attrs['EXT'],
                      staff_no: no,
                    });
                  }
                }
              }
            });
          }
        }
        response.data = statusList;
      }
    });

    if (response.apiID == 'LOGIN') {
      PacketListener.onReceivedLoginPacket(crmcallService, response);
    } else if (response.apiID == 'LOGOUT') {
      PacketListener.onReceivedLogoutPacket(crmcallService, response);
    } else if (response.apiID == 'USERINFO') {
      PacketListener.onReceivedUserInfoPacket(crmcallService, response);
    } else if (response.apiID == 'STATUSES') {
      PacketListener.onReceivedExtendOnlinePacket(crmcallService, response);
    }
  },
  processSip(crmcallService, rootElement) {
    let response = {};
    rootElement.forEach((element) => {
      if (element.name == 'SIPLOGIN') {
        response.apiID = 'SIPLOGIN';
        const attrs = element.attributes;
        let data = {
          result: 0,
          errorMessage: 'Sip Login Failed',
        };
        if (attrs) {
          data.result = attrs['RESULT'] ?? 0;
        }
        response.data = data;
      } else if (element.name == 'CALLSTATUS') {
        response.apiID = 'CALLSTATUS';
        const attrs = element.attributes;
        let data = null;
        if (attrs) {
          data = {
            direction: attrs['DIRECTION'] ?? 'INBOUND',
            event: attrs['EVENT'] ?? '',
            callid: attrs['CALLID'] ?? '',
            time: TextUtils.timeFromTimeStampSafe(attrs['TIME'] ?? ''),
            from: attrs['FROM'] ?? '',
            to: attrs['TO'] ?? '',
            pickupid: attrs['PICKUPID'] ?? '',
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
            callid: attrs['CALLID'] ?? '',
          };
        }
        response.data = data;
      }
    });

    if (response.apiID == 'SIPLOGIN') {
      PacketListener.onReceivedSipLoginPacket(crmcallService, response);
    } else if (response.apiID == 'CALLSTATUS') {
      PacketListener.onReceivedCallStatusPacket(crmcallService, response);
    } else if (response.apiID == 'TRANSFER_RESULT') {
      PacketListener.onReceivedTransferResultPacket(crmcallService, response);
    }
  },
  processAlarm(crmcallService, rootElement) {
    let response = {};
    rootElement.forEach((element) => {
      if (element.name == 'LIVE') {
        response.apiID = 'LIVE';
        const attrs = element.attributes;
        let data = {};
        if (attrs) {
          data.result = attrs['RESULT'] ?? 0;
          data.rnumber = attrs['RNUMBER'] ?? 0;
        }
        response.data = data;
      } else if (element.name == 'TRANSFERNUMBER') {
        response.apiID = 'TRANSFERNUMBER';
        const attrs = element.attributes;
        let data = {};
        if (attrs) {
          data = {
            cur: attrs['CUR'] ?? '',
            next: attrs['NEXT'] ?? '',
            number: attrs['NUMBER'] ?? '',
            callid: attrs['CALLID'],
          };
        }
        response.data = data;
      }
    });

    if (response.apiID == 'LIVE') {
      PacketListener.onReceivedLivePacket(crmcallService, response);
    } else if (response.apiID == 'TRANSFERNUMBER') {
      PacketListener.onReceivedTransferNumberPacket(crmcallService, response);
    }
  },
};

const PacketListener = {
  onReceivedSipLoginPacket(crmcallService, response) {
    if (response.data.result != 1) {
      crmcallService.disconnectService();
      crmcallService._broadcastListener(ACTION_LOGIN_SOCKET_EVENT, {
        code: SOCKET_ERROR_CODE.customError,
        errorMessage: response.data.errorMessage,
      });
    }
  },
  onReceivedLoginPacket(crmcallService, response) {
    if (response.login.result == 1) {
      let newData = {
        ...crmcallService.loginResultObject,
        ...response.login.data,
      };
      //login success
      crmcallService.lastLoginTime = Date.now();
      crmcallServiceCenter._resetNumberRetry();
      crmcallService._broadcastListener(ACTION_LOGIN_SOCKET_EVENT, {
        code: SOCKET_ERROR_CODE.login_success,
        data: {
          domain: crmcallService.domain,
          userId: crmcallService.userId,
          password: crmcallService.password,
          extendNumber: crmcallService.extendNumber,
          result: newData,
        },
      });
      crmcallService.isAuthenticated = true;
      crmcallService.loginResultObject = newData;
      crmcallService.sendLivePacketTimer();
    } else {
      crmcallService.disconnectService();
      crmcallService._broadcastListener(ACTION_LOGIN_SOCKET_EVENT, {
        code: SOCKET_ERROR_CODE.customError,
        errorMessage: response.login.errorMessage,
      });
    }
  },
  onReceivedLivePacket(crmcallService, response) {
    safeRetryLiveTimeout = 0;
    crmcallService.removeEarlyPingTimeout();
  },
  onReceivedLogoutPacket(crmcallService, response) {
    if (crmcallService.iamLogout) {
      return;
    }
    crmcallServiceCenter.logoutWithStatus({
      code: 1,
      msg: 'You have already logged in with another device',
    });
  },
  onReceivedExtendOnlinePacket(crmcallService, response) {
    if (TextUtils.isNotEmpty(response.data)) {
      crmcallService._broadcastListener(ACTION_DATA_SOCKET_EVENT, {
        eventId: EVENT_ID_EXTEND_ONLINE,
        data: response.data,
      });
    }
  },
  onReceivedCallStatusPacket(crmcallService, response) {
    if (response.data) {
      let ignoreCallEvent = false;
      const callData = response.data;
      if (callData.event == CALL_EVENT.INVITE) {
        if (crmcallService.currentMyStatus == MY_STATUS.NONE) {
          crmcallService.currentMyStatus = MY_STATUS.RINGING;
          crmcallService.sendGetUserInfo({
            callId: callData.callid,
            phone:
              callData.direction == CALL_DIRECTION.INBOUND
                ? callData.from
                : callData.to,
            status: crmcallService.currentMyStatus,
          });
          if (callData.direction == CALL_DIRECTION.INBOUND) {
            crmcallService.lastCallInboundObj = callData;
          } else {
            crmcallService.lastCallOutboundObj = callData;
          }
        } else {
          ignoreCallEvent = true;
        }
      } else if (callData.event == CALL_EVENT.INVITE_RESULT) {
        crmcallService.currentMyStatus = MY_STATUS.BUSY;
      } else if (callData.event == CALL_EVENT.BUSY) {
        if (crmcallService.currentMyStatus == MY_STATUS.RINGING) {
          crmcallService.currentMyStatus = MY_STATUS.NONE;
        } else {
          ignoreCallEvent = true;
        }
      } else {
        crmcallService.currentMyStatus = MY_STATUS.NONE;
      }

      console.log(
        'crmcallService.lastCallInboundObj',
        crmcallService.lastCallInboundObj,
      );
      console.log(
        'crmcallService.lastCallOutboundObj',
        crmcallService.lastCallOutboundObj,
      );

      console.log('send transfer call 11111sssss...................');
      ///////////////////// kyung_sub : transfer call ///////////////////////
      // INBOUND 에서 ForwardCallInfo 저장  OUTBOUND에서 NEXT만 가져온다.
      if (
        callData.direction == CALL_DIRECTION.INBOUND &&
        callData.event != CALL_EVENT.BYE
      ) {
        // ForwareCallInfo  save janeral data

        ForwardCallInfo['number'] = callData.from;
        ForwardCallInfo['callId'] = callData.callid;

        ForwardCallInfo['invite_result'] = '0';
        ForwardCallInfo['setoutbound'] = '0';
      }

      if (
        callData.direction == CALL_DIRECTION.INBOUND &&
        callData.event == CALL_EVENT.INVITE_RESULT
      ) {
        ForwardCallInfo['invite_result'] = '1';
      }

      if (
        callData.direction == CALL_DIRECTION.OUTBOUND &&
        callData.event == CALL_EVENT.INVITE_RESULT
      ) {
        ForwardCallInfo['agentID'] = callData.to;
        ForwardCallInfo['setoutbound'] = '1';
      }

      if (callData.event == CALL_EVENT.BYE) {
        ///send transfer call
        if (
          ForwardCallInfo['invite_result'] == '1' &&
          ForwardCallInfo['setoutbound'] == '1'
        ) {
          console.log('send transfer call ....................');
          crmcallService.sendTranferNumberWithPhone({
            from: callData.to,
            to: ForwardCallInfo['agentID'],
            phone: (ForwardCallInfo['number'] = callData.from),
            callid: ForwardCallInfo['callId'],
          });
        }

        ForwardCallInfo = {};
      }
      //////////////////////////////////////////////////////////////////

      /*
      if (
        (callData.event == CALL_EVENT.BYE ||
          callData.event == CALL_EVENT.CANCEL) &&
        callData.direction == CALL_DIRECTION.INBOUND &&
        crmcallService.lastCallOutboundObj &&
        callData.callid == crmcallService.lastCallOutboundObj.callid &&
        crmcallService.lastCallInboundObj &&
        TextUtils.isNotEmpty(crmcallService.lastCallInboundObj.callid)
      ) {
        crmcallService.sendTranferNumberWithPhone({
          from: crmcallService.extendNumber,
          to: callData.from,
          phone: crmcallService.lastCallInboundObj.from,
          callid: crmcallService.lastCallInboundObj.callid
        });
      }
        */
      if (ignoreCallEvent == false) {
        crmcallService._broadcastListener(ACTION_DATA_SOCKET_EVENT, {
          eventId: EVENT_ID_CALL_EVENT,
          data: callData,
        });
      }
    }
  },
  onReceivedTransferResultPacket(crmcallService, response) {
    if (response.data) {
      crmcallService._broadcastListener(ACTION_DATA_SOCKET_EVENT, {
        eventId: EVENT_ID_TRANSFER_CALL_RESULT,
        data: response.data,
      });
    }
  },

  onReceivedTransferNumberPacket(crmcallService, response) {
    const data = response.data;
    if (data && data.callid) {
      //Change caller id in next event
      // crmcallService.sendGetUserInfo({
      //   callId: data.callid,
      //   phone: data.number,
      //   status: crmcallService.currentMyStatus
      // });
      crmcallService._broadcastListenerToRecentCallWindows({
        eventId: EVENT_ID_UPDATE_PHONE_NUMBER,
        data: data,
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
        data: response.data,
      });
    }
  },
};

// const crmcallServiceCenter = new CRMCallServiceCenter();
// export default crmcallServiceCenter;
