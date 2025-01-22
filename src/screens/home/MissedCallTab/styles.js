import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    mainContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    rowFilterSelectContainer: {
      width: '100%',
      height: 65,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'center',
      borderBottom: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: theme.palette.divider,
      paddingLeft: 30,
      // paddingTop: 14,
      paddingRight: 20
      // paddingBottom: 14
    },
    textMessage: {
      flex: 1,
      display: 'block',
      maxWidth: 'calc(100% - 20px)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    dropdownContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'end',
      justifyContent: 'flex-end'
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

    contentLoadingMore: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  })
);
