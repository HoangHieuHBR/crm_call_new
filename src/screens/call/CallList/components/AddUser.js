import React, { useEffect, useState } from 'react';
import { useStyles } from '../styles';
import HanSelect from '../../../../components/HanSelect';
import Button from '@material-ui/core/Button';
import HanTextField from '../../../../components/HanTextField';
import HanFormControl from '../../../../components/HanFormControl';
import Contact from './Contact';
import CreateUpdateContact from './CreateUpdateContact';
import { useSelector } from 'react-redux';
import { CALL_DIRECTION } from '../../../../configs/constant';

import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function AddUser(props) {
  const { showAlert } = props;
  const classes = useStyles();
  const settings = useSelector(state => state.call.globalSettings);
  const currentCall = useSelector(state => state.call.currentCall);

  const emptyHistory = window.emptyHistory;

  const { callProfile, callData } = currentCall;
  const incomming = callData?.direction == CALL_DIRECTION.INBOUND;
  const makeSurePhone = incomming ? callData?.from : callData?.to;
  const [phoneTypes, setPhoneTypes] = useState([]);
  const [openContact, setOpenContact] = React.useState(false);
  const [openCreateUpdateContact, setOpenCreateUpdateContact] = React.useState(
    false
  );
  const { t, i18n } = useTranslation();

  const [selectedContact, setSelectedContact] = React.useState({
    category: '',
    cn: '',
    code: '',
    id: null,
    customerid: null,
    name: '',
    companyName: '',
    parentcn: '',
    parentcode: '',
    parentname: '',
    phone: '',
    phonetype: '',
    rating: '',
    type: '',
    registerPhone: false,
    staffs: null
  });

  const [formState, setFormState] = useState({
    disableName: false,
    disableCompany: false
  });

  const defaultPhoneType = settings.phoneTypes?.address
    ? Object.keys(settings.phoneTypes?.address)[0]
    : '';

  const toggleModalContact = isOpen => {
    setOpenContact(isOpen ?? false);
  };

  const updateControlView = data => {
    if (data.type == 'company') {
      setFormState({
        disablePhone: false,
        disableName: false,
        disableCompany: true,
        disablePhoneType: false
      });
    } else if (data.type == 'contact') {
      setFormState({
        disablePhone: false,
        disableName: true,
        disableCompany: true,
        disablePhoneType: false
      });
    } else if (data.type == 'employee') {
      setFormState({
        disablePhone: emptyHistory ? false : true,
        disableName: true,
        disableCompany: true,
        disablePhoneType: emptyHistory ? false : true
      });
    } else {
      setFormState({
        disablePhone: emptyHistory ? false : true,
        disableName: true,
        disableCompany: true,
        disablePhoneType: emptyHistory ? false : true
      });
    }
  };

  const makeSureEmpty = input => {
    return input == null || input == '' ? null : input;
  };

  const updateDataToContact = profile => {
    if (profile) {
      let customerName = profile?.type == 'company' ? '' : profile?.name;

      let companyName =
        profile?.type == 'company' ? profile?.name : profile?.parentname;

      setSelectedContact({
        category: profile.category ?? '',
        cn: profile.cn ?? '',
        code: profile.code ?? '',
        id: profile.id,
        name: customerName ?? '',
        companyName: companyName ?? '',
        parentcn: profile.parentcn ?? '',
        parentcode: profile.parentcode ?? '',
        parentname: profile.parentname ?? '',
        phone: getPhoneContact(profile),
        phonetype: profile.phonetype ?? '',
        rating: profile.rating ?? '',
        type: profile.type ?? '',
        registerPhone: profile.registerPhone ?? false,
        customerid: profile.customerid,
        staffs: profile.staffs
      });
    }
  };

  const getPhoneContact = profile => {
    let phoneContact = makeSureEmpty(profile.phone) ?? makeSurePhone ?? '';
    if(isAddCallHistoryManually() && profile.phone_origin != null && profile.phone_origin.length >= 0) {
      phoneContact = '';
      for (let i = 0; i < profile.phone_origin.length; i++) {
        const phone = profile.phone_origin[i];
        if(phone.value != null && phone.value.trim() != "") {
          phoneContact = phone.value;
          break;
        }        
      }
    }
    return phoneContact;
  }

  const isAddCallHistoryManually = () => {
    return callData == null || Object.keys(callData).length == 0;
  }

  useEffect(() => {
    if (
      selectedContact == null ||
      selectedContact.id == null ||
      selectedContact.id == ''
    ) {
      let registerPhone = callProfile.registerPhone;
      if (callProfile.type == null || callProfile.type == '') {
        registerPhone = false;
      }

      callProfile.registerPhone = registerPhone;
      callProfile.phonetype =
        callProfile.phonetype == null || callProfile.phonetype == ''
          ? defaultPhoneType
          : callProfile.phonetype;
      updateDataToContact(callProfile);
    } else if (
      makeSurePhone &&
      makeSurePhone != '' &&
      (selectedContact.phone == null || selectedContact.phone == '')
    ) {
      setSelectedContact({
        ...selectedContact,
        phone: makeSurePhone ?? ''
      });
    }
  }, [makeSurePhone, callProfile]);

  useEffect(() => {
    if (selectedContact) {
      updateControlView(selectedContact);
    }
    props.onChangeContact(selectedContact);
  }, [selectedContact]);

  useEffect(() => {
    if (settings.phoneTypes) {
      const { address } = settings.phoneTypes;
      if (address != null) {
        const arr = [];
        Object.keys(address).map(key => {
          arr.push({ id: key, name: address[key] });
        });
        setPhoneTypes(arr);
      }
    }
  }, [settings.phoneTypes]);

  return (
    <div className={classes.wrapperContent}>
      <HanFormControl label={t('Phone')}>
        <div className={classes.addUserContent}>
          <div style={{ width: 'calc(50% - 5px)' }}>
            <HanTextField
              disabled={formState?.disablePhone}
              onChange={event => {
                setSelectedContact({
                  ...selectedContact,
                  phone: event.target.value
                });
              }}
              value={selectedContact.phone ?? '...'}
            />
          </div>
          <div style={{ width: 'calc(50% - 5px)' }}>
            <HanSelect
              disabled={formState?.disablePhoneType}
              t={t}
              value={
                selectedContact.phonetype == null ||
                selectedContact.phonetype == ''
                  ? defaultPhoneType
                  : selectedContact.phonetype
              }
              onChange={value => {
                setSelectedContact({
                  ...selectedContact,
                  phonetype: value
                });
              }}
              source={phoneTypes}
              fieldTitle={'name'}
              fieldValue={'id'}
            />
          </div>
        </div>
      </HanFormControl>
      <HanFormControl label={t('Name')}>
        <div className={classes.addUserContent}>
          <HanTextField
            disabled={formState?.disableName}
            value={selectedContact.name}
            onChange={event => {
              setSelectedContact({
                ...selectedContact,
                name: event.target.value
              });
            }}
          />
          <Button
            onClick={() => toggleModalContact(true)}
            variant="contained"
            color="primary"
            style={{ marginLeft: 10 }}
          >
            <PermContactCalendarIcon />
          </Button>
          {(selectedContact.type == null || selectedContact.type == '') &&
            !emptyHistory && (
              <Button
                onClick={() => setOpenCreateUpdateContact(true)}
                variant="contained"
                color="primary"
                style={{ marginLeft: 10 }}
              >
                <PersonAddIcon />
              </Button>
            )}
        </div>
      </HanFormControl>
      <HanFormControl label={t('Company')}>
        <HanTextField
          disabled={formState?.disableCompany}
          value={selectedContact.companyName}
          onChange={event => {
            setSelectedContact({
              ...selectedContact,
              companyName: event.target.value
            });
          }}
        />
      </HanFormControl>
      {openContact && (
        <Contact
          defaultType={selectedContact.type}
          defaultKeyword={''}
          onChangeContact={(contact, unregister) => {
            if (contact == null) {
              const newContact = {
                ...selectedContact,
                registerPhone: !unregister
              };
              setSelectedContact(newContact);
              return;
            }

            let registerPhone = !unregister;
            if (contact.code == selectedContact.code) {
              registerPhone = selectedContact.registerPhone;
            }

            let newContact = {
              ...contact,
              customerid: contact.id,
              phonetype: selectedContact.phonetype,
              phone: selectedContact.phone,
              registerPhone: registerPhone,
              id: selectedContact.id,
              parentname: contact.parent_name,
              parentcn: contact.parent_cn,
              parentcode: contact.parent_code
            };

            console.log(newContact);
            updateDataToContact(newContact);
          }}
          open={openContact}
          onClose={toggleModalContact}
        />
      )}

      {openCreateUpdateContact && (
        <CreateUpdateContact
          settings={settings}
          showAlert={showAlert}
          phone={selectedContact.phone}
          onChangeContact={contact => {
            let newContact = {
              ...contact,
              id: selectedContact.id
            };

            updateDataToContact(newContact);
            setOpenCreateUpdateContact(false);
          }}
          open={openCreateUpdateContact}
          onClose={() => setOpenCreateUpdateContact(false)}
        />
      )}
    </div>
  );
}

AddUser.propTypes = {
  onChangeContact: PropTypes.func
};

AddUser.defaultProps = {
  onChangeContact: contact => {}
};
