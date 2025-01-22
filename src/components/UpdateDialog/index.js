import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton
} from '@material-ui/core';
import ClearOutlined from '@material-ui/icons/ClearOutlined';
import { useStyles } from './styles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import 'simplebar';

export default function UpdateDialog(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { onClose, releaseInfo, onUpdate } = props;

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={true} onClose={onClose}>
      <DialogContent style={{ padding: 0, overflow: 'hidden' }}>
        <div className={classes.dialog}>
          <div className={classes.contentTitle}>
            <Typography variant="h6">
              {t('New update available')} {releaseInfo?.version}
            </Typography>
            <IconButton
              style={{ color: 'white' }}
              aria-label="delete"
              size="small"
              onClick={onClose}
            >
              <ClearOutlined fontSize="small" />
            </IconButton>
          </div>
          <div className={classes.mainContent} data-simplebar>
            <div
              style={{
                margin: 20,
                cursor: 'pointer',
                whiteSpace: 'pre-wrap',
                position: 'relative',
                display: 'inline-block',
                textAlign: 'left',
                wordBreak: 'break-word',
                wordWrap: 'break-word'
              }}
            >
              {releaseInfo?.releaseNotes}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('Close')}</Button>
        <Button onClick={onUpdate} color="primary">
          {t('Update')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UpdateDialog.propTypes = {
  open: PropTypes.bool,
  releaseInfo: PropTypes.object,
  onClose: PropTypes.func,
  onUpdate: PropTypes.func
};

UpdateDialog.defaultProps = {
  open: false,
  releaseInfo: { version: '', releaseNotes: '' },
  onClose: () => {},
  onUpdate: () => {}
};
