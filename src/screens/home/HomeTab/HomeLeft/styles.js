import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    homeLeftContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    dropdownContainer: {
      width: '100%',
      marginLeft: 20,
      paddingTop: 14,
      paddingRight: 14,
      paddingBottom: 14
    },
    listViewRoot: {
      width: '100%',
      height: '100%',
      position: 'relative'
    },
    content: {
      width: '100%',
      height: '100%',
      display: 'flex',
      position: 'relative',
      flexGrow: 1
    },
    layout: {
      zIndex: 1,
      position: 'absolute',
      backgroundColor: theme.palette.background.default,
      width: '100%',
      height: '100%',
      display: 'flex'
    },
    mainList: {
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'flex'
    },
    listSection: {
      backgroundColor: 'inherit'
    },
    ul: {
      backgroundColor: 'inherit',
      padding: 0
    },
    center: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex'
    },
  })
);
