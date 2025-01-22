import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    wrapHanAvatar: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 12
    },
    imgAvatar: {
      height: 38,
      width: 38,
      borderRadius: '50%',
      objectFit: 'cover',
      objectPosition: '50% 50%'
    },
    avatarInfo: {
      flex: 1,
      paddingLeft: 15,
      display: 'flex',
      flexDirection: 'column',
      width: 'calc(100% - 38px)'
    },
    avatarInfoName: {
      fontSize: 14,
      fontWeight: 'bold'
    },
    avatarInfoCompany: {
      paddingLeft: 20,
      color: '#606e79',
      position: 'relative',
      '&::before': {
        content: `''`,
        position: 'absolute',
        top: '50%',
        left: 10,
        width: 4,
        height: 4,
        background: '#606e79',
        borderRadius: '50%'
      }
    },
    assignedTitle: {
      marginRight: 10,
      fontSize: 12
    },
    assignedContent: {
      color: '#606e79',
      fontSize: 12
    },
    sectionName: {
      marginBottom: 5
    },
    sectionMainName: {
      display: 'block',
      width: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    sectionPhone: {
      marginBottom: 5
    },
    phoneNumber: {
      fontSize: 12
    },
    countTime: {
      color: '#0C8E36',
      background: '#0C8E361A',
      fontSize: 10,
      borderRadius: 15,
      padding: '3px 10px'
    }
  })
);
