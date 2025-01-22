import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import crmcallServiceCenter from '../../core/service/vn/crmcallservice';
import * as constantApp from '../../configs/constant';
import { routes, routeName } from '../../configs/routes';
import * as Actions from '../../actions';
import * as remote from '@electron/remote';
import * as ipc from '../../utils/ipc';
import { useStyles } from './styles';
import CRMApi from '../../core/service/vn/server.api';
import UpdateDialog from '../../components/UpdateDialog';

import Setting from './Setting';

import {
  startGetGlobalConfig,
  cancelGetGlobalConfig,
  countMissedCallRequest,
  cancelCountMissedCallRequest
} from '../controller';

import {
  List,
  ListItem,
  Tooltip,
  ListItemIcon,
  Typography,
  Avatar,
  Badge,
  Button
} from '@material-ui/core';

import {
  ContactIcon,
  HomeIcon,
  MissedCallIcon,
  SearchIcon,
  SettingIcon,
  LogoutIcon,
  AddHistoryIcon
} from '../../components/HanSVGIcon';
import LogoutDialog from '../../components/LogoutDialog';

let timerCountMissedCall = null;

const DISABLE_HOME_TAB = true;

let networkOnline = true;
export default function Home() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();

  const [showSetting, setShowSetting] = useState(false);

  const unreadCount = useSelector(state => state.appUI.unreadCount);
  const userInfo = useSelector(state => state.auth.user.data.result);
  const modeCountry = useSelector(state => state.auth.modeCountry);

  const [activeMenu, setActiveMenu] = useState(routeName.MISSED_CALL);
  const [activeMenuTitle, setActiveMenuTitle] = useState('MISSED CALL');

  const [logoutUI, setLogoutUI] = useState({
    show: false
  });

  const [updateApp, setUpdateApp] = useState({
    showUpdateDialog: false,
    updateContent: {
      version: '',
      releaseNotes: ''
    }
  });

  const updateNetworkStatus = () => {
    if (window.isKoreaMode) {
      ipc.sendNetworkStatus();
    } else {
      if (navigator.onLine != networkOnline) {
        if (navigator.onLine) {
          crmcallServiceCenter.reconnectService(true);
        } else {
          crmcallServiceCenter.disconnectService();
        }
      }
      networkOnline = navigator.onLine;
    }
  };

  const listener = (action, data) => {
    console.log('HOME PAGE', action, data);
    if (action == constantApp.ACTION_LOGIN_SOCKET_EVENT) {
      if (data.code == constantApp.SOCKET_ERROR_CODE.login_success) {
        startGetGlobalConfig(dispatch, i18n.language, null, false);
        countMissedCallRequest(dispatch);
      } else {
        ipc.clearAccount(false);
        remote.getGlobal('ShareGlobalObject').attempDisableAutoLogin = true;
        dispatch(Actions.requestNavigateLoginPage({}));
      }
    } else if (action == constantApp.ACTION_ERROR_SOCKET_EVENT) {
      ipc.clearAccount(false);
      remote.getGlobal('ShareGlobalObject').attempDisableAutoLogin = true;
      dispatch(Actions.requestNavigateLoginPage({}));
    } else if (action == constantApp.ACTION_DATA_SOCKET_EVENT) {
      if (data.eventId == constantApp.EVENT_ID_EXTEND_ONLINE) {
        ipc.updateCRMCallData(data);
        dispatch(Actions.requestUpdateOnlineStaffList(data.data));
        return;
      }

      if (data.eventId == constantApp.EVENT_ID_CALL_EVENT) {
        const isOutgoingCall =
          data.data.direction == constantApp.CALL_DIRECTION.OUTBOUND;
        const calling =
          data.data.event == constantApp.CALL_EVENT.INVITE ? true : false;
        const acceptCall =
          data.data.event == constantApp.CALL_EVENT.INVITE_RESULT;
        const cancelCall = data.data.event == constantApp.CALL_EVENT.CANCEL;

        if (!isOutgoingCall && cancelCall) {
          timerCountMissedCall = setTimeout(() => {
            countMissedCallRequest(dispatch);
          }, 60000);
        }

        // console.log(
        //   'isoutgoingcall',
        //   isOutgoingCall,
        //   calling,
        //   acceptCall,
        //   cancelCall
        // );

        // if (isOutgoingCall && calling) {
        //   return;
        // }

        let forceShow = false;
        if ((isOutgoingCall ) || (!isOutgoingCall && calling)) { //&& acceptCall
          forceShow = true;
        }

        ipc.openAndUpdateDataToCallWindows({
          ...data,
          callid: data.data.callid,
          forceShow: forceShow,
          calling: calling
        });
        return;
      }

      if (data.eventId == constantApp.EVENT_ID_TRANSFER_CALL_RESULT) {
        ipc.openAndUpdateDataToCallWindows({
          ...data,
          callid: data?.data?.callid,
          forceShow: false,
          calling: false
        });
        return;
      }

      if (data.eventId == constantApp.EVENT_ID_USER_INFO) {
        ipc.openAndUpdateDataToCallWindows({
          ...data,
          callid: data.data.id,
          forceShow: false,
          calling: false
        });
        return;
      }

      if (data.eventId == constantApp.EVENT_ID_LOGOUT_BY_OTHER_DEVICE) {
        ipc.clearAccount(false);
        remote.getGlobal('ShareGlobalObject').attempDisableAutoLogin = true;
        dispatch(Actions.requestNavigateLoginPage(data.status));
        return;
      }
    }
  };

  const processKoreaMode = (action, data) => {
    console.log('HOME PAGE KOREA', action, data);
    if (action == constantApp.ACTION_LOGIN_SOCKET_EVENT) {
      if (data.code == constantApp.SOCKET_ERROR_CODE.login_success) {
        startGetGlobalConfig(dispatch, i18n.language, null, false);
        countMissedCallRequest(dispatch);
      } else {
        ipc.clearAccount(false);
        remote.getGlobal('ShareGlobalObject').attempDisableAutoLogin = true;
        dispatch(Actions.requestNavigateLoginPage({}));
      }
    } else if (action == constantApp.ACTION_ERROR_SOCKET_EVENT) {
      ipc.clearAccount(false);
      remote.getGlobal('ShareGlobalObject').attempDisableAutoLogin = true;
      dispatch(Actions.requestNavigateLoginPage({}));
    } else if (action == constantApp.ACTION_DATA_SOCKET_EVENT) {
      if (data.eventId == constantApp.EVENT_ID_EXTEND_ONLINE) {
        ipc.updateCRMCallData(data);
        dispatch(Actions.requestUpdateOnlineStaffList(data.data));
        return;
      }

      if (data.eventId == constantApp.EVENT_ID_CALL_EVENT) {
        const isOutgoingCall =
          data.data.direction == constantApp.CALL_DIRECTION.OUTBOUND;
        const calling =
          data.data.event == constantApp.CALL_EVENT.INVITE ? true : false;
        const acceptCall =
          data.data.event == constantApp.CALL_EVENT.INVITE_RESULT;
        const cancelCall = data.data.event == constantApp.CALL_EVENT.CANCEL;

        if (!isOutgoingCall && cancelCall) {
          timerCountMissedCall = setTimeout(() => {
            countMissedCallRequest(dispatch);
          }, 60000);
        }

        // if (isOutgoingCall && calling) {
        //   return;
        // }

        let forceShow = false;
        if ((isOutgoingCall ) || (!isOutgoingCall && calling)) { //&& acceptCall
          forceShow = true;
        }
        console.log('FORCE SHOW', forceShow);
        ipc.openAndUpdateDataToCallWindows({
          ...data,
          callid: data.data.callid,
          forceShow: forceShow,
          calling: calling
        });
        return;
      }

      if (data.eventId == constantApp.EVENT_ID_TRANSFER_CALL_RESULT) {
        // ipc.openAndUpdateDataToCallWindows({
        //   ...data,
        //   callid: data?.data?.callid,
        //   forceShow: false,
        //   calling: false
        // });

        ipc.updateCRMCallData({
          ...data
        });

        return;
      }

      if (data.eventId == constantApp.EVENT_ID_USER_INFO) {
        ipc.openAndUpdateDataToCallWindows({
          ...data,
          callid: data.data.id,
          forceShow: false,
          calling: false
        });
        return;
      }

      if (data.eventId == constantApp.EVENT_ID_LOGOUT_BY_OTHER_DEVICE) {
        ipc.clearAccount(false);
        remote.getGlobal('ShareGlobalObject').attempDisableAutoLogin = true;
        dispatch(Actions.requestNavigateLoginPage(data.status));
        return;
      }
    }
  };

  const mainToRenderListener = (event, action, data) => {
    if (action == constantApp.ACTION_NEW_UPDATE_VERSION_DOWNLOADED) {
      const version = data.version;
      const releaseNotes = data.releaseNotes;
      setUpdateApp({
        showUpdateDialog: true,
        updateContent: {
          version: version,
          releaseNotes: releaseNotes
        }
      });
      return;
    }

    if (action == constantApp.ACTION_MOVE_TO_LOGIN_PAGE) {
      remote.getGlobal('ShareGlobalObject').attempDisableAutoLogin = true;
      dispatch(Actions.requestNavigateLoginPage());
      return;
    }

    if (window.isKoreaMode) {
      processKoreaMode(action, data);
      return;
    }

    // ACTION BELLOW FOR WEBSOCKET ONLY
    if (action == constantApp.ACTION_RESUME_SERVICE_IF_CAN) {
      crmcallServiceCenter.reconnectService(false);
      return;
    }

    if (action == constantApp.ACTION_STOP_SERVICE_IF_CAN) {
      crmcallServiceCenter.disconnectService();
      return;
    }

    if (action == constantApp.ACTION_REQUEST_TRANSFER_CALL) {
      crmcallServiceCenter.sendTranferCallWithPhone(data);
      return;
    }

    if (action == constantApp.ACTION_REQUEST_MAKE_CALL) {
      crmcallServiceCenter.sendMakeCall(data);
      return;
    }
  };

  useEffect(() => {
    updateNetworkStatus();
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    crmcallServiceCenter.addListener(listener);
    ipc.onIpcEvent(constantApp.MAIN_TO_RENDER_EVENT, mainToRenderListener);

    startGetGlobalConfig(dispatch, i18n.language, null, false);
    countMissedCallRequest(dispatch);

    return () => {
      clearTimeout(timerCountMissedCall);
      cancelGetGlobalConfig();
      cancelCountMissedCallRequest();
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      crmcallServiceCenter.removeListener(listener);
      ipc.removeAllIpcEvent(constantApp.MAIN_TO_RENDER_EVENT);

      crmcallServiceCenter.disconnectService();
    };
  }, []);

  useEffect(() => {
    document.title = `CRMCall - ${userInfo?.username} (${userInfo?.extend}) - ${userInfo.email}`;
  }, [userInfo]);

  useEffect(() => {
    if (history.location.pathname != activeMenu) {
      history.push(activeMenu);
    }
  }, [activeMenu]);

  const doLogout = (clearCache, clearPassword) => {
    if (window.isKoreaMode) {
      if (clearPassword) {
        ipc.clearPassword();
      }

      ipc.doLogout();
    } else {
      crmcallServiceCenter.disconnectService();
      if (clearPassword) {
        ipc.clearPassword();
      }
      ipc.clearAccount(clearCache);
      remote.getGlobal('ShareGlobalObject').attempDisableAutoLogin = true;
      dispatch(Actions.requestNavigateLoginPage());
    }
  };

  const setTitlePage = activeMenu => {
    switch (activeMenu) {
      case routeName.HOME:
        return setActiveMenuTitle('HOME PAGE');
        break;
      case routeName.MISSED_CALL:
        return setActiveMenuTitle('MISSED CALL');
        break;
      case routeName.SEARCH:
        return setActiveMenuTitle('SEARCH');
        break;
      case routeName.CONTACTS:
        return setActiveMenuTitle('CUSTOMER LIST');
        break;

      default:
        break;
    }
  };

  let missedCallCount = unreadCount?.missedCallCount;

  return (
    <div className={classes.main}>
      <div className={classes.drawer}>
        <List style={{ padding: 0 }}>
          <ListItem
            button
            key="photo"
            className={classes.listItem}
            style={{
              borderBottom: 0,
              borderBottomStyle: 'solid',
              borderBottomColor: theme.palette.divider
            }}
            onClick={() => {
              console.log('open profile ?');
            }}
          >
            <ListItemIcon className={classes.listItemIcon}>
              <Avatar src={CRMApi.photoURL()} />
            </ListItemIcon>
          </ListItem>
          {DISABLE_HOME_TAB == false && (
            <ListItem
              button
              key={routeName.HOME}
              className={
                activeMenu == routeName.HOME
                  ? classes.listItemActive
                  : classes.listItem
              }
              onClick={() => {
                setActiveMenu(routeName.HOME);
                setTitlePage(routeName.HOME);
              }}
            >
              <Tooltip
                title={t('tooltip_home_tab')}
                aria-label={t('tooltip_home_tab')}
              >
                <ListItemIcon className={classes.listItemIcon}>
                  <HomeIcon style={{ color: 'white' }} />
                </ListItemIcon>
              </Tooltip>
            </ListItem>
          )}

          <ListItem
            button
            key={routeName.MISSED_CALL}
            className={
              activeMenu == routeName.MISSED_CALL
                ? classes.listItemActive
                : classes.listItem
            }
            onClick={() => {
              setActiveMenu(routeName.MISSED_CALL);
              setTitlePage(routeName.MISSED_CALL);
            }}
          >
            <Tooltip
              title={t('tooltip_missed_call_tab')}
              aria-label={t('tooltip_missed_call_tab')}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <Badge badgeContent={missedCallCount} color="error">
                  <MissedCallIcon style={{ color: 'white' }} />
                </Badge>
              </ListItemIcon>
            </Tooltip>
          </ListItem>
          <ListItem
            button
            key={routeName.SEARCH}
            className={
              activeMenu == routeName.SEARCH
                ? classes.listItemActive
                : classes.listItem
            }
            onClick={() => {
              setActiveMenu(routeName.SEARCH);
              setTitlePage(routeName.SEARCH);
            }}
          >
            {/* <div className={classes.contentSelect}>
              {activeMenu == routeName.SEARCH && <div className={classes.selectedItem}></div>}
            </div> */}
            <Tooltip
              title={t('tooltip_search_tab')}
              aria-label={t('tooltip_search_tab')}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <SearchIcon style={{ color: 'white' }} />
              </ListItemIcon>
            </Tooltip>
          </ListItem>
          <ListItem
            button
            key={routeName.CONTACTS}
            className={
              activeMenu == routeName.CONTACTS
                ? classes.listItemActive
                : classes.listItem
            }
            onClick={() => {
              setActiveMenu(routeName.CONTACTS);
              setTitlePage(routeName.CONTACTS);
            }}
          >
            <Tooltip
              title={t('tooltip_contacts_tab')}
              aria-label={t('tooltip_contacts_tab')}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <ContactIcon style={{ color: 'white' }} />
              </ListItemIcon>
            </Tooltip>
          </ListItem>
        </List>
        <div>
          <ListItem
            button
            className={classes.listItem}
            onClick={() => {
              ipc.openCallWindows();
            }}
          >
            <Tooltip
              title={t('tooltip_add_history_tab')}
              aria-label={t('tooltip_add_history_tab')}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <AddHistoryIcon style={{ color: 'white' }} />
              </ListItemIcon>
            </Tooltip>
          </ListItem>
          <ListItem
            button
            className={classes.listItem}
            onClick={() => {
              setShowSetting(true);
            }}
          >
            <Tooltip
              title={t('tooltip_setting_tab')}
              aria-label={t('tooltip_setting_tab')}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <SettingIcon style={{ color: 'white' }} />
              </ListItemIcon>
            </Tooltip>
          </ListItem>
          <ListItem
            button
            className={classes.listItem}
            onClick={() => {
              setLogoutUI({ show: true });
            }}
          >
            <Tooltip
              title={t('tooltip_logout_tab')}
              aria-label={t('tooltip_logout_tab')}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <LogoutIcon style={{ color: 'white' }} />
              </ListItemIcon>
            </Tooltip>
          </ListItem>
        </div>
      </div>
      <div className={classes.mainLayoutRight}>
        <div className={classes.mainLayoutHeader}>
          <Typography variant="h6" component="h2" style={{ flex: 1 }}>
            {t(activeMenuTitle)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              dispatch(Actions.requireReload());
            }}
            style={{ marginRight: 10 }}
          >
            {t('Refresh')}
          </Button>
        </div>
        <div
          style={{
            position: 'relative',
            height: 'calc(100% - 60px)',
            width: '100%'
          }}
        >
          <Switch>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                children={<route.content />}
              />
            ))}
          </Switch>
        </div>
      </div>

      {showSetting && (
        <Setting show={true} onClose={() => setShowSetting(false)} />
      )}

      {logoutUI.show && (
        <LogoutDialog
          show={true}
          onClose={() => setLogoutUI({ show: false })}
          onLogout={clear => {
            doLogout(false, clear);
          }}
        />
      )}

      {updateApp.showUpdateDialog && (
        <UpdateDialog
          show={true}
          releaseInfo={updateApp.updateContent}
          onUpdate={() => {
            ipc.requestQuitAndInstallApp();
          }}
          onClose={() => setUpdateApp({ showUpdateDialog: false })}
        />
      )}
    </div>
  );
}
