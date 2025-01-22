import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from 'prop-types';
import { useStyles } from './styles';

export default function HanModal(props) {
  const {
    onClose,
    open,
    static: isStatic,
    label,
    size,
    isFullWidth,
    children,
    modalFooter,
    isShowLabel
  } = props;
  const classes = useStyles();
  const handleClose = () => {
    onClose();
  };
  const propDialog = { fullWidth: isFullWidth, maxWidth: size };
  if (isStatic) propDialog.disableBackdropClick = true;

  return (
    <Dialog {...propDialog} onClose={handleClose} open={open}>
      {isShowLabel && (
        <DialogTitle className={classes.titleModal}>{label}</DialogTitle>
      )}
      <DialogContent
        style={{
          width: '100%',
          height: '100%',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {children}
      </DialogContent>
      {modalFooter && (
        <DialogActions className={classes.footerModal}>
          {modalFooter()}
        </DialogActions>
      )}
    </Dialog>
  );
}

HanModal.propTypes = {
  open: PropTypes.bool,
  label: PropTypes.string,
  size: PropTypes.string,
  static: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  modalFooter: PropTypes.func,
  isShowLabel: PropTypes.bool
};
HanModal.defaultProps = {
  open: false,
  label: 'Modal title',
  size: 'md',
  static: false,
  isFullWidth: true,
  isShowLabel: true,
  modalFooter: null
};
