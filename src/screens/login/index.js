import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as remote from '@electron/remote';
import { useTranslation } from 'react-i18next';
import {
  FormControlLabel,
  Grid,
  Snackbar,
  CircularProgress,
  Container,
  Typography,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useStyles } from './styles';
import { useTheme } from '@material-ui/core/styles';
import {
  CssTextFieldStyleDL,
  CSSCheckBoxStyleDL,
  CSSButtonStyleDL,
} from './component.styles';

import CRMAPI from '../../core/service/vn/server.api';
import OTPDialog from './OTPDialog';
import crmcallServiceCenter from '../../core/service/vn/crmcallservice';
import IMGLogin from '../../../assets/img_login.svg';
import LogoCRMCall from '../../../assets/logo_crm_call.svg';
import * as constantApp from '../../configs/constant';
import * as ipc from '../../utils/ipc';
import * as utils from '../../utils';
import * as Actions from '../../actions';

var keepLoginData = null;

var otpIsShow, gAutoLogin, gModeCountry;

var loginCRMToken = null;
var checkCRMMode = null;

window.isKoreaMode = false;

export default function Login() {
  const { MODE_COUNTRY } = constantApp;

  const [domain, setDomain] = useState('');
  const [userid, setID] = useState('');
  const [password, setPassWord] = useState('');
  const [extendNumber, setExtendNumber] = useState('');
  const [autologin, setAutoLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [domainValid, setDomainValid] = useState(true);
  const [errorDomain, setErrorDomain] = useState('');
  const [extendNumberValid, setExtendNumberValid] = useState(true);
  const [errorExtendNumber, setErrorExtendNumber] = useState('');
  const [idValid, setIdValid] = useState(true);
  const [errorID, setErrorID] = useState('');
  const [passValid, setPassValid] = useState(true);
  const [errorPassword, setErrorPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, SetErrorSnackbar] = useState('');
  const [isShowPassword, showPassword] = useState(false);

  const [modeCountry, setModeCountry] = useState(MODE_COUNTRY.vietnamese);

  const [otpData, setOtpData] = useState({
    show: false,
    msg: null,
  });

  const theme = useTheme();
  const domainRef = React.createRef();
  const userIdRef = React.createRef();
  const passwordRef = React.createRef();
  const extendNumberRef = React.createRef();
  const dispatch = useDispatch();
  const extraInfo = useSelector((state) => state.auth.extraInfo);
  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(() => {
    const accountInfo = ipc.getDomainUserIDPassword();
    const domain = accountInfo?.domain ?? '';
    const userid = accountInfo?.userId ?? '';
    const password = accountInfo?.password ?? '';
    const extendNumber = accountInfo?.extend ?? '';
    const autologin = accountInfo?.autoLogin ?? false;
    const modecountry = accountInfo?.mode_country;
    const alreadyLogin = accountInfo?.alreadyLogin ?? false;
    const extraData = accountInfo?.extraData;

    ipc.onIpcEvent(constantApp.MAIN_TO_RENDER_EVENT, nodeListener);
    crmcallServiceCenter.addListener(listener);

    setLoginPageIsShow(true);
    document.title = 'CRMCall';

    if (extraInfo) {
      let code = extraInfo.code;
      setTimeout(() => {
        if (code == 1 || code == 2) {
          showAlert(t(extraInfo.msg));
          ipc.moveCurrentWindowsToTop();
        }
      }, 500);
    }

    let extraLoginWithoutOTP = null;
    // if (extraData) {
    //   extraLoginWithoutOTP = {
    //     cookies: extraData.cookies,
    //     jwt: extraData.jwt,
    //     hmail: extraData.hmail,
    //     session: extraData.session
    //   };
    // }

    setDomain(domain);
    setID(userid);
    setPassWord(password);
    setExtendNumber(extendNumber);
    setAutoLogin(autologin);
    setModeCountry(modecountry);

    const isKorea = modecountry == MODE_COUNTRY.korean;
    if (isKorea && alreadyLogin) {
      CRMAPI.updateDataV2(domain, extraData);
      const data = {
        data: {
          domain: domain,
          userId: userid,
          password: password,
          extendNumber: extendNumber,
          result: { ...extraData, extend: extendNumber },
        },
      };
      window.isKoreaMode = isKorea;
      dispatch(Actions.requestNavigateHomePage(modecountry, data));
    } else if (
      autologin &&
      ((isKorea && !isAttempDisableAutoLogin()) ||
        (!isKorea && alreadyLogin && !isAttempDisableAutoLogin()))
    ) {
      doLogin(
        domain,
        userid,
        password,
        extendNumber,
        autologin,
        modecountry,
        null,
        extraLoginWithoutOTP,
      );
    } else {
      const validDomain = utils.validate.isDomain(domain);
      if (!validDomain.success) {
        domainRef && domainRef.current && domainRef.current.focus();
      } else {
        const validId = utils.validate.isID(userid);
        if (!validId.success) {
          userIdRef && userIdRef.current && userIdRef.current.focus();
        } else {
          const validExtendNumber = utils.validate.isExtendNumber(extendNumber);
          if (!validExtendNumber.success) {
            extendNumberRef &&
              extendNumberRef.current &&
              extendNumberRef.current.focus();
          } else {
            passwordRef && passwordRef.current && passwordRef.current.focus();
          }
        }
      }
    }

    return function cleanup() {
      crmcallServiceCenter.removeListener(listener);
      ipc.removeIpcEvent(constantApp.MAIN_TO_RENDER_EVENT, nodeListener);
      setLoginPageIsShow(false);
    };
  }, []);

  const setLoginPageIsShow = (show) => {
    // remote.getGlobal('ShareGlobalObject').inLoginPage = show;
  };

  const isAttempDisableAutoLogin = () => {
    return remote.getGlobal('ShareGlobalObject').attempDisableAutoLogin;
  };

  const handleClosed = () => {
    setOpenSnackbar(false);
  };

  const showAlert = (msg) => {
    SetErrorSnackbar(msg);
    setOpenSnackbar(true);
  };

  const onChangeDomain = (domain) => {
    const validDomain = utils.validate.isDomain(domain);
    setDomain(validDomain.value);
    setDomainValid(validDomain.success);
    setErrorDomain('');
  };

  const onChangeExtendNumber = (extend) => {
    const validExtendNumber = utils.validate.isExtendNumber(extend);
    setExtendNumber(validExtendNumber.value);
    setExtendNumberValid(validExtendNumber.value);
    setErrorExtendNumber('');
  };

  const onChangeID = (id) => {
    const validId = utils.validate.isID(id);
    setID(validId.value);
    setIdValid(validId.value);
    setErrorID('');
  };

  const onChangePass = (value) => {
    const validPass = utils.validate.isPass(value, false);
    setPassWord(validPass.value);
    setPassValid(validPass.success);
    setErrorPassword('');
  };

  const doLogin = (
    domain,
    userid,
    password,
    extend,
    autologin,
    modecountry,
    otpcode,
    extraLoginWithoutOTP = null,
  ) => {
    if (loading) {
      CRMAPI.cancelRequest(checkCRMMode);
      CRMAPI.cancelRequest(loginCRMToken);
      ipc.cancelLogin();
      crmcallServiceCenter.disconnectService();
      setLoading(false);
    } else {
      const validDomain = utils.validate.isDomain(domain);
      const validId = utils.validate.isID(userid);
      const validExtendNumber = utils.validate.isExtendNumber(extend);
      const validPass = utils.validate.isPass(password, false);

      setDomain(validDomain.value);
      setDomainValid(validDomain.success);
      setErrorDomain(t(validDomain.msg));
      setExtendNumber(validExtendNumber.value);
      setExtendNumberValid(validExtendNumber.success);
      setErrorExtendNumber(validExtendNumber.msg);
      setID(validId.value);
      setIdValid(validId.success);
      setErrorID(t(validId.msg));
      setPassWord(validPass.value);
      setPassValid(validPass.success);
      setErrorPassword(t(validPass.msg));

      if (
        validDomain.success &&
        validId.success &&
        validPass.success &&
        validExtendNumber.success
      ) {
        ipc.saveDomainUserIDPassword(
          domain,
          userid,
          password,
          extend,
          autologin,
          modecountry,
          '',
        );
        setLoading(true);

        try {
          checkCRMMode = `checkcrmmode_${Date.now()}`;
          CRMAPI.checkServerXMLExist({
            domain: domain,
            cancelToken: checkCRMMode,
            callback: (exist) => {
              ipc.saveDomainUserIDPassword(
                domain,
                userid,
                password,
                extend,
                autologin,
                exist ? MODE_COUNTRY.korean : MODE_COUNTRY.vietnamese,
                '',
              );
              setModeCountry(
                exist ? MODE_COUNTRY.korean : MODE_COUNTRY.vietnamese,
              );
              if (exist) {
                console.log('LOGIN WITH CRM SERVER');
                requestLoginCRMServer({
                  domain: domain,
                  userId: userid,
                  password: password,
                  extend: extend,
                  otpcode: otpcode,
                });
              } else {
                console.log('LOGIN WITH DOMAIN USER ID PASSWORD');
                crmcallServiceCenter.loginWithDomainUserIdPassword(
                  domain,
                  userid,
                  password,
                  extend,
                  otpcode,
                  extraLoginWithoutOTP,
                );
              }
            },
          });
        } catch (e) {
          setLoading(false);
        }
      }
    }
  };

  otpIsShow = otpData.show;
  gAutoLogin = autologin;
  gModeCountry = modeCountry;

  const listener = (action, data) => {
    console.log('LOGIN PAGE', action, data);
    if (action == constantApp.ACTION_LOGIN_SOCKET_EVENT) {
      if (data.code == constantApp.SOCKET_ERROR_CODE.require_otp) {
        //show otp
        setLoading(false);
        setOtpData({ show: true, msg: t(data.errorMessage) });
      } else if (data.code == constantApp.SOCKET_ERROR_CODE.customError) {
        //show otp
        setLoading(false);
        if (otpIsShow) {
          setOtpData({ show: true, msg: t(data.errorMessage) });
        } else {
          showAlert(t(data.errorMessage));
        }
      } else if (data.code == constantApp.SOCKET_ERROR_CODE.login_success) {
        setLoading(false);
        setOtpData({ show: false, msg: '' });
        const dataObj = data.data;

        ipc.saveDomainUserIDPassword(
          dataObj.domain,
          dataObj.userId,
          dataObj.password,
          dataObj.extendNumber,
          gAutoLogin,
          gModeCountry,
          dataObj.result,
        );

        window.isKoreaMode = gModeCountry == MODE_COUNTRY.korean;
        dispatch(Actions.requestNavigateHomePage(gModeCountry, data));

        ipc.broadcastLoginSuccess(dataObj);
      }
    } else if (action == constantApp.ACTION_ERROR_SOCKET_EVENT) {
      if (data.code == constantApp.SOCKET_ERROR_CODE.customError) {
        //show otp
        setLoading(false);
        if (otpIsShow) {
          setOtpData({ show: true, msg: t(data.errorMessage) });
        } else {
          showAlert(t(data.errorMessage));
        }
      }
    }
  };

  const nodeListener = (event, action, data) => {
    console.log('LOGIN PAGE', action, data);
    if (action == constantApp.ACTION_LOGIN_SOCKET_EVENT) {
      if (data.code == constantApp.SOCKET_ERROR_CODE.dns_error) {
        //show otp
        setLoading(false);
        showAlert(t('Cannot get CRM server configuration'));
      } else if (data.code == constantApp.SOCKET_ERROR_CODE.customError) {
        //show otp
        setLoading(false);
        showAlert(t(data.errorMessage));
      } else if (data.code == constantApp.SOCKET_ERROR_CODE.login_success) {
        console.log('LOGIN SUCCESS', data);

        const dataObj = data.data;

        let extraData;
        if (keepLoginData != null) {
          extraData = {
            ...dataObj.result,
            ...keepLoginData,
            extend: dataObj.result?.localphone,
            username: dataObj.result?.username ?? '',
          };
        } else {
          extraData = {
            ...dataObj.result,
            extend: dataObj.result?.localphone,
            username: dataObj.result?.username ?? '',
          };
        }

        CRMAPI.updateDataV2(dataObj.domain, {
          ...dataObj.result,
          extend: dataObj.localphone,
          username: dataObj.result?.username ?? '',
        });

        data.data.result = extraData;
        CRMAPI.updateDataV2(dataObj.domain, extraData);
        ipc.saveDomainUserIDPassword(
          dataObj.domain,
          dataObj.userId,
          dataObj.password,
          dataObj.extendNumber,
          gAutoLogin,
          gModeCountry,
          extraData,
        );
        window.isKoreaMode = gModeCountry == MODE_COUNTRY.korean;
        dispatch(Actions.requestNavigateHomePage(gModeCountry, data));
        ipc.broadcastLoginSuccess(dataObj);
      }
    } else if (action == constantApp.ACTION_ERROR_SOCKET_EVENT) {
      if (data.code == constantApp.SOCKET_ERROR_CODE.customError) {
        //show otp
        setLoading(false);
        if (otpIsShow) {
          setOtpData({ show: true, msg: t(data.errorMessage) });
        } else {
          showAlert(t(data.errorMessage));
        }
      }
    } else if (action == constantApp.ACTION_DATA_SOCKET_EVENT) {
      if (data.eventId == constantApp.EVENT_ID_LOGOUT_BY_OTHER_DEVICE) {
        CRMAPI.cancelRequest(loginCRMToken);
        CRMAPI.cancelRequest(checkCRMMode);
        setLoading(false);
        ipc.clearAccount(false);
        remote.getGlobal('ShareGlobalObject').attempDisableAutoLogin = true;
        dispatch(Actions.requestNavigateLoginPage(data.status));
        showAlert(t(data?.status?.msg));
        return;
      }
    }
  };

  const isNotEmpty = (str) => {
    return str != null && str != '';
  };

  const isRequireOTP = (data) => {
    if (!data.success && data.code == 'otp') {
      return true;
    }
    return false;
  };

  const isNotNeedOTP = (data) => {
    if (
      data.success &&
      isNotEmpty(data.session) &&
      isNotEmpty(data.hmail_key) &&
      isNotEmpty(data.jwt)
    ) {
      return true;
    }
    return false;
  };

  const isNotSupportCRM = (data) => {
    return data.crm_user == false;
  };

  const isOTPNotRegisterYet = (data) => {
    if (!data.success && data.code == 'force') {
      return true;
    }
    return false;
  };

  const requestLoginCRMServer = async (data) => {
    const dataObj = data;
    keepLoginData = null;
    let result;
    try {
      loginCRMToken = `loginsso_${Date.now()}`;
      result = await CRMAPI.postLoginAuth({
        cancelToken: loginCRMToken,
        domain: dataObj.domain,
        userid: dataObj.userId,
        password: dataObj.password,
        otpcode: dataObj.otpcode,
      });
    } catch (error) {
      console.log(error);
      ipc.cancelLogin();
      if (CRMAPI.isCanceled(error)) {
        return;
      }
    }

    if (isNotNeedOTP(result) && result?.jwt) {
      if (isNotSupportCRM(result)) {
        setLoading(false);
        setOtpData({ show: false, msg: '' });
        showAlert(t('Access denied'));

        return;
      }
      result.data = {
        session_gw: result.session ?? '',
        session_key: result.hmail_key ?? '',
        language: result.lang,
        jwt: result.jwt,
      };

      keepLoginData = result.data;

      ipc.loginWithDomainUserIDPassword({
        domain: dataObj.domain,
        userid: dataObj.userId,
        password: dataObj.password,
        extend: dataObj.extend,
        otpcode: dataObj.otpcode,
        extraLoginWithoutOTP: null,
      });
      return;
    } else if (isRequireOTP(result)) {
      setLoading(false);
      let msg = result.msg;
      setOtpData({ show: true, msg: msg ?? t('OTP required') });
      return;
    } else if (isOTPNotRegisterYet(result)) {
      setLoading(false);
      setOtpData({ show: false, msg: '' });
      showAlert(
        t(
          'Your account has not registered OTP. Please register OTP on web browser',
        ),
      );
      return;
    }

    setLoading(false);
    setOtpData({ show: false, msg: '' });
    showAlert(t('Authenticate failed'));
  };

  const handleClickShowPassword = () => {
    showPassword(!isShowPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className={classes.loginContainer}>
      <Container className={classes.imgLoginContainer}>
        <img src={IMGLogin} style={{ width: 320 }} />
      </Container>
      <Container maxWidth="sm" className={classes.center}>
        <div className={classes.paper}>
          <img src={LogoCRMCall} style={{ width: 102, marginBottom: 10 }} />
          <Typography variant="h4" component="h2">
            {t('Welcome to')}
            <b>{t('CRM Call')}</b>
          </Typography>
          <form className={classes.form} noValidate>
            <CssTextFieldStyleDL
              ref={domainRef}
              disabled={loading}
              margin="normal"
              required
              fullWidth
              id="domain"
              label={t('Domain')}
              name="domain"
              error={!domainValid}
              helperText={errorDomain}
              value={domain}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  if (userIdRef) {
                    userIdRef.current.focus();
                  }
                  ev.preventDefault();
                }
              }}
              onChange={(event) => {
                onChangeDomain(event.target.value);
              }}
            />
            <CssTextFieldStyleDL
              inputRef={userIdRef}
              disabled={loading}
              margin="normal"
              required
              fullWidth
              id="userid"
              label={t('User ID')}
              name="userid"
              error={!idValid}
              helperText={errorID}
              value={userid}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  if (passwordRef) {
                    passwordRef.current.focus();
                  }
                  ev.preventDefault();
                }
              }}
              onChange={(event) => {
                onChangeID(event.target.value);
              }}
            />
            <CssTextFieldStyleDL
              inputRef={passwordRef}
              disabled={loading}
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('Password')}
              type={isShowPassword ? 'text' : 'password'}
              id="password"
              error={!passValid}
              helperText={errorPassword}
              value={password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {isShowPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  doLogin(
                    domain,
                    userid,
                    password,
                    extendNumber,
                    autologin,
                    modeCountry,
                  );
                  ev.preventDefault();
                }
              }}
              onChange={(event) => {
                onChangePass(event.target.value);
              }}
            />
            <CssTextFieldStyleDL
              inputRef={extendNumberRef}
              disabled={loading}
              margin="normal"
              required
              fullWidth
              id="extendnumber"
              label={t('Extend Number')}
              name="extendnumber"
              error={!extendNumberValid}
              helperText={errorExtendNumber}
              value={extendNumber}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  doLogin(
                    domain,
                    userid,
                    password,
                    extendNumber,
                    autologin,
                    modeCountry,
                    null,
                  );
                  ev.preventDefault();
                }
              }}
              onChange={(event) => {
                onChangeExtendNumber(event.target.value);
              }}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <FormControlLabel
                checked={autologin}
                classes={{
                  label: classes.label,
                }}
                control={
                  <CSSCheckBoxStyleDL
                    disabled={loading}
                    color="primary"
                    onChange={(event) => {
                      setAutoLogin(event.target.checked);
                    }}
                  />
                }
                label={t('Auto Login')}
              />
            </div>
            <CSSButtonStyleDL
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() =>
                doLogin(
                  domain,
                  userid,
                  password,
                  extendNumber,
                  autologin,
                  modeCountry,
                  null,
                )
              }
            >
              {loading ? (
                <Fragment>
                  {t('Please waiting')}
                  <Grid container justifyContent="center" style={{ width: 26 }}>
                    <CircularProgress color="inherit" size={16} />
                  </Grid>
                </Fragment>
              ) : (
                t('LOGIN')
              )}
            </CSSButtonStyleDL>
          </form>

          {otpData.show && (
            <OTPDialog
              open={true}
              msg={otpData.msg}
              onClose={() => {
                setLoading(false);
                if (modeCountry == MODE_COUNTRY.korean) {
                  CRMAPI.cancelRequest(checkCRMMode);
                  CRMAPI.cancelRequest(loginCRMToken);
                } else {
                  crmcallServiceCenter.cancelLogin();
                }

                setOtpData({ show: false });
              }}
              onConfirm={(otp) => {
                setOtpData({ ...otpData, msg: null });
                doLogin(
                  domain,
                  userid,
                  password,
                  extendNumber,
                  autologin,
                  modeCountry,
                  otp,
                );
              }}
            />
          )}

          <Snackbar
            autoHideDuration={2000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={openSnackbar}
            onClose={() => handleClosed()}
            message={errorSnackbar}
          />
        </div>
      </Container>
    </div>
  );
}
