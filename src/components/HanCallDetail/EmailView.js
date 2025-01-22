import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStyles } from './styles';
import { convertHtmlToPlainText } from '../../utils/';
import { useTranslation } from 'react-i18next';

export default function EmailView(props) {
  const classes = useStyles();
  const { data } = props;
  const { t, i18n } = useTranslation();

  const customer = data?.customer?.length > 0 ? data.customer[0] : null;
  const fromAddr = decodeURI(data?.from ?? '');
  const toAddr = decodeURI(data?.to ?? '');
  const Entities = require('html-entities').AllHtmlEntities;

  const entities = new Entities();
  const content = entities.decode(data?.contents ?? '');

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}
    >
      <div className={classes.wrapperContent}>
        <li className={classes.wrapperContentItem}>
          <div className={classes.wrapperContentItemTitle}>{t('Type')}</div>
          <div className={classes.wrapperContentItemContent}>{t('Email')}</div>
        </li>
        <li className={classes.wrapperContentItem}>
          <div className={classes.wrapperContentItemTitle}>{t('Sender')}</div>
          <div className={classes.wrapperContentItemContentHighlight}>
            <div
              dangerouslySetInnerHTML={{
                __html: fromAddr
              }}
            />
          </div>
        </li>
        <li className={classes.wrapperContentItem}>
          <div className={classes.wrapperContentItemTitle}>{t('To')}</div>
          <div className={classes.wrapperContentItemContent}>
            <div
              dangerouslySetInnerHTML={{
                __html: toAddr
              }}
            />
          </div>
        </li>
        <li className={classes.wrapperContentItem}>
          <div className={classes.wrapperContentItemTitle}>{t('Date')}</div>
          <div className={classes.wrapperContentItemContent}>
            {data?.date_time ?? ''}
          </div>
        </li>
      </div>
      <ul className={classes.wrapperContent} style={{ flex: 1 }}>
        <li className={classes.wrapperContentItem}>
          <div className={classes.wrapperContentItemTitle}>{t('Contents')}</div>
          <div className={classes.wrapperContentItemContent}>
            <div
              dangerouslySetInnerHTML={{
                __html: content
              }}
            />
          </div>
        </li>
      </ul>
    </div>
  );
}

EmailView.propTypes = {
  type: PropTypes.string
};

EmailView.defaultProps = {
  type: 'contact'
};
