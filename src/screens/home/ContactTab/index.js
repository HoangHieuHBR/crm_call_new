import React, { useState } from 'react';
import { useStyles } from './styles';
import HanContact from '../../../components/HanContact';
import CRMApi from '../../../core/service/vn/server.api';
import { useTranslation } from 'react-i18next';
import HanModal from '../../../components/HanModal';
import { Button, List, ListItem, ListItemText } from '@material-ui/core';
import { PhoneIcon } from '../../../components/HanSVGIcon';
import 'simplebar';
import * as ipc from '../../../utils/ipc';

export default function ContactTab() {
  const classes = useStyles();
  const { t } = useTranslation();
  const [openCustomerData, setOpenCustomerData] = useState({
    show: false,
    item: null
  });

  const [selectedPhone, setSelectedPhone] = useState(null);

  const onChoose = item => {
    // const staffs = item?.staffs;
    // let findItem = null;
    // if (staffs && staffs.length > 0) {
    //   findItem = staffs.find(v => {
    //     return v.staff_user_cn == CRMApi.cn && v.staff_user_no == CRMApi.userNo;
    //   });
    // }
    // if (findItem && item.phone_origin?.length > 0) {
    //   setOpenCustomerData({
    //     show: true,
    //     item: item
    //   });
    // }
  };

  const handleClose = () => {
    setOpenCustomerData({
      show: false,
      item: null
    });
  };

  const renderModalFooter = () => {
    return (
      <>
        <Button variant="outlined" onClick={handleClose}>
          {t('Close')}
        </Button>
      </>
    );
  };

  const makeCall = phoneObj => {
    // const phone = `${phoneObj.country ?? ''}${phoneObj.value}`;
    const phone = `84939140076`;
    setSelectedPhone(phone);
    const data = {
      userKey: CRMApi.userKey,
      phone: phone,
      from: CRMApi.extendPhone,
      to: phone
    };
    ipc.requestMakeCall(data);
  };

  return (
    <div className={classes.contactContainer}>
      <div className={classes.center}>
        <HanContact enableAssignToMe={true} onChoose={onChoose} />
        {openCustomerData.show && (
          <HanModal
            label={'subject'}
            open={true}
            size={'sm'}
            modalFooter={renderModalFooter}
          >
            <List data-simplebar>
              <div>
                {openCustomerData.item.phone_origin.map((e, index) => {
                  return (
                    <ListItem
                      button
                      key={`list-${index}`}
                      selected={
                        selectedPhone ? selectedPhone.id == e.id : false
                      }
                      onClick={event => makeCall(e)}
                    >
                      <ListItemText
                        primary={`${e.country ?? ''}${e.value}`}
                      ></ListItemText>
                      <PhoneIcon />
                    </ListItem>
                  );
                })}
              </div>
            </List>
          </HanModal>
        )}
      </div>
    </div>
  );
}
