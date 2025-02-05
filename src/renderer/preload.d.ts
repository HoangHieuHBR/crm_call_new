import { ElectronHandler } from '../main/preload';
import { ElectronLog } from 'electron-log';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    mainTalkRendererLog?: ElectronLog;
    ResizeObserver: typeof ResizeObserver;
  }
}

export {};
