import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducers';
import { configureStore } from '../store';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useEffect } from 'react';
import * as Utils from '../utils';
import * as Actions from '../actions';
import * as constantsApp from '../configs/constant';
import './App.css';

const store = configureStore();

function MainApp() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const theme = createTheme();

  useEffect(() => {
    // Load settings from localStorage or equivalent
    const storageSettings = [
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
      {
        key: constantsApp.STORAGE_DARK_MODE,
        action: Actions.changeDarkTheme,
      },
      {
        key: constantsApp.STORAGE_COMMON_SETTING,
        action: Actions.changeCommonSetting,
      },
    ];

    storageSettings.forEach(({ key, action }) => {
      const value = Utils.getDataFromStorage(key);
      if (value) dispatch(action(value));
    });
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* {auth.authentication ? <HomePage /> : <Login />} */}
      </LocalizationProvider>
    </ThemeProvider>
  );
}

function CallApp() {
  const dispatch = useDispatch();
  const theme = createTheme();

  useEffect(() => {
    // Load settings from localStorage or equivalent
    const storageSettings = [
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
      {
        key: constantsApp.STORAGE_DARK_MODE,
        action: Actions.changeDarkTheme,
      },
      {
        key: constantsApp.STORAGE_COMMON_SETTING,
        action: Actions.changeCommonSetting,
      },
    ];

    storageSettings.forEach(({ key, action }) => {
      const value = Utils.getDataFromStorage(key);
      if (value) dispatch(action(value));
    });
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* <Call /> */}
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default function App() {
  const mainElement =
    document.getElementById('root') || document.getElementById('call');
  const isCallApp = mainElement?.id === 'call';

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {isCallApp ? (
            <Route path="*" element={<CallApp />} />
          ) : (
            <Route path="*" element={<MainApp />} />
          )}
        </Routes>
      </Router>
    </Provider>
  );
}
