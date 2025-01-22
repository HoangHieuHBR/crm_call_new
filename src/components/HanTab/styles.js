import {createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    wrapperTabVertical: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      height: '100%',

    },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
      height: '100%'
    },
    wrapperTabHorizontal: {
      backgroundColor: theme.palette.background.paper,
      height: '100%'
    },
    tabsVertical: {
      borderRight: `1px solid ${theme.palette.divider}`,
      // height: '100%'
    },
    tabsHorizontal: {
      // borderRight: `1px solid ${theme.palette.divider}`,
      // height: '100%'
    }
  })
);
