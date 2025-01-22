import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Switch,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ClearOutlined from '@material-ui/icons/ClearOutlined';
import { useStyles } from './styles';
import PropTypes from 'prop-types';
import * as Utils from '../../../utils';
import * as constantsApp from '../../../configs/constant';
import * as ipc from '../../../utils/ipc';
import { CSSListItem } from './component.styles';
import { LanguageSetting } from '../../../configs';
import * as Actions from '../../../actions';
import { useTranslation } from 'react-i18next';
import { startGetGlobalConfig, cancelGetGlobalConfig } from '../../controller';
const isLinuxOS = process.platform == 'linux';

let keepOpenAtLogin = false;
export default function Setting(props) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { onClose } = props;

  const [route, setRoute] = useState('general');
  const [darkmode, setDarkMode] = useState(theme.palette.type);
  const [language, setLanguage] = useState(i18n.language);

  const [openAtLogin, setOpenAtLogin] = useState(keepOpenAtLogin);

  const [callDock, setCallDock] = useState(1);

  const onSave = () => {
    if (i18n.language != language) {
      //save language
      ipc.sendIPCSync(constantsApp.ACTION_SYNC_SET_LANGUAGE, language);
      i18n.changeLanguage(language);
      startGetGlobalConfig(dispatch, language, null, true);
    }

    if (theme.palette.type != darkmode) {
      dispatch(Actions.changeDarkTheme(darkmode));
      Utils.saveDataToStorage(constantsApp.STORAGE_DARK_MODE, darkmode);
    }
    if (!isLinuxOS) {
      if (keepOpenAtLogin != openAtLogin) {
        ipc.sendIPCSync(
          constantsApp.ACTION_SYNC_SET_OPEN_AT_LOGIN,
          openAtLogin
        );
        keepOpenAtLogin = openAtLogin;
      }
    }
  };

  useEffect(() => {
    if (!isLinuxOS) {
      keepOpenAtLogin = ipc.sendIPCSync(
        constantsApp.ACTION_SYNC_GET_OPEN_AT_LOGIN,
        null
      );
      setOpenAtLogin(keepOpenAtLogin);
    }

    var value = ipc.sendIPCSync(constantsApp.ACTION_SYNC_GET_CALL_DOCK, null);
    setCallDock(value);
  }, []);

  const onChangeRoute = route => {
    setRoute(route);
  };

  const renderContent = route => {
    switch (route) {
      case 'general':
        return (
          <div className={classes.themeContent}>
            <div className={classes.settingItem}>
              <Typography variant="subtitle2" style={{ marginRight: 16 }}>
                {t('Language Setting')}
              </Typography>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>{t('Language')}</InputLabel>
                <Select
                  value={language}
                  onChange={event => setLanguage(event.target.value)}
                  label={t('Language')}
                  classes={{
                    root: classes.paddingInput
                  }}
                >
                  {LanguageSetting.languageSupport.map(item => {
                    return (
                      <MenuItem key={item} value={item}>
                        <Typography variant="subtitle2">
                          {Utils.languageFromCode(item)}
                        </Typography>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            {isLinuxOS ? null : (
              <div className={classes.settingItem}>
                <Typography variant="subtitle2" style={{ marginRight: 16 }}>
                  {t('Open at Login')}
                </Typography>
                <Switch
                  checked={openAtLogin}
                  onChange={() => setOpenAtLogin(!openAtLogin)}
                  color="primary"
                />
              </div>
            )}

            {false && (
              <div className={classes.settingItem}>
                <Typography variant="subtitle2" style={{ marginRight: 16 }}>
                  {t('Dark Mode')}
                </Typography>
                <Switch
                  checked={darkmode == 'dark'}
                  onChange={() =>
                    setDarkMode(darkmode == 'dark' ? 'light' : 'dark')
                  }
                  color="primary"
                />
              </div>
            )}

            <div className={classes.settingItemCol}>
              <Typography variant="subtitle2" style={{ marginRight: 16 }}>
                {t('Call Dock')}
              </Typography>
              <RadioGroup
                row
                value={callDock}
                onChange={e => {
                  let selectValue = e.target.value;

                  setCallDock(selectValue);
                  ipc.sendIPCSync(
                    constantsApp.ACTION_SYNC_SET_CALL_DOCK,
                    selectValue
                  );
                }}
              >
                <FormControlLabel
                  value={'0'}
                  control={<Radio />}
                  label={
                    <Typography variant="subtitle2">
                      {t('Bottom-Left')}
                    </Typography>
                  }
                />
                <FormControlLabel
                  value={'1'}
                  control={<Radio />}
                  label={
                    <Typography variant="subtitle2">{t('Center')}</Typography>
                  }
                />

                <FormControlLabel
                  value={'2'}
                  control={<Radio />}
                  label={
                    <Typography variant="subtitle2">
                      {t('Bottom-Right')}
                    </Typography>
                  }
                />
              </RadioGroup>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className={classes.themeContent}>
            <div className={classes.settingItem}>
              <Typography
                variant="subtitle2"
                style={{ marginRight: 16, whiteSpace: 'pre-line' }}
              >
                {`
                CRMCall v2.0.65 build on 24 Nov 2022
                Release note:

                - Add new setting

              `}
              </Typography>
            </div>
          </div>
        );
      default:
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex'
            }}
          >
            {route}
          </div>
        );
    }
  };

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={true} onClose={onClose}>
      <DialogContent style={{ padding: 0 }}>
        <div className={classes.dialog}>
          <div className={classes.contentTitle}>
            <Typography variant="h6">{t('Setting')}</Typography>
            <IconButton
              style={{ color: 'white' }}
              aria-label="delete"
              size="small"
              onClick={onClose}
            >
              <ClearOutlined fontSize="small" />
            </IconButton>
          </div>
          <div className={classes.mainContent}>
            <div className={classes.leftContent}>
              <List style={{ padding: 0 }}>
                <div style={{ flexDirection: 'row', display: 'flex' }}>
                  <CSSListItem
                    button
                    onClick={() => onChangeRoute('general')}
                    selected={route == 'general'}
                  >
                    <ListItemText primary={t('General')} />
                  </CSSListItem>
                  {route == 'general' && (
                    <div className={classes.selectedLine} />
                  )}
                </div>

                <div style={{ flexDirection: 'row', display: 'flex' }}>
                  <CSSListItem
                    button
                    onClick={() => onChangeRoute('about')}
                    selected={route == 'about'}
                  >
                    <ListItemText primary={t('Information')} />
                  </CSSListItem>
                  {route == 'about' && <div className={classes.selectedLine} />}
                </div>
              </List>
            </div>
            <div className={classes.rightContent}>{renderContent(route)}</div>
          </div>
        </div>
      </DialogContent>
      <DialogActions style={{ padding: 0 }}>
        <Button
          onClick={() => {
            onClose();
          }}
        >
          {t('Close')}
        </Button>
        <Button
          onClick={() => {
            onSave();
          }}
          color="primary"
        >
          {t('Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

Setting.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

Setting.defaultProps = {
  open: false,
  onClose: () => {}
};
