import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles } from './styles';
import { List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import AttachFile from '@material-ui/icons/AttachFile';
import CRMApi from '../../../core/service/vn/server.api';

class EmailView extends Component {
 const remote = window.require('@electron/remote');

  constructor(props) {
    super(props);
    this.webViewRef = React.createRef(null);
    this.openLinkWithURL = this.openLinkWithURL.bind(this);
    this.renderListAttachment = this.renderListAttachment.bind(this);
    this.onAttachmentClick = this.onAttachmentClick.bind(this);
  }
  // const classes = useStyles();
  // const { data } = props;
  // const { t, i18n } = useTranslation();

  // const customer = data?.customer?.length > 0 ? data.customer[0] : null;
  // const fromAddr = decodeURI(data?.from ?? '');
  // const toAddr = decodeURI(data?.to ?? '');
  // const Entities = require('html-entities').AllHtmlEntities;

  // const entities = new Entities();
  // const content = entities.decode(data?.contents ?? '');

  componentDidMount() {
    const { url } = this.props;
    this.webViewRef.addEventListener('click', e => {
      const href = e.target.href;
      e.preventDefault();
      if (href?.startsWith('http://') || href?.startsWith('https://')) {
        this.openLinkWithURL(e.target.href);
      }
    });
  }

  openLinkWithURL(url) {
    remote.shell
      .openExternal(url)
      .then(v => {})
      .catch(error => {});
  }

  onAttachmentClick(url) {
    const result = CRMApi.apiGetLinkDownloadFile({
      url: url
    });
    if (result) {
      console.log(result);
      this.openLinkWithURL(result);
    }
  }

  renderListAttachment(fileList) {
    const { classes } = this.props;
    return (
      <div>
        <List>
          {fileList.map(item => (
            <ListItem
              button
              key={item.link}
              onClick={event => this.onAttachmentClick(item.link)}
            >
              <ListItemIcon>
                <AttachFile />
              </ListItemIcon>
              <ListItemText
                primary={item.name ?? ''}
                secondary={item.filesize ?? ''}
              />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }

  render() {
    const { classes, t, data } = this.props;
    const fileList = data?.filelist?.length > 0 ? data?.filelist : [];

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
          overflow: 'auto'
        }}
      >
        <div className={classes.wrapperContent}>
          <li className={classes.wrapperContentItem}>
            <div className={classes.wrapperContentItemTitle}>{t('Type')}</div>
            <div className={classes.wrapperContentItemContent}>
              {t('Email')}
            </div>
          </li>
          <li className={classes.wrapperContentItem}>
            <div className={classes.wrapperContentItemTitle}>{t('Sender')}</div>
            <div className={classes.wrapperContentItemContentHighlight}>
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.from ?? ''
                }}
              />
            </div>
          </li>
          <li className={classes.wrapperContentItem}>
            <div className={classes.wrapperContentItemTitle}>{t('To')}</div>
            <div className={classes.wrapperContentItemContent}>
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.to ?? ''
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
          {fileList.length > 0 ? (
            <li className={classes.wrapperContentItem}>
              <div className={classes.wrapperContentItemTitle}>
                {t('Attachment')}
              </div>
              <div className={classes.wrapperContentItemContent}>
                {this.renderListAttachment(fileList)}
              </div>
            </li>
          ) : (
            <div></div>
          )}

          <li className={classes.wrapperContentItem} style={{ marginTop: 10 }}>
            <div className={classes.wrapperContentItemTitle}>
              {t('Contents')}
            </div>
            <div className={classes.wrapperContentItemContent}>
              <div
                ref={ref => (this.webViewRef = ref)}
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
}

EmailView.propTypes = {
  type: PropTypes.string,
  data: PropTypes.object,
  t: PropTypes.func
};

EmailView.defaultProps = {
  type: 'contact',
  data: {},
  t: v => v
};

export default withStyles(styles)(EmailView);
