/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  Tray,
  nativeImage,
  Menu,
  ipcMain,
  powerSaveBlocker,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import allTranslation from '../language/electron.lang';
import windowStateKeeper from 'electron-window-state';

var isQuiting = false;
// var networkOnline = true;

// var isBasicUpdater = true;

const WINDOWS_BG_COLOR = '#00000000';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let timerLinuxTray: string | number | NodeJS.Timeout | null | undefined;
let suppendPowerSaverBlockID: number | null = null;
let mainWindowRequireClosed = false;
let latestCallIDWindows: string | null = null;
let callWindowsMap: { [key: string]: BrowserWindow } = {};

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map((name) => installer.default(installer[name], forceDownload)),
  ).catch(console.log);
};

function createTray() {
  if (process.platform === 'darwin') {
  } else {
    const iconImage = process.platform == 'linux' ? 'icon_32.png' : 'icon.ico';
    const image = nativeImage.createFromPath(
      path.join(__dirname, 'images', iconImage),
    );
    tray = new Tray(image);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: allTranslation.text('Open'),
        click: () => {
          if (mainWindow != null) {
            mainWindow.show();
          }
        },
      },
      {
        label: allTranslation.text('Exit'),
        click: () => {
          destroyTray();
          app.quit();
        },
      },
    ]);
    if (process.platform === 'win32') {
      tray.on('click', () => {
        if (mainWindow != null) {
          mainWindow.show();
        }
      });
    }
    tray.setToolTip(allTranslation.text('HanbiroTalk'));
    tray.setContextMenu(contextMenu);
  }
}

function destroyTray() {
  if (tray) {
    tray.destroy();
    tray = null;
  }
  if (timerLinuxTray) {
    clearInterval(timerLinuxTray);
    timerLinuxTray = null;
  }
}

function setupMenuBar(mainWindow: BrowserWindow) {
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
}

function closeAllCallWindows() {
  latestCallIDWindows = null;
  for (let key in callWindowsMap) {
    const window = callWindowsMap[key];
    if (window) {
      window.close();
    }
  }
  callWindowsMap = {};
}

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  let mainWindowState = windowStateKeeper({
    defaultWidth: 1444,
    defaultHeight: 728,
  });

  let options = {
    show: false,
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      webviewTag: true,
    },
    minWidth: 800,
    minHeight: 700,
  };

  // if (process.platform == 'linux') {
  //   options = {
  //     ...options,
  //     icon: path.join(__dirname, 'images', 'icon_linux.png'),
  //   };
  // } else if (process.platform == 'darwin') {
  //   options = {
  //     ...options,
  //     backgroundColor: WINDOWS_BG_COLOR,
  //   };
  // } else {
  //   options = {
  //     ...options,
  //     backgroundColor: WINDOWS_BG_COLOR,
  //     icon: path.join(__dirname, 'images', 'icon.ico'),
  //   };
  // }

  mainWindow = new BrowserWindow(options);

  mainWindowState.manage(mainWindow);

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // mainWindow.webContents.on('crashed', function () {
  //   console.log('app crashed');
  //   destroyTray();
  //   app.quit();
  // });

  mainWindow.on('unresponsive', function () {
    console.log('app unresponsive');
    destroyTray();
    app.quit();
  });

  // mainWindow.addListener('focus', () => {
  //   if (!global.ShareGlobalObject.inLoginPage) {
  //     resumeMessengerCenterService(true);
  //   }
  // });

  // mainWindow.addListener('leave-full-screen', () => {
  //   if (mainWindowRequireClosed) {
  //     mainWindowRequireClosed = false;
  //     if (mainWindow != null) {
  //       mainWindow.hide();
  //     }
  //   }
  // });

  app.on('before-quit', function () {
    isQuiting = true;
  });

  // mainWindow.on('close', (event) => {
  //   if (!isQuiting && !global.ShareGlobalObject.inLoginPage) {
  //     event.preventDefault();
  //     if (mainWindow != null) {
  //       if (mainWindow.isFullScreen()) {
  //         mainWindowRequireClosed = true;
  //         mainWindow.setFullScreen(false);
  //       } else {
  //         mainWindowRequireClosed = false;
  //         mainWindow.hide();
  //       }
  //     }
  //     event.returnValue = false;
  //   }
  // });

  mainWindow.on('closed', () => {
    if (suppendPowerSaverBlockID) {
      powerSaveBlocker.stop(suppendPowerSaverBlockID);
      suppendPowerSaverBlockID = null;
    }
    closeAllCallWindows();
    mainWindow = null;
  });

  // init language
  // const lang = appPrefs.getLanguage();
  // if (lang == null || lang == '') {
  //   const locale = app.getLocale();
  //   appPrefs.setLanguage(locale, (langCode) => {
  //     allTranslation.setLanguage(__dirname, langCode);
  //   });
  // } else {
  //   appPrefs.updateLanguageCode(lang, (langCode) => {
  //     allTranslation.setLanguage(__dirname, langCode);
  //   });
  // }

  timerLinuxTray = setInterval(() => {
    if (process.platform == 'linux' && tray && tray.isDestroyed()) {
      createTray();
    }
  }, 30000);

  //create after init language
  createTray();

  setupMenuBar(mainWindow);

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
