import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    searchLeftContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    searchContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      padding: 20,
      overflowY: 'auto'
    },
    dateContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    dateContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    contactContainer: {
      marginTop: 30,
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    namePhoneContainer: {
      marginTop: 18,
      width: '100%',
      display: 'flex',
      flexDirection: 'row'
    },
    companyCodeContainer: {
      marginTop: 28,
      width: '100%',
      display: 'flex',
      flexDirection: 'row'
    },
    historyContainer: {
      marginTop: 30,
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    historyContentContainer: {
      marginTop: 18,
      width: '100%',
      display: 'flex',
      flexDirection: 'row'
    },
    priorityActivityContainer: {
      marginTop: 30,
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    dropdownContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row'
    },
    buttonContainer: {
      width: '100%',
      marginTop: 20,
      padding: 20
    },
    textHint: {
      marginTop: 8,
      minWidth: 60
    },
    center: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex'
    }
  })
);
