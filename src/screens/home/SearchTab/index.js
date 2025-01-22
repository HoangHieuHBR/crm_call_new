import React, { useState } from 'react';
import { useStyles } from './styles';
import { useTheme } from '@material-ui/core/styles';
import SplitPane from 'react-split-pane';
import { Box } from '@material-ui/core';

import SearchLeft from './SearchLeft';
import { getParamsSearch } from '../../../utils/array.utils';
import HanHistory from '../../../components/HanHistory';

export default function SearchTab() {
  const classes = useStyles();
  const theme = useTheme();
  const [contentHistory, setContentHistory] = useState(null);
  const defSizePanel = localStorage.getItem('splitPos') ?? 450;
  return (
    <SplitPane
      minSize={250}
      maxSize={450}
      defaultSize={parseInt(defSizePanel)}
      onChange={size => {
        localStorage.setItem('splitPos', size);
      }}
      style={{
        position: 'relative',
        height: '100%',
        width: '100%'
      }}
      resizerStyle={{
        backgroundColor: theme.palette.divider,
        opacity: 1
      }}
    >
      <div className={classes.splitViewContentLeft}>
        <Box height="100%" width="100%">
          <SearchLeft
            onSearch={params => {
              if (contentHistory) contentHistory.onSearch(params);
            }}
          />
        </Box>
      </div>
      <div className={classes.splitViewContentRight}>
        <Box height="100%" width="100%">
          <div className={classes.searchContentContainer}>
            <HanHistory
              initParams={getParamsSearch()}
              isAutoSize={true}
              onRef={_item => setContentHistory(_item)}
            />
          </div>
        </Box>
      </div>
    </SplitPane>
  );
}
