import {withStyles} from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import React from "react";

const CustomTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightMedium,
    '&:hover': {
      backgroundColor: '#0667BD1A'
    },
    '&$selected': {
      textAlign: 'left',
      color: theme.palette.text.default,
      fontWeight: theme.typography.fontWeightMedium,
      backgroundColor: '#0667BD80'
    },
    // '&:focus': {
    //   backgroundColor: '#40a9ff'
    // },
    '&$indicator': {
      width: 10
    }
  },
  selected: {}
}))(props => {
  const {styles} = props
  return <Tab disableRipple {...props} style={styles}/>
});
export default CustomTab;
