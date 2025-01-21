import aXios from 'axios';
import fs from 'fs';
import CRMApi from './vn/server.api';

/**
 * class for for network client layer
 * @counterDownload handle dispose stack limit request download
 * @counterUpload handle dispose stack limit request upload
 * @class Api
 */

function customLog(...params) {
  if (window.isFileLogger && window.crmcallRenderLog != null) {
    window.crmcallRenderLog.log(...params);
  } else {
    // console.log(...params);
  }
}

class Requestor {
  constructor() {
    this.counterDownload = 0;
    this.counterUpload = 0;
    this.uniqueRequest = {};
    this.axios = this.setupInterceptors();
  }

  isCancel(error) {
    return aXios.isCancel(error);
  }

  /**
   * setup member axios
   *
   * @returns
   * @memberof Api
   */
  setupInterceptors() {
    const api = aXios.create({});
    api.interceptors.request.use(function(config) {
      return new Promise((resolve, reject) => {
        config.timeout = 10000;
        if (!config.headers) {
          config.headers = {};
        }

        config.headers['crm_country'] = window.isKoreaMode ? 'kr' : 'vn';
        let logHeaders = { ...config.headers };
        config.headers['Authorization'] = `Bearer ${CRMApi.jwt}`;

        // Inject more
        switch (config.method) {
          case 'get':
            break;
          case 'post':
            break;
          case 'put':
            // config.headers[
            //   'Content-Type'
            // ] = `application/x-www-form-urlencoded`;
            break;
          default:
            break;
        }
        if (config.url?.includes('sign/auth')) {
          // not log
        } else {
          let body = new URLSearchParams(config.data ?? {}).toString();
          customLog(
            'Before Request >>>',
            config.url,
            ' HEADERS >>> ',
            logHeaders,
            ' BODY >>>',
            body
          );
        }

        resolve(config);
      });
    });

    api.interceptors.response.use(
      function(response) {
        customLog(
          'After Request >>>',
          response.config.url,
          ' Response >>> ',
          response.data
        );
        return Promise.resolve(response);
      },
      function(error) {
        customLog('After Request error >>>', error);
        return Promise.reject(error);
      }
    );
    return api;
  }

  /**
   * Cancel all request
   *
   * @memberof Api
   */
  cancelAllRequest() {
    this.uniqueRequest.forEach(item => {});
  }

  /**
   * Cancel one request
   *
   * @param {*} key
   * @memberof Api
   */
  cancelRequest(key) {
    if (key) {
      if (this.uniqueRequest[key] != null) {
        this.uniqueRequest[key].cancel('Cancel request' + key);
      }
    }
  }

  /**
   *
   * remove one request
   * @param {*} key
   * @memberof Api
   */
  removeTokenRequest(key) {
    if (this.uniqueRequest[key] != null) {
      this.uniqueRequest[key] = null;
    }
  }

  /**
   * Get Mothod
   *
   * @param {*} endPoint
   * @param {*} [payload={}]
   * @param {*} [headers={}]
   * @param {*} uniqueRequest
   * @param {string} [responseType='json']
   * @returns
   * @memberof Api
   */
  async get(
    endPoint,
    payload = {},
    headers = {},
    uniqueRequest,
    responseType = 'json'
  ) {
    const cancelToken = aXios.CancelToken.source();
    this.uniqueRequest[uniqueRequest] = cancelToken;

    try {
      const response = await this.axios({
        method: 'get',
        url: endPoint,
        params: payload,
        headers: headers,
        responseType: responseType,
        cancelToken: cancelToken.token
      });
      this.removeTokenRequest(uniqueRequest);
      return Promise.resolve(response.data);
    } catch (error) {
      this.removeTokenRequest(uniqueRequest);
      return Promise.reject(error);
    }
  }

  /**
   * Post Method
   *
   * @param {*} endPoint
   * @param {*} [payload={}]
   * @param {*} [headers={}]
   * @param {*} uniqueRequest
   * @returns
   * @memberof Api
   */
  async post(endPoint, payload = {}, headers = {}, uniqueRequest) {
    const cancelToken = aXios.CancelToken.source();
    this.uniqueRequest[uniqueRequest] = cancelToken;
    return this.axios({
      method: 'post',
      url: endPoint,
      data: payload,
      cancelToken: cancelToken.token,
      headers: headers
    })
      .then(response => {
        this.removeTokenRequest(uniqueRequest);
        return Promise.resolve(response.data);
      })
      .catch(error => {
        this.removeTokenRequest(uniqueRequest);
        return Promise.reject(error);
      });
  }

  async put(endPoint, payload = {}, headers = {}, uniqueRequest) {
    const cancelToken = aXios.CancelToken.source();
    this.uniqueRequest[uniqueRequest] = cancelToken;
    return this.axios({
      method: 'put',
      url: endPoint,
      data: payload,
      cancelToken: cancelToken.token,
      headers: headers
    })
      .then(response => {
        this.removeTokenRequest(uniqueRequest);
        return Promise.resolve(response.data);
      })
      .catch(error => {
        this.removeTokenRequest(uniqueRequest);
        return Promise.reject(error);
      });
  }

  /**
   * Post Method
   *
   * @param {*} endPoint
   * @param {*} [payload={}]
   * @param {*} [headers={}]
   * @param {*} uniqueRequest
   * @returns
   * @memberof Api
   */
  async postWithPercent(
    endPoint,
    payload = {},
    headers = {},
    uniqueRequest,
    onUploadProgress
  ) {
    const cancelToken = aXios.CancelToken.source();
    this.uniqueRequest[uniqueRequest] = cancelToken;
    return this.axios({
      method: 'post',
      url: endPoint,
      data: payload,
      cancelToken: cancelToken.token,
      headers: headers,
      onUploadProgress: progressEvent => {
        if (onUploadProgress) {
          let percent = (progressEvent.loaded * 100) / progressEvent.total;
          onUploadProgress(percent);
        }
      }
    })
      .then(response => {
        this.removeTokenRequest(uniqueRequest);
        return Promise.resolve(response.data);
      })
      .catch(error => {
        this.removeTokenRequest(uniqueRequest);
        return Promise.reject(error);
      });
  }

  async download(
    endPoint,
    payload = {},
    headers = {},
    uniqueRequest,
    destPath,
    callback
  ) {
    const cancelToken = aXios.CancelToken.source();
    this.uniqueRequest[uniqueRequest] = cancelToken;

    return this.axios({
      method: 'get',
      url: endPoint,
      data: payload,
      cancelToken: cancelToken.token,
      headers: headers,
      responseType: 'arraybuffer',
      onDownloadProgress: progressEvent => {
        if (callback) {
          let percent = (progressEvent.loaded * 100) / progressEvent.total;
          callback({
            percent: percent,
            downloading: true,
            finished: false
          });
        }
      }
    })
      .then(response => {
        if (response.status == 200) {
          try {
            const buffer = Buffer.from(response.data);
            fs.writeFile(destPath, buffer, () => {
              if (callback) {
                callback({
                  percent: 100,
                  downloading: false,
                  finished: true,
                  path: destPath
                });
              }
            });
          } catch (error) {
            throw 'File process fail';
          }
        }
        this.removeTokenRequest(uniqueRequest);
        return Promise.resolve(response.status);
      })
      .catch(error => {
        this.removeTokenRequest(uniqueRequest);
        return Promise.reject(error);
      });
  }
}

const _requestor = new Requestor();
export default _requestor;
