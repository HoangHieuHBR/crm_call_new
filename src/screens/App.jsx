import { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { createTheme, LanguageSetting } from '../configs';
import { RootState } from '../reducers';
import { configureStore } from '../store';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import * as Utils from '../utils';
import * as ipc from '../utils/ipc';
import * as Actions from '../actions';
import * as constantsApp from '../configs/constant';
import * as remote from '@electron/remote';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import './App.css';
import CRMApi from '../core/service/vn/server.api';

import Login from './Login';
import HomePage from './home';
import Call from './Call';
import { is } from 'date-fns/locale';

window.currentDomainLog = 'unknown_render';
const crmcallRenderLog = {
  transports: {
    console: {
      format: '[{y}-{m}-{d} {h}:{i}:{s}] {text}',
    },
    file: {
      archiveLog(oldFile) {
        const info = require('path').parse(oldFile);
        try {
          const fs = require('fs');
          let files = fs.readdirSync(info.dir);
          let count = 0;

          for (const f of files) {
            if (f.includes(window.currentDomainLog)) {
              if (count <= 4) {
                count++;
              } else if (f !== `${window.currentDomainLog}.log`) {
                fs.unlinkSync(require('path').join(info.dir, f));
              }
            }
          }

          fs.renameSync(
            oldFile,
            require('path').join(
              info.dir,
              `${info.name}_${new Date().toISOString().replace(/[:.]/g, '_')}${info.ext}`,
            ),
          );
        } catch (e) {
          console.warn('Could not rotate log', e);
        }
      },
    },
  },
};

window.crmcallRenderLog = crmcallRenderLog;

const initializeI18n = (lang) => {
  i18n.use(initReactI18next).init({
    resources: LanguageSetting.resourcesLanguage,
    lng: lang,
    fallbackLng: LanguageSetting.defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });
};

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
    initializeI18n(lang);
  }, [lang]);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const theme = createTheme();

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
    initializeI18n(lang);
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
  const store = configureStore();

  if (isRoot) {
    remote.getGlobal('ShareGlobalObject').attempDisableAutoLogin = false;
  }

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="*" element={isRoot ? <MainApp /> : <CallApp />} />
        </Routes>
      </Router>
    </Provider>
  );
}
