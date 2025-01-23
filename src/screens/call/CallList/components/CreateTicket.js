import React, { useEffect, useState } from 'react';
import HanFormControl from '../../../../components/HanFormControl';
import HanSelect from '../../../../components/HanSelect';
import { PRIORITIES } from '../../../../configs/constant';
import HanTextField from '../../../../components/HanTextField';
import { SendIcon } from '../../../../components/HanSVGIcon';
import HanTree from '../../../../components/HanTree';
import HanMultiSelect from '../../../../components/HanMultiSelect';
import HanAutoComplete from '../../../../components/HanAutoComplete';
import { Button, Grid, CircularProgress } from '@material-ui/core';
import HanModal from '../../../../components/HanModal';
import { useStyles } from '../styles';

import CRMApi from '../../../../core/service/vn/server.api';
import { useTranslation } from 'react-i18next';

let tokenPostTicket;
export default function CreateTicket(props) {
  const { t, i18n } = useTranslation();
  const {
    onClose,
    open,
    contactData,
    infoData,
    settings,
    content,
    showAlert
  } = props;
  const combindData = { ...contactData, ...infoData };

  const { statuses, categories, labels } = settings;

  const [loading, setLoading] = useState(false);

  const defaultCategory = categories ? categories[0] : null;
  const defaultStatus = statuses ? statuses[0] : null;

  const [ticketInfo, setTicketInfo] = React.useState({
    category: defaultCategory,
    status: defaultStatus ? defaultStatus['id'] : null,
    priority: PRIORITIES.default,
    labels: [],
    subject: null,
    assignes: [],
    content: ''
  });

  useEffect(() => {
    return () => {
      CRMApi.cancelRequest(tokenPostTicket);
    };
  }, []);

  const classes = useStyles();
  const handleClose = () => {
    onClose(true, false);
  };

  function validForm() {
    let message = [];
    if (!ticketInfo?.subject || ticketInfo?.subject?.length <= 0) {
      message.push(t('Please fill subject'));
    }
    if (!ticketInfo?.content || ticketInfo?.content?.length <= 0) {
      message.push(t('Please fill content'));
    }
    return message.length == 0 ? null : message.join('\n');
  }

  const sendTicket = async () => {
    let msg = validForm();
    if (msg) {
      showAlert(msg);
      return;
    }
    setLoading(true);

    let result = await postTicketRequest();
    let id = result?.success ? result?.ticket?.id : null;
    setLoading(false);
    if (result?.success) {
      showAlert(t('Post Ticket success'));
      onClose(true, false);
    } else {
      showAlert(result?.msg ?? result?.error ?? 'Unknown error');
    }
  };

  const postTicketRequest = async () => {
    try {
      let labelsName = [];
      if (ticketInfo.labels) {
        ticketInfo.labels.forEach(item => {
          const name = item.value?.name;
          if (name) {
            labelsName.push(name);
          } else {
            labelsName.push(item.value);
          }
        });
      }

      let assignes = [];
      ticketInfo.assignes.forEach(assign => {
        assignes.push(`${assign.user_no}`);
      });
      assignes = assignes.filter((item, index) => {
        return assignes.indexOf(item) === index;
      });

      tokenPostTicket = Date.now();
      let result = await CRMApi.apiPostTicket({
        cancelToken: tokenPostTicket,
        category: ticketInfo.category
          ? ticketInfo.category['id']
          : defaultCategory['id'],
        status: ticketInfo.status ?? defaultStatus['id'],
        priority: ticketInfo.priority,
        label_names: labelsName.join('+'),
        subject: ticketInfo.subject,
        content: ticketInfo.content,
        phone: combindData.phone,
        assignees: assignes.join('+'),
        customer: contactData
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

  const renderModalFooter = () => {
    return (
      <>
        <Button variant="outlined" onClick={handleClose}>
          {t('Close')}
        </Button>
        <Button
          onClick={sendTicket}
          color="primary"
          variant="contained"
          endIcon={<SendIcon />}
        >
          {loading ? (
            <>
              <Grid container justifyContent="center" style={{ width: 26 }}>
                <CircularProgress color="inherit" size={16} />
              </Grid>
            </>
          ) : (
            t('Send')
          )}
        </Button>
      </>
    );
  };

  useEffect(() => {
    setTicketInfo({
      ...ticketInfo,
      content: content
    });
  }, [content]);

  // useEffect(() => {
  //   console.log('ticketInfo', ticketInfo);
  // }, [ticketInfo]);

  function renderContentTicket() {
    return (
      <>
        <HanFormControl label={t('Categories')}>
          <HanSelect
            t={t}
            value={defaultCategory ? defaultCategory['id'] : ''}
            onChange={value => {
              setTicketInfo({
                ...ticketInfo,
                category: value
              });
            }}
            source={categories}
            fieldTitle={'name'}
            fieldValue={'id'}
          />
        </HanFormControl>
        <HanFormControl label={t('Status')}>
          <HanSelect
            t={t}
            value={defaultStatus ? defaultStatus['id'] : ''}
            onChange={value => {
              setTicketInfo({
                ...ticketInfo,
                status: value
              });
            }}
            source={statuses}
            fieldTitle={'name'}
            fieldValue={'id'}
          />
        </HanFormControl>
        <HanFormControl label={t('Priority')}>
          <HanSelect
            t={t}
            onChange={value => {
              setTicketInfo({
                ...ticketInfo,
                priority: value
              });
            }}
            source={PRIORITIES.source}
            value={PRIORITIES.default}
          />
        </HanFormControl>

        <HanFormControl label={t('Label')}>
          <HanAutoComplete
            t={t}
            label={t('Label')}
            value={[]}
            onChange={value => {
              setTicketInfo({
                ...ticketInfo,
                labels: value
              });
            }}
            source={labels}
            fieldTitle={'name'}
            fieldValue={'id'}
          />
        </HanFormControl>
        <HanFormControl label={t('Subject')}>
          <HanTextField
            onChange={e => {
              setTicketInfo({
                ...ticketInfo,
                subject: e.target.value
              });
            }}
          />
        </HanFormControl>

        <HanFormControl label={t('Content')}>
          <HanTextField
            value={ticketInfo.content}
            multiline
            rows={13}
            onChange={e => {
              setTicketInfo({
                ...ticketInfo,
                content: e.target.value
              });
            }}
          />
        </HanFormControl>
      </>
    );
  }

  return (
    <HanModal
      label={t('Create Ticket')}
      open={open}
      onClose={handleClose}
      modalFooter={renderModalFooter}
      static
    >
      <div className={classes.wrapperAddTaskTicket}>
        <div
          className={classes.sectionTree}
          style={{
            pointerEvents: loading ? 'none' : 'auto'
          }}
        >
          <HanTree
            onChange={assignes => {
              setTicketInfo({
                ...ticketInfo,
                assignes: assignes
              });
            }}
          />
        </div>
        <div className={classes.sectionTaskTicket}>{renderContentTicket()}</div>
      </div>
    </HanModal>
  );
}

CreateTicket.propTypes = {};

CreateTicket.defaultProps = {};
