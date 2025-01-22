import React, { useEffect } from 'react';
import { useStyles } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import HanIncomingAnimationIcon from '../../../components/HanIncomingAnimationIcon';
import HanAvatar, { HanAssigned } from '../../../components/HanAvatar';
import CRMApi from '../../../core/service/vn/server.api';
import * as constantApp from '../../../configs/constant';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import * as Actions from '../../../actions';
import HanHistory from '../../../components/HanHistory';
import * as windowSizeConfig from '../../../configs/window.size.config';
import * as remote from '@electron/remote';
export default function IncomingCall(props) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    remote.getCurrentWindow().setAlwaysOnTop(true);
    const currentWindow = remote.getCurrentWindow();
    currentWindow.setMinimumSize(
      windowSizeConfig.CALL_SMALL_WIDTH,
      windowSizeConfig.CALL_SMALL_HEIGHT
    );
  }, []);

  const toggleHistoryIncall = useSelector(
    state => state.appUI.toggleHistoryIncall
  );
  const crrCall = useSelector(state => state.call.currentCall);
  const { callData, callProfile } = crrCall;

  const { staffs } = callProfile;
  const assigned = () => {
    let result = [];

    if (staffs && staffs.length > 0) {
      staffs.forEach(element => {
        result.push(element.staff_user_name);
      });
    } else {
      result.push('None');
    }
    return result.join(',');
  };

  function renderCompanyName() {
    if (callProfile.type != 'company') {
      return callProfile?.parentname ?? '';
    }
    return '';
  }

  const incomming = callData?.direction == constantApp.CALL_DIRECTION.INBOUND;

  const userPhone = incomming ? callData?.from ?? null : callData?.to ?? null;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      <div
        className={classes.dialog}
        style={{
          width: toggleHistoryIncall ? 'calc(100% - 600px)' : '100%'
        }}
      >
        <div className={classes.dialogHeader}>
          <div className={classes.iconIncoming}>
            <HanIncomingAnimationIcon />
          </div>
          <span className={classes.dialogHeaderText}>
            {incomming ? t('Incoming call') : t('Outgoing call')}
          </span>
        </div>
        <div className={classes.dialogInfo}>
          <HanAvatar
            user={{
              userAvatar: './images/icon-incoming.png',
              userName: callProfile?.name ?? '',
              userCompany: renderCompanyName() ?? '',
              userPhone: userPhone ?? '...'
            }}
          />
        </div>
        <div className={classes.dialogFooter}>
          <HanAssigned
            style={{
              flex: 1
            }}
            data={assigned()}
            t={t}
          />
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => {
              const currentWindow = remote.getCurrentWindow();
              if (!toggleHistoryIncall) {
                const newWidth = windowSizeConfig.CALL_SMALL_WIDTH + 750;
                const newHeight = windowSizeConfig.CALL_SMALL_HEIGHT + 300;

                currentWindow.setSize(newWidth, newHeight);

                const position = currentWindow.getPosition();
                const winBounds = currentWindow.getBounds();
                const distScreen = remote.screen.getDisplayNearestPoint({
                  x: winBounds.x,
                  y: winBounds.y
                });

                const screenBounds = distScreen.workArea;
                const areaWidth = screenBounds.width;
                const areaHeight = screenBounds.height;
                let x = position[0];
                let y = position[1];
                x = x < screenBounds.x ? screenBounds.x : x;
                x =
                  x + newWidth > screenBounds.x + areaWidth
                    ? screenBounds.x + areaWidth - newWidth
                    : x;

                y = y < screenBounds.y ? screenBounds.y : y;
                y =
                  y + newHeight > screenBounds.y + areaHeight
                    ? screenBounds.y + areaHeight - newHeight
                    : y;
                currentWindow.setPosition(x, y);
              } else {
                currentWindow.setSize(
                  windowSizeConfig.CALL_SMALL_WIDTH,
                  windowSizeConfig.CALL_SMALL_HEIGHT
                );
              }

              dispatch(Actions.requireExpandHistory());
            }}
          >
            {t('History')}
          </Button>
        </div>
      </div>
      <div
        style={{
          width: 800,
          display: toggleHistoryIncall ? 'block' : 'none'
        }}
      >
        <HanHistory
          key={userPhone ?? ''}
          initParams={{
            customer_phone: userPhone
          }}
        />
      </div>
    </div>
  );
}

IncomingCall.propTypes = {};

IncomingCall.defaultProps = {};
