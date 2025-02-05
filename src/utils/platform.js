const isMac = process.platform == 'darwin';
const isWindows = process.platform == 'win32';
const isLinux = process.platform == 'linux';

const isUseMasMacStore = isMac && false;

const webPreferencesConfig = {
  nodeIntegration: true,
};

const ensureFilePathNodeJs = (dirPath) => {
  if (dirPath) {
    return dirPath.replace(/#/gi, '%23');
  }
  return dirPath;
};

export {
  isMac,
  isWindows,
  isLinux,
  isUseMasMacStore,
  webPreferencesConfig,
  ensureFilePathNodeJs,
};
