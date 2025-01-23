import React from 'react';
import { useStyles } from './styles';
import HanDatePicker, {
  HanRangeDatePicker
} from '../../../../components/HanDatePicker';
import HanSelect from '../../../../components/HanSelect';
import { TextTitleTypography, TextHintTypography } from './component.styles';
import { Button, Grid, TextField, CircularProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { PRIORITIES, ACTIVITIES } from '../../../../configs/constant';
import { getParamsSearch } from '../../../../utils/array.utils';
import 'simplebar';

const formatDate = 'YYYY-MM-DD';
export default function SearchLeft(props) {
  let date = new Date();
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const [priority, setPriority] = React.useState(0);
  const [activity, setActivity] = React.useState(ACTIVITIES.default);
  const [searching, setSearching] = React.useState(false);
  const [from, setFrom] = React.useState(moment(firstDay).format(formatDate));
  const [to, setTo] = React.useState(moment(lastDay).format(formatDate));
  const [nameContact, setNameContact] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [code, setCode] = React.useState('');
  const [history, setHistory] = React.useState('');
  const [content, setContent] = React.useState('');
  const [nameStaff, setNameStaff] = React.useState('');
  const [ext, setExt] = React.useState('');
  const sourcePriorities = [
    {
      title: 'All',
      value: 0
    },
    ...PRIORITIES.source
  ];

  const handleChangePriority = value => {
    setPriority(value);
  };

  const handleChangeActivity = value => {
    setActivity(value);
  };
  const onChangeNameContact = event => {
    setNameContact(event.target.value);
  };
  const onChangePhone = event => {
    setPhone(event.target.value);
  };
  const onChangeCompany = event => {
    setCompany(event.target.value);
  };
  const onChangeCode = event => {
    setCode(event.target.value);
  };
  const onChangeHistory = event => {
    setHistory(event.target.value);
  };
  const onChangeContent = event => {
    setContent(event.target.value);
  };
  const onChangeNameStaff = event => {
    setNameStaff(event.target.value);
  };
  const onChangeExt = event => {
    setExt(event.target.value);
  };

  const handleSearch = () => {
    if (props.onSearch)
      props.onSearch(
        getParamsSearch(
          from,
          to,
          priority,
          activity,
          nameStaff,
          ext,
          history,
          content,
          nameContact,
          phone,
          code,
          company
        )
      );
  };

  function keyPress(e) {
    if (e.keyCode == 13) {
      handleSearch();
    }
  }

  return (
    <div className={classes.searchLeftContainer}>
      <div className={classes.searchContainer} data-simplebar>
        <div className={classes.dateContainer}>
          <TextTitleTypography>
            <b>{t('Date')}</b>
          </TextTitleTypography>
          <TextHintTypography className={classes.textHint}>
            {t('Select date')}
          </TextHintTypography>
          {/*<HanDatePicker/>*/}
          <HanRangeDatePicker
            onChange={({ fromDate, toDate }) => {
              setFrom(fromDate);
              setTo(toDate);
            }}
          />
        </div>
        <div className={classes.contactContainer}>
          <TextTitleTypography>
            <b>{t('Contact')}</b>
          </TextTitleTypography>
          <div className={classes.namePhoneContainer}>
            <TextField
              id="name_contact"
              label={t('Name')}
              variant="outlined"
              value={nameContact}
              onChange={onChangeNameContact}
              size="small"
              onKeyDown={keyPress}
            />
            <TextField
              style={{ marginLeft: 16 }}
              id="phone"
              label={t('Phone')}
              variant="outlined"
              value={phone}
              onChange={onChangePhone}
              size="small"
              onKeyDown={keyPress}
            />
          </div>
          <div className={classes.companyCodeContainer}>
            <TextField
              id="company"
              label={t('Company')}
              variant="outlined"
              value={company}
              onChange={onChangeCompany}
              size="small"
              onKeyDown={keyPress}
            />
            <TextField
              style={{ marginLeft: 16 }}
              id="code"
              label={t('Code')}
              variant="outlined"
              value={code}
              onChange={onChangeCode}
              size="small"
              onKeyDown={keyPress}
            />
          </div>
        </div>
        <div className={classes.historyContainer}>
          <TextTitleTypography>
            <b>{t('History')}</b>
          </TextTitleTypography>
          <div className={classes.historyContentContainer}>
            <TextField
              id="history"
              label={t('History')}
              variant="outlined"
              value={history}
              onChange={onChangeHistory}
              size="small"
              onKeyDown={keyPress}
            />
            <TextField
              style={{ marginLeft: 16 }}
              id="content"
              label={t('Content')}
              variant="outlined"
              value={content}
              onChange={onChangeContent}
              size="small"
              onKeyDown={keyPress}
            />
          </div>
        </div>
        <div className={classes.historyContainer}>
          <TextTitleTypography>
            <b>{t('Staff')}</b>
          </TextTitleTypography>
          <div className={classes.historyContentContainer}>
            <TextField
              id="name_staff"
              label={t('Name')}
              variant="outlined"
              value={nameStaff}
              onChange={onChangeNameStaff}
              size="small"
              onKeyDown={keyPress}
            />
            <TextField
              style={{ marginLeft: 16 }}
              id="name_ext"
              label={t('Ext')}
              variant="outlined"
              value={ext}
              onChange={onChangeExt}
              size="small"
              onKeyDown={keyPress}
            />
          </div>
        </div>
        <div className={classes.priorityActivityContainer}>
          <div className={classes.dropdownContainer}>
            <TextHintTypography className={classes.textHint}>
              {t('Priority')}
            </TextHintTypography>
            <div style={{ marginLeft: 36, flex: 1 }}>
              <HanSelect
                t={t}
                source={sourcePriorities}
                value={0}
                onChange={handleChangePriority}
              />
            </div>
          </div>
          <div className={classes.dropdownContainer} style={{ marginTop: 20 }}>
            <TextHintTypography className={classes.textHint}>
              {t('Activity')}
            </TextHintTypography>
            <div style={{ marginLeft: 36, flex: 1 }}>
              <HanSelect
                t={t}
                source={ACTIVITIES.source}
                value={ACTIVITIES.default}
                onChange={handleChangeActivity}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          style={{ width: '100%' }}
        >
          {searching ? (
            <Fragment>
              {t('Searching')}
              <Grid container justifyContent="center" style={{ width: 26 }}>
                <CircularProgress color="inherit" size={16} />
              </Grid>
            </Fragment>
          ) : (
            t('Search')
          )}
        </Button>
      </div>
    </div>
  );
}
