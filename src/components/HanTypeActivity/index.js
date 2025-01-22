import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { ACTIVITIES } from '../../configs/constant';
import { getItemFromArr } from '../../utils/array.utils';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  wrapperContactType: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    padding: '5px 10px',
    borderRadius: 4
  }
}));

export default function HanTypeActivity(props) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const { type } = props;
  const item = getItemFromArr(ACTIVITIES.source, 'value', type);
  return (
    <div
      style={{ background: item.background }}
      className={classes.wrapperContactType}
    >
      <span style={{ color: item.color }}>{t(item.title)}</span>
    </div>
  );
}

HanTypeActivity.propTypes = {
  type: PropTypes.string
};

HanTypeActivity.defaultProps = {
  type: 'contact'
};
