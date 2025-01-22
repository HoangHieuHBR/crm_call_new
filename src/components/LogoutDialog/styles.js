import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    dialog: {
      width: '100%',
      flexDirection: 'column',
      display: 'flex'
    },
    contentTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      display: 'flex',
      padding: 4,
      paddingLeft: 8,
      backgroundColor:
        theme.palette.type == 'light'
          ? theme.palette.primary
          : theme.palette.divider
    },
    mainContent: {
      width: '100%',
      height: '100%',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      display: 'flex',
      borderTopColor: theme.palette.divider,
      borderBottomColor: theme.palette.divider,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderTopStyle: 'solid',
      borderBottomStyle: 'solid'
    },
    settingItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }
  })
);
