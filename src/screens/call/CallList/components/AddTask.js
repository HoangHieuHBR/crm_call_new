import React, { useEffect } from 'react';
import HanFormControl from '../../../../components/HanFormControl';
import HanSelect from '../../../../components/HanSelect';
import {
  PRIORITIES,
  DISABLE_PRODUCT_TICKET
} from '../../../../configs/constant';
import HanTextField from '../../../../components/HanTextField';
import HanDatePicker from '../../../../components/HanDatePicker';
import HanTree from '../../../../components/HanTree';
import { Button, Grid, CircularProgress } from '@material-ui/core';
import HanModal from '../../../../components/HanModal';
import { useStyles } from '../styles';
import { SendIcon } from '../../../../components/HanSVGIcon';
import HanMultiSelect from '../../../../components/HanMultiSelect';
import CRMApi from '../../../../core/service/vn/server.api';
import { useTranslation } from 'react-i18next';

let tokenPostTask;
export default function AddTask(props) {
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
  const classes = useStyles();

  const combindData = { ...contactData, ...infoData };
  const { purposes, products } = settings;

  const [loading, setLoading] = React.useState(false);

  const [taskInfo, setTaskInfo] = React.useState({
    priority: PRIORITIES.default,
    subject: null,
    assignes: [],
    content: content,
    purposes: combindData.purposes,
    products: combindData.products,
    duedate: null
  });

  useEffect(() => {
    return () => {
      CRMApi.cancelRequest(tokenPostTask);
    };
  }, []);

  useEffect(() => {
    setTaskInfo({
      ...taskInfo,
      content: content
    });
  }, [content]);

  useEffect(() => {}, [taskInfo]);

  function validForm() {
    let message = [];
    if (!taskInfo?.subject || taskInfo?.subject?.length <= 0) {
      message.push(t('Please fill subject'));
    }
    if (!taskInfo?.content || taskInfo?.content?.length <= 0) {
      message.push(t('Please fill content'));
    }
    if (!taskInfo?.purposes || taskInfo?.purposes?.length <= 0) {
      message.push(t('Please select purpose'));
    }
    return message.length == 0 ? null : message.join('\n');
  }
  const handleClose = () => {
    onClose(false, false);
  };

  async function onSendTask() {
    let msg = validForm();
    if (msg) {
      showAlert(msg);
      return;
    }
    setLoading(true);

    let result = await postTaskRequest();
    let id = result?.success ? result?.rows?.id : null;
    setLoading(false);
    if (result?.success) {
      showAlert('Post Task success');
      onClose(false, false);
    } else {
      showAlert(result?.msg ?? result?.error ?? 'Unknown error');
    }
  }

  const postTaskRequest = async () => {
    try {
      tokenPostTask = Date.now();

      let result = await CRMApi.apiPostTask({
        cancelToken: tokenPostTask,
        subject: taskInfo.subject,
        staffList: taskInfo.assignes,
        priority: taskInfo.priority,
        customers: [contactData],
        purposes: taskInfo.purposes,
        products: taskInfo.products,
        content: taskInfo.content,
        due_date: taskInfo.duedate ?? Date.now()
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
          onClick={() => onSendTask()}
          color="primary"
          variant="contained"
          endIcon={<SendIcon />}
        >
          {loading ? (
            <>
              <Grid container justify="center" style={{ width: 26 }}>
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

  function renderContentTask() {
    return (
      <>
        <HanFormControl label={t('Priority')}>
          <HanSelect
            t={t}
            onChange={value => {
              setTaskInfo({
                ...taskInfo,
                priority: value
              });
            }}
            source={PRIORITIES.source}
            value={PRIORITIES.default}
          />
        </HanFormControl>
        <HanFormControl label={t('Due date')}>
          <HanDatePicker
            onChangeDate={value => {
              setTaskInfo({
                ...taskInfo,
                duedate: value
              });
            }}
          />
        </HanFormControl>
        <HanFormControl label={t('Subject')}>
          <HanTextField
            onChange={e => {
              setTaskInfo({
                ...taskInfo,
                subject: e.target.value
              });
            }}
          />
        </HanFormControl>
        <HanFormControl label={t('Purpose')}>
          <HanMultiSelect
            label={t('Purpose')}
            value={combindData.purposes ? [...combindData.purposes] : []}
            onChange={v => {
              setTaskInfo({
                ...taskInfo,
                purposes: v
              });
            }}
            source={purposes}
            fieldTitle={'content'}
            fieldValue={'id'}
          />
        </HanFormControl>
        {DISABLE_PRODUCT_TICKET == false && (
          <HanFormControl label={t('Product')}>
            <HanMultiSelect
              t={t}
              label={t('Product')}
              value={combindData.products ? [...combindData.products] : []}
              onChange={value => {
                setTaskInfo({
                  ...taskInfo,
                  products: value
                });
              }}
              source={products}
              fieldTitle={'name'}
              fieldValue={'prod_code'}
            />
          </HanFormControl>
        )}

        <HanFormControl label={t('Content')}>
          <HanTextField
            value={taskInfo.content}
            multiline
            rows={13}
            onChange={e => {
              console.log(e.target.value);
              setTaskInfo({
                ...taskInfo,
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
      label={t('Add Task')}
      open={open}
      onClose={handleClose}
      modalFooter={renderModalFooter}
      static
    >
      <div
        className={classes.wrapperAddTaskTicket}
        style={{
          pointerEvents: loading ? 'none' : 'auto'
        }}
      >
        <div className={classes.sectionTree}>
          <HanTree
            onChange={assignes => {
              setTaskInfo({
                ...taskInfo,
                assignes: assignes
              });
            }}
          />
        </div>
        <div className={classes.sectionTaskTicket}>{renderContentTask()}</div>
      </div>
    </HanModal>
  );
}

AddTask.propTypes = {};

AddTask.defaultProps = {};
