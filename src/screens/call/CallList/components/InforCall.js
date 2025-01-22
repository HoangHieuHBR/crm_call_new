import React, { useState, useEffect } from 'react';
import { useStyles } from '../styles';
import HanSelect from '../../../../components/HanSelect';
import HanMultiSelect from '../../../../components/HanMultiSelect';
import {
  PRIORITIES,
  DISABLE_PRODUCT_TICKET
} from '../../../../configs/constant';
import HanTextField from '../../../../components/HanTextField';
import HanFormControl from '../../../../components/HanFormControl';
import HanDateTimePicker from '../../../../components/HanDatePicker/HanDateTimePicker';
import { useSelector } from 'react-redux';
import moment from 'moment';

import PropTypes from 'prop-types';
import CRMApi from '../../../../core/service/vn/server.api';
import { useTranslation } from 'react-i18next';

export default function InforCall(props) {
  const { t, i18n } = useTranslation();
  const { contact } = props;

  const classes = useStyles();
  const settings = useSelector(state => state.call.globalSettings);
  const currentCall = useSelector(state => state.call.currentCall);
  const { purposes, products } = settings;

  const emptyHistory = window.emptyHistory;

  const staffs = contact?.staffs;
  const assigned = () => {
    let result = [];
    if (staffs && staffs.length > 0) {
      staffs.forEach(element => {
        result.push(element.staff_user_name);
      });
    } else {
      result.push(CRMApi.extraInfo.username);
    }

    return result.join(',');
  };

  const initInfoData = () => {
    return {
      products: [],
      purposes: purposes?.length ? [purposes[0]] : [],
      subject: '',
      content: '',
      dueDateRaw: currentCall.acceptTime,
      duedate:
        currentCall.acceptTime > 0
          ? moment(currentCall.acceptTime).format('YYYY/MM/DD HH:mm')
          : moment().format('YYYY/MM/DD HH:mm'),
      priority: PRIORITIES.default,
      assigned: `${assigned()}`
    };
  };

  const [infoData, setInfoData] = useState(initInfoData);

  useEffect(() => {
    props.onChangeInfoData(infoData);
  }, [infoData]);

  useEffect(() => {
    setInfoData({
      ...infoData,
      assigned: `${assigned()}`
    });
  }, [staffs]);

  return (
    <div className={classes.wrapperContent}>
      <HanFormControl label={t('Date')}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          {emptyHistory ? (
            <div>
              <HanDateTimePicker
                onChangeDate={value => {
                  setInfoData({
                    ...infoData,
                    duedate: moment(value).format('YYYY/MM/DD HH:mm')
                  });
                }}
              />
            </div>
          ) : (
            <span
              style={{
                width: 150
              }}
            >
              {infoData.duedate}
            </span>
          )}

          <span style={{ width: 100, paddingLeft: 10, color: '#8A9EAD' }}>
            {t('Priority')}
          </span>
          <div style={{ flex: 1 }}>
            <HanSelect
              t={t}
              onChange={value => {
                setInfoData({
                  ...infoData,
                  priority: value
                });
              }}
              source={PRIORITIES.source}
              value={PRIORITIES.default}
            />
          </div>
        </div>
      </HanFormControl>
      <HanFormControl label={t('Assigned')}>
        <span className={classes.titleAsigned}>{`${infoData.assigned}`}</span>
      </HanFormControl>

      <HanFormControl label={t('Purpose')}>
        <HanMultiSelect
          t={t}
          label={t('Purpose')}
          onChange={value => {
            setInfoData({
              ...infoData,
              purposes: value
            });
          }}
          fieldTitle={'content'}
          fieldValue={'id'}
          source={purposes}
          value={infoData.purposes}
        />
      </HanFormControl>
      {DISABLE_PRODUCT_TICKET == false && (
        <HanFormControl label={t('Product')}>
          <HanMultiSelect
            t={t}
            label={t('Product')}
            onChange={value => {
              setInfoData({
                ...infoData,
                products: value
              });
            }}
            source={products}
            fieldTitle={'name'}
            fieldValue={'prod_code'}
          />
        </HanFormControl>
      )}

      <HanFormControl label={t('Subject')}>
        <HanTextField
          onChange={e => {
            setInfoData({
              ...infoData,
              subject: e.target.value
            });
          }}
        />
      </HanFormControl>
      <HanFormControl label={t('Content')}>
        <HanTextField
          multiline
          rows={8}
          onChange={e => {
            setInfoData({
              ...infoData,
              content: e.target.value
            });
          }}
        />
      </HanFormControl>
    </div>
  );
}

InforCall.propTypes = {
  onChangeInfoData: PropTypes.func
};

InforCall.defaultProps = {
  onChangeInfoData: info => {}
};
