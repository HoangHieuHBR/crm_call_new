import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    wrapperCallComing: {
      padding: 0,
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'row'
    },
    wrapperCallContent: {
      padding: 0,
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    sectionDuration: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    wrapperCallInfo: {
      flex: 1
    },
    contentTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      display: 'flex',
      padding: 4,
      paddingLeft: 8,
      color: 'white',
      backgroundColor:
        theme.palette.type == 'light'
          ? theme.palette.primary
          : theme.palette.divider
    },
    sectionCallComing: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      padding: 20
    },
    sectionHistory: {
      borderLeft: `1px solid ${theme.palette.divider}`
    },
    //Add user
    wrapperContent: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 4,
      padding: '10px 20px 0',
      margin: '10px 10px 0'
    },
    addUserContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    // General Tab
    // wrapperGeneralTab: {
    //   width: '100%',
    //   height: '100%',
    //   display: 'flex',
    //   flexDirection: 'column'
    // },
    // sectionContentGeneral: {
    //   flex: 1,
    //   paddingLeft: 20,
    //   paddingRight: 20
    // },
    sectionCallComingControl: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10
    },
    wrapperAddTaskTicket: {
      display: 'flex',
      height: 550
    },
    sectionTree: {
      width: 400
    },
    sectionTaskTicket: {
      width: 'calc(100% - 400px)',
      borderLeft: `1px solid ${theme.palette.divider}`,
      padding: 20
    },
    titleAsigned: {
      fontWeight: theme.typography.fontWeightMedium,
      fontSize: 14
    },
    contactModalFooter: {
      display: 'flex',
      width: '100%',
      justifyContent: 'end',
      flexDirection: 'row',
      alignItems: 'center',
      height: 55
    },
    historyRefresh: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      height: 48,
      display: 'flex',
      width: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    sectionHistoryContent: {
      position: 'relative',
      width: '100%',
      height: 'calc(100% - 50px)'
    }
  })
);
