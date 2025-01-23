import React, { useState, useEffect, Fragment } from 'react';
import HanModal from '../../../../components/HanModal';
import HanSelect from '../../../../components/HanSelect';
import HanTextField from '../../../../components/HanTextField';
import HanFormControl from '../../../../components/HanFormControl';
import { useStyles } from '../styles';

import Button from '@material-ui/core/Button';
import { Grid, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CUSTOMER_TYPE, CUSTOMER_CATEGORY } from '../../../../configs/constant';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import Contact from './Contact';
import CRMApi from '../../../../core/service/vn/server.api';

let tokenUpdateCreateContact;
export default function CreateUpdateContact(props) {
  const { t } = useTranslation();
  const { onClose, open, onChangeContact, phone, showAlert, settings } = props;
  const [openContact, setOpenContact] = React.useState(false);
  const [loading, setLoading] = useState(false);

  let phoneTypes = [];
  let phoneTypesCompany = [];
  const { address } = settings.phoneTypes;
  if (address != null) {
    const arr = [];
    const arr1 = [];
    Object.keys(address).map(key => {
      arr.push({ id: key, name: address[key] });
      if (key != '4') {
        arr1.push({ id: key, name: address[key] });
      }
    });
    phoneTypes = arr;
    phoneTypesCompany = arr1;
  }

  const defaultPhoneType = phoneTypes.length > 0 ? phoneTypes[0]['id'] : '';

  const customerCategorySource = Object.values(CUSTOMER_CATEGORY);
  const customerTypeSource = Object.values(CUSTOMER_TYPE);
  const defaultCustomerType = customerTypeSource[0].value;
  const defaultCustomerCategory = customerCategorySource[0].category;
  const classes = useStyles();
  const handleClose = () => {
    onClose(false);
  };

  const initData = () => {
    return {
      category: defaultCustomerCategory,
      state: '',
      cn: '',
      code: '',
      id: null,
      customerid: null,
      name: '',
      companyName: '',
      parentcn: '',
      parentcode: '',
      parentname: '',
      phone: phone,
      ext: '',
      phonetype: defaultPhoneType,
      rating: '',
      type: defaultCustomerType,
      email: '',
      staffs: null
    };
  };

  const [contact, setContact] = useState(initData);

  const [formState, setFormState] = useState({
    disableCompany: false,
    disableName: false
  });

  const [createMode, setCreateMode] = useState(true);

  const updateControlView = data => {
    if (createMode) {
      setFormState({
        disableCompany: false,
        disableName: false
      });
    } else {
      if (data.type == 'company') {
        setFormState({
          disableCompany: true,
          disableName: false
        });
      } else if (data.type == 'contact') {
        setFormState({
          disableCompany: true,
          disableName: true
        });
      } else if (data.type == 'employee') {
        setFormState({
          disableCompany: true,
          disableName: true
        });
      } else {
        setFormState({
          disableCompany: false,
          disableName: false
        });
      }
    }
  };

  const updateDataToContact = callProfile => {
    if (callProfile) {
      const customerName =
        callProfile?.type == 'company' ? '' : callProfile?.name;
      const companyName =
        callProfile?.type == 'company'
          ? callProfile?.name
          : callProfile?.parentname;

      setContact({
        category: callProfile.category ?? '',
        cn: callProfile.cn ?? '',
        code: callProfile.code ?? '',
        id: callProfile.id,
        name: customerName ?? '',
        companyName: companyName ?? '',
        parentcn: callProfile.parentcn ?? '',
        parentcode: callProfile.parentcode ?? '',
        parentname: callProfile.parentname ?? '',
        phone: callProfile.phone ?? '',
        phonetype: callProfile.phonetype ?? '',
        rating: callProfile.rating ?? '',
        type: callProfile.type ?? '',
        customerid: callProfile.customerid,
        email: callProfile.email ?? '',
        staffs: callProfile.staffs
      });
    }
  };

  useEffect(() => {
    if (contact) {
      updateControlView(contact);
    }
  }, [contact]);

  function validForm() {
    let message = [];

    if (!contact?.phone || contact?.phone?.length <= 0) {
      message.push(t('Please fill phone'));
    }
    if (contact.type == 'company') {
      if (!contact?.companyName || contact?.companyName?.length <= 0) {
        message.push(t('Please fill company name'));
      }
    } else {
      if (!contact?.name || contact?.name?.length <= 0) {
        message.push(t('Please fill name'));
      }
    }

    return message.length == 0 ? null : message.join('\n');
  }

  const doCreateOrUpdate = async () => {
    if (createMode) {
      let msg = validForm();
      if (msg) {
        showAlert(msg);
        return;
      }

      let isCompanyType = contact.type == 'company';

      if (!isCompanyType || !contact?.name || contact?.name?.length <= 0) {
        //Add company only
        setLoading(true);
        let result = await postNewCustomer(false);
        setLoading(false);
        if (result?.success) {
          if (isCompanyType) {
            showAlert(t('Create company success'));
          } else {
            showAlert(t('Create customer success'));
          }

          const rows = result.rows;
          const customerName = isCompanyType
            ? contact.companyName
            : contact.name;
          onChangeContact({
            ...contact,
            name: customerName,
            parentname: !isCompanyType ? '' : contact.companyName,
            cn: rows.cn,
            customerid: rows.id,
            code: rows.code
          });
        } else {
          showAlert(result?.msg ?? result?.error ?? 'Unknown error');
        }
      } else {
        setLoading(true);
        let result = await postNewCustomer(true);
        if (result?.success) {
          const rows = result.rows;
          let updateContact = {
            ...contact,
            cn: rows.cn,
            customerid: rows.id,
            code: rows.code
          };

          result = await putPhoneToCustomerRequest(updateContact);
          if (result?.success) {
            onChangeContact({
              ...updateContact,
              type: 'employee',
              name: contact.name,
              parentname: contact.companyName
            });
            showAlert(t('Create company success'));
          } else {
            showAlert(result?.msg ?? result?.error ?? 'Unknown error');
          }
        } else {
          showAlert(result?.msg ?? result?.error ?? 'Unknown error');
        }
      }
    } else {
      setLoading(true);
      let result = await putPhoneToCustomerRequest(contact);
      setLoading(false);
      if (result?.success) {
        let newType = contact.type;
        if (
          contact.type == 'company' &&
          contact.name != '' &&
          contact.name != null
        ) {
          //register employee
          newType = 'employee';
        }

        const customerName =
          newType == 'company' ? contact.companyName : contact.name;
        onChangeContact({
          ...contact,
          type: newType,
          name: customerName,
          parentname: contact.companyName
        });
        showAlert(t('Create phone success'));
      } else {
        showAlert(result?.msg ?? result?.error ?? 'Unknown error');
      }
    }
  };

  const putPhoneToCustomerRequest = async contactParam => {
    try {
      tokenUpdateCreateContact = `tokenUpdateCreateContact_${Date.now()}`;
      let result = await CRMApi.apiPutRegisterPhone({
        cancelToken: tokenUpdateCreateContact,
        customerid: contactParam.customerid,
        customerCode: contactParam.code,
        phoneNumber: contactParam.phone,
        phoneType: contactParam.phonetype,
        phoneExt: contactParam.ext,
        customerType: contactParam.type,
        customerName: contactParam.name
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

  const postNewCustomer = async withoutPhone => {
    try {
      tokenUpdateCreateContact = `tokenUpdateCreateContact_${Date.now()}`;
      const categoryObj = customerCategorySource.find(
        item => item.category == contact.category
      );
      let result = await CRMApi.apiPostNewCustomer({
        cancelToken: tokenUpdateCreateContact,
        category: categoryObj.category,
        state: categoryObj.state,
        type: contact.type,
        name: contact.type == 'company' ? contact.companyName : contact.name,
        phone: contact.phone,
        phonetype: contact.phonetype,
        phoneext: contact.ext,
        email: contact.email,
        withoutPhone: withoutPhone
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

  function renderModalFooter() {
    return (
      <div>
        <Button variant="outlined" onClick={handleClose}>
          {t('Close')}
        </Button>
        {!createMode && (
          <Button
            variant="outlined"
            onClick={() => {
              setCreateMode(true);
              updateDataToContact(initData());
            }}
          >
            {t('Clear')}
          </Button>
        )}
        <Button
          style={{ marginLeft: 10 }}
          variant="outlined"
          onClick={() => {
            doCreateOrUpdate();
          }}
        >
          {loading ? (
            <Fragment>
              <Grid container justifyContent="center" style={{ width: 26 }}>
                <CircularProgress color="inherit" size={16} />
              </Grid>
            </Fragment>
          ) : createMode ? (
            t('Create')
          ) : (
            t('Update')
          )}
        </Button>
      </div>
    );
  }

  const renderCompanyType = () => {
    return (
      <Fragment>
        <HanFormControl label={t('Company')}>
          <div className={classes.addUserContent}>
            <div style={{ width: 'calc(100% - 50px)' }}>
              <HanTextField
                disabled={formState.disableCompany}
                value={contact.companyName ?? ''}
                onChange={event => {
                  setContact({
                    ...contact,
                    companyName: event.target.value
                  });
                }}
              />
            </div>
            <div>
              <Button
                onClick={() => setOpenContact(true)}
                variant="contained"
                color="primary"
                style={{ marginLeft: 10 }}
              >
                <PermContactCalendarIcon />
              </Button>
            </div>
          </div>
        </HanFormControl>
        <HanFormControl label={t('Employee Name')}>
          <div className={classes.addUserContent}>
            <div style={{ width: '100%' }}>
              <HanTextField
                disabled={formState.disableName}
                value={contact.name ?? ''}
                onChange={event => {
                  if (
                    (event.target.value == null || event.target.value == '') &&
                    contact.phonetype == '4'
                  ) {
                    setContact({
                      ...contact,
                      phonetype: defaultPhoneType,
                      name: event.target.value
                    });
                  } else {
                    setContact({
                      ...contact,
                      name: event.target.value
                    });
                  }
                }}
              />
            </div>
          </div>
        </HanFormControl>
      </Fragment>
    );
  };

  const renderContactType = () => {
    return (
      <Fragment>
        <HanFormControl label={t('Contact')}>
          <div className={classes.addUserContent}>
            <div style={{ width: 'calc(100% - 50px)' }}>
              <HanTextField
                disabled={formState.disableName}
                value={contact.name ?? ''}
                onChange={event => {
                  setContact({
                    ...contact,
                    name: event.target.value
                  });
                }}
              />
            </div>
            <div>
              <Button
                onClick={() => setOpenContact(true)}
                variant="contained"
                color="primary"
                style={{ marginLeft: 10 }}
              >
                <PermContactCalendarIcon />
              </Button>
            </div>
          </div>
        </HanFormControl>
      </Fragment>
    );
  };

  const renderUpdateType = () => {
    return (
      <Fragment>
        <HanFormControl label={t('Company')}>
          <div className={classes.addUserContent}>
            <div style={{ width: 'calc(100% - 50px)' }}>
              <HanTextField
                disabled={formState.disableCompany}
                value={contact.companyName ?? ''}
                onChange={event => {
                  setContact({
                    ...contact,
                    companyName: event.target.value
                  });
                }}
              />
            </div>
            <div>
              <Button
                onClick={() => setOpenContact(true)}
                variant="contained"
                color="primary"
                style={{ marginLeft: 10 }}
              >
                <PermContactCalendarIcon />
              </Button>
            </div>
          </div>
        </HanFormControl>
        <HanFormControl label={t('Name')}>
          <div className={classes.addUserContent}>
            <div style={{ width: '100%' }}>
              <HanTextField
                disabled={formState.disableName}
                value={contact.name ?? ''}
                onChange={event => {
                  setContact({
                    ...contact,
                    name: event.target.value
                  });
                }}
              />
            </div>
          </div>
        </HanFormControl>
      </Fragment>
    );
  };

  return (
    <HanModal
      label={t('Customer')}
      open={open}
      size={'md'}
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
        <div className={classes.wrapperContent} style={{ width: '100%' }}>
          {createMode && (
            <HanFormControl label={t('Customer Type')}>
              <div className={classes.addUserContent}>
                <div style={{ width: '100%' }}>
                  <HanSelect
                    t={t}
                    value={contact.type}
                    onChange={value => {
                      setContact({
                        ...contact,
                        type: value
                      });
                    }}
                    source={customerTypeSource}
                    fieldTitle={'title'}
                    fieldValue={'value'}
                  />
                </div>
              </div>
            </HanFormControl>
          )}
          <HanFormControl label={t('Category')}>
            <div className={classes.addUserContent}>
              <div style={{ width: '100%' }}>
                <HanSelect
                  t={t}
                  disabled={!createMode}
                  value={contact.category}
                  onChange={value => {
                    setContact({
                      ...contact,
                      category: value
                    });
                  }}
                  source={customerCategorySource}
                  fieldTitle={'title'}
                  fieldValue={'category'}
                />
              </div>
            </div>
          </HanFormControl>
          {createMode
            ? contact.type == 'company'
              ? renderCompanyType()
              : renderContactType()
            : renderUpdateType()}

          {createMode && (
            <HanFormControl label={t('Email')}>
              <div className={classes.addUserContent}>
                <div style={{ width: '100%' }}>
                  <HanTextField
                    value={contact.email ?? ''}
                    onChange={event => {
                      setContact({
                        ...contact,
                        email: event.target.value
                      });
                    }}
                  />
                </div>
              </div>
            </HanFormControl>
          )}
          <HanFormControl label={t('Phone')}>
            <div className={classes.addUserContent}>
              <div style={{ width: 'calc(50% - 5px)' }}>
                {contact.phonetype == '3' ? (
                  <div style={{ display: 'flex', width: '100%' }}>
                    <HanTextField
                      customstyle={{ width: '70%' }}
                      value={contact.phone ?? ''}
                      onChange={event => {
                        setContact({
                          ...contact,
                          phone: event.target.value
                        });
                      }}
                    />
                    <HanTextField
                      placeholder={'EXT'}
                      customstyle={{ width: '30%', marginLeft: 5 }}
                      value={contact.ext ?? ''}
                      onChange={event => {
                        setContact({
                          ...contact,
                          ext: event.target.value
                        });
                      }}
                    />
                  </div>
                ) : (
                  <HanTextField
                    value={contact.phone ?? ''}
                    onChange={event => {
                      setContact({
                        ...contact,
                        phone: event.target.value
                      });
                    }}
                  />
                )}
              </div>
              <div style={{ width: 'calc(50% - 5px)' }}>
                <HanSelect
                  t={t}
                  value={
                    contact.phonetype == null || contact.phonetype == ''
                      ? defaultPhoneType
                      : contact.phonetype
                  }
                  onChange={value => {
                    setContact({
                      ...contact,
                      phonetype: value
                    });
                  }}
                  source={
                    contact.name != null && contact.name != ''
                      ? phoneTypes
                      : phoneTypesCompany
                  }
                  fieldTitle={'name'}
                  fieldValue={'id'}
                />
              </div>
            </div>
          </HanFormControl>
        </div>
        {openContact && (
          <Contact
            open={openContact}
            onClose={() => setOpenContact(false)}
            onChangeContact={(pContact, unregister) => {
              if (pContact == null) {
                return;
              }

              let newContact = {
                ...pContact,
                customerid: pContact.id,
                phonetype: contact.phonetype,
                ext: contact.ext,
                phone: contact.phone,
                parentname: pContact.parent_name,
                parentcn: pContact.parent_cn,
                parentcode: pContact.parent_code
              };

              updateDataToContact(newContact);
              setCreateMode(false);
            }}
          />
        )}
      </div>
    </HanModal>
  );
}

CreateUpdateContact.propTypes = {
  onChangeContact: PropTypes.func,
  defaultKeyword: PropTypes.string,
  defaultType: PropTypes.string
};
CreateUpdateContact.defaultProps = {
  onChangeContact: null,
  defaultType: ''
};
