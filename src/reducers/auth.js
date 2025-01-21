import * as actionTypes from '../actions/actionTypes';
import { MODE_COUNTRY } from '../configs/constant';
const initialState = {
  user: {},
  extraInfo: {},
  authentication: false,
  modeCountry: MODE_COUNTRY.vietnamese
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.NAVIGATE_HOME_PAGE:
      return {
        user: action.user,
        extraInfo: action.extraInfo,
        authentication: true,
        modeCountry: action.modeCountry
      };
    case actionTypes.NAVIGATE_LOGIN_PAGE:
      return {
        user: {},
        extraInfo: action.extraInfo,
        authentication: false,
        modeCountry: state.modeCountry
      };
    default:
      return state;
  }
};
