import * as actionTypes from '../actions/actionTypes';
import { CALL_EVENT, CALL_DIRECTION } from '../configs/constant';

const initialState = {
  currentCall: {
    showForm: false,
    time: 0,
    acceptTime: 0,
    call_duration: 0,
    callData: null,
    callProfile: {}
  },
  globalSettings: {
    purposes: [],
    categories: [],
    phoneTypes: [],
    products: [],
    statuses: [],
    labels: []
  }
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.NAVIGATE_LOGIN_PAGE:
      return {
        currentCall: {
          showForm: false,
          acceptTime: 0,
          call_duration: 0,
          callData: null,
          callProfile: {}
        }
      };

    case actionTypes.GLOBAL_CALL_DATA_UPDATE: {
      const data = action.data;
      if (action.currentProfile) {
        return {
          ...state,
          currentCall: {
            ...state.currentCall,
            callData: { ...state.currentCall.callData },
            callProfile: action.currentProfile
          },
          globalSettings: {
            ...state.globalSettings,
            purposes: data.purposes,
            categories: data.categories,
            phoneTypes: data.phoneTypes,
            products: data.products,
            statuses: data.statuses,
            labels: data.labels
          }
        };
      }
      return {
        ...state,
        currentCall: {
          ...state.currentCall,
          callData: { ...state.currentCall.callData }
        },
        globalSettings: {
          ...state.globalSettings,
          purposes: data.purposes,
          categories: data.categories,
          phoneTypes: data.phoneTypes,
          products: data.products,
          statuses: data.statuses,
          labels: data.labels
        }
      };
    }

    case actionTypes.CALL_EVENT_UPDATE_DURATION: {
      let currentCall = { ...state.currentCall };
      if (currentCall.acceptTime) {
        const duration = Date.now() - currentCall.acceptTime;
        currentCall.call_duration = parseInt(duration / 1000);
        return {
          ...state,
          currentCall: currentCall
        };
      }
      return state;
    }

    case actionTypes.CALL_EVENT_USER_INFO_UPDATE: {
      const profile = action.profile;
      return {
        ...state,
        currentCall: {
          ...state.currentCall,
          callProfile: profile
        }
      };
    }

    case actionTypes.CALL_EVENT_PHONE_UPDATE: {
      const lastDirection =
        state.currentCall?.callData?.direction ?? CALL_DIRECTION.INBOUND;
      if (lastDirection == CALL_DIRECTION.INBOUND) {
        return {
          ...state,
          currentCall: {
            ...state.currentCall,
            callData: {
              ...state.currentCall.callData,
              direction: lastDirection,
              from: action.phone
            }
          }
        };
      }
    }

    case actionTypes.CALL_EVENT_UPDATE: {
      let data = { ...action.callData };

      const lastDirection = state.currentCall?.callData?.direction;
      const curDirection = data.direction;

      if (
        lastDirection == CALL_DIRECTION.INBOUND ||
        lastDirection == CALL_DIRECTION.OUTBOUND
      ) {
        if (lastDirection != curDirection) {
          // CHEAT CODE KOREA SOCKET, SIEU BUA
          const from = data.from;
          const to = data.to;
          data = { ...data, direction: lastDirection, from: to, to: from };
        }
      }

      // console.log('CALL_EVENT_UPDATE', data, curDirection, lastDirection);

      if (data.event == CALL_EVENT.INVITE) {
        //start ringing or accept call
        return {
          ...state,
          currentCall: {
            ...state.currentCall,
            time: data.time,
            showForm: false,
            callData: data
          }
        };
      } else if (
        data.event == CALL_EVENT.INVITE_RESULT ||
        data.event == CALL_EVENT.CANCEL ||
        data.event == CALL_EVENT.BUSY ||
        data.event == CALL_EVENT.BYE
      ) {
        if (data.event == CALL_EVENT.INVITE_RESULT) {
          return {
            ...state,
            currentCall: {
              ...state.currentCall,
              acceptTime: Date.now(),
              call_duration: 0,
              showForm: true,
              callData: data
            }
          };
        }
        return {
          ...state,
          currentCall: {
            ...state.currentCall,
            showForm: true,
            callData: data
          }
        };
      }
      return state;
    }

    default:
      return state;
  }
};
