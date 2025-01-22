import React from 'react';
import { useStyles } from './styles';
import { useTheme } from '@material-ui/core/styles';
import SplitPane from 'react-split-pane';
import { Box } from '@material-ui/core';

import HomeLeft from './HomeLeft';
import HomeContent from './HomeContent';

export default function HomeTab() {
  const classes = useStyles();
  const theme = useTheme();

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
          <HomeLeft />
        </Box>
      </div>
      <div className={classes.splitViewContentRight}>
        <Box height="100%" width="100%">
          <HomeContent />
        </Box>
      </div>
    </SplitPane>
  );
}
