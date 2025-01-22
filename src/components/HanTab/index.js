import React, {Suspense, lazy} from 'react';
import PropTypes from 'prop-types';
import {TabPanel, LazyLoad, applyProps} from './ultils';
import CustomTabs from './CustomTabs';
import CustomTab from './CustomTab';
import {useStyles} from './styles';

const HanTab = props => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const {vertical, scrollable, source, widthDefaultTab, styleTab} = props;


  const propsTab = {};
  if (scrollable) propsTab.variant = 'scrollable';
  if (vertical) propsTab.orientation = 'vertical';
  if (styleTab) propsTab.style = styleTab;
  const orientationClasses = (vertical ? 'Vertical' : 'Horizontal');

  return (
    <div className={classes[`wrapperTab${orientationClasses}`]}>
      <CustomTabs
        {...propsTab}
        value={value}
        onChange={handleChange}
        className={classes[`tabs${orientationClasses}`]}
        textColor="primary"
      >
        {
          source.map((e, index) => {
            return (
              <CustomTab
                label={e.title}
                styles={{
                  minWidth: `${widthDefaultTab}px`,
                  width: `${widthDefaultTab}px`
                }}
                {...applyProps(index)}
              />
            );
          })
        }
      </CustomTabs>
      {source.map((e, index) => {
        return <TabPanel
          vertical={vertical}
          widthDefaultTab={widthDefaultTab}
          value={value}
          index={index}
          key={`tab-content-${index}`}>
          <LazyLoad component={e.component} {...props}/>
        </TabPanel>;
      })}
    </div>
  );
};


HanTab.propTypes = {
  styleTab: PropTypes.object,
  source: PropTypes.array,
  scrollable: PropTypes.bool,
  vertical: PropTypes.bool,
  widthDefaultTab: PropTypes.number
};
HanTab.defaultProps = {
  source: [],
  styleTab: null,
  scrollable: true,
  vertical: false,
  widthDefaultTab: 150
};

export default HanTab;
