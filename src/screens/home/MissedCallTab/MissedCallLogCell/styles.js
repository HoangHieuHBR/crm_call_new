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
    textPhone: {
      marginLeft: 10
    },
    containerPhone: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    contentRight: {
      display: 'flex',
      flexDirection: 'row',
      marginRight: 20,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    },
    textTime: {
      display: 'block',
      whiteSpace: 'nowrap',
      fontSize: 11
    },
    textTypeConfirm: {
      width: 120,
      height: 30,
      marginRight: 70,
      display: 'flex',
      whiteSpace: 'nowrap',
      border: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
      borderStyle: 'solid',
      borderColor: '#0667BD'
    },
    textTypeUnConfirm: {
      width: 120,
      height: 30,
      marginRight: 70,
      display: 'flex',
      whiteSpace: 'nowrap',
      border: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#EB2F2F99',
      borderRadius: 15,
      borderColor: '#EB2F2F99'
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
