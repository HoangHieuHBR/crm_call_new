import React, { useState } from 'react';
import HanModal from '../../../../components/HanModal';
import HanContact from '../../../../components/HanContact';
import { useStyles } from '../styles';
import { isFunction } from 'lodash';
import Button from '@material-ui/core/Button';
import { Snackbar } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function Contact(props) {
  const { t, i18n } = useTranslation();
  const { onClose, open, onChangeContact, defaultKeyword, defaultType } = props;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, SetErrorSnackbar] = useState('');
  const [contentContact, setContentContact] = useState(null);
  const [contact, setContact] = useState(null);
  const classes = useStyles();
  const handleClose = () => {
    onClose(false);
  };

  function renderModalFooter() {
    return (
      <div>
        <Button
          variant="outlined"
          onClick={() => {
            if (contentContact) {
              contentContact.setRefresh();
            }
          }}
        >
          {t('Refresh')}
        </Button>
        <Button variant="outlined" onClick={handleClose}>
          {t('Close')}
        </Button>
        <Button
          style={{ marginLeft: 10 }}
          variant="outlined"
          onClick={() => {
            if (contact == null) showAlert('You must choose a contact!!!');
            else {
              if (onChangeContact && isFunction(onChangeContact))
                onChangeContact(contact, false);
              onClose(false);
            }
          }}
        >
          {t('OK')}
        </Button>
      </div>
    );
  }

  const handleClosed = () => {
    setOpenSnackbar(false);
  };

  const showAlert = msg => {
    SetErrorSnackbar(msg);
    setOpenSnackbar(true);
  };

  return (
    <HanModal
      label={t('Contact')}
      open={open}
      size={'md'}
      onClose={handleClose}
      modalFooter={renderModalFooter}
      static
    >
      <div className={classes.wrapperAddTaskTicket}>
        <HanContact
          enableAssignToMe={false}
          type={defaultType}
          search={defaultKeyword}
          onChoose={item => setContact(item)}
          onRef={_item => setContentContact(_item)}
        />
        <Snackbar
          autoHideDuration={2000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openSnackbar}
          onClose={() => handleClosed()}
          message={errorSnackbar}
        />
      </div>
    </HanModal>
  );
}

Contact.propTypes = {
  onChangeContact: PropTypes.func,
  defaultKeyword: PropTypes.string,
  defaultType: PropTypes.string
};
Contact.defaultProps = {
  onChangeContact: null,
  defaultType: ''
};
