import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
// import { ConnectedRouter } from 'connected-react-router';
import { createTheme, LanguageSetting } from '../configs';
import { configureStore, history } from '../store';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import * as Utils from '../utils';
import * as ipc from '../utils/ipc';
import * as Actions from '../actions';
import * as constantsApp from '../configs/constant';
import * as remote from '@electron/remote';
import { initI18n } from '../utils/i18n';
import { initializeLogging } from '../utils/logging';

import Login from './Login';
import HomePage from './home';
import Call from './Call';
import CRMApi from '../core/service/vn/server.api';

// Initialize global logging
initializeLogging();

const store = configureStore();

const loadSettings = (dispatch) => {
  const settings = [
    { key: constantsApp.STORAGE_FONT, action: Actions.onChangeFont },
    { key: constantsApp.STORAGE_FONT_SIZE, action: Actions.onChangeFontSize },
    {
      key: constantsApp.STORAGE_PRIMARY_THEME,
      action: Actions.changePrimaryTheme,
    },
    {
      key: constantsApp.STORAGE_SECONDARY_THEME,
      action: Actions.changeSecondaryTheme,
    },
    { key: constantsApp.STORAGE_DARK_MODE, action: Actions.changeDarkTheme },
    {
      key: constantsApp.STORAGE_COMMON_SETTING,
      action: Actions.changeCommonSetting,
    },
  ];

  settings.forEach(({ key, action }) => {
    const value = Utils.getDataFromStorage(key);
    if (value) dispatch(action(value));
  });
};

function MainApp() {
  const lang = ipc.sendIPCSync(constantsApp.ACTION_SYNC_GET_LANGUAGE, null);

  useEffect(() => {
    initI18n(lang, LanguageSetting);
  }, [lang]);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const theme = createTheme();

  console.log('auth.authentication >>> ', auth.authentication);

  useEffect(() => {
    loadSettings(dispatch);
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {auth.authentication ? <HomePage /> : <Login />}
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

function CallApp() {
  const accountInfo = ipc.getDomainUserIDPassword();
  const modecountry = accountInfo?.mode_country;
  window.isKoreaMode = modecountry == constantsApp.MODE_COUNTRY.korean;

  if (window.isKoreaMode) {
    CRMApi.updateDataFromRemoteV2();
  } else {
    CRMApi.updateDataFromRemote();
  }

  const lang = ipc.sendIPCSync(constantsApp.ACTION_SYNC_GET_LANGUAGE, null);

  useEffect(() => {
    initI18n(lang, LanguageSetting);
  }, [lang]);

  const dispatch = useDispatch();
  const theme = createTheme();

  useEffect(() => {
    loadSettings(dispatch);
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Call />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

export default function App() {
  const mainElement = document.getElementById('root');
  const isRoot = mainElement?.id === 'root';

  if (isRoot) {
    remote.getGlobal('ShareGlobalObject').attempDisableAutoLogin = false;
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={isRoot ? <MainApp /> : <CallApp />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
