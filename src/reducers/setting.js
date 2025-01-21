import * as actionTypes from '../actions/actionTypes';
const initialState = {
  font: null,
  fontSize: null,
  primaryTheme: null,
  secondaryTheme: null,
  darkmode: null,
  common: {}
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.CHANGE_FONT_STYLE:
      return {
        ...state,
        font: action.font
      };
    case actionTypes.CHANGE_FONT_SIZE:
      return {
        ...state,
        fontSize: action.fontSize
      };
    case actionTypes.CHANGE_PRIMARY_THEME:
      return {
        ...state,
        primaryTheme: action.primaryTheme
      };
    case actionTypes.CHANGE_SECONDARY_THEME:
      return {
        ...state,
        secondaryTheme: action.secondaryTheme
      };
    case actionTypes.CHANGE_DARK_THEME:
      return {
        ...state,
        darkmode: action.darkmode
      };
    case actionTypes.CHANGE_COMMON_SETTING:
      return {
        ...state,
        common: action.common
      };
    default:
      return state;
  }
};
