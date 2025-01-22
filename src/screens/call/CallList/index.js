import React, { useState, useEffect } from 'react';
import { useStyles } from './styles';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import HanHistory from '../../../components/HanHistory';
import General from './components/General';
import CRMApi from '../../../core/service/vn/server.api';
import Button from '@material-ui/core/Button';
import { startGetGlobalConfig } from '../../controller';
import { CALL_DIRECTION } from '../../../configs/constant';
import * as remote from '@electron/remote';

export default function CallListDialog(props) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const crrCall = useSelector(state => state.call.currentCall);
  const settings = useSelector(state => state.call.globalSettings);
  const { callData } = crrCall;
  const [contentHistory, setContentHistory] = useState(null);
  const emptyHistory = window.emptyHistory;

  useEffect(() => {
    remote.getCurrentWindow().setAlwaysOnTop(false);
  }, []);

  const incomming = callData?.direction == CALL_DIRECTION.INBOUND;

  const onReloadHistory = () => {
    if (contentHistory) {
      contentHistory.onRefresh();
    }
  };

  return (
    <div className={classes.wrapperCallComing}>
      {emptyHistory ? (
        <General settings={settings} onReloadHistory={onReloadHistory} />
      ) : (
        <>
          <div style={{ flex: 2, minWidth: 600 }}>
            <General settings={settings} onReloadHistory={onReloadHistory} />
          </div>
          <div
            style={{ flex: 3, padding: 10 }}
            className={classes.sectionHistory}
          >
            {callData && (
              <div style={{ width: '100%', height: '100%' }}>
                <div className={classes.historyRefresh}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      startGetGlobalConfig(
                        dispatch,
                        i18n.language,
                        window.callID,
                        true
                      );
                      if (contentHistory) {
                        contentHistory.onRefresh();
                      }
                    }}
                  >
                    {t('Refresh')}
                  </Button>
                </div>
                <div className={classes.sectionHistoryContent}>
                  <HanHistory
                    onRef={_item => setContentHistory(_item)}
                    initParams={{
                      customer_phone: incomming ? callData.from : callData.to
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

CallListDialog.propTypes = {
  onClose: PropTypes.func
};

CallListDialog.defaultProps = {
  onClose: () => {}
};
