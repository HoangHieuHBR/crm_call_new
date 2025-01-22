import React, { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import * as remote from '@electron/remote';
import { useStyles } from '../styles';
import Button from '@material-ui/core/Button';
import { Snackbar, Grid, CircularProgress } from '@material-ui/core';
import clsx from 'clsx';
import HanSelect from '../../../../components/HanSelect';
import HanTextField from '../../../../components/HanTextField';
import HanFormControl from '../../../../components/HanFormControl';
import AddTask from './AddTask';
import AddUser from './AddUser';
import CreateTicket from './CreateTicket';
import InforCall from './InforCall';
import Duration from './Duration';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CRMApi from '../../../../core/service/vn/server.api';
import {
  PRIORITIES,
  DISABLE_PRODUCT_TICKET,
  CALL_DIRECTION,
  CALL_DIRECTION_SOURCES
} from '../../../../configs/constant';
import { useTranslation } from 'react-i18next';

let tokenPostHistory;

export default function General(props) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const { settings, onReloadHistory } = props;
  const currentCall = useSelector(state => state.call.currentCall);
  const { call_duration, callData } = currentCall;

  const [openAddTask, setOpenAddTask] = React.useState(false);
  const [openCreateTicket, setOpenCreateTicket] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, SetErrorSnackbar] = useState('');
  const [historyId, setHistoryId] = React.useState(null);
  const [registerPhone, setRegisterPhone] = React.useState(false);
  const [contact, setContact] = React.useState(null);
  const [info, setInfo] = React.useState(null);
  const [loading, setLoading] = useState(false);

  const [callDirection, setCallDirection] = useState(CALL_DIRECTION.INBOUND);
  const [callDuration, setCallDuration] = useState(1);

  const emptyHistory = window.emptyHistory;

  const buildContent = () => {
    const priorityName = PRIORITIES.source.find(
      item => item.value == info.priority
    );

    let arrayContent = [];
    arrayContent.push(`Subject: ${info.subject}`);
    arrayContent.push(`Priority: ${priorityName?.title}`);
    arrayContent.push(`Staff: ${CRMApi.extraInfo.username}`);
    arrayContent.push(`Phone: ${contact.phone}`);
    arrayContent.push(`Content: ${info?.content ?? ''}`);

    return arrayContent.join('\r\n\r\n');
  };

  useEffect(() => {
    return () => {
      CRMApi.cancelRequest(tokenPostHistory);
    };
  }, []);

  // useEffect(() => {
  //   setRegisterPhone(contact?.registerPhone ? true : false);
  // }, [contact?.registerPhone]);

  const handleClosed = () => {
    setOpenSnackbar(false);
  };

  const showAlert = msg => {
    SetErrorSnackbar(msg);
    setOpenSnackbar(true);
  };

  const toggleModal = (isTicket, isOpen) => {
    let msg = validForm(!isTicket);
    if (msg) {
      showAlert(msg);
      return;
    }
    if (isTicket) {
      setOpenCreateTicket(isOpen);
    } else {
      setOpenAddTask(isOpen);
    }
  };

  const toggleModalClosed = (isTicket, isOpen) => {
    if (isTicket) {
      setOpenCreateTicket(isOpen);
    } else {
      setOpenAddTask(isOpen);
    }
  };

  function renderGeneralControl() {
    return (
      <div className={classes.sectionCallComingControl}>
        <Button
          variant="contained"
          color="primary"
          style={{ width: '30%' }}
          onClick={() => {
            postHistory();
          }}
        >
          {loading ? (
            <Fragment>
              <Grid container justify="center" style={{ width: 26 }}>
                <CircularProgress color="inherit" size={16} />
              </Grid>
            </Fragment>
          ) : (
            t('Save')
          )}
        </Button>
        <div>
          {DISABLE_PRODUCT_TICKET == false && (
            <Button
              variant="outlined"
              style={{ marginRight: 20 }}
              onClick={() => toggleModal(true, true)}
            >
              {t('Create Ticket')}
            </Button>
          )}
          <Button variant="outlined" onClick={() => toggleModal(false, true)}>
            {t('Add Task')}
          </Button>
        </div>
      </div>
    );
  }

  const postHistory = async () => {
    let isRegisterPhone = registerPhone;
    let msg = validForm(true);
    if (msg) {
      showAlert(msg);
      return;
    }
    setLoading(true);

    let result = await postHistoryRequest();
    let id = result?.success ? result?.rows.id : null;
    setHistoryId(id);
    if (id) {
      if (onReloadHistory) {
        onReloadHistory();
      }
    }
    if (isRegisterPhone && id) {
      result = await putPhoneToCustomerRequest();
    }

    setLoading(false);
    if (result?.success) {
      showAlert('Post History Call success');
      remote.getCurrentWindow().close();
    } else {
      showAlert(result?.msg ?? result?.error ?? 'Unknown error');
    }
  };

  const postHistoryRequest = async () => {
    try {
      const duration = emptyHistory ? callDuration : call_duration;
      tokenPostHistory = Date.now();
      let result = await CRMApi.apiPostHistoryCall({
        cancelToken: tokenPostHistory,
        callId: emptyHistory ? '' : window.callID,
        historyID: historyId,
        purposes: info.purposes,
        customer: contact,
        products: info.products,
        content: info.content ?? '',
        subject: info.subject,
        priority: info.priority,
        duration: duration <= 0 ? 1 : duration,
        createDate: info.duedate,
        direction: emptyHistory ? callDirection : callData.direction
      });

      return result;
    } catch (err) {
      console.log(err);
      if (CRMApi.isCanceled(err)) {
        return;
      }
      return {
        success: false,
        msg: 'Unknown error'
      };
    }
  };

  const putPhoneToCustomerRequest = async () => {
    try {
      tokenPostHistory = `tokenUpdateCreateContact_${Date.now()}`;

      let result = await CRMApi.apiPutRegisterPhone({
        cancelToken: tokenPostHistory,
        customerid: contact.customerid,
        customerCode: contact.code,
        phoneNumber: contact.phone,
        phoneType: contact.phonetype,
        phoneExt: '',
        customerType: contact.type,
        customerName: contact.name
      });

      return result;
    } catch (err) {
      console.log(err);
      if (CRMApi.isCanceled(err)) {
        return;
      }
      return {
        success: false,
        msg: 'Unknown error'
      };
    }
  };

  function validForm(checkPurpose) {
    let message = [];
    if (checkPurpose) {
      if (!info?.purposes || info?.purposes?.length <= 0) {
        message.push(t('Please select purpose'));
      }
    }

    if (!info?.subject || info?.subject?.length <= 0) {
      message.push(t('Please fill subject'));
    }
    return message.length == 0 ? null : message.join('\n');
  }

  const renderManuallyDuration = () => {
    return (
      <div
        className={clsx(classes.wrapperContent, classes.sectionDuration)}
        style={{ paddingTop: 10, paddingBottom: 10 }}
      >
        <div style={{ width: 'calc(50% - 5px)' }}>
          <HanFormControl label={t('Call Direction')} noMargin={true}>
            <HanSelect
              t={t}
              value={callDirection}
              onChange={value => {
                setCallDirection(value);
              }}
              source={CALL_DIRECTION_SOURCES}
              fieldTitle={'name'}
              fieldValue={'value'}
            />
          </HanFormControl>
        </div>
        <div
          style={{
            width: 'calc(50% - 5px)'
          }}
        >
          <HanFormControl label={t('Call Duration')} noMargin={true}>
            <HanTextField
              inputProps={{
                pattern: '[0-9]*'
              }}
              onChange={event => {
                if (event.target.validity.valid || event.target.value === '') {
                  setCallDuration(event.target.value);
                }
              }}
              value={callDuration}
            />
            <span style={{ position: 'absolute', right: 10, top: 7 }}>
              ({t('second(s)')})
            </span>
          </HanFormControl>
        </div>
      </div>
    );
  };

  return (
    <div
      className={classes.wrapperCallContent}
      style={{
        pointerEvents: loading ? 'none' : 'auto'
      }}
    >
      <div className={classes.wrapperCallInfo}>
        {emptyHistory ? renderManuallyDuration() : <Duration />}
        <AddUser
          showAlert={showAlert}
          onChangeContact={value => {
            setContact(value);
          }}
        />
        <InforCall
          contact={contact}
          onChangeInfoData={value => {
            setInfo(value);
          }}
        />
        <FormControlLabel
          checked={registerPhone}
          style={{ marginLeft: 5 }}
          control={
            <Checkbox
              disabled={
                contact?.type == null || contact?.type == '' ? true : false
              }
              onChange={e => {
                setRegisterPhone(e.target.checked);
              }}
              name="update_phone_number"
              color="primary"
            />
          }
          label={t('Add the customer information')}
        />
      </div>
      {renderGeneralControl()}
      {openAddTask && (
        <AddTask
          showAlert={showAlert}
          settings={settings}
          content={openAddTask ? buildContent() : ''}
          open={openAddTask}
          onClose={toggleModalClosed}
          infoData={info}
          contactData={contact}
        />
      )}
      {openCreateTicket && (
        <CreateTicket
          showAlert={showAlert}
          content={openCreateTicket ? buildContent() : ''}
          settings={settings}
          open={openCreateTicket}
          onClose={toggleModalClosed}
          infoData={info}
          contactData={contact}
        />
      )}

      <Snackbar
        autoHideDuration={2000}
        style={{ whiteSpace: 'pre-wrap' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackbar}
        onClose={() => handleClosed()}
        message={errorSnackbar}
      />
    </div>
  );
}

General.propTypes = {};

General.defaultProps = {};
