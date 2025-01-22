import { useStyles } from './styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import * as constantApp from '../../configs/constant';
import * as windowSizeConfig from '../../configs/window.size.config';
import * as ipc from '../../utils/ipc';
import * as Actions from '../../actions';
import * as remote from '@electron/remote';
import IncommingCall from './IncomingCall';
import CallList from './CallList';

import { startGetGlobalConfig, cancelGetGlobalConfig } from '../controller';

let durationTimer = null;
export default function Call(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const settings = useSelector(state => state.call.globalSettings);
  const { purposes, products } = settings;
  const currentCall = useSelector(state => state.call.currentCall);
  const { showForm, callData } = currentCall;

  const [initCompleted, setInitCompleted] = useState(false);

  useEffect(() => {
    const currentWindow = remote.getCurrentWindow();

    currentWindow.setMaximizable(true);
    currentWindow.setFullScreenable(true);
    currentWindow.setResizable(true);

    const sizes = currentWindow.getSize();
    const winBounds = currentWindow.getBounds();
    const distScreen = remote.screen.getDisplayNearestPoint({
      x: winBounds.x,
      y: winBounds.y
    });

    const screenBounds = distScreen.workArea;
    const areaWidth = screenBounds.width;
    const areaHeight = screenBounds.height;

    if (showForm) {
      if (sizes[0] < windowSizeConfig.CALL_NORMAL_WIDTH) {
        // if (currentWindow && !currentWindow.isMaximizable()) {
        //show form already
        // currentWindow.setMaximizable(true);
        // currentWindow.setFullScreenable(true);
        // currentWindow.setResizable(true);
        currentWindow.setSize(
          windowSizeConfig.CALL_NORMAL_WIDTH,
          windowSizeConfig.CALL_NORMAL_HEIGHT
        );

        const position = currentWindow.getPosition();
        let x =
          position[0] -
          (windowSizeConfig.CALL_NORMAL_WIDTH -
            windowSizeConfig.CALL_SMALL_WIDTH) /
            2;
        let y =
          position[1] -
          (windowSizeConfig.CALL_NORMAL_HEIGHT -
            windowSizeConfig.CALL_SMALL_HEIGHT) /
            2;
        x = x < screenBounds.x ? screenBounds.x : x;
        x =
          x + windowSizeConfig.CALL_NORMAL_WIDTH > screenBounds.x + areaWidth
            ? screenBounds.x + areaWidth - windowSizeConfig.CALL_NORMAL_WIDTH
            : x;

        y = y < screenBounds.y ? screenBounds.y : y;
        y =
          y + windowSizeConfig.CALL_NORMAL_HEIGHT > screenBounds.y + areaHeight
            ? screenBounds.y + areaHeight - windowSizeConfig.CALL_NORMAL_HEIGHT
            : y;
        currentWindow.setPosition(x, y);
      }
    }
  }, [showForm, window.emptyHistory]);

  const mainToRenderListener = (event, action, data) => {
    console.log(action, data);
    if (action == constantApp.ACTION_UPDATE_DATA_FROM_MAIN) {
      if (data.eventId == constantApp.EVENT_ID_CALL_EVENT) {
        if (window.phoneNumberChanged) {
          if (data.data?.direction == constantApp.CALL_DIRECTION.INBOUND) {
            data.data.from = window.phoneNumberChanged;
          } else {
            data.data.to = window.phoneNumberChanged;
          }
        } else {
          document.title =
            data.data?.direction == constantApp.CALL_DIRECTION.INBOUND
              ? data.data?.from
              : data.data?.to;
        }

        if (
          data.data?.event == constantApp.CALL_EVENT.CANCEL ||
          data.data?.event == constantApp.CALL_EVENT.BUSY
        ) {
          //not need show form
          remote.getCurrentWindow().close();
          // dispatch(Actions.requestCallEventUpdate(data.data));
          return;
        }

        if (data.data?.event == constantApp.CALL_EVENT.INVITE_RESULT) {
          //accept call
          durationTimer = setInterval(() => {
            dispatch(Actions.requestUpdateCallDuration());
          }, 1000);
          dispatch(Actions.requestCallEventUpdate(data.data));
          return;
        }

        if (data.data?.event == constantApp.CALL_EVENT.BYE) {
          //end call
          clearInterval(durationTimer);
        }

        dispatch(Actions.requestCallEventUpdate(data.data));
        return;
      }

      if (data.eventId == constantApp.EVENT_ID_UPDATE_PHONE_NUMBER) {
        if (data?.data?.number) {
          window.phoneNumberChanged = data?.data?.number;
          document.title = data?.data?.number;
          dispatch(Actions.requestCallEventPhoneUpdate(data?.data?.number));
        }
        return;
      }

      if (data.eventId == constantApp.EVENT_ID_USER_INFO) {
        dispatch(Actions.requestCallProfileUpdate(data.data));
        return;
      }

      if (data.eventId == constantApp.EVENT_ID_EXTEND_ONLINE) {
        dispatch(Actions.requestUpdateOnlineStaffList(data.data));
        return;
      }

      if (data.eventId == constantApp.EVENT_ID_ALl_GLOBAL_CONFIG) {
        dispatch(Actions.requestGlobalCallDataUpdate(data, null, null));
        return;
      }

      if (data.eventId == constantApp.EVENT_ID_TRANSFER_CALL_RESULT) {
        if (data.data?.result) {
          clearInterval(durationTimer);
        }
      }

      return;
    }
  };

  useEffect(() => {
    ipc.onIpcEvent(constantApp.MAIN_TO_RENDER_EVENT, mainToRenderListener);

    let paramQuery = global.location.search;
    paramQuery = paramQuery.split('?')[1];
    const callID = paramQuery.split('=')[1];
    window.callID = callID;
    if (callID.startsWith('NHAN_EMPTY_CALL_ID_')) {
      window.emptyHistory = true;
    }

    startGetGlobalConfig(dispatch, i18n.language, callID, false);
    setInitCompleted(true);
    return () => {
      clearInterval(durationTimer);
      ipc.removeAllIpcEvent(constantApp.MAIN_TO_RENDER_EVENT);
      cancelGetGlobalConfig();
    };
  }, []);

  let prefix = purposes?.length > 0 ? 'full' : 'prefix';
  prefix = window.phoneNumberChanged ? `${prefix}_phone_changed` : prefix;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {initCompleted ? (
        showForm || window.emptyHistory ? (
          <CallList key={`CallList_${prefix}`} />
        ) : (
          <IncommingCall key={`IncommingCall_${prefix}`} />
        )
      ) : null}
    </div>
  );
}
