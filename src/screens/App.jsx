import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { createTheme, LanguageSetting } from '../configs';
import store from '../store';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import * as Utils from '../utils';
import * as ipc from '../utils/ipc';
import * as Actions from '../actions';
import * as constantsApp from '../configs/constant';
import * as remote from '@electron/remote';
// import { initializeLogging } from '../utils/logging';
import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';

import Login from './Login';
import HomePage from './home';
import Call from './Call';
import CRMApi from '../core/service/vn/server.api';

// Initialize global logging
// initializeLogging();

i18next.use(initReactI18next).init({
  resources: LanguageSetting.resourcesLanguage,
  fallbackLng: LanguageSetting.defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
});

// const store = configureStore();

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
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const theme = createTheme();

  useEffect(() => {
    i18next.changeLanguage(lang);
  }, [lang]);

  useEffect(() => {
    loadSettings(dispatch);
  }, [dispatch]);

  console.log('auth.authentication >>> ', auth.authentication);

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
  const dispatch = useDispatch();
  const theme = createTheme();

  useEffect(() => {
    i18next.changeLanguage(lang);
  }, [lang]);

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

  // if (isRoot) {
  //   remote.getGlobal('ShareGlobalObject').attempDisableAutoLogin = false;
  // }

  return (
    <Provider store={store}>
      <BrowserRouter>{isRoot ? <MainApp /> : <CallApp />}</BrowserRouter>
    </Provider>
  );
}
