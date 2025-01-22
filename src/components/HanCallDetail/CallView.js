import React from 'react';
import PropTypes from 'prop-types';
import { useStyles } from './styles';
import { convertHtmlToPlainText } from '../../utils/';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import SecureAudio from '../HanSecureAudio';
import moment from 'moment-timezone';

export default function CallView(props) {
  const classes = useStyles();
  const globalSettings = useSelector(state => state.call.globalSettings);
  const { data } = props;
  const { t, i18n } = useTranslation();

  const purposesList = globalSettings?.purposes ?? [];

  console.log(data);

  const curTimeZone = data?.time_zone;

  const customer = data?.customer?.length > 0 ? data.customer[0] : null;

  const recordFile = data?.record_file ?? '';

  const formatTimeWithTimeZone = (time, timezone) => {
    if (timezone) {
      return time && time != ''
        ? moment(time, 'YYYY-MM-DDTHH:mm:ssZ')
            .tz(timezone)
            .format('YYYY/MM/DD HH:mm')
        : '';
    }
    return time && time != '' ? moment(time).format('YYYY/MM/DD HH:mm') : '';
  };

  const purposeMapToContent = () => {
    if (data?.purpose?.length > 0) {
      if (purposesList?.length > 0) {
        return data?.purpose
          .map(e => {
            return purposesList
              .filter(value => {
                return value.id == e.id;
              })
              .map(e => e.content);
          })
          .join(', ');
      } else {
        return data?.purpose.map(e => e.id).join(', ');
      }
    } else {
      return null;
    }
  };

  const purpose = purposeMapToContent();

  const product =
    data?.product?.length > 0
      ? data?.product.map(product => product.product_name).join(', ')
      : null;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <ul className={classes.wrapperContent}>
        <li className={classes.wrapperContentItemCustomer}>
          <div className={classes.wrapperContentItemTitle}>{t('Customer')}</div>
          <div className={classes.wrapperContentItemContentHighlight}>
            {customer?.customer_name ?? ''} - {customer?.customer_phone ?? ''}
          </div>
        </li>
      </ul>
      <div className={classes.wrapperContent} style={{ flex: 1 }}>
        <li className={classes.wrapperContentItem}>
          <div className={classes.wrapperContentItemTitle}>{t('Type')}</div>
          <div className={classes.wrapperContentItemContent}>
            {data?.type ?? ''}
          </div>
        </li>
        <li className={classes.wrapperContentItem}>
          <div className={classes.wrapperContentItemTitle}>
            {t('Call Recipient')}
          </div>
          <div className={classes.wrapperContentItemContentHighlight}>
            {data?.author_name ?? ''}
          </div>
        </li>
        <li className={classes.wrapperContentItem}>
          <div className={classes.wrapperContentItemTitle}>
            {t('Call Direction')}
          </div>
          <div className={classes.wrapperContentItemContent}>
            {data?.direction
              ? data?.direction == 'out'
                ? t('Outgoing')
                : t('Incoming')
              : ''}
          </div>
        </li>

        <li className={classes.wrapperContentItem}>
          <div className={classes.wrapperContentItemTitle}>{t('Date')}</div>
          <div className={classes.wrapperContentItemContent}>
            {formatTimeWithTimeZone(data?.date_time, curTimeZone)}
          </div>
        </li>
        <li className={classes.wrapperContentItem}>
          <div className={classes.wrapperContentItemTitle}>
            {t('Call Duration')}
          </div>
          <div className={classes.wrapperContentItemContent}>
            {data?.duration ?? 0} {t('second(s)')}
          </div>
        </li>
        <li className={classes.wrapperContentItem}>
          <div className={classes.wrapperContentItemTitle}>
            {t('Call Purpose')}
          </div>
          <div className={classes.wrapperContentItemContent}>
            {purpose ?? ''}
          </div>
        </li>
        <li className={classes.wrapperContentItem}>
          <div className={classes.wrapperContentItemTitle}>{t('Product')}</div>
          <div className={classes.wrapperContentItemContent}>
            {product ?? ''}
          </div>
        </li>
        <li className={classes.wrapperContentItem}>
          <div className={classes.wrapperContentItemTitle}>{t('Message')}</div>
          <div className={classes.wrapperContentItemContent}>
            {convertHtmlToPlainText(data?.content ?? '')}
          </div>
        </li>
        <li className={classes.wrapperContentItem}>
          <div className={classes.wrapperContentItemTitle}>
            {t('Recording file')}
          </div>
          <div className={classes.wrapperContentItemContent}>
            <SecureAudio url={recordFile ?? ''} t={t} />
          </div>
        </li>
      </div>
    </div>
  );
}

CallView.propTypes = {
  type: PropTypes.string
};

CallView.defaultProps = {
  type: 'contact'
};
