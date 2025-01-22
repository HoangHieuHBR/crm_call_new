import {fade, makeStyles, createStyles, withStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      flexGrow: 1
    },
    sectionSearch: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      height: 60,
      paddingRight: 10,
      paddingLeft: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    sectionTree: {
      height: 'calc(50% - 30px)',
      width: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingLeft: 10,
      paddingRight: 10
    },
    sectionListSelected: {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
    nodeTree: {
      display: 'flex',
      alignItems: 'center'
    },
    titleNode: {
      marginLeft: 10
    },
    listUsers: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    },
    itemUser: {
      float: 'left',
      margin: '1px 3px',
      padding: 5,
      background: '#0667BD1A',
      borderRadius: theme.shape.borderRadius,
      color: '#0667BD'
    }

  })
);
