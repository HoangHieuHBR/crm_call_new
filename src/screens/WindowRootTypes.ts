import React from "react";
import { TNWindowOSType } from "../common/electron.types";

export const ElectronWindowContext =
  React.createContext<TNWindowOSType>('win32');

type ElectronRootCommonContextProps = {
  assetRoot: string;
  webviewPreloadPath: string;
  architecture: string;
  isWayland: boolean;
  externalEmojiDataPath: string;
};

export const ElectronRootCommonContext =
  React.createContext<ElectronRootCommonContextProps>({
    isWayland: false,
    architecture: '',
    assetRoot: '',
    webviewPreloadPath: '',
    externalEmojiDataPath: '',
  });
