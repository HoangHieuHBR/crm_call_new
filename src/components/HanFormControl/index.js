import React from 'react';
import PropTypes from 'prop-types';
import { useStyles } from './styles';

const HanFormControl = props => {
  const classes = useStyles();
  const { label, children, noMargin } = props;
  return (
    <div className={noMargin ? classes.formGroupNoMargin : classes.formGroup}>
      <label className={classes.formLabel}>{label}</label>
      <div className={classes.formChildren}>{children}</div>
    </div>
  );
};

HanFormControl.propTypes = {
  label: PropTypes.string
};
HanFormControl.defaultProps = {
  label: ''
};

export default HanFormControl;
