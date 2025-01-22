import React from 'react';
import PropTypes from 'prop-types';
import { useStyles } from './styles';
import HanDescriptionItem from './HanDescriptionItem';
import { PRIORITIES } from '../../configs/constant';

const HanDescriptionInfo = props => {
  const classes = useStyles();
  const { source } = props;

  const priorityName = PRIORITIES.source.find(
    item => item.value == source.priority
  );

  return (
    <ul className={classes.wrapperTask}>
      <li>
        <HanDescriptionItem label={'Subject'}>
          {source.subject}
        </HanDescriptionItem>
      </li>
      <li>
        <HanDescriptionItem label={'Priority'}>
          {priorityName?.title}
        </HanDescriptionItem>
      </li>
      <li>
        <HanDescriptionItem label={'Staff'}>
          {source.assigned}
        </HanDescriptionItem>
      </li>
      <li>
        <HanDescriptionItem label={'Phone'}>{source.phone}</HanDescriptionItem>
      </li>
      <li>
        <HanDescriptionItem label={'Content'}>
          {source.content}
        </HanDescriptionItem>
      </li>
    </ul>
  );
};

HanDescriptionInfo.propTypes = {
  source: PropTypes.object
};
HanDescriptionInfo.defaultProps = {
  source: []
};
export default HanDescriptionInfo;
