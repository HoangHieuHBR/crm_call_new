import React from 'react';
import { useStyles } from '../styles';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';
import { CALL_DIRECTION, CALL_EVENT } from '../../../../configs/constant';
import Transfer from './Transfer';

export default function Duration(props) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [openTransfer, setOpenTransfer] = React.useState(false);
  const currentCall = useSelector(state => state.call.currentCall);
  const { callProfile } = currentCall;

  const formatTime = time => {
    if (time == null || time == '') {
      return '00:00:00';
    }

    var sec_num = parseInt(time, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
  };

  const { callData, call_duration } = currentCall;

  const duration = formatTime(call_duration);

  function renderDirection() {
    let isComing = true;
    if (callData) {
      isComing = CALL_DIRECTION.INBOUND == callData.direction;
    }
    if (isComing)
      return (
        <>
          <PhoneCallbackIcon />
          <span style={{ marginLeft: 10 }}>{t('Incoming call')}</span>
        </>
      );
    return (
      <>
        <PhoneForwardedIcon />
        <span style={{ marginLeft: 10 }}>{t('Outgoing call')}</span>
      </>
    );
  }

  const showTransfer =
    !window.isKoreaMode && callData?.event == CALL_EVENT.INVITE_RESULT;

  return (
    <div
      className={clsx(classes.wrapperContent, classes.sectionDuration)}
      style={{ paddingTop: 10, paddingBottom: 10 }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {renderDirection()}
      </div>
      <span>{duration}</span>

      {showTransfer && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpenTransfer(true);
          }}
        >
          Transfer
        </Button>
      )}

      {openTransfer && showTransfer && (
        <Transfer
          phone={callProfile?.phone}
          open={openTransfer}
          onClose={() => {
            setOpenTransfer(false);
          }}
        />
      )}
    </div>
  );
}

Duration.propTypes = {};

Duration.defaultProps = {};
