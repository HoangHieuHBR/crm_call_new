import React, {Suspense} from "react";
import PropTypes from "prop-types";

export const LazyLoad = ({component: Component, ...rest}) => {
  return <Suspense fallback=''>
    <Component {...rest} />
  </Suspense>
}

export function TabPanel(props) {
  const {children, value, index, vertical, widthDefaultTab, ...other} = props;
  let widthContent = '100%';
  if (vertical)
    widthContent = `calc(100% - ${widthDefaultTab}px)`
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{width: widthContent}}
    >
      {value === index && children}
    </div>
  );
}

export function applyProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
    key: `tab-${index}`,
    flex: 1
  };
}


TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};
