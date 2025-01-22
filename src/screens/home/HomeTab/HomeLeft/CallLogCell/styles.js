import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    item: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 0,
      paddingLeft: 30
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
    textMessage: {
      display: 'block',
      maxWidth: 'calc(100% - 20px)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    contentRight: {
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 20,
      marginRight: 10,
      paddingBottom: 20,
      alignItems: 'flex-end',
      height: '100%'
    },
    textTime: {
      display: 'block',
      whiteSpace: 'nowrap',
      fontSize: 11,
      paddingBottom: 4
    },
    contentSelect: {
      width: 8,
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    selectedItem: {
      width: 4,
      height: '100%',
      backgroundColor: theme.palette.primary.main
    }
  })
);
