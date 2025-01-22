import React, { useState, Fragment, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  CircularProgress,
  Typography
} from '@material-ui/core';
import { useStyles } from './styles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import OtpInput from 'react-otp-input';

const OTP_LENGTH = 6;
export default function OTPDialog(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { onClose, onConfirm, msg } = props;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChanged = otp => {
    setOtp(otp);
    if (otp.length == OTP_LENGTH) {
      setLoading(true);
      onConfirm(otp);
    }
  };

  useEffect(() => {
    if (msg) {
      setLoading(false);
      setOtp('');
    }
  }, [msg]);

  return (
    <Dialog
      maxWidth="sm"
      open={true}
      onClose={onClose}
      disableEscapeKeyDown={true}
      disableBackdropClick={true}
    >
      <DialogContent className={classes.dialogContainer}>
        <div className={classes.dialog}>
          <div className={classes.contentTitle}>
            <Typography style={{ color: 'white', textAlign: 'center' }}>
              {t('OTP login')}
            </Typography>
          </div>
          <div className={classes.mainContent}>
            <OtpInput
              isInputNum={true}
              shouldAutoFocus={true}
              isDisabled={loading}
              inputStyle={{ width: 50, height: 50, fontSize: 30 }}
              value={otp}
              onChange={handleChanged}
              numInputs={OTP_LENGTH}
              separator={<span style={{ padding: 5, color: 'white' }}>-</span>}
            />
            <Typography
              style={{ padding: 5, color: '#ffbcbc', textAlign: 'center' }}
            >
              {msg}
            </Typography>
          </div>
        </div>
      </DialogContent>
      <DialogActions className={classes.dialogAction}>
        <Button style={{ color: 'white' }} onClick={onClose}>
          {loading ? (
            <Fragment>
              {t('Please waiting')}
              <Grid container justify="center" style={{ width: 26 }}>
                <CircularProgress color="inherit" size={16} />
              </Grid>
            </Fragment>
          ) : (
            t('Close')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

OTPDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  msg: PropTypes.string
};

OTPDialog.defaultProps = {
  open: false,
  onClose: () => {},
  onConfirm: otp => {},
  msg: null
};
