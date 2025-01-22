import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    trHistory: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      height: 48,
      paddingLeft: 16,
      paddingRight: 16
    },
    thHistory: {
      display: 'flex',
      alignItems: 'center',
      // justifyContent: 'center',
      fontSize: 12,

      color: '#8A9EAD'
    },
    thHistoryCenter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      color: '#8A9EAD'
    },
    wrapperHistory: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%'
    },
    sectionActivity: {
      textTransform: 'capitalize',
      display: 'flex',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      color: '#0C8E36',
      fontSize: 12
    },
    sectionStaff: {
      paddingLeft: 5,
      paddingRight: 5,
      height: 50,
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'center',
      color: '#1E4E83'
    },
    sectionNameStaff: {
      textTransform: 'capitalize',

      fontSize: 12,
      marginLeft: 5,
      flex: 1
    },
    sectionSubject: {
      minWidth: 0,
      height: 50,
      paddingLeft: 10
    },
    sectionContentSubject: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineClamp: 3,
      boxOrient: 'vertical'
    },
    center: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex'
    }
  })
);
