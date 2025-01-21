import { remote } from 'electron';
export const openLink = e => {
  e.preventDefault();
  remote.shell
    .openExternal(e.currentTarget.href)
    .then(v => {})
    .catch(error => {});
};

export const openLinkWithURL = url => {
  remote.shell
    .openExternal(url)
    .then(v => {})
    .catch(error => {});
};

export const remoteShowItemInFolder = path => {
  remote.shell.showItemInFolder(path);
};

export const remoteOpenItem = path => {
  if (remote.shell.openItem) {
    remote.shell.openItem(path);
  } else {
    remote.shell.openPath(path);
  }
};

export const remoteGetMediaAccessStatus = mediaType => {
  return remote.systemPreferences.getMediaAccessStatus(mediaType);
};

export const remoteClearClipboard = type => {
  remote.clipboard.clear(type);
};

export const remoteReadClipboard = type => {
  return remote.clipboard.readImage(type);
};

export const remoteAskMediaAccess = mediaType => {
  return remote.systemPreferences.askForMediaAccess(mediaType);
};
