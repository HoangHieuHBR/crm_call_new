import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

const HanTextField = withStyles(theme => ({
  multiline: {
    padding: 0
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '7px 10px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  }
}))(props => {
  const style = props?.customstyle
    ? props?.customstyle
    : { width: '100%', flex: 1 };

  return <InputBase {...props} variant="outlined" style={style} />;
});
export default HanTextField;
