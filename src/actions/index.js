import * as actionTypes from './actionTypes';

export function requestNavigateHomePage(
  modeCountry,
  user = {},
  extraInfo = {},
  authentication = true
) {
  console.log('requestNavigateHomePage', user, extraInfo, authentication);
  return {
    type: actionTypes.NAVIGATE_HOME_PAGE,
    user,
    extraInfo,
    authentication,
    modeCountry
  };
}

export function requestNavigateLoginPage(extraInfo) {
  return {
    type: actionTypes.NAVIGATE_LOGIN_PAGE,
    user: {},
    extraInfo: extraInfo,
    authentication: false
  };
}

// SETTING ACCTION

export function onChangeFont(font) {
  return {
    type: actionTypes.CHANGE_FONT_STYLE,
    font
  };
}

export function onChangeFontSize(fontSize) {
  return {
    type: actionTypes.CHANGE_FONT_SIZE,
    fontSize
  };
}

export function changePrimaryTheme(primaryTheme) {
  return {
    type: actionTypes.CHANGE_PRIMARY_THEME,
    primaryTheme
  };
}

export function changeSecondaryTheme(secondaryTheme) {
  return {
    type: actionTypes.CHANGE_SECONDARY_THEME,
    secondaryTheme
  };
}

export function changeDarkTheme(darkmode) {
  return {
    type: actionTypes.CHANGE_DARK_THEME,
    darkmode
  };
}

export function changeCommonSetting(common) {
  return {
    type: actionTypes.CHANGE_COMMON_SETTING,
    common
  };
}

export function showDisconnectSocket(show) {
  return {
    type: actionTypes.SHOW_DISCONNECT,
    show: show
  };
}

export function updateUnreadCount(missedCallUnRead) {
  return {
    type: actionTypes.UPDATE_UNREAD_COUNT,
    missedCallUnRead: missedCallUnRead
  };
}

export function requestUpdateOnlineStaffList(onlineList) {
  return {
    type: actionTypes.STAFF_UPDATE_ONLINE_LIST,
    onlineList
  };
}

export function requireReload() {
  return {
    type: actionTypes.REQUIRED_RELOAD
  };
}

export function requireExpandHistory() {
  return {
    type: actionTypes.EXPANDED_HISTORY
  };
}

// CALL ACTION
export function requestCallEventUpdate(callData) {
  return {
    type: actionTypes.CALL_EVENT_UPDATE,
    callData
  };
}

// CALL ACTION
export function requestCallEventPhoneUpdate(phone) {
  return {
    type: actionTypes.CALL_EVENT_PHONE_UPDATE,
    phone
  };
}

// CALL ACCTION
export function requestUpdateCallDuration() {
  return {
    type: actionTypes.CALL_EVENT_UPDATE_DURATION
  };
}

export function requestGlobalCallDataUpdate(data, callId, currentProfile) {
  return {
    type: actionTypes.GLOBAL_CALL_DATA_UPDATE,
    data: data,
    callId: callId,
    currentProfile: currentProfile
  };
}

export function requestCallProfileUpdate(profile) {
  return {
    type: actionTypes.CALL_EVENT_USER_INFO_UPDATE,
    profile
  };
}

export function openCallLogByName(callLog = {}) {
  return {
    type: actionTypes.OPEN_CALL_LOG_BY_NAME,
    callLog: callLog
  };
}
