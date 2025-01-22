import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { CONTACT_TYPES } from '../../configs/constant';
import { getItemFromArr } from '../../utils/array.utils';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import { CompanyIcon } from '../HanSVGIcon';
import { UserIcon } from '../HanSVGIcon';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  wrapperContactType: {
    width: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30
  },
  iconContactType: {
    fontSize: 20,
    marginRight: 7
  }
}));

export default function HanTypeContact(props) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const { type } = props;
  const item = getItemFromArr(CONTACT_TYPES.source, 'value', type);

  function renderIconContact() {
    switch (type) {
      case 'employee':
        return (
          <UserIcon
            style={{ color: item.color }}
            className={classes.iconContactType}
          />
        );
        break;
      case 'company':
        return (
          <CompanyIcon
            style={{ color: item.color }}
            className={classes.iconContactType}
          />
        );
        break;
      default:
        return (
          <PermContactCalendarIcon
            style={{ color: item.color }}
            className={classes.iconContactType}
          />
        );
    }
  }

  return (
    <div
      style={{ background: item.background }}
      className={classes.wrapperContactType}
    >
      {renderIconContact()}
      <span style={{ color: item.color }}>{t(item.title)}</span>
    </div>
  );
}

HanTypeContact.propTypes = {
  type: PropTypes.string
};

HanTypeContact.defaultProps = {
  type: 'contact'
};
