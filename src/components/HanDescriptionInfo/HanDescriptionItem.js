import React from 'react';
import PropTypes from 'prop-types';
import { useStyles } from './styles';

const HanDescriptionItem = props => {
  const classes = useStyles();
  const { children, label } = props;
  return (
    <div className={classes.itemDescription}>
      <span className={classes.itemDescriptionLabel}>{label}</span>
      <span style={{ width: 'calc(100% - 90px)' }}>{children}</span>
    </div>
  );
};
HanDescriptionItem.propTypes = {};
HanDescriptionItem.defaultProps = {};
export default HanDescriptionItem;
