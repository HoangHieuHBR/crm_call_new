import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      width: '100%',
      height: '100%'
    },
    mainContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    headerContainer: {
      height: 61,
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: theme.palette.type == 'light' ? '#EFF1F9' : '#333333',
      borderBottom: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: theme.palette.divider
    },
    contentContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: theme.palette.type == 'light' ? '#EFF1F9' : '#333333'
    },
    avatar: {
      padding: 20,
      display: 'flex'
    },
    textUser: {
      display: 'flex',
      maxWidth: 'calc(100% - 20px)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    textCompany: {
      display: 'flex',
      maxWidth: 'calc(100% - 20px)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      paddingLeft: 5
    },
    center: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex'
    },
    mainList: {
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'flex'
    }
  })
);
