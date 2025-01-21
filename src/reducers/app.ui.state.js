import * as actionTypes from '../actions/actionTypes';

const initialState = {
  selectedCallLog: {},
  unreadCount: {
    missedCallCount: 0
  },
  requiredReload: true,
  toggleHistoryIncall: false
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.NAVIGATE_LOGIN_PAGE:
      return {
        selectedCallLog: {},
        unreadCount: {
          missedCallCount: 0
        },
        toggleHistoryIncall: false
      };

    case actionTypes.UPDATE_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: {
          ...state.unreadCount,
          missedCallCount: action.missedCallUnRead
        }
      };

    case actionTypes.OPEN_CALL_LOG_BY_NAME:
      return {
        ...state,
        selectedCallLog: action.callLog
      };

    case actionTypes.REQUIRED_RELOAD:
      return {
        ...state,
        requiredReload: !state.requiredReload
      };

    case actionTypes.EXPANDED_HISTORY:
      const newExpand = !state.toggleHistoryIncall;
      return {
        ...state,
        toggleHistoryIncall: newExpand
      };

    default:
      return state;
  }
};
