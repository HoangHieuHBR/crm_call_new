import log from 'electron-log';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import { app } from 'electron';

var appLog;
var rendererLog;

export const configGlobalLogMain = (crmcallServiceCenter) => {
  log.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}] {text}';
  log.transports.file.archiveLog = function (oldFile) {
    oldFile = oldFile.toString();
    const info = path.parse(oldFile);
    try {
      let files = fs.readdirSync(info.dir);
      let count = 0;

      for (let i = files.length - 1; i >= 0; i--) {
        const f = files[i];
        if (f.includes(window.currentDomainLog)) {
          if (count <= 4) {
            count++;
          } else if (f !== `${window.currentDomainLog}.log`) {
            const filePath = path.join(info.dir, f);
            fs.unlinkSync(filePath);
          }
        }
      }

      fs.renameSync(
        oldFile,
        path.join(
          info.dir,
          `${info.name}_${moment().format('YYYY-MM-DD HH_mm_ss')}${info.ext}`,
        ),
      );
    } catch (e) {
      console.warn('Could not rotate log', e);
    }
  };

  // window.crmcallRenderLog = crmcallRenderLog;
};

export const configLoggerMain = () => {
  const logMainName = 'crmcall_main';
  appLog = log.create(logMainName);
  _configLogger(appLog, app.getPath('userData'), logMainName);
};

const _configLogger = (inputLog, appDataDir, logName) => {
  inputLog.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}] {text}';
  inputLog.transports.file.level = 'info';
  inputLog.transports.file.resolvePath = () => {
    let mPath = path.join(appDataDir, 'otherlogs', `${logName}.log`);
    return mPath;
  };
  inputLog.transports.file.maxSize = 5242880;
  inputLog.transports.file.archiveLog = function (oldFile) {
    let oldFilePath = oldFile.toString();
    const info = path.parse(oldFilePath);
    try {
      let files = fs.readdirSync(info.dir);
      let count = 0;

      for (var i = files.length - 1; i >= 0; i--) {
        let f = files[i];
        // LOG DONT NEED CHECK DOMAIN
        if (f.includes(logName)) {
          if (count <= 4) {
            count++;
          } else {
            if (f != logName + '.log') {
              let fPath = path.join(info.dir, f);
              fs.unlinkSync(fPath);
            }
          }
        }
      }

      fs.renameSync(
        oldFilePath,
        path.join(
          info.dir,
          info.name + '_' + dayjs().format('YYYY-MM-DD HH_mm_ss') + info.ext,
        ),
      );
    } catch (e) {
      console.warn('Could not rotate log', e);
    }
  };
};

export { appLog, rendererLog };

