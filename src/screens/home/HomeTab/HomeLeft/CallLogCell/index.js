import React, { Component } from 'react';
import { useStyles } from './styles';
import { CompanyTextTypography } from './component.styles';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import StarIcon from '@material-ui/icons/Star';
import PropTypes from 'prop-types';

export default function CallLogCell(props) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const { data, style, selected, onClick, enableUnread, onOpenMenu } = props;

  return (
    <ListItem
      className={classes.item}
      button
      // divider={true}
      selected={selected}
      onClick={onClick}
      style={style}
    >
      <ListItemIcon>
        <Avatar alt={data?.name} />
      </ListItemIcon>
      <ListItemText
        primary={
          <span className={classes.textUser}>
            {data?.name}
            <CompanyTextTypography
              variant="subtitle2"
              className={classes.textCompany}
            >
              <span>&#8226;</span>
            </CompanyTextTypography>
            <CompanyTextTypography
              variant="subtitle2"
              className={classes.textCompany}
            >
              {data?.company}
            </CompanyTextTypography>
          </span>
        }
        secondary={
          <React.Fragment>
            <Typography
              variant="caption"
              color={data?.type_call ? 'error' : 'primary'}
              className={classes.textMessage}
            >
              {data?.number}
            </Typography>
          </React.Fragment>
        }
      />
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
        <div className={classes.contentRight}>
          <StarIcon style={{ fontSize: 12, color: 'orange' }} />

          <CompanyTextTypography
            variant="caption"
            color="textSecondary"
            className={classes.textTime}
          >
            {'24/08/2020'}
          </CompanyTextTypography>
        </div>
        <div className={classes.contentSelect}>
          {selected && <div className={classes.selectedItem}></div>}
        </div>
      </div>
    </ListItem>
  );
}

CallLogCell.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
  user: PropTypes.object,
  user_cached: PropTypes.object,
  selectedLog: PropTypes.object,
  enableUnread: PropTypes.bool,
  onClick: PropTypes.func,
  onOpenMenu: PropTypes.func
};

CallLogCell.defaultProps = {
  data: {},
  style: {},
  user: {},
  user_cached: {},
  selectedLog: {},
  enableUnread: true,
  onClick: () => {},
  onOpenMenu: () => {}
};
