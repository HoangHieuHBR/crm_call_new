import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    dialogContainer: {
      padding: 0,
      background:
        theme.palette.type == 'light' ? '#286fb5' : theme.palette.primary
    },
    dialogAction: {
      background:
        theme.palette.type == 'light' ? '#286fb5' : theme.palette.divider,
      justifyContent: 'center'
    },
    dialog: {
      width: '100%',
      flexDirection: 'column',
      display: 'flex'
    },
    contentTitle: {
      paddingBottom: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      color: 'white'
    },
    mainContent: {
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      display: 'flex',
      borderTopColor: theme.palette.divider,
      borderBottomColor: theme.palette.divider,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderTopStyle: 'solid',
      borderBottomStyle: 'solid',
      padding: 16
    }
  })
);
