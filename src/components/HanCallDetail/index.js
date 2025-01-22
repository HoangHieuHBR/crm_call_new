import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useStyles } from './styles';
import HanModal from '../HanModal';
import CallView from './CallView';
import EmailView from './emaildetail/EmailView';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import CRMApi from '../../core/service/vn/server.api';
import { useTranslation } from 'react-i18next';

let historyRequest;
let requesting;
export default function HanCallDetail(props) {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const { open, data, handleClose } = props;
  const [loading, setLoading] = useState(true);
  const [historyDetail, setHistoryDetail] = useState(data);

  useEffect(() => {
    requesting = false;
    loadDataDetail(data);
  }, []);

  async function loadDataDetail(item) {
    if (requesting == false) {
      CRMApi.cancelRequest(historyRequest);
      historyRequest = Date.now();
      setLoading(true);
      requesting = true;
      try {
        const result = await CRMApi.apiGetHistoryDetail({
          cancelToken: historyRequest,
          type: item.type,
          selectedId: item.id
        });

        setLoading(false);
        requesting = false;

        if (result.success) {
          let data = result.rows ?? item;
          setHistoryDetail(data);
        }
      } catch (e) {
        if (CRMApi.isCanceled(e)) {
          return;
        }
        setLoading(false);
        requesting = false;
      }
    }
  }

  const renderModalFooter = () => {
    return (
      <>
        <Button variant="outlined" onClick={handleClose}>
          {t('Close')}
        </Button>
      </>
    );
  };

  return (
    <HanModal
      label={data?.subject}
      open={open}
      size={'md'}
      onClose={handleClose}
      modalFooter={renderModalFooter}
    >
      <div
        style={{
          width: '100%',
          height: 500,
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 10
        }}
      >
        {loading ? (
          <div className={classes.center}>
            <CircularProgress size={24} />
          </div>
        ) : data && data.type == 'email' ? (
          <EmailView data={historyDetail} t={t} />
        ) : (
          <CallView data={historyDetail} />
        )}
      </div>
    </HanModal>
  );
}

HanCallDetail.propTypes = {
  data: PropTypes.object,
  open: PropTypes.bool,
  handleClose: PropTypes.func
};

HanCallDetail.defaultProps = {
  open: false,
  data: null,
  handleClose: null
};
