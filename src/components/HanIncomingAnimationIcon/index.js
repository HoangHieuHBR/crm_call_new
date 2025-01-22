import React, {useState} from "react";
import PropTypes from "prop-types";
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';
import {useStyles} from './styles';

const HanIncomingAnimationIcon = props => {
  const classes = useStyles();
  return <div className={classes.wrapIconLv2}>
    <div className={classes.wrapIconLv1}>
      <div className={classes.wrapIcon}>
        <PhoneCallbackIcon style={{color: 'white', fontSize: 15}}/>
      </div>
    </div>
  </div>
};

HanIncomingAnimationIcon.propTypes = {};
HanIncomingAnimationIcon.defaultProps = {};
export default HanIncomingAnimationIcon;


