import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useStyles } from './styles';

const HanAssigned = props => {
  const { data, t, style } = props;
  const classes = useStyles();
  return (
    <div style={style}>
      <span className={classes.assignedTitle}>{t('Assigned')}</span>
      <span className={classes.assignedContent}>{data}</span>
    </div>
  );
};

HanAssigned.propTypes = {
  data: PropTypes.string,
  t: PropTypes.func
};
HanAssigned.defaultProps = {
  data: '...',
  t: v => v
};
export default HanAssigned;
