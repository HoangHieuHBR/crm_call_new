import io from 'socket.io-client';
import log from 'electron-log';
import * as aes from '../../../core/utils/aes';
import Packet from '../../../core/service/vn/xml/packet';
const WEBSOCKET_SCHEMES = 'http'; //https
const TAG = 'CRM_CALL';
export default class HanSocket {
  constructor() {
    this.saveLogger = false;
    this.connecting = false;
    this.abort = false;
    this.socket = null;
    this.userCloseSocket = false;

    this.packageSizeLength = -1;
    this.packageBuffer = null;
    this.socketCallBack = null;
    this.connectWithIpPort = this.connectWithIpPort.bind(this);
    this.disconnectSocket = this.disconnectSocket.bind(this);
  }

  customLog(tag, ...msg) {
    if (this.saveLogger) {
      log.log(tag, msg);
    } else {
      console.log(tag, msg);
    }
  }

  connectWithIpPort(ip, port, callback) {
    this.socketCallBack = callback;
    this.connecting = true;
    this.abort = false;
    this.isUserCloseConnect = false;
    const url = `${WEBSOCKET_SCHEMES}://${ip}:${port}`;
    console.log('start connect web socket with url ', url);
    this.socket = io(url, {});

    const _connectTimer = setTimeout(() => {
      if (!this.isUserCloseConnect) {
        this.socketCallBack.socketDisconnectWithError('timeout');
      }
      this.disconnectSocket(true);
    }, 5000);

    this.socket.on('connect', () => {
      this.customLog(TAG, 'connected');
      clearTimeout(_connectTimer);
      this.socketCallBack.socketConnected();
    });

    this.socket.on('data', data => {
      if (this.abort) {
        return;
      }

      if (!data) {
        return;
      }

      this._decryptData(data)
        .then(xml => {
          this.customLog('RECEIVED: ', xml);
          this.socketCallBack.onReceivedPacket(xml);
        })
        .catch(error => {
          this.socketCallBack.socketDisconnectWithError(error);
          this.disconnectSocket(true);
        });
    });

    this.socket.on('connect_error', err => {
      this.customLog('connect_error', this.isUserCloseConnect, err);
      if (!this.isUserCloseConnect) {
        this.socketCallBack.socketDisconnectWithError(err);
      }
    });

    this.socket.on('connect_timeout', () => {
      this.customLog(TAG, 'connect_timeout');
      if (!this.isUserCloseConnect) {
        this.socketCallBack.socketDisconnectWithError('');
      }
    });

    this.socket.on('reconnect_error', err => {
      this.customLog('reconnect_error', err);
      if (!this.isUserCloseConnect) {
        this.socketCallBack.socketDisconnectWithError(err);
      }
    });

    this.socket.on('reconnect_failed', () => {
      this.customLog(TAG, 'reconnect_failed');
      if (!this.isUserCloseConnect) {
        this.socketCallBack.socketDisconnectWithError('');
      }
    });

    this.socket.on('disconnect', (reason, reason1) => {
      this.customLog('disconnect:', reason, reason1);
      if (!this.isUserCloseConnect) {
        this.socketCallBack.socketDisconnectWithError(reason);
      }
    });

    this.socket.on('error', error => {
      this.customLog('error: ', error);
      if (!this.isUserCloseConnect) {
        this.socketCallBack.socketDisconnectWithError(error);
      }
    });
  }

  disconnectSocket(isUserClose) {
    this.connecting = false;
    this.abort = true;
    this.isUserCloseConnect = isUserClose;
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }



  _encryptData(data) {
    return aes.encrypt(data);
  }

  _decryptData(data) {
    return aes.decrypt(data);
  }

  sendPacket(packet) {
    if (this.socket) {
      const xml = packet.xmlData();
      this.customLog('SEND: ', xml);
      this.socket.emit('message', this._encryptData(xml));
    }
  }
}
