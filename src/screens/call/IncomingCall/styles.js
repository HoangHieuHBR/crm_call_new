import { createStyles, makeStyles } from '@material-ui/core/styles';

const flexCenter = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};
export const useStyles = makeStyles(theme =>
  createStyles({
    dialog: {
      paddingTop: 15,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      overflow: 'hidden'
    },
    dialogHeader: {
      width: '100%',
      ...flexCenter
    },
    dialogHeaderText: {
      fontSize: 14,
      padding: 15
    },
    dialogInfo: {
      padding: 15,
      background: '#EFF1F96B'
    },
    dialogFooter: {
      width: '100%',
      display: 'flex',
      padding: '12px 15px'
    }
  })
);
