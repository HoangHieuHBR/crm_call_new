/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { app } from 'electron';
import { ensureFilePathNodeJs } from '../utils/platform';

export var webDirName = ensureFilePathNodeJs(__dirname);

export var currentNodeProcessDirName = __dirname;

export const assetResourcePath = () => {
  const resourcePath = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');
  return resourcePath;
};

export const preloadPath = () => {
  return app.isPackaged
    ? path.resolve(__dirname, 'preload.js')
    : path.resolve(__dirname, '../../.erb/dll/preload.js');
};

export const preloadPathWithName = (name: string) => {
  return app.isPackaged
    ? path.join(__dirname, name)
    : path.join(__dirname, `../../.erb/dll/${name}`);
};

export const preloadPathWebViewWithName = (name: string) => {
  return app.isPackaged
    ? path.join(webDirName, name)
    : path.join(webDirName, `../../.erb/dll/${name}`);
};

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function normalURLNodeJSAndWeb(url: string) {
  return url
    .replace('file:///', '')
    .replace('file://', '')
    .split(path.sep)
    .join('/');
}
