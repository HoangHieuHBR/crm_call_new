// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { platform } from 'node:os';
import { TNWindowOSType } from '../common/electron.types';
import {
  MainChannels,
  MainChannelsAction,
  MainSyncChannels,
  MainSyncChannelsAction,
} from '../common/channels';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    invokeMessage(channel: string, ...args: unknown[]) {
      ipcRenderer.invoke(channel, ...args);
    },
    sendMessage(channel: string, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event: IpcRendererEvent, ...args) =>
        func(...args),
      );
    },
    onceSafe(channel: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.once(channel, subscription);
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    removeAllListeners(channel: string, func: (...args: unknown[]) => void) {
      ipcRenderer.removeAllListeners(channel);
    },
  },
  platform: {
    appPlatform(): TNWindowOSType {
      if (process.platform == 'win32') {
        return 'win32';
      }
      if (process.platform == 'linux') {
        return 'linux';
      }
      if (process.platform == 'darwin') {
        return 'darwin';
      }
      return 'win32';
    },
    /**
     * get url of html file - auto detect localhost or production
     * @returns string -> ex: http://localhost:1212/index.html
     */
    assetAppDir() {
      return ipcRenderer.sendSync(
        MainSyncChannels,
        MainSyncChannelsAction.AssetDir,
        {},
      );
    },
    /**
     * log params to file render. it useful for check log on production
     * @return  void
     */
    logFile(...params: any) {
      ipcRenderer.send(MainChannels, MainChannelsAction.logFile, params);
    },
  },
};

// contextBridge.exposeInMainWorld('electron', electronHandler);

window.electron = electronHandler;

export type ElectronHandler = typeof electronHandler;
