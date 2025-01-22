import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    dialog: {
      height: 400,
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
      color: 'white'
    },
    mainContent: {
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      display: 'flex',
      borderTopColor: theme.palette.divider,
      borderBottomColor: theme.palette.divider,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderTopStyle: 'solid',
      borderBottomStyle: 'solid'
    },
    leftContent: {
      width: '30%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    rightContent: {
      width: '70%',
      height: '100%',
      display: 'flex',
      borderLeftColor: theme.palette.divider,
      borderLeftWidth: 1,
      borderLeftStyle: 'solid'
    },
    selectedLine: {
      width: 4,
      backgroundColor: theme.palette.primary.main,
      display: 'flex'
    },
    themeContent: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    settingItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16
    },
    formControl: {
      minWidth: 200
    },
    paddingInput: {
      padding: 8
    },
    lineTheme: {
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center'
    },
    iconTheme: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    settingItemCol: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flexStart',
      justifyContent: 'space-between',
      padding: 16
    },
    settingItemChild: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  })
);
