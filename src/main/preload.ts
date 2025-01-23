// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

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
};

// contextBridge.exposeInMainWorld('electron', electronHandler);

window.electron = electronHandler;


export type ElectronHandler = typeof electronHandler;
