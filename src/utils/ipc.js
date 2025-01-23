import { ipcRenderer } from 'electron';
import * as remote from '@electron/remote';
import {
  COMMON_SYNC_ACTION_FROM_RENDER,
  COMMON_ASYNC_ACTION_FROM_RENDER,
  ACTION_SYNC_SAVE_ACCOUNT_INFO,
  ACTION_SYNC_GET_ACCOUNT_INFO,
  ACTION_SYNC_CLEAR_ACCOUNT_INFO,
  ACTION_SYNC_OPEN_AND_UPDATE_DATA_TO_CALL_WINDOWS,
  ACTION_SYNC_UPDATE_CRM_CALL_DATA_ALL_WINDOWS,
  ACTION_ASYNC_DO_LOGOUT,
  ACTION_REQUEST_QUIT_AND_INSTALL_NEW_APP,
  ACTION_REQUEST_TRANSFER_CALL,
  ACTION_REQUEST_MAKE_CALL,
  ACTION_ASYNC_LOGIN_SUCCESS,
  ACTION_ASYNC_LOGIN_WITH_DOMAIN_ID,
  ACTION_ASYNC_CANCEL_LOGIN,
  ACTION_ASYNC_NETWORK_STATUS_CHANGED,
  ACTION_SYNC_OPEN_EMPTY_CALL_WINDOWS,
  ACTION_SYNC_CLEAR_PASSWORD,
} from '../configs/constant';

export function moveCurrentWindowsToTop() {
  const curWindows = remote.getCurrentWindow();
  if (curWindows) {
    curWindows.show();
    curWindows.moveTop();
    curWindows.focus();
  }
}

export function sendIPCSync(action, data) {
  return ipcRenderer.sendSync(COMMON_SYNC_ACTION_FROM_RENDER, action, data);
}

export function sendIPCAsync(action, data) {
  ipcRenderer.send(COMMON_ASYNC_ACTION_FROM_RENDER, action, data);
}

export function onIpcEvent(event, listener) {
  ipcRenderer.on(event, listener);
}

export function removeAllIpcEvent(event) {
  ipcRenderer.removeAllListeners(event);
}

export function removeIpcEvent(event, listener) {
  ipcRenderer.removeListener(event, listener);
}

export function clearAccount(clearAll) {
  sendIPCSync(ACTION_SYNC_CLEAR_ACCOUNT_INFO, {
    clearAll,
  });
}

export function clearPassword() {
  sendIPCSync(ACTION_SYNC_CLEAR_PASSWORD, {});
}

export function doLogout() {
  sendIPCAsync(ACTION_ASYNC_DO_LOGOUT, {});
}

export function saveDomainUserIDPassword(
  domain,
  userId,
  password,
  extend,
  autoLogin,
  mode_country,
  extraData,
) {
  sendIPCSync(ACTION_SYNC_SAVE_ACCOUNT_INFO, {
    domain,
    userId,
    password,
    extend,
    autoLogin,
    mode_country,
    extraData,
  });
}

export function getDomainUserIDPassword() {
  return sendIPCSync(ACTION_SYNC_GET_ACCOUNT_INFO, null);
}

export function openAndUpdateDataToCallWindows(data) {
  sendIPCSync(ACTION_SYNC_OPEN_AND_UPDATE_DATA_TO_CALL_WINDOWS, data);
}

export function openCallWindows() {
  sendIPCSync(ACTION_SYNC_OPEN_EMPTY_CALL_WINDOWS, null);
}

export function updateCRMCallData(data) {
  sendIPCSync(ACTION_SYNC_UPDATE_CRM_CALL_DATA_ALL_WINDOWS, data);
}

export function broadcastLoginSuccess(data) {
  sendIPCAsync(ACTION_ASYNC_LOGIN_SUCCESS, data);
}

export function requestQuitAndInstallApp() {
  sendIPCAsync(ACTION_REQUEST_QUIT_AND_INSTALL_NEW_APP, null);
}

export function requestTransferCall(data) {
  sendIPCAsync(ACTION_REQUEST_TRANSFER_CALL, data);
}
export function requestMakeCall(data) {
  sendIPCAsync(ACTION_REQUEST_MAKE_CALL, data);
}

export function loginWithDomainUserIDPassword(data) {
  console.log('loginWithDomainUserIDPassword', data);
  sendIPCAsync(ACTION_ASYNC_LOGIN_WITH_DOMAIN_ID, data);
}

export function cancelLogin() {
  sendIPCAsync(ACTION_ASYNC_CANCEL_LOGIN);
}

export function sendNetworkStatus() {
  sendIPCAsync(ACTION_ASYNC_NETWORK_STATUS_CHANGED, {
    status: navigator.onLine ? 'online' : 'offline',
  });
}

export function demoCallKoService() {
  sendIPCAsync('TIENTH_DEMO_CALL_KO_SERVICE', null);
}

export function callCenterEvent(action, data) {
  return ipcRenderer.send('crm_call_center_event', action, data);
}

export function callCenterEventResendCallId(data) {
  return ipcRenderer.sendSync('crm_call_center_event_recent_callid', data);
}
