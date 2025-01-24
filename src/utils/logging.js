import log from 'electron-log';
import path from 'path';
import fs from 'fs';
import moment from 'moment';

export const initializeLogging = () => {
  window.currentDomainLog = 'unknown_render';

  const crmcallRenderLog = log.create('crmcallRenderLog');
  crmcallRenderLog.transports.console.format =
    '[{y}-{m}-{d} {h}:{i}:{s}] {text}';
  crmcallRenderLog.transports.file.archiveLog = function (oldFile) {
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

  window.crmcallRenderLog = crmcallRenderLog;
};
