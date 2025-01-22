import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useStyles } from './styles';
import { PhoneIcon } from '../HanSVGIcon';

export { default as HanAssigned } from './HanAssigned';
const HanAvatar = props => {
  const { user, time, iconPhone } = props;
  const { userAvatar, userName, userCompany, userPhone } = user;
  const classes = useStyles();
  return (
    <div className={classes.wrapHanAvatar}>
      <img src={userAvatar} className={classes.imgAvatar} />
      <div className={classes.avatarInfo}>
        <div className={classes.sectionName}>
          <span className={classes.sectionMainName}>
            <span className={classes.avatarInfoName}>{userName}</span>
            {userCompany.length > 0 && (
              <span className={classes.avatarInfoCompany}>{userCompany}</span>
            )}
          </span>
        </div>
        <div className={classes.sectionPhone}>
          <span className={classes.phoneNumber}>
            {iconPhone && (
              <PhoneIcon style={{ fontSize: 15, marginRight: 10 }} />
            )}
            {userPhone}
          </span>
        </div>
        {time != '' && (
          <div className={classes.sectionTime}>
            <span className={classes.countTime}>{time} </span>
          </div>
        )}
      </div>
    </div>
  );
};

HanAvatar.propTypes = {
  iconPhone: PropTypes.bool,
  user: PropTypes.object,
  time: PropTypes.string
};
HanAvatar.defaultProps = {
  iconPhone: false,
  user: null,
  time: ''
};
export default HanAvatar;
