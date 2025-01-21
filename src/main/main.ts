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
  BrowserWindowConstructorOptions,
  powerMonitor,
  screen,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import * as constantsApp from '../configs/constant';
import allTranslation from '../language/electron.lang';
import windowStateKeeper from 'electron-window-state';
import appPrefs from '../core/utils/pref';
import * as windowSizeConfig from '../configs/window.size.config';
import crmcallServiceCenter from '../core/service/ko/crmcallservice';
import CRMCallData from '../core/service/vn/crmcall.data';
import { resolveHtmlPath } from './util';

const WINDOWS_BG_COLOR = '#00000000';

declare global {
  var ShareGlobalObject: {
    inLoginPage: boolean;
    attempDisableAutoLogin: boolean;
    loginGlobal: {
      domain: string | null;
      data: any | null;
    };
    isFileLogger: boolean;
  };
}

function cloneObjGlobal() {
  global.ShareGlobalObject = {
    inLoginPage: true,
    attempDisableAutoLogin: false,
    loginGlobal: {
      domain: null,
      data: null,
    },
    isFileLogger: false,
  };
}
cloneObjGlobal();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const isPrimaryInstance = app.requestSingleInstanceLock();

if (!isPrimaryInstance) {
  console.log('Second instance => quit');
  app.quit();
} else {
  let isQuiting = false;
  let networkOnline = true;
  let isBasicUpdater = true;
  let mainWindow: BrowserWindow | null = null;
  let tray: Tray | null = null;
  let timerLinuxTray: string | number | NodeJS.Timeout | null | undefined;
  let suppendPowerSaverBlockID: number | null = null;
  let mainWindowRequireClosed = false;
  let latestCallIDWindows: string | null = null;
  let callWindowsMap: { [key: string]: BrowserWindow } = {};

  function runAutoUpdate(domain: string | null, basicUpdate: boolean) {
    isBasicUpdater = basicUpdate;
    if (domain == null || domain == '') {
      return;
    }

    const updateDomain = domain;

    let url = '';
    if (basicUpdate) {
      url = `https://${updateDomain}/winapp/hcsong/crmcall/`;
    } else {
      url = `https://${updateDomain}/winapp/hcsong/crmcall/`;
    }

    console.log('BEGIN UPDATE URL', url);

    autoUpdater.setFeedURL({
      provider: 'generic',
      url: url,
    });
    autoUpdater
      .checkForUpdates()
      .then((r) => {
        console.log('r', r);
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
      extensions.map((name) =>
        installer.default(installer[name], forceDownload),
      ),
    ).catch(console.log);
  };

  function createTray() {
    if (process.platform === 'darwin') {
    } else {
      const iconImage =
        process.platform == 'linux' ? 'icon_32.png' : 'icon.ico';
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

  function setupMenuBar() {
    const menuBuilder = new MenuBuilder(mainWindow as BrowserWindow);
    menuBuilder.buildMenu();
  }

  const createWindow = async () => {
    if (isDebug) {
      await installExtensions();
    }

    let mainWindowState = windowStateKeeper({
      defaultWidth: 1444,
      defaultHeight: 728,
    });

    let options: BrowserWindowConstructorOptions = {
      show: false,
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height,
      webPreferences: {
        contextIsolation: false,
        // enableRemoteModule: true,
        nodeIntegrationInWorker: true,
        nodeIntegration: true,
        webviewTag: true,
      },
      minWidth: 800,
      minHeight: 700,
    };

    if (process.platform == 'linux') {
      options = {
        ...options,
        icon: path.join(__dirname, 'images', 'icon_linux.png'),
      };
    } else if (process.platform == 'darwin') {
      options = {
        ...options,
        backgroundColor: WINDOWS_BG_COLOR,
      };
    } else {
      options = {
        ...options,
        backgroundColor: WINDOWS_BG_COLOR,
        icon: path.join(__dirname, 'images', 'icon.ico'),
      };
    }

    mainWindow = new BrowserWindow(options);

    mainWindowState.manage(mainWindow);

    mainWindow.loadURL(resolveHtmlPath('index.html'));

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

    mainWindow.webContents.on('render-process-gone', function () {
      console.log('app crashed');
      destroyTray();
      app.quit();
    });

    mainWindow.on('unresponsive', function () {
      console.log('app unresponsive');
      destroyTray();
      app.quit();
    });

    mainWindow.addListener('focus', () => {
      if (!global.ShareGlobalObject.inLoginPage) {
        resumeMessengerCenterService(true);
      }
    });

    mainWindow.addListener('leave-full-screen', () => {
      if (mainWindowRequireClosed) {
        mainWindowRequireClosed = false;
        if (mainWindow != null) {
          mainWindow.hide();
        }
      }
    });

    app.on('before-quit', function () {
      isQuiting = true;
    });

    mainWindow.on('close', (event) => {
      if (!isQuiting && !global.ShareGlobalObject.inLoginPage) {
        event.preventDefault();
        if (mainWindow != null) {
          if (mainWindow.isFullScreen()) {
            mainWindowRequireClosed = true;
            mainWindow.setFullScreen(false);
          } else {
            mainWindowRequireClosed = false;
            mainWindow.hide();
          }
        }
      }
    });

    mainWindow.on('closed', () => {
      if (suppendPowerSaverBlockID) {
        powerSaveBlocker.stop(suppendPowerSaverBlockID);
        suppendPowerSaverBlockID = null;
      }
      closeAllCallWindows();
      mainWindow = null;
    });

    // init language
    const lang = appPrefs.getLanguage();
    if (lang == null || lang == '') {
      const locale = app.getLocale();
      appPrefs.setLanguage(locale, (langCode: string) => {
        allTranslation.setLanguage(__dirname, langCode);
      });
    } else {
      appPrefs.updateLanguageCode(lang, (langCode: string) => {
        allTranslation.setLanguage(__dirname, langCode);
      });
    }

    timerLinuxTray = setInterval(() => {
      if (process.platform == 'linux' && tray && tray.isDestroyed()) {
        createTray();
      }
    }, 30000);

    //create after init language
    createTray();

    setupMenuBar();

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater();
  };

  const createCallWindows = async (
    callid: string | null,
    data: { emptyHistory: any; calling?: any },
    callback: { (): void; (): void; (): void },
  ) => {
    let width;
    let height;
    if (data.emptyHistory) {
      width = windowSizeConfig.CALL_EMPTY_HISTORY_WIDTH;
      height = windowSizeConfig.CALL_NORMAL_HEIGHT;
    } else {
      width = data.calling
        ? windowSizeConfig.CALL_SMALL_WIDTH
        : windowSizeConfig.CALL_NORMAL_WIDTH;
      height = data.calling
        ? windowSizeConfig.CALL_SMALL_HEIGHT
        : windowSizeConfig.CALL_NORMAL_HEIGHT;
    }

    let options: BrowserWindowConstructorOptions = {
      show: false,
      width: width,
      height: height,
      maximizable: false,
      fullscreen: false,
      fullscreenable: false,
      resizable: false,
      webPreferences: {
        contextIsolation: false,
        // enableRemoteModule: true,
        nodeIntegrationInWorker: true,
        nodeIntegration: true,
        webviewTag: true,
      },
      minWidth: 400,
      minHeight: 300,
    };

    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    const winBounds = mainWindow.getBounds();
    const distScreen = screen.getDisplayNearestPoint({
      x: winBounds.x,
      y: winBounds.y,
    });

    const screenBounds = distScreen.workArea;
    const areaWidth = screenBounds.width;
    const areaHeight = screenBounds.height;

    var config = appPrefs.getCallInfoDock();
    if (config == 0) {
      // bottom left
      options = {
        ...options,
        x: screenBounds.x,
        y: screenBounds.y + areaHeight - height,
      };
    } else if (config == 1) {
      // center
      options = {
        ...options,
        x: parseInt((screenBounds.x + (areaWidth - width) / 2).toString()),
        y: parseInt((screenBounds.y + (areaHeight - height) / 2).toString()),
      };
    } else if (config == 2) {
      // bottom right
      options = {
        ...options,
        x: screenBounds.x + areaWidth - width,
        y: screenBounds.y + areaHeight - height,
      };
    }

    console.log('options ', options);

    if (process.platform == 'linux') {
      options = {
        ...options,
        icon: path.join(__dirname, 'images', 'icon_linux.png'),
      };
    } else if (process.platform == 'darwin') {
      options = {
        ...options,
        backgroundColor: WINDOWS_BG_COLOR,
      };
    } else {
      options = {
        ...options,
        backgroundColor: WINDOWS_BG_COLOR,
        icon: path.join(__dirname, 'images', 'icon.ico'),
      };
    }

    let callWindow = new BrowserWindow(options);
    callWindow.loadURL(`file://${__dirname}/call_index.html?callid=${callid}`);
    if (callid) {
      callWindowsMap[callid] = callWindow;
    }

    if (callid && !callid.startsWith('NHAN_EMPTY_CALL_ID_')) {
      latestCallIDWindows = callid;
    }

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    callWindow.webContents.on('did-finish-load', () => {
      if (!callWindow) {
        throw new Error('"call windows" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        callWindow.minimize();
      } else {
        callWindow.show();
        callWindow.focus();
      }
      if (callback) {
        callback();
      }
    });

    callWindow.on('closed', () => {
      if (callid) {
        delete callWindowsMap[callid];
      }
      CRMCallData.removeProfile(callid);
    });

    callWindow.webContents.on('render-process-gone', function () {
      console.log('app crashed');
      closeAllCallWindows();
    });

    callWindow.on('unresponsive', function () {
      console.log('app unresponsive');
      closeAllCallWindows();
    });

    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      callWindow.webContents.openDevTools();
    }
  };

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

  /**
   * Add event listeners...
   */

  app.on('will-quit', () => {});

  app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  autoUpdater.on('update-downloaded', (event) => {
    sendEventToMainBrowserWindow(
      constantsApp.MAIN_TO_RENDER_EVENT,
      constantsApp.ACTION_NEW_UPDATE_VERSION_DOWNLOADED,
      {
        version: event.version,
        releaseNotes: event.releaseNotes,
      },
    );
  });

  autoUpdater.on('error', (_error) => {
    // if (isBasicUpdater) {
    //   const status = error.message;
    //   if (
    //     status &&
    //     (status.includes('status 404: Not Found') ||
    //       status.includes('HttpError: 404 Not Found'))
    //   ) {
    //     appPrefs.loadAccountInfo(account => {
    //       runAutoUpdate(account.domain, false);
    //     });
    //   }
    // }
  });

  app.on('second-instance', (_event, _commandLine, _workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      } else {
        mainWindow.show();
      }
      mainWindow.focus();
    }
  });

  function sendEventToMainBrowserWindow(
    event: string,
    actionName: string,
    data: any,
  ) {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send(event, actionName, data);
    }
  }

  function sendEventToAllCallBrowserWindow(
    event: string,
    actionName: string,
    data: any,
  ) {
    for (let key in callWindowsMap) {
      const browser = callWindowsMap[key];
      if (browser && browser.webContents) {
        browser.webContents.send(event, actionName, data);
      }
    }
  }

  function delay(time: number | undefined) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  function sendEventToCallBrowserWindowWithCallID(
    event: string,
    actionName: string,
    callId: string,
    data: any,
  ) {
    const windows = callWindowsMap[callId];

    if (windows && windows.webContents) {
      windows.webContents.send(event, actionName, data);
    }
  }

  function resumeMessengerCenterService(reset: boolean) {
    console.log('resumeMessengerCenterService');
    appPrefs.loadAllAppSetting((acc: { mode_country: string }) => {
      if (acc.mode_country == constantsApp.MODE_COUNTRY.korean) {
        crmcallServiceCenter.reconnectService(reset);
      } else {
        sendEventToMainBrowserWindow(
          constantsApp.MAIN_TO_RENDER_EVENT,
          constantsApp.ACTION_RESUME_SERVICE_IF_CAN,
          { reset: reset },
        );
      }
    });
  }

  // Set up power monitor event handlers
  function setupPowerMonitorHandlers() {
    powerMonitor.on('suspend', () => {
      console.log('System suspended.');
      const started =
        suppendPowerSaverBlockID != null &&
        powerSaveBlocker.isStarted(suppendPowerSaverBlockID);

      if (!started) {
        suppendPowerSaverBlockID = powerSaveBlocker.start(
          'prevent-app-suspension',
        );
      }
      console.log('suppendPowerSaverBlockID', started);
    });

    powerMonitor.on('lock-screen', () => {
      console.log('Screen locked.');
      const started =
        suppendPowerSaverBlockID != null &&
        powerSaveBlocker.isStarted(suppendPowerSaverBlockID);

      if (!started) {
        suppendPowerSaverBlockID = powerSaveBlocker.start(
          'prevent-app-suspension',
        );
      }
      console.log('suppendPowerSaverBlockID', started);
      // stopMessengerCenterService();
    });

    powerMonitor.on('resume', () => {
      console.log('System resumed.');
      resumeMessengerCenterService(true);
    });

    powerMonitor.on('unlock-screen', () => {
      console.log('Screen unlocked.');
      resumeMessengerCenterService(true);
    });
  }

  ipcMain.on('crm_call_center_event', (event, action, data) => {
    console.log('crm_call_center_event', action, data);
    sendEventToMainBrowserWindow(
      constantsApp.MAIN_TO_RENDER_EVENT,
      action,
      data,
    );
  });

  ipcMain.on('crm_call_center_event_recent_callid', (event, data) => {
    if (latestCallIDWindows) {
      const newData = data.data;
      if (newData) {
        console.log('crm_call_center_event_recent_callid', newData);
        crmcallServiceCenter.sendGetUserInfo({
          callId: latestCallIDWindows,
          phone: newData.number,
          status: crmcallServiceCenter.currentMyStatus,
        });
      }

      sendEventToCallBrowserWindowWithCallID(
        constantsApp.MAIN_TO_RENDER_EVENT,
        constantsApp.ACTION_UPDATE_DATA_FROM_MAIN,
        latestCallIDWindows,
        data,
      );
    }
  });

  ipcMain.on(
    constantsApp.COMMON_ASYNC_ACTION_FROM_RENDER,
    (_event, action, data) => {
      if (action == constantsApp.ACTION_ASYNC_LOGIN_SUCCESS) {
        const domain = data.domain;
        if (domain) {
          runAutoUpdate(domain, true);
        }
      } else if (
        action == constantsApp.ACTION_REQUEST_QUIT_AND_INSTALL_NEW_APP
      ) {
        app.removeAllListeners('window-all-closed');
        const browserWindows = BrowserWindow.getAllWindows();
        browserWindows.forEach(function (browserWindow) {
          browserWindow.removeAllListeners('close');
        });
        autoUpdater.quitAndInstall(true, true);
      } else if (action == constantsApp.ACTION_REQUEST_TRANSFER_CALL) {
        appPrefs.loadAllAppSetting((acc: { mode_country: string }) => {
          if (acc.mode_country == constantsApp.MODE_COUNTRY.korean) {
          } else {
            sendEventToMainBrowserWindow(
              constantsApp.MAIN_TO_RENDER_EVENT,
              constantsApp.ACTION_REQUEST_TRANSFER_CALL,
              data,
            );
          }
        });
      } else if (action == constantsApp.ACTION_REQUEST_MAKE_CALL) {
        appPrefs.loadAllAppSetting((acc: { mode_country: string }) => {
          if (acc.mode_country == constantsApp.MODE_COUNTRY.korean) {
            crmcallServiceCenter.sendMakeCall(data);
          } else {
            sendEventToMainBrowserWindow(
              constantsApp.MAIN_TO_RENDER_EVENT,
              constantsApp.ACTION_REQUEST_MAKE_CALL,
              data,
            );
          }
        });
      } else if (action == constantsApp.ACTION_ASYNC_LOGIN_WITH_DOMAIN_ID) {
        crmcallServiceCenter.loginWithDomainUserIdPassword(
          data.domain,
          data.userid,
          data.password,
          data.extend,
          data.otpcode,
          data.extraLoginWithoutOTP,
        );
      } else if (action == constantsApp.ACTION_ASYNC_CANCEL_LOGIN) {
        crmcallServiceCenter.cancelLogin();
      } else if (action == constantsApp.ACTION_ASYNC_DO_LOGOUT) {
        crmcallServiceCenter.logout(() => {
          CRMCallData.clearAllData();
          appPrefs.clearAcccount(false, () => {
            closeAllCallWindows();
            sendEventToMainBrowserWindow(
              constantsApp.MAIN_TO_RENDER_EVENT,
              constantsApp.ACTION_MOVE_TO_LOGIN_PAGE,
              {},
            );
          });
        });
      } else if (action == constantsApp.ACTION_ASYNC_NETWORK_STATUS_CHANGED) {
        const status = data.status;
        if (status === 'offline') {
          if (networkOnline == true) {
            networkOnline = false;
            crmcallServiceCenter._resetNumberRetry();
            crmcallServiceCenter.disconnectService();
          }
        } else {
          if (networkOnline == false) {
            networkOnline = true;
            crmcallServiceCenter.reconnectService(true);
          }
        }
      } else if (action == 'TIENTH_DEMO_CALL_KO_SERVICE') {
        // Incoming call -> cancel => OKE DONE
        // crmcallServiceCenter.parserXMLResponsePackageDemo('<?xml version="1.0" ?><XML><VER>20150202</VER><SIP><CALLSTATUS CALLID="4aa7010bad96e1c1ff486cb4a5e534bc@10.1.1.181" DIRECTION="INBOUND" EVENT="INVITE" FROM="01038722847" TIME="1712129994" TO="504"/></SIP></XML>');
        //       delay(5000).then(() => {
        //         crmcallServiceCenter.parserXMLResponsePackageDemo('<?xml version="1.0" ?><XML><VER>20150202</VER><SIP><CALLSTATUS CALLID="4aa7010bad96e1c1ff486cb4a5e534bc@10.1.1.181" DIRECTION="INBOUND" EVENT="CANCEL" FROM="01038722847" TIME="1712130000" TO="504"/></SIP></XML>');
        //       });
        // Incoming call -> busy => OKE DONE
        // crmcallServiceCenter.parserXMLResponsePackageDemo('<?xml version="1.0" ?><XML><VER>20150202</VER><SIP><CALLSTATUS CALLID="4aa7010bad96e1c1ff486cb4a5e534bc@10.1.1.181" DIRECTION="INBOUND" EVENT="INVITE" FROM="504" TIME="1712129994" TO="01038722847"/></SIP></XML>');
        // delay(5000).then(() => {
        //   crmcallServiceCenter.parserXMLResponsePackageDemo('<?xml version="1.0" ?><XML><VER>20150202</VER><SIP><CALLSTATUS CALLID="4aa7010bad96e1c1ff486cb4a5e534bc@10.1.1.181" DIRECTION="INBOUND" EVENT="BUSY" FROM="504" TIME="1712130000" TO="01038722847"/></SIP></XML>');
        // });

        // answer => OKE DONE
        crmcallServiceCenter.parserXMLResponsePackageDemo(
          '<?xml version="1.0" ?><XML><VER>20150202</VER><SIP><CALLSTATUS CALLID="4aa7010bad96e1c1ff486cb4a5e534bc@10.1.1.181" DIRECTION="INBOUND" EVENT="INVITE" FROM="504" TIME="1712129994" TO="01038722847"/></SIP></XML>',
        );
        // delay(3000).then(() => {
        //   crmcallServiceCenter.parserXMLResponsePackageDemo('<?xml version="1.0" ?><XML><VER>20150202</VER><SIP><CALLSTATUS CALLID="4aa7010bad96e1c1ff486cb4a5e534bc@10.1.1.181" DIRECTION="INBOUND" EVENT="INVITE_RESULT" FROM="504" TIME="1712130000" TO="01038722847"/></SIP></XML>');
        // });

        // delay(15000).then(() => {
        //   crmcallServiceCenter.parserXMLResponsePackageDemo('<?xml version="1.0" ?><XML><VER>20150202</VER><SIP><CALLSTATUS CALLID="4aa7010bad96e1c1ff486cb4a5e534bc@10.1.1.181" DIRECTION="INBOUND" EVENT="BYE" FROM="504" TIME="1712130000" TO="01038722847"/></SIP></XML>');
        // });

        // make call -> cancel => OKE DONE
        // crmcallServiceCenter.parserXMLResponsePackageDemo('<?xml version="1.0" ?><XML><VER>20150202</VER><SIP><CALLSTATUS CALLID="4aa7010bad96e1c1ff486cb4a5e534bc@10.1.1.181" DIRECTION="OUTBOUND" EVENT="INVITE" FROM="504" TIME="1712129994" TO="01038722847"/></SIP></XML>');
        //       delay(3000).then(() => {
        //         crmcallServiceCenter.parserXMLResponsePackageDemo('<?xml version="1.0" ?><XML><VER>20150202</VER><SIP><CALLSTATUS CALLID="4aa7010bad96e1c1ff486cb4a5e534bc@10.1.1.181" DIRECTION="OUTBOUND" EVENT="CANCEL" FROM="504" TIME="1712130000" TO="01038722847"/></SIP></XML>');
        //       });

        // make call -> busy
        // crmcallServiceCenter.parserXMLResponsePackageDemo('<?xml version="1.0" ?><XML><VER>20150202</VER><SIP><CALLSTATUS CALLID="4aa7010bad96e1c1ff486cb4a5e534bc@10.1.1.181" DIRECTION="OUTBOUND" EVENT="INVITE" FROM="504" TIME="1712129994" TO="01038722847"/></SIP></XML>');
        //       delay(3000).then(() => {
        //         crmcallServiceCenter.parserXMLResponsePackageDemo('<?xml version="1.0" ?><XML><VER>20150202</VER><SIP><CALLSTATUS CALLID="4aa7010bad96e1c1ff486cb4a5e534bc@10.1.1.181" DIRECTION="OUTBOUND" EVENT="BUSY" FROM="504" TIME="1712130000" TO="01038722847"/></SIP></XML>');
        //       });

        // make call -> awnser

        // crmcallServiceCenter.parserXMLResponsePackageDemo(
        //   '<?xml version="1.0" ?><XML><VER>20150202</VER><SIP><CALLSTATUS CALLID="4aa7010bad96e1c1ff486cb4a5e534bc@10.1.1.181" DIRECTION="OUTBOUND" EVENT="INVITE" FROM="504" TIME="1712129994" TO="01038722847"/></SIP></XML>',
        // );
        // delay(3000).then(() => {
        //   crmcallServiceCenter.parserXMLResponsePackageDemo(
        //     '<?xml version="1.0" ?><XML><VER>20150202</VER><SIP><CALLSTATUS CALLID="4aa7010bad96e1c1ff486cb4a5e534bc@10.1.1.181" DIRECTION="OUTBOUND" EVENT="INVITE_RESULT" FROM="504" TIME="1712130000" TO="01038722847"/></SIP></XML>',
        //   );
        // });

        // delay(15000).then(() => {
        //   crmcallServiceCenter.parserXMLResponsePackageDemo(
        //     '<?xml version="1.0" ?><XML><VER>20150202</VER><SIP><CALLSTATUS CALLID="4aa7010bad96e1c1ff486cb4a5e534bc@10.1.1.181" DIRECTION="OUTBOUND" EVENT="BYE" FROM="504" TIME="1712130000" TO="01038722847"/></SIP></XML>',
        //   );
        // });
      }
    },
  );

  ipcMain.on(
    constantsApp.COMMON_SYNC_ACTION_FROM_RENDER,
    (event, action, data) => {
      if (action == constantsApp.ACTION_SYNC_GET_LANGUAGE) {
        event.returnValue = appPrefs.getLanguageDef();
      } else if (action == constantsApp.ACTION_SYNC_SET_LANGUAGE) {
        appPrefs.setLanguage(data, (langCode: string) => {
          allTranslation.setLanguage(__dirname, langCode);
          destroyTray();
          createTray();
          setupMenuBar();
          event.returnValue = true;
        });
      } else if (action == constantsApp.ACTION_SYNC_GET_OPEN_AT_LOGIN) {
        const result = app.getLoginItemSettings().openAtLogin;
        event.returnValue = result;
      } else if (action == constantsApp.ACTION_SYNC_SET_OPEN_AT_LOGIN) {
        app.setLoginItemSettings({ openAtLogin: data });
        event.returnValue = true;
      } else if (action == constantsApp.ACTION_SYNC_GET_CALL_DOCK) {
        event.returnValue = appPrefs.getCallInfoDock();
      } else if (action == constantsApp.ACTION_SYNC_SET_CALL_DOCK) {
        appPrefs.setCallInfoDock(data);
        event.returnValue = true;
      } else if (action == constantsApp.ACTION_SYNC_SAVE_ACCOUNT_INFO) {
        appPrefs.setAccountInfo(data, () => {
          crmcallServiceCenter.updateLoginResultObject(data.extraData);
          event.returnValue = true;
        });
      } else if (action == constantsApp.ACTION_SYNC_CLEAR_ACCOUNT_INFO) {
        closeAllCallWindows();
        CRMCallData.clearAllData();
        appPrefs.clearAcccount(data.clearAll, () => {
          event.returnValue = true;
        });
      } else if (action == constantsApp.ACTION_SYNC_CLEAR_PASSWORD) {
        appPrefs.clearPassword(() => {
          event.returnValue = true;
        });
      } else if (action == constantsApp.ACTION_SYNC_GET_ACCOUNT_INFO) {
        appPrefs.loadAccountInfo((account: any) => {
          event.returnValue = account;
        });
      } else if (action == constantsApp.ACTION_SYNC_GET_GLOBAL_CALL_CONFIG) {
        event.returnValue = CRMCallData.toMap();
      } else if (
        action == constantsApp.ACTION_SYNC_UPDATE_CRM_CALL_DATA_ALL_WINDOWS
      ) {
        CRMCallData.handleEventData(data);
        sendEventToAllCallBrowserWindow(
          constantsApp.MAIN_TO_RENDER_EVENT,
          constantsApp.ACTION_UPDATE_DATA_FROM_MAIN,
          data,
        );
        event.returnValue = true;
      } else if (
        action == constantsApp.ACTION_SYNC_OPEN_AND_UPDATE_DATA_TO_CALL_WINDOWS
      ) {
        const forceShow = data.forceShow;
        const callid = data.callid;

        CRMCallData.handleEventData(data);

        if (callid == null || callid == '') {
          event.returnValue = true;
          return;
        }

        const window = callWindowsMap[callid];
        if (window) {
          sendEventToCallBrowserWindowWithCallID(
            constantsApp.MAIN_TO_RENDER_EVENT,
            constantsApp.ACTION_UPDATE_DATA_FROM_MAIN,
            callid,
            data,
          );
          event.returnValue = true;
        } else {
          if (forceShow) {
            createCallWindows(callid, data, () => {
              sendEventToCallBrowserWindowWithCallID(
                constantsApp.MAIN_TO_RENDER_EVENT,
                constantsApp.ACTION_UPDATE_DATA_FROM_MAIN,
                callid,
                data,
              );
              event.returnValue = true;
            });
          } else {
            event.returnValue = true;
          }
        }
      } else if (action == constantsApp.ACTION_SYNC_OPEN_EMPTY_CALL_WINDOWS) {
        const callid = `NHAN_EMPTY_CALL_ID_${Date.now()}`;
        const exampleData = {
          emptyHistory: true,
        };
        createCallWindows(callid, exampleData, () => {
          sendEventToCallBrowserWindowWithCallID(
            constantsApp.MAIN_TO_RENDER_EVENT,
            constantsApp.ACTION_UPDATE_DATA_FROM_MAIN,
            callid,
            exampleData,
          );
          event.returnValue = true;
        });
      }
    },
  );

  app
    .whenReady()
    .then(() => {
      createWindow();
      setupPowerMonitorHandlers();

      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
          createWindow();
        } else {
          mainWindow.show();
          if (process.platform === 'darwin') {
            Object.values(callWindowsMap).forEach((window) => {
              if (window) {
                window.moveTop();
              }
            });
          }
        }
      });
    })
    .catch(console.log);
}
