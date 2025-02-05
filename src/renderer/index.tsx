import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../screens/App';
// import { is } from 'date-fns/locale';
// import { createTheme, LanguageSetting } from '../configs';
// import { configureStore, history } from '../store';
// import { initializeLogging } from '../utils/logging';
// import { initReactI18next } from 'react-i18next';
// import i18next from 'i18next';
// import * as Utils from '../utils';
// import * as Actions from '../actions';
// import * as constantsApp from '../configs/constant';

// // Initialize global logging
// initializeLogging();

// i18next.use(initReactI18next).init({
//   resources: LanguageSetting.resourcesLanguage,
//   fallbackLng: LanguageSetting.defaultLanguage,
//   interpolation: {
//     escapeValue: false,
//   },
// });

const container = document.getElementById('root') as HTMLElement;
// const isRoot = container?.id === 'root';

// const store = configureStore();

// const loadSettings = (dispatch: any) => {
//   const settings = [
//     { key: constantsApp.STORAGE_FONT, action: Actions.onChangeFont },
//     { key: constantsApp.STORAGE_FONT_SIZE, action: Actions.onChangeFontSize },
//     {
//       key: constantsApp.STORAGE_PRIMARY_THEME,
//       action: Actions.changePrimaryTheme,
//     },
//     {
//       key: constantsApp.STORAGE_SECONDARY_THEME,
//       action: Actions.changeSecondaryTheme,
//     },
//     { key: constantsApp.STORAGE_DARK_MODE, action: Actions.changeDarkTheme },
//     {
//       key: constantsApp.STORAGE_COMMON_SETTING,
//       action: Actions.changeCommonSetting,
//     },
//   ];

//   settings.forEach(({ key, action }) => {
//     const value = Utils.getDataFromStorage(key);
//     if (value) dispatch(action(value));
//   });
// };

// if (!isRoot) {
// }

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
