import {withStyles} from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import React from "react";

const CustomTabs = withStyles({
  indicator: {
    backgroundColor: '#0667BD',
    left: 0
  }
})(Tabs);
export default CustomTabs;
