import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Switch
} from '@material-ui/core';
import ClearOutlined from '@material-ui/icons/ClearOutlined';
import { useStyles } from './styles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function LogoutDialog(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { onClose, onLogout } = props;

  return (
    <Dialog fullWidth={true} maxWidth="xs" open={true} onClose={onClose}>
      <DialogContent style={{ padding: 0 }}>
        <div className={classes.dialog}>
          <div className={classes.contentTitle}>
            <Typography variant="h6">{t('Do you want logout?')}</Typography>
            <IconButton aria-label="delete" size="small" onClick={onClose}>
              <ClearOutlined fontSize="small" />
            </IconButton>
          </div>
          <div className={classes.mainContent}>
            <div className={classes.settingItem}>
              <Typography variant="subtitle2">
                {t(
                  'Clear and logout will clear all user information and file cache'
                )}
              </Typography>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onLogout(true)}>{t('Clear And Logout')}</Button>
        <Button onClick={() => onLogout(false)} color="primary">
          {t('Logout')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

LogoutDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onLogout: PropTypes.func
};

LogoutDialog.defaultProps = {
  open: false,
  onClose: () => {},
  onLogout: () => {}
};
