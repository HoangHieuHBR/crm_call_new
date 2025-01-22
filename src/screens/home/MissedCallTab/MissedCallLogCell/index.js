import React, { useEffect } from 'react';
import { useStyles } from './styles';
import { CompanyTextTypography } from './component.styles';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Checkbox
} from '@material-ui/core';
import { IncomingIcon, OutGoingIcon } from '../../../../components/HanSVGIcon';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import PropTypes from 'prop-types';

export default function MissedCallLogCell(props) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const { data, style, onClick, onOpenMenu, checkedList } = props;

  useEffect(() => {
    setChecked(checkedList?.length > 0 ? checkedList.includes(data) : false);
  }, [checkedList]);

  const [checked, setChecked] = React.useState(false);

  const customer = data?.customer?.length > 0 ? data.customer[0] : null;
  const disable = data?.status == 1;
  const curTimeZone = data?.time_zone;

  const formatTimeWithTimeZone = (time, timezone) => {
    if (timezone) {
      return time && time != ''
        ? moment(time, 'YYYY-MM-DDTHH:mm:ssZ')
          .tz(timezone)
          .format('YYYY/MM/DD HH:mm:ss')
        : '';
    }
    return time && time != '' ? moment(time).format('YYYY/MM/DD HH:mm:ss') : '';
  };

  return (
    <ListItem
      className={classes.item}
      button
      // divider={true}
      selected={checked}
      onClick={disable ? null : onClick}
      style={style}
    >
      <Checkbox
        disabled={disable}
        checked={checked}
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
      <ListItemIcon>
        <Avatar alt={data?.customer_name} />
      </ListItemIcon>
      <ListItemText
        component={'div'}
        primary={
          <span className={classes.textUser}>
            {customer?.customer_name ?? ''}
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
              {customer?.parent_name ?? ''}
            </CompanyTextTypography>
          </span>
        }
        secondary={
          <React.Fragment>
            <span className={classes.containerPhone}>
              {data?.direction == 'in' ? (
                <IncomingIcon
                  style={{
                    color: '#EB2F2F',
                    width: 16,
                    height: 16
                  }}
                />
              ) : (
                <OutGoingIcon
                  style={{
                    color: '#EB2F2F',
                    width: 16,
                    height: 16
                  }}
                />
              )}
              <Typography
                variant="caption"
                color="error"
                className={classes.textPhone}
              >
                {customer?.customer_phone ?? ''}
              </Typography>
            </span>
          </React.Fragment>
        }
      />
      <div className={classes.contentRight}>
        <div
          className={
            data?.status != 0
              ? classes.textTypeConfirm
              : classes.textTypeUnConfirm
          }
        >
          <Typography variant="subtitle2" style={{ textAlign: 'center' }}>
            {data?.status != 0 ? t('Confirmed') : t('UnConfirmed')}
          </Typography>
        </div>

        <CompanyTextTypography
          variant="caption"
          color="textSecondary"
          className={classes.textTime}
        >
          {formatTimeWithTimeZone(data?.regdate, curTimeZone)}
        </CompanyTextTypography>
      </div>
    </ListItem>
  );
}

MissedCallLogCell.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
  checkedList: PropTypes.array,
  onClick: PropTypes.func,
  onOpenMenu: PropTypes.func
};

MissedCallLogCell.defaultProps = {
  data: {},
  style: {},
  checkedList: [],
  onClick: () => { },
  onOpenMenu: () => { }
};
