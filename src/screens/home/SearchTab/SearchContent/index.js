import React from 'react';
import { useStyles } from './styles';
import HanHistory from '../../../../components/HanHistory';

export default function SearchContent() {
  const classes = useStyles();

  return (
    <div className={classes.searchContentContainer}>
      <HanHistory isAutoSize={true} />
    </div>
  );
}
