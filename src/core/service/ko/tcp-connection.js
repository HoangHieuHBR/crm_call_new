import net from 'net';
import crypto from 'crypto';
import JSZip from 'jszip';
import log from 'electron-log';
import * as aes from '../../utils/aes';
import Packet from './xml/packet';
const HEADER_MSG_LENGTH_SIZE = 5;
const TAG = 'CRM_CALL';
const myLogger = {
  // log(...msg) {
  //   electronLog.log(TAG + '', ...msg);
  // },
  // logTag(tag, ...msg) {
  //   electronLog.log(tag + ':', ...msg);
  // }

  log(...msg) {
    log.log(TAG + '', ...msg);
    // console.log(TAG + '', ...msg);
  },
  logTag(tag, ...msg) {
    log.log(tag + '', ...msg);
    // console.log(tag + ':', ...msg);
  }
};

class TCPConnection {
  constructor() {
    this.saveLogger = false;
    this.connecting = false;
    this.abort = false;
    this.socket = null;
    this.userCloseSocket = false;

    this.readTimeoutTimer = null;

    this.packageSizeLength = -1;
    this.packageBuffer = null;
    this.socketCallBack = null;
    this.isLogin = true;
  }

  customLog(tag, ...msg) {
    if (this.saveLogger) {
      log.log(tag, msg);
    } else {
      console.log(tag, msg);
    }
  }

  startReadTimeoutTimer() {
    const readTimeout = 30000;
    this.stopReadTimeoutTimer();
    this.readTimeoutTimer = setTimeout(() => {
      this.customLog(TAG, 'read timeout ');
      if (!this.userCloseSocket) {
        this.socketCallBack.socketDisconnectWithError('read timeout');
      }
      this.disconnectSocket(true);
    }, readTimeout);
  }

  stopReadTimeoutTimer() {
    if (this.readTimeoutTimer) {
      clearTimeout(this.readTimeoutTimer);
      this.readTimeoutTimer = null;
    }
  }

  connectWithIpPort(ip, port, callback) {
    this.socketCallBack = callback;
    if (this.connecting) {
      return;
    }
    this.connecting = true;
    this.abort = false;
    this.userCloseSocket = false;

    this.ip = ip;
    this.port = port;

    this.socket = new net.Socket();
    this.socket.setTimeout(30000);
    this.timer = setTimeout(() => {
      this.customLog(TAG, 'connected timeout ');
      if (!this.userCloseSocket) {
        this.socketCallBack.socketDisconnectWithError('connected timeout ');
      }
      this.disconnectSocket(true);
    }, 30000);

    this.socket.connect(port, ip, () => {
      this._clearTimeoutTimer();
      this.packageSizeLength = -1;
      this.packageBuffer = null;
      this.socketCallBack.socketConnected();
      this.startReadTimeoutTimer();
    });

    this.socket.on('onePackageBuffer', onePackageBuffer => {
      this.startReadTimeoutTimer();
      try {
        let payload = onePackageBuffer.slice(
          HEADER_MSG_LENGTH_SIZE,
          onePackageBuffer.length
        );
        //plain package

        this._decryptData(payload)
          .then(xml => {
            this.customLog('RECEIVED: ', 'plain', xml);
            this.socketCallBack.onReceivedPacket(xml);
          })
          .catch(error => {
            this.customLog('error', error);
            this.socketCallBack.socketDisconnectWithError(error);
            this.disconnectSocket(true);
          });
      } catch (error) {
        this.customLog('error: ', error);
      }
    });

    this.socket.on('data', data => {
      if (this.abort) {
        return;
      }

      if (!data || data.length <= 0) {
        this._clearTimeoutTimer();
        if (!this.userCloseSocket) {
          this.socketCallBack.socketDisconnectWithError(
            'data null or data length zero'
          );
        }

        console.log('WTF');
        this.disconnectSocket(true);
        return;
      }

      // append data to buffer
      if (this.packageBuffer == null) {
        this.packageBuffer = data;
      } else {
        this.packageBuffer = Buffer.concat([this.packageBuffer, data]);
      }

      if (this.packageBuffer.length < this.packageSizeLength) {
        return;
      }

      var done = false;
      while (!done && !this.abort) {
        if (this.packageBuffer.length < HEADER_MSG_LENGTH_SIZE) {
          return;
        }

        var payloadSizeBuff = this.packageBuffer.slice(
          0,
          HEADER_MSG_LENGTH_SIZE
        );

        const payloadSize = parseInt(payloadSizeBuff.toString());

        if (payloadSize < 0) {
          this._clearTimeoutTimer();
          if (!this.userCloseSocket) {
            this.socketCallBack.socketDisconnectWithError('payload size < 0');
          }
          this.disconnectSocket(true);
          return;
        }

        this.packageSizeLength = payloadSize + HEADER_MSG_LENGTH_SIZE;

        if (this.packageBuffer.length < this.packageSizeLength) {
          return;
        }

        const onePackageBuffer = this.packageBuffer.slice(
          0,
          this.packageSizeLength
        );

        this.socket.emit('onePackageBuffer', onePackageBuffer);

        this.packageBuffer = this.packageBuffer.slice(this.packageSizeLength);
        this.packageSizeLength = -1;
      }
    });

    this.socket.on('error', error => {
      this.customLog(
        'disconnected socket with error ',
        error,
        'user closed ',
        this.userCloseSocket
      );
      this._clearTimeoutTimer();
      if (!this.userCloseSocket) {
        this.socketCallBack.socketDisconnectWithError(error);
      }
      this.disconnectSocket(true);
    });

    this.socket.on('timeout', () => {
      this.customLog(TAG, 'timeout read write socket event');
      this._clearTimeoutTimer();

      if (!this.userCloseSocket) {
        this.socketCallBack.socketDisconnectWithError(
          'timeout read write socket event'
        );
      }
      this.disconnectSocket(true);
    });

    this.socket.on('end', () => {
      this.customLog(TAG, 'socket end');
      this._clearTimeoutTimer();
      if (!this.userCloseSocket) {
        this.socketCallBack.socketDisconnectWithError('Socket end');
      }
      this.disconnectSocket(true);
    });

    this.socket.on('close', () => {
      this.customLog(
        'disconnected socket with user closed ',
        this.userCloseSocket
      );
      this._clearTimeoutTimer();

      if (!this.userCloseSocket) {
        this.socketCallBack.socketDisconnectWithError('Unknown');
      }
      this.disconnectSocket(true);
    });
  }

  _clearTimeoutTimer() {
    if (this.timer != null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  disconnectSocket(userClose) {
    this.connecting = false;
    this.abort = true;
    this._clearTimeoutTimer();
    this.stopReadTimeoutTimer();
    this.userCloseSocket = userClose;
    if (this.socket && !this.socket.destroyed) {
      this.socket.destroy();
    }
  }

  sendPacket(packet) {
    if (this.abort) {
      return;
    }
    const xmlData = packet.xmlData();
    this.customLog('SEND: ', xmlData);
    let encryptData = this._encryptData(xmlData);
    this.socket.write(encryptData);
  }

  _encryptData(data) {
    return aes.encrypt(data);
  }

  _decryptData(data) {
    return aes.decryptWithFlag(data);
  }

  _getPayloadType(data) {
    if (data.length < HEADER_MSG_LENGTH_SIZE) {
      return '';
    }
    return '<XML>';
  }
}
export default TCPConnection;
