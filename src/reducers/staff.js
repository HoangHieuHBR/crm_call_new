import * as actionTypes from '../actions/actionTypes';

const initialState = {
  onlineStaffList: [],
  userTree: [],
  userCached: {}
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.NAVIGATE_LOGIN_PAGE:
      return {
        onlineStaffList: []
      };

    case actionTypes.GLOBAL_CALL_DATA_UPDATE: {
      const data = action.data;
      return {
        ...state,
        onlineStaffList: data.staffOnlineList,
        userTree: data.userTree,
        userCached: data.userCached
      };
    }

    case actionTypes.STAFF_UPDATE_ONLINE_LIST:
      return {
        ...state,
        onlineStaffList: action.onlineList
      };

    default:
      return state;
  }
};
