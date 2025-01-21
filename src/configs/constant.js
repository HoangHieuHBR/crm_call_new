export const MAIN_TO_RENDER_EVENT = 'MAIN_TO_RENDER_EVENT';
export const COMMON_SYNC_ACTION_FROM_RENDER = 'COMMON_SYNC_ACTION_FROM_RENDER';
export const COMMON_ASYNC_ACTION_FROM_RENDER =
  'COMMON_ASYNC_ACTION_FROM_RENDER';

export const ACTION_SYNC_GET_LANGUAGE = 'ACTION_SYNC_GET_LANGUAGE';
export const ACTION_SYNC_SET_LANGUAGE = 'ACTION_SYNC_SET_LANGUAGE';

export const ACTION_SYNC_SET_OPEN_AT_LOGIN = 'ACTION_SYNC_SET_OPEN_AT_LOGIN';
export const ACTION_SYNC_GET_OPEN_AT_LOGIN = 'ACTION_SYNC_GET_OPEN_AT_LOGIN';

export const ACTION_SYNC_SET_CALL_DOCK = 'ACTION_SYNC_SET_CALL_DOCK';
export const ACTION_SYNC_GET_CALL_DOCK = 'ACTION_SYNC_GET_CALL_DOCK';

export const ACTION_SYNC_SAVE_ACCOUNT_INFO = 'ACTION_SYNC_SAVE_ACCOUNT_INFO';
export const ACTION_SYNC_GET_ACCOUNT_INFO = 'ACTION_SYNC_GET_ACCOUNT_INFO';
export const ACTION_SYNC_CLEAR_ACCOUNT_INFO = 'ACTION_SYNC_CLEAR_ACCOUNT_INFO';
export const ACTION_SYNC_CLEAR_PASSWORD = 'ACTION_SYNC_CLEAR_PASSWORD';

export const ACTION_SYNC_GET_GLOBAL_CALL_CONFIG =
  'ACTION_SYNC_GET_GLOBAL_CALL_CONFIG';

export const ACTION_UPDATE_DATA_FROM_MAIN = 'ACTION_UPDATE_DATA_FROM_MAIN';

export const ACTION_SYNC_OPEN_AND_UPDATE_DATA_TO_CALL_WINDOWS =
  'ACTION_SYNC_OPEN_AND_UPDATE_DATA_TO_CALL_WINDOWS';

export const ACTION_SYNC_OPEN_EMPTY_CALL_WINDOWS =
  'ACTION_SYNC_OPEN_EMPTY_CALL_WINDOWS';

export const ACTION_ASYNC_DO_LOGOUT = 'ACTION_ASYNC_DO_LOGOUT';
export const ACTION_ASYNC_LOGIN_SUCCESS = 'ACTION_ASYNC_LOGIN_SUCCESS';

export const ACTION_SYNC_UPDATE_CRM_CALL_DATA_ALL_WINDOWS =
  'ACTION_SYNC_UPDATE_CRM_CALL_DATA_ALL_WINDOWS';

export const ACTION_REQUEST_TRANSFER_CALL = 'ACTION_REQUEST_TRANSFER_CALL';
export const ACTION_REQUEST_MAKE_CALL = 'ACTION_REQUEST_MAKE_CALL';

export const ACTION_NEW_UPDATE_VERSION_DOWNLOADED =
  'ACTION_NEW_UPDATE_VERSION_DOWNLOADED';

export const ACTION_REQUEST_QUIT_AND_INSTALL_NEW_APP =
  'ACTION_REQUEST_QUIT_AND_INSTALL_NEW_APP';

export const ACTION_RESUME_SERVICE_IF_CAN = 'ACTION_RESUME_SERVICE_IF_CAN';

export const ACTION_STOP_SERVICE_IF_CAN = 'ACTION_STOP_SERVICE_IF_CAN';

export const ACTION_MOVE_TO_LOGIN_PAGE = 'ACTION_MOVE_TO_LOGIN_PAGE';

//
export const ACTION_ASYNC_LOGIN_WITH_DOMAIN_ID =
  'ACTION_ASYNC_LOGIN_WITH_DOMAIN_ID';
export const ACTION_ASYNC_CANCEL_LOGIN = 'ACTION_ASYNC_CANCEL_LOGIN';
export const ACTION_ASYNC_NETWORK_STATUS_CHANGED =
  'ACTION_ASYNC_NETWORK_STATUS_CHANGED';

export const STORAGE_FONT = 'STORAGE_FONT';
export const STORAGE_FONT_SIZE = 'STORAGE_FONT_SIZE';
export const STORAGE_PRIMARY_THEME = 'STORAGE_PRIMARY_THEME';
export const STORAGE_SECONDARY_THEME = 'STORAGE_SECONDARY_THEME';
export const STORAGE_DARK_MODE = 'STORAGE_DARK_MODE';
export const STORAGE_COMMON_SETTING = 'STORAGE_COMMON_SETTING';

// SOCKET CONSTANT
export const ACTION_ERROR_SOCKET_EVENT = 'ACTION_ERROR_SOCKET_EVENT';
export const ACTION_LOGIN_SOCKET_EVENT = 'ACTION_LOGIN_SOCKET_EVENT';
export const ACTION_DATA_SOCKET_EVENT = 'ACTION_DATA_SOCKET_EVENT';

export const SOCKET_ERROR_CODE = {
  customError: -12,
  access_control: -11,
  dns_error: -10,
  login_failed: -1,
  login_success: 1,
  require_otp: 9
};

export const CALL_EVENT = {
  INVITE: 'INVITE', //ringing
  INVITE_RESULT: 'INVITE_RESULT', // accept
  CANCEL: 'CANCEL', // missed call,
  BUSY: 'BUSY',
  BYE: 'BYE' // end call
};

export const MY_STATUS = {
  NONE: 0,
  RINGING: 1,
  BUSY: 2
};

export const CALL_DIRECTION = {
  INBOUND: 'INBOUND', //incomming call
  OUTBOUND: 'OUTBOUND' //outgoing call
};

export const CALL_DIRECTION_SOURCES = [
  {
    name: 'Incoming',
    value: CALL_DIRECTION.INBOUND
  },
  {
    name: 'Outgoing',
    value: CALL_DIRECTION.OUTBOUND
  }
];

export const CUSTOMER_TYPE = {
  company: {
    title: 'company',
    value: 'company'
  },
  contact: {
    title: 'Individual',
    value: 'contact'
  }
};

export const CUSTOMER_CATEGORY = {
  customer: {
    title: 'customer',
    category: 'general',
    state: 'general'
  },
  potential: {
    title: 'potential',
    category: 'potential',
    state: 'general'
  },
  lead: {
    title: 'lead',
    category: 'lead',
    state: 'general'
  },
  account: {
    title: 'account',
    category: 'account',
    state: 'general'
  }
};

export const PRIORITIES = {
  default: 3,
  source: [
    {
      title: 'Very high',
      value: 1
    },
    {
      title: 'High',
      value: 2
    },
    {
      title: 'Normal',
      value: 3
    },
    {
      title: 'Low',
      value: 4
    },
    {
      title: 'Very low',
      value: 5
    }
  ]
};
export const ACTIVITIES = {
  defaultCall: 'call',
  default: 'call,metting,fax,post,appointment,task,sms,email',
  source: [
    {
      title: 'All',
      value: 'call,metting,fax,post,appointment,task,sms,email'
    },
    {
      title: 'Meeting',
      value: 'metting',
      color: '#94C11F',
      background: '#94C11F33'
    },
    {
      title: 'Fax',
      value: 'fax',
      color: '#F29201',
      background: '#F2920133'
    },
    {
      title: 'Direct Mail',
      value: 'post',
      color: '#EA5B0B',
      background: '#EA5B0B33'
    },
    {
      title: 'Mail',
      value: 'email',
      color: '#02509B',
      background: '#02509B33'
    },
    {
      title: 'Appointment',
      value: 'appointment',
      color: '#B80D7F',
      background: '#B80D7F33'
    },
    {
      title: 'Task',
      value: 'task',
      color: '#831F83',
      background: '#831F8333'
    },
    {
      title: 'Phone',
      value: 'call',
      color: '#0C8E36',
      background: '#0C8E3633'
    },
    {
      title: 'SMS',
      value: 'sms',
      color: '#2C2E83',
      background: '#2C2E8333'
    }
  ]
};
export const CONTACT_TYPES = {
  default: 'all',
  source: [
    {
      title: 'All',
      value: 'all'
    },
    {
      title: 'Company',
      value: 'company',
      color: '#0667BD',
      background: '#0667BD1A'
    },
    {
      title: 'Individual',
      value: 'contact',
      color: '#0C8E36',
      background: '#0C8E361A'
    },
    {
      title: 'Employee',
      value: 'employee',
      color: '#512DA8',
      background: '#512DA81A'
    }
  ]
};
export const EVENT_ID_ALl_GLOBAL_CONFIG = 'EVENT_ID_ALl_GLOBAL_CONFIG';
export const EVENT_ID_USER_INFO = 'EVENT_ID_USER_INFO';
export const EVENT_ID_CALL_EVENT = 'EVENT_ID_CALL_EVENT';
export const EVENT_ID_UPDATE_PHONE_NUMBER = 'EVENT_ID_UPDATE_PHONE_NUMBER';
export const EVENT_ID_TRANSFER_CALL_RESULT = 'EVENT_ID_TRANSFER_CALL_RESULT';
export const EVENT_ID_EXTEND_ONLINE = 'EVENT_ID_EXTEND_ONLINE';
export const EVENT_ID_LOGOUT_BY_OTHER_DEVICE =
  'EVENT_ID_LOGOUT_BY_OTHER_DEVICE';

export const MODE_COUNTRY = {
  vietnamese: 'vn',
  korean: 'ko'
};
export const DISABLE_PRODUCT_TICKET = true;
